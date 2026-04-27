import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { UpdatePrompt } from '../components/UpdatePrompt'
import { Button, Card, ScreenShell, StatusMessage } from '../components/ui'
import { composeSummary, type SummaryOutput } from '../domain'
import { useInstallPosture } from '../hooks/useInstallPosture'
import {
  effortLabel,
  formatDifficultyBreakdownLine,
  formatPassRateLine,
} from '../lib/format'
import { isSchemaBlocked } from '../lib/schema-blocked'
import { getStorageCopy } from '../lib/storageCopy'
import { useAppRegisterSW } from '../lib/pwa-register'
import { routes } from '../routes'
import {
  aggregateDrillCaptures,
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
            Back to home
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

  // D133 (2026-04-26) recap aggregation: when the session was reviewed
  // with per-drill captures, prefer those numbers over the
  // session-level `goodPasses` / `totalAttempts` — this preserves
  // tagged-but-uncounted information ("3 drills tagged, counts not
  // logged") that the session-level fields collapse to 0/0 (which
  // formats as the dash placeholder). Pre-D133 sessions and tag-free
  // submissions fall through to the legacy session-level fields
  // unchanged, so this is a no-op for everything that already
  // shipped.
  const captureAggregate = aggregateDrillCaptures(review.perDrillCaptures)
  const recapHasCaptures = captureAggregate.drillsTagged > 0
  const recapGood = recapHasCaptures
    ? captureAggregate.goodPasses
    : review.goodPasses
  const recapTotal = recapHasCaptures
    ? captureAggregate.totalAttempts
    : review.totalAttempts
  const recapTaggedOnly = recapHasCaptures && captureAggregate.drillsWithCounts === 0

  // 2026-04-27 pre-D91 editorial polish (plan Item 8): close the loop
  // on the per-drill chip taps by surfacing the tag distribution on
  // the Complete recap. Returns `null` for pre-Tier-1b sessions and any
  // submission with no chips tapped, in which case the consumer hides
  // the row entirely (no zero-state placeholder — restraint per Shibui).
  // See `lib/format.ts` `formatDifficultyBreakdownLine` for the
  // collapse-to-"All X" / dot-separated rendering rules.
  const difficultyLine = formatDifficultyBreakdownLine(
    captureAggregate.tagBreakdown,
  )

  // Field-test feedback 2026-04-21: the terminal verdict screen read as
  // "weirdly dense / compact" because the previous layout stacked every
  // section with a flat `gap-8` and floated the cluster inside the main
  // field. Top-align explicitly with `justify-start`, give the hero
  // (verdict glyph + word + reason) the most air, and hold the button +
  // save-status to the bottom rail so every Home-bound exit lands in a
  // consistent thumb zone.
  //
  // Founder test-run feedback 2026-04-21 (second pass): the page-title
  // eyebrow (`summary.header`: "Today's verdict" / "Today's pair
  // verdict") was previously a standalone row below the lone SafetyIcon,
  // which read as a weirdly padded empty band at the top of the screen.
  // Hoist it into a three-column top bar that mirrors RunScreen's
  // `[shield | center label | right meta]` pattern: the eyebrow is the
  // centered page label, and an invisible spacer of the SafetyIcon's
  // 56×56 footprint balances the right column so the eyebrow is
  // optically centered.
  //
  // 2026-04-26 pre-D91 editorial polish (`F10`, `D125` / `D132` pair-
  // first vision-stance check): the eyebrow is now rendered ONLY in
  // the pair case ("Today's pair verdict"). On solo, the centered
  // `<h1>` slot is intentionally empty — the giant verdict word
  // (`<h2>` below) and the eyebrow `Today's verdict` were saying the
  // same thing, so the eyebrow was a label-on-the-data-the-data-
  // already-labels-itself. Dropping it on solo lets the verdict word
  // stand alone, which is more *Ma*. Pair keeps the eyebrow because
  // `Today's pair verdict` carries the only pair-context signal on
  // the screen — the verdict word ("Keep building" / "Lighter next" /
  // "No change") does not say "pair" anywhere. The asymmetry is the
  // point: the eyebrow becomes information when it carries
  // information, and absent when it doesn't. Heading-outline note:
  // the page's only `<h1>` is now removed on solo; the verdict
  // `<h2>` continues to announce via `aria-live="polite"` and is the
  // de facto page heading on solo. Single-heading-outline pages are
  // valid HTML5 — confirm before "fixing" by re-adding the solo
  // eyebrow. Future contributors: do NOT re-add the solo eyebrow.
  // See `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 5.
  const isPairSummary = summary.header === "Today's pair verdict"
  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: the prior layout pinned
        `min-h-[calc(100dvh-...)]` with `mt-auto` on the CTA row to fake
        a bottom dock. With `ScreenShell` the footer is a real pinned
        zone, so the "Back to home" CTA + save-status line sit in the
        same thumb position even when the page content (verdict hero +
        recap card) happens to fit above with room to spare on tall
        phones. Also cleans up the odd vertical justification math the
        previous `min-h` trick required.
      */}
      <ScreenShell.Header className="flex w-full items-center justify-between pt-2 pb-3">
        <SafetyIcon />
        {/* Phase F8 (2026-04-19): was a `<p>` rendering `{summary.header}`
            at `text-sm font-semibold uppercase tracking-wider`. Promoted
            to `<h1>` so the page has a valid heading outline (was h2-only
            before) and dropped the uppercase-eyebrow voice. The verdict
            `<h2>` below is unchanged - still the focal sub-heading. See
            `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`.

            2026-04-26 pre-D91 editorial polish (`F10`): conditional
            on pair — the solo case omits the eyebrow entirely so the
            verdict word stands alone. */}
        {isPairSummary ? (
          <h1 className="text-sm font-medium text-text-secondary">
            {summary.header}
          </h1>
        ) : (
          <span aria-hidden />
        )}
        <div className="h-14 w-14 shrink-0" aria-hidden />
      </ScreenShell.Header>

      <ScreenShell.Body className="items-center gap-10 pb-4">
      <section
        aria-labelledby="summary-verdict"
        className="flex w-full flex-col items-center gap-4 text-center"
      >
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
              className={`font-medium tabular-nums ${recapTotal > 0 ? 'text-success' : 'text-text-secondary'}`}
              data-testid="recap-good-passes"
            >
              {recapTaggedOnly
                ? 'Tagged, counts not logged'
                : formatPassRateLine(recapGood, recapTotal)}
            </dd>
          </div>
          {/* 2026-04-27 pre-D91 editorial polish (plan Item 8): the
              Difficulty row closes the loop on the per-drill chip taps.
              Hidden entirely (not rendered) when no chips were tapped —
              pre-Tier-1b sessions, all-warmup sessions, and any future
              capture-skip mode falls through this branch unchanged. The
              text-primary color matches "Effort" below so the two
              tester-supplied signals share visual weight; "Drills
              completed" / "Good passes" are auto-derived and stay
              quieter. The breakdown line itself is non-tabular (prose,
              not a number column) so courtside readers parse it as a
              short observation rather than a metric. */}
          {difficultyLine !== null && (
            <div
              className="flex items-center justify-between gap-4"
              data-testid="recap-difficulty"
            >
              <dt className="text-text-secondary">Difficulty</dt>
              <dd className="text-right font-medium text-text-primary">
                {difficultyLine}
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <dt className="text-text-secondary">Effort</dt>
            <dd className="font-medium text-text-primary">
              {effortLabel(review.sessionRpe)}
            </dd>
          </div>
        </dl>
      </Card>

      <UpdatePrompt needRefresh={needRefresh} onUpdate={updateApp} />
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex w-full flex-col gap-4 pt-4">
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
          {/* 2026-04-23 walkthrough closeout polish item 3 (merged
              Review / Complete proposal in
              `docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md`
              + plan
              `docs/plans/2026-04-23-walkthrough-closeout-polish.md`):
              the posture-sensitive Safari-eviction footnote was
              compressed off the terminal verdict surface and into the
              Settings "About local storage" sub-section. The save
              line above (`storageCopy.primary`) stays exactly as-is
              — it is the single most trust-building sentence in the
              product per the design review — and a small
              `Why is this?` affordance carries the tester to the
              fuller explanation when they want it, instead of
              dumping three posture variants of eviction copy below
              the verdict on every session completion. D118
              three-state durability posture is unchanged; this is a
              placement edit, not a durability-claim edit. The
              explainer in Settings is driven by the same
              `getStorageCopy(posture)` source of truth, so the
              Settings copy and what would have been rendered here
              stay in lockstep. */}
          <Link
            to={routes.settings()}
            className="text-xs font-medium text-text-secondary underline underline-offset-2 hover:text-text-primary"
          >
            Why is this?
          </Link>
        </div>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
