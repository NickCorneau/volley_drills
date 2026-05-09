---
title: "M001 build-complete relabel + validation-overhang scoreboard"
type: docs
status: complete
date: 2026-05-09
completed: 2026-05-09
---

# M001 build-complete relabel + validation-overhang scoreboard

## Summary

Relabel M001 to make its current posture visible at a glance — build phase complete, validation phase active, polish phase deferred — without distorting the D130 validation framework, without faking gate closures, and without breaking the M002 dependency on the M001 Tier 2 history list. Net effect: psychological closure of M001 build-out + a clean scoreboard for the remaining gates + a backlog doc for trigger-gated content adds, so the user can move attention to M002 while M001 quietly carries its overhang in named files instead of in their head.

---

## Problem Frame

M001 currently reads as `status: active, stage: validation` in its frontmatter. Substantively, the build phase has shipped (Tier 1a + 1b Layer A + 1c, plus all BAB-derived agent-actionable items as of `fb631dd` and `D141`/`D142`/`D143`/`D144` on 2026-05-08), so there are zero remaining agent-actionable code tasks. What remains is calendar-gated validation (2026-05-12, 2026-05-21, 2026-07-20), conditional Tier 2 polish, and trigger-gated content adds (Tier 1b residual cap, `d36`, `d43`).

The user's stated preference is to close M001 fully before starting M002. Two failure modes to avoid:

- **Faking validation passes.** D130's adversarial memo exists precisely because "personal conviction" is not falsifiable; closing Conditions 1/2/3 without evidence kills the only feedback channel the architecture has.
- **Merging gates into M002.** M002's `depends_on` already names the M001 Tier 2 history list as a prerequisite; moving Tier 2 surfaces into M002 inverts that dependency and erases M002's coherent identity ("weekly confidence loop").

The right move is the labeling fix: split build status from validation status visibly in the docs, so M001 reads as "build complete, validation overhanging" without lying about either.

---

## Requirements

- R1. M001 milestone doc reads at a glance as "build phase complete, validation active" without changing the D130 framework or its calendar gates.
- R2. The remaining validation gates (D130 Conditions 1/2/3, D134 Phase 2A streak gate, 2026-05-12 / 2026-05-21 / 2026-07-20 calendar dates) are enumerated in a single named scoreboard doc that any agent or future-self can scan in <30 seconds.
- R3. Trigger-gated content adds (Tier 1b residual cap, `d36`, `d43`, Phase 2B per-drill capture shapes) are enumerated in a single named backlog doc with their gating conditions, so the M001 milestone doc can stop carrying them inline.
- R4. `docs/catalog.json` registers the two new status docs, updates the M001 entry's `canonical_for` to reflect the relabel, and continues to pass `bash scripts/validate-agent-docs.sh`.
- R5. `docs/status/current-state.md` references the new scoreboard so the live posture doc stays the single canonical source for "what's true now."
- R6. M001 milestone frontmatter `status` stays `active` (validation is genuinely active and `complete` would be a false signal); `stage` updates from `validation` → `build-complete-validating` to make the split visible. No changes to `status_vocabularies` in catalog.json — `stage` is free-form per the existing catalog convention.
- R7. M002 is untouched by this plan. Activating M002 is a separate next move.

---

## Scope Boundaries

- This plan does **not** flip M001 milestone `status` to `complete`. Validation is ongoing through 2026-07-20 and `complete` would mislead future readers.
- This plan does **not** close any D130 conditions, the D134 Phase 2A streak gate, or any tier-bound trigger. Evidence-based reads stay evidence-based.
- This plan does **not** move Tier 2 surfaces into M002. M002's `depends_on` chain already names the M001 history list as a prerequisite.
- This plan does **not** activate M002 (frontmatter changes, scope refresh, planning advance). That's a separate plan.
- This plan does **not** touch app code under `app/`. Pure docs + catalog work.

### Deferred to Follow-Up Work

- M002 activation (frontmatter flip from `status: draft, stage: planning` to active, scope refresh, first M002 implementation plan): separate plan, to be opened immediately after this one if the user wants.
- Periodic scoreboard refresh discipline: out of scope. The scoreboard is a static enumeration of the gates; it doesn't introduce a new ritual that the weekly Monday adversarial-memo review doesn't already own.

---

## Context & Research

### Relevant Code and Patterns

