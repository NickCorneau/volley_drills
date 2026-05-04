import { useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SegmentList } from '../components/run/SegmentList'
import { ConfirmModal, RunFlowHeader, ScreenShell, StatusMessage } from '../components/ui'
import { getBlockSkillFocus } from '../domain/drillMetadata'
import { blockEyebrowLabel } from '../lib/format'
import { routes } from '../routes'
import { segmentListOwnsCurrentCue, selectNonSegmentedCurrentCue } from './run/currentCue'
import { useRunController } from './run/useRunController'

export function RunScreen() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const executionLogId = searchParams.get('id') ?? ''
  const shortened = (location.state as { shortened?: boolean } | null)?.shortened ?? false
  const [isEndingSession, setIsEndingSession] = useState(false)
  const endingSessionInFlightRef = useRef(false)

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

  const handleEndSessionCancelOnce = () => {
    if (endingSessionInFlightRef.current) return
    void handleEndSessionCancel()
  }

  const handleEndSessionConfirmOnce = async () => {
    if (endingSessionInFlightRef.current) return
    endingSessionInFlightRef.current = true
    setIsEndingSession(true)
    try {
      await handleEndSessionConfirm()
    } finally {
      endingSessionInFlightRef.current = false
      setIsEndingSession(false)
    }
  }

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
  const segmentListOwnsCue = segmentListOwnsCurrentCue(currentBlock)
  const currentCue = segmentListOwnsCue ? null : selectNonSegmentedCurrentCue(currentBlock)
  const hasVisibleSegmentInstructions =
    segmentListOwnsCue && currentBlock.courtsideInstructions.trim().length > 0
  const hasInstructionDetail =
    !hasVisibleSegmentInstructions &&
    currentBlock.courtsideInstructions.trim().length > 0 &&
    currentBlock.courtsideInstructions.trim() !== currentCue?.text
  const hasCueDetail =
    currentBlock.coachingCue.trim().length > 0 &&
    currentBlock.coachingCue.trim() !== currentCue?.text
  const hasInlineDetail = hasInstructionDetail || hasCueDetail
  const inlineDetailLabel = inlineDetailSummaryLabel(hasInstructionDetail, hasCueDetail)

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
        2026-04-27 cca2 dogfeed F8 follow-up: eyebrow composes
        slot role + drill skill (`Main drill · Serve`) via
        `blockEyebrowLabel` so the courtside reader sees the skill
        on first glance, not buried in the body. Skill omitted for
        warmup / wrap by design (no per-skill identity). Falls back
        to bare `phaseLabel` when the drill is unknown (synthetic
        test, legacy plan, or non-pass/serve/set drill). Centralised
        composition keeps Run + Transition in sync on separator and
        vocabulary.

        The 3-column grid layout (and the "why grid not flex"
        rationale) lives once on `RunFlowHeader` (plan U5).
      */}
      <RunFlowHeader
        eyebrow={
          <span className="text-sm font-semibold text-accent">
            {blockEyebrowLabel(
              currentBlock.type,
              getBlockSkillFocus(currentBlock, plan?.playerCount ?? 1),
            )}
          </span>
        }
        counter={
          <span className="text-sm font-medium text-text-secondary">
            {currentBlockIndex + 1}/{totalBlocks}
          </span>
        }
      />

      <ScreenShell.Body className="gap-4 pb-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {currentBlock.drillName}
          </h1>
        </div>

        {currentCue && (
          <section aria-labelledby="current-cue-title" className="border-l-2 border-accent/70 pl-3">
            <span id="current-cue-title" className="text-xs font-medium text-accent">
              Now
            </span>
            <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-text-primary">
              {currentCue.text}
            </p>
          </section>
        )}

        {hasVisibleSegmentInstructions && (
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

        {hasInlineDetail && (
          <details className="rounded-[14px] border border-text-primary/10 bg-bg-primary px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-text-secondary">
              {inlineDetailLabel}
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              {hasInstructionDetail && (
                <section aria-label="Full drill instructions">
                  <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
                    {currentBlock.courtsideInstructions}
                  </p>
                </section>
              )}
              {hasCueDetail && (
                <section aria-label="Full coaching cue">
                  <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
                    {currentBlock.coachingCue}
                  </p>
                </section>
              )}
            </div>
          </details>
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
        {runError && (
          <div role="alert" aria-atomic="true">
            <StatusMessage variant="error" message={runError} />
          </div>
        )}
        {prerollCount != null ? (
          <div
            className="flex flex-col items-center gap-2 pb-2"
            role="timer"
            aria-label={`${prerollCount} seconds until block starts`}
            aria-live="polite"
            aria-atomic="true"
          >
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
                Locking your phone pauses the timer and sound.
              </p>
            )}
          </>
        )}
      </ScreenShell.Footer>

      {showEndConfirm && (
        // Safe-primary first, destructive below: keeps "Go back" as the
        // default thumb-target after the pause, mirrors the iOS/Android
        // action-sheet convention, and prevents an accidental end of
        // session from the paused-timer state. Red-team UX #6. Plan U8
        // (2026-05-04): the title + description + safe + danger
        // bottom-sheet shape lives on `ConfirmModal` with
        // `placement="bottom-sheet"`.
        <ConfirmModal
          title="End session early?"
          description={
            currentBlock.type === 'wrap'
              ? 'You\u2019re in your downshift. Two or three minutes of easy walking before you leave is an honest finish. Your progress will be saved.'
              : 'You still have blocks remaining. Your progress will be saved and you can review what you completed.'
          }
          placement="bottom-sheet"
          safeAction={{
            label: 'Go back',
            onClick: handleEndSessionCancelOnce,
            disabled: isEndingSession,
          }}
          destructiveAction={{
            label: 'End session',
            onClick: () => void handleEndSessionConfirmOnce(),
            disabled: isEndingSession,
          }}
          onDismiss={handleEndSessionCancelOnce}
        />
      )}
    </ScreenShell>
  )
}

function inlineDetailSummaryLabel(hasInstructionDetail: boolean, hasCueDetail: boolean) {
  if (hasInstructionDetail && hasCueDetail) return 'Full instructions and cue'
  if (hasCueDetail) return 'Full coaching cue'
  return 'Full instructions'
}
