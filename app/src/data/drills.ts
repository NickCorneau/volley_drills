/**
 * Seed drill catalog - drills organized into progression chains.
 *
 * Source: research-output/drill-library-content-structure.md
 * Schema: app/src/types/drill.ts
 *
 * M001 minimum set (Tier 1a): d01, d03, d05, d09, d10, d11, d15, d18, d22,
 * d25, d26 (the pre-Tier-1a core), plus d28 (warmup) and d38/d39/d41
 * (setting probe, Swap-only). Full pack ships post-validation (D81).
 * Reserve drill verdicts: docs/reviews/2026-04-28-m001-candidate-false-audit.md.
 *
 * Content status: needs expert coach review before treating as canonical
 * (set-window geometry, progression dosing, technique cue legality, heat
 * triggers). See docs/research/beach-training-resources.md.
 *
 * Vocabulary (Tier 1a Unit 3): drill copy uses BAB 2024 course
 * vocabulary. Specialised terms get an inline parenthetical brief
 * definition on first occurrence per drill (e.g. "Free Ball (easy
 * arcing ball, pass-to-set ready)", "Down Ball (flat ball from a
 * non-spiker)"). "toss" (not "throw") is the feed action; "spike"
 * names the hard-hit technique, "attack" names the phase
 * (serve → set → attack). Full glossary + source provenance:
 * docs/research/bab-source-material.md. Drill `name` and `shortName`
 * are stable identifiers (seen in founder sessions and in Dexie
 * ExecutionLog.plan.blocks[].drillName) and are never renamed by this
 * sweep.
 *
 * `skillFocus` authoring: add secondary tags only for skills the drill
 * materially trains, not for incidental feeds or future progressions.
 * Example: `d18` is pass + serve because both server pressure and passing
 * outcomes are part of the scored problem; `d15` remains pass + movement
 * because the server/coach feed exists to train the receiver's read.
 */

import type { Drill } from '../types/drill'

// ---------------------------------------------------------------------------
// Helpers for concise flag objects
// ---------------------------------------------------------------------------

const env = (
  overrides: Partial<{
    needsNet: boolean
    needsWall: boolean
    needsLines: boolean
    needsCones: boolean
    lowScreenTime: boolean
  }> = {},
) => ({
  needsNet: false,
  needsWall: false,
  needsLines: false,
  needsCones: false,
  lowScreenTime: false,
  ...overrides,
})

// ---------------------------------------------------------------------------
// Chain 1: Platform quality and posture → stable contact
// ---------------------------------------------------------------------------

const d01: Drill = {
  id: 'd01',
  name: 'Pass & Slap Hands',
  shortName: 'Slap Hands',
  skillFocus: ['pass'],
  objective: 'Platform consistency; arms apart while moving; clean contact.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-1-platform',
  m001Candidate: true,
  teachingPoints: [
    'Athletic posture throughout.',
    'Contact between wrists and elbows.',
    'Keep space between body and platform.',
    'Bend knees to keep platform stable.',
  ],
  progressionDescription: 'Add lateral shuffle 1–2 steps between contacts.',
  regressionDescription: 'Reduce height; allow 1 catch-reset every 5 reps.',
  variants: [
    {
      id: 'd01-solo',
      drillId: 'd01',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 2,
        durationMaxMinutes: 5,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxReps: 40, maxMinutes: 5 },
      },
      successMetric: {
        type: 'streak',
        description: 'Clean contacts in a row (restart on obvious mishit).',
        target: '≥ 20 consecutive clean contacts',
      },
      courtsideInstructions:
        'Pass up to yourself off your own toss. Between each contact, clap behind your back, then rebuild your platform. Mix low, medium, and high arcs.',
      coachingCues: [
        'Athletic posture.',
        'Contact between wrists and elbows.',
        'Keep space between body and platform.',
        'Bend knees to keep platform stable.',
      ],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair variant: partner tosses an
    // arc to the passer; passer forearm-passes back, claps behind the
    // back while partner catches, then resets. Streak metric mirrors
    // the solo variant so progression reads as one drill across modes.
    {
      id: 'd01-pair',
      drillId: 'd01',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'passer'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 3,
        durationMaxMinutes: 6,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxReps: 40, maxMinutes: 6 },
      },
      successMetric: {
        type: 'streak',
        description:
          'Clean passes in a row before a mishit or a missed slap (restart on either).',
        target: '≥ 15 consecutive clean passes',
      },
      courtsideInstructions:
        'Forearm-pass back to your partner with a clap reset. Stand 3 m apart; tosser sends an easy arc to the passer; passer forearm-passes back at catchable height, then claps behind the back while the tosser catches. Reset and repeat. Switch roles after every 10 reps or every miss.',
      coachingCues: [
        'Athletic posture.',
        'Contact between wrists and elbows.',
        'Pass back to your partner, not past them.',
        'Bend knees to keep platform stable.',
      ],
    },
  ],
}