- `docs/status/current-state.md` — only existing `type: status` doc. Frontmatter convention for status-family docs to mirror.
- `docs/milestones/m001-solo-session-loop.md` — milestone doc to relabel. Tier 1a/1b/1c/Tier 2 sections (lines ~242–278) stay unchanged in content; the new "Phase Posture" section sits above them; the "Current remaining M001 routing" paragraph (line 282) collapses into pointers to the two new docs.
- `docs/catalog.json` — `docs[]` array, `status_vocabularies.doc_status.values: [draft, active, complete, superseded]`. Both new docs use `status: active` (they are live working scoreboards, not draft proposals or completed artifacts). M001's `stage` is free-form; no vocabulary update needed.
- `docs/plans/2026-04-20-m001-adversarial-memo.md` — authoritative source for D130 early-re-eval triggers and falsification conditions. Scoreboard cites this, never restates.
- `docs/research/founder-use-ledger.md` — authoritative source for D134 streak falsification gate (lines ~58–60) and the channel-mix evidence base. Scoreboard cites this.
- `docs/decisions.md` — authoritative for D130, D134, D135, D141. Scoreboard cites by D-ID, never copies.

### Institutional Learnings

- `.cursor/rules/machine-scannable-docs.mdc`: AGENTS.md and docs/catalog.json are the canonical agent entry surfaces; new durable docs need YAML frontmatter with `id, title, status, stage, type, summary` and (for core/milestone/spec) `authority, last_updated, depends_on`. Both new docs follow this contract.
- `.cursor/rules/machine-scannable-docs.mdc`: when adding cataloged docs, update `docs/catalog.json` in the same pass and run `bash scripts/validate-agent-docs.sh`.
- `AGENTS.md` learned-preferences: "Prefer deleting or demoting stale documentation rather than leaving misleading material at canonical tiers." This plan's posture: collapse stale inline lists in M001 doc into pointers to the new scoreboards; the scoreboards then become the single source for those lists going forward.

### External References

- None. Internal docs-systems work only.

---

## Key Technical Decisions

- **Keep `status: active`, change `stage: validation` → `stage: build-complete-validating` on M001.** Reasons: (a) `status: complete` would lie about validation; (b) `stage` is free-form in the catalog convention so adding a compound value is safe; (c) the new stage value reads at a glance as "the build is done, validation is ongoing" without needing the reader to open the body.
- **Two new docs (scoreboard + backlog), not one.** Time-gated validation and trigger-gated content adds answer different questions ("when do I read what?" vs. "what do I add when X happens?") and have different audiences (validation overhang is the founder's read at calendar dates; content backlog is the agent's pickup list when a trigger fires). Splitting them keeps each doc scannable.
- **Pointers, not copies.** Both new docs cite D-IDs and link to authoritative sources (adversarial memo, founder-use ledger, decisions.md). They do not restate gate definitions, falsification conditions, or trigger criteria — those stay where the source-of-truth order says they live. This avoids documentation drift.
- **No M002 changes in this plan.** M002 activation deserves its own plan with its own scope (likely an implementation-plan scaffold, not a frontmatter flip). Bundling them risks dilution and makes the diff harder to review.
- **Both new docs use `type: status` and `status: active`.** They are live working scoreboards that update as gates fire / triggers fire / dates pass. Not `type: plan` (no implementation units), not `type: research` (not exploratory). The existing `current-state.md` is the only prior `type: status` doc, so this introduces a small `docs/status/` family.

---

## Open Questions

### Resolved During Planning

- Should M001 frontmatter `status` flip to `complete`? **No.** Validation is genuinely active and `complete` would mislead.
- Should the scoreboard introduce its own rhythm/ritual? **No.** The weekly Monday adversarial-memo review already owns the read-out cadence; the scoreboard is a static enumeration that the existing review reads alongside its other inputs.
- Should the content-backlog doc include `d36` and `d43` even though both are externally gated (`O7` PT review and `D101` schema work)? **Yes.** The backlog is the canonical "where do these live now that they're not inline in the milestone doc" answer; deferring them to vague "general backlog" loses the gating context.
- Should AGENTS.md or CLAUDE.md update? **No.** Both already say "Active milestone: M001" which stays correct (validation is active). No routing surface changes.

### Deferred to Implementation

- Exact wording of the new "Phase Posture" header section in the M001 milestone doc — finalize during write, keep tight (≤6 lines).
- Exact wording of the scoreboard's per-gate entries — finalize during write, target one short paragraph per gate plus a "next read" date.

