#!/bin/bash
set -euo pipefail

echo "=== Harness Vibe Coding Study Initialization ==="

required_paths=(
  "README.md"
  "CONTEXT.md"
  "AGENTS.md"
  "feature_list.json"
  "progress.md"
  "session-handoff.md"
  "docs/index.md"
  "docs/adr/index.md"
  "docs/adr/0001-keep-agents-md-as-root-operating-contract.md"
  "docs/evolution/index.md"
  "docs/tools/index.md"
  "docs/workflows/index.md"
  "docs/workflows/omx-runtime.md"
  "templates/index.md"
)

echo "=== Required path check ==="
for path in "${required_paths[@]}"; do
  if [[ ! -e "$path" ]]; then
    echo "MISSING: $path" >&2
    exit 1
  fi
  echo "OK: $path"
done

echo "=== Feature tracker JSON check ==="
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('feature_list.json','utf8')); if (!Array.isArray(data.features) || data.features.length === 0) { throw new Error('feature_list.json must contain a non-empty features array'); } for (const feature of data.features) { for (const key of ['id','name','description','dependencies','status','evidence']) { if (!(key in feature)) throw new Error('feature missing key '+key+': '+JSON.stringify(feature)); } if (!Array.isArray(feature.dependencies)) throw new Error('feature dependencies must be an array: '+feature.id); }"

echo "=== Documentation entrypoint check ==="
grep -q "docs/evolution" README.md
grep -q "feature_list.json" AGENTS.md
grep -q "progress.md" AGENTS.md

echo "=== Git state summary ==="
git status --short

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature_list.json for the current scoped feature"
echo "2. Read progress.md for session continuity"
echo "3. Keep docs/evolution/ for durable stage records"