const d02: Drill = {
  id: 'd02',
  name: 'Towel Posture Passing',
  shortName: 'Towel Passing',
  skillFocus: ['pass'],
  objective: 'Rounded shoulder posture; stable platform angle.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-1-platform',
  m001Candidate: false,
  teachingPoints: [
    'Ribs tucked - do not over-arch.',
    'Platform angle is the crucial part.',
    'Shoulders oriented to target.',
  ],
  progressionDescription: 'Tosses become faster/flatter; receiver starts from deeper position.',
  regressionDescription: 'Easier, higher tosses; shorter distance.',
  variants: [
    {
      id: 'd02-pair',
      drillId: 'd02',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['passer', 'tosser'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, towel: true, markers: true },
      workload: {
        durationMinMinutes: 3,
        durationMaxMinutes: 6,
        rpeMin: 3,
        rpeMax: 4,
        fatigueCap: { maxReps: 20, maxMinutes: 6 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ over 20 tosses.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Receiver places towel across neck/upper back. Partner tosses left/right. Receiver passes to the set window (where the setter would stand, ~3 m off the net) without dropping towel.',
      coachingCues: [
        'Ribs tucked - do not over-arch.',
        'Platform angle is the crucial part.',
        'Shoulders oriented to target.',
      ],
    },
  ],
}

const d03: Drill = {
  id: 'd03',
  name: 'Continuous Passing',
  shortName: 'Continuous Pass',
  skillFocus: ['pass'],
  objective: 'Pure platform mechanics; straight arms; repeatability.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-1-platform',
  m001Candidate: true,
  teachingPoints: [
    'Arms straight throughout.',
    'Shoulder shrug assist.',
    'Pass high enough to be settable.',
    'Abs tucked.',
  ],
  progressionDescription: 'Increase toss speed; add 1-step movement every rep.',
  regressionDescription: 'Shorter distance; allow receiver to "freeze" before contact.',
  variants: [
    {
      id: 'd03-pair',
      drillId: 'd03',
      label: 'Pair (kneel → stand)',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['passer', 'tosser'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 3,
        rpeMax: 4,
        fatigueCap: { maxReps: 40, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes catchable by tosser or graded 2+.',
        target: '20/20 or ≥ 70% graded 2+',
      },
      courtsideInstructions:
        'Pass back to your partner from a kneel, then stand. Start kneeling; partner tosses; receiver passes back 10 reps. Then stand in serve-receive stance and repeat.',
      coachingCues: [
        'Arms straight.',
        'Shoulder shrug assist.',
        'Pass high enough to be settable.',
        'Abs tucked.',
      ],
    },
  ],
}

const d04: Drill = {
  id: 'd04',
  name: 'Catch Your Own Pass',
  shortName: 'Catch Own Pass',
  skillFocus: ['pass'],
  objective: 'Passing "smaller/closer" on beach; settable trajectory.',
  levelMin: 'beginner',
  levelMax: 'beginner',
  chainId: 'chain-1-platform',
  m001Candidate: false,
  teachingPoints: [
    'Move to pass in centerline.',
    'Target forward and slightly inward.',
    'Keep pass lower/closer than indoor.',
  ],
  progressionDescription: 'Transition from toss → controlled serve → live serve.',
  regressionDescription: 'Use underhand toss from closer distance.',
  variants: [
    {
      id: 'd04-pair',
      drillId: 'd04',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['passer', 'feeder'] },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 3, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 4,
        rpeMax: 5,
        fatigueCap: { maxReps: 20, maxMinutes: 7 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ out of 10.',
        target: '≥ 7/10',
      },
      courtsideInstructions:
        'Feeder serves or tosses across. Passer passes up/down to the set window (where the setter would stand, ~3 m off the net), then catches their own pass (or partner catches).',
      coachingCues: [
        'Move to pass in centerline.',
        'Target forward and slightly inward.',
        'Keep pass lower/closer than indoor.',
      ],
    },
    {
      id: 'd04-solo',
      drillId: 'd04',
      label: 'Solo (self-feed)',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 4,
        rpeMax: 5,
        fatigueCap: { maxReps: 20, maxMinutes: 7 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ out of 10.',
        target: '≥ 7/10',
      },
      courtsideInstructions:
        'Self-toss across the net. Pass up/down to the set window (where the setter would stand, ~3 m off the net) and catch your own pass. Retrieve and repeat.',
      coachingCues: [
        'Move to pass in centerline.',
        'Target forward and slightly inward.',
        'Keep pass lower/closer than indoor.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 2: Directional control and angle management
// ---------------------------------------------------------------------------

const d05: Drill = {
  id: 'd05',
  name: 'Self-Toss Pass to Set Window',
  shortName: 'Set Window Pass',
  skillFocus: ['pass'],
  objective:
    'Directional control; settable pass shape for beach. Honesty clause: trains platform + direction, not serve-reading.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-2-direction',
  m001Candidate: true,
  teachingPoints: [
    'Get behind ball horizontally.',
    'Brake-step before contact.',
    'Platform angle drives direction.',
    'Transfer weight to front foot.',
  ],
  progressionDescription: 'Toss to left/right so you must move behind the ball.',
  regressionDescription: 'Larger target zone; allow 1 catch-reset every 3 reps.',
  variants: [
    {
      id: 'd05-solo',
      drillId: 'd05',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 6,
        fatigueCap: { maxReps: 40, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ on 0–3 rubric.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Pass into your set window off a self-toss. Place a marker at the set window (where the setter would stand, ~3 m off the net). Self-toss slightly in front; pass to land within that zone; retrieve quickly and repeat. Use 20 total reps.',
      coachingCues: [
        'Get behind ball horizontally.',
        'Brake-step.',
        'Platform angle drives direction.',
        'Transfer weight to front foot.',
      ],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair variant: partner stands at
    // the set window and the passer passes *to* the partner instead of
    // to a marker. Adds the missing reactive element the solo variant
    // calls out in its honesty clause ("trains platform + direction,
    // not serve-reading"). Pair RPE is one notch higher than solo
    // because partner-toss timing forces footwork the self-toss can
    // game.
    {
      id: 'd05-pair',
      drillId: 'd05',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'passer'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxReps: 40, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ on 0–3 rubric, partner-reachable without a step.',
        target: '≥ 70% over 20 partner tosses',
      },
      courtsideInstructions:
        'Pass back to your partner at the set window. Partner stands at the set window (where the setter would stand, ~3 m off the net) and tosses an arc 2–3 m in front of the passer. Passer passes back so partner catches without moving more than one step. Switch roles after 20 tosses.',
      coachingCues: [
        'Get behind ball horizontally.',
        'Brake-step.',
        'Pass to your partner, not past them.',
        'Transfer weight to front foot.',
      ],
    },
  ],
}

const d06: Drill = {
  id: 'd06',
  name: 'Pass & Slap Hands with Target',
  shortName: 'Slap + Target',
  skillFocus: ['pass'],
  objective: 'Maintain platform shape while aiming at set window.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-2-direction',
  m001Candidate: false,
  teachingPoints: [
    'Platform set early.',
    'Keep arms relatively parallel to ground for accuracy.',
    'Space between body and ball.',
  ],
  progressionDescription: 'Add shuffle between contacts.',
  regressionDescription: 'Reduce movement; grade only "in zone / out of zone".',
  variants: [
    {
      id: 'd06-solo',
      drillId: 'd06',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 3,
        durationMaxMinutes: 6,
        rpeMin: 4,
        rpeMax: 5,
        fatigueCap: { maxReps: 20, maxMinutes: 6 },
      },
      successMetric: {
        type: 'pass-grade-avg',
        description: 'Average pass grade across 20 contacts.',
        target: '≥ 2.0 average',
      },
      courtsideInstructions:
        'Run D01 (Pass & Slap Hands) but now score each contact as 0–3 based on proximity/trajectory to your set window (where the setter would stand, ~3 m off the net).',
      coachingCues: [
        'Platform set early.',
        'Arms parallel to ground for accuracy.',
        'Space between body and ball.',
      ],
    },
  ],
}

const d07: Drill = {
  id: 'd07',
  name: 'Pass & Look',
  shortName: 'Pass & Look',
  skillFocus: ['pass'],
  objective: 'Stabilize platform + immediately look and decide (proto-game read).',
  levelMin: 'intermediate',
  levelMax: 'advanced',
  chainId: 'chain-2-direction',
  m001Candidate: true,
  teachingPoints: [
    'Be stable during pass to buy time to look.',
    'Pass forward to keep vision.',
    'Do not drift under ball.',
  ],
  progressionDescription: 'Flash becomes court-zone target (line vs angle) after pass.',
  regressionDescription: 'Use toss instead of serve; reduce decision complexity.',
  variants: [
    {
      id: 'd07-pair',
      drillId: 'd07',
      label: 'Pair',
      feedType: 'live-serve',
      participants: {
        min: 2,
        ideal: 2,
        max: 3,
        roles: ['passer', 'server'],
      },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 3 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 5,
        rpeMax: 6,
        fatigueCap: { maxReps: 20, maxMinutes: 7 },
      },
      successMetric: {
        type: 'composite',
        description: 'Passes graded 2+ AND correct number call after pass.',
        target: '≥ 70% passes 2+ AND ≥ 80% correct calls',
      },
      courtsideInstructions:
        'Pass a served ball to the set window, then immediately look at partner/coach flashing 1-5 and call it before the next action.',
      coachingCues: [
        'Be stable during pass to buy time to look.',
        'Pass forward to keep vision.',
        'Do not drift under ball.',
      ],
    },
    {
      // FIVB Drill-book 3.15 Pass and Look, adapted for solo/no-net
      // readiness: the live reader is replaced with target cards so
      // the post-pass head-up action remains the scored behavior.
      id: 'd07-solo-open',
      drillId: 'd07',
      label: 'Solo open',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'composite',
        description: 'Passes graded 2+ AND correct target call after the pass.',
        target: '16 of 24 passes 2+ and 20 of 24 correct calls',
      },
      courtsideInstructions:
        'Pass to the set window from a self-toss, then immediately lift your eyes and call the nearest of four numbered targets before the ball lands.',
      coachingCues: [
        'Hold platform first; look after contact.',
        'Pass forward enough to keep vision.',
        'Call the target before you reset.',
      ],
    },
    {
      // Low-equipment two-player route for the same FIVB 3.15 behavior.
      // Partner flashes the read after contact; no net or extra balls are
      // required so pair-open and pair-net cells share the same variant.
      id: 'd07-pair-open',
      drillId: 'd07',
      label: 'Pair open',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['feeder', 'passer'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'composite',
        description: 'Passes graded 2+ AND correct flash call after the pass.',
        target: '16 of 24 passes 2+ and 20 of 24 correct calls',
      },
      courtsideInstructions:
        'Pass a partner toss or serve from 4-6 m away to the set window. Partner flashes 1-5 after contact; call the number before the next feed. Switch after 12 reps.',
      coachingCues: [
        'Be still through contact.',
        'Eyes up after the ball leaves your platform.',
        'Say the read before you admire the pass.',
      ],
    },
  ],
}

const d08: Drill = {
  id: 'd08',
  name: 'Plus Three / Minus Three',
  shortName: '+3 / −3',
  // 2026-05-01 tag audit: unlike live-serve drills where the server is
  // only a feeder, this one scores service errors and target pressure,
  // so the server has a real training job.
  skillFocus: ['pass', 'serve'],
  objective: 'Serve pressure + passing accuracy under stakes.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-2-direction',
  m001Candidate: false,
  teachingPoints: [
    'Aim pass off net enough to avoid trouble.',
    'Shoulders to target.',
    'Move feet to ball early.',
  ],
  progressionDescription: 'Server must target short/deep/line/seam (called).',
  regressionDescription: 'Use underhand serves or tosses.',
  variants: [
    {
      id: 'd08-trio',
      drillId: 'd08',
      label: '3-player',
      feedType: 'live-serve',
      participants: {
        min: 3,
        ideal: 3,
        max: 3,
        roles: ['server', 'passer', 'catcher'],
      },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 3, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 6,
        rpeMax: 8,
        fatigueCap: { maxSets: 4, maxMinutes: 10 },
      },
      successMetric: {
        type: 'points-to-target',
        description:
          'First to +3. Scoring: +1 catcher ≤ 1 step or service error; −1 bad pass or ace.',
        target: 'Win 2 rounds or pass average ≥ 2.0 across 15 serves',
      },
      courtsideInstructions:
        'Passer receives serve; catcher stands near the set window (where the setter would stand, ~3 m off the net). +1 if catcher moves ≤ 1 big step or service error; −1 for bad pass or ace. First to +3.',
      coachingCues: [
        'Aim pass off net enough to avoid trouble.',
        'Shoulders to target.',
        'Move feet to ball early.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 3: Movement patterns in sand → passing while moving
// ---------------------------------------------------------------------------

const d09: Drill = {
  id: 'd09',
  name: 'Passing Around the Lines',
  shortName: 'Around Lines',
  skillFocus: ['pass', 'movement'],
  objective: 'Sideways movement + controlled passing.',
  levelMin: 'beginner',
  levelMax: 'beginner',
  chainId: 'chain-3-movement',
  m001Candidate: true,
  teachingPoints: [
    'Wide base.',
    'Do not cross legs while shuffling.',
    'Communicate especially at corners.',
  ],
  progressionDescription: 'Only forearm passing (no hand sets).',
  regressionDescription: 'Walk the pattern; allow catch-reset on mishits.',
  variants: [
    {
      id: 'd09-pair',
      drillId: 'd09',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2 },
      environmentFlags: env({ needsLines: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 3,
        durationMaxMinutes: 6,
        rpeMin: 5,
        rpeMax: 6,
        fatigueCap: { maxMinutes: 6 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Complete laps without losing control.',
        target: '2 full laps with ≤ 3 errors',
      },
      courtsideInstructions:
        'Pass back and forth with your partner while shuffling along the sideline to the service line, across, and back. Keep the rally alive.',
      coachingCues: [
        'Wide base.',
        'Do not cross legs while shuffling.',
        'Communicate especially at corners.',
      ],
    },
  ],
}

const d10: Drill = {
  id: 'd10',
  name: 'The 6-Legged Monster',
  shortName: '6-Leg Monster',
  skillFocus: ['pass', 'movement'],
  objective: 'Shuffle mechanics + platform angling left/right + depth variation.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-3-movement',
  m001Candidate: true,
  teachingPoints: [
    'Point shoulders to target.',
    'Drop the shoulder nearest the ball and lift the far shoulder on wide passes.',
    'Ribs tucked.',
  ],
  progressionDescription: 'Faster/flatter tosses; add "short/deep" calls.',
  regressionDescription: 'Reduce depth extremes; fewer reps.',
  variants: [
    {
      id: 'd10-pair',
      drillId: 'd10',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: {
        min: 2,
        ideal: 2,
        max: 2,
        roles: ['passer', 'tosser'],
      },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 6,
        fatigueCap: { maxReps: 30, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ across 24 tosses.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Pass back to the set window from six spots in turn. Tosser at net (or 2 to 3 m away) feeds six tosses, one to each spot below. Receiver passes each back to the set window (where the setter would stand, about 3 m off the net): front-left, side-left, behind-left, front-right, side-right, behind-right.',
      coachingCues: [
        'Point shoulders to target.',
        'Drop near shoulder, lift far shoulder on wide passes.',
        'Ribs tucked.',
      ],
    },
  ],
}

const d11: Drill = {
  id: 'd11',
  name: 'One-Arm Passing Drill',
  shortName: 'One-Arm Pass',
  skillFocus: ['pass'],
  objective: 'Passing outside midline; emergency control; shoulder tilt.',
  levelMin: 'intermediate',
  levelMax: 'intermediate',
  chainId: 'chain-3-movement',
  m001Candidate: true,
  teachingPoints: [
    'Arm behind ball.',
    'Move through ball.',
    'Thumb up on arm closest to ball, down on opposite.',
  ],
  progressionDescription: 'Wider/faster toss; add 1-step approach after pass.',
  regressionDescription: 'Closer toss; allow two-arm pass sooner.',
  variants: [
    {
      id: 'd11-pair',
      drillId: 'd11',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: {
        min: 2,
        ideal: 2,
        max: 2,
        roles: ['passer', 'feeder'],
      },
      environmentFlags: env(),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 20, maxMinutes: 7 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Controlled passes each side graded 2+.',
        target: '8/10 each side',
      },
      courtsideInstructions:
        'Pass back using only your near arm (the one closer to the ball). Feeder tosses wide to the sideline; pass with the near arm, then with the far arm, then with both arms.',
      coachingCues: [
        'Arm behind ball.',
        'Move through ball.',
        'Thumb up on arm closest to ball, down on opposite.',
      ],
    },
    {
      id: 'd11-solo',
      drillId: 'd11',
      label: 'Solo (self-toss wide)',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 20, maxMinutes: 7 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Controlled passes each side graded 2+.',
        target: '8/10 each side',
      },
      courtsideInstructions:
        'Pass with only your near arm (the one closer to the ball). Self-toss wide to the left, then to the right; pass with the near arm each time, then with the far arm, then with both arms.',
      coachingCues: [
        'Arm behind ball.',
        'Move through ball.',
        'Thumb up on arm closest to ball, down on opposite.',
      ],
    },
  ],
}

const d12: Drill = {
  id: 'd12',
  name: 'U Passing Drill',
  shortName: 'U Pass',
  skillFocus: ['pass', 'movement'],
  objective: 'Move in, pass "up/down," retreat for approach readiness.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-3-movement',
  m001Candidate: false,
  teachingPoints: [
    'Outside leg forward.',
    'Arms close to perpendicular to net for quick retreat.',
    'Keep eyes toward net while moving.',
  ],
  progressionDescription: 'Tosses vary closer to antenna; add approach on final rep.',
  regressionDescription: 'Fewer reps (fatigue management).',
  variants: [
    {
      id: 'd12-pair',
      drillId: 'd12',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: {
        min: 2,
        ideal: 2,
        max: 2,
        roles: ['passer', 'feeder'],
      },
      environmentFlags: env({ needsNet: true, needsCones: true }),
      equipment: { balls: 1, cones: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 6,
        rpeMax: 7,
        fatigueCap: { maxReps: 12, maxMinutes: 7 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Contacts with up/down control graded 2+.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Pass straight up/down between cone moves. Feeder at net tosses ~3 m up. Passer starts back at cone, moves in, passes to the target area, retreats around the cone, and repeats (6–12 contacts).',
      coachingCues: [
        'Outside leg forward.',
        'Arms close to perpendicular to net for quick retreat.',
        'Keep eyes toward net while moving.',
      ],
    },
  ],
}

const d13: Drill = {
  id: 'd13',
  name: 'W Passing Drill',
  shortName: 'W Pass',
  skillFocus: ['pass', 'movement'],
  objective: 'Repeated in/out movement + stable platform under motion.',
  levelMin: 'intermediate',
  levelMax: 'intermediate',
  chainId: 'chain-3-movement',
  m001Candidate: false,
  teachingPoints: [
    'Outside leg forward at contact.',
    'Do not lose sight of the net.',
    'Keep platform tight.',
  ],
  progressionDescription: 'Faster tempo; feeder tosses wider.',
  regressionDescription: 'Reduce cones to 2; lower pace.',
  variants: [
    {
      id: 'd13-pair',
      drillId: 'd13',
      label: 'Pair+',
      feedType: 'partner-toss',
      participants: {
        min: 2,
        ideal: 2,
        max: 4,
        roles: ['passer', 'feeder'],
      },
      environmentFlags: env({ needsCones: true }),
      equipment: { balls: 1, cones: 3 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 6,
        rpeMax: 8,
        fatigueCap: { maxSets: 2, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ across 2 rounds.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Cones form a "W" path. Passer moves in/out between cones; feeder tosses; passer passes "up/down" and retreats. Spiking the final rep optional.',
      coachingCues: [
        'Outside leg forward at contact.',
        'Do not lose sight of the net.',
        'Keep platform tight.',
      ],
    },
  ],
}

const d14: Drill = {
  id: 'd14',
  name: 'Pass & Switch',
  shortName: 'Pass & Switch',
  skillFocus: ['pass', 'movement'],
  objective: 'High-rep passing with lateral/backward movement patterns.',
  levelMin: 'intermediate',
  levelMax: 'intermediate',
  chainId: 'chain-3-movement',
  m001Candidate: false,
  teachingPoints: [
    'Play ball in front.',
    'Wide base helps.',
    'Backward movement can narrow legs - watch it.',
  ],
  progressionDescription: 'Run across net; add short/deep variation.',
  regressionDescription: 'Reduce reps; slow feed.',
  variants: [
    {
      id: 'd14-trio',
      drillId: 'd14',
      label: '3-player',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 3, max: 3, roles: ['feeder', 'passer'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxSets: 2, maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: '2 sets × 12 reps graded 2+.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'One feeder passes to two passers who swap positions after each rep. Emphasize avoiding leg crossing sideways; 12–20 reps each direction.',
      coachingCues: [
        'Play ball in front.',
        'Wide base helps.',
        'Backward movement can narrow legs - watch it.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 4: Serve-receive variability → pressure → fatigue-aware caps
// ---------------------------------------------------------------------------

const d15: Drill = {
  id: 'd15',
  name: 'Short/Deep Serve-Receive Reaction',
  shortName: 'Short/Deep',
  skillFocus: ['pass', 'movement'],
  objective: 'Early read + forward/back movement patterns.',
  levelMin: 'intermediate',
  levelMax: 'intermediate',
  chainId: 'chain-4-serve-receive',
  m001Candidate: true,
  teachingPoints: [
    'Centered ready position enables quick forward/back.',
    "Read ball early - off the server's hand.",
    'Hands apart while moving.',
  ],
  progressionDescription: 'More random (mix all); faster serves.',
  regressionDescription: 'Coach tosses from midcourt if consistent serving is not possible.',
  variants: [
    {
      id: 'd15-pair',
      drillId: 'd15',
      label: 'Pair+',
      feedType: 'live-serve',
      participants: {
        min: 2,
        ideal: 3,
        max: 4,
        roles: ['server', 'passer', 'catcher'],
      },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 'many', markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 6,
        rpeMax: 8,
        fatigueCap: { maxReps: 20, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Passes graded 2+ on 20 balls.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Pass to the set window after reading short vs deep balls. Server/coach delivers short or deep balls; passer reads early, moves, and passes to the set window (where the setter would stand, ~3 m off the net).',
      coachingCues: [
        'Centered ready position enables quick forward/back.',
        "Read ball early - off the server's hand.",
        'Hands apart while moving.',
      ],
    },
  ],
}

const d16: Drill = {
  id: 'd16',
  name: 'Diamond Passing',
  shortName: 'Diamond Pass',
  skillFocus: ['pass', 'movement'],
  objective: 'Footwork + technique for short/deep/left/right with defined sequence.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-4-serve-receive',
  m001Candidate: false,
  teachingPoints: [
    'Do not cheat by moving early.',
    'On short balls, leg closer to sideline forward.',
    'Get back quickly so you pass while moving forward.',
  ],
  progressionDescription: 'Randomize locations; tougher serves.',
  regressionDescription: 'Replace serves with tosses; reduce to 1 set of 4.',
  variants: [
    {
      id: 'd16-pair',
      drillId: 'd16',
      label: 'Pair+',
      feedType: 'live-serve',
      participants: {
        min: 2,
        ideal: 3,
        max: 3,
        roles: ['server', 'passer', 'catcher'],
      },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 'many', markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 7,
        rpeMax: 8,
        fatigueCap: {
          maxSets: 2,
          maxReps: 8,
          restBetweenSetsSeconds: 60,
        },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'In each set of 4, passes graded 2+.',
        target: '≥ 3/4 per set',
      },
      courtsideInstructions:
        'Feeder serves/tosses balls in order to 4 locations. Passer must adjust target each time; do 2 sets of 4 then rest to protect technique.',
      coachingCues: [
        'Do not cheat by moving early.',
        'On short balls, leg closer to sideline forward.',
        'Get back quickly so you pass while moving forward.',
      ],
    },
  ],
}

// FIVB Drill-book 3.16 Topspin Serve Off Box Drill (advanced). The source
// route uses a box to create a heavy topspin serve. M001 readiness keeps the
// same advanced skill promise - read spin early and keep the pass usable -
// while replacing the box with low-equipment spin feeds.
const d46: Drill = {
  id: 'd46',
  name: 'Spin-Read Serve Receive',
  shortName: 'Spin Read',
  skillFocus: ['pass', 'movement'],
  objective: 'Read topspin/backspin early and keep the pass in the set window.',
  levelMin: 'advanced',
  levelMax: 'advanced',
  chainId: 'chain-4-serve-receive',
  m001Candidate: true,
  teachingPoints: [
    'Read the spin before the bounce or peak.',
    'Lower the platform for dropping topspin.',
    'Hold the angle through contact.',
  ],
  progressionDescription: 'Increase feed pace or call spin type late.',
  regressionDescription: 'Use slower partner tosses with obvious spin and a larger target window.',
  variants: [
    {
      id: 'd46-solo-open',
      drillId: 'd46',
      label: 'Solo open',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 6,
        rpeMax: 8,
        fatigueCap: { maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Spin-fed self tosses passed into a 1 m set window.',
        target: '16 of 24 passes land in the set window',
      },
      courtsideInstructions:
        'Pass a topspin or backspin self-toss into a marked 1 m set window. Let the ball travel away from you, then move and pass it into the window. Alternate spin every 4 reps.',
      coachingCues: [
        'Call the spin before you move.',
        'Beat the ball with your feet.',
        'Freeze the platform at contact.',
      ],
    },
    {
      id: 'd46-pair-open',
      drillId: 'd46',
      label: 'Pair open',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['feeder', 'passer'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 6,
        rpeMax: 8,
        fatigueCap: { maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Partner spin feeds passed into a 1 m set window.',
        target: '16 of 24 passes land in the set window',
      },
      courtsideInstructions:
        'Pass a partner-fed topspin or backspin ball from 4-6 m away into the marked set window. Call the spin, move early, and switch after 12 feeds.',
      coachingCues: [
        'Read spin from the hand.',
        'Move before the ball drops.',
        'Keep the finish quiet.',
      ],
    },
  ],
}

const d17: Drill = {
  id: 'd17',
  name: 'Non-Passer Move / Beat Ball to Pole',
  shortName: 'Beat to Pole',
  skillFocus: ['pass', 'movement'],
  objective:
    'Pass forward + partner initiates movement toward setting position; avoids collisions.',
  levelMin: 'beginner',
  levelMax: 'beginner',
  chainId: 'chain-4-serve-receive',
  m001Candidate: false,
  teachingPoints: [
    'Move forward so pass goes forward.',
    'Anticipate early if in your zone.',
    'Non-passer initiates movement quickly.',
  ],
  progressionDescription: 'Serve faster/lower to reduce decision time.',
  regressionDescription: 'Use tosses; exaggerate spacing.',
  variants: [
    {
      id: 'd17-pair',
      drillId: 'd17',
      label: 'Pair+',
      feedType: 'live-serve',
      participants: { min: 2, ideal: 3, max: 3, roles: ['server', 'passer'] },
      environmentFlags: env({ needsNet: true, needsCones: true }),
      equipment: { balls: 1, cones: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 7,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 12, maxMinutes: 7 },
      },
      successMetric: {
        type: 'composite',
        description: 'No collision/hesitation errors AND passes graded 2+.',
        target: '0 collisions across 12 reps; ≥ 70% pass grade 2+',
      },
      courtsideInstructions:
        'Deep serves/tosses; passer passes forward; non-passer must move quickly toward setting position marker (or touch a pole/cone) after recognizing it is not their ball.',
      coachingCues: [
        'Move forward so pass goes forward.',
        'Anticipate early if in your zone.',
        'Non-passer initiates movement quickly.',
      ],
    },
  ],
}

const d18: Drill = {
  id: 'd18',
  name: 'Serve & Pass Ladder',
  shortName: 'S&P Ladder',
  skillFocus: ['pass', 'serve'],
  objective: 'Serve pressure + measurable passing outcomes.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-4-serve-receive',
  m001Candidate: true,
  teachingPoints: [
    'Play/let-go discipline matters.',
    'Pass forward and slightly inward.',
    'Keep pass between you and partner.',
  ],
  progressionDescription: 'Server targets seams/short/deep; passer starts deeper.',
  regressionDescription: 'Underhand serves; smaller dose (6 serves each).',
  variants: [
    {
      id: 'd18-pair',
      drillId: 'd18',
      label: 'Pair',
      feedType: 'live-serve',
      participants: {
        min: 2,
        ideal: 2,
        max: 2,
        roles: ['server', 'passer'],
      },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 5, markers: true },
      workload: {
        durationMinMinutes: 8,
        durationMaxMinutes: 12,
        rpeMin: 6,
        rpeMax: 7,
        fatigueCap: { maxReps: 20, maxMinutes: 12 },
      },
      successMetric: {
        type: 'pass-grade-avg',
        description: 'Pass average across 10 serves OR good-pass rate.',
        target: '≥ 2.0 average or 7/10 graded 2+',
      },
      courtsideInstructions:
        'Pass and grade your own serve-receive 0–3. Server gives 10 serves; passer grades each (0–3) by how close the pass lands to the set window (where the setter would stand, ~3 m off the net). Switch roles. Keep a "best streak of 2+" and "average pass grade."',
      coachingCues: [
        'Play/let-go discipline matters.',
        'Pass forward and slightly inward.',
        'Keep pass between you and partner.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 5: Session credibility add-ons + multi-skill motivation
// ---------------------------------------------------------------------------

const d19: Drill = {
  id: 'd19',
  name: 'Butterfly Toss-Pass-Catch',
  shortName: 'Butterfly',
  skillFocus: ['pass'],
  objective: 'Warm-up passing reps; simple rotation; controlled inputs.',
  levelMin: 'beginner',
  levelMax: 'beginner',
  chainId: 'chain-5-group-addons',
  m001Candidate: false,
  teachingPoints: ['Controlled toss/serve down the line.', 'Keep rhythm.', 'Do not rush rotation.'],
  progressionDescription: 'Add live setter/hitter; add live serve.',
  regressionDescription: 'Smaller groups; passer can catch then set their pass.',
  variants: [
    {
      id: 'd19-group',
      drillId: 'd19',
      label: 'Group',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 6, max: 14 },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 3 },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Group completes 20 controlled passes before live-serve progression.',
        target: '20 controlled passes',
      },
      courtsideInstructions:
        'Tosser tosses to passer; passer passes to target; target catches; rotate through spots. After 20 passes, progress to live serve.',
      coachingCues: [
        'Controlled toss/serve down the line.',
        'Keep rhythm.',
        'Do not rush rotation.',
      ],
    },
  ],
}

const d20: Drill = {
  id: 'd20',
  name: '3 Serve Pass to Attack',
  shortName: '3-Ball Attack',
  skillFocus: ['pass', 'set'],
  objective: 'Pass → set → attack continuity; rhythm under repeated entries.',
  levelMin: 'intermediate',
  levelMax: 'intermediate',
  chainId: 'chain-5-group-addons',
  m001Candidate: false,
  teachingPoints: [
    'Keep passer rhythm.',
    'Initiate next ball quickly after catch.',
    'Target awareness for safety.',
  ],
  progressionDescription: 'Tougher serves; reduce catch/stop, more live play.',
  regressionDescription: 'Toss instead of serve; simplify to pass-set-catch.',
  variants: [
    {
      id: 'd20-group',
      drillId: 'd20',
      label: 'Group',
      feedType: 'live-serve',
      participants: { min: 4, ideal: 6, max: 8 },
      environmentFlags: env({ needsNet: true }),
      equipment: { balls: 'many' },
      workload: {
        durationMinMinutes: 8,
        durationMaxMinutes: 12,
        rpeMin: 7,
        rpeMax: 9,
        fatigueCap: { maxMinutes: 12 },
      },
      successMetric: {
        type: 'composite',
        description: 'Serve receives graded 2+ AND rally completion on live balls.',
        target: '≥ 70% receives 2+ over 15 serves AND ≥ 5 live rallies',
      },
      courtsideInstructions:
        'Sequence of 3 balls initiated by serve to passer; setters rotate; target catches/feeds next; 3rd ball becomes live to play out.',
      coachingCues: [
        'Keep passer rhythm.',
        'Initiate next ball quickly after catch.',
        'Target awareness for safety.',
      ],
    },
  ],
}

const d21: Drill = {
  id: 'd21',
  name: '500',
  shortName: '500 Game',
  skillFocus: ['pass', 'set'],
  objective: 'Ball control with self-scoring; reading/anticipation; engagement.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-5-group-addons',
  m001Candidate: false,
  teachingPoints: ['Tabletop passing.', 'Defined apex on every contact.', 'Square hips to target.'],
  progressionDescription: '"Hit to specific target" bonus points (back corners).',
  regressionDescription: 'Reduce goal to 250; allow catch on second contact.',
  variants: [
    {
      id: 'd21-group',
      drillId: 'd21',
      label: 'Group',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 4, max: 8 },
      environmentFlags: env(),
      equipment: { balls: 3 },
      workload: {
        durationMinMinutes: 8,
        durationMaxMinutes: 15,
        rpeMin: 6,
        rpeMax: 7,
        fatigueCap: { maxMinutes: 15 },
      },
      successMetric: {
        type: 'points-to-target',
        description: 'Pass-only = 25 pts, pass+set = 50, pass+set+attack = 100. Race to 500.',
        target: 'Reach 500 within cap time or improve vs last session',
      },
      courtsideInstructions:
        'Tosser initiates with a Skyball (high lob), Free Ball (easy arcing ball, pass-to-set ready), or Down Ball (flat ball from a non-spiker). Points: pass-only (25), pass+set (50), pass+set+attack (100). Race to 500.',
      coachingCues: [
        'Tabletop passing.',
        'Defined apex on every contact.',
        'Square hips to target.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 6: Serving (because serve-receive needs serves)
// ---------------------------------------------------------------------------

const d22: Drill = {
  id: 'd22',
  name: 'First to 10 Serving',
  shortName: 'First to 10',
  skillFocus: ['serve'],
  objective: 'Serving consistency + serving to zones.',
  // Focus-readiness batch 2 (2026-04-30): align level band to
  // FIVB 2.6 First to 10 Serving Drill (`intermediate / advanced`),
  // recorded in docs/reviews/2026-04-22-drill-level-audit.md.
  levelMin: 'intermediate',
  levelMax: 'advanced',
  chainId: 'chain-6-serving',
  m001Candidate: true,
  teachingPoints: [
    'Develop a serving routine.',
    'Consistent hand contact.',
    'Adjust for wind movement.',
  ],
  progressionDescription: 'Jump serve to spots instead of standing serve.',
  regressionDescription: 'Bigger zones; count "in" serves only.',
  variants: [
    {
      // 2026-04-27 solo-vs-pair sweep: max tightened from 4 to 1 now
      // that d22-pair carries the two-player route. Prevents the
      // session builder from serving solo-voice copy to a pair
      // session.
      id: 'd22-solo',
      drillId: 'd22',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({
        needsNet: true,
        lowScreenTime: true,
      }),
      // Focus-readiness batch 2: one-ball cadence is slower but
      // playable, and keeps the drill inside the active M001 filter.
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 12,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxMinutes: 12 },
      },
      successMetric: {
        type: 'points-to-target',
        description: 'Assign point values to zones; serve out loses a point.',
        target: 'Reach 10 points with ≤ X errors (level-dependent)',
      },
      courtsideInstructions:
        'Serve to earn 10 points across self-assigned zones. Assign point values to zones; each serve in scores those points; a serve out loses a point. Adjust zone values for your level or objective.',
      coachingCues: [
        'Develop a serving routine.',
        'Consistent hand contact.',
        'Adjust for wind movement.',
      ],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair variant runs as a
    // race-to-10: partners alternate serves, each scoring on their
    // own zone hits, first to 10 wins. Adds an explicit competitive
    // frame that the solo variant cannot — a solo target is a wall;
    // a partner target is a person.
    {
      id: 'd22-pair',
      drillId: 'd22',
      label: 'Pair',
      feedType: 'self-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['server', 'server'] },
      environmentFlags: env({
        needsNet: true,
        lowScreenTime: true,
      }),
      // Focus-readiness batch 2: one shared ball is enough for
      // alternating score reps; partner hands/shags between attempts.
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 12,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxMinutes: 12 },
      },
      successMetric: {
        type: 'points-to-target',
        description:
          'Race to 10 points: each partner scores their own zone hits; serve out loses a point.',
        target: 'First partner to 10 wins',
      },
      courtsideInstructions:
        'Serve to earn points across shared zones, alternating with your partner. Mark the same zone values for both partners. Alternate serves: each partner serves, scores their own result, then hands the next ball over. A serve out loses a point. First to 10 wins; play a second round if there is time.',
      coachingCues: [
        'Develop a serving routine.',
        'Consistent hand contact.',
        'Score honestly; this is your data, not your opponent\'s.',
      ],
    },
    // Focus-readiness batch 2: no-net solo adaptation of FIVB 2.6
    // First to 10. Targets become marked sand zones; scoring stays
    // the point of the drill, not net clearance.
    {
      id: 'd22-solo-open',
      drillId: 'd22',
      label: 'Solo open points',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 12,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxMinutes: 12 },
      },
      successMetric: {
        type: 'points-to-target',
        description: 'Serve-toss contact scores against the called sand target zone.',
        target: 'Reach 10 points with no more than 3 misses',
      },
      courtsideInstructions:
        'Serve to earn 10 points across marked sand targets. Assign point values to short, middle, and deep targets. Each contact landing in the called target scores those points; a miss loses 1 point. Reset routine before every attempt.',
      coachingCues: [
        'Name the point target.',
        'Consistent hand contact.',
        'Score honestly; this is your data.',
      ],
    },
    // Focus-readiness batch 2: no-net pair adaptation of FIVB 2.6.
    // Partner supplies the called target and score pressure while the
    // execution remains one-ball and target-only.
    {
      id: 'd22-pair-open',
      drillId: 'd22',
      label: 'Pair open points',
      feedType: 'self-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['server', 'caller'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 12,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxMinutes: 12 },
      },
      successMetric: {
        type: 'points-to-target',
        description: 'Serve-toss contact scores against the target zone called before the toss.',
        target: 'First partner to 10 points wins',
      },
      courtsideInstructions:
        'Serve to earn points across shared sand targets. Caller names the next target and point value before the toss. Server resets routine, contacts toward the target, scores the result, then hands the ball over. First partner to 10 wins.',
      coachingCues: [
        'Caller names the point target.',
        'Consistent hand contact.',
        'Score honestly; this is your data.',
      ],
    },
  ],
}

const d23: Drill = {
  id: 'd23',
  name: 'Serve & Dash',
  shortName: 'Serve & Dash',
  skillFocus: ['serve', 'conditioning'],
  objective: 'Serve routine + immediate movement to defensive base.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-6-serving',
  m001Candidate: false,
  teachingPoints: [
    'Full routine each serve.',
    'Watch ball while moving.',
    'Treat as a pressure rep.',
  ],
  progressionDescription: 'Alternate starting serve locations along end line.',
  regressionDescription: 'Reduce sprint distance; reduce total reps.',
  variants: [
    {
      id: 'd23-solo',
      drillId: 'd23',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ needsNet: true, lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 7,
        rpeMax: 9,
        fatigueCap: { maxReps: 10, maxMinutes: 8 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Serves "in" with consistent dash (no walking).',
        target: '10 serves in',
      },
      courtsideInstructions:
        'Serve. Immediately sprint to your chosen defensive base spot while watching the ball flight. Reset and repeat.',
      coachingCues: [
        'Full routine each serve.',
        'Watch ball while moving.',
        'Treat as a pressure rep.',
      ],
    },
  ],
}

// BAB Beginner's Guide, Serving Mission homework drill.
const d31: Drill = {
  id: 'd31',
  name: 'Self Toss Target Practice',
  shortName: 'Target Serve',
  skillFocus: ['serve'],
  objective: 'Build a repeatable serve toss and contact by aiming at one small landing target.',
  levelMin: 'beginner',
  levelMax: 'beginner',
  chainId: 'chain-6-serving',
  m001Candidate: true,
  teachingPoints: [
    'Pick one small target before every rep.',
    'Use the same toss height each time.',
    'Watch the ball land before judging the rep.',
  ],
  progressionDescription:
    'Shrink the target circle or move it deeper once 8 of 10 serves land nearby.',
  regressionDescription:
    'Move closer, make the target bigger, or count clean contact before accuracy.',
  variants: [
    {
      id: 'd31-solo-open',
      drillId: 'd31',
      label: 'Solo open target',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxReps: 20, maxMinutes: 8 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Serves or serve-toss contacts landing in or near a marked target circle.',
        target: '8 of 10 near the target',
      },
      courtsideInstructions:
        'Serve into a 2 m target circle. Mark the circle. Self-toss and serve toward it. Count only balls landing in or brushing the circle. Reset your routine before every rep.',
      coachingCues: ['One target before each serve.', 'Same toss height.', 'Watch the landing.'],
    },
    // Focus-readiness batch 1 (2026-04-30): no-net pair adaptation of
    // the BAB Serving Mission target drill. This deliberately trains
    // toss/contact/target commitment only - no net-clearance claim.
    {
      id: 'd31-pair-open',
      drillId: 'd31',
      label: 'Pair open target',
      feedType: 'self-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['server', 'caller'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxReps: 20, maxMinutes: 8 },
      },
      successMetric: {
        type: 'reps-successful',
        description:
          'Serve-toss contacts landing in or near the target circle called before the toss.',
        target: '8 of 10 near the called target',
      },
      courtsideInstructions:
        'Serve toward a partner-called 2 m target circle on open sand. Mark the circle. Caller names the target before the server tosses. Server resets routine, tosses, and contacts toward the called circle. Switch after 10 attempts.',
      coachingCues: [
        'Caller names the target first.',
        'Same toss height.',
        'Watch the landing before you reset.',
      ],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair variant: server serves to a
    // called zone; partner stands across the net, calls the next zone,
    // shags between rounds. Adds shaggable density (no walking the
    // court between every rep) and a verbal commitment cue ("call
    // before you toss") that solo cannot enforce.
    // 2026-04-27 solo-vs-pair sweep: equipment.balls = 1 (not 'many')
    // to match d31-solo-open and stay inside the engine's
    // unmodeled-requirements filter (`hasUnmodeledRequirements` in
    // sessionAssembly/candidates.ts excludes `balls === 'many'` and `balls > 1`,
    // pending D102 equipment-context resolution). Pair execution
    // still works with one ball: shagger throws it back between
    // serves.
    {
      id: 'd31-pair',
      drillId: 'd31',
      label: 'Pair',
      feedType: 'self-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['server', 'shagger'] },
      environmentFlags: env({ needsNet: true, lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxReps: 20, maxMinutes: 8 },
      },
      successMetric: {
        type: 'reps-successful',
        description:
          'Serves landing in or near the 2 m target circle named by the shagger before each toss.',
        target: '8 of 10 near the called target',
      },
      courtsideInstructions:
        'Serve toward a partner-called 2 m target circle. Mark the circle. Shagger stands across the net and calls the target out loud before the server tosses. Server resets routine, tosses, and serves toward the called circle. Shagger collects balls between rounds. Switch after 10 serves.',
      coachingCues: [
        'Call the target before you toss.',
        'Same toss height.',
        'Watch the landing before you reset.',
      ],
    },
  ],
}

// BAB Drill Book / Beginner's Guide - Around the World serving convention:
// 6 serving zones, not the 7-zone attacking version.
const d33: Drill = {
  id: 'd33',
  name: 'Around the World Serving',
  shortName: 'World Serve',
  skillFocus: ['serve'],
  objective: 'Serve to six court zones in order so accuracy expands beyond one favorite spot.',
  levelMin: 'beginner',
  // Focus-readiness batch 2: FIVB 2.5 Serving Variety is
  // intermediate/advanced while BAB places this family accessibly.
  // Keep the beginner entry and extend the ceiling for advanced
  // target-variety work.
  levelMax: 'advanced',
  chainId: 'chain-6-serving',
  m001Candidate: true,
  teachingPoints: [
    'Name the zone before you serve.',
    'Serve high and deep when targeting the back zones.',
    'Into-wind serves are more predictable than with-wind serves.',
  ],
  progressionDescription: 'Require two makes per zone, then shrink each zone.',
  regressionDescription: 'Use three large zones: left, middle, right.',
  variants: [
    // Focus-readiness batch 1 (2026-04-30): no-net adaptation of the
    // BAB six-zone Around the World serving convention. Zones become
    // sand target areas; this preserves target sequencing without
    // claiming net clearance.
    {
      id: 'd33-solo-open',
      drillId: 'd33',
      label: 'Solo open target ladder',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Serve-toss contact lands in the called sand target zone.',
        target: 'Hit all 6 target zones once',
      },
      courtsideInstructions:
        'Serve through six marked sand targets in order: short-left, short-middle, short-right, deep-left, deep-middle, deep-right. Misses repeat the same target. Keep the routine identical even without a net.',
      coachingCues: ['Name the target first.', 'Same toss and contact.', 'Reset after each miss.'],
    },
    // 2026-04-27 solo-vs-pair sweep: variant ID `d33-solo-net` is
    // preserved (no rename) so any persisted ExecutionLog row that
    // references it stays valid. Label, copy, and `participants.max`
    // change to make this a Solo-only variant; the inline "Pair: ..."
    // sentence moves to the new `d33-pair` sibling below. Em-dash in
    // the prior copy was already a `.cursor/rules/courtside-copy.mdc`
    // §Invariant 4 violation; rewriting now also fixes that.
    {
      id: 'd33-solo-net',
      drillId: 'd33',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({
        needsNet: true,
        lowScreenTime: true,
      }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 10 },
      },
      // 2026-04-27 V0B-28 surface-move: `description` re-worded from
      // the session-level zone enumeration to a per-attempt rule so it
      // reads correctly inside the V0B-28 forced-criterion prompt
      // rendered above the optional Good/Total counts on `/run/check`.
      // The 6-zone order and the "all 6 zones once" goal stay in
      // `target` and `courtsideInstructions` where they belong as the
      // session goal, not as the per-rep criterion. See
      // `docs/plans/2026-04-27-per-drill-success-criterion.md`.
      successMetric: {
        type: 'reps-successful',
        description: 'Serve lands in the called zone.',
        target: 'Hit all 6 zones once',
      },
      courtsideInstructions:
        'Serve through six zones in order: front-left, front-middle, front-right, back-left, back-middle, back-right. Misses repeat the same zone. Shag between rounds.',
      coachingCues: ['Name the zone first.', 'High arc for deep zones.', 'Reset after each miss.'],
    },
    // Focus-readiness batch 1 (2026-04-30): pair/no-net target ladder
    // from the same BAB six-zone serving convention. Caller/shagger
    // supplies commitment and cadence; the drill remains target-only.
    {
      id: 'd33-pair-open',
      drillId: 'd33',
      label: 'Pair open target ladder',
      feedType: 'self-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['server', 'caller'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Serve-toss contact lands in the target zone called before the toss.',
        target: 'Both partners hit all 6 target zones',
      },
      courtsideInstructions:
        'Serve through six marked sand targets in order: short-left, short-middle, short-right, deep-left, deep-middle, deep-right. Caller names the next target before the toss and shags after the round. Misses repeat the same target. Switch after one 6-target round.',
      coachingCues: [
        'Caller names the target first.',
        'Same toss and contact.',
        'Reset after each miss.',
      ],
    },
    // Pair sibling: round-based turn-taking, partner calls the zone
    // and shags. Same 6-zone ladder as the solo variant.
    {
      id: 'd33-pair',
      drillId: 'd33',
      label: 'Pair',
      feedType: 'self-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['server', 'shagger'] },
      environmentFlags: env({
        needsNet: true,
        lowScreenTime: true,
      }),
      // 2026-04-27 solo-vs-pair sweep: balls = 1 (not 'many') to stay
      // shippable. `hasUnmodeledRequirements` in sessionAssembly/candidates.ts
      // excludes `balls === 'many'` and `balls > 1` pending D102
      // equipment-context resolution. Pair cadence below is honest
      // about the one-ball reality: round-based switching (each
      // partner runs the full 6-zone ladder, then they switch) rather
      // than alternate-every-rep (which would require either a second
      // ball or a stop-go shag between every serve).
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 6,
        durationMaxMinutes: 10,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 10 },
      },
      // 2026-04-27 V0B-28 surface-move: per-attempt rule (see
      // `d33-solo-net` rationale comment above). The "both partners
      // hit all 6 zones" addendum was session-level and stays only in
      // `target`.
      successMetric: {
        type: 'reps-successful',
        description: 'Serve lands in the called zone.',
        target: 'Both partners hit all 6 zones',
      },
      // 2026-04-27 red-team adversarial finding: prior copy said
      // "Alternate servers each rep" AND "shag between rounds", which
      // can't both be true with `equipment.balls: 1`. Rewritten to
      // round-based turn-taking so the shagger has one shag per round
      // (each partner's full 6-zone pass), matching the solo variant's
      // "Shag between rounds." voice. Em-dashes replaced with periods
      // per `.cursor/rules/courtside-copy.mdc` §Invariant 4.
      courtsideInstructions:
        'Serve through the same 6-zone order as Solo, taking turns: front-left, front-middle, front-right, back-left, back-middle, back-right. Partner across the net calls the next zone before each serve and shags after the round. A miss repeats the same zone on the next attempt.',
      coachingCues: [
        'Caller names the zone first.',
        'High arc for deep zones.',
        'Reset after each miss.',
      ],
    },
  ],
}

const d24: Drill = {
  id: 'd24',
  name: 'Pass into a Corner',
  shortName: 'Corner Pass',
  skillFocus: ['pass'],
  objective: 'Move to ball + pass to a "setter" corner target. Off-court fallback.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-2-direction',
  m001Candidate: false,
  teachingPoints: [
    'Avoid training non-game-like habits.',
    'Aim for settable flight.',
    'Use movement, not arm-swinging.',
  ],
  progressionDescription: 'Harder rebounds and wider angles.',
  regressionDescription: 'Slower tosses; closer distance.',
  variants: [
    {
      id: 'd24-solo',
      drillId: 'd24',
      label: 'Solo (wall)',
      feedType: 'wall-rebound',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ needsWall: true, lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 10,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 15, maxMinutes: 10 },
      },
      successMetric: {
        type: 'pass-rate-good',
        description: 'Reps landing in target corner area.',
        target: '≥ 70%',
      },
      courtsideInstructions:
        'Toss the ball off the wall so it rebounds like a serve. Move and pass so the ball flies settable into a corner "target." Reset and repeat.',
      coachingCues: [
        'Avoid training non-game-like habits.',
        'Aim for settable flight.',
        'Use movement, not arm-swinging.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Downshift (post-session transition; not a recovery or injury-prevention claim)
// ---------------------------------------------------------------------------

// d25 is the Downshift block (D105). Framed as transition and comfort, not recovery
// or injury prevention - post-2015 active-cool-down literature does not support
// those claims at this dose. See docs/research/warmup-cooldown-minimum-protocols.md.
const d25: Drill = {
  id: 'd25',
  name: 'Downshift',
  shortName: 'Downshift',
  skillFocus: ['recovery'],
  objective:
    'Transition out of the session: slow the heart rate, unload the feet and hips, do a quick symptom/hydration check. Not an injury-prevention or recovery claim.',
  levelMin: 'beginner',
  levelMax: 'advanced',
  chainId: 'chain-cooldown',
  m001Candidate: true,
  teachingPoints: [
    'Slow down gradually; long exhale.',
    'Gentle tension only - do not crank any stretch.',
    'Skip any movement that hurts today.',
  ],
  progressionDescription: 'Add an extra 30–60 seconds of easy walking on very hot days.',
  regressionDescription: 'Easy walk only (60–90 seconds).',
  variants: [
    {
      // Timed sub-blocks: 60-90 s walk + ~30 s each for 3-4 stretch/recovery
      // segments. Copy is written in firing order. Pacing-audio infra (per-
      // segment beeps) not yet shipped - see partner walkthrough P2-2 in
      // docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
      // and the courtside-copy rule §Invariant 5.
      // 2026-04-27 solo-vs-pair sweep: label changed from 'Solo' to
      // 'Any'. The drill is a cooldown walk + stretch sequence —
      // partners do it side by side, no role asymmetry — so the
      // participants envelope is correctly broad (max 14) and the
      // 'Solo' label was a misnomer. Variant ID retained (`-solo`
      // suffix) for ExecutionLog migration safety.
      id: 'd25-solo',
      drillId: 'd25',
      label: 'Any',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 14 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 0 },
      // 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
      // U5): `durationMinMinutes` bumped from 2 to 3 so the segment
      // sum anchors honestly to the workload floor. Safe change
      // because every authored wrap slot in `archetypes.ts` already
      // requires `min ≥ 3` (wrap(3,4) on 15-min sessions, wrap(4,5)
      // on 25-min, wrap(4,6) on 40-min) — the over-permissive 2-min
      // floor was unreachable anyway.
      //
      // 2026-04-28 dogfeed iteration (each-side stretches): the hip
      // and shoulder stretch segments are unilateral — the user
      // splits the segment time between two sides. Bumping each from
      // 30 s to 60 s gives ~30 s per side (the standard stretch
      // hold). This raises the segment sum from 180 s to 240 s, so
      // `durationMinMinutes` lifts from 3 to 4. d25 now positions
      // as the longer-form unilateral cooldown; d26 stays the
      // compact 3-min option for tight wrap slots. The 15-min
      // wrap(3,4) slot still picks d25 when allocating 4 min and
      // falls back to d26 at 3 min. The `progressionDescription`
      // ("add 30–60 s of easy walking on hot days") still applies
      // within the 4–5 min envelope.
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 5,
        rpeMin: 1,
        rpeMax: 2,
      },
      successMetric: {
        type: 'completion',
        description: 'Completed (yes/no).',
        target: 'Completed',
      },
      // Founder test-run feedback 2026-04-21 (round 3): same wall-of-
      // paragraph problem as d26; reformatted to newline-separated
      // numbered items with colons, `whitespace-pre-line` rendered by
      // RunScreen + TransitionScreen. "60–90 s" flattened to "60 to
      // 90 s" to match the SafetyCheck voice. Build-17 F3 follow-up:
      // add the same 30 s pacing metadata as d26 so the active
      // recovery candidates no longer diverge on audible sub-block
      // support; the first two ticks can both belong to the walking
      // segment on a 3+ minute wrap.
      //
      // 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
      // U5): the prose numbered list is replaced by 5 structured
      // segments. The "shoulder stretch" line, previously labelled
      // `Optional`, is authored as a regular segment now; the
      // `progressionDescription` already covers "add 30–60 s of easy
      // walking on hot days" so no functionality is lost. The
      // "Hydrate and note any pain." footnote moves to
      // `courtsideInstructionsBonus` so RunScreen renders it only
      // when the wrap exceeds the segment sum (overflow / bonus
      // territory). `subBlockIntervalSeconds` retired here.
      //
      // 2026-04-28 dogfeed iteration (each-side stretches): hip
      // stretch (s3) and shoulder stretch (s5) are unilateral — the
      // user splits each 60 s segment between two sides (~30 s per
      // side). Marked with `eachSide: true`; SegmentList appends a
      // muted "(each side)" suffix on the label so the user knows
      // to switch. Sum raised to 240 s = 4 min; workload floor
      // bumped to 4 (see workload comment above).
      courtsideInstructions:
        'Walk first, then four short stretch holds. Gentle tension only; skip any move that hurts today.',
      courtsideInstructionsBonus: 'Hydrate and note any pain.',
      segments: [
        { id: 'd25-solo-s1', label: 'Walk with long exhales.', durationSec: 60 },
        {
          id: 'd25-solo-s2',
          label: 'Sit or lean to rest calves and feet.',
          durationSec: 30,
        },
        {
          id: 'd25-solo-s3',
          label: 'Hip stretch: cross one ankle over the opposite knee and lean forward.',
          durationSec: 60,
          eachSide: true,
        },
        {
          id: 'd25-solo-s4',
          label: 'Reach arms overhead with a gentle back-bend.',
          durationSec: 30,
        },
        {
          id: 'd25-solo-s5',
          label: 'Shoulder stretch: one arm across chest.',
          durationSec: 60,
          eachSide: true,
        },
      ],
      coachingCues: [
        'Long exhale, let heart rate come down.',
        'Gentle tension only.',
        'Hot session? Rehydrate before you leave.',
      ],
    },
  ],
}

const d26: Drill = {
  id: 'd26',
  name: 'Lower-body Stretch Micro-sequence',
  shortName: 'Stretch',
  skillFocus: ['recovery'],
  objective: 'Three lower-body staples post-sand session.',
  levelMin: 'beginner',
  levelMax: 'advanced',
  chainId: 'chain-cooldown',
  m001Candidate: true,
  teachingPoints: ['Breathe.', 'Avoid pain.', 'Hold steady.'],
  progressionDescription: 'When wrap runs 5+ minutes, add second sides, glutes, or adductors.',
  regressionDescription: 'Two moves only (calf + hamstring) if you are pressed for time.',
  variants: [
    {
      // 2026-04-22 copy pass: six 20 to 30 s segments read as ~6 to 12
      // minutes of work inside a wrap slot that is often only ~3 min
      // on the session clock. Courtside copy now lists three staples
      // sized for a short wrap (about 45 to 60 s each, one side at a
      // time; mirror or add moves if the block runs long). Keeps the
      // P2-2 sub-block pacing tick at 30 s so the beep still lands
      // during cool-down without implying six separate holds.
      //
      // 2026-04-26 jargon-gloss pass (founder-use ledger 2026-04-26
      // pair session reported `hip flexor`, `half-kneel`, `tuck
      // pelvis`, `hinge from the hips` as unparseable to a one-season
      // rec-player partner). Glossed inline per courtside-copy.mdc
      // invariants 2 (one-season rec player test) + 5 (cool-down
      // gets equal review weight). Structure (intro + 3 staples) and
      // 30 s sub-block tick unchanged.
      // 2026-04-27 solo-vs-pair sweep: label 'Solo' → 'Any'. Stretch
      // micro-sequence is run side-by-side regardless of party size;
      // see d25-solo comment for full rationale.
      // 2026-04-27 cca2 dogfeed F5 (`docs/research/2026-04-27-cca2-
      // dogfeed-findings.md`): the prior copy hard-coded `~3 min on
      // the timer` while the workload allows 3-6 min. Today's pair
      // session ran a 4-min wrap and the copy left a ~1.5 min "what
      // do I do?" gap. New copy honors the 3-6 min range honestly
      // (3 moves on one side as the floor; mirror, glutes, adductors
      // as the ceiling, matching `progressionDescription`). Three-
      // staple structure and 30 s sub-block tick unchanged. No
      // variant-id change; pure courtside-copy edit.
      id: 'd26-solo',
      drillId: 'd26',
      label: 'Any',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 14 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 0 },
      workload: {
        durationMinMinutes: 3,
        durationMaxMinutes: 6,
        rpeMin: 0,
        rpeMax: 1,
      },
      successMetric: {
        type: 'completion',
        description: 'Completed (yes/no).',
        target: 'Completed',
      },
      // Intro + three numbered lines; `whitespace-pre-line` on Run +
      // Transition preserves newlines. No em-dashes (dogfeed-polish
      // sweep). Timing voice matches short wrap slots on 15/25 min
      // archetypes while progressionDescription covers longer wraps.
      // Anatomy terms glossed inline (`back of thigh`, `front of
      // upper thigh`, `one knee on the ground, other foot in front`)
      // and movement cues stated in plain language (`tip your hips
      // back`, `squeeze the back-leg glute`).
      //
      // 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
      // U4): the prose numbered list is replaced by structured
      // `segments` (3 × 60 s = 180 s = workload.durationMinMinutes * 60).
      // Anatomy glosses, movement cues, and the 3-staple structure
      // are unchanged. `subBlockIntervalSeconds` retired here;
      // per-segment end beep replaces the uniform tick.
      //
      // 2026-04-28 dogfeed iterations:
      //  - intro dropped "about 60 s each" because Shorten rescales
      //    segments proportionally; the segment list is canonical for
      //    per-move timing. The "3 to 6 minutes on the timer" range
      //    stays — it sets honest expectations for wrap-slot variance.
      //  - each-side stretches: ALL three stretches are unilateral.
      //    Originally the design did one side within the 3-min floor
      //    and deferred the second side to bonus copy ("mirror to the
      //    other side"). User dogfeed flagged that a 3-min cooldown
      //    only stretching one side is incomplete. Now every segment
      //    is `eachSide: true` (~30 s per side within the 60 s
      //    segment time); the bonus copy drops the "mirror" clause
      //    because mirroring is built into the floor. Bonus is now
      //    purely accessory ("add glutes or adductors").
      courtsideInstructions:
        'Short wrap (3 to 6 minutes on the timer): three moves to start. No bouncing; firm tension, never sharp pain.',
      courtsideInstructionsBonus:
        'If time remains, add glutes (back of hips) or adductors (inner thighs).',
      segments: [
        {
          id: 'd26-solo-s1',
          label:
            'Calf: straight back leg, heel down, lean in; soften the back knee for the lower calf.',
          durationSec: 60,
          eachSide: true,
        },
        {
          id: 'd26-solo-s2',
          label:
            'Hamstring (back of thigh): front leg heel down, toes up; tip your hips back and lean your chest toward the front leg, back flat.',
          durationSec: 60,
          eachSide: true,
        },
        {
          id: 'd26-solo-s3',
          label:
            'Hip flexor (front of upper thigh): half-kneel (one knee on the ground, other foot in front), squeeze the back-leg glute, lean gently into the front leg.',
          durationSec: 60,
          eachSide: true,
        },
      ],
      coachingCues: ['Breathe.', 'Avoid pain.', 'Hold steady.'],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 7: Setting fundamentals (Tier 1b-A setting wave)
// ---------------------------------------------------------------------------
//
// d38, d39, and d40 are the default-unlocked fundamentals (Bump Set,
// Hand Set, Footwork) - they are not gated on each other. d41 is the
// pair entry (Partner Set Back-and-Forth); d42 (Corner to Corner)
// extends pair setting to named targets. d47/d48 are the FIVB-backed
// advanced readiness branch. d43 Triangle Setting and other 3-player
// BAB drills are deferred to D101 3+ player support rather than being
// forced into two-player adaptations.
//
// Swap-only reachability: archetypes.ts main_skill / pressure block
// skillTags stay at `['pass', 'serve']`, so default (non-Swap) session
// assembly preserves the single-focus-per-session invariant (archetype
// invariants header point 1). `SKILL_TAGS_BY_TYPE.main_skill` and
// `.pressure` in sessionAssembly/swapAlternatives.ts widen to include 'set' so
// user-initiated Swap can reach these drills.

// BAB Beginner's Guide, Lesson 2 - Bump Set tutorial.
const d38: Drill = {
  id: 'd38',
  name: 'Bump Set Fundamentals',
  shortName: 'Bump Set',
  skillFocus: ['set'],
  // 2026-04-27 solo-vs-pair sweep: objective rewritten pair-neutral
  // (was "off self-toss" which presumed solo execution). The two
  // variants below carry mode-specific feed semantics.
  objective: 'Controlled bump-set trajectory; platform shape and aim with the arms.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Platform stays square to the target.',
    'Contact on the forearms, not the wrists.',
    'Legs drive the set - the arms aim, the legs lift.',
  ],
  progressionDescription: 'Add a moving bump-set (one step in, one step back) between reps.',
  regressionDescription:
    'Shorten target distance and reduce height; catch-and-reset instead of continuous.',
  variants: [
    {
      // 2026-04-27 solo-vs-pair sweep: max tightened from 4 to 1 now
      // that d38-pair carries the two-player route. Solo voice no
      // longer leaks into pair sessions.
      id: 'd38-solo',
      drillId: 'd38',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 10,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description:
          'Bump-sets reaching target height (~1.5 m above head) and landing within 1 m of start.',
        target: '15 controlled sets',
      },
      courtsideInstructions:
        'Bump-set off your own toss into a 1 m landing circle around you. Self-toss to yourself ~1.5 m up; bump-set the ball back up with platform angled at the sky; aim for a settable arc landing within the circle. Reset and repeat.',
      coachingCues: [
        'Platform square, not tilted.',
        'Contact on the forearms.',
        'Legs lift; arms aim.',
      ],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair variant: partner across
    // tosses an arc; setter bump-sets back at catchable height.
    // Streak metric mirrors d41 (the chain-7 pair-only sibling) so
    // pair setting reads as one progression family across drills.
    // Voice intentionally avoids the solo "self-toss" trigger.
    {
      id: 'd38-pair',
      drillId: 'd38',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'setter'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxMinutes: 8 },
      },
      successMetric: {
        type: 'streak',
        description:
          'Longest continuous rally of clean bump-sets between partners (restart on any catch or mishit).',
        target: '15-set rally',
      },
      courtsideInstructions:
        'Bump-set back to your partner at catchable height. Stand 3 m apart; partner tosses an arc to the setter; setter bump-sets it back. Goal: unbroken rally. If it breaks, restart and count the new streak. Switch tosser and setter every 10 reps.',
      coachingCues: [
        'Platform square, not tilted.',
        'Set to your partner, not past them.',
        'Legs lift; arms aim.',
      ],
    },
  ],
}

// BAB Beginner's Guide, Lesson 2 - Hand Set tutorial. Wall-optional: the
// variant is authored as wall-independent (self-toss) because setting off
// a wall rebound trains timing more than it trains hand shape. A wall
// simply makes the drill rhythm-nicer; it's not a hard requirement.
const d39: Drill = {
  id: 'd39',
  name: 'Hand Set Fundamentals',
  shortName: 'Hand Set',
  skillFocus: ['set'],
  objective: 'Clean overhand hand-set off self-toss; symmetric hand shape and forehead contact.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Contact above the forehead, not the chest.',
    'Thumbs and forefingers form a window the ball passes through.',
    'Wrists extend; the ball leaves off both hands simultaneously.',
  ],
  progressionDescription: 'Add a 90-degree pivot between sets (set, turn, set the other way).',
  regressionDescription: 'Catch in the window shape and re-toss instead of continuous sets.',
  variants: [
    {
      // 2026-04-27 solo-vs-pair sweep: max tightened from 4 to 1 now
      // that d39-pair carries the two-player route.
      id: 'd39-solo',
      drillId: 'd39',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 10,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Hand-sets with clean forehead contact and no throw (no carry, no double).',
        target: '12 clean sets',
      },
      courtsideInstructions:
        'Hand-set off your own toss straight back up ~2 m. Self-toss above your forehead; hand-set it straight up; both hands release at the same instant. A slap means too low; a pause means you carried.',
      coachingCues: [
        'Contact above the forehead.',
        'Window between thumbs and forefingers.',
        'Both hands release together.',
      ],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair sibling sits between the
    // d38-pair "platform back-and-forth" and the d41 "hand-set
    // back-and-forth" rungs: tosser feeds, setter hand-sets back from
    // a platted base. Streak target shorter than d41 because the
    // "no throw / no carry" cleanliness gate is the explicit success
    // signal here.
    {
      id: 'd39-pair',
      drillId: 'd39',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'setter'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxMinutes: 8 },
      },
      successMetric: {
        type: 'reps-successful',
        description:
          'Hand-sets with clean forehead contact and no throw (no carry, no double); partner catches without moving more than one step.',
        target: '12 clean sets to your partner',
      },
      courtsideInstructions:
        'Hand-set back to your partner so they catch without moving more than one step. Stand 3 m apart; partner tosses an arc above the setter\'s forehead; setter hand-sets it back. A slap means too low; a pause means you carried. Switch roles after 12 clean sets.',
      coachingCues: [
        'Contact above the forehead.',
        'Set to your partner, not past them.',
        'Both hands release together.',
      ],
    },
  ],
}

// BAB Beginner's Guide, Lesson 2 - Footwork for Setting.
const d40: Drill = {
  id: 'd40',
  name: 'Footwork for Setting',
  shortName: 'Set Feet',
  // Secondary movement tag is intentional: the training problem is
  // moving, stopping, then setting from a balanced base. Recommended
  // movement_proxy fallback stays pass-scoped in archetypes.ts so this
  // does not leak into default pass/serve sessions.
  skillFocus: ['set', 'movement'],
  objective: 'Move, stop, and set from a balanced base instead of reaching while drifting.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Move first, set second.',
    'Plant both feet before contact.',
    'Finish facing the target.',
  ],
  progressionDescription: 'Add one step forward, back, left, and right before each set.',
  regressionDescription: 'Catch in the setting window, plant, then re-toss and set.',
  variants: [
    {
      id: 'd40-solo',
      drillId: 'd40',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 10,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxReps: 30, maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Sets released after a clean plant with the ball landing inside a 1 m circle.',
        target: '20 balanced sets',
      },
      courtsideInstructions:
        'Set into a 1 m landing circle after one small move. Mark the circle. Self-toss; take one small move; plant both feet; then set into the circle. Reset if you drift during contact.',
      coachingCues: ['Move first.', 'Plant both feet.', 'Face the target.'],
    },
    // 2026-04-27 solo-vs-pair sweep. Pair variant: partner toss
    // varies front/back/side so footwork must respond to actual ball
    // direction (the solo self-toss can game this by tossing where
    // the feet already are). Setter's success is the partner being
    // able to catch without a step.
    {
      id: 'd40-pair',
      drillId: 'd40',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'setter'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 10,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxReps: 30, maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description:
          'Sets released after a clean plant; partner catches without moving more than one step.',
        target: '20 balanced sets',
      },
      courtsideInstructions:
        'Set back to your tosser after a planted move on a varied toss. Tosser stands 3 m from the setter and varies the toss: short, deep, left, right. Setter moves, plants both feet, then sets back so the tosser catches without moving more than one step. Reset if you set while drifting. Switch roles after 20 sets.',
      coachingCues: ['Move first.', 'Plant both feet.', 'Face your partner.'],
    },
  ],
}

