import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { PendingReview } from '../../services/session'
import { SoftBlockModal } from '../SoftBlockModal'

/**
 * C-4 Unit 4 (D-C1): soft-block modal fires on non-review CTA tap while
 * a review is pending. Keyboard + click behavior must match the
 * ResumePrompt's existing overlay pattern:
 * - role="dialog" + aria-modal="true" + aria-labelledby
 * - Primary "Finish review" → onFinish
 * - Secondary "Skip review and continue" → onSkipAndContinue (marks the
 *   dismissal; next non-review tap will no longer intercept)
 * - Dismissal X → onClose (does NOT mark; modal can re-fire)
 * - ESC key closes
 */

const pr: PendingReview = {
  executionId: 'exec-sbm',
  planName: 'Pair + Net',
  completedAt: 1_700_000_000_000,
  deferralRemainingMs: 60 * 60_000,
}

describe('SoftBlockModal (C-4 Unit 4 / D-C1)', () => {
  it('renders role=dialog with aria-modal and a labelled heading', () => {
    render(
      <SoftBlockModal
        pendingReview={pr}
        onFinish={() => {}}
        onSkipAndContinue={() => {}}
        onClose={() => {}}
      />,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('heading', { name: /finish.*review first/i })).toBeInTheDocument()
    // Copy mentions the specific session so the tester knows which
    // review is blocking them.
    expect(screen.getByText(/pair \+ net/i)).toBeInTheDocument()
  })

  it('Finish review button invokes onFinish, not onSkipAndContinue', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    const onSkipAndContinue = vi.fn()

    render(
      <SoftBlockModal
        pendingReview={pr}
        onFinish={onFinish}
        onSkipAndContinue={onSkipAndContinue}
        onClose={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: /finish review/i }))
    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onSkipAndContinue).not.toHaveBeenCalled()
  })

  it('Skip review and continue invokes onSkipAndContinue', async () => {
    const user = userEvent.setup()
    const onSkip = vi.fn()

    render(
      <SoftBlockModal
        pendingReview={pr}
        onFinish={() => {}}
        onSkipAndContinue={onSkip}
        onClose={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: /skip review and continue/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })

  it('Close (X) invokes onClose WITHOUT marking the dismissal', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSkip = vi.fn()

    render(
      <SoftBlockModal
        pendingReview={pr}
        onFinish={() => {}}
        onSkipAndContinue={onSkip}
        onClose={onClose}
      />,
    )

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
    // Important: onSkipAndContinue marks the dismissal. onClose does NOT.
    // If this test fails the modal would stop re-firing after a close,
    // which is the wrong contract (the tester didn't actively accept the
    // skip - they just dismissed the prompt).
    expect(onSkip).not.toHaveBeenCalled()
  })

  it('ESC key triggers onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <SoftBlockModal
        pendingReview={pr}
        onFinish={() => {}}
        onSkipAndContinue={() => {}}
        onClose={onClose}
      />,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
