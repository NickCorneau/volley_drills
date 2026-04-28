import type { IncompleteReason } from '../db'

export interface ReviewDraftSignal {
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  quickTags: readonly string[]
  shortNote: string
  incompleteReason: IncompleteReason | null
}

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
