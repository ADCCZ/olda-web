# -*- coding: utf-8 -*-
"""
Generátor životopisu.

    python3 scripts/cv.py

Vytvoří:
  public/cv.pdf        – hravá verze ve stylu webu (papírový spis, razítka, časová linie)
  public/cv-plain.pdf  – strohá verze pro personální systémy (ATS), obsah a pořadí stejné, jen bez grafiky

Fakta bere přímo z webu (src/data/content.ts, přes scripts/export-content.mjs), takže PDF
a web říkají totéž: jméno a titul, role, kontakty, adresa webu, fotka, vzdělání, praxe
(nadpisy, období, organizace), technologie podle úrovní, plány, měkké dovednosti (názvy),
zájmy a kurzy. Po úpravě webu stačí skript znovu spustit.

V bloku PDF níže jsou jen zhuštěné texty, které se musí vejít na stránku (profil, body praxe,
výběr projektů, krátké popisy měkkých dovedností), a jazyky, které web neukazuje.

Časová linie v hlavičce má stejné větve jako na webu: geometrii čte ze src/components/Branches.tsx
(osa, pruhy, roky) a ikony ze src/components/Icons.tsx.

Potřebuje: Node 22+ (čte content.ts), pip install reportlab pillow svglib. Písma jsou ve scripts/fonts/.
"""
import io
import json
import os
import re
import subprocess

from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table,
                                TableStyle, Flowable, KeepTogether, SimpleDocTemplate, Image)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
OUT = os.path.join(ROOT, 'public')


