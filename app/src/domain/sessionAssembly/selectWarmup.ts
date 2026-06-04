/**
 * M002.1 U8 — focus-scaled warmup seam (R9).
 *
 * Pure domain function that returns the warmup segments to run, scaled
 * to the session focus. v1 ships the SEAM, not the content (D151-style
 * deferral): `WARMUP_FOCUS_EMPHASIS` is intentionally empty, so today
 * `selectWarmup` is a faithful passthrough of the base warmup segments
 * (d28 Beach Prep Three). When M002.2+ authors focus-scaled warmup
 * priming — "warm up what you're about to train, first" — it plugs in
 * here as data, and flows through every caller with no call-site change.
 *
 * Deliberately NOT wired into `buildDraft` in v1: wiring would bump
 * `SESSION_ASSEMBLY_ALGORITHM_VERSION` and churn golden snapshots for a
 * no-op transform. The wiring lands with the first real emphasis content
 * (and its dogfood pass), per the M002.1 plan's U8 scoping note.
 *
 * The emphasis transform is a pure reorder of EXISTING segments (promote
 * the focus-relevant prep to the front) — it never invents segment copy
 * or changes total duration, so it cannot trip the courtside-copy lint
 * or the segment-sum invariant.
 */
import type { DrillSegment } from '../../types/drill'
import type { ScopedFocus } from '../eligibleSessions'

/**
 * Per-focus warmup emphasis. Promotes one existing base segment to the
 * front so the warmup leads with the prep most relevant to today's
 * focus. Empty in v1 — the seam exists, the content does not yet.
 */
export interface WarmupEmphasis {
  /** Id of the base segment to promote to the front for this focus. */
  leadSegmentId: string
}

export const WARMUP_FOCUS_EMPHASIS: Partial<Record<ScopedFocus, WarmupEmphasis>> = {}

export function selectWarmup(
  focus: ScopedFocus,
  baseSegments: readonly DrillSegment[],
  emphasis: Partial<Record<ScopedFocus, WarmupEmphasis>> = WARMUP_FOCUS_EMPHASIS,
): readonly DrillSegment[] {
  const rule = emphasis[focus]
  if (!rule) return baseSegments
  const lead = baseSegments.find((segment) => segment.id === rule.leadSegmentId)
  if (!lead) return baseSegments
  return [lead, ...baseSegments.filter((segment) => segment.id !== rule.leadSegmentId)]
}
