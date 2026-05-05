import { isSkillLevel, skillLevelToDrillBand } from '../../lib/skillLevel'
import type { PlayerLevel } from '../../model'

/**
 * Resolve the effective drill-band level for the assembly engine.
 *
 * Mirrors `effectiveSkillTags` discipline: a single pure module under
 * `app/src/domain/sessionAssembly/` that the candidate-pool consumers
 * (`pickForSlot`, `pickMainSkillSubstitute`, `findSwapAlternatives`)
 * call to learn the runtime level. The 5-tier `SkillLevel` taxonomy is
 * the user-facing identity vocabulary; this resolver projects it onto
 * the 3-tier `PlayerLevel` band the catalog records via `levelMin` /
 * `levelMax`.
 *
 * The `onboarding` parameter accepts `unknown` (the storageMeta read
 * shape) and runs through `isSkillLevel` internally so consumers do
 * not need a separate validation pass. Missing, malformed, and
 * `'unsure'` values all fall through to `'beginner'` per
 * `skillLevelToDrillBand`'s existing semantics.
 *
 * See `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`
 * §"Architecture Direction" for the resolver contract and KD8 for the
 * `unsure → beginner` re-validation evaluation.
 */
export function effectiveLevel(onboarding: unknown): PlayerLevel {
  if (!isSkillLevel(onboarding)) return 'beginner'
  return skillLevelToDrillBand(onboarding)
}
