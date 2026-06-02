# Harness / 操纵框架

`harness/` 描述本项目如何构建、运行、观测和评估 AI agent 的工作。

`harness/` describes how this project frames, runs, observes, and evaluates
AI-agent work.

在初始阶段，本目录以文档为主。只有在概念、适配器边界和运行记录约定明确之后，再添加可执行的 harness 代码。

In the first stage this directory is documentation-first. Add executable harness
code only after the concepts, adapter boundaries, and run-recording conventions
are clear.

## Current Notes / 当前笔记

- `foundations.md`：对 `walkinglabs/awesome-harness-engineering` 中 Foundations 模块的综合总结。
  Synthesis of the Foundations module from
  `walkinglabs/awesome-harness-engineering`.
- `context-memory.md`：上下文、记忆、压缩及工作状态策略。
  Context, memory, compaction, and working-state policy.
- `guardrails-safe-autonomy.md`：约束、沙箱边界、工具策略、注入控制及安全自主的验证关卡。
  Constraints, sandbox boundaries, tool policy, prompt-injection controls, and
  verifier gates for safe autonomy.
- `specs-agent-workflows.md`：agent 指令文件、规约生命周期、工作流状态、验证和学习捕获。
  Agent instruction files, spec lifecycle, workflow state, validation, and
  learning capture.
- `agent-learning-loop.md`：将修正、未通过的检查、评审发现和反复摩擦转化为持久项目行为的规范循环。
  Canonical loop for turning corrections, failed checks, review findings, and
  repeated friction into durable project behavior.
- `agent-orchestration-loop.md`：主 agent 与子 agent 协作、集成、生命周期关闭及证据的规范循环。
  Canonical loop for lead-agent and subagent coordination, integration,
  lifecycle closure, and evidence.
- `capability-discovery.md`：在直接执行工作前，查找已有技能、工具、插件、playbook、脚本及运行时能力的条件关。
  Conditional gate for finding existing skills, tools, plugins, playbooks,
  scripts, and runtime capabilities before doing work directly.
- `agent-delivery-contract.md`：测试、面向用户验证、提交和持久证据的最小交付循环。
  Minimum delivery loop for testing, user-facing verification, commits, and
  durable evidence.
- `evals-observability.md`：评估原语、追踪/可观测实践、基线对比、环境控制和回归关卡。
  Eval primitives, trace/observability practices, baseline comparison,
  environment control, and regression gates.
- `benchmarks.md`：基准测试分类法，以及将基准结果解释为模型-harness-环境测量值的规则。
  Benchmark taxonomy and rules for interpreting benchmark results as
  model-harness-environment measurements.
- `runtimes-reference-implementations.md`：框架/运行时/harness 的区别及参考实现的采纳标准。
  Framework/runtime/harness distinctions and adoption criteria for reference
  implementations.
- `adapters/`：本项目与外部运行时、工具或评估界面之间的适配器边界。
  Adapter boundaries between this project and external runtimes, tools, or
  evaluation surfaces.
- `runs/`：记录 harness 运行和证据的约定。
  Conventions for recording harness runs and evidence.
