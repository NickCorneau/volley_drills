---
id: claude
title: Claude Code Hints
status: active
stage: planning
type: agent-contract
authority: Claude-specific execution hints only — not canonical for product direction
last_updated: 2026-04-12
depends_on:
  - AGENTS.md
---

@AGENTS.md

# Claude Code

- Read `AGENTS.md` first. It has project orientation, read order, source-of-truth hierarchy, doc map, and operating contract.
- `CLAUDE.md` is only for Claude-specific execution hints. Do not duplicate product direction or repo policy here.
- If launched as an unattended worker, read the active task file under `ops/agent/` first, obey its verification commands, and stop on `done`, `blocked`, `failed`, or `budget_exhausted`.
- Only change hooks, supervisor scripts, or autonomous runtime files when the task explicitly concerns the repo control plane or an approved implementation milestone.
- Unattended execution requires human approval and the readiness gates in `docs/ops/autonomous-milestone-system.md`.
- All docs use YAML frontmatter. Parse `id`, `status`, `stage` before editing. Update frontmatter when a document's status changes.
