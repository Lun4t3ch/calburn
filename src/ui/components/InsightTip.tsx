/**
 * A contextual "Did you know?" tip.
 * ✕ hides the tip and asks (once, inline) whether to turn off all tips.
 * → cycles to the next available tip for this section.
 */

import { useState } from 'react'
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
  const setTipsEnabled = useAppStore((s) => s.setTipsEnabled)

  const [offset, setOffset] = useState(0)
  const [confirming, setConfirming] = useState(false)

  if (!tipsEnabled) return null

  // Inline follow-up after dismissing a tip
  if (confirming) {
    return (
      <aside className="insight-tip insight-tip-confirm" role="status">
        <div className="insight-tip-body">
          <span className="insight-tip-icon" aria-hidden>
            💡
          </span>
          <div>
            <p className="insight-tip-text">
              Tip hidden. Want to turn off all tips? (You can re-enable them at
              the bottom of the page.)
            </p>
            <div className="insight-tip-actions">
              <button
                type="button"
                className="tip-action tip-action-strong"
                onClick={() => setTipsEnabled(false)}
              >
                Turn off tips
              </button>
              <button
                type="button"
                className="tip-action"
                onClick={() => setConfirming(false)}
              >
                Keep tips
              </button>
            </div>
          </div>
        </div>
      </aside>
    )
  }

  const available = insightsFor(anchor, dismissedTips)
  if (available.length === 0) return null

  const tip = available[(rotation + offset) % available.length]

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
      <div className="insight-tip-controls">
        <button
          type="button"
          className="insight-tip-close"
          aria-label="Dismiss this tip"
          onClick={() => {
            dismissTip(tip.id)
            setConfirming(true)
          }}
        >
          ✕
        </button>
        {available.length > 1 && (
          <button
            type="button"
            className="insight-tip-next"
            aria-label="Next tip"
            onClick={() => setOffset((o) => o + 1)}
          >
            →
          </button>
        )}
      </div>
    </aside>
  )
}
