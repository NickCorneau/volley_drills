/**
 * Compatibility shim — capture eligibility + merge moved into
 * `domain/capture/` under U2 of the architecture pass. Existing call
 * sites continue to import from this path until they are naturally
 * rewritten; the new home is the single closed module.
 *
 * NEW CALL SITES MUST IMPORT FROM `domain/capture` directly.
 */
export {
  mergePerDrillCaptures,
  resolveDrillCheckCaptureEligibility,
  type DrillCheckBypassReason,
  type DrillCheckCaptureEligibility,
} from './capture'
