#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
init_script="$script_dir/init-template.sh"

if [[ ! -f "$init_script" ]]; then
  echo "Missing init script: $init_script" >&2
  exit 1
fi

tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/agent-first-template-test.XXXXXX")"
trap 'rm -rf "$tmp_root"' EXIT

run_init() {
  bash "$init_script" \
    "$@" \
    --project-name "Conflict Safe Lab" \
    --project-intent "Validate template initialization safety." \
    --current-phase "Initialization" \
    --date "2026-05-31" \
    --working-assumption "Safe initialization should fail before overwriting user files." \
    --non-goal "Do not merge into an existing project automatically." \
    --alternative "Copy the template into an existing directory."
}

assert_file_exists() {
  local path="$1"
  if [[ ! -f "$path" ]]; then
    echo "Expected file to exist: $path" >&2
    exit 1
  fi
}

assert_file_contains() {
  local path="$1"
  local text="$2"
  if ! grep -F "$text" "$path" >/dev/null; then
    echo "Expected $path to contain: $text" >&2
    exit 1
  fi
}

assert_file_not_contains() {
  local path="$1"
  local text="$2"
  if grep -F "$text" "$path" >/dev/null; then
    echo "Did not expect $path to contain: $text" >&2
    exit 1
  fi
}

new_target="$tmp_root/new-project"
empty_target="$tmp_root/empty-project"
conflict_target="$tmp_root/existing-project"
missing_parent_target="$tmp_root/missing/child"
template_nested="$script_dir/nested-target"

mkdir -p "$empty_target" "$conflict_target"
printf '%s\n' "existing" > "$conflict_target/README.md"

run_init --target-dir "$new_target"
assert_file_exists "$new_target/AGENTS.md"
assert_file_not_contains "$new_target/README.md" "{{PROJECT_NAME}}"
assert_file_not_contains "$new_target/CONTEXT.md" "{{PROJECT_INTENT}}"
assert_file_not_contains "$new_target/decisions/0001-adopt-agent-first-living-lab.md" "{{CURRENT_PHASE}}"

run_init --target-dir "$empty_target"
assert_file_exists "$empty_target/AGENTS.md"

if run_init --target-dir "$conflict_target" 2>"$tmp_root/conflict.err"; then
  echo "Expected non-empty target to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/conflict.err" "Target directory already exists and is not empty"
assert_file_contains "$conflict_target/README.md" "existing"

rm -rf "$template_nested"
if run_init --target-dir "$template_nested" 2>"$tmp_root/nested.err"; then
  echo "Expected nested target to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/nested.err" "Target directory must not be inside the source template"
if [[ -e "$template_nested" ]]; then
  echo "Nested target should not be created: $template_nested" >&2
  exit 1
fi

if run_init --target-dir "$missing_parent_target" 2>"$tmp_root/missing-parent.err"; then
  echo "Expected missing parent target to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/missing-parent.err" "Target parent directory does not exist"

(
  cd "$tmp_root"
  if bash "$init_script" \
    --project-name "Wrong Root" \
    --project-intent "Should fail." \
    --current-phase "Initialization" \
    --date "2026-05-31" \
    --working-assumption "Should fail." \
    --non-goal "Should fail." \
    --alternative "Should fail." 2>wrong-root.err; then
    echo "Expected wrong root to fail" >&2
    exit 1
  fi
  grep -F "Not an Agent-First Living Lab template root" wrong-root.err >/dev/null
)

echo "Template initialization validation passed."
