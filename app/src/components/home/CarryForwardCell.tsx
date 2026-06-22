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
    // T3 (2026-06-22 shibui audit): the ScreenShell gap above the cell
    // already separates it from the primary card, so the decorative
    // bullet dot was removed — the quiet line stands alone.
    <section aria-label="Carried forward from last time">
      <p className="text-sm leading-5 text-text-secondary">{line}</p>
    </section>
  )
}
