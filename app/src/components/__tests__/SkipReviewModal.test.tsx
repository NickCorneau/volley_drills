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
})
