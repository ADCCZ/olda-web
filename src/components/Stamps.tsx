import { AnimatePresence, motion } from 'motion/react'
import { useI18n } from '../lib/i18n'
import { STAMP_IDS, type StampId } from '../lib/stamps'
import { Close } from './Icons'

/** Sbírka razítek: co už návštěvník objevil a nápověda k tomu, co ne. */
export function StampsPanel({ open, earned, onClose }: { open: boolean; earned: StampId[]; onClose: () => void }) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} role="dialog" aria-modal="true" aria-label={t.stampsList.title}
        >
          <motion.div
            className="panel w-full max-w-lg p-5 md:p-6"
            initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-sm">{t.stampsList.title}</h3>
                <p className="mt-1 text-sm text-ink-2">{t.stampsList.lead}</p>
              </div>
              <button type="button" onClick={onClose} className="text-ink-2 hover:text-accent" aria-label="Close"><Close width={18} height={18} /></button>
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-3">
              {STAMP_IDS.map((id) => {
                const has = earned.includes(id)
                const item = t.stampsList.items[id]
                return (
                  <li key={id} className="flex flex-col items-center gap-2 text-center">
                    <span className={`stamp ${has ? '' : 'opacity-30 grayscale'}`} style={{ transform: `rotate(${has ? -6 : 0}deg)` }}>{has ? item.name : '?'}</span>
                    <span className="readout text-[0.7rem] leading-snug">{has ? item.name : item.hint}</span>
                  </li>
                )
              })}
            </ul>
            <p className="readout mt-5">{earned.length} / {STAMP_IDS.length}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
