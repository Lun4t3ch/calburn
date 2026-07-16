import { describe, expect, it } from 'vitest'
import { equilibriumWeightKg, projectWeight } from '../src/domain/projection'

// Simple linear stand-in: maintenance = 30 kcal per kg bodyweight.
const tdeeAt = (w: number) => 30 * w

describe('projectWeight', () => {
  it('loses weight under a deficit and the curve flattens', () => {
    const points = projectWeight({
      startWeightKg: 100, // maintenance 3000
      intakeKcal: 2400,
      weeks: 52,
      tdeeAt,
    })
    expect(points[0].weightKg).toBe(100)
    // Weight decreases monotonically toward equilibrium (80 kg)
    for (let i = 1; i < points.length; i++) {
      expect(points[i].weightKg).toBeLessThan(points[i - 1].weightKg)
      expect(points[i].weightKg).toBeGreaterThan(80)
    }
    // Flattening: the first week's loss is bigger than the last week's
    const firstLoss = points[0].weightKg - points[1].weightKg
    const lastLoss = points[points.length - 2].weightKg - points[points.length - 1].weightKg
    expect(lastLoss).toBeLessThan(firstLoss)
  })

  it('gains weight under a surplus', () => {
    const points = projectWeight({
      startWeightKg: 70, // maintenance 2100
      intakeKcal: 2400,
      weeks: 26,
      tdeeAt,
    })
    expect(points[points.length - 1].weightKg).toBeGreaterThan(70)
  })

  it('stays flat when intake equals maintenance', () => {
    const points = projectWeight({
      startWeightKg: 80,
      intakeKcal: 2400,
      weeks: 10,
      tdeeAt,
    })
    for (const p of points) expect(p.weightKg).toBeCloseTo(80, 6)
  })

  it('reports the maintenance estimate at each projected weight', () => {
    const points = projectWeight({
      startWeightKg: 100,
      intakeKcal: 2400,
      weeks: 4,
      tdeeAt,
    })
    for (const p of points) expect(p.tdeeKcal).toBeCloseTo(30 * p.weightKg, 6)
  })
})

describe('equilibriumWeightKg', () => {
  it('converges to where intake = maintenance', () => {
    // 2400 kcal / 30 kcal/kg = 80 kg
    expect(equilibriumWeightKg(100, 2400, tdeeAt)).toBeCloseTo(80, 1)
    expect(equilibriumWeightKg(60, 2400, tdeeAt)).toBeCloseTo(80, 1)
  })
})
