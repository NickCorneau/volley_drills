import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { FirstOpenGate } from '../FirstOpenGate'

/**
 * C-3 Unit 1: FirstOpenGate routes fresh-install testers to
 * `/onboarding/skill-level` when `storageMeta.onboarding.completedAt` is
 * absent. Respects `storageMeta.onboarding.step` so a mid-onboarding
 * reload lands the tester back on the same screen. Renders the children
 * otherwise.
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

function LocationProbe() {
  const { pathname } = useLocation()
  return <div data-testid="current-path">{pathname}</div>
}

function renderAt(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <FirstOpenGate>
        <Routes>
          <Route path="/" element={<div data-testid="home">home</div>} />
          <Route
            path="/onboarding/skill-level"
            element={<div data-testid="skill-level">skill</div>}
          />
          <Route
            path="/onboarding/todays-setup"
            element={<div data-testid="todays-setup">setup</div>}
          />
        </Routes>
        <LocationProbe />
      </FirstOpenGate>
    </MemoryRouter>,
  )
}

describe('FirstOpenGate (C-3 Unit 1)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('redirects to /onboarding/skill-level when completedAt is absent and step is unset', async () => {
    renderAt('/')
    expect(await screen.findByTestId('skill-level')).toBeInTheDocument()
    expect(screen.queryByTestId('home')).not.toBeInTheDocument()
  })

  it('redirects to /onboarding/todays-setup when completedAt is absent and step === "todays_setup"', async () => {
    await db.storageMeta.put({
      key: 'onboarding.step',
      value: 'todays_setup',
      updatedAt: 1,
    })
    renderAt('/')
    expect(await screen.findByTestId('todays-setup')).toBeInTheDocument()
    expect(screen.queryByTestId('skill-level')).not.toBeInTheDocument()
  })

  it('renders children when completedAt is set (post-onboarding)', async () => {
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: Date.now(),
      updatedAt: Date.now(),
    })
    renderAt('/')
    expect(await screen.findByTestId('home')).toBeInTheDocument()
  })

  it('does NOT redirect when already inside /onboarding/* (avoids loop)', async () => {
    renderAt('/onboarding/skill-level')
    expect(await screen.findByTestId('skill-level')).toBeInTheDocument()
    // Path probe shows we did not bounce around.
    expect(screen.getByTestId('current-path').textContent).toBe(
      '/onboarding/skill-level',
    )
  })

  it('respects the C-0 backfill: ExecutionLog existed + completedAt backfilled -> children render', async () => {
    // H15 defense-in-depth: existing v3 testers with ExecutionLog records
    // get `onboarding.completedAt` backfilled at v4 upgrade time. The
    // gate must recognize that as "onboarding is done" and render Home.
    await db.executionLogs.put({
      id: 'exec-existing',
      planId: 'plan-existing',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: 1,
      completedAt: 2,
    })
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 3,
      updatedAt: 3,
    })
    renderAt('/')
    expect(await screen.findByTestId('home')).toBeInTheDocument()
  })
})
