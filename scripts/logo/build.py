import sys; import os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from outline import text
H=96
def svg(mark, name, sub, ink, subc, name_size=44, mark_w=88):
    nx=mark_w+18
    nd,nw=text('serif',620,name,name_size,-0.4,nx,52)
    sd,sw=text('sans',700,sub,12.5,3.2,nx+2,75)
    W=round(nx+max(nw,sw+2)+4)
    return W,f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<title>{name} {sub.title().replace("&","&amp;")}</title>
{mark}
<path fill="{ink}" d="{nd}"/>
<path fill="{subc}" d="{sd}"/>
</svg>'''

# Pelican Point: navy roundel, white drop, coral wave + highlight
pel='''<defs><linearGradient id="pp-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d5b86"/><stop offset="1" stop-color="#0f3352"/></linearGradient>
<clipPath id="pp-d"><path d="M44 18C44 18 24 41 24 56a20 20 0 0 0 40 0C64 41 44 18 44 18Z"/></clipPath></defs>
<rect x="4" y="6" width="80" height="84" rx="24" fill="url(#pp-g)"/>
<path d="M44 18C44 18 24 41 24 56a20 20 0 0 0 40 0C64 41 44 18 44 18Z" fill="#fff"/>
<g clip-path="url(#pp-d)"><path d="M18 60q7-6 13 0t13 0 13 0 13 0V80H18Z" fill="#ef6b4d"/><path d="M18 67q7-6 13 0t13 0 13 0 13 0V80H18Z" fill="#d9513a"/></g>
<path d="M34 50a10 10 0 0 1 5-9" fill="none" stroke="#bfe0f4" stroke-width="4" stroke-linecap="round"/>'''
# Timberline: cool back peak, warm front peak, snow cap, wind line
tim='''<defs><linearGradient id="tl-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c9ec4"/><stop offset="1" stop-color="#2f6c93"/></linearGradient>
<linearGradient id="tl-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9573a"/><stop offset="1" stop-color="#8f3622"/></linearGradient>
<linearGradient id="tl-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3c8"/><stop offset="1" stop-color="#f6efe7"/></linearGradient>
<clipPath id="tl-c"><circle cx="46" cy="48" r="42"/></clipPath></defs>
<circle cx="46" cy="48" r="42" fill="url(#tl-s)"/>
<g clip-path="url(#tl-c)">
<circle cx="66" cy="34" r="7" fill="#f2b56b"/>
<path d="M56 30 100 96H12Z" fill="url(#tl-b)" stroke="url(#tl-b)" stroke-width="4" stroke-linejoin="round"/>
<path d="M56 30l9 13.5-5-3-4 4-4-4-5 3Z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
<path d="M32 42 76 100H-12Z" fill="url(#tl-f)" stroke="url(#tl-f)" stroke-width="4" stroke-linejoin="round"/>
<path d="M32 42l8.4 11-4.6-2.6-3.8 3.6-3.8-3.6-4.6 2.6Z" fill="#fde9dc" stroke="#fde9dc" stroke-width="2" stroke-linejoin="round"/>
<path d="M-4 78q12-5 24 0t24 0 24 0 24 0" fill="none" stroke="#f6efe7" stroke-width="3.2" stroke-linecap="round" opacity=".9"/>
</g>'''
# Prairie Oak: sun over horizon, oak leaf
oak='''<defs><clipPath id="po-c"><circle cx="46" cy="48" r="42"/></clipPath>
<linearGradient id="po-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a9a55"/><stop offset="1" stop-color="#2f5a2b"/></linearGradient></defs>
<circle cx="46" cy="48" r="42" fill="#f3efe1"/>
<g clip-path="url(#po-c)"><circle cx="70" cy="62" r="14" fill="#e3ad45"/>
<path d="M0 70q24-8 46-3t50-2V96H0Z" fill="#c7d6a6"/>
<path d="M43 46h6l1.5 26h-9Z" fill="#6b4a2b"/><path d="M46 56l-8-6M46 54l7-7" stroke="#6b4a2b" stroke-width="3" stroke-linecap="round"/>
<g fill="url(#po-l)"><circle cx="46" cy="30" r="14"/><circle cx="33" cy="38" r="12"/><circle cx="59" cy="38" r="12"/><circle cx="38" cy="26" r="10"/><circle cx="54" cy="26" r="10"/><circle cx="46" cy="44" r="12"/><circle cx="28" cy="48" r="9"/><circle cx="64" cy="48" r="9"/></g>
<path d="M0 78q30-7 52-2t44 0V96H0Z" fill="#8fb06f"/></g>'''
for slug,mark,name,sub,ink,subc in [
 ("pelican-plumbing",pel,"Pelican Point","PLUMBING","#0f3352","#c2452c"),
 ("timberline-air",tim,"Timberline","HEATING & AIR","#3a2318","#2f6c93"),
 ("prairie-oak",oak,"Prairie Oak","LANDSCAPE CO.","#24401f","#7a5a14"),
]:
    W,s=svg(mark,name,sub,ink,subc)
    open(f"public/offices/{slug}/logo.svg","w").write(s); print(slug,W)
