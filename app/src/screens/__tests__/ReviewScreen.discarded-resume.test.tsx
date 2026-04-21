import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'

/**
 * A8 (red-team fix plan v3) belt - ReviewScreen auto-routes discarded
 * resume sessions to Home. The service-layer A1/A8 filters (Unit 1) keep
 * these out of `findPendingReview` / `expireStaleReviews` in the first
 * place; this belt catches any stale URL tap that reaches /review for
 * such a log.
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

async function seed(
  execId: string,
  endedEarlyReason?: string,
  status: 'completed' | 'ended_early' = 'ended_early',
) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status,
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: now - 10 * 60_000,
    completedAt: now - 5 * 60_000,
    endedEarlyReason,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route
          path="/"
          element={<div data-testid="home-route">home</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen discarded-resume belt (A8)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('auto-routes to Home when log.endedEarlyReason === discarded_resume', async () => {
    await seed('exec-discarded', 'discarded_resume', 'ended_early')
    renderAt('exec-discarded')

    expect(await screen.findByTestId('home-route')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /quick review/i }),
    ).not.toBeInTheDocument()
  })

  it('renders the form normally for an ended-early log with a non-discarded reason', async () => {
    await seed('exec-fatigue', 'fatigue', 'ended_early')
    renderAt('exec-fatigue')

    expect(
      await screen.findByRole('heading', { name: /quick review/i }),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('home-route')).not.toBeInTheDocument()
  })

  it('renders the form normally for a clean completed log', async () => {
    await seed('exec-clean', undefined, 'completed')
    renderAt('exec-clean')

    expect(
      await screen.findByRole('heading', { name: /quick review/i }),
    ).toBeInTheDocument()
  })
})
