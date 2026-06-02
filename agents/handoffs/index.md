# Agent Handoffs / Agent 交接

本目录将存储面向未来 agent 和恢复会话的交接格式。

This directory will store handoff formats for future agents and resumed
sessions.

交接文档应保留当前目标、相关上下文、已完成工作、待办工作、验证状态和已知风险。

Handoff documents should preserve current goal, relevant context, completed
work, pending work, verification status, and known risks.

## Formats / 格式

- `subagent-task-handoff.md`：主 agent 向子 agent 委派任务的任务包及返回报告格式。
  Task packet and return report format for main-agent-to-subagent delegation.
