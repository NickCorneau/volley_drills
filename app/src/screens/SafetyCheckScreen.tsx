import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PainOverrideCard } from '../components/PainOverrideCard'
import { Button, StatusMessage } from '../components/ui'
import type { SessionDraft } from '../db/types'
import { buildRecoveryDraft } from '../domain/sessionBuilder'
import { routes } from '../routes'
import {
  createSessionFromDraft,
  getCurrentDraft,
  hasEverStartedSession,
} from '../services/session'

type TrainingRecency = '0 days' | '1 day' | '2+' | 'First time'

// Full option set. `First time` is conditionally filtered out in the
// render based on `hasEverStartedSession` — once the tester has any
// ExecutionLog on device, the chip is hidden because it's no longer a
// meaningful answer to "When did you last train?"
const RECENCY_OPTIONS: TrainingRecency[] = ['0 days', '1 day', '2+', 'First time']

const HEAT_TIPS = [
  'Hydrate before, during, and after your session.',
  'Avoid peak sun hours (10 AM to 4 PM) when possible.',
  'Take shade breaks between blocks if you feel overheated.',
  'Wear sunscreen and light-colored clothing.',
  'Stop immediately if you feel dizzy or nauseous.',
]

function isRecoveryBlock(type: string): boolean {
  return type === 'warmup' || type === 'wrap'
}

