---
id: brainstorm-shibui-empty-space-polish
title: Shibui / Empty-Space Polish Pass — Requirements
status: active
stage: planning
type: requirements
date: 2026-06-11
topic: shibui-empty-space-polish
summary: "Requirements for shipping the shibui research pass's proposals: comp-first structural changes to Home (relocate the link pile out of the focal card, S5 — founder-felt) and Setup (recommendation-first restructure, S1 — the oldest unrealized visual-direction canon item), plus three direct-ship quiet wins (S2 Transition receipt, S3 empty Good-passes line, S4 active-segment-only glosses) and one doc-only canon fix (S6). Zero semantic changes anywhere; visuals and placement only."
authority: requirements input for the shibui polish plan; subordinate to docs/decisions.md and the design canon
last_updated: 2026-06-12
depends_on:
  - docs/design/reviews/2026-06-11-shibui-empty-space-research-pass.md
  - docs/brainstorms/2026-06-11-home-covenant-requirements.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/brand-ux-guidelines.md
decision_refs:
  - D130
  - D137
  - D152
---

# Shibui / Empty-Space Polish Pass — Requirements

## Summary

Ship the five proposals from the 2026-06-11 shibui / empty-space research pass as one polish plan, with founder-set priority: the Home link pile (S5) and the flat Setup form (S1) are founder-felt friction and gate behind screenshot comps; the three quieter wins (S2–S4) ship directly with in-session screenshot iteration. Every change is visual/placement only — no route, semantic, or data change anywhere. S6 rides along as a doc-only canon fix.

---

## Problem Frame

The research pass found the app's run flow is its best `ma` and defended it; the gaps are at the edges. Two of them are now founder-confirmed friction from real sessions:

- **The Home link pile (S5).** The `last_complete` focal card stacks six text elements; the bottom two-to-three are underlined escape links riding inside the card that asserts the plan. The founder names this the biggest felt issue. The deep pass had left "Home focal competition" open *pending founder-use evidence* — this is that evidence, so S5 is promoted from "D130 window-close candidate" to in-scope now. The same-day Home covenant brainstorm deferred "custom-escape polish"; this pass activates that deferred item without touching the covenant's rules (the escape stays present and quick — it just stops competing inside the focal card).
- **The flat Setup form (S1).** Setup renders 12 equally-weighted chips across four labeled sections with no focal zone; the visual-direction doc has called for "make the recommendation feel more central than the controls used to refine it" since 2026-04-19 — the oldest unrealized canon item. Founder: "a bit lame, but not as bad."
- **The rest (S2–S4) are confirmed relevant**: the green previous-block receipt out-shouts `Up next` on Transition; the wholly-empty Good-passes card spends full card chrome announcing nothing; 4–5 gloss underlines compete with the one active segment row mid-run.

## Key Decisions

- **Comp-first for the two structural items.** S1 (Setup) and S5 (Home) require approved 390×844 screenshot comps before code. S2–S4 ship directly under the usual in-session mobile screenshot iteration.
- **Onboarding inherits the S1 layout.** Setup and onboarding's Today's-setup step keep their shared component; no fork. The S1 comps must include the first-run state (default recommendation as the focal line) so it is approved alongside the returning-user state.
- **S5 promoted on founder evidence.** D152 ratified the card internals on 2026-06-03→11; this pass revisits them with exactly the founder-use evidence the deep pass's open question asked for. Shipping S5 carries a decision-row update recording that.
- **Semantics frozen everywhere.** All chips stay real selectable options, `Recommended` remains a true focus choice, mandatory focus and the duration-honesty Callout are untouched, all Home links keep their current routes / intercepts / floors, the D137 spine (Setup → Safety) is unchanged.
- **Each item independently revertible.** Founder-use during the D130 window is the final gate; any item that fails its gate reverts alone.

---

## Requirements

**Home — link pile relocation (S5, comp-gated)**

