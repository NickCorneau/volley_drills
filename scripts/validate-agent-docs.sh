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

errors=()
warnings=()

required_paths=(
  "AGENTS.md"
  "README.md"
  "CLAUDE.md"
  "llms.txt"
  "agent-manifest.json"
  "docs/README.md"
  "docs/catalog.json"
  "docs/design/README.md"
  "docs/decisions.md"
  "docs/roadmap.md"
  "docs/prd-foundation.md"
  "docs/milestones/m001-solo-session-loop.md"
  "docs/plans/2026-04-20-m001-adversarial-memo.md"
  "docs/research/README.md"
  "docs/ops/agent-operations.md"
  "docs/ops/agent-documentation-contract.md"
)

entry_docs=(
  "AGENTS.md"
  "docs/README.md"
  "docs/research/README.md"
  "docs/ops/agent-operations.md"
  "docs/ops/agent-documentation-contract.md"
)

required_sections=(
  "## Purpose"
  "## Use This File When"
  "## Not For"
  "## Update When"
  "## Machine Contract"
)

catalog_entrypoints=(
  "AGENTS.md"
  "README.md"
  "docs/catalog.json"
  "docs/README.md"
  "docs/research/README.md"
  "docs/design/README.md"
  "docs/ops/agent-operations.md"
  "docs/ops/agent-documentation-contract.md"
  "CLAUDE.md"
  "llms.txt"
  "agent-manifest.json"
)

canonical_frontmatter_docs=(
  "docs/decisions.md"
  "docs/roadmap.md"
  "docs/prd-foundation.md"
  "docs/milestones/m001-solo-session-loop.md"
  "docs/plans/2026-04-20-m001-adversarial-memo.md"
)

require_path() {
  local rel_path="$1"
  if [[ ! -f "$REPO_ROOT/$rel_path" ]]; then
    errors+=("Missing required agent-doc path: $rel_path")
  fi
}

json_must_parse() {
  local rel_path="$1"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]]; then
    if ! python3 -c "import json; json.load(open('$full_path', encoding='utf-8'))" 2>/dev/null; then
      errors+=("Invalid JSON: $rel_path")
    fi
  fi
}

require_heading() {
  local rel_path="$1"
  local heading="$2"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]] && ! grep -qF "$heading" "$full_path"; then
    errors+=("$rel_path: missing required heading '$heading'")
  fi
}

require_literal() {
  local rel_path="$1"
  local literal="$2"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]] && ! grep -qF "$literal" "$full_path"; then
    errors+=("$rel_path: missing required reference '$literal'")
  fi
}

catalog_must_include_entrypoint() {
  local rel_path="$1"
  local catalog_path="$REPO_ROOT/docs/catalog.json"

  if [[ -f "$catalog_path" ]]; then
    if ! python3 -c "
import json, sys
with open('$catalog_path', encoding='utf-8') as f:
    data = json.load(f)
paths = [item.get('path') for item in data.get('entrypoints', [])]
sys.exit(0 if '$rel_path' in paths else 1)
" 2>/dev/null; then
      errors+=("docs/catalog.json: missing entrypoint '$rel_path'")
    fi
  fi
}

agents_frontmatter_must_be_valid() {
  local agents_path="$REPO_ROOT/AGENTS.md"

  if [[ -f "$agents_path" ]]; then
    local missing_keys
    missing_keys="$(python3 -c "
from pathlib import Path

path = Path(r'$agents_path')
lines = path.read_text(encoding='utf-8').splitlines()
required = {'id', 'title', 'status', 'stage', 'type', 'summary'}

if not lines or lines[0].strip() != '---':
    print('__missing_opening_frontmatter__')
    raise SystemExit(0)

closing_index = None
for idx, line in enumerate(lines[1:], start=1):
    if line.strip() == '---':
        closing_index = idx
        break

if closing_index is None:
    print('__missing_closing_frontmatter__')
    raise SystemExit(0)

keys = set()
for line in lines[1:closing_index]:
    stripped = line.strip()
    if not stripped or stripped.startswith('- '):
        continue
    if ':' not in stripped:
        continue
    keys.add(stripped.split(':', 1)[0].strip())

missing = sorted(required - keys)
if missing:
    print('\n'.join(missing))
" 2>/dev/null)" || true

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__missing_opening_frontmatter__")
          errors+=("AGENTS.md: missing opening YAML frontmatter delimiter '---'")
          ;;
        "__missing_closing_frontmatter__")
          errors+=("AGENTS.md: missing closing YAML frontmatter delimiter '---'")
          ;;
        *)
          errors+=("AGENTS.md: frontmatter missing required key '$item'")
          ;;
      esac
    done <<< "$missing_keys"
  fi

  return 0
}

