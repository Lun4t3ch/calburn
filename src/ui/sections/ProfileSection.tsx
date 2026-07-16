/** Basics: sex, age, height, weight — with metric/imperial-aware sliders. */

import { Card } from '../components/Card'
import { InputSlider } from '../components/InputSlider'
import { Segmented } from '../components/Segmented'
import { formatHeight, formatWeight } from '../../lib/format'
import { useAppStore } from '../../state/store'

export function ProfileSection() {
  const profile = useAppStore((s) => s.profile)
  const unitSystem = useAppStore((s) => s.unitSystem)
  const setProfile = useAppStore((s) => s.setProfile)

  return (
    <Card title="About you" subtitle="The basics that drive your resting burn">
      <div className="field">
        <span className="field-label">Sex</span>
        <Segmented
          ariaLabel="Sex"
          value={profile.sex}
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
          ]}
          onChange={(sex) => setProfile({ sex })}
        />
      </div>

      <InputSlider
        label="Age"
        display={`${profile.age} years`}
        value={profile.age}
        min={18}
        max={90}
        onChange={(age) => setProfile({ age })}
      />

      <InputSlider
        label="Height"
        display={formatHeight(profile.heightCm, unitSystem)}
        value={profile.heightCm}
        min={140}
        max={215}
        onChange={(heightCm) => setProfile({ heightCm })}
      />

      <InputSlider
        label="Weight"
        display={formatWeight(profile.weightKg, unitSystem)}
        value={profile.weightKg}
        min={40}
        max={200}
        onChange={(weightKg) => setProfile({ weightKg })}
      />
    </Card>
  )
}
