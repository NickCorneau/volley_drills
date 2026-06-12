import type { SessionDraft } from '../model'
import type { PendingReview } from '../services/session'
import { Button } from './ui'

// The parent list owns the surface; rows stay flat and only show press
// feedback so desktop hover does not imply the whole row is clickable.
const SECONDARY_ROW_CLASS =
  'flex items-center justify-between gap-3 px-4 py-3 transition-colors active:bg-text-primary/10'

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

export function HomeSecondaryRow(props: HomeSecondaryRowProps) {
  switch (props.variant) {
    case 'review_pending_advisory':
      return (
        <li className={SECONDARY_ROW_CLASS}>
          <span className="text-sm text-text-primary">Review &middot; {props.data.planName}</span>
          <Button variant="ghost" onClick={props.onFinish}>
            Finish review
          </Button>
        </li>
      )
    case 'draft':
      return (
        <li className={SECONDARY_ROW_CLASS}>
          <span className="text-sm text-text-primary">
            Ready &middot; {props.data.archetypeName}
          </span>
          <Button variant="ghost" onClick={props.onOpen}>
            Continue
          </Button>
        </li>
      )
    default: {
      const _exhaustive: never = props
      throw new Error(`Unhandled HomeSecondaryRow variant: ${JSON.stringify(_exhaustive)}`)
    }
  }
}
