import { useI18n } from '../lib/i18n'
import { Section } from './Section'

/** Služební záznam: hlavička jako na formuláři, pak text. */
export function Leadership() {
  const { t } = useI18n()
  const m = t.leadership.memo
  return (
    <Section id="leadership" title={t.leadership.title} lead={t.leadership.lead}>
      <div className="panel max-w-3xl p-5 md:p-8">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-b border-line pb-4 font-mono text-sm">
          <dt className="text-ink-2">{m.subject}</dt><dd>{m.subjectValue}</dd>
          <dt className="text-ink-2">{m.where}</dt><dd>{m.whereValue}</dd>
          <dt className="text-ink-2">{m.period}</dt><dd>{m.periodValue}</dd>
        </dl>
        <div className="mt-5 space-y-4 text-sm leading-relaxed md:text-base">
          {t.leadership.items.map((it) => (
            <p key={it.title}><strong className="font-medium">{it.title}.</strong> <span className="text-ink-2">{it.desc}</span></p>
          ))}
        </div>
      </div>
    </Section>
  )
}
