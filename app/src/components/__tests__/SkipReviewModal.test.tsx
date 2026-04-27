import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SkipReviewModal } from '../SkipReviewModal'

/**
 * 2026-04-27 reconciled-list `R11`: Skip-review confirm modal.
 *
 * The previous in-card two-step row was tested inside HomePrimaryCard
 * (`review_pending` variant). The behavior moved here when the confirm
 * lifted into a centered role=dialog modal that mirrors the rest of
 * the app's destructive-modal language (`End session early?`,
 * `ResumePrompt`, `SoftBlockModal`).
 *
 * This file pins the contract:
 *  - role=dialog + aria-modal=true + aria-labelledby (a11y for the
 *    "this is a dialog you must answer" announcement),
 *  - safe-primary-first / danger-below button order (matches
 *    `End session early?`),
 *  - Esc key cancels (matches SoftBlockModal),
 *  - the plan name is rendered in the body (so the user knows which
 *    session is about to be skipped — the source of truth previously
 *    on the Home card surface).
 */

describe('SkipReviewModal (R11)', () => {
  it('carries dialog a11y semantics (role=dialog + aria-modal + aria-labelledby)', () => {
    render(<SkipReviewModal planName="Solo + Wall" onConfirm={() => {}} onCancel={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const title = document.getElementById(labelledBy!)
    expect(title).toBeInTheDocument()
    expect(title!.textContent).toMatch(/skip review\?/i)
  })

  it('renders the plan name in the body so the user knows which session is being skipped', () => {
    render(
      <SkipReviewModal planName="Beach Prep Three" onConfirm={() => {}} onCancel={() => {}} />,
    )
    expect(screen.getByText(/beach prep three/i)).toBeInTheDocument()
  })

  it('Yes, skip -> onConfirm; Never mind -> onCancel; neither cross-fires', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <SkipReviewModal planName="Solo + Wall" onConfirm={onConfirm} onCancel={onCancel} />,
    )

    await user.click(screen.getByRole('button', { name: /never mind/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /yes, skip/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1) // unchanged
  })

  it('Esc closes via onCancel (matches SoftBlockModal)', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(<SkipReviewModal planName="Solo + Wall" onConfirm={onConfirm} onCancel={onCancel} />)

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  // Safe-primary-first contract: the FIRST button in tab order is
  // `Never mind` (the safe close). This mirrors `End session early?`
  // on RunScreen and keeps the destructive `Yes, skip` behind a
  // deliberate second tap, not the default thumb-target after the
  // modal opens.
  it('renders Never mind ABOVE Yes, skip (safe-primary-first)', () => {
    render(<SkipReviewModal planName="Solo + Wall" onConfirm={() => {}} onCancel={() => {}} />)

    const buttons = screen.getAllByRole('button')
    const labels = buttons.map((b) => b.textContent?.trim() ?? '')
    const neverMindIdx = labels.findIndex((l) => /never mind/i.test(l))
    const yesSkipIdx = labels.findIndex((l) => /yes, skip/i.test(l))
    expect(neverMindIdx).toBeGreaterThan(-1)
    expect(yesSkipIdx).toBeGreaterThan(-1)
    expect(neverMindIdx).toBeLessThan(yesSkipIdx)
  })

  /**
   * Focus management (red-team adversarial finding, 2026-04-27):
   * the dialog must autofocus the safe-primary button on mount, trap
   * Tab + Shift+Tab inside the dialog while open, and restore focus
   * to the previously-focused element on close. Mirrors WAI-ARIA
   * Authoring Practices for `role=dialog` + `aria-modal=true`.
   */
  describe('focus management (red-team adversarial finding 2026-04-27)', () => {
    it('autofocuses Never mind on mount so a keyboard user lands on the safe default', () => {
      render(<SkipReviewModal planName="Solo + Wall" onConfirm={() => {}} onCancel={() => {}} />)
      const neverMind = screen.getByRole('button', { name: /never mind/i })
      expect(document.activeElement).toBe(neverMind)
    })

    it('traps Tab inside the dialog: Tab on Yes, skip wraps back to Never mind', async () => {
      const user = userEvent.setup()
      render(<SkipReviewModal planName="Solo + Wall" onConfirm={() => {}} onCancel={() => {}} />)

      const neverMind = screen.getByRole('button', { name: /never mind/i })
      const yesSkip = screen.getByRole('button', { name: /yes, skip/i })

      // Mount focuses Never mind.
      expect(document.activeElement).toBe(neverMind)

      await user.tab()
      expect(document.activeElement).toBe(yesSkip)

      // Tab on the last focusable should wrap back to the first.
      await user.tab()
      expect(document.activeElement).toBe(neverMind)
    })

    it('traps Shift+Tab inside the dialog: Shift+Tab on Never mind wraps to Yes, skip', async () => {
      const user = userEvent.setup()
      render(<SkipReviewModal planName="Solo + Wall" onConfirm={() => {}} onCancel={() => {}} />)

      const neverMind = screen.getByRole('button', { name: /never mind/i })
      const yesSkip = screen.getByRole('button', { name: /yes, skip/i })

      expect(document.activeElement).toBe(neverMind)

      await user.tab({ shift: true })
      expect(document.activeElement).toBe(yesSkip)
    })

    it('restores focus to the previously-focused element on unmount', () => {
      // Render an opener button that "owns" focus before the modal mounts.
      const Opener = ({ open }: { open: boolean }) => (
        <>
          <button data-testid="opener">Skip review</button>
          {open && (
            <SkipReviewModal planName="Solo + Wall" onConfirm={() => {}} onCancel={() => {}} />
          )}
        </>
      )
      const { rerender } = render(<Opener open={false} />)
      const opener = screen.getByTestId('opener')
      opener.focus()
      expect(document.activeElement).toBe(opener)

      rerender(<Opener open={true} />)
      // Modal should have stolen focus to its safe-primary button.
      const neverMind = screen.getByRole('button', { name: /never mind/i })
      expect(document.activeElement).toBe(neverMind)

      // Closing the modal restores focus to the opener.
      rerender(<Opener open={false} />)
      expect(document.activeElement).toBe(opener)
    })
  })
})
