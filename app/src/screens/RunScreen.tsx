import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, StatusMessage } from '../components/ui'
import { useTimer } from '../hooks/useTimer'
import { useWakeLock } from '../hooks/useWakeLock'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { phaseLabel } from '../lib/format'
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
  const [showInstructions, toggleInstructions] = useReducer(
    (s: boolean) => !s,
    false,
  )
  const blockDurRef = useRef(0)
  const remainingRef = useRef(0)

  const runner = useSessionRunner(executionLogId, {
    getAccumulatedElapsed: useCallback(() => {
      return Math.max(0, blockDurRef.current - remainingRef.current)
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
    endSession,
    flushTimer,
    recoverTimerState,
  } = runner

  const defaultDuration = currentBlock
    ? currentBlock.durationMinutes * (shortened ? 30 : 60)
    : 0

  const [activeDuration, setActiveDuration] = useState(defaultDuration)
  const [prevBlockIndex, setPrevBlockIndex] = useState(currentBlockIndex)

  if (currentBlockIndex !== prevBlockIndex) {
    setActiveDuration(defaultDuration)
    setPrevBlockIndex(currentBlockIndex)
  }

  useEffect(() => {
    blockDurRef.current = activeDuration
  }, [activeDuration])

  const [runError, setRunError] = useState<string | null>(null)

  const handleBlockComplete = useCallback(async () => {
    try {
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
    let count = 3
    prerollTimerRef.current = setInterval(() => {
      count -= 1
      if (count <= 0) {
        if (prerollTimerRef.current) clearInterval(prerollTimerRef.current)
        prerollTimerRef.current = null
        setPrerollCount(null)
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

  useEffect(() => {
    if (timer.isRunning) {
      wakeLock.request()
    } else {
      wakeLock.release()
    }
  }, [timer.isRunning, wakeLock])

  const handlePause = useCallback(() => {
    const elapsed = timer.pause()
    pauseBlock(elapsed, activeDuration)
  }, [timer, pauseBlock, activeDuration])

  const handleResume = useCallback(() => {
    timer.resume()
    resumeBlock()
  }, [timer, resumeBlock])

  const handleNext = useCallback(async () => {
    try {
      timer.pause()
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
    const newRemaining = Math.max(10, remainingRef.current / 2)
    const newDuration = activeDuration - remainingRef.current + newRemaining
    setActiveDuration(newDuration)
    timer.start(newRemaining)
    resumeBlock()
  }, [timer, resumeBlock, activeDuration])

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
              Back to start
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
        <span className="text-sm font-bold uppercase tracking-wider text-accent">
          {phaseLabel(currentBlock.type)}
        </span>
        <span className="text-sm font-medium text-text-secondary">
          {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">
          {currentBlock.drillName}
        </h1>
        <p className="text-sm font-medium text-accent">
          {currentBlock.coachingCue}
        </p>
        {currentBlock.courtsideInstructions &&
          (showInstructions ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-relaxed text-text-secondary">
                {currentBlock.courtsideInstructions}
              </p>
              <button
                type="button"
                onClick={toggleInstructions}
                className="min-h-[54px] self-start text-sm font-medium text-accent"
              >
                Less
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleInstructions}
              className="min-h-[54px] self-start text-sm font-medium text-accent"
            >
              More&hellip;
            </button>
          ))}
      </div>

      {prerollCount != null ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="text-[72px] font-bold tabular-nums leading-none text-accent">
            {prerollCount}
          </span>
          <p className="text-base font-medium text-text-secondary">
            Get ready&hellip;
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

      {prerollCount == null && (
        <RunControls
          isPaused={isPaused}
          isRequired={currentBlock.required}
          onPause={handlePause}
          onResume={handleResume}
          onNext={handleNext}
          onSkip={handleSkip}
          onShorten={handleShorten}
          onEndSession={handleEndSessionRequest}
        />
      )}

      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className="w-full max-w-[390px] rounded-[16px] bg-bg-primary p-6 shadow-lg">
            <h2 className="text-lg font-bold text-text-primary">
              End session early?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {currentBlock.type === 'wrap'
                ? 'You\u2019re in your cool-down. Skipping it may affect your recovery. Your progress will be saved.'
                : 'You still have blocks remaining. Your progress will be saved and you can review what you completed.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="danger"
                fullWidth
                onClick={() => void handleEndSessionConfirm()}
              >
                End Session
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleEndSessionCancel}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
