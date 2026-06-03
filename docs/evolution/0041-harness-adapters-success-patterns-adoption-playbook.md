# Harness Adapters, Success Patterns, and Adoption Playbook

## Stage

Post-Phase 3C follow-up — filling the remaining optional harness gaps.

## Goal

Close three gaps that were outside the original foundations.md plan but became
visible during the earlier documentation review:

1. **`harness/adapters/` was empty**: the adapter directory existed only as a
   placeholder index.md. No concrete adaptation examples existed for any agent
   runtime, making the methodology feel abstract and hard to port.

2. **No success pattern capture**: the project had a mature correction-capture
   loop (`standard-capture-loop.md` + `agent-learning-loop.md`) but no
   mechanism for capturing what went well. The project could prevent failures
   but could not systematically reproduce successes.

3. **No adoption playbook**: the repository had a comprehensive methodology but
   no "how to start" guide. First-time adopters had to reverse-engineer the
   starting point from the full docs.

## Method

### Adapters

Two adapters were created to cover the most common agent runtime categories:

- **Codex Desktop**: the runtime used for this project's own development. Maps
  bootstrap sequence, tool surface, state management, verification surface, and
  evidence capture to Codex Desktop's specific tool set and boundaries.

- **MCP Runtime**: a generic adapter for any MCP-compatible runtime (Codex
  CLI, Claude Code, Cursor). Covers shared MCP patterns, runtime-specific
  caveats, and migration between runtimes.

Each adapter follows the same structure: system overview, context model, tool
surface, state management, verification surface, evidence capture, and key
limitations.

### Success Patterns

The success-patterns.md doc was designed as a precise complement to the
standard capture loop:

| Capture Loop | Trigger | Output |
|-------------|---------|--------|
| Standard capture | Correction, failure, friction | Project standard |
| Success capture | Unexpectedly good outcome | Reusable pattern |

Both loops share the same structure: observe → identify → assess → capture →
wire → verify → record.

### Adoption Playbook

The playbook defines four adoption stages (Pre-Harness, Growing, Established,
Verified) that map to the 7-layer maturity assessment framework. Each stage
includes:

- Concrete "what to do" steps.
- Success criteria.
- Typical resistance and counter-arguments.
- Time investment estimates.
- Stage-skipping risks.

## Artifacts

- `harness/adapters/codex-desktop.md`
- `harness/adapters/mcp-runtime.md`
- Updated `harness/adapters/index.md`
- `docs/patterns/success-patterns.md`
- Updated `docs/patterns/index.md`
- `harness/adoption-playbook.md`
- Updated `harness/index.md`
- Updated `templates/agent-first-living-lab/` (adapters/, success-patterns.md,
  adoption-playbook.md, indexes)
- Updated `CONTEXT.md`

## Completion Status

As of this evolution entry, the repository's harness documentation surface is
complete for Phase 3C purposes:

- **13 harness module docs** (foundations, primitives, session-lifecycle,
  verification, tools-and-context, multi-agent, context-memory, guardrails,
  specs-workflows, delivery contract, learning loop, orchestration loop,
  capability discovery)
- **3 cross-cutting docs** (evals-observability, benchmarks, runtimes)
- **1 adoption playbook**
- **4 patterns** (standard capture loop, success patterns, + index + main)
- **2 adapters** (Codex Desktop, MCP Runtime)
- **3 supporting directories** (runs/ with schema + 5 records, adapters/,
  practices/)
- **3 index surfaces** (harness/index, docs/patterns/index, adapters/index)
- **41 evolution entries** documenting the project's full trajectory

The next effort boundary is no longer "fill the gaps" but "apply the
methodology to real projects" — which is where the spp-user-plugin pilot
becomes the natural next step.

## Open Questions

- Should the adapters eventually include Codex CLI, Cursor, and Claude Code
  as separate files, or is the generic MCP adapter sufficient?
- Should the adoption playbook eventually include a concrete "Month 1
  sprint plan" template?
- Should the success pattern be integrated into the agent-learning-loop as
  an optional second path, or kept as a separate pattern?

## Shareable Takeaway

The three gaps closed here were not documentation design errors. They were
natural gaps that become visible only after the core methodology is stable:

- Adapters become important when someone tries to port the methodology to a
  different runtime.
- Success patterns become important when the correction loop starts working
  and the project realizes it has no way to amplify successes.
- Adoption playbooks become important when someone outside the project wants
  to use the methodology.

Creating them in this order is correct: methodology first, portability second,
positive amplification third, adoption fourth.
