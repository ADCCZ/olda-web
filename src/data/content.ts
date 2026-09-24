// ============================================================
//  VŠECHEN TEXT WEBU JE TADY. Chceš něco změnit? Edituj tento soubor.
//  cs = čeština (výchozí), en = angličtina
// ============================================================

import photo from '../assets/photo.webp'

export type Lang = 'cs' | 'en'

export type Project = {
  /** název repozitáře na GitHubu (adccz/<repo>), nebo null u projektů mimo GitHub */
  repo: string | null
  title: string
  desc: string
  tags: string[]
  /** živá ukázka */
  live?: string
  /** zvýraznit jako hlavní projekt */
  featured?: boolean
}

export type SkillGroup = { name: string; items: string[] }

export type OrbitItem = { id: string; label: string; target: string; action?: 'pexeso' }

export type TimelineItem = {
  period: string
  title: string
  place: string
  note?: string
  /** ještě neproběhlo */
  planned?: boolean
}

const GITHUB = 'https://github.com/adccz'

const shared = {
  fullName: 'Oldřich Jan Švehla',
  firstName: 'Oldřich',
  middleName: 'Jan',
  lastName: 'Švehla',
  nickname: 'Olda',
  academicTitle: 'Bc.',
  /** logotyp v horní liště */
  brand: 'OlďJaŠ',
  github: GITHUB,
  githubUser: 'adccz',
  /** doplň, až budeš mít: 'mailto:...', 'https://linkedin.com/in/...' */
  email: '' as string,
  linkedin: '' as string,
  /** soubory v /public; generuje je scripts/cv.py */
  cvFile: '/cv.pdf',
  cvPlainFile: '/cv-plain.pdf',
  /** fotka na obrazovce monitoru (výřez bez pozadí, obarví se barvou obrazovky); prázdné = kreslený obličej */
  photo: photo as string,
  /** kontaktní údaje; prázdné se nezobrazí */
  phone: '' as string,
  location: 'Plzeň, Česko',
  /** certifikáty a kurzy; prázdné pole = sekce se nezobrazí */
  certs: [] as { name: string; org: string; year: string }[],
}

