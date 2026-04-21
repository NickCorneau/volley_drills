import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PainOverrideCard } from '../components/PainOverrideCard'
import { BackButton, Button, StatusMessage } from '../components/ui'
import type { SessionDraft } from '../db/types'
import { buildRecoveryDraft } from '../domain/sessionBuilder'
import { routes } from '../routes'
import {
  createSessionFromDraft,
  getCurrentDraft,
  hasEverStartedSession,
} from '../services/session'

// Primary recency chips. `2+` is an intermediate value — tapping it
// reveals a sub-row of granular buckets (post-physio-review 2026-04-20),
// and the persisted `trainingRecency` is the sub-bucket string, not the
// literal `'2+'`. `canContinue` holds until a sub-bucket is picked.
type PrimaryRecency = '0 days' | '1 day' | '2+' | 'First time'
type LayoffBucket =
  | '2-7 days'
  | '1-4 weeks'
  | '1-3 months'
  | '3+ months'
type TrainingRecency = PrimaryRecency | LayoffBucket

const RECENCY_OPTIONS: PrimaryRecency[] = ['0 days', '1 day', '2+', 'First time']
const LAYOFF_BUCKETS: LayoffBucket[] = [
  '2-7 days',
  '1-4 weeks',
  '1-3 months',
  '3+ months',
]
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
// escalation — users need to see the "stop immediately" cues first, not
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
  const visibleRecencyOptions = useMemo<PrimaryRecency[]>(
    () =>
      hasSessionHistory
        ? RECENCY_OPTIONS.filter((opt) => opt !== 'First time')
        : RECENCY_OPTIONS,
    [hasSessionHistory],
  )

  // The `2+` chip is a disclosure trigger, not a submittable answer —
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

  const recoveryMinutes =
    draft?.blocks
      .filter((b) => isRecoveryBlock(b.type))
      .reduce((sum, b) => sum + b.durationMinutes, 0) ?? 0

  const sessionSummary = draft
    ? `${draft.archetypeName} \u00b7 ${draft.blocks.reduce((s, b) => s + b.durationMinutes, 0)} min, ${draft.blocks.length} blocks`
    : ''

  const canContinue = painFlag === false && recencyChosen

  async function handleCreateSession(
    useRecovery: boolean,
    painOverridden: boolean,
  ) {
    if (creating.current) return
    if (painFlag === null || !recencyChosen) return
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
        <BackButton label="Back" onClick={() => navigate(routes.home())} />
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
            const selected = primaryRowSelection === opt
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
                      : 'border border-gray-200 text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-accent',
                ].join(' ')}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {/* 2026-04-20 physio-review: detraining is not linear — bucketing
            "2+" by weeks/months lets a 3+ month returner see a clinician
            nudge without making short-gap users read extra copy. The
            primary `2+` chip stays selected while a sub-bucket is active
            so the two rows read as one nested question. */}
        {showLayoffBuckets && (
          <div className="flex flex-col gap-2 rounded-[12px] bg-bg-warm/60 p-3">
            <p className="text-xs text-text-secondary">
              Roughly how long off?
            </p>
            <div className="flex gap-2">
              {LAYOFF_BUCKETS.map((bucket) => {
                const selected = recency === bucket
                return (
                  <button
                    key={bucket}
                    type="button"
                    onClick={() => setRecency(bucket)}
                    className={[
                      'min-h-[48px] flex-1 rounded-[12px] px-1 py-1 text-xs font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                      selected
                        ? 'border border-accent bg-info-surface text-accent focus-visible:ring-accent'
                        : 'border border-gray-200 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-accent',
                    ].join(' ')}
                  >
                    {LAYOFF_BUCKET_LABEL[bucket]}
                  </button>
                )
              })}
            </div>
            {recency === '3+ months' && (
              <p className="text-xs leading-relaxed text-text-secondary">
                Coming back from injury or illness? A check-in with a
                clinician before stepping back up is worth considering.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-text-primary">
          Any pain that&apos;s sharp, localized, or makes you avoid a
          movement?
        </h2>
        {/* 2026-04-20 physio-review: the original "pain that changes how
            you move" read to most users as "am I visibly limping," but
            the early warning sign is usually subtle guarding or
            avoidance. The parenthetical gives permission to distinguish
            DOMS from something that actually warrants a lighter
            session, which most recreational athletes find hard to
            self-sort. */}
        <p className="text-sm text-text-secondary">
          Regular muscle soreness is fine. We&apos;ll switch to a lighter
          session if yes.
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
                : 'border-2 border-gray-200 text-text-primary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-success',
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
                : 'border-2 border-gray-200 text-text-primary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-warning',
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
          canAct={recencyChosen}
          onContinueRecovery={() => void handleCreateSession(true, false)}
          onOverride={() => void handleCreateSession(false, true)}
        />
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
                minutes-matter escalation — "stopped sweating" and
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
                Move to shade, cool down with water, and call your local
                emergency number (911 / 999 / 112) if severe.
              </p>
            </div>
            <ul className="flex flex-col gap-2 rounded-[12px] bg-info-surface p-4">
              {HEAT_PREVENTION_TIPS.map((tip) => (
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
          </div>
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
