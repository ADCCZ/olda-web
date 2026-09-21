import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { CHORDS, StringSynth, stringFreq } from '../lib/synth'
import { earnStamp } from '../lib/stamps'

const NAMES = ['E', 'A', 'D', 'G', 'H', 'E']

/** Hratelná kytara: klikni na strunu, přejeď přes struny, nebo zmáčkni "brnknout". */
export function Guitar() {
  const { t } = useI18n()
  const synth = useMemo(() => new StringSynth(), [])
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
    <div className="panel p-5 md:p-6" data-guitar>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xs">{t.guitar.title}</h3>
        <span className="readout">{t.guitar.hint}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label={t.guitar.chords}>
        {Object.keys(CHORDS).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={chord === c}
            onClick={() => setChord(c as keyof typeof CHORDS)}
            className={`pill font-mono ${chord === c ? 'pill-solid' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className="mt-5 select-none rounded-xl border border-line bg-bg px-3 py-2"
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
              <span className="relative block h-9 flex-1">
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

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="pill pill-solid" onClick={() => strum(true)}>{t.guitar.strumDown}</button>
        <button type="button" className="pill" onClick={() => strum(false)}>{t.guitar.strumUp}</button>
      </div>
    </div>
  )
}
