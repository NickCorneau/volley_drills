import type { ArchetypeId, BlockSlotType, SetupContext } from '../types/session'

// Re-export the canonical `SetupContext` (defined in `types/session.ts`)
// so existing `import type { SetupContext } from '../db/types'` sites
// keep working. The type belongs next to the other pre-assembly context
// types (`ArchetypeId`, `TimeProfile`) but persistence code tends to
// reach for it through `db/types`.
export type { SetupContext }

export interface SessionPlanBlock {
  id: string
  type: BlockSlotType
  /**
   * Stable catalog identity for this planned block. Optional because
   * legacy persisted plans pre-date these fields and still render by
   * name/copy snapshot.
   */
  drillId?: string
  variantId?: string
  drillName: string
  shortName: string
  durationMinutes: number
  coachingCue: string
  courtsideInstructions: string
  required: boolean
  /**
   * Tier 1a Unit 4: one-sentence deterministic rationale for why this
   * block landed on the user's session ("Chosen because: ..."). Optional
   * because legacy v3 / v0a plans do not carry it; RunScreen renders it
   * quietly below the coaching cue when present. Not persisted to Dexie
   * explicitly - the plan object is stored as a whole, so the field
   * rides along automatically once a plan is rebuilt by the current
   * `createSessionFromDraft`. Tier 2 decides whether to surface it
   * through a richer "See why this session was chosen" modal.
   */
  rationale?: string
  /**
   * Pre-close 2026-04-21 (partner-walkthrough P2-2): sub-block pacing
   * interval in seconds. Copied from `DrillVariant.subBlockIntervalSeconds`
   * during `createSessionFromDraft`. Consumed by `RunScreen` to fire
   * audible ticks at each interval during active execution. Undefined
   * on drills without internal sub-blocks, and on legacy plans that
   * pre-date the field.
   */
  subBlockIntervalSeconds?: number
}

export interface SessionPlanSafetyCheck {
  painFlag: boolean
  trainingRecency?: string
  heatCta: boolean
  painOverridden: boolean
}

export interface SessionPlan {
  id: string
  presetId: string
  presetName: string
  playerCount: 1 | 2
  assemblySeed?: string
  assemblyAlgorithmVersion?: number
  blocks: SessionPlanBlock[]
  safetyCheck: SessionPlanSafetyCheck
  context?: SetupContext
  createdAt: number
}

export interface DraftBlock {
  id: string
  type: BlockSlotType
  drillId: string
  variantId: string
  drillName: string
  shortName: string
  durationMinutes: number
  coachingCue: string
  courtsideInstructions: string
  required: boolean
  /** Tier 1a Unit 4: see `SessionPlanBlock.rationale`. */
  rationale?: string
  /** Pre-close 2026-04-21 (P2-2): see `SessionPlanBlock.subBlockIntervalSeconds`. */
  subBlockIntervalSeconds?: number
}

export interface SessionDraft {
  id: 'current'
  context: SetupContext
  archetypeId: ArchetypeId
  archetypeName: string
  assemblySeed?: string
  assemblyAlgorithmVersion?: number
  blocks: DraftBlock[]
  updatedAt: number
  /**
   * One-sentence human-readable reason for why this session was assembled.
   * Schema-only in v0b per H7 / GD37: `buildDraft()` emits `undefined` and no
   * UI consumer ships. M001-build reads this to light up the "See why" surface
   * without a migration. See `docs/specs/m001-phase-c-ux-decisions.md` and
   * `docs/decisions.md` D-C5 / H7.
   */
  rationale?: string
}

export type ExecutionStatus = 'not_started' | 'in_progress' | 'paused' | 'ended_early' | 'completed'

export type ExecutionBlockStatus = 'planned' | 'in_progress' | 'skipped' | 'completed'

export interface ExecutionLogBlockStatus {
  blockId: string
  status: ExecutionBlockStatus
  startedAt?: number
  completedAt?: number
}

export interface ExecutionLog {
  id: string
  planId: string
  status: ExecutionStatus
  activeBlockIndex: number
  blockStatuses: ExecutionLogBlockStatus[]
  startedAt: number
  pausedAt?: number
  completedAt?: number
  endedEarlyReason?: string
  actualDurationMinutes?: number
  /**
   * Phase F Unit 4 (2026-04-19): total number of mid-run `Swap` actions
   * the tester fired during this session. Optional (absent === 0 for
   * legacy v3 / v0a records and for sessions where no swap happened).
   * Incremented inside the `swapActiveBlock` transaction so the counter
   * and the active slot's `blockOverrides` write land atomically.
   *
   * D91 replay: founder reads `swapCount > 0` as the signal that the
   * tester diverged from the assembled plan. A structured
   * `blockSwaps` audit trail (from/to per event) is a post-D91
   * refinement if the cohort shows swaps are frequent enough to
   * warrant before/after attribution.
   */
  swapCount?: number
  /**
   * Architecture cleanup U7: active-work overrides keyed by plan block index.
   * New swaps write here instead of mutating `SessionPlan.blocks`, preserving
   * the original plan while allowing read paths to project what the tester
   * actually did. Optional for legacy rows and sessions with no swaps.
   */
  blockOverrides?: Partial<Record<number, SessionPlanBlock>>
}