canonical_frontmatter_must_be_valid() {
  local rel_path="$1"
  local full_path="$REPO_ROOT/$rel_path"

  if [[ -f "$full_path" ]]; then
    local findings
    findings="$(python3 - "$full_path" <<'PY' 2>/dev/null || true
import sys
from pathlib import Path

path = Path(sys.argv[1])
lines = path.read_text(encoding='utf-8').splitlines()
required = {'id', 'title', 'status', 'stage', 'type', 'summary', 'authority', 'last_updated', 'depends_on'}

if not lines or lines[0].strip() != '---':
    print('__missing_opening_frontmatter__')
    raise SystemExit(0)

closing_index = None
for idx, line in enumerate(lines[1:], start=1):
    if line.strip() == '---':
        closing_index = idx
        break

if closing_index is None:
    print('__missing_closing_frontmatter__')
    raise SystemExit(0)

frontmatter_lines = lines[1:closing_index]
keys = set()
for line_number, line in enumerate(frontmatter_lines, start=2):
    stripped = line.strip()
    if not stripped or stripped.startswith('- '):
        continue
    if stripped.startswith('##'):
        print(f'__pseudo_frontmatter__:{line_number}:{stripped}')
        continue
    if line[:1].isspace() or ':' not in stripped:
        continue
    key, value = stripped.split(':', 1)
    value = value.strip()
    if (value.startswith('"') and not value.endswith('"')) or (
        value.startswith("'") and not value.endswith("'")
    ):
        print(f'__invalid_yaml__:unterminated_quoted_scalar_at_line_{line_number}')
        continue
    if value.startswith('[') and not value.endswith(']'):
        print(f'__invalid_yaml__:unterminated_sequence_at_line_{line_number}')
        continue
    keys.add(key.strip())

for key in sorted(required - keys):
    print(f'__missing_key__:{key}')
PY
)"

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__missing_opening_frontmatter__")
          errors+=("$rel_path: missing opening YAML frontmatter delimiter '---'")
          ;;
        "__missing_closing_frontmatter__")
          errors+=("$rel_path: missing closing YAML frontmatter delimiter '---'")
          ;;
        "__pseudo_frontmatter__:"*)
          errors+=("$rel_path: frontmatter contains markdown-styled pseudo-frontmatter '${item#*:*:}'")
          ;;
        "__invalid_yaml__:"*)
          errors+=("$rel_path: frontmatter is not valid YAML (${item#__invalid_yaml__:})")
          ;;
        "__missing_key__:"*)
          errors+=("$rel_path: frontmatter missing required key '${item#__missing_key__:}'")
          ;;
      esac
    done <<< "$findings"
  fi

  return 0
}

manifest_must_point_to_canonical_surfaces() {
  local manifest_path="$REPO_ROOT/agent-manifest.json"

  if [[ -f "$manifest_path" ]]; then
    if ! python3 -c "
import json, sys
with open('$manifest_path', encoding='utf-8') as f:
    data = json.load(f)
entrypoints = data.get('entrypoints', {})
compatibility = entrypoints.get('compatibility', [])
ok = (
    entrypoints.get('prose') == 'AGENTS.md'
    and entrypoints.get('machine') == 'docs/catalog.json'
    and entrypoints.get('hub') == 'README.md'
    and 'CLAUDE.md' in compatibility
    and 'llms.txt' in compatibility
)
sys.exit(0 if ok else 1)
" 2>/dev/null; then
      errors+=("agent-manifest.json: entrypoints must point to AGENTS.md, docs/catalog.json, README.md, CLAUDE.md, and llms.txt")
    fi

    local findings
    findings="$(python3 - "$manifest_path" "$REPO_ROOT" <<'PY' 2>/dev/null || true
import json
import sys
from pathlib import Path

manifest_path = Path(sys.argv[1])
repo_root = Path(sys.argv[2])
data = json.loads(manifest_path.read_text(encoding='utf-8'))
entrypoints = data.get('entrypoints', {}) or {}

# String fields whose values must point at existing files. `current_state` is
# optional but, when present, must resolve.
for field in ('prose', 'machine', 'hub', 'current_state'):
    rel = entrypoints.get(field)
    if rel is None:
        continue
    if not isinstance(rel, str) or not rel:
        print(f'__bad_entrypoint__:{field}')
        continue
    if not (repo_root / rel).exists():
        print(f'__missing_entrypoint__:{field}:{rel}')

compat = entrypoints.get('compatibility')
if isinstance(compat, list):
    for rel in compat:
        if isinstance(rel, str) and rel and not (repo_root / rel).exists():
            print(f'__missing_compat__:{rel}')
PY
)"

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__bad_entrypoint__:"*)
          errors+=("agent-manifest.json: entrypoints.${item#__bad_entrypoint__:} must be a non-empty string when present")
          ;;
        "__missing_entrypoint__:"*)
          rest="${item#__missing_entrypoint__:}"
          field="${rest%%:*}"
          path="${rest#*:}"
          errors+=("agent-manifest.json: entrypoints.$field points to missing path '$path'")
          ;;
        "__missing_compat__:"*)
          errors+=("agent-manifest.json: entrypoints.compatibility includes missing path '${item#__missing_compat__:}'")
          ;;
      esac
    done <<< "$findings"
  fi
}

