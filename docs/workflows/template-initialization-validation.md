# Template Initialization Validation

This report validates the template initialization hardening step.

## Goal

Verify that `templates/agent-first-living-lab/init-template.sh` can initialize
the skeleton inside a fresh git repository without turning it into a full
generator.

## Method

1. Copied `templates/agent-first-living-lab/` into a temporary directory.
2. Ran `git init` in the temporary directory.
3. Ran `bash init-template.sh` with project-specific values.
4. Checked that core placeholders were removed.
5. Checked for obvious project-specific leaks.
6. Confirmed blank record templates still contain placeholders.
7. Confirmed forbidden app/framework/runtime directories were not created.

## Evidence

Temporary path:

```text
/tmp/agent-first-fresh.IdNZqc
```

Initialization command:

```sh
bash init-template.sh \
  --project-name "Fresh Harness Lab" \
  --project-intent "Validate repeatable initialization for an agent-first project." \
  --current-phase "Initialization" \
  --date "2026-06-01" \
  --working-assumption "Agents need durable context before implementation." \
  --non-goal "Do not add app code before the first lab plan." \
  --alternative "Start with product code first."
```

Observed results:

- core placeholder scan: no hits in `README.md`, `CONTEXT.md`, or the initial
  ADR
- leak scan: only the intentional `TEMPLATE.md` exclusion note for Dinner Picker
  history
- forbidden default directories: none created
- blank record templates: placeholders remained for future records
- git status: skeleton files appeared as untracked files in the fresh repo

## Result

Pass.

The initialization helper is sufficient for the current phase. It should remain
a thin helper, not a published generator.

## Remaining Risks

- The helper uses shell and `sed`, so cross-platform behavior on non-Unix
  environments is untested.
- No independent fresh-agent run has used the initialized repo for a real lab
  task yet.
- Optional packs are still documented choices, not packaged modules.
