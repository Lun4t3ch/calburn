/** Tappable explainer card for one energy component (BMR, NEAT, TEF, EAT). */

interface ComponentCardProps {
  color: string
  emoji: string
  name: string
  shortName: string
  kcal: number
  pctOfTotal: number
  explanation: string
  open: boolean
  onToggle: () => void
}

export function ComponentCard({
  color,
  emoji,
  name,
  shortName,
  kcal,
  pctOfTotal,
  explanation,
  open,
  onToggle,
}: ComponentCardProps) {
  return (
    <button
      type="button"
      className={`component-card${open ? ' component-card-open' : ''}`}
      onClick={onToggle}
      aria-expanded={open}
    >
      <span className="component-card-row">
        <span className="component-dot" style={{ background: color }} aria-hidden />
        <span className="component-card-title">
          <span aria-hidden>{emoji}</span> {shortName}
          <span className="component-card-name">, {name}</span>
        </span>
        <span className="component-card-numbers">
          <strong>{Math.round(kcal).toLocaleString('en-US')}</strong> kcal ·{' '}
          {Math.round(pctOfTotal)}%
        </span>
      </span>
      {open && <span className="component-card-explanation">{explanation}</span>}
    </button>
  )
}
