import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db'
import { HomeScreen } from './HomeScreen'

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

beforeEach(async () => {
  await clearDb()
})

describe('HomeScreen chrome (Brandmark + Settings footer link)', () => {
  it('header renders the Brandmark SVG (not the 🏐 emoji) with an accessible label', async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    )

    // A regression guard so a future change can't silently swap the
    // brand mark back out for an emoji or remove the app-bar identity.
    const mark = await screen.findByRole('img', { name: /volleycraft/i })
    expect(mark.tagName.toLowerCase()).toBe('svg')
  })

  it('footer Settings link navigates to /settings', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/settings" element={<div data-testid="settings-route">settings</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('link', { name: /^settings$/i }))
    expect(await screen.findByTestId('settings-route')).toBeInTheDocument()
  })
})

describe('HomeScreen', () => {
  it('shows a pending review prompt and skip review routes to /complete (A9)', async () => {
    await db.sessionPlans.put({
      id: 'plan-1',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: 1,
    })

    // V0B-31 / D120: the home pending-review state is gated by the 2 h
    // Finish Later cap, so the seeded completedAt has to be recent.
    const now = Date.now()
    await db.executionLogs.put({
      id: 'exec-1',
      planId: 'plan-1',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/complete" element={<div data-testid="complete-route">complete</div>} />
        </Routes>
      </MemoryRouter>,
    )

    // C-4 copy: review-pending primary card renders the eyebrow
    // ("Review pending" since 2026-04-26 F11; was "Review your last
    // session" pre-`F11`) + the plan name. Assert both so a future
    // copy change flips the test loudly.
    expect(await screen.findByText(/^Review pending$/)).toBeInTheDocument()
    expect(screen.getByText(/solo \+ wall/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finish review' })).toBeInTheDocument()

    // V0B / red-team #5: Skip review is a two-step confirm - the first tap
    // opens the confirm row, the "Yes, skip" tap writes the expired stub.
    // A9 (red-team fix plan v3): after skip succeeds, Home navigates to
    // /complete/{execId} so the 3-case summary matrix fires (C-2) for the
    // skipped case instead of the tester landing on a silent Home.
    await user.click(screen.getByRole('button', { name: /^skip review$/i }))
    await user.click(await screen.findByRole('button', { name: /yes, skip/i }))

    expect(await screen.findByTestId('complete-route')).toBeInTheDocument()
    expect(await db.sessionReviews.count()).toBe(1)
  })

  it('cancelling the skip-review confirm keeps the pending review in place', async () => {
    await db.sessionPlans.put({
      id: 'plan-2',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: 1,
    })
    const now = Date.now()
    await db.executionLogs.put({
      id: 'exec-2',
      planId: 'plan-2',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('button', { name: /^skip review$/i }))
    await user.click(await screen.findByRole('button', { name: /never mind/i }))

    expect(await screen.findByRole('button', { name: 'Finish review' })).toBeInTheDocument()
    expect(await db.sessionReviews.count()).toBe(0)
  })
})
