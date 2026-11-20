# makefun-gta6-trophy-guide-04

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Bruskots/makefun-gta6-trophy-guide-04/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Bruskots/makefun-gta6-trophy-guide-04/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI: a roadmap to the platinum, the one trophy you can miss, and a guide in our own words for every trophy, each citing its sources. Progress is saved in the browser, with filters by kind and grade, a spoiler-free mode, and export/import.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the guide works fully offline from its own files.

## What is inside

- `app/index.html` — the page: tracker, roadmap, filters, spoiler mode.
- `app/app.js` — the tracker: progress saving, filters, export/import, deep links.
- `app/roadmap.js` — the three-stage roadmap to the platinum.
- `app/data/trophies.json` — all 55 trophies with official names and descriptions, plus a cited guide for each.
- `app/style.css` — the guide's own look (system fonts only, so it works offline).
- `screenshots/` — four screenshots of the guide running in a browser.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
