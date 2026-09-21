import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { Close } from './Icons'
import { portalGo } from '../lib/portal'
import { earnStamp } from '../lib/stamps'

/**
 * Složka – původní průvodkyně webem: archivní šanon s očima.
 *  - komentuje sekce, když k nim doscrollujete (každou jen jednou za sezení)
 *  - umí provést celým webem (režim prohlídky)
 *  - reaguje na easter eggy přes událost `guide:say`
 *  - dá se schovat; zpět ji zavolá terminál (`guide`) nebo odkaz v patičce
 */

type Bubble = { text: string; kind: 'welcome' | 'tip' | 'section' | 'tour' | 'react' } | null

const SECTIONS = ['about', 'education', 'experience', 'projects', 'skills', 'leadership', 'contact'] as const

function readFlag(key: string) {
  try { return sessionStorage.getItem(key) } catch { return null }
}
function writeFlag(key: string, value: string) {
  try { sessionStorage.setItem(key, value) } catch { /* ignore */ }
}

/** Šanon s očima. Zorničky sledují kurzor, při mluvení hýbe pusou. */
function Mascot({ talking, look }: { talking: boolean; look: { x: number; y: number } }) {
  return (
    <svg viewBox="0 0 120 110" aria-hidden className="guide-bob h-auto w-[68px] drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] md:w-[96px]">
      {/* zadní deska s ouškem */}
      <path d="M12 26h30l8-10h58a8 8 0 0 1 8 8v70a8 8 0 0 1-8 8H12a8 8 0 0 1-8-8V34a8 8 0 0 1 8-8z" fill="var(--accent-2)" />
      {/* přední deska – malinko níž, aby byla vidět tloušťka */}
      <rect x="4" y="34" width="112" height="68" rx="8" fill="var(--accent)" />
      <rect x="4" y="34" width="112" height="68" rx="8" fill="none" stroke="rgba(0,0,0,0.18)" />
      {/* štítek */}
      <rect x="66" y="42" width="40" height="14" rx="2" fill="var(--bg-2)" />
      <text x="86" y="52.5" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink)" letterSpacing="1">SLOŽKA</text>
      {/* oči */}
      <g>
        <ellipse cx="34" cy="66" rx="10" ry="11" fill="#fffaf0" />
        <ellipse cx="58" cy="66" rx="10" ry="11" fill="#fffaf0" />
        <circle cx={34 + look.x} cy={66 + look.y} r="4.2" fill="#1a1408" />
        <circle cx={58 + look.x} cy={66 + look.y} r="4.2" fill="#1a1408" />
        <circle cx={35.5 + look.x} cy={64 + look.y} r="1.3" fill="#fff" />
        <circle cx={59.5 + look.x} cy={64 + look.y} r="1.3" fill="#fff" />
        {/* víčka – mrkání */}
        <ellipse cx="34" cy="66" rx="10.5" ry="11.5" fill="var(--accent)" className="guide-eye" style={{ animationDelay: '0.4s' }} />
        <ellipse cx="58" cy="66" rx="10.5" ry="11.5" fill="var(--accent)" className="guide-eye" style={{ animationDelay: '0.4s' }} />
      </g>
      {/* pusa */}
      {talking ? (
        <ellipse cx="46" cy="86" rx="7" ry="3" fill="#1a1408" className="guide-mouth-talk" />
      ) : (
        <path d="M38 85q8 7 16 0" fill="none" stroke="#1a1408" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {/* tvářičky */}
      <circle cx="22" cy="80" r="3" fill="rgba(217,79,43,0.35)" />
      <circle cx="70" cy="80" r="3" fill="rgba(217,79,43,0.35)" />
    </svg>
  )
}

export function Guide({ visible, onHide }: { visible: boolean; onHide: () => void }) {
  const { t, lang } = useI18n()
  const [bubble, setBubble] = useState<Bubble>(null)
  const [tip, setTip] = useState(0)
  const [tour, setTour] = useState<number | null>(null)
  const [look, setLook] = useState({ x: 0, y: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<number | undefined>(undefined)
  const seen = useRef<Set<string>>(new Set((readFlag('guide-seen') ?? '').split(',').filter(Boolean)))

  const say = useCallback((text: string, kind: NonNullable<Bubble>['kind'], ms = 7000) => {
    setBubble({ text, kind })
    window.clearTimeout(hideTimer.current)
    if (ms) hideTimer.current = window.setTimeout(() => setBubble((b) => (b?.kind === 'tour' ? b : null)), ms)
  }, [])

  // uvítání – jednou za sezení, chvíli po načtení
  useEffect(() => {
    if (!visible || readFlag('guide-welcomed')) return
    const id = window.setTimeout(() => { say(t.guide.welcome, 'welcome', 12000); writeFlag('guide-welcomed', '1') }, 2600)
    return () => window.clearTimeout(id)
  }, [visible, say, t.guide.welcome])

  // komentář k sekci, ke které jste doscrollovali (každá jen jednou)
  useEffect(() => {
    if (!visible) return
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || tour !== null) continue
        const id = e.target.id as (typeof SECTIONS)[number]
        if (seen.current.has(id)) continue
        seen.current.add(id)
        writeFlag('guide-seen', [...seen.current].join(','))
        say(t.guide.sections[id], 'section')
      }
    }, { threshold: 0.45 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [visible, tour, say, t.guide.sections])

  // reakce na easter eggy (Konami, Pexeso…) – posílá je App
  useEffect(() => {
    const onSay = (e: Event) => say((e as CustomEvent<string>).detail, 'react')
    window.addEventListener('guide:say', onSay)
    return () => window.removeEventListener('guide:say', onSay)
  }, [say])

  // zorničky sledují kurzor
  useEffect(() => {
    if (!visible) return
    const onMove = (e: PointerEvent) => {
      const el = rootRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const dx = e.clientX - cx, dy = e.clientY - cy
      const len = Math.hypot(dx, dy) || 1
      const k = Math.min(1, len / 300) * 2.6
      setLook({ x: (dx / len) * k, y: (dy / len) * k })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [visible])

  const nextTip = () => {
    const i = tip % t.guide.tips.length
    say(t.guide.tips[i], 'tip', 9000)
    setTip(i + 1)
  }

  const startTour = () => { setTour(0); goStep(0) }
  const goStep = (i: number) => {
    const step = t.guide.tour[i]
    const r = rootRef.current?.getBoundingClientRect()
    portalGo(step.target, r ? r.left + r.width / 2 : undefined, r ? r.top + r.height / 2 : undefined)
    say(step.text, 'tour', 0)
  }
  const nextStep = () => {
    if (tour === null) return
    const n = tour + 1
    if (n >= t.guide.tour.length) { setTour(null); setBubble(null); earnStamp('tour'); return }
    setTour(n); goStep(n)
  }
  const endTour = () => { setTour(null); setBubble(null) }

  const onMascotClick = () => {
    if (tour !== null) { nextStep(); return }
    if (bubble) { setBubble(null); return }
    say(t.guide.hello, 'welcome', 6000)
  }

  const hide = () => {
    say(t.guide.bye, 'react', 2500)
    window.setTimeout(onHide, 1800)
  }

  const isLast = tour !== null && tour === t.guide.tour.length - 1

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={rootRef}
          className="no-print fixed bottom-3 right-3 z-40 flex flex-col items-end gap-2 md:bottom-6 md:right-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        >
          <AnimatePresence>
            {bubble && (
              <motion.div
                key={bubble.text}
                className="panel w-[min(22rem,calc(100vw-2rem))] p-4 text-sm leading-relaxed"
                initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                role="status"
                onMouseEnter={() => window.clearTimeout(hideTimer.current)}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="readout">{t.guide.name}, {t.guide.role}{tour !== null ? ` (${tour + 1}/${t.guide.tour.length})` : ''}</span>
                  <button type="button" onClick={tour !== null ? endTour : () => setBubble(null)} className="text-ink-2 hover:text-accent" aria-label="Close"><Close width={14} height={14} /></button>
                </div>
                <p>{bubble.text}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tour !== null ? (
                    <button type="button" className="pill pill-solid" onClick={nextStep}>{isLast ? t.guide.buttons.done : t.guide.buttons.continue}</button>
                  ) : (
                    <>
                      <button type="button" className="pill pill-solid" onClick={startTour}>{t.guide.buttons.tour}</button>
                      <button type="button" className="pill" onClick={nextTip}>{t.guide.buttons.next}</button>
                      {bubble.kind === 'welcome' && <button type="button" className="pill" onClick={hide}>{t.guide.buttons.hide}</button>}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-1">
            <button
              type="button"
              onClick={onMascotClick}
              className="rounded-xl transition-transform hover:scale-105 active:scale-95"
              aria-label={`${t.guide.name} – ${t.guide.role}`}
              title={lang === 'cs' ? 'Složka, průvodkyně' : 'Složka, the guide'}
            >
              <Mascot talking={!!bubble} look={look} />
            </button>
            <button type="button" onClick={hide} className="readout mb-2 rounded px-1 opacity-60 hover:text-accent hover:opacity-100" aria-label={t.guide.buttons.hide}>×</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