catalog_must_have_keys() {
  local catalog_path="$REPO_ROOT/docs/catalog.json"
  local expected_schema_version=5

  if [[ -f "$catalog_path" ]]; then
    local findings
    findings="$(python3 - "$catalog_path" "$expected_schema_version" <<'PY' 2>/dev/null || true
import json
import sys

catalog_path = sys.argv[1]
expected_schema_version = int(sys.argv[2])
d = json.load(open(catalog_path, encoding='utf-8'))
required = ['schema_version', 'repo_state', 'entrypoints', 'read_packs', 'source_of_truth_order', 'docs', 'update_routing', 'research_routing', 'status_vocabularies', 'doc_conventions']
for key in [k for k in required if k not in d]:
    print(f'__missing_key__:{key}')
if d.get('schema_version') != expected_schema_version:
    print(f'__stale_schema_version__:{d.get("schema_version")}')
PY
)"

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__missing_key__:"*)
          errors+=("docs/catalog.json: missing required key '${item#__missing_key__:}'")
          ;;
        "__stale_schema_version__:"*)
          errors+=("docs/catalog.json: schema_version must be $expected_schema_version (found ${item#__stale_schema_version__:})")
          ;;
      esac
    done <<< "$findings"
  fi

  return 0
}

catalog_doc_paths_must_exist_and_use_known_status() {
  local catalog_path="$REPO_ROOT/docs/catalog.json"

  if [[ -f "$catalog_path" ]]; then
    local findings
    findings="$(python3 - "$catalog_path" "$REPO_ROOT" <<'PY' 2>/dev/null || true
import json
import sys
from pathlib import Path

catalog_path = Path(sys.argv[1])
repo_root = Path(sys.argv[2])
data = json.loads(catalog_path.read_text(encoding='utf-8'))

def bad_rel_path(rel):
    if not isinstance(rel, str) or not rel:
        return 'empty'
    if '\\' in rel:
        return 'backslash'
    if rel.startswith('/') or rel.startswith('./') or rel.startswith('../'):
        return 'absolute_or_dot_segment'
    if '://' in rel or '#' in rel or '?' in rel:
        return 'scheme_fragment_or_query'
    if '/./' in rel or '/../' in rel or rel.endswith('/.') or rel.endswith('/..'):
        return 'dot_segment'
    return None

def escapes_repo(rel):
    try:
        resolved = (repo_root / rel).resolve()
        root = repo_root.resolve()
        return root != resolved and root not in resolved.parents
    except OSError:
        return True

raw_vocab = (data.get('status_vocabularies', {}).get('doc_status', {}) or {}).get('values')
docs_entries = data.get('docs', []) or []
if raw_vocab is None:
    # Vocabulary is optional only when no docs[] entries carry statuses to check.
    if any(('status' in d) for d in docs_entries if isinstance(d, dict)):
        print('__missing_vocab__:doc_status')
    allowed_statuses = set()
elif not isinstance(raw_vocab, list) or not all(isinstance(v, str) for v in raw_vocab):
    print('__bad_vocab__:doc_status')
    allowed_statuses = set()
else:
    allowed_statuses = set(raw_vocab)

for doc in docs_entries:
    rel = doc.get('path') if isinstance(doc, dict) else None
    if not rel:
        print(f'__missing_path__:{doc.get("id", "<unknown>") if isinstance(doc, dict) else "<unknown>"}')
        continue
    path_problem = bad_rel_path(rel)
    if path_problem or escapes_repo(rel):
        print(f'__bad_doc_path_format__:{rel}:{path_problem or "escapes_repo"}')
        continue
    full = repo_root / rel
    if not full.exists():
        print(f'__missing_doc_path__:{rel}')
    if 'status' not in doc:
        # Status field optional unless vocabulary exists — keep silent.
        pass
    elif allowed_statuses:
        status = doc.get('status')
        if status is None or status == '':
            print(f'__missing_status__:{rel}')
        elif status not in allowed_statuses:
            print(f'__bad_status__:{rel}:{status}')

for entry in data.get('entrypoints', []):
    rel = entry.get('path')
    if not rel:
        print(f'__missing_entrypoint_path_field__:{entry.get("kind", "<unknown>")}')
        continue
    path_problem = bad_rel_path(rel)
    if path_problem or escapes_repo(rel):
        print(f'__bad_entrypoint_path_format__:{rel}:{path_problem or "escapes_repo"}')
        continue
    if not (repo_root / rel).exists():
        print(f'__missing_entrypoint_path__:{rel}')
PY
)"

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__missing_path__:"*)
          errors+=("docs/catalog.json: docs entry '${item#__missing_path__:}' has no path")
          ;;
        "__missing_doc_path__:"*)
          errors+=("docs/catalog.json: docs path does not exist on disk: '${item#__missing_doc_path__:}'")
          ;;
        "__bad_doc_path_format__:"*)
          errors+=("docs/catalog.json: docs path must be a safe repo-relative path (${item#__bad_doc_path_format__:})")
          ;;
        "__missing_entrypoint_path_field__:"*)
          errors+=("docs/catalog.json: entrypoints entry kind='${item#__missing_entrypoint_path_field__:}' is missing 'path'")
          ;;
        "__bad_entrypoint_path_format__:"*)
          errors+=("docs/catalog.json: entrypoint path must be a safe repo-relative path (${item#__bad_entrypoint_path_format__:})")
          ;;
        "__missing_entrypoint_path__:"*)
          errors+=("docs/catalog.json: entrypoint path does not exist on disk: '${item#__missing_entrypoint_path__:}'")
          ;;
        "__missing_status__:"*)
          errors+=("docs/catalog.json: docs path '${item#__missing_status__:}' is missing 'status' (must match status_vocabularies.doc_status.values)")
          ;;
        "__bad_status__:"*)
          rest="${item#__bad_status__:}"
          path="${rest%%:*}"
          status="${rest#*:}"
          errors+=("docs/catalog.json: docs path '$path' uses unknown status '$status' (must match status_vocabularies.doc_status.values)")
          ;;
        "__missing_vocab__:doc_status")
          errors+=("docs/catalog.json: status_vocabularies.doc_status.values is missing")
          ;;
        "__bad_vocab__:doc_status")
          errors+=("docs/catalog.json: status_vocabularies.doc_status.values must be a list of strings")
          ;;
      esac
    done <<< "$findings"
  fi

  return 0
}

