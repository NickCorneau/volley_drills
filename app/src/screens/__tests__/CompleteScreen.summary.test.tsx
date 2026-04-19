import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { CompleteScreen } from '../CompleteScreen'

/**
 * C-2 Unit 3: CompleteScreen renders the Surface 5 inverted-pyramid
 * summary: section header, verdict line (aria-live polite), reason,
 * then the existing recap card + save-status.
 *
 * Verdict wording via `composeSummary` (Unit 1). Session count via
 * `countSubmittedReviews` (Unit 2).
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
  playerCount: 1 | 2
  reviewStatus: 'submitted' | 'skipped'
  sessionRpe?: number | null
  goodPasses?: number
  totalAttempts?: number
  incompleteReason?: 'time' | 'fatigue' | 'pain' | 'other'
  quickTags?: string[]
  extraSubmittedCount?: number
}

async function seed(opts: SeedOpts): Promise<void> {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${opts.execId}`,
    presetId: 'preset-1',
    presetName: 'Test Preset',
    playerCount: opts.playerCount,
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
    activeBlockIndex: 1,
    blockStatuses: [{ blockId: 'b-1', status: 'completed' }],
    startedAt: now - 20 * 60_000,
    completedAt: now - 5 * 60_000,
  })
  await db.sessionReviews.put({
    id: `review-${opts.execId}`,
    executionLogId: opts.execId,
    sessionRpe: opts.sessionRpe ?? (opts.reviewStatus === 'submitted' ? 6 : null),
    goodPasses: opts.goodPasses ?? 0,
    totalAttempts: opts.totalAttempts ?? 0,
    quickTags: opts.quickTags,
    incompleteReason: opts.incompleteReason,
    submittedAt: now,
    status: opts.reviewStatus,
  })
  // Optional extra submitted reviews so `countSubmittedReviews()` >= (N).
  const extra = opts.extraSubmittedCount ?? 0
  for (let i = 0; i < extra; i += 1) {
    await db.sessionReviews.put({
      id: `review-extra-${opts.execId}-${i}`,
      executionLogId: `exec-extra-${i}`,
      sessionRpe: 5,
      goodPasses: 10,
      totalAttempts: 15,
      submittedAt: now - (i + 1) * 60_000,
      status: 'submitted',
    })
  }
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/complete?id=${execId}`]}>
      <Routes>
        <Route path="/complete" element={<CompleteScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CompleteScreen summary (C-2 Unit 3)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it("solo + submitted renders 'Today's verdict' header and 'Keep building' verdict", async () => {
    await seed({
      execId: 'exec-solo',
      playerCount: 1,
      reviewStatus: 'submitted',
      goodPasses: 40,
      totalAttempts: 60,
    })

    renderAt('exec-solo')

    expect(await screen.findByText(/today's verdict/i)).toBeInTheDocument()
    expect(screen.queryByText(/today's pair verdict/i)).not.toBeInTheDocument()
    expect(screen.getByText('Keep building')).toBeInTheDocument()
    // sessionCount === 1 (this review is the only submitted one).
    expect(
      screen.getByText(/Session 1\..*40 good passes today.*60 attempts/i),
    ).toBeInTheDocument()
  })

  it("pair mode renders 'Today's pair verdict' header", async () => {
    await seed({
      execId: 'exec-pair',
      playerCount: 2,
      reviewStatus: 'submitted',
      goodPasses: 20,
      totalAttempts: 60,
    })
    renderAt('exec-pair')

    expect(
      await screen.findByText(/today's pair verdict/i),
    ).toBeInTheDocument()
  })

  it("skipped review renders 'No change' with the skipped reason copy", async () => {
    await seed({
      execId: 'exec-skip',
      playerCount: 1,
      reviewStatus: 'skipped',
      quickTags: ['skipped'],
    })
    renderAt('exec-skip')

    expect(await screen.findByText('No change')).toBeInTheDocument()
    expect(screen.getByText(/no review this time/i)).toBeInTheDocument()
  })

  it("submitted + pain renders 'Lighter next'", async () => {
    await seed({
      execId: 'exec-pain',
      playerCount: 1,
      reviewStatus: 'submitted',
      sessionRpe: 4,
      goodPasses: 3,
      totalAttempts: 8,
      incompleteReason: 'pain',
    })
    renderAt('exec-pain')

    expect(await screen.findByText('Lighter next')).toBeInTheDocument()
    expect(screen.getByText(/gentler/i)).toBeInTheDocument()
  })

  it('session counter reflects countSubmittedReviews (this review + extras)', async () => {
    await seed({
      execId: 'exec-counter',
      playerCount: 1,
      reviewStatus: 'submitted',
      goodPasses: 80,
      totalAttempts: 100,
      extraSubmittedCount: 2, // 2 prior submitted + this one = Session 3.
    })
    renderAt('exec-counter')

    expect(await screen.findByText(/Session 3\./)).toBeInTheDocument()
  })

  it('verdict line has aria-live=polite for screen-reader priority', async () => {
    await seed({
      execId: 'exec-aria',
      playerCount: 1,
      reviewStatus: 'submitted',
      goodPasses: 40,
      totalAttempts: 60,
    })
    renderAt('exec-aria')

    const verdict = await screen.findByText('Keep building')
    const liveRegion = verdict.closest('[aria-live]')
    expect(liveRegion).not.toBeNull()
    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
  })
})
