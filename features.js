// Routines and game features: morning boot, Security+ focus, boxing timer,
// night shutdown, fight camp boss battles, Sunday recap.
(() => {
"use strict";
const A = window.App, I = A.internal, D = window.PLANNER_DATA;
const $ = (s, el = document) => el.querySelector(s);
const esc = I.esc;
const fmt = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const nowISO = () => I.todayISO();
const check = (id, d = nowISO(), on = true) => { I.day(d).checks[id] = on; I.save(); };

// ---------- sound, speech, wake lock ----------
let ac;
function audio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); } catch {} return ac; }
function tone(freq, start, dur, vol = .4, type = "sine") {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq; o.connect(g); g.connect(a.destination);
  const t = a.currentTime + start;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + .05);
}
function bell(times = 1) { for (let k = 0; k < times; k++) { const s = k * .5; tone(660, s, 1.6, .5); tone(1584, s, 1.1, .2); tone(2574, s, .7, .1); } }
function clack(times = 2) { for (let k = 0; k < times; k++) tone(1200, k * .18, .08, .5, "square"); }
function chime() { tone(784, 0, .5, .3); tone(1047, .18, .7, .3); }
function speak(text) {
  try { const u = new SpeechSynthesisUtterance(text); u.rate = 1.05; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch {}
}
let lock = null;
async function wake(on) {
  try { if (on && "wakeLock" in navigator && !lock) { lock = await navigator.wakeLock.request("screen"); lock.addEventListener("release", () => lock = null); } if (!on && lock) { await lock.release(); lock = null; } } catch {}
}

// ---------- timer (survives the screen locking: based on timestamps) ----------
function Timer(seconds, onTick, onDone) {
  let endAt = Date.now() + seconds * 1000, pausedLeft = null, id = null, done = false;
  const left = () => pausedLeft != null ? pausedLeft : Math.max(0, (endAt - Date.now()) / 1000);
  const loop = () => { const l = left(); onTick && onTick(l); if (l <= 0 && !done) { done = true; clearInterval(id); onDone && onDone(); } };
  id = setInterval(loop, 250); setTimeout(loop);
  return {
    left, get paused() { return pausedLeft != null; },
    pause() { if (pausedLeft == null) pausedLeft = left(); },
    resume() { if (pausedLeft != null) { endAt = Date.now() + pausedLeft * 1000; pausedLeft = null; } },
    stop() { done = true; clearInterval(id); }
  };
}

// ---------- full screen overlay ----------
function overlay(onClose) {
  const el = document.createElement("div"); el.className = "fs";
  document.body.appendChild(el); document.body.style.overflow = "hidden";
  const close = () => { el.remove(); document.body.style.overflow = ""; wake(false); onClose && onClose(); I.render(); };
  return { el, close };
}
function ringSVG(frac, label, sub, color = "var(--accent)") {
  const r = 110, c = 2 * Math.PI * r;
  return `<div class="bigring"><svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="${r}" fill="none" stroke="var(--line)" stroke-width="14"/>
    <circle cx="130" cy="130" r="${r}" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - frac)}" transform="rotate(-90 130 130)"/></svg>
    <div><b>${label}</b>${sub ? `<span>${sub}</span>` : ""}</div></div>`;
}

const live = (el, html) => { const l = $(".live", el); if (l) l.innerHTML = html; };

// ================= MORNING BOOT =================
const MORNING = [
  { key: "up", emoji: "🌅", title: "Good morning", body: "Feet on the floor. Say today's affirmation out loud." },
  { key: "water", emoji: "💧", title: "Drink 16 oz of water", body: "Start rehydrating before anything else. Logs 16 oz.", water: 16 },
  { key: "teeth_am", emoji: "🪥", title: "Brush teeth and floss", body: "Two minutes brushing, one minute flossing.", secs: 180 },
  { key: "face_am", emoji: "🧼", title: "Wash face", body: "Cool water wakes you up.", secs: 60 },
  { key: "deo", emoji: "🧴", title: "Deodorant and lip balm", body: "Quick one.", secs: 30 },
  { key: "coffee", emoji: "☕", title: "Start the coffee", body: "Get it brewing while you make the smoothie." },
  { key: "smoothie", emoji: "🥤", title: "Make your smoothie", body: "Tap each ingredient as it goes in.", recipe: true }
];
function morningDone(d) { const x = I.peek(d); return x && x.boot ? Object.keys(x.boot).length : 0; }
function openMorning() {
  const d = nowISO(), dd = I.day(d); dd.boot = dd.boot || {};
  let i = MORNING.findIndex(s => !dd.boot[s.key]); if (i < 0) i = 0;
  let timer = null; const got = {};
  const { el, close } = overlay(() => timer && timer.stop());
  wake(true);
  const aff = D.affirmations[I.hash(d) % D.affirmations.length];
  const finish = (s, how) => {
    dd.boot[s.key] = how;
    if (how === "done") {
      if (s.key === "up") { if (new Date().getHours() < 7) check("wake6", d); }
      else if (s.water) dd.water += s.water;
      else if (s.key === "smoothie") {
        check("smoothie", d); check("make_smoothie", d);
        if (!dd.food.some(f => f.name === "Morning smoothie")) { const p = D.presets[0]; dd.food.push({ name: p[0], cal: p[1], pro: p[2], time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }); }
      } else check(s.key, d);
    }
    I.save(); timer && timer.stop(); timer = null; i++; draw();
  };
  const morningRing = s => ringSVG(timer ? timer.left() / s.secs : 1, fmt(timer ? timer.left() : s.secs), timer ? (timer.paused ? "paused" : "") : "tap Start");
  const draw = () => {
    if (i >= MORNING.length) {
      const done = MORNING.filter(s => dd.boot[s.key] === "done").length;
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button></div>
        <div class="fs-body center"><div class="huge">🚀</div><h1>Morning boot complete</h1>
        <p class="muted">${done} of ${MORNING.length} steps done. Smoothie's logged. Next up: the gym, then the morning puzzles.</p>
        <button class="btn block" data-x>Back to today</button></div>`;
      chime(); return;
    }
    const s = MORNING[i];
    const dots = MORNING.map((x, k) => `<i class="${k < i ? "on" : k === i ? "cur" : ""}"></i>`).join("");
    let mid = "";
    if (s.key === "up") {
      const w = I.workoutFor(d), lp = dd.learnPick, lpName = lp ? (lp.startsWith("topic:") ? lp.slice(6) : { secplus: "Security+", cs: "Computer science", mma: "MMA", world: "World and K-12" }[lp] || lp) : null;
      const plan = [dd.topTask && `🎯 ${esc(dd.topTask)}`, `🏋️ ${esc(w.name)}`, lpName && `📚 ${esc(lpName)}`, dd.jobTarget && `💼 Apply: ${esc(dd.jobTarget)}`].filter(Boolean);
      mid = `<div class="clock">${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div><div class="aff-big">“${esc(aff)}”</div>
        <div class="card" style="text-align:left"><div class="muted small">Today's plan</div>${plan.map(x => `<div>${x}</div>`).join("")}</div>`;
    }
    if (s.secs) mid = `<div class="live">${morningRing(s)}</div>`;
    if (s.recipe) mid = `<div class="recipe-steps">${D.smoothie.ingredients.map((x, k) => `<button class="${got[k] ? "on" : ""}" data-ing="${k}"><span class="box"></span><span class="t">${esc(x[0])}</span></button>`).join("")}</div>`;
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><div class="dots">${dots}</div><span class="muted small">${i + 1}/${MORNING.length}</span></div>
      <div class="fs-body center"><div class="huge">${s.emoji}</div><h1>${esc(s.title)}</h1><p class="muted">${esc(s.body)}</p>${mid}</div>
      <div class="fs-actions">
        ${s.key === "up" ? `<button class="btn block" data-done>I'm up ✓</button>` :
          s.secs && !timer ? `<button class="btn block" data-start>Start ${fmt(s.secs)}</button>` :
          s.secs ? `<button class="btn ghost block" data-pause>${timer.paused ? "Resume" : "Pause"}</button><button class="btn block" data-done>Done ✓</button>` :
          s.recipe ? `<button class="btn block" data-done>Smoothie made, log it ✓</button>` : `<button class="btn block" data-done>Done ✓</button>`}
        <button class="link" data-skip>Skip this one</button>
      </div>`;
  };
  el.onclick = e => {
    const s = MORNING[i];
    if (e.target.closest("[data-x]")) return close();
    if (e.target.closest("[data-done]")) return finish(s, "done");
    if (e.target.closest("[data-skip]")) return finish(s, "skip");
    if (e.target.closest("[data-start]")) { audio(); timer = Timer(s.secs, () => live(el, morningRing(s)), () => { bell(1); setTimeout(() => finish(s, "done"), 1200); }); draw(); return; }
    if (e.target.closest("[data-pause]")) { timer.paused ? timer.resume() : timer.pause(); draw(); return; }
    const ing = e.target.closest("[data-ing]"); if (ing) { got[ing.dataset.ing] = !got[ing.dataset.ing]; draw(); }
  };
  draw();
}

// ================= SECURITY+ FOCUS =================
const FOCUS_MIN = 60;
function focusState() { return I.S.focus || null; }
function focusLeft(f) { return f.pausedLeft != null ? f.pausedLeft : Math.max(0, (f.endAt - Date.now()) / 1000); }
function startFocus() {
  audio();
  I.S.focus = { date: nowISO(), endAt: Date.now() + FOCUS_MIN * 60000, pausedLeft: null, total: FOCUS_MIN * 60 };
  I.save(); openFocus();
}
function completeFocus(early) {
  const f = focusState(); if (!f) return;
  const mins = Math.round((f.total - focusLeft(f)) / 60);
  const dd = I.day(f.date); dd.secMins = (dd.secMins || 0) + mins;
  if (!early || dd.secMins >= 60) { dd.checks.secplus = true; }
  I.S.focus = null; I.save();
  if (!early) { bell(3); I.toast("Security+ hour done ✓"); secQuiz(f.date); } else I.toast(`Logged ${mins} min of Security+`);
}
function secNext() { try { return A.learn && typeof A.learn.secplusNext === "function" ? A.learn.secplusNext() : null; } catch { return null; } }
function secQuiz(date) {
  if (!A.learn || typeof A.learn.quiz !== "function") return;
  try {
    A.learn.quiz("secplus", 5, r => {
      if (!r) return;
      const dd = I.day(date); dd.secQuiz = { correct: r.correct, total: r.total };
      A.xp.award("focusquiz:" + date, 5 + 3 * (r.correct || 0), "mind"); I.save();
      I.toast(`Quiz: ${r.correct}/${r.total}`);
    });
  } catch {}
}
let focusUI = null;
function openFocus() {
  const f = focusState(); if (!f) return;
  const { el, close } = overlay(() => { focusUI = null; });
  focusUI = el; wake(true);
  const draw = () => {
    const f = focusState(); if (!f) { close(); return; }
    const l = focusLeft(f);
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x title="Minimize">⌄</button><span class="muted small">Keeps running if you leave</span></div>
      <div class="fs-body center"><h1>🔒 Security+ focus</h1>
      ${ringSVG(l / f.total, fmt(l), f.pausedLeft != null ? "paused" : "remaining", "var(--good)")}
      ${(() => { const n = secNext(); return n ? `<p class="small">Next up: <b>${esc(n.title)}</b></p>` : ""; })()}
      <p class="muted small">Phone face down. One lesson, notes in your own words. A 5-question quiz pops up when the hour ends.</p></div>
      <div class="fs-actions">
        <button class="btn ghost block" data-fp>${f.pausedLeft != null ? "Resume" : "Pause"}</button>
        <button class="btn ghost block" data-learn>${secNext() ? "Open next lesson" : "Open Learn tab"}</button>
        <button class="link" data-end>End early and log time</button>
      </div>`;
  };
  el.onclick = e => {
    const f = focusState(); if (!f) return;
    if (e.target.closest("[data-x]")) return close();
    if (e.target.closest("[data-fp]")) { if (f.pausedLeft != null) { f.endAt = Date.now() + f.pausedLeft * 1000; f.pausedLeft = null; } else f.pausedLeft = focusLeft(f); I.save(); draw(); }
    if (e.target.closest("[data-learn]")) { const n = secNext(); close(); if (n && typeof n.open === "function") n.open(); else A.go("learn"); }
    if (e.target.closest("[data-end]")) { completeFocus(true); close(); }
  };
  el._draw = draw; draw();
}
// global ticker: focus pill + completion
setInterval(() => {
  const f = focusState();
  let pill = $("#focus-pill");
  if (!f) { if (pill) pill.remove(); return; }
  const l = focusLeft(f);
  if (l <= 0) { completeFocus(false); if (focusUI) focusUI._draw(); return; }
  if (focusUI) { focusUI._draw(); return; }
  if (!pill) { pill = document.createElement("button"); pill.id = "focus-pill"; pill.onclick = openFocus; document.body.appendChild(pill); }
  pill.textContent = `🔒 Security+ ${fmt(l)}${f.pausedLeft != null ? " (paused)" : ""}`;
}, 1000);

// ================= BOXING TIMER =================
const COMBOS = {
  basic: ["1", "1-2", "1-1-2", "1-2-3", "2-3-2", "1-2-3-2", "jab, slip, 2", "1-2, roll", "double jab", "jab to the body", "1-2, step back", "3-2"],
  advanced: ["1-2-3, roll, 3-2", "1-6-3-2", "slip, slip, 2-3", "1-2-3-4", "pull, 2", "3-2-3", "body 3, head 3", "1-2, pivot, 2", "feint 1, 2", "1-2-5-2", "jab, cross, catch, 2", "1-2-3, slip, 3"]
};
const ROUND_THEMES = [
  { name: "Jab only", tip: "Snap it back to your face every time.", combos: ["1", "1-1", "double jab", "jab to the body", "1, step back", "triple jab", "1, slip", "feint, 1"] },
  { name: "Body work", tip: "Bend your knees to go downstairs. Don't reach.", combos: ["3 to the body", "1-2 to the body", "body 3, head 3", "2 body, 3 head", "jab body, cross head", "5-3-2"] },
  { name: "Counters", tip: "Defend first, then fire back immediately.", combos: ["slip, 2", "roll, 3-2", "pull, 2", "catch, 1-2", "slip, slip, 2-3", "block, 3-2"] },
  { name: "Power", tip: "Turn the hips. Sit down on your punches.", combos: ["2", "3-2", "2-3-2", "1-2-3-2", "6-3-2", "1-2-3"] },
  { name: "Footwork", tip: "Never stand still in front of the bag.", combos: ["1, pivot", "1-2, step out", "angle, 3", "double jab, circle out", "1-2, step back", "in, 1-2, out"] },
  { name: "Free flow", tip: "Everything you've got. Mix it up.", combos: null }
];
const NUM = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six" };
const sayCombo = c => c.replace(/(\d)/g, d => " " + NUM[d] + " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
function openBoxing() {
  const cfg = I.S.boxing = Object.assign({ rounds: 5, round: 180, rest: 60, combos: true, level: "basic", themed: true, pace: 7 }, I.S.boxing || {});
  const themeFor = n => ROUND_THEMES[(n - 1) % ROUND_THEMES.length];
  const pool = () => { const t = cfg.themed && themeFor(roundNo); return (t && t.combos) || COMBOS[cfg.level]; };
  const { el, close } = overlay(() => { running && running.stop(); });
  let running = null, phase = "setup", roundNo = 0, combo = "", nextCall = 0, warned = false, curTotal = 1;
  const totalMin = () => Math.round((cfg.rounds * cfg.round + (cfg.rounds - 1) * cfg.rest) / 60);
  const setup = () => {
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button></div>
      <div class="fs-body"><h1 style="text-align:center">🥊 Boxing rounds</h1>
      <div class="stepper"><span>Rounds</span><button data-adj="rounds:-1">−</button><b>${cfg.rounds}</b><button data-adj="rounds:1">+</button></div>
      <div class="stepper"><span>Round length</span><button data-adj="round:-30">−</button><b>${fmt(cfg.round)}</b><button data-adj="round:30">+</button></div>
      <div class="stepper"><span>Rest</span><button data-adj="rest:-15">−</button><b>${fmt(cfg.rest)}</b><button data-adj="rest:15">+</button></div>
      <div class="stepper"><span>Call out combos</span><button data-tg="combos" class="${cfg.combos ? "on" : ""}" style="width:auto;padding:0 14px">${cfg.combos ? "On" : "Off"}</button></div>
      <div class="stepper"><span>Combo level</span><button data-lvl class="on" style="width:auto;padding:0 14px">${cfg.level === "basic" ? "Basic" : "Advanced"}</button></div>
      <div class="stepper"><span>Call pace (seconds)</span><button data-adj="pace:-1">−</button><b>~${cfg.pace}s</b><button data-adj="pace:1">+</button></div>
      <div class="stepper"><span>Themed rounds</span><button data-tg2="themed" class="${cfg.themed ? "on" : ""}" style="width:auto;padding:0 14px">${cfg.themed ? "On" : "Off"}</button></div>
      ${cfg.themed ? `<p class="small muted">Rounds: ${Array.from({ length: cfg.rounds }, (_, k) => themeFor(k + 1).name).join(" → ")}</p>` : ""}
      <button class="btn ghost block" data-preset20>⏱️ 20-minute bag workout (5 × 3 min)</button>
      <p class="muted small" style="text-align:center">About ${totalMin()} minutes. 1 jab · 2 cross · 3 lead hook · 4 rear hook · 5 lead uppercut · 6 rear uppercut</p></div>
      <div class="fs-actions"><button class="btn block" data-go>Start</button></div>`;
  };
  const liveBox = (left, total, label, color) => `${ringSVG(left / total, fmt(left), label, color)}
      <div class="combo">${phase === "round" && cfg.combos ? esc(combo) : phase === "rest" ? "Breathe. Shake it out." : ""}</div>
      ${cfg.themed && (phase === "round" || phase === "rest") ? `<div class="muted small">${phase === "rest" ? "Next: " + esc(themeFor(roundNo + 1).name) : esc(themeFor(roundNo).name) + " · " + esc(themeFor(roundNo).tip)}</div>` : ""}`;
  let lastPhase = null;
  const show = (left, total) => {
    const label = phase === "ready" ? "Get ready" : phase === "rest" ? "Rest" : `Round ${roundNo} of ${cfg.rounds}`;
    const color = phase === "round" ? "var(--accent)" : phase === "rest" ? "var(--water)" : "var(--warn)";
    const key = phase + roundNo + (running && running.paused);
    if (key === lastPhase) return live(el, liveBox(left, total, label, color));
    lastPhase = key;
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span class="muted small">${label}</span></div>
      <div class="fs-body center boxing ${phase}"><div class="live">${liveBox(left, total, label, color)}</div></div>
      <div class="fs-actions"><button class="btn ghost block" data-bp>${running && running.paused ? "Resume" : "Pause"}</button>${phase === "round" && cfg.combos && A.library ? `<button class="link" data-savecombo>⭐ Save this combo</button>` : ""}</div>`;
  };
  const go = (ph, secs, next) => {
    phase = ph; warned = false; nextCall = secs - 3; curTotal = secs;
    running = Timer(secs, l => {
      if (ph === "round" && cfg.combos && l < nextCall && l > 4) { const P = pool(); combo = P[Math.floor(Math.random() * P.length)]; speak(sayCombo(combo)); nextCall = l - (cfg.pace * .7 + Math.random() * cfg.pace * .6); }
      if (!warned && l <= 10 && secs > 20) { warned = true; clack(2); }
      show(l, secs);
    }, next);
  };
  const round = () => {
    roundNo++; bell(1); speak(`Round ${roundNo}${cfg.themed ? ". " + themeFor(roundNo).name : ""}`);
    go("round", cfg.round, () => {
      if (roundNo >= cfg.rounds) { bell(3); speak("Time. Great work."); done(); }
      else { bell(2); go("rest", cfg.rest, round); }
    });
  };
  const done = () => {
    phase = "done"; check("boxing"); wake(false);
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button></div>
      <div class="fs-body center"><div class="huge">🏆</div><h1>${cfg.rounds} rounds done</h1><p class="muted">Boxing checked off for today.</p><button class="btn block" data-x>Back to today</button></div>`;
  };
  el.onclick = e => {
    if (e.target.closest("[data-x]")) return close();
    const adj = e.target.closest("[data-adj]");
    if (adj) { const [k, v] = adj.dataset.adj.split(":"); const min = { rounds: 1, round: 30, rest: 0, pace: 3 }[k]; cfg[k] = Math.max(min, Math.min(k === "rounds" ? 20 : k === "pace" ? 15 : 600, cfg[k] + +v)); I.save(); setup(); return; }
    if (e.target.closest("[data-tg]")) { cfg.combos = !cfg.combos; I.save(); setup(); return; }
    if (e.target.closest("[data-tg2]")) { cfg.themed = !cfg.themed; I.save(); setup(); return; }
    if (e.target.closest("[data-preset20]")) { Object.assign(cfg, { rounds: 5, round: 180, rest: 60, themed: true, combos: true }); I.save(); setup(); return; }
    if (e.target.closest("[data-lvl]")) { cfg.level = cfg.level === "basic" ? "advanced" : "basic"; I.save(); setup(); return; }
    if (e.target.closest("[data-go]")) { audio(); wake(true); speak("Get ready"); go("ready", 10, round); return; }
    if (e.target.closest("[data-savecombo]") && combo && A.library) { A.library.save({ type: "combo", title: combo.toUpperCase(), body: "Saved from the boxing timer. 1 jab · 2 cross · 3 lead hook · 4 rear hook · 5 lead uppercut · 6 rear uppercut", ref: combo }); return; }
    if (e.target.closest("[data-bp]") && running) { running.paused ? running.resume() : running.pause(); show(running.left(), curTotal); }
  };
  setup();
}

// ================= NIGHT SHUTDOWN =================
function openNight() {
  const d = nowISO(), dd = I.day(d), tmr = I.addDays(d, 1);
  const steps = ["win", "lesson", "top", "routine", "breathe", "prep"];
  let i = 0, timer = null;
  const { el, close } = overlay(() => timer && timer.stop());
  const tw = I.workoutFor(tmr), tev = (I.S.events[tmr] || []);
  const routine = [["teeth_pm", "Brush teeth"], ["shower", "Shower"], ["face_pm", "Cleanse face"], ["moist", "Moisturize"]];
  const breathHTML = () => {
    const l = timer ? timer.left() : 600, ph = timer ? Math.floor((600 - l) / 4) % 4 : -1;
    const words = ["Breathe in", "Hold", "Breathe out", "Hold"];
    return `<div class="breath ${ph === 0 ? "in" : ph === 1 ? "full" : ph === 2 ? "out" : ""}"><div></div><span>${ph >= 0 ? words[ph] : "Ready"}</span></div>
      <div style="font-size:28px;font-weight:800">${fmt(l)}</div>`;
  };
  const draw = () => {
    const dots = steps.map((x, k) => `<i class="${k < i ? "on" : k === i ? "cur" : ""}"></i>`).join("");
    const top = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><div class="dots">${dots}</div><span class="muted small">${Math.min(i + 1, steps.length)}/${steps.length}</span></div>`;
    let body = "", act = `<button class="btn block" data-next>Next</button>`;
    switch (steps[i]) {
      case "win": body = `<div class="huge">🏆</div><h1>Today's win</h1><p class="muted">One thing that went right. Small counts.</p><textarea data-f="win" placeholder="I got my 5 applications in">${esc(dd.win || "")}</textarea>`; break;
      case "lesson": body = `<div class="huge">💡</div><h1>One lesson</h1><p class="muted">Something you learned or would do differently. Saves to "Something I learned".</p><textarea data-f="learned" placeholder="What stuck with you today?">${esc(dd.learned || "")}</textarea>`; break;
      case "top": body = `<div class="huge">🎯</div><h1>Tomorrow's top task</h1><p class="muted">The one thing that makes tomorrow a win. It'll be waiting at the top of Today.</p><input type="text" data-f="top" value="${esc(I.day(tmr).topTask || "")}" placeholder="Finish Security+ domain 2 quiz">`; break;
      case "routine": body = `<div class="huge">🌙</div><h1>Night routine</h1><div class="recipe-steps">${routine.map(([id, l]) => `<button class="${I.isChecked(id, d) ? "on" : ""}" data-chk="${id}"><span class="box"></span><span class="t">${l}</span></button>`).join("")}</div>`; break;
      case "breathe": {
        body = `<h1>🫁 Breathwork</h1><p class="muted">Box breathing: in 4, hold 4, out 4, hold 4. Or do QiGong instead.</p><div class="live">${breathHTML()}</div>`;
        act = !timer ? `<button class="btn block" data-breathe>Start 10 minutes</button><button class="btn ghost block" data-qigong>I did stretching or QiGong ✓</button><button class="link" data-next>Skip</button>`
          : `<button class="btn ghost block" data-bpause>${timer.paused ? "Resume" : "Pause"}</button><button class="link" data-qigong>Finish now ✓</button>`;
        break;
      }
      case "prep": body = `<div class="huge">🎒</div><h1>Prepare for tomorrow</h1>
        <div class="card" style="text-align:left"><div class="small muted">Tomorrow</div>
        <div><b>Workout:</b> ${esc(tw.name)}</div>
        ${I.day(tmr).topTask ? `<div><b>Top task:</b> ${esc(I.day(tmr).topTask)}</div>` : ""}
        ${tev.length ? `<div><b>Events:</b> ${tev.map(e => esc((e.time ? e.time + " " : "") + e.title)).join(", ")}</div>` : ""}
        <div class="small muted" style="margin-top:6px">Lay out gym clothes, set the 6 AM alarm, prep smoothie stuff.</div></div>
        <label class="field" style="width:100%;text-align:left">Tomorrow's workout
          <select data-prep="wk"><option value="">Keep scheduled: ${esc(I.S.plan[I.parse(tmr).getDay()].name)}</option>${Object.keys(D.workoutTemplates).map(k => `<option ${I.day(tmr).wkOverride && I.day(tmr).wkOverride.name === k ? "selected" : ""}>${esc(k)}</option>`).join("")}</select></label>
        <label class="field" style="width:100%;text-align:left">Tomorrow's learning focus
          <select data-prep="learn">${[["", "Decide tomorrow"], ["secplus", "Security+"], ["cs", "Computer science"], ["mma", "MMA"], ["world", "World and K-12"]].concat(D.learningTopics.map(t => ["topic:" + t, t])).map(([v, l]) => `<option value="${esc(v)}" ${I.day(tmr).learnPick === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>
        <label class="field" style="width:100%;text-align:left">A job to apply to first
          <input type="text" data-prep="job" value="${esc(I.day(tmr).jobTarget || "")}" placeholder="Company or posting"></label>`;
        act = `<button class="btn block" data-ready>Ready for tomorrow ✓</button>`; break;
      default:
        body = `<div class="huge">😴</div><h1>Shutdown complete</h1><p class="muted">Screens down. Sleep well. Tomorrow starts at 6.</p>`;
        act = `<button class="btn block" data-x>Good night</button>`;
    }
    el.innerHTML = top + `<div class="fs-body center">${body}</div><div class="fs-actions">${act}</div>`;
  };
  el.onchange = e => {
    const k = e.target.dataset.prep; if (!k) return; const t = I.day(tmr), v = e.target.value;
    if (k === "wk") { if (v) t.wkOverride = { name: v, exercises: D.workoutTemplates[v].slice() }; else delete t.wkOverride; }
    if (k === "learn") { t.learnPick = v; if (v.startsWith("topic:")) t.topic = v.slice(6); }
    if (k === "job") t.jobTarget = v;
    I.save();
  };
  el.oninput = e => {
    if (e.target.dataset.prep === "job") { I.day(tmr).jobTarget = e.target.value; I.save(); return; }
    const f = e.target.dataset.f; if (!f) return;
    if (f === "top") I.day(tmr).topTask = e.target.value; else dd[f] = e.target.value;
    I.save();
  };
  el.onclick = e => {
    if (e.target.closest("[data-x]")) return close();
    if (e.target.closest("[data-next]")) { timer && timer.stop(); timer = null; i++; return draw(); }
    const c = e.target.closest("[data-chk]"); if (c) { check(c.dataset.chk, d, !I.isChecked(c.dataset.chk, d)); return draw(); }
    if (e.target.closest("[data-breathe]")) { audio(); wake(true); let lastPh = -1; timer = Timer(600, l => { const ph = Math.floor((600 - l) / 4) % 4; if (ph !== lastPh) { lastPh = ph; tone(ph === 0 ? 523 : ph === 2 ? 392 : 440, 0, .3, .15); } live(el, breathHTML()); }, () => { chime(); check("stretch", d); timer = null; i++; draw(); }); return draw(); }
    if (e.target.closest("[data-bpause]")) { timer.paused ? timer.resume() : timer.pause(); return draw(); }
    if (e.target.closest("[data-qigong]")) { timer && timer.stop(); timer = null; check("stretch", d); i++; return draw(); }
    if (e.target.closest("[data-ready]")) { check("prep", d); wake(false); i++; return draw(); }
  };
  draw();
}

// ================= FIGHT CAMP + BOSS =================
const CAMPS = [
  { name: "Hydration Camp", focus: "water80", tip: "Hit 80 oz every day. Water-goal days hit the boss harder." },
  { name: "Early Riser Camp", focus: "wake6", tip: "Up at 6 every day. Each 6 AM wake-up is a power shot." },
  { name: "Iron Camp", focus: "workout", tip: "Never miss a scheduled workout." },
  { name: "Scholar Camp", focus: "secplus", tip: "One Security+ hour every day. Study days hit twice as hard." },
  { name: "Hustle Camp", focus: "jobs", tip: "5 applications a day. Each send-off is a body shot." },
  { name: "Calm Mind Camp", focus: "stretch", tip: "Breathwork or QiGong every night." },
  { name: "Sunlight Camp", focus: "outside", tip: "Get outside in daylight every day." },
  { name: "Clean Fuel Camp", focus: "chicken", tip: "Stick to the dinner plan all week." }
];
const BOSSES = [
  ["The Snooze Button", "😴"], ["Doomscroll Dragon", "🐉"], ["Couch Golem", "🛋️"], ["Captain Later", "⏳"],
  ["The Sugar Specter", "👻"], ["Excuse Machine", "🤖"], ["Midnight Snacker", "🍕"], ["Fog of Distraction", "🌫️"], ["The Comfort Zone", "🛏️"]
];
const weekStart = d => I.addDays(d, -((I.parse(d).getDay() + 6) % 7));
function camp(d) {
  const ws = weekStart(d);
  const n = Math.floor(I.parse(ws).getTime() / (7 * 86400000));
  const c = CAMPS[n % CAMPS.length], b = BOSSES[(n * 5) % BOSSES.length];
  const days = Array.from({ length: 7 }, (_, k) => I.addDays(ws, k));
  const today = nowISO();
  const dmg = days.map(x => x > today ? null : Math.round(I.progress(x) * 12) + (I.isChecked(c.focus, x) ? 4 : 0));
  const hp = Math.max(0, 100 - dmg.reduce((a, v) => a + (v || 0), 0));
  return { ws, c, b, days, dmg, hp };
}
function campCard(d) {
  const k = camp(d), today = nowISO(), isSun = I.parse(today).getDay() === 0 && weekStart(today) === k.ws;
  const over = I.addDays(k.ws, 6) < today;
  const won = k.hp <= 0;
  if (won) A.xp.has(`boss:${k.ws}`) || A.xp.award(`boss:${k.ws}`, 100, "discipline");
  const status = won ? `💥 KO! ${esc(k.b[0])} is down. +100 XP` : over ? `${esc(k.b[0])} survived with ${k.hp} HP. New camp this week.` : isSun ? `🔔 Boss battle today. ${k.hp} HP left. Finish strong.` : `${k.hp} HP left. Every checked item lands a hit.`;
  return `<div class="card camp"><h2>🥋 Fight camp <span class="right">week of ${I.parse(k.ws).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></h2>
    <div class="row"><div class="boss ${won ? "ko" : ""}">${k.b[1]}</div><div class="grow"><b>${esc(k.b[0])}</b>
      <div class="hp"><div style="width:${k.hp}%"></div></div><div class="small">${status}</div></div></div>
    <div class="small" style="margin-top:10px"><b>${esc(k.c.name)}:</b> ${esc(k.c.tip)}</div>
    <div class="campdays">${k.days.map((x, j) => `<div class="${x === today ? "today" : ""}"><span>${"MTWTFSS"[j]}</span><b>${k.dmg[j] == null ? "·" : k.dmg[j] ? "−" + k.dmg[j] : "0"}</b></div>`).join("")}</div>
  </div>`;
}

// ================= SUNDAY RECAP =================
function recapCard(d) {
  const ws = weekStart(d), days = Array.from({ length: 7 }, (_, k) => I.addDays(ws, k));
  const w = I.weekStats(I.addDays(ws, 6));
  const xp = days.reduce((a, x) => a + Object.values(I.dayXP(x)).reduce((p, q) => p + q, 0), 0) + Object.values(I.S.xp || {}).filter(e => days.includes(e.date)).reduce((a, e) => a + e.amt, 0);
  const puzzles = days.reduce((a, x) => a + Object.values(I.S.puzzles[x] || {}).filter(p => p.solved).length, 0);
  const best = days.reduce((b, x) => I.progress(x) > I.progress(b) ? x : b, days[0]);
  const sec = days.filter(x => I.isChecked("secplus", x)).length;
  const k = camp(d);
  const f0 = v => v == null ? "–" : Math.round(v);
  return `<div class="card recap"><h2>📅 Week recap</h2>
    <div class="stat-grid">
      <div>XP earned<b>+${xp}</b></div><div>Ideal day avg<b>${Math.round(w.done * 100)}%</b></div>
      <div>Workouts<b>${w.workouts} / 7</b></div><div>Security+ days<b>${sec} / 7</b></div>
      <div>Avg mood<b>${w.mood == null ? "–" : Math.round(w.mood * 10) / 10}</b></div><div>Avg protein<b>${f0(w.protein)} g</b></div>
      <div>Avg water<b>${f0(w.water)} oz</b></div><div>Puzzles solved<b>${puzzles}</b></div>
    </div>
    <div class="small">Best day: <b>${I.parse(best).toLocaleDateString(undefined, { weekday: "long" })}</b> (${Math.round(I.progress(best) * 100)}%). Boss: ${k.hp <= 0 ? "knocked out 💥" : k.hp + " HP left"}.</div>
    <div class="small muted" style="margin-top:6px">Next week: ${esc(CAMPS[(Math.floor(I.parse(I.addDays(ws, 7)).getTime() / (7 * 86400000))) % CAMPS.length].name)}.</div>
  </div>`;
}

// ================= hooks into the shell =================
window.Features = {
  todayTop() {
    const d = I.cur, dd = I.peek(d) || {}, isToday = d === nowISO();
    let h = "";
    if (dd.topTask) h += `<div class="card"><div class="item ${dd.topTaskDone ? "on" : ""}" data-feat="toptask" style="padding:0"><div class="box"></div><div class="label"><div class="muted small">🎯 Top task</div><b>${esc(dd.topTask)}</b></div></div></div>`;
    if (window.Features2) h += window.Features2.comebackCard();
    if (isToday) {
      const f = focusState();
      const mdone = MORNING.filter(s => (dd.boot || {})[s.key]).length;
      h += `<div class="routines">
        <button data-feat="morning"><span>☀️</span>Morning boot<small>${mdone ? `${mdone}/${MORNING.length}` : "6 AM start"}</small></button>
        <button data-feat="focus"><span>🔒</span>Security+ hour<small>${f ? fmt(focusLeft(f)) + " left" : I.isChecked("secplus") ? "Done ✓" : "60 min focus"}</small></button>
        <button data-feat="boxing"><span>🥊</span>Boxing rounds<small>${I.isChecked("boxing") ? "Done ✓" : "Timer + combos"}</small></button>
        <button data-feat="night"><span>🌙</span>Night shutdown<small>${dd.win ? "Win logged ✓" : "Wind down"}</small></button>
        ${A.music ? `<button data-feat="music"><span>🎹</span>Music room<small>Piano, guitar, tuner</small></button>` : ""}
        ${A.dance ? `<button data-feat="dance"><span>🕺</span>Dance practice<small>Line dances + rhythm</small></button>` : ""}
        ${A.geo ? `<button data-feat="geo"><span>🗺️</span>World map<small>Light up the fog</small></button>` : ""}
        <button data-feat="rabbit" class="wide"><span>🐇</span>Random rabbit hole<small>${(() => { try { const n = A.learn ? A.learn.dueReviewCount() : 0; return n ? `${n} review${n === 1 ? "" : "s"} due in Learn` : "Jump into a random lesson"; } catch { return "Jump into a random lesson"; } })()}</small></button>
      </div>`;
    }
    if (window.Features2) h += window.Features2.challengeCard();
    if (I.parse(d).getDay() === 0) h += recapCard(d);
    return h;
  },
  journalTop() {
    const dd = I.peek(I.cur) || {};
    return dd.win ? `<div class="card"><h2>🏆 Today's win</h2><div>${esc(dd.win)}</div></div>` : "";
  },
  fighterCamp() { return campCard(nowISO()) + (window.Features2 ? window.Features2.fighterCards() : "") + recapCard(nowISO()); }
};
document.addEventListener("click", e => {
  const b = e.target.closest("[data-feat]"); if (!b) return;
  const f = b.dataset.feat;
  if (f === "morning") openMorning();
  if (f === "focus") focusState() ? openFocus() : startFocus();
  if (f === "boxing") openBoxing();
  if (f === "night") openNight();
  if (f === "music" && A.music) A.music.open("piano");
  if (f === "dance" && A.dance) A.dance.open();
  if (f === "geo" && A.geo) A.geo.open();
  if (f === "rabbit") { if (A.learn && A.learn.randomRabbitHole) A.learn.randomRabbitHole(); else A.go("learn"); }
  if (f === "toptask") { const dd = I.day(I.cur); dd.topTaskDone = !dd.topTaskDone; I.save(); I.render(); }
});
window.Features._test = { camp, MORNING, sayCombo };
window.Features._kit = { overlay, Timer, speak, bell, clack, chime, tone, wake, ringSVG, audio, fmt, live, check };
})();
