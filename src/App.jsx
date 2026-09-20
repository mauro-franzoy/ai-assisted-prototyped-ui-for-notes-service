import { useEffect, useState } from 'react'
import './App.css'
import NoteCard from './components/NoteCard/NoteCard'

function App() {
  const [selectedAction, setSelectedAction] = useState(null)
  const [noteName, setNoteName] = useState('')
  const [noteText, setNoteText] = useState('')
  const [noteId, setNoteId] = useState('')
  const [showNotesList, setShowNotesList] = useState(false)
  const [showRetrievedNote, setShowRetrievedNote] = useState(false)
  const [retrievedNote, setRetrievedNote] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Notes Service'
  }, [])

  const handleButtonClick = (action) => {
    setSelectedAction(action)
  }

  const handleAddNote = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8080/noteservice/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: noteName,
          noteText: noteText,
          usersId: 1
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add note')
      }

      const data = await response.json()
      console.log('Note added successfully:', data)
      setNoteName('')
      setNoteText('')
    } catch (err) {
      setError(err.message)
      console.error('Error adding note:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearNote = () => {
    setNoteName('')
    setNoteText('')
  }

  const handleRetrieveNote = async (keepNoteId = false) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8080/noteservice/notes/${noteId}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to retrieve note')
      }

      const data = await response.json()
      // Assuming the API returns a note object with id, name, and noteText fields
      const noteData = {
        id: data.id,
        name: data.name,
        text: data.noteText
      }
      setRetrievedNote(noteData)
      setShowRetrievedNote(true)
      if (!keepNoteId) {
        setNoteId('')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error retrieving note:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearRetrieve = () => {
    setNoteId('')
  }

  const handleClearRetrievedNote = () => {
    setShowRetrievedNote(false)
    setRetrievedNote(null)
  }

  const handleListNotes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8080/noteservice/notes', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to list notes')
      }

      const data = await response.json()
      // Assuming the API returns an array of note objects
      const notesData = data.map(note => ({
        id: note.id,
        name: note.name,
        text: note.noteText
      }))
      setNotes(notesData)
      setShowNotesList(true)
    } catch (err) {
      setError(err.message)
      console.error('Error listing notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearListNotes = () => {
    setShowNotesList(false)
  }

  const handleNoteCardClick = async (note) => {
    // Switch to Retrieve a note action
    setSelectedAction('Retrieve a note')
    setShowNotesList(false)
    setShowRetrievedNote(false)
    
    // Set the note id and automatically retrieve it
    setNoteId(note.id.toString())
    await handleRetrieveNote(true)
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
        {error && <div className="error-message">{error}</div>}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="form-btn form-btn-add" 
                onClick={handleAddNote}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'add'}
              </button>
              <button 
                type="button" 
                className="form-btn form-btn-clear" 
                onClick={handleClearNote}
                disabled={loading}
              >
                clear
              </button>
            </div>
          </div>
        )}
        {selectedAction === 'Retrieve a note' && !showRetrievedNote && (
          <div className="note-form">
            <div className="form-field">
              <label htmlFor="note-id">Note id</label>
              <input
                id="note-id"
                type="text"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="form-btn form-btn-add" 
                onClick={handleRetrieveNote}
                disabled={loading}
              >
                {loading ? 'Retrieving...' : 'retrieve'}
              </button>
              <button 
                type="button" 
                className="form-btn form-btn-clear" 
                onClick={handleClearRetrieve}
                disabled={loading}
              >
                clear
              </button>
            </div>
          </div>
        )}
        {selectedAction === 'Retrieve a note' && showRetrievedNote && (
          <>
            <div className="form-actions">
              <button type="button" className="form-btn form-btn-clear" onClick={handleClearRetrievedNote}>
                clear
              </button>
            </div>
            {retrievedNote && <NoteCard note={retrievedNote} />}
          </>
        )}
        {selectedAction === 'List notes' && !showNotesList && (
          <div className="note-form">
            <div className="form-actions">
              <button 
                type="button" 
                className="form-btn form-btn-add" 
                onClick={handleListNotes}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'retrieve'}
              </button>
            </div>
          </div>
        )}
        {selectedAction === 'List notes' && showNotesList && (
          <>
            <div className="form-actions">
              <button type="button" className="form-btn form-btn-clear" onClick={handleClearListNotes}>
                clear
              </button>
            </div>
            <div className="notes-list-container">
              <div className="notes-grid">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} onClick={handleNoteCardClick} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <aside className="app-panel app-panel-right" aria-label="Right panel">
        <h2>{selectedAction || ''}</h2>
        {selectedAction && <p>{getActionInstruction(selectedAction)}</p>}
      </aside>

      <footer className="app-footer">
        <p>Notes Service</p>
      </footer>
    </div>
  )
}

export default App
