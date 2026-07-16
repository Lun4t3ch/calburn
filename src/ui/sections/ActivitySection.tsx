/** How active: job type, everyday movement, and regular workouts. */

import { Card } from '../components/Card'
import { InsightTip } from '../components/InsightTip'
import { Segmented } from '../components/Segmented'
import { WorkoutPicker } from '../components/WorkoutPicker'
import { useAppStore } from '../../state/store'

export function ActivitySection() {
  const activity = useAppStore((s) => s.activity)
  const setActivity = useAppStore((s) => s.setActivity)
  // Rotate which contextual tip shows as the user edits this section.
  const rotation = activity.workouts.length

  return (
    <Card
      title="How you move"
      subtitle="Everyday movement usually burns more than workouts do"
    >
      <div className="field">
        <span className="field-label">Your job / daily occupation</span>
        <div className="select-wrap">
          <select
            className="glass-select"
            aria-label="Job activity"
            value={activity.job}
            onChange={(e) =>
              setActivity({ job: e.target.value as typeof activity.job })
            }
          >
            <option value="seated">Mostly seated (desk job or student)</option>
            <option value="seatedWithMovement">
              Seated, but often up and about
            </option>
            <option value="standing">On my feet most of the day</option>
            <option value="physical">Physically active work</option>
            <option value="heavyManual">Heavy manual labor</option>
          </select>
          <span className="select-chevron" aria-hidden>
            ▾
          </span>
        </div>
      </div>

      <div className="field">
        <span className="field-label">Moving around outside work</span>
        <Segmented
          ariaLabel="Leisure activity"
          value={activity.leisure}
          options={[
            { value: 'low', label: 'Not much' },
            { value: 'moderate', label: 'Some' },
            { value: 'high', label: 'A lot' },
          ]}
          onChange={(leisure) => setActivity({ leisure })}
        />
      </div>

      <div className="field">
        <span className="field-label">Regular workouts</span>
        <WorkoutPicker
          workouts={activity.workouts}
          onChange={(workouts) => setActivity({ workouts })}
        />
      </div>

      <InsightTip anchor="activity" rotation={rotation} />
    </Card>
  )
}
