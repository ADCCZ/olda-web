import { describe, expect, it } from 'vitest'
import {
  CHORDS, CHORD_KEYS, CHORD_ORDER, DEFAULT_CUSTOM, MAX_BARS, PATTERNS, PROGRESSIONS, STEP_CYCLE, chordName, keyForChord, keyLabel,
  matchChord, nextStep, noteName, resizePattern, sanitizeCustom, stroke, strumStrings,
} from '../lib/guitar'

describe('kytara', () => {
  it('každý akord má hmat na všech šesti strunách v rozsahu hmatníku', () => {
    for (const name of CHORD_ORDER) {
      const shape = CHORDS[name]
      expect(shape).toHaveLength(6)
      for (const f of shape) {
        if (f === null) continue
        expect(f).toBeGreaterThanOrEqual(0)
        expect(f).toBeLessThanOrEqual(12)
      }
    }
  })

  it('průběhy doprovodu používají jen známé akordy', () => {
    for (const prog of Object.values(PROGRESSIONS)) for (const c of prog) expect(CHORDS[c]).toBeDefined()
  })

  it('každý akord má svou klávesu a klávesy se neopakují', () => {
    for (const name of CHORD_ORDER) expect(keyForChord(name)).toBeDefined()
    expect(new Set(Object.values(CHORD_KEYS)).size).toBe(Object.keys(CHORD_KEYS).length)
  })

  it('transponuje název akordu kapodastrem a píše H/B podle jazyka', () => {
    expect(chordName('G', 2, 'cs')).toBe('A')
    expect(chordName('Em', 3, 'cs')).toBe('Gm')
    expect(chordName('A7', 2, 'cs')).toBe('H7')
    expect(chordName('A7', 2, 'en')).toBe('B7')
    expect(chordName('Hm', 0, 'en')).toBe('Bm')
    expect(chordName('H7', 1, 'cs')).toBe('C7')
  })

  it('pojmenuje tón na struně i s pražcem', () => {
    expect(noteName(0, 0, 'cs')).toBe('E')
    expect(noteName(4, 0, 'cs')).toBe('H')
    expect(noteName(4, 0, 'en')).toBe('B')
    expect(noteName(1, 3, 'cs')).toBe('C')
    expect(noteName(5, 12, 'cs')).toBe('E')
  })

  it('pozná akord podle hmatu, vlastní hmat vrátí null', () => {
    expect(matchChord([...CHORDS.G])).toBe('G')
    expect(matchChord([0, 0, 0, 0, 0, 0])).toBeNull()
  })

  it('rytmické vzorce mají osminy celého taktu', () => {
    for (const p of Object.values(PATTERNS)) expect([6, 8]).toContain(p.length)
  })

  it('úhozy a basy respektují ztlumené struny', () => {
    const C = CHORDS.C // hluboká E se nehraje
    expect(stroke('B', C)).toEqual({ kind: 'string', string: 1 })
    expect(stroke('A', C)).toEqual({ kind: 'string', string: 2 })
    expect(stroke('6', C)).toEqual({ kind: 'rest' })
    expect(stroke('1', C)).toEqual({ kind: 'string', string: 5 })
    expect(stroke('-', C)).toEqual({ kind: 'rest' })
    expect(strumStrings(C, 'down')).toEqual([1, 2, 3, 4, 5])
    expect(strumStrings(C, 'up')).toEqual([5, 4, 3, 2])
  })

  it('popisky kláves sedí na českou klávesnici', () => {
    expect(keyLabel('KeyY', 'cs')).toBe('Z')
    expect(keyLabel('KeyZ', 'cs')).toBe('Y')
    expect(keyLabel('KeyY', 'en')).toBe('Y')
    expect(keyLabel('Digit3', 'cs')).toBe('3')
  })

  it('vlastní rytmus: krok se přepíná dokola a takt mění délku', () => {
    expect(nextStep('-')).toBe('D')
    expect(nextStep('1')).toBe('-')
    for (const sym of STEP_CYCLE) expect(STEP_CYCLE).toContain(nextStep(sym))
    expect(resizePattern('D-DU-UDU', 6)).toBe('D-DU-U')
    expect(resizePattern('B-D-D-', 8)).toBe('B-D-D---')
  })

  it('uložené vlastní nastavení se očistí, poškozené nahradí výchozím', () => {
    expect(sanitizeCustom(null)).toEqual(DEFAULT_CUSTOM)
    expect(sanitizeCustom({ prog: ['G', 'Xm', 'D'], rhythm: 'B-D-D-' })).toEqual({ prog: ['G', 'D'], rhythm: 'B-D-D-' })
    expect(sanitizeCustom({ prog: [], rhythm: 'DDDDD' })).toEqual(DEFAULT_CUSTOM)
    expect(sanitizeCustom({ prog: Array(30).fill('C'), rhythm: 'D-DU-UDX' }).prog).toHaveLength(MAX_BARS)
    for (const c of DEFAULT_CUSTOM.prog) expect(CHORDS[c]).toBeDefined()
  })
})
