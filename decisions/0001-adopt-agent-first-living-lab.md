# 0001 Adopt Agent-First Living Lab

Date: 2026-05-30
Status: Accepted

## Context

The project exists to explore harness + vibe coding best practices. The first
phase needs to produce agent-readable guidance while leaving room to validate
that guidance through real project work.

## Decision

Adopt an Agent-First Living Lab repository structure.

The repository will start with root context documents, methodology docs, agent
resources, harness notes, experiment records, evaluation criteria, a `lab/`
validation project, concise decision records, and narrative evolution logs.

## Alternatives Considered

- Docs-First Methodology: fast to write, but too detached from real validation.
- Product-First Monorepo: useful for future engineering, but premature before
  methodology and evaluation boundaries are clear.

## Consequences

- Agents get a clear cognitive path into the repository.
- The project can produce shareable methodology before heavy app code exists.
- The `lab/` project can later test whether the methodology actually works.
- Some directories begin as thin documentation entrances rather than code.
