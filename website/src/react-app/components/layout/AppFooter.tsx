import { ExternalLink } from 'lucide-react'
import { withBasePath } from '../../routing/paths'

export default function AppFooter() {
  return (
    <footer className="mt-24 border-t border-(--border-weak) py-8 text-sm text-(--muted-light)">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={withBasePath('favicon.svg')}
            alt=""
            className="h-8 w-8"
            width="32"
            height="32"
          />
          <div>
            <p className="font-semibold text-(--ink)">Circle Flags UI</p>
            <p>Maintained by Sankyu Lab.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={withBasePath('docs/guides/getting-started/')}
            className="inline-flex items-center gap-1.5 text-(--ink) hover:text-(--accent)"
          >
            Documentation
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
          <a
            href="https://github.com/SanKyu-Lab/circle-flags-ui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-(--ink) hover:text-(--accent)"
          >
            GitHub
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
          <span>© {new Date().getFullYear()} Sankyu Lab</span>
        </div>
      </div>
    </footer>
  )
}
