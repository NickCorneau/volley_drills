import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { TodaysSetupScreen } from '../TodaysSetupScreen'

/**
 * C-3 Unit 3: `TodaysSetupScreen` is a thin wrapper around
 * `<SetupScreen isOnboarding />`. The substantive behavior is covered by
 * `SetupScreen.test.tsx`; this spec just pins the wiring so a future
 * refactor of the wrapper fails loudly.
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

beforeEach(async () => {
  await clearDb()
})

describe('TodaysSetupScreen (C-3 wrapper)', () => {
  it('renders SetupScreen in onboarding posture (back arrow -> Skill Level)', async () => {
    render(
      <MemoryRouter initialEntries={['/onboarding/todays-setup']}>
        <Routes>
          <Route path="/onboarding/todays-setup" element={<TodaysSetupScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('button', { name: /skill level/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /today.?s setup/i })).toBeInTheDocument()
    // Wind row renders as part of the onboarding flow.
    expect(screen.getByRole('radio', { name: 'Calm' })).toBeInTheDocument()
  })
})
