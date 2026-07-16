/** Generic segmented control — used for sex, units, mode, job, leisure. */

interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  /** Stack options vertically (for longer labels on phones). */
  vertical?: boolean
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  vertical = false,
}: SegmentedProps<T>) {
  return (
    <div
      className={`segmented${vertical ? ' segmented-vertical' : ''}`}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`segment${value === opt.value ? ' segment-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
