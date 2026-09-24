import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { StringSynth, stringFreq, type Tone } from '../lib/synth'
import {
  CHORDS, CHORD_GROUPS, CHORD_KEYS, CHORD_ORDER, PATTERNS, PROGRESSIONS, STRING_KEYS, STRING_NAMES,
  chordName, keyForChord, keyLabel, matchChord, noteName, stroke, strumStrings,
  type PatternId, type ProgressionId, type Shape,
} from '../lib/guitar'
import { earnStamp } from '../lib/stamps'
import { Close, Play } from './Icons'

/** jeden syntezátor pro celou stránku (AudioContext vznikne až při prvním brnknutí) */
const synth = new StringSynth()

const FRET_COUNT = 12
const MAX_CAPO = 7
const INLAYS = [3, 5, 7, 9]
const TONES: Tone[] = ['steel', 'nylon', 'muted']
/**
 * Pražce jako na skutečném krku: n-tý pražec leží v 1 - 2^(-n/12) délky struny, k tělu se zkracují.
 * Podíly jsou normalizované na součet 12 (součet fr pod 1 by vyplnil jen část řádku).
 */
const FRET_W = Array.from({ length: FRET_COUNT }, (_, k) => 2 ** (-k / 12) - 2 ** (-(k + 1) / 12))
const FRET_FR = FRET_W.map((w) => `${((w / FRET_W.reduce((a, b) => a + b)) * FRET_COUNT).toFixed(3)}fr`).join(' ')
/** sloupce řádku hmatníku: název struny, nultý pražec (prázdná struna), 12 pražců, tón */
const ROW = `1.5rem 2rem ${FRET_FR} 1.75rem`
/** jak zobrazit krok rytmického vzorce */
const SYMBOL: Record<string, string> = { D: '↓', U: '↑', '-': '·', B: 'B', A: 'b' }

/** Kytara uprostřed obrazovky (tlačítko Hrát v Profilu). Esc zavře (App.tsx). */
export function GuitarModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-3 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={t.guitar.title}
        >
          <motion.div
            className="w-full max-w-5xl"
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
 * Hratelná kytara: hmatník s 12 pražci (klik zmáčkne strunu, klik na název ji ztlumí),
 * 16 akordů, kapodastr, tři zvuky, doprovod (průběh akordů × rytmus × tempo)
 * a hraní na klávesnici (mapa kláves v lib/guitar.ts).
 */
