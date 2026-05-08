---
title: "feat: Add D49 Generator-Policy Proposal Packet"
type: feat
status: complete
active_registry: true
date: 2026-05-07
origin: docs/plans/2026-05-03-003-feat-d49-scoped-u8-generator-policy-follow-up-plan.md
depends_on:
 - docs/plans/2026-05-03-003-feat-d49-scoped-u8-generator-policy-follow-up-plan.md
 - docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md
 - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
 - docs/ops/workload-envelope-authoring-guide.md
 - app/src/domain/generatedPlanDiagnosticTriage.ts
 - app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts
---

# feat: Add D49 Generator-Policy Proposal Packet

## Summary

The 2026-05-03 D49 U8 proof packet emitted `ready_for_generator_policy_proposal` with 20 pressure-disappears cells and 0 pressure-remains cells, then named "D49 generator-policy proposal plan" as its next artifact. That artifact has not been authored. This plan adds it as a **decision packet** rendered into the generated triage workbench: it commits a specific proposed direction (do not redistribute optional-slot minutes onto a focus-controlled `main_skill` drill past its authored max minutes / fatigue cap; let the unfilled minutes remain unfilled), records falsification thresholds and revisit triggers, and keeps every authorization field at `not_authorized` so the proposal does not silently mutate runtime, catalog, caps, source depth, or D47.

This is a docs-and-diagnostic-packet artifact only. It does not modify session assembly, optional-slot redistribution behavior, drill metadata, or D49 caps.

---

## Problem Frame

The 2026-05-03 U8 proof packet established that 20 of D49's pressure-bearing redistribution cells are explained primarily by optional-slot redistribution: under an allocated-duration counterfactual the over-cap and fatigue-cap pressure disappears, and 0 cells remain pressured. The proof packet's `Next artifact` field reads "D49 generator-policy proposal plan" and the runtime authorization explicitly stays `not_authorized`. Today's regenerated triage (`docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`) repeats that handoff at every regeneration, but no committed direction exists for what the proposal would actually be — which leaves the triage workbench in a permanent "ready for plan" hover state and forces every future maintainer to re-derive the policy direction from raw evidence.

The decision-debt-compression discipline established by the prior D01 / D47 / D49 packets is "commit a direction with stop conditions, falsification, and revisit triggers — without authorizing implementation." This plan applies that discipline to the D49 redistribution thread.

---

## Requirements

- R1. Add a generated D49 generator-policy **proposal** packet that consumes the existing D49 U8 proof packet (`buildGeneratedPlanD49U8GeneratorPolicyProofPacket`) and emits a stable proposal artifact whenever the proof outcome is `ready_for_generator_policy_proposal`.
- R2. Preserve stable group-key traceability for the two pressure-bearing D49 main-skill groups (`gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`).
- R3. Select a single proposed policy direction with explicit rationale: **cap optional-slot redistribution at the carrier drill's authored max minutes and fatigue cap; allow unfilled minutes to remain unfilled**.
- R4. Record the alternatives considered and rejected: (a) status quo with explicit policy allowance, (b) preferential rerouting onto a different focus-eligible drill from the in-band pool, (c) early block truncation. State why direction R3 wins for the current evidence.
- R5. Record a falsification threshold (a concrete diagnostic state under which the committed direction is wrong and must be re-evaluated).
- R6. Record a revisit trigger (a concrete state that says "look at this packet again even if not falsified").
- R7. Add explicit authorization fields with conservative defaults: `runtime_redistribution_authorization`, `catalog_authorization`, `d49_cap_authorization`, `source_depth_authorization`, `d47_reopen_authorization` — all `not_authorized`.
- R8. Mark the proposal explicitly D49-scoped: it does not generalize automatically to non-D49 `likely_redistribution_caused` groups (D33, D40, D51, D22, D50). Each of those needs its own U8 proof before this packet's direction can be cited as precedent.
- R9. Render the packet into the generated triage workbench markdown adjacent to the existing `D49 U8 Generator-Policy Proof` section so the proof → proposal handoff is visible in one read.
- R10. Wire the new plan into `app/scripts/validate-generated-plan-diagnostics-report.mjs` triage dependencies so `npm run diagnostics:report:check` keeps the docs current.
- R11. Update `docs/decisions.md` with a new `D140` row that mirrors the packet's selected direction, falsification threshold, revisit trigger, and `not_authorized` boundaries.
- R12. Update `docs/status/current-state.md` `last_updated`, the recent shipped history, and `depends_on`. Update `docs/catalog.json` with the new plan registration.
- R13. Add domain tests asserting: (a) the proposal packet selects the committed direction when the upstream proof outcome is `ready_for_generator_policy_proposal`, (b) the packet defers to `no_action_yet` when the upstream proof outcome is anything else, (c) every authorization field remains `not_authorized` regardless of upstream state, (d) the rendered markdown includes the selected direction, the rejected alternatives, the falsification threshold, the revisit trigger, and the proof group keys.

