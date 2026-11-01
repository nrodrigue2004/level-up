(() => {
"use strict";
const D = window.PLANNER_DATA;
const KEY = "planner.v1";
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- dates ----------
const pad = n => String(n).padStart(2, "0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const todayISO = () => iso(new Date());
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const prettyDate = s => parse(s).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
const hash = str => { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const dayIndex = (s, n) => hash(s) % n;

// ---------- state ----------
function defaults() {
  const plan = {};
  const def = { 1: "Push", 2: "Pull", 3: "Legs", 4: "Cardio + core", 5: "Full body", 6: "Rest / mobility", 0: "Rest / mobility" };
  for (let i = 0; i < 7; i++) plan[i] = { name: def[i], exercises: D.workoutTemplates[def[i]].slice() };
  return {
    days: {}, events: {}, puzzles: {},
    settings: { calGoal: 2400, proteinGoal: 160, waterGoal: 80 },
    plan, presets: D.presets.map(p => p.slice()), version: 1
  };
}
let S;
try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = defaults(); }
let saveT;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Couldn't save: storage full?"); } }, 150);
}
window.addEventListener("pagehide", () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} });
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

let cur = todayISO();
let tab = "today";
let sub = "plan";
let calMonth = cur.slice(0, 7);

const blankDay = () => ({ checks: {}, mood: null, worked: null, water: 0, food: [], journal: "", learned: "", song: { title: "", artist: "" }, topic: null, jobs: 0, wkDone: {}, wkNotes: "", passageRead: false });
const day = (d = cur) => {
  const x = S.days[d] || (S.days[d] = {});
  const b = blankDay(); for (const k in b) if (x[k] === undefined) x[k] = b[k];
  return x;
};
const peek = d => S.days[d] || null;
const puzzleState = (d = cur) => (S.puzzles[d] = S.puzzles[d] || {});
const workoutFor = d => { const dd = peek(d); return (dd && dd.wkOverride) || S.plan[parse(d).getDay()]; };

// ---------- checklist logic ----------
const allItems = D.checklist.flatMap(s => s.items);
function isChecked(id, d = cur) {
  const dd = peek(d); if (!dd) return false;
  const it = allItems.find(i => i[0] === id); const kind = it && it[2] || "";
  if (kind === "auto:water" && dd.water >= S.settings.waterGoal) return true;
  if (kind === "auto:passage" && dd.passageRead) return true;
  if (kind.startsWith("puzzle:")) { const p = (S.puzzles[d] || {})[kind.slice(7)]; if (p && p.solved) return true; }
  if (kind === "workout" && dd.worked === true) return true;
  if (kind.startsWith("counter:") && dd.jobs >= Number(kind.split(":")[2])) return true;
  if (kind === "learning" && dd.topic) return true;
  return !!dd.checks[id];
}
function progress(d = cur) {
  if (!peek(d)) return 0;
  const done = allItems.filter(i => isChecked(i[0], d)).length;
  return done / allItems.length;
}

// ---------- ui helpers ----------
let toastT;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
}
const moodColor = v => `hsl(${(v - 1) * 13}, 65%, 48%)`;
const MOOD_FACES = ["", "😞", "😣", "😕", "😐", "🙂", "😊", "😄", "😁", "🤩", "🔥"];
function ring(p) {
  const r = 36, c = 2 * Math.PI * r;
  return `<div class="ring"><svg width="84" height="84"><circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--line)" stroke-width="8"/>
  <circle cx="42" cy="42" r="${r}" fill="none" stroke="var(--good)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" style="transition:stroke-dashoffset .4s"/></svg><b>${Math.round(p * 100)}%</b></div>`;
}
function foodTotals(d = cur) {
  const dd = peek(d); const f = dd ? dd.food : [];
  return { cal: f.reduce((a, x) => a + (+x.cal || 0), 0), pro: f.reduce((a, x) => a + (+x.pro || 0), 0) };
}

// ---------- header ----------
function renderHeader() {
  const isToday = cur === todayISO();
  const t = tabs().find(x => x.id === tab) || {};
  $("#title").innerHTML = `${esc(t.label || "")}<small>${isToday ? "Today · " : ""}${esc(prettyDate(cur))}</small>`;
  const hide = tab === "fighter" || (tab === "today" && sub === "calendar");
  $("#prev").style.visibility = hide ? "hidden" : "";
  $("#next").style.visibility = hide ? "hidden" : "";
}

// ---------- workout logging, runs, protein, water ----------
const parseEx = ex => { const m = ex.match(/^(.*?)\s+(\d+)\s*[x×]\s*(\d+)\s*([a-z ]*)$/i); return m ? { name: m[1].trim(), sets: Math.min(+m[2], 10), reps: m[3] + (m[4] && m[4].trim() ? " " + m[4].trim() : ""), weighted: !m[4] } : { name: ex.trim(), sets: 0, reps: "", weighted: false }; };
const e1rm = (w, r) => w * (1 + r / 30);
let openEx = null;
function lastSets(name) {
  const ds = Object.keys(S.days).filter(d => d < cur && S.days[d].sets && S.days[d].sets[name]).sort();
  return ds.length ? S.days[ds[ds.length - 1]].sets[name] : null;
}
function exerciseRow(ex, i, dd) {
  const p = parseEx(ex), key = p.name.toLowerCase();
  const pr = (S.prs || {})[key];
  const logged = (dd.sets || {})[key] || [];
  const prev = lastSets(key);
  const doneSets = logged.filter(x => x && x.r).length;
  let html = `<div class="exrow ${dd.wkDone[i] ? "on" : ""}"><div class="item" data-act="wkex" data-i="${i}" style="flex:1"><div class="box"></div>
    <div class="label">${esc(p.name)} <span class="muted small">${p.sets ? `${p.sets}×${esc(p.reps)}` : ""}</span>${pr ? `<div class="muted small">🏆 PR ${pr.w} × ${pr.r}</div>` : ""}</div></div>
    ${p.sets && p.weighted ? `<button class="btn ghost small" data-act="exopen" data-v="${i}">${doneSets ? `${doneSets}/${p.sets} sets` : "Log sets"}</button>` : ""}</div>`;
  if (openEx === i && p.sets) {
    html += `<div class="sets">${Array.from({ length: p.sets }, (_, j) => {
      const x = logged[j] || {}, pv = prev && prev[j];
      return `<div class="setrow"><span class="muted small">Set ${j + 1}</span>
        <input type="number" inputmode="decimal" placeholder="${pv && pv.w ? pv.w : "lbs"}" value="${x.w ?? ""}" data-set="${key}" data-j="${j}" data-k="w">
        <span class="muted">×</span>
        <input type="number" inputmode="numeric" placeholder="${pv && pv.r ? pv.r : parseInt(p.reps) || "reps"}" value="${x.r ?? ""}" data-set="${key}" data-j="${j}" data-k="r"></div>`;
    }).join("")}${prev ? `<div class="muted small">Last time: ${prev.filter(x => x && x.r).map(x => `${x.w || "BW"}×${x.r}`).join(", ")}</div>` : ""}${overloadTip(p, prev)}</div>`;
  }
  return html;
}
function overloadTip(p, prev) {
  if (!prev) return "";
  const target = parseInt(p.reps) || 0, done = prev.filter(x => x && x.r);
  if (!target || done.length < p.sets) return "";
  const w = Math.max(...done.map(x => x.w || 0));
  if (done.every(x => x.r >= target) && w) return `<div class="nudge">💡 You hit every rep last time. Try ${w + 5} lbs today (progressive overload).</div>`;
  if (done.some(x => x.r < target - 2)) return `<div class="nudge">💡 Reps dropped last time. Stay at ${w} lbs and own every rep.</div>`;
  return `<div class="nudge">💡 Close last time. Same weight, aim for one more rep per set.</div>`;
}
function runRow(dd) {
  const runs = Object.keys(S.days).filter(d => S.days[d].runSec).sort().slice(-12);
  const secs = runs.map(d => S.days[d].runSec);
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  let trend = "";
  if (secs.length >= 2) {
    const max = Math.max(...secs), min = Math.min(...secs), span = Math.max(1, max - min);
    const pts = secs.map((v, k) => `${(k / (secs.length - 1)) * 200},${8 + (v - min) / span * 44}`).join(" ");
    const avg = secs.slice(0, -1).reduce((a, b) => a + b, 0) / (secs.length - 1), last = secs[secs.length - 1];
    trend = `<svg viewBox="0 0 200 60" class="spark"><polyline points="${pts}" fill="none" stroke="var(--good)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>
      <div class="muted small">Best ${fmt(min)} · last ${fmt(last)} (${last <= avg ? `${Math.round(avg - last)}s faster` : `${Math.round(last - avg)}s slower`} than your average) · lower line = faster</div>`;
  }
  return `<div class="runbox"><div class="row"><b class="grow">🏃 Half-mile run</b>
    <input type="text" inputmode="numeric" placeholder="m:ss" value="${dd.runSec ? fmt(dd.runSec) : ""}" data-run style="width:90px;text-align:center">
    ${dd.runSec ? `<span class="muted small">${fmt(dd.runSec * 2)}/mi</span>` : ""}</div>${trend}</div>`;
}
function proteinCard() {
  const t = foodTotals(), g = S.settings.proteinGoal;
  const quick = S.presets.filter(p => p[2] >= 10).slice(0, 5);
  return `<div class="card"><h2>🥩 Protein <span class="right">${t.pro} / ${g} g</span></h2>
    <div class="bar protein" style="height:14px"><div style="width:${Math.min(100, t.pro / g * 100)}%"></div></div>
    <div class="chips" style="margin-top:10px">${quick.map(p => `<button class="chip" data-act="addpreset" data-i="${S.presets.indexOf(p)}">+${p[2]}g ${esc(p[0].split(",")[0])}</button>`).join("")}</div>
    <div class="muted small" style="margin-top:6px">${t.cal} cal so far · full log in Food</div></div>`;
}
function bottle(frac) {
  const f = Math.max(0, Math.min(1, frac)), h = 92 * f;
  return `<svg viewBox="0 0 60 120" width="56" height="112" class="bottle"><defs><clipPath id="bclip"><path d="M22 4h16v12c0 4 12 8 12 18v76a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V34c0-10 12-14 12-18z"/></clipPath></defs>
    <rect x="0" y="${116 - h}" width="60" height="${h}" fill="var(--water)" clip-path="url(#bclip)"/>
    <path d="M22 4h16v12c0 4 12 8 12 18v76a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V34c0-10 12-14 12-18z" fill="none" stroke="var(--water)" stroke-width="3"/>
    <text x="30" y="80" text-anchor="middle" font-size="14" font-weight="800" fill="${f > .45 ? "#fff" : "var(--ink)"}">${Math.round(f * 100)}%</text></svg>`;
}
const feltCount = a => Object.values(S.days).filter(x => (x.felt || []).includes(a)).length;

