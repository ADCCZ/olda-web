import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from './lib/i18n'
import { useKonami } from './hooks/useKonami'
import type { Effect } from './lib/terminal'
import { loadStamps, saveStamps, STAMP_IDS, type StampId } from './lib/stamps'
import { Boot } from './components/Boot'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Leadership } from './components/Leadership'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Terminal } from './components/Terminal'
import { Pexeso } from './components/Pexeso'
import { Hyperdrive, Toast } from './components/Effects'
import { Guide } from './components/Guide'
import { Portal } from './components/Portal'
import { StampsPanel } from './components/Stamps'

export default function App() {
  const { t } = useI18n()
  const [toast, setToast] = useState<string | null>(null)
  const [terminal, setTerminal] = useState(false)
  const [pexeso, setPexeso] = useState(false)
  const [warp, setWarp] = useState(false)
  const [stampsOpen, setStampsOpen] = useState(false)
  const [stamps, setStamps] = useState<StampId[]>(loadStamps)
  const [guide, setGuide] = useState(() => { try { return localStorage.getItem('guide') !== 'off' } catch { return true } })
  const toastTimer = useRef<number | undefined>(undefined)
  const guideSay = (m: string) => window.dispatchEvent(new CustomEvent('guide:say', { detail: m }))

  const say = useCallback((m: string) => {
    setToast(m)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  // razítka: cokoli na webu může vyslat 'stamp:earn'
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<StampId>).detail
      setStamps((cur) => {
        if (cur.includes(id)) return cur
        const next = [...cur, id]
        saveStamps(next)
        const name = t.stampsList.items[id].name
        window.setTimeout(() => guideSay(next.length === STAMP_IDS.length ? t.guide.allStamps : t.guide.stamp(name)), 300)
        return next
      })
    }
    window.addEventListener('stamp:earn', on)
    return () => window.removeEventListener('stamp:earn', on)
  }, [t])

  const hyperdrive = useCallback(() => {
    setWarp(true)
    say(t.eggs.konami)
    window.setTimeout(() => guideSay(t.guide.konami), 2000)
    window.setTimeout(() => setWarp(false), 3200)
    window.dispatchEvent(new CustomEvent('stamp:earn', { detail: 'konami' }))
  }, [say, t.eggs.konami, t.guide.konami])

  // Easter egg 1: Konami kód
  useKonami(hyperdrive)

  // Easter egg 2: ~ otevře terminál, Esc zavře cokoli
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
      if ((e.key === '~' || e.key === '`') && !typing) { e.preventDefault(); setTerminal((o) => !o) }
      if (e.key === 'Escape') { setTerminal(false); setPexeso(false); setStampsOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { if (terminal) window.dispatchEvent(new CustomEvent('stamp:earn', { detail: 'terminal' })) }, [terminal])

  // Easter egg 3: zpráva v konzoli + titulek, když odejdeš z karty
  useEffect(() => {
    console.log('%c' + t.eggs.console, 'color:#c9a227;font-family:monospace')
    const onVis = () => { document.title = document.hidden ? t.eggs.tabTitle : t.meta.title }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [t])

  const openPexeso = () => { setPexeso(true); guideSay(t.guide.pexeso) }
  const showGuide = (on: boolean) => {
    setGuide(on)
    try { localStorage.setItem('guide', on ? 'on' : 'off') } catch { /* ignore */ }
  }
  const onTerminalEffect = (e: Effect) => {
    if (e === 'pexeso') { setTerminal(false); openPexeso() }
    if (e === 'hyperdrive') hyperdrive()
    if (e === 'guide') { setTerminal(false); showGuide(true) }
  }

  return (
    <>
      <Boot />
      <a href="#main" className="sr-only z-50 rounded bg-accent px-3 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">{t.footer.skip}</a>
      <Nav />
      <main id="main">
        <Hero
          onAvatarMessage={say}
          onOpenTerminal={() => setTerminal(true)}
          onOpenPexeso={openPexeso}
          stamps={stamps.length}
          onOpenStamps={() => setStampsOpen(true)}
        />
        <About />
        <Education />
        <Experience />
        <Projects onPexeso={openPexeso} />
        <Skills />
        <Leadership />
        <Contact />
      </main>
      <Footer onCallGuide={() => showGuide(true)} />
      <Terminal open={terminal} onClose={() => setTerminal(false)} onEffect={onTerminalEffect} />
      <Pexeso open={pexeso} onClose={() => setPexeso(false)} />
      <StampsPanel open={stampsOpen} earned={stamps} onClose={() => setStampsOpen(false)} />
      <Guide visible={guide} onHide={() => showGuide(false)} />
      <Hyperdrive active={warp} />
      <Portal />
      <Toast message={toast} />
    </>
  )
}
