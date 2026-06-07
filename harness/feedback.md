# Feedback

这个子系统定义 agent 如何验证自己的工作、如何评估结果，以及如何记录实验证据。

This subsystem defines how the agent verifies its own work, evaluates results,
and records experimental evidence.

## 核心理念

验证是 harness 里投入最小、回报最高的子系统。只要列出明确的验证命令（`pytest tests/ -x && mypy src/ --strict`），agent 从"感觉对了就算完成"变成"测试通过了才算完成"。

## 验证类型

| 类型 | 定义 | 示例 |
|------|------|------|
| 确定性检查 | 机械的、自动的、可重现的 | `pytest`, `mypy --strict`, `eslint` |
| 推理式检查 | 需判断、评审、人工确认 | 架构评审、UI 视觉检查、安全审计 |

### 按风险分级的验证

| 风险 | 要求的验证 | 示例 |
|------|-----------|------|
| 低（formatting、重命名） | lint + type-check | `eslint --fix`, `mypy` |
| 中（功能变更） | 确定性检查 + 单元测试 | `pytest`, `npm test` |
| 高（架构变更、安全） | 确定性 + 推理式 + 人工审批 | 以上 + architecture review |

## 评估框架

### 评估原语

```text
Task → Run → Trace → Grade → Diagnose → Change → Regression Gate
```

每次评估实验记录结构：

- **Task**: 任务描述和验收标准
- **Run**: 实际执行过程（用了什么模型、什么配置）
- **Trace**: 执行过程中的关键事件和决策
- **Grade**: 对结果的评分
- **Diagnose**: 失败归因（属于哪个子系统层）
- **Change**: 针对归因的改进
- **Regression Gate**: 验证改进没有引入新问题

### 实验记录（Run Record）

每次有意义的实验后，记录在 `harness/runs/` 下：

| 字段 | 内容 |
|------|------|
| Task | 任务描述 + 验收标准 |
| Setup | 模型、工具、配置 |
| Process | 关键事件和决策 |
| Outcome | 成功/失败 + 评分 |
| Diagnosis | 失败归因 |
| Evidence | 测试输出、截图、日志 |

记录不是为了写文档——是为了让下一次改进有基线可对比。

### 回归门

每次变更后必须回答：

1. 之前通过的测试是否仍然通过？
2. 之前修复的 bug 是否仍然修复？
3. 之前测量的性能基线是否没有退化？

如果以上任何一个是"否"，则变更不能通过。

## 参考

- [verification.md](./verification.md) — 完整验证分类和关卡设计
- [evals-observability.md](./evals-observability.md) — 完整评估框架和可观测性
- [runs/run-record-schema.md](./runs/run-record-schema.md) — 实验记录格式规范
- [learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering) — 课程 L09、L10
