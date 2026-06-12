---
title: "docs: Ratify the Home covenant — decision row, canon, routing, render budget"
type: docs
status: complete
date: 2026-06-12
origin: docs/brainstorms/2026-06-11-home-covenant-requirements.md
---

# docs: Ratify the Home covenant — decision row, canon, routing, render budget

## Summary

Ratify the Home covenant in one pass: a decision row (`D156`) recording Home's identity and the five rules, an operational fold-in to canon §7.1 carrying the six-claimant lane ledger as its single canonical home, registration across the agent routing surfaces, and one screen-tier render test pinning the steady-state Home budget. Zero UI changes.

---

## Problem Frame

D152 absorbed the derived plan into the `last_complete` card, spending Home's last focal capacity; card-interior creep recurred within six days and was caught only by a manual design pass. Six M002 claimants are queued, and milestones increasingly ship through agent sessions without a full design walk. The origin brainstorm (`docs/brainstorms/2026-06-11-home-covenant-requirements.md`) converged on standing rules plus inherited default lanes, enforced by a minimal render test and agent-routing registration rather than per-milestone negotiation.

---

## Requirements

**Ratification**

- R1. `docs/decisions.md` gains one decision row (`D156`) ratifying the covenant: the identity sentence, the five rules, the D151 scheduled-tenancy contract, and the named escalation triggers (origin R1–R6, R8, R10). The row names canon §7.1 as the ledger's canonical home.
- R2. `docs/research/brand-ux-guidelines.md` §7.1 carries the operational covenant — identity, rules, the six-claimant default-lane ledger table, and the tenancy contract — citing `D156` (origin R7). Existing §7.1 content is reconciled in place, not duplicated.

**Registration**

- R3. The covenant is registered in the agent routing surfaces — `docs/catalog.json`, the `AGENTS.md` cold-start guidance, and a pointer in `.cursor/rules/component-patterns.mdc` — and `bash scripts/validate-agent-docs.sh` passes (origin R11).

**Enforcement**

- R4. A screen-integration render test pins the steady-state Home budget — element census, tap-target count, card-interior line cap — for the `last_complete` primary state with the periphery dark, plus a second case pinning the skipped-tail card variant (origin R9; enforces origin AE4). Budget values are named constants citing `D156`.

Origin acceptance examples AE1–AE3 and AE5 are governance behaviors enforced by the recorded rules at plan-review time, not by code; AE4 is the code-enforceable one and lands in R4.

---

## Key Technical Decisions

