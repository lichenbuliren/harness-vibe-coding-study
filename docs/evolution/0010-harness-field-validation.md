# 0010 - Harness Field Validation

## Goal

用真实 coding-agent 执行记录初步检验 harness 是否改善任务交付，同时严格区分
Readiness 与 Effectiveness，不把产品集成测试包装成方法论有效性。

## Experiment

当前 Codex agent 在四个新建本地 Git 仓库中执行：

| Order | Task | Condition |
| --- | --- | --- |
| 1 | fresh normalization | bare |
| 2 | isomorphic fresh normalization | harness |
| 3 | interrupted unit parser | harness |
| 4 | isomorphic interrupted unit parser | bare |

fresh task 从未实现函数开始；resume task 已支持两种单位，只缺第三种单位与 trim。
每个仓库都有可执行 Node tests。bare 使用单一 `TASK.md`；harness 使用短
`AGENTS.md`、`CONTEXT.md`、canonical feature state、progress 和 `init.sh`。

同一 agent 完成全部任务，没有调用 child agent 或外部 agent。顺序在两个 task
family 间 counterbalance，但仍存在同 session 学习偏差。

## Integrity Findings

实验基础设施在正式 run 前捕获并修复了两个假阳性风险：

1. Node 24 的 `NODE_TEST_CONTEXT` 会让嵌套 `node --test` 跳过文件并 exit 0；
   verifier 现在显式移除该 runner-only 环境变量。
2. unit fixture 正则曾被双重转义，使 partial implementation 实际完全不可用；
   合同新增断言，要求 resume 起点已支持两种单位且只对缺失行为失败。

修复后重新生成全部仓库，并从 Run 1 重跑；旧临时结果作废。

## Results

四个任务都：

- 在首次 implementation edit 后通过 3/3 tests；
- correction loops 为 0；
- scope violations 为 0。

聚合操作：

| Metric | Bare total | Harness total |
| --- | ---: | ---: |
| Orientation reads | 8 | 12 |
| Verification commands | 2 | 4 |
| Changed files | 2 | 6 |
| State updates | 0 | 4 |

harness 的额外 verification 是进入时运行预期失败的 `init.sh`；额外 changed files
是完成后的 `feature_list.json` 与 `progress.md`。

记录的 elapsed time 为 bare 30,925 ms、harness 53,180 ms，但包含对话与工具
延迟，只是描述性数据，不用于速度结论。

## Observed Conclusions

### Verified completion parity

这四个小任务没有显示 harness 对成功率、首次通过或 scope control 的改善。bare
任务本身已经有清晰行为和 verifier。

### Fixed coordination cost

harness 对微小任务存在固定成本：多读入口、运行启动验证、更新状态证据。这个成本
不能因为工件“最佳实践”而被忽略。

### Durable completion state

harness 条件结束时留下 machine-readable `done` 与 passing evidence；bare 条件
只有工作代码与 Git diff，没有 durable restart state。这是被观察到的连续性能力，
但本 pilot 没有证明它降低了实际恢复成本。

## Evidence Boundary

所有结论保持 `observed`。Readiness 仍为 level 2，Doctor 的 Effectiveness 仍应
返回 `not-assessed`。

本 pilot 不支持：

- 普遍速度提升；
- 更高成功率；
- 更低恢复成本；
- 新 canonical Doctor rule；
- 更厚的 Creator 默认模板。

主要限制是同 agent、同 session、顺序学习、合成微任务和小样本。

## Product Consequence

保留当前最小产品，不新增默认 harness 工件。

理论增加一个约束：Harness 有固定协调成本，应按任务风险、规模和跨会话需求选择
最小表面。结构完整只是 Readiness；只有独立、重复、代表性任务才能支持
Effectiveness 晋级。

## Evidence

- `experiments/field-validation/fixtures.mjs` 固定四个 task conditions。
- `experiments/field-validation/runs/pilot-001.json` 保存 actions、metrics 与 SHA-256。
- `validate-results.mjs` 反算 metrics，拒绝 scope violation、缺失 run、level 3 或
  超过 `observed` 的结论。
- 4 个 field-validation contract tests 通过。
- 机器 validator 返回 `pilot-001 (4 runs, observed only)`。

## Next Research Threshold

下一轮只有满足以下条件才值得启动：

1. 独立 fresh-session agents；
2. 至少一个真实多文件、跨会话项目；
3. 重复与顺序控制；
4. 预注册成功率、纠错、恢复成本与停止条件。

在此之前，不扩充 Creator 默认表面，也不让 Doctor 声称 Effectiveness。
