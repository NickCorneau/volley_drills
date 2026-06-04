import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { CompleteScreen } from '../CompleteScreen'
import type { AdaptationDelta, VerdictChoice } from '../../model'

/**
 * M002.1 (R5/D3): CompleteScreen surfaces the carry-forward line ONLY
 * when the user ACCEPTED the offered delta on this review — never on a
 * kept-original, so Complete and the next Home read stay coherent.
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

async function seed(opts: {
  execId: string
  offeredDelta?: AdaptationDelta
  verdictChoice?: VerdictChoice
}) {
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
        drillName: 'Continuous Passing',
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
    sessionRpe: 6,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: now,
    status: 'submitted',
    offeredDelta: opts.offeredDelta,
    verdictChoice: opts.verdictChoice,
  })
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

describe('CompleteScreen carry-forward (M002.1)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders the carry-forward line when the verdict was accepted', async () => {
    await seed({
      execId: 'exec-accepted',
      offeredDelta: { kind: 'stress', focus: 'serve', direction: 'more' },
      verdictChoice: 'accepted',
    })
    renderAt('exec-accepted')
    expect(await screen.findByTestId('complete-carry-forward')).toBeInTheDocument()
  })

  it('does NOT render the carry-forward line when the verdict was kept-original', async () => {
    await seed({
      execId: 'exec-kept',
      offeredDelta: { kind: 'stress', focus: 'serve', direction: 'more' },
      verdictChoice: 'kept_original',
    })
    renderAt('exec-kept')
    // Wait for the screen to settle (recap renders) before asserting absence.
    expect(await screen.findByText('Session recap')).toBeInTheDocument()
    expect(screen.queryByTestId('complete-carry-forward')).not.toBeInTheDocument()
  })

  it('does NOT render the carry-forward line when no delta was offered', async () => {
    await seed({ execId: 'exec-none' })
    renderAt('exec-none')
    expect(await screen.findByText('Session recap')).toBeInTheDocument()
    expect(screen.queryByTestId('complete-carry-forward')).not.toBeInTheDocument()
  })
})
