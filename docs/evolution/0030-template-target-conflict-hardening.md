# Template Target Conflict Hardening

## Stage

Post-Phase 3C follow-up - Template reuse hardening.

## Goal

Address the risk that template initialization could collide with an existing
user directory.

The review found that `init-template.sh` initialized the current directory but
did not provide a safe way to create a target project directory. If a user copied
the template into an existing project before running the script, the helper could
not detect that the damage had already happened.

## Methodology

We treated this as a template safety issue:

```text
review initialization path -> identify overwrite risk ->
add fail-closed target handling -> validate conflict cases -> record result
```

## Outcome

`templates/agent-first-living-lab/init-template.sh` now supports
`--target-dir`.

The helper:

- creates and initializes a nonexistent target directory
- initializes an existing empty target directory
- rejects existing non-empty target directories before writing
- rejects target directories inside the source template
- rejects execution from a directory that does not look like the template root

The initialization docs now instruct users to prefer the safe target-directory
path instead of manually copying into an ambiguous destination.

## Artifacts

- `templates/agent-first-living-lab/init-template.sh`
- `templates/agent-first-living-lab/INITIALIZE.md`
- `templates/agent-first-living-lab/TEMPLATE.md`
- `docs/workflows/template-initialization-hardening.md`
- `docs/workflows/template-initialization-validation.md`

## Shareable Takeaway

Reusable templates should fail closed around user directories.

The safe default is:

```text
nonexistent target -> create
empty target -> initialize
non-empty target -> stop before writing
```

Do not make a project template silently merge into a user's existing project.

## Open Questions

- Should the next hardening step add a `--dry-run` mode?
- Should a future generator support explicit backup or merge behavior, or keep
  the skeleton permanently fail-closed?
