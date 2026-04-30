---
id: tier-1c-prepay-and-catalog-audit-2026-04-28
title: "Tier 1c architectural prepay + catalog reserve audit (combined)"
type: requirements
status: active
stage: validation
authority: "Historical combined requirements doc for the pre-D135 Tier 1c prepay + catalog reserve audit brainstorm. Post-D135, the active implementation plan supersedes the Tier 1c spec-only framing; the catalog reserve audit requirements survive and are the current #1 brainstorm target."
summary: "Historical combined brainstorm plus 2026-04-29 focused refresh. The pre-D135 Tier 1c spec-only requirements are superseded by D135 and the active implementation plan; the catalog reserve audit requirements survive and are now the #1 brainstorm target. Current focused scope: per-drill verdict table for the 15 m001Candidate:false records, retire-only application, audit registration, and drills.ts pointer."
last_updated: 2026-04-29
related:
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/reviews/2026-04-22-drill-level-audit.md
  - docs/research/founder-use-ledger.md
  - app/src/data/drills.ts
decision_refs:
  - D81
  - D91
  - D101
  - D104
  - D121
  - D130
  - D132
  - D135
---

# Tier 1c architectural prepay + catalog reserve audit

## Revision note (2026-04-28, post-D135 same-day)

This brainstorm was anchored on the **pre-D135** reading of the canon and treated S4 (Tier 1c) as "design-only prepay" because the strict trigger appeared unfired. **Later the same day**, `D135` landed in `docs/decisions.md` (uncommitted on the working tree at brainstorm-time) and the canonical Tier 1a plan (`docs/plans/2026-04-20-m001-tier1-implementation.md`) updated to record that the Tier 1c partner-walkthrough OR clause **fired** 2026-04-28 under D135, alongside the skill-level mutability sibling trigger. Two K-decisions in this brainstorm are now wrong-shaped against current canon and have been overridden in the implementation plan:

- **K1 → K1'.** "Spec-only over live scaffold" is wrong post-D135 because the trigger fired; under-shipping a triggered surface is the substitution shape D135 was authored to prevent. The implementation plan ships **live Tier 1c implementation under sequencing option A** (the same precedent as `D133`'s 2026-04-26 trigger fire → 2026-04-27 ship cadence).
- **K3 → K3'.** "Skill-level mutability excluded" is too rigid post-D135 because the sibling trigger fired the same day. D135 says "founder retains the choice to bundle or sequence Tier 1c and skill-level mutability when those ships are scheduled." The implementation plan **bundles them as Streams 1 and 2** in one PR with separate atomic commits per D135's "should ship as distinct chunks even when scheduled close together" guidance.
- **K5 → K5'.** "One PR with two atomic commits" extends to **one PR with three atomic commits** (Tier 1c, skill-level mutability, catalog audit).

The K-decisions that survive the rewrite unchanged: K2 (audit-first over delete-all — D81 logic untouched by D135), K4 (3-player drills hold-pending-D101), K6 (Mermaid omit-default — vestigial without a spec doc), K7 (verdict vocabulary, burden-of-proof on retire).

The post-D135 implementation plan is `docs/plans/2026-04-28-tier-1c-prepay-and-catalog-audit.md` (rewritten same day). The pre-D135 requirements R1–R17 below are preserved for historical context — they describe the correct shape under the snapshot they read; the implementation plan's R1–R24 supersede them under the current canon.

## Focused refresh (2026-04-29): #1 catalog reserve audit

The 2026-04-29 ideation refresh selected the catalog reserve audit as the next obvious chunk. This section is the active brainstorm output for **#1**. It narrows the surviving part of this combined brainstorm into a standalone requirements brief while preserving the historical pre-D135 body below for provenance.

### Problem Frame

The 15 `m001Candidate:false` drills are intentional reserve inventory under `D81`, but their current state is opaque. Future agents can see that they are inactive, but not why each drill is parked, what evidence would graduate it, whether it is blocked by `D101` / M002 / equipment reachability, or whether any record should actually retire.

