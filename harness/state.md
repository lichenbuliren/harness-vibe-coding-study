# State

这个子系统管理 agent 的上下文、会话生命周期、跨 session 持久化，以及安全边界。

This subsystem manages context, session lifecycle, cross-session persistence,
and safety boundaries.

## 核心理念

Context 窗口是有限的。128K、200K 还是 1M 都一样——复杂任务终究会耗尽。解决方案不是更大的窗口，而是把关键状态写入**文件**。

```text
Session 1              Session 2
    |                      |
    v                      v
  Work ---> PROGRESS.md ---> Read progress
  Decisions -> DECISIONS.md -> Pick up where left off
  Tests result -> feature_list.json -> Know what's done
  Git commit -> commit hash -> Exact repo state
```

## 会话生命周期

一个 agent session 应该遵循结构化生命周期，不是自由发挥：

```text
START
  1. 读 AGENTS.md → 项目指引
  2. 跑 init.sh → 验证环境健康
  3. 读 feature_list.json → 当前状态
  4. 读 progress.md → 上次进展

SELECT
  5. 选一个未完成的 feature

EXECUTE
  6. 实现该 feature
  7. 跑验证 (lint → test → type-check)
  8. 如果失败：修复并重跑
  9. 如果通过：记录证据

CLOSE
  10. 更新 progress.md
  11. 更新 feature_list.json
  12. 记录未解决的问题
  13. 提交（只在安全状态下）
  14. 留下干净的恢复路径
```

### 检查点

- 每个 feature 一个 commit
- commit 前所有验证通过
- commit message 说清楚为什么（不是改了什么）

### Handoff

跨 session 恢复必须依赖文件，不能依赖 agent 的记忆：

| 文件 | 用途 |
|------|------|
| feature_list.json | 当前 feature 状态（not-started / in-progress / done） |
| progress.md | 完成记录 + 阻塞项 |
| session-handoff.md | 大幅修改后的结构化工件：变更文件、决策、风险 |
| git commit | 精确的可恢复状态点 |

## 记忆类型

| 类型 | 存储位置 | 存活期 |
|------|---------|--------|
| 工作状态 | progress.md | 当前 session |
| 持久知识 | CONTEXT.md, decisions/ | 无限 |
| 结果证据 | runs/, evolution/ | 无限 |
| 临时上下文 | 对话历史 | 当前 session |

## 安全边界

- 不要禁用 agent 的 shell 访问——跑不了 `pip install` 就做不了事
- 但遵循最小权限：只给完成任务所需的工具
- 环境状态必须是自描述的：`pyproject.toml`、`.nvmrc`、`.python-version`
- 验证是安全边界的最后一道防线：只有通过的测试才算数

### 沙箱概念

如果有隔离需求：

| 层级 | 隔离程度 | 适用场景 |
|------|---------|---------|
| Git branch | 代码隔离 | 单 agent 的 feature 分支 |
| Git worktree | 工作目录隔离 | 多 agent 并行 |
| Docker | 环境隔离 | 不可信代码执行 |
| VM | 完全隔离 | 高风险场景 |

大多数 agent 任务只需要 git branch 级别的隔离。

## 参考

- [context-memory.md](./context-memory.md) — 完整上下文/记忆策略
- [session-lifecycle.md](./session-lifecycle.md) — 完整会话生命周期
- [guardrails-safe-autonomy.md](./guardrails-safe-autonomy.md) — 完整安全边界
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — 课程 L03、L05、L06
