import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'

/** délka ukazatele průběhu ve znacích */
const BAR = 20

/** úvodní terminál se ukáže při každém načtení stránky (kromě omezeného pohybu) */
const wanted = () => { try { return !matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false } }

/**
 * Zelený terminál při načtení stránky. Řádky z t.boot: "$ příkaz" se píše znak po znaku,
 * výpis systému naběhne rychle, {bar} se vyplní jako ukazatel průběhu. Pak obrazovka zmizí
 * a úvod (Hero) spustí své animace. Klik nebo libovolná klávesa = přeskočit.
 */
export function Boot() {
  const { t } = useI18n()
  const lines = t.boot
  const [show, setShow] = useState(wanted)
  // kde psaní je: řádek, znak v něm, dílky ukazatele
  const [pos, setPos] = useState({ line: 0, ch: 0, bar: 0 })

  const done = useCallback(() => {
    setShow(false)
    // úvod (Hero) čeká s animacemi, dokud obrazovka nezmizí
    window.dispatchEvent(new Event('boot:done'))
  }, [])

  useEffect(() => {
    if (!show) return
    const cur = lines[pos.line]
    if (cur === undefined) {
      const id = window.setTimeout(done, 300)
      return () => window.clearTimeout(id)
    }
    const cmd = cur.startsWith('$ ')
    const body = cmd ? cur.slice(2) : cur
    const barAt = body.indexOf('{bar}')
    const textLen = barAt >= 0 ? barAt : body.length
    let delay: number
    let next: typeof pos
    if (pos.ch < textLen) {
      // příkaz píše člověk (pomaleji, s pauzou na začátku), výpis sype stroj (po třech znacích)
      delay = pos.ch === 0 ? (cmd ? 180 : 40) : (cmd ? 18 : 5)
      next = { ...pos, ch: pos.ch + (cmd ? 1 : 3) }
    } else if (barAt >= 0 && pos.bar < BAR) {
      delay = 16
      next = { ...pos, bar: pos.bar + 1 }
    } else {
      delay = cmd ? 150 : 40
      next = { line: pos.line + 1, ch: 0, bar: 0 }
    }
    const id = window.setTimeout(() => setPos(next), delay)
    return () => window.clearTimeout(id)
  }, [pos, show, lines, done])

  // přeskočit libovolnou klávesou
  useEffect(() => {
    if (!show) return
    const onKey = () => done()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show, done])

  const render = (line: string, k: number) => {
    const cmd = line.startsWith('$ ')
    const body = cmd ? line.slice(2) : line
    const barAt = body.indexOf('{bar}')
    const current = k === pos.line
    const ch = current ? pos.ch : Infinity
    const bar = current ? pos.bar : BAR
    const text = body.slice(0, barAt >= 0 ? Math.min(ch, barAt) : ch)
    const showBar = barAt >= 0 && ch >= barAt
    return (
      <div key={k} className={cmd ? 'text-crt-bright' : ''}>
        {cmd && <span className="text-crt-ink-2">$ </span>}
        {text}
        {showBar && <>{'█'.repeat(bar)}<span className="opacity-40">{'░'.repeat(BAR - bar)}</span> {Math.round((bar / BAR) * 100)} %</>}
        {current && <span className="blink ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-crt-ink" />}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="crt boot-green fixed inset-0 z-50 flex cursor-pointer items-center justify-center p-5"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={done}
          role="presentation"
        >
          <pre className="flicker relative z-10 w-full max-w-2xl whitespace-pre-wrap break-words font-mono text-xs leading-6 sm:text-sm sm:leading-7 md:text-base">
            {lines.slice(0, pos.line + 1).map(render)}
            {/* hotovo: nová výzva, terminál čeká na další příkaz */}
            {pos.line >= lines.length && (
              <div><span className="text-crt-ink-2">$ </span><span className="blink ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-crt-ink" /></div>
            )}
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
