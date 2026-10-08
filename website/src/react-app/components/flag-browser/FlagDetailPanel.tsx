import { useState } from 'react'
import { Check, Copy, X } from 'lucide-react'
import { FlagSizes } from '@sankyu/react-circle-flags'
import type { FlagInfo } from '../../utils/flagData'
import { TYPE_LABELS } from '../../utils/flagData'
import { frameworks, type FrameworkId } from '../../utils/frameworks'
import { flagComponentMap } from './flagComponent'

interface FlagDetailPanelProps {
  flag: FlagInfo
  copiedCode: string | null
  onCopy: (text: string, code: string) => void
  onClose: () => void
}

const previewSizes = [FlagSizes.md, FlagSizes.lg, FlagSizes.xl] as const

export default function FlagDetailPanel({
  flag,
  copiedCode,
  onCopy,
  onClose,
}: FlagDetailPanelProps) {
  const [frameworkId, setFrameworkId] = useState<FrameworkId>('react')
  const FlagComponent = flagComponentMap[flag.componentName]
  if (!FlagComponent) {
    return null
  }

  const framework = frameworks.find(item => item.id === frameworkId) ?? frameworks[0]
  const importCode =
    framework.id === 'svelte'
      ? `import ${flag.componentName} from '${framework.packageName}/flags/${flag.code}'`
      : `import { ${flag.componentName} } from '${framework.packageName}/flags/${flag.code}'`
  const componentCode = `<${flag.componentName} />`

  const facts = [
    { term: 'Region', value: flag.region },
    { term: 'Type', value: TYPE_LABELS[flag.type] },
    { term: 'Capital', value: flag.capital },
    { term: 'Currency', value: flag.currency },
    { term: 'Languages', value: flag.languages.join(', ') || undefined },
    { term: 'Alpha-3', value: flag.alpha3 },
    { term: 'Numeric', value: flag.numeric },
    { term: 'Locale', value: flag.defaultLocale },
  ].filter((fact): fact is { term: string; value: string } => Boolean(fact.value))

  const copyTargets = [
    { key: `component-${flag.code}`, text: componentCode, label: componentCode },
    { key: `import-${flag.code}-${framework.id}`, text: importCode, label: 'Import statement' },
    { key: `code-${flag.code}`, text: flag.code, label: flag.code },
  ]

  return (
    <div
      role="dialog"
      aria-label={`${flag.displayName ?? flag.countryName} flag details`}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:bottom-6 sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:px-0 sm:pb-0"
    >
      <div className="max-h-[75dvh] overflow-y-auto rounded-xl border border-rule bg-card shadow-float">
        <div className="flex items-start gap-5 border-b border-rule p-5">
          <FlagComponent width={FlagSizes.xl} height={FlagSizes.xl} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-label font-mono uppercase text-ink-3">
              {flag.code} · {flag.componentName}
            </p>
            <h2 className="mt-1 text-heading text-ink">{flag.displayName ?? flag.countryName}</h2>
            <div className="mt-3 flex items-end gap-3" aria-hidden>
              {previewSizes.map(size => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <FlagComponent width={size} height={size} />
                  <span className="text-label font-mono text-ink-3 tabular-nums">{size}px</span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-3 outline-none hover:bg-sunken hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {facts.length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-rule p-5 sm:grid-cols-4">
            {facts.map(fact => (
              <div key={fact.term} className="min-w-0">
                <dt className="text-label font-mono uppercase text-ink-3">{fact.term}</dt>
                <dd className="mt-0.5 truncate text-body text-ink" title={fact.value}>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="p-5">
          <div role="group" aria-label="Framework" className="flex flex-wrap gap-1">
            {frameworks.map(item => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === frameworkId}
                onClick={() => setFrameworkId(item.id)}
                className={`min-h-9 rounded-md px-3 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                  item.id === frameworkId
                    ? 'bg-ink text-paper'
                    : 'text-ink-3 hover:bg-sunken hover:text-ink'
                }`}
              >
                {item.label}
                {item.status === 'Beta' ? <span className="ml-1 text-label">beta</span> : null}
              </button>
            ))}
          </div>

          {framework.id === 'solid' ? (
            <p className="mt-3 text-body text-ink-3">
              Solid named-import flags take <code>className</code> for CSS classes.
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {copyTargets.map(target => (
              <button
                key={target.key}
                type="button"
                onClick={() => onCopy(target.text, target.key)}
                aria-label={`Copy ${target.label}`}
                className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-md border border-rule-strong px-3 font-mono text-body text-ink outline-none transition-colors hover:bg-sunken focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="truncate">{target.label}</span>
                {copiedCode === target.key ? (
                  <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-ink-3" aria-hidden />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
