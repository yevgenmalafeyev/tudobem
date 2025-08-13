import '@testing-library/jest-dom';
import { loadEnvConfig } from '@next/env';

// Load test environment variables
loadEnvConfig(process.cwd(), true, { info: () => null, error: console.error });

// Add polyfills for MSW
import 'whatwg-fetch';
global.Response = Response;
global.Request = Request;
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
global.TransformStream = require('stream/web').TransformStream;

// Add BroadcastChannel polyfill for MSW
global.BroadcastChannel = class BroadcastChannel {
  constructor(name: string) {
    this.name = name;
  }
  name: string;
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: jest.fn((fn) => fn),
}));

// Mock NextRequest for API testing
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    url: string;
    method: string;
    headers: Map<string, string>;
    body: any;
    _body: any;
    
    constructor(url: string, options: any = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.headers = new Map(Object.entries(options.headers || {}));
      this.body = options.body;
      this._body = options.body;
    }
    
    async json() {
      return JSON.parse(this._body);
    }
    
    async text() {
      return this._body;
    }
  },
  NextResponse: {
    json: (body: any, init?: any) => {
      const response = {
        status: init?.status || 200,
        json: async () => body,
      };
      return response;
    },
  },
}));

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
}));

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
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};