"""Turn text into SVG outline paths (with kerning), so logos look the same everywhere."""
import io, os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = {
    "archivo": os.path.join(HERE, "fonts", "archivo-latin-standard-normal.woff2"),
    "outfit": os.path.join(HERE, "fonts", "outfit-latin-wght-normal.woff2"),
    "zilla": os.path.join(HERE, "fonts", "zilla-slab-latin-700-normal.woff2"),
}
_c = {}

def font(name, **axes):
    key = (name, tuple(sorted(axes.items())))
    if key not in _c:
        f = TTFont(FONTS[name])
        if "fvar" in f and axes:
            f = instancer.instantiateVariableFont(f, axes)
        f.flavor = None
        b = io.BytesIO(); f.save(b); data = b.getvalue()
        _c[key] = (TTFont(io.BytesIO(data)), hb.Font(hb.Face(data)))
    return _c[key]

def cap_height(name, size, **axes):
    f, _ = font(name, **axes)
    return f["OS/2"].sCapHeight * size / f["head"].unitsPerEm

def text(name, s, size, x=0, y=0, track=0, anchor="start", **axes):
    """Returns (path d, width). y is the baseline."""
    f, hf = font(name, **axes)
    sc = size / f["head"].unitsPerEm
    buf = hb.Buffer(); buf.add_str(s); buf.guess_segment_properties()
    hb.shape(hf, buf, {"kern": True, "liga": True})
    order, gs = f.getGlyphOrder(), f.getGlyphSet()
    w = sum(p.x_advance * sc + track for p in buf.glyph_positions) - track
    if anchor == "middle": x -= w / 2
    if anchor == "end": x -= w
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    cx = 0
    for i, p in zip(buf.glyph_infos, buf.glyph_positions):
        gs[order[i.codepoint]].draw(TransformPen(pen, (sc, 0, 0, -sc, x + cx + p.x_offset * sc, y - p.y_offset * sc)))
        cx += p.x_advance * sc + track
    return pen.getCommands(), w

def arc_text(name, s, size, cx, cy, r, track=0, bottom=False, **axes):
    """Text around a circle, centred on the top (reading clockwise) or the bottom (reading left to
    right, letters upright). r is the baseline radius."""
    import math
    f, hf = font(name, **axes)
    sc = size / f["head"].unitsPerEm
    buf = hb.Buffer(); buf.add_str(s); buf.guess_segment_properties()
    hb.shape(hf, buf, {"kern": True})
    order, gs = f.getGlyphOrder(), f.getGlyphSet()
    advs = [p.x_advance * sc for p in buf.glyph_positions]
    L = sum(advs) + track * (len(advs) - 1)
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    s_off = 0
    for i, a in zip(buf.glyph_infos, advs):
        mid = (s_off + a / 2) / r
        if bottom:
            th = math.pi / 2 + (L / 2) / r - mid; ph = th - math.pi / 2
        else:
            th = -math.pi / 2 - (L / 2) / r + mid; ph = th + math.pi / 2
        px, py = cx + r * math.cos(th), cy + r * math.sin(th)
        c, si = math.cos(ph), math.sin(ph)
        gs[order[i.codepoint]].draw(TransformPen(pen, (sc * c, sc * si, sc * si, -sc * c, px - a / 2 * c, py - a / 2 * si)))
        s_off += a + track
    return pen.getCommands()