export function Guitar({ onClose }: { onClose?: () => void }) {
  const { t, lang } = useI18n()
  const g = t.guitar
  const [shape, setShapeState] = useState<Shape>(() => [...CHORDS.Em])
  const [capo, setCapoState] = useState(0)
  const [tone, setToneState] = useState<Tone>('steel')
  const [vibrating, setVibrating] = useState<number[]>([])
  const [playing, setPlaying] = useState(false)
  const [progression, setProgression] = useState<ProgressionId>('camp')
  const [pattern, setPattern] = useState<PatternId>('camp')
  const [bpm, setBpm] = useState(96)
  const [beat, setBeat] = useState<{ bar: number; step: number } | null>(null)

  // plánovač doprovodu a klávesnice čtou aktuální hodnoty přes refy
  const shapeRef = useRef(shape)
  const capoRef = useRef(capo)
  const toneRef = useRef(tone)
  const pos = useRef({ bar: 0, step: 0 })
  const timers = useRef(new Set<number>())
  const down = useRef(false)

  const setShape = (next: Shape) => { shapeRef.current = next; setShapeState(next) }
  const setCapo = (c: number) => { const v = Math.max(0, Math.min(MAX_CAPO, c)); capoRef.current = v; setCapoState(v) }
  const setTone = (v: Tone) => { toneRef.current = v; setToneState(v) }

  const later = (ms: number, fn: () => void) => {
    const id = window.setTimeout(() => { timers.current.delete(id); fn() }, ms)
    timers.current.add(id)
  }
  useEffect(() => {
    const set = timers.current
    const up = () => { down.current = false }
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      set.forEach(clearTimeout)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  const wiggle = (i: number, delay = 0) => later(delay * 1000, () => {
    setVibrating((v) => [...v, i])
    later(350, () => setVibrating((v) => { const k = v.indexOf(i); return k < 0 ? v : [...v.slice(0, k), ...v.slice(k + 1)] }))
  })

  const pluck = (i: number, sh: Shape, delay = 0, velocity = 1) => {
    const f = sh[i]
    if (f === null) return
    synth.pluck(stringFreq(i, f + capoRef.current), delay, velocity * (1 - i * 0.04), toneRef.current)
    wiggle(i, delay)
  }
  const strumShape = (sh: Shape, dir: 'down' | 'up', delay = 0, velocity = 1) => {
    strumStrings(sh, dir).forEach((i, k) => pluck(i, sh, delay + k * (dir === 'down' ? 0.03 : 0.022), velocity))
  }
  const strum = async (dir: 'down' | 'up') => {
    await synth.resume()
    strumShape(shapeRef.current, dir, 0, dir === 'down' ? 1 : 0.75)
    earnStamp('guitar')
  }
  /** akord: přepnout a hned zahrát */
  const playChord = (name: string) => {
    const next = [...CHORDS[name]]
    setShape(next)
    void synth.resume().then(() => strumShape(next, 'down'))
    earnStamp('guitar')
  }
  /** klik na hmatník: zmáčknout strunu na pražci (pod kapodastrem = prázdná struna) */
  const press = (i: number, fret: number) => {
    const next = [...shapeRef.current]
    next[i] = fret <= capoRef.current ? 0 : fret - capoRef.current
    setShape(next)
    void synth.resume()
    pluck(i, next)
  }
  const toggleMute = (i: number) => {
    const next = [...shapeRef.current]
    next[i] = next[i] === null ? 0 : null
    setShape(next)
  }

  // doprovod: plánuje osminy kousek dopředu podle hodin zvukové karty, ať rytmus nekolísá
  useEffect(() => {
    if (!playing) return
    const steps = PATTERNS[pattern]
    const prog = progression === 'current' ? null : PROGRESSIONS[progression]
    const stepDur = 60 / bpm / 2
    let next = synth.time() + 0.06
    const tick = () => {
      while (next < synth.time() + 0.15) {
        const { bar, step } = pos.current
        const name = prog ? prog[bar % prog.length] : null
        const sh = name ? CHORDS[name] : shapeRef.current
        const delay = next - synth.time()
        const s = stroke(steps[step] ?? '-', sh)
        if (s.kind === 'down' || s.kind === 'up') strumShape(sh, s.kind, delay, s.kind === 'up' ? 0.62 : step === 0 ? 1 : 0.82)
        if (s.kind === 'string') pluck(s.string, sh, delay, step === 0 ? 0.95 : 0.75)
        later(delay * 1000, () => {
          setBeat({ bar, step })
          if (name && step === 0) setShape([...CHORDS[name]])
        })
        const step2 = step + 1 >= steps.length ? 0 : step + 1
        pos.current = { bar: step2 === 0 ? bar + 1 : bar, step: step2 }
        next += stepDur
      }
    }
    tick()
    const id = window.setInterval(tick, 25)
    return () => window.clearInterval(id)
    // strumShape/pluck/later čtou jen refy a stabilní settery, proto nejsou v závislostech
  }, [playing, pattern, progression, bpm])

  const start = async () => {
    await synth.resume()
    pos.current = { bar: 0, step: 0 }
    setPlaying(true)
    earnStamp('guitar')
  }
  const stop = () => {
    setPlaying(false)
    timers.current.forEach(clearTimeout)
    timers.current.clear()
    setBeat(null)
    setVibrating([])
  }
  const current = matchChord(shape)

  // hraní na klávesnici (klávesy podle polohy, viz lib/guitar.ts)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const chord = CHORD_KEYS[e.code]
      if (chord) { e.preventDefault(); if (!e.repeat) playChord(chord); return }
      const si = STRING_KEYS.indexOf(e.code)
      if (si >= 0) { e.preventDefault(); if (!e.repeat) { void synth.resume(); pluck(si, shapeRef.current) } return }
      if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) void strum(e.shiftKey ? 'up' : 'down'); return }
      if (e.code === 'KeyP') { e.preventDefault(); if (playing) stop(); else void start(); return }
      if ((e.target as HTMLElement | null)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const k = CHORD_ORDER.indexOf(matchChord(shapeRef.current) ?? '')
        const n = CHORD_ORDER.length
        playChord(CHORD_ORDER[(k + (e.key === 'ArrowRight' ? 1 : n - 1) + (k < 0 ? n : 0)) % n])
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setCapo(capoRef.current + (e.key === 'ArrowUp' ? 1 : -1)) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const progChords = progression === 'current' ? (current ? [current] : []) : PROGRESSIONS[progression]

  return (
    <div className="panel max-h-[92svh] overflow-y-auto p-4 sm:p-5 md:p-6" data-guitar>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm">{g.title}</h3>
          <p className="readout mt-1">{g.hint}</p>
        </div>
        {onClose && <button type="button" onClick={onClose} className="text-ink-2 hover:text-accent" aria-label="Close"><Close width={18} height={18} /></button>}
      </div>

      {/* akordy + displej s aktuálním akordem */}
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_10rem]">
        <div className="space-y-2" role="radiogroup" aria-label={g.chords}>
          {(Object.keys(CHORD_GROUPS) as (keyof typeof CHORD_GROUPS)[]).map((grp) => (
            <div key={grp} className="flex flex-wrap items-center gap-1.5">
              <span className="readout w-full shrink-0 sm:w-24">{g.groups[grp]}</span>
              {CHORD_GROUPS[grp].map((c) => {
                const key = keyForChord(c)
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={current === c}
                    onClick={() => playChord(c)}
                    className={`pill relative min-w-[3.1rem] justify-center font-mono ${current === c ? 'pill-solid' : ''}`}
                  >
                    {chordName(c, 0, lang)}
                    {key && <kbd className="chord-key">{keyLabel(key, lang)}</kbd>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div className="crt flex min-h-24 flex-col items-center justify-center rounded-xl px-3 py-3 text-center" aria-live="polite">
          <span className="relative z-10 font-display text-3xl leading-none">{current ? chordName(current, 0, lang) : '?'}</span>
          <span className="relative z-10 mt-2 font-mono text-xs">
            {!current ? g.custom : capo ? g.soundsAs(chordName(current, capo, lang)) : `${g.capo} 0`}
          </span>
        </div>
      </div>

      {/* hmatník */}
      <div
        className="mt-5 select-none rounded-xl border border-line bg-bg px-2 py-2 sm:px-3"
        style={{ touchAction: 'none' }}
        aria-label={g.strings}
        onPointerDown={(e) => {
          down.current = true
          void synth.resume()
          // dotyk implicitně zachytí pointer – pustíme ho, aby fungovalo přejíždění přes struny
          try { (e.target as HTMLElement).releasePointerCapture(e.pointerId) } catch { /* nic k puštění */ }
        }}
      >
        <div className="relative">
          {/* vložky na pražcích a kapodastr pod strunami */}
          <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: ROW }} aria-hidden>
            {Array.from({ length: FRET_COUNT + 3 }, (_, col) => {
              const fret = col - 1
              return (
                <span key={col} className={`relative ${fret >= 1 && fret < capo ? 'bg-line/25' : ''}`}>
                  {INLAYS.includes(fret) && <i className="inlay top-1/2" />}
                  {fret === 12 && <><i className="inlay top-[30%]" /><i className="inlay top-[70%]" /></>}
                  {capo > 0 && fret === capo && <i className="capo-bar" />}
                </span>
              )
            })}
          </div>
          {STRING_NAMES.map((name, i) => {
            const rel = shape[i]
            const muted = rel === null
            const actual = muted ? -1 : rel + capo
            return (
              <div key={i} className="relative grid h-8 sm:h-9" style={{ gridTemplateColumns: ROW }} onPointerEnter={() => { if (down.current) pluck(i, shapeRef.current) }}>
                <button type="button" onClick={() => toggleMute(i)} className={`readout relative z-10 text-left hover:text-accent ${muted ? 'opacity-40' : ''}`} aria-label={g.mute(name)}>{name}</button>
                {/* struna přes celý hmatník */}
                <span
                  className={`pointer-events-none absolute left-[1.5rem] right-[1.75rem] top-1/2 block -translate-y-1/2 rounded-full transition-colors ${muted ? 'bg-line' : 'bg-ink'} ${vibrating.includes(i) ? 'guitar-vibrate' : ''}`}
                  style={{ height: 1 + (5 - i) * 0.5 }}
                />
                {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => (
                  <button
                    key={fret}
                    type="button"
                    tabIndex={-1}
                    onPointerDown={() => press(i, fret)}
                    className={`relative z-10 flex items-center justify-center ${fret === 1 ? 'border-l-[3px] border-line' : fret > 1 ? 'border-l border-line' : ''}`}
                    aria-label={g.fret(name, fret)}
                  >
                    {fret === 0 && (muted ? <span className="font-mono text-xs text-ink-2">×</span> : actual === capo && <span className="h-2.5 w-2.5 rounded-full border border-ink-2" />)}
                    {fret > 0 && actual === fret && rel !== 0 && <span className="finger" />}
                  </button>
                ))}
                <span className="readout relative z-10 self-center text-right">{muted ? '' : noteName(i, actual, lang)}</span>
              </div>
            )
          })}
        </div>
        <div className="grid" style={{ gridTemplateColumns: ROW }} aria-hidden>
          {Array.from({ length: FRET_COUNT + 3 }, (_, col) => (
            <span key={col} className="readout text-center text-[10px]">{[...INLAYS, 12].includes(col - 1) ? col - 1 : ''}</span>
          ))}
        </div>
      </div>

      {/* brnkání, kapodastr, zvuk */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex gap-2">
          <button type="button" className="pill pill-solid" onClick={() => strum('down')}>{g.strumDown}</button>
          <button type="button" className="pill" onClick={() => strum('up')}>{g.strumUp}</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="readout">{g.capo}</span>
          <button type="button" className="pill px-3 font-mono" onClick={() => setCapo(capo - 1)} disabled={capo === 0} aria-label={`${g.capo} −`}>−</button>
          <span className="w-4 text-center font-mono" aria-live="polite">{capo}</span>
          <button type="button" className="pill px-3 font-mono" onClick={() => setCapo(capo + 1)} disabled={capo === MAX_CAPO} aria-label={`${g.capo} +`}>+</button>
        </div>
        <div className="flex items-center gap-2" role="radiogroup" aria-label={g.tone}>
          <span className="readout">{g.tone}</span>
          {TONES.map((v) => (
            <button key={v} type="button" role="radio" aria-checked={tone === v} onClick={() => setTone(v)} className={`pill font-mono ${tone === v ? 'pill-solid' : ''}`}>{g.tones[v]}</button>
          ))}
        </div>
      </div>

      {/* doprovod */}
      <div className="mt-5 rounded-xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="readout text-ink">{g.accomp}</h4>
          <button type="button" className={`pill ${playing ? '' : 'pill-solid'}`} onClick={() => (playing ? stop() : void start())}>
            {playing ? <><span className="inline-block h-2.5 w-2.5 bg-current" />{g.stop}</> : <><Play width={14} height={14} />{g.start}</>}
          </button>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="readout mb-2">{g.progression}</p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={g.progression}>
              {(Object.keys(PROGRESSIONS) as ProgressionId[]).map((id) => (
                <button key={id} type="button" role="radio" aria-checked={progression === id} onClick={() => { pos.current = { bar: 0, step: 0 }; setProgression(id) }} className={`pill text-xs ${progression === id ? 'pill-solid' : ''}`}>{g.progressions[id]}</button>
              ))}
            </div>
            <p className="mt-2 flex flex-wrap gap-1 font-mono text-xs">
              {progChords.map((c, k) => (
                <span key={k} className={`rounded px-1.5 py-0.5 ${beat && beat.bar % progChords.length === k ? 'bg-accent text-accent-ink' : 'text-ink-2'}`}>{chordName(c, 0, lang)}</span>
              ))}
            </p>
          </div>
          <div>
            <p className="readout mb-2">{g.rhythm}</p>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={g.rhythm}>
              {(Object.keys(PATTERNS) as PatternId[]).map((id) => (
                <button key={id} type="button" role="radio" aria-checked={pattern === id} onClick={() => { pos.current = { ...pos.current, step: 0 }; setPattern(id) }} className={`pill text-xs ${pattern === id ? 'pill-solid' : ''}`}>{g.patterns[id]}</button>
              ))}
            </div>
            <p className="mt-2 flex gap-1 font-mono text-xs" aria-hidden>
              {[...PATTERNS[pattern]].map((sym, k) => (
                <span key={k} className={`grid h-6 w-6 place-items-center rounded border border-line ${beat?.step === k ? 'border-accent bg-accent text-accent-ink' : 'text-ink-2'}`}>{SYMBOL[sym] ?? sym}</span>
              ))}
            </p>
          </div>
        </div>
        <label className="mt-4 flex flex-wrap items-center gap-3">
          <span className="readout">{g.tempo}</span>
          <input type="range" min={60} max={180} step={2} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-44 accent-[var(--accent)]" />
          <span className="w-16 font-mono text-sm">{bpm} BPM</span>
        </label>
      </div>

      {/* nápověda ke klávesnici (na dotykových zařízeních skrytá) */}
      <p className="keys-help readout mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="text-ink">{g.keysTitle}:</span>
        {g.keys.map(([k, v]) => <span key={k}><kbd className="kbd">{k}</kbd> {v}</span>)}
      </p>
    </div>
  )
}
