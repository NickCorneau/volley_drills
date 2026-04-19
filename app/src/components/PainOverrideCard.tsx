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
        <span className="shrink-0 text-xl" aria-hidden>
          ⚠️
        </span>
        <div>
          <h3 className="font-semibold text-text-primary">
            Switched to a lighter session
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Lower-load technique work today. You can also skip.
          </p>
        </div>
      </div>

      <div className="rounded-[8px] bg-white/60 px-3 py-2.5 text-sm font-medium text-text-primary">
        Lighter Technique Session &middot; {recoveryMinutes} min &middot; Low
        intensity
      </div>

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
          <p className="text-center text-xs font-medium text-warning">
            If pain is severe, new, worsening, or persistent, stop training and
            consult a qualified clinician.
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
