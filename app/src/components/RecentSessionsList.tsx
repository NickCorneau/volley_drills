import { formatDayName } from '../lib/format'
import { focusLabel, inferSessionFocus } from '../domain/sessionFocus'
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
interface RecentSessionsListProps {
  entries: readonly RecentSessionEntry[]
  /** Explicit `now` for deterministic date-label tests. */
  now?: number
}

export function RecentSessionsList({ entries, now }: RecentSessionsListProps) {
  if (entries.length === 0) return null

  return (
    <section
      aria-label="Recent sessions"
      className="flex flex-col gap-2 px-1 pt-2"
    >
      <h2 className="text-sm font-semibold text-text-primary">
        Your recent workouts
      </h2>
      <ul role="list" className="divide-y divide-text-primary/5">
        {entries.map((entry) => {
          const focus = inferSessionFocus(entry.plan.blocks)
          return (
            <li
              key={entry.execId}
              className="grid grid-cols-[auto_1fr_auto] items-baseline gap-3 py-2 text-sm text-text-primary"
            >
              <span className="text-text-secondary">
                {formatDayName(entry.endedAt, now)}
              </span>
              <span>{focusLabel(focus)}</span>
              <span className="text-text-secondary">
                {entry.completed ? 'Done' : 'Partial'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
