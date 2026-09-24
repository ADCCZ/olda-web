import { useI18n } from '../lib/i18n'
import type { Skill } from '../data/content'
import { Section } from './Section'

/** pět dílků jako LED ukazatel na přístroji; při odkrytí sekce se rozsvítí jeden po druhém */
function Meter({ level, label }: { level: Skill['level']; label: string }) {
  return (
    <span className="meter flex shrink-0 gap-1" role="img" aria-label={label} title={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? 'on' : ''} style={{ '--n': n } as React.CSSProperties} />
      ))}
    </span>
  )
}

/**
 * Inventář technologií: skupiny jako karty v kartotéce, u každé technologie pětistupňový
 * ukazatel zkušenosti (popisky stupňů v t.skills.levels), nahoře legenda, poslední karta plány.
 * Úrovně a skupiny se upravují v src/data/content.ts → skills.
 */
export function Skills() {
  const { t } = useI18n()
  const s = t.skills
  const label = (level: Skill['level']) => `${s.levelOf(level)}: ${s.levels[level - 1]}`
  return (
    <Section id="skills" title={s.title} lead={s.lead} pattern="horns" side="right">
      {/* legenda stupnice jako stupnice přístroje: pět polí podle délky popisku (vždy na jednom řádku),
          kontrolky přibývají zleva doprava; na užších obrazovkách pod sebou, ukazatele v jednom sloupci */}
      <section className="reveal panel mb-8 p-4 sm:p-5" style={{ '--i': 3 } as React.CSSProperties} aria-label={s.scaleTitle}>
        <h3 className="readout mb-3 text-ink">{s.scaleTitle}</h3>
        <ol className="grid gap-2.5 lg:flex lg:gap-0 lg:divide-x lg:divide-line">
          {s.levels.map((l, i) => (
            <li key={l} className="flex items-center gap-3 lg:flex-auto lg:flex-col lg:items-start lg:gap-2 lg:px-4 lg:first:pl-0 lg:last:pr-0">
              <Meter level={(i + 1) as Skill['level']} label={label((i + 1) as Skill['level'])} />
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-sm text-accent">{i + 1}</span>
                <span className="text-sm leading-snug text-ink-2 lg:whitespace-nowrap">{l}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="rows grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.groups.map((g, gi) => (
          <section key={g.name} className="panel p-5" style={{ '--i': gi + 4 } as React.CSSProperties} aria-label={g.name}>
            <h3 className="readout mb-3 text-ink">{g.name}</h3>
            <ul className="divide-y divide-line">
              {g.items.map((it) => (
                <li key={it.name} className="flex items-center justify-between gap-4 py-2">
                  <span className="font-mono text-sm">{it.name}</span>
                  <Meter level={it.level} label={label(it.level)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        {/* co se chystám doučit: poslední karta mřížky, čárkovaná a bez ukazatelů */}
        <section className="panel border-dashed p-5" style={{ '--i': s.groups.length + 4 } as React.CSSProperties} aria-label={s.plannedLabel}>
          <h3 className="readout mb-3 text-ink">{s.plannedLabel}</h3>
          <ul className="divide-y divide-line">
            {s.planned.map((it) => (
              <li key={it} className="flex items-center gap-3 py-2 font-mono text-sm text-ink-2">
                <span className="h-2 w-2 shrink-0 rounded-full border border-line" aria-hidden />{it}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Section>
  )
}
