import { describe, expect, it } from 'vitest'
import { navyBodyFatPct } from '../src/domain/bodyfat'

describe('navyBodyFatPct', () => {
  it('matches hand-computed reference for men', () => {
    // 180 cm, neck 38, waist 85:
    // 495 / (1.0324 - 0.19077·log10(47) + 0.15456·log10(180)) - 450 ≈ 16.1
    expect(
      navyBodyFatPct('male', 180, { neckCm: 38, waistCm: 85 }),
    ).toBeCloseTo(16.1, 0)
  })

  it('matches hand-computed reference for women', () => {
    // 168 cm, neck 33, waist 75, hip 100 ≈ 28.6
    expect(
      navyBodyFatPct('female', 168, { neckCm: 33, waistCm: 75, hipCm: 100 }),
    ).toBeCloseTo(28.6, 0)
  })

  it('returns null for impossible measurements', () => {
    // waist smaller than neck
    expect(navyBodyFatPct('male', 180, { neckCm: 50, waistCm: 40 })).toBeNull()
    // women without hip measurement
    expect(navyBodyFatPct('female', 168, { neckCm: 33, waistCm: 75 })).toBeNull()
  })

  it('clamps to a sane range', () => {
    const veryLean = navyBodyFatPct('male', 200, { neckCm: 45, waistCm: 60 })
    expect(veryLean).not.toBeNull()
    expect(veryLean!).toBeGreaterThanOrEqual(3)
    const veryHigh = navyBodyFatPct('male', 150, { neckCm: 30, waistCm: 180 })
    expect(veryHigh).not.toBeNull()
    expect(veryHigh!).toBeLessThanOrEqual(60)
  })
})
