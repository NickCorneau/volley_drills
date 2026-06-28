import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { drillCheckBypassedForPreviousBlock } from '../../domain/capture'
import { resolveBlockOpeningIntent } from '../../domain/drillMetadata'
import { postBlockRoute } from '../../domain/runFlow'
import { findSwapAlternatives } from '../../domain/sessionBuilder'
import { useSessionRunner } from '../../hooks/useSessionRunner'
import { vibrate } from '../../platform'
import { routes } from '../../routes'

export function useTransitionController(executionLogId: string) {
  const navigate = useNavigate()
  const runner = useSessionRunner(executionLogId)
  const { plan, execution, loaded, currentBlockIndex, totalBlocks } = runner

  const prevBlockIdx = currentBlockIndex - 1
  const prevBlock = plan?.blocks[prevBlockIdx] ?? null
  const prevBlockStatus = execution?.blockStatuses[prevBlockIdx] ?? null
  const nextBlock = plan?.blocks[currentBlockIndex] ?? null
  const hasNextBlock = currentBlockIndex < totalBlocks

  // Run-flow beat contract Stage 3 (R12): the just-finished receipt
  // renders once per drill. Drill Check owns it when capture is eligible;
  // Transition shows it only for blocks that bypassed Drill Check
  // (warmup / wrap / technique-support / skipped). Keying off the shared
  // resolver guarantees the two beats never double-render or drop it.
  const showJustFinishedReceipt =
    prevBlock != null &&
    drillCheckBypassedForPreviousBlock({ plan, execution, currentBlockIndex })

  // Run-flow beat contract Stage 1 (R6): the "what this rung trains" line
  // shows once at a focus block's opening and recedes for the rest of that
  // focus run, rather than on every ladder-bearing Transition. Null when
  // the next block is mid-block, not ladder-bearing, or off-ladder.
  // Null-safe — see resolveBlockOpeningIntent.
  const rungIntentLine = resolveBlockOpeningIntent(
    plan?.blocks,
    currentBlockIndex,
    plan?.playerCount ?? 1,
  )

  const [isSkipping, setIsSkipping] = useState(false)
  const [skipError, setSkipError] = useState<string | null>(null)
  const [swapError, setSwapError] = useState<string | null>(null)

  useEffect(() => {
    if (!execution) return
    if (execution.status === 'completed' || !hasNextBlock) {
      navigate(routes.review(executionLogId), { replace: true })
    }
  }, [execution, hasNextBlock, executionLogId, navigate])

  const handleStartNext = useCallback(() => {
    vibrate(100)
    navigate(routes.run(executionLogId))
  }, [navigate, executionLogId])

  const handleStartShortened = useCallback(() => {
    vibrate(100)
    navigate(routes.run(executionLogId), { state: { shortened: true } })
  }, [navigate, executionLogId])

  const handleSkip = useCallback(async () => {
    if (isSkipping) return
    setIsSkipping(true)
    try {
      vibrate(100)
      const isLast = await runner.skipBlock()
      if (isLast) {
        const next = postBlockRoute(executionLogId, true)
        navigate(next.path, { replace: next.replace })
      } else {
        setIsSkipping(false)
      }
    } catch (err) {
      console.error('Skip block failed:', err)
      setSkipError('Something went wrong. Try again.')
      setIsSkipping(false)
    }
  }, [runner, navigate, executionLogId, isSkipping])

  const handleSwap = useCallback(async () => {
    setSwapError(null)
    try {
      vibrate(100)
      const ok = await runner.swapBlock()
      if (!ok) {
        setSwapError('No alternate drills available for this block.')
      }
    } catch (err) {
      console.error('Swap failed:', err)
      setSwapError('Something went wrong. Try again.')
    }
  }, [runner])

  // hasAlternates is a boolean count check; the K5 level partition
  // is sort-only (doesn't change the count), so we deliberately omit
  // `effectiveLevelValue` here. The actual mid-session swap path in
  // `useSessionRunner.swapBlock` IS level-aware (passes the cached
  // effective level into `findSwapAlternatives`), so the displayed
  // Swap button accurately reflects whether at least one alternate
  // exists, and the executed swap honors the user's saved level.
  const hasAlternates = plan?.context && nextBlock
    ? findSwapAlternatives(nextBlock, plan.context).length > 0
    : false

  return {
    plan,
    execution,
    loaded,
    currentBlockIndex,
    totalBlocks,
    prevBlock,
    prevBlockStatus,
    showJustFinishedReceipt,
    nextBlock,
    rungIntentLine,
    skipError,
    swapError,
    hasAlternates,
    handleStartNext,
    handleStartShortened,
    handleSkip,
    handleSwap,
  }
}
