import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { Button, Card, StatusMessage } from '../components/ui'
import { composeSummary, type SummaryOutput } from '../domain'
import { useInstallPosture } from '../hooks/useInstallPosture'
import { effortLabel, formatPassRateLine } from '../lib/format'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { getStorageCopy } from '../lib/storageCopy'
import { useAppRegisterSW } from '../lib/pwa-register'
import { routes } from '../routes'
import {
  countSubmittedReviews,
  loadSessionBundle,
  type SessionBundle,
} from '../services/review'
import { clearTimerState } from '../services/timer'

type BundleState =
  | { status: 'loading' }
  | {
      status: 'ready'
      bundle: SessionBundle
      summary: SummaryOutput
    }
  | { status: 'missing' }

function SavedCheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-success"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

/**
 * Phase F Unit 5 (2026-04-19): neutral steady-state verdict glyph.
 *
 * Replaces the literal `=` character rendered at `text-4xl`, which
 * visually read as a typo or a placeholder at that size. The glyph's
 * semantic meaning (holding steady / no change in direction; D86
 * compliance: no warning iconography, no red) is the same; the
 * rendering is now unambiguous.
 *
 * Screen readers skip it (`aria-hidden`) - the verdict word below
 * (with `aria-live="polite"`) carries the meaning. See
 * `docs/decisions.md` D86 and
 * `docs/plans/2026-04-19-feat-phase-f-d91-validity-hardening-plan.md`
 * Unit 5.
 */
function VerdictGlyph() {
  return (
    <svg
      className="h-10 w-10 text-text-secondary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      data-testid="verdict-glyph"
    >
      <line x1="5" y1="10" x2="19" y2="10" />
      <line x1="5" y1="15" x2="19" y2="15" />
    </svg>
  )
}

