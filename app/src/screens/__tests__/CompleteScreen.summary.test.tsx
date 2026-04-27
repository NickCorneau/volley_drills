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

  it("solo + submitted renders verdict word with no eyebrow above it", async () => {
    // 2026-04-26 pre-D91 editorial polish (`F10`, `D125` / `D132`
    // pair-first vision-stance check): the solo eyebrow
    // `Today's verdict` was redundant with the giant `<h2>` verdict
    // word below ("Keep building" / "Lighter next" / "No change").
    // It is now omitted on solo. The pair eyebrow `Today's pair
    // verdict` still renders because it carries the only pair-
    // context signal on the screen. Domain-layer `summary.header`
    // is unchanged (still emits both strings); the omission is
    // render-time only.
    //
    // Future contributors: do NOT re-add the solo eyebrow. The
    // `composeSummary` test in `sessionSummary.test.ts` confirms
    // `header === "Today's verdict"` is still emitted at the
    // domain layer for screen readers / future surfaces.
    await seed({
      execId: 'exec-solo',
      playerCount: 1,
      reviewStatus: 'submitted',
      goodPasses: 40,
      totalAttempts: 60,
    })

    renderAt('exec-solo')

    expect(await screen.findByText('Keep building')).toBeInTheDocument()
    expect(screen.queryByText(/today's verdict/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/today's pair verdict/i)).not.toBeInTheDocument()
    // 2026-04-26 pre-D91 editorial polish (`F9`): the
    // `Completed session N:` ordinal prefix was dropped — the reason
    // line leads with the stats sentence directly.
    expect(
      screen.getByText(
        /^40 good passes today out of 60 attempts\. Ready when you are\.$/,
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Completed session/i)).not.toBeInTheDocument()
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

  it('reason line reflects the submitted stats regardless of session count', async () => {
    // 2026-04-26 pre-D91 editorial polish (`F9`): the
    // `Completed session N` ordinal was dropped from Complete, so
    // `countSubmittedReviews` no longer surfaces on this screen.
    // `sessionCount` still flows through `composeSummary` as data
    // (other surfaces may want it later), but the rendered reason
    // line is identical for any sessionCount > 0 + attempts > 0 — it
    // leads with the stats sentence and ends with the forward hook.
    await seed({
      execId: 'exec-counter',
      playerCount: 1,
      reviewStatus: 'submitted',
      goodPasses: 80,
      totalAttempts: 100,
      extraSubmittedCount: 2, // would have been "Completed session 3" pre-`F9`.
    })
    renderAt('exec-counter')

    expect(
      await screen.findByText(
        /^80 good passes today out of 100 attempts\. Ready when you are\.$/,
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Completed session/i)).not.toBeInTheDocument()
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
