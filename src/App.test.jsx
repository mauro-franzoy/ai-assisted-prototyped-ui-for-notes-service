import fs from 'node:fs'
import path from 'node:path'
import { render, screen, within, fireEvent, act } from '@testing-library/react'
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
    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()

    // Footer (contentinfo role)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders expected section headings and placeholder text', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: /menu/i })).toBeInTheDocument()

    expect(screen.queryByText(/details content goes here/i)).not.toBeInTheDocument()
    expect(screen.getByText(/^note service$/i)).toBeInTheDocument()
  })

  it('renders three action buttons with idle behavior in the left panel', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    expect(buttons).toHaveLength(3)
    expect(buttons.map((btn) => btn.textContent.trim())).toEqual([
      'Add a note',
      'List notes',
      'Retrieve a note',
    ])

    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button')
      act(() => {
        expect(() => button.click()).not.toThrow()
      })
    })
  })

  it('updates main area and right panel titles when buttons are clicked', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Add a note" button
    act(() => {
      fireEvent.click(buttons[0])
    })
    expect(screen.getByRole('heading', { level: 1, name: /add a note/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /add a note/i })).toBeInTheDocument()
    expect(screen.getByText(/provide note values and click add/i)).toBeInTheDocument()

    // Click "List notes" button
    act(() => {
      fireEvent.click(buttons[1])
    })
    expect(screen.getByRole('heading', { level: 1, name: /list notes/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /list notes/i })).toBeInTheDocument()
    expect(screen.getByText(/provide the filters if any and click retrieve/i)).toBeInTheDocument()

    // Click "Retrieve a note" button
    act(() => {
      fireEvent.click(buttons[2])
    })
    expect(screen.getByRole('heading', { level: 1, name: /retrieve a note/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /retrieve a note/i })).toBeInTheDocument()
    expect(screen.getByText(/provide note id and click retrieve/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/note id/i)).toBeInTheDocument()
  })

  it('shows note form when Add a note button is clicked', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Add a note" button
    act(() => {
      fireEvent.click(buttons[0])
    })

    // Check form elements
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/text/i)).toBeInTheDocument()

    const nameInput = screen.getByLabelText(/name/i)
    const textInput = screen.getByLabelText(/text/i)

    expect(nameInput).toHaveAttribute('maxLength', '50')
    expect(textInput).toHaveAttribute('maxLength', '50')

    // Check buttons
    const formButtons = screen.getAllByRole('button')
    const addButton = formButtons.find(btn => btn.textContent === 'add')
    const clearButton = formButtons.find(btn => btn.textContent === 'clear')

    expect(addButton).toBeInTheDocument()
    expect(clearButton).toBeInTheDocument()
  })

  it('shows retrieve form when Retrieve a note button is clicked', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Retrieve a note" button
    act(() => {
      fireEvent.click(buttons[2])
    })

    // Check form elements
    expect(screen.getByLabelText(/note id/i)).toBeInTheDocument()

    const noteIdInput = screen.getByLabelText(/note id/i)
    expect(noteIdInput).toBeInTheDocument()

    // Check buttons
    const formButtons = screen.getAllByRole('button')
    const retrieveButton = formButtons.find(btn => btn.textContent === 'retrieve')
    const clearButton = formButtons.find(btn => btn.textContent === 'clear')

    expect(retrieveButton).toBeInTheDocument()
    expect(clearButton).toBeInTheDocument()
  })
})

