---
id: brainstorm-m002-2-technique-how-transition-intent
title: M002.2 Technique-How Transition Intent Line
status: active
stage: build
type: requirements
date: 2026-06-22
topic: m002-2-technique-how-transition-intent
summary: "Render the authored per-rung `intent` field as a single quiet line on the Transition (read-before-you-run) screen, naming what the upcoming drill's stress rung trains. Renders only for ladder-bearing main_skill / pressure blocks that resolve to a pass/serve/set rung; silent for warmup/wrap/recovery/off-ladder. The minimal first slice of M002.2's run-time technique-how half: one field (intent only), one surface (Transition only). externalFocusCue, the Run cockpit, Drill Check, the less-offer Review read, and Safety-trace enrichment are all deferred."
authority: requirements input for the M002.2 technique-how Transition-intent plan; subordinate to docs/decisions.md, docs/specs/stress-rung-taxonomy.md, and the M002 series requirements
last_updated: 2026-06-22
depends_on:
  - docs/specs/stress-rung-taxonomy.md
  - docs/brainstorms/2026-06-22-m002-2-progression-read-on-review-requirements.md
  - docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md
  - docs/decisions.md
  - docs/status/current-state.md
---

# M002.2 Technique-How Transition Intent Line Requirements

## Summary

The M002.2 stress-rung content layer (`intent`, `externalFocusCue`, `explorationCriterion`, `graduationFeel` per rung) is fully authored in `app/src/data/stressLadders.ts`. The Review verdict card already renders `explorationCriterion` + `graduationFeel` (`D161`/`D162`). This slice renders the first piece of the **run-time technique-how half** — the `intent` field — as a single quiet line on the **Transition** screen, the read-before-you-run beat. It names what the upcoming drill's stress rung trains ("Read where the ball is going, move to it, and still pass to one target") so the athlete knows what they are actually working on before they run it. This is the spine's loudest remaining gap ("I never really knew how to set until now"), delivered in the most minimal shape that still gets technique-how courtside.

Founder steer this session: **as minimal as possible.** Transition is the read-before-you-run moment, so technique-how can land there without touching the live cockpit. One field, one surface; extend after dogfood.

---

## Problem Frame

`D154` shipped rung-steered assembly, `D157` made steering legible at decision moments, and the 2026-06-21 progression-content layer authored four per-rung fields. `D161`/`D162` rendered the two *felt-readiness* fields on Review. But the two *technique-how* fields — `intent` (what the rung trains) and `externalFocusCue` (the one prompt that makes the step real) — render nowhere. The athlete is steered onto a rung and offered steps, but never told, at the moment of doing the work, what that rung is for.

The taxonomy spec names this the deferred run-time technique-how half and the M002 series doc names it the milestone's headline outcome. This slice delivers the minimal viable piece: `intent` on Transition.

The design tension that shaped the scope: **Run is the DO-CONFIRM cockpit** (courtside-copy rule 12a renders exactly one cue at arm's length; the drill's own `coachingCues[0]` already owns the "Now" line). Adding rung copy there would put two external-focus cues in competition at glare distance. Transition is the READ-DO surface with room to read before the rep starts, so it carries the technique-how depth without degrading the cockpit.

---

## Fixed Decisions (settled with the founder this session — not reopened here)

- **One field: `intent` only.** `externalFocusCue` is held back — it is itself an external-focus cue and overlaps the drill's own `coachingCues[0]`, so showing both risks a duplicate read. (`docs/brainstorms/2026-06-22-...-requirements.md` Run-treatment discussion.)
- **One surface: Transition only.** Run stays the one-cue cockpit; Drill Check stays the reflective beat. Both are revisit-after-dogfood, not permanently excluded. Founder steer: minimal, "we can see how it goes."
- **Placement default: unlabeled quiet line.** A `text-sm text-text-secondary` line with no eyebrow/label/chrome (shibui), sitting under the duration line and above the full `courtsideInstructions`. A faint "Working on" label was offered and not chosen; default stands.
- **Plain text, not glossed.** Render `intent` as plain text (no `GlossedText` tappable-term treatment) for the first slice; the strings are authored clean. Glossing can come later if dogfood wants it.
- **Per-block, drill-actual rung.** The line describes the rung the upcoming drill **actually sits on** (`stressRungForDrill(focus, nextBlock.drillId)`), not a derived ladder position or steering offer. It is an honest "this drill trains X," independent of any adaptation state.

---

## Actors

- **Self-coached amateur (primary).** Between blocks, reads the Up Next briefing on Transition and now also sees what the upcoming drill's stress rung trains before tapping Start.

## Key Flow

1. Athlete finishes a block; the run flow lands on Transition (or pre-start Transition for the next block).
2. The next block is a `main_skill` / `pressure` drill whose primary skill is pass / serve / set and which resolves to a stress rung.
3. Transition shows its existing Up Next briefing (role eyebrow, drill title, duration, full instructions, drill cue) **plus** the new quiet `intent` line naming what this rung trains.
4. For warmup / wrap / recovery / off-ladder next blocks, the line is absent and Transition reads exactly as it does today.

