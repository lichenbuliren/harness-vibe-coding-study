export const dishTags = [
  'homey',
  'quick',
  'light',
  'spicy',
  'takeout',
  'weekend',
] as const

export type DishTag = (typeof dishTags)[number]

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

export const tagLabels: Record<DishTag, string> = {
  homey: '家常',
  quick: '快手',
  light: '清淡',
  spicy: '重口',
  takeout: '外卖',
  weekend: '周末',
}

export function normalizeDishName(name: string): string {
  return name.trim().replace(/\s+/g, ' ')
}

function createDishId(createdAt: string): string {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const timestamp = createdAt.replace(/[^a-zA-Z0-9]/g, '-')
  const randomPart = Math.random().toString(36).slice(2, 8)
  return `dish-${timestamp}-${randomPart}`
}

type CreateDishInput = {
  name: string
  tag: DishTag
  id?: string
  createdAt?: string
}

export function createDish(input: CreateDishInput): Dish {
  const normalizedName = normalizeDishName(input.name)
  const createdAt = input.createdAt ?? new Date().toISOString()

  if (!normalizedName) {
    throw new Error('Dish name is required')
  }

  return {
    id: input.id ?? createDishId(createdAt),
    name: normalizedName,
    tag: input.tag,
    createdAt,
  }
}

export function getDishWeight(dish: Dish): number {
  if (typeof dish.weight !== 'number' || Number.isNaN(dish.weight)) {
    return 1
  }

  return Math.min(Math.max(dish.weight, minDishWeight), maxDishWeight)
}

function clampWeight(weight: number): number {
  return Number(
    Math.min(Math.max(weight, minDishWeight), maxDishWeight).toFixed(2),
  )
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

export function isDishTag(value: unknown): value is DishTag {
  return typeof value === 'string' && dishTags.includes(value as DishTag)
}

export function isDish(value: unknown): value is Dish {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  const hasOptionalNumber = (field: unknown) =>
    field === undefined || typeof field === 'number'

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    isDishTag(candidate.tag) &&
    typeof candidate.createdAt === 'string' &&
    hasOptionalNumber(candidate.weight) &&
    hasOptionalNumber(candidate.likedCount) &&
    hasOptionalNumber(candidate.rejectedCount)
  )
}
