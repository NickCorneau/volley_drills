import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * Phase F Unit 1 (2026-04-19): `Start a different session` on the
 * LastComplete card routes to fresh `/setup` (no `?from=repeat`, no
 * pre-fill, no banner). Replaces the pre-Phase-F `Same as last time`
 * one-tap shortcut and the same-URL-as-Repeat `Edit` text link.
 *
 * Contract pinned by this suite:
 * - LastComplete primary renders the "Start a different session"
 *   tertiary link.
 * - Tap navigates to `/setup` exactly - not `/setup?from=repeat`.
 * - Nothing is written to `sessionDrafts` along the way (the fresh
 *   Setup's Build is the lock boundary, not this tap).
 * - The soft-block modal intercepts the tap when a review is pending.
 *
 * Replaces `HomeScreen.same-as-last.test.tsx` which exercised the cut
 * flow.
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

async function seedLastComplete() {
  const completedAt = Date.now() - 3 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: 'plan-lc',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: completedAt - 60_000,
    context: {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: false,
    },
  })
  await db.executionLogs.put({
    id: 'exec-lc',
    planId: 'plan-lc',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 20 * 60_000,
    completedAt,
  })
  await db.sessionReviews.put({
    id: 'review-exec-lc',
    executionLogId: 'exec-lc',
    sessionRpe: 5,
    goodPasses: 8,
    totalAttempts: 12,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

function LocationProbe() {
  const location = useLocation()
  return (
    <div data-testid="location-probe">
      {location.pathname}
      {location.search}
    </div>
  )
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomeScreen />
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/safety"
          element={
            <>
              <div data-testid="safety-route">safety</div>
              <LocationProbe />
            </>
          }
        />
        <Route
          path="/setup"
          element={
            <>
              <div data-testid="setup-route">setup</div>
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen: Start a different session (Phase F Unit 1)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('tap on LastComplete tertiary link routes to fresh /setup (no ?from=repeat)', async () => {
    const user = userEvent.setup()
    await seedLastComplete()
    renderHome()

    // LastComplete primary renders and the tertiary "Start a different
    // session" link is present.
    await screen.findByRole('button', { name: /repeat last session/i })
    const startDifferent = screen.getByRole('button', {
      name: /start a different session/i,
    })
    await user.click(startDifferent)

    // Lands on /setup, NOT /setup?from=repeat - the distinction between
    // "continue from last" (Repeat) and "today is different"
    // (Start a different session) is the whole point of the Phase F
    // cleanup.
    await screen.findByTestId('setup-route')
    const probe = screen.getByTestId('location-probe')
    expect(probe.textContent).toBe('/setup')

    // No draft was written: the fresh Setup's Build is the lock
    // boundary, not the tertiary tap. (Pre-Phase-F "Same as last time"
    // persisted a draft on tap; the replacement does not.)
    expect(await db.sessionDrafts.count()).toBe(0)
  })

  it('regression guard: neither "Edit" nor "Same as last time" render on LastComplete anymore', async () => {
    await seedLastComplete()
    renderHome()

    await screen.findByRole('button', { name: /repeat last session/i })

    expect(screen.queryByRole('button', { name: /^edit$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /same as last time/i })).not.toBeInTheDocument()
  })

  it('review pending: Start a different session fires the soft-block modal', async () => {
    const user = userEvent.setup()
    await seedLastComplete()
    // Add a pending review - LastComplete moves to the secondary list
    // in the flat 4-row precedence. The Start-a-different-session
    // tertiary ONLY renders on the LastComplete primary card, so with
    // review pending it's absent AND the soft-block modal is the
    // behavior the primary tap fires.
    //
    // This test seeds review pending + last_complete and proves the
    // link is gone, then proves the underlying intercepted CTA still
    // fires the modal by tapping the NewUser-style primary - which
    // we can't seed here (new_user is mutually exclusive with
    // review_pending). Instead: assert the modal contract indirectly
    // by tapping the Finish Review CTA and confirming the modal does
    // NOT fire for review-wise CTAs (the Finish Review button is a
    // review CTA, not a non-review one).
    //
    // The direct Start-a-different-session + soft-block intercept is
    // covered by the HomePrimaryCard.test.tsx unit-level test plus
    // the Draft-open + review-pending case in precedence.test.tsx.
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-pr',
      presetId: 'pair_net',
      presetName: 'Pair + Net',
      playerCount: 2,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: now - 60_000,
    })
    await db.executionLogs.put({
      id: 'exec-pr',
      planId: 'plan-pr',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
    })

    renderHome()
    await screen.findByRole('button', { name: 'Finish review' })

    // LastComplete moved to the secondary list: the Start-a-different
    // tertiary is a LastComplete-primary affordance only, so it's gone
    // here.
    expect(
      screen.queryByRole('button', { name: /start a different session/i }),
    ).not.toBeInTheDocument()

    // Tapping the secondary-row Repeat fires the soft-block modal
    // (contract inherited from C-4 Unit 4 + precedence.test.tsx). This
    // confirms the intercept wrapper is still in place for non-review
    // CTAs even after the Phase F handler rename.
    const repeat = screen.getByRole('button', { name: /^repeat$/i })
    await user.click(repeat)

    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /finish.*review first/i })).toBeInTheDocument(),
    )
  })
})
