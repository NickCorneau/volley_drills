import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

/**
 * Run Face v1: the live surface shows one "Now" cue and keeps the
 * remaining coaching cues reachable through a cue-only disclosure.
 *
 * Regression contract (updated 2026-06-23, run-flow beat contract
 * Stage 1 / R7b): long cue bodies no longer compete with the live cue
 * by default; extra cues sit behind "Show more cues". The full
 * courtsideInstructions read is homed on the Run get-ready beat (post-D167;
 * formerly Transition) — it no longer renders on the live face.
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

describe('RunScreen: Run Face cue detail', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('long cue: keeps one live cue and exposes full cue in inline detail', async () => {
    const user = userEvent.setup()
    await seedPausedSession('exec-long', 'plan-long', LONG_CUE)
    renderAt('exec-long')

    expect(await screen.findByText(/^Now$/)).toBeInTheDocument()
    expect(screen.getByText(/Self-toss; forearm pass up and down/i)).toBeInTheDocument()

    // Run-flow beat contract Stage 1 (R7b): the disclosure is cue-only,
    // labelled "Show more cues"; the instructions read is gone from Run.
    await user.click(screen.getByText(/show more cues/i))
    expect(screen.getByText(/CUEFULLMARKER_9f3a/)).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /show less/i })).not.toBeInTheDocument()
  })

  it('short cue: renders as the live cue', async () => {
    await seedPausedSession('exec-short', 'plan-short', 'Athletic posture.')
    renderAt('exec-short')

    expect(await screen.findByText(/^Now$/)).toBeInTheDocument()
    expect(await screen.findByText(/Athletic posture\./i)).toBeInTheDocument()
  })
})
