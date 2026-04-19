import type { SessionDraft } from '../db'
import { formatInterruptedAgo } from '../lib/format'
import type {
  LastCompleteBundle,
  PendingReview,
  ResumableSession,
} from '../services/session'
import { Button } from './ui'
import { FOCAL_SURFACE_CLASS } from './ui/Card'
import { ResumePrompt } from './ResumePrompt'

/**
 * C-4 Unit 3 / Phase F Unit 1 (2026-04-19): `HomePrimaryCard` —
 * exactly-one-primary card rendered by HomeScreen per the Surface 2
 * precedence (resume > review_pending > draft > last_complete >
 * new_user).
 *
 * Each variant is a `<section role="region" aria-label="...">` so screen
 * readers land on an explicit state announcement. Resume delegates to
 * the existing `<ResumePrompt>` overlay (role="dialog") because resume
 * is modal behavior — the tester has to act on the paused session
 * before anything else can happen.
 *
 * Phase F amendments to the LastComplete + Draft variants:
 * - LastComplete `Same as last time` text link cut (bypassed the
 *   StaleContextBanner's "Adjust if today's different" nudge; the one
 *   Setup confirm tap saved was not worth the data-quality regression).
 * - LastComplete `Edit` text link cut (routed to the same URL as
 *   `Repeat this session` — `/setup?from=repeat` — so it was a
 *   same-URL duplicate). Adjust-in-place now happens through the
 *   pre-filled Setup that Repeat already opens.
 * - LastComplete adds a `Start a different session` tertiary text link
 *   that routes to fresh `/setup` (no pre-fill, no banner).
 * - Draft `Edit` text link renamed to `Change setup` for plainer user
 *   voice; the underlying handler prop stays `onEdit` for
 *   API-compatibility with C-4 callers.
 *
 * Phase F1 (2026-04-19) — Home calm pass:
 * - All primary-card variants share the same focal-zone surface class
 *   (`PRIMARY_CARD_CLASS` below). Hard 1 px border traded for a
 *   softer `shadow-sm` + hairline `ring-1 ring-text-primary/5`, and
 *   internal padding bumped from `p-5 gap-3` to `p-6 gap-4`. The
 *   behavior contract (role, aria-label, CTAs, handler wiring) is
 *   unchanged; this is a pure visual hierarchy pass so the card reads
 *   as the one thing on screen to attend to. See
 *   `docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` and
 *   `docs/research/japanese-inspired-visual-direction.md`.
 */

// Phase F1 / F2: shared focal-zone surface for the four card variants.
// Centralising the class keeps the four regions visually identical so
// the "one focal zone" read never accidentally drifts per variant.
// The surface half (shadow + ring + rounded + bg) lives on the
// exported `FOCAL_SURFACE_CLASS` token in `ui/Card.tsx` so every focal
// card across the app draws from the same source of truth; the
// `flex flex-col gap-4 p-6` half is the F1 internal rhythm layered on
// top of that surface for HomePrimaryCard's specific shape.
const PRIMARY_CARD_CLASS = `flex flex-col gap-4 p-6 ${FOCAL_SURFACE_CLASS}`

