---

## id: tier1b-serving-setting-expansion-2026-04-22
title: "Tier 1b: Serving + Setting content expansion (trigger-gated)"
type: plan
status: complete
stage: shipped
authority: "Tier 1b drill content expansion per `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 218-224 and 270-285. Layer A only — drill authoring and progression-link work with correct level metadata. No `pickForSlot` filter changes, no `findSwapAlternatives` filter changes, no progression-follow level gating, no SetupScreen surfaces, no `archetypes.ts` skillTags widening, no Dexie migration. Any 'Layer B' or 'Layer C' work (level-aware assembly / progression filtering) is NOT in this plan and requires a separate decision per the 2026-04-22 red-team of the prior Tier 1b+ draft."
summary: "4 new drill records (serving ladder: `d31`, `d33`; setting chain: `d40`, `d42`), progression links on `chain-6-serving` and `chain-7-setting` with the red-team-identified dead-end fixes, plus BAB-vocabulary discipline applied to the new drills. Each current drill fits the existing `Drill` and progression data structures; no schema, assembly-filter, SetupScreen, or Dexie changes. Trigger formally met 2026-04-24 per `docs/research/founder-use-ledger.md` ledger backfill + founder-named serving-content gap. **§R7 exit-3 applied 2026-04-26: `d36 Jump Float Introduction` deferred from Tier 1b entirely; re-enters under `O7` track 2 (sports-medicine / PT review). 2026-04-27 red-team correction: `d43 Triangle Setting` is deferred to `D101` 3+ player support because the BAB source geometry is 3-player.** Current Layer A authoring-budget cap consumption is 4/10."
last_updated: 2026-04-27
depends_on:
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/reviews/2026-04-22-drill-level-audit.md
  - docs/research/bab-source-material.md
  - docs/research/fivb-source-material.md
  - docs/research/founder-use-ledger.md
related:
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
decision_refs:
  - D80
  - D91
  - D104
  - D105
  - D101
  - D123
  - D130

# Tier 1b: Serving + Setting content expansion

## §R7 exit-3 applied 2026-04-26

`**d36 Jump Float Introduction` is deferred from Tier 1b entirely** and re-enters under `O7` track 2 (sports-medicine / PT review of the 8 "do not ship without physio input" items enumerated in `docs/research/jump-float-amateur-beach.md`). **2026-04-27 red-team correction:** `d43 Triangle Setting` is also deferred from this Layer A wave because the BAB source form is a 3-player triangle route and `D101` keeps 3+ player drill selection outside M001/v0b scope. Current Layer A scope drops to 4 drills. Authoring-budget cap consumption is 4/10; six records remain under the cap for any follow-on Tier 1b wave.

