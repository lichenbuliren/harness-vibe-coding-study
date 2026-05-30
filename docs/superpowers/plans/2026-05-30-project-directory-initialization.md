# Project Directory Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize an Agent-First Living Lab repository structure for harness + vibe coding best practices.

**Architecture:** The repository is documentation-first and agent-first. Root entry files explain project intent and operating rules, domain directories separate methodology, agent resources, harness notes, experiments, evals, lab validation, decisions, and evolution logs. The initial implementation creates thin index files and one stage record rather than premature application code.

**Tech Stack:** Markdown, git, existing repository conventions, no application framework, no new dependencies.

---

## File Structure

Create or modify the following files:

- Modify: `AGENTS.md` — root agent operating contract, including evolution log requirement.
- Create: `README.md` — human-facing bilingual project entrance.
- Create: `CONTEXT.md` — durable project context and knowledge capture rules.
- Modify: `docs/index.md` — documentation hub.
- Create: `docs/principles/index.md` — principle category entrance.
- Create: `docs/workflows/index.md` — workflow category entrance.
- Create: `docs/patterns/index.md` — pattern category entrance.
- Modify/Create: `docs/tools/index.md` — tool notes category entrance.
- Keep: `docs/tools/grill-me.md` — existing tool note.
- Keep: `docs/tools/superpowers.md` — existing tool note.
- Create: `docs/evolution/index.md` — evolution log instructions and template.
- Create: `docs/evolution/0001-project-directory-planning.md` — first stage evolution record.
- Create: `agents/index.md` — agent-facing resources entrance.
- Create: `agents/roles/index.md` — role definitions entrance.
- Create: `agents/playbooks/index.md` — execution playbooks entrance.
- Create: `agents/handoffs/index.md` — handoff formats entrance.
- Create: `harness/index.md` — harness concept entrance.
- Create: `harness/adapters/index.md` — adapter boundary entrance.
- Create: `harness/runs/index.md` — run record entrance.
- Create: `experiments/index.md` — experiment area entrance.
- Create: `experiments/task-samples/index.md` — task sample entrance.
- Create: `experiments/reports/index.md` — experiment report entrance.
- Create: `lab/README.md` — validation project entrance.
- Create: `lab/AGENTS.md` — validation project local agent rules.
- Create: `evals/index.md` — evaluation area entrance.
- Create: `evals/rubrics/index.md` — rubric entrance.
- Create: `evals/checklists/index.md` — checklist entrance.
- Create: `decisions/index.md` — ADR index.
- Create: `decisions/0001-adopt-agent-first-living-lab.md` — first ADR.

Do not create `apps/`, `packages/`, `src/`, `scripts/`, `infra/`, or `benchmarks/`.

### Task 1: Root Entry Documents

**Files:**
- Modify: `AGENTS.md`
- Create: `README.md`
- Create: `CONTEXT.md`

- [ ] **Step 1: Inspect existing root files**

Run:

```bash
sed -n '1,220p' AGENTS.md
test -f README.md && sed -n '1,220p' README.md || true
test -f CONTEXT.md && sed -n '1,220p' CONTEXT.md || true
```

Expected: `AGENTS.md` may be empty or local; `README.md` and `CONTEXT.md` may not exist.

- [ ] **Step 2: Write `AGENTS.md`**

Replace or create `AGENTS.md` with:

