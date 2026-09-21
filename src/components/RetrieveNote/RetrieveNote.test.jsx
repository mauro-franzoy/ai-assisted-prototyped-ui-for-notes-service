import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RetrieveNote from './RetrieveNote'

describe('RetrieveNote Component', () => {
  it('renders note id input field with label and action buttons', () => {
    render(<RetrieveNote noteId="42" onNoteIdChange={() => {}} />)

    const idInput = screen.getByLabelText(/note id/i)
    expect(idInput).toHaveValue('42')

    expect(screen.getByRole('button', { name: /^retrieve$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^clear$/i })).toBeInTheDocument()
  })

  it('calls onNoteIdChange when input changes', () => {
    const onNoteIdChange = vi.fn()
    render(<RetrieveNote onNoteIdChange={onNoteIdChange} />)

    fireEvent.change(screen.getByLabelText(/note id/i), { target: { value: '10' } })
    expect(onNoteIdChange).toHaveBeenCalledTimes(1)
  })

  it('calls onRetrieveNote and onClearRetrieve when buttons are clicked', () => {
    const onRetrieveNote = vi.fn()
    const onClearRetrieve = vi.fn()

    render(
      <RetrieveNote
        onNoteIdChange={() => {}}
        onRetrieveNote={onRetrieveNote}
        onClearRetrieve={onClearRetrieve}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /^retrieve$/i }))
    expect(onRetrieveNote).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }))
    expect(onClearRetrieve).toHaveBeenCalledTimes(1)
  })

  it('disables input and buttons when loading is true', () => {
    render(<RetrieveNote loading={true} />)

    expect(screen.getByLabelText(/note id/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /retrieving\.\.\./i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /^clear$/i })).toBeDisabled()
  })
})
