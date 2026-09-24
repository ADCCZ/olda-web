import { useState } from 'react'
import { useI18n } from '../lib/i18n'
import { GAMES, UPDATED, byHours, withoutHours } from '../data/games'

const TOP = 10

/**
 * Rozbalený seznam her u „Videohry“: jen pořadí podle odehraného času (hodiny se
 * nezobrazují, slouží k řazení), pod ním hry mimo pořadí. Data: src/data/games.ts.
 */
export function GamesList({ id }: { id: string }) {
  const { t, lang } = useI18n()
  const s = t.about.games
  const [all, setAll] = useState(false)
  const ranked = byHours(GAMES)
  const rest = withoutHours(GAMES)
  const shown = all ? ranked : ranked.slice(0, TOP)
  const name = (g: (typeof GAMES)[number]) => (lang === 'cs' && g.cs) || g.name
  // datum bez času v UTC, ať se v žádném pásmu neposune o den
  const updated = new Intl.DateTimeFormat(lang === 'cs' ? 'cs-CZ' : 'en-GB', { day: 'numeric', month: lang === 'cs' ? 'numeric' : 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(UPDATED))

  return (
    <div id={id} className="mb-3 mt-1 rounded-lg bg-bg/85 p-3 backdrop-blur-[2px]">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="readout">{s.summary(ranked.length)}</p>
        <p className="readout text-[11px]">{s.updated}: <time dateTime={UPDATED} className="text-ink">{updated}</time></p>
      </div>
      <ol className="divide-y divide-line/60">
        {shown.map((g, k) => (
          <li key={g.name} className="flex items-baseline gap-2 py-1.5 text-sm">
            <span className={`readout w-7 shrink-0 tabular-nums ${k < 3 ? 'text-accent' : ''}`}>{String(k + 1).padStart(2, '0')}</span>
            <span className="min-w-0 truncate" title={name(g)}>{name(g)}</span>
            {(g.store === 'epic' || g.store === 'both') && <span className="readout shrink-0 text-[11px]">{g.store === 'epic' ? s.onEpic : s.alsoEpic}</span>}
          </li>
        ))}
      </ol>
      {ranked.length > TOP && (
        <button type="button" onClick={() => setAll(!all)} className="pill mt-3 px-3 py-1.5 text-xs" aria-controls={id}>
          {all ? s.showLess : s.showAll(ranked.length)}
        </button>
      )}
      {rest.length > 0 && (
        <>
          <p className="readout mb-2 mt-5">{s.noHours}</p>
          <ul className="flex flex-wrap gap-1.5">
            {rest.map((g) => (
              <li key={g.name} className="rounded border border-line px-2 py-1 text-xs text-ink-2">
                {name(g)}
                {g.store === 'epic' && <span className="readout ml-1.5 text-[10px]">{s.onEpic}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