The right next chunk is not new drill authoring and not live UX. It is a durable audit that converts reserve inventory into explicit option value.

### Actors

- A1. Future implementation agent: needs a clear per-drill verdict before editing catalog records.
- A2. Founder / product owner: needs to know which reserve drills still represent useful future scope and which should be removed.
- A3. Future drill-level auditor: needs stable provenance to avoid re-litigating the same 15 records.
- A4. Cold repo reader: needs `app/src/data/drills.ts` to point at the audit rather than making the reserve look accidental.

### Requirements

**Audit artifact**
- R1. A durable audit doc exists at `docs/reviews/2026-04-28-m001-candidate-false-audit.md`.
- R2. The audit covers all 15 `m001Candidate:false` records: `d02`, `d04`, `d06`, `d07`, `d08`, `d12`, `d13`, `d14`, `d16`, `d17`, `d19`, `d20`, `d21`, `d23`, `d24`.
- R3. Each row records drill id, name, chain or grouping, `levelMin -> levelMax`, primary `skillFocus`, source citation or citation gap, equipment / participant dependency, verdict, and short rationale.
- R4. Verdict vocabulary is closed to four shapes: `graduate-when: <condition>`, `hold-pending-<Dxxx-or-milestone>`, `demote-to-archive`, and `retire`.

**Verdict policy**
- R5. `retire` carries the highest burden of proof: written rationale plus verified zero references outside the retired record and its deliberate audit mentions.
- R6. `demote-to-archive`, `hold-pending-*`, and `graduate-when:*` do not change `app/src/data/drills.ts` in this chunk.
- R7. Three-player drills (`d08`, `d14`, `d20`) default to `hold-pending-D101` unless the audit finds a separate retirement reason.
- R8. Group drills (`d19`, `d20`, `d21`) default to a milestone-gated hold such as `hold-pending-M002` absent stronger evidence.
- R9. Wall and net-dependent records, especially `d23` and `d24`, are evaluated against actual archetype reachability rather than treated as generically unavailable.

**Application and routing**
- R10. Retire verdicts, if any, are the only verdicts applied in this implementation chunk.
- R11. `app/src/data/drills.ts` gains a concise header pointer to the audit doc so future readers find the verdict table from the catalog file.
- R12. `docs/catalog.json` registers the audit doc in the same pass.
- R13. No new drill records are authored and the Tier 1b authoring cap remains 4/10 consumed.

### Acceptance Examples

- AE1. **Covers R1-R4.** A future agent opens the audit and can account for every `m001Candidate:false` record without reading the full historical brainstorm.
- AE2. **Covers R5-R6, R10.** If a drill has a `graduate-when` or `hold-pending-*` verdict, the catalog record stays in place even if it is not currently assembled into sessions.
- AE3. **Covers R7.** A 3-player source-geometry drill is not deleted merely because M001 currently lacks 3+ player support; it is held behind `D101`.
- AE4. **Covers R11.** A cold reader of `app/src/data/drills.ts` finds the audit pointer before trying to infer reserve policy from the boolean flag alone.

### Success Criteria

- Every reserve drill has a specific, reviewable verdict and rationale.
- No active M001 behavior changes unless a `retire` verdict is both justified and reference-checked.
- Future planning can start from the audit table instead of re-deriving reserve policy.
- The audit reinforces D130 cap discipline by preserving parked option value without activating new content.

### Scope Boundaries

- No new drill records.
- No activation of non-M001 drills except a justified `retire` removal.
- No Tier 1c focus-picker implementation.
- No skill-level mutability implementation.
- No hard level filtering.
- No Dexie migration, telemetry, or session-data export changes.
- No broad archive/demotion PR unless a separate follow-up explicitly selects that work.

### Key Decisions

- **KD1. Audit first, not delete first.** `D81` makes reserve inventory intentional; deletion requires a stronger burden of proof than inactivity.
- **KD2. Retire-only application.** Applying every verdict would turn an audit into a behavior-changing catalog project; only retire verdicts are safe to apply immediately.
- **KD3. Hold real future gates.** Three-player and group drills should be held behind `D101` / M002-style gates when the source geometry is still valid.
- **KD4. Keep #1 independent.** The catalog audit should remain separately shippable before Tier 1c focus picker and skill-level mutability.