// ---------- TODAY (with sub pages) ----------
const SUBS = [["plan", "Plan"], ["food", "Food"], ["journal", "Journal"], ["calendar", "Calendar"]];
function renderTodayTab() {
  const views = { plan: renderToday, food: renderFood, journal: renderJournal, calendar: renderCalendar };
  return `<div class="subtabs">${SUBS.map(([k, l]) => `<button class="${sub === k ? "on" : ""}" data-act="sub" data-v="${k}">${l}</button>`).join("")}</div>` + views[sub]();
}
function renderToday() {
  const dd = day();
  const affIdx = (dd.affIdx ?? dayIndex(cur, D.affirmations.length)) % D.affirmations.length;
  const w = workoutFor(cur);
  const water = dd.water, goal = S.settings.waterGoal;
  let html = `${window.Features ? window.Features.todayTop() : ""}
  <div class="card hero">${ring(progress())}
    <div class="grow"><div class="muted small">Affirmation · tap for next</div><div class="aff" data-act="aff">${esc(D.affirmations[affIdx])}</div>
      <button class="felt ${(dd.felt || []).includes(D.affirmations[affIdx]) ? "on" : ""}" data-act="felt" data-v="${esc(D.affirmations[affIdx])}">${(dd.felt || []).includes(D.affirmations[affIdx]) ? "❤️ Felt this today" : "🤍 Felt this today?"}</button>
      ${feltCount(D.affirmations[affIdx]) ? `<span class="muted small"> · ${feltCount(D.affirmations[affIdx])}× total</span>` : ""}</div>
  </div>
<!--IDEAL-->

  ${soberCard(false)}
  <div class="card"><h2>How are you feeling? <span class="right">${dd.mood ? dd.mood + "/10" : ""}</span></h2>
    <div class="mood">${Array.from({ length: 10 }, (_, i) => i + 1).map(v =>
      `<button data-act="mood" data-v="${v}" class="${dd.mood === v ? "on" : ""}" style="${dd.mood === v ? "background:" + moodColor(v) : ""}">${v}</button>`).join("")}</div>
    <div class="mood-label">${dd.mood ? MOOD_FACES[dd.mood] : '<span class="muted small">Tap a number</span>'}</div>
  </div>

  <div class="card"><h2>💧 Water <span class="right">${water} / ${goal} oz</span></h2>
    <div class="row" style="gap:16px">${bottle(water / goal)}
      <div class="grow"><div class="chips">
        ${[8, 16, 32].map(n => `<button class="chip water big" data-act="water" data-v="${n}">+${n} oz</button>`).join("")}
        <button class="chip" data-act="water" data-v="-8">−8</button></div>
        <div class="muted small" style="margin-top:8px">${water >= goal ? "Goal hit. Nice. 💧" : `${goal - water} oz to go · about ${Math.ceil((goal - water) / 16)} more bottle${Math.ceil((goal - water) / 16) === 1 ? "" : "s"} of 16 oz`}</div></div>
    </div>
  </div>

  ${proteinCard()}

  ${window.Features3 ? window.Features3.beforeWorkout(dd) : ""}
  <div class="card"><h2>🏋️ Workout: ${esc(w.name)} <span class="right"><button class="btn ghost small" data-act="plan">Edit plan</button></span></h2>
    <div class="seg" style="margin-bottom:10px">
      <button data-act="worked" data-v="yes" class="${dd.worked === true ? "on" : ""}">I worked out</button>
      <button data-act="worked" data-v="no" class="${dd.worked === false ? "on no" : ""}">Not today</button>
    </div>
    ${w.exercises.length ? w.exercises.map((ex, i) => exerciseRow(ex, i, dd)).join("") : '<div class="muted small">Nothing scheduled. Tap Edit plan to add exercises.</div>'}
    ${runRow(dd)}
    ${window.Features3 ? window.Features3.workoutExtras(dd) : ""}
    <label class="field">Workout notes (weights, how it felt)
      <textarea data-bind="wkNotes" style="min-height:60px" placeholder="Bench 135x8, felt strong">${esc(dd.wkNotes)}</textarea></label>
  </div>

  <div class="card"><h2>✅ My ideal day</h2>`;
  for (const sec of D.checklist) {
    const done = sec.items.filter(i => isChecked(i[0])).length;
    const pref = (S.openSecs || {})[sec.id]; const open = pref != null ? pref !== false : done < sec.items.length; // finished sections fold away
    html += `<details class="section" data-sec="${sec.id}" ${open ? "open" : ""}><summary>${sec.icon} ${esc(sec.title)}<span class="count ${done === sec.items.length ? "done" : ""}">${done}/${sec.items.length}</span></summary>`;
    for (const [id, label, kind = ""] of sec.items) {
      const on = isChecked(id);
      let extra = "";
      if (kind === "recipe:smoothie") extra = `<button class="link" data-act="recipe">${S.showRecipe ? "Hide" : "Show"} recipe</button>`;
      if (kind.startsWith("puzzle:")) extra = `<button class="link" data-act="openpuzzle" data-p="${kind.slice(7)}">Play →</button>`;
      if (kind.startsWith("counter:")) extra = `<div class="counter"><button data-act="jobs" data-v="-1">−</button><b>${dd.jobs}</b> / ${kind.split(":")[2]} sent<button data-act="jobs" data-v="1">+</button></div>`;
      if (kind === "auto:water") extra = `<div class="extra">${dd.water} of ${goal} oz · fills in from the water tracker</div>`;
      if (kind === "auto:passage") extra = `<button class="link" data-act="sub" data-v="journal">Read today's passage →</button>`;
      if (kind === "learning") extra = `<div class="chips" style="margin-top:8px">${D.learningTopics.map(t => `<button class="chip ${dd.topic === t ? "on" : ""}" data-act="topic" data-v="${esc(t)}">${esc(t)}</button>`).join("")}</div>${TOPIC_SUBJ[dd.topic] && window.App.learn ? `<button class="link" data-act="learnsubj" data-v="${TOPIC_SUBJ[dd.topic]}">Open ${esc(dd.topic)} in Learn →</button>` : ""}`;
      html += `<div class="item ${on ? "on" : ""}" data-act="check" data-id="${id}"><div class="box"></div><div class="label">${esc(label)}${extra ? `<div>${extra}</div>` : ""}</div></div>`;
      if (kind === "recipe:smoothie" && S.showRecipe) {
        const tot = D.smoothie.ingredients.reduce((a, x) => [a[0] + x[1], a[1] + x[2]], [0, 0]);
        html += `<div class="recipe"><ul style="margin:0;padding-left:18px">${D.smoothie.ingredients.map(x => `<li>${esc(x[0])}</li>`).join("")}</ul>
          <div class="muted small" style="margin-top:6px">About ${tot[0]} cal · ${tot[1]} g protein</div>
          <button class="btn small" style="margin-top:8px" data-act="addpreset" data-i="0">Log it in Food</button></div>`;
      }
    }
    html += `</details>`;
  }
  html += `</div>`;
  const k = html.indexOf('<div class="card"><h2>✅ My ideal day</h2>');
  return html.slice(0, k).replace("<!--IDEAL-->", html.slice(k));
}
const TOPIC_SUBJ = { "Spanish": "spanish", "Computer science": "cs", "History": "history", "Piano or guitar": "music", "Psychology": "mind", "Philosophy": "mind", "Science": "science" };

