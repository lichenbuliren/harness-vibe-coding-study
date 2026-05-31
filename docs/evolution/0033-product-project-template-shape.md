# Product Project Template Shape

## Stage

Post-Phase 3C follow-up - Template semantics correction.

## Goal

Correct the reusable template after an independent Small Airplane Lab
initialization exposed an ambiguity: a real product project should not default
to a `lab/` container for its own source code.

## What Happened

The previous template treated `lab/` as required because this source repository
is a methodology study that needs separate validation samples such as
`lab/dinner-picker`.

That design did not transfer cleanly to a new real product project. In a
product repository, the project itself is the real work. Adding `lab/` by
default makes future agents wonder whether source code belongs at the root or
inside `lab/<project-name>/`.

## Decision

The reusable template now defaults to:

```text
real product project + harness initialization
```

The default core does not create:

- `lab/`
- `src/`
- `package.json`

Product source scaffolds are explicit app packs. The first supported pack is:

```text
--app-pack frontend-react-ts
```

That pack creates root-level React + TypeScript + Vite files. It does not leave
the template-only `packs/` directory in the initialized project.

`lab/` is now a research-lab pattern, not a default product-project directory.
Methodology repositories and multi-sample validation projects may still add it
as a project-specific decision.

## Artifacts

- `templates/agent-first-living-lab/init-template.sh`
- `templates/agent-first-living-lab/validate-init-template.sh`
- `templates/agent-first-living-lab/packs/frontend-react-ts/`
- `templates/agent-first-living-lab/AGENTS.md`
- `templates/agent-first-living-lab/CONTEXT.md`
- `templates/agent-first-living-lab/README.md`
- `templates/agent-first-living-lab/TEMPLATE.md`
- `templates/agent-first-living-lab/INITIALIZE.md`
- `docs/workflows/minimum-project-template-skeleton.md`
- `docs/workflows/template-initialization-validation.md`

## Evidence

The validation script now checks both paths:

- default initialization rejects accidental `lab/`, `src/`, and `package.json`
- `frontend-react-ts` initialization creates root-level product source files
  and removes template-only pack files

The initial failing validation caught the stale default `lab/` behavior before
the implementation changed the template.

## Shareable Takeaway

A harness template for real products should not hide the product inside a lab
directory.

Use `lab/` when the repository is studying methods or comparing multiple
validation samples. Use explicit source packs when the repository is itself the
product.

## Open Questions

- Which source pack should come next: Next.js, Node CLI TypeScript, or Python
  service?
- Should app packs eventually live outside the core template directory as
  independently versioned packages?
- Should initialized projects record the selected app pack in their first
  decision record automatically?
