import { useEffect, useRef, useState } from 'react'
import type { PortalRequest } from '../lib/portal'

/**
 * Dveře světla, skutečně ve 3D (CSS preserve-3d):
 *  1. stránka ztmavne, z místa kliknutí přiletí archivní dveře s hlubokým rámem,
 *  2. obě křídla se otevřou k vám, za nimi je tunel světla (prstence letí proti vám),
 *  3. kamera projede dveřmi do světla; v nejsvětlejší chvíli se stránka přesune na cíl,
 *  4. světlo i tma se rozplynou a cílová sekce se objeví ("východ z portálu").
 * Barva je záměrně oranžová bez ohledu na téma: portál je vždy stejný.
 * prefers-reduced-motion = jen skok bez animace. Časování je v index.css (--portal-t).
 */
const DURATION = 2100
/** okamžik skoku: obrazovku v tu chvíli zakrývá záblesk */
const JUMP_AT = 1450
const RINGS = 7

type Run = { id: number; x: number; y: number; label?: string }

export function Portal() {
  const [run, setRun] = useState<Run | null>(null)
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
      const { target, x, y, label } = (e as CustomEvent<PortalRequest>).detail
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) { jump(target); return }
      clear()
      setRun({ id: Date.now(), x: x ?? innerWidth / 2, y: y ?? innerHeight / 2, label })
      timers.current.push(
        window.setTimeout(() => jump(target), JUMP_AT),
        window.setTimeout(() => setRun(null), DURATION),
      )
    }
    window.addEventListener('portal:go', onGo)
    return () => { window.removeEventListener('portal:go', onGo); clear() }
  }, [])

  if (!run) return null

  return (
    <div
      key={run.id}
      className="portal"
      aria-hidden
      style={{ '--ox': `${run.x}px`, '--oy': `${run.y}px`, '--portal-t': `${DURATION}ms` } as React.CSSProperties}
    >
      {/* stránka za portálem ztmavne a zase se rozsvítí */}
      <div className="portal-dim" />
      <div className="portal-stage">
        <div className="portal-rig">
          <div className="portal-door">
            {/* světlo na podlaze před dveřmi */}
            <span className="portal-floor" />
            {/* záře za rámem */}
            <span className="portal-halo" />
            {/* tunel za dveřmi: vlastní perspektiva, oříznutý na otvor, takže se sbíhá jen uvnitř */}
            <span className="portal-tunnel">
              <span className="portal-core" />
              {Array.from({ length: RINGS }, (_, k) => <span key={k} className="portal-ring" style={{ '--k': k } as React.CSSProperties} />)}
            </span>
            {/* křídla dveří: líc se štítkem a klikou, rub nasvícený zevnitř */}
            <span className="portal-leaf portal-leaf-l">
              <span className="leaf-face leaf-front"><span className="portal-plate">ARCHIV</span></span>
              <span className="leaf-face leaf-back" />
            </span>
            <span className="portal-leaf portal-leaf-r">
              <span className="leaf-face leaf-front"><span className="portal-plate">{run.label ?? 'SPIS'}</span></span>
              <span className="leaf-face leaf-back" />
            </span>
            {/* rám s hloubkou: čelo, vnitřní špalety a vnější boky */}
            <span className="pf pf-front" />
            <span className="pf pf-back" />
            <span className="pf pf-in pf-in-l" />
            <span className="pf pf-in pf-in-r" />
            <span className="pf pf-in pf-in-t" />
            <span className="pf pf-in pf-in-b" />
            <span className="pf pf-out pf-out-l" />
            <span className="pf pf-out pf-out-r" />
            <span className="pf pf-out pf-out-t" />
          </div>
        </div>
      </div>
      {/* záblesk při průchodu */}
      <div className="portal-flash" />
    </div>
  )
}
