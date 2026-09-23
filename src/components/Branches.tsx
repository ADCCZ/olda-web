import { useLayoutEffect, useRef, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { Avatar } from './Avatar'
import { interestIcon } from './Icons'
import { portalGo } from '../lib/portal'

/**
 * Hlavní vizuál: časová linie Oldy. Z hlavní linie se odvětvují varianty
 * (studium, oddíl, kytara, kód, hry) a běží dál paralelně. Na konci linie
 * sedí služební monitor s evidovanou variantou. Větve se při načtení nakreslí,
 * po hlavní linii běží puls. Najetí zvýrazní větev, klik skočí na sekci.
 */
const W = 640
const MAIN_Y = 230
/** svislý výřez: jen to, kde něco je (uzly, popisky) */
const VB_Y = 14
const VB_H = 372
/** y pruhu, x odbočení, x konce (pořadí = t.hero.orbit) */
const LANES: { y: number; bx: number; ex: number; label: 'right' | 'above' | 'below' }[] = [
  { y: 290, bx: 150, ex: 400, label: 'below' }, // code
  { y: 105, bx: 60, ex: 520, label: 'right' },  // scout
  { y: 170, bx: 200, ex: 400, label: 'above' }, // guitar
  { y: 355, bx: 260, ex: 520, label: 'right' }, // games
  { y: 40, bx: 90, ex: 560, label: 'right' },   // school
]
const YEARS = [{ x: 90, l: '2023' }, { x: 230, l: '2024' }, { x: 370, l: '2025' }, { x: 440, l: '2026' }]

export function Branches({ onAvatarMessage, onAction }: { onAvatarMessage: (m: string) => void; onAction: (a: 'pexeso') => void }) {
  const { t } = useI18n()
  const [hot, setHot] = useState<number | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(W)

  // skutečná šířka kvůli popiskům: na úzkém displeji by se jinak zmenšily k nečitelnosti
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => { const w = el.getBoundingClientRect().width; if (w) setWidth(w) }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const unitsPerPx = W / width
  /** popisky drží ~13 px, roky ~10 px (v jednotkách SVG) */
  const fs = Math.min(24, Math.max(15, 13 * unitsPerPx))
  const yearFs = Math.min(16, Math.max(11, 10 * unitsPerPx))

  // monitor se lehce natáčí za kurzorem
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -10, y: ((e.clientX - r.left) / r.width - 0.5) * 12 })
  }

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[640px]" data-orbit onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })} style={{ perspective: 900 }}>
      <svg viewBox={`0 ${VB_Y} ${W} ${VB_H}`} className="h-auto w-full overflow-visible" aria-label={t.hero.orbitHint}>
        {/* roky na hlavní linii */}
        {YEARS.map((y) => (
          <g key={y.l}>
            <line x1={y.x} y1={MAIN_Y - 6} x2={y.x} y2={MAIN_Y + 6} stroke="var(--ink-2)" strokeWidth="1" />
            <text x={y.x} y={MAIN_Y + 12 + yearFs} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={yearFs} fill="var(--ink-2)">{y.l}</text>
          </g>
        ))}
        {/* hlavní linie */}
        <line x1="10" y1={MAIN_Y} x2="530" y2={MAIN_Y} stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
        {/* puls běžící po linii */}
        <circle r="5" fill="var(--accent-2)" style={{ offsetPath: `path('M10 ${MAIN_Y} L470 ${MAIN_Y}')`, animation: 'travel 5s linear infinite' } as React.CSSProperties}>
          <title>{t.hero.pulse}</title>
        </circle>

        {/* větve */}
        {t.hero.orbit.map((b, i) => {
          const L = LANES[i]
          const Icon = interestIcon[b.id as keyof typeof interestIcon]
          // popisek vpravo se musí vejít do šířky (písmo má 0.6 em na znak), jinak se větev zkrátí
          const ex = L.label === 'right' ? Math.min(L.ex, W - 30 - b.label.length * fs * 0.6) : L.ex
          const d = `M${L.bx} ${MAIN_Y} C${L.bx + 34} ${MAIN_Y}, ${L.bx + 34} ${L.y}, ${L.bx + 68} ${L.y} L${ex} ${L.y}`
          const active = hot === i
          return (
            <g key={b.id} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}>
              <path
                d={d}
                fill="none"
                stroke={active ? 'var(--accent-2)' : 'var(--accent)'}
                strokeWidth={active ? 2.5 : 1.5}
                strokeLinecap="round"
                opacity={active ? 1 : 0.75}
                className="branch-draw"
                style={{ animationDelay: `${0.15 + i * 0.18}s`, transition: 'stroke-width .2s, opacity .2s' }}
              />
              <circle cx={L.bx} cy={MAIN_Y} r="4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
              <a
                href={b.target}
                className="group cursor-pointer"
                aria-label={b.label}
                onClick={(e) => {
                  e.preventDefault()
                  if (b.action) onAction(b.action)
                  else portalGo(b.target, e.clientX, e.clientY, b.label)
                }}
              >
                {/* větší neviditelná plocha pro prst */}
                <circle cx={ex} cy={L.y} r="30" fill="transparent" />
                <circle cx={ex} cy={L.y} r="18" fill={active ? 'var(--accent)' : 'var(--bg-2)'} stroke="var(--accent)" strokeWidth="1.5" style={{ transition: 'fill .2s' }} />
                <g transform={`translate(${ex - 9} ${L.y - 9})`} color={active ? 'var(--accent-ink)' : 'var(--ink)'} style={{ transition: 'color .2s' }}>
                  <Icon width={18} height={18} />
                </g>
                <text
                  x={L.label === 'right' ? ex + 26 : ex}
                  y={L.label === 'right' ? L.y + fs * 0.3 : L.label === 'above' ? L.y - 22 - fs * 0.2 : L.y + 22 + fs * 0.75}
                  textAnchor={L.label === 'right' ? 'start' : 'middle'}
                  fontFamily="var(--font-mono)" fontSize={fs} fill={active ? 'var(--accent-2)' : 'var(--ink-2)'}
                >
                  {b.label}
                </text>
              </a>
            </g>
          )
        })}
      </svg>
      {/* služební monitor na konci linie */}
      <div
        className="absolute right-[1%] w-[27%]"
        style={{ top: `${((MAIN_Y - VB_Y) / VB_H) * 100}%`, transform: `translateY(-54%) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d', transition: 'transform 0.25s ease-out' }}
      >
        <Avatar onMessage={onAvatarMessage} />
      </div>
    </div>
  )
}
