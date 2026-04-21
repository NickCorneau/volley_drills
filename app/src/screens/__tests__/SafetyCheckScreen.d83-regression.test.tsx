import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { SafetyCheckScreen } from '../SafetyCheckScreen'

/**
 * C-5 Unit 4: D83 regression guard.
 *
 * D83 (docs/decisions.md): pain flag + training recency are per-session.
 * They MUST NOT be pre-filled from any prior SessionPlan, Draft, or
 * Review record - the tester has to answer them every time.
 *
 * This test seeds the strongest possible "tempting-to-cache" signal -
 * a prior `SessionPlan.safetyCheck` with `painFlag: true` and
 * `trainingRecency: '0 days'` - then mounts SafetyCheckScreen on the
 * repeat path (via a draft built from that plan's context). Both form
 * fields must render in their default/unselected state.
 *
 * If a future change introduces a "remember my last answer" cache, this
 * test breaks loudly.
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

beforeEach(async () => {
  await clearDb()
})

describe('SafetyCheckScreen D83 regression (C-5 Unit 4)', () => {
  it('pain flag + recency NEVER pre-fill from a prior plan on the repeat path', async () => {
    // Seed a prior plan that DID answer both safety fields. In the
    // v0a/v0b world a plan's `safetyCheck` captures the answers from
    // the day the plan was built - the temptation for a future
    // refactor would be to reuse them on Repeat "for convenience".
    const priorTimestamp = Date.now() - 2 * 24 * 60 * 60 * 1000
    await db.sessionPlans.put({
      id: 'plan-prior',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [
        {
          id: 'b-1',
          type: 'main_skill',
          drillName: 'Pass',
          shortName: 'Pass',
          durationMinutes: 15,
          coachingCue: '',
          courtsideInstructions: '',
          required: true,
        },
      ],
      safetyCheck: {
        painFlag: true,
        trainingRecency: '0 days',
        heatCta: true,
        painOverridden: true,
      },
      context: {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      },
      createdAt: priorTimestamp - 60_000,
    })

    // Repeat path wrote a fresh draft from the prior plan's context.
    // SafetyCheckScreen reads `getCurrentDraft()`, so we seed that
    // directly rather than going through HomeScreen's handler.
    await db.sessionDrafts.put({
      id: 'current',
      context: {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      },
      archetypeId: 'solo_wall',
      archetypeName: 'Solo + Wall',
      blocks: [
        {
          id: 'b-1',
          type: 'main_skill',
          drillId: '',
          variantId: '',
          drillName: 'Pass',
          shortName: 'Pass',
          durationMinutes: 15,
          coachingCue: '',
          courtsideInstructions: '',
          required: true,
        },
      ],
      updatedAt: Date.now(),
    })

    render(
      <MemoryRouter initialEntries={['/safety']}>
        <Routes>
          <Route path="/safety" element={<SafetyCheckScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    // Pain + recency default state is unselected. SafetyCheckScreen
    // reveals secondary UI only after at least pain is answered:
    //   - painFlag === true  -> renders `<PainOverrideCard>`
    //   - painFlag === false -> renders Continue button (when recency set)
    //
    // When both fields default to null, neither renders. Asserting
    // those absences is a stable proxy for "form is in default state"
    // without coupling the test to className or aria-pressed details
    // that the screen doesn't currently emit.
    await screen.findByText(/any pain.*sharp/i)
    expect(
      screen.queryByRole('button', { name: /^continue$/i }),
    ).not.toBeInTheDocument()
    // PainOverrideCard contains "Lighter session" / "I know my body" copy.
    // Its absence proves painFlag defaulted to null.
    expect(
      screen.queryByText(/know my body/i),
    ).not.toBeInTheDocument()
    // The prior plan had `trainingRecency: '0 days'` and a true
    // `painFlag` - any regression that leaks those into state would
    // trigger PainOverrideCard or the Continue button above.
  })

  it('safety answers also NEVER pre-fill from a prior SessionReview or ExecutionLog', async () => {
    // A second mutation: seed a review + execution log that could in
    // principle cache pain/recency. Prove the screen still defaults.
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-2',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: true,
        trainingRecency: 'First time',
        heatCta: false,
        painOverridden: false,
      },
      context: {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      },
      createdAt: now - 60_000,
    })
    await db.executionLogs.put({
      id: 'exec-2',
      planId: 'plan-2',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 30 * 60_000,
      completedAt: now - 10 * 60_000,
    })
    await db.sessionReviews.put({
      id: 'review-exec-2',
      executionLogId: 'exec-2',
      sessionRpe: 8,
      goodPasses: 5,
      totalAttempts: 10,
      submittedAt: now - 10 * 60_000,
      status: 'submitted',
    })
    await db.sessionDrafts.put({
      id: 'current',
      context: {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      },
      archetypeId: 'solo_wall',
      archetypeName: 'Solo + Wall',
      blocks: [
        {
          id: 'b-1',
          type: 'main_skill',
          drillId: '',
          variantId: '',
          drillName: 'Pass',
          shortName: 'Pass',
          durationMinutes: 15,
          coachingCue: '',
          courtsideInstructions: '',
          required: true,
        },
      ],
      updatedAt: now,
    })

    render(
      <MemoryRouter initialEntries={['/safety']}>
        <Routes>
          <Route path="/safety" element={<SafetyCheckScreen />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByText(/any pain.*sharp/i)
    // Same default-state proxy as the first test: the reveal-on-answer
    // UI (PainOverrideCard + Continue) is absent while both fields
    // default to null.
    expect(
      screen.queryByRole('button', { name: /^continue$/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/know my body/i)).not.toBeInTheDocument()
  })
})
