/**
 * NEAT (non-exercise activity thermogenesis) and EAT (exercise activity
 * thermogenesis) estimation.
 *
 * NEAT is modeled as a fraction of BMR by job type + leisure movement, so it
 * scales with body size. The fractions are calibrated so BMR + NEAT + TEF
 * lands on the conventional PAL multipliers (sedentary ≈ 1.2 ... heavy
 * physical work ≈ 1.9; FAO/WHO/UNU 2001, McArdle & Katch).
 *
 * EAT uses net METs — (MET − 1) × kg × hours — so resting burn is not
 * double-counted when summed with BMR (Compendium of Physical Activities).
 */

import { getMetActivity } from '../data/met-values'
import type { ActivityInputs, JobActivity, LeisureActivity } from './types'

/** NEAT from occupation, as a fraction of BMR. */
export const JOB_NEAT_FACTOR: Record<JobActivity, number> = {
  seated: 0.08, // desk job → overall PAL ≈ 1.2 with TEF
  seatedWithMovement: 0.2, // PAL ≈ 1.3–1.4
  standing: 0.3, // PAL ≈ 1.5
  physical: 0.5, // PAL ≈ 1.7
  heavyManual: 0.7, // PAL ≈ 1.9
}

/** Extra NEAT from moving around outside work, as a fraction of BMR. */
export const LEISURE_NEAT_FACTOR: Record<LeisureActivity, number> = {
  low: 0.02, // mostly on the couch
  moderate: 0.08, // errands, some walking, active household
  high: 0.15, // on your feet most of the day off work
}

/** kcal per step per kg bodyweight (≈0.045 kcal/step at 72 kg). */
const KCAL_PER_STEP_PER_KG = 0.00062

/** Daily steps a desk job + minimal leisure already accounts for. */
const BASELINE_STEPS = 3000

/**
 * NEAT in kcal/day.
 * If stepsPerDay is provided (advanced), it replaces the leisure estimate:
 * job NEAT + kcal from steps beyond the sedentary baseline.
 */
export function neatKcal(
  bmrKcal: number,
  weightKg: number,
  inputs: Pick<ActivityInputs, 'job' | 'leisure' | 'stepsPerDay'>,
): number {
  const jobNeat = bmrKcal * JOB_NEAT_FACTOR[inputs.job]
  if (inputs.stepsPerDay !== undefined) {
    const extraSteps = Math.max(0, inputs.stepsPerDay - BASELINE_STEPS)
    return jobNeat + extraSteps * KCAL_PER_STEP_PER_KG * weightKg
  }
  return jobNeat + bmrKcal * LEISURE_NEAT_FACTOR[inputs.leisure]
}

/** Net kcal burned by one workout session type, averaged per day. */
export function workoutKcalPerDay(
  activityId: string,
  hoursPerWeek: number,
  weightKg: number,
): number {
  const activity = getMetActivity(activityId)
  if (!activity) return 0
  const netMet = Math.max(0, activity.met - 1)
  return (netMet * weightKg * hoursPerWeek) / 7
}

/**
 * EAT in kcal/day. An exact kcal/day override (advanced, e.g. from a watch)
 * wins over the MET estimate.
 */
export function eatKcal(weightKg: number, inputs: ActivityInputs): number {
  if (inputs.exerciseKcalPerDayOverride !== undefined) {
    return Math.max(0, inputs.exerciseKcalPerDayOverride)
  }
  return inputs.workouts.reduce(
    (sum, w) => sum + workoutKcalPerDay(w.activityId, w.hoursPerWeek, weightKg),
    0,
  )
}
