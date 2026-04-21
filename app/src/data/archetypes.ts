/**
 * Session archetypes — fixed block templates selected from hard-filter context.
 *
 * Deload is an overlay on any archetype, not a separate planner (D67).
 * Block order follows blended-practice evidence: blocked quality reps early,
 * constrained variability later (D68).
 *
 * Source: docs/specs/m001-session-assembly.md
 * Schema: app/src/types/session.ts
 */

// ---------------------------------------------------------------------------
// Session-assembly invariants (content-authoring and maintenance reference)
// ---------------------------------------------------------------------------
//
// 1. Single-focus-per-session invariant (BAB coaches guide; D105; M001 Tier 1).
//    Every session targets ONE skill focus (pass / serve / set). The
//    `main_skill` block populates from the chain matching that focus
//    (chain-1..5 for pass, chain-6-serving for serve, chain-7-setting for set).
//    Warmup and wrap blocks are focus-agnostic (they key off skillFocus
//    'warmup' and 'recovery' respectively, not the session focus).
//    Technique and movement_proxy blocks MAY support-focus — for example,
//    a pass-focus session can use a movement_proxy block with
//    `skillTags: ['pass', 'movement']`. Never author a session template
//    that mixes two primary main-skill chains.
//
// 2. Serve-to-attack convertibility (BAB 2024 drill book intro).
//    "All of the drills under the Serving header can be easily converted
//    into attack drills." When the attack chain is authored (M001 Tier 3+
//    or post-M001), many serving drills become attack-drill templates by
//    replacing the serve with a coach-toss or self-toss into the same zone
//    grid. Design new serving drills so `feedType: 'live-serve'` can be
//    swapped to `'coach-toss'` or `'self-toss'` without reshaping the rest
//    of the drill (same target zones, same success metric, same rep cap).
//
// 3. Warmup slot preference order (D105 + M001 Tier 1 Unit 1).
//    The session builder prefers drills with `skillFocus: ['warmup']`
//    (Beach Prep Two / Three / Five — see app/src/data/drills.ts).
//    The builder falls back to the first non-recovery drill only when the
//    Beach Prep set is absent; this fallback is defensive and should never
//    be the normal path. NEVER author a pass/serve/set drill as content
//    that ends up in the warmup slot — warmup content must declare
//    `skillFocus: ['warmup']` as its primary focus.
//
// 4. Wrap slot preference (D105).
//    The wrap block prefers `skillFocus: ['recovery']` (Downshift, Stretch).
//    Framed as transition and comfort, NOT as a recovery or
//    injury-prevention claim (post-2015 active-cool-down literature does
//    not support those claims at this dose; see
//    docs/research/warmup-cooldown-minimum-protocols.md).
//
// ---------------------------------------------------------------------------

import type { SessionArchetype, BlockSlot } from '../types/session'

// ---------------------------------------------------------------------------
// Shared block definitions
// ---------------------------------------------------------------------------

const warmup = (min: number, max: number): BlockSlot => ({
  type: 'warmup',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent:
    'Build heat, prime ankles, activate shoulder and trunk, rehearse movement on sand. Screen for obvious pain.',
  required: true,
  skillTags: ['pass', 'movement'],
})

const technique = (min: number, max: number): BlockSlot => ({
  type: 'technique',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent: 'Platform shape, angle control, repeatable quality.',
  required: true,
  skillTags: ['pass'],
})

const movementProxy = (min: number, max: number): BlockSlot => ({
  type: 'movement_proxy',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent: 'Footwork, first-step movement, or reading proxies before harder block.',
  required: false,
  skillTags: ['pass', 'movement'],
})

const mainSkill = (min: number, max: number): BlockSlot => ({
  type: 'main_skill',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent: 'Highest-trust drill available for the current archetype.',
  required: true,
  skillTags: ['pass', 'serve'],
})

const pressure = (min: number, max: number): BlockSlot => ({
  type: 'pressure',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent: 'Scoring, variability, or simple constraints. Not full randomization.',
  required: false,
  skillTags: ['pass', 'serve'],
})

const wrap = (min: number, max: number): BlockSlot => ({
  type: 'wrap',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent: 'Downshift: transition and comfort, prep review. Not an injury-prevention or recovery claim (D105).',
  required: true,
  skillTags: ['recovery'],
})

// ---------------------------------------------------------------------------
// Archetypes
// ---------------------------------------------------------------------------

