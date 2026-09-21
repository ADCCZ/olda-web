import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'

/** Jantarová obrazovka při prvním načtení v rámci sezení. Klik = přeskočit. */
export function Boot() {
  const { t } = useI18n()
  const [show, setShow] = useState(() => {
    try {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
      return !sessionStorage.getItem('booted')
    } catch { return false }
  })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!show) return
    if (n >= t.boot.length) {
      const id = setTimeout(done, 450)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setN(n + 1), n === 0 ? 300 : 260)
    return () => clearTimeout(id)
  }, [n, show, t.boot.length])

  function done() {
    setShow(false)
    try { sessionStorage.setItem('booted', '1') } catch { /* ignore */ }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="crt fixed inset-0 z-50 flex cursor-pointer items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={done}
          role="presentation"
        >
          <pre className="flicker relative z-10 font-mono text-sm leading-7 md:text-base">
            {t.boot.slice(0, n).map((line, k) => <div key={k}>{line}</div>)}
            <span className="blink inline-block h-4 w-2.5 translate-y-0.5 bg-crt-ink" />
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