const cs = {
  ...shared,
  meta: { title: 'Oldřich Švehla, junior full-stack vývojář' },
  nav: {
    about: 'Profil',
    education: 'Vzdělání',
    experience: 'Praxe',
    projects: 'Projekty',
    skills: 'Technologie',
    leadership: 'Dovednosti',
    contact: 'Kontakt',
    cv: 'Stáhnout CV',
    theme: 'Přepnout téma',
    lang: 'EN',
  },
  /** úvodní terminál při načtení: "$ " na začátku = příkaz psaný znak po znaku, {bar} = ukazatel průběhu */
  boot: [
    '$ archiv --boot',
    'ARCHIV ČASOVÝCH LINIÍ · terminál 07',
    'kontrola hlavní linie ........ v pořádku',
    'hledám odchylky .............. 1 nalezena',
    'načítám spis ................. {bar}',
    '$ open varianta/svehla-oldrich',
  ],
  hero: {
    hello: 'spis varianty',
    stamp: 'evidováno',
    plate: 'VARIANTA 01',
    pulse: 'přítomnost',
    loop: 'smyčka',
    name: 'Oldřich Švehla',
    tagline:
      'Junior full-stack vývojář z Plzně, pro přátele Olda. Letos jsem dokončil bakaláře na FAV ZČU, vedu oddíl v Klubu Pathfinder a hledám stáž nebo částečný úvazek.',
    role: 'junior full-stack vývojář, Plzeň',
    ctaProjects: 'Ukaž projekty',
    ctaContact: 'nebo mi napiš',
    orbitHint: 'Každá větev je něco, co běží dál. Klikni na ni.',
    orbit: [
      { id: 'code', label: 'Kód', target: '#projects' },
      { id: 'scout', label: 'Pathfinder', target: '#experience' },
      { id: 'guitar', label: 'Kytara', target: '#about' },
      { id: 'games', label: 'Hry', target: '#about', action: 'pexeso' },
      { id: 'school', label: 'FAV ZČU', target: '#education' },
    ] as OrbitItem[],
    readout: ['ARCHIV OTEVŘEN', 'PLZEŇ, CZ', '~ terminál'],
    stamps: 'razítka',
    arrived: 'příchod větví',
  },
  about: {
    title: 'Profil',
    lead:
      'Junior full-stack vývojář. Absolvent bakalářského studia informatiky na FAV ZČU se zaměřením na vývoj webových aplikací a softwarové inženýrství.',
    body: [
      'Mám praktické zkušenosti s návrhem backendové i frontendové architektury, integrací databází a prací s otevřenými daty. Nejčastěji píšu v PHP (Nette), JavaScriptu (React, Vue) a Javě, k tomu MySQL, Docker a Linux. Při vývoji pracuju s\u00a0AI asistentem Claude (Claude Code), se kterým vznikl i\u00a0tenhle web.',
      'Vedle školy vedu oddíl v Klubu Pathfinder. Plánuju tábory a vícedenní akce pro desítky lidí a mám na starosti vedoucí v regionu. Ve volném čase hraju na kytaru, vařím, koukám na komiksové filmy a hraju hry.',
      'Od podzimu 2026 pokračuju v navazujícím studiu Softwarové inženýrství (SWIS). Hledám stáž nebo částečný úvazek.',
    ],
    interestsTitle: 'Mimo kód',
    interests: [
      // action: 'guitar' = u položky je tlačítko Hrát, které otevře kytaru uprostřed obrazovky
      { icon: 'guitar', label: 'Kytara', note: 'akustická, hlavně u ohně', action: 'guitar' },
      { icon: 'scout', label: 'Klub Pathfinder', note: 'vedoucí oddílu, tábory, expedice' },
      { icon: 'marvel', label: 'Komiksové filmy', note: 'sleduju v pořadí, ve kterém vyšly' },
      { icon: 'games', label: 'Videohry', note: '' },
      { icon: 'cook', label: 'Vaření', note: 'doma i pro tábor' },
      { icon: 'mountain', label: 'Hory a outdoor', note: 'pěšky, se stanem' },
    ],
  },
  projects: {
    title: 'Rejstřík projektů',
    lead: 'Seznam se plní z mého GitHubu. Popisky jsem doplnil ručně.',
    cols: { project: 'Projekt', tech: 'Technologie', updated: 'Poslední změna', links: 'Odkazy' },
    liveLabel: 'Živá ukázka',
    repoLabel: 'Repozitář',
    updated: 'Aktualizováno',
    noRepo: 'Mimo GitHub',
    offline: 'GitHub teď neodpovídá, seznam je z poslední zálohy.',
    sourceLive: 'živě z GitHubu',
    sourceSnapshot: 'záložní snapshot',
    play: 'Zahrát si',
    items: [
      {
        repo: 'campmaster-3000',
        title: 'CampMaster 3000',
        desc: 'Interaktivní dashboard pro řízení táborové hry: editace tras na mapě, správa týmů, pravidla a bodování v reálném čase. Semestrální projekt KIV/UUR.',
        tags: ['React', 'Tailwind CSS', 'Recharts', 'Leaflet'],
        live: 'https://campmaster-3000.vercel.app',
        featured: true,
      },
      {
        repo: 'web_oblastni-stranky_jk',
        title: 'Informační a komunitní portál',
        desc: 'Full-stack řešení na míru pro oblastní web mládežnické organizace: autentizace uživatelů, registrace na akce, správa multimediálního obsahu.',
        tags: ['PHP', 'Nette', 'Latte', 'Tailwind CSS', 'MySQL'],
        featured: true,
      },
      {
        repo: null,
        title: 'Vizualizace regionálních otevřených dat',
        desc: 'Bakalářská práce. Zpracování, analýza a interaktivní vizualizace komplexních otevřených datových sad tak, aby jim rozuměl i někdo bez datové průpravy.',
        tags: ['Otevřená data', 'Vizualizace', 'Python', 'Web'],
        featured: true,
      },
      {
        repo: 'tmwmf_sem_UPS',
        title: 'Síťové Pexeso',
        desc: 'Server v čistém C s TCP a select() multiplexingem, klient v JavaFX, vlastní textový protokol. Semestrální projekt KIV/UPS pro 2–4 hráče.',
        tags: ['C', 'TCP/IP', 'JavaFX', 'Maven', 'Síťové protokoly'],
      },
      {
        repo: null,
        title: '3D grafická aplikace',
        desc: 'Interaktivní 3D prostředí v C# nad OpenTK (OpenGL): kamera, osvětlení, vlastní geometrie.',
        tags: ['C#', 'OpenTK', 'OpenGL'],
      },
      {
        repo: 'web-foodapp',
        title: 'FoodApp',
        desc: 'Webová aplikace kolem jídla a receptů postavená na PHP šablonách Twig.',
        tags: ['PHP', 'Twig'],
      },
      {
        repo: 'web-jiznikriz',
        title: 'Web Jižní kříž',
        desc: 'PHP web pro komunitu: obsah, galerie, aktuality.',
        tags: ['PHP', 'CSS', 'JavaScript'],
      },
    ] as Project[],
  },
  skills: {
    title: 'Technologie',
    lead: 'Co používám a co se chystám doučit.',
    plannedLabel: 'V plánu',
    groups: [
      { name: 'Backend', items: ['PHP (Nette)', 'C#', 'Java', 'Python', 'C', 'REST API', 'MVC architektura'] },
      { name: 'Frontend', items: ['JavaScript', 'React', 'Vue.js', 'Tailwind CSS', 'HTML5 / CSS3'] },
      { name: 'Databáze a nástroje', items: ['MySQL', 'Git', 'Docker', 'Linux CLI', 'Maven / Gradle'] },
      { name: 'Grafika a data', items: ['OpenTK / OpenGL', 'JavaFX', 'Otevřená data', 'Vizualizace dat'] },
    ] as SkillGroup[],
    planned: ['TypeScript', 'Next.js', 'PostgreSQL', 'Spring Boot', 'GitHub Actions (CI/CD)', 'Testování (JUnit, Jest)', 'Kubernetes', 'AWS / cloud'],
  },
  education: {
    title: 'Vzdělání',
    stamp: 'neořezávat',
    items: [
      { period: '2019 – 2023', title: 'Počítačová grafika a CNC technika', place: 'Střední průmyslová škola Strakonice (VOŠ, SPŠ a SOŠ řemesel a služeb)' },
      { period: '2023 – 2026', title: 'Bc. Počítačové vědy', place: 'Fakulta aplikovaných věd, ZČU v Plzni', note: 'Bakalářská práce: vizualizace regionálních otevřených dat' },
      { period: '2026 –', title: 'Ing. Softwarové inženýrství (SWIS)', place: 'Fakulta aplikovaných věd, ZČU v Plzni', note: 'Navazující studium', planned: true },
    ] as TimelineItem[],
  },
  experience: {
    title: 'Praxe',
    lead: 'Placenou praxi v IT teprve hledám. Tohle je to, co mám za sebou.',
    items: [
      {
        period: 'dlouhodobě',
        title: 'Vedoucí a oblastní koordinátor',
        org: 'Klub Pathfinder',
        bullets: [
          'Koordinace regionálních aktivit mládežnické organizace a vedení vedoucích.',
          'Kompletní plánování vícedenních akcí a táborů pro desítky účastníků: rozpočet, program, bezpečnost, zázemí.',
          'Práce s dětmi a dospívajícími, řešení nečekaných situací v terénu.',
        ],
      },
      {
        period: 'průběžně',
        title: 'Vývoj webů na zakázku',
        org: 'komunitní a spolkové weby',
        bullets: [
          'Informační a komunitní portál: full-stack řešení v Nette, Tailwind CSS a MySQL s autentizací uživatelů a registrací na akce.',
          'Správa multimediálního obsahu, nasazení a údržba.',
          'Komunikace se zadavatelem, sběr požadavků, iterace podle zpětné vazby.',
        ],
      },
      {
        period: '2021, 2022',
        title: 'Odborná praxe na střední škole',
        org: 'Automa CZ s.r.o., Strakonice · průmyslová automatizace, jednoúčelové stroje',
        bullets: [
          'Dva dvoutýdenní bloky. Montáž klimakomory pro testování displejů do aut Audi a přípravku pro kontrolu displejů Renault podle výkresů a modelu v Inventoru.',
          'Ruční dokončování strojních dílů: srážení hran, kosení děr, dořezávání závitů, leštění a broušení.',
          'Sklad a dokumentace: příjem dílů a skladová evidence, inventura se čtečkou kódů, třídění výkresové dokumentace.',
        ],
      },
    ],
  },
  certsTitle: 'Certifikáty a kurzy',
  leadership: {
    title: 'Měkké dovednosti',
    lead: 'Co jsem se naučil mimo klávesnici.',
    memo: { subject: 'Věc', where: 'Kde', period: 'Období', subjectValue: 'Organizační a měkké dovednosti', whereValue: 'Klub Pathfinder, oblastní úroveň', periodValue: 'dlouhodobě' },
    items: [
      {
        title: 'Vedení týmů a mentorství',
        desc: 'Víceleté zkušenosti s koordinací regionálních aktivit mládežnické organizace, vedením vedoucích a prací s dětmi i dospívajícími.',
      },
      {
        title: 'Projektový management a logistika',
        desc: 'Kompletní plánování vícedenních tematických akcí a táborů pro desítky účastníků: rozpočet, program, bezpečnost, zázemí.',
      },
      {
        title: 'Zodpovědnost a adaptabilita',
        desc: 'Řešení nečekaných situací a krizový management při náročných outdoorových a expedičních aktivitách.',
      },
    ],
  },
  contact: {
    title: 'Kontakt',
    stamp: 'schváleno',
    lead: 'Hledám stáž nebo částečný úvazek. Ozvi se.',
    location: 'Lokalita',
    phone: 'Telefon',
    github: 'GitHub',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    soon: 'doplním brzy',
    cv: 'Stáhnout CV (PDF)',
    cvPlain: 'strohá verze pro personální systémy',
  },
  footer: {
    made: 'Kód tohoto webu je na GitHubu.',
    skip: 'Přeskočit na obsah',
    eggs: 'Psst: zkus vlnovku.',
    guide: 'Zavolat Složku',
  },
  guitar: {
    title: 'Kytara',
    hint: 'klikni, přejeď, nebo 1–6 a mezerník',
    chords: 'Akordy',
    strings: 'Struny',
    strumDown: 'Brnknout ↓',
    strumUp: 'Brnknout ↑',
    play: 'Hrát',
  },
  pexeso: {
    title: 'Pexeso',
    lead: 'Najdi osm párů technologií. Serverová verze pro 2–4 hráče je v C + JavaFX.',
    moves: 'Tahy',
    time: 'Čas',
    card: 'Zakrytá karta',
    won: (moves: number, s: number) => `Hotovo za ${moves} tahů a ${s} s.`,
    server: 'Serverová verze',
    again: 'Znovu',
  },
  terminal: {
    title: 'ARCHIVNÍ TERMINÁL 07',
    prompt: 'archiv@olda:~$',
    help: 'Příkazy: help, whoami, variant, timeline, prune, guide, ls, cat <soubor>, neofetch, skills, projects, open <repo>, pexeso, scout, guitar, marvel, games, theme, lang, date, history, clear, exit. Tab doplňuje, šipky procházejí historii.',
    variant: 'Evidované varianty subjektu ŠVEHLA:\n  01  junior full-stack vývojář stav: aktivní\n  02  vedoucí oddílu           stav: aktivní\n  03  kytarista                stav: aktivní, občas rozladěný\n  04  hráč videoher            stav: aktivní po půlnoci\n  05  student SWIS             stav: startuje\nVšechny varianty běží souběžně. Odchylka: žádná. Zvláštnost: vaří pro padesát lidí.',
    prune: 'Žádost o ořezání zamítnuta. Tahle linie se líbí.',
    timelineCmd: '2023 ─┬─ FAV ZČU, Bc. Počítačové vědy\n      ├─ Klub Pathfinder (běží od dřívějška)\n2024 ─┼─ web-jiznikriz, web-foodapp\n2025 ─┼─ Síťové Pexeso (C + JavaFX)\n2026 ─┼─ CampMaster 3000, bakalářka, komunitní portál\n      └─ SWIS ▶ (větev se otevírá)',
    unknown: (c: string) => `příkaz nenalezen: ${c}. Zkus "help".`,
    cd: 'Bydlím v /home/olda a nikam se nestěhuju.',
    catUsage: 'použití: cat <soubor>. Soubory vypíše "ls".',
    isDir: (f: string) => `cat: ${f}: je to adresář`,
    noFile: (f: string) => `cat: ${f}: soubor neexistuje`,
    openUsage: 'použití: open <repo>. Seznam vypíše "projects".',
    opening: (u: string) => `otevírám ${u}`,
    pexeso: 'Spouštím Pexeso. Server tentokrát nepotřebuješ.',
    rm: 'Ne. Tohle jsme si už jednou vysvětlili.',
    editor: 'Editor tu nemám. Ale kdybych ho měl, byl by to Vim. Asi. Nehádejte se.',
    secret: 'Konami: ↑ ↑ ↓ ↓ ← → ← → B A. A zkus "hyperdrive".',
    neofetch: 'Uptime: od září 2023.',
    guideCmd: 'Volám Složku.',
    whoami: 'Oldřich Jan Švehla, pro přátele Olda. Junior full-stack vývojář, absolvent FAV ZČU, vedoucí v Klubu Pathfinder. Momentálně: hledám stáž.',
    scout: 'Klub Pathfinder: oddíl, tábory, expedice. Umím rozdělat oheň v dešti a rozdělit 50 dětí do týmů tak, aby se nikdo nehádal. Skoro.',
    guitar: 'E A D G H E, naladěno.',
    marvel: 'Sledovací pořadí mám seřazené chronologicky. Ano, i ty seriály. Ne, nediskutuju o tom.',
    games: 'Achievement unlocked: našel jsi terminál.',
    sudo: 'olda is not in the sudoers file. This incident will be reported. (Ale díky za pokus.)',
    theme: 'Téma přepnuto.',
    lang: 'Language switched to English.',
    bye: 'Nashle. Terminál zavřeš klávesou Esc.',
    welcome: 'Archivní terminál 07. Přístup povolen. Napiš "help".',
  },
  guide: {
    name: 'Složka',
    role: 'archivní průvodkyně',
    welcome: 'Dobrý den, já jsem Složka a vedu tenhle archiv. Chcete provést Oldovým spisem?',
    tips: [
      'Větve v hlavičce jsou klikací, každá vede na jinou část spisu.',
      'Vlnovka (~) otevře terminál. Napište "help".',
      'Kytara v Profilu opravdu hraje, stačí zmáčknout Hrát.',
      'Větev Hry spouští Pexeso. Serverovou verzi má na GitHubu, tahle běží v prohlížeči.',
      'V terminálu zkuste "variant".',
      'Zkuste kliknout na monitor. Víckrát.',
      'Ctrl+P vytiskne čistý životopis.',
      'Existuje jedna sekvence šipek, kterou tu radši neuvádím.',
    ],
    sections: {
      about: 'Souhrn spisu. Vede oddíl a k tomu dostuduje inženýra.',
      education: 'Vzdělání. Bakalář hotový, inženýr se otevírá.',
      experience: 'Praxe. Oddíl, tábory a jeden web na zakázku.',
      projects: 'Rejstřík se plní z GitHubu. Nové repo se v něm objeví samo.',
      skills: 'Inventář technologií. Dole je to, co se teprve chystá doučit.',
      leadership: 'Služební záznam o měkkých dovednostech.',
      contact: 'Pokud jste dočetli až sem, napište mu. Razítko už tam je.',
    },
    tour: [
      { target: '#top', text: 'Hlavička: Oldřich Švehla, pro přátele Olda, varianta 01. Větve jsou věci, které běží souběžně.' },
      { target: '#about', text: 'Kdo to je: junior full-stack vývojář, absolvent FAV ZČU, vedoucí v Klubu Pathfinder. U kytary vpravo je tlačítko Hrát.' },
      { target: '#education', text: 'Vzdělání: bakalář 2023 až 2026, od podzimu navazující SWIS.' },
      { target: '#experience', text: 'Praxe: vedení v Klubu Pathfinder a vývoj webového portálu na zakázku.' },
      { target: '#projects', text: 'Rejstřík projektů. Data se načítají z GitHubu.' },
      { target: '#skills', text: 'Technologie, které používá, a co se chystá doučit.' },
      { target: '#leadership', text: 'Měkké dovednosti: vedení lidí, plánování, klid v terénu.' },
      { target: '#contact', text: 'A tady mu napíšete. Konec prohlídky, děkuji za návštěvu.' },
    ],
    stamp: (name: string) => `Nové razítko: ${name}.`,
    allStamps: 'Máte všechna razítka. Archiv vám děkuje.',
    buttons: { next: 'Další tip', tour: 'Proveď mě', continue: 'Pokračovat', done: 'Hotovo', hide: 'Schovat', call: 'Zavolat Složku' },
    konami: 'To jste vidět neměli. Nechám to tak.',
    pexeso: 'Pexeso. Držím palce.',
    bye: 'Dobře, schovám se. V terminálu mě vyvolá "guide".',
    hello: 'Ano? Tady Složka.',
  },
  stampsList: {
    title: 'Sbírka razítek',
    lead: 'Za každou objevenou věc jedno razítko. Ukládají se v prohlížeči.',
    items: {
      terminal: { name: 'Terminál', hint: 'otevři archivní terminál' },
      variant: { name: 'Variant', hint: 'zeptej se terminálu na varianty' },
      guitar: { name: 'Kytara', hint: 'brnkni' },
      pexeso: { name: 'Pexeso', hint: 'dohraj Pexeso' },
      monitor: { name: 'Signál', hint: 'zkoušej monitor, dokud nevypadne' },
      konami: { name: 'Odchylka', hint: 'sekvence šipek' },
      tour: { name: 'Prohlídka', hint: 'nech se provést' },
      theme: { name: 'Den a noc', hint: 'přepni téma' },
    },
  },
  eggs: {
    konami: 'ODCHYLKA DETEKOVÁNA. Linie se větví. Nechte to být.',
    avatar: ['Ahoj.', 'Ještě jednou?', 'Lechtá to.', 'Fajn, tak jo.', 'Ztráta signálu. Moment.'],
    tabTitle: 'Spis zůstal otevřený… ← olda',
    console: `
  ┌───────────────────────────────┐
  │  Ahoj, zvědavče.              │
  │  Zdroják: github.com/adccz    │
  │  Zkus ~ nebo Konami kód.      │
  └───────────────────────────────┘
`,
  },
}