# ============================================================ DATA Z WEBU
def load_web():
    """česká data webu jako slovník (viz scripts/export-content.mjs)"""
    out = subprocess.run(['node', os.path.join(HERE, 'export-content.mjs')], cwd=ROOT,
                         capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


WEB = load_web()


def bare(url):
    """adresa bez https:// pro zobrazení"""
    return url.replace('https://', '').replace('http://', '').replace('mailto:', '').rstrip('/')


def esc(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


# ============================================================ PDF (zhuštěné texty)
PDF = {
    'profile': ('Junior full-stack vývojář, který věci dotahuje do posledního puntíku. Absolvent bakalářského '
                'studia informatiky na FAV ZČU se zaměřením na vývoj webových aplikací a softwarové inženýrství. '
                'Baví mě celá cesta od návrhu architektury přes backend a databáze po detail v rozhraní; za hotové '
                'považuju až to, co je otestované a funguje. Nové věci se učím rád (díky školním projektům NFC, '
                'OpenMP, OpenGL). Zodpovědnost beru vážně i jako oblastní vedoucí v Klubu Pathfinder. '
                'Hledám stáž nebo částečný úvazek.'),
    # body praxe podle nadpisu na webu; praxe, která tu chybí, se vezme s body z webu
    'experience': {
        'Oblastní vedoucí, oblast Jižní kříž': [
            'Vedení oblasti: oddíly a vedoucí, účetnictví, víkendové akce. Tábory: 1× programový, 2× hlavní vedoucí.',
        ],
        'Frontend samoobslužného kiosku': [
            'Týmový projekt na zakázku, kiosek pro firemní akce. Moje část: frontend ve Vue.js, NFC, design a UX/UI.',
        ],
        'Dobrovolník, security': [
            'Security na festivalu United (2023, 2025), pravidelně na akcích United City.',
        ],
        'Strojírenská praxe na střední škole': [
            'Dvakrát 14 dní: montáž testovacích zařízení pro displeje Audi a Renault podle výkresů a Inventoru, '
            'ruční dokončování dílů, skladová evidence.',
        ],
    },
    # výběr projektů: repozitář (název, štítky a odkaz se vezmou z webu) a krátký popis
    'projects': [
        ('campmaster-3000', 'Dashboard pro řízení táborové hry: trasy na mapě, týmy, pravidla, bodování v reálném čase. Semestrální projekt KIV/UUR.'),
        ('web_oblastni-stranky_jk', 'Web oblasti Jižní kříž Klubu Pathfinder, ve vývoji: autentizace, registrace na akce, správa multimediálního obsahu.'),
        ('bkp-tmwmf', 'Bakalářský projekt: ETL pipeline nad daty ČSÚ, MŠMT a MPSV, 15 grafů a Power BI report.'),
        ('tmwmf_sem_UPS', 'Server v čistém C (TCP, select() multiplexing), klient v JavaFX, vlastní textový protokol, 2–4 hráči. KIV/UPS.'),
    ],
    'projects_more': ('Další semestrální práce',
                      'emulátor počítače KMX v C (KIV/PC), virtuální souborový systém v C (KIV/ZOS), paralelní zpracování '
                      'meteodat v C++ a OpenMP (KIV/UPP), 3D hra v C# a OpenTK (KIV/ZPG), rozvoz jídla v PHP a Twig (KIV/WEB), '
                      '10 úloh z testování softwaru (KIV/OKS).',
                      '', 'Soukromé repozitáře, přístup na vyžádání'),
    # krátké popisy měkkých dovedností podle nadpisu na webu
    'soft': {
        'Vedení týmů a mentorství': 'Od 2018 vedu děti a mladé, od 2024 celou oblast Jižní kříž: koordinace vedoucích, pomoc s programem, předávání zkušeností.',
        'Projektový management a logistika': 'Tábor je projekt se vším všudy: rozpočet, harmonogram, tým i rizika. Tři tábory ve vedení a víkendové akce pro desítky účastníků.',
        'Zodpovědnost a klid pod tlakem': 'V nečekané situaci zachovat klid, rychle se rozhodnout a věc dotáhnout – na táboře, na skalách i v security na festivalu United.',
    },
    'languages': [('Čeština', 'rodilý mluvčí'), ('Angličtina', 'B2')],
}

# ------------------------------------------------------------ odvozené z webu
NAME = '%s %s' % (WEB['academicTitle'], WEB['fullName'])                      # Bc. Oldřich Jan Švehla
NAME_LINES = ('%s %s %s' % (WEB['academicTitle'], WEB['firstName'], WEB['middleName']), WEB['lastName'])
ROLE = WEB['hero']['role']                                                     # Junior full-stack vývojář, Plzeň
# kontakty: (zobrazený text, odkaz)
CONTACTS = [(bare(WEB['github']), WEB['github'])]
if WEB.get('email'): CONTACTS.append((WEB['email'], 'mailto:' + WEB['email']))
if WEB.get('site'): CONTACTS.append((bare(WEB['site']), WEB['site']))
if WEB.get('phone'): CONTACTS.append((WEB['phone'], 'tel:' + WEB['phone'].replace(' ', '')))
if WEB.get('linkedin'): CONTACTS.append((bare(WEB['linkedin']), WEB['linkedin']))

EDUCATION = [(e['period'], e['title'], e['place'], e.get('note', '')) for e in WEB['education']['items']]
EXPERIENCE = [(e['period'], e['title'], e['org'].replace(' · ', ', '), PDF['experience'].get(e['title'], e['bullets']), e['org'].split(' · ')[0])
              for e in WEB['experience']['items']]

_projects = {p['repo']: p for p in WEB['projects']['items'] if p.get('repo')}


def _project(repo, desc):
    p = _projects[repo]
    url = p.get('live') or '%s/%s' % (WEB['github'], repo)
    return (p['title'], desc, ', '.join(p['tags']), bare(url), url)


PROJECTS = [_project(r, d) for r, d in PDF['projects']] + [PDF['projects_more'] + (None,)]

# technologie: úrovně z webu → „(pokročile)“, bez popisku, „(základy)“, „(vyzkoušeno)“
LEVEL_WORD = {5: 'expert', 4: 'pokročile', 3: '', 2: 'základy', 1: 'vyzkoušeno'}


def skill_line(items):
    parts = []
    for lvl in sorted({i['level'] for i in items}, reverse=True):
        names = ', '.join(i['name'] for i in items if i['level'] == lvl)
        parts.append('%s (%s)' % (names, LEVEL_WORD[lvl]) if LEVEL_WORD[lvl] else names)
    return '; '.join(parts)


SKILLS = [(g['name'], skill_line(g['items'])) for g in WEB['skills']['groups']]
PLANNED = (WEB['skills']['plannedLabel'], ', '.join(WEB['skills']['planned']))
SOFT = [(i['title'], PDF['soft'].get(i['title'], i['desc'])) for i in WEB['leadership']['items']]
MEMO = WEB['leadership']['memo']
INTERESTS = ', '.join(i['label'] for i in WEB['about']['interests'])
CERTS = [(c['year'], c['name'], c['org']) for c in WEB.get('certs', [])]


def photo_reader():
    """fotka z webu (výřez bez pozadí) oříznutá na obsah, pro reportlab"""
    im = PILImage.open(WEB['photo']).convert('RGBA')
    im = im.crop(im.getbbox())
    buf = io.BytesIO(); im.save(buf, 'PNG'); buf.seek(0)
    return buf, im.size


# ------------------------------------------------------------ časová linie a ikony z webu
def _read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f: return f.read()


def load_branches():
    """osa, hlavní linie, pruhy a roky ze src/components/Branches.tsx"""
    src = _read('src/components/Branches.tsx')
    num = lambda name: float(re.search(r'const %s = (\d+)' % name, src).group(1))
    axis = [tuple(map(float, m)) for m in re.findall(r'\[(\d+(?:\.\d+)?), (\d+(?:\.\d+)?)\]', re.search(r'const AXIS[^=]*= (\[.*?\]\])', src).group(1))]
    lanes = [dict(y=float(y), bx=float(bx), ex=float(ex), label=lab) for y, bx, ex, lab in
             re.findall(r"\{ y: (\d+), bx: at\(([\d.]+)\), ex: (\d+), label: '(\w+)' \}", src)]
    years = [int(y) for y in re.search(r'const YEARS = \[([\d, ]+)\]', src).group(1).split(',')]
    assert axis and len(lanes) == len(WEB['hero']['orbit']) and years, 'Branches.tsx: změnil se formát, uprav load_branches()'
    return dict(W=num('W'), MAIN_Y=num('MAIN_Y'), VB_Y=num('VB_Y'), VB_H=num('VB_H'), axis=axis, lanes=lanes, years=years)


def load_icons():
    """ikony větví ze src/components/Icons.tsx jako SVG (id → text SVG)"""
    src = _read('src/components/Icons.tsx')
    bodies = dict(re.findall(r'export const (\w+) = \(p: SVGProps<SVGSVGElement>\) => \(\s*<svg \{\.\.\.base\(p\)\}>(.*?)</svg>\s*\)', src, re.S))
    mapping = dict(re.findall(r'(\w+): (\w+)', re.search(r'interestIcon = \{(.*?)\}', src, re.S).group(1)))
    head = ('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#221508" '
            'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">')
    return {k: head + bodies[v] + '</svg>' for k, v in mapping.items() if v in bodies}


BR = load_branches()
ICONS = load_icons()


def axis_x(year):
    """rok → x na ose webu (stejné jako at() v Branches.tsx)"""
    ax = BR['axis']
    for (y0, x0), (y1, x1) in zip(ax, ax[1:]):
        if year <= y1: return x0 + (year - y0) / (y1 - y0) * (x1 - x0)
    return ax[-1][1]


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

W, H = A4
M = 16 * mm            # okraj
TOP_BAND = 9 * mm      # dřevěná lišta nahoře

# ============================================================ STYLY
S = {
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


def link(text, url, color=None, wrap=0):
    """klikací odkaz v odstavci; wrap = zalomit dlouhou adresu za posledním lomítkem"""
    if not url: return esc(text)
    if wrap and len(text) > wrap and '/' in text:
        head, tail = text.rsplit('/', 1)
        return link(head + '/', url, color) + '<br/>' + link(tail, url, color)
    inner = '<font color="%s">%s</font>' % (color, esc(text)) if color else esc(text)
    return '<a href="%s">%s</a>' % (url, inner)


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


def evidence_photo(c, x, y, w, h):
    """fotka ve spisu: rámeček s okrajem, sponka nahoře, štítek varianty dole (jako monitor na webu)"""
    buf, (pw, ph) = photo_reader()
    c.saveState()
    c.translate(x + w / 2, y + h / 2); c.rotate(2); c.translate(-w / 2, -h / 2)
    c.setFillColor(colors.HexColor('#fffaf0')); c.setStrokeColor(LINE); c.setLineWidth(0.8)
    c.rect(0, 0, w, h, stroke=1, fill=1)
    pad, plate = 4, 9
    iw, ih = w - 2 * pad, h - 2 * pad - plate
    scale = min(iw / pw, ih / ph)
    dw, dh = pw * scale, ph * scale
    c.drawImage(ImageReader(buf), pad + (iw - dw) / 2, pad + plate + (ih - dh), dw, dh, mask='auto')
    c.setFillColor(WOOD); c.rect(pad, pad, iw, plate - 2, stroke=0, fill=1)
    c.setFillColor(CREAM); c.setFont('Mono', 5); c.drawCentredString(w / 2, pad + 2.2, WEB['hero']['plate'])
    # kancelářská sponka
    c.setStrokeColor(INK2); c.setLineWidth(1.1); c.setLineCap(1)
    p = c.beginPath(); p.moveTo(w * 0.62, h - 14); p.lineTo(w * 0.62, h + 6); p.arcTo(w * 0.62, h + 2, w * 0.62 + 8, h + 10, 180, -180)
    p.lineTo(w * 0.62 + 8, h - 10); p.arcTo(w * 0.62 + 2, h - 13, w * 0.62 + 8, h - 7, 0, -180); p.lineTo(w * 0.62 + 2, h + 2)
    c.drawPath(p, stroke=1, fill=0)
    c.restoreState()


def branches(c, x, y, w, h, end_x):
    """časová linie jako na webu (Branches.tsx) v obdélníku x, y, w × h; hlavní linie vede až k fotce (end_x).
    Vodorovně a svisle má jiné měřítko, uzly a písmo mají pevnou velikost."""
    kx = w / (BR['W'] - 30)
    ky = h / BR['VB_H']
    X = lambda wx: x + (wx - 10) * kx
    Y = lambda wy: y + h - (wy - BR['VB_Y']) * ky
    my = Y(BR['MAIN_Y'])
    r, fs = 5.6, 5.8
    c.saveState()
    # roky
    c.setFont('Mono', 5.4); c.setFillColor(INK2); c.setStrokeColor(INK2); c.setLineWidth(0.6)
    for yr in BR['years']:
        xx = X(axis_x(yr)); c.line(xx, my - 2.5, xx, my + 2.5); c.drawCentredString(xx, my - 8.5, str(yr))
    # hlavní linie
    c.setStrokeColor(ACCENT); c.setLineWidth(1.8); c.setLineCap(1)
    c.line(X(10), my, end_x, my)
    # větve: bx = odbočení podle roku, pruh y, konec ex; popisek vpravo se musí vejít před fotku
    for b, L in zip(WEB['hero']['orbit'], BR['lanes']):
        bx, ly = X(axis_x(L['bx'])), Y(L['y'])
        ex = X(L['ex'])
        if L['label'] == 'right':
            ex = min(ex, x + w - r - 3 - pdfmetrics.stringWidth(b['label'], 'Mono', fs))
        c.setStrokeColor(ACCENT); c.setLineWidth(1)
        p = c.beginPath(); p.moveTo(bx, my)
        p.curveTo(bx + 34 * kx, my, bx + 34 * kx, ly, bx + 68 * kx, ly); p.lineTo(ex, ly)
        c.drawPath(p, stroke=1, fill=0)
        c.setFillColor(PAPER); c.setLineWidth(1.2); c.circle(bx, my, 1.9, stroke=1, fill=1)
        c.setFillColor(PANEL); c.setLineWidth(0.9); c.circle(ex, ly, r, stroke=1, fill=1)
        if b['id'] in ICONS:
            d = svg2rlg(io.BytesIO(ICONS[b['id']].encode('utf-8')))
            sc = 2 * r * 0.66 / 24
            d.scale(sc, sc); d.width, d.height = 24 * sc, 24 * sc
            renderPDF.draw(d, c, ex - 12 * sc, ly - 12 * sc)
        c.setFillColor(INK2); c.setFont('Mono', fs)
        if L['label'] == 'right': c.drawString(ex + r + 3, ly - fs * 0.35, b['label'])
        elif L['label'] == 'above': c.drawCentredString(ex, ly + r + 2.2, b['label'])
        else: c.drawCentredString(ex, ly - r - fs - 0.6, b['label'])
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
    c.drawString(M + 1.5 * mm, yb, 'ARCHIV ČASOVÝCH LINIÍ    %s %s    %s' % (WEB['hero']['hello'], WEB['hero']['plate'].split()[-1], WEB['location'].upper()))
    c.drawRightString(W - M + 3 * mm, yb, 'strana %d' % doc.page)
    # patička
    c.setFillColor(INK2); c.setFont('Mono', 6.6)
    c.drawString(M, M - 3.5 * mm, NAME + ', životopis')
    c.drawRightString(W - M, M - 3.5 * mm, 'neořezávat')
    c.restoreState()


class Header(Flowable):
    """hlavička: razítko, jméno s titulem, role, klikací kontakty vlevo; časová linie a fotka vpravo"""
    PHOTO_W, PHOTO_H = 74, 92

    def __init__(self):
        Flowable.__init__(self)
        self.width = W - 2 * M
        self.height = 122

    def draw(self):
        c = self.canv
        stamp(c, 0, self.height - 10, WEB['hero']['stamp'])
        c.setFont('Mono', 7.4); c.setFillColor(INK2); c.drawString(58, self.height - 9, WEB['hero']['hello'])
        c.setFont('Michroma', 21); c.setFillColor(INK)
        c.drawString(0, self.height - 40, NAME_LINES[0])
        c.drawString(0, self.height - 66, NAME_LINES[1])
        c.setFont('MonoB', 9.5); c.setFillColor(ACCENT); c.drawString(0, self.height - 84, '> ' + ROLE)
        # kontakty: každý je odkaz (web, e-mail, GitHub…); leží pod časovou linií
        c.setFont('Mono', 7.6); c.setFillColor(INK2)
        x, y = 0, 6
        for text, url in CONTACTS:
            tw = pdfmetrics.stringWidth(text, 'Mono', 7.6)
            c.drawString(x, y, text)
            c.linkURL(url, (x, y - 2, x + tw, y + 8), relative=1, thickness=0)
            x += tw + 12
        px = self.width - self.PHOTO_W
        evidence_photo(c, px, 10, self.PHOTO_W, self.PHOTO_H)
        x0 = pdfmetrics.stringWidth(NAME_LINES[0], 'Michroma', 21) + 16
        branches(c, x0, 18, px - 8 - x0, self.height - 20, end_x=px + 2)


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
                          title=NAME + ', životopis', author=NAME)
    frame = Frame(M, M, W - 2 * M, H - 2 * M - TOP_BAND, leftPadding=0, rightPadding=0, topPadding=6, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id='p', frames=[frame], onPage=page_deco)])
    s = []
    s.append(Header())
    s.append(rule(LINE, 0.6, space=6))

    # profil
    s.append(Paragraph('Profil', S['h'])); s.append(rule())
    s.append(Paragraph(PDF['profile'], S['body']))

    # vzdělání
    s.append(Paragraph(WEB['education']['title'], S['h'])); s.append(rule())
    rows = [[Paragraph(p, S['mono']), Paragraph('<b>%s</b><br/><font color="#6f5636">%s</font>' % (t, '. '.join(x for x in (pl, n) if x)), S['body'])] for p, t, pl, n in EDUCATION]
    t = Table(rows, colWidths=[30 * mm, W - 2 * M - 30 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
                           ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
    s.append(t)

    # praxe
    s.append(Paragraph(WEB['experience']['title'], S['h'])); s.append(rule())
    rows = []
    for p, t_, org, bullets, _ in EXPERIENCE:
        cell = [Paragraph('<b>%s</b> <font color="#6f5636">%s</font>' % (t_, org), S['body'])]
        for b in bullets: cell.append(Paragraph(b, S['bullet'], bulletText='•'))
        rows.append([Paragraph(p, S['mono']), cell])
    t = Table(rows, colWidths=[30 * mm, W - 2 * M - 30 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
                           ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
    s.append(t)

    # kurzy (z webu)
    if CERTS:
        rows = [[Paragraph(y_, S['mono']), Paragraph('<b>%s</b> <font color="#6f5636">%s</font>' % (n_, o_), S['body'])] for y_, n_, o_ in CERTS]
        t = Table(rows, colWidths=[30 * mm, W - 2 * M - 30 * mm])
        t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                               ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
        s.append(KeepTogether([Paragraph(WEB['certsTitle'], S['h']), rule(), t]))

    # rejstřík projektů
    s.append(Paragraph('Rejstřík projektů', S['h'])); s.append(rule())
    head = [Paragraph('Projekt', S['label']), Paragraph('Technologie', S['label']), Paragraph('Odkaz', S['label'])]
    rows = [head]
    for title, desc, tech, link_text, url in PROJECTS:
        rows.append([[Paragraph(title, S['title']), Paragraph(desc, S['body2'])], Paragraph(tech, S['mono']), Paragraph(link(link_text, url, '#c8541a', wrap=28), S['link'])])
    t = Table(rows, colWidths=[(W - 2 * M) * 0.5, (W - 2 * M) * 0.23, (W - 2 * M) * 0.27], repeatRows=1)
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                           ('TOPPADDING', (0, 0), (-1, -1), 3.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
                           ('LINEBELOW', (0, 0), (-1, 0), 0.6, LINE), ('LINEBELOW', (0, 1), (-1, -2), 0.4, LINE)]))
    s.append(t)

    # technologie (úrovně z webu) + plány
    rows = [[Paragraph(k, S['monoInk']), Paragraph(v, S['monoInk'])] for k, v in SKILLS]
    rows.append([Paragraph(PLANNED[0], S['mono']), Paragraph(PLANNED[1], S['mono'])])
    t = Table(rows, colWidths=[36 * mm, W - 2 * M - 36 * mm])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
                           ('LINEBELOW', (0, 0), (-1, -2), 0.4, LINE)]))
    s.append(KeepTogether([Paragraph(WEB['skills']['title'], S['h']), rule(), t]))

    # měkké dovednosti: služební záznam
    memo_rows = [[Paragraph(MEMO['subject'], S['label']), Paragraph(MEMO['subjectValue'], S['monoInk'])],
                 [Paragraph(MEMO['where'], S['label']), Paragraph(MEMO['whereValue'], S['monoInk'])],
                 [Paragraph(MEMO['period'], S['label']), Paragraph(MEMO['periodValue'], S['monoInk'])]]
    for k, v in SOFT:
        memo_rows.append([Paragraph('', S['label']), Paragraph('<b>%s.</b> <font color="#6f5636">%s</font>' % (k, v), S['body'])])
    mt = Table(memo_rows, colWidths=[18 * mm, W - 2 * M - 16 - 18 * mm])
    mt.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                            ('LINEBELOW', (0, 2), (-1, 2), 0.5, LINE), ('BOTTOMPADDING', (0, 2), (-1, 2), 6), ('TOPPADDING', (0, 3), (-1, 3), 6)]))
    s.append(KeepTogether([Paragraph(WEB['leadership']['title'], S['h']), rule(), Memo(mt)]))

    # jazyky a zájmy
    s.append(KeepTogether([Paragraph('Jazyky', S['h']), rule(), Paragraph(',  '.join('%s (%s)' % (l, lv) for l, lv in PDF['languages']), S['monoInk'])]))
    s.append(KeepTogether([Paragraph('Zájmy', S['h']), rule(), Paragraph(INTERESTS, S['monoInk'])]))

    class Approved(Flowable):
        def __init__(self): Flowable.__init__(self); self.width = W - 2 * M; self.height = 26
        def draw(self):
            stamp(self.canv, self.width - 78, 4, 'schváleno', angle=-6, size=8)
    s.append(Spacer(1, 6)); s.append(Approved())
    doc.build(s)


