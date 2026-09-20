import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NoteCard from './NoteCard'

describe('NoteCard Component', () => {
  it('renders note card with correct content', () => {
    const mockNote = {
      id: 1,
      name: 'Test Note',
      text: 'Test content'
    }

    render(<NoteCard note={mockNote} />)

    expect(screen.getByText(/^id$/i)).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByText('Test Note')).toBeInTheDocument()
    expect(screen.getByText(/^text$/i)).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders note card with empty values', () => {
    const mockNote = {
      id: 1,
      name: '',
      text: ''
    }

    render(<NoteCard note={mockNote} />)

    expect(screen.getByText(/^id$/i)).toBeInTheDocument()
    expect(screen.getByText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByText(/^text$/i)).toBeInTheDocument()
  })

  it('calls onClick handler when card is clicked', () => {
    const mockNote = {
      id: 1,
      name: 'Test Note',
      text: 'Test content'
    }
    const onClick = vi.fn()

    render(<NoteCard note={mockNote} onClick={onClick} />)

    const card = screen.getByText('Test Note').closest('.note-card')
    fireEvent.click(card)

    expect(onClick).toHaveBeenCalledWith(mockNote)
  })
})