# Agent-First Living Lab Template

This directory is a template-safe skeleton for starting a real product project
with Agent-First Living Lab harness surfaces.

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
- harness learning loop, orchestration loop, capability discovery, delivery
  contract, and run-record templates
- eval rubric and checklist entrypoints
- experiment and decision entrypoints

## Excluded From Core

- application code
- `lab/` research containers
- Dinner Picker history
- mobile-specific checks
- runtime-specific state such as `.omx`
- public skills
- generated reports from this study project

## Optional App Packs

The default initialization stays source-free. Use an app pack only when the new
project should start with a concrete source scaffold.

Supported pack:

- `frontend-react-ts`: root-level React + TypeScript + Vite starter with
  `package.json`, `src/`, tests, lint config, and TypeScript config.

Research or methodology repositories that need multiple validation samples can
add a `lab/` directory later as a project-specific decision. It is not part of
the product-project default.

## First Initialization Check

Prefer initializing into a new target directory with:

```sh
bash init-template.sh --target-dir "../my-product-project" ...
```

To include the React + TypeScript source scaffold:

```sh
bash init-template.sh --target-dir "../my-product-project" --app-pack frontend-react-ts ...
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
