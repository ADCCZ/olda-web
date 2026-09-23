import { useState } from 'react'
import { useI18n } from '../lib/i18n'
import { earnStamp } from '../lib/stamps'

/**
 * Původní ilustrace: služební monitor ze 70. let, na obrazovce evidovaná varianta.
 * Klikání = easter egg (mrkne, po pátém kliknutí obraz "ztratí signál" a vrátí se).
 */
export function Avatar({ className = '', onMessage }: { className?: string; onMessage?: (m: string) => void }) {
  const { t } = useI18n()
  const [clicks, setClicks] = useState(0)
  const [wink, setWink] = useState(false)
  const [static_, setStatic] = useState(false)

  const click = () => {
    const n = clicks + 1
    setClicks(n)
    setWink(true)
    setTimeout(() => setWink(false), 260)
    const msgs = t.eggs.avatar
    onMessage?.(msgs[Math.min(n - 1, msgs.length - 1)])
    if (n % 5 === 0) {
      earnStamp('monitor')
      setStatic(true)
      setTimeout(() => setStatic(false), 700)
    }
  }

  return (
    <button type="button" onClick={click} aria-label="Avatar" className={`block select-none ${className}`}>
      <svg viewBox="0 0 180 170" className="h-auto w-full" role="img" aria-hidden>
        {/* tělo monitoru */}
        <rect x="6" y="6" width="168" height="128" rx="14" fill="var(--bg-3)" stroke="var(--line)" strokeWidth="2" />
        <rect x="12" y="12" width="156" height="116" rx="10" fill="none" stroke="var(--line)" strokeWidth="1" opacity="0.6" />
        {/* obrazovka */}
        <clipPath id="screen"><rect x="24" y="22" width="132" height="94" rx="8" /></clipPath>
        <rect x="24" y="22" width="132" height="94" rx="8" fill="var(--crt-bg)" />
        <g clipPath="url(#screen)" className="flicker">
          {/* obraz naskočí jako stará obrazovka: nejdřív vodorovná čára, pak se roztáhne */}
          <g className="crt-on" style={{ transformOrigin: '90px 69px' }}>
            {t.photo && !static_ ? (
              <g>
                <filter id="phosphor"><feColorMatrix type="matrix" values="0 0 0 0 0.05  0.2 0.5 0.2 0 0.15  0 0 0 0 0.08  0 0 0 1 0" /></filter>
                <image href={t.photo} x="24" y="22" width="132" height="94" preserveAspectRatio="xMidYMid slice" filter="url(#phosphor)" />
              </g>
            ) : static_ ? (
              <g>
                {Array.from({ length: 24 }, (_, i) => (
                  <rect key={i} x="24" y={22 + i * 4} width="132" height="2" fill="var(--crt-ink)" opacity={((i * 7) % 5) / 6} />
                ))}
              </g>
            ) : (
              <g stroke="var(--crt-ink)" fill="none" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 3px var(--glow))' }}>
                {/* hlava */}
                <circle cx="90" cy="66" r="26" />
                {/* oči */}
                {wink ? <path d="M78 62q4 4 8 0" /> : <circle cx="82" cy="62" r="2.5" fill="var(--crt-ink)" />}
                <circle cx="98" cy="62" r="2.5" fill="var(--crt-ink)" />
                {/* úsměv */}
                <path d={clicks >= 5 ? 'M78 74q12 12 24 0' : 'M80 75q10 7 20 0'} />
                {/* límec a kravata – úředník */}
                <path d="M62 112q28-24 56 0" />
                <path d="M90 92v16" strokeWidth="4" />
              </g>
            )}
          </g>
          {/* řádkování obrazovky */}
          <g fill="#000" opacity="0.25">
            {Array.from({ length: 32 }, (_, i) => <rect key={i} x="24" y={22 + i * 3} width="132" height="1" />)}
          </g>
        </g>
        {/* ovládací prvky */}
        <circle cx="150" cy="122" r="3" fill="var(--accent)" className="blink" />
        <rect x="32" y="120" width="28" height="4" rx="2" fill="var(--line)" />
        <rect x="66" y="120" width="12" height="4" rx="2" fill="var(--line)" />
        {/* podstavec + štítek */}
        <rect x="70" y="134" width="40" height="8" fill="var(--line)" />
        <rect x="46" y="142" width="88" height="22" rx="4" fill="var(--wood)" />
        <text x="90" y="157" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--wood-ink)" letterSpacing="1">{t.hero.plate}</text>
      </svg>
    </button>
  )
}
