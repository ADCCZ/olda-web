import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { Branches } from './Branches'
import { Scene } from './Scene'
import { portalLink } from '../lib/portal'

/** kolikrát už tu byl, "časová smyčka" */
function loopCount() {
  try {
    const n = Number(localStorage.getItem('loop') ?? '0') + 1
    localStorage.setItem('loop', String(n))
    return n
  } catch { return 1 }
}

export function Hero({ onAvatarMessage, onOpenTerminal, onOpenPexeso, stamps, onOpenStamps }: { onAvatarMessage: (m: string) => void; onOpenTerminal: () => void; onOpenPexeso: () => void; stamps: number; onOpenStamps: () => void }) {
  const { t } = useI18n()
  const [loop] = useState(loopCount)
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('cs-CZ', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative overflow-hidden pt-24 pb-10 md:pt-36 md:pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div className="max-w-xl">
          <p className="readout mb-5 flex items-center gap-3">
            <span className="stamp">{t.hero.stamp}</span>
            {t.hero.hello}
          </p>
          <h1 className="font-display text-[clamp(1.9rem,9vw,2.6rem)] leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            {t.academicTitle} {t.firstName} {t.middleName}
            <br />
            {t.lastName}
          </h1>
          <p className="mt-4 font-mono text-base text-accent-2 sm:text-lg">{t.hero.role}</p>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-2">{t.hero.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#projects" onClick={(e) => portalLink(e)} className="pill pill-solid">{t.hero.ctaProjects}</a>
            <a href="#contact" onClick={(e) => portalLink(e)} className="text-ink-2 underline decoration-line underline-offset-4 hover:text-accent">{t.hero.ctaContact}</a>
          </div>
        </div>

        <div>
          <Branches onAvatarMessage={onAvatarMessage} onAction={() => onOpenPexeso()} />
          <p className="readout mt-3 text-center">{t.hero.orbitHint}</p>
        </div>
      </div>

      {/* hala archivu */}
      <div className="mt-8 md:mt-10"><Scene /></div>

      {/* štítek na stole úředníka */}
      <div className="mx-auto mt-5 max-w-6xl px-5 md:mt-6 md:px-8">
        <div className="wood flex flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-3 font-mono text-xs">
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-accent-2" />{t.hero.readout[0]}</span>
          <span>{t.hero.readout[1]}</span>
          <span>{t.hero.loop} #{loop}</span>
          <span className="hidden tabular-nums sm:inline">{clock}</span>
          <button type="button" onClick={onOpenStamps} className="hover:text-accent-2">{t.hero.stamps} {stamps}/8</button>
          <button type="button" onClick={onOpenTerminal} className="ml-auto hover:text-accent-2">{t.hero.readout[2]}</button>
        </div>
      </div>
    </section>
  )
}
