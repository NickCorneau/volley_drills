type ResumePromptProps = {
  sessionName: string
  blockDrillName: string
  blockPositionLabel: string
  interruptedAgo: string
  onResume: () => void
  onDiscard: () => void
}

export function ResumePrompt({
  sessionName,
  blockDrillName,
  blockPositionLabel,
  interruptedAgo,
  onResume,
  onDiscard,
}: ResumePromptProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-prompt-title"
    >
      <div className="w-full max-w-[340px] rounded-[12px] bg-bg-primary p-6 shadow-lg">
        <h2
          id="resume-prompt-title"
          className="text-lg font-bold text-text-primary"
        >
          Session in progress
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{sessionName}</p>

        <div className="mt-5 rounded-[12px] bg-bg-warm p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Paused at
          </p>
          <p className="mt-1 font-semibold text-text-primary">{blockDrillName}</p>
          <p className="mt-0.5 text-sm text-text-secondary">{blockPositionLabel}</p>
          <p className="mt-3 text-sm text-text-secondary">
            Interrupted{' '}
            <span className="font-medium text-text-primary">{interruptedAgo}</span>
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className={[
              'min-h-[52px] w-full rounded-[16px] px-4 py-3 text-base font-semibold text-white',
              'bg-accent transition-colors active:bg-accent-pressed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Resume Session
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className={[
              'min-h-[52px] w-full rounded-[16px] border-2 border-text-secondary/25',
              'bg-transparent px-4 py-3 text-base font-semibold text-text-primary',
              'transition-colors hover:bg-bg-warm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            ].join(' ')}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}
