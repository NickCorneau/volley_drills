import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PainOverrideCard } from '../components/PainOverrideCard'
import { BackButton, Button, ScreenShell, StatusMessage, ToggleChip } from '../components/ui'
import type { SessionDraft } from '../db/types'
import { buildRecoveryDraft, estimateRecoverySessionMinutes } from '../domain/sessionBuilder'
import {
  primeAudioForGesture,
  primeScreenWakeLockForGesture,
  releaseScreenWakeLock,
} from '../platform'
import { routes } from '../routes'
import { createSessionFromDraft, getCurrentDraft, hasEverStartedSession } from '../services/session'

// Primary recency chips. `2+` is an intermediate value - tapping it
// reveals a sub-row of granular buckets (post-physio-review 2026-04-20,
// `D129`), and the persisted `trainingRecency` is the sub-bucket
// string, not the literal `'2+'`. `canContinue` holds until a
// sub-bucket is picked.
//
// Partner-walkthrough polish 2026-04-22 (`D129`): the on-screen labels
// are rendered from `PRIMARY_RECENCY_LABEL` so `"Today" / "Yesterday"
// / "2+ days ago" / "First time"` reads as human time, not a
// spreadsheet `0 / 1 / 2+` count. The internal string values are
// unchanged so persisted `trainingRecency` fields, adaptation rules,
// and existing Dexie records all remain compatible; only the rendered
// label changes. Three passes (Player 3, iPhone viewport, design
// review) converged on this fix; see
// `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md`
// and `docs/plans/2026-04-22-partner-walkthrough-polish.md`.
type PrimaryRecency = '0 days' | '1 day' | '2+' | 'First time'
type LayoffBucket = '2-7 days' | '1-4 weeks' | '1-3 months' | '3+ months'
type TrainingRecency = PrimaryRecency | LayoffBucket

const RECENCY_OPTIONS: PrimaryRecency[] = ['0 days', '1 day', '2+', 'First time']
const PRIMARY_RECENCY_LABEL: Record<PrimaryRecency, string> = {
  '0 days': 'Today',
  '1 day': 'Yesterday',
  '2+': '2+ days ago',
  'First time': 'First time',
}
const LAYOFF_BUCKETS: LayoffBucket[] = ['2-7 days', '1-4 weeks', '1-3 months', '3+ months']
const LAYOFF_BUCKET_LABEL: Record<LayoffBucket, string> = {
  '2-7 days': '2–7 days',
  '1-4 weeks': '1–4 wks',
  '1-3 months': '1–3 mo',
  '3+ months': '3+ mo',
}

function isLayoffBucket(r: TrainingRecency | null): r is LayoffBucket {
  return r !== null && (LAYOFF_BUCKETS as string[]).includes(r)
}

// 2026-04-20 physio-review restructure: warning signs live above the
// prevention tips inside the expander. Heat illness is a minutes-matter
// escalation - users need to see the "stop immediately" cues first, not
// buried at the bottom of a bullet list. The short list below is scoped
// to heat-stroke red flags (confusion, stopped sweating, severe headache,
// vomiting, fainting); non-heat emergency guidance lives in SafetyIcon.
const HEAT_WARNING_SIGNS = [
  'Confusion or feeling "off"',
  'Stopped sweating, or hot, dry skin',
  'Severe headache or vomiting',
  'Fainting or near-fainting',
]

