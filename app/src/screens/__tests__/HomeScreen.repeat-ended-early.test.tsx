import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * C-5 Unit 3 integration: ended-early branching on the LastComplete
 * primary card + `handleRepeatWhatYouDid` wires through to a subset
 * draft and /safety.
 *
 * The shape of the test: seed an ExecutionLog with
 * `status: 'ended_early'` where only 2 of 3 plan blocks completed.
 * Assert the card renders two buttons, assert each button's behavior:
 * - "Repeat full N-min plan" -> /setup?from=repeat (rebuilds full)
 * - "Repeat what you did (M min)" -> /safety with partial draft
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

async function seedEndedEarly() {
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: 'plan-ee',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-1',
        type: 'warmup',
        drillName: 'Warm',
        shortName: 'Warm',
        durationMinutes: 3,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-2',
        type: 'main_skill',
        drillName: 'Pass',
        shortName: 'Pass',
        durationMinutes: 11,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-3',
        type: 'main_skill',
        drillName: 'Serve',
        shortName: 'Serve',
        durationMinutes: 11,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: completedAt - 60_000,
    context: {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: true,
    },
  })
  await db.executionLogs.put({
    id: 'exec-ee',
    planId: 'plan-ee',
    status: 'ended_early',
    activeBlockIndex: 2,
    blockStatuses: [
      { blockId: 'b-1', status: 'completed' },
      { blockId: 'b-2', status: 'completed' },
      { blockId: 'b-3', status: 'skipped' },
    ],
    startedAt: completedAt - 20 * 60_000,
    completedAt,
    endedEarlyReason: 'time',
  })
  await db.sessionReviews.put({
    id: 'review-exec-ee',
    executionLogId: 'exec-ee',
    sessionRpe: 5,
    goodPasses: 6,
    totalAttempts: 10,
    submittedAt: completedAt,
    status: 'submitted',
    incompleteReason: 'time',
  })
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route
          path="/safety"
          element={<div data-testid="safety-route">safety</div>}
        />
        <Route
          path="/setup"
          element={<div data-testid="setup-route">setup</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomeScreen: Repeat on ended-early (C-5 Unit 3)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('renders TWO repeat buttons on an ended-early LastComplete', async () => {
    await seedEndedEarly()
    renderHome()

    // Primary: Repeat full plan (25 min: 3 + 11 + 11).
    expect(
      await screen.findByRole('button', {
        name: /repeat full 25-min plan/i,
      }),
    ).toBeInTheDocument()

    // Secondary: Repeat what you did (14 min: 3 + 11).
    expect(
      screen.getByRole('button', {
        name: /repeat what you did \(14 min\)/i,
      }),
    ).toBeInTheDocument()
  })

  it('Repeat what you did -> /safety with a partial draft (2 blocks, not 3)', async () => {
    const user = userEvent.setup()
    await seedEndedEarly()
    renderHome()

    await user.click(
      await screen.findByRole('button', {
        name: /repeat what you did \(14 min\)/i,
      }),
    )

    expect(await screen.findByTestId('safety-route')).toBeInTheDocument()

    const draft = await db.sessionDrafts.get('current')
    expect(draft).toBeDefined()
    expect(draft!.blocks.map((b) => b.id)).toEqual(['b-1', 'b-2'])
    expect(draft!.blocks.length).toBe(2)
    // D83 regression guard: the rebuild does NOT carry the plan's
    // safetyCheck onto the draft (there's no `safetyCheck` on a
    // SessionDraft by design). The Safety screen will re-ask.
    expect(draft).not.toHaveProperty('safetyCheck')
  })

  it('Repeat full plan on ended-early -> /setup?from=repeat (regression guard: NOT the subset)', async () => {
    const user = userEvent.setup()
    await seedEndedEarly()
    renderHome()

    await user.click(
      await screen.findByRole('button', {
        name: /repeat full 25-min plan/i,
      }),
    )
    // handleRepeat routes to /setup?from=repeat where the tester
    // re-confirms context + rebuilds the full plan. Critically, it
    // does NOT use the partial-block draft — the plan explicitly
    // prevents that regression (C-5 plan Unit 3 test scenarios).
    expect(await screen.findByTestId('setup-route')).toBeInTheDocument()
    // No partial draft written from this path.
    const draft = await db.sessionDrafts.get('current')
    expect(draft).toBeUndefined()
  })
})
