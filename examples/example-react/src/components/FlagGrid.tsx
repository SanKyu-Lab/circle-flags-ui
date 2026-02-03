import type { ComponentType, SVGProps } from 'react'
import { openBrowse } from '@example-shared/browse'

interface FlagItem {
  Component: ComponentType<SVGProps<SVGSVGElement>>
  code: string
}

interface FlagGridProps {
  rows: FlagItem[][]
}

export function FlagGrid({ rows }: FlagGridProps) {
  return (
    <div className="w-full p-5 border border-gray-200 rounded-2xl bg-neutral-50 shadow-sm flex flex-col gap-3 items-center">
      {rows.map((row, r) => (
        <div className="flex gap-2.5" key={r}>
          {row.map(({ Component, code }, i) => (
            <Component
              key={i}
              width={40}
              height={40}
              className="block rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] cursor-alias transition-opacity duration-200 hover:opacity-80"
              onClick={() => openBrowse(code)}
              aria-label={`Browse ${code}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
