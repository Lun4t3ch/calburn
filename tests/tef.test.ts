import { describe, expect, it } from 'vitest'
import { macroKcal, tefFromIntake, tefFromMacros } from '../src/domain/tef'

describe('tefFromIntake', () => {
  it('is 10% of intake', () => {
    expect(tefFromIntake(2000)).toBe(200)
  })
})

describe('tefFromMacros', () => {
  it('applies per-macro thermic fractions', () => {
    // protein: 100 g · 4 · 0.25 = 100
    expect(tefFromMacros({ proteinG: 100, carbsG: 0, fatG: 0 })).toBe(100)
    // carbs: 200 g · 4 · 0.075 = 60
    expect(tefFromMacros({ proteinG: 0, carbsG: 200, fatG: 0 })).toBe(60)
    // fat: 100 g · 9 · 0.02 = 18
    expect(tefFromMacros({ proteinG: 0, carbsG: 0, fatG: 100 })).toBe(18)
    // alcohol: 20 g · 7 · 0.15 = 21
    expect(
      tefFromMacros({ proteinG: 0, carbsG: 0, fatG: 0, alcoholG: 20 }),
    ).toBe(21)
  })

  it('a high-protein diet has a higher TEF than the 10% default', () => {
    const macros = { proteinG: 180, carbsG: 150, fatG: 60 } // 1860 kcal
    expect(tefFromMacros(macros)).toBeGreaterThan(macroKcal(macros) * 0.1)
  })
})

describe('macroKcal', () => {
  it('sums calories from grams', () => {
    expect(macroKcal({ proteinG: 100, carbsG: 200, fatG: 80 })).toBe(
      400 + 800 + 720,
    )
  })
})
