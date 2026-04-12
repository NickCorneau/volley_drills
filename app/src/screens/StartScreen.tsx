import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayerToggle, type PlayerCount } from '../components/PlayerToggle'
import { PresetCard, type SessionPreset } from '../components/PresetCard'
import { ResumePrompt } from '../components/ResumePrompt'
import { db, clearTimerState, readTimerState } from '../db'
import type { ExecutionLog, SessionPlan } from '../db'

const PRESETS: SessionPreset[] = [
  {
    id: 'wall-pass',
    name: 'Wall Pass Workout',
    env: 'Solo · 12 min · Wall + ball',
    desc: 'Practice passing against a wall or fence',
    playerCount: 1,
  },
  {
    id: 'open-sand',
    name: 'Open Sand Workout',
    env: 'Solo · 12 min · Ball + markers',
    desc: 'Self-toss passing on open sand',
    playerCount: 1,
  },
  {
    id: 'solo-serving',
    name: 'Solo Serving Practice',
    env: 'Solo · 12 min · Net + balls',
    desc: 'Serve to zones — build placement and your routine',
    playerCount: 1,
  },
  {
    id: 'partner-pass',
    name: 'Partner Pass Workout',
    env: 'Pair · 15 min · Net + ball',
    desc: 'Pass back and forth across a net',
    playerCount: 2,
  },
  {
    id: 'serve-receive',
    name: 'Serve & Receive',
    env: 'Pair · 15 min · Net + balls',
    desc: 'One serves, one passes — trade roles and keep score',
    playerCount: 2,
  },
]

function formatInterruptedAgo(interruptedAt: number): string {
  const ms = Date.now() - interruptedAt
  const s = Math.floor(ms / 1000)
  if (s < 45) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return m === 1 ? 'about 1 min ago' : `about ${m} min ago`
  const h = Math.floor(m / 60)
  return h === 1 ? 'about 1 hr ago' : `about ${h} hr ago`
}

async function orphanExecutionWithoutPlan(exec: ExecutionLog): Promise<void> {
  await db.executionLogs.put({
    ...exec,
    status: 'ended_early',
    completedAt: Date.now(),
    endedEarlyReason: 'missing_plan',
  })
  await clearTimerState()
}

async function discardInterruptedSession(exec: ExecutionLog): Promise<void> {
  const now = Date.now()
  const blockStatuses = exec.blockStatuses.map((bs, i) => {
    if (i === exec.activeBlockIndex && bs.status === 'in_progress') {
      return { ...bs, status: 'skipped' as const, completedAt: now }
    }
    if (i >= exec.activeBlockIndex && bs.status === 'planned') {
      return { ...bs, status: 'skipped' as const }
    }
    return bs
  })
  await db.executionLogs.put({
    ...exec,
    status: 'ended_early',
    blockStatuses,
    completedAt: now,
    endedEarlyReason: 'discarded_resume',
  })
  await clearTimerState()
}

type ResumePromptData = {
  execution: ExecutionLog
  plan: SessionPlan
  interruptedAt: number
}

export function StartScreen() {
  const navigate = useNavigate()
  const [playerCount, setPlayerCount] = useState<PlayerCount>(1)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [resumePrompt, setResumePrompt] = useState<ResumePromptData | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const logs = await db.executionLogs.toArray()
      const resumable = logs.filter(
        (l) => l.status === 'in_progress' || l.status === 'paused',
      )
      const exec = resumable.sort((a, b) => b.startedAt - a.startedAt)[0]
      if (cancelled) return
      if (!exec) {
        setResumePrompt(null)
        return
      }
      const plan = await db.sessionPlans.get(exec.planId)
      const timer = await readTimerState()
      if (cancelled) return
      if (!plan) {
        await orphanExecutionWithoutPlan(exec)
        setResumePrompt(null)
        return
      }
      const interruptedAt =
        exec.pausedAt ??
        (timer?.executionLogId === exec.id ? timer.lastFlushedAt : undefined) ??
        exec.startedAt
      setResumePrompt({ execution: exec, plan, interruptedAt })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const visiblePresets = useMemo(
    () => PRESETS.filter((p) => p.playerCount === playerCount),
    [playerCount],
  )

  const effectiveSelectedId = useMemo(() => {
    if (visiblePresets.length === 0) return null
    if (
      selectedPresetId != null &&
      visiblePresets.some((p) => p.id === selectedPresetId)
    ) {
      return selectedPresetId
    }
    return visiblePresets[0].id
  }, [visiblePresets, selectedPresetId])

  const handleStart = () => {
    if (effectiveSelectedId == null) return
    const params = new URLSearchParams({
      preset: effectiveSelectedId,
      players: String(playerCount),
    })
    navigate(`/safety?${params.toString()}`)
  }

  const handleResumeSession = useCallback(() => {
    if (!resumePrompt) return
    const id = resumePrompt.execution.id
    setResumePrompt(null)
    navigate(`/run?id=${id}`)
  }, [navigate, resumePrompt])

  const handleDiscardSession = useCallback(async () => {
    if (!resumePrompt) return
    const execId = resumePrompt.execution.id
    await discardInterruptedSession(resumePrompt.execution)
    setResumePrompt(null)
    navigate(`/review?id=${encodeURIComponent(execId)}`)
  }, [resumePrompt, navigate])

  const resumeBlock =
    resumePrompt?.plan.blocks[resumePrompt.execution.activeBlockIndex]

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-8">
      {resumePrompt && (
        <ResumePrompt
          sessionName={resumePrompt.plan.presetName}
          blockDrillName={resumeBlock?.drillName ?? 'Current block'}
          blockPositionLabel={`Block ${resumePrompt.execution.activeBlockIndex + 1} of ${resumePrompt.plan.blocks.length}`}
          interruptedAgo={formatInterruptedAgo(resumePrompt.interruptedAt)}
          onResume={handleResumeSession}
          onDiscard={handleDiscardSession}
        />
      )}

      <header className="pt-2 text-center">
        <div className="text-4xl" aria-hidden>
          🏐
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
          Volley Drills
        </h1>
        <p className="mt-1 text-text-secondary">Pick a session and try it out</p>
      </header>

      <section aria-labelledby="players-heading" className="flex flex-col gap-3">
        <h2 id="players-heading" className="text-sm font-semibold text-text-primary">
          Players today
        </h2>
        <PlayerToggle value={playerCount} onChange={setPlayerCount} />
      </section>

      <section aria-labelledby="sessions-heading" className="flex flex-col gap-3">
        <h2 id="sessions-heading" className="sr-only">
          Sessions
        </h2>
        <ul className="flex flex-col gap-3">
          {visiblePresets.map((preset) => (
            <li key={preset.id}>
              <PresetCard
                preset={preset}
                selected={preset.id === effectiveSelectedId}
                onSelect={() => setSelectedPresetId(preset.id)}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto flex flex-col gap-4">
        <button
          type="button"
          onClick={handleStart}
          disabled={effectiveSelectedId == null}
          className={[
            'min-h-[56px] w-full rounded-[16px] px-4 py-3 text-base font-semibold text-white',
            'transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'bg-accent active:bg-accent-pressed',
          ].join(' ')}
        >
          Start Session
        </button>
        <p className="text-center text-xs text-text-secondary">
          Your data stays on this device
        </p>
      </div>
    </div>
  )
}