### Outstanding Questions

#### Resolve Before Planning

- None.

#### Deferred to Planning

- Which, if any, of the 15 records meet the `retire` bar.
- Whether any `retire` candidate has references in `app/src/` that require downgrading the verdict.
- Whether a `demote-to-archive` verdict should become a separate follow-up PR and where archived provenance should live.

### Next Steps

-> `/ce-plan` for structured implementation planning of the catalog reserve audit.

## Problem Frame

Two unmet needs surfaced in `docs/ideation/2026-04-28-what-to-add-next-ideation.md` as zero-cap, zero-UX survivors:

1. **Tier 1c is inevitable but not yet evidence-fired.** The strict trigger (≥8-session ledger flagged with intent mismatch, OR partner walkthrough ≥P1, OR ≥3-set-focused Swap-friction sessions) has not formally fired. Evidence is accumulating across two channels (founder gap 1 on 2026-04-21; Seb voice memos 2026-04-27 + 2026-04-28). When the trigger does fire, ship-day work currently includes (a) re-deriving the override architecture, (b) writing the override branches across two call sites, (c) authoring the test surface, (d) the UI surface itself. Pre-paying (a) durably as a spec doc costs near-zero today and reduces ship-day to (b) + (c) + (d).

2. **The 15 `m001Candidate: false` drills in `app/src/data/drills.ts` lack per-drill provenance.** Per `D81`, the catalog ships 10-12 active drills from a 26-drill seed pack, with the full pack expanding post-validation. The flag is the mechanism. But individual drill records have drifted: some are 3-player (`d08`, `d14`, `d20`) and now block-equivalent to deferred `d43` under `D101`; some require infrastructure that isn't shipping (group surfaces `d19`, `d20`, `d21`); some have firm graduation paths under future triggers; and some have no clear graduation path. Without per-drill verdicts the reserve is opaque to future agents — the next drill-level audit, the next M002 expansion, and the eventual D81 post-validation graduation will all re-derive the same per-drill analysis from scratch.

Neither stream consumes the Tier 1b authoring-budget cap (still 4/10). Neither ships user-visible behavior. Both compound for future work.

## Use This File When

- writing the implementation plan for the combined PR
- evaluating whether Tier 1c prepay or the catalog audit should expand scope
- checking whether a future agent can re-derive the design without reading this brainstorm

## Not For

- amending Tier 1c trigger conditions (those stay in `docs/plans/2026-04-20-m001-tier1-implementation.md`)
- amending `D81` (it stays as written)
- shipping any user-visible Tier 1c UX (explicitly forbidden by this brainstorm)
- deleting drill records before per-drill verdicts exist
- bundling skill-level-mutability scaffolding (separate surface, separate trigger)

## Goals

- **G1.** Capture the Tier 1c override architecture as a durable spec doc that any future agent can ship from without re-deriving the design.
- **G2.** Produce a per-drill verdict table for the 15 `m001Candidate: false` records, classifying each as `graduate-when`, `hold-pending-Dxxx`, `demote-to-archive`, or `retire`.
- **G3.** Apply any verdicts that are unambiguously low-risk (e.g., `retire` decisions on records with zero graduation path); defer ambiguous verdicts to a follow-on PR rather than rushing.
- **G4.** Ship as one PR with two clearly-separated commits so either can be reverted independently.

## Non-goals

