import { describe, expect, it } from 'vitest'
import { GAMES, byHours, withoutHours, type Game } from '../data/games'

describe('herní knihovna', () => {
  it('řadí hry s časem od nejhranější a hry bez času drží zvlášť', () => {
    const played = byHours(GAMES)
    expect(played[0].hours).toBe(Math.max(...played.map((g) => g.hours)))
    expect(played.every((g, i) => i === 0 || played[i - 1].hours >= g.hours)).toBe(true)
    expect(played.length + withoutHours(GAMES).length).toBe(GAMES.length)
    // bez času jsou jen hry z Epicu a odjinud (Steam čas vždycky má)
    expect(withoutHours(GAMES).every((g) => g.store === 'epic' || g.store === 'other')).toBe(true)
  })
  it('hra z Epicu s doplněnými hodinami se zařadí mezi hry s časem', () => {
    const games: Game[] = [{ name: 'A', hours: 10 }, { name: 'B', store: 'epic', hours: 50 }, { name: 'C', store: 'epic' }]
    expect(byHours(games).map((g) => g.name)).toEqual(['B', 'A'])
    expect(withoutHours(games).map((g) => g.name)).toEqual(['C'])
  })
  it('názvy jsou jedinečné (slouží jako klíče v seznamu)', () => {
    expect(new Set(GAMES.map((g) => g.name)).size).toBe(GAMES.length)
  })
})
