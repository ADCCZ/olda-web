import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../lib/i18n'
import helmet from '../assets/horned-helmet.svg'

/** pozadí sekce (index.css → .pat-*): obklad z kachliček, nebo zlatá helma s rohy */
export type Pattern = 'tiles' | 'horns'

/**
 * Zlatá helma leží v rohu sekce, skoro celá vidět, lehce nakloněná ke středu, velká podle sekce.
 * Roh se při každém načtení losuje (levý horní ne, tam je nadpis), natočení a velikost se jen mírně mění.
 */
const CORNERS = [
  { right: '-2%', top: '5%', tilt: -10, origin: '100% 0' },
  { right: '-2%', bottom: '4%', tilt: -8, origin: '100% 100%' },
  { left: '-2%', bottom: '4%', tilt: 8, origin: '0 100%' },
] as const
function randomHelmet(): React.CSSProperties {
  const r = Math.random
  const { tilt, origin, ...place } = CORNERS[Math.floor(r() * CORNERS.length)]
  return {
    ...place,
    // podle velikosti sekce (cqw/cqh, kontejner je .pat-horns): asi polovina výšky, nejvýš 45 % šířky,
    // na úzkém displeji až 75 % šířky
    width: `calc(min(max(45cqw, min(75cqw, 300px)), 78cqh) * ${(0.9 + r() * 0.2).toFixed(2)})`,
    transform: `rotate(${(tilt + (r() - 0.5) * 8).toFixed(1)}deg)`,
    transformOrigin: origin,
  }
}

/**
 * Sekce = spis. Když poprvé vjede do okna (data-inview), rozehrají se její animace
 * z index.css: nadpis se vypíše, řádky (.rows) se "vytisknou", razítka dopadnou,
 * bloky (.reveal) vyjedou. Pořadí v rámci sekce řídí --i u jednotlivých prvků.
 * Pozadí se střídá (úvod se počítá jako první): liché obklad (tiles), sudé zlatá helma (horns).
 */
export function Section({ id, title, lead, children, className = '', pattern }: {
  id: string; title: string; lead?: string; children: ReactNode; className?: string; pattern?: Pattern
}) {
  const { t } = useI18n()
  const [arrived, setArrived] = useState(false)
  const [inview, setInview] = useState(() => !('IntersectionObserver' in window))
  const ref = useRef<HTMLElement>(null)
  const [helm] = useState(randomHelmet)

  // rozsvítí se, když sem někdo přišel portálem
  useEffect(() => {
    const on = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== `#${id}`) return
      setArrived(true)
      const t = window.setTimeout(() => setArrived(false), 3000)
      return () => window.clearTimeout(t)
    }
    window.addEventListener('portal:arrived', on)
    return () => window.removeEventListener('portal:arrived', on)
  }, [id])

  // animace jen jednou, při prvním příchodu do okna
  useEffect(() => {
    const el = ref.current
    if (!el || inview) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInview(true); io.disconnect() }
    }, { threshold: 0.08, rootMargin: '0px 0px -12% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [inview])

  return (
    <section
      ref={ref}
      id={id}
      className={`relative border-t border-line py-14 md:py-24 ${className}`}
      data-reveal
      data-inview={inview || undefined}
      data-arrived={arrived || undefined}
    >
      {pattern && (
        <div aria-hidden className={`section-bg pat-${pattern}`}>
          {pattern === 'horns' && (
            <img
              src={helmet}
              alt=""
              loading="lazy"
              decoding="async"
              style={helm}
            />
          )}
        </div>
      )}
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-8 max-w-prose md:mb-12">
          {arrived && <p className="arrived-note readout mb-2">{t.hero.arrived}</p>}
          <h2 className="section-title font-display text-xl leading-tight md:text-2xl">{title}</h2>
          {lead && <p className="reveal mt-3 text-ink-2" style={{ '--i': 2 } as React.CSSProperties}>{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
