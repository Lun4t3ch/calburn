/**
 * Weight trajectory line chart (single series).
 * 2px teal line, recessive grid, crosshair + tooltip on hover/touch,
 * direct label on the end point. No legend, the card title names it.
 */

import { useRef, useState } from 'react'
import type { ProjectionPoint } from '../../domain/projection'
import { kgToLb } from '../../domain/units'
import type { UnitSystem } from '../../domain/types'

interface TrajectoryChartProps {
  points: ProjectionPoint[]
  unitSystem: UnitSystem
}

const W = 640
const H = 220
const PAD = { top: 16, right: 56, bottom: 26, left: 44 }

export function TrajectoryChart({ points, unitSystem }: TrajectoryChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | undefined>()

  if (points.length < 2) return null

  const toDisplay = (kg: number) => (unitSystem === 'metric' ? kg : kgToLb(kg))
  const unit = unitSystem === 'metric' ? 'kg' : 'lb'

  const weights = points.map((p) => toDisplay(p.weightKg))
  let min = Math.min(...weights)
  let max = Math.max(...weights)
  if (max - min < 2) {
    // Flat line (maintenance): give the scale some air.
    min -= 1.5
    max += 1.5
  }
  const span = max - min

  const x = (i: number) =>
    PAD.left + (i / (points.length - 1)) * (W - PAD.left - PAD.right)
  const y = (w: number) =>
    PAD.top + ((max - w) / span) * (H - PAD.top - PAD.bottom)

  const path = weights
    .map((w, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(w).toFixed(1)}`)
    .join(' ')

  // 3 recessive horizontal gridlines
  const gridYs = [0.25, 0.5, 0.75].map((f) => ({
    value: max - span * f,
    py: PAD.top + f * (H - PAD.top - PAD.bottom),
  }))

  // X labels: start / middle / end, in months
  const lastWeek = points[points.length - 1].week
  const xLabels = [0, 0.5, 1].map((f) => ({
    px: PAD.left + f * (W - PAD.left - PAD.right),
    label:
      f === 0 ? 'now' : `${Math.round((lastWeek * f) / 4.345)} mo`,
  }))

  const locate = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const fx = ((clientX - rect.left) / rect.width) * W
    const i = Math.round(
      ((fx - PAD.left) / (W - PAD.left - PAD.right)) * (points.length - 1),
    )
    setHover(Math.max(0, Math.min(points.length - 1, i)))
  }

  const hoverPoint = hover !== undefined ? points[hover] : undefined
  const endW = weights[weights.length - 1]

  return (
    <div
      ref={wrapRef}
      className="trajectory-wrap"
      onMouseMove={(e) => locate(e.clientX)}
      onMouseLeave={() => setHover(undefined)}
      onTouchStart={(e) => locate(e.touches[0].clientX)}
      onTouchMove={(e) => locate(e.touches[0].clientX)}
      onTouchEnd={() => setHover(undefined)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="trajectory-chart"
        role="img"
        aria-label={`Projected weight over ${Math.round(lastWeek / 4.345)} months, from ${Math.round(weights[0])} to ${Math.round(endW)} ${unit}`}
      >
        {gridYs.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={g.py}
              y2={g.py}
              className="chart-grid"
            />
            <text x={PAD.left - 6} y={g.py + 3} className="chart-tick" textAnchor="end">
              {Math.round(g.value)}
            </text>
          </g>
        ))}

        {xLabels.map((l, i) => (
          <text
            key={i}
            x={l.px}
            y={H - 8}
            className="chart-tick"
            textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
          >
            {l.label}
          </text>
        ))}

        <path d={path} className="trajectory-line" />

        {/* Direct label on the end point */}
        <circle cx={x(points.length - 1)} cy={y(endW)} r={4} className="trajectory-end" />
        <text
          x={x(points.length - 1) + 8}
          y={y(endW) + 4}
          className="chart-end-label"
        >
          {Math.round(endW)} {unit}
        </text>

        {hoverPoint && hover !== undefined && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="chart-crosshair"
            />
            <circle cx={x(hover)} cy={y(weights[hover])} r={5} className="trajectory-hover-dot" />
          </g>
        )}
      </svg>

      {hoverPoint && (
        <div className="chart-tooltip" role="status">
          <strong>
            {toDisplay(hoverPoint.weightKg).toFixed(1)} {unit}
          </strong>{' '}
          after {hoverPoint.week} weeks · burns ≈{' '}
          {Math.round(hoverPoint.tdeeKcal).toLocaleString('en-US')} kcal/day
        </div>
      )}
    </div>
  )
}
