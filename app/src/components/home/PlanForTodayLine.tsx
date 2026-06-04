import type { PlanOutput } from '../../domain/composePlan'

/**
 * M002.1 U5 — the thin-spine "what to do next" line, rendered quietly
 * ABOVE the primary card so the quick-start card stays the visual
 * anchor (D2 IA). Pure presentation of `composePlan().render`; no accent
 * colour, no card chrome — it reads as orientation, not a competing CTA.
 */
export function PlanForTodayLine({ plan }: { plan: PlanOutput }) {
  return (
    <section aria-label="Your plan" className="flex flex-col gap-1">
      <p className="text-sm leading-5 text-text-secondary">{plan.render}</p>
    </section>
  )
}
