/**
 * Evidence-based macro targets.
 *
 * Protein: 1.6–2.2 g/kg for muscle gain (Morton et al. 2018 plateau ~1.6,
 * CI upper ~2.2); higher while cutting to preserve lean mass (Helms et al.).
 * Fat: at least 20% of calories and ≥0.5 g/kg for hormones and essential
 * fatty acids. Carbs fill the remaining calories.
 */

import { KCAL_PER_GRAM } from './tef'
import type { GoalId } from './types'

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
