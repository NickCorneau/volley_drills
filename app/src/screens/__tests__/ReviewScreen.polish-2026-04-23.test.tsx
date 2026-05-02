import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { SessionPlanBlock } from '../../db/types'
import { DRILLS } from '../../data/drills'
import { ReviewScreen } from '../ReviewScreen'

/**
 * 2026-04-23 walkthrough closeout polish plan Item 2 — merged Review
 * proposal remainder.
 *
 * Sources:
 *   docs/archive/plans/2026-04-23-walkthrough-closeout-polish.md
 *   docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md
 *   docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
 *
 * Scope of this file: the five sub-edits that landed on ReviewScreen
 * on 2026-04-23, plus the 2-hour Review-window copy removal from
 * Item 3. Regression surface for the cross-file assertions the
 * pre-existing `ReviewScreen.*.test.tsx` files do not cover directly:
 *
 *   (a) RPE selector renders 3 chips (Easy / Right / Hard) and no
 *       0-10 numeric labels.
 *   (b) The Quick-tags card is not rendered.
 *   (c) A hairline divider separates the RPE card from the
 *       Good-passes card (visible on count drills).
 *   (d) The primary action reads "Done" and Finish later renders as
 *       a lower-emphasis link below it.
 *   (e) Good-passes card is hidden on non-count drills (the main
 *       skill's `successMetric.type` is non-count), not just
 *       pre-selected to `notCaptured`.
 *   (f) No "2 hr" / "stops counting" countdown subtitle anywhere on
 *       the Review footer.
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

function makeSkillBlock(overrides?: Partial<SessionPlanBlock>): SessionPlanBlock {
  return {
    id: 'block-main',
    type: 'main_skill',
    drillName: 'Passing',
    shortName: 'Pass',
    durationMinutes: 10,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}

async function seedCompletedWithBlock(execId: string, block: SessionPlanBlock) {
  const now = Date.now()
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [block],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: block.id, status: 'completed' }],
    startedAt: now - 15 * 60_000,
    completedAt: now - 5 * 60_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/review?id=${execId}`]}>
      <Routes>
        <Route path="/review" element={<ReviewScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReviewScreen 2026-04-23 polish (merged proposal)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('(a) RPE selector renders exactly three chips: Easy / Right / Hard', async () => {
    await seedCompletedWithBlock('exec-rpe', makeSkillBlock())
    renderAt('exec-rpe')

    await screen.findByRole('heading', { name: /quick review/i })
    const chips = screen.getAllByRole('radio')
    expect(chips).toHaveLength(3)
    expect(screen.getByRole('radio', { name: /^easy$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^right$/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /^hard$/i })).toBeInTheDocument()
  })

  it('(a) no numeric 0-10 chip label remains on RPE (regression guard)', async () => {
    await seedCompletedWithBlock('exec-rpe-no-nums', makeSkillBlock())
    renderAt('exec-rpe-no-nums')

    await screen.findByRole('heading', { name: /quick review/i })
    for (const n of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      expect(screen.queryByRole('radio', { name: new RegExp(`^${n}$`) })).not.toBeInTheDocument()
    }
  })

  it('(b) Quick tags card is not rendered', async () => {
    await seedCompletedWithBlock('exec-no-quicktags', makeSkillBlock())
    renderAt('exec-no-quicktags')

    await screen.findByRole('heading', { name: /quick review/i })
    // The Quick-tags card was the only surface rendering these effort
    // tags alongside the RPE scale. With the card deleted, none of
    // these labels should appear on Review anymore.
    expect(screen.queryByRole('heading', { name: /^quick tags$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^too easy$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^about right$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^too hard$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^need partner$/i })).not.toBeInTheDocument()
  })

  it('(d) footer exposes Done as primary and Finish later as a lower-emphasis link', async () => {
    await seedCompletedWithBlock('exec-buttons', makeSkillBlock())
    renderAt('exec-buttons')

    const done = await screen.findByRole('button', { name: /^done$/i })
    const finishLater = screen.getByRole('button', { name: /finish later/i })
    expect(done).toBeInTheDocument()
    expect(finishLater).toBeInTheDocument()
    // The old label is gone.
    expect(screen.queryByRole('button', { name: /^submit review$/i })).not.toBeInTheDocument()
    expect(done.className).toMatch(/bg-accent/)
    expect(finishLater.className).not.toMatch(/bg-accent/)
    expect(finishLater.className).toMatch(/underline/)
    expect(finishLater.className).toMatch(/text-text-secondary/)
  })

  it('(f) no 2-hour / "stops counting" countdown subtitle is rendered on the footer', async () => {
    await seedCompletedWithBlock('exec-no-countdown', makeSkillBlock())
    renderAt('exec-no-countdown')

    await screen.findByRole('heading', { name: /quick review/i })
    const body = document.body.textContent ?? ''
    expect(body).not.toMatch(/stops counting/i)
    expect(body).not.toMatch(/in about \d+ hr/i)
    expect(body).not.toMatch(/2 hr/i)
    expect(body).not.toMatch(/\bthis session.*won.?t affect planning/i)
  })

  describe('(e) Good-passes card visibility gated on main-skill successMetric.type', () => {
    it('hides the Good-passes card when the main-skill drill is non-count', async () => {
      // Pick the first catalog drill whose first variant uses a
      // non-count success metric. `domain/capture/metricStrategies`
      // marks `pass-rate-good` and `reps-successful` as
      // `showsReviewCounts: true`; anything else (streak /
      // points-to-target / pass-grade-avg / composite / completion)
      // should hide the Good-passes card entirely.
      const nonCountDrill = DRILLS.find(
        (d) =>
          d.variants[0]?.successMetric.type !== 'pass-rate-good' &&
          d.variants[0]?.successMetric.type !== 'reps-successful',
      )
      expect(
        nonCountDrill,
        'test fixture precondition: DRILLS should contain at least one non-count drill',
      ).toBeDefined()
      if (!nonCountDrill) return

      await seedCompletedWithBlock(
        'exec-noncount',
        makeSkillBlock({ drillName: nonCountDrill.name }),
      )
      renderAt('exec-noncount')

      await screen.findByRole('heading', { name: /quick review/i })
      expect(screen.queryByRole('heading', { name: /^good passes$/i })).not.toBeInTheDocument()
      // The pre-close 2026-04-21 default-to-notCaptured chip also
      // disappears with the card.
      expect(
        screen.queryByRole('button', { name: /couldn.t capture reps/i }),
      ).not.toBeInTheDocument()
    })

    it('shows the Good-passes card when the main-skill drill is count-based', async () => {
      const countDrill = DRILLS.find(
        (d) =>
          d.variants[0]?.successMetric.type === 'pass-rate-good' ||
          d.variants[0]?.successMetric.type === 'reps-successful',
      )
      expect(
        countDrill,
        'test fixture precondition: DRILLS should contain at least one count drill',
      ).toBeDefined()
      if (!countDrill) return

      await seedCompletedWithBlock('exec-count', makeSkillBlock({ drillName: countDrill.name }))
      renderAt('exec-count')

      expect(await screen.findByRole('heading', { name: /^good passes$/i })).toBeInTheDocument()
    })

    it('shows the Good-passes card when the main-skill drill name is synthetic / unknown (defensive default)', async () => {
      // Tests seeded with arbitrary drill names (e.g. "Passing" in the
      // rest of the ReviewScreen.*.test.tsx suite) must not silently
      // lose their capture surface. `metricType === null` keeps the
      // card visible so the pre-existing tests still exercise the
      // count path.
      await seedCompletedWithBlock(
        'exec-synthetic',
        makeSkillBlock({ drillName: '__does-not-exist-in-catalog__' }),
      )
      renderAt('exec-synthetic')

      expect(await screen.findByRole('heading', { name: /^good passes$/i })).toBeInTheDocument()
    })

    it('uses stable drillId before drillName when deciding count capture visibility', async () => {
      await seedCompletedWithBlock(
        'exec-id-first-noncount',
        makeSkillBlock({
          drillId: 'd01',
          variantId: 'd01-solo',
          drillName: '__stale_or_renamed_drill__',
        }),
      )
      renderAt('exec-id-first-noncount')

      await screen.findByRole('heading', { name: /quick review/i })
      expect(screen.queryByRole('heading', { name: /^good passes$/i })).not.toBeInTheDocument()
    })

    it('falls back to drillName for legacy plans without stable drillId', async () => {
      await seedCompletedWithBlock(
        'exec-legacy-name-fallback',
        makeSkillBlock({ drillName: 'Pass & Slap Hands' }),
      )
      renderAt('exec-legacy-name-fallback')

      await screen.findByRole('heading', { name: /quick review/i })
      expect(screen.queryByRole('heading', { name: /^good passes$/i })).not.toBeInTheDocument()
    })
  })
})
