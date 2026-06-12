import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Callout,
  ChoiceRow,
  type ChoiceRowOption,
  ChoiceSection,
  ChoiceSubsection,
  ScreenHeader,
  ScreenShell,
  StatusMessage,
} from '../components/ui'
import type { PlayerMode, TimeProfile } from '../types/session'
import type { SessionDraft, SetupContext } from '../model'
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
import { loadSessionCalibration } from '../services/calibration'
import { loadStressPositions } from '../services/stressPositions'
import type { SessionCalibration } from '../domain/calibration/sessionCalibration'
import type { StressPositions } from '../domain/adaptation/stressPosition'
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

  // U5 (2026-05-24 duration-honesty plan, R7+R8+R10 via PD-2 (A)
  // build-on-completable): cache the build-time inputs (last-completed
  // map + saved player level + derived stress positions, D154) once on
  // mount so the preview build that surfaces the assembled total stays
  // consistent with the Build-commit build — handleConfirm persists the
  // preview draft without rebuilding, so steering must live here.
  const [previewInputs, setPreviewInputs] = useState<{
    readonly lastCompletedByType: Partial<Record<BlockSlotType, string>>
    readonly playerLevel: PlayerLevel | undefined
    readonly stressPositions: StressPositions | undefined
    readonly calibration: SessionCalibration | undefined
  } | null>(null)
  const [previewDraft, setPreviewDraft] = useState<SessionDraft | null>(null)

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

  // U5 (2026-05-24 duration-honesty plan, PD-2 (A)): load preview-build
  // inputs (lastCompletedByType + skill level) once on mount, after the
  // initial prefill, so the preview build does not race the prefill or
  // re-read storage on every Setup state change. Best-effort, mirrors
  // `handleConfirm`'s legacy reads.
  useEffect(() => {
    if (!prefilled) return
    let cancelled = false
    ;(async () => {
      try {
        const [completedResult, skillResult, stressResult, calibrationResult] =
          await Promise.allSettled([
            findLastCompletedDrillIdsByType(),
            getStorageMeta('onboarding.skillLevel', isSkillLevel),
            loadStressPositions(),
            loadSessionCalibration(),
          ])
        if (cancelled) return
        const lastCompletedByType =
          completedResult.status === 'fulfilled' ? completedResult.value : {}
        const skillLevel = skillResult.status === 'fulfilled' ? skillResult.value : undefined
        const playerLevel = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
        const stressPositions = stressResult.status === 'fulfilled' ? stressResult.value : undefined
        const calibration =
          calibrationResult.status === 'fulfilled' ? calibrationResult.value : undefined
        setPreviewInputs({ lastCompletedByType, playerLevel, stressPositions, calibration })
      } catch {
        if (!cancelled)
          setPreviewInputs({
            lastCompletedByType: {},
            playerLevel: undefined,
            stressPositions: undefined,
            calibration: undefined,
          })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [prefilled])

  // U5 (PD-2 (A)): rebuild the preview draft whenever Setup is
  // completable and the build-time context changes. Surfaces the real
  // assembled total in the Setup chrome above the Build button (R7);
  // on Build commit the same draft is persisted as-stored (no rebuild
  // — R8). Builds only fire when `isComplete` is true so we never
  // build on incomplete state (PD-2 (A): no eager-on-every-toggle on
  // the incomplete path).
  const previewContext = useMemo<SetupContext | null>(() => {
    if (!isComplete) return null
    const ctx: SetupContext = {
      playerMode: playerMode!,
      timeProfile,
      netAvailable: netAvailable!,
      wallAvailable: showWall ? wallAvailable! : false,
    }
    if (sessionFocus !== 'recommended') {
      ctx.sessionFocus = sessionFocus
    }
    return ctx
  }, [isComplete, playerMode, timeProfile, netAvailable, wallAvailable, showWall, sessionFocus])

  useEffect(() => {
    if (!previewContext || !previewInputs) {
      setPreviewDraft(null)
      return
    }
    const draft = buildDraft(previewContext, {
      lastCompletedByType: previewInputs.lastCompletedByType,
      playerLevel: previewInputs.playerLevel,
      stressPositions: previewInputs.stressPositions,
      calibration: previewInputs.calibration,
    })
    setPreviewDraft(draft)
  }, [previewContext, previewInputs])

  const previewTotalMinutes = useMemo(() => {
    if (!previewDraft) return null
    return previewDraft.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
  }, [previewDraft])

  // U6 (2026-05-24 duration-honesty plan, R9): large-gap guard.
  // Surface a calm `Callout tone="warning"` when the gap between the
  // named profile and the assembled total crosses 5 min. The 5-min
  // threshold is a sensible default; copy is a sensible default too —
  // a courtside-copy polish PR may refine both once field-use settles
  // (per the plan's Deferred to Follow-Up Work).
  const LARGE_GAP_THRESHOLD_MINUTES = 5
  const previewLargeGap = useMemo(() => {
    if (previewTotalMinutes === null) return null
    const gap = timeProfile - previewTotalMinutes
    return gap >= LARGE_GAP_THRESHOLD_MINUTES
      ? { assembled: previewTotalMinutes, named: timeProfile }
      : null
  }, [previewTotalMinutes, timeProfile])

  // D158 (2026-06-12 shibui comp review, setup-01 frame): focal resolved
  // line at the top of the refine cluster — `Pair + Net · 38 min ·
  // Recommended focus`. The minute segment always reads the *assembled
  // preview total* (the same number the footer Callout reports), never
  // the named Time-chip profile, so the screen's two duration statements
  // cannot disagree (duration-honesty R4). Null until the preview draft
  // exists; the incomplete placeholder renders in its slot instead.
  const resolvedLine = useMemo(() => {
    if (!previewDraft || previewTotalMinutes === null) return null
    const focusLabel =
      FOCUS_OPTIONS.find((option) => option.value === sessionFocus)?.label ?? 'Recommended'
    return `${previewDraft.archetypeName} · ${previewTotalMinutes} min · ${focusLabel} focus`
  }, [previewDraft, previewTotalMinutes, sessionFocus])

  const submitting = useRef(false)

  const handleConfirm = useCallback(async () => {
    if (!isComplete || submitting.current) return
    submitting.current = true
    setIsSaving(true)
    setError(null)

    try {
      // U5 (2026-05-24 duration-honesty plan, R7+R8+R10 via PD-2 (A)
      // build-on-completable): persist the preview draft (built when
      // Setup became completable) without rebuilding. Safety / Run
      // consume the persisted draft as-stored, so the duration shown
      // above the Build button is the duration the session actually
      // runs. If preview inputs / draft are not ready yet (race with
      // prefill — Dexie blocked, etc.), fall back to a fresh build at
      // commit time, mirroring the legacy reads.
      let draft = previewDraft
      if (!draft) {
        const context: SetupContext = {
          playerMode: playerMode!,
          timeProfile,
          netAvailable: netAvailable!,
          wallAvailable: showWall ? wallAvailable! : false,
        }
        if (sessionFocus !== 'recommended') {
          context.sessionFocus = sessionFocus
        }
        let lastCompletedByType: Partial<Record<BlockSlotType, string>> =
          previewInputs?.lastCompletedByType ?? {}
        let playerLevel: PlayerLevel | undefined = previewInputs?.playerLevel
        let stressPositions: StressPositions | undefined = previewInputs?.stressPositions
        let calibration: SessionCalibration | undefined = previewInputs?.calibration
        if (!previewInputs) {
          try {
            lastCompletedByType = await findLastCompletedDrillIdsByType()
            const skillLevel = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
            playerLevel = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
            stressPositions = await loadStressPositions()
            calibration = await loadSessionCalibration()
          } catch {
            if (isSchemaBlocked()) return
          }
        }
        draft = buildDraft(context, { lastCompletedByType, playerLevel, stressPositions, calibration })
      }
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
    previewDraft,
    previewInputs,
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
      {/* Phase F12 (2026-04-19): screen title sentence case (was
          "Today's Setup" Title Case). Matches "Before we start",
          "Settings", and the rest of the app per brand-ux
          guidelines §1.4. See
          `docs/archive/plans/2026-04-19-feat-phase-f12-ux-consistency-plan.md`. */}
      <ScreenHeader
        backLabel={isOnboarding ? 'Skill level' : 'Home'}
        onBack={() => navigate(isOnboarding ? routes.onboardingSkillLevel() : routes.home())}
        title={<>Today&apos;s setup</>}
      />

      {/* D158 (setup-01 frame): the body is recommendation-first — a
          focal resolved line carries the screen ("Pair + Net · 38 min ·
          Recommended focus") and the chip sections recede into a dense
          refine cluster (`cockpit` rhythm, quiet uppercase micro-label
          headings). Incomplete states render the existing hint copy in
          the focal slot in secondary voice instead of fabricating a
          resolved summary. */}
      <ScreenShell.Body rhythm="cockpit">
        {resolvedLine ? (
          <p
            data-testid="setup-resolved-line"
            className="text-lg font-semibold leading-snug text-text-primary"
          >
            {resolvedLine}
          </p>
        ) : incompleteHint ? (
          <p data-testid="setup-resolved-line-placeholder" className="text-sm text-text-secondary">
            {incompleteHint}
          </p>
        ) : null}

        <ChoiceSection title="Players" headingVariant="micro">
          <ChoiceRow<PlayerMode>
            value={playerMode}
            onChange={setPlayerMode}
            options={[
              { value: 'solo', label: 'Solo' },
              { value: 'pair', label: 'Pair' },
            ]}
            ariaLabel="Player mode"
          />
        </ChoiceSection>

        <ChoiceSection title="Net" headingVariant="micro">
          <ChoiceRow<'yes' | 'no'>
            value={netAvailable === null ? null : netAvailable ? 'yes' : 'no'}
            onChange={(next) => setNetAvailable(next === 'yes')}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            ariaLabel="Net available"
          />
          {showWall && (
            <ChoiceSubsection
              titleId="wall-available-label"
              title="Wall or fence nearby?"
              headingVariant="micro"
            >
              <ChoiceRow<'yes' | 'no'>
                value={wallAvailable === null ? null : wallAvailable ? 'yes' : 'no'}
                onChange={(next) => setWallAvailable(next === 'yes')}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
                ariaLabelledBy="wall-available-label"
              />
            </ChoiceSubsection>
          )}
        </ChoiceSection>

        <ChoiceSection
          title="Time"
          headingVariant="micro"
          footerNote="Includes warm-up and cool-down."
        >
          {/* 2026-04-21 partner-walkthrough P1-10: Seb expected 15 min to
            mean 15 min of main/technique work, not "total session
            including warm-up and cool-down." Clarifier lives in the
            shared `ChoiceSection` footerNote. See
            docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md. */}
          <ChoiceRow<string>
            value={String(timeProfile)}
            onChange={(next) => setTimeProfile(Number.parseInt(next, 10) as TimeProfile)}
            options={TIME_OPTIONS.map(
              (t): ChoiceRowOption<string> => ({ value: String(t), label: `${t} min` }),
            )}
            ariaLabel="Time profile"
          />
        </ChoiceSection>

        <ChoiceSection title="Focus" headingVariant="micro">
          <ChoiceRow<SetupFocus>
            value={sessionFocus}
            onChange={setSessionFocus}
            options={FOCUS_OPTIONS.map(
              (option): ChoiceRowOption<SetupFocus> => ({
                value: option.value,
                label: option.label,
              }),
            )}
            layout="grid-2"
            ariaLabel="Focus"
          />
        </ChoiceSection>

        {error && <StatusMessage variant="error" message={error} />}
      </ScreenShell.Body>

      <ScreenShell.Footer>
        {/* U6 (2026-05-24 duration-honesty plan, R9): large-gap guard.
            When the assembled total is short of the named profile by
            5+ min, surface a calm warning inline above the Build
            button. The warning does NOT block commit — the user
            retains agency to build the shorter session as-is. */}
        {isComplete && previewLargeGap !== null && !isSaving && (
          <Callout tone="warning" size="sm" role="status">
            <span data-testid="setup-large-gap-warning">
              About {previewLargeGap.assembled} min instead of {previewLargeGap.named} min. This
              focus has fewer drills available.
            </span>
          </Callout>
        )}
        {/* U5 (2026-05-24 duration-honesty plan, R7+R10): once Setup is
            completable AND the gap is within the warning threshold,
            surface the calm informative duration. When the gap is
            large the warning above replaces this — never both. */}
        {isComplete && previewTotalMinutes !== null && previewLargeGap === null && !isSaving && (
          <Callout tone="info" size="sm" role="status">
            <span data-testid="setup-assembled-duration">
              This session will run about {previewTotalMinutes} min.
            </span>
          </Callout>
        )}
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
