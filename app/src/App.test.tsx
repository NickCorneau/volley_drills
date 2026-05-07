import { render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { db } from './db'

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

function LocationProbe() {
  const { pathname } = useLocation()
  return <div data-testid="current-path">{pathname}</div>
}

describe('App routes', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('falls completed-user stale /tune-today links back to Home', async () => {
    await db.storageMeta.bulkPut([
      {
        key: 'onboarding.completedAt',
        value: 3,
        updatedAt: 3,
      },
      {
        key: 'onboarding.skillLevel',
        value: 'rally_builders',
        updatedAt: 3,
      },
    ])

    render(
      <MemoryRouter initialEntries={['/tune-today']}>
        <App />
        <LocationProbe />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: /volleycraft/i })).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/')
  })
})
