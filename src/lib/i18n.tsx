import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Lang } from '../data/content'

type Ctx = { lang: Lang; t: (typeof content)['cs']; setLang: (l: Lang) => void; toggle: () => void }
const I18nContext = createContext<Ctx | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'cs' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  return 'cs'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* ignore */ }
  }
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = content[lang].meta.title
  }, [lang])
  const value = useMemo<Ctx>(() => ({
    lang, t: content[lang], setLang, toggle: () => setLang(lang === 'cs' ? 'en' : 'cs'),
  }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n outside provider')
  return ctx
}
