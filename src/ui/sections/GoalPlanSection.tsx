/**
 * Goal-first planning: pick a goal → get a calorie plan, adaptive weight
 * trajectory, macro targets and food-equivalent example days.
 */

import { useState } from 'react'
import { Card } from '../components/Card'
import { InputSlider } from '../components/InputSlider'
import { InsightTip } from '../components/InsightTip'
import { OptionalBlock } from '../components/OptionalBlock'
import { Segmented } from '../components/Segmented'
import { TrajectoryChart } from '../components/TrajectoryChart'
import { caloriePlan, GOAL_PRESETS, getGoalPreset } from '../../domain/goals'
import { macroTargets } from '../../domain/macros'
import { equilibriumWeightKg, projectWeight } from '../../domain/projection'
import { exampleDays, type ExampleDay } from '../../domain/foodExamples'
import { formatWeight, formatWeightDelta } from '../../lib/format'
import { useAppStore } from '../../state/store'
import type { EnergyBreakdown, Profile } from '../../domain/types'

type Horizon = 13 | 26 | 52

interface GoalPlanSectionProps {
  energy: EnergyBreakdown
  profile: Profile
  /** Maintenance kcal/day as a function of bodyweight (adaptive model). */
  tdeeAt: (weightKg: number) => number
}

function FoodDay({ day, title, emoji }: { day: ExampleDay; title: string; emoji: string }) {
  return (
    <div className="food-day">
      <h3>
        <span aria-hidden>{emoji}</span> {title}
      </h3>
      <ul>
        {day.items.map(({ food, count }) => (
          <li key={food.id}>
            <span aria-hidden>{food.emoji}</span>{' '}
            {count > 1 ? `${count}× ` : ''}
            {food.label}
            <span className="food-portion"> — {food.portion}</span>
          </li>
        ))}
      </ul>
      <p className="food-day-total">
        ≈ {day.totalKcal.toLocaleString('en-US')} kcal
      </p>
    </div>
  )
}

