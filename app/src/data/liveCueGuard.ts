/**
 * Live-cue guard registry (M002.2 rung-aware live cue; plan
 * `docs/plans/2026-06-30-001-feat-m002-2-rung-aware-live-cue-plan.md`, U2).
 *
 * Drills whose own `coachingCues[0]` is load-bearing and must survive the
 * rung-cue substitution on the live "Now" surface. On a ladder-bearing
 * block the rung's authored `externalFocusCue` normally *replaces* the
 * drill's generic `coachingCues[0]` (one cue at arm's length;
 * courtside-copy rule 12a). But `externalFocusCue` is authored per
 * `(focus, rung)` and shared across every drill on that rung, so a blanket
 * swap can erase a cue that is the whole point of a specific drill. A
 * drill listed here keeps its own cue live and suppresses the rung cue.
 *
 * The protect-worthy classes are:
 *   - gaze / perceptual cues (rule 12c: "look at … the moment …") — seeing
 *     the read *is* the drill, and the shared external cue cannot say it;
 *   - safety cues (rule 12b);
 *   - a technique cue specific enough that the shared rung cue would erase
 *     real instruction (KTD3 substitutes on technique/support blocks too).
 *
 * v1 is keyed by `drillId` (coarse); variant-level precision is deferred
 * (plan Scope Boundaries). Manual-first per OQ2 — a founder-editable set,
 * not a derived tag: no cue-type tag exists on `DrillVariant`, and the
 * `evaluateCue0` lint detects the *opposite* (internal-focus cues).
 *
 * To add an entry: confirm the drill's `coachingCues[0]` is genuinely
 * load-bearing per the classes above, then add its `drillId` with a
 * one-line reason.
 *
 * Guard-seed completeness pass (2026-07-04, D176 follow-up): audited all
 * 44 ladder drills' `coachingCues[0]` per variant against this bar.
 * Added `d15` and `d47` (perceptual "read" cues the shared rung cue does
 * not carry). Deliberately left unguarded: `d46` (pass rung 5, "Call the
 * spin before you move") because that rung's `externalFocusCue` already
 * says "Track the contact and the spin …", so the read survives the swap;
 * and `d23` (serve rung 2, "Watch the ball flight as you sprint") which is
 * a genuine gaze cue but a non-`m001Candidate` drill — runtime-inert until
 * eligibility widens (revisit then). All other flagged cue0s were
 * targeting/outcome cues the rung cue is meant to replace.
 */
export const LIVE_CUE_GUARD_DRILL_IDS: ReadonlySet<string> = new Set([
  // d07 Pass & Look (pass rung 3): coachingCues[0] is the rule-12c gaze
  // cue ("Look at your partner's hand the moment your platform meets the
  // ball."). Reading the flash is the scored behavior; the shared pass
  // rung cue would erase it.
  'd07',
  // d48 Set and Look (set rung 5): coachingCues[0] is the same gaze/
  // perceptual class ("Look at … the moment the ball leaves your hands.").
  // The set-and-look read is the drill; the shared set rung cue cannot
  // carry it.
  'd48',
  // d15 Read & Move (pass rung 4): coachingCues[0] is the rule-12c
  // perceptual read ("Read the ball early from the server's hand.").
  // The pass rung-4 cue is an emergency-control cue ("Guide the ball back
  // to your target even on the emergency play.") and does not carry the
  // early read, so the swap would erase the drill's whole point.
  'd15',
  // d47 (set rung 4): coachingCues[0] is a rule-12c read-then-decide cue
  // ("Read the ball before choosing hands or platform."). Reading the
  // imperfect pass to pick bump vs. hand set is the drill; the set rung-4
  // targeting cue cannot carry that decision read.
  'd47',
])

/**
 * Whether a drill's own `coachingCues[0]` must survive the rung-cue swap
 * on the live "Now" surface. Pure and null-safe (an unknown id returns
 * `false`), so the resolver can fold it in without a guard clause.
 */
export function isLiveCueGuardProtected(drillId: string): boolean {
  return LIVE_CUE_GUARD_DRILL_IDS.has(drillId)
}
