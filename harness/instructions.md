# Instructions

这个子系统告诉 agent 做什么、按什么顺序做，以及做完的标准是什么。

This subsystem tells the agent what to do, in what order, and what counts as done.

## 核心理念

Agent instruction files (`AGENTS.md` / `CLAUDE.md`) 最好是一张地图，不是一本百科全书。约 100 行足够。装不下的拆到 `docs/` 让 agent 按需阅读。

如果多个指令文件同时存在（根目录、子目录、工具级），必须有明确的优先级规则。否则 agent 会猜。

## Agent File 结构

| 段落 | 内容 | 长度建议 |
|------|------|---------|
| 项目概述 | 项目目的、技术栈、运行方式 | 3-5行 |
| 启动流程 | agent 启动后先做什么（读文件、跑 init.sh） | 5-8行 |
| 工作规则 | 一次一个 feature、验证后才能 claim done | 5-10行 |
| 完成标准（Definition of Done） | 哪些条件满足才算完成 | 3-5行 |
| 验证命令 | 必跑的 test/lint/check 命令 | 3-5行 |
| 会话结束 | 关闭前要更新什么、提交什么 | 3-5行 |
| 升级路径 | 遇到架构决策、模糊需求时怎么做 | 3-5行 |

### Definition of Done

一个 feature 只有以下条件全部满足才算完成：

- [ ] 目标行为已实现
- [ ] 验证命令实际运行通过（test / lint / type-check）
- [ ] 证据记录在 feature_list.json 或 progress.md 中
- [ ] 仓库状态可从标准启动路径恢复

### 指令优先级

从高到低：

1. 任务 prompt（当前会话的直接描述）
2. 根目录 AGENTS.md（项目级规则）
3. 子目录说明文档（模块级规则）
4. 全局/工具级默认规则

多个文件冲突时，最近、最具体的规则优先。

## Spec 工作流

Spec-driven 开发不是一个大 prompt。它是一个分阶段工作流：

```text
Constitution（原则） → Specification（边界） → Clarification（澄清）
→ Plan（分解） → Implementation（实现） → Verification（验证）
→ Completion（结束）
```

Spec 可以是可丢弃的（一次性任务）或可延续的（需要下一个 session 继续）。

## 最小交付循环

对于任何有意义的修改，agent 必须在报告完成前关闭这个循环：

```text
implement → test → inspect output → verify (browser/tool)
→ commit → record evidence
```

不要因为"看起来对"就说完成。Completion 需要证据。

## 参考

- [specs-agent-workflows.md](./specs-agent-workflows.md) — 完整版 spec 工作流参考
- [agent-delivery-contract.md](./agent-delivery-contract.md) — 完整版交付标准参考
- [AGENTS.md](/AGENTS.md) — 本项目当前的 agent 指令文件
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — 课程 L03 和 L04 关于指令文件的设计
