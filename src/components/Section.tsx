import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../lib/i18n'

/**
 * Sekce = spis. Když poprvé vjede do okna (data-inview), rozehrají se její animace
 * z index.css: nadpis se vypíše, řádky (.rows) se "vytisknou", razítka dopadnou,
 * bloky (.reveal) vyjedou. Pořadí v rámci sekce řídí --i u jednotlivých prvků.
 */
export function Section({ id, title, lead, children, className = '' }: {
  id: string; title: string; lead?: string; children: ReactNode; className?: string
}) {
  const { t } = useI18n()
  const [arrived, setArrived] = useState(false)
  const [inview, setInview] = useState(() => !('IntersectionObserver' in window))
  const ref = useRef<HTMLElement>(null)

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
      <div className="mx-auto max-w-6xl px-5 md:px-8">
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
