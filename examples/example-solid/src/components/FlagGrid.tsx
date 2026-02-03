import { For } from 'solid-js'
import type { Component, JSX } from 'solid-js'
import { openBrowse } from '../libs/shared/browse'

interface FlagItem {
  Component: Component<JSX.SvgSVGAttributes<SVGSVGElement>>
  code: string
}

interface FlagGridProps {
  rows: FlagItem[][]
}

export function FlagGrid(props: FlagGridProps) {
  return (
    <div class="w-full p-5 border border-gray-200 rounded-2xl bg-neutral-50 shadow-sm flex flex-col gap-3 items-center">
      <For each={props.rows}>
        {row => (
          <div class="flex gap-2.5">
            <For each={row}>
              {item => {
                const Component = item.Component
                return (
                  <Component
                    width={40}
                    height={40}
                    class="block rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] cursor-alias transition-opacity duration-200 hover:opacity-80"
                    onClick={() => openBrowse(item.code)}
                    aria-label={`Browse ${item.code}`}
                  />
                )
              }}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}
