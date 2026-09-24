import type { SVGProps } from 'react'

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
})

export const Github = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>
)
export const External = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>
)
export const Sun = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
export const Moon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
)
export const Download = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></svg>
)
export const Mail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
)
export const Linkedin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
)
export const Terminal = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m5 8 4 4-4 4M11 16h8" /></svg>
)
export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
)

/* --- ikony zájmů (jednoduché, vlastní) --- */
/** akustická kytara: nakreslená nastojato (hlava s kolíčky, krk, tělo, otvor, kobylka), pak natočená šikmo */
export const Guitar = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <g transform="translate(12 12) rotate(38) scale(1.1) translate(-12 -12)">
      <path d="M10.6 2.4h2.8v2.9h-2.8z" />
      <path d="M10.6 3.4H9.4M10.6 4.6H9.4M13.4 3.4h1.2M13.4 4.6h1.2" />
      <path d="M11.3 5.3v4.9M12.7 5.3v4.9" />
      <path d="M12 10.2c-2.4 0-3.7 1.1-3.6 2.7.1 1 .8 1.5.5 2.3-1.8.5-2.4 1.8-2.3 3.2.2 2.1 2.4 3.4 5.4 3.4s5.2-1.3 5.4-3.4c.1-1.4-.5-2.7-2.3-3.2-.3-.8.4-1.3.5-2.3.1-1.6-1.2-2.7-3.6-2.7z" />
      <circle cx="12" cy="16.4" r="1.5" />
      <path d="M10.3 19.4h3.4" />
    </g>
  </svg>
)
export const Compass = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
)
export const Star = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" /></svg>
)
export const Play = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M8 5.5v13l10.5-6.5z" /></svg>
)
export const Chevron = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
)
export const Gamepad = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M6 8h12a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L15 15H9l-.7.6A3.5 3.5 0 0 1 2 13.5V12a4 4 0 0 1 4-4z" /><path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18.5 13h.01" /></svg>
)
export const Pot = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h20M8 6c0-1 1-1 1-2M12 6c0-1 1-1 1-2M16 6c0-1 1-1 1-2" /></svg>
)
export const Mountain = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m3 19 6-11 4 6 2-3 6 8zM9 8l1.5 2.5L12 9" /></svg>
)
export const Code = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>
)
export const School = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6" /></svg>
)

export const interestIcon = {
  guitar: Guitar, scout: Compass, marvel: Star, games: Gamepad, cook: Pot, mountain: Mountain, code: Code, school: School,
} as const
