import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import * as reviewService from '../../services/review'
import { ReviewScreen } from '../ReviewScreen'

/**
 * C-1 Unit 8: Finish Later wiring + deferred sRPE re-entry.
 *
 * - Tapping "Finish later" persists the in-progress review as
 *   `status: 'draft'` and navigates to Home.
 * - Re-entering /review for the same execId loads the draft back into
 *   the form state (Unit 7's `loadReviewDraft` path).
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
        <Route path="/" element={<div data-testid="home-route">home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

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

describe('ReviewScreen Finish Later (C-1 Unit 8)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('Finish later persists the draft and routes to Home', async () => {
    const user = userEvent.setup()
    await seed('exec-later')
    renderAt('exec-later')

    await screen.findByRole('heading', { name: /quick review/i })
    // 2026-04-23 polish: RPE is a 3-chip picker (Easy=3 / Right=5 /
    // Hard=7). `Right` maps to canonical sessionRpe=5.
    await user.click(screen.getByRole('radio', { name: /^right$/i }))
    await user.click(screen.getByRole('button', { name: /finish later/i }))

    expect(await screen.findByTestId('home-route')).toBeInTheDocument()

    const draft = await waitForDraft('exec-later')
    expect(draft?.status).toBe('draft')
    expect(draft?.sessionRpe).toBe(5)
  })

  it('re-entering /review for the same execId loads the draft', async () => {
    const user = userEvent.setup()
    await seed('exec-return')

    // First mount: enter RPE, Finish later.
    const first = renderAt('exec-return')
    await screen.findByRole('heading', { name: /quick review/i })
    await user.click(screen.getByRole('radio', { name: /^hard$/i }))
    await user.click(screen.getByRole('button', { name: /finish later/i }))
    await screen.findByTestId('home-route')
    await waitForDraft('exec-return')
    first.unmount()

    // Second mount: form comes up pre-seeded with the saved draft.
    renderAt('exec-return')
    const rpeChip = await screen.findByRole('radio', { name: /^hard$/i })
    expect(rpeChip).toHaveAttribute('aria-checked', 'true')
  })

  it('Finish later surfaces an error and stays on the screen when saveReviewDraft rejects (rel-4 fix)', async () => {
    const user = userEvent.setup()
    await seed('exec-save-fail')

    // Let the initial draft hydration + form render; then stub
    // `saveReviewDraft` to reject. The auto-save effect also calls it,
    // but the belt save inside `handleFinishLater` is the one that must
    // surface the failure - silently navigating home on save failure
    // violates the Finish-Later promise.
    const spy = vi
      .spyOn(reviewService, 'saveReviewDraft')
      .mockRejectedValue(new Error('simulated quota-exceeded save failure'))

    try {
      renderAt('exec-save-fail')
      await screen.findByRole('heading', { name: /quick review/i })
      await user.click(screen.getByRole('radio', { name: /^right$/i }))

      await user.click(screen.getByRole('button', { name: /finish later/i }))

      // Must NOT have navigated to Home.
      expect(screen.queryByTestId('home-route')).not.toBeInTheDocument()
      // Must surface the error to the tester so they can retry or Submit.
      expect(
        await screen.findByText(
          /could.?n.?t save your draft|draft save failed|couldn.t save|failed to save/i,
          undefined,
          { timeout: 3000 },
        ),
      ).toBeInTheDocument()
    } finally {
      spy.mockRestore()
    }
  })

  it('Finish later does not require an incompleteReason, even on ended-early', async () => {
    const user = userEvent.setup()
    const now = Date.now()
    // Seed an ended-early log; Submit would require `incompleteReason`,
    // Finish Later must NOT.
    await db.sessionPlans.put({
      id: 'plan-ended',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: now - 60_000,
    })
    await db.executionLogs.put({
      id: 'exec-ended',
      planId: 'plan-ended',
      status: 'ended_early',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
      endedEarlyReason: 'fatigue',
    })

    renderAt('exec-ended')
    await screen.findByRole('heading', { name: /quick review/i })
    await user.click(screen.getByRole('radio', { name: /^easy$/i }))
    // Don't pick an incomplete reason - Finish later should still work.
    await user.click(screen.getByRole('button', { name: /finish later/i }))

    expect(await screen.findByTestId('home-route')).toBeInTheDocument()
    const draft = await waitForDraft('exec-ended')
    expect(draft?.status).toBe('draft')
  })
})
