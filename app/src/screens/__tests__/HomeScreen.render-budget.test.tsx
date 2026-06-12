import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { HomeScreen } from '../HomeScreen'

/**
 * D156 Home covenant render budget (R9 in the origin requirements doc,
 * docs/brainstorms/2026-06-11-home-covenant-requirements.md).
 *
 * Pins the steady-state Home census — the most common returning state:
 * `last_complete` primary, no resume/review_pending/draft, periphery
 * dark — plus the skipped-tail card variant (the densest the card
 * gets; the 2026-06-11 card-interior creep incident's surface).
 *
 * If a change exceeds a budget below, the covenant's amendment rule
 * applies: evict an element, or amend the budget via a decision row
 * citing D156. Do not bump a constant here without one.
 *
 * Counting rules (jsdom does no layout, so everything is a DOM census):
 * - tap target  = enabled button or link, page-wide
 * - region      = ARIA region landmark (sections with accessible names)
 * - card line   = text-bearing row inside the Train again card
 *                 (paragraphs and action labels each count once;
 *                 visual wrapping never multiplies the count)
 *
 * Lifecycle precedence is NOT asserted here (domain/homePriority.test.ts
 * owns it), and copy is only matched as far as needed to identify the
 * budgeted elements.
 */

// Steady state: 3 card actions (focal CTA + 2 tertiary links) + the
// Settings footer link; the Train again + Recent sessions regions; a
// 6-line card interior (state line, metadata, CTA, Then-line, 2 links).
const STEADY_TAP_TARGETS = 4
const STEADY_REGIONS = 2
const STEADY_CARD_LINE_CAP = 6

// Skipped-tail variant adds exactly one element: the subset-repeat link.
const SKIPPED_TAIL_TAP_TARGETS = 5
const SKIPPED_TAIL_CARD_LINE_CAP = 7

const LAUNCH_CTA = /start (passing|serving|setting) session/i

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

/**
 * The steady-state seed: a completed session PLUS its submitted review
 * (a completed log without a review row resolves to review_pending,
 * not last_complete). No verdict/offered delta on the review and no
 * per-drill captures, so the periphery stays dark: no carry-forward
 * cell, no banded consistency callout, no felt-difficulty lines.
 */
async function seedSteadyState(execId: string) {
  const completedAt = Date.now() - 3 * 24 * 60 * 60 * 1000
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 20 * 60_000,
    completedAt,
  })
  await db.sessionReviews.put({
    id: `review-${execId}`,
    executionLogId: execId,
    sessionRpe: 6,
    goodPasses: 10,
    totalAttempts: 15,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

/**
 * The skipped-tail variant: a deliberate wrap (`completed` status with
 * a skipped tail — the third link keys on the skipped-blocks predicate,
 * not on `ended_early`). Completed blocks total 12 min, above the
 * REPEAT_SUBSET_MIN_MINUTES floor, so the subset-repeat link renders.
 */
async function seedSkippedTail(execId: string) {
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  const block = (id: string, durationMinutes: number) => ({
    id,
    type: 'skill' as const,
    drillName: `Drill ${id}`,
    shortName: id,
    durationMinutes,
    coachingCue: '',
    courtsideInstructions: '',
    required: false,
  })
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [block('b-0', 6), block('b-1', 6), block('b-2', 10)],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: completedAt - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 2,
    blockStatuses: [
      { blockId: 'b-0', status: 'completed' },
      { blockId: 'b-1', status: 'completed' },
      { blockId: 'b-2', status: 'skipped' },
    ],
    startedAt: completedAt - 12 * 60_000,
    completedAt,
    actualDurationMinutes: 12,
  })
  await db.sessionReviews.put({
    id: `review-${execId}`,
    executionLogId: execId,
    sessionRpe: 5,
    goodPasses: 8,
    totalAttempts: 12,
    submittedAt: completedAt,
    status: 'submitted',
  })
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

function countEnabledTapTargets() {
  const enabledButtons = screen
    .queryAllByRole('button')
    .filter((el) => !el.hasAttribute('disabled'))
  const links = screen.queryAllByRole('link')
  return enabledButtons.length + links.length
}

function cardLineCount(card: HTMLElement) {
  return card.querySelectorAll('p, button').length
}

describe('Home covenant render budget (D156)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  describe('steady state (last_complete primary, periphery dark)', () => {
    it('renders exactly the budgeted enabled tap targets', async () => {
      await seedSteadyState('exec-budget')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      expect(countEnabledTapTargets()).toBe(STEADY_TAP_TARGETS)
    })

    it('renders exactly the budgeted region census', async () => {
      await seedSteadyState('exec-budget')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      // The two budgeted regions: the primary card + the Recent block.
      const regions = screen.getAllByRole('region')
      expect(regions).toHaveLength(STEADY_REGIONS)
      expect(screen.getByRole('region', { name: /train again/i })).toBeInTheDocument()
      expect(screen.getByRole('region', { name: /recent sessions/i })).toBeInTheDocument()

      // The absorbed plan line stays absorbed, the secondary rail stays
      // empty, and nothing modal renders in steady state.
      expect(screen.queryByRole('region', { name: /your plan/i })).not.toBeInTheDocument()
      expect(
        screen.queryByRole('list', { name: /other active actions/i }),
      ).not.toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('keeps the card interior within the line cap', async () => {
      await seedSteadyState('exec-budget')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      const card = screen.getByRole('region', { name: /train again/i })
      expect(cardLineCount(card)).toBeLessThanOrEqual(STEADY_CARD_LINE_CAP)
    })

    it('keeps the periphery dark when no peripheral signal has a live condition', async () => {
      await seedSteadyState('exec-budget')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      // Carry-forward cell: requires an accepted next-time delta.
      expect(
        screen.queryByRole('region', { name: /carried forward/i }),
      ).not.toBeInTheDocument()
      // Consistency callout: requires a banded (>= 2 prior weeks) read.
      expect(screen.queryByText(/last week:/i)).not.toBeInTheDocument()
      // Felt-difficulty lines: require per-drill captures in the window.
      expect(
        screen.queryByText(/stretching you|feeling comfortable|: a mix/i),
      ).not.toBeInTheDocument()
    })
  })

  describe('skipped-tail variant (densest card state)', () => {
    it('renders exactly the budgeted tap targets and stays within the variant line cap', async () => {
      await seedSkippedTail('exec-tail')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      // The variant's one extra element is the subset-repeat link, and a
      // deliberate wrap (`completed` + skipped tail) still renders it.
      expect(
        screen.getByRole('button', { name: /repeat shorter version \(12 min\)/i }),
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /repeat full plan/i })).toBeInTheDocument()

      expect(countEnabledTapTargets()).toBe(SKIPPED_TAIL_TAP_TARGETS)

      const card = screen.getByRole('region', { name: /train again/i })
      expect(cardLineCount(card)).toBeLessThanOrEqual(SKIPPED_TAIL_CARD_LINE_CAP)
    })
  })
})
