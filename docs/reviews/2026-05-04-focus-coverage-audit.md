---
id: focus-coverage-audit-2026-05-04
title: "Focus Coverage Audit (2026-05-04, post-skill-level-mutability)"
status: active
stage: validation
type: review
authority: "Generated diagnostic from `app/src/data/focusCoverageAudit.ts` walking the focus × player-mode × net/wall × time-profile × skill-level matrix against the practical depth floor in `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md` (R6-R10). The Vitest snapshot at `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the authoritative regression baseline; this markdown is the scan-friendly human view."
summary: "First-run audit after the 2026-05-04 skill-level mutability ship made the engine read effective skill level for the first time. 180 cells total: 45 covered (25%), 135 failing (75%). Every failing cell carries `off_focus_support` (the strict R7 read — no support drill in technique/movement_proxy carries the chosen focus tag directly). 12 cells are unbuildable (`cannot_generate`) — all `serve` × `pair_open` (no net). 54 cells fail with `level_unhonored` — every `competitive_pair` (mapped to advanced) user hits this for at least pass + serve focuses. 22 cells fail with `thin_pressure` (40-min layouts where pressure slot lacks an in-band focused option). 18 cells fail with `no_same_focus_swap` (only 1 in-band main family — mostly `serve` × foundations/rally_builders × solo). The audit is a Vitest test; CI fails on regression."
last_updated: 2026-05-04
related:
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - docs/ideation/2026-04-30-focus-picker-drill-depth-ideation.md
  - docs/plans/2026-05-04-001-feat-skill-level-mutability-plan.md
  - app/src/data/focusCoverageAudit.ts
  - app/src/data/__tests__/focusCoverageAudit.test.ts
  - app/src/data/__tests__/focusCoverageAudit.snapshot.json
decision_refs:
  - D81
  - D101
  - D130
  - D135
---

# Focus Coverage Audit (2026-05-04, post-skill-level-mutability)

## Summary

- **Total cells audited:** 180
- **Covered:** 45 (25%)
- **Failing:** 135 (75%)
- **Not applicable:** 0

### Risk-bucket counts

