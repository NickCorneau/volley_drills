---
date: 2026-05-27
topic: m001-executive-closure-d132-ratification-m002-carry-forward
---

# Executive M001 Closure + D132 Ratification + M002 Carry-Forward Expansion

## Summary

Ship two small commits to `main` today: ratify D132 from the founder's 2026-05-27 conversation prose; close M001 by **explicit founder executive decision** (not via the pre-registered Path 1 / early-trigger paths), with M002 absorbing the carry-forward (Tier 2 surfaces, friends-of-friends cohort question, attack-content track shape, all other M001-open items). Step 1 (canonical attack-drill ship) is deferred — Root B's schema blockers don't dissolve under the new shape; attack content moves into M002's expanded scope. The 2026-07-20 D130 re-eval reframes to a D130-only window-close + cohort-question read on the post-M001 surface.

## Problem Frame

Today's conversation surfaced three substantive evidence events (F1 first-class content-gap-evidence, D132 ratification text in the conversation, founder explicit smaller-first posture) and a doc-review pass that flagged the original action stack's closure shape as structurally wrong (5 reviewers converged: "F1 IS the closure artifact" misframes content-gap evidence as validation evidence; pre-registered closure paths bypassed; Condition 1 PASS-under-D132 manufactured by same-day ratification; trigger (e) agent-asymmetry flagged).

The founder responded with an explicit executive call on 2026-05-27 (verbatim): *"I think we should just capture the rest of our open actions etc into m002 and not wait until july 20 to close m001 for no particular reason. its just too far away - lets just make the executive decision here."*

This converts the closure question from "find a pre-registered path that fires today" to "close by explicit founder authority, name the bypass honestly, and route M001's open obligations into M002 scope rather than carry them dormant through the founder-use window."

**Acknowledged cost of departing from D130's 90-day window**. D130 anchored the 2026-07-20 horizon to specific external literature: novelty-effect guidance at ~14 days + the VDM 3-month consolidation phase. Closing at week 5 (instead of week 13) explicitly accepts the consequence: behavioral evidence accumulated through week 13 will not exist; the closure cannot distinguish founder conviction from novelty in the M001 evidence base; cohort-question evidence at 2026-07-20 will read against M002's nascent state rather than M001's longer behavioral window. The founder accepts this cost as worth less than the ~7 weeks of M001 hanging open with no behavioral evidence channel likely to produce a clean Path 1 firing (Tier 2 has zero shipped surfaces; today's Tier 2 revalidation found none have field demand; the cohort move is structurally not firing because the Conditions don't all PASS under the standard read). The pre-registered re-eval would either (a) produce a defaulted-cohort-move under thin evidence, or (b) produce a "continue founder-only" outcome requiring co-signer justification.

**Trigger (e) agent-asymmetry status**. The adversarial memo's most recent dated read (2026-05-23, week-5 catch-up entry) records trigger (e) as "not firing; clean read" per the founder's 2026-05-23 attestation ("probably a dozen times or more so far"). Round 1 doc-review flagged (e) as firing in the original requirements doc shape; this closure does not claim to mitigate (e) — trigger (e)'s pre-registered consequence is "A3 ligament + re-measure," which is a different mechanism than an executive-scope decision. The closure is a founder-direct scope decision, recorded as such; (e) status remains the memo's responsibility to read at its own cadence.

## Requirements

R-IDs are sequential. Four sub-sections within Step 3's scope: **Step 6 — D132 ratification** (Commit 1), **Step 3 — M001 executive closure + M002 carry-forward** (Commit 2), **Sequencing and commit discipline** (cross-cutting), **Validator and verification** (cross-cutting). Step 6 and Step 3 labels retained from the original action-stack ordering (6 → 3 → 1) for traceability with the ideation doc; execution-order sequence is Step 6 first, then Step 3 (per R18).

**Step 6 — D132 ratification**

- R1. A new dated decision row is added to `docs/decisions.md` (next available `D*` ID) that ratifies `D132` as active.
- R2. The ratification row cites the founder's 2026-05-27 verbatim text from this conversation as the source evidence.
- R3. The ratification row names both sub-options (sport-hard / context-of-use) as routing to the same D132 frame, and records the founder's explicit "idk yet" between them as named-sub-ambiguity that does not block ratification.
- R4. The ratification row explicitly confirms it does not weaken any existing decision (clarifies a pending decision) and therefore does not require co-signer justification under the adversarial-memo amendment rule.

