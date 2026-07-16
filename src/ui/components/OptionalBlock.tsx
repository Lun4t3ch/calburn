/** A labeled on/off switch revealing extra inputs when enabled. */

import type { ReactNode } from 'react'

interface OptionalBlockProps {
  label: string
  hint?: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  children?: ReactNode
}

export function OptionalBlock({
  label,
  hint,
  enabled,
  onToggle,
  children,
}: OptionalBlockProps) {
  return (
    <div className={`optional-block${enabled ? ' optional-block-on' : ''}`}>
      <label className="optional-block-header">
        <span className="optional-block-label">
          {label}
          {hint && <span className="optional-block-hint">{hint}</span>}
        </span>
        <span className={`switch${enabled ? ' switch-on' : ''}`}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            aria-label={label}
          />
          <span className="switch-knob" aria-hidden />
        </span>
      </label>
      {enabled && <div className="optional-block-body">{children}</div>}
    </div>
  )
}
