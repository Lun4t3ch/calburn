/**
 * TEF — thermic effect of food: calories burned digesting and processing
 * what you eat.
 *
 * Mixed diet default ≈ 10% of intake. Per macronutrient (Westerterp 2004):
 * protein 20–30%, carbs 5–10%, fat 0–3%, alcohol ~10–30% — midpoints used.
 */

import type { MacroIntake } from './types'

export const MIXED_DIET_TEF_FRACTION = 0.1

export const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9, alcohol: 7 } as const

const TEF_FRACTION = { protein: 0.25, carbs: 0.075, fat: 0.02, alcohol: 0.15 } as const

/** Easy mode: TEF as ~10% of total intake. */
export function tefFromIntake(intakeKcal: number): number {
  return intakeKcal * MIXED_DIET_TEF_FRACTION
}

/** Advanced mode: TEF from macro grams. */
export function tefFromMacros(macros: MacroIntake): number {
  const { proteinG, carbsG, fatG, alcoholG = 0 } = macros
  return (
    proteinG * KCAL_PER_GRAM.protein * TEF_FRACTION.protein +
    carbsG * KCAL_PER_GRAM.carbs * TEF_FRACTION.carbs +
    fatG * KCAL_PER_GRAM.fat * TEF_FRACTION.fat +
    alcoholG * KCAL_PER_GRAM.alcohol * TEF_FRACTION.alcohol
  )
}

/** Total kcal represented by a set of macros. */
export function macroKcal(macros: MacroIntake): number {
  const { proteinG, carbsG, fatG, alcoholG = 0 } = macros
  return (
    proteinG * KCAL_PER_GRAM.protein +
    carbsG * KCAL_PER_GRAM.carbs +
    fatG * KCAL_PER_GRAM.fat +
    alcoholG * KCAL_PER_GRAM.alcohol
  )
}
