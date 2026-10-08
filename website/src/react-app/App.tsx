import { lazy, Suspense, useMemo } from 'react'
import NavigationBar, { type NavItem } from './components/layout/NavigationBar'
import HomePage from './components/pages/HomePage'
import { useSpaPathRouter } from './routing/useSpaPathRouter'
import { toRouteHref, withBasePath } from './routing/paths'
import { getFlagCount } from './utils/flagData'
import type { Route } from './routing/paths'

const BrowserPage = lazy(() => import('./components/pages/BrowserPage'))

interface AppProps {
  initialRoute?: Route
}

const navItems: readonly NavItem[] = [
  { label: 'Home', href: toRouteHref('home') },
  { label: 'Browse', href: toRouteHref('browse') },
  { label: 'Docs', href: withBasePath('docs/guides/getting-started/') },
  {
    label: 'GitHub',
    href: 'https://github.com/SanKyu-Lab/circle-flags-ui',
    external: true,
  },
]

export default function App({ initialRoute = 'home' }: AppProps) {
  const { route, currentPath, navigate } = useSpaPathRouter(initialRoute)
  const flagCount = useMemo(() => getFlagCount(), [])

  return (
    <div className="relative min-h-dvh bg-paper text-ink">
      <NavigationBar items={navItems} activeHref={currentPath} onNavigate={navigate} />

      <main className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* One boundary for both routes: route changes run in a transition, so React keeps the
            current page visible while the lazy browse page loads. */}
        <Suspense fallback={<p className="py-16 text-body text-ink-3">Loading flags…</p>}>
          {route === 'home' && (
            <HomePage
              flagCount={flagCount}
              onBrowse={() => navigate('browse')}
              onFlagSelect={code => navigate('browse', `?countryCode=${encodeURIComponent(code)}`)}
            />
          )}
          {route === 'browse' && <BrowserPage flagCount={flagCount} />}
        </Suspense>
      </main>
    </div>
  )
}
