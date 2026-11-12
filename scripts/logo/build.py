"""Demo logos. Run from the repo root: python3 scripts/logo/build.py [--preview DIR]
Each one: flat colours, one idea from the business's name, its own font, works in one colour."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from outline import text

def wrap(w, h, title, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h}" width="{w:.0f}" height="{h}">\n'
            f'<title>{title}</title>\n{body}\n</svg>\n')

# ---------- Pelican Point Plumbing: a pelican, truck-door lettering ----------
def pelican(navy="#13365a", coral="#e2562f", paper="#fff"):
    mark = f'''<g>
<path fill="{navy}" d="M18 94C23 76 29 62 26 48C24 40 22 33 24 26A11.2 11.2 0 0 1 43 15L90 30Q96 32 93 37L45 30C42 46 45 64 56 94Z"/>
<path fill="{coral}" d="M45 30L92.5 36.5Q79 53 57 51Q46 47 45 30Z"/>
<circle cx="33" cy="20.5" r="2.6" fill="{paper}"/>
</g>'''
    x = 104
    nd, nw = text("archivo", "Pelican Point", 41, x, 50, -0.6, wght=850, wdth=112)
    sd, sw = text("archivo", "PLUMBING · ST. PETE", 12.5, 0, 0, 2.6, wght=750, wdth=110)
    bar_w = nw
    sx = x + (bar_w - sw) / 2
    sd, _ = text("archivo", "PLUMBING · ST. PETE", 12.5, sx, 76.5, 2.6, wght=750, wdth=110)
    body = (mark + f'\n<g transform="skewX(-7) translate(7 0)"><path fill="{navy}" d="{nd}"/>'
            f'<rect x="{x}" y="60" width="{bar_w:.1f}" height="22" rx="3" fill="{coral}"/>'
            f'<path fill="{paper}" d="{sd}"/></g>')
    return wrap(x + nw + 10, 96, "Pelican Point Plumbing", body), mark

# ---------- Timberline Heating & Air: where the trees stop ----------
def timberline(navy="#1c3a52", rust="#b4472a"):
    zig = "M0 61" + "".join(f"L{6 + i * 12} 50L{12 + i * 12} 61" for i in range(8)) + "L96 96L0 96Z"
    mark = f'''<defs><clipPath id="tl-m"><path d="M4 88L48 8L92 88Z"/></clipPath></defs>
<g clip-path="url(#tl-m)"><path fill="{navy}" d="M0 0H96V45H0Z"/><path fill="{rust}" d="{zig}"/></g>'''
    x, base, size = 106, 52, 38
    d1, w1 = text("outfit", "TIMBER", size, x, base, 3.2, wght=700)
    d2, w2 = text("outfit", "LINE", size, x + w1 + 3.2, base, 3.2, wght=300)
    nd, nw = d1 + d2, w1 + 3.2 + w2
    sd, sw = text("outfit", "HEATING & AIR", 12.5, x + 1, 76, 4.2, wght=600)
    body = mark + f'\n<path fill="{navy}" d="{nd}"/><path fill="{rust}" d="{sd}"/>'
    return wrap(x + max(nw, sw) + 6, 96, "Timberline Heating &amp; Air", body), mark

# ---------- Prairie Oak Landscape Co.: an acorn, seed-company stamp ----------
def prairie(green="#2d4a2b", wheat="#b57f22"):
    hatch = "".join(f'<path d="M{i} 0L{i + 60} 60" />' for i in range(-50, 96, 9))
    mark = f'''<defs><mask id="po-h"><rect width="96" height="96" fill="#fff"/><g stroke="#000" stroke-width="2.4">{hatch}</g></mask></defs>
<path fill="{green}" d="M45 4h7l-1 12h-6Z"/>
<path fill="{green}" mask="url(#po-h)" d="M12 48Q12 16 48 15Q84 16 84 48Q84 52 80 52H16Q12 52 12 48Z"/>
<path fill="{wheat}" d="M21 56H75Q75 82 48 93Q21 82 21 56Z"/>'''
    x = 100
    nd, nw = text("zilla", "PRAIRIE OAK", 36, x, 46, 1.6)
    sd, sw = text("zilla", "LANDSCAPE CO.", 12, 0, 0, 3.4)
    mid = x + nw / 2
    sd, _ = text("zilla", "LANDSCAPE CO.", 12, mid - sw / 2, 68, 3.4)
    ed, ew = text("zilla", "EST. 2015 · CARMEL, IND.", 8.5, mid, 86, 2.2, anchor="middle")
    gap = sw / 2 + 10
    rules = (f'<path stroke="{wheat}" stroke-width="1.6" d="M{x:.1f} 64H{mid - gap:.1f}M{mid + gap:.1f} 64H{x + nw:.1f}"/>'
             f'<circle cx="{mid - gap + 3:.1f}" cy="64" r="0" />')
    body = mark + f'\n<path fill="{green}" d="{nd}"/>{rules}<path fill="{green}" d="{sd}"/><path fill="{wheat}" d="{ed}"/>'
    return wrap(x + nw + 4, 96, "Prairie Oak Landscape Co.", body), mark

LOGOS = {"pelican-plumbing": pelican, "timberline-air": timberline, "prairie-oak": prairie}

if __name__ == "__main__":
    prev = sys.argv[sys.argv.index("--preview") + 1] if "--preview" in sys.argv else None
    for slug, fn in LOGOS.items():
        svg, mark = fn()
        if prev:
            open(os.path.join(prev, f"{slug}.svg"), "w").write(svg)
            mono, _ = fn(*(["#1b1b1b"] * (fn.__code__.co_argcount - (1 if fn is pelican else 0))), *(["#fff"] if fn is pelican else []))
            open(os.path.join(prev, f"{slug}-mono.svg"), "w").write(mono)
            open(os.path.join(prev, f"{slug}-icon.svg"), "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">{mark}</svg>')
        else:
            open(f"public/offices/{slug}/logo.svg", "w").write(svg)
        print(slug, svg.split('width="')[1].split('"')[0])