archive_lifecycle_must_be_consistent() {
  local catalog_path="$REPO_ROOT/docs/catalog.json"

  if [[ -f "$catalog_path" ]]; then
    local findings
    findings="$(python3 - "$catalog_path" <<'PY' 2>/dev/null || true
import json
import sys

catalog_path = sys.argv[1]
data = json.load(open(catalog_path, encoding='utf-8'))

for doc in data.get('docs', []) or []:
    if not isinstance(doc, dict):
        continue

    rel = doc.get('path')
    status = doc.get('status')
    doc_type = doc.get('type')
    active_registry = doc.get('active_registry')

    if not isinstance(rel, str) or not rel:
        continue

    in_docs_archive = rel.startswith('docs/archive/plans/') or rel.startswith('docs/archive/brainstorms/')
    in_active_plans = rel.startswith('docs/plans/')

    if in_docs_archive:
        if active_registry is True:
            print(f'__archived_active_registry__:{rel}')
        if status not in {'complete', 'superseded'}:
            print(f'__bad_archive_status__:{rel}:{status}')

    if doc_type == 'plan' and in_active_plans and status == 'complete':
        if active_registry is not True:
            print(f'__missing_active_registry__:{rel}')
        if not doc.get('canonical_for'):
            print(f'__missing_registry_summary__:{rel}')

    if active_registry is True:
        if doc_type != 'plan' or not in_active_plans or status not in {'active', 'complete'}:
            print(f'__bad_active_registry_scope__:{rel}')
PY
)"

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__archived_active_registry__:"*)
          errors+=("docs/catalog.json: archived doc must not be marked active_registry: '${item#__archived_active_registry__:}'")
          ;;
        "__bad_archive_status__:"*)
          rest="${item#__bad_archive_status__:}"
          path="${rest%%:*}"
          status="${rest#*:}"
          errors+=("docs/catalog.json: archived doc '$path' must use status 'complete' or 'superseded' (found '$status')")
          ;;
        "__missing_active_registry__:"*)
          errors+=("docs/catalog.json: complete plan kept under docs/plans must set active_registry: true: '${item#__missing_active_registry__:}'")
          ;;
        "__missing_registry_summary__:"*)
          errors+=("docs/catalog.json: active registry plan must include canonical_for summary: '${item#__missing_registry_summary__:}'")
          ;;
        "__bad_active_registry_scope__:"*)
          errors+=("docs/catalog.json: active_registry is only valid for active/complete plan entries under docs/plans: '${item#__bad_active_registry_scope__:}'")
          ;;
      esac
    done <<< "$findings"
  fi

  return 0
}