const HEAT_PREVENTION_TIPS = [
  'Hydrate before, during, and after your session.',
  'Avoid peak sun hours (10 AM to 4 PM) when possible.',
  'Take shade breaks between blocks if you feel overheated.',
  'Wear sunscreen and light-colored clothing.',
]

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
  // there's no session history - otherwise the chip would flash in for
  // one frame on every Safety visit for returning users.
  const [hasSessionHistory, setHasSessionHistory] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Parallelize the two reads - they're independent.
        const [d, hasHistory] = await Promise.all([getCurrentDraft(), hasEverStartedSession()])
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
    return () => {
      cancelled = true
    }
  }, [navigate])

  // Returning users never see "First time" - the chip is only meaningful
  // on a genuinely fresh install.
  const visibleRecencyOptions = useMemo<PrimaryRecency[]>(
    () =>
      hasSessionHistory ? RECENCY_OPTIONS.filter((opt) => opt !== 'First time') : RECENCY_OPTIONS,
    [hasSessionHistory],
  )

  // The `2+` chip is a disclosure trigger, not a submittable answer -
  // tapping it reveals the layoff-bucket sub-row, and `canContinue`
  // waits until one of those is selected. The primary row's selected
  // visual stays on `2+` whenever a sub-bucket is picked, so the two
  // rows read as a single nested question rather than two independent
  // chip groups.
  const showLayoffBuckets = recency === '2+' || isLayoffBucket(recency)
  const primaryRowSelection: PrimaryRecency | null = isLayoffBucket(recency)
    ? '2+'
    : (recency as PrimaryRecency | null)
  const recencyChosen = recency !== null && recency !== '2+'

  const recoveryMinutes = draft?.context ? (estimateRecoverySessionMinutes(draft.context) ?? 0) : 0

  const canContinue = painFlag === false && recencyChosen

  async function handleCreateSession(useRecovery: boolean, painOverridden: boolean) {
    if (creating.current) return
    if (painFlag === null || !recencyChosen) return
    if (!draft) return
    // iOS Safari/PWA only unlocks Web Audio from a real user gesture.
    // RunScreen's preroll starts after routing/effect timing, so prime
    // the shared AudioContext here while the Start session tap is still the
    // active gesture. No audible tone is scheduled.
    primeAudioForGesture()
    primeScreenWakeLockForGesture()
    creating.current = true
    setIsCreating(true)
    setCreateError(null)

    try {
      let sessionDraft = draft
      if (useRecovery) {
        const recovery = buildRecoveryDraft(draft.context)
        if (!recovery) {
          setCreateError('Could not build a lighter session. Try changing your setup.')
          void releaseScreenWakeLock()
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
      void releaseScreenWakeLock()
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
        <p className="text-text-secondary">{createError ?? 'Session not found'}</p>
        <Button variant="ghost" onClick={() => navigate(routes.setup())}>
          Back to setup
        </Button>
      </div>
    )
  }

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: Safety check became
        taller once the heat-expander, pain-override card, and recency
        sub-row shipped — on a 390 × 844 iPhone the Start session button
        regularly dropped below the fold. Pin Start session to the footer
        whenever the pain override is not active so the screen has a
        visible end point while incomplete and the happy-path CTA stays
        in thumb reach. Hide the footer only when `painFlag === true`
        because the `PainOverrideCard` in the body owns the CTAs in
        that state.
      */}
      <ScreenShell.Header className="pt-2 pb-3">
        {/**
         * Three-column header (Back | centered title | spacer) mirrors
         * SetupScreen so the "tap to escape" affordance lives in the same
         * thumb zone across the pre-run flow. Leaving SafetyCheck does
         * NOT mutate the persisted draft - SafetyCheckScreen only reads
         * the draft and writes safety answers inline on Start session - so a
         * Back tap returns the user to Home with their draft intact
         * (surfaces there as the Draft primary card per C-4 Surface 2).
         */}
        <div className="flex items-center gap-2">
          <BackButton label="Back" onClick={() => navigate(routes.home())} />
          <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
            Before we start
          </h1>
          <div className="w-12" />
        </div>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-6 pb-4">
        {/* 2026-04-19 dogfeed reorder: Recency first, then Pain. The
          old order placed the pain question first and rendered the
          PainOverrideCard between the two sections, which made the
          recency chips below look like they were blocked by the
          override card. With the flip, PainOverrideCard now sits at
          the bottom directly beneath its triggering question, which
          matches the "tapping Yes reveals options below" mental model
          users already expect from Setup / Safety form patterns. */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">When did you last train?</h2>
          {/* Description collapses the "or First time" clause for
            returning users so it matches the rendered chip set.
            Partner-walkthrough polish 2026-04-22: wording follows the
            chip labels - "Today" reads as a valid answer, not an
            alarm. */}
          <p className="text-sm text-text-secondary">
            {hasSessionHistory
              ? 'Today means a shorter, lower-intensity start.'
              : 'Today or First time means a shorter, lower-intensity start.'}
          </p>
          <div className="flex gap-2">
            {visibleRecencyOptions.map((opt) => (
              <ToggleChip
                key={opt}
                label={PRIMARY_RECENCY_LABEL[opt]}
                selected={primaryRowSelection === opt}
                onTap={() => setRecency(opt)}
                tone={opt === '0 days' ? 'warning' : 'accent'}
              />
            ))}
          </div>
          {/* 2026-04-20 physio-review: detraining is not linear - bucketing
            "2+" by weeks/months lets a 3+ month returner see a clinician
            nudge without making short-gap users read extra copy. The
            primary `2+` chip stays selected while a sub-bucket is active
            so the two rows read as one nested question. */}
          {showLayoffBuckets && (
            <div className="flex flex-col gap-2 rounded-[12px] bg-bg-warm/60 p-3">
              <p className="text-xs text-text-secondary">Roughly how long off?</p>
              <div className="flex gap-2">
                {LAYOFF_BUCKETS.map((bucket) => (
                  <ToggleChip
                    key={bucket}
                    label={LAYOFF_BUCKET_LABEL[bucket]}
                    selected={recency === bucket}
                    onTap={() => setRecency(bucket)}
                    size="sm"
                  />
                ))}
              </div>
              {recency === '3+ months' && (
                <p className="text-xs leading-relaxed text-text-secondary">
                  Coming back from injury or illness? Consider a quick check-in with a clinician
                  before ramping up.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">
            Any pain that&apos;s sharp, or makes you guard a movement?
          </h2>
          {/* 2026-04-20 physio-review: the original "pain that changes how
            you move" read to most users as "am I visibly limping," but
            the early warning sign is usually subtle guarding or
            avoidance. The parenthetical gives permission to distinguish
            DOMS from something that actually warrants a lighter
            session, which most recreational athletes find hard to
            self-sort. */}
          <p className="text-sm text-text-secondary">
            Regular muscle soreness is fine. We&apos;ll switch to a lighter session if yes.
          </p>
          {/* Field-test feedback 2026-04-21: the No / Yes buttons read
            visually heavier than the recency chips above (text-base
            font-semibold + px-4/py-3 vs the recency row's text-sm
            font-medium + px-2/py-2), so the two mutex rows looked like
            different families of controls. Harmonize: same weight, same
            radius, same padding, same font-size as the recency chips so
            "Before we start" reads as one consistent form. The
            unselected-Yes still swaps to a single hairline border to
            match the selected-state stroke width of the recency warning
            chip and keep the two rows visually equivalent. Unselected
            fills use `bg-bg-primary` like `ToggleChip` so chips read
            white on `bg-surface-calm`, not washed into the page. */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPainFlag(false)}
              className={[
                'min-h-[54px] flex-1 rounded-[16px] px-2 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                painFlag === false
                  ? 'border border-success bg-success text-white focus-visible:ring-success'
                  : 'border border-gray-200 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-success',
              ].join(' ')}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => setPainFlag(true)}
              className={[
                'min-h-[54px] flex-1 rounded-[16px] px-2 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                painFlag === true
                  ? 'border border-warning bg-warning-surface text-warning focus-visible:ring-warning'
                  : 'border border-gray-200 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-warning',
              ].join(' ')}
            >
              Yes
            </button>
          </div>
        </section>

        {painFlag === true && (
          <div className="flex flex-col gap-2">
            {draft.context.sessionFocus && (
              <p className="text-xs leading-relaxed text-text-secondary">
                Recovery overrides today&apos;s focus.
              </p>
            )}
            <PainOverrideCard
              recoveryMinutes={recoveryMinutes}
              disabled={isCreating}
              canAct={recencyChosen}
              onContinueRecovery={() => void handleCreateSession(true, false)}
              onOverride={() => void handleCreateSession(false, true)}
            />
          </div>
        )}

        <section>
          <button
            type="button"
            onClick={() => setHeatExpanded((prev) => !prev)}
            className="flex min-h-[54px] items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-pressed active:text-accent-pressed"
          >
            {/* Phase F12 (2026-04-19): the old `🔥` emoji was replaced
              with an inline stroke SVG so the flame inherits the
              accent text color and renders the same on every OS.
              Emoji in UI chrome ties the brand to the host-OS glyph
              (see `app/src/components/Brandmark.tsx` for the same
              rationale applied to the volleyball logo). */}
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-1.5-1-2.5-2-3 0 2-1 3-2 3 1-3 3-5 3-8-1 1-2 1-3-1z" />
            </svg>
            Heat &amp; safety tips
            <span
              className={`transition-transform ${heatExpanded ? 'rotate-180' : ''}`}
              aria-hidden
            >
              ▾
            </span>
          </button>
          {heatExpanded && (
            <div className="mt-3 flex flex-col gap-3">
              {/* 2026-04-20 physio-review: warning signs first, not mixed
                into prevention bullets. Heat stroke is a
                minutes-matter escalation - "stopped sweating" and
                "confusion" belong above the list of things to do to
                prevent it, not tucked at the bottom of a single bag
                of tips. */}
              <div className="rounded-[12px] border border-warning/30 bg-warning-surface p-4">
                <h3 className="text-sm font-semibold text-warning">
                  Stop immediately if you notice:
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {HEAT_WARNING_SIGNS.map((sign) => (
                    <li
                      key={sign}
                      className="flex items-start gap-2 text-sm leading-relaxed text-text-primary"
                    >
                      <span className="shrink-0 text-warning" aria-hidden>
                        •
                      </span>
                      {sign}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  Move to shade, cool down with water, and call your local emergency number (911 /
                  999 / 112) if severe.
                </p>
              </div>
              <ul className="flex flex-col gap-2 rounded-[12px] bg-info-surface p-4">
                {HEAT_PREVENTION_TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary"
                  >
                    <span className="shrink-0 text-text-secondary" aria-hidden>
                      •
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {createError && <StatusMessage variant="error" message={createError} />}
      </ScreenShell.Body>

      {painFlag !== true && (
        <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => void handleCreateSession(false, false)}
            disabled={!canContinue || isCreating}
          >
            {isCreating ? 'Starting session\u2026' : 'Start session'}
          </Button>
        </ScreenShell.Footer>
      )}
    </ScreenShell>
  )
}
