---
id: m001-candidate-false-audit-2026-04-28
title: "M001 Candidate False Audit"
status: active
stage: validation
type: review
summary: "Per-drill verdict table for the 15 inactive reserve records in app/src/data/drills.ts. Converts m001Candidate:false inventory into explicit future option value without activating new drills."
authority: "Catalog reserve verdicts for inactive M001 seed-pack drills; retire-only application gate for Stream 3 of the post-D135 plan."
last_updated: 2026-04-29
depends_on:
  - docs/decisions.md
  - docs/reviews/2026-04-22-drill-level-audit.md
  - docs/plans/2026-04-28-tier-1c-prepay-and-catalog-audit.md
  - app/src/data/drills.ts
  - app/src/data/progressions.ts
  - app/src/data/substitutionRules.ts
decision_refs:
  - D81
  - D101
  - D130
---

# M001 Candidate False Audit

## Purpose

Make every `m001Candidate:false` drill legible. The inactive reserve is intentional under `D81`, but future agents need to know whether each parked drill is waiting on evidence, waiting on a product gate, safe to archive later, or truly ready to retire.

## Use This File When

- changing `m001Candidate` status on an existing drill
- considering deletion or archive of an inactive drill
- planning M002 or post-validation catalog expansion
- auditing progression or substitution references for inactive drills

## Not For

- authoring new drill records
- activating reserve drills without a fresh trigger
- changing `D81`, `D101`, or D130 cap discipline
- hard-filtering drills by skill level

## Method

1. Started from the 15 records named in the focused #1 requirements brief.
2. Cross-checked each record against `app/src/data/drills.ts`, `app/src/data/progressions.ts`, `app/src/data/substitutionRules.ts`, and the 2026-04-22 drill-level audit.
3. Recorded source citation or citation gap, participant/equipment dependencies, reachability if the drill were active, current references, verdict, and future decision unlocked.
4. Applied no retire changes: no record currently clears the retire bar.

## Verdict Vocabulary

- `graduate-when: <condition>` - keep in reserve until the named evidence or capability exists.
- `hold-pending-<Dxxx-or-milestone>` - keep in reserve behind a named decision or milestone.
- `demote-to-archive` - valid source exists, but app catalog is the wrong active home; separate follow-up required.
- `retire` - remove from app catalog now. Requires written rationale plus no blocking runtime, persisted, or behavioral references.

## Verdict Table

