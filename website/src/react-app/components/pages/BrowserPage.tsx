import FlagBrowser from '../flag-browser/FlagBrowser'

interface BrowserPageProps {
  flagCount: number
}

export default function BrowserPage({ flagCount }: BrowserPageProps) {
  return (
    <>
      <div className="pt-12 pb-8 sm:pt-16">
        <h1 className="text-title text-ink">Browse all flags.</h1>
        <p className="mt-3 text-body text-ink-2">
          Search and filter <span className="tabular-nums">{flagCount}</span> flags. Select one to
          copy its component name or import.
        </p>
      </div>
      <FlagBrowser />
    </>
  )
}
