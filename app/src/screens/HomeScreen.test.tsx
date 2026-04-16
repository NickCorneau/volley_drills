import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
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
  ])
}

beforeEach(async () => {
  await clearDb()
})

describe('HomeScreen', () => {
  it('shows a pending review prompt and skip review returns to the ready state', async () => {
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

    await db.executionLogs.put({
      id: 'exec-1',
      planId: 'plan-1',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: 10,
      completedAt: 20,
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    )

    expect(await screen.findByText('You have an unreviewed session')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finish Review' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /skip review/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start workout/i })).toBeInTheDocument()
    })
    expect(await db.sessionReviews.count()).toBe(1)
  })
})
