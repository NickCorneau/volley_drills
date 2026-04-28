/**
 * P12 screen contract.
 *
 * `docs/vision.md` P12 — "one clear action, one confidence signal, one
 * reason to come back" — has historically been an editorial principle.
 * U7 of the architecture pass encodes it structurally so each route
 * screen owns and exports its triple. Future agents reviewing a screen
 * have an explicit, machine-checkable shape to fill in or argue
 * against, instead of having to re-derive intent from the JSX.
 *
 * A screen MAY opt out by setting `exemption`. Opt-outs are rare,
 * justified, and reviewed against `docs/vision.md` P12. Tests refuse
 * to accept an empty `exemption.rationale`.
 *
 * Layer rule: pure type module. No React, no Dexie, no services.
 */
export interface ScreenContract {
  /** Stable route path this contract describes (e.g. `'/run/check'`). */
  route: string
  /** Short, human-readable name for the screen (e.g. `'DrillCheck'`). */
  screen: string
  /** P12: the ONE clear action this screen offers. */
  action: string
  /** P12: the ONE confidence signal the screen shows. */
  signal: string
  /** P12: the ONE reason it gives the user to come back. */
  reason: string
  /**
   * Explicit opt-out marker. Screens that legitimately do NOT have one
   * of the three (e.g. settings, onboarding flows that span multiple
   * decisions) set this with a written rationale that survives review.
   */
  exemption?: ScreenContractExemption
}

export interface ScreenContractExemption {
  /** Why the screen does not fit the P12 triple. */
  rationale: string
  /** Optional pointer to the doc / decision that owns the exemption. */
  trackedIn?: string
}

/**
 * Helper for screens that fully satisfy P12. Keeps the per-screen
 * `screenContract` export concise.
 */
export function defineScreenContract(input: Omit<ScreenContract, 'exemption'>): ScreenContract {
  return input
}

/** Helper for the explicit opt-out path. */
export function exemptScreenContract(
  input: Pick<ScreenContract, 'route' | 'screen'> & {
    rationale: string
    trackedIn?: string
  },
): ScreenContract {
  return {
    route: input.route,
    screen: input.screen,
    action: 'n/a (exempt)',
    signal: 'n/a (exempt)',
    reason: 'n/a (exempt)',
    exemption: {
      rationale: input.rationale,
      ...(input.trackedIn ? { trackedIn: input.trackedIn } : {}),
    },
  }
}
