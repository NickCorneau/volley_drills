#!/usr/bin/env bash
set -euo pipefail

raw_input="$(cat)"
if [[ -z "$raw_input" ]]; then
  echo '{"permission":"allow"}'
  exit 0
fi

command="$(echo "$raw_input" | python3 -c "import json,sys; print(json.load(sys.stdin).get('command',''))")"

blocked_patterns=(
  'git\s+reset\s+--hard'
  'git\s+checkout\s+--'
  'git\s+clean\s+-fd'
  'rm\s+-rf'
)

for pattern in "${blocked_patterns[@]}"; do
  if echo "$command" | grep -qiP "$pattern"; then
    python3 -c "
import json
print(json.dumps({
    'permission': 'deny',
    'user_message': 'Blocked by project hook: destructive shell commands must be reviewed explicitly in this repo.',
    'agent_message': 'Use a safer alternative or ask the human before running destructive cleanup.'
}))
"
    exit 0
  fi
done

echo '{"permission":"allow"}'
