/**
 * Compatibility shim. The run-flow interaction contract relocated to
 * `app/src/contracts/runFlowInteractionContract.ts` in U7 of the
 * architecture pass — see that file for the transitional spec, the
 * sunset rule, and the registry of retired invariants.
 *
 * Existing imports under `app/src/screens/` continue to resolve via
 * this re-export. New code SHOULD import from
 * `'../../contracts/runFlowInteractionContract'` directly so the
 * dependency direction (screens → contracts) reads cleanly.
 */
export {
  RUN_FLOW_INTERACTION_CONTRACT,
  SUNSET_RUN_FLOW_CONTRACT,
  type RunFlowInteractionContract,
  type RunFlowInteractionId,
  type SunsetRunFlowEntry,
} from '../contracts/runFlowInteractionContract'
