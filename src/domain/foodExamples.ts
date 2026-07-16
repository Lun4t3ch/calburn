/**
 * Builds example days of food for a calorie target:
 * best case = healthy whole foods (lots of volume),
 * worst case = fast food & snacks (surprisingly little food).
 */

import { FOODS, type FoodItem, type FoodStyle, type MealSlot } from '../data/foods'

export interface DayFoodItem {
  food: FoodItem
  count: number
}

export interface ExampleDay {
  style: FoodStyle
  items: DayFoodItem[]
  totalKcal: number
}

const SLOT_ORDER: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack']

/**
 * Greedily fill a day: one breakfast, one lunch, one dinner (as budget
 * allows), then snacks — repeating snacks until the target is reached
 * within half of the smallest snack's calories.
 */
export function buildExampleDay(targetKcal: number, style: FoodStyle): ExampleDay {
  const pool = FOODS.filter((f) => f.style === style)
  const items: DayFoodItem[] = []
  let total = 0

  const add = (food: FoodItem) => {
    const existing = items.find((i) => i.food.id === food.id)
    if (existing) existing.count++
    else items.push({ food, count: 1 })
    total += food.kcal
  }

  // Main meals: pick the largest option per slot that still fits.
  for (const slot of SLOT_ORDER.slice(0, 3)) {
    const options = pool
      .filter((f) => f.slot === slot)
      .sort((a, b) => b.kcal - a.kcal)
    const fitting = options.find((f) => total + f.kcal <= targetKcal)
    if (fitting) add(fitting)
  }

  // Snacks: keep adding the biggest snack that fits.
  const snacks = pool.filter((f) => f.slot === 'snack').sort((a, b) => b.kcal - a.kcal)
  const smallest = snacks[snacks.length - 1]?.kcal ?? 100
  let guard = 0
  while (targetKcal - total >= smallest && guard < 30) {
    const fitting = snacks.find((f) => total + f.kcal <= targetKcal)
    if (!fitting) break
    add(fitting)
    guard++
  }

  return { style, items, totalKcal: total }
}

/** Both example days for a target. */
export function exampleDays(targetKcal: number): {
  best: ExampleDay
  worst: ExampleDay
} {
  return {
    best: buildExampleDay(targetKcal, 'healthy'),
    worst: buildExampleDay(targetKcal, 'indulgent'),
  }
}
