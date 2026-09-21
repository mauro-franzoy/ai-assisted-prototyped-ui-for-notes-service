import fs from 'node:fs'
import path from 'node:path'
import { render, screen, within, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import App from './App'

// Mock fetch globally
global.fetch = vi.fn()

describe('App Component Layout', () => {
  beforeEach(() => {
    // Clear mock before each test
    global.fetch.mockClear()
  })

  afterEach(() => {
    // Reset mock after each test
    global.fetch.mockReset()
  })
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

  it('renders five action buttons with idle behavior in the left panel', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    expect(buttons).toHaveLength(5)
    expect(buttons.map((btn) => btn.textContent.trim())).toEqual([
      'Add a note',
      'List notes',
      'Retrieve a note',
      'Read a note',
      'Welcome page',
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

  it('navigates to Read a note view and clears retrieve fields when retrieve button is clicked, and clear button takes to welcome page', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Sample Note',
        noteText: 'This is a sample retrieved note content'
      }),
    })

    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Retrieve a note" button
    act(() => {
      fireEvent.click(buttons[2])
    })

    // Click retrieve button (will make API call)
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    act(() => {
      fireEvent.click(retrieveButton)
    })

    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Verify it navigated to "Read a note" page
    expect(screen.getByRole('heading', { level: 1, name: 'Read a note' })).toBeInTheDocument()

    // Check that note fields in Read a note display the retrieved note
    const idInput = screen.getByLabelText(/^id$/i)
    const nameInput = screen.getByLabelText(/^note name$/i)
    const textInput = screen.getByLabelText(/^note text$/i)

    expect(idInput).toHaveValue('1')
    expect(nameInput).toHaveValue('Sample Note')
    expect(textInput).toHaveValue('This is a sample retrieved note content')

    // Check clear button inside Read a note
    const clearButton = within(mainArea).getByRole('button', { name: /^clear$/i })
    expect(clearButton).toBeInTheDocument()

    // Click clear button
    act(() => {
      fireEvent.click(clearButton)
    })

    // Verify it takes you to welcome page
    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()
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

  it('shows notes list when retrieve button is clicked in List notes', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Meeting Notes', noteText: 'Discuss project timeline and deliverables' },
        { id: 2, name: 'Shopping List', noteText: 'Milk, eggs, bread, vegetables' },
      ],
    })

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

    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Check for sample note content (NoteCard component renders this)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Meeting Notes')).toBeInTheDocument()
    expect(screen.getByText('Discuss project timeline and deliverables')).toBeInTheDocument()
  })

  it('shows clear button when notes list is displayed and returns to previous state when clicked', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Meeting Notes', noteText: 'Discuss project timeline and deliverables' },
      ],
    })

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

    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Check for clear button and note id
    const clearButton = within(mainArea).getByText(/^clear$/i)
    expect(clearButton).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()

    // Click clear button
    act(() => {
      fireEvent.click(clearButton)
    })

    // Check that notes list is hidden and retrieve button is shown again
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('Meeting Notes')).not.toBeInTheDocument()
    expect(within(mainArea).getByText(/^retrieve$/i)).toBeInTheDocument()
  })
})

