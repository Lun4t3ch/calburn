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
  const mode = useAppStore((s) => s.mode)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const setMode = useAppStore((s) => s.setMode)
  const setUnitSystem = useAppStore((s) => s.setUnitSystem)

  // Advanced-only inputs stay saved when switching to easy mode, but only
  // apply in advanced mode — easy mode gives the simple estimate.
  const advanced = mode === 'advanced'
  const effProfile = advanced ? profile : { ...profile, bodyFatPct: undefined }
  const effActivity = advanced
    ? activity
    : {
        ...activity,
        stepsPerDay: undefined,
        exerciseKcalPerDayOverride: undefined,
      }
  const effMacros = advanced ? macros : undefined

  const energy = energyBreakdown({
    profile: effProfile,
    activity: effActivity,
    macros: effMacros,
  })

  // Maintenance as a function of bodyweight — drives the adaptive projection.
  const tdeeAt = (weightKg: number) =>
    energyBreakdown({
      profile: { ...effProfile, weightKg },
      activity: effActivity,
      macros: effMacros,
    }).total.value

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-top">
          <h1>
            <span aria-hidden="true">🔥</span> CalBurn
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
            <Segmented
              ariaLabel="Mode"
              value={mode}
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              onChange={setMode}
            />
          </div>
        </div>
        <p className="tagline">Know your burn — honest, science-based estimates</p>
      </header>

      <main className="app-main">
        <ProfileSection />
        <ActivitySection />
        {advanced && <AdvancedSection />}
        <ResultsSection energy={energy} />
        <GoalPlanSection energy={energy} profile={effProfile} tdeeAt={tdeeAt} />
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
