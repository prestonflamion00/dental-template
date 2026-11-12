# Demo logos

Makes the SVG logos for the fictional demos. Text is turned into outline paths, so a logo looks the
same everywhere, even where web fonts don't load (an `<img>`).

    pip install fonttools brotli uharfbuzz
    python3 scripts/logo/build.py                  # from the repo root; writes public/offices/<slug>/logo.svg
    python3 scripts/logo/build.py --preview DIR    # also one-colour and icon-only versions, for checking

So they don't look machine-made:
1. Flat colours, no gradients or shine.
2. One idea, taken from the business's name, not the obvious trade icon.
3. Each business gets its own font and layout (fonts/ holds Archivo, Outfit and Zilla Slab, all SIL OFL).
4. Must still work in one colour (truck decal, shirt, stamp): check the -mono preview.
5. One custom touch in the lettering or layout.
6. Icon alone must read at 32px and 16px: check the -icon preview.

Then set `practice.logo.image`, `width` and `height` (the script prints the width) in the config.
