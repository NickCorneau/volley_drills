import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import type { PlayerMode, TimeProfile } from '../types/session'
import type { SetupContext } from '../db/types'
import { buildDraft } from '../domain/sessionBuilder'
import { getLastContext, saveDraft } from '../services/session'
import { routes } from '../routes'
import { cx } from '../lib/cn'

const TIME_OPTIONS: TimeProfile[] = [15, 25, 40]

function ToggleChip({
  label,
  active,
  onTap,
}: {
  label: string
  active: boolean
  onTap: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onTap}
      className={cx(
        'min-h-[48px] min-w-[48px] flex-1 rounded-[12px] px-3 py-2 text-base font-semibold transition-colors',
        active
          ? 'bg-accent text-white'
          : 'border border-text-secondary/20 bg-bg-primary text-text-primary',
      )}
    >
      {label}
    </button>
  )
}

export function SetupScreen() {
  const navigate = useNavigate()

  const [playerMode, setPlayerMode] = useState<PlayerMode | null>(null)
  const [netAvailable, setNetAvailable] = useState<boolean | null>(null)
  const [wallAvailable, setWallAvailable] = useState<boolean | null>(null)
  const [timeProfile, setTimeProfile] = useState<TimeProfile>(15)
  const [prefilled, setPrefilled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    getLastContext()
      .then((ctx) => {
        if (cancelled) return
        if (ctx) {
          setPlayerMode(ctx.playerMode)
          setNetAvailable(ctx.netAvailable)
          setWallAvailable(ctx.wallAvailable)
          setTimeProfile(ctx.timeProfile)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPrefilled(true)
      })
    return () => { cancelled = true }
  }, [])

  const isComplete =
    playerMode !== null && netAvailable !== null && wallAvailable !== null

  const submitting = useRef(false)

  const handleConfirm = useCallback(async () => {
    if (!isComplete || submitting.current) return
    submitting.current = true
    setIsSaving(true)
    setError(null)

    try {
      const context: SetupContext = {
        playerMode: playerMode!,
        timeProfile,
        netAvailable: netAvailable!,
        wallAvailable: wallAvailable!,
      }

      const draft = buildDraft(context)
      if (!draft) {
        setError("Can't build a session for these constraints. Try different options.")
        return
      }

      await saveDraft(draft)
      navigate(routes.safetyFromDraft())
    } catch {
      setError('Failed to save session. Please try again.')
    } finally {
      submitting.current = false
      setIsSaving(false)
    }
  }, [isComplete, playerMode, timeProfile, netAvailable, wallAvailable, navigate])

  if (!prefilled) {
    return (
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-[390px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Loading setup...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 pb-8">
      <header className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => navigate(routes.home())}
          className="text-sm text-accent"
        >
          &larr; Home
        </button>
        <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-text-primary">
          Today&apos;s Setup
        </h1>
        <div className="w-12" />
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-primary">Players</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="Player mode">
          <ToggleChip
            label="Solo"
            active={playerMode === 'solo'}
            onTap={() => setPlayerMode('solo')}
          />
          <ToggleChip
            label="Pair"
            active={playerMode === 'pair'}
            onTap={() => setPlayerMode('pair')}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-primary">Net available?</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="Net available">
          <ToggleChip
            label="Yes"
            active={netAvailable === true}
            onTap={() => setNetAvailable(true)}
          />
          <ToggleChip
            label="No"
            active={netAvailable === false}
            onTap={() => setNetAvailable(false)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-primary">Wall / fence?</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="Wall available">
          <ToggleChip
            label="Yes"
            active={wallAvailable === true}
            onTap={() => setWallAvailable(true)}
          />
          <ToggleChip
            label="No"
            active={wallAvailable === false}
            onTap={() => setWallAvailable(false)}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-primary">Time</h2>
        <div className="flex gap-2" role="radiogroup" aria-label="Time profile">
          {TIME_OPTIONS.map((t) => (
            <ToggleChip
              key={t}
              label={`${t} min`}
              active={timeProfile === t}
              onTap={() => setTimeProfile(t)}
            />
          ))}
        </div>
      </section>

      {error && (
        <p className="rounded-[12px] bg-warning-surface px-4 py-3 text-sm text-warning">
          {error}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-4 pt-4">
        <Button
          variant="primary"
          fullWidth
          disabled={!isComplete || isSaving}
          onClick={handleConfirm}
        >
          {isSaving ? 'Building…' : 'Build Session'}
        </Button>
      </div>
    </div>
  )
}
