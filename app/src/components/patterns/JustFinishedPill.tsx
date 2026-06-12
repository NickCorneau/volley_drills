export type JustFinishedStatus = 'completed' | 'skipped'

export type JustFinishedPresentation = 'panel' | 'line'

export type JustFinishedPillProps = {
  drillName: string
  status: JustFinishedStatus
  /**
   * `panel` (default) is the original warm panel + success-circle pill —
   * Drill check keeps it because there the just-finished drill is the
   * subject of the screen. `line` is the 2026-06-12 shibui-polish quiet
   * receipt for Transition (origin R7): one `text-sm text-text-secondary`
   * line with a small success-tone glyph, no panel fill, no semibold —
   * so `Up next` keeps the screen's focal weight.
   */
  presentation?: JustFinishedPresentation
}

function CheckGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function DashGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

const STATUS_LABEL: Record<JustFinishedStatus, string> = {
  completed: 'Complete',
  skipped: 'Skipped',
}

/**
 * Plan U6 (2026-05-04): the verbatim copy-pasted "warm panel + success-tone
 * circle + drill name + Complete/Skipped subtitle" pill that previously
 * lived inline in `DrillCheckScreen` (always `completed`) and
 * `TransitionScreen` (variant on `prevBlockStatus`).
 *
 * The success tone applies to BOTH variants — `Skipped` reads as a quiet
 * acknowledgement that the user moved on, not as a warning. The dash vs
 * check glyph carries the variant signal — on the `line` presentation it is
 * the ONLY variant signal, so both glyphs render at the same size and tone
 * (a skipped drill must be as legible as a completed one, origin R7).
 */
export function JustFinishedPill({
  drillName,
  status,
  presentation = 'panel',
}: JustFinishedPillProps) {
  if (presentation === 'line') {
    return (
      <p className="flex items-center gap-2 text-sm text-text-secondary">
        <span className="shrink-0 text-success">
          {status === 'completed' ? <CheckGlyph /> : <DashGlyph />}
        </span>
        <span>
          {drillName} · {STATUS_LABEL[status]}
        </span>
      </p>
    )
  }

  return (
    <div className="flex items-start gap-2.5 rounded-base bg-bg-warm p-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
        {status === 'completed' ? <CheckGlyph /> : <DashGlyph />}
      </div>
      <div>
        <p className="font-semibold text-text-primary">{drillName}</p>
        <p className="text-sm text-success">{STATUS_LABEL[status]}</p>
      </div>
    </div>
  )
}
