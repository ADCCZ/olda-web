// Vypíše česká data webu (src/data/content.ts) jako JSON pro generátor životopisu (scripts/cv.py).
//
//     node scripts/export-content.mjs > content.json
//
// Node 22 umí TypeScript bez překladu (odstraní typy). Obrázky importované v content.ts
// (fotka) se místo načtení nahradí absolutní cestou k souboru. Funkce z textů JSON vynechá.
import { register } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

register('data:text/javascript,' + encodeURIComponent(`
export async function load(url, ctx, next) {
  if (/\\.(webp|png|jpe?g|svg|gif)$/.test(url)) {
    return { format: 'module', source: 'export default ' + JSON.stringify(new URL(url).pathname), shortCircuit: true }
  }
  return next(url, ctx)
}`))

const root = fileURLToPath(new URL('..', import.meta.url))
const { content } = await import(pathToFileURL(root + 'src/data/content.ts').href)
process.stdout.write(JSON.stringify(content.cs))
