# Dinner Picker Feedback Redraw Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add weighted recommendation feedback so `想吃` strengthens a dish, `不想吃` lowers its weight and automatically redraws another candidate with a smoother mobile interaction.

**Architecture:** Keep recommendation behavior in `lab/dinner-picker/src/lib/dishes.ts` and keep React focused on state transitions. UI animation uses local component state and CSS utilities only; no new dependencies. Harness evidence is captured outside `lab/` through run and experiment records.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Tailwind CSS utilities, lucide-react.

---

## File Structure

- Modify `lab/dinner-picker/src/lib/dishes.ts`: extend `Dish`, add bounded weight helpers, add weighted pick and feedback helpers.
- Modify `lab/dinner-picker/src/lib/dishes.test.ts`: cover weighted selection, exclusion, legacy dish compatibility, and feedback bounds.
- Modify `lab/dinner-picker/src/lib/storage.test.ts`: prove saved legacy and preference fields survive loading.
- Modify `lab/dinner-picker/src/App.tsx`: add drawing state, feedback handlers, automatic redraw, and result animation surface.
- Modify `lab/dinner-picker/src/App.test.tsx`: cover result feedback actions and automatic redraw.
- Modify `lab/dinner-picker/src/index.css`: add lightweight rolling/reveal animation helpers and reduced-motion behavior if plain CSS is clearer than inline Tailwind animation strings.
- Create `harness/runs/2026-05-31-dinner-picker-feedback-redraw.md`: durable run record.
- Create `experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md`: experiment summary.
- Modify `docs/evolution/index.md` and create `docs/evolution/0013-feedback-driven-recommendation-loop.md`: stage learning.

---

### Task 1: Recommendation Rules

**Files:**
- Modify: `lab/dinner-picker/src/lib/dishes.ts`
- Test: `lab/dinner-picker/src/lib/dishes.test.ts`
- Test: `lab/dinner-picker/src/lib/storage.test.ts`

- [ ] **Step 1: Write failing helper tests**

Add tests for preference fields and weighted behavior:

```ts
it('keeps legacy dishes valid without preference fields', () => {
  expect(
    isDish({
      id: 'legacy',
      name: 'legacy dish',
      tag: 'homey',
      createdAt: '2026-05-31T00:00:00.000Z',
    }),
  ).toBe(true)
})

it('picks a dish by bounded recommendation weight', () => {
  const dishes = [
    createDish({ id: 'a', name: 'A', tag: 'homey' }),
    { ...createDish({ id: 'b', name: 'B', tag: 'quick' }), weight: 3 },
  ]

  expect(pickRandomDish(dishes, () => 0.24)?.id).toBe('a')
  expect(pickRandomDish(dishes, () => 0.25)?.id).toBe('b')
})

it('excludes a rejected dish from the next redraw when alternatives exist', () => {
  const dishes = [
    createDish({ id: 'a', name: 'A', tag: 'homey' }),
    createDish({ id: 'b', name: 'B', tag: 'quick' }),
  ]

  expect(pickRandomDish(dishes, () => 0, { excludeDishId: 'a' })?.id).toBe('b')
})

it('keeps the only dish available when exclusion has no alternatives', () => {
  const dishes = [createDish({ id: 'a', name: 'A', tag: 'homey' })]

  expect(pickRandomDish(dishes, () => 0, { excludeDishId: 'a' })?.id).toBe('a')
})

it('applies positive feedback within the max weight', () => {
  const dish = {
    ...createDish({ id: 'dish-1', name: 'A', tag: 'homey' }),
    weight: 4.9,
    likedCount: 1,
  }

  expect(applyDishFeedback(dish, 'liked')).toMatchObject({
    weight: 5,
    likedCount: 2,
  })
})

it('applies negative feedback within the min weight', () => {
  const dish = {
    ...createDish({ id: 'dish-1', name: 'A', tag: 'homey' }),
    weight: 0.3,
    rejectedCount: 1,
  }

  expect(applyDishFeedback(dish, 'rejected')).toMatchObject({
    weight: 0.2,
    rejectedCount: 2,
  })
})
```

Add a storage test:

