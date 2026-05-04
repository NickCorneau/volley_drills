---
id: generated-plan-diagnostics-report-2026-05-01
title: "Generated Plan Diagnostics Report"
status: active
stage: validation
type: review-data
summary: "Machine-readable generated-plan diagnostics summary for the current Tune today focus-readiness surface."
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

Record the current generated-plan diagnostic snapshot for the Tune today supported surface. This file is fully generated and validated by `npm run diagnostics:report:check`.

## Summary

- Total seeded cells: 540
- Clean cells: 124
- Observation-only cells: 416
- Hard-failure cells: 0
- Routeable observation groups: 75

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
    "clean": 124,
    "observation_only": 416,
    "hard_failure": 0
  },
  "hard_failure_count": 0,
  "observation_count": 957,
  "hard_failure_counts": {},
  "observation_counts": {
    "under_authored_min": 307,
    "optional_slot_redistribution": 200,
    "over_authored_max": 225,
    "over_fatigue_cap": 225
  },
  "routeable_observation_group_count": 75,
  "top_routeable_observation_groups": [
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
      "drill_id": "d51",
      "variant_id": "d51-solo-open",
      "block_type": "main_skill",
      "required": true,
      "authored_min_minutes": 8,
      "affected_cell_count": 28,
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
      "drill_id": "d33",
      "variant_id": "d33-solo-open",
      "block_type": "main_skill",
      "required": true,
      "authored_max_minutes": 10,
      "fatigue_max_minutes": 10,
      "affected_cell_count": 20,
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
          "authored_min_minutes": 6,
          "authored_max_minutes": 10,
          "fatigue_max_minutes": 10,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributed_minutes": 5,
            "skipped_optional_layout_indexes": [
              2
            ],
            "redistribution_layout_index": 3,
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
          "authored_min_minutes": 6,
          "authored_max_minutes": 10,
          "fatigue_max_minutes": 10,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributed_minutes": 13,
            "skipped_optional_layout_indexes": [
              2,
              4
            ],
            "redistribution_layout_index": 3,
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
          "authored_min_minutes": 6,
          "authored_max_minutes": 10,
          "fatigue_max_minutes": 10,
          "observation_codes": [
            "optional_slot_redistribution",
            "over_authored_max",
            "over_fatigue_cap"
          ],
          "redistribution": {
            "source": "observed",
            "redistributed_minutes": 5,
            "skipped_optional_layout_indexes": [
              2
            ],
            "redistribution_layout_index": 3,
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
    },
    {
      "drill_id": "d33",
      "variant_id": "d33-solo-open",
      "block_type": "technique",
      "required": true,
      "authored_min_minutes": 6,
      "affected_cell_count": 16,
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
          "level": "intermediate",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-1",
          "planned_minutes": 4,
          "allocated_minutes": 4,
          "authored_min_minutes": 6,
          "authored_max_minutes": 10,
          "fatigue_max_minutes": 10,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "intermediate",
          "duration": 15,
          "seed": "matrix-c",
          "block_id": "block-1",
          "planned_minutes": 4,
          "allocated_minutes": 4,
          "authored_min_minutes": 6,
          "authored_max_minutes": 10,
          "fatigue_max_minutes": 10,
          "observation_codes": [
            "under_authored_min"
          ]
        },
        {
          "focus": "serve",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 15,
          "seed": "matrix-a",
          "block_id": "block-1",
          "planned_minutes": 4,
          "allocated_minutes": 4,
          "authored_min_minutes": 6,
          "authored_max_minutes": 10,
          "fatigue_max_minutes": 10,
          "observation_codes": [
            "under_authored_min"
          ]
        }
      ]
    }
  ],
  "redistribution_causality_receipt": {
    "comparison_mode": "allocated_duration_counterfactual",
    "runtime_boundary": "Diagnostic-only counterfactual receipt; shipped buildDraft() behavior may include separately authorized fills such as the D01 block-shape fill.",
    "group_count": 29,
    "counts": {
      "total_affected_cell_count": 203,
      "redistribution_affected_cell_count": 200,
      "current_over_authored_max_cell_count": 158,
      "current_over_fatigue_cap_cell_count": 158,
      "current_under_authored_min_cell_count": 0,
      "allocated_over_authored_max_cell_count": 21,
      "allocated_over_fatigue_cap_cell_count": 21,
      "allocated_under_authored_min_cell_count": 29,
      "non_redistribution_over_cap_cell_count": 3,
      "non_redistribution_under_min_cell_count": 0,
      "pressure_disappears_cell_count": 137,
      "pressure_remains_cell_count": 21,
      "comparison_inconclusive_cell_count": 0,
      "redistribution_without_pressure_cell_count": 45,
      "counterfactual_unfilled_minutes": 1696
    },
    "groups": [
      {
        "group_key": "gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|20|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-d/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d33",
        "variant_id": "d33-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 20,
          "redistribution_affected_cell_count": 20,
          "current_over_authored_max_cell_count": 20,
          "current_over_fatigue_cap_cell_count": 20,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 20,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 176
        }
      },
      {
        "group_key": "gpdg:v1:d51:d51-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|16|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/40/matrix-a/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/40/matrix-b/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/40/matrix-c/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d51",
        "variant_id": "d51-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 16,
          "redistribution_affected_cell_count": 16,
          "current_over_authored_max_cell_count": 16,
          "current_over_fatigue_cap_cell_count": 16,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 16,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 119
        }
      },
      {
        "group_key": "gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|8|8|15|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-b/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d05",
        "variant_id": "d05-solo",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "pressure_remains_without_redistribution",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 15,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 15,
          "current_over_fatigue_cap_cell_count": 15,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 9,
          "allocated_over_fatigue_cap_cell_count": 9,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 3,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 6,
          "pressure_remains_cell_count": 9,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 106
        }
      },
      {
        "group_key": "gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|5|5|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d01",
        "variant_id": "d01-solo",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "pressure_remains_without_redistribution",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate"
        ],
        "counts": {
          "total_affected_cell_count": 12,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 12,
          "current_over_fatigue_cap_cell_count": 12,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 12,
          "allocated_over_fatigue_cap_cell_count": 12,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 12,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 106
        }
      },
      {
        "group_key": "gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/advanced/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d33",
        "variant_id": "d33-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 12,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 12,
          "current_over_fatigue_cap_cell_count": 12,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 110
        }
      },
      {
        "group_key": "gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/beginner/40/matrix-a/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/beginner/40/matrix-b/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/beginner/40/matrix-c/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d40",
        "variant_id": "d40-solo",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 12,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 12,
          "current_over_fatigue_cap_cell_count": 12,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 80
        }
      },
      {
        "group_key": "gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/40/matrix-b/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/40/matrix-c/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d49",
        "variant_id": "d49-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 12,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 12,
          "current_over_fatigue_cap_cell_count": 12,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 116
        }
      },
      {
        "group_key": "gpdg:v1:d50:d50-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/advanced/40/matrix-b/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/advanced/40/matrix-c/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d50",
        "variant_id": "d50-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 12,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 12,
          "current_over_fatigue_cap_cell_count": 12,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 116
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|8|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/solo_net/intermediate/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/solo_open/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 8,
          "redistribution_affected_cell_count": 8,
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
          "redistribution_without_pressure_cell_count": 8,
          "counterfactual_unfilled_minutes": 40
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|8|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-c/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_open/advanced/40/matrix-a/block-2/22/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 8,
          "redistribution_affected_cell_count": 8,
          "current_over_authored_max_cell_count": 8,
          "current_over_fatigue_cap_cell_count": 8,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 8,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 101
        }
      },
      {
        "group_key": "gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|8|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/40/matrix-a/block-3/18/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d49",
        "variant_id": "d49-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 8,
          "redistribution_affected_cell_count": 8,
          "current_over_authored_max_cell_count": 8,
          "current_over_fatigue_cap_cell_count": 8,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 8,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 96
        }
      },
      {
        "group_key": "gpdg:v1:d50:d50-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|8|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/40/matrix-a/block-3/18/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/pair_net/advanced/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/pair_net/advanced/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d50",
        "variant_id": "d50-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 8,
          "redistribution_affected_cell_count": 8,
          "current_over_authored_max_cell_count": 8,
          "current_over_fatigue_cap_cell_count": 8,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 8,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 96
        }
      },
      {
        "group_key": "gpdg:v1:d51:d51-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|8|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/40/matrix-a/block-3/18/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-d/block-3/18/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-a/block-3/18/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d51",
        "variant_id": "d51-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 8,
          "redistribution_affected_cell_count": 8,
          "current_over_authored_max_cell_count": 8,
          "current_over_fatigue_cap_cell_count": 8,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 8,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 72
        }
      },
      {
        "group_key": "gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution|set/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|set/pair_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d49",
        "variant_id": "d49-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 6,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 6,
          "counterfactual_unfilled_minutes": 30
        }
      },
      {
        "group_key": "gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|set/solo_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution|set/solo_open/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d49",
        "variant_id": "d49-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 6,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 6,
          "counterfactual_unfilled_minutes": 30
        }
      },
      {
        "group_key": "gpdg:v1:d50:d50-pair-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution|pass/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|pass/pair_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d50",
        "variant_id": "d50-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 6,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 6,
          "counterfactual_unfilled_minutes": 30
        }
      },
      {
        "group_key": "gpdg:v1:d50:d50-solo-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|pass/solo_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution|pass/solo_open/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d50",
        "variant_id": "d50-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 6,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 6,
          "counterfactual_unfilled_minutes": 30
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|5|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/pair_open/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution|serve/pair_open/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 5,
          "redistribution_affected_cell_count": 5,
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
          "redistribution_without_pressure_cell_count": 5,
          "counterfactual_unfilled_minutes": 25
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|5|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_open/advanced/40/matrix-b/block-2/22/9/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_open/advanced/40/matrix-c/block-2/22/9/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 5,
          "redistribution_affected_cell_count": 5,
          "current_over_authored_max_cell_count": 5,
          "current_over_fatigue_cap_cell_count": 5,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 5,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 66
        }
      },
      {
        "group_key": "gpdg:v1:d33:d33-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|4|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d33",
        "variant_id": "d33-pair",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 4,
          "redistribution_affected_cell_count": 4,
          "current_over_authored_max_cell_count": 4,
          "current_over_fatigue_cap_cell_count": 4,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 4,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 38
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/pair_net/intermediate/25/matrix-c/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-pair",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 2,
          "redistribution_affected_cell_count": 2,
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
          "redistribution_without_pressure_cell_count": 2,
          "counterfactual_unfilled_minutes": 10
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-pair",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 2,
          "redistribution_affected_cell_count": 2,
          "current_over_authored_max_cell_count": 2,
          "current_over_fatigue_cap_cell_count": 2,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 2,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 28
        }
      },
      {
        "group_key": "gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-b/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d33",
        "variant_id": "d33-solo-net",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 2,
          "redistribution_affected_cell_count": 2,
          "current_over_authored_max_cell_count": 2,
          "current_over_fatigue_cap_cell_count": 2,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 2,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 18
        }
      },
      {
        "group_key": "gpdg:v1:d51:d51-pair-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_open/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution|serve/pair_open/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d51",
        "variant_id": "d51-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 2,
          "redistribution_affected_cell_count": 2,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 2,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 2,
          "counterfactual_unfilled_minutes": 10
        }
      },
      {
        "group_key": "gpdg:v1:d51:d51-solo-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_open/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/solo_wall/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d51",
        "variant_id": "d51-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 2,
          "redistribution_affected_cell_count": 2,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 2,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 2,
          "counterfactual_unfilled_minutes": 10
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|1|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-solo",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 1,
          "redistribution_affected_cell_count": 1,
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
          "redistribution_without_pressure_cell_count": 1,
          "counterfactual_unfilled_minutes": 5
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|1|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d22",
        "variant_id": "d22-solo",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 1,
          "redistribution_affected_cell_count": 1,
          "current_over_authored_max_cell_count": 1,
          "current_over_fatigue_cap_cell_count": 1,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 1,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 13
        }
      },
      {
        "group_key": "gpdg:v1:d51:d51-pair:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|1|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d51",
        "variant_id": "d51-pair",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution"
        ],
        "action_state": "redistribution_without_pressure",
        "dominant_cell_state": "redistribution_without_pressure",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "no_implementation_action_yet"
        ],
        "counts": {
          "total_affected_cell_count": 1,
          "redistribution_affected_cell_count": 1,
          "current_over_authored_max_cell_count": 0,
          "current_over_fatigue_cap_cell_count": 0,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 1,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 1,
          "counterfactual_unfilled_minutes": 5
        }
      },
      {
        "group_key": "gpdg:v1:d51:d51-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|14|14|1|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d51",
        "variant_id": "d51-pair",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "likely_redistribution_caused",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 1,
          "redistribution_affected_cell_count": 1,
          "current_over_authored_max_cell_count": 1,
          "current_over_fatigue_cap_cell_count": 1,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 1,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 14
        }
      }
    ]
  },
  "policy": {
    "hard_failures_block_readiness": true,
    "routeable_observations_are_not_product_failures": true,
    "catalog_changes_require_gap_cards_and_source_references": true
  }
}
```
<!-- diagnostic-report-data:end -->
