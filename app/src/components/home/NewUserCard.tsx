import { Button } from '../ui'
import { PRIMARY_CARD_CLASS } from './cardStyles'

export interface NewUserCardProps {
  onStart: () => void
}

export function NewUserCard({ onStart }: NewUserCardProps) {
  return (
    <section role="region" aria-label="Ready for your first session" className={PRIMARY_CARD_CLASS}>
      {/* T1 shibui (2026-06-22): "Build your first beach session." restated
          the "Start first session" button; the card now leads with the
          expectation (what's about to happen) and the button acts. The
          section `aria-label` keeps the warm framing for SR. */}
      <p className="text-sm font-semibold text-text-primary">
        3 min setup. About 15 min on sand.
      </p>
      <Button variant="primary" fullWidth onClick={onStart}>
        Start first session
      </Button>
    </section>
  )
}
