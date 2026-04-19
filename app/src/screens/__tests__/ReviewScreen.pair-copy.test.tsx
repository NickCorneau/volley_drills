import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
  ])
}

async function seed(playerCount: 1 | 2, execId: string, planId: string) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: planId,
    presetId: 'pair_net',
    presetName: 'Pair + Net',
    playerCount,
    blocks: [],
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: now - 10 * 60_000,
    completedAt: now - 5 * 60_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <ReviewScreen />
    </MemoryRouter>,
  )
}

describe('ReviewScreen RPE prompt (V0B-32 / D120)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('solo mode reads "How hard was your session?" with no per-player helper', async () => {
    await seed(1, 'exec-solo', 'plan-solo')
    renderAt('exec-solo')

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /how hard was your session\?/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/one rating per device/i),
    ).not.toBeInTheDocument()
  })

  it('pair mode reads "How hard was this session for you?" plus helper', async () => {
    await seed(2, 'exec-pair', 'plan-pair')
    renderAt('exec-pair')

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /how hard was this session for you\?/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/one rating per device/i)).toBeInTheDocument()
  })

  it('exposes a Finish later escape-hatch link alongside Submit review', async () => {
    await seed(1, 'exec-link', 'plan-link')
    renderAt('exec-link')

    expect(
      await screen.findByRole('button', { name: /submit review/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /finish later/i }),
    ).toBeInTheDocument()
  })
})
