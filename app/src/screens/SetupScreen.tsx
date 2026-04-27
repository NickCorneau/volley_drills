import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButton, Button, ScreenShell, ToggleChip } from '../components/ui'
import type { PlayerMode, TimeProfile } from '../types/session'
import type { SetupContext } from '../db/types'
import { buildDraft } from '../domain/sessionBuilder'
import { isOnboardingStep } from '../lib/onboarding'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { findLastCompletedDrillIdsByType, getLastContext, saveDraft } from '../services/session'
import type { BlockSlotType } from '../types/session'
import { getStorageMeta, setStorageMeta } from '../services/storageMeta'
import { routes } from '../routes'

const TIME_OPTIONS: TimeProfile[] = [15, 25, 40]

type WindChoice = 'calm' | 'light' | 'strong'

const isTimestamp = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0

export type SetupScreenProps = {
  /** C-3: first-run Today's Setup - no last-session prefill, back → Skill Level, wind row, completes onboarding on Build. */
  isOnboarding?: boolean
}

export function SetupScreen({ isOnboarding = false }: SetupScreenProps) {
  const navigate = useNavigate()
  // 2026-04-22 one-tap Repeat simplification: the `?from=repeat`
  // branch + `StaleContextBanner` were retired here because `Repeat
  // this session` on Home now rebuilds the draft and jumps straight
  // to `/safety`. Setup only renders for fresh / "Start a different
  // session" entries, where `getLastContext()` silently pre-fills the
  // toggles from the last session as a convenience (no banner — the
  // user explicitly asked to start something different, so naming the
  // prior day is noise).

  const [playerMode, setPlayerMode] = useState<PlayerMode | null>(null)
  const [netAvailable, setNetAvailable] = useState<boolean | null>(null)
  const [wallAvailable, setWallAvailable] = useState<boolean | null>(null)
  const [timeProfile, setTimeProfile] = useState<TimeProfile>(15)
  const [wind, setWind] = useState<WindChoice>('calm')
  const [prefilled, setPrefilled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOnboarding) {
      setPrefilled(true)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const completedAt = await getStorageMeta('onboarding.completedAt', isTimestamp)
        if (cancelled) return
        if (completedAt == null) {
          const step = await getStorageMeta('onboarding.step', isOnboardingStep)
          if (cancelled) return
          navigate(
            step === 'todays_setup'
              ? routes.onboardingTodaysSetup()
              : routes.onboardingSkillLevel(),
            { replace: true },
          )
          return
        }
      } catch {
        if (cancelled || isSchemaBlocked()) return
      }

      try {
        const ctx = await getLastContext()
        if (cancelled) return
        if (ctx) {
          setPlayerMode(ctx.playerMode)
          setNetAvailable(ctx.netAvailable)
          setWallAvailable(ctx.wallAvailable)
          setTimeProfile(ctx.timeProfile)
          if (ctx.wind === 'light' || ctx.wind === 'strong') {
            setWind(ctx.wind)
          }
        }
      } catch {
        // Prefill is best-effort; a failed read falls through to defaults.
      } finally {
        if (!cancelled) setPrefilled(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isOnboarding, navigate])

  const isComplete = playerMode !== null && netAvailable !== null && wallAvailable !== null

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
      if (wind === 'light') context.wind = 'light'
      else if (wind === 'strong') context.wind = 'strong'

      // Phase 2.2 / 3.2 build-time substitution input. A fresh Setup
      // means the user is moving forward from their last main_skill
      // rep, so pass the recent completion map (per-slot drill ids)
      // to enable substitution when today's context blocks the
      // preferred progression (e.g., d03 done last time, no net today
      // blocks d04 -> substitute d10). Best-effort: if the lookup
      // fails (Dexie schema-blocked, etc.) we fall back to the legacy
      // default selection path - substitution is an enhancement, not
      // a requirement for build to proceed.
      let lastCompletedByType: Partial<Record<BlockSlotType, string>> = {}
      try {
        lastCompletedByType = await findLastCompletedDrillIdsByType()
      } catch {
        if (isSchemaBlocked()) return
      }

      const draft = buildDraft(context, { lastCompletedByType })
      if (!draft) {
        setError("Can't build a session for these constraints. Try different options.")
        return
      }

      await saveDraft(draft)
      if (isOnboarding) {
        await setStorageMeta('onboarding.completedAt', Date.now())
      }
      navigate(routes.safety())
    } catch {
      setError('Failed to save session. Please try again.')
    } finally {
      submitting.current = false
      setIsSaving(false)
    }
  }, [
    isComplete,
    playerMode,
    timeProfile,
    netAvailable,
    wallAvailable,
    wind,
    isOnboarding,
    navigate,
  ])

  if (!prefilled) {
    return (
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-[390px] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Loading setup...</p>
      </div>
    )
  }

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: pin `Build session` to
        the footer. With the stale-context banner + five question
        sections + the 2026-04-21 "Includes warm-up and cool-down"
        clarifier + the wind row, Setup reliably slips below the fold
        on a 390 × 844 iPhone when any section expands or a tester
        re-reads the options.
      */}
      <ScreenShell.Header className="flex items-center gap-2 pt-2 pb-3">
        <BackButton
          label={isOnboarding ? 'Skill level' : 'Home'}
          onClick={() => navigate(isOnboarding ? routes.onboardingSkillLevel() : routes.home())}
        />
        {/* Phase F12 (2026-04-19): screen title sentence case (was
            "Today's Setup" Title Case). Matches "Before we start",
            "Settings", and the rest of the app per brand-ux
            guidelines §1.4. See
            `docs/plans/2026-04-19-feat-phase-f12-ux-consistency-plan.md`. */}
        <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
          Today&apos;s setup
        </h1>
        <div className="w-12" />
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-6 pb-4">
        {/* Phase F8 (2026-04-19): section h2s lifted from `text-sm` to
          `text-base` to match Safety / Review / Settings (same
          semantic role across the app). See
          `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Players</h2>
          <div className="flex gap-2" role="radiogroup" aria-label="Player mode">
            <ToggleChip
              label="Solo"
              selected={playerMode === 'solo'}
              onTap={() => setPlayerMode('solo')}
            />
            <ToggleChip
              label="Pair"
              selected={playerMode === 'pair'}
              onTap={() => setPlayerMode('pair')}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Net</h2>
          <div className="flex gap-2" role="radiogroup" aria-label="Net available">
            <ToggleChip
              label="Yes"
              selected={netAvailable === true}
              onTap={() => setNetAvailable(true)}
            />
            <ToggleChip
              label="No"
              selected={netAvailable === false}
              onTap={() => setNetAvailable(false)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Wall or fence</h2>
          <div className="flex gap-2" role="radiogroup" aria-label="Wall available">
            <ToggleChip
              label="Yes"
              selected={wallAvailable === true}
              onTap={() => setWallAvailable(true)}
            />
            <ToggleChip
              label="No"
              selected={wallAvailable === false}
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
                selected={timeProfile === t}
                onTap={() => setTimeProfile(t)}
              />
            ))}
          </div>
          {/* 2026-04-21 partner-walkthrough P1-10: Seb expected 15 min to
            mean 15 min of main/technique work, not "total session
            including warm-up and cool-down." One-line clarifier below
            the picker surfaces the framing without inflating the setup
            funnel. See
            docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md. */}
          <p className="text-xs text-text-secondary">Includes warm-up and cool-down.</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Wind</h2>
          <div className="flex gap-2" role="radiogroup" aria-label="Wind">
            <ToggleChip label="Calm" selected={wind === 'calm'} onTap={() => setWind('calm')} />
            <ToggleChip
              label="Light wind"
              selected={wind === 'light'}
              onTap={() => setWind('light')}
            />
            <ToggleChip
              label="Strong wind"
              selected={wind === 'strong'}
              onTap={() => setWind('strong')}
            />
          </div>
        </section>

        {error && (
          <p className="rounded-[12px] bg-warning-surface px-4 py-3 text-sm text-warning">
            {error}
          </p>
        )}
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-4 pt-4">
        <Button
          variant="primary"
          fullWidth
          disabled={!isComplete || isSaving}
          onClick={handleConfirm}
        >
          {isSaving ? 'Building…' : 'Build session'}
        </Button>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
