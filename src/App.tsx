import { useEffect } from 'react'
import { InsightTip } from './ui/components/InsightTip'
import { Segmented } from './ui/components/Segmented'
import { SettingsBar } from './ui/components/SettingsBar'
import { ProfileSection } from './ui/sections/ProfileSection'
import { ActivitySection } from './ui/sections/ActivitySection'
import { AdvancedSection } from './ui/sections/AdvancedSection'
import { ResultsSection } from './ui/sections/ResultsSection'
import { GoalPlanSection } from './ui/sections/GoalPlanSection'
import { energyBreakdown } from './domain/tdee'
import { useAppStore } from './state/store'

function App() {
  const profile = useAppStore((s) => s.profile)
  const activity = useAppStore((s) => s.activity)
  const macros = useAppStore((s) => s.macros)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const theme = useAppStore((s) => s.theme)
  const setUnitSystem = useAppStore((s) => s.setUnitSystem)
  const setTheme = useAppStore((s) => s.setTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Advanced inputs (body fat %, macros, steps, exercise override) apply
  // whenever their toggles are on — they're simply undefined otherwise.
  const energy = energyBreakdown({ profile, activity, macros })

  // Maintenance as a function of bodyweight — drives the adaptive projection.
  const tdeeAt = (weightKg: number) =>
    energyBreakdown({
      profile: { ...profile, weightKg },
      activity,
      macros,
    }).total.value

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-top">
          <h1>
            <span aria-hidden="true">🔥</span>{' '}
            <span className="brand-cal">Cal</span>
            <span className="brand-burn">Burn</span>
          </h1>
          <div className="app-header-controls">
            <Segmented
              ariaLabel="Units"
              value={unitSystem}
              options={[
                { value: 'metric', label: 'kg/cm' },
                { value: 'imperial', label: 'lb/ft' },
              ]}
              onChange={setUnitSystem}
            />
            <button
              type="button"
              className="theme-toggle"
              aria-label={
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <p className="tagline">Know your burn — honest, science-based estimates</p>
      </header>

      <main className="app-main">
        <ProfileSection />
        <ActivitySection />
        <AdvancedSection />
        <ResultsSection energy={energy} />
        <GoalPlanSection energy={energy} profile={profile} tdeeAt={tdeeAt} />
        <InsightTip anchor="motivation" rotation={activity.workouts.length} />
        <SettingsBar />
      </main>

      <footer className="app-footer">
        <p className="footer-badges">
          <span className="footer-badge">🔬 Evidence-based</span>
          <span className="footer-badge">🔒 100% private</span>
          <span className="footer-badge">📴 Works offline</span>
        </p>
        <p>
          CalBurn uses established scientific methods — Mifflin-St Jeor and
          Katch-McArdle for resting burn, the Compendium of Physical Activities
          for movement, and a dynamic model (à la the NIH Body Weight Planner)
          for weight projection. These are the best possible estimates, not
          exact science: individual metabolism varies by ±10% or more, so treat
          every number as a starting point and let your real-world trend fine-tune
          it.
        </p>
        <p>
          Everything is calculated in your browser and saved only on this
          device — nothing you enter is ever sent anywhere. CalBurn is an
          educational tool, not medical advice; check with a doctor or dietitian
          before big changes, especially if you're pregnant, under 18, or have a
          health condition.
        </p>
      </footer>
    </div>
  )
}

export default App
