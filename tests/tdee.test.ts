import { describe, expect, it } from 'vitest'
import { energyBreakdown } from '../src/domain/tdee'
import type { TdeeInputs } from '../src/domain/tdee'

const deskWorker: TdeeInputs = {
  profile: { sex: 'male', age: 30, weightKg: 80, heightCm: 180 },
  activity: {
    job: 'seated',
    leisure: 'moderate',
    workouts: [{ activityId: 'strength-general', hoursPerWeek: 3 }],
  },
}

describe('energyBreakdown', () => {
  it('components sum to the total', () => {
    const e = energyBreakdown(deskWorker)
    expect(e.bmr + e.neat + e.eat + e.tef).toBeCloseTo(e.total.value, 6)
  })

  it('without macros, TEF is 10% of the total (maintenance assumption)', () => {
    const e = energyBreakdown(deskWorker)
    expect(e.tef).toBeCloseTo(e.total.value * 0.1, 6)
  })

  it('with macros, TEF comes from the macro mix', () => {
    const e = energyBreakdown({
      ...deskWorker,
      macros: { proteinG: 180, carbsG: 200, fatG: 70 },
    })
    // 180·4·0.25 + 200·4·0.075 + 70·9·0.02 = 180 + 60 + 12.6
    expect(e.tef).toBeCloseTo(252.6, 1)
    expect(e.bmr + e.neat + e.eat + e.tef).toBeCloseTo(e.total.value, 6)
  })

  it('desk worker lands near PAL ≈ 1.2–1.4 of BMR', () => {
    const e = energyBreakdown(deskWorker)
    const pal = e.total.value / e.bmr
    expect(pal).toBeGreaterThan(1.15)
    expect(pal).toBeLessThan(1.45)
  })

  it('heavy manual worker lands near PAL ≈ 1.9', () => {
    const e = energyBreakdown({
      ...deskWorker,
      activity: { job: 'heavyManual', leisure: 'moderate', workouts: [] },
    })
    const pal = e.total.value / e.bmr
    expect(pal).toBeGreaterThan(1.75)
    expect(pal).toBeLessThan(2.05)
  })

  it('the uncertainty band brackets the headline value', () => {
    const e = energyBreakdown(deskWorker)
    expect(e.total.low).toBeLessThan(e.total.value)
    expect(e.total.high).toBeGreaterThan(e.total.value)
  })

  it('BMR is the biggest component for a desk worker', () => {
    const e = energyBreakdown(deskWorker)
    expect(e.bmr).toBeGreaterThan(e.neat)
    expect(e.bmr).toBeGreaterThan(e.eat)
    expect(e.bmr).toBeGreaterThan(e.tef)
    // and ~60–75% of the total
    expect(e.bmr / e.total.value).toBeGreaterThan(0.55)
    expect(e.bmr / e.total.value).toBeLessThan(0.8)
  })
})
