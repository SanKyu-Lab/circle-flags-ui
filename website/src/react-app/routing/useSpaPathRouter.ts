import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ROUTE_PATHS, stripBasePath, toRouteHref, type Route } from './paths'

const parseRoute = (pathname: string): Route => {
  const normalizedPath = stripBasePath(pathname)
  if (normalizedPath.startsWith(ROUTE_PATHS.browse)) return 'browse'
  return 'home'
}

const focusPageHeading = () => {
  document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useSpaPathRouter(initialRoute: Route = 'home') {
  const getInitialRoute = () =>
    typeof window === 'undefined' ? initialRoute : parseRoute(window.location.pathname)

  const [route, setRoute] = useState<Route>(getInitialRoute)
  const routeRef = useRef(route)
  const commitResolvers = useRef<Array<() => void>>([])

  useLayoutEffect(() => {
    routeRef.current = route
    commitResolvers.current.splice(0).forEach(resolve => resolve())
  }, [route])

  /**
   * Runs `beforeCommit`, renders `next`, and resolves after React commits the new route.
   * `startTransition` keeps the current page on screen while a lazy page loads, so the
   * view transition captures the finished page instead of a loading placeholder.
   */
  const commitRoute = useCallback((next: Route, beforeCommit: () => void) => {
    return new Promise<void>(resolve => {
      beforeCommit()
      if (routeRef.current === next) {
        resolve()
        return
      }
      commitResolvers.current.push(resolve)
      startTransition(() => setRoute(next))
    })
  }, [])

  const changeRoute = useCallback(
    (next: Route, beforeCommit: () => void) => {
      if (prefersReducedMotion() || !('startViewTransition' in document)) {
        commitRoute(next, beforeCommit).then(focusPageHeading)
        return
      }
      document
        .startViewTransition(() => commitRoute(next, beforeCommit))
        .finished.then(focusPageHeading)
    },
    [commitRoute]
  )

  useEffect(() => {
    const handlePop = () => changeRoute(parseRoute(window.location.pathname), () => {})
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [changeRoute])

  const navigate = useCallback(
    (next: Route, search: string = '') => {
      const targetPath = `${toRouteHref(next)}${search}`
      changeRoute(next, () => {
        if (window.location.pathname + window.location.search === targetPath) return
        window.history.pushState({ route: next }, '', targetPath)
        window.scrollTo({ top: 0 })
      })
    },
    [changeRoute]
  )

  const currentPath = useMemo(() => toRouteHref(route), [route])

  return { route, currentPath, navigate }
}
