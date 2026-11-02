"""Prepare public CMS content/media from the supplied Figma, PDF and Excel files.

Usage: python3 scripts/prepare-client-page.py --output /tmp/opencode/client-page-import
Requires Pillow, openpyxl and Poppler's pdfimages. Source workbooks are never modified.
Public overviews and the retired-organization list live in client-page-overviews.json.
"""
import argparse
import ast
import base64
from collections import Counter, defaultdict
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import textwrap
import xml.etree.ElementTree as ET
import zipfile

from openpyxl import load_workbook
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

REPO = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--sources', type=Path, default=REPO.parent)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
OUT = args.output.resolve()
OUT.mkdir(parents=True, exist_ok=True)
SVG = '{http://www.w3.org/2000/svg}'
XLINK = '{http://www.w3.org/1999/xlink}href'
profile_catalogue = json.loads((REPO / 'scripts/client-page-overviews.json').read_text())
excluded_names = {name.casefold() for name in profile_catalogue['excludedOrganizations']}

# Names are matched to the actual marks, including the Nichoa logo that was
# accidentally captioned National Geographic in the all-partners mockup.
# Categories come from the three category-specific Figma frames where available.
FIGMA_LOGOS = [
    ('Accenture', 'Client Page.svg', 1, 'event-collaboration'),
    ('Akkar', 'Client Page.svg', 2, 'client'),
    ('AlphaSights', 'Client Page-1.svg', 3, 'event-collaboration'),
    ('Arjuna EV UGM', 'Client Page-1.svg', 40, 'client'),
    ('Arthur D. Little', 'Client Page-1.svg', 4, 'event-collaboration'),
    ('Asdos.id', 'Client Page-1.svg', 5, 'client'),
    ('BCG', 'Client Page.svg', 6, 'event-collaboration'),
    ('Berbagi Beras', 'Client Page-1.svg', 7, 'client'),
    ('BLU by BCA Digital', 'Client Page.svg', 8, 'event-collaboration'),
    ('Bosch', 'Client Page-1.svg', 9, 'event-collaboration'),
    ('CIMB Niaga', 'Client Page.svg', 10, 'event-collaboration'),
    ('EconPeels', 'Client Page.svg', 11, 'client'),
    ('Extern', 'Client Page-1.svg', 12, 'event-collaboration'),
    ('FlashCampus', 'Client Page-1.svg', 13, 'client'),
    ('Foras Palestine', 'Client Page.svg', 14, 'client'),
    ('Garuda Hacks', 'Client Page-1.svg', 39, 'client'),
    ('Gili Eco Trust', 'Client Page.svg', 15, 'client'),
    ('Gores Denai', 'Client Page.svg', 16, 'client'),
    ('Kantar', 'Client Page.svg', 17, 'event-collaboration'),
    ('KitaBisa', 'Client Page.svg', 18, 'client'),
    ('McKinsey & Company', 'Client Page-1.svg', 19, 'event-collaboration'),
    ('National Geographic Society', 'Client Page.svg', 20, 'event-collaboration'),
    ('Nichoa Chocolate', 'Client Page-1.svg', 21, 'client'),
    ('ParagonCorp', 'Client Page.svg', 21, 'case-collaboration'),
    ('Planet Protector Packaging', 'Client Page-1.svg', 23, 'client'),
    ('PwC', 'Client Page-1.svg', 24, 'event-collaboration'),
    ('REAPRA', 'Client Page.svg', 24, 'event-collaboration'),
    ('Roland Berger', 'Client Page.svg', 25, 'event-collaboration'),
    ('Tersalur', 'Client Page-1.svg', 27, 'client'),
    ('The Nature Conservancy', 'Client Page-1.svg', 28, 'event-collaboration'),
    ('think-cell', 'Client Page-1.svg', 29, 'event-collaboration'),
    ('Unilever', 'Client Page.svg', 29, 'event-collaboration'),
    ('UNICEF BCRWG', 'Client Page-1.svg', 33, 'client'),
    ('VedaPraxis', 'Client Page.svg', 30, 'event-collaboration'),
    ('YCP', 'Client Page-1.svg', 32, 'event-collaboration'),
    ('Yayasan Green Books Indonesia', 'Client Page-1.svg', 35, 'client'),
    ('Yayasan Jalantara', 'Client Page-1.svg', 36, 'client'),
    ('Yayasan Pulih', 'Client Page-1.svg', 37, 'client'),
    ('Yayasan SATUNAMA', 'Client Page-1.svg', 38, 'client'),
    ('Young Leaders for Indonesia', 'Client Page-1.svg', 34, 'event-collaboration'),
    ('Adiandra Medika', 'Client Page-4.svg', 1, 'case-collaboration'),
    ('Gadjah Mada Business Case Competition', 'Client Page-4.svg', 4, 'case-collaboration'),
    ('Innovative Academy', 'Client Page-4.svg', 2, 'case-collaboration'),
    ('Kapal Api', 'Client Page-4.svg', 5, 'case-collaboration'),
    ('Skin Game', 'Client Page-5.svg', 2, 'event-collaboration'),
    ('SRE UGM', 'Client Page-5.svg', 3, 'event-collaboration'),
    ('PasteLab', 'Client Page-5.svg', 4, 'event-collaboration'),
    ('ESC', 'Client Page-6.svg', 1, 'media-partner'),
    ('FPCI UGM', 'Client Page-6.svg', 2, 'media-partner'),
    ('GAMA EXPO', 'Client Page-6.svg', 3, 'media-partner'),
    ('Gandeng Foundation', 'Client Page-6.svg', 4, 'media-partner'),
    ('SPE UGM', 'Client Page-6.svg', 5, 'media-partner'),
    ('StudentsXCEOs Yogyakarta', 'Client Page-6.svg', 7, 'media-partner'),
    ('StudentsXCEOs International Summit', 'Client Page-6.svg', 8, 'media-partner'),
    ('UGM Buddy Club', 'Client Page-6.svg', 9, 'media-partner'),
]

