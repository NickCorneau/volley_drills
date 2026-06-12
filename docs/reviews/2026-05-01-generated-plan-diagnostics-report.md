---
id: generated-plan-diagnostics-report-2026-05-01
title: "Generated Plan Diagnostics Report"
status: active
stage: validation
type: review-data
summary: "Machine-readable generated-plan diagnostics summary for the current Setup inline-focus readiness surface."
authority: "Current generated-plan diagnostic snapshot for seeded buildDraft() stretch-pressure and duration-envelope classification."
last_updated: 2026-05-03
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/sessionBuilder.ts
  - docs/archive/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md
---

# Generated Plan Diagnostics Report

## Purpose

Record the current generated-plan diagnostic snapshot for the Setup inline-focus supported surface. This file is fully generated and validated by `npm run diagnostics:report:check`.

## Summary

- Total seeded cells: 540
- Clean cells: 165
- Observation-only cells: 375
- Hard-failure cells: 0
- Routeable observation groups: 50
- Steered sweep cells (U7): 135
- Steered sweep hard failures: 0

## Interpretation

Hard failures block readiness. Routeable observations are policy/content signals, not automatic product failures. Catalog changes still require gap cards and source references before activation.

The committed report intentionally keeps top routeable groups plus examples only. Use `buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())` from `app/src/domain/generatedPlanDiagnostics.ts` when a full affected-cell export is needed for deeper analysis.

## Machine-Readable Data