---

## Scope Boundaries

- Do not change `buildDraft()`, optional-slot redistribution behavior, session assembly, drill candidate scoring, or any `app/src/domain/sessionAssembly/*.ts` code.
- Do not edit `app/src/data/drills.ts`, drill workload metadata, fatigue caps, or D49 catalog content.
- Do not widen D49 caps, reopen D47, or change D47/D05 comparator state.
- Do not add a U6 catalog-impact-preview surface; U6 remains correctly idle (no concrete cap or catalog proposal exists).
- Do not generalize this packet to non-D49 groups; the packet must read its scope explicitly.
- Do not implement the proposed runtime policy. The packet commits direction only.
- Do not edit unrelated triage sections (D01 cap/catalog fork, D47/D05 comparator decision, U7 disposition guidance).

### Deferred to Follow-Up Work

- **D49 generator-policy implementation plan** — separate plan, blocked behind `runtime_redistribution_authorization` flipping to `authorized`. Not authored here.
- **Non-D49 redistribution U8 proofs** — D33 / D40 / D51 / D22 / D50 each need their own U8 proof packet before this proposal's direction can be cited as precedent. Tracked as future work in current-state's recent-shipped log only when a specific group reaches readiness.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns every existing decision packet (D01 gap-fill, D01 workload/block-shape proposal, D01 block-shape fill receipt, D01 cap/catalog fork, D47 proposal admission ticket, D47 gap closure ledger, D47/D05 comparator evaluation payload, D47/D05 comparator decision packet, D49 residual follow-up, D49 U8 generator-policy proof). The new D49 generator-policy proposal packet sits next to `buildGeneratedPlanD49U8GeneratorPolicyProofPacket` (introduced 2026-05-03) and reads its outcome.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` is the focused test surface for packet behavior and rendered markdown.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns generated triage dependencies and freshness; the new plan path must be added to its `dependencies` list.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` is fully generated; update via `npm run diagnostics:report:update`.
- `docs/ops/workload-envelope-authoring-guide.md` § `U6 And U8 Boundaries` already states "Use U8 when optional-slot redistribution is part of the prompt." This plan is consistent with that boundary.

### Institutional Learnings

- The 2026-05-02 / 2026-05-03 packet sequence (D01 gap-fill → D01 workload/block-shape proposal → D01 block-shape fill receipt → D01 cap/catalog fork → D47 / D49 chain) established the convention: each packet derives from the previous packet, names its scope explicitly, keeps every implementation lever as `not_authorized`, and ships its markdown adjacent to the prior packet.
- The 2026-05-07 two-pass band relax engine fix (`docs/plans/2026-05-07-001-engine-two-pass-band-relax-plan.md`) is the only runtime engine change in this thread. It does not interact with optional-slot redistribution — it operates inside `pickForSlot` for a separate concern (level-band relaxation). The current plan's proposed policy is orthogonal and does not modify or rely on that fix.
- No `docs/solutions/` learning yet covers the proposal-packet pattern. After this packet lands and the analogous non-D49 packets are authored, capture one.

### External References

- None. Local diagnostic-spine domain patterns are sufficient.

---

## Key Technical Decisions

