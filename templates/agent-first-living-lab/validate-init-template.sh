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
    --non-goal "Do not overwrite existing user files during merge initialization." \
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
merge_target="$tmp_root/merge-project"
file_conflict_target="$tmp_root/file-conflict-project"
agents_conflict_target="$tmp_root/agents-conflict-project"
symlink_conflict_target="$tmp_root/symlink-conflict-project"
pack_conflict_target="$tmp_root/pack-conflict-project"
packs_path_conflict_target="$tmp_root/packs-path-conflict-project"
missing_parent_target="$tmp_root/missing/child"
template_nested="$script_dir/nested-target"

mkdir -p "$empty_target" "$conflict_target"
printf '%s\n' "existing" > "$conflict_target/README.md"

run_init --target-dir "$new_target"
assert_file_exists "$new_target/AGENTS.md"
if [[ -e "$new_target/lab" ]]; then
  echo "Default product-project template must not create lab/: $new_target/lab" >&2
  exit 1
fi
if [[ -e "$new_target/src" || -e "$new_target/package.json" ]]; then
  echo "Default product-project template must not create source scaffold without an app pack." >&2
  exit 1
fi
assert_file_not_contains "$new_target/README.md" "{{PROJECT_NAME}}"
assert_file_not_contains "$new_target/CONTEXT.md" "{{PROJECT_INTENT}}"
assert_file_not_contains "$new_target/decisions/0001-adopt-agent-first-living-lab.md" "{{CURRENT_PHASE}}"

react_target="$tmp_root/react-project"
run_init --target-dir "$react_target" --app-pack frontend-react-ts
assert_file_exists "$react_target/package.json"
assert_file_exists "$react_target/src/App.tsx"
assert_file_exists "$react_target/src/App.test.tsx"
assert_file_contains "$react_target/package.json" '"name": "conflict-safe-lab"'
assert_file_not_contains "$react_target/package.json" "{{PACKAGE_NAME}}"
if [[ -e "$react_target/lab" || -e "$react_target/packs" ]]; then
  echo "Initialized React project should not keep lab/ or template packs/." >&2
  exit 1
fi

run_init --target-dir "$empty_target"
assert_file_exists "$empty_target/AGENTS.md"

mkdir -p "$merge_target/docs"
printf '%s\n' "keep me" > "$merge_target/docs/local-note.md"
run_init --target-dir "$merge_target"
assert_file_exists "$merge_target/AGENTS.md"
assert_file_exists "$merge_target/docs/local-note.md"
assert_file_contains "$merge_target/docs/local-note.md" "keep me"

mkdir -p "$file_conflict_target/docs"
printf '%s\n' "local docs index" > "$file_conflict_target/docs/index.md"
if run_init --target-dir "$file_conflict_target" 2>"$tmp_root/file-conflict.err"; then
  echo "Expected existing file conflict to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/file-conflict.err" "Target file already exists"
assert_file_contains "$file_conflict_target/docs/index.md" "local docs index"

mkdir -p "$agents_conflict_target"
printf '%s\n' "local agent contract" > "$agents_conflict_target/AGENTS.md"
if run_init --target-dir "$agents_conflict_target" 2>"$tmp_root/agents-conflict.err"; then
  echo "Expected AGENTS.md conflict to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/agents-conflict.err" "Target file already exists"
assert_file_contains "$agents_conflict_target/AGENTS.md" "local agent contract"

mkdir -p "$symlink_conflict_target"
ln -s "$tmp_root/missing-readme-target" "$symlink_conflict_target/README.md"
if run_init --target-dir "$symlink_conflict_target" 2>"$tmp_root/symlink-conflict.err"; then
  echo "Expected symlink path conflict to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/symlink-conflict.err" "Target file already exists"
if [[ ! -L "$symlink_conflict_target/README.md" ]]; then
  echo "Expected symlink conflict path to remain a symlink" >&2
  exit 1
fi

mkdir -p "$pack_conflict_target/src"
printf '%s\n' "local app" > "$pack_conflict_target/src/App.tsx"
if run_init --target-dir "$pack_conflict_target" --app-pack frontend-react-ts 2>"$tmp_root/pack-conflict.err"; then
  echo "Expected app pack file conflict to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/pack-conflict.err" "Target file already exists"
assert_file_contains "$pack_conflict_target/src/App.tsx" "local app"

mkdir -p "$packs_path_conflict_target/packs"
printf '%s\n' "local pack note" > "$packs_path_conflict_target/packs/local-note.md"
if run_init --target-dir "$packs_path_conflict_target" 2>"$tmp_root/packs-path-conflict.err"; then
  echo "Expected existing packs path to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/packs-path-conflict.err" "would be removed after initialization"
assert_file_contains "$packs_path_conflict_target/packs/local-note.md" "local pack note"

if run_init --target-dir "$conflict_target" 2>"$tmp_root/conflict.err"; then
  echo "Expected root file conflict to fail" >&2
  exit 1
fi
assert_file_contains "$tmp_root/conflict.err" "Target file already exists"
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