<!-- diagnostic-report-data:start -->
```json
{
  "id": "generated-plan-diagnostics-report-2026-05-01",
  "title": "Generated Plan Diagnostics Report",
  "status": "active",
  "stage": "validation",
  "type": "review-data",
  "source": {
    "module": "app/src/domain/generatedPlanDiagnostics.ts",
    "summary_helper": "summarizeGeneratedPlanDiagnostics(buildGeneratedPlanDiagnostics(), buildGeneratedPlanMatrix())",
    "group_helper": "buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())",
    "test_file": "app/src/domain/__tests__/generatedPlanDiagnostics.test.ts"
  },
  "surface": {
    "focuses": [
      "pass",
      "serve",
      "set"
    ],
    "configurations": [
      "solo_net",
      "solo_wall",
      "solo_open",
      "pair_net",
      "pair_open"
    ],
    "levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "durations": [
      15,
      25,
      40
    ],
    "seed_ids": [
      "matrix-a",
      "matrix-b",
      "matrix-c",
      "matrix-d"
    ],
    "seed_count": 4,
    "cell_count": 540,
    "applicable_count": 540,
    "not_applicable_count": 0,
    "not_applicable_cells": []
  },
  "surface_contract": {
    "included": {
      "focuses": [
        "pass",
        "serve",
        "set"
      ],
      "configurations": [
        "solo_net",
        "solo_wall",
        "solo_open",
        "pair_net",
        "pair_open"
      ],
      "levels": [
        "beginner",
        "intermediate",
        "advanced"
      ],
      "durations": [
        15,
        25,
        40
      ],
      "seed_ids": [
        "matrix-a",
        "matrix-b",
        "matrix-c",
        "matrix-d"
      ]
    },
    "excluded": [
      {
        "state": "reserved_future",
        "dimension": "theme",
        "value": "future_curated_themes",
        "reason": "Curated themes require a concrete theme contract before generated diagnostics can claim coverage.",
        "authority": "docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md",
        "revisit_trigger": "Revisit when a theme contract defines identity, supported cells, and focused-slot behavior."
      }
    ],
    "validation_issues": []
  },
  "status_counts": {
    "clean": 165,
    "observation_only": 375,
    "hard_failure": 0
  },
  "hard_failure_count": 0,
  "observation_count": 763,
  "hard_failure_counts": {},
  "observation_counts": {
    "under_authored_min": 290,
    "slot_dropped": 48,
    "under_named_profile_duration": 207,
    "over_authored_max": 109,
    "over_fatigue_cap": 109
  },
  "routeable_observation_group_count": 50,
  "top_routeable_observation_groups": [
    {
      "affected_cell_count": 207,
      "observation_codes": [
        "under_named_profile_duration"
      ],
      "likely_fix_paths": [
        "coverage_gap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-a",
          "planned_minutes": 20,
          "observation_codes": [
            "under_named_profile_duration"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-b",
          "planned_minutes": 20,
          "observation_codes": [
            "under_named_profile_duration"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-c",
          "planned_minutes": 19,
          "observation_codes": [
            "under_named_profile_duration"
          ]
        }
      ]
    },
    {
      "drill_id": "d25",
      "variant_id": "d25-solo",
      "block_type": "wrap",
      "required": true,
      "authored_min_minutes": 4,
      "affected_cell_count": 65,
      "observation_codes": [
        "under_authored_min"
      ],
      "likely_fix_paths": [
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-3",
          "planned_minutes": 3,
          "allocated_minutes": 3,
          "authored_min_minutes": 4,
          "authored_max_minutes": 5,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 15,
          "seed": "matrix-d",
          "block_id": "block-3",
          "planned_minutes": 3,
          "allocated_minutes": 3,
          "authored_min_minutes": 4,
          "authored_max_minutes": 5,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-3",
          "planned_minutes": 3,
          "allocated_minutes": 3,
          "authored_min_minutes": 4,
          "authored_max_minutes": 5,
          "observation_codes": [
            "under_authored_min"
          ]
        }
      ]
    },
    {
      "block_type": "movement_proxy",
      "required": false,
      "affected_cell_count": 48,
      "observation_codes": [
        "slot_dropped"
      ],
      "likely_fix_paths": [
        "coverage_gap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-a",
          "allocated_minutes": 5,
          "observation_codes": [
            "slot_dropped"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-b",
          "allocated_minutes": 5,
          "observation_codes": [
            "slot_dropped"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-c",
          "allocated_minutes": 5,
          "observation_codes": [
            "slot_dropped"
          ]
        }
      ]
    },
    {
      "drill_id": "d51",
      "variant_id": "d51-solo-open",
      "block_type": "main_skill",
      "required": true,
      "authored_min_minutes": 8,
      "affected_cell_count": 21,
      "observation_codes": [
        "under_authored_min"
      ],
      "likely_fix_paths": [
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-2",
          "planned_minutes": 5,
          "allocated_minutes": 5,
          "authored_min_minutes": 8,
          "authored_max_minutes": 14,
          "fatigue_max_minutes": 14,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 15,
          "seed": "matrix-b",
          "block_id": "block-2",
          "planned_minutes": 5,
          "allocated_minutes": 5,
          "authored_min_minutes": 8,
          "authored_max_minutes": 14,
          "fatigue_max_minutes": 14,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "beginner",
          "duration": 15,
          "seed": "matrix-c",
          "block_id": "block-2",
          "planned_minutes": 5,
          "allocated_minutes": 5,
          "authored_min_minutes": 8,
          "authored_max_minutes": 14,
          "fatigue_max_minutes": 14,
          "observation_codes": [
            "under_authored_min"
          ]
        }
      ]
    },
    {
      "drill_id": "d07",
      "variant_id": "d07-solo-open",
      "block_type": "technique",
      "required": true,
      "authored_min_minutes": 5,
      "affected_cell_count": 18,
      "observation_codes": [
        "under_authored_min"
      ],
      "likely_fix_paths": [
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-1",
          "planned_minutes": 4,
          "allocated_minutes": 4,
          "authored_min_minutes": 5,
          "authored_max_minutes": 8,
          "fatigue_max_minutes": 8,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 15,
          "seed": "matrix-c",
          "block_id": "block-1",
          "planned_minutes": 4,
          "allocated_minutes": 4,
          "authored_min_minutes": 5,
          "authored_max_minutes": 8,
          "fatigue_max_minutes": 8,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-1",
          "planned_minutes": 4,
          "allocated_minutes": 4,
          "authored_min_minutes": 5,
          "authored_max_minutes": 8,
          "fatigue_max_minutes": 8,
          "observation_codes": [
            "under_authored_min"
          ]
        }
      ]
    }
  ],
  "steered_sweep": {
    "source_helper": "summarizeSteeredGeneratedPlanDiagnostics(buildSteeredGeneratedPlanDiagnostics())",
    "surface": {
      "focuses": [
        "pass",
        "serve",
        "set"
      ],
      "configurations": [
        "solo_net",
        "solo_wall",
        "solo_open",
        "pair_net",
        "pair_open"
      ],
      "levels": [
        "beginner",
        "intermediate",
        "advanced"
      ],
      "durations": [
        25
      ],
      "seed_ids": [
        "matrix-a"
      ],
      "position_roles": [
        "ladder_min",
        "band_start",
        "ladder_max"
      ],
      "cell_count": 135,
      "degenerate_band_start_cell_count": 20
    },
    "status_counts": {
      "clean": 93,
      "observation_only": 42,
      "hard_failure": 0
    },
    "hard_failure_count": 0,
    "observation_count": 86,
    "hard_failure_counts": {},
    "observation_counts": {
      "slot_dropped": 18,
      "under_named_profile_duration": 19,
      "over_authored_max": 9,
      "over_fatigue_cap": 9,
      "under_authored_min": 31
    }
  },
  "redistribution_causality_receipt": {
    "comparison_mode": "allocated_duration_counterfactual",
    "runtime_boundary": "retired_by_duration_honesty_v8: redistributedMinutes is no longer a runtime mechanism; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md",
    "group_count": 0,
    "counts": {
      "total_affected_cell_count": 0,
      "redistribution_affected_cell_count": 0,
      "current_over_authored_max_cell_count": 0,
      "current_over_fatigue_cap_cell_count": 0,
      "current_under_authored_min_cell_count": 0,
      "allocated_over_authored_max_cell_count": 0,
      "allocated_over_fatigue_cap_cell_count": 0,
      "allocated_under_authored_min_cell_count": 0,
      "non_redistribution_over_cap_cell_count": 0,
      "non_redistribution_under_min_cell_count": 0,
      "pressure_disappears_cell_count": 0,
      "pressure_remains_cell_count": 0,
      "comparison_inconclusive_cell_count": 0,
      "redistribution_without_pressure_cell_count": 0,
      "counterfactual_unfilled_minutes": 0
    },
    "groups": []
  },
  "policy": {
    "hard_failures_block_readiness": true,
    "routeable_observations_are_not_product_failures": true,
    "catalog_changes_require_gap_cards_and_source_references": true
  }
}
```
<!-- diagnostic-report-data:end -->
