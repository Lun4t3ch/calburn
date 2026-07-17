/** Add/remove regular workouts with hours per week, or a custom
 *  calories-per-session entry for anything not in the list. */

import { MET_ACTIVITIES } from '../../data/met-values'
import { CUSTOM_WORKOUT_ID } from '../../domain/activity'
import type { Workout } from '../../domain/types'
import { InputSlider } from './InputSlider'

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
            <button
              type="button"
              className="workout-remove"
              aria-label="Remove workout"
              onClick={() => onChange(workouts.filter((_, j) => j !== i))}
            >
              ✕
            </button>

            {isCustom ? (
              <div className="workout-sliders">
                <InputSlider
                  label="Calories per workout"
                  display={`${w.kcalPerSession ?? 300} kcal`}
                  value={w.kcalPerSession ?? 300}
                  min={50}
                  max={1500}
                  step={25}
                  onChange={(kcalPerSession) => update(i, { kcalPerSession })}
                />
                <InputSlider
                  label="Workouts per week"
                  display={`${w.sessionsPerWeek ?? 3}× per week`}
                  value={w.sessionsPerWeek ?? 3}
                  min={1}
                  max={14}
                  step={1}
                  onChange={(sessionsPerWeek) => update(i, { sessionsPerWeek })}
                />
                <p className="workout-custom-warning">
                  ⚠️ Careful with device numbers: in a Stanford study, wrist
                  trackers overstated calories burned by 27% to 93% depending
                  on the device (Shcherbina et al. 2017, J Pers Med). Entering
                  a bit less than your watch shows is usually closer to the
                  truth.
                </p>
              </div>
            ) : (
              <div className="workout-sliders">
                <InputSlider
                  label="Hours per week"
                  display={`${w.hoursPerWeek.toFixed(1)} h/week`}
                  value={w.hoursPerWeek}
                  min={0.5}
                  max={14}
                  step={0.5}
                  onChange={(hoursPerWeek) => update(i, { hoursPerWeek })}
                />
              </div>
            )}
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
