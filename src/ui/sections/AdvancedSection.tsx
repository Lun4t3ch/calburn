/**
 * Optional advanced input, presented as a clearly-labeled expandable step in
 * the flow: body fat % (Katch-McArdle), macro intake (precise TEF), a custom
 * macro percentage split for targets, daily steps (replaces the leisure
 * estimate) and an exact exercise calorie override. Everything optional,
 * so the defaults stay honest.
 */

import { InputSlider } from '../components/InputSlider'
import { InsightTip } from '../components/InsightTip'
import { OptionalBlock } from '../components/OptionalBlock'
import { macroKcal } from '../../domain/tef'
import { useAppStore } from '../../state/store'
import type { MacroSplit } from '../../domain/types'

const DEFAULT_MACROS = { proteinG: 100, carbsG: 250, fatG: 70, alcoholG: 0 }

/** Balanced starting point for a custom split. */
const DEFAULT_SPLIT: MacroSplit = { proteinPct: 30, carbsPct: 40, fatPct: 30 }

/**
 * Change one macro's percentage and redistribute the difference across the
 * other two (proportionally to their current share) so the total stays 100.
 */
function rebalanceSplit(
  split: MacroSplit,
  key: keyof MacroSplit,
  value: number,
): MacroSplit {
  const clamped = Math.max(0, Math.min(100, value))
  const others = (['proteinPct', 'carbsPct', 'fatPct'] as const).filter(
    (k) => k !== key,
  )
  const restTotal = split[others[0]] + split[others[1]]
  const remaining = 100 - clamped
  const share0 =
    restTotal > 0
      ? Math.round((split[others[0]] / restTotal) * remaining)
      : Math.round(remaining / 2)
  const next = { ...split, [key]: clamped }
  next[others[0]] = share0
  next[others[1]] = remaining - share0
  return next
}

