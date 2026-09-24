/**
 * Hudební logika kytary (bez Reactu a zvuku): akordy, transpozice kapodastrem, názvy tónů,
 * průběhy akordů a rytmické vzorce doprovodu. Struny jsou indexované od hluboké E (0) po vysokou E (5).
 */
import type { Lang } from '../data/content'

/** pražec na každé struně (od hluboké E), null = struna se nehraje */
export type Shape = (number | null)[]

export const STRING_NAMES = ['E', 'A', 'D', 'G', 'H', 'E']
/** půltón prázdných strun (C = 0) */
const OPEN_SEMITONE = [4, 9, 2, 7, 11, 4]

export const CHORDS: Record<string, Shape> = {
  C: [null, 3, 2, 0, 1, 0],
  D: [null, null, 0, 2, 3, 2],
  E: [0, 2, 2, 1, 0, 0],
  F: [1, 3, 3, 2, 1, 1],
  G: [3, 2, 0, 0, 0, 3],
  A: [null, 0, 2, 2, 2, 0],
  Am: [null, 0, 2, 2, 1, 0],
  Hm: [null, 2, 4, 4, 3, 2],
  Dm: [null, null, 0, 2, 3, 1],
  Em: [0, 2, 2, 0, 0, 0],
  A7: [null, 0, 2, 0, 2, 0],
  C7: [null, 3, 2, 3, 1, 0],
  D7: [null, null, 0, 2, 1, 2],
  E7: [0, 2, 0, 1, 0, 0],
  G7: [3, 2, 0, 0, 0, 1],
  H7: [null, 2, 1, 2, 0, 2],
}

export const CHORD_GROUPS = {
  major: ['C', 'D', 'E', 'F', 'G', 'A'],
  minor: ['Am', 'Hm', 'Dm', 'Em'],
  seventh: ['A7', 'C7', 'D7', 'E7', 'G7', 'H7'],
} as const
export const CHORD_ORDER: string[] = Object.values(CHORD_GROUPS).flat()