type HomePrimaryCardProps =
  | {
      variant: 'resume'
      data: ResumableSession
      onResume: () => void
      onDiscard: () => void
    }
  | {
      variant: 'review_pending'
      data: PendingReview
      confirmingSkip: boolean
      onFinish: () => void
      /** First-tap handler: flips into the two-step confirm row. */
      onSkip: () => void
      /** Second-tap handler: actually writes the skipped stub. */
      onConfirmSkip: () => void
      /** Cancels the confirm row without writing anything. */
      onCancelSkip: () => void
    }
  | {
      variant: 'draft'
      data: SessionDraft
      onStart: () => void
      /** Renamed to "Change setup" in the UI per Phase F 2026-04-19. */
      onEdit: () => void
    }
  | {
      variant: 'last_complete'
      data: LastCompleteBundle
      onRepeat: () => void
      /**
       * Phase F Unit 1 (2026-04-19): secondary tertiary link that routes
       * to fresh `/setup` (no pre-fill, no banner). Replaces the
       * pre-Phase-F `onEdit` + `onSameAsLast` pair, which routed to the
       * same URL as Repeat (Edit) or skipped Setup entirely (Same as
       * last time). The simplified card answers one question for the
       * user: *same as last time, or different?*
       */
      onStartDifferent: () => void
      /**
       * C-5 Unit 3: secondary CTA shown only when
       * `data.log.status === 'ended_early'`. Rebuilds a draft from the
       * subset of plan blocks the tester actually completed and routes
       * to /safety. Parent hides it via `undefined` when no blocks were
       * completed (defensive — typical ended-early has at least a
       * warmup). Omit for the normal-case last_complete.
       */
      onRepeatWhatYouDid?: () => void
    }
  | {
      variant: 'new_user'
      onStart: () => void
    }

export function HomePrimaryCard(props: HomePrimaryCardProps) {
  switch (props.variant) {
    case 'resume':
      return (
        <ResumePrompt
          sessionName={props.data.plan.presetName}
          blockDrillName={
            props.data.plan.blocks[props.data.execution.activeBlockIndex]
              ?.drillName ?? 'Current block'
          }
          blockPositionLabel={`Block ${
            props.data.execution.activeBlockIndex + 1
          } of ${props.data.plan.blocks.length}`}
          interruptedAgo={formatInterruptedAgo(props.data.interruptedAt)}
          onResume={props.onResume}
          onDiscard={props.onDiscard}
        />
      )
    case 'review_pending':
      return <ReviewPendingCard {...props} />
    case 'draft':
      return <DraftCard {...props} />
    case 'last_complete':
      return <LastCompleteCard {...props} />
    case 'new_user':
      return <NewUserCard {...props} />
    default: {
      const _exhaustive: never = props
      throw new Error(
        `Unhandled HomePrimaryCard variant: ${JSON.stringify(_exhaustive)}`,
      )
    }
  }
}

function NewUserCard({ onStart }: { onStart: () => void }) {
  return (
    <section
      role="region"
      aria-label="Ready for your first session"
      className={PRIMARY_CARD_CLASS}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Ready for your first session?
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          3 minutes of setup, then ~15 min on sand.
        </p>
      </div>
      <Button variant="primary" fullWidth onClick={onStart}>
        Start first workout
      </Button>
    </section>
  )
}

