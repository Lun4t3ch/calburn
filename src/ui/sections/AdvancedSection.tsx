/**
 * Optional advanced input, presented as a clearly-labeled expandable step in
 * the flow: body fat % (Katch-McArdle), what you actually eat (precise TEF),
 * daily steps (replaces the leisure estimate) and an exact exercise calorie
 * override. Everything optional, so the defaults stay honest.
 *
 * Note: the custom macro-target split lives in the plan section next to the
 * macro tiles it controls, NOT here. This section only refines the burn
 * estimate.
 */

import { useState } from 'react'
import { InputSlider } from '../components/InputSlider'
import { InsightTip } from '../components/InsightTip'
import { OptionalBlock } from '../components/OptionalBlock'
import { navyBodyFatPct } from '../../domain/bodyfat'
import { macroKcal, tefFromMacros } from '../../domain/tef'
import { useAppStore } from '../../state/store'
import type { UnitSystem } from '../../domain/types'

const DEFAULT_MACROS = { proteinG: 100, carbsG: 250, fatG: 70, alcoholG: 0 }

function formatTape(cm: number, units: UnitSystem): string {
  return units === 'metric' ? `${cm} cm` : `${(cm / 2.54).toFixed(1)}"`
}

export function AdvancedSection() {
  const profile = useAppStore((s) => s.profile)
  const activity = useAppStore((s) => s.activity)
  const macros = useAppStore((s) => s.macros)
  const setProfile = useAppStore((s) => s.setProfile)
  const setActivity = useAppStore((s) => s.setActivity)
  const setMacros = useAppStore((s) => s.setMacros)
  const advancedOpen = useAppStore((s) => s.advancedOpen)
  const setAdvancedOpen = useAppStore((s) => s.setAdvancedOpen)
  const unitSystem = useAppStore((s) => s.unitSystem)

  // Tape-measure estimator (US Navy method), local until applied.
  const [tapeOpen, setTapeOpen] = useState(false)
  const [neckCm, setNeckCm] = useState(37)
  const [waistCm, setWaistCm] = useState(85)
  const [hipCm, setHipCm] = useState(100)
  const navyEstimate = navyBodyFatPct(profile.sex, profile.heightCm, {
    neckCm,
    waistCm,
    hipCm,
  })

  return (
    <section className={`card advanced-card${advancedOpen ? ' advanced-card-open' : ''}`}>
      <button
        type="button"
        className="advanced-header"
        aria-expanded={advancedOpen}
        onClick={() => setAdvancedOpen(!advancedOpen)}
      >
        <span className="card-step">3</span>
        <span className="advanced-badge">Advanced</span>
        <span className="advanced-titles">
          <span className="advanced-title">Optional advanced input</span>
          <span className="advanced-subtitle">
            Body fat %, what you eat, daily steps, for a sharper estimate
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

        <button
          type="button"
          className="tape-toggle"
          aria-expanded={tapeOpen}
          onClick={() => setTapeOpen(!tapeOpen)}
        >
          📏 Don't know it? Estimate it with a tape measure {tapeOpen ? '▴' : '▾'}
        </button>
        {tapeOpen && (
          <div className="tape-body">
            <p className="helper-text">
              The US Navy circumference method, accurate to roughly ±3 to 4%
              for most people. Measure with a soft tape, snug but not tight:
              neck just below the Adam's apple, waist at the navel
              {profile.sex === 'female' ? ', hips at the widest point' : ''}.
            </p>
            <InputSlider
              label="Neck"
              display={formatTape(neckCm, unitSystem)}
              value={neckCm}
              min={25}
              max={60}
              onChange={setNeckCm}
            />
            <InputSlider
              label="Waist"
              display={formatTape(waistCm, unitSystem)}
              value={waistCm}
              min={50}
              max={180}
              onChange={setWaistCm}
            />
            {profile.sex === 'female' && (
              <InputSlider
                label="Hips"
                display={formatTape(hipCm, unitSystem)}
                value={hipCm}
                min={60}
                max={200}
                onChange={setHipCm}
              />
            )}
            {navyEstimate !== null ? (
              <button
                type="button"
                className="tape-apply"
                onClick={() => {
                  setProfile({ bodyFatPct: Math.round(navyEstimate) })
                  setTapeOpen(false)
                }}
              >
                Use this estimate: ≈ {navyEstimate}% body fat
              </button>
            ) : (
              <p className="helper-text">
                These measurements don't add up yet, double-check the tape
                readings.
              </p>
            )}
          </div>
        )}
      </OptionalBlock>

      <OptionalBlock
        label="Measured resting metabolism (RMR)"
        hint="Only if you've had a professional metabolic test. This replaces our formulas entirely."
        enabled={profile.measuredRmrKcal !== undefined}
        onToggle={(on) =>
          setProfile({ measuredRmrKcal: on ? 1600 : undefined })
        }
      >
        <InputSlider
          label="Measured RMR"
          display={`${(profile.measuredRmrKcal ?? 1600).toLocaleString('en-US')} kcal/day`}
          value={profile.measuredRmrKcal ?? 1600}
          min={800}
          max={3200}
          step={10}
          onChange={(measuredRmrKcal) => setProfile({ measuredRmrKcal })}
        />
        <p className="helper-text">
          What we're asking for: the resting calories from an indirect
          calorimetry test, a 10 to 20 minute breathing test done at sports
          labs, some gyms and clinics (often called an "RMR test" or
          "metabolic test"). If you have one, it beats any formula, so we use
          it directly. Note: the "BMR" printed by body-composition scales
          (like InBody) is itself a formula estimate, not a measurement, so
          prefer the breath test.
        </p>
      </OptionalBlock>

      <OptionalBlock
        label="What you actually eat today"
        hint="Only sharpens the 'digesting food' (TEF) slice of your burn estimate. It does not set your plan targets; those are below, under your plan."
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
              food per day; digesting it costs ≈{' '}
              {Math.round(tefFromMacros(macros)).toLocaleString('en-US')} kcal.
              That's the TEF slice in "Your burn" below. (One beer ≈ 14 g
              alcohol.)
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

      <p className="helper-text">
        Have exact workout calories from a watch or machine? Add a workout
        under "How you move" and choose "Custom (enter calories burned)",
        that way each session counts once, alongside your other workouts.
      </p>

          <InsightTip anchor="advanced" rotation={macros ? macros.proteinG : 0} />
        </div>
      )}
    </section>
  )
}
