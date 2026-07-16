/**
 * Weight goals: from "aggressive weight loss" to "significant weight gain".
 *
 * Rates are % of bodyweight per week (safe-loss guidance: 0.5 to 1% BW/week;
 * lean-gain guidance ~0.25 to 1% BW/month, Aragon; ISSN/ACSM position stands).
 * Daily calorie delta uses 7700 kcal ≈ 1 kg as the planning conversion;
 * long-term trajectories use the adaptive model in projection.ts instead.
 *
 * Calorie floors: 1,200 kcal/day (women) and 1,500 kcal/day (men), below
 * these, meeting nutrient needs is hard without medical supervision
 * (ACSM / Academy of Nutrition and Dietetics guidance).
 */

import type { GoalId, Sex } from './types'

export const KCAL_PER_KG = 7700

export interface GoalPreset {
  id: GoalId
  label: string
  description: string
  /** % of bodyweight per week; negative = loss. */
  weeklyRatePct: number
}

export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: 'aggressiveLoss',
    label: 'Aggressive weight loss',
    description: 'Fast results, hard to sustain: about 1% of bodyweight per week',
    weeklyRatePct: -1.0,
  },
  {
    id: 'moderateLoss',
    label: 'Moderate weight loss',
    description: 'The sweet spot for most people: about 0.5% per week',
    weeklyRatePct: -0.5,
  },
  {
    id: 'mildLoss',
    label: 'Gentle weight loss',
    description: 'Slow and easy to live with: about 0.25% per week',
    weeklyRatePct: -0.25,
  },
  {
    id: 'maintain',
    label: 'Maintain weight',
    description: 'Eat what you burn',
    weeklyRatePct: 0,
  },
  {
    id: 'leanGain',
    label: 'Lean muscle gain',
    description: 'Slow gain that minimizes fat: about 0.1% per week',
    weeklyRatePct: 0.1,
  },
  {
    id: 'moderateGain',
    label: 'Moderate weight gain',
    description: 'Steady gaining: about 0.2% per week',
    weeklyRatePct: 0.2,
  },
  {
    id: 'significantGain',
    label: 'Significant weight gain',
    description: 'Fast gaining, some fat comes along: about 0.35% per week',
    weeklyRatePct: 0.35,
  },
]

const presetById = new Map(GOAL_PRESETS.map((g) => [g.id, g]))

export function getGoalPreset(id: GoalId): GoalPreset {
  const preset = presetById.get(id)
  if (!preset) throw new Error(`Unknown goal: ${id}`)
  return preset
}

export const CALORIE_FLOOR: Record<Sex, number> = {
  female: 1200,
  male: 1500,
}

export interface CaloriePlan {
  goal: GoalId
  /** kcal/day to eat. */
  targetKcal: number
  /** kcal/day deficit (negative) or surplus (positive) vs maintenance. */
  dailyDeltaKcal: number
  /** Expected weight change in kg per week at the start. */
  weeklyChangeKg: number
  /** True if the target was raised to the safe minimum. */
  floorApplied: boolean
}

/** Turn a goal into a daily calorie plan. */
export function caloriePlan(
  goal: GoalId,
  maintenanceKcal: number,
  weightKg: number,
  sex: Sex,
): CaloriePlan {
  const preset = getGoalPreset(goal)
  const weeklyChangeKg = (preset.weeklyRatePct / 100) * weightKg
  const dailyDeltaKcal = (weeklyChangeKg * KCAL_PER_KG) / 7

  const floor = CALORIE_FLOOR[sex]
  const rawTarget = maintenanceKcal + dailyDeltaKcal
  const floorApplied = rawTarget < floor
  const targetKcal = floorApplied ? floor : rawTarget

  // If floored, the achievable rate shrinks accordingly.
  const effectiveDelta = targetKcal - maintenanceKcal
  const effectiveWeeklyKg = (effectiveDelta * 7) / KCAL_PER_KG

  return {
    goal,
    targetKcal,
    dailyDeltaKcal: effectiveDelta,
    weeklyChangeKg: effectiveWeeklyKg,
    floorApplied,
  }
}

/**
 * Plan from a user-chosen exact calorie target. The target is NOT clamped
 * to the safe floor; the UI shows a warning instead (floorApplied signals
 * that the chosen target sits below it).
 */
export function customCaloriePlan(
  targetKcal: number,
  maintenanceKcal: number,
  sex: Sex,
): CaloriePlan {
  const dailyDeltaKcal = targetKcal - maintenanceKcal
  return {
    goal: 'custom',
    targetKcal,
    dailyDeltaKcal,
    weeklyChangeKg: (dailyDeltaKcal * 7) / KCAL_PER_KG,
    floorApplied: targetKcal < CALORIE_FLOOR[sex],
  }
}
