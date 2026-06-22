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
      {/* T1 shibui (2026-06-22): "Session ready." restated the `aria-label`
          and what "Continue" implies; the card now leads with its value
          (archetype + minutes) and the button carries the action. */}
      <p className="text-sm font-semibold text-text-primary">
        {data.archetypeName}
        {totalMinutes > 0 && ` · ${totalMinutes} min`}
      </p>
      <Button variant="primary" fullWidth onClick={onStart}>
        Continue
      </Button>
      <Button variant="link" onClick={onEdit} className={LINK_BELOW_PRIMARY_CLASS}>
        Change setup
      </Button>
    </section>
  )
}
