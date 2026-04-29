import { Link, useSearchParams } from 'react-router-dom'
import { PerDrillCapture } from '../components/PerDrillCapture'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, ScreenShell, StatusMessage } from '../components/ui'
import { routes } from '../routes'
import { useDrillCheckController } from './drillCheck/useDrillCheckController'

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 9): dedicated reflective
 * beat between Run and Transition. The just-finished drill's required
 * difficulty chip + optional Good/Total counts live here so that the
 * next-drill briefing on `/run/transition` is single-purpose.
 *
 * Why a dedicated screen:
 *   - Pre-Item-9 the `PerDrillCapture` component sat at the top of the
 *     Transition body, *above* the Up Next briefing (drill name,
 *     rationale, full courtside instructions, coaching cue). On a
 *     390 px viewport the reflective beat and the rehearsal beat
 *     competed for the same scroll, and on any non-trivial cue the
 *     Start CTA was buried below the fold.
 *   - The capture / next-drill split also matched a "Tag how that drill
 *     went to keep going" gating hint with a grey CTA — UI-state
 *     masking a layout problem. With the split, gating becomes
 *     architectural: you can't reach Up Next without committing the
 *     chip, because the screens are in series.
 *   - The Jo-Ha-Kyu cadence reads naturally: "you finished" → "what was
 *     that?" → "here's what's next" → "go." Two screens, one job each.
 *
 * Behavior-sensitive capture eligibility, bypass routing, hydration, and
 * draft persistence live in `useDrillCheckController`; this screen owns
 * only the reflective layout and presentational wiring.
 */

