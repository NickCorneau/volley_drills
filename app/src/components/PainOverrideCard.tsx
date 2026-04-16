import { useState } from 'react'
import { Button } from './ui'

interface PainOverrideCardProps {
  recoveryMinutes: number
  disabled?: boolean
  onContinueRecovery: () => void
  onOverride: () => void
}

export function PainOverrideCard({
  recoveryMinutes,
  disabled,
  onContinueRecovery,
  onOverride,
}: PainOverrideCardProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex flex-col gap-4 rounded-[12px] bg-warning-surface p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 text-xl" aria-hidden>
          ⚠️
        </span>
        <div>
          <h3 className="font-semibold text-text-primary">
            Session adjusted for recovery
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Your session has been switched to recovery-only technique work. This
            protects you while you're dealing with pain.
          </p>
        </div>
      </div>

      <div className="rounded-[8px] bg-white/60 px-3 py-2.5 text-sm font-medium text-text-primary">
        Recovery Technique Session &middot; {recoveryMinutes} min &middot; Low
        intensity
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={onContinueRecovery}
        disabled={disabled}
      >
        {disabled ? 'Creating session\u2026' : 'Continue with Recovery Session'}
      </Button>

      {!confirming ? (
        <Button
          variant="outline"
          fullWidth
          className="border-text-secondary/30 text-sm text-text-secondary"
          onClick={() => setConfirming(true)}
        >
          Override — use my original session
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-medium text-warning">
            Training through pain risks further injury.
          </p>
          <Button
            variant="outline"
            fullWidth
            className="border-warning/40 text-sm text-warning"
            onClick={onOverride}
            disabled={disabled}
          >
            {disabled
              ? 'Creating session\u2026'
              : 'Yes, use original session'}
          </Button>
        </div>
      )}
    </div>
  )
}
