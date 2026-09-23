import { useState } from 'react'
import { useI18n } from '../lib/i18n'
import { earnStamp } from '../lib/stamps'
import { HORN_SECTIONS, loadHorns, saveHorns } from '../lib/horns'

const toast = (m: string) => window.dispatchEvent(new CustomEvent('toast', { detail: m }))

/**
 * Easter egg: v každé sudé sekci (úvod = 1.) jsou kromě velké zlaté helmy v pozadí
 * schované i malé rohy. Skoro splývají s pozadím, po najetí se rozzáří. Za všechny
 * je razítko. Nalezené se pamatují v localStorage (lib/horns.ts).
 */
export function Horns({ id, className = '' }: { id: string; className?: string }) {
  const { t } = useI18n()
  const [found, setFound] = useState(() => loadHorns().includes(id))
  const [glint, setGlint] = useState(false)

  const click = () => {
    setGlint(true)
    window.setTimeout(() => setGlint(false), 1200)
    const list = loadHorns()
    if (list.includes(id)) { toast(t.eggs.hornsAgain); return }
    const next = [...list, id]
    saveHorns(next)
    setFound(true)
    toast(t.eggs.horns(next.length, HORN_SECTIONS.length))
    if (next.length >= HORN_SECTIONS.length) earnStamp('loki')
  }

  return (
    <button
      type="button"
      onClick={click}
      aria-label={t.eggs.hornsLabel}
      className={`horns no-print absolute z-10 ${found ? 'horns-found' : ''} ${glint ? 'horns-glint' : ''} ${className}`}
    >
      <svg viewBox="0 0 48 36" width="30" height="23" aria-hidden fill="currentColor">
        {/* dva dlouhé rohy stočené vzhůru, mezi nimi čelenka se špičkou */}
        <path d="M19 28C13 25 8 20 7 12c-.5-4 .5-8 2-11 2 6 3.5 12 6.5 17 1.5 2.5 4 4.5 6.5 6z" />
        <path d="M29 28c6-3 11-8 12-16 .5-4-.5-8-2-11-2 6-3.5 12-6.5 17-1.5 2.5-4 4.5-6.5 6z" />
        <path d="M15 29q9-8 18 0v3q-9-7-18 0z" />
        <path d="m24 24 2.2 5-2.2 5-2.2-5z" />
      </svg>
    </button>
  )
}
