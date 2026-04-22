import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, ScreenShell, StatusMessage } from '../components/ui'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { formatDuration } from '../lib/format'
import { routes } from '../routes'

export function TransitionScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id') ?? ''

  const runner = useSessionRunner(executionLogId)
  const { plan, execution, loaded, currentBlockIndex, totalBlocks } = runner

  const prevBlockIdx = currentBlockIndex - 1
  const prevBlock = plan?.blocks[prevBlockIdx] ?? null
  const prevBlockStatus = execution?.blockStatuses[prevBlockIdx] ?? null
  const nextBlock = plan?.blocks[currentBlockIndex] ?? null
  const hasNextBlock = currentBlockIndex < totalBlocks

  useEffect(() => {
    if (!execution) return
    if (execution.status === 'completed' || !hasNextBlock) {
      navigate(routes.review(executionLogId), { replace: true })
    }
  }, [execution, hasNextBlock, executionLogId, navigate])

  const handleStartNext = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(100)
    navigate(routes.run(executionLogId))
  }, [navigate, executionLogId])

  const handleStartShortened = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(100)
    navigate(routes.run(executionLogId), { state: { shortened: true } })
  }, [navigate, executionLogId])

  const [isSkipping, setIsSkipping] = useState(false)
  const [skipError, setSkipError] = useState<string | null>(null)

  const handleSkip = useCallback(async () => {
    if (isSkipping) return
    setIsSkipping(true)
    try {
      if (navigator.vibrate) navigator.vibrate(100)
      const isLast = await runner.skipBlock()
      if (isLast) {
        navigate(routes.review(executionLogId), { replace: true })
      }
    } catch (err) {
      console.error('Skip block failed:', err)
      setSkipError('Something went wrong. Try again.')
      setIsSkipping(false)
    }
  }, [runner, navigate, executionLogId, isSkipping])

  if (!plan || !execution || !nextBlock) {
    if (loaded) {
      return (
        <StatusMessage
          variant="empty"
          message="Session not found."
          action={
            <Link
              to={routes.home()}
              className="min-h-[54px] inline-flex items-center px-4 font-semibold text-accent underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          }
        />
      )
    }
    return <StatusMessage variant="loading" />
  }

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: the prior `mt-auto`
        on the button row was decorative — it only activated when the
        screen div happened to fill main, which it rarely did because
        nothing enforced shell height. Pinning `Start next block` /
        `Shorten block` / `Skip block` to `ScreenShell.Footer` makes
        the CTA stack genuinely bottom-locked so a long up-next
        preview (d26 stretches, long coaching cue) can scroll without
        pushing `Start next block` below the fold.
      */}
      <ScreenShell.Header className="flex items-center justify-between pt-2 pb-3">
        <SafetyIcon />
        {/* Phase F8 (2026-04-19): was `text-sm font-bold uppercase
            tracking-wider`. Dropped the dashboard-eyebrow voice to
            `text-sm font-medium` sentence case; the "Transition"
            label is a calm status marker, not a hero. See
            `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
        <span className="text-sm font-medium text-text-secondary">
          Transition
        </span>
        <span className="text-sm font-medium text-text-secondary">
          Next: {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-6 pb-4">
      {prevBlock && (
        <div className="flex items-start gap-3 rounded-[12px] bg-bg-warm p-4">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
            {prevBlockStatus?.status === 'completed' ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-semibold text-text-primary">
              {prevBlock.drillName}
            </p>
            <p className="text-sm text-success">
              {prevBlockStatus?.status === 'completed' ? 'Complete' : 'Skipped'}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-text-secondary/10" />

      {skipError && <StatusMessage variant="error" message={skipError} />}

      <div className="flex flex-col gap-2">
        {/* Phase F8 (2026-04-19): was `text-xs font-semibold uppercase
            tracking-wider` eyebrow. Dropped to sentence-case `text-xs
            font-medium` so the next-block h1 below carries the focal
            weight. Drill-title h1 gained `tracking-tight` to match the
            Review / prep-screen display-heading treatment. */}
        <p className="text-xs font-medium text-text-secondary">
          Up next
        </p>
        {/* Founder test-run feedback 2026-04-21 (round 3): unified
            with RunScreen + ReviewScreen. `text-2xl font-bold` →
            `text-xl font-semibold` across every page-title h1 so
            the preview on TransitionScreen doesn't outweigh the
            actual drill title on Run itself. */}
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          {nextBlock.drillName}
        </h1>
        <p className="text-sm text-text-secondary">
          {formatDuration(nextBlock.durationMinutes)}
        </p>
        {/* Founder test-run feedback 2026-04-21 (round 3): matches
            the RunScreen render - `whitespace-pre-line` honors `\n`
            in list-shaped drill content (d26's six numbered
            stretches) so the Transition preview scans as a list too.

            Partner-walkthrough polish round 2 (2026-04-22): bumped
            from `text-sm` (14 px) to `text-base` (16 px) so the
            same drill paragraph reads at the same size on this
            surface as on RunScreen (which dropped from `text-lg`
            to `text-base` in the same pass). Previously the exact
            same copy rendered at 14 px here and 18 px one tap
            later, producing a jarring font-size jump across two
            adjacent screens in the flow. 16 px also sits on the
            outdoor-UI brief's body floor. */}
        {nextBlock.courtsideInstructions && (
          <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
            {nextBlock.courtsideInstructions}
          </p>
        )}
      </div>

      {skipError && <StatusMessage variant="error" message={skipError} />}
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
        <Button variant="primary" fullWidth onClick={handleStartNext}>
          Start next block
        </Button>
        {/* Partner-walkthrough polish 2026-04-22 (design review
            Transition section): `Shorten block` is the only escape a
            tired athlete has on this surface, so it was promoted from
            `variant="ghost"` (a bare accent text link) to
            `variant="outline"` full-width. Outlined pill at CTA width
            surfaces the option when it matters without violating the
            calm envelope - same radius, same height, quieter chrome
            than primary. `Skip block` stays ghost + centered because
            it is a lower-priority escape (only exists on non-required
            blocks) and bumping both would double the action weight
            below the primary CTA. See
            `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 6. */}
        <Button variant="outline" fullWidth onClick={handleStartShortened}>
          Shorten block
        </Button>
        {!nextBlock.required && (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              className="text-text-secondary"
              onClick={handleSkip}
            >
              Skip block
            </Button>
          </div>
        )}
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
