---
id: tier-1c-impl-skill-level-mutability-and-catalog-audit-2026-04-28
title: "feat: Tier 1c focus picker + skill-level mutability + catalog reserve audit"
type: feat
status: active
stage: validation
date: 2026-04-28
origin: docs/brainstorms/2026-04-28-tier-1c-prepay-and-catalog-audit-requirements.md
authority: "Implementation plan for the post-D135 'next ship' bundle: live Tier 1c focus-picker + live skill-level mutability surface + the m001Candidate:false reserve audit. **Replaces** the original 2026-04-28 plan that was anchored on the pre-D135 'spec-only prepay' reading; that framing became wrong-shaped when D135 fired both the Tier 1c trigger and the skill-level mutability sibling trigger on 2026-04-28. Authors zero new drill records (cap stays at 4/10), ships three distinct chunks under one PR with three atomic commits per `D135` 'may be bundled, should ship as distinct chunks' guidance."
summary: "Three streams in one PR, three atomic commits. Current sequence is Stream 3 first, then Stream 1, then Stream 2. Stream 3 (catalog audit): per-drill verdict table for the 15 m001Candidate:false records + retire-only application + drills.ts header pointer. Stream 1 (Tier 1c): SetupContext.sessionFocus field + shared focus-resolution semantics across initial picks / build-time substitution / swaps + Tune today draft-review surface per docs/brainstorms/2026-04-29-session-focus-picker-requirements.md + tests. Stream 2 (skill-level mutability): SessionDraft.context.skillLevelOverride field + draft-screen one-tap level up/down + soft-tuning consumption in builder + tests. Both surfaces preserve P11 recommend-first."
last_updated: 2026-04-29
deepened: 2026-04-29
related:
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/brainstorms/2026-04-28-tier-1c-prepay-and-catalog-audit-requirements.md
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/2026-04-28-audio-pacing-reliability-investigation.md
  - docs/reviews/2026-04-22-drill-level-audit.md
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

# Tier 1c focus picker + skill-level mutability + catalog reserve audit

## Revision note (2026-04-28, post-D135)

