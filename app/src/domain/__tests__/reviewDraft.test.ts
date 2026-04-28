import { describe, expect, it } from 'vitest'
import { hasMeaningfulReviewDraftInput, type ReviewDraftSignal } from '../reviewDraft'

const emptyDraftSignal: ReviewDraftSignal = {
  sessionRpe: null,
  goodPasses: 0,
  totalAttempts: 0,
  quickTags: [],
  shortNote: '',
  incompleteReason: null,
}

describe('hasMeaningfulReviewDraftInput', () => {
  it('treats an all-default review form as not worth persisting', () => {
    expect(hasMeaningfulReviewDraftInput(emptyDraftSignal)).toBe(false)
  })

  it.each<Partial<ReviewDraftSignal>>([
    { sessionRpe: 5 },
    { goodPasses: 1 },
    { totalAttempts: 1 },
    { quickTags: ['notCaptured'] },
    { shortNote: 'Felt better after warmup.' },
    { incompleteReason: 'fatigue' },
  ])('treats %o as meaningful draft input', (override) => {
    expect(hasMeaningfulReviewDraftInput({ ...emptyDraftSignal, ...override })).toBe(true)
  })
})
