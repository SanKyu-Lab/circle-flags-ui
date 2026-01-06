import CodeExample from '../../code-example/CodeExample'
import SpotlightCard from '../../animated-ui/SpotlightCard'
import { Rocket } from 'lucide-react'

export default function QuickStartSection() {
  return (
    <div id="quick-start" className="mb-4 lg:mb-0 animate-slide-in delay-200">
      <SpotlightCard
        className="rounded-3xl border border-(--border-strong) p-8 shadow-(--shadow-lg) animate-rise delay-300 !bg-(--surface)"
        spotlightColor="oklch(0.58 0.18 210 / 0.2)"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-(--accent)" aria-hidden />
                <h2 className="text-2xl font-bold">Quick Start</h2>
              </div>
              <p className="text-sm text-(--muted)">Fast as lightning</p>
            </div>
            <span className="rounded-full border border-(--border-accent) bg-(--overlay-soft) px-4 py-1.5 text-xs font-semibold text-(--accent)">
              DX-Friendly
            </span>
          </div>
          <CodeExample />
        </div>
      </SpotlightCard>
    </div>
  )
}
