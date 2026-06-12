import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'
import type { DifficultyTag } from '../../model'

/**
 * M002.1 (R5): the accept/keep verdict at review end.
 *
 * Integration test over real fake-indexeddb + real services: seeds prior
 * eligible pass sessions trending too_hard so the controller computes a
 * real "less" offer, then asserts the verdict block renders with
 * keep-original pre-selected and that the chosen verdict persists onto
 * the submitted review row.
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

function passPlan(id: string, createdAt: number) {
  return {
    id,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1 as const,
    blocks: [
      {
        id: `${id}-b1`,
        type: 'main_skill' as const,
        drillName: 'Continuous Passing',
        shortName: 'Pass',
        durationMinutes: 12,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt,
  }
}

async function seedPriorPassSession(execId: string, daysAgo: number, tag: DifficultyTag) {
  const now = Date.now()
  const t = now - daysAgo * 86400000
  await db.sessionPlans.put(passPlan(`plan-${execId}`, t))
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: t,
    completedAt: t,
  })
  await db.sessionReviews.put({
    id: `review-${execId}`,
    executionLogId: execId,
    sessionRpe: 7,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: t,
    status: 'submitted',
    eligibleForAdaptation: true,
    perDrillCaptures: [0, 1].map((k) => ({
      drillId: 'd01',
      variantId: 'd01-solo',
      blockIndex: k,
      difficulty: tag,
      capturedAt: t,
    })),
  })
}

/** A current, completed, not-yet-reviewed session. */
async function seedCurrentSession(execId: string) {
  const now = Date.now()
  await db.sessionPlans.put(passPlan(`plan-${execId}`, now - 60_000))
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: now - 60_000,
    completedAt: now - 30_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/complete" element={<div>complete</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen verdict (M002.1 R5)', () => {
  beforeEach(async () => {
    await clearDb()
    // Trust-loop U2 re-seed: two too-hard pass sessions with no skill
    // level is exactly the AE7 ladder-floor fixture (beginner pass
    // starts at rung 1, so a 'less' offer is gated to keep). Persist an
    // intermediate-band skill level so pass starts at rung 2 and the
    // 'less' offer stays movable.
    await db.storageMeta.put({
      key: 'onboarding.skillLevel',
      value: 'rally_builders',
      updatedAt: Date.now(),
    })
  })

  it('offers the verdict with keep-original pre-selected, and persists "accepted" on submit', async () => {
    await seedPriorPassSession('e1', 4, 'too_hard')
    await seedPriorPassSession('e2', 2, 'too_hard')
    await seedCurrentSession('cur')

    const user = userEvent.setup()
    renderAt('cur')

    // Verdict block renders with the "less" line (sustained too_hard).
    expect(await screen.findByText('Next time')).toBeInTheDocument()
    expect(screen.getByText('Ease the stress on passing next time.')).toBeInTheDocument()
    const keep = screen.getByRole('radio', { name: 'Keep the same' })
    const tryIt = screen.getByRole('radio', { name: 'Try it' })
    // Keep-original is the pre-selected default (safe, no silent reshuffle).
    expect(keep).toHaveAttribute('aria-checked', 'true')
    expect(tryIt).toHaveAttribute('aria-checked', 'false')

    // Accept the offer, rate effort, submit.
    await user.click(tryIt)
    await user.click(screen.getByRole('radio', { name: /Right/i }))
    await user.click(screen.getByRole('button', { name: 'Done' }))

    await waitFor(async () => {
      const row = await db.sessionReviews.get('review-cur')
      expect(row?.verdictChoice).toBe('accepted')
      expect(row?.offeredDelta).toEqual({ kind: 'stress', focus: 'pass', direction: 'less' })
    })
  })

  it('shows no verdict block when there is no prior trend (keep offer)', async () => {
    await seedCurrentSession('cur')
    renderAt('cur')
    // Wait for the review form to settle, then assert the block is absent.
    expect(await screen.findByText(/How hard was your session/i)).toBeInTheDocument()
    expect(screen.queryByText('Next time')).not.toBeInTheDocument()
  })
})
