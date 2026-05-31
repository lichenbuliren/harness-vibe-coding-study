# Template Skeleton Throwaway Validation

This report records a throwaway initialization test for
`templates/agent-first-living-lab/`.

## Goal

Verify that the template skeleton can be copied into a clean temporary project,
that required files exist, and that blank record templates can produce
project-specific first records.

## Method

1. Created a temporary directory under `/tmp`.
2. Copied `templates/agent-first-living-lab/` into the temporary directory.
3. Checked every required skeleton file.
4. Scanned for obvious project-specific leaks.
5. Created first records from blank templates:
   - `harness/runs/0001-initialization.md`
   - `docs/evolution/0001-initialization.md`
   - `decisions/0002-choose-first-lab.md`
6. Checked that the generated records had no remaining placeholders.

## Result

Pass with notes.

Required files were present in the copied temporary project.

Blank templates were usable for:

- first run record
- first evolution entry
- first decision record

The leak scan did not find local paths, current project phase text, React/Vite
stack references, or historical dates in the template core. It found one
intentional mention of Dinner Picker in `TEMPLATE.md`, where the file explains
that Dinner Picker history is excluded from the core.

## Evidence

Temporary path used:

```text
/tmp/agent-first-lab.SSFtU4
```

Required-file check result:

```text
all required files present
```

Generated record files:

```text
/tmp/agent-first-lab.SSFtU4/harness/runs/0001-initialization.md
/tmp/agent-first-lab.SSFtU4/docs/evolution/0001-initialization.md
/tmp/agent-first-lab.SSFtU4/decisions/0002-choose-first-lab.md
```

Placeholder check result for generated records:

```text
no remaining {{PLACEHOLDER}} tokens
```

## Remaining Risks

- This was a file-level initialization test, not a full independent agent run.
- Placeholder replacement is still manual.
- No generator script exists yet.
- Optional packs are documented but not packaged.
- The template has not yet been tested in a fresh git repository with a real
  first lab task.

## Decision

The template skeleton is ready as a checked-in reusable skeleton.

It is not yet a released template package or generator.

Recommended next work:

```text
optional packs or generator design -> independent fresh-repo validation ->
skill candidate evals
```