The deferred drill, its source citation, and its red-team-flagged exit options (1 / 2 / 3) are preserved in the source notes — see `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §R7. This plan no longer authors `d36`; the chain-6-serving rung-4 → rung-5 link to `d36` is removed, leaving `d33 Around the World Serving` as the temporary leaf of the authored serving ladder. When `O7` track 2 delivers, `d36` re-enters via a new authoring plan that wires the prerequisite-gate questions, the warm-up dependency, and the conservative-anchor volume defaults the §R7 memo specifies.

The earlier "D7 pointer-only" treatment of `d36` (constraining first-exposure volume to 3 × 4 = 12) is now moot for Tier 1b — it remains relevant only for the future `O7`-track-2-gated authoring plan. The `d43` source notes remain useful for a future `D101` 3+ player plan, but no two-player adaptation ships here.

## Agent Quick Scan

- **Layer A only.** Four new drill records + progression links + vocabulary sweep applied to new drills. No assembly filter changes. No progression-follow level gating. No SetupScreen. No `archetypes.ts` widening. No Dexie migration.
- **Gated on the Tier 1b trigger** (`docs/plans/2026-04-20-m001-tier1-implementation.md` lines 270-276). **Trigger formally met 2026-04-24** via the 2026-04-21 joint-session ledger backfill + founder-named serving-content gap (`docs/research/founder-use-ledger.md` §"Content gaps surfaced on the 2026-04-21 sessions").
- **Capped at ≤10 new drills** per the authoring-budget cap (`docs/plans/2026-04-20-m001-adversarial-memo.md` §Authoring-budget cap, lines 145-155). This plan authors 4 (after §R7 exit-3 deferred `d36` and the 2026-04-27 red-team deferral of `d43`). Six records remain under the cap for any follow-on Tier 1b wave.
- **Drill-level audit precedes this plan.** `docs/reviews/2026-04-22-drill-level-audit.md` confirmed the existing 26-drill library's level tags are clean enough to trust for future filter decisions (minor mismatches flagged, not fixed here). New drills in this plan carry correct `levelMin` / `levelMax` from FIVB + BAB cross-reference so the audit stays clean post-ship.
- **Estimated effort when gate fires: 2-3 days of focused work.** Content research is pre-paid in `docs/research/bab-source-material.md` and `docs/research/fivb-source-material.md`; progression-link logic is contained; test surface is finite.

## Why this plan exists in its current shape

The 2026-04-22 conversation surfaced three attempts at scoping the next sizeable work:

1. **First attempt:** scope Tier 2 as "the next thing." Rejected because Tier 2 is gated by Condition 3 final close (2026-05-21) plus two weeks of founder sessions — not yet unlocked.
2. **Second attempt:** scope a combined "Tier 1b + Tier 1b+" bundle including level-aware filter wiring in `pickForSlot` and `findSwapAlternatives`. Rejected by an explicit red-team pass because (a) the bundle grew to ten items, reproducing the exact scope-ballooning shape that got the original 2026-04-20-a/b Tier 1 plan rewritten; (b) level-aware filter wiring is Tier-1c-shaped architecture (new context-driven runtime filter across two call sites) and belongs behind evidence-gated unlock, not bundled into content expansion; (c) the supposed "A5 memo amendment" justifying the bundle was semantic sleight of hand against the memo's meta-check (`docs/plans/2026-04-20-m001-adversarial-memo.md` lines 244-250); (d) the structural library skew surfaced by the drill-level audit means Layer B filtering would silently degrade to a no-op for the `competitive_pair` band, making "filter" dishonest shipping.
3. **Third attempt (this plan):** Layer A only. 4 drills + progression links + vocabulary discipline + correct level metadata on new drills. No filter wiring. No progression-follow level gate. No rationale extension. No memo amendment. Size: a real 2-3 day deliverable, not a week-long bundle dressed up as a tier.

This plan deliberately ships smaller than the previous draft. The discipline is visible in the shape.

## Gate status (updated 2026-04-27)

Per `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 270-276, Tier 1b begins when all of the following hold:

- Tier 1a acceptance bar passes. **✓ Met** (Tier 1a shipped 2026-04-20 onward; units 1-5 landed; acceptance criteria 1-8 passed).
- The founder has attempted to substitute from the existing library at least once and logged the attempt in `docs/research/founder-use-ledger.md`. **✓ Met 2026-04-24** via the 2026-04-21 joint-session ledger backfill and founder-named serving-content gap.
- Either (a) the partner walkthrough ledger contains a ≥P1 tag that Tier 1b content would address, OR (b) the founder has logged ≥3 sessions describing a specific content gap. **✓ Met 2026-04-24** via the same ledger correction and named content gap. The 2026-04-26 pair pass session later fired the separate `P2-3` rep-capture trigger, but that track consumes no drill-record cap.

**Implementation is permitted.** This plan now describes the current Layer A implementation target and the corrections discovered by the 2026-04-27 red-team/source review: four current drill records, `d36` deferred to `O7`, and `d43` deferred to `D101`.

## Scope

### Content: 4 new drill records

All authored into `app/src/data/drills.ts` with inline source comments per `docs/research/fivb-source-material.md` line 470 citation convention (`// FIVB Drill-book <chapter>.<index>`) and `docs/research/bab-source-material.md` convention.

**Serving (2 drills, chain `chain-6-serving`):**


| ID    | Name                      | Mode        | `skillFocus` | `levelMin → levelMax`     | Source                                                                                                                                                            |
| ----- | ------------------------- | ----------- | ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `d31` | Self Toss Target Practice | Solo        | `['serve']`  | `beginner → beginner`     | BAB Serving Rung 1 solo alternative + FIVB 2.1 Serve and Get Into Position (`beginner`)                                                                           |
| `d33` | Around the World Serving  | Solo + Pair | `['serve']`  | `beginner → intermediate` | BAB Serving Rung 3 + FIVB 2.5 Serving Variety Drill (`intermediate / advanced` in FIVB; BAB places the variant more accessibly; level span reflects both sources) |