---

## Implementation Units

- U1. **Create `docs/status/m001-validation-overhang.md` (validation scoreboard)**

**Goal:** Single named scoreboard doc that enumerates every M001 validation gate (calendar-dated and condition-based) so the founder/agent can scan "what am I waiting on, and when do I check next?" in under 30 seconds without opening the adversarial memo or decisions.md.

**Requirements:** R2

**Dependencies:** None

**Files:**
- Create: `docs/status/m001-validation-overhang.md`

**Approach:**
- Frontmatter: `id: m001-validation-overhang`, `title: "M001 Validation Overhang"`, `status: active`, `stage: build-complete-validating`, `type: status`, `summary: "Single-page scoreboard of the M001 validation gates (D130 conditions, D134 Phase 2A gate, 2026-05-12 / 2026-05-21 / 2026-07-20 calendar reads). Build phase is complete; this doc tracks what closes M001."`, `authority: "Read-only scoreboard for M001 validation gates; cites authoritative sources, does not restate them."`, `last_updated: 2026-05-09`, `depends_on: [docs/decisions.md, docs/plans/2026-04-20-m001-adversarial-memo.md, docs/research/founder-use-ledger.md, docs/milestones/m001-solo-session-loop.md, docs/status/current-state.md]`, `decision_refs: [D130, D134, D135, D141]`.
- Body sections (in this order): `## Agent Quick Scan` (3-5 bullets), `## Phase Posture` (1 paragraph: build complete, validation active, polish deferred), `## Calendar-Dated Reads` (2026-05-12 D134 Phase 2A read-out; 2026-05-21 D130 Condition 3 final read-out; 2026-07-20 D130 founder-use re-eval), `## D130 Falsification Conditions` (Conditions 1/2/3 with evidence channel and current-state link, no fabricated reads), `## D130 Early Re-eval Triggers` (low cadence, long silence, scope leak, UP trigger, agent-asymmetry — cite adversarial memo, don't restate), `## D134 Phase 2A Streak Gate` (cite founder-use ledger lines ~58–60, don't restate), `## What Closes M001` (the decision rule from the milestone doc lines ~286: default option (a) friends-of-friends if Conditions 1-3 pass and Tiers 1a + 2 shipped; founder-only continuation requires written falsifiable justification co-signed by named non-founder reader).
- All gate definitions cite source-of-truth doc + line range; do not restate.
- One paragraph per gate, max ~5 lines. Whole doc fits on one phone screen for the Quick Scan.

**Patterns to follow:**
- `docs/status/current-state.md` — frontmatter shape, "Agent Quick Scan" section header, citation-not-restatement discipline.

**Test scenarios:**
- Happy path: doc renders with all required frontmatter fields per `.cursor/rules/machine-scannable-docs.mdc`; `bash scripts/validate-agent-docs.sh` passes.
- Edge case: every cited authoritative doc path resolves to an existing file (no broken refs in `depends_on`).
- Integration: doc is registered in `docs/catalog.json` `docs[]` array (covered by U4).

**Verification:**
- File exists at `docs/status/m001-validation-overhang.md` with the section structure above.
- Every D-ID and gate name in the body resolves to a citable line in the cited source doc.
- No fabricated condition closures — every "current state" entry either says "active, evidence pending" or links to a source-of-truth doc that documents the actual state.

---

- U2. **Create `docs/status/post-m001-content-backlog.md` (trigger-gated content backlog)**

**Goal:** Single named backlog doc that enumerates every trigger-gated content addition that's been pulled out of the M001 milestone-doc inline lists, with each item naming its trigger condition and authoritative source, so the agent picks them up cleanly when triggers fire.

**Requirements:** R3

**Dependencies:** None

**Files:**
- Create: `docs/status/post-m001-content-backlog.md`