successor_metadata_must_be_consistent() {
  local catalog_path="$REPO_ROOT/docs/catalog.json"

  if [[ -f "$catalog_path" ]]; then
    local findings
    findings="$(python3 - "$catalog_path" "$REPO_ROOT" <<'PY' 2>/dev/null || true
import json
import re
import sys
from pathlib import Path

catalog_path = Path(sys.argv[1])
repo_root = Path(sys.argv[2])
data = json.loads(catalog_path.read_text(encoding='utf-8'))
docs = [doc for doc in data.get('docs', []) or [] if isinstance(doc, dict)]

def bad_rel_path(rel):
    if not isinstance(rel, str) or not rel:
        return 'empty'
    if '\\' in rel:
        return 'backslash'
    if rel.startswith('/') or re.match(r'^[A-Za-z][A-Za-z0-9+.-]*:', rel):
        return 'absolute_or_scheme'
    if rel.startswith('./') or rel.startswith('../') or '/./' in rel or '/../' in rel or rel.endswith('/.') or rel.endswith('/..'):
        return 'dot_segment'
    if '#' in rel or '?' in rel:
        return 'fragment_or_query'
    return None

def frontmatter_superseded_by(rel):
    if bad_rel_path(rel):
        return None
    path = repo_root / rel
    if not path.exists():
        return None
    lines = path.read_text(encoding='utf-8', errors='replace').splitlines()
    if not lines or lines[0].strip() != '---':
        return None
    for line in lines[1:]:
        if line.strip() == '---':
            break
        if line.startswith('superseded_by:'):
            return line.split(':', 1)[1].strip().strip('"').strip("'") or None
    return None

def target_problem(source_rel, target_rel, path_to_doc):
    target = path_to_doc[target_rel]
    target_status = target.get('status')
    target_successor = target.get('canonical_successor')
    target_disposition = target.get('successor_disposition')
    target_reason = target.get('successor_reason')
    target_superseded_by = frontmatter_superseded_by(target_rel)

    if target_rel.startswith('docs/archive/'):
        return f'archived:{target_rel}'
    if target_status == 'superseded':
        return f'superseded:{target_rel}'
    if target_successor is not None or target_superseded_by is not None or target_disposition is not None or target_reason is not None:
        return f'non_terminal:{target_rel}'
    return None

paths = {}
ids = {}
for doc in docs:
    rel = doc.get('path')
    doc_id = doc.get('id')
    if isinstance(rel, str) and rel:
        paths.setdefault(rel, []).append(doc)
    if isinstance(doc_id, str) and doc_id:
        ids.setdefault(doc_id, []).append(doc)

for rel, entries in paths.items():
    if len(entries) > 1:
        print(f'__duplicate_doc_path__:{rel}')
for doc_id, entries in ids.items():
    if len(entries) > 1:
        print(f'__duplicate_doc_id__:{doc_id}')

path_to_doc = {rel: entries[0] for rel, entries in paths.items() if len(entries) == 1}
graph = {}

for doc in docs:
    rel = doc.get('path')
    if not isinstance(rel, str) or not rel:
        continue

    canonical_successor = doc.get('canonical_successor')
    disposition = doc.get('successor_disposition')
    reason = doc.get('successor_reason')
    superseded_by = frontmatter_superseded_by(rel)
    source_allows_successor = doc.get('status') == 'superseded' or rel.startswith('docs/archive/')

    if (canonical_successor is not None or disposition is not None or reason is not None or superseded_by is not None) and not source_allows_successor:
        print(f'__bad_successor_source_scope__:{rel}')

    if canonical_successor is not None:
        path_problem = bad_rel_path(canonical_successor)
        if path_problem:
            print(f'__bad_successor_path__:{rel}:{path_problem}:{canonical_successor}')
        elif canonical_successor not in path_to_doc:
            print(f'__missing_successor_target__:{rel}:{canonical_successor}')
        else:
            problem = target_problem(rel, canonical_successor, path_to_doc)
            if problem:
                print(f'__bad_successor_target__:{rel}:{problem}')
            graph[rel] = canonical_successor

    if canonical_successor is not None and disposition is not None:
        print(f'__successor_mutual_exclusion__:{rel}')

    if disposition is not None and disposition != 'no_single_successor':
        print(f'__bad_successor_disposition__:{rel}:{disposition}')

    if disposition == 'no_single_successor':
        if not isinstance(reason, str) or not reason.strip():
            print(f'__missing_successor_reason__:{rel}')
        elif len(reason.strip()) > 240:
            print(f'__long_successor_reason__:{rel}')
    elif reason is not None:
        print(f'__orphan_successor_reason__:{rel}')

    if superseded_by is not None:
        path_problem = bad_rel_path(superseded_by)
        if path_problem:
            print(f'__bad_superseded_by_path__:{rel}:{path_problem}:{superseded_by}')
        elif superseded_by not in path_to_doc:
            print(f'__missing_superseded_by_target__:{rel}:{superseded_by}')
        else:
            problem = target_problem(rel, superseded_by, path_to_doc)
            if problem:
                print(f'__bad_superseded_by_target__:{rel}:{problem}')
            graph.setdefault(rel, superseded_by)
        if canonical_successor is not None and superseded_by != canonical_successor:
            print(f'__successor_frontmatter_mismatch__:{rel}:{canonical_successor}:{superseded_by}')

    has_forward_route = canonical_successor is not None or superseded_by is not None or disposition == 'no_single_successor'
    looks_superseded = doc.get('status') == 'superseded'
    if looks_superseded and not has_forward_route:
        print(f'__missing_successor_warning__:{rel}')

for start in list(graph):
    seen = []
    current = start
    while current in graph:
        if current in seen:
            cycle = ' -> '.join(seen[seen.index(current):] + [current])
            print(f'__successor_cycle__:{cycle}')
            break
        seen.append(current)
        current = graph[current]
PY
)"

    while IFS= read -r item; do
      [[ -z "$item" ]] && continue
      case "$item" in
        "__duplicate_doc_path__:"*)
          errors+=("docs/catalog.json: duplicate docs[].path '${item#__duplicate_doc_path__:}'")
          ;;
        "__duplicate_doc_id__:"*)
          errors+=("docs/catalog.json: duplicate docs[].id '${item#__duplicate_doc_id__:}'")
          ;;
        "__bad_successor_path__:"*)
          errors+=("docs/catalog.json: invalid canonical_successor (${item#__bad_successor_path__:})")
          ;;
        "__missing_successor_target__:"*)
          errors+=("docs/catalog.json: canonical_successor target is not a unique cataloged doc (${item#__missing_successor_target__:})")
          ;;
        "__bad_successor_target__:"*)
          errors+=("docs/catalog.json: canonical_successor target is not terminal (${item#__bad_successor_target__:})")
          ;;
        "__successor_mutual_exclusion__:"*)
          errors+=("docs/catalog.json: docs path '${item#__successor_mutual_exclusion__:}' must not set both canonical_successor and successor_disposition")
          ;;
        "__bad_successor_source_scope__:"*)
          errors+=("docs/catalog.json: successor metadata is only valid on archived or superseded docs: '${item#__bad_successor_source_scope__:}'")
          ;;
        "__bad_successor_disposition__:"*)
          errors+=("docs/catalog.json: invalid successor_disposition (${item#__bad_successor_disposition__:})")
          ;;
        "__missing_successor_reason__:"*)
          errors+=("docs/catalog.json: successor_disposition requires successor_reason for '${item#__missing_successor_reason__:}'")
          ;;
        "__long_successor_reason__:"*)
          errors+=("docs/catalog.json: successor_reason must be short for '${item#__long_successor_reason__:}'")
          ;;
        "__orphan_successor_reason__:"*)
          errors+=("docs/catalog.json: successor_reason requires successor_disposition for '${item#__orphan_successor_reason__:}'")
          ;;
        "__bad_superseded_by_path__:"*)
          errors+=("frontmatter superseded_by uses an invalid path (${item#__bad_superseded_by_path__:})")
          ;;
        "__missing_superseded_by_target__:"*)
          errors+=("frontmatter superseded_by target is not a unique cataloged doc (${item#__missing_superseded_by_target__:})")
          ;;
        "__bad_superseded_by_target__:"*)
          errors+=("frontmatter superseded_by target is not terminal (${item#__bad_superseded_by_target__:})")
          ;;
        "__successor_frontmatter_mismatch__:"*)
          errors+=("docs/catalog.json: canonical_successor and frontmatter superseded_by disagree (${item#__successor_frontmatter_mismatch__:})")
          ;;
        "__successor_cycle__:"*)
          errors+=("docs/catalog.json: successor metadata cycle detected: ${item#__successor_cycle__:}")
          ;;
        "__missing_successor_warning__:"*)
          warnings+=("SUCCESSOR_MISSING ${item#__missing_successor_warning__:}: add canonical_successor, compatible superseded_by, or successor_disposition")
          ;;
        "__"*)
          errors+=("docs/catalog.json: unknown successor metadata validator finding '$item'")
          ;;
      esac
    done <<< "$findings"
  fi

  return 0
}

