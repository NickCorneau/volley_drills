import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { getStressRung } from '../../data/stressLadders'
import type { BlockSlotType } from '../../types/session'
import { TransitionScreen } from '../TransitionScreen'

/**
 * Run-flow beat contract Stage 1 (plan
 * `docs/plans/2026-06-23-001-feat-run-flow-stage1-beat-contract-plan.md`,
 * origin AE1; revises M002.2's D163 placement): TransitionScreen surfaces
 * the upcoming drill's authored stress-rung `intent` as one quiet line
 * under the duration ONLY on the block-opening Transition — the first
 * Transition of a focus run. It recedes on mid-block transitions (same
 * focus as the previous block), and renders nothing (without throwing) for
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

// Seeds a 3-block plan (warmup → pass main → pass pressure) with the
// runner sitting at the third block (activeBlockIndex 2), so the upcoming
// Transition is MID-block: the same focus run as the previous block.
async function seedMidBlockState(execId: string, planId: string) {
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
        drillId: 'd24',
        variantId: 'd24-solo',
        drillName: 'Pass into a Corner',
        shortName: 'Pass Corner',
        durationMinutes: 5,
        coachingCue: 'Platform early.',
        courtsideInstructions: 'Pass instructions.',
        required: true,
      },
      {
        id: 'b-2',
        type: 'pressure',
        drillId: 'd20',
        drillName: '3 Serve Pass to Attack',
        shortName: 'Serve Pass',
        durationMinutes: 5,
        coachingCue: 'Track the server.',
        courtsideInstructions: 'Pressure instructions.',
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
    activeBlockIndex: 2,
    blockStatuses: [
      { blockId: 'b-0', status: 'completed', startedAt: now - 300_000, completedAt: now - 200_000 },
      { blockId: 'b-1', status: 'completed', startedAt: now - 200_000, completedAt: now - 30_000 },
      { blockId: 'b-2', status: 'in_progress' },
    ],
    startedAt: now - 300_000,
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

  it('renders the rung intent on a block-opening transition (warmup → pass) (AE1)', async () => {
    await seedTransitionState('exec-intent', 'plan-intent', 'main_skill', {
      drillId: 'd24',
      drillName: 'Pass into a Corner',
    })
    renderAt('exec-intent')

    expect(await screen.findByText(PASS_RUNG_3_INTENT)).toBeInTheDocument()
  })

  it('renders no intent line on a mid-block transition with the same focus as the previous block (AE1)', async () => {
    await seedMidBlockState('exec-midblock', 'plan-midblock')
    renderAt('exec-midblock')

    // Screen mounted on the upcoming pressure block...
    expect(await screen.findByText('3 Serve Pass to Attack')).toBeInTheDocument()
    // ...but the intent recedes mid-block: neither the previous block's
    // intent nor the upcoming pass block's own rung intent renders.
    expect(screen.queryByText(PASS_RUNG_3_INTENT)).toBeNull()
    const upcomingPassIntent = getStressRung('pass', 4)?.intent
    expect(upcomingPassIntent).toBeTruthy()
    if (upcomingPassIntent) {
      expect(screen.queryByText(upcomingPassIntent)).toBeNull()
    }
  })

  it('renders no intent line for a warmup / off-ladder next block (AE1)', async () => {
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

  it('renders without throwing and shows no intent line for a synthetic block (AE1)', async () => {
    await seedTransitionState('exec-synthetic', 'plan-synthetic', 'main_skill', {
      drillName: 'Synthetic Drill With No Catalog Match',
    })
    renderAt('exec-synthetic')

    expect(await screen.findByText('Synthetic Drill With No Catalog Match')).toBeInTheDocument()
    expect(screen.queryByText(PASS_RUNG_3_INTENT)).toBeNull()
  })
})