// ---------- FOOD ----------
function renderFood() {
  const dd = day(); const t = foodTotals();
  const { calGoal, proteinGoal } = S.settings;
  return `
  <div class="card"><h2>Today's totals</h2>
    <div class="macro"><div class="row"><b>Calories</b><span>${t.cal} / ${calGoal}</span></div><div class="bar"><div style="width:${Math.min(100, t.cal / calGoal * 100)}%"></div></div></div>
    <div class="macro"><div class="row"><b>Protein</b><span>${t.pro} / ${proteinGoal} g</span></div><div class="bar protein"><div style="width:${Math.min(100, t.pro / proteinGoal * 100)}%"></div></div></div>
    <div class="muted small">${t.cal < calGoal ? `${calGoal - t.cal} cal left` : `${t.cal - calGoal} cal over`} · ${t.pro < proteinGoal ? `${proteinGoal - t.pro} g protein to go` : "protein goal hit 💪"}</div>
  </div>

  <div class="card"><h2>Add food</h2>
    <form data-form="food">
      <input type="text" name="name" placeholder="What did you eat?" autocomplete="off" required>
      <div class="row" style="margin-top:8px">
        <input class="grow" type="number" name="cal" inputmode="numeric" placeholder="Calories">
        <input class="grow" type="number" name="pro" inputmode="decimal" placeholder="Protein (g)">
      </div>
      <div class="row" style="margin-top:8px">
        <button class="btn grow" type="submit">Add</button>
        <label class="small muted row"><input type="checkbox" name="fav"> Save as quick add</label>
      </div>
    </form>
  </div>

  <div class="card"><h2>Quick add <span class="right"><button class="btn ghost small" data-act="editpresets">${S.editPresets ? "Done" : "Edit"}</button></span></h2>
    <div class="chips">${S.presets.map((p, i) => `<button class="chip" data-act="${S.editPresets ? "delpreset" : "addpreset"}" data-i="${i}">${S.editPresets ? "✕ " : ""}${esc(p[0])} <span class="muted">· ${p[1]} cal · ${p[2]}g</span></button>`).join("")}</div>
  </div>

  <div class="card"><h2>Eaten today <span class="right">${dd.food.length} items</span></h2>
    <div class="food-list">${dd.food.length ? dd.food.map((f, i) => `
      <div class="food"><div class="grow"><div>${esc(f.name)}</div><div class="meta">${f.cal || 0} cal · ${f.pro || 0} g protein${f.time ? " · " + esc(f.time) : ""}</div></div>
      <button class="x" data-act="delfood" data-i="${i}" aria-label="Remove">✕</button></div>`).join("") : '<div class="muted small">Nothing logged yet.</div>'}</div>
  </div>
  <p class="muted small" style="text-align:center">Quick-add numbers are estimates. Tap Edit to remove ones you don't use, or save your own.</p>`;
}