```ts
it('loads dishes with preference fields', () => {
  const storage = createMemoryStorage()
  storage.setItem(
    'dinner-picker:dishes',
    JSON.stringify([
      {
        id: 'dish-1',
        name: '面',
        tag: 'quick',
        createdAt: '2026-05-31T00:00:00.000Z',
        weight: 2,
        likedCount: 1,
        rejectedCount: 0,
      },
    ]),
  )

  expect(loadDishes(storage)[0]).toMatchObject({
    id: 'dish-1',
    weight: 2,
    likedCount: 1,
    rejectedCount: 0,
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
cd lab/dinner-picker && npm test -- --run src/lib/dishes.test.ts src/lib/storage.test.ts
```

Expected: fail because `applyDishFeedback` and weighted options do not exist.

- [ ] **Step 3: Implement recommendation helpers**

In `dishes.ts`:

```ts
export type Dish = {
  id: string
  name: string
  tag: DishTag
  createdAt: string
  weight?: number
  likedCount?: number
  rejectedCount?: number
}

const minDishWeight = 0.2
const maxDishWeight = 5
const likedWeightDelta = 0.4
const rejectedWeightDelta = 0.5

type PickRandomDishOptions = {
  excludeDishId?: string
}

export type DishFeedback = 'liked' | 'rejected'

export function getDishWeight(dish: Dish): number {
  if (typeof dish.weight !== 'number' || Number.isNaN(dish.weight)) {
    return 1
  }

  return Math.min(Math.max(dish.weight, minDishWeight), maxDishWeight)
}

function clampWeight(weight: number): number {
  return Number(Math.min(Math.max(weight, minDishWeight), maxDishWeight).toFixed(2))
}

export function pickRandomDish(
  dishes: Dish[],
  random: () => number = Math.random,
  options: PickRandomDishOptions = {},
): Dish | null {
  if (dishes.length === 0) {
    return null
  }

  const candidates = options.excludeDishId
    ? dishes.filter((dish) => dish.id !== options.excludeDishId)
    : dishes
  const availableDishes = candidates.length > 0 ? candidates : dishes
  const totalWeight = availableDishes.reduce(
    (total, dish) => total + getDishWeight(dish),
    0,
  )
  const target = Math.min(Math.max(random(), 0), 0.999999999) * totalWeight

  let cursor = 0
  for (const dish of availableDishes) {
    cursor += getDishWeight(dish)
    if (target < cursor) {
      return dish
    }
  }

  return availableDishes.at(-1) ?? null
}

export function applyDishFeedback(dish: Dish, feedback: DishFeedback): Dish {
  if (feedback === 'liked') {
    return {
      ...dish,
      weight: clampWeight(getDishWeight(dish) + likedWeightDelta),
      likedCount: (dish.likedCount ?? 0) + 1,
    }
  }

  return {
    ...dish,
    weight: clampWeight(getDishWeight(dish) - rejectedWeightDelta),
    rejectedCount: (dish.rejectedCount ?? 0) + 1,
  }
}
```

Update `isDish` to accept optional numeric preference fields:

```ts
const hasOptionalNumber = (value: unknown) =>
  value === undefined || typeof value === 'number'

return (
  typeof candidate.id === 'string' &&
  typeof candidate.name === 'string' &&
  isDishTag(candidate.tag) &&
  typeof candidate.createdAt === 'string' &&
  hasOptionalNumber(candidate.weight) &&
  hasOptionalNumber(candidate.likedCount) &&
  hasOptionalNumber(candidate.rejectedCount)
)
```

- [ ] **Step 4: Run helper tests**

Run:

```bash
cd lab/dinner-picker && npm test -- --run src/lib/dishes.test.ts src/lib/storage.test.ts
```

Expected: pass.

- [ ] **Step 5: Commit helper layer**

```bash
git add lab/dinner-picker/src/lib/dishes.ts lab/dinner-picker/src/lib/dishes.test.ts lab/dinner-picker/src/lib/storage.test.ts
git commit -m "Teach dinner picker recommendations from feedback" \
  -m "Recommendation feedback needs deterministic helper behavior before the UI can rely on automatic redraws." \
  -m "Constraint: Existing localStorage dishes must stay valid without preference fields" \
  -m "Rejected: Uniform random plus UI-only dislike state | does not learn across draws" \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: npm test -- --run src/lib/dishes.test.ts src/lib/storage.test.ts"
```