export type IncompleteReason = 'time' | 'fatigue' | 'pain' | 'other'

export interface DrillVariantScore {
  drillId: string
  variantId: string
  goodPasses: number
  totalAttempts: number
}

/**
 * D133 (2026-04-26): per-drill required difficulty enum captured on
 * `DrillCheckScreen` at `/run/check` after completed main-skill /
 * pressure blocks. Distinct vocabulary from the deleted
 * session-level `QuickTagChips` (`Too easy / About right / Too hard`)
 * because:
 * - capture grain is per-drill-variant, not per-session
 * - the "still_learning" middle anchor names a learning state, not an
 *   intensity rating, so it does not duplicate the post-session 3-anchor
 *   RPE (`Easy / Right / Hard`) which lives at session grain
 *
 * See `docs/specs/m001-review-micro-spec.md` §"Per-drill capture at
 * Transition (D133)" (the spec section name retains the historical
 * "Transition" label even though the surface shipped as `/run/check`)
 * and `docs/research/2026-04-26-pair-rep-capture-options.md` Framing D
 * for the rationale.
 */
export type DifficultyTag = 'too_hard' | 'still_learning' | 'too_easy'

/**
 * D133 (2026-04-26): one entry per completed main-skill / pressure block,
 * captured on `DrillCheckScreen` (route `/run/check`) immediately after
 * the block ends. The pre-`D133` Transition surface is now refocused on
 * Up Next handoff; capture lives on the dedicated check screen.
 *
 * Realises `V0B-12`'s drill-variant-grain requirement for the first time
 * in M001 (Tier 1a was session-level only) and feeds `D104`'s 50-contact
 * rolling-window math via `goodPasses` / `attemptCount` when those are
 * captured. When counts are absent, `D104` gracefully degrades to RPE-only
 * signal for that drill — see decisions.md `D104` and `D133`.
 */
export interface PerDrillCapture {
  /** Stable catalog identity. Mirrors `SessionPlanBlock.drillId`. */
  drillId: string
  /** Stable variant identity. Mirrors `SessionPlanBlock.variantId`. */
  variantId: string
  /**
   * Index into `SessionPlan.blocks` of the block this capture belongs to.
   * Stored so a mid-session Swap that replaces a drill does not collapse
   * two captures with the same `drillId` into one — a tester who runs the
   * same drill twice (after a Swap-back) gets two distinct captures keyed
   * by `blockIndex`, not one merged record.
   */
  blockIndex: number
  /**
   * Required by D133. `DrillCheckScreen` cannot advance to the next
   * block (Transition / Up Next) until the user taps one of the three
   * chips.
   */
  difficulty: DifficultyTag
  /**
   * Optional per-drill Good count. Both `goodPasses` and `attemptCount`
   * are present-or-both-absent: a writer who has one but not the other
   * is a contract violation. When absent, `D104` falls back to RPE-only
   * signal for this drill (see `D133`).
   */
  goodPasses?: number
  /** Optional per-drill Total count. See `goodPasses`. */
  attemptCount?: number
  /**
   * Per-drill mirror of the session-level `notCaptured` quick tag: the
   * tester explicitly opted out of counting reps for this drill. When
   * `true`, `goodPasses` and `attemptCount` are `undefined` and the
   * adaptation engine should treat the drill as RPE-only signal.
   */
  notCaptured?: boolean
  /** Epoch ms at which the capture was tapped on `DrillCheckScreen`. */
  capturedAt: number
}

/**
 * RPE capture-timing window. Persisted on every `SessionReview` so the
 * M001-build adaptation engine (D104 / D113 / D120) can confidence-bucket
 * inputs without re-deriving from timestamps. v0b does not wire these into
 * any engine; it only ensures the data shape is honest for field-test replay.
 *
 * Buckets match `docs/specs/m001-review-micro-spec.md` → *Required*:
 * - `immediate`     | 0–30 min post session end  | eligible
 * - `same_session`  | 30 min–2 h                 | eligible
 * - `same_day`      | 2 h–24 h                   | eligible (lower confidence)
 * - `next_day_plus` | >24 h                      | NOT eligible
 * - `expired`       | Finish Later 2 h cap elapsed, stub write | NOT eligible
 */
export type RpeCaptureWindow =
  | 'immediate'
  | 'same_session'
  | 'same_day'
  | 'next_day_plus'
  | 'expired'

