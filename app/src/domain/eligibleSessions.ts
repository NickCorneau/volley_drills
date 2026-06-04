/**
 * M002.1 KTD10 — one definition of "a training session" and one
 * focus-attribution join, shared by the staleness backlog (U1) and the
 * weekly receipt (U7) so the two surfaces can never drift on what
 * counts.
 *
 * Pure domain module: imports only model + sibling domain, never
 * `db/` / `services/` / React. The loader (a service or the Home hook)
 * does the Dexie read — review rows joined to their `SessionPlan`
 * blocks — and passes the result in.
 *
 * Eligibility mirrors the existing adaptation gate: a session counts
 * only when its review is `submitted` AND `eligibleForAdaptation`
 * (immediate / same-session / same-day capture window). Skipped,
 * expired, draft, and next-day-plus stubs are excluded so they never
 * reset the staleness clock, poison the adaptation fold, or inflate the
 * receipt count.
 */
import type { SessionPlanBlock, SessionReview, SkillFocus } from '../model'
import { inferSessionFocus } from './sessionFocus'

/**
 * The focuses the v1 backlog ranks (F3). `movement`/`conditioning` are
 * never recorded as a session focus and `warmup`/`recovery` are
 * focus-agnostic slots, so staleness ranks only these three. A fuller
 * taxonomy waits on the versioned-taxonomy milestone.
 */
export const SCOPED_FOCUSES = ['pass', 'serve', 'set'] as const

export type ScopedFocus = (typeof SCOPED_FOCUSES)[number]

export function isScopedFocus(focus: SkillFocus | 'partial'): focus is ScopedFocus {
  return focus === 'pass' || focus === 'serve' || focus === 'set'
}

/**
 * A review paired with its plan's blocks — the raw join the loader
 * produces (review row + the `SessionPlan` it links to via
 * `executionLogId` → `ExecutionLog.planId`). Focus attribution needs
 * the plan because `SessionReview` carries no focus of its own.
 */
export interface ReviewWithPlan {
  review: SessionReview
  planBlocks: readonly SessionPlanBlock[]
}

/**
 * An eligible, focus-attributed, in-scope training session reduced to
 * the two facts staleness and the receipt care about: which focus it
 * trained and when. `trainedAt` is the review's `submittedAt` (the
 * completion timestamp); v1 accepts that as the training time.
 */
export interface AttributedTrainingSession {
  focus: ScopedFocus
  trainedAt: number
}

/**
 * The single "what counts as a training session" filter (KTD10 / F2).
 * Excludes anything that is not a submitted, adaptation-eligible review.
 */
export function eligibleTrainingSessions(reviews: readonly SessionReview[]): SessionReview[] {
  return reviews.filter(
    (review) => review.status === 'submitted' && review.eligibleForAdaptation === true,
  )
}

/**
 * Reduce raw review+plan joins to eligible, focus-attributed, in-scope
 * sessions. Sessions whose `main_skill` focus is `partial` or outside
 * pass/serve/set (F11 accepts the `skillFocus[0]` approximation) are
 * dropped — they contribute to no focus's staleness clock, by design.
 */
export function attributeTrainingSessions(
  input: readonly ReviewWithPlan[],
): AttributedTrainingSession[] {
  const eligibleIds = new Set(
    eligibleTrainingSessions(input.map((entry) => entry.review)).map((review) => review.id),
  )
  const attributed: AttributedTrainingSession[] = []
  for (const { review, planBlocks } of input) {
    if (!eligibleIds.has(review.id)) continue
    const focus = inferSessionFocus(planBlocks)
    if (!isScopedFocus(focus)) continue
    attributed.push({ focus, trainedAt: review.submittedAt })
  }
  return attributed
}