---

### Task 2: Draw Panel Feedback UI

**Files:**
- Modify: `lab/dinner-picker/src/App.tsx`
- Modify: `lab/dinner-picker/src/App.test.tsx`
- Modify: `lab/dinner-picker/src/index.css`

- [ ] **Step 1: Write failing app tests**

Add tests using fake timers where the draw animation is involved:

```ts
it('shows feedback actions after drawing a recommendation', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByLabelText('添加一道菜'), '牛肉面')
  await user.click(screen.getByRole('button', { name: '加进菜谱池' }))
  await user.click(screen.getByRole('button', { name: '今天吃什么' }))

  expect(await screen.findByRole('button', { name: '想吃' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '不想吃' })).toBeInTheDocument()
})

it('keeps the current dish and records positive feedback when liked', async () => {
  vi.spyOn(Math, 'random').mockReturnValue(0)
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByLabelText('添加一道菜'), '牛肉面')
  await user.click(screen.getByRole('button', { name: '加进菜谱池' }))
  await user.click(screen.getByRole('button', { name: '今天吃什么' }))
  await user.click(await screen.findByRole('button', { name: '想吃' }))

  expect(screen.getByText('已记住：想吃')).toBeInTheDocument()
  expect(screen.getAllByText('牛肉面')).toHaveLength(2)
})

it('automatically redraws a different dish after rejection', async () => {
  vi.useFakeTimers()
  const randomSpy = vi
    .spyOn(Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(0)
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  render(<App />)

  await user.type(screen.getByLabelText('添加一道菜'), '牛肉面')
  await user.click(screen.getByRole('button', { name: '加进菜谱池' }))
  await user.type(screen.getByLabelText('添加一道菜'), '寿司')
  await user.click(screen.getByRole('button', { name: '加进菜谱池' }))
  await user.click(screen.getByRole('button', { name: '今天吃什么' }))

  expect(await screen.findByRole('button', { name: '不想吃' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '不想吃' }))

  expect(screen.getByText('重新抽签中')).toBeInTheDocument()
  await vi.advanceTimersByTimeAsync(700)

  expect(screen.getByText('今天就吃')).toBeInTheDocument()
  expect(screen.getAllByText('牛肉面')).toHaveLength(2)
  expect(screen.queryByText('已跳过：寿司')).not.toBeInTheDocument()

  randomSpy.mockRestore()
  vi.useRealTimers()
})
```

- [ ] **Step 2: Run app tests to verify failure**

Run:

```bash
cd lab/dinner-picker && npm test -- --run src/App.test.tsx
```

Expected: fail because feedback buttons and animation state do not exist.

- [ ] **Step 3: Implement UI state and handlers**

In `App.tsx`:

- import `ThumbsDown`, `ThumbsUp`, `LoaderCircle`
- import `applyDishFeedback`
- add `const drawDurationMs = 700`
- add state:

```ts
const [isDrawing, setIsDrawing] = useState(false)
const [statusMessage, setStatusMessage] = useState<string | null>(null)
```

Add a reusable draw starter:

```ts
const finishDraw = useCallback(
  (excludeDishId?: string) => {
    const pick = pickRandomDish(dishes, Math.random, { excludeDishId })

    if (!pick) {
      setIsDrawing(false)
      return
    }

    setLatestPickId(pick.id)
    setDrawCount((count) => count + 1)
    setIsDrawing(false)
  },
  [dishes],
)
```

Use a timeout-based draw:

```ts
const startDraw = useCallback(
  (excludeDishId?: string) => {
    if (dishes.length === 0 || isDrawing) {
      return
    }

    setStatusMessage(null)
    setIsDrawing(true)
    window.setTimeout(() => finishDraw(excludeDishId), drawDurationMs)
  },
  [dishes.length, finishDraw, isDrawing],
)
```

Add cleanup:

```ts
useEffect(() => {
  return () => {
    setIsDrawing(false)
  }
}, [])
```

Add feedback handler:

```ts
const handleFeedback = useCallback(
  (feedback: DishFeedback) => {
    if (!latestPick || isDrawing) {
      return
    }

    setDishes((current) =>
      current.map((dish) =>
        dish.id === latestPick.id ? applyDishFeedback(dish, feedback) : dish,
      ),
    )

    if (feedback === 'liked') {
      setStatusMessage('已记住：想吃')
      return
    }

    const hasAlternative = dishes.some((dish) => dish.id !== latestPick.id)
    if (!hasAlternative) {
      setStatusMessage('池子里暂时没有别的选择')
      return
    }

    setStatusMessage(`已跳过：${latestPick.name}`)
    startDraw(latestPick.id)
  },
  [dishes, isDrawing, latestPick, startDraw],
)
```

Pass `isDrawing`, `statusMessage`, `onFeedback`, and `candidates` into
`DrawPanel`.

- [ ] **Step 4: Implement DrawPanel controls and animation**

Update `DrawPanelProps`:

```ts
type DrawPanelProps = {
  dishCount: number
  drawCount: number
  isDrawing: boolean
  latestPick: Dish | null
  statusMessage: string | null
  onDraw: () => void
  onFeedback: (feedback: DishFeedback) => void
}
```

Inside `DrawPanel`, render:

```tsx
{isDrawing ? (
  <div className="flex min-h-20 flex-col items-center justify-center gap-3 text-center">
    <LoaderCircle className="animate-spin text-[#f9c74f]" size={28} />
    <p className="text-sm font-black text-white">重新抽签中</p>
  </div>
) : latestPick ? (
  <>
    <p className="text-sm font-bold text-white/70">今天就吃</p>
    <h2 className="mt-2 break-words text-4xl font-black leading-tight">
      {latestPick.name}
    </h2>
    <p className="mt-3 inline-flex rounded-full bg-white/14 px-3 py-1 text-sm font-bold text-[#f9c74f]">
      {tagLabels[latestPick.tag]}
    </p>
  </>
) : (
  existing empty state
)}
```

Add feedback controls after the card when `latestPick && !isDrawing`:

```tsx
<div className="mt-3 grid grid-cols-2 gap-2">
  <Button type="button" variant="secondary" onClick={() => onFeedback('liked')}>
    <ThumbsUp size={18} />
    想吃
  </Button>
  <Button type="button" variant="secondary" onClick={() => onFeedback('rejected')}>
    <ThumbsDown size={18} />
    不想吃
  </Button>
</div>
```

Show status message:

```tsx
{statusMessage ? (
  <p className="mt-3 text-center text-sm font-bold text-[#f9c74f]">
    {statusMessage}
  </p>
) : null}
```

Disable draw button with `disabled={dishCount === 0 || isDrawing}`.

Add or adjust CSS in `index.css`:

```css
@keyframes draw-pulse {
  0% { transform: translateY(4px) scale(0.98); opacity: 0.72; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}

.draw-result-enter {
  animation: draw-pulse 360ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .draw-result-enter {
    animation: none;
  }
}
```

Use `draw-result-enter` on the result container.

- [ ] **Step 5: Run app tests**

Run:

```bash
cd lab/dinner-picker && npm test -- --run src/App.test.tsx
```

Expected: pass.

- [ ] **Step 6: Commit UI layer**

```bash
git add lab/dinner-picker/src/App.tsx lab/dinner-picker/src/App.test.tsx lab/dinner-picker/src/index.css
git commit -m "Close the dinner picker feedback loop in the UI" \
  -m "The lab app now turns user preference feedback into visible recommendation behavior instead of leaving the random result as a dead end." \
  -m "Constraint: Rejecting a dish must automatically redraw another candidate" \
  -m "Rejected: Manual redraw after rejection | adds friction to the primary mobile flow" \
  -m "Confidence: medium" \
  -m "Scope-risk: moderate" \
  -m "Tested: npm test -- --run src/App.test.tsx"
```

---

### Task 3: Full Verification And Browser Smoke Check

**Files:**
- Read: `lab/dinner-picker/package.json`

- [ ] **Step 1: Run full automated verification**

Run:

```bash
cd lab/dinner-picker && npm test -- --run
cd lab/dinner-picker && npm run build
cd lab/dinner-picker && npm run lint
```

Expected: all pass.

- [ ] **Step 2: Start or reuse a LAN-visible server**

