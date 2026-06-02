# Tools / 工具

本目录存储支持 harness + vibe coding 工作的工具说明。

This directory stores notes about tools that support harness + vibe coding work.

## Current Notes / 当前说明

- `grill-me.md`：Matt Pocock 技能集合的说明。
  Notes for the Matt Pocock skills collection.
- `superpowers.md`：Superpowers 插件和头脑风暴工作流的说明。
  Notes for the Superpowers plugin and brainstorming workflow.

工具说明应解释该工具为何对本项目重要、如何安装或启用、以及 agent 应在何时使用它。

Tool notes should explain why a tool matters to this project, how to install or
enable it, and when an agent should use it.

在搜索或推荐新的技能、插件、工具、操作手册、脚本或运行时能力之前，请先使用 `../../harness/capability-discovery.md`。

Use `../../harness/capability-discovery.md` before searching for or recommending
new skills, plugins, tools, playbooks, scripts, or runtime capabilities.

当标准捕获任务依赖某个可选技能时，agent 应首先检查该技能是否可用。如果缺失，agent 应告知用户如何安装它，并使用最接近的轻量级替代方案继续。

When a standard-capture task depends on an optional skill, the agent should
first check whether that skill is available. If it is missing, the agent should
tell the user how to install it and continue with the closest lightweight
fallback.
