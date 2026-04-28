import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { DRILLS } from '../../data/drills'
import { ReviewScreen } from '../ReviewScreen'

/**
 * Tier 1b D133 (2026-04-26): ReviewScreen behavior when per-drill
 * captures from Drill Check (`/run/check`) are present.
 *
 * Sources:
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Drill Check (D133)"
 *   docs/plans/2026-04-26-pair-rep-capture-tier1b.md
 *
 * What this file pins:
 *   - When the draft carries at least one tagged capture, the
 *     session-level Good/Total input is replaced by a read-only
 *     aggregate read-out (no `<input>` on the card body).
 *   - When the draft has zero captures, the legacy session-level input
 *     is rendered exactly as it did pre-D133.
 *   - On submit, the perDrillCaptures payload reaches the terminal
 *     review record and the session-level fields carry the aggregate.
 */

const COUNT_DRILL = (() => {
  const drill = DRILLS.find(
    (d) =>
      d.variants[0]?.successMetric.type === 'pass-rate-good' ||
      d.variants[0]?.successMetric.type === 'reps-successful',
  )
  if (!drill) throw new Error('test fixture: no count drill in catalog')
  return drill
})()
const COUNT_VARIANT = COUNT_DRILL.variants[0]!
const NON_COUNT_MAIN_DRILL = (() => {
  const drill = DRILLS.find((d) => d.id === 'd38')
  if (!drill) throw new Error('test fixture: missing d38')
  return drill
})()
const NON_COUNT_MAIN_VARIANT = (() => {
  const variant = NON_COUNT_MAIN_DRILL.variants.find((v) => v.id === 'd38-pair')
  if (!variant) throw new Error('test fixture: missing d38-pair')
  return variant
})()

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
    db.storageMeta.clear(),
  ])
}

async function seedCompletedSkillSession(execId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'block-main',
        type: 'main_skill',
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        drillName: COUNT_DRILL.name,
        shortName: COUNT_DRILL.shortName ?? COUNT_DRILL.name,
        durationMinutes: 10,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'block-main', status: 'completed' }],
    startedAt: now - 15 * 60_000,
    completedAt: now - 5 * 60_000,
  })
}

