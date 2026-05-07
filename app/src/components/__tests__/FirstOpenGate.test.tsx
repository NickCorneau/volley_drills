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
          <Route path="*" element={<div data-testid="fallback">fallback</div>} />
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
    expect(screen.getByTestId('current-path').textContent).toBe('/onboarding/skill-level')
  })

  it('redirects stale /tune-today deep links to onboarding on first open', async () => {
    renderAt('/tune-today')
    expect(await screen.findByTestId('skill-level')).toBeInTheDocument()
    expect(screen.getByTestId('current-path').textContent).toBe('/onboarding/skill-level')
  })

  it('redirects stale /tune-today/ deep links to onboarding on first open', async () => {
    renderAt('/tune-today/')
    expect(await screen.findByTestId('skill-level')).toBeInTheDocument()
    expect(screen.getByTestId('current-path').textContent).toBe('/onboarding/skill-level')
  })

  it('redirects first-open Settings skill-level deep links to onboarding', async () => {
    renderAt('/settings/skill-level')
    expect(await screen.findByTestId('skill-level')).toBeInTheDocument()
    expect(screen.getByTestId('current-path').textContent).toBe('/onboarding/skill-level')
  })

  it('backfilled completedAt without skillLevel re-enters Skill Level on entry paths', async () => {
    // H15 defense-in-depth: existing v3 testers with ExecutionLog records
    // get `onboarding.completedAt` backfilled at v4 upgrade time. D137
    // added skill-level-gated assembly, so entry paths now collect the
    // missing skill level before rendering Home.
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
    expect(await screen.findByTestId('skill-level')).toBeInTheDocument()
  })

  it('renders children when completedAt and skillLevel are both set', async () => {
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
    renderAt('/')
    expect(await screen.findByTestId('home')).toBeInTheDocument()
  })
})