Run:

```bash
cd lab/dinner-picker && npm run dev -- --host 0.0.0.0
```

Expected: Vite prints a local URL and network URL.

- [ ] **Step 3: Browser mobile smoke check**

Use the available Browser/Chrome MCP tooling to open the LAN or localhost URL
with a mobile viewport. Verify:

- adding two dishes works
- drawing shows a result after the animation
- feedback buttons are visible and thumb-sized
- tapping `不想吃` starts `重新抽签中`
- after the animation, a different dish is shown when alternatives exist
- no horizontal overflow is visible

- [ ] **Step 4: Record verification evidence**

Capture the concrete commands and browser-observed outcome for the run record.

---

### Task 4: Harness Documentation

**Files:**
- Create: `harness/runs/2026-05-31-dinner-picker-feedback-redraw.md`
- Create: `experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md`
- Create: `docs/evolution/0013-feedback-driven-recommendation-loop.md`
- Modify: `docs/evolution/index.md`

- [ ] **Step 1: Create run record**

Write a run record with:

```md
# Dinner Picker Feedback Redraw Run Record

## Summary

- Date: 2026-05-31
- Owner: Codex
- Phase: 3B - First Lab Project
- Outcome: completed

## Task

- Goal: add `想吃` / `不想吃` feedback to the random result.
- User requirement: `不想吃` must automatically redraw.
- Expected artifacts: weighted recommendation helpers, mobile UI feedback,
  tests, browser smoke check, documentation.

## Harness Setup

- Entry documents: `AGENTS.md`, `lab/AGENTS.md`
- Spec: `docs/superpowers/specs/2026-05-31-dinner-picker-feedback-redraw-design.md`
- Plan: `docs/superpowers/plans/2026-05-31-dinner-picker-feedback-redraw.md`
- Tools: Vitest, Vite, ESLint, Browser/Chrome MCP mobile smoke check

## Method

1. Converted subjective mobile UX feedback into explicit product rules.
2. Put recommendation rules in deterministic helper functions.
3. Covered algorithm and UI behavior with tests.
4. Verified the resulting flow in a mobile browser viewport.

## Verification

- `npm test -- --run`: passed
- `npm run build`: passed
- `npm run lint`: passed
- Browser mobile smoke check: passed

## Learning

Harness quality here means the agent does not ask the user to be the first QA
surface. Subjective feedback became an interaction contract, deterministic
tests, and a browser-observed mobile flow.
```

- [ ] **Step 2: Create experiment report**

Write a report summarizing hypothesis, intervention, results, and remaining
risks.

- [ ] **Step 3: Create evolution note and update index**

Add a stage note explaining the reusable method:

```text
subjective UX feedback -> explicit interaction contract -> deterministic helper
tests -> browser/mobile smoke check -> durable run record
```

- [ ] **Step 4: Commit documentation**

```bash
git add harness/runs/2026-05-31-dinner-picker-feedback-redraw.md experiments/reports/2026-05-31-dinner-picker-feedback-redraw.md docs/evolution/0013-feedback-driven-recommendation-loop.md docs/evolution/index.md docs/superpowers/plans/2026-05-31-dinner-picker-feedback-redraw.md
git commit -m "Record feedback redraw as a harness validation loop" \
  -m "The lab feature demonstrates how mobile UX feedback becomes a tested interaction contract and durable harness evidence." \
  -m "Constraint: Stage-level lab learning must update docs/evolution" \
  -m "Confidence: high" \
  -m "Scope-risk: narrow" \
  -m "Tested: Documentation reviewed against completed verification evidence"
```

---

### Task 5: Final Repository Checks

**Files:**
- Read: repository root

- [ ] **Step 1: Run root structure check**

Run:

```bash
find . -path ./.git -prune -o -path ./.omx -prune -o -print | sort
```

Expected: no unexpected first-stage forbidden directories at root.

- [ ] **Step 2: Run git status**

Run:

```bash
git status --short
```

Expected: clean after commits, or only intentional runtime artifacts ignored by
git.

- [ ] **Step 3: Report outcome**

Final report should include:

- changed files
- verification commands and browser smoke result
- LAN/mobile URL if server remains running
- remaining risks
