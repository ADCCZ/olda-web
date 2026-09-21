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
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 pb-3 md:pt-24 md:pb-4">
      {/* hala archivu jako pozadí, podlaha sahá až na spodek úvodní obrazovky */}
      <div className="absolute inset-x-0 bottom-0 -z-10"><Scene /></div>
      {/* stín pro čitelnost textu nad pozadím */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg from-35% to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 px-5 py-4 md:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <div className="max-w-xl">
          <p className="readout mb-3 flex items-center gap-3 md:mb-5">
            <span className="stamp">{t.hero.stamp}</span>
            {t.hero.hello}
          </p>
          <h1 className="font-display text-[clamp(1.9rem,7vw,3.4rem)] leading-[1.05] tracking-tight">
            {t.academicTitle} {t.firstName} {t.middleName}
            <br />
            {t.lastName}
          </h1>
          <p className="mt-3 font-mono text-sm text-accent-2 sm:text-base md:mt-4 md:text-lg">{t.hero.role}</p>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-2 md:mt-5 md:text-lg">{t.hero.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 md:mt-7">
            <a href="#projects" onClick={(e) => portalLink(e)} className="pill pill-solid">{t.hero.ctaProjects}</a>
            <a href="#contact" onClick={(e) => portalLink(e)} className="text-ink-2 underline decoration-line underline-offset-4 hover:text-accent">{t.hero.ctaContact}</a>
          </div>
        </div>

        <div>
          <Branches onAvatarMessage={onAvatarMessage} onAction={() => onOpenPexeso()} />
          <p className="readout mt-2 hidden text-center sm:block">{t.hero.orbitHint}</p>
        </div>
      </div>

      {/* štítek na stole úředníka, před podlahou */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="wood flex flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-2.5 font-mono text-xs">
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
