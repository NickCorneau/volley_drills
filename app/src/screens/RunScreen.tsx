import { useRef, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { BlockTimer } from '../components/BlockTimer'
import { RunControls } from '../components/RunControls'
import { SegmentList } from '../components/run/SegmentList'
import {
  ActionOverlay,
  Button,
  ConfirmModal,
  GlossedText,
  JustFinishedPill,
  RunFlowHeader,
  ScreenShell,
  StatusMessage,
} from '../components/ui'
import { RUN_FLOW_LABELS } from '../contracts/runFlowLexicon'
import { getBlockSkillFocus } from '../domain/drillMetadata'
import { blockEyebrowLabel, formatDuration, splitCueLines } from '../lib/format'
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
  // Run-flow beat contract Stage 2 (D165, R9): ephemeral local UI state for
  // the recovery "Peek setup" overlay. It deliberately touches neither the
  // timer nor persistence, so peeking the full read leaves the block clock
  // running (the load-bearing contrast with Swap/Shorten/Pause, which pause).
  const [peekOpen, setPeekOpen] = useState(false)
  // Run-flow beat contract Stage 4 (D167, R13): the get-ready "Adjust"
  // disclosure. Keeps Start + Shorten dominant in the footer; Swap / Skip
  // stay one cancelable tap away.
  const [adjustOpen, setAdjustOpen] = useState(false)

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
    canWrapSession,
    isWakeLocked,
    hasAlternates,
    currentSegmentIndex,
    effectiveSegments,
    isGetReady,
    prevBlock,
    prevBlockStatus,
    showJustFinishedReceipt,
    rungIntentLine,
    handlePause,
    handleResume,
    handleNext,
    handleSkip,
    handleShorten,
    handleSwap,
    handleStart,
    handleStartShortened,
    handleEndSessionRequest,
    handleEndSessionConfirm,
    handleEndSessionCancel,
  } = useRunController(executionLogId, shortened)

  const handleEndSessionCancelOnce = () => {
    if (endingSessionInFlightRef.current) return
    void handleEndSessionCancel()
  }

  const handleEndSessionConfirmOnce = async (intent: 'done' | 'cut_short') => {
    if (endingSessionInFlightRef.current) return
    endingSessionInFlightRef.current = true
    setIsEndingSession(true)
    try {
      await handleEndSessionConfirm(intent)
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
    return <StatusMessage variant="loading" />
  }

  // Swap is only offered when the block has at least one curated
  // alternate. Warmup/wrap are always empty per D85/D105.
  const segmentListOwnsCue = segmentListOwnsCurrentCue(currentBlock)
  const currentCue = segmentListOwnsCue ? null : selectNonSegmentedCurrentCue(currentBlock)
  // Run-flow beat contract Stage 1 (R7b / R16): the live Run face is the
  // one-cue DO-CONFIRM cockpit. The full `courtsideInstructions` read is
  // homed on the Run get-ready beat (post-D167; formerly Transition); the
  // live face renders just the "Now" cue plus an extra-COACHING-CUES
  // disclosure (rule 12a). Any cues beyond `coachingCues[0]` stay one tap
  // away behind "Show more cues"; the full prose read is recovered on the
  // live face via Stage 2's Peek setup.
  const hasMoreCues =
    currentBlock.coachingCue.trim().length > 0 &&
    currentBlock.coachingCue.trim() !== currentCue?.text
  // Run-flow beat contract Stage 2 (D165, R8/R9/R10): the full setup read
  // is homed on the Run get-ready beat (post-D167; formerly Transition),
  // never inline on the live face. When the block carries one, the live
  // face offers a deliberate one-touch "Peek setup" recovery that overlays
  // it on demand (timer keeps running) — gated on the read existing so
  // segmented drills with no prose overview show no empty peek.
  const hasSetupRead = currentBlock.courtsideInstructions.trim().length > 0

  return (
    <ScreenShell>
      {/*
        2026-04-22 iPhone-viewport layout pass: RunScreen moved to the
        `ScreenShell` three-zone layout (Header / Body / Footer). The
        drill name, the live "Now" cue, and the SegmentList live in the
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
          treatment + short "Now" label (the Transition preview of the
          same cue uses a "Cue" label) so the cue reads as a
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
      {/*
        T6 competing-focal-weight (2026-06-22 shibui audit): the eyebrow
        is a calm secondary status marker (`text-text-secondary` /
        `font-medium`), NOT accent-focal — the run focal zone is the
        timer (live) or the drill title (between blocks), per brand
        §4.2. This unifies the eyebrow with Transition / DrillCheck and
        reverses the prior "focal vs status / don't unify" RunFlowHeader
        note (now updated in that docblock).
      */}
      <RunFlowHeader
        eyebrow={
          <span className="text-sm font-medium text-text-secondary">
            {blockEyebrowLabel(
              currentBlock.type,
              getBlockSkillFocus(currentBlock, plan?.playerCount ?? 1),
            )}
          </span>
        }
        counter={
          <span className="text-sm font-medium text-text-secondary">
            {/* 2026-06-29 continuity restore: the get-ready beat carries the
              `Next:` counter prefix the D167 collapse dropped from Transition,
              so the between-block read pairs with Drill Check's `Last: N/M`.
              The live DO-CONFIRM beat keeps the bare `N/M`. */}
            {isGetReady ? 'Next: ' : ''}
            {currentBlockIndex + 1}/{totalBlocks}
          </span>
        }
      />

      {isGetReady ? (
        /*
          Run-flow beat contract Stage 4 (D167, R13/R14): the read-first
          get-ready beat. It replaces the forced Transition hop one tap
          before Run — carrying the just-finished receipt (only when the
          finished block bypassed Drill Check, R12), the next drill's
          title + block-opening intent (R15), and the full setup read (the
          READ-DO home migrated off Transition) — then a calm decide
          footer. The shared RunFlowHeader above renders once for both
          beats, so the title + header hold still across get-ready → live
          (R11 continuity-by-stillness). Nothing here starts the timer; the
          3·2·1 count-in fires only when the athlete taps Start, so a
          resting athlete is never rushed.
        */
        <>
          <ScreenShell.Body rhythm="cockpit">
            {/* R12: the just-finished receipt renders here only when the
              finished block bypassed Drill Check (warmup / wrap /
              technique-support / skipped). When Drill Check showed it,
              `showJustFinishedReceipt` is false so it is not duplicated. */}
            {showJustFinishedReceipt && prevBlock && (
              <JustFinishedPill
                drillName={prevBlock.drillName}
                status={prevBlockStatus?.status === 'completed' ? 'completed' : 'skipped'}
                presentation="line"
              />
            )}

            <div className="flex flex-col gap-1">
              {/* 2026-06-29 continuity restore: the D167 collapse folded
                Transition into get-ready but dropped its upcoming-block
                duration. Restored beside the title (reusing the
                `formatDuration` source Transition used) so the athlete sees
                the block length before tapping Start; the live cockpit owns
                the running clock and gains nothing. */}
              <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-xl font-semibold tracking-tight text-text-primary">
                  {currentBlock.drillName}
                </h1>
                <span className="shrink-0 text-sm font-medium text-text-secondary">
                  {formatDuration(currentBlock.durationMinutes)}
                </span>
              </div>
              {/* M002.2 technique-how (D163/D166): the authored stress-rung
                intent — what this rung trains — as one quiet subtitle, on a
                focus run's opening block only. */}
              {rungIntentLine && (
                <p className="text-sm leading-snug text-text-secondary">{rungIntentLine}</p>
              )}
            </div>

            {/* The full setup read at the same GlossedText treatment as its
              former Transition home. The get-ready is now the single
              full-weight READ-DO home for the read (R16: the live cockpit
              stays one-cue and recovers the read via Peek setup). */}
            {currentBlock.courtsideInstructions && (
              <GlossedText text={currentBlock.courtsideInstructions} />
            )}
          </ScreenShell.Body>

          <ScreenShell.Footer>
            {runError && <StatusMessage variant="error" message={runError} />}
            {/* Decide hierarchy (R13): Start dominant, Shorten always at
              CTA width (the tired-athlete escape is never buried), and the
              less-common Swap / Skip behind a cancelable Adjust. */}
            <Button variant="primary" fullWidth onClick={handleStart}>
              {RUN_FLOW_LABELS.startAction}
            </Button>
            <Button variant="outline" fullWidth onClick={handleStartShortened}>
              {RUN_FLOW_LABELS.shortenFull}
            </Button>
            {(hasAlternates || !currentBlock.required) && (
              <>
                <Button
                  variant="ghost"
                  className="text-text-secondary"
                  aria-expanded={adjustOpen}
                  onClick={() => setAdjustOpen((open) => !open)}
                >
                  {RUN_FLOW_LABELS.adjust}
                </Button>
                {adjustOpen && (
                  <div className="flex flex-col gap-3">
                    {hasAlternates && (
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => void handleSwap()}
                        aria-label={RUN_FLOW_LABELS.swap}
                      >
                        {RUN_FLOW_LABELS.swap}
                      </Button>
                    )}
                    {!currentBlock.required && (
                      <Button variant="secondary" fullWidth onClick={() => void handleSkip()}>
                        {RUN_FLOW_LABELS.skip}
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </ScreenShell.Footer>
        </>
      ) : (
        <>
          <ScreenShell.Body rhythm="cockpit">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-text-primary">
                {currentBlock.drillName}
              </h1>
            </div>

            {/*
             * T2 (2026-06-22 shibui audit): when the cue selector falls
             * back to the drill name (no usable coaching cue or single-line
             * instruction), the "Now" line would just echo the `h1` above.
             * The `h1` is the single home for the drill name, so the "Now"
             * section is suppressed on that fallback. `currentCue` is still
             * kept whole for the `hasMoreCues` comparison below, so the
             * "Show more cues" disclosure still surfaces extra coaching cues
             * when the fallback occurs.
             */}
            {currentCue && currentCue.source !== 'drill-name' && (
              <section
                aria-labelledby="current-cue-title"
                className="border-l-2 border-accent/70 pl-3"
              >
                <span id="current-cue-title" className="text-xs font-medium text-accent">
                  {RUN_FLOW_LABELS.cue}
                </span>
                <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-text-primary">
                  {currentCue.text}
                </p>
              </section>
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
             * Run-flow beat contract Stage 1 (R7b): the disclosure is now
             * cue-only. The full `courtsideInstructions` read moved to its
             * single home on the Run get-ready beat (post-D167; formerly
             * Transition); the live face keeps the rule-12a "remaining cues"
             * affordance. Cues stack one per line (design-language
             * 2026-06-11) so the dot separator never collides with sentence
             * periods.
             */}
            {hasMoreCues && (
              <details className="rounded-[14px] border border-text-primary/10 bg-bg-primary px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium text-text-secondary">
                  {RUN_FLOW_LABELS.moreCues}
                </summary>
                <section aria-label="Full coaching cue" className="mt-3 flex flex-col gap-1.5">
                  {splitCueLines(currentBlock.coachingCue).map((line) => (
                    <p key={line} className="text-base leading-relaxed text-text-primary">
                      {line}
                    </p>
                  ))}
                </section>
              </details>
            )}

            {/*
             * Run-flow beat contract Stage 2 (D165, R9): a deliberate,
             * full-width, positionally-stable one-touch recovery affordance.
             * NOT a small disclosure — Stage 1 removed the inline read on
             * purpose; this is how a winded athlete re-reads the setup
             * mid-rep. Tapping it overlays the full read (the same
             * `courtsideInstructions` homed on the get-ready beat post-D167)
             * WITHOUT pausing the block timer (R10: one full-weight home;
             * the peek is transient recovery, not a second home).
             */}
            {hasSetupRead && (
              <Button variant="outline" fullWidth onClick={() => setPeekOpen(true)}>
                {RUN_FLOW_LABELS.peek}
              </Button>
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
          <ScreenShell.Footer>
            {runError && (
              <div>
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

          {peekOpen && (
            // Recovery peek overlay (Stage 2, D165, R9): the full setup read,
            // rendered with the same `GlossedText` treatment as its get-ready
            // home (post-D167; formerly Transition), in a bottom-sheet. Reuses
            // `ActionOverlay` (focus trap +
            // Escape-to-dismiss + inert siblings). The block timer keeps
            // running underneath — nothing here calls a pause path.
            <ActionOverlay
              title={currentBlock.drillName}
              onDismiss={() => setPeekOpen(false)}
              className="items-end bg-black/40 px-4 pb-8 pt-4"
              panelClassName="max-w-[390px] rounded-focal"
            >
              <div className="mt-4 flex flex-col gap-4">
                <GlossedText text={currentBlock.courtsideInstructions} />
                <Button variant="primary" fullWidth onClick={() => setPeekOpen(false)}>
                  {RUN_FLOW_LABELS.peekClose}
                </Button>
              </div>
            </ActionOverlay>
          )}

          {showEndConfirm &&
            // Two-intent end sheet (2026-06-11 session-truth U2). With work
            // banked, ending is not automatically abandonment: "I'm done"
            // records a deliberate wrap (completed, skipped tail visible),
            // "Cut session short" stays the danger path that feeds the
            // Review reason gate. "Go back" keeps initial focus and the
            // bottom slot (action-sheet convention; red-team UX #6). With
            // zero completed blocks the sheet keeps its original
            // single-action shape - there is no honest "done" yet.
            (canWrapSession ? (
              <ConfirmModal
                title="End session here?"
                description={
                  currentBlock.type === 'wrap'
                    ? 'You\u2019re in your downshift. Two or three minutes of easy walking before you leave is an honest finish.'
                    : 'Done saves this as a finished session and skips the rest of the plan. Cut it short if you had to stop.'
                }
                placement="bottom-sheet"
                affirmativeAction={{
                  label: 'I\u2019m done',
                  onClick: () => void handleEndSessionConfirmOnce('done'),
                  disabled: isEndingSession,
                }}
                destructiveAction={{
                  label: 'Cut session short',
                  onClick: () => void handleEndSessionConfirmOnce('cut_short'),
                  disabled: isEndingSession,
                }}
                safeAction={{
                  label: 'Go back',
                  variant: 'outline',
                  onClick: handleEndSessionCancelOnce,
                  disabled: isEndingSession,
                }}
                onDismiss={handleEndSessionCancelOnce}
              />
            ) : (
              <ConfirmModal
                title="End session early?"
                description="You still have blocks remaining. You can review what you completed."
                placement="bottom-sheet"
                safeAction={{
                  label: 'Go back',
                  onClick: handleEndSessionCancelOnce,
                  disabled: isEndingSession,
                }}
                destructiveAction={{
                  label: 'End session',
                  onClick: () => void handleEndSessionConfirmOnce('cut_short'),
                  disabled: isEndingSession,
                }}
                onDismiss={handleEndSessionCancelOnce}
              />
            ))}
        </>
      )}
    </ScreenShell>
  )
}
