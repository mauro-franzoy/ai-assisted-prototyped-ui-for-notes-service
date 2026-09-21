import { useEffect, useState } from 'react'
import './App.css'
import NoteCard from './components/NoteCard/NoteCard'
import ReadNote from './components/ReadNote/ReadNote'
import AddNote from './components/AddNote/AddNote'
import RetrieveNote from './components/RetrieveNote/RetrieveNote'

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

  const clearAllFields = () => {
    setNoteName('')
    setNoteText('')
    setNoteId('')
    setError(null)
  }

  const handleButtonClick = (action) => {
    clearAllFields()
    setShowNotesList(false)
    setShowRetrievedNote(false)
    setSelectedAction(action)
  }

  const handleGoToWelcome = () => {
    clearAllFields()
    setShowNotesList(false)
    setShowRetrievedNote(false)
    setRetrievedNote(null)
    setSelectedAction(null)
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
      const noteData = {
        id: data.id,
        name: data.name,
        text: data.noteText
      }
      setRetrievedNote(noteData)
      setNoteName('')
      setNoteText('')
      setSelectedAction('Read a note')
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

  const handleRetrieveNote = async () => {
    const currentNoteId = noteId
    setNoteId('')
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8080/noteservice/notes/${currentNoteId}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to retrieve note')
      }

      const data = await response.json()
      const noteData = {
        id: data.id,
        name: data.name,
        text: data.noteText
      }
      setRetrievedNote(noteData)
      setShowRetrievedNote(false)
      setSelectedAction('Read a note')
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

  const handleClearReadNote = () => {
    clearAllFields()
    setRetrievedNote(null)
    setSelectedAction(null)
  }

  const handleNoteCardClick = (note) => {
    clearAllFields()
    setRetrievedNote(note)
    setShowNotesList(false)
    setSelectedAction('Read a note')
  }

  const getActionInstruction = (action) => {
    switch (action) {
      case 'Add a note':
        return 'Provide note values and click add.'
      case 'List notes':
        return 'Provide the filters if any and click retrieve.'
      case 'Retrieve a note':
        return 'Provide note id and click retrieve.'
      case 'Read a note':
        return 'View non-editable note details.'
      default:
        return ''
    }
  }

  return (
    <div className="app">
      <header className="app-header" onClick={handleGoToWelcome}>
        <p className="app-brand">Notes Service</p>
      </header>

      <aside className="app-panel app-panel-left" aria-label="Left panel">
        <h2>Menu</h2>
        <div className="panel-actions">
          <button
            type="button"
            className={`panel-btn ${selectedAction === 'Add a note' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Add a note')}
          >
            Add a note
          </button>
          <button
            type="button"
            className={`panel-btn ${selectedAction === 'List notes' ? 'active' : ''}`}
            onClick={() => handleButtonClick('List notes')}
          >
            List notes
          </button>
          <button
            type="button"
            className={`panel-btn ${selectedAction === 'Retrieve a note' ? 'active' : ''}`}
            onClick={() => handleButtonClick('Retrieve a note')}
          >
            Retrieve a note
          </button>
          <button
            type="button"
            className={`panel-btn ${selectedAction === 'Read a note' ? 'active' : ''}`}
            onClick={() => {}}
          >
            Read a note
          </button>
          <button
            type="button"
            className={`panel-btn ${!selectedAction ? 'active' : ''}`}
            onClick={handleGoToWelcome}
          >
            Welcome page
          </button>
        </div>
      </aside>

      <main className="app-main">
        <h1>{selectedAction || 'Welcome to Notes Service'}</h1>
        {error && <div className="error-message">{error}</div>}
        {selectedAction === 'Add a note' && (
          <AddNote
            noteName={noteName}
            onNoteNameChange={(e) => setNoteName(e.target.value)}
            noteText={noteText}
            onNoteTextChange={(e) => setNoteText(e.target.value)}
            onAddNote={handleAddNote}
            onClearNote={handleClearNote}
            loading={loading}
          />
        )}
        {selectedAction === 'Retrieve a note' && !showRetrievedNote && (
          <RetrieveNote
            noteId={noteId}
            onNoteIdChange={(e) => setNoteId(e.target.value)}
            onRetrieveNote={handleRetrieveNote}
            onClearRetrieve={handleClearRetrieve}
            loading={loading}
          />
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
        {selectedAction === 'Read a note' && (
          <ReadNote
            note={retrievedNote || { id: '', name: '', text: '' }}
            onClear={handleClearReadNote}
          />
        )}
      </main>

      <aside className="app-panel app-panel-right" aria-label="Right panel">
        <h2>{selectedAction || ''}</h2>
        {selectedAction && <p>{getActionInstruction(selectedAction)}</p>}
      </aside>

      <footer className="app-footer" onClick={handleGoToWelcome}>
        <p>Notes Service</p>
      </footer>
    </div>
  )
}

export default App
