/**
 * BMR / RMR prediction equations (kcal/day).
 *
 * Default engine: Mifflin-St Jeor, recommended by the Academy of Nutrition
 * and Dietetics as the most reliable equation for the general population
 * (within ±10% of measured RMR for ~82% of non-obese and ~70% of obese
 * adults; Frankenfield et al. 2005).
 *
 * When body fat % is known, Katch-McArdle keys on lean body mass and is
 * preferred for lean/muscular individuals.
 */

import type { Estimate, Profile, Sex } from './types'

/** Mifflin-St Jeor (1990). W kg, H cm, A years. */
export function mifflinStJeor(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

/** Harris-Benedict, revised by Roza & Shizgal (1984). Used for uncertainty spread. */
export function harrisBenedictRevised(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  return sex === 'male'
    ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
    : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age
}

/** Katch-McArdle: BMR = 370 + 21.6 × lean body mass (kg). bodyFatPct e.g. 20 = 20%. */
export function katchMcArdle(weightKg: number, bodyFatPct: number): number {
  const leanMassKg = weightKg * (1 - bodyFatPct / 100)
  return 370 + 21.6 * leanMassKg
}

/**
 * Best-estimate BMR for a profile: Katch-McArdle when body fat % is provided,
 * otherwise Mifflin-St Jeor.
 */
export function bmr(profile: Profile): number {
  const { sex, age, weightKg, heightCm, bodyFatPct } = profile
  if (bodyFatPct !== undefined) {
    return katchMcArdle(weightKg, bodyFatPct)
  }
  return mifflinStJeor(sex, weightKg, heightCm, age)
}

/**
 * BMR with an honest uncertainty band: ±10% around the primary estimate
 * (typical individual prediction error), widened if other established
 * equations fall outside that band.
 */
export function bmrEstimate(profile: Profile): Estimate {
  const { sex, age, weightKg, heightCm, bodyFatPct } = profile
  const primary = bmr(profile)

  const candidates = [
    primary,
    mifflinStJeor(sex, weightKg, heightCm, age),
    harrisBenedictRevised(sex, weightKg, heightCm, age),
  ]
  if (bodyFatPct !== undefined) {
    candidates.push(katchMcArdle(weightKg, bodyFatPct))
  }

  const low = Math.min(primary * 0.9, ...candidates)
  const high = Math.max(primary * 1.1, ...candidates)
  return { value: primary, low, high }
}
