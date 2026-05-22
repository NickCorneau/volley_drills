---
id: weekly-validation-pulse-automation-plan-2026-05-22
title: "feat: Weekly Validation Pulse Automation"
type: feat
status: active
stage: validation
summary: "Create one minimal Cursor Automation that runs a weekly Volleycraft validation pulse against repo artifacts, produces a concise pulse report, and follows the repo's commit/tag flow instead of PR flow."
date: 2026-05-22
origin: docs/ideation/2026-05-10-open-ideation.md
decision_refs:
  - D130
---

# feat: Weekly Validation Pulse Automation

## Summary

Create the smallest valuable Cursor Automation draft for Volleycraft: a scheduled weekly validation pulse that reads repo artifacts, reports founder-use gate state and maintenance risk, and commits/tags any generated report according to the repo's single-branch flow. This intentionally avoids a broader automation suite until the first confirmed scheduled run proves useful.

---

## Problem Frame

M001 is build-complete and in D130 founder-use validation. The existing manual pulse pattern in `docs/pulse-reports/2026-05-13_12-00.md` surfaced exactly the kind of operational drift that should not wait for ad hoc attention: stale diagnostics, ledger under-counting, D130 gate posture, D134 timing, and deploy posture.

The 2026-05-10 open ideation recommends a script-derived ledger and auto-computed gate state, but that is larger than the minimal automation set. A weekly pulse automation is the best first slice because it compounds the existing manual report format without requiring schema or app code.

---

## Requirements

- R1. Create one Cursor Automation named `Volleycraft Weekly Validation Pulse`, or produce a backend-generated prefill URL/manual-confirmation draft if direct backend creation is blocked by the undocumented workflow schema.
- R2. The automation runs weekly on the M001 validation cadence and uses the `NickCorneau/volley_drills` repo on `main`.
- R3. The automation prompt instructs the agent to read the current repo orientation, validation status, founder-use ledger, latest pulse reports, diagnostics/report freshness surfaces, CI/deploy config, and recent git activity.
- R4. The automation produces a new concise report under `docs/pulse-reports/` only when at least one concrete write criterion is met: new founder-ledger or pulse-relevant research entries since the prior pulse, changed D130/D134/D91 gate posture, stale diagnostics or validation failures, CI/deploy posture changes, or material git activity that affects validation. If none apply, it leaves the tree unchanged and reports a no-op.
- R5. When it changes files, the automation follows this repo's flow: commit to `main`, push, create an annotated tag named `weekly-validation-pulse-YYYY-MM-DD` only for a report commit, and push that tag. It must not create a PR. If the tag already exists, it should stop and report the collision rather than overwriting shared tag state.
- R6. The automation leaves source-of-truth decisions untouched; it reports drift and followups rather than rewriting decisions, gates, or product canon.

---

## Scope Boundaries

- This plan creates only the weekly pulse automation or its creation-ready prefill/manual-confirmation draft. It does not create ledger derivation, pre-push freshness, live deploy smoke, copy-auditor, or plan-shape snapshot automations.
- This plan does not add app code, local scripts, database schema, or new npm commands.
- This plan does not inspect or update existing automations unless needed to avoid a duplicate.
- This plan does not require external analytics; the pulse reads repo artifacts and git state only.
- This plan does not create a PR. The repo flow for this work is commit, push, and tag.

### Deferred to Follow-Up Work

- `ledger:derive` / `gate-state.json`: defer until the weekly pulse proves which gate-state fields are stable enough to mechanize.
- Live deploy smoke: defer to a second automation once the weekly report shape is validated.
- Pre-push freshness sentinel: better as a local command or hook, not a scheduled Cursor Automation.

---

## Context & Research

### Relevant Code and Patterns

