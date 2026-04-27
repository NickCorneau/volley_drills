import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, ScreenShell, StatusMessage } from '../components/ui'
import { findSwapAlternatives } from '../domain/sessionBuilder'
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
  const [swapError, setSwapError] = useState<string | null>(null)

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

  /**
   * Pre-start Swap: the tester realizes on Transition they want a
   * different drill before committing to the next block. Same
   * underlying call as RunScreen's mid-block Swap (`runner.swapBlock`)
   * which handles the override + swapCount increment atomically.
   * No timer pause / resume dance here because the block hasn't
   * started; the effective `nextBlock` appears in the UI immediately.
   */
  const handleSwap = useCallback(async () => {
    setSwapError(null)
    try {
      if (navigator.vibrate) navigator.vibrate(100)
      const ok = await runner.swapBlock()
      if (!ok) {
        setSwapError('No alternate drills available for this block.')
      }
    } catch (err) {
      console.error('Swap failed:', err)
      setSwapError('Something went wrong. Try again.')
    }
  }, [runner])

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

  const hasAlternates = plan.context
    ? findSwapAlternatives(nextBlock, plan.context).length > 0
    : false

  return (
    <ScreenShell>
      {/*
        2026-04-27 plan Item 9: TransitionScreen is now the rehearsal
        beat only. The reflective beat (per-drill chip + optional
        counts) lives on `/run/check` upstream of this screen, so this
        body is single-purpose: just-finished pill (provenance), Up
        Next briefing (drill name + rationale + full prep + cue), and
        the action footer. The capture state, draft persistence
        effects, capture-target derivation, and "Tag how that drill
        went" gating hint moved verbatim into `DrillCheckScreen`. See
        `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 9.

        2026-04-22 iPhone-viewport layout pass: the prior `mt-auto`
        on the button row was decorative — it only activated when the
        screen div happened to fill main, which it rarely did because
        nothing enforced shell height. Pinning the CTA stack to
        `ScreenShell.Footer` makes it genuinely bottom-locked so a
        long up-next preview (d26 stretches, long coaching cue) can
        scroll without pushing `Start next block` below the fold.

        2026-04-22 parity pass: the body used to render a truncated
        preview (first line of `courtsideInstructions`, `text-sm`,
        secondary color, 2-line clamp). Founder walkthrough caught
        the resulting inconsistency — the same paragraph rendered at
        a different size + color + with an ellipsis on Transition vs
        the full text at `text-base` primary on Run, one tap away.
        That failure mode is worse than "scroll on long drills":
        short drills got truncated even though they fit, and long
        drills lost the expand affordance. The body now mirrors Run's
        treatment (full title, rationale, instructions, coaching cue
        — same typography, same colors) so Transition reads as a
        quiet dress-rehearsal of Run. The CTA stack in the footer is
        the only thing that differs between the two surfaces: decide
        here, execute there.
      */}
      <ScreenShell.Header className="flex items-center justify-between pt-2 pb-3">
        <SafetyIcon />
        {/* Phase F8 (2026-04-19): was `text-sm font-bold uppercase
            tracking-wider`. Dropped the dashboard-eyebrow voice to
            `text-sm font-medium` sentence case; the "Transition"
            label is a calm status marker, not a hero. See
            `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
        <span className="text-sm font-medium text-text-secondary">Transition</span>
        <span className="text-sm font-medium text-text-secondary">
          Next: {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-4 pb-4">
        {prevBlock && (
          <div className="flex items-start gap-2.5 rounded-[12px] bg-bg-warm p-3">
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
              <p className="font-semibold text-text-primary">{prevBlock.drillName}</p>
              <p className="text-sm text-success">
                {prevBlockStatus?.status === 'completed' ? 'Complete' : 'Skipped'}
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-text-secondary/10" />

        {skipError && <StatusMessage variant="error" message={skipError} />}

        {swapError && <StatusMessage variant="error" message={swapError} />}

        <div className="flex flex-col gap-1.5">
          {/* "Up next" eyebrow keeps the pause-before-action framing so
            Transition doesn't read as "you're already on Run." Quiet
            `text-xs font-medium` so the drill title below carries the
            focal weight (Phase F8 typography). */}
          <p className="text-xs font-medium text-text-secondary">Up next</p>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {nextBlock.drillName}
          </h1>
          {nextBlock.rationale && (
            <p className="mt-0.5 text-sm italic leading-snug text-text-secondary">
              {nextBlock.rationale}
            </p>
          )}
          <p className="mt-1 text-sm text-text-secondary">
            {formatDuration(nextBlock.durationMinutes)}
          </p>
        </div>

        {/* Full prep at Run's typography: `text-base` primary, pre-line,
          relaxed leading. Matches RunScreen exactly so the text reads
          the same across both surfaces. Long drills (stretch lists,
          warmup lists) scroll inside ScreenShell.Body; the bottom
          fade gradient already signals "more below." */}
        {nextBlock.courtsideInstructions && (
          <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
            {nextBlock.courtsideInstructions}
          </p>
        )}

        {/* Coaching cue uses the exact same quiet left-rule treatment as
          RunScreen so testers see the same visual voice across both
          screens. Styled identically down to the classes. */}
        {nextBlock.coachingCue && (
          <section
            aria-labelledby="transition-coaching-cue-title"
            className="border-l-2 border-accent/70 pl-3"
          >
            <span
              id="transition-coaching-cue-title"
              className="text-xs font-semibold uppercase tracking-wide text-accent"
            >
              Cue
            </span>
            <p className="mt-1 whitespace-pre-line text-base font-medium leading-relaxed text-text-primary">
              {nextBlock.coachingCue}
            </p>
          </section>
        )}
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
        <Button variant="primary" fullWidth onClick={handleStartNext}>
          Start next block
        </Button>
        {/* Secondary row: Swap + Shorten side-by-side when both are
            available, Shorten full-width when the current block can't
            swap (warmup/wrap per D85/D105, or a slot with a single
            candidate in the pool). Pre-start Swap was added 2026-04-22
            because forcing the tester to Start → Run → Swap wasted a
            preroll cycle + let the timer start on a drill they
            already knew they wanted to change. Same underlying call
            as RunScreen's mid-block Swap (`runner.swapBlock`); the
            Dexie live query refreshes `nextBlock` in place so the
            preview updates without a route change.

            `Shorten block` stays `variant="outline"` (partner
            walkthrough 2026-04-22 item 6) — it's the primary escape
            for a tired athlete and deserves pill-at-CTA-width
            visibility. When paired with Swap both render as equal-
            weight `secondary` pills so neither dominates. */}
        {hasAlternates ? (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleSwap}
              aria-label="Swap drill"
            >
              Swap drill
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleStartShortened}>
              Shorten
            </Button>
          </div>
        ) : (
          <Button variant="outline" fullWidth onClick={handleStartShortened}>
            Shorten block
          </Button>
        )}
        {!nextBlock.required && (
          <div className="flex items-center justify-center">
            <Button variant="ghost" className="text-text-secondary" onClick={handleSkip}>
              Skip block
            </Button>
          </div>
        )}
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
