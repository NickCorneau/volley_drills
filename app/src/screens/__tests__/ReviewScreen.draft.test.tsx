import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'

/**
 * C-1 Unit 7: draft persistence + notCaptured escape.
 *
 * - First meaningful change on ReviewScreen persists a `status: 'draft'`.
 * - Re-mounting for the same execId seeds the form state from the draft.
 * - `notCaptured` chip zeroes the metric and tags the review
 *   `quickTags: ['notCaptured']`; the draft persists that state.
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
    // A plan with a skill block so showMetrics renders (PassMetricInput
    // is gated on the plan containing a main_skill / pressure block).
    blocks: [
      {
        id: 'block-a',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 10,
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
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen draft persistence (C-1 Unit 7)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('writes status: draft on first meaningful change (RPE tap)', async () => {
    const user = userEvent.setup()
    await seed('exec-first')
    renderAt('exec-first')

    await screen.findByRole('heading', { name: /quick review/i })
    await user.click(screen.getByRole('radio', { name: /^7/ }))

    // Draft write is fire-and-forget; wait a tick for Dexie.
    const draft = await waitForDraft('exec-first')
    expect(draft?.status).toBe('draft')
    expect(draft?.sessionRpe).toBe(7)
  })

  it('rehydrates form state from an existing draft on mount', async () => {
    await seed('exec-reload')
    await db.sessionReviews.put({
      id: `review-exec-reload`,
      executionLogId: 'exec-reload',
      sessionRpe: 8,
      goodPasses: 12,
      totalAttempts: 18,
      submittedAt: Date.now(),
      status: 'draft',
    })

    renderAt('exec-reload')
    await screen.findByRole('heading', { name: /quick review/i })

    // Verify the RPE chip comes up pre-selected (aria-checked=true).
    const rpeChip = await screen.findByRole('radio', { name: /^8/ })
    expect(rpeChip).toHaveAttribute('aria-checked', 'true')
  })

  it('notCaptured chip tags the draft with quickTags: [notCaptured] and zeros the metric', async () => {
    const user = userEvent.setup()
    await seed('exec-notcap')
    renderAt('exec-notcap')

    await screen.findByRole('heading', { name: /quick review/i })

    // notCaptured chip lives under the pass-metric input. Tap it.
    await user.click(
      await screen.findByRole('button', { name: /couldn.t capture reps/i }),
    )

    // Pick an RPE to trigger the draft write (notCaptured alone is not a
    // "meaningful change" for UX purposes — the tester can un-tap it).
    await user.click(screen.getByRole('radio', { name: /^4/ }))

    const draft = await waitForDraft('exec-notcap')
    expect(draft?.status).toBe('draft')
    expect(draft?.quickTags).toContain('notCaptured')
    expect(draft?.goodPasses).toBe(0)
    expect(draft?.totalAttempts).toBe(0)
  })
})

async function waitForDraft(execId: string, attempts = 20) {
  for (let i = 0; i < attempts; i += 1) {
    const row = await db.sessionReviews
      .where('executionLogId')
      .equals(execId)
      .first()
    if (row) return row
    await new Promise((r) => setTimeout(r, 25))
  }
  return undefined
}