// ---------- JOURNAL ----------
const PASSAGE_CATS = [["stoic", "Stoic & philosophy"], ["mma", "Fighters"], ["tech", "Tech history"], ["faith", "Faith & wisdom"]];
function passageFor(d) {
  const n = Math.round(parse(d).getTime() / 86400000);
  const [cat] = PASSAGE_CATS[((n % 4) + 4) % 4];
  const list = D.passages.filter(p => (p.cat || "stoic") === cat);
  return Object.assign({ catName: PASSAGE_CATS.find(c => c[0] === cat)[1] }, list[(hash("pp" + cat) + Math.floor(n / 4)) % list.length]);
}
function renderJournal() {
  const dd = day();
  const p = passageFor(cur);
  const bonus = D.bonusAffirmations[((Math.round(parse(cur).getTime() / 86400000) % D.bonusAffirmations.length) + D.bonusAffirmations.length) % D.bonusAffirmations.length];
  const q = encodeURIComponent(`${dd.song.title} ${dd.song.artist}`.trim());
  return `
  ${window.Features ? window.Features.journalTop() : ""}
  <div class="card"><h2>📖 Today's passage <span class="right">${esc(p.catName)}</span></h2>
    <blockquote>“${esc(p.text)}”</blockquote><div class="by">— ${esc(p.by)}</div>
    <div class="ask">${esc(p.ask)}</div>
    <button class="btn ${dd.passageRead ? "ghost" : ""} block" style="margin-top:12px" data-act="readpassage">${dd.passageRead ? "✓ Read" : "Mark as read"}</button>
  </div>

  <div class="card"><h2>🗣️ Affirmations</h2>
    ${D.affirmations.map(a => `<div style="padding:6px 0;font-weight:600">${esc(a)}</div>`).join("")}
    <div class="muted small" style="margin-top:8px">Bonus for today: ${esc(bonus)}</div>
  </div>

  <div class="card"><h2>🎵 Song of the day</h2>
    <div class="row"><input class="grow" type="text" data-bind="song.title" placeholder="Song" value="${esc(dd.song.title)}">
    <input class="grow" type="text" data-bind="song.artist" placeholder="Artist" value="${esc(dd.song.artist)}"></div>
    <input type="text" data-bind="song.why" placeholder="Why this song today? (one line)" value="${esc(dd.song.why || "")}" style="margin-top:8px">
    ${q ? `<div class="row" style="margin-top:8px"><a class="btn ghost small" target="_blank" rel="noopener" href="https://music.apple.com/us/search?term=${q}">Apple Music</a>
    <a class="btn ghost small" target="_blank" rel="noopener" href="https://open.spotify.com/search/${q}">Spotify</a>
    <a class="btn ghost small" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${q}">YouTube</a></div>` : ""}
  </div>

  <div class="card"><h2>💡 Something I learned</h2>
    <textarea data-bind="learned" style="min-height:80px" placeholder="One thing, big or small">${esc(dd.learned)}</textarea>
  </div>

  <div class="card"><h2>✍️ Journal</h2>
    <textarea data-bind="journal" style="min-height:200px" placeholder="What happened today? What went well? What would you do differently?">${esc(dd.journal)}</textarea>
    <div class="muted small" style="margin-top:6px">Saves automatically.</div>
  </div>
  ${window.Features2 ? window.Features2.journalBottom() : ""}`;
}

// ---------- CALENDAR ----------
function streak(test) {
  let d = todayISO(), n = 0;
  if (!test(d)) d = addDays(d, -1); // today not done yet doesn't break it
  while (test(d)) { n++; d = addDays(d, -1); if (n > 3650) break; }
  return n;
}
function weekStats(end) {
  const ds = Array.from({ length: 7 }, (_, i) => addDays(end, -6 + i));
  const logged = ds.filter(peek);
  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const moods = logged.map(d => peek(d).mood).filter(v => v);
  const foodDays = logged.filter(d => peek(d).food.length);
  return {
    ds,
    mood: avg(moods),
    protein: avg(foodDays.map(d => foodTotals(d).pro)),
    cal: avg(foodDays.map(d => foodTotals(d).cal)),
    water: avg(logged.map(d => peek(d).water)),
    workouts: logged.filter(d => peek(d).worked === true).length,
    done: avg(ds.map(progress))
  };
}
function renderCalendar() {
  const [y, m] = calMonth.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const start = addDays(iso(first), -first.getDay());
  const tdy = todayISO();
  let grid = DOW.map(d => `<div class="dow">${d[0]}</div>`).join("");
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i); const dd = peek(d); const inMonth = d.slice(0, 7) === calMonth;
    if (i >= 35 && !inMonth) break;
    const p = progress(d);
    const bg = dd && p > 0 ? `background:color-mix(in srgb, var(--good) ${Math.round(15 + p * 70)}%, var(--bg));${p > .6 ? "color:#fff;" : ""}` : "";
    const dots = [(S.events[d] || []).length ? "<i></i>" : "", dd && dd.worked ? '<i class="w"></i>' : "", dd && dd.water >= S.settings.waterGoal ? '<i class="h"></i>' : ""].join("");
    grid += `<button class="cal-day ${inMonth ? "" : "out"} ${d === tdy ? "today" : ""} ${d === cur ? "sel" : ""}" style="${bg}" data-act="calpick" data-v="${d}">${parse(d).getDate()}<span class="dots">${dots}</span></button>`;
  }
  const dd = peek(cur); const t = foodTotals(cur);
  const ev = (S.events[cur] || []).slice().sort((a, b) => (a.time || "99").localeCompare(b.time || "99"));
  return `
  <div class="card">
    <div class="cal-head"><button class="icon-btn" data-act="calmonth" data-v="-1">‹</button><b>${MONTHS[m - 1]} ${y}</b><button class="icon-btn" data-act="calmonth" data-v="1">›</button></div>
    <div class="cal-grid">${grid}</div>
    <div class="legend"><span>Green = more of your ideal day done</span><span><i style="background:var(--accent)"></i>event</span><span><i style="background:var(--good)"></i>worked out</span><span><i style="background:var(--water)"></i>water goal</span></div>
  </div>

  <div class="card"><h2>${esc(prettyDate(cur))} <span class="right"><button class="btn small" data-act="openday">Open day</button></span></h2>
    ${dd ? `<div class="stat-grid">
      <div>Ideal day<b>${Math.round(progress(cur) * 100)}%</b></div>
      <div>Mood<b>${dd.mood ? dd.mood + "/10 " + MOOD_FACES[dd.mood] : "–"}</b></div>
      <div>Food<b>${t.cal} cal · ${t.pro} g</b></div>
      <div>Water<b>${dd.water} oz</b></div>
      <div>Workout<b>${dd.worked === true ? "Yes · " + esc(workoutFor(cur).name) : dd.worked === false ? "No" : "–"}</b></div>
      <div>Song<b>${esc(dd.song.title || "–")}</b></div>
    </div>
    ${dd.journal ? `<div class="small" style="white-space:pre-wrap;max-height:120px;overflow:hidden">${esc(dd.journal)}</div>` : ""}
    ${dd.learned ? `<div class="small" style="margin-top:6px"><b>Learned:</b> ${esc(dd.learned)}</div>` : ""}`
    : `<div class="muted small">Nothing logged for this day${cur > tdy ? " yet. Add events below." : "."}</div>`}
    <h2 style="margin-top:14px">Events</h2>
    <div>${ev.length ? ev.map(e => `<div class="event"><time>${esc(e.time || "All day")}</time><div class="grow">${esc(e.title)}</div><button class="x" data-act="delevent" data-id="${e.id}">✕</button></div>`).join("") : '<div class="muted small">No events.</div>'}</div>
    <form data-form="event" class="row" style="margin-top:10px">
      <input class="grow" type="text" name="title" placeholder="Add an event" required autocomplete="off">
      <input type="time" name="time" style="width:110px">
      <button class="btn" type="submit">Add</button>
    </form>
  </div>`;
}

// ---------- PUZZLES ----------
let puzzleView = null;
function renderPuzzles() {
  if (puzzleView) return `<div id="puzzle-host"></div>`;
  return `<div class="card hero" style="padding:12px 16px"><div class="grow"><b>Daily puzzles</b><div class="muted small">${esc(prettyDate(cur))} · 15 XP each</div></div></div>` + puzzleTiles();
}
function puzzleTiles() {
  const ps = puzzleState();
  const tiles = [
    ["sudoku", "🔢", "Sudoku", "Fill the 9×9 grid"],
    ["crossword", "✏️", "Crossword", "5×5 weekdays · 6×6 weekends"],
    ["word", "🔤", "Word guess", "Find the 5-letter word in 6 tries"],
    ["groups", "🧩", "Groups", "Sort 16 words into 4 groups"]
  ];
  return `<div class="puzzle-list">${tiles.map(([k, em, name, sub]) => {
    const st = ps[k]; const status = st && st.solved ? "✓ Solved" : st && st.failed ? "Out of tries" : st && st.started ? "In progress" : "Not started";
    return `<button class="ptile ${st && st.solved ? "done" : ""}" data-act="openpuzzle" data-p="${k}"><span class="em">${em}</span><b>${name}</b><span class="small muted">${sub}</span><span class="st">${status}</span></button>`;
  }).join("")}</div>
  ${window.Arena ? window.Arena.card() : ""}
  <div class="card" style="margin-top:12px"><h2>♾️ Practice <span class="right">unlimited, no XP</span></h2>
    <div class="row" style="flex-wrap:wrap">
      <select id="sdk-level" style="width:auto;flex:1">${["easy", "medium", "hard", "expert"].map(l => `<option ${(S.practiceLevel || "medium") === l ? "selected" : ""}>${l}</option>`).join("")}</select>
      <button class="btn ghost" data-act="practice" data-p="sudoku">🔢 Sudoku</button>
      <button class="btn ghost" data-act="practice" data-p="crossword">✏️ Crossword</button>
      <button class="btn ghost" data-act="practice" data-p="word">🔤 Word</button>
      <button class="btn ghost" data-act="practice" data-p="groups">🧩 Groups</button>
    </div>
    <div class="small muted" style="margin-top:12px">Hard mode</div>
    <div class="chips" style="margin-top:6px">${[["sudoku", "Sudoku: no red errors"], ["crossword", "Crossword: no check or hints"], ["word", "Word: must use hints"], ["groups", "Groups: 2 lives, no \"one away\""]].map(([k, l]) => `<button class="chip ${k === "word" ? (S.settings.hardWord ? "on" : "") : (S.settings.hard || {})[k] ? "on" : ""}" data-act="hardp" data-p="${k}">${l}</button>`).join("")}</div>
  </div>
  ${puzzleStats()}
  <p class="muted small" style="text-align:center;margin-top:16px">Daily puzzles follow a shuffled order through the whole bank, so they don't repeat for a long time. Use ‹ › to play other days.</p>`;
}
function puzzleStats() {
  const P = S.puzzles, dates = Object.keys(P).sort();
  const row = (k, name) => {
    const ds = dates.filter(d => P[d][k] && P[d][k].started);
    const won = ds.filter(d => P[d][k].solved && !P[d][k].revealed);
    const times = won.map(d => P[d][k].time).filter(Boolean);
    const cur = streak(d => !!((P[d] || {})[k] || {}).solved);
    let best = 0, run = 0; if (won.length) { let prev = null; for (const d of won) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; } }
    const extra = k === "word" && won.length ? ` · avg ${Math.round(won.reduce((a, d) => a + P[d][k].guesses.length, 0) / won.length * 10) / 10} guesses` : "";
    return `<tr><td>${name}</td><td>${won.length}/${ds.length}</td><td>${cur}🔥 <span class="muted">best ${best}</span></td><td>${times.length ? fmtT(Math.min(...times)) : "–"}${extra ? `<div class="muted small">${extra.slice(3)}</div>` : ""}</td></tr>`;
  };
  const prac = S.practiceDone || {};
  return `<div class="card"><h2>📈 Puzzle stats</h2><table class="pstats"><tr><th></th><th>Solved</th><th>Streak</th><th>Best time</th></tr>
    ${row("sudoku", "Sudoku")}${row("crossword", "Crossword")}${row("word", "Word")}${row("groups", "Groups")}</table>
    <div class="muted small" style="margin-top:6px">Practice solved: ${prac.sudoku || 0} sudoku · ${prac.word || 0} word · ${prac.groups || 0} groups</div></div>`;
}
const fmtT = ms => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
function mountPuzzle() {
  const host = $("#puzzle-host"); if (!host || !puzzleView) return;
  if (puzzleView.startsWith("practice:")) {
    const k = puzzleView.slice(9);
    S.practice = S.practice || {};
    let pr = S.practice[k];
    if (!pr || (k === "sudoku" && pr.level !== (S.practiceLevel || "medium") && !pr.st.started)) pr = S.practice[k] = { seed: "practice-" + Math.random().toString(36).slice(2), st: {}, level: S.practiceLevel || "medium" };
    window.Puzzles[k](host, pr.seed, pr.st, {
      save, toast, level: k === "sudoku" ? pr.level : null,
      solved: () => { pr.st.solved = true; S.practiceDone = S.practiceDone || {}; S.practiceDone[k] = (S.practiceDone[k] || 0) + 1; save(); },
      back: () => { puzzleView = null; render(); },
      next: () => { S.practice[k] = null; save(); render(); }
    });
    return;
  }
  const st = puzzleState();
  st[puzzleView] = st[puzzleView] || {};
  window.Puzzles[puzzleView](host, cur, st[puzzleView], {
    save, toast,
    solved: () => { st[puzzleView].solved = true; save(); },
    back: () => { puzzleView = null; render(); }
  });
}

