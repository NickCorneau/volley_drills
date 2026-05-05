import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { PerDrillCapture } from '../../db'
import { CompleteScreen } from '../CompleteScreen'

/**
 * Tier 1b D133 (2026-04-26): CompleteScreen recap aggregation when
 * per-drill captures are present on the submitted review.
 *
 * Sources:
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Drill Check (D133)"
 *   docs/plans/2026-04-26-pair-rep-capture-tier1b.md
 *
 * What this file pins:
 *   - Recap "Good passes" prefers the perDrillCaptures aggregate over
 *     the session-level fields when captures exist.
 *   - Tag-only captures surface a "Tagged, counts not logged" line
 *     instead of the dash placeholder so the recap reads honestly.
 *   - Pre-D133 sessions (no perDrillCaptures) use the legacy
 *     session-level fields unchanged.
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
  goodPasses: number
  totalAttempts: number
  perDrillCaptures?: PerDrillCapture[]
}

async function seed(opts: SeedOpts) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${opts.execId}`,
    presetId: 'preset-1',
    presetName: 'Test Preset',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Passing',
        shortName: 'Pass',
        durationMinutes: 15,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: opts.execId,
    planId: `plan-${opts.execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-1', status: 'completed' }],
    startedAt: now - 15 * 60_000,
    completedAt: now - 5 * 60_000,
  })
  await db.sessionReviews.put({
    id: `review-${opts.execId}`,
    executionLogId: opts.execId,
    sessionRpe: 5,
    goodPasses: opts.goodPasses,
    totalAttempts: opts.totalAttempts,
    perDrillCaptures: opts.perDrillCaptures,
    submittedAt: now - 4 * 60_000,
    status: 'submitted',
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/complete?id=${execId}`]}>
      <Routes>
        <Route path="/complete" element={<CompleteScreen />} />
        <Route path="/" element={<div>HomeScreen stub</div>} />
        <Route path="/settings" element={<div>SettingsScreen stub</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(async () => {
  await clearDb()
})

describe('CompleteScreen recap aggregation (D133)', () => {
  it('uses the session-level fields when no perDrillCaptures exist (legacy path)', async () => {
    await seed({
      execId: 'exec-legacy',
      goodPasses: 7,
      totalAttempts: 10,
    })
    renderAt('exec-legacy')

    const cell = await screen.findByTestId('recap-good-passes')
    expect(cell).toHaveTextContent(/7 of 10/)
  })

  it('prefers the perDrillCaptures aggregate over the session-level fields', async () => {
    await seed({
      execId: 'exec-captures',
      goodPasses: 99, // intentionally inconsistent with the captures below
      totalAttempts: 99,
      perDrillCaptures: [
        {
          drillId: 'd01',
          variantId: 'd01-solo',
          blockIndex: 0,
          difficulty: 'still_learning',
          goodPasses: 4,
          attemptCount: 6,
          capturedAt: Date.now(),
        },
        {
          drillId: 'd02',
          variantId: 'd02-solo',
          blockIndex: 1,
          difficulty: 'too_easy',
          goodPasses: 3,
          attemptCount: 4,
          capturedAt: Date.now(),
        },
      ],
    })
    renderAt('exec-captures')

    const cell = await screen.findByTestId('recap-good-passes')
    expect(cell).toHaveTextContent(/7 of 10/)
  })

  it('surfaces "Tagged, counts not logged" when captures are tag-only', async () => {
    await seed({
      execId: 'exec-tag-only',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd01',
          variantId: 'd01-solo',
          blockIndex: 0,
          difficulty: 'too_hard',
          capturedAt: Date.now(),
        },
      ],
    })
    renderAt('exec-tag-only')

    const cell = await screen.findByTestId('recap-good-passes')
    expect(cell).toHaveTextContent(/tagged, counts not logged/i)
  })
})

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 8): the CompleteScreen
 * recap card surfaces a `Difficulty` row composed from the per-drill
 * tag distribution, closing the loop on the chip taps the user made on
 * the new `/run/check` screen between drills. Hidden when no chips were
 * tapped so legacy reviews and all-warmup sessions fall through
 * unchanged.
 */
