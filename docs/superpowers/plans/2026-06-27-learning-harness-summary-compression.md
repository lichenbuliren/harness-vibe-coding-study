# Learning Harness Summary Compression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 1063-line research note with a 250-350 line, seven-section harness engineering methodology that is concise, evidence-aware, and directly applicable to this repository.

**Architecture:** Organize the document around the five harness subsystems and one end-to-end execution lifecycle. Keep only examples that define reusable repository artifacts, then close with a current-repository adoption map.

**Tech Stack:** Markdown, Mermaid, shell-based structural validation, repository lifecycle files.

---

### Task 1: Rewrite The Methodology

**Files:**
- Modify: `docs/learning-harness-summary.md`

- [x] **Step 1: Replace the twelve-section outline**

Rewrite the document with exactly these numbered top-level sections:

```text
1. Harness 解决什么问题
2. 五个核心子系统
3. 让仓库成为唯一事实来源
4. 用单一功能驱动执行
5. 用反馈闭环定义完成
6. 保持跨会话连续
7. 最小落地路径
```

- [x] **Step 2: Preserve the core conceptual model**

Define Instructions, Tools, Environment, State, and Feedback. Explain each
subsystem through its responsibility, minimum artifact, and failure signal.

- [x] **Step 3: Consolidate the execution lifecycle**

Add one Mermaid diagram covering:

```text
初始化 -> 读取状态 -> 选择一个功能 -> 实现 -> 分层验证
        -> 记录证据 -> 清洁交接 -> 下一会话
```

- [x] **Step 4: Keep four reusable examples**

Include compact examples for:

```text
AGENTS.md entrypoint
feature_list.json item
layered verification commands
session startup and exit checklist
```

- [x] **Step 5: Add the repository mapping**

State that this repository already has `AGENTS.md`, `feature_list.json`,
`progress.md`, `session-handoff.md`, `init.sh`, and `docs/evolution/`.

Identify the remaining gaps:

```text
Complete CONTEXT.md
Add behavior-specific verification to feature entries
Distinguish structural validation from behavior validation
Keep lifecycle evidence current
```

### Task 2: Validate The Rewrite

**Files:**
- Test: `docs/learning-harness-summary.md`

- [x] **Step 1: Check the target length**

Run:

```bash
wc -l docs/learning-harness-summary.md
```

Expected: a line count from 250 through 350.

- [x] **Step 2: Check the numbered outline**

Run:

```bash
rg '^## [1-7]\\.' docs/learning-harness-summary.md
```

Expected: exactly seven matches, in numeric order.

- [x] **Step 3: Check fenced Markdown**

Run:

```bash
awk '/^```/{count++} END{print count}' docs/learning-harness-summary.md
```

Expected: an even number.

- [x] **Step 4: Check repository artifact paths**

Run:

```bash
for path in AGENTS.md feature_list.json progress.md session-handoff.md init.sh docs/evolution; do
  test -e "$path" || exit 1
done
```

Expected: exit status 0.

- [x] **Step 5: Check formatting**

Run:

```bash
git diff --check
```

Expected: no output and exit status 0.

### Task 3: Record The Durable Outcome

**Files:**
- Modify: `feature_list.json`
- Modify: `progress.md`
- Modify: `session-handoff.md`
- Create: `docs/evolution/0003-learning-harness-summary-compression.md`

- [x] **Step 1: Add a completed feature**

Add `feat-007` describing the learning-harness summary compression. Record the
final line count, seven-section outline, and successful `./init.sh` result as
evidence.

- [x] **Step 2: Update session continuity**

Record the compressed methodology, validation evidence, and unchanged next
feature (`feat-003`) in `progress.md` and `session-handoff.md`.

- [x] **Step 3: Add the evolution record**

Document the starting problem, chosen five-subsystem plus lifecycle structure,
removed repetition, verification evidence, reusable conclusion, and next step.

- [x] **Step 4: Run repository verification**

Run:

```bash
./init.sh
```

Expected: `=== Verification Complete ===`.

- [x] **Step 5: Run final diff checks**

Run:

```bash
git diff --check
git status --short
```

Expected: no formatting errors; only the planned documentation and state files
are modified or added.
