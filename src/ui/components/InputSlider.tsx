/** Labeled slider with a live value readout. */

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
  return (
    <label className="input-slider">
      <span className="input-slider-row">
        <span className="input-slider-label">{label}</span>
        <span className="input-slider-value">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  )
}
