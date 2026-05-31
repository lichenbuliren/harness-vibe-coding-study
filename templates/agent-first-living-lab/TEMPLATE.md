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

After copying this skeleton into a new project:

1. Replace core placeholders with `bash init-template.sh ...`.
2. Remove unused optional guidance.
3. Create the first project-specific decision record.
4. Create the first evolution entry only after a real stage outcome.
5. Run a structure check and commit.
