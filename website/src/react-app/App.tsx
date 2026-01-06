import { lazy, Suspense, useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import AppBackground from './components/layout/AppBackground'
import NavigationBar from './components/layout/NavigationBar'
import HomePage from './components/pages/HomePage'
import { useSpaPathRouter } from './routing/useSpaPathRouter'
import { toRouteHref, withBasePath } from './routing/paths'
import { getFlagCount } from './utils/flagData'

const BrowserPage = lazy(() => import('./components/pages/BrowserPage'))

export default function App() {
  const { route, currentPath, navigate } = useSpaPathRouter()
  const flagCount = useMemo(() => getFlagCount(), [])

  const handleFlagNavigate = (code: string) => {
    navigate('browse', `?countryCode=${encodeURIComponent(code)}`)
  }

  const navItems = useMemo(
    () => [
      { label: 'Home', href: toRouteHref('home'), ariaLabel: 'Home page' },
      { label: 'Browse', href: toRouteHref('browse'), ariaLabel: 'Browse flags' },
      {
        label: 'Docs',
        href: withBasePath('docs/guides/getting-started/'),
        ariaLabel: 'Documentation',
        target: '_blank',
        rel: 'noreferrer',
        icon: <ExternalLink className="h-3.5 w-3.5" aria-hidden />,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/SanKyu-Lab/react-circle-flags',
        ariaLabel: 'GitHub repository',
        target: '_blank',
        rel: 'noreferrer',
        icon: <ExternalLink className="h-3.5 w-3.5" aria-hidden />,
      },
    ],
    []
  )

  return (
    <div
      className="min-h-screen bg-(--bg) text-(--ink) relative overflow-hidden geometric-bg"
      data-theme="dark"
    >
      <AppBackground />

      <NavigationBar
        items={navItems}
        activeHref={currentPath}
        onRouteChangeWithSearch={navigate}
        onRouteChange={navigate}
      />

      <main className="relative max-w-6xl mx-auto px-6 py-12">
        {route === 'home' && (
          <HomePage
            flagCount={flagCount}
            onBrowseClick={() => window.open(toRouteHref('browse'), '_blank')}
            onFlagClick={handleFlagNavigate}
            onFilterNavigate={code =>
              window.open(withBasePath(`browse?filter=${encodeURIComponent(code)}`), '_blank')
            }
          />
        )}
        {route === 'browse' && (
          <Suspense fallback={<div className="text-sm text-(--muted)">Loading flags...</div>}>
            <BrowserPage flagCount={flagCount} />
          </Suspense>
        )}
      </main>
    </div>
  )
}
