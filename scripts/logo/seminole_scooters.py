import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from outline import text, arc_text
TEAL, ORANGE, CREAM, INK = "#0d5560", "#ee7a24", "#fbf3e4", "#0d5560"
def wrap(w, h, title, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h}" width="{w:.0f}" height="{h}"><title>{title}</title>\n{body}\n</svg>\n'
def scooter(c=TEAL, wheel=TEAL, hub=CREAM, seat=None, outline=None):
    # Classic step-through scooter, side view facing right, in a 120 x 96 box.
    seat = seat or c
    st = f' stroke="{outline}" stroke-width="3" stroke-linejoin="round" paint-order="stroke"' if outline else ""
    return f'''<g{st}>
<path fill="{c}" d="M8 70C8 57 15 49 28 47L56 45C63 45 65 51 61 57L56 64H80C83 52 86 38 89 28L85 25C84 23 85 21 87 21H101C103 21 103 24 101 24L95 26C96 38 100 51 107 59C111 63 112 67 111 71H99C98 64 92 60 86 61C81 62 78 66 77 71H41C40 64 35 60 28 60C21 60 16 64 15 70Z"/>
<path fill="{seat}" d="M22 45C23 39 28 37 35 37H57C61 37 63 40 62 44L22 45Z"/>
<circle cx="28" cy="73" r="12" fill="{wheel}"/><circle cx="28" cy="73" r="5" fill="{hub}"/>
<circle cx="89" cy="73" r="12" fill="{wheel}"/><circle cx="89" cy="73" r="5" fill="{hub}"/>
<circle cx="104" cy="50" r="3" fill="{hub}"/>
</g>'''
def logo_a(teal=TEAL, orange=ORANGE):
    x = 138
    d1, w1 = text("archivo", "SEMINOLE", 44, x, 50, 1.0, wght=900, wdth=72)
    d2, w2 = text("archivo", "SCOOTERS", 44, x + w1 + 10, 50, 1.0, wght=900, wdth=72)
    sd, sw = text("archivo", "SALES · SERVICE · PINELLAS PARK", 12, x + 2, 76, 3.0, wght=700, wdth=100)
    W = x + max(w1 + 10 + w2, sw) + 6
    lines = f'<path stroke="{orange}" stroke-width="4" stroke-linecap="round" d="M2 52H14M0 60H10M4 68H12"/>'
    body = (f'<g transform="translate(16 0)">{scooter(teal, teal, CREAM, orange)}</g>{lines}'
            f'<path fill="{teal}" d="{d1}"/><path fill="{orange}" d="{d2}"/>'
            f'<path fill="{teal}" d="{sd}"/>'
            f'<rect x="{x}" y="58" width="{w1 + 10 + w2:.1f}" height="4" rx="2" fill="{orange}"/>')
    return wrap(W, 96, "Seminole Scooters", body)
def logo_b(teal=TEAL, orange=ORANGE, cream=CREAM):
    top = arc_text("outfit", "SEMINOLE SCOOTERS", 16, 100, 100, 75, 2.4, wght=700)
    bot = arc_text("outfit", "SALES & SERVICE", 13, 100, 100, 88, 3.2, bottom=True, wght=600)
    dot = lambda x: f'<circle cx="{x}" cy="100" r="3.5" fill="{orange}"/>'
    # Sun setting behind the scooter, inside the badge.
    inner = (f'<clipPath id="ss-c"><circle cx="100" cy="100" r="64"/></clipPath>'
             f'<g clip-path="url(#ss-c)"><rect width="200" height="200" fill="{cream}"/>'
             f'<circle cx="100" cy="112" r="40" fill="{orange}"/>'
             f'<path d="M30 121H170" stroke="{teal}" stroke-width="3"/>'
             f'<path d="M36 131H164M50 140H150" stroke="{teal}" stroke-width="2.4" opacity=".5"/></g>'
             f'<g transform="translate(47 54) scale(0.88)">{scooter(teal, teal, cream, orange, cream)}</g>')
    seal = (f'<circle cx="100" cy="100" r="98" fill="{teal}"/>'
            f'<circle cx="100" cy="100" r="92" fill="none" stroke="{cream}" stroke-width="1.3"/>'
            f'{inner}<path fill="{cream}" d="{top}{bot}"/>{dot(16)}{dot(184)}')
    return wrap(200, 200, "Seminole Scooters", seal)