| ID | Name | Chain / group | Level | Skill focus | Citation | Dependencies and reachability | Current references | Verdict | Future decision unlocked / evidence to revisit | Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `d02` | Towel Posture Passing | `chain-1-platform` | beginner -> intermediate | pass | BAB Lesson 1 platform work, per 2026-04-22 audit | Pair-only; towel + markers; reachable in pair modes if active, but extra prop friction makes it poor M001 default | `DRILLS`, `chain-1-platform` | `graduate-when: partner sessions repeatedly flag platform posture / shoulder-angle confusion after d01 or d03` | Useful corrective drill, not stale. Keep parked until posture-specific evidence beats simpler active platform drills. |
| `d04` | Catch Your Own Pass | `chain-1-platform` | beginner -> beginner | pass | BAB Lesson 1 solo drill, per 2026-04-22 audit | Solo and pair variants; pair variant needs net and 3 balls; reachable in several contexts if active | `DRILLS`, `chain-1-platform`, `SUBSTITUTION_RULES`, substitution tests, selection tests | `graduate-when: net-required catch-own-pass progression is needed and substitution behavior is intentionally reworked` | Not retire-safe. `d04` is part of live substitution behavior for the `d03` no-net path, so removal would change behavior outside a catalog audit. |
| `d06` | Pass & Slap Hands with Target | `chain-2-direction` | beginner -> intermediate | pass | BAB derivative of `d01`, per 2026-04-22 audit | Solo; markers; reachable if active, but uses `pass-grade-avg` capture not yet fully expanded | `DRILLS`, `chain-2-direction` | `graduate-when: directional set-window scoring becomes a logged need and pass-grade-avg capture has an accepted shape` | Good bridge from platform to target accuracy, but today it would add inactive capture complexity without fresh demand. |
| `d07` | Pass & Look | `chain-2-direction` | intermediate -> intermediate | pass | FIVB 3.15 Pass and Look; audit flags advanced upper-bound mismatch | Pair; net + 3 balls; max 3; composite metric | `DRILLS`, `chain-2-direction` | `graduate-when: decision-reading after pass is a logged gap and composite capture has an accepted shape` | Real game-read concept, but too much for current M001 capture and equipment surface. Preserve for later decision-reading work. |
| `d08` | Plus Three / Minus Three | `chain-2-direction` | beginner -> intermediate | pass | BAB pressure-passing scoring game | 3-player; net + 3 balls + markers | `DRILLS`, `chain-2-direction` | `hold-pending-D101` | 3+ player pressure passing / competitive scoring | Valid 3-player source geometry. Keep behind the 3+ player support gate rather than force a pair adaptation. |
| `d12` | U Passing Drill | `chain-3-movement` | beginner -> intermediate | pass, movement | FIVB 3.6 U Passing Drill | Pair; net + cones; movement_proxy candidate if equipment context grows | `DRILLS`, `chain-3-movement` | `graduate-when: net/cone movement-proxy work is explicitly requested or equipment context supports cones` | Valid movement pattern, but active M001 now avoids unmodeled cone requirements. |
| `d13` | W Passing Drill | `chain-3-movement` | intermediate -> intermediate | pass, movement | FIVB 3.8 W Passing Drill | Pair+; cones; min 2 / max 4; no net requirement | `DRILLS`, `chain-3-movement` | `graduate-when: W-pattern movement is requested after d12 or cone-supported movement proxy ships` | Valid progression after U-pattern movement; keep parked until the cone/equipment story is real. |
| `d14` | Pass & Switch | `chain-3-movement` | intermediate -> intermediate | pass, movement | FIVB 3.14 Pass and Switch | Authored as 3-player label with min 2 / ideal 3; source/intended geometry is switching group | `DRILLS`, `chain-3-movement` | `hold-pending-D101` | 3+ movement / switching support | Metadata allows 2, but the authored shape is 3-player switching. Hold behind D101 instead of squeezing into pair mode. |
| `d16` | Diamond Passing | `chain-4-serve-receive` | beginner -> intermediate | pass, movement | FIVB 3.5 Diamond Passing | Pair+; net; many balls + markers; ideal 3 | `DRILLS`, `chain-4-serve-receive` | `graduate-when: serve-receive variability is requested and many-ball / marker requirements are modeled` | Useful serve-receive variability drill, but current engine filters many-ball requirements and M001 has enough active passing. |
| `d17` | Non-Passer Move / Beat Ball to Pole | `chain-4-serve-receive` | beginner -> beginner | pass, movement | FIVB 3.4 Non Passer Move | Pair+; net + cones; ideal 3; composite metric | `DRILLS`, `chain-4-serve-receive` | `graduate-when: partner non-passer movement is a logged gap and cone / composite handling is accepted` | Strong pair-first concept, but not a clean M001 active drill without equipment and capture expansion. |
| `d19` | Butterfly Toss-Pass-Catch | `chain-5-group-addons` | beginner -> beginner | pass | BAB + FIVB butterfly warm-up family | Group; net; 3 balls; min 2 but ideal 6 / max 14 | `DRILLS`, `chain-5-group-addons` | `hold-pending-M002` | group/session credibility add-ons | Valid group warm-up family, but M001 is not group-mode. Keep for later weekly/group confidence surfaces. |
| `d20` | 3 Serve Pass to Attack | `chain-5-group-addons` | intermediate -> intermediate | pass, set | BAB 3-ball continuity drill | Group; net; many balls; min 4 / ideal 6 | `DRILLS`, `chain-5-group-addons` | `hold-pending-D101` | 3+ pass-set-attack continuity | Source/intended geometry is 3+ and multi-ball. D101 precedence wins over generic M002 grouping. |
| `d21` | 500 | `chain-5-group-addons` | beginner -> intermediate | pass, set | BAB self-scoring engagement game | Group; 3 balls; min 2 / ideal 4 / max 8; no net required | `DRILLS`, `chain-5-group-addons` | `hold-pending-M002` | low-pressure group engagement / scoring | Could work with 2+, but product meaning is group engagement and score play. Keep behind M002/group-confidence expansion. |
| `d23` | Serve & Dash | `chain-6-serving` | beginner -> intermediate | serve, conditioning | FIVB 2.1 Serve and Get Into Position | Solo; net; conditioning load; intentionally no active M001 graph link | `DRILLS`, `chain-6-serving` | `graduate-when: serve-to-defensive-base transition is a logged need after d31/d33 dogfood` | Valid serving transition concept, but current serving layer prioritizes target accuracy and avoids extra conditioning load. |
| `d24` | Pass into a Corner | `chain-2-direction` | beginner -> intermediate | pass | BAB wall-rebound passing variant | Solo wall; wall access required; chainId says `chain-2-direction` but `PROGRESSION_CHAINS` omits it | `DRILLS` only | `graduate-when: wall-access solo passing control becomes an explicit Phase 1.5 / baseline-test surface` | Keep as wall-access option value. Note the chain mismatch as a future cleanup input; do not retire while wall solo remains a known possible environment. |

## Cross-Cutting Observations

- **No retire verdicts today.** Every record either has a plausible future gate, a live structural role, or insufficient evidence to delete.
- **`d04` is behavior-linked.** It is the preferred progression in `SUBSTITUTION_RULES`; deletion would change active substitution behavior and is outside this audit.
- **3+ geometry should stay honest.** `d08`, `d14`, and `d20` are not stale just because M001 is pair/solo scoped. They are source-valid reserves behind `D101`.
- **Group add-ons are M002-shaped.** `d19` and `d21` are better treated as weekly/group-confidence option value than as M001 candidates.
- **Equipment/reachability matters.** Several records are only blocked because cones, many balls, wall, or net requirements are not first-class setup context today.
- **`d24` has catalog drift worth preserving.** Its `chainId` claims `chain-2-direction`, but `PROGRESSION_CHAINS` omits it. That is a future cleanup signal, not a retire reason.

## Applied Changes

No drill records were removed. Stream 3 should apply only:

- `docs/catalog.json` registration for this review
- `docs/README.md` routing for `docs/reviews/`
- `app/src/data/drills.ts` header pointer to this review

## For Agents

- **Authoritative for**: current verdicts on the 15 inactive M001 seed-pack drills.
- **Edit when**: a future session, walkthrough, or milestone changes a listed gate; a follow-up applies a `graduate-when`, `demote-to-archive`, or `retire` verdict.
- **Belongs elsewhere**: new drill authoring plans, Tier 1c focus picker, skill-level mutability, hard level filtering.
- **Outranked by**: `docs/decisions.md`, especially `D81`, `D101`, and `D130`.
