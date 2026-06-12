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
 * - top-level   = direct element child of the ScreenShell body
 *                 ([data-screen-shell-body]) — catches additions that
 *                 carry no landmark and no tap target (a quiet <p>
 *                 line is exactly the R5 creep class)
 * - card line   = text-bearing row inside the Train again card
 *                 (paragraphs and action labels each count once;
 *                 visual wrapping never multiplies the count)
 *
 * Lifecycle precedence is NOT asserted here (domain/homePriority.test.ts
 * owns it), and copy is only matched as far as needed to identify the
 * budgeted elements.
 */

// Steady state (amended by D158, the shibui v2-04 card): the focal CTA
// + the page-level `Start a different session` escape link + the
// Settings footer link; the Train again + Recent sessions regions; a
// 4-line card interior (state line, Recommended eyebrow, CTA,
// Then-line — no meta line, no in-card links). The body hosts exactly
// 3 top-level elements: the thin-spine cluster, the escape link, and
// the Recent sessions section.
const STEADY_TAP_TARGETS = 3
const STEADY_REGIONS = 2
const STEADY_BODY_CHILDREN = 3
const STEADY_CARD_LINE_CAP = 4

// Coupled to the shipped SkillFocus set on purpose: extend the
// alternation when a new focus ships (e.g. the queued M002 attack
// track), otherwise the await anchor times out opaquely. Do not loosen
// to `.+` — that would also match "Start a different session".
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
 * a skipped tail). Pre-D158 this was the densest card state (it added
 * the subset-repeat link); post-D158 the card renders identically to
 * steady state — the case stays to pin exactly that.
 */
async function seedSkippedTail(execId: string) {
  const completedAt = Date.now() - 2 * 24 * 60 * 60 * 1000
  const block = (id: string, durationMinutes: number) => ({
    id,
    type: 'technique' as const,
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

function bodyChildCount() {
  const body = document.querySelector('[data-screen-shell-body]')
  if (!body) throw new Error('ScreenShell body not found')
  return body.childElementCount
}

// Row-level text elements only. Spans/divs are deliberately excluded
// because they nest inside buttons and rows and would multiply the
// count without representing a new visual line.
function cardLineCount(card: HTMLElement) {
  return card.querySelectorAll('p, button, a, li, h1, h2, h3, h4, h5, h6').length
}

const BUDGET_MSG =
  'Home render budget exceeded — evict an element or amend the budget via a decision row citing D156 (see file docblock)'

describe('Home covenant render budget (D156)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  describe('steady state (last_complete primary, periphery dark)', () => {
    it('renders exactly the budgeted enabled tap targets', async () => {
      await seedSteadyState('exec-budget')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      expect(countEnabledTapTargets(), BUDGET_MSG).toBe(STEADY_TAP_TARGETS)
    })

    it('renders exactly the budgeted region and top-level element census', async () => {
      await seedSteadyState('exec-budget')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      // The two budgeted regions: the primary card + the Recent block.
      const regions = screen.getAllByRole('region')
      expect(regions).toHaveLength(STEADY_REGIONS)
      // Top-level census: catches additions that carry no landmark and
      // no tap target (an unlandmarked quiet line still adds a child).
      expect(bodyChildCount(), BUDGET_MSG).toBe(STEADY_BODY_CHILDREN)
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
      expect(cardLineCount(card), BUDGET_MSG).toBeLessThanOrEqual(STEADY_CARD_LINE_CAP)
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

  describe('skipped-tail variant (renders identically to steady state post-D158)', () => {
    it('stays at the steady-state budget — no repeat links, no meta line', async () => {
      await seedSkippedTail('exec-tail')
      renderHome()
      await screen.findByRole('button', { name: LAUNCH_CTA })

      // D158 regression guard: the retired repeat affordances must not
      // return on the wrap/skipped-tail state either.
      expect(screen.queryByRole('button', { name: /repeat/i })).not.toBeInTheDocument()

      expect(countEnabledTapTargets(), BUDGET_MSG).toBe(STEADY_TAP_TARGETS)
      expect(screen.getAllByRole('region')).toHaveLength(STEADY_REGIONS)
      expect(bodyChildCount(), BUDGET_MSG).toBe(STEADY_BODY_CHILDREN)

      const card = screen.getByRole('region', { name: /train again/i })
      expect(cardLineCount(card), BUDGET_MSG).toBeLessThanOrEqual(STEADY_CARD_LINE_CAP)
    })
  })
})
