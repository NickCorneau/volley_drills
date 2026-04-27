import type { SessionDraft } from '../../db'
import { Button } from '../ui'
import { LINK_BELOW_PRIMARY_CLASS, PRIMARY_CARD_CLASS } from './cardStyles'

export interface DraftCardProps {
  data: SessionDraft
  onStart: () => void
  /** Renders as "Change setup" in the UI; handler name kept for API compat. */
  onEdit: () => void
}

export function DraftCard({ data, onStart, onEdit }: DraftCardProps) {
  const totalMinutes = data.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
  return (
    <section role="region" aria-label="Today's suggestion (draft)" className={PRIMARY_CARD_CLASS}>
      <div>
        <p className="text-sm font-medium text-text-secondary">Today&rsquo;s suggestion</p>
        <p className="mt-1 text-sm font-medium text-text-primary">{data.archetypeName}</p>
        {totalMinutes > 0 && (
          <p className="mt-0.5 text-sm text-text-secondary">{totalMinutes} min</p>
        )}
      </div>
      <Button variant="primary" fullWidth onClick={onStart}>
        Start session
      </Button>
      <Button variant="link" onClick={onEdit} className={LINK_BELOW_PRIMARY_CLASS}>
        Change setup
      </Button>
    </section>
  )
}
