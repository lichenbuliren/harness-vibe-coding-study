# 0001 - Harness Lifecycle Bootstrap

## 阶段目标

把 `harness-creator` 生成的通用五件套吸收到本项目中，让未来 session 可以从
明确的 feature 状态、进度日志、交接记录和启动验证脚本恢复上下文。

## 起点状态

- README 和 `docs/evolution/index.md` 已作为未来复盘入口建立。
- 仓库已有大型 `AGENTS.md` 操作契约，不能被通用模板覆盖。
- `feature_list.json`、`progress.md`、`session-handoff.md` 和 `init.sh`
  尚不存在。
- `harness-creator` 结构验证初始得分为 32/100，主要瓶颈是 state、scope 和
  lifecycle。

## 使用的方法论

- 先在独立模板项目 `/Users/heaven/Projects/harness-template` 中检查生成物。
- 把生成物作为参考，而不是直接复制。
- 保留当前项目的 `AGENTS.md`，只追加项目生命周期入口。
- 用 `./init.sh` 和 `harness-creator` 结构验证作为完成证据。

## 主要决策

- 不覆盖现有 `AGENTS.md`。
- `feature_list.json` 记录当前学习项目的真实 feature，而不是保留模板占位项。
- `progress.md` 作为 session 连续性日志。
- `session-handoff.md` 作为可恢复交接面。
- `init.sh` 做真实路径和 JSON 结构检查，不使用模板里的 placeholder echo。

## 产物和证据

- 新增 `feature_list.json`
- 新增 `progress.md`
- 新增 `session-handoff.md`
- 新增 `init.sh`
- 更新 `AGENTS.md`
- 更新 `README.md`
- 更新 `docs/index.md`

验证证据：

- `./init.sh` 通过。
- `node /Users/heaven/.agents/skills/harness-creator/scripts/validate-harness.mjs --target /Users/heaven/Projects/harness-vibe-coding-study --json`
  返回 overall 100。

## 可复用结论

通用 harness 生成物适合作为结构参考，但迁移到已有项目时应先保护本地事实：

- 已存在的 agent 契约优先于模板契约。
- 状态文件必须改写成当前项目的真实 feature。
- 验证脚本必须检查真实入口，不能只保留 placeholder。

## 未解决问题

- `CONTEXT.md` 仍待补齐。
- `templates/` 中哪些生命周期文件应进入可复用模板，还需要单独评审。

## 下一步

继续 `feat-003 - Project Context Restoration`，补齐 `CONTEXT.md`。
