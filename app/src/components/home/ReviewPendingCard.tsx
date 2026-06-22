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
      {/* T1 shibui (2026-06-22): the "Finish the quick review." line restated
          the "Finish review" button; the card now leads with the plan name
          (its meaningful value) and lets the button carry the action. The
          section `aria-label="Review pending"` keeps the framing for SR. */}
      <p className="text-sm font-semibold text-text-primary">{data.planName}</p>
      <Button variant="primary" fullWidth onClick={onFinish}>
        Finish review
      </Button>
      <Button variant="link" onClick={onSkip} className={LINK_BELOW_PRIMARY_CLASS}>
        Skip review
      </Button>
    </section>
  )
}