const en: typeof cs = {
  ...shared,
  meta: { title: 'Oldřich Švehla, junior full-stack developer' },
  nav: {
    about: 'Profile',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Technologies',
    leadership: 'Skills',
    contact: 'Contact',
    cv: 'Download CV',
    theme: 'Toggle theme',
    lang: 'CS',
  },
  boot: [
    '$ archive --boot',
    'TIMELINE ARCHIVE · terminal 07',
    'checking main line ........... nominal',
    'scanning for deviations ...... 1 found',
    'loading file ................. {bar}',
    '$ open variant/svehla-oldrich',
  ],
  hero: {
    hello: 'variant file',
    stamp: 'on record',
    plate: 'VARIANT 01',
    pulse: 'present',
    loop: 'loop',
    name: 'Oldřich Švehla',
    tagline:
      "Junior full-stack developer from Pilsen, Olda to friends. I finished my bachelor's at FAV ZČU this year, lead a troop in Klub Pathfinder, and I'm looking for an internship or part-time role.",
    role: 'junior full-stack developer, Pilsen',
    ctaProjects: 'See projects',
    ctaContact: 'or write to me',
    orbitHint: 'Every branch is something that keeps running. Click one.',
    orbit: [
      { id: 'code', label: 'Code', target: '#projects' },
      { id: 'scout', label: 'Pathfinder', target: '#experience' },
      { id: 'guitar', label: 'Guitar', target: '#about' },
      { id: 'games', label: 'Games', target: '#about', action: 'pexeso' },
      { id: 'school', label: 'FAV ZČU', target: '#education' },
    ],
    readout: ['ARCHIVE OPEN', 'PILSEN, CZ', '~ terminal'],
    stamps: 'stamps',
    arrived: 'arrived via branch',
  },
  about: {
    title: 'Profile',
    lead:
      "Junior full-stack developer. Bachelor's graduate in Computer Science at FAV ZČU (University of West Bohemia), focused on web application development and software engineering.",
    body: [
      'I have hands-on experience designing backend and frontend architecture, integrating databases and working with open data. I mostly write PHP (Nette), JavaScript (React, Vue) and Java, with MySQL, Docker and Linux around it. I work with the AI assistant Claude (Claude Code); this website was built with it too.',
      'Alongside school I lead a troop in Klub Pathfinder: I plan camps and multi-day events for dozens of people and look after the leaders in our region. In my free time I play guitar, cook, watch comic-book films and play games.',
      "From autumn 2026 I continue with the Software Engineering (SWIS) master's. I'm looking for an internship or part-time role.",
    ],
    interestsTitle: 'Beyond code',
    interests: [
      { icon: 'guitar', label: 'Guitar', note: 'acoustic, mostly by the fire', action: 'guitar' },
      { icon: 'scout', label: 'Klub Pathfinder', note: 'troop leader, camps, expeditions' },
      { icon: 'marvel', label: 'Comic-book films', note: 'in release order' },
      { icon: 'games', label: 'Video games', note: '' },
      { icon: 'cook', label: 'Cooking', note: 'at home and for camp' },
      { icon: 'mountain', label: 'Mountains and outdoors', note: 'on foot, with a tent' },
    ],
  },
  projects: {
    title: 'Project register',
    lead: 'The list fills from my GitHub. Descriptions are written by hand.',
    cols: { project: 'Project', tech: 'Technologies', updated: 'Last change', links: 'Links' },
    liveLabel: 'Live demo',
    repoLabel: 'Repository',
    updated: 'Updated',
    noRepo: 'Off GitHub',
    offline: 'GitHub is not responding right now; this list is from the last backup.',
    sourceLive: 'live from GitHub',
    sourceSnapshot: 'fallback snapshot',
    play: 'Play',
    items: [
      {
        repo: 'campmaster-3000',
        title: 'CampMaster 3000',
        desc: 'Interactive dashboard for running a camp-wide game: route editing on a map, team management, rules and real-time scoring. Semester project for KIV/UUR.',
        tags: ['React', 'Tailwind CSS', 'Recharts', 'Leaflet'],
        live: 'https://campmaster-3000.vercel.app',
        featured: true,
      },
      {
        repo: 'web_oblastni-stranky_jk',
        title: 'Community information portal',
        desc: "Custom full-stack solution for a youth organisation's regional site: user authentication, event registration, multimedia content management.",
        tags: ['PHP', 'Nette', 'Latte', 'Tailwind CSS', 'MySQL'],
        featured: true,
      },
      {
        repo: null,
        title: 'Regional open-data visualisation',
        desc: "Bachelor's thesis. Processing, analysis and interactive visualisation of complex open datasets so that people without a data background can read them.",
        tags: ['Open data', 'Visualisation', 'Python', 'Web'],
        featured: true,
      },
      {
        repo: 'tmwmf_sem_UPS',
        title: 'Networked Memory game',
        desc: 'Server in pure C with TCP and select() multiplexing, JavaFX client, custom text protocol. Semester project for KIV/UPS, 2–4 players.',
        tags: ['C', 'TCP/IP', 'JavaFX', 'Maven', 'Network protocols'],
      },
      {
        repo: null,
        title: '3D graphics application',
        desc: 'Interactive 3D environment in C# on top of OpenTK (OpenGL): camera, lighting, custom geometry.',
        tags: ['C#', 'OpenTK', 'OpenGL'],
      },
      {
        repo: 'web-foodapp',
        title: 'FoodApp',
        desc: 'Web application around food and recipes built on PHP with Twig templates.',
        tags: ['PHP', 'Twig'],
      },
      {
        repo: 'web-jiznikriz',
        title: 'Jižní kříž website',
        desc: 'PHP community website: content, gallery, news.',
        tags: ['PHP', 'CSS', 'JavaScript'],
      },
    ],
  },
  skills: {
    title: 'Technologies',
    lead: 'What I use and what I plan to learn next.',
    plannedLabel: 'Planned',
    groups: [
      { name: 'Backend', items: ['PHP (Nette)', 'C#', 'Java', 'Python', 'C', 'REST API', 'MVC architecture'] },
      { name: 'Frontend', items: ['JavaScript', 'React', 'Vue.js', 'Tailwind CSS', 'HTML5 / CSS3'] },
      { name: 'Databases & tools', items: ['MySQL', 'Git', 'Docker', 'Linux CLI', 'Maven / Gradle'] },
      { name: 'Graphics & data', items: ['OpenTK / OpenGL', 'JavaFX', 'Open data', 'Data visualisation'] },
    ],
    planned: ['TypeScript', 'Next.js', 'PostgreSQL', 'Spring Boot', 'GitHub Actions (CI/CD)', 'Testing (JUnit, Jest)', 'Kubernetes', 'AWS / cloud'],
  },
  education: {
    title: 'Education',
    stamp: 'do not prune',
    items: [
      { period: '2019 – 2023', title: 'Computer Graphics and CNC Technology', place: 'Secondary Technical School (SPŠ), Strakonice' },
      { period: '2023 – 2026', title: 'BSc Computer Science', place: 'Faculty of Applied Sciences, University of West Bohemia, Pilsen', note: 'Thesis: regional open-data visualisation' },
      { period: '2026 –', title: 'MSc Software Engineering (SWIS)', place: 'Faculty of Applied Sciences, University of West Bohemia, Pilsen', note: "Master's programme", planned: true },
    ],
  },
  experience: {
    title: 'Experience',
    lead: "I'm still looking for my first paid IT role. This is what I have behind me.",
    items: [
      {
        period: 'ongoing',
        title: 'Leader and regional coordinator',
        org: 'Klub Pathfinder',
        bullets: [
          "Coordinating a youth organisation's regional activities and leading its leaders.",
          'End-to-end planning of multi-day events and camps for dozens of participants: budget, programme, safety, facilities.',
          'Working with children and teenagers, handling unexpected situations in the field.',
        ],
      },
      {
        period: 'ongoing',
        title: 'Commissioned web development',
        org: 'community and club websites',
        bullets: [
          'Community information portal: full-stack solution in Nette, Tailwind CSS and MySQL with user authentication and event registration.',
          'Multimedia content management, deployment and maintenance.',
          'Working with the client: gathering requirements, iterating on feedback.',
        ],
      },
      {
        period: '2021, 2022',
        title: 'Secondary school work placement',
        org: 'Automa CZ s.r.o., Strakonice · industrial automation, special-purpose machines',
        bullets: [
          'Two two-week placements. Assembling a climate chamber for testing Audi car displays and a test fixture for Renault displays from drawings and an Inventor model.',
          'Manual finishing of machined parts: deburring, chamfering holes, cutting threads, polishing and grinding.',
          'Warehouse and documentation: receiving parts and keeping stock records, stock-taking with a barcode scanner, sorting technical drawings.',
        ],
      },
    ],
  },
  certsTitle: 'Certificates and courses',
  leadership: {
    title: 'Soft skills',
    lead: 'What I learned away from the keyboard.',
    memo: { subject: 'Subject', where: 'Where', period: 'Period', subjectValue: 'Organisational and soft skills', whereValue: 'Klub Pathfinder, regional level', periodValue: 'ongoing' },
    items: [
      {
        title: 'Team leadership & mentoring',
        desc: "Years of coordinating a youth organisation's regional activities, leading leaders, and working with children and teenagers.",
      },
      {
        title: 'Project management & logistics',
        desc: 'End-to-end planning of multi-day themed events and camps for dozens of participants: budget, programme, safety, facilities.',
      },
      {
        title: 'Responsibility & adaptability',
        desc: 'Handling unexpected situations and crisis management during demanding outdoor and expedition activities.',
      },
    ],
  },
  contact: {
    title: 'Contact',
    stamp: 'approved',
    lead: "I'm looking for an internship or part-time role. Get in touch.",
    location: 'Location',
    phone: 'Phone',
    github: 'GitHub',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    soon: 'coming soon',
    cv: 'Download CV (PDF)',
    cvPlain: 'plain version for applicant tracking systems',
  },
  footer: {
    made: 'The code of this site is on GitHub.',
    skip: 'Skip to content',
    eggs: 'Psst: try the tilde.',
    guide: 'Call Složka',
  },
  guitar: {
    title: 'Guitar',
    hint: 'click, drag across, or keys 1–6 and space',
    chords: 'Chords',
    strings: 'Strings',
    strumDown: 'Strum ↓',
    strumUp: 'Strum ↑',
    play: 'Play',
  },
  pexeso: {
    title: 'Memory game',
    lead: 'Find eight pairs of technologies. The 2–4 player server version is in C + JavaFX.',
    moves: 'Moves',
    time: 'Time',
    card: 'Face-down card',
    won: (moves: number, s: number) => `Done in ${moves} moves and ${s} s.`,
    server: 'Server version',
    again: 'Again',
  },
  terminal: {
    title: 'ARCHIVE TERMINAL 07',
    prompt: 'archive@olda:~$',
    help: 'Commands: help, whoami, variant, timeline, prune, guide, ls, cat <file>, neofetch, skills, projects, open <repo>, pexeso, scout, guitar, marvel, games, theme, lang, date, history, clear, exit. Tab completes, arrows walk history.',
    variant: 'Variants on record for subject ŠVEHLA:\n  01  junior full-stack developer status: active\n  02  troop leader             status: active\n  03  guitarist                status: active, occasionally out of tune\n  04  gamer                    status: active after midnight\n  05  SWIS student             status: starting\nAll variants run concurrently. Deviation: none. Notable: cooks for fifty people.',
    prune: 'Pruning request denied. We like this line.',
    timelineCmd: '2023 ─┬─ FAV ZČU, BSc Computer Science\n      ├─ Klub Pathfinder (running since before)\n2024 ─┼─ web-jiznikriz, web-foodapp\n2025 ─┼─ Networked Memory game (C + JavaFX)\n2026 ─┼─ CampMaster 3000, thesis, community portal\n      └─ SWIS ▶ (branch opening)',
    unknown: (c: string) => `command not found: ${c}. Try "help".`,
    cd: "I live in /home/olda and I'm not moving.",
    catUsage: 'usage: cat <file>. "ls" lists the files.',
    isDir: (f: string) => `cat: ${f}: is a directory`,
    noFile: (f: string) => `cat: ${f}: no such file`,
    openUsage: 'usage: open <repo>. "projects" lists them.',
    opening: (u: string) => `opening ${u}`,
    pexeso: 'Starting the memory game. No server needed this time.',
    rm: 'No. We have been through this.',
    editor: "No editor here. If there were, it would be Vim. Probably. Don't start.",
    secret: 'Konami: ↑ ↑ ↓ ↓ ← → ← → B A. Also try "hyperdrive".',
    neofetch: 'Uptime: since September 2023.',
    guideCmd: 'Calling Složka.',
    whoami: 'Oldřich Jan Švehla, Olda to friends. Junior full-stack developer, FAV ZČU graduate, leader in Klub Pathfinder. Currently: looking for an internship.',
    scout: 'Klub Pathfinder: troop, camps, expeditions. I can light a fire in the rain and split 50 kids into teams without a single argument. Almost.',
    guitar: 'E A D G B E, tuned.',
    marvel: 'My watch order is chronological. Yes, the series too. No, this is not up for debate.',
    games: 'Achievement unlocked: you found the terminal.',
    sudo: 'olda is not in the sudoers file. This incident will be reported. (Nice try, though.)',
    theme: 'Theme toggled.',
    lang: 'Jazyk přepnut na češtinu.',
    bye: 'Bye. Close the terminal with Esc.',
    welcome: 'Archive terminal 07. Access granted. Type "help".',
  },
  guide: {
    name: 'Složka',
    role: 'archive guide',
    welcome: "Hello, I'm Složka (it means \"the folder\") and I keep this archive. Shall I walk you through Olda's file?",
    tips: [
      'The branches in the header are clickable, each leads to a part of the file.',
      'The tilde (~) opens the terminal. Type "help".',
      'The guitar in the Profile really plays, just press Play.',
      'The Games branch starts the memory game. The server version is on GitHub; this one runs in the browser.',
      'In the terminal, try "variant".',
      'Try clicking the monitor. More than once.',
      'Ctrl+P prints a clean CV.',
      'There is one sequence of arrow keys I would rather not list here.',
    ],
    sections: {
      about: "File summary. He leads a troop and is finishing a master's on top of it.",
      education: "Education. Bachelor's done, master's opening.",
      experience: 'Experience. The troop, camps and one commissioned website.',
      projects: 'The register fills from GitHub. A new repo shows up on its own.',
      skills: 'Inventory of technologies. At the bottom is what he still plans to learn.',
      leadership: 'Service record on soft skills.',
      contact: 'If you read this far, write to him. The stamp is already there.',
    },
    tour: [
      { target: '#top', text: 'The header: Oldřich Švehla, Olda to friends, variant 01. The branches are things that run at the same time.' },
      { target: '#about', text: 'Who he is: junior full-stack developer, FAV ZČU graduate, leader in Klub Pathfinder. Press Play next to the guitar on the right.' },
      { target: '#education', text: "Education: bachelor's 2023 to 2026, the SWIS master's from autumn." },
      { target: '#experience', text: 'Experience: leadership in Klub Pathfinder and a commissioned web portal.' },
      { target: '#projects', text: 'The project register. Data loads from GitHub.' },
      { target: '#skills', text: 'Technologies he uses, and what he plans to learn.' },
      { target: '#leadership', text: 'Soft skills: leading people, planning, staying calm in the field.' },
      { target: '#contact', text: 'And here you write to him. End of the tour, thank you for visiting.' },
    ],
    stamp: (name: string) => `New stamp: ${name}.`,
    allStamps: 'You have every stamp. The archive thanks you.',
    buttons: { next: 'Next tip', tour: 'Show me around', continue: 'Continue', done: 'Done', hide: 'Hide', call: 'Call Složka' },
    konami: 'You were not supposed to see that. I will leave it.',
    pexeso: 'Memory game. Fingers crossed.',
    bye: 'All right, I will hide. "guide" in the terminal brings me back.',
    hello: 'Yes? Složka here.',
  },
  stampsList: {
    title: 'Stamp collection',
    lead: 'One stamp for every discovery. Stored in your browser.',
    items: {
      terminal: { name: 'Terminal', hint: 'open the archive terminal' },
      variant: { name: 'Variant', hint: 'ask the terminal about variants' },
      guitar: { name: 'Guitar', hint: 'strum' },
      pexeso: { name: 'Memory', hint: 'finish the memory game' },
      monitor: { name: 'Signal', hint: 'test the monitor until it drops' },
      konami: { name: 'Deviation', hint: 'a sequence of arrows' },
      tour: { name: 'Tour', hint: 'take the tour' },
      theme: { name: 'Day and night', hint: 'switch the theme' },
    },
  },
  eggs: {
    konami: 'DEVIATION DETECTED. The line is branching. Leave it.',
    avatar: ['Hi.', 'Again?', 'That tickles.', 'Fine, okay.', 'Signal lost. One moment.'],
    tabTitle: 'The file is still open… ← olda',
    console: `
  ┌───────────────────────────────┐
  │  Hello, curious one.          │
  │  Source: github.com/adccz     │
  │  Try ~ or the Konami code.    │
  └───────────────────────────────┘
`,
  },
}

export const content: Record<Lang, typeof cs> = { cs, en }
