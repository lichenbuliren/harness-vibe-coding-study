# Agent-First Living Lab Template Skeleton

## Stage

Phase 3C - Pattern Extraction.

## Goal

Create template-safe source files for the minimum Agent-First Living Lab
skeleton.

## Methodology

We followed the dry-run review:

```text
template-safe source files -> file-existence check ->
portability review -> throwaway initialization later
```

The skeleton was created under `templates/agent-first-living-lab/` instead of
copying the whole repository. It includes the operating and evidence spine while
excluding Dinner Picker history, local runtime state, mobile-specific checks,
and public skills.

## Outcome

The first template-safe skeleton now exists.

It includes:

- root context and agent contract files
- documentation indexes
- mainline continuity and standard capture starter docs
- default agent roles and subagent handoff/playbook
- harness delivery and run-record templates
- eval, experiment, lab, and decision entrypoints

## Artifacts

- `templates/index.md`
- `templates/agent-first-living-lab/`
- `templates/agent-first-living-lab/TEMPLATE.md`
- `AGENTS.md`
- `docs/index.md`
- `docs/evolution/0026-agent-first-living-lab-template-skeleton.md`

## Shareable Takeaway

The reusable template should preserve the project operating system, not the
project history.

The template core is intentionally blank where a new project must earn its own
evidence.

## Open Questions

- Should the next task initialize a throwaway project from the template?
- Which optional pack should be designed first?
- Should template validation become an executable script?
