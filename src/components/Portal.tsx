import { useEffect, useRef, useState } from 'react'
import type { PortalRequest } from '../lib/portal'

/**
 * Dveře světla. Otevřou se z místa kliknutí, zalijí obrazovku teplým světlem,
 * za nimi se stránka přesune na cíl, a dveře se zase zavřou.
 * Barva je záměrně oranžová bez ohledu na téma: portál je vždy stejný.
 * prefers-reduced-motion = jen skok bez animace.
 */
type Phase = 'idle' | 'opening' | 'closing'

export function Portal() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const timers = useRef<number[]>([])

  useEffect(() => {
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
    const jump = (target: string) => {
      const el = document.querySelector(target)
      if (!el) return
      const top = target === '#top' ? 0 : (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
      window.dispatchEvent(new CustomEvent('portal:arrived', { detail: target }))
    }
    const onGo = (e: Event) => {
      const { target, x, y } = (e as CustomEvent<PortalRequest>).detail
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) { jump(target); return }
      clear()
      setOrigin({ x: x ?? innerWidth / 2, y: y ?? innerHeight / 2 })
      setPhase('opening')
      timers.current.push(
        // cíl se objeví už za plochou dveří, teprve pak jimi projdete
        window.setTimeout(() => { jump(target); setPhase('closing') }, 760),
        window.setTimeout(() => setPhase('idle'), 1600),
      )
    }
    window.addEventListener('portal:go', onGo)
    return () => { window.removeEventListener('portal:go', onGo); clear() }
  }, [])

  if (phase === 'idle') return null

  return (
    <div className={`portal portal-${phase}`} aria-hidden style={{ '--ox': `${origin.x}px`, '--oy': `${origin.y}px` } as React.CSSProperties}>
      <div className="portal-wash" />
      <div className="portal-vignette" />
      <div className="portal-door">
        <span className="portal-side" />
        <span className="portal-surface" />
        <span className="portal-edge" />
      </div>
    </div>
  )
}
