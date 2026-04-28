/**
 * Vibration platform helper.
 *
 * Wraps `navigator.vibrate(pattern)` with a feature-check and a
 * fire-and-forget signature. Controllers and screens MUST call this
 * helper instead of touching `navigator.vibrate` directly so:
 *
 *   1. Platform-runtime concerns stay in `app/src/platform/`. Product
 *      code never branches on the runtime API surface.
 *   2. Tests can stub a single import instead of patching the global
 *      `navigator` object.
 *   3. iOS Safari (where `navigator.vibrate` is unsupported per `D54`)
 *      falls through silently rather than throwing.
 *
 * Pattern accepts the same shapes as the Web Vibration API:
 *   - `vibrate(50)`            — 50 ms pulse
 *   - `vibrate([100, 50, 100])` — pulse / pause / pulse
 *
 * Always safe to call from any environment (SSR / tests / iOS PWA).
 * Returns `true` when the pattern was scheduled, `false` otherwise.
 */
export function vibrate(pattern: number | readonly number[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return false
  try {
    return navigator.vibrate(pattern as number | number[])
  } catch {
    return false
  }
}
