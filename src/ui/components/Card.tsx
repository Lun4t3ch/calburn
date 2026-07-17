import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  /** Step number shown in a chip, marking the section's place in the flow. */
  step?: number
  children: ReactNode
}

export function Card({ title, subtitle, step, children }: CardProps) {
  return (
    <section className="card">
      {title && (
        <header className="card-header">
          {step !== undefined && <span className="card-step">{step}</span>}
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </header>
      )}
      {children}
    </section>
  )
}
