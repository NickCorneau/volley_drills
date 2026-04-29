import type { DrillSegment } from '../../types/drill'
import { SEGMENT_INDEX_BONUS } from '../../domain/runFlow'

/**
 * Per-move pacing indicator rendered on RunScreen for warmup /
 * cooldown drills with composed `segments`. Extends the existing
 * coaching-cue sidebar voice (left rule + tiny uppercase accent
 * label + neutral 16 px body) into a position-aware list with the
 * active row highlighted by an accent left-rule, a small filled
 * accent dot, and bolder body weight.
 *
 * Design tokens (verified against `app/src/index.css`):
 *  - Active row: `border-l-2 border-accent/70 pl-3` (matches
 *    `coachingCue` at `RunScreen.tsx` line 212)
 *  - Markers (all 1rem-square so labels align across rows):
 *    - past: success check (`text-success`)
 *    - now: filled accent dot (`bg-accent`)
 *    - future: hollow gray ring (`border-text-secondary/40`)
 *  - Body type stays at `text-base` (16 px outdoor floor)
 *
 * Layout: CSS grid with three columns — `[marker, label, duration]`.
 * Marker column is fixed-width so labels align regardless of marker
 * shape. Duration cell uses `self-end` so on multi-line wrapping
 * labels the duration sits at the end of the LAST line, not the
 * first (the iteration fix from the 2026-04-28 dogfeed pass).
 *
 * Manual-test iteration history:
 *  - V1 (2026-04-28): `flex items-baseline` + "NOW" text pill.
 *    Issue: pill was wider than other markers → labels misaligned.
 *    Issue: wrapping labels left the right-aligned duration on the
 *    first line, looking like it belonged to a mid-sentence word.
 *  - V2 (2026-04-28, post-dogfeed): grid layout, fixed-width marker
 *    column, accent dot replaces pill, `self-end` on duration so
 *    multi-line rows align duration with the LAST line.
 *
 * No motion. State transitions render instantly. The block-timer
 * stays the only animated element on the screen, per the
 * partner-walkthrough density polish (2026-04-22 round 2) and the
 * japanese-inspired-direction §3 ("limited motion") guidance.
 *
 * Accessibility: the active `<li>` carries `aria-current="step"` and
 * the list has `aria-label="Segments"`. An off-screen
 * `aria-live="polite"` announcer speaks the active label so the
 * indicator is reachable without sight (the "visible state
 * independent of audio state" half of R7 in the requirements doc).
 *
 * Forward-seam: `DrillSegment.cue?` is intentionally NOT rendered in
 * v1. See the unit test pinning the no-render contract; activate the
 * field per the v2 trigger documented at the type definition in
 * `app/src/types/drill.ts`.
 *
 * 2026-04-28 ship: `docs/plans/2026-04-28-per-move-pacing-indicator.md`.
 */

export interface SegmentListProps {
  segments: readonly DrillSegment[]
  /**
   * Index of the active segment, or `SEGMENT_INDEX_BONUS` (`-1`)
   * when all segments have completed and the block is in bonus
   * territory. RunScreen sources this from the controller's
   * `currentSegmentIndex` (driven by `useBlockPacingTicks`).
   */
  currentIndex: number
  /**
   * Optional bonus prose, rendered below the list ONLY when
   * `currentIndex === SEGMENT_INDEX_BONUS` (i.e., past the segment
   * sum). Used today on `d26-solo` (mirror / glutes / adductors) and
   * `d25-solo` (hydrate). Renders nothing if undefined or empty.
   */
  bonus?: string
}

type SegmentRowStatus = 'done' | 'now' | 'future'

function statusForIndex(rowIndex: number, currentIndex: number): SegmentRowStatus {
  if (currentIndex === SEGMENT_INDEX_BONUS) return 'done'
  if (rowIndex < currentIndex) return 'done'
  if (rowIndex === currentIndex) return 'now'
  return 'future'
}

