import fs from 'node:fs'
import path from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App Component Layout', () => {
  it('sets the document page title to Notes Service', () => {
    render(<App />)
    expect(document.title).toBe('Notes Service')
  })

  it('provides an svg favicon containing the lowercase n letter', () => {
    const faviconContent = fs.readFileSync(path.resolve(process.cwd(), 'public/favicon.svg'), 'utf-8')
    expect(faviconContent).toContain('>n<')
  })

  it('renders all layout landmarks correctly with brand title', () => {
    render(<App />)

    // Header (banner role)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('Notes Service')).toBeInTheDocument()

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

  it('renders three action buttons with idle behavior in the left panel', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    expect(buttons).toHaveLength(3)
    expect(buttons.map((btn) => btn.textContent.trim())).toEqual([
      'Add a note',
      'List all notes',
      'Retrieve a note',
    ])

    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button')
      expect(() => button.click()).not.toThrow()
    })
  })
})

