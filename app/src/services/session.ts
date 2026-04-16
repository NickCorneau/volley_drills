import { db, requestPersistentStorage } from '../db'
import type {
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionPlanSafetyCheck,
} from '../db'
import { buildPresetBlocks, PRESETS } from '../domain/presets'
import { clearTimerState, readTimerState } from './timer'

// V0B-25 / D118: request persistent storage on a real user-gesture save
// boundary instead of at module load. WebKit grants persistence heuristically
// and responds better to gesture-bound calls; session creation is the first
// meaningful save boundary and always runs once per session. Fire-and-forget
// because `requestPersistentStorage` already wraps errors and returns `false`
// when the API is missing or rejected. See
// `docs/research/local-first-pwa-constraints.md`.
function requestPersistentStorageOnGesture(): void {
  void requestPersistentStorage()
}

// --- Query / load ---

export interface ResumableSession {
  execution: ExecutionLog
  plan: SessionPlan
  interruptedAt: number
}

export async function findResumableSession(): Promise<ResumableSession | null> {
  const logs = await db.executionLogs.toArray()
  const resumable = logs
    .filter(
      (l) =>
        l.status === 'not_started' ||
        l.status === 'in_progress' ||
        l.status === 'paused',
    )
    .sort((a, b) => b.startedAt - a.startedAt)
  const exec = resumable[0]
  if (!exec) return null

  const plan = await db.sessionPlans.get(exec.planId)
  if (!plan) {
    await orphanExecution(exec)
    return null
  }

  if (exec.activeBlockIndex >= plan.blocks.length) {
    await db.executionLogs.put(buildEndedSession(exec, 'resume_out_of_bounds'))
    return null
  }

  const timer = await readTimerState()
  const interruptedAt =
    exec.pausedAt ??
    (timer?.executionLogId === exec.id ? timer.lastFlushedAt : undefined) ??
    exec.startedAt

  return { execution: exec, plan, interruptedAt }
}

export async function loadSession(
  execId: string,
): Promise<{ execution: ExecutionLog; plan: SessionPlan | null } | null> {
  const execution = await db.executionLogs.get(execId)
  if (!execution) return null
  const plan = (await db.sessionPlans.get(execution.planId)) ?? null
  return { execution, plan }
}

// --- Create / discard ---

export interface CreateSessionParams {
  presetId: string
  playerCount: 1 | 2
  useRecovery: boolean
  painFlag: boolean
  trainingRecency?: string
  heatCta: boolean
  painOverridden: boolean
}

export async function createSession(
  params: CreateSessionParams,
): Promise<string> {
  const preset = PRESETS.find((p) => p.id === params.presetId)
  const allBlocks = buildPresetBlocks(params.presetId)
  const recoveryBlocks = allBlocks.filter((b) => b.type !== 'main_skill')
  const blocks = params.useRecovery ? recoveryBlocks : allBlocks

  const planId = crypto.randomUUID()
  const execId = crypto.randomUUID()
  const now = Date.now()

  const safetyCheck: SessionPlanSafetyCheck = {
    painFlag: params.painFlag,
    trainingRecency: params.trainingRecency,
    heatCta: params.heatCta,
    painOverridden: params.painOverridden,
  }

  const plan: SessionPlan = {
    id: planId,
    presetId: params.presetId,
    presetName: params.useRecovery
      ? 'Lighter Technique Session'
      : (preset?.name ?? 'Session'),
    playerCount: params.playerCount,
    blocks: blocks.map((b) => ({
      id: b.id,
      type: b.type,
      drillName: b.drillName,
      shortName: b.shortName,
      durationMinutes: b.durationMinutes,
      coachingCue: b.coachingCue,
      courtsideInstructions: b.courtsideInstructions,
      required: b.required,
    })),
    safetyCheck,
    createdAt: now,
  }

  const execution: ExecutionLog = {
    id: execId,
    planId,
    status: 'not_started',
    activeBlockIndex: 0,
    blockStatuses: blocks.map((b) => ({
      blockId: b.id,
      status: 'planned' as const,
    })),
    startedAt: now,
  }

  await db.transaction('rw', db.sessionPlans, db.executionLogs, async () => {
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(execution)
  })
  requestPersistentStorageOnGesture()
  return execId
}

