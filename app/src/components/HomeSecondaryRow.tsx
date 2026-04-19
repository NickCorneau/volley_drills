import type { SessionDraft } from '../db'
import type {
  LastCompleteBundle,
  PendingReview,
} from '../services/session'
import { Button } from './ui'

/**
 * C-4 Unit 3: `HomeSecondaryRow` — compact `<li>` for non-primary
 * active Home states. Rendered inside the `<ul role="list">` that sits
 * below the primary card on HomeScreen (Surface 2). Exactly one CTA per
 * row; no two-step confirmations (those belong to the primary card).
 *
 * Variants mirror `SecondaryRow['kind']` from domain/homePriority.ts:
 * - `review_pending_advisory`: Finish review CTA (tester still has time
 *   on the 2 h cap)
 * - `draft`: Open CTA on Today's suggestion
 * - `last_complete`: Repeat CTA on the last finalized session
 */

type HomeSecondaryRowProps =
  | {
      variant: 'review_pending_advisory'
      data: PendingReview
      onFinish: () => void
    }
  | {
      variant: 'draft'
      data: SessionDraft
      onOpen: () => void
    }
  | {
      variant: 'last_complete'
      data: LastCompleteBundle
      onRepeat: () => void
    }

export function HomeSecondaryRow(props: HomeSecondaryRowProps) {
  switch (props.variant) {
    case 'review_pending_advisory':
      return (
        <li className="flex items-center justify-between gap-3 rounded-[12px] border border-text-primary/10 bg-bg-primary px-3 py-2">
          <span className="text-sm text-text-primary">
            Review pending &middot; {props.data.planName}
          </span>
          <Button variant="ghost" onClick={props.onFinish}>
            Finish review
          </Button>
        </li>
      )
    case 'draft':
      return (
        <li className="flex items-center justify-between gap-3 rounded-[12px] border border-text-primary/10 bg-bg-primary px-3 py-2">
          <span className="text-sm text-text-primary">
            Draft &middot; {props.data.archetypeName}
          </span>
          <Button variant="ghost" onClick={props.onOpen}>
            Open
          </Button>
        </li>
      )
    case 'last_complete':
      return (
        <li className="flex items-center justify-between gap-3 rounded-[12px] border border-text-primary/10 bg-bg-primary px-3 py-2">
          <span className="text-sm text-text-primary">
            Last: {props.data.plan.presetName}
          </span>
          <Button variant="ghost" onClick={props.onRepeat}>
            Repeat
          </Button>
        </li>
      )
    default: {
      const _exhaustive: never = props
      throw new Error(
        `Unhandled HomeSecondaryRow variant: ${JSON.stringify(_exhaustive)}`,
      )
    }
  }
}
