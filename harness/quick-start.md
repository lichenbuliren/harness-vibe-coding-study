# Quick Start

开始使用 harness 的最短路径。五篇核心文档，一个实验设计，三个运行时文件。

The shortest path to start using a harness. Five core docs, one experiment
design, and three runtime files.

---

## 阅读顺序

开工前读这 5 篇就够了：

```text
1. instructions.md   → 告诉 agent 做什么、标准是什么
2. tools.md          → agent 能用什么工具
3. environment.md    → 项目在什么环境里跑
4. state.md          → 怎么管理会话和上下文
5. feedback.md       → 怎么验证和评估结果
```

每篇约 60-100 行，30 分钟可读完。

剩下的文档在用例出现时再读：

| 场景 | 去读 |
|------|------|
| 需要方法论的完整方法论 | `harness/index.md` |
| 想了解原始学习笔记 | `docs/reference/` |
| 阅读 agent 应该如何学习错误 | `harness/agent-learning-loop.md` |
| 在多 agent 场景下的协调 | `harness/agent-orchestration-loop.md` |
| 多 agent 并发治理 | `harness/multi-agent.md` |
| 如何在新团队落地方法论 | `harness/adoption-playbook.md` |

## 三样核心运行时文件

```text
project/
├── init.sh              → agent 启动时先跑：install → lint → test → build
├── feature_list.json    → scope 控制：每个 feature 带 id、状态、依赖、evidence
├── session-handoff.md   → 大幅修改后留的结构化 handoff
├── AGENTS.md            → agent 指令入口
└── CONTEXT.md           → 项目上下文和假设
```

`init.sh` 和 `feature_list.json` 在 `templates/agent-first-living-lab/` 中有模板。

## 快速验证：做一个 P01 对比实验

想证明这套方法论真的有效？做这个 2 小时的实验：

**步骤**

1. 选一个中等复杂度的任务（如"添加一个 CRUD 接口"或"实现一个 UI 组件"）
2. **对比组**：空仓库 + 一句话 prompt → 记录时间和完成度
3. **实验组**：同仓库 + AGENTS.md + init.sh + feature_list.json → 同样任务
4. 对比两组结果：

| 指标 | 对比组 | 实验组 |
|------|--------|--------|
| 完成时间 | | |
| feature 完成数/总数 | | |
| 校正轮数 | | |
| session 数 | | |
| 测试通过率 | | |

这个实验设计来自 [learn-harness-engineering Project 01](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-01)。

## 也有自动化评估

在模板项目中跑：

```bash
node scripts/validate-harness.mjs --target .
```

这个脚本扫描 5 个子系统并打分（每个 0-20，总分 100）。分数低就说明哪个子系统最需要加强。

---

**核心原则**：模型没换，换的是 harness。如果第一次实验提升低于 30%，说明你已经做得不错了——那就可以继续往下优化。
