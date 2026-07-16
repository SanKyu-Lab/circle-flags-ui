import type React from 'react'
import { useCallback, useState } from 'react'
import { Menu, X } from 'lucide-react'
import type { PillNavItem } from '../animated-ui/PillNav'
import { hrefToRoute, isInternalRoute, withBasePath } from '../../routing/paths'
import type { Route } from '../../routing/paths'

interface NavigationBarProps {
  items: PillNavItem[]
  activeHref: string
  onRouteChange: (route: Route) => void
  onRouteChangeWithSearch?: (route: Route, search?: string) => void
}

export default function NavigationBar({
  items,
  activeHref,
  onRouteChange,
  onRouteChangeWithSearch,
}: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = useCallback(
    (item: PillNavItem, event: React.MouseEvent<HTMLAnchorElement>) => {
      setIsOpen(false)
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
    <header className="sticky top-0 z-30 border-b border-(--border-weak) bg-(--bg)/92 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href={items[0]?.href ?? '/'}
          onClick={event => {
            if (items[0]) handleNavClick(items[0], event)
          }}
          className="inline-flex items-center gap-3 rounded-lg text-sm font-semibold text-(--ink) outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
        >
          <img
            src={withBasePath('favicon.svg')}
            alt=""
            className="h-8 w-8"
            width="32"
            height="32"
          />
          <span>Circle Flags UI</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {items.map(item => {
            const isActive = activeHref === item.href
            return (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                target={item.target}
                rel={item.rel}
                onClick={event => handleNavClick(item, event)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-(--accent) ${
                  isActive
                    ? 'bg-(--surface-2) text-(--ink)'
                    : 'text-(--muted-light) hover:bg-(--surface) hover:text-(--ink)'
                }`}
              >
                {item.label}
                {item.icon}
              </a>
            )
          })}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-(--border-strong) text-(--ink) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) md:hidden"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(value => !value)}
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-(--border-weak) bg-(--bg) px-5 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {items.map(item => (
              <a
                key={`${item.label}-${item.href}`}
                href={item.href}
                target={item.target}
                rel={item.rel}
                onClick={event => handleNavClick(item, event)}
                className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium text-(--ink) hover:bg-(--surface)"
              >
                {item.label}
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