describe('CompleteScreen Difficulty recap row (Item 8)', () => {
  it('renders a dot-separated tally for a mixed difficulty distribution', async () => {
    await seed({
      execId: 'exec-mixed-difficulty',
      goodPasses: 7,
      totalAttempts: 10,
      perDrillCaptures: [
        {
          drillId: 'd01',
          variantId: 'd01-solo',
          blockIndex: 0,
          difficulty: 'too_hard',
          goodPasses: 3,
          attemptCount: 5,
          capturedAt: Date.now(),
        },
        {
          drillId: 'd02',
          variantId: 'd02-solo',
          blockIndex: 1,
          difficulty: 'still_learning',
          goodPasses: 4,
          attemptCount: 5,
          capturedAt: Date.now(),
        },
        {
          drillId: 'd03',
          variantId: 'd03-solo',
          blockIndex: 2,
          difficulty: 'too_hard',
          capturedAt: Date.now(),
        },
      ],
    })
    renderAt('exec-mixed-difficulty')

    const row = await screen.findByTestId('recap-difficulty')
    expect(row).toHaveTextContent(/^Difficulty\s*2 too hard · 1 still learning$/)
  })

  it('collapses to "All <bucket>" when every chip landed on one tag', async () => {
    await seed({
      execId: 'exec-all-still-learning',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd01',
          variantId: 'd01-solo',
          blockIndex: 0,
          difficulty: 'still_learning',
          capturedAt: Date.now(),
        },
        {
          drillId: 'd02',
          variantId: 'd02-solo',
          blockIndex: 1,
          difficulty: 'still_learning',
          capturedAt: Date.now(),
        },
      ],
    })
    renderAt('exec-all-still-learning')

    const row = await screen.findByTestId('recap-difficulty')
    expect(row).toHaveTextContent(/^Difficulty\s*All still learning$/)
  })

  it('hides the row entirely when no per-drill captures exist (legacy review)', async () => {
    await seed({
      execId: 'exec-legacy-no-difficulty',
      goodPasses: 7,
      totalAttempts: 10,
    })
    renderAt('exec-legacy-no-difficulty')

    // Wait for the recap card to mount (Effort row is the trailing
    // tell), then assert the difficulty row is absent. Without this
    // sequencing the assertion could race the bundle load.
    await screen.findByText(/^Effort$/)
    expect(screen.queryByTestId('recap-difficulty')).toBeNull()
    expect(screen.queryByText(/^Difficulty$/)).toBeNull()
  })

  it('hides the row when perDrillCaptures is an empty array (defensive)', async () => {
    await seed({
      execId: 'exec-empty-captures',
      goodPasses: 4,
      totalAttempts: 6,
      perDrillCaptures: [],
    })
    renderAt('exec-empty-captures')

    await screen.findByText(/^Effort$/)
    expect(screen.queryByTestId('recap-difficulty')).toBeNull()
  })
})

/**
 * D134 (2026-04-28) Phase 2A: CompleteScreen streak receipt.
 *
 * Sources:
 *   docs/archive/plans/2026-04-28-per-drill-capture-coverage-phase-2a-streak.md
 *     §"Receipt-only Complete display"
 *   docs/decisions.md D134
 *
 * What this file pins:
 *   - When the session has at least one capture with
 *     `metricCapture: { kind: 'streak', longest: N }`, render a quiet
 *     "Longest streak" recap row with the value (or dot-separated
 *     values when multiple streak drills logged a streak in one
 *     session, in block order).
 *   - When the session's only captures are streak captures (no count
 *     drills tagged), the "Good passes" recap row hides entirely so
 *     the misleading "Tagged, counts not logged" line never renders
 *     for streak-only sessions.
 *   - Mixed sessions (some streak captures + some count drills with
 *     no counts entered) keep the legacy "Tagged, counts not logged"
 *     line because the count drills genuinely have no count data.
 *   - Streak does NOT roll up into the session-level Good/Total sum;
 *     the receipt sits as its own row.
 */
