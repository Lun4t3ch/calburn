/** Horizontal stacked bar: the day's burn split into BMR/NEAT/TEF/EAT. */

import type { EnergyBreakdown } from '../../domain/types'

export interface EnergyComponentMeta {
  key: 'bmr' | 'neat' | 'tef' | 'eat'
  short: string
  color: string
}

export const ENERGY_COMPONENTS: EnergyComponentMeta[] = [
  { key: 'bmr', short: 'BMR', color: 'var(--color-bmr)' },
  { key: 'neat', short: 'NEAT', color: 'var(--color-neat)' },
  { key: 'tef', short: 'TEF', color: 'var(--color-tef)' },
  { key: 'eat', short: 'Exercise', color: 'var(--color-eat)' },
]

interface StackedEnergyBarProps {
  energy: EnergyBreakdown
  /** Highlight one segment (when its card is open). */
  selected?: string
  onSelect?: (key: string) => void
}

export function StackedEnergyBar({
  energy,
  selected,
  onSelect,
}: StackedEnergyBarProps) {
  const total = energy.total.value

  return (
    <div className="energy-bar" role="img" aria-label="Daily calorie breakdown">
      {ENERGY_COMPONENTS.map(({ key, short, color }) => {
        const value = energy[key]
        const pct = (value / total) * 100
        if (pct < 0.5) return null
        return (
          <button
            key={key}
            type="button"
            className={`energy-bar-segment${selected === key ? ' energy-bar-selected' : ''}`}
            style={{ width: `${pct}%`, background: color }}
            onClick={() => onSelect?.(key)}
            title={`${short}: ${Math.round(value)} kcal (${Math.round(pct)}%)`}
          >
            {pct >= 12 && <span className="energy-bar-label">{short}</span>}
          </button>
        )
      })}
    </div>
  )
}
