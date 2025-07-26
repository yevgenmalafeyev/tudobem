import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import PWAInstallModal from '@/components/PWAInstallModal'
import { AppLanguage } from '@/types'

// Mock the PWA detection utility
const mockDetectPlatform = jest.fn()
jest.mock('@/utils/pwaDetection', () => ({
  detectPlatform: () => mockDetectPlatform()
}))

// Mock the PWA instructions utility
const mockGetPWAInstructions = jest.fn()
const mockGetPWAModalTitle = jest.fn()
const mockGetPWADetectionText = jest.fn()
const mockGetPWAOtherPlatformsText = jest.fn()
const mockGetPWACloseText = jest.fn()

jest.mock('@/utils/pwaInstructions', () => ({
  getPWAInstructions: () => mockGetPWAInstructions(),
  getPWAModalTitle: (lang: AppLanguage) => mockGetPWAModalTitle(lang),
  getPWADetectionText: (platform: string, browser: string, lang: AppLanguage) => 
    mockGetPWADetectionText(platform, browser, lang),
  getPWAOtherPlatformsText: (lang: AppLanguage) => mockGetPWAOtherPlatformsText(lang),
  getPWACloseText: (lang: AppLanguage) => mockGetPWACloseText(lang)
}))

describe('PWAInstallModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    language: 'en' as AppLanguage
  }

  const mockDeviceInfo = {
    platform: 'ios' as const,
    browser: 'Safari',
    isMobile: true,
    canInstallPWA: true
  }

  const mockInstructions = {
    ios: [
      {
        platform: 'iOS',
        browser: 'Safari',
        steps: [
          '1. Open this site in Safari',
          '2. Tap the "Share" button at the bottom',
          '3. Scroll down and tap "Add to Home Screen"'
        ],
        icon: '📱'
      }
    ],
    android: [
      {
        platform: 'Android',
        browser: 'Chrome',
        steps: [
          '1. Open this site in Chrome',
          '2. Tap the menu (three dots) in the top right',
          '3. Tap "Add to home screen"'
        ],
        icon: '🤖'
      }
    ],
    desktop: [
      {
        platform: 'Desktop',
        browser: 'Chrome',
        steps: [
          '1. Open this site in Chrome',
          '2. Click the install icon in the address bar',
          '3. Click "Install"'
        ],
        icon: '💻'
      }
    ]
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockDetectPlatform.mockReturnValue(mockDeviceInfo)
    mockGetPWAInstructions.mockReturnValue(mockInstructions)
    mockGetPWAModalTitle.mockReturnValue('Install App')
    mockGetPWADetectionText.mockReturnValue('We detected you are using iOS Safari')
    mockGetPWAOtherPlatformsText.mockReturnValue('View instructions for other platforms')
    mockGetPWACloseText.mockReturnValue('Close')
  })

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      render(<PWAInstallModal {...defaultProps} isOpen={false} />)
      
      expect(screen.queryByText('Install App')).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('Install App')).toBeInTheDocument()
    })

    it('should not render when deviceInfo is null', () => {
      // Mock detectPlatform to return null
      mockDetectPlatform.mockReturnValue(null)
      
      // Wrap in try-catch to handle potential errors
      expect(() => {
        render(<PWAInstallModal {...defaultProps} />)
      }).not.toThrow()
      
      // Should not render the modal content when deviceInfo is null
      expect(screen.queryByText('Install App')).not.toBeInTheDocument()
    })
  })

  describe('Device Detection Integration', () => {
    it('should call detectPlatform when modal opens', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockDetectPlatform).toHaveBeenCalledTimes(1)
    })

    it('should not call detectPlatform when modal is closed', () => {
      render(<PWAInstallModal {...defaultProps} isOpen={false} />)
      
      expect(mockDetectPlatform).not.toHaveBeenCalled()
    })

    it('should call detectPlatform when modal state changes to open', () => {
      const { rerender } = render(<PWAInstallModal {...defaultProps} isOpen={false} />)
      
      expect(mockDetectPlatform).not.toHaveBeenCalled()
      
      rerender(<PWAInstallModal {...defaultProps} isOpen={true} />)
      
      expect(mockDetectPlatform).toHaveBeenCalledTimes(1)
    })
  })

  describe('Modal Structure', () => {
    it('should render modal title', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockGetPWAModalTitle).toHaveBeenCalledWith('en')
      expect(screen.getByText('Install App')).toBeInTheDocument()
    })

    it('should render close button', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      const closeButton = screen.getByText('×')
      expect(closeButton).toBeInTheDocument()
      expect(closeButton.tagName).toBe('BUTTON')
    })

    it('should render detection text', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('iOS', 'Safari', 'en')
      expect(screen.getByText('We detected you are using iOS Safari')).toBeInTheDocument()
    })

    it('should render main close button', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockGetPWACloseText).toHaveBeenCalledWith('en')
      expect(screen.getByText('Close')).toBeInTheDocument()
    })
  })

  describe('Platform-Specific Instructions', () => {
    it('should render iOS instructions when platform is iOS', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('iOS - Safari')).toBeInTheDocument()
      expect(screen.getByText('1. Open this site in Safari')).toBeInTheDocument()
      expect(screen.getByText('📱')).toBeInTheDocument()
    })

    it('should render Android instructions when platform is Android', () => {
      mockDetectPlatform.mockReturnValue({
        platform: 'android',
        browser: 'Chrome',
        isMobile: true,
        canInstallPWA: true
      })

      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('Android - Chrome')).toBeInTheDocument()
      expect(screen.getByText('1. Open this site in Chrome')).toBeInTheDocument()
      expect(screen.getByText('🤖')).toBeInTheDocument()
    })

    it('should render Desktop instructions when platform is Desktop', () => {
      mockDetectPlatform.mockReturnValue({
        platform: 'desktop',
        browser: 'Chrome',
        isMobile: false,
        canInstallPWA: true
      })

      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('Desktop - Chrome')).toBeInTheDocument()
      expect(screen.getByText('1. Open this site in Chrome')).toBeInTheDocument()
      expect(screen.getByText('💻')).toBeInTheDocument()
    })

    it('should handle missing platform instructions gracefully', () => {
      mockDetectPlatform.mockReturnValue({
        platform: 'unknown',
        browser: 'Unknown',
        isMobile: false,
        canInstallPWA: false
      })
      
      mockGetPWAInstructions.mockReturnValue({})

      render(<PWAInstallModal {...defaultProps} />)
      
      // Should not crash and should still render modal structure
      expect(screen.getByText('Install App')).toBeInTheDocument()
    })
  })

  describe('Language Support', () => {
    it('should pass English language to utility functions', () => {
      render(<PWAInstallModal {...defaultProps} language="en" />)
      
      expect(mockGetPWAModalTitle).toHaveBeenCalledWith('en')
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('iOS', 'Safari', 'en')
      expect(mockGetPWAOtherPlatformsText).toHaveBeenCalledWith('en')
      expect(mockGetPWACloseText).toHaveBeenCalledWith('en')
    })

    it('should pass Portuguese language to utility functions', () => {
      render(<PWAInstallModal {...defaultProps} language="pt" />)
      
      expect(mockGetPWAModalTitle).toHaveBeenCalledWith('pt')
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('iOS', 'Safari', 'pt')
      expect(mockGetPWAOtherPlatformsText).toHaveBeenCalledWith('pt')
      expect(mockGetPWACloseText).toHaveBeenCalledWith('pt')
    })

    it('should pass Ukrainian language to utility functions', () => {
      render(<PWAInstallModal {...defaultProps} language="uk" />)
      
      expect(mockGetPWAModalTitle).toHaveBeenCalledWith('uk')
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('iOS', 'Safari', 'uk')
      expect(mockGetPWAOtherPlatformsText).toHaveBeenCalledWith('uk')
      expect(mockGetPWACloseText).toHaveBeenCalledWith('uk')
    })
  })

  describe('Event Handlers', () => {
    it('should call onClose when close button (×) is clicked', () => {
      const onCloseMock = jest.fn()
      render(<PWAInstallModal {...defaultProps} onClose={onCloseMock} />)
      
      fireEvent.click(screen.getByText('×'))
      
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when main close button is clicked', () => {
      const onCloseMock = jest.fn()
      render(<PWAInstallModal {...defaultProps} onClose={onCloseMock} />)
      
      fireEvent.click(screen.getByText('Close'))
      
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it('should show all platforms when "View instructions for other platforms" is clicked', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      fireEvent.click(screen.getByText('View instructions for other platforms'))
      
      // Should show platform selector buttons
      expect(screen.getByText('iOS')).toBeInTheDocument()
      expect(screen.getByText('Android')).toBeInTheDocument()
      expect(screen.getByText('Desktop')).toBeInTheDocument()
    })
  })

  describe('All Platforms View', () => {
    beforeEach(() => {
      render(<PWAInstallModal {...defaultProps} />)
      fireEvent.click(screen.getByText('View instructions for other platforms'))
    })

    it('should render platform selector buttons', () => {
      expect(screen.getByText('iOS')).toBeInTheDocument()
      expect(screen.getByText('Android')).toBeInTheDocument()
      expect(screen.getByText('Desktop')).toBeInTheDocument()
    })

    it('should highlight current platform by default', () => {
      const iosButton = screen.getByText('iOS')
      expect(iosButton).toHaveClass('bg-blue-600', 'text-white')
    })

    it('should switch platform when platform button is clicked', () => {
      fireEvent.click(screen.getByText('Android'))
      
      const androidButton = screen.getByText('Android')
      const iosButton = screen.getByText('iOS')
      
      expect(androidButton).toHaveClass('bg-blue-600', 'text-white')
      expect(iosButton).toHaveClass('bg-gray-100', 'text-gray-900')
    })

    it('should show instructions for selected platform', () => {
      fireEvent.click(screen.getByText('Android'))
      
      expect(screen.getByText('Android - Chrome')).toBeInTheDocument()
      expect(screen.getByText('1. Open this site in Chrome')).toBeInTheDocument()
    })

    it('should return to detected platform view when back button is clicked', () => {
      const backButton = screen.getByText(/← We detected you are using iOS Safari/)
      fireEvent.click(backButton)
      
      // Should not show platform selector anymore
      expect(screen.queryByText('iOS')).not.toBeInTheDocument()
      expect(screen.queryByText('Android')).not.toBeInTheDocument()
      expect(screen.queryByText('Desktop')).not.toBeInTheDocument()
      
      // Should show the original view again
      expect(screen.getByText('View instructions for other platforms')).toBeInTheDocument()
    })

    it('should render close button with full width in all platforms view', () => {
      const closeButton = screen.getByText('Close')
      expect(closeButton).toHaveClass('w-full')
    })
  })

  describe('Platform Display Names', () => {
    beforeEach(() => {
      render(<PWAInstallModal {...defaultProps} />)
      fireEvent.click(screen.getByText('View instructions for other platforms'))
    })

    it('should display "iOS" for ios platform', () => {
      expect(screen.getByText('iOS')).toBeInTheDocument()
    })

    it('should display "Android" for android platform', () => {
      expect(screen.getByText('Android')).toBeInTheDocument()
    })

    it('should display "Desktop" for desktop platform', () => {
      expect(screen.getByText('Desktop')).toBeInTheDocument()
    })
  })

  describe('Instructions Rendering', () => {
    it('should render instruction steps as ordered list items', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      const steps = screen.getAllByText(/^\d+\./)
      expect(steps.length).toBeGreaterThan(0)
      
      // Check that steps are in list items
      steps.forEach(step => {
        expect(step.tagName).toBe('LI')
      })
    })

    it('should render platform and browser information', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('iOS - Safari')).toBeInTheDocument()
    })

    it('should render platform icon', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('📱')).toBeInTheDocument()
    })

    it('should handle instructions without icons', () => {
      const instructionsWithoutIcon = {
        ios: [
          {
            platform: 'iOS',
            browser: 'Safari',
            steps: ['1. Step without icon'],
            // No icon property
          }
        ]
      }
      
      mockGetPWAInstructions.mockReturnValue(instructionsWithoutIcon)
      
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(screen.getByText('1. Step without icon')).toBeInTheDocument()
    })
  })

  describe('Modal Styling and Structure', () => {
    it('should render with overlay background', () => {
      const { container } = render(<PWAInstallModal {...defaultProps} />)
      
      const overlay = container.querySelector('.fixed.inset-0.bg-black.bg-opacity-50')
      expect(overlay).toBeInTheDocument()
    })

    it('should render with proper modal positioning', () => {
      const { container } = render(<PWAInstallModal {...defaultProps} />)
      
      const modal = container.querySelector('.max-w-md.w-full')
      expect(modal).toBeInTheDocument()
      expect(modal).toHaveClass('bg-white', 'rounded-lg')
    })

    it('should have scrollable content area', () => {
      const { container } = render(<PWAInstallModal {...defaultProps} />)
      
      const scrollableArea = container.querySelector('.max-h-\\[90vh\\].overflow-y-auto')
      expect(scrollableArea).toBeInTheDocument()
    })
  })

  describe('Browser Detection Text', () => {
    it('should show iOS for iOS platform', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('iOS', 'Safari', 'en')
    })

    it('should show Android for Android platform', () => {
      mockDetectPlatform.mockReturnValue({
        platform: 'android',
        browser: 'Chrome',
        isMobile: true,
        canInstallPWA: true
      })

      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('Android', 'Chrome', 'en')
    })

    it('should show Desktop for desktop platform', () => {
      mockDetectPlatform.mockReturnValue({
        platform: 'desktop',
        browser: 'Chrome',
        isMobile: false,
        canInstallPWA: true
      })

      render(<PWAInstallModal {...defaultProps} />)
      
      expect(mockGetPWADetectionText).toHaveBeenCalledWith('Desktop', 'Chrome', 'en')
    })
  })

  describe('Component State Management', () => {
    it('should initialize with showAllPlatforms as false', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      // Should show the single platform view initially
      expect(screen.getByText('View instructions for other platforms')).toBeInTheDocument()
      expect(screen.queryByText('iOS')).not.toBeInTheDocument()
    })

    it('should initialize selectedPlatform with detected platform', () => {
      render(<PWAInstallModal {...defaultProps} />)
      
      fireEvent.click(screen.getByText('View instructions for other platforms'))
      
      // iOS should be selected by default (from mockDeviceInfo)
      const iosButton = screen.getByText('iOS')
      expect(iosButton).toHaveClass('bg-blue-600', 'text-white')
    })

    it('should reset state when modal reopens', async () => {
      const { rerender } = render(<PWAInstallModal {...defaultProps} />)
      
      // Navigate to all platforms view
      fireEvent.click(screen.getByText('View instructions for other platforms'))
      fireEvent.click(screen.getByText('Android'))
      
      // Close modal
      rerender(<PWAInstallModal {...defaultProps} isOpen={false} />)
      
      // Reopen modal
      rerender(<PWAInstallModal {...defaultProps} isOpen={true} />)
      
      // Should be back to detected platform view
      expect(screen.getByText('View instructions for other platforms')).toBeInTheDocument()
    })
  })
})