export function AdvancedSection() {
  const profile = useAppStore((s) => s.profile)
  const activity = useAppStore((s) => s.activity)
  const macros = useAppStore((s) => s.macros)
  const macroSplit = useAppStore((s) => s.macroSplit)
  const setProfile = useAppStore((s) => s.setProfile)
  const setActivity = useAppStore((s) => s.setActivity)
  const setMacros = useAppStore((s) => s.setMacros)
  const setMacroSplit = useAppStore((s) => s.setMacroSplit)
  const advancedOpen = useAppStore((s) => s.advancedOpen)
  const setAdvancedOpen = useAppStore((s) => s.setAdvancedOpen)

  return (
    <section className={`card advanced-card${advancedOpen ? ' advanced-card-open' : ''}`}>
      <button
        type="button"
        className="advanced-header"
        aria-expanded={advancedOpen}
        onClick={() => setAdvancedOpen(!advancedOpen)}
      >
        <span className="advanced-badge">Advanced</span>
        <span className="advanced-titles">
          <span className="advanced-title">Optional advanced input</span>
          <span className="advanced-subtitle">
            Body fat %, macros, daily steps, exact exercise calories, for a
            sharper estimate
          </span>
        </span>
        <span className="advanced-chevron" aria-hidden>
          {advancedOpen ? '▴' : '▾'}
        </span>
      </button>

      {advancedOpen && (
        <div className="advanced-body">
      <OptionalBlock
        label="Body fat %"
        hint="Unlocks a lean-mass formula (Katch-McArdle), better if you know your number"
        enabled={profile.bodyFatPct !== undefined}
        onToggle={(on) => setProfile({ bodyFatPct: on ? 25 : undefined })}
      >
        <InputSlider
          label="Body fat"
          display={`${profile.bodyFatPct ?? 25}%`}
          value={profile.bodyFatPct ?? 25}
          min={5}
          max={60}
          onChange={(bodyFatPct) => setProfile({ bodyFatPct })}
        />
        <p className="helper-text">
          Rough guide: fit men ~10 to 18%, average men ~18 to 28%; fit women
          ~18 to 25%, average women ~25 to 35%. A wrong guess here hurts more
          than leaving it off.
        </p>
      </OptionalBlock>

      <OptionalBlock
        label="What you eat (macros)"
        hint="Digesting protein burns 20 to 30% of its calories. This sharpens the TEF slice"
        enabled={macros !== undefined}
        onToggle={(on) => setMacros(on ? DEFAULT_MACROS : undefined)}
      >
        {macros && (
          <>
            <InputSlider
              label="Protein"
              display={`${macros.proteinG} g`}
              value={macros.proteinG}
              min={0}
              max={300}
              step={5}
              onChange={(proteinG) => setMacros({ ...macros, proteinG })}
            />
            <InputSlider
              label="Carbs"
              display={`${macros.carbsG} g`}
              value={macros.carbsG}
              min={0}
              max={500}
              step={5}
              onChange={(carbsG) => setMacros({ ...macros, carbsG })}
            />
            <InputSlider
              label="Fat"
              display={`${macros.fatG} g`}
              value={macros.fatG}
              min={0}
              max={200}
              step={5}
              onChange={(fatG) => setMacros({ ...macros, fatG })}
            />
            <InputSlider
              label="Alcohol"
              display={`${macros.alcoholG ?? 0} g`}
              value={macros.alcoholG ?? 0}
              min={0}
              max={100}
              step={5}
              onChange={(alcoholG) => setMacros({ ...macros, alcoholG })}
            />
            <p className="helper-text">
              ≈ {Math.round(macroKcal(macros)).toLocaleString('en-US')} kcal of
              food per day. (One beer ≈ 14 g alcohol.)
            </p>
          </>
        )}
      </OptionalBlock>

      <OptionalBlock
        label="Custom macro split (%)"
        hint="Choose how your target calories divide between protein, carbs and fat. Used for the macro targets in your plan."
        enabled={macroSplit !== undefined}
        onToggle={(on) => setMacroSplit(on ? DEFAULT_SPLIT : undefined)}
      >
        {macroSplit && (
          <>
            <InputSlider
              label="Protein"
              display={`${macroSplit.proteinPct}%`}
              value={macroSplit.proteinPct}
              min={0}
              max={100}
              onChange={(v) =>
                setMacroSplit(rebalanceSplit(macroSplit, 'proteinPct', v))
              }
            />
            <InputSlider
              label="Carbs"
              display={`${macroSplit.carbsPct}%`}
              value={macroSplit.carbsPct}
              min={0}
              max={100}
              onChange={(v) =>
                setMacroSplit(rebalanceSplit(macroSplit, 'carbsPct', v))
              }
            />
            <InputSlider
              label="Fat"
              display={`${macroSplit.fatPct}%`}
              value={macroSplit.fatPct}
              min={0}
              max={100}
              onChange={(v) =>
                setMacroSplit(rebalanceSplit(macroSplit, 'fatPct', v))
              }
            />
            <p className="helper-text">
              Total always stays at 100%: moving one slider rebalances the
              other two. The gram amounts appear under "Daily macros to aim
              for" in your plan below.
            </p>
          </>
        )}
      </OptionalBlock>

      <OptionalBlock
        label="Daily steps"
        hint="From your phone or watch. Replaces the rough 'moving around' estimate"
        enabled={activity.stepsPerDay !== undefined}
        onToggle={(on) => setActivity({ stepsPerDay: on ? 7000 : undefined })}
      >
        <InputSlider
          label="Steps per day"
          display={`${(activity.stepsPerDay ?? 7000).toLocaleString('en-US')} steps`}
          value={activity.stepsPerDay ?? 7000}
          min={1000}
          max={25000}
          step={500}
          onChange={(stepsPerDay) => setActivity({ stepsPerDay })}
        />
      </OptionalBlock>

      <OptionalBlock
        label="Exact exercise calories"
        hint="If your watch tracks workouts, enter its daily average instead of our estimate"
        enabled={activity.exerciseKcalPerDayOverride !== undefined}
        onToggle={(on) =>
          setActivity({ exerciseKcalPerDayOverride: on ? 300 : undefined })
        }
      >
        <InputSlider
          label="Exercise burn"
          display={`${activity.exerciseKcalPerDayOverride ?? 300} kcal/day`}
          value={activity.exerciseKcalPerDayOverride ?? 300}
          min={0}
          max={1500}
          step={25}
          onChange={(exerciseKcalPerDayOverride) =>
            setActivity({ exerciseKcalPerDayOverride })
          }
        />
        <p className="helper-text">
          Heads up: fitness trackers often overstate exercise burn, treat it
          as a rough guide.
        </p>
      </OptionalBlock>

          <InsightTip anchor="advanced" rotation={macros ? macros.proteinG : 0} />
        </div>
      )}
    </section>
  )
}
