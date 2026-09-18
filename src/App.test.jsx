import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App Component Layout', () => {
  it('renders all layout landmarks correctly', () => {
    render(<App />)

    // Header (banner role)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()

    // Left and Right panels (complementary roles with accessible names)
    expect(screen.getByRole('complementary', { name: /left panel/i })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: /right panel/i })).toBeInTheDocument()

    // Main area (main role)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /home/i })).toBeInTheDocument()

    // Footer (contentinfo role)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders expected section headings and placeholder text', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: /left panel/i })).toBeInTheDocument()
    expect(screen.getByText(/sidebar content goes here/i)).toBeInTheDocument()

    expect(screen.getByRole('heading', { level: 2, name: /right panel/i })).toBeInTheDocument()
    expect(screen.getByText(/details content goes here/i)).toBeInTheDocument()

    expect(screen.getByText(/main area content goes here/i)).toBeInTheDocument()
    expect(screen.getByText(/^footer$/i)).toBeInTheDocument()
  })
})
