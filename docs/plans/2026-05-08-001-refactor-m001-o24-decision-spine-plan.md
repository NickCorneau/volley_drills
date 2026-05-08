---
id: m001-o24-decision-spine-plan-2026-05-08
title: "refactor: Refresh M001 and Resolve O24 Decision Spine"
type: plan
status: complete
stage: validation
summary: "Refresh M001 milestone language and resolve O24 with D141: M001 keeps single-skill-chain generation constraint without canonizing it as a permanent product principle."
last_updated: 2026-05-08
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/status/current-state.md
  - docs/decisions.md
  - docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/bab-source-material.md
  - docs/catalog.json
---

# refactor: Refresh M001 and Resolve O24 Decision Spine

## Summary

Refresh the M001 milestone so it reflects the current M001-shaping decisions after the D137-D140 cleanup sequence, then resolve `O24` with a decision-quality packet that separates the current **M001 single-skill-chain generation constraint** from the broader evidence that practice focus can be integrative. The work is documentation and decision-spine only: it should not change session assembly, app catalog/data schema, app routes, or UI behavior.

---

## Problem Frame

The canonical M001 milestone is stale after the 2026-05-05 merge cleanup sequence: it still describes Tune today as the Tier 1c route, omits the M001-shaping D137 follow-up resolution, and under-specifies what remains gated versus agent-actionable. Separately, the 2026-05-04 BAB ideation pass named `O24` as the most important sequencing call before any schema work because the current M001 single-skill-chain generation constraint and BAB's integrative practice-focus evidence are not the same claim.

This plan finishes the next two M001 cleanup steps together: make the M001 doc match current reality, and close `O24` without importing BAB-grade schema work into M001.

---

## Assumptions

*This plan was authored in non-interactive LFG mode. The items below are agent inferences that fill gaps in the input and should be scrutinized by review before implementation proceeds.*

- `O24` should be resolved now, not merely given another open-question packet, because the user explicitly asked to LFG "both" after the recommendation to refresh M001 and resolve `O24`.
- The resolution should preserve current M001 runtime behavior while refusing to promote the M001 single-skill-chain generation constraint as a universal product principle.
- A new decision row is appropriate because resolving `O24` changes the canonical interpretation of an open question, even though it does not authorize code or schema changes.
- No standalone brainstorm document is needed; the implementation plan plus `docs/decisions.md` decision row are sufficient decision-packet surfaces for this narrow docs-spine change.

---

## Requirements

- R1. Update `docs/milestones/m001-solo-session-loop.md` so frontmatter, quick scan, tier status, and remaining-work language reflect the current M001-shaping state after the D137-D140 cleanup sequence without turning the milestone into a full shipped-history digest.
- R2. Remove or correct stale milestone language that says Tier 1c's live pre-run spine is mandatory `/tune-today`; the current canonical route is Setup -> Safety with inline focus selection on Setup and `/settings/skill-level` as the durable skill-level override.
- R3. Preserve M001's current scope boundaries: Tier 1a and Tier 1b Layer A shipped; remaining Tier 1b / Phase 2B / Tier 2 work is gated by logged demand, D101, O7, D134, or the 2026-05-21 / 2026-07-20 reads.
- R4. Resolve `O24` in `docs/decisions.md` by separating the current M001 single-skill-chain generation constraint from the broader evidence that practice focus can be a training purpose rather than a pure skill-isolation rule.
- R5. Ground the `O24` resolution in the 2026-05-04 BAB ideation and synthesis evidence, especially the finding that BAB Plan 1 supports integrative-goal focus rather than pure skill isolation.
- R6. Make the authorization boundary explicit: no `compatibleFocuses` axis, read-drill schema, scoring grammar, BAB plan-builder schema, catalog migration, or generator behavior change is authorized by this resolution.
- R7. Update documentation-routing surfaces (`docs/catalog.json` and `docs/status/current-state.md`) so agents can discover the refreshed milestone and `O24` resolution.
- R8. Keep compatibility surfaces pointer-oriented; do not duplicate the decision packet into `AGENTS.md`, `CLAUDE.md`, or `llms.txt` unless routing text actually changes.
- R9. Verify documentation contracts after the updates.

---

## Scope Boundaries

- Do not edit app runtime behavior, catalog data, Dexie schema, app routes, or UI copy. A comment-only update to `app/src/data/archetypes.ts` is allowed if needed to keep the in-code invariant from contradicting the `O24` resolution.
- Do not implement `compatibleFocuses`, drill-family abstraction, read-drill schema, scoring overlays, or any BAB-derived plan-builder schema.
- Do not revive `/tune-today`, `TuneTodayScreen`, `SessionDraft.levelRelaxed`, or the retired level-relax eyebrow.
- Do not re-use the retracted `D136` slot.
- Do not promote BAB synthesis into current M001 build scope; use it only as evidence for the decision-spine update.

### Deferred to Follow-Up Work

- A1 source-backed reroute registry refactor remains a separate code refactor.
- Bucket B decisions from the BAB ideation pass (T9 modeling stance, T6 zone convention, slot-4 optionality) remain future decision passes after `O24`.
- Any runtime schema work for integrative practice focus waits for an explicit future plan and, where relevant, D101 or M002 re-activation triggers.

---

## Context & Research

### Relevant Code and Patterns

- `docs/status/current-state.md` is the freshest current-state source and already records D137-D140.
- `docs/milestones/m001-solo-session-loop.md` is the M001 scope source but has stale frontmatter and route language.
- `docs/decisions.md` owns stable decision and open-question IDs; `O24` currently explains why the provisional `D136` promotion was reverted.
- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` names A4 as a now-shippable `O24` decision-pass packet and says `O24` should precede schema work.
- `docs/research/practice-plan-authoring-synthesis.md` states that focus is a purpose, not merely a drill tag, while also warning that the BAB synthesis is not current-milestone implementation authorization.
- `docs/catalog.json` is the machine-readable documentation-routing surface for the new or materially updated docs.
- `app/src/data/archetypes.ts` contains the in-code M001 invariant comment that `O24` points at; it may need a comment-only update so the code does not keep citing the retracted interpretation.

### Institutional Learnings

- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` should shape the M001 refresh: Setup -> Safety is canonical, Recommended is defaulted, focus cannot be deselected, and `/tune-today` is retired.
- `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md` reinforces that founder-use evidence should update routing/status without overfiring new scope.
- The D49 proposal packet pattern in `docs/plans/2026-05-07-004-feat-d49-generator-policy-proposal-plan.md` is the nearest precedent for a conservative decision artifact with explicit authorization boundaries.

### External References

- External research is not needed. The work is governed by local canon, local BAB/FIVB research captures, and repo documentation contracts.

---

## Key Technical Decisions

- Resolve `O24` as a documentation decision, not a runtime change: this removes ambiguity from the decision spine without moving the app.
- Name the current behavior as an M001 implementation constraint: the generator can keep one selected pass/serve/set chain for focus-controlled slots because it supports low-typing courtside use and current diagnostics.
- Do not canonize the M001 single-skill-chain generation constraint as the future product model: BAB evidence supports the narrower guardrail that practice focus may be a training purpose served by integrated drills, not a mandate to build that model now.
- Keep future schema authorization separate: `compatibleFocuses` and integrative plan grammar require a future plan with diagnostics and schema review.

---

## Open Questions

### Resolved During Planning

- Should this be one plan or two? One plan: the milestone refresh and `O24` resolution are both decision-spine cleanup and should be reviewed together for consistency.
- Does this require app tests? No. This plan should not touch app behavior; documentation validation is the relevant test surface.

### Deferred to Implementation

- Exact `D` number for the new decision row: use the next available stable ID in `docs/decisions.md` during implementation.
- Exact `docs/catalog.json` placement: follow existing ordering and category conventions when editing.

---

## Implementation Units

- U1. **Refresh M001 Current-State Language**

**Goal:** Bring `docs/milestones/m001-solo-session-loop.md` into alignment with current M001 posture after the D137-D140 cleanup sequence.

**Requirements:** R1, R2, R3

**Dependencies:** None

**Files:**
- Modify: `docs/milestones/m001-solo-session-loop.md`
- Reference: `docs/status/current-state.md`
- Reference: `docs/decisions.md`

**Approach:**
- Update frontmatter date/status/stage and dependency/ID lists as needed.
- Replace stale Tune today route language with Setup -> Safety plus inline focus selection and Settings skill-level override.
- Add a concise "what remains" note so future agents can distinguish agent-actionable decision work from evidence-gated M001 work.
- Keep the milestone a scope document, not a full shipped-history changelog; point to `docs/status/current-state.md` for dated detail.

**Patterns to follow:**
- Current-state pointer style in `AGENTS.md`.
- Durable-doc frontmatter conventions from `.cursor/rules/machine-scannable-docs.mdc`.

