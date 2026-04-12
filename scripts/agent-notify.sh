#!/usr/bin/env bash
set -euo pipefail

STATUS=""
TASK_ID=""
MESSAGE=""
RUN_DIR=""
WEBHOOK_URL="${VOLLEY_AGENT_WEBHOOK_URL:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --status)      STATUS="$2"; shift 2 ;;
    --task-id)     TASK_ID="$2"; shift 2 ;;
    --message)     MESSAGE="$2"; shift 2 ;;
    --run-dir)     RUN_DIR="$2"; shift 2 ;;
    --webhook-url) WEBHOOK_URL="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$STATUS" ]] && { echo "--status required" >&2; exit 1; }
[[ -z "$TASK_ID" ]] && { echo "--task-id required" >&2; exit 1; }
[[ -z "$MESSAGE" ]] && { echo "--message required" >&2; exit 1; }

timestamp="$(date -Iseconds)"

payload="$(python3 -c "
import json
print(json.dumps({
    'status': '$STATUS',
    'task_id': '$TASK_ID',
    'message': '''$MESSAGE''',
    'timestamp': '$timestamp'
}, indent=2))
")"

if [[ -n "$RUN_DIR" ]]; then
  mkdir -p "$RUN_DIR"
  echo "$payload" > "$RUN_DIR/notification.json"
fi

if [[ -n "$WEBHOOK_URL" ]]; then
  curl -s -X POST -H "Content-Type: application/json" -d "$payload" "$WEBHOOK_URL" >/dev/null || echo "Webhook notification failed" >&2
fi

echo "[$STATUS] $TASK_ID - $MESSAGE"
