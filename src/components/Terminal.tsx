import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { complete, run, type Effect } from '../lib/terminal'
import { earnStamp } from '../lib/stamps'
import { Close } from './Icons'

type Line = { kind: 'in' | 'out'; text: string }

export function Terminal({ open, onClose, onEffect }: { open: boolean; onClose: () => void; onEffect: (e: Effect) => void }) {
  const { t, lang, toggle: toggleLang } = useI18n()
  const { theme, toggle: toggleTheme } = useTheme()
  const [lines, setLines] = useState<Line[]>(() => [{ kind: 'out', text: t.terminal.welcome }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [lines])

  const submit = (raw: string) => {
    const { out, effects } = run(raw, { t, theme, lang, history })
    if (raw.trim()) { setHistory((h) => [...h, raw]); setCursor(-1) }
    if (/^variants?\b/i.test(raw.trim())) earnStamp('variant')
    if (effects.includes('clear')) { setLines([]); setInput(''); return }
    setLines((l) => [...l, { kind: 'in', text: raw }, ...out.map((text) => ({ kind: 'out' as const, text }))])
    setInput('')
    for (const e of effects) {
      if (e === 'theme') toggleTheme()
      else if (e === 'lang') toggleLang()
      else if (e === 'exit') setTimeout(onClose, 600)
      else if (typeof e === 'object' && 'open' in e) window.open(e.open, '_blank', 'noopener')
      else onEffect(e)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'Tab') {
      e.preventDefault()
      const opts = complete(input, t)
      if (opts.length === 1) setInput(opts[0] + (opts[0].includes(' ') ? '' : ' '))
      else if (opts.length > 1) setLines((l) => [...l, { kind: 'out', text: opts.join('  ') }])
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (!history.length) return
      const next = e.key === 'ArrowUp'
        ? (cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1))
        : (cursor === -1 ? -1 : Math.min(history.length, cursor + 1))
      setCursor(next === history.length ? -1 : next)
      setInput(next === -1 || next === history.length ? '' : history[next])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-3xl px-3 pb-3"
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog" aria-label={t.terminal.title}
        >
          <div className="crt rounded-xl border border-line font-mono text-sm shadow-[0_0_40px_var(--glow)]" onClick={() => inputRef.current?.focus()}>
            <div className="relative z-10 flex items-center justify-between border-b border-crt-line px-4 py-2 text-crt-ink-2">
              <span className="font-mono text-xs tracking-wide">{t.terminal.title}</span>
              <button type="button" onClick={onClose} className="hover:text-crt-bright" aria-label="Close"><Close width={16} height={16} /></button>
            </div>
            <div className="no-scrollbar relative z-10 max-h-80 overflow-y-auto px-4 py-3">
              {lines.map((l, i) => (
                <div key={i} className={`whitespace-pre-wrap ${l.kind === 'in' ? 'text-crt-bright' : 'text-crt-ink-2'}`}>
                  {l.kind === 'in' && <span className="text-crt-ink">{t.terminal.prompt} </span>}
                  {l.text}
                </div>
              ))}
              <form onSubmit={(e) => { e.preventDefault(); submit(input) }} className="flex items-center gap-2">
                <span className="text-crt-ink">{t.terminal.prompt}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="min-w-0 flex-1 bg-transparent text-crt-bright caret-crt-ink outline-none focus-visible:outline-none"
                  autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="command"
                />
              </form>
              <div ref={endRef} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
