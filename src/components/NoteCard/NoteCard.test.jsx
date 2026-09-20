import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NoteCard from './NoteCard'

describe('NoteCard Component', () => {
  it('renders note card with correct content', () => {
    const mockNote = {
      id: 1,
      name: 'Test Note',
      text: 'Test content'
    }

    render(<NoteCard note={mockNote} />)

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

    expect(screen.getByText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByText(/^text$/i)).toBeInTheDocument()
  })
})