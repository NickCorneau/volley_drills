import type { RpeCaptureWindow } from '../../model'
import {
  CAPTURE_WINDOW_IMMEDIATE_MS,
  CAPTURE_WINDOW_SAME_DAY_MS,
  CAPTURE_WINDOW_SAME_SESSION_MS,
} from '../policies'

/**
 * Bucket a session-end-to-review-submit delay into one of the four
 * `RpeCaptureWindow` values used by `submitReview` / `expireReview` /
 * exporters.
 *
 * Window boundaries live in `domain/policies` (`D120` / V0B-30) so they
 * remain a single product knob.
 */
export function classifyCaptureWindow(delaySeconds: number): RpeCaptureWindow {
  const ms = delaySeconds * 1_000
  if (ms <= CAPTURE_WINDOW_IMMEDIATE_MS) return 'immediate'
  if (ms <= CAPTURE_WINDOW_SAME_SESSION_MS) return 'same_session'
  if (ms <= CAPTURE_WINDOW_SAME_DAY_MS) return 'same_day'
  return 'next_day_plus'
}

/**
 * Whether a review captured in this window is allowed to feed the
 * adaptation engine when it ships (D113 / V0B-15). `expired` and
 * `next_day_plus` are excluded because the capture-vs-recall noise
 * floor exceeds what the engine should consume.
 *
 * The exhaustive `switch` is the intended forcing function for new
 * `RpeCaptureWindow` values: a future `same_week` (or similar) bucket
 * is a TS compile error here until classified.
 */
export function isEligibleForAdaptation(window: RpeCaptureWindow): boolean {
  switch (window) {
    case 'immediate':
    case 'same_session':
    case 'same_day':
      return true
    case 'next_day_plus':
    case 'expired':
      return false
    default: {
      const _exhaustive: never = window
      return _exhaustive
    }
  }
}
