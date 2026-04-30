/**
 * Pure product types — the closed home for every domain-shape concept
 * the app reasons about. Domain modules MUST import shapes from here
 * (or `app/src/types/` for catalog / setup vocabulary), never from
 * `app/src/db/`. Persistence rows extend or re-export these types.
 *
 * Layer rule: this directory has zero dependencies on Dexie, React,
 * services, or platform code. CI grep enforces the boundary.
 *
 * Forward-compatibility seams (U6 of the architecture pass):
 *   - `participant.ts` defines `SessionParticipant` so v0b can populate
 *     `[{ role: 'self' }]` while downstream code reads from an array.
 *   - `skillVector.ts` defines `SkillVector` so M001's session-level
 *     focus maps cleanly into the per-skill rollups M002+ wants.
 */
export type {
  ExecutionBlockStatus,
  ExecutionLog,
  ExecutionLogBlockStatus,
  ExecutionStatus,
  SessionPlan,
  SessionPlanBlock,
  SessionPlanSafetyCheck,
} from './session'
export type { DraftBlock, SessionDraft } from './draft'
export type {
  DifficultyTag,
  MetricCapture,
  PerDrillCapture,
  RpeCaptureWindow,
} from './capture'
export type {
  DrillVariantScore,
  IncompleteReason,
  SessionReview,
  SessionReviewStatus,
} from './review'
export type { TimerRunStatus, TimerState } from './timer'
export type { StorageMetaEntry } from './storage'
export type { SessionParticipant, SessionParticipantRole } from './participant'
export type { SkillSample, SkillVector } from './skillVector'
export type {
  CoachBlockSummary,
  CoachPayload,
  CoachPerDrillCapture,
  CoachReviewSummary,
  CoachSessionHeader,
} from './coachPayload'

// Catalog and setup types live in `app/src/types/` and stay there
// (older code base; many imports). Re-exported here so domain code
// has one canonical "model" import path.
export type {
  ArchetypeId,
  BinaryPassScore,
  BlockSlot,
  BlockSlotType,
  PassGradeValue,
  PlayerMode,
  SessionArchetype,
  SetupContext,
  TimeProfile,
} from '../types/session'
export { PassGrade, toBinary } from '../types/session'
export type {
  Drill,
  DrillVariant,
  Equipment,
  EnvironmentFlags,
  FatigueCap,
  FeedType,
  MetricType,
  Participants,
  PlayerLevel,
  ProgressionChain,
  ProgressionDirection,
  ProgressionLink,
  SkillFocus,
  SuccessMetric,
  WorkloadEnvelope,
} from '../types/drill'
