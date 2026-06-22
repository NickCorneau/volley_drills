---
id: plan-2026-06-22-m002-2-progression-read-on-review
title: "feat: M002.2 progression read on Review (verdict-gated, Review-only)"
status: active
stage: build
type: plan
summary: "Render the authored per-rung felt content the adaptation engine already computes but never shows, inside Review's existing verdict-gated 'Next time' card: a reflective explorationCriterion line keyed to the rung actually trained, and a graduationFeel readiness line keyed to the offer position on step-up offers only. Pure render-time composition over authored data; no raw rungs (D157), movement stays user-accepted (D154), no schema/assembly change."
origin: docs/brainstorms/2026-06-22-m002-2-progression-read-on-review-requirements.md
last_updated: 2026-06-22
depends_on:
  - docs/brainstorms/2026-06-22-m002-2-progression-read-on-review-requirements.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/brainstorms/2026-06-11-stress-visibility-trust-loop-requirements.md
  - docs/decisions.md
  - app/src/data/stressLadders.ts
  - app/src/screens/review/useReviewController.ts
  - app/src/screens/ReviewScreen.tsx
  - app/src/domain/adaptation/acceptConsequence.ts
decision_refs:
  - D154
  - D157
  - D159
  - D160
---

# feat: M002.2 progression read on Review (verdict-gated, Review-only)

## Summary

The M002.2 stress-rung content layer (`intent`, `externalFocusCue`, `explorationCriterion`, `graduationFeel` per rung) is fully authored in `app/src/data/stressLadders.ts` but rendered nowhere — `docs/specs/stress-rung-taxonomy.md` records "Rendering is a deferred M002.2 UI pass." This slice surfaces two of the four fields at the one deliberate-reading moment that already carries stress copy: the Review "Next time" verdict card. It adds a reflective `explorationCriterion` line (what to notice about the rung just trained) and, on a step-up offer only, a `graduationFeel` readiness line.

It is a **step-moment trust + voice-validation slice**, not the delivery of M002.2's headline technique-how outcome — that depends on the deferred run-time half (`intent` + `externalFocusCue` on Run / Transition / Drill Check), which remains the same-milestone spine follow-on.

Scope decisions (founder, 2026-06-22): **verdict-gated** presence (only inside the conditional card) and **Review-only** surface. Both fixed; this plan builds within them.

## Problem Frame

`D154` shipped rung-steered assembly; `D157` made the steering legible at decision moments (the Review accept-consequence exemplar, the Setup steering line) under two rulings — no raw rungs render, present-tense only. But the per-rung *progression content* that gives a rung its meaning was deferred. So the athlete is offered "a bit more stress on serving" and shown the drill it would pick, but never what their current rung is about or what readiness to climb it feels like. This slice renders that felt content at the verdict moment, honoring both rulings (no raw rungs; the verdict choice stays the only acceptance).

## Why this is small (and where the review changed it)

The plumbing already exists: `useReviewController` loads `offeredDelta` + the derived ladder `offerPosition` via `loadVerdictOffer` and resolves the main-skill drillId for the accept-consequence. The four progression fields are authored. This is pure render-time composition.

A `ce-doc-review` pass (5 reviewers) hardened the design before build:

- **P1 keying fix.** The reflective "what you just trained" line must key off the rung the athlete *actually trained* (`stressRungForDrill(focus, mainSkillDrillId)`), NOT `offerPosition`. `offerPosition` is the derived ladder position and diverges from the trained drill's authored rung on off-target assembly landings (nearest-rung / duration-fit / substitute fallbacks fail quiet) and via review-time recomputation. Keying it off `offerPosition` would describe a rung never trained.
- The **readiness line stays keyed to `offerPosition`** (the offer's basis); R15 gating guarantees `offerPosition < max` on a rendered `more` card, so it is always the non-top "step up" text.
- **Crash guard.** The composer runs in the render body; an unguarded missing-rung lookup would trip the app-root ErrorBoundary and blank the whole Review screen. Null-safe, mirroring `composeAcceptConsequence`.

## Key Technical Decisions

- **KTD1 — two rungs, two jobs.** Reflective line = trained rung's `explorationCriterion` (what you just did); readiness line = offer-position rung's `graduationFeel` (where your position can step). In the common on-target case these are the same rung; on an off-target landing each stays individually honest.
- **KTD2 — `more`-only readiness.** `graduationFeel` renders only on `more` offers; suppressed on `less` (a step-up signal does not fit easing). The "easing is legitimate" read is a named follow-on.
- **KTD3 — data-only composer.** New `progressionRead.ts` reads only `STRESS_LADDERS` (via `getStressRung`); imports nothing from `sessionAssembly/` (unlike `acceptConsequence.ts`, which calls `findCandidates`). Keeps the "no assembly logic" claim true.
- **KTD4 — no raw rungs, no new state.** Honors `D157`/`D154`; no Dexie/schema/route/persisted-field/assembly change; diagnostics report stays current.

## Implementation Units

### U1 — `getStressRung` accessor

- **Files:** `app/src/data/stressLadders.ts`
- **Approach:** add `export function getStressRung(focus: StressLadderFocus, rung: number): StressRung | undefined` over the inline `.find(r => r.rung === …)` pattern used in `acceptConsequence.ts`.
- **Test scenarios:** covered indirectly by U2; optionally a 1-line unit assertion (known rung returns object; out-of-range returns undefined).

### U2 — pure composer `progressionRead.ts`

- **Files:** `app/src/domain/adaptation/progressionRead.ts` (NEW); `app/src/domain/adaptation/__tests__/progressionRead.test.ts` (NEW)
- **Approach:** mirror `acceptConsequence.ts` shape. Signature:
  `composeProgressionRead({ focus: ScopedFocus, trainedRung: number | undefined, offerPosition: number, direction: StressDirection }) => { reflection: string | null; readiness: string | null }`.
  - `reflection = getStressRung(focus, trainedRung)?.explorationCriterion ?? null` (undefined `trainedRung` → null).
  - `readiness = direction === 'more' ? getStressRung(focus, offerPosition)?.graduationFeel ?? null : null`.
  - Never throws.
- **Test scenarios:** reflection sourced from `trainedRung` not `offerPosition`; readiness present on `more`, null on `less`; null on undefined `trainedRung` / out-of-range rung.

### U3 — controller wiring

- **Files:** `app/src/screens/review/useReviewController.ts`
- **Approach:** inside the existing `isScopedFocus`-narrowed branch (do NOT reuse the `acceptConsequenceLine` guard wholesale — it requires `plan?.context`, which this does not need): resolve `trainedRung = stressRungForDrill(focus, mainSkillDrillId)` from the already-resolved main-skill drillId; if multiple `main_skill` blocks resolve to different rungs, pass `trainedRung: undefined`. Call `composeProgressionRead`; expose `progressionReflectionLine` + `progressionReadinessLine` on the returned object literal.
- **Test scenarios:** covered by U5 (screen-level).

### U4 — render in the "Next time" card

- **Files:** `app/src/screens/ReviewScreen.tsx`
- **Approach:** destructure the two lines; render inside `{verdictLine && (…)}`. Reflective line grouped tight under the carry-forward; readiness line grouped near the choice. Quiet `text-xs text-text-secondary`, proximity-grouped, no labels/chrome. Readiness line NOT wired into the "Try it" `aria-describedby` (accept-consequence stays the single described consequence).
- **Test scenarios:** covered by U5.

### U5 — Review screen tests (DB-seeded)

- **Files:** extend `app/src/screens/__tests__/ReviewScreen.verdict.test.tsx`
- **Approach:** these tests seed `fake-indexeddb` with real services — do NOT mock `loadVerdictOffer`. Add fixtures:
  - (a) a `more`-offer session (only `less` is covered today) asserting both lines render with the expected copy;
  - (b) a **divergence** fixture where the trained drill's authored rung ≠ `offerPosition`, asserting the reflective line renders the **trained** rung's copy (pins the P1 fix; without it the assertion is tautological);
  - (c) `less`-offer → reflection only, no readiness;
  - (d) `keep` / non-scoped focus → neither line (card hidden / no offer).

### U6 — scoped courtside-copy sweep

- **Files:** extend `app/src/data/__tests__/drillCopyRegressions.test.ts` (or a sibling alongside `stressLadders.test.ts`)
- **Approach:** run the gloss/jargon invariants over the **two rendered fields only** (`explorationCriterion`, `graduationFeel`) across all rungs. NOT a whole-`STRESS_LADDERS` grep — the file's comments carry em-dashes and `externalFocusCue` carries a correctly-glossed "set window" a naive sweep would false-flag. Em-dash on all four fields is already covered by `stressLadders.test.ts`.

### U7 — docs + decision

- **Files:** `docs/specs/stress-rung-taxonomy.md`, `docs/decisions.md`, `docs/status/current-state.md`, `docs/catalog.json`
- **Approach:** flip the taxonomy spec's "Rendering is a deferred M002.2 UI pass" note to record the Review render (which two fields, verdict-gated, trained-rung vs offer-position keying; run-time `intent`/`externalFocusCue` still deferred). Add a decision row (next id, ~`D161`) recording scope (verdict-gated + Review-only), the keying split, no-raw-rung preserved, and the named deferrals. Add a current-state shipped-history entry. Register the requirements doc + this plan in `docs/catalog.json`. Run `bash scripts/validate-agent-docs.sh`.

## Verification

- `npx vitest run` (full suite green) + `npx tsc --noEmit` + `npm run lint`.
- `npm run diagnostics:report:check` (stays current — render-only proof).
- `bash scripts/validate-agent-docs.sh`.
- 390px mobile dogfood: seed an accepted-verdict history to trigger a `more` offer and a `less` offer; confirm the card reads as one calm arc and the reflective line names the trained rung's content; tune grouping/`Disclosure` if it reads heavy.

## Risks & Mitigations

- **Off-target / temporal rung divergence** → reflective line keyed to the trained drill's rung + fail-quiet (U2/U3); divergence fixture (U5) pins it.
- **Whole-screen crash on missing rung** → null-safe composer + `isScopedFocus` narrow (U2/U3).
- **Card density on `more`** → proximity grouping, quiet styling, `Disclosure` fallback (U4); founder dogfood checkpoint.
- **`less` offers feel like a demotion** → accepted risk this slice; "easing is legitimate" read is a named follow-on.

## Out of Scope (named follow-ons)

- Run-time technique-how half (`intent` + `externalFocusCue` on Run / Transition / Drill Check) — the M002.2 spine follow-on.
- "Easing is legitimate" felt read on `less` offers.
- Safety steering-trace rung enrichment.
- Always-on reflective read on no-step sessions.
- `M002.3` objective "1% better" score.
