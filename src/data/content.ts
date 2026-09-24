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
  /** kód je v soukromém repozitáři (vlastním: přístup na vyžádání, nebo týmu), na GitHub se neodkazuje */
  privateRepo?: 'own' | 'team'
}

/** úroveň zkušenosti 1–5, popisky stupňů jsou v skills.levels */
export type Skill = { name: string; level: 1 | 2 | 3 | 4 | 5 }
export type SkillGroup = { name: string; items: Skill[] }

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
  /** kontaktní e-mail (adresa, mailto: doplní Contact.tsx) */
  email: 'oldasvehla@seznam.cz' as string,
  /** doplň, až budeš mít: 'https://linkedin.com/in/...' */
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
  /** kurzy a certifikáty (zobrazují se pod Praxí) */
  certs: [
    { year: '2020', name: 'Rádcovský kurz', org: 'Klub Pathfinder' },
    { year: '2024', name: 'Vůdcovský kurz', org: 'Klub Pathfinder' },
    { year: 'probíhá, do začátku 2027', name: 'MasterGuide, nejvyšší stupeň vzdělání v Pathfinderu', org: 'Klub Pathfinder' },
  ],
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
      'Junior full-stack vývojář z Plzně, pro přátele Olda. Letos jsem dokončil bakaláře na FAV ZČU, jsem oblastní vedoucí v Klubu Pathfinder a hledám stáž nebo částečný úvazek.',
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
      'V Klubu Pathfinder jsem od roku 2012, od 2018 jako rádce a vedoucí a od 2024 jako oblastní vedoucí oblasti Jižní kříž. Moje srdcovka jsou tábory: jeden jsem vedl jako programový vedoucí a dva jako hlavní vedoucí. Teď dokončuju MasterGuide, nejvyšší stupeň vzdělání v\u00a0Pathfinderu. Ve volném čase hraju na kytaru, vařím, koukám na marvelovky a seriály a hraju hry.',
      'Od podzimu 2026 pokračuju v navazujícím studiu Softwarové inženýrství (SWIS). Hledám stáž nebo částečný úvazek.',
    ],
    interestsTitle: 'Mimo kód',
    interests: [
      // action: 'guitar' = tlačítko Hrát otevře kytaru; 'games' = tlačítko rozbalí seznam her (src/data/games.ts); href = odkaz na web
      { icon: 'guitar', label: 'Kytara', note: 'akustická, hraju od roku 2011, hlavně u\u00a0ohně', action: 'guitar' },
      { icon: 'scout', label: 'Klub Pathfinder', note: 'od roku 2012, oblastní vedoucí, tábory jsou srdcovka', href: 'https://www.pathfinder.cz/' },
      { icon: 'marvel', label: 'Filmy a seriály', note: 'viděl jsem snad každou marvelovku, teď sleduju Zrádce na Prima+', href: 'https://seriesgraph.com/user/d3854d39-022b-4c98-ab7e-9d17de583a78' },
      { icon: 'games', label: 'Videohry', note: 'hraju od roku 2012', action: 'games' },
      { icon: 'cook', label: 'Vaření', note: 'doma i pro tábor' },
      { icon: 'mountain', label: 'Hory a outdoor', note: 'pěšky, se stanem' },
    ],
    games: {
      toggle: 'Seznam',
      summary: (n: number, hours: string) => `${n} ${n === 1 ? 'hra' : n < 5 ? 'hry' : 'her'} · ${hours} h celkem`,
      showAll: (n: number) => `Zobrazit všech ${n}`,
      showLess: 'Jen top 10',
      onEpic: 'Epic',
      alsoEpic: 'i na Epicu',
      noHours: 'Další z Epic Games · bez zaznamenaného času',
      updated: 'Sepsáno',
    },
  },
  projects: {
    title: 'Rejstřík projektů',
    lead: 'Seznam se plní z mého GitHubu. Popisky jsem doplnil ručně.',
    cols: { project: 'Projekt', tech: 'Technologie', updated: 'Poslední změna', links: 'Odkazy' },
    liveLabel: 'Živá ukázka',
    repoLabel: 'Repozitář',
    updated: 'Aktualizováno',
    noRepo: 'Mimo GitHub',
    privateRepo: { own: 'soukromé repo, přístup na vyžádání', team: 'soukromé repo týmu' },
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
        repo: null,
        privateRepo: 'team',
        title: 'Samoobslužný kiosek',
        desc: 'Samoobslužný kiosek pro firemní akce pro Eurosoftware (dnes GK Software Czech Republic): zaměstnanec se přihlásí NFC kartou, vybere si produkty z aktuální akce a systém hlídá limity; správce spravuje produkty, akce a zaměstnance a vidí statistiky. Moje část: frontend ve Vue.js, NFC, design a UX/UI. Týmový projekt KIV/ZSW-E, letní semestr 2025.',
        tags: ['Vue.js', 'JavaScript', 'NFC', 'UX/UI'],
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
        repo: 'bkp-tmwmf',
        title: 'Otevřená data v lázeňských místech',
        desc: 'Bakalářský projekt „Otevřená data a\u00a0jejich analýzy v\u00a0lázeňských místech pro demografii/školství a\u00a0turismus“: devět lázeňských a dvě turistická města. Pipeline v Pythonu stahuje data z ČSÚ, MŠMT, MF, MPSV a registru lázní, čistí je, počítá metriky a kreslí 15 grafů s animací a report v Power BI. 24 testů v pytest.',
        tags: ['Python', 'pandas', 'matplotlib', 'Power BI', 'pytest', 'Otevřená data'],
        featured: true,
      },
      {
        repo: 'olda-web',
        title: 'Tento web',
        desc: 'Osobní web a životopis ve stylu archivu časových linií: 3D portál v čistém CSS, animace, easter eggy, živá data z GitHubu přes Vercel funkci a generátor PDF životopisu v Pythonu. Vzniká ve spolupráci s Claude Code.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
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
        privateRepo: 'own',
        title: 'Emulátor počítače KMX',
        desc: 'Semestrální práce KIV/PC: emulátor počítače s procesorem architektury MISC v čistém C, testovací programy v assembleru a dokumentace v LaTeXu.',
        tags: ['C', 'Make', 'LaTeX'],
      },
      {
        repo: null,
        privateRepo: 'own',
        title: 'Virtuální souborový systém',
        desc: 'Semestrální práce KIV/ZOS: souborový systém uložený v jediném binárním souboru, s i-uzly, adresáři, symbolickými linky, importem a exportem souborů a dávkovými skripty.',
        tags: ['C', 'CMake'],
      },
      {
        repo: null,
        privateRepo: 'own',
        title: 'Paralelní zpracování meteodat',
        desc: 'Semestrální práce KIV/UPP: historická měření meteostanic ČR zpracovaná sériově i paralelně, mapy průměrných teplot v SVG, detekce meziročních výkyvů a měření zrychlení (Amdahlův a Gustafsonův zákon).',
        tags: ['C++', 'OpenMP', 'SVG'],
      },
      {
        repo: null,
        privateRepo: 'own',
        title: '3D hra v OpenGL',
        desc: 'Semestrální práce KIV/ZPG v C# (.NET 8) nad OpenTK: svět generovaný z textových map, kolize, kamera s pohybem hráče, teleporty, baterka jako dynamické světlo, minimapa a vlastní GLSL shadery.',
        tags: ['C#', '.NET 8', 'OpenTK', 'GLSL'],
      },
      {
        repo: null,
        title: 'Testování softwaru (10 úloh KIV/OKS)',
        desc: 'Jednotkové testy odhalující zanesené chyby, parametrizace a mock objekty, 100% pokrytí příkazů a větví, návrh požadavků a testovacích případů a manuální testovací kampaně ve Squash TM, automatizované testy webové aplikace v Robot Frameworku a Browser Library (Page Object Model) i řízené daty, BDD v Gherkinu, testy logování a testy databáze SQLite.',
        tags: ['pytest', 'mock', 'coverage', 'Squash TM', 'Robot Framework', 'BDD / Gherkin', 'SQLite'],
      },
      {
        repo: 'web-foodapp',
        title: 'FoodApp',
        desc: 'Webová aplikace kolem jídla a receptů postavená na PHP šablonách Twig.',
        tags: ['PHP', 'Twig'],
      },
    ] as Project[],
  },
  skills: {
    title: 'Technologie',
    lead: 'Co používám a jak dobře. Stupnice je od prvního vyzkoušení po expertní úroveň.',
    plannedLabel: 'V plánu',
    /** popisky stupňů 1–5 */
    levels: ['zkoušel jsem', 'základy, školní projekty', 'samostatně na projektech', 'pokročile, dlouhodobě', 'expert'],
    levelOf: (n: number) => `${n} z 5`,
    groups: [
      // Úrovně podle repozitářů na GitHubu (řádky kódu bez prázdných, počet a velikost projektů):
      // 4 = hlavní technologie ve 2+ větších projektech nebo ve velkém nasazeném, 3 = samostatně ve větším
      // projektu (~1,5k+ řádků) nebo v několika menších, 2 = jeden projekt / podpůrná role, 1 = vyzkoušeno.
      { name: 'Jazyky', items: [
        { name: 'PHP', level: 4 }, // komunitní portál (Nette, 3,9k ř. PHP) + FoodApp (2k ř.)
        { name: 'C', level: 4 }, // emulátor KMX (2,5k ř.), server Pexesa (2,7k ř.), souborový systém (1,9k ř.)
        { name: 'JavaScript', level: 3 }, // CampMaster (5,1k ř. JS/JSX), kiosek (Vue)
        { name: 'Java', level: 3 }, // klient Pexesa v JavaFX (2,2k ř.)
        { name: 'C#', level: 3 }, // 3D hra v OpenTK (2,1k ř.)
        { name: 'Python', level: 3 }, // bakalářský projekt (3,1k ř.) + skripty k UPP
        { name: 'SQL', level: 3 }, // MySQL migrace portálu, schéma FoodApp
        { name: 'C++', level: 2 }, // UPP (OpenMP)
      ] },
      { name: 'Web a frameworky', items: [
        { name: 'Nette', level: 4 }, // portál: 12 presenterů, formuláře, OAuth, nasazený
        { name: 'Latte', level: 4 }, // portál (10,5k ř. šablon)
        { name: 'HTML5 / CSS3', level: 4 }, // všechny webové projekty
        { name: 'Tailwind CSS', level: 3 }, // portál, CampMaster
        { name: 'React', level: 3 }, // CampMaster (React 19, MUI, Recharts, Leaflet)
        { name: 'Vue.js', level: 3 }, // kiosek pro Eurosoftware (LS 2025)
        { name: 'Twig', level: 3 }, // FoodApp (2,5k ř. šablon)
        { name: 'Node.js (Express, Socket.IO)', level: 2 }, // server CampMasteru
        { name: 'UX/UI design', level: 3 }, // kiosek (design a UX/UI), návrh CampMasteru, vlastní weby
      ] },
      { name: 'Architektura a sítě', items: [
        { name: 'MVC / MVP architektura', level: 3 }, // Nette presentery, FoodApp
        { name: 'TCP/IP sokety, vlastní protokol', level: 3 }, // Síťové Pexeso (select())
        { name: 'REST API', level: 2 }, // server CampMasteru (Express)
        { name: 'WebSockety (Socket.IO)', level: 2 }, // CampMaster
        { name: 'OAuth 2.0', level: 2 }, // portál: Google, Facebook, Discord, Instagram
        { name: 'Paralelizace (OpenMP)', level: 2 }, // UPP
        { name: 'NFC', level: 2 }, // kiosek: přihlašování NFC kartou na frontendu
      ] },
      { name: 'Databáze a nástroje', items: [
        { name: 'MySQL', level: 3 }, // portál (MySQL 8, 8 migrací), FoodApp (PDO)
        { name: 'Git a GitHub', level: 3 }, // všechny projekty
        { name: 'Linux CLI', level: 3 }, // C projekty, skripty, nasazení
        { name: 'Vite', level: 3 }, // portál, CampMaster, tento web
        { name: 'LaTeX', level: 3 }, // dokumentace k šesti projektům
        { name: 'Docker', level: 2 }, // portál (Dockerfile, compose, nasazení na Railway)
        { name: 'Make / CMake / Maven', level: 2 }, // C projekty, klient Pexesa
      ] },
      { name: 'Testování', items: [
        { name: 'pytest (fixtures, parametrizace, mock)', level: 3 }, // bakalářský projekt (24 testů), KIV/OKS úlohy 01–03, 08, 09
        { name: 'Pokrytí kódu (coverage)', level: 2 }, // KIV/OKS 03: 100% pokrytí příkazů a větví
        { name: 'Návrh testů, Squash TM', level: 2 }, // KIV/OKS 04–05: požadavky, testovací případy, manuální kampaně
        { name: 'Robot Framework + Browser Library', level: 2 }, // KIV/OKS 06, 07, 10: webové testy s POM, řízené daty, DB
        { name: 'BDD (Gherkin)', level: 2 }, // KIV/OKS 09: Scenario Outline, tagy, pozitivní i negativní testy
        { name: 'Testy databáze (SQLite)', level: 2 }, // KIV/OKS 10: tabulky, sloupce, triggery
        { name: 'Logování (Python logging)', level: 2 }, // KIV/OKS 08: dictConfig z JSON, testy úrovní
      ] },
      { name: 'Grafika a data', items: [
        { name: 'pandas / matplotlib', level: 3 }, // bakalářský projekt, UPP
        { name: 'Otevřená data', level: 3 }, // bakalářský projekt (ČSÚ, MŠMT, MF, MPSV)
        { name: 'Power BI', level: 2 }, // bakalářský projekt
        { name: 'OpenGL / OpenTK, GLSL', level: 2 }, // 3D hra
        { name: 'JavaFX', level: 2 }, // klient Pexesa
      ] },
    ] as SkillGroup[],
    planned: ['TypeScript', 'Next.js', 'PostgreSQL', 'Spring Boot', 'GitHub Actions (CI/CD)', 'Testování (JUnit, Jest)', 'Kubernetes', 'AWS / cloud'],
  },
  education: {
    title: 'Vzdělání',
    stamp: 'neořezávat',
    items: [
      { period: '2019 – 2023', title: 'Počítačová grafika a CNC technika', place: 'Střední průmyslová škola Strakonice (VOŠ, SPŠ a SOŠ řemesel a služeb)' },
      { period: '2023 – 2026', title: 'Bc. Počítačové vědy', place: 'Fakulta aplikovaných věd, ZČU v Plzni', note: 'Bakalářský projekt: Otevřená data a\u00a0jejich analýzy v\u00a0lázeňských místech pro demografii/školství a\u00a0turismus' },
      { period: '2026 –', title: 'Ing. Softwarové inženýrství (SWIS)', place: 'Fakulta aplikovaných věd, ZČU v Plzni', note: 'Navazující studium', planned: true },
    ] as TimelineItem[],
  },
  experience: {
    title: 'Praxe',
    lead: 'Placenou praxi v IT teprve hledám. Tohle je to, co mám za sebou.',
    items: [
      {
        period: 'od 2018',
        title: 'Oblastní vedoucí, oblast Jižní kříž',
        org: 'Klub Pathfinder · v klubu od 2012, rádce a vedoucí od 2018, oblastní vedoucí od 2024',
        bullets: [
          'Vedení oblasti: koordinace oddílů a vedoucích, účetnictví oblasti, víkendové akce.',
          'Tábory jsou moje srdcovka: jeden jsem vedl jako programový vedoucí, dva jako hlavní vedoucí. Rozpočet, program, tým, bezpečnost a zázemí pro desítky účastníků.',
          'Práce s dětmi a dospívajícími, řešení nečekaných situací v terénu.',
        ],
      },
      {
        period: 'letní semestr 2025',
        title: 'Frontend samoobslužného kiosku',
        org: 'Eurosoftware, dnes GK Software Czech Republic s.r.o. · týmový projekt KIV/ZSW-E',
        bullets: [
          'Týmový projekt na zakázku firmy v předmětu KIV/ZSW-E na FAV ZČU: samoobslužný kiosek, ze kterého si zaměstnanci na firemních akcích berou produkty.',
          'Moje část: frontend ve Vue.js, přihlašování přiložením NFC karty a design a UX/UI kiosku.',
        ],
      },
      {
        period: 'od 2023',
        title: 'Dobrovolník, security',
        org: 'United · křesťanský multižánrový festival',
        bullets: [
          'Security na festivalu United v letech 2023 a 2025.',
          'Od roku 2023 pravidelně dobrovolničím i na menších akcích United City.',
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
    memo: { subject: 'Věc', where: 'Kde', period: 'Období', subjectValue: 'Organizační a měkké dovednosti', whereValue: 'Klub Pathfinder, oblast Jižní kříž', periodValue: 'od 2018' },
    items: [
      {
        title: 'Vedení týmů a mentorství',
        desc: 'Víceleté zkušenosti s koordinací regionálních aktivit mládežnické organizace, vedením vedoucích a prací s dětmi i dospívajícími.',
      },
      {
        title: 'Projektový management a logistika',
        desc: 'Tři tábory ve vedení (jednou programový, dvakrát hlavní vedoucí) a víkendové akce pro desítky účastníků: rozpočet a účetnictví, program, bezpečnost, zázemí.',
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
    hint: 'klikni na hmatník, přejeď přes struny, nebo hraj na klávesnici',
    chords: 'Akordy',
    groups: { major: 'Dur', minor: 'Moll', seventh: 'Septakordy' },
    custom: 'vlastní hmat',
    strings: 'Hmatník',
    strumDown: 'Brnknout ↓',
    strumUp: 'Brnknout ↑',
    play: 'Hrát',
    capo: 'Kapodastr',
    soundsAs: (c: string) => `zní jako ${c}`,
    tone: 'Zvuk',
    tones: { steel: 'ocel', nylon: 'nylon', muted: 'dusit' },
    mute: (s: string) => `ztlumit strunu ${s}`,
    fret: (s: string, f: number) => `struna ${s}, pražec ${f}`,
    accomp: 'Doprovod',
    progression: 'Průběh',
    progressions: { camp: 'Táborák', pop: 'Pop', folk: 'Folk', blues: 'Blues v E', current: 'jen tenhle akord', custom: 'Vlastní' },
    rhythm: 'Rytmus',
    patterns: { camp: 'Táborák', eighths: 'Osminy', waltz: 'Valčík 3/4', picking: 'Prstoklad', custom: 'Vlastní' },
    addBar: '+ takt',
    bar: (n: number) => `takt ${n}`,
    removeBar: (n: number) => `odebrat takt ${n}`,
    meter: 'Takt',
    clear: 'Vyčistit',
    symbols: { '-': 'pauza', D: 'úhoz dolů', U: 'úhoz nahoru', B: 'basa', A: 'střídavá basa', '3': 'struna 3', '2': 'struna 2', '1': 'struna 1' } as Record<string, string>,
    stepLabel: (n: number, what: string) => `krok ${n}: ${what}, kliknutím změníš`,
    stepHelp: 'Klikáním na kroky skládáš rytmus: ↓ dolů, ↑ nahoru, B basa, b střídavá basa, 1–3 jedna struna, · pauza.',
    tempo: 'Tempo',
    start: 'Spustit doprovod',
    stop: 'Zastavit',
    keysTitle: 'Klávesnice',
    keys: [
      ['1–6', 'struny'], ['QWERTZ', 'dur'], ['ASDF', 'moll'], ['YXCVBN', 'septakordy'],
      ['mezerník', 'brnknout ↓ (Shift ↑)'], ['← →', 'akord'], ['↑ ↓', 'kapodastr'], ['P', 'doprovod'],
    ] as [string, string][],
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
    variant: 'Evidované varianty subjektu ŠVEHLA:\n  01  junior full-stack vývojář stav: aktivní\n  02  oblastní vedoucí         stav: aktivní\n  03  kytarista                stav: aktivní, občas rozladěný\n  04  hráč videoher            stav: aktivní po půlnoci\n  05  student SWIS             stav: startuje\nVšechny varianty běží souběžně. Odchylka: žádná. Zvláštnost: vaří pro padesát lidí.',
    prune: 'Žádost o ořezání zamítnuta. Tahle linie se líbí.',
    timelineCmd: '2011 ─┬─ kytara\n2012 ─┼─ Klub Pathfinder, hry\n2018 ─┼─ rádce a vedoucí v Pathfinderu\n2019 ─┼─ SPŠ Strakonice, počítačová grafika a CNC\n2020 ─┼─ rádcovský kurz\n2021 ─┼─ praxe v Automa CZ (i 2022)\n2023 ─┼─ FAV ZČU, Bc. Počítačové vědy, první kód, festival United\n2024 ─┼─ web-foodapp, vůdcovský kurz, oblastní vedoucí Jižního kříže\n2025 ─┼─ kiosek pro Eurosoftware (Vue.js), Síťové Pexeso (C + JavaFX), úlohy z testování (KIV/OKS)\n2026 ─┼─ CampMaster 3000, bakalářský projekt, komunitní portál, tenhle web\n2027 ─┼─ MasterGuide\n      └─ SWIS ▶ (větev se otevírá)',
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
    whoami: 'Oldřich Jan Švehla, pro přátele Olda. Junior full-stack vývojář, absolvent FAV ZČU, oblastní vedoucí v Klubu Pathfinder. Momentálně: hledám stáž.',
    scout: 'Klub Pathfinder: oblast Jižní kříž, tábory, víkendovky. Umím rozdělat oheň v dešti a rozdělit 50 dětí do týmů tak, aby se nikdo nehádal. Skoro.',
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
      about: 'Souhrn spisu. Vede oblast v Pathfinderu a k tomu dostuduje inženýra.',
      education: 'Vzdělání. Bakalář hotový, inženýr se otevírá.',
      experience: 'Praxe. Oblast, tábory a kiosek pro Eurosoftware.',
      projects: 'Rejstřík se plní z GitHubu. Nové repo se v něm objeví samo.',
      skills: 'Inventář technologií. Dole je to, co se teprve chystá doučit.',
      leadership: 'Služební záznam o měkkých dovednostech.',
      contact: 'Pokud jste dočetli až sem, napište mu. Razítko už tam je.',
    },
    tour: [
      { target: '#top', text: 'Hlavička: Oldřich Švehla, pro přátele Olda, varianta 01. Větve jsou věci, které běží souběžně.' },
      { target: '#about', text: 'Kdo to je: junior full-stack vývojář, absolvent FAV ZČU, vedoucí v Klubu Pathfinder. U kytary vpravo je tlačítko Hrát.' },
      { target: '#education', text: 'Vzdělání: bakalář 2023 až 2026, od podzimu navazující SWIS.' },
      { target: '#experience', text: 'Praxe: vedení v Klubu Pathfinder a frontend samoobslužného kiosku pro Eurosoftware.' },
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
  certs: [
    { year: '2020', name: 'Patrol leader course', org: 'Klub Pathfinder' },
    { year: '2024', name: 'Unit leader course', org: 'Klub Pathfinder' },
    { year: 'in progress, until early 2027', name: 'Master Guide, the highest level of training in Pathfinders', org: 'Klub Pathfinder' },
  ],
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
      "Junior full-stack developer from Pilsen, Olda to friends. I finished my bachelor's at FAV ZČU this year, I'm a regional leader in Klub Pathfinder, and I'm looking for an internship or part-time role.",
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
      "I've been in Klub Pathfinder since 2012, a patrol leader and leader since 2018, and since 2024 I've led the Jižní kříž region. Camps are my passion: I've run one as programme leader and two as head leader. I'm now finishing Master Guide, the highest level of training in Pathfinders. In my free time I play guitar, cook, watch Marvel films and series and play games.",
      "From autumn 2026 I continue with the Software Engineering (SWIS) master's. I'm looking for an internship or part-time role.",
    ],
    interestsTitle: 'Beyond code',
    interests: [
      { icon: 'guitar', label: 'Guitar', note: 'acoustic, playing since 2011, mostly by the fire', action: 'guitar' },
      { icon: 'scout', label: 'Klub Pathfinder', note: 'since 2012, regional leader, camps are my passion', href: 'https://www.pathfinder.cz/' },
      { icon: 'marvel', label: 'Films and series', note: "I've seen pretty much every Marvel film, now watching Zrádci (The Traitors) on Prima+", href: 'https://seriesgraph.com/user/d3854d39-022b-4c98-ab7e-9d17de583a78' },
      { icon: 'games', label: 'Video games', note: 'playing since 2012', action: 'games' },
      { icon: 'cook', label: 'Cooking', note: 'at home and for camp' },
      { icon: 'mountain', label: 'Mountains and outdoors', note: 'on foot, with a tent' },
    ],
    games: {
      toggle: 'List',
      summary: (n: number, hours: string) => `${n} ${n === 1 ? 'game' : 'games'} · ${hours} h in total`,
      showAll: (n: number) => `Show all ${n}`,
      showLess: 'Top 10 only',
      onEpic: 'Epic',
      alsoEpic: 'also on Epic',
      noHours: 'More from Epic Games · no recorded playtime',
      updated: 'Compiled',
    },
  },
  projects: {
    title: 'Project register',
    lead: 'The list fills from my GitHub. Descriptions are written by hand.',
    cols: { project: 'Project', tech: 'Technologies', updated: 'Last change', links: 'Links' },
    liveLabel: 'Live demo',
    repoLabel: 'Repository',
    updated: 'Updated',
    noRepo: 'Off GitHub',
    privateRepo: { own: 'private repo, access on request', team: 'private team repo' },
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
        repo: null,
        privateRepo: 'team',
        title: 'Self-service kiosk',
        desc: 'Self-service kiosk for company events for Eurosoftware (now GK Software Czech Republic): employees sign in with an NFC card, pick products from the current event and the system enforces limits; admins manage products, events and employees and see statistics. My part: the Vue.js frontend, NFC, design and UX/UI. KIV/ZSW-E team project, spring 2025.',
        tags: ['Vue.js', 'JavaScript', 'NFC', 'UX/UI'],
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
        repo: 'bkp-tmwmf',
        title: 'Open data in Czech spa towns',
        desc: "Bachelor's project “Open data and their analyses in spa towns for demography/education and tourism”: nine spa towns and two tourist towns. A Python pipeline downloads data from the Czech Statistical Office, ministries and the spa register, cleans it, computes metrics and draws 15 charts with an animation plus a Power BI report. 24 pytest tests.",
        tags: ['Python', 'pandas', 'matplotlib', 'Power BI', 'pytest', 'Open data'],
        featured: true,
      },
      {
        repo: 'olda-web',
        title: 'This website',
        desc: 'Personal site and CV styled as a timeline archive: a 3D portal in pure CSS, animations, easter eggs, live GitHub data through a Vercel function and a Python CV PDF generator. Built together with Claude Code.',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
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
        privateRepo: 'own',
        title: 'KMX computer emulator',
        desc: 'KIV/PC semester project: an emulator of a computer with a MISC-architecture CPU in pure C, test programs in assembly and documentation in LaTeX.',
        tags: ['C', 'Make', 'LaTeX'],
      },
      {
        repo: null,
        privateRepo: 'own',
        title: 'Virtual file system',
        desc: 'KIV/ZOS semester project: a file system stored in a single binary file, with inodes, directories, symbolic links, file import and export, and batch scripts.',
        tags: ['C', 'CMake'],
      },
      {
        repo: null,
        privateRepo: 'own',
        title: 'Parallel weather data processing',
        desc: 'KIV/UPP semester project: historical Czech weather station data processed serially and in parallel, SVG maps of average temperatures, detection of year-to-year swings and speed-up measurements (Amdahl and Gustafson laws).',
        tags: ['C++', 'OpenMP', 'SVG'],
      },
      {
        repo: null,
        privateRepo: 'own',
        title: 'OpenGL 3D game',
        desc: 'KIV/ZPG semester project in C# (.NET 8) on OpenTK: a world generated from text maps, collisions, a player camera, teleports, a flashlight as dynamic light, a minimap and custom GLSL shaders.',
        tags: ['C#', '.NET 8', 'OpenTK', 'GLSL'],
      },
      {
        repo: null,
        title: 'Software testing (10 KIV/OKS assignments)',
        desc: 'Unit tests that expose planted bugs, parametrisation and mock objects, 100% statement and branch coverage, designing requirements and test cases and running manual test campaigns in Squash TM, automated and data-driven tests of a web app in Robot Framework and Browser Library (Page Object Model), BDD in Gherkin, logging tests and SQLite database tests.',
        tags: ['pytest', 'mock', 'coverage', 'Squash TM', 'Robot Framework', 'BDD / Gherkin', 'SQLite'],
      },
      {
        repo: 'web-foodapp',
        title: 'FoodApp',
        desc: 'Web application around food and recipes built on PHP with Twig templates.',
        tags: ['PHP', 'Twig'],
      },
    ],
  },
  skills: {
    title: 'Technologies',
    lead: 'What I use and how well. The scale runs from a first try to expert level.',
    plannedLabel: 'Planned',
    levels: ['tried it', 'basics, school projects', 'independently on projects', 'advanced, long-term', 'expert'],
    levelOf: (n: number) => `${n} of 5`,
    groups: [
      { name: 'Languages', items: [
        { name: 'PHP', level: 4 }, { name: 'C', level: 4 }, { name: 'JavaScript', level: 3 }, { name: 'Java', level: 3 },
        { name: 'C#', level: 3 }, { name: 'Python', level: 3 }, { name: 'SQL', level: 3 }, { name: 'C++', level: 2 },
      ] },
      { name: 'Web & frameworks', items: [
        { name: 'Nette', level: 4 }, { name: 'Latte', level: 4 }, { name: 'HTML5 / CSS3', level: 4 }, { name: 'Tailwind CSS', level: 3 },
        { name: 'React', level: 3 }, { name: 'Vue.js', level: 3 }, { name: 'Twig', level: 3 }, { name: 'Node.js (Express, Socket.IO)', level: 2 },
        { name: 'UX/UI design', level: 3 },
      ] },
      { name: 'Architecture & networking', items: [
        { name: 'MVC / MVP architecture', level: 3 }, { name: 'TCP/IP sockets, custom protocol', level: 3 }, { name: 'REST API', level: 2 },
        { name: 'WebSockets (Socket.IO)', level: 2 }, { name: 'OAuth 2.0', level: 2 }, { name: 'Parallelism (OpenMP)', level: 2 }, { name: 'NFC', level: 2 },
      ] },
      { name: 'Databases & tools', items: [
        { name: 'MySQL', level: 3 }, { name: 'Git & GitHub', level: 3 }, { name: 'Linux CLI', level: 3 }, { name: 'Vite', level: 3 },
        { name: 'LaTeX', level: 3 }, { name: 'Docker', level: 2 }, { name: 'Make / CMake / Maven', level: 2 },
      ] },
      { name: 'Testing', items: [
        { name: 'pytest (fixtures, parametrisation, mocks)', level: 3 }, { name: 'Code coverage', level: 2 }, { name: 'Test design, Squash TM', level: 2 },
        { name: 'Robot Framework + Browser Library', level: 2 }, { name: 'BDD (Gherkin)', level: 2 },
        { name: 'Database tests (SQLite)', level: 2 }, { name: 'Logging (Python logging)', level: 2 },
      ] },
      { name: 'Graphics & data', items: [
        { name: 'pandas / matplotlib', level: 3 }, { name: 'Open data', level: 3 }, { name: 'Power BI', level: 2 },
        { name: 'OpenGL / OpenTK, GLSL', level: 2 }, { name: 'JavaFX', level: 2 },
      ] },
    ],
    planned: ['TypeScript', 'Next.js', 'PostgreSQL', 'Spring Boot', 'GitHub Actions (CI/CD)', 'Testing (JUnit, Jest)', 'Kubernetes', 'AWS / cloud'],
  },
  education: {
    title: 'Education',
    stamp: 'do not prune',
    items: [
      { period: '2019 – 2023', title: 'Computer Graphics and CNC Technology', place: 'Secondary Technical School (SPŠ), Strakonice' },
      { period: '2023 – 2026', title: 'BSc Computer Science', place: 'Faculty of Applied Sciences, University of West Bohemia, Pilsen', note: "Bachelor's project: Open data and their analyses in spa towns for demography/education and tourism" },
      { period: '2026 –', title: 'MSc Software Engineering (SWIS)', place: 'Faculty of Applied Sciences, University of West Bohemia, Pilsen', note: "Master's programme", planned: true },
    ],
  },
  experience: {
    title: 'Experience',
    lead: "I'm still looking for my first paid IT role. This is what I have behind me.",
    items: [
      {
        period: 'since 2018',
        title: 'Regional leader, Jižní kříž region',
        org: 'Klub Pathfinder · member since 2012, patrol leader and leader since 2018, regional leader since 2024',
        bullets: [
          'Leading the region: coordinating units and their leaders, keeping the regional accounts, running weekend events.',
          "Camps are my passion: I've run one as programme leader and two as head leader. Budget, programme, team, safety and facilities for dozens of participants.",
          'Working with children and teenagers, handling unexpected situations in the field.',
        ],
      },
      {
        period: 'spring semester 2025',
        title: 'Frontend of a self-service kiosk',
        org: 'Eurosoftware, now GK Software Czech Republic s.r.o. · KIV/ZSW-E team project',
        bullets: [
          'A team project commissioned by the company in the KIV/ZSW-E course at FAV ZČU: a self-service kiosk where employees pick up products at company events.',
          "My part: the Vue.js frontend, NFC card sign-in, and the kiosk's design and UX/UI.",
        ],
      },
      {
        period: 'since 2023',
        title: 'Volunteer, security',
        org: 'United · Christian multi-genre festival',
        bullets: [
          'Security team at the United festival in 2023 and 2025.',
          'Regular volunteer at the smaller United City events since 2023.',
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
    memo: { subject: 'Subject', where: 'Where', period: 'Period', subjectValue: 'Organisational and soft skills', whereValue: 'Klub Pathfinder, Jižní kříž region', periodValue: 'since 2018' },
    items: [
      {
        title: 'Team leadership & mentoring',
        desc: "Years of coordinating a youth organisation's regional activities, leading leaders, and working with children and teenagers.",
      },
      {
        title: 'Project management & logistics',
        desc: 'Three camps in charge (once as programme leader, twice as head leader) and weekend events for dozens of participants: budget and accounts, programme, safety, facilities.',
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
    hint: 'click the fretboard, drag across the strings, or play on your keyboard',
    chords: 'Chords',
    groups: { major: 'Major', minor: 'Minor', seventh: 'Seventh' },
    custom: 'custom shape',
    strings: 'Fretboard',
    strumDown: 'Strum ↓',
    strumUp: 'Strum ↑',
    play: 'Play',
    capo: 'Capo',
    soundsAs: (c: string) => `sounds as ${c}`,
    tone: 'Sound',
    tones: { steel: 'steel', nylon: 'nylon', muted: 'muted' },
    mute: (s: string) => `mute string ${s}`,
    fret: (s: string, f: number) => `string ${s}, fret ${f}`,
    accomp: 'Accompaniment',
    progression: 'Progression',
    progressions: { camp: 'Campfire', pop: 'Pop', folk: 'Folk', blues: 'Blues in E', current: 'this chord only', custom: 'Custom' },
    rhythm: 'Rhythm',
    patterns: { camp: 'Campfire', eighths: 'Eighths', waltz: 'Waltz 3/4', picking: 'Fingerpicking', custom: 'Custom' },
    addBar: '+ bar',
    bar: (n: number) => `bar ${n}`,
    removeBar: (n: number) => `remove bar ${n}`,
    meter: 'Time',
    clear: 'Clear',
    symbols: { '-': 'rest', D: 'strum down', U: 'strum up', B: 'bass', A: 'alternate bass', '3': 'string 3', '2': 'string 2', '1': 'string 1' },
    stepLabel: (n: number, what: string) => `step ${n}: ${what}, click to change`,
    stepHelp: 'Click the steps to build a rhythm: ↓ down, ↑ up, B bass, b alternate bass, 1–3 a single string, · rest.',
    tempo: 'Tempo',
    start: 'Start accompaniment',
    stop: 'Stop',
    keysTitle: 'Keyboard',
    keys: [
      ['1–6', 'strings'], ['QWERTY', 'major'], ['ASDF', 'minor'], ['ZXCVBN', 'seventh'],
      ['space', 'strum ↓ (Shift ↑)'], ['← →', 'chord'], ['↑ ↓', 'capo'], ['P', 'accompaniment'],
    ],
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
    variant: 'Variants on record for subject ŠVEHLA:\n  01  junior full-stack developer status: active\n  02  regional leader          status: active\n  03  guitarist                status: active, occasionally out of tune\n  04  gamer                    status: active after midnight\n  05  SWIS student             status: starting\nAll variants run concurrently. Deviation: none. Notable: cooks for fifty people.',
    prune: 'Pruning request denied. We like this line.',
    timelineCmd: '2011 ─┬─ guitar\n2012 ─┼─ Klub Pathfinder, games\n2018 ─┼─ patrol leader and leader in Pathfinders\n2019 ─┼─ SPŠ Strakonice, computer graphics and CNC\n2020 ─┼─ patrol leader course\n2021 ─┼─ placement at Automa CZ (also 2022)\n2023 ─┼─ FAV ZČU, BSc Computer Science, first code, United festival\n2024 ─┼─ web-foodapp, unit leader course, regional leader of Jižní kříž\n2025 ─┼─ kiosk for Eurosoftware (Vue.js), Networked Memory game (C + JavaFX), testing assignments (KIV/OKS)\n2026 ─┼─ CampMaster 3000, bachelor’s project, community portal, this website\n2027 ─┼─ Master Guide\n      └─ SWIS ▶ (branch opening)',
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
    whoami: 'Oldřich Jan Švehla, Olda to friends. Junior full-stack developer, FAV ZČU graduate, regional leader in Klub Pathfinder. Currently: looking for an internship.',
    scout: 'Klub Pathfinder: the Jižní kříž region, camps, weekend events. I can light a fire in the rain and split 50 kids into teams without a single argument. Almost.',
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
      about: "File summary. He leads a Pathfinder region and is finishing a master's on top of it.",
      education: "Education. Bachelor's done, master's opening.",
      experience: 'Experience. The region, camps and a kiosk for Eurosoftware.',
      projects: 'The register fills from GitHub. A new repo shows up on its own.',
      skills: 'Inventory of technologies. At the bottom is what he still plans to learn.',
      leadership: 'Service record on soft skills.',
      contact: 'If you read this far, write to him. The stamp is already there.',
    },
    tour: [
      { target: '#top', text: 'The header: Oldřich Švehla, Olda to friends, variant 01. The branches are things that run at the same time.' },
      { target: '#about', text: 'Who he is: junior full-stack developer, FAV ZČU graduate, leader in Klub Pathfinder. Press Play next to the guitar on the right.' },
      { target: '#education', text: "Education: bachelor's 2023 to 2026, the SWIS master's from autumn." },
      { target: '#experience', text: 'Experience: leadership in Klub Pathfinder and the frontend of a self-service kiosk for Eurosoftware.' },
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
