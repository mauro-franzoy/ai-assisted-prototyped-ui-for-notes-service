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
    const header = screen.getByRole('banner')
    expect(within(header).getByText('Notes Service')).toBeInTheDocument()

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
    
    // Check footer text specifically in the footer element
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByText('Notes Service')).toBeInTheDocument()
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
    
    // Check for retrieve button in the form
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    expect(retrieveButton).toBeInTheDocument()

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
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    const clearButton = within(mainArea).getByText(/^clear$/i)

    expect(retrieveButton).toBeInTheDocument()
    expect(clearButton).toBeInTheDocument()
  })

  it('shows retrieved note card when retrieve button is clicked and clear button returns to form', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Retrieve a note" button
    act(() => {
      fireEvent.click(buttons[2])
    })

    // Click retrieve button (will show sample note)
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    act(() => {
      fireEvent.click(retrieveButton)
    })

    // Check for note card with content
    expect(screen.getByText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByText(/^text$/i)).toBeInTheDocument()

    // Check for clear button above note card
    const clearButton = within(mainArea).getByText(/^clear$/i)
    expect(clearButton).toBeInTheDocument()

    // Click clear button
    act(() => {
      fireEvent.click(clearButton)
    })

    // Check that note card is hidden and form is shown again
    expect(screen.queryByText(/^name$/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/note id/i)).toBeInTheDocument()
  })

  it('shows retrieve button when List notes button is clicked', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "List notes" button
    act(() => {
      fireEvent.click(buttons[1])
    })

    // Check for retrieve button
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    expect(retrieveButton).toBeInTheDocument()
  })

  it('shows notes list when retrieve button is clicked in List notes', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "List notes" button
    act(() => {
      fireEvent.click(buttons[1])
    })

    // Click retrieve button
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    act(() => {
      fireEvent.click(retrieveButton)
    })

    // Check for note cards with labels and content
    expect(screen.getAllByText(/^name$/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/^text$/i).length).toBeGreaterThan(0)
    
    // Check for sample note content
    expect(screen.getByText('Meeting Notes')).toBeInTheDocument()
    expect(screen.getByText('Discuss project timeline and deliverables')).toBeInTheDocument()
  })

  it('shows clear button when notes list is displayed and returns to previous state when clicked', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "List notes" button
    act(() => {
      fireEvent.click(buttons[1])
    })

    // Click retrieve button
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    act(() => {
      fireEvent.click(retrieveButton)
    })

    // Check for clear button
    const clearButton = within(mainArea).getByText(/^clear$/i)
    expect(clearButton).toBeInTheDocument()

    // Click clear button
    act(() => {
      fireEvent.click(clearButton)
    })

    // Check that notes list is hidden and retrieve button is shown again
    expect(screen.queryByText('Meeting Notes')).not.toBeInTheDocument()
    expect(within(mainArea).getByText(/^retrieve$/i)).toBeInTheDocument()
  })
})

