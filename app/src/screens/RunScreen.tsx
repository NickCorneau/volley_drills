import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, StatusMessage } from '../components/ui'
import { useBlockPacingTicks } from '../hooks/useBlockPacingTicks'
import { usePreroll } from '../hooks/usePreroll'
import { useTimer } from '../hooks/useTimer'
import { useWakeLock } from '../hooks/useWakeLock'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { findSwapAlternatives } from '../domain/sessionBuilder'
import {
  playBlockEndBeep,
  playPrerollTick,
  playSubBlockTick,
} from '../lib/audio'
import { phaseLabel } from '../lib/format'
import { computeShortened } from '../lib/shorten'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { CUE_COMPACT_MAX } from '../domain/policies'
import { routes } from '../routes'
import { getStorageMeta, setStorageMeta } from '../services/storageMeta'

/**
 * Long cues: word-boundary preview (DOM shows preview only until expanded).
 * Short cues: whole string, no expand control.
 */
function cueDisplayParts(
  cue: string,
):
  | { kind: 'compact'; text: string }
  | { kind: 'long'; preview: string; full: string } {
  if (cue.length <= CUE_COMPACT_MAX) {
    return { kind: 'compact', text: cue }
  }
  const slice = cue.slice(0, 90)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > 40 ? lastSpace : 90
  const preview = `${cue.slice(0, cut).trim()}…`
  return { kind: 'long', preview, full: cue }
}

