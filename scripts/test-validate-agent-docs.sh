#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT=""
if [[ $# -gt 0 ]]; then
  REPO_ROOT="$1"
fi

if [[ -z "$REPO_ROOT" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

CURRENT_FIXTURE=""

cleanup() {
  if [[ -n "$CURRENT_FIXTURE" && -d "$CURRENT_FIXTURE" ]]; then
    rm -rf "$CURRENT_FIXTURE"
  fi
}

trap cleanup EXIT

pass() {
  printf 'PASS: %s\n' "$1"
}

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

make_fixture_root() {
  CURRENT_FIXTURE="$(mktemp -d)"
  mkdir -p \
    "$CURRENT_FIXTURE/docs/design" \
    "$CURRENT_FIXTURE/docs/ops" \
    "$CURRENT_FIXTURE/docs/plans" \
    "$CURRENT_FIXTURE/docs/milestones" \
    "$CURRENT_FIXTURE/docs/research"
}

write_entry_doc() {
  local path="$1"
  local id="$2"
  local title="$3"
  local type="$4"
  local authority="$5"

  cat > "$path" <<EOF
---
id: $id
title: $title
status: active
stage: validation
type: $type
summary: "Fixture doc for validator tests."
authority: $authority
last_updated: 2026-04-15
depends_on: []
---

# $title

## Purpose

Fixture purpose.

## Use This File When

- you need the fixture

## Not For

- anything else

## Update When

- the fixture changes

## Machine Contract

- fixture-only contract
EOF
}

write_canonical_doc() {
  local path="$1"
  local id="$2"
  local title="$3"
  local type="$4"
  local authority="$5"

  cat > "$path" <<EOF
---
id: $id
title: $title
status: active
stage: validation
type: $type
summary: "Fixture canonical doc for validator tests."
authority: $authority
last_updated: 2026-04-15
depends_on: []
---

# $title

Fixture canonical body.
EOF
}

write_agents_doc() {
  cat > "$CURRENT_FIXTURE/AGENTS.md" <<'EOF'
---
id: agents
title: Agent Orientation
status: active
stage: validation
type: agent-contract
summary: "Fixture repo contract."
authority: fixture agent contract
last_updated: 2026-04-15
depends_on: []
---

# Agent Orientation

## Purpose

Fixture purpose.

## Use This File When

- entering the fixture repo

## Not For

- replacing canon

## Update When

- fixture rules change

## Machine Contract

- fixture contract
- run `bash scripts/validate-agent-docs.sh` after agent-surface changes
EOF
}

write_agents_doc_missing_machine_contract() {
  cat > "$CURRENT_FIXTURE/AGENTS.md" <<'EOF'
---
id: agents
title: Agent Orientation
status: active
stage: validation
type: agent-contract
summary: "Fixture repo contract."
authority: fixture agent contract
last_updated: 2026-04-15
depends_on: []
---

# Agent Orientation

## Purpose

Fixture purpose.

## Use This File When

- entering the fixture repo

## Not For

- replacing canon

## Update When

- fixture rules change
EOF
}

write_catalog_json() {
  cat > "$CURRENT_FIXTURE/docs/catalog.json" <<'EOF'
{
  "schema_version": 5,
  "repo_state": {},
  "entrypoints": [
    { "path": "AGENTS.md" },
    { "path": "README.md" },
    { "path": "docs/catalog.json" },
    { "path": "docs/README.md" },
    { "path": "docs/research/README.md" },
    { "path": "docs/design/README.md" },
    { "path": "docs/ops/agent-operations.md" },
    { "path": "docs/ops/agent-documentation-contract.md" },
    { "path": "CLAUDE.md" },
    { "path": "llms.txt" },
    { "path": "agent-manifest.json" }
  ],
  "read_packs": {},
  "source_of_truth_order": [],
  "docs": [],
  "update_routing": [],
  "research_routing": [],
  "status_vocabularies": {},
  "doc_conventions": {}
}
EOF
}

write_manifest_json() {
  cat > "$CURRENT_FIXTURE/agent-manifest.json" <<'EOF'
{
  "entrypoints": {
    "prose": "AGENTS.md",
    "machine": "docs/catalog.json",
    "hub": "README.md",
    "compatibility": ["CLAUDE.md", "llms.txt"]
  }
}
EOF
}

write_common_files() {
  cat > "$CURRENT_FIXTURE/README.md" <<'EOF'
# Fixture Repo
EOF

  cat > "$CURRENT_FIXTURE/CLAUDE.md" <<'EOF'
@AGENTS.md

Use docs/catalog.json for machine-readable routing.
EOF

  cat > "$CURRENT_FIXTURE/llms.txt" <<'EOF'
- AGENTS.md
- docs/catalog.json
EOF

  write_entry_doc "$CURRENT_FIXTURE/docs/README.md" "docs-index" "Docs Index" "index" "fixture docs index"
  write_entry_doc "$CURRENT_FIXTURE/docs/research/README.md" "research-index" "Research Index" "index" "fixture research index"
  write_entry_doc "$CURRENT_FIXTURE/docs/design/README.md" "design-index" "Design Index" "index" "fixture design index"
  write_entry_doc "$CURRENT_FIXTURE/docs/ops/agent-operations.md" "agent-operations" "Agent Operations" "ops" "fixture runtime guide"
  write_entry_doc "$CURRENT_FIXTURE/docs/ops/agent-documentation-contract.md" "agent-documentation-contract" "Agent Documentation Contract" "ops" "fixture docs contract"
  write_canonical_doc "$CURRENT_FIXTURE/docs/decisions.md" "decisions" "Decisions Log" "core" "fixture decisions"
  write_canonical_doc "$CURRENT_FIXTURE/docs/roadmap.md" "roadmap" "Roadmap" "core" "fixture roadmap"
  write_canonical_doc "$CURRENT_FIXTURE/docs/prd-foundation.md" "prd-foundation" "PRD Foundation" "core" "fixture PRD"
  write_canonical_doc "$CURRENT_FIXTURE/docs/milestones/m001-solo-session-loop.md" "M001" "Solo Session Loop" "milestone" "fixture milestone"
  write_canonical_doc "$CURRENT_FIXTURE/docs/plans/2026-04-20-m001-adversarial-memo.md" "m001-adversarial-memo" "M001 Adversarial Memo" "plan" "fixture plan"

  mkdir -p "$CURRENT_FIXTURE/scripts"
  cat > "$CURRENT_FIXTURE/scripts/validate-agent-docs.sh" <<'EOF'
#!/usr/bin/env bash
exec bash "__REPO_ROOT__/scripts/validate-agent-docs.sh" "$@"
EOF

  python3 -c "
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/scripts/validate-agent-docs.sh')
path.write_text(path.read_text(encoding='utf-8').replace('__REPO_ROOT__', r'$REPO_ROOT'), encoding='utf-8')
"

  write_agents_doc
  write_catalog_json
  write_manifest_json
}

assert_command_succeeds() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    pass "$description"
    return 0
  fi

  fail "$description"
}

assert_command_fails() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    fail "$description"
  fi

  pass "$description"
}

assert_command_fails_with_output() {
  local description="$1"
  local expected="$2"
  shift 2

  local output
  if output="$("$@" 2>&1)"; then
    fail "$description"
  fi

  if [[ "$output" != *"$expected"* ]]; then
    fail "$description"
  fi

  pass "$description"
}

assert_command_succeeds_with_output() {
  local description="$1"
  local expected="$2"
  shift 2

  local output
  if ! output="$("$@" 2>&1)"; then
    fail "$description"
  fi

  if [[ "$output" != *"$expected"* ]]; then
    fail "$description"
  fi

  pass "$description"
}

assert_command_succeeds_without_output() {
  local description="$1"
  local unexpected="$2"
  shift 2

  local output
  if ! output="$("$@" 2>&1)"; then
    fail "$description"
  fi

  if [[ "$output" == *"$unexpected"* ]]; then
    fail "$description"
  fi

  pass "$description"
}

test_direct_validator_passes_on_valid_fixture() {
  make_fixture_root
  write_common_files
  assert_command_succeeds \
    "validate-agent-docs passes on a valid fixture" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_missing_required_heading() {
  make_fixture_root
  write_common_files
  write_agents_doc_missing_machine_contract
  assert_command_fails \
    "validate-agent-docs fails when AGENTS.md is missing a required stable section" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_pseudo_frontmatter() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/docs/decisions.md" <<'EOF'
---

## id: decisions

title: Decisions Log
status: active
stage: validation
type: core
summary: "Fixture canonical doc for validator tests."
authority: fixture decisions
last_updated: 2026-04-15
depends_on: []
---

# Decisions Log
EOF
  assert_command_fails \
    "validate-agent-docs fails on markdown-styled pseudo-frontmatter" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_missing_canonical_frontmatter_key() {
  make_fixture_root
  write_common_files
  python3 -c "
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/roadmap.md')
path.write_text(path.read_text(encoding='utf-8').replace('summary: \"Fixture canonical doc for validator tests.\"\\n', ''), encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when a canonical doc is missing required frontmatter" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_malformed_yaml_frontmatter() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/docs/decisions.md" <<'EOF'
---
id: decisions
title: Decisions Log
status: active
stage: validation
type: core
summary: "unterminated fixture summary
authority: fixture decisions
last_updated: 2026-04-15
depends_on: []
---

# Decisions Log
EOF
  assert_command_fails \
    "validate-agent-docs fails on malformed YAML frontmatter" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_stale_catalog_schema_version() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['schema_version'] = 3
path.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails on stale catalog schema_version" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_passes_on_valid_canonical_successor() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-plan.md" "old-plan" "Old Plan" "plan" "fixture old plan"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-plan', 'path': 'docs/archive/plans/old-plan.md', 'type': 'plan', 'status': 'superseded', 'canonical_successor': 'docs/plans/2026-04-20-m001-adversarial-memo.md'},
    {'id': 'm001-adversarial-memo', 'path': 'docs/plans/2026-04-20-m001-adversarial-memo.md', 'type': 'plan', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_succeeds_without_output \
    "validate-agent-docs passes on valid canonical_successor metadata" \
    "SUCCESSOR_MISSING docs/archive/plans/old-plan.md" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_passes_on_no_single_successor() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/provenance.md" "provenance" "Provenance" "plan" "fixture provenance"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'provenance', 'path': 'docs/archive/plans/provenance.md', 'type': 'plan', 'status': 'superseded', 'successor_disposition': 'no_single_successor', 'successor_reason': 'Split across current docs.'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_succeeds_without_output \
    "validate-agent-docs passes on no-single-successor metadata" \
    "SUCCESSOR_MISSING docs/archive/plans/provenance.md" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_invalid_successor_path() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-plan.md" "old-plan" "Old Plan" "plan" "fixture old plan"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-plan', 'path': 'docs/archive/plans/old-plan.md', 'type': 'plan', 'status': 'superseded', 'canonical_successor': '../docs/plans/2026-04-20-m001-adversarial-memo.md'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails on invalid canonical_successor path" \
    "invalid canonical_successor" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_successor_frontmatter_mismatch() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/docs/ops/old-runbook.md" <<'EOF'
---
id: old-runbook
title: Old Runbook
status: superseded
stage: validation
type: ops
summary: "Fixture old runbook."
authority: fixture
last_updated: 2026-04-15
superseded_by: docs/ops/agent-operations.md
depends_on: []
---

# Old Runbook
EOF
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-runbook', 'path': 'docs/ops/old-runbook.md', 'type': 'ops', 'status': 'superseded', 'canonical_successor': 'docs/ops/agent-documentation-contract.md'},
    {'id': 'agent-operations', 'path': 'docs/ops/agent-operations.md', 'type': 'ops', 'status': 'active'},
    {'id': 'agent-documentation-contract', 'path': 'docs/ops/agent-documentation-contract.md', 'type': 'ops', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails when canonical_successor and superseded_by disagree" \
    "canonical_successor and frontmatter superseded_by disagree" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_warns_on_missing_successor_metadata() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-plan.md" "old-plan" "Old Plan" "plan" "fixture old plan"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-plan', 'path': 'docs/archive/plans/old-plan.md', 'type': 'plan', 'status': 'superseded'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_succeeds_with_output \
    "validate-agent-docs warns without failing when successor metadata is missing" \
    "SUCCESSOR_MISSING docs/archive/plans/old-plan.md" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_does_not_warn_on_compatible_superseded_by() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/docs/ops/old-runbook.md" <<'EOF'
---
id: old-runbook
title: Old Runbook
status: superseded
stage: validation
type: ops
summary: "Fixture old runbook."
authority: fixture
last_updated: 2026-04-15
superseded_by: docs/ops/agent-operations.md
depends_on: []
---

# Old Runbook
EOF
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-runbook', 'path': 'docs/ops/old-runbook.md', 'type': 'ops', 'status': 'superseded'},
    {'id': 'agent-operations', 'path': 'docs/ops/agent-operations.md', 'type': 'ops', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_succeeds_without_output \
    "validate-agent-docs does not warn when compatible superseded_by exists" \
    "SUCCESSOR_MISSING docs/ops/old-runbook.md" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_successor_metadata_for_active_source() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'roadmap', 'path': 'docs/roadmap.md', 'type': 'core', 'status': 'active', 'canonical_successor': 'docs/decisions.md'},
    {'id': 'decisions', 'path': 'docs/decisions.md', 'type': 'core', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails when active docs set successor metadata" \
    "successor metadata is only valid on archived or superseded docs" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_superseded_by_for_active_source() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/docs/ops/current-runbook.md" <<'EOF'
---
id: current-runbook
title: Current Runbook
status: active
stage: validation
type: ops
summary: "Fixture current runbook."
authority: fixture
last_updated: 2026-04-15
superseded_by: docs/ops/agent-operations.md
depends_on: []
---

# Current Runbook
EOF
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'current-runbook', 'path': 'docs/ops/current-runbook.md', 'type': 'ops', 'status': 'active'},
    {'id': 'agent-operations', 'path': 'docs/ops/agent-operations.md', 'type': 'ops', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails when active docs set superseded_by" \
    "successor metadata is only valid on archived or superseded docs" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_non_terminal_no_single_successor_target() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-plan.md" "old-plan" "Old Plan" "plan" "fixture old plan"
  write_canonical_doc "$CURRENT_FIXTURE/docs/plans/no-single.md" "no-single" "No Single" "plan" "fixture no single"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-plan', 'path': 'docs/archive/plans/old-plan.md', 'type': 'plan', 'status': 'superseded', 'canonical_successor': 'docs/plans/no-single.md'},
    {'id': 'no-single', 'path': 'docs/plans/no-single.md', 'type': 'plan', 'status': 'active', 'successor_disposition': 'no_single_successor', 'successor_reason': 'Fixture target is intentionally non-terminal.'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails when canonical_successor target is no-single-successor" \
    "canonical_successor target is not terminal" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_superseded_by_non_terminal_target() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/docs/ops/old-runbook.md" <<'EOF'
---
id: old-runbook
title: Old Runbook
status: superseded
stage: validation
type: ops
summary: "Fixture old runbook."
authority: fixture
last_updated: 2026-04-15
superseded_by: docs/archive/plans/archived-target.md
depends_on: []
---

# Old Runbook
EOF
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/archived-target.md" "archived-target" "Archived Target" "plan" "fixture archived target"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-runbook', 'path': 'docs/ops/old-runbook.md', 'type': 'ops', 'status': 'superseded'},
    {'id': 'archived-target', 'path': 'docs/archive/plans/archived-target.md', 'type': 'plan', 'status': 'complete'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails when superseded_by points at archived target" \
    "frontmatter superseded_by target is not terminal" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_successor_cycle() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-a.md" "old-a" "Old A" "plan" "fixture old A"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-b.md" "old-b" "Old B" "plan" "fixture old B"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-a', 'path': 'docs/archive/plans/old-a.md', 'type': 'plan', 'status': 'superseded', 'canonical_successor': 'docs/archive/plans/old-b.md'},
    {'id': 'old-b', 'path': 'docs/archive/plans/old-b.md', 'type': 'plan', 'status': 'superseded', 'canonical_successor': 'docs/archive/plans/old-a.md'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails on successor metadata cycles" \
    "successor metadata cycle detected" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_successor_mutual_exclusion() {
  make_fixture_root
  write_common_files
  mkdir -p "$CURRENT_FIXTURE/docs/archive/plans"
  write_canonical_doc "$CURRENT_FIXTURE/docs/archive/plans/old-plan.md" "old-plan" "Old Plan" "plan" "fixture old plan"
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'old-plan', 'path': 'docs/archive/plans/old-plan.md', 'type': 'plan', 'status': 'superseded', 'canonical_successor': 'docs/plans/2026-04-20-m001-adversarial-memo.md', 'successor_disposition': 'no_single_successor', 'successor_reason': 'Conflicting fixture.'},
    {'id': 'm001-adversarial-memo', 'path': 'docs/plans/2026-04-20-m001-adversarial-memo.md', 'type': 'plan', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails when successor fields are mutually exclusive" \
    "must not set both canonical_successor and successor_disposition" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_duplicate_catalog_identity() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'roadmap', 'path': 'docs/roadmap.md', 'type': 'core', 'status': 'active'},
    {'id': 'roadmap', 'path': 'docs/decisions.md', 'type': 'core', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails on duplicate catalog ids" \
    "duplicate docs[].id" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_duplicate_catalog_path() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'roadmap-a', 'path': 'docs/roadmap.md', 'type': 'core', 'status': 'active'},
    {'id': 'roadmap-b', 'path': 'docs/roadmap.md', 'type': 'core', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails on duplicate catalog paths" \
    "duplicate docs[].path" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_bad_catalog_doc_path_format() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['docs'] = [
    {'id': 'bad', 'path': '../outside.md', 'type': 'core', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails_with_output \
    "validate-agent-docs fails on unsafe docs[].path" \
    "docs path must be a safe repo-relative path" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_missing_catalog_entrypoint() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['entrypoints'] = [item for item in data['entrypoints'] if item.get('path') != 'docs/design/README.md']
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when a routing entrypoint is missing from the catalog" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_thick_compatibility_surface() {
  make_fixture_root
  write_common_files
  cat > "$CURRENT_FIXTURE/CLAUDE.md" <<'EOF'
# Claude Code

Read AGENTS.md first.
EOF
  assert_command_fails \
    "validate-agent-docs fails when a compatibility surface omits canonical pointers" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_missing_docs_path_on_disk() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['docs'] = [
    {'id': 'ghost', 'path': 'docs/does-not-exist.md', 'type': 'core', 'status': 'active'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when a docs[] path does not exist on disk" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_unknown_doc_status() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'roadmap', 'path': 'docs/roadmap.md', 'type': 'core', 'status': 'completed'}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when docs[].status is outside the documented vocabulary" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_empty_doc_status() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': ['draft', 'active', 'complete', 'superseded']}}
data['docs'] = [
    {'id': 'roadmap', 'path': 'docs/roadmap.md', 'type': 'core', 'status': ''}
]
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when docs[].status is empty (no longer short-circuits)" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_malformed_status_vocab() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['status_vocabularies'] = {'doc_status': {'values': 'draft, active, complete'}}
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when status_vocabularies.doc_status.values is not a list of strings" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_entrypoint_missing_path_field() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/docs/catalog.json')
data = json.loads(path.read_text(encoding='utf-8'))
data['entrypoints'].append({'kind': 'orphan_entrypoint'})
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when an entrypoints[] entry is missing 'path'" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_fails_on_manifest_current_state_pointing_at_missing_path() {
  make_fixture_root
  write_common_files
  python3 -c "
import json
from pathlib import Path
path = Path(r'$CURRENT_FIXTURE/agent-manifest.json')
data = json.loads(path.read_text(encoding='utf-8'))
data.setdefault('entrypoints', {})['current_state'] = 'docs/status/does-not-exist.md'
path.write_text(json.dumps(data, indent=2) + '\\n', encoding='utf-8')
"
  assert_command_fails \
    "validate-agent-docs fails when manifest entrypoints.current_state points at a missing file" \
    bash "$REPO_ROOT/scripts/validate-agent-docs.sh" "$CURRENT_FIXTURE"
}

test_direct_validator_passes_on_valid_fixture
test_direct_validator_fails_on_missing_required_heading
test_direct_validator_fails_on_pseudo_frontmatter
test_direct_validator_fails_on_missing_canonical_frontmatter_key
test_direct_validator_fails_on_malformed_yaml_frontmatter
test_direct_validator_fails_on_missing_catalog_entrypoint
test_direct_validator_fails_on_stale_catalog_schema_version
test_direct_validator_passes_on_valid_canonical_successor
test_direct_validator_passes_on_no_single_successor
test_direct_validator_fails_on_invalid_successor_path
test_direct_validator_fails_on_successor_frontmatter_mismatch
test_direct_validator_warns_on_missing_successor_metadata
test_direct_validator_does_not_warn_on_compatible_superseded_by
test_direct_validator_fails_on_successor_metadata_for_active_source
test_direct_validator_fails_on_superseded_by_for_active_source
test_direct_validator_fails_on_non_terminal_no_single_successor_target
test_direct_validator_fails_on_superseded_by_non_terminal_target
test_direct_validator_fails_on_successor_cycle
test_direct_validator_fails_on_successor_mutual_exclusion
test_direct_validator_fails_on_duplicate_catalog_identity
test_direct_validator_fails_on_duplicate_catalog_path
test_direct_validator_fails_on_bad_catalog_doc_path_format
test_direct_validator_fails_on_thick_compatibility_surface
test_direct_validator_fails_on_missing_docs_path_on_disk
test_direct_validator_fails_on_unknown_doc_status
test_direct_validator_fails_on_empty_doc_status
test_direct_validator_fails_on_malformed_status_vocab
test_direct_validator_fails_on_entrypoint_missing_path_field
test_direct_validator_fails_on_manifest_current_state_pointing_at_missing_path

echo "All validator tests passed."
