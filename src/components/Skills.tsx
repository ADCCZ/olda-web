import { useI18n } from '../lib/i18n'
import { Section } from './Section'

/** Inventář: psaný seznam, ne čipy. */
export function Skills() {
  const { t } = useI18n()
  const rows = [...t.skills.groups.map((g) => ({ name: g.name, items: g.items, planned: false })), { name: t.skills.plannedLabel, items: t.skills.planned, planned: true }]
  return (
    <Section id="skills" title={t.skills.title} lead={t.skills.lead} pattern="hex">
      <dl className="rows divide-y divide-line border-y border-line">
        {rows.map((r, i) => (
          <div key={r.name} className="grid gap-1 py-4 md:grid-cols-[200px_1fr] md:gap-8 md:py-5" style={{ '--i': i + 3 } as React.CSSProperties}>
            <dt className={`readout ${r.planned ? '' : 'text-ink'}`}>{r.name}</dt>
            <dd className={`font-mono text-sm leading-relaxed ${r.planned ? 'text-ink-2' : ''}`}>{r.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
