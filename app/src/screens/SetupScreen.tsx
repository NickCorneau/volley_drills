import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BackButton,
  Button,
  ScreenShell,
  SetupChoiceSection,
  SetupNestedChoiceBlock,
  StatusMessage,
  ToggleChip,
} from '../components/ui'
import type { PlayerMode, TimeProfile } from '../types/session'
import type { SetupContext } from '../model'
import { buildDraft } from '../domain/sessionBuilder'
import { isOnboardingStep } from '../lib/onboarding'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { isSkillLevel, skillLevelToDrillBand } from '../lib/skillLevel'
import {
  findLastCompletedDrillIdsByType,
  getCurrentDraft,
  getLastContext,
  saveDraft,
} from '../services/session'
import type { BlockSlotType } from '../types/session'
import { getStorageMeta, setStorageMeta } from '../services/storageMeta'
import { routes } from '../routes'
import type { PlayerLevel } from '../types/drill'

const TIME_OPTIONS: TimeProfile[] = [15, 25, 40]
const FOCUS_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'pass', label: 'Passing' },
  { value: 'serve', label: 'Serving' },
  { value: 'set', label: 'Setting' },
] as const

type SetupFocus = (typeof FOCUS_OPTIONS)[number]['value']

const isTimestamp = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0

type SetupLocationState = {
  editDraft?: boolean
}

function isSetupLocationState(value: unknown): value is SetupLocationState {
  return typeof value === 'object' && value !== null && 'editDraft' in value
}

export type SetupScreenProps = {
  /** C-3: first-run Today's Setup - no last-session prefill, back -> Skill Level, completes onboarding on Build. */
  isOnboarding?: boolean
}

export function SetupScreen({ isOnboarding = false }: SetupScreenProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const shouldHydrateDraft =
    !isOnboarding && isSetupLocationState(location.state) && location.state.editDraft === true
  // 2026-04-22 one-tap Repeat simplification: the `?from=repeat`
  // branch + `StaleContextBanner` were retired here. Setup renders for
  // fresh / "Start a different session" entries, where
  // `getLastContext()` silently pre-fills the physical setup toggles
  // from the last session as a convenience (no banner — the user
  // explicitly asked to start something different, so naming the prior
  // day is noise). Fresh setup defaults to the fastest common path
  // (Solo + net available + Recommended focus); edit mode restores the
  // current draft focus.

  const [playerMode, setPlayerMode] = useState<PlayerMode | null>('solo')
  const [netAvailable, setNetAvailable] = useState<boolean | null>(true)
  const [wallAvailable, setWallAvailable] = useState<boolean | null>(null)
  const [timeProfile, setTimeProfile] = useState<TimeProfile>(15)
  const [sessionFocus, setSessionFocus] = useState<SetupFocus>('recommended')
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
        const ctx = shouldHydrateDraft
          ? ((await getCurrentDraft())?.context ?? null)
          : await getLastContext()
        if (cancelled) return
        if (ctx) {
          setPlayerMode(ctx.playerMode)
          setNetAvailable(ctx.netAvailable)
          setWallAvailable(ctx.wallAvailable)
          setTimeProfile(ctx.timeProfile)
          setSessionFocus(shouldHydrateDraft ? (ctx.sessionFocus ?? 'recommended') : 'recommended')
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
  }, [isOnboarding, navigate, shouldHydrateDraft])

  const showWall = playerMode === 'solo' && netAvailable === false
  const isComplete =
    playerMode !== null && netAvailable !== null && (!showWall || wallAvailable !== null)
  const incompleteHint =
    playerMode === null
      ? 'Choose players to build.'
      : netAvailable === null
        ? 'Choose net availability to build.'
        : showWall && wallAvailable === null
          ? 'Choose wall or fence availability to build.'
          : null

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
        wallAvailable: showWall ? wallAvailable! : false,
      }
      if (sessionFocus !== 'recommended') {
        context.sessionFocus = sessionFocus
      }

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
      let playerLevel: PlayerLevel | undefined
      try {
        lastCompletedByType = await findLastCompletedDrillIdsByType()
        const skillLevel = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
        playerLevel = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
      } catch {
        if (isSchemaBlocked()) return
      }

      const draft = buildDraft(context, { lastCompletedByType, playerLevel })
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
    sessionFocus,
    netAvailable,
    wallAvailable,
    showWall,
    isOnboarding,
    navigate,
  ])

  if (!prefilled) {
    return <StatusMessage variant="loading" message="Loading setup…" />
  }

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: pin `Build session` to
        the footer. The setup rows can slip below the fold on a 390 x 844
        iPhone when any section expands or a tester re-reads the options.
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
            `docs/archive/plans/2026-04-19-feat-phase-f12-ux-consistency-plan.md`. */}
        <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
          Today&apos;s setup
        </h1>
        <div className="w-12" />
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-6 pb-4">
        <SetupChoiceSection title="Players">
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
        </SetupChoiceSection>

        <SetupChoiceSection title="Net">
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
          {showWall && (
            <SetupNestedChoiceBlock titleId="wall-available-label" title="Wall or fence nearby?">
              <div className="flex gap-2" role="radiogroup" aria-labelledby="wall-available-label">
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
            </SetupNestedChoiceBlock>
          )}
        </SetupChoiceSection>

        <SetupChoiceSection
          title="Time"
          footerNote="Includes warm-up and cool-down."
        >
          {/* 2026-04-21 partner-walkthrough P1-10: Seb expected 15 min to
            mean 15 min of main/technique work, not "total session
            including warm-up and cool-down." Clarifier lives in
            `SetupChoiceSection` footerNote. See
            docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md. */}
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
        </SetupChoiceSection>

        <SetupChoiceSection
          title={
            <>
              Focus <span className="font-normal text-text-secondary">(optional)</span>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Focus">
            {FOCUS_OPTIONS.map((option) => (
              <ToggleChip
                key={option.value}
                label={option.label}
                selected={sessionFocus === option.value}
                onTap={() => setSessionFocus(option.value)}
                fill={false}
                className="min-w-0 w-full"
              />
            ))}
          </div>
        </SetupChoiceSection>

        {error && <StatusMessage variant="error" message={error} />}
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-2 pt-3">
        {incompleteHint && !isSaving && (
          <p className="text-center text-xs text-text-secondary">{incompleteHint}</p>
        )}
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
