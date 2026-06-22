import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { BlockSlotType } from '../../types/session'
import { TransitionScreen } from '../TransitionScreen'

/**
 * M002.2 run-time technique-how (plan
 * `docs/plans/2026-06-22-007-feat-m002-2-technique-how-transition-intent-plan.md`,
 * origin AE1/AE2/AE4): TransitionScreen surfaces the upcoming drill's
 * authored stress-rung `intent` as one quiet line under the duration, for
 * ladder-bearing blocks only, and renders nothing (without throwing) for
 * non-ladder-bearing or synthetic blocks.
 */

const PASS_RUNG_3_INTENT = 'Read where the ball is going, move to it, and still pass to one target.'

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

type NextSeed = { drillId?: string; variantId?: string; drillName?: string }

async function seedTransitionState(
  execId: string,
  planId: string,
  nextBlockType: BlockSlotType,
  next: NextSeed = {},
) {
  const now = Date.now()
  const drillIdField = next.drillId ? { drillId: next.drillId } : {}
  const variantIdField = next.variantId ? { variantId: next.variantId } : {}
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
        type: nextBlockType,
        ...drillIdField,
        ...variantIdField,
        drillName: next.drillName ?? 'Test Drill',
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
      { blockId: 'b-0', status: 'completed', startedAt: now - 200_000, completedAt: now - 30_000 },
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

describe('TransitionScreen: rung intent line (M002.2 technique-how)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the upcoming drill rung intent for a ladder-bearing block (AE1)', async () => {
    await seedTransitionState('exec-intent', 'plan-intent', 'main_skill', {
      drillId: 'd24',
      drillName: 'Pass into a Corner',
    })
    renderAt('exec-intent')

    expect(await screen.findByText(PASS_RUNG_3_INTENT)).toBeInTheDocument()
  })

  it('renders no intent line for a warmup / off-ladder next block (AE2)', async () => {
    await seedTransitionState('exec-warmup', 'plan-warmup', 'warmup', {
      drillId: 'd28',
      drillName: 'Beach Prep Three',
    })
    renderAt('exec-warmup')

    // Screen mounted (the duration line is always present)...
    expect(await screen.findByText('5 min')).toBeInTheDocument()
    // ...but no rung intent line is surfaced.
    expect(screen.queryByText(PASS_RUNG_3_INTENT)).toBeNull()
  })

  it('renders without throwing and shows no intent line for a synthetic block (AE4)', async () => {
    await seedTransitionState('exec-synthetic', 'plan-synthetic', 'main_skill', {
      drillName: 'Synthetic Drill With No Catalog Match',
    })
    renderAt('exec-synthetic')

    expect(await screen.findByText('Synthetic Drill With No Catalog Match')).toBeInTheDocument()
    expect(screen.queryByText(PASS_RUNG_3_INTENT)).toBeNull()
  })
})