/** česky H = anglické B, české B = anglické B♭ (A#) */
const NAMES: Record<Lang, string[]> = {
  cs: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B', 'H'],
  en: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
}
const ROOT = /^([A-H]#?)(.*)$/

/** název akordu (zapsaný česky, např. "H7") posunutý o půltóny, v daném jazyce */
export function chordName(name: string, semitones: number, lang: Lang) {
  const m = ROOT.exec(name)
  if (!m) return name
  const i = NAMES.cs.indexOf(m[1])
  if (i < 0) return name
  return NAMES[lang][(((i + semitones) % 12) + 12) % 12] + m[2]
}

/** tón na struně a pražci (už včetně kapodastru) */
export function noteName(string: number, fret: number, lang: Lang) {
  return NAMES[lang][(OPEN_SEMITONE[string] + fret) % 12]
}

/** který akord odpovídá hmatu, jinak null (vlastní hmat) */
export function matchChord(shape: Shape) {
  return CHORD_ORDER.find((c) => CHORDS[c].every((f, i) => f === shape[i])) ?? null
}

/** průběhy akordů pro doprovod, jeden akord na takt; 'current' = jen aktuální hmat */
export const PROGRESSIONS = {
  camp: ['G', 'D', 'Em', 'C'],
  pop: ['Am', 'F', 'C', 'G'],
  folk: ['Em', 'C', 'G', 'D'],
  blues: ['E7', 'E7', 'E7', 'E7', 'A7', 'A7', 'E7', 'E7', 'H7', 'A7', 'E7', 'H7'],
  current: [],
} as const satisfies Record<string, readonly string[]>
export type ProgressionId = keyof typeof PROGRESSIONS

/**
 * Rytmické vzorce po osminách (jeden znak = jedna osmina taktu):
 *   D úhoz dolů, U úhoz nahoru, - pauza, B basa (nejhlubší hraná struna),
 *   A střídavá basa (druhá nejhlubší), 1–6 jedna struna (1 = vysoká E, 6 = hluboká E).
 */
export const PATTERNS = {
  camp: 'D-DU-UDU',
  eighths: 'DUDUDUDU',
  waltz: 'B-D-D-',
  picking: 'B321A321',
} as const
export type PatternId = keyof typeof PATTERNS

export type Stroke =
  | { kind: 'rest' }
  | { kind: 'down' | 'up' }
  | { kind: 'string'; string: number }

/** co zahrát na jednom kroku vzorce s daným hmatem */
export function stroke(symbol: string, shape: Shape): Stroke {
  const played = shape.map((f, i) => (f === null ? -1 : i)).filter((i) => i >= 0)
  if (symbol === 'D') return { kind: 'down' }
  if (symbol === 'U') return { kind: 'up' }
  if (symbol === 'B' && played.length) return { kind: 'string', string: played[0] }
  if (symbol === 'A' && played.length) return { kind: 'string', string: played[Math.min(1, played.length - 1)] }
  const n = Number(symbol)
  if (n >= 1 && n <= 6 && shape[6 - n] !== null) return { kind: 'string', string: 6 - n }
  return { kind: 'rest' }
}

/** struny pro úhoz: dolů všechny hrané od basů, nahoru jen horní čtyři od vysoké E */
export function strumStrings(shape: Shape, dir: 'down' | 'up') {
  const played = shape.map((f, i) => (f === null ? -1 : i)).filter((i) => i >= 0)
  return dir === 'down' ? played : played.filter((i) => i >= 2).reverse()
}

/**
 * Klávesy podle fyzické polohy (KeyboardEvent.code), takže sedí na české i anglické klávesnici:
 * horní řada dur, prostřední moll, spodní septakordy. Stisk akord přepne a zahraje.
 */
export const CHORD_KEYS: Record<string, string> = {
  KeyQ: 'C', KeyW: 'D', KeyE: 'E', KeyR: 'F', KeyT: 'G', KeyY: 'A',
  KeyA: 'Am', KeyS: 'Hm', KeyD: 'Dm', KeyF: 'Em',
  KeyZ: 'A7', KeyX: 'C7', KeyC: 'D7', KeyV: 'E7', KeyB: 'G7', KeyN: 'H7',
}
/** Digit1–Digit6 = struny od hluboké E */
export const STRING_KEYS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6']

export const keyForChord = (name: string) => Object.keys(CHORD_KEYS).find((k) => CHORD_KEYS[k] === name)

/** popisek klávesy; na české klávesnici (QWERTZ) jsou Y a Z prohozené */
export function keyLabel(code: string, lang: Lang) {
  const c = code.replace(/^Key|^Digit/, '')
  if (lang === 'cs' && c === 'Y') return 'Z'
  if (lang === 'cs' && c === 'Z') return 'Y'
  return c
}

/* ---------- vlastní doprovod ---------- */

/** krok vlastního rytmu se kliknutím přepíná v tomto pořadí (1–3 = horní struny) */
export const STEP_CYCLE = ['-', 'D', 'U', 'B', 'A', '3', '2', '1'] as const
export const nextStep = (sym: string) => STEP_CYCLE[(STEP_CYCLE.indexOf(sym as (typeof STEP_CYCLE)[number]) + 1) % STEP_CYCLE.length]
/** takt 4/4 = 8 osmin, 3/4 = 6 */
export const METERS = [8, 6] as const
export const MAX_BARS = 16
/** změna taktu: vzorec se zkrátí, nebo doplní pauzami */
export const resizePattern = (p: string, len: number) => (p + '-'.repeat(len)).slice(0, len)

export type CustomAccomp = { prog: string[]; rhythm: string }
export const DEFAULT_CUSTOM: CustomAccomp = { prog: ['C', 'G', 'Am', 'F'], rhythm: PATTERNS.camp }

/** uložené nastavení z prohlížeče: neznámé akordy a znaky zahodí, jinak výchozí */
export function sanitizeCustom(raw: unknown): CustomAccomp {
  const r = (raw ?? {}) as Partial<CustomAccomp>
  const prog = Array.isArray(r.prog) ? r.prog.filter((c): c is string => typeof c === 'string' && c in CHORDS).slice(0, MAX_BARS) : []
  const okRhythm = typeof r.rhythm === 'string' && (METERS as readonly number[]).includes(r.rhythm.length) && [...r.rhythm].every((c) => (STEP_CYCLE as readonly string[]).includes(c))
  return { prog: prog.length ? prog : [...DEFAULT_CUSTOM.prog], rhythm: okRhythm ? (r.rhythm as string) : DEFAULT_CUSTOM.rhythm }
}
