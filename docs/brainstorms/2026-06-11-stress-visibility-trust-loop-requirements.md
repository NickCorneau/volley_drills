---
id: brainstorm-stress-visibility-trust-loop
title: Stress Visibility — v1 Trust Loop
status: active
stage: planning
type: requirements
date: 2026-06-11
topic: stress-visibility-trust-loop
summary: "Close the D154 steering trust loop at the two deliberate-reading moments — a hedged drill-exemplar consequence line on the Review accept, a cash-the-promise steering line on the Setup preview, a conditional repeat-path note, and a one-time disclosure plus evergreen gloss — gated on steering traces never asserting steering that did not happen, under two ratified display rulings (no raw rungs ever; present-tense only)."
authority: requirements input for the stress-visibility plan; subordinate to docs/decisions.md and the M002 series requirements
last_updated: 2026-06-11
depends_on:
  - docs/ideation/2026-06-11-stress-substrate-visibility-ideation.md
  - docs/brainstorms/2026-06-11-stress-substrate-requirements.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/decisions.md
---

# Stress Visibility — v1 Trust Loop Requirements

## Summary

Make the D154 stress steering legible without touching the run face: the Review accept shows its concrete consequence (a hedged drill exemplar), the Setup preview cashes accepted deltas with one quiet line, the repeat path notes when the plan has moved since, and a one-time disclosure plus an evergreen gloss state the adaptation contract. Two display rulings bind every current and future stress surface: no UI ever renders a raw rung, and visible stress state is present-tense only.

---

## Problem Frame

`D154` shipped rung-steered assembly with exposure deferred: the only visible trace is the carry-forward line, which renders nothing for `keep` even though steering acts on every steered session. Post-ship founder feedback named the gap: "the steering's proof (Hand Set Fundamentals picked for the rung position) is visible nowhere."

The 2026-06-11 ideation (48 candidates, 6 frames) found no core misdesign in the substrate, but two structural trust gaps in what sits on top of it. First, the Review verdict is uninformed consent — the athlete approves "a bit more stress on setting," a delta on a scale they have never seen, with the consequence previewed nowhere. Second, disclosure is keyed to delta events while the hazard is keyed to steering acts: external evidence locates the trust breach in undisclosed adaptation discovered later, not in adaptation itself. The same evidence warns against the opposite pole — always-visible difficulty scores produce metric anxiety. The converged prior art is a disclosed philosophy plus relational, athlete-anchored labels at decision moments.

This revises the exposure posture of `D154` and the prior brainstorm's R11/R14 ("no new user-facing stress surface"; "the rung is never rendered copy"): session-level stress copy now renders on Setup and Review, while the rung itself stays unrendered everywhere.

---

## Key Decisions

- **Zero new vocabulary in v1.** All copy speaks the shipped carry-forward voice ("a bit more stress on setting"). The word **stretch** is reserved as the only future drill-level term, exception-only (silence is the at/below-position default) — recorded now, not built now.
- **Relational display invariant.** No surface renders a raw rung number or position integer, ever. Any future drill-level display derives from the relation between drill rung and athlete position. Absolute display would also mislead: ladder tops differ per focus (serve 4; pass/set 5).
- **Present-tense ruling.** Visible stress state is current-state only — no history, trends, or dated movement. This also dissolves the ladder-versioning hazard: replayed position over editable ladders can never rewrite a visible past if no past is ever shown.
- **Cash-the-promise trigger.** The Setup steering line fires only on the next steered session per focus after an accepted delta, silent otherwise — the quietest trigger that keeps the accept/keep loop honest. Unprompted band-derived steering is covered once by the disclosure line, then stays silent by design.
- **Disclose once, then recede.** One pushed disclosure at first relevance (first steered Setup preview) plus an evergreen on-demand gloss. Onboarding placement rejected (no referent yet); gloss-only rejected (undisclosed-until-sought is the hazard shape).
- **Honesty gate.** Traces ship only over assembly paths that actually steered. Disclosed-but-wrong is worse than invisible.

---

## Requirements

**Display rulings (bind all current and future stress surfaces)**

- R1. No user-facing surface renders a raw stress-rung number, ladder position integer, or per-focus scale.
- R2. Visible stress state is present-tense only; no surface renders position history, trends, or dated movement.
- R3. v1 introduces no new athlete-facing stress vocabulary; all v1 copy uses the existing carry-forward voice.

**Review verdict**

