/**
 * Herní knihovna pro rozbalovací seznam u „Videohry“ v Profilu, stav k datu UPDATED.
 * Na webu je jen pořadí, hodiny slouží k řazení a nezobrazují se. U Steamu jsou
 * z knihovny (Celkem odehráno). Hře z Epicu stačí doplnit `hours` a sama se zařadí
 * do pořadí; bez `hours` zůstane dole mezi hrami mimo pořadí (stejně hry odjinud).
 * Názvy jsou originální, `cs` = český název, pokud ho hra má. Pořadí nehraje roli,
 * seznam se řadí podle hodin.
 */
export type Game = {
  name: string
  cs?: string
  hours?: number
  /** kde hru mám: chybí = Steam, 'epic' = jen Epic, 'both' = Steam i Epic (hodiny ze Steamu), 'other' = jinde */
  store?: 'epic' | 'both' | 'other'
}

/** kdy byl seznam sepsaný (RRRR-MM-DD); při úpravě hodin přepiš */
export const UPDATED = '2026-09-24'

export const GAMES: Game[] = [
  // Steam
  { name: 'Marvel Snap', hours: 277 },
  { name: 'The Finals', hours: 228.5 },
  { name: 'Counter-Strike 2', hours: 129.6 },
  { name: 'Paladins', hours: 109.5 },
  { name: 'The Witcher 3: Wild Hunt', cs: 'Zaklínač 3: Divoký hon', hours: 79.9 },
  { name: 'The Witcher', cs: 'Zaklínač', hours: 76.5 },
  { name: 'Marvel Rivals', hours: 70.7 },
  { name: 'Star Wars Jedi: Survivor', hours: 65.6 },
  { name: 'Undertale', hours: 47.2 },
  { name: 'Fall Guys', hours: 41.6 },
  { name: 'Overwatch', hours: 41.4 },
  { name: 'Rocket League', hours: 40.3, store: 'both' },
  { name: 'Mafia', hours: 34.8 },
  { name: 'The Last of Us Part I', hours: 28.2 },
  { name: 'Bloons TD Battles', hours: 27.1 },
  { name: 'Rise of the Tomb Raider', hours: 26.2 },
  { name: 'Pummel Party', hours: 20.2 },
  { name: 'Business Tour', hours: 18.5 },
  { name: 'Detroit: Become Human', hours: 16.9 },
  { name: 'Witch It', hours: 15.6 },
  { name: 'Mafia: Definitive Edition', cs: 'Mafia: Definitivní edice', hours: 15.6 },
  { name: 'Mafia II: Definitive Edition', cs: 'Mafia II: Definitivní edice', hours: 13.5 },
  { name: 'Shakes & Fidget', hours: 13.5 },
  { name: 'Beyond: Two Souls', hours: 12.9 },
  { name: 'Tomb Raider', hours: 11.7 },
  { name: 'The Witcher 2: Assassins of Kings', cs: 'Zaklínač 2: Vrahové králů', hours: 9.7 },
  { name: 'Cyberpunk 2077', hours: 9.3 },
  { name: 'Propnight', hours: 7.4 },
  { name: 'Max Payne 2: The Fall of Max Payne', hours: 6 },
  // Epic Games (hodiny doplň jako u Steamu, např. { name: 'Fortnite', store: 'epic', hours: 120 })
  { name: 'Fortnite', store: 'epic', hours: 771.65 },
  { name: 'Among Us', store: 'epic', hours: 35.73 },
  { name: "Marvel's Spider-Man Remastered", store: 'epic', hours: 35.15 },
  { name: 'Star Wars Battlefront II', store: 'epic', hours: 23.5 },
  { name: 'Kingdom Come: Deliverance', store: 'epic', hours: 22.1 },
  { name: 'Ghostrunner', store: 'epic' },
  { name: 'Ghostrunner 2', store: 'epic' },
  { name: 'PC Building Simulator', store: 'epic' },
  { name: 'Borderlands: The Pre-Sequel', store: 'epic' },
  { name: 'A Plague Tale: Innocence', store: 'epic' },
  { name: 'Hitman', store: 'epic' },
  { name: 'Just Cause 4', store: 'epic' },
  // jinde než na Steamu a Epicu
  { name: 'FIFA 13', store: 'other' },
  { name: 'FIFA 14', store: 'other' },
  { name: 'FIFA 18', store: 'other' },
  { name: 'FIFA 19', store: 'other' },
  { name: 'FIFA 20', store: 'other' },
]

/** hry s odehraným časem (Steam i Epic), od nejhranější */
export const byHours = (games: Game[]) =>
  games.filter((g): g is Game & { hours: number } => g.hours !== undefined).sort((a, b) => b.hours - a.hours)
/** hry bez zaznamenaného času (Epic a hry odjinud; Steam čas vždycky má) */
export const withoutHours = (games: Game[]) => games.filter((g) => g.hours === undefined)
