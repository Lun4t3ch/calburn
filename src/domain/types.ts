/** Core shared types for the CalBurn calculation engine. */

export type Sex = 'male' | 'female'

export type UnitSystem = 'metric' | 'imperial'

/** How physically active the user's job / daily occupation is. */
export type JobActivity =
  | 'seated' // desk job, mostly sitting
  | 'seatedWithMovement' // sitting + regular walking around (teacher, nurse on light duty)
  | 'standing' // mostly standing / walking (retail, hospitality)
  | 'physical' // physical work (construction, farming)
  | 'heavyManual' // heavy manual labor (digging, carrying)

/** How much the user moves around outside of work and workouts. */
export type LeisureActivity = 'low' | 'moderate' | 'high'

export interface Profile {
  sex: Sex
  age: number // years
  weightKg: number
  heightCm: number
  /** Optional body fat percentage (e.g. 22 = 22%). Unlocks Katch-McArdle BMR. */
  bodyFatPct?: number
  /** Optional professionally measured RMR (indirect calorimetry). Beats all formulas. */
  measuredRmrKcal?: number
}

/** One regular workout the user does. */
export interface Workout {
  /** id into the MET table (see data/met-values.ts), or 'custom' */
  activityId: string
  hoursPerWeek: number
  /** Custom workout: estimated kcal burned per session. */
  kcalPerSession?: number
  /** Custom workout: sessions per week. */
  sessionsPerWeek?: number
}

export interface ActivityInputs {
  job: JobActivity
  leisure: LeisureActivity
  /** Exact watch/machine calories go in as a 'custom' workout entry. */
  workouts: Workout[]
  /** Advanced: average daily steps, replaces the leisure estimate when set. */
  stepsPerDay?: number
}

/** Advanced: daily macro intake in grams, used for a precise TEF estimate. */
export interface MacroIntake {
  proteinG: number
  carbsG: number
  fatG: number
  alcoholG?: number
}

/** A value with an honest uncertainty band. */
export interface Estimate {
  value: number
  low: number
  high: number
}

/** Full daily energy expenditure, decomposed. All values kcal/day. */
export interface EnergyBreakdown {
  bmr: number
  neat: number
  eat: number
  tef: number
  total: Estimate
}

export type GoalId =
  | 'aggressiveLoss'
  | 'moderateLoss'
  | 'mildLoss'
  | 'maintain'
  | 'leanGain'
  | 'moderateGain'
  | 'significantGain'
  /** User sets an exact daily calorie target themselves. */
  | 'custom'

/** A percentage distribution of calories across the three macros (sums to 100). */
export interface MacroSplit {
  proteinPct: number
  carbsPct: number
  fatPct: number
}