function ReviewPendingCard({
  data,
  confirmingSkip,
  onFinish,
  onSkip,
  onConfirmSkip,
  onCancelSkip,
}: {
  data: PendingReview
  confirmingSkip: boolean
  onFinish: () => void
  onSkip: () => void
  onConfirmSkip: () => void
  onCancelSkip: () => void
}) {
  return (
    <section
      role="region"
      aria-label="Review pending"
      className={PRIMARY_CARD_CLASS}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Review your last session
        </p>
        <p className="mt-1 text-base font-medium text-text-primary">
          {data.planName}
        </p>
      </div>
      <Button variant="primary" fullWidth onClick={onFinish}>
        Finish Review
      </Button>
      {!confirmingSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="min-h-[44px] text-center text-sm text-text-secondary underline"
        >
          Skip review
        </button>
      ) : (
        <div className="flex flex-col gap-2 rounded-[12px] bg-bg-warm p-3">
          <p className="text-center text-sm text-text-secondary">
            Skipping drops this session from your planning data.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancelSkip}
            >
              Never mind
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={onConfirmSkip}
            >
              Yes, skip
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

function DraftCard({
  data,
  onStart,
  onEdit,
}: {
  data: SessionDraft
  onStart: () => void
  onEdit: () => void
}) {
  const totalMinutes = data.blocks.reduce(
    (sum, b) => sum + b.durationMinutes,
    0,
  )
  return (
    <section
      role="region"
      aria-label="Today's suggestion (draft)"
      className={PRIMARY_CARD_CLASS}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Today&rsquo;s suggestion
        </p>
        <p className="mt-1 text-base font-medium text-text-primary">
          {data.archetypeName}
        </p>
        {totalMinutes > 0 && (
          <p className="mt-0.5 text-sm text-text-secondary">
            {totalMinutes} min
          </p>
        )}
      </div>
      <Button variant="primary" fullWidth onClick={onStart}>
        Start session
      </Button>
      <button
        type="button"
        onClick={onEdit}
        className="min-h-[44px] text-center text-sm text-text-secondary underline"
      >
        Change setup
      </button>
    </section>
  )
}

function LastCompleteCard({
  data,
  onRepeat,
  onStartDifferent,
  onRepeatWhatYouDid,
}: {
  data: LastCompleteBundle
  onRepeat: () => void
  onStartDifferent: () => void
  onRepeatWhatYouDid?: () => void
}) {
  const plannedTotalMinutes = data.plan.blocks.reduce(
    (sum, b) => sum + b.durationMinutes,
    0,
  )
  const daysAgo = formatDaysAgo(
    data.log.completedAt ?? data.log.startedAt,
  )
  const isEndedEarly = data.log.status === 'ended_early'
  // C-5 Unit 3: "Repeat what you did" label shows the actually-completed
  // minutes — sum of plan block durations for blocks whose status
  // recorded `completed`. Read directly from plan/log (no rounding) so
  // the label and the rebuilt draft always agree (risk row in plan).
  const completedMinutes = isEndedEarly
    ? data.plan.blocks.reduce((sum, block, idx) => {
        const status = data.log.blockStatuses[idx]
        return status?.status === 'completed' ? sum + block.durationMinutes : sum
      }, 0)
    : 0
  const canRepeatSubset =
    isEndedEarly && completedMinutes > 0 && onRepeatWhatYouDid !== undefined

  return (
    <section
      role="region"
      aria-label="Your last session"
      className={PRIMARY_CARD_CLASS}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Your last session
        </p>
        <p className="mt-1 text-base font-medium text-text-primary">
          {data.plan.presetName}
        </p>
        <p className="mt-0.5 text-sm text-text-secondary">
          {plannedTotalMinutes > 0 ? `${plannedTotalMinutes} min` : ''}
          {plannedTotalMinutes > 0 && daysAgo ? ' \u00b7 ' : ''}
          {daysAgo}
          {isEndedEarly && ' \u00b7 ended early'}
        </p>
      </div>
      {isEndedEarly ? (
        <>
          <Button variant="primary" fullWidth onClick={onRepeat}>
            Repeat full {plannedTotalMinutes}-min plan
          </Button>
          {canRepeatSubset && (
            <Button
              variant="outline"
              fullWidth
              onClick={onRepeatWhatYouDid}
            >
              Repeat what you did ({completedMinutes} min)
            </Button>
          )}
        </>
      ) : (
        <Button variant="primary" fullWidth onClick={onRepeat}>
          Repeat this session
        </Button>
      )}
      {/**
       * Phase F Unit 1 (2026-04-19): single "Start a different session"
       * tertiary link replacing the pre-Phase-F `Edit` + `Same as last
       * time` row. Centered under the primary (normal case) or under
       * the primary+outline button pair (ended-early case). Routes to
       * fresh `/setup` (no pre-fill, no banner) via HomeScreen's
       * `handleStartDifferentSession`.
       */}
      <button
        type="button"
        onClick={onStartDifferent}
        className="mx-auto min-h-[44px] px-3 text-sm text-text-secondary underline"
      >
        Start a different session
      </button>
    </section>
  )
}

function formatDaysAgo(completedAt: number, now: number = Date.now()): string {
  const diffMs = now - completedAt
  if (diffMs < 0) return ''
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}
