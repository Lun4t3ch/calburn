/**
 * App state: user profile, activity inputs and settings, persisted to
 * localStorage so nothing is lost between visits (and nothing ever leaves
 * the browser).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ActivityInputs,
  GoalId,
  MacroIntake,
  Profile,
  UnitSystem,
} from '../domain/types'

export type Theme = 'light' | 'dark'

export interface AppState {
  profile: Profile
  activity: ActivityInputs
  /** Optional macro intake (advanced) for precise TEF. */
  macros?: MacroIntake
  unitSystem: UnitSystem
  theme: Theme
  /** Whether the optional advanced-input section is expanded. */
  advancedOpen: boolean
  goal: GoalId
  /** Optional: what the user estimates they currently eat (kcal/day). */
  currentIntakeKcal?: number
  tipsEnabled: boolean
  dismissedTips: string[]

  setProfile: (patch: Partial<Profile>) => void
  setActivity: (patch: Partial<ActivityInputs>) => void
  setMacros: (macros: MacroIntake | undefined) => void
  setUnitSystem: (unitSystem: UnitSystem) => void
  setTheme: (theme: Theme) => void
  setAdvancedOpen: (open: boolean) => void
  setGoal: (goal: GoalId) => void
  setCurrentIntakeKcal: (kcal: number | undefined) => void
  setTipsEnabled: (enabled: boolean) => void
  dismissTip: (id: string) => void
  resetDismissedTips: () => void
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

/** First visit: follow the device's appearance; the user can toggle after. */
function systemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      activity: DEFAULT_ACTIVITY,
      macros: undefined,
      unitSystem: 'metric',
      theme: systemTheme(),
      advancedOpen: false,
      goal: 'maintain',
      currentIntakeKcal: undefined,
      tipsEnabled: true,
      dismissedTips: [],

      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
      setActivity: (patch) =>
        set((s) => ({ activity: { ...s.activity, ...patch } })),
      setMacros: (macros) => set({ macros }),
      setUnitSystem: (unitSystem) => set({ unitSystem }),
      setTheme: (theme) => set({ theme }),
      setAdvancedOpen: (advancedOpen) => set({ advancedOpen }),
      setGoal: (goal) => set({ goal }),
      setCurrentIntakeKcal: (currentIntakeKcal) => set({ currentIntakeKcal }),
      setTipsEnabled: (tipsEnabled) => set({ tipsEnabled }),
      dismissTip: (id) =>
        set((s) => ({
          dismissedTips: s.dismissedTips.includes(id)
            ? s.dismissedTips
            : [...s.dismissedTips, id],
        })),
      resetDismissedTips: () => set({ dismissedTips: [] }),
    }),
    { name: 'calburn' },
  ),
)
