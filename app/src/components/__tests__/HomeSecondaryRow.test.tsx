import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { PendingReview } from '../../services/session'
import type { SessionDraft } from '../../db'
import { HomeSecondaryRow } from '../HomeSecondaryRow'

/**
 * C-4 Unit 3: `HomeSecondaryRow` is a compact variant-driven `<li>`.
 * Two variants: review_pending_advisory and draft. Content is minimal
 * (not a full card) - one CTA per row.
 *
 * D158 (2026-06-12): the `last_complete` variant was retired with the
 * Home Repeat affordance it carried; last-session context lives in the
 * Recent sessions list.
 */

const pr: PendingReview = {
  executionId: 'exec-pr',
  planName: 'Pair + Net',
  completedAt: 1,
  deferralRemainingMs: 0,
}

const dr: SessionDraft = {
  id: 'current',
  context: {
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: false,
  },
  archetypeId: 'solo_open',
  archetypeName: 'Solo + Open',
  blocks: [],
  updatedAt: 1,
}

describe('HomeSecondaryRow (C-4 Unit 3)', () => {
  it('review_pending_advisory: Finish review CTA', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()

    render(
      <ul>
        <HomeSecondaryRow variant="review_pending_advisory" data={pr} onFinish={onFinish} />
      </ul>,
    )

    expect(screen.getByRole('listitem')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /finish review/i }))
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('draft: Continue CTA + archetype label', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    render(
      <ul>
        <HomeSecondaryRow variant="draft" data={dr} onOpen={onOpen} />
      </ul>,
    )

    expect(screen.getByText(/solo \+ open/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^continue$/i }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
})
