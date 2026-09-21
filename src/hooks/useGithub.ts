import { useEffect, useState } from 'react'
import snapshot from '../data/repos-snapshot.json'

export type Repo = {
  name: string
  html_url: string
  description?: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
  pushed_at?: string
  homepage: string | null
  fork: boolean
  topics?: string[]
  /** bytes per language (jen přes /api/github) */
  languages?: Record<string, number>
}

export type Source = 'api' | 'github' | 'snapshot'

/**
 * Pořadí pokusů:
 *  1. /api/github      – vlastní Vercel funkce s cache (viz api/github.ts)
 *  2. api.github.com   – přímo, bez rozpadu jazyků (60 požadavků/h na IP)
 *  3. snapshot         – src/data/repos-snapshot.json
 */
export function useGithubRepos(user: string) {
  const [repos, setRepos] = useState<Repo[]>(snapshot as Repo[])
  const [source, setSource] = useState<Source>('snapshot')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    const ok = (r: Response) => (r.ok ? r.json() : Promise.reject(r.status))

    fetch('/api/github', { signal: ctrl.signal })
      .then(ok)
      .then((d: { repos: Repo[] }) => {
        if (!Array.isArray(d.repos) || !d.repos.length) throw new Error('empty')
        setRepos(d.repos); setSource('api')
      })
      .catch(() =>
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, {
          signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' },
        })
          .then(ok)
          .then((d: Repo[]) => {
            if (!Array.isArray(d) || !d.length) throw new Error('empty')
            setRepos(d.filter((r) => !r.fork)); setSource('github')
          })
          .catch(() => { /* zůstane snapshot */ }),
      )
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false) })
    return () => ctrl.abort()
  }, [user])

  return { repos, source, loading }
}