/**
 * Terminal state of a `SessionReview` (D-C7 / A5). Replaces the legacy
 * `sessionRpe: -1` sentinel used in v0a.
 *
 * - `'submitted'` - user completed the review; `sessionRpe` is a number in
 *   `[0, 10]`.
 * - `'skipped'` - terminal stub produced by `skipReview` or `expireReview`;
 *   `sessionRpe === null`, `goodPasses === 0`, `totalAttempts === 0`.
 * - `'draft'` - partial review persisted by `saveReviewDraft` (C-1 Unit 7);
 *   filtered out by `findPendingReview` / `expireStaleReviews` per A1.
 *
 * Optional on the type (`status?:`) for defense-in-depth: the v4 migration
 * backfills every existing record, but the optional marker tolerates any
 * record the migration somehow missed. Writers emit `status` unconditionally
 * in C-0 Unit 5 per A5 hygiene.
 */
export type SessionReviewStatus = 'submitted' | 'skipped' | 'draft'

export interface SessionReview {
  id: string
  executionLogId: string
  /**
   * Device-holder rating on the 0–10 CR10-style scale (D120). `null` only
   * when the review was auto-finalized via the expired-deferral path
   * (V0B-31) - no usable subjective load was captured in that case.
   */
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  drillScores?: DrillVariantScore[]
  /**
   * D133 (2026-04-26): per-drill captures recorded on the Transition
   * screen between blocks. Optional on the type so legacy v3 / pre-D133
   * records read cleanly; writers in `submitReview` / `saveReviewDraft`
   * pass through whatever the Transition flow accumulated. When at least
   * one entry has a `difficulty` set, ReviewScreen's session-level
   * Good/Total card hides and CompleteScreen aggregates from this list
   * via `aggregateDrillCaptures`; when absent or empty, the legacy
   * session-level fields drive the recap.
   */
  perDrillCaptures?: PerDrillCapture[]
  /**
   * Schema-reserved for the three-layer self-scoring bias correction in
   * D104 / docs/research/binary-scoring-progression.md. Captures how many
   * of the `goodPasses` the athlete considers borderline. v0b does not
   * compute the near-boundary zone or prompt for this value; leave
   * `undefined`. M001-build will wire the 10-second borderline-review UI
   * and the corrected-Bayesian posterior on top without a migration.
   * Tracked as V0B-29.
   */
  borderlineCount?: number
  incompleteReason?: IncompleteReason
  quickTags?: string[]
  shortNote?: string
  /** Epoch ms at which the review was written. Always populated. */
  submittedAt: number
  /**
   * Epoch ms at which the user committed the RPE rating. Equal to
   * `submittedAt` for normal submits; `undefined` on the expired stub
   * (no rating was ever captured). V0B-30 / D120.
   */
  capturedAt?: number
  /**
   * Seconds elapsed from session end (`ExecutionLog.completedAt` or the
   * recorded end timestamp for `ended_early`) to `capturedAt`. `undefined`
   * on the expired stub. Persisted for cohort replay even though the v0b
   * engine does not consume it. V0B-30 / D120.
   */
  captureDelaySeconds?: number
  /** Bucketed capture window derived from `captureDelaySeconds`. V0B-30 / D120. */
  captureWindow?: RpeCaptureWindow
  /**
   * Whether the record is eligible to drive the M001-build adaptation
   * engine. `true` for `immediate | same_session | same_day`; `false` for
   * `next_day_plus | expired` and for review stubs written by skip or
   * expire paths. V0B-30 / D120.
   */
  eligibleForAdaptation?: boolean
  /**
   * Terminal state of the review (D-C7 / A5). See `SessionReviewStatus`.
   * Optional on the type so reads of legacy v3 records the v4 migration
   * somehow missed do not break; writers in C-0 Unit 5 emit it
   * unconditionally.
   */
  status?: SessionReviewStatus
}

export type TimerRunStatus = 'running' | 'paused'

export interface TimerState {
  id: 'active'
  executionLogId: string
  blockIndex: number
  startedAt: number
  accumulatedElapsed: number
  effectiveDurationSeconds?: number
  status: TimerRunStatus
  lastFlushedAt: number
}

/**
 * Row shape for the `storageMeta` key-value table added in Dexie v4 (C-0).
 *
 * Keys used in v0b (see `docs/specs/m001-phase-c-ux-decisions.md`):
 * - `onboarding.skillLevel` - D-C4 / D121 enum picked on Skill Level screen.
 * - `onboarding.completedAt` - epoch ms set when Today's Setup's "Build
 *   session" commits; also backfilled by C-0 Unit 2 for existing testers per
 *   H15 defense-in-depth.
 * - `onboarding.step` - `'skill_level' | 'todays_setup'`, crash-safe resume
 *   key.
 * - `ux.softBlockDismissed.{execId}` - A7 check-and-set on the D-C1 soft-block
 *   modal; cleaned up on terminal-review write.
 *
 * `value` is typed as `unknown` (C-0 Key Decision #4): numbers (timestamps),
 * booleans, strings, and structured values are all valid. Callers type-check
 * on read using the `isSkillLevel()` / `isOnboardingStep()` / etc. pattern via
 * `getStorageMeta<T>(key, guard)` (C-0 Unit 3).
 */
export interface StorageMetaEntry {
  key: string
  value: unknown
  updatedAt: number
}
