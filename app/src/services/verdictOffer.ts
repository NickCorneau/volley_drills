/**
 * M002.1 U5 — load the fresh accept/keep verdict offer for the session
 * being reviewed. Thin Dexie read; the offer computation is pure domain
 * (`computeVerdictOffer`). The current session is excluded by
 * `excludeExecutionLogId` because it is not yet submitted.
 */
import { db } from '../db'
import type { AdaptationDelta } from '../db/types'
import { computeVerdictOffer } from '../domain/adaptation/verdictOffer'
import type { ScopedFocus } from '../domain/eligibleSessions'

export async function loadVerdictOffer(
  currentFocus: ScopedFocus,
  excludeExecutionLogId: string,
): Promise<AdaptationDelta> {
  const reviews = await db.sessionReviews.toArray()
  return computeVerdictOffer(reviews, currentFocus, excludeExecutionLogId)
}
