# 0009 - Harness Product Integration

## Goal

把仓库内已验证的 Creator、Doctor 和 shared core 组合成一个可独立运行的 Codex
plugin，并从打包路径验证初始化、Context 补全、诊断、恢复、非标准项目与冲突流程。

## Starting State

两个 skill 已分别通过合同测试，但其脚本仍通过
`../../../packages/harness-core/` 引用本仓库源码。直接复制任一 skill 到其他环境会
丢失运行时依赖。

仓库已有常规与非标准 fixture，却尚未证明两个产品在分发形态下共享同一结论。

## Product Shape

新增命令：

```text
node scripts/package-harness-plugin.mjs \
  --output <path>/harness-engineering
```

它从三个 canonical source 生成：

```text
harness-engineering/
  .codex-plugin/plugin.json
  skills/harness-creator/
  skills/harness-doctor/
  runtime/harness-core/
```

产物包含 25 个文件、两个 skill 和唯一一份 core。只有复制后的 skill import 会从
repository path 改写为 plugin runtime path；源文件不变，生成产物也不作为第二份
可编辑源码提交。

## Safety

输出目录必须：

- 名为 `harness-engineering`；
- 尚不存在；
- 由调用者明确选择。

Packager 在同级 staging 目录完成复制、import closure 检查、manifest 检查和
SHA-256 摘要，然后一次 rename 发布。失败会删除 staging，不留下半成品。

没有 force、overwrite、merge、install、network、marketplace 或自动安装接口。
并发 packager 争用同一路径时，测试证明恰好一个成功，另一个失败，最终产物完整。

## Plugin Contract

`.codex-plugin/plugin.json` 使用 strict semver、真实作者与界面元数据，并只声明
`./skills/`。本产品没有 App、MCP server、Hook、asset 或 marketplace entry，因此
manifest 不虚构这些能力。

本机 system Python 与 Codex bundled Python 均未直接暴露 `PyYAML`。官方 plugin
validator 和 skill validator 因此通过已有的 offline `uv --with pyyaml` 环境运行，
没有修改项目依赖。

## Workflow Evidence

所有集成命令从 `/tmp/.../harness-engineering` 启动，不引用仓库 skill 路径：

- 常规 Node fixture：Creator plan 零写入，apply 后 Readiness 为
  `1/2/2/2/2`，Instructions 是唯一 bottleneck。
- 项目所有者补齐六类真实 Context 并完成 bootstrap feature 后，Doctor 返回
  `2/2/2/2/2`，无 bottleneck。
- 完成后的 Creator plan 连续运行稳定且全部 `skip`。
- manifest-declared non-standard fixture 保持 `2/2/2/2/2`，Creator 全部
  `skip`。
- 空 `AGENTS.md` conflict 会产生 blocked plan；apply exit `2` 且 tree digest
  不变。
- Doctor 与 plan 均保持只读；Effectiveness 始终为 `not-assessed`。

## Validation Evidence

- 12 个 product contract、packaging 与 integration tests 通过。
- 官方 `validate_plugin.py` 验证生成 plugin 通过。
- 官方 `quick_validate.py` 验证两个 packaged skills 均通过。
- 两次独立打包得到相同有序文件路径与 SHA-256 摘要。
- 产物不包含 source tests、仓库文档、repository core import 或仓库绝对路径。

## Reusable Conclusion

可分发产品不应通过复制来建立第二份 source of truth。把 import adaptation 限制在
可重复生成的分发边界，可以同时保留仓库开发结构和独立运行结构。

Creator 与 Doctor 的闭环不是“生成后得到满分”，而是：

```text
inspect -> plan -> apply -> owner restores facts -> diagnose -> resume
```

其中 Readiness 只描述 harness 是否可操作，不能替代真实编码任务的
Effectiveness 证据。

## Remaining Risk

当前证据证明分发和流程一致性，不证明 harness 改善了真实任务成功率、纠错次数或
重启成本。level 3 与 Effectiveness 继续保留给 `feat-012`。

## Next Step

执行 `feat-012 - Harness Field Validation`：设计受控的代表性 coding-agent
before/after 任务，分别记录 Readiness 与 Effectiveness，避免把 fixture 自洽误当成
方法论有效。
