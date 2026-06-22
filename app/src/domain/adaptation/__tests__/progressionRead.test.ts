import { describe, expect, it } from 'vitest'
import { composeProgressionRead, resolveTrainedRung } from '../progressionRead'
import { getStressRung } from '../../../data/stressLadders'
import type { SessionPlanBlock } from '../../../model'

function mainSkillBlock(drillId: string, id = drillId): SessionPlanBlock {
  return {
    id,
    type: 'main_skill',
    drillName: drillId,
    shortName: drillId,
    durationMinutes: 12,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    drillId,
  }
}

/**
 * M002.2 progression read composer (plan 2026-06-22-001). Pins the two
 * keying decisions the ce-doc-review pass hardened: the reflective line
 * keys off the TRAINED rung (not the derived offer position), the
 * readiness line keys off the OFFER position and only on a `more` offer,
 * and every missing/undefined rung fails quiet (the composer runs in the
 * Review render body, so it must never throw).
 */
describe('composeProgressionRead', () => {
  it('sources reflection from the TRAINED rung, not the offer position', () => {
    // Divergent: trained rung 3, offer position 2 (off-target landing).
    const out = composeProgressionRead({
      focus: 'pass',
      trainedRung: 3,
      offerPosition: 2,
      direction: 'more',
    })
    expect(out.reflection).toBe(getStressRung('pass', 3)!.explorationCriterion)
    expect(out.reflection).not.toBe(getStressRung('pass', 2)!.explorationCriterion)
  })

  it('sources readiness from the OFFER position on a more offer', () => {
    const out = composeProgressionRead({
      focus: 'pass',
      trainedRung: 3,
      offerPosition: 2,
      direction: 'more',
    })
    expect(out.readiness).toBe(getStressRung('pass', 2)!.graduationFeel)
  })

  it('suppresses readiness on a less offer (step-up signal only) but keeps the reflection', () => {
    const out = composeProgressionRead({
      focus: 'pass',
      trainedRung: 2,
      offerPosition: 2,
      direction: 'less',
    })
    expect(out.reflection).toBe(getStressRung('pass', 2)!.explorationCriterion)
    expect(out.readiness).toBeNull()
  })

  it('nulls reflection when the trained rung is unknown (ambiguous / off-ladder)', () => {
    const out = composeProgressionRead({
      focus: 'serve',
      trainedRung: undefined,
      offerPosition: 2,
      direction: 'more',
    })
    expect(out.reflection).toBeNull()
    // Readiness still resolves from the offer position.
    expect(out.readiness).toBe(getStressRung('serve', 2)!.graduationFeel)
  })

  it('returns nulls for an out-of-range rung instead of throwing', () => {
    const out = composeProgressionRead({
      focus: 'serve',
      trainedRung: 99,
      offerPosition: 99,
      direction: 'more',
    })
    expect(out.reflection).toBeNull()
    expect(out.readiness).toBeNull()
  })

  it('never returns readiness on a keep direction (defensive; card is hidden anyway)', () => {
    const out = composeProgressionRead({
      focus: 'pass',
      trainedRung: 2,
      offerPosition: 2,
      direction: 'keep',
    })
    expect(out.readiness).toBeNull()
  })
})

describe('resolveTrainedRung', () => {
  it('returns the authored rung of a single on-ladder main-skill drill', () => {
    expect(resolveTrainedRung('pass', [mainSkillBlock('d03')])).toBe(2) // pass rung 2
    expect(resolveTrainedRung('pass', [mainSkillBlock('d07')])).toBe(3) // pass rung 3
  })

  it('returns undefined when no blocks are given', () => {
    expect(resolveTrainedRung('pass', undefined)).toBeUndefined()
    expect(resolveTrainedRung('pass', [])).toBeUndefined()
  })

  it('fails quiet when a trained main-skill drill is off the focus ladder', () => {
    // d25 (recovery) is on no stress ladder -> ambiguous "current rung".
    expect(resolveTrainedRung('pass', [mainSkillBlock('d25')])).toBeUndefined()
  })

  it('fails quiet when multiple main-skill blocks resolve to different rungs', () => {
    // d03 rung 2 + d07 rung 3 -> the "current rung" is ambiguous.
    expect(
      resolveTrainedRung('pass', [mainSkillBlock('d03'), mainSkillBlock('d07', 'b2')]),
    ).toBeUndefined()
  })

  it('resolves when multiple main-skill blocks share one rung', () => {
    // d07 + d09 are both pass rung 3.
    expect(
      resolveTrainedRung('pass', [mainSkillBlock('d07'), mainSkillBlock('d09', 'b2')]),
    ).toBe(3)
  })

  it('ignores non-main-skill blocks and main-skill blocks without a drillId', () => {
    const warmup: SessionPlanBlock = {
      id: 'w',
      type: 'warmup',
      drillName: 'warmup',
      shortName: 'warmup',
      durationMinutes: 3,
      coachingCue: '',
      courtsideInstructions: '',
      required: true,
    }
    const noDrillId: SessionPlanBlock = { ...mainSkillBlock('d03'), drillId: undefined }
    expect(resolveTrainedRung('pass', [warmup, mainSkillBlock('d03')])).toBe(2)
    expect(resolveTrainedRung('pass', [warmup, noDrillId])).toBeUndefined()
  })
})
