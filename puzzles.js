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
        const cls = [puz[i] ? "given" : "user", i === sel ? "cur" : (sv && v === sv ? "same" : peer ? "peer" : ""), (!puz[i] && v && v !== sol[i]) ? "bad" : ""].join(" ");
        const notes = !v && st.notes[i] && st.notes[i].length ? `<div class="notes">${[1,2,3,4,5,6,7,8,9].map(n => `<span>${st.notes[i].includes(n) ? n : ""}</span>`).join("")}</div>` : (v || "");
        return `<div class="${cls}" data-cell="${i}">${notes}</div>`;
      }).join("")}</div>
      <div class="numpad">${[1,2,3,4,5,6,7,8,9].map(n => `<button data-num="${n}" class="${counts[n] >= 9 ? "used" : ""}">${n}</button>`).join("")}</div>
      <div class="tools"><button class="btn ghost ${notesMode ? "on" : ""}" data-tool="notes">✏️ Notes ${notesMode ? "on" : "off"}</button><button class="btn ghost" data-tool="erase">⌫ Erase</button><button class="btn ghost" data-tool="hint">💡 Hint</button></div>
      ${st.solved ? `<div class="win">Solved${st.time ? " in " + fmtTime(st.time) : ""}! 🎉</div>${nextBtn(api)}` : '<p class="muted small" style="text-align:center">Wrong numbers turn red right away.</p>'}`;
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
function crossword(host, date, st, api) {
  const list = window.CROSSWORDS;
  const z = list[dailyIndex(date, "xw", list.length)];
  const N = 4;
  const sol = z.rows.join("");
  st.cells = st.cells || Array(N * N).fill("");
  let sel = st.cells.findIndex(v => !v); if (sel < 0) sel = 0;
  let dir = "a";
  // numbering for a full 4x4: across 1,5,6,7 ; down 1,2,3,4
  const num = i => (i < N ? i + 1 : i % N === 0 ? N + i / N : null);
  const clueNum = (d, k) => d === "a" ? (k === 0 ? 1 : N + k) : k + 1;
  const clue = (d, k) => (d === "a" ? z.across[k] : z.down[k]);
  const idxOf = () => (dir === "a" ? Math.floor(sel / N) : sel % N);
  const inWord = i => (dir === "a" ? Math.floor(i / N) === Math.floor(sel / N) : i % N === sel % N);
  let checked = false;
  const draw = () => {
    const k = idxOf();
    host.innerHTML = head("Mini crossword", "Every row and column is a word") + `
      <div class="xw" style="grid-template-columns:repeat(${N},1fr)">${st.cells.map((v, i) => {
        const n = num(i);
        const cls = [i === sel ? "cur" : inWord(i) ? "word" : "", (st.solved || st.revealed) ? "ok" : checked && v && v !== sol[i] ? "no" : ""].join(" ");
        return `<div class="${cls}" data-cell="${i}">${n ? `<sup>${n}</sup>` : ""}${esc(v)}</div>`;
      }).join("")}</div>
      <div class="clue-bar"><button data-nav="-1">‹</button><div class="grow" data-flip><span class="muted">${clueNum(dir, k)}${dir === "a" ? "A" : "D"}</span> ${esc(clue(dir, k))}</div><button data-nav="1">›</button></div>
      ${st.solved || st.revealed ? `<div class="win">${st.revealed ? "Revealed. Try again tomorrow!" : `Solved${st.time ? " in " + fmtTime(st.time) : ""}! 🎉`}</div>` : keyboard()}
      <div class="tools"><button class="btn ghost" data-tool="check">Check</button><button class="btn ghost" data-tool="reveal">Reveal</button></div>
      <div class="clues" style="margin-top:14px">
        <div><h3>Across</h3>${z.across.map((c, j) => `<p class="${dir === "a" && j === k ? "on" : ""}" data-clue="a${j}"><b>${clueNum("a", j)}</b> ${esc(c)}</p>`).join("")}</div>
        <div><h3>Down</h3>${z.down.map((c, j) => `<p class="${dir === "d" && j === k ? "on" : ""}" data-clue="d${j}"><b>${clueNum("d", j)}</b> ${esc(c)}</p>`).join("")}</div>
      </div>`;
  };
  const step = d => { // move within word
    if (dir === "a") { const c = sel % N + d; if (c >= 0 && c < N) sel += d; }
    else { const r = Math.floor(sel / N) + d; if (r >= 0 && r < N) sel += d * N; }
  };
  const jumpWord = d => { let k = idxOf() + d; if (k >= N) { k = 0; dir = dir === "a" ? "d" : "a"; } if (k < 0) { k = N - 1; dir = dir === "a" ? "d" : "a"; } sel = dir === "a" ? k * N : k; };
  const type = ch => {
    if (st.solved || st.revealed) return;
    started(st); checked = false;
    if (ch === "back") {
      if (!st.cells[sel]) step(-1);
      st.cells[sel] = "";
    } else if (ch === "enter") { jumpWord(1); }
    else {
      st.cells[sel] = ch;
      const atEnd = dir === "a" ? sel % N === N - 1 : Math.floor(sel / N) === N - 1;
      if (atEnd) jumpWord(1); else step(1);
    }
    if (st.cells.join("") === sol) finish(st, api, "Crossword solved! 🎉");
    else if (st.cells.every(v => v)) api.toast("Not quite. Tap Check to see which letters are off.");
    api.save(); draw();
  };
  host.onclick = e => {
    if (e.target.closest("[data-back]")) { onKeys(null); return api.back(); }
    const c = e.target.closest("[data-cell]"); if (c) { const i = +c.dataset.cell; if (i === sel) dir = dir === "a" ? "d" : "a"; else sel = i; draw(); return; }
    const k = e.target.closest("[data-key]"); if (k) return type(k.dataset.key);
    const nv = e.target.closest("[data-nav]"); if (nv) { jumpWord(+nv.dataset.nav); draw(); return; }
    if (e.target.closest("[data-flip]")) { dir = dir === "a" ? "d" : "a"; draw(); return; }
    const cl = e.target.closest("[data-clue]"); if (cl) { dir = cl.dataset.clue[0]; const j = +cl.dataset.clue.slice(1); sel = dir === "a" ? j * N : j; draw(); return; }
    const t = e.target.closest("[data-tool]");
    if (t && t.dataset.tool === "check") { checked = true; draw(); }
    if (t && t.dataset.tool === "reveal" && !st.solved) { st.cells = [...sol]; st.revealed = true; api.save(); draw(); }
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
function word(host, date, st, api) {
  const answer = D.words[dailyIndex(date, "word", D.words.length)];
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
    host.innerHTML = head("Word guess", `${hard ? "Hard mode · " : ""}Green = right spot · Gold = in the word`) + `<div class="wg">${rows}</div>
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
      <div class="lives">Mistakes left ${[0,1,2,3].map(i => `<i class="${i < st.mistakes ? "gone" : ""}"></i>`).join("")}</div>
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
      else { st.mistakes++; api.toast(best === 3 ? "One away…" : "Not a group"); if (st.mistakes >= 4) st.failed = true; }
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