export function GoalPlanSection({ energy, profile, tdeeAt }: GoalPlanSectionProps) {
  const goal = useAppStore((s) => s.goal)
  const setGoal = useAppStore((s) => s.setGoal)
  const currentIntakeKcal = useAppStore((s) => s.currentIntakeKcal)
  const setCurrentIntakeKcal = useAppStore((s) => s.setCurrentIntakeKcal)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const [horizon, setHorizon] = useState<Horizon>(26)

  const maintenance = energy.total.value
  const plan = caloriePlan(goal, maintenance, profile.weightKg, profile.sex)
  const preset = getGoalPreset(goal)

  const points = projectWeight({
    startWeightKg: profile.weightKg,
    intakeKcal: plan.targetKcal,
    weeks: horizon,
    tdeeAt,
  })
  const projected = points[points.length - 1]
  const totalChangeKg = projected.weightKg - profile.weightKg

  const macros = macroTargets(plan.targetKcal, profile.weightKg, goal)
  const [foodOpen, setFoodOpen] = useState(false)
  const [foodVariant, setFoodVariant] = useState(0)
  const days = exampleDays(plan.targetKcal, foodVariant)

  return (
    <Card
      title="Your plan"
      subtitle="Pick a goal and see what to eat — and where it takes you"
    >
      <div className="field">
        <span className="field-label">Goal</span>
        <Segmented
          vertical
          ariaLabel="Goal"
          value={goal}
          options={GOAL_PRESETS.map((g) => ({ value: g.id, label: g.label }))}
          onChange={setGoal}
        />
        <p className="helper-text">{preset.description}</p>
      </div>

      <InsightTip anchor="plan" rotation={GOAL_PRESETS.findIndex((g) => g.id === goal)} />

      <div className="plan-numbers">
        <div className="plan-number">
          <span className="plan-number-label">You burn now</span>
          <strong>{Math.round(maintenance).toLocaleString('en-US')}</strong>
          <span className="plan-number-unit">kcal/day</span>
        </div>
        <div className="plan-number plan-number-primary">
          <span className="plan-number-label">Eat about</span>
          <strong>{Math.round(plan.targetKcal).toLocaleString('en-US')}</strong>
          <span className="plan-number-unit">kcal/day</span>
        </div>
        <div className="plan-number">
          <span className="plan-number-label">Expected pace</span>
          <strong>
            {plan.weeklyChangeKg === 0
              ? '±0'
              : formatWeightDelta(plan.weeklyChangeKg, unitSystem).split(' ')[0]}
          </strong>
          <span className="plan-number-unit">
            {unitSystem === 'metric' ? 'kg' : 'lb'}/week
          </span>
        </div>
      </div>

      {plan.floorApplied && (
        <p className="plan-warning">
          ⚠️ We raised this target to {plan.targetKcal.toLocaleString('en-US')}{' '}
          kcal — going lower makes it very hard to get the nutrients you need
          without medical supervision. The pace shown reflects the safer target.
        </p>
      )}

      {goal !== 'maintain' && (
        <>
          <div className="field plan-horizon">
            <Segmented
              ariaLabel="Projection horizon"
              value={String(horizon) as '13' | '26' | '52'}
              options={[
                { value: '13', label: '3 months' },
                { value: '26', label: '6 months' },
                { value: '52', label: '1 year' },
              ]}
              onChange={(v) => setHorizon(Number(v) as Horizon)}
            />
          </div>

          <TrajectoryChart points={points} unitSystem={unitSystem} />

          <p className="helper-text plan-projection-text">
            Sticking to this, you'd be around{' '}
            <strong>{formatWeight(projected.weightKg, unitSystem)}</strong> in{' '}
            {Math.round(horizon / 4.345)} months (
            {formatWeightDelta(totalChangeKg, unitSystem)}). The curve bends
            because a {totalChangeKg < 0 ? 'lighter' : 'heavier'} body burns{' '}
            {totalChangeKg < 0 ? 'fewer' : 'more'} calories — that's why
            plateaus are normal, not failure.
          </p>
        </>
      )}

      <div className="field">
        <span className="field-label">Daily macros to aim for</span>
        <div className="macro-tiles">
          <div className="macro-tile">
            <strong>{macros.proteinG} g</strong>
            <span>protein</span>
          </div>
          <div className="macro-tile">
            <strong>{macros.carbsG} g</strong>
            <span>carbs</span>
          </div>
          <div className="macro-tile">
            <strong>{macros.fatG} g</strong>
            <span>fat</span>
          </div>
        </div>
        <p className="helper-text">
          Protein set at {macros.proteinPerKg} g per kg bodyweight —{' '}
          {goal.includes('Loss')
            ? 'extra high while losing, to protect your muscle and keep you full.'
            : 'enough to build and maintain muscle.'}
        </p>
      </div>

      <div className="field">
        <button
          type="button"
          className="food-toggle"
          aria-expanded={foodOpen}
          onClick={() => setFoodOpen(!foodOpen)}
        >
          <span aria-hidden>🍽️</span> What{' '}
          {Math.round(plan.targetKcal).toLocaleString('en-US')} kcal can look
          like
          <span className="food-toggle-chevron" aria-hidden>
            {foodOpen ? '▴' : '▾'}
          </span>
        </button>
        {foodOpen && (
          <>
            <div className="food-days">
              <FoodDay
                day={days.best}
                title="Whole foods — a full day"
                emoji="🥗"
              />
              <FoodDay
                day={days.worst}
                title="Fast food — gone fast"
                emoji="🍔"
              />
            </div>
            <div className="food-actions">
              <button
                type="button"
                className="food-next"
                onClick={() => setFoodVariant((v) => v + 1)}
                aria-label="Show another example"
              >
                More examples →
              </button>
            </div>
            <p className="helper-text">
              Same calories — very different amounts of food. That's why food
              choice matters more than willpower.
            </p>
          </>
        )}
      </div>

      <OptionalBlock
        label="I know roughly what I eat today"
        hint="Compare your current intake against your burn"
        enabled={currentIntakeKcal !== undefined}
        onToggle={(on) => setCurrentIntakeKcal(on ? 2200 : undefined)}
      >
        {currentIntakeKcal !== undefined && (
          <>
            <InputSlider
              label="Current intake"
              display={`${currentIntakeKcal.toLocaleString('en-US')} kcal/day`}
              value={currentIntakeKcal}
              min={1000}
              max={5000}
              step={50}
              onChange={setCurrentIntakeKcal}
            />
            <p className="helper-text">
              That's about{' '}
              <strong>
                {Math.abs(Math.round(currentIntakeKcal - maintenance)).toLocaleString('en-US')}{' '}
                kcal/day {currentIntakeKcal >= maintenance ? 'above' : 'below'}
              </strong>{' '}
              your estimated burn — long-term that drifts toward{' '}
              {formatWeight(
                equilibriumWeightKg(profile.weightKg, currentIntakeKcal, tdeeAt),
                unitSystem,
              )}
              . Remember: most people underestimate what they eat by 20–50%.
            </p>
          </>
        )}
      </OptionalBlock>
    </Card>
  )
}
