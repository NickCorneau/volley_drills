---
id: generated-plan-diagnostics-report-2026-05-01
title: "Generated Plan Diagnostics Report"
status: active
stage: validation
type: review-data
summary: "Machine-readable generated-plan diagnostics summary for the current Tune today focus-readiness surface."
authority: "Current generated-plan diagnostic snapshot for seeded buildDraft() stretch-pressure and duration-envelope classification."
last_updated: 2026-05-01
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/sessionBuilder.ts
  - docs/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md
---

# Generated Plan Diagnostics Report

## Purpose

Record the current generated-plan diagnostic snapshot for the Tune today supported surface. This file is fully generated and validated by `npm run diagnostics:report:check`.

## Summary

- Total seeded cells: 540
- Clean cells: 119
- Observation-only cells: 421
- Hard-failure cells: 0
- Routeable observation groups: 53

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
    "seed_count": 4,
    "cell_count": 540,
    "applicable_count": 540,
    "not_applicable_count": 0
  },
  "status_counts": {
    "clean": 119,
    "observation_only": 421,
    "hard_failure": 0
  },
  "hard_failure_count": 0,
  "observation_count": 1069,
  "hard_failure_counts": {},
  "observation_counts": {
    "under_authored_min": 257,
    "optional_slot_redistribution": 236,
    "over_authored_max": 288,
    "over_fatigue_cap": 288
  },
  "routeable_observation_group_count": 53,
  "top_routeable_observation_groups": [
    {
      "drill_id": "d25",
      "variant_id": "d25-solo",
      "block_type": "wrap",
      "required": true,
      "authored_min_minutes": 4,
      "affected_cell_count": 87,
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
          "observation_codes": [
            "under_authored_min"
          ]
        }
      ]
    },
    {
      "drill_id": "d47",
      "variant_id": "d47-solo-open",
      "block_type": "main_skill",
      "required": true,
      "authored_max_minutes": 9,
      "fatigue_max_minutes": 9,
      "affected_cell_count": 30,
      "observation_codes": [
        "over_authored_max",
        "over_fatigue_cap",
        "optional_slot_redistribution"
      ],
      "likely_fix_paths": [
        "generator_policy_investigation",
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "set",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 40,
          "seed": "matrix-b",
          "block_id": "block-3",
          "planned_minutes": 10,
          "allocated_minutes": 10,
          "observation_codes": [
            "over_authored_max",
            "over_fatigue_cap"
          ]
        },
        {
          "focus": "set",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 40,
          "seed": "matrix-c",
          "block_id": "block-3",
          "planned_minutes": 10,
          "allocated_minutes": 10,
          "observation_codes": [
            "over_authored_max",
            "over_fatigue_cap"
          ]
        },
        {
          "focus": "set",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-a",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        }
      ]
    },
    {
      "drill_id": "d33",
      "variant_id": "d33-solo-open",
      "block_type": "main_skill",
      "required": true,
      "authored_max_minutes": 10,
      "fatigue_max_minutes": 10,
      "affected_cell_count": 28,
      "observation_codes": [
        "optional_slot_redistribution",
        "over_authored_max",
        "over_fatigue_cap"
      ],
      "likely_fix_paths": [
        "generator_policy_investigation",
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 25,
          "seed": "matrix-d",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        },
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 40,
          "seed": "matrix-d",
          "block_id": "block-2",
          "planned_minutes": 23,
          "allocated_minutes": 10,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 13,
            "skippedOptionalLayoutIndexes": [
              2,
              4
            ],
            "redistributionLayoutIndex": 3
          }
        },
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-d",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        }
      ]
    },
    {
      "drill_id": "d33",
      "variant_id": "d33-pair-open",
      "block_type": "main_skill",
      "required": true,
      "authored_max_minutes": 10,
      "fatigue_max_minutes": 10,
      "affected_cell_count": 24,
      "observation_codes": [
        "optional_slot_redistribution",
        "over_authored_max",
        "over_fatigue_cap"
      ],
      "likely_fix_paths": [
        "generator_policy_investigation",
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "serve",
          "configuration": "pair_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-b",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        },
        {
          "focus": "serve",
          "configuration": "pair_net",
          "level": "beginner",
          "duration": 25,
          "seed": "matrix-d",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        },
        {
          "focus": "serve",
          "configuration": "pair_net",
          "level": "beginner",
          "duration": 40,
          "seed": "matrix-b",
          "block_id": "block-2",
          "planned_minutes": 24,
          "allocated_minutes": 10,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 14,
            "skippedOptionalLayoutIndexes": [
              2,
              4
            ],
            "redistributionLayoutIndex": 3
          }
        }
      ]
    },
    {
      "drill_id": "d46",
      "variant_id": "d46-solo-open",
      "block_type": "main_skill",
      "required": true,
      "authored_max_minutes": 8,
      "fatigue_max_minutes": 8,
      "affected_cell_count": 24,
      "observation_codes": [
        "optional_slot_redistribution",
        "over_authored_max",
        "over_fatigue_cap"
      ],
      "likely_fix_paths": [
        "generator_policy_investigation",
        "policy_allowance",
        "block_split",
        "variant_cap_review",
        "source_backed_content_depth"
      ],
      "example_affected_cells": [
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-a",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-b",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        },
        {
          "focus": "pass",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-c",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributedMinutes": 5,
            "skippedOptionalLayoutIndexes": [
              2
            ],
            "redistributionLayoutIndex": 3
          }
        }
      ]
    }
  ],
  "policy": {
    "hard_failures_block_readiness": true,
    "routeable_observations_are_not_product_failures": true,
    "catalog_changes_require_gap_cards_and_source_references": true
  }
}
```
<!-- diagnostic-report-data:end -->
