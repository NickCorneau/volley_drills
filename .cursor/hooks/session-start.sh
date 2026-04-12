#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STATE_PATH="$REPO_ROOT/ops/agent/state/active-task.json"

TASK_FILE="${VOLLEY_AGENT_TASK_FILE:-}"
RUN_DIR="${VOLLEY_AGENT_RUN_DIR:-}"

if [[ -z "$TASK_FILE" && -f "$STATE_PATH" ]]; then
  TASK_FILE="$(python3 -c "import json; print(json.load(open('$STATE_PATH')).get('task_file',''))" 2>/dev/null)" || true
  RUN_DIR="$(python3 -c "import json; print(json.load(open('$STATE_PATH')).get('run_dir',''))" 2>/dev/null)" || true
fi

if [[ -z "$TASK_FILE" || ! -f "$TASK_FILE" ]]; then
  echo "{}"
  exit 0
fi

context="$(python3 -c "
import json
d = json.load(open('$TASK_FILE'))
must_read = d.get('handoff',{}).get('must_read',[])
verify = d.get('verification',{}).get('commands',[])
escalate = d.get('escalate_if',[])
lines = [
    'Active queued task: {} - {}'.format(d['id'], d['title']),
    'Milestone: {}'.format(d.get('milestone','')),
    'Summary: {}'.format(d.get('summary','')),
    'Must read: {}'.format(', '.join(must_read)),
    'Verification commands: {}'.format(' ; '.join(verify)),
    'Escalate if: {}'.format(' ; '.join(escalate)),
    'Record durable outcomes in tracked docs or queue files. Put volatile run artifacts in ops/agent/runs.'
]
print('\n'.join(lines))
")" || { echo "{}"; exit 0; }

task_id="$(python3 -c "import json; print(json.load(open('$TASK_FILE'))['id'])")"

python3 -c "
import json
result = {
    'env': {
        'VOLLEY_AGENT_TASK_ID': '$task_id',
        'VOLLEY_AGENT_TASK_FILE': '$TASK_FILE',
        'VOLLEY_AGENT_RUN_DIR': '$RUN_DIR'
    },
    'additional_context': '''$context'''
}
print(json.dumps(result, indent=2))
"