def logo_c(teal="#145e63", yellow="#ffc94a", orange="#ff8a3d", pink="#ef5b84", bg=None):
    """St. Pete 'Sunshine City': striped retro sunset, a palm, the scooter cruising by, groovy italic."""
    size = 50
    d, w = text("fraunces-italic", "Seminole Scooters", size, 0, 0, -0.5, wght=800, opsz=144, SOFT=100, WONK=1)
    W = max(w + 24, 330)
    cx = W / 2
    d, _ = text("fraunces-italic", "Seminole Scooters", size, cx, 152, -0.5, anchor="middle", wght=800, opsz=144, SOFT=100, WONK=1)
    sd, sw = text("outfit", "SALES & SERVICE · PINELLAS PARK", 11.5, cx, 178, 3.4, anchor="middle", wght=600)
    r, cy = 62, 104
    # Sunset: three color bands, with cut-out stripes that get thicker toward the horizon.
    gaps = [(70, 2.5), (80, 3.5), (89, 4.5), (97, 5.5)]
    mask = "".join(f'<rect x="0" y="{y}" width="{W:.0f}" height="{h}" fill="#000"/>' for y, h in gaps)
    sun = (f'<defs><clipPath id="sp-c"><path d="M{cx-r} {cy}A{r} {r} 0 0 1 {cx+r} {cy}Z"/></clipPath>'
           f'<mask id="sp-m"><rect width="{W:.0f}" height="200" fill="#fff"/>{mask}</mask></defs>'
           f'<g clip-path="url(#sp-c)"><g mask="url(#sp-m)">'
           f'<rect x="{cx-r}" y="{cy-r}" width="{2*r}" height="{r-34}" fill="{yellow}"/>'
           f'<rect x="{cx-r}" y="{cy-34}" width="{2*r}" height="17" fill="{orange}"/>'
           f'<rect x="{cx-r}" y="{cy-17}" width="{2*r}" height="17" fill="{pink}"/></g></g>')
    horizon = f'<path d="M{cx-118:.1f} {cy+1}H{cx+118:.1f}" stroke="{teal}" stroke-width="3" stroke-linecap="round"/>'
    px = cx + 62
    palm = (f'<g stroke="{teal}" fill="none" stroke-linecap="round">'
            f'<path d="M{px} {cy}C{px-2} {cy-22} {px+4} {cy-44} {px+12} {cy-62}" stroke-width="5"/>'
            f'<path d="M{px+12} {cy-62}C{px-6} {cy-74} {px-22} {cy-66} {px-28} {cy-54}M{px+12} {cy-62}C{px+2} {cy-80} {px+18} {cy-90} {px+30} {cy-86}'
            f'M{px+12} {cy-62}C{px+30} {cy-72} {px+44} {cy-62} {px+46} {cy-48}M{px+12} {cy-62}C{px-10} {cy-62} {px-18} {cy-46} {px-18} {cy-38}'
            f'M{px+12} {cy-62}C{px+26} {cy-56} {px+30} {cy-42} {px+28} {cy-34}" stroke-width="4.5"/></g>')
    ride = f'<g transform="translate({cx-112:.1f} {cy-56}) scale(0.62)">{scooter(teal, teal, bg or "#fff8ec", pink)}</g>'
    body = sun + palm + horizon + ride + f'<path fill="{teal}" d="{d}"/><path fill="{pink}" d="{sd}"/>'
    return wrap(W, 190, "Seminole Scooters", body)

if __name__ == "__main__":
    out = sys.argv[1]
    open(f"{out}/option-a.svg", "w").write(logo_a())
    open(f"{out}/option-b.svg", "w").write(logo_b())
    open(f"{out}/option-a-mono.svg", "w").write(logo_a("#1b1b1b", "#1b1b1b"))
    open(f"{out}/option-b-mono.svg", "w").write(logo_b("#1b1b1b", "#1b1b1b", "#ffffff"))
    open(f"{out}/scooter.svg", "w").write(wrap(120, 96, "mark", scooter()))
    open(f"{out}/option-c-stpete.svg", "w").write(logo_c())
    open(f"{out}/option-c-stpete-mono.svg", "w").write(logo_c("#1b1b1b", "#1b1b1b", "#1b1b1b", "#1b1b1b", "#fff"))
