---
id: brainstorm-m002-2-progression-read-on-review
title: M002.2 Progression Read on Review
status: active
stage: build
type: requirements
date: 2026-06-22
topic: m002-2-progression-read-on-review
summary: "Render the authored per-rung felt content the adaptation engine already computes but never shows, at the post-session Review verdict moment: a reflective explorationCriterion line keyed to the rung the athlete actually trained, and a graduationFeel readiness line keyed to the offer position on step-up offers only. Verdict-gated and Review-only by decision; no raw rungs (D157); movement stays user-accepted (D154). A step-moment trust + voice-validation slice, not the delivery of M002.2's run-time technique-how outcome."
authority: requirements input for the M002.2 progression-read plan; subordinate to docs/decisions.md, docs/specs/stress-rung-taxonomy.md, and the M002 series requirements
last_updated: 2026-06-22
depends_on:
  - docs/specs/stress-rung-taxonomy.md
  - docs/brainstorms/2026-06-11-stress-visibility-trust-loop-requirements.md
  - docs/decisions.md
  - docs/status/current-state.md
---

# M002.2 Progression Read on Review Requirements

## Summary

The M002.2 stress-rung content layer (`intent`, `externalFocusCue`, `explorationCriterion`, `graduationFeel` per rung) is fully authored in `app/src/data/stressLadders.ts` but rendered nowhere. This slice surfaces two of the four fields at the one deliberate-reading moment that already carries stress copy — the Review "Next time" verdict card — making the stress ladder legible at the step moment without touching the run face. A reflective `explorationCriterion` line (what to notice about the rung just trained) and, on a step-up offer only, a `graduationFeel` readiness line ("you're ready to step up when …"). It is a step-moment trust + voice-validation slice; M002.2's headline "I finally understand how to do this" outcome is delivered by the deferred run-time half, not here.

---

## Problem Frame

`D154` shipped rung-steered assembly and `D157` made the steering legible at decision moments (the Review accept-consequence exemplar, the Setup steering line), under two rulings: no raw rungs ever render, and visible stress state is present-tense only. But the per-rung *progression content* — the authored language that gives a rung its meaning ("hold pass quality while the ball keeps coming") — was deferred: `docs/specs/stress-rung-taxonomy.md` records "Rendering is a deferred M002.2 UI pass." So the athlete is offered "a bit more stress on serving" with the drill it would pick (the accept-consequence), but never sees what their current rung is *about* or what readiness to climb it feels like.

This slice renders that felt content at the verdict moment. It does not introduce raw rungs (the rulings hold) and does not change how movement happens (the verdict choice remains the only acceptance).

---

## Fixed Decisions (settled with the founder this session — not reopened here)

- **Verdict-gated presence.** The progression content appears only inside the existing conditional "Next time" card, which renders only when the adaptation engine offers a step (`verdictLine` non-null; `keep` already hides the card). It is not an always-on Review section. Chosen for calm/shibui density on a deliberately thin screen; the accepted cost is that no-step sessions show no ladder read.
- **Review-only surface.** This slice renders on Review only. Enriching the pre-session Safety steering trace with rung content is a named follow-on.

## Key Decisions (review-hardened, 2026-06-22)

- **Reflective line keys off the rung the athlete actually trained**, via `stressRungForDrill(focus, mainSkillDrillId)` — NOT the derived ladder position (`offerPosition`). `offerPosition` diverges from the trained drill's authored rung whenever assembly lands off-target (nearest-rung / duration-fit / substitute fallbacks fail quiet) or via review-time recomputation; keying a "what you just trained" reflection off `offerPosition` would describe a rung the user never trained — the exact trust breach the M002 loop exists to prevent.
- **Readiness line keys off `offerPosition`.** `graduationFeel` is a forward "ready to step up from your current ladder position" read tied to the offer itself, so the offer's basis (`offerPosition`) is the correct, internally consistent source. R15 offer gating guarantees a rendered `more` card has `offerPosition < max`, so the readiness line is always the non-top "step up" text, never the ladder-top "stay and deepen" copy.
- **Asymmetric by direction.** `graduationFeel` (a step-up signal) renders only on `more` offers. On `less` (ease) offers it is suppressed; only the reflective line shows. An "easing is legitimate" felt read is deferred (named follow-on); the down-step carrying only the reflective line is an accepted risk this slice.
- **No raw rungs, no new persisted state, no assembly change.** Pure render-time composition over already-authored data; honors `D157`/`D154`.
- **Framing.** Step-moment trust + voice-validation slice. M002.2 is not "done" until the run-time technique-how half lands.

