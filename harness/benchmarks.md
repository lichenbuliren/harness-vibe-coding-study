# Benchmarks

This note synthesizes the Benchmarks module from
`walkinglabs/awesome-harness-engineering`.

## Core Claim

Benchmarks should not be treated as pure model scoreboards. For agentic work,
they also measure the surrounding harness:

- context selection
- tool design
- browser, shell, desktop, or MCP integration
- sandbox setup
- verification logic
- retry and recovery behavior
- trace capture
- cost and latency control

In harness engineering, a benchmark is useful when it exposes which part of the
system helped or failed, not merely when it produces a leaderboard number.

## Benchmark Taxonomy

Use benchmarks by task surface, not by popularity.

### Coding and Terminal Work

Use when validating repo navigation, patching, shell use, dependency handling,
test execution, and verification loops.

- SWE-bench Verified
- Terminal-Bench
- Terminal-Bench 2.0 / Harbor
- EvoClaw
- LeetCode-Hard Gym
- SEC-bench

Harness questions:

- Can the agent reproduce the issue before patching?
- Does it select relevant files without reading the entire repo?
- Does it run targeted verification before broad verification?
- Does it recover from failed commands?
- Does it avoid overfitting to hidden tests or benchmark quirks?

### Web and Browser Work

Use when validating navigation, stateful web interaction, visual context,
network traces, and deterministic scoring for web tasks.

- WebArena
- WebArena-Verified
- VisualWebArena
- BrowserGym
- WorkArena
- AssistantBench
- BrowseComp
- ClawBench web tasks

Harness questions:

- Can the agent inspect page state without hallucinating?
- Are browser actions observable and replayable?
- Can final side effects be blocked or intercepted safely?
- Are dynamic websites controlled enough for repeatable evals?
- Does visual context improve or distract from task completion?

### Desktop and Computer-Use Work

Use when validating multimodal observation, GUI control, cross-application
state, file side effects, and execution-based evaluators.

- OSWorld
- OSWorld-MCP
- Computer Agent Arena
- VAB / VisualAgentBench
- AgentStudio

Harness questions:

- Can the harness restore initial state reliably?
- Are screenshots, UI actions, and file changes captured?
- Is the evaluator checking actual system state rather than appearance?
- Can the agent complete tasks across multiple applications?

### Tool, API, and MCP Work

Use when validating structured tool calling, policy following, latency, token
use, and MCP integration.

- MCP Bench
- MCP Universe
- MCPMark
- tau-bench
- tau2-bench
- GTA
- TravelPlanner

Harness questions:

- Does the agent choose the right tool with correct arguments?
- Does policy guidance constrain tool use?
- Are tool failures recoverable?
- Are tool calls logged with enough metadata to debug regressions?
- Does MCP improve portability or add unnecessary indirection?

### Multi-Agent, Conversation, and Role Fidelity

Use when validating shared state, delegation, character or role consistency,
multi-turn dialogue, and collaboration.

- MAgIC
- CharacterEval
- ClawBench conversation tasks
- WildClawBench

Harness questions:

- Does delegation reduce or duplicate work?
- Are agent boundaries clear?
- Is shared state explicit?
- Does the system preserve policy, role, and conversation quality across turns?

### Economic and Long-Horizon Work

Use when validating cost-aware autonomy, resource limits, long-horizon planning,
and practical task value.

- ClawWork
- Olas Predict Benchmark
- GAIA
- HAL
- Galileo Agent Leaderboard
- Agent Arena

Harness questions:

- Does the agent create value relative to token/tool cost?
- Are long-horizon runs resumable?
- Can the harness detect wasteful exploration?
- Are score, cost, and reliability reported together?

## How to Use Benchmarks Locally

Do not start by chasing broad leaderboard performance. Start by mapping
benchmarks to local harness questions.

```text
Harness question -> benchmark family -> local mini-eval -> external benchmark
```

Examples:

- If we want to test repo onboarding, start with a local directory-contract eval,
  then compare the pattern to SWE-bench or Terminal-Bench.
