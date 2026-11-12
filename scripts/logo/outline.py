import io
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb
import os
NM=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","..","node_modules","@fontsource-variable")+"/"
FONTS={"serif":NM+"fraunces/files/fraunces-latin-wght-normal.woff2","sans":NM+"dm-sans/files/dm-sans-latin-wght-normal.woff2"}
_c={}
def font(kind,wght):
    k=(kind,wght)
    if k not in _c:
        f=TTFont(FONTS[kind]); loc={"wght":wght}
        for a in f["fvar"].axes:
            if a.axisTag=="opsz": loc["opsz"]=a.maxValue if kind=="serif" else a.defaultValue
            if a.axisTag=="SOFT": loc["SOFT"]=50
        f=instancer.instantiateVariableFont(f,loc); f.flavor=None
        b=io.BytesIO(); f.save(b); data=b.getvalue()
        _c[k]=(TTFont(io.BytesIO(data)),hb.Font(hb.Face(data)))
    return _c[k]
def text(kind,wght,s,size,track=0,x=0,y=0,anchor="start"):
    f,hf=font(kind,wght); upm=f["head"].unitsPerEm; sc=size/upm
    buf=hb.Buffer(); buf.add_str(s); buf.guess_segment_properties()
    hb.shape(hf,buf,{"kern":True,"liga":True})
    order=f.getGlyphOrder(); gs=f.getGlyphSet()
    w=sum(p.x_advance*sc+track for p in buf.glyph_positions)-track
    if anchor=="middle": x-=w/2
    pen=SVGPathPen(gs,ntos=lambda v:f"{v:.2f}".rstrip("0").rstrip(".")); cx=0
    for i,p in zip(buf.glyph_infos,buf.glyph_positions):
        gs[order[i.codepoint]].draw(TransformPen(pen,(sc,0,0,-sc,x+cx+p.x_offset*sc,y-p.y_offset*sc)))
        cx+=p.x_advance*sc+track
    return pen.getCommands(),w