```md
# Agent Operating Contract

本仓库用于探索 harness + vibe coding 的最佳实践。它首先服务 AI coding
agent 阅读和执行，其次服务 harness 实验、评估复盘和后续分享。

This repository explores best practices for harness + vibe coding. It is an
Agent-First Living Lab: agents should be able to understand the project,
navigate the repository, act within clear boundaries, and record evidence.

## Repository Purpose

- Build an AI-agent-readable project operating system.
- Document reusable methodology for harness + vibe coding.
- Validate the methodology through a real project under `lab/`.
- Record decisions, experiments, evaluations, and shareable evolution notes.

## Directory Map

- `README.md`: human-facing project entrance.
- `CONTEXT.md`: durable project context for future agents and compressed sessions.
- `docs/`: methodology, workflows, patterns, tools, and evolution logs.
- `agents/`: agent roles, playbooks, and handoff formats.
- `harness/`: harness concepts, adapter boundaries, and run records.
- `experiments/`: task samples, experiment design, and experiment reports.
- `evals/`: rubrics, checklists, and quality gates.
- `lab/`: real validation project used to test the methodology.
- `decisions/`: concise ADR-style decision records.

## Operating Rules

- Read `CONTEXT.md` before making project-shaping changes.
- Prefer thin, well-named Markdown entry files over empty directories.
- Keep directory responsibilities separate: experiments record what happened;
  evals define how quality is judged.
- Do not introduce application code, dependencies, or framework structure until
  a plan explicitly calls for it.
- Do not create `apps/`, `packages/`, `src/`, `scripts/`, `infra/`, or
  `benchmarks/` during the first structure pass.
- Preserve existing user-authored notes unless a task explicitly asks to replace
  them.

## Verification Requirements

Before claiming completion:

- Run `find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort` to
  inspect the resulting structure.
- Run `git status --short` and report untracked or intentionally untouched files.
- Confirm required index files exist.
- Confirm no forbidden first-stage directories were created.

## Evolution Log Requirement

When a stage-level outcome is reached, update `docs/evolution/`.

A stage-level outcome includes:

- a project structure decision
- a methodology decision
- a completed experiment
- a meaningful lab milestone
- a reusable pattern or workflow being validated
- a public-shareable learning

Do not record every small edit. Record the method used, the questions asked, the
decision made, the artifacts produced, and the shareable takeaway.
```

- [ ] **Step 3: Write `README.md`**

Create `README.md` with:

```md
# Harness Vibe Coding Study

这是一个用于探索 harness + vibe coding 最佳实践的 Agent-First Living Lab。

This project explores best practices for harness + vibe coding through an
agent-readable repository structure, documented workflows, experiments,
evaluations, and a real validation project.

## Why This Exists

我们希望回答一个实际问题：怎样组织项目，才能让 AI coding agent 更快理解上下文、
更稳定执行任务，并把过程中的方法论沉淀为可复用知识。

The repository is designed to make agent work observable, repeatable, and
shareable.

## Current Phase

Project initialization. The first milestone is repository structure planning:
define how agents read the project, where methodology lives, how experiments are
recorded, and how a real `lab/` project will validate the practices.

## How To Read This Repository

- Start with `CONTEXT.md` for project intent and current assumptions.
- Read `AGENTS.md` for agent operating rules.
- Use `docs/` for methodology and tool notes.
- Use `agents/` for agent roles, playbooks, and handoffs.
- Use `harness/`, `experiments/`, and `evals/` for research and validation.
- Use `lab/` for the real validation project.
- Use `decisions/` for concise decision records.
- Use `docs/evolution/` for stage-level narrative records and shareable lessons.
```

- [ ] **Step 4: Write `CONTEXT.md`**

Create `CONTEXT.md` with:

```md
# Project Context

## Intent

本项目探索 harness + vibe coding 的最佳实践，目标是让 AI agent 能够快速理解项目、
稳定执行任务、留下可验证证据，并把阶段性经验沉淀为可复用方法论。

This project explores harness + vibe coding best practices through an
Agent-First Living Lab structure.

## Current Phase

Project initialization. The current focus is directory structure, agent-readable
context, and stage-level documentation practices.

## Key Terms

- **Harness**: the surrounding system that frames, runs, observes, or evaluates
  AI-agent work.
- **Vibe coding**: collaborative AI-assisted development where intent,
  iteration, and rapid feedback shape implementation.
- **Agent-First Living Lab**: a repository structure that first helps agents
  understand and act, then validates those practices through a real project.
- **Lab**: the real validation project under `lab/`.
- **Evolution log**: narrative stage records under `docs/evolution/`.
- **Decision record**: concise ADR-style records under `decisions/`.

## Working Assumptions

- English directory names improve tool and agent interoperability.
- Core entry documents should be bilingual or bilingual-friendly.
- The first stage should initialize knowledge structure, not application code.
- A real validation project is necessary to test the methodology.

## Non-Goals

- Choose a product stack.
- Add application source code.
- Add infrastructure or deployment configuration.
- Build harness automation before documenting harness boundaries.

## Knowledge Capture

This project captures two kinds of memory:

- `decisions/`: concise ADR-style decision records
- `docs/evolution/`: narrative stage records for methodology, outcomes, and
  shareable lessons

Agents should update `docs/evolution/` after stage-level progress, especially
when a new practice has been validated or rejected.

## Recent Decisions

- Adopt Agent-First Living Lab as the first repository structure.
- Use English directory names with bilingual-friendly entry documents.
- Separate `experiments/` from `evals/`.
- Use `lab/` as the real validation project container.
- Use `docs/evolution/` for stage-level sharing records.
```

