import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import DataManagement from '@/components/admin/DataManagement'

// Mock DOM APIs
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mocked-blob-url'),
    revokeObjectURL: jest.fn()
  }
})

// Mock fetch globally
global.fetch = jest.fn()

describe('DataManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockClear()
    ;(window.URL.createObjectURL as jest.Mock).mockClear()
    ;(window.URL.revokeObjectURL as jest.Mock).mockClear()
    
    // Clean up any document spies
    jest.restoreAllMocks()
    
    // Ensure DOM is clean
    document.body.innerHTML = ''
  })

  afterEach(() => {
    jest.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('should render basic structure', () => {
    render(<DataManagement />)
    
    // Export section
    expect(screen.getByText('📤 Export Questions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Export Database/ })).toBeInTheDocument()
    
    // Import section
    expect(screen.getByText('📥 Import Questions')).toBeInTheDocument()
    expect(screen.getByLabelText('Select ZIP file to import')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Import Data/ })).toBeInTheDocument()
    
    // Instructions section
    expect(screen.getByText('📋 Instructions')).toBeInTheDocument()
  })

  it('should handle file selection', () => {
    render(<DataManagement />)
    
    const fileInput = screen.getByLabelText('Select ZIP file to import')
    const file = new File(['test content'], 'test.zip', { type: 'application/zip' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('Selected file: test.zip (0.00 MB)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Import Data/ })).toBeEnabled()
  })

  it('should reject invalid file types', () => {
    render(<DataManagement />)
    
    const fileInput = screen.getByLabelText('Select ZIP file to import')
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(screen.getByText('❌ Please select a ZIP file')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Import Data/ })).toBeDisabled()
  })

  it('should handle successful export', async () => {
    const mockBlob = new Blob(['test data'], { type: 'application/zip' })
    
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
      json: jest.fn(),
      text: jest.fn(),
      status: 200,
      statusText: 'OK'
    })

    render(<DataManagement />)
    
    const exportButton = screen.getByRole('button', { name: /Export Database/ })
    
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(screen.getByText('✅ Export completed successfully!')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith('/api/admin/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  })

  it('should handle successful import', async () => {
    const mockJson = jest.fn().mockResolvedValue({ count: 25 });
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: mockJson,
      blob: jest.fn(),
      text: jest.fn(),
      status: 200,
      statusText: 'OK'
    })

    render(<DataManagement />)
    
    const fileInput = screen.getByLabelText('Select ZIP file to import')
    const file = new File(['test content'], 'test.zip', { type: 'application/zip' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const importButton = screen.getByRole('button', { name: /Import Data/ })
    
    await act(async () => {
      fireEvent.click(importButton)
    })

    await waitFor(() => {
      expect(screen.getByText('✅ Import completed successfully! Imported 25 questions.')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith('/api/admin/import', {
      method: 'POST',
      body: expect.any(FormData)
    })
  })

  it('should show loading states', async () => {
    ;(fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob(['test'], { type: 'application/zip' })),
        json: jest.fn(),
        text: jest.fn(),
        status: 200,
        statusText: 'OK'
      }), 100))
    )

    render(<DataManagement />)
    
    const exportButton = screen.getByRole('button', { name: /Export Database/ })
    
    fireEvent.click(exportButton)
    
    await waitFor(() => {
      expect(screen.getByText('Exporting...')).toBeInTheDocument()
      expect(exportButton).toBeDisabled()
    })

    await waitFor(() => {
      expect(screen.getByText('✅ Export completed successfully!')).toBeInTheDocument()
    })
  })

  it('should handle export errors', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Database error' })
    })

    render(<DataManagement />)
    
    const exportButton = screen.getByRole('button', { name: /Export Database/ })
    
    await act(async () => {
      fireEvent.click(exportButton)
    })

    await waitFor(() => {
      expect(screen.getByText('❌ Export failed: Database error')).toBeInTheDocument()
    })
  })

  it('should handle import errors', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid file' })
    })

    render(<DataManagement />)
    
    const fileInput = screen.getByLabelText('Select ZIP file to import')
    const file = new File(['test'], 'test.zip', { type: 'application/zip' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    const importButton = screen.getByRole('button', { name: /Import Data/ })
    
    await act(async () => {
      fireEvent.click(importButton)
    })

    await waitFor(() => {
      expect(screen.getByText('❌ Import failed: Invalid file')).toBeInTheDocument()
    })
  })

  it('should have proper accessibility', () => {
    render(<DataManagement />)
    
    // Form labels
    expect(screen.getByLabelText('Select ZIP file to import')).toBeInTheDocument()
    
    // Button roles
    expect(screen.getByRole('button', { name: /Export Database/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Import Data/ })).toBeDisabled() // No file selected
    
    // Headings
    expect(screen.getByRole('heading', { level: 2, name: /Export Questions/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Import Questions/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /Instructions/ })).toBeInTheDocument()
  })
})