const soloWall: SessionArchetype = {
  id: 'solo_wall',
  name: 'Solo + Wall',
  description:
    'Platform reps, angle control, and touch volume using a wall or fence for ball return.',
  requiredContext: {
    playerMode: 'solo',
    wallAvailable: true,
  },
  layouts: {
    15: [warmup(3, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
    25: [warmup(3, 4), technique(5, 6), movementProxy(4, 5), mainSkill(6, 8), wrap(4, 5)],
    40: [
      warmup(4, 6),
      technique(6, 8),
      movementProxy(5, 6),
      mainSkill(8, 10),
      pressure(6, 8),
      wrap(4, 6),
    ],
  },
}

const soloNet: SessionArchetype = {
  id: 'solo_net',
  name: 'Solo + Net',
  description:
    'Solo passing and serving practice with a net. Unlocks net-specific drills like catch-your-own-pass and solo serving.',
  requiredContext: {
    playerMode: 'solo',
    netAvailable: true,
  },
  layouts: {
    15: [warmup(3, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
    25: [warmup(3, 4), technique(5, 6), movementProxy(4, 5), mainSkill(6, 8), wrap(4, 5)],
    40: [
      warmup(4, 6),
      technique(6, 8),
      movementProxy(5, 6),
      mainSkill(8, 10),
      pressure(6, 8),
      wrap(4, 6),
    ],
  },
}

const soloOpen: SessionArchetype = {
  id: 'solo_open',
  name: 'Solo + Open',
  description:
    'Self-toss, movement, and no-infrastructure proxies. Best for open sand without wall or net.',
  requiredContext: {
    playerMode: 'solo',
    wallAvailable: false,
  },
  layouts: {
    15: [warmup(3, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
    25: [warmup(3, 4), technique(5, 7), movementProxy(4, 5), mainSkill(6, 7), wrap(4, 5)],
    40: [
      warmup(4, 6),
      technique(6, 8),
      movementProxy(5, 7),
      mainSkill(8, 10),
      pressure(5, 7),
      wrap(4, 6),
    ],
  },
}

const pairNet: SessionArchetype = {
  id: 'pair_net',
  name: 'Pair + Net',
  description:
    'Live serve-receive transfer and pressure work. Highest-trust environment for real serve reading.',
  requiredContext: {
    playerMode: 'pair',
    netAvailable: true,
  },
  layouts: {
    15: [warmup(3, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
    25: [warmup(3, 4), technique(5, 6), movementProxy(4, 5), mainSkill(6, 8), wrap(4, 5)],
    40: [
      warmup(4, 6),
      technique(5, 7),
      movementProxy(5, 6),
      mainSkill(8, 10),
      pressure(7, 9),
      wrap(4, 6),
    ],
  },
}

const pairOpen: SessionArchetype = {
  id: 'pair_open',
  name: 'Pair + Open',
  description:
    'Toss-based pair work when a net is unavailable. Good for movement and cooperative passing.',
  requiredContext: {
    playerMode: 'pair',
    netAvailable: false,
  },
  layouts: {
    15: [warmup(3, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
    25: [warmup(3, 4), technique(5, 7), movementProxy(4, 5), mainSkill(6, 7), wrap(4, 5)],
    40: [
      warmup(4, 6),
      technique(6, 8),
      movementProxy(5, 6),
      mainSkill(7, 9),
      pressure(5, 7),
      wrap(4, 6),
    ],
  },
}

export const SESSION_ARCHETYPES: readonly SessionArchetype[] = [
  soloWall,
  soloNet,
  soloOpen,
  pairNet,
  pairOpen,
] as const

/**
 * Select the best archetype for a given context.
 *
 * Solo priority per D103: solo_net > solo_wall > solo_open.
 * - net toggled (with or without wall)        -> solo_net (a wall at a
 *   net-equipped facility is almost always incidental).
 * - wall toggled without net                  -> solo_wall (the classic
 *   home/garage/school-wall case; wall is conditional inventory per D102).
 * - neither toggled                           -> solo_open (the default
 *   per D102 for a beach-first product).
 *
 * Pair priority is net-first, then open.
 */
export function selectArchetype(context: {
  playerMode: string
  netAvailable: boolean
  wallAvailable: boolean
}): SessionArchetype | undefined {
  if (context.playerMode === 'pair') {
    return context.netAvailable ? pairNet : pairOpen
  }
  if (context.netAvailable) return soloNet
  if (context.wallAvailable) return soloWall
  return soloOpen
}
