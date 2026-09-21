import { useEffect, useState, type ReactNode } from 'react'
import { useI18n } from '../lib/i18n'

export function Section({ id, title, lead, children, className = '' }: {
  id: string; title: string; lead?: string; children: ReactNode; className?: string
}) {
  const { t } = useI18n()
  const [arrived, setArrived] = useState(false)

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

  return (
    <section id={id} className={`border-t border-line py-14 md:py-24 ${className}`} data-arrived={arrived || undefined}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-8 max-w-prose md:mb-12">
          {arrived && <p className="arrived-note readout mb-2">{t.hero.arrived}</p>}
          <h2 className="font-display text-xl leading-tight md:text-2xl">{title}</h2>
          {lead && <p className="mt-3 text-ink-2">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
