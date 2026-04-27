import type { PendingReview } from '../../services/session'
import { Button } from '../ui'
import { LINK_BELOW_PRIMARY_CLASS, PRIMARY_CARD_CLASS } from './cardStyles'

export interface ReviewPendingCardProps {
  data: PendingReview
  confirmingSkip: boolean
  onFinish: () => void
  /** First-tap handler: flips into the two-step confirm row. */
  onSkip: () => void
  /** Second-tap handler: actually writes the skipped stub. */
  onConfirmSkip: () => void
  /** Cancels the confirm row without writing anything. */
  onCancelSkip: () => void
}

export function ReviewPendingCard({
  data,
  confirmingSkip,
  onFinish,
  onSkip,
  onConfirmSkip,
  onCancelSkip,
}: ReviewPendingCardProps) {
  return (
    <section role="region" aria-label="Review pending" className={PRIMARY_CARD_CLASS}>
      <div>
        {/* 2026-04-26 pre-D91 editorial polish (F11): eyebrow voice
            aligned with the card's `aria-label="Review pending"` and
            the SoftBlockModal "review pending for {planName}" copy.
            The previous "Review your last session" string read as a
            polite invitation rather than the unfinished-obligation
            state this card actually represents. See
            `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 1. */}
        <p className="text-sm font-medium text-text-secondary">Review pending</p>
        <p className="mt-1 text-sm font-medium text-text-primary">{data.planName}</p>
      </div>
      <Button variant="primary" fullWidth onClick={onFinish}>
        Finish review
      </Button>
      {!confirmingSkip ? (
        <Button variant="link" onClick={onSkip} className={LINK_BELOW_PRIMARY_CLASS}>
          Skip review
        </Button>
      ) : (
        <div className="flex flex-col gap-2 rounded-[12px] bg-bg-warm p-3">
          <p className="text-center text-sm text-text-secondary">
            Skipping leaves this session out of what comes next.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onCancelSkip}>
              Never mind
            </Button>
            <Button variant="danger" className="flex-1" onClick={onConfirmSkip}>
              Yes, skip
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
