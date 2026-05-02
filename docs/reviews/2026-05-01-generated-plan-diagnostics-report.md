---
id: generated-plan-diagnostics-report-2026-05-01
title: "Generated Plan Diagnostics Report"
status: active
stage: validation
type: review-data
summary: "Machine-readable generated-plan diagnostics summary for the current Tune today focus-readiness surface."
authority: "Current generated-plan diagnostic snapshot for seeded buildDraft() stretch-pressure and duration-envelope classification."
last_updated: 2026-05-02
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
          "authored_min_minutes": 5,
          "authored_max_minutes": 9,
          "fatigue_max_minutes": 9,
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
          "authored_min_minutes": 5,
          "authored_max_minutes": 9,
          "fatigue_max_minutes": 9,
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
          "authored_min_minutes": 5,
          "authored_max_minutes": 9,
          "fatigue_max_minutes": 9,
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
          "configuration": "pair_net",
          "level": "beginner",
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
          "configuration": "pair_net",
          "level": "beginner",
          "duration": 40,
          "seed": "matrix-b",
          "block_id": "block-2",
          "planned_minutes": 24,
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
            "redistributed_minutes": 14,
            "skipped_optional_layout_indexes": [
              2,
              4
            ],
            "redistribution_layout_index": 3,
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
          "authored_min_minutes": 5,
          "authored_max_minutes": 8,
          "fatigue_max_minutes": 8,
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
          "focus": "pass",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-b",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "authored_min_minutes": 5,
          "authored_max_minutes": 8,
          "fatigue_max_minutes": 8,
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
          "focus": "pass",
          "configuration": "solo_net",
          "level": "advanced",
          "duration": 25,
          "seed": "matrix-c",
          "block_id": "block-2",
          "planned_minutes": 12,
          "allocated_minutes": 7,
          "authored_min_minutes": 5,
          "authored_max_minutes": 8,
          "fatigue_max_minutes": 8,
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
    }
  ],
  "redistribution_causality_receipt": {
    "comparison_mode": "allocated_duration_counterfactual",
    "runtime_boundary": "Diagnostic-only receipt; shipped buildDraft() behavior is unchanged.",
    "group_count": 21,
    "counts": {
      "total_affected_cell_count": 251,
      "redistribution_affected_cell_count": 236,
      "current_over_authored_max_cell_count": 231,
      "current_over_fatigue_cap_cell_count": 231,
      "current_under_authored_min_cell_count": 0,
      "allocated_over_authored_max_cell_count": 80,
      "allocated_over_fatigue_cap_cell_count": 80,
      "allocated_under_authored_min_cell_count": 0,
      "non_redistribution_over_cap_cell_count": 15,
      "non_redistribution_under_min_cell_count": 0,
      "pressure_disappears_cell_count": 151,
      "pressure_remains_cell_count": 80,
      "comparison_inconclusive_cell_count": 0,
      "redistribution_without_pressure_cell_count": 20,
      "counterfactual_unfilled_minutes": 2092
    },
    "groups": [
      {
        "group_key": "gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|9|9|30|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d47",
        "variant_id": "d47-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "over_authored_max",
          "over_fatigue_cap",
          "optional_slot_redistribution"
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
          "total_affected_cell_count": 30,
          "redistribution_affected_cell_count": 24,
          "current_over_authored_max_cell_count": 30,
          "current_over_fatigue_cap_cell_count": 30,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 18,
          "allocated_over_fatigue_cap_cell_count": 18,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 6,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 18,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 212
        }
      },
      {
        "group_key": "gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|28|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-d/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "total_affected_cell_count": 28,
          "redistribution_affected_cell_count": 28,
          "current_over_authored_max_cell_count": 28,
          "current_over_fatigue_cap_cell_count": 28,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 28,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 246
        }
      },
      {
        "group_key": "gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|24|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/advanced/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "total_affected_cell_count": 24,
          "redistribution_affected_cell_count": 24,
          "current_over_authored_max_cell_count": 24,
          "current_over_fatigue_cap_cell_count": 24,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 24,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 222
        }
      },
      {
        "group_key": "gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|8|8|24|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d46",
        "variant_id": "d46-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "mixed_cell_states",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 24,
          "redistribution_affected_cell_count": 24,
          "current_over_authored_max_cell_count": 24,
          "current_over_fatigue_cap_cell_count": 24,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 12,
          "allocated_over_fatigue_cap_cell_count": 12,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 12,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 212
        }
      },
      {
        "group_key": "gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|5|5|18|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "total_affected_cell_count": 18,
          "redistribution_affected_cell_count": 12,
          "current_over_authored_max_cell_count": 18,
          "current_over_fatigue_cap_cell_count": 18,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 18,
          "allocated_over_fatigue_cap_cell_count": 18,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 6,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 0,
          "pressure_remains_cell_count": 18,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 106
        }
      },
      {
        "group_key": "gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|8|8|16|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d46",
        "variant_id": "d46-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "mixed_cell_states",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 16,
          "redistribution_affected_cell_count": 16,
          "current_over_authored_max_cell_count": 16,
          "current_over_fatigue_cap_cell_count": 16,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 8,
          "allocated_over_fatigue_cap_cell_count": 8,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 8,
          "pressure_remains_cell_count": 8,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 148
        }
      },
      {
        "group_key": "gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|9|9|16|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d47",
        "variant_id": "d47-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "likely_redistribution_caused",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 16,
          "redistribution_affected_cell_count": 16,
          "current_over_authored_max_cell_count": 16,
          "current_over_fatigue_cap_cell_count": 16,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 4,
          "allocated_over_fatigue_cap_cell_count": 4,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 12,
          "pressure_remains_cell_count": 4,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 148
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
        "group_key": "gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|8|8|14|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d31",
        "variant_id": "d31-solo-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "mixed_cell_states",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 14,
          "redistribution_affected_cell_count": 14,
          "current_over_authored_max_cell_count": 14,
          "current_over_fatigue_cap_cell_count": 14,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 7,
          "allocated_over_fatigue_cap_cell_count": 7,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 7,
          "pressure_remains_cell_count": 7,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 124
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
        "group_key": "gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|10|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/solo_net/intermediate/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/solo_open/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
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
          "total_affected_cell_count": 10,
          "redistribution_affected_cell_count": 10,
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
          "redistribution_without_pressure_cell_count": 10,
          "counterfactual_unfilled_minutes": 50
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|10|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-c/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/40/matrix-c/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_open/advanced/40/matrix-a/block-2/22/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "total_affected_cell_count": 10,
          "redistribution_affected_cell_count": 10,
          "current_over_authored_max_cell_count": 10,
          "current_over_fatigue_cap_cell_count": 10,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 10,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 126
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/pair_net/intermediate/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/pair_open/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution",
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
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
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
          "redistribution_without_pressure_cell_count": 6,
          "counterfactual_unfilled_minutes": 30
        }
      },
      {
        "group_key": "gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_open/advanced/40/matrix-b/block-2/22/9/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 6,
          "current_over_fatigue_cap_cell_count": 6,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 6,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 80
        }
      },
      {
        "group_key": "gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|8|8|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_open/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d31",
        "variant_id": "d31-pair-open",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "mixed_cell_states",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 6,
          "current_over_fatigue_cap_cell_count": 6,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 3,
          "allocated_over_fatigue_cap_cell_count": 3,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 3,
          "pressure_remains_cell_count": 3,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 55
        }
      },
      {
        "group_key": "gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|10|10|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-b/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "total_affected_cell_count": 6,
          "redistribution_affected_cell_count": 6,
          "current_over_authored_max_cell_count": 6,
          "current_over_fatigue_cap_cell_count": 6,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 0,
          "allocated_over_fatigue_cap_cell_count": 0,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 6,
          "pressure_remains_cell_count": 0,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 54
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
        "group_key": "gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution",
        "diagnostic_fingerprint": "gpdf|v1|none|none|none|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/solo_net/intermediate/25/matrix-a/block-2/12/7/optional_slot_redistribution",
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
        "group_key": "gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|12|12|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
          "counterfactual_unfilled_minutes": 26
        }
      },
      {
        "group_key": "gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "diagnostic_fingerprint": "gpdf|v1|none|8|8|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
        "triage_status": "routed",
        "triage_route": "generator_policy_investigation",
        "reviewed_report_id": "generated-plan-diagnostics-report-2026-05-01",
        "drill_id": "d31",
        "variant_id": "d31-pair",
        "block_type": "main_skill",
        "observation_codes": [
          "optional_slot_redistribution",
          "over_authored_max",
          "over_fatigue_cap"
        ],
        "action_state": "pressure_remains_without_redistribution",
        "dominant_cell_state": "mixed_cell_states",
        "has_incomplete_evidence": false,
        "follow_up_routes": [
          "workload_review",
          "block_shape_review",
          "source_backed_proposal_work",
          "u6_proposal_admission_candidate",
          "future_generator_policy_decision"
        ],
        "counts": {
          "total_affected_cell_count": 2,
          "redistribution_affected_cell_count": 2,
          "current_over_authored_max_cell_count": 2,
          "current_over_fatigue_cap_cell_count": 2,
          "current_under_authored_min_cell_count": 0,
          "allocated_over_authored_max_cell_count": 1,
          "allocated_over_fatigue_cap_cell_count": 1,
          "allocated_under_authored_min_cell_count": 0,
          "non_redistribution_over_cap_cell_count": 0,
          "non_redistribution_under_min_cell_count": 0,
          "pressure_disappears_cell_count": 1,
          "pressure_remains_cell_count": 1,
          "comparison_inconclusive_cell_count": 0,
          "redistribution_without_pressure_cell_count": 0,
          "counterfactual_unfilled_minutes": 19
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
