import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockImplementation(() => new Promise(() => {}))
})

afterEach(() => {
  cleanup()
})

// Ensure SVGElement exists and inheritance is correct
// This is required for @testing-library/jest-dom matchers (like toBeInTheDocument) to work correctly
if (typeof window.SVGElement === 'undefined') {
  class SVGElement extends HTMLElement {
    constructor() {
      super()
    }

    // Add click method to support event handler testing
    click() {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      this.dispatchEvent(event)
    }
  }
  Object.defineProperty(window, 'SVGElement', {
    writable: true,
    configurable: true,
    value: SVGElement,
  })
}

// Ensure SVGSVGElement also exists
if (typeof window.SVGSVGElement === 'undefined') {
  class SVGSVGElement extends window.SVGElement {
    constructor() {
      super()
    }
  }
  Object.defineProperty(window, 'SVGSVGElement', {
    writable: true,
    configurable: true,
    value: SVGSVGElement,
  })
}
