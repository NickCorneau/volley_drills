import type { SessionDraft } from '../db'
import { formatInterruptedAgo } from '../lib/format'
import type { LastCompleteBundle, PendingReview, ResumableSession } from '../services/session'
import { DraftCard, LastCompleteCard, NewUserCard, ReviewPendingCard } from './home'
import { ResumePrompt } from './ResumePrompt'

/**
 * Single-primary-card dispatcher driven by HomeScreen's flag
 * resolution. Each variant is a `<section role="region">` with an
 * explicit aria-label; `resume` delegates to `ResumePrompt` because
 * it's modal behavior (the tester has to act before anything else can
 * happen).
 *
 * Variant bodies live in `components/home/` - this file stays a thin
 * router so adding or retiring a variant touches exactly one home-card
 * file plus this switch.
 */

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
      onFinish: () => void
      /**
       * Skip-review tap. Parent (HomeScreen) opens a centered
       * `SkipReviewModal` in response; the card no longer carries the
       * inline two-step confirm props (2026-04-27 reconciled-list R11).
       */
      onSkip: () => void
    }
  | {
      variant: 'draft'
      data: SessionDraft
      onStart: () => void
      onEdit: () => void
    }
  | {
      variant: 'last_complete'
      data: LastCompleteBundle
      onRepeat: () => void
      onStartDifferent: () => void
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
            props.data.plan.blocks[props.data.execution.activeBlockIndex]?.drillName ??
            'Current block'
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
      return <NewUserCard onStart={props.onStart} />
    default: {
      const _exhaustive: never = props
      throw new Error(`Unhandled HomePrimaryCard variant: ${JSON.stringify(_exhaustive)}`)
    }
  }
}
