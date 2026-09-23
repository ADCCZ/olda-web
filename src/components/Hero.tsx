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
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pt-6 pb-4 md:px-8 md:pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-10">
        {/* @container: velikost jména se odvíjí od šířky sloupce, takže vyjde vždy na dva řádky */}
        <div className="@container max-w-xl">
          <p className="readout mb-3 flex items-center gap-3 md:mb-4">
            <span className="stamp">{t.hero.stamp}</span>
            {t.hero.hello}
          </p>
          <h1 className="font-display text-[min(3.4rem,10.4cqi)] leading-[1.08] tracking-tight">
            <span className="whitespace-nowrap">{t.academicTitle} {t.firstName} {t.middleName}</span>
            <br />
            {t.lastName}
          </h1>
          <p className="mt-3 font-mono text-sm text-accent-2 sm:text-base md:mt-4 md:text-lg">{t.hero.role}</p>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-2 md:mt-4 md:text-lg">{t.hero.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-6">
            <a href="#projects" onClick={(e) => portalLink(e)} className="pill pill-solid">{t.hero.ctaProjects}</a>
            <a href="#contact" onClick={(e) => portalLink(e)} className="text-ink-2 underline decoration-line underline-offset-4 hover:text-accent">{t.hero.ctaContact}</a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
          <Branches onAvatarMessage={onAvatarMessage} onAction={() => onOpenPexeso()} />
          <p className="readout mt-3 hidden text-center sm:block">{t.hero.orbitHint}</p>
        </div>
      </div>

      {/* hala archivu, pod ní podlaha se štítkem na stole úředníka */}
      <Scene />
      <div className="floor no-print pb-3 pt-1 md:pb-4">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="wood flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2.5 font-mono text-[11px] sm:gap-x-6 sm:px-4 sm:text-xs">
            <span className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-accent-2" />{t.hero.readout[0]}</span>
            <span className="hidden sm:inline">{t.hero.readout[1]}</span>
            <span className="hidden sm:inline">{t.hero.loop} #{loop}</span>
            <span className="hidden tabular-nums md:inline">{clock}</span>
            <button type="button" onClick={onOpenStamps} className="hover:text-accent-2">{t.hero.stamps} {stamps}/8</button>
            <button type="button" onClick={onOpenTerminal} className="ml-auto hover:text-accent-2">{t.hero.readout[2]}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
