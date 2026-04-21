import { db, requestPersistentStorage } from '../db'
import type {
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionPlanBlock,
  SessionPlanSafetyCheck,
  SessionReview,
} from '../db'
import { expireReview, FINISH_LATER_CAP_MS } from './review'
import { clearSoftBlockDismissed } from './softBlock'
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
      // Tier 1a Unit 4: rationale rides from draft onto plan so
      // RunScreen's Chosen-because line has a surface to read from.
      // Left undefined for legacy draft paths that don't populate it.
      rationale: b.rationale,
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

  // Phase F Unit 2 (2026-04-19): persist the voice signal alongside
  // the plan + execution write so `SkillLevelScreen` can swap to solo
  // copy on a returning tester's next onboarding pass. Atomically
  // included in the session-create transaction so the signal cannot
  // diverge from the plan's `playerCount`. See
  // `docs/specs/m001-phase-c-ux-decisions.md` Surface 1 (D-C4 Phase F
  // amendment) and `docs/decisions.md` D122.
  const lastPlayerMode: 'solo' | 'pair' =
    plan.playerCount === 1 ? 'solo' : 'pair'
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

// --- Review-pending query (v0b) ---

export interface PendingReview {
  executionId: string
  planName: string
  completedAt: number
  /** ms remaining inside the 2 h Finish Later cap. Always > 0 here. */
  deferralRemainingMs: number
}

/**
 * Find the newest terminal (`completed | ended_early`) session that has no
 * review and is still inside the 2 h Finish Later cap (V0B-31 / D120).
 *
 * Sessions past the cap are NOT returned; call `expireStaleReviews()` first
 * to auto-finalize them so the home state falls through to `LastComplete`.
 */
export async function findPendingReview(
  now: number = Date.now(),
): Promise<PendingReview | null> {
  const logs = await db.executionLogs.toArray()
  // A1 + A8: terminal, non-discarded-resume sessions only.
  const terminal = logs.filter(
    (l) =>
      (l.status === 'completed' || l.status === 'ended_early') &&
      l.endedEarlyReason !== 'discarded_resume',
  )

  // A1: build reviewedIds from TERMINAL reviews only. A draft review must
  // not shadow the pending state — the log is still pending until the
  // draft is finalized (submitted) or auto-expired (skipped).
  const reviewedIds = new Set(
    (await db.sessionReviews.toArray())
      .filter((r) => r.status !== 'draft')
      .map((r) => r.executionLogId),
  )

  const unreviewed = terminal
    .filter((l) => !reviewedIds.has(l.id))
    .sort((a, b) => (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt))

  for (const exec of unreviewed) {
    const endAt = exec.completedAt ?? exec.startedAt
    const elapsed = now - endAt
    if (elapsed >= FINISH_LATER_CAP_MS) continue
    const plan = await db.sessionPlans.get(exec.planId)
    return {
      executionId: exec.id,
      planName: plan?.presetName ?? 'Session',
      completedAt: endAt,
      deferralRemainingMs: Math.max(0, FINISH_LATER_CAP_MS - elapsed),
    }
  }
  return null
}

// --- Last-complete query (C-4) ---

/**
 * Bundle returned by `getLastComplete` — everything the Home LastComplete
 * primary card (C-4 Unit 3) needs to render without a follow-up fetch:
 * the terminal execution log, its originating plan, and the finalized
 * review (either submitted or skipped-via-expire/skip).
 */
export interface LastCompleteBundle {
  log: ExecutionLog
  plan: SessionPlan
  review: SessionReview
}

/**
 * Newest terminal, non-discarded-resume session whose review has been
 * finalized (`status: 'submitted'` or `'skipped'`). Feeds the Home
 * `LastComplete` primary card.
 *
 * A1 filter semantics: a `status: 'draft'` review is NOT terminal, so a
 * log with only a draft review is excluded (the session is still the
 * review-pending state). A8 also applies: `endedEarlyReason ===
 * 'discarded_resume'` logs never appear here — the tester explicitly
 * abandoned them, so offering Repeat on that session would be user-hostile.
 *
 * Returns `null` when no eligible record exists (fresh install, or every
 * terminal log is either unreviewed, draft-reviewed, or discarded-resume).
 */
