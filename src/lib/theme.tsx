import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { earnStamp } from './stamps'

export type Theme = 'dark' | 'light'
type Ctx = { theme: Theme; toggle: () => void }
const ThemeContext = createContext<Ctx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const value = useMemo<Ctx>(() => ({
    theme,
    toggle: () => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      setTheme(next)
      document.documentElement.dataset.theme = next
      try { localStorage.setItem('theme', next) } catch { /* ignore */ }
      earnStamp('theme')
    },
  }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside provider')
  return ctx
}
