import type React from 'react'
import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { hrefToRoute, isInternalRoute, toRouteHref, withBasePath } from '../../routing/paths'
import type { Route } from '../../routing/paths'
import ThemeToggle from './ThemeToggle'

export interface NavItem {
  label: string
  href: string
  external?: boolean
}

interface NavigationBarProps {
  items: readonly NavItem[]
  activeHref: string
  onNavigate: (route: Route) => void
}

const linkBase =
  'inline-flex items-center gap-1.5 rounded-md text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent'

export default function NavigationBar({ items, activeHref, onNavigate }: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false)
    if (!isInternalRoute(href)) return
    event.preventDefault()
    onNavigate(hrefToRoute(href))
  }

  const renderLink = (item: NavItem, className: string) => {
    const isActive = activeHref === item.href
    return (
      <a
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        onClick={event => handleClick(item.href, event)}
        className={`${linkBase} ${className} ${isActive ? 'text-ink' : 'text-ink-3 hover:text-ink'}`}
      >
        {item.label}
        {item.external ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /> : null}
      </a>
    )
  }

  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href={toRouteHref('home')}
          onClick={event => handleClick(toRouteHref('home'), event)}
          className={`${linkBase} min-h-11 gap-2.5 text-ink`}
        >
          <img
            src={withBasePath('favicon.svg')}
            alt=""
            className="h-7 w-7"
            width="28"
            height="28"
          />
          <span className="font-semibold">Circle Flags UI</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {items.map(item => renderLink(item, 'h-9'))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-rule-strong text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(value => !value)}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div id="mobile-navigation" className="border-t border-rule px-5 py-2 md:hidden">
          <div className="grid">
            {items.map(item => renderLink(item, 'min-h-11 justify-between px-1'))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
