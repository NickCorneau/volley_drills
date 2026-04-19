import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { SetupScreen } from '../SetupScreen'

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

describe('SetupScreen (C-3)', () => {
  it('onboarding: back navigates to skill level route', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route
            path="/onboarding/todays-setup"
            element={<SetupScreen isOnboarding />}
          />
          <Route
            path="/onboarding/skill-level"
            element={<div>skill-level-route</div>}
          />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /skill level/i }))
    expect(await screen.findByText('skill-level-route')).toBeInTheDocument()
  })

  it('onboarding: light wind is stored on draft and completes onboarding meta', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route
            path="/onboarding/todays-setup"
            element={<SetupScreen isOnboarding />}
          />
          <Route path="/safety" element={<div>safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('radio', { name: 'Solo' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole(
        'radio',
        { name: 'No' },
      ),
    )
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Wall available' })).getByRole(
        'radio',
        { name: 'No' },
      ),
    )
    await user.click(screen.getByRole('radio', { name: 'Light wind' }))
    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByText('safety')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft?.context.wind).toBe('light')

    const completed = await db.storageMeta.get('onboarding.completedAt')
    expect(typeof completed?.value).toBe('number')
  })

  it("onboarding: 'Calm' (default) wind is NOT persisted on the draft (keeps context lean)", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route
            path="/onboarding/todays-setup"
            element={<SetupScreen isOnboarding />}
          />
          <Route path="/safety" element={<div>safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('radio', { name: 'Solo' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole(
        'radio',
        { name: 'No' },
      ),
    )
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Wall available' })).getByRole(
        'radio',
        { name: 'No' },
      ),
    )
    // Leave wind on the default "Calm".
    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByText('safety')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    // C-0 Key Decision #7: callers handle undefined as 'calm'; don't
    // materialize the default so reads of legacy v3 records remain
    // undefined-consistent.
    expect(draft?.context.wind).toBeUndefined()
  })

  it('C-5 Unit 1: /setup?from=repeat renders the stale-context banner with the last-session day name', async () => {
    // Seed a completed session 3 days ago (must be Tuesday if today is
    // Friday etc — the test asserts a weekday match rather than a
    // specific one so it's stable across CI run days).
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
    const completedAt = Date.now() - THREE_DAYS_MS
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 1,
      updatedAt: 1,
    })
    await db.sessionPlans.put({
      id: 'plan-lc',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
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
      sessionRpe: 6,
      goodPasses: 10,
      totalAttempts: 15,
      submittedAt: completedAt,
      status: 'submitted',
    })

    render(
      <MemoryRouter initialEntries={['/setup?from=repeat']}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    // Banner renders with role="status" + aria-live="polite".
    const banner = await screen.findByRole('status')
    expect(banner).toHaveAttribute('aria-live', 'polite')
    // Copy: "Setup pre-filled from {dayName}. Adjust if today's different."
    // 3 days ago is in the [2..6] window -> weekday name.
    expect(banner.textContent).toMatch(
      /Setup pre-filled from (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\. Adjust if today.?s different/i,
    )

    // Context pre-filled from the last plan: solo, net-no, wall-yes, 25 min.
    expect(
      within(screen.getByRole('radiogroup', { name: 'Player mode' })).getByRole(
        'radio',
        { name: 'Solo', checked: true },
      ),
    ).toBeInTheDocument()
  })

  it('C-5 Unit 1: plain /setup (no from=repeat) does NOT render the banner', async () => {
    // Seed a completed session so the banner *could* fire if the gate
    // were broken.
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 1,
      updatedAt: 1,
    })
    const completedAt = Date.now() - 3 * 24 * 60 * 60 * 1000
    await db.sessionPlans.put({
      id: 'plan-lc',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
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
      sessionRpe: 6,
      goodPasses: 10,
      totalAttempts: 15,
      submittedAt: completedAt,
      status: 'submitted',
    })

    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    // Wait for prefill completion so the absence assertion is meaningful.
    await screen.findByRole('radio', { name: 'Solo', checked: true })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('non-onboarding Build does NOT write onboarding.completedAt (regression guard per C-3 Unit 3 test scenarios)', async () => {
    // Pre-set the completedAt sentinel so the non-onboarding escape
    // doesn't bounce us to /onboarding/*.
    const existingCompletedAt = 1_700_000_000_000
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: existingCompletedAt,
      updatedAt: existingCompletedAt,
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/setup']}>
        <Routes>
          <Route path="/setup" element={<SetupScreen />} />
          <Route path="/safety" element={<div>safety</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(await screen.findByRole('radio', { name: 'Solo' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Net available' })).getByRole(
        'radio',
        { name: 'No' },
      ),
    )
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Wall available' })).getByRole(
        'radio',
        { name: 'No' },
      ),
    )
    await user.click(screen.getByRole('button', { name: /build session/i }))

    expect(await screen.findByText('safety')).toBeInTheDocument()

    // Non-onboarding Build must NOT mutate the sentinel — updatedAt
    // unchanged from the seed, value unchanged.
    const row = await db.storageMeta.get('onboarding.completedAt')
    expect(row?.value).toBe(existingCompletedAt)
    expect(row?.updatedAt).toBe(existingCompletedAt)
  })
})