async function seedCompletedSupportCountSession(execId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'pair_open',
    presetName: 'Pair + Open',
    playerCount: 2,
    blocks: [
      {
        id: 'block-technique',
        type: 'technique',
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        drillName: COUNT_DRILL.name,
        shortName: COUNT_DRILL.shortName ?? COUNT_DRILL.name,
        durationMinutes: 6,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'block-main',
        type: 'main_skill',
        drillId: NON_COUNT_MAIN_DRILL.id,
        variantId: NON_COUNT_MAIN_VARIANT.id,
        drillName: NON_COUNT_MAIN_DRILL.name,
        shortName: NON_COUNT_MAIN_DRILL.shortName ?? NON_COUNT_MAIN_DRILL.name,
        durationMinutes: 8,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 1,
    blockStatuses: [
      { blockId: 'block-technique', status: 'completed' },
      { blockId: 'block-main', status: 'completed' },
    ],
    startedAt: now - 15 * 60_000,
    completedAt: now - 5 * 60_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/complete" element={<div>CompleteScreen stub</div>} />
        <Route path="/" element={<div>HomeScreen stub</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
})

describe('ReviewScreen per-drill aggregate (D133)', () => {
  it('renders the legacy session-level Good/Total input when no captures exist', async () => {
    await seedCompletedSkillSession('exec-no-captures')
    renderAt('exec-no-captures')

    await screen.findByRole('heading', { name: /^good passes$/i })
    expect(screen.queryByTestId('per-drill-aggregate')).not.toBeInTheDocument()
    // Pre-D133 input cells are still there.
    expect(screen.getByLabelText(/^good$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^total$/i)).toBeInTheDocument()
  })

  it('replaces the input with a read-only aggregate when the draft carries tagged captures with counts', async () => {
    const execId = 'exec-with-captures'
    await seedCompletedSkillSession(execId)

    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: COUNT_DRILL.id,
          variantId: COUNT_VARIANT.id,
          blockIndex: 0,
          difficulty: 'still_learning',
          goodPasses: 8,
          attemptCount: 12,
          capturedAt: Date.now(),
        },
      ],
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    const aggregate = await screen.findByTestId('per-drill-aggregate')
    expect(aggregate).toHaveTextContent(/8 of 12/)
    // The session-level input is gone.
    expect(screen.queryByLabelText(/^good$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^total$/i)).not.toBeInTheDocument()
  })

  it('shows a tagged-only summary when captures have a difficulty but no counts', async () => {
    const execId = 'exec-tag-only'
    await seedCompletedSkillSession(execId)

    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: COUNT_DRILL.id,
          variantId: COUNT_VARIANT.id,
          blockIndex: 0,
          difficulty: 'too_hard',
          capturedAt: Date.now(),
        },
      ],
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    const aggregate = await screen.findByTestId('per-drill-aggregate')
    expect(aggregate).toHaveTextContent(/counts not logged/i)
    // Still no session-level input.
    expect(screen.queryByLabelText(/^good$/i)).not.toBeInTheDocument()
  })

  it('threads the perDrillCaptures payload + the aggregate good/total onto the submitted record', async () => {
    const execId = 'exec-submit'
    await seedCompletedSkillSession(execId)

    const captures = [
      {
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        blockIndex: 0,
        difficulty: 'still_learning' as const,
        goodPasses: 6,
        attemptCount: 10,
        capturedAt: Date.now(),
      },
    ]
    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: captures,
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    await screen.findByTestId('per-drill-aggregate')
    fireEvent.click(screen.getByRole('radio', { name: /^right$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }))

    await waitFor(async () => {
      const stored = await db.sessionReviews.where('executionLogId').equals(execId).first()
      expect(stored?.status).toBe('submitted')
      expect(stored?.perDrillCaptures).toEqual(captures)
      expect(stored?.goodPasses).toBe(6)
      expect(stored?.totalAttempts).toBe(10)
    })
  })

  it('aggregates support-slot captures even when the main_skill is non-count', async () => {
    const execId = 'exec-support-counts-non-count-main'
    await seedCompletedSupportCountSession(execId)

    const captures = [
      {
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        blockIndex: 0,
        difficulty: 'still_learning' as const,
        goodPasses: 7,
        attemptCount: 9,
        capturedAt: Date.now(),
      },
    ]
    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: captures,
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    const aggregate = await screen.findByTestId('per-drill-aggregate')
    expect(aggregate).toHaveTextContent(/7 of 9/)
    expect(screen.queryByLabelText(/^good$/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: /^right$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }))

    await waitFor(async () => {
      const stored = await db.sessionReviews.where('executionLogId').equals(execId).first()
      expect(stored?.status).toBe('submitted')
      expect(stored?.goodPasses).toBe(7)
      expect(stored?.totalAttempts).toBe(9)
      expect(stored?.perDrillCaptures).toEqual(captures)
    })
  })

  it('preserves per-drill captures when finishing later after a review edit', async () => {
    const execId = 'exec-finish-later-captures'
    await seedCompletedSkillSession(execId)

    const captures = [
      {
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        blockIndex: 0,
        difficulty: 'still_learning' as const,
        goodPasses: 5,
        attemptCount: 8,
        capturedAt: Date.now(),
      },
    ]
    await db.sessionReviews.put({
      id: `review-${execId}`,
      executionLogId: execId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: captures,
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    await screen.findByTestId('per-drill-aggregate')
    fireEvent.click(screen.getByRole('radio', { name: /^right$/i }))
    fireEvent.click(screen.getByRole('button', { name: /finish later/i }))

    await waitFor(async () => {
      const stored = await db.sessionReviews.where('executionLogId').equals(execId).first()
      expect(stored?.status).toBe('draft')
      expect(stored?.sessionRpe).toBe(5)
      expect(stored?.perDrillCaptures).toEqual(captures)
    })
  })

  it('explains that Done is disabled until effort is rated', async () => {
    await seedCompletedSkillSession('exec-disabled-rpe')
    renderAt('exec-disabled-rpe')

    const done = await screen.findByRole('button', { name: /^done$/i })
    expect(done).toBeDisabled()
    expect(screen.getByText('Rate your effort above to submit.')).toBeInTheDocument()
  })

  it('explains that Done is disabled until an ended-early reason is selected', async () => {
    const execId = 'exec-disabled-ended-early'
    await seedCompletedSkillSession(execId)
    await db.executionLogs.update(execId, {
      status: 'ended_early',
      endedEarlyReason: 'user_ended',
    })
    renderAt(execId)

    fireEvent.click(await screen.findByRole('radio', { name: /^right$/i }))

    const done = screen.getByRole('button', { name: /^done$/i })
    expect(done).toBeDisabled()
    expect(screen.getByText('Pick a reason you ended early to submit.')).toBeInTheDocument()
  })
})
