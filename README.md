# Oldřich Švehla, životopisný web

Hravý osobní web / CV stylizovaný jako **úřad ze 70. let, který spravuje čas**:
spisy s razítky, větvící se časové linie, obrazovky s fosforem a průvodkyně Složka.
Čeština výchozí, přepínač na angličtinu. Tmavé téma = hluboká zelená se zlatem
(obrazovky svítí zeleně), světlé = papírový spis (zažloutlý papír, pálená oranžová,
obrazovky jantarové).

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Vitest · Vercel Functions

## Spuštění

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # jednotkové testy (Pexeso, terminál)
npm run lint
npm run build      # produkční build do dist/
```

## Nasazení na Vercel

1. Nahraj projekt do repozitáře na GitHubu (`git init`, commit, push).
2. Na https://vercel.com → **Add New… → Project** → vyber repozitář.
3. Vercel Vite pozná sám (Build: `npm run build`, Output: `dist`). Klikni **Deploy**.
4. Hotovo — web běží na `<název>.vercel.app`. Každý push do `main` = nový deploy.

**Volitelné:** v nastavení projektu na Vercelu přidej env proměnnou `GITHUB_TOKEN`
(fine‑grained token, stačí *Public repositories → read*). Funkce `/api/github` ho použije
a GitHub rate limit přestane existovat. Bez tokenu to funguje taky — odpovědi se cachují
hodinu v CDN, takže se GitHub volá jen párkrát denně.

Po nasazení uprav doménu v `public/robots.txt` a `public/sitemap.xml`.

## Jak to funguje

```
src/
  data/content.ts          ← VŠECHEN TEXT (cs + en). Projekty, dovednosti, timeline…
  data/repos-snapshot.json ← záloha, když GitHub API nejede
  components/              ← sekce webu + Guitar, Pexeso, Terminal, Effects
  lib/synth.ts             ← Karplus–Strong syntéza kytary (žádné samply)
  lib/pexeso.ts            ← čistá herní logika (testovaná)
  lib/terminal.ts          ← interpret příkazů terminálu (testovaný)
  hooks/useGithub.ts       ← /api/github → api.github.com → snapshot
  fonts/                   ← self‑hosted Michroma, IBM Plex Sans, Courier Prime (subset Latin Ext)
  components/Branches.tsx  ← hero: větvící se časová linie + služební monitor (Avatar.tsx)
  components/Guide.tsx     ← Složka: průvodkyně (komentáře k sekcím, prohlídka, reakce na easter eggy)
