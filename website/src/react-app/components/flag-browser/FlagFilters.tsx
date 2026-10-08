import { useId } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import type { FlagInfo } from '../../utils/flagData'

export type FilterType = FlagInfo['type'] | 'all'

interface Option {
  value: string
  label: string
}

interface FlagFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  countryCodes?: string[]
  onCountryCodeClear?: () => void
  regionOptions: Option[]
  selectedRegion: string
  onRegionChange: (value: string) => void
  continentOptions: Option[]
  selectedContinent: string
  onContinentChange: (value: string) => void
  typeOptions: Array<Option & { value: FilterType }>
  selectedType: FilterType
  onTypeChange: (value: FilterType) => void
  currencyOptions: Option[]
  selectedCurrency: string
  onCurrencyChange: (value: string) => void
  languageTerm: string
  onLanguageChange: (value: string) => void
  filteredCount: number
  totalCount: number
  onReset: () => void
}

const fieldClass =
  'h-10 w-full rounded-md border border-rule-strong bg-card px-3 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30'
const labelClass = 'mb-1.5 block text-label font-mono uppercase text-ink-3'
const textButtonClass =
  'rounded-md px-2 py-1 text-body font-medium text-ink underline decoration-rule-strong underline-offset-4 outline-none hover:text-accent hover:decoration-accent focus-visible:ring-2 focus-visible:ring-accent'

interface SelectFieldProps<Value extends string> {
  label: string
  value: Value
  options: Array<{ value: Value; label: string }>
  onChange: (value: Value) => void
}

function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<Value>) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={event => {
            const next = options.find(option => option.value === event.target.value)
            if (next) onChange(next.value)
          }}
          className={`${fieldClass} appearance-none pr-9`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
      </div>
    </div>
  )
}

export default function FlagFilters({
  searchTerm,
  onSearchChange,
  countryCodes = [],
  onCountryCodeClear,
  regionOptions,
  selectedRegion,
  onRegionChange,
  continentOptions,
  selectedContinent,
  onContinentChange,
  typeOptions,
  selectedType,
  onTypeChange,
  currencyOptions,
  selectedCurrency,
  onCurrencyChange,
  languageTerm,
  onLanguageChange,
  filteredCount,
  totalCount,
  onReset,
}: FlagFiltersProps) {
  const searchId = useId()
  const languageId = useId()
  const hasActiveFilters =
    selectedRegion !== 'all' ||
    selectedContinent !== 'all' ||
    selectedType !== 'all' ||
    selectedCurrency !== 'all' ||
    languageTerm.trim().length > 0 ||
    searchTerm.trim().length > 0 ||
    countryCodes.length > 0

  return (
    <div className="z-10 -mx-5 border-y border-rule bg-paper px-5 py-5 sm:-mx-8 sm:px-8 md:sticky md:top-16">
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search flags
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-3"
          aria-hidden
        />
        <input
          id={searchId}
          type="search"
          placeholder="Search name, ISO code, currency, or language"
          value={searchTerm}
          onChange={event => onSearchChange(event.target.value)}
          className={`${fieldClass} h-11 pr-11 pl-9`}
        />
        {searchTerm ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange('')}
            className="absolute top-1/2 right-1.5 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-3 outline-none hover:bg-sunken hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <SelectField
          label="Region"
          value={selectedRegion}
          options={regionOptions}
          onChange={onRegionChange}
        />
        <SelectField
          label="Continent"
          value={selectedContinent}
          options={continentOptions}
          onChange={onContinentChange}
        />
        <SelectField
          label="Type"
          value={selectedType}
          options={typeOptions}
          onChange={onTypeChange}
        />
        <SelectField
          label="Currency"
          value={selectedCurrency}
          options={currencyOptions}
          onChange={onCurrencyChange}
        />
        <div className="col-span-2 md:col-span-1">
          <label htmlFor={languageId} className={labelClass}>
            Language
          </label>
          <input
            id={languageId}
            type="text"
            value={languageTerm}
            onChange={event => onLanguageChange(event.target.value)}
            placeholder="en, fr, es"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-4 flex min-h-8 flex-wrap items-center gap-x-5 gap-y-2">
        <p className="text-label font-mono uppercase text-ink-3" aria-live="polite">
          Showing <span className="text-ink tabular-nums">{filteredCount}</span> of{' '}
          <span className="tabular-nums">{totalCount}</span>
        </p>
        {countryCodes.length > 0 ? (
          <p className="flex items-center gap-1 text-body text-ink-2">
            Code{' '}
            <code className="text-ink">
              {countryCodes.map(code => code.toUpperCase()).join(', ')}
            </code>
            <button type="button" onClick={onCountryCodeClear} className={textButtonClass}>
              Clear
            </button>
          </p>
        ) : null}
        {hasActiveFilters ? (
          <button type="button" onClick={onReset} className={textButtonClass}>
            Reset filters
          </button>
        ) : null}
      </div>
    </div>
  )
}
