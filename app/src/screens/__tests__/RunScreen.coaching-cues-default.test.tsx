import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

/**
 * RunScreen coaching note: warm card; short copy in full, long copy as
 * preview + "Show full coaching note" (2026-04-22) so the affordance
 * is large and the block is not one wall of text.
 *
 * Regression contract (updated 2026-04-22): **long** cues show a
 * preview + "Show full coaching note"; the full body is not in the
 * document until expand. **Short** cues (≤ 100 characters) show in
 * full inside the coaching card with no expand control.
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
        // Intentionally long: compact cues skip the expand affordance; we
        // need the long path so the full string stays out of the DOM until
        // the user expands.
        coachingCue:
          'Athletic posture. Keep your platform steady through contact. ' +
          'Let the ball find your angle. Breathe on the load; exhale ' +
          'through the pass. Eyes to target early. Hips before arms. ' +
          'Finish tall. CUEFULLMARKER_9f3a.',
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

describe('RunScreen: coaching note card (long = preview + expand control)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('on mount: long cue is preview-only, full text after "Show full coaching note"', async () => {
    await seedPausedSession('exec-cue', 'plan-cue')
    renderAt('exec-cue')

    expect(
      await screen.findByRole('button', { name: /show full coaching note/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/CUEFULLMARKER_9f3a/i),
    ).not.toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: /show full coaching note/i }),
    )

    expect(await screen.findByText(/CUEFULLMARKER_9f3a/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /show less/i }),
    ).toBeInTheDocument()
  })
})
