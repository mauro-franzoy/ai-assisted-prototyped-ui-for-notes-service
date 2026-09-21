import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ReadNote from './ReadNote'

describe('ReadNote Component', () => {
  it('renders three non-editable fields with their proper labels', () => {
    const mockNote = {
      id: 1,
      name: 'Test Note',
      text: 'Test content'
    }

    render(<ReadNote note={mockNote} />)

    const idInput = screen.getByLabelText(/id/i)
    const nameInput = screen.getByLabelText(/note name/i)
    const textInput = screen.getByLabelText(/note text/i)

    expect(idInput).toBeInTheDocument()
    expect(nameInput).toBeInTheDocument()
    expect(textInput).toBeInTheDocument()

    expect(idInput).toHaveValue('1')
    expect(nameInput).toHaveValue('Test Note')
    expect(textInput).toHaveValue('Test content')

    expect(idInput).toHaveAttribute('readonly')
    expect(nameInput).toHaveAttribute('readonly')
    expect(textInput).toHaveAttribute('readonly')
  })

  it('renders empty fields when no note is provided', () => {
    render(<ReadNote />)

    const idInput = screen.getByLabelText(/id/i)
    const nameInput = screen.getByLabelText(/note name/i)
    const textInput = screen.getByLabelText(/note text/i)

    expect(idInput).toHaveValue('')
    expect(nameInput).toHaveValue('')
    expect(textInput).toHaveValue('')

    expect(idInput).toHaveAttribute('readonly')
    expect(nameInput).toHaveAttribute('readonly')
    expect(textInput).toHaveAttribute('readonly')
  })

  it('renders clear button and calls onClear when clicked', () => {
    const onClear = vi.fn()
    render(<ReadNote onClear={onClear} />)

    const clearButton = screen.getByRole('button', { name: /^clear$/i })
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton)
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
