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
 * allows), then snacks, repeating snacks until the target is reached
 * within half of the smallest snack's calories.
 *
 * `variant` rotates which meal is picked per slot, so users can cycle
 * through several different example days for the same calorie target.
 */
export function buildExampleDay(
  targetKcal: number,
  style: FoodStyle,
  variant = 0,
): ExampleDay {
  const pool = FOODS.filter((f) => f.style === style)
  const items: DayFoodItem[] = []
  let total = 0

  const add = (food: FoodItem) => {
    const existing = items.find((i) => i.food.id === food.id)
    if (existing) existing.count++
    else items.push({ food, count: 1 })
    total += food.kcal
  }

  // Main meals: rotate through the options per slot that still fit.
  for (const slot of SLOT_ORDER.slice(0, 3)) {
    const fitting = pool
      .filter((f) => f.slot === slot)
      .sort((a, b) => b.kcal - a.kcal)
      .filter((f) => total + f.kcal <= targetKcal)
    if (fitting.length > 0) add(fitting[variant % fitting.length])
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

/** Both example days for a target; `variant` cycles alternatives. */
export function exampleDays(
  targetKcal: number,
  variant = 0,
): {
  best: ExampleDay
  worst: ExampleDay
} {
  return {
    best: buildExampleDay(targetKcal, 'healthy', variant),
    worst: buildExampleDay(targetKcal, 'indulgent', variant),
  }
}
