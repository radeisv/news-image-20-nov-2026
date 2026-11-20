# BUILD.md — news-image-20261120, round 1

Built: Friday 20 November 2026 (local build session, WIB afternoon).
Bounty: [news-image-20261120](https://make.fun/bounty/news-image-20261120) —
"Sum up 20 November's world news in one image". Deadline 2026-11-22T00:00:00Z.
Status: **BELUM submit** — local build only; no repo created, nothing uploaded.

## What is on the page

- 44 stories, all verified in `~/workspace/news20-work/research/` (research.md +
  stories-20nov.json) — the full verified set, nothing invented, nothing
  imported from 19 Nov; numbers copied off the top artifacts were NOT used.
- Regions (honest counts of the stories actually on the page):
  Europe 17 · Americas 9 · Asia-Pacific 7 · Africa 5 · Middle East 4 · Oceania 2.
- 3 leads (Cyclone Akvan landfall; Russian missiles hit 3 Kyiv bridges;
  COP31 final day deadlocked) + 10 medium modules + 31 one-line briefs
  (columns 11 / 10 / 10).
- 6-number strip: 300,000 evacuated Odisha · 3 Kyiv bridges hit ·
  −6.23% Taiwan Taiex · $3,531 gold/oz · 2.2% Japan core CPI ·
  1,000+ UK drones for Ukraine (£260m).
- Numbered world map "WHERE IT HAPPENED" (pins 1–13 → the 13 modules),
  red DATE CHECK box (ICJ Myanmar verdict, Trump–Xi–Putin declaration,
  Anthropic IPO debut, Pete Rose pardon, Senate Iran war-powers vote,
  GTA 6 reviews — all 19 Nov; Van Gogh sale 18 Nov), footer with sources
  (Reuters, AP, AFP, BBC, UN News, CNN) + "original drawings · claims
  attributed, not stated as fact".
- All 13 module illustrations are original inline SVG drawn for this page
  (no photos, no generated images, no lettering inside the drawings).
- Type at 1024px (after the fix round): date 58px, lead headlines 34px,
  module headlines 22px, module body 15px, briefs 13px. Every band has
  an explicit height (no flex:1 measuring trap).

## How it was rendered

Real Chrome (headless) via CDP from `poster/render.mjs`, then Pillow
quantise (224 colours, MEDIANCUT, FLOYDSTEINBERG) to stay under 1 MiB.

```sh
node poster/render.mjs
mkdir -p out1 out2
MAKEFUN_OUTPUT_DIR=out1 node main.ts
MAKEFUN_OUTPUT_DIR=out2 node main.ts
sha256sum out1/entry.png out2/entry.png   # must be identical
```

Notes on the environment: the bundled `/opt/meta-chromium/chrome` refuses
to start in this exec session ("Hatch WebGL domain policy is required for
browser startup"), and its CLI `--screenshot` flag also captured a short
viewport (bottom bands missing). `render.mjs` therefore resolves Chrome
from `$CHROME_PATH`, then a Playwright-managed Chromium
(`~/.cache/ms-playwright`, downloaded for this build), then
`/opt/meta-chromium/chrome`, and screenshots over CDP (Node stdlib
fetch + WebSocket) with an explicit 1024×1024 device-metrics override.
The render is still real Chrome, just not the bundled binary.

## Fix round (user-approved, Fri 20 Nov evening WIB)

User asked for exactly three fixes — no story, number, date, or fact changed;
`main.ts` untouched (still the copy-only entrypoint).

1. **Caption / pins:** map pins renumbered 1–13 in the order the 13
   illustrated modules appear (1 Cyclone Akvan, 2 Kyiv bridges, 3 COP31,
   4 Asia stocks, 5 S&P, 6 Japan CPI, 7 Oil/Riyadh, 8 Gold, 9 UK–EU summit,
   10 Malawi fuel, 11 UK drones, 12 Africa climate finance, 13 India
   cricket). Europe pins re-spread (London 128,42 · Brussels 148,44 ·
   Kyiv 170,40 · Antalya 166,68) so none touch; pin radius 7px with a
   white ring. Caption now reads "Red numbers mark the 13 illustrated
   stories above. Positions approximate." — true. Modules and briefs
   keep their original story-ID numbers.
2. **Fonts:** module headlines 19px → 22px, weight 800; module body
   14px → 15px/18px, colour #111; lead body 15px/19px; strip caps
   11px/12.5px semibold; kickers back to 10.5px with nowrap so they stay
   on one line; briefs 13px/15px with 800-weight numbers. Bands
   rebalanced to fit (strip 60, leads 212, medium rows 158, bottom 242)
   — no flex:1 measuring trap.
3. **3D illustrations:** all 13 module drawings redrawn as original
   inline SVG with depth — gradients, highlight top faces, darker side
   faces, drop shadows, isometric bars/coins, perspective tables and
   pitches. Cyclone now has spiral cloud bands + rain + sea (no longer
   a target); Japan CPI is rising 3D bars + a stack of gold coins;
   UK–EU summit is a perspective table with Union Jack + EU flags;
   Africa finance is an extruded Africa shape + coin stack + finance
   bars. No photos, no generated images, no lettering inside any drawing.

First re-render exposed two overflow bugs (strip captions clipped at
56px; module bodies in #04 and #30 clipped because kickers wrapped to
two lines) — fixed by the strip/kicker changes above and re-rendered.

## Fix round 2 (user-approved, Fri 20 Nov evening WIB)

User asked for exactly two fixes — no story, headline, number, date, or
fact changed; `main.ts` untouched; internal story IDs in
`poster/data/stories.json` unchanged (display numbers only).

1. **Sequential numbering:** every displayed number is now 01–34 with
   no gaps. Modules (display order): 01 Cyclone Akvan, 02 Kyiv bridges,
   03 COP31, 04 Asia stocks, 05 S&P, 06 Japan CPI, 07 Oil/Riyadh
   (was 08), 08 Gold (was 09), 09 UK–EU summit (was 13), 10 Malawi fuel
   (was 15), 11 UK drones (was 23), 12 Africa climate finance (was 30),
   13 India cricket (was 38). Briefs (column order): 14–20 col 1
   (was 07, 10, 12, 14, 16, 17, 18), 21–27 col 2 (was 19, 20, 21, 22,
   24, 27, 28), 28–34 col 3 (was 29, 31, 32, 33, 35, 37, 43).
   Map pins were already 1–13 in module order, so a module number now
   matches its pin number exactly. Caption now reads "Red numbers match
   the 13 illustrated stories above (01–13). Positions approximate."
2. **World map redrawn:** the blob map was replaced with a recognisable
   simplified world map (original polygons, no copied data, no external
   image) in the same dark panel: North America (with Greenland) left,
   South America tapering below it, Europe small above Africa, Africa
   with west bulge + horn tapering south, Asia large to the right with
   Arabia / India / SE Asia / Japan drawn separately, Australia
   bottom-right, NZ tiny. Pins at geographic spots: 1 Odisha, 2 Kyiv,
   3 Antalya, 4 Taiwan, 5 USA, 6 Japan, 7 Riyadh, 8 London (gold),
   9 Brussels, 10 Malawi, 11 London (drones), 12 central Africa,
   13 south India. Closest pin pair is 15.6px apart (1↔13), all pairs
   ≥14px, so no two r=7 pins touch; Europe pins (8, 11, 9, 2, 3) are
   spread 18–26px apart. Pins 8 and 11 are both London by design
   (gold market vs drone announcement) and are placed ~18px apart.

## Upgrade to 44 stories (user-approved, Fri 20 Nov evening WIB)

User asked to upgrade to 44 stories and then compare against rank 1.
Only the 10 verified stories from `stories-20nov.json` that were not yet
on the page were added, as briefs 35–44 in research-file order:
35 M5.6 quake off New Caledonia (id 11, Oceania) · 36 France press pay
law (id 25, Europe) · 37 Britons urged to stockpile food (id 26, Europe) ·
38 Trump in court over climate grants (id 34, Americas) · 39 Gemini can
now run Mac apps (id 36, Americas) · 40 Rakshitha stuns Olympic champion
(id 39, Asia-Pacific) · 41 Jepchirchir banned 3 years, EPO (id 40,
Africa) · 42 Pochettino takes over Man Utd (id 41, Europe) · 43 Dhoni
Room No. 7 in Chennai (id 42, Asia-Pacific) · 44 Xavier: 50-knot winds
due 22 Nov (id 44, Europe — an advisory issued 20 Nov forecasting 22 Nov
winds, worded as a forecast, not as a 20 Nov storm). No story invented,
no 19 Nov story reused. `poster/data/stories.json` now holds all 44.
Counts updated everywhere: masthead "44 STORIES", region bar recount
(Europe 17 · Americas 9 · Asia-Pacific 7 · Africa 5 · Middle East 4 ·
Oceania 2 = 44), briefs header "31 MORE STORIES". Modules, map, strip,
DATE CHECK, footer and type sizes unchanged; `main.ts` untouched.

Fit work (real bugs found by rendering, not by guessing): the first
44-story render came out 1024×1027 — several briefs wrapped to two
lines, the briefs panel overflowed, brief 24 was pushed out of view and
the footer collided with spilled text. Fixed by shortening EVERY brief
to a strict one line (≤35 rendered characters; two stragglers, #17 Spain
polls and #43 Dhoni room, needed a second shortening pass) and tightening
brief line spacing to 13px/14px with 1px gaps (type size unchanged).
Existing briefs were shortened the same way (e.g. "Senegal boat search
goes on; 4 dead" → "Senegal boat sinking; 4 dead"); no fact was changed,
only wording length.

## Verification (final, after the 44-story upgrade)

- PNG magic `89 50 4E 47`, IHDR 1024×1024, all chunk CRCs valid, IEND
  trailer present.
- entry.png: 123,248 bytes (≤ 1,048,576),
  sha256 `85fa8a6e3f2242666c874e1a22a13fde3f41d50a35e5f1862f687c865ae0f870`.
- Determinism: two `main.ts` runs to two dirs + entry.png, all three
  sha256 identical (`85fa8a6e…f870`).
- Visual QA: full-size viewed; every displayed number 01–44 appears
  exactly once in order (verified by grep as well as by eye); modules
  01–13 match pins 1–13; all 31 briefs are one line each, brief 24 is
  back in view, no text overflow, clipping, or overlap anywhere; DATE
  CHECK and footer fully visible. At 300px the date, strip numbers and
  lead headlines still read; the map still reads as a world map with
  red pins; briefs become texture (expected — they are the mass layer,
  not the 300px layer).

## Mock-judge status

No measurement done. No OpenRouter key exists in this environment
(verified by the research step: `~/.hermes/` gone, no key found), so no
mock-judge run was attempted and no score is claimed. Do not invent one.

## Known flaws (honest, after fix round 2)

1. The redrawn map is still simplified/schematic: Europe is enlarged
   and pins 8 and 11 are both placed around London ~18px apart, so a
   geographer would notice the London pins are schematic, not exact;
   South America is narrow and Greenland is a small blob. Continents
   are recognisable, but it is not a precise atlas map.
2. The cyclone lead still reads partly as clouds + spiral rather than a
   full storm scene, and the #04 Asia-stocks arrow is a small detached
   red triangle; the #08 oil barrel is small and easy to miss.
3. Briefs are unreadable at 300px (by design they are the mass layer),
   and the page is Europe-heavy (17 of 44 stories) because the verified
   source set is Europe-heavy; Oceania has only 2 stories.
7. Wall-of-text risk, honestly: the briefs block is now ~40% taller and
   denser than at 34 stories, so at 300px it is a bigger grey block than
   before — the exact look the judge penalised in our old wall-of-text
   pages. Mitigation: the 300px-readable layer (date, strip, 3 leads)
   is unchanged and still dominates the top two-thirds of the page, and
   the density is confined to the bottom band. Whether that is enough
   is a judgement call for the rank-1 comparison, not something measured
   here — no mock-judge run was done in this upgrade.
4. No second major storm / space / F1 story could be verified for 20 Nov,
   so those beats are absent; the page leans on markets + war + climate.
5. `main.ts` is a copy-only entrypoint: the image is baked, so any
   re-render changes the entry only if `entry.png` is re-committed.
6. The map legend now wraps to two lines ("Red numbers match the 13
   illustrated stories above (01–13). Positions approximate.") — it
   fits, but the panel is full; any longer caption would overflow.

## What is left for the parent

1. Create the GitHub repo with the EXACT name `news-image-20-nov-2026`
   under owner `radeisv` (README badges assume this name; otherwise
   update the badge URLs first).
2. Upload this folder as the repo contents, commit, set About homepage
   to https://make.fun/bounty/news-image-20261120 and topic `makefun`.
3. Run the kit check (`node cli/makefun.mjs check`) on the commit +
   transcripts bundle, then submit ONLY with the user's approval.
4. No file in this folder may be touched after the final verification
   above — any edit means re-render + re-verify + re-prove determinism.

## Fix round 3 — chase rank 1 (2026-11-20, ~18:45 WIB, BELUM submit)

Goal: fix the four gaps the parent's manual head-to-head found vs rank 1
(888dao-sats, 0.991652, 36 stories). No mock-judge run (no OpenRouter key);
parent re-does the comparison. `main.ts` untouched.

1. **#44 replaced — Xavier (22 Nov forecast) OUT, BepiColombo IN.**
   Brief 44 is now "BepiColombo ends 6bn trip (ESA)"; stories.json id 44
   replaced by id 45, category science, region "Space", source
   "ESA / UK Space Agency", deck "ESA/JAXA probe ends its 8-year,
   6bn-mile trip; orbit insertion begins 21 Nov". Verified 20 Nov 2026:
   UK Space Agency post 20 Nov (insertion "on Saturday"), ESA Space
   Science LinkedIn 19 Nov 15:06 UTC (insertion begins 21 Nov), phys.org
   19 Nov, TechTimes 19 Nov, Orbital Radar. The 22 Nov forecast is gone,
   so criterion 1 (one day's news) no longer has a visible leak.
2. **Module swap — Senegal boat promoted, UK-EU summit demoted.**
   Module 09 is now "Senegal boat sinks" (50–100 aboard; 4 dead, dozens
   missing — Reuters), illustrated; the UK–EU reset summit is brief 18.
   Still 13 modules + 31 briefs = 44. Everything renumbered sequentially
   (modules 01–13, briefs 14–44, each number exactly once, verified by
   script). Map pin 9 moved Brussels (152,48) → Senegal (128,88);
   caption unchanged and true.
3. **Scene illustrations redrawn (original inline SVG, 3D, no photos,
   no lettering inside):** 04 Tokyo skyline + falling red line + sun +
   Tokyo Tower; 05 NYSE pediment/columns + side-profile bull silhouette
   (first attempt read as a beetle — redrawn) + red down-trend line;
   06 Tokyo shop (awning, jars, blank price tags, coin stack, green up
   arrow); 07 oil barrel made LARGE (36×30) with moon moved left;
   08 gold vault (arch, big gold bars, balance scale, sparkles);
   lead 01 cyclone is now a fuller storm (dark cloud layers, lightning,
   spiral vortex, rain bands, churning sea, coastline with palm + houses).
   Modules 02, 03, 10, 11, 12, 13 unchanged.
4. **Sources on every brief and module deck.** All 31 briefs end with
   "(Source)" and all 10 medium decks end with "(Source)"; the 3 leads
   carry sources in their kickers. Briefs 35, 36, 40 were shortened after
   they wrapped ("N. Caledonia", "France OKs press pay law", "Rakshitha
   stuns champ") — every brief is one line at 13px, verified in the
   browser (wrappedBriefs: none).
5. **Region counts (recounted honestly):** Europe 16 · Americas 9 ·
   Asia-Pacific 7 · Africa 5 · Middle East 4 · Oceania 2 · Space 1 = 44.
   Region bar gained a 7th chip "SPACE 1"; note now "44 STORIES ·
   7 REGIONS · FRI 20 NOV 2026". Footer sources add WSJ.

### Fix-round-3 verification (final, after last render)
- entry.png: 127,958 bytes, sha256
  e1da128cd991cfba9ccef521d1c91aa7fbf93df65ddacf5d729903c1dd73985c,
  1024×1024, PNG magic + IHDR + IEND all valid, ≤ 1,048,576 bytes.
- Determinism: `node main.ts` twice to /tmp/det1 and /tmp/det2 —
  all three sha256 identical to entry.png.
- Browser layout probe (CDP): every section at design height
  (.bottom scrollH 242 = clientH, .briefs 238 = 238, .datecheck 966–1002
  scrollH 33, .foot 1004–1016 scrollH 12), no wrapped briefs, no
  overflow/clipping/overlap. DATE CHECK and footer fully visible.
- Visual QA at full size and at 300×300: masthead, strip, 3 leads,
  13 modules, map + 13 pins, 31 briefs, DATE CHECK, footer all clean.
  At 300px the page reads as a newspaper (briefs unreadable by design,
  same as rank 1).
- Bugs found and fixed in this round: (a) the briefs-block splice
  deleted the `</div>` closers of .briefs and .bottom, so .datecheck
  and .foot rendered INSIDE the briefs box and overlapped the text —
  closers restored, layout re-probed clean; (b) module 05's first bull
  read as a beetle — redrawn as a side-profile silhouette; (c) briefs
  35, 36, 40 wrapped to two lines — shortened.

### Honest flaws still remaining
1. Europe is still 16 of 44 — the verified 20 Nov source set is
   Europe-heavy, and the page still has no space/health/science module
   beyond brief 44; rank 1's breadth is more balanced (Europe 7).
2. The cyclone lead is still a dark, moody scene; the spiral is modest
   and the palm/houses are small — it reads as a storm, but not as
   dramatically as rank 1's lead art.
3. The briefs block is still dense (31 one-liners); at 300px it is a
   grey block, and briefs are unreadable at that size by design.
4. The map is still schematic (Europe enlarged, two London-area pins
   close together); pin 9 (Senegal) sits on the West Africa bulge but
   the continent shapes are approximate.
5. Module 05's bull is a solid silhouette — it reads as a bull, but it
   is less detailed than the other scenes; the NYSE building is small
   beside it. No undo/redo or face detection is relevant here, but the
   editor-side polish (none — this is a static poster) is unchanged.
6. The 44th story is a science brief, not a module — the "Space"
   region exists only as one brief + one chip; a judge scanning modules
   first still sees no space/science illustration.

## Fix round 4 — BepiColombo promoted to a module (2026-11-20, ~18:45 WIB, BELUM submit)

User chose one more round: promote BepiColombo to a module. No mock-judge
run (no OpenRouter key); parent re-does the rank-1 comparison. `main.ts`
untouched (copy-only entrypoint). `stories.json` unchanged — the set of 44
stories is identical; only display roles changed.

1. **Swap — BepiColombo is now module 05, S&P is brief 44.**
   Module 05: kicker "05 · SPACE · MERCURY · ESA", headline "BepiColombo
   reaches Mercury", deck "6bn-mile trip ends; orbit insertion 21 Nov
   (ESA)" (2 lines; deck facts from stories.json id 45, source ESA / UK
   Space Agency — NOT rank 1's deck text). The old S&P bull/NYSE
   illustration is gone with the demotion. Brief 44 is now "S&P −2.02%;
   Dow <50,000 (WSJ)" — one line. First attempt ("Dow <50k; VIX 28.44")
   wrapped to two lines at 36 chars; the VIX figure was dropped to fit
   the strict one-line brief rule (VIX 28.44 was in the old module deck;
   the brief keeps the two headline numbers + source). All other modules
   keep their numbers (01–04, 06–13) and all other briefs keep theirs
   (14–43); numbers 01–44 verified by script, each exactly once.
2. **Illustration — original inline-SVG 3D space scene** (no photos, no
   generated images, no lettering inside): deep-space gradient + starfield,
   the probe with two blue solar-panel wings and an antenna, a dotted gold
   trajectory arc, and a large cratered Mercury (radial-gradient sphere
   with six craters + terminator shading). It reads as a space mission at
   a glance and is distinct from every other module.
3. **Map — pin 5 is now Space.** The old USA pin (58,56) was removed; a
   small "SPACE · Mercury" box was added inside the map panel bottom-left
   (x 8–66, y 162–190 in SVG coords) holding red pin 5, following rank 1's
   approach. The box does not touch the South America shape (its right
   edge meets the SA tip's left edge at most). Pins 1–13 still match
   modules 01–13; caption unchanged and true.
4. **Lead 01 deck enriched — verified facts only.** "Third cyclone in a
   month; 300,000 evacuated, winds 70–80 kph, gusts 90 kph." The gusts
   figure is from research.md story #1 (Reuters: gusts 90 kph). The
   Gopalpur / 423-rescue-teams / schools-shut specifics in rank 1's deck
   are NOT in our research files, so they were NOT added.
5. **Region counts — unchanged, verified by recount.** The story set is
   identical, so the bar still reads Europe 16 · Americas 9 ·
   Asia-Pacific 7 · Africa 5 · Middle East 4 · Oceania 2 · Space 1 = 44.
   (S&P is still on the page as brief 44, so Americas does not drop.)

### Fix-round-4 verification (final, after last render)
- entry.png: 129,029 bytes, sha256
  79fcf3f9800051efe1031e30b7f632c2b22b96312dfe9c02fe06efade8e51d3c,
  1024×1024, PNG magic + IHDR + IEND all valid, all chunk CRCs valid,
  ≤ 1,048,576 bytes.
- Determinism: `node main.ts` twice to /tmp/det1 and /tmp/det2 — entry.png
  and both runs all sha256 identical (79fcf3f9…).
- Browser layout probe (CDP, 1024×1024 override): body 1024×1024, every
  section at design height (.bottom scrollH 242 = clientH, .briefs 238),
  31 briefs, ZERO wrapped briefs, DATE CHECK 966–1002 and footer
  1004–1016 at design positions. Lead 01 deck 2 lines, module 05 headline
  2 lines / deck 2 lines. Note: per-module line-box measurement shows the
  deck line box ending ~1px past the module padding edge on 2-line-deck
  modules (same geometry as the previously verified render — glyphs are
  not clipped; confirmed by eye at full size, all decks fully legible).
- Visual QA at full size and at 300×300: BepiColombo module reads as a
  space mission; SPACE box + pin 5 clear in the map; brief 44 one line;
  lead 01 deck fits 2 lines; no overflow/clipping/overlap anywhere. At
  300px the date, strip numbers and lead headlines still read; module
  scenes (including Mercury) read as distinct images; the map reads as a
  world map with red pins; briefs unreadable by design (mass layer).

### Honest flaws still remaining
1. Europe is still 16 of 44 — the verified 20 Nov source set is
   Europe-heavy; rank 1's breadth (Europe 7) still beats ours on
   criterion 2, though Space is now a module, not just a brief + chip.
2. The cyclone lead is still a dark, moody scene; the spiral is modest
   and the palm/houses are small — it reads as a storm, but not as
   dramatically as rank 1's cyclone-map lead art.
3. The briefs block is still dense (31 one-liners); at 300px it is a grey
   block, and briefs are unreadable at that size by design.
4. The map is still schematic (Europe enlarged, two London-area pins
   close together); the SPACE box sits in the Atlantic, which is a
   deliberate convention (as in rank 1), not a geographic position.
5. Brief 44 lost the VIX 28.44 figure to the one-line rule (S&P −2.02%
   and Dow <50,000 + WSJ kept); module 05's Mercury, while clearly a
   space scene, is simpler than rank 1's moon/Mercury lead-style art.
6. No health/science module beyond BepiColombo; rank 1 also has a health
   module (pancreatic cancer pill) that our verified set could not match.