**Approach:**
- Frontmatter: `id: post-m001-content-backlog`, `title: "Post-M001 Content Backlog"`, `status: active`, `stage: trigger-gated`, `type: status`, `summary: "Trigger-gated content additions parked outside the M001 milestone doc body. Each entry names its trigger and authoritative source. Picked up when triggers fire; otherwise dormant."`, `authority: "Backlog of trigger-gated content adds (Tier 1b residual cap, deferred drills, Phase 2B capture shapes); cites authoritative triggers, does not redefine them."`, `last_updated: 2026-05-09`, `depends_on: [docs/decisions.md, docs/plans/2026-04-20-m001-adversarial-memo.md, docs/plans/2026-04-20-m001-tier1-implementation.md, docs/research/founder-use-ledger.md, docs/milestones/m001-solo-session-loop.md]`, `decision_refs: [D101, D130, D133, D134, D135, O7]`.
- Body sections (in this order): `## Agent Quick Scan` (3-5 bullets), `## Tier 1b Drill-Cap Residual` (current 4/10 consumed, 6 unspent — list the named candidates: pair opening-block, pair role-swap audio cue, Framing C in-session running rep counter, tap-to-expand per-stretch demo — with their trigger-fire status and source), `## Externally Gated Drills` (`d36 Jump Float Introduction` — waits on `O7` PT review; `d43 Triangle Setting` — waits on `D101` 3+ player schema), `## Conditional Capture Shapes` (Phase 2B per-drill capture shapes — gated on D134 Phase 2A read-out 2026-05-12), `## How To Pick Items Up` (one paragraph: when a trigger fires per the cited source, open a fresh `feat:` plan, reference the backlog entry; the backlog is the routing destination, not an authority on the trigger itself).
- One paragraph per item, max ~4 lines. Cite the trigger source; do not restate.

**Patterns to follow:**
- U1's frontmatter and citation-discipline pattern.

**Test scenarios:**
- Happy path: doc renders with required frontmatter; `bash scripts/validate-agent-docs.sh` passes.
- Edge case: every gating decision/trigger ID resolves to a citable line in the cited source doc.
- Integration: doc is registered in `docs/catalog.json` `docs[]` array (covered by U4).

**Verification:**
- File exists at `docs/status/post-m001-content-backlog.md` with the section structure above.
- Every backlog item names a specific trigger-fire condition (not "someday" or "if needed").

---

- U3. **Relabel M001 milestone doc**

**Goal:** Make the build-complete / validation-active split visible in the M001 milestone doc itself: change `stage`, add a prominent "Phase Posture" section near the top, collapse the inline "remaining work" lists into pointers to the two new status docs.

**Requirements:** R1, R6

**Dependencies:** U1, U2 (the pointer destinations must exist)

**Files:**
- Modify: `docs/milestones/m001-solo-session-loop.md`

**Approach:**
- Frontmatter: `stage: validation` → `stage: build-complete-validating`. `last_updated: 2026-05-09`. Add `docs/status/m001-validation-overhang.md` and `docs/status/post-m001-content-backlog.md` to `depends_on`. `status` stays `active`. `decision_refs` unchanged.
- Add a new top-level section `## Phase Posture` immediately after the existing first section header (likely after `# M001: Solo Session Loop` or after the `## Agent Quick Scan` if present). Contents: 4-6 lines stating "Build phase: complete (2026-05-08). Validation phase: active. Polish phase (Tier 2): deferred until D130 Condition 3 read-out 2026-05-21." Link to `docs/status/m001-validation-overhang.md` and `docs/status/post-m001-content-backlog.md`.
- The existing "Current remaining M001 routing (2026-05-08):" paragraph (line ~282): keep the agent-actionable bullet (already says "all BAB-derived agent-actionable items have shipped"); replace the "Evidence-gated M001 work" bullet with one line pointing at `docs/status/m001-validation-overhang.md` and `docs/status/post-m001-content-backlog.md` ("see [validation overhang] for the calendar-dated reads and condition gates; see [post-M001 content backlog] for trigger-gated content adds"); keep the "Date-gated validation" bullet but trim it to its essence (D130 + D91 mention) since detail is now in the scoreboard.
- Tier 1a / 1b / 1c / Tier 2 / Tier 3 section content is unchanged. The Tier 2 paragraph still owns the Tier 2 surface contract; the scoreboard just enumerates *when* the gating conditions get read, not *what* Tier 2 ships.

**Patterns to follow:**
- Existing `## Phase` / `## Current State` / `## Tier` structure in the M001 doc — reuse the heading style.
- `AGENTS.md` `## Current State` section — short, scan-first, links out for detail.

**Test scenarios:**
- Happy path: M001 doc renders with new `## Phase Posture` section near top; `bash scripts/validate-agent-docs.sh` passes.
- Edge case: the two new `depends_on` paths resolve.
- Integration: catalog.json M001 entry's `canonical_for` is updated in U4 to reflect the relabel.