**Deferred from Tier 1b: `d36 Jump Float Introduction`** (§R7 exit-3 applied 2026-04-26). The drill remains a future Tier 1b candidate but cannot ship until `O7` track 2 (sports-medicine / PT review) delivers a physio sign-off on the 8 "do not ship without physio input" items enumerated in `docs/research/jump-float-amateur-beach.md`. Source citation, exit-options, and authoring-input constraints (3 × 4 = 12 reps first-exposure under the conservative-wins-on-safety principle) are preserved in `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §R7 for re-entry. Until then the chain-6-serving ladder ends at `d33`.

**Setting (2 drills, chain `chain-7-setting`):**


| ID    | Name                     | Mode | `skillFocus` | `levelMin → levelMax`         | Source                                                                                                                      |
| ----- | ------------------------ | ---- | ------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `d40` | Footwork for Setting     | Solo | `['set']`    | `beginner → intermediate`     | BAB Setting Rung 3 + FIVB 4.1 Set and Move (`beginner`)                                                                     |
| `d42` | Corner to Corner Setting | Pair | `['set']`    | `intermediate → intermediate` | BAB Setting Rung 5 / Beginner's Guide L2; FIVB support is thematic only (high-rep setting family), not an exact title match |


**Deferred from this Layer A wave: `d43 Triangle Setting`**. BAB source forms for Triangle Setting use a three-player route (`P1`, `P2`, `P3`). M001/v0b supports 1-2 player session assembly and drill selection only (`D101`), so this plan does not author a two-player adaptation. `d43` re-enters only under a future `D101` 3+ player plan or a separately source-backed two-player drill.

Each drill's `courtsideInstructions` applies the Tier 1a Unit 3 vocabulary discipline: inline parenthetical definitions on first occurrence of BAB-specialised terms, BAB spelling over FIVB spelling where they diverge (e.g., "pokey" not "pokie"), per `docs/research/bab-source-material.md` and `docs/research/fivb-source-material.md` line 396.

Specific new-term coverage expected:

- `d33` — zone-count clarification: our implementation uses BAB's 6-zone convention for serving Around the World (not FIVB 5.6's 5-zone attack-chapter convention — `docs/research/fivb-source-material.md` line 370 notes the three conflicting conventions and recommends picking one).
- "Jump Float" is **not** introduced in this Tier 1b wave (deferred with `d36` per §R7 exit-3 applied 2026-04-26); the term will land alongside `d36` re-entry under `O7` track 2.
- "Triangle" is **not** introduced in this Tier 1b wave because `d43` is deferred to `D101`.

### Progression links

`**chain-6-serving`** (currently a small branching graph, not a linear ladder):

- Current authored IDs: `d22`, `d31`, `d23`, `d33`. `d23` remains grouped in the chain but is `m001Candidate: false` and intentionally has no current progression link.
- `d22` → `d33` progression: zone scoring reliable → expand across the named six-zone serving grid.
- `d31` → `d33` progression: one-target no-net contact reliable → when a net is available, expand to the six-zone grid.
- `d22` → `d31` lateral: alternative entry point for ball-light or no-net sessions.
- No dangling link to unauthored `d32`; no `d31` → `d23` link while `d23` is non-M001; no cross-chain link to `d24` (`d24` belongs to `chain-2-direction`).
- **Current leaf**: `d33` is the temporary leaf of the authored serving ladder. The originally-planned Rung 4 → Rung 5 unlock (`d33` → `d36 Jump Float Introduction`) is **removed** per §R7 exit-3 applied 2026-04-26. `d36` re-enters under `O7` track 2.
- `defaultGatingThreshold: 0.7` (unchanged, consistent with other chains).

`**chain-7-setting`** (currently `d38`, `d39`, `d41` with zero links, per Tier 1a Unit 2):

- **Fundamentals default-unlocked** (rungs 1-3): `d38 Bump Set Fundamentals`, `d39 Hand Set Fundamentals`, `d40 Footwork for Setting`. These are fundamentals per BAB Beginner's Guide Lesson 2, not rungs gated on each other.
- Rung 4: `d41 Partner Set Back-and-Forth` (pair) remains the pair entry.
- Rung 5: `d41` → `d42 Corner to Corner Setting` (pair).
- `d43 Triangle Setting` is not linked; it is deferred to `D101` 3+ player support.
- Pair-only transition past fundamentals is intentional: setting progression beyond self-toss fundamentals requires a partner. Solo reaches rungs 1-3 fully; the current pair progression reaches `d42`. Documented honestly in the chain comment, not a defect.
- `defaultGatingThreshold: 0.7`.

### Vocabulary sweep on new drills

Tier 1a Unit 3 already shipped the sweep across existing drills with inline parenthetical definitions on first BAB-specialised-term occurrence. This plan extends that discipline to the 4 new drills:

- BAB-spelling wins over FIVB where they diverge (our Tier 1a convention; `docs/research/fivb-source-material.md` line 396).
- Inline parenthetical definitions on first occurrence per drill of any flagged-vocabulary term (Pokey, Tomahawk, Sideout, High Line, Cut Shot, Pull Dig, Around the World).
- No global glossary block needed (Tier 1a Unit 3 explicitly rejected that shape).
- Existing drill `name` and `shortName` on existing drills are stable identifiers and are not renamed.

Expected vocabulary additions from these 4 drills:

- `d33 Around the World Serving` — "Around the World" as a 6-zone scoring convention; inline zone-count clarifier on first occurrence.

### What is NOT in this plan


| Item                                                                                         | Reason                                                                                                                                                                                                                   | Where it goes                                                               |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `d27 Beach Prep Two` compliance-fallback warmup                                              | Trigger: founder logs a session where 3-min Beach Prep Three felt too long. Not fired.                                                                                                                                   | Tier 1b second wave or later, same plan-doc extension when/if trigger fires |
| `d29 Beach Prep Five` + `d30 Pair Pepper Progression` + `pair_long_warmup` archetype variant | Trigger: partner walkthrough ≥P1 need for longer together-warmup. Seb's 2026-04-21 walkthrough did NOT return this as ≥P1.                                                                                               | Deferred; re-evaluate on next partner walkthrough                           |
| `pickForSlot` level filter                                                                   | Red-team pass (2026-04-22) identified as Tier-1c-shaped architecture + structurally unsafe until advanced-band population grows; see `docs/reviews/2026-04-22-drill-level-audit.md` §"The advanced skill-band is empty". | Separate decision, separate plan, evidence-gated                            |
| `findSwapAlternatives` level filter                                                          | Same reason.                                                                                                                                                                                                             | Same gate                                                                   |
| Progression-link follow level gate (Layer C)                                                 | Same reason, plus progression-follow UX may not exist as active code path (not verified in red-team pass).                                                                                                               | Separate decision                                                           |
| `'Chosen because:'` rationale extension                                                      | Not asked for, not motivated by trigger, flagged as scope creep in red-team. Tier 1a's one-line rationale already ships.                                                                                                 | Out of scope                                                                |
| `sessionFocus` context field / Swap-Focus button / Tier 1c architecture                      | Tier 1c's own gate (≥8 sessions with focus-mismatch notes OR partner walkthrough ≥P1 on focus toggle) — not fired.                                                                                                       | `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier 1c section        |
| `archetypes.ts` `main_skill` / `pressure` skillTags widening to `'set'`                      | Breaks the single-focus-per-session invariant (Tier 1a Unit 2 architectural note). `SKILL_TAGS_BY_TYPE` widening for Swap-pool reachability already shipped in Tier 1a Unit 2.                                           | Not in Tier 1b                                                              |
| Fixes to the two level-tag mismatches (`d07` upper, `d22` lower)                             | Flagged in `docs/reviews/2026-04-22-drill-level-audit.md`. Fixes need decision about what the tags *will be used for* before shipping. Corrections without a consumer are premature.                                     | Separate decision                                                           |
| Layer `PlayerLevel` widening to 5 bands or `skillBandRecommendation` drill field             | Architectural question raised by the audit; not a Tier 1b concern.                                                                                                                                                       | `docs/decisions.md` open-questions track                                    |