- **Selected proposed direction (R3): cap redistribution at carrier-drill authored max / fatigue cap; let unfilled minutes remain unfilled.** Rationale: the U8 proof packet's allocated-duration counterfactual already proved the over-cap pressure disappears when redistribution stops at the carrier drill's authored max. This is the smallest runtime change consistent with honest workload metadata. It does not alter drill copy, does not touch caps, and does not require new content. Trade-off: 212 counterfactual unfilled minutes across 20 cells (~10 min/cell average) — D49 sessions in those cells become correspondingly shorter.
- **Reject alternative (a) status-quo with explicit policy allowance.** This would record "we accept over-cap pressure as session-quality acceptable" without runtime change. Rejected because the workload guide treats authored max and fatigue cap as honest metadata — accepting violations silently turns the metadata into a polite fiction. The proposal can later be revisited if courtside dogfood proves the unfilled minutes are unacceptable, but the default direction protects metadata honesty.
- **Reject alternative (b) preferential reroute onto a different in-band drill.** Plausible but adds engine complexity and depends on per-cell candidate availability. Defer to a future packet if this one's revisit trigger fires; the current evidence does not require it.
- **Reject alternative (c) early block truncation.** Truncating the block before the optional-slot minutes are scheduled would change session shape further; the cap-redistribution direction in R3 lets the block keep its shape and only refuses the surplus. Less invasive.
- **Packet shape mirrors existing decision packets.** Closed-union types for proposed direction, alternatives considered, falsification threshold, revisit trigger; explicit authorization fields; no overloaded fields.
- **D49-scoped only.** The packet's `scope` field reads `d49_only`. Generalization to non-D49 groups requires their own U8 proof first. This matches how the U8 proof packet itself was D49-scoped despite the broader `likely_redistribution_caused` family in the redistribution causality receipt.

---

## Open Questions

### Resolved During Planning

- **Should the proposal commit one direction or rank a set?** One. Single committed direction is the established packet shape (D01 workload/block-shape proposal selects `block_shape_review_needed` primary; D47/D05 comparator decision selects `d47_wins`). Alternatives go in a `Rejected Alternatives` field on the packet, parallel to the comparator decision packet.
- **Should the falsification threshold be expressed as a diagnostic-state predicate or a courtside-feel predicate?** Diagnostic-state predicate primary (e.g., "≥5 D49 main_skill over-cap cells remain in regenerated diagnostics after the policy is implemented"); courtside-feel as a parallel revisit trigger. Diagnostic state is what regeneration can detect automatically; courtside requires manual founder dogfood.
- **Does this packet imply the analogous packet for non-D49 redistribution groups?** No. Each non-D49 group requires its own U8 proof first. The `scope: d49_only` field on the packet is load-bearing.

### Deferred to Implementation

- Exact type and helper names follow existing D49 U8 proof / D01 proposal naming style.
- Exact markdown copy can be tuned during U2 while preserving every required field from R1-R10.
- Whether the rendered markdown section title is `D49 Generator-Policy Proposal Packet`, `D49 U8 Generator-Policy Proposal`, or another short variant — the packet field names are what matter; the title is cosmetic.

---

## Implementation Units

- U1. **Add D49 Generator-Policy Proposal packet types and selector**

**Goal:** Introduce a derived domain object that consumes the existing `GeneratedPlanD49U8GeneratorPolicyProofPacket` and emits a `GeneratedPlanD49GeneratorPolicyProposalPacket` with selected direction, rejected alternatives, falsification threshold, revisit trigger, scope, and authorization fields.

**Requirements:** R1, R2, R3, R4, R5, R6, R7, R8, R13.

**Dependencies:** Existing `buildGeneratedPlanD49U8GeneratorPolicyProofPacket` (`app/src/domain/generatedPlanDiagnosticTriage.ts`).

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Define closed-union types for proposal outcome (`generator_policy_proposal_committed` | `no_action_yet` | `inconclusive`), proposed direction (`cap_redistribution_at_carrier_max` | `unspecified`), and rejected alternative IDs.
- Define the packet shape with: `proposalOutcome`, `scope` (literal `'d49_only'`), `proposedDirection`, `proposedDirectionRationale`, `rejectedAlternatives` (array of `{ id, summary, rejectedReason }`), `falsificationThreshold`, `revisitTrigger`, `stopCondition`, `proofGroupKeys`, `changeAuthorization` (the same authorization-field shape used by the U8 proof packet, all `not_authorized`).
- Selector function: when the upstream `proofOutcome` is `ready_for_generator_policy_proposal`, emit `generator_policy_proposal_committed` with the configured direction. Otherwise emit `no_action_yet` with empty proof group keys. Never read drills, session builder, or runtime state.
- All authorization fields default to `not_authorized` and must not change based on upstream state.

