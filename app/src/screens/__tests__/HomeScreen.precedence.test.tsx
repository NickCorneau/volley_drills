import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * C-4 Unit 5: HomeScreen precedence matrix integration test.
 *
 * Each row of the flat 4-row precedence table is seeded end-to-end, the
 * HomeScreen mounts, and we assert the expected primary card renders.
 * Secondary rows are sampled in the most-permutation-heavy cell
 * (review_pending + draft + last_complete).
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

async function seedResumable(execId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillName: 'Warm up',
        shortName: 'Warm',
        durationMinutes: 3,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'in_progress',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
    startedAt: now - 10 * 60_000,
    pausedAt: now - 5 * 60_000,
  })
}

async function seedPendingReview(execId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'pair_net',
    presetName: 'Pair + Net',
    playerCount: 2,
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
    startedAt: now - 20 * 60_000,
    completedAt: now - 5 * 60_000,
  })
  // No review record -> findPendingReview returns this log.
}

async function seedDraft() {
  await db.sessionDrafts.put({
    id: 'current',
    context: {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: false,
    },
    archetypeId: 'solo_open',
    archetypeName: 'Solo + Open',
    blocks: [],
    updatedAt: Date.now(),
  })
}

async function seedLastComplete(execId: string) {
  const completedAt = Date.now() - 3 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall (yesterday)',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 20 * 60_000,
    completedAt,
  })
  await db.sessionReviews.put({
    id: `review-${execId}`,
    executionLogId: execId,
    sessionRpe: 6,
    goodPasses: 10,
    totalAttempts: 15,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/complete" element={<div data-testid="complete-route">complete</div>} />
        <Route path="/review" element={<div data-testid="review-route">review</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen precedence matrix (C-4 Unit 5)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('new_user: empty DB renders Start first session', async () => {
    renderHome()
    expect(await screen.findByRole('button', { name: /start first session/i })).toBeInTheDocument()
  })

  it('last_complete only: renders Repeat last session', async () => {
    await seedLastComplete('exec-lc')
    renderHome()
    expect(await screen.findByRole('button', { name: /repeat last session/i })).toBeInTheDocument()
    // No Session ready card.
    expect(screen.queryByText(/session ready/i)).not.toBeInTheDocument()
  })

  it('draft + last_complete: draft primary, last_complete as secondary row', async () => {
    await seedDraft()
    await seedLastComplete('exec-lc')
    renderHome()

    expect(await screen.findByRole('button', { name: /^continue$/i })).toBeInTheDocument()
    expect(screen.getByText(/solo \+ open/i)).toBeInTheDocument()

    // Secondary row references the last completed preset.
    const secondary = screen.getByRole('list', {
      name: /other active actions/i,
    })
    expect(secondary).toHaveTextContent(/solo \+ wall \(yesterday\)/i)
  })

  it('review_pending + draft + last_complete: review primary + both secondaries', async () => {
    await seedPendingReview('exec-pr')
    await seedDraft()
    await seedLastComplete('exec-lc')
    renderHome()

    await screen.findByRole('button', { name: 'Finish review' })
    expect(screen.getByText(/pair \+ net/i)).toBeInTheDocument()

    const secondary = screen.getByRole('list', {
      name: /other active actions/i,
    })
    expect(secondary).toHaveTextContent(/solo \+ open/i)
    expect(secondary).toHaveTextContent(/solo \+ wall \(yesterday\)/i)
  })

  it('resume: overrides all other flags, only the resume dialog renders', async () => {
    await seedResumable('exec-resume')
    await seedDraft()
    await seedLastComplete('exec-lc')
    renderHome()

    // ResumePrompt mounts as a role="dialog"; secondary list is muted.
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.queryByRole('list', { name: /other active actions/i })).not.toBeInTheDocument()
  })

  it('soft-block modal: draft Start with review pending intercepts first tap', async () => {
    const user = userEvent.setup()
    await seedPendingReview('exec-pr')
    await seedDraft()
    renderHome()

    // review_pending is primary; Draft is in the secondary list.
    await screen.findByRole('button', { name: 'Finish review' })
    const secondary = screen.getByRole('list', {
      name: /other active actions/i,
    })
    const draftOpen = screen.getByRole('button', { name: /^continue$/i })
    expect(secondary).toContainElement(draftOpen)

    await user.click(draftOpen)

    // D-C1 soft-block modal appears instead of routing to /safety.
    expect(await screen.findByRole('dialog', { name: /finish.*review first/i })).toBeInTheDocument()
  })
})