- `AGENTS.md` defines the single-branch flow: work on `main`, push after commit, no long-lived branches.
- `docs/status/current-state.md` owns the live validation posture and recent shipped history.
- `docs/pulse-reports/2026-05-13_12-00.md` is the concrete manual pulse format to mirror.
- `.github/workflows/app-ci.yml`, `.github/workflows/agent-validation.yml`, and `.github/workflows/deploy-cloudflare.yml` show current CI/deploy checks and known freshness gates.
- `app/package.json` exposes diagnostics, architecture, typography, tests, deploy, and build commands that the pulse can cite.

### External References

- Cursor Automations support scheduled runs against a configured repo, but the public docs do not expose a complete backend workflow proto schema. The MCP `create_automation` descriptor accepts an open workflow object and requires the draft to be reviewed before creation.

---

## Key Technical Decisions

- **Ship one automation draft first:** Weekly validation pulse is the minimal valuable set because it directly supports D130 validation and has an existing manual report template.
- **Use report-first behavior:** The automation should produce a pulse report and followup list, not silently mutate product canon.
- **Commit/tag, no PR:** The prompt must explicitly follow the repo's single-branch flow and avoid PR creation.
- **Prefer scheduled Monday midday cadence:** The pulse should align with the existing weekly validation ritual rather than adding another rhythm.
- **Treat workflow JSON as implementation-time adapter detail:** The backend MCP schema does not publish nested workflow enum names, so implementation should use the smallest accepted workflow shape and stop if the backend rejects it.

---

## Open Questions

### Resolved During Planning

- **How many automations should be created now?** One. The user requested the minimal valuable set, and the weekly pulse is the strongest first slice.
- **Should the automation create PRs?** No. The user explicitly said this repo's flow is commit and tag.

### Deferred to Implementation

- **Exact Cursor Automation workflow field names:** Resolve by calling the MCP with a reviewed draft; if the backend rejects the workflow shape, fall back to a prefill URL or report the unsupported field names.
- **Duplicate detection:** If automation listing requires interactive read confirmation or fails, stop with the reviewed prefill URL and an explicit duplicate-risk note unless the user explicitly confirms creation despite unknown duplicates.

---

## Implementation Units

- U1. **Draft the Cursor Automation**

**Goal:** Produce a reviewed automation draft with name, description, schedule, repo, branch, prompt, and git behavior, then create it directly only if the backend accepts the workflow shape.

**Requirements:** R1, R2, R3, R5, R6

**Dependencies:** None

**Files:**
- Modify: none

**Approach:**
- Use the Cursor backend MCP descriptors for `create_automation` / `build_automation_prefill_url`.
- Draft the workflow with a weekly schedule, `NickCorneau/volley_drills` repo on `main`, memory enabled only if the backend accepts it, and a prompt that includes the report scope and commit/tag contract.
- Keep the automation prompt concise enough to be maintainable in the Automations UI.
- Use this prompt skeleton as the source for the reviewed draft:

```text
You are running the weekly Volleycraft validation pulse. Work in the GitHub repository NickCorneau/volley_drills on main. Follow the repo contract in AGENTS.md first. Goal: produce a concise validation pulse only when a concrete write criterion is met: new founder-ledger or pulse-relevant research entries since the prior pulse, changed D130/D134/D91 gate posture, stale diagnostics or validation failures, CI/deploy posture changes, or material git activity that affects validation.

Read at minimum: AGENTS.md, docs/catalog.json, docs/status/current-state.md, docs/status/m001-validation-overhang.md, docs/research/founder-use-ledger.md, the latest docs/pulse-reports/*.md file, app/README.md, .github/workflows/app-ci.yml, .github/workflows/agent-validation.yml, .github/workflows/deploy-cloudflare.yml, package.json, and app/package.json. Inspect recent git activity since the last pulse.

Report shape: create docs/pulse-reports/YYYY-MM-DD_HH-MM.md with a trailing-7-day window, headlines, usage/gate reads, system performance, followups, and caveats. Mirror the concise style of docs/pulse-reports/2026-05-13_12-00.md. Do not rewrite product canon, decisions, current-state docs, app code, or ledger rows unless explicitly required by an existing repo validator; report needed followups instead.

Validation: run bash scripts/validate-agent-docs.sh. If app diagnostics or tests are relevant based on changed files, prefer the narrowest command and report failures honestly.

Git flow: this repo does not use PRs for this flow. If no write criterion is met, leave the tree unchanged and summarize that no commit was needed. If a report is created or docs are changed, commit only those files with a concise message like docs(pulse): add weekly validation pulse YYYY-MM-DD, push main to origin, then create and push an annotated git tag named weekly-validation-pulse-YYYY-MM-DD. If the tag already exists, stop and report the collision instead of overwriting it. Never create or update a pull request.
```

