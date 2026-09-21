import { describe, expect, it } from 'vitest'
import { content } from '../data/content'
import { run } from '../lib/terminal'

describe('průvodkyně', () => {
  it('má komentář ke každé sekci v obou jazycích', () => {
    for (const lang of ['cs', 'en'] as const) {
      const g = content[lang].guide
      for (const id of ['about', 'education', 'experience', 'projects', 'skills', 'leadership', 'contact'] as const) {
        expect(g.sections[id].length).toBeGreaterThan(10)
      }
      expect(g.tour.length).toBe(8)
      expect(g.tour.every((s) => s.target.startsWith('#'))).toBe(true)
    }
  })
  it('příkaz guide vrátí efekt', () => {
    expect(run('guide', { t: content.cs, theme: 'dark', lang: 'cs', history: [] }).effects).toContain('guide')
  })
})
