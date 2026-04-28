import { describe, expect, expectTypeOf, it } from 'vitest'
import { buildExportSession, type ExportSessionPayload } from '../sessionExport'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
  currentPersistedReview,
} from '../../../test-utils/persistedRecords'
import type { CoachPayload, PerDrillCapture, SessionReview } from '../../../model'

describe('buildExportSession (per-session adapter — U6)', () => {
  it('emits a stable schema version and the supplied timestamp', () => {
    const result = buildExportSession({
      plan: currentPersistedPlan(),
      execution: currentPersistedExecutionLog(),
      now: () => 12_345,
    })
    expect(result.schemaVersion).toBe(1)
    expect(result.exportedAt).toBe(12_345)
  })

  it('projects participants from getSessionParticipants when the plan persists them', () => {
    const result = buildExportSession({
      plan: currentPersistedPlan({
        playerCount: 2,
        participants: [{ role: 'self' }, { role: 'partner' }],
      }),
      execution: currentPersistedExecutionLog(),
    })
    expect(result.session.participants).toEqual([{ role: 'self' }, { role: 'partner' }])
  })

  it('falls back to a derived participants array for legacy plans without the seam', () => {
    const result = buildExportSession({
      plan: currentPersistedPlan({ playerCount: 1, participants: undefined }),
      execution: currentPersistedExecutionLog(),
    })
    expect(result.session.participants).toEqual([{ role: 'self' }])
  })

  it('reflects the executed block order via execution.blockStatuses, not plan.blocks alone', () => {
    const plan = currentPersistedPlan({
      blocks: [{ id: 'b0', drillName: 'A' }, { id: 'b1', drillName: 'B' }],
    })
    const execution = currentPersistedExecutionLog({
      blockStatuses: [
        { blockId: 'b0', status: 'completed', completedAt: 1234 },
        { blockId: 'b1', status: 'skipped' },
      ],
    })
    const result = buildExportSession({ plan, execution })
    expect(result.blocks).toHaveLength(2)
    expect(result.blocks[0]?.status).toBe('completed')
    expect(result.blocks[0]?.completedAt).toBe(1234)
    expect(result.blocks[1]?.status).toBe('skipped')
    expect(result.blocks[1]?.completedAt).toBeUndefined()
  })

  it('emits captures only for finalized (submitted) reviews', () => {
    const captures: PerDrillCapture[] = [
      {
        drillId: 'd03',
        variantId: 'd03-pair',
        blockIndex: 0,
        difficulty: 'still_learning',
        capturedAt: 100,
        goodPasses: 7,
        attemptCount: 10,
      },
    ]
    const submitted = buildExportSession({
      plan: currentPersistedPlan(),
      execution: currentPersistedExecutionLog(),
      review: currentPersistedReview({ status: 'submitted', perDrillCaptures: captures }),
    })
    expect(submitted.captures).toHaveLength(1)

    const draft = buildExportSession({
      plan: currentPersistedPlan(),
      execution: currentPersistedExecutionLog(),
      review: { ...currentPersistedReview(), status: 'draft', perDrillCaptures: captures } as SessionReview,
    })
    expect(draft.captures).toHaveLength(0)
    expect(draft.review).toBeUndefined()
  })

  it('does not leak draft-only or persistence-only fields', () => {
    const review = currentPersistedReview({
      status: 'submitted',
      shortNote: 'felt good',
      sessionRpe: 6,
    })
    const result = buildExportSession({
      plan: currentPersistedPlan(),
      execution: currentPersistedExecutionLog(),
      review,
    })

    const reviewKeys = result.review ? Object.keys(result.review) : []
    expect(reviewKeys).not.toContain('id')
    expect(reviewKeys).not.toContain('executionLogId')
    expect(reviewKeys).not.toContain('status')
    expect(reviewKeys).not.toContain('submittedAt')
    expect(reviewKeys).not.toContain('captureDelaySeconds')
    expect(reviewKeys).not.toContain('captureWindow')
    expect(reviewKeys).not.toContain('eligibleForAdaptation')
    expect(reviewKeys).not.toContain('softBlockDismissedAt')

    const sessionKeys = Object.keys(result.session)
    expect(sessionKeys).not.toContain('safetyCheck')
    expect(sessionKeys).not.toContain('createdAt')
  })

  it('round-trips through JSON unchanged for the public-facing fields', () => {
    const result = buildExportSession({
      plan: currentPersistedPlan(),
      execution: currentPersistedExecutionLog(),
      review: currentPersistedReview({ status: 'submitted', sessionRpe: 5 }),
    })
    const round = JSON.parse(JSON.stringify(result)) as ExportSessionPayload
    expect(round).toEqual(result)
  })

  it('omits review fields with undefined values rather than serializing nulls', () => {
    const result = buildExportSession({
      plan: currentPersistedPlan(),
      execution: currentPersistedExecutionLog(),
      review: currentPersistedReview({
        status: 'submitted',
        shortNote: undefined,
        incompleteReason: undefined,
      }),
    })
    expect(result.review).toBeDefined()
    expect(Object.keys(result.review!)).not.toContain('shortNote')
    expect(Object.keys(result.review!)).not.toContain('incompleteReason')
  })
})

describe('CoachPayload type-only contract', () => {
  it('declares no field that is not also present on the model surface', () => {
    // CoachPayload narrows model fields. This test is a TS-level
    // contract: every field referenced through `Pick<...>` /
    // `NonNullable<...>` resolves at compile time. If a future
    // refactor renamed a model field, this test would fail to
    // compile rather than silently drifting.
    expectTypeOf<CoachPayload['session']['planId']>().toEqualTypeOf<string>()
    expectTypeOf<CoachPayload['captures'][number]['drillId']>().toEqualTypeOf<
      PerDrillCapture['drillId']
    >()
    expectTypeOf<CoachPayload['review']>().toEqualTypeOf<
      | {
          sessionRpe: NonNullable<SessionReview['sessionRpe']>
          goodPasses: SessionReview['goodPasses']
          totalAttempts: SessionReview['totalAttempts']
          shortNote?: SessionReview['shortNote']
          incompleteReason?: SessionReview['incompleteReason']
        }
      | undefined
    >()
  })
})
