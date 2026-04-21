/**
 * Seed drill catalog — 26 drills organized into 6 progression chains.
 *
 * Source: research-output/drill-library-content-structure.md
 * Schema: app/src/types/drill.ts
 *
 * M001 minimum set (11 drills): d01, d03, d05, d09, d10, d11, d15, d18, d22,
 * d25, d26. Full pack ships post-validation (D81).
 *
 * Content status: needs expert coach review before treating as canonical
 * (set-window geometry, progression dosing, technique cue legality, heat
 * triggers). See docs/research/beach-training-resources.md.
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
    windFriendly: boolean
    lowScreenTime: boolean
  }> = {},
) => ({
  needsNet: false,
  needsWall: false,
  needsLines: false,
  needsCones: false,
  windFriendly: false,
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
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        'Toss ball up with two hands. Forearm-pass it up/down. Between contacts, separate hands and clap behind your back, then rebuild platform before next contact. Work low/medium/high arcs.',
      coachingCues: [
        'Athletic posture.',
        'Contact between wrists and elbows.',
        'Keep space between body and platform.',
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
    'Ribs tucked — do not over-arch.',
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
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        'Receiver places towel across neck/upper back. Partner tosses left/right. Receiver passes to set window without dropping towel.',
      coachingCues: [
        'Ribs tucked — do not over-arch.',
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
        'Start kneeling. Partner tosses; receiver passes back 10 reps. Then stand in serve-receive stance and repeat.',
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
      environmentFlags: env({ needsNet: true, windFriendly: true }),
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
        'Feeder serves or tosses across. Passer passes up/down to set window and then catches their own pass (or partner catches).',
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
      environmentFlags: env({ needsNet: true, windFriendly: true }),
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
        'Self-toss across the net. Pass up/down to set window and catch your own pass. Retrieve and repeat.',
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
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        'Set a marker as your set window. Self-toss slightly in front; pass to land within set-window zone; retrieve quickly and repeat. Use 20 total reps.',
      coachingCues: [
        'Get behind ball horizontally.',
        'Brake-step.',
        'Platform angle drives direction.',
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
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        'Run D01 (Pass & Slap Hands) but now score each contact as 0–3 based on proximity/trajectory to your set window.',
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
  levelMax: 'intermediate',
  chainId: 'chain-2-direction',
  m001Candidate: false,
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
        'Server serves. After pass, passer immediately looks at partner/coach who flashes 1–5 and passer calls it before next action.',
      coachingCues: [
        'Be stable during pass to buy time to look.',
        'Pass forward to keep vision.',
        'Do not drift under ball.',
      ],
    },
  ],
}

const d08: Drill = {
  id: 'd08',
  name: 'Plus Three / Minus Three',
  shortName: '+3 / −3',
  skillFocus: ['pass'],
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
        'Passer receives serve; catcher stands near set window. +1 if catcher moves ≤ 1 big step or service error; −1 for bad pass or ace. First to +3.',
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
        'Partners pass while shuffling down sideline to service line, across, and back — keeping rally alive.',
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
    'Lower inside shoulder and raise outside shoulder for wide balls.',
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
        'Tosser at net (or ~2–3 m away). Toss to 6 locations: left/right × (in front / to side / slightly behind). Receiver passes to set window.',
      coachingCues: [
        'Point shoulders to target.',
        'Lower inside shoulder, raise outside for wide balls.',
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
        'Feeder tosses wide to sideline. Pass back using only inside arm; repeat, then opposite arm; then both arms.',
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
        'Self-toss wide to left, then right. Pass using only inside arm; repeat opposite arm; then both arms.',
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
        'Feeder at net tosses ~3 m up. Passer starts back at cone, moves in, passes straight up/down to target area, retreats around cone, repeats (6–12 contacts).',
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
        'Cones form a "W" path. Passer moves in/out between cones; feeder tosses; passer passes "up/down" and retreats. Attacking final rep optional.',
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
    'Backward movement can narrow legs — watch it.',
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
        'Backward movement can narrow legs — watch it.',
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
    "Read ball early — off the server's hand.",
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
        'Server/coach delivers short or deep balls. Passer reads early, moves, passes to set window.',
      coachingCues: [
        'Centered ready position enables quick forward/back.',
        "Read ball early — off the server's hand.",
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
      environmentFlags: env({ needsNet: true, windFriendly: true }),
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
        'Server gives 10 serves. Passer grades each (0–3) using set-window rule. Switch roles. Keep a "best streak of 2+" and "average pass grade."',
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
        'Tosser throws to passer; passer passes to target; target catches; rotate through spots. After 20 passes, progress to live serve.',
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
        'Tosser initiates with skyball/freeball/downball. Points: pass-only (25), pass+set (50), pass+set+attack (100). Race to 500.',
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
  levelMin: 'beginner',
  levelMax: 'intermediate',
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
      id: 'd22-solo',
      drillId: 'd22',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 4 },
      environmentFlags: env({
        needsNet: true,
        windFriendly: true,
        lowScreenTime: true,
      }),
      equipment: { balls: 'many' },
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
        'Assign point values to zones; serve to earn 10 points; serve out loses a point; adjust zone values for your level/objective.',
      coachingCues: [
        'Develop a serving routine.',
        'Consistent hand contact.',
        'Adjust for wind movement.',
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
        'Throw ball off wall so it rebounds like a serve. Move and pass so the ball flies settable into a corner "target." Reset and repeat.',
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
// or injury prevention — post-2015 active-cool-down literature does not support
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
    'Gentle tension only — do not crank any stretch.',
    'Skip any movement that hurts today.',
  ],
  progressionDescription: 'Add an extra 30–60 seconds of easy walking on very hot days.',
  regressionDescription: 'Easy walk only (60–90 seconds).',
  variants: [
    {
      id: 'd25-solo',
      drillId: 'd25',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 14 },
      environmentFlags: env({ lowScreenTime: true }),
      equipment: { balls: 0 },
      workload: {
        durationMinMinutes: 2,
        durationMaxMinutes: 5,
        rpeMin: 1,
        rpeMax: 2,
      },
      successMetric: {
        type: 'completion',
        description: 'Completed (yes/no).',
        target: 'Completed',
      },
      courtsideInstructions:
        'Easy walk 60–90s (long exhale). Calf + foot unload 30s. Hip flexor + trunk reach 30s (split stance, overhead reach). Optional shoulder reset 30s (cross-body or lat reach, gentle tension only). Hydration and symptom check: if pain is rising, note it now.',
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
  objective: 'Calves/hamstrings/hips post-sand session.',
  levelMin: 'beginner',
  levelMax: 'advanced',
  chainId: 'chain-cooldown',
  m001Candidate: true,
  teachingPoints: ['Breathe.', 'Avoid pain.', 'Hold steady.'],
  progressionDescription: '2 sets each stretch (time permitting).',
  regressionDescription: '3 stretches only (calf/hamstring/hip flexor).',
  variants: [
    {
      id: 'd26-solo',
      drillId: 'd26',
      label: 'Solo',
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
      courtsideInstructions:
        '6 stretches × 20–30 seconds each (calf straight, calf bent, hamstring, hip flexor, glute, adductor). No bouncing; "strong not painful."',
      coachingCues: ['Breathe.', 'Avoid pain.', 'Hold steady.'],
    },
  ],
}

// ---------------------------------------------------------------------------
// Chain 7: Setting fundamentals (Tier 1a Unit 2 minimum probe)
// ---------------------------------------------------------------------------
//
// Three drills authored as a minimum setting probe (BAB Beginner's Guide
// Lesson 2). No progression links in Tier 1a — Bump Set and Hand Set are
// fundamentals, not rungs gated on each other. Tier 1b adds links once
// founder dogfood and the partner walkthrough surface which pairs chain
// in practice. See
// docs/plans/2026-04-20-m001-tier1-implementation.md Unit 2.
//
// Swap-only reachability: archetypes.ts main_skill / pressure block
// skillTags stay at `['pass', 'serve']`, so default (non-Swap) session
// assembly preserves the single-focus-per-session invariant (archetype
// invariants header point 1). `SKILL_TAGS_BY_TYPE.main_skill` and
// `.pressure` in sessionBuilder.ts widen to include 'set' so
// user-initiated Swap can reach these drills.

// BAB Beginner's Guide, Lesson 2 — Bump Set tutorial.
const d38: Drill = {
  id: 'd38',
  name: 'Bump Set Fundamentals',
  shortName: 'Bump Set',
  skillFocus: ['set'],
  objective: 'Controlled bump-set trajectory off self-toss; platform shape and aim with the arms.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Platform stays square to the target.',
    'Contact on the forearms, not the wrists.',
    'Legs drive the set — the arms aim, the legs lift.',
  ],
  progressionDescription: 'Add a moving bump-set (one step in, one step back) between reps.',
  regressionDescription: 'Shorten target distance and reduce height; catch-and-reset instead of continuous.',
  variants: [
    {
      id: 'd38-solo',
      drillId: 'd38',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 4 },
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        description: 'Bump-sets reaching target height (~1.5 m above head) and landing within 1 m of start.',
        target: '15 controlled sets',
      },
      courtsideInstructions:
        'Self-toss to yourself ~1.5 m up. Bump-set the ball back up with platform angled at the sky — aim for a settable arc landing within a 1 m circle around you. Reset and repeat.',
      coachingCues: [
        'Platform square, not tilted.',
        'Contact on the forearms.',
        'Legs lift; arms aim.',
      ],
    },
  ],
}

// BAB Beginner's Guide, Lesson 2 — Hand Set tutorial. Wall-optional: the
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
      id: 'd39-solo',
      drillId: 'd39',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 4 },
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        'Self-toss above your forehead. Hand-set the ball straight back up ~2 m. Ball should leave both hands at the same instant — if you hear a "slap" it was too low; if you feel it sitting, your hands carried.',
      coachingCues: [
        'Contact above the forehead.',
        'Window between thumbs and forefingers.',
        'Both hands release together.',
      ],
    },
  ],
}

// BAB 2024 Drill Book — Plan 1 Drill 1, warm-up element "set back and
// forth". Authored as the Tier 1a pair setting probe; the lightest-weight
// pair setting rung (no triangle geometry, no window target). Chosen
// over `d40 Footwork for Setting` so Tier 1a can exercise setting via
// Swap in a pair 25-min partner-walkthrough context.
const d41: Drill = {
  id: 'd41',
  name: 'Partner Set Back-and-Forth',
  shortName: 'Set B&F',
  skillFocus: ['set'],
  objective: 'Continuous hand-setting with a partner; timing, target, and clean contact under rhythm.',
  levelMin: 'beginner',
  levelMax: 'intermediate',
  chainId: 'chain-7-setting',
  m001Candidate: true,
  teachingPoints: [
    'Set to a spot your partner does not have to move to — the ball is the message, the target is the apology.',
    'Reset feet between sets; plant before you set.',
    'Arc the ball ~1.5 m above reach height so your partner has time to square up.',
  ],
  progressionDescription: 'Add a lateral step between sets — set, shuffle one step, set again.',
  regressionDescription: 'Catch and re-set (reset the rhythm) if the ball lands more than one step away.',
  variants: [
    {
      id: 'd41-pair',
      drillId: 'd41',
      label: 'Pair',
      feedType: 'partner-toss',
      participants: { min: 2, ideal: 2, max: 2 },
      environmentFlags: env({ windFriendly: true, lowScreenTime: true }),
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
        'Stand 3 m apart. Toss to start; hand-set back and forth. Goal: unbroken rally. If it breaks, restart and count the new streak. Alternate who tosses after every break.',
      coachingCues: [
        'Set to your partner, not past them.',
        'Plant feet between sets.',
        'Arc above reach height.',
      ],
    },
  ],
}

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

// D105 + BAB — Beach Prep Three, 3 min default warmup.
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
    'Ankles first — short hops and lateral shuffles wake proprioception faster than jogging on sand.',
    'End warmer than you started; cold shoulders do not pass well.',
  ],
  progressionDescription:
    'Add a second round of the shoulder/trunk sequence once 3 min feels undercooked on cold mornings.',
  regressionDescription:
    'On hot days or short sessions, collapse the sand movement block to a single lap of A-skips + shuffles.',
  variants: [
    {
      id: 'd28-solo',
      drillId: 'd28',
      label: 'Solo',
      feedType: 'self-toss',
      participants: { min: 1, ideal: 1, max: 14 },
      environmentFlags: env({ lowScreenTime: true, windFriendly: true }),
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
      courtsideInstructions:
        '(1) 30 s light jog / A-skips around your sand box. (2) 30 s ankle hops + lateral shuffles. (3) 45 s arm circles forward + back, cross-body swings, trunk rotations. (4) 45 s movement rehearsal — two forward shuffles, two lateral shuffles, one drop-step + sprint, repeat. End warmer than you started.',
      coachingCues: [
        'Short hops, loud feet.',
        'Full range on arm swings.',
        'Move your feet — ankles first, then legs.',
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
  d17,
  d18,
  d19,
  d20,
  d21,
  d22,
  d23,
  d24,
  d25,
  d26,
  d28,
  d38,
  d39,
  d41,
] as const

export const M001_DRILL_IDS: readonly string[] = DRILLS.filter((d) => d.m001Candidate).map(
  (d) => d.id,
)
