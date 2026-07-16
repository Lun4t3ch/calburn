import { describe, expect, it } from 'vitest'
import {
  cmToFtIn,
  cmToIn,
  ftInToCm,
  inToCm,
  kcalToKj,
  kgToLb,
  lbToKg,
} from '../src/domain/units'

describe('units', () => {
  it('converts kg to lb and back', () => {
    expect(kgToLb(100)).toBeCloseTo(220.462, 2)
    expect(lbToKg(220.462)).toBeCloseTo(100, 2)
    expect(lbToKg(kgToLb(83.7))).toBeCloseTo(83.7, 6)
  })

  it('converts cm to inches and back', () => {
    expect(cmToIn(180)).toBeCloseTo(70.866, 2)
    expect(inToCm(cmToIn(171.3))).toBeCloseTo(171.3, 6)
  })

  it('converts cm to feet + inches', () => {
    expect(cmToFtIn(180)).toEqual({ feet: 5, inches: 11 })
    expect(cmToFtIn(152)).toEqual({ feet: 5, inches: 0 })
    expect(ftInToCm(5, 11)).toBeCloseTo(180.34, 1)
  })

  it('converts kcal to kJ', () => {
    expect(kcalToKj(1000)).toBeCloseTo(4184, 0)
  })
})
