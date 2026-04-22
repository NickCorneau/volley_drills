import { useState } from 'react'
import { Button } from './ui'

interface PainOverrideCardProps {
  recoveryMinutes: number
  disabled?: boolean
  /**
   * False when required upstream fields (e.g. training recency) haven't been
   * answered yet. When false, the primary/override actions are held disabled
   * with an inline hint so a tap is never a silent no-op. Red-team bug #1.
   */
  canAct?: boolean
  onContinueRecovery: () => void
  onOverride: () => void
}

export function PainOverrideCard({
  recoveryMinutes,
  disabled,
  canAct = true,
  onContinueRecovery,
  onOverride,
}: PainOverrideCardProps) {
  const [confirming, setConfirming] = useState(false)

  // Derive the visible confirming state from the intent flag AND whether
  // the card is actionable at all. This way, if an upstream field flips the
  // card back to "can't act yet", the dangerous-looking confirm UI drops
  // out without needing to setState() during render or inside an effect.
  // Red-team bug #3.
  const isConfirming = confirming && canAct
  const actionsDisabled = disabled || !canAct

  return (
    <div className="flex flex-col gap-4 rounded-[12px] bg-warning-surface p-4">
      <div className="flex items-start gap-3">
        {/* Phase F12 (2026-04-19): the old `⚠️` emoji was replaced
            with an inline stroke SVG so the warning triangle inherits
            `text-warning` and renders the same on every OS. Emoji in
            UI chrome ties the brand to the host-OS glyph (see
            `app/src/components/Brandmark.tsx` for the same rationale
            applied to the volleyball logo). */}
        <svg
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-warning"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 2 21h20L12 3z" />
          <line x1="12" y1="10" x2="12" y2="14" />
          <line x1="12" y1="17.5" x2="12" y2="17.5" />
        </svg>
        <div>
          <h3 className="font-semibold text-text-primary">
            Switched to a lighter session
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Lower-load technique work today.
          </p>
        </div>
      </div>

      {/* 2026-04-21: prior copy was "Lighter Technique Session · N min"
          where N was the sum-of-mins of kept slots (10 for a 15-min
          request, 16 for 25). Two problems in lockstep:
          (a) "Technique" collided with the `technique` block type the
              RunScreen phase pill already shows, so users parsed the
              card as meta-marketing rather than a session label; and
          (b) the shortened minute count made the lighter path read as
              "extended warmup → cooldown" because the Work block was
              only 4 min flanked by 3-and-3. Recovery now respects the
              requested `timeProfile` (see
              `estimateRecoverySessionMinutes`) and the title drops the
              block-type collision. */}
      <div className="rounded-[8px] bg-white/60 px-3 py-2.5 text-sm font-medium text-text-primary">
        Lighter session &middot; {recoveryMinutes} min
      </div>

      {/* Partner-walkthrough polish 2026-04-22 (`D129` / `D130`):
          Seb's wording-check reconciliation row surfaced that the
          lighter session lowers load but keeps the requested duration
          (per D113 adaptation-engine bands + the
          `estimateRecoverySessionMinutes` contract), and the reason
          isn't explained to the user. One quiet line names the swap
          so the pick feels honest, not mysterious. Courtside-copy §2
          rec-player check: `load` is used consistently in this card
          (`Lower-load technique work today.` above) and rules out
          "deload" / clinical jargon; `your pick` preserves agency
          framing. The Override path below still exists for the tester
          who knows what they want. See
          `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`
          wording-check `PainOverrideCard` row and
          `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 3. */}
      <p className="text-xs leading-relaxed text-text-secondary">
        We lower the load, not the time. Your pick.
      </p>

      <Button
        variant="primary"
        fullWidth
        onClick={onContinueRecovery}
        disabled={actionsDisabled}
      >
        {disabled ? 'Creating session\u2026' : 'Continue with lighter session'}
      </Button>

      {!isConfirming ? (
        <Button
          variant="outline"
          fullWidth
          className="border-text-secondary/30 text-sm text-text-secondary"
          onClick={() => setConfirming(true)}
          disabled={actionsDisabled}
        >
          Override: use my original session
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            fullWidth
            className="border-warning/40 text-sm text-warning"
            onClick={onOverride}
            disabled={actionsDisabled}
          >
            {disabled
              ? 'Creating session\u2026'
              : 'Yes, use original session'}
          </Button>
          <Button
            variant="ghost"
            fullWidth
            className="text-text-secondary"
            onClick={() => setConfirming(false)}
            disabled={disabled}
          >
            Never mind
          </Button>
          {/* 2026-04-20 physio-review: generic "severe, new, worsening,
              or persistent" legalese reads past. Concrete consequence
              language ("turn a small issue into a long layoff") plus a
              specific time cue ("more than a few days") does the
              actual friction work a hard block couldn't. */}
          <p className="text-center text-xs font-medium text-warning">
            Training through pain that&apos;s sharp, getting worse, or
            lasting more than a few days can turn a small issue into a
            long layoff. If unsure, stop and see a clinician.
          </p>
        </div>
      )}

      {!canAct && (
        <p className="text-center text-xs text-text-secondary">
          Answer “When did you last train?” above to continue.
        </p>
      )}
    </div>
  )
}