- **Ledger home is canon §7.1; the decision row ratifies by reference.** Decision rows are single-line table cells — a six-lane table cannot sit inside one legibly — and §7.1 is what agents load for design work. `D156` summarizes the lanes in prose and points to §7.1 as canonical. (Resolves the origin's deferred ledger-location question; confirmed at synthesis.)
- **Covenant text lands only in `brand-ux-guidelines.md`.** `docs/research/japanese-inspired-visual-direction.md` self-describes as experimental and non-canon; it stays untouched. §4.2's focal-zone table may gain a one-line cross-reference to the §7.1 covenant if it reads naturally, nothing more. (Confirmed at synthesis.)
- **Rules pointer ships now, in the existing rule.** One line in `.cursor/rules/component-patterns.mdc` — the rule agents load when editing `app/src/components/**` — rather than a new rule file or waiting for evidence agents miss the covenant. Agent-shipped milestone work is the exact threat model. (Confirmed at synthesis.)
- **Test sits at the screen-integration tier, one file, mechanically countable pins only.** Per `.cursor/rules/testing.mdc` the pyramid reserves screen tier for what lower tiers can't prove; a whole-Home census qualifies. Following the drill-copy lint-test precedent (`docs/solutions/2026-05-10-drill-first-time-runnability-system.md`), the test pins only countable properties (elements, tap targets, card-interior lines) and leaves judgment aspects of the covenant to review. Domain precedence is not re-proven — `app/src/domain/homePriority.test.ts` owns it.
- **Budget numbers come from the shipped census at implementation time.** Reconnaissance puts the normal steady state at 4 tap targets (3 card actions + Settings footer link) and a 5–6 element-line card interior, with the skipped-tail variant at 5 targets and up to 7 lines; these are directional. The implementer pins the values the rendered census actually produces, so the test asserts reality rather than an invented target.
- **All routing surfaces sync in the same pass.** Decision row, canon, catalog, `AGENTS.md`, and the rules pointer land together, then the validator runs — per the repo's recurring-failure-mode learning (`docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`).

---

## Implementation Units

### U1. Decision row D156 and decision-debt sweep

- **Goal:** Record the covenant ratification as `D156` in `docs/decisions.md`.
- **Requirements:** R1 (origin R1–R6, R8, R10).
- **Dependencies:** none.
- **Files:** `docs/decisions.md`.
- **Approach:** One row in the Decided table following the `D153` stylistic template (bold headline sentence ending with the date, bold sub-labels, an explicit authorization boundary). Content: the identity sentence in the founder's words; the five rules in compressed form; the D151 scheduled-tenancy contract (capability-semantics test, lifecycle precedence, post-session exclusion, inherited render budget); the R10 named triggers; pointers to §7.1 as ledger home and to the render test as enforcement. Sweep `docs/decisions.md` by mechanism names (Home, focal, primary card, periphery) for prior rows the covenant constrains — expected outcome is forward-pointer annotations (likely `D152`), not supersession, per `docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md`. Bump frontmatter `last_updated`.
- **Test scenarios:** Test expectation: none — doc edit; verified by review against the origin doc (the validator only checks frontmatter structure on `docs/decisions.md`, not row content).
- **Verification:** Row reads as one self-contained ratification; origin R1–R6/R8/R10 each traceable to a clause; prior-row annotations point forward to `D156`.

### U2. Canon fold-in to §7.1

- **Goal:** Make `brand-ux-guidelines.md` §7.1 the operational home of the covenant and the canonical home of the lane ledger.
- **Requirements:** R2 (origin R7).
- **Dependencies:** U1 (cites `D156`).
- **Files:** `docs/research/brand-ux-guidelines.md`.
- **Approach:** Add a covenant subsection under §7.1: identity sentence, the five rules in operational form, the six-lane ledger table (verbatim lanes from the origin doc), the tenancy contract summary, and the R10 triggers — each citing `D156`. Reconcile the existing §7.1 bullets in place (the one-primary-card precedence bullet becomes the covenant's lifecycle-only rule rather than a duplicate). Amend the §4.2 focal-zone table's Home row to note the scheduled-tenancy exception per the §7.1 covenant — otherwise §4.2 keeps asserting precedence-only selection while §7.1 ratifies the D151 exception class. Update both of the doc's own routing surfaces: add Home presence / focal-slot admissibility to the top Agent Quick Scan use-when list and to §13's "Authoritative for" line. Bump frontmatter `last_updated`.
- **Patterns to follow:** the existing §7.1 D152 fold-in (card internals recorded operationally with a decision-row citation).
- **Test scenarios:** Test expectation: none — doc edit; verified by the origin-trace check (the validator only checks structure, not content).
- **Verification:** A reader landing on §7.1 gets the full covenant without opening `docs/decisions.md`; no contradicting bullet remains.

### U3. Routing-surface registration

- **Goal:** Agent-shipped milestone work loads the covenant before touching Home.
- **Requirements:** R3 (origin R11).
- **Dependencies:** U1, U2, U4 (registers what they created, including the render-budget test).
- **Files:** `docs/catalog.json`, `AGENTS.md`, `.cursor/rules/component-patterns.mdc`.
- **Approach:** Catalog: update the `brand-ux-guidelines` entry's `canonical_for` to name the Home covenant and ledger; annotate the `home-covenant-requirements-2026-06-11` entry as ratified by `D156`; confirm the existing `home-covenant-ratification-plan-2026-06-12` entry (added at plan authoring — do not duplicate it). `AGENTS.md`: extend the Design/UX cold-start pack line so the covenant is named (not just implied by the canon doc), and add a Learned Workspace Fact naming `D156`, the §7.1 ledger, and the render-budget test. Rules: one pointer line in `component-patterns.mdc` scoped to Home/focal-surface work. Then run `bash scripts/validate-agent-docs.sh`.
- **Test scenarios:** Test expectation: none — routing edits; the validator mechanically checks the catalog edits (paths, status vocabulary, structure); the covenant pointers in `AGENTS.md` and `component-patterns.mdc` are verified by the manual reachability check.
- **Verification:** Validator passes; the covenant is reachable from catalog, `AGENTS.md`, and the component rule without reading the brainstorm.

### U4. Steady-state render-budget test

- **Goal:** Pin the steady-state Home budget so census creep fails CI instead of waiting for a manual design pass.
- **Requirements:** R4 (origin R9; enforces origin AE4).
- **Dependencies:** U1 (constants cite `D156`).
- **Files:** `app/src/screens/__tests__/HomeScreen.render-budget.test.tsx` (new).
- **Approach:** Screen-integration tier: seed a completed session plus its submitted review (the `seedLastComplete` shape in `app/src/screens/__tests__/HomeScreen.precedence.test.tsx` — a completed log without a review row resolves to `review_pending`, not `last_complete`), with no accepted next-time delta on the review and no per-drill captures, so the periphery stays dark (no carry-forward cell, no consistency callout, no felt-difficulty lines). Reuse the `renderHome` helper pattern. Counting rules, since jsdom does no layout: a tap target is an enabled interactive element (button or link); a card-interior line is a rendered text-bearing row of the card region (paragraphs and action labels each count once; visual wrapping does not multiply the count); the element census is the count of top-level Home regions (app bar, primary card region, Recent sessions block, footer), asserted via role/region queries. Budget values live as named constants at the top of the file with a comment citing `D156` and the amendment rule (exceeding the budget means evicting an element or amending via decision row).
- **Patterns to follow:** `HomeScreen.precedence.test.tsx` (seeding + `MemoryRouter` setup); `app/src/data/__tests__/drillCopyRegressions.test.ts` (mechanical-pin discipline).
- **Test scenarios:**
  - Covers AE4. Happy path: steady-state Home renders exactly the budgeted number of enabled tap targets (directionally 4: three card actions plus the Settings footer link) — an added tertiary link fails the count.
  - Happy path: steady-state Home renders exactly the budgeted element census of top-level regions — a new section outside the budget fails the count.
  - Happy path: the `Train again` card region renders at most the budgeted number of card-interior lines (directionally 5–6 under the counting rule above).
  - Happy path: a second seeded case pins the skipped-tail variant (the densest the card gets — the creep incident's surface): a completed log with skipped blocks and at least `REPEAT_SUBSET_MIN_MINUTES` trained renders exactly the budgeted 5 tap targets and stays within the variant's line cap (directionally 7). Named "skipped-tail", not "ended-early": the third link keys on the skipped-blocks predicate, so deliberate wraps with `completed` status also render it.
  - Edge: periphery is dark — no carry-forward cell, no consistency callout, no felt-difficulty lines render when their conditions are absent.
  - Guard: the test does not assert lifecycle precedence (owned by `homePriority.test.ts`) and does not assert copy beyond what identifies the budgeted elements.
- **Verification:** New test passes alongside the existing suite; lint and typecheck clean; deliberately adding a fourth tertiary link locally fails the tap-target case.

---

## Scope Boundaries

**Deferred for later** (consolidated from the origin doc)

- The game-time observation input seam — queued as the next brainstorm; the strongest trust lever surfaced in dialogue.
- The kura/Progress destination, focal-occupancy policy extraction, peripheral-line collapse, plan-phrasing composition rule, and full CI ledger machinery — each waits behind its named R10 trigger.
- Custom-escape polish; the =1 vs ≤1 focal question; the "Why this session?" disclosure (evidence-gated on founder-use signals of doubted recommendations).
- The D151 check-in card's second render-test case — lands when D151 ships.

**Outside this product's identity** (carried from origin)

- A dashboard Home: steady-state progress numbers, comparative stats, or engagement-bait surfaces.
- Mandatory input gates anywhere on the pre-session path.
- Guilt surfaces (streak pressure, missed-week framing) on Home.

### Deferred to Follow-Up Work

- Capture the budget-test pattern in `docs/solutions/` after it lands (no prior learning covers count-pinning render tests).

---

## Sources / Research

- `docs/brainstorms/2026-06-11-home-covenant-requirements.md` — origin; carries the covenant text, ledger lanes, and acceptance examples verbatim.
- `docs/ideation/2026-06-11-home-focal-headroom-ideation.md` — the solution-space scan and external prior-art digest behind the covenant approach.
- `docs/design/reviews/2026-06-11-red-team-design-language-review.md` and `docs/design/reviews/2026-06-11-design-language-deep-pass.md` — the B− focal-competition grade and the card-interior creep incident motivating enforcement.
- Reconnaissance (this plan): steady-state census from `app/src/components/home/LastCompleteCard.tsx` and `app/src/screens/HomeScreen.tsx` composition — 4 tap targets and a 5–6 line card interior normal / 5 targets and up to 7 lines in the skipped-tail variant, secondary rows empty in steady state, Recent sessions passive with zero tap targets; next decision ID `D156`; `D153` as the row's stylistic template.
- `docs/solutions/workflow-issues/rescope-milestone-into-series-when-evidence-undercuts-premise.md`, `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`, `docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md`, `docs/solutions/workflow-issues/2026-05-25-test-skip-discipline.md`, `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` — the one-pass sync, sweep, skip-discipline, and mechanical-pin learnings this plan follows.
