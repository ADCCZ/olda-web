import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { Close, Download, Menu, Moon, Sun } from './Icons'
import { portalLink } from '../lib/portal'

const links = ['about', 'education', 'experience', 'projects', 'skills', 'leadership', 'contact'] as const

/** Logo: hodiny, jejichž ručička ukazuje, jak daleko na stránce jsi. */
function Logo() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 })
  const rotate = useTransform(smooth, [0, 1], [0, 360])
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="var(--bg-2)" stroke="var(--accent)" strokeWidth="1.5" />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="4.5" stroke="var(--ink-2)" strokeWidth="1.2" transform={`rotate(${a} 12 12)`} />
      ))}
      <motion.line x1="12" y1="12" x2="12" y2="5.5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ rotate, originX: '12px', originY: '12px' }} />
      <circle cx="12" cy="12" r="1.6" fill="var(--accent)" />
    </svg>
  )
}

export function Nav() {
  const { t, toggle: toggleLang } = useI18n()
  const { theme, toggle: toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${scrolled || open ? 'border-b border-line bg-bg/90 backdrop-blur' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" onClick={(e) => portalLink(e)} className="flex items-center gap-2.5 font-display text-sm" aria-label="Domů">
          <Logo />
          <span className="hidden sm:inline">{t.firstName} {t.lastName}</span>
          <span className="sm:hidden">{t.firstName[0]}. {t.lastName}</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm lg:flex" aria-label="Hlavní">
          {links.map((l) => (
            <a key={l} href={`#${l}`} onClick={(e) => portalLink(e, t.nav[l])} className="text-ink-2 transition-colors hover:text-accent">{t.nav[l]}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={t.cvFile} download className="pill hidden whitespace-nowrap lg:inline-flex"><Download width={16} height={16} />{t.nav.cv}</a>
          <button type="button" onClick={toggleLang} className="pill font-mono" aria-label="Language">{t.nav.lang}</button>
          <button type="button" onClick={toggleTheme} className="pill" aria-label={t.nav.theme}>
            {theme === 'dark' ? <Sun width={16} height={16} /> : <Moon width={16} height={16} />}
          </button>
          <button type="button" onClick={() => setOpen((o) => !o)} className="pill lg:hidden" aria-label="Menu" aria-expanded={open}>
            {open ? <Close width={16} height={16} /> : <Menu width={16} height={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line px-5 py-4 lg:hidden" aria-label="Mobilní">
          <ul className="flex flex-col gap-3 text-base">
            {links.map((l) => (
              <li key={l}><a href={`#${l}`} onClick={(e) => { setOpen(false); portalLink(e, t.nav[l]) }} className="block py-1">{t.nav[l]}</a></li>
            ))}
            <li><a href={t.cvFile} download className="pill mt-2"><Download width={16} height={16} />{t.nav.cv}</a></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
