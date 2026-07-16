/**
 * TDEE assembly: BMR + NEAT + TEF + EAT, with an honest uncertainty band.
 *
 * TEF depends on intake. When no macros are given we assume eating at
 * maintenance, which gives the closed form:
 *   TDEE = BMR + NEAT + EAT + 0.1·TDEE  →  TDEE = (BMR + NEAT + EAT) / 0.9
 */

import { bmrEstimate } from './bmr'
import { eatKcal, neatKcal } from './activity'
import { MIXED_DIET_TEF_FRACTION, tefFromMacros } from './tef'
import type {
  ActivityInputs,
  EnergyBreakdown,
  MacroIntake,
  Profile,
} from './types'

export interface TdeeInputs {
  profile: Profile
  activity: ActivityInputs
  /** Advanced: daily macro intake for a precise TEF. */
  macros?: MacroIntake
}

/** Compute the full daily energy breakdown for a set of inputs. */
export function energyBreakdown({
  profile,
  activity,
  macros,
}: TdeeInputs): EnergyBreakdown {
  const bmrBand = bmrEstimate(profile)
  const neat = neatKcal(bmrBand.value, profile.weightKg, activity)
  const eat = eatKcal(profile.weightKg, activity)

  let tef: number
  let total: number
  if (macros) {
    tef = tefFromMacros(macros)
    total = bmrBand.value + neat + eat + tef
  } else {
    total = (bmrBand.value + neat + eat) / (1 - MIXED_DIET_TEF_FRACTION)
    tef = total * MIXED_DIET_TEF_FRACTION
  }

  // Scale the whole-day band by the BMR band's relative uncertainty -
  // BMR is the dominant and best-studied error source.
  const relLow = bmrBand.low / bmrBand.value
  const relHigh = bmrBand.high / bmrBand.value

  return {
    bmr: bmrBand.value,
    neat,
    eat,
    tef,
    total: { value: total, low: total * relLow, high: total * relHigh },
  }
}

/** Convenience: just the maintenance calories (kcal/day). */
export function maintenanceKcal(inputs: TdeeInputs): number {
  return energyBreakdown(inputs).total.value
}
