# Template Script Validation Gap

## Stage

Post-Phase 3C follow-up - Template reuse hardening.

## Goal

Record and correct the process gap exposed when the template initialization
script's conflict behavior was only reviewed after user concern.

## What Happened

The original template initialization helper was validated on a happy-path fresh
repository flow. It was not protected by an executable regression check covering
negative paths such as:

- non-empty target directory
- target directory inside the source template
- missing target parent directory
- wrong working directory

That meant the user had to raise a failure mode that should have been caught
before treating the template as hardened.

## Decision

Template and initialization scripts require executable validation before they are
considered complete.

The validation must cover:

- at least one successful initialization path
- known negative paths
- no accidental mutation of existing user files
- no creation of rejected target directories

## Artifacts

- `templates/agent-first-living-lab/validate-init-template.sh`
- `templates/agent-first-living-lab/init-template.sh`
- `templates/agent-first-living-lab/INITIALIZE.md`
- `templates/agent-first-living-lab/TEMPLATE.md`
- `docs/workflows/template-initialization-hardening.md`
- `docs/workflows/template-initialization-validation.md`
- `harness/agent-delivery-contract.md`

## Shareable Takeaway

A reusable template script is not validated by documentation alone.

The minimum bar is:

```text
happy path + negative paths + no user-file mutation
```

If users are the first people to discover script safety behavior, the harness
did not close the loop.

## Open Questions

- Should template validation become part of a repo-level pre-commit or CI gate?
- Should every future template helper ship with a sibling `validate-*` script?
