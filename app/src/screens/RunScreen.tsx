import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, StatusMessage } from '../components/ui'
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
import { routes } from '../routes'

export function RunScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const executionLogId = searchParams.get('id') ?? ''
  const shortened =
    (location.state as { shortened?: boolean } | null)?.shortened ?? false

  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [prerollCount, setPrerollCount] = useState<number | null>(null)
  // Feedback pass 2026-04-21: coaching cues default collapsed so the
  // run view stays quiet. Phase F Unit 5 opened them by default to
  // ensure visibility, but field testing showed the extra chrome
  // crowds the block and users prefer revealing cues on demand.
  const [showInstructions, toggleInstructions] = useReducer(
    (s: boolean) => !s,
    false,
  )
  const blockDurRef = useRef(0)
  const remainingRef = useRef(0)
  // Pre-close 2026-04-21 (thought 3b, P2-2): audio-tick bookkeeping
  // for the block-end countdown (3 / 2 / 1 ticks before the block-end
  // beep) and the sub-block pacing tick (fires every
  // `subBlockIntervalSeconds` for drills like d28 Beach Prep Three
  // (45 s) and d26 Stretch Micro-sequence (30 s)). Refs so the poll
  // loop below can mutate without re-rendering RunScreen.
  const firedEndCountdownSecondsRef = useRef<Set<number>>(new Set())
  const lastSubBlockTickIndexRef = useRef(0)

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
    setActiveDuration(defaultDuration)
    setPrevBlockId(currentBlock.id)
  }

  useEffect(() => {
    blockDurRef.current = activeDuration
  }, [activeDuration])

  const [runError, setRunError] = useState<string | null>(null)

  const handleBlockComplete = useCallback(async () => {
    try {
      // Phase F Unit 3 (2026-04-19): foreground audio is the PRIMARY
      // block-end cue for iOS Safari PWA testers (where vibrate is
      // unsupported per D54/D57). Vibrate stays for Android + any
      // desktop haptic surface. Both are best-effort; the core flow
      // proceeds even if both fail silently.
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

  const prerollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startWithPreroll = useCallback(() => {
    setPrerollCount(3)
    // Phase F Unit 3 (2026-04-19): first tick fires immediately on the
    // "3" frame so the audio cue matches the visual; subsequent ticks
    // (2, 1, go) fire inside the interval callback below.
    playPrerollTick()
    let count = 3
    prerollTimerRef.current = setInterval(() => {
      count -= 1
      if (count <= 0) {
        if (prerollTimerRef.current) clearInterval(prerollTimerRef.current)
        prerollTimerRef.current = null
        setPrerollCount(null)
        // The "go" tick at count==0 - same beep as 2/1 so the tester
        // gets a consistent sonic ramp into block start.
        playPrerollTick()
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
      } else {
        setPrerollCount(count)
        playPrerollTick()
      }
    }, 1000)
  }, [startBlock, timer, activeDuration, wakeLock, navigate])

  useEffect(() => {
    return () => {
      if (prerollTimerRef.current) clearInterval(prerollTimerRef.current)
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

  // Pre-close 2026-04-21 (thought 3b + P2-2): audio-tick poll loop.
  //
  // Two responsibilities, both driven off the continuously-updating
  // `remainingRef` that the RAF tick loop maintains:
  //
  //  1. **Block-end 3-sec countdown.** When `ceil(remaining)` transitions
  //     through 3 -> 2 -> 1, fire `playPrerollTick()` once per second.
  //     The block-end beep itself still fires from `handleBlockComplete`
  //     at remaining = 0, so the audible shape becomes
  //     tick-tick-tick-BEEP - mirroring the preroll 3/2/1 entrance ramp
  //     at the exit of every block. Thought 3b in the founder pre-close
  //     review ("otherwise it just beeps and its done").
  //
  //  2. **Sub-block pacing tick.** When a drill variant declares
  //     `subBlockIntervalSeconds`, fire `playSubBlockTick()` at each
  //     multiple of that interval so e.g. Beach Prep Three's four ~45 s
  //     segments each get an audible boundary cue. Partner walkthrough
  //     P2-2.
  //
  // Poll at 250 ms: precision of ±125 ms on audio boundaries, which is
  // well inside human-audible tolerance for a "pacing pulse"; low enough
  // CPU work that running alongside the RAF tick is not a concern.
  //
  // Ref-based bookkeeping (Set of fired countdown seconds; last-fired
  // sub-block index) lives across poll ticks and resets on block change
  // via the separate reset effect below.
  //
  // Guards:
  //  - sub-block ticks suppressed when `remaining < 4` to avoid
  //    colliding with the 3-sec end-countdown + block-end beep on the
  //    final boundary of a drill whose interval divides block length
  //    evenly (d28's 45 s x 4 = 3 min; d26's 30 s x 6 = 3 min).
  useEffect(() => {
    if (!timer.isRunning || !currentBlock) return
    const subBlockIntervalSeconds = currentBlock.subBlockIntervalSeconds
    const interval = setInterval(() => {
      const remaining = remainingRef.current
      if (remaining <= 0) return

      // (1) End-of-block countdown.
      const ceil = Math.ceil(remaining)
      if (ceil >= 1 && ceil <= 3 && !firedEndCountdownSecondsRef.current.has(ceil)) {
        firedEndCountdownSecondsRef.current.add(ceil)
        playPrerollTick()
      }

      // (2) Sub-block pacing tick.
      if (
        subBlockIntervalSeconds &&
        subBlockIntervalSeconds > 0 &&
        remaining >= 4
      ) {
        const elapsed = blockDurRef.current - remaining
        const currentIndex = Math.floor(elapsed / subBlockIntervalSeconds)
        if (
          currentIndex > lastSubBlockTickIndexRef.current &&
          currentIndex >= 1
        ) {
          lastSubBlockTickIndexRef.current = currentIndex
          playSubBlockTick()
        }
      }
    }, 250)
    return () => clearInterval(interval)
  }, [timer.isRunning, currentBlock])

  // Reset audio-tick bookkeeping on block change so the new block
  // starts with a clean countdown set and its own sub-block index
  // counter. Tied to `currentBlock?.id` so a same-slot Swap does not
  // reset the counters (the Swap keeps block.id stable per
  // `findSwapAlternatives` contract), but advancing to the next block
  // does.
  useEffect(() => {
    firedEndCountdownSecondsRef.current = new Set()
    lastSubBlockTickIndexRef.current = 0
  }, [currentBlock?.id])

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
      // Phase F Unit 3 (2026-04-19): manual Next fires the same
      // block-end beep as auto-complete so the tester gets consistent
      // courtside feedback regardless of whether the timer ran out or
      // they tapped early.
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
      // Phase F Unit 3: Skip also ends the block (just with a skipped
      // status instead of completed); beep so the tester's audio cue
      // matches the end-of-block transition.
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
    // Pure math lives in `computeShortened` so the invariant "newRemaining
    // never exceeds current remaining" is covered by direct unit tests.
    // Red-team bug #2.
    const { newRemainingSeconds, newDurationSeconds } = computeShortened(
      activeDuration,
      remainingRef.current,
    )
    setActiveDuration(newDurationSeconds)
    timer.reset(newRemainingSeconds)
  }, [timer, activeDuration])

  /**
   * Phase F Unit 4 (2026-04-19): Swap drill mid-run.
   *
   * - Pauses the timer if running (same pattern as Shorten) so the
   *   tester doesn't burn block time on a stale drill display.
   * - Delegates the plan mutation + swapCount increment to
   *   `useSessionRunner.swapBlock`, which goes through the atomic
   *   `swapActiveBlock` transaction in services/session.ts.
   * - On no-op (no alternates available for this block) surfaces a
   *   subtle error message so the tester doesn't think their tap was
   *   lost. Defensive - the UI hides the button when no alternates
   *   exist, so this path is a belt-and-suspenders guard.
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
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-8">
      <div className="flex items-center justify-between pt-2">
        <SafetyIcon />
        {/* Phase F8 (2026-04-19): phase label was `text-sm font-bold
            uppercase tracking-wider` paired with all-caps source
            strings ('WARM UP' / 'WORK' / 'DOWNSHIFT'). The audit
            (`canvases/typography-review.canvas.tsx`) flagged the
            uppercase-eyebrow voice as the app's single biggest
            "SaaS tell"; `phaseLabel()` now returns sentence case and
            the pill carries emphasis through accent color plus
            `font-semibold` instead of through case + letter-spacing. */}
        <span className="text-sm font-semibold text-accent">
          {phaseLabel(currentBlock.type)}
        </span>
        <span className="text-sm font-medium text-text-secondary">
          {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Phase F8 (2026-04-19): added `tracking-tight` to match the
            Review / prep-screen display-heading treatment. Drill title
            is the focal element when the timer isn't yet running. */}
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {currentBlock.drillName}
        </h1>
        {/* Tier 1a Unit 4 (2026-04-20): one-sentence rationale for why
            this block landed on the session. Partner-walkthrough pass
            2026-04-21 (P1-11): rationale was rendered BELOW the
            coaching-cue toggle at `text-xs`, which caused Seb to merge
            it with the coach-cue cluster on first read (he described
            reading "the coach cues" when he had just read the
            rationale). Fix: relocate above `courtsideInstructions` as
            a subtitle under the drill name — this puts it in the
            "what → why → how" reading order (drill name → rationale →
            instructions → cues) and physically separates it from the
            coach-cue region. Typography: `text-base` honors the
            outdoor-UI brief's 16 px body floor (was `text-xs` / 12 px,
            which violated the freeze). `text-text-secondary` keeps it
            quiet relative to the instructions directly below. Legacy
            plans without a rationale render nothing. See
            `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`
            P1-11 and `docs/research/outdoor-courtside-ui-brief.md` freeze. */}
        {currentBlock.rationale && (
          <p className="text-base leading-relaxed text-text-secondary">
            {currentBlock.rationale}
          </p>
        )}
        {/* Typography bump 2026-04-21 (thought 2 from founder pre-close
            review): body copy was at `text-sm` / 14 px, below the
            outdoor-UI brief's 16 px body floor AND below its 18 px
            preferred run-mode body size. Founder reported text
            unreadable at bench distance even off-sand ("couldn't have
            the phone too far away since things were hard to read") -
            which is the exact problem the brief's preferred floor
            exists to solve. `text-lg` / 18 px on the two primary
            active-drill surfaces: courtside instructions (what to do)
            and the coach cue (how to do it well). Rationale stays at
            the 16 px floor since it's meta-context, not hot content.
            See `docs/research/outdoor-courtside-ui-brief.md` freeze:
            "body_preferred_px: 18" and "Run-mode labels should prefer
            18px." */}
        {currentBlock.courtsideInstructions && (
          <p className="text-lg leading-relaxed text-text-primary">
            {currentBlock.courtsideInstructions}
          </p>
        )}
        {currentBlock.coachingCue &&
          (showInstructions ? (
            <div className="flex flex-col gap-1">
              <p className="text-lg font-medium leading-relaxed text-accent">
                {currentBlock.coachingCue}
              </p>
              <button
                type="button"
                onClick={toggleInstructions}
                className="min-h-[54px] self-start text-sm font-medium text-accent"
              >
                Hide cues
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleInstructions}
              className="min-h-[54px] self-start text-sm font-medium text-accent"
            >
              Show coaching cues
            </button>
          ))}
      </div>

      {prerollCount != null ? (
        <div className="flex flex-col items-center gap-4 py-8">
          {/* Phase F10 (2026-04-19): preroll countdown now shares the
              BlockTimer's display face (JetBrains Mono Variable via
              the `font-mono` utility + `--font-mono` token) so the
              two timer surfaces read as one instrument at two
              volumes. Accent color continues to signal "get ready"
              vs the primary-colored live timer. The slashed-zero
              feature matches BlockTimer for consistency even though
              the preroll flips to the live timer before 0. See
              `docs/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md`. */}
          <span
            className="font-mono text-[72px] font-bold tabular-nums leading-none text-accent"
            style={{ fontFeatureSettings: '"zero" 1' }}
          >
            {prerollCount}
          </span>
          <p className="text-base font-medium text-text-secondary">
            Get ready&hellip;
          </p>
          {/* Pre-close 2026-04-21 (thought 3a in founder pre-close review):
              iOS Safari PWA suspends our `AudioContext` when the phone
              is locked, so the block-end beep + 3-sec end-countdown
              ticks do not fire through a locked screen. The
              MediaSession + audioSession='ambient' spike that would
              unlock the lock-screen presence lives in the post-D91 /
              post-Condition-3 backlog (`docs/plans/2026-04-16-003-rest-of-v0b-plan.md`
              §4 "Lock-screen presence"), gated on D54 reconsideration.
              Until then, the cheapest honest thing is to set the
              expectation on the preroll screen the tester already
              looks at at block start. `text-sm text-text-secondary`
              keeps it ambient - not a warning, not a safety gate. */}
          <p className="max-w-[280px] text-center text-sm text-text-secondary">
            Keep the phone unlocked so the block-end beep can fire.
          </p>
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
        /**
         * Phase F Unit 4: Swap is only available when the block has
         * at least one curated alternate. Precompute once per render
         * so the visibility gate (non-empty list) doesn't double-call
         * `findSwapAlternatives`. Warmup / wrap always empty per
         * D85/D105; a context with a single candidate in the slot
         * pool is also empty.
         */
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
