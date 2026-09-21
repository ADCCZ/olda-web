import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Vercel serverless funkce: /api/github
 * Stáhne veřejná repa + rozpad jazyků, ořeže je na to, co web potřebuje,
 * a nechá to hodinu v CDN cache (s-maxage). Díky tomu se GitHub API volá
 * párkrát denně, ne při každé návštěvě.
 *
 * Volitelně: nastav v Vercelu env proměnnou GITHUB_TOKEN (fine-grained,
 * jen "public repos: read") a rate limit přestane existovat úplně.
 */
const USER = 'adccz'
const FIELDS = ['name', 'html_url', 'description', 'language', 'stargazers_count', 'updated_at', 'pushed_at', 'homepage', 'fork', 'topics'] as const

type Repo = Record<(typeof FIELDS)[number], unknown> & { languages?: Record<string, number> }

async function gh(path: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'olda-web' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const r = await fetch(`https://api.github.com${path}`, { headers })
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${path}`)
  return r.json()
}

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const raw = (await gh(`/users/${USER}/repos?per_page=100&sort=updated`)) as Record<string, unknown>[]
    const repos: Repo[] = []
    for (const r of raw) {
      if (r.fork) continue
      const slim = Object.fromEntries(FIELDS.map((f) => [f, r[f]])) as Repo
      try { slim.languages = (await gh(`/repos/${USER}/${r.name}/languages`)) as Record<string, number> } catch { /* bez rozpadu */ }
      repos.push(slim)
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.end(JSON.stringify({ repos, fetchedAt: new Date().toISOString() }))
  } catch (e) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }))
  }
}
