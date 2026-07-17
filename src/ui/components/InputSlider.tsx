/**
 * Labeled slider with a live value readout, sized for touch:
 * big thumb + full-height hit area, plus − / + steppers for precision
 * (tap for one step, hold to repeat).
 */

import { useEffect, useRef } from 'react'

interface InputSliderProps {
  label: string
  /** Formatted value shown next to the label, e.g. "75 kg" or "5'11\"". */
  display: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export function InputSlider({
  label,
  display,
  value,
  min,
  max,
  step = 1,
  onChange,
}: InputSliderProps) {
  // Latest values for the hold-to-repeat timer (avoids stale closures).
  const stateRef = useRef({ value, min, max, step, onChange })
  stateRef.current = { value, min, max, step, onChange }

  const timerRef = useRef<number | undefined>(undefined)
  const delayRef = useRef<number | undefined>(undefined)

  const nudge = (dir: 1 | -1) => {
    const s = stateRef.current
    const next = Math.min(s.max, Math.max(s.min, s.value + dir * s.step))
    if (next !== s.value) s.onChange(next)
  }

  const stopHold = () => {
    if (delayRef.current !== undefined) window.clearTimeout(delayRef.current)
    if (timerRef.current !== undefined) window.clearInterval(timerRef.current)
    delayRef.current = undefined
    timerRef.current = undefined
  }

  const startHold = (dir: 1 | -1) => {
    nudge(dir)
    // After a short delay, repeat while held.
    delayRef.current = window.setTimeout(() => {
      timerRef.current = window.setInterval(() => nudge(dir), 90)
    }, 400)
  }

  useEffect(() => stopHold, [])

  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div className="input-slider">
      <span className="input-slider-row">
        <span className="input-slider-label">{label}</span>
        <span className="input-slider-value">{display}</span>
      </span>
      <div className="input-slider-controls">
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onPointerDown={() => startHold(-1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          −
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
        />
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onPointerDown={() => startHold(1)}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          +
        </button>
      </div>
    </div>
  )
}
