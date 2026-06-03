# Session Lifecycle, Tools & Context, and Multi-Agent Systems

## Stage

Post-Phase 3C follow-up — completing the planned foundations.md documentation
set.

## Goal

Close the three remaining planned-but-not-created harness docs from
`harness/foundations.md` "Immediate Documentation Shape":

1. `harness/session-lifecycle.md` — bootstrap, progress, handoff, and recovery
2. `harness/tools-and-context.md` — progressive disclosure, tool policy,
   MCP/CLI boundaries, and context hygiene
3. `harness/multi-agent.md` — sub-agent use cases, shared-state rules,
   conflict handling, and governance

This completes the 5-doc set planned in foundations.md.

## Method

Each document was designed to fill a specific gap without duplicating existing
content:

- **session-lifecycle.md** covers the state model (orienting → scoping →
  exploring → implementing → verifying → closing), checkpoint requirements,
  handoff contents, and recovery without handoff. The existing
  `agent-delivery-contract.md` covers minimum delivery expectations, but not
  the full lifecycle state machine.

- **tools-and-context.md** covers context hierarchy (4 disclosure layers),
  tool categories and selection rules, MCP boundary definitions, context
  hygiene, and output backpressure. The existing `context-memory.md` covers
  durable memory vs working state, but not tool policy or disclosure
  mechanics.

- **multi-agent.md** covers the decision framework (when to use multiple
  agents), shared state rules, conflict handling, agent roles (lead, subagent,
  verifier, reviewer), multi-agent topologies, lifecycle and governance rules.
  The existing `agent-orchestration-loop.md` covers the process flow, but not
  the system design that supports it.

## Comparison With The Previous Set

The first three new docs (primitives, verification, maturity-assessment) were
not part of the original foundations.md plan — only primitives and verification
were listed. The maturity assessment was an unplanned addition driven by the
practical need to assess real projects.

The three docs here complete the original foundations.md plan exactly. All five
planned docs from that section now exist:

| Planned Doc | Status | Created In |
|-------------|--------|------------|
| primitives.md | Complete | 0039 |
| session-lifecycle.md | Complete | 0040 |
| verification.md | Complete | 0039 |
| tools-and-context.md | Complete | 0040 |
| multi-agent.md | Complete | 0040 |

With this, the study repo's harness module set covers:

- Foundation model, primitives, context/memory, guardrails, specs/workflows
- Delivery loop, learning loop, orchestration loop
- Session lifecycle, verification, tools & context, multi-agent systems
- Capability discovery, evals & observability, benchmarks, runtimes
- Adapters and run records

## Artifacts

- `harness/session-lifecycle.md`
- `harness/tools-and-context.md`
- `harness/multi-agent.md`
- Updated `harness/index.md`
- Updated `templates/agent-first-living-lab/harness/` (3 new files + index)
- Updated `CONTEXT.md`

## Remaining Harness Gaps

Even after these 4 new docs, the planned surface from foundations.md is
complete. A few optional gaps remain:

- **`harness/adapters/` is still empty** — adapter examples for different
  agent runtimes (Codex CLI vs desktop, Cursor) would make the harness more
  portable, but are not urgent.
- **`docs/patterns/success-patterns.md`** — the project has a strong
  correction-capture loop but no "this went well, capture why" pattern.
- **`harness/adoption-playbook.md`** — still no "how to start harness
  engineering in a real team" guide.

## Shareable Takeaway

The foundations.md plan was written early in the project and correctly
anticipated the documentation surface needed. Scheduled deferrals during Phase
3C did not make the plan obsolete — the plan remained accurate and the docs
remained fillable without redesign.

This is a useful pattern for harness projects: write the documentation plan
early, defer execution when higher-priority work appears, and trust the plan
to survive the deferral.
