import { describe, expect, it } from 'vitest'
import type { BlockSlot, BlockSlotType, SetupContext } from '../../../model'
import type { Drill, DrillSegment, DrillVariant } from '../../../types/drill'
import type { CandidateVariant } from '../candidates'
import {
  RECOVERY_REDISTRIBUTION_PRIORITY,
  snapWarmupWrapDurations,
} from '../snapDurations'

/**
 * U1 of `docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md`:
 * pure timing math for snapping warmup/wrap blocks to their picked
 * variant's natural segment sum and redistributing freed minutes.
 *
 * Tests use synthetic layouts and variant fixtures to pin behavior
 * independent of the real archetype catalog. Real-archetype regression
 * coverage lives in `sessionBuilder.test.ts` (U5 of the plan).
 */

function slot(
  type: BlockSlotType,
  durationMinMinutes: number,
  durationMaxMinutes: number,
): BlockSlot {
  return {
    type,
    durationMinMinutes,
    durationMaxMinutes,
    intent: '',
    required: type === 'warmup' || type === 'wrap' || type === 'main_skill' || type === 'technique',
  }
}

function segment(id: string, durationSec: number): DrillSegment {
  return { id, label: id, durationSec }
}

function makeVariant(
  variantId: string,
  drillId: string,
  durationMinMinutes: number,
  segments: readonly DrillSegment[] | undefined,
): DrillVariant {
  return {
    id: variantId,
    drillId,
    label: 'Any',
    feedType: 'self-toss',
    participants: { min: 1, ideal: 1, max: 14 },
    environmentFlags: {
      needsNet: false,
      needsWall: false,
      needsLines: false,
      needsCones: false,
      lowScreenTime: false,
    },
    equipment: { balls: 0 },
    workload: {
      durationMinMinutes,
      durationMaxMinutes: durationMinMinutes + 2,
      rpeMin: 1,
      rpeMax: 3,
    },
    successMetric: {
      type: 'completion',
      description: 'Completed.',
      target: 'Completed',
    },
    courtsideInstructions: '',
    coachingCues: [],
    segments,
  }
}

function makeDrill(id: string, name: string): Drill {
  return {
    id,
    name,
    shortName: name,
    skillFocus: ['warmup'],
    objective: '',
    levelMin: 'beginner',
    levelMax: 'advanced',
    chainId: 'chain-test',
    m001Candidate: true,
    teachingPoints: [],
    progressionDescription: '',
    regressionDescription: '',
    variants: [],
  }
}

function pick(
  drillId: string,
  variantId: string,
  durationMinMinutes: number,
  segmentCount: number | 'no-segments',
): CandidateVariant {
  const drill = makeDrill(drillId, drillId)
  const segs =
    segmentCount === 'no-segments'
      ? undefined
      : Array.from({ length: segmentCount }, (_, i) => segment(`${variantId}-s${i + 1}`, 60))
  // Adjust durations so segment sum equals durationMinMinutes * 60 when
  // segmentCount is provided. We use uniform 60s segments; rescale the
  // last segment when segment count doesn't divide evenly.
  if (segs && segs.length > 0) {
    const targetSeconds = durationMinMinutes * 60
    const baseSeconds = Math.floor(targetSeconds / segs.length)
    let acc = 0
    for (let i = 0; i < segs.length; i++) {
      const isLast = i === segs.length - 1
      const dur = isLast ? targetSeconds - acc : baseSeconds
      ;(segs[i] as { durationSec: number }).durationSec = dur
      acc += dur
    }
  }
  const variant = makeVariant(variantId, drillId, durationMinMinutes, segs)
  return { drill, variant }
}

const NO_FOCUS: SetupContext['sessionFocus'] = undefined