// BAB 2024 Drill Book - Plan 1 Drill 1, warm-up element "set back and
// forth". Authored as the Tier 1a pair setting probe; the lightest-weight
// pair setting rung (no triangle geometry, no window target). Chosen
// over `d40 Footwork for Setting` so Tier 1a can exercise setting via
// Swap in a pair 25-min partner-walkthrough context.
const d41: Drill = {
  id: 'd41',
  name: 'Partner Set Back-and-Forth',
  shortName: 'Set B&F',
  skillFocus: ['set'],
  objective:
    'Continuous hand-setting with a partner; timing, target, and clean contact under rhythm.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Set to a spot your partner does not have to move to - the ball is the message, the target is the apology.',
    'Reset feet between sets; plant before you set.',
    'Arc the ball ~1.5 m above reach height so your partner has time to square up.',
  ],
  progressionDescription: 'Add a lateral step between sets - set, shuffle one step, set again.',
  regressionDescription:
    'Catch and re-set (reset the rhythm) if the ball lands more than one step away.',
  variants: [
    {
      id: 'd41-pair',
      drillId: 'd41',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 4,
        durationMaxMinutes: 8,
        rpeMin: 3,
        rpeMax: 5,
        fatigueCap: { maxMinutes: 8 },
      },
      successMetric: {
        type: 'streak',
        description: 'Longest continuous rally of clean hand-sets between partners.',
        target: '15-set rally',
      },
      courtsideInstructions:
        'Hand-set back and forth with a partner. Stand 3 m apart; toss to start; then hand-set the rally. Goal: unbroken rally. If it breaks, restart and count the new streak. Alternate who tosses after every break.',
      coachingCues: [
        'Set to your partner, not past them.',
        'Plant feet between sets.',
        'Arc above reach height.',
      ],
    },
  ],
}

