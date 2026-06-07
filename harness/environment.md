# Environment

这个子系统定义 agent 在什么环境中运行、如何保证环境可重现，以及如何适配不同运行时。

This subsystem defines the runtime environment, reproducibility guarantees, and
runtime adapter patterns.

## 核心理念

三个概念必须分清楚：

| 概念 | 含义 | 示例 |
|------|------|------|
| **Framework** | 构建 agent 应用的抽象层 | LangChain, Vercel AI SDK |
| **Runtime** | 持久执行基础设施 | Codex CLI, Claude Code, Cursor |
| **Harness** | agent 周围的操作系统（指令、工具、验证、状态） | 本篇文档所在的方法论 |

Hybrid 工具是常态（比如 Codex Desktop 同时是运行时和宿主），但这个区分能防止一个常见错误：选了一个 framework 就以为 runtime 和 harness 问题都解决了。

## 环境可重现

- `package.json` / `pyproject.toml` — 锁依赖版本
- `.nvmrc` / `.python-version` / `.node-version` — 指定运行时版本
- `init.sh` — 标准初始化 + 验证路径（一次命令跑完 install → lint → test → build）

## 运行时适配

同一个方法论在不同运行时上需要不同的适配。以下是已验证的两种：

### Codex Desktop

本地桌面应用，提供：
- 会话持久化和上下文压缩
- 文件系统访问（读写）
- Shell 执行（`exec_command`）
- MCP 服务集成
- 内嵌浏览器用于本地验证
- 工具/插件/技能系统

**关键限制**：没有 OMX CLI 的 tmux 团队编排、没有 `omx question` 结构化提问。
在这些场景下，改用 native structured input 或直接提一个精确的问题。

### MCP 兼容运行时

任何实现 MCP 传输规范的运行时（Codex CLI、Claude Code、Cursor）都可以用同一套方法论。
差异主要在：工具表面（哪些 MCP 服务可用）、状态管理机制、和验证方式。

适配方法：从 `harness/adapters/` 复制对应运行时的适配笔记作为起点。

## 运行时选择指南

| 场景 | 推荐运行时 |
|------|----------|
| 团队协作、长期任务 | Codex CLI + OMX 团队模式 |
| 单次快速验证 | Codex Desktop |
| IDE 集成 | Cursor |
| Claude 生态 | Claude Code |

## 参考

- [runtimes-reference-implementations.md](./runtimes-reference-implementations.md) — 完整运行时参考
- [adapters/codex-desktop.md](./adapters/codex-desktop.md) — Codex Desktop 适配器
- [adapters/mcp-runtime.md](./adapters/mcp-runtime.md) — MCP 运行时适配器
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — 课程 L02 关于环境子系统的设计
