import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [selectedAction, setSelectedAction] = useState(null)

  useEffect(() => {
    document.title = 'Notes Service'
  }, [])

  const handleButtonClick = (action) => {
    setSelectedAction(action)
  }

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-brand">Notes Service</p>
      </header>

      <aside className="app-panel app-panel-left" aria-label="Left panel">
        <h2>Menu</h2>
        <div className="panel-actions">
          <button type="button" className="panel-btn" onClick={() => handleButtonClick('Add a note')}>
            Add a note
          </button>
          <button type="button" className="panel-btn" onClick={() => handleButtonClick('List notes')}>
            List notes
          </button>
          <button type="button" className="panel-btn" onClick={() => handleButtonClick('Retrieve a note')}>
            Retrieve a note
          </button>
        </div>
      </aside>

      <main className="app-main">
        <h1>{selectedAction || 'Welcome to Notes Service'}</h1>
      </main>

      <aside className="app-panel app-panel-right" aria-label="Right panel">
        <h2>{selectedAction || ''}</h2>
      </aside>

      <footer className="app-footer">
        <p>Footer</p>
      </footer>
    </div>
  )
}

export default App
