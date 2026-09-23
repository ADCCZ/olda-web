import { useI18n } from '../lib/i18n'
import { Section } from './Section'
import { Download, Github, Linkedin, Mail } from './Icons'

export function Contact() {
  const { t } = useI18n()
  const soon = <span className="readout ml-1">({t.contact.soon})</span>
  return (
    <Section id="contact" title={t.contact.title} pattern="tiles">
      <div className="flex flex-wrap items-start gap-6">
        <p className="reveal max-w-prose text-lg leading-snug md:text-xl" style={{ '--i': 1 } as React.CSSProperties}>{t.contact.lead}</p>
        <span className="stamp mt-2 text-sm">{t.contact.stamp}</span>
      </div>
      <dl className="reveal mt-8 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-mono text-sm" style={{ '--i': 3 } as React.CSSProperties}>
        <dt className="text-ink-2">{t.contact.location}</dt><dd>{t.location}</dd>
        {t.phone && <><dt className="text-ink-2">{t.contact.phone}</dt><dd><a href={`tel:${t.phone.replace(/\s/g, '')}`} className="hover:text-accent">{t.phone}</a></dd></>}
      </dl>
      <div className="pop-in mt-6 flex flex-wrap gap-3">
        <a href={t.github} target="_blank" rel="noreferrer" className="pill"><Github width={16} height={16} />{t.contact.github}</a>
        {t.email ? (
          <a href={t.email} className="pill"><Mail width={16} height={16} />{t.contact.email}</a>
        ) : (
          <span className="pill cursor-default opacity-60"><Mail width={16} height={16} />{t.contact.email}{soon}</span>
        )}
        {t.linkedin ? (
          <a href={t.linkedin} target="_blank" rel="noreferrer" className="pill"><Linkedin width={16} height={16} />{t.contact.linkedin}</a>
        ) : (
          <span className="pill cursor-default opacity-60"><Linkedin width={16} height={16} />{t.contact.linkedin}{soon}</span>
        )}
        <a href={t.cvFile} download className="pill pill-solid"><Download width={16} height={16} />{t.contact.cv}</a>
      </div>
      <p className="reveal readout mt-3" style={{ '--i': 8 } as React.CSSProperties}>
        <a href={t.cvPlainFile} download className="underline decoration-dotted underline-offset-2 hover:text-accent">{t.contact.cvPlain}</a>
      </p>
    </Section>
  )
}
