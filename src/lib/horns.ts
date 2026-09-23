/** Lokiho rohy schované v sudých sekcích (úvod = 1.): které už návštěvník našel (localStorage). */
export const HORN_SECTIONS = ['about', 'experience', 'skills', 'contact'] as const

const KEY = 'horns'

export function loadHorns(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((s) => (HORN_SECTIONS as readonly string[]).includes(s)) : []
  } catch { return [] }
}

export function saveHorns(list: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
}
