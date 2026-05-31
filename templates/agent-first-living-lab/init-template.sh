#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  bash init-template.sh \
    [--target-dir "../my-product-project"] \
    [--app-pack none|frontend-react-ts] \
    --project-name "My Project" \
    --project-intent "Project intent" \
    --current-phase "Initialization" \
    --date "YYYY-MM-DD" \
    --working-assumption "First assumption" \
    --non-goal "First non-goal" \
    --alternative "Alternative considered"

This script initializes core placeholders in the Agent-First Living Lab
template. It intentionally does not replace placeholders in record templates.

By default, it creates only the product-project harness core. Use
`--app-pack frontend-react-ts` to add a root-level React + TypeScript source
scaffold.

When --target-dir is provided, the script first copies the template into that
directory. Existing non-empty target directories are rejected.
USAGE
}

target_dir=""
app_pack="none"
project_name=""
project_intent=""
current_phase=""
date_value=""
working_assumption=""
non_goal=""
alternative=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target-dir)
      target_dir="${2:-}"
      shift 2
      ;;
    --app-pack)
      app_pack="${2:-}"
      shift 2
      ;;
    --project-name)
      project_name="${2:-}"
      shift 2
      ;;
    --project-intent)
      project_intent="${2:-}"
      shift 2
      ;;
    --current-phase)
      current_phase="${2:-}"
      shift 2
      ;;
    --date)
      date_value="${2:-}"
      shift 2
      ;;
    --working-assumption)
      working_assumption="${2:-}"
      shift 2
      ;;
    --non-goal)
      non_goal="${2:-}"
      shift 2
      ;;
    --alternative)
      alternative="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

missing=()
[[ -n "$project_name" ]] || missing+=("--project-name")
[[ -n "$project_intent" ]] || missing+=("--project-intent")
[[ -n "$current_phase" ]] || missing+=("--current-phase")
[[ -n "$date_value" ]] || missing+=("--date")
[[ -n "$working_assumption" ]] || missing+=("--working-assumption")
[[ -n "$non_goal" ]] || missing+=("--non-goal")
[[ -n "$alternative" ]] || missing+=("--alternative")

case "$app_pack" in
  none|core|frontend-react-ts)
    ;;
  *)
    echo "Unknown app pack: $app_pack" >&2
    echo "Supported app packs: none, frontend-react-ts" >&2
    exit 2
    ;;
esac

if [[ "$app_pack" == "core" ]]; then
  app_pack="none"
fi

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "Missing required arguments: ${missing[*]}" >&2
  usage >&2
  exit 2
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

fail_if_not_template_root() {
  local root="$1"

  if [[ ! -f "$root/TEMPLATE.md" || ! -f "$root/AGENTS.md" || ! -d "$root/harness/runs" ]]; then
    echo "Not an Agent-First Living Lab template root: $root" >&2
    echo "Run this script from the copied template root, or pass --target-dir from the source template." >&2
    exit 1
  fi

  if ! grep -q "Agent-First Living Lab Template" "$root/TEMPLATE.md"; then
    echo "TEMPLATE.md does not look like the Agent-First Living Lab template." >&2
    exit 1
  fi
}

