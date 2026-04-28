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

// `'warmup'` is the Tier 1a (D105) tag for Beach Prep content. The session
// builder's warmup slot prefers drills tagged `'warmup'` over the non-
// `'recovery'` fallback; see the warmup-slot invariant in
// `app/src/data/archetypes.ts` and `pickForSlot` in
// `app/src/domain/sessionAssembly/candidates.ts`.
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
  windFriendly: boolean
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
   */
  subBlockIntervalSeconds?: number
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
