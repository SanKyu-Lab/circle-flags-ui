import { useEffect, useMemo, useState } from 'react'
import { parseAsString, useQueryStates } from 'nuqs'
import { getAllFlags, getAllTypes, TYPE_LABELS, type FlagInfo } from '../../utils/flagData'
import FlagDetailPanel from './FlagDetailPanel'
import FlagFilters, { type FilterType } from './FlagFilters'
import FlagResultsGrid from './FlagResultsGrid'

const ALL_OPTION = 'all'

export default function FlagBrowser() {
  const [query, setQuery] = useQueryStates(
    {
      filter: parseAsString.withDefault(''),
      region: parseAsString.withDefault(ALL_OPTION),
      continent: parseAsString.withDefault(ALL_OPTION),
      type: parseAsString.withDefault(ALL_OPTION),
      currency: parseAsString.withDefault(ALL_OPTION),
      language: parseAsString.withDefault(''),
      countryCode: parseAsString.withDefault(''),
    },
    { history: 'push' }
  )
  const [selectedFlag, setSelectedFlag] = useState<FlagInfo | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const parsedType = query.type as FilterType
  const selectedType: FilterType =
    parsedType === 'country' || parsedType === 'subdivision' || parsedType === 'organization' || parsedType === 'other'
      ? parsedType
      : ALL_OPTION
  const selectedRegion = query.region ?? ALL_OPTION
  const selectedContinent = query.continent ?? ALL_OPTION
  const selectedCurrency = query.currency ?? ALL_OPTION
  const searchTerm = query.filter ?? ''
  const languageTerm = query.language ?? ''
  const countryCodes = query.countryCode
    ? query.countryCode.split(',').map(code => code.trim().toLowerCase())
    : []

  const allFlags = useMemo(() => getAllFlags(), [])
  const regionOptions = useMemo(() => {
    const regions = Array.from(new Set(allFlags.map(flag => flag.region))).sort()
    return [
      { value: ALL_OPTION, label: 'All regions' },
      ...regions.map(region => ({ value: region, label: region })),
    ]
  }, [allFlags])
  const continentOptions = useMemo(() => {
    const continents = Array.from(new Set(allFlags.map(flag => flag.continent))).sort()
    return [
      { value: ALL_OPTION, label: 'All continents' },
      ...continents.map(continent => ({ value: continent, label: continent })),
    ]
  }, [allFlags])
  const typeOptions = useMemo<Array<{ value: FilterType; label: string }>>(() => {
    return [
      { value: ALL_OPTION, label: 'All types' },
      ...getAllTypes().map(type => ({ value: type, label: TYPE_LABELS[type] })),
    ]
  }, [])
  const currencyOptions = useMemo(() => {
    const currencies = Array.from(
      new Set(allFlags.map(flag => flag.currency).filter(Boolean) as string[])
    ).sort()
    return [
      { value: ALL_OPTION, label: 'All currencies' },
      ...currencies.map(currency => ({ value: currency, label: currency })),
    ]
  }, [allFlags])

  const filteredFlags = useMemo(() => {
    const languageFilter = languageTerm.trim().toLowerCase()
    return allFlags.filter(flag => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        !searchTerm ||
        flag.code.toLowerCase().includes(searchLower) ||
        flag.displayName?.toLowerCase().includes(searchLower) ||
        flag.countryName.toLowerCase().includes(searchLower) ||
        flag.componentName.toLowerCase().includes(searchLower) ||
        flag.region.toLowerCase().includes(searchLower) ||
        flag.continent.toLowerCase().includes(searchLower) ||
        (flag.currency?.toLowerCase().includes(searchLower) ?? false) ||
        (flag.capital?.toLowerCase().includes(searchLower) ?? false) ||
        flag.languages.some(lang => lang.toLowerCase().includes(searchLower))

      const matchesRegion = selectedRegion === ALL_OPTION || flag.region === selectedRegion
      const matchesContinent =
        selectedContinent === ALL_OPTION || flag.continent === selectedContinent
      const matchesType = selectedType === ALL_OPTION || flag.type === selectedType
      const matchesCurrency = selectedCurrency === ALL_OPTION || flag.currency === selectedCurrency
      const matchesLanguage =
        !languageFilter || flag.languages.some(lang => lang.toLowerCase().includes(languageFilter))
      const matchesCountryCode =
        countryCodes.length === 0 || countryCodes.includes(flag.code.toLowerCase())

      return (
        matchesSearch &&
        matchesRegion &&
        matchesContinent &&
        matchesType &&
        matchesCurrency &&
        matchesLanguage &&
        matchesCountryCode
      )
    })
  }, [
    allFlags,
    searchTerm,
    selectedRegion,
    selectedContinent,
    selectedType,
    selectedCurrency,
    languageTerm,
    countryCodes,
  ])

  useEffect(() => {
    if (countryCodes.length === 0) return
    const firstMatch = filteredFlags[0]
    if (firstMatch && selectedFlag?.code !== firstMatch.code) {
      setSelectedFlag(firstMatch)
    }
  }, [countryCodes, filteredFlags, selectedFlag])

  const copyToClipboard = async (text: string, code: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSelect = (flag: FlagInfo) => {
    setSelectedFlag(selectedFlag?.code === flag.code ? null : flag)
  }

  const handleReset = () => {
    setQuery({
      filter: null,
      region: null,
      continent: null,
      type: null,
      currency: null,
      language: null,
      countryCode: null,
    })
    setSelectedFlag(null)
  }

  return (
    <div className="space-y-6">
      <FlagFilters
        searchTerm={searchTerm}
        onSearchChange={value => setQuery({ filter: value || null })}
        regionOptions={regionOptions}
        selectedRegion={selectedRegion}
        onRegionChange={value => setQuery({ region: value || null })}
        continentOptions={continentOptions}
        selectedContinent={selectedContinent}
        onContinentChange={value => setQuery({ continent: value || null })}
        typeOptions={typeOptions}
        selectedType={selectedType}
        onTypeChange={value => setQuery({ type: value || null })}
        currencyOptions={currencyOptions}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={value => setQuery({ currency: value || null })}
        languageTerm={languageTerm}
        onLanguageChange={value => setQuery({ language: value || null })}
        filteredCount={filteredFlags.length}
        totalCount={allFlags.length}
        onReset={handleReset}
      />

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        <FlagResultsGrid
          flags={filteredFlags}
          selectedFlagCode={selectedFlag?.code}
          onSelect={handleSelect}
        />
      </div>

      {selectedFlag && (
        <FlagDetailPanel
          flag={selectedFlag}
          copiedCode={copiedCode}
          onCopy={copyToClipboard}
          onClose={() => setSelectedFlag(null)}
        />
      )}
    </div>
  )
}
