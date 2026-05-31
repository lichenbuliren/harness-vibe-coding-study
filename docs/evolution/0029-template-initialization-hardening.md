# Template Initialization Hardening

## Stage

Post-Phase 3C follow-up - Template reuse hardening.

## Goal

Make `templates/agent-first-living-lab/` easier to initialize repeatably without
overbuilding a generator or expanding the template core.

## Methodology

We kept the scope narrow:

```text
initialization guide -> thin helper script -> fresh git validation ->
record result
```

A specialist reviewer challenged the priority and recommended a
documentation-first guide plus validation checklist. The main agent integrated
that guidance and kept the script as a thin helper rather than a full generator.

## Outcome

The template now includes:

- `INITIALIZE.md`
- `init-template.sh`

The helper replaces core project placeholders, checks required files, and leaves
blank record templates untouched.

A fresh git repository validation passed.

## Artifacts

- `templates/agent-first-living-lab/INITIALIZE.md`
- `templates/agent-first-living-lab/init-template.sh`
- `docs/workflows/template-initialization-hardening.md`
- `docs/workflows/template-initialization-validation.md`
- `docs/evolution/0029-template-initialization-hardening.md`

## Shareable Takeaway

Template reuse should be hardened before optional packs or public skills.

The first useful improvement is not a complex generator. It is a repeatable
initialization path that prevents false history, missed placeholders, and
accidental app/runtime defaults.

## Open Questions

- Should the next validation be performed by a fresh agent in a new repository?
- Should optional packs be documented first or implemented as separate template
  directories?
- Should the helper eventually become a real generator?
