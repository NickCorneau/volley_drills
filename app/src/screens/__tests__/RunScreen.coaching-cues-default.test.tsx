import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

/**
 * Feedback pass 2026-04-21: RunScreen defaults the coaching-cue toggle
 * to collapsed. Phase F Unit 5 (2026-04-19) had flipped the default to
 * visible, but field testing showed the cue text crowds the run view;
 * users preferred revealing cues on demand.
 *
 * Regression contract: on mount with a paused in-progress block whose
 * `coachingCue` is non-empty, the cue text is NOT rendered AND the
 * toggle button reads "Show coaching cues" (not "Hide cues"). This is
 * the single source of truth for the 2026-04-21 default flip; the
 * `Hide cues` label remains available post-toggle so users can collapse
 * cues again mid-block.
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

describe('RunScreen: coaching cues default collapsed (feedback 2026-04-21)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('on mount: cue text is hidden and toggle reads "Show coaching cues"', async () => {
    await seedPausedSession('exec-cue', 'plan-cue')
    renderAt('exec-cue')

    // The toggle button reads "Show coaching cues" (default-collapsed)
    // and the cue body text is NOT rendered.
    expect(
      await screen.findByRole('button', { name: /show coaching cues/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^hide cues$/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /athletic posture\. platform angle drives the ball\./i,
      ),
    ).not.toBeInTheDocument()
  })
})
