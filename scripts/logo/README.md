# Demo logos

Makes the SVG logos for the fictional demos (icon + name + small trade line). Text is turned into
outline paths, so the logo looks the same everywhere, even where web fonts don't load (an `<img>`).

    pip install fonttools brotli uharfbuzz
    python3 scripts/logo/build.py      # run from the repo root; writes public/offices/<slug>/logo.svg

To add one: draw the icon in the 96×96 box (see the three in build.py), add a row to the list at the
bottom, then set `practice.logo.image`, `width` and `height` (printed by the script) in the config.