**Patterns to follow:**
- `docs/pulse-reports/2026-05-13_12-00.md`
- `AGENTS.md` Operational Constraints
- `docs/status/current-state.md` Snapshot

**Test scenarios:**
- Happy path: backend accepts the workflow draft and creates an enabled automation.
- Error path: backend rejects the workflow JSON; implementation reports the rejection and produces a prefill URL/manual-confirmation draft instead of guessing silently.
- Error path: privacy/storage mode blocks Automations; implementation reports the blocker and leaves a reviewed draft for manual creation.

**Verification:**
- A Cursor Automation exists and is enabled, or direct creation is explicitly marked blocked and a backend-generated prefill URL/manual-confirmation draft is available.

- U2. **Record and Verify the Pipeline Outcome**

**Goal:** Make the LFG run durable under this repo's commit/tag flow.

**Requirements:** R5

**Dependencies:** U1

**Files:**
- Create: `docs/plans/2026-05-22-001-feat-weekly-validation-pulse-automation-plan.md`
- Modify: `docs/catalog.json` if the new plan is cataloged in the same pass

**Approach:**
- Run the narrowest doc validation after adding the plan/catalog entry.
- Commit only files created or modified by this automation setup work; do not include unrelated founder ledger or pulse-report working-tree changes.
- Push `main` and create/push a tag whose name describes the automation setup.

**Patterns to follow:**
- `scripts/validate-agent-docs.sh`
- Recent plan entries in `docs/catalog.json`

**Test scenarios:**
- Happy path: documentation validation passes after the plan/catalog update.
- Edge case: unrelated dirty files remain in the working tree and are not staged or committed.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes or any failure is reported with the responsible files.
- A focused commit exists for this automation setup work; if the setup work is fully complete, a pushed tag exists as well.

---

## System-Wide Impact

- **Interaction graph:** External Cursor Automation runs against the GitHub repo; no app runtime behavior changes.
- **Error propagation:** Automation setup failures should surface in this session rather than creating partial repo edits.
- **State lifecycle risks:** The confirmed automation may create future weekly commits/tags; the prompt must avoid PR creation and avoid editing canon unless explicitly instructed by the report format. A prefill-only outcome is not evidence that the scheduled run exists.
- **Unchanged invariants:** No app schema, routes, drill records, D130 thresholds, D91 posture, or M001 validation gates change.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Backend workflow schema is under-documented | Use the minimal workflow shape and stop on rejection instead of layering guesses |
| Automation duplicates an existing one | Use a distinctive name; list existing automations only if allowed by the MCP read-confirmation flow |
| Scheduled automation over-edits canon | Prompt limits output to pulse reports and followups unless an explicit future human instruction expands scope |
| Weekly report creates noisy commits | Prompt says to create a report only when enough signal exists to add value |

---

## Documentation / Operational Notes

- This plan is the durable record for why only one automation draft was attempted in the first pass.
- Future automation additions should route through a new plan or a short amendment after the first confirmed weekly pulse runs.

---

## Sources & References

- Origin document: `docs/ideation/2026-05-10-open-ideation.md`
- Existing pulse: `docs/pulse-reports/2026-05-13_12-00.md`
- Current state: `docs/status/current-state.md`
- App workspace: `app/README.md`
- Automation MCP descriptors: `cursor-backend-control/tools/create_automation.json`, `cursor-backend-control/tools/build_automation_prefill_url.json`
