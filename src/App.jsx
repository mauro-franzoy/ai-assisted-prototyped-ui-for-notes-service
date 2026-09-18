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
        <h2>Left panel</h2>
        <p>Sidebar content goes here.</p>
      </aside>

      <main className="app-main">
        <h1>Home</h1>
        <p>Main area content goes here.</p>
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