// ---------- sheets ----------
function sheet(html, onMount) {
  const bg = document.createElement("div"); bg.className = "sheet-bg";
  bg.innerHTML = `<div class="sheet">${html}</div>`;
  bg.addEventListener("click", e => { if (e.target === bg || e.target.closest("[data-close]")) { bg.remove(); render(); } });
  document.body.appendChild(bg); onMount && onMount(bg.firstChild, () => { bg.remove(); render(); });
}
function openPlan() {
  let sel = parse(cur).getDay();
  const draw = (el) => {
    const p = S.plan[sel];
    el.innerHTML = `<h2>Weekly workout plan</h2>
    <div class="wk-days">${DOW.map((d, i) => `<button class="${i === sel ? "on" : ""}" data-d="${i}">${d}<small>${esc(S.plan[i].name)}</small></button>`).join("")}</div>
    <label class="field">Apply a split to the whole week
      <select id="wksplit"><option value="">Choose a split…</option>${Object.keys(D.splits).map(k => `<option>${esc(k)}</option>`).join("")}</select></label>
    <label class="field">Workout name<input type="text" id="wkname" value="${esc(p.name)}"></label>
    <label class="field">Start from a template
      <select id="wktpl"><option value="">Choose…</option>${Object.keys(D.workoutTemplates).map(k => `<option>${esc(k)}</option>`).join("")}<option value="__clear">Empty (clear)</option></select></label>
    <div class="muted small" style="margin:10px 0 4px">Exercises (sets × reps, time, distance… anything)</div>
    <div id="exlist">${p.exercises.map((x, i) => `<div class="ex"><input class="grow" type="text" data-ex="${i}" value="${esc(x)}"><button class="x" data-delex="${i}">✕</button></div>`).join("")}</div>
    <div class="row" style="margin-top:8px"><input class="grow" type="text" id="newex" placeholder="Add exercise, e.g. Squats 4x8"><button class="btn" id="addex">Add</button></div>
    <button class="btn ghost block" style="margin-top:16px" data-close>Done</button>
    <p class="muted small">Each day of the week shows its workout on the Today page. Changes apply to every week.</p>`;
  };
  sheet("", (el) => {
    draw(el);
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-d]"); if (b) { sel = +b.dataset.d; draw(el); return; }
      const dx = e.target.closest("[data-delex]"); if (dx) { S.plan[sel].exercises.splice(+dx.dataset.delex, 1); save(); draw(el); return; }
      if (e.target.id === "addex") { const v = $("#newex", el).value.trim(); if (v) { S.plan[sel].exercises.push(v); save(); draw(el); $("#newex", el).focus(); } }
    });
    el.addEventListener("keydown", e => { if (e.target.id === "newex" && e.key === "Enter") { e.preventDefault(); $("#addex", el).click(); } });
    el.addEventListener("input", e => {
      if (e.target.id === "wkname") { S.plan[sel].name = e.target.value; save(); }
      if (e.target.dataset.ex != null) { S.plan[sel].exercises[+e.target.dataset.ex] = e.target.value; save(); }
    });
    el.addEventListener("change", e => {
      if (e.target.id === "wksplit" && e.target.value) {
        D.splits[e.target.value].forEach((t, i) => { S.plan[i] = { name: t, exercises: D.workoutTemplates[t].slice() }; });
        save(); draw(el); toast("Split applied to the week"); return;
      }
      if (e.target.id === "wktpl" && e.target.value) {
        const v = e.target.value;
        if (v === "__clear") S.plan[sel] = { name: "Rest", exercises: [] };
        else S.plan[sel] = { name: v, exercises: D.workoutTemplates[v].slice() };
        save(); draw(el);
      }
    });
  });
}
function openSettings() {
  const s = S.settings;
  sheet(`<h2>Settings</h2>
    <label class="field">Daily calorie goal<input type="number" inputmode="numeric" data-set="calGoal" value="${s.calGoal}"></label>
    <label class="field">Daily protein goal (g)<input type="number" inputmode="numeric" data-set="proteinGoal" value="${s.proteinGoal}"></label>
    <label class="field">Daily water goal (oz)<input type="number" inputmode="numeric" data-set="waterGoal" value="${s.waterGoal}"></label>
    <button class="btn ghost block" style="margin-top:8px" id="plan-btn">Edit weekly workout plan</button>
    <h2 style="margin-top:20px">Backup</h2>
    <p class="muted small">Everything is saved on this phone only. Export a backup now and then so you never lose your history.</p>
    <div class="row"><button class="btn grow" id="export">Export backup</button><label class="btn ghost grow" style="text-align:center">Import<input type="file" id="import" accept=".json,application/json" hidden></label></div>
    <div id="settings-extra"></div>
    <button class="btn ghost block" style="margin-top:16px" data-close>Done</button>`,
  (el, close) => {
    if (window.Features2) window.Features2.mountSettings($("#settings-extra", el));
    el.addEventListener("input", e => { const k = e.target.dataset.set; if (k) { S.settings[k] = Math.max(1, +e.target.value || 1); save(); } });
    $("#plan-btn", el).onclick = () => { close(); openPlan(); };
    $("#export", el).onclick = exportData;
    $("#import", el).onchange = e => importData(e.target.files[0], close);
  });
}
async function exportData() {
  const json = JSON.stringify(S, null, 1);
  const name = `planner-backup-${todayISO()}.json`;
  const file = new File([json], name, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: "Planner backup" }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
function importData(file, close) {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      if (!data.days) throw new Error("bad");
      S = Object.assign(defaults(), data); save(); toast("Backup restored"); close(); if (window.Features2) window.Features2.applyTheme();
    } catch { toast("That file isn't a planner backup"); }
  };
  r.readAsText(file);
}

// ---------- SOBER COUNTER ----------
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
function soberList() {
  if (!S.sober) S.sober = [["drugs", "Weed / drugs", "🌿"], ["alcohol", "Alcohol", "🍺"], ["nicotine", "Nicotine", "🚭"]]
    .map(([id, name, icon]) => ({ id, name, icon, start: todayISO(), best: 0, banked: 0, slips: [] }));
  return S.sober;
}
function soberCard(full) {
  const cs = soberList();
  return `<div class="card"><h2>🌱 Sober days <span class="right">tap one to edit</span></h2><div class="streaks" style="grid-template-columns:repeat(${cs.length},1fr)">${cs.map(c => {
    const n = Math.max(0, daysBetween(c.start, todayISO()));
    const best = Math.max(c.best || 0, n);
    const next = [1, 3, 7, 14, 30, 60, 90, 180, 365, 730].find(m => m > n);
    return `<button class="streak" style="border:0" data-act="sober" data-id="${c.id}"><span>${c.icon || ""} ${esc(c.name)}</span><b>${n}</b><span>day${n === 1 ? "" : "s"}</span>
      ${full ? `<span style="display:block;margin-top:4px">Best ${best}<br>Total ${(c.banked || 0) + n}${next ? `<br>${next - n} to ${next}` : ""}</span>` : ""}</button>`;
  }).join("")}</div></div>`;
}
function openSober(id) {
  const c = soberList().find(x => x.id === id); if (!c) return;
  const n = Math.max(0, daysBetween(c.start, todayISO()));
  sheet(`<h2>${esc(c.name)}</h2>
    <label class="field">Counting since<input type="date" id="sstart" value="${c.start}" max="${todayISO()}"></label>
    <label class="field">Name<input type="text" id="sname" value="${esc(c.name)}"></label>
    <h2 style="margin-top:18px">Had a slip?</h2>
    <p class="small">It happens. A slip isn't the end of the story. Your best streak (${Math.max(c.best || 0, n)} days) and every clean day you've stacked still count. Reset the counter and start the next run today.</p>
    <button class="btn block" id="slip">Start a new run today</button>
    ${c.slips && c.slips.length ? `<p class="muted small">Restarts: ${c.slips.length}. Total clean days banked: ${(c.banked || 0) + n}.</p>` : ""}
    <button class="btn ghost block" style="margin-top:12px" data-close>Done</button>`,
  (el, close) => {
    $("#sstart", el).onchange = e => { if (e.target.value) { c.start = e.target.value; save(); } };
    $("#sname", el).oninput = e => { c.name = e.target.value; save(); };
    $("#slip", el).onclick = () => { c.best = Math.max(c.best || 0, n); c.banked = (c.banked || 0) + n; (c.slips = c.slips || []).push(todayISO()); c.start = todayISO(); save(); close(); toast("New run starts now. You've got this."); };
  });
}

