/**
 * Compatibility shim — `hasMeaningfulReviewDraftInput` and
 * `ReviewDraftSignal` moved into `domain/capture/` under U2 of the
 * architecture pass. The capture domain is the closed home for every
 * draft / capture decision; new call sites should import from there.
 *
 * NEW CALL SITES MUST IMPORT FROM `domain/capture` directly.
 */
export { hasMeaningfulReviewDraftInput, type ReviewDraftSignal } from './capture'
