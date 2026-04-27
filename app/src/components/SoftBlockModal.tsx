import { useEffect } from 'react'
import type { PendingReview } from '../services/session'
import { Button } from './ui'

/**
 * D-C1 soft-block modal (C-4 Unit 4).
 *
 * Fires on a non-review CTA tap while a review is pending. The
 * dismissal contract differentiates two close paths so the modal can
 * re-fire when appropriate (red-team fix plan v3 §A7):
 *
 * - **Finish review** -> `onFinish` - navigate to the review flow. Does
 *   NOT mark the dismissal; a tester who finishes will land in the
 *   normal review UI.
 * - **Skip review and continue** -> `onSkipAndContinue` - persist the
 *   dismissal via `storageMeta.ux.softBlockDismissed.{execId}` (A7
 *   helper from C-1), then invoke the deferred non-review action. The
 *   modal won't fire again for this `execId`.
 * - **Close (X / ESC)** -> `onClose` - dismiss THIS mounting without
 *   marking. Next non-review tap re-fires the modal. This is the key
 *   distinction adv-3 called out: accidental closes must not silently
 *   accept the skip.
 *
 * The wrapper HomeScreen (Unit 5) owns the state that controls the
 * modal's mount; this component only renders when visible.
 */

interface Props {
  pendingReview: PendingReview
  onFinish: () => void
  onSkipAndContinue: () => void
  onClose: () => void
}

export function SoftBlockModal({ pendingReview, onFinish, onSkipAndContinue, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="softblock-title"
    >
      <div className="relative w-full max-w-[340px] rounded-[12px] bg-bg-primary p-6 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-text-primary/5 hover:text-text-primary active:bg-text-primary/10 active:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          &times;
        </button>
        <h2 id="softblock-title" className="text-lg font-bold text-text-primary">
          Finish your review first?
        </h2>
        <p className="mt-3 text-sm text-text-secondary">
          You have a review pending for{' '}
          <span className="font-medium text-text-primary">{pendingReview.planName}</span>. Finish it
          first, or skip and continue?
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" fullWidth onClick={onFinish}>
            Finish review
          </Button>
          <Button variant="outline" fullWidth onClick={onSkipAndContinue}>
            Skip review and continue
          </Button>
        </div>
      </div>
    </div>
  )
}
