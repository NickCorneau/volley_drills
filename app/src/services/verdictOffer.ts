/**
 * M002.1 U5 — load the fresh accept/keep verdict offer for the session
 * being reviewed. Thin Dexie read; the offer computation is pure domain
 * (`computeVerdictOffer`). The current session is excluded by
 * `excludeExecutionLogId` because it is not yet submitted.
 *
 * Trust-loop U2 (R15/KTD4): the offer is position-aware. The position
 * derives through the `loadStressPositions` seam with this service's
 * already-loaded reviews prefetched, so the gate can never diverge
 * from the steering input (D150 single seam). The resolved position
 * for the focus returns alongside the offer so the Review accept-
 * consequence caption (U3) reuses the same fold instead of a second
 * read.
 */
import { db } from '../db'
import type { AdaptationDelta } from '../db/types'
import { computeVerdictOffer } from '../domain/adaptation/verdictOffer'
import type { ScopedFocus } from '../domain/eligibleSessions'
import { loadStressPositions } from './stressPositions'

export interface VerdictOfferResult {
  offer: AdaptationDelta
  /** Current derived ladder position for `currentFocus`. */
  position: number
}

export async function loadVerdictOffer(
  currentFocus: ScopedFocus,
  excludeExecutionLogId: string,
): Promise<VerdictOfferResult> {
  const reviews = await db.sessionReviews.toArray()
  const positions = await loadStressPositions(reviews)
  const offer = computeVerdictOffer(reviews, currentFocus, excludeExecutionLogId, positions)
  return { offer, position: positions[currentFocus] }
}