export function SegmentList({ segments, currentIndex, bonus }: SegmentListProps) {
  if (segments.length === 0) return null

  const activeSegment =
    currentIndex >= 0 && currentIndex < segments.length ? segments[currentIndex] : null

  return (
    <div>
      <ul aria-label="Segments" className="flex flex-col gap-2">
        {segments.map((segment, i) => {
          const status = statusForIndex(i, currentIndex)
          const isNow = status === 'now'
          // Reserve the 2 px left rule space on every row so the
          // active row never causes layout shift when the highlight
          // moves.
          const containerClass = isNow
            ? 'border-l-2 border-accent/70 pl-3'
            : 'border-l-2 border-transparent pl-3'

          return (
            <li
              key={segment.id}
              aria-current={isNow ? 'step' : undefined}
              className={`grid grid-cols-[1rem_1fr_auto] gap-x-3 ${containerClass}`}
            >
              {/*
               * Marker column: fixed 1rem (16 px) wide so labels
               * align across rows regardless of marker shape. Marker
               * itself sits inline with the first text line via
               * `pt-[7px]` (half of (line-height − marker-height) for
               * 16 px text with `leading-relaxed` ≈ 28 px line height
               * and 14 px marker = 7 px top offset).
               */}
              <span className="pt-[7px]">
                <SegmentMarker status={status} />
              </span>
              <span className={labelClassForStatus(status)}>
                {segment.label}
                {segment.eachSide && (
                  <span className="text-text-secondary"> (each side)</span>
                )}
              </span>
              {/*
               * Duration cell uses `self-end` so on multi-line label
               * wraps it sits at the bottom of the row (level with the
               * last text line), not the first. Single-line labels
               * still see it on the only line. `pb-[1px]` nudges it
               * onto the actual text baseline of the last line.
               *
               * Display rounds to whole seconds — a Shorten-scaled
               * segment may have a fractional float duration (e.g.,
               * 22.5 s) that's correct for the pacing math but reads
               * weird to a courtside user. The pacing helper still
               * uses the unrounded float so cumulative ends sum
               * exactly to the active block duration.
               */}
              <span className="self-end pb-[2px] text-sm tabular-nums text-text-secondary">
                {Math.round(segment.durationSec)}s
              </span>
            </li>
          )
        })}
      </ul>

      {/*
       * aria-live="polite" announcer for screen readers. The visible
       * accent dot on the active row covers sighted users; this gives
       * unsighted users equivalent state-change feedback and survives
       * audio failure (R7 / AE6).
       */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeSegment ? `Now: ${activeSegment.label}` : 'All segments complete'}
      </div>

      {currentIndex === SEGMENT_INDEX_BONUS && bonus && bonus.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{bonus}</p>
      )}
    </div>
  )
}

function labelClassForStatus(status: SegmentRowStatus): string {
  switch (status) {
    case 'done':
      return 'text-base leading-relaxed text-text-primary/60'
    case 'now':
      return 'text-base font-medium leading-relaxed text-text-primary'
    case 'future':
      return 'text-base leading-relaxed text-text-secondary'
  }
}

function SegmentMarker({ status }: { status: SegmentRowStatus }) {
  switch (status) {
    case 'done':
      return <CheckMark />
    case 'now':
      return <ActiveDot />
    case 'future':
      return <HollowCircle />
  }
}

/**
 * Active-segment marker. Filled accent dot, ~10 px diameter, equal
 * width to the past-row check + future-row hollow ring so labels
 * align across rows. The accent left-rule on the row + bolder label
 * weight do most of the "now" signaling work; the dot is a calmer
 * confirmation than a "NOW" text pill.
 */
function ActiveDot() {
  return (
    <span
      aria-hidden="true"
      className="block size-2.5 shrink-0 rounded-full bg-accent"
    />
  )
}

function CheckMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="block size-3.5 shrink-0 text-success"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 8.5 6.5 12 13 4.5" />
    </svg>
  )
}

function HollowCircle() {
  return (
    <span
      aria-hidden="true"
      className="block size-2.5 shrink-0 rounded-full border border-text-secondary/40"
    />
  )
}