## Implementation

### Files touched

- `app/src/data/drills.ts` — 4 new `const dNN: Drill = { ... }` records; each with source comment. Records sorted into the existing chain organization (serving drills grouped with `chain-6-serving`, setting drills grouped in `chain-7-setting`). Added to the `DRILLS` export array at the bottom. Includes a comment documenting why `d43` is not authored.
- `app/src/data/progressions.ts` — extend `chain-6-serving` with the safe authored branching graph; extend `chain-7-setting` with `d41` → `d42` only.
- `app/src/domain/__tests__/sessionBuilder.test.ts` — new regression + Swap-pool cases (see *Tests* below).
- `app/src/domain/__tests__/findSwapAlternatives.test.ts` — new Swap-surface cases.
- `app/src/data/__tests__/progressions.test.ts` — new chain-structure assertions (create file if absent; Tier 1a Unit 2 deferred authoring it).

### Files NOT touched

- `app/src/types/drill.ts` — no schema changes.
- `app/src/domain/sessionBuilder.ts` — no filter logic changes. `SKILL_TAGS_BY_TYPE` already widened in Tier 1a Unit 2.
- `app/src/data/archetypes.ts` — `main_skill` / `pressure` block skillTags stay `['pass', 'serve']`, preserving the single-focus-per-session invariant for default assembly.
- `app/src/screens/*.tsx` — no UI changes. "Chosen because:" rationale from Tier 1a Unit 4 automatically covers the new drills since it derives from builder output.
- `app/src/db/` — no Dexie migration.
- `app/src/lib/skillLevel.ts` — untouched.
- `app/src/storage/` — no `storageMeta` schema changes.

