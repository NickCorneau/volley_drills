import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { LastCompleteBundle, PendingReview, ResumableSession } from '../../services/session'
import type { SessionDraft } from '../../db'
import { HomePrimaryCard } from '../HomePrimaryCard'

/**
 * C-4 Unit 3: `HomePrimaryCard` is a variant-driven component that
 * renders exactly one primary card per the Surface 2 precedence. Each
 * variant gets its own discriminated-union prop shape so the correct
 * handlers are always paired with the correct data at the type level.
 *
 * Accessibility contract (Surface 2): the card is a
 * `<section role="region" aria-label="...">` so screen readers announce
 * its state explicitly rather than having to infer it from visible text.
 */

const fakePendingReview: PendingReview = {
  executionId: 'exec-pending',
  planName: 'Solo + Wall',
  completedAt: 1_700_000_000_000,
  deferralRemainingMs: 60 * 60 * 1000,
}

const fakeDraft: SessionDraft = {
  id: 'current',
  context: {
    playerMode: 'solo',
    timeProfile: 25,
    netAvailable: false,
    wallAvailable: true,
  },
  archetypeId: 'solo_wall',
  archetypeName: 'Solo + Wall',
  blocks: [],
  updatedAt: 1,
}

const fakeLastComplete: LastCompleteBundle = {
  log: {
    id: 'exec-last',
    planId: 'plan-last',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1,
    completedAt: 1_700_000_000_000,
  },
  plan: {
    id: 'plan-last',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 25,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 1,
  },
  review: {
    id: 'review-exec-last',
    executionLogId: 'exec-last',
    sessionRpe: 6,
    goodPasses: 12,
    totalAttempts: 20,
    submittedAt: 1_700_000_000_000,
    status: 'submitted',
  },
}

const fakeResume: ResumableSession = {
  execution: fakeLastComplete.log,
  plan: fakeLastComplete.plan,
  interruptedAt: 1_700_000_000_000,
}

