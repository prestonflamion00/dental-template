"""Generates the local placeholder art in /public (doctor portraits, gallery, sample PDF).
Run once: python3 scripts/make-placeholders.py — replace the outputs with real photos per office."""
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")

def doctor(fname, bg1, bg2, skin, hair, shirt, hair_style):
    hair_paths = {
        "long": '<path d="M140 168c-8-62 28-104 70-104s80 40 72 104c6 40 14 86 32 112-36 10-66-6-80-30h-56c-14 24-44 40-80 30 18-26 34-72 42-112z" fill="%s"/>' % hair,
        "short": '<path d="M144 160c-6-56 26-92 66-92s74 34 68 92c-6-22-20-36-36-42-22 8-52 10-82 2-8 10-14 24-16 40z" fill="%s"/>' % hair,
        "bun": '<circle cx="210" cy="62" r="26" fill="%s"/><path d="M142 168c-6-58 26-96 68-96s76 38 70 96c-8-26-24-44-44-50-24 10-54 10-78 2-10 12-14 30-16 48z" fill="%s"/>' % (hair, hair),
    }[hair_style]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 440" width="420" height="440">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/></linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.2" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="coat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef0ef"/></linearGradient>
  </defs>
  <rect width="420" height="440" fill="url(#bg)"/>
  <rect width="420" height="440" fill="url(#glow)"/>
  <circle cx="330" cy="90" r="70" fill="#fff" opacity=".18"/>
  <path d="M60 440c4-92 60-140 150-140s146 48 150 140z" fill="url(#coat)"/>
  <path d="M180 300l30 70 30-70z" fill="{shirt}"/>
  <path d="M150 312l60 128M270 312l-60 128" stroke="#dfe3e1" stroke-width="3"/>
  <rect x="186" y="232" width="48" height="74" rx="22" fill="{skin}"/>
  <path d="M186 268c14 10 34 10 48 0v20c-14 10-34 10-48 0z" fill="#000" opacity=".08"/>
  {hair_paths}
  <ellipse cx="210" cy="178" rx="62" ry="74" fill="{skin}"/>
  {'' if hair_style=='long' else ''}
  <path d="M148 150c10-44 40-66 62-66s56 18 66 66c-20-26-44-34-66-34s-46 8-62 34z" fill="{hair}"/>
  <circle cx="298" cy="392" r="10" fill="{shirt}" opacity=".9"/>
</svg>'''
    open(os.path.join(ROOT, "doctors", fname), "w").write(svg)

doctor("doctor-1.svg", "#efe2d6", "#d9c6b6", "#c99a7a", "#3b2a22", "#7aa59a", "short")
doctor("doctor-2.svg", "#f3dfdc", "#e2c5c2", "#e9c3a6", "#6b4a32", "#c98d98", "long")
doctor("doctor-3.svg", "#dfe8e2", "#c5d6cc", "#8d5d43", "#1f1714", "#8fb1c9", "bun")

def smile(fname, after, variant):
    # Lips + a row of teeth. "Before" teeth are warmer/uneven; "after" are brighter/aligned.
    tooth = "#fbf8f1" if after else "#eadfc4"
    gap_shift = [0, 0, 0, 0, 0, 0] if after else [[0, 4, -3, 0, 5, -2], [0, 0, 0, 0, 0, 0], [3, -4, 6, -5, 4, -3]][variant]
    chip = (not after) and variant == 1
    bg1, bg2 = [("#f6e7dc", "#ead2c3"), ("#f3e3e4", "#e4cbcd"), ("#e6eee8", "#d1dfd6")][variant]
    teeth = []
    widths = [36, 42, 52, 52, 42, 36]
    x = 210 - sum(widths) / 2
    for i, w in enumerate(widths):
        y = 150 + gap_shift[i]
        h = 58 if i in (2, 3) else 52
        d = f'<rect x="{x+1.5:.1f}" y="{y}" width="{w-3}" height="{h}" rx="10" fill="{tooth}"/>'
        if chip and i == 3:
            d += f'<path d="M{x+w-3:.1f} {y+h-18} l-14 18 h14z" fill="#b5555f"/>'
        teeth.append(d)
        x += w
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 315" width="420" height="315">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/></linearGradient>
    <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4848c"/><stop offset="1" stop-color="#b8656f"/></linearGradient>
  </defs>
  <rect width="420" height="315" fill="url(#bg)"/>
  <circle cx="340" cy="60" r="90" fill="#fff" opacity=".22"/>
  <path d="M70 160c40-46 90-56 140-40 50-16 100-6 140 40-40 70-90 96-140 96s-100-26-140-96z" fill="url(#lip)"/>
  <path d="M96 162c36-20 76-24 114-16 38-8 78-4 114 16-30 44-70 64-114 64s-84-20-114-64z" fill="#7a3b43"/>
  <g>{''.join(teeth)}</g>
</svg>'''
    open(os.path.join(ROOT, "gallery", fname), "w").write(svg)

for v in range(3):
    smile(f"before-{v+1}.svg", False, v)
    smile(f"after-{v+1}.svg", True, v)

# Minimal one-page PDF for the "Download new patient forms" mock.
text = [
    "New Patient Forms (sample)",
    "",
    "This is a placeholder file for the website template demo.",
    "Replace /public/forms/new-patient-forms.pdf with the practice's real",
    "intake, medical history and HIPAA acknowledgement forms,",
    "or link newPatientFormsUrl to an online intake service.",
]
lines = ["BT", "/F1 22 Tf", "72 720 Td", f"({text[0]}) Tj", "/F1 12 Tf"]
for t in text[1:]:
    lines += ["0 -22 Td", f"({t}) Tj"]
lines.append("ET")
stream = "\n".join(lines).encode()
objs = [
    b"<< /Type /Catalog /Pages 2 0 R >>",
    b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
    b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
]
out = b"%PDF-1.4\n"
offsets = []
for i, o in enumerate(objs, 1):
    offsets.append(len(out))
    out += b"%d 0 obj\n" % i + o + b"\nendobj\n"
xref = len(out)
out += b"xref\n0 %d\n0000000000 65535 f \n" % (len(objs) + 1)
for off in offsets:
    out += b"%010d 00000 n \n" % off
out += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objs) + 1, xref)
open(os.path.join(ROOT, "forms", "new-patient-forms.pdf"), "wb").write(out)
print("placeholders written")
