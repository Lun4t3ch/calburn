import { describe, expect, it } from 'vitest'
import { macroTargets, macroTargetsFromSplit } from '../src/domain/macros'

describe('macroTargets', () => {
  it('cutting: high protein (2.2 g/kg), fat ≥ 20% of calories, carbs fill the rest', () => {
    const t = macroTargets(2000, 80, 'moderateLoss')
    expect(t.proteinPerKg).toBe(2.2)
    expect(t.proteinG).toBe(176)
    // fat: max(2000·0.2/9 ≈ 44.4, 0.5·80 = 40) → ~44 g
    expect(t.fatG).toBe(44)
    // calories add up to the target (within rounding)
    const kcal = t.proteinG * 4 + t.fatG * 9 + t.carbsG * 4
    expect(Math.abs(kcal - 2000)).toBeLessThan(20)
  })

  it('gaining uses 1.8 g/kg protein', () => {
    const t = macroTargets(3000, 75, 'leanGain')
    expect(t.proteinPerKg).toBe(1.8)
    expect(t.proteinG).toBe(135)
  })

  it('maintenance uses 1.6 g/kg protein', () => {
    expect(macroTargets(2500, 70, 'maintain').proteinPerKg).toBe(1.6)
  })

  it('fat minimum of 0.5 g/kg wins on high-calorie plans for light people', () => {
    // 0.2·1600/9 ≈ 35.6 < 0.5·80 = 40 → fat floor by bodyweight
    const t = macroTargets(1600, 80, 'moderateLoss')
    expect(t.fatG).toBe(40)
  })

  it('never returns negative carbs on very low targets', () => {
    const t = macroTargets(1200, 100, 'aggressiveLoss')
    expect(t.carbsG).toBeGreaterThanOrEqual(0)
    expect(t.proteinG).toBeGreaterThanOrEqual(0)
  })

  it('custom goal uses the maintenance protein default', () => {
    expect(macroTargets(2400, 80, 'custom').proteinPerKg).toBe(1.6)
  })
})

describe('macroTargetsFromSplit', () => {
  it('converts a percentage split into grams', () => {
    // 2000 kcal at 30/40/30: protein 600/4=150 g, carbs 800/4=200 g, fat 600/9≈67 g
    const t = macroTargetsFromSplit(2000, 80, {
      proteinPct: 30,
      carbsPct: 40,
      fatPct: 30,
    })
    expect(t.proteinG).toBe(150)
    expect(t.carbsG).toBe(200)
    expect(t.fatG).toBe(67)
    expect(t.proteinPerKg).toBeCloseTo(1.9, 1)
  })

  it('grams re-sum to the target calories (within rounding)', () => {
    const t = macroTargetsFromSplit(2350, 70, {
      proteinPct: 25,
      carbsPct: 50,
      fatPct: 25,
    })
    const kcal = t.proteinG * 4 + t.carbsG * 4 + t.fatG * 9
    expect(Math.abs(kcal - 2350)).toBeLessThan(15)
  })
})
