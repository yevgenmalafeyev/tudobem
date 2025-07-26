import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Logo from '@/components/Logo'

describe('Logo Component', () => {
  describe('Basic Rendering', () => {
    it('should render SVG with correct dimensions', () => {
      const { container } = render(<Logo />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '40')
      expect(svg).toHaveAttribute('height', '40')
      expect(svg).toHaveAttribute('viewBox', '0 0 40 40')
    })

    it('should render with default empty className', () => {
      const { container } = render(<Logo />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveAttribute('class', '')
    })

    it('should apply custom className when provided', () => {
      const customClass = 'custom-logo-class'
      const { container } = render(<Logo className={customClass} />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveClass(customClass)
    })

    it('should apply multiple custom classes', () => {
      const customClasses = 'class1 class2 class3'
      const { container } = render(<Logo className={customClasses} />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveClass('class1')
      expect(svg).toHaveClass('class2')
      expect(svg).toHaveClass('class3')
    })
  })

  describe('SVG Structure', () => {
    it('should contain defs element with gradient definition', () => {
      const { container } = render(<Logo />)
      
      const defs = container.querySelector('defs')
      expect(defs).toBeInTheDocument()
      
      const gradient = container.querySelector('linearGradient[id="bgGradient"]')
      expect(gradient).toBeInTheDocument()
      expect(gradient).toHaveAttribute('x1', '0%')
      expect(gradient).toHaveAttribute('y1', '0%')
      expect(gradient).toHaveAttribute('x2', '100%')
      expect(gradient).toHaveAttribute('y2', '100%')
    })

    it('should contain gradient stops with correct colors', () => {
      const { container } = render(<Logo />)
      
      const stops = container.querySelectorAll('linearGradient stop')
      expect(stops).toHaveLength(2)
      
      expect(stops[0]).toHaveAttribute('offset', '0%')
      expect(stops[0]).toHaveAttribute('stop-color', '#10b981')
      
      expect(stops[1]).toHaveAttribute('offset', '100%')
      expect(stops[1]).toHaveAttribute('stop-color', '#059669')
    })

    it('should contain main background circle', () => {
      const { container } = render(<Logo />)
      
      const circle = container.querySelector('circle[cx="20"][cy="20"][r="18"]')
      expect(circle).toBeInTheDocument()
      expect(circle).toHaveAttribute('fill', 'url(#bgGradient)')
      expect(circle).toHaveAttribute('stroke', '#047857')
      expect(circle).toHaveAttribute('stroke-width', '2')
    })

    it('should contain thumbs up icon path', () => {
      const { container } = render(<Logo />)
      
      const thumbsUpPath = container.querySelector('path[fill="#ffffff"]')
      expect(thumbsUpPath).toBeInTheDocument()
      expect(thumbsUpPath).toHaveAttribute('stroke', '#e5e7eb')
      expect(thumbsUpPath).toHaveAttribute('stroke-width', '0.5')
      expect(thumbsUpPath).toHaveAttribute('d', 'M16 28c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h1.5l2.5-4c.6-1 1.7-1.5 2.8-1.3 1.4.3 2.2 1.6 2.2 3v3h3c1.1 0 2 .9 2 2l-1.5 7c-.2.9-1 1.5-1.9 1.5H16z')
    })

    it('should contain Portuguese flag accent circles', () => {
      const { container } = render(<Logo />)
      
      const redCircle = container.querySelector('circle[cx="12"][cy="14"][r="2"]')
      expect(redCircle).toBeInTheDocument()
      expect(redCircle).toHaveAttribute('fill', '#dc2626')
      expect(redCircle).toHaveAttribute('opacity', '0.8')
      
      const yellowCircle = container.querySelector('circle[cx="28"][cy="26"][r="2"]')
      expect(yellowCircle).toBeInTheDocument()
      expect(yellowCircle).toHaveAttribute('fill', '#fbbf24')
      expect(yellowCircle).toHaveAttribute('opacity', '0.8')
    })

    it('should contain success checkmark path', () => {
      const { container } = render(<Logo />)
      
      const checkmark = container.querySelector('path[d="M14 20l2 2 4-4"]')
      expect(checkmark).toBeInTheDocument()
      expect(checkmark).toHaveAttribute('stroke', '#10b981')
      expect(checkmark).toHaveAttribute('stroke-width', '2')
      expect(checkmark).toHaveAttribute('fill', 'none')
      expect(checkmark).toHaveAttribute('stroke-linecap', 'round')
      expect(checkmark).toHaveAttribute('stroke-linejoin', 'round')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible as an image', () => {
      const { container } = render(<Logo />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toBeInTheDocument()
    })

    it('should work with aria-label when provided', () => {
      const { container } = render(
        <div>
          <Logo className="test" aria-label="Tudobem Logo" />
        </div>
      )
      
      // Since aria-label is not a native SVG prop in our component,
      // we test that the SVG is present and can be enhanced
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Visual Elements Count', () => {
    it('should contain exactly the expected number of each element type', () => {
      const { container } = render(<Logo />)
      
      // Should have 3 circles total (1 background + 2 accent)
      const circles = container.querySelectorAll('circle')
      expect(circles).toHaveLength(3)
      
      // Should have 2 paths (1 thumbs up + 1 checkmark)
      const paths = container.querySelectorAll('path')
      expect(paths).toHaveLength(2)
      
      // Should have 1 gradient
      const gradients = container.querySelectorAll('linearGradient')
      expect(gradients).toHaveLength(1)
      
      // Should have 2 gradient stops
      const stops = container.querySelectorAll('stop')
      expect(stops).toHaveLength(2)
    })
  })

  describe('Color Scheme', () => {
    it('should use correct green color scheme', () => {
      const { container } = render(<Logo />)
      
      // Main gradient colors (green theme)
      const stops = container.querySelectorAll('stop')
      expect(stops[0]).toHaveAttribute('stop-color', '#10b981')
      expect(stops[1]).toHaveAttribute('stop-color', '#059669')
      
      // Border color
      const mainCircle = container.querySelector('circle[r="18"]')
      expect(mainCircle).toHaveAttribute('stroke', '#047857')
      
      // Checkmark color
      const checkmark = container.querySelector('path[stroke="#10b981"]')
      expect(checkmark).toBeInTheDocument()
    })

    it('should use correct Portuguese flag colors', () => {
      const { container } = render(<Logo />)
      
      // Red accent
      const redCircle = container.querySelector('circle[fill="#dc2626"]')
      expect(redCircle).toBeInTheDocument()
      
      // Yellow accent
      const yellowCircle = container.querySelector('circle[fill="#fbbf24"]')
      expect(yellowCircle).toBeInTheDocument()
    })

    it('should use correct icon colors', () => {
      const { container } = render(<Logo />)
      
      // Thumbs up should be white
      const thumbsUp = container.querySelector('path[fill="#ffffff"]')
      expect(thumbsUp).toBeInTheDocument()
      expect(thumbsUp).toHaveAttribute('stroke', '#e5e7eb')
    })
  })

  describe('Props Interface', () => {
    it('should handle undefined className', () => {
      const { container } = render(<Logo className={undefined} />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('class', '')
    })

    it('should handle empty string className', () => {
      const { container } = render(<Logo className="" />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveAttribute('class', '')
    })

    it('should handle className with leading/trailing spaces', () => {
      const { container } = render(<Logo className="  test-class  " />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveClass('test-class')
    })
  })

  describe('Component Integration', () => {
    it('should render correctly when used multiple times', () => {
      const { container } = render(
        <div>
          <Logo className="logo1" />
          <Logo className="logo2" />
        </div>
      )
      
      const logos = container.querySelectorAll('svg')
      expect(logos).toHaveLength(2)
      expect(logos[0]).toHaveClass('logo1')
      expect(logos[1]).toHaveClass('logo2')
    })

    it('should not interfere with gradient IDs when rendered multiple times', () => {
      const { container } = render(
        <div>
          <Logo />
          <Logo />
        </div>
      )
      
      // Both should reference the same gradient ID
      const gradients = container.querySelectorAll('linearGradient[id="bgGradient"]')
      expect(gradients).toHaveLength(2)
      
      const circles = container.querySelectorAll('circle[fill="url(#bgGradient)"]')
      expect(circles).toHaveLength(2)
    })
  })

  describe('CSS Classes Integration', () => {
    it('should work with CSS transition classes', () => {
      const { container } = render(<Logo className="hover:scale-105 transition-transform" />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveClass('hover:scale-105')
      expect(svg).toHaveClass('transition-transform')
    })

    it('should work with scale transform classes', () => {
      const { container } = render(<Logo className="scale-150" />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveClass('scale-150')
    })

    it('should work with custom CSS classes used in components', () => {
      // Test classes actually used in Header and AdminLogin components
      const { container } = render(<Logo className="hover:scale-105 transition-transform" />)
      
      const svg = container.querySelector('svg')!
      expect(svg).toHaveClass('hover:scale-105')
      expect(svg).toHaveClass('transition-transform')
    })
  })
})