import './RetrieveNote.css'

function RetrieveNote({
  noteId = '',
  onNoteIdChange,
  onRetrieveNote,
  onClearRetrieve,
  loading = false,
}) {
  return (
    <div className="note-form retrieve-note-form">
      <div className="form-field">
        <label htmlFor="note-id">Note id</label>
        <input
          id="note-id"
          type="text"
          value={noteId}
          onChange={onNoteIdChange}
          className="form-input"
          disabled={loading}
        />
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="form-btn form-btn-add"
          onClick={onRetrieveNote}
          disabled={loading}
        >
          {loading ? 'Retrieving...' : 'retrieve'}
        </button>
        <button
          type="button"
          className="form-btn form-btn-clear"
          onClick={onClearRetrieve}
          disabled={loading}
        >
          clear
        </button>
      </div>
    </div>
  )
}

export default RetrieveNote