- [ ] **Step 5: Verify root documents**

Run:

```bash
for file in AGENTS.md README.md CONTEXT.md; do test -s "$file" && echo "OK $file"; done
```

Expected:

```text
OK AGENTS.md
OK README.md
OK CONTEXT.md
```

- [ ] **Step 6: Commit root entry documents**

Run:

```bash
git add AGENTS.md README.md CONTEXT.md
git commit -m "Establish the agent-readable project entrance" \
  -m "The repository needs a small set of durable root documents before any deeper structure is useful. These files define the project intent, operating contract, and knowledge-capture rules for future agents." \
  -m "Constraint: Core entry documents must be bilingual-friendly while keeping English paths." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Verified AGENTS.md, README.md, and CONTEXT.md exist and are non-empty." \
  -m "Not-tested: Downstream directory initialization; covered by later plan tasks."
```

Expected: git creates a commit for the three root files.

### Task 2: Documentation Knowledge Base

**Files:**
- Modify: `docs/index.md`
- Create: `docs/principles/index.md`
- Create: `docs/workflows/index.md`
- Create: `docs/patterns/index.md`
- Modify/Create: `docs/tools/index.md`
- Keep: `docs/tools/grill-me.md`
- Keep: `docs/tools/superpowers.md`

- [ ] **Step 1: Inspect existing docs**

Run:

```bash
find docs -maxdepth 3 -type f | sort
```

Expected: includes existing `docs/index.md`, `docs/tools/grill-me.md`, `docs/tools/superpowers.md`, the approved spec, and this plan.

- [ ] **Step 2: Create docs category directories**

Run:

```bash
mkdir -p docs/principles docs/workflows docs/patterns docs/tools
```

Expected: command succeeds.

- [ ] **Step 3: Write `docs/index.md`**

Replace `docs/index.md` with:

```md
# Documentation Index

`docs/` stores methodology and knowledge for the harness + vibe coding study.

## Sections

- `principles/`: stable principles and constraints.
- `workflows/`: repeatable work processes.
- `patterns/`: reusable patterns discovered through practice.
- `tools/`: tool notes and installation guidance.
- `evolution/`: stage-level narrative records and shareable lessons.
- `superpowers/`: specs and plans created through the Superpowers workflow.

## Placement Rule

- Put durable beliefs in `principles/`.
- Put step-by-step procedures in `workflows/`.
- Put reusable solutions in `patterns/`.
- Put tool-specific notes in `tools/`.
- Put stage-level retrospection and shareable outcomes in `evolution/`.
```

- [ ] **Step 4: Write `docs/principles/index.md`**

Create `docs/principles/index.md` with:

```md
# Principles

This directory stores stable principles for harness + vibe coding work.

Use it for beliefs that should guide many future tasks, such as agent-readable
context, verification before completion, evidence capture, and keeping
repository structure thin until real pressure appears.
```

- [ ] **Step 5: Write `docs/workflows/index.md`**

Create `docs/workflows/index.md` with:

```md
# Workflows

This directory stores repeatable workflows.

Use it for step-by-step processes that agents or humans can follow, such as
planning, implementation, verification, experiment reporting, and evolution-log
updates.
```