This plan was **rewritten on 2026-04-28 after `D135` fired** the Tier 1c partner-walkthrough OR clause (clause 2 of `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Tier 1c trigger") and the skill-level mutability sibling trigger's partner-walkthrough OR clause. The original plan (same filename, earlier in the day) framed Stream 1 as "spec-only prepay"; that framing became wrong-shaped under the cleared D135 reading. The catalog audit stream (now Stream 3, originally Stream 2) is unchanged from the pre-D135 plan — D135 does not touch the `m001Candidate: false` reserve question. The three K-decisions that survived the rewrite (K2 audit-first, K4 3-player → hold-pending-D101, K6 Mermaid omit-default, K7 verdict-vocabulary) are preserved verbatim. K1 (spec-only) is replaced by K1' (live implementation under sequencing option A). K3 (skill-level mutability excluded) is replaced by K3' (skill-level mutability included as a sibling Stream 2 surface). K5 (one PR, two atomic commits) is replaced by K5' (one PR, three atomic commits per D135 "distinct chunks" guidance).

**2026-04-29 synthesis:** A fresh ideation pass selected Stream 3 as the immediate #1 chunk because it is independent, low-risk, and removes catalog ambiguity before live focus routing. This keeps K9 / R22 / Implementation Units as the binding sequence: Stream 3 -> Stream 1 -> Stream 2.

**2026-04-29 Stream 1 design/architecture refinement:** `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md` supersedes this plan's earlier Stream 1 UI detail that described a draft-screen "Swap-Focus" cycle button. The domain intent survives, but v1 now routes fresh and existing drafts through a minimal pre-safety **Tune today** review step with a four-option focus chip/radiogroup. The next planning pass should rewrite U4/U5 against that requirements doc before implementation.

**Red-team clarification (2026-04-29):** Treat this plan's Stream 1 requirements and implementation units as **historical / not implementation-ready**. The Stream 1 implementation is owned by `docs/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` — follow that plan for Tune today, the focus resolver, the regeneration use case, and the routing changes. The old cycle helper, Swap-Focus button, and "existing draft-screen" placement here do not ship. Stream 3 (catalog reserve audit) remains implementation-ready as written.

---

## Overview

Three streams in one PR, three atomic commits, executed in the current selected sequence: Stream 3 first, then Stream 1, then Stream 2. Stream 3 is independent and lowest risk; Stream 1 establishes the optional-context extension pattern; Stream 2 layers a parallel field on top.

- **Stream 1 — Tier 1c focus picker.** The full domain architecture documented at `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Architectural prerequisites" lines 314–322, refined by `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md`: live `SetupContext.sessionFocus` field, shared focus-resolution semantics across initial picks / build-time substitution / swaps, a pre-safety Tune today draft-review surface, and tests.
- **Stream 2 — Skill-level mutability.** Per `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Skill-level mutability — separate surface, separate trigger" architectural-shape note: per-session `skillLevelOverride?: SkillLevel` field on `SessionDraft.context`, draft-screen one-tap level up/down over the actionable D121 levels, soft-tuning consumption through `skillLevelToDrillBand()`, tests. Persistent `onboarding.skillLevel` is **not** mutated (stays in `storageMeta`).
- **Stream 3 — Catalog reserve audit.** Per-drill verdict table for the 15 `m001Candidate: false` records. Retire-only application. `drills.ts` header pointer. New audit doc registered in `docs/catalog.json`.

---

## Problem Frame

Three rationales, one per stream:

1. **Tier 1c trigger fired 2026-04-28 under `D135` clause 2** (partner-walkthrough OR clause). Seb's 2026-04-27 cca2 voice memo + 2026-04-28 build-17 voice memo are independent ≥P1 partner hits naming a missing focus toggle ("today I want to do 30 minutes of serving — let me select that"; "option to choose a new difficulty setting" repeat). Under D135 the original 2026-04-20 trigger language ("Partner walkthrough ledger contains a ≥P1 flag") fires literally. Implementation under sequencing option A is the documented next ship.

2. **Skill-level mutability trigger also fired 2026-04-28 under `D135`** via the same partner-walkthrough OR clause (Seb's "let me change my skill set level day-to-day" + build-17 "option to choose a new difficulty setting"). The two surfaces share UI real estate (both touch the draft screen) but answer different user asks; D135 says "founder retains the choice to bundle or sequence" — this plan bundles them in one PR as distinct atomic commits.

3. **The 15 `m001Candidate: false` reserve drills lack per-drill provenance.** Per `D81`, the catalog ships 10–12 active drills from a 26-drill seed pack, with the full pack expanding post-validation. The flag is the mechanism. Without per-drill verdicts the reserve is opaque to future agents — the next drill-level audit, the next M002 expansion, and the eventual D81 post-validation graduation will all re-derive the same per-drill analysis from scratch.

None of the three streams consumes the Tier 1b authoring-budget cap (still 4/10).

---

## Requirements Trace

Streams 1 and 2 are net-new requirements (the D135 fire moved them in scope); Stream 3 carries forward from the original brainstorm. R-IDs are renumbered to make stream membership scannable.

### Stream 1 — Tier 1c focus picker

> **Status note (2026-04-29):** This section is superseded by `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md` and must be rewritten before implementation. Keep the domain intent (`sessionFocus`, focus-aware candidate pools, pick/swap parity), but do not treat the old Swap-Focus cycle button, U4 cycle helper, or U5 draft-screen button shape as binding.

- **R1.** `SetupContext` gains `sessionFocus?: 'pass' | 'serve' | 'set'` as optional with default `undefined`. When `undefined`, the builder behaves exactly as today (preserves `P11`).
- **R2.** `pickForSlot` (`app/src/domain/sessionAssembly/candidates.ts`) adds a branch: when `slot.type ∈ {main_skill, pressure}` AND `context.sessionFocus !== undefined`, replace `slot.skillTags` with `[context.sessionFocus]` before calling `findCandidates`. Wraps no other slot type.
- **R3.** `findSwapAlternatives` (`app/src/domain/sessionAssembly/swapAlternatives.ts`) reads `context.sessionFocus` and overrides `SKILL_TAGS_BY_TYPE[block.type]` with `[context.sessionFocus]` for matching block types (`main_skill`, `pressure`). When `undefined`, unchanged behavior.
- **R4.** Draft screen gains a Swap-Focus button (NOT SetupScreen, per `P11`). Tap cycles `context.sessionFocus` through `undefined → 'pass' → 'serve' → 'set' → undefined`. Each cycle regenerates the draft and updates the visible focus indicator.
- **R5.** When `sessionFocus === undefined`, the draft screen continues to render the inferred focus (Tier 1a Unit 5's `inferSessionFocus(blocks)`) — the recommend-first default is preserved.
- **R6.** New unit tests in `app/src/domain/__tests__/pickForSlot.sessionFocus.test.ts` (or extend existing `drillSelection.test.ts`) and `app/src/domain/__tests__/findSwapAlternatives.sessionFocus.test.ts` (or extend existing `findSwapAlternatives.test.ts`) pin: (a) undefined → no behavior change; (b) override branch invokes only on `main_skill`/`pressure`; (c) override returns drills from the new skill pool. The focus cycle order is pinned by the dedicated helper test in U4.
- **R7.** Component-tier test for the Swap-Focus button: tap cycles state, regenerates draft, indicator label updates. Lives at the controller test tier, not the screen test tier (per `.cursor/rules/testing.mdc` pyramid).

### Stream 2 — Skill-level mutability

- **R8.** `SessionDraft.context` (or its working analog) gains `skillLevelOverride?: SkillLevel` as optional with default `undefined`, using the D121 user-facing taxonomy from `app/src/lib/skillLevel.ts` (`foundations`, `rally_builders`, `side_out_builders`, `competitive_pair`, `unsure`). **Must not** mutate the persistent `onboarding.skillLevel` row in `storageMeta`.
- **R9.** Draft screen gains a one-tap level up/down affordance during U6 implementation. The control steps through the actionable ordered levels (`foundations` → `rally_builders` → `side_out_builders` → `competitive_pair`) and regenerates the draft; reset clears the override to `undefined`. The control does not set `unsure` directly — `unsure` remains a persistent/default fallback value.
- **R10.** Session builder reads `context.skillLevelOverride` if defined, else falls back to the persistent `onboarding.skillLevel`, then maps through `skillLevelToDrillBand()` for any soft-tuning consumption. The read path is unified (don't duplicate the read).
- **R11.** Indicator on the draft screen shows the active level: when `skillLevelOverride === undefined`, render the persistent level with a neutral label; when defined, render the override level with a "today's level" affordance and a one-tap reset.
- **R12.** New unit tests in `app/src/domain/__tests__/skillLevelOverride.test.ts` pin: (a) undefined → builder reads persistent level; (b) override defined → builder reads override and maps via `skillLevelToDrillBand()`; (c) both intermediate-mapped bands (`rally_builders`, `side_out_builders`) remain distinguishable at the context layer even though both map to `intermediate`; (d) override does not mutate `storageMeta.onboarding.skillLevel` after a session ends.
- **R13.** Component-tier test for the level affordance: level up/down steps state with caps, regenerates draft, indicator updates, persistent `unsure` is handled by the fallback path, and reset is reachable.

### Stream 3 — Catalog reserve audit

- **R14.** Audit doc exists at `docs/reviews/2026-04-28-m001-candidate-false-audit.md` with per-drill verdict table covering all 15 `m001Candidate: false` records: `d02`, `d04`, `d06`, `d07`, `d08`, `d12`, `d13`, `d14`, `d16`, `d17`, `d19`, `d20`, `d21`, `d23`, `d24`.
- **R15.** Each row records id, name, chain or grouping, `levelMin → levelMax`, primary skillFocus, source citation or citation gap, equipment dependency, participant dependency, reachability note, verdict in `{graduate-when: <condition>, hold-pending-<Dxxx-or-milestone>, demote-to-archive, retire}`, future decision unlocked / evidence to revisit, and rationale.
- **R16.** Any `retire` verdict requires written justification and a reference inventory that distinguishes removable structural catalog references from blocking behavioral/runtime references. Direct catalog references (`DRILLS`, chain `drillIds[]`, and progression links touching only the retired drill) may be deleted as part of retire application. Substitution rules are runtime behavior, not generic catalog plumbing; a retire candidate referenced by `fromDrillId`, `preferredToDrillId`, or `substituteDrillIds` is a blocking behavioral reference unless a separate plan explicitly replaces that behavior and tests it. Tests whose scenario still matters, persisted-session fixtures, and runtime code outside direct catalog membership also block retire and downgrade the verdict to a non-retire hold. `demote-to-archive` and `hold-pending` verdicts leave `drills.ts` unchanged.
- **R17.** Source/intended 3-player drills (`d08`, `d14`, `d20`) → `hold-pending-D101` per K4. This takes precedence when a drill also has group-mode implications.
- **R18.** Group drills (`d19`, `d21`, and any non-3-player group-mode records discovered during audit) → `hold-pending-M002` absent firmer rationale. `d20` is covered by R17's D101 precedence unless the audit finds a stronger source-backed reason.
- **R19.** Wall (`d24`) and net-dependent (`d23`) drills evaluated against archetype reachability.
- **R20.** Retire-verdict-only application in this PR; other verdicts ship audit doc only and **do not modify `app/src/data/drills.ts`** beyond the file-header pointer add.
- **R21.** `app/src/data/drills.ts` file-header (lines 7–13) gains a one-line pointer to the new audit doc, mirroring the existing pointer convention.

### Combined

- **R22.** PR ships with **three** atomic commits (Stream 3, Stream 1, Stream 2), in this order: Stream 3 first (independent, lowest risk), then Stream 1 (introduces the new `SetupContext` field), then Stream 2 (parallel field on the same context).
- **R23.** All existing tests pass after each atomic commit (1065+ tests as of 2026-04-28 architecture pass per `docs/status/current-state.md`). App verification runs from `app/`; root documentation verification runs from the repo root.
- **R24.** No Dexie schema migration. No telemetry changes (D131 unchanged).

**Origin actors:** A1 (founder using Tier 1c on solo or pair sessions), A2 (founder using level mutability when today differs from default), A3 (Seb using both surfaces in pair sessions), A4 (future agent reading `drills.ts` cold), A5 (future drill-level audit).

**Origin acceptance examples:** AE1 (covers R1–R7), AE2 (covers R8–R13), AE3 (covers R14–R21), AE4 (covers R22–R23).

---

## Scope Boundaries

- **Inside scope.** Tier 1c live implementation; skill-level mutability live implementation; catalog reserve audit; three atomic commits in one PR; tests at the appropriate tier per `.cursor/rules/testing.mdc`.

- **Outside this product's identity.**
  - A "level filter" feature for assembly that uses `levelMin`/`levelMax` to restrict candidate pools. The 2026-04-22 drill-level audit explicitly identified the advanced-band gap; that's a Tier-1c-shaped *follow-on* that requires a separate decision and structurally-safe pool composition first. Skill-level mutability in this plan is a **soft-tuning** consumer of the existing `onboarding.skillLevel` read path, not a hard-filter level change.
  - A persistent skill-level mutation. R8 forbids touching `storageMeta.onboarding.skillLevel`.

- **Deferred for later.**
  - SetupScreen affordance for `sessionFocus` (P11 says draft-screen, not SetupScreen).
  - SetupScreen affordance for `skillLevelOverride` (same P11 reasoning; if a Settings-side surface is needed, it's a separate ship).
  - Per-drill graduation actions for `graduate-when` / `hold-pending-*` / `demote-to-archive` verdicts (these stay deferred until each verdict's condition fires).
  - Wholesale `m001Candidate: false` deletion.
  - Hard-filter level wiring (the 2026-04-22 audit's "Layer B" target).

- **Deferred to follow-up work.**
  - Verdicts of `demote-to-archive`: separate PR, target archive location decided per-verdict.
  - Any Tier 1c follow-on (e.g., persisting last-used `sessionFocus` per device or per session): its own future ship.
  - Any skill-level-mutability follow-on (e.g., mutating the persistent level after N override sessions hint at a new permanent default): its own future ship.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/types/session.ts` — likely home of `SetupContext` type (verify in U1).
- `app/src/domain/sessionAssembly/candidates.ts` line 46 — `pickForSlot` signature already accepts `SetupContext`. Override branch lands inside this function.
- `app/src/domain/sessionAssembly/swapAlternatives.ts` line 14 (`SKILL_TAGS_BY_TYPE`) and line 37 (`findSwapAlternatives`) — second override site.
- `app/src/domain/sessionFocus.ts` (existing Tier 1a Unit 5 `inferSessionFocus(blocks)`) — read-side function; **distinct from** the new `SetupContext.sessionFocus` write-side input. Tests must not conflate them.
- `app/src/lib/skillLevel.ts` — likely home of `skillLevelToDrillBand()` shim and `onboarding.skillLevel` read path. Stream 2 unifies the read here.
- `app/src/screens/setup/draft/` (or wherever the draft screen lives) — Stream 1 button + Stream 2 affordance.
- `app/src/data/drills.ts` line 1–13 — file-header pointer conventional location.
- `app/src/data/progressions.ts` and `app/src/data/substitutionRules.ts` — Stream 3 retire applications must check these for chain `drillIds[]` and rule references.
- `docs/reviews/2026-04-22-drill-level-audit.md` — Stream 3 source-citation input.
- `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 314–322 — Stream 1 spec source.
- `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Skill-level mutability" lines 304–312 — Stream 2 spec source.

### Institutional Learnings

- No `docs/solutions/` exists; institutional knowledge lives in `docs/research/` and dated plans (verified 2026-04-28).
- Pattern: deferred drill content stays in research notes (`docs/research/jump-float-amateur-beach.md` for `d36`; §R7 memo for `d43`) rather than commented-out in `drills.ts`. Stream 3 audit doc continues this pattern.
- Pattern from `D133` (2026-04-26 trigger fire → 2026-04-27 ship): same-day or next-day implementation when a trigger fires is the canonical D130-mode shipping cadence. This plan follows that pattern for Tier 1c.

### External References

- Existing BAB + FIVB source notes already loaded for any drill-related decision.
- No new external research warranted — D135 + the architectural-prereqs spec + the file-header pointers are all internal.

### Slack context

Not requested for this plan. Skipped.

---

## Key Technical Decisions

- **K1' (replaces K1).** Tier 1c ships as **live implementation under sequencing option A**. *Rationale*: D135 fired the trigger; spec-only would now be the substitution shape. *Risk*: scope discipline — bound to the architectural-prereqs spec; no SetupScreen affordance, no level-filter wiring, no follow-on persistence.
- **K2 (preserved).** Stream 3 (audit) ships as **per-drill verdict table with retire-only application**. *Rationale*: D81 makes the reserve intentional; wholesale deletion would destroy authored assets. Defers ambiguous verdicts to follow-on PRs.
- **K3' (replaces K3).** Skill-level mutability is **included as Stream 2**. *Rationale*: D135 fired the sibling trigger same-day; the two surfaces pair architecturally on the draft screen; bundling preserves narrative coherence while atomic commits preserve revertability.
- **K4 (preserved).** Three-player drills (`d08`, `d14`, `d20`) get `hold-pending-D101` verdict, not retire. *Rationale*: BAB/FIVB source geometry is genuinely 3-player; D101 is the correct gate.
- **K5' (replaces K5).** PR ships as **one PR with three atomic commits**, not two. *Rationale*: D135 explicitly says "founder retains the choice to bundle or sequence"; bundling preserves narrative coherence; atomic commits per stream preserve per-stream revertability if either of Streams 1 or 2 surfaces unexpected complexity.
- **K6 (preserved).** Mermaid diagram in Tier 1c spec — **omit by default** (no spec doc in the new shape; this K becomes vestigial). For implementation: prose comments above the override branches are sufficient.
- **K7 (preserved).** Audit doc verdict vocabulary uses precisely four labels: `graduate-when: <condition>`, `hold-pending-<Dxxx-or-milestone>`, `demote-to-archive`, `retire`. Burden of proof on retirement.
- **K8 (new).** Skill-level mutability surface lives on the **draft screen as a one-tap level up/down**, not on Settings. *Rationale*: pairs structurally with the Tier 1c Swap-Focus button (both on draft screen); Seb's voice memos asked for courtside-immediate adjustment; Settings-side requires navigation away from the courtside surface. The override uses the D121 `SkillLevel` taxonomy, not the internal three-band `PlayerLevel` drill metadata enum.
- **K9 (new).** Stream sequencing inside the PR: **Stream 3 first, then Stream 1, then Stream 2**. *Rationale*: Stream 3 is independent and lowest-risk, but must not become a blocker for the D135-fired user-visible streams; unresolved audit debates default to `hold-pending-*`, not prolonged analysis. Stream 1 introduces the new `SetupContext.sessionFocus` field that Stream 2's `skillLevelOverride` parallels (Stream 1 establishes the optional-context-extension pattern). If Stream 2 surfaces complexity, Streams 1 and 3 are already merged-clean.
- **K10 (new).** Stream 1 gets a post-ship evidence checkpoint before Stream 2 changes the same draft surface. *Rationale*: focus picker and skill-level override answer different asks. If both land before any dogfood, the next partner/founder sessions may not reveal which control created value or confusion. Either dogfood focus picker before enabling Stream 2, or use an explicit ledger script that separately records focus-control and level-control use.

---

## Open Questions

### Resolved during planning

- **Q1.** Live scaffold vs spec-only? **Resolved K1'**: live implementation (D135 fired the trigger).
- **Q2.** Bundle skill-level mutability? **Resolved K3'**: yes, as Stream 2 with its own atomic commit.
- **Q3.** Skill-level mutability surface — Settings vs draft-screen? **Resolved K8**: draft-screen.
- **Q4.** One PR or split? **Resolved K5'**: one PR, three atomic commits.
- **Q5.** Stream sequencing? **Resolved K9**: Stream 3 → Stream 1 → Stream 2.

### Deferred to implementation

- **Q6.** Per-drill verdict for each of the 15 records — U7's analysis output.
- **Q7.** Whether any drill resolves to `retire` — answered during U7 after the reference inventory. Likely zero or one.
- **Q8.** Whether `progressions.ts` or data tests need delete-only cleanup if any retire applies — answered during U7 reference inventory and applied during U9. Substitution-rule references are blocking unless a separate behavior-preserving plan owns replacement.
- **Q12.** What counts as a blocking reference for retire? **Resolved 2026-04-29:** structural catalog references are removable during retire; runtime/persisted/behavioral references block retire and downgrade the verdict.
- **Q13.** Should participant verdicts follow current metadata or source/intended geometry? **Resolved 2026-04-29:** record both. Verdict rationale should privilege source/intended geometry when metadata is permissive but the authored drill shape is truly group/3+.
- **Q9.** Exact UI shape of the Swap-Focus button (chip / pill / segmented control) — deferred to U5 implementation; should mirror existing draft-screen affordances.
- **Q10.** Exact UI shape of the level up/down — deferred to U6 implementation; same constraint.
- **Q11.** Whether to render the active focus indicator next to the Swap-Focus button (e.g., "Focus: Pass · tap to switch") — deferred to U5; default yes for legibility.

### Stream 1/2 design guardrails (for later units)

These guardrails do not affect Stream 3, but they prevent U5/U6 from inventing UX shape during implementation:

- **Target surface.** The controls belong on the existing draft-review surface in the setup flow, grouped below the recommended-session summary and above the start/continue action. They do not move to `SetupScreen`, Safety, Settings, or Run.
- **Grouping.** Use one compact "Today's adjustments" section with two rows: Focus first, Level second. Focus may cycle `Recommended → Pass → Serve → Set → Recommended`; Level uses separate up/down controls with reset.
- **Regeneration state.** A tap disables both adjustment rows while the replacement draft is being generated. The previous draft remains visible until replacement succeeds.
- **Failure state.** If the builder cannot produce a valid replacement draft for the selected focus/level, keep the previous draft, clear or retain the attempted control state according to the implementation's existing draft-controller semantics, and show a short explanation rather than silently changing the plan.
- **Evidence checkpoint.** After Stream 1 ships, record whether the focus picker was noticed and used before Stream 2 is enabled, unless the founder explicitly chooses to bundle with a ledger script that separates the two controls.

---

## Implementation Units

Stream sequencing per K9: Stream 3 (U7–U9) ships first as the lowest-risk, independent commit; Stream 1 (U1–U5) second; Stream 2 (U6) third.

### Stream 3 — Catalog reserve audit (commit 1)

- [x] **U7. Per-drill audit research (analysis only)**

**Goal:** Produce per-drill verdicts for the 15 `m001Candidate: false` records.

**Requirements:** R14 (input), R15 (input), R16 (precondition for retire), R17, R18, R19, K7

**Dependencies:** None.

**Files (read-only):**
- `app/src/data/drills.ts` (15 records)
- `app/src/data/progressions.ts` (chain references)
- `app/src/data/substitutionRules.ts` (swap-pool references)
- `app/src/data/catalogValidation.ts` and `app/src/data/__tests__/` (validation/test references)
- `docs/reviews/2026-04-22-drill-level-audit.md` (existing source citations)
- `docs/research/fivb-source-material.md`, `docs/research/bab-source-material.md` (citation gaps)
- `docs/decisions.md` (D101, D81, D104, D121 — verdict pattern inputs)

**Approach:** Start with a preflight inventory: confirm the current `m001Candidate:false` set exactly matches the 15 records named in R14. Then run a per-drill pass collecting id, name, chain/grouping, level tags, skillFocus, source citation or citation gap, participant envelope, source/intended participant geometry, equipment dependencies, archetype reachability if the record were active, reference inventory, future decision unlocked / evidence to revisit, verdict, and justification. Treat direct catalog membership and progression references as removable only when retire can be applied by deletion, without splicing new links or rewriting behavior. Treat substitution-rule references and runtime/persisted/behavioral references as retire blockers. Verdict pattern guidance per K7 burden-of-proof bias and K4 (3-player → hold-pending-D101).

**Test scenarios:** Test expectation: none — analysis only; output is the verdict table U8 writes.

**Verification:** Preflight confirms the 15-record reserve set or records an explicit blocker. Verdicts produced for all 15 records; each `retire` has written justification plus a reference inventory showing only delete-only catalog/progression cleanup before U9. Any drill needing progression splicing, substitution-rule replacement, or behavior rewrite is downgraded to `hold-pending-*`. Verdict vocabulary stays inside the four labels (K7).

---

- [x] **U8. Author audit doc with verdict table**

**Goal:** Capture U7's analysis as a durable audit doc.

**Requirements:** R14, R15, R16, R17, R18, R19

**Dependencies:** U7.

**Files:**
- Create: `docs/reviews/2026-04-28-m001-candidate-false-audit.md`
- Modify: `docs/catalog.json` (register the audit doc)
- Modify: `docs/README.md` (ensure `docs/reviews/` is routed for human/editorial discovery)

**Approach:** Frontmatter, Purpose, Use This File When, Not For, Method, Verdict Vocabulary (K7's four labels), Verdict Table (15 rows grouped by chain), Per-Chain Notes, Cross-cutting Observations, For Agents. The table schema must include citation/citation-gap, participant dependency, equipment dependency, reachability note, future decision unlocked / evidence to revisit, verdict, rationale, and retire reference-check state so the audit is self-contained.

**Patterns to follow:** `docs/reviews/2026-04-22-drill-level-audit.md` table-per-chain structure; `docs/specs/` `For Agents` footer style.

**Test scenarios:** Test expectation: none — pure documentation.

**Verification:** File exists; frontmatter includes the required durable-doc keys; verdict table has 15 rows; all verdicts use the four-label vocabulary (K7); source/intended 3-player drills are `hold-pending-D101` unless a separate rationale overrides; group-mode holds are explicitly justified; `docs/catalog.json` registers the new doc; `docs/README.md` routes `docs/reviews/`. `bash scripts/validate-agent-docs.sh` passes, but it is not the only proof of this review doc's validity.

---

- [x] **U9. Apply retire verdicts + drills.ts header pointer (Stream 3 atomic commit)**

**Goal:** Land any retire applications, update `drills.ts` file-header, ship Stream 3.

**Requirements:** R16, R20, R21, R22, R23, R24

**Dependencies:** U8.

**Files:**
- Modify (always): `app/src/data/drills.ts` file-header (lines 7–13)
- Modify (conditional, only if any retire verdict exists): `app/src/data/drills.ts` body (remove records + DRILLS array entries), `app/src/data/progressions.ts` (delete-only removal from chain `drillIds[]` + links touching the retired drill), test files in `app/src/data/__tests__/`

**Approach:** Apply only retire verdicts that U7 already qualified. For each one, remove the drill record and `DRILLS` entry, then perform delete-only cleanup of direct progression references and obsolete data-test expectations. Do not splice progression links, rewrite substitution rules, or replace runtime behavior in this chunk; if retire requires any of those moves, stop the retire application for that drill, downgrade the audit verdict, and leave the catalog record in place. Always add the `drills.ts` file-header pointer line to the audit doc.

**Patterns to follow:** Existing file-header pointer style at `drills.ts` lines 11–13; §R7 retire/deferral pattern from `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`.

**Test scenarios:**
- Happy path: After retire applications (if any), app tests report zero failures.
- Edge case (retire candidate has only delete-only catalog/progression references): direct references are removed, and the final reference scan has no runtime app references for that drill.
- Edge case (retire candidate appears in substitution rules): verdict is treated as behavior-blocked and downgraded unless a separate plan owns the behavior replacement.
- Edge case (retire candidate has a blocking behavioral reference): verdict is downgraded in the audit; no code change for that drill.
- Edge case (zero retire verdicts): sub-step 9a skipped; only 9b + 9c run.
- Integration: lint and production build pass after any code changes.

**Verification:** For every retire applied, no runtime app references remain outside deliberate audit/provenance mentions. `app/src/data/drills.ts` header includes pointer line. `progressions.ts`, catalog validation, and data tests are consistent with `drills.ts`; `substitutionRules.ts` remains unchanged unless a future plan explicitly owns behavior replacement. App tests, lint, production build, and agent-doc validation are clean. Stream 3 stages as one atomic commit.

---

### Stream 1 — Tier 1c focus picker (commit 2)

> **Status note (2026-04-29):** U1-U5 below are retained as historical scaffolding but are not implementation-ready. A new `/ce-plan` pass should replace them with Tune today route/controller/state units from `docs/brainstorms/2026-04-29-session-focus-picker-requirements.md`. Do not implement U4 or U5 as written.

- [ ] **U1. Add `SetupContext.sessionFocus` field**

**Goal:** Land the optional field on the canonical context type with default `undefined`.

**Requirements:** R1

**Dependencies:** None.

**Files:**
- Modify: `app/src/types/session.ts` (or wherever `SetupContext` is defined — verify in U1)
- Modify: any existing `SetupContext` builders / test fixtures that explicitly construct context (verify by grep)

**Approach:** Add `sessionFocus?: 'pass' | 'serve' | 'set'` as optional. No mutation behavior; pure type extension. Default value is `undefined` everywhere (omitted in object literals). Update test fixtures only if they fail to compile.

**Patterns to follow:** Look at how existing optional context fields are defined (e.g., `wallAvailable`, `netAvailable`); mirror their style and documentation comment shape.

**Test scenarios:**
- Type-check: existing test suite compiles after the field is added (no runtime change yet).
- Test expectation: integration only — no new tests in this unit; tests land in U2/U3.

**Verification:** App typecheck/build equivalent passes; existing test suite passes; new field appears in `SetupContext` type.

---

- [ ] **U2. `pickForSlot` override branch + tests**

**Goal:** Implement R2 — when `slot.type ∈ {main_skill, pressure}` AND `context.sessionFocus !== undefined`, replace `slot.skillTags` with `[context.sessionFocus]` before calling `findCandidates`.

**Requirements:** R2, R6 (a, b, c subsets)

**Dependencies:** U1.

**Files:**
- Modify: `app/src/domain/sessionAssembly/candidates.ts` (around line 46)
- Create or extend: `app/src/domain/__tests__/pickForSlot.sessionFocus.test.ts` (or extend existing `drillSelection.test.ts`)

**Approach:** Wrap the call site that builds the slot for `findCandidates`. Pseudo-code shape (directional):

```
if ((slot.type === 'main_skill' || slot.type === 'pressure') && context.sessionFocus !== undefined) {
  slot = { ...slot, skillTags: [context.sessionFocus] }
}
return findCandidates(slot, context)
```

Do not mutate the original `slot` argument; construct a new object.

**Patterns to follow:** Existing `findCandidates` call shape in the same file; treat `slot` as immutable.

**Test scenarios:**
- Happy path (Stream 1): `sessionFocus: undefined` produces identical results to baseline (no behavior change).
- Happy path (Stream 1): `sessionFocus: 'serve'` on a `pair_open` 25-min layout produces a `main_skill` block with serve-focus drill (e.g., `d22`/`d31`/`d33`).
- Edge case: override only fires for `main_skill` and `pressure` — `technique` and `movement_proxy` slots unchanged.
- Edge case: override on `pressure` slot when `sessionFocus: 'set'` returns `d42` (the only `set`-focused pressure-eligible drill currently).

**Verification:** New tests pass; existing `drillSelection.test.ts` still passes; app lint clean.

---

- [ ] **U3. `findSwapAlternatives` override branch + tests**

**Goal:** Implement R3 — parallel override path in the swap-pool composition.

**Requirements:** R3, R6 (b, c subsets)

**Dependencies:** U1.

**Files:**
- Modify: `app/src/domain/sessionAssembly/swapAlternatives.ts` (around line 37)
- Create or extend: `app/src/domain/__tests__/findSwapAlternatives.sessionFocus.test.ts` (or extend existing `findSwapAlternatives.test.ts`)

**Approach:** Replace the `SKILL_TAGS_BY_TYPE[block.type]` read on line ~50 with a function or inline expression that reads `[context.sessionFocus]` when defined and `block.type ∈ {main_skill, pressure}`, else falls back to the existing default. `SKILL_TAGS_BY_TYPE` stays in the file as the default-fallback mapping.

**Test scenarios:**
- Happy path: `sessionFocus: undefined` produces baseline swap pool.
- Happy path: `sessionFocus: 'serve'` on a `main_skill` block produces only serve-focus alternatives.
- Edge case: override does not affect `warmup`, `technique`, `movement_proxy`, `wrap` swap pools.

**Verification:** New tests pass; existing `findSwapAlternatives.test.ts` still passes; app lint clean.

---

- [ ] **U4. Cycle-order helper + tests**

**Goal:** Implement R4's cycle order (`undefined → pass → serve → set → undefined`) as a pure helper for the controller to call.

**Requirements:** R4 (cycle-order subset), R6 (d subset)

**Dependencies:** U1.

**Files:**
- Create: `app/src/domain/sessionFocusCycle.ts` (or extend existing `sessionFocus.ts` if it's the right home — verify it doesn't conflict with Tier 1a Unit 5's `inferSessionFocus`)
- Create: `app/src/domain/__tests__/sessionFocusCycle.test.ts`

**Approach:** Pure function `cycleSessionFocus(current: 'pass' | 'serve' | 'set' | undefined): 'pass' | 'serve' | 'set' | undefined`. Implements R4's cycle exactly.

**Test scenarios:**
- `undefined → 'pass'`
- `'pass' → 'serve'`
- `'serve' → 'set'`
- `'set' → undefined`

**Verification:** All four scenarios pass; app lint clean.

---

- [ ] **U5. Draft-screen Swap-Focus button + active-focus indicator + controller test**

**Goal:** Implement R4 (button) + R5 (recommend-first default rendering when `sessionFocus === undefined`) + R7 (controller test).

**Requirements:** R4, R5, R7

**Dependencies:** U1, U2, U3, U4.

**Files:**
- Modify: draft-screen component(s) — locate via grep on existing draft screen (e.g., `app/src/screens/setup/draft/` or analogous path)
- Modify: draft-screen controller hook
- Create or extend: controller test file

**Approach:** Add Swap-Focus button + active-focus indicator. Tap calls controller method that calls `cycleSessionFocus(currentSessionFocus)`, mutates draft context, regenerates the draft. Indicator label reads:
- `sessionFocus === undefined`: render `inferSessionFocus(blocks)` label as today (recommend-first).
- `sessionFocus === 'pass' | 'serve' | 'set'`: render that label as the active "today's focus."

**Patterns to follow:** Look at existing draft-screen affordances (e.g., the End Session Early button shape, the existing Swap button if any); mirror placement and accessibility.

**Test scenarios:**
- Happy path: tap → cycle from undefined → pass; indicator updates; draft regenerates.
- Happy path: four taps in a row return to undefined.
- Edge case: when `sessionFocus === undefined`, indicator reads inferred focus from `inferSessionFocus(blocks)`.
- Integration (controller-tier per `.cursor/rules/testing.mdc`): controller dispatches the cycle, regenerates the draft, and the new draft contains a `main_skill` drill matching the new focus.

**Verification:** Component-tier and controller-tier tests pass; manual smoke on a built dev server confirms tap-cycle, draft regeneration, disabled/regenerating state, and preserve-previous-draft-on-failure behavior; app lint and build are clean.

---

### Stream 2 — Skill-level mutability (commit 3)

- [ ] **U6. Skill-level mutability field + builder consumption + draft-screen affordance + tests**

**Goal:** Implement R8–R13 in one unit (smaller surface than Stream 1; doesn't warrant its own subdivision).

**Requirements:** R8, R9, R10, R11, R12, R13

**Dependencies:** U1 (establishes the optional-context-extension pattern), U5 (establishes the draft-screen affordance pattern).

**Files:**
- Modify: `app/src/types/session.ts` (or wherever `SessionDraft.context` is defined) — add `skillLevelOverride?: SkillLevel`
- Modify: `app/src/lib/skillLevel.ts` (or wherever the persistent level is read by the builder) — unify the read so override wins when defined and maps through `skillLevelToDrillBand()`
- Modify: draft-screen component(s) — add level up/down affordance + active-level indicator with reset
- Modify: draft-screen controller hook
- Create: `app/src/domain/__tests__/skillLevelOverride.test.ts`
- Extend: controller test file

**Approach:**
1. Add the optional field to the context type using the D121 `SkillLevel` taxonomy.
2. Locate every read of `onboarding.skillLevel` in the builder; replace each with a unified read that prefers `context.skillLevelOverride` when defined, then maps through `skillLevelToDrillBand()`. Do not duplicate the read.
3. Add the level-up / level-down affordance to the draft screen with a one-tap reset (clears the override). Indicator label reads: persistent level when override undefined, override level with "today's level" framing when defined.
4. Verify in tests that the override does not mutate `storageMeta.onboarding.skillLevel`.

**Patterns to follow:** Stream 1's `SetupContext.sessionFocus` shape; Stream 1's draft-screen Swap-Focus button placement.

**Test scenarios:**
- Happy path: `skillLevelOverride === undefined` → builder reads persistent D121 skill level (regression).
- Happy path: `skillLevelOverride === 'competitive_pair'` → builder reads the override and maps it to `advanced` even when persistent is lower.
- Edge case: `rally_builders` and `side_out_builders` remain distinct override values but both map to the internal `intermediate` drill band.
- Edge case: persistent `unsure` maps through the fallback path; reset clears override back to `undefined`.
- Edge case: after a session ends, `storageMeta.onboarding.skillLevel` is unchanged (R8 forbid mutation).
- Edge case: tap level-up at `competitive_pair` is a no-op (cap); tap level-down at `foundations` is a no-op.
- Edge case: tap reset clears override → `undefined` → indicator returns to persistent level.
- Controller-tier: tap dispatches override mutation, regenerates draft, draft reflects new level.

**Verification:** All tests pass; `storageMeta` unchanged after override session; app tests, lint, and build are clean.

---

## System-Wide Impact

- **Interaction graph.** Stream 1 introduces one new draft-screen interaction (Swap-Focus button); Stream 2 introduces one new draft-screen interaction (level up/down + reset). Both regenerate the draft via existing builder paths; no new persistence layers.
- **Error propagation.** N/A; both new fields are optional and safe at `undefined`.
- **State lifecycle risks.** Stream 2 explicitly forbids mutation of persistent `onboarding.skillLevel` (R8); test pins this. Stream 1 has no persistence.
- **API surface parity.** `SetupContext` type extension is non-breaking (optional field); `SessionDraft.context` extension same. No external consumers; this is internal-only.
- **Integration coverage.** Existing test suite (1065+ tests). New tests at the appropriate tier per `.cursor/rules/testing.mdc` (domain for cycle helper + override branches, controller for affordance behavior).
- **Unchanged invariants.**
  - `D81` reserve mechanism (`m001Candidate: false`) — unchanged.
  - `P11` recommend-first — preserved (both surfaces default to `undefined` = builder picks).
  - `D104` 50-contact gate — unchanged (skill-level override is soft-tuning, not a contact-counting change).
  - `D121` per-skill vector — unchanged.
  - `D131` no telemetry — unchanged (no analytics added).
  - Tier 1c trigger conditions — unchanged (the trigger fired; the conditions stay as-is).
  - Founder-use mode (`D130`) posture — unchanged.
  - Tier 1b authoring-budget cap — unchanged at 4/10.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Override branch in `pickForSlot` accidentally fires for non-`main_skill`/`pressure` slots | R2 specifies the exact slot-type predicate; tests pin the negative cases (warmup/technique/movement_proxy/wrap unchanged) |
| `findSwapAlternatives` override drifts from `pickForSlot` override | Both implementations are unit-tested; the override semantics are stated identically in R2 and R3; review checks parity |
| Skill-level override accidentally persists | R8 + U6 test pin `storageMeta.onboarding.skillLevel` unchanged after a session that used override |
| Skill-level override confuses D121 user taxonomy with drill metadata levels | R8 / R10 / U6 require `SkillLevel` at the context boundary and `skillLevelToDrillBand()` for internal soft tuning |
| Tier 1c UI lands on SetupScreen by accident | R4 explicitly forbids; review checks; SetupScreen test files are not modified |
| Stream 1 / Stream 2 merge conflicts on the draft-screen component | K9 sequencing puts Stream 1 first; Stream 2 layers on top with awareness of Stream 1's structure |
| Stream 3 retire applies a drill with behavioral references | U7's reference inventory treats substitution rules, persisted fixtures, and runtime behavior as retire blockers; U9 only performs delete-only catalog/progression cleanup |
| Skill-level mutability bundles silently expand into a Settings-side surface | K8 explicitly chose draft-screen; Settings surface is out of scope (deferred-for-later) |
| Implementation reveals an unexpected coupling that breaks K5' bundling assumption | Stream 3 ships first per K9 — if Streams 1/2 surface coupling pain, Stream 3 is already merged-clean; remaining streams can split into a follow-on PR if needed |

---

## Documentation / Operational Notes

- **Docs touched by Stream 3**: 1 new audit doc, 1 audit-doc registration in `docs/catalog.json`, 1 `docs/README.md` review-folder routing row, and 1 file-header pointer in `drills.ts`. Optional retire-verdict applications only when U7 qualifies them.
- **Docs touched by Streams 1/2**: after those streams land, the Tier 1a implementation plan §"Tier 1c trigger" / §"Skill-level mutability" should gain landed-status pointers to this implementation plan. Stream 3 must not edit those source-spec sections.
- **Operational rollout**: none in the deployment sense; the changes are local-first and non-breaking.
- **Future agent reading**: the spec source for both new surfaces remains the Tier 1a implementation plan — this plan is the *implementation* artifact, not the spec. When Tier 1c needs follow-on work, the spec is still the architectural-prereqs block.

---

## Sources & References

- **Origin document**: [docs/brainstorms/2026-04-28-tier-1c-prepay-and-catalog-audit-requirements.md](../brainstorms/2026-04-28-tier-1c-prepay-and-catalog-audit-requirements.md) (revised 2026-04-28 post-D135 to flip K1 → K1' and K3 → K3')
- **Ideation artifact**: [docs/ideation/2026-04-28-what-to-add-next-ideation.md](../ideation/2026-04-28-what-to-add-next-ideation.md) (with revision note)
- **Triggering decision**: `D135` in `docs/decisions.md`
- **Tier 1c spec source**: `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 314–322
- **Skill-level mutability spec source**: `docs/plans/2026-04-20-m001-tier1-implementation.md` lines 304–312
- **Related plans**: `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` (cap state, 4/10), `docs/plans/2026-04-20-m001-adversarial-memo.md` (cap discipline, D135 amendment log)
- **Related research**: `docs/research/2026-04-27-cca2-dogfeed-findings.md` F4 (Seb voice memo on focus + skill-level), `docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` (build-17 repeat asks), `docs/research/2026-04-28-audio-pacing-reliability-investigation.md` (sibling in-flight S1 ship; coordinate touches)
- **Related reviews**: `docs/reviews/2026-04-22-drill-level-audit.md` (Stream 3 source-citation input)
- **Related decisions**: `docs/decisions.md` D81, D91, D101, D104, D121, D130, D132, D135
