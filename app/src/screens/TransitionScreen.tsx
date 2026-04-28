import { Link, useSearchParams } from 'react-router-dom'
import { SafetyIcon } from '../components/SafetyIcon'
import { Button, ScreenShell, StatusMessage } from '../components/ui'
import { getBlockSkillFocus } from '../domain/drillMetadata'
import { blockEyebrowLabel, formatDuration } from '../lib/format'
import { routes } from '../routes'
import { useTransitionController } from './transition/useTransitionController'

export function TransitionScreen() {
  const [searchParams] = useSearchParams()
  const executionLogId = searchParams.get('id') ?? ''

  const {
    plan,
    execution,
    loaded,
    currentBlockIndex,
    totalBlocks,
    prevBlock,
    prevBlockStatus,
    nextBlock,
    skipError,
    swapError,
    hasAlternates,
    handleStartNext,
    handleStartShortened,
    handleSkip,
    handleSwap,
  } = useTransitionController(executionLogId)

  if (!plan || !execution || !nextBlock) {
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

  return (
    <ScreenShell>
      {/*
        2026-04-27 plan Item 9: TransitionScreen is now the rehearsal
        beat only. The reflective beat (per-drill chip + optional
        counts) lives on `/run/check` upstream of this screen, so this
        body is single-purpose: just-finished pill (provenance), Up
        Next briefing (drill name + full prep + cue), and the action
        footer. The capture state, draft persistence effects, and
        capture-target derivation now live in `useDrillCheckController`;
        this surface only previews the upcoming block. See
        `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 9.

        2026-04-27 cca2 dogfeed F1 follow-up
        (`docs/research/2026-04-27-cca2-dogfeed-findings.md`): the
        per-block `rationale` ("Chosen because: …") prose was deleted
        from the Up next briefing here in parallel with RunScreen's
        deletion (the trifold-T1 trigger fires once for both surfaces;
        keeping rationale on Transition while deleting from Run would
        re-fragment voice across the run-flow rhythm). Role
        information now rides on the `Up next · {phaseLabel}` eyebrow
        below — same role labels as the RunScreen header eyebrow
        (`Technique` / `Movement` / `Main drill` / `Pressure` /
        `Downshift`), so the user sees the same role identity in
        Transition's preview that they'll see in Run's header on the
        very next screen. The `block.rationale` field is preserved on
        the data record for future surfaces (Swap sheet, See-Why
        modal in Tier 2).

        2026-04-22 iPhone-viewport layout pass: the prior `mt-auto`
        on the button row was decorative — it only activated when the
        screen div happened to fill main, which it rarely did because
        nothing enforced shell height. Pinning the CTA stack to
        `ScreenShell.Footer` makes it genuinely bottom-locked so a
        long up-next preview (d26 stretches, long coaching cue) can
        scroll without pushing `Start next block` below the fold.

        2026-04-22 parity pass: the body used to render a truncated
        preview (first line of `courtsideInstructions`, `text-sm`,
        secondary color, 2-line clamp). Founder walkthrough caught
        the resulting inconsistency — the same paragraph rendered at
        a different size + color + with an ellipsis on Transition vs
        the full text at `text-base` primary on Run, one tap away.
        That failure mode is worse than "scroll on long drills":
        short drills got truncated even though they fit, and long
        drills lost the expand affordance. The body now mirrors Run's
        treatment (full title, instructions, coaching cue — same
        typography, same colors) so Transition reads as a quiet
        dress-rehearsal of Run. The CTA stack in the footer is the
        only thing that differs between the two surfaces: decide
        here, execute there.
      */}
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
        {/* Phase F8 (2026-04-19): was `text-sm font-bold uppercase
            tracking-wider`. Dropped the dashboard-eyebrow voice to
            `text-sm font-medium` sentence case; the "Transition"
            label is a calm status marker, not a hero. See
            `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`. */}
        <span className="justify-self-center text-sm font-medium text-text-secondary">
          Transition
        </span>
        <span className="justify-self-end text-sm font-medium text-text-secondary">
          Next: {currentBlockIndex + 1}/{totalBlocks}
        </span>
      </ScreenShell.Header>

      <ScreenShell.Body className="gap-4 pb-4">
        {prevBlock && (
          <div className="flex items-start gap-2.5 rounded-[12px] bg-bg-warm p-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
              {prevBlockStatus?.status === 'completed' ? (
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
              ) : (
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
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-semibold text-text-primary">{prevBlock.drillName}</p>
              <p className="text-sm text-success">
                {prevBlockStatus?.status === 'completed' ? 'Complete' : 'Skipped'}
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-text-secondary/10" />

        {skipError && <StatusMessage variant="error" message={skipError} />}

        {swapError && <StatusMessage variant="error" message={swapError} />}

        <div className="flex flex-col gap-1.5">
          {/*
            "Up next" eyebrow keeps the pause-before-action framing so
            Transition doesn't read as "you're already on Run." Quiet
            `text-xs font-medium` so the drill title below carries the
            focal weight (Phase F8 typography).

            2026-04-27 cca2 dogfeed F1 follow-up: extended the eyebrow
            with the role label (`Up next · Technique` etc.) so the
            structural role of the next block is visible at preview
            time. The temporal cue (`Up next`) and the role cue
            (`{phaseLabel}`) compose with a thin `·` separator so the
            two reads stay in one quiet line — no new vertical
            chrome, no eyebrow stack, just a slightly richer single
            line. Mirrors RunScreen's header eyebrow vocabulary.
          */}
          <p className="text-xs font-medium text-text-secondary">
            Up next ·{' '}
            {blockEyebrowLabel(nextBlock.type, getBlockSkillFocus(nextBlock, plan.playerCount))}
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {nextBlock.drillName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {formatDuration(nextBlock.durationMinutes)}
          </p>
        </div>

        {/* Full prep at Run's typography: `text-base` primary, pre-line,
          relaxed leading. Matches RunScreen exactly so the text reads
          the same across both surfaces. Long drills (stretch lists,
          warmup lists) scroll inside ScreenShell.Body; the bottom
          fade gradient already signals "more below." */}
        {nextBlock.courtsideInstructions && (
          <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
            {nextBlock.courtsideInstructions}
          </p>
        )}

        {/* Coaching cue uses the exact same quiet left-rule treatment as
          RunScreen so testers see the same visual voice across both
          screens. Styled identically down to the classes. */}
        {nextBlock.coachingCue && (
          <section
            aria-labelledby="transition-coaching-cue-title"
            className="border-l-2 border-accent/70 pl-3"
          >
            <span
              id="transition-coaching-cue-title"
              className="text-xs font-semibold uppercase tracking-wide text-accent"
            >
              Cue
            </span>
            <p className="mt-1 whitespace-pre-line text-base font-medium leading-relaxed text-text-primary">
              {nextBlock.coachingCue}
            </p>
          </section>
        )}
      </ScreenShell.Body>

      <ScreenShell.Footer className="flex flex-col gap-3 pt-4">
        <Button variant="primary" fullWidth onClick={handleStartNext}>
          Start next block
        </Button>
        {/* Secondary row: Swap + Shorten side-by-side when both are
            available, Shorten full-width when the current block can't
            swap (warmup/wrap per D85/D105, or a slot with a single
            candidate in the pool). Pre-start Swap was added 2026-04-22
            because forcing the tester to Start → Run → Swap wasted a
            preroll cycle + let the timer start on a drill they
            already knew they wanted to change. Same underlying call
            as RunScreen's mid-block Swap (`runner.swapBlock`); the
            Dexie live query refreshes `nextBlock` in place so the
            preview updates without a route change.

            `Shorten block` stays `variant="outline"` (partner
            walkthrough 2026-04-22 item 6) — it's the primary escape
            for a tired athlete and deserves pill-at-CTA-width
            visibility. When paired with Swap both render as equal-
            weight `secondary` pills so neither dominates. */}
        {hasAlternates ? (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleSwap}
              aria-label="Swap drill"
            >
              Swap drill
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleStartShortened}>
              Shorten
            </Button>
          </div>
        ) : (
          <Button variant="outline" fullWidth onClick={handleStartShortened}>
            Shorten block
          </Button>
        )}
        {!nextBlock.required && (
          <div className="flex items-center justify-center">
            <Button variant="ghost" className="text-text-secondary" onClick={handleSkip}>
              Skip block
            </Button>
          </div>
        )}
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
