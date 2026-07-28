import { useCallback, useEffect, useMemo, useState } from 'react'
import { ROUTE_PATHS, stripBasePath, toRouteHref, type Route } from './paths'

const parseRoute = (pathname: string): Route => {
  const normalizedPath = stripBasePath(pathname)
  if (normalizedPath.startsWith(ROUTE_PATHS.browse)) return 'browse'
  return 'home'
}

export function useSpaPathRouter(initialRoute: Route = 'home') {
  const getInitialRoute = () =>
    typeof window === 'undefined' ? initialRoute : parseRoute(window.location.pathname)

  const [route, setRoute] = useState<Route>(getInitialRoute)

  useEffect(() => {
    const handlePop = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const navigate = useCallback((next: Route, search: string = '') => {
    if (typeof window === 'undefined') {
      setRoute(next)
      return
    }
    const targetPath = `${toRouteHref(next)}${search}`
    if (window.location.pathname + window.location.search !== targetPath) {
      window.history.pushState({ route: next }, '', targetPath)
    }
    setRoute(next)
  }, [])

  const currentPath = useMemo(() => toRouteHref(route), [route])

  return { route, currentPath, navigate }
}