cap_status_must_be_consistent() {
  local backlog_path="$REPO_ROOT/docs/status/post-m001-content-backlog.md"

  if [[ ! -f "$backlog_path" ]]; then
    return 0
  fi

  local findings
  findings="$(python3 - "$backlog_path" <<'PY' 2>/dev/null || true
import json
import re
import sys
from datetime import date
from pathlib import Path

backlog_path = Path(sys.argv[1])
text = backlog_path.read_text(encoding='utf-8')

EXPECTED_CAP_TOTAL = 10
EXPECTED_EXPIRY = '2026-07-20'
ALLOWED_STATUSES = {'reserved', 'authored', 'killed'}
REQUIRED_RESERVED_FIELDS = ['slot_id', 'tier', 'status', 'expiry', 'last_checked', 'required_trigger', 'trigger_source', 'description']
REQUIRED_AUTHORED_FIELDS = ['slot_id', 'status']
REQUIRED_KILLED_FIELDS = ['slot_id', 'status', 'killed_date', 'kill_reason']
DATE_PATTERN = re.compile(r'^\d{4}-\d{2}-\d{2}$')

match = re.search(
    r'<!--\s*cap-status-data:start\s*-->\s*```json\s*(.*?)\s*```\s*<!--\s*cap-status-data:end\s*-->',
    text,
    re.DOTALL,
)
if not match:
    print('__cap_status_block_missing__')
    raise SystemExit(0)

try:
    data = json.loads(match.group(1))
except json.JSONDecodeError as exc:
    print(f'__cap_status_block_invalid_json__:{exc.msg}_line_{exc.lineno}')
    raise SystemExit(0)

if not isinstance(data, dict):
    print('__cap_status_block_not_object__')
    raise SystemExit(0)

cap_total = data.get('cap_total')
consumed = data.get('consumed')
reserved = data.get('reserved')
expiry_date = data.get('expiry_date')
reserved_slots = data.get('reserved_slots')
authored_layer_a = data.get('tier_1a_authored')

if not isinstance(cap_total, int):
    print('__cap_total_not_int__')
else:
    if cap_total != EXPECTED_CAP_TOTAL:
        print(f'__cap_total_mismatch__:{EXPECTED_CAP_TOTAL}:{cap_total}')

if not isinstance(consumed, int):
    print('__consumed_not_int__')
if not isinstance(reserved, int):
    print('__reserved_not_int__')

if isinstance(cap_total, int) and isinstance(consumed, int) and isinstance(reserved, int):
    if consumed + reserved != cap_total:
        print(f'__cap_sum_mismatch__:{consumed + reserved}:{cap_total}')

if expiry_date != EXPECTED_EXPIRY:
    print(f'__expiry_date_mismatch__:{EXPECTED_EXPIRY}:{expiry_date}')

if not isinstance(reserved_slots, list):
    print('__reserved_slots_not_list__')
    reserved_slots = []

if isinstance(reserved, int):
    # `reserved` tracks the count of slots whose individual status is not yet
    # `authored` (i.e., `reserved` + `killed`). When a slot transitions in
    # place from `reserved` to `authored`, the cap accounting must move
    # consumed+1 / reserved-1 (cap_total = consumed + reserved is preserved).
    # When a slot transitions to `killed`, no drill was authored, so consumed
    # stays put and the killed slot still counts as a non-authored entry
    # against `reserved`. Counting raw array length here would force a false
    # positive on the first reserved -> authored transition.
    actually_reserved = sum(
        1 for s in reserved_slots
        if isinstance(s, dict) and s.get('status') != 'authored'
    )
    if actually_reserved != reserved:
        print(f'__reserved_slot_count_mismatch__:{reserved}:{actually_reserved}')

today = date.today()
expected_expiry_date = None
try:
    if expiry_date and DATE_PATTERN.match(expiry_date):
        expected_expiry_date = date.fromisoformat(expiry_date)
except ValueError:
    pass

slot_ids_seen = set()

for slot in reserved_slots:
    if not isinstance(slot, dict):
        print('__bad_slot_record_shape__:non_object')
        continue
    slot_id = slot.get('slot_id', '<unknown>')
    if not isinstance(slot_id, str) or not slot_id:
        print('__bad_slot_record_shape__:missing_slot_id')
        continue
    if slot_id in slot_ids_seen:
        print(f'__duplicate_slot_id__:{slot_id}')
    slot_ids_seen.add(slot_id)

    status = slot.get('status')
    if status not in ALLOWED_STATUSES:
        print(f'__bad_slot_status__:{slot_id}:{status}')
        continue

    if status == 'reserved':
        for field in REQUIRED_RESERVED_FIELDS:
            if field not in slot or slot[field] in (None, ''):
                print(f'__missing_slot_field__:{slot_id}:{field}')
        expiry = slot.get('expiry')
        if expiry != EXPECTED_EXPIRY:
            print(f'__slot_expiry_mismatch__:{slot_id}:{EXPECTED_EXPIRY}:{expiry}')
        last_checked = slot.get('last_checked')
        if isinstance(last_checked, str) and not DATE_PATTERN.match(last_checked):
            print(f'__slot_last_checked_bad_format__:{slot_id}:{last_checked}')
        if isinstance(expiry, str) and DATE_PATTERN.match(expiry):
            try:
                expiry_dt = date.fromisoformat(expiry)
                if today > expiry_dt:
                    print(f'__expired_reserved_slot__:{slot_id}:{expiry}')
            except ValueError:
                print(f'__slot_expiry_bad_format__:{slot_id}:{expiry}')
    elif status == 'authored':
        for field in REQUIRED_AUTHORED_FIELDS:
            if field not in slot or slot[field] in (None, ''):
                print(f'__missing_slot_field__:{slot_id}:{field}')
        drill_id = slot.get('drill_id')
        shipped_under = slot.get('shipped_under')
        shipped_date = slot.get('shipped_date')
        authored_record_ref = slot.get('authored_record_ref')
        if not (drill_id or shipped_under or shipped_date or authored_record_ref):
            print(f'__bad_authored_record__:{slot_id}:missing_evidence_citation')
    elif status == 'killed':
        for field in REQUIRED_KILLED_FIELDS:
            if field not in slot or slot[field] in (None, ''):
                print(f'__missing_slot_field__:{slot_id}:{field}')
        killed_date = slot.get('killed_date')
        if isinstance(killed_date, str) and not DATE_PATTERN.match(killed_date):
            print(f'__bad_killed_record__:{slot_id}:killed_date_bad_format')
        kill_reason = slot.get('kill_reason')
        if isinstance(kill_reason, str) and len(kill_reason.strip()) < 12:
            print(f'__bad_killed_record__:{slot_id}:kill_reason_too_short')

if isinstance(authored_layer_a, list):
    for record in authored_layer_a:
        if not isinstance(record, dict):
            print('__bad_authored_layer_a_record__:non_object')
            continue
        slot_id = record.get('slot_id', '<unknown>')
        if record.get('status') != 'authored':
            print(f'__bad_authored_layer_a_record__:{slot_id}:status_not_authored')
        if not record.get('drill_id'):
            print(f'__bad_authored_layer_a_record__:{slot_id}:missing_drill_id')
PY
)"

  while IFS= read -r item; do
    [[ -z "$item" ]] && continue
    case "$item" in
      "__cap_status_block_missing__")
        errors+=("docs/status/post-m001-content-backlog.md: missing cap-status JSON block (expected '<!-- cap-status-data:start -->' fence)")
        ;;
      "__cap_status_block_invalid_json__:"*)
        errors+=("docs/status/post-m001-content-backlog.md: cap-status JSON block is not valid JSON (${item#__cap_status_block_invalid_json__:})")
        ;;
      "__cap_status_block_not_object__")
        errors+=("docs/status/post-m001-content-backlog.md: cap-status JSON block must be a JSON object")
        ;;
      "__cap_total_not_int__")
        errors+=("docs/status/post-m001-content-backlog.md: cap_total must be an integer")
        ;;
      "__cap_total_mismatch__:"*)
        rest="${item#__cap_total_mismatch__:}"
        expected="${rest%%:*}"
        found="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: cap_total must be $expected (found $found)")
        ;;
      "__consumed_not_int__")
        errors+=("docs/status/post-m001-content-backlog.md: consumed must be an integer")
        ;;
      "__reserved_not_int__")
        errors+=("docs/status/post-m001-content-backlog.md: reserved must be an integer")
        ;;
      "__cap_sum_mismatch__:"*)
        rest="${item#__cap_sum_mismatch__:}"
        sum="${rest%%:*}"
        total="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: consumed + reserved ($sum) must equal cap_total ($total)")
        ;;
      "__expiry_date_mismatch__:"*)
        rest="${item#__expiry_date_mismatch__:}"
        expected="${rest%%:*}"
        found="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: expiry_date must be $expected (found $found)")
        ;;
      "__reserved_slots_not_list__")
        errors+=("docs/status/post-m001-content-backlog.md: reserved_slots must be a list")
        ;;
      "__reserved_slot_count_mismatch__:"*)
        rest="${item#__reserved_slot_count_mismatch__:}"
        declared="${rest%%:*}"
        found="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: reserved=$declared but reserved_slots[] has $found entries")
        ;;
      "__bad_slot_record_shape__:"*)
        errors+=("docs/status/post-m001-content-backlog.md: malformed slot record (${item#__bad_slot_record_shape__:})")
        ;;
      "__duplicate_slot_id__:"*)
        errors+=("docs/status/post-m001-content-backlog.md: duplicate slot_id '${item#__duplicate_slot_id__:}'")
        ;;
      "__bad_slot_status__:"*)
        rest="${item#__bad_slot_status__:}"
        slot_id="${rest%%:*}"
        status="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: slot '$slot_id' uses unknown status '$status' (must be reserved/authored/killed)")
        ;;
      "__missing_slot_field__:"*)
        rest="${item#__missing_slot_field__:}"
        slot_id="${rest%%:*}"
        field="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: slot '$slot_id' missing required field '$field'")
        ;;
      "__slot_expiry_mismatch__:"*)
        rest="${item#__slot_expiry_mismatch__:}"
        slot_id="${rest%%:*}"
        rest2="${rest#*:}"
        expected="${rest2%%:*}"
        found="${rest2#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: slot '$slot_id' expiry must be $expected (found $found)")
        ;;
      "__slot_last_checked_bad_format__:"*)
        rest="${item#__slot_last_checked_bad_format__:}"
        slot_id="${rest%%:*}"
        value="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: slot '$slot_id' last_checked must be YYYY-MM-DD (found '$value')")
        ;;
      "__slot_expiry_bad_format__:"*)
        rest="${item#__slot_expiry_bad_format__:}"
        slot_id="${rest%%:*}"
        value="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: slot '$slot_id' expiry is not a valid YYYY-MM-DD date (found '$value')")
        ;;
      "__expired_reserved_slot__:"*)
        rest="${item#__expired_reserved_slot__:}"
        slot_id="${rest%%:*}"
        expiry="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: slot '$slot_id' expired on $expiry while still status=reserved (must transition to authored or killed)")
        ;;
      "__bad_authored_record__:"*)
        rest="${item#__bad_authored_record__:}"
        slot_id="${rest%%:*}"
        reason="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: authored slot '$slot_id' is missing evidence citation ($reason)")
        ;;
      "__bad_killed_record__:"*)
        rest="${item#__bad_killed_record__:}"
        slot_id="${rest%%:*}"
        reason="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: killed slot '$slot_id' is malformed ($reason)")
        ;;
      "__bad_authored_layer_a_record__:"*)
        rest="${item#__bad_authored_layer_a_record__:}"
        slot_id="${rest%%:*}"
        reason="${rest#*:}"
        errors+=("docs/status/post-m001-content-backlog.md: tier_1a_authored record '$slot_id' is malformed ($reason)")
        ;;
      "__"*)
        errors+=("docs/status/post-m001-content-backlog.md: unknown cap-status validator finding '$item'")
        ;;
    esac
  done <<< "$findings"

  return 0
}

