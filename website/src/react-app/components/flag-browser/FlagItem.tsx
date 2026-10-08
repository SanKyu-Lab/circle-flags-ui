import type { FlagInfo } from '../../utils/flagData'
import { flagComponentMap } from './flagComponent'

interface FlagItemProps {
  flag: FlagInfo
  isSelected: boolean
  onSelect: (flag: FlagInfo) => void
}

export default function FlagItem({ flag, isSelected, onSelect }: FlagItemProps) {
  const FlagComponent = flagComponentMap[flag.componentName]
  if (!FlagComponent) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(flag)}
      aria-pressed={isSelected}
      aria-label={`${flag.displayName ?? flag.countryName} (${flag.code.toUpperCase()})`}
      title={flag.displayName ?? flag.countryName}
      className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border p-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
        isSelected
          ? 'border-accent bg-accent-soft'
          : 'border-rule bg-card hover:border-rule-strong hover:bg-sunken'
      }`}
    >
      <FlagComponent width={48} height={48} aria-hidden />
      <span className="w-full truncate text-center text-label font-mono uppercase text-ink-3">
        {flag.code}
      </span>
    </button>
  )
}
