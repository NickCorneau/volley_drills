import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useTimer } from '../hooks/useTimer'
import { useWakeLock } from '../hooks/useWakeLock'
import { useSessionRunner } from '../hooks/useSessionRunner'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SafetyIcon } from '../components/SafetyIcon'
import type { BlockSlotType } from '../types/session'

function phaseLabel(type: BlockSlotType): string {
  switch (type) {
    case 'warmup':
      return 'WARM UP'
    case 'wrap':
      return 'COOL DOWN'
    case 'technique':
    case 'movement_proxy':
    case 'main_skill':
    case 'pressure':
      return 'WORK'
  }
}

export function RunScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const executionLogId = searchParams.get('id') ?? ''
  const shortened =
    (location.state as { shortened?: boolean } | null)?.shortened ?? false

  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [prerollCount, setPrerollCount] = useState<number | null>(null)
  const [showInstructions, toggleInstructions] = useReducer((s: boolean) => !s, false)
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
    currentBlock,
    currentBlockIndex,
    totalBlocks,
    isPaused,
  } = runner

  const blockDurationSeconds = currentBlock
    ? currentBlock.durationMinutes * (shortened ? 30 : 60)
    : 0

  useEffect(() => {
    blockDurRef.current = blockDurationSeconds
  })

  const handleBlockComplete = useCallback(async () => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    const isLast = await runner.completeBlock()
    if (isLast) {
      navigate(`/review?id=${executionLogId}`, { replace: true })
    } else {
      navigate(`/run/transition?id=${executionLogId}`)
    }
  }, [runner, navigate, executionLogId])

  const timer = useTimer(blockDurationSeconds, handleBlockComplete)
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
        runner.startBlock().then(() => {
          timer.start(blockDurationSeconds)
          wakeLock.request()
        }).catch((err) => {
          console.error('Failed to start block:', err)
          navigate('/', { replace: true })
        })
        if (navigator.vibrate) navigator.vibrate(100)
      } else {
        setPrerollCount(count)
      }
    }, 1000)
  }, [runner, timer, blockDurationSeconds, wakeLock, navigate])

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
      runner.recoverTimerState(blockDurationSeconds).then((recovered) => {
        timer.start(recovered ?? blockDurationSeconds)
        wakeLock.request()
      }).catch((err) => {
        console.error('Failed to recover timer:', err)
        timer.start(blockDurationSeconds)
        wakeLock.request()
      })
    } else if (bs.status === 'planned' || execution.status === 'not_started') {
      startWithPreroll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execution, currentBlock, blockDurationSeconds])

  useEffect(() => {
    if (!timer.isRunning || !currentBlock) return
    const interval = setInterval(() => {
      const elapsed = blockDurationSeconds - remainingRef.current
      runner.flushTimer(elapsed)
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isRunning, blockDurationSeconds, currentBlock])

  useEffect(() => {
    if (timer.isRunning) {
      wakeLock.request()
    } else {
      wakeLock.release()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isRunning])

  const handlePause = useCallback(() => {
    const elapsed = timer.pause()
    runner.pauseBlock(elapsed)
  }, [timer, runner])

  const handleResume = useCallback(() => {
    timer.resume()
    runner.resumeBlock()
  }, [timer, runner])

  const handleNext = useCallback(async () => {
    timer.pause()
    if (navigator.vibrate) navigator.vibrate(100)
    const isLast = await runner.completeBlock()
    if (isLast) {
      navigate(`/review?id=${executionLogId}`, { replace: true })
    } else {
      navigate(`/run/transition?id=${executionLogId}`)
    }
  }, [timer, runner, navigate, executionLogId])

  const handleSkip = useCallback(async () => {
    timer.pause()
    if (navigator.vibrate) navigator.vibrate(100)
    const isLast = await runner.skipBlock()
    if (isLast) {
      navigate(`/review?id=${executionLogId}`, { replace: true })
    } else {
      navigate(`/run/transition?id=${executionLogId}`)
    }
  }, [timer, runner, navigate, executionLogId])

  const handleShorten = useCallback(() => {
    const newRemaining = Math.max(10, remainingRef.current / 2)
    timer.start(newRemaining)
    runner.resumeBlock()
  }, [timer, runner])

  const handleEndSessionRequest = useCallback(() => {
    if (timer.isRunning) {
      timer.pause()
      runner.pauseBlock(blockDurRef.current - remainingRef.current)
    }
    setShowEndConfirm(true)
  }, [timer, runner])

  const handleEndSessionConfirm = useCallback(async () => {
    await runner.endSession()
    navigate(`/review?id=${executionLogId}`, { replace: true })
  }, [runner, navigate, executionLogId])

  const handleEndSessionCancel = useCallback(() => {
    setShowEndConfirm(false)
  }, [])

  useEffect(() => {
    if (!executionLogId) return
    if (execution && plan === null) {
      navigate('/', { replace: true })
    }
  }, [executionLogId, execution, plan, navigate])

  if (!plan || !execution || !currentBlock) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-text-secondary">Loading session…</p>
      </div>
    )
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
        <p className="text-sm font-medium text-accent">{currentBlock.coachingCue}</p>
        {currentBlock.courtsideInstructions && (
          showInstructions ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-relaxed text-text-secondary">
                {currentBlock.courtsideInstructions}
              </p>
              <button
                type="button"
                onClick={toggleInstructions}
                className="self-start text-xs font-medium text-accent"
              >
                Less
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={toggleInstructions}
              className="self-start text-xs font-medium text-accent"
            >
              More…
            </button>
          )
        )}
      </div>

      {prerollCount != null ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="text-[72px] font-bold tabular-nums leading-none text-accent">
            {prerollCount}
          </span>
          <p className="text-base font-medium text-text-secondary">
            Get ready…
          </p>
        </div>
      ) : (
        <BlockTimer
          remainingSeconds={timer.remainingSeconds}
          totalSeconds={blockDurationSeconds}
          isPaused={isPaused}
        />
      )}

      <p className="text-center text-sm text-text-secondary">
        Block {currentBlockIndex + 1} of {totalBlocks}
      </p>

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
            <h2 className="text-lg font-bold text-text-primary">End session early?</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {currentBlock.type === 'wrap'
                ? 'You\u2019re in your cool-down. Skipping it may affect your recovery. Your progress will be saved.'
                : 'You still have blocks remaining. Your progress will be saved and you can review what you completed.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => void handleEndSessionConfirm()}
                className="min-h-[54px] w-full rounded-[16px] border-2 border-warning/30 bg-warning-surface px-4 py-3 text-base font-semibold text-warning transition-colors active:bg-warning/10"
              >
                End Session
              </button>
              <button
                type="button"
                onClick={handleEndSessionCancel}
                className="min-h-[54px] w-full rounded-[16px] bg-accent px-4 py-3 text-base font-semibold text-white transition-colors active:bg-accent-pressed"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
