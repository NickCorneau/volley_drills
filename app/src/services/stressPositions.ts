/**
 * Stress-substrate (D154) — load the derived per-focus ladder positions.
 *
 * Thin Dexie read over `sessionReviews` plus the persisted onboarding
 * skill band; the fold itself is pure domain
 * (`deriveStressPositions`). One computation, two reads: session
 * assembly callers (plan launch, Setup builds) and the founder export
 * both resolve positions through this seam, so the steering input and
 * the diagnostic read can never diverge (D150).
 */
import { db } from '../db'
import { deriveStressPositions, type StressPositions } from '../domain/adaptation/stressPosition'
import { isSkillLevel, skillLevelToDrillBand } from '../lib/skillLevel'
import { getStorageMeta } from './storageMeta'

export async function loadStressPositions(): Promise<StressPositions> {
  const [reviews, skillLevel] = await Promise.all([
    db.sessionReviews.toArray(),
    getStorageMeta('onboarding.skillLevel', isSkillLevel),
  ])
  const band = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
  return deriveStressPositions(reviews, band)
}
