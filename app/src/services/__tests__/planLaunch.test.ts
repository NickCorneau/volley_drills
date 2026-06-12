import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../db'
import type { SessionReview, SetupContext } from '../../model'
import { stressRungForDrill } from '../../data/stressLadders'
import { buildDraft } from '../../domain/sessionBuilder'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
} from '../../test-utils/persistedRecords'
import { getCurrentDraft } from '../session'
import { repeatSession, startPlanSession } from '../planLaunch'

// Spy-through: real assembly still runs; the spy exposes the options
// each launch passed so the stress-steering tests can assert the
// caller boundary without depending on seeded shuffle outcomes.
vi.mock('../../domain/sessionBuilder', { spy: true })

/**
 * Home-coherence: the two one-tap Home launches. Pins that
 * startPlanSession builds + persists a draft steered to the plan's next
 * focus (reusing the prior physical conditions), that repeatSession
 * rebuilds from the prior context verbatim (focus included), that both
 * return true so the caller routes to Safety, and that both return
 * false without saving when there's no prior context.
 *
 * D154 stress steering: startPlanSession passes the derived ladder
 * positions to assembly (an accepted "more/less" verdict acts);
 * repeatSession stays verbatim (no positions, R10).
 *
 * U5/KTD6 clock calibration: startPlanSession also passes the derived
 * session-grain calibration so the budget scales toward honest wall
 * time; repeatSession stays verbatim (no calibration either).
 */

const PRIOR_CONTEXT: SetupContext = {
  playerMode: 'solo',
  timeProfile: 25,
  netAvailable: false,
  wallAvailable: true,
  sessionFocus: 'serve',
}

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
  vi.mocked(buildDraft).mockClear()
})

function verdictReview(
  direction: 'more' | 'less',
  choice: 'accepted' | 'kept_original',
  submittedAt: number,
): SessionReview {
  return {
    id: `review-${submittedAt}`,
    executionLogId: `log-${submittedAt}`,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt,
    status: 'submitted',
    offeredDelta: { kind: 'stress', focus: 'pass', direction },
    verdictChoice: choice,
  }
}

function lastBuildDraftOptions() {
  const calls = vi.mocked(buildDraft).mock.calls
  return calls[calls.length - 1]?.[1]
}

/** Seed one clean complete (plan + terminal log) running `ratio`x over. */
async function seedCleanComplete(i: number, plannedMinutes: number, ratio: number) {
  const startedAt = 1_000_000 + i * 86_400_000
  await db.sessionPlans.put(
    currentPersistedPlan({
      id: `plan-cal-${i}`,
      blocks: [{ durationMinutes: plannedMinutes }],
      createdAt: startedAt,
    }),
  )
  await db.executionLogs.put(
    currentPersistedExecutionLog({
      id: `exec-cal-${i}`,
      planId: `plan-cal-${i}`,
      status: 'completed',
      blockStatuses: [{ status: 'completed' }],
      startedAt,
      completedAt: startedAt + plannedMinutes * ratio * 60_000,
    }),
  )
}

