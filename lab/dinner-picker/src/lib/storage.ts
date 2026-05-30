import { type Dish, isDish } from './dishes'

const dishesKey = 'dinner-picker:dishes'
const latestPickKey = 'dinner-picker:latest-pick'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function loadDishes(storage: StorageLike = window.localStorage): Dish[] {
  const raw = storage.getItem(dishesKey)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isDish)
  } catch {
    return []
  }
}

export function saveDishes(
  dishes: Dish[],
  storage: StorageLike = window.localStorage,
): void {
  storage.setItem(dishesKey, JSON.stringify(dishes))
}

export function loadLatestPickId(
  storage: StorageLike = window.localStorage,
): string | null {
  const value = storage.getItem(latestPickKey)
  return value || null
}

export function saveLatestPickId(
  dishId: string | null,
  storage: StorageLike = window.localStorage,
): void {
  if (dishId) {
    storage.setItem(latestPickKey, dishId)
    return
  }

  storage.removeItem(latestPickKey)
}
