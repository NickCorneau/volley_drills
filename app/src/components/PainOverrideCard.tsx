import { useState } from 'react'

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
        Recovery Technique Session · {recoveryMinutes} min · Low intensity
      </div>

      <button
        type="button"
        onClick={onContinueRecovery}
        disabled={disabled}
        className={[
          'min-h-[54px] w-full rounded-[16px] bg-accent px-4 py-3',
          'text-base font-semibold text-white transition-colors active:bg-accent-pressed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
        ].join(' ')}
      >
        {disabled ? 'Creating session…' : 'Continue with Recovery Session'}
      </button>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={[
            'min-h-[54px] w-full rounded-[16px] border border-text-secondary/30 px-4 py-2',
            'text-sm text-text-secondary transition-colors active:bg-bg-warm',
          ].join(' ')}
        >
          Override — use my original session
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-medium text-warning">
            Training through pain risks further injury.
          </p>
          <button
            type="button"
            onClick={onOverride}
            disabled={disabled}
            className={[
              'min-h-[54px] w-full rounded-[16px] border border-warning/40 px-4 py-2',
              'text-sm font-medium text-warning transition-colors active:bg-warning-surface',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
          >
            {disabled ? 'Creating session…' : 'Yes, use original session'}
          </button>
        </div>
      )}
    </div>
  )
}
