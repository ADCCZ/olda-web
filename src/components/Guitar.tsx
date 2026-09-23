import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { CHORDS, StringSynth, stringFreq } from '../lib/synth'
import { earnStamp } from '../lib/stamps'
import { Close } from './Icons'

const NAMES = ['E', 'A', 'D', 'G', 'H', 'E']
/** jeden syntezátor pro celou stránku (AudioContext vznikne až při prvním brnknutí) */
const synth = new StringSynth()

/** pražce jako na skutečném krku: vzdálenosti se k tělu zkracují (poloha n-tého pražce je 1 - 2^(-n/12)) */
const FRETS = Array.from({ length: 7 }, (_, k) => ((1 - 2 ** (-(k + 1) / 12)) / (1 - 2 ** (-8 / 12))) * 100)
const fretboard = FRETS.map((x) => `linear-gradient(90deg, transparent calc(${x}% - 1px), var(--line) calc(${x}% - 1px) ${x}%, transparent ${x}%)`).join(', ')

/** Kytara uprostřed obrazovky (tlačítko Hrát v Profilu). Esc zavře (App.tsx). */
export function GuitarModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={t.guitar.title}
        >
          <motion.div
            className="w-full max-w-4xl"
            initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Guitar onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Hratelná kytara: klikni na strunu, přejeď přes struny, nebo zmáčkni "brnknout".
 * Na desktopu leží jako vodorovný krk: ovládání vlevo, struny přes pražce vpravo.
 */
export function Guitar({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n()
  const [chord, setChord] = useState<keyof typeof CHORDS>('Em')
  const [vibrating, setVibrating] = useState<number[]>([])
  const down = useRef(false)

  useEffect(() => {
    const up = () => { down.current = false }
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up) }
  }, [])

  const wiggle = (i: number) => {
    setVibrating((v) => [...v, i])
    setTimeout(() => setVibrating((v) => { const k = v.indexOf(i); return k < 0 ? v : [...v.slice(0, k), ...v.slice(k + 1)] }), 350)
  }

  const play = (i: number, delay = 0) => {
    const fret = CHORDS[chord][i]
    if (fret === null) return
    synth.pluck(stringFreq(i, fret), delay, 1 - i * 0.04)
    if (delay) setTimeout(() => wiggle(i), delay * 1000)
    else wiggle(i)
  }

  const strum = async (downstroke = true) => {
    await synth.resume()
    const order = downstroke ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0]
    order.forEach((i, k) => play(i, k * 0.035))
    earnStamp('guitar')
  }

  // klávesnice: 1–6 struny, mezerník brnkne
  const onKey = (e: React.KeyboardEvent) => {
    const n = Number(e.key)
    if (n >= 1 && n <= 6) { e.preventDefault(); void synth.resume().then(() => play(n - 1)) }
    if (e.key === ' ') { e.preventDefault(); void strum() }
  }

  return (
    <div className="panel p-5 md:p-6 lg:grid lg:grid-cols-[minmax(0,17rem)_1fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-10" data-guitar>
      <div className="flex items-start justify-between gap-3 lg:col-span-2 lg:mb-6">
        <div>
          <h3 className="font-display text-sm">{t.guitar.title}</h3>
          <p className="readout mt-1">{t.guitar.hint}</p>
        </div>
        {onClose && <button type="button" onClick={onClose} className="text-ink-2 hover:text-accent" aria-label="Close"><Close width={18} height={18} /></button>}
      </div>

      <div className="mt-4 flex flex-wrap content-start gap-2 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:grid lg:grid-cols-3" role="radiogroup" aria-label={t.guitar.chords}>
        {Object.keys(CHORDS).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={chord === c}
            onClick={() => setChord(c as keyof typeof CHORDS)}
            className={`pill justify-center font-mono ${chord === c ? 'pill-solid' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className="mt-5 select-none rounded-xl border border-line bg-bg px-3 py-2 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-0 lg:self-center"
        style={{ touchAction: 'none' }}
        tabIndex={0}
        onKeyDown={onKey}
        aria-label={t.guitar.strings}
        onPointerDown={(e) => {
          down.current = true
          void synth.resume()
          // dotyk implicitně zachytí pointer – pustíme ho, aby fungovalo přejíždění přes struny
          try { (e.target as HTMLElement).releasePointerCapture(e.pointerId) } catch { /* nic k puštění */ }
        }}
      >
        {NAMES.map((name, i) => {
          const fret = CHORDS[chord][i]
          const muted = fret === null
          return (
            <div
              key={i}
              className="group flex h-9 items-center gap-3"
              onPointerEnter={() => { if (down.current) play(i) }}
              onPointerDown={() => play(i)}
            >
              <span className={`readout w-4 text-right ${muted ? 'opacity-40' : ''}`}>{name}</span>
              {/* pražce a pražec u hlavy (nultý) tvoří souvislé čáry přes všechny řádky */}
              <span className="relative block h-9 flex-1 border-l-[3px] border-line" style={{ backgroundImage: fretboard }}>
                <span
                  className={`absolute left-0 right-0 top-1/2 block -translate-y-1/2 rounded-full transition-colors ${muted ? 'bg-line' : 'bg-ink group-hover:bg-accent'} ${vibrating.includes(i) ? 'guitar-vibrate' : ''}`}
                  style={{ height: 1 + (5 - i) * 0.5 }}
                />
              </span>
              <span className={`readout w-6 ${muted ? 'opacity-40' : ''}`}>{muted ? 'x' : fret}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 lg:col-start-1 lg:row-start-3 lg:self-end">
        <button type="button" className="pill pill-solid" onClick={() => strum(true)}>{t.guitar.strumDown}</button>
        <button type="button" className="pill" onClick={() => strum(false)}>{t.guitar.strumUp}</button>
      </div>
    </div>
  )
}
