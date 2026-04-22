import { Button } from '../ui'
import { PRIMARY_CARD_CLASS } from './cardStyles'

export interface NewUserCardProps {
  onStart: () => void
}

export function NewUserCard({ onStart }: NewUserCardProps) {
  return (
    <section
      role="region"
      aria-label="Ready for your first session"
      className={PRIMARY_CARD_CLASS}
    >
      <div>
        <p className="text-sm font-medium text-text-secondary">
          Ready for your first session?
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          3 min setup, then ~15 min on sand.
        </p>
      </div>
      <Button variant="primary" fullWidth onClick={onStart}>
        Start first workout
      </Button>
    </section>
  )
}
