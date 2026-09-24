import { describe, expect, it } from 'vitest'
import { GAMES, byHours, epicOnly } from '../data/games'

describe('herní knihovna', () => {
  it('řadí hry se Steamu od nejhranější a hry jen z Epicu drží zvlášť', () => {
    const played = byHours(GAMES)
    expect(played[0].name).toBe('Marvel Snap')
    expect(played.every((g, i) => i === 0 || played[i - 1].hours >= g.hours)).toBe(true)
    expect(played.length + epicOnly(GAMES).length).toBe(GAMES.length)
    expect(epicOnly(GAMES).every((g) => g.epic)).toBe(true)
  })
  it('názvy jsou jedinečné (slouží jako klíče v seznamu)', () => {
    expect(new Set(GAMES.map((g) => g.name)).size).toBe(GAMES.length)
  })
})
