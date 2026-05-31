# Product Project Template Shape Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the reusable template from a research-lab default into a real product project harness default.

**Architecture:** The core template should initialize harness, docs, eval, experiment, decision, and agent operating surfaces without creating a default `lab/` container. `lab/` becomes documented as a research-lab optional pack, while `frontend-react-ts` provides the first explicit product source scaffold.

**Tech Stack:** Bash template scripts, Markdown documentation, existing repository validation commands.

---

### Task 1: Lock Default Template Shape

**Files:**
- Modify: `templates/agent-first-living-lab/validate-init-template.sh`
- Modify: `templates/agent-first-living-lab/init-template.sh`
- Create: `templates/agent-first-living-lab/packs/frontend-react-ts/package.json`
- Create: `templates/agent-first-living-lab/packs/frontend-react-ts/src/App.tsx`
- Create: `templates/agent-first-living-lab/packs/frontend-react-ts/src/App.test.tsx`
- Delete: `templates/agent-first-living-lab/lab/README.md`
- Delete: `templates/agent-first-living-lab/lab/AGENTS.md`

- [ ] **Step 1: Add a failing validation for default no-lab behavior**

Add checks after the first `run_init --target-dir "$new_target"` call:

```bash
if [[ -e "$new_target/lab" ]]; then
  echo "Default product-project template must not create lab/: $new_target/lab" >&2
  exit 1
fi
```

- [ ] **Step 2: Run validation and confirm it fails**

Run:

```bash
bash templates/agent-first-living-lab/validate-init-template.sh
```

Expected: FAIL with `Default product-project template must not create lab/`.

- [ ] **Step 3: Remove `lab/` from required template files**

Remove these required files from `templates/agent-first-living-lab/init-template.sh`:

```bash
lab/README.md
lab/AGENTS.md
```

Delete the two files from the template tree.

- [ ] **Step 4: Run validation and confirm it passes**

Run:

```bash
bash templates/agent-first-living-lab/validate-init-template.sh
```

Expected: PASS with `Template initialization validation passed.`

### Task 2: Add Optional Frontend App Pack

**Files:**
- Modify: `templates/agent-first-living-lab/init-template.sh`
- Modify: `templates/agent-first-living-lab/validate-init-template.sh`
- Create: `templates/agent-first-living-lab/packs/frontend-react-ts/`

- [ ] **Step 1: Add failing validation for explicit React pack**

Assert `--app-pack frontend-react-ts` creates `package.json`, `src/App.tsx`,
and `src/App.test.tsx`, and does not leave `lab/` or `packs/` in the initialized
project.

- [ ] **Step 2: Implement app-pack support**

Teach `init-template.sh` to accept `--app-pack none|frontend-react-ts`, copy the
selected pack to the target root, replace `{{PACKAGE_NAME}}`, and remove
template-only packs from initialized projects.

- [ ] **Step 3: Run validation**

Run:

```bash
bash templates/agent-first-living-lab/validate-init-template.sh
```

Expected: PASS.

### Task 3: Update Documentation Semantics

**Files:**
- Modify: `templates/agent-first-living-lab/AGENTS.md`
- Modify: `templates/agent-first-living-lab/README.md`
- Modify: `templates/agent-first-living-lab/CONTEXT.md`
- Modify: `templates/agent-first-living-lab/TEMPLATE.md`
- Modify: `templates/agent-first-living-lab/INITIALIZE.md`
- Modify: `docs/workflows/minimum-project-template-skeleton.md`
- Modify: `docs/workflows/template-initialization-validation.md`
- Add: `docs/evolution/0033-product-project-template-shape.md`
- Modify: `docs/evolution/index.md`

- [ ] **Step 1: Update template docs**

Rewrite references that describe `lab/` as required. State that the default template is for a real product project with harness surfaces, and that source/app scaffolds are explicit packs.

- [ ] **Step 2: Update workflow docs and evolution log**

Record why the default no longer includes `lab/`, and document `lab` as a research-lab pack for methodology repositories.

- [ ] **Step 3: Verify no stale required-lab language remains**

Run:

```bash
rg -n "lab/|real validation project surface|real validation work|Do not include application source code|Do not prescribe a product stack" templates/agent-first-living-lab docs/workflows/minimum-project-template-skeleton.md docs/workflows/template-initialization-validation.md docs/evolution/0033-product-project-template-shape.md
```

Expected: Only intentional references remain, and all describe `lab/` as optional/research-lab or historical source-repo context.

### Task 4: Final Verification

**Files:**
- All modified template/docs files

- [ ] **Step 1: Run template regression**

Run:

```bash
bash templates/agent-first-living-lab/validate-init-template.sh
```

Expected: PASS.

- [ ] **Step 2: Run root structure check**

Run:

```bash
find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
```

Expected: structure includes the new evolution entry and no forbidden first-stage root directories.

- [ ] **Step 3: Check git status**

Run:

```bash
git status --short
```

Expected: only intended template/docs changes are present before commit; clean after commit.