if [[ -n "$target_dir" ]]; then
  fail_if_not_template_root "$script_dir"

  target_parent="$(dirname "$target_dir")"
  target_name="$(basename "$target_dir")"
  if [[ ! -d "$target_parent" ]]; then
    echo "Target parent directory does not exist: $target_parent" >&2
    exit 1
  fi

  source_abs="$(cd "$script_dir" && pwd -P)"
  target_parent_abs="$(cd "$target_parent" && pwd -P)"
  target_abs="$target_parent_abs/$target_name"
  if [[ "$target_abs" == "$source_abs" || "$target_abs" == "$source_abs"/* ]]; then
    echo "Target directory must not be inside the source template: $target_dir" >&2
    exit 1
  fi

  if [[ -e "$target_dir" ]] && [[ -n "$(find "$target_dir" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
    echo "Target directory already exists and is not empty: $target_dir" >&2
    echo "Choose a new directory name, empty the directory, or back it up first." >&2
    exit 1
  fi

  mkdir -p "$target_dir"

  (
    cd "$script_dir"
    tar -cf - .
  ) | (
    cd "$target_dir"
    tar -xf -
  )
  cd "$target_dir"
else
  fail_if_not_template_root "$(pwd)"
fi

required_files=(
  README.md
  CONTEXT.md
  AGENTS.md
  .gitignore
  TEMPLATE.md
  INITIALIZE.md
  docs/index.md
  docs/evolution/index.md
  docs/evolution/evolution-entry-template.md
  docs/standards/index.md
  docs/standards/mainline-continuity.md
  docs/patterns/index.md
  docs/patterns/standard-capture-loop.md
  docs/workflows/index.md
  docs/tools/index.md
  docs/principles/index.md
  agents/index.md
  agents/roles/index.md
  agents/roles/default-agent-roles.md
  agents/handoffs/index.md
  agents/handoffs/subagent-task-handoff.md
  agents/playbooks/index.md
  agents/playbooks/subagent-delegation.md
  harness/index.md
  harness/agent-learning-loop.md
  harness/agent-orchestration-loop.md
  harness/agent-delivery-contract.md
  harness/runs/index.md
  harness/runs/run-record-schema.md
  harness/runs/run-record-template.md
  evals/index.md
  evals/rubrics/index.md
  evals/rubrics/harness-validation-rubric.md
  evals/checklists/index.md
  experiments/index.md
  experiments/reports/index.md
  experiments/reports/experiment-report-template.md
  experiments/task-samples/index.md
  decisions/index.md
  decisions/0001-adopt-agent-first-living-lab.md
  decisions/decision-record-template.md
  packs/frontend-react-ts/package.json
  packs/frontend-react-ts/index.html
  packs/frontend-react-ts/src/App.tsx
  packs/frontend-react-ts/src/App.test.tsx
  packs/frontend-react-ts/src/main.tsx
  packs/frontend-react-ts/src/index.css
  packs/frontend-react-ts/src/vite-env.d.ts
  packs/frontend-react-ts/src/test/setup.ts
  packs/frontend-react-ts/vite.config.ts
  packs/frontend-react-ts/tsconfig.json
  packs/frontend-react-ts/tsconfig.app.json
  packs/frontend-react-ts/tsconfig.node.json
  packs/frontend-react-ts/eslint.config.js
  init-template.sh
  validate-init-template.sh
)

missing_files=()
for path in "${required_files[@]}"; do
  [[ -e "$path" ]] || missing_files+=("$path")
done

if [[ ${#missing_files[@]} -gt 0 ]]; then
  echo "Template is missing required files:" >&2
  printf '  %s\n' "${missing_files[@]}" >&2
  exit 1
fi

escape_sed() {
  printf '%s' "$1" | sed -e 's/[\/&]/\\&/g'
}

replace_in_file() {
  local file="$1"
  local token="$2"
  local value="$3"
  sed -i.bak "s/{{$token}}/$(escape_sed "$value")/g" "$file"
  rm -f "$file.bak"
}

package_slug() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'
}

if [[ "$app_pack" == "frontend-react-ts" ]]; then
  (
    cd "packs/frontend-react-ts"
    tar -cf - .
  ) | tar -xf -
fi

rm -rf packs

core_files=(
  README.md
  CONTEXT.md
  TEMPLATE.md
  decisions/0001-adopt-agent-first-living-lab.md
)

if [[ -f package.json ]]; then
  core_files+=(package.json index.html src/App.tsx src/App.test.tsx)
fi

package_name="$(package_slug "$project_name")"

for file in "${core_files[@]}"; do
  replace_in_file "$file" PROJECT_NAME "$project_name"
  replace_in_file "$file" PROJECT_INTENT "$project_intent"
  replace_in_file "$file" CURRENT_PHASE "$current_phase"
  replace_in_file "$file" DATE "$date_value"
  replace_in_file "$file" WORKING_ASSUMPTION_1 "$working_assumption"
  replace_in_file "$file" NON_GOAL_1 "$non_goal"
  replace_in_file "$file" ALTERNATIVE "$alternative"
  replace_in_file "$file" PACKAGE_NAME "$package_name"
done

if grep -R "{{[A-Z0-9_][A-Z0-9_]*}}" README.md CONTEXT.md decisions/0001-adopt-agent-first-living-lab.md >/dev/null; then
  echo "Core placeholders remain after initialization:" >&2
  grep -R "{{[A-Z0-9_][A-Z0-9_]*}}" README.md CONTEXT.md decisions/0001-adopt-agent-first-living-lab.md >&2
  exit 1
fi

cat <<EOF
Initialized Agent-First Living Lab template.

Project: $project_name
Phase: $current_phase
App pack: $app_pack

Next checks:
  find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
  git status --short
EOF