// BAB Beginner's Guide, Lesson 2 - Corner to Corner Setting.
const d42: Drill = {
  id: 'd42',
  name: 'Corner to Corner Setting',
  shortName: 'Corner Set',
  // Named targets require court-position movement before the set; keep
  // `set` primary and `movement` secondary for set-focus support slots.
  skillFocus: ['set', 'movement'],
  objective: 'Set a partner to useful beach targets from changing court positions.',
  levelMin: 'intermediate',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Set your partner, not an empty spot.',
    'Square up: face the target with feet and shoulders.',
    'Give enough arc for your partner to arrive early.',
  ],
  progressionDescription:
    'Move the target corner farther away or require two clean sets per corner.',
  regressionDescription:
    'Shorten the distance and allow catch-reset when either player travels too far.',
  variants: [
    {
      id: 'd42-pair',
      drillId: 'd42',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 10,
        rpeMin: 4,
        rpeMax: 6,
        fatigueCap: { maxReps: 24, maxMinutes: 10 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Sets your partner can reach within one step at the named corner target.',
        target: '3 clean sets to each corner',
      },
      courtsideInstructions:
        'Set to a partner-named corner across two targets 3 m apart. Mark the corners. Partner tosses; setter plants and sets to the named corner. Switch setter after 6 clean sets.',
      coachingCues: ['Set your partner.', 'Face the target.', 'Arc above reach height.'],
    },
  ],
}

