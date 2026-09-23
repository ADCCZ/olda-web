import { useI18n } from '../lib/i18n'
import { Section } from './Section'

/** Služební záznam: hlavička jako na formuláři, pak text. */
export function Leadership() {
  const { t } = useI18n()
  const m = t.leadership.memo
  return (
    <Section id="leadership" title={t.leadership.title} lead={t.leadership.lead} pattern="tiles">
      <div className="panel reveal-file max-w-3xl p-5 md:p-8">
        <dl className="reveal grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-b border-line pb-4 font-mono text-sm" style={{ '--i': 5 } as React.CSSProperties}>
          <dt className="text-ink-2">{m.subject}</dt><dd>{m.subjectValue}</dd>
          <dt className="text-ink-2">{m.where}</dt><dd>{m.whereValue}</dd>
          <dt className="text-ink-2">{m.period}</dt><dd>{m.periodValue}</dd>
        </dl>
        <div className="mt-5 space-y-4 text-sm leading-relaxed md:text-base">
          {t.leadership.items.map((it, i) => (
            <p key={it.title} className="reveal" style={{ '--i': i + 6 } as React.CSSProperties}><strong className="font-medium">{it.title}.</strong> <span className="text-ink-2">{it.desc}</span></p>
          ))}
        </div>
      </div>
    </Section>
  )
}
