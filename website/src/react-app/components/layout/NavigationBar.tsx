import type React from 'react'
import { useCallback, useMemo } from 'react'
import PillNav, { type PillNavItem } from '../animated-ui/PillNav'
import { type Route } from '../../routing/useSpaPathRouter'
import { isInternalRoute } from '../../routing/useSpaPathRouter'

interface NavigationBarProps {
  items: PillNavItem[]
  activeHref: string
  onRouteChange: (route: Route) => void
  onRouteChangeWithSearch?: (route: Route, search?: string) => void
}

const hrefToRoute = (href: string): Route => (href.startsWith('/browse') ? 'browse' : 'home')

export default function NavigationBar({
  items,
  activeHref,
  onRouteChange,
  onRouteChangeWithSearch,
}: NavigationBarProps) {
  const palette = useMemo(
    () => ({
      base: '#0e1224',
      pill: '#182037',
      hoverText: '#e9edff',
      pillText: '#f7f8ff',
    }),
    []
  )

  const handleNavClick = useCallback(
    (item: PillNavItem, _index: number, event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isInternalRoute(item.href)) return
      event.preventDefault()
      if (onRouteChangeWithSearch) {
        onRouteChangeWithSearch(hrefToRoute(item.href), '')
      } else {
        onRouteChange(hrefToRoute(item.href))
      }
    },
    [onRouteChange, onRouteChangeWithSearch]
  )

  return (
    <header className="relative max-w-6xl mx-auto px-6 pt-8 pb-4">
      <PillNav
        logo="./favicon.svg"
        initialLoadAnimation={true}
        logoAlt="Circle Flags logo"
        items={items}
        activeHref={activeHref}
        baseColor={palette.base}
        pillColor={palette.pill}
        hoveredPillTextColor={palette.hoverText}
        pillTextColor={palette.pillText}
        className="relative!"
        floating={true}
        onItemClick={handleNavClick}
      />
    </header>
  )
}
