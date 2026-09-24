import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { Section } from './Section'
import { GamesList } from './Games'
import { Chevron, External, interestIcon, Play } from './Icons'

/**
 * Profil: dva vyvážené sloupce (text | "mimo kód"). U kytary je tlačítko Hrát,
 * které otevře hratelnou kytaru uprostřed obrazovky, u her tlačítko Seznam rozbalí
 * seznam her pod řádkem. Texty: src/data/content.ts → about, hry: src/data/games.ts.
 */
export function About({ onPlayGuitar }: { onPlayGuitar: () => void }) {
  const { t } = useI18n()
  const [gamesOpen, setGamesOpen] = useState(false)
  return (
    <Section id="about" title={t.about.title} pattern="horns" side="right">
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div className="max-w-prose">
          <p className="reveal text-lg leading-snug text-ink md:text-xl" style={{ '--i': 1 } as React.CSSProperties}>{t.about.lead}</p>
          {t.about.body.map((p, i) => (
            <p key={i} className="reveal mt-5 leading-relaxed text-ink-2" style={{ '--i': 2 + i } as React.CSSProperties}>{p}</p>
          ))}
        </div>
        <div>
          <h3 className="reveal mb-4 font-display text-xs" style={{ '--i': 2 } as React.CSSProperties}>{t.about.interestsTitle}</h3>
          {/* na tabletu dva sloupce, na desktopu jeden vedle textu */}
          <ul className="rows grid border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
            {t.about.interests.map((it, i) => {
              const Icon = interestIcon[it.icon as keyof typeof interestIcon]
              return (
                <Fragment key={it.label}>
                  <li className="group flex items-center gap-4 border-b border-line py-3" style={{ '--i': i + 3 } as React.CSSProperties}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors group-hover:border-accent group-hover:text-accent">
                      <Icon width={16} height={16} />
                    </span>
                    <span>
                      {it.href ? (
                        <a href={it.href} target="_blank" rel="noreferrer" title={new URL(it.href).hostname.replace(/^www\./, '')} className="inline-flex items-center gap-1.5 font-medium underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent">
                          {it.label}<External width={13} height={13} className="shrink-0" />
                        </a>
                      ) : (
                        <span className="block font-medium">{it.label}</span>
                      )}
                      {it.note && <span className="block text-sm text-ink-2">{it.note}</span>}
                    </span>
                    {it.action === 'guitar' && (
                      <button type="button" onClick={onPlayGuitar} className="pill pill-solid no-print ml-auto shrink-0">
                        <Play width={14} height={14} />{t.guitar.play}
                      </button>
                    )}
                    {it.action === 'games' && (
                      <button type="button" onClick={() => setGamesOpen(!gamesOpen)} aria-expanded={gamesOpen} aria-controls="games-list" className="pill no-print ml-auto shrink-0">
                        {t.about.games.toggle}
                        <Chevron width={14} height={14} className={`transition-transform duration-300 ${gamesOpen ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </li>
                  {/* seznam her pod řádkem; na tabletu přes oba sloupce */}
                  <AnimatePresence initial={false}>
                    {it.action === 'games' && gamesOpen && (
                      <motion.li
                        key="games"
                        className="overflow-hidden border-b border-line sm:col-span-2 lg:col-span-1"
                        style={{ animation: 'none' }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        <GamesList id="games-list" />
                      </motion.li>
                    )}
                  </AnimatePresence>
                </Fragment>
              )
            })}
          </ul>
        </div>
      </div>
    </Section>
  )
}
