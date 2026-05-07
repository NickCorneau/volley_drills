---
id: focus-coverage-audit-2026-05-04
title: "Focus Coverage Audit (2026-05-04, post-skill-level-mutability)"
status: active
stage: validation
type: review
authority: "Generated diagnostic from `app/src/data/focusCoverageAudit.ts` walking the focus × player-mode × net/wall × time-profile × skill-level matrix against the practical depth floor in `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md` (R6-R10). The Vitest snapshot at `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the authoritative regression baseline; this markdown is the scan-friendly human view."
summary: "Current generated audit: 180 cells total, 180 covered, 0 failing, 0 not applicable. The audit is a Vitest-backed diagnostic; snapshot diffs expose coverage regressions or intentional catalog improvements."
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
- **Covered:** 180 (100%)
- **Failing:** 0 (0%)
- **Not applicable:** 0

### Risk-bucket counts

| Risk bucket | Count | Meaning |
| --- | --- | --- |
| `cannot_generate` (CG) | 0 | No main-skill family exists in any band for this slot+context. Engine cannot build a focused main_skill block. |
| `cannot_generate_at_level` (CL) | 0 | Main families exist at other levels, but none in-band. The engine cannot generate this focused slot at the saved level. |
| `no_same_focus_swap` (NS) | 0 | Exactly 1 in-band main family. Swap would re-pick the same drill (R9 fails). |
| `off_focus_support` (OS) | 0 | No in-band technique/movement_proxy drill carries the chosen focus tag (the brainstorm's "Serving session feels pass-flavored" gap, made explicit per cell). |
| `thin_pressure` (TP) | 0 | Pressure slot present in the 40-min layout, but no in-band pressure drill carries the chosen focus tag. |

## Current diagnostic read

All audited cells meet the current practical depth floor. Risk buckets remain in the report as regression sentinels for future drill-catalog changes.

## Per-focus matrices

Each cell shows the worst-status risk-bucket abbreviation (CG, CL, NS, OS, TP) joined by `+` when multiple risks apply. `✓` is a covered cell.

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
| `solo_net` | ✓ | ✓ | ✓ |
| `solo_wall` | ✓ | ✓ | ✓ |
| `solo_open` | ✓ | ✓ | ✓ |
| `pair_net` | ✓ | ✓ | ✓ |
| `pair_open` | ✓ | ✓ | ✓ |

### Focus: SERVE

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
| `solo_net` | ✓ | ✓ | ✓ |
| `solo_wall` | ✓ | ✓ | ✓ |
| `solo_open` | ✓ | ✓ | ✓ |
| `pair_net` | ✓ | ✓ | ✓ |
| `pair_open` | ✓ | ✓ | ✓ |

### Focus: SET

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
| `solo_net` | ✓ | ✓ | ✓ |
| `solo_wall` | ✓ | ✓ | ✓ |
| `solo_open` | ✓ | ✓ | ✓ |
| `pair_net` | ✓ | ✓ | ✓ |
| `pair_open` | ✓ | ✓ | ✓ |

## Failing-cell index

Sorted by focus → skill level → config → time profile.

| Focus | Skill level | Config | Time | Risks | Main in-band / total | Support in-band | Pressure in-band / total |
| --- | --- | --- | ---: | --- | ---: | ---: | ---: |

## How to update this report

Re-run `npm --prefix app run audit:coverage` after a catalog change that intentionally moves coverage. The Vitest snapshot at `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the regression check; a snapshot mismatch fails CI loudly. Update the snapshot via `npm --prefix app test -- focusCoverageAudit -u` and commit the diff alongside the catalog change.

## How to extend the audit

The matrix dimensions live as constants in `app/src/data/focusCoverageAudit.ts` (`FOCUSES`, `FOCUS_LEVELS`, `CONFIGS`, `TIME_PROFILES`). Adding a new dimension (e.g., a Tier 1c attack focus) means adding the value to one of the constants. Risk buckets live in the `CoverageRiskBucket` union; adding a new check means extending the union and updating `evaluateCell` and the per-cell snapshot serializer.

## For agents

- **Authoritative for**: scan-friendly snapshot of catalog readiness against the R6-R10 floor at the post-skill-level-mutability state.
- **Edit when**: re-run after a catalog change intentionally moves coverage. Do not hand-edit the matrix — it is generated.
- **Belongs elsewhere**: regression check (`app/src/data/__tests__/focusCoverageAudit.test.ts`); requirements (`docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`); gap-card authoring (future).
