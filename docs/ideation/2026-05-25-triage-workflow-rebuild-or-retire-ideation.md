---
date: 2026-05-25
topic: triage-workflow-rebuild-or-retire
focus: D47/D05/D01/D49 diagnostic-triage chain post-R1/v8
mode: repo-grounded
---

# Ideation: Triage Workflow Rebuild or Retire

## Grounding Context

**Codebase context.** The 2026-05-24 session-duration-honesty slice (commits `1944e48` → `8adefbd`, shipped 2026-05-25) retired the `redistributedMinutes` path that produced the legacy `optional_slot_redistribution + over_authored_max + over_fatigue_cap` group-key fingerprints. Under v8, no real session produces those keys — R2 caps prevent it by construction.

The diagnostic-triage layer at `app/src/domain/generatedPlanDiagnosticTriage.ts` (4552 lines) carries ~25 build/format functions that pivot on those legacy keys: the gap-closure ledger, D47 proposal admission, D01 cap/catalog fork packet, D47-D05 comparator decision packet, gap-closure selection workbench, D49 residual follow-up, D49 U8 generator-policy proof, and the D49 generator-policy proposal (D140). All functionally inert under v8. The associated test file marks 50 tests `.skip` with an explanatory marker pointing at this open question.

The new finding shape (`slot_dropped` + `under_named_profile_duration` → `coverage_gap_review` lane) is wired in routing but has no packet/build/format functions. D140 (2026-05-07 D49 generator-policy proposal) is downstream decision-debt referring to a workflow that no longer fires.

**External signal.** Five independent literatures converge on retire-before-rebuild for single-reader internal observability: feature-flag two-PR retirement (Featureflip / PostHog / Oneuptime); ESLint `meta.deprecated` + `replacedBy` schema; Delete-Driven Design with measured impact (35% build-time drop, halved bug reports); local-first "observability for one" converges on "thin projection of an event log, never deep workflow chain" (Claude Observatory, BEKO2210/My_Dash); strangler-fig only applies when new shape is isomorphic to old (not the case here).

**Internal signal.** `docs/solutions/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` is the canonical retire-a-downstream-surface-after-upstream-simplification template (directly applicable). `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` (just updated 2026-05-25 with the fifth addendum) demonstrates that selection-path wiring is the load-bearing half of any retirement — validated by U3 rewire in the just-shipped slice. Founder-use D130 single-reader sizing through 2026-07-20 argues against rebuild-flavored solutions.

**Constraints.** D130 founder-use mode (single-reader). Architecture: `app/src/domain/` stays pure (no React/Dexie). AGENTS.md: calm-by-default. `coverage_gap_review` routing exists; only workflow wiring missing.

---

## Ranked Ideas

### 1. Replaced-By Stubs (`~90%` reduction with audit trail)

**Description:** Replace each of the ~25 inert build/format function bodies in `generatedPlanDiagnosticTriage.ts` with a one-line `throw replacedBy('coverage_gap_review', { since: '2026-05-24', decision: 'D147' })` forward-pointer. The file shrinks from 4552 lines to ~600 while every retired entry-point keeps a discoverable tombstone. Future `grep` for `slot_dropped` or any v7 finding-kind hits a stub that reads its way to the new lane.

