import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

/**
 * Phase F Unit 5 (2026-04-19): RunScreen defaults the coaching-cue
 * toggle to visible. Pre-Phase-F the `showInstructions` reducer started
 * at `false`, hiding the drill's teaching points behind a tap.
 *
 * Regression contract: on mount with a paused in-progress block whose
 * `coachingCue` is non-empty, the cue text is rendered AND the toggle
 * button reads "Hide cues" (not "Show coaching cues"). This is the
 * single source of truth for the Phase F default flip; the `Show`
 * label remains available post-toggle so paranoid users can still hide
 * the cue mid-block.
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

async function seedPausedSession(execId: string, planId: string) {
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
        // Realistic-ish coaching cue string so the assertion is honest.
        coachingCue: 'Athletic posture. Platform angle drives the ball.',
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

describe('RunScreen: coaching cues default visible (Phase F Unit 5)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('on mount: coaching cue text is visible and toggle reads "Hide cues"', async () => {
    await seedPausedSession('exec-cue', 'plan-cue')
    renderAt('exec-cue')

    // The cue string renders directly (no extra tap required).
    expect(
      await screen.findByText(
        /athletic posture\. platform angle drives the ball\./i,
      ),
    ).toBeInTheDocument()

    // The toggle button reads "Hide cues" (default-visible state), not
    // "Show coaching cues" (default-hidden pre-Phase-F state).
    expect(
      screen.getByRole('button', { name: /^hide cues$/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /show coaching cues/i }),
    ).not.toBeInTheDocument()
  })
})
