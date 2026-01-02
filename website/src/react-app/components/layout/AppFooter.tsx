import { Github } from 'lucide-react'
import { buildMeta } from '@sankyu/react-circle-flags'

export default function AppFooter() {
  const { version, commit } = buildMeta
  const shortCommit = commit === 'dev' ? 'dev' : commit.slice(0, 7)

  return (
    <footer className="relative mt-20 overflow-hidden rounded-2xl border border-(--border-weak) bg-(--bg) px-6 py-8 text-xs text-(--muted) shadow-[0_15px_60px_-25px_rgba(0,0,0,0.3)]">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-linear-to-br from-(--accent)/12 via-transparent to-(--ink)/8" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--accent)/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-(--border-weak) bg-(--overlay-soft) shadow-inner shadow-(--accent)/20">
            <img src="/favicon.svg" alt="React Circle Flags logo" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-(--ink)">
              Sankyu Lab - React Circle Flags
            </p>
            <p className="mt-1 text-(--muted)">
              A curated playground for @sankyu/react-circle-flags
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <a
            href="/docs/guides/getting-started/"
            target="_blank"
            className="cursor-alias rounded-full border border-(--border-weak) bg-(--overlay-soft) px-4 py-1.5 text-(--ink) transition hover:border-(--accent) hover:text-(--accent)"
          >
            Documentation
          </a>
          <a
            href="https://github.com/SanKyu-Lab/react-circle-flags"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-(--border-weak) bg-(--overlay-soft) px-4 py-1.5 text-(--ink) transition hover:border-(--accent) hover:text-(--accent)"
          >
            <Github className="h-4 w-4 opacity-70" aria-hidden />
            GitHub
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-6 flex max-w-6xl flex-wrap items-center gap-3 text-[11px]">
        <span className="text-(--muted)">
          © {new Date().getFullYear()} Sankyu Lab. All rights reserved.
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-(--border-weak) bg-(--overlay-soft) px-3 py-1 text-(--ink)">
          <span
            className="h-1.5 w-1.5 rounded-full bg-(--accent) shadow-[0_0_0_6px_rgba(0,0,0,0.04)]"
            aria-hidden
          />
          Crafted with
          <code>
            @sankyu/react-circle-flags@{version}-{shortCommit}
          </code>
        </span>
      </div>
    </footer>
  )
}
