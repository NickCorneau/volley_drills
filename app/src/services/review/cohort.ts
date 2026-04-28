import { db } from '../../db/schema'
import { getStorageMeta } from '../storageMeta'

const isCohortTimestamp = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0

/**
 * Total count of `SessionReview` records with `status === 'submitted'`,
 * bounded to the v0b cohort when a sentinel exists.
 *
 * Feeds the C-2 default-case summary line (`"Session {N}. ..."`). Drafts
 * and skipped stubs are excluded per H10 / H14 / H18: only submitted
 * reviews represent an adaptation-eligible completion.
 *
 * Cohort bound (adversarial finding adv-5 fix): when
 * `storageMeta.onboarding.completedAt` is set, filter records to
 * `submittedAt >= completedAt`. This prevents migrated v3 reviews from
 * inflating Session {N} on a migrated tester's first v0b submission.
 * The C-0 backfill writes the sentinel at v4 upgrade time for any device
 * with pre-existing `ExecutionLog` records (H15); C-3 will write it on
 * fresh-install first-Build. If the sentinel is absent (pre-C-3 cold
 * state or a tester who never completed onboarding), fall back to
 * counting all submitted records - preserving the current contract.
 *
 * In-memory filter over the whole table because D91 cohort record counts
 * are bounded at ~20 per tester and Dexie doesn't index `status`. Matches
 * the `findPendingReview` read pattern.
 */
export async function countSubmittedReviews(): Promise<number> {
  const [all, cohortStartedAt] = await Promise.all([
    db.sessionReviews.toArray(),
    getStorageMeta('onboarding.completedAt', isCohortTimestamp),
  ])
  const submitted = all.filter((r) => r.status === 'submitted')
  if (cohortStartedAt == null) return submitted.length
  return submitted.filter((r) => r.submittedAt >= cohortStartedAt).length
}
