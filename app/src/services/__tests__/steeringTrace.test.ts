import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionDraft, SessionPlan, SessionReview } from '../../model'
import type { ScopedFocus } from '../../domain/eligibleSessions'
import { setStorageMeta } from '../storageMeta'
import {
  ADAPT_DISCLOSURE_DISMISSED_KEY,
  dismissAdaptDisclosure,
  loadSteeringTrace,
} from '../steeringTrace'

/**
 * Trust-loop U4 — the Safety steering-trace read seam over
 * fake-indexeddb. Pins the Dexie joins (terminal-trained steered plans,
 * ever-steered, band resolution, dismissal flag); the KTD5 decision
 * table itself is pinned in the domain suite
 * (`domain/adaptation/__tests__/steeringTrace.test.ts`).
 */

async function clearDb() {
  await Promise.all([
    db.sessionReviews.clear(),
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.storageMeta.clear(),
  ])
}

beforeEach(async () => {
  await clearDb()
})

function acceptedReview(
  focus: ScopedFocus,
  direction: 'more' | 'less',
  submittedAt: number,
): SessionReview {
  return {
    id: `review-${focus}-${submittedAt}`,
    executionLogId: `log-${focus}-${submittedAt}`,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt,
    status: 'submitted',
    offeredDelta: { kind: 'stress', focus, direction },
    verdictChoice: 'accepted',
  }
}

function plan(
  id: string,
  createdAt: number,
  steeredFocus?: SessionPlan['steeredFocus'],
): SessionPlan {
  return {
    id,
    presetId: 'preset-1',
    presetName: 'Test preset',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt,
    ...(steeredFocus !== undefined ? { steeredFocus } : {}),
  }
}

function terminalLog(planId: string): ExecutionLog {
  return {
    id: `exec-${planId}`,
    planId,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1,
  }
}

function steeredDraft(focus: ScopedFocus, updatedAt: number): SessionDraft {
  return {
    id: 'current',
    context: {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: true,
      sessionFocus: focus,
    },
    archetypeId: 'solo_wall',
    archetypeName: 'Solo wall',
    steeredFocus: focus,
    blocks: [],
    updatedAt,
  }
}

describe('loadSteeringTrace', () => {
  it('full arc: armed accept renders the line; training a steered session consumes it (AE2)', async () => {
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))

    const first = await loadSteeringTrace(steeredDraft('set', 2000))
    expect(first.line).toBe('A bit more stress on setting today.')

    // Train a steered-on-set session assembled after the accept.
    await db.sessionPlans.add(plan('plan-1', 2000, 'set'))
    await db.executionLogs.add(terminalLog('plan-1'))

    const second = await loadSteeringTrace(steeredDraft('set', 3000))
    expect(second.line).toBeNull()
  })

  it('a steered plan that was never trained does not consume (built-then-discarded)', async () => {
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await db.sessionPlans.add(plan('plan-1', 2000, 'set'))
    // No execution log: the plan exists but was never trained.

    const model = await loadSteeringTrace(steeredDraft('set', 3000))
    expect(model.line).toBe('A bit more stress on setting today.')
  })

  it('a discarded-resume terminal state does not consume', async () => {
    await db.sessionReviews.add(acceptedReview('set', 'more', 1000))
    await db.sessionPlans.add(plan('plan-1', 2000, 'set'))
    await db.executionLogs.add({
      ...terminalLog('plan-1'),
      status: 'ended_early',
      endedEarlyReason: 'discarded_resume',
    })

    const model = await loadSteeringTrace(steeredDraft('set', 3000))
    expect(model.line).toBe('A bit more stress on setting today.')
  })

  it('deferred review: an accept submitted after a plan was created is not consumed by it', async () => {
    // Plan assembled (and trained) BEFORE the accept was submitted.
    await db.sessionPlans.add(plan('plan-1', 1000, 'set'))
    await db.executionLogs.add(terminalLog('plan-1'))
    await db.sessionReviews.add(acceptedReview('set', 'more', 5000))

    const model = await loadSteeringTrace(steeredDraft('set', 6000))
    expect(model.line).toBe('A bit more stress on setting today.')
  })

  it('resolves the skill band for the movement fold (clamped accept under the real band)', async () => {
    // competitive_pair maps to the advanced band: set starts at rung 4.
    // An accepted 'less' moves 4 → 3 there, while the beginner default
    // would also move (1 is the floor... use the opposite: an accepted
    // 'less' under beginner is clamped at rung 1 and must not arm).
    await db.sessionReviews.add(acceptedReview('set', 'less', 1000))

    // No persisted level → beginner → clamped → not armed.
    expect((await loadSteeringTrace(steeredDraft('set', 2000))).line).toBeNull()

    // rally_builders → intermediate band → set starts at rung 2 → the
    // same accept moved 2 → 1 and arms the easing line.
    await setStorageMeta('onboarding.skillLevel', 'rally_builders')
    expect((await loadSteeringTrace(steeredDraft('set', 2000))).line).toBe(
      'Easing the stress on setting today.',
    )
  })

  it('gloss reachability: any persisted steered plan keeps the gloss on for unsteered drafts (R10)', async () => {
    const unsteered: SessionDraft = { ...steeredDraft('set', 2000), steeredFocus: undefined }

    expect((await loadSteeringTrace(unsteered)).showGloss).toBe(false)

    // A steered plan exists (terminal or not — reachability is broader
    // than consumption).
    await db.sessionPlans.add(plan('plan-1', 1000, 'set'))
    expect((await loadSteeringTrace(unsteered)).showGloss).toBe(true)
  })

  it('disclosure honors the persisted dismissal flag (R9)', async () => {
    const draft = steeredDraft('set', 2000)
    expect((await loadSteeringTrace(draft)).showDisclosure).toBe(true)

    await dismissAdaptDisclosure()
    expect((await loadSteeringTrace(draft)).showDisclosure).toBe(false)

    const row = await db.storageMeta.get(ADAPT_DISCLOSURE_DISMISSED_KEY)
    expect(row?.value).toBe(true)
  })
})
