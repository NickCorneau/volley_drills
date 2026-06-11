import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'

/**
 * U3 (2026-06-11 session-truth plan): the "why did you end early?"
 * reason gate fires only for genuine user cut-shorts.
 *
 * - Deliberate wraps are `completed`, so the gate self-resolves: no
 *   chips, header reads Complete, submit unlocks on RPE alone.
 * - System sentinels (`missing_plan`, `resume_out_of_bounds`) join
 *   `discarded_resume` as exemptions - the system ended those records,
 *   so the question has no honest answer.
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
  status: 'completed' | 'ended_early'
  endedEarlyReason?: string
  blockStatuses?: { blockId: string; status: 'completed' | 'skipped' | 'in_progress' }[]
}) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${opts.execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'warmup',
        drillName: 'Warm up',
        shortName: 'Warm up',
        durationMinutes: 3,
        coachingCue: 'Wake up.',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-2',
        type: 'main_skill',
        drillName: 'Self-Toss Pass',
        shortName: 'Pass',
        durationMinutes: 8,
        coachingCue: 'Quiet platform.',
        courtsideInstructions: '',
        required: false,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: opts.execId,
    planId: `plan-${opts.execId}`,
    status: opts.status,
    activeBlockIndex: 1,
    blockStatuses: opts.blockStatuses ?? [
      { blockId: 'b-1', status: 'completed' },
      { blockId: 'b-2', status: 'skipped' },
    ],
    startedAt: now - 20 * 60_000,
    completedAt: now - 5 * 60_000,
    endedEarlyReason: opts.endedEarlyReason,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/" element={<div data-testid="home-route">home</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen end-intent gating (U3)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  // Covers AE1. A deliberate wrap presents as finished: no reason gate,
  // Complete header, submit unlocked by RPE alone.
  it('shows no reason gate for a wrapped session and unlocks submit on RPE', async () => {
    const user = userEvent.setup()
    await seed({ execId: 'exec-wrap', status: 'completed' })
    renderAt('exec-wrap')

    expect(await screen.findByRole('heading', { name: /quick review/i })).toBeInTheDocument()
    expect(screen.queryByText(/why did you end early\?/i)).toBeNull()
    // Header meta line keys on status: wraps read Complete, never Ended early.
    expect(screen.getByText(/Solo \+ Wall/)).toHaveTextContent(/complete/i)
    expect(screen.queryByText(/ended early/i)).toBeNull()

    const submit = screen.getByRole('button', { name: /^done$/i })
    expect(submit).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: /^right$/i }))

    expect(submit).not.toBeDisabled()
  })

  // Covers AE2. A genuine cut-short keeps the gate: chips required,
  // submit blocked until a reason is picked (existing behavior pinned).
  it('keeps the reason gate for a user cut-short', async () => {
    const user = userEvent.setup()
    await seed({ execId: 'exec-cut', status: 'ended_early', endedEarlyReason: 'user_quit' })
    renderAt('exec-cut')

    expect(await screen.findByRole('heading', { name: /quick review/i })).toBeInTheDocument()
    expect(screen.getAllByText(/why did you end early\?/i).length).toBeGreaterThan(0)

    const submit = screen.getByRole('button', { name: /^done$/i })
    await user.click(screen.getByRole('radio', { name: /^right$/i }))
    expect(submit).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: /^fatigue$/i }))
    expect(submit).not.toBeDisabled()
  })

  // Changed behavior, pinned: system sentinels are exempt from the gate.
  it.each(['missing_plan', 'resume_out_of_bounds'])(
    'shows no reason gate for the %s system sentinel',
    async (reason) => {
      const user = userEvent.setup()
      await seed({ execId: `exec-${reason}`, status: 'ended_early', endedEarlyReason: reason })
      renderAt(`exec-${reason}`)

      expect(await screen.findByRole('heading', { name: /quick review/i })).toBeInTheDocument()
      expect(screen.queryByText(/why did you end early\?/i)).toBeNull()

      const submit = screen.getByRole('button', { name: /^done$/i })
      await user.click(screen.getByRole('radio', { name: /^right$/i }))
      expect(submit).not.toBeDisabled()
    },
  )

  // Regression: discarded-resume stubs still bounce to Home outright
  // (the gate exemption never even renders the form for them).
  it('still bounces discarded_resume records to Home', async () => {
    await seed({
      execId: 'exec-discarded',
      status: 'ended_early',
      endedEarlyReason: 'discarded_resume',
    })
    renderAt('exec-discarded')

    expect(await screen.findByTestId('home-route')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /quick review/i })).not.toBeInTheDocument()
  })
})
