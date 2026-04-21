/**
 * Phase F Unit 3 (2026-04-19): foreground audio cues for the courtside
 * run flow.
 *
 * `navigator.vibrate` is the only cue `RunScreen` fires on block-end
 * and preroll tick today, and iOS Safari PWA does not support it (per
 * `D54`, `D57`, and the 2026 WebKit record). With the phone set down
 * on a towel 6 feet away, an iOS tester has NO reliable signal that a
 * block ended - which breaks the `D91` "phone courtside viable for
 * structured runner" hypothesis directly. This helper carves out the
 * narrow "block-end beep + preroll tick" slice of the originally-
 * deferred `V0B-08` layered cue stack; the full stack stays post-D91.
 *
 * Design:
 * - Single module-level `AudioContext` instantiated lazily on first
 *   gesture-bound call (RunScreen's `startWithPreroll` runs inside a
 *   user-click handler, satisfying the autoplay policy).
 * - Oscillator + gain envelope, not an `<audio>` element with an
 *   `.mp3` asset: no asset bundling, no SW precache concerns, and no
 *   iOS silent-switch bypass. A silent user is a user who asked for
 *   silence - the silent switch honors the AudioContext path by
 *   design.
 * - Fire-and-forget: every `play*` function swallows every error path
 *   so a missing `AudioContext`, a rejected autoplay policy, or a
 *   transient iOS regression never fails the calling block-complete
 *   transition. Logged once to aid post-D91 debugging.
 *
 * Compatibility with `D54`: `D54` rules out **background** audio and
 * iPhone haptics. Foreground audio fired inside an active session
 * while the app is in the foreground is a different category - the
 * same way `D42` scopes wake-lock and haptics as best-effort foreground
 * enhancements.
 *
 * See `docs/specs/m001-courtside-run-flow.md` §3 (Courtside action
 * rule, Phase F audio carve-out) and `docs/decisions.md` D122.
 *
 * Lock-screen presence: intentionally NOT implemented. A `MediaSession`
 * + `positionState` route would surface block title + live countdown
 * progress bar on the iOS lock screen, but requires an actual `<audio>`
 * element playing continuously (Web Audio oscillators do not drive
 * MediaSession), which normally steals audio focus from the tester's
 * music (Spotify/etc.). The post-D91 backlog names a scoped 2-3h spike
 * on real iOS hardware to test whether `navigator.audioSession.type =
 * 'ambient'` lets us render the card without grabbing the audio
 * channel - if it works the card is viable, if not we fall back to
 * Web Push block-end notifications. Full plan with acceptance criteria
 * lives in `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` §4
 * ("Lock-screen presence for the courtside timer"). Gated on D91 field
 * evidence that testers lock the phone mid-session and miss block-end
 * cues.
 */

const BLOCK_END_FREQUENCY_HZ = 1000
const BLOCK_END_DURATION_SECONDS = 0.25
const PREROLL_TICK_FREQUENCY_HZ = 800
const PREROLL_TICK_DURATION_SECONDS = 0.1
/**
 * Pre-close 2026-04-21 (P2-2): sub-block pacing tick for timed internal
 * segments (d28 Beach Prep's 4 x ~45s components, d26 Stretch Micro-
 * sequence's 6 x ~30s stretches). Pitched ABOVE the preroll + block-end
 * tones so it reads as a distinct "move to the next segment" pulse
 * rather than being confused with the block-boundary cues. 1400 Hz
 * sits inside the outdoor-UI brief's 1.8-3.0 kHz target band less
 * conservatively than the existing tones but ahead of where the full
 * audio retune can be justified; shorter envelope so it's subtle.
 *
 * See `.cursor/rules/courtside-copy.mdc` Invariant 5 and
 * `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`
 * P2-2.
 */
const SUB_BLOCK_TICK_FREQUENCY_HZ = 1400
const SUB_BLOCK_TICK_DURATION_SECONDS = 0.06

/**
 * Shared lazily-instantiated AudioContext. Module-scoped so subsequent
 * plays reuse the same context rather than thrashing one per call.
 * `undefined` before first attempt; `null` if the environment has no
 * `AudioContext` at all (SSR / old browsers).
 */
let sharedContext: AudioContext | null | undefined = undefined

/** Log each distinct failure mode once to aid post-D91 debugging. */
let loggedMissingContext = false
let loggedAutoplayBlocked = false
let loggedGenericFailure = false

type MaybeAudioContextCtor =
  | typeof AudioContext
  | undefined
  | (new () => AudioContext)

/**
 * Resolve the AudioContext constructor across the two common names.
 * Webkit-prefixed name survives on a few older iOS Safari builds; the
 * standard name is the modern default.
 */
function resolveCtor(): MaybeAudioContextCtor {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as {
    AudioContext?: typeof AudioContext
    webkitAudioContext?: typeof AudioContext
  }
  return w.AudioContext ?? w.webkitAudioContext
}

