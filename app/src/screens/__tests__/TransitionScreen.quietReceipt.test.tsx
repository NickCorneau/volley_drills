import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import { db } from '../../db'
import { TransitionScreen } from '../TransitionScreen'

/**
 * Shibui polish 2026-06-12 (origin R7): TransitionScreen passes
 * `presentation="line"` to `JustFinishedPill`, so the just-finished
 * receipt renders as one quiet `{drillName} · {status}` line instead of
 * the warm panel pill (which DrillCheckScreen keeps). This file pins the
 * screen-level wiring for both statuses — the unit tests on
 * `JustFinishedPill` cover the variant internals, but only a screen
 * render proves Transition actually opts into it.
 *
 * The combined `name · label` string is itself the variant signal: the
 * panel presentation renders the drill name and the status label as two
 * separate elements and never produces that single text node.
 *
 * Run-flow beat contract Stage 3 (R12): the receipt also dedupes. It
 * renders here only when the just-finished block bypassed Drill Check
 * (warmup / wrap / technique-support / skipped). When Drill Check showed
 * the receipt (count- or difficulty-eligible block), Transition must
 * suppress it so it never renders twice for one drill.
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

async function seedTransitionState(
  execId: string,
  planId: string,
  prevStatus: 'completed' | 'skipped',
) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'pair_open',
    presetName: 'Pair + Open',
    playerCount: 2,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillName: 'Beach Prep Three',
        shortName: 'Beach Prep',
        durationMinutes: 3,
        coachingCue: 'Short hops, loud feet.',
        courtsideInstructions: 'Four quick blocks, ~45 s each.',
        required: true,
      },
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Test Drill',
        shortName: 'Test',
        durationMinutes: 5,
        coachingCue: 'Athletic posture.',
        courtsideInstructions: 'Test instructions.',
        required: true,
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
      prevStatus === 'completed'
        ? { blockId: 'b-0', status: 'completed', startedAt: now - 200_000, completedAt: now - 30_000 }
        : { blockId: 'b-0', status: 'skipped' },
      { blockId: 'b-1', status: 'in_progress' },
    ],
    startedAt: now - 200_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run/transition?id=${execId}`]}>
      <Routes>
        <Route path="/run/transition" element={<TransitionScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TransitionScreen: quiet just-finished receipt (shibui polish R7, 2026-06-12)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the completed receipt as one quiet line, not the panel pill', async () => {
    await seedTransitionState('exec-receipt-done', 'plan-receipt-done', 'completed')
    renderAt('exec-receipt-done')

    expect(await screen.findByText('Beach Prep Three · Complete')).toBeInTheDocument()
    // Panel presentation renders the status label as a standalone
    // subtitle element — its absence confirms the line variant.
    expect(screen.queryByText('Complete')).toBeNull()
  })

  it('renders the skipped receipt as one quiet line with the Skipped label', async () => {
    await seedTransitionState('exec-receipt-skip', 'plan-receipt-skip', 'skipped')
    renderAt('exec-receipt-skip')

    expect(await screen.findByText('Beach Prep Three · Skipped')).toBeInTheDocument()
    expect(screen.queryByText('Skipped')).toBeNull()
  })

  it('suppresses the receipt when the just-finished block was count-eligible (R12 dedup)', async () => {
    // A completed count-eligible main_skill is shown on Drill Check, so
    // the receipt must NOT render again here one beat later.
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-receipt-dedup',
      presetId: 'pair_open',
      presetName: 'Pair + Open',
      playerCount: 2,
      blocks: [
        {
          id: 'b-0',
          type: 'main_skill',
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
          id: 'b-1',
          type: 'main_skill',
          drillName: 'Up Next Drill',
          shortName: 'Next',
          durationMinutes: 5,
          coachingCue: 'Athletic posture.',
          courtsideInstructions: 'Test instructions.',
          required: true,
        },
      ],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: now - 60_000,
    })
    await db.executionLogs.put({
      id: 'exec-receipt-dedup',
      planId: 'plan-receipt-dedup',
      status: 'in_progress',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'b-0', status: 'completed', startedAt: now - 200_000, completedAt: now - 30_000 },
        { blockId: 'b-1', status: 'in_progress' },
      ],
      startedAt: now - 200_000,
    })
    renderAt('exec-receipt-dedup')

    // The next-drill identity proves the screen hydrated past loading.
    expect(await screen.findByText('Up Next Drill')).toBeInTheDocument()
    // No just-finished receipt line — Drill Check owns it for this block.
    expect(screen.queryByText(/·\s+(Complete|Skipped)/)).toBeNull()
  })
})
