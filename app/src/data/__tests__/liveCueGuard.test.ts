import { describe, expect, it } from 'vitest'
import { DRILLS } from '../drills'
import { isLiveCueGuardProtected, LIVE_CUE_GUARD_DRILL_IDS } from '../liveCueGuard'
import { STRESS_LADDERS } from '../stressLadders'

describe('live-cue guard registry', () => {
  it('protects d07 (Pass & Look gaze cue)', () => {
    expect(isLiveCueGuardProtected('d07')).toBe(true)
  })

  it('protects d48 (Set and Look gaze cue)', () => {
    expect(isLiveCueGuardProtected('d48')).toBe(true)
  })

  it('protects d15 (Read & Move perceptual read cue)', () => {
    expect(isLiveCueGuardProtected('d15')).toBe(true)
  })

  it('protects d47 (set read-then-decide cue)', () => {
    expect(isLiveCueGuardProtected('d47')).toBe(true)
  })

  it('does not protect a non-perceptual pass-rung drill (d24)', () => {
    expect(isLiveCueGuardProtected('d24')).toBe(false)
  })

  it('returns false for an unknown or empty drill id without throwing', () => {
    expect(isLiveCueGuardProtected('d99-does-not-exist')).toBe(false)
    expect(isLiveCueGuardProtected('')).toBe(false)
  })

  it('every guarded id resolves to a real drill in the catalog', () => {
    const known = new Set(DRILLS.map((drill) => drill.id))
    for (const id of LIVE_CUE_GUARD_DRILL_IDS) {
      expect(known.has(id)).toBe(true)
    }
  })

  it('every guarded drill sits on at least one stress ladder', () => {
    // The guard only bites where a rung cue would otherwise substitute,
    // which is only on ladder-bearing blocks. A guarded off-ladder drill
    // would be dead weight (and probably a typo).
    const onLadder = new Set(
      Object.values(STRESS_LADDERS).flatMap((rungs) => rungs.flatMap((r) => [...r.drillIds])),
    )
    for (const id of LIVE_CUE_GUARD_DRILL_IDS) {
      expect(onLadder.has(id)).toBe(true)
    }
  })
})
