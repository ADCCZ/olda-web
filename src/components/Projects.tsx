import { useI18n } from '../lib/i18n'
import { useGithubRepos, type Repo } from '../hooks/useGithub'
import type { Project } from '../data/content'
import { Section } from './Section'
import { External, Gamepad, Github } from './Icons'

/** barvy jazyků jako na GitHubu */
const langColor: Record<string, string> = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', C: '#8a8a8a', PHP: '#4F5D95', Latte: '#f2a501', Twig: '#c1d026',
  Java: '#b07219', Python: '#3572A5', 'C#': '#178600', HTML: '#e34c26', CSS: '#663399', Hack: '#878787',
  Makefile: '#427819', Shell: '#89e051', Dockerfile: '#384d54', Vue: '#41b883', SCSS: '#c6538c',
}
const color = (l: string) => langColor[l] ?? 'var(--ink-2)'

function fmtDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : 'en-GB', { month: 'long', year: 'numeric' })
}

/** tenký proužek s poměrem jazyků */
function LangBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1
  const parts = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5)
  return (
    <div className="mt-2 max-w-[240px]">
      <div className="flex h-1.5 w-full overflow-hidden rounded-sm bg-line" aria-hidden>
        {parts.map(([l, n]) => <span key={l} style={{ width: `${(n / total) * 100}%`, background: color(l) }} />)}
      </div>
      <p className="readout mt-1 text-[0.7rem]">
        {parts.map(([l, n]) => `${l} ${Math.round((n / total) * 100)} %`).join(', ')}
      </p>
    </div>
  )
}

export function Projects({ onPexeso }: { onPexeso: () => void }) {
  const { t, lang } = useI18n()
  const { repos, source, loading } = useGithubRepos(t.githubUser)
  const byName = new Map(repos.map((r) => [r.name, r]))

  // repozitáře bez vlastního popisku se doplní automaticky
  const known = new Set(t.projects.items.map((p) => p.repo).filter(Boolean))
  const extra: Project[] = repos
    .filter((r) => !known.has(r.name))
    .map((r) => ({ repo: r.name, title: r.name, desc: r.description ?? '', tags: r.language ? [r.language] : [] }))
  const all = [...t.projects.items, ...extra]

  const Row = ({ p }: { p: Project }) => {
    const r: Repo | undefined = p.repo ? byName.get(p.repo) : undefined
    const live = p.live || r?.homepage
    return (
      <li className="grid gap-3 py-5 md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-6 md:py-6">
        <div>
          <h3 className={p.featured ? 'font-display text-sm md:text-base' : 'font-medium'}>{p.title}</h3>
          {p.desc && <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-2">{p.desc}</p>}
          {r?.languages && <LangBar languages={r.languages} />}
        </div>
        <p className="text-sm text-ink-2 md:pt-0.5">
          <span className="readout md:hidden">{t.projects.cols.tech}: </span>
          {p.tags.join(', ')}
        </p>
        <p className="readout md:pt-1">
          {loading && p.repo ? (
            <span className="inline-block h-3 w-24 animate-pulse rounded-sm bg-line align-middle" aria-hidden />
          ) : r ? (
            <>{r.language && !r.languages && <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: color(r.language) }} />}{fmtDate(r.pushed_at ?? r.updated_at, lang)}</>
          ) : (
            t.projects.noRepo
          )}
        </p>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {r && <a href={r.html_url} target="_blank" rel="noreferrer" className="pill"><Github width={15} height={15} />{t.projects.repoLabel}</a>}
          {live && <a href={live} target="_blank" rel="noreferrer" className="pill pill-solid"><External width={15} height={15} />{t.projects.liveLabel}</a>}
          {p.repo === 'tmwmf_sem_UPS' && (
            <button type="button" onClick={onPexeso} className="pill pill-solid"><Gamepad width={15} height={15} />{t.projects.play}</button>
          )}
        </div>
      </li>
    )
  }

  return (
    <Section id="projects" title={t.projects.title} lead={source === 'snapshot' ? t.projects.offline : t.projects.lead}>
      {/* hlavička rejstříku */}
      <div className="hidden border-b border-line pb-2 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
        <span className="readout">{t.projects.cols.project}</span>
        <span className="readout">{t.projects.cols.tech}</span>
        <span className="readout">{t.projects.cols.updated}</span>
        <span className="readout md:text-right">{t.projects.cols.links}</span>
      </div>
      <ul className="divide-y divide-line border-y border-line md:border-t-0">
        {all.map((p) => <Row key={p.title} p={p} />)}
      </ul>
      <p className="readout mt-3 flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${source === 'snapshot' ? 'bg-ink-2' : 'bg-accent'}`} />
        {source === 'snapshot' ? t.projects.sourceSnapshot : t.projects.sourceLive}
      </p>
    </Section>
  )
}
