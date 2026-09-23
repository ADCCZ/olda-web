import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react'

/**
 * Hala archivu: řady kartoték v hloubce, závěsné lampy, potrubní pošta, žebřík, hodiny.
 * Tři vrstvy se při scrollu i pohybu myši posouvají různou rychlostí (paralaxa).
 * Barvy jdou z tématu: v noci svítí lampy zeleně, ve dne jantarově.
 *
 * Výška haly je pevná (podle breakpointu), šířka se dopočítá: na širší obrazovce
 * přibudou další skříně a lampy, místo aby se celá hala zvětšovala.
 */

/** horní okraj výřezu (nad ním jsou jen šňůry lamp) */
const TOP = 24
/** podlaha: na ní skříně stojí, pod ní pokračuje deska se štítkem (v Hero) */
const FLOOR = 248
const VB_H = FLOOR + 2 - TOP

function Cabinet({ x, y, w, h, drawers }: { x: number; y: number; w: number; h: number; drawers: number }) {
  const dh = (h - 10) / drawers
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="var(--bg-3)" stroke="var(--line)" strokeWidth="1.5" />
      {Array.from({ length: drawers }, (_, i) => (
        <g key={i}>
          <rect x={x + 6} y={y + 5 + i * dh} width={w - 12} height={dh - 4} rx="1.5" fill="none" stroke="var(--line)" />
          <rect x={x + w / 2 - 8} y={y + 5 + i * dh + dh / 2 - 2} width="16" height="3" rx="1.5" fill="var(--accent)" opacity="0.8" />
          <rect x={x + 10} y={y + 5 + i * dh + 4} width={w * 0.3} height="4" rx="1" fill="var(--line)" opacity="0.7" />
        </g>
      ))}
    </g>
  )
}

function Lamp({ x, flickerDelay }: { x: number; flickerDelay: string }) {
  return (
    <g className="flicker" style={{ animationDelay: flickerDelay }}>
      <line x1={x} y1="0" x2={x} y2="46" stroke="var(--line)" strokeWidth="1.5" />
      <path d={`M${x - 26} 66 L${x - 12} 46 L${x + 12} 46 L${x + 26} 66 Z`} fill="var(--bg-3)" stroke="var(--line)" strokeWidth="1.5" />
      <circle cx={x} cy="64" r="5" fill="var(--crt-ink)" />
      <polygon points={`${x - 26},66 ${x + 26},66 ${x + 150},${FLOOR} ${x - 150},${FLOOR}`} fill="url(#cone)" />
    </g>
  )
}

/** x-ové pozice od `from` po `to` s krokem `step` */
function row(from: number, to: number, step: number) {
  return Array.from({ length: Math.max(0, Math.ceil((to - from) / step)) }, (_, i) => from + i * step)
}