ALIASES = {
    'komunitas tersalur': 'Tersalur', 'tersalur': 'Tersalur',
    'ewasterj': 'EWasteRJ', 'econpeels': 'EconPeels',
    'gili eco': 'Gili Eco Trust', 'gili eco trust': 'Gili Eco Trust',
    'yayasan satunama': 'Yayasan SATUNAMA', 'yayasan satunama yogyakarta': 'Yayasan SATUNAMA',
    'foras palestine': 'Foras Palestine', 'akkar juice bar': 'Akkar',
    'berbagi beras indonesia': 'Berbagi Beras',
    'bentala': 'Bentala Fragrances', 'jalantara foundation': 'Yayasan Jalantara',
    'layar belajar (gores denai)': 'Gores Denai',
    'gores denai (yayasan generasi penggerak global)': 'Gores Denai',
    'bhumi mendha': 'Bhumi Mendha Farm', 'bhumi mendha farm': 'Bhumi Mendha Farm',
    'terra water indonesia': 'Terra Water', 'arjuna ev': 'Arjuna EV UGM',
    'oceankita': 'Sustenea / OceanKita', 'sustenea': 'Sustenea / OceanKita',
    'sustenea / oceankita': 'Sustenea / OceanKita',
    'africa acces water': 'Africa Access Water',
    'lestari magrove dan alam (leva)': 'LEVA',
}

