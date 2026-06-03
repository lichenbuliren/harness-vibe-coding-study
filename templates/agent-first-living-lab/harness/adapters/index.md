# Harness Adapters / Harness 适配器

本目录将描述项目与外部 agent 运行时、工具或评估界面之间的适配器边界。

This directory will describe adapter boundaries between the project and external
agent runtimes, tools, or evaluation surfaces.

适配器说明应解释它连接什么系统、通过边界的输入和输出是什么、以及它能捕获什么证据。

An adapter note should explain what system it connects to, what inputs and
outputs pass through the boundary, and what evidence it can capture.

## Current Adapters / 当前适配器

- `codex-desktop.md`：Codex Desktop 应用适配器。
  Maps the harness methodology to Codex Desktop's context model, tool surface, state management, and verification capabilities.
- `mcp-runtime.md`：通用 MCP 运行时适配器。
  Maps the harness methodology to any MCP-compatible runtime (Codex CLI, Claude Code, Cursor, custom MCP hosts).
