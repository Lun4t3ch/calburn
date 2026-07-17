import { describe, expect, it } from 'vitest'
import { bmi, bmiCategory, bmiScalePct } from '../src/domain/bmi'

describe('bmi', () => {
  it('computes kg/m²', () => {
    expect(bmi(80, 180)).toBeCloseTo(24.69, 2)
    expect(bmi(75, 170)).toBeCloseTo(25.95, 2)
  })
})

describe('bmiCategory', () => {
  it('maps WHO cutoffs, boundaries falling upward', () => {
    expect(bmiCategory(17).id).toBe('under')
    expect(bmiCategory(18.5).id).toBe('healthy')
    expect(bmiCategory(22).id).toBe('healthy')
    expect(bmiCategory(25).id).toBe('over')
    expect(bmiCategory(29.9).id).toBe('over')
    expect(bmiCategory(30).id).toBe('obese')
    expect(bmiCategory(45).id).toBe('obese')
  })
})

describe('bmiScalePct', () => {
  it('maps the display range 15..40 to 0..100 with clamping', () => {
    expect(bmiScalePct(27.5)).toBeCloseTo(50, 0)
    expect(bmiScalePct(10)).toBe(2) // clamped
    expect(bmiScalePct(50)).toBe(98) // clamped
  })
})