export function Scene() {
  const ref = useRef<HTMLDivElement>(null)
  // šířka výřezu v jednotkách SVG; výchozí odpovídá desktopu, přepočítá se před prvním vykreslením
  const [W, setW] = useState(1440)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })
  const farY = useTransform(smooth, [0, 1], [18, -18])
  const midY = useTransform(smooth, [0, 1], [10, -10])
  const frontY = useTransform(smooth, [0, 1], [0, 6])
  const [mx, setMx] = useState(0)

  // hodiny: hodinová ručička jedna otočka za celou stránku, minutová 12x rychleji
  // (jako u skutečných hodin) - obě tak doběhnou na 12 nahoře i úplně dole.
  const { scrollYProgress: pageProgress } = useScroll()
  const pageSmooth = useSpring(pageProgress, { stiffness: 60, damping: 18 })
  const hourRotate = useTransform(pageSmooth, [0, 1], [0, 360])
  const minuteRotate = useTransform(pageSmooth, [0, 1], [0, 360 * 12])
  const hourHandRef = useRef<SVGLineElement>(null)
  const minuteHandRef = useRef<SVGLineElement>(null)

  // SVG transform atribut místo CSS rotate: motion počítá origin pro SVG jako zlomek
  // vlastního bounding boxu prvku, ne v pixelech, takže by se ručička točila kolem špatného bodu.
  useMotionValueEvent(hourRotate, 'change', (v) => {
    hourHandRef.current?.setAttribute('transform', `rotate(${v})`)
  })
  useMotionValueEvent(minuteRotate, 'change', (v) => {
    minuteHandRef.current?.setAttribute('transform', `rotate(${v})`)
  })

  // měřítko drží výška haly, šířka výřezu se přizpůsobí kontejneru
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width && height) setW(Math.round((width / height) * VB_H))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // pohyb myší: vrstvy se lehce rozjedou do stran
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setMx((e.clientX / innerWidth - 0.5) * 2))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  // rozmístění od pravého okraje, aby hodiny a nejbližší lampa seděly vždy stejně
  const far = row(-84, W + 40, 74)
  const mid = row(((W - 136) % 162) - 162, W + 40, 162)
  const lamps = row(0, W - 200, 460).map((k) => W - 260 - k)
  const stations = row(0, W, 330).map((k) => W - 60 - k)
  // žebřík opřený o skříň mezi dvěma lampami
  const target = W - 490 - (W > 1150 ? 460 : 0)
  const ladder = mid.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a)) + 24

  return (
    <div ref={ref} className="scene relative h-[112px] w-full overflow-hidden sm:h-[132px] md:h-[150px] lg:h-[172px]" aria-hidden data-orbit>
      <svg viewBox={`0 ${TOP} ${W} ${VB_H}`} preserveAspectRatio="xMaxYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--crt-ink)" stopOpacity="0.32" />
            <stop offset="1" stopColor="var(--crt-ink)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="groundshadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {/* zadní řada kartoték */}
        <motion.g style={{ y: farY, x: mx * -6 }} opacity="0.45">
          {far.map((x) => <Cabinet key={`f${x}`} x={x} y={116} w={64} h={104} drawers={4} />)}
        </motion.g>

        {/* potrubní pošta */}
        <line x1="0" y1="92" x2={W} y2="92" stroke="var(--line)" strokeWidth="6" />
        <line x1="0" y1="92" x2={W} y2="92" stroke="var(--bg-3)" strokeWidth="3" />
        {stations.map((x) => <rect key={x} x={x - 5} y="84" width="10" height="16" rx="2" fill="var(--line)" />)}
        <g style={{ offsetPath: `path('M-40 92 L${W + 40} 92')`, animation: `travel ${Math.max(6, Math.round(W / 160))}s linear 1.5s infinite` } as React.CSSProperties}>
          <rect x="-16" y="-5" width="32" height="10" rx="5" fill="var(--accent)" />
          <rect x="-12" y="-3" width="8" height="6" rx="1" fill="var(--bg)" opacity="0.5" />
        </g>

        {/* střední řada, žebřík, hodiny */}
        <motion.g style={{ y: midY, x: mx * -12 }}>
          {mid.map((x) => <Cabinet key={`m${x}`} x={x} y={94} w={138} h={142} drawers={5} />)}
          {/* žebřík */}
          <g transform={`translate(${ladder} 0)`}>
            <line x1="0" y1="40" x2="0" y2={FLOOR - 2} stroke="var(--accent)" strokeWidth="3" />
            <line x1="34" y1="40" x2="34" y2={FLOOR - 2} stroke="var(--accent)" strokeWidth="3" />
            {Array.from({ length: 9 }, (_, i) => <line key={i} x1="0" y1={56 + i * 24} x2="34" y2={56 + i * 24} stroke="var(--accent)" strokeWidth="2.5" />)}
          </g>
          {/* hodiny */}
          <g transform={`translate(${W - 150} 62)`}>
            <circle r="22" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="2" />
            {[0, 90, 180, 270].map((a) => <line key={a} x1="0" y1="-19" x2="0" y2="-15" stroke="var(--ink-2)" strokeWidth="2" transform={`rotate(${a})`} />)}
            <line ref={hourHandRef} x1="0" y1="0" x2="0" y2="-11" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
            <line ref={minuteHandRef} x1="0" y1="0" x2="0" y2="-16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
            <circle r="2" fill="var(--accent)" />
          </g>
        </motion.g>

        {/* lampy s kužely světla */}
        <motion.g style={{ y: frontY, x: mx * -18 }}>
          {lamps.map((x, i) => <Lamp key={x} x={x} flickerDelay={`${(i * 2.1) % 6.3}s`} />)}
        </motion.g>

        {/* podlaha: hrana desky, na které skříně stojí (deska sama je v Hero) */}
        <rect x="0" y={FLOOR - 14} width={W} height="14" fill="url(#groundshadow)" />
        <rect x="0" y={FLOOR} width={W} height="2" fill="var(--line)" />
      </svg>
    </div>
  )
}