export function RunScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const executionLogId = searchParams.get('id') ?? ''
  const shortened =
    (location.state as { shortened?: boolean } | null)?.shortened ?? false

  const [showEndConfirm, setShowEndConfirm] = useState(false)
  // `ux.prerollHintDismissed` gate: the "Keep the phone unlocked" line
  // shows until the first preroll completes, then never again. `null`
  // while the read is in flight (hint stays hidden - fail-quiet).
  const [prerollHintDismissed, setPrerollHintDismissed] = useState<
    boolean | null
  >(null)
  // Long coaching cues collapse to a preview until expanded; short
  // cues (under `CUE_COMPACT_MAX`) render in full. Keeps the run view
  // out of wall-of-text territory without hiding short one-breath cues.
  const [coachingExpanded, setCoachingExpanded] = useState(false)
  const blockDurRef = useRef(0)
  const remainingRef = useRef(0)

  const runner = useSessionRunner(executionLogId, {
    getAccumulatedElapsed: useCallback(() => {
      return Math.max(0, blockDurRef.current - remainingRef.current)
    }, []),
    getEffectiveDurationSeconds: useCallback(() => {
      return blockDurRef.current > 0 ? blockDurRef.current : undefined
    }, []),
  })
  const {
    plan,
    execution,
    loaded,
    currentBlock,
    currentBlockIndex,
    totalBlocks,
    isPaused,
    startBlock,
    pauseBlock,
    resumeBlock,
    completeBlock,
    skipBlock,
    swapBlock,
    endSession,
    flushTimer,
    recoverTimerState,
  } = runner

  const defaultDuration = currentBlock
    ? currentBlock.durationMinutes * (shortened ? 30 : 60)
    : 0

  const [activeDuration, setActiveDuration] = useState(defaultDuration)
  const [prevBlockId, setPrevBlockId] = useState<string | null>(
    currentBlock?.id ?? null,
  )

  if (currentBlock && currentBlock.id !== prevBlockId) {
    // Sync per-block UI state to the new block identity in one pass
    // (approved during-render pattern; avoids a cascading second effect).
    setActiveDuration(defaultDuration)
    setPrevBlockId(currentBlock.id)
    setCoachingExpanded(false)
  }

  useEffect(() => {
    blockDurRef.current = activeDuration
  }, [activeDuration])

  const [runError, setRunError] = useState<string | null>(null)

  const handleBlockComplete = useCallback(async () => {
    try {
      // Foreground audio is the primary block-end cue on iOS (where
      // vibrate is unsupported per D54/D57); vibrate is best-effort
      // extra feedback on Android.
      playBlockEndBeep()
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      const isLast = await completeBlock()
      if (isLast) {
        navigate(routes.review(executionLogId), { replace: true })
      } else {
        navigate(routes.transition(executionLogId))
      }
    } catch (err) {
      console.error('Block complete failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [completeBlock, navigate, executionLogId])

  const timer = useTimer(activeDuration, handleBlockComplete)
  const wakeLock = useWakeLock()

  useEffect(() => {
    remainingRef.current = timer.remainingSeconds
  })

  // On preroll completion: dismiss the keep-phone-unlocked hint,
  // start the block in Dexie, and kick the timer + wake-lock.
  const handlePrerollComplete = useCallback(() => {
    setPrerollHintDismissed(true)
    void setStorageMeta('ux.prerollHintDismissed', true).catch((err) => {
      if (isSchemaBlocked()) return
      console.error('prerollHintDismissed write failed:', err)
    })
    startBlock()
      .then(() => {
        timer.start(activeDuration)
        wakeLock.request()
      })
      .catch((err: unknown) => {
        console.error('Failed to start block:', err)
        navigate(routes.home(), { replace: true })
      })
    if (navigator.vibrate) navigator.vibrate(100)
  }, [startBlock, timer, activeDuration, wakeLock, navigate])

  const preroll = usePreroll({
    onTick: playPrerollTick,
    onComplete: handlePrerollComplete,
  })
  const prerollCount = preroll.count
  const startWithPreroll = preroll.start

  // Load the `prerollHintDismissed` flag once on mount.
  //
  // Race-guard: both this read and `handlePrerollComplete` write the
  // same state. On a first-ever session where Dexie is cold, the read
  // can resolve AFTER the user's first preroll completes; the
  // functional setter below prefers `prev === true` over any read
  // result so a locally-dismissed state is sticky for the mounted
  // lifetime. Persistence is handled by the write in
  // `handlePrerollComplete`; the next mount picks it up.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dismissed = await getStorageMeta(
          'ux.prerollHintDismissed',
          (v): v is boolean => typeof v === 'boolean',
        )
        if (cancelled) return
        setPrerollHintDismissed((prev) =>
          prev === true ? true : dismissed === true,
        )
      } catch (err) {
        if (cancelled) return
        if (isSchemaBlocked()) return
        // Non-schema failure: preserve any locally-dismissed state;
        // otherwise leave as null so the hint stays hidden. Reading a
        // UX flag should never strand the run flow.
        console.error('prerollHintDismissed read failed:', err)
        setPrerollHintDismissed((prev) => (prev === true ? true : null))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const initRef = useRef(false)
  useEffect(() => {
    if (!execution || !currentBlock || initRef.current) return
    const bs = execution.blockStatuses[execution.activeBlockIndex]
    if (!bs) return

    initRef.current = true

    if (bs.status === 'in_progress') {
      recoverTimerState(defaultDuration)
        .then((recovered) => {
          if (recovered) {
            setActiveDuration(recovered.effectiveDurationSeconds)
            blockDurRef.current = recovered.effectiveDurationSeconds
            if (execution.status === 'paused') {
              timer.reset(recovered.remaining)
            } else {
              timer.start(recovered.remaining)
              wakeLock.request()
            }
          } else {
            if (execution.status === 'paused') {
              timer.reset(defaultDuration)
            } else {
              timer.start(defaultDuration)
              wakeLock.request()
            }
          }
        })
        .catch((err: unknown) => {
          console.error('Failed to recover timer:', err)
          if (execution.status === 'paused') {
            timer.reset(defaultDuration)
          } else {
            timer.start(defaultDuration)
            wakeLock.request()
          }
        })
    } else if (bs.status === 'planned' || execution.status === 'not_started') {
      queueMicrotask(startWithPreroll)
    }
  }, [execution, currentBlock, defaultDuration, recoverTimerState, timer, wakeLock, startWithPreroll])

  useEffect(() => {
    if (!timer.isRunning || !currentBlock) return
    const interval = setInterval(() => {
      const elapsed = activeDuration - remainingRef.current
      flushTimer(elapsed, activeDuration)
    }, 5000)
    return () => clearInterval(interval)
  }, [timer.isRunning, activeDuration, currentBlock, flushTimer])

  // Pre-close 2026-04-21 (thought 3b + P2-2): end-of-block 3/2/1
  // countdown ticks + optional sub-block pacing ticks. Implementation
  // and tests in `useBlockPacingTicks`. Bookkeeping resets on block-id
  // change (same-slot Swap keeps id stable; advancing does not).
  useBlockPacingTicks({
    running: timer.isRunning,
    blockId: currentBlock?.id ?? null,
    subBlockIntervalSeconds: currentBlock?.subBlockIntervalSeconds,
    remainingRef,
    blockDurRef,
    onEndCountdownTick: playPrerollTick,
    onSubBlockTick: playSubBlockTick,
  })

  useEffect(() => {
    if (timer.isRunning) {
      wakeLock.request()
    } else {
      wakeLock.release()
    }
  }, [timer.isRunning, wakeLock])

  const handlePause = useCallback(() => {
    timer.pause()
    const elapsed = activeDuration - remainingRef.current
    pauseBlock(elapsed, activeDuration)
  }, [timer, pauseBlock, activeDuration])

  const handleResume = useCallback(() => {
    timer.resume()
    resumeBlock()
  }, [timer, resumeBlock])

  const handleNext = useCallback(async () => {
    try {
      timer.pause()
      // Manual Next fires the same block-end beep as auto-complete
      // so the tester's audio cue is consistent whether the timer ran
      // out or they tapped early.
      playBlockEndBeep()
      if (navigator.vibrate) navigator.vibrate(100)
      const isLast = await completeBlock()
      if (isLast) {
        navigate(routes.review(executionLogId), { replace: true })
      } else {
        navigate(routes.transition(executionLogId))
      }
    } catch (err) {
      console.error('Next block failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [timer, completeBlock, navigate, executionLogId])

  const handleSkip = useCallback(async () => {
    try {
      timer.pause()
      // Skip also ends the block (skipped status instead of completed).
      // Beep so the audio cue matches any other end-of-block transition.
      playBlockEndBeep()
      if (navigator.vibrate) navigator.vibrate(100)
      const isLast = await skipBlock()
      if (isLast) {
        navigate(routes.review(executionLogId), { replace: true })
      } else {
        navigate(routes.transition(executionLogId))
      }
    } catch (err) {
      console.error('Skip block failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [timer, skipBlock, navigate, executionLogId])

  const handleShorten = useCallback(() => {
    // Math in `computeShortened` (tested separately); enforces that
    // newRemaining never exceeds current remaining.
    const { newRemainingSeconds, newDurationSeconds } = computeShortened(
      activeDuration,
      remainingRef.current,
    )
    setActiveDuration(newDurationSeconds)
    timer.reset(newRemainingSeconds)
  }, [timer, activeDuration])

  /**
   * Mid-run drill Swap. Pauses the timer (same pattern as Shorten);
   * delegates the atomic plan mutation + `swapCount` increment to
   * `useSessionRunner.swapBlock`. The no-alternates path is a belt
   * under suspenders — the UI already hides the button in that case.
   */
  const handleSwap = useCallback(async () => {
    try {
      if (timer.isRunning) {
        timer.pause()
        const elapsed = activeDuration - remainingRef.current
        pauseBlock(elapsed, activeDuration)
      }
      const ok = await swapBlock()
      if (!ok) {
        setRunError('No alternate drills available for this block.')
      }
    } catch (err) {
      console.error('Swap failed:', err)
      setRunError('Something went wrong. Try again or end session.')
    }
  }, [timer, pauseBlock, swapBlock, activeDuration])

  const [wasRunning, setWasRunning] = useState(false)

  const handleEndSessionRequest = useCallback(() => {
    if (timer.isRunning) {
      setWasRunning(true)
      timer.pause()
      pauseBlock(
        activeDuration - remainingRef.current,
        activeDuration,
      )
    } else {
      setWasRunning(false)
    }
    setShowEndConfirm(true)
  }, [timer, pauseBlock, activeDuration])

  const handleEndSessionConfirm = useCallback(async () => {
    try {
      await endSession()
      navigate(routes.review(executionLogId), { replace: true })
    } catch (err) {
      console.error('End session failed:', err)
      setRunError('Something went wrong ending the session. Try again.')
    }
  }, [endSession, navigate, executionLogId])

  const handleEndSessionCancel = useCallback(() => {
    setShowEndConfirm(false)
    if (wasRunning) {
      timer.resume()
      resumeBlock()
    }
  }, [wasRunning, timer, resumeBlock])

  useEffect(() => {
    if (!executionLogId) return
    if (execution && plan === null) {
      navigate(routes.home(), { replace: true })
      return
    }
    // Redirect to Review when the opened session is already terminal. This
    // covers deep links to a /run URL for a completed session and the
    // multi-tab race where tab A discards while tab B is still parked on
    // /run - without the guard, tab B would keep ticking and eventually
    // overwrite the ended-early record via advanceBlock. Red-team pass 2.
    if (
      execution &&
      (execution.status === 'completed' ||
        execution.status === 'ended_early')
    ) {
      navigate(routes.review(executionLogId), { replace: true })
    }
  }, [executionLogId, execution, plan, navigate])

  if (!plan || !execution || !currentBlock) {
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
    return <StatusMessage variant="loading" message="Loading session\u2026" />
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-7 pb-8">
      <div className="flex items-center justify-between pt-2">
        <SafetyIcon />
        <span className="text-sm font-semibold text-accent">
          {phaseLabel(currentBlock.type)}
        </span>
        <span className="text-sm font-medium text-text-secondary">
          {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </div>

      {/* Content stack: drill name → rationale → instructions → cues.
          Type sizes pinned by the outdoor-UI brief
          (`docs/research/outdoor-courtside-ui-brief.md`). */}
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          {currentBlock.drillName}
        </h1>
        {/* Rationale: one-sentence "why this block" (Tier 1a Unit 4).
            Rendered quietly above instructions so the reading order is
            what → why → how. Legacy plans without a rationale render
            nothing. */}
        {currentBlock.rationale && (
          <p className="text-sm leading-relaxed text-text-secondary">
            {currentBlock.rationale}
          </p>
        )}
        {/* `whitespace-pre-line` preserves `\n` in
            `courtsideInstructions` for drills with naturally list-shaped
            content (e.g. d26 stretch sequence).

            Partner-walkthrough polish round 2 (2026-04-22): dropped
            from `text-lg` (18 px) to `text-base` (16 px). The prior
            pre-close bump to 18 px made the same paragraph render
            visibly larger on Run than on Transition (where it was
            `text-sm` / 14 px), producing a font-size jump for the
            exact same drill copy between two adjacent screens in the
            flow. 16 px sits on the outdoor-UI brief's body floor,
            satisfies Seb P2-1 "readable at arm's length," and lets
            TransitionScreen meet it mid-scale (see its matching
            bump) so the paragraph reads as one voice across both
            surfaces. */}
        {currentBlock.courtsideInstructions && (
          <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
            {currentBlock.courtsideInstructions}
          </p>
        )}
        {currentBlock.coachingCue &&
          (() => {
            const parts = cueDisplayParts(currentBlock.coachingCue)
            if (parts.kind === 'compact') {
              return (
                <section
                  aria-labelledby="coaching-cue-title"
                  className="rounded-2xl border border-accent/30 bg-info-surface p-4"
                >
                  <h2
                    id="coaching-cue-title"
                    className="text-sm font-semibold text-accent"
                  >
                    Coaching note
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-base font-medium leading-relaxed text-accent">
                    {parts.text}
                  </p>
                </section>
              )
            }
            if (coachingExpanded) {
              return (
                <section
                  aria-labelledby="coaching-cue-title"
                  className="rounded-2xl border border-accent/30 bg-info-surface p-4"
                >
                  <h2
                    id="coaching-cue-title"
                    className="text-sm font-semibold text-accent"
                  >
                    Coaching note
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-base font-medium leading-relaxed text-accent">
                    {parts.full}
                  </p>
                  <button
                    type="button"
                    aria-expanded
                    onClick={() => setCoachingExpanded(false)}
                    className="mt-3 flex w-full min-h-[56px] items-center justify-center rounded-xl border border-accent/30 bg-surface-calm px-4 text-sm font-semibold text-accent transition-colors active:bg-bg-warm"
                  >
                    Show less
                  </button>
                </section>
              )
            }
            return (
              <section
                aria-labelledby="coaching-cue-title"
                className="rounded-2xl border border-accent/30 bg-info-surface p-4"
              >
                <h2
                  id="coaching-cue-title"
                  className="text-sm font-semibold text-accent"
                >
                  Coaching note
                </h2>
                <p className="mt-2 text-base font-medium leading-relaxed text-accent">
                  {parts.preview}
                </p>
                <button
                  type="button"
                  aria-expanded={false}
                  onClick={() => setCoachingExpanded(true)}
                  className="mt-3 flex w-full min-h-[56px] items-center justify-center rounded-xl border border-accent/30 bg-surface-calm px-4 text-sm font-semibold text-accent transition-colors active:bg-bg-warm"
                >
                  Show full coaching note
                </button>
              </section>
            )
          })()}
      </div>

      {prerollCount != null ? (
        <div className="flex flex-col items-center gap-4 py-8">
          {/* Preroll countdown shares BlockTimer's display face
              (`font-mono` / JetBrains Mono Variable + slashed-zero)
              so the two timer surfaces read as one instrument; accent
              color signals "get ready" vs the primary live timer. */}
          <span
            className="font-mono text-[72px] font-bold tabular-nums leading-none text-accent"
            style={{ fontFeatureSettings: '"zero" 1' }}
          >
            {prerollCount}
          </span>
          <p className="text-sm font-medium text-text-secondary">
            Get ready&hellip;
          </p>
          {/* iOS Safari PWA suspends AudioContext on lock, so the
              block-end beep won't fire through a locked screen. The
              full lock-screen presence spike is post-D91 backlog. Until
              then we set the expectation on the preroll. Shown only
              until the first preroll completes
              (`storageMeta['ux.prerollHintDismissed']`). */}
          {prerollHintDismissed === false && (
            <p className="max-w-[280px] text-center text-sm text-text-secondary">
              Keep the phone unlocked so the block-end beep can fire.
            </p>
          )}
        </div>
      ) : (
      <BlockTimer
        remainingSeconds={timer.remainingSeconds}
        totalSeconds={activeDuration}
        isPaused={isPaused}
      />
      )}

      {runError && <StatusMessage variant="error" message={runError} />}

      {prerollCount == null && (() => {
        // Swap is only offered when the block has at least one curated
        // alternate. Warmup/wrap are always empty per D85/D105.
        const hasAlternates = plan.context
          ? findSwapAlternatives(currentBlock, plan.context).length > 0
          : false
        return (
          <RunControls
            isPaused={isPaused}
            isRequired={currentBlock.required}
            onPause={handlePause}
            onResume={handleResume}
            onNext={handleNext}
            onSkip={handleSkip}
            onShorten={handleShorten}
            onEndSession={handleEndSessionRequest}
            onSwap={hasAlternates ? () => void handleSwap() : undefined}
          />
        )
      })()}

      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className="w-full max-w-[390px] rounded-[16px] bg-bg-primary p-6 shadow-lg">
            <h2 className="text-lg font-bold text-text-primary">
              End session early?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {currentBlock.type === 'wrap'
                ? 'You\u2019re in your downshift. Two or three minutes of easy walking before you leave is an honest finish. Your progress will be saved.'
                : 'You still have blocks remaining. Your progress will be saved and you can review what you completed.'}
            </p>
            {/* Safe-primary first, destructive below: keeps "Go back" as the
                default thumb-target after the pause, mirrors the iOS/Android
                action-sheet convention, and prevents an accidental end of
                session from the paused-timer state. Red-team UX #6. */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleEndSessionCancel}
              >
                Go back
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => void handleEndSessionConfirm()}
              >
                End session
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