- [ ] **Step 6: Write `docs/patterns/index.md`**

Create `docs/patterns/index.md` with:

```md
# Patterns

This directory stores reusable patterns discovered through practice.

Use it when a workflow, directory shape, prompt structure, evaluation approach,
or handoff format has been validated enough to reuse.
```

- [ ] **Step 7: Write `docs/tools/index.md`**

Create or replace `docs/tools/index.md` with:

```md
# Tools

This directory stores notes about tools that support harness + vibe coding work.

## Current Notes

- `grill-me.md`: notes for the Matt Pocock skills collection.
- `superpowers.md`: notes for the Superpowers plugin and brainstorming workflow.

Tool notes should explain why a tool matters to this project, how to install or
enable it, and when an agent should use it.
```

- [ ] **Step 8: Verify docs knowledge base**

Run:

```bash
for file in docs/index.md docs/principles/index.md docs/workflows/index.md docs/patterns/index.md docs/tools/index.md; do test -s "$file" && echo "OK $file"; done
```

Expected:

```text
OK docs/index.md
OK docs/principles/index.md
OK docs/workflows/index.md
OK docs/patterns/index.md
OK docs/tools/index.md
```

- [ ] **Step 9: Commit docs knowledge base**

Run:

```bash
git add docs/index.md docs/principles/index.md docs/workflows/index.md docs/patterns/index.md docs/tools/index.md
git commit -m "Create the methodology knowledge base entrances" \
  -m "The project needs clear documentation categories before adding detailed methodology. These indexes define where principles, workflows, patterns, and tool notes belong." \
  -m "Constraint: Preserve existing tool notes while adding an index." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Verified documentation index files exist and are non-empty." \
  -m "Not-tested: Detailed methodology content; future milestones will fill these sections."
```

Expected: git creates a commit for documentation indexes.

### Task 3: Agent Resource Area

**Files:**
- Create: `agents/index.md`
- Create: `agents/roles/index.md`
- Create: `agents/playbooks/index.md`
- Create: `agents/handoffs/index.md`

- [ ] **Step 1: Create agent directories**

Run:

```bash
mkdir -p agents/roles agents/playbooks agents/handoffs
```

Expected: command succeeds.

- [ ] **Step 2: Write `agents/index.md`**

Create `agents/index.md` with:

```md
# Agent Resources

This directory stores resources written for AI agents.

Use it to answer:

- What role should an agent take?
- Which playbook should guide the work?
- How should state be handed off to another agent or future session?

Do not put general methodology here. Put broad methodology in `docs/`, and keep
this directory focused on agent execution surfaces.
```

- [ ] **Step 3: Write `agents/roles/index.md`**

Create `agents/roles/index.md` with:

```md
# Agent Roles

This directory will store role definitions for agent work.

Role documents should define responsibility, authority, expected outputs,
handoff behavior, and verification expectations.
```

- [ ] **Step 4: Write `agents/playbooks/index.md`**

Create `agents/playbooks/index.md` with:

```md
# Agent Playbooks

This directory will store reusable execution playbooks.

Playbooks should describe when to use a workflow, what inputs it needs, what
steps it follows, what evidence it must produce, and where outcomes should be
recorded.
```

- [ ] **Step 5: Write `agents/handoffs/index.md`**

Create `agents/handoffs/index.md` with:

```md
# Agent Handoffs

This directory will store handoff formats for future agents and resumed
sessions.

Handoff documents should preserve current goal, relevant context, completed
work, pending work, verification status, and known risks.
```

- [ ] **Step 6: Verify agent resource files**

Run:

```bash
for file in agents/index.md agents/roles/index.md agents/playbooks/index.md agents/handoffs/index.md; do test -s "$file" && echo "OK $file"; done
```

Expected:

```text
OK agents/index.md
OK agents/roles/index.md
OK agents/playbooks/index.md
OK agents/handoffs/index.md
```

- [ ] **Step 7: Commit agent resource area**

Run:

