# -*- coding: utf-8 -*-
"""
Generátor životopisu.

    python3 scripts/cv.py

Vytvoří:
  public/cv.pdf        – hravá verze ve stylu webu (papírový spis, razítka, časová linie)
  public/cv-plain.pdf  – strohá verze pro personální systémy (ATS), stejný obsah

Potřebuje: pip install reportlab
Údaje uprav v bloku DATA níže. Písma jsou ve scripts/fonts/.
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table,
                                TableStyle, Flowable, KeepTogether, SimpleDocTemplate)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'public')

# ============================================================ DATA
DATA = {
    'name': 'Oldřich Jan Švehla',
    'first': 'Oldřich', 'last': 'Švehla',
    'role': 'junior full-stack vývojář',
    'location': 'Plzeň, Česko',
    'email': '',          # doplň, např. 'jmeno@email.cz'
    'phone': '',          # doplň, např. '+420 777 123 456'
    'github': 'github.com/adccz',
    'web': '',            # doplň po nasazení, např. 'oldrich-svehla.vercel.app'
    'profile': ('Junior full-stack vývojář, absolvent bakalářského studia informatiky na FAV ZČU se zaměřením '
                'na vývoj webových aplikací a softwarové inženýrství. Praktické zkušenosti s návrhem backendové '
                'i frontendové architektury, integrací databází a prací s otevřenými daty. Oblastní vedoucí '
                'v Klubu Pathfinder: vedení týmů, organizace táborů a akcí, krizové řízení. '
                'Hledám stáž nebo částečný úvazek.'),
    'education': [
        ('2019 – 2023', 'Počítačová grafika a CNC technika', 'Střední průmyslová škola Strakonice', ''),
        ('2023 – 2026', 'Bc. Počítačové vědy', 'Fakulta aplikovaných věd, Západočeská univerzita v Plzni',
         'Bakalářská práce: vizualizace regionálních otevřených dat.'),
        ('2026 –', 'Ing. Softwarové inženýrství (SWIS)', 'Fakulta aplikovaných věd, ZČU v Plzni',
         'Navazující studium.'),
    ],
    'experience': [
        ('od 2024', 'Oblastní vedoucí, oblast Jižní kříž', 'Klub Pathfinder, v klubu od 2012, vedoucí od 2018', [
            'Vedení oblasti: oddíly a vedoucí, účetnictví, víkendové akce. Tábory: 1× programový, 2× hlavní vedoucí.',
            'Kurzy: rádcovský (2020), vůdcovský (2024), MasterGuide – nejvyšší stupeň (do začátku 2027).',
        ]),
        ('LS 2025', 'Frontend samoobslužného kiosku', 'Eurosoftware, dnes GK Software Czech Republic s.r.o.', [
            'Týmový projekt na zakázku firmy v předmětu KIV/ZSW-E: frontend kiosku ve Vue.js, mimo jiné práce s NFC.',
        ]),
        ('od 2023', 'Dobrovolník, security', 'festival United', [
            'Security na festivalu United (2023, 2025), pravidelně na akcích United City.',
        ]),
        ('2021, 2022', 'Odborná praxe na střední škole', 'Automa CZ s.r.o., Strakonice', [
            'Montáž testovacích zařízení pro displeje Audi a Renault podle výkresů a Inventoru, ruční dokončování dílů, skladová evidence.',
        ]),
    ],
    'projects': [
        ('CampMaster 3000', 'Dashboard pro řízení táborové hry: trasy na mapě, týmy, pravidla, bodování v reálném čase. Semestrální projekt KIV/UUR.',
         'React, Tailwind CSS, Recharts, Leaflet', 'campmaster-3000.vercel.app'),
        ('Informační a komunitní portál', 'Full-stack řešení na míru: autentizace, registrace na akce, správa multimediálního obsahu.',
         'PHP, Nette, Latte, Tailwind CSS, MySQL', 'github: adccz'),
        ('Otevřená data lázeňských měst', 'Bakalářská práce: ETL pipeline nad daty ČSÚ, MŠMT a MPSV, 15 grafů a Power BI report.',
         'Python, pandas, Power BI', 'github: adccz/bkp-tmwmf'),
        ('Síťové Pexeso', 'Server v čistém C (TCP, select() multiplexing), klient v JavaFX, vlastní textový protokol, 2–4 hráči. KIV/UPS.',
         'C, TCP/IP, JavaFX, Maven', 'github: adccz/tmwmf_sem_UPS'),
        ('Další semestrální práce', 'emulátor počítače KMX v C (KIV/PC), virtuální souborový systém v C (KIV/ZOS), '
         'paralelní zpracování meteodat v C++ a OpenMP (KIV/UPP), 3D hra v C# a OpenTK (KIV/ZPG).',
         '', 'Soukromé repozitáře, přístup na vyžádání'),
    ],
    'skills': [
        ('Jazyky', 'PHP, C (pokročile); JavaScript, Java, C#, Python, SQL; C++ (základy)'),
        ('Web', 'Nette, Latte, HTML5 / CSS3 (pokročile); Tailwind CSS, React, Vue.js, Twig; Node.js (Express, Socket.IO)'),
        ('Nástroje', 'MySQL, Git a GitHub, Linux CLI, Vite, LaTeX; Docker, Make / CMake / Maven, pytest'),
        ('Další', 'TCP/IP sokety, REST API, WebSockety, OAuth 2.0, OpenMP, NFC, OpenGL / OpenTK, pandas, Power BI'),
        ('V plánu', 'TypeScript, Next.js, PostgreSQL, Spring Boot, GitHub Actions (CI/CD), testování (JUnit, Jest), Kubernetes, AWS / cloud'),
    ],
    'soft': [
        ('Vedení týmů a mentorství', 'Víceleté zkušenosti s koordinací regionálních aktivit mládežnické organizace, vedením vedoucích a prací s dětmi i dospívajícími.'),
        ('Projektový management a logistika', 'Tři tábory ve vedení a víkendové akce pro desítky účastníků: rozpočet a účetnictví, program, bezpečnost, zázemí.'),
        ('Zodpovědnost a adaptabilita', 'Řešení nečekaných situací a krizový management při náročných outdoorových a expedičních aktivitách.'),
    ],
    'languages': [('Čeština', 'rodilý mluvčí'), ('Angličtina', 'B2')],
    'certs': [],  # ('2025', 'Název kurzu', 'Organizace')
}

# ============================================================ FONTS
for name, file in [('Plex', 'PlexSans-400.ttf'), ('PlexB', 'PlexSans-600.ttf'), ('PlexI', 'PlexSans-400i.ttf'),
                   ('Michroma', 'Michroma-Regular.ttf'), ('Mono', 'CourierPrime-Regular.ttf'), ('MonoB', 'CourierPrime-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, os.path.join(HERE, 'fonts', file)))
pdfmetrics.registerFontFamily('Plex', normal='Plex', bold='PlexB', italic='PlexI', boldItalic='PlexB')
pdfmetrics.registerFontFamily('Mono', normal='Mono', bold='MonoB', italic='Mono', boldItalic='MonoB')

# ============================================================ PALETA (světlé téma webu)
PAPER = colors.HexColor('#f8f1e0')
PANEL = colors.HexColor('#fbf6ea')
INK = colors.HexColor('#221508')
INK2 = colors.HexColor('#6f5636')
LINE = colors.HexColor('#cdb88f')
ACCENT = colors.HexColor('#c8541a')
STAMP = colors.HexColor('#b83d1d')
WOOD = colors.HexColor('#3b2614')
CREAM = colors.HexColor('#f2e3c4')
AMBER = colors.HexColor('#ffb347')
SCREEN = colors.HexColor('#120b04')

W, H = A4
M = 16 * mm            # okraj
TOP_BAND = 9 * mm      # dřevěná lišta nahoře

# ============================================================ STYLY
S = {
    'name': ParagraphStyle('name', fontName='Michroma', fontSize=21, leading=25, textColor=INK),
    'role': ParagraphStyle('role', fontName='MonoB', fontSize=10.5, leading=14, textColor=ACCENT),
    'contact': ParagraphStyle('contact', fontName='Mono', fontSize=8.2, leading=11.5, textColor=INK2),
    'h': ParagraphStyle('h', fontName='Michroma', fontSize=9.5, leading=12, textColor=INK, spaceBefore=7, spaceAfter=2),
    'body': ParagraphStyle('body', fontName='Plex', fontSize=9, leading=12.6, textColor=INK),
    'body2': ParagraphStyle('body2', fontName='Plex', fontSize=8.6, leading=12, textColor=INK2),
    'mono': ParagraphStyle('mono', fontName='Mono', fontSize=8.4, leading=11.5, textColor=INK2),
    'monoInk': ParagraphStyle('monoInk', fontName='Mono', fontSize=8.6, leading=12, textColor=INK),
    'label': ParagraphStyle('label', fontName='Mono', fontSize=7.4, leading=10, textColor=INK2),
    'link': ParagraphStyle('link', fontName='Mono', fontSize=7.6, leading=10.5, textColor=INK2),
    'title': ParagraphStyle('title', fontName='PlexB', fontSize=9.4, leading=12.6, textColor=INK),
    'bullet': ParagraphStyle('bullet', fontName='Plex', fontSize=8.8, leading=12.2, textColor=INK2, leftIndent=9, bulletIndent=0),
}


def rule(color=ACCENT, thick=0.8, width=None, space=2):
    t = Table([['']], colWidths=[width or (W - 2 * M)], rowHeights=[1])
    t.setStyle(TableStyle([('LINEABOVE', (0, 0), (-1, -1), thick, color), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), space)]))
    return t


def stamp(c, x, y, text, angle=-7, size=7.5, color=STAMP):
    """razítko: rotovaný rámeček s textem"""
    c.saveState()
    c.translate(x, y)
    c.rotate(angle)
    c.setFont('MonoB', size)
    tw = pdfmetrics.stringWidth(text, 'MonoB', size) + 5 * size * 0.1
    pad_x, pad_y = 5, 3.5
    c.setStrokeColor(color)
    c.setLineWidth(1.4)
    c.roundRect(-pad_x, -pad_y, tw + 2 * pad_x, size + 2 * pad_y, 2, stroke=1, fill=0)
    c.setFillColor(color)
    # rozestupy mezi písmeny
    cx = 0
    for ch in text.upper():
        c.drawString(cx, 0.6, ch)
        cx += pdfmetrics.stringWidth(ch, 'MonoB', size) + size * 0.1
    c.restoreState()


def monitor(c, x, y, s=1.0):
    """služební monitor s obličejem (jako na webu)"""
    c.saveState()
    c.translate(x, y)
    c.scale(s, s)
    c.setFillColor(colors.HexColor('#e6d5ae')); c.setStrokeColor(LINE); c.setLineWidth(1)
    c.roundRect(0, 10, 60, 44, 4, stroke=1, fill=1)
    c.setFillColor(SCREEN); c.roundRect(6, 16, 48, 33, 2.5, stroke=0, fill=1)
    c.setStrokeColor(AMBER); c.setLineWidth(1.4); c.setFillColor(AMBER)
    c.circle(30, 34, 8, stroke=1, fill=0)
    c.circle(27.4, 35.3, 0.9, stroke=0, fill=1); c.circle(32.6, 35.3, 0.9, stroke=0, fill=1)
    p = c.beginPath(); p.moveTo(26.8, 31.6); p.curveTo(28.5, 29.4, 31.5, 29.4, 33.2, 31.6); c.drawPath(p, stroke=1, fill=0)
    p = c.beginPath(); p.moveTo(21, 20.5); p.curveTo(25, 26, 35, 26, 39, 20.5); c.drawPath(p, stroke=1, fill=0)
    c.line(30, 26.5, 30, 21.5)
    c.setFillColor(ACCENT); c.circle(50, 13.5, 1.1, stroke=0, fill=1)
    c.setFillColor(LINE); c.rect(24, 6, 12, 4, stroke=0, fill=1)
    c.setFillColor(WOOD); c.roundRect(14, 0, 32, 7, 1.5, stroke=0, fill=1)
    c.setFillColor(CREAM); c.setFont('Mono', 3.6); c.drawCentredString(30, 2.2, 'VARIANTA 01')
    c.restoreState()


def branches(c, x, y, w=190, h=78):
    """větvící se časová linie"""
    c.saveState()
    c.translate(x, y)
    main_y = h * 0.5
    c.setStrokeColor(ACCENT); c.setLineWidth(1.8); c.setLineCap(1)
    c.line(0, main_y, w * 0.78, main_y)
    c.setFont('Mono', 5.6); c.setFillColor(INK2); c.setLineWidth(0.7)
    for i, yr in enumerate(['2023', '2024', '2025', '2026']):
        xx = w * (0.1 + i * 0.2)
        c.setStrokeColor(INK2); c.line(xx, main_y - 3, xx, main_y + 3)
        c.drawCentredString(xx, main_y - 10, yr)
    lanes = [(h * 0.92, 0.06, 0.72, 'FAV ZČU'), (h * 0.74, 0.02, 0.64, 'Pathfinder'), (h * 0.26, 0.24, 0.6, 'Kód'), (h * 0.08, 0.38, 0.68, 'Kytara')]
    c.setLineWidth(1)
    for ly, bx, ex, label in lanes:
        bxp = w * bx; exp = w * ex
        c.setStrokeColor(ACCENT)
        p = c.beginPath(); p.moveTo(bxp, main_y); p.curveTo(bxp + 12, main_y, bxp + 12, ly, bxp + 24, ly); p.lineTo(exp, ly)
        c.drawPath(p, stroke=1, fill=0)
        c.setFillColor(PAPER); c.circle(bxp, main_y, 1.8, stroke=1, fill=1)
        c.setFillColor(PANEL); c.circle(exp, ly, 4.2, stroke=1, fill=1)
        c.setFillColor(INK2); c.setFont('Mono', 5.6); c.drawString(exp + 7, ly - 2, label)
    monitor(c, w * 0.8, main_y - 20, 0.72)
    c.restoreState()


# ============================================================ STRÁNKA (hravá verze)
def page_deco(c, doc):
    c.saveState()
    c.setFillColor(PAPER); c.rect(0, 0, W, H, stroke=0, fill=1)
    # dvojitý rámeček jako .panel
    c.setStrokeColor(LINE); c.setLineWidth(0.8)
    c.roundRect(M - 7 * mm, M - 7 * mm, W - 2 * M + 14 * mm, H - 2 * M + 14 * mm, 8, stroke=1, fill=0)
    c.setLineWidth(0.5)
    c.roundRect(M - 5.5 * mm, M - 5.5 * mm, W - 2 * M + 11 * mm, H - 2 * M + 11 * mm, 6, stroke=1, fill=0)
    # dřevěná lišta nahoře
    c.setFillColor(WOOD)
    c.roundRect(M - 5.5 * mm, H - M - TOP_BAND + 1.5 * mm, W - 2 * M + 11 * mm, TOP_BAND, 3, stroke=0, fill=1)
    c.setFillColor(CREAM); c.setFont('Mono', 6.8)
    yb = H - M - TOP_BAND + 1.5 * mm + 3.3 * mm
    c.setFillColor(AMBER); c.circle(M - 1.5 * mm, yb + 1.5, 1.6, stroke=0, fill=1)
    c.setFillColor(CREAM)
    c.drawString(M + 1.5 * mm, yb, 'ARCHIV ČASOVÝCH LINIÍ    spis varianty 01    ' + DATA['location'].upper())
    c.drawRightString(W - M + 3 * mm, yb, 'strana %d' % doc.page)
    # patička
    c.setFillColor(INK2); c.setFont('Mono', 6.6)
    c.drawString(M, M - 3.5 * mm, DATA['name'] + ', životopis')
    c.drawRightString(W - M, M - 3.5 * mm, 'neořezávat')
    c.restoreState()


class Header(Flowable):
    """hlavička: razítko, jméno, role, kontakt vlevo; časová linie vpravo"""
    def __init__(self):
        Flowable.__init__(self)
        self.width = W - 2 * M
        self.height = 98

    def draw(self):
        c = self.canv
        stamp(c, 0, self.height - 10, 'evidováno')
        c.setFont('Mono', 7.4); c.setFillColor(INK2); c.drawString(58, self.height - 9, 'spis varianty')
        c.setFont('Michroma', 21); c.setFillColor(INK)
        c.drawString(0, self.height - 36, DATA['first'])
        c.drawString(0, self.height - 60, DATA['last'])
        c.setFont('MonoB', 9.5); c.setFillColor(ACCENT); c.drawString(0, self.height - 75, '> ' + DATA['role'] + ', ' + DATA['location'].split(',')[0])
        c.setFont('Mono', 7.6); c.setFillColor(INK2)
        parts = [DATA['github']]
        for k in ('email', 'phone', 'web'):
            if DATA[k]: parts.append(DATA[k])
        c.drawString(0, self.height - 88, '   '.join(parts))
        branches(c, self.width - 205, 6)


class Memo(Flowable):
    """rámeček služebního záznamu (dvojitá linka), obsah v tabulce"""
    def __init__(self, table):
        Flowable.__init__(self); self.table = table
        self.width = W - 2 * M
        _, self.height = table.wrap(self.width - 16, 1000)
        self.height += 16

    def draw(self):
        c = self.canv
        c.setFillColor(PANEL); c.setStrokeColor(LINE); c.setLineWidth(0.8)
        c.roundRect(0, 0, self.width, self.height, 5, stroke=1, fill=1)
        c.setLineWidth(0.4); c.roundRect(3, 3, self.width - 6, self.height - 6, 3.5, stroke=1, fill=0)
        self.table.wrapOn(c, self.width - 16, self.height)
        self.table.drawOn(c, 8, 8)


def build_playful(path):
    doc = BaseDocTemplate(path, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=M + TOP_BAND, bottomMargin=M,
                          title=DATA['name'] + ', životopis', author=DATA['name'])
    frame = Frame(M, M, W - 2 * M, H - 2 * M - TOP_BAND, leftPadding=0, rightPadding=0, topPadding=6, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id='p', frames=[frame], onPage=page_deco)])
    s = []
    s.append(Header())
    s.append(rule(LINE, 0.6, space=6))

    # profil
    s.append(Paragraph('Profil', S['h'])); s.append(rule())
    s.append(Paragraph(DATA['profile'], S['body']))

    # vzdělání
    s.append(Paragraph('Vzdělání', S['h'])); s.append(rule())
    rows = [[Paragraph(p, S['mono']), Paragraph('<b>%s</b><br/><font color="#6f5636">%s</font>' % (t, '. '.join(x for x in (pl, n) if x)), S['body'])] for p, t, pl, n in DATA['education']]
    t = Table(rows, colWidths=[30 * mm, W - 2 * M - 30 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
                           ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
    s.append(t)

    # praxe
    s.append(Paragraph('Praxe', S['h'])); s.append(rule())
    rows = []
    for p, t_, org, bullets in DATA['experience']:
        cell = [Paragraph('<b>%s</b> <font color="#6f5636">%s</font>' % (t_, org), S['body'])]
        for b in bullets: cell.append(Paragraph(b, S['bullet'], bulletText='•'))
        rows.append([Paragraph(p, S['mono']), cell])
    t = Table(rows, colWidths=[30 * mm, W - 2 * M - 30 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
                           ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
    s.append(t)

    # rejstřík projektů
    s.append(Paragraph('Rejstřík projektů', S['h'])); s.append(rule())
    head = [Paragraph('Projekt', S['label']), Paragraph('Technologie', S['label']), Paragraph('Odkaz', S['label'])]
    rows = [head]
    for title, desc, tech, link in DATA['projects']:
        rows.append([[Paragraph(title, S['title']), Paragraph(desc, S['body2'])], Paragraph(tech, S['mono']), Paragraph(link, S['link'])])
    t = Table(rows, colWidths=[(W - 2 * M) * 0.5, (W - 2 * M) * 0.23, (W - 2 * M) * 0.27], repeatRows=1)
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                           ('TOPPADDING', (0, 0), (-1, -1), 3.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
                           ('LINEBELOW', (0, 0), (-1, 0), 0.6, LINE), ('LINEBELOW', (0, 1), (-1, -2), 0.4, LINE)]))
    s.append(t)

    # technologie
    rows = [[Paragraph(k, S['monoInk'] if k != 'V plánu' else S['mono']), Paragraph(v, S['mono'] if k == 'V plánu' else S['monoInk'])] for k, v in DATA['skills']]
    t = Table(rows, colWidths=[36 * mm, W - 2 * M - 36 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
                           ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
    s.append(KeepTogether([Paragraph('Technologie', S['h']), rule(), t]))

    # měkké dovednosti: služební záznam
    s.append(Paragraph('Měkké dovednosti', S['h'])); s.append(rule())
    memo_rows = [[Paragraph('Věc', S['label']), Paragraph('Organizační a měkké dovednosti', S['monoInk'])],
                 [Paragraph('Kde', S['label']), Paragraph('Klub Pathfinder, oblast Jižní kříž', S['monoInk'])],
                 [Paragraph('Období', S['label']), Paragraph('od 2018', S['monoInk'])]]
    for k, v in DATA['soft']:
        memo_rows.append([Paragraph('', S['label']), Paragraph('<b>%s.</b> <font color="#6f5636">%s</font>' % (k, v), S['body'])])
    mt = Table(memo_rows, colWidths=[18 * mm, W - 2 * M - 16 - 18 * mm])
    mt.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                            ('LINEBELOW', (0, 2), (-1, 2), 0.5, LINE), ('BOTTOMPADDING', (0, 2), (-1, 2), 6), ('TOPPADDING', (0, 3), (-1, 3), 6)]))
    s[-2:] = [KeepTogether([s[-2], s[-1], Memo(mt)])]

    # jazyky + certifikáty
    s.append(KeepTogether([Paragraph('Jazyky', S['h']), rule(), Paragraph(',  '.join('%s (%s)' % (l, lv) for l, lv in DATA['languages']), S['monoInk'])]))
    if DATA['certs']:
        s.append(Paragraph('Certifikáty a kurzy', S['h'])); s.append(rule())
        for y_, n_, o_ in DATA['certs']:
            s.append(Paragraph('<font name="Mono" color="#6f5636">%s</font>   <b>%s</b>, %s' % (y_, n_, o_), S['body']))

    class Approved(Flowable):
        def __init__(self): Flowable.__init__(self); self.width = W - 2 * M; self.height = 26
        def draw(self):
            stamp(self.canv, self.width - 78, 4, 'schváleno', angle=-6, size=8)
    s.append(Spacer(1, 6)); s.append(Approved())
    doc.build(s)


# ============================================================ STROHÁ VERZE (ATS)
def build_plain(path):
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=12 * mm, bottomMargin=11 * mm,
                            title=DATA['name'] + ', životopis', author=DATA['name'])
    n = ParagraphStyle('n', fontName='PlexB', fontSize=20, leading=24, textColor=INK)
    sub = ParagraphStyle('s', fontName='Plex', fontSize=9.5, leading=13, textColor=INK2)
    h = ParagraphStyle('h', fontName='PlexB', fontSize=10.5, leading=13, textColor=INK, spaceBefore=9, spaceAfter=2)
    body = ParagraphStyle('b', fontName='Plex', fontSize=9.4, leading=13, textColor=INK)
    bl = ParagraphStyle('bl', parent=body, leftIndent=9, bulletIndent=0)
    s = [Paragraph(DATA['name'], n)]
    parts = [DATA['role'], DATA['location'], DATA['github']] + [DATA[k] for k in ('email', 'phone', 'web') if DATA[k]]
    s.append(Paragraph(', '.join(parts), sub)); s.append(rule(INK, 0.6, W - 36 * mm, 4))
    s.append(Paragraph('Profil', h)); s.append(Paragraph(DATA['profile'], body))
    s.append(Paragraph('Vzdělání', h))
    for p, t, pl, note in DATA['education']: s.append(Paragraph('<b>%s</b>  %s, %s' % (p, t, '. '.join(x for x in (pl, note) if x)), body))
    s.append(Paragraph('Praxe', h))
    for p, t, org, bullets in DATA['experience']:
        s.append(Paragraph('<b>%s</b>, %s (%s)' % (t, org, p), body))
        for b in bullets: s.append(Paragraph(b, bl, bulletText='•'))
    s.append(Paragraph('Projekty', h))
    for t, d, tech, link in DATA['projects']:
        s.append(Paragraph('<b>%s:</b> %s <font color="#6f5636">%s</font>' % (t, d, ', '.join(x for x in (tech, link) if x)), bl, bulletText='•'))
    s.append(Paragraph('Technické dovednosti', h))
    for k, v in DATA['skills']: s.append(Paragraph('<b>%s:</b> %s' % (k, v), body))
    s.append(Paragraph('Měkké dovednosti', h))
    for k, v in DATA['soft']: s.append(Paragraph('<b>%s:</b> %s' % (k, v), bl, bulletText='•'))
    s.append(Paragraph('Jazyky', h)); s.append(Paragraph(', '.join('%s (%s)' % (l, lv) for l, lv in DATA['languages']), body))
    if DATA['certs']:
        s.append(Paragraph('Certifikáty a kurzy', h))
        for y_, n_, o_ in DATA['certs']: s.append(Paragraph('%s, %s, %s' % (n_, o_, y_), body))
    doc.build(s)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build_playful(os.path.join(OUT, 'cv.pdf'))
    build_plain(os.path.join(OUT, 'cv-plain.pdf'))
    print('hotovo: public/cv.pdf, public/cv-plain.pdf')
