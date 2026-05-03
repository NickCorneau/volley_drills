import { ActionOverlay, Button } from './ui'

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
 * Focus management (red-team adversarial finding, 2026-04-27): the
 * modal autofocuses the safe-primary `Never mind` button on mount,
 * traps keyboard focus inside the dialog while open (Tab + Shift+Tab
 * cycle through the dialog's focusable elements), and restores focus
 * to whatever element opened it (typically the Home `Skip review`
 * link) on close. Without focus management, a keyboard or screen-
 * reader user who tabs past the destructive `Yes, skip` button lands
 * on the underlying Home page elements while the dialog is still
 * up - structurally undermining the `aria-modal` contract and making
 * the destructive confirm easier to mis-tap. The implementation
 * mirrors WAI-ARIA Authoring Practices for dialogs (focus trap +
 * restore-on-close); ESC dismissal stays as before.
 */

interface Props {
  /** Plan name, shown so the tester knows which session they're skipping. */
  planName: string
  onConfirm: () => void
  onCancel: () => void
}

export function SkipReviewModal({ planName, onConfirm, onCancel }: Props) {
  return (
    <ActionOverlay
      title="Skip review?"
      description={
        <>
          Skipping leaves <span className="font-medium text-text-primary">{planName}</span> out of
          what comes next. The session is still saved to your history.
        </>
      }
      onDismiss={onCancel}
    >
      {/* Safe-primary first: keeps `Never mind` as the default keyboard
          and thumb target after the modal opens. */}
      <div className="mt-6 flex flex-col gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={onCancel}
          data-action-overlay-initial-focus="true"
        >
          Never mind
        </Button>
        <Button variant="danger" fullWidth onClick={onConfirm}>
          Yes, skip
        </Button>
      </div>
    </ActionOverlay>
  )
}
