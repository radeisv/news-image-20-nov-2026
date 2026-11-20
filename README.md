# The World in One Day — Friday 20 November 2026

[![make.fun](https://make.fun/badge/news-image-20261120.svg)](https://make.fun/bounty/news-image-20261120)
[![Rank](https://make.fun/radeisv/news-image-20-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261120)
[![Reward](https://make.fun/radeisv/news-image-20-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261120)

One image summing up the world's news of **Friday 20 November 2026** —
44 verified stories across 7 regions: Cyclone Akvan's landfall in India,
Russian missiles hitting three Kyiv bridges, and COP31's final day in
Antalya, plus a six-number strip, a numbered world map, 31 more briefs,
and a DATE CHECK box naming what is *not* 20 November news.

Entry for the make.fun bounty
[news-image-20261120](https://make.fun/bounty/news-image-20261120).

## How to run

```sh
node poster/render.mjs   # renders poster/poster.html in headless Chrome, quantises to entry.png
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # copies entry.png to out/entry.png
```

Requirements: Node 22+, headless Chrome, Python 3 + Pillow (for the
quantise step). No network is used at runtime; `main.ts` only copies the
pre-rendered `entry.png`.

## Contents

- `entry.png` — the finished 1024×1024 image (≤ 1 MiB)
- `poster/poster.html` — the page source: HTML + CSS + original inline-SVG
  illustrations (no photos, no generated images, no lettering inside drawings)
- `poster/data/stories.json` — the 44 selected stories, in the author's own
  wording, each with its verified source
- `poster/render.mjs` — render + quantise script
- `BUILD.md` — build notes, story/region counts, known flaws
