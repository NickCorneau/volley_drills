/**
 * Write-side session commands: create, save, discard, swap, expire
 * sweep, user-skip. All persistence; pure state transitions live in
 * `domain/executionState.ts`.
 */
import { db, requestPersistentStorage } from '../../db'
import type {
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionPlanBlock,
  SessionPlanSafetyCheck,
  SessionReview,
} from '../../db'
import { endedAt, isTerminalSession } from '../../domain/executionPredicates'
import { buildEndedSession } from '../../domain/executionState'
import { FINISH_LATER_CAP_MS } from '../../domain/policies'
import { expireReview } from '../review'
import { clearSoftBlockDismissed } from '../softBlock'
import { clearTimerState } from '../timer'

// V0B-25 / D118: request persistent storage on a user-gesture save
// boundary. WebKit grants persistence heuristically and responds better
// to gesture-bound calls.
function requestPersistentStorageOnGesture(): void {
  void requestPersistentStorage()
}

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
    assemblySeed: draft.assemblySeed,
    assemblyAlgorithmVersion: draft.assemblyAlgorithmVersion,
    blocks: draft.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      drillId: b.drillId,
      variantId: b.variantId,
      drillName: b.drillName,
      shortName: b.shortName,
      durationMinutes: b.durationMinutes,
      coachingCue: b.coachingCue,
      courtsideInstructions: b.courtsideInstructions,
      required: b.required,
      rationale: b.rationale,
      subBlockIntervalSeconds: b.subBlockIntervalSeconds,
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

  // Phase F Unit 2 / D122: persist `lastPlayerMode` voice signal
  // atomically with the session-create so it cannot diverge from
  // the plan's playerCount.
  const lastPlayerMode: 'solo' | 'pair' = plan.playerCount === 1 ? 'solo' : 'pair'
  const playerModeStamp = now

  await db.transaction(
    'rw',
    db.sessionPlans,
    db.executionLogs,
    db.sessionDrafts,
    db.storageMeta,
    async () => {
      await db.sessionPlans.put(plan)
      await db.executionLogs.put(execution)
      await db.sessionDrafts.delete('current')
      await db.storageMeta.put({
        key: 'lastPlayerMode',
        value: lastPlayerMode,
        updatedAt: playerModeStamp,
      })
    },
  )
  requestPersistentStorageOnGesture()
  return execId
}

export async function saveDraft(draft: SessionDraft): Promise<void> {
  await db.sessionDrafts.put(draft)
}

export async function clearDraft(): Promise<void> {
  await db.sessionDrafts.delete('current')
}

export async function saveExecution(updated: ExecutionLog): Promise<void> {
  await db.executionLogs.put(updated)
}

export async function discardSession(exec: ExecutionLog): Promise<void> {
  const updated = buildEndedSession(exec, 'discarded_resume')
  await db.executionLogs.put(updated)
  await clearTimerState()
}

/**
 * Phase F Unit 4: mid-run Swap divergence writer. Replaces the active
 * plan block and increments `execution.swapCount` inside a single rw
 * transaction so the UI never sees a mismatched plan/counter state.
 *
 * Caller contract (see `useSessionRunner.swapBlock`): `nextBlock` MUST
 * come from `findSwapAlternatives` so drill identity invariants hold.
 */
export async function swapActiveBlock(
  execution: ExecutionLog,
  plan: SessionPlan,
  nextBlock: SessionPlanBlock,
): Promise<{ updatedExecution: ExecutionLog; updatedPlan: SessionPlan }> {
  const updatedBlocks = [...plan.blocks]
  updatedBlocks[execution.activeBlockIndex] = nextBlock
  const updatedPlan: SessionPlan = { ...plan, blocks: updatedBlocks }
  const updatedExecution: ExecutionLog = {
    ...execution,
    swapCount: (execution.swapCount ?? 0) + 1,
  }
  await db.transaction('rw', db.sessionPlans, db.executionLogs, async () => {
    await db.sessionPlans.put(updatedPlan)
    await db.executionLogs.put(updatedExecution)
  })
  return { updatedExecution, updatedPlan }
}

/**
 * Auto-finalize any terminal session whose 2 h Finish Later cap elapsed
 * without a review. Idempotent; safe to call on every home resolve.
 *
 * Per-record try/catch (rel-6): one corrupted record must not abort the
 * whole sweep.
 */
export async function expireStaleReviews(now: number = Date.now()): Promise<number> {
  const logs = await db.executionLogs.toArray()
  const terminal = logs.filter(isTerminalSession)
  const finalizedIds = new Set(
    (await db.sessionReviews.toArray())
      .filter((r) => r.status !== 'draft')
      .map((r) => r.executionLogId),
  )
  let expired = 0
  for (const exec of terminal) {
    if (finalizedIds.has(exec.id)) continue
    if (now - endedAt(exec) < FINISH_LATER_CAP_MS) continue
    try {
      await expireReview({ executionLogId: exec.id, now })
      expired += 1
    } catch (err) {
      console.error(`expireStaleReviews: failed to expire ${exec.id}; continuing sweep`, err)
    }
  }
  return expired
}

/**
 * User-initiated review skip from the home pending-review prompt.
 * Writes a terminal `skipped` stub; kept distinct from `expireReview`
 * via the `'skipped'` quickTag so exports can tell them apart.
 */
export async function skipReview(executionId: string): Promise<void> {
  const now = Date.now()
  const exec = await db.executionLogs.get(executionId)
  const endAt = exec ? endedAt(exec) : now
  const captureDelaySeconds = Math.max(0, Math.round((now - endAt) / 1_000))
  const stub: SessionReview = {
    id: `review-${executionId}`,
    executionLogId: executionId,
    sessionRpe: null,
    goodPasses: 0,
    totalAttempts: 0,
    quickTags: ['skipped'],
    shortNote: 'Review skipped from home screen',
    submittedAt: now,
    captureDelaySeconds,
    captureWindow: 'expired',
    eligibleForAdaptation: false,
    status: 'skipped',
  }

  await db.transaction('rw', db.sessionReviews, db.storageMeta, async (tx) => {
    const reviews = tx.table<SessionReview, string>('sessionReviews')
    const existing = await reviews.where('executionLogId').equals(executionId).first()
    if (existing && (existing.status === 'submitted' || existing.status === 'skipped')) {
      return
    }
    await reviews.put(stub)
    await clearSoftBlockDismissed(executionId, tx)
  })
}
