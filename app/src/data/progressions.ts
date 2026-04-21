/**
 * Progression chains - ordered drill sequences with gating criteria.
 *
 * `defaultGatingThreshold: 0.7` is the **latent** true-rate target (D80,
 * Volleyball Canada development matrix). It is NOT the raw observed gate.
 * The operational progression gate (D104, specified in
 * docs/specs/m001-adaptation-rules.md) is:
 *   - minimum 50 scored contacts in the same drill-variant + success-rule
 *     + stable-fatigue context (no progression signal below that);
 *   - a Bayesian posterior rule: progress only when
 *     P(p_corrected >= 0.70 | x_corrected, n) >= 0.80 under a Jeffreys
 *     beta-binomial prior, which at n=50 resolves to >= 38 corrected
 *     "Good" reps (boundary ~76% corrected);
 *   - a pre-calibration raw proxy of 41/50 (general) or 42/50
 *     (injury-sensitive) until personal bias calibration exists.
 *
 * The progression engine that applies this rule is M001-build scope.
 * v0b surfaces only show informational feedback below the gate and
 * cap outcome at `hold` when N < 50 (see V0B-11).
 *
 * Source: research-output/drill-library-content-structure.md,
 * docs/research/binary-scoring-progression.md
 * Schema: app/src/types/drill.ts (ProgressionChain, ProgressionLink)
 */

import type { ProgressionChain } from '../types/drill'

const chain1: ProgressionChain = {
  id: 'chain-1-platform',
  name: 'Platform Quality and Posture',
  focus: 'Stable contact fundamentals: platform consistency, posture, clean repeatable contact.',
  drillIds: ['d01', 'd02', 'd03', 'd04'],
  defaultGatingThreshold: 0.7,
  links: [
    {
      fromDrillId: 'd01',
      toDrillId: 'd02',
      direction: 'progression',
      gatingCriteria: '≥ 20 consecutive clean contacts in d01',
      description: 'Once platform is reliable solo, add postural constraint with partner toss.',
    },
    {
      fromDrillId: 'd02',
      toDrillId: 'd03',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes graded 2+ in d02',
      description:
        'Posture stable → add kneel-to-stand progression for platform under positional change.',
    },
    {
      fromDrillId: 'd03',
      toDrillId: 'd04',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes catchable/graded 2+ in d03',
      description: 'Reliable platform standing → add settable trajectory and self-catch challenge.',
    },
    {
      fromDrillId: 'd02',
      toDrillId: 'd01',
      direction: 'regression',
      description: 'If posture breaks under partner toss, return to solo platform work.',
    },
  ],
}

const chain2: ProgressionChain = {
  id: 'chain-2-direction',
  name: 'Directional Control and Angle Management',
  focus: 'Passing to a beach set-window: accuracy, angle, and early decision-making.',
  drillIds: ['d05', 'd06', 'd07', 'd08'],
  defaultGatingThreshold: 0.7,
  links: [
    {
      fromDrillId: 'd05',
      toDrillId: 'd06',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes graded 2+ in d05',
      description:
        'Directional control established → overlay pass-grade scoring on platform drill.',
    },
    {
      fromDrillId: 'd06',
      toDrillId: 'd07',
      direction: 'progression',
      gatingCriteria: 'Average pass grade ≥ 2.0 in d06',
      description: 'Accuracy reliable → add post-pass visual decision (proto-game read).',
    },
    {
      fromDrillId: 'd07',
      toDrillId: 'd08',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes 2+ AND ≥ 80% correct calls in d07',
      description: 'Pass + decision stable → add serve pressure and competitive scoring.',
    },
    {
      fromDrillId: 'd07',
      toDrillId: 'd05',
      direction: 'regression',
      description: 'If decision-making degrades passing, strip back to solo accuracy work.',
    },
  ],
}

const chain3: ProgressionChain = {
  id: 'chain-3-movement',
  name: 'Movement Patterns in Sand',
  focus: 'Passing while moving: shuffle mechanics, lateral control, depth variation.',
  drillIds: ['d09', 'd10', 'd11', 'd12', 'd13', 'd14'],
  defaultGatingThreshold: 0.7,
  links: [
    {
      fromDrillId: 'd09',
      toDrillId: 'd10',
      direction: 'progression',
      gatingCriteria: '2 laps with ≤ 3 errors in d09',
      description: 'Basic shuffle passing → add 6-position footwork with platform angling.',
    },
    {
      fromDrillId: 'd10',
      toDrillId: 'd11',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes graded 2+ in d10',
      description: 'Multi-direction passing reliable → add one-arm emergency control.',
    },
    {
      fromDrillId: 'd11',
      toDrillId: 'd12',
      direction: 'progression',
      gatingCriteria: '8/10 controlled passes each side in d11',
      description: 'Emergency control established → add in/retreat U-pattern.',
    },
    {
      fromDrillId: 'd12',
      toDrillId: 'd13',
      direction: 'progression',
      gatingCriteria: '≥ 70% contacts 2+ in d12',
      description: 'U-pattern stable → add W-pattern cone weave.',
    },
    {
      fromDrillId: 'd13',
      toDrillId: 'd14',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes 2+ across 2 rounds in d13',
      description: 'Cone weave reliable → add 3-person high-rep switching.',
    },
    {
      fromDrillId: 'd12',
      toDrillId: 'd10',
      direction: 'regression',
      description: 'If net-based movement breaks quality, return to simpler footwork drill.',
    },
  ],
}

