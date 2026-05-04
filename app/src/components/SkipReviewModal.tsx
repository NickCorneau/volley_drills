import { ConfirmModal } from './ui'

/**
 * 2026-04-27 reconciled-list `R11`: Skip-review confirm modal.
 *
 * Pre-state, the Home `Review pending` primary card flipped into an
 * inline two-step row inside the same `<section>` when the user tapped
 * `Skip review` (the row replaced the link with a `Never mind` /
 * `Yes, skip` pair beneath a small `Skipping leaves this session out
 * of what comes next.` helper paragraph). That worked but read as the
 * lone in-card destructive confirm in an app whose every other
 * destructive surface (`End session early?` on RunScreen, the discard
 * confirm in `ResumePrompt`, the `Finish your review first?` prompt in
 * `SoftBlockModal`) uses a centered `role=dialog` modal.
 *
 * Post-state, the Skip-review tap opens this modal. The shape matches
 * `End session early?` (safe-primary first, danger below; `Esc`
 * closes); the surface is centered with `role=dialog` +
 * `aria-modal=true` like `ResumePrompt` and `SoftBlockModal` so screen
 * readers announce it as a dialog instead of an in-card row, and a
 * tester whose first tap on `Skip review` was off-target sees a
 * structurally distinct surface they have to actively confirm or
 * dismiss.
 *
 * The card itself simplifies (`ReviewPendingCard` no longer carries
 * `confirmingSkip` state); the modal mounts at the screen root next to
 * the existing `SoftBlockModal`.
 *
 * Plan U8 (2026-05-04): the safe-primary + danger-secondary shape now
 * lives on `ConfirmModal`. Focus management (autofocus the safe-primary
 * "Never mind", focus trap, focus restore on close) is owned by
 * ActionOverlay (the underlying primitive) via the typed
 * `initialFocusRef` seam; the `data-action-overlay-initial-focus`
 * string-attribute contract is gone.
 */

interface Props {
  /** Plan name, shown so the tester knows which session they're skipping. */
  planName: string
  onConfirm: () => void
  onCancel: () => void
}

export function SkipReviewModal({ planName, onConfirm, onCancel }: Props) {
  return (
    <ConfirmModal
      title="Skip review?"
      description={
        <>
          Skipping leaves <span className="font-medium text-text-primary">{planName}</span> out of
          what comes next. The session is still saved to your history.
        </>
      }
      safeAction={{ label: 'Never mind', onClick: onCancel }}
      destructiveAction={{ label: 'Yes, skip', onClick: onConfirm }}
      onDismiss={onCancel}
    />
  )
}
