import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, test } from 'vitest'
import * as Flags from '../../generated/flags'

// Helper function: Convert country code to component name (PascalCase)
const toFlagComponentName = (code: string) => {
  return `Flag${code.charAt(0).toUpperCase()}${code.slice(1).toLowerCase()}`
}

// Mock a dynamic flag selector component
function FlagSelector({ countries }: { countries: string[] }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0])

  const FlagComponent = Flags[toFlagComponentName(selectedCountry)]

  return (
    <div>
      <select
        value={selectedCountry}
        onChange={e => setSelectedCountry(e.target.value)}
        data-testid="country-select"
      >
        {countries.map(country => (
          <option key={country} value={country}>
            {country.toUpperCase()}
          </option>
        ))}
      </select>

      {FlagComponent && <FlagComponent width={64} height={64} data-testid="selected-flag" />}
    </div>
  )
}

// Mock a flag grid component
function FlagGrid({ countryCodes }: { countryCodes: string[] }) {
  return (
    <div data-testid="flag-grid">
      {countryCodes.map(code => {
        const FlagComponent = Flags[toFlagComponentName(code)]
        if (!FlagComponent) return null

        return (
          <FlagComponent
            key={code}
            width={32}
            height={32}
            data-testid={`flag-${code.toLowerCase()}`}
          />
        )
      })}
    </div>
  )
}

describe('Integration Tests', () => {
  describe('FlagSelector component', () => {
    const countries = ['us', 'cn', 'jp', 'gb']

    test('should render initial flag', () => {
      render(<FlagSelector countries={countries} />)
      expect(screen.getByTestId('selected-flag')).toBeInTheDocument()
    })

    test('should change flag when selection changes', () => {
      render(<FlagSelector countries={countries} />)

      const select = screen.getByTestId('country-select')
      const flag = screen.getByTestId('selected-flag')

      // Initial state
      expect(flag).toBeInTheDocument()

      // Change selection
      fireEvent.change(select, { target: { value: 'cn' } })
      expect(screen.getByTestId('selected-flag')).toBeInTheDocument()

      // Change again
      fireEvent.change(select, { target: { value: 'jp' } })
      expect(screen.getByTestId('selected-flag')).toBeInTheDocument()
    })

    test('should handle all provided countries', () => {
      render(<FlagSelector countries={countries} />)
      const select = screen.getByTestId('country-select')

      countries.forEach(country => {
        fireEvent.change(select, { target: { value: country } })
        expect(screen.getByTestId('selected-flag')).toBeInTheDocument()
      })
    })
  })

  describe('FlagGrid component', () => {
    test('should render all flags in grid', () => {
      const countryCodes = ['US', 'CN', 'JP', 'GB', 'DE']
      render(<FlagGrid countryCodes={countryCodes} />)

      countryCodes.forEach(code => {
        expect(screen.getByTestId(`flag-${code.toLowerCase()}`)).toBeInTheDocument()
      })
    })

    test('should handle empty country list', () => {
      render(<FlagGrid countryCodes={[]} />)
      const grid = screen.getByTestId('flag-grid')
      expect(grid).toBeInTheDocument()
      expect(grid.children.length).toBe(0)
    })

    test('should handle invalid country codes', () => {
      const invalidCodes = ['INVALID1', 'INVALID2', 'INVALID3']
      render(<FlagGrid countryCodes={invalidCodes} />)

      const grid = screen.getByTestId('flag-grid')
      expect(grid).toBeInTheDocument()
      // Should not render any flags
      expect(grid.querySelector('[data-testid^="flag-"]')).toBeNull()
    })

    test('should handle mixed valid and invalid codes', () => {
      const mixedCodes = ['US', 'INVALID1', 'CN', 'INVALID2']
      render(<FlagGrid countryCodes={mixedCodes} />)

      // Should only render valid flags
      expect(screen.getByTestId('flag-us')).toBeInTheDocument()
      expect(screen.getByTestId('flag-cn')).toBeInTheDocument()
      expect(screen.queryByTestId('flag-invalid1')).not.toBeInTheDocument()
      expect(screen.queryByTestId('flag-invalid2')).not.toBeInTheDocument()
    })
  })

  describe('Dynamic flag loading', () => {
    test('should dynamically load flags by country code', () => {
      const countryCodes = ['fr', 'it', 'es', 'br', 'ca']

      countryCodes.forEach(code => {
        const FlagComponent = Flags[toFlagComponentName(code)]
        expect(FlagComponent).toBeDefined()

        const { container } = render(<FlagComponent data-testid={`dynamic-${code}`} />)
        expect(container.querySelector('svg')).toBeInTheDocument()
      })
    })

    test('should handle case insensitive country codes', () => {
      const testCases = [
        ['us', 'US'],
        ['cn', 'CN'],
        ['jp', 'JP'],
      ]

      testCases.forEach(([lowerCode, upperCode]) => {
        const LowerFlag = Flags[toFlagComponentName(lowerCode)]
        const UpperFlag = Flags[toFlagComponentName(upperCode)]

        expect(LowerFlag).toBeDefined()
        expect(UpperFlag).toBeDefined()
        expect(LowerFlag).toBe(UpperFlag)
      })
    })
  })

  describe('Performance and tree-shaking', () => {
    test('should allow importing individual flags', () => {
      const { FlagUs, FlagCn, FlagJp } = Flags

      expect(FlagUs).toBeDefined()
      expect(FlagCn).toBeDefined()
      expect(FlagJp).toBeDefined()

      // Test if individually imported components work correctly
      const { container: usContainer } = render(<FlagUs data-testid="test-us" />)
      const { container: cnContainer } = render(<FlagCn data-testid="test-cn" />)
      const { container: jpContainer } = render(<FlagJp data-testid="test-jp" />)

      expect(usContainer.querySelector('svg')).toBeInTheDocument()
      expect(cnContainer.querySelector('svg')).toBeInTheDocument()
      expect(jpContainer.querySelector('svg')).toBeInTheDocument()
    })
  })
})
