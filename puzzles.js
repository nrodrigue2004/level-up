(() => {
"use strict";
const D = window.PLANNER_DATA;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hash = str => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
function rng(seed) { let a = hash(seed); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtTime = ms => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const head = (title, sub) => `<div class="row" style="margin:8px 0 12px"><button class="btn ghost small" data-back>‹ Puzzles</button><div class="grow" style="text-align:right"><b>${title}</b><div class="muted small">${sub}</div></div></div>`;
// Daily picks walk through a fixed shuffled order, so nothing repeats until the whole bank is used.
const isDate = d => /^\d{4}-\d\d-\d\d$/.test(d);
const dayNum = d => Math.round(new Date(d + "T12:00:00Z").getTime() / 86400000);
const permCache = {};
function dailyIndex(date, name, n) {
  if (!isDate(date)) return hash(date + ":" + name) % n;
  const key = name + n;
  const perm = permCache[key] || (permCache[key] = shuffle([...Array(n).keys()], rng("levelup-perm-" + name)));
  return perm[((dayNum(date) % n) + n) % n];
}
const isHard = k => { try { const S = window.App.internal.S.settings; return k === "word" ? !!S.hardWord : !!(S.hard && S.hard[k]); } catch { return false; } };
const nextBtn = api => api.next ? `<button class="btn block" style="margin-top:8px" data-nextp>Next puzzle →</button>` : "";
let keyHandler = null;
function onKeys(fn) { if (keyHandler) document.removeEventListener("keydown", keyHandler); keyHandler = fn; if (fn) document.addEventListener("keydown", fn); }
function keyboard(states = {}) {
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return `<div class="kb">${rows.map((r, i) => `<div class="krow">${i === 2 ? '<button class="wide" data-key="enter">Enter</button>' : ""}${[...r].map(k => `<button data-key="${k}" class="${states[k] || ""}">${k}</button>`).join("")}${i === 2 ? '<button class="wide" data-key="back">⌫</button>' : ""}</div>`).join("")}</div>`;
}
function started(st) { if (!st.started) { st.started = Date.now(); } }
function finish(st, api, msg) { if (!st.solved) { st.time = Date.now() - (st.started || Date.now()); api.solved(); api.toast(msg); } }

// ================= SUDOKU =================
function sudokuMake(seed, givens) {
  const r = rng(seed);
  const g = new Array(81).fill(0);
  const ok = (g, i, v) => {
    const row = Math.floor(i / 9), col = i % 9, br = row - row % 3, bc = col - col % 3;
    for (let k = 0; k < 9; k++) {
      if (g[row * 9 + k] === v || g[k * 9 + col] === v) return false;
      if (g[(br + Math.floor(k / 3)) * 9 + bc + k % 3] === v) return false;
    }
    return true;
  };
  const fill = i => {
    if (i === 81) return true;
    for (const v of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], r)) { if (ok(g, i, v)) { g[i] = v; if (fill(i + 1)) return true; } }
    g[i] = 0; return false;
  };
  fill(0);
  const sol = g.slice();
  const count = (p, limit) => {
    let n = 0;
    const go = () => {
      let best = -1, bestOpts = null;
      for (let i = 0; i < 81; i++) if (!p[i]) {
        const opts = []; for (let v = 1; v <= 9; v++) if (ok(p, i, v)) opts.push(v);
        if (!opts.length) return;
        if (!bestOpts || opts.length < bestOpts.length) { best = i; bestOpts = opts; if (opts.length === 1) break; }
      }
      if (best < 0) { n++; return; }
      for (const v of bestOpts) { p[best] = v; go(); p[best] = 0; if (n >= limit) return; }
    };
    go(); return n;
  };
  const puz = sol.slice();
  let filled = 81;
  for (const i of shuffle([...Array(81).keys()], r)) {
    if (filled <= givens) break;
    const keep = puz[i]; puz[i] = 0;
    if (count(puz.slice(), 2) !== 1) puz[i] = keep; else filled--;
  }
  return { puz, sol };
}
const SUDOKU_LEVELS = { easy: ["Easy", 38], medium: ["Medium", 32], hard: ["Hard", 28], expert: ["Expert", 25] };
const SUDOKU_LEVEL = [["Hard", 26], ["Easy", 38], ["Easy", 36], ["Medium", 33], ["Medium", 31], ["Hard", 29], ["Hard", 27]]; // by weekday, Sun first
function sudoku(host, date, st, api) {
  const [lvl, givens] = api.level ? SUDOKU_LEVELS[api.level] : SUDOKU_LEVEL[new Date(date + "T12:00").getDay()];
  const { puz, sol } = sudokuMake(date + ":sudoku", givens);
  st.cells = st.cells || puz.slice();
  st.notes = st.notes || {};
  let sel = st.cells.findIndex(v => !v), notesMode = false;
  const draw = () => {
    const sv = st.cells[sel];
    const counts = {}; st.cells.forEach((v, i) => { if (v && v === sol[i]) counts[v] = (counts[v] || 0) + 1; });
    const sr = Math.floor(sel / 9), sc = sel % 9;
    host.innerHTML = head("Sudoku", `${lvl} · ${givens} clues`) + `
      <div class="sudoku">${st.cells.map((v, i) => {
        const r = Math.floor(i / 9), c = i % 9;
        const peer = sel >= 0 && (r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)));
        const cls = [puz[i] ? "given" : "user", i === sel ? "cur" : (sv && v === sv ? "same" : peer ? "peer" : ""), (!puz[i] && v && v !== sol[i] && !isHard("sudoku")) ? "bad" : ""].join(" ");
        const notes = !v && st.notes[i] && st.notes[i].length ? `<div class="notes">${[1,2,3,4,5,6,7,8,9].map(n => `<span>${st.notes[i].includes(n) ? n : ""}</span>`).join("")}</div>` : (v || "");
        return `<div class="${cls}" data-cell="${i}">${notes}</div>`;
      }).join("")}</div>
      <div class="numpad">${[1,2,3,4,5,6,7,8,9].map(n => `<button data-num="${n}" class="${counts[n] >= 9 ? "used" : ""}">${n}</button>`).join("")}</div>
      <div class="tools"><button class="btn ghost ${notesMode ? "on" : ""}" data-tool="notes">✏️ Notes ${notesMode ? "on" : "off"}</button><button class="btn ghost" data-tool="erase">⌫ Erase</button><button class="btn ghost" data-tool="hint">💡 Hint</button></div>
      ${st.solved ? `<div class="win">Solved${st.time ? " in " + fmtTime(st.time) : ""}! 🎉</div>${nextBtn(api)}` : '<p class="muted small" style="text-align:center">' + (isHard("sudoku") ? "Hard mode: no error highlights. Trust your logic." : "Wrong numbers turn red right away.") + '</p>'}`;
  };
  const put = n => {
    if (sel < 0 || puz[sel] || st.solved) return;
    started(st);
    if (notesMode && n) { const a = st.notes[sel] = st.notes[sel] || []; const k = a.indexOf(n); k >= 0 ? a.splice(k, 1) : a.push(n); }
    else { st.cells[sel] = n; delete st.notes[sel];
      if (n && n === sol[sel]) { // clear that number from peer notes
        const r = Math.floor(sel / 9), c = sel % 9;
        for (const k in st.notes) { const kr = Math.floor(k / 9), kc = k % 9; if (kr === r || kc === c || (Math.floor(kr / 3) === Math.floor(r / 3) && Math.floor(kc / 3) === Math.floor(c / 3))) st.notes[k] = st.notes[k].filter(x => x !== n); }
      }
    }
    if (st.cells.every((v, i) => v === sol[i])) finish(st, api, "Sudoku solved! 🎉");
    api.save(); draw();
  };
  host.onclick = e => {
    if (e.target.closest("[data-back]")) { onKeys(null); return api.back(); }
    if (e.target.closest("[data-nextp]")) { onKeys(null); return api.next(); }
    const c = e.target.closest("[data-cell]"); if (c) { sel = +c.dataset.cell; draw(); return; }
    const n = e.target.closest("[data-num]"); if (n) return put(+n.dataset.num);
    const t = e.target.closest("[data-tool]"); if (!t) return;
    if (t.dataset.tool === "notes") { notesMode = !notesMode; draw(); }
    if (t.dataset.tool === "erase") { notesMode ? (delete st.notes[sel], api.save(), draw()) : put(0); }
    if (t.dataset.tool === "hint") {
      if (sel < 0 || puz[sel] || st.cells[sel] === sol[sel]) sel = st.cells.findIndex((v, i) => v !== sol[i]);
      if (sel >= 0) { const m = notesMode; notesMode = false; put(sol[sel]); notesMode = m; }
    }
  };
  onKeys(e => {
    if (/^[1-9]$/.test(e.key)) put(+e.key);
    else if (e.key === "Backspace" || e.key === "Delete") put(0);
    else if (e.key.startsWith("Arrow")) { const d = { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[e.key]; sel = Math.min(80, Math.max(0, sel + d)); draw(); e.preventDefault(); }
  });
  draw();
}

// ================= MINI CROSSWORD =================
// Crossword sizes by weekday: Mon–Fri 5x5, weekends 6x6. Practice draws from all sizes.
function xwBank(size) { const all = window.XWORDS || []; return all.filter(z => z.size === size); }
function xwPick(date) {
  const all = window.XWORDS || [];
  if (!isDate(date)) return all[hash(date + ":xwp") % all.length];
  const dow = new Date(date + "T12:00:00").getDay();
  const size = dow === 0 || dow === 6 ? 6 : 5;
  const bank = xwBank(size).length ? xwBank(size) : all;
  return bank[dailyIndex(date, "xw" + size, bank.length)];
}
function crossword(host, date, st, api) {
  const z = xwPick(date);
  const N = z.size, G = z.grid.join(""), sol = G;
  const black = i => G[i] === "#";
  st.cells = st.cells && st.cells.length === N * N ? st.cells : Array.from(G, ch => ch === "#" ? "#" : "");
  const words = [...z.across.map(w => ({ ...w, d: "a" })), ...z.down.map(w => ({ ...w, d: "d" }))]
    .map(w => ({ ...w, cells: Array.from({ length: w.ans.length }, (_, k) => w.d === "a" ? w.r * N + w.c + k : (w.r + k) * N + w.c) }));
  const numAt = {}; words.forEach(w => numAt[w.cells[0]] = w.n);
  const wordFor = (i, d) => words.find(w => w.d === d && w.cells.includes(i));
  let sel = st.cells.findIndex((v, i) => !black(i) && !v); if (sel < 0) sel = G.indexOf(G.replace(/#/g, "")[0]);
  let dir = wordFor(sel, "a") ? "a" : "d";
  let checked = false;
  const curWord = () => wordFor(sel, dir) || wordFor(sel, dir === "a" ? "d" : "a");
  const draw = () => {
    const w = curWord(); if (w) dir = w.d;
    const label = N === 6 ? "Weekend 6×6" : `${N}×${N}`;
    host.innerHTML = head("Crossword", `${label} · tap a square twice to switch direction`) + `
      <div class="xw" style="grid-template-columns:repeat(${N},1fr);max-width:${Math.min(360, N * 64)}px">${st.cells.map((v, i) => {
        if (black(i)) return `<div class="blk"></div>`;
        const cls = [i === sel ? "cur" : w && w.cells.includes(i) ? "word" : "", (st.solved || st.revealed) ? "ok" : checked && v && v !== sol[i] ? "no" : ""].join(" ");
        return `<div class="${cls}" data-cell="${i}" style="font-size:${N >= 7 ? 20 : N === 6 ? 24 : 28}px">${numAt[i] ? `<sup>${numAt[i]}</sup>` : ""}${esc(v)}</div>`;
      }).join("")}</div>
      <div class="clue-bar"><button data-nav="-1">‹</button><div class="grow" data-flip><span class="muted">${w ? w.n + (w.d === "a" ? "A" : "D") : ""}</span> ${esc(w ? w.clue : "")}</div><button data-nav="1">›</button></div>
      ${st.solved || st.revealed ? `<div class="win">${st.revealed ? "Revealed. New grid tomorrow." : `Solved${st.time ? " in " + fmtTime(st.time) : ""}!`}</div>${nextBtn(api)}` : keyboard()}
      <div class="tools">${isHard("crossword") ? "" : `<button class="btn ghost" data-tool="check">Check</button><button class="btn ghost" data-tool="word">Reveal word</button>`}<button class="btn ghost" data-tool="reveal">Reveal all</button></div>
      <div class="clues" style="margin-top:14px">
        <div><h3>Across</h3>${z.across.map((c, j) => `<p class="${w && w.d === "a" && w.n === c.n ? "on" : ""}" data-clue="a${j}"><b>${c.n}</b> ${esc(c.clue)}</p>`).join("")}</div>
        <div><h3>Down</h3>${z.down.map((c, j) => `<p class="${w && w.d === "d" && w.n === c.n ? "on" : ""}" data-clue="d${j}"><b>${c.n}</b> ${esc(c.clue)}</p>`).join("")}</div>
      </div>`;
  };
  const order = () => words.slice().sort((a, b) => (a.d === b.d ? a.n - b.n : a.d === "a" ? -1 : 1));
  const jumpWord = d => { const o = order(); const w = curWord(); let k = o.indexOf(w) + d; k = (k + o.length) % o.length; const nw = o[k]; dir = nw.d; sel = nw.cells.find(i => !st.cells[i]) ?? nw.cells[0]; };
  const step = d => { const w = curWord(); if (!w) return; const k = w.cells.indexOf(sel) + d; if (k >= 0 && k < w.cells.length) sel = w.cells[k]; };
  const solvedNow = () => st.cells.every((v, i) => v === sol[i]);
  const type = ch => {
    if (st.solved || st.revealed) return;
    started(st); checked = false;
    if (ch === "back") { if (!st.cells[sel]) step(-1); st.cells[sel] = ""; }
    else if (ch === "enter") jumpWord(1);
    else {
      st.cells[sel] = ch;
      const w = curWord(); const k = w.cells.indexOf(sel);
      const nextEmpty = w.cells.slice(k + 1).find(i => !st.cells[i]);
      if (nextEmpty != null) sel = nextEmpty; else if (k === w.cells.length - 1 || w.cells.every(i => st.cells[i])) jumpWord(1); else step(1);
    }
    if (solvedNow()) finish(st, api, "Crossword solved!");
    else if (st.cells.every((v, i) => black(i) || v)) api.toast("Not quite. Tap Check to see which letters are off.");
    api.save(); draw();
  };
  host.onclick = e => {
    if (e.target.closest("[data-back]")) { onKeys(null); return api.back(); }
    if (e.target.closest("[data-nextp]")) { onKeys(null); return api.next(); }
    const c = e.target.closest("[data-cell]"); if (c) { const i = +c.dataset.cell; if (i === sel) { const o = dir === "a" ? "d" : "a"; if (wordFor(i, o)) dir = o; } else { sel = i; if (!wordFor(i, dir)) dir = dir === "a" ? "d" : "a"; } draw(); return; }
    const k = e.target.closest("[data-key]"); if (k) return type(k.dataset.key);
    const nv = e.target.closest("[data-nav]"); if (nv) { jumpWord(+nv.dataset.nav); draw(); return; }
    if (e.target.closest("[data-flip]")) { const o = dir === "a" ? "d" : "a"; if (wordFor(sel, o)) dir = o; draw(); return; }
    const cl = e.target.closest("[data-clue]"); if (cl) { const d = cl.dataset.clue[0], j = +cl.dataset.clue.slice(1); const ww = (d === "a" ? z.across : z.down)[j]; dir = d; sel = (d === "a" ? words.find(x => x.d === "a" && x.n === ww.n) : words.find(x => x.d === "d" && x.n === ww.n)).cells[0]; draw(); return; }
    const t = e.target.closest("[data-tool]"); if (!t || st.solved) return;
    if (t.dataset.tool === "check") { checked = true; draw(); }
    if (t.dataset.tool === "word") { const w = curWord(); w.cells.forEach(i => st.cells[i] = sol[i]); st.helped = true; if (solvedNow()) { st.revealed = true; } api.save(); draw(); }
    if (t.dataset.tool === "reveal") { st.cells = Array.from(sol); st.revealed = true; api.save(); draw(); }
  };
  onKeys(e => {
    if (e.metaKey || e.ctrlKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) type(e.key.toLowerCase());
    else if (e.key === "Backspace") type("back");
    else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); type("enter"); }
  });
  draw();
}

// ================= WORD GUESS =================
function scoreGuess(guess, answer) {
  const res = Array(5).fill("absent"), left = {};
  for (let i = 0; i < 5; i++) { if (guess[i] === answer[i]) res[i] = "correct"; else left[answer[i]] = (left[answer[i]] || 0) + 1; }
  for (let i = 0; i < 5; i++) if (res[i] !== "correct" && left[guess[i]]) { res[i] = "present"; left[guess[i]]--; }
  return res;
}
// One week in four is themed (tech, fight, gym, rotating); the rest draw from the big answer bank, no repeats for years.
function wordTheme(date) {
  const WB = window.WORDS; if (!WB || !isDate(date)) return null;
  const wk = Math.floor(dayNum(date) / 7); if (wk % 4 !== 3) return null;
  const names = Object.keys(WB.themes); return names[Math.floor(wk / 4) % names.length];
}
let validSet = null;
function wordValid() { if (!validSet) { const WB = window.WORDS || { answers: D.words, valid: [] }; validSet = new Set([...WB.answers, ...WB.valid, ...Object.values(WB.themes || {}).flat()]); } return validSet; }
function word(host, date, st, api) {
  const WB = window.WORDS || { answers: D.words, valid: [], themes: {} };
  const theme = wordTheme(date);
  const answer = theme ? WB.themes[theme][dailyIndex(date, "wordtheme-" + theme, WB.themes[theme].length)] : WB.answers[dailyIndex(date, "word2", WB.answers.length)];
  const VALID = wordValid();
  const hard = !!(window.App && window.App.internal.S.settings.hardWord);
  st.guesses = st.guesses || [];
  let typing = "";
  let shakeRow = -1;
  const rank = { absent: 1, present: 2, correct: 3 };
  const draw = () => {
    const kstate = {};
    st.guesses.forEach(g => scoreGuess(g, answer).forEach((s, i) => { if (!kstate[g[i]] || rank[s] > rank[kstate[g[i]]]) kstate[g[i]] = s; }));
    const over = st.solved || st.failed;
    let rows = "";
    for (let r = 0; r < 6; r++) {
      const g = st.guesses[r]; const sc = g ? scoreGuess(g, answer) : null;
      const txt = g || (r === st.guesses.length && !over ? typing : "");
      rows += `<div class="wrow ${r === shakeRow ? "shake" : ""}">${[0,1,2,3,4].map(i => `<div class="t ${sc ? sc[i] : txt[i] ? "filled" : ""}">${esc(txt[i] || "")}</div>`).join("")}</div>`;
    }
    host.innerHTML = head("Word guess", `${theme ? theme + " · " : ""}${hard ? "Hard mode · " : ""}Green = right spot · Gold = in the word`) + `<div class="wg">${rows}</div>
      ${st.solved ? `<div class="win">Got it in ${st.guesses.length}! 🎉</div>` : st.failed ? `<div class="win" style="background:var(--accent-soft)">The word was <b>${answer.toUpperCase()}</b>. New one tomorrow.</div>` : ""}
      ${over ? nextBtn(api) : ""}
      ${over && window.App.library ? `<button class="btn ghost block" style="margin-top:8px" data-saveword>⭐ Save "${answer.toUpperCase()}" to my library</button>` : ""}
      ${over ? "" : keyboard(kstate)}`;
    shakeRow = -1;
  };
  const type = k => {
    if (st.solved || st.failed) return;
    if (k === "back") typing = typing.slice(0, -1);
    else if (k === "enter") {
      const hardMiss = hard && st.guesses.length ? (() => { const g = st.guesses[st.guesses.length - 1], sc = scoreGuess(g, answer);
        for (let i = 0; i < 5; i++) if (sc[i] === "correct" && typing[i] !== g[i]) return `Hard mode: letter ${i + 1} must be ${g[i].toUpperCase()}`;
        for (let i = 0; i < 5; i++) if (sc[i] === "present" && !typing.includes(g[i])) return `Hard mode: use ${g[i].toUpperCase()}`;
        return null; })() : null;
      if (typing.length < 5) { shakeRow = st.guesses.length; api.toast("Need 5 letters"); }
      else if (hardMiss) { shakeRow = st.guesses.length; api.toast(hardMiss); }
      else if (!VALID.has(typing)) { shakeRow = st.guesses.length; api.toast("Not in the word list"); }
      else {
        started(st); st.guesses.push(typing); typing = "";
        if (st.guesses[st.guesses.length - 1] === answer) finish(st, api, ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"][st.guesses.length - 1]);
        else if (st.guesses.length >= 6) { st.failed = true; }
        api.save();
      }
    } else if (typing.length < 5) typing += k;
    draw();
  };
  host.onclick = e => {
    if (e.target.closest("[data-back]")) { onKeys(null); return api.back(); }
    if (e.target.closest("[data-nextp]")) { onKeys(null); return api.next(); }
    const k = e.target.closest("[data-key]"); if (k) type(k.dataset.key);
    if (e.target.closest("[data-saveword]")) window.App.library.save({ type: "word", title: answer.toUpperCase(), body: `Word guess answer on ${date}. Look it up, use it in a sentence today.`, ref: answer });
  };
  onKeys(e => {
    if (e.metaKey || e.ctrlKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) type(e.key.toLowerCase());
    else if (e.key === "Backspace") type("back");
    else if (e.key === "Enter") type("enter");
  });
  draw();
}

// ================= GROUPS =================
const GROUP_COLORS = ["#f4d35e", "#9bd08f", "#9cc3e6", "#c8a2e0"];
function groupsMake(date) {
  const r = rng(date + ":groups");
  const bank = D.groups;
  // count ways to split 16 words into the 4 chosen groups; must be exactly 1
  const partitions = (G) => {
    const words = G.flatMap(g => g.words), fits = words.map(w => G.map((g, i) => bank[g.bi][1].includes(w) ? i : -1).filter(i => i >= 0));
    const cnt = [0, 0, 0, 0]; let n = 0;
    const go = k => { if (n > 1) return; if (k === words.length) { n++; return; } for (const gi of fits[k]) if (cnt[gi] < 4) { cnt[gi]++; go(k + 1); cnt[gi]--; } };
    go(0); return n;
  };
  let best = null;
  for (let tries = 0; tries < 300; tries++) {
    const idx = shuffle([...bank.keys()], r).slice(0, 4);
    const G = idx.map(bi => ({ bi, name: bank[bi][0], words: shuffle(bank[bi][1], r).slice(0, 4) }));
    const all = G.flatMap(g => g.words); if (new Set(all).size !== 16) continue;
    if (partitions(G) !== 1) continue;
    // herrings: words that also belong to another chosen category's bank list
    const herrings = all.filter(w => G.filter(g => bank[g.bi][1].includes(w)).length > 1 || G.some(g => !g.words.includes(w) && bank[g.bi][1].includes(w))).length;
    if (!best || herrings > best.h) best = { G, h: herrings };
    if (herrings >= 1 && tries > 20) break;
  }
  return best.G.map(g => ({ name: g.name, words: g.words }));
}
function groups(host, date, st, api) {
  const G = groupsMake(date);
  const r = rng(date + ":order");
  st.order = st.order || shuffle(G.flatMap(g => g.words), r);
  st.found = st.found || [];
  st.mistakes = st.mistakes || 0;
  st.tried = st.tried || [];
  let selected = [];
  const groupOf = w => G.findIndex(g => g.words.includes(w));
  const draw = () => {
    const over = st.solved || st.failed;
    const shown = over ? [...st.found, ...G.map((_, i) => i).filter(i => !st.found.includes(i))] : st.found;
    const left = st.order.filter(w => !shown.includes(groupOf(w)));
    host.innerHTML = head("Groups", "Find four groups of four") + `
      <div class="gp">
        ${shown.map(i => `<div class="solved" style="background:${GROUP_COLORS[i]}"><b>${esc(G[i].name)}</b><span>${G[i].words.map(esc).join(", ")}</span></div>`).join("")}
        ${left.map(w => `<button data-w="${esc(w)}" class="${selected.includes(w) ? "sel" : ""}" style="${w.length > 8 ? "font-size:10px" : ""}">${esc(w)}</button>`).join("")}
      </div>
      ${over ? `<div class="win" style="${st.failed ? "background:var(--accent-soft)" : ""}">${st.solved ? `Solved with ${st.mistakes} mistake${st.mistakes === 1 ? "" : "s"}! 🎉` : "Out of tries. Here are the groups."}</div>${nextBtn(api)}` : `
      <div class="lives">${isHard("groups") ? "Hard mode · " : ""}Mistakes left ${(isHard("groups") ? [0,1] : [0,1,2,3]).map(i => `<i class="${i < st.mistakes ? "gone" : ""}"></i>`).join("")}</div>
      <div class="tools"><button class="btn ghost" data-tool="shuffle">Shuffle</button><button class="btn ghost" data-tool="clear">Deselect</button><button class="btn" data-tool="submit" ${selected.length === 4 ? "" : "disabled style='opacity:.4'"}>Submit</button></div>`}`;
  };
  host.onclick = e => {
    if (e.target.closest("[data-back]")) { onKeys(null); return api.back(); }
    if (e.target.closest("[data-nextp]")) return api.next();
    if (st.solved || st.failed) return;
    const b = e.target.closest("[data-w]");
    if (b) { const w = b.dataset.w; selected.includes(w) ? selected = selected.filter(x => x !== w) : selected.length < 4 && selected.push(w); draw(); return; }
    const t = e.target.closest("[data-tool]"); if (!t) return;
    if (t.dataset.tool === "shuffle") { st.order = shuffle(st.order, Math.random); api.save(); }
    if (t.dataset.tool === "clear") selected = [];
    if (t.dataset.tool === "submit" && selected.length === 4) {
      started(st);
      const key = selected.slice().sort().join("|");
      if (st.tried.includes(key)) { api.toast("Already tried that one"); return; }
      st.tried.push(key);
      const counts = {}; selected.forEach(w => { const g = groupOf(w); counts[g] = (counts[g] || 0) + 1; });
      const best = Math.max(...Object.values(counts));
      if (best === 4) { st.found.push(groupOf(selected[0])); selected = []; if (st.found.length === 4) finish(st, api, "All groups found! 🎉"); }
      else { st.mistakes++; api.toast(best === 3 && !isHard("groups") ? "One away…" : "Not a group"); if (st.mistakes >= (isHard("groups") ? 2 : 4)) st.failed = true; }
      api.save();
    }
    draw();
  };
  onKeys(null);
  draw();
}

window.Puzzles = {
  sudoku: (h, d, s, a) => sudoku(h, d, s, a),
  crossword: (h, d, s, a) => crossword(h, d, s, a),
  word: (h, d, s, a) => word(h, d, s, a),
  groups: (h, d, s, a) => groups(h, d, s, a),
  _test: { sudokuMake, scoreGuess, groupsMake }
};
})();
