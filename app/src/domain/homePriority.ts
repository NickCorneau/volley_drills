/**
 * C-4 Unit 2: Home priority model (pure functions).
 *
 * Codifies the flat 4-row precedence table from the C-4 plan and the
 * UX spec Surface 2:
 *
 *   resume > review_pending > draft > last_complete > new_user
 *
 * No age-tier branching (H11 / C5 cuts); no Home/NewUser welcome screen
 * (H9); no multi-pending count UI (C6). Secondary rows display active
 * non-primary states so the tester can still see/act on them.
 *
 * The functions are pure over `FlagSummary` so the 16-combination
 * property test in `homePriority.test.ts` can exhaustively cover the
 * state space.
 */

export type PrimaryVariant = 'resume' | 'review_pending' | 'draft' | 'last_complete' | 'new_user'

export type SecondaryRow =
  | { kind: 'review_pending_advisory' }
  | { kind: 'draft' }
  | { kind: 'last_complete' }

export interface FlagSummary {
  resume: boolean
  reviewPending: boolean
  draft: boolean
  lastComplete: boolean
}

export function selectPrimaryCard(flags: FlagSummary): PrimaryVariant {
  if (flags.resume) return 'resume'
  if (flags.reviewPending) return 'review_pending'
  if (flags.draft) return 'draft'
  if (flags.lastComplete) return 'last_complete'
  return 'new_user'
}

export function selectSecondaryRows(flags: FlagSummary): SecondaryRow[] {
  // Resume mutes everything - the tester is mid-session, only Resume or
  // Discard matter.
  if (flags.resume) return []

  const primary = selectPrimaryCard(flags)
  const rows: SecondaryRow[] = []

  // When Review Pending is primary, surface any other active states so
  // the tester can see the draft or last-complete context without
  // finishing the review first.
  if (primary === 'review_pending') {
    if (flags.draft) rows.push({ kind: 'draft' })
    if (flags.lastComplete) rows.push({ kind: 'last_complete' })
  }

  // When Draft is primary, last-complete provides useful context for the
  // Repeat path (C-5).
  if (primary === 'draft' && flags.lastComplete) {
    rows.push({ kind: 'last_complete' })
  }

  // `draft` or `last_complete` primary with `reviewPending` true is
  // unreachable by the precedence function above - reviewPending always
  // takes primary before them. Documented here so a future reader
  // doesn't try to reintroduce a review_pending_advisory secondary row
  // without first revising the precedence.

  return rows
}

export { type FlagSummary as HomePriorityFlags }
