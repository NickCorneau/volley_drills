/**
 * Canonical drill metadata types.
 *
 * This file is the machine-readable source of truth for the drill contract.
 * Docs (PRD, research notes, specs) reference these types rather than
 * re-describing the schema in prose.
 *
 * Decisions: D4, D76 (feed type), D77 (fatigue cap), D79 (env flags).
 */

/** How the ball is delivered - determines realism and skill-transfer claims. */
export type FeedType = 'self-toss' | 'partner-toss' | 'live-serve' | 'wall-rebound' | 'coach-serve'

/**
 * Technique-axis taxonomy for drills: the GMP a drill primarily trains.
 *
 * New values land only when partner-walkthrough evidence or at least
 * three founder-ledger rows fire a D135-style trigger. `attack` is a
 * planned future member that pairs with `serve` as the overhead-striking
 * cluster, but it is not in the union today. Out-of-system, side-out,
 * transition, and game-like are scenarios, not skills; they belong on a
 * future variant-level scenario field, not here.
 *
 * `'warmup'` is the Tier 1a (D105) tag for Beach Prep content. The session
 * builder's warmup slot prefers drills tagged `'warmup'` over the non-
 * `'recovery'` fallback; see the warmup-slot invariant in
 * `app/src/data/archetypes.ts` and `pickForSlot` in
 * `app/src/domain/sessionAssembly/candidates.ts`.
 */
export type SkillFocus =
  | 'pass'
  | 'serve'
  | 'set'
  | 'movement'
  | 'conditioning'
  | 'recovery'
  | 'warmup'

export type PlayerLevel = 'beginner' | 'intermediate' | 'advanced'

/** Hard filters for session assembly. A drill needing a wall cannot be offered on open sand. */
export interface EnvironmentFlags {
  needsNet: boolean
  needsWall: boolean
  needsLines: boolean
  needsCones: boolean
  lowScreenTime: boolean
}

export interface Participants {
  min: number
  ideal: number
  max: number
  roles?: string[]
}

/**
 * Protects technique under fatigue (D77).
 * At least one of maxSets, maxReps, or maxMinutes should be set.
 */
export interface FatigueCap {
  maxSets?: number
  maxReps?: number
  maxMinutes?: number
  restBetweenSetsSeconds?: number
}

export interface WorkloadEnvelope {
  durationMinMinutes: number
  durationMaxMinutes: number
  rpeMin: number
  rpeMax: number
  fatigueCap?: FatigueCap
}

export type MetricType =
  | 'pass-rate-good'
  | 'pass-grade-avg'
  | 'streak'
  | 'points-to-target'
  | 'completion'
  | 'reps-successful'
  | 'composite'

export interface SuccessMetric {
  type: MetricType
  description: string
  target?: string
}

export interface Equipment {
  balls: number | 'many'
  markers?: boolean
  towel?: boolean
  cones?: number
  other?: string[]
}

export type ProgressionDirection = 'progression' | 'regression' | 'lateral'

export interface ProgressionLink {
  fromDrillId: string
  toDrillId: string
  direction: ProgressionDirection
  gatingCriteria?: string
  description: string
}

/**
 * A single named, individually-timed move inside a composed warmup or
 * cooldown drill. Authored on `DrillVariant.segments`; rendered by
 * RunScreen's `<SegmentList>` as a structured per-move pacing
 * indicator with the active row highlighted.
 *
 * 2026-04-28 ship (`docs/plans/2026-04-28-per-move-pacing-indicator.md`):
 * the visible-channel half of S1 from
 * `docs/ideation/2026-04-28-what-to-add-next-ideation.md`. Survives
 * audio failure (silent switch / lock state / denied Wake Lock) per
 * the cue-stack invariants in
 * `docs/research/outdoor-courtside-ui-brief.md`.
 *
 * Segments are NOT first-class `Drill` records. They never enter
 * session assembly, swap, or any drill-level surface (Settings, Home,
 * Review). They are sub-block authoring structure only.
 */
