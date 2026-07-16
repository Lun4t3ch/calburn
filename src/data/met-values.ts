/**
 * Curated workout activities with MET values from the Compendium of
 * Physical Activities (Ainsworth et al. 2011 / 2024 update).
 * 1 MET ≈ 1 kcal per kg bodyweight per hour at rest.
 */

export interface MetActivity {
  id: string
  label: string
  met: number
  group: 'walking' | 'running' | 'cycling' | 'swimming' | 'gym' | 'sports' | 'other'
}

export const MET_ACTIVITIES: MetActivity[] = [
  // Walking
  { id: 'walking-casual', label: 'Walking (casual pace)', met: 3.0, group: 'walking' },
  { id: 'walking-brisk', label: 'Walking (brisk pace)', met: 4.8, group: 'walking' },
  { id: 'hiking', label: 'Hiking', met: 6.0, group: 'walking' },

  // Running
  { id: 'running-easy', label: 'Running (easy, ~8 km/h)', met: 8.5, group: 'running' },
  { id: 'running-moderate', label: 'Running (moderate, ~10 km/h)', met: 9.8, group: 'running' },
  { id: 'running-fast', label: 'Running (fast, ~12 km/h)', met: 11.8, group: 'running' },

  // Cycling
  { id: 'cycling-leisure', label: 'Cycling (leisure)', met: 4.0, group: 'cycling' },
  { id: 'cycling-moderate', label: 'Cycling (moderate)', met: 6.8, group: 'cycling' },
  { id: 'cycling-vigorous', label: 'Cycling (fast / spinning)', met: 10.0, group: 'cycling' },

  // Swimming
  { id: 'swimming-leisure', label: 'Swimming (leisure)', met: 6.0, group: 'swimming' },
  { id: 'swimming-laps', label: 'Swimming (laps, vigorous)', met: 9.8, group: 'swimming' },

  // Gym
  { id: 'strength-general', label: 'Strength training (general)', met: 3.5, group: 'gym' },
  { id: 'strength-vigorous', label: 'Strength training (heavy / vigorous)', met: 6.0, group: 'gym' },
  { id: 'circuit-training', label: 'Circuit training', met: 7.5, group: 'gym' },
  { id: 'hiit', label: 'HIIT / interval training', met: 11.0, group: 'gym' },
  { id: 'rowing-machine', label: 'Rowing machine (moderate)', met: 7.0, group: 'gym' },
  { id: 'elliptical', label: 'Elliptical trainer', met: 9.0, group: 'gym' },
  { id: 'yoga', label: 'Yoga / stretching', met: 2.5, group: 'gym' },

  // Sports
  { id: 'soccer', label: 'Football / soccer', met: 8.0, group: 'sports' },
  { id: 'basketball', label: 'Basketball', met: 7.5, group: 'sports' },
  { id: 'tennis', label: 'Tennis (singles)', met: 8.0, group: 'sports' },
  { id: 'padel-badminton', label: 'Padel / badminton', met: 6.0, group: 'sports' },
  { id: 'golf-walking', label: 'Golf (walking)', met: 4.3, group: 'sports' },
  { id: 'skiing-cross-country', label: 'Cross-country skiing', met: 9.0, group: 'sports' },
  { id: 'dancing', label: 'Dancing', met: 5.0, group: 'sports' },
]

const byId = new Map(MET_ACTIVITIES.map((a) => [a.id, a]))

export function getMetActivity(id: string): MetActivity | undefined {
  return byId.get(id)
}
