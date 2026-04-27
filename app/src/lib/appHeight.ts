/**
 * Maintains a `--app-height` CSS custom property that mirrors the
 * actual visible viewport height in pixels, with the JS reading taking
 * precedence over a `100dvh` CSS fallback in the layout root.
 *
 * Why this exists (Seb 2026-04-27, Android standalone PWA):
 * - The app shell in `App.tsx` is height-locked at `100dvh` with
 *   `overflow-hidden` so the `ScreenShell` footer can pin without
 *   the document scrolling out from under the timer on long drills
 *   (see the 2026-04-22 iPhone-viewport layout pass).
 * - On Android, after a service-worker `skipWaiting` + `location.reload`
 *   (the path triggered by tapping `UpdatePrompt` → `Update`), the
 *   Chromium WebAPK occasionally lays out the new document against a
 *   stale viewport size before insets settle. `100dvh` resolves to a
 *   value larger than what is actually visible, the locked shell
 *   extends below the screen, and the bottom CTA row (`Next block`,
 *   `Pause`, etc. on RunScreen; the action stack on Home/Complete)
 *   ends up off-screen and unreachable. The only known recovery is a
 *   force-quit + relaunch, which reinitializes the WebAPK activity.
 * - `100svh` does not help because in standalone PWA mode there is no
 *   browser chrome to toggle, so `dvh` and `svh` resolve to the same
 *   incorrect value.
 *
 * Strategy:
 * - Read `window.visualViewport.height` (or `window.innerHeight` as a
 *   fallback). On Android Chrome this is the authoritative
 *   "what is actually visible right now" measurement and updates
 *   correctly across the post-reload races that trip up `dvh`.
 * - Re-apply on `visualViewport.resize`, `window.orientationchange`,
 *   and `window.pageshow` so any late settle correction wins
 *   automatically without requiring user interaction.
 * - Write the value as `--app-height: Npx` on the document root and
 *   let the layout consume it via `var(--app-height, 100dvh)` so that
 *   the page still renders sanely in the brief window before this
 *   module runs (and in test/SSR-like environments where it never
 *   does).
 *
 * Idempotent and side-effect free outside of (a) the listeners it
 * registers and (b) the `documentElement.style` custom property write.
 */

const APP_HEIGHT_VAR = '--app-height'

function readVisibleHeight(): number {
  // visualViewport is the post-system-bars, post-IME measurement on
  // Android Chrome — strictly more accurate than `innerHeight` for
  // the standalone PWA + WebAPK path that motivates this fix. Older
  // browsers and jsdom (tests) don't expose it; `innerHeight` covers
  // those, and it's good enough because the failure mode this guards
  // against is Android-specific.
  return window.visualViewport?.height ?? window.innerHeight
}

function applyAppHeight(): void {
  const px = readVisibleHeight()
  if (!Number.isFinite(px) || px <= 0) return
  document.documentElement.style.setProperty(APP_HEIGHT_VAR, `${px}px`)
}

/**
 * Begin tracking the visible viewport height into `--app-height`.
 *
 * Returns a cleanup function that removes every listener and cancels
 * the deferred initial measurement. Production callers can ignore the
 * return value — the SPA owns the page for its lifetime — but tests
 * use it to keep teardown clean.
 */
export function startAppHeightTracking(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  applyAppHeight()

  // A deferred second measurement gives Chromium a frame to settle
  // safe-area insets and any post-reload viewport reconciliation
  // before our reading wins. Cheap insurance against the WebAPK
  // first-frame-stale-viewport class of bugs that motivated this
  // module. If the first measurement was already correct this is a
  // no-op write of the same value.
  const rafId = window.requestAnimationFrame(applyAppHeight)

  const vv = window.visualViewport ?? null
  vv?.addEventListener('resize', applyAppHeight)
  window.addEventListener('orientationchange', applyAppHeight)
  // `pageshow` fires on initial load AND on bfcache restore, which is
  // the exact path Android takes when the user backgrounds the PWA
  // and brings it forward — a cheap belt-and-suspenders correction
  // for any inset state that desynced while the app was off-screen.
  window.addEventListener('pageshow', applyAppHeight)

  return () => {
    window.cancelAnimationFrame(rafId)
    vv?.removeEventListener('resize', applyAppHeight)
    window.removeEventListener('orientationchange', applyAppHeight)
    window.removeEventListener('pageshow', applyAppHeight)
  }
}
