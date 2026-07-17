/**
 * "Now vs future" BMI on a colored category band.
 * Future marker sits above the band, "now" below, so labels never collide.
 */

import {
  BMI_SCALE_MAX,
  BMI_SCALE_MIN,
  bmi,
  bmiCategory,
  bmiScalePct,
} from '../../domain/bmi'

interface BmiBandProps {
  weightNowKg: number
  weightFutureKg: number
  heightCm: number
  /** e.g. "6 mo" — label for the future marker. */
  futureLabel: string
  /** True when body fat % is provided (shows the better-guide note). */
  hasBodyFat: boolean
}

// Zone widths as % of the 15..40 display scale
const zoneWidth = (from: number, to: number) =>
  ((to - from) / (BMI_SCALE_MAX - BMI_SCALE_MIN)) * 100

export function BmiBand({
  weightNowKg,
  weightFutureKg,
  heightCm,
  futureLabel,
  hasBodyFat,
}: BmiBandProps) {
  const now = bmi(weightNowKg, heightCm)
  const future = bmi(weightFutureKg, heightCm)
  const changed = Math.abs(future - now) >= 0.1
  const nowCat = bmiCategory(now)
  const futureCat = bmiCategory(future)

  return (
    <div className="bmi-block">
      <p className="bmi-summary">
        BMI <strong>{now.toFixed(1)}</strong> ({nowCat.label})
        {changed && (
          <>
            {' '}
            → <strong>{future.toFixed(1)}</strong> ({futureCat.label}) in{' '}
            {futureLabel}
          </>
        )}
      </p>

      <div className="bmi-band-wrap">
        {changed && (
          <span
            className="bmi-marker bmi-marker-future"
            style={{ left: `${bmiScalePct(future)}%` }}
          >
            <span className="bmi-marker-label">{futureLabel}</span>
            <span className="bmi-marker-pin">▼</span>
          </span>
        )}
        <div className="bmi-band" role="img" aria-label={`BMI scale from ${BMI_SCALE_MIN} to ${BMI_SCALE_MAX}`}>
          <span className="bmi-zone bmi-zone-under" style={{ width: `${zoneWidth(15, 18.5)}%` }} />
          <span className="bmi-zone bmi-zone-healthy" style={{ width: `${zoneWidth(18.5, 25)}%` }} />
          <span className="bmi-zone bmi-zone-over" style={{ width: `${zoneWidth(25, 30)}%` }} />
          <span className="bmi-zone bmi-zone-obese" style={{ width: `${zoneWidth(30, 40)}%` }} />
        </div>
        <span
          className="bmi-marker bmi-marker-now"
          style={{ left: `${bmiScalePct(now)}%` }}
        >
          <span className="bmi-marker-pin">▲</span>
          <span className="bmi-marker-label">now</span>
        </span>
      </div>

      <div className="bmi-zone-labels">
        <span style={{ width: `${zoneWidth(15, 18.5)}%` }}>Under</span>
        <span style={{ width: `${zoneWidth(18.5, 25)}%` }}>Healthy</span>
        <span style={{ width: `${zoneWidth(25, 30)}%` }}>Overweight</span>
        <span style={{ width: `${zoneWidth(30, 40)}%` }}>Obese</span>
      </div>

      <p className="helper-text">
        BMI is a quick screening measure, not a diagnosis: it can't tell
        muscle from fat, so it reads high for muscular builds.{' '}
        {hasBodyFat
          ? 'Since you entered your body fat %, that number is a better personal guide than BMI.'
          : 'If you know your body fat %, that is a better personal guide (enter it under Advanced).'}
      </p>
    </div>
  )
}
