import { CUE_COMPACT_MAX } from '../../domain/policies'
import { CUE_SEPARATOR } from '../../lib/format'
import type { SessionPlanBlock } from '../../model'

export type CurrentCueSource = 'coaching-cue' | 'instructions' | 'drill-name'

export interface CurrentCueDisplay {
  text: string
  source: CurrentCueSource
}

export function segmentListOwnsCurrentCue(block: Pick<SessionPlanBlock, 'segments'>): boolean {
  return (block.segments?.length ?? 0) > 0
}

export function selectNonSegmentedCurrentCue(
  block: Pick<SessionPlanBlock, 'coachingCue' | 'courtsideInstructions' | 'drillName'>,
  /**
   * Optional rung-aware override (M002.2): the block's guarded live-cue
   * substitute (see `resolveBlockLiveCueOverride`). Tried FIRST through the
   * same `primaryCueFromCoachingCue` budget gate as the authored cue, so a
   * single `CUE_COMPACT_MAX` rule governs both. When it yields nothing
   * (absent, or over budget) the selector falls through to today's chain
   * (`coachingCue` first clause → instructions → drill name) unchanged.
   * Renders in the same `coaching-cue` slot with no marker (R5).
   */
  preferredCoachingCue?: string,
): CurrentCueDisplay {
  const preferredText = primaryCueFromCoachingCue(normalized(preferredCoachingCue ?? ''))
  if (preferredText) {
    return {
      text: preferredText,
      source: 'coaching-cue',
    }
  }

  const fullCue = normalized(block.coachingCue)
  const fullInstructions = normalized(block.courtsideInstructions)

  const cueText = primaryCueFromCoachingCue(fullCue)
  if (cueText) {
    return {
      text: cueText,
      source: 'coaching-cue',
    }
  }

  const instructionText = primaryCueFromInstructions(fullInstructions)
  if (instructionText) {
    return {
      text: instructionText,
      source: 'instructions',
    }
  }

  return {
    text: block.drillName,
    source: 'drill-name',
  }
}

function primaryCueFromCoachingCue(fullCue: string | undefined): string | undefined {
  if (!fullCue) return undefined

  const clauses = fullCue
    .split(CUE_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  // 2026-06-11 design-language follow-up: a multi-cue join NEVER renders
  // whole on the `Now` surface, regardless of length. CUE_COMPACT_MAX's
  // "single breath" rule was written for single thoughts; a 3-cue join
  // that happens to fit 100 chars still reads as a ". · " run-on (the
  // same collision the stacked-line fix removed from the disclosure
  // sites). Now carries the lead cue; the full list stays one tap away.
  if (clauses.length > 1) {
    const [firstClause] = clauses
    return firstClause.length <= CUE_COMPACT_MAX ? firstClause : undefined
  }

  if (fullCue.length <= CUE_COMPACT_MAX) return fullCue
  return undefined
}

function primaryCueFromInstructions(fullInstructions: string | undefined): string | undefined {
  if (!fullInstructions) return undefined

  const nonEmptyLines = fullInstructions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (nonEmptyLines.length !== 1) return undefined

  const [firstLine] = nonEmptyLines
  if (firstLine.length > CUE_COMPACT_MAX) return undefined
  return firstLine
}

function normalized(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
