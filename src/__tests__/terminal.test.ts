import { describe, expect, it } from 'vitest'
import { content } from '../data/content'
import { complete, run, type Ctx } from '../lib/terminal'

const ctx: Ctx = { t: content.cs, theme: 'dark', lang: 'cs', history: ['help', 'ls'] }

describe('terminál', () => {
  it('help vypíše příkazy', () => {
    expect(run('help', ctx).out[0]).toContain('whoami')
  })
  it('neznámý příkaz vrátí chybu', () => {
    expect(run('foo', ctx).out[0]).toMatch(/nenalezen/)
  })
  it('ls skryje tečkové soubory, ls -a je ukáže', () => {
    expect(run('ls', ctx).out[0]).not.toContain('.secret')
    expect(run('ls -a', ctx).out[0]).toContain('.secret')
  })
  it('cat cv.txt vrátí profil', () => {
    expect(run('cat cv.txt', ctx).out[0]).toContain(content.cs.about.lead)
  })
  it('open campmaster otevře živou ukázku', () => {
    const r = run('open campmaster', ctx)
    expect(r.effects).toContainEqual({ open: 'https://campmaster-3000.vercel.app' })
  })
  it('theme a lang vrátí efekty', () => {
    expect(run('theme', ctx).effects).toContain('theme')
    expect(run('lang', ctx).effects).toContain('lang')
  })
  it('history vypíše historii', () => {
    expect(run('history', ctx).out[0]).toContain('help')
  })
  it('tab doplní příkaz i soubor', () => {
    expect(complete('neo', content.cs)).toEqual(['neofetch'])
    expect(complete('cat cv', content.cs)).toEqual(['cat cv.txt'])
  })
  it('funguje i v angličtině', () => {
    expect(run('help', { ...ctx, t: content.en, lang: 'en' }).out[0]).toContain('Commands')
  })
})
