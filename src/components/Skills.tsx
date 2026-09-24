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
 * ukazatel zkušenosti (popisky stupňů v t.skills.levels), nahoře legenda, dole plány.
 * Úrovně a skupiny se upravují v src/data/content.ts → skills.
 */
export function Skills() {
  const { t } = useI18n()
  const s = t.skills
  const label = (level: Skill['level']) => `${s.levelOf(level)}: ${s.levels[level - 1]}`
  return (
    <Section id="skills" title={s.title} lead={s.lead} pattern="horns" side="right">
      {/* legenda stupnice */}
      <ol className="reveal mb-8 flex flex-wrap gap-x-6 gap-y-2" style={{ '--i': 3 } as React.CSSProperties}>
        {s.levels.map((l, i) => (
          <li key={l} className="readout flex items-center gap-2">
            <Meter level={(i + 1) as Skill['level']} label={label((i + 1) as Skill['level'])} />
            <span><span className="text-ink">{i + 1}</span> {l}</span>
          </li>
        ))}
      </ol>

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
      </div>

      {/* co se chystám doučit: bez ukazatele */}
      <div className="reveal mt-6 grid gap-2 border-t border-line pt-5 md:grid-cols-[200px_1fr] md:gap-8" style={{ '--i': s.groups.length + 5 } as React.CSSProperties}>
        <p className="readout">{s.plannedLabel}</p>
        <p className="font-mono text-sm leading-relaxed text-ink-2">{s.planned.join(', ')}</p>
      </div>
    </Section>
  )
}
