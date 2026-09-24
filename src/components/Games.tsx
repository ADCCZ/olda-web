import { useState } from 'react'
import { motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { GAMES, byHours, withoutHours } from '../data/games'

const TOP = 10

/**
 * Rozbalený seznam her u „Videohry“: hry podle odehraných hodin s ukazatelem
 * (poměr k nejhranější), pod nimi hry bez zaznamenaného času. Data: src/data/games.ts.
 */
export function GamesList({ id }: { id: string }) {
  const { t, lang } = useI18n()
  const s = t.about.games
  const [all, setAll] = useState(false)
  const played = byHours(GAMES)
  const rest = withoutHours(GAMES)
  const max = played[0]?.hours ?? 1
  const fmt = new Intl.NumberFormat(lang === 'cs' ? 'cs-CZ' : 'en-GB', { maximumFractionDigits: 1 })
  const total = played.reduce((a, g) => a + g.hours, 0)
  const shown = all ? played : played.slice(0, TOP)
  const name = (g: (typeof GAMES)[number]) => (lang === 'cs' && g.cs) || g.name

  return (
    <div id={id} className="mb-3 mt-1 rounded-lg bg-bg/85 p-3 backdrop-blur-[2px]">
      <p className="readout mb-3">{s.summary(played.length, fmt.format(Math.round(total)))}</p>
      <ol className="space-y-2">
        {shown.map((g, k) => (
          <li key={g.name} className="grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-2 text-sm">
            <span className="readout tabular-nums">{String(k + 1).padStart(2, '0')}</span>
            <span className="min-w-0 truncate" title={name(g)}>
              {name(g)}
              {g.store && <span className="readout ml-2 text-[11px]">{g.store === 'epic' ? s.onEpic : s.alsoEpic}</span>}
            </span>
            <span className="font-mono text-xs tabular-nums text-ink-2">{fmt.format(g.hours)} h</span>
            {/* ukazatel: délka podle hodin vůči nejhranější hře */}
            <span className="col-start-2 col-end-4 mt-1 block h-1 overflow-hidden rounded-full bg-line/40" aria-hidden>
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(1, (g.hours / max) * 100)}%` }}
                transition={{ duration: 0.7, delay: Math.min(k, TOP) * 0.04, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </span>
          </li>
        ))}
      </ol>
      {played.length > TOP && (
        <button type="button" onClick={() => setAll(!all)} className="pill mt-4 px-3 py-1.5 text-xs" aria-controls={id}>
          {all ? s.showLess : s.showAll(played.length)}
        </button>
      )}
      {rest.length > 0 && (
        <>
          <p className="readout mb-2 mt-5">{s.noHours}</p>
          <ul className="flex flex-wrap gap-1.5">
            {rest.map((g) => (
              <li key={g.name} className="rounded border border-line px-2 py-1 text-xs text-ink-2">{name(g)}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
