import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { flip, hideMismatch, newGame, type Game } from '../lib/pexeso'
import { Close, Github } from './Icons'
import { earnStamp } from '../lib/stamps'

/** Pexeso – single-player verze projektu z KIV/UPS, běží rovnou v prohlížeči. */
export function Pexeso({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={t.pexeso.title}
        >
          <Board onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Samotná hra – mountuje se při každém otevření, takže začíná vždy od nuly. */
function Board({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [game, setGame] = useState<Game>(() => newGame())
  const [now, setNow] = useState(() => Date.now())
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!game.startedAt || game.won) return
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [game.startedAt, game.won])

  const onFlip = (id: number) => {
    const { game: g, mismatch } = flip(game, id)
    setGame(g)
    if (g.won) earnStamp('pexeso')
    if (mismatch) {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setGame((cur) => hideMismatch(cur)), 750)
    }
  }

  const elapsed = game.startedAt ? Math.max(0, Math.round(((game.finishedAt ?? now) - game.startedAt) / 1000)) : 0

  return (
          <motion.div
            className="panel w-full max-w-md p-5 md:p-6"
            initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-sm">{t.pexeso.title}</h3>
                <p className="readout mt-1">{t.pexeso.moves}: {game.moves}, {t.pexeso.time}: {elapsed} s</p>
              </div>
              <button type="button" onClick={onClose} className="text-ink-2 hover:text-accent" aria-label="Close"><Close width={18} height={18} /></button>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2" style={{ perspective: 800 }}>
              {game.cards.map((c) => {
                const up = c.flipped || c.matched
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onFlip(c.id)}
                    disabled={up || game.won}
                    aria-label={up ? c.label : t.pexeso.card}
                    className="relative aspect-square"
                    style={{ transformStyle: 'preserve-3d', transition: 'transform 0.35s', transform: up ? 'rotateY(180deg)' : 'none' }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center rounded-lg border border-line bg-bg-3 transition-colors hover:border-accent" style={{ backfaceVisibility: 'hidden' }}>
                      {/* přesýpací hodiny – rub karty */}
                      <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden><path d="M2 1h14M2 21h14M4 1c0 6 5 7 5 10s-5 4-5 10M14 1c0 6-5 7-5 10s5 4 5 10" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </span>
                    <span
                      className={`absolute inset-0 flex items-center justify-center rounded-lg border font-display text-xs ${c.matched ? 'border-accent bg-accent text-accent-ink' : 'border-ink bg-bg'}`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      {c.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              {game.won ? (
                <p className="font-display text-sm">{t.pexeso.won(game.moves, elapsed)}</p>
              ) : (
                <p className="text-sm text-ink-2">{t.pexeso.lead}</p>
              )}
              <div className="flex gap-2">
                <a href="https://github.com/adccz/tmwmf_sem_UPS" target="_blank" rel="noreferrer" className="pill"><Github width={14} height={14} />{t.pexeso.server}</a>
                <button type="button" className="pill pill-solid" onClick={() => setGame(newGame())}>{t.pexeso.again}</button>
              </div>
            </div>
          </motion.div>
  )
}
