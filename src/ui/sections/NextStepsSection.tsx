/** Closing guidance: practical next steps after getting your numbers. */

import { useState } from 'react'

export function NextStepsSection() {
  const [open, setOpen] = useState(false)

  return (
    <section className={`card advanced-card${open ? ' advanced-card-open' : ''}`}>
      <button
        type="button"
        className="advanced-header"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="next-steps-icon" aria-hidden>
          🧭
        </span>
        <span className="advanced-titles">
          <span className="advanced-title">So, what's next?</span>
          <span className="advanced-subtitle">
            Practical guidance for turning these numbers into results
          </span>
        </span>
        <span className="advanced-chevron" aria-hidden>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open && (
        <div className="advanced-body">
          <ol className="next-steps-list">
            <li>
              <strong>Learn as you go.</strong> Take a moment to read the tips
              throughout this app; they cover the ideas that matter most, and
              each one is backed by published research.
            </li>
            <li>
              <strong>Track your food for a few weeks.</strong> Try a calorie
              tracker such as MyFitnessPal or Lifesum, and enter the calorie
              and macro targets you arrived at here. You don't need to track
              forever (unless you find it motivating). The real value is
              educational: after a few weeks you will know roughly what your
              everyday foods contain, and that knowledge stays with you for
              life.
            </li>
            <li>
              <strong>Find movement you actually enjoy.</strong> Pick an
              activity that keeps you active a few times a week, walking,
              lifting, cycling, a sport, anything. The best training is the
              kind you look forward to, because that's the kind you'll still
              be doing next year.
            </li>
            <li>
              <strong>Check back in.</strong> As your weight changes, your
              numbers change with it. Revisit CalBurn now and then and adjust
              your targets to match the new you.
            </li>
          </ol>
          <p className="next-steps-signoff">
            Small steps, repeated. You've got this. Good luck! 💪
          </p>
        </div>
      )}
    </section>
  )
}
