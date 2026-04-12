#!/usr/bin/env bash
set -euo pipefail

raw_input="$(cat)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STATE_PATH="$REPO_ROOT/ops/agent/state/active-task.json"
RUN_DIR="${VOLLEY_AGENT_RUN_DIR:-}"

if [[ -z "$RUN_DIR" && -f "$STATE_PATH" ]]; then
  RUN_DIR="$(python3 -c "import json; print(json.load(open('$STATE_PATH')).get('run_dir',''))" 2>/dev/null)" || true
fi

if [[ -z "$RUN_DIR" ]]; then
  echo "{}"
  exit 0
fi

mkdir -p "$RUN_DIR"

status="unknown"
loop_count=""
if [[ -n "$raw_input" ]]; then
  status="$(echo "$raw_input" | python3 -c "import json,sys; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null)" || true
  loop_count="$(echo "$raw_input" | python3 -c "import json,sys; print(json.load(sys.stdin).get('loop_count',''))" 2>/dev/null)" || true
fi

python3 -c "
import json, datetime
summary = {
    'status': '$status',
    'loop_count': '$loop_count' if '$loop_count' else None,
    'task_id': '${VOLLEY_AGENT_TASK_ID:-}',
    'task_file': '${VOLLEY_AGENT_TASK_FILE:-}',
    'captured_at': datetime.datetime.now().isoformat()
}
with open('$RUN_DIR/cursor-stop.json', 'w') as f:
    json.dump(summary, f, indent=2)
"

echo "{}"
