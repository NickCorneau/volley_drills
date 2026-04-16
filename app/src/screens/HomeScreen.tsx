import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResumePrompt } from '../components/ResumePrompt'
import { Button } from '../components/ui'
import { formatInterruptedAgo } from '../lib/format'
import { routes } from '../routes'
import {
  findPendingReview,
  findResumableSession,
  skipReview,
  discardSession,
  type PendingReview,
  type ResumableSession,
} from '../services/session'

type HomeState =
  | { kind: 'loading' }
  | { kind: 'resume'; data: ResumableSession }
  | { kind: 'review_pending'; data: PendingReview }
  | { kind: 'ready'; hasHistory: boolean }
  | { kind: 'error' }

export function HomeScreen() {
  const navigate = useNavigate()
  const [state, setState] = useState<HomeState>({ kind: 'loading' })
  const acting = useRef(false)

  const resolve = useCallback(async () => {
    try {
      const resumable = await findResumableSession()
      if (resumable) {
        setState({ kind: 'resume', data: resumable })
        return
      }

      const pending = await findPendingReview()
      if (pending) {
        setState({ kind: 'review_pending', data: pending })
        return
      }

      const { db } = await import('../db/schema')
      const count = await db.sessionPlans.count()
      setState({ kind: 'ready', hasHistory: count > 0 })
    } catch {
      setState({ kind: 'error' })
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    resolve().then(() => {
      if (cancelled) setState((s) => s)
    })
    return () => { cancelled = true }
  }, [resolve])

  const handleResume = useCallback(() => {
    if (state.kind !== 'resume') return
    navigate(routes.run(state.data.execution.id))
  }, [navigate, state])

  const handleDiscard = useCallback(async () => {
    if (state.kind !== 'resume' || acting.current) return
    acting.current = true
    try {
      const execId = state.data.execution.id
      await discardSession(state.data.execution)
      navigate(routes.review(execId))
    } catch {
      acting.current = false
      setState({ kind: 'error' })
    }
  }, [navigate, state])

  const handleSkipReview = useCallback(async () => {
    if (state.kind !== 'review_pending' || acting.current) return
    acting.current = true
    try {
      await skipReview(state.data.executionId)
      acting.current = false
      await resolve()
    } catch {
      acting.current = false
      setState({ kind: 'error' })
    }
  }, [state, resolve])

  const handleStartWorkout = useCallback(() => {
    navigate(routes.setup())
  }, [navigate])

  const handleFinishReview = useCallback(() => {
    if (state.kind !== 'review_pending') return
    navigate(routes.review(state.data.executionId))
  }, [navigate, state])

  if (state.kind === 'loading') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-6 pt-16">
        <div className="text-4xl" aria-hidden>🏐</div>
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="mx-auto flex w-full max-w-[390px] flex-col items-center gap-6 pt-16">
        <div className="text-4xl" aria-hidden>🏐</div>
        <p className="text-text-secondary">Something went wrong</p>
        <Button variant="ghost" onClick={() => { setState({ kind: 'loading' }); resolve() }}>
          Try again
        </Button>
      </div>
    )
  }

  const resumeBlock =
    state.kind === 'resume'
      ? state.data.plan.blocks[state.data.execution.activeBlockIndex]
      : null

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-8">
      <header className="pt-2 text-center">
        <div className="text-4xl" aria-hidden>🏐</div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
          Volley Drills
        </h1>
      </header>

      {state.kind === 'resume' && (
        <ResumePrompt
          sessionName={state.data.plan.presetName}
          blockDrillName={resumeBlock?.drillName ?? 'Current block'}
          blockPositionLabel={`Block ${state.data.execution.activeBlockIndex + 1} of ${state.data.plan.blocks.length}`}
          interruptedAgo={formatInterruptedAgo(state.data.interruptedAt)}
          onResume={handleResume}
          onDiscard={handleDiscard}
        />
      )}

      {state.kind === 'review_pending' && (
        <section className="flex flex-col gap-4">
          <p className="text-center text-text-secondary">
            You have an unreviewed session
          </p>
          <p className="text-center text-sm text-text-secondary">
            {state.data.planName}
          </p>
          <Button variant="primary" fullWidth onClick={handleFinishReview}>
            Finish Review
          </Button>
          <button
            type="button"
            onClick={handleSkipReview}
            className="text-center text-sm text-text-secondary underline"
          >
            Skip review
          </button>
        </section>
      )}

      {state.kind === 'ready' && (
        <section className="mt-4 flex flex-col gap-4">
          <Button variant="primary" fullWidth onClick={handleStartWorkout}>
            {state.hasHistory ? 'Start Workout' : 'Start First Workout'}
          </Button>
        </section>
      )}

      {state.kind === 'resume' && (
        <section className="mt-4 flex flex-col gap-4">
          <Button variant="outline" fullWidth onClick={handleStartWorkout}>
            Start New Workout
          </Button>
        </section>
      )}

      <p className="mt-auto text-center text-xs text-text-secondary">
        Your data stays on this device
      </p>
    </div>
  )
}
