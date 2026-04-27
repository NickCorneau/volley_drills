import { useState } from 'react'
import { Button } from './ui'

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
  // Two-step confirm so a single misdirected tap on "Discard" (which sits
  // directly below the primary Reopen session button) can't destroy an
  // in-progress session. Red-team bug #4.
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)

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
          {/* Phase F8 (2026-04-19): was `text-xs font-semibold uppercase
              tracking-wider`. Dropped the dashboard-eyebrow voice to
              sentence-case `font-medium` supporting copy so the block
              name beneath it (drill title) carries the visual weight.
              See `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
          <p className="text-xs font-medium text-text-secondary">
            Paused at
          </p>
          <p className="mt-1 font-semibold text-text-primary">
            {blockDrillName}
          </p>
          <p className="mt-0.5 text-sm text-text-secondary">
            {blockPositionLabel}
          </p>
          <p className="mt-3 text-sm text-text-secondary">
            Interrupted{' '}
            <span className="font-medium text-text-primary">
              {interruptedAgo}
            </span>
          </p>
        </div>

        {!confirmingDiscard ? (
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="primary" fullWidth onClick={onResume}>
              Reopen session
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setConfirmingDiscard(true)}
            >
              Discard
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm text-text-secondary">
              Ends this session. Progress is saved to history but can&rsquo;t
              be resumed.
            </p>
            <Button variant="danger" fullWidth onClick={onDiscard}>
              Yes, discard session
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setConfirmingDiscard(false)}
            >
              Keep session
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
