/**
 * M002.1 U5 — visible carry-forward (R4). A quiet line, rendered just
 * below the primary card ONLY when an accepted next-time delta carried
 * forward from the last session. Suppressed entirely (caller passes no
 * line) when the latest verdict was kept-original or none exists, so the
 * surface is never filler. Calm tier (text-secondary, no accent, no
 * card), matching the app's shibui posture.
 */
export function CarryForwardCell({ line }: { line: string }) {
  return (
    <section aria-label="Carried forward from last time" className="flex items-start gap-2">
      <span
        aria-hidden="true"
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-secondary/40"
      />
      <p className="text-sm leading-5 text-text-secondary">{line}</p>
    </section>
  )
}
