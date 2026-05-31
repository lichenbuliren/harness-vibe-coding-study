import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  applyDishFeedback,
  createDish,
  isDish,
  normalizeDishName,
  pickRandomDish,
} from './dishes'

describe('dish helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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

  it('creates a dish when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', {})
    vi.spyOn(Math, 'random').mockReturnValue(0.123456789)

    const dish = createDish({
      name: '手机测试菜',
      tag: 'quick',
      createdAt: '2026-05-31T00:00:00.000Z',
    })

    expect(dish.id).toBe('dish-2026-05-31T00-00-00-000Z-4fzzzx')
  })

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

  it('picks a dish by injected random value', () => {
    const dishes = [
      createDish({ id: 'a', name: 'A', tag: 'homey' }),
      createDish({ id: 'b', name: 'B', tag: 'quick' }),
      createDish({ id: 'c', name: 'C', tag: 'light' }),
    ]

    expect(pickRandomDish(dishes, () => 0.4)?.id).toBe('b')
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

    expect(pickRandomDish(dishes, () => 0, { excludeDishId: 'a' })?.id).toBe(
      'b',
    )
  })

  it('keeps the only dish available when exclusion has no alternatives', () => {
    const dishes = [createDish({ id: 'a', name: 'A', tag: 'homey' })]

    expect(pickRandomDish(dishes, () => 0, { excludeDishId: 'a' })?.id).toBe(
      'a',
    )
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

  it('returns null for an empty pool', () => {
    expect(pickRandomDish([], vi.fn())).toBeNull()
  })
})