SPOTLIGHTS = {
    'Yayasan SATUNAMA': {
        'challenge': 'Yayasan SATUNAMA faced challenges in optimizing its business processes and using its assets efficiently.',
        'solution': 'We developed a multi-stream business model, including structured farmer recruitment, fair profit-sharing schemes, and marketing. The approach emphasized strategic partnerships, detailed feasibility studies, and regulatory compliance.',
        'impact': 'We helped generate long-term revenue to fund SATUNAMA’s social programs, enhance land utilization, and empower local communities.',
    },
    'Foras Palestine': {
        'challenge': 'Foras needed to improve outreach and stakeholder engagement through marketing strategies while securing sustainable long-term funding.',
        'solution': 'We developed an expansion strategy combining diversified fundraising, strategic partnerships, and integrated marketing, including SEO refinement, a Graphic Standard Manual, and targeted communication.',
        'impact': 'We helped Foras secure sustainable funding channels, increase brand awareness, enhance market presence, and build stronger partnerships and credibility, leading to greater investor interest.',
    },
    'Gili Eco Trust': {
        'challenge': 'Gili Eco Trust faced challenges in fundraising, public awareness, and strategic partnerships.',
        'solution': 'We developed a strategy centered on a 5Es Framework for public awareness, media optimization, USP communication, infrastructure improvements, and a CSR-focused partnership strategy.',
        'impact': 'We helped Gili Eco Trust develop sustainable waste management by increasing community awareness and participation, boosting brand visibility, improving financial transparency, and securing vital CSR funding.',
    },
    'Akkar': {
        'challenge': 'Akkar faced ineffective brand communication and digital outreach, unpersonalized customer service and engagement, and limited product accessibility and consumer trust.',
        'solution': 'We developed an omnichannel marketing strategy focused on digital platform refinement, personalized bundles, and community engagement.',
        'impact': 'We helped Akkar boost brand awareness, customer loyalty, and sales. Consistent messaging, personalized service, and an emphasis on sustainability positioned Akkar as a trusted brand for eco-conscious customers.',
    },
    'Bentala Fragrances': {
        'challenge': 'Bentala needed a go-to-market strategy, stronger brand awareness and marketing, clearer brand positioning, and effective sales and distribution strategies.',
        'solution': 'We developed a phased omnichannel approach, starting with online marketing to engage scent explorers through curated discovery sets and influencer campaigns.',
        'impact': 'We helped Bentala build brand recognition, boost early conversions, and foster loyalty among signature-scent users. The plan enhances retention and promotes sustainability.',
    },
}

def canonical(name):
    name = str(name).strip()
    return ALIASES.get(name.casefold(), name)


def key(name):
    return re.sub(r'[^a-z0-9]+', '-', name.casefold()).strip('-')


def rows(filename):
    workbook = load_workbook(args.sources / 'Documents/Client Page' / filename, read_only=True, data_only=True)
    result = list(workbook.active.iter_rows(values_only=True))
    workbook.close()
    return result


def legacy_cases():
    source = subprocess.check_output(
        ['git', 'show', '1b536a4:src/components/modules/portofolio/PreviousClients.tsx'], cwd=REPO, text=True,
    )
    array = source.split('() => [', 1)[1].split('\n    ],', 1)[0]
    result = []
    for block in re.findall(r'\{\s*name:[\s\S]*?\n      \}', array):
        fields = dict((field, ast.literal_eval(value).strip()) for field, value in re.findall(
            r'(\w+):\s*("(?:\\.|[^"\\])*"|\x27(?:\\.|[^\x27\\])*\x27)', block,
        ))
        result.append(fields)
    if len(result) != 10:
        raise ValueError(f'Expected the 10 historical case studies, found {len(result)}')
    return result


records = {}
logo_images = {}
background_logo_images = {}
with zipfile.ZipFile(args.sources / 'UI-UX/Client Page/180DC Website 26_27.zip') as archive:
    trees = {}

    def figma(file, number):
        if file not in trees:
            trees[file] = ET.fromstring(archive.read(file))
        for element in trees[file].iter(SVG + 'image'):
            if element.get('id', '').startswith(f'image{number}_'):
                uri = element.get(XLINK, element.get('href', ''))
                return Image.open(io.BytesIO(base64.b64decode(uri.split(',', 1)[1]))).convert('RGBA')
        raise ValueError(f'Missing supplied image {number} in {file}')

    for name, file, number, category in FIGMA_LOGOS:
        if name.casefold() in excluded_names:
            continue
        records[key(name)] = {'name': name, 'category': category, 'isRecent': False}
        logo_images[key(name)] = figma(file, number)

