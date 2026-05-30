import { describe, expect, it } from 'vitest'
import { createDish } from './dishes'
import {
  loadDishes,
  loadLatestPickId,
  saveDishes,
  saveLatestPickId,
} from './storage'

function createMemoryStorage(): Storage {
  const map = new Map<string, string>()

  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => Array.from(map.keys())[index] ?? null,
    removeItem: (key) => map.delete(key),
    setItem: (key, value) => map.set(key, String(value)),
  }
}

describe('storage helpers', () => {
  it('saves and loads dishes', () => {
    const storage = createMemoryStorage()
    const dishes = [createDish({ id: 'dish-1', name: '拉面', tag: 'takeout' })]

    saveDishes(dishes, storage)

    expect(loadDishes(storage)).toEqual(dishes)
  })

  it('falls back to an empty list for invalid JSON', () => {
    const storage = createMemoryStorage()
    storage.setItem('dinner-picker:dishes', '{')

    expect(loadDishes(storage)).toEqual([])
  })

  it('filters malformed dish entries', () => {
    const storage = createMemoryStorage()
    storage.setItem(
      'dinner-picker:dishes',
      JSON.stringify([
        createDish({ id: 'dish-1', name: '粥', tag: 'light' }),
        { id: 1, name: 'bad', tag: 'unknown' },
      ]),
    )

    expect(loadDishes(storage)).toHaveLength(1)
  })

  it('saves and clears latest pick id', () => {
    const storage = createMemoryStorage()

    saveLatestPickId('dish-1', storage)
    expect(loadLatestPickId(storage)).toBe('dish-1')

    saveLatestPickId(null, storage)
    expect(loadLatestPickId(storage)).toBeNull()
  })
})