describe('CompleteScreen Longest streak recap row (D134)', () => {
  it('renders a quiet "Longest streak: N" row for a single streak capture', async () => {
    await seed({
      execId: 'exec-single-streak',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd38',
          variantId: 'd38-pair',
          blockIndex: 0,
          difficulty: 'still_learning',
          capturedAt: Date.now(),
          metricCapture: { kind: 'streak', longest: 7 },
        },
      ],
    })
    renderAt('exec-single-streak')

    const row = await screen.findByTestId('recap-streak')
    expect(row).toHaveTextContent(/^Longest streak\s*7$/)
  })

  it('renders dot-separated longest values when multiple streaks were logged', async () => {
    await seed({
      execId: 'exec-multi-streak',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd38',
          variantId: 'd38-pair',
          blockIndex: 0,
          difficulty: 'still_learning',
          capturedAt: Date.now(),
          metricCapture: { kind: 'streak', longest: 5 },
        },
        {
          drillId: 'd01',
          variantId: 'd01-pair',
          blockIndex: 1,
          difficulty: 'too_easy',
          capturedAt: Date.now(),
          metricCapture: { kind: 'streak', longest: 12 },
        },
      ],
    })
    renderAt('exec-multi-streak')

    const row = await screen.findByTestId('recap-streak')
    expect(row).toHaveTextContent(/^Longest streak\s*5 · 12$/)
  })

  it('hides the Good passes row when the only captures are streak rows', async () => {
    await seed({
      execId: 'exec-streak-only',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd38',
          variantId: 'd38-pair',
          blockIndex: 0,
          difficulty: 'still_learning',
          capturedAt: Date.now(),
          metricCapture: { kind: 'streak', longest: 4 },
        },
      ],
    })
    renderAt('exec-streak-only')

    await screen.findByText(/^Effort$/)
    expect(screen.queryByTestId('recap-good-passes')).toBeNull()
    expect(screen.queryByText(/tagged, counts not logged/i)).toBeNull()
    const streakRow = await screen.findByTestId('recap-streak')
    expect(streakRow).toHaveTextContent(/^Longest streak\s*4$/)
  })

  it('keeps "Tagged, counts not logged" for mixed sessions (streak + count drill missing counts)', async () => {
    await seed({
      execId: 'exec-mixed-streak-count',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd38',
          variantId: 'd38-pair',
          blockIndex: 0,
          difficulty: 'still_learning',
          capturedAt: Date.now(),
          metricCapture: { kind: 'streak', longest: 6 },
        },
        {
          drillId: 'd02',
          variantId: 'd02-solo',
          blockIndex: 1,
          difficulty: 'too_hard',
          capturedAt: Date.now(),
        },
      ],
    })
    renderAt('exec-mixed-streak-count')

    const cell = await screen.findByTestId('recap-good-passes')
    expect(cell).toHaveTextContent(/tagged, counts not logged/i)
    const streakRow = await screen.findByTestId('recap-streak')
    expect(streakRow).toHaveTextContent(/^Longest streak\s*6$/)
  })

  it('shows the count rate AND the streak row when a session mixes streak + counted drills', async () => {
    await seed({
      execId: 'exec-streak-with-counts',
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [
        {
          drillId: 'd10',
          variantId: 'd10-pair',
          blockIndex: 0,
          difficulty: 'still_learning',
          goodPasses: 5,
          attemptCount: 8,
          capturedAt: Date.now(),
        },
        {
          drillId: 'd38',
          variantId: 'd38-pair',
          blockIndex: 1,
          difficulty: 'too_easy',
          capturedAt: Date.now(),
          metricCapture: { kind: 'streak', longest: 9 },
        },
      ],
    })
    renderAt('exec-streak-with-counts')

    const cell = await screen.findByTestId('recap-good-passes')
    expect(cell).toHaveTextContent(/5 of 8/)
    const streakRow = await screen.findByTestId('recap-streak')
    expect(streakRow).toHaveTextContent(/^Longest streak\s*9$/)
  })

  it('hides the Longest streak row entirely on legacy reviews (no metricCapture present)', async () => {
    await seed({
      execId: 'exec-no-streak',
      goodPasses: 7,
      totalAttempts: 10,
      perDrillCaptures: [
        {
          drillId: 'd10',
          variantId: 'd10-pair',
          blockIndex: 0,
          difficulty: 'still_learning',
          goodPasses: 7,
          attemptCount: 10,
          capturedAt: Date.now(),
        },
      ],
    })
    renderAt('exec-no-streak')

    await screen.findByText(/^Effort$/)
    expect(screen.queryByTestId('recap-streak')).toBeNull()
    expect(screen.queryByText(/^Longest streak$/)).toBeNull()
  })
})