describe('snapWarmupWrapDurations', () => {
  describe('snap behavior', () => {
    it('snaps warmup down to variant natural sum and redistributes freed minutes', () => {
      const layout = [
        slot('warmup', 4, 6),
        slot('technique', 5, 7),
        slot('main_skill', 8, 10),
        slot('wrap', 4, 6),
      ]
      const durations = [5, 6, 10, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d05', 'd05-pair', 6, 'no-segments'),
        pick('d51', 'd51-pair', 10, 'no-segments'),
        pick('d25', 'd25-solo', 4, 5),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)

      // warmup snaps 5 -> 3 (freed 2). wrap snaps 5 -> 4 (freed 1). Total freed 3.
      // Default priority: main_skill (cap 10, full), technique (5 -> 6 -> 7), movement_proxy (none).
      // 1 minute leftover, dropped (session shortens by 1).
      expect(result).toEqual([3, 7, 10, 4])
    })

    it('serve focus prioritizes pressure over technique for redistribution', () => {
      const layout = [
        slot('warmup', 4, 6),
        slot('technique', 5, 7),
        slot('main_skill', 8, 10),
        slot('pressure', 7, 9),
        slot('wrap', 4, 6),
      ]
      const durations = [5, 6, 10, 8, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d05', 'd05-pair', 6, 'no-segments'),
        pick('d51', 'd51-pair', 10, 'no-segments'),
        pick('d03', 'd03-pair', 8, 'no-segments'),
        pick('d25', 'd25-solo', 4, 5),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, 'serve')

      // Freed 3 (warmup 5->3, wrap 5->4). Serve priority: main_skill (cap), pressure (8->9 cap),
      // technique (6->7 cap). All caps reached; 0 leftover.
      expect(result).toEqual([3, 7, 10, 9, 4])
    })

    it('pass focus prioritizes technique and movement_proxy over pressure', () => {
      const layout = [
        slot('warmup', 4, 6),
        slot('technique', 5, 7),
        slot('movement_proxy', 5, 6),
        slot('main_skill', 8, 10),
        slot('pressure', 7, 9),
        slot('wrap', 4, 6),
      ]
      const durations = [5, 6, 6, 10, 8, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d05', 'd05-pair', 6, 'no-segments'),
        pick('d10', 'd10-pair', 6, 'no-segments'),
        pick('d11', 'd11-pair', 10, 'no-segments'),
        pick('d03', 'd03-pair', 8, 'no-segments'),
        pick('d26', 'd26-solo', 3, 3),
      ]

      // wrap chooses d26 (3 min natural) so wrap snaps 5->3, freed=2.
      // warmup snaps 5->3, freed=2. Total freed 4.
      // Pass priority: main_skill (cap 10, full), technique (6->7 cap), movement_proxy (6, cap),
      // pressure (8->9 cap). 1 minute placed in technique, then movement_proxy is at cap, then pressure.
      // Walk: main_skill cap -> technique 6->7 (freed 3). Loop again: main_skill cap -> technique cap
      // -> movement_proxy cap -> pressure 8->9 (freed 2). Loop again: main_skill cap, technique cap,
      // movement_proxy cap, pressure cap. progressed=false, drop remaining 2.
      const result = snapWarmupWrapDurations(layout, durations, picks, 'pass')
      expect(result).toEqual([3, 7, 6, 10, 9, 3])
    })

    it('does not snap when variant has no authored segments', () => {
      const layout = [slot('warmup', 4, 6), slot('main_skill', 8, 10)]
      const durations = [5, 10]
      const picks = [
        pick('legacy-warmup', 'legacy-warmup-solo', 3, 'no-segments'),
        pick('d51', 'd51-pair', 10, 'no-segments'),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(result).toEqual([5, 10])
    })

    it('does not snap when picked variant duration equals slot allocation', () => {
      const layout = [slot('warmup', 3, 3), slot('main_skill', 5, 6)]
      const durations = [3, 5]
      const picks = [pick('d28', 'd28-solo', 3, 4), pick('d51', 'd51-pair', 5, 'no-segments')]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(result).toEqual([3, 5])
    })

    it('clamps snap target to slot durationMaxMinutes when variant natural sum exceeds it', () => {
      const layout = [slot('warmup', 4, 5)]
      // Variant has segments summing to 6 min, but slot caps at 5.
      const durations = [5]
      const picks = [pick('d-tall', 'd-tall-solo', 6, 6)]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      // Snap target = min(slot.max, natural) = 5; current already 5; no change.
      expect(result).toEqual([5])
    })

    it('snaps below slot durationMinMinutes when variant natural is shorter (Pair+Net 40 case)', () => {
      // Real-world load-bearing case: Pair + Net 40-min layout has
      // `warmup(4, 6)` (slot min 4) but `d28-solo` has a 3-min natural
      // segment sum. The snap must honor d28's natural 3 min, not
      // re-inflate to slot min 4. Slot mins are allocator guidance for
      // unknown drills; once a specific variant is picked, its catalog-
      // validated natural sum wins.
      const layout = [slot('warmup', 4, 6)]
      const durations = [5]
      const picks = [pick('d28', 'd28-solo', 3, 4)]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      // Snap target = min(slot.max=6, natural=3) = 3. No other slot to
      // absorb the freed 2 minutes; session shortens.
      expect(result).toEqual([3])
    })

    it('does not modify non-warmup/wrap slots', () => {
      const layout = [slot('technique', 5, 7), slot('main_skill', 8, 10)]
      const durations = [6, 10]
      const picks = [
        pick('d-tech', 'd-tech-solo', 5, 4),
        pick('d-main', 'd-main-solo', 8, 4),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(result).toEqual([6, 10])
    })

    it('handles empty layout', () => {
      expect(snapWarmupWrapDurations([], [], [], NO_FOCUS)).toEqual([])
    })

    it('handles undefined picks (slot was skipped during build)', () => {
      const layout = [slot('warmup', 4, 6), slot('main_skill', 8, 10)]
      const durations = [5, 10]
      const picks: (CandidateVariant | undefined)[] = [
        undefined,
        pick('d51', 'd51-pair', 10, 'no-segments'),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(result).toEqual([5, 10])
    })
  })

  describe('redistribution priority', () => {
    it('uses default priority when sessionFocus is undefined', () => {
      const layout = [
        slot('warmup', 4, 6),
        slot('technique', 5, 7),
        slot('main_skill', 8, 10),
        slot('pressure', 5, 7),
      ]
      const durations = [5, 5, 8, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d-tech', 'd-tech-solo', 5, 'no-segments'),
        pick('d-main', 'd-main-solo', 8, 'no-segments'),
        pick('d-press', 'd-press-solo', 5, 'no-segments'),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      // Freed 2 (warmup 5->3). Default priority round-robin (matches
      // allocateDurations): main_skill 8->9, technique 5->6. 0 leftover.
      expect(result).toEqual([3, 6, 9, 5])
    })

    it('honors explicit priority override (recovery path)', () => {
      const layout = [
        slot('warmup', 4, 6),
        slot('technique', 5, 7),
        slot('movement_proxy', 5, 6),
        slot('wrap', 4, 6),
      ]
      const durations = [5, 5, 5, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d-tech', 'd-tech-solo', 5, 'no-segments'),
        pick('d-move', 'd-move-solo', 5, 'no-segments'),
        pick('d25', 'd25-solo', 4, 5),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, 'pass', {
        priority: RECOVERY_REDISTRIBUTION_PRIORITY,
      })
      // Freed 3 (warmup 5->3, wrap 5->4). Recovery priority technique then movement_proxy.
      // technique 5->6->7 (freed 1). Then movement_proxy 5->6 (freed 0).
      expect(result).toEqual([3, 7, 6, 4])
    })

    it('drops leftover freed minutes when all priority slots are saturated', () => {
      const layout = [slot('warmup', 4, 6), slot('main_skill', 8, 8)]
      const durations = [6, 8]
      const picks = [pick('d28', 'd28-solo', 3, 4), pick('d51', 'd51-pair', 8, 'no-segments')]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      // Freed 3 (warmup 6->3). main_skill at cap 8. No technique/movement_proxy/pressure.
      // 3 minutes leftover, dropped. Session shortens.
      expect(result).toEqual([3, 8])
    })

    it('allowSlotMaxOverflow places freed minutes above durationMaxMinutes (recovery contract)', () => {
      // Recovery layout where technique was already pushed above its
      // archetype `durationMaxMinutes` by `allocateRecoveryDurations`'s
      // 60/40 bias. Without `allowSlotMaxOverflow`, the snap helper
      // would refuse to add the freed minute because the slot is past
      // its cap. With it, the freed minute lands in technique above
      // the slot max — preserving recovery's `timeProfile` contract.
      const layout = [slot('warmup', 4, 6), slot('technique', 5, 7), slot('wrap', 4, 6)]
      // technique (durations[1] = 19) is intentionally above slot.max
      // (7) to mimic recovery overshoot.
      const durations = [5, 19, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d-tech', 'd-tech-solo', 5, 'no-segments'),
        pick('d25', 'd25-solo', 4, 5),
      ]

      const withOverflow = snapWarmupWrapDurations(layout, durations, picks, undefined, {
        priority: RECOVERY_REDISTRIBUTION_PRIORITY,
        allowSlotMaxOverflow: true,
      })
      // Freed 3 (warmup 5->3, wrap 5->4). All 3 land in technique above
      // its cap (19 -> 22) because allowSlotMaxOverflow disables the
      // cap check.
      expect(withOverflow).toEqual([3, 22, 4])

      // Same call without `allowSlotMaxOverflow` would drop the freed
      // minutes — pinning the contrast to prove the flag flips behavior.
      const withoutOverflow = snapWarmupWrapDurations(layout, durations, picks, undefined, {
        priority: RECOVERY_REDISTRIBUTION_PRIORITY,
      })
      expect(withoutOverflow).toEqual([3, 19, 4])
    })

    it('round-robin redistributes evenly across multiple same-type slots', () => {
      // Synthetic layout with two main_skill slots — pins the inner
      // for-loop fan-out across same-type indices that no real
      // archetype currently exercises. A regression that broke this
      // (e.g., adding `break` after the first match per type) would
      // pile minutes onto the first matching slot only.
      const layout = [
        slot('warmup', 4, 6),
        slot('main_skill', 5, 10),
        slot('main_skill', 5, 10),
      ]
      const durations = [6, 5, 5]
      const picks = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d-main-a', 'd-main-a', 5, 'no-segments'),
        pick('d-main-b', 'd-main-b', 5, 'no-segments'),
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      // Freed 3 (warmup 6->3). Round-robin within main_skill type:
      //  - Round 1: main_skill[0] 5->6, main_skill[1] 5->6 (freed 1).
      //  - Round 2: main_skill[0] 6->7 (freed 0).
      expect(result).toEqual([3, 7, 6])
    })

    it('skips redistribution into slots whose pick was undefined (silent-vanish guard)', () => {
      // Reachable on `pair_net` 40-min with `sessionFocus: 'set'` when
      // pressure has no set-tagged variant in the catalog: pressure
      // is not required, `pickForSlot` returns undefined, and the
      // phase 2 loop in `buildDraft` drops the index. Without this
      // guard, the snap helper would silently dump freed minutes into
      // a slot that never produces a block.
      const layout = [
        slot('warmup', 4, 6),
        slot('main_skill', 5, 6),
        slot('pressure', 5, 7),
      ]
      const durations = [6, 6, 6]
      const picks: (CandidateVariant | undefined)[] = [
        pick('d28', 'd28-solo', 3, 4),
        pick('d-main', 'd-main', 5, 'no-segments'),
        undefined, // pressure pick failed (no candidate available)
      ]

      const result = snapWarmupWrapDurations(layout, durations, picks, 'serve')
      // Freed 3 (warmup 6->3). serve priority [main_skill, pressure,
      // technique, movement_proxy]. main_skill 6 (cap 6, full), pressure
      // pick is undefined — skipped. No technique or movement_proxy.
      // 3 minutes leftover, dropped. Critically, pressure stays at 6
      // (its allocator-given value) — does not get inflated.
      expect(result[2]).toBe(6)
      // main_skill is also at cap so it stays at 6.
      expect(result[1]).toBe(6)
      // warmup snapped from 6 to 3.
      expect(result[0]).toBe(3)
    })

    it('skips snap when natural minutes is fractional (defensive guard)', () => {
      // Catalog validation does not pin durationMinMinutes to integer
      // values directly; if a future variant lands fractional, the
      // redistribution loop's whole-minute step would drift. Guard
      // skips the snap rather than producing wrong durations.
      // Note: pass a segments count so the variant has authored
      // segments — the integer guard is what should trip, not the
      // no-segments short-circuit.
      const layout = [slot('warmup', 4, 6)]
      const durations = [5]
      const picks = [pick('d-frac', 'd-frac', 3.5, 4)]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(result).toEqual([5])
    })
  })

  describe('purity', () => {
    it('does not mutate input durations array', () => {
      const layout = [slot('warmup', 4, 6), slot('main_skill', 8, 10)]
      const durations = [5, 8]
      const picks = [pick('d28', 'd28-solo', 3, 4), pick('d51', 'd51-pair', 8, 'no-segments')]

      const before = [...durations]
      snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(durations).toEqual(before)
    })

    it('returns a fresh array, not a reference to durations', () => {
      const layout = [slot('warmup', 4, 6)]
      const durations = [3]
      const picks = [pick('d28', 'd28-solo', 3, 4)]

      const result = snapWarmupWrapDurations(layout, durations, picks, NO_FOCUS)
      expect(result).not.toBe(durations)
    })
  })
})
