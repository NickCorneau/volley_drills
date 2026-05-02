import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SafetyIcon } from '../components/SafetyIcon'
import { SegmentList } from '../components/run/SegmentList'
import { ELEVATED_PANEL_SURFACE } from '../components/ui/Card'
import { Button, ScreenShell, StatusMessage } from '../components/ui'
import { getBlockSkillFocus } from '../domain/drillMetadata'
import { blockEyebrowLabel } from '../lib/format'
import { routes } from '../routes'
import { useRunController } from './run/useRunController'

export function RunScreen() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const executionLogId = searchParams.get('id') ?? ''
  const shortened = (location.state as { shortened?: boolean } | null)?.shortened ?? false

  const {
    plan,
    execution,
    loaded,
    currentBlock,
    currentBlockIndex,
    totalBlocks,
    isPaused,
    activeDuration,
    timer,
    runError,
    prerollCount,
    prerollHintDismissed,
    showEndConfirm,
    isWakeLocked,
    hasAlternates,
    currentSegmentIndex,
    effectiveSegments,
    handlePause,
    handleResume,
    handleNext,
    handleSkip,
    handleShorten,
    handleSwap,
    handleEndSessionRequest,
    handleEndSessionConfirm,
    handleEndSessionCancel,
  } = useRunController(executionLogId, shortened)

  if (!plan || !execution || !currentBlock) {
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
    return <StatusMessage variant="loading" message="Loading session\u2026" />
  }

  // Swap is only offered when the block has at least one curated
  // alternate. Warmup/wrap are always empty per D85/D105. The memo
  // keeps catalog scans out of the 4 Hz timer render path.

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: RunScreen moved to the
        `ScreenShell` three-zone layout (Header / Body / Footer). The
        drill name, instructions, and coaching cue live in the
        scrollable body; the timer + controls pin to the footer as a
        single "cockpit" that never slips below the fold, no matter
        how long `courtsideInstructions` runs (d26 stretch list,
        expanded coaching cue) or how the Safari URL bar resizes the
        viewport mid-block. The old layout let the document scroll at
        the root and dropped the timer off the bottom on long drills —
        testers reported hunting for Next / Pause. See
        `docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md`
        "Vertical dead space on tall viewports" for the originating
        signal.

        Density also tightened in the same pass (founder prompt
        2026-04-22 "too much text on drills"):
        - coaching-cue card chrome (accent border + `bg-info-surface`
          fill + `h2 "Coaching note"`) replaced with a quiet left-rule
          treatment + short "Cue" label so the cue reads as a
          sidebar-voiced aside rather than a second focal card;
        - body inner gap shrunk from `gap-5` (20 px) to `gap-4` (16 px)
          for a calmer rhythm between what/how/cue.

        2026-04-27 cca2 dogfeed F1 follow-up
        (`docs/research/2026-04-27-cca2-dogfeed-findings.md`): the
        per-block `rationale` ("Chosen because: …") prose was deleted
        from the run-card body. The role information it carried now
        rides on the header eyebrow via `phaseLabel(currentBlock.type)`
        (un-collapsed in the same ship from the F8-era `Work` label
        to `Technique` / `Movement` / `Main drill` / `Pressure`). This
        fires the partner-walkthrough trifold-T1 trigger ("`Chosen
        because:` deletion from Run + Swap-sheet re-home") that was
        gated on a founder-use-ledger entry flagging the line as
        "coach footnoting" — the cca2 dogfeed's "lots of text to read
        between each drill" report is the structural equivalent. The
        `block.rationale` field is preserved on the data record (the
        `deriveBlockRationale` builder still writes it onto every
        block) so future surfaces — Swap sheet, See-Why modal in Tier
        2 — can reach for it; the run/transition cards just stop
        rendering it.
      */}
      {/*
        Header layout: 3-column grid, NOT flex justify-between.
        2026-04-27 cca2 dogfeed visual catch: the prior `flex
        justify-between` pattern keeps the gap-left of the middle
        item equal to the gap-right, but does NOT center the middle
        item relative to the container — so the eyebrow drifts
        right of true center by `(left_child_width -
        right_child_width) / 2`. With `SafetyIcon` at `h-14 w-14`
        (56 px touch target) and a short counter `N/M` (~22 px),
        the math is `+17 px` right of center on RunScreen — visible
        as misalignment when comparing to TransitionScreen (which
        has the wider `Next: N/M` counter and reads visually
        centered by accident).

        `grid-cols-3` + per-cell `justify-self-{start,center,end}`
        forces the middle column to center on the container regardless
        of side-cell widths. Symmetric column widths also let the
        eyebrow auto-truncate cleanly if a future label (e.g. Tier
        1c `Main drill · serve` composition) ever exceeds the
        column width — the `truncate` class is reserved for that
        eventuality without changing this layout.
      */}
      <ScreenShell.Header className="grid grid-cols-3 items-center pt-2 pb-3">
        <div className="justify-self-start">
          <SafetyIcon />
        </div>
        {/*
          2026-04-27 cca2 dogfeed F8 follow-up: eyebrow now composes
          slot role + drill skill (`Main drill · Serve`) via
          `blockEyebrowLabel` so the courtside reader sees the skill
          on first glance, not buried in the body. Skill omitted for
          warmup / wrap by design (no per-skill identity). Falls back
          to bare `phaseLabel` when the drill is unknown (synthetic
          test, legacy plan, or non-pass/serve/set drill). Centralised
          composition keeps Run + Transition in sync on separator and
          vocabulary.
        */}
        <span className="justify-self-center text-sm font-semibold text-accent">
          {blockEyebrowLabel(
            currentBlock.type,
            getBlockSkillFocus(currentBlock, plan?.playerCount ?? 1),
          )}
        </span>
        <span className="justify-self-end text-sm font-medium text-text-secondary">
          {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-4 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {currentBlock.drillName}
          </h1>
        </div>
        {/* `whitespace-pre-line` preserves `\n` in
            `courtsideInstructions` for drills with naturally list-shaped
            content (e.g. d26 stretch sequence).

            Partner-walkthrough polish round 2 (2026-04-22): dropped
            from `text-lg` (18 px) to `text-base` (16 px). The prior
            pre-close bump to 18 px made the same paragraph render
            visibly larger on Run than on Transition (where it was
            `text-sm` / 14 px), producing a font-size jump for the
            exact same drill copy between two adjacent screens in the
            flow. 16 px sits on the outdoor-UI brief's body floor,
            satisfies Seb P2-1 "readable at arm's length," and lets
            TransitionScreen meet it mid-scale (see its matching
            bump) so the paragraph reads as one voice across both
            surfaces.

            2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
            U7): when the active block has structured `segments`
            (warmup `d28-solo`; cooldown `d25-solo`, `d26-solo`),
            `<SegmentList>` renders the structured per-move indicator
            with the active row highlighted by a small "NOW" pill.
            The intro paragraph (everything authored on
            `courtsideInstructions` for these drills, post-U3/U4/U5
            split) renders above the list. The bonus paragraph
            (`courtsideInstructionsBonus`) is rendered by `<SegmentList>`
            below the list when all segments have completed.
            For drills without segments (every other timed drill,
            future or current), the existing prose render is the
            fallback path — no regression. */}
        {currentBlock.courtsideInstructions && (
          <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
            {currentBlock.courtsideInstructions}
          </p>
        )}
        {/*
         * `effectiveSegments` is the controller's scaled view of
         * `currentBlock.segments` — same identity when the block runs
         * at its authored duration, scaled down proportionally when
         * Shorten brings activeDuration below the segment sum (so the
         * user does ALL moves at faster timing instead of dropping
         * the trailing segments off the end).
         */}
        {effectiveSegments && effectiveSegments.length > 0 && (
          <SegmentList
            segments={effectiveSegments}
            currentIndex={currentSegmentIndex}
            bonus={currentBlock.courtsideInstructionsBonus}
          />
        )}
        {/*
          Coaching cue: 2026-04-22 quieted from the prior chunky card
          (`rounded-2xl border border-accent/30 bg-info-surface p-4`
          with an h2 "Coaching note" in accent + accent-colored body
          copy) to a sidebar-voiced aside: a 2-px accent left-rule,
          a small "Cue" label, and neutral body copy.
          2026-04-22 round 2: dropped the preview + "Show full
          coaching note" toggle. The ScreenShell body is a first-class
          scroll container with top/bottom fade affordances; hiding
          cue text behind a tap was a second scroll affordance for
          the same information goal. Always rendering the full cue
          respects the user's "one tap to everything" ask and lets
          the scroll-with-fade pattern do the density work. Compact
          cues (short one-breath lines under `CUE_COMPACT_MAX`)
          render exactly as before; long cues simply extend down into
          the scroll region with the bottom fade signaling "more
          below." `CUE_COMPACT_MAX` remains in
          `domain/policies.ts` as reserved — if a future drill ships
          a genuinely 300+ char cue that feels wall-of-text even in
          the scroll container, we can reintroduce a collapse, but
          the current catalog does not have that shape.
        */}
        {currentBlock.coachingCue && (
          <section
            aria-labelledby="coaching-cue-title"
            className="border-l-2 border-accent/70 pl-3"
          >
            <span
              id="coaching-cue-title"
              className="text-xs font-medium text-accent"
            >
              Cue
            </span>
            <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-text-primary">
              {currentBlock.coachingCue}
            </p>
          </section>
        )}
      </ScreenShell.Body>

      {/*
        Cockpit footer — always in view, regardless of how far the
        body has scrolled. During preroll the 72 px count-in digit
        owns this zone (so "get ready" feels focal, not buried
        under the drill body); once the block is running, the
        BlockTimer + progress bar + RunControls sit here as one
        tight instrument. `runError` surfaces inside the footer so
        the tester never loses sight of the actionable message.
      */}
      <ScreenShell.Footer className="flex flex-col gap-3 px-1 pt-4">
        {runError && <StatusMessage variant="error" message={runError} />}
        {prerollCount != null ? (
          <div className="flex flex-col items-center gap-2 pb-2">
            {/* Preroll countdown shares BlockTimer's display face
                (`font-mono` / JetBrains Mono Variable + slashed-zero)
                so the two timer surfaces read as one instrument; accent
                color signals "get ready" vs the primary live timer.
                2026-04-22: dropped `py-8` padding (64 px) to `pb-2`
                here — the footer pin already isolates the countdown
                as the focal element; the extra air was redundant. */}
            <span
              className="font-mono text-[72px] font-bold tabular-nums leading-none text-accent"
              style={{ fontFeatureSettings: '"zero" 1' }}
            >
              {prerollCount}
            </span>
            <p className="text-sm font-medium text-text-secondary">Get ready&hellip;</p>
            {/* iOS Safari PWA suspends AudioContext on lock, so the
                block-end beep won't fire through a locked screen. The
                full lock-screen presence spike is post-D91 backlog. Until
                then we set the expectation on the preroll. Shown only
                until the first preroll completes
                (`storageMeta['ux.prerollHintDismissed']`). */}
            {prerollHintDismissed === false && (
              <p className="max-w-[280px] text-center text-sm text-text-secondary">
                Keep the phone unlocked so the block-end beep can fire.
              </p>
            )}
          </div>
        ) : (
          <>
            <BlockTimer
              remainingSeconds={timer.remainingSeconds}
              totalSeconds={activeDuration}
              isPaused={isPaused}
            />
            <RunControls
              isPaused={isPaused}
              isRequired={currentBlock.required}
              onPause={handlePause}
              onResume={handleResume}
              onNext={handleNext}
              onSkip={handleSkip}
              onShorten={handleShorten}
              onEndSession={handleEndSessionRequest}
              onSwap={hasAlternates ? () => void handleSwap() : undefined}
            />
            {timer.isRunning && !isWakeLocked && (
              <p className="px-2 text-center text-xs leading-snug text-text-secondary">
                Keep the screen on; locking your phone pauses the timer and sound.
              </p>
            )}
          </>
        )}
      </ScreenShell.Footer>

      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className={`w-full max-w-[390px] rounded-[16px] p-6 ${ELEVATED_PANEL_SURFACE}`}>
            <h2 className="text-lg font-bold text-text-primary">End session early?</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {currentBlock.type === 'wrap'
                ? 'You\u2019re in your downshift. Two or three minutes of easy walking before you leave is an honest finish. Your progress will be saved.'
                : 'You still have blocks remaining. Your progress will be saved and you can review what you completed.'}
            </p>
            {/* Safe-primary first, destructive below: keeps "Go back" as the
                default thumb-target after the pause, mirrors the iOS/Android
                action-sheet convention, and prevents an accidental end of
                session from the paused-timer state. Red-team UX #6. */}
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="primary" fullWidth onClick={handleEndSessionCancel}>
                Go back
              </Button>
              <Button variant="danger" fullWidth onClick={() => void handleEndSessionConfirm()}>
                End session
              </Button>
            </div>
          </div>
        </div>
      )}
    </ScreenShell>
  )
}