**Execution note:** Implement domain behavior test-first. Add the failing tests before the implementation — same posture as the U8 proof packet plan.

**Patterns to follow:**
- `buildGeneratedPlanD49U8GeneratorPolicyProofPacket` in `app/src/domain/generatedPlanDiagnosticTriage.ts` for selector signature and authorization-field shape.
- `buildGeneratedPlanD01WorkloadBlockShapeProposal` for the rejected-alternatives field shape.

**Test scenarios:**
- Happy path: upstream U8 proof outcome `ready_for_generator_policy_proposal` with the two pressure-bearing D49 group keys → proposal packet with `proposalOutcome = generator_policy_proposal_committed`, `proposedDirection = cap_redistribution_at_carrier_max`, three rejected alternatives, both proof group keys preserved.
- Edge case: upstream U8 proof outcome `no_action` → proposal packet with `proposalOutcome = no_action_yet`, empty `proofGroupKeys`, all authorization fields still `not_authorized`.
- Edge case: upstream U8 proof outcome `inconclusive` → proposal packet with `proposalOutcome = inconclusive`, all authorization fields `not_authorized`.
- Edge case: upstream U8 proof outcome `needs_workload_or_block_shape_review` → `no_action_yet`.
- Authorization invariant: every outcome leaves `runtime_redistribution_authorization`, `catalog_authorization`, `d49_cap_authorization`, `source_depth_authorization`, `d47_reopen_authorization` strictly equal to `'not_authorized'`. Add a single parametrized test asserting this across all four upstream outcomes.

**Verification:**
- `cd app && npm test -- --run src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

---

- U2. **Render the proposal packet into the triage workbench markdown**

**Goal:** Add the packet's markdown serialization and integrate it into the workbench output so it appears adjacent to the existing `D49 U8 Generator-Policy Proof` section in `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`.

**Requirements:** R9, R10.

**Dependencies:** U1.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts` (markdown formatter + workbench composer)
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs` (add this plan path to triage dependencies)
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Add `formatGeneratedPlanD49GeneratorPolicyProposalPacketMarkdown` parallel to `formatGeneratedPlanD49U8GeneratorPolicyProofPacketMarkdown`.
- Render: heading `## D49 Generator-Policy Proposal Packet`; bullets for packet source (cite the U8 proof packet), proposal outcome, scope, proposed direction, proposed direction rationale, rejected alternatives, falsification threshold, revisit trigger, stop condition, proof group keys, every authorization field.
- Compose the new section into the workbench markdown directly after the existing `## D49 U8 Generator-Policy Proof` section so the proof → proposal handoff is visually contiguous.
- Add this plan path (`docs/plans/2026-05-07-004-feat-d49-generator-policy-proposal-plan.md`) to the validator's dependencies list so `diagnostics:report:check` fails until the regenerated markdown contains the new section.

**Test scenarios:**
- Happy path: rendered markdown includes the heading, the selected direction, the rationale, the three rejected alternatives, the falsification threshold, the revisit trigger, the stop condition, both proof group keys, and the five `not_authorized` lines.
- Edge case: when proposal outcome is `no_action_yet`, markdown still renders the section but proof group keys are empty and authorization lines remain `not_authorized`.
- Validator integration: `npm run diagnostics:report:check` fails with the message naming the missing section before regeneration; passes after `npm run diagnostics:report:update` writes the updated markdown.

**Verification:**
- `cd app && npm run diagnostics:report:check` after `npm run diagnostics:report:update`.
- `cd app && npm test -- --run src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

---

- U3. **Wire docs surfaces: decisions, status, catalog, regenerate**

**Goal:** Add `D140`, update current-state, register in catalog, and regenerate the triage report+triage so the new packet is materialized in the committed docs.

**Requirements:** R11, R12.

**Dependencies:** U1, U2.

**Files:**
- Modify: `docs/decisions.md` (new `D140` row in same shape as `D138` / `D139`).
- Modify: `docs/status/current-state.md` (`last_updated`, recent-shipped-history bullet, `depends_on`).
- Modify: `docs/catalog.json` (register the new plan; add to dependents of triage workbench if appropriate).
- Modify: `docs/plans/2026-05-07-004-feat-d49-generator-policy-proposal-plan.md` (mark `status: complete` only after verification).
- Regenerate: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` and `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md` via `npm run diagnostics:report:update`.

