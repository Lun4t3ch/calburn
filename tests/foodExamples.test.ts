import { describe, expect, it } from 'vitest'
import { buildExampleDay, exampleDays } from '../src/domain/foodExamples'

describe('buildExampleDay', () => {
  it('never exceeds the calorie target', () => {
    for (const target of [1400, 1800, 2200, 2600, 3000]) {
      expect(buildExampleDay(target, 'healthy').totalKcal).toBeLessThanOrEqual(target)
      expect(buildExampleDay(target, 'indulgent').totalKcal).toBeLessThanOrEqual(target)
    }
  })

  it('fills close to the target', () => {
    const healthy = buildExampleDay(2200, 'healthy')
    expect(2200 - healthy.totalKcal).toBeLessThanOrEqual(100)
    const indulgent = buildExampleDay(2200, 'indulgent')
    expect(2200 - indulgent.totalKcal).toBeLessThanOrEqual(250)
  })

  it('only uses foods of the requested style', () => {
    const day = buildExampleDay(2000, 'healthy')
    for (const item of day.items) expect(item.food.style).toBe('healthy')
  })

  it('healthy days contain more items than indulgent days (the point!)', () => {
    const { best, worst } = exampleDays(2400)
    const count = (d: typeof best) => d.items.reduce((n, i) => n + i.count, 0)
    expect(count(best)).toBeGreaterThan(count(worst))
  })
})
