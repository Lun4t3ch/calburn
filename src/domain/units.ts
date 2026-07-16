/** Unit conversions between metric and imperial. */

export const KG_PER_LB = 0.45359237
export const CM_PER_IN = 2.54
export const KJ_PER_KCAL = 4.184

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB
}

export function cmToIn(cm: number): number {
  return cm / CM_PER_IN
}

export function inToCm(inches: number): number {
  return inches * CM_PER_IN
}

/** 178 cm -> { feet: 5, inches: 10 } (inches rounded to nearest whole). */
export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalIn = Math.round(cmToIn(cm))
  return { feet: Math.floor(totalIn / 12), inches: totalIn % 12 }
}

export function ftInToCm(feet: number, inches: number): number {
  return inToCm(feet * 12 + inches)
}

export function kcalToKj(kcal: number): number {
  return kcal * KJ_PER_KCAL
}
