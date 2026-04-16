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

import type { SessionArchetype, BlockSlot } from '../types/session'

// ---------------------------------------------------------------------------
// Shared block definitions
// ---------------------------------------------------------------------------

const warmup = (min: number, max: number): BlockSlot => ({
  type: 'warmup',
  durationMinMinutes: min,
  durationMaxMinutes: max,
  intent: 'Raise temperature, establish easy success, screen for obvious pain.',
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
  intent: 'End cleanly, cool-down, prep review.',
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
    15: [warmup(2, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
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
    15: [warmup(2, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
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
    15: [warmup(2, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
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
    15: [warmup(2, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
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
    15: [warmup(2, 3), technique(4, 5), mainSkill(5, 6), wrap(3, 4)],
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
 * Returns the first match where all requiredContext fields agree.
 */
export function selectArchetype(context: {
  playerMode: string
  netAvailable: boolean
  wallAvailable: boolean
}): SessionArchetype | undefined {
  if (context.playerMode === 'pair') {
    return context.netAvailable ? pairNet : pairOpen
  }
  if (context.wallAvailable) return soloWall
  if (context.netAvailable) return soloNet
  return soloOpen
}