export function CompleteScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id')
  const { posture } = useInstallPosture()
  const storageCopy = getStorageCopy(posture)
  const { needRefresh, updateApp } = useAppRegisterSW()

  const [bundleState, setBundleState] = useState<BundleState>({
    status: 'loading',
  })

  useEffect(() => {
    void clearTimerState()
  }, [])

  useEffect(() => {
    if (!executionLogId) return
    let cancelled = false
    ;(async () => {
      try {
        const [bundle, sessionCount] = await Promise.all([
          loadSessionBundle(executionLogId),
          countSubmittedReviews(),
        ])
        if (cancelled) return
        if (!bundle) {
          setBundleState({ status: 'missing' })
          return
        }
        const summary = composeSummary({
          review: bundle.review,
          plan: bundle.plan,
          sessionCount,
        })
        setBundleState({ status: 'ready', bundle, summary })
      } catch (err) {
        // Reliability finding rel-2: a rejected Dexie read here (quota,
        // corruption, transient InvalidStateError) would otherwise strand
        // the tester on the loading spinner indefinitely on the terminal
        // post-session screen. When a schema upgrade is mid-flight,
        // SchemaBlockedOverlay owns the UI so we suppress our own
        // fallback. Otherwise drop into `missing` - the existing
        // "Session not found" StatusMessage offers a Back-to-start escape.
        if (cancelled) return
        if (isSchemaBlocked()) return
        console.error('CompleteScreen bundle load failed:', err)
        setBundleState({ status: 'missing' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [executionLogId])

  useEffect(() => {
    if (!executionLogId) {
      navigate(routes.home(), { replace: true })
    }
  }, [executionLogId, navigate])

  if (!executionLogId) {
    return null
  }

  if (bundleState.status === 'loading') {
    return <StatusMessage variant="loading" />
  }

  if (bundleState.status === 'missing') {
    return (
      <StatusMessage
        variant="empty"
        message="Session not found."
        action={
          <Button
            variant="ghost"
            onClick={() => navigate(routes.home(), { replace: true })}
          >
            Back to start
          </Button>
        }
      />
    )
  }

  const { bundle, summary } = bundleState
  const { log, plan, review } = bundle
  const totalBlocks = plan.blocks.length
  const completedBlocks = log.blockStatuses.filter(
    (b) => b.status === 'completed',
  ).length

  // Field-test feedback 2026-04-21: the terminal verdict screen read as
  // "weirdly dense / compact" because the previous layout stacked every
  // section with a flat `gap-8` and floated the cluster inside the main
  // field. Top-align explicitly with `justify-start`, give the hero
  // (verdict glyph + word + reason) the most air, and hold the button +
  // save-status to the bottom rail so every Home-bound exit lands in a
  // consistent thumb zone.
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[390px] flex-col items-center justify-start gap-10 pb-10 pt-6">
      <div className="self-start">
        <SafetyIcon />
      </div>

      <section
        aria-labelledby="summary-verdict"
        className="flex w-full flex-col items-center gap-4 pt-2 text-center"
      >
        {/* Phase F8 (2026-04-19): was a `<p>` rendering `{summary.header}`
            at `text-sm font-semibold uppercase tracking-wider`. Promoted
            to `<h1>` so the page has a valid heading outline (was h2-only
            before) and dropped the uppercase-eyebrow voice. The verdict
            `<h2>` below is unchanged - still the focal sub-heading. See
            `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
        <h1 className="text-sm font-medium text-text-secondary">
          {summary.header}
        </h1>
        {/* Verdict icon is a neutral steady-state glyph, not a warning.
            D86 compliance: no red, no warning iconography.
            The verdict word (aria-live polite below) carries the meaning
            for screen readers, so the icon is aria-hidden.
            Phase F Unit 5 (2026-04-19): replaced the literal `=` char
            (rendered at text-4xl, which read as a typo) with a purpose-
            built two-bar horizontal SVG. Same semantic, unambiguous
            rendering. */}
        <VerdictGlyph />
        {/* Phase F11 (2026-04-19): verdict lifted from `text-3xl` to
            `text-4xl` (30 → 36 px). The verdict is the single Jo-Ha-
            Kyu "kyu" / clean-finish beat of the session loop and the
            one place typography gets to carry the "investment"
            principle from `docs/vision.md`. One step up inside the
            native Tailwind scale - large enough to feel like a
            moment, small enough to stay inside the shibui envelope
            and fit the 390 px viewport without a wrap on any of the
            three verdict strings ('Keep building', 'Lighter next',
            'No change'). See
            `docs/plans/2026-04-19-feat-phase-f11-brand-hero-typography-plan.md`. */}
        <h2
          id="summary-verdict"
          aria-live="polite"
          className="text-4xl font-bold tracking-tight text-text-primary"
        >
          {summary.verdict}
        </h2>
        <p className="max-w-[320px] text-sm leading-relaxed text-text-secondary">
          {summary.reason}
        </p>
      </section>

      <Card className="w-full" aria-label="Session recap">
        {/* Phase F8 (2026-04-19): dropped `uppercase tracking-wider` and
            bumped weight from `semibold` to `medium`. Same restraint move
            as the verdict header and the HomePrimaryCard eyebrows. */}
        <p className="mb-3 text-sm font-medium text-text-secondary">
          Session recap
        </p>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Session</dt>
            <dd className="font-medium text-text-primary">
              {plan.presetName}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            {/*
              Phase F7 (2026-04-19): renamed from "Blocks completed" to
              "Drills completed". In volleyball, "blocks" also means
              defensive blocks at the net; rendering "Blocks: 4/4" right
              above "Good passes" was genuinely confusing in
              dogfeed testing. Each v0b session block contains exactly
              one drill, so the numeric value is unchanged - only the
              label changes for disambiguation.
            */}
            <dt className="text-text-secondary">Drills completed</dt>
            <dd className="font-medium tabular-nums text-text-primary">
              {completedBlocks}/{totalBlocks}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Good passes</dt>
            <dd
              className={`font-medium tabular-nums ${review.totalAttempts > 0 ? 'text-success' : 'text-text-secondary'}`}
            >
              {formatPassRateLine(review.goodPasses, review.totalAttempts)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Effort</dt>
            <dd className="font-medium text-text-primary">
              {effortLabel(review.sessionRpe)}
            </dd>
          </div>
        </dl>
      </Card>

      <div className="mt-auto flex w-full flex-col gap-4 pt-4">
        {/* 2026-04-21 partner-walkthrough P1-2 fix: the CTA was "Done",
            which carried the terminal meaning ("session complete") but
            dropped the destination. Seb landed on Home and could not
            tell he was home because his mental model of "home" was the
            once-seen SkillLevelScreen. "Back to Home" names the
            destination; the semantic is still terminal (session is
            complete and save is confirmed by the SavedCheckIcon
            below). See
            docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
            P1-2 and the courtside-copy rule §Invariant 1. */}
        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate(routes.home())}
        >
          Back to home
        </Button>
        <div
          className="flex flex-col items-center gap-1"
          data-testid="save-status"
          data-posture={posture}
        >
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-success">
            <SavedCheckIcon />
            {storageCopy.primary}
          </p>
          <p className="max-w-[320px] text-center text-xs text-text-secondary">
            {storageCopy.secondary}
          </p>
        </div>
      </div>

      <UpdatePrompt needRefresh={needRefresh} onUpdate={updateApp} />
    </div>
  )
}
