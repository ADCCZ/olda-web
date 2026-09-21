import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

/** Krátké oznámení dole na stránce. */
export function Toast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-accent bg-bg px-4 py-2 font-mono text-sm"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          role="status"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * "Nexus" po Konami kódu: z okrajů obrazovky vyrůstají větvící se časové linie,
 * kreslené na canvas. Respektuje prefers-reduced-motion (pak jen statický záblesk).
 */
export function Hyperdrive({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const css = getComputedStyle(document.documentElement)
    const accent = css.getPropertyValue('--accent').trim() || '#c9a227'
    const accent2 = css.getPropertyValue('--accent-2').trim() || '#e9c95a'
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr
      canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`
    }
    resize()

    type Walker = { x: number; y: number; a: number; w: number; life: number; gen: number }
    const walkers: Walker[] = []
    const spawn = (x: number, y: number, a: number, w: number, gen: number) => walkers.push({ x, y, a, w, life: 60 + Math.random() * 90, gen })
    // z levého okraje doprava a z pravého doleva – jako dvě linie, které se míjejí
    for (let i = 0; i < 6; i++) {
      spawn(0, (0.15 + Math.random() * 0.7) * canvas.height, 0, 3, 0)
      spawn(canvas.width, (0.15 + Math.random() * 0.7) * canvas.height, Math.PI, 3, 0)
    }
    ctx.lineCap = 'round'
    let raf = 0
    const step = () => {
      const speed = (reduce ? 40 : 7) * dpr
      for (let k = walkers.length - 1; k >= 0; k--) {
        const wk = walkers[k]
        const nx = wk.x + Math.cos(wk.a) * speed
        const ny = wk.y + Math.sin(wk.a) * speed
        ctx.strokeStyle = wk.gen === 0 ? accent2 : accent
        ctx.globalAlpha = Math.max(0.15, 0.9 - wk.gen * 0.2)
        ctx.lineWidth = wk.w * dpr
        ctx.beginPath(); ctx.moveTo(wk.x, wk.y); ctx.lineTo(nx, ny); ctx.stroke()
        wk.x = nx; wk.y = ny
        wk.a += (Math.random() - 0.5) * 0.25
        wk.life--
        if (Math.random() < 0.03 && wk.gen < 3 && walkers.length < 150) {
          spawn(wk.x, wk.y, wk.a + (Math.random() < 0.5 ? -0.7 : 0.7), Math.max(0.6, wk.w * 0.7), wk.gen + 1)
        }
        if (wk.life <= 0 || wk.x < -20 || wk.x > canvas.width + 20 || wk.y < -20 || wk.y > canvas.height + 20) walkers.splice(k, 1)
      }
      ctx.globalAlpha = 1
      if (walkers.length && !reduce) raf = requestAnimationFrame(step)
    }
    if (reduce) { for (let i = 0; i < 40; i++) step() } else raf = requestAnimationFrame(step)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [active])

  return (
    <AnimatePresence>
      {active && (
        <motion.canvas
          ref={ref}
          className="pointer-events-none fixed inset-0 z-45"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  )
}
