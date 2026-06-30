/**
 * Run-flow label lexicon — Stage 0 of the run-flow beat contract.
 *
 * Spec: `docs/specs/run-flow-beat-contract.md`
 * Origin: `docs/brainstorms/2026-06-23-run-flow-beat-contract-requirements.md` (R3)
 *
 * One canonical label per concept across Run / Transition / Drill Check
 * so drift cannot silently return. Stage 1 settles the two
 * founder-decided labels — the decide-step action CTA (`Start`, consumed
 * by `TransitionScreen`) and the live cue label (`Now`, consumed by
 * `RunScreen`). Stage 2 adds the recovery-overlay labels (`Drill details` /
 * `Back to drill`, consumed by `RunScreen`'s on-demand details overlay —
 * 2026-06-29 founder merge of the old inline "Show more cues" disclosure and
 * the "Peek setup" button into one control, so both are now SUNSET). The
 * swap / shorten / skip strings are single-sourced into Transition's footer
 * too but stay canonical-at-current-strings: they are contextual variants
 * (full vs compact, full-width vs paired), not drift, and a quick founder
 * normalization pass unifies the wording later (origin Outstanding
 * Questions). Block-counter prefixes ("Next:" / bare / "Last:") stay
 * context-specific and are not lexicalized here.
 *
 * Layer rule: pure data module. No imports from screens / services /
 * Dexie / React. Pinned by `__tests__/runFlowLexicon.test.ts` (constants)
 * and the cross-surface guard
 * `screens/__tests__/runFlowLexicon.guard.test.tsx` (rendered strings).
 */
export const RUN_FLOW_LABELS = {
  /** Decide-step primary CTA on Transition (replaces "Start next block"). */
  startAction: 'Start',
  /** The live one-cue label on Run's cockpit (DO-CONFIRM, courtside-copy rule 12a). */
  cue: 'Now',
  /**
   * Run's Stage 2 recovery affordance — opens the on-demand overlay carrying
   * the remaining coaching cues AND the full setup read (2026-06-29 founder
   * merge of "Show more cues" + "Peek setup"). Key stays `peek` for the
   * recovery-overlay concept; the canonical label is now "Drill details".
   */
  peek: 'Drill details',
  /** Dismiss control for the recovery overlay (back to the one-cue cockpit). */
  peekClose: 'Back to drill',
  /** Pre-start swap control (contextual full form; awaits normalization). */
  swap: 'Swap drill',
  /** Tired-athlete escape, paired form (awaits normalization). */
  shorten: 'Shorten',
  /** Tired-athlete escape, full-width form (awaits normalization). */
  shortenFull: 'Shorten block',
  /** Skip the upcoming optional block (awaits normalization). */
  skip: 'Skip block',
  /**
   * Run get-ready disclosure (Stage 4, R13) that reveals the less-common
   * Swap / Skip controls so the get-ready footer keeps Start + Shorten
   * dominant. Cancelable — tapping it again re-collapses.
   */
  adjust: 'Adjust',
} as const

/**
 * Labels retired by the Stage 1 beat-contract pass. The cross-surface
 * guard asserts none render on a live run-flow beat (DOM text or ARIA),
 * so a regression that reintroduces one fails loudly.
 *
 *  - 'Start next block' → 'Start' (startAction).
 *  - 'GO' → 'Start' (the read-first Stage-4 collapse fixed the action verb).
 *  - 'Cue' → removed from Transition; the cue's only home is Run's 'Now'.
 *  - 'Show full instructions' / 'Show more cues and instructions' → Run no
 *    longer homes the full read inline.
 *  - 'Show more cues' / 'Peek setup' → retired by the 2026-06-29 founder
 *    merge. The inline extra-cues disclosure and the separate setup-recovery
 *    button folded into one "Drill details" overlay; neither label may
 *    return to a live beat.
 */
export const SUNSET_RUN_FLOW_LABELS = [
  'Start next block',
  'GO',
  'Cue',
  'Show full instructions',
  'Show more cues and instructions',
  'Show more cues',
  'Peek setup',
] as const

export type RunFlowLabelKey = keyof typeof RUN_FLOW_LABELS