- R4. The accept option at Review shows its concrete consequence as one short hedged exemplar line — "Accept — setting sessions lean toward drills like *Set and Look*" — where the exemplar is a drill at the prospective position (one rung in the delta's direction, clamped to ladder bounds).
- R5. The exemplar line frames a tendency, never a promise: "lean toward … like" wording, since context filters may exclude the named drill from an actual assembly.

**Setup preview**

- R6. The Setup preview shows one quiet steering line ("A bit more stress on setting today") on the next steered session per focus after an accepted stress delta, and renders nothing otherwise.
- R7. The steering line renders only when the previewed assembly was rung-steered on that focus.

**Repeat path**

- R8. The repeat path shows a one-line note ("Repeating as-is — your plan has moved since") only when the focus position has moved since the repeated session was assembled; repeat assembly itself stays verbatim.

**Disclosure**

- R9. The first steered Setup preview shows a one-time dismissable disclosure line stating that the plan quietly adjusts challenge as the athlete trains and that the athlete approves every change; it never repeats after dismissal.
- R10. An evergreen on-demand "how sessions adapt" gloss is reachable from the Setup preview, stating the contract: drills carry a stress order; accepted verdicts move where sessions aim; repeat is verbatim; nothing moves without an accept.

**Honesty gate**

- R11. No steering trace may assert steering that did not happen.
- R12. The build-time main-skill substitution path either respects rung preference or suppresses the steering trace for that session; the same rule applies to any other assembly path that bypasses rung preference.

**Constraints**

- R13. No Dexie schema change and no new capture fields; the disclosure dismissal flag persists through the existing key-value storage pattern.
- R14. All new lines derive at render time from existing records, deterministically (same records, same output).

---

## Acceptance Examples

- AE1. **Covers R4, R5.** Athlete at set position 1 is offered "a bit more stress on setting." The accept option reads "Accept — setting sessions lean toward drills like *Partner Set Back-and-Forth*" (the rung-2 drill).
- AE2. **Covers R6.** After accepting, the next steered setting session's Setup preview shows "A bit more stress on setting today." The steered setting session after that, with no new accepted delta, shows no steering line.
- AE3. **Covers R6, R9.** A new intermediate athlete launches their first plan: no per-session steering line appears; the one-time disclosure line appears, and never again after dismissal.
- AE4. **Covers R8.** Athlete accepts a delta, then taps Repeat last session: the repeat note appears. Repeating when no position has moved since that session was assembled: no note.
- AE5. **Covers R7, R11, R12.** The main-skill substitution rule fires for a session and the pick bypassed rung preference: that session's Setup preview shows no steering line.
- AE6. **Covers R1, R3.** Nowhere in v1 does the UI render a rung number, the word "rung," or any new stress vocabulary.

---

## Scope Boundaries

**Deferred for later**

- Drill-level marks during runs — exception-only "stretch," reopened only on dogfood evidence of too-hard taps on drills working as designed.
- Position legibility (on-demand pull-gloss, place vocabulary, ladder atlas) and any position read beyond the founder export.
- CI-dimension tags on rungs — M002.2, with the requirement that traces speak coach language recorded there.
- Rung-audit diagnostics (authored rung vs capture disagreement) — rider on the next diagnostics pass.
- Replay-stream definition (closed accepted-verdicts fold vs open position-affecting events) — settle before M002.2 adds event types.
- Mid-session visible downshift — own consent-exemption policy fork.

**Outside this feature's identity**

- Absolute difficulty scores, badges, or always-on per-drill labels.
- Position history, trends, or charts (R2 is a ruling, not a deferral).
- Auto-applied position movement without an accepted verdict.
- Athlete-set rung dial (contradicts recommendation-first).

---

## Dependencies / Assumptions

- Revises the exposure stance of `D154` and prior R11/R14; shipping should add a decision row recording the new posture (session-level stress copy renders; the rung itself never does).
- Drill courtside copy surfaces stay untouched; new lines live on Setup, Review, and the repeat path only.
- Confirmed: band-derived steering with no accepted delta shows no recurring trace — the one-time disclosure is the only coverage of that state.
- Assumption: the existing key-value storage pattern suffices for the disclosure dismissal flag (R13).

---

## Outstanding Questions

**Deferred to planning**

- Deterministic tie-break when several drills share the prospective rung for the R4 exemplar.
- Exact anchoring and copy of the evergreen gloss (R10) within the existing gloss pattern.
- How R8 derives "moved since" — comparing current position against position at the repeated session's assembly time may need re-derivation at that record's timestamp.
- Whether R12 lands as a rung-aware substitution fix or trace suppression first.

---

## Sources

- `docs/ideation/2026-06-11-stress-substrate-visibility-ideation.md` — the 48-candidate run this composite survived; rejection trail for the alternatives.
- `docs/brainstorms/2026-06-11-stress-substrate-requirements.md` — the substrate this exposes; R11/R14 posture being revised.
- `docs/specs/stress-rung-taxonomy.md` — rung semantics, ladder contents, uneven ladder tops behind R1.
- `docs/decisions.md` — `D154` (substrate + exposure deferred), `D152` (carry-forward promise), `D150` (derive-don't-persist), `D151`, `D123`, `D137`.
- External digest (2026-06-11 research pass): TrainerRoad relational labels + accept-diff; Kizilcec expectation-violation transparency; hidden-DDA/FIFA-scripting trust breach; orthosomnia metric anxiety; informed-consent disclosure doctrine.
