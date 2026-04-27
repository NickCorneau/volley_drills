import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

/**
 * RunScreen coaching note: quiet left-rule aside with a small "CUE"
 * label and the full cue body.
 *
 * Regression contract (updated 2026-04-22, round 2): the cue renders
 * in full on mount regardless of length. The earlier preview +
 * "Show full coaching note" toggle was removed once the ScreenShell
 * body became a first-class scroll container with top/bottom fade
 * affordances — hiding cue text behind a tap was redundant with the
 * scroll affordance for the same information goal. If a future cue
 * genuinely warrants collapse, the decision will be driven by
 * founder-use evidence, not author preference.
 */

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

const LONG_CUE =
  'Athletic posture. Keep your platform steady through contact. ' +
  'Let the ball find your angle. Breathe on the load; exhale ' +
  'through the pass. Eyes to target early. Hips before arms. ' +
  'Finish tall. CUEFULLMARKER_9f3a.'

async function seedPausedSession(execId: string, planId: string, coachingCue: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_open',
    presetName: 'Solo + Open',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 5,
        coachingCue,
        courtsideInstructions: 'Self-toss; forearm pass up and down.',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'paused',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
    startedAt: now - 30_000,
    pausedAt: now - 5_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run?id=${execId}`]}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen: coaching note renders in full (no expand toggle)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('long cue: full text is present on mount, no expand/collapse button', async () => {
    await seedPausedSession('exec-long', 'plan-long', LONG_CUE)
    renderAt('exec-long')

    // Full cue marker is in the DOM without any interaction.
    expect(await screen.findByText(/CUEFULLMARKER_9f3a/)).toBeInTheDocument()

    // The prior preview/toggle controls are gone.
    expect(
      screen.queryByRole('button', { name: /show full coaching note/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /show less/i })).not.toBeInTheDocument()
  })

  it('short cue: renders in full with no toggle (same surface as long)', async () => {
    await seedPausedSession('exec-short', 'plan-short', 'Athletic posture.')
    renderAt('exec-short')

    expect(await screen.findByText(/Athletic posture\./i)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /show full coaching note/i }),
    ).not.toBeInTheDocument()
  })
})
