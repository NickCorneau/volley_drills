/**
 * M002.1 / Home-coherence — focus attribution over the two bases Home
 * cares about. Pure domain module: imports only model + sibling domain,
 * never `db/` / `services/` / React. The loader does the Dexie read and
 * passes plain arrays in.
 *
 * Two deliberately-separate bases:
 *
 *  - `eligibleTrainingSessions` (the ADAPTATION basis): a review counts
 *    only when it is `submitted` AND `eligibleForAdaptation` (immediate /
 *    same-session / same-day capture window). It gates the weekly receipt
 *    count (composeReceipt) and the adaptation fold so a skipped/expired/
 *    next-day stub never poisons an offered verdict or inflates the count.
 *
 *  - `attributeTrainedSessions` (the PLAN-ORDERING basis): every terminal
 *    session the user actually ran — `completed` or `ended_early`, minus
 *    discarded-resume stubs — attributed to its `main_skill` focus. This
 *    is the SAME basis the Home "Recent sessions" list reads, so the
 *    plan's next-focus / fresh-start can never disagree with the history
 *    the user sees. It intentionally does NOT require a finalized review:
 *    a session you trained but never reviewed still moves its focus's
 *    staleness clock.
 *
 * Keeping the two bases apart is the coherence fix — adaptation stays
 * conservative (eligible reviews only) while the plan reflects what was
 * trained.
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
 * A terminal session paired with its (override-applied) plan blocks and
 * the moment it ended — the raw join the loader produces from an
 * `ExecutionLog` + its `SessionPlan`. Focus attribution needs the blocks
 * because the log carries no focus of its own; `endedAt` is the log's
 * `completedAt ?? startedAt`, matching the Recent-sessions clock.
 */
export interface TerminalSessionWithPlan {
  endedAt: number
  planBlocks: readonly SessionPlanBlock[]
  /**
   * Whether the log contains at least one completed block. Zero-work
   * terminal sessions (skip-everything, zero-work ends) must not move a
   * focus's staleness clock — nothing was trained.
   */
  hasCompletedBlock: boolean
}

/**
 * A focus-attributed, in-scope training session reduced to the two facts
 * staleness cares about: which focus it trained and when.
 */
export interface AttributedTrainingSession {
  focus: ScopedFocus
  trainedAt: number
}

/**
 * The adaptation/receipt eligibility filter (F2): a review counts only
 * when it is a submitted, adaptation-eligible row. Skipped, draft,
 * expired, and next-day-plus stubs are excluded so they never poison the
 * adaptation fold or inflate the weekly receipt count.
 */
export function eligibleTrainingSessions(reviews: readonly SessionReview[]): SessionReview[] {
  return reviews.filter(
    (review) => review.status === 'submitted' && review.eligibleForAdaptation === true,
  )
}

/**
 * Reduce terminal sessions to focus-attributed, in-scope training
 * sessions for the staleness backlog / plan projection. This is the
 * plan-ordering basis: it counts every session the user actually ran,
 * review or not, so the plan's next-focus stays coherent with the
 * Recent-sessions list. Sessions whose `main_skill` focus is `partial`
 * or outside pass/serve/set (F11 accepts the `skillFocus[0]`
 * approximation) are dropped — they contribute to no focus's staleness
 * clock, by design.
 */
export function attributeTrainedSessions(
  input: readonly TerminalSessionWithPlan[],
): AttributedTrainingSession[] {
  const attributed: AttributedTrainingSession[] = []
  for (const { endedAt, planBlocks, hasCompletedBlock } of input) {
    if (!hasCompletedBlock) continue
    const focus = inferSessionFocus(planBlocks)
    if (!isScopedFocus(focus)) continue
    attributed.push({ focus, trainedAt: endedAt })
  }
  return attributed
}
