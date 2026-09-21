import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AddNote from './AddNote'

describe('AddNote Component', () => {
  it('renders input fields with labels and action buttons', () => {
    render(
      <AddNote
        noteName="Sample"
        onNoteNameChange={() => {}}
        noteText="Details"
        onNoteTextChange={() => {}}
      />
    )

    const nameInput = screen.getByLabelText(/name/i)
    const textInput = screen.getByLabelText(/text/i)

    expect(nameInput).toHaveValue('Sample')
    expect(textInput).toHaveValue('Details')
    expect(nameInput).toHaveAttribute('maxLength', '50')
    expect(textInput).toHaveAttribute('maxLength', '50')

    expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^clear$/i })).toBeInTheDocument()
  })

  it('calls onNoteNameChange and onNoteTextChange when inputs change', () => {
    const onNoteNameChange = vi.fn()
    const onNoteTextChange = vi.fn()

    render(
      <AddNote
        onNoteNameChange={onNoteNameChange}
        onNoteTextChange={onNoteTextChange}
      />
    )

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Name' } })
    expect(onNoteNameChange).toHaveBeenCalledTimes(1)

    fireEvent.change(screen.getByLabelText(/text/i), { target: { value: 'New Content' } })
    expect(onNoteTextChange).toHaveBeenCalledTimes(1)
  })

  it('calls onAddNote and onClearNote when buttons are clicked', () => {
    const onAddNote = vi.fn()
    const onClearNote = vi.fn()

    render(
      <AddNote
        onNoteNameChange={() => {}}
        onNoteTextChange={() => {}}
        onAddNote={onAddNote}
        onClearNote={onClearNote}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(onAddNote).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }))
    expect(onClearNote).toHaveBeenCalledTimes(1)
  })

  it('disables inputs and buttons when loading is true', () => {
    render(<AddNote loading={true} />)

    expect(screen.getByLabelText(/name/i)).toBeDisabled()
    expect(screen.getByLabelText(/text/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /adding\.\.\./i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /^clear$/i })).toBeDisabled()
  })
})
