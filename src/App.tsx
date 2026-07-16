import { Segmented } from './ui/components/Segmented'
import { ProfileSection } from './ui/sections/ProfileSection'
import { ActivitySection } from './ui/sections/ActivitySection'
import { energyBreakdown } from './domain/tdee'
import { formatKcal } from './lib/format'
import { useAppStore } from './state/store'

function App() {
  const profile = useAppStore((s) => s.profile)
  const activity = useAppStore((s) => s.activity)
  const macros = useAppStore((s) => s.macros)
  const mode = useAppStore((s) => s.mode)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const setMode = useAppStore((s) => s.setMode)
  const setUnitSystem = useAppStore((s) => s.setUnitSystem)

  const energy = energyBreakdown({
    profile,
    activity,
    macros: mode === 'advanced' ? macros : undefined,
  })

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

        {/* Temporary preview — replaced by the full results view in Phase 4 */}
        <section className="card">
          <p className="preview-total">
            You burn about <strong>{formatKcal(energy.total.value)}</strong> per
            day{' '}
            <span className="preview-range">
              ({formatKcal(energy.total.low)} – {formatKcal(energy.total.high)})
            </span>
          </p>
        </section>
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
