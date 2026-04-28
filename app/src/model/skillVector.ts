/**
 * Skill vector — forward-compatibility seam for `D121` per-skill rollup
 * persistence.
 *
 * M001 records one session-level focus today. M002+ wants to roll
 * captures up by skill so the home dashboard and adaptation engine
 * can read "where is the player improving?" Per `D121`, the canonical
 * shape is a partial record keyed by `SkillFocus`. Recording that
 * shape now means future aggregators do not have to re-parse legacy
 * single-focus records.
 *
 * Layer rule: pure product type. Domain may consume; persistence
 * derives values from existing per-drill captures + the plan's focus
 * tag and stores nothing yet (no Dexie schema bump in v0b).
 */
import type { SkillFocus } from '../types/drill'

/**
 * One sample on a skill axis. Counts and difficulty mirror the per-
 * drill capture shape so the same review pipeline can fan-out into
 * a vector without inventing a new metric type.
 */
export interface SkillSample {
  /** How many attempts contributed (per-drill `attemptCount` sum). */
  attempts: number
  /** Of those, how many counted as "good" (per-drill `goodPasses` sum). */
  good: number
  /** Whether at least one capture used `notCaptured`. Surfaces gaps. */
  hasUncapturedSamples?: boolean
}

/**
 * A skill vector is a partial record. Skills the player did not
 * train this week / month do not appear at all (vs `0`), so consumers
 * can distinguish "no data" from "tried and failed."
 */
export type SkillVector = Partial<Record<SkillFocus, SkillSample>>