### Tests

`**progressions.test.ts`** (create if absent, currently implied but not shipped per Tier 1a Unit 2 acceptance):

1. `chain-6-serving` includes only authored serving IDs and excludes unauthored/deferred placeholders (`d32`, `d36`).
2. `chain-6-serving` routes `d22` and `d31` to `d33`; assert it does **not** link `d31` → `d23`, `d23` → `d33`, or any serving drill to cross-chain `d24`.
3. `chain-6-serving` expresses `d22` → `d31` as a lateral entry-point alternative.
4. `chain-7-setting` fundamentals (`d38`, `d39`, `d40`) are default-unlocked (no prerequisite links).
5. `chain-7-setting` pair progression is `d41` → `d42` only; assert `d43` is absent from the catalog and chain.
6. Catalog invariant: progression links only reference drills within the same chain and every listed drill declares that chain id.

`**sessionBuilder.test.ts`** (extend):

1. Default `solo_wall` 15-min session still generates `pass`-focus main_skill drill (regression — single-focus invariant preserved).
2. Default `pair_net` 25-min session still generates `pass`-focus main_skill drill (regression).
3. `d28 Beach Prep Three` still resolves in the warmup slot (regression on Tier 1a Unit 1).
4. `SKILL_TAGS_BY_TYPE.main_skill` and `.pressure` still include `'set'` (regression on Tier 1a Unit 2).

`**findSwapAlternatives.test.ts**` (extend):

1. `d33 Around the World Serving` surfaces in `main_skill` Swap alternatives on `solo_net` and `pair_net` contexts, and does not surface in `solo_open` because it needs a net.
2. `d42 Corner to Corner Setting` surfaces in `main_skill` Swap alternatives on `pair_net` only. `d43 Triangle Setting` never surfaces because it is deferred to `D101`.
3. `d40 Footwork for Setting` surfaces in `main_skill` Swap alternatives on `solo_wall` and `solo_open`.

(Originally planned `d36` Swap-surface case is removed; `d36` is deferred per §R7 exit-3 and will re-enter with its own Swap test under the `O7` track 2 authoring plan.)

**Regression suite** (no new tests, just pass):

- Existing ~566 tests continue to pass unchanged.
- `npm run lint` clean.
- `npm run build` clean.

## Acceptance

Tier 1b ships when **all** of the following hold:

1. **Trigger fires** per `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 270-276. **Met 2026-04-24** (founder-use-ledger backfill + named serving-content gap).
2. 4 new drill records committed with inline source citations (`d31`, `d33`, `d40`, `d42`). `d36 Jump Float Introduction` is **out of scope** per §R7 exit-3 applied 2026-04-26. `d43 Triangle Setting` is **out of scope** per `D101` 3+ player support.
3. Progression links land in `progressions.ts` with the safe authored graph described above; the chain-6-serving current leaf is `d33` (no rung-5 link until `d36` re-enters under `O7` track 2), and chain-7-setting links only `d41` → `d42`.
4. All new + regression tests pass locally.
5. `npm run lint` and `npm run build` clean.
6. Tier 1a acceptance items remain unaffected: `d28` in warmup, Chosen-because annotations on every block, 3-row Home trailer, `SKILL_TAGS_BY_TYPE` still includes `'set'`.
7. No SetupScreen changes. No `archetypes.ts` skillTags widening. No schema migration.
8. Authoring-budget cap: 4 / 10 drills consumed; 6 remain for any follow-on Tier 1b wave.
9. Drill-level audit file (`docs/reviews/2026-04-22-drill-level-audit.md`) remains consistent — new drills' level tags match the expected tags documented in this plan's §Content table.

## Post-ship follow-ups (track, do not bundle into this plan)

- **Update `docs/research/founder-use-ledger.md`** with any sessions that used the new drills, to keep the weekly adversarial-memo review sourced from real behavior.
- **Monitor authoring-budget cap.** Second Tier 1b wave (if any) draws from the remaining 6 records, still gated on logged demand. `d36 Jump Float Introduction` does **not** count against the current Layer A cap; it re-enters under its own `O7` track 2 authoring plan.
- **Partner walkthrough re-run candidate.** The open-list at `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Updated pre-D91 discipline checklist" includes "repeat pair session on sand" and exercising BAB vocabulary not covered in Seb's `solo_open` + `pair_open` passes. The new drills (`d33`, `d42`) introduce surfaces that have not been walkthrough-exercised.
- **Layer B re-evaluation.** After a few founder sessions that use the new drills, revisit whether level-aware filtering would add real signal. Gate the conversation on (a) ≥3 ledger rows flagging level-mismatch friction, AND (b) advanced-band skill-slot population that is actually non-degenerate. This slice does **not** unlock Layer B because `d36` and `d43` are both deferred.
- `**O7` track 2 readiness for `d36` re-entry.** When the founder moves toward friends-of-friends or stranger cohort under `D130` re-eval, or when behavioral evidence (founder ledger; partner usage) surfaces explicit demand for jump-float content, open the `O7` track 2 work item: physio review of the 8 do-not-ship-without-physio-input items in `docs/research/jump-float-amateur-beach.md`, prerequisite-gate engine wiring (warm-up dependency + 2-question gate), and the conservative-anchor first-exposure volume defaults from §R7.

## For agents

- **Authoritative for**: Tier 1b Layer A scope (4 drills + progression links + vocabulary discipline, post-§R7 exit-3 and post-2026-04-27 `d43` red-team correction), gate status, and the explicit not-in-scope list. **Not authoritative for `d36 Jump Float Introduction`** — that drill is deferred to an `O7` track 2 authoring plan (not yet authored); the source notes in `docs/research/jump-float-amateur-beach.md` and `docs/research/2026-04-22-research-sweep-meta-synthesis.md` §R7 carry the inputs. **Not authoritative for `d43 Triangle Setting` implementation** — that drill is deferred to `D101` 3+ player support.
- **Edit when**: a second Tier 1b wave is planned (extend scope, keeping the ≤10 authoring-budget cap visible); drill-level audit is re-run and its findings change any assumption this plan leaned on; `O7` or `D101` reopens deferred `d36` / `d43` content.
- **Belongs elsewhere**: the Tier 1b trigger itself (`docs/plans/2026-04-20-m001-tier1-implementation.md`); the authoring-budget cap (`docs/plans/2026-04-20-m001-adversarial-memo.md`); founder-session behavioral data (`docs/research/founder-use-ledger.md`); drill-level audit findings (`docs/reviews/2026-04-22-drill-level-audit.md`); any future Layer B / Layer C architecture plan (when that plan exists).
- **Outranked by**: `docs/plans/2026-04-20-m001-tier1-implementation.md` (Tier 1b trigger conditions), `docs/plans/2026-04-20-m001-adversarial-memo.md` (authoring-budget cap, falsification conditions), `docs/decisions.md` (any D# that supersedes).
- **Key pattern**: trigger-gated plan authored ahead of implementation, then corrected against source material before ship. Current landed cap consumption is 4/10.

