/**
 * C-5 Unit 1: Stale-context banner for the Repeat path's pre-filled
 * Setup screen.
 *
 * Rendered on `/setup?from=repeat` so the tester sees what's been
 * pre-selected from the last session and knows to adjust if today's
 * constraints differ. The `role="status"` + `aria-live="polite"`
 * contract gets the message announced by screen readers on arrival
 * without stealing focus.
 *
 * The language ("Adjust if today's different") is deliberately gentle
 * per the C-5 plan's Key Technical Decision #3 - no age threshold,
 * no urgency. Rendering it consistently is easier to reason about than
 * threshold logic.
 */

export function StaleContextBanner({ dayName }: { dayName: string }) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-[12px] border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-text-primary"
    >
      Setup pre-filled from {dayName}. Adjust if today&rsquo;s different.
    </section>
  )
}
