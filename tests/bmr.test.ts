import { describe, expect, it } from 'vitest'
import {
  bmr,
  bmrEstimate,
  harrisBenedictRevised,
  katchMcArdle,
  mifflinStJeor,
} from '../src/domain/bmr'
import type { Profile } from '../src/domain/types'

const man: Profile = { sex: 'male', age: 30, weightKg: 80, heightCm: 180 }
const woman: Profile = { sex: 'female', age: 30, weightKg: 65, heightCm: 168 }

describe('Mifflin-St Jeor', () => {
  it('matches hand-computed reference values', () => {
    // 10·80 + 6.25·180 − 5·30 + 5 = 1780
    expect(mifflinStJeor('male', 80, 180, 30)).toBe(1780)
    // 10·65 + 6.25·168 − 5·30 − 161 = 1389
    expect(mifflinStJeor('female', 65, 168, 30)).toBe(1389)
  })
})

describe('Katch-McArdle', () => {
  it('matches hand-computed reference values', () => {
    // LBM = 80·0.8 = 64 → 370 + 21.6·64 = 1752.4
    expect(katchMcArdle(80, 20)).toBeCloseTo(1752.4, 1)
  })
})

describe('Harris-Benedict (revised)', () => {
  it('matches hand-computed reference values', () => {
    // 88.362 + 13.397·80 + 4.799·180 − 5.677·30 = 1853.632
    expect(harrisBenedictRevised('male', 80, 180, 30)).toBeCloseTo(1853.63, 1)
  })
})

describe('bmr()', () => {
  it('uses Mifflin-St Jeor when no body fat % given', () => {
    expect(bmr(man)).toBe(1780)
    expect(bmr(woman)).toBe(1389)
  })

  it('uses Katch-McArdle when body fat % given', () => {
    expect(bmr({ ...man, bodyFatPct: 20 })).toBeCloseTo(1752.4, 1)
  })

  it('a measured RMR beats every formula', () => {
    expect(bmr({ ...man, bodyFatPct: 20, measuredRmrKcal: 1900 })).toBe(1900)
  })
})

describe('bmrEstimate()', () => {
  it('band contains the primary value and is at least ±10%', () => {
    const est = bmrEstimate(man)
    expect(est.value).toBe(1780)
    expect(est.low).toBeLessThanOrEqual(1780 * 0.9)
    expect(est.high).toBeGreaterThanOrEqual(1780 * 1.1)
  })

  it('band widens to include Harris-Benedict when outside ±10%', () => {
    const est = bmrEstimate(man)
    // HB revised (1853.6) is inside 1780·1.1 = 1958, so high = 1958
    expect(est.high).toBeCloseTo(1958, 0)
  })

  it('a measured RMR gets a tighter ±5% band, ignoring formula spread', () => {
    const est = bmrEstimate({ ...man, measuredRmrKcal: 2000 })
    expect(est.value).toBe(2000)
    expect(est.low).toBeCloseTo(1900, 0)
    expect(est.high).toBeCloseTo(2100, 0)
  })
})
