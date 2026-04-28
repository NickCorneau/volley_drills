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
import { applyBlockOverrides } from '../../domain/sessionProjection'
import { defaultParticipantsForPlayerCount } from '../../domain/sessionParticipants'
import { expireReview } from '../review'
import { clearSoftBlockDismissed } from '../softBlock'
import { clearTimerState } from '../timer'
import { getTerminalExecutionLogs } from './logSelectors'

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

  const playerCount: SessionPlan['playerCount'] = draft.context.playerMode === 'solo' ? 1 : 2
  const plan: SessionPlan = {
    id: planId,
    presetId: draft.archetypeId,
    presetName: draft.archetypeName,
    playerCount,
    // U6 seam (`D115`/`D116`/`D117`): every new plan persists the
    // participants array so future readers can drop `playerCount`.
    // Derived from the same input that drives `playerCount` so the
    // `participants.length === playerCount` invariant is true by
    // construction.
    participants: defaultParticipantsForPlayerCount(playerCount),
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
 * Phase F Unit 4: mid-run Swap divergence writer. Records an active
 * block override and increments `execution.swapCount` inside a single
 * rw transaction so the UI never sees a mismatched override/counter state.
 *
 * Caller contract (see `useSessionRunner.swapBlock`): `nextBlock` MUST
 * come from `findSwapAlternatives` so drill identity invariants hold.
 */
export async function swapActiveBlock(
  execution: ExecutionLog,
  plan: SessionPlan,
  nextBlock: SessionPlanBlock,
): Promise<{ updatedExecution: ExecutionLog; updatedPlan: SessionPlan }> {
  const updatedExecution: ExecutionLog = {
    ...execution,
    blockOverrides: {
      ...(execution.blockOverrides ?? {}),
      [execution.activeBlockIndex]: nextBlock,
    },
    swapCount: (execution.swapCount ?? 0) + 1,
  }
  await db.transaction('rw', db.executionLogs, async () => {
    await db.executionLogs.put(updatedExecution)
  })
  return { updatedExecution, updatedPlan: applyBlockOverrides(plan, updatedExecution) }
}

/**
 * Auto-finalize any terminal session whose 2 h Finish Later cap elapsed
 * without a review. Idempotent; safe to call on every home resolve.
 *
 * Per-record try/catch (rel-6): one corrupted record must not abort the
 * whole sweep.
 */
export async function expireStaleReviews(now: number = Date.now()): Promise<number> {
  const logs = await getTerminalExecutionLogs()
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
 *
 * Draft payload preservation (red-team adversarial parity, 2026-04-27):
 * mirrors `expireReview`'s behavior. When the user has already entered
 * RPE, per-drill captures, an incomplete reason, or a note before
 * tapping Skip, those values are CARRIED through onto the skipped stub
 * instead of being overwritten with zeros. The skip is a UX decision
 * about whether the *Review* surface should re-prompt; it is not a
 * decision to discard already-captured drill-grain signal. Without
 * this, a user who completed `/run/check` taps for several blocks and
 * then skipped the final Review would silently destroy their per-drill
 * Difficulty + Good/Total data on the way out. The `'skipped'` quickTag
 * stays exclusive to this path so exports and the adaptation engine
 * can still distinguish user-initiated skip from auto-expire.
 */
export async function skipReview(executionId: string): Promise<void> {
  const now = Date.now()
  const exec = await db.executionLogs.get(executionId)
  const endAt = exec ? endedAt(exec) : now
  const captureDelaySeconds = Math.max(0, Math.round((now - endAt) / 1_000))

  await db.transaction('rw', db.sessionReviews, db.storageMeta, async (tx) => {
    const reviews = tx.table<SessionReview, string>('sessionReviews')
    const existing = await reviews.where('executionLogId').equals(executionId).first()
    if (existing && (existing.status === 'submitted' || existing.status === 'skipped')) {
      return
    }

    const draft = existing && existing.status === 'draft' ? existing : null
    const existingTags = draft?.quickTags ?? []
    const quickTags = existingTags.includes('skipped') ? existingTags : [...existingTags, 'skipped']

    const stub: SessionReview = {
      id: `review-${executionId}`,
      executionLogId: executionId,
      sessionRpe: draft?.sessionRpe ?? null,
      goodPasses: draft?.goodPasses ?? 0,
      totalAttempts: draft?.totalAttempts ?? 0,
      drillScores: draft?.drillScores,
      perDrillCaptures: draft?.perDrillCaptures,
      borderlineCount: draft?.borderlineCount,
      incompleteReason: draft?.incompleteReason,
      quickTags,
      shortNote: draft?.shortNote ?? 'Review skipped from home screen',
      submittedAt: now,
      captureDelaySeconds,
      captureWindow: 'expired',
      eligibleForAdaptation: false,
      status: 'skipped',
    }
    await reviews.put(stub)
    await clearSoftBlockDismissed(executionId, tx)
  })
}
