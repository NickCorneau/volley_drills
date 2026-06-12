import type { ScopedFocus } from '../../domain/eligibleSessions'
import { focusLabel } from '../../domain/sessionFocus'
import { Button } from '../ui'
import { PRIMARY_CARD_CLASS } from './cardStyles'

export interface LastCompleteCardProps {
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
  actionDisabled?: boolean
}

/**
 * D158 (2026-06-12 shibui v2-04): the card carries ONLY the plan —
 * greeting, a quiet `Recommended` eyebrow, the focal CTA, and the
 * `Then:` queue line. The last-session meta line was removed (Recent
 * sessions' top row already carries recency + outcome) and the repeat
 * links were retired outright; `Start a different session` renders as
 * a page-level escape hatch in HomeScreen, outside this card.
 */
export function LastCompleteCard({
  nextFocus,
  backlog,
  onStartPlan,
  actionDisabled = false,
}: LastCompleteCardProps) {
  return (
    <section role="region" aria-label="Train again" className={PRIMARY_CARD_CLASS}>
      <p className="text-sm font-semibold text-text-primary">Ready to train again.</p>

      <div className="flex flex-col gap-2">
        {/* The eyebrow names what the CTA is: the plan's recommendation
            for today — same quiet uppercase micro-label vocabulary as
            Setup's section headings (setup-01 comp). */}
        <p className="text-center text-xs font-medium uppercase tracking-wider text-text-secondary">
          Recommended
        </p>
        <Button variant="primary" fullWidth disabled={actionDisabled} onClick={onStartPlan}>
          Start {focusLabel(nextFocus).toLowerCase()} session
        </Button>
        {backlog.length > 0 && (
          <p className="text-center text-sm text-text-secondary">
            Then: {focusListPhrase(backlog)}.
          </p>
        )}
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
