import { useI18n } from '../lib/i18n'
import { Section } from './Section'

export function Experience() {
  const { t } = useI18n()
  return (
    <Section id="experience" title={t.experience.title} lead={t.experience.lead} pattern="horns" side="left">
      <ol className="rows divide-y divide-line border-y border-line">
        {t.experience.items.map((it, i) => (
          <li key={it.title} className="grid gap-2 py-5 md:grid-cols-[200px_1fr] md:gap-8 md:py-6" style={{ '--i': i + 3 } as React.CSSProperties}>
            <p className="readout">{it.period}</p>
            <div>
              <h3 className="font-medium">{it.title}</h3>
              <p className="text-sm text-ink-2">{it.org}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-2 marker:text-accent">
                {it.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      {t.certs.length > 0 && (
        <div className="mt-10">
          <h3 className="reveal font-display text-xs" style={{ '--i': t.experience.items.length + 3 } as React.CSSProperties}>{t.certsTitle}</h3>
          <ul className="rows mt-3 divide-y divide-line border-y border-line">
            {t.certs.map((c, i) => (
              <li key={c.name} className="grid gap-1 py-3 md:grid-cols-[200px_1fr] md:gap-8" style={{ '--i': t.experience.items.length + 4 + i } as React.CSSProperties}>
                <p className="readout">{c.year}</p>
                <p><span className="font-medium">{c.name}</span><span className="text-ink-2">, {c.org}</span></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
