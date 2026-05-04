import type { PendingReview } from '../services/session'
import { ConfirmModal } from './ui'

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
 *
 * Plan U8 (2026-05-04): the title + description + safe-primary +
 * outline-secondary shape now lives on `ConfirmModal`. The
 * `data-action-overlay-initial-focus` string-attribute contract is
 * gone; ConfirmModal threads its own ref through ActionOverlay's typed
 * focus seam.
 */

interface Props {
  pendingReview: PendingReview
  onFinish: () => void
  onSkipAndContinue: () => void
  onClose: () => void
}

export function SoftBlockModal({ pendingReview, onFinish, onSkipAndContinue, onClose }: Props) {
  return (
    <ConfirmModal
      title="Finish your review first?"
      description={
        <>
          You have a review pending for{' '}
          <span className="font-medium text-text-primary">{pendingReview.planName}</span>. Finish
          it first, or skip and continue?
        </>
      }
      safeAction={{ label: 'Finish review', onClick: onFinish }}
      destructiveAction={{
        label: 'Skip review and continue',
        onClick: onSkipAndContinue,
        variant: 'outline',
      }}
      onDismiss={onClose}
      showCloseButton
    />
  )
}
