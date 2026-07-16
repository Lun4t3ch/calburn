/**
 * A single contextual "Did you know?" tip. Individually closable; a global
 * setting can turn all tips off. Shows one tip per anchor, rotating on each
 * render-with-new-input via a caller-supplied index.
 */

import { insightsFor, type InsightAnchor } from '../../data/insights'
import { useAppStore } from '../../state/store'

interface InsightTipProps {
  anchor: InsightAnchor
  /** Rotates which tip shows when more than one is available. */
  rotation?: number
}

export function InsightTip({ anchor, rotation = 0 }: InsightTipProps) {
  const tipsEnabled = useAppStore((s) => s.tipsEnabled)
  const dismissedTips = useAppStore((s) => s.dismissedTips)
  const dismissTip = useAppStore((s) => s.dismissTip)

  if (!tipsEnabled) return null

  const available = insightsFor(anchor, dismissedTips)
  if (available.length === 0) return null

  const tip = available[rotation % available.length]

  return (
    <aside className={`insight-tip${tip.motivational ? ' insight-tip-motivation' : ''}`}>
      <div className="insight-tip-body">
        <span className="insight-tip-icon" aria-hidden>
          {tip.motivational ? '💚' : '💡'}
        </span>
        <div>
          <p className="insight-tip-text">{tip.text}</p>
          <p className="insight-tip-source">{tip.source}</p>
        </div>
      </div>
      <button
        type="button"
        className="insight-tip-close"
        aria-label="Dismiss this tip"
        onClick={() => dismissTip(tip.id)}
      >
        ✕
      </button>
    </aside>
  )
}