describe('startPlanSession', () => {
  it('saves a draft steered to the plan next focus and returns true', async () => {
    const started = await startPlanSession({ priorContext: PRIOR_CONTEXT, nextFocus: 'pass' })

    expect(started).toBe(true)
    const draft = await getCurrentDraft()
    expect(draft).not.toBeNull()
    // The prior focus (serve) is overridden to the plan's next focus.
    expect(draft?.context.sessionFocus).toBe('pass')
    // Physical conditions are reused from the prior context.
    expect(draft?.context.playerMode).toBe('solo')
    expect(draft?.context.wallAvailable).toBe(true)
  })

  it('reuses the prior physical conditions while overriding focus', async () => {
    await startPlanSession({
      priorContext: { ...PRIOR_CONTEXT, sessionFocus: 'pass' },
      nextFocus: 'set',
    })
    const draft = await getCurrentDraft()
    expect(draft?.context.sessionFocus).toBe('set')
  })

  it('returns false and saves nothing when there is no prior context', async () => {
    const started = await startPlanSession({ priorContext: null, nextFocus: 'pass' })
    expect(started).toBe(false)
    expect(await getCurrentDraft()).toBeNull()
  })

  it('AE1: an accepted "more" verdict steers assembly one rung up on that focus', async () => {
    await db.sessionReviews.add(verdictReview('more', 'accepted', 1000))

    await startPlanSession({ priorContext: PRIOR_CONTEXT, nextFocus: 'pass' })

    // No persisted skill level → beginner start (rung 1); the accepted
    // `more` on pass moves it to 2. Other focuses stay at the start.
    expect(lastBuildDraftOptions()?.stressPositions).toEqual({ pass: 2, serve: 1, set: 1 })
  })

  it('AE2: a kept-original verdict leaves the steered positions at baseline', async () => {
    await db.sessionReviews.add(verdictReview('more', 'kept_original', 1000))

    await startPlanSession({ priorContext: PRIOR_CONTEXT, nextFocus: 'pass' })

    expect(lastBuildDraftOptions()?.stressPositions).toEqual({ pass: 1, serve: 1, set: 1 })
  })

  it('U5: passes the inert calibration to assembly when no clean completes exist', async () => {
    await startPlanSession({ priorContext: PRIOR_CONTEXT, nextFocus: 'pass' })

    expect(lastBuildDraftOptions()?.calibration).toEqual({
      overheadRatio: 1,
      sampleCount: 0,
      windowSize: 10,
    })
  })

  it('U5/AE5: with ≥3 clean completes running over, the derived ratio reaches assembly', async () => {
    await seedCleanComplete(0, 20, 1.2)
    await seedCleanComplete(1, 20, 1.2)
    await seedCleanComplete(2, 20, 1.2)

    await startPlanSession({ priorContext: PRIOR_CONTEXT, nextFocus: 'pass' })

    const calibration = lastBuildDraftOptions()?.calibration
    expect(calibration?.sampleCount).toBe(3)
    expect(calibration?.overheadRatio).toBeCloseTo(1.2, 5)
  })

  it('trust-loop U1: a steered launch stamps steeredFocus only on a realized on-target pick', async () => {
    // No persisted skill level → beginner band, pass position 1. The
    // saved draft is the real assembly result, so the stamp must track
    // the realized main_skill rung (KTD1) — assert the biconditional
    // rather than a fixed outcome to stay catalog-robust.
    await startPlanSession({ priorContext: PRIOR_CONTEXT, nextFocus: 'pass' })

    const draft = await getCurrentDraft()
    expect(draft).not.toBeNull()
    const main = draft!.blocks.find((b) => b.type === 'main_skill')
    expect(main).toBeDefined()
    if (stressRungForDrill('pass', main!.drillId) === 1) {
      expect(draft!.steeredFocus).toBe('pass')
    } else {
      expect(draft!.steeredFocus).toBeUndefined()
    }
  })
})

describe('repeatSession', () => {
  it('rebuilds from the prior context verbatim — focus included (2026-04-30 policy)', async () => {
    const repeated = await repeatSession(PRIOR_CONTEXT)

    expect(repeated).toBe(true)
    const draft = await getCurrentDraft()
    expect(draft).not.toBeNull()
    expect(draft?.context.sessionFocus).toBe('serve')
    expect(draft?.context.playerMode).toBe('solo')
    expect(draft?.context.wallAvailable).toBe(true)
  })

  it('returns false and saves nothing when there is no prior context', async () => {
    expect(await repeatSession(null)).toBe(false)
    expect(await getCurrentDraft()).toBeNull()
  })

  it('R10: Repeat never steers — no positions reach assembly even with accepted verdicts', async () => {
    await db.sessionReviews.add(verdictReview('more', 'accepted', 1000))

    await repeatSession(PRIOR_CONTEXT)

    expect(lastBuildDraftOptions()?.stressPositions).toBeUndefined()
  })

  it('U5: Repeat never re-steers — no calibration reaches assembly even with clean completes', async () => {
    await seedCleanComplete(0, 20, 1.2)
    await seedCleanComplete(1, 20, 1.2)
    await seedCleanComplete(2, 20, 1.2)

    await repeatSession(PRIOR_CONTEXT)

    expect(lastBuildDraftOptions()?.calibration).toBeUndefined()
  })

  it('trust-loop U1: a Repeat draft never carries steering provenance', async () => {
    await db.sessionReviews.add(verdictReview('more', 'accepted', 1000))

    await repeatSession(PRIOR_CONTEXT)

    const draft = await getCurrentDraft()
    expect(draft).not.toBeNull()
    expect(draft!.steeredFocus).toBeUndefined()
  })
})