**Warrant:** `external:` ESLint formalizes rule retirement via `meta.deprecated` + `replacedBy` schema. The schema carries `message`, `replacedBy`, `deprecatedSince`, `availableUntil` — structured retirement with a forward-pointer. Source: [ESLint Rule Deprecation docs](https://eslint.org/docs/latest/extend/rule-deprecation).

**Rationale:** Solves the `4000-lines-of-inert-code` carrying cost (file-size violation of calm-by-default, context-window tax on agent assistance, signal corrosion from 50 `.skip`'d tests) AT THE COST OF a single line per retired function. Strictly better than scorched-earth on audit-trail preservation: future archaeology asks "where did slot_dropped go?" and answers in 5 seconds via `grep`, not via git spelunking.

**Downsides:** Stubs aren't code-free — they cost a few KB and one signature each. A future contributor could be misled into thinking the stubs are live API. (Mitigation: the stub body throws, so any caller fails loud.)

**Confidence:** 90%

**Complexity:** Low (one mechanical PR; ~1-2 hours to write the stubs)

**Status:** Unexplored

---

### 2. D137-Template Decision-Debt Sweep (D04 / D05 / D47 / D49 / D140)

**Description:** Apply the canonical D137 tune-today retirement template (`docs/solutions/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md`) to the cluster of legacy decisions whose underlying mechanism is now gone: D04 (two-pass redistribution), D05 (passing variant comparator anchor), D47 (setting/attack chain anchor), D49 (default touch-target — actually wait, D49 = touch-target baseline, NOT the redistribution one... let me name the actual ones: D04, D47, D05, plus D140 (2026-05-07 D49 generator-policy proposal). Mark each as superseded by D147 "duration-honesty retirement" with a one-paragraph eulogy: birth date, death date, cause-of-death, what survives, what is buried. The sweep happens in one PR against `docs/decisions.md`.

**Warrant:** `direct:` `docs/solutions/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` exists as the canonical template for this exact shape; learnings researcher confirmed it is directly applicable. `docs/decisions.md` line 164 D140 is the explicit decision-debt instance.

**Rationale:** Decision-debt compounds: every future reader of `docs/decisions.md` or the triage file has to mentally annotate "wait, is this still live?". Closing the cluster in one batched pass leverages the existing D137 template (zero new pattern needed), turns 5 mental annotations into 0, and produces an audit-replayable record that future retirements can cite.

**Downsides:** Requires reading and confirming the cause-of-death for each decision (~30-60 minutes of careful curation per decision). Adds ~5 new short entries to `docs/decisions.md` via the supersession pattern (immutable original + supersession entry).

**Confidence:** 85%

**Complexity:** Low-Medium (mechanical application of D137 template; care required per-decision)

**Status:** Unexplored

---

### 3. Mothball Cat A/B/C for the 50 Skipped Tests

**Description:** Grade each of the 50 `.skip`'d tests in `generatedPlanDiagnosticTriage.test.ts` explicitly: **Cat A** (likely reactivation under future v9-class shape — keep with a passing smoke test exercising the call signature), **Cat B** (parts donor — extract one or two helpers into the new `coverage_gap_review` workflow), or **Cat C** (scrap; delete with the corresponding stub). Force the real-versus-aspirational distinction explicitly. The Cat-A smoke tests stay green; Cat-B helpers migrate; Cat-C tests get deleted alongside their stubs.

**Warrant:** `reasoned:` Naval mothball-fleet practice solves "capability we no longer use but might need" via graded preservation (Cat A rotated maintenance, Cat B parts donors, Cat C scrap) precisely because aspirational preservation without verification degrades into rust. The same shape applies: 50 `.skip`'d tests with no smoke verification are aspirational preservation; they'll silently rot until someone tries to reactivate them and discovers the surrounding context has moved.

**Rationale:** Without per-test grading, the 50 tests are nominal preservation with zero recoverability evidence — a false sense of safety net. Grading forces a real Cat A claim (and pays the cost of keeping it green) or admits Cat C (and deletes it). No third option, no maybe.

**Downsides:** Cat-A smoke tests cost a few seconds of test runtime each (negligible). Founder time to grade 50 tests is ~2-3 hours.

**Confidence:** 75%

**Complexity:** Medium (per-test review with rationale)

**Status:** Unexplored

---

### 4. Three Gaps — Capture markdown-as-API + test-skip discipline + decision-debt sweep patterns

**Description:** Write three new `docs/solutions/` pattern docs in one PR, filling the three named gaps the learnings researcher flagged: (a) **markdown-as-API choice** — when to keep TypeScript builders for markdown vs emit markdown directly (the just-shipped slice is fresh evidence); (b) **test-skip discipline** — when `.skip` is acceptable, what markers must accompany it, how long it can live, when to delete; (c) **batched decision-debt sweep** — the workflow for applying D137-template retirement to a cluster of decisions in one pass (instance: Survivor 2 above is the worked example). Three docs, ~1-2 pages each.

**Warrant:** `direct:` The learnings researcher's explicit absence-detection: "Gaps in `docs/solutions/`: NO patterns on markdown-as-API choice, test-skip discipline, decision-debt sweeps". The current slice gives lived evidence for all three.

**Rationale:** Pattern docs in `docs/solutions/` are the founder's leverage substrate — future ce-learnings-researcher dispatches return them, future ideation grounds in them, future planning cites them. Writing them while the lived evidence is fresh costs little and compounds across every future similar question. The current slice is unusually generative on all three axes; deferring the writeup loses the recency-grounded clarity.

**Downsides:** Three new docs (~3-4 pages total) to maintain. Some risk of premature pattern fixation if the gaps are filled before a second instance validates the pattern.

**Confidence:** 80%

**Complexity:** Low (writing + light review)

**Status:** Unexplored

---

### 5. Scorched-Earth Retirement PR (the floor case)

**Description:** One PR that deletes the ~25 legacy group-key build/format functions, the v7 fingerprint emission paths, and the 50 `.skip`'d tests outright. No new abstractions, no replaced-by stubs, no preservation. Pure subtraction. Target: ~3000-3500 LOC removed; file under 1000 lines; test count drops without coverage drop because the skipped tests exercise dead branches.

**Warrant:** `external:` "Delete-Driven Design" (ByteCrafted) and the "40K mass-delete" playbook (DEV) report measured impact: 35% build-time drop, halved bug reports the month after, deletions behind permanently-off feature flags are a specific category. The same shape applies under R1.

**Rationale:** Establishes the deletion floor against which every cleverer option must justify its complexity. If subtraction alone resolves the carrying-cost concerns, no other survivor is needed. Worth keeping as a candidate even if Survivor 1 (replaced-by stubs) wins, because the floor case bounds the comparison.

**Downsides:** Loses the forward-pointer audit trail Survivor 1 preserves; future archaeology requires git spelunking. Loses a discoverable "where did slot_dropped go?" hit.

**Confidence:** 70% (lower than Survivor 1 because audit trail matters for founder-use single-reader memory across weeks)

**Complexity:** Very Low (single subtractive PR)

**Status:** Unexplored

---

### 6. Decision Epitaphs (forcing function for completeness)

**Description:** Adopt a policy: every retired entry in `docs/decisions.md` must gain a one-line epitaph: birth date, death date, cause of death. Example: `D04: Two-pass redistribution. b. 2026-04-18 → d. 2026-05-24. Cause: duration-honesty made minute redistribution dishonest by definition.`. A lint rejects retirements without an epitaph; the ledger becomes a 30-second-scannable graveyard with diagnosable patterns surfacing (e.g., "duration-honesty" as a recurring cause-of-death).

**Warrant:** `reasoned:` Constraint-flipping "retirements are quiet bookkeeping" to "every retirement is ceremonially buried." The design that falls out is a forcing function for completeness plus a one-line summary that doubles as future-archaeology fuel AND pattern-spotting fuel. Once recurring causes-of-death surface (e.g., `duration-honesty` retiring three decisions in one slice), they become design signal for "what mechanism is fragile".

**Rationale:** D04/D05/D47/D49/D140 retirements risk leaving residue partly because nothing forces a "what did we lose and why" sentence. Epitaphs make the cost legible and let recurring causes-of-death (which we now have evidence for) surface as design signal.

**Downsides:** Adds a lint and a small writing tax per retirement (~5 minutes per epitaph). Could be ceremonial if the founder is the only reader; the value compounds with future contributors.

**Confidence:** 65% (lower because adjacent to Survivor 2 which already does retirement annotation for the current cluster; epitaphs are the ongoing policy)

**Complexity:** Low-Medium (policy + lint + initial backfill)

**Status:** Unexplored

---

### 7. Single-Lane Monoculture (collapse to `coverage_gap_review`)

**Description:** Retire `slot_dropped` and `under_named_profile_duration` as separate emission lanes; collapse them into `coverage_gap_review` with a `kind` discriminator. The ~25 pivot functions become one switch over `kind`; the file collapses to a single render path. Anything that doesn't fit the coverage-gap shape gets dropped on the floor for one week; we find out fast whether anything is missed.

**Warrant:** `reasoned:` Constraint-flipping "multi-lane taxonomy is valuable" to "exactly one lane is allowed." The design that falls out tests whether multi-lane is load-bearing or accidental residue from the v7 contract. If nothing surfaces a gap for two weeks, the consolidation sticks and 4000+ lines never return in another shape.

**Rationale:** Tests the assumption that `slot_dropped` and `under_named_profile_duration` need to be separate diagnostic codes. Under R1 they're both "coverage gap" signals; the distinction may be over-engineered for a single reader who just wants to know "where is the catalog thin?".

**Downsides:** Loses analytical granularity (per-slot vs per-session evidence collapse into one stream). Some future diagnostic categories may genuinely want their own lane and this collapse forecloses easy expansion.

**Confidence:** 55% (lower because the multi-lane shape is recent; not enough field evidence to know if the distinction matters)

**Complexity:** Medium (refactor + verify routing + update diagnostics report fixtures)

**Status:** Unexplored

---

## Cross-Cutting Bundle

### CC1 (Recommended): The Retire-and-Compound Bundle

Combine Survivors 1 + 2 + 3 + 4 into one coherent slice:

- **Replaced-By Stubs (S1)** — core code retirement with audit trail
- **D137-Template Decision-Debt Sweep (S2)** — close D04/D47/D05/D140 alongside the code retirement
- **Mothball Cat A/B/C (S3)** — grade the 50 skipped tests; Cat-A stays green, Cat-B migrates, Cat-C deletes with the stub
- **Three Gaps pattern capture (S4)** — institutional learning compounds while evidence is fresh

These four moves are mutually reinforcing: the code retirement gives the decisions a clear superseded-by anchor; the test grading prevents the `.skip` marker from rotting; the pattern docs capture the workflow for future similar retirements. Estimated total: one 2-3 day pass.

### CC2 (The floor): Survivor 5 alone

If the bundle is over-scoped, the minimum viable retirement is the scorched-earth PR. Loses audit trail but resolves the carrying cost in one decisive move. Worth keeping in the option set as the ambition floor.

### CC3 (The structural play): Survivors 6 + 7

If the founder wants to invest in architectural reset, combine the single-lane collapse with the decision-epitaph policy. Higher upfront cost; compounds in future diagnostic categories. Defensible but probably premature given the slice just shipped.

---

## Rejection Summary

40 candidates rejected (47 raw → 7 survivors). Reasons grouped:

| Category | Candidates | Reason |
|---|---|---|
| Pain observations (frame 1) | F1.1-F1.8 (8) | Diagnostic observations of the carrying cost, not actionable moves. Absorbed as motivation for survivors 1, 2, 3, 5 |
| Speculative pipeline plays | F2.3 (weekly digest), F2.4 (questions.md), F3.1 (prompt-compiler), F3.3 (learning-input), F3.8 (backlog-generator), F4.8 (typed handoff), F6.3 (findings-as-PRs), F6.8 (agent-stream) | Forward-looking pipeline plays solving hypothetical future problems; current slice isn't the moment for new pipeline contracts |
| Over-engineered rebuilds | F2.2 (YAML-as-policy), F3.2/F4.1 (event-log projection), F4.2 (canonical Finding schema), F4.3 (renderer registry), F4.4 (generic lane) | External signal converges strongly against rebuild-flavored solutions for D130 single-reader; abstraction-first moves are over-engineered |
| Absorbed into stronger survivors | F2.1, F3.7 (full-delete → S5); F2.7, F3.6, F5.2, F5.7 (replaced-by variants → S1); F2.6 (two-PR retirement → S1+S5); F5.4 (Falsework timing → S5 timing); F3.4 (four-Ds-as-one → S2); F5.6 (MUSTIE → S3 mothball Cat A/B/C); F3.5 (Relocate → subsumed by F5.1 preservation pattern) | Stronger more-specific candidate covers the same move |
| Preservation without clear use | F5.1 (Pseudogene archive), F5.5 (Köchel catalog), F6.7 (Frozen Fixture Archive), F5.3 (Kintsugi wiring) | Git history already preserves the code; explicit archives add cost without clear use for founder-mode single-reader |
| Too aggressive structural change | F6.5 (Inline Decision Ledger) | Deletes `docs/decisions.md`; out of slice scope |
| Covered by stronger move | F2.5 (fix upstream emitter) | Upstream emitter is the new `coverage_gap_review` finding; consumer-side retirement is S1/S5 |

---

## Recommended Next Step

Brainstorm CC1 (the Retire-and-Compound Bundle) as the one to convert into a plan. Survivors 5, 6, 7 stay in the option set as alternatives. The bundle compounds: 4 moves landing together produces institutional patterns (S4), decision-debt closure (S2), code retirement with audit trail (S1), and explicit test-fate grading (S3) — each adds to the slice's gravity.
