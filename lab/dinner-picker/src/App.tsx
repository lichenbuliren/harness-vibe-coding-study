import {
  memo,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ChefHat,
  Dice5,
  LoaderCircle,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Utensils,
} from 'lucide-react'
import { Button, DishCard, Input, Panel, TagSelect } from './components/ui'
import {
  applyDishFeedback,
  createDish,
  dishTags,
  pickRandomDish,
  tagLabels,
  type Dish,
  type DishFeedback,
  type DishTag,
} from './lib/dishes'
import {
  loadDishes,
  loadLatestPickId,
  saveDishes,
  saveLatestPickId,
} from './lib/storage'

const drawDurationMs = 700

function App() {
  const [dishes, setDishes] = useState<Dish[]>(() => loadDishes())
  const [latestPickId, setLatestPickId] = useState<string | null>(() =>
    loadLatestPickId(),
  )
  const [drawCount, setDrawCount] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const drawTimerRef = useRef<number | null>(null)

  const latestPick = useMemo(
    () => dishes.find((dish) => dish.id === latestPickId) ?? null,
    [dishes, latestPickId],
  )

  useEffect(() => {
    saveDishes(dishes)
  }, [dishes])

  useEffect(() => {
    saveLatestPickId(latestPick?.id ?? null)
  }, [latestPick])

  const handleAddDish = useCallback((dish: Dish) => {
    setDishes((current) => [dish, ...current])
  }, [])

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

  const startDraw = useCallback(
    (excludeDishId?: string) => {
      if (dishes.length === 0 || isDrawing) {
        return
      }

      if (drawTimerRef.current !== null) {
        window.clearTimeout(drawTimerRef.current)
      }

      setStatusMessage(null)
      setIsDrawing(true)
      drawTimerRef.current = window.setTimeout(() => {
        finishDraw(excludeDishId)
        drawTimerRef.current = null
      }, drawDurationMs)
    },
    [dishes.length, finishDraw, isDrawing],
  )

  const handleDraw = useCallback(() => {
    startDraw()
  }, [startDraw])

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

      startDraw(latestPick.id)
    },
    [dishes, isDrawing, latestPick, startDraw],
  )

  useEffect(() => {
    return () => {
      if (drawTimerRef.current !== null) {
        window.clearTimeout(drawTimerRef.current)
      }
    }
  }, [])

  const handleDeleteDish = useCallback((dishId: string) => {
    setDishes((current) => current.filter((dish) => dish.id !== dishId))

    if (latestPickId === dishId) {
      setLatestPickId(null)
    }
  }, [latestPickId])

  return (
    <main className="min-h-svh overflow-hidden bg-[#f8efe6] text-[#102a43]">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col px-4 py-5 sm:max-w-2xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#f25f4c]">Dinner Picker</p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-[#102a43]">
              今天吃什么
            </h1>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl bg-[#102a43] text-white shadow-[0_16px_30px_rgba(16,42,67,0.24)]">
            <ChefHat size={24} />
          </div>
        </header>

        <section className="relative mt-5 flex-1 rounded-[32px] bg-[#ffeecf] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
          <div className="absolute right-7 top-7 text-[#15aabf]/35">
            <Sparkles size={28} />
          </div>

          <div className="flex flex-col gap-4">
            <DrawPanel
              dishCount={dishes.length}
              drawCount={drawCount}
              isDrawing={isDrawing}
              latestPick={latestPick}
              onDraw={handleDraw}
              onFeedback={handleFeedback}
              statusMessage={statusMessage}
            />
            <AddDishPanel onAddDish={handleAddDish} />
            <DishPool dishes={dishes} onDeleteDish={handleDeleteDish} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default App

type DrawPanelProps = {
  dishCount: number
  drawCount: number
  isDrawing: boolean
  latestPick: Dish | null
  onDraw: () => void
  onFeedback: (feedback: DishFeedback) => void
  statusMessage: string | null
}

const DrawPanel = memo(function DrawPanel({
  dishCount,
  drawCount,
  isDrawing,
  latestPick,
  onDraw,
  onFeedback,
  statusMessage,
}: DrawPanelProps) {
  return (
    <Panel className="relative overflow-hidden !bg-[#102a43] !text-white">
      <div className="absolute -right-12 -top-10 size-40 rounded-full bg-[#15aabf]/35" />
      <div className="absolute -bottom-14 -left-10 size-36 rounded-full bg-[#f9c74f]/40" />
      <div className="relative">
        <p className="flex items-center gap-2 text-sm font-bold text-[#f9c74f]">
          <Dice5 size={18} />
          今日抽签
        </p>
        <div
          key={isDrawing ? 'drawing' : (latestPick?.id ?? drawCount)}
          className="draw-result-enter mt-5 min-h-28 rounded-[24px] border border-white/12 bg-[#081b2f]/58 p-4"
          aria-live="polite"
        >
          {isDrawing ? (
            <div className="flex min-h-20 flex-col items-center justify-center gap-3 text-center">
              <LoaderCircle
                className="animate-spin text-[#f9c74f]"
                size={28}
              />
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
            <div className="flex min-h-20 items-center gap-3 text-white/72">
              <Utensils className="shrink-0" size={24} />
              <p className="text-left text-sm font-semibold">
                先把想吃的菜放进池子，再抽今天的答案。
              </p>
            </div>
          )}
        </div>
        {latestPick && !isDrawing ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onFeedback('liked')}
              className="px-3"
            >
              <ThumbsUp size={18} />
              想吃
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onFeedback('rejected')}
              className="px-3"
            >
              <ThumbsDown size={18} />
              不想吃
            </Button>
          </div>
        ) : null}
        {statusMessage ? (
          <p className="mt-3 text-center text-sm font-bold text-[#f9c74f]">
            {statusMessage}
          </p>
        ) : null}
        <Button
          type="button"
          onClick={onDraw}
          disabled={dishCount === 0 || isDrawing}
          className="mt-4 w-full text-base"
        >
          <Dice5 size={20} />
          今天吃什么
        </Button>
      </div>
    </Panel>
  )
})

type AddDishPanelProps = {
  onAddDish: (dish: Dish) => void
}

const AddDishPanel = memo(function AddDishPanel({
  onAddDish,
}: AddDishPanelProps) {
  const [dishName, setDishName] = useState('')
  const [selectedTag, setSelectedTag] = useState<DishTag>(dishTags[0])
  const canAddDish = dishName.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canAddDish) {
      return
    }

    onAddDish(
      createDish({
        name: dishName,
        tag: selectedTag,
      }),
    )
    setDishName('')
    setSelectedTag(dishTags[0])
  }

  return (
    <Panel>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            className="mb-2 block text-sm font-bold text-[#52606d]"
            htmlFor="dish-name"
          >
            添加一道菜
          </label>
          <Input
            id="dish-name"
            value={dishName}
            onChange={(event) => setDishName(event.target.value)}
            placeholder="例如：番茄炒蛋"
            required
          />
        </div>
        <TagSelect value={selectedTag} onChange={setSelectedTag} />
        <Button
          type="submit"
          variant={canAddDish ? 'primary' : 'secondary'}
          className={`w-full ${
            canAddDish ? '!bg-[#f25f4c] !text-white !opacity-100' : ''
          }`}
          disabled={!canAddDish}
          data-ready={canAddDish}
        >
          加进菜谱池
        </Button>
      </form>
    </Panel>
  )
})

type DishPoolProps = {
  dishes: Dish[]
  onDeleteDish: (dishId: string) => void
}

const DishPool = memo(function DishPool({
  dishes,
  onDeleteDish,
}: DishPoolProps) {
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-[#102a43]">菜谱池</h2>
        <span className="rounded-full bg-[#e7f9fb] px-3 py-1 text-sm font-black text-[#0b7285]">
          {dishes.length} 道
        </span>
      </div>

      {dishes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#b8c7d3] bg-[#f7fafc] p-5 text-center">
          <p className="font-bold text-[#52606d]">池子还空着</p>
          <p className="mt-1 text-sm text-[#7b8794]">
            先添加几道常吃的菜，抽签才有惊喜。
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onDelete={onDeleteDish} />
          ))}
        </div>
      )}
    </Panel>
  )
})
