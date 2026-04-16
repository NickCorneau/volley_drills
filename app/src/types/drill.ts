/**
 * Canonical drill metadata types.
 *
 * This file is the machine-readable source of truth for the drill contract.
 * Docs (PRD, research notes, specs) reference these types rather than
 * re-describing the schema in prose.
 *
 * Decisions: D4, D76 (feed type), D77 (fatigue cap), D79 (env flags).
 */

/** How the ball is delivered — determines realism and skill-transfer claims. */
export type FeedType = 'self-toss' | 'partner-toss' | 'live-serve' | 'wall-rebound' | 'coach-serve'

export type SkillFocus = 'pass' | 'serve' | 'set' | 'movement' | 'conditioning' | 'recovery'

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
}

/** A drill family — the canonical concept with one or more execution variants. */
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