```bash
git add agents/index.md agents/roles/index.md agents/playbooks/index.md agents/handoffs/index.md
git commit -m "Give agents dedicated execution resources" \
  -m "Agent-facing roles, playbooks, and handoffs need a separate home from general methodology so future workers can quickly find operational guidance." \
  -m "Constraint: Keep this area focused on execution surfaces, not broad docs." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Verified agent resource index files exist and are non-empty." \
  -m "Not-tested: Concrete role and playbook definitions; future work will add them as practices stabilize."
```

Expected: git creates a commit for the `agents/` area.

### Task 4: Harness, Experiments, Evals, and Lab Areas

**Files:**
- Create: `harness/index.md`
- Create: `harness/adapters/index.md`
- Create: `harness/runs/index.md`
- Create: `experiments/index.md`
- Create: `experiments/task-samples/index.md`
- Create: `experiments/reports/index.md`
- Create: `evals/index.md`
- Create: `evals/rubrics/index.md`
- Create: `evals/checklists/index.md`
- Create: `lab/README.md`
- Create: `lab/AGENTS.md`

- [ ] **Step 1: Create validation directories**

Run:

```bash
mkdir -p harness/adapters harness/runs experiments/task-samples experiments/reports evals/rubrics evals/checklists lab
```

Expected: command succeeds.

- [ ] **Step 2: Write harness files**

Create `harness/index.md` with:

```md
# Harness

`harness/` describes how this project frames, runs, observes, and evaluates
AI-agent work.

In the first stage this directory is documentation-first. Add executable harness
code only after the concepts, adapter boundaries, and run-recording conventions
are clear.
```

Create `harness/adapters/index.md` with:

```md
# Harness Adapters

This directory will describe adapter boundaries between the project and external
agent runtimes, tools, or evaluation surfaces.

An adapter note should explain what system it connects to, what inputs and
outputs pass through the boundary, and what evidence it can capture.
```

Create `harness/runs/index.md` with:

```md
# Harness Runs

This directory will describe how runs are recorded.

Run records should capture task, agent setup, method, inputs, outputs,
verification evidence, issues observed, and follow-up decisions.
```

- [ ] **Step 3: Write experiment files**

Create `experiments/index.md` with:

```md
# Experiments

`experiments/` records what we tried, under what conditions, and what happened.

Use experiments for task samples, run reports, comparisons, and retrospectives.
Keep evaluation criteria in `evals/`.
```

Create `experiments/task-samples/index.md` with:

```md
# Task Samples

This directory will store tasks used to test agent workflows and harness
behavior.

A task sample should define goal, starting context, constraints, expected
artifacts, and evaluation hooks.
```

Create `experiments/reports/index.md` with:

```md
# Experiment Reports

This directory will store experiment reports and retrospectives.

Reports should describe the task, method, agent setup, observations, evidence,
outcome, and follow-up decisions.
```

- [ ] **Step 4: Write evaluation files**

Create `evals/index.md` with:

```md
# Evaluations

`evals/` defines how quality is judged.

Use this directory for rubrics, checklists, and gates that can be reused across
experiments and lab work.
```

Create `evals/rubrics/index.md` with:

```md
# Rubrics

This directory will store evaluation rubrics.

Rubrics should define the qualities being judged, scoring levels, examples of
strong and weak outputs, and evidence required for each judgment.
```

Create `evals/checklists/index.md` with:

```md
# Checklists

This directory will store repeatable completion and quality checklists.

Checklists should be concrete enough for agents to run before claiming work is
complete.
```

- [ ] **Step 5: Write lab files**

Create `lab/README.md` with:

```md
# Lab

`lab/` contains the real validation project for this repository.

The lab starts intentionally small. Its purpose is to test whether the
agent-first methodology, harness notes, experiments, and evals help real project
work.

Lessons learned in `lab/` should feed back into `docs/`, `agents/`, `harness/`,
`experiments/`, `evals/`, `decisions/`, and `docs/evolution/` when they become
stage-level outcomes.
```

Create `lab/AGENTS.md` with:

