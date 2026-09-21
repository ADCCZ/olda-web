import { useI18n } from '../lib/i18n'
import { Section } from './Section'
import { interestIcon } from './Icons'
import { Guitar } from './Guitar'

export function About() {
  const { t } = useI18n()
  return (
    <Section id="about" title={t.about.title}>
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="max-w-prose">
          <p className="text-lg leading-snug text-ink md:text-xl">{t.about.lead}</p>
          {t.about.body.map((p, i) => (
            <p key={i} className="mt-5 leading-relaxed text-ink-2">{p}</p>
          ))}
        </div>
        <div>
          <h3 className="mb-5 font-display text-xs">{t.about.interestsTitle}</h3>
          <ul className="divide-y divide-line border-y border-line">
            {t.about.interests.map((it) => {
              const Icon = interestIcon[it.icon as keyof typeof interestIcon]
              return (
                <li key={it.label} className="group flex items-start gap-4 py-3.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors group-hover:border-accent group-hover:text-accent">
                    <Icon width={16} height={16} />
                  </span>
                  <span>
                    <span className="block font-medium">{it.label}</span>
                    {it.note && <span className="block text-sm text-ink-2">{it.note}</span>}
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-6 no-print"><Guitar /></div>
        </div>
      </div>
    </Section>
  )
}