export function SafetyCheckScreen() {
  const navigate = useNavigate()
  const creating = useRef(false)

  const [draft, setDraft] = useState<SessionDraft | null>(null)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const [painFlag, setPainFlag] = useState<boolean | null>(null)
  const [recency, setRecency] = useState<TrainingRecency | null>(null)
  const [heatExpanded, setHeatExpanded] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  // Gates the "First time" recency chip (2026-04-19 dogfeed). Default
  // `true` so the chip stays hidden on mount until we've confirmed
  // there's no session history — otherwise the chip would flash in for
  // one frame on every Safety visit for returning users.
  const [hasSessionHistory, setHasSessionHistory] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Parallelize the two reads — they're independent.
        const [d, hasHistory] = await Promise.all([
          getCurrentDraft(),
          hasEverStartedSession(),
        ])
        if (cancelled) return
        if (!d) {
          navigate(routes.setup(), { replace: true })
          return
        }
        setDraft(d)
        setHasSessionHistory(hasHistory)
        setDraftLoaded(true)
      } catch {
        if (!cancelled) {
          setCreateError('Could not load your saved session. Please rebuild it.')
          setDraftLoaded(true)
        }
      }
    })()
    return () => { cancelled = true }
  }, [navigate])

  // Returning users never see "First time" — the chip is only meaningful
  // on a genuinely fresh install.
  const visibleRecencyOptions = useMemo<TrainingRecency[]>(
    () =>
      hasSessionHistory
        ? RECENCY_OPTIONS.filter((opt) => opt !== 'First time')
        : RECENCY_OPTIONS,
    [hasSessionHistory],
  )

  const recoveryMinutes =
    draft?.blocks
      .filter((b) => isRecoveryBlock(b.type))
      .reduce((sum, b) => sum + b.durationMinutes, 0) ?? 0

  const sessionSummary = draft
    ? `${draft.archetypeName} \u00b7 ${draft.blocks.reduce((s, b) => s + b.durationMinutes, 0)} min, ${draft.blocks.length} blocks`
    : ''

  const canContinue = painFlag === false && recency !== null

  async function handleCreateSession(
    useRecovery: boolean,
    painOverridden: boolean,
  ) {
    if (creating.current) return
    if (painFlag === null || recency === null) return
    if (!draft) return
    creating.current = true
    setIsCreating(true)
    setCreateError(null)

    try {
      let sessionDraft = draft
      if (useRecovery) {
        const recovery = buildRecoveryDraft(draft.context)
        if (!recovery) {
          setCreateError('Could not build a lighter session. Try changing your setup.')
          return
        }
        sessionDraft = recovery
      }

      const execId = await createSessionFromDraft({
        draft: sessionDraft,
        painFlag,
        trainingRecency: recency ?? undefined,
        heatCta: heatExpanded,
        painOverridden,
      })

      navigate(routes.run(execId))
    } catch (err) {
      console.error('Session creation failed:', err)
      setCreateError('Something went wrong creating your session. Please try again.')
    } finally {
      creating.current = false
      setIsCreating(false)
    }
  }

  if (!draftLoaded) {
    return (
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-[390px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-[390px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">
          {createError ?? 'Session not found'}
        </p>
        <Button variant="ghost" onClick={() => navigate(routes.setup())}>
          Back to setup
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-8">
      {/**
       * Three-column header (Back | centered title | spacer) mirrors
       * SetupScreen so the "tap to escape" affordance lives in the same
       * thumb zone across the pre-run flow. Leaving SafetyCheck does
       * NOT mutate the persisted draft — SafetyCheckScreen only reads
       * the draft and writes safety answers inline on Continue — so a
       * Back tap returns the user to Home with their draft intact
       * (surfaces there as the Draft primary card per C-4 Surface 2).
       */}
      <header className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate(routes.home())}
          className="min-h-[44px] px-2 text-sm text-accent"
        >
          &larr; Back
        </button>
        <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-text-primary">
          Before we start
        </h1>
        <div className="w-12" />
      </header>
      {sessionSummary && (
        <p className="-mt-4 text-center text-sm font-medium text-accent">
          {sessionSummary}
        </p>
      )}

      {/* 2026-04-19 dogfeed reorder: Recency first, then Pain. The
          old order placed the pain question first and rendered the
          PainOverrideCard between the two sections, which made the
          recency chips below look like they were blocked by the
          override card. With the flip, PainOverrideCard now sits at
          the bottom directly beneath its triggering question, which
          matches the "tapping Yes reveals options below" mental model
          users already expect from Setup / Safety form patterns. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          When did you last train?
        </h2>
        {/* Description collapses the "or First time" clause for
            returning users so it matches the rendered chip set. */}
        <p className="text-sm text-text-secondary">
          {hasSessionHistory
            ? '0 days means a shorter, lower-intensity start.'
            : '0 days or First time means a shorter, lower-intensity start.'}
        </p>
        <div className="flex gap-2">
          {visibleRecencyOptions.map((opt) => {
            const selected = recency === opt
            const isWarning = opt === '0 days'
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setRecency(opt)}
                className={[
                  'min-h-[54px] flex-1 rounded-[16px] px-2 py-2 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                  selected && isWarning
                    ? 'border border-warning bg-warning-surface text-warning focus-visible:ring-warning'
                    : selected
                      ? 'border border-accent bg-info-surface text-accent focus-visible:ring-accent'
                      : 'border border-gray-200 text-text-secondary active:bg-bg-warm focus-visible:ring-accent',
                ].join(' ')}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Any pain that changes how you move?
        </h2>
        <p className="text-sm text-text-secondary">
          We&apos;ll switch to a lighter session if yes.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPainFlag(false)}
            className={[
              'min-h-[54px] flex-1 rounded-[16px] px-4 py-3 text-base font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              painFlag === false
                ? 'bg-success text-white focus-visible:ring-success'
                : 'border-2 border-gray-200 text-text-primary active:bg-bg-warm focus-visible:ring-success',
            ].join(' ')}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => setPainFlag(true)}
            className={[
              'min-h-[54px] flex-1 rounded-[16px] px-4 py-3 text-base font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              painFlag === true
                ? 'border border-warning bg-warning-surface text-warning focus-visible:ring-warning'
                : 'border-2 border-gray-200 text-text-primary active:bg-bg-warm focus-visible:ring-warning',
            ].join(' ')}
          >
            Yes
          </button>
        </div>
      </section>

      {painFlag === true && (
        <PainOverrideCard
          recoveryMinutes={recoveryMinutes}
          disabled={isCreating}
          canAct={recency !== null}
          onContinueRecovery={() => void handleCreateSession(true, false)}
          onOverride={() => void handleCreateSession(false, true)}
        />
      )}

      <section>
        <button
          type="button"
          onClick={() => setHeatExpanded((prev) => !prev)}
          className="flex min-h-[54px] items-center gap-2 text-sm font-medium text-accent transition-colors active:text-accent-pressed"
        >
          <span aria-hidden>🔥</span>
          Heat &amp; safety tips
          <span
            className={`transition-transform ${heatExpanded ? 'rotate-180' : ''}`}
            aria-hidden
          >
            ▾
          </span>
        </button>
        {heatExpanded && (
          <ul className="mt-3 flex flex-col gap-2 rounded-[12px] bg-info-surface p-4">
            {HEAT_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary"
              >
                <span className="shrink-0 text-accent" aria-hidden>
                  •
                </span>
                {tip}
              </li>
            ))}
          </ul>
        )}
      </section>

      {createError && <StatusMessage variant="error" message={createError} />}

      {painFlag === false && (
        <Button
          variant="primary"
          fullWidth
          onClick={() => void handleCreateSession(false, false)}
          disabled={!canContinue || isCreating}
        >
          {isCreating ? 'Creating session\u2026' : 'Continue'}
        </Button>
      )}
    </div>
  )
}