**Step 3 — M001 executive closure + M002 carry-forward**

- R5. A new dated decision row is added to `docs/decisions.md` (separate from R1's row) that records **the founder's executive decision** to close M001 on 2026-05-27. The row names the closure as executive — NOT as a pre-registered Path 1 / early-trigger firing.
- R6. The closure decision row records the explicit bypass of pre-registered closure paths and names what would have been required for Path 1 (all three Falsification Conditions passing, Tier 1a + Tier 2 shipped, friends-of-friends cohort move initiated) so the bypass is auditable.
- R7. The closure decision row cites the founder's 2026-05-27 verbatim executive-decision text as the authorizing evidence, AND records the acknowledged cost of departing from D130's 90-day novelty/VDM rationale (per Problem Frame) so a future reader can audit what was knowingly traded.
- R8. The closure decision row records trigger (e) agent-asymmetry status honestly: per the adversarial memo's 2026-05-23 dated read, (e) is "not firing; clean." The closure does NOT claim to mitigate (e); the pre-registered (e) consequence is A3 ligament + re-measure, a separate mechanism from this executive scope decision. The closure is recorded as a founder-direct scope decision, not as an (e)-mitigation.
- R9. The closure decision row records Condition 1 as fail-trending-under-standard-read / ambiguous-under-D132 / superseded-by-executive-call — NOT as PASS. Condition 2 and Condition 3 retain their current PASS reads.
- R9a. The closure decision row records a **pre-registered reversal condition**: if at 2026-07-20 the friends-of-friends cohort question cannot be decided cleanly under M002's evidence (either M002 has not shipped a core surface, or the cohort question defers further by default for lack of evidence), this constitutes evidence the M001 closure was premature; M001 is logged for reopen-consideration in the adversarial memo's Amendment Log, with the reopen decision triggering a Tier 2 repoint per the memo's Condition 1 / Condition 3 consequences. This is the pre-registered falsifier the executive close commits to.
- R10. `docs/milestones/m001-solo-session-loop.md` frontmatter `stage` transitions to a value consistent with the `status_vocabularies.milestone_status.values` enum in `docs/catalog.json` (e.g., `complete`). The Phase Posture section updates to reflect the closed status and names the executive-decision shape.
- R11. `docs/status/m001-validation-overhang.md` frontmatter `status` transitions from `active` to `superseded`, pointing at `docs/status/current-state.md` for live posture.
- R12. `docs/status/current-state.md` gets a Recent Shipped History row for 2026-05-27 capturing the M001 executive closure + D132 ratification.
- R13. M002 milestone doc (`docs/milestones/m002-weekly-confidence-loop.md`) gets a new section enumerating the M001 items that interact with M002 post-closure, **split into two groups**:

  **Group A — Absorbed into M002 scope** (M002 doc takes ownership of these items as discretionary post-M002-core follow-on; M002 plan does not begin work on any Group A item until at least one M002 core surface has shipped):
  - **Tier 2 polish surfaces** (See-Why modal, richer summary copy, recommendation-first onboarding polish) — gate unlocked but not shipped; carry forward as discretionary post-M002-core polish items
  - **Friends-of-friends cohort question** — deferred from M001's 2026-07-20 re-eval; M002 may pick it up if M002's own evidence supports cohort expansion
  - **Attack-content track shape question** — deferred from today's action stack; F1 evidence carries forward as input to M002's content-priority decisions (note: actual schema work for attack content requires its own decision packet per Scope Boundaries; M002 owns the decision *whether to author* such a packet, not the schema work itself)

  **Group B — Preserved under existing routing (named here for legibility; M002 does NOT absorb ownership)**:
  - **Conditional Phase 2B per-drill capture shapes** — continues to be owned by `docs/status/post-m001-content-backlog.md` with original founder-trigger conditions; Phase 2A streak gate already cleared 2026-05-23; M001 closure does not change Phase 2B routing
  - **Tier 1b reserved-slot kill-or-author contract** — continues to be owned by `docs/status/post-m001-content-backlog.md`; binds at 2026-07-20 independent of M001 status (R15 reaffirms cap discipline preservation)
- R13a. The closure commit also updates `docs/milestones/m002-weekly-confidence-loop.md` to resolve the standalone-history-list dependency: the current M002 doc text "the standalone history list is owned by M001 Tier 2" no longer holds (M001 Tier 2 did not ship under M001). The closure commit must either (a) update M002's text to absorb the history list as M002 core scope (expanding stated M002 scope), or (b) update M002's text to layer carry-forward + next-N queue directly on `ExecutionLog` records with no standalone history list precondition, or (c) update M002's text to make the history list an explicit discretionary post-M002-core follow-on. The choice is left to planning per the Outstanding Questions section; the closure commit must not ship without this M002 doc edit landing alongside R13's new section, or M002's stated architecture contradicts the carry-forward.
- R14. The 2026-07-20 D130 founder-use window close still fires as scheduled, but its scope shifts to: (a) close the D130 founder-use window cleanly with a final read; (b) decide whether the friends-of-friends cohort move fires now (under M002's evidence base); (c) do NOT re-read M001 closure (M001 is closed; the executive call is durable).
- R15. The closure decision row explicitly preserves the Tier 1b kill-or-author contract on the 6 reserved slots through 2026-07-20 per its original terms. M001 closure does not dissolve cap discipline; the contract binds independently of milestone status. (Note: R13 Group B reaffirms this — the cap contract is named in M002's new section as preserved-under-existing-routing, not absorbed into M002 scope.)
- R15a. The closure commit also updates **AGENTS.md** "Current State" section (the "Active milestone" and "Next milestone in queue" lines, lines ~66-67), the `m001-validation-overhang.md` catalog entry in `docs/catalog.json` (`status` from `active` to `superseded` plus a `canonical_successor: docs/status/current-state.md` field to suppress the validator's `SUCCESSOR_MISSING` warning), and the M001 milestone catalog entry's `status` to match the milestone-doc `stage` value chosen in R10. These are downstream surfaces that go silently stale under M001 closure without explicit enumeration.

**Sequencing and commit discipline**

- R16. The two steps (Step 6 D132 ratification + Step 3 M001 executive closure + M002 carry-forward) ship as commits to `main` per the single-branch flow.
- R17. The decision-debt-sweep pattern applies: each decision row in `docs/decisions.md` ships in the same commit as the milestone/status/catalog doc changes it authorizes.
- R18. Step 6 (D132 ratification) should land before Step 3 (M001 closure) so the closure narration can cite the ratified D132 row by ID. Sequenced, not parallel.
- R19. Each commit is independently revertable in principle, but reverting M001 closure carries a higher disclosure cost than reverting D132 ratification — acknowledged, not designed-around.

**Validator and verification**

- R20. `bash scripts/validate-agent-docs.sh` passes after each commit.
- R21. `docs/catalog.json` is updated for the new decision rows and any M002 milestone-doc structural changes; the M001 catalog entry's `status` field updates to match the milestone-doc `stage` value chosen in R10.
- R22. `cap_status_must_be_consistent` validator behavior is unchanged — the Tier 1b cap-status JSON in `docs/status/post-m001-content-backlog.md` stays at 4/10 consumed, 6 reserved, 2026-07-20 expiry. Closing M001 does not move the cap-status JSON.

**Explicitly deferred from today (no R-ID, named here for legibility)**

- Step 1 canonical-drill probe (FIVB 5.1 Stand and Spike) — defer. Root B's 5 schema blockers (no `attack` in `SkillFocus`, no selection path for attack, `D143` forbids `chain-attack`, source-backed pattern preconditions not met, F1's own non-findings withhold authorization) make this non-viable as a smaller-first probe. Attack content moves to M002 scope under R13. If M002's evidence supports authoring an attack track, it ships via a proper decision packet (D148-shape) with the schema work it actually requires — not as a probe-disguised-as-content-ship.

## Acceptance Examples

- AE1. **Covers R5–R9, R9a, R14.** Given the M001 closure decision row lands, when a future agent reads `docs/decisions.md` for M001 status, the row names: (a) the closure as executive on 2026-05-27; (b) what Path 1 would have required (all three Falsification Conditions passing, Tier 1a + Tier 2 shipped, cohort move initiated); (c) trigger (e) status per the memo's 2026-05-23 read ("not firing; clean") — the closure does NOT claim to mitigate (e); (d) Condition 1 as superseded-by-executive-call, not manufactured-as-PASS; (e) the 2026-07-20 re-eval's reframed scope (D130 window close + cohort question on M002's evidence); (f) the pre-registered reversal condition (M001 reopens if 2026-07-20 cohort question defaults for lack of evidence). A reader at the 2026-07-20 re-eval can determine M001's closure shape, the bypass disclosure, and the reversal trigger without reading any other doc.

- AE2. **Covers R13, R13a.** Given M002's milestone doc absorbs the M001 carry-forward, when a future agent reads `docs/milestones/m002-weekly-confidence-loop.md` for M002 scope, the new section splits items into two groups: **Group A** (Tier 2 polish surfaces minus history list, cohort question, attack-content track question) are absorbed as discretionary post-M002-core follow-on with the explicit "no work begins until M002 core surface ships" gate; **Group B** (Phase 2B per-drill capture shapes, Tier 1b cap contract) are named for legibility but routed-by remains `docs/status/post-m001-content-backlog.md`. The history-list dependency is resolved in the same commit per R13a (one of three named options). The carry-forward does NOT silently expand M002's core scope (weekly receipt + next-N queue + carry-forward per D124).

- AE3. **Covers R15, R22.** Given the M001 closure lands, when `cap_status_must_be_consistent` runs in `scripts/validate-agent-docs.sh`, the validator passes against the unchanged Tier 1b cap-status JSON (4/10 consumed, 6 reserved with 2026-07-20 expiry). The 6 reserved Tier 1b slots continue to require kill-or-author resolution by 2026-07-20 per their original contract.

## Success Criteria

- The two commits land on `main` with the validator passing each time.
- A future agent reading `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`, and `docs/status/m001-validation-overhang.md` after closure can determine the M001 closed-by-executive-decision state, the D132 ratification, the bypass disclosure, and the M002 carry-forward scope.
- M002 milestone doc cleanly absorbs the carry-forward without bloating M002's core scope.
- The 2026-07-20 D130 re-eval reads from a clean evidence base: M001 closed; D132 ratified; M002 active with carry-forward items pickable; cohort question pending decision on M002's evidence.
- The smaller-first posture commitment is captured durably as a 2026-05-27-dated founder commitment, with the executive call as the explicit founder-direct decision authority.
- Future-self reading the closure decision row understands it as executive close, not as pre-registered-path closure.

## Scope Boundaries

**Explicit non-goals in this requirements doc**:

- Cancellation of the 2026-07-20 D130 re-eval — re-eval still fires per R14, with reframed scope
- Friends-of-friends cohort move firing now — deferred to 2026-07-20 under M002's evidence
- Tier 1b cap expansion or retirement — cap contract preserved unchanged through 2026-07-20
- Step 1 canonical-drill ship today — deferred (Root B schema blockers + smaller-first posture)
- Attack-track decision packet (D148-shape) today — moves to M002 scope per R13
- Any Tier 2 polish surface shipping today — moves to M002 scope per R13
- Schema work for `attack` skill focus, `chain-attack` constant, or `sessionFocus` extension — explicitly out of scope (D143 boundary preserved; any future schema work requires its own decision packet)
- D101 3+ player content activation — unchanged; remains post-M001/M002 per D124 (M002 is now what's post-M001; D101 still sequences after M002)

## Key Decisions

- **Executive M001 closure (not pre-registered Path 1 / early-trigger)**: founder's explicit "make the executive decision here" call on 2026-05-27. Honesty over path-compliance: the bypass is named in the closure row rather than dressed as path firing. The trigger (e) agent-asymmetry concern is mitigated by the founder-direct executive form — recording the executive call IS the founder-direct authority HM2 / Idea 5 proposed as mitigation.
- **M002 absorbs M001 carry-forward (not silent dormancy through 2026-07-20)**: the founder named "capture the rest of our open actions etc into m002" explicitly. M002 milestone doc gets a new section enumerating the carry-forward items with their original triggers preserved. M002 core scope (weekly receipt + next-N queue + carry-forward) is unchanged; carry-forward items are tagged as discretionary M002 follow-on.
- **D132 ratified to pair-first / solo-accommodating frame definitively**: both sub-options (sport-hard / context-of-use) route to the same D132 frame; the founder's explicit "idk yet" between them is recorded as sub-ambiguity that does not block ratification.
- **Step 1 canonical-drill probe deferred**: Root B's 5 schema blockers (no `attack` in `SkillFocus`, no selection path, `D143` forbids `chain-attack`, source-backed pattern preconditions not met, F1's own non-findings withhold authorization) make the smaller-first-probe framing non-viable. Attack content moves to M002 scope; if M002 evidence supports authoring, it ships via a proper decision packet with the schema work it requires.
- **Condition 1 reading is honest, not manufactured**: closure records Condition 1 as fail-trending-under-standard-read / ambiguous-under-D132 / superseded-by-executive-call. The executive call is named; the bypass is auditable; the closure does not falsely claim a Condition 1 PASS.
- **Tier 1b kill-or-author contract preserved**: cap discipline binds independently of M001 status. The 6 reserved slots still require resolution by 2026-07-20.
- **2026-07-20 D130 re-eval reframed, not canceled**: still fires for D130 window close + cohort question (on M002's evidence base). Does NOT re-read M001 closure — the executive call is durable.
- **Sequential commit order (Step 6 → Step 3), not parallel**: the closure narration cites the D132 ratification row; serialize so the citation has a target.

## Dependencies / Assumptions

- The adversarial-memo amendment rule (`docs/plans/2026-04-20-m001-adversarial-memo.md`) does not require co-signer justification for executive closures by the founder (the founder IS the sole reader through D130; the co-signer rule binds founder-only-continuation outcomes at the re-eval, not founder-direct executive scope decisions during the window).
- The A3 ligament memo re-read window (last read 2026-05-23, staleness 2026-05-30) is open for this brainstorm + plan + implementation cycle if it completes by 2026-05-30. After that, a fresh A3 re-read is mandatory before any further plan/research file or any >50-line plan/research edit.
- M002 milestone doc currently exists at `docs/milestones/m002-weekly-confidence-loop.md` with its `D124`-anchored scope (weekly receipt + next-N queue + carry-forward). Carry-forward additions in R13 expand M002's "discretionary follow-on" surface, not M002's core scope.
- `cap_status_must_be_consistent` in `scripts/validate-agent-docs.sh` is keyed on JSON file presence and shape, not on milestone status. Closing M001 does not move the validator's input.
- F1 first-class content-gap-evidence status (per `docs/research/2026-05-27-attack-content-and-solo-friction-feedback.md`) is preserved as evidence for M002's content-priority decisions, NOT as M001 closure evidence. The reclassification stands; the load-bearing role changes.

## Outstanding Questions

### Resolve Before Planning

(none — the executive decision dissolves the prior round of Resolve-Before-Planning ambiguities)

### Deferred to Planning

- [Affects R10] [Technical] Exact `stage` value for the milestone-doc frontmatter — `complete` per `status_vocabularies.milestone_status.values` is the closest enum match; verify at planning time that this is the chosen vocabulary or extend the vocabulary in the same commit if the executive-closure shape warrants a new value (e.g., `closed_executive`).
- [Affects R11] [Technical] Exact frontmatter changes for `docs/status/m001-validation-overhang.md` — `status: superseded` plus a pointer to the closure decision row.
- [Affects R13] [Technical] Exact section-header placement for the M002 carry-forward enumeration — under existing scope sections, under a new "M001 Carry-Forward" top-level section, or in the M002 frontmatter as a referenced section. Resolve at planning time by reading current `m002-weekly-confidence-loop.md` structure.
- [Affects R21] [Technical] Catalog entries — whether the closure decision and ratification decision rows need their own `docs[]` entries in `docs/catalog.json` or are implicit under `docs/decisions.md`'s entry. Verify at planning time by reading current `docs/catalog.json` decision-row precedent.

## Handoff

This requirements doc is consumable by `/ce-plan`. The next workflow step is to load `ce-plan` with this doc as the seed, which produces a plan that decomposes the two steps into ordered work units with explicit verification and rollback shape.

---

*(Document revision history removed; git history is the canonical authoring record.)*
