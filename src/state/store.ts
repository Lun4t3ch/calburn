/**
 * App state: user profile, activity inputs and settings, persisted to
 * localStorage so nothing is lost between visits (and nothing ever leaves
 * the browser).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ActivityInputs,
  MacroIntake,
  Profile,
  UnitSystem,
} from '../domain/types'

export type Mode = 'easy' | 'advanced'

export interface AppState {
  profile: Profile
  activity: ActivityInputs
  /** Advanced mode: optional macro intake for precise TEF. */
  macros?: MacroIntake
  unitSystem: UnitSystem
  mode: Mode
  tipsEnabled: boolean
  dismissedTips: string[]

  setProfile: (patch: Partial<Profile>) => void
  setActivity: (patch: Partial<ActivityInputs>) => void
  setMacros: (macros: MacroIntake | undefined) => void
  setUnitSystem: (unitSystem: UnitSystem) => void
  setMode: (mode: Mode) => void
  setTipsEnabled: (enabled: boolean) => void
  dismissTip: (id: string) => void
}

export const DEFAULT_PROFILE: Profile = {
  sex: 'female',
  age: 35,
  weightKg: 75,
  heightCm: 170,
}

export const DEFAULT_ACTIVITY: ActivityInputs = {
  job: 'seated',
  leisure: 'moderate',
  workouts: [],
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      activity: DEFAULT_ACTIVITY,
      macros: undefined,
      unitSystem: 'metric',
      mode: 'easy',
      tipsEnabled: true,
      dismissedTips: [],

      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
      setActivity: (patch) =>
        set((s) => ({ activity: { ...s.activity, ...patch } })),
      setMacros: (macros) => set({ macros }),
      setUnitSystem: (unitSystem) => set({ unitSystem }),
      setMode: (mode) => set({ mode }),
      setTipsEnabled: (tipsEnabled) => set({ tipsEnabled }),
      dismissTip: (id) =>
        set((s) => ({
          dismissedTips: s.dismissedTips.includes(id)
            ? s.dismissedTips
            : [...s.dismissedTips, id],
        })),
    }),
    { name: 'calburn' },
  ),
)
