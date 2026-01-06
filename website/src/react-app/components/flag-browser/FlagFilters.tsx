import { Search, X } from 'lucide-react'
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
  const selectClass =
    'w-full rounded-xl border border-(--border-strong) bg-(--overlay-mid) px-3 py-2 text-sm text-(--ink) focus:outline-none focus:border-(--accent) transition appearance-none'
  const hasActiveFilters =
    selectedRegion !== 'all' ||
    selectedContinent !== 'all' ||
    selectedType !== 'all' ||
    selectedCurrency !== 'all' ||
    languageTerm.trim().length > 0 ||
    searchTerm.trim().length > 0 ||
    countryCodes.length > 0

  return (
    <div className="sticky top-0 z-10 bg-(--bg)/95 backdrop-blur-sm border-b border-(--border-weak) pb-6 -mx-6 px-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-(--border-strong) bg-(--overlay-mid) px-4 py-3">
          <Search className="w-4 h-4 text-(--muted)" aria-hidden />
          <input
            type="text"
            placeholder="Search name, ISO, currency, or language..."
            value={searchTerm}
            onChange={event => onSearchChange(event.target.value)}
            className="flex-1 bg-transparent text-sm text-(--ink) placeholder-(--muted)/70 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="text-(--muted) hover:text-(--ink) transition"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-(--muted) mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={event => onRegionChange(event.target.value)}
              className={selectClass}
            >
              {regionOptions.map(region => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-(--muted) mb-2">
              Continent
            </label>
            <select
              value={selectedContinent}
              onChange={event => onContinentChange(event.target.value)}
              className={selectClass}
            >
              {continentOptions.map(continent => (
                <option key={continent.value} value={continent.value}>
                  {continent.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-(--muted) mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={event => onTypeChange(event.target.value as FilterType)}
              className={selectClass}
            >
              {typeOptions.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-(--muted) mb-2">
              Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={event => onCurrencyChange(event.target.value)}
              className={selectClass}
            >
              {currencyOptions.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {countryCodes.length > 0 && (
            <div className="flex items-center gap-2 rounded-2xl border border-(--border-weak) bg-(--overlay-soft) px-4 py-2">
              <span className="text-xs text-(--muted)">
                Country code:
                <span className="ml-2 text-(--ink) font-semibold">
                  {countryCodes.map(code => code.toUpperCase()).join(', ')}
                </span>
              </span>
              <button
                type="button"
                onClick={onCountryCodeClear}
                className="rounded-full border border-(--border-weak) px-2 py-1 text-[11px] text-(--ink) hover:border-(--accent) transition"
              >
                Clear
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-2xl border border-(--border-weak) bg-(--overlay-soft) px-4 py-2">
            <span className="text-xs text-(--muted)">
              Showing{' '}
              <span className="text-(--accent) font-semibold">{filteredCount}</span> /{' '}
              {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-(--border-weak) bg-(--overlay-soft) px-4 py-2">
            <label className="text-xs uppercase tracking-[0.2em] text-(--muted)">Language</label>
            <input
              type="text"
              value={languageTerm}
              onChange={event => onLanguageChange(event.target.value)}
              placeholder="e.g. en, fr, es"
              className="bg-transparent text-sm text-(--ink) placeholder-(--muted)/70 focus:outline-none"
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                className="rounded-full border border-(--border-strong) px-3 py-1 text-xs text-(--ink) hover:border-(--accent) transition"
              >
                Reset filters
              </button>
              <span className="text-[11px] text-(--muted)">Active filters applied</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
