export type JustFinishedStatus = 'completed' | 'skipped'

export type JustFinishedPillProps = {
  drillName: string
  status: JustFinishedStatus
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
 * lived inline in `DrillCheckScreen`.
 *
 * The only remaining home is Drill Check, where the just-finished drill is
 * the SUBJECT of the capture screen (its visible `<h1>` is `sr-only`, D145),
 * so this pill is the visible "which drill am I rating?" identity. The
 * success tone applies to both statuses — `Skipped` reads as a quiet
 * acknowledgement that the user moved on, not as a warning — and the dash
 * vs check glyph carries the status signal.
 *
 * The 2026-06-12 shibui `line` quiet receipt (origin R7) on the Run
 * get-ready beat + Transition orphan was removed 2026-06-30 (`D171`): a
 * receipt that restates the drill the athlete just finished, one tap later,
 * is redundant. Felt continuity now rests on stillness alone (shared header
 * + identical forward title, `D166` R11), not a textual receipt.
 */
export function JustFinishedPill({ drillName, status }: JustFinishedPillProps) {
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
