import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayerToggle, type PlayerCount } from '../components/PlayerToggle'
import { PresetCard } from '../components/PresetCard'
import { ResumePrompt } from '../components/ResumePrompt'
import { Button } from '../components/ui'
import { getPresetsForPlayerCount } from '../domain'
import { formatInterruptedAgo } from '../lib/format'
import { routes } from '../routes'
import {
  discardSession,
  findResumableSession,
  type ResumableSession,
} from '../services/session'

export function StartScreen() {
  const navigate = useNavigate()
  const [playerCount, setPlayerCount] = useState<PlayerCount>(1)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumableSession | null>(null)

  useEffect(() => {
    let cancelled = false
    findResumableSession().then((result) => {
      if (!cancelled) setResumeData(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const visiblePresets = useMemo(
    () => getPresetsForPlayerCount(playerCount),
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
    navigate(routes.safety(effectiveSelectedId, playerCount))
  }

  const handleResumeSession = useCallback(() => {
    if (!resumeData) return
    const id = resumeData.execution.id
    setResumeData(null)
    navigate(routes.run(id))
  }, [navigate, resumeData])

  const handleDiscardSession = useCallback(async () => {
    if (!resumeData) return
    const execId = resumeData.execution.id
    await discardSession(resumeData.execution)
    setResumeData(null)
    navigate(routes.review(execId))
  }, [resumeData, navigate])

  const resumeBlock =
    resumeData?.plan.blocks[resumeData.execution.activeBlockIndex]

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8 pb-8">
      {resumeData && (
        <ResumePrompt
          sessionName={resumeData.plan.presetName}
          blockDrillName={resumeBlock?.drillName ?? 'Current block'}
          blockPositionLabel={`Block ${resumeData.execution.activeBlockIndex + 1} of ${resumeData.plan.blocks.length}`}
          interruptedAgo={formatInterruptedAgo(resumeData.interruptedAt)}
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
        <h2
          id="players-heading"
          className="text-sm font-semibold text-text-primary"
        >
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
        <Button
          variant="primary"
          fullWidth
          onClick={handleStart}
          disabled={effectiveSelectedId == null}
        >
          Start Session
        </Button>
        <p className="text-center text-xs text-text-secondary">
          Your data stays on this device
        </p>
      </div>
    </div>
  )
}
