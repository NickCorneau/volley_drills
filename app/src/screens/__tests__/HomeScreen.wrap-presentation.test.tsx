import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * U3 (2026-06-11 session-truth plan): a deliberate wrap (completed
 * status with a skipped tail) presents as FINISHED on Home:
 *
 * - status copy never reads "ended early" / "Partial" for a wrap
 * - the Recent sessions row reads Done (status-keyed split pinned)
 *
 * D158 (2026-06-12): the card's meta line and repeat affordances were
 * retired, so the wrap-honesty assertions narrowed to the status copy
 * and Recent split.
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

async function seedWrapped() {
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: 'plan-wrap',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'warmup',
        drillName: 'Warm',
        shortName: 'Warm',
        durationMinutes: 3,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-2',
        type: 'main_skill',
        drillName: 'Pass',
        shortName: 'Pass',
        durationMinutes: 11,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-3',
        type: 'main_skill',
        drillName: 'Serve',
        shortName: 'Serve',
        durationMinutes: 11,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
    context: {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: true,
    },
  })
  await db.executionLogs.put({
    id: 'exec-wrap',
    planId: 'plan-wrap',
    // Deliberate wrap: completed status, skipped tail, honest duration.
    status: 'completed',
    activeBlockIndex: 2,
    blockStatuses: [
      { blockId: 'b-1', status: 'completed' },
      { blockId: 'b-2', status: 'completed' },
      { blockId: 'b-3', status: 'skipped' },
    ],
    startedAt: completedAt - 20 * 60_000,
    completedAt,
    actualDurationMinutes: 14,
  })
  await db.sessionReviews.put({
    id: 'review-exec-wrap',
    executionLogId: 'exec-wrap',
    sessionRpe: 5,
    goodPasses: 6,
    totalAttempts: 10,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/safety" element={<div data-testid="safety-route">safety</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen: wrapped-session presentation (U3)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  // Covers AE1 (Home half) + AE3. Negative assertion pinned: wraps never
  // render ended-early/Partial copy anywhere on Home.
  it('presents a wrap as Done with no ended-early copy', async () => {
    await seedWrapped()
    renderHome()

    const card = await screen.findByRole('region', { name: /train again/i })
    expect(card).not.toHaveTextContent(/ended early/i)

    // Recent sessions split stays status-keyed: the wrap reads Done.
    const recent = await screen.findByRole('list')
    expect(recent).toHaveTextContent(/done/i)
    expect(screen.queryByText(/partial/i)).toBeNull()
    expect(screen.queryByText(/ended early/i)).toBeNull()
  })

  it('renders no repeat affordances for a wrap (D158)', async () => {
    await seedWrapped()
    renderHome()

    await screen.findByRole('region', { name: /train again/i })
    expect(screen.queryByRole('button', { name: /repeat/i })).not.toBeInTheDocument()
  })
})
