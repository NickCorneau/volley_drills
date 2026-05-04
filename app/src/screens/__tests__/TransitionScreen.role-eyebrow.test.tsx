import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { BlockSlotType } from '../../types/session'
import { TransitionScreen } from '../TransitionScreen'

/**
 * 2026-04-27 cca2 dogfeed F1 follow-up
 * (`docs/research/2026-04-27-cca2-dogfeed-findings.md`): TransitionScreen
 * gained two ship-time invariants that this file pins:
 *
 * 1. **Role label rides on the `Up next · {phaseLabel}` eyebrow.** Pre-
 *    ship the eyebrow read just `Up next`. Post-ship it composes with
 *    the `phaseLabel(nextBlock.type)` so role identity is visible at
 *    preview time, in parallel with RunScreen's header eyebrow. The
 *    parametrized test sweeps all 6 slot types so a regression cannot
 *    drop a label silently.
 * 2. **Per-block `rationale` prose ("Chosen because: …") is not
 *    rendered.** The data field stays preserved on the SessionPlanBlock
 *    record so future surfaces (Swap-sheet re-home, Tier 2 See-Why
 *    modal) can reach for it; the Transition body just doesn't surface
 *    it. The negative-assertion test catches a silent re-introduction.
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

type TransitionSeedOptions = {
  drillId?: string
  variantId?: string
  drillName?: string
}

async function seedTransitionState(
  execId: string,
  planId: string,
  nextBlockType: BlockSlotType,
  next: TransitionSeedOptions = {},
) {
  const now = Date.now()
  const drillIdField = next.drillId ? { drillId: next.drillId } : {}
  const variantIdField = next.variantId ? { variantId: next.variantId } : {}
  // Two-block plan: block 0 (warmup, completed), block 1 (the type
  // under test, which is the upcoming block on Transition). If
  // drillId/variantId are provided, the upcoming block is real-drill
  // (exercises eyebrow compose); otherwise it is synthetic and the
  // eyebrow falls back to bare slot label.
  await db.sessionPlans.put({
    id: planId,
    presetId: 'pair_open',
    presetName: 'Pair + Open',
    playerCount: 2,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillName: 'Beach Prep Three',
        shortName: 'Beach Prep',
        durationMinutes: 3,
        coachingCue: 'Short hops, loud feet.',
        courtsideInstructions: 'Four quick blocks, ~45 s each.',
        rationale: 'Chosen because: every session opens with a sand-specific warmup.',
        required: true,
      },
      {
        id: 'b-1',
        type: nextBlockType,
        ...drillIdField,
        ...variantIdField,
        drillName: next.drillName ?? 'Test Drill',
        shortName: 'Test',
        durationMinutes: 5,
        coachingCue: 'Athletic posture.',
        courtsideInstructions: 'Test instructions.',
        rationale: "Chosen because: today's main pass rep.",
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'in_progress',
    activeBlockIndex: 1,
    blockStatuses: [
      { blockId: 'b-0', status: 'completed', startedAt: now - 200_000, completedAt: now - 30_000 },
      { blockId: 'b-1', status: 'in_progress' },
    ],
    startedAt: now - 200_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run/transition?id=${execId}`]}>
      <Routes>
        <Route path="/run/transition" element={<TransitionScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TransitionScreen: role-label eyebrow + rationale absent (cca2 dogfeed F1, 2026-04-27)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it.each<[BlockSlotType, string]>([
    ['technique', 'Technique'],
    ['movement_proxy', 'Movement'],
    ['main_skill', 'Main drill'],
    ['pressure', 'Pressure'],
    ['wrap', 'Downshift'],
  ])('renders the `Up next · %s` eyebrow on Transition', async (type, expectedLabel) => {
    await seedTransitionState(`exec-${type}`, `plan-${type}`, type)
    renderAt(`exec-${type}`)

    // The eyebrow composes the temporal cue (`Up next`) with the role
    // cue (`{phaseLabel}`) using a thin `·` separator so the two reads
    // stay in one quiet line.
    expect(await screen.findByText(`Up next · ${expectedLabel}`)).toBeInTheDocument()
    // F8-era collapsed `Work` label must not surface for any of the
    // four mid-session slot types.
    expect(screen.queryByText(/Up next · Work\b/)).toBeNull()
  })

  it('does not render the per-block rationale prose on Transition (cca2 dogfeed F1, 2026-04-27)', async () => {
    await seedTransitionState('exec-no-rationale', 'plan-no-rationale', 'main_skill')
    renderAt('exec-no-rationale')

    // Confirm the screen mounted: the `Up next` eyebrow is present.
    expect(await screen.findByText('Up next · Main drill')).toBeInTheDocument()

    // Rationale prose must NOT appear anywhere in the body. The
    // `nextBlock.rationale` data field is preserved on the data record
    // (so future surfaces — Swap sheet re-home, Tier 2 See-Why modal —
    // can reach for it), but the Up next briefing no longer renders it.
    expect(screen.queryByText(/Chosen because:/i)).toBeNull()
  })

  /**
   * 2026-04-27 cca2 dogfeed F8 follow-up: when the next block
   * resolves to a real catalog drill, Transition's eyebrow composes
   * the full three-part shape `Up next · {slot} · {skill}` per the
   * founder's vocabulary call (`trans_full` chosen over
   * `trans_skill_only`). This sweep pins the compose path across
   * each surfaced skill.
   */
  it.each<[string, string, string, BlockSlotType, string]>([
    [
      'd33',
      'd33-pair',
      'Around the World Serving',
      'main_skill',
      'Up next · Main drill · Serve',
    ],
    [
      'd10',
      'd10-pair',
      'The 6-Legged Monster',
      'technique',
      'Up next · Technique · Pass',
    ],
    [
      'd38',
      'd38-pair',
      'Bump Set Fundamentals',
      'main_skill',
      'Up next · Main drill · Set',
    ],
  ])(
    'composes eyebrow `%5$s` for drill %3$s (%2$s) at %4$s slot',
    async (drillId, variantId, drillName, type, expected) => {
      await seedTransitionState(`exec-compose-${drillId}`, `plan-compose-${drillId}`, type, {
        drillId,
        variantId,
        drillName,
      })
      renderAt(`exec-compose-${drillId}`)
      expect(await screen.findByText(expected)).toBeInTheDocument()
    },
  )

  it('header uses a 3-column grid (true-center alignment, not flex-justify-between drift)', async () => {
    // 2026-04-27 cca2 dogfeed visual catch on RunScreen showed the
    // prior `flex justify-between` pattern drifts the middle eyebrow
    // off-center when SafetyIcon (56 px) and the right-side counter
    // have asymmetric widths. Same pattern was applied here for
    // visual consistency across the run-flow screens (Run /
    // Transition / DrillCheck). This test pins the grid invariant
    // so a silent revert back to `flex justify-between` breaks.
    await seedTransitionState('exec-grid', 'plan-grid', 'main_skill')
    renderAt('exec-grid')
    await screen.findByText('Up next · Main drill')

    const headerEl = document.querySelector(
      '[data-screen-shell-header="true"]',
    ) as HTMLElement | null
    expect(headerEl).not.toBeNull()
    expect(headerEl!.className).toContain('grid')
    expect(headerEl!.className).toContain('grid-cols-3')
    expect(headerEl!.className).not.toContain('justify-between')

    // After plan U5 (2026-05-04), the alignment class lives on the
    // wrapping span that `RunFlowHeader` renders around the caller's
    // eyebrow node, so target the parent — the eyebrow text node only
    // carries the caller's typography classes.
    const eyebrow = screen.getByText('Transition')
    expect(eyebrow.parentElement?.className).toContain('justify-self-center')
  })
})