---

## Requirements

- **R1.** On the Transition screen, when the next block is a ladder-bearing block, render a single line sourced from the upcoming drill's rung `intent` string.
- **R2.** "Ladder-bearing" means: the block resolves to a primary skill focus of `pass` / `serve` / `set` (via the existing `getBlockSkillFocus`) **and** the block's `drillId` resolves to a rung on that focus's ladder (via `stressRungForDrill`). Any block that fails either check renders no line.
- **R3.** The rung is the one the upcoming drill **actually sits on** — not a derived position, steered focus, or verdict offer. No adaptation/offer state is read.
- **R4.** The resolution (block → `intent` string | null) is a **pure domain helper**, unit-tested at the domain tier; the Transition controller calls it and exposes a `string | null` to the screen. The screen stays thin (no catalog/ladder lookups in JSX), per the data-access layer rules.
- **R5.** Rendering is **null-safe**: a missing focus, off-ladder drill, unknown rung, or absent `intent` yields no line and never throws (Transition renders inside the run-flow body; a throw would trip the app-root ErrorBoundary).
- **R6.** The line is presentational only: no new persisted state, no Dexie schema change, no new route, no change to session assembly, adaptation, or export.
- **R7.** The line obeys the courtside-copy invariants on a user-visible surface (no em-dash; jargon glossed) — satisfied by the already-authored `intent` strings, which the taxonomy spec requires to obey those invariants.
- **R8.** Placement: a quiet secondary line (`text-sm text-text-secondary`), unlabeled, positioned under the duration line and above the full `courtsideInstructions`. Dual-focus drills resolve via the drill's **primary** skill focus (same source as the eyebrow), so the line and the eyebrow never disagree on focus.

## Acceptance Examples

- **AE1.** Next block is `d24 Pass into a Corner` (pass, rung 3). Transition shows the pass rung-3 `intent` ("Read where the ball is going, move to it, and still pass to one target.") as a quiet line under the duration. *(Covers R1, R2, R3, R8.)*
- **AE2.** Next block is a warmup drill (`d28`, off-ladder, no skill focus). Transition renders no `intent` line and is byte-identical to today's output. *(Covers R2, R5.)*
- **AE3.** Next block is a `set` drill on rung 1 (`d38`). The line reads the set rung-1 `intent`, not a pass/serve string and not a steered-position string. *(Covers R3.)*
- **AE4.** Next block resolves to a focus but the drill is off that focus's ladder (synthetic/legacy plan with an unknown `drillId`). No line renders; no error is thrown. *(Covers R5.)*
- **AE5.** A dual-focus drill (e.g. `d20`, primary `pass`) renders the line from its **pass** ladder rung, matching the eyebrow's `pass` label. *(Covers R8.)*

---

## Scope Boundaries

### Deferred for later (named follow-ons, not this slice)

- **`externalFocusCue` rendering** anywhere — held back to avoid duplicating the drill's `coachingCues[0]`.
- **Run cockpit treatment** — surfacing rung content inside Run's existing "Show more cues" disclosure (zero always-on text), revisit after dogfood if Transition-only proves insufficient.
- **Drill Check render** of any rung content.
- **"Easing is legitimate" `less`-offer read** on the Review verdict card (a `graduationFeel`-style felt read for down-steps). Named deferral carried from the `D161`/`D162` ship.
- **Safety-trace enrichment** with rung content (the pre-session steering trace). Named deferral carried from the `D157`/`D161` ship.
- **`GlossedText` treatment** of the `intent` line.

### Outside this product's identity

- Raw rung numbers / ladder positions never render to the athlete (`D157` holds).
- This line is not a coach-graded judgment, score, or pass/fail signal — it is descriptive technique-how framing only (`D154` gating stays retired).
- No coach-facing surface, no new analytics, no AI-generated copy.

---

## Dependencies / Assumptions

- **Depends on** the authored `intent` strings in `app/src/data/stressLadders.ts` (shipped 2026-06-21) and the accessors `stressRungForDrill` / `getStressRung`.
- **Depends on** `getBlockSkillFocus` (`app/src/domain/drillMetadata.ts`) for block → primary focus.
- **Assumes** the `StressLadderFocus` ↔ `EyebrowSkillFocus` correspondence holds (both are `Extract<SkillFocus, 'pass'|'serve'|'set'>`); the helper bridges the two type names without widening either.
- **Assumes** every scoped-tag catalog drill holds a rung (`D160` authoring invariant), so on-ladder main/pressure drills resolve a rung; the null path is for off-ladder/legacy/synthetic blocks only.

## Outstanding Questions

- **OQ1 (dogfood-gated).** Does the `intent` line read as additive depth, or does it feel redundant beside the drill's `objective` / `courtsideInstructions` on single-drill rungs? Resolve by founder dogfood; if redundant, this is the signal to either reword `intent` or pull it. Not a blocker to ship.
- **OQ2 (deferred-decision).** After dogfood, does technique-how want to extend to the Run disclosure and/or Drill Check, and does `externalFocusCue` earn a surface? Out of this slice by decision; revisit with dogfood evidence.