const chain4: ProgressionChain = {
  id: 'chain-4-serve-receive',
  name: 'Serve-Receive Variability and Pressure',
  focus: 'Short/deep reads, serve pressure, fatigue-aware caps.',
  drillIds: ['d15', 'd16', 'd17', 'd18'],
  defaultGatingThreshold: 0.7,
  links: [
    {
      fromDrillId: 'd15',
      toDrillId: 'd16',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes graded 2+ on 20 balls in d15',
      description: 'Short/deep read established → add 4-point diamond pattern with fatigue cap.',
    },
    {
      fromDrillId: 'd16',
      toDrillId: 'd17',
      direction: 'lateral',
      description:
        'Diamond passing + seam responsibility drill. Can run in parallel, not strictly sequential.',
    },
    {
      fromDrillId: 'd15',
      toDrillId: 'd18',
      direction: 'progression',
      gatingCriteria: '≥ 70% passes graded 2+ in d15',
      description: 'Serve-receive reads reliable → add competitive serve-and-pass ladder.',
    },
    {
      fromDrillId: 'd18',
      toDrillId: 'd15',
      direction: 'regression',
      description: 'If ladder pressure breaks quality, return to controlled short/deep work.',
    },
  ],
}

const chain5: ProgressionChain = {
  id: 'chain-5-group-addons',
  name: 'Session Credibility Add-ons',
  focus: 'Group warm-ups, multi-skill games, engagement. Requires 3+ players.',
  drillIds: ['d19', 'd20', 'd21'],
  defaultGatingThreshold: 0.7,
  links: [
    {
      fromDrillId: 'd19',
      toDrillId: 'd20',
      direction: 'progression',
      gatingCriteria: '20 controlled passes completed in d19',
      description: 'Warm-up rotation smooth → add 3-ball serve-pass-attack sequence.',
    },
    {
      fromDrillId: 'd19',
      toDrillId: 'd21',
      direction: 'lateral',
      description: 'Alternative engagement: scoring game instead of structured multi-ball.',
    },
  ],
}

const chain6: ProgressionChain = {
  id: 'chain-6-serving',
  name: 'Serving as the Enabling Skill',
  focus: 'Serve consistency, zone targeting, transition movement, and wall fallback.',
  drillIds: ['d22', 'd23'],
  defaultGatingThreshold: 0.7,
  links: [
    {
      fromDrillId: 'd22',
      toDrillId: 'd23',
      direction: 'progression',
      gatingCriteria: 'Reach 10 points with acceptable error count in d22',
      description: 'Zone accuracy established → add serve-and-dash transition conditioning.',
    },
  ],
}

// Tier 1a Unit 2: minimum probe - 3 rungs, no progression links. Tier 1b
// adds links when dogfood surfaces which pairs actually chain. Bump Set
// and Hand Set are intentionally both default-unlocked as fundamentals,
// per BAB Beginner's Guide Lesson 2. See
// docs/plans/2026-04-20-m001-tier1-implementation.md Unit 2.
const chain7: ProgressionChain = {
  id: 'chain-7-setting',
  name: 'Setting Fundamentals',
  focus: 'Bump-set shape, hand-set contact, partner rhythm. Minimum setting probe for Tier 1a.',
  drillIds: ['d38', 'd39', 'd41'],
  defaultGatingThreshold: 0.7,
  // No forward progression links. No regression links. Tier 1b authors
  // these once founder / partner data shows which pairs actually chain.
  links: [],
}

// chainCooldown is the Downshift chain (D105). Framed as transition/comfort, not
// recovery or injury prevention. Stretching is optional and sits inside the
// Downshift block rather than claiming recovery benefit.
const chainCooldown: ProgressionChain = {
  id: 'chain-cooldown',
  name: 'Downshift',
  focus: 'Post-session transition and comfort (D105). Mandatory block; cannot be removed.',
  drillIds: ['d25', 'd26'],
  defaultGatingThreshold: 1.0,
  links: [
    {
      fromDrillId: 'd25',
      toDrillId: 'd26',
      direction: 'progression',
      description:
        'Downshift walk → add optional light stretching. Both fit inside the 2–3 minute wrap block.',
    },
  ],
}

export const PROGRESSION_CHAINS: readonly ProgressionChain[] = [
  chain1,
  chain2,
  chain3,
  chain4,
  chain5,
  chain6,
  chain7,
  chainCooldown,
] as const
