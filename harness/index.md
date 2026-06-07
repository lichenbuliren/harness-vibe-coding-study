# Harness / 操纵框架

`harness/` 定义如何构建、运行、观测和评估 AI agent 的工作。

`harness/` defines how to frame, run, observe, and evaluate AI-agent work.

---

## 如果只读一篇

从 [quick-start.md](./quick-start.md) 开始 — 最短上手路径，5 篇核心文档 + 1 个对比实验。

## 核心（5 子系统）

| 子系统 | 职责 | 入口文档 |
|--------|------|---------|
| **Instructions** | 告诉 agent 做什么、按什么顺序、完成标准 | [instructions.md](./instructions.md) |
| **Tools** | agent 用什么工具、如何发现、上下文卫生 | [tools.md](./tools.md) |
| **Environment** | 运行时环境、可重现、适配器 | [environment.md](./environment.md) |
| **State** | 会话生命周期、跨 session 持久化、安全边界 | [state.md](./state.md) |
| **Feedback** | 验证、评估框架、实验记录 | [feedback.md](./feedback.md) |

## 操作模式

跨子系统的操作模式，不在任何一个子系统内：

| 模式 | 解决的问题 |
|------|-----------|
| [agent-learning-loop.md](./agent-learning-loop.md) | 把错误和摩擦转化为项目标准 |
| [agent-orchestration-loop.md](./agent-orchestration-loop.md) | 主 agent 与子 agent 的协调与集成 |
| [multi-agent.md](./multi-agent.md) | 多 agent 并发治理、共享状态、冲突处理 |

## 落地

| 文档 | 用途 |
|------|------|
| [adoption-playbook.md](./adoption-playbook.md) | 如何在真实项目中分阶段引入 harness |

## 参考（原始学习笔记）

这些是早期研究阶段的原始文档，不在核心方法论中。需要深层背景时查阅：

- [docs/reference/awesome-harness-synthesis.md](/docs/reference/awesome-harness-synthesis.md)
- [docs/reference/primitives-taxonomy.md](/docs/reference/primitives-taxonomy.md)
- [docs/reference/benchmarks-taxonomy.md](/docs/reference/benchmarks-taxonomy.md)
- [docs/reference/runtimes-taxonomy.md](/docs/reference/runtimes-taxonomy.md)

## 记录

| 目录 | 用途 |
|------|------|
| [runs/](./runs/) | 实验运行记录（历史数据） |
| [adapters/](./adapters/) | 运行时适配器笔记 |

## 设计原则

1. **阅读顺序优先**：从 quick-start.md 开始，需要时深入子系统
2. **5 子系统是默认分类**：新发现先归到子系统，除非跨子系统才单独成篇
3. **参考内容不放在核心路径**：原始学习笔记放到 docs/reference/
4. **入口薄、深层厚**：每篇子系统文档 60-100 行，完整参考在原位
