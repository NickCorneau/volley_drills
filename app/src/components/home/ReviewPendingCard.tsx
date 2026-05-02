import type { PendingReview } from '../../services/session'
import { Button } from '../ui'
import { LINK_BELOW_PRIMARY_CLASS, PRIMARY_CARD_CLASS } from './cardStyles'

export interface ReviewPendingCardProps {
  data: PendingReview
  onFinish: () => void
  /**
   * Skip-review tap. The parent (`HomeScreen`) opens a centered
   * `SkipReviewModal` in response; the card itself no longer hosts
   * an inline two-step confirm row (2026-04-27 reconciled-list `R11`).
   */
  onSkip: () => void
}

export function ReviewPendingCard({ data, onFinish, onSkip }: ReviewPendingCardProps) {
  return (
    <section role="region" aria-label="Review pending" className={PRIMARY_CARD_CLASS}>
      <div>
        {/* 2026-04-26 pre-D91 editorial polish (F11): eyebrow voice
            aligned with the card's `aria-label="Review pending"` and
            the SoftBlockModal "review pending for {planName}" copy.
            See `docs/archive/plans/2026-04-26-pre-d91-editorial-polish.md` Item 1. */}
        <p className="text-sm font-semibold text-text-primary">Finish the quick review.</p>
        <p className="mt-2 text-sm text-text-secondary">{data.planName}</p>
      </div>
      <Button variant="primary" fullWidth onClick={onFinish}>
        Finish review
      </Button>
      <Button variant="link" onClick={onSkip} className={LINK_BELOW_PRIMARY_CLASS}>
        Skip review
      </Button>
    </section>
  )
}
