import './NoteCard.css'

function NoteCard({ note }) {
  return (
    <div className="note-card">
      <div className="note-card-label">name</div>
      <div className="note-card-value">{note.name}</div>
      <div className="note-card-label">text</div>
      <div className="note-card-value">{note.text}</div>
    </div>
  )
}

export default NoteCard