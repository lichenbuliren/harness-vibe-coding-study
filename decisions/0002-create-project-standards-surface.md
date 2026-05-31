# 0002 Create Project Standards Surface

Date: 2026-05-31
Status: Accepted

## Context

The project originally treated many reusable lessons as harness methodology or
evolution records. During lab validation, user corrections revealed rules that
were broader than harness delivery: directory standards, documentation placement
standards, evaluation standards, and agent operating standards.

Without a dedicated standards surface, future agents could overuse `harness/`,
overload `AGENTS.md`, or leave reusable rules only in narrative evolution logs.

## Decision

Create `docs/standards/` as the canonical surface for cross-cutting project
standards.

Keep narrower rules in their owning surfaces:

- `AGENTS.md` for runtime rules every agent must follow
- `harness/` for harness methodology and delivery contracts
- `evals/` for rubrics, checklists, and quality gates
- `docs/evolution/` for narrative learning
- `decisions/` for trade-off decisions that should not be relitigated

## Alternatives Considered

- Put all standards under `harness/`: rejected because some standards are about
  directories, docs, evals, or agent operation rather than harness methodology.
- Put all standards in `AGENTS.md`: rejected because root instructions should
  stay compact and should point to focused authoritative docs.
- Use only `docs/principles/` and `docs/patterns/`: rejected because principles
  are beliefs and patterns are reusable solutions, while standards are stronger
  rules future agents should follow.

## Consequences

- Future agents have a clear place to look for cross-cutting project standards.
- Harness docs can stay focused on harness methodology.
- `AGENTS.md` can enforce standard-capture behavior without becoming a dumping
  ground for every rule.
- Standards still need indexing discipline so they do not become invisible.
