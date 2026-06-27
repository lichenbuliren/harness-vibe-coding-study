# Evolution / 项目演进记录

本目录用于记录 `Harness Vibe Coding Study` 的阶段性演进。

这里不是 changelog。每一篇记录都应该帮助未来复盘者理解：当时为什么进入这个
阶段，用了什么方法论，产出了什么证据，形成了哪些可复用结论，以及下一步应该
从哪里继续。

## 建议记录结构

每个阶段记录建议包含：

- 阶段目标
- 起点状态
- 使用的方法论或 agent 工作流
- 关键问题
- 主要决策
- 产物和证据
- 可复用结论
- 未解决问题
- 下一步

## 当前状态

当前目录刚建立，后续阶段性成果应持续写入这里。README 只保留总览和导航，
详细复盘沉淀在本目录中。

## 记录列表

- [`0001-harness-lifecycle-bootstrap.md`](0001-harness-lifecycle-bootstrap.md)：将
  `harness-creator` 生命周期五件套改写并验证为当前项目的 restartable harness。
- [`0002-agents-root-contract-slimming.md`](0002-agents-root-contract-slimming.md)：将
  根 `AGENTS.md` 精简为短操作合同，并把 OMX 细节下沉到 workflow reference。
- [`0003-learning-harness-summary-compression.md`](0003-learning-harness-summary-compression.md)：
  将长研究笔记压缩为五子系统模型和一条执行生命周期。
- [`0004-project-context-restoration.md`](0004-project-context-restoration.md)：
  补齐长期项目上下文，并统一 creator/doctor 的理论与产品边界。
- [`0005-template-boundary-review.md`](0005-template-boundary-review.md)：
  划分 shared core、creator、doctor 与项目事实的可复用边界。
- [`0006-shared-harness-contract-core.md`](0006-shared-harness-contract-core.md)：
  实现确定性 shared core，并将本仓库迁移为 canonical feature contract。
- [`0007-harness-doctor-skill.md`](0007-harness-doctor-skill.md)：
  实现只读 Doctor skill，并验证 canonical JSON 与三种人类可读报告。
- [`0008-harness-creator-skill.md`](0008-harness-creator-skill.md)：
  实现 plan-bound Creator，并把 Context 缺口转化为真实 bootstrap feature。
- [`0009-harness-product-integration.md`](0009-harness-product-integration.md)：
  将 Creator、Doctor 与唯一 shared core 打包为可独立验证的 Codex plugin。
