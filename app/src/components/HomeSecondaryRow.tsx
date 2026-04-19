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
 *
 * Phase F1 (2026-04-19) — Home calm pass:
 * - Rows used to be individual bordered white cards, which competed
 *   with the primary card for visual weight. They now render as flat
 *   rows inside a single parent container (owned by `HomeScreen`),
 *   grouped by a hairline divider. Per-row padding bumps slightly so
 *   tap targets stay comfortable. Keeps the same variant API; pure
 *   visual-hierarchy pass. See
 *   `docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md`.
 */

// Phase F1: shared flat-row class. No border, no background, no
// rounding — the parent ul carries the container surface; rows just
// hold a label + CTA with comfortable padding.
const SECONDARY_ROW_CLASS =
  'flex items-center justify-between gap-3 px-4 py-3'

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
        <li className={SECONDARY_ROW_CLASS}>
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
        <li className={SECONDARY_ROW_CLASS}>
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
        <li className={SECONDARY_ROW_CLASS}>
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
