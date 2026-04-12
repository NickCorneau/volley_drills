import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PainOverrideCard } from '../components/PainOverrideCard'
import { db } from '../db/schema'
import type {
  ExecutionLog,
  SessionPlan,
  SessionPlanSafetyCheck,
} from '../db/types'
import { buildPresetBlocks, PRESETS } from '../domain/presets'

type TrainingRecency = '0 days' | '1 day' | '2+' | 'First time'

const RECENCY_OPTIONS: TrainingRecency[] = ['0 days', '1 day', '2+', 'First time']

const HEAT_TIPS = [
  'Hydrate before, during, and after your session.',
  'Avoid peak sun hours (10 AM – 4 PM) when possible.',
  'Take shade breaks between blocks if you feel overheated.',
  'Wear sunscreen and light-colored clothing.',
  'Stop immediately if you feel dizzy or nauseous.',
]

export function SafetyCheckScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const presetId = searchParams.get('preset') ?? ''
  const playerCount = Number(searchParams.get('players') ?? '1') as 1 | 2

  const preset = PRESETS.find((p) => p.id === presetId)

  const [painFlag, setPainFlag] = useState<boolean | null>(null)
  const [recency, setRecency] = useState<TrainingRecency | null>(null)
  const [heatExpanded, setHeatExpanded] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const allBlocks = buildPresetBlocks(presetId)
  const recoveryBlocks = allBlocks.filter((b) => b.type !== 'main_skill')
  const recoveryMinutes = recoveryBlocks.reduce(
    (sum, b) => sum + b.durationMinutes,
    0,
  )

  const canContinue = painFlag === false && recency !== null

  async function createSessionAndNavigate(
    useRecovery: boolean,
    painOverridden: boolean,
  ) {
    if (isCreating) return
    setIsCreating(true)

    const blocks = useRecovery ? recoveryBlocks : allBlocks
    const planId = crypto.randomUUID()
    const execId = crypto.randomUUID()
    const now = Date.now()

    const safetyCheck: SessionPlanSafetyCheck = {
      painFlag: painFlag ?? false,
      trainingRecency: recency ?? undefined,
      heatCta: heatExpanded,
      painOverridden,
    }

    const plan: SessionPlan = {
      id: planId,
      presetId,
      presetName: useRecovery
        ? 'Recovery Technique Session'
        : (preset?.name ?? 'Session'),
      playerCount,
      blocks: blocks.map((b) => ({
        id: b.id,
        type: b.type,
        drillName: b.drillName,
        shortName: b.shortName,
        durationMinutes: b.durationMinutes,
        coachingCue: b.coachingCue,
        courtsideInstructions: b.courtsideInstructions,
        required: b.required,
      })),
      safetyCheck,
      createdAt: now,
    }

    const exec: ExecutionLog = {
      id: execId,
      planId,
      status: 'not_started',
      activeBlockIndex: 0,
      blockStatuses: blocks.map((b) => ({
        blockId: b.id,
        status: 'planned' as const,
      })),
      startedAt: now,
    }

    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)
    navigate(`/run?id=${execId}`)
  }

  if (!preset) {
    return (
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-[390px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Session not found</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="min-h-[54px] px-4 text-sm font-medium text-accent"
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-8">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Before we start
        </h1>
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
          onContinueRecovery={() => void createSessionAndNavigate(true, false)}
          onOverride={() => void createSessionAndNavigate(false, true)}
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

      {painFlag === false && (
        <button
          type="button"
          onClick={() => void createSessionAndNavigate(false, false)}
          disabled={!canContinue || isCreating}
          className={[
            'min-h-[54px] w-full rounded-[16px] px-4 py-3 text-base font-semibold text-white transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'bg-accent active:bg-accent-pressed',
          ].join(' ')}
        >
          {isCreating ? 'Creating session…' : 'Continue'}
        </button>
      )}
    </div>
  )
}
