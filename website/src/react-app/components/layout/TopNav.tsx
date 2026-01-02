import { Github, Globe2 } from 'lucide-react'
import { type ReactNode } from 'react'

interface TopNavProps {
  currentPage: 'home' | 'browser'
  onPageChange: (page: 'home' | 'browser') => void
  children?: ReactNode
}

export default function TopNav({ currentPage, onPageChange, children }: TopNavProps) {
  return (
    <nav className="relative border-b border-(--border-weak) bg-(--bg)/90 backdrop-blur-md top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Globe2 className="w-7 h-7 text-(--accent)" aria-hidden />
            <span className="font-semibold text-lg tracking-tight">Circle Flags</span>
          </div>

          <div className="flex items-center gap-1 bg-(--overlay-soft) rounded-full p-1 border border-(--border-weak)">
            <button
              onClick={() => onPageChange('home')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-(--accent) text-white'
                  : 'text-(--muted) hover:text-(--ink) hover:bg-(--overlay-mid)'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onPageChange('browser')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentPage === 'browser'
                  ? 'bg-(--accent) text-white'
                  : 'text-(--muted) hover:text-(--ink) hover:bg-(--overlay-mid)'
              }`}
            >
              Browse
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/docs/guides/getting-started/"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-(--muted) hover:text-(--ink) hover:bg-(--overlay-mid) transition-all"
            >
              Docs
            </a>
            <a
              href="https://github.com/SanKyu-Lab/react-circle-flags"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 text-sm font-medium text-(--muted) transition-all hover:border-(--border-weak) hover:bg-(--overlay-mid) hover:text-(--ink)"
            >
              <Github
                className="h-4 w-4 opacity-70 transition group-hover:opacity-100"
                aria-hidden
              />
              GitHub
            </a>
            {children}
          </div>
        </div>
      </div>
    </nav>
  )
}
