/**
 * Session archetype, pass-grading, and assembly types.
 *
 * Decisions: D67 (archetypes), D68 (blended practice), D78 (set-window),
 * D80 (70% gating).
 */

/**
 * Full 0–3 pass-quality scale with physical set-window definitions (D78).
 *
 * Set-window setup: place a marker ~2 m off the net and ~1 m inside midcourt.
 *
 * - 3 = ball within ~1 big step of marker, settable immediately
 * - 2 = settable with 2–3 big steps, rushed offense
 * - 1 = outside 2–3 steps, chase / emergency contact
 * - 0 = ace / shank / overpass / no usable second contact
 *
 * M001 uses binary scoring (Good = grade >= 2, Not Good = grade <= 1).
 * The full scale is deferred until users tolerate it courtside (D47).
 */
export const PassGrade = {
  Error: 0,
  OutOfSystem: 1,
  Playable: 2,
  Perfect: 3,
} as const

export type PassGradeValue = (typeof PassGrade)[keyof typeof PassGrade]

export type BinaryPassScore = 'good' | 'not-good'

export function toBinary(grade: PassGradeValue): BinaryPassScore {
  return grade >= PassGrade.Playable ? 'good' : 'not-good'
}

export type BlockSlotType =
  | 'warmup'
  | 'technique'
  | 'movement_proxy'
  | 'main_skill'
  | 'pressure'
  | 'wrap'

export type ArchetypeId = 'solo_wall' | 'solo_open' | 'pair_net' | 'pair_open'

export type TimeProfile = 15 | 25 | 40

export type WindLevel = 'calm' | 'breezy' | 'windy'

export type PlayerMode = 'solo' | 'pair'

/** Hard-filter context captured before assembly. All tap-based, no typing. */
export interface SessionContext {
  playerMode: PlayerMode
  timeProfile: TimeProfile
  netAvailable: boolean
  wallAvailable: boolean
  balls: 1 | 'many'
  markers: 'none' | 'improvised' | 'cones'
  wind: WindLevel
  painOrFatigue: 'none' | 'some'
}

export interface BlockSlot {
  type: BlockSlotType
  durationMinMinutes: number
  durationMaxMinutes: number
  intent: string
  required: boolean
  skillTags?: string[]
}

export interface SessionArchetype {
  id: ArchetypeId
  name: string
  description: string
  requiredContext: Partial<SessionContext>
  layouts: Partial<Record<TimeProfile, BlockSlot[]>>
}
