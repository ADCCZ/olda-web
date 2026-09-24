/**
 * Herní knihovna pro rozbalovací seznam u „Videohry“ v Profilu (stav k září 2026).
 * Hodiny jsou ze Steamu (Celkem odehráno); Epic Games odehraný čas neukazuje, proto hry
 * jen z Epicu hodiny nemají. Názvy jsou originální, `cs` = český název, pokud ho hra má.
 * Pořadí nehraje roli, seznam se řadí podle hodin.
 */
export type Game = { name: string; cs?: string; hours?: number; epic?: boolean }

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
  { name: 'Rocket League', hours: 40.3, epic: true },
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
  // jen Epic Games (bez hodin)
  { name: 'Fortnite', epic: true },
  { name: 'Among Us', epic: true },
  { name: "Marvel's Spider-Man Remastered", epic: true },
  { name: 'Star Wars Battlefront II', epic: true },
  { name: 'Kingdom Come: Deliverance', epic: true },
  { name: 'Ghostrunner', epic: true },
  { name: 'Ghostrunner 2', epic: true },
  { name: 'PC Building Simulator', epic: true },
  { name: 'Borderlands: The Pre-Sequel', epic: true },
  { name: 'A Plague Tale: Innocence', epic: true },
  { name: 'Hitman', epic: true },
  { name: 'Just Cause 4', epic: true },
]

/** hry s odehraným časem (Steam), od nejhranější */
export const byHours = (games: Game[]) =>
  games.filter((g): g is Game & { hours: number } => g.hours !== undefined).sort((a, b) => b.hours - a.hours)
/** hry jen z Epicu (bez času) */
export const epicOnly = (games: Game[]) => games.filter((g) => g.hours === undefined)
