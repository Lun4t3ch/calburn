/** Add/remove regular workouts with hours per week, or a custom
 *  calories-per-session entry for anything not in the list. */

import { MET_ACTIVITIES } from '../../data/met-values'
import { CUSTOM_WORKOUT_ID } from '../../domain/activity'
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

  const changeActivity = (index: number, activityId: string) => {
    if (activityId === CUSTOM_WORKOUT_ID) {
      update(index, {
        activityId,
        kcalPerSession: workouts[index].kcalPerSession ?? 300,
        sessionsPerWeek: workouts[index].sessionsPerWeek ?? 3,
      })
    } else {
      update(index, { activityId })
    }
  }

  return (
    <div className="workout-picker">
      {workouts.length === 0 && (
        <p className="workout-empty">No regular workouts. That's fine too.</p>
      )}
      {workouts.map((w, i) => {
        const isCustom = w.activityId === CUSTOM_WORKOUT_ID
        return (
          <div key={i} className="workout-row">
            <select
              value={w.activityId}
              onChange={(e) => changeActivity(i, e.target.value)}
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
              <optgroup label="Custom">
                <option value={CUSTOM_WORKOUT_ID}>
                  Custom (enter calories burned)
                </option>
              </optgroup>
            </select>

            {isCustom ? (
              <>
                <label className="workout-hours">
                  <input
                    type="range"
                    min={50}
                    max={1500}
                    step={25}
                    value={w.kcalPerSession ?? 300}
                    onChange={(e) =>
                      update(i, { kcalPerSession: Number(e.target.value) })
                    }
                    aria-label="Calories per workout"
                  />
                  <span>{w.kcalPerSession ?? 300} kcal/workout</span>
                </label>
                <label className="workout-hours">
                  <input
                    type="range"
                    min={1}
                    max={14}
                    step={1}
                    value={w.sessionsPerWeek ?? 3}
                    onChange={(e) =>
                      update(i, { sessionsPerWeek: Number(e.target.value) })
                    }
                    aria-label="Workouts per week"
                  />
                  <span>{w.sessionsPerWeek ?? 3}× per week</span>
                </label>
                <p className="workout-custom-warning">
                  ⚠️ Careful with device numbers: in a Stanford study, wrist
                  trackers overstated calories burned by 27% to 93% depending
                  on the device (Shcherbina et al. 2017, J Pers Med). Entering
                  a bit less than your watch shows is usually closer to the
                  truth.
                </p>
              </>
            ) : (
              <label className="workout-hours">
                <input
                  type="range"
                  min={0.5}
                  max={14}
                  step={0.5}
                  value={w.hoursPerWeek}
                  onChange={(e) =>
                    update(i, { hoursPerWeek: Number(e.target.value) })
                  }
                  aria-label="Hours per week"
                />
                <span>{w.hoursPerWeek} h/week</span>
              </label>
            )}

            <button
              type="button"
              className="workout-remove"
              aria-label="Remove workout"
              onClick={() => onChange(workouts.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        )
      })}
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
