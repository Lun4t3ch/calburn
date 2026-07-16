import { describe, expect, it } from 'vitest'
import { eatKcal, neatKcal, workoutKcalPerDay } from '../src/domain/activity'
import type { ActivityInputs } from '../src/domain/types'

const BMR = 1780
const WEIGHT = 80

describe('neatKcal', () => {
  it('scales with job activity', () => {
    const base = { leisure: 'low' as const }
    const desk = neatKcal(BMR, WEIGHT, { ...base, job: 'seated' })
    const standing = neatKcal(BMR, WEIGHT, { ...base, job: 'standing' })
    const manual = neatKcal(BMR, WEIGHT, { ...base, job: 'heavyManual' })
    expect(desk).toBeLessThan(standing)
    expect(standing).toBeLessThan(manual)
    // seated + low leisure = (0.08 + 0.02)·1780 = 178
    expect(desk).toBeCloseTo(178, 0)
  })

  it('uses steps instead of leisure when provided', () => {
    const withSteps = neatKcal(BMR, WEIGHT, {
      job: 'seated',
      leisure: 'low',
      stepsPerDay: 13000,
    })
    // job 142.4 + (13000−3000)·0.00062·80 = 142.4 + 496 = 638.4
    expect(withSteps).toBeCloseTo(638.4, 0)
  })

  it('does not add step calories below the baseline', () => {
    const sedentarySteps = neatKcal(BMR, WEIGHT, {
      job: 'seated',
      leisure: 'high', // ignored because steps given
      stepsPerDay: 2000,
    })
    expect(sedentarySteps).toBeCloseTo(BMR * 0.08, 0)
  })
})

describe('workoutKcalPerDay', () => {
  it('uses net MET (MET − 1) averaged over the week', () => {
    // running-moderate MET 9.8 → net 8.8; 3 h/wk × 80 kg → 8.8·80·3/7 ≈ 301.7
    expect(
      workoutKcalPerDay(
        { activityId: 'running-moderate', hoursPerWeek: 3 },
        WEIGHT,
      ),
    ).toBeCloseTo(301.7, 0)
  })

  it('returns 0 for unknown activities', () => {
    expect(
      workoutKcalPerDay({ activityId: 'does-not-exist', hoursPerWeek: 5 }, WEIGHT),
    ).toBe(0)
  })

  it('custom workouts use kcal per session times sessions per week', () => {
    // 400 kcal × 3 sessions / 7 days ≈ 171.4 kcal/day
    expect(
      workoutKcalPerDay(
        {
          activityId: 'custom',
          hoursPerWeek: 0,
          kcalPerSession: 400,
          sessionsPerWeek: 3,
        },
        WEIGHT,
      ),
    ).toBeCloseTo(171.4, 0)
  })

  it('custom workouts ignore negative or missing values safely', () => {
    expect(
      workoutKcalPerDay({ activityId: 'custom', hoursPerWeek: 0 }, WEIGHT),
    ).toBe(0)
  })
})

describe('eatKcal', () => {
  const base: ActivityInputs = {
    job: 'seated',
    leisure: 'low',
    workouts: [
      { activityId: 'strength-general', hoursPerWeek: 3 }, // net 2.5·80·3/7 ≈ 85.7
      { activityId: 'walking-brisk', hoursPerWeek: 2 }, // net 3.8·80·2/7 ≈ 86.9
    ],
  }

  it('sums workouts', () => {
    expect(eatKcal(WEIGHT, base)).toBeCloseTo(85.7 + 86.9, 0)
  })

  it('exact override wins over the estimate', () => {
    expect(
      eatKcal(WEIGHT, { ...base, exerciseKcalPerDayOverride: 400 }),
    ).toBe(400)
  })
})
