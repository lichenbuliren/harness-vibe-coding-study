# Tools

这个子系统定义 agent 可以使用什么工具、如何发现它们，以及如何保持上下文清洁。

This subsystem defines what tools the agent can use, how to discover them, and
how to keep context clean.

## 核心理念

工具是 agent 改变世界的唯一方式。如果 agent 连 `pip install` 都跑不了，它就没法完成任何工作。但也不要打开所有权限——遵循最小权限原则。

先在 repo 里找现有工具，再自己手写。工具发现是一个条件门：在执行新工作前，先检查是否有现有的 skill、tool、plugin、playbook 或 script 能解决当前问题。

## 工具分类

| 类别 | 操作 | 示例 |
|------|------|------|
| 读取 | 查看文件、搜索、读取输出 | `cat`, `rg`, `ls` |
| 写入 | 创建/修改文件 | `apply_patch`, `write` |
| 执行 | 运行命令、构建、测试 | `npm test`, `go build` |
| MCP | 外部服务/数据源 | 数据库、API、浏览器 |

### 渐进式披露

上下文是有限的。工具信息不应该一次全给，而应该按需分层披露：

```text
Layer 1: 不变规则（AGENTS.md — 项目范围、技术栈、验证命令）
Layer 2: 结构地图（目录结构、核心模块、数据流）
Layer 3: 深层文档（具体模块的 ARCHITECTURE.md、CONSTRAINTS.md）
Layer 4: 运行时/工具输出（命令输出、日志、trace）
```

### 工具发现门（Capability Discovery Gate）

在实现任何非平凡的代码修改前，先问自己：

1. 这个问题有没有现成的 skill/tool/plugin 能解决？
2. 有没有现成的 playbook/script/模板？
3. 如果找到，是否优先使用？

这个门避免重复发明轮子。跳过条件：非常小的改动、仓库已经有明确本地路径的场景。

## 上下文卫生

- 工具输出可以裁剪到相关部分（不要粘贴 10000 行日志要求 agent 分析）
- MCP 调用优先于手动 curl/parse 原始数据
- 不同工具的输出用分隔符区分，方便 agent 定位信息来源

## 参考

- [tools-and-context.md](./tools-and-context.md) — 完整版工具策略 + 上下文管理
- [capability-discovery.md](./capability-discovery.md) — 完整版工具发现门
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — 课程 L02 关于工具子系统的设计
