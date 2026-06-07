# Harness Primitives

This note defines the reusable building blocks this project uses to compose
harness behavior. It answers: what primitives exist, when to use each, and how
to combine them.

A harness primitive is the smallest independently useful piece of harness
behavior. It has a clear trigger, a defined action, and a known output.

Primitives are composable. A workflow, evals, or delivery loop typically
combines several primitives.

## Taxonomy By Layer

Primitives are organized by the
[Control + Agency + Runtime + Substrate](./foundations.md) model.

### Control Primitives

These primitives define what should happen and how correctness is checked.

| Primitive | What It Does | When To Use |
|-----------|-------------|-------------|
| **Root Instruction** | `AGENTS.md` or `CLAUDE.md` — project map and operating contract | On every new session. Keep short; link deeper docs. |
| **Project Context** | `CONTEXT.md` — durable project state, phase, non-goals | On every new session or after a phase transition. |
| **Task Spec** | Bounded description of what needs to be done and why | Before starting any non-trivial task. Separates intent from execution. |
| **Implementation Plan** | Multi-step plan with verification criteria | Before multi-step or high-risk work. Should be recoverable without chat history. |
| **Decision Record** | ADR-style record of a settled tradeoff | Only when the tradeoff is hard to reverse, surprising without context, or had real alternatives. |
| **Boundary Rule** | Explicit statement of what is in-scope and out-of-scope for a context | After discovery reveals a boundary that future agents should not relitigate. |
| **Evidential Checklist** | Observable criteria for quality judgment | When a subjective task needs structured evaluation. Links to a rubric. |

### Agency Primitives

These primitives define how much freedom the system gives the model.

| Primitive | What It Does | When To Use |
|-----------|-------------|-------------|
| **Direct Call** | Single model invocation, no tool orchestration | Simple questions, one-step lookups, format conversion. |
| **Workflow** | Fixed multi-step sequence | Predictable multi-step work: build-publish-review, test-deploy-verify. Each step is known. |
| **Autonomous Agent** | Model decides the next action | Open-ended research, exploratory debugging, design discovery. |
| **Subagent Packet** | Bounded task delegated to an isolated agent | Independent review, parallel source reading, context-separated implementation. |
| **Verifier Role** | Separate agent that only evaluates, does not generate | High-risk decisions, complex quality judgment, architecture review. |

Selection rule: start with the least autonomy that reliably finishes the task.
Direct call > workflow > agent > subagent + verifier. Escalate only when the
current tier is insufficient.

### Runtime Primitives

These primitives define how work proceeds over time.

| Primitive | What It Does | When To Use |
|-----------|-------------|-------------|
| **Run Record** | Durable evidence of task execution | After any meaningful lab, experiment, or harness-methodology task. |
| **Handoff Packet** | Bounded state transfer from one agent or session to another | Before context compaction, end of a long session, or when subagent work completes. |
| **Checkpoint** | Verified completeness gate that blocks further work until passed | At natural phase boundaries where convergence must be proven before continuing. |
| **Progress Note** | Compact status record in a durable file | During long multi-step tasks where the agent may lose context. |
| **Trace Summary** | Condensed trajectory of commands, inspections, failures, and decisions | After a task produces learning worth preserving. Keeps context lean. |

### Substrate Primitives

These primitives define the repo and tool environment that makes the harness usable.

| Primitive | What It Does | When To Use |
|-----------|-------------|-------------|
| **Progressive Disclosure** | Small entry document that links to deeper details on demand | Every root instruction. The default pattern for context management. |
| **Capability Discovery Gate** | Look for existing skills/tools before doing work directly | Before specialized, repeated, tool-shaped, or capability-uncertain work. |
| **Evidence Surface** | Read-only reference material from another repo or system | When a task depends on external truth the agent should not modify. |
| **Evolution Entry** | Narrative stage record for methodology, outcomes, and shareable lessons | After a stage-level outcome or meaningful learning. |
| **Template Skeleton** | Repeatable project structure that maps agent expectations before code exists | When creating a new project that should be agent-maintainable from day one. |

## Combined Primitives

Certain harness patterns combine multiple primitives into a repeatable unit.
These are not primitives themselves — they are compositions.

