import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { db } from '../../db'
import type { BlockSlotType } from '../../types/session'
import { RunScreen } from '../RunScreen'

/**
 * RunScreen body-typography invariants.
 *
 * History:
 *
 * - **2026-04-21 (P1-11)** — partner-walkthrough pass surfaced that
 *   `rationale` was rendered BELOW the coaching-cue toggle at
 *   `text-xs` (12 px). Seb merged it with the coach-cue cluster on
 *   first read. The original test cases in this file pinned that
 *   the rationale rendered above `courtsideInstructions` at `text-sm`
 *   so the bug couldn't silently regress.
 *
 * - **2026-04-27 (cca2 dogfeed F1)** — the per-block `rationale`
 *   prose was deleted from RunScreen and TransitionScreen entirely
 *   (`docs/research/2026-04-27-cca2-dogfeed-findings.md`). Role
 *   information now rides on the `phaseLabel` header eyebrow
 *   (`Technique` / `Movement` / `Main drill` / `Pressure`). The two
 *   rationale-specific cases in this file were removed — they
 *   pinned a rendering that no longer happens. The remaining cases
 *   continue to pin the run-card type hierarchy: the focal current
 *   cue owns `text-base`, while full instructions sit behind inline
 *   disclosure as compact secondary detail.
 *
 * The seeded plan still carries `rationale` on the block so the
 * data field stays exercised in tests; the block render simply
 * doesn't surface it.
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

type SeedOptions = {
  blockType?: BlockSlotType
  rationale?: string | undefined
  drillId?: string
  variantId?: string
  drillName?: string
  playerCount?: 1 | 2
}

async function seedPausedSession(execId: string, planId: string, options: SeedOptions = {}) {
  const now = Date.now()
  const blockType = options.blockType ?? 'main_skill'
  const drillName = options.drillName ?? 'Passing'
  const playerCount = options.playerCount ?? 1
  // `rationale` defaults to a populated string; pass `undefined`
  // explicitly to seed a legacy plan that pre-dates Tier 1a Unit 4.
  const rationaleField =
    'rationale' in options
      ? options.rationale === undefined
        ? {}
        : { rationale: options.rationale }
      : { rationale: "Chosen because: today's main pass rep." }
  // `drillId` / `variantId` are optional so legacy-plan tests can
  // seed plans without these fields. When provided, they let
  // `getBlockSkillFocus` resolve the catalog drill and exercise the
  // compose path on RunScreen's eyebrow.
  const drillIdField = options.drillId ? { drillId: options.drillId } : {}
  const variantIdField = options.variantId ? { variantId: options.variantId } : {}
  await db.sessionPlans.put({
    id: planId,
    presetId: playerCount === 2 ? 'pair_open' : 'solo_open',
    presetName: playerCount === 2 ? 'Pair + Open' : 'Solo + Open',
    playerCount,
    blocks: [
      {
        id: 'b-0',
        type: blockType,
        ...drillIdField,
        ...variantIdField,
        drillName,
        shortName: 'Pass',
        durationMinutes: 5,
        coachingCue: 'Athletic posture.',
        courtsideInstructions: 'Self-toss; forearm pass up and down.',
        ...rationaleField,
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: now - 60_000,
  })
  await db.executionLogs.put({
    id: execId,
    planId,
    status: 'paused',
    activeBlockIndex: 0,
    blockStatuses: [{ blockId: 'b-0', status: 'in_progress' }],
    startedAt: now - 30_000,
    pausedAt: now - 5_000,
  })
}

function renderAt(execId: string) {
  return render(
    <MemoryRouter initialEntries={[`/run?id=${execId}`]}>
      <Routes>
        <Route path="/run" element={<RunScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RunScreen: body-typography invariants (P1-11 / cca2 dogfeed F1)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('does not render the per-block rationale prose (cca2 dogfeed F1, 2026-04-27)', async () => {
    await seedPausedSession('exec-no-rationale', 'plan-no-rationale')
    renderAt('exec-no-rationale')

    // The drill name is the focal heading; assert it renders so we
    // know the screen actually mounted.
    await screen.findByRole('heading', { name: /Passing/i, level: 1 })

    // Rationale prose must NOT appear anywhere in the body. The
    // `block.rationale` field is preserved on the data record (so
    // future surfaces — Swap sheet, See-Why modal in Tier 2 — can
    // reach for it), but the run-card body no longer surfaces it.
    expect(screen.queryByText(/Chosen because:/i)).toBeNull()
  })

  it('renders the role label in the header eyebrow (Main drill, cca2 dogfeed F1, 2026-04-27)', async () => {
    await seedPausedSession('exec-eyebrow', 'plan-eyebrow')
    renderAt('exec-eyebrow')

    // The seeded block is `type: 'main_skill'` — eyebrow must render
    // `Main drill` (not the F8-era collapsed `Work` label). This
    // pins the un-collapse against silent regression.
    expect(await screen.findByText('Main drill')).toBeInTheDocument()
    expect(screen.queryByText('Work')).toBeNull()
  })

  it.each<[BlockSlotType, string]>([
    ['warmup', 'Warm up'],
    ['technique', 'Technique'],
    ['movement_proxy', 'Movement'],
    ['main_skill', 'Main drill'],
    ['pressure', 'Pressure'],
    ['wrap', 'Downshift'],
  ])(
    'renders the role label `%s` in the header eyebrow for slot type %s',
    async (type, expected) => {
      // Synthetic drillName ('Passing') doesn't resolve to any
      // catalog drill, so `getBlockSkillFocus` returns null and the
      // eyebrow falls back to the bare slot label. This test pins
      // the slot-only path; the compose path is pinned in the
      // it.each block below.
      await seedPausedSession(`exec-role-${type}`, `plan-role-${type}`, { blockType: type })
      renderAt(`exec-role-${type}`)

      expect(await screen.findByText(expected)).toBeInTheDocument()
      if (type !== 'warmup' && type !== 'wrap') {
        expect(screen.queryByText('Work')).toBeNull()
      }
    },
  )

  /**
   * 2026-04-27 cca2 dogfeed F8 follow-up: when the block resolves
   * to a real catalog drill, the eyebrow composes `{slot} · {skill}`
   * via `blockEyebrowLabel`. This sweep pins the compose path
   * across each surfaced skill (pass / serve / set) so a regression
   * in either `getBlockSkillFocus` or `blockEyebrowLabel` breaks
   * before it ships.
   *
   * Drills used:
   *   - d33 (Around the World Serving) → serve, type main_skill
   *     → eyebrow `Main drill · Serve`
   *   - d10 (The 6-Legged Monster) → pass, type technique
   *     → eyebrow `Technique · Pass`
   *   - d38 (Bump Set Fundamentals) → set, type main_skill
   *     → eyebrow `Main drill · Set`
   */
  it.each<[string, string, string, BlockSlotType, string]>([
    ['d33', 'd33-pair', 'Around the World Serving', 'main_skill', 'Main drill · Serve'],
    ['d10', 'd10-pair', 'The 6-Legged Monster', 'technique', 'Technique · Pass'],
    ['d38', 'd38-pair', 'Bump Set Fundamentals', 'main_skill', 'Main drill · Set'],
  ])(
    'composes eyebrow `%5$s` for drill %3$s (%2$s) at %4$s slot',
    async (drillId, variantId, drillName, type, expected) => {
      await seedPausedSession(`exec-compose-${drillId}`, `plan-compose-${drillId}`, {
        blockType: type,
        drillId,
        variantId,
        drillName,
        playerCount: 2,
      })
      renderAt(`exec-compose-${drillId}`)
      expect(await screen.findByText(expected)).toBeInTheDocument()
    },
  )

  it('renders bare `Warm up` (no skill suffix) even when a warmup drill resolves', async () => {
    // d28 Beach Prep Three has skillFocus `['warmup']`, so
    // `getBlockSkillFocus` returns null and the eyebrow stays
    // `Warm up` without a `· {Skill}` suffix. Pins the warmup-skip
    // contract in `blockEyebrowLabel`.
    await seedPausedSession('exec-warmup-bare', 'plan-warmup-bare', {
      blockType: 'warmup',
      drillId: 'd28',
      variantId: 'd28-solo',
      drillName: 'Beach Prep Three',
      playerCount: 1,
    })
    renderAt('exec-warmup-bare')
    expect(await screen.findByText('Warm up')).toBeInTheDocument()
    // No `Warm up · *` composition leaks through.
    expect(screen.queryByText(/Warm up · /i)).toBeNull()
  })

  it('header uses a 3-column grid (so the eyebrow is true-centered, not flex-justify-between drift)', async () => {
    // 2026-04-27 cca2 dogfeed visual catch: the prior `flex
    // justify-between` keeps gap-left = gap-right but does NOT
    // center the middle item relative to the container. With
    // SafetyIcon at 56 px (h-14 w-14 touch target) and a short
    // `N/M` counter (~22 px), the middle eyebrow drifts ~17 px
    // right of true center. The fix switches to `grid grid-cols-3`
    // so each column is 1/3 of the container width and the middle
    // column auto-centers the eyebrow regardless of side widths.
    //
    // This test pins the structural invariant so a regression
    // back to `flex justify-between` (the silent failure mode)
    // breaks before it ships.
    await seedPausedSession('exec-grid', 'plan-grid')
    renderAt('exec-grid')
    // Wait for the screen to mount before querying the header.
    await screen.findByText('Main drill')

    const headerEl = document.querySelector(
      '[data-screen-shell-header="true"]',
    ) as HTMLElement | null
    expect(headerEl).not.toBeNull()
    expect(headerEl!.className).toContain('grid')
    expect(headerEl!.className).toContain('grid-cols-3')
    // Negative assertion: the prior `flex justify-between` pattern
    // must NOT be present, since that pattern is what the grid
    // replaces.
    expect(headerEl!.className).not.toContain('justify-between')

    // The eyebrow's parent cell should be `justify-self-center` so
    // the role label sits at the center of its 1/3 column.
    const eyebrow = screen.getByText('Main drill')
    expect(eyebrow.className).toContain('justify-self-center')
  })

  it('renders cleanly for legacy plans without a `rationale` field on the block', async () => {
    // Plans created before Tier 1a Unit 4 (and the `rationale` field
    // it added) have `rationale: undefined`. Run-card body must still
    // render the drill name and instructions without throwing on the
    // missing field. Pre-2026-04-27 the run card had a defensive
    // `{currentBlock.rationale && (...)}` guard for this case; the
    // 2026-04-27 deletion removed both the guard and the rendering,
    // so this test is the new safety net for the legacy-plan path.
    await seedPausedSession('exec-legacy', 'plan-legacy', { rationale: undefined })
    renderAt('exec-legacy')

    // Drill name still renders.
    await screen.findByRole('heading', { name: /Passing/i, level: 1 })
    // No rationale prose.
    expect(screen.queryByText(/Chosen because:/i)).toBeNull()
    // Eyebrow still renders.
    expect(screen.getByText('Main drill')).toBeInTheDocument()
  })

  it('full courtsideInstructions render as compact secondary detail behind inline disclosure', async () => {
    await seedPausedSession('exec-instr', 'plan-instr')
    renderAt('exec-instr')

    const instructions = await screen.findByText(/Self-toss; forearm pass up and down\./i)

    // Run Face v1 keeps one larger current cue, then parks fuller
    // instructions as secondary text behind disclosure to reduce
    // phone-screen load during live play.
    expect(instructions.className).toContain('text-sm')
    expect(instructions.className).not.toContain('text-lg')
    expect(instructions.className).not.toContain('text-xs')
  })

  it('coachingCue renders at text-base (16 px outdoor floor)', async () => {
    await seedPausedSession('exec-cue-size', 'plan-cue-size')
    renderAt('exec-cue-size')

    // Short compact cue: full text is always shown in the coaching card
    // (no expand). Same round-2 downshift rationale as
    // courtsideInstructions above — run-mode body type unified at
    // `text-base` across the run-card paragraphs (instructions,
    // coaching cue) so the screen reads as one consistent voice.
    const cue = await screen.findByText(/Athletic posture\./i)
    expect(cue.className).toContain('text-base')
    expect(cue.className).not.toContain('text-lg')
    expect(cue.className).not.toContain('text-sm')
    expect(cue.className).not.toContain('text-xs')
  })
})
