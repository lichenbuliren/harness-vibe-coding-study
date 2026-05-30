# Dinner Picker Lab MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first lab validation project: a mobile-first React + TypeScript dinner picker app with local persistence and random dish selection.

**Architecture:** The app lives under `lab/dinner-picker`. Domain logic is kept in `src/lib/dishes.ts`, persistence in `src/lib/storage.ts`, UI primitives in `src/components/ui.tsx`, and the application shell in `src/App.tsx`. Lab evidence is recorded outside the app through a run record, experiment report, and evolution entry.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, lucide-react, Vitest, localStorage.

---

### Task 1: Scaffold The React Lab App

**Files:**
- Create: `lab/dinner-picker/package.json`
- Create: `lab/dinner-picker/index.html`
- Create: `lab/dinner-picker/tsconfig.json`
- Create: `lab/dinner-picker/tsconfig.node.json`
- Create: `lab/dinner-picker/vite.config.ts`
- Create: `lab/dinner-picker/postcss.config.js`
- Create: `lab/dinner-picker/tailwind.config.ts`
- Create: `lab/dinner-picker/src/main.tsx`
- Create: `lab/dinner-picker/src/App.tsx`
- Create: `lab/dinner-picker/src/index.css`
- Create: `lab/dinner-picker/src/vite-env.d.ts`
- Modify: `lab/README.md`

- [ ] **Step 1: Create a Vite React TypeScript project under `lab/dinner-picker`**

Run:

```bash
npm create vite@latest lab/dinner-picker -- --template react-ts
```

Expected: Vite creates the React TypeScript project.

- [ ] **Step 2: Install required dependencies**

Run:

```bash
cd lab/dinner-picker && npm install && npm install -D tailwindcss postcss autoprefixer vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom && npm install lucide-react
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Initialize Tailwind config**

Run:

```bash
cd lab/dinner-picker && npx tailwindcss init -p
```

Expected: Tailwind and PostCSS config files exist.

- [ ] **Step 4: Update `lab/README.md` to name the lab project**

Write that the first lab project is Dinner Picker and that it validates run records, local evals, mobile-first React work, and experiment reporting.

### Task 2: Add Domain Logic And Tests

**Files:**
- Create: `lab/dinner-picker/src/lib/dishes.ts`
- Create: `lab/dinner-picker/src/lib/dishes.test.ts`

- [ ] **Step 1: Define dish types and helpers**

Create a `Dish` type with `id`, `name`, `tag`, and `createdAt`. Add helpers for creating a dish, normalizing names, and picking a random dish by injected random number.

- [ ] **Step 2: Test name normalization and random picking**

Run:

```bash
cd lab/dinner-picker && npm test -- --run src/lib/dishes.test.ts
```

Expected: tests pass.

### Task 3: Add Local Storage Persistence And Tests

**Files:**
- Create: `lab/dinner-picker/src/lib/storage.ts`
- Create: `lab/dinner-picker/src/lib/storage.test.ts`

- [ ] **Step 1: Implement typed storage helpers**

Persist dishes and the latest pick in `localStorage` with defensive parsing and safe fallbacks.

- [ ] **Step 2: Test save/load behavior**

Run:

```bash
cd lab/dinner-picker && npm test -- --run src/lib/storage.test.ts
```

Expected: tests pass.

### Task 4: Build The Mobile-First UI

**Files:**
- Create: `lab/dinner-picker/src/components/ui.tsx`
- Modify: `lab/dinner-picker/src/App.tsx`
- Modify: `lab/dinner-picker/src/index.css`
- Modify: `lab/dinner-picker/tailwind.config.ts`

- [ ] **Step 1: Add small local UI primitives**

Create reusable `Button`, `Input`, `TagSelect`, and `DishCard` primitives.

- [ ] **Step 2: Implement app behavior**

Implement add dish, delete dish, tag selection, random pick, empty state, and localStorage hydration.

- [ ] **Step 3: Style for mobile-first use**

Use a compact responsive layout, thumb-friendly controls, and a playful draw-card visual direction.

### Task 5: Add App-Level Tests And Build Verification

**Files:**
- Create: `lab/dinner-picker/src/App.test.tsx`
- Modify: `lab/dinner-picker/package.json`

- [ ] **Step 1: Add interaction tests**

Test empty state, adding a dish, random recommendation, and deleting a dish.

- [ ] **Step 2: Run full verification**

Run:

```bash
cd lab/dinner-picker && npm test -- --run && npm run build
```

Expected: tests and production build pass.

### Task 6: Browser And Mobile Verification

**Files:**
- No source files expected unless verification finds a layout bug.

- [ ] **Step 1: Start Vite server on LAN**

Run:

```bash
cd lab/dinner-picker && npm run dev -- --host 0.0.0.0
```

Expected: Vite reports local and network URLs.

- [ ] **Step 2: Verify the app in browser/mobile viewport**

Check that the core flow works and that the page fits small mobile widths.

### Task 7: Record Lab Evidence

**Files:**
- Create: `harness/runs/2026-05-30-dinner-picker-mvp.md`
- Create: `experiments/reports/2026-05-30-dinner-picker-mvp.md`
- Create: `docs/evolution/0011-first-lab-project-dinner-picker.md`
- Modify: `docs/evolution/index.md`
- Modify: `CONTEXT.md`

- [ ] **Step 1: Write the run record**

Use `harness/runs/run-record-schema.md` and include task, method, artifacts, verification, rubric score, learning, and follow-up.

- [ ] **Step 2: Write the experiment report**

Record conditions, outcome, evidence, and lessons from the first lab project.

- [ ] **Step 3: Write the evolution entry**

Record the milestone as the first real lab validation project.

- [ ] **Step 4: Commit**

Use the Lore commit protocol and include verification evidence.

