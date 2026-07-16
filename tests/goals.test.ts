import { describe, expect, it } from 'vitest'
import { CALORIE_FLOOR, GOAL_PRESETS, caloriePlan } from '../src/domain/goals'

describe('caloriePlan', () => {
  it('moderate loss: 0.5% BW/week as a deficit', () => {
    // 100 kg → 0.5 kg/wk → 550 kcal/day deficit
    const plan = caloriePlan('moderateLoss', 3000, 100, 'male')
    expect(plan.weeklyChangeKg).toBeCloseTo(-0.5, 3)
    expect(plan.dailyDeltaKcal).toBeCloseTo(-550, 0)
    expect(plan.targetKcal).toBeCloseTo(2450, 0)
    expect(plan.floorApplied).toBe(false)
  })

  it('maintain: target equals maintenance', () => {
    const plan = caloriePlan('maintain', 2200, 70, 'female')
    expect(plan.targetKcal).toBe(2200)
    expect(plan.weeklyChangeKg).toBe(0)
  })

  it('gain goals produce a surplus', () => {
    const plan = caloriePlan('moderateGain', 2500, 70, 'male')
    expect(plan.dailyDeltaKcal).toBeGreaterThan(0)
    expect(plan.targetKcal).toBeGreaterThan(2500)
  })

  it('applies the female calorie floor and reports it', () => {
    // 60 kg, maintenance 1800, aggressive: −0.6 kg/wk → −660/day → 1140 < 1200
    const plan = caloriePlan('aggressiveLoss', 1800, 60, 'female')
    expect(plan.floorApplied).toBe(true)
    expect(plan.targetKcal).toBe(CALORIE_FLOOR.female)
    // achievable rate shrinks to match the floored target
    expect(plan.weeklyChangeKg).toBeCloseTo((-600 * 7) / 7700, 2)
  })

  it('applies the male calorie floor', () => {
    const plan = caloriePlan('aggressiveLoss', 1900, 55, 'male')
    expect(plan.floorApplied).toBe(true)
    expect(plan.targetKcal).toBe(CALORIE_FLOOR.male)
  })

  it('presets are ordered from loss to gain', () => {
    const rates = GOAL_PRESETS.map((g) => g.weeklyRatePct)
    const sorted = [...rates].sort((a, b) => a - b)
    expect(rates).toEqual(sorted)
  })
})
