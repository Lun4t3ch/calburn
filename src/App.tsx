function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>
          <span className="brand-flame" aria-hidden="true">
            🔥
          </span>{' '}
          CalBurn
        </h1>
        <p className="tagline">Know your burn — honest, science-based estimates</p>
      </header>
      <main className="app-main">
        <p className="placeholder">The calculator is under construction. 🚧</p>
      </main>
      <footer className="app-footer">
        <p>
          Estimates based on established scientific methods — a best possible
          guess, not exact science. Nothing you enter leaves your browser.
        </p>
      </footer>
    </div>
  )
}

export default App
