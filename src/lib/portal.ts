/**
 * Portál: přechod na sekci "dveřmi světla".
 * Kdokoli může zavolat portalGo('#about', x, y) – Portal.tsx poslouchá a odehraje animaci,
 * uprostřed ní přeskočí na cíl a pak vyšle 'portal:arrived' (sekce se na chvíli rozsvítí).
 */
export type PortalRequest = { target: string; x?: number; y?: number; label?: string }

export function portalGo(target: string, x?: number, y?: number, label?: string) {
  window.dispatchEvent(new CustomEvent<PortalRequest>('portal:go', { detail: { target, x, y, label } }))
}

/** ze kliknutí na odkaz udělá portál (pokud vede na kotvu na stránce) */
export function portalLink(e: React.MouseEvent<HTMLAnchorElement>, label?: string) {
  const href = e.currentTarget.getAttribute('href') ?? ''
  if (!href.startsWith('#') || href === '#') return
  e.preventDefault()
  portalGo(href, e.clientX, e.clientY, label)
}