// --- Draft-based session creation (v0b) ---

export interface CreateSessionFromDraftParams {
  draft: SessionDraft
  painFlag: boolean
  trainingRecency?: string
  heatCta: boolean
  painOverridden: boolean
}

export async function createSessionFromDraft(
  params: CreateSessionFromDraftParams,
): Promise<string> {
  const { draft } = params
  const planId = crypto.randomUUID()
  const execId = crypto.randomUUID()
  const now = Date.now()

  const safetyCheck: SessionPlanSafetyCheck = {
    painFlag: params.painFlag,
    trainingRecency: params.trainingRecency,
    heatCta: params.heatCta,
    painOverridden: params.painOverridden,
  }

  const plan: SessionPlan = {
    id: planId,
    presetId: draft.archetypeId,
    presetName: draft.archetypeName,
    playerCount: draft.context.playerMode === 'solo' ? 1 : 2,
    blocks: draft.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      drillName: b.drillName,
      shortName: b.shortName,
      durationMinutes: b.durationMinutes,
      coachingCue: b.coachingCue,
      courtsideInstructions: b.courtsideInstructions,
      required: b.required,
    })),
    safetyCheck,
    context: draft.context,
    createdAt: now,
  }

  const execution: ExecutionLog = {
    id: execId,
    planId,
    status: 'not_started',
    activeBlockIndex: 0,
    blockStatuses: draft.blocks.map((b) => ({
      blockId: b.id,
      status: 'planned' as const,
    })),
    startedAt: now,
  }

  await db.transaction(
    'rw',
    db.sessionPlans,
    db.executionLogs,
    db.sessionDrafts,
    async () => {
      await db.sessionPlans.put(plan)
      await db.executionLogs.put(execution)
      await db.sessionDrafts.delete('current')
    },
  )
  requestPersistentStorageOnGesture()
  return execId
}

// --- Review-pending query (v0b) ---

export interface PendingReview {
  executionId: string
  planName: string
  completedAt: number
}

export async function findPendingReview(): Promise<PendingReview | null> {
  const logs = await db.executionLogs.toArray()
  const terminal = logs.filter(
    (l) => l.status === 'completed' || l.status === 'ended_early',
  )

  const reviewedIds = new Set(
    (await db.sessionReviews.toArray()).map((r) => r.executionLogId),
  )

  const unreviewed = terminal
    .filter((l) => !reviewedIds.has(l.id))
    .sort((a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt))

  const exec = unreviewed[0]
  if (!exec) return null

  const plan = await db.sessionPlans.get(exec.planId)
  return {
    executionId: exec.id,
    planName: plan?.presetName ?? 'Session',
    completedAt: exec.completedAt ?? exec.startedAt,
  }
}

export async function skipReview(executionId: string): Promise<void> {
  const now = Date.now()
  await db.sessionReviews.put({
    id: crypto.randomUUID(),
    executionLogId: executionId,
    sessionRpe: -1,
    goodPasses: 0,
    totalAttempts: 0,
    quickTags: ['skipped'],
    shortNote: 'Review skipped from home screen',
    submittedAt: now,
  })
}

// --- Draft persistence helpers ---

export async function getCurrentDraft(): Promise<SessionDraft | null> {
  return (await db.sessionDrafts.get('current')) ?? null
}

export async function saveDraft(draft: SessionDraft): Promise<void> {
  await db.sessionDrafts.put(draft)
}

export async function clearDraft(): Promise<void> {
  await db.sessionDrafts.delete('current')
}

export async function getLastContext(): Promise<SessionPlan['context'] | null> {
  const plans = await db.sessionPlans.toArray()
  if (plans.length === 0) return null
  plans.sort((a, b) => b.createdAt - a.createdAt)
  return plans.find((plan) => plan.context != null)?.context ?? null
}

async function orphanExecution(exec: ExecutionLog): Promise<void> {
  const updated = buildEndedSession(exec, 'missing_plan')
  await db.executionLogs.put(updated)
  await clearTimerState()
}

export async function discardSession(exec: ExecutionLog): Promise<void> {
  const updated = buildEndedSession(exec, 'discarded_resume')
  await db.executionLogs.put(updated)
  await clearTimerState()
}

