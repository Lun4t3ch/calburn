/** Display formatting helpers. */

import { cmToFtIn, kgToLb } from '../domain/units'
import type { UnitSystem } from '../domain/types'

export function formatKcal(kcal: number): string {
  return `${Math.round(kcal).toLocaleString('en-US')} kcal`
}

export function formatWeight(kg: number, units: UnitSystem): string {
  return units === 'metric'
    ? `${Math.round(kg)} kg`
    : `${Math.round(kgToLb(kg))} lb`
}

export function formatHeight(cm: number, units: UnitSystem): string {
  if (units === 'metric') return `${Math.round(cm)} cm`
  const { feet, inches } = cmToFtIn(cm)
  return `${feet}'${inches}"`
}

export function formatWeightDelta(kg: number, units: UnitSystem): string {
  const value = units === 'metric' ? kg : kgToLb(kg)
  const unit = units === 'metric' ? 'kg' : 'lb'
  const rounded = Math.abs(value) < 1 ? value.toFixed(1) : value.toFixed(1)
  return `${kg > 0 ? '+' : ''}${rounded} ${unit}`
}
