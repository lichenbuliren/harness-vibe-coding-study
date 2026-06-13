# Harness Vibe Coding Study

一个用于复盘 agent-first 工作方式、harness 方法论和真实项目验证过程的
living lab。

这个仓库的重点不是先做出一个完整产品，而是记录一个项目如何在 AI agent
参与下逐步成形：问题如何被澄清，方法论如何被沉淀，工作协议如何被验证，
以及哪些经验最终值得抽取成可复用模板。

## 当前状态

当前仓库处于复盘入口与方法论骨架整理阶段。核心价值不在已有代码量，而在逐步
建立一套能被未来的自己和 agent 重新进入的项目记忆：

- 这个项目为什么存在
- 每个阶段解决了什么问题
- 使用了哪些 agent 工作方式和验证方法
- 哪些产物是阶段性结论，哪些还只是待验证假设
- 哪些结构未来可以抽取成 template、playbook、standard 或 skill

## 如何阅读这个仓库

从这里开始：

- [`CONTEXT.md`](CONTEXT.md)：项目长期上下文入口，目前待补齐。
- [`AGENTS.md`](AGENTS.md)：agent 在本仓库工作的操作契约。
- [`docs/`](docs/)：方法论、工具说明和演进记录。
- [`docs/evolution/`](docs/evolution/)：阶段性复盘入口。
- [`docs/tools/`](docs/tools/)：支持本项目的工具和 skill 说明。
- [`templates/`](templates/)：从已验证项目证据中抽取的可复用骨架。

## 演进记录

本项目的阶段性成果应该沉淀到 [`docs/evolution/`](docs/evolution/)。
演进记录不是普通 changelog，而是未来复盘时恢复思路的证据面。每个阶段应尽量
回答：

- 当时的目标是什么
- 使用了什么方法论或 agent 工作流
- 关键问题和分歧是什么
- 最终形成了哪些产物
- 哪些结论可以复用，哪些仍需验证
- 下一阶段应该从哪里继续

## 当前工作重点

短期目标是把仓库从空骨架整理成一个可复盘、可继续、可验证的项目入口：

- 补齐 README 和 `CONTEXT.md` 的项目定位
- 建立 `docs/evolution/` 的阶段记录习惯
- 保持 `templates/` 精简，只抽取经过验证的结构
- 让 agent 能通过现有文档快速理解当前阶段和下一步

## 写作约定

README 面向未来复盘的自己，中文为主；路径、工具名和关键概念保留英文。详细
叙事放入 `docs/evolution/`，具体工具说明放入 `docs/tools/`，模板边界放入
`templates/`。
