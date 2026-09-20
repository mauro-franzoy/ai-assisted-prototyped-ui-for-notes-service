import './NoteCard.css'

function NoteCard({ note, onClick }) {
  return (
    <div className="note-card" onClick={() => onClick(note)}>
      <div className="note-card-label">id</div>
      <div className="note-card-value">{note.id}</div>
      <div className="note-card-label">name</div>
      <div className="note-card-value">{note.name}</div>
      <div className="note-card-label">text</div>
      <div className="note-card-value">{note.text}</div>
    </div>
  )
}

export default NoteCard