**Test scenarios:**
- Test expectation: none -- documentation-only update with no runtime behavior.

**Verification:**
- The milestone no longer describes `/tune-today` as live Tier 1c routing.
- The milestone names M001-shaping decisions and `O24` consistently with `docs/decisions.md` without duplicating the full current-state history.

- U2. **Resolve O24 Decision Spine**

**Goal:** Add a stable decision that resolves `O24` without authorizing schema or runtime changes.

**Requirements:** R4, R5, R6

**Dependencies:** U1 helpful but not strictly required

**Files:**
- Modify: `docs/decisions.md`
- Modify: `app/src/data/archetypes.ts` if a comment-only invariant update is needed
- Reference: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`
- Reference: `docs/research/practice-plan-authoring-synthesis.md`
- Reference: `docs/research/bab-source-material.md`

**Approach:**
- Add the next available `D` row that states the resolution: M001 may keep the single selected skill chain for generation now, but that implementation constraint is not proof that every future focus-controlled drill must share one skill tag forever.
- Update `O24` to resolved/superseded wording that points to the new decision.
- Include rejected alternatives: re-promote the old D136 isolation claim; leave `O24` open indefinitely; implement schema now.
- Include revisit triggers: D101 unlocks, M002 needs plan-grammar input, or a source-backed non-D101 candidate needs cross-focus selection semantics.
- Update the `app/src/data/archetypes.ts` invariant comment only enough to cite the new decision and avoid repeating the over-broad BAB rationale.

**Patterns to follow:**
- D137's explicit "D136 is not reused" boundary.
- D140's explicit authorization-boundary posture.

**Test scenarios:**
- Test expectation: none -- decision-doc-only update with no executable behavior.

**Verification:**
- `O24` is no longer an unresolved blocker for Bucket B planning.
- The new decision explicitly disallows treating the row as implementation authorization.

- U3. **Propagate Routing and Validate Docs**

**Goal:** Update machine-readable documentation routing and status surfaces for the milestone refresh and `O24` resolution, then verify doc contracts.

**Requirements:** R7, R8, R9

**Dependencies:** U1, U2

**Files:**
- Modify: `docs/catalog.json`
- Modify: `docs/status/current-state.md`
- Modify: `docs/plans/2026-05-08-001-refactor-m001-o24-decision-spine-plan.md`

**Approach:**
- Register this plan in `docs/catalog.json` with the right doc family and canonical summary.
- Add a concise status/history entry for the `O24` resolution and M001 milestone refresh; include this plan in `depends_on`.
- Mark this plan complete after implementation and verification.

**Patterns to follow:**
- Recent plan registrations for D138-D140 in `docs/catalog.json`.
- Current-state shipped-history entries for decision-spine cleanup.

**Test scenarios:**
- Test expectation: none -- documentation routing update.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes.
- If catalog JSON is edited manually, JSON remains parseable and sorted consistently with nearby entries.

---

## System-Wide Impact

- **Interaction graph:** Documentation and one possible comment-only app edit. Agent routing changes through docs, not app behavior.
- **Error propagation:** None.
- **State lifecycle risks:** None.
- **API surface parity:** No app API, route, data, or export surface changes.
- **Integration coverage:** Documentation validation is sufficient.
- **Unchanged invariants:** Current session assembly and focus-controlled slot behavior remain unchanged; the decision only clarifies what the invariant means and does not mean.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Accidentally promoting the current M001 single-skill-chain generation constraint as universal product canon | Decision row must distinguish M001 runtime constraint from future integrative practice-focus evidence |
| Pulling BAB schema work into M001 | Scope boundaries explicitly reject runtime/schema work and preserve re-activation triggers |
| Leaving stale route prose behind | U1 specifically searches and replaces Tune today / `/tune-today` live-route claims |
| Documentation-routing drift across docs | U3 updates `docs/catalog.json` and validates with `scripts/validate-agent-docs.sh` |

---

## Documentation / Operational Notes

- This is a docs-first cleanup under the repo's machine-scannable-docs rules.
- No browser testing is expected to be useful unless implementation unexpectedly touches UI files.
- No migration, deploy, or app release note is required.

---

## Sources & References

- `docs/milestones/m001-solo-session-loop.md`
- `docs/status/current-state.md`
- `docs/decisions.md`
- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`
- `docs/research/practice-plan-authoring-synthesis.md`
- `docs/research/bab-source-material.md`
- `docs/catalog.json`
