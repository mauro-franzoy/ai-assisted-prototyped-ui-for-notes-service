import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    document.title = 'Notes Service'
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-brand">Notes Service</p>
      </header>

      <aside className="app-panel app-panel-left" aria-label="Left panel">
        <h2>Menu</h2>
        <div className="panel-actions">
          <button type="button" className="panel-btn">
            Add a note
          </button>
          <button type="button" className="panel-btn">
            List all notes
          </button>
          <button type="button" className="panel-btn">
            Retrieve a note
          </button>
        </div>
      </aside>

      <main className="app-main">
        <h1>Welcome to Notes Service</h1>
      </main>

      <aside className="app-panel app-panel-right" aria-label="Right panel">
        <h2>Right panel</h2>
        <p>Details content goes here.</p>
      </aside>

      <footer className="app-footer">
        <p>Footer</p>
      </footer>
    </div>
  )
}

export default App
