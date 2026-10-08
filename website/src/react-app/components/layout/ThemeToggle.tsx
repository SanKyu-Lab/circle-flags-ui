import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../utils/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-3 outline-none transition-colors hover:bg-sunken hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  )
}