# Only public organization attributes are carried over. Contact people, emails,
# phone numbers, banking details and commercial agreement data stay in the files.
acquisition = rows('R_Client_Acquisition_Management_1789726770.xlsx')
for row in acquisition:
    if len(row) < 12 or not row[0] or row[2] != 'Project Ready':
        continue
    name = canonical(row[0])
    identity = key(name)
    if name.casefold() in excluded_names:
        continue
    record = records.setdefault(identity, {'name': name, 'category': 'client', 'isRecent': False})
    record['category'] = 'client'

projects = [row for row in rows('R_Project_Tracker_1789726691.xlsx')
            if len(row) > 23 and row[0] and row[1] and row[0] != 'Name']
feedback = rows('R_Client_Feedback_1789726753.xlsx')
ratings = defaultdict(list)
csat = []
for row in feedback:
    if len(row) < 19 or not row[0] or row[0] == 'Name' or not row[2]:
        continue
    name = canonical(row[0])
    if row[17] is not None and str(row[17]).strip():
        ratings[key(name)].append(float(row[17]))
    if row[15] is not None and str(row[15]).strip():
        csat.append(str(row[15]).strip())
for identity, values in ratings.items():
    if identity in records:
        records[identity]['nps'] = round(sum(values) / len(values) * 10)

for item in legacy_cases():
    name = canonical(item['name'])
    if name.casefold() in excluded_names:
        continue
    identity = key(name)
    record = records.setdefault(identity, {'name': name, 'category': 'client'})
    record.update({
        'category': 'client', 'isRecent': True,
        'nps': int(item['nps'].strip('%')),
        'caseStudy': {'challenge': item['pleft'], 'solution': item['pcenter'], 'impact': item['pright']},
    })
    # Prefer the supplied Figma mark when it is available for this organization.
    if identity not in logo_images:
        logo_images[identity] = Image.open(REPO / 'public' / item['logo'].lstrip('/')).convert('RGBA')

# The deck's five published spotlight scores are intentionally preserved, per the
# owner's choice. They are separate from the workbook-based aggregate CSAT.
for name, case in SPOTLIGHTS.items():
    if name.casefold() in excluded_names:
        continue
    identity = key(name)
    record = records.setdefault(identity, {'name': name, 'category': 'client'})
    record.update({'category': 'client', 'nps': 100, 'isRecent': True,
                   'caseStudy': {field: case[field] for field in ('challenge', 'solution', 'impact')}})

# The Bentala mark is the small B monogram embedded on the fifth spotlight slide.
pdf = args.sources / 'Documents/Client Page/[English NEW] 180DC UGM Client Introduction 2026_2027.pdf'
wall_prefix = OUT / 'deck-wall'
result = subprocess.run(['pdfimages', '-f', '14', '-l', '14', '-png', str(pdf), str(wall_prefix)], capture_output=True)
if result.returncode:
    raise RuntimeError('Could not extract the supplied PDF client overview')

def wall_image(number):
    return Image.open(OUT / f'deck-wall-{number:03d}.png').convert('RGBA')

for name, number in [('360energy', 30), ('AturKuliner', 33), ('Students Catalyst', 34), ('RASA Corp', 39)]:
    logo_images[key(name)] = wall_image(number)

# The supplied white-backed SATUNAMA image is also embedded in the client deck.
# Keep the original mark as the input for its existing background composition.
satunama = key('Yayasan SATUNAMA')
if satunama in logo_images:
    background_logo_images[satunama] = logo_images[satunama].copy()
    logo_images[satunama] = wall_image(40)

# The full Terra wordmark in the PDF is damaged; its project-cover badge has a
# clean copy of the supplied mark, without the adjacent 180DC mark.
terra_cover = wall_image(49)
w, h = terra_cover.size
logo_images[key('Terra Water')] = terra_cover.crop((int(w*.071), int(h*.153), int(w*.177), int(h*.226)))

prefix = OUT / 'deck-page19'
result = subprocess.run(['pdfimages', '-f', '19', '-l', '19', '-png', str(pdf), str(prefix)], capture_output=True)
if result.returncode:
    raise RuntimeError('Could not extract the supplied spotlight PDF images')