// FIVB Drill-book 4.7 4 Great Sets (intermediate / advanced). Source form
// varies the setter's starting/pass-quality problem across four balls; this
// low-equipment route preserves the decision: move, choose bump/hand set,
// and deliver a hittable ball from imperfect positions.
const d47: Drill = {
  id: 'd47',
  name: 'Four Great Sets',
  shortName: '4 Sets',
  // Four-location setting is advanced setting plus movement/choice under
  // imperfect positions, not a static hand-shape drill.
  skillFocus: ['set', 'movement'],
  objective: 'Choose bump or hand set from varied pass locations and still deliver a hittable arc.',
  levelMin: 'intermediate',
  levelMax: 'advanced',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Move first, then decide hands or platform.',
    'Set your hitter, not the drawn target.',
    'Make the bad pass playable before making it perfect.',
  ],
  progressionDescription: 'Randomize the four positions and shrink the acceptable landing window.',
  regressionDescription: 'Run the four positions in order and allow catch-reset between reps.',
  variants: [
    {
      id: 'd47-solo-open',
      drillId: 'd47',
      label: 'Solo open',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 9,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 9 },
      },
      successMetric: {
        type: 'reps-successful',
        description:
          'Sets from four self-toss locations landing within one step of the target window.',
        target: '3 clean sets from each of the four locations',
      },
      courtsideInstructions:
        'Set into a target window from four start spots: tight, perfect, deep, and off-side. Self-toss from each spot, move, choose bump set or hand set, and rotate spots after each clean rep.',
      coachingCues: [
        'Read the ball before choosing hands or platform.',
        'Stop drifting before release.',
        'Give the target time to attack.',
      ],
    },
    {
      id: 'd47-pair-open',
      drillId: 'd47',
      label: 'Pair open',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'setter'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 9,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 9 },
      },
      successMetric: {
        type: 'reps-successful',
        description: 'Sets from four tossed locations your partner can reach within one step.',
        target: '3 clean sets from each of the four locations',
      },
      courtsideInstructions:
        'Set a partner toss from four locations: tight, perfect, deep, and off-side. Move, choose bump set or hand set, and set back so your partner can reach it within one step. Switch after one full round.',
      coachingCues: [
        'Move first, then choose the set.',
        'Set the partner, not the marker.',
        'Keep the release predictable.',
      ],
    },
  ],
}

