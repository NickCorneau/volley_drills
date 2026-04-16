import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PainOverrideCard } from '../components/PainOverrideCard'
import { Button, StatusMessage } from '../components/ui'
import type { SessionDraft } from '../db/types'
import { buildPresetBlocks, PRESETS } from '../domain'
import { buildRecoveryDraft } from '../domain/sessionBuilder'
import { routes } from '../routes'
import {
  createSession,
  createSessionFromDraft,
  getCurrentDraft,
} from '../services/session'

type TrainingRecency = '0 days' | '1 day' | '2+' | 'First time'

const RECENCY_OPTIONS: TrainingRecency[] = ['0 days', '1 day', '2+', 'First time']

const HEAT_TIPS = [
  'Hydrate before, during, and after your session.',
  'Avoid peak sun hours (10 AM \u2013 4 PM) when possible.',
  'Take shade breaks between blocks if you feel overheated.',
  'Wear sunscreen and light-colored clothing.',
  'Stop immediately if you feel dizzy or nauseous.',
]

function isRecoveryBlock(type: string): boolean {
  return type === 'warmup' || type === 'wrap'
}

export function SafetyCheckScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const creating = useRef(false)

  const presetId = searchParams.get('preset') ?? ''
  const rawPlayers = Number(searchParams.get('players') ?? '1')
  const playerCount: 1 | 2 = rawPlayers === 2 ? 2 : 1
  const isLegacyFlow = presetId !== ''

  const [draft, setDraft] = useState<SessionDraft | null>(null)
  const [draftLoaded, setDraftLoaded] = useState(isLegacyFlow)

  const [painFlag, setPainFlag] = useState<boolean | null>(null)
  const [recency, setRecency] = useState<TrainingRecency | null>(null)
  const [heatExpanded, setHeatExpanded] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    if (isLegacyFlow) return
    let cancelled = false
    getCurrentDraft()
      .then((d) => {
        if (cancelled) return
        if (!d) {
          navigate(routes.setup(), { replace: true })
          return
        }
        setDraft(d)
        setDraftLoaded(true)
      })
      .catch(() => {
        if (!cancelled) {
          setCreateError('Could not load your saved session. Please rebuild it.')
          setDraftLoaded(true)
        }
      })
    return () => { cancelled = true }
  }, [isLegacyFlow, navigate])

  const preset = isLegacyFlow ? PRESETS.find((p) => p.id === presetId) : null

  if (isLegacyFlow && !preset) {
    return (
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-[390px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Session not found</p>
        <Button variant="ghost" onClick={() => navigate(routes.home())}>
          Go back
        </Button>
      </div>
    )
  }

  const allBlocks = isLegacyFlow && preset ? buildPresetBlocks(presetId) : []
  const recoveryMinutes = isLegacyFlow
    ? allBlocks.filter((b) => isRecoveryBlock(b.type)).reduce((sum, b) => sum + b.durationMinutes, 0)
    : (draft?.blocks.filter((b) => isRecoveryBlock(b.type)).reduce((sum, b) => sum + b.durationMinutes, 0) ?? 0)

  const sessionSummary = draft
    ? `${draft.archetypeName} \u2014 ${draft.blocks.reduce((s, b) => s + b.durationMinutes, 0)} min, ${draft.blocks.length} blocks`
    : preset?.name ?? ''

  const canContinue = painFlag === false && recency !== null

  async function handleCreateSession(
    useRecovery: boolean,
    painOverridden: boolean,
  ) {
    if (creating.current) return
    if (painFlag === null || recency === null) return
    creating.current = true
    setIsCreating(true)
    setCreateError(null)

    try {
      let execId: string

      if (!isLegacyFlow) {
        if (!draft) throw new Error('Draft missing')
        let sessionDraft = draft
        if (useRecovery) {
          const recovery = buildRecoveryDraft(draft.context)
          if (!recovery) {
            setCreateError('Could not build a recovery session. Try changing your setup.')
            return
          }
          sessionDraft = recovery
        }
        execId = await createSessionFromDraft({
          draft: sessionDraft,
          painFlag,
          trainingRecency: recency ?? undefined,
          heatCta: heatExpanded,
          painOverridden,
        })
      } else {
        execId = await createSession({
          presetId,
          playerCount,
          useRecovery,
          painFlag,
          trainingRecency: recency ?? undefined,
          heatCta: heatExpanded,
          painOverridden,
        })
      }

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

  if (!isLegacyFlow && !draft) {
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
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Before we start
        </h1>
        {sessionSummary && (
          <p className="mt-1 text-sm font-medium text-accent">
            {sessionSummary}
          </p>
        )}
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Any pain that changes how you move?
        </h2>
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
          onContinueRecovery={() => void handleCreateSession(true, false)}
          onOverride={() => void handleCreateSession(false, true)}
        />
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          When did you last train?
        </h2>
        <div className="flex gap-2">
          {RECENCY_OPTIONS.map((opt) => {
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
