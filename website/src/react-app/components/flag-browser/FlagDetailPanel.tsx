import { Check, Copy, X } from 'lucide-react'
import type { FlagInfo } from '../../utils/flagData'
import { TYPE_LABELS } from '../../utils/flagData'
import { flagComponentMap } from './flagComponent'

interface FlagDetailPanelProps {
  flag: FlagInfo
  copiedCode: string | null
  onCopy: (text: string, code: string) => void
  onClose: () => void
}

export default function FlagDetailPanel({
  flag,
  copiedCode,
  onCopy,
  onClose,
}: FlagDetailPanelProps) {
  const FlagComponent = flagComponentMap[flag.componentName]
  if (!FlagComponent) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
      <div className="rounded-2xl border border-(--border-strong) bg-(--surface-2) backdrop-blur-xl p-6 shadow-(--shadow-lg)">
        <div className="flex items-start gap-6">
          <div className="shrink-0">
            <FlagComponent
              width={80}
              height={80}
              className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-(--ink) mb-1 flex items-center gap-2">
              {flag.emoji && <span aria-hidden>{flag.emoji}</span>}
              <span>{flag.displayName ?? flag.countryName}</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-medium tracking-wide text-(--muted)">{flag.code}</span>
              <span className="h-1 w-1 rounded-full bg-(--muted)" />
              <span className="text-xs text-(--muted)">{flag.region}</span>
              <span className="h-1 w-1 rounded-full bg-(--muted)" />
              <span className="text-xs text-(--muted)">{TYPE_LABELS[flag.type]}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {flag.continent && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  {flag.continent}
                </span>
              )}
              {flag.capital && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  Capital: {flag.capital}
                </span>
              )}
              {flag.currency && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  Currency: {flag.currency}
                </span>
              )}
              {flag.languages.length > 0 && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  Languages: {flag.languages.join(', ')}
                </span>
              )}
              {flag.alpha3 && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  Alpha-3: {flag.alpha3}
                </span>
              )}
              {flag.numeric && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  Numeric: {flag.numeric}
                </span>
              )}
              {flag.defaultLocale && (
                <span className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-2.5 py-1 text-[11px] text-(--ink)">
                  Default locale: {flag.defaultLocale}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 mb-4">
              {[32, 48, 64, 80].map(size => (
                <div
                  key={size}
                  className="rounded-lg border border-(--border-weak) bg-(--overlay-soft) p-2"
                >
                  <FlagComponent width={size} height={size} />
                  <p className="mt-1.5 text-[10px] text-(--muted) text-center font-medium">
                    {size}px
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCopy(`<${flag.componentName} />`, `component-${flag.code}`)}
                className="group flex items-center gap-2 rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-3 py-2 text-xs font-mono transition-colors hover:border-(--accent) hover:bg-(--accent)/5"
              >
                <span className="text-(--ink)">{`<${flag.componentName} />`}</span>
                {copiedCode === `component-${flag.code}` ? (
                  <Check className="w-3.5 h-3.5 text-(--accent)" aria-hidden />
                ) : (
                  <Copy
                    className="w-3.5 h-3.5 text-(--muted) group-hover:text-(--accent)"
                    aria-hidden
                  />
                )}
              </button>

              <button
                onClick={() =>
                  onCopy(
                    `import { ${flag.componentName} } from '@sankyu/react-circle-flags'`,
                    `import-${flag.code}`
                  )
                }
                className="group flex items-center gap-2 rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-3 py-2 text-xs font-mono transition-colors hover:border-(--accent) hover:bg-(--accent)/5"
              >
                <span className="text-(--ink) truncate">
                  import {'{'}...{'}'}
                </span>
                {copiedCode === `import-${flag.code}` ? (
                  <Check className="w-3.5 h-3.5 text-(--accent)" aria-hidden />
                ) : (
                  <Copy
                    className="w-3.5 h-3.5 text-(--muted) group-hover:text-(--accent)"
                    aria-hidden
                  />
                )}
              </button>

              <button
                onClick={() => onCopy(flag.code, `code-${flag.code}`)}
                className="group flex items-center gap-2 rounded-lg border border-(--border-weak) bg-(--overlay-soft) px-3 py-2 text-xs font-mono transition-colors hover:border-(--accent) hover:bg-(--accent)/5"
              >
                <span className="text-(--ink)">{flag.code}</span>
                {copiedCode === `code-${flag.code}` ? (
                  <Check className="w-3.5 h-3.5 text-(--accent)" aria-hidden />
                ) : (
                  <Copy
                    className="w-3.5 h-3.5 text-(--muted) group-hover:text-(--accent)"
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 text-(--muted) hover:text-(--ink) transition"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