- R1. `Start a different session` moves out of the `last_complete` focal card to a page-field quiet-tertiary below it. The card interior ends at: state line, meta line, focal CTA, `Then:` queue line, and at most one quiet link. Whether the `Repeat` link(s) also move is decided at comp review.
- R2. The ended-early variant (up to three links: `Repeat full plan`, conditional `Repeat shorter version (N min)`, `Start a different session`) must not recreate the pile below the card. Comps show both the normal and ended-early states. The `REPEAT_SUBSET_MIN_MINUTES` floor and all link behavior (routes, review-pending soft-block intercept, disabled states) are unchanged.
- R3. Relocated links must not collide with the secondary action rows / Recent sessions below — placement relative to those is part of the comp. If the Home covenant's render-budget test exists by ship time, the S5 PR updates the pinned census in the same change.

**Setup — recommendation-first restructure (S1, comp-gated)**

- R4. Setup leads with the resolved recommendation as the focal statement (single line in the focal voice, e.g. `Pair + Net · 40 min · Recommended focus`, sourced from the live draft and updating as chips change). The minute segment reports the assembled total from the live preview draft — the same number the duration-honesty Callout uses — never the named Time-chip profile, so the screen's two duration statements can never disagree. The four chip sections subordinate into a "refine" cluster beneath it: tighter intra-cluster spacing (macro/micro split), section headings dropped to the quiet label voice. The focal slot's non-happy-path states are part of the spec: when no draft resolves (incomplete form — e.g. the wall follow-up unanswered — preview inputs still loading, or unbuildable constraints), the slot renders a quiet secondary-voice placeholder naming what's missing, mirroring the existing incomplete hint — never a blank or stale line. The explicit-focus variant (e.g. `Pair + Net · 40 min · Passing`) renders the chosen focus in place of `Recommended focus`.
- R5. Onboarding's Today's-setup step renders the same restructured layout via the shared component — no fork. Comps include the first-run state and the unresolved/incomplete state alongside the returning-user state.
- R6. Guardrails: no contrast or tap-target loss against the outdoor brief floors; chips must still read as obviously tappable (signifier check); the duration-honesty Callout keeps its current weight and position relative to the CTA.

**Direct-ship quiet wins (S2–S4)**

- R7. Transition demotes the previous-block receipt to one quiet line: small success-tone check glyph + `{drill} · Complete` in `text-sm text-text-secondary` — no panel fill, no semibold. The `Skipped` variant stays equally visible. Drill check keeps the fuller `JustFinishedPill` (there the just-finished drill is the subject).
- R8. When no drill has a logged count (`drillsWithCounts === 0`), the Good-passes card chrome drops and one quiet `text-text-secondary` line renders in its place (the line stays — it teaches where capture lives). When difficulty tags were captured but no counts (`drillsTagged > 0`), the quiet line uses a second copy variant acknowledging the tag captures, so a logged tag never disappears from Review. The card returns whenever any count exists.
- R9. On the segmented run face, the gloss-underline affordance renders only on the active segment row; upcoming and past rows render plain text — the gloss button drops entirely on non-active rows (an intended tap-target and a11y-tree reduction; no invisible tappables), and a row's definitions become reachable again when it turns active. Transition and the `Show more cues` disclosure are unchanged; the active row's gloss triggers and a11y semantics are unchanged.

**Canon rider (S6, doc-only)**

- R10. `brand-ux-guidelines.md` §3.4 is reconciled to match shipped reality: "keep meta lines to at most three `·`-separated segments" replaces "one middle dot separator max."
- R11. When S5 ships, the Home covenant brainstorm's "Deferred for later" entry for custom-escape polish is amended in the same change to point at this pass, so the two active same-day docs agree on the escape's status.

---

## Acceptance Examples

