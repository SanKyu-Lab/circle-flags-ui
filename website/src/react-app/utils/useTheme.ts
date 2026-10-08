import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

// Shared with the Starlight docs so both parts of the site keep the same theme choice.
const STORAGE_KEY = 'starlight-theme'
const darkQuery = '(prefers-color-scheme: dark)'

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })

  const media = window.matchMedia(darkQuery)
  const handleSystemChange = (event: MediaQueryListEvent) => {
    if (localStorage.getItem(STORAGE_KEY)) return
    document.documentElement.dataset.theme = event.matches ? 'dark' : 'light'
  }
  media.addEventListener('change', handleSystemChange)

  return () => {
    observer.disconnect()
    media.removeEventListener('change', handleSystemChange)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => 'light')

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    document.documentElement.dataset.theme = next
  }, [])

  return { theme, toggleTheme }
}