// ---------- XP + FIGHTER ----------
const STATS = [["str", "Strength", "💪", "biceps-flexed", "workouts, runs, movement."], ["tech", "Striking", "🥊", "glove", "boxing rounds and MMA lessons."], ["mind", "Mind", "🧠", "brain", "Security+, lessons, puzzles."], ["discipline", "Discipline", "🛡️", "shield", "habits, sobriety, water, job apps."], ["spirit", "Spirit", "🌿", "leaf", "mood check-ins, journaling, breathwork, time outside."]];
const STAT_ALIAS = { cardio: "str", technique: "tech", striking: "tech" };
const XP_RULES = { // checklist item id -> [xp, stat]
  run: [15, "str"], boxing: [15, "tech"], gym: [5, "str"], secplus: [20, "mind"], sober: [10, "discipline"],
  wake6: [8, "discipline"], stretch: [8, "spirit"], outside: [5, "spirit"], convo: [5, "spirit"], present: [5, "spirit"], read: [5, "spirit"], jobs: [15, "discipline"]
};
function dayXP(d) {
  const x = { str: 0, tech: 0, mind: 0, discipline: 0, spirit: 0 };
  const dd = peek(d); if (!dd) return x;
  for (const [id, , kind = ""] of allItems) {
    if (!isChecked(id, d)) continue;
    if (kind.startsWith("puzzle:")) { x.mind += 15; continue; }
    const r = XP_RULES[id]; if (r) x[r[1]] += r[0]; else x.discipline += 5;
  }
  if (dd.worked === true) x.str += 30;
  x.discipline += Math.min(dd.jobs, 10) * 3;
  if (dd.water >= S.settings.waterGoal) x.discipline += 10;
  if ((dd.journal || "").trim().length > 20) x.spirit += 10;
  if ((dd.learned || "").trim()) x.mind += 10;
  if (dd.mood) x.spirit += 2;
  if (dd.food.length) x.discipline += 5;
  return x;
}
S.xp = S.xp || {};
const XP = {
  award(key, amount, stat = "mind") {
    if (S.xp[key]) return false;
    S.xp[key] = { amt: Math.round(amount), stat: STAT_ALIAS[stat] || stat, date: todayISO() }; save();
    toast(`+${Math.round(amount)} XP`); return true;
  },
  has: key => !!S.xp[key],
  stats() {
    const t = { str: 0, tech: 0, mind: 0, discipline: 0, spirit: 0 };
    for (const d in S.days) { const x = dayXP(d); for (const k in t) t[k] += x[k]; }
    for (const k in S.xp) { const e = S.xp[k]; const st = t[e.stat] != null ? e.stat : (STAT_ALIAS[e.stat] || "mind"); t[st] += e.amt; }
    return t;
  },
  total() { return Object.values(XP.stats()).reduce((a, b) => a + b, 0); },
  level(xp = XP.total()) { return Math.floor((1 + Math.sqrt(1 + 8 * xp / 100)) / 2); },
  levelStart: n => 100 * n * (n - 1) / 2
};
const BELTS = [[1, "White", "#f2f2f2"], [5, "Blue", "#2f6fd6"], [10, "Purple", "#7b3fb8"], [15, "Brown", "#7a4a26"], [20, "Black", "#111"]];
const TITLES = [[1, "Rookie"], [3, "Amateur"], [6, "Prospect"], [10, "Contender"], [15, "Veteran"], [20, "Champion"], [30, "Legend"]];
const pick = (arr, lv) => arr.filter(b => lv >= b[0]).pop();
function fighterSVG(lv) {
  const belt = pick(BELTS, lv);
  const k = Math.min(1, (lv - 1) / 24); // 0 rookie -> 1 legend: more muscle
  const sw = (n, m) => (n + k * m).toFixed(1);
  const SK = "#c68a5e", SD = "#9f6a42", HR = "#1c1512", SH = "#1f2a44";
  const tw = 30 + k * 7; // torso half-width at shoulders
  return `<svg viewBox="0 0 160 220" aria-label="Your fighter">
    <ellipse cx="80" cy="212" rx="54" ry="6" fill="var(--ink)" opacity=".12"/>
    <path d="M90 130 L106 168 L114 204" stroke="${SD}" stroke-width="${sw(17, 5)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M68 130 L56 168 L48 204" stroke="${SK}" stroke-width="${sw(19, 5)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 206 h18 a4 4 0 0 1 0 8 h-22z" fill="${SD}"/><path d="M108 206 h16 a4 4 0 0 1 0 8 h-18z" fill="${SD}"/>
    <path d="M${80 + tw} 64 L${80 + tw + 10} 94 L96 62" stroke="${SD}" stroke-width="${sw(13, 5)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="96" cy="58" r="${sw(12, 2)}" fill="var(--accent)"/><circle cx="96" cy="58" r="${sw(12, 2)}" fill="#000" opacity=".22"/>
    <path d="M${80 - tw} 62 Q80 ${52 - k * 4} ${80 + tw} 62 L${100 + k * 3} 114 L${60 - k * 3} 114 Z" fill="${SK}"/>
    <path d="M${80 - tw * .6} 76 Q${80 - tw * .3} 84 80 80 Q${80 + tw * .3} 84 ${80 + tw * .6} 76" stroke="${SD}" stroke-width="1.6" fill="none" opacity="${.35 + k * .5}"/>
    <path d="M80 86 V108 M72 92 h16 M73 100 h14" stroke="${SD}" stroke-width="1.4" fill="none" opacity="${.15 + k * .5}" stroke-linecap="round"/>
    <rect x="72" y="42" width="16" height="16" rx="5" fill="${SD}"/>
    <path d="M${58 - k * 3} 112 H${102 + k * 3} L108 148 H86 L80 136 L74 148 H52 Z" fill="${SH}"/>
    <path d="M${58 - k * 3} 112 L52 148 H58 L${63 - k * 2} 114 Z" fill="var(--accent)"/>
    <rect x="${56 - k * 3}" y="108" width="${48 + k * 6}" height="8" rx="2" fill="${belt[2]}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>
    <path d="M77 115 l-7 20 h6 l4-14z M83 115 l5 21 h6 l-6-21z" fill="${belt[2]}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>
    <rect x="75" y="106" width="10" height="12" rx="2" fill="${belt[2]}" stroke="#000" stroke-opacity=".4" stroke-width="1"/>
    <path d="M${80 - tw} 64 L${80 - tw - 12} 92 L60 54" stroke="${SK}" stroke-width="${sw(14, 5)}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="80" cy="30" r="17" fill="${SK}"/>
    <path d="M63 28 Q64 11 81 11 Q97 11 97 26 Q90 19 80 20 Q70 20 63 28Z" fill="${HR}"/>
    <circle cx="96" cy="32" r="3.5" fill="${SD}"/>
    <path d="M71 31 h6 M84 31 h6" stroke="${HR}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M75 40 h10" stroke="${SD}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="60" cy="50" r="${sw(12.5, 2)}" fill="var(--accent)"/>
    <path d="M52 46 a9 9 0 0 1 10-6" stroke="#fff" stroke-opacity=".45" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}
function beltSVG(lv) {
  const belt = pick(BELTS, lv), next = BELTS.find(b => b[0] > lv);
  const stripes = next ? Math.min(4, Math.floor((lv - belt[0]) / Math.max(1, (next[0] - belt[0]) / 4))) : 4;
  const bar = belt[0] === 20 ? "#b3261e" : "#111";
  return `<svg viewBox="0 0 300 26" preserveAspectRatio="none" style="width:100%;height:22px;display:block" aria-label="${belt[1]} belt, ${stripes} stripes">
    <rect x="0" y="3" width="300" height="20" rx="3" fill="${belt[2]}" stroke="#000" stroke-opacity=".25"/>
    <rect x="0" y="12" width="300" height="1.5" fill="#000" opacity=".08"/>
    <rect x="220" y="3" width="60" height="20" fill="${bar}"/>
    ${Array.from({ length: 4 }, (_, i) => `<rect x="${230 + i * 12}" y="3" width="6" height="20" fill="#fff" opacity="${i < stripes ? 1 : .12}"/>`).join("")}
  </svg>`;
}
function renderFighter() {
  const st = XP.stats(), total = Object.values(st).reduce((a, b) => a + b, 0), lv = XP.level(total);
  const a = XP.levelStart(lv), b = XP.levelStart(lv + 1);
  const belt = pick(BELTS, lv), title = pick(TITLES, lv)[1];
  const maxStat = Math.max(50, ...Object.values(st));
  const tx = dayXP(todayISO()); const todayTotal = Object.values(tx).reduce((p, q) => p + q, 0) + Object.values(S.xp).filter(e => e.date === todayISO()).reduce((p, e) => p + e.amt, 0);
  const wk = weekStats(todayISO());
  const f1 = v => v == null ? "–" : (Math.round(v * 10) / 10);
  const f0 = v => v == null ? "–" : Math.round(v);
  return `
  <div class="card fhero">
    <div class="stage">
      <div>
        <div class="lvl"><small>Level</small>${lv}</div>
        <div class="ttl">${title}</div>
        <div class="sub">${belt[1]} belt · ${total.toLocaleString()} XP · +${todayTotal} today</div>
      </div>
      <div class="fig">${fighterSVG(lv)}</div>
    </div>
    <div class="belt-bar">${beltSVG(lv)}</div>
    <div class="xpbar"><div class="track"><div style="width:${(total - a) / (b - a) * 100}%"></div></div>
      <div class="row"><span>${total - a} / ${b - a} XP</span><span>${b - total} to level ${lv + 1}</span></div></div>
  </div>
  ${Object.keys(S.prs || {}).length ? `<div class="card"><h2>🏆 Lifting PRs</h2>${Object.entries(S.prs).sort((a, b) => b[1].e1rm - a[1].e1rm).map(([n, p]) => `<div class="row" style="padding:5px 0;border-top:1px solid var(--line)"><span class="grow" style="text-transform:capitalize">${esc(n)}</span><b>${p.w} × ${p.r}</b><span class="muted small">${esc(p.date.slice(5))}</span></div>`).join("")}<div class="muted small" style="margin-top:6px">Ranked by estimated one-rep max.</div></div>` : ""}
  <div class="card"><h2>Stats</h2>
    ${STATS.map(([k, name, em, ic, why]) => `<div class="stat-row"><span class="si" data-noicon style="background:color-mix(in srgb, var(--st-${k}) 16%, transparent);color:var(--st-${k})">${window.Icons ? Icons.icon(ic) : em}</span><span class="sn">${name}</span><span class="sv">${st[k]}</span><div class="sb"><div style="width:${st[k] / maxStat * 100}%;background:var(--st-${k})"></div></div></div>`).join("")}
    <div class="legend-note">${STATS.map(s => `<b>${s[1]}:</b> ${s[4]}`).join(" ")}</div>
  </div>
  ${window.Features ? window.Features.fighterCamp() : ""}
  ${window.Features3 ? window.Features3.fighterExtras() : ""}
  ${soberCard(true)}
  <div class="card"><h2>🔥 Streaks</h2>
    <div class="streaks">
      <div class="streak"><b>${streak(d => progress(d) >= .7)}</b><span>days 70%+ done</span></div>
      <div class="streak"><b>${streak(d => { const x = peek(d); return x && x.water >= S.settings.waterGoal; })}</b><span>days water goal</span></div>
      <div class="streak"><b>${streak(d => { const x = peek(d); return x && x.worked === true; })}</b><span>workout days in a row</span></div>
      <div class="streak"><b>${streak(d => isChecked("secplus", d))}</b><span>days of Security+</span></div>
      <div class="streak"><b>${streak(d => ["sudoku", "crossword", "word", "groups"].some(p => ((S.puzzles[d] || {})[p] || {}).solved))}</b><span>puzzle days</span></div>
    </div>
  </div>
  <div class="card"><h2>📊 Last 7 days</h2>
    <div class="stat-grid">
      <div>Avg mood<b>${f1(wk.mood)}</b></div>
      <div>Ideal day avg<b>${Math.round(wk.done * 100)}%</b></div>
      <div>Avg protein<b>${f0(wk.protein)} g</b></div>
      <div>Avg calories<b>${f0(wk.cal)}</b></div>
      <div>Avg water<b>${f0(wk.water)} oz</b></div>
      <div>Workouts<b>${wk.workouts} / 7</b></div>
    </div>
    <div class="row" style="align-items:flex-end;height:70px;gap:6px;margin-top:10px">
      ${wk.ds.map(d => { const x = peek(d); const mv = x && x.mood; return `<div class="grow" style="text-align:center"><div style="height:${mv ? mv * 5 : 2}px;background:${mv ? moodColor(mv) : "var(--line)"};border-radius:6px 6px 2px 2px"></div><div class="muted" style="font-size:10px">${DOW[parse(d).getDay()][0]}</div></div>`; }).join("")}
    </div>
    <div class="muted small" style="text-align:center">Mood by day</div>
  </div>`;
}

// ---------- tabs + module API ----------
const moduleTabs = [];
function tabs() {
  const learn = moduleTabs.find(t => t.id === "learn") || { id: "learn", label: "Learn", icon: "🧠", render: () => `<div class="card"><h2>🧠 Learn</h2><p class="muted">Lessons are on the way: Security+, computer science, cybersecurity, Spanish, history, geography, MMA and more.</p></div>` };
  const base = [
    { id: "today", label: "Today", icon: "☀️", render: renderTodayTab },
    learn,
    { id: "play", label: "Play", icon: "🧩", render: renderPuzzles },
    { id: "fighter", label: "Fighter", icon: "🥋", render: renderFighter }
  ];
  return base.concat(moduleTabs.filter(t => !base.includes(t)));
}
const ctx = () => ({ date: cur, store: window.App.store, xp: XP, toast, save, rerender: render });
window.App = {
  registerTab(t) { const i = moduleTabs.findIndex(x => x.id === t.id); const tt = Object.assign({ module: true, icon: "•" }, t); i >= 0 ? moduleTabs[i] = tt : moduleTabs.push(tt); if (document.readyState !== "loading") render(); },
  store(ns) { S.modules = S.modules || {}; return (S.modules[ns] = S.modules[ns] || {}); },
  save, toast, xp: XP, render,
  get date() { return cur; },
  internal: { day, peek, get S() { return S; }, get cur() { return cur; }, sheet, toast, save, render, addDays, todayISO, iso, parse, isChecked, progress, weekStats, foodTotals, XP, esc, soberList, daysBetween, workoutFor, dayXP, streak, DOW, prettyDate, hash },
  go(t, s) { tab = t; if (s) sub = s; render(); window.scrollTo(0, 0); }
};

// ---------- render ----------
function render() {
  renderHeader();
  $("#nav").innerHTML = tabs().map(t => `<button data-tab="${t.id}" class="${t.id === tab ? "on" : ""}"><span>${t.icon}</span>${esc(t.label)}</button>`).join("");
  const t = tabs().find(x => x.id === tab) || tabs()[0];
  if (t.module) {
    $("#view").innerHTML = `<div id="module-host"></div>`;
    try { t.render($("#module-host"), ctx()); } catch (e) { console.error(e); $("#module-host").innerHTML = `<div class="card">This tab hit an error: ${esc(e.message)}</div>`; }
  } else $("#view").innerHTML = t.render();
  if (tab === "play") mountPuzzle();
}

// ---------- events ----------
document.addEventListener("click", e => {
  const nb = e.target.closest("nav.tabs button");
  if (nb) { tab = nb.dataset.tab; puzzleView = null; if (tab === "today" && sub === "calendar") calMonth = cur.slice(0, 7); render(); window.scrollTo(0, 0); return; }
  const el = e.target.closest("[data-act]"); if (!el || !$("#view").contains(el) || el.closest("#module-host")) return;
  const act = el.dataset.act, v = el.dataset.v;
  const dd = () => day();
  switch (act) {
    case "learnsubj": { window.App.go("learn"); setTimeout(() => window.App.learn.openSubject(el.dataset.v), 60); return; }
    case "aff": { const x = dd(); x.affIdx = ((x.affIdx ?? dayIndex(cur, D.affirmations.length)) + 1) % D.affirmations.length; break; }
    case "mood": dd().mood = dd().mood === +v ? null : +v; break;
    case "water": dd().water = Math.max(0, dd().water + +v); if (dd().water >= S.settings.waterGoal && dd().water - +v < S.settings.waterGoal) toast("💧 80 oz! Water goal done"); break;
    case "worked": dd().worked = (v === "yes") ? (dd().worked === true ? null : true) : (dd().worked === false ? null : false); break;
    case "wkex": { const x = dd(); x.wkDone[el.dataset.i] = !x.wkDone[el.dataset.i]; const w = workoutFor(cur); if (w.exercises.length && w.exercises.every((_, i) => x.wkDone[i]) && x.worked !== true) { x.worked = true; toast("Workout complete 💪"); } break; }
    case "plan": openPlan(); return;
    case "exopen": openEx = openEx === +v ? null : +v; render(); return;
    case "felt": { const x = dd(); x.felt = x.felt || []; const k = x.felt.indexOf(v); k >= 0 ? x.felt.splice(k, 1) : (x.felt.push(v), toast("❤️ Noted")); break; }
    case "sober": openSober(el.dataset.id); return;
    case "check": {
      if (e.target.closest("button, .chips, .counter")) return;
      const id = el.dataset.id; const x = dd();
      const it = allItems.find(i => i[0] === id); const kind = it[2] || "";
      if (kind === "workout") { x.worked = x.worked === true ? null : true; break; }
      if (kind === "learning" && x.topic) { x.topic = null; break; }
      if (isChecked(id) && !x.checks[id] && kind) { toast("This one checks itself off automatically"); return; }
      x.checks[id] = !x.checks[id];
      break;
    }
    case "recipe": S.showRecipe = !S.showRecipe; break;
    case "jobs": dd().jobs = Math.max(0, dd().jobs + +v); if (dd().jobs === 5 && +v > 0) toast("5 applications sent. Huge."); break;
    case "topic": dd().topic = dd().topic === v ? null : v; break;
    case "tab": tab = v; break;
    case "sub": sub = v; if (v === "calendar") calMonth = cur.slice(0, 7); window.scrollTo(0, 0); break;
    case "practice": S.practiceLevel = ($("#sdk-level") || {}).value || S.practiceLevel; tab = "play"; puzzleView = "practice:" + el.dataset.p; window.scrollTo(0, 0); break;
    case "hardword": S.settings.hardWord = !S.settings.hardWord; break;
    case "hardp": { const k = el.dataset.p; if (k === "word") S.settings.hardWord = !S.settings.hardWord; else { S.settings.hard = S.settings.hard || {}; S.settings.hard[k] = !S.settings.hard[k]; } break; }
    case "openpuzzle": tab = "play"; puzzleView = el.dataset.p; window.scrollTo(0, 0); break;
    case "addpreset": { const p = S.presets[+el.dataset.i]; dd().food.push({ name: p[0], cal: p[1], pro: p[2], time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }); toast(`Added ${p[0]}`); break; }
    case "delpreset": S.presets.splice(+el.dataset.i, 1); break;
    case "editpresets": S.editPresets = !S.editPresets; break;
    case "delfood": dd().food.splice(+el.dataset.i, 1); break;
    case "readpassage": dd().passageRead = !dd().passageRead; break;
    case "calpick": cur = v; break;
    case "calmonth": { const [y, m] = calMonth.split("-").map(Number); const d = new Date(y, m - 1 + +v, 1); calMonth = iso(d).slice(0, 7); break; }
    case "openday": tab = "today"; sub = "plan"; window.scrollTo(0, 0); break;
    case "delevent": S.events[cur] = (S.events[cur] || []).filter(x => x.id !== el.dataset.id); break;
    default: return;
  }
  save(); render();
});
document.addEventListener("toggle", e => {
  const d = e.target; if (!d.matches || !d.matches("details[data-sec]")) return;
  S.openSecs = S.openSecs || {}; S.openSecs[d.dataset.sec] = d.open; save();
}, true);
document.addEventListener("input", e => {
  const b = e.target.dataset && e.target.dataset.bind; if (!b) return;
  const x = day(); const parts = b.split(".");
  if (parts.length === 2) x[parts[0]][parts[1]] = e.target.value; else x[b] = e.target.value;
  save();
});
document.addEventListener("change", e => {
  const t = e.target;
  if (t.dataset && t.dataset.set) {
    const x = day(); x.sets = x.sets || {}; const arr = x.sets[t.dataset.set] = x.sets[t.dataset.set] || [];
    const j = +t.dataset.j; arr[j] = arr[j] || {}; arr[j][t.dataset.k] = t.value === "" ? undefined : +t.value;
    // fill missing weight/reps from placeholder (last time) for convenience
    const row = t.closest(".setrow"); if (row) row.querySelectorAll("input").forEach(inp => { if (inp.value === "" && inp.placeholder && /^\d/.test(inp.placeholder) && t.value !== "") { arr[j][inp.dataset.k] = +inp.placeholder; inp.value = inp.placeholder; } });
    const s = arr[j];
    if (s.w && s.r) { const est = e1rm(s.w, s.r), cur0 = (S.prs = S.prs || {})[t.dataset.set]; if (!cur0 || est > cur0.e1rm + 0.01) { S.prs[t.dataset.set] = { w: s.w, r: s.r, e1rm: est, date: cur }; if (cur0) toast(`🏆 New PR: ${s.w} × ${s.r}`); } }
    save(); return;
  }
  if (t.dataset && t.dataset.run != null) {
    const m = t.value.trim().match(/^(\d{1,2})[:.](\d{1,2})$/) || t.value.trim().match(/^(\d{1,2})(\d{2})$/);
    const x = day();
    if (!t.value.trim()) { x.runSec = undefined; }
    else if (!m) { toast("Use minutes:seconds, like 4:05"); return; }
    else { x.runSec = +m[1] * 60 + +m[2]; x.checks.run = true; toast(`Run logged: ${Math.floor(x.runSec * 2 / 60)}:${String(x.runSec * 2 % 60).padStart(2, "0")} per mile`); }
    save(); render(); return;
  } if (e.target.dataset && e.target.dataset.bind === "song.title" || e.target.dataset.bind === "song.artist") render(); });
document.addEventListener("submit", e => {
  const f = e.target.dataset.form; if (!f) return; e.preventDefault();
  const fd = new FormData(e.target);
  if (f === "food") {
    const item = { name: fd.get("name").trim(), cal: Math.round(+fd.get("cal") || 0), pro: Math.round((+fd.get("pro") || 0) * 10) / 10, time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
    if (!item.name) return;
    day().food.push(item);
    if (fd.get("fav")) S.presets.push([item.name, item.cal, item.pro]);
    toast(`Added ${item.name}`);
  }
  if (f === "event") {
    (S.events[cur] = S.events[cur] || []).push({ id: Math.random().toString(36).slice(2), title: fd.get("title").trim(), time: fd.get("time") });
  }
  save(); render();
});
$("#prev").onclick = () => { cur = addDays(cur, -1); puzzleView = null; render(); };
$("#next").onclick = () => { cur = addDays(cur, 1); puzzleView = null; render(); };
$("#title").onclick = () => { cur = todayISO(); puzzleView = null; render(); };
$("#settings").onclick = openSettings;

// jump to the real today when the app comes back after midnight
let lastToday = todayISO();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && todayISO() !== lastToday) { if (cur === lastToday) cur = todayISO(); lastToday = todayISO(); render(); }
});

window.Planner = { get state() { return S; }, render };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render); else setTimeout(render);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  // Apply updates on the next open instead of the one after: when a new version takes over, reload once and say so.
  const hadSW = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js").then(reg => {
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    try { if (!hadSW || sessionStorage.getItem("luReloaded")) return; sessionStorage.setItem("luReloaded", "1"); localStorage.setItem("luUpdated", "1"); } catch (e) { return; }
    location.reload();
  });
  try { if (localStorage.getItem("luUpdated")) { localStorage.removeItem("luUpdated"); setTimeout(() => toast("Updated to the latest version ✓"), 800); } } catch (e) {}
}
})();
