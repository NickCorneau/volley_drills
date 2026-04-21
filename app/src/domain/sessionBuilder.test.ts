import { describe, expect, it } from 'vitest'
import { DRILLS } from '../data/drills'
import {
  buildDraft,
  buildRecoveryDraft,
  deriveBlockRationale,
  estimateRecoverySessionMinutes,
} from './sessionBuilder'
import type { SetupContext } from '../db/types'

const variantById = new Map(
  DRILLS.flatMap((drill) => drill.variants.map((variant) => [variant.id, variant] as const)),
)

describe('sessionBuilder', () => {
  it.each([
    [
      'solo wall',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
      'solo_wall',
    ],
    [
      'solo net',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
      'solo_net',
    ],
    [
      'solo open',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
      'solo_open',
    ],
    [
      // D103 tie-break: when solo has both net and wall toggled, net wins.
      // A wall at a net-equipped facility is almost always incidental.
      'solo net+wall (net wins per D103)',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: true,
      } satisfies SetupContext,
      'solo_net',
    ],
    [
      'pair net',
      {
        playerMode: 'pair',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
      'pair_net',
    ],
    [
      'pair open',
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
      'pair_open',
    ],
  ])('buildDraft creates a believable %s session', (_label, context, archetypeId) => {
    const draft = buildDraft(context)

    expect(draft).not.toBeNull()
    expect(draft?.archetypeId).toBe(archetypeId)
    expect(draft?.blocks.length).toBeGreaterThan(0)
    expect(draft?.blocks[0]?.type).toBe('warmup')
    // Tier 1a Unit 1: every archetype resolves the warmup slot to
    // `d28 Beach Prep Three`. Previously this test only asserted the
    // warmup wasn't a cooldown drill (d25/d26), which let passing drills
    // silently fill the slot - the exact authoring bug Unit 1 fixed.
    expect(draft?.blocks[0]?.drillId).toBe('d28')
    expect(draft?.blocks[0]?.drillName).toBe('Beach Prep Three')
    expect(draft?.blocks.at(-1)?.type).toBe('wrap')
    expect(['d25', 'd26']).toContain(draft?.blocks.at(-1)?.drillId)

    const totalMinutes = draft!.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
    expect(totalMinutes).toBe(context.timeProfile)

    for (const block of draft!.blocks) {
      const variant = variantById.get(block.variantId)
      expect(variant).toBeDefined()
      expect(variant!.environmentFlags.needsLines).toBe(false)
      expect(variant!.environmentFlags.needsCones).toBe(false)
      expect(variant!.equipment.balls).not.toBe('many')
    }
  })

  /**
   * Tier 1a Unit 2 regression: Swap-pool expansion widened
   * `SKILL_TAGS_BY_TYPE.main_skill` to include `'set'`, but
   * `archetypes.ts` main_skill block skillTags stay `['pass', 'serve']`
   * so default (non-Swap) session assembly preserves the
   * single-focus-per-session invariant (archetype invariants header
   * point 1). A setting drill must never surface in the main_skill
   * slot of a default solo_wall 15-min build.
   */
  it('default solo_wall 15-min build does not pick a setting drill in main_skill (single-focus invariant)', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()
    const mainSkill = draft!.blocks.find((b) => b.type === 'main_skill')
    if (mainSkill !== undefined) {
      expect(['d38', 'd39', 'd41']).not.toContain(mainSkill.drillId)
    }
  })

  /**
   * Tier 1a Unit 4 (Chosen-because rationale): every block on a default
   * buildDraft result carries a one-sentence rationale.
   *
   * Feedback pass 2026-04-21: the rationale no longer cites internal
   * decision IDs (D105/D85) and no longer trails with the redundant
   * `{playerMode} {timeProfile}-min` suffix - that suffix was the same
   * on every block in a session, so it read as noise. Warmup/wrap are
   * fixed purpose-driven sentences; technique/movement/main/pressure
   * describe what the block does for you by focus. Determinism is
   * still the contract that supports partner walkthrough "nodded /
   * ignored" tagging.
   */
  it('every block on a default buildDraft carries a non-empty rationale', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()
    for (const block of draft!.blocks) {
      expect(block.rationale, `${block.type} block missing rationale`).toBeTruthy()
      expect(block.rationale).toMatch(/^Chosen because: /)
      // Regression: no internal decision IDs in user-facing rationale.
      expect(block.rationale).not.toMatch(/D\d{2,}/)
      // Regression: no redundant `{playerMode} {time}-min` trailer.
      expect(block.rationale).not.toMatch(/\b(solo|pair)\s\d+-min/)
    }
  })

  it('warmup rationale is the fixed purpose-driven sentence', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })
    const warmup = draft!.blocks.find((b) => b.type === 'warmup')
    expect(warmup?.rationale).toBe(
      'Chosen because: every session opens with a sand-specific warmup.',
    )
  })

  it('wrap rationale is the fixed purpose-driven sentence', () => {
    const draft = buildDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    })
    const wrap = draft!.blocks.at(-1)
    expect(wrap?.type).toBe('wrap')
    expect(wrap?.rationale).toBe(
      'Chosen because: every session closes with a cooldown downshift.',
    )
  })

  it('deriveBlockRationale is deterministic for the same inputs', () => {
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    }
    const drill = { skillFocus: ['pass' as const] }
    const first = deriveBlockRationale('main_skill', drill, context)
    const second = deriveBlockRationale('main_skill', drill, context)
    expect(first).toBe(second)
    expect(first).toBe(
      "Chosen because: today's main passing rep.",
    )
  })

  it('buildDraft output is deterministic in its rationale sentences', () => {
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    }
    const a = buildDraft(context)
    const b = buildDraft(context)
    // Builder picks drills via shuffle so drill identity may vary, but
    // the rationale sentence for every block that shares (slot type,
    // picked drill's primary focus, context) is identical. We verify
    // the invariant at the slot-type granularity: warmup and wrap are
    // fixed strings, everything else is a well-formed sentence.
    expect(a?.blocks.find((x) => x.type === 'warmup')?.rationale).toBe(
      b?.blocks.find((x) => x.type === 'warmup')?.rationale,
    )
    expect(a?.blocks.find((x) => x.type === 'wrap')?.rationale).toBe(
      b?.blocks.find((x) => x.type === 'wrap')?.rationale,
    )
  })

  it('buildRecoveryDraft keeps low-load slots and drops main_skill and pressure', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })

    expect(recovery).not.toBeNull()
    const types = recovery!.blocks.map((b) => b.type)
    expect(types).toEqual(['warmup', 'technique', 'movement_proxy', 'wrap'])
    expect(types.some((t) => t === 'main_skill' || t === 'pressure')).toBe(false)
  })

  it('buildRecoveryDraft for 15 min includes technique between warmup and wrap', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery?.blocks.map((b) => b.type)).toEqual([
      'warmup',
      'technique',
      'wrap',
    ])
  })

  /**
   * 2026-04-21: recovery respects the user's chosen `timeProfile`
   * instead of the sum-of-mins of kept slots. Pre-2026-04-21, a
   * 15-min request produced a 10-min session (3+4+3) and readers
   * reported "just warmup then cooldown" because the 4-min Work
   * block disappeared between the bookends. The fix folds the
   * reclaimed main_skill/pressure minutes into the Work block so
   * technique dominates the session. These tests pin that shape so a
   * future edit to `allocateRecoveryDurations` can't silently
   * re-shrink recovery back to the intermission pattern.
   */
  it('15-min recovery fills the full 15 minutes with technique as the dominant block', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery).not.toBeNull()
    const total = recovery!.blocks.reduce(
      (sum, b) => sum + b.durationMinutes,
      0,
    )
    expect(total).toBe(15)

    const technique = recovery!.blocks.find((b) => b.type === 'technique')
    const warmup = recovery!.blocks.find((b) => b.type === 'warmup')
    const wrap = recovery!.blocks.find((b) => b.type === 'wrap')
    expect(technique).toBeDefined()
    expect(warmup).toBeDefined()
    expect(wrap).toBeDefined()
    // Technique is strictly longer than either bookend so the Work
    // phase reads as the session, not an intermission.
    expect(technique!.durationMinutes).toBeGreaterThan(
      warmup!.durationMinutes,
    )
    expect(technique!.durationMinutes).toBeGreaterThan(
      wrap!.durationMinutes,
    )
  })

  it('25-min recovery fills 25 minutes with technique >= movement_proxy', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery).not.toBeNull()
    const total = recovery!.blocks.reduce(
      (sum, b) => sum + b.durationMinutes,
      0,
    )
    expect(total).toBe(25)

    const technique = recovery!.blocks.find((b) => b.type === 'technique')
    const movement = recovery!.blocks.find((b) => b.type === 'movement_proxy')
    expect(technique).toBeDefined()
    expect(movement).toBeDefined()
    // 60/40 bias toward technique. Ceiling-rounded so technique wins
    // the odd-minute remainder on allocations like 18/2 → 11/7.
    expect(technique!.durationMinutes).toBeGreaterThanOrEqual(
      movement!.durationMinutes,
    )
  })

  it('40-min recovery fills the full 40 minutes', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 40,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery).not.toBeNull()
    const total = recovery!.blocks.reduce(
      (sum, b) => sum + b.durationMinutes,
      0,
    )
    expect(total).toBe(40)
  })

  it('estimateRecoverySessionMinutes returns the requested timeProfile', () => {
    // Pre-2026-04-21 this returned the sum-of-mins of kept slots
    // (10 for 15, 16 for 25). The lighter path lightens LOAD, not
    // DURATION - users who set a 15-min commitment still have 15
    // minutes available.
    expect(
      estimateRecoverySessionMinutes({
        playerMode: 'pair',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      }),
    ).toBe(15)

    expect(
      estimateRecoverySessionMinutes({
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      }),
    ).toBe(25)

    expect(
      estimateRecoverySessionMinutes({
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: true,
      }),
    ).toBe(40)
  })

  /**
   * Pre-close 2026-04-21 (partner walkthrough P2-2 + thought 3b in
   * founder review): `subBlockIntervalSeconds` pipes from drill variant
   * onto DraftBlock so `RunScreen` can fire sub-block pacing ticks. If
   * any link in the plumbing drops it, d28 Beach Prep Three stops
   * pacing at ~45 s and d26 Stretch Micro-sequence stops at ~30 s, and
   * the partner's explicit "beep every 30 seconds during the cool down"
   * ask is silently undone.
   */
  it('subBlockIntervalSeconds pipes through buildDraft onto warmup + wrap blocks', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()

    const warmup = draft!.blocks.find((b) => b.type === 'warmup')
    expect(warmup?.drillId).toBe('d28')
    expect(warmup?.subBlockIntervalSeconds).toBe(45)

    const wrap = draft!.blocks.find((b) => b.type === 'wrap')
    expect(['d25', 'd26']).toContain(wrap?.drillId)
    if (wrap?.drillId === 'd26') {
      expect(wrap.subBlockIntervalSeconds).toBe(30)
    }
  })

  it('main_skill blocks without internal sub-segments leave subBlockIntervalSeconds undefined', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    const mainSkill = draft!.blocks.find((b) => b.type === 'main_skill')
    expect(mainSkill).toBeDefined()
    // Current main_skill variants do not declare sub-block pacing;
    // the field rides as undefined so RunScreen's pacing loop no-ops.
    expect(mainSkill!.subBlockIntervalSeconds).toBeUndefined()
  })
})
