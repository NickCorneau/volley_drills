import type { SessionDraft } from '../../model'
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
    <section role="region" aria-label="Session ready" className={PRIMARY_CARD_CLASS}>
      <div>
        <p className="text-sm font-semibold text-text-primary">Session ready.</p>
        <p className="mt-2 text-sm text-text-secondary">
          {data.archetypeName}
          {totalMinutes > 0 && ` · ${totalMinutes} min`}
        </p>
      </div>
      <Button variant="primary" fullWidth onClick={onStart}>
        Continue
      </Button>
      <Button variant="link" onClick={onEdit} className={LINK_BELOW_PRIMARY_CLASS}>
        Change setup
      </Button>
    </section>
  )
}
