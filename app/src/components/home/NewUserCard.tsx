import { Button } from '../ui'
import { PRIMARY_CARD_CLASS } from './cardStyles'

export interface NewUserCardProps {
  onStart: () => void
}

export function NewUserCard({ onStart }: NewUserCardProps) {
  return (
    <section role="region" aria-label="Ready for your first session" className={PRIMARY_CARD_CLASS}>
      <div>
        <p className="text-sm font-semibold text-text-primary">Build your first beach session.</p>
        <p className="mt-2 text-sm text-text-secondary">3 min setup. About 15 min on sand.</p>
      </div>
      <Button variant="primary" fullWidth onClick={onStart}>
        Start first session
      </Button>
    </section>
  )
}