---

## Actors

- **Self-coached amateur (primary).** Finishes a session, opens Review, and on an offered-step session reads the felt content to decide Keep vs Try it.

## Key Flow

1. Athlete completes a scoped-focus session (pass / serve / set) and opens Review.
2. The adaptation engine offers a step (`more` or `less`); the "Next time" card renders.
3. The card shows: the offer line, a reflective line about the rung just trained, the Keep/Try-it choice with its accept-consequence exemplar, and (on `more`) a readiness line.
4. The athlete reads the felt content and chooses; the verdict choice remains the only thing that moves their position.

---

## Requirements

**Inherited rulings (from D157 — restated, not re-decided)**

- R1. No surface renders a raw stress-rung number, ladder position integer, or per-focus scale. The new lines render authored felt content only.
- R2. Visible stress state stays present-tense; the lines describe the current rung / readiness, not history or trends.

**Reflective line**

- R3. When the "Next time" card renders for a scoped focus, show the trained rung's `explorationCriterion` as one quiet line, grouped tight under the carry-forward line. Direction-agnostic (shows on both `more` and `less`).
- R4. The reflective line keys off the rung the athlete actually trained (`stressRungForDrill(focus, mainSkillDrillId)`), never `offerPosition`.
- R5. Fail quiet: render nothing when the main-skill drillId is absent, the trained rung is undefined, or multiple main-skill blocks resolve to different rungs (ambiguous). Never throw — a missing rung must not blank the Review screen.

**Readiness line**

- R6. On a `more` offer only, additionally show the offer-position rung's `graduationFeel` as one quiet line, grouped near the choice. Suppressed on `less`.
- R7. The readiness line keys off `offerPosition` (the offer's basis), guaranteeing the non-top "step up" text under R15 gating.
- R8. The readiness line is not wired into the "Try it" `aria-describedby`; the accept-consequence exemplar remains the single described consequence.

**Presentation**

- R9. Both lines render as quiet secondary text (`text-xs text-text-secondary`), proximity-grouped with no labels/chrome. If founder dogfood reads the card as heavy, a `Disclosure` reveal is the sanctioned fallback.

**Integrity**

- R10. No new Dexie table, schema bump, route, or persisted field; no assembly-semantics change. The generated-plan diagnostics report stays current (copy/render-only proof). The composer is data-only (reads `STRESS_LADDERS`; imports nothing from `sessionAssembly/`).

---

## Scope Boundaries

**In scope**

- Rendering `explorationCriterion` (trained rung) and `graduationFeel` (offer position, `more` only) inside the existing Review verdict card.
- A pure composer + a `getStressRung` accessor + controller wiring + the two render lines.
- Tests (pure composer; DB-seeded Review screen incl. a trained-rung-vs-`offerPosition` divergence fixture and a `more`-offer fixture) and a scoped courtside-copy sweep over the two rendered fields.

**Out of scope (named follow-ons)**

- The run-time technique-how half (`intent` + `externalFocusCue` on Run / Transition / Drill Check) — the M002.2 spine follow-on that delivers the headline outcome.
- An "easing is legitimate" felt read on `less` offers.
- Safety steering-trace rung enrichment.
- An always-on reflective read on no-step sessions.
- `M002.3` objective "1% better" score.

---

## Success Criteria

- On an offered-step scoped session, the Review card reads as one calm arc (offer → what to notice → choice → what accepting trains → what ready feels like) at 390px, without burying the Keep/Try-it decision.
- The reflective line always describes the rung the athlete actually trained, including when assembly landed off-target (verified by the divergence fixture).
- No raw rung ever appears; no Review screen crash on any missing-rung path; diagnostics + agent-docs validation stay green.

---

## Dependencies / Assumptions

- Assumes the authored `explorationCriterion` / `graduationFeel` strings already obey the courtside-copy invariants (verified clean during review; the scoped sweep guards regressions).
- Assumes `useReviewController` continues to load `offeredDelta` + `offerPosition` via `loadVerdictOffer` and to resolve the main-skill drillId for `acceptConsequence` (both true as of 2026-06-22).
- Plan: `docs/plans/` (authored from this doc via the M002.2 progression-read plan).
