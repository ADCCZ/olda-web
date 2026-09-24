/** Terminál: čistý interpret příkazů, bez Reactu (testovatelný). */
import type { content } from '../data/content'

type T = (typeof content)['cs']

export type Effect = 'theme' | 'lang' | 'exit' | 'clear' | 'pexeso' | 'hyperdrive' | 'guide' | { open: string }
export type Result = { out: string[]; effects: Effect[] }
export type Ctx = { t: T; theme: 'dark' | 'light'; lang: 'cs' | 'en'; history: string[] }

export const COMMANDS = ['help', 'whoami', 'variant', 'timeline', 'prune', 'guide', 'ls', 'cat', 'pwd', 'cd', 'neofetch', 'skills', 'projects', 'open', 'scout', 'guitar', 'marvel', 'games', 'pexeso', 'theme', 'lang', 'date', 'echo', 'history', 'sudo', 'clear', 'exit'] as const

/** falešný souborový systém */
function fs(t: T): Record<string, string | null> {
  const files: Record<string, string | null> = {
    'cv.txt': [t.about.lead, '', ...t.about.body].join('\n'),
    'skills.txt': t.skills.groups.map((g) => `${g.name}\n${g.items.map((i) => `  ${i.name.padEnd(26)} ${'■'.repeat(i.level)}${'□'.repeat(5 - i.level)}`).join('\n')}`).join('\n\n'),
    '.secret': t.terminal.secret,
    'projekty/': null,
  }
  for (const p of t.projects.items) if (p.repo) files[`projekty/${p.repo}`] = `${p.title}\n${p.desc}\n${p.tags.join(', ')}`
  return files
}

export function complete(partial: string, t: T): string[] {
  const [cmd, arg] = partial.split(/\s+/)
  if (arg === undefined) return COMMANDS.filter((c) => c.startsWith(cmd))
  if (cmd === 'cat' || cmd === 'open' || cmd === 'ls') {
    const names = cmd === 'open' ? t.projects.items.filter((p) => p.repo).map((p) => p.repo as string) : Object.keys(fs(t))
    return names.filter((n) => n.startsWith(arg)).map((n) => `${cmd} ${n}`)
  }
  return []
}

export function run(input: string, ctx: Ctx): Result {
  const { t } = ctx
  const T = t.terminal
  const [cmd = '', ...args] = input.trim().split(/\s+/)
  const arg = args.join(' ')
  const out: string[] = []
  const effects: Effect[] = []
  const files = fs(t)

  switch (cmd.toLowerCase()) {
    case '': break
    case 'help': out.push(T.help); break
    case 'whoami': out.push(T.whoami); break
    case 'variant': case 'variants': out.push(T.variant); break
    case 'timeline': out.push(T.timelineCmd); break
    case 'prune': out.push(T.prune); break
    case 'guide': case 'slozka': case 'složka': out.push(T.guideCmd); effects.push('guide'); break
    case 'pwd': out.push('/home/olda'); break
    case 'cd': out.push(T.cd); break
    case 'ls': {
      const all = args.includes('-a') || args.includes('-la')
      const dir = args.find((a) => !a.startsWith('-'))
      if (dir && dir.replace(/\/$/, '') === 'projekty') {
        out.push(Object.keys(files).filter((f) => f.startsWith('projekty/') && f !== 'projekty/').map((f) => f.slice(9)).join('  '))
      } else {
        out.push(Object.keys(files).filter((f) => !f.includes('/', 0) || f === 'projekty/').filter((f) => all || !f.startsWith('.')).join('  '))
      }
      break
    }
    case 'cat': {
      if (!arg) { out.push(T.catUsage); break }
      const key = arg.replace(/^\.\//, '')
      if (key in files && files[key] !== null) out.push(files[key] as string)
      else if (key in files) out.push(T.isDir(key))
      else out.push(T.noFile(key))
      break
    }
    case 'neofetch': out.push(neofetch(ctx)); break
    case 'skills': out.push(files['skills.txt'] as string); break
    case 'projects': out.push(t.projects.items.map((p) => `• ${p.title}${p.repo ? `  [open ${p.repo}]` : ''}`).join('\n')); break
    case 'open': {
      const p = t.projects.items.find((x) => x.repo && (x.repo === arg || x.repo.startsWith(arg) || x.title.toLowerCase().includes(arg.toLowerCase())))
      if (!arg || !p || !p.repo) { out.push(T.openUsage); break }
      const url = p.live ?? `https://github.com/adccz/${p.repo}`
      out.push(T.opening(url)); effects.push({ open: url }); break
    }
    case 'scout': case 'pathfinder': out.push(T.scout); break
    case 'guitar': case 'kytara': out.push(T.guitar); break
    case 'marvel': out.push(T.marvel); break
    case 'games': case 'hry': out.push(T.games); break
    case 'pexeso': out.push(T.pexeso); effects.push('pexeso'); break
    case 'hyperdrive': case 'warp': effects.push('hyperdrive'); break
    case 'theme': effects.push('theme'); out.push(T.theme); break
    case 'lang': effects.push('lang'); out.push(T.lang); break
    case 'date': out.push(new Date().toLocaleString(ctx.lang === 'cs' ? 'cs-CZ' : 'en-GB')); break
    case 'echo': out.push(arg); break
    case 'history': out.push(ctx.history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`).join('\n') || '—'); break
    case 'clear': effects.push('clear'); break
    case 'exit': case 'quit': out.push(T.bye); effects.push('exit'); break
    case 'rm': out.push(T.rm); break
    case 'sudo': out.push(T.sudo); break
    case 'vim': case 'nano': case 'emacs': out.push(T.editor); break
    default: out.push(T.unknown(cmd))
  }
  return { out, effects }
}

function neofetch({ t, theme, lang }: Ctx): string {
  const art = [
    '    .---.    ',
    '   / o o \\   ',
    '  |   ‿   |  ',
    '   \\_____/   ',
    '  \\_______/  ',
    '             ',
    '             ',
  ]
  const info = [
    'olda@web',
    '--------',
    `OS: ARCHIV 1978 (${theme})`,
    `Host: FAV ZČU, Plzeň`,
    `Kernel: React 19 / Vite`,
    `Shell: bash + ${lang === 'cs' ? 'kytara' : 'guitar'}`,
    `Langs: PHP, JS, Java, C#, Python, C`,
  ]
  return art.map((a, i) => `${a}${info[i] ?? ''}`).join('\n') + '\n\n' + t.terminal.neofetch
}
