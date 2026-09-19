import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [selectedAction, setSelectedAction] = useState(null)
  const [noteName, setNoteName] = useState('')
  const [noteText, setNoteText] = useState('')
  const [noteId, setNoteId] = useState('')

  useEffect(() => {
    document.title = 'Notes Service'
  }, [])

  const handleButtonClick = (action) => {
    setSelectedAction(action)
  }

  const handleAddNote = () => {
    console.log('Adding note:', { name: noteName, text: noteText })
    setNoteName('')
    setNoteText('')
  }

  const handleClearNote = () => {
    setNoteName('')
    setNoteText('')
  }

  const handleRetrieveNote = () => {
    console.log('Retrieving note with id:', noteId)
    setNoteId('')
  }

  const handleClearRetrieve = () => {
    setNoteId('')
  }

  const getActionInstruction = (action) => {
    switch (action) {
      case 'Add a note':
        return 'Provide note values and click add.'
      case 'List notes':
        return 'Provide the filters if any and click retrieve.'
      case 'Retrieve a note':
        return 'Provide note id and click retrieve.'
      default:
        return ''
    }
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
        {selectedAction === 'Add a note' && (
          <div className="note-form">
            <div className="form-field">
              <label htmlFor="note-name">Name</label>
              <input
                id="note-name"
                type="text"
                value={noteName}
                onChange={(e) => setNoteName(e.target.value)}
                maxLength={50}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label htmlFor="note-text">text</label>
              <input
                id="note-text"
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                maxLength={50}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="form-btn form-btn-add" onClick={handleAddNote}>
                add
              </button>
              <button type="button" className="form-btn form-btn-clear" onClick={handleClearNote}>
                clear
              </button>
            </div>
          </div>
        )}
        {selectedAction === 'Retrieve a note' && (
          <div className="note-form">
            <div className="form-field">
              <label htmlFor="note-id">Note id</label>
              <input
                id="note-id"
                type="text"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="form-btn form-btn-add" onClick={handleRetrieveNote}>
                retrieve
              </button>
              <button type="button" className="form-btn form-btn-clear" onClick={handleClearRetrieve}>
                clear
              </button>
            </div>
          </div>
        )}
      </main>

      <aside className="app-panel app-panel-right" aria-label="Right panel">
        <h2>{selectedAction || ''}</h2>
        {selectedAction && <p>{getActionInstruction(selectedAction)}</p>}
      </aside>

      <footer className="app-footer">
        <p>Footer</p>
      </footer>
    </div>
  )
}

export default App
