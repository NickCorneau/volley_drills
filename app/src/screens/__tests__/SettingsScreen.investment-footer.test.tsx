import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionPlan } from '../../db'
import { SettingsScreen } from '../SettingsScreen'

/**
 * 2026-04-27 reconciled-list `R13`: SettingsScreen carries a quiet
 * `Logged: N sessions · H:MM total` footer just above the existing
 * `Your data stays on this device.` line.
 *
 * Pin three behaviors:
 *   1. Hidden when `count === 0` so first-week testers see no row.
 *   2. Visible with both count and total once at least one terminal
 *      session has been logged.
 *   3. Excludes `discarded_resume` stubs (`A8`).
 *
 * Singular vs plural is also pinned because the row is a single
 * sentence ("Logged: 1 session" reads wrong as "1 sessions").
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

function plan(id: string): SessionPlan {
  return {
    id,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 1,
  }
}

function completedLog(id: string, startedAt: number, completedAt: number): ExecutionLog {
  return {
    id,
    planId: id,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt,
    completedAt,
  }
}

function renderSettings() {
  return render(
    <MemoryRouter initialEntries={['/settings']}>
      <Routes>
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
})

describe('SettingsScreen investment footer (R13)', () => {
  it('hides the footer entirely when no sessions have been logged', async () => {
    renderSettings()

    // Wait for the privacy line so we know the screen has settled.
    await screen.findByText(/your data stays on this device/i)

    expect(screen.queryByTestId('settings-investment-footer')).not.toBeInTheDocument()
    expect(screen.queryByText(/^Logged:/)).not.toBeInTheDocument()
  })

  it('renders count + H:MM total with the singular `session` for exactly one logged session', async () => {
    const now = Date.now()
    await db.sessionPlans.put(plan('a'))
    // 25 minutes
    await db.executionLogs.put(completedLog('a', now - 25 * 60_000, now))

    renderSettings()

    const row = await screen.findByTestId('settings-investment-footer')
    expect(row).toBeInTheDocument()
    expect(row.textContent).toMatch(/Logged: 1 session/)
    expect(row.textContent).not.toMatch(/sessions/)
    expect(row.textContent).toMatch(/0:25 total/)
  })

  it('renders the plural `sessions` and a multi-hour H:MM total for multiple logged sessions', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([plan('a'), plan('b'), plan('c')])
    await db.executionLogs.bulkPut([
      // 45 + 30 + 60 = 135 -> 2:15
      completedLog('a', now - 60 * 60 * 1000, now - 15 * 60 * 1000),
      completedLog('b', now - 30 * 60_000, now),
      completedLog('c', now - 60 * 60_000, now),
    ])

    renderSettings()

    const row = await screen.findByTestId('settings-investment-footer')
    expect(row.textContent).toMatch(/Logged: 3 sessions/)
    expect(row.textContent).toMatch(/2:15 total/)
  })

  it('excludes discarded_resume stubs (A8)', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([plan('a'), plan('b')])
    await db.executionLogs.bulkPut([
      completedLog('a', now - 10 * 60_000, now),
      // discarded resume should not contribute to either count or total
      {
        id: 'b',
        planId: 'b',
        status: 'ended_early',
        endedEarlyReason: 'discarded_resume',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 60 * 60_000,
        completedAt: now - 30 * 60_000,
      },
    ])

    renderSettings()

    await waitFor(() =>
      expect(screen.getByTestId('settings-investment-footer')).toBeInTheDocument(),
    )
    const row = screen.getByTestId('settings-investment-footer')
    expect(row.textContent).toMatch(/Logged: 1 session/)
    expect(row.textContent).toMatch(/0:10 total/)
  })
})
