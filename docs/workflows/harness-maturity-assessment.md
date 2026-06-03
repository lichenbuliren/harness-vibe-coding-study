# Harness Maturity Assessment

This workflow provides a structured method for assessing a project's harness
engineering maturity. It answers: where is this project on the maturity
spectrum, and what should we improve next?

## Purpose

A harness maturity assessment helps a team or agent:

- understand which harness primitives the project uses, skips, or has never
  considered
- identify the highest-ROI improvement that is within reach
- track progress over time as the project evolves
- compare sibling repos or past baselines on the same criteria

## Method

The assessment follows four steps:

```text
survey -> score -> diagnose -> recommend
```

### Step 1: Survey

Collect the smallest high-signal file set.

For an existing repo, check these in order:

1. `AGENTS.md` or `CLAUDE.md` — root instruction
2. `CONTEXT.md` or `CONTEXT-MAP.md` — project context
3. `README.md` — human-facing entrance
4. `.agents/` or `.cursor/` — agent-local skills and config
5. `docs/` or `docs/agents/` — agent-supporting knowledge structure
6. `harness/` if present — harness methodology surface
7. `evals/` if present — evaluation artifacts
8. `experiments/` if present — experiment records
9. `harness/runs/` if present — run records
10. `docs/evolution/` if present — stage-level learning narratives
11. `decisions/` if present — ADR-style decision records
12. `templates/` if present — reusable project structures
13. `lab/` if present — validation projects
14. `git log --oneline -20` — recent activity pattern

For a new or template project, check the intended structure against the
template.

Read each file's first few lines, note its purpose and whether it appears
actively maintained (recent edits, internal cross-references, no stale todo
markers).

### Step 2: Score

Score the project across seven maturity layers. Each layer is scored 0-3:

| Score | Meaning |
|-------|---------|
| 0 | Absent — the layer has no artifacts |
| 1 | Ad hoc — artifacts exist but inconsistently or without documented rules |
| 2 | Established — documented rules exist and some instances are wired into agent behavior |
| 3 | Verified — wired rules have eval tasks or checklists that verify correct use |

#### Layer 1: Entry Surface

The project's agent-facing entrance. What an agent reads first.

Criteria:
- `AGENTS.md` or `CLAUDE.md` exists and is short (under 100 lines of rules)
- `CONTEXT.md` exists and states current phase, intent, and non-goals
- Root instruction is navigation-focused, not an encyclopedia
- Progressive disclosure is used: short entry points link to deeper docs
- `README.md` is human-facing but compatible with the agent-facing structure

#### Layer 2: Knowledge Structure

How domain knowledge is organized for agent consumption.

Criteria:
- Domain knowledge has a documented split from methodology/tooling knowledge
- Contexts have clear boundaries, non-boundaries, and ownership
- Knowledge is organized for progressive disclosure (index -> context -> detail)
- Counterintuitive behavior and "cannot assume" lists are captured
- There is a map or index that an agent can use to route to the right context

#### Layer 3: Harness Model

The project has a documented harness model with explicit Control, Agency,
Runtime, and Substrate layers.

Criteria:
- Harness methodology is documented in a dedicated directory or surface
- Control primitives are defined (root instructions, specs, plans, ADRs)
- Agency levels are documented (direct call, workflow, agent, verifier)
- Runtime primitives are defined (run records, handoffs, checkpoints)
- Substrate primitives are documented (progressive disclosure, skills, evidence)

#### Layer 4: Task Recovery

Long-running agent work can survive context loss.

Criteria:
- Run records are used for meaningful tasks
- Handoff packets exist for cross-session or cross-agent transfers
- Progress notes or equivalent status tracking exists
- A task spec or plan is written before multi-step work
- The project has documented rules for when to use each recovery primitive

#### Layer 5: Verification

Agent work is verified before being claimed as complete.

Criteria:
- Deterministic checks exist (lint, test, structural check, link check)
- The project has a documented verification policy distinguishing deterministic
  and inferential checks
- Verification level is determined by risk, not uniformly applied
- For non-low-risk work, the agent runs the relevant checks before reporting
  completion
- The delivery contract requires evidence, not plausibility

#### Layer 6: Eval & Trace

The project has a structured eval surface connected to run traces.

Criteria:
- At least one rubric or checklist exists for structured quality evaluation
- At least one experiment framework exists for testing harness changes
- At least one task sample exists for reproducible eval runs
- Run records capture trace-level information (files, commands, decisions)
- Task-level evaluation is connected to the learning loop

#### Layer 7: Learning Capture

The project turns corrections, experiments, and repeated friction into durable
standards.

Criteria:
- A standard capture loop is documented
- Evolution entries exist for stage-level learning
- Decision records exist for settled tradeoffs
- User corrections and review findings regularly become project standards
- Standards are discoverable by future agents (linked from AGENTS.md, indexed)

### Step 3: Diagnose

For each layer with score ≤ 1, identify the specific gap:

- **Missing artifact**: the layer has no files at all
- **Unmaintained**: artifacts exist but are stale, contradictory, or orphaned
- **Not wired**: documented rules exist but agents are not expected to follow
  them (not referenced from AGENTS.md, workflows, or templates)
- **Not verified**: wired rules exist but there is no check that confirms
  correct use
- **Over-documented**: too many files for the current phase, creating discovery
  burden

### Step 4: Recommend

For each gap, propose the next concrete improvement:

| Current Score | Recommended Next Step |
|--------------|---------------------|
| 0 | Create the minimum artifact for this layer (one file) |
| 1 | Document a rule for consistent use of this primitive |
| 2 | Wire the rule into AGENTS.md, workflows, or templates |
| 3 | Create an eval task or checklist that gates correct use |

Follow the "one layer at a time" rule: do not attempt to go from 0 to 3 in a
single task. Each layer should be lifted by one point before moving to the
next, unless lower layers block higher ones.

## Scoring Quick Reference

```
Layer 1: Entry Surface       [0/1/2/3]
Layer 2: Knowledge Structure [0/1/2/3]
Layer 3: Harness Model       [0/1/2/3]
Layer 4: Task Recovery       [0/1/2/3]
Layer 5: Verification        [0/1/2/3]
Layer 6: Eval & Trace        [0/1/2/3]
Layer 7: Learning Capture    [0/1/2/3]

Overall:         X / 21
Maturity Band:   (Bare / Growing / Established / Verified)
```

### Maturity Bands

| Score Range | Band | Implication |
|-------------|------|-------------|
| 0-6 | Bare | Minimal agent-facing structure exists. Agent work depends heavily on chat continuity and human guidance. |
| 7-11 | Growing | Entry surface and knowledge structure exist. Verification and recovery are inconsistent. |
| 12-16 | Established | Core harness primitives are documented and partially wired. Eval and learning capture are the next frontier. |
| 17-21 | Verified | All layers have artifacts, rules, wiring, and verification. The project is close to being self-sustaining for agent work. |

Higher bands require more maintenance effort. A project at Verified must keep
its evals and learning loop active or it will drift back to Established.

## Example Assessment Output

```
Repo: shopee/spp-user-plugin
Date: 2026-06-03
Assessor: Codex (lead agent)

Layer 1: Entry Surface       2 — Established
Layer 2: Knowledge Structure 3 — Verified
Layer 3: Harness Model       1 — Ad hoc
Layer 4: Task Recovery       0 — Absent
Layer 5: Verification        1 — Ad hoc
Layer 6: Eval & Trace        0 — Absent
Layer 7: Learning Capture    0 — Absent

Overall:  7 / 21
Band:     Growing

Diagnosis:
- Entry surface and knowledge structure are strong (CONTEXT-MAP.md with 16
  contexts). AGENTS.md is 386 lines and needs compression.
- No harness model, run records, handoffs, evals, experiments, or standard
  capture exist outside the domain knowledge layer.

Recommendation:
- Next: Layer 3 (Harness Model) — add a minimal harness/ with primitives or
  import from the study repo template.
- Then: Layer 4 (Task Recovery) — add run records for the next meaningful task.
```

## Known Limitations

- The assessment is qualitative and depends on the assessor's judgment. Two
  assessors may differ by 1 point on subjective criteria (Layer 6 eval quality,
  Layer 7 learning capture effectiveness).
- The assessment measures harness infrastructure, not task outcomes. A project
  with high maturity scores may still produce poor agent work if the model or
  tools are misaligned.
- The assessment is a point-in-time measurement. Maturity drifts when
  artifacts are not maintained or when the project grows faster than its
  harness.
- The assessment should be re-run after significant project changes (phase
  transitions, new repo structure, team composition changes, or repeated agent
  failures).

## Relationship To Other Docs

| Doc | Connection |
|-----|-----------|
| `primitives.md` (harness/) | The primitive lifecycle (absent → ad hoc → documented → wired → verified) is the scoring basis. |
| `agent-delivery-contract.md` | Verification and run record requirements map to Layers 5 and 4. |
| `agent-learning-loop.md` | Standard capture and evolution requirements map to Layer 7. |
| `evals-observability.md` | Eval infrastructure requirements map to Layer 6. |
| `context-memory.md` | Knowledge structure requirements map to Layer 2. |