for rel_path in "${required_paths[@]}"; do
  require_path "$rel_path"
done

json_must_parse "docs/catalog.json"
json_must_parse "agent-manifest.json"
agents_frontmatter_must_be_valid
manifest_must_point_to_canonical_surfaces
catalog_must_have_keys
catalog_doc_paths_must_exist_and_use_known_status
archive_lifecycle_must_be_consistent
successor_metadata_must_be_consistent
cap_status_must_be_consistent

for rel_path in "${canonical_frontmatter_docs[@]}"; do
  canonical_frontmatter_must_be_valid "$rel_path"
done

for rel_path in "${entry_docs[@]}"; do
  for heading in "${required_sections[@]}"; do
    require_heading "$rel_path" "$heading"
  done
done

for rel_path in "${catalog_entrypoints[@]}"; do
  catalog_must_include_entrypoint "$rel_path"
done

require_literal "CLAUDE.md" "AGENTS.md"
require_literal "CLAUDE.md" "docs/catalog.json"
require_literal "llms.txt" "AGENTS.md"
require_literal "llms.txt" "docs/catalog.json"
require_literal "AGENTS.md" "scripts/validate-agent-docs.sh"

if [[ ${#errors[@]} -gt 0 ]]; then
  echo "Agent-doc validation failed:" >&2
  for err in "${errors[@]}"; do
    echo "  - $err" >&2
  done
  exit 1
fi

if [[ ${#warnings[@]} -gt 0 ]]; then
  echo "Agent-doc validation warnings:"
  for warning in "${warnings[@]}"; do
    echo "  - $warning"
  done
fi

echo "Agent doc validation passed."
