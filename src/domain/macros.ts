/**
 * Evidence-based macro targets.
 *
 * Protein: 1.6 to 2.2 g/kg for muscle gain (Morton et al. 2018 plateau ~1.6,
 * CI upper ~2.2); higher while cutting to preserve lean mass (Helms et al.).
 * Fat: at least 20% of calories and ≥0.5 g/kg for hormones and essential
 * fatty acids. Carbs fill the remaining calories.
 */

import { KCAL_PER_GRAM } from './tef'
import type { GoalId, MacroSplit } from './types'

export interface MacroTargets {
  proteinG: number
  fatG: number
  carbsG: number
  /** g protein per kg used for this goal. */
  proteinPerKg: number
}

function proteinPerKgForGoal(goal: GoalId): number {
  switch (goal) {
    case 'aggressiveLoss':
    case 'moderateLoss':
    case 'mildLoss':
      return 2.2 // protect muscle in a deficit
    case 'maintain':
    case 'custom': // no direction implied, use the maintenance default
      return 1.6
    case 'leanGain':
    case 'moderateGain':
    case 'significantGain':
      return 1.8
  }
}

const MIN_FAT_FRACTION = 0.2
const MIN_FAT_G_PER_KG = 0.5

/** Compute macro gram targets for a calorie target and goal. */
export function macroTargets(
  targetKcal: number,
  weightKg: number,
  goal: GoalId,
): MacroTargets {
  const proteinPerKg = proteinPerKgForGoal(goal)
  let proteinG = proteinPerKg * weightKg

  const fatG = Math.max(
    (targetKcal * MIN_FAT_FRACTION) / KCAL_PER_GRAM.fat,
    MIN_FAT_G_PER_KG * weightKg,
  )

  let remaining =
    targetKcal - proteinG * KCAL_PER_GRAM.protein - fatG * KCAL_PER_GRAM.fat

  // On very low targets protein + fat may not fit; scale protein down
  // rather than produce negative carbs.
  if (remaining < 0) {
    proteinG = Math.max(
      0,
      (targetKcal - fatG * KCAL_PER_GRAM.fat) / KCAL_PER_GRAM.protein,
    )
    remaining = 0
  }

  return {
    proteinG: Math.round(proteinG),
    fatG: Math.round(fatG),
    carbsG: Math.round(remaining / KCAL_PER_GRAM.carbs),
    proteinPerKg,
  }
}

/**
 * Macro grams from a user-chosen percentage split (protein/carbs/fat,
 * summing to 100). Grams = share of calories divided by kcal per gram.
 */
export function macroTargetsFromSplit(
  targetKcal: number,
  weightKg: number,
  split: MacroSplit,
): MacroTargets {
  const proteinG = (targetKcal * split.proteinPct) / 100 / KCAL_PER_GRAM.protein
  const carbsG = (targetKcal * split.carbsPct) / 100 / KCAL_PER_GRAM.carbs
  const fatG = (targetKcal * split.fatPct) / 100 / KCAL_PER_GRAM.fat
  return {
    proteinG: Math.round(proteinG),
    carbsG: Math.round(carbsG),
    fatG: Math.round(fatG),
    proteinPerKg: Math.round((proteinG / weightKg) * 10) / 10,
  }
}
