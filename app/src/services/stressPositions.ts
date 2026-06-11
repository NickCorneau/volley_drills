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
import type { SessionReview } from '../model'
import { deriveStressPositions, type StressPositions } from '../domain/adaptation/stressPosition'
import { isSkillLevel, skillLevelToDrillBand } from '../lib/skillLevel'
import { getStorageMeta } from './storageMeta'

/**
 * `prefetchedReviews` lets a caller that already holds a
 * `sessionReviews` snapshot (the founder export) derive positions from
 * that exact row set instead of a second Dexie read, keeping the
 * payload internally consistent. Assembly callers omit it.
 */
export async function loadStressPositions(
  prefetchedReviews?: readonly SessionReview[],
): Promise<StressPositions> {
  const [reviews, skillLevel] = await Promise.all([
    prefetchedReviews ?? db.sessionReviews.toArray(),
    getStorageMeta('onboarding.skillLevel', isSkillLevel),
  ])
  const band = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
  return deriveStressPositions(reviews, band)
}
