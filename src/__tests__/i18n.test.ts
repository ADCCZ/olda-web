import { describe, expect, it } from 'vitest'
import { content } from '../data/content'

/** anglická verze musí strukturou odpovídat české: když se upraví jen čeština, test to chytí */
describe('čeština a angličtina ve shodě', () => {
  const { cs, en } = content
  it('technologie: stejné skupiny, pořadí i úrovně', () => {
    expect(en.skills.groups.map((g) => g.items.map((x) => x.level))).toEqual(cs.skills.groups.map((g) => g.items.map((x) => x.level)))
    expect(en.skills.planned.length).toBe(cs.skills.planned.length)
  })
  // štítky se smí překládat (Otevřená data / Open data), hlídá se jen jejich počet
  it('projekty: stejné repozitáře ve stejném pořadí a stejný počet štítků', () => {
    expect(en.projects.items.map((p) => [p.repo, p.privateRepo, p.live, p.tags.length])).toEqual(cs.projects.items.map((p) => [p.repo, p.privateRepo, p.live, p.tags.length]))
  })
  it('profil a zájmy: stejný počet odstavců a položek, stejné odkazy a akce', () => {
    expect(en.about.body.length).toBe(cs.about.body.length)
    expect(en.about.interests.map((i) => [i.icon, i.href, i.action])).toEqual(cs.about.interests.map((i) => [i.icon, i.href, i.action]))
    expect(en.leadership.items.length).toBe(cs.leadership.items.length)
  })
})
