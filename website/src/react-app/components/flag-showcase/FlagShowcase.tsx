import { FlagAu } from '@sankyu/react-circle-flags/flags/au'
import { FlagBe } from '@sankyu/react-circle-flags/flags/be'
import { FlagBr } from '@sankyu/react-circle-flags/flags/br'
import { FlagCa } from '@sankyu/react-circle-flags/flags/ca'
import { FlagCh } from '@sankyu/react-circle-flags/flags/ch'
import { FlagCn } from '@sankyu/react-circle-flags/flags/cn'
import { FlagDe } from '@sankyu/react-circle-flags/flags/de'
import { FlagEs } from '@sankyu/react-circle-flags/flags/es'
import { FlagFr } from '@sankyu/react-circle-flags/flags/fr'
import { FlagGb } from '@sankyu/react-circle-flags/flags/gb'
import { FlagIn } from '@sankyu/react-circle-flags/flags/in'
import { FlagIt } from '@sankyu/react-circle-flags/flags/it'
import { FlagJp } from '@sankyu/react-circle-flags/flags/jp'
import { FlagKr } from '@sankyu/react-circle-flags/flags/kr'
import { FlagMx } from '@sankyu/react-circle-flags/flags/mx'
import { FlagNl } from '@sankyu/react-circle-flags/flags/nl'
import { FlagNo } from '@sankyu/react-circle-flags/flags/no'
import { FlagSe } from '@sankyu/react-circle-flags/flags/se'
import { FlagUs } from '@sankyu/react-circle-flags/flags/us'

interface FlagShowcaseProps {
  onFlagClick?: (code: string) => void
}

const flags = [
  { Component: FlagUs, code: 'us' },
  { Component: FlagCn, code: 'cn' },
  { Component: FlagJp, code: 'jp' },
  { Component: FlagDe, code: 'de' },
  { Component: FlagGb, code: 'gb' },
  { Component: FlagFr, code: 'fr' },
  { Component: FlagIn, code: 'in' },
  { Component: FlagCa, code: 'ca' },
  { Component: FlagKr, code: 'kr' },
  { Component: FlagIt, code: 'it' },
  { Component: FlagEs, code: 'es' },
  { Component: FlagAu, code: 'au' },
  { Component: FlagBr, code: 'br' },
  { Component: FlagMx, code: 'mx' },
  { Component: FlagNl, code: 'nl' },
  { Component: FlagCh, code: 'ch' },
  { Component: FlagSe, code: 'se' },
  { Component: FlagNo, code: 'no' },
  { Component: FlagBe, code: 'be' },
] as const

export default function FlagShowcase({ onFlagClick }: FlagShowcaseProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--border-strong) bg-(--surface) p-5 shadow-(--shadow-md) sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-(--ink)">Live components</p>
          <p className="mt-1 text-sm text-(--muted)">Select a flag to open its details.</p>
        </div>
        <code className="text-xs text-(--muted)">48 × 48</code>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {flags.map(({ Component, code }) => (
          <button
            key={code}
            type="button"
            aria-label={`Open ${code.toUpperCase()} flag`}
            onClick={() => onFlagClick?.(code)}
            className="group flex aspect-square items-center justify-center rounded-xl border border-transparent bg-(--surface-2)/55 outline-none transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-(--border-strong) hover:bg-(--surface-2) focus-visible:ring-2 focus-visible:ring-(--accent)"
          >
            <Component className="h-8 w-8 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9" />
          </button>
        ))}
      </div>
    </div>
  )
}