# ============================================================ STROHÁ VERZE (ATS)
def build_plain(path):
    """stejný obsah a pořadí jako hravá verze, jen bez grafiky (pro personální systémy)"""
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=14 * mm, bottomMargin=14 * mm,
                            title=NAME + ', životopis', author=NAME)
    n = ParagraphStyle('n', fontName='PlexB', fontSize=20, leading=24, textColor=INK)
    sub = ParagraphStyle('s', fontName='Plex', fontSize=9.5, leading=13, textColor=INK2)
    h = ParagraphStyle('h', fontName='PlexB', fontSize=10.5, leading=13, textColor=INK, spaceBefore=9, spaceAfter=2)
    body = ParagraphStyle('b', fontName='Plex', fontSize=9.4, leading=13, textColor=INK)
    muted = ParagraphStyle('m', parent=body, textColor=INK2)
    bl = ParagraphStyle('bl', parent=body, leftIndent=9, bulletIndent=0)
    full = W - 36 * mm

    # hlavička: vlevo jméno, role a klikací kontakty, vpravo fotka
    buf, (pw, ph) = photo_reader()
    photo_h = 26 * mm
    photo = Image(buf, width=photo_h * pw / ph, height=photo_h, mask='auto')
    contacts = ' · '.join(link(t, u) for t, u in CONTACTS)
    left = [Paragraph(NAME, n), Paragraph(esc(ROLE), sub), Paragraph(contacts, sub)]
    head = Table([[left, photo]], colWidths=[full - photo.drawWidth, photo.drawWidth])
    head.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                              ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    s = [head, Spacer(1, 2), rule(INK, 0.6, full, 2)]

    s.append(Paragraph('Profil', h)); s.append(Paragraph(PDF['profile'], body))
    s.append(Paragraph(WEB['education']['title'], h))
    for p, t, pl, note in EDUCATION:
        s.append(Paragraph('<b>%s</b>  %s, %s' % (p, t, '. '.join(x for x in (pl, note) if x)), body))
    s.append(Paragraph(WEB['experience']['title'], h))
    for p, t, org, bullets, _ in EXPERIENCE:
        s.append(Paragraph('<b>%s</b>, %s (%s)' % (t, org, p), body))
        for b in bullets: s.append(Paragraph(b, bl, bulletText='•'))
    if CERTS:
        s.append(Paragraph(WEB['certsTitle'], h))
        for y_, n_, o_ in CERTS: s.append(Paragraph('<b>%s</b>, %s (%s)' % (n_, o_, y_), body))
    s.append(Paragraph('Projekty', h))
    for t, d, tech, link_text, url in PROJECTS:
        s.append(Paragraph('<b>%s:</b> %s <font color="#6f5636">%s</font>' % (t, d, ', '.join(x for x in (tech, link(link_text, url)) if x)), bl, bulletText='•'))
    s.append(Paragraph(WEB['skills']['title'], h))
    for k, v in SKILLS: s.append(Paragraph('<b>%s:</b> %s' % (k, v), body))
    s.append(Paragraph('<b>%s:</b> %s' % PLANNED, muted))
    s.append(Paragraph(WEB['leadership']['title'], h))
    s.append(Paragraph('%s: %s, %s' % (MEMO['subjectValue'], MEMO['whereValue'], MEMO['periodValue']), muted))
    for k, v in SOFT: s.append(Paragraph('<b>%s:</b> %s' % (k, v), bl, bulletText='•'))
    s.append(Paragraph('Jazyky', h)); s.append(Paragraph(', '.join('%s (%s)' % (l, lv) for l, lv in PDF['languages']), body))
    s.append(Paragraph('Zájmy', h)); s.append(Paragraph(INTERESTS, body))
    doc.build(s)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build_playful(os.path.join(OUT, 'cv.pdf'))
    build_plain(os.path.join(OUT, 'cv-plain.pdf'))
    print('hotovo: public/cv.pdf, public/cv-plain.pdf')