- Adding `SetupContext.sessionFocus` as a real field today (not even an inert one).
- Wiring `pickForSlot` or `findSwapAlternatives` override branches today.
- Authoring any draft-screen or Setup-screen UI for focus-picking.
- Authoring a `skillLevelOverride` field, scaffold, or surface (separate trigger; per `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Skill-level mutability — separate surface, separate trigger").
- Authoring new drill records (cap stays at 4/10).
- Changing the `m001Candidate: false` *mechanism* (the boolean flag stays).
- Re-running the partner walkthrough or producing new founder-ledger rows (those are S2/S3 ops moves; separate scope).

## Actors

- **A1.** Future agent shipping Tier 1c when the trigger fires — primary consumer of the spec doc.
- **A2.** Founder authoring or revising the drill catalog — primary consumer of the verdict table.
- **A3.** Future drill-level audit (next iteration of `docs/reviews/2026-04-22-drill-level-audit.md`) — secondary consumer of the verdict table.
- **A4.** Anyone reading `app/src/data/drills.ts` cold — benefits from the verdict table being linked from the file header.

## Requirements

### Stream 1 — Tier 1c architectural prepay (spec-only)

- **R1.** A new spec doc exists at `docs/specs/m001-tier-1c-focus-routing-prepay.md` capturing the override architecture currently described in `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Architectural prerequisites".
- **R2.** The spec is structured as a stub — frontmatter (`status: draft`, `stage: validation`, `authority: ...`), Purpose, Use When, Not For, Update When, Machine Contract, plus the architectural sections.
- **R3.** The architectural sections name precisely: (a) the new `SetupContext.sessionFocus?: 'pass' | 'serve' | 'set'` field shape, (b) the override branch in `pickForSlot` for `slot.type ∈ {main_skill, pressure}`, (c) the parallel override in `findSwapAlternatives`, (d) the Swap-Focus button location (draft screen, not SetupScreen, per `P11`), (e) the `SKILL_TAGS_BY_TYPE` fallback semantics when `sessionFocus` is undefined.
- **R4.** The spec explicitly states "no code is shipped under this spec; ship-day work is to (1) add the field, (2) add the two override branches, (3) wire the UI button, (4) write tests." This sentence is non-negotiable — it is what prevents accidental activation by a reading agent.
- **R5.** The spec records the *separate* skill-level-mutability surface as out-of-scope-for-this-spec with a one-line pointer to `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Skill-level mutability — separate surface, separate trigger".
- **R6.** `docs/catalog.json` is updated to register the new spec doc (id, path, type, status, canonical_for).
- **R7.** `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Architectural prerequisites" gains a one-line pointer to the new spec ("Promoted to canonical spec at `docs/specs/m001-tier-1c-focus-routing-prepay.md`."); the existing prose is **not** removed (it remains contextually useful inside the Tier 1a plan's narrative).

### Stream 2 — Catalog reserve audit

- **R8.** A new audit doc exists at `docs/reviews/2026-04-28-m001-candidate-false-audit.md` containing a per-drill verdict table for the 15 `m001Candidate: false` records: `d02`, `d04`, `d06`, `d07`, `d08`, `d12`, `d13`, `d14`, `d16`, `d17`, `d19`, `d20`, `d21`, `d23`, `d24`.
- **R9.** Each row records: drill id, name, chain, current `levelMin → levelMax`, primary skillFocus, the source citation (FIVB / BAB / other) from the existing 2026-04-22 drill-level audit if present, and a verdict in `{graduate-when: <condition>, hold-pending-<Dxxx>, demote-to-archive, retire}`.
- **R10.** Any verdict of `retire` requires (a) a written justification in the row and (b) confirmation that no test or fixture references the drill. Verdicts of `demote-to-archive` or `hold-pending` keep the record in `app/src/data/drills.ts` unchanged.
- **R11.** Three-player drills (`d08`, `d14`, `d20`) are evaluated under the existing `D101` 3+ player support gate. Their verdict pattern is `hold-pending-D101`, not `retire`, unless the drill has additional structural reasons to retire.
- **R12.** Group drills (`d19`, `d20`, `d21`) are evaluated against M002 weekly-confidence-loop and any future group-mode posture. The verdict pattern is `hold-pending-M002` if no firmer rationale exists.
- **R13.** Wall-rebound drills (`d24`) and net-dependent serving drills (`d23`) are evaluated against `solo_wall` / `solo_net` archetype reachability rather than against group infrastructure.
- **R14.** Verdicts of `retire` are applied in this same PR (record removal + DRILLS array update + any test fixture cleanup). All other verdicts ship the audit doc only and **do not modify `app/src/data/drills.ts`**.
- **R15.** `app/src/data/drills.ts` file-header comment (lines 7-13) is updated to add a one-line pointer to the new audit doc, mirroring the existing pointer convention.

### Combined

- **R16.** The PR carries two atomic commits: one for the spec doc + catalog.json + tier1 plan pointer, one for the audit doc + any retire-verdict applications + drills.ts header pointer.
- **R17.** No new tests are required for the spec stream (no code touched). For the audit stream, only retire-verdict applications need test verification (run `npm test -- --run` after each removal to confirm no test references the deleted drill).

## Acceptance Examples

- **AE1.** A future agent reads `docs/specs/m001-tier-1c-focus-routing-prepay.md` and ships Tier 1c on its trigger-fire day in a single PR by adding (a) the `SetupContext.sessionFocus` field, (b) the two override branches as specified, (c) the draft-screen Swap-Focus button, (d) the test files. They do not need to read `docs/plans/2026-04-20-m001-tier1-implementation.md` to derive the architecture. *(Covers R1, R2, R3, R4, R5.)*

- **AE2.** A future drill-level audit agent reads `docs/reviews/2026-04-28-m001-candidate-false-audit.md`, sees that `d12 U Passing Drill` has a `graduate-when: pair_open archetype gains a movement_proxy slot AND ≥1 founder-ledger row flags U-pattern as missing` verdict, and treats `d12` as deliberate reserve rather than stale. *(Covers R8, R9, R12.)*

- **AE3.** A future cleanup PR proposes deleting `d19 Butterfly Toss-Pass-Catch` because "it's not used." The agent reads the audit and sees the verdict `hold-pending-M002` and stops the deletion. *(Covers R8, R12, R14.)*

- **AE4.** Reading `app/src/data/drills.ts` cold, a new agent finds the file-header pointer to the audit doc and uses it as the entry point for understanding the reserve. *(Covers R15.)*

- **AE5.** The spec doc's Non-goals section explicitly excludes skill-level mutability with a pointer to the separate-surface section in the Tier 1a plan, preventing a future agent from accidentally bundling them into the Tier 1c ship. *(Covers R5.)*

## Scope Boundaries

- **Inside scope.** Spec doc creation; audit doc creation; catalog.json registration; tier1 plan pointer; drills.ts header pointer; retire-verdict-only applications; one PR with two atomic commits.

- **Outside this product's identity.** A "level filter" architectural shipping under the audit's umbrella. The 2026-04-22 drill-level audit explicitly identified the advanced-band gap and that level filtering is Tier-1c-shaped architecture. This brainstorm does not touch level filtering and explicitly ignores any drift in that direction during execution. (Carried from `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` §"What is NOT in this plan".)

- **Deferred for later.**
  - Live `SetupContext.sessionFocus` field.
  - `pickForSlot` / `findSwapAlternatives` override branches.
  - Draft-screen Swap-Focus button.
  - Skill-level-mutability surface.
  - Per-drill graduation actions for `graduate-when` / `hold-pending-*` / `demote-to-archive` verdicts (these stay deferred until each verdict's condition fires).
  - Wholesale `m001Candidate: false` deletion.

- **Deferred to follow-up work.** Any verdict in the audit doc that resolves to `demote-to-archive` ships in a follow-on PR with a target archive location (likely `app/src/data/legacy-drills.ts` or a `docs/research/` provenance file). Not in this PR.

## Key Decisions

- **K1.** S4 ships as **spec-only**, not live scaffold or live-plus-skill-mutability. *Rationale*: anti-substitution discipline (don't ship Tier 1c-shaped code under a different label even when inert), zero risk of accidental activation, ship-day work when the trigger fires is bounded and well-defined. *Cost*: ship-day requires writing override branches + tests, which the spec already names precisely.

- **K2.** S5 ships as **per-drill verdict table with retire-only application**. *Rationale*: `D81` makes the reserve intentional — wholesale deletion would destroy authored assets. The audit produces durable provenance for every reserve drill. *Cost*: defers ambiguous verdicts to follow-on PRs; that's the correct shape because each verdict's graduation condition is independent.

- **K3.** Skill-level mutability is **explicitly excluded** from S4. *Rationale*: the 2026-04-28 founder-use-ledger row recorded as a separate surface with a separate trigger; bundling them into Tier 1c risks conflating two product asks Seb's voice memos repeatedly distinguished.

- **K4.** Three-player drills receive `hold-pending-D101` verdict pattern, not retire. *Rationale*: their source geometry is genuinely 3-player (BAB + FIVB) and `D101` is the correct gate. Retiring them would destroy authored content the moment 3+ player support enters scope.

- **K5.** PR ships as **one PR with two atomic commits**, not two PRs. *Rationale*: user choice (sequencing question, 2026-04-28). Both streams are zero-UX, zero-cap; combined narrative is cleaner. Atomic commits preserve revertability.

## Dependencies / Assumptions

- **D-DEP-1.** `D81` remains active and unmodified through the audit work. *Verification*: read `docs/decisions.md` line 109 (verified 2026-04-28 — "M001 prototype ships 10-12 drills from the 26-drill seed pack; full 26-drill library is authored in docs and expands into the app post-validation").
- **D-DEP-2.** `D101` remains as the gate for 3+ player drill selection. *Verification*: pulled from `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` §R7 and the deferred-d43 rationale.
- **D-DEP-3.** No new founder-ledger row, partner-walkthrough finding, or research note between brainstorm and ship invalidates the verdicts. The audit captures verdicts as of 2026-04-28; later evidence may shift them, which is a normal research-cycle property.
- **D-DEP-4.** No code-side dependency: the spec doc references shape paths (`SetupContext`, `pickForSlot`, `findSwapAlternatives`) but does not require those modules to be modified.

## Open Questions

### Resolved during brainstorm

- **Q1.** Live scaffold vs spec-only? **Resolved**: spec-only (K1).
- **Q2.** Delete vs demote vs audit-first? **Resolved**: audit-first with retire-only application (K2).
- **Q3.** One PR or two? **Resolved**: one PR with two atomic commits (K5).
- **Q4.** Skill-level mutability included? **Resolved**: excluded (K3).

### Deferred to implementation

- **Q5.** Per-drill verdict for each of the 15 records — to be authored as the audit work itself. The brainstorm names the verdict *vocabulary* (`graduate-when` / `hold-pending-Dxxx` / `demote-to-archive` / `retire`) but does not pre-judge which drill gets which verdict. That is plan-time analysis.
- **Q6.** Which (if any) drills resolve to `retire` — answered during the audit. Likely zero or one; the file-header comment's "Full pack ships post-validation" rationale puts the burden of proof on retirement, not retention.
- **Q7.** Whether the spec doc should include a Mermaid sequence diagram of the override flow (`pickForSlot` reads `context.sessionFocus`, branches, calls `findCandidates`). Plan-time call; default is "include if it adds clarity, omit if prose alone is clean."

## For agents

- **Authoritative for**: the combined-scope shape and the K1–K5 decisions.
- **Edit when**: a verdict in the audit doc is challenged with new evidence; the spec is shipped (Tier 1c trigger fires) and the spec graduates from `status: draft` to `status: complete`; or a follow-on PR applies a `demote-to-archive` verdict.
- **Belongs elsewhere**: Tier 1c trigger conditions (`docs/plans/2026-04-20-m001-tier1-implementation.md`); cap state (`docs/plans/2026-04-20-m001-adversarial-memo.md`); per-drill verdicts (the audit doc itself, once authored); D81 / D101 / D130 (`docs/decisions.md`).
- **Outranked by**: `docs/decisions.md`; `docs/plans/2026-04-20-m001-adversarial-memo.md`; the partner-walkthrough re-run (S3) if it surfaces ≥P1 evidence that overrides any audit verdict.
