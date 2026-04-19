/**
 * First-run Skill Level taxonomy (D-C4 / D121).
 *
 * The onboarding screen persists one of five short enum values to
 * `storageMeta.onboarding.skillLevel`. They are **pair-first functional
 * bands** — action-anchored descriptions of what a pair (or solo player) can
 * currently do together — not identity labels like "beginner" or
 * "intermediate".
 *
 * The internal drill-metadata band (`PlayerLevel` in `./types/drill.ts`,
 * used by `levelMin` / `levelMax` on entries in `./data/drills.ts`) is
 * intentionally kept as the stable three-tier enum (`beginner` /
 * `intermediate` / `advanced`). `skillLevelToDrillBand()` is the shim that
 * lets the user-facing taxonomy and the drill-metadata taxonomy evolve
 * independently without a Dexie migration.
 *
 * v0b ships the screen and persists the value but does not gate any code
 * path on it (per D-C4); the shim is in place so that when M001-build wires
 * assembly / progression against skill level, the mapping is already the
 * single source of truth.
 *
 * See:
 * - `docs/specs/m001-phase-c-ux-decisions.md` → Surface 1 for the
 *   canonical copy and wireframe.
 * - `docs/decisions.md` D121 for taxonomy rationale and external evidence.
 * - `docs/specs/m001-adaptation-rules.md` → "Pair complexity ceiling
 *   (reserved)" for the `lower-of-two` engine rule that consumes the
 *   mapped drill band.
 */

import type { PlayerLevel } from '../types/drill'

/**
 * Onboarding Skill Level enum.
 *
 * Short machine values only. The long helper sentences live in the
 * onboarding copy block and are free to evolve without a migration.
 *
 * `'unsure'` is the explicit "Not sure yet" escape hatch — preferred over a
 * sentinel like `'skipped'` because it carries intent (the user read the
 * question, opted out) and survives taxonomy changes without ambiguity.
 */
export type SkillLevel =
  | 'foundations'
  | 'rally_builders'
  | 'side_out_builders'
  | 'competitive_pair'
  | 'unsure'

/**
 * All onboarding enum values, ordered by functional ability from lowest to
 * highest, with `'unsure'` last. Useful for exhaustive mapping in tests and
 * for UI rendering that wants the same order as the decision.
 */
export const SKILL_LEVELS: readonly SkillLevel[] = [
  'foundations',
  'rally_builders',
  'side_out_builders',
  'competitive_pair',
  'unsure',
] as const

/**
 * Short user-facing label rendered on each Skill Level button. The long
 * helper sentence under each label is held in the onboarding screen's copy
 * block and intentionally not exported here — copy is a screen concern, not
 * a library concern.
 */
export const SKILL_LEVEL_LABEL: Record<SkillLevel, string> = {
  foundations: 'Foundations',
  rally_builders: 'Rally builders',
  side_out_builders: 'Side-out builders',
  competitive_pair: 'Competitive pair',
  unsure: 'Not sure yet',
}

/**
 * Map the onboarding Skill Level enum onto the internal drill-metadata
 * band (`PlayerLevel`) used by `levelMin` / `levelMax` in `./data/drills.ts`.
 *
 * `'unsure'` maps to the safest starting band (`'beginner'`) so the
 * session builder always has a concrete archetype to fall back to, matching
 * the D-C4 / D121 "Not sure yet" semantics: opt-out biases toward the
 * conservative default, not toward a mid-range guess.
 *
 * The two "builder" bands both map to `'intermediate'` because the
 * drill-metadata taxonomy is three-tier; this is an intentional
 * information-loss boundary. Any future need to distinguish them inside
 * the engine should happen by extending the drill metadata (e.g. adding a
 * finer-grained `skillBandRecommendation` field) rather than by widening
 * `PlayerLevel`, so that drill rows stay readable.
 */
export function skillLevelToDrillBand(level: SkillLevel): PlayerLevel {
  switch (level) {
    case 'foundations':
      return 'beginner'
    case 'rally_builders':
      return 'intermediate'
    case 'side_out_builders':
      return 'intermediate'
    case 'competitive_pair':
      return 'advanced'
    case 'unsure':
      return 'beginner'
    default: {
      const _exhaustive: never = level
      return _exhaustive
    }
  }
}

/**
 * Type guard for persisted values. Guards against stale / future enum
 * values in `storageMeta.onboarding.skillLevel` — for example if a newer
 * build persisted a value the current build does not yet know about, or if
 * storage was hand-edited.
 */
export function isSkillLevel(value: unknown): value is SkillLevel {
  return (
    typeof value === 'string' &&
    (SKILL_LEVELS as readonly string[]).includes(value)
  )
}
