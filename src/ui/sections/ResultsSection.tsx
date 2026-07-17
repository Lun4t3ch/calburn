/** Main result: total burn with range, stacked bar, and explainer cards. */

import { useState } from 'react'
import { Card } from '../components/Card'
import { ComponentCard } from '../components/ComponentCard'
import { InsightTip } from '../components/InsightTip'
import { Segmented } from '../components/Segmented'
import {
  ENERGY_COMPONENTS,
  StackedEnergyBar,
} from '../components/StackedEnergyBar'
import type { EnergyBreakdown } from '../../domain/types'

type Period = 'day' | 'week' | 'month'

const PERIOD_FACTOR: Record<Period, number> = { day: 1, week: 7, month: 30.4 }

const COMPONENT_INFO: Record<
  string,
  { emoji: string; name: string; explanation: string }
> = {
  bmr: {
    emoji: '🫀',
    name: 'resting burn',
    explanation:
      'Your basal metabolic rate: the energy your body uses just staying alive: heartbeat, breathing, brain, body temperature. It runs 24/7, even if you never leave bed, and is usually the biggest slice by far.',
  },
  neat: {
    emoji: '🚶',
    name: 'everyday movement',
    explanation:
      'Non-exercise activity thermogenesis: everything that is movement but not a workout: your job, walking, chores, even fidgeting. This is the part that differs most between people, and often burns more than the gym does.',
  },
  tef: {
    emoji: '🍽️',
    name: 'digesting food',
    explanation:
      'The thermic effect of food: digesting and processing what you eat costs energy, roughly 10% of your intake. Protein is the most expensive to digest (20 to 30% of its calories), fat the cheapest (0 to 3%).',
  },
  eat: {
    emoji: '🏋️',
    name: 'workouts',
    explanation:
      'Exercise activity thermogenesis: your deliberate training. Important for health and fitness, but usually a smaller slice of daily burn than people expect. Consistency in everyday movement often matters more for calories.',
  },
}

interface ResultsSectionProps {
  energy: EnergyBreakdown
}

export function ResultsSection({ energy }: ResultsSectionProps) {
  const [period, setPeriod] = useState<Period>('day')
  const [openCard, setOpenCard] = useState<string | undefined>()

  const factor = PERIOD_FACTOR[period]
  const fmt = (kcal: number) =>
    Math.round(kcal * factor).toLocaleString('en-US')

  return (
    <Card
      step={4}
      title="Your burn"
      subtitle="Tap a color or card to see what each part means"
    >
      <div className="results-period">
        <Segmented
          ariaLabel="Period"
          value={period}
          options={[
            { value: 'day', label: 'Per day' },
            { value: 'week', label: 'Per week' },
            { value: 'month', label: 'Per month' },
          ]}
          onChange={setPeriod}
        />
      </div>

      <p className="results-total">
        ≈ <strong>{fmt(energy.total.value)}</strong> kcal
        <span className="results-range">
          {' '}
          ({fmt(energy.total.low)} - {fmt(energy.total.high)})
        </span>
      </p>

      <StackedEnergyBar
        energy={energy}
        selected={openCard}
        onSelect={(key) =>
          setOpenCard((cur) => (cur === key ? undefined : key))
        }
      />

      <div className="component-cards">
        {ENERGY_COMPONENTS.map(({ key, short, color }) => {
          const info = COMPONENT_INFO[key]
          return (
            <ComponentCard
              key={key}
              color={color}
              emoji={info.emoji}
              shortName={short}
              name={info.name}
              kcal={energy[key] * factor}
              pctOfTotal={(energy[key] / energy.total.value) * 100}
              explanation={info.explanation}
              open={openCard === key}
              onToggle={() =>
                setOpenCard((cur) => (cur === key ? undefined : key))
              }
            />
          )
        })}
      </div>

      <InsightTip anchor="results" rotation={openCard ? 1 : 0} />

      <p className="results-honesty">
        This is a starting estimate from established equations. Individual
        metabolisms vary by ±10% or more. The real test: watch your weight
        trend over 2 to 3 weeks and adjust.
      </p>
    </Card>
  )
}
