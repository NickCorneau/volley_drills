import { CUE_COMPACT_MAX } from '../../domain/policies'
import type { SessionPlanBlock } from '../../model'

export type CurrentCueSource = 'coaching-cue' | 'instructions' | 'drill-name'

export interface CurrentCueDisplay {
  text: string
  source: CurrentCueSource
  fullCue?: string
  fullInstructions?: string
}

const CUE_SEPARATOR = ' · '

export function segmentListOwnsCurrentCue(block: Pick<SessionPlanBlock, 'segments'>): boolean {
  return (block.segments?.length ?? 0) > 0
}

export function selectNonSegmentedCurrentCue(
  block: Pick<SessionPlanBlock, 'coachingCue' | 'courtsideInstructions' | 'drillName'>,
): CurrentCueDisplay {
  const fullCue = normalized(block.coachingCue)
  const fullInstructions = normalized(block.courtsideInstructions)

  const cueText = primaryCueFromCoachingCue(fullCue)
  if (cueText) {
    return {
      text: cueText,
      source: 'coaching-cue',
      fullCue,
      fullInstructions,
    }
  }

  const instructionText = primaryCueFromInstructions(fullInstructions)
  if (instructionText) {
    return {
      text: instructionText,
      source: 'instructions',
      fullCue,
      fullInstructions,
    }
  }

  return {
    text: block.drillName,
    source: 'drill-name',
    fullCue,
    fullInstructions,
  }
}

function primaryCueFromCoachingCue(fullCue: string | undefined): string | undefined {
  if (!fullCue) return undefined
  if (fullCue.length <= CUE_COMPACT_MAX) return fullCue

  const firstClause = fullCue
    .split(CUE_SEPARATOR)
    .map((part) => part.trim())
    .find((part) => part.length > 0)

  if (firstClause && firstClause.length <= CUE_COMPACT_MAX) return firstClause
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
