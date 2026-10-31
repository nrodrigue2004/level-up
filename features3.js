// Training extras: recovery check, skipped-workout swap, warm-ups, finishers,
// movement snacks, body stats + private photo vault, technique of the week.
(() => {
"use strict";
const A = window.App, I = A.internal, K = window.Features._kit;
const $ = (s, el = document) => el.querySelector(s);
const esc = I.esc;
const today = () => I.todayISO();

// ================= interval runner (warm-ups, finishers, movement snacks) =================
function runIntervals(title, moves, onDone) {
  const { el, close } = K.overlay();
  let i = -1, timer = null;
  K.wake(true); K.audio();
  const total = moves.reduce((a, m) => a + m.secs, 0);
  const next = () => {
    timer && timer.stop(); i++;
    if (i >= moves.length) {
      K.chime(); K.speak("Done. Nice work.");
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button></div><div class="fs-body center"><div class="huge">✅</div><h1>${esc(title)} done</h1><p class="muted">${Math.round(total / 60)} minutes in the bank.</p><button class="btn block" data-x>Back</button></div>`;
      onDone && onDone(); return;
    }
    const m = moves[i]; K.tone(880, 0, .15, .3); K.speak(m.say || m.name);
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><div class="dots">${moves.map((_, k) => `<i class="${k < i ? "on" : k === i ? "cur" : ""}"></i>`).join("")}</div><span class="muted small">${i + 1}/${moves.length}</span></div>
      <div class="fs-body center"><div class="muted small">${esc(title)}</div><h1>${esc(m.name)}</h1>${m.cue ? `<p class="muted">${esc(m.cue)}</p>` : ""}<div class="live"></div>
      ${moves[i + 1] ? `<p class="muted small">Next: ${esc(moves[i + 1].name)}</p>` : ""}</div>
      <div class="fs-actions"><button class="btn ghost block" data-p>Pause</button><button class="link" data-skip>Skip</button></div>`;
    timer = K.Timer(m.secs, l => { K.live(el, K.ringSVG(l / m.secs, K.fmt(l), "", "var(--good)")); if (Math.ceil(l) === 3 && !m._beeped) { m._beeped = true; K.clack(1); } }, next);
  };
  el.onclick = e => {
    if (e.target.closest("[data-x]")) { timer && timer.stop(); return close(); }
    if (e.target.closest("[data-skip]")) return next();
    const p = e.target.closest("[data-p]"); if (p && timer) { timer.paused ? timer.resume() : timer.pause(); p.textContent = timer.paused ? "Resume" : "Pause"; }
  };
  next();
}
const WARMUP = [
  { name: "Jumping jacks", secs: 45, cue: "Easy pace, get the blood moving." },
  { name: "Arm circles", secs: 30, cue: "Forward 15, backward 15." },
  { name: "Hip openers", secs: 45, cue: "Big circles with each knee, both directions." },
  { name: "Bodyweight squats", secs: 45, cue: "Slow and deep, chest up." },
  { name: "Leg swings", secs: 40, cue: "Front to back, then side to side. Hold a wall." },
  { name: "Shadowbox, light", secs: 60, cue: "Loose shoulders, move your feet, easy jabs." },
  { name: "Neck and shoulder rolls", secs: 30, cue: "Slow. Fighters need a mobile neck." },
  { name: "High knees", secs: 30, cue: "Quick feet. Last one." }
];
const FINISHERS = [
  { name: "Fighter's 5", moves: [["Burpees", 40], ["Rest", 20], ["Mountain climbers", 40], ["Rest", 20], ["Squat jumps", 40], ["Rest", 20], ["Push-ups", 40], ["Rest", 20], ["Plank", 60]] },
  { name: "Sprawl ladder", moves: [["Sprawls", 45], ["Rest", 15], ["Shadowbox all-out", 45], ["Rest", 15], ["Sprawls", 45], ["Rest", 15], ["Shadowbox all-out", 45], ["Rest", 15], ["Hollow hold", 60]] },
  { name: "Core crusher", moves: [["Bicycle crunches", 45], ["Rest", 15], ["Russian twists", 45], ["Rest", 15], ["Leg raises", 45], ["Rest", 15], ["Plank shoulder taps", 45], ["Rest", 15], ["Side plank, each side", 60]] },
  { name: "Bag blitz", moves: [["Straight punches nonstop", 30], ["Rest", 30], ["Hooks nonstop", 30], ["Rest", 30], ["Uppercuts nonstop", 30], ["Rest", 30], ["Everything nonstop", 60], ["Rest", 30], ["Jump rope or skips", 30]] }
];
const finisherFor = d => FINISHERS[I.hash(d + ":fin") % FINISHERS.length];

// ================= movement snacks =================
const SNACKS = [
  { name: "Shadowbox snack", moves: [["Jab-cross, light", 30, "1-2, stay loose"], ["Slip and roll", 30, "Bob under imaginary hooks"], ["Hooks", 30, "Turn the hips"], ["Free flow", 30, "Mix everything"]] },
  { name: "Desk reset", moves: [["Stand and reach up", 30, "Big stretch to the ceiling"], ["Hip flexor stretch, left", 30, "Lunge, squeeze your glute"], ["Hip flexor stretch, right", 30, ""], ["Chest opener", 30, "Hands behind back, squeeze shoulder blades"]] },
  { name: "Dance groove", moves: [["Two-step", 30, "Step side, together, other side, together. Bend the knees."], ["Body roll", 30, "Chest, belly, hips. Slow is fine."], ["Cupid Shuffle steps", 30, "To the right, to the right, to the left, to the left"], ["Freestyle", 30, "Just move. Nobody's watching."]] },
  { name: "Leg burner", moves: [["Wall sit", 45, "Thighs parallel, back flat"], ["Calf raises", 30, "Slow up, slow down"], ["Squats", 45, "Sit back like a chair"]] },
  { name: "Mobility minute x2", moves: [["Cat-cow", 30, "On hands and knees, or standing"], ["Hip circles", 30, ""], ["Thoracic twists", 30, "Rotate the upper back"], ["Ankle circles", 30, ""]] },
  { name: "Get your heart up", moves: [["Jumping jacks", 30, ""], ["High knees", 30, ""], ["Squat to reach", 30, ""], ["Fast feet", 30, "Stay on the balls of your feet"]] }
];
// Extra move bank: each snack is 4 moves drawn fresh from its theme, so the same snack rarely repeats.
const MOVE_BANK = {
  "Shadowbox snack": [["Jab-cross, light", 30, "1-2, stay loose"], ["Slip and roll", 30, "Bob under imaginary hooks"], ["Hooks", 30, "Turn the hips"], ["Free flow", 30, "Mix everything"], ["Double jab, cross", 30, "Step in on the second jab"], ["Body shots", 30, "Bend the knees, don't lean"], ["Pivot out", 30, "Jab, then pivot off your lead foot"], ["Uppercuts", 30, "Short, from the legs"], ["Counter drill", 30, "Slip right, throw a 2"], ["Speed round", 30, "Fast straight punches, snap back"], ["Teeps", 30, "Push kick, return to stance"], ["Knees", 30, "Grab the imaginary head, drive the hips"]],
  "Desk reset": [["Stand and reach up", 30, "Big stretch to the ceiling"], ["Hip flexor stretch, left", 30, "Lunge, squeeze your glute"], ["Hip flexor stretch, right", 30, ""], ["Chest opener", 30, "Hands behind you, open the chest"], ["Neck rolls", 30, "Slow, both ways"], ["Wrist stretch", 30, "Palms up, then down"], ["Shoulder blade squeezes", 30, "Pinch and release"], ["Forward fold", 30, "Let the head hang"], ["Doorway pec stretch", 30, "Lean through the door frame"], ["Calf stretch", 30, "Heel down, wall push"], ["Side bends", 30, "Reach over, both sides"], ["Spinal twist", 30, "Seated or standing"]],
  "Dance groove": [["Two-step", 30, "Step side, together, other side, together. Bend the knees."], ["Body roll", 30, "Chest, belly, hips. Slow is fine."], ["Cupid Shuffle steps", 30, "To the right, to the left, kick, walk it by yourself"], ["Bounce", 30, "Knees soft, bounce on the beat"], ["Shoulder isolation", 30, "Only the shoulders move"], ["Electric Slide grapevine", 30, "Step, behind, step, touch"], ["Rock step", 30, "Back, forward, both feet planted"], ["Heel-toe", 30, "Tap heel, tap toe, switch"], ["Hip sway", 30, "Weight side to side"], ["Freestyle", 30, "Anything, just keep the beat"]],
  "Leg burner": [["Wall sit", 45, "Thighs parallel, back flat"], ["Calf raises", 30, "Slow up, slow down"], ["Squats", 45, "Sit back like a chair"], ["Reverse lunges", 40, "Alternate legs"], ["Glute bridges", 40, "Squeeze at the top"], ["Squat pulses", 30, "Stay low"], ["Lateral lunges", 40, "Push the hips back"], ["Single-leg balance", 30, "15 seconds each leg"], ["Sumo squats", 40, "Wide stance, toes out"]],
  "Mobility minute x2": [["Cat-cow", 30, "On hands and knees, or standing"], ["Hip circles", 30, ""], ["Thoracic twists", 30, "Rotate the upper back"], ["Ankle circles", 30, ""], ["World's greatest stretch", 40, "Lunge, elbow down, rotate up"], ["Deep squat hold", 30, "Heels down if you can"], ["90/90 hip switch", 40, "Sit, rotate knees side to side"], ["Arm circles", 30, "Small to big"], ["Leg swings", 30, "Front-back, then side-side"], ["Thread the needle", 30, "On all fours, reach under"]],
  "Get your heart up": [["Jumping jacks", 30, ""], ["High knees", 30, ""], ["Squat to reach", 30, ""], ["Fast feet", 30, "Stay on the balls of your feet"], ["Mountain climbers", 30, "Hips low"], ["Skaters", 30, "Side to side"], ["Butt kicks", 30, ""], ["Shadowbox sprint", 30, "Nonstop punches"], ["Burpees", 30, "Go at your own pace"], ["Jump rope (real or fake)", 30, "Light on the feet"]]
};
const MOVE_GOAL = 20;
function startSnack() {
  const base = SNACKS[Math.floor(Math.random() * SNACKS.length)], bank = (MOVE_BANK[base.name] || base.moves).slice();
  for (let i = bank.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bank[i], bank[j]] = [bank[j], bank[i]]; }
  const s = { name: base.name, moves: bank.slice(0, 4) };
  runIntervals(s.name, s.moves.map(([name, secs, cue]) => ({ name, secs, cue })), () => {
    const dd = I.day(today()); dd.moveMin = (dd.moveMin || 0) + Math.round(s.moves.reduce((a, m) => a + m[1], 0) / 60);
    A.xp.award(`move:${today()}:${dd.moveMin}`, 5, "str"); I.save();
  });
}

// ================= recovery check =================
function recoveryAdvice(dd) {
  if (dd.sleep == null || dd.sore == null) return null;
  let sc = 0;
  sc += dd.sleep >= 8 ? 2 : dd.sleep >= 7 ? 1 : dd.sleep >= 6 ? 0 : -2;
  sc += dd.sore <= 2 ? 1 : dd.sore === 3 ? 0 : dd.sore === 4 ? -2 : -3;
  if (sc >= 2) return ["💥 Go hard", "You're recovered. Push the weights, chase a PR.", "var(--good)"];
  if (sc >= 0) return ["👍 Normal day", "Do the plan as written. Leave one rep in the tank.", "var(--water)"];
  if (sc >= -2) return ["🌿 Go light", "Same workout at about 70% weight, or swap for mobility and a light run.", "var(--warn)"];
  return ["😴 Rest day", "Your body needs recovery more than training today. Walk, stretch, sleep early.", "var(--accent)"];
}
function recoveryCard(dd) {
  const adv = recoveryAdvice(dd);
  return `<div class="card"><h2>🛌 Recovery check</h2>
    <div class="small muted">Hours slept</div>
    <div class="chips" style="margin:6px 0 10px">${[4, 5, 6, 7, 8, 9].map(h => `<button class="chip ${dd.sleep === h ? "on" : ""}" data-f3="sleep" data-v="${h}">${h === 9 ? "9+" : h}</button>`).join("")}</div>
    <div class="small muted">How sore are you?</div>
    <div class="chips" style="margin-top:6px">${["Fresh", "A little", "Some", "Very", "Wrecked"].map((l, k) => `<button class="chip ${dd.sore === k + 1 ? "on" : ""}" data-f3="sore" data-v="${k + 1}">${l}</button>`).join("")}</div>
    ${adv ? `<div class="advice" style="border-color:${adv[2]}"><b>${adv[0]}</b><div class="small">${adv[1]}</div></div>` : ""}</div>`;
}

// ================= skipped workout swap =================
function swapBanner(dd) {
  if (I.cur !== today() || dd.wkOverride || dd.worked === true || dd.swapNo) return "";
  const y = I.addDays(today(), -1), wy = I.S.plan[I.parse(y).getDay()], py = I.peek(y);
  if (!wy.exercises.length || /rest/i.test(wy.name) || (py && py.worked === true)) return "";
  const wt = I.workoutFor(today());
  if (wt.name === wy.name) return "";
  return `<div class="card swap"><b>You missed ${esc(wy.name)} yesterday.</b> No stress. Want to do it today instead of ${esc(wt.name)}?
    <div class="row" style="margin-top:8px"><button class="btn small" data-f3="swap" data-v="${esc(y)}">Swap to ${esc(wy.name)}</button><button class="btn ghost small" data-f3="noswap">Keep ${esc(wt.name)}</button></div></div>`;
}

// ================= body stats + photo vault =================
const body = () => (I.S.body = I.S.body || []);
let db = null;
function idb() {
  if (db) return Promise.resolve(db);
  return new Promise((res, rej) => { const r = indexedDB.open("levelup-photos", 1); r.onupgradeneeded = () => r.result.createObjectStore("photos", { keyPath: "id" }); r.onsuccess = () => { db = r.result; res(db); }; r.onerror = () => rej(r.error); });
}
const photoOp = (mode, fn) => idb().then(d => new Promise((res, rej) => { const tx = d.transaction("photos", mode); const st = tx.objectStore("photos"); const out = fn(st); tx.oncomplete = () => res(out && out.result !== undefined ? out.result : out); tx.onerror = () => rej(tx.error); }));
const listPhotos = () => photoOp("readonly", st => st.getAll());
async function shrink(file) {
  try {
    const bmp = await createImageBitmap(file); const sc = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = bmp.width * sc; c.height = bmp.height * sc; c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(r, "image/jpeg", .82)) || file;
  } catch { return file; }
}
function spark(vals) {
  if (vals.length < 2) return "";
  const max = Math.max(...vals), min = Math.min(...vals), span = Math.max(.1, max - min);
  return `<svg viewBox="0 0 200 50" class="spark"><polyline points="${vals.map((v, k) => `${k / (vals.length - 1) * 200},${6 + (1 - (v - min) / span) * 38}`).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
function bodyCard() {
  const b = body(), w = b.filter(x => x.weight).slice(-20);
  const last = b[b.length - 1];
  const change = w.length >= 2 ? Math.round((w[w.length - 1].weight - w[0].weight) * 10) / 10 : null;
  return `<div class="card"><h2>📏 Body stats <span class="right"><button class="btn ghost small" data-f3="body">Log / photos</button></span></h2>
    ${last ? `<div class="stat-grid">${[["weight", "Weight", "lbs"], ["waist", "Waist", "in"], ["chest", "Chest", "in"], ["arm", "Arm", "in"]].map(([k, l, u]) => { const v = [...b].reverse().find(x => x[k]); return `<div>${l}<b>${v ? v[k] + " " + u : "–"}</b></div>`; }).join("")}</div>
      ${spark(w.map(x => x.weight))}${change != null ? `<div class="muted small">${change > 0 ? "+" : ""}${change} lbs since ${esc(w[0].date)}</div>` : ""}`
    : `<p class="muted small" style="margin:0">Log your weight and measurements to see trends. Progress photos stay private on this phone.</p>`}</div>`;
}
function openBody() {
  I.sheet("", async (el) => {
    const t = today(); let entry = body().find(x => x.date === t);
    const draw = async () => {
      let photos = []; try { photos = (await listPhotos()).sort((a, b) => a.date < b.date ? -1 : 1); } catch {}
      el.innerHTML = `<h2>📏 Body stats</h2>
        <div class="stat-grid">${[["weight", "Weight (lbs)"], ["waist", "Waist (in)"], ["chest", "Chest (in)"], ["arm", "Arm (in)"]].map(([k, l]) => `<label class="field" style="margin:0">${l}<input type="number" inputmode="decimal" data-b="${k}" value="${entry && entry[k] != null ? entry[k] : ""}"></label>`).join("")}</div>
        <p class="muted small">Saves for today. Weigh in the morning, same conditions, for honest trends.</p>
        <h2 style="margin-top:16px">🔒 Progress photos</h2>
        <p class="muted small">Stored only on this phone, not in backups or anywhere else.</p>
        <label class="btn block" style="text-align:center">📷 Add photo<input type="file" accept="image/*" data-photo hidden></label>
        ${photos.length >= 2 ? `<div class="compare"><figure><img src="${URL.createObjectURL(photos[0].blob)}"><figcaption>${esc(photos[0].date)}</figcaption></figure><figure><img src="${URL.createObjectURL(photos[photos.length - 1].blob)}"><figcaption>${esc(photos[photos.length - 1].date)}</figcaption></figure></div>` : ""}
        <div class="photos">${photos.slice().reverse().map(p => `<figure><img src="${URL.createObjectURL(p.blob)}"><figcaption>${esc(p.date)} <button class="x" data-delphoto="${p.id}">✕</button></figcaption></figure>`).join("")}</div>
        ${body().length ? `<h2 style="margin-top:16px">History</h2>${body().slice().reverse().slice(0, 30).map(x => `<div class="row small" style="padding:4px 0;border-top:1px solid var(--line)"><span class="grow">${esc(x.date)}</span>${x.weight ? `<b>${x.weight} lbs</b>` : ""}${x.waist ? `<span class="muted">waist ${x.waist}</span>` : ""}</div>`).join("")}` : ""}
        <button class="btn ghost block" style="margin-top:14px" data-close>Done</button>`;
    };
    el.addEventListener("change", async e => {
      const k = e.target.dataset.b;
      if (k) { if (!entry) { entry = { date: t }; body().push(entry); body().sort((a, b) => a.date < b.date ? -1 : 1); } entry[k] = e.target.value === "" ? undefined : +e.target.value; I.save(); return; }
      if (e.target.dataset.photo != null && e.target.files[0]) {
        const blob = await shrink(e.target.files[0]);
        try { await photoOp("readwrite", st => st.put({ id: Date.now().toString(36), date: t, blob })); I.toast("Photo saved privately"); } catch { I.toast("Couldn't save the photo"); }
        draw();
      }
    });
    el.addEventListener("click", async e => {
      const d = e.target.closest("[data-delphoto]"); if (d) { await photoOp("readwrite", st => st.delete(d.dataset.delphoto)); draw(); }
    });
    draw();
  });
}

// ================= cards =================
function movementCard(dd) {
  if (I.cur !== today()) return "";
  const m = dd.moveMin || 0;
  return `<div class="card"><h2>🕺 Movement minutes <span class="right">${m} / ${MOVE_GOAL}</span></h2>
    <div class="bar protein"><div style="width:${Math.min(100, m / MOVE_GOAL * 100)}%"></div></div>
    <div class="row" style="margin-top:10px"><div class="grow small muted">Sitting a lot? Every hour, stand up for a 2-minute drill.</div><button class="btn small" data-f3="snack">Start a snack</button></div></div>`;
}
function techCard() {
  const L = A.learn;
  if (!L || !L.techniqueOfWeek) return "";
  try { const t = L.techniqueOfWeek(); if (!t) return ""; return `<div class="card"><h2>🥋 Technique of the week</h2><b>${esc(t.title)}</b>${t.summary ? `<div class="small muted">${esc(t.summary)}</div>` : ""}<button class="btn ghost small" style="margin-top:8px" data-f3="tech">Study it</button></div>`; } catch { return ""; }
}
function scoreCard() {
  const L = A.store("learn"), ex = (L.exams || []).slice(-8), ar = A.store("arena").best || {}, boss = A.store("arena").boss || {}, geo = A.store("geo").known || {};
  const kos = Object.values(boss).filter(b => b.ko).length, places = Object.keys(geo).length;
  if (!ex.length && !Object.keys(ar).length && !places) return "";
  const lo = Math.max(100, Math.min(600, ...ex.map(e => e.score)) - 50), W = 300, H = 110, x = i => 10 + i * (W - 20) / Math.max(1, ex.length - 1), y = v => H - 8 - (v - lo) / (900 - lo) * (H - 16);
  const chart = ex.length ? `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;margin:6px 0">
      <line x1="0" x2="${W}" y1="${y(750)}" y2="${y(750)}" stroke="var(--gold)" stroke-dasharray="4 4" stroke-width="1"/><text x="4" y="${y(750) - 4}" text-anchor="start" font-size="10" fill="var(--gold)">750 pass</text>
      ${ex.length > 1 ? `<polyline fill="none" stroke="var(--accent)" stroke-width="2" points="${ex.map((e, i) => x(i) + "," + y(e.score)).join(" ")}"/>` : ""}
      ${ex.map((e, i) => `<circle cx="${x(i)}" cy="${y(e.score)}" r="3.5" fill="${e.score >= 750 ? "var(--gold)" : "var(--accent)"}"/>`).join("")}</svg>` : "";
  const last = ex[ex.length - 1];
  return `<div class="card"><h2>📊 Scorecard</h2>
    ${last ? `<div class="row"><div class="grow"><div class="small muted">Practice exams</div><b style="font-family:var(--display);font-size:28px">${last.score}</b> <span class="small muted">last of ${ex.length} · ${last.score >= 750 ? "passing" : (750 - last.score) + " to pass"}</span></div></div>${chart}` : `<div class="small muted">Take a practice exam in Learn to start your readiness line.</div>`}
    <div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap">
      ${[["Speed", ar.speed], ["Survival", ar.survival], ["Acronyms", ar.acro], ["Bosses KO'd", kos], ["Places found", places]].filter(([, v]) => v != null).map(([k, v]) => `<div class="grow" style="background:var(--card-2);border-radius:10px;padding:8px 10px;min-width:80px"><div class="small muted">${k}</div><b style="font-family:var(--display);font-size:22px">${v}</b></div>`).join("")}
    </div></div>`;
}
function mapCard() {
  if (!A.mmaMap) return "";
  return `<div class="card"><h2>🗺️ Position map</h2><div class="row"><div class="grow small muted">Every move is a path: guard → sweep → mount → back. Pick a side and follow the chain.</div><button class="btn small" data-f3="map">Open</button></div></div>`;
}
function studyCard() {
  const L = A.learn; if (!L || typeof L.fightStudy !== "function") return "";
  try { const t = L.fightStudy(); if (!t) return ""; return `<div class="card"><h2>🎥 Fight study</h2><b>${esc(t.title || "")}</b>${t.summary ? `<div class="small muted">${esc(t.summary)}</div>` : ""}${typeof t.open === "function" ? `<button class="btn ghost small" style="margin-top:8px" data-f3="study">Break it down</button>` : ""}</div>`; } catch { return ""; }
}
window.Features3 = {
  beforeWorkout(dd) { return swapBanner(dd) + movementCard(dd) + (I.cur === today() ? recoveryCard(dd) : ""); },
  workoutExtras(dd) {
    const f = finisherFor(I.cur);
    return `<div class="row" style="margin-top:10px;flex-wrap:wrap"><button class="btn ghost small grow" data-f3="warmup">🔥 Warm-up 5 min</button><button class="btn ghost small grow" data-f3="finisher">⚡ Finisher: ${esc(f.name)}</button></div>`;
  },
  fighterExtras() { return scoreCard() + mapCard() + techCard() + studyCard() + bodyCard(); },
  _test: { recoveryAdvice }
};
document.addEventListener("click", e => {
  const b = e.target.closest("[data-f3]"); if (!b) return;
  const f = b.dataset.f3, v = b.dataset.v, dd = I.day(I.cur);
  if (f === "sleep") { dd.sleep = +v; I.save(); I.render(); }
  if (f === "sore") { dd.sore = +v; I.save(); I.render(); }
  if (f === "swap") { const wy = I.S.plan[I.parse(v).getDay()]; dd.wkOverride = { name: wy.name, exercises: wy.exercises.slice() }; dd.wkDone = {}; I.save(); I.render(); I.toast(`Today is ${wy.name} day`); }
  if (f === "noswap") { dd.swapNo = true; I.save(); I.render(); }
  if (f === "warmup") runIntervals("Fighter warm-up", WARMUP);
  if (f === "finisher") { const fin = finisherFor(I.cur); runIntervals(fin.name, fin.moves.map(([name, secs]) => ({ name, secs, say: name }))); }
  if (f === "snack") startSnack();
  if (f === "body") openBody();
  if (f === "tech") { try { A.learn.techniqueOfWeek().open(); } catch {} }
  if (f === "map") { A.mmaMap.open("guard"); }
  if (f === "study") { try { A.learn.fightStudy().open(); } catch {} }
});
})();
