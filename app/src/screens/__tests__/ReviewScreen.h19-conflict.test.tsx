import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { submitReview } from '../../services/review'
import { ReviewScreen } from '../ReviewScreen'

/**
 * C-1 Unit 9 (H19): when `submitReview` refuses because a terminal
 * record already exists (for example a concurrent tab submitted or the
 * user skipped from Home while this tab was open), ReviewScreen
 * transitions to a conflict state that renders an explicit message and
 * a "View saved review" button routing to CompleteScreen.
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

async function seed(execId: string) {
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
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: now - 15 * 60_000,
    completedAt: now - 5 * 60_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/complete" element={<div data-testid="complete-route">complete</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen H19 conflict handoff', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders "already reviewed" copy when existing record is submitted', async () => {
    const user = userEvent.setup()
    await seed('exec-conflict')

    // Mount BEFORE the conflicting submitted record is written so
    // ReviewScreen's mount-time guards (A8, A9) don't re-route us.
    renderAt('exec-conflict')
    await screen.findByRole('heading', { name: /quick review/i })

    // Now simulate another tab / different surface writing the terminal
    // submitted record while this tab has the draft form open.
    await submitReview({
      executionLogId: 'exec-conflict',
      sessionRpe: 5,
      goodPasses: 7,
      totalAttempts: 10,
    })

    // 2026-04-23 polish: RPE is 3-chip (Easy=3 / Right=5 / Hard=7).
    // The user-input value here is noise — the conflict path aborts
    // the submit without writing — so any chip works.
    await user.click(screen.getByRole('radio', { name: /^hard$/i }))
    await user.click(screen.getByRole('button', { name: /^done$/i }))

    // Differentiated H19 copy: "already reviewed" is honest for the
    // submitted case.
    expect(await screen.findByText(/already reviewed/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view saved review/i })).toBeInTheDocument()

    const stored = await db.sessionReviews.where('executionLogId').equals('exec-conflict').first()
    expect(stored?.sessionRpe).toBe(5)
  })

  it('renders "already skipped" copy when existing record is a skip stub (adv-3 fix)', async () => {
    const user = userEvent.setup()
    await seed('exec-conflict-skipped')

    renderAt('exec-conflict-skipped')
    await screen.findByRole('heading', { name: /quick review/i })

    // Seed a terminal skipped stub (simulating user who tapped
    // "Skip review" from Home between mount and submit).
    await db.sessionReviews.put({
      id: 'review-exec-conflict-skipped',
      executionLogId: 'exec-conflict-skipped',
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      quickTags: ['skipped'],
      submittedAt: Date.now() - 60_000,
      status: 'skipped',
    })

    await user.click(screen.getByRole('radio', { name: /^right$/i }))
    await user.click(screen.getByRole('button', { name: /^done$/i }))

    // Differentiated H19 copy: "already skipped" must NOT claim "already
    // reviewed" for a session that was explicitly skipped. adv-3 called
    // out that the blurred copy is dishonest for the skip-then-retry
    // scenario.
    expect(await screen.findByText(/already skipped/i)).toBeInTheDocument()
    expect(screen.queryByText(/already reviewed/i)).not.toBeInTheDocument()
  })

  it('tapping "View saved review" routes to /complete/{execId}', async () => {
    const user = userEvent.setup()
    await seed('exec-view-saved')

    renderAt('exec-view-saved')
    await screen.findByRole('heading', { name: /quick review/i })

    await submitReview({
      executionLogId: 'exec-view-saved',
      sessionRpe: 4,
      goodPasses: 6,
      totalAttempts: 9,
    })

    await user.click(screen.getByRole('radio', { name: /^easy$/i }))
    await user.click(screen.getByRole('button', { name: /^done$/i }))

    await user.click(await screen.findByRole('button', { name: /view saved review/i }))

    expect(await screen.findByTestId('complete-route')).toBeInTheDocument()
  })
})
