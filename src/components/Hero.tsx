import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { Branches } from './Branches'
import { Scene } from './Scene'
import { portalLink } from '../lib/portal'
import { STAMP_IDS } from '../lib/stamps'

/** kolikrát už tu byl, "časová smyčka" */
function loopCount() {
  try {
    const n = Number(localStorage.getItem('loop') ?? '0') + 1
    localStorage.setItem('loop', String(n))
    return n
  } catch { return 1 }
}

const reducedMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return true } }

/** běží ještě úvodní obrazovka (Boot)? stejná podmínka jako v Boot.tsx */
function bootPending() {
  try { return !reducedMotion() && !sessionStorage.getItem('booted') } catch { return false }
}

/** psací stroj: kolik znaků textu už je napsáno (po změně jazyka se píše znovu) */
function useTyped(text: string, start: boolean, delay: number, speed = 42) {
  const [typed, setTyped] = useState({ text, n: 0 })
  const [reduce] = useState(reducedMotion)
  useEffect(() => {
    if (!start || reduce) return
    let i = 0
    const tick = () => { i++; setTyped({ text, n: i }); if (i < text.length) id = window.setTimeout(tick, speed) }
    let id = window.setTimeout(tick, delay)
    return () => window.clearTimeout(id)
  }, [text, start, delay, speed, reduce])
  if (reduce) return text.length
  return typed.text === text ? typed.n : 0
}

/** zpoždění vstupní animace prvku (čte se v CSS jako --d) */
const d = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties

export function Hero({ onAvatarMessage, onOpenTerminal, onOpenPexeso, stamps, onOpenStamps }: { onAvatarMessage: (m: string) => void; onOpenTerminal: () => void; onOpenPexeso: () => void; stamps: number; onOpenStamps: () => void }) {
  const { t } = useI18n()
  const [loop] = useState(loopCount)
  const [clock, setClock] = useState('')
  // vstupní animace se rozjedou až po úvodní obrazovce, jinak by proběhly pod ní
  const [go, setGo] = useState(() => !bootPending())
  const typed = useTyped(t.hero.role, go, 1000)

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('cs-CZ', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (go) return
    const on = () => setGo(true)
    window.addEventListener('boot:done', on)
    const id = window.setTimeout(on, 8000)
    return () => { window.removeEventListener('boot:done', on); window.clearTimeout(id) }
  }, [go])

  return (
    <section id="top" className={`hero fit relative overflow-hidden pt-16 ${go ? 'hero-go' : ''}`}>
      {/* úvod je první obrazovka, liché mají v pozadí obklad z kachliček */}
      <div aria-hidden className="section-bg pat-tiles hero-tiles" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-6 pb-4 md:px-8 md:pt-8 lg:flex-1 lg:grid-cols-[1.05fr_1fr] lg:content-center lg:gap-10 lg:pt-10">
        {/* @container: velikost jména se odvíjí od šířky sloupce, takže vyjde vždy na dva řádky */}
        <div className="@container max-w-xl">
          <p className="readout mb-3 flex items-center gap-3 md:mb-4">
            <span className="stamp enter-stamp" style={d(0.15)}>{t.hero.stamp}</span>
            <span className="enter" style={d(0.45)}>{t.hero.hello}</span>
          </p>
          <h1 className="font-display text-[min(calc(var(--text-base,1rem)*3.4),10.4cqi)] leading-[1.08] tracking-tight">
            <span className="enter-name block whitespace-nowrap" style={d(0.25)}>{t.academicTitle} {t.firstName} {t.middleName}</span>
            <span className="enter-name block" style={d(0.45)}>{t.lastName}</span>
          </h1>
          <p className="mt-3 font-mono text-sm text-accent-2 sm:text-base md:mt-4 md:text-lg">
            <span className="sr-only">{t.hero.role}</span>
            <span aria-hidden>
              {t.hero.role.slice(0, typed)}
              <span className="type-cursor blink" />
              <span className="invisible">{t.hero.role.slice(typed)}</span>
            </span>
          </p>
          <p className="enter mt-3 max-w-prose text-base leading-relaxed text-ink-2 md:mt-4 md:text-lg" style={d(0.9)}>{t.hero.tagline}</p>
          <div className="enter mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-6" style={d(1.1)}>
            <a href="#projects" onClick={(e) => portalLink(e)} className="pill pill-solid">{t.hero.ctaProjects}</a>
            <a href="#contact" onClick={(e) => portalLink(e)} className="text-base text-ink-2 underline decoration-line underline-offset-4 hover:text-accent">{t.hero.ctaContact}</a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
          <Branches onAvatarMessage={onAvatarMessage} onAction={() => onOpenPexeso()} />
          <p className="enter readout mt-3 hidden text-center sm:block" style={d(2.1)}>{t.hero.orbitHint}</p>
        </div>
      </div>

      {/* hala archivu, pod ní podlaha se štítkem na stole úředníka */}
      <Scene />
      <div className="floor no-print relative pb-3 pt-1 md:pb-4">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="enter wood flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2.5 font-mono text-[11px] sm:gap-x-6 sm:px-4 sm:text-xs" style={d(1.5)}>
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-accent-2" />{t.hero.readout[0]}</span>
            <span className="hidden sm:inline">{t.hero.readout[1]}</span>
            <span className="hidden sm:inline">{t.hero.loop} #{loop}</span>
            <span className="hidden tabular-nums md:inline">{clock}</span>
            <button type="button" onClick={onOpenStamps} className="hover:text-accent-2">{t.hero.stamps} {stamps}/{STAMP_IDS.length}</button>
            <button type="button" onClick={onOpenTerminal} className="ml-auto hover:text-accent-2">{t.hero.readout[2]}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
