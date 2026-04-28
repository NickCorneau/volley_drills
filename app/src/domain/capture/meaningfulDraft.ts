import type { IncompleteReason } from '../../model'

/**
 * Shape of the form-level inputs the autosave / Finish-Later branches
 * inspect to decide whether a draft is worth persisting. Mirrors the
 * fields ReviewScreen owns; per-drill captures are NOT part of this
 * predicate because Drill Check has already persisted them under U1's
 * field-merging contract.
 */
export interface ReviewDraftSignal {
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  quickTags: readonly string[]
  shortNote: string
  incompleteReason: IncompleteReason | null
}

/**
 * Returns `true` when at least one ReviewScreen-owned signal is set —
 * a non-null RPE, a non-zero count, a chosen incompleteReason, a quick
 * tag, or non-whitespace short note. Callers use this to skip writes
 * that would just persist defaults.
 */
export function hasMeaningfulReviewDraftInput({
  sessionRpe,
  goodPasses,
  totalAttempts,
  quickTags,
  shortNote,
  incompleteReason,
}: ReviewDraftSignal): boolean {
  return (
    sessionRpe != null ||
    goodPasses !== 0 ||
    totalAttempts !== 0 ||
    quickTags.length > 0 ||
    shortNote.trim() !== '' ||
    incompleteReason != null
  )
}