export async function getLastComplete(): Promise<LastCompleteBundle | null> {
  const [logs, reviews] = await Promise.all([
    db.executionLogs.toArray(),
    db.sessionReviews.toArray(),
  ])
  const finalizedReviewByExec = new Map<string, SessionReview>()
  for (const r of reviews) {
    if (r.status !== 'submitted' && r.status !== 'skipped') continue
    finalizedReviewByExec.set(r.executionLogId, r)
  }

  const candidates = logs.filter(
    (l) =>
      (l.status === 'completed' || l.status === 'ended_early') &&
      l.endedEarlyReason !== 'discarded_resume' &&
      finalizedReviewByExec.has(l.id),
  )
  if (candidates.length === 0) return null

  candidates.sort(
    (a, b) =>
      (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt),
  )
  const log = candidates[0]
  const review = finalizedReviewByExec.get(log.id)!
  const plan = await db.sessionPlans.get(log.planId)
  if (!plan) return null
  return { log, plan, review }
}

// --- Recent sessions list (Tier 1a Unit 5) ---

/**
 * Tier 1a Unit 5: shape of a single row in the Home last-3-sessions
 * list. Three render-ready primitives (timestamp, plan for focus
 * inference, completion boolean). Kept deliberately narrow — richer
 * context (RPE, drill list, swap count) is a Tier 2 concern.
 */
export interface RecentSessionEntry {
  execId: string
  endedAt: number
  plan: SessionPlan
  completed: boolean
}

/**
 * Tier 1a Unit 5: the N most-recent terminal sessions in reverse
 * chronological order, each joined with its originating plan.
 *
 * Filter semantics:
 * - Includes `status: 'completed'` and `status: 'ended_early'`.
 * - **Excludes** `endedEarlyReason === 'discarded_resume'` (A8):
 *   discarding a stale resumable session is not a "session the
 *   founder ran." It would be noise in the history list and would
 *   contradict the adversarial-memo framing of Condition 2 (visible
 *   history reduces the founder's reason to keep a parallel notes
 *   app for real session history).
 * - Excludes `in_progress` / `paused` / `not_started` — those surface
 *   on the Resume primary card, not in history.
 *
 * Ordering: `completedAt ?? startedAt`, descending. Matches the
 * ordering `getLastComplete` uses so the first item here will
 * frequently be the same log backing the LastComplete primary card
 * (by design — "what you did last" and "recent sessions" share a
 * head).
 *
 * Unlike `getLastComplete`, this query does NOT require a finalized
 * `SessionReview`. The list is a "what happened" surface, not a
 * "what's actionable next" surface — a skipped review or an
 * expired-stub record still counts as a session that happened.
 *
 * `completed: boolean` collapses ExecutionStatus to a Y/N column for
 * the Home row: `status === 'completed'` → `true`; `ended_early` →
 * `false`. Ended-early captures both explicit finish-later and
 * D120-expired stubs — both read as "not completed" for the
 * founder-facing row. Per-reason granularity is a Tier 2 concern.
 *
 * Plans missing from Dexie (orphaned after a plan-row deletion, very
 * rare in practice) drop out of the list silently. We take the first
 * `limit` records whose plan lookup succeeds — not the first `limit`
 * records and then filter — so a broken plan record doesn't shorten
 * the visible list below the caller's ask when there are later
 * recoverable sessions available.
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
 */
export async function getRecentSessions(
  limit: number = 3,
): Promise<RecentSessionEntry[]> {
  if (limit <= 0) return []
  const logs = await db.executionLogs.toArray()
  const terminal = logs
    .filter(
      (l) =>
        (l.status === 'completed' || l.status === 'ended_early') &&
        l.endedEarlyReason !== 'discarded_resume',
    )
    .sort(
      (a, b) =>
        (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt),
    )

  const entries: RecentSessionEntry[] = []
  for (const exec of terminal) {
    if (entries.length >= limit) break
    const plan = await db.sessionPlans.get(exec.planId)
    if (!plan) continue
    entries.push({
      execId: exec.id,
      endedAt: exec.completedAt ?? exec.startedAt,
      plan,
      completed: exec.status === 'completed',
    })
  }
  return entries
}

/**
 * Has the tester ever created an ExecutionLog on this device?
 *
 * Gates the "First time" recency chip on `SafetyCheckScreen`: once the
 * tester has engaged with the app for any session (even a discarded
 * one, even a still-paused one), "First time" is no longer a
 * meaningful answer to "When did you last train?" and the chip
 * collapses out of the radio group. Returns `false` only for a truly
 * fresh install where no `ExecutionLog` rows exist.
 *
 * Contract:
 * - Counts completed, ended_early (including discarded-resume), and
 *   in-progress / paused logs equally. Engagement is engagement; the
 *   tester isn't a first-timer just because they bailed on their
 *   first attempt.
 * - Returns `true` the moment a single ExecutionLog row exists. We
 *   short-circuit on count rather than scanning every row.
 */