**Verification:**
- `## Phase Posture` is the second body section (after the Agent Quick Scan if present, or directly after the H1 if not).
- Frontmatter `stage: build-complete-validating`.
- The "Current remaining M001 routing" paragraph routes through the two new status docs instead of inlining the lists.

---

- U4. **Update `docs/catalog.json`**

**Goal:** Register the two new status docs in the catalog `docs[]` array, update the M001 entry's `canonical_for` to reflect the relabel, and ensure the validation script still passes.

**Requirements:** R4

**Dependencies:** U1, U2, U3 (the docs and the milestone update must exist before catalog references them)

**Files:**
- Modify: `docs/catalog.json`

**Approach:**
- Add two new entries to the `docs[]` array (mirroring the shape of the existing `docs/status/current-state.md` entry):
  - `docs/status/m001-validation-overhang.md`: `type: status`, `status: active`, `canonical_for: "Single-page scoreboard of M001 validation gates: D130 falsification conditions, D130 early re-eval triggers, D134 Phase 2A streak gate, and the calendar-dated reads (2026-05-12 / 2026-05-21 / 2026-07-20)."`.
  - `docs/status/post-m001-content-backlog.md`: `type: status`, `status: active`, `canonical_for: "Backlog of trigger-gated content adds parked outside the M001 milestone body: Tier 1b drill-cap residual (4/10 consumed), externally gated drills (d36 / d43), and conditional Phase 2B capture shapes."`.
- Update the existing M001 milestone entry (`docs/milestones/m001-solo-session-loop.md`) `canonical_for` field to mention the build-complete posture: append "Refreshed 2026-05-09: phase posture made explicit (build complete, validation active, polish deferred); validation gates and content backlog routed to docs/status/m001-validation-overhang.md and docs/status/post-m001-content-backlog.md."
- Update `last_updated` at the top of catalog.json to `2026-05-09`.
- No changes to `status_vocabularies` (status values used are already in the vocab; `stage` is free-form per existing convention).

**Patterns to follow:**
- Existing `docs/status/current-state.md` catalog entry shape — mirror it for the new status docs.
- `update_routing` block (if present) — check whether any routing rules need to learn about the new doc paths; likely no (the new docs are read-on-demand, not always-read).

**Test scenarios:**
- Happy path: `bash scripts/validate-agent-docs.sh` exits 0.
- Edge case: catalog JSON parses cleanly (no trailing commas, no malformed entries).
- Edge case: `canonical_for` strings are non-empty and descriptive.

**Verification:**
- `bash scripts/validate-agent-docs.sh` exits 0.
- `jq '.docs | length'` returns the previous count + 2.

---

- U5. **Update `docs/status/current-state.md`**

**Goal:** Make the live posture doc point at the new validation-overhang scoreboard so it stays the single canonical source for "what's true now," with the build-complete posture surfaced in its current-state read.

**Requirements:** R5

**Dependencies:** U1 (overhang doc must exist)

**Files:**
- Modify: `docs/status/current-state.md`

**Approach:**
- Frontmatter: add `docs/status/m001-validation-overhang.md` and `docs/status/post-m001-content-backlog.md` to `depends_on`. Refresh `last_updated: 2026-05-09`.
- In the body section that summarizes M001 posture (near the top, currently mentions "M001 Solo Session Loop, on top of the v0b Starter Loop under app/" or similar), add a parenthetical: "(Build phase complete as of 2026-05-08; validation overhang tracked in docs/status/m001-validation-overhang.md.)" — keep it short.
- In the "Recent Shipped History" section: add a 2026-05-09 entry that names this relabel work explicitly ("M001 build-complete relabel: new validation-overhang scoreboard and post-M001 content backlog docs land; M001 milestone stage flips to build-complete-validating; no functional changes, paper-trail hygiene only.").
- No other current-state changes.

**Patterns to follow:**
- Existing "Recent Shipped History" entries in `docs/status/current-state.md` — same shape (date header, terse description, doc references).

**Test scenarios:**
- Happy path: current-state.md renders; `bash scripts/validate-agent-docs.sh` passes.
- Integration: a future agent reading current-state.md is one click away from the validation overhang scoreboard.

**Verification:**
- `depends_on` includes the two new docs.
- 2026-05-09 entry exists in Recent Shipped History.
- The M001 posture summary mentions build-complete posture and links to the overhang doc.

