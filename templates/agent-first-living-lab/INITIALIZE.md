# Initialize This Template

Use this guide after copying `templates/agent-first-living-lab/` into a new
project.

## Fast Path

From the source template directory, prefer the safe target-directory path:

```sh
bash init-template.sh \
  --target-dir "../my-product-project" \
  --project-name "My Project" \
  --project-intent "Explore an agent-first workflow for ..." \
  --current-phase "Initialization" \
  --date "YYYY-MM-DD" \
  --working-assumption "Agents need durable context before implementation" \
  --non-goal "Do not add app code before a source pack or implementation plan" \
  --alternative "Start with product code first"
```

`--target-dir` creates the target directory when it does not exist. If the
target directory already exists and is not empty, initialization stops before
copying or modifying files.

By default, initialization creates only the harness core. It does not create
`lab/`, `src/`, or `package.json`.

To initialize a React + TypeScript product project, add:

```sh
--app-pack frontend-react-ts
```

That pack creates root-level `package.json`, `src/`, Vite, TypeScript, ESLint,
and Vitest starter files. The template pack directory is removed from the
initialized project after the selected pack is applied.

If you already copied the template into a fresh project directory, run from that
new project root:

```sh
bash init-template.sh \
  --project-name "My Project" \
  --project-intent "Explore an agent-first workflow for ..." \
  --current-phase "Initialization" \
  --date "YYYY-MM-DD" \
  --working-assumption "Agents need durable context before implementation" \
  --non-goal "Do not add app code before a source pack or implementation plan" \
  --alternative "Start with product code first"
```

Then inspect:

```sh
git diff -- README.md CONTEXT.md decisions/0001-adopt-agent-first-living-lab.md
find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
```

Before changing this template helper, run its validation script from the source
template directory:

```sh
bash validate-init-template.sh
```

## What The Script Does

`init-template.sh` can either copy the template into a safe target directory or
initialize the current copied template root.

It rejects:

- non-empty target directories
- target directories inside the source template
- execution from a directory that does not look like the template root

After the safety checks, it replaces the core project placeholders in:

- `README.md`
- `CONTEXT.md`
- `decisions/0001-adopt-agent-first-living-lab.md`
- `TEMPLATE.md`

It also checks that the required skeleton files exist.

It is a thin helper, not a full generator. It does not install dependencies or
claim the template is a published package. It can copy a selected source
scaffold pack, but it does not run package-manager commands.

It does not replace placeholders inside blank templates such as:

- `harness/runs/run-record-template.md`
- `docs/evolution/evolution-entry-template.md`
- `experiments/reports/experiment-report-template.md`
- `decisions/decision-record-template.md`

Those placeholders should remain for future records.

## First Project-Specific Records

Create records only after real work happens.

Recommended first records:

- first decision: keep or edit `decisions/0001-adopt-agent-first-living-lab.md`
- first run record: copy `harness/runs/run-record-template.md`
- first evolution entry: copy `docs/evolution/evolution-entry-template.md`
- first experiment report: copy `experiments/reports/experiment-report-template.md`

## Completion Check

Before the initialization is complete:

- no core project placeholders remain in `README.md`, `CONTEXT.md`, or the
  initial ADR
- every required file listed by the template exists
- optional app packs are not added unless selected explicitly
- blank record templates still contain placeholders for future records
- no app, framework, mobile, or runtime-specific defaults were added by accident
  when `--app-pack` is omitted
- the work is committed with a message explaining why the template was adopted