export function DrillCheckScreen() {
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id') ?? ''
  const {
    plan,
    execution,
    loaded,
    totalBlocks,
    prevBlockIdx,
    captureTarget,
    captureShape,
    captureSuccessRule,
    difficulty,
    setDifficulty,
    captureGood,
    setCaptureGood,
    captureTotal,
    setCaptureTotal,
    captureNotCaptured,
    captureStreakLongest,
    setCaptureStreakLongest,
    captureSaveError,
    hydrated,
    captureSatisfied,
    handleContinue,
    toggleNotCaptured,
  } = useDrillCheckController(executionLogId)

  if (!plan || !execution) {
    if (loaded) {
      return (
        <StatusMessage
          variant="empty"
          message="Session not found."
          action={
            <Link
              to={routes.home()}
              className="min-h-[54px] inline-flex items-center px-4 font-semibold text-accent underline-offset-2 hover:underline"
            >
              Back to home
            </Link>
          }
        />
      )
    }
    return <StatusMessage variant="loading" />
  }

  // While the bypass effect is mid-flight (no capture target), render
  // the loading spinner so the next paint is the redirected screen
  // rather than a brief flash of an empty drill-check body.
  if (!captureTarget) {
    return <StatusMessage variant="loading" />
  }

  // The capture UI must not accept taps before draft hydration has
  // mirrored existing rows into local state; otherwise a slow IndexedDB
  // read could clobber the first chip tap.
  if (!hydrated) {
    return <StatusMessage variant="loading" />
  }

  return (
    <ScreenShell>
      {/*
        Header mirrors the Transition header rhythm so the run-flow
        sequence reads as one continuous instrument: SafetyIcon left,
        soft-eyebrow center, "Block N/M" right. The eyebrow says
        "Drill check" instead of "Transition" so the user's mental
        model differentiates the reflective beat from the rehearsal
        beat — same rhythm, different job. Block counter uses the
        *previous* block index (one-indexed) since we're checking in
        on the just-finished block, not the upcoming one.
      */}
      {/* Header counter reads "Last: N/M" so the temporal direction is
          explicit and reads as a matched pair with TransitionScreen's
          "Next: N/M" header. The user just finished block `prevBlockIdx
          + 1` of `totalBlocks` and is reflecting on it; Transition
          immediately downstream looks forward to block N+1. The pair
          (Last → Next) makes the run-flow rhythm feel intentional
          rather than incidental. */}
      {/*
        Header layout: 3-column grid for true center-alignment of
        the middle eyebrow. See `RunScreen.tsx`'s header block
        comment for the math on why `flex justify-between` drifts
        the middle item off-center when SafetyIcon (56 px) and the
        counter have asymmetric widths. Same fix applied here for
        run-flow visual consistency across Run / Transition /
        DrillCheck.
      */}
      <ScreenShell.Header className="grid grid-cols-3 items-center pt-2 pb-3">
        <div className="justify-self-start">
          <SafetyIcon />
        </div>
        <span className="justify-self-center text-sm font-medium text-text-secondary">
          Drill check
        </span>
        <span className="justify-self-end text-sm font-medium text-text-secondary">
          Last: {prevBlockIdx + 1}/{totalBlocks}
        </span>
      </ScreenShell.Header>

      {/*
        Body is intentionally sparse: the just-finished pill (so the
        user knows which drill they're tagging) and the PerDrillCapture
        component, top-aligned so the eye lands on the pill immediately
        below the header and the "Last → Next" run-flow rhythm reads as
        a matched pair with TransitionScreen (whose body is also
        top-aligned). The previous `justify-center` posture floated the
        pill mid-screen on tall viewports, which read as a loading state
        and pushed the chips past the thumb zone; the Continue CTA is
        footer-anchored regardless, so vertical centering bought us
        nothing on tap-reach. A small `pt-2` keeps the pill from
        slamming against the header hairline. No "Up next" content here
        — that lives on the next screen by design.
      */}
      <ScreenShell.Body className="items-stretch gap-6 pb-4 pt-2">
        <div className="flex items-start gap-2.5 rounded-[12px] bg-bg-warm p-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text-primary">{captureTarget.drillName}</p>
            <p className="text-sm text-success">Complete</p>
          </div>
        </div>

        {/*
          D134 (2026-04-28): the controller exposes a `CaptureShape`
          discriminator that determines which optional drawer (if any)
          the component renders. The shape is sourced from the
          metric-strategy registry on the count branch and from the
          eligibility resolver's `optionalCaptureShape` on the
          difficulty-only branch. We pass each branch's props
          conditionally so the discriminator's mutual-exclusion
          guarantees on `PerDrillCaptureProps` hold at the type
          level.
        */}
        {captureShape.kind === 'count' && (
          <PerDrillCapture
            drillName={captureTarget.drillName}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            captureShape={{ kind: 'count' }}
            successRuleDescription={captureSuccessRule ?? undefined}
            goodPasses={captureGood}
            attemptCount={captureTotal}
            notCaptured={captureNotCaptured}
            onGoodChange={setCaptureGood}
            onAttemptChange={setCaptureTotal}
            onToggleNotCaptured={toggleNotCaptured}
          />
        )}
        {captureShape.kind === 'streak' && (
          <PerDrillCapture
            drillName={captureTarget.drillName}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            captureShape={{ kind: 'streak' }}
            successRuleDescription={captureSuccessRule ?? undefined}
            streakLongest={captureStreakLongest}
            onStreakLongestChange={setCaptureStreakLongest}
          />
        )}
        {captureShape.kind === 'none' && (
          <PerDrillCapture
            drillName={captureTarget.drillName}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            captureShape={{ kind: 'none' }}
            successRuleDescription={captureSuccessRule ?? undefined}
          />
        )}
      </ScreenShell.Body>

      {/*
        Footer: single Continue button, gated on a chip selection. The
        gating hint mirrors the Review screen's `missingHint` voice
        (fail-quiet, polite live region) so a grey button is never
        silent at courtside. Single-CTA footer also signals the
        single-purpose nature of this screen — there is no "skip", no
        "swap", no shorten. The only way out forward is to tag.
      */}
      <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
        {captureSaveError && <StatusMessage variant="error" message={captureSaveError} />}
        {!captureSatisfied && (
          <p
            className="text-center text-sm text-text-secondary"
            aria-live="polite"
            data-testid="drill-check-gating-hint"
          >
            Tag how that drill went to keep going.
          </p>
        )}
        <Button variant="primary" fullWidth onClick={handleContinue} disabled={!captureSatisfied}>
          Continue
        </Button>
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
