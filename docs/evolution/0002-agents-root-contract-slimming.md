# 0002 - AGENTS Root Contract Slimming

## 阶段目标

降低根 `AGENTS.md` 的启动负担，让它重新成为短的 Agent Operating Contract，
同时保留 OMX/runtime 相关背景作为按需阅读的 Workflow Reference。

## 起点状态

- `AGENTS.md` 约 249 行、22KB。
- 根文件同时承担项目合同、OMX 生成材料、模型表、runtime 限制和 team routing
  说明。
- `CONTEXT.md` 仍缺少项目术语。

## 使用的方法论

- 使用 `$grill-with-docs` 逐步确认文档边界。
- 能从仓库判断的先查仓库：测量 `AGENTS.md` 行数，检查 docs 结构和当前状态文件。
- 将已确认术语写入 `CONTEXT.md`。
- 用 ADR 记录根合同维护边界。

## 主要决策

- `AGENTS.md` 是短的 Agent Operating Contract，不是完整手册。
- OMX 运行时、模型表、routing 细节属于 Workflow Reference。
- Generated Reference Material 不应自动拥有根合同。
- 建立 `docs/adr/0001-keep-agents-md-as-root-operating-contract.md` 记录原因。

## 产物和证据

- 精简 `AGENTS.md`。
- 新增 `docs/workflows/omx-runtime.md`。
- 新增 `docs/adr/0001-keep-agents-md-as-root-operating-contract.md`。
- 更新 `CONTEXT.md` 中的项目语言。
- 更新 README 和 docs 索引。

验证证据：

- `./init.sh` 通过。
- `node /Users/heaven/.agents/skills/harness-creator/scripts/validate-harness.mjs --target /Users/heaven/Projects/harness-vibe-coding-study --json`
  返回 overall 100。
- `AGENTS.md` 从 249 行降到 111 行。

## 可复用结论

根 agent 文件应该优化为“每次启动都必须读”的合同。长运行时细节、生成材料和
解释性内容应该下沉到按需文档，并通过 README/docs 索引可发现。

## 未解决问题

- 是否还需要把更多历史 OMX 生成细节归档到单独 reference，需要未来实际使用时再判断。

## 下一步

继续 `feat-003 - Project Context Restoration`，补齐 `CONTEXT.md` 的项目语言。
