/** Add/remove regular workouts with hours per week. */

import { MET_ACTIVITIES } from '../../data/met-values'
import type { Workout } from '../../domain/types'

interface WorkoutPickerProps {
  workouts: Workout[]
  onChange: (workouts: Workout[]) => void
}

const GROUP_LABELS: Record<string, string> = {
  walking: 'Walking & hiking',
  running: 'Running',
  cycling: 'Cycling',
  swimming: 'Swimming',
  gym: 'Gym',
  sports: 'Sports',
  other: 'Other',
}

const GROUPS = [...new Set(MET_ACTIVITIES.map((a) => a.group))]

export function WorkoutPicker({ workouts, onChange }: WorkoutPickerProps) {
  const usedIds = new Set(workouts.map((w) => w.activityId))
  const firstUnused = MET_ACTIVITIES.find((a) => !usedIds.has(a.id))

  const update = (index: number, patch: Partial<Workout>) => {
    onChange(workouts.map((w, i) => (i === index ? { ...w, ...patch } : w)))
  }

  return (
    <div className="workout-picker">
      {workouts.length === 0 && (
        <p className="workout-empty">No regular workouts — that's fine too.</p>
      )}
      {workouts.map((w, i) => (
        <div key={i} className="workout-row">
          <select
            value={w.activityId}
            onChange={(e) => update(i, { activityId: e.target.value })}
            aria-label="Workout type"
          >
            {GROUPS.map((g) => (
              <optgroup key={g} label={GROUP_LABELS[g] ?? g}>
                {MET_ACTIVITIES.filter((a) => a.group === g).map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <label className="workout-hours">
            <input
              type="range"
              min={0.5}
              max={14}
              step={0.5}
              value={w.hoursPerWeek}
              onChange={(e) => update(i, { hoursPerWeek: Number(e.target.value) })}
              aria-label="Hours per week"
            />
            <span>{w.hoursPerWeek} h/week</span>
          </label>
          <button
            type="button"
            className="workout-remove"
            aria-label="Remove workout"
            onClick={() => onChange(workouts.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      {firstUnused && (
        <button
          type="button"
          className="workout-add"
          onClick={() =>
            onChange([...workouts, { activityId: firstUnused.id, hoursPerWeek: 2 }])
          }
        >
          + Add a workout
        </button>
      )}
    </div>
  )
}
