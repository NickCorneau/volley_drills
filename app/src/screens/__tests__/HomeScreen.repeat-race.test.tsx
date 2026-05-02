import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import { getStorageMeta } from '../../services/storageMeta'
import { HomeScreen } from '../HomeScreen'

vi.mock('../../services/storageMeta', async () => {
  const actual = await vi.importActual<typeof import('../../services/storageMeta')>(
    '../../services/storageMeta',
  )
  return {
    ...actual,
    getStorageMeta: vi.fn(),
  }
})

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
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: 'plan-race',
    presetId: 'pair_net',
    presetName: 'Pair + Net',
    playerCount: 2,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
    context: {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
      sessionFocus: 'serve',
    },
  })
  await db.executionLogs.put({
    id: 'exec-race',
    planId: 'plan-race',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 25 * 60_000,
    completedAt,
  })
  await db.sessionReviews.put({
    id: 'review-exec-race',
    executionLogId: 'exec-race',
    sessionRpe: 6,
    goodPasses: 8,
    totalAttempts: 12,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

function renderHome() {
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/tune-today" element={<div data-testid="tune-route">tune</div>} />
        <Route path="/setup" element={<div data-testid="setup-route">setup</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
  vi.mocked(getStorageMeta).mockReset()
  vi.mocked(getStorageMeta).mockResolvedValue(undefined)
})

describe('HomeScreen Repeat race guard', () => {
  it('disables competing LastComplete actions while Repeat is rebuilding', async () => {
    const user = userEvent.setup()
    let resolveSkillLevel: (value: undefined) => void = () => undefined
    vi.mocked(getStorageMeta).mockReturnValue(
      new Promise((resolve) => {
        resolveSkillLevel = resolve
      }),
    )
    await seedLastComplete()
    renderHome()

    await user.click(await screen.findByRole('button', { name: /repeat last session/i }))
    expect(await screen.findByRole('button', { name: /start a different session/i })).toBeDisabled()

    await act(async () => {
      resolveSkillLevel(undefined)
      await Promise.resolve()
    })

    expect(await screen.findByTestId('tune-route')).toBeInTheDocument()
    expect(await db.sessionDrafts.get('current')).toBeDefined()
  })
})
