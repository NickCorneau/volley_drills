/**
 * Platform layer barrel — `app/src/platform/`.
 *
 * Per the U5 architecture pass (see
 * `docs/plans/2026-04-26-app-architecture-pass.md`), browser-runtime
 * concerns live behind this barrel so controllers, screens, and
 * domain code never reach into:
 *
 *   - `navigator.vibrate(...)` directly
 *   - the Wake Lock API directly
 *   - the WebAudio gesture-priming dance directly
 *
 * Layer rule: `platform/` is the ONLY place inside `app/src/` allowed
 * to depend on browser runtime APIs (`navigator`, `document`,
 * `window`, `AudioContext`, etc.). Domain modules MUST NOT import
 * from `platform/`. Hooks, controllers, and screens consume it.
 *
 * Today this barrel re-exports the existing implementations under
 * `lib/` and `hooks/` instead of relocating their files. That keeps
 * the U5 diff focused on the import boundary that matters (controllers
 * stop reaching into the runtime) without churning unrelated callers.
 * Future passes can move the underlying files into `platform/` once
 * the boundary is established and tests are anchored here.
 */

export { vibrate } from './vibration'

export {
  primeAudioForGesture,
  playBlockEndBeep,
  playPrerollTick,
  playSubBlockTick,
} from '../lib/audio'

export {
  primeScreenWakeLockForGesture,
  releaseScreenWakeLock,
  requestScreenWakeLock,
  hasActiveScreenWakeLock,
  shouldHoldScreenWakeLock,
  subscribeScreenWakeLock,
} from '../lib/screenWakeLock'

export { useWakeLock } from '../hooks/useWakeLock'
