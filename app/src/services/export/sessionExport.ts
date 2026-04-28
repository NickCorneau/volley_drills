import type {
  ExecutionLog,
  PerDrillCapture,
  SessionParticipant,
  SessionPlan,
  SessionPlanBlock,
  SessionReview,
} from '../../model'
import { getSessionParticipants } from '../../domain/sessionParticipants'

/**
 * Forward-compatibility seam for Phase 1.5 export (U6 of the
 * architecture pass).
 *
 * `buildExportSession` takes pure model objects in and returns a
 * JSON-safe payload out. It does NOT touch Dexie, does NOT depend on
 * services, and does NOT leak Dexie row primary keys, status
 * sentinels, or draft-only book-keeping fields. The shape mirrors
 * what a Phase 1.5 share-sheet / clipboard / file export would emit;
 * the actual transport layer is out of scope for v0b.
 *
 * The model-side founder export at `app/src/services/export.ts`
 * (V0B-15) dumps whole tables for replay scripts; this adapter is the
 * per-session, public-facing version. Both can ship side-by-side
 * because they answer different questions.
 *
 * Layer rule: pure function. Lives in services/ because export is an
 * IO-shape concern (it produces a wire format), but it never reaches
 * for `db` — every input is supplied by callers. Tests pin the shape
 * so future regressions to "what gets shared" are caught at the
 * lowest useful tier.
 */
export interface ExportSessionPayload {
  schemaVersion: 1
  exportedAt: number
  session: ExportedSession
  blocks: ExportedBlock[]
  captures: ExportedCapture[]
  review?: ExportedReview
}

export interface ExportedSession {
  planId: SessionPlan['id']
  presetId: SessionPlan['presetId']
  presetName: SessionPlan['presetName']
  participants: SessionParticipant[]
  startedAt: ExecutionLog['startedAt']
  completedAt?: ExecutionLog['completedAt']
  endedEarlyReason?: ExecutionLog['endedEarlyReason']
  actualDurationMinutes?: ExecutionLog['actualDurationMinutes']
  swapCount?: ExecutionLog['swapCount']
}

export interface ExportedBlock {
  drillId?: SessionPlanBlock['drillId']
  variantId?: SessionPlanBlock['variantId']
  drillName: SessionPlanBlock['drillName']
  shortName: SessionPlanBlock['shortName']
  type: SessionPlanBlock['type']
  durationMinutes: SessionPlanBlock['durationMinutes']
  required: SessionPlanBlock['required']
  status: ExecutionLog['blockStatuses'][number]['status']
  startedAt?: ExecutionLog['blockStatuses'][number]['startedAt']
  completedAt?: ExecutionLog['blockStatuses'][number]['completedAt']
}

export type ExportedCapture = Pick<
  PerDrillCapture,
  'drillId' | 'variantId' | 'blockIndex' | 'difficulty' | 'goodPasses' | 'attemptCount'
>

export interface ExportedReview {
  sessionRpe: SessionReview['sessionRpe']
  goodPasses: SessionReview['goodPasses']
  totalAttempts: SessionReview['totalAttempts']
  shortNote?: SessionReview['shortNote']
  incompleteReason?: SessionReview['incompleteReason']
}

export interface BuildExportSessionInput {
  plan: SessionPlan
  execution: ExecutionLog
  /** Only finalized reviews are emitted. Drafts and skipped stubs are filtered out. */
  review?: SessionReview | null
  /** Defaults to `Date.now()`. Threadable for deterministic tests. */
  now?: () => number
}

/**
 * Build a Phase-1.5-ready session payload from pure model inputs.
 *
 * Important shape rules (asserted by `__tests__/sessionExport.test.ts`):
 *   - `participants` flows from `getSessionParticipants(plan)` so
 *     legacy `playerCount`-only plans still produce a populated
 *     array.
 *   - Blocks are projected from `execution.blockStatuses` so the
 *     export reflects the EXECUTED order, not the planned order
 *     (mid-run swaps respected).
 *   - Captures are passed through unchanged when supplied via
 *     `review.perDrillCaptures` — only the public-facing fields are
 *     emitted, never the raw row.
 *   - Drafts and skipped reviews are intentionally filtered: an
 *     export of an in-flight session emits no `review` block.
 */
export function buildExportSession(input: BuildExportSessionInput): ExportSessionPayload {
  const { plan, execution, review, now = Date.now } = input
  const participants = getSessionParticipants(plan)

  const blocks: ExportedBlock[] = execution.blockStatuses.map((bs, i) => {
    const block = plan.blocks[i]
    return {
      drillId: block?.drillId,
      variantId: block?.variantId,
      drillName: block?.drillName ?? '',
      shortName: block?.shortName ?? '',
      type: block?.type ?? 'main_skill',
      durationMinutes: block?.durationMinutes ?? 0,
      required: block?.required ?? false,
      status: bs.status,
      startedAt: bs.startedAt,
      completedAt: bs.completedAt,
    }
  })

  const finalized = review && review.status === 'submitted' ? review : null
  const captures: ExportedCapture[] = (finalized?.perDrillCaptures ?? []).map((c) => ({
    drillId: c.drillId,
    variantId: c.variantId,
    blockIndex: c.blockIndex,
    difficulty: c.difficulty,
    goodPasses: c.goodPasses,
    attemptCount: c.attemptCount,
  }))

  const exportedReview: ExportedReview | undefined = finalized
    ? {
        sessionRpe: finalized.sessionRpe,
        goodPasses: finalized.goodPasses,
        totalAttempts: finalized.totalAttempts,
        ...(finalized.shortNote !== undefined ? { shortNote: finalized.shortNote } : {}),
        ...(finalized.incompleteReason !== undefined
          ? { incompleteReason: finalized.incompleteReason }
          : {}),
      }
    : undefined

  return {
    schemaVersion: 1 as const,
    exportedAt: now(),
    session: {
      planId: plan.id,
      presetId: plan.presetId,
      presetName: plan.presetName,
      participants,
      startedAt: execution.startedAt,
      ...(execution.completedAt !== undefined ? { completedAt: execution.completedAt } : {}),
      ...(execution.endedEarlyReason !== undefined
        ? { endedEarlyReason: execution.endedEarlyReason }
        : {}),
      ...(execution.actualDurationMinutes !== undefined
        ? { actualDurationMinutes: execution.actualDurationMinutes }
        : {}),
      ...(execution.swapCount !== undefined ? { swapCount: execution.swapCount } : {}),
    },
    blocks,
    captures,
    ...(exportedReview ? { review: exportedReview } : {}),
  }
}