export async function hasEverStartedSession(): Promise<boolean> {
  return (await db.executionLogs.count()) > 0
}

/**
 * Auto-finalize any terminal session whose 2 h Finish Later cap has elapsed
 * without a review. Writes a terminal expired stub via `expireReview()` so
 * the home priority falls through to `LastComplete` and the adaptation
 * engine never consumes the record (V0B-31 / D120).
 *
 * Idempotent and cheap; safe to call on every home resolve.
 */
export async function expireStaleReviews(now: number = Date.now()): Promise<number> {
  const logs = await db.executionLogs.toArray()
  // A1 + A8: only consider terminal, non-discarded-resume logs.
  const terminal = logs.filter(
    (l) =>
      (l.status === 'completed' || l.status === 'ended_early') &&
      l.endedEarlyReason !== 'discarded_resume',
  )
  // A1: a `status: 'draft'` record does NOT block expiration. The expire
  // path overwrites drafts with a terminal `status: 'skipped'` stub so
  // stale drafts cannot linger past the 2 h cap.
  const finalizedIds = new Set(
    (await db.sessionReviews.toArray())
      .filter((r) => r.status !== 'draft')
      .map((r) => r.executionLogId),
  )
  let expired = 0
  for (const exec of terminal) {
    if (finalizedIds.has(exec.id)) continue
    const endAt = exec.completedAt ?? exec.startedAt
    if (now - endAt < FINISH_LATER_CAP_MS) continue
    // Reliability finding rel-6: per-record try/catch so one corrupted
    // record doesn't abort the whole sweep. Without this, every future
    // Home resolve would re-hit the same bad record and leave the app
    // stuck on the 'error' state. We tolerate the failure and let the
    // next sweep retry; HomeScreen will still render correctly because
    // the OTHER past-cap logs got their stubs.
    try {
      await expireReview({ executionLogId: exec.id, now })
      expired += 1
    } catch (err) {
      console.error(
        `expireStaleReviews: failed to expire ${exec.id}; continuing sweep`,
        err,
      )
    }
  }
  return expired
}

/**
 * User-initiated skip from the home pending-review prompt. Writes a terminal
 * stub consistent with expire-path semantics: no usable RPE, not eligible
 * for adaptation. Kept distinct from `expireReview` via the `quickTags` tag
 * so exports can tell user skips apart from timeout expiries.
 *
 * A3 (red-team fix plan v3 §A3) + H17: intra-connection atomic
 * read-decide-write. Terminal records are left untouched; a `draft`
 * record is overwritten by this terminal stub.
 */
export async function skipReview(executionId: string): Promise<void> {
  const now = Date.now()
  const exec = await db.executionLogs.get(executionId)
  const endAt = exec?.completedAt ?? exec?.startedAt ?? now
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

  await db.transaction(
    'rw',
    db.sessionReviews,
    db.storageMeta,
    async (tx) => {
      const reviews = tx.table<SessionReview, string>('sessionReviews')
      const existing = await reviews
        .where('executionLogId')
        .equals(executionId)
        .first()
      if (
        existing &&
        (existing.status === 'submitted' || existing.status === 'skipped')
      ) {
        return
      }
      await reviews.put(stub)
      await clearSoftBlockDismissed(executionId, tx)
    },
  )
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

/**
 * Phase F Unit 4 (2026-04-19): mid-run Swap divergence writer.
 *
 * Replaces `plan.blocks[activeBlockIndex]` with `nextBlock` and
 * increments `execution.swapCount`. Both writes land in a single
 * `rw` transaction so the UI never sees a state where the plan shows
 * the new drill but the counter is stale (or vice versa).
 *
 * Caller contract (see `useSessionRunner.swapBlock`):
 * - `nextBlock` MUST come from `findSwapAlternatives(currentBlock,
 *   plan.context)` so the new drill is context-valid and the `id` /
 *   `type` / `required` invariants are preserved.
 * - `plan.blocks[execution.activeBlockIndex]` MUST point at the
 *   current block — swap mutates the active slot, not a future one.
 * - Timer pause is the caller's responsibility; this service only
 *   writes data. Matches the Shorten convention.
 *
 * Returns the updated objects so the caller can setState without a
 * second Dexie read.
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
