import './ReadNote.css'

function ReadNote({ note = {}, onClear }) {
  return (
    <div className="read-note-container">
      <div className="form-field">
        <label htmlFor="read-note-id">id</label>
        <input
          id="read-note-id"
          type="text"
          value={note.id ?? ''}
          readOnly
          className="form-input read-note-input"
        />
      </div>
      <div className="form-field">
        <label htmlFor="read-note-name">note name</label>
        <input
          id="read-note-name"
          type="text"
          value={note.name ?? ''}
          readOnly
          className="form-input read-note-input"
        />
      </div>
      <div className="form-field">
        <label htmlFor="read-note-text">note text</label>
        <input
          id="read-note-text"
          type="text"
          value={note.text ?? ''}
          readOnly
          className="form-input read-note-input"
        />
      </div>
      <div className="form-actions">
        <button
          type="button"
          className="form-btn form-btn-clear"
          onClick={onClear}
        >
          clear
        </button>
      </div>
    </div>
  )
}

export default ReadNote
