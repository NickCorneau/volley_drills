import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { LastCompleteBundle, PendingReview } from '../../services/session'
import type { SessionDraft } from '../../db'
import { HomeSecondaryRow } from '../HomeSecondaryRow'

/**
 * C-4 Unit 3: `HomeSecondaryRow` is a compact variant-driven `<li>`.
 * Three variants: review_pending_advisory, draft, last_complete.
 * Content is minimal (not a full card) - one CTA per row.
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

const lc: LastCompleteBundle = {
  log: {
    id: 'exec-lc',
    planId: 'plan-lc',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1,
    completedAt: 1_700_000_000_000,
  },
  plan: {
    id: 'plan-lc',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 1,
  },
  review: {
    id: 'review-exec-lc',
    executionLogId: 'exec-lc',
    sessionRpe: 5,
    goodPasses: 3,
    totalAttempts: 5,
    submittedAt: 1_700_000_000_000,
    status: 'submitted',
  },
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

  it('draft: Review CTA + archetype label', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    render(
      <ul>
        <HomeSecondaryRow variant="draft" data={dr} onOpen={onOpen} />
      </ul>,
    )

    expect(screen.getByText(/solo \+ open/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^review$/i }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('last_complete: Repeat CTA + preset label', async () => {
    const user = userEvent.setup()
    const onRepeat = vi.fn()

    render(
      <ul>
        <HomeSecondaryRow variant="last_complete" data={lc} onRepeat={onRepeat} />
      </ul>,
    )

    expect(screen.getByText(/solo \+ wall/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^repeat$/i }))
    expect(onRepeat).toHaveBeenCalledTimes(1)
  })
})
