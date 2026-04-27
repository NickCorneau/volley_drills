import { useCallback, useEffect, useRef } from 'react'

import { Button } from './ui'

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

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SkipReviewModal({ planName, onConfirm, onCancel }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  const getFocusable = useCallback((): HTMLElement[] => {
    const panel = panelRef.current
    if (!panel) return []
    return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }, [])

  useEffect(() => {
    previouslyFocusedRef.current = (document.activeElement as HTMLElement | null) ?? null
    // The safe-primary `Never mind` button is the first focusable
    // element inside the panel; focus it on mount so a keyboard or
    // screen-reader user lands on the non-destructive default.
    const focusable = getFocusable()
    focusable[0]?.focus()
    return () => {
      // Restore focus on close so a keyboard user lands back on the
      // Home `Skip review` link they came from.
      const prev = previouslyFocusedRef.current
      if (prev && typeof prev.focus === 'function') {
        prev.focus()
      }
    }
  }, [getFocusable])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      // If focus drifted outside the dialog (background interaction
      // before the trap engaged), pull it back inside.
      if (!active || !panelRef.current?.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel, getFocusable])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skip-review-title"
    >
      <div ref={panelRef} className="w-full max-w-[340px] rounded-[12px] bg-bg-primary p-6 shadow-lg">
        <h2 id="skip-review-title" className="text-lg font-bold text-text-primary">
          Skip review?
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Skipping leaves <span className="font-medium text-text-primary">{planName}</span> out of
          what comes next. The session is still saved to your history.
        </p>
        {/* Safe-primary first, destructive below: keeps `Never mind` as
            the default thumb-target after the modal opens, mirrors the
            `End session early?` modal's `Go back` / `End session`
            arrangement, and prevents an accidental skip-review tap from
            taking the destructive action without a second deliberate
            confirm. */}
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" fullWidth onClick={onCancel}>
            Never mind
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm}>
            Yes, skip
          </Button>
        </div>
      </div>
    </div>
  )
}
