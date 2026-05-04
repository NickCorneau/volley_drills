import { useRef, type ReactNode } from 'react'
import { ActionOverlay } from '../ui/ActionOverlay'
import { Button, type ButtonVariant } from '../ui/Button'

export type ConfirmAction = {
  label: string
  onClick: () => void
  /** Defaults to `'primary'` for `safeAction`, `'danger'` for `destructiveAction`. */
  variant?: ButtonVariant
  disabled?: boolean
}

export type ConfirmModalPlacement = 'centered' | 'bottom-sheet'

export type ConfirmModalProps = {
  title: string
  description?: ReactNode
  /**
   * The safe-primary action (always present). Receives initial focus on mount
   * via the U2 typed-focus seam, regardless of DOM order. Default variant is
   * `'primary'` (the focal CTA).
   */
  safeAction: ConfirmAction
  /**
   * Optional secondary action, rendered below safe-primary. Default variant
   * is `'danger'`. Override (e.g., `'outline'` for SoftBlockModal's "Skip
   * review and continue") by passing `variant` explicitly.
   */
  destructiveAction?: ConfirmAction
  onDismiss: () => void
  /** Defaults to `'dialog'`; pass `'alertdialog'` for screen-reader-asserted blocks. */
  role?: 'dialog' | 'alertdialog'
  /**
   * `'centered'` (default) is the standard centered modal positioning.
   * `'bottom-sheet'` (RunScreen end-session) anchors the panel to the
   * bottom of the viewport and uses the canonical
   * `items-end px-4 pb-8 pt-4` positioning the existing pattern uses.
   */
  placement?: ConfirmModalPlacement
  showCloseButton?: boolean
  /** Optional override for the X-close affordance's accessible name. */
  closeLabel?: string
}

const PLACEMENT_OVERLAY_CLASS: Record<ConfirmModalPlacement, string | undefined> = {
  centered: undefined,
  'bottom-sheet': 'items-end bg-black/40 px-4 pb-8 pt-4',
}

const PLACEMENT_PANEL_CLASS: Record<ConfirmModalPlacement, string | undefined> = {
  centered: undefined,
  'bottom-sheet': 'max-w-[390px] rounded-[16px]',
}

/**
 * Plan U8 (2026-05-04): the canonical "title + description + safe-primary
 * + optional destructive-secondary" composition over `ActionOverlay`.
 * Internally creates a ref for the safe-primary button and threads it
 * through `ActionOverlay`'s `initialFocusRef` (U2 seam), so the
 * `data-action-overlay-initial-focus` string-attribute contract is gone.
 *
 * Replaces the inline modal shapes in `SoftBlockModal`, `SkipReviewModal`,
 * the `RunScreen` end-session sheet (`placement="bottom-sheet"`), and
 * `ResumePrompt`'s discard-state confirm step.
 *
 * `ResumePrompt`'s outer "Session in progress" surface keeps using raw
 * `ActionOverlay` (heavier content shape than a confirm — paused-block
 * meta + interrupted-ago line); only its discard step uses ConfirmModal.
 */
export function ConfirmModal({
  title,
  description,
  safeAction,
  destructiveAction,
  onDismiss,
  role,
  placement = 'centered',
  showCloseButton,
  closeLabel,
}: ConfirmModalProps) {
  const safeRef = useRef<HTMLButtonElement>(null)

  return (
    <ActionOverlay
      title={title}
      description={description}
      role={role}
      onDismiss={onDismiss}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
      initialFocusRef={safeRef}
      className={PLACEMENT_OVERLAY_CLASS[placement]}
      panelClassName={PLACEMENT_PANEL_CLASS[placement]}
    >
      <div className="mt-6 flex flex-col gap-3">
        <Button
          variant={safeAction.variant ?? 'primary'}
          fullWidth
          ref={safeRef}
          disabled={safeAction.disabled}
          onClick={safeAction.onClick}
        >
          {safeAction.label}
        </Button>
        {destructiveAction && (
          <Button
            variant={destructiveAction.variant ?? 'danger'}
            fullWidth
            disabled={destructiveAction.disabled}
            onClick={destructiveAction.onClick}
          >
            {destructiveAction.label}
          </Button>
        )}
      </div>
    </ActionOverlay>
  )
}