- AE1. **Covers R1–R3.** Founder opens Home after a normal session: the focal card reads plan → one action → queue line; the escape link sits quietly below the card and still routes to fresh `/setup`. After an ended-early session, the repeat offers render without a three-deep underlined stack inside the card.
- AE2. **Covers R4, R6.** Founder opens Setup: the first glance reads "this is today's plan, adjust if needed." Tapping a Time chip updates the focal line. Every chip still looks tappable and passes the contrast/tap-target floors.
- AE3. **Covers R5.** A first-run user reaches Today's setup during onboarding and sees the default recommendation as the focal line above the refine cluster — same component, same layout.
- AE4. **Covers R7.** Mid-session, the founder lands on Transition: the eye goes to `Up next`; the previous drill is one quiet confirmed line. A skipped drill is just as legible as a completed one.
- AE5. **Covers R8, R9.** A session with no counts logged shows one quiet line where the Good-passes card was; during the warm-up, only the active segment row offers gloss underlines.

---

## Success Criteria

- Founder-use during the D130 window: Home no longer reads as a link pile, Setup's first glance reads as a recommendation rather than a form, and no item triggers its named failure mode (S2: completion reads unconfirmed; S3: the empty state stops teaching where capture lives, or empty Reviews read as broken rather than calm; S4: a mid-drill "what is that movement?" moment loses its inline answer).
- Both comps (S1, S5) approved before their code lands; S2–S4 verified with 390×844 screenshots in-session.
- No regression in existing behavioral tests (Home link routing/intercepts, repeat floors, setup semantics); axe and contrast checks pass on every touched screen.

---

## Scope Boundaries

**In scope**: visual weight, placement, spacing, and copy-voice changes on Home (`last_complete`), Setup (+ onboarding Today's setup), Transition, Review empty Good-passes, the segmented run face; the §3.4 doc fix.

**Out of scope**

- Any semantic, route, or data change; any change to chip behavior, focus policy, duration honesty, or the D137 spine.
- Everything in the research pass's "Not re-surfaced" table (paused helper, Callout weight, Recommended semantics, D153-ratified items, warning-tone vocabulary split, D127 cluster, lock-screen timer footer line (ADV-3 routing), onboarding skill cards, Transition density).
- The Home covenant's own deliverables (identity ratification, claimant ledger, render-budget test) — coordinated with, not owned here.
- The run `Now` surface, Drill check, and Complete — defended as the app's best `ma`; no changes.

---

## Dependencies / Assumptions

- `docs/design/reviews/2026-06-11-shibui-empty-space-research-pass.md` is the evidence base; its guardrails and gates carry into the plan verbatim unless overridden here.
- The Home covenant brainstorm (`2026-06-11-home-covenant-requirements.md`) deferred custom-escape polish; this pass activates it. If both plans are in flight, S5 lands against whichever Home census is current and updates the render-budget test if it exists (R3).
- Assumes founder remains the evaluation instrument (D130 window through 2026-07-20).

---

## Outstanding Questions

**Decided at comp review (not before)**

- Whether `Repeat last session` / `Repeat full plan` also move out of the card or stay as the card's one quiet link (R1).
- Exact placement of relocated links relative to the secondary rows and Recent sessions (R3).
- Final spacing values and heading treatment for the Setup refine cluster (R4).
- Whether the duration-honesty Callout's large-gap copy slims down now that the focal line reports the assembled total (R4) — it stays the sole explanatory surface either way.

**Deferred to planning**

- Sequencing: whether S2–S4 + S6 land as a first tier while comps iterate, or the whole pass ships together.
- Exact quiet-line copy for R7 and R8 (courtside-copy rules apply).

---

## Sources / Research

- `docs/design/reviews/2026-06-11-shibui-empty-space-research-pass.md` — the originating pass: external research synthesis, live 390×844 walk, S1–S6 with guardrails and gates.
- Founder dialogue (2026-06-11): link pile is the biggest felt friction; flat Setup form second; S2–S4 confirmed relevant; comp-first gating chosen for both structural items; onboarding-inheritance call delegated.
- `docs/brainstorms/2026-06-11-home-covenant-requirements.md` — Home identity rules and the deferred custom-escape polish this pass activates.
