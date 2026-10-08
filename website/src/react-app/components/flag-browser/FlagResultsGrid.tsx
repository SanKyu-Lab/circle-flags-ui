import type { FlagInfo } from '../../utils/flagData'
import FlagItem from './FlagItem'

interface FlagResultsGridProps {
  flags: FlagInfo[]
  selectedFlagCode?: string
  onSelect: (flag: FlagInfo) => void
  onReset: () => void
}

export default function FlagResultsGrid({
  flags,
  selectedFlagCode,
  onSelect,
  onReset,
}: FlagResultsGridProps) {
  if (flags.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-body text-ink-2">No flags match these filters.</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-md border border-rule-strong px-4 py-2 text-body font-medium text-ink outline-none hover:bg-sunken focus-visible:ring-2 focus-visible:ring-accent"
        >
          Reset filters
        </button>
      </div>
    )
  }

  return (
    <>
      {flags.map(flag => (
        <FlagItem
          key={flag.code}
          flag={flag}
          isSelected={selectedFlagCode === flag.code}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}