```md
# Lab Agent Rules

This directory contains the real validation project.

## Local Rules

- Follow the root `AGENTS.md` unless this file gives a more specific rule.
- Keep lab work small and observable.
- Record reusable lessons outside `lab/` when they become project-level
  methodology.
- Do not introduce a product stack until a design spec and implementation plan
  explicitly choose one.

## Verification

Until the lab has a concrete app, verification is documentation-based:

- confirm changed files exist
- confirm directory responsibilities remain clear
- confirm project-level learnings are reflected in the correct parent docs
```

- [ ] **Step 6: Verify validation areas**

Run:

```bash
for file in harness/index.md harness/adapters/index.md harness/runs/index.md experiments/index.md experiments/task-samples/index.md experiments/reports/index.md evals/index.md evals/rubrics/index.md evals/checklists/index.md lab/README.md lab/AGENTS.md; do test -s "$file" && echo "OK $file"; done
```

Expected: one `OK` line for each file.

- [ ] **Step 7: Commit validation areas**

Run:

```bash
git add harness experiments evals lab
git commit -m "Create the validation surfaces for harness practice" \
  -m "The living lab needs distinct places for harness concepts, experiment records, quality standards, and the real validation project. These thin entrances make the boundaries explicit before implementation pressure arrives." \
  -m "Constraint: Keep harness and lab documentation-first during initialization." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Verified harness, experiment, eval, and lab index files exist and are non-empty." \
  -m "Not-tested: Real lab application behavior; no app exists yet."
```

Expected: git creates a commit for validation surfaces.

### Task 5: Decisions and Evolution Records

**Files:**
- Create: `decisions/index.md`
- Create: `decisions/0001-adopt-agent-first-living-lab.md`
- Create: `docs/evolution/index.md`
- Create: `docs/evolution/0001-project-directory-planning.md`

- [ ] **Step 1: Create decision and evolution directories**

Run:

```bash
mkdir -p decisions docs/evolution
```

Expected: command succeeds.

- [ ] **Step 2: Write `decisions/index.md`**

Create `decisions/index.md` with:

```md
# Decisions

This directory stores concise ADR-style decision records.

Use decisions to explain why the project chose a direction, what alternatives
were rejected, and what future agents should avoid re-litigating.

## Records

- `0001-adopt-agent-first-living-lab.md`
```

- [ ] **Step 3: Write first ADR**

Create `decisions/0001-adopt-agent-first-living-lab.md` with:

```md
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
```

- [ ] **Step 4: Write evolution index**

Create `docs/evolution/index.md` with:

```md
# Evolution Log

Use this directory to record stage-level project evolution.

Evolution entries are narrative records for future sharing. They are not
changelogs and should not capture every small edit.

Each entry should explain:

- what stage we were in
- what goal we pursued
- what methodology we used
- what questions or constraints shaped the work
- what outcome we reached
- what artifacts were produced
- what can be shared with others
- what remains open

## Entries

- `0001-project-directory-planning.md`
```

- [ ] **Step 5: Write first evolution record**

Create `docs/evolution/0001-project-directory-planning.md` with:

```md
# 0001 Project Directory Planning

## Stage

Project initialization.

## Goal

Design an agent-first directory structure for a harness + vibe coding best
practices repository.

## Methodology Used

- `superpowers:brainstorming`
- Project context exploration
- One-question-at-a-time clarification
- Alternative comparison
- Incremental design approval
- Written design spec before implementation planning

## Key Questions

- Should the project start as documentation, experiments, product code, or a
  mixed structure?
- What role should the first real project play?
- Which reader should the structure optimize for first?
- What language strategy should directory names and documents use?
- Where should stage-level learning be recorded for future sharing?

## Outcome

The project adopted an Agent-First Living Lab structure.

The first stage will produce AI-agent-readable project guidance and methodology.
The `lab/` directory will later host a real validation project that tests
whether those practices help actual development work.

## Artifacts Produced

- `docs/superpowers/specs/2026-05-30-project-directory-planning-design.md`
- `docs/superpowers/plans/2026-05-30-project-directory-initialization.md`
- `decisions/0001-adopt-agent-first-living-lab.md`
- Initial repository directory structure

## Shareable Takeaway

Project directories are not just file categories. In an AI-agent-first project,
the directory structure is a cognitive path: agents need an entrance, durable
context, operating rules, methodology, experiments, quality standards, decisions,
and a real validation surface.

## Open Questions

- What should the first `lab/` validation project be?
- Which harness adapters should be explored first?
- What evaluation rubric should judge agent-readable repository structure?
```

