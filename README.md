# Level Up

nate's personal iPhone app: ideal-life planner (Today), lessons (Learn), daily puzzles (Play), and a growing fighter character (Fighter).

Plain HTML/CSS/JS, no build step. Data stays in the phone's browser storage (Settings > Export backup to save a copy).

## Put it on your iPhone
1. Host this folder on GitHub Pages (repo Settings > Pages > Deploy from branch > main / root).
2. Open the Pages URL in Safari on the iPhone.
3. Share button > Add to Home Screen. Open it from the home screen icon from then on.

Use the same home-screen app every time: Safari tabs and the home-screen app keep separate data.

## Files
- index.html, styles.css, app.js: shell, Today, Fighter, XP
- data.js: checklist, affirmations, passages, smoothie, food presets, workout templates, puzzle word lists
- puzzles.js, crosswords.js: sudoku, mini crossword, word guess, groups
- modules/: optional tabs (Learn) registered through `App.registerTab`
- sw.js, manifest.json, icons/: offline + installable
