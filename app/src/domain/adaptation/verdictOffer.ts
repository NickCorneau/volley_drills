/**
 * M002.1 U5 — fresh verdict offer for the session being reviewed.
 *
 * Pure domain: builds the `replayAdaptation` input for the current
 * session's focus from PRIOR eligible sessions (the session being
 * reviewed is not yet submitted, so it is excluded), then returns the
 * offered `AdaptationDelta`. Per-session difficulty tags are attributed
 * to the focus by `focusForDrillId` over each review's perDrillCaptures
 * — only sessions that actually trained the focus contribute, so the
 * hysteresis window reflects real reps of that skill.
 */
import type { AdaptationDelta, SessionReview } from '../../model'
import { eligibleTrainingSessions, type ScopedFocus } from '../eligibleSessions'
import { focusForDrillId } from '../sessionFocus'
import { replayAdaptation, type ReplayInput } from './replayAdaptation'

export function buildVerdictReplayInput(
  reviews: readonly SessionReview[],
  currentFocus: ScopedFocus,
  excludeExecutionLogId: string,
): ReplayInput {
  const prior = eligibleTrainingSessions(reviews)
    .filter((review) => review.executionLogId !== excludeExecutionLogId)
    .sort((a, b) => a.submittedAt - b.submittedAt)

  const recentTagsForFocus: ReplayInput['recentTagsForFocus'] = []
  const recentRpe: ReplayInput['recentRpe'] = []
  for (const review of prior) {
    const tags = (review.perDrillCaptures ?? [])
      .filter((capture) => focusForDrillId(capture.drillId) === currentFocus)
      .map((capture) => capture.difficulty)
    if (tags.length === 0) continue // session did not train this focus
    recentTagsForFocus.push(tags)
    recentRpe.push(review.sessionRpe)
  }

  // Most recent prior offered+chosen verdict for this focus (F13).
  const priorVerdictReview = prior
    .filter((review) => review.offeredDelta?.focus === currentFocus && review.verdictChoice)
    .sort((a, b) => b.submittedAt - a.submittedAt)[0]
  const priorVerdict =
    priorVerdictReview && priorVerdictReview.offeredDelta && priorVerdictReview.verdictChoice
      ? { direction: priorVerdictReview.offeredDelta.direction, choice: priorVerdictReview.verdictChoice }
      : undefined

  return { currentFocus, recentTagsForFocus, recentRpe, priorVerdict }
}

export function computeVerdictOffer(
  reviews: readonly SessionReview[],
  currentFocus: ScopedFocus,
  excludeExecutionLogId: string,
): AdaptationDelta {
  return replayAdaptation(buildVerdictReplayInput(reviews, currentFocus, excludeExecutionLogId))
}
