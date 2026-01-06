// This component should not be modified unless absolutely necessary.

import type { FC } from 'react'
import { ExternalLink } from 'lucide-react'

export interface TabItem {
  id: string
  label: string
  description?: string
  href?: string
  external?: boolean
}

interface TabsProps {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

const styles = {
  container:
    'flex items-center gap-1 rounded-xl border border-(--border) bg-(--surface) p-1 shadow-(--shadow-sm)',
  button: {
    base: 'group relative flex flex-none items-center justify-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
    active:
      'text-(--accent-contrast) shadow-(--shadow-sm) border-(--accent) bg-(--accent)/10 hover:bg-(--accent)/20',
    inactive: 'text-(--muted) hover:text-(--ink)',
  },
  description: {
    active: 'text-xs text-(--accent-contrast)/80',
    inactive: 'text-xs text-(--muted)',
  },
  border: {
    base: 'absolute inset-0 rounded-xl border transition-opacity',
    active: 'border-(--accent-contrast)/40 opacity-80',
    inactive: 'border-transparent opacity-0',
  },
} as const

const Tabs: FC<TabsProps> = ({ items, activeId, onChange, className }) => (
  <div
    className={`${styles.container} ${className ?? ''}`}
    role="tablist"
    aria-label="Installation managers"
  >
    {items.map(({ id, label, description, href, external }) => {
      const isActive = id === activeId
      const sharedClasses = `${styles.button.base} ${isActive ? styles.button.active : styles.button.inactive}`

      return (
        <div key={id} role="presentation">
          {href ? (
            <a
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${id}`}
              tabIndex={isActive ? 0 : -1}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className={sharedClasses}
              onClick={() => id !== activeId && onChange(id)}
            >
              <span className="inline-flex items-center gap-2">
                <span>{label}</span>
                {external ? <ExternalLink className="h-3.5 w-3.5" aria-hidden /> : null}
              </span>
              {description && (
                <span className={isActive ? styles.description.active : styles.description.inactive}>
                  {description}
                </span>
              )}
              <span
                aria-hidden
                className={`${styles.border.base} ${isActive ? styles.border.active : styles.border.inactive}`}
              />
            </a>
          ) : (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => id !== activeId && onChange(id)}
              className={sharedClasses}
            >
              <span>{label}</span>
              {description && (
                <span className={isActive ? styles.description.active : styles.description.inactive}>
                  {description}
                </span>
              )}
              <span
                aria-hidden
                className={`${styles.border.base} ${isActive ? styles.border.active : styles.border.inactive}`}
              />
            </button>
          )}
        </div>
      )
    })}
  </div>
)

export default Tabs
