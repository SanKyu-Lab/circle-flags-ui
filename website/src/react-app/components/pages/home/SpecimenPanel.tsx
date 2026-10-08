import { useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { FlagSizes } from '@sankyu/react-circle-flags'
import { FlagAu } from '@sankyu/react-circle-flags/flags/au'
import { FlagBr } from '@sankyu/react-circle-flags/flags/br'
import { FlagCa } from '@sankyu/react-circle-flags/flags/ca'
import { FlagCh } from '@sankyu/react-circle-flags/flags/ch'
import { FlagCn } from '@sankyu/react-circle-flags/flags/cn'
import { FlagDe } from '@sankyu/react-circle-flags/flags/de'
import { FlagGb } from '@sankyu/react-circle-flags/flags/gb'
import { FlagIn } from '@sankyu/react-circle-flags/flags/in'
import { FlagJp } from '@sankyu/react-circle-flags/flags/jp'
import { FlagKr } from '@sankyu/react-circle-flags/flags/kr'
import { FlagUs } from '@sankyu/react-circle-flags/flags/us'
import { FlagZa } from '@sankyu/react-circle-flags/flags/za'
import CopyButton from '../../ui/CopyButton'
import HighlightedCode from '../../ui/HighlightedCode'
import { withBasePath } from '../../../routing/paths'
import { frameworks, type FrameworkId } from '../../../utils/frameworks'

interface SpecimenFlag {
  code: string
  componentName: string
  Component: ComponentType<SVGProps<SVGSVGElement>>
}

const specimenFlags: readonly SpecimenFlag[] = [
  { code: 'jp', componentName: 'FlagJp', Component: FlagJp },
  { code: 'br', componentName: 'FlagBr', Component: FlagBr },
  { code: 'us', componentName: 'FlagUs', Component: FlagUs },
  { code: 'gb', componentName: 'FlagGb', Component: FlagGb },
  { code: 'de', componentName: 'FlagDe', Component: FlagDe },
  { code: 'ch', componentName: 'FlagCh', Component: FlagCh },
  { code: 'za', componentName: 'FlagZa', Component: FlagZa },
  { code: 'in', componentName: 'FlagIn', Component: FlagIn },
  { code: 'cn', componentName: 'FlagCn', Component: FlagCn },
  { code: 'kr', componentName: 'FlagKr', Component: FlagKr },
  { code: 'au', componentName: 'FlagAu', Component: FlagAu },
  { code: 'ca', componentName: 'FlagCa', Component: FlagCa },
]

const ladderSizes = (['xs', 'sm', 'md', 'lg', 'xl'] as const).map(name => ({
  name,
  px: FlagSizes[name],
}))

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

export default function SpecimenPanel() {
  const [flag, setFlag] = useState<SpecimenFlag>(specimenFlags[0])
  const [frameworkId, setFrameworkId] = useState<FrameworkId>('react')
  const framework = frameworks.find(item => item.id === frameworkId) ?? frameworks[0]
  const usage = framework.usage(flag.code, flag.componentName)
  const installCommand = `pnpm add ${framework.packageName}`
  const { Component } = flag

  return (
    <div className="overflow-hidden rounded-xl border border-rule bg-card">
      <div className="grid gap-6 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-8 sm:p-7">
        <div className="flex h-44 w-44 items-center justify-center justify-self-center rounded-full bg-sunken sm:justify-self-start">
          <Component
            key={flag.code}
            width={FlagSizes.xxxl}
            height={FlagSizes.xxxl}
            className="animate-specimen-in"
            aria-hidden
          />
        </div>

        <div className="min-w-0">
          <p className="text-label font-mono uppercase text-ink-3">
            {flag.code} · {flag.componentName}
          </p>
          <p className="mt-1 text-heading text-ink" aria-live="polite">
            {regionNames.of(flag.code.toUpperCase())}
          </p>

          <ul aria-label="Size presets" className="mt-6 flex items-end gap-4 sm:gap-5">
            {ladderSizes.map(size => (
              <li key={size.name} className="flex flex-col items-center gap-2">
                <Component width={size.px} height={size.px} aria-hidden />
                <span className="text-label font-mono text-ink-3 tabular-nums">
                  {size.name} {size.px}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-rule px-5 py-4 sm:px-7">
        <p id="specimen-flag-label" className="text-label font-mono uppercase text-ink-3">
          Flag
        </p>
        <div
          role="group"
          aria-labelledby="specimen-flag-label"
          className="mt-3 flex flex-wrap gap-2"
        >
          {specimenFlags.map(item => {
            const isActive = item.code === flag.code
            return (
              <button
                key={item.code}
                type="button"
                aria-pressed={isActive}
                aria-label={regionNames.of(item.code.toUpperCase())}
                onClick={() => setFlag(item)}
                className={`rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                  isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-card' : ''
                }`}
              >
                <item.Component width={FlagSizes.md} height={FlagSizes.md} aria-hidden />
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-code text-code-ink">
        <div
          role="group"
          aria-label="Framework"
          className="flex gap-1 overflow-x-auto border-b border-code-rule px-3 py-2 sm:px-5"
        >
          {frameworks.map(item => {
            const isActive = item.id === frameworkId
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFrameworkId(item.id)}
                className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md px-3 text-body outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? 'bg-code-surface text-code-ink' : 'text-code-muted hover:text-code-ink'
                }`}
              >
                <img
                  src={withBasePath(item.icon)}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 border-b border-code-rule py-2 pr-3 pl-5 sm:pl-7">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-body">
            <span className="text-code-muted select-none">$ </span>
            {installCommand}
          </code>
          <CopyButton text={installCommand} label="Copy install command" tone="code" />
        </div>

        <div className="relative">
          <div className="absolute top-2 right-3">
            <CopyButton text={usage} label="Copy usage example" tone="code" />
          </div>
          <div className="min-h-44 overflow-x-auto px-5 py-5 pr-14 sm:px-7">
            <HighlightedCode code={usage} lang={framework.lang} />
          </div>
        </div>
      </div>
    </div>
  )
}
