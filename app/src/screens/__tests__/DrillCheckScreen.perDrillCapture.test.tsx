import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { DRILLS } from '../../data/drills'
import { DrillCheckScreen } from '../DrillCheckScreen'

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 9): per-drill capture
 * wiring on the dedicated `/run/check` reflective beat.
 *
 * Originally lived on `TransitionScreen` under D133 (Tier 1b). The
 * surface moved to `DrillCheckScreen` so the next-drill briefing on
 * Transition is single-purpose. Capture rules are unchanged; only the
 * host route moved.
 *
 * Sources:
 *   docs/plans/2026-04-26-pre-d91-editorial-polish.md Item 9
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Transition (D133)"
 *   docs/research/2026-04-26-pair-rep-capture-options.md (Framing D)
 *
 * What this file pins:
 *   - Capture surface only renders when the prev block is a completed
 *     main_skill / pressure block. Warmup, technique, movement_proxy,
 *     and skipped blocks bypass to /run/transition immediately.
 *   - The "Continue" CTA stays disabled until a difficulty chip is
 *     tapped; the gating hint is visible while disabled.
 *   - A tap on a chip persists a `perDrillCaptures` row through
 *     `saveReviewDraft` so the tag survives a Finish-Later round trip.
 *   - An existing draft with a capture for this block hydrates the
 *     chip and clears the gating hint on first render.
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

async function seedTwoBlockSession({
  prevType,
  prevCompleted,
}: {
  prevType: 'main_skill' | 'warmup'
  prevCompleted: boolean
}) {
  const execId = 'exec-drillcheck-test'
  const planId = `plan-${execId}`
  const now = Date.now()

  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'block-prev',
        type: prevType,
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        drillName: COUNT_DRILL.name,
        shortName: COUNT_DRILL.shortName ?? COUNT_DRILL.name,
        durationMinutes: 5,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'block-next',
        type: 'main_skill',
        drillId: COUNT_DRILL.id,
        variantId: COUNT_VARIANT.id,
        drillName: COUNT_DRILL.name,
        shortName: COUNT_DRILL.shortName ?? COUNT_DRILL.name,
        durationMinutes: 8,
        coachingCue: '',
        courtsideInstructions: '',
        required: false,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })

  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: 1,
    blockStatuses: [
      {
        blockId: 'block-prev',
        status: prevCompleted ? 'completed' : 'skipped',
      },
      { blockId: 'block-next', status: 'planned' },
    ],
    startedAt: now - 10 * 60_000,
  })

  return execId
}

// Probe component that exposes the current router location to the
// test, so bypass redirects are observable as a structural assertion
// (the user lands on `/run/transition`) rather than only as a "capture
// card not present" assertion.
function LocationProbe() {
  const location = useLocation()
  return <div data-testid="route-probe">{location.pathname}</div>
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run/check?id=${execId}`]}>
      <Routes>
        <Route path="/run/check" element={<DrillCheckScreen />} />
        <Route
          path="/run/transition"
          element={
            <>
              <LocationProbe />
              <div>TransitionScreen stub</div>
            </>
          }
        />
        <Route
          path="/run"
          element={
            <>
              <LocationProbe />
              <div>RunScreen stub</div>
            </>
          }
        />
        <Route
          path="/review"
          element={
            <>
              <LocationProbe />
              <div>ReviewScreen stub</div>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
})

describe('DrillCheckScreen per-drill capture (Item 9 / D133)', () => {
  it('bypasses to /run/transition when the prev block was a warmup', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'warmup',
      prevCompleted: true,
    })
    renderAt(execId)

    // Wait for the bypass effect to land on the Transition stub. The
    // capture card never renders because the screen unmounts before
    // first paint of the body.
    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent(
        '/run/transition',
      )
    })
    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()
  })

  it('bypasses to /run/transition when the prev block was skipped', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: false,
    })
    renderAt(execId)

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent(
        '/run/transition',
      )
    })
    expect(screen.queryByTestId('per-drill-capture')).not.toBeInTheDocument()
  })

  it('renders the capture card and gates Continue until a chip is tapped', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    const cont = screen.getByRole('button', { name: /continue/i })
    expect(cont).toBeDisabled()
    expect(screen.getByTestId('drill-check-gating-hint')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    await waitFor(() => {
      expect(cont).not.toBeDisabled()
    })
    expect(
      screen.queryByTestId('drill-check-gating-hint'),
    ).not.toBeInTheDocument()
  })

  it('persists the tapped difficulty into the review draft via saveReviewDraft', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /too hard/i }))

    await waitFor(async () => {
      const draft = await db.sessionReviews
        .where('executionLogId')
        .equals(execId)
        .first()
      expect(draft?.status).toBe('draft')
      expect(draft?.perDrillCaptures).toBeDefined()
      expect(draft?.perDrillCaptures).toHaveLength(1)
      const row = draft!.perDrillCaptures![0]
      expect(row.difficulty).toBe('too_hard')
      expect(row.drillId).toBe(COUNT_DRILL.id)
      expect(row.variantId).toBe(COUNT_VARIANT.id)
      expect(row.blockIndex).toBe(0)
    })
  })

  it('rehydrates the tapped chip when an existing draft already has a capture for this block', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })

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
          difficulty: 'too_easy',
          capturedAt: Date.now(),
        },
      ],
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    await waitFor(() => {
      expect(
        screen.getByRole('radio', { name: /too easy/i }),
      ).toHaveAttribute('aria-checked', 'true')
    })
    expect(
      screen.queryByTestId('drill-check-gating-hint'),
    ).not.toBeInTheDocument()
  })

  it('navigates to /run/transition on Continue after a chip is tapped', async () => {
    const execId = await seedTwoBlockSession({
      prevType: 'main_skill',
      prevCompleted: true,
    })
    renderAt(execId)

    await screen.findByTestId('per-drill-capture')
    fireEvent.click(screen.getByRole('radio', { name: /still learning/i }))

    const cont = screen.getByRole('button', { name: /continue/i })
    await waitFor(() => expect(cont).not.toBeDisabled())
    fireEvent.click(cont)

    await waitFor(() => {
      expect(screen.getByTestId('route-probe')).toHaveTextContent(
        '/run/transition',
      )
    })
  })
})