| Risk bucket | Count | Meaning |
| --- | --- | --- |
| `cannot_generate` (CG) | 12 | No main-skill family exists in any band for this slot+context. Engine cannot build a focused main_skill block. |
| `level_unhonored` (LU) | 54 | Main families exist at other levels, but none in-band. Engine relaxes level on this slot. Tune today eyebrow fires. |
| `no_same_focus_swap` (NS) | 18 | Exactly 1 in-band main family. Swap would re-pick the same drill (R9 fails). |
| `off_focus_support` (OS) | 135 | No in-band technique/movement_proxy drill carries the chosen focus tag (the brainstorm's "Serving session feels pass-flavored" gap, made explicit per cell). |
| `thin_pressure` (TP) | 22 | Pressure slot present in the 40-min layout, but no in-band pressure drill carries the chosen focus tag. |

## Headline gaps (scan-first)

### 1. `off_focus_support` is universal (135/135 failing cells)

Every failing cell carries `off_focus_support`. The strict R7 read — a support drill must include the chosen focus tag in its `skillFocus` — surfaces that **no current `technique` or `movement_proxy` drill carries `serve` or `set`** in its `skillFocus`. Pass-focused sessions pass R7 because the existing technique drills (d05, d10, d11, etc.) are all `pass`-tagged.

This is the brainstorm's "long Serving session still has pass-flavored support blocks" gap (`docs/ideation/2026-04-30-focus-picker-drill-depth-ideation.md` Idea #3 "Focus-Aligned Support Blocks"). Resolution path: either (a) author serve-reinforcing technique/movement_proxy drills, or (b) relax R7 to allow source-backed adjacent tags (e.g., movement work counts for serving via footwork-routine reinforcement).

### 2. `serve` × `pair_open` is unbuildable at every level (12 cells)

Pair + open sand (no net) cannot generate a serving main_skill block — the brainstorm flagged this. Resolution path: source-backed pair-without-net serving drill (e.g., target practice with a partner shagging) or accept this as a permanent `not_applicable` per the brainstorm's `D101` 3+ player gating.

### 3. `competitive_pair` users hit `level_unhonored` on 54 cells

Catalog inspection: zero drills with `levelMax: 'advanced'` carry `pass | serve | set` focus. Every `competitive_pair` (mapped to `advanced`) user hits the relaxation eyebrow for any focused session. Resolution path: source-backed advanced variants (FIVB Level II coaches manual, BAB advanced material) or accept the eyebrow as the honest signal.

### 4. Serve × foundations/rally_builders × solo configurations have only 1 main family

18 cells fall into `no_same_focus_swap`. The brainstorm's serving credibility pass (Idea #2) targets this directly.

## Per-focus matrices

Each cell shows the worst-status risk-bucket abbreviation (CG, LU, NS, OS, TP) joined by `+` when multiple risks apply. `✓` is a covered cell.

### Focus: PASS

#### Skill level: `foundations`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | ✓ | ✓ | ✓ |
| `solo_wall` | ✓ | ✓ | ✓ |
| `solo_open` | ✓ | ✓ | ✓ |
| `pair_net` | ✓ | ✓ | ✓ |
| `pair_open` | ✓ | ✓ | ✓ |

#### Skill level: `rally_builders`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | ✓ | ✓ | ✓ |
| `solo_wall` | ✓ | ✓ | ✓ |
| `solo_open` | ✓ | ✓ | ✓ |
| `pair_net` | ✓ | ✓ | ✓ |
| `pair_open` | ✓ | ✓ | ✓ |

#### Skill level: `side_out_builders`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | ✓ | ✓ | ✓ |
| `solo_wall` | ✓ | ✓ | ✓ |
| `solo_open` | ✓ | ✓ | ✓ |
| `pair_net` | ✓ | ✓ | ✓ |
| `pair_open` | ✓ | ✓ | ✓ |

#### Skill level: `competitive_pair`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | LU+OS | LU+OS | LU+OS+TP |
| `solo_wall` | LU+OS | LU+OS | LU+OS+TP |
| `solo_open` | LU+OS | LU+OS | LU+OS+TP |
| `pair_net` | LU+OS | LU+OS | LU+OS+TP |
| `pair_open` | LU+OS | LU+OS | LU+OS+TP |

### Focus: SERVE

#### Skill level: `foundations`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | OS | OS | OS |
| `solo_wall` | NS+OS | NS+OS | NS+OS |
| `solo_open` | NS+OS | NS+OS | NS+OS |
| `pair_net` | OS | OS | OS |
| `pair_open` | CG+OS | CG+OS | CG+OS+TP |

#### Skill level: `rally_builders`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | NS+OS | NS+OS | NS+OS |
| `solo_wall` | LU+OS | LU+OS | LU+OS+TP |
| `solo_open` | LU+OS | LU+OS | LU+OS+TP |
| `pair_net` | NS+OS | NS+OS | NS+OS |
| `pair_open` | CG+OS | CG+OS | CG+OS+TP |

#### Skill level: `side_out_builders`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | NS+OS | NS+OS | NS+OS |
| `solo_wall` | LU+OS | LU+OS | LU+OS+TP |
| `solo_open` | LU+OS | LU+OS | LU+OS+TP |
| `pair_net` | NS+OS | NS+OS | NS+OS |
| `pair_open` | CG+OS | CG+OS | CG+OS+TP |

#### Skill level: `competitive_pair`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | LU+OS | LU+OS | LU+OS+TP |
| `solo_wall` | LU+OS | LU+OS | LU+OS+TP |
| `solo_open` | LU+OS | LU+OS | LU+OS+TP |
| `pair_net` | LU+OS | LU+OS | LU+OS+TP |
| `pair_open` | CG+OS | CG+OS | CG+OS+TP |

### Focus: SET

#### Skill level: `foundations`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | OS | OS | OS |
| `solo_wall` | OS | OS | OS |
| `solo_open` | OS | OS | OS |
| `pair_net` | OS | OS | OS |
| `pair_open` | OS | OS | OS |

#### Skill level: `rally_builders`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | OS | OS | OS |
| `solo_wall` | OS | OS | OS |
| `solo_open` | OS | OS | OS |
| `pair_net` | OS | OS | OS |
| `pair_open` | OS | OS | OS |

#### Skill level: `side_out_builders`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | OS | OS | OS |
| `solo_wall` | OS | OS | OS |
| `solo_open` | OS | OS | OS |
| `pair_net` | OS | OS | OS |
| `pair_open` | OS | OS | OS |

#### Skill level: `competitive_pair`

| Config | 15-min | 25-min | 40-min |
| --- | --- | --- | --- |
| `solo_net` | LU+OS | LU+OS | LU+OS+TP |
| `solo_wall` | LU+OS | LU+OS | LU+OS+TP |
| `solo_open` | LU+OS | LU+OS | LU+OS+TP |
| `pair_net` | LU+OS | LU+OS | LU+OS+TP |
| `pair_open` | LU+OS | LU+OS | LU+OS+TP |

## Failing-cell index

Sorted by focus → skill level → config → time profile.

| Focus | Skill level | Config | Time | Risks | Main in-band / total | Support in-band | Pressure in-band / total |
| --- | --- | --- | ---: | --- | ---: | ---: | ---: |
| pass | competitive_pair | `solo_net` | 15 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| pass | competitive_pair | `solo_net` | 25 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| pass | competitive_pair | `solo_net` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 3 | 0 | 0 / 3 |
| pass | competitive_pair | `solo_wall` | 15 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| pass | competitive_pair | `solo_wall` | 25 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| pass | competitive_pair | `solo_wall` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 3 | 0 | 0 / 3 |
| pass | competitive_pair | `solo_open` | 15 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| pass | competitive_pair | `solo_open` | 25 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| pass | competitive_pair | `solo_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 3 | 0 | 0 / 3 |
| pass | competitive_pair | `pair_net` | 15 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| pass | competitive_pair | `pair_net` | 25 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| pass | competitive_pair | `pair_net` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 5 | 0 | 0 / 5 |
| pass | competitive_pair | `pair_open` | 15 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| pass | competitive_pair | `pair_open` | 25 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| pass | competitive_pair | `pair_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 5 | 0 | 0 / 5 |
| serve | foundations | `solo_net` | 15 | off_focus_support | 2 / 2 | 0 | — |
| serve | foundations | `solo_net` | 25 | off_focus_support | 2 / 2 | 0 | — |
| serve | foundations | `solo_net` | 40 | off_focus_support | 2 / 2 | 0 | 2 / 2 |
| serve | foundations | `solo_wall` | 15 | no_same_focus_swap, off_focus_support | 1 / 1 | 0 | — |
| serve | foundations | `solo_wall` | 25 | no_same_focus_swap, off_focus_support | 1 / 1 | 0 | — |
| serve | foundations | `solo_wall` | 40 | no_same_focus_swap, off_focus_support | 1 / 1 | 0 | 1 / 1 |
| serve | foundations | `solo_open` | 15 | no_same_focus_swap, off_focus_support | 1 / 1 | 0 | — |
| serve | foundations | `solo_open` | 25 | no_same_focus_swap, off_focus_support | 1 / 1 | 0 | — |
| serve | foundations | `solo_open` | 40 | no_same_focus_swap, off_focus_support | 1 / 1 | 0 | 1 / 1 |
| serve | foundations | `pair_net` | 15 | off_focus_support | 2 / 2 | 0 | — |
| serve | foundations | `pair_net` | 25 | off_focus_support | 2 / 2 | 0 | — |
| serve | foundations | `pair_net` | 40 | off_focus_support | 2 / 2 | 0 | 2 / 2 |
| serve | foundations | `pair_open` | 15 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | foundations | `pair_open` | 25 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | foundations | `pair_open` | 40 | cannot_generate, off_focus_support, thin_pressure | 0 / 0 | 0 | 0 / 0 |
| serve | rally_builders | `solo_net` | 15 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | rally_builders | `solo_net` | 25 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | rally_builders | `solo_net` | 40 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | 1 / 2 |
| serve | rally_builders | `solo_wall` | 15 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | rally_builders | `solo_wall` | 25 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | rally_builders | `solo_wall` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 1 | 0 | 0 / 1 |
| serve | rally_builders | `solo_open` | 15 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | rally_builders | `solo_open` | 25 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | rally_builders | `solo_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 1 | 0 | 0 / 1 |
| serve | rally_builders | `pair_net` | 15 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | rally_builders | `pair_net` | 25 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | rally_builders | `pair_net` | 40 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | 1 / 2 |
| serve | rally_builders | `pair_open` | 15 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | rally_builders | `pair_open` | 25 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | rally_builders | `pair_open` | 40 | cannot_generate, off_focus_support, thin_pressure | 0 / 0 | 0 | 0 / 0 |
| serve | side_out_builders | `solo_net` | 15 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | side_out_builders | `solo_net` | 25 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | side_out_builders | `solo_net` | 40 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | 1 / 2 |
| serve | side_out_builders | `solo_wall` | 15 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | side_out_builders | `solo_wall` | 25 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | side_out_builders | `solo_wall` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 1 | 0 | 0 / 1 |
| serve | side_out_builders | `solo_open` | 15 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | side_out_builders | `solo_open` | 25 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | side_out_builders | `solo_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 1 | 0 | 0 / 1 |
| serve | side_out_builders | `pair_net` | 15 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | side_out_builders | `pair_net` | 25 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | — |
| serve | side_out_builders | `pair_net` | 40 | no_same_focus_swap, off_focus_support | 1 / 2 | 0 | 1 / 2 |
| serve | side_out_builders | `pair_open` | 15 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | side_out_builders | `pair_open` | 25 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | side_out_builders | `pair_open` | 40 | cannot_generate, off_focus_support, thin_pressure | 0 / 0 | 0 | 0 / 0 |
| serve | competitive_pair | `solo_net` | 15 | level_unhonored, off_focus_support | 0 / 2 | 0 | — |
| serve | competitive_pair | `solo_net` | 25 | level_unhonored, off_focus_support | 0 / 2 | 0 | — |
| serve | competitive_pair | `solo_net` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 2 | 0 | 0 / 2 |
| serve | competitive_pair | `solo_wall` | 15 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | competitive_pair | `solo_wall` | 25 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | competitive_pair | `solo_wall` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 1 | 0 | 0 / 1 |
| serve | competitive_pair | `solo_open` | 15 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | competitive_pair | `solo_open` | 25 | level_unhonored, off_focus_support | 0 / 1 | 0 | — |
| serve | competitive_pair | `solo_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 1 | 0 | 0 / 1 |
| serve | competitive_pair | `pair_net` | 15 | level_unhonored, off_focus_support | 0 / 2 | 0 | — |
| serve | competitive_pair | `pair_net` | 25 | level_unhonored, off_focus_support | 0 / 2 | 0 | — |
| serve | competitive_pair | `pair_net` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 2 | 0 | 0 / 2 |
| serve | competitive_pair | `pair_open` | 15 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | competitive_pair | `pair_open` | 25 | cannot_generate, off_focus_support | 0 / 0 | 0 | — |
| serve | competitive_pair | `pair_open` | 40 | cannot_generate, off_focus_support, thin_pressure | 0 / 0 | 0 | 0 / 0 |
| set | foundations | `solo_net` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | foundations | `solo_net` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | foundations | `solo_net` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | foundations | `solo_wall` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | foundations | `solo_wall` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | foundations | `solo_wall` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | foundations | `solo_open` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | foundations | `solo_open` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | foundations | `solo_open` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | foundations | `pair_net` | 15 | off_focus_support | 4 / 5 | 0 | — |
| set | foundations | `pair_net` | 25 | off_focus_support | 4 / 5 | 0 | — |
| set | foundations | `pair_net` | 40 | off_focus_support | 4 / 5 | 0 | 4 / 5 |
| set | foundations | `pair_open` | 15 | off_focus_support | 4 / 5 | 0 | — |
| set | foundations | `pair_open` | 25 | off_focus_support | 4 / 5 | 0 | — |
| set | foundations | `pair_open` | 40 | off_focus_support | 4 / 5 | 0 | 4 / 5 |
| set | rally_builders | `solo_net` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | rally_builders | `solo_net` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | rally_builders | `solo_net` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | rally_builders | `solo_wall` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | rally_builders | `solo_wall` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | rally_builders | `solo_wall` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | rally_builders | `solo_open` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | rally_builders | `solo_open` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | rally_builders | `solo_open` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | rally_builders | `pair_net` | 15 | off_focus_support | 5 / 5 | 0 | — |
| set | rally_builders | `pair_net` | 25 | off_focus_support | 5 / 5 | 0 | — |
| set | rally_builders | `pair_net` | 40 | off_focus_support | 5 / 5 | 0 | 5 / 5 |
| set | rally_builders | `pair_open` | 15 | off_focus_support | 5 / 5 | 0 | — |
| set | rally_builders | `pair_open` | 25 | off_focus_support | 5 / 5 | 0 | — |
| set | rally_builders | `pair_open` | 40 | off_focus_support | 5 / 5 | 0 | 5 / 5 |
| set | side_out_builders | `solo_net` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | side_out_builders | `solo_net` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | side_out_builders | `solo_net` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | side_out_builders | `solo_wall` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | side_out_builders | `solo_wall` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | side_out_builders | `solo_wall` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | side_out_builders | `solo_open` | 15 | off_focus_support | 3 / 3 | 0 | — |
| set | side_out_builders | `solo_open` | 25 | off_focus_support | 3 / 3 | 0 | — |
| set | side_out_builders | `solo_open` | 40 | off_focus_support | 3 / 3 | 0 | 3 / 3 |
| set | side_out_builders | `pair_net` | 15 | off_focus_support | 5 / 5 | 0 | — |
| set | side_out_builders | `pair_net` | 25 | off_focus_support | 5 / 5 | 0 | — |
| set | side_out_builders | `pair_net` | 40 | off_focus_support | 5 / 5 | 0 | 5 / 5 |
| set | side_out_builders | `pair_open` | 15 | off_focus_support | 5 / 5 | 0 | — |
| set | side_out_builders | `pair_open` | 25 | off_focus_support | 5 / 5 | 0 | — |
| set | side_out_builders | `pair_open` | 40 | off_focus_support | 5 / 5 | 0 | 5 / 5 |
| set | competitive_pair | `solo_net` | 15 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| set | competitive_pair | `solo_net` | 25 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| set | competitive_pair | `solo_net` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 3 | 0 | 0 / 3 |
| set | competitive_pair | `solo_wall` | 15 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| set | competitive_pair | `solo_wall` | 25 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| set | competitive_pair | `solo_wall` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 3 | 0 | 0 / 3 |
| set | competitive_pair | `solo_open` | 15 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| set | competitive_pair | `solo_open` | 25 | level_unhonored, off_focus_support | 0 / 3 | 0 | — |
| set | competitive_pair | `solo_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 3 | 0 | 0 / 3 |
| set | competitive_pair | `pair_net` | 15 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| set | competitive_pair | `pair_net` | 25 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| set | competitive_pair | `pair_net` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 5 | 0 | 0 / 5 |
| set | competitive_pair | `pair_open` | 15 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| set | competitive_pair | `pair_open` | 25 | level_unhonored, off_focus_support | 0 / 5 | 0 | — |
| set | competitive_pair | `pair_open` | 40 | level_unhonored, off_focus_support, thin_pressure | 0 / 5 | 0 | 0 / 5 |

## How to update this report

Re-run `npm --prefix app run audit:coverage` after a catalog change that intentionally moves coverage. The Vitest snapshot at `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the regression check; a snapshot mismatch fails CI loudly. Update the snapshot via `npm --prefix app test -- focusCoverageAudit -u` and commit the diff alongside the catalog change.

## How to extend the audit

The matrix dimensions live as constants in `app/src/data/focusCoverageAudit.ts` (`FOCUSES`, `FOCUS_LEVELS`, `CONFIGS`, `TIME_PROFILES`). Adding a new dimension (e.g., a Tier 1c attack focus) means adding the value to one of the constants. Risk buckets live in the `CoverageRiskBucket` union; adding a new check means extending the union and updating `evaluateCell` and the per-cell snapshot serializer.

## For agents

- **Authoritative for**: scan-friendly snapshot of catalog readiness against the R6-R10 floor at the post-skill-level-mutability state.
- **Edit when**: re-run after a catalog change intentionally moves coverage. Do not hand-edit the matrix — it is generated.
- **Belongs elsewhere**: regression check (`app/src/data/__tests__/focusCoverageAudit.test.ts`); requirements (`docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`); gap-card authoring (future).
