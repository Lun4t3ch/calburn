/**
 * US Navy circumference method for estimating body fat percentage
 * (Hodgdon & Beckett 1984, used by the US Navy). Accuracy is roughly
 * ±3 to 4% for most people; good enough to unlock the lean-mass BMR
 * formula for users who don't know their body fat.
 *
 * All measurements in centimeters.
 * Men:   495 / (1.0324 - 0.19077·log10(waist - neck) + 0.15456·log10(height)) - 450
 * Women: 495 / (1.29579 - 0.35004·log10(waist + hip - neck) + 0.22100·log10(height)) - 450
 */

import type { Sex } from './types'

export interface NavyMeasurements {
  neckCm: number
  waistCm: number
  /** Required for women, ignored for men. */
  hipCm?: number
}

/**
 * Estimated body fat % or null when the measurements are not usable
 * (e.g. waist smaller than neck). Result is clamped to 3 to 60%.
 */
export function navyBodyFatPct(
  sex: Sex,
  heightCm: number,
  { neckCm, waistCm, hipCm }: NavyMeasurements,
): number | null {
  let denominator: number

  if (sex === 'male') {
    const girth = waistCm - neckCm
    if (girth <= 0 || heightCm <= 0) return null
    denominator =
      1.0324 - 0.19077 * Math.log10(girth) + 0.15456 * Math.log10(heightCm)
  } else {
    if (hipCm === undefined) return null
    const girth = waistCm + hipCm - neckCm
    if (girth <= 0 || heightCm <= 0) return null
    denominator =
      1.29579 - 0.35004 * Math.log10(girth) + 0.221 * Math.log10(heightCm)
  }

  if (denominator <= 0) return null
  const pct = 495 / denominator - 450
  if (!Number.isFinite(pct)) return null
  return Math.min(60, Math.max(3, Math.round(pct * 10) / 10))
}
