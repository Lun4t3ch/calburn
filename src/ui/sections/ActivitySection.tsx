/** How active: job type, everyday movement, and regular workouts. */

import { Card } from '../components/Card'
import { Segmented } from '../components/Segmented'
import { WorkoutPicker } from '../components/WorkoutPicker'
import { useAppStore } from '../../state/store'

export function ActivitySection() {
  const activity = useAppStore((s) => s.activity)
  const setActivity = useAppStore((s) => s.setActivity)

  return (
    <Card
      title="How you move"
      subtitle="Everyday movement usually burns more than workouts do"
    >
      <div className="field">
        <span className="field-label">Your job / daily occupation</span>
        <Segmented
          vertical
          ariaLabel="Job activity"
          value={activity.job}
          options={[
            { value: 'seated', label: 'Mostly seated (desk job)' },
            { value: 'seatedWithMovement', label: 'Seated, but often up and about' },
            { value: 'standing', label: 'On my feet most of the day' },
            { value: 'physical', label: 'Physically active work' },
            { value: 'heavyManual', label: 'Heavy manual labor' },
          ]}
          onChange={(job) => setActivity({ job })}
        />
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
    </Card>
  )
}
