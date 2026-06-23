import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { TransitionScreen } from '../TransitionScreen'

/**
 * Run-flow beat contract Stage 1 (R5/R7, plan
 * `docs/plans/2026-06-23-001-feat-run-flow-stage1-beat-contract-plan.md`):
 * Transition carries NO coaching cue — not inline, not behind a "More
 * cues" reveal. The cue's only home is Run's "Now". The decide CTA reads
 * "Start". Discriminating: this seeds a block WITH a coaching cue and
 * asserts neither the cue text nor a "Cue"/"More cues" control renders, so
 * restoring the cut section (or reverting the CTA rename) turns it red.
 */

const CUE_TEXT = 'Set your contact point before the feed arrives.'
const READ_TEXT = 'Feed yourself a high toss and return it to the same spot each time.'

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

async function seed(execId: string, planId: string) {
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
        coachingCue: CUE_TEXT,
        courtsideInstructions: READ_TEXT,
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

describe('TransitionScreen: beat density (cue cut, R5/R7)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('keeps the full read and the Start CTA, with no coaching cue', async () => {
    await seed('exec-density', 'plan-density')
    renderAt('exec-density')

    // Screen mounted on the upcoming drill, full setup read present.
    expect(await screen.findByText('Pass into a Corner')).toBeInTheDocument()
    expect(document.body.textContent).toContain(READ_TEXT)

    // Decide CTA reads "Start" (not the retired "Start next block").
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.queryByText('Start next block')).toBeNull()

    // No coaching cue on Transition: not the text, not a "Cue" label, not "More cues".
    expect(screen.queryByText(CUE_TEXT)).toBeNull()
    expect(screen.queryByText('Cue')).toBeNull()
    expect(screen.queryByText('More cues')).toBeNull()
  })
})
