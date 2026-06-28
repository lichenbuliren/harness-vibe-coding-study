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
  ".harness/manifest.json"
  ".agents/plugins/marketplace.json"
  "docs/index.md"
  "docs/adr/index.md"
  "docs/adr/0001-keep-agents-md-as-root-operating-contract.md"
  "docs/evolution/index.md"
  "docs/tools/index.md"
  "docs/workflows/index.md"
  "docs/workflows/omx-runtime.md"
  "templates/index.md"
  "experiments/field-validation/fixtures.mjs"
  "experiments/field-validation/runs/pilot-001.json"
  "experiments/field-validation/validate-results.mjs"
  "packages/harness-core/package.json"
  "packages/harness-core/bin/inspect-harness.mjs"
  "scripts/install-harness-plugin.mjs"
  "scripts/package-harness-plugin.mjs"
  "scripts/verify-harness-plugin-install.mjs"
  "skills/harness-creator/SKILL.md"
  "skills/harness-creator/scripts/creator.mjs"
  "skills/harness-doctor/SKILL.md"
  "skills/harness-doctor/scripts/doctor.mjs"
  "skills/harness-archiver/SKILL.md"
  "skills/harness-archiver/scripts/archiver.mjs"
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
node --input-type=module -e "import fs from 'node:fs'; import {validateFeatureState} from './packages/harness-core/src/index.mjs'; const data=JSON.parse(fs.readFileSync('feature_list.json','utf8')); const result=validateFeatureState(data); if (!result.valid) throw new Error('feature_list.json is invalid: '+JSON.stringify(result.findings));"

echo "=== Shared harness core check ==="
node --test packages/harness-core/test/*.test.mjs
node packages/harness-core/bin/inspect-harness.mjs --target . >/dev/null

echo "=== Harness Doctor check ==="
node --test tests/harness-doctor/*.test.mjs
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  skills/harness-doctor
node skills/harness-doctor/scripts/doctor.mjs \
  --target . --format json >/dev/null

echo "=== Harness Creator check ==="
node --test tests/harness-creator/*.test.mjs
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  skills/harness-creator
node skills/harness-creator/scripts/creator.mjs \
  plan --target . --format json >/dev/null

echo "=== Harness Product check ==="
node --test tests/harness-product/*.test.mjs
node scripts/verify-harness-plugin-install.mjs
plugin_tmp="$(mktemp -d)"
trap 'rm -rf "$plugin_tmp"' EXIT
node scripts/package-harness-plugin.mjs \
  --output "$plugin_tmp/harness-engineering" >/dev/null
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" \
  "$plugin_tmp/harness-engineering"
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  "$plugin_tmp/harness-engineering/skills/harness-creator"
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  "$plugin_tmp/harness-engineering/skills/harness-doctor"
uv run --offline --with pyyaml python \
  "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" \
  "$plugin_tmp/harness-engineering/skills/harness-archiver"

echo "=== Harness Field Validation check ==="
node --test tests/field-validation/*.test.mjs
node experiments/field-validation/validate-results.mjs \
  experiments/field-validation/runs/pilot-001.json

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