| Composite | Primitives Used | Canonical Doc |
|-----------|----------------|---------------|
| Agent Delivery Loop | Root Instruction + Task Spec + Workflow + Run Record + Trace Summary + Checkpoint | [agent-delivery-contract.md](./agent-delivery-contract.md) |
| Agent Learning Loop | Run Record + Boundary Rule + Evolution Entry + Decision Record | [agent-learning-loop.md](./agent-learning-loop.md) |
| Agent Orchestration Loop | Task Spec + Subagent Packet + Handoff Packet + Verifier Role + Run Record | [agent-orchestration-loop.md](./agent-orchestration-loop.md) |
| Standard Capture | Boundary Rule + Decision Record + Evolution Entry + Evidential Checklist | [standard-capture-loop.md](../docs/patterns/standard-capture-loop.md) |
| Verification Gate | Task Spec + Checkpoint + Evidential Checklist | [verification.md](./verification.md) |

## Primitive Selection Guide

### Starting A Task

```
task intake
  ├── is it simple? (one-step lookup, format conversion)
  │     → Direct Call + optional Root Instruction
  │
  ├── is it predictable? (build, publish, deploy, fix a known bug)
  │     → Task Spec + Workflow + Run Record
  │
  ├── is it exploratory? (design, research, root-cause)
  │     → Task Spec + Autonomous Agent + Progress Note + Run Record
  │
  └── is it high-risk? (refactoring, cross-repo changes, production)
        → Task Spec + Plan + Autonomous Agent + Verifier Role + Run Record
```

### Verifying Completion

```
task done
  ├── deterministic check available?
  │     → run it. pass → next. fail → fix.
  │
  ├── deterministic check unavailable, task is low-risk?
  │     → self-review against Evidential Checklist
  │
  └── deterministic check unavailable, task is high-risk?
        → Verifier Role or human approval gate
```

### Handling Long Work

```
work exceeds one context window
  ├── is there a natural phase boundary?
  │     → Handoff Packet + Checkpoint at the boundary
  │
  └── no natural boundary?
        → Progress Note every N steps + Handoff Packet before compaction
```

### Learning From The Task

```
task complete or failed
  ├── is there a reusable lesson?
  │     → classify → choose surface → update → record in Evolution Entry
  │
  ├── is there a tradeoff worth recording?
  │     → Decision Record
  │
  └── is it a one-off mistake?
        → note in final response, move on
```

## Primitive Lifecycle

Each primitive exists on a maturity curve within a project:

1. **Absent**: the project does not use this primitive.
2. **Ad hoc**: someone created an instance of this primitive (e.g., one run
   record) but there is no documented rule for when or how to create more.
3. **Documented**: a harness doc defines the primitive, its trigger, action, and
   output.
4. **Wired**: the primitive is referenced from `AGENTS.md`, a workflow doc, or a
   template. Agents are expected to use it.
5. **Verified**: there is an eval task, checklist, or rubric that checks whether
   agents actually use the primitive correctly.

The lifecycle helps assess harness maturity: a project that has "handoff"
documented but not wired will still lose context between sessions. A project
that has "run records" wired but not verified will produce inconsistent
evidence quality.

## Relationship To Other Harness Docs

| Doc | Connection |
|-----|-----------|
| `foundations.md` | Defines the 4-layer model that organizes these primitives. |
| `agent-delivery-contract.md` | Prescribes which primitives to use for minimum delivery. |
| `agent-learning-loop.md` | Prescribes which primitives to use when turning failures into standards. |
| `agent-orchestration-loop.md` | Prescribes which primitives to use for multi-agent work. |
| `verification.md` | Defines how Checkpoint and Evidential Checklist primitives work. |
| `capability-discovery.md` | Defines the Capability Discovery Gate primitive in detail. |
| `context-memory.md` | Explains why Progressive Disclosure and filesystem-as-memory matter. |
| `evals-observability.md` | Explains how Run Record and Trace Summary serve evaluation. |

## Anti-Patterns

- **Primitive sprawl**: documenting every possible primitive before any are
  wired or verified. Start with what the project actually needs.
- **Primitive theater**: using a Handoff Packet or Checkpoint when a direct
  message would suffice. Primitives are tools, not process decoration.
- **Skipping the lifecycle**: jumping from "absent" to "wired" without a
  documented definition. The project needs the doc first so agents know the
  contract.
- **Primitives without exits**: specifying when to use a primitive but not when
  it is safe to skip it. Every primitive in this note includes trigger and
  skip conditions.
- **Overlapping primitives**: Run Records and Experiment Reports overlapping
  in scope. Keep the distinction: Run Records are task-level evidence;
  Experiment Reports are method-and-result narratives.