for path in OUT.glob('deck-page19-*.png'):
    with Image.open(path) as image:
        if image.size == (132, 140):
            logo_images[key('Bentala Fragrances')] = image.convert('RGBA')
            break
if key('Bentala Fragrances') not in logo_images:
    raise ValueError('The Bentala logo was not found in the supplied PDF')

for identity, record in records.items():
    profile = profile_catalogue['overviews'].get(record['name'])
    if not profile or not profile.get('sources'):
        raise ValueError(f'Missing sourced company overview: {record["name"]}')
    description = profile['description'].strip()
    if len(description.split()) < 15:
        raise ValueError(f'Company overview must contain at least 15 words: {record["name"]}')
    record['description'] = description


def company_background(identity, name, logo):
    """The same subdued brand-background template for every organization.

    Only the supplied company mark, name and tint vary; there are no individual
    photographic or illustrated exceptions.
    """
    digest = hashlib.sha256(identity.encode()).digest()
    color = tuple(25 + channel // 5 for channel in digest[:3])
    canvas = Image.new('RGBA', (1360, 780), (*color, 255))
    if logo is not None:
        expanded = ImageOps.fit(logo, canvas.size).filter(ImageFilter.GaussianBlur(18))
        canvas = Image.alpha_composite(canvas, Image.blend(Image.new('RGBA', canvas.size), expanded, .32))
    else:
        # A supplied organization name is used as typographic background art;
        # it is not uploaded as a fabricated logo.
        draw = ImageDraw.Draw(canvas)
        try:
            font = ImageFont.truetype('DejaVuSans.ttf', 66)
        except OSError:
            font = ImageFont.load_default(size=60)
        draw.multiline_text((560, 230), '\n'.join(textwrap.wrap(name, 19)), font=font, fill=(190, 220, 200, 180), spacing=18)
    return canvas.convert('RGB')


missing_logos = []
for identity, record in sorted(records.items()):
    logo = logo_images.get(identity)
    if logo is not None:
        logo = logo.copy()
        logo.thumbnail((1024, 1024))
        logo_path = OUT / f'{identity}-logo.webp'
        logo.save(logo_path, format='WEBP', lossless=True)
        record['logoFile'] = logo_path.name
    else:
        missing_logos.append(record['name'])
    background = company_background(identity, record['name'], background_logo_images.get(identity, logo))
    background_path = OUT / f'{identity}-background.webp'
    background.save(background_path, format='WEBP', quality=88)
    record['backgroundFile'] = background_path.name

public_records = sorted(records.values(), key=lambda r: r['name'].casefold())
summary = {
    'organizations': len(public_records),
    'logos': len(logo_images),
    'missingSuppliedLogos': missing_logos,
    'recentCases': sum(bool(r.get('isRecent')) for r in public_records),
    'backgroundTemplate': 'company-brand',
    'minimumDescriptionWords': min(len(r['description'].split()) for r in public_records),
    'maximumDescriptionWords': max(len(r['description'].split()) for r in public_records),
    'categories': dict(Counter(r['category'] for r in public_records)),
    'csatSatisfied': sum(label in ('Satisfied', 'Very Satisfied') for label in csat),
    'csatResponses': len(csat),
    'csatPercent': round(sum(label in ('Satisfied', 'Very Satisfied') for label in csat) / len(csat) * 100, 1),
    'trackedProjects': len(projects),
    'trackedCompletedProjects': sum(row[23] == 'Complete' for row in projects),
    'sources': {
        'figma': 'UI-UX/Client Page/180DC Website 26_27.zip',
        'spotlights': 'Documents/Client Page/[English NEW] 180DC UGM Client Introduction 2026_2027.pdf, pages 15–19',
        'legacyCases': '1b536a4:src/components/modules/portofolio/PreviousClients.tsx',
        'companyOverviews': 'scripts/client-page-overviews.json',
    },
}
(OUT / 'manifest.json').write_text(json.dumps({
    'summary': summary,
    'partners': public_records,
    'removePartners': profile_catalogue['excludedOrganizations'],
}, ensure_ascii=False, indent=2))
print(json.dumps(summary, ensure_ascii=False, indent=2))
