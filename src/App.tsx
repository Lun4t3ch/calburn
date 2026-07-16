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
        <p>
          Estimates use established scientific methods (Mifflin-St Jeor,
          Compendium of Physical Activities). They're a best possible guess —
          not exact science. Nothing you enter leaves your browser.
        </p>
      </footer>
    </div>
  )
}

export default App
