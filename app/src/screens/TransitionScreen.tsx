import { Link, useSearchParams } from 'react-router-dom'
import {
  Button,
  GlossedText,
  JustFinishedPill,
  RunFlowHeader,
  ScreenShell,
  StatusMessage,
} from '../components/ui'
import { RUN_FLOW_LABELS } from '../contracts/runFlowLexicon'
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
    rungIntentLine,
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
        Run-flow beat contract Stage 1 (2026-06-23, plan
        docs/plans/2026-06-23-001-feat-run-flow-stage1-beat-contract-plan.md;
        spec docs/specs/run-flow-beat-contract.md): Transition is the
        READ-DO setup + decide beat. It carries the next drill's identity
        (title + eyebrow + duration), the full setup read, and the
        block-opening rung intent, then the decide footer. It deliberately
        carries NO coaching cue: the cue's only home is Run's "Now" one tap
        away (R5), reversing the earlier "mirror Run" dress-rehearsal
        treatment that duplicated Run's body here. The reflective beat
        (per-drill chip + counts) lives upstream on /run/check.
      */}
      {/* Phase F8 (2026-04-19): was `text-sm font-bold uppercase
          tracking-wider`. Dropped the dashboard-eyebrow voice to
          `text-sm font-medium` sentence case; the "Transition"
          label is a calm status marker, not a hero. The 3-column
          grid layout lives once on `RunFlowHeader` (plan U5). */}
      <RunFlowHeader
        eyebrow={
          <span className="text-sm font-medium text-text-secondary">Transition</span>
        }
        counter={
          <span className="text-sm font-medium text-text-secondary">
            Next: {currentBlockIndex + 1}/{totalBlocks}
          </span>
        }
      />

      <ScreenShell.Body rhythm="cockpit">
        {/*
         * Shibui polish 2026-06-12 (origin R7): the receipt is one quiet
         * line so `Up next` keeps the focal weight on this screen. Drill
         * check keeps the fuller panel pill — there the just-finished
         * drill is the subject.
         */}
        {prevBlock && (
          <JustFinishedPill
            drillName={prevBlock.drillName}
            status={prevBlockStatus?.status === 'completed' ? 'completed' : 'skipped'}
            presentation="line"
          />
        )}

        {/* T3 (2026-06-22 shibui audit): the ScreenShell.Body gap
          already separates the just-finished receipt from "Up next", so
          the decorative hairline that sat here was removed. */}
        {skipError && <StatusMessage variant="error" message={skipError} />}

        {swapError && <StatusMessage variant="error" message={swapError} />}

        {/*
          Title cluster (2026-06-23 run-flow calm pass): the next-drill
          identity reads as ONE tight group — eyebrow + duration on a
          single row, the focal drill title, then the rung-intent
          one-liner (what this rung trains, `D163`). Pulling the duration
          up onto the eyebrow row drops a stacked secondary line, so the
          title and its intent subtitle carry the weight instead of a
          column of competing small ink.

          The eyebrow keeps the pause-before-action framing (`Up next ·
          {role} · {skill}`, cca2 dogfeed F1) so Transition doesn't read
          as "you're already on Run," and mirrors RunScreen's header
          eyebrow vocabulary.
        */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-medium text-text-secondary">
              Up next ·{' '}
              {blockEyebrowLabel(nextBlock.type, getBlockSkillFocus(nextBlock, plan.playerCount))}
            </span>
            <span className="shrink-0 text-xs font-medium text-text-secondary">
              {formatDuration(nextBlock.durationMinutes)}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {nextBlock.drillName}
          </h1>
          {/* M002.2 run-time technique-how (`D163`): the authored
            stress-rung `intent` — what this rung trains — as one quiet
            subtitle under the title. Absent for non-ladder-bearing blocks
            (warmup/wrap/recovery/off-ladder). */}
          {rungIntentLine && (
            <p className="text-sm leading-snug text-text-secondary">{rungIntentLine}</p>
          )}
        </div>

        {/* Full prep at Run's typography: `text-base` primary, pre-line,
          relaxed leading. Matches RunScreen exactly so the text reads
          the same across both surfaces. Long drills (stretch lists,
          warmup lists) scroll inside ScreenShell.Body; the bottom
          fade gradient already signals "more below."

          2026-05-11 inline-gloss tappable-term swap: the body prose
          renders through `<GlossedText>` so flagged terms (per
          `.cursor/rules/courtside-copy.mdc` rule 2) become tappable
          dotted-underlined buttons whose definitions reveal as a
          quiet line below the paragraph. Single-paragraph
          `courtsideInstructions` strings render as before; the
          dotted-underline appears only on terms the parser resolves
          against the `domain/flaggedTerms.ts` registry. */}
        {nextBlock.courtsideInstructions && (
          <GlossedText text={nextBlock.courtsideInstructions} />
        )}
      </ScreenShell.Body>

      <ScreenShell.Footer>
        <Button variant="primary" fullWidth onClick={handleStartNext}>
          {RUN_FLOW_LABELS.startAction}
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
              aria-label={RUN_FLOW_LABELS.swap}
            >
              {RUN_FLOW_LABELS.swap}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleStartShortened}>
              {RUN_FLOW_LABELS.shorten}
            </Button>
          </div>
        ) : (
          <Button variant="outline" fullWidth onClick={handleStartShortened}>
            {RUN_FLOW_LABELS.shortenFull}
          </Button>
        )}
        {!nextBlock.required && (
          <div className="flex items-center justify-center">
            <Button variant="ghost" className="text-text-secondary" onClick={handleSkip}>
              {RUN_FLOW_LABELS.skip}
            </Button>
          </div>
        )}
      </ScreenShell.Footer>
    </ScreenShell>
  )
}
