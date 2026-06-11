import type { ScopedFocus } from '../../domain/eligibleSessions'
import { hasSkippedBlocks } from '../../domain/executionPredicates'
import { REPEAT_SUBSET_MIN_MINUTES } from '../../domain/policies'
import { focusLabel } from '../../domain/sessionFocus'
import { sessionDurationMinutes } from '../../lib/format'
import type { LastCompleteBundle } from '../../services/session'
import { Button } from '../ui'
import { LINK_BELOW_PRIMARY_CLASS, PRIMARY_CARD_CLASS } from './cardStyles'

export interface LastCompleteCardProps {
  data: LastCompleteBundle
  /**
   * The plan's next focus (staleness head). The focal CTA starts a
   * focus-steered session ("Start passing session") — the card IS the
   * plan. Required: `composePlan` always yields a head (a fresh start
   * falls back to the deterministic tie-break), so a plan-less
   * last_complete state cannot occur.
   */
  nextFocus: ScopedFocus
  /**
   * The plan's deferred tail, rendered as a quiet "Then: serving and
   * setting." line under the focal CTA. Keeps the backlog (R3) visible
   * now that the standalone plan line is absorbed by this card.
   */
  backlog: readonly ScopedFocus[]
  /** Start a session steered to `nextFocus` (the focal action). */
  onStartPlan: () => void
  onRepeat: () => void
  /**
   * Routes to fresh `/setup` (no pre-fill, no banner). Phase F Unit 1
   * replaces the pre-Phase-F `Edit` + `Same as last time` pair.
   */
  onStartDifferent: () => void
  /**
   * Only passed when the log has a skipped tail (U3: keyed on the
   * skipped-blocks predicate, not status — deliberate wraps are
   * `completed` but still trained a subset worth repeating). Caller
   * hides the button via `undefined` for the clean-complete case.
   */
  onRepeatWhatYouDid?: () => void
  actionDisabled?: boolean
}

export function LastCompleteCard({
  data,
  nextFocus,
  backlog,
  onStartPlan,
  onRepeat,
  onStartDifferent,
  onRepeatWhatYouDid,
  actionDisabled = false,
}: LastCompleteCardProps) {
  const plannedTotalMinutes = data.plan.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
  const daysAgo = formatDaysAgo(data.log.completedAt ?? data.log.startedAt)
  // U3 (2026-06-11 session-truth plan): this card keys PER ELEMENT.
  // Status copy ("ended early") keys on `status` and must never render
  // for a deliberate wrap (which is `completed`). The metadata line and
  // the subset-repeat affordance key on the skipped-tail predicate so a
  // wrap keeps the honest "N of M min" and the shorter-version repeat.
  const isEndedEarly = data.log.status === 'ended_early'
  const hasSkippedTail = hasSkippedBlocks(data.log)
  // The shorter-repeat label shows actually-completed minutes so
  // the label and the rebuilt draft always agree (C-5 Unit 3 risk row).
  const completedMinutes = hasSkippedTail
    ? data.plan.blocks.reduce((sum, block, idx) => {
        const status = data.log.blockStatuses[idx]
        return status?.status === 'completed' ? sum + block.durationMinutes : sum
      }, 0)
    : 0
  // Floor (2026-06-11 fresh-eyes pass): a tiny subset isn't worth a third
  // link — "Repeat shorter version (3 min)" reads as menu noise. Below
  // the floor the card keeps its normal two-link set.
  const canRepeatSubset =
    hasSkippedTail &&
    completedMinutes >= REPEAT_SUBSET_MIN_MINUTES &&
    onRepeatWhatYouDid !== undefined
  const repeatLabel = hasSkippedTail ? 'Repeat full plan' : 'Repeat last session'
  // Data honesty (§9.2): a session with a skipped tail reports the time
  // actually trained, not the planned total — "6 of 38 min", same duration
  // basis as Review's meta line. Falls back to the planned total when no
  // honest duration is available (legacy logs) or rounding makes trained
  // ≥ planned.
  const trainedMinutes = hasSkippedTail ? sessionDurationMinutes(data.log) : null
  const durationPart =
    plannedTotalMinutes <= 0
      ? ''
      : trainedMinutes != null && trainedMinutes < plannedTotalMinutes
        ? ` · ${trainedMinutes} of ${plannedTotalMinutes} min`
        : ` · ${plannedTotalMinutes} min`

  return (
    <section role="region" aria-label="Train again" className={PRIMARY_CARD_CLASS}>
      <div>
        <p className="text-sm font-semibold text-text-primary">Ready to train again.</p>
        {/* Labeled as the LAST session: the focal CTA below describes the
            NEXT one, so unlabeled preset/duration metadata here would read
            as a description of what the button starts. */}
        <p className="mt-2 text-sm text-text-secondary">
          Last session: {data.plan.presetName}
          {durationPart}
          {isEndedEarly && daysAgo && ` · ended early ${daysAgo}`}
        </p>
      </div>

      {/* The plan is the focal action: start a session steered to the
          next focus, with the deferred tail as a quiet queue line.
          Repeat + different demote to secondary links. */}
      <div className="flex flex-col gap-2">
        <Button variant="primary" fullWidth disabled={actionDisabled} onClick={onStartPlan}>
          Start {focusLabel(nextFocus).toLowerCase()} session
        </Button>
        {backlog.length > 0 && (
          <p className="text-center text-sm text-text-secondary">
            Then: {focusListPhrase(backlog)}.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="link"
          disabled={actionDisabled}
          onClick={onRepeat}
          className={LINK_BELOW_PRIMARY_CLASS}
        >
          {repeatLabel}
        </Button>
        {canRepeatSubset && (
          <Button variant="link" disabled={actionDisabled} onClick={onRepeatWhatYouDid}>
            Repeat shorter version ({completedMinutes} min)
          </Button>
        )}
        <Button variant="link" disabled={actionDisabled} onClick={onStartDifferent}>
          Start a different session
        </Button>
      </div>
    </section>
  )
}

/** Lowercase gerund list: ['serve','set'] -> "serving and setting". */
function focusListPhrase(focuses: readonly ScopedFocus[]): string {
  const phrases = focuses.map((focus) => focusLabel(focus).toLowerCase())
  if (phrases.length === 1) return phrases[0]
  return `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`
}

function formatDaysAgo(completedAt: number, now: number = Date.now()): string {
  const diffMs = now - completedAt
  if (diffMs < 0) return ''
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}