**Approach:**
- `D140` row mirrors the packet's selected direction in prose: "Cap optional-slot redistribution at carrier-drill authored max / fatigue cap; allow unfilled minutes to remain unfilled. Falsification: ≥5 over-cap D49 main_skill cells remain after a future implementation lands. Revisit: 4 weeks of courtside dogfood with the new policy, OR a non-D49 U8 proof selects a different direction. All authorization fields remain `not_authorized` — this is a proposal packet, not an implementation authorization."
- `current-state.md` recent-shipped entry is a single line under 2026-05-07 noting the proposal packet, citing this plan path. No depth claims.
- `catalog.json`: add an entry for this plan at the same depth and family as `2026-05-03-003-feat-d49-scoped-u8-generator-policy-follow-up-plan`.
- Regenerate after every decisions/catalog/plan edit so `diagnostics:report:check` can pass before the plan is marked complete.

**Test scenarios:**
- Test expectation: none — pure docs surface wiring. Verification is via the existing CI-gated checks (`diagnostics:report:check`, `validate-agent-docs.sh`).

**Verification:**
- `cd app && npm run diagnostics:report:check`
- `cd app && npm run build`
- `cd app && npm test`
- `bash scripts/validate-agent-docs.sh`

---

## System-Wide Impact

- **Domain logic:** Adds one derived packet and its markdown serializer to `generatedPlanDiagnosticTriage.ts`. No reads from drills, session builder, or runtime state.
- **Runtime:** No `buildDraft()` change, no optional-slot redistribution change, no candidate-scoring change, no UI surface change. Founder app behavior is identical pre- and post-merge.
- **Catalog:** No drill content, cap, or metadata change.
- **CI:** `diagnostics:report:check` becomes the gate that keeps this packet's rendered markdown current. No new CI job. No new validator script.
- **Unchanged invariants:** Runtime redistribution behavior; D49 caps and copy; D47 closed-by-D49 state; D01 cap/catalog fork state; the U8 proof packet's outputs; the workload envelope authoring guide. The proposal commits *direction* without changing any of these surfaces.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Future reader mistakes the proposal packet for an implementation authorization. | Five explicit `not_authorized` fields + stop condition string + `D140` decisions row that names the packet as direction-only. |
| Proposal direction is later contradicted by a non-D49 U8 proof. | `scope: d49_only` field is load-bearing; revisit trigger explicitly fires when a non-D49 proof selects a different direction. |
| Counterfactual evidence drifts (e.g., catalog growth changes the 20-cell pressure-disappears figure). | Packet derives from the live U8 proof packet at render time; if the proof outcome changes, the proposal outcome auto-shifts to `no_action_yet` and the markdown reflects the new state. |
| Markdown format drifts from prior packets, hurting scannability. | Mirror `formatGeneratedPlanD49U8GeneratorPolicyProofPacketMarkdown` field order and heading style. |
| Validator dependencies list is updated but `diagnostics:report:update` is forgotten before commit. | U3 verification step runs `npm run diagnostics:report:check` after every wiring edit; CI then re-checks on push. |

---

## Documentation / Operational Notes

- No rollout, monitoring, or feature-flag work — the change is doc-and-diagnostic-packet only.
- The `D140` decisions row is the durable record of the committed direction; the proposal packet is the regenerated surface that mirrors it.
- When the analogous non-D49 packets eventually land, capture a `docs/solutions/` learning describing the proposal-packet pattern.

---

## Sources & References

- **Origin (proof packet):** `docs/plans/2026-05-03-003-feat-d49-scoped-u8-generator-policy-follow-up-plan.md`
- Related code: `app/src/domain/generatedPlanDiagnosticTriage.ts` (`buildGeneratedPlanD49U8GeneratorPolicyProofPacket`), `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
- Related diagnostic-spine artifacts: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`, `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`
- Related guidance: `docs/ops/workload-envelope-authoring-guide.md` § U6/U8 boundaries
- Related upstream brainstorm: `docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md`
- Related decisions: `D137`, `D138`, `D139` (recent decision-spine cleanup); `D140` (this plan's committed direction, to be added)