---

- U6. **Verify**

**Goal:** Confirm the doc changes pass machine validation and read coherently as a set.

**Requirements:** R4 (validate-agent-docs.sh) and the implicit "all the other Rs hold together" check.

**Dependencies:** U1, U2, U3, U4, U5

**Files:**
- Test: none — verification is via shell command and doc-set re-read.

**Approach:**
- Run `bash scripts/validate-agent-docs.sh` and confirm exit 0.
- Re-read the M001 milestone doc top-to-Phase-Posture-section and confirm it reads as "build complete, validation active" without contradiction.
- Re-read the two new status docs end-to-end and confirm they are scannable in <30 seconds each (Quick Scan up top, no buried critical context).
- Re-read `docs/status/current-state.md` and confirm the M001 posture sentence is one short sentence (not a paragraph).

**Test scenarios:**
- Test expectation: validate-agent-docs.sh exits 0; manual scan-test on the four touched/created docs.

**Verification:**
- `bash scripts/validate-agent-docs.sh` reports zero errors.
- Each new doc fits its Quick Scan + structure within one phone screen at default font size.

---

## System-Wide Impact

- **Interaction graph:** AGENTS.md (read by every cold start) → docs/catalog.json → docs/status/current-state.md → new docs/status/m001-validation-overhang.md and docs/status/post-m001-content-backlog.md. Every agent reading current-state.md will be one link away from the validation overhang.
- **Error propagation:** None — pure docs work. The risk is the validation script (`bash scripts/validate-agent-docs.sh`) failing if a new doc is missing required frontmatter fields. U1 and U2 explicitly enumerate the frontmatter fields; U6 catches it.
- **State lifecycle risks:** None — no state, no migration, no flag.
- **API surface parity:** None — no app code touched.
- **Integration coverage:** The validation script run in U6 covers the docs-machine-readability contract.
- **Unchanged invariants:** D130 framework, D134 falsification gate, M002 `depends_on` chain, M001 product contract scope, all decision IDs (D6 → D144), `status_vocabularies` in catalog.json, AGENTS.md routing, CLAUDE.md routing, all `app/` code.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| New `stage: build-complete-validating` value confuses downstream tooling that expects single-word stage values | Spot-check `bash scripts/validate-agent-docs.sh` output; the script reads `stage` as free-form per the existing convention (no `stage_vocabularies` exists). U6 catches if this assumption is wrong. |
| The two new status docs become stale (the gates / triggers they list change) and start lying | Both docs cite source-of-truth docs by D-ID and line range rather than restating definitions; staleness is bounded to "the source moved" rather than "the scoreboard's content drifted from the source." Periodic refresh is owned by the existing weekly Monday adversarial-memo review. |
| User reads "build-complete-validating" as `complete` and forgets the validation overhang | The Phase Posture section in the M001 doc spells out "validation active" explicitly; the overhang scoreboard is one link away in current-state.md. |
| The relabel feels like cosmetic shuffling without real progress | Acknowledged. The value is psychological/orientational — the user explicitly asked for closure, and this delivers closure honestly. The cost is ~1 plan + ~6 small file changes; the alternative (carrying M001 in head as "still active build work" indefinitely) is worse. |

---

## Documentation / Operational Notes

- After this plan ships, the natural next move is to open a separate `feat:` plan for **M002 activation** (frontmatter flip, scope refresh, first M002 implementation slice). That plan is explicitly out of scope here.
- The validation overhang scoreboard becomes the agent's go-to read for "what am I waiting on for M001?" — agents should consult it before suggesting M001 work, just as they consult current-state.md before declaring posture.
- No rollout, no migration, no flag — single-commit doc work.

---

## Sources & References

- Origin (this conversation): user request to close M001 cleanly via Option C from the prior turn.
- Source-of-truth docs: `docs/decisions.md` (D130, D134, D135, D141), `docs/plans/2026-04-20-m001-adversarial-memo.md`, `docs/research/founder-use-ledger.md`, `docs/milestones/m001-solo-session-loop.md`, `docs/milestones/m002-weekly-confidence-loop.md`, `docs/status/current-state.md`.
- Doc contract: `.cursor/rules/machine-scannable-docs.mdc`, `.cursor/rules/repo-operating-model.mdc`, `AGENTS.md`.
- Validation: `scripts/validate-agent-docs.sh`.
