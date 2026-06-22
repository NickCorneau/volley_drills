import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { ReviewScreen } from '../ReviewScreen'
import { getStressRung } from '../../data/stressLadders'
import type { DifficultyTag } from '../../model'

// Reviewed-session main drills (drillName feeds inferSessionFocus; drillId
// feeds the trained-rung resolution the progression read keys off).
const D03 = { drillName: 'Continuous Passing', drillId: 'd03' } // pass rung 2
const D07 = { drillName: 'Pass & Look', drillId: 'd07' } // pass rung 3

/**
 * M002.1 (R5): the accept/keep verdict at review end.
 *
 * Integration test over real fake-indexeddb + real services: seeds prior
 * eligible pass sessions trending too_hard so the controller computes a
 * real "less" offer, then asserts the verdict block renders with
 * keep-original pre-selected and that the chosen verdict persists onto
 * the submitted review row.
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

function passPlan(
  id: string,
  createdAt: number,
  main: { drillName: string; drillId: string } = D03,
  options: { omitContext?: boolean } = {},
) {
  return {
    id,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1 as const,
    blocks: [
      {
        id: `${id}-b1`,
        type: 'main_skill' as const,
        drillName: main.drillName,
        drillId: main.drillId,
        shortName: 'Pass',
        durationMinutes: 12,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    // Persisted context feeds the trust-loop U3 consequence caption
    // (the composer filters exemplar candidates by these conditions).
    // Omitting it models a legacy / no-context plan, where the
    // accept-consequence fails quiet and the readiness line becomes the
    // verdict card's forward fallback (T5 3-line cap, plan 2026-06-22-004).
    ...(options.omitContext
      ? {}
      : {
          context: {
            playerMode: 'solo' as const,
            timeProfile: 25 as const,
            netAvailable: false,
            wallAvailable: false,
            sessionFocus: 'pass' as const,
            playerLevel: 'intermediate' as const,
          },
        }),
    createdAt,
  }
}

async function seedPriorPassSession(
  execId: string,
  daysAgo: number,
  tag: DifficultyTag,
  rpe = 7,
) {
  const now = Date.now()
  const t = now - daysAgo * 86400000
  await db.sessionPlans.put(passPlan(`plan-${execId}`, t))
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: t,
    completedAt: t,
  })
  await db.sessionReviews.put({
    id: `review-${execId}`,
    executionLogId: execId,
    sessionRpe: rpe,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: t,
    status: 'submitted',
    eligibleForAdaptation: true,
    perDrillCaptures: [0, 1].map((k) => ({
      drillId: 'd01',
      variantId: 'd01-solo',
      blockIndex: k,
      difficulty: tag,
      capturedAt: t,
    })),
  })
}

/** A current, completed, not-yet-reviewed session. */
async function seedCurrentSession(
  execId: string,
  main: { drillName: string; drillId: string } = D03,
  options: { omitContext?: boolean } = {},
) {
  const now = Date.now()
  await db.sessionPlans.put(passPlan(`plan-${execId}`, now - 60_000, main, options))
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: now - 60_000,
    completedAt: now - 30_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/complete" element={<div>complete</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen verdict (M002.1 R5)', () => {
  beforeEach(async () => {
    await clearDb()
    // Trust-loop U2 re-seed: two too-hard pass sessions with no skill
    // level is exactly the AE7 ladder-floor fixture (beginner pass
    // starts at rung 1, so a 'less' offer is gated to keep). Persist an
    // intermediate-band skill level so pass starts at rung 2 and the
    // 'less' offer stays movable.
    await db.storageMeta.put({
      key: 'onboarding.skillLevel',
      value: 'rally_builders',
      updatedAt: Date.now(),
    })
  })

  it('offers the verdict with keep-original pre-selected, and persists "accepted" on submit', async () => {
    await seedPriorPassSession('e1', 4, 'too_hard')
    await seedPriorPassSession('e2', 2, 'too_hard')
    await seedCurrentSession('cur')

    const user = userEvent.setup()
    renderAt('cur')

    // Verdict block renders with the "less" line (sustained too_hard).
    expect(await screen.findByText('Next time')).toBeInTheDocument()
    expect(screen.getByText('Ease the stress on passing next time.')).toBeInTheDocument()
    const keep = screen.getByRole('radio', { name: 'Keep the same' })
    const tryIt = screen.getByRole('radio', { name: 'Try it' })
    // Keep-original is the pre-selected default (safe, no silent reshuffle).
    expect(keep).toHaveAttribute('aria-checked', 'true')
    expect(tryIt).toHaveAttribute('aria-checked', 'false')

    // Trust-loop U3: the accept option carries its consequence caption
    // (intermediate pass position 2, 'less' → prospective rung 1 = d01),
    // programmatically associated via aria-describedby.
    const caption = screen.getByText(
      'Passing sessions lean toward drills like Pass & Slap Hands.',
    )
    expect(caption).toHaveAttribute('id', 'verdict-accept-consequence')
    expect(tryIt).toHaveAttribute('aria-describedby', 'verdict-accept-consequence')
    expect(keep).not.toHaveAttribute('aria-describedby')

    // M002.2 progression read: on a 'less' offer the reflective line (the
    // trained rung's explorationCriterion, pass rung 2 here) renders, but
    // the step-up readiness line is suppressed.
    expect(screen.getByText(getStressRung('pass', 2)!.explorationCriterion)).toBeInTheDocument()
    expect(
      screen.queryByText(getStressRung('pass', 2)!.graduationFeel),
    ).not.toBeInTheDocument()

    // Accept the offer, rate effort, submit.
    await user.click(tryIt)
    await user.click(screen.getByRole('radio', { name: /Right/i }))
    await user.click(screen.getByRole('button', { name: 'Done' }))

    await waitFor(async () => {
      const row = await db.sessionReviews.get('review-cur')
      expect(row?.verdictChoice).toBe('accepted')
      expect(row?.offeredDelta).toEqual({ kind: 'stress', focus: 'pass', direction: 'less' })
    })
  })

  it('on a "more" offer with a concrete next-drill consequence, caps the card: reflection + accept-consequence, readiness suppressed (T5)', async () => {
    // Two easy prior pass sessions (RPE 3) -> sustained too_easy -> "more".
    await seedPriorPassSession('e1', 4, 'too_easy', 3)
    await seedPriorPassSession('e2', 2, 'too_easy', 3)
    await seedCurrentSession('cur', D03) // trained pass rung 2, on-target with offer position 2

    renderAt('cur')

    expect(await screen.findByText('Next time')).toBeInTheDocument()
    // Reflection (trained rung 2 explorationCriterion) stays above the choice.
    expect(screen.getByText(getStressRung('pass', 2)!.explorationCriterion)).toBeInTheDocument()
    // The accept-consequence (the concrete next-drill exemplar) renders and
    // remains the single described consequence on Try-it.
    const tryIt = screen.getByRole('radio', { name: 'Try it' })
    expect(tryIt).toHaveAttribute('aria-describedby', 'verdict-accept-consequence')
    expect(screen.getByText(/lean toward drills like/)).toBeInTheDocument()
    // T5 cap (revisits D161): the readiness line (graduationFeel) is
    // suppressed whenever the accept-consequence renders, holding the card
    // at 3 prose lines (offer -> reflection -> accept-consequence).
    expect(screen.queryByText(getStressRung('pass', 2)!.graduationFeel)).not.toBeInTheDocument()
  })

  it('keys the reflection off the TRAINED rung, not the offer position (off-target landing)', async () => {
    await seedPriorPassSession('e1', 4, 'too_easy', 3)
    await seedPriorPassSession('e2', 2, 'too_easy', 3)
    // Trained Pass & Look (pass rung 3) while the derived offer position is
    // 2 (intermediate band, no accepted verdicts) -> trained rung diverges
    // from offer position. This is the test that pins the P1 trust fix.
    await seedCurrentSession('cur', D07)

    renderAt('cur')

    expect(await screen.findByText('Next time')).toBeInTheDocument()
    // Reflection follows the rung actually trained (3), never the offer
    // position (2). (The readiness -> offer-position keying is proven at the
    // domain tier in progressionRead.test.ts; the screen-level readiness
    // line is suppressed here by the T5 cap because the accept-consequence
    // renders.)
    expect(screen.getByText(getStressRung('pass', 3)!.explorationCriterion)).toBeInTheDocument()
    expect(
      screen.queryByText(getStressRung('pass', 2)!.explorationCriterion),
    ).not.toBeInTheDocument()
  })

  it('on a "more" offer with no accept-consequence, the readiness line is the forward fallback (T5)', async () => {
    await seedPriorPassSession('e1', 4, 'too_easy', 3)
    await seedPriorPassSession('e2', 2, 'too_easy', 3)
    // No persisted context -> the accept-consequence fails quiet, so the
    // readiness line survives as the card's forward step-up read. The card
    // is still 3 prose lines (offer -> reflection -> readiness).
    await seedCurrentSession('cur', D03, { omitContext: true })

    renderAt('cur')

    expect(await screen.findByText('Next time')).toBeInTheDocument()
    // Reflection (trained rung 2) and readiness (offer position 2) both render.
    expect(screen.getByText(getStressRung('pass', 2)!.explorationCriterion)).toBeInTheDocument()
    expect(screen.getByText(getStressRung('pass', 2)!.graduationFeel)).toBeInTheDocument()
    // No accept-consequence: Try-it carries no described consequence.
    const tryIt = screen.getByRole('radio', { name: 'Try it' })
    expect(tryIt).not.toHaveAttribute('aria-describedby')
    expect(screen.queryByText(/lean toward drills like/)).not.toBeInTheDocument()
  })

  it('shows no verdict block when there is no prior trend (keep offer)', async () => {
    await seedCurrentSession('cur')
    renderAt('cur')
    // Wait for the review form to settle, then assert the block is absent.
    expect(await screen.findByText(/How hard was your session/i)).toBeInTheDocument()
    expect(screen.queryByText('Next time')).not.toBeInTheDocument()
  })
})
