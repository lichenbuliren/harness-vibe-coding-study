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
}

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

export function pickRandomDish(
  dishes: Dish[],
  random: () => number = Math.random,
): Dish | null {
  if (dishes.length === 0) {
    return null
  }

  const safeRandom = Math.min(Math.max(random(), 0), 0.999999999)
  return dishes[Math.floor(safeRandom * dishes.length)]
}

export function isDishTag(value: unknown): value is DishTag {
  return typeof value === 'string' && dishTags.includes(value as DishTag)
}

export function isDish(value: unknown): value is Dish {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    isDishTag(candidate.tag) &&
    typeof candidate.createdAt === 'string'
  )
}
