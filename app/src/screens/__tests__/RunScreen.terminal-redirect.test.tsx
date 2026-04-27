import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { RunScreen } from '../RunScreen'

// Minimal stub for the destination route so we can assert the redirect
// landed without pulling in the full ReviewScreen + all its dependencies.
function ReviewProbe() {
  return <div data-testid="review-probe">review-screen</div>
}

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
  ])
}

async function seedTerminal(execId: string, planId: string, status: 'completed' | 'ended_early') {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_open',
    presetName: 'Solo + Open',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillName: 'Warm up',
        shortName: 'Warm',
        durationMinutes: 3,
        coachingCue: 'Loose and easy',
        courtsideInstructions: 'Easy jog and shoulder rolls',
        required: true,
      },
    ],
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status,
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: status === 'completed' ? 'completed' : 'skipped' }],
    startedAt: now - 10 * 60_000,
    completedAt: now - 5 * 60_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run?id=${execId}`]}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
        <Route path="/review" element={<ReviewProbe />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen terminal-session redirect (red-team pass 2)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('redirects completed sessions to Review instead of rendering Run', async () => {
    await seedTerminal('exec-completed', 'plan-completed', 'completed')
    renderAt('exec-completed')

    expect(await screen.findByTestId('review-probe')).toBeInTheDocument()
  })

  it('redirects ended-early (discarded) sessions to Review', async () => {
    await seedTerminal('exec-discarded', 'plan-discarded', 'ended_early')
    renderAt('exec-discarded')

    expect(await screen.findByTestId('review-probe')).toBeInTheDocument()
  })
})