api/github.ts              ← Vercel funkce: repa + rozpad jazyků, CDN cache 1 h
.github/workflows/ci.yml   ← lint + testy + build při každém pushi
```

Repozitáře se načítají živě. Nové repo se v rejstříku objeví automaticky (s popiskem
z GitHubu); pokud mu chceš dát vlastní text a tagy, přidej ho do `projects.items`
v `content.ts` se stejným `repo` názvem. `featured: true` mu dá výraznější nadpis.

Web je responzivní: pod 1024 px se navigace schová do menu, rejstřík projektů,
inventář technologií i časová osa se skládají pod sebe, větve v hlavičce mají větší
plochu pro prst a tlačítka jsou na dotykových zařízeních vyšší.

## Co upravit

| Chci změnit… | Kde |
| --- | --- |
| jméno, přezdívka, lokalita | `src/data/content.ts` → `shared` (`fullName`, `firstName`, `lastName`, `nickname`, `location`) |
| text, projekty, dovednosti, vzdělání, praxe | `src/data/content.ts` |
| e‑mail, LinkedIn | `content.ts` → `shared.email`, `shared.linkedin` (tlačítka se pak aktivují) |
| CV ke stažení | `python3 scripts/cv.py` (fakta bere z `content.ts`, ve skriptu jsou jen zhuštěné texty v bloku `PDF`; potřebuje Node 22+ a `pip install reportlab pillow svglib`); vytvoří hravé `public/cv.pdf` i strohé `public/cv-plain.pdf` se stejným obsahem |
| fotka na monitoru místo kresleného obličeje | dej soubor do `public/` a nastav `shared.photo: '/photo.jpg'` v `content.ts` (obarví se do fosforu) |
| náhledový obrázek pro sdílení | nahraď `public/og.png` (1200×630) |
| barvy, fonty | `src/index.css` (proměnné v `:root`) |
| avatar | `src/components/Avatar.tsx` (SVG) |
| větve časové linie | `content.ts` → `hero.orbit`, geometrie v `components/Branches.tsx` (`LANES`) |
| razítka, dřevěná lišta, CRT | `src/index.css` → `.stamp`, `.wood`, `.crt` |
| co říká Složka | `content.ts` → `guide` (uvítání, tipy, komentáře k sekcím, kroky prohlídky) |
| barvy obrazovek (terminál, boot, monitor) | `src/index.css` → `--crt-*` |
| akordy, průběhy a rytmy kytary | `src/lib/guitar.ts` → `CHORDS`, `PROGRESSIONS`, `PATTERNS` |
| seznam her u „Videohry“ (pořadí podle hodin, hodiny se nezobrazují) | `src/data/games.ts` → `GAMES`, `UPDATED` |
| karty v Pexesu | `src/lib/pexeso.ts` → `TECH_PAIRS` |

## Struktura životopisu

Sekce jdou v pořadí, které doporučují personalisté (např. Indeed): kontakt, profil,
vzdělání, praxe, projekty, technické dovednosti, měkké dovednosti. Stejně je poskládané
i `public/cv.pdf`.

PDF životopis se generuje z dat webu: `scripts/export-content.mjs` načte `src/data/content.ts`
a `scripts/cv.py` z nich vezme jméno s titulem, roli, kontakty (`shared.email`, `shared.phone`,
`shared.linkedin`, `shared.site`), fotku, vzdělání, praxi, kurzy (`certs`), technologie podle
úrovní, plány, měkké dovednosti a zájmy. Ve skriptu (blok `PDF`) zůstávají jen zhuštěné texty,
které se musí vejít na stránku: profil, body praxe, výběr projektů a krátké popisy měkkých
dovedností, plus jazyky. Po úpravě webu stačí spustit `python3 scripts/cv.py`. Obě PDF mají
stejný obsah i pořadí; hravé má styl webu (spis, razítka, časová linie, fotka se sponkou),
strohé je bez grafiky pro portály, které životopisy čtou strojově. Odkazy v obou jsou klikací.

## Portál a razítka

Klik na větev, odkaz v navigaci nebo krok prohlídky otevře **dveře světla**: z místa
kliknutí vyrostou oranžové dveře stojící v prostoru (CSS perspektiva, natočené, s boční
stěnou), jejich plocha je poloprůhledná, takže cílová sekce prosvítá dřív, než jimi
projdete; pak se dveře přiblíží až k oku a jejich lem projde okraji obrazovky. Barvy
portálu jsou v `.portal` (`--p-core`, `--p-mid`, `--p-rim`). Cílová sekce má chvíli nápis
„příchod větví“. Při zapnutém
`prefers-reduced-motion` je to jen skok. Kód: `src/components/Portal.tsx`, volání
`portalGo('#about', x, y)` z `src/lib/portal.ts`.

**Razítka** (`src/lib/stamps.ts`): za každou objevenou věc jedno, celkem 8 (terminál,
variant, kytara, dohrané Pexeso, ztráta signálu na monitoru, Konami, prohlídka, přepnutí
tématu). Počítadlo je ve stavové liště, kliknutím se otevře sbírka s nápovědou k tomu, co
chybí. Ukládají se v prohlížeči, Složka nové razítko ohlásí.

## Hala archivu

Ilustrace pod hlavičkou (`src/components/Scene.tsx`): řady kartoték, lampy s kužely
světla, potrubní pošta s kapslí, žebřík a hodiny. Tři vrstvy se při scrollu a pohybu myši
posouvají různě rychle. V tmavém tématu svítí lampy zeleně, ve světlém jantarově.

## Složka

Průvodkyně vpravo dole. Po načtení se představí; komentuje sekce, ke kterým doscrollujete
(každou jen jednou za sezení), „Proveď mě“ spustí prohlídku po sekcích, „Další tip“ vytahuje
nápovědy k easter eggům. Zorničky sledují kurzor. Křížkem ji schováš (pamatuje si to),
zpět ji zavolá odkaz v patičce nebo příkaz `guide` v terminálu. Ozve se i po Konami kódu
a při spuštění Pexesa.

## Easter eggy

- `~` (nebo `` ` ``) otevře jantarový terminál — `help`, `variant`, `timeline`, `prune`, `ls -a`, `cat .secret`, `neofetch`, `open campmaster`, `pexeso`, `sudo`, `vim`… Tab doplňuje, šipky procházejí historii
- Konami kód `↑↑↓↓←→←→BA` (nebo příkaz `hyperdrive`) spustí „odchylku“ – po obrazovce se rozvětví časové linie
- Stavová lišta počítá, pokolikáté jsi tu (smyčka #n)
- Planeta **Hry** a tlačítko **Zahrát si** u Pexesa spustí hru
- Kytara v sekci O mně opravdu hraje (klik, přejetí, klávesy 1–6, mezerník = brnknutí) a umí doprovod – předvolby i vlastní průběh akordů a rytmus, který si prohlížeč zapamatuje
- Klikání na monitor (5× = ztráta signálu)
- Hodiny v navigaci ukazují, jak daleko na stránce jsi
- Zpráva v konzoli prohlížeče; titulek karty se změní, když z ní odejdeš
- Boot sekvence (zelený terminál) při každém načtení, klik nebo klávesa ji přeskočí
- Ctrl+P vytiskne čistý životopis bez chromu

## Jednosouborový build (náhled / offline)

```bash
SINGLEFILE=1 npm run build   # dist/index.html obsahuje vše včetně fontů
```