describe('HomePrimaryCard (C-4 Unit 3) - variants', () => {
  it('new_user: renders Start CTA with region + aria-label', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()

    render(<HomePrimaryCard variant="new_user" onStart={onStart} />)

    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-label', expect.stringMatching(/first/i))

    await user.click(screen.getByRole('button', { name: /start first workout/i }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('review_pending: renders Finish / Skip CTAs and invokes the right handler', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    const onSkip = vi.fn()
    const onConfirmSkip = vi.fn()
    const onCancelSkip = vi.fn()

    render(
      <HomePrimaryCard
        variant="review_pending"
        data={fakePendingReview}
        confirmingSkip={false}
        onFinish={onFinish}
        onSkip={onSkip}
        onConfirmSkip={onConfirmSkip}
        onCancelSkip={onCancelSkip}
      />,
    )

    expect(screen.getByRole('region')).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/review pending/i),
    )
    expect(screen.getByText(/solo \+ wall/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /finish review/i }))
    expect(onFinish).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /^skip review$/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
    expect(onConfirmSkip).not.toHaveBeenCalled()
    expect(onCancelSkip).not.toHaveBeenCalled()
  })

  it('review_pending with confirmingSkip=true: Yes-skip -> onConfirmSkip, Never-mind -> onCancelSkip', async () => {
    const user = userEvent.setup()
    const onSkip = vi.fn()
    const onConfirmSkip = vi.fn()
    const onCancelSkip = vi.fn()

    render(
      <HomePrimaryCard
        variant="review_pending"
        data={fakePendingReview}
        confirmingSkip
        onFinish={() => {}}
        onSkip={onSkip}
        onConfirmSkip={onConfirmSkip}
        onCancelSkip={onCancelSkip}
      />,
    )

    await user.click(screen.getByRole('button', { name: /never mind/i }))
    expect(onCancelSkip).toHaveBeenCalledTimes(1)
    expect(onConfirmSkip).not.toHaveBeenCalled()
    expect(onSkip).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /yes, skip/i }))
    expect(onConfirmSkip).toHaveBeenCalledTimes(1)
    expect(onCancelSkip).toHaveBeenCalledTimes(1) // unchanged from prev click
  })

  it('draft: renders Today\u2019s suggestion + Start session + Change setup (Phase F Unit 1 rename)', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    const onEdit = vi.fn()

    render(<HomePrimaryCard variant="draft" data={fakeDraft} onStart={onStart} onEdit={onEdit} />)

    expect(screen.getByRole('region')).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/today.?s suggestion|draft/i),
    )
    expect(screen.getByText(/solo \+ wall/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /start session/i }))
    expect(onStart).toHaveBeenCalledTimes(1)

    // Phase F Unit 1: button text renamed from "Edit" to "Change setup"
    // for plainer user voice; handler prop name unchanged for
    // API-compatibility. A regression check on both the new and old
    // labels makes the rename loud.
    await user.click(screen.getByRole('button', { name: /^change setup$/i }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('button', { name: /^edit$/i })).not.toBeInTheDocument()
  })

  it('last_complete ended-early: renders TWO buttons (Repeat full N-min + Repeat what you did M min)', async () => {
    const user = userEvent.setup()
    const onRepeat = vi.fn()
    const onRepeatWhatYouDid = vi.fn()

    // Build an ended-early log with two completed blocks out of three.
    const endedEarlyBundle: LastCompleteBundle = {
      ...fakeLastComplete,
      log: {
        ...fakeLastComplete.log,
        status: 'ended_early',
        endedEarlyReason: 'time',
        blockStatuses: [
          { blockId: 'b-1', status: 'completed' },
          { blockId: 'b-2', status: 'completed' },
          { blockId: 'b-3', status: 'skipped' },
        ],
      },
      plan: {
        ...fakeLastComplete.plan,
        blocks: [
          {
            id: 'b-1',
            type: 'warmup',
            drillName: 'Warm',
            shortName: 'Warm',
            durationMinutes: 3,
            coachingCue: '',
            courtsideInstructions: '',
            required: true,
          },
          {
            id: 'b-2',
            type: 'main_skill',
            drillName: 'Pass',
            shortName: 'Pass',
            durationMinutes: 11,
            coachingCue: '',
            courtsideInstructions: '',
            required: true,
          },
          {
            id: 'b-3',
            type: 'main_skill',
            drillName: 'Serve',
            shortName: 'Serve',
            durationMinutes: 11,
            coachingCue: '',
            courtsideInstructions: '',
            required: true,
          },
        ],
      },
    }

    render(
      <HomePrimaryCard
        variant="last_complete"
        data={endedEarlyBundle}
        onRepeat={onRepeat}
        onStartDifferent={() => {}}
        onRepeatWhatYouDid={onRepeatWhatYouDid}
      />,
    )

    // Primary: "Repeat full 25-min plan" (3 + 11 + 11).
    await user.click(screen.getByRole('button', { name: /repeat full 25-min plan/i }))
    expect(onRepeat).toHaveBeenCalledTimes(1)

    // Secondary: "Repeat what you did (14 min)" (3 + 11).
    await user.click(screen.getByRole('button', { name: /repeat what you did \(14 min\)/i }))
    expect(onRepeatWhatYouDid).toHaveBeenCalledTimes(1)

    // "ended early" annotation in the body.
    expect(screen.getByText(/ended early/i)).toBeInTheDocument()

    // Phase F Unit 1: tertiary "Start a different session" renders on
    // ended-early too (single CTA set across normal + ended-early).
    expect(screen.getByRole('button', { name: /start a different session/i })).toBeInTheDocument()
  })

  it('last_complete ended-early with zero completed blocks omits the secondary button', () => {
    const zeroCompleted: LastCompleteBundle = {
      ...fakeLastComplete,
      log: {
        ...fakeLastComplete.log,
        status: 'ended_early',
        blockStatuses: [
          { blockId: 'b-1', status: 'in_progress' },
          { blockId: 'b-2', status: 'planned' },
        ],
      },
      plan: {
        ...fakeLastComplete.plan,
        blocks: [
          {
            id: 'b-1',
            type: 'warmup',
            drillName: 'Warm',
            shortName: 'Warm',
            durationMinutes: 3,
            coachingCue: '',
            courtsideInstructions: '',
            required: true,
          },
          {
            id: 'b-2',
            type: 'main_skill',
            drillName: 'Pass',
            shortName: 'Pass',
            durationMinutes: 11,
            coachingCue: '',
            courtsideInstructions: '',
            required: true,
          },
        ],
      },
    }
    render(
      <HomePrimaryCard
        variant="last_complete"
        data={zeroCompleted}
        onRepeat={() => {}}
        onStartDifferent={() => {}}
        onRepeatWhatYouDid={() => {}}
      />,
    )

    expect(screen.queryByRole('button', { name: /repeat what you did/i })).not.toBeInTheDocument()
    // Primary still renders.
    expect(screen.getByRole('button', { name: /repeat full 14-min plan/i })).toBeInTheDocument()
  })

  it('last_complete (Phase F Unit 1): renders Repeat + Start a different session, no Edit or Same-as-last-time', async () => {
    const user = userEvent.setup()
    const onRepeat = vi.fn()
    const onStartDifferent = vi.fn()

    render(
      <HomePrimaryCard
        variant="last_complete"
        data={fakeLastComplete}
        onRepeat={onRepeat}
        onStartDifferent={onStartDifferent}
      />,
    )

    expect(screen.getByRole('region')).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/last session/i),
    )

    await user.click(screen.getByRole('button', { name: /repeat this session/i }))
    expect(onRepeat).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /start a different session/i }))
    expect(onStartDifferent).toHaveBeenCalledTimes(1)

    // Phase F Unit 1 regression guard: the pre-Phase-F affordances MUST
    // be gone. `Edit` shared a URL with Repeat (same-URL duplication);
    // `Same as last time` was a one-tap shortcut that bypassed the
    // StaleContextBanner. A future reintroduction should fail loudly.
    expect(screen.queryByRole('button', { name: /^edit$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /same as last time/i })).not.toBeInTheDocument()
  })

  it('resume: delegates to the existing ResumePrompt modal (role=dialog)', async () => {
    const user = userEvent.setup()
    const onResume = vi.fn()
    const onDiscard = vi.fn()

    render(
      <HomePrimaryCard
        variant="resume"
        data={fakeResume}
        onResume={onResume}
        onDiscard={onDiscard}
      />,
    )

    // ResumePrompt renders a role="dialog" overlay, so the variant is
    // structurally distinct from the region-based primary cards.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /reopen session/i }))
    expect(onResume).toHaveBeenCalledTimes(1)
  })
})
