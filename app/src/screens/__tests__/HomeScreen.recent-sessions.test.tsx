import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * Tier 1a Unit 5 (2026-04-20): HomeScreen integration tests for the
 * last-3-sessions trailer. Verifies:
 *   - Fresh install renders nothing (no empty state).
 *   - Seeded sessions render one row each in reverse-chronological
 *     order with inferred focus + Done/Partial completion.
 *   - Resume active suppresses the trailer (Resume is the only legal
 *     Home surface in that case).
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
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

interface SeedOpts {
  execId: string
  drillName: string
  completedAt: number
  completed: boolean
}

async function seedSession(opts: SeedOpts) {
  const planId = `plan-${opts.execId}`
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: `${planId}-warmup`,
        type: 'warmup',
        drillName: 'Beach Prep Three',
        shortName: 'Beach Prep',
        durationMinutes: 3,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: `${planId}-main`,
        type: 'main_skill',
        drillName: opts.drillName,
        shortName: opts.drillName,
        durationMinutes: 8,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: opts.completedAt - 60_000,
  })
  await db.executionLogs.put({
    id: opts.execId,
    planId,
    status: opts.completed ? 'completed' : 'ended_early',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: opts.completedAt - 20 * 60_000,
    completedAt: opts.completedAt,
  })
  // Finalized review so the newest also backs the LastComplete primary
  // card; we don't assert on that here but seeding it keeps the
  // precedence realistic.
  await db.sessionReviews.put({
    id: `review-${opts.execId}`,
    executionLogId: opts.execId,
    sessionRpe: 6,
    goodPasses: 8,
    totalAttempts: 12,
    submittedAt: opts.completedAt,
    status: 'submitted',
  })
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen recent sessions trailer (Tier 1a Unit 5)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders nothing on a fresh install', async () => {
    renderHome()
    // Wait for Home to leave its loading state.
    await screen.findByRole('button', { name: /start first session/i })
    expect(screen.queryByRole('region', { name: /recent sessions/i })).not.toBeInTheDocument()
  })

  it('renders three rows in reverse chronological order with focus + completion', async () => {
    const now = Date.now()
    await seedSession({
      execId: 'x-newest',
      drillName: 'Bump Set Fundamentals',
      completedAt: now - 60_000,
      completed: true,
    })
    await seedSession({
      execId: 'x-middle',
      drillName: 'Pass & Slap Hands',
      completedAt: now - 2 * 24 * 60 * 60_000,
      completed: false,
    })
    await seedSession({
      execId: 'x-oldest',
      drillName: 'Partner Set Back-and-Forth',
      completedAt: now - 10 * 24 * 60 * 60_000,
      completed: true,
    })

    renderHome()

    const trailer = await screen.findByRole('region', {
      name: /recent sessions/i,
    })
    const rows = await waitFor(() => {
      const found = trailer.querySelectorAll('li')
      expect(found.length).toBe(3)
      return found
    })

    // Row 0: newest - Today, Set (from d38), Done.
    // Copy pass 2026-04-21: Yes/No column relabelled to Done/Partial so
    // the trailer reads as self-describing without a column header.
    expect(rows[0].textContent).toMatch(/Today/i)
    expect(rows[0].textContent).toMatch(/Set/)
    expect(rows[0].textContent).toMatch(/Done/)

    // Row 1: middle - Pass, Partial (ended_early).
    expect(rows[1].textContent).toMatch(/Pass/)
    expect(rows[1].textContent).toMatch(/Partial/)

    // Row 2: oldest - Set (d41), Done.
    expect(rows[2].textContent).toMatch(/Set/)
    expect(rows[2].textContent).toMatch(/Done/)
  })

  it('is suppressed when a resumable session is active', async () => {
    const now = Date.now()
    await seedSession({
      execId: 'x-history',
      drillName: 'Bump Set Fundamentals',
      completedAt: now - 60_000,
      completed: true,
    })
    // Seed a resumable session so Resume wins the primary slot.
    const resumePlanId = 'plan-resume'
    await db.sessionPlans.put({
      id: resumePlanId,
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [
        {
          id: 'b-0',
          type: 'warmup',
          drillName: 'Beach Prep Three',
          shortName: 'Beach Prep',
          durationMinutes: 3,
          coachingCue: '',
          courtsideInstructions: '',
          required: true,
        },
      ],
      safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
      createdAt: now - 30_000,
    })
    await db.executionLogs.put({
      id: 'exec-resume',
      planId: resumePlanId,
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
      startedAt: now - 30_000,
      pausedAt: now - 10_000,
    })

    renderHome()
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.queryByRole('region', { name: /recent sessions/i })).not.toBeInTheDocument()
  })
})
