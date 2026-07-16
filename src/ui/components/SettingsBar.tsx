/** Compact settings row: toggle tips, and reset dismissed tips. */

import { INSIGHTS } from '../../data/insights'
import { useAppStore } from '../../state/store'

export function SettingsBar() {
  const tipsEnabled = useAppStore((s) => s.tipsEnabled)
  const setTipsEnabled = useAppStore((s) => s.setTipsEnabled)
  const dismissedTips = useAppStore((s) => s.dismissedTips)
  const resetTips = useAppStore((s) => s.resetDismissedTips)

  const someDismissed = dismissedTips.length > 0
  const allDismissed = dismissedTips.length >= INSIGHTS.length

  return (
    <div className="settings-bar">
      <label className="settings-check">
        <input
          type="checkbox"
          checked={tipsEnabled}
          onChange={(e) => setTipsEnabled(e.target.checked)}
        />
        Show tips
      </label>
      {tipsEnabled && someDismissed && (
        <button type="button" className="settings-reset" onClick={resetTips}>
          {allDismissed ? 'Bring tips back' : 'Reset dismissed tips'}
        </button>
      )}
    </div>
  )
}