function ensureAudioContext(): AudioContext | null {
  if (sharedContext !== undefined) return sharedContext
  const Ctor = resolveCtor()
  if (!Ctor) {
    sharedContext = null
    if (!loggedMissingContext) {
      loggedMissingContext = true
      console.info(
        'lib/audio: AudioContext not available in this environment; audio cues disabled',
      )
    }
    return null
  }
  try {
    sharedContext = new Ctor()
  } catch (err) {
    sharedContext = null
    if (!loggedGenericFailure) {
      loggedGenericFailure = true
      console.warn('lib/audio: AudioContext construction failed', err)
    }
    return null
  }
  return sharedContext
}

/**
 * Schedule a single-tone oscillator with a short fade-in / fade-out
 * envelope. Called internally by `playBlockEndBeep` + `playPrerollTick`;
 * not exported because the frequency / duration pair should be a
 * deliberate change at the call-site level, not a parameter passed by
 * callers.
 */
function playTone(frequencyHz: number, durationSeconds: number): void {
  const ctx = ensureAudioContext()
  if (!ctx) return

  try {
    // iOS / Chrome sometimes leave the context in 'suspended' state when
    // created without a gesture; resume() is a no-op when already
    // running. Fire-and-forget - the `.catch` is defensive over a
    // browser regression (shouldn't reject on a gesture-bound call).
    if (ctx.state === 'suspended') {
      void ctx.resume().catch((err) => {
        if (!loggedAutoplayBlocked) {
          loggedAutoplayBlocked = true
          console.info('lib/audio: autoplay resume rejected', err)
        }
      })
    }

    const now = ctx.currentTime
    const endTime = now + durationSeconds

    const oscillator = ctx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequencyHz, now)

    const gain = ctx.createGain()
    // 10 ms attack, 10 ms release - avoids click artifacts on the
    // ramp edges without bloating the tone.
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.01)
    gain.gain.setValueAtTime(0.25, endTime - 0.01)
    gain.gain.linearRampToValueAtTime(0, endTime)

    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(now)
    oscillator.stop(endTime)
  } catch (err) {
    if (!loggedGenericFailure) {
      loggedGenericFailure = true
      console.warn('lib/audio: oscillator scheduling failed', err)
    }
  }
}

/**
 * Play the block-end cue. Called from `RunScreen.handleBlockComplete`
 * alongside the existing `navigator.vibrate` call - vibrate stays for
 * Android + desktop haptics; the beep covers iOS Safari PWA where
 * vibrate is unsupported.
 *
 * Safe to call from any environment: SSR no-ops, missing
 * `AudioContext` no-ops, rejected autoplay no-ops, never throws.
 */
export function playBlockEndBeep(): void {
  playTone(BLOCK_END_FREQUENCY_HZ, BLOCK_END_DURATION_SECONDS)
}

/**
 * Play a preroll tick. Called from `RunScreen.startWithPreroll` on each
 * of the 3 / 2 / 1 countdown seconds so the tester doesn't have to
 * watch the phone to catch the start.
 *
 * Pre-close 2026-04-21 (thought 3b): also reused for the block-end
 * 3-sec countdown (3 / 2 / 1 ticks leading into the block-end beep)
 * so start and end of every block share the same sonic entrance/exit
 * ramp.
 *
 * Safe to call from any environment: SSR no-ops, missing
 * `AudioContext` no-ops, rejected autoplay no-ops, never throws.
 */
export function playPrerollTick(): void {
  playTone(PREROLL_TICK_FREQUENCY_HZ, PREROLL_TICK_DURATION_SECONDS)
}

/**
 * Play a sub-block pacing tick. Called from `RunScreen` at every
 * multiple of the active block's `subBlockIntervalSeconds` so drills
 * with internal timed sub-segments get audible pacing without the
 * tester needing to watch the phone.
 *
 * Pitched higher and briefer than the block-boundary cues so it is
 * distinguishable from the 3-sec end-countdown and the block-end beep.
 *
 * Safe to call from any environment: SSR no-ops, missing
 * `AudioContext` no-ops, rejected autoplay no-ops, never throws.
 */
export function playSubBlockTick(): void {
  playTone(SUB_BLOCK_TICK_FREQUENCY_HZ, SUB_BLOCK_TICK_DURATION_SECONDS)
}

/**
 * Testing-only reset hook. Clears the module-scoped singleton so
 * individual vitest specs can swap the AudioContext mock between runs
 * without cross-test leakage. Not exported for production code paths.
 */
export function __resetAudioContextForTesting(): void {
  // Close the prior context (defensive - frees any audio resources).
  try {
    sharedContext?.close()
  } catch {
    /* ignore */
  }
  sharedContext = undefined
  loggedMissingContext = false
  loggedAutoplayBlocked = false
  loggedGenericFailure = false
}
