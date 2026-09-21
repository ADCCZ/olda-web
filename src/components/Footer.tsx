import { useI18n } from '../lib/i18n'

export function Footer({ onCallGuide }: { onCallGuide: () => void }) {
  const { t } = useI18n()
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-sm text-ink-2 md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} {t.fullName}. <a href={t.github} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:text-accent">{t.footer.made}</a></p>
        <p className="readout">
          {t.footer.eggs}{' '}
          <button type="button" onClick={onCallGuide} className="underline decoration-dotted underline-offset-2 hover:text-accent">{t.footer.guide}</button>
        </p>
      </div>
    </footer>
  )
}
