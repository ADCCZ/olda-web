import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Hala archivu: řady kartoték v hloubce, závěsné lampy, potrubní pošta, žebřík, hodiny.
 * Tři vrstvy se při scrollu i pohybu myši posouvají různou rychlostí (paralaxa).
 * Barvy jdou z tématu: v noci svítí lampy zeleně, ve dne jantarově.
 */

const W = 1440
const H = 300
const FLOOR = 248

function Cabinet({ x, y, w, h, drawers, id }: { x: number; y: number; w: number; h: number; drawers: number; id: string }) {
  const dh = (h - 10) / drawers
  return (
    <g key={id}>
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

export function Scene() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })
  const farY = useTransform(smooth, [0, 1], [18, -18])
  const midY = useTransform(smooth, [0, 1], [10, -10])
  const frontY = useTransform(smooth, [0, 1], [0, 6])
  const [mx, setMx] = useState(0)

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

  const far = Array.from({ length: 20 }, (_, i) => ({ x: i * 74 - 10, w: 64 }))
  const mid = Array.from({ length: 9 }, (_, i) => ({ x: i * 162 + 8, w: 138 }))

  return (
    <div ref={ref} className="relative h-[170px] w-full overflow-hidden md:h-[270px]" aria-hidden data-orbit>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
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
          {far.map((c, i) => <Cabinet key={`f${i}`} id={`f${i}`} x={c.x} y={116} w={c.w} h={104} drawers={4} />)}
        </motion.g>

        {/* potrubní pošta */}
        <line x1="0" y1="92" x2={W} y2="92" stroke="var(--line)" strokeWidth="6" />
        <line x1="0" y1="92" x2={W} y2="92" stroke="var(--bg-3)" strokeWidth="3" />
        {[120, 420, 760, 1100, 1380].map((x) => <rect key={x} x={x - 5} y="84" width="10" height="16" rx="2" fill="var(--line)" />)}
        <g style={{ offsetPath: `path('M-40 92 L${W + 40} 92')`, animation: 'travel 9s linear infinite', animationDelay: '1.5s' } as React.CSSProperties}>
          <rect x="-16" y="-5" width="32" height="10" rx="5" fill="var(--accent)" />
          <rect x="-12" y="-3" width="8" height="6" rx="1" fill="var(--bg)" opacity="0.5" />
        </g>

        {/* střední řada, žebřík, hodiny */}
        <motion.g style={{ y: midY, x: mx * -12 }}>
          {mid.map((c, i) => <Cabinet key={`m${i}`} id={`m${i}`} x={c.x} y={94} w={c.w} h={142} drawers={5} />)}
          {/* žebřík */}
          <g transform="translate(680 0)">
            <line x1="0" y1="40" x2="0" y2={FLOOR - 2} stroke="var(--accent)" strokeWidth="3" />
            <line x1="34" y1="40" x2="34" y2={FLOOR - 2} stroke="var(--accent)" strokeWidth="3" />
            {Array.from({ length: 9 }, (_, i) => <line key={i} x1="0" y1={56 + i * 24} x2="34" y2={56 + i * 24} stroke="var(--accent)" strokeWidth="2.5" />)}
          </g>
          {/* hodiny */}
          <g transform="translate(1290 60)">
            <circle r="22" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="2" />
            {[0, 90, 180, 270].map((a) => <line key={a} x1="0" y1="-19" x2="0" y2="-15" stroke="var(--ink-2)" strokeWidth="2" transform={`rotate(${a})`} />)}
            <line x1="0" y1="0" x2="0" y2="-11" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" transform="rotate(300)" />
            <line x1="0" y1="0" x2="0" y2="-16" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" transform="rotate(60)" />
            <line x1="0" y1="3" x2="0" y2="-17" stroke="var(--accent)" strokeWidth="1" style={{ transformOrigin: '0 0', animation: 'spin 60s linear infinite' }} />
            <circle r="2" fill="var(--accent)" />
          </g>
        </motion.g>

        {/* lampy s kužely světla */}
        <motion.g style={{ y: frontY, x: mx * -18 }}>
          <Lamp x={250} flickerDelay="0s" />
          <Lamp x={880} flickerDelay="2.1s" />
          <Lamp x={1180} flickerDelay="4.3s" />
        </motion.g>

        {/* podlaha: pevná deska, na které skříně stojí */}
        <rect x="0" y={FLOOR - 14} width={W} height="14" fill="url(#groundshadow)" />
        <rect x="0" y={FLOOR} width={W} height={H - FLOOR} fill="var(--bg-3)" />
        <line x1="0" y1={FLOOR} x2={W} y2={FLOOR} stroke="var(--line)" strokeWidth="2" />
        {/* spáry v podlaze */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={i * 130 - 20} y1={FLOOR} x2={i * 130 + 40} y2={H} stroke="var(--line)" strokeWidth="1" opacity="0.5" />
        ))}
      </svg>
    </div>
  )
}