describe('App Component API Integration', () => {
  beforeEach(() => {
    // Clear mock before each test
    global.fetch.mockClear()
  })

  afterEach(() => {
    // Reset mock after each test
    global.fetch.mockReset()
  })

  it('calls API to add note when add button is clicked', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'Test Note', noteText: 'Test content' }),
    })

    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Add a note" button
    act(() => {
      fireEvent.click(buttons[0])
    })

    // Fill in the form
    const nameInput = screen.getByLabelText(/name/i)
    const textInput = screen.getByLabelText(/text/i)
    
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test Note' } })
      fireEvent.change(textInput, { target: { value: 'Test content' } })
    })

    // Click add button
    const mainArea = screen.getByRole('main')
    const addButton = within(mainArea).getByText(/^add$/i)
    act(() => {
      fireEvent.click(addButton)
    })

    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/noteservice/notes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Note',
          noteText: 'Test content',
          usersId: 1
        }),
      }
    )

    // Verify it navigated to Read a note page and displays the added note
    expect(screen.getByRole('heading', { level: 1, name: 'Read a note' })).toBeInTheDocument()
    expect(screen.getByLabelText(/^id$/i)).toHaveValue('1')
    expect(screen.getByLabelText(/^note name$/i)).toHaveValue('Test Note')
    expect(screen.getByLabelText(/^note text$/i)).toHaveValue('Test content')
  })

  it('loads note in retrieve view when note card is clicked', async () => {
    // Mock successful API responses
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: 'Meeting Notes', noteText: 'Discuss project timeline and deliverables' },
        { id: 2, name: 'Shopping List', noteText: 'Milk, eggs, bread, vegetables' },
      ],
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Meeting Notes',
        noteText: 'Discuss project timeline and deliverables'
      }),
    })

    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "List notes" button
    act(() => {
      fireEvent.click(buttons[1])
    })

    // Click retrieve button to load notes
    const mainArea = screen.getByRole('main')
    const retrieveButton = within(mainArea).getByText(/^retrieve$/i)
    act(() => {
      fireEvent.click(retrieveButton)
    })

    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Click on a note card
    const noteCard = screen.getByText('Meeting Notes').closest('.note-card')
    act(() => {
      fireEvent.click(noteCard)
    })

    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Verify it switched to Read a note view and shows the note
    expect(screen.getByRole('heading', { level: 1, name: 'Read a note' })).toBeInTheDocument()
    expect(screen.getByLabelText(/^note name$/i)).toHaveValue('Meeting Notes')
    expect(screen.getByLabelText(/^note text$/i)).toHaveValue('Discuss project timeline and deliverables')
  })

  it('navigates to welcome screen when clicking the header', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Add a note" button
    act(() => {
      fireEvent.click(buttons[0])
    })
    expect(screen.getByRole('heading', { level: 1, name: /add a note/i })).toBeInTheDocument()

    // Click header
    const header = screen.getByRole('banner')
    act(() => {
      fireEvent.click(header)
    })

    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /add a note/i })).not.toBeInTheDocument()
  })

  it('navigates to welcome screen when clicking the footer', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "List notes" button
    act(() => {
      fireEvent.click(buttons[1])
    })
    expect(screen.getByRole('heading', { level: 1, name: /list notes/i })).toBeInTheDocument()

    // Click footer
    const footer = screen.getByRole('contentinfo')
    act(() => {
      fireEvent.click(footer)
    })

    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /list notes/i })).not.toBeInTheDocument()
  })

  it('navigates to welcome screen when clicking the Welcome page button', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const buttons = within(leftPanel).getAllByRole('button')

    // Click "Add a note" button first
    act(() => {
      fireEvent.click(buttons[0])
    })
    expect(screen.getByRole('heading', { level: 1, name: /add a note/i })).toBeInTheDocument()

    // Click "Welcome page" button
    const welcomeButton = within(leftPanel).getByRole('button', { name: /welcome page/i })
    act(() => {
      fireEvent.click(welcomeButton)
    })

    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /add a note/i })).not.toBeInTheDocument()
  })

  it('does not do anything when clicking the Read a note left menu button', () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })
    const readNoteButton = within(leftPanel).getByRole('button', { name: /^read a note$/i })

    // On initial render, welcome screen is shown
    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()

    act(() => {
      fireEvent.click(readNoteButton)
    })

    // View should remain on welcome screen
    expect(screen.getByRole('heading', { level: 1, name: /welcome to notes service/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: 'Read a note' })).not.toBeInTheDocument()
  })

  it('paints the corresponding left menu button in blue when page is open in main area', async () => {
    render(<App />)

    const leftPanel = screen.getByRole('complementary', { name: /left panel/i })

    const addBtn = within(leftPanel).getByRole('button', { name: /^add a note$/i })
    const listBtn = within(leftPanel).getByRole('button', { name: /^list notes$/i })
    const retrieveBtn = within(leftPanel).getByRole('button', { name: /^retrieve a note$/i })
    const readBtn = within(leftPanel).getByRole('button', { name: /^read a note$/i })
    const welcomeBtn = within(leftPanel).getByRole('button', { name: /^welcome page$/i })

    // Initial state: welcome page
    expect(welcomeBtn).toHaveClass('active')
    expect(addBtn).not.toHaveClass('active')

    // Navigate to Add a note
    act(() => {
      fireEvent.click(addBtn)
    })
    expect(addBtn).toHaveClass('active')
    expect(welcomeBtn).not.toHaveClass('active')

    // Navigate to List notes
    act(() => {
      fireEvent.click(listBtn)
    })
    expect(listBtn).toHaveClass('active')
    expect(addBtn).not.toHaveClass('active')

    // Navigate to Retrieve a note
    act(() => {
      fireEvent.click(retrieveBtn)
    })
    expect(retrieveBtn).toHaveClass('active')
    expect(listBtn).not.toHaveClass('active')

    // Retrieve a note to open Read a note view
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'Sample Note',
        noteText: 'Sample content'
      }),
    })

    const mainArea = screen.getByRole('main')
    const retrieveSubmitBtn = within(mainArea).getByText(/^retrieve$/i)
    await act(async () => {
      fireEvent.click(retrieveSubmitBtn)
    })

    expect(readBtn).toHaveClass('active')
    expect(retrieveBtn).not.toHaveClass('active')
  })
})


