import { describe, expect, it, vi } from 'vitest'
import { createDish, normalizeDishName, pickRandomDish } from './dishes'

describe('dish helpers', () => {
  it('normalizes dish names', () => {
    expect(normalizeDishName('  tomato   eggs  ')).toBe('tomato eggs')
  })

  it('creates a dish with normalized fields', () => {
    const dish = createDish({
      id: 'dish-1',
      name: '  番茄炒蛋  ',
      tag: 'homey',
      createdAt: '2026-05-30T00:00:00.000Z',
    })

    expect(dish).toEqual({
      id: 'dish-1',
      name: '番茄炒蛋',
      tag: 'homey',
      createdAt: '2026-05-30T00:00:00.000Z',
    })
  })

  it('rejects blank dish names', () => {
    expect(() => createDish({ name: '   ', tag: 'quick' })).toThrow(
      'Dish name is required',
    )
  })

  it('picks a dish by injected random value', () => {
    const dishes = [
      createDish({ id: 'a', name: 'A', tag: 'homey' }),
      createDish({ id: 'b', name: 'B', tag: 'quick' }),
      createDish({ id: 'c', name: 'C', tag: 'light' }),
    ]

    expect(pickRandomDish(dishes, () => 0.4)?.id).toBe('b')
  })

  it('returns null for an empty pool', () => {
    expect(pickRandomDish([], vi.fn())).toBeNull()
  })
})