export interface DrillSegment {
  /** Variant-local stable ID (e.g., `d28-solo-s1`). */
  id: string
  /** Courtside-readable move name. Rendered as the row label. */
  label: string
  /**
   * Authored duration in whole seconds. Must be a positive integer.
   * `sum(segments[].durationSec) === workload.durationMinMinutes * 60`
   * is enforced by `validateDrillCatalog`.
   */
  durationSec: number
  /**
   * Reserved forward-seam for a future per-segment cue ship. v1 does
   * NOT render this field anywhere — see `<SegmentList>` and its
   * regression test pinning the no-render contract.
   *
   * Activates when (a) partner walkthrough or founder-ledger row
   * explicitly asks for per-segment cue copy on at least one of
   * `d25-solo` / `d26-solo` / `d28-solo`, OR (b) a non-M001 timed
   * drill ships requiring per-move cue copy at authoring time. Until
   * then, do not author the field on any segment, and do not render
   * it from `<SegmentList>`.
   *
   * Precedent: the `SessionParticipant[]` D115/D116/D117 forward-seam
   * in `app/src/model/session.ts` lines 50–57. Reserved-field
   * discipline keeps the seam from silently growing into a feature.
   */
  cue?: string
  /**
   * 2026-04-28 dogfeed iteration: marks unilateral segments where
   * the user splits `durationSec` between two sides (e.g., d25's
   * hip stretch + shoulder stretch, every d26 stretch). When `true`,
   * `<SegmentList>` appends a muted "(each side)" suffix to the
   * label so the user knows to switch sides during the segment.
   *
   * Authoring contract: `durationSec` is ALWAYS the total time on
   * the timer for the segment, independent of `eachSide`. The
   * `eachSide` flag is metadata for display + (future) midpoint-cue
   * runtime behavior; it does NOT multiply the duration. This
   * keeps catalog validation, scaling math, and pacing math
   * identical to bilateral segments.
   *
   * Default: `false` (bilateral). Omit on bilateral segments — the
   * field reads cleaner when only unilateral segments declare it.
   */
  eachSide?: boolean
}

/** A single execution mode for a drill family. */
export interface DrillVariant {
  id: string
  drillId: string
  label: string
  feedType: FeedType
  participants: Participants
  environmentFlags: EnvironmentFlags
  equipment: Equipment
  workload: WorkloadEnvelope
  successMetric: SuccessMetric
  courtsideInstructions: string
  /**
   * Optional bonus prose rendered by RunScreen below the segment list
   * ONLY when all segments have completed (i.e., the planned block
   * duration exceeded `sum(segments[].durationSec)` and the indicator
   * is in bonus territory). Used today on `d26-solo` to carry the
   * "if time remains, mirror to the other side, then add glutes /
   * adductors" expansion that lives outside the structured 3-segment
   * floor.
   *
   * Authoring contract: only meaningful when `segments` is also
   * present. Renders nothing when `segments` is absent.
   */
  courtsideInstructionsBonus?: string
  coachingCues: string[]
  /**
   * Pre-close 2026-04-21 (partner-walkthrough P2-2): drills authored
   * with internal timed sub-blocks declare the tick cadence here. When
   * set, `RunScreen` fires a subtle sub-block tick at every multiple
   * of this interval during active execution so the courtside reader
   * gets audible pacing for sub-segments the copy already enumerates
   * (e.g. d28 Beach Prep Three's four ~45 s components, d26 Stretch
   * Micro-sequence's six ~30 s stretches).
   *
   * Undefined on drills without internal sub-blocks (main_skill drills
   * are generally continuous and do not want mid-block ticks).
   *
   * Units: seconds. Must be a positive integer if set. See
   * `.cursor/rules/courtside-copy.mdc` §Invariant 5 for the authoring
   * contract ("copy in firing order"); this field is the runtime side
   * of that contract.
   *
   * 2026-04-28: superseded on the three timed M001 drills (`d25-solo`,
   * `d26-solo`, `d28-solo`) by `segments`. Remains the default channel
   * for any future timed drill that does not author `segments`. When
   * both `segments` and `subBlockIntervalSeconds` are present, the
   * runner treats `segments` as the source of truth and ignores the
   * uniform interval — but that combination is not authored anywhere
   * today and should be avoided to prevent drift.
   */
  subBlockIntervalSeconds?: number
  /**
   * Composed sub-segments for warmup / cooldown drills with internal
   * timed moves. When present, RunScreen renders a structured
   * `<SegmentList>` with per-segment indicators and the per-segment
   * end beep replaces the uniform `subBlockIntervalSeconds` tick. The
   * sum of `segments[].durationSec` must equal
   * `workload.durationMinMinutes * 60` (CI-enforced via
   * `validateDrillCatalog`).
   *
   * `readonly` because the runtime never mutates the segment list;
   * it is snapshotted into `DraftBlock` / `SessionPlanBlock` at
   * session-create time and read from there for the rest of the
   * session lifecycle.
   *
   * 2026-04-28 ship: see
   * `docs/plans/2026-04-28-per-move-pacing-indicator.md`.
   */
  segments?: readonly DrillSegment[]
}

/** A drill family - the canonical concept with one or more execution variants. */
export interface Drill {
  id: string
  name: string
  shortName: string
  skillFocus: SkillFocus[]
  objective: string
  levelMin: PlayerLevel
  levelMax: PlayerLevel
  chainId: string
  m001Candidate: boolean
  teachingPoints: string[]
  progressionDescription: string
  regressionDescription: string
  variants: DrillVariant[]
}

export interface ProgressionChain {
  id: string
  name: string
  focus: string
  drillIds: string[]
  links: ProgressionLink[]
  /** Volleyball Canada uses 0.7; can be overridden per link. */
  defaultGatingThreshold: number
}