// FIVB Drill-book 4.9 Set and Look (advanced), backed by the FIVB quick-look
// attacking essay. M001 uses the call/read immediately after the set as the
// scored behavior so the advanced setter keeps vision after delivery.
const d48: Drill = {
  id: 'd48',
  name: 'Set and Look',
  shortName: 'Set & Look',
  skillFocus: ['set'],
  objective: 'Deliver a stable set, then immediately find and call the open-court cue.',
  levelMin: 'advanced',
  levelMax: 'advanced',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Finish the set before turning the eyes.',
    'Call what is open, not what you hoped was open.',
    'Keep the set arc predictable under the read.',
  ],
  progressionDescription: 'Flash the read later or shrink the set target window.',
  regressionDescription: 'Use a known two-target call and slow partner tosses.',
  variants: [
    {
      id: 'd48-solo-open',
      drillId: 'd48',
      label: 'Solo open',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 1 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1, markers: true },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'composite',
        description: 'Sets land in the target window AND the post-set cue is called.',
        target: '16 of 24 sets in-window and 20 of 24 cue calls',
      },
      courtsideInstructions:
        'Set into a marked window from a self-toss, then turn your eyes and call the first of four numbered cue markers you see before the ball lands.',
      coachingCues: [
        'Set first; look second.',
        'Keep shoulders quiet through release.',
        'Call early and clearly.',
      ],
    },
    {
      id: 'd48-pair-open',
      drillId: 'd48',
      label: 'Pair open',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2, roles: ['tosser', 'setter'] },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 1 },
      workload: {
        durationMinMinutes: 5,
        durationMaxMinutes: 8,
        rpeMin: 5,
        rpeMax: 7,
        fatigueCap: { maxReps: 24, maxMinutes: 8 },
      },
      successMetric: {
        type: 'composite',
        description: 'Partner-reachable sets AND correct post-set flash calls.',
        target: '16 of 24 sets reachable and 20 of 24 correct calls',
      },
      courtsideInstructions:
        'Set a partner toss back to partner height. After release, partner flashes 1-4 to represent the open call; call it before reset. Switch every 12 reps.',
      coachingCues: [
        'Do not peek before release.',
        'Give your partner a hittable arc.',
        'Make the call part of the set.',
      ],
    },
  ],
}