- [ ] **Step 6: Verify decisions and evolution records**

Run:

```bash
for file in decisions/index.md decisions/0001-adopt-agent-first-living-lab.md docs/evolution/index.md docs/evolution/0001-project-directory-planning.md; do test -s "$file" && echo "OK $file"; done
```

Expected:

```text
OK decisions/index.md
OK decisions/0001-adopt-agent-first-living-lab.md
OK docs/evolution/index.md
OK docs/evolution/0001-project-directory-planning.md
```

- [ ] **Step 7: Commit decisions and evolution records**

Run:

```bash
git add decisions docs/evolution
git commit -m "Record why the project starts as a living lab" \
  -m "The repository needs both concise decisions and narrative evolution records. The ADR prevents future re-litigation, while the evolution entry preserves the method and outcome for sharing." \
  -m "Constraint: Evolution records capture stage-level outcomes, not every edit." \
  -m "Rejected: Use only ADRs | too terse for future sharing and methodology storytelling." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Verified decision and evolution files exist and are non-empty." \
  -m "Not-tested: Future evolution-log discipline; enforced through AGENTS.md and CONTEXT.md."
```

Expected: git creates a commit for decisions and evolution records.

### Task 6: Final Structure Verification

**Files:**
- Inspect: all initialized files
- Confirm absent: `apps/`, `packages/`, `src/`, `scripts/`, `infra/`, `benchmarks/`

- [ ] **Step 1: Print final structure**

Run:

```bash
find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
```

Expected: output includes the planned directories and does not include forbidden first-stage directories.

- [ ] **Step 2: Confirm required files exist**

Run:

```bash
required_files='
AGENTS.md
README.md
CONTEXT.md
docs/index.md
docs/principles/index.md
docs/workflows/index.md
docs/patterns/index.md
docs/tools/index.md
docs/evolution/index.md
docs/evolution/0001-project-directory-planning.md
agents/index.md
agents/roles/index.md
agents/playbooks/index.md
agents/handoffs/index.md
harness/index.md
harness/adapters/index.md
harness/runs/index.md
experiments/index.md
experiments/task-samples/index.md
experiments/reports/index.md
lab/README.md
lab/AGENTS.md
evals/index.md
evals/rubrics/index.md
evals/checklists/index.md
decisions/index.md
decisions/0001-adopt-agent-first-living-lab.md
'
for file in $required_files; do test -s "$file" && echo "OK $file" || echo "MISSING $file"; done
```

Expected: every line starts with `OK`.

- [ ] **Step 3: Confirm forbidden directories are absent**

Run:

```bash
for dir in apps packages src scripts infra benchmarks; do test ! -e "$dir" && echo "ABSENT $dir" || echo "FORBIDDEN $dir"; done
```

Expected:

```text
ABSENT apps
ABSENT packages
ABSENT src
ABSENT scripts
ABSENT infra
ABSENT benchmarks
```

- [ ] **Step 4: Check git status**

Run:

```bash
git status --short
```

Expected: either clean, or only intentionally untracked `.omx/` runtime state.

- [ ] **Step 5: Commit final plan file if not already committed**

Run:

```bash
git add docs/superpowers/plans/2026-05-30-project-directory-initialization.md
git commit -m "Plan the first project-structure initialization" \
  -m "The approved design needs a bite-sized implementation plan before directory initialization begins. This plan maps each file, verification command, and commit point." \
  -m "Constraint: Brainstorming transitions to writing-plans before implementation." \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Reviewed the plan for spec coverage, placeholders, and executable steps." \
  -m "Not-tested: Plan execution; implementation follows in a separate step."
```

Expected: git creates a commit for the implementation plan.
