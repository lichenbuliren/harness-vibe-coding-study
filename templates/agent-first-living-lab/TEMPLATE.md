# Agent-First Living Lab Template

This directory is a template-safe skeleton for starting a new Agent-First Living
Lab project.

## Customize First

Use `INITIALIZE.md` or run `init-template.sh` to replace core placeholders such
as:

- `{{PROJECT_NAME}}`
- `{{PROJECT_INTENT}}`
- `{{CURRENT_PHASE}}`
- `{{DATE}}`

## Core Includes

- root project context and agent contract
- docs, standards, patterns, workflows, and evolution indexes
- default agent roles, handoffs, and subagent delegation playbook
- harness delivery contract and run-record templates
- eval rubric and checklist entrypoints
- experiment, lab, and decision entrypoints

## Excluded From Core

- application code
- Dinner Picker history
- mobile-specific checks
- runtime-specific state such as `.omx`
- public skills
- generated reports from this study project

## First Initialization Check

Prefer initializing into a new target directory with:

```sh
bash init-template.sh --target-dir "../my-agent-lab" ...
```

The helper rejects non-empty target directories instead of merging or
overwriting existing user files.

Before changing `init-template.sh`, run:

```sh
bash validate-init-template.sh
```

After the skeleton is initialized:

1. Inspect the initialized `README.md`, `CONTEXT.md`, and initial ADR.
2. Remove unused optional guidance.
3. Create the first project-specific decision record.
4. Create the first evolution entry only after a real stage outcome.
5. Run a structure check and commit.
