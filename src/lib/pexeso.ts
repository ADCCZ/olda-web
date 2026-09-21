/** Čistá herní logika Pexesa – bez Reactu, aby šla testovat. */

export type Card = { id: number; key: string; label: string; flipped: boolean; matched: boolean }
export type Game = { cards: Card[]; moves: number; open: number[]; won: boolean; startedAt: number | null; finishedAt: number | null }

export const TECH_PAIRS: { key: string; label: string }[] = [
  { key: 'react', label: 'React' },
  { key: 'nette', label: 'Nette' },
  { key: 'c', label: 'C' },
  { key: 'csharp', label: 'C#' },
  { key: 'java', label: 'Java' },
  { key: 'python', label: 'Py' },
  { key: 'mysql', label: 'SQL' },
  { key: 'docker', label: 'Docker' },
]

/** deterministický generátor (seed) – ať jde hra otestovat */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let x = Math.imul(s ^ (s >>> 15), 1 | s)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

export function newGame(seed = Date.now()): Game {
  const rand = rng(seed)
  const deck = TECH_PAIRS.flatMap((p) => [p, p]).map((p, i) => ({ ...p, id: i, flipped: false, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return { cards: deck, moves: 0, open: [], won: false, startedAt: null, finishedAt: null }
}

/** Otočí kartu. Vrátí nový stav a informaci, jestli se má po chvíli zavolat `hideMismatch`. */
export function flip(game: Game, id: number, now = Date.now()): { game: Game; mismatch: boolean } {
  const card = game.cards.find((c) => c.id === id)
  if (!card || card.flipped || card.matched || game.open.length >= 2 || game.won) return { game, mismatch: false }

  const cards = game.cards.map((c) => (c.id === id ? { ...c, flipped: true } : c))
  const open = [...game.open, id]
  const startedAt = game.startedAt ?? now
  if (open.length < 2) return { game: { ...game, cards, open, startedAt }, mismatch: false }

  const [a, b] = open.map((i) => cards.find((c) => c.id === i)!)
  const moves = game.moves + 1
  if (a.key === b.key) {
    const matched = cards.map((c) => (c.key === a.key ? { ...c, matched: true } : c))
    const won = matched.every((c) => c.matched)
    return { game: { ...game, cards: matched, open: [], moves, won, startedAt, finishedAt: won ? now : null }, mismatch: false }
  }
  return { game: { ...game, cards, open, moves, startedAt }, mismatch: true }
}

/** Zavře dvě nesedící otočené karty. */
export function hideMismatch(game: Game): Game {
  if (game.open.length < 2) return game
  const set = new Set(game.open)
  return { ...game, cards: game.cards.map((c) => (set.has(c.id) ? { ...c, flipped: false } : c)), open: [] }
}
