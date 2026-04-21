import { describe, expect, it } from 'vitest'
import { DRILLS } from '../data/drills'
import { buildDraft, buildRecoveryDraft, deriveBlockRationale } from './sessionBuilder'
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

  it('buildRecoveryDraft returns only warmup and wrap blocks', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })

    expect(recovery).not.toBeNull()
    expect(recovery!.blocks.length).toBeGreaterThan(0)
    expect(recovery!.blocks.every((block) => block.type === 'warmup' || block.type === 'wrap')).toBe(true)
  })
})
