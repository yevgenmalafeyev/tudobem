import '@testing-library/jest-dom'

// Polyfill for Response/Request (needed for MSW in Node.js)
import 'whatwg-fetch'
global.Response = Response
global.Request = Request

// Add TextEncoder/TextDecoder polyfill for MSW
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: jest.fn((fn) => fn),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}