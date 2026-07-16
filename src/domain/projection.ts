/**
 * Adaptive weight trajectory.
 *
 * Instead of the flat "7700 kcal = 1 kg forever" rule (which overpredicts
 * long-term change), we re-estimate the full energy expenditure at the
 * projected weight each week, a lighter body burns less, so the curve
 * flattens toward a new equilibrium, mirroring the behavior of dynamic
 * models like Hall et al. (Lancet 2011) / the NIH Body Weight Planner.
 */

import { KCAL_PER_KG } from './goals'

export interface ProjectionPoint {
  week: number
  weightKg: number
  /** Estimated maintenance at this weight. */
  tdeeKcal: number
}

export interface ProjectionInputs {
  startWeightKg: number
  /** Fixed daily intake being simulated. */
  intakeKcal: number
  weeks: number
  /** Maintenance kcal/day as a function of bodyweight. */
  tdeeAt: (weightKg: number) => number
}

/** Simulate week-by-week weight change under a fixed intake. */
export function projectWeight({
  startWeightKg,
  intakeKcal,
  weeks,
  tdeeAt,
}: ProjectionInputs): ProjectionPoint[] {
  const points: ProjectionPoint[] = []
  let weight = startWeightKg

  for (let week = 0; week <= weeks; week++) {
    const tdee = tdeeAt(weight)
    points.push({ week, weightKg: weight, tdeeKcal: tdee })

    const dailyDelta = intakeKcal - tdee
    const nextWeight = weight + (dailyDelta * 7) / KCAL_PER_KG
    // Bodyweight can't go below a physiological floor; clamp defensively.
    weight = Math.max(nextWeight, startWeightKg * 0.5)
  }

  return points
}

/**
 * The weight at which the given intake would become maintenance
 * (where the projection levels off), found by simulating far ahead.
 */
export function equilibriumWeightKg(
  startWeightKg: number,
  intakeKcal: number,
  tdeeAt: (weightKg: number) => number,
): number {
  const points = projectWeight({
    startWeightKg,
    intakeKcal,
    weeks: 520, // 10 years ≈ fully converged
    tdeeAt,
  })
  return points[points.length - 1].weightKg
}
