import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { findSwapAlternatives } from '../../domain/sessionBuilder'
import { useSessionRunner } from '../../hooks/useSessionRunner'
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
    if (navigator.vibrate) navigator.vibrate(100)
    navigate(routes.run(executionLogId))
  }, [navigate, executionLogId])

  const handleStartShortened = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(100)
    navigate(routes.run(executionLogId), { state: { shortened: true } })
  }, [navigate, executionLogId])

  const handleSkip = useCallback(async () => {
    if (isSkipping) return
    setIsSkipping(true)
    try {
      if (navigator.vibrate) navigator.vibrate(100)
      const isLast = await runner.skipBlock()
      if (isLast) {
        navigate(routes.review(executionLogId), { replace: true })
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
    nextBlock,
    skipError,
    swapError,
    hasAlternates,
    handleStartNext,
    handleStartShortened,
    handleSkip,
    handleSwap,
  }
}