// --- Persist ---

export async function saveExecution(updated: ExecutionLog): Promise<void> {
  await db.executionLogs.put(updated)
}

// --- Duration computation ---

export function computeActualDurationMinutes(
  exec: ExecutionLog,
  plan: SessionPlan,
  currentBlockElapsedSeconds?: number,
): number {
  let totalSeconds = 0
  const len = Math.min(exec.blockStatuses.length, plan.blocks.length)
  for (let i = 0; i < len; i++) {
    if (exec.blockStatuses[i].status === 'completed') {
      totalSeconds += plan.blocks[i].durationMinutes * 60
    }
  }
  // Guard against non-finite, negative, or absurdly large timer inputs that
  // would otherwise persist NaN / bogus minutes on ExecutionLog.actualDurationMinutes
  // and corrupt downstream adaptation-rules load math (docs/specs/m001-adaptation-rules.md).
  if (
    currentBlockElapsedSeconds !== undefined &&
    Number.isFinite(currentBlockElapsedSeconds) &&
    currentBlockElapsedSeconds > 0
  ) {
    const activeIdx = exec.activeBlockIndex
    const activePlannedSeconds =
      activeIdx >= 0 && activeIdx < plan.blocks.length
        ? plan.blocks[activeIdx].durationMinutes * 60
        : Infinity
    // Cap partial time at the active block's planned duration so a stale or
    // runaway timer can never inflate the session total beyond one full block.
    totalSeconds += Math.min(currentBlockElapsedSeconds, activePlannedSeconds)
  }
  return Math.round((totalSeconds / 60) * 10) / 10
}

// --- Pure state builders (no DB, no side effects) ---

export function buildStartedBlock(
  exec: ExecutionLog,
  plan: SessionPlan,
): ExecutionLog | null {
  const idx = exec.activeBlockIndex
  if (idx >= plan.blocks.length) return null
  if (exec.blockStatuses[idx]?.status === 'in_progress') return null

  const now = Date.now()
  const blockStatuses = [...exec.blockStatuses]
  blockStatuses[idx] = {
    ...blockStatuses[idx],
    status: 'in_progress',
    startedAt: now,
  }

  return {
    ...exec,
    status: 'in_progress',
    blockStatuses,
    startedAt: exec.startedAt || now,
    pausedAt: undefined,
  }
}

export function buildPausedExecution(exec: ExecutionLog): ExecutionLog {
  return { ...exec, status: 'paused', pausedAt: Date.now() }
}

export function buildResumedExecution(exec: ExecutionLog): ExecutionLog {
  return { ...exec, status: 'in_progress', pausedAt: undefined }
}

export function buildAdvancedBlock(
  exec: ExecutionLog,
  plan: SessionPlan,
  status: 'completed' | 'skipped',
): { execution: ExecutionLog; isLast: boolean } {
  const idx = exec.activeBlockIndex
  const now = Date.now()
  const blockStatuses = [...exec.blockStatuses]
  blockStatuses[idx] = { ...blockStatuses[idx], status, completedAt: now }

    const nextIdx = idx + 1
    const isLast = nextIdx >= plan.blocks.length

    return {
      execution: {
        ...exec,
        activeBlockIndex: nextIdx,
        blockStatuses,
        status: isLast ? 'completed' : (exec.status === 'paused' ? 'in_progress' : exec.status),
        completedAt: isLast ? now : undefined,
        pausedAt: isLast ? exec.pausedAt : undefined,
      },
      isLast,
    }
  }

export function buildEndedSession(
  exec: ExecutionLog,
  reason?: string,
): ExecutionLog {
  const now = Date.now()
  const blockStatuses = exec.blockStatuses.map((bs, i) => {
    if (i === exec.activeBlockIndex && bs.status === 'in_progress') {
      return { ...bs, status: 'skipped' as const, completedAt: now }
    }
    if (i >= exec.activeBlockIndex && bs.status === 'planned') {
      return { ...bs, status: 'skipped' as const }
    }
    return bs
  })
  return {
    ...exec,
    status: 'ended_early',
    blockStatuses,
    completedAt: now,
    endedEarlyReason: reason,
  }
}
