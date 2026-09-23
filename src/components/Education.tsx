import { useI18n } from '../lib/i18n'
import { Section } from './Section'

export function Education() {
  const { t } = useI18n()
  return (
    <Section id="education" title={t.education.title} pattern="blueprint" horns="bottom-3 left-[7%] md:bottom-8">
      <div className="relative">
        <span className="stamp absolute right-0 -top-16 md:-top-6">{t.education.stamp}</span>
        <ol className="rows divide-y divide-line border-y border-line">
          {t.education.items.map((it, i) => (
            <li key={it.title} className="grid gap-1 py-4 md:grid-cols-[200px_1fr] md:gap-8 md:py-5" style={{ '--i': i + 1 } as React.CSSProperties}>
              <p className="readout">{it.period}</p>
              <div>
                <h3 className={`font-medium ${it.planned ? 'text-ink-2' : ''}`}>{it.title}</h3>
                <p className="text-sm text-ink-2">{it.place}{it.note ? `. ${it.note}` : ''}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
