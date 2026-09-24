import { useI18n } from '../lib/i18n'
import { Section } from './Section'

/** Služební záznam přes celou šířku: hlavička jako na formuláři v jednom řádku, pod ní tři dovednosti vedle sebe. */
export function Leadership() {
  const { t } = useI18n()
  const m = t.leadership.memo
  return (
    <Section id="leadership" title={t.leadership.title} lead={t.leadership.lead} pattern="tiles">
      <div className="panel reveal-file p-5 md:p-8">
        {/* na mobilu tabulka pod sebou, od tabletu dvojice v jednom řádku */}
        <dl className="reveal grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-b border-line pb-4 font-mono text-sm md:flex md:flex-wrap md:gap-x-12" style={{ '--i': 5 } as React.CSSProperties}>
          {[[m.subject, m.subjectValue], [m.where, m.whereValue], [m.period, m.periodValue]].map(([k, v]) => (
            <div key={k} className="contents md:flex md:gap-3">
              <dt className="text-ink-2">{k}</dt><dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 grid gap-4 text-sm leading-relaxed md:text-base lg:grid-cols-3 lg:gap-8">
          {t.leadership.items.map((it, i) => (
            <div key={it.title} className="reveal lg:border-l lg:border-line lg:pl-6 lg:first:border-l-0 lg:first:pl-0" style={{ '--i': i + 6 } as React.CSSProperties}>
              <h3 className="font-medium">{it.title}</h3>
              <p className="mt-1 text-ink-2">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
