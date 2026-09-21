/** Sbírka razítek: co návštěvník na webu objevil. Ukládá se do localStorage. */
export const STAMP_IDS = ['terminal', 'variant', 'guitar', 'pexeso', 'monitor', 'konami', 'tour', 'theme'] as const
export type StampId = (typeof STAMP_IDS)[number]

const KEY = 'stamps'

export function loadStamps(): StampId[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((s): s is StampId => (STAMP_IDS as readonly string[]).includes(s)) : []
  } catch { return [] }
}

export function saveStamps(list: StampId[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

/** Odkudkoli: earnStamp('guitar'). App poslouchá a vyhodnotí, jestli je nové. */
export function earnStamp(id: StampId) {
  window.dispatchEvent(new CustomEvent<StampId>('stamp:earn', { detail: id }))
}
