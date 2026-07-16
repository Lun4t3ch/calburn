// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import App from '../src/App'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('<App /> end-to-end render', () => {
  it('mounts and shows the brand and a burn estimate', () => {
    render(<App />)
    expect(screen.getByText('CalBurn')).toBeTruthy()
    // The results total renders a kcal figure
    expect(screen.getAllByText(/kcal/i).length).toBeGreaterThan(0)
  })

  it('shows all four energy components', () => {
    render(<App />)
    // Each label appears in both the stacked bar and its explainer card
    for (const label of ['BMR', 'NEAT', 'TEF', 'Exercise']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
  })

  it('reveals advanced inputs when expanding the optional advanced section', () => {
    render(<App />)
    expect(screen.queryByText('Body fat %')).toBeNull()
    fireEvent.click(
      screen.getByRole('button', { name: /optional advanced input/i }),
    )
    expect(screen.getByText('Body fat %')).toBeTruthy()
    expect(screen.getByText('Daily steps')).toBeTruthy()
  })

  it('has a light/dark theme toggle', () => {
    render(<App />)
    const toggle = screen.getByRole('button', { name: /switch to (dark|light) mode/i })
    const before = document.documentElement.dataset.theme
    fireEvent.click(toggle)
    expect(document.documentElement.dataset.theme).not.toBe(before)
  })

  it('renders the goal planner with a food example day', () => {
    render(<App />)
    expect(screen.getByText('Your plan')).toBeTruthy()
    // A goal option and macro tiles exist
    expect(screen.getByRole('radio', { name: 'Moderate weight loss' })).toBeTruthy()
    expect(screen.getByText('protein')).toBeTruthy()
  })

  it('projects a weight change and chart when a loss goal is chosen', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('radio', { name: 'Aggressive weight loss' }))
    // Trajectory chart is an SVG with an accessible label
    expect(screen.getByLabelText(/Projected weight over/i)).toBeTruthy()
  })

  it('dismisses a tip and can bring tips back', () => {
    render(<App />)
    const dismissButtons = screen.getAllByLabelText('Dismiss this tip')
    expect(dismissButtons.length).toBeGreaterThan(0)
    fireEvent.click(dismissButtons[0])
    // Reset control appears once something is dismissed
    expect(screen.getByText(/Reset dismissed tips|Bring tips back/)).toBeTruthy()
  })

  it('toggles all tips off', () => {
    render(<App />)
    const showTips = screen.getByRole('checkbox', { name: /Show tips/i })
    expect(screen.getAllByLabelText('Dismiss this tip').length).toBeGreaterThan(0)
    fireEvent.click(showTips)
    expect(screen.queryAllByLabelText('Dismiss this tip').length).toBe(0)
  })
})
