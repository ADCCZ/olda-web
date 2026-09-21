import { describe, expect, it } from 'vitest'
import { flip, hideMismatch, newGame, TECH_PAIRS } from '../lib/pexeso'

describe('pexeso', () => {
  it('rozdá 16 karet, každou technologii dvakrát', () => {
    const g = newGame(42)
    expect(g.cards).toHaveLength(TECH_PAIRS.length * 2)
    for (const p of TECH_PAIRS) expect(g.cards.filter((c) => c.key === p.key)).toHaveLength(2)
  })

  it('je deterministické se stejným seedem', () => {
    expect(newGame(7).cards.map((c) => c.key)).toEqual(newGame(7).cards.map((c) => c.key))
    expect(newGame(7).cards.map((c) => c.key)).not.toEqual(newGame(8).cards.map((c) => c.key))
  })

  it('spáruje dvě stejné karty a spočítá tah', () => {
    const g = newGame(1)
    const [a, b] = g.cards.filter((c) => c.key === g.cards[0].key)
    const s1 = flip(g, a.id).game
    const { game: s2, mismatch } = flip(s1, b.id)
    expect(mismatch).toBe(false)
    expect(s2.moves).toBe(1)
    expect(s2.cards.filter((c) => c.matched)).toHaveLength(2)
    expect(s2.open).toEqual([])
  })

  it('nesedící pár se po hideMismatch zavře', () => {
    const g = newGame(1)
    const a = g.cards[0]
    const b = g.cards.find((c) => c.key !== a.key)!
    const { game: s, mismatch } = flip(flip(g, a.id).game, b.id)
    expect(mismatch).toBe(true)
    expect(s.open).toHaveLength(2)
    const hidden = hideMismatch(s)
    expect(hidden.cards.every((c) => !c.flipped)).toBe(true)
    expect(hidden.moves).toBe(1)
  })

  it('výhra po spárování všech', () => {
    let g = newGame(3)
    for (const p of TECH_PAIRS) {
      const [a, b] = g.cards.filter((c) => c.key === p.key)
      g = flip(flip(g, a.id).game, b.id).game
    }
    expect(g.won).toBe(true)
    expect(g.moves).toBe(TECH_PAIRS.length)
  })
})