// `d43 Triangle Setting` (BAB Drill Book Plans 5-7, 10, 11) is intentionally
// not authored here. The source drill is a 3-player triangle route; the
// honest M001 stance is that drills whose source form needs three or more
// players wait for D101 3+ player support rather than getting forced into a
// two-player adaptation. d47/d48 above use FIVB one/two-player-compatible
// setting read concepts, not the deferred BAB triangle queue.

// ---------------------------------------------------------------------------
// Chain warmup: Beach Prep (default warmup, D105 + BAB 2024)
// ---------------------------------------------------------------------------
//
// Tier 1a Unit 1 ships only `d28` (Beach Prep Three, 3-min default). The
// compliance-fallback `d27` (Beach Prep Two, ~2 min) and opt-in longer
// `d29` (Beach Prep Five, ~5 min) are deferred to Tier 1b; neither has a
// trigger to select it in Tier 1a (no compliance surface yet, no pair
// opening-block archetype). See
// docs/plans/2026-04-20-m001-tier1-implementation.md "Explicitly out of
// scope" for the gating conditions.

// D105 + BAB - Beach Prep Three, 3 min default warmup.
const d28: Drill = {
  id: 'd28',
  name: 'Beach Prep Three',
  shortName: 'Beach Prep',
  skillFocus: ['warmup'],
  objective:
    'Whole-body ramp, ankle proprioception, shoulder + trunk activation, and sand movement rehearsal in 3 minutes.',
  levelMin: 'beginner',
  levelMax: 'advanced',
  chainId: 'chain-warmup',
  m001Candidate: true,
  teachingPoints: [
    'Move through full range before loading.',
    'Ankles first - short hops and lateral shuffles wake proprioception faster than jogging on sand.',
    'End warmer than you started; cold shoulders do not pass well.',
  ],
  progressionDescription:
    'Add a second round of the shoulder/trunk sequence once 3 min feels undercooked on cold mornings.',
  regressionDescription:
    'On hot days or short sessions, collapse the sand movement block to a single lap of A-skips + shuffles.',
  variants: [
    {
      // Timed sub-blocks: 4 x ~45 s segments (jog/skip, ankle hops,
      // shoulder+trunk, sand movement). Copy is written in firing order.
      // Pre-close 2026-04-21 (P2-2): 45s pacing tick ships via
      // `subBlockIntervalSeconds` - four segments each get a pacing
      // pulse at their boundary so the tester doesn't need to watch
      // the phone to know when to flip components.
      // 2026-04-27 solo-vs-pair sweep: label 'Solo' → 'Any'. Beach
      // Prep Three is a warmup with four side-by-side segments; same
      // rationale as d25-solo and d26-solo.
      id: 'd28-solo',
      drillId: 'd28',
      label: 'Any',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 14 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 0 },
      workload: {
        durationMinMinutes: 3,
        durationMaxMinutes: 5,
        rpeMin: 2,
        rpeMax: 4,
      },
      successMetric: {
        type: 'completion',
        description: 'Completed all four components.',
        target: 'Completed',
      },
      // Founder test-run feedback 2026-04-21 (round 3): reformatted
      // the four numbered segments onto their own lines so the
      // courtside reader sees a scannable list, not a paragraph. The
      // `subBlockIntervalSeconds: 45` pacing tick already chimes at
      // each segment boundary; the list structure matches the audio.
      //
      // 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
      // U3): the prose numbered list is replaced by structured
      // `segments` so RunScreen can render a per-move position
      // indicator beside each move. The intro paragraph stays in
      // `courtsideInstructions`; the four moves move into `segments`
      // (sum 180s = workload.durationMinMinutes * 60).
      // `subBlockIntervalSeconds` retired here because the
      // per-segment end beep replaces it. RunScreen falls back to
      // uniform tick only when `segments` is undefined.
      //
      // 2026-04-28 dogfeed iteration: dropped the "~45 s each" timing
      // claim from the intro because Shorten on warmup/cooldown now
      // scales segment durations down proportionally. The segment
      // list itself is canonical for per-move timing; the intro
      // sticks to composition + intent ("four quick movement
      // blocks") so it stays true regardless of whether the user
      // shortened the block.
      courtsideInstructions: 'Four quick movement blocks. End warmer than you started.',
      segments: [
        { id: 'd28-solo-s1', label: 'Jog or A-skip around your sand box.', durationSec: 45 },
        { id: 'd28-solo-s2', label: 'Ankle hops and lateral shuffles.', durationSec: 45 },
        { id: 'd28-solo-s3', label: 'Arm circles and trunk rotations.', durationSec: 45 },
        {
          id: 'd28-solo-s4',
          label: 'Quick side shuffles and pivot-back starts at game pace.',
          durationSec: 45,
        },
      ],
      coachingCues: [
        'Short hops, loud feet.',
        'Full range on arm swings.',
        'Move your feet - ankles first, then legs.',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const DRILLS: readonly Drill[] = [
  d01,
  d02,
  d03,
  d04,
  d05,
  d06,
  d07,
  d08,
  d09,
  d10,
  d11,
  d12,
  d13,
  d14,
  d15,
  d16,
  d46,
  d17,
  d18,
  d19,
  d20,
  d21,
  d22,
  d31,
  d23,
  d33,
  d24,
  d25,
  d26,
  d28,
  d38,
  d39,
  d40,
  d41,
  d42,
  d47,
  d48,
] as const

export const M001_DRILL_IDS: readonly string[] = DRILLS.filter((d) => d.m001Candidate).map(
  (d) => d.id,
)
