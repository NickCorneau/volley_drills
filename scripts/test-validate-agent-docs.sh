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
  "schema_version": 1,
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

test_direct_validator_passes_on_valid_fixture
test_direct_validator_fails_on_missing_required_heading
test_direct_validator_fails_on_pseudo_frontmatter
test_direct_validator_fails_on_missing_canonical_frontmatter_key
test_direct_validator_fails_on_missing_catalog_entrypoint
test_direct_validator_fails_on_thick_compatibility_surface

echo "All validator tests passed."
