/**
 * BMI (Body Mass Index) = kg / m². WHO adult categories.
 *
 * Honesty note (surfaced in the UI): BMI is a population screening tool,
 * not a diagnosis. It cannot distinguish muscle from fat (AMA 2023 policy
 * flags this), so it reads high for muscular builds; body fat % is a
 * better personal guide when known.
 */

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return weightKg / (m * m)
}

export interface BmiCategory {
  id: 'under' | 'healthy' | 'over' | 'obese'
  label: string
  /** Upper bound (exclusive), WHO adult cutoffs. */
  max: number
}

export const BMI_CATEGORIES: BmiCategory[] = [
  { id: 'under', label: 'Underweight', max: 18.5 },
  { id: 'healthy', label: 'Healthy', max: 25 },
  { id: 'over', label: 'Overweight', max: 30 },
  { id: 'obese', label: 'Obese', max: Infinity },
]

export function bmiCategory(value: number): BmiCategory {
  return BMI_CATEGORIES.find((c) => value < c.max) ?? BMI_CATEGORIES[3]
}

/** Display scale bounds for the visual band. */
export const BMI_SCALE_MIN = 15
export const BMI_SCALE_MAX = 40

/** Position of a BMI value on the visual band, as a 0..100 percentage. */
export function bmiScalePct(value: number): number {
  const pct =
    ((value - BMI_SCALE_MIN) / (BMI_SCALE_MAX - BMI_SCALE_MIN)) * 100
  return Math.min(98, Math.max(2, pct))
}