- If we want to test browser workflows, create a small local web task before
  moving to WebArena or WorkArena.
- If we want to test MCP usage, write a local tool-selection task before
  comparing against MCPMark or MCP Bench.
- If we want to test multi-agent delegation, use a local research synthesis task
  before comparing against multi-agent benchmarks.

## Reporting Rules

Every benchmark result should include:

- benchmark name and version
- task subset
- model
- harness revision
- prompt/tool/skill revision
- runtime and sandbox details
- resource limits and timeout
- number of trials
- pass rate and confidence notes
- cost and latency
- trace/log location
- known evaluator limitations

## Interpretation Rules

- A benchmark score measures a model-harness-environment bundle.
- Small deltas are weak evidence unless setup, sample count, and confidence are
  clear.
- High score without trace evidence is hard to learn from.
- Low score may reflect grader bugs, ambiguous tasks, infra noise, or missing
  harness support rather than model inability.
- Broad benchmarks are useful for external comparison; local evals are better
  for day-to-day regression gates.
- Benchmark saturation is a signal to move to harder or more realistic tasks.

## First Local Benchmark Strategy

For this project, use a three-layer strategy:

1. **Local mini-evals**
   - directory contract
   - evolution log update
   - source synthesis
   - verification-before-completion

2. **Domain-aligned external references**
   - Terminal-Bench/SWE-bench for coding-agent workflows
   - WebArena/WorkArena for browser and knowledge-work workflows
   - MCPMark/MCP Bench for tool-protocol workflows

3. **Shareable benchmark interpretation**
   - explain what the result says about harness design
   - avoid claiming pure model capability from harness-dependent outcomes
   - report trace, cost, and environment alongside pass rate

## Anti-Patterns

- Selecting benchmarks because they are popular rather than because they match a
  harness question.
- Treating leaderboard rank as a product decision by itself.
- Comparing results across different resource, timeout, or sandbox conditions.
- Ignoring failed traces after recording a final pass/fail score.
- Optimizing the harness for one benchmark task at the cost of real workflow
  reliability.
- Reporting success without cost, latency, and number of attempts.

## Sources

- https://www.agent-arena.com/leaderboard
- https://github.com/THUDM/AgentBench
- https://github.com/HKUST-NLP/AgentBoard
- https://github.com/SkyworkAI/agent-studio
- https://appworld.dev/
- https://github.com/oriyor/AssistantBench
- https://www.kaggle.com/benchmarks/openai/browsecomp
- https://huggingface.co/spaces/ServiceNow/browsergym-leaderboard
- https://github.com/morecry/CharacterEval
- https://clawbench.net
- https://huggingface.co/papers/2604.08523
- https://github.com/HKUDS/ClawWork
- https://github.com/xlang-ai/computer-agent-arena
- https://openhands.dev/blog/evoclaw-benchmark
- https://huggingface.co/datasets/gaia-benchmark/GAIA
- https://huggingface.co/spaces/galileo-ai/agent-leaderboard
- https://github.com/open-compass/GTA
- https://hal.cs.princeton.edu/
- https://www.tbench.ai/news/announcement-2-0
- https://github.com/GammaTauAI/leetcode-hard-gym
- https://github.com/OpenGenerativeAI/llm-colosseum
- https://zhiyuanhubj.github.io/MAgIC/
- https://github.com/modelscope/MCPBench
- https://mcp-universe.github.io/
- https://github.com/eval-sys/mcpmark
- https://github.com/valory-xyz/olas-predict-benchmark
- https://os-world.github.io/
- https://osworld-mcp.github.io
- https://github.com/SEC-bench/SEC-bench
- https://www.swebench.com/
- https://github.com/sierra-research/tau-bench
- https://github.com/sierra-research/tau2-bench
- https://www.tbench.ai/
- https://github.com/OSU-NLP-Group/TravelPlanner
- https://github.com/THUDM/VisualAgentBench
- https://jykoh.com/vwa
- https://webarena.dev/
- https://github.com/ServiceNow/webarena-verified
- https://github.com/InternLM/WildClawBench
- https://github.com/ServiceNow/WorkArena
