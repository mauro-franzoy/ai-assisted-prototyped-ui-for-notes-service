import './AddNote.css'

function AddNote({
  noteName = '',
  onNoteNameChange,
  noteText = '',
  onNoteTextChange,
  onAddNote,
  onClearNote,
  loading = false,
}) {
  return (
    <div className="note-form add-note-form">
      <div className="form-field">
        <label htmlFor="note-name">Name</label>
        <input
          id="note-name"
          type="text"
          value={noteName}
          onChange={onNoteNameChange}
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
          onChange={onNoteTextChange}
          maxLength={50}
          className="form-input"
          disabled={loading}
        />
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="form-btn form-btn-add"
          onClick={onAddNote}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'add'}
        </button>
        <button
          type="button"
          className="form-btn form-btn-clear"
          onClick={onClearNote}
          disabled={loading}
        >
          clear
        </button>
      </div>
    </div>
  )
}

export default AddNote
