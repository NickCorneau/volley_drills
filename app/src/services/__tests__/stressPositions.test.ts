import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { SessionReview } from '../../model'
import { setStorageMeta } from '../storageMeta'
import { loadStressPositions } from '../stressPositions'

/**
 * D154 — the service seam both assembly callers and the founder export
 * resolve positions through. Pins the Dexie read + band resolution; the
 * fold semantics themselves are pinned in the domain suite
 * (`domain/adaptation/__tests__/stressPosition.test.ts`).
 */

async function clearDb() {
  await Promise.all([db.sessionReviews.clear(), db.storageMeta.clear()])
}

beforeEach(async () => {
  await clearDb()
})

function acceptedMoreOnServe(submittedAt: number): SessionReview {
  return {
    id: `review-${submittedAt}`,
    executionLogId: `log-${submittedAt}`,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt,
    status: 'submitted',
    offeredDelta: { kind: 'stress', focus: 'serve', direction: 'more' },
    verdictChoice: 'accepted',
  }
}

describe('loadStressPositions', () => {
  it('resolves beginner starting rungs with no reviews and no persisted level', async () => {
    expect(await loadStressPositions()).toEqual({ pass: 1, serve: 1, set: 1 })
  })

  it('maps the persisted skill level to the band starting rungs', async () => {
    await setStorageMeta('onboarding.skillLevel', 'competitive_pair')
    expect(await loadStressPositions()).toEqual({ pass: 4, serve: 4, set: 4 })
  })

  it("maps the 'unsure' skill level to the beginner starting rungs", async () => {
    await setStorageMeta('onboarding.skillLevel', 'unsure')
    expect(await loadStressPositions()).toEqual({ pass: 1, serve: 1, set: 1 })
  })

  it('folds accepted verdicts from the reviews table', async () => {
    await db.sessionReviews.add(acceptedMoreOnServe(1000))
    expect(await loadStressPositions()).toEqual({ pass: 1, serve: 2, set: 1 })
  })
})
