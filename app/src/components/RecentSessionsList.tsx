import { formatDayName } from '../lib/format'
import { focusLabel, inferSessionFocus } from '../domain/sessionFocus'
import { SCOPED_FOCUSES, type ScopedFocus } from '../domain/eligibleSessions'
import type { ConsistencyRead, ReceiptOutput } from '../domain/composeReceipt'
import type { FeltDifficultyBand } from '../domain/feltDifficultyProxy'
import type { RecentSessionEntry } from '../services/session'

/**
 * Tier 1a Unit 5: last-three-sessions row on Home.
 *
 * Three columns per row: date (left), inferred focus (middle),
 * completion status (right). Plain text - no borders, no chrome, no
 * tappable affordance. A calm "what you've done lately" trailer that
 * sits below the primary Home cluster.
 *
 * Why the constraints?
 * - The adversarial memo's Condition 2 is "the founder has no reason
 *   to keep session history outside the app." Three rows in plain
 *   type covers the ~all of what a notes-app log would hold (when,
 *   what focus, did I finish); anything richer belongs in Tier 2's
 *   full history screen.
 * - No tap targets in Tier 1a: tapping a row would set an expectation
 *   (detail screen, re-run) that Tier 1a has no surface to deliver.
 *   Passive read-only is honest about the scope. Field-test feedback
 *   2026-04-21 noted the trailer read as unclear - the copy tightening
 *   below (descriptive heading, "Done"/"Partial" vs "Yes"/"No") is the
 *   Tier 1a compromise; a tappable detail view is Tier 2.
 * - No empty state: when `entries` is empty the component renders
 *   nothing. The primary card (NewUser / Draft / LastComplete /
 *   Resume) is already the call to action - a second "you have no
 *   sessions yet" copy block would duplicate that work.
 *
 * Date column uses `formatDayName` (Today / Yesterday / weekday /
 * short date) for readability. Session-entry `endedAt` is
 * `completedAt ?? startedAt` - good enough for "when did this
 * happen" display; a few seconds off on a mid-block abort is
 * invisible to a day-granularity label.
 *
 * Completion column uses plain `Done` / `Partial` so the label tells
 * the tester what the column means without a header. "Yes" / "No"
 * (pre-2026-04-21) forced the tester to infer the question; the new
 * wording is self-describing. A checkmark + cross glyph pair was
 * rejected: glyphs read as decorative; text reads as a record.
 *
 * Focus column (middle) uses gerund forms for the three volleyball
 * skill focuses ("Passing" / "Serving" / "Setting") rather than
 * nouns ("Pass" / "Serve" / "Set"). Rationale: the row renders as
 * `date · focus · status` and the noun `Pass` sitting next to `Done`
 * / `Partial` parses as a status value — literally pass/fail — for a
 * reader who hasn't internalized the three-column model. Change
 * traces to `N3` in the Post-close partner mentions section of the
 * 2026-04-21 Tier 1a walkthrough ledger (2026-04-22 unsolicited
 * partner message); see `focusLabel` in `domain/sessionFocus.ts` for
 * why only the three volleyball cases needed the rewrite.
 *
 * Three-column grid is enforced with `grid-cols-[auto_1fr_auto]` so
 * the date hugs the left edge, focus fills the middle, and
 * completion hugs the right - matching how a spreadsheet reader
 * would scan the list.
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
 */
/**
 * Home-coherence: the weekly read is MERGED into this one history block
 * instead of a separate "Your week" receipt section. The consistency
 * headline is rendered with an explicit temporal label — "Last week:
 * N sessions" — because the receipt freezes on last week's close (F10)
 * and an unlabeled count would contradict a session shown "Today" in
 * the list just below. The labeled form keeps R6's behavioral-primary
 * weekly read user-visible (steady AND strong weeks) without that
 * contradiction. Anti-guilt (F5) still holds: a quiet closed week
 * (count 0) and the low-history absolute read render nothing — never a
 * deficit line. composeReceipt + the founder export are unchanged; this
 * is presentation only.
 */
const BAND_PHRASE: Record<Exclude<FeltDifficultyBand, 'not_enough_yet'>, string> = {
  often_stretched: 'stretching you',
  mixed: 'a mix',
  mostly_comfortable: 'feeling comfortable',
}

function feltLines(felt: Record<ScopedFocus, FeltDifficultyBand>): string[] {
  const lines: string[] = []
  for (const focus of SCOPED_FOCUSES) {
    const band = felt[focus]
    if (band === 'not_enough_yet') continue
    lines.push(`${focusLabel(focus)}: ${BAND_PHRASE[band]}.`)
  }
  return lines
}

function consistencyCallout(consistency: ConsistencyRead): string | null {
  // Low-history (absolute) reads stay quiet: with under two prior weeks
  // of data the list below is the honest signal.
  if (consistency.kind !== 'banded') return null
  // Anti-guilt: a quiet closed week renders nothing, not "0 sessions".
  if (consistency.count === 0) return null
  const noun = consistency.count === 1 ? 'session' : 'sessions'
  return consistency.band === 'strong'
    ? `Last week: ${consistency.count} ${noun}, ahead of your usual rhythm.`
    : `Last week: ${consistency.count} ${noun}.`
}

interface RecentSessionsListProps {
  entries: readonly RecentSessionEntry[]
  /**
   * The frozen weekly read, merged into this block's header. `null` for a
   * brand-new user with no submitted history. Drives an optional positive
   * consistency callout and the felt-difficulty lines.
   */
  receipt?: ReceiptOutput | null
  /** Explicit `now` for deterministic date-label tests. */
  now?: number
}

export function RecentSessionsList({ entries, receipt, now }: RecentSessionsListProps) {
  if (entries.length === 0) return null

  const callout = receipt ? consistencyCallout(receipt.consistency) : null
  const felt = receipt ? feltLines(receipt.feltDifficulty) : []

  return (
    <section aria-label="Recent sessions" className="flex flex-col gap-2 px-1 pt-2">
      <h2 className="text-base font-semibold text-text-primary">Recent sessions</h2>
      {callout && <p className="text-sm leading-5 text-text-secondary">{callout}</p>}
      {felt.length > 0 && (
        <ul className="flex flex-col gap-1">
          {felt.map((line) => (
            <li key={line} className="text-sm leading-5 text-text-secondary">
              {line}
            </li>
          ))}
        </ul>
      )}
      <ul role="list" className="divide-y divide-text-primary/5">
        {entries.map((entry) => {
          const focus = inferSessionFocus(entry.plan.blocks)
          return (
            <li
              key={entry.execId}
              className="grid grid-cols-[auto_1fr_auto] items-baseline gap-3 py-2 text-sm text-text-primary"
            >
              <span className="text-text-secondary">{formatDayName(entry.endedAt, now)}</span>
              <span>{focusLabel(focus)}</span>
              <span className="text-text-secondary">{entry.completed ? 'Done' : 'Partial'}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
