// Comeback mode, daily challenge, reminders (.ics), themes, mood insights,
// personal library, year in review.
(() => {
"use strict";
const A = window.App, I = A.internal, D = window.PLANNER_DATA;
const $ = (s, el = document) => el.querySelector(s);
const esc = I.esc;
const S = () => I.S;
const today = () => I.todayISO();
const active = d => { const x = I.peek(d); return !!x && (I.progress(d) > 0 || !!x.mood || x.water > 0 || x.food.length > 0); };

// ================= THEMES =================
const THEMES = [
  ["auto", "Match phone", "Light or dark, following your iPhone"],
  ["light", "Light", "Warm paper"],
  ["dark", "Dark", "Easy on the eyes at night"],
  ["gym", "Gym", "Charcoal and neon"],
  ["hacker", "Hacker terminal", "Green on black, monospace"],
  ["sunset", "Louisiana sunset", "Bayou purples and orange"]
];
function applyTheme() {
  const t = S().theme || "auto";
  if (t === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  const bg = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute("content", bg));
}

// ================= COMEBACK MODE =================
const COMEBACK = [
  { title: "Day 1: just show up", goals: [["Log your mood", d => !!(I.peek(d) || {}).mood], ["Drink 32 oz", d => ((I.peek(d) || {}).water || 0) >= 32], ["Check off any 3 items", d => I.progress(d) * countItems() >= 3]] },
  { title: "Day 2: build a little", goals: [["Log your mood", d => !!(I.peek(d) || {}).mood], ["Drink 56 oz", d => ((I.peek(d) || {}).water || 0) >= 56], ["Hit 30% of your ideal day", d => I.progress(d) >= .3]] },
  { title: "Day 3: back in rhythm", goals: [["Work out or box", d => (I.peek(d) || {}).worked === true || I.isChecked("boxing", d)], ["Drink 80 oz", d => ((I.peek(d) || {}).water || 0) >= 80], ["Hit 50% of your ideal day", d => I.progress(d) >= .5]] }
];
let _count; const countItems = () => _count || (_count = D.checklist.reduce((a, s) => a + s.items.length, 0));
function comebackState() {
  const t = today(), s = S();
  if (s.comeback && I.daysBetween(s.comeback.start, t) <= 2) return s.comeback;
  // gap check: was there activity before, and nothing in the last 2+ days?
  const anyHistory = Object.keys(s.days).some(d => d < I.addDays(t, -2) && active(d));
  if (!anyHistory) return null;
  if (active(I.addDays(t, -1)) || active(I.addDays(t, -2))) return null;
  let last = null; for (let k = 3; k < 400; k++) { const d = I.addDays(t, -k); if (active(d)) { last = d; break; } }
  if (!last) return null;
  if (s.comeback && s.comeback.start === t) return s.comeback;
  s.comeback = { start: t, away: I.daysBetween(last, t) - 1 }; I.save();
  return s.comeback;
}
function comebackCard() {
  const c = comebackState(); if (!c) return "";
  const n = I.daysBetween(c.start, I.cur); if (n < 0 || n > 2 || I.cur > today()) return "";
  const step = COMEBACK[n];
  const done = step.goals.filter(g => g[1](I.cur)).length;
  if (done === step.goals.length) A.xp.has(`comeback:${I.cur}`) || A.xp.award(`comeback:${I.cur}`, 30, "discipline");
  return `<div class="card comeback"><h2>🔄 Comeback camp <span class="right">${n + 1}/3</span></h2>
    ${n === 0 ? `<p class="small" style="margin:0 0 8px">Welcome back. You were away ${c.away} day${c.away === 1 ? "" : "s"} and that's fine. No catching up, no guilt. Three easy days to get the rhythm back.</p>` : ""}
    <b>${esc(step.title)}</b>
    ${step.goals.map(g => `<div class="item ${g[1](I.cur) ? "on" : ""}" style="padding:6px 0"><div class="box"></div><div class="label">${esc(g[0])}</div></div>`).join("")}
    <div class="muted small">${done === step.goals.length ? "Day complete, +30 XP 💪" : "These fill in on their own as you go."}</div></div>`;
}

// ================= DAILY CHALLENGE =================
const CHALLENGES = [
  ["💪", "50 push-ups spread across the day", "str"], ["🥊", "3 minutes of shadowboxing, nonstop", "tech"], ["🚶", "A 10-minute walk with no phone", "spirit"],
  ["📱", "Text someone you haven't talked to in a while", "spirit"], ["🇪🇸", "Learn 5 new Spanish words and use one out loud", "mind"], ["🔐", "Explain one Security+ term out loud like you're teaching it", "mind"],
  ["🧊", "End your shower with 30 seconds of cold water", "discipline"], ["🙏", "Write down 3 things you're grateful for", "spirit"], ["📖", "Read for 15 minutes, anything you like", "mind"],
  ["💃", "Learn one dance move from a video and practice it 5 times", "spirit"], ["🧹", "Clean one area for 10 minutes", "discipline"], ["🧘", "5 minutes of box breathing before lunch", "spirit"],
  ["🗺️", "Find 3 countries on a map you couldn't place before", "mind"], ["💬", "Give a stranger or coworker a genuine compliment", "spirit"], ["🦵", "100 bodyweight squats spread across the day", "str"],
  ["🐧", "Run 3 Linux commands you've never used and look up what they do", "mind"], ["🚫", "No social media until noon", "discipline"], ["🎵", "Listen to a full album start to finish", "spirit"],
  ["🧠", "Teach someone (or your journal) one thing you learned this week", "mind"],
  ["🗣️", "Say your 5 affirmations out loud in the mirror", "spirit"], ["🧗", "Take the stairs every chance you get today", "str"], ["🐍", "Write 10 lines of Python by hand, no AI, and run it", "mind"],
  ["🧾", "Track every dollar you spend today", "discipline"], ["🛏️", "Make your bed the second you get up", "discipline"], ["📚", "Look up one word you didn't know and use it in a sentence", "mind"],
  ["🎧", "Listen to a podcast episode about cybersecurity", "mind"], ["🍳", "Cook one meal from scratch", "discipline"], ["🤸", "Try to touch your toes for 2 minutes total", "spirit"],
  ["🧭", "Learn the capitals of 5 countries", "mind"], ["🫶", "Tell someone you appreciate them, specifically why", "spirit"], ["🥊", "100 jabs, perfect form, counted out loud", "tech"],
  ["⌨️", "Learn 3 new keyboard shortcuts and use them all day", "mind"], ["🚿", "No screens in the bathroom today", "discipline"], ["🌳", "Spend 20 minutes outside without headphones", "spirit"],
  ["🧮", "Do 10 mental math problems (like 37 × 6) without a calculator", "mind"], ["📵", "No phone during one meal", "discipline"], ["🦶", "Practice your boxing stance and footwork for 5 minutes", "tech"],
  ["🔐", "Turn on 2-factor login for one account that doesn't have it", "mind"], ["🗂️", "Delete 50 old photos or files you don't need", "discipline"], ["🎨", "Draw something for 10 minutes, any skill level", "spirit"],
  ["🌐", "Run a traceroute to google.com and explain each hop", "mind"], ["💪", "Do 30 dips or bench dips across the day", "str"], ["🙊", "Go the whole day without complaining once", "spirit"],
  ["📞", "Call a family member just to check in", "spirit"], ["🧱", "Hold a wall sit for 2 minutes total", "str"], ["🕵️", "Google yourself and see what an attacker could learn (OSINT)", "mind"],
  ["🧃", "Zero sugary drinks today", "discipline"], ["🎤", "Sing a whole song out loud, badly is fine", "spirit"], ["🔢", "Convert 5 numbers to binary by hand", "mind"],
  ["🦵", "50 lunges spread across the day", "str"], ["🧘", "Sit in silence for 5 minutes, no phone", "spirit"], ["📰", "Read one news article from a country you know little about", "mind"],
  ["💼", "Message one person on LinkedIn who works a job you want", "discipline"], ["🖐️", "Learn 5 hand signs in American Sign Language", "mind"], ["🏀", "Play any sport or game outside for 15 minutes", "str"],
  ["🍎", "Eat 2 pieces of fruit", "discipline"], ["💡", "Write down 3 business or project ideas, even bad ones", "mind"], ["🐢", "Do one thing today extra slowly and on purpose", "spirit"], ["🥗", "Eat 3 different vegetables today", "discipline"], ["🌅", "Watch the sunrise or sunset", "spirit"],
  ["⏱️", "Hold a plank for a total of 3 minutes", "str"], ["📝", "Update one section of your resume", "discipline"], ["🔎", "Look up one cyberattack in the news and read how it worked", "mind"],
  ["🤝", "Ask someone a question about their life and really listen", "spirit"], ["🎹", "10 minutes on piano or guitar, even just one chord", "spirit"], ["🏃", "Add an extra half mile to your run", "str"],
  ["💧", "Hit 40 oz of water before noon", "discipline"], ["🧩", "Solve all four puzzles today", "mind"], ["📵", "Phone in another room for the first hour after waking", "discipline"],
  ["🥋", "Drill one footwork pattern for 5 minutes", "tech"], ["✍️", "Write a 5-sentence journal entry about your ideal job", "mind"], ["🤖", "Ask an AI to quiz you on something, and answer without looking anything up", "mind"]
];
// walk a fixed shuffled order so a challenge doesn't come back until all have been used
let _perm = null;
function challengeFor(d) {
  if (!_perm) { _perm = CHALLENGES.map((_, i) => i); let x = I.hash("challenge-order"); for (let i = _perm.length - 1; i > 0; i--) { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; const j = x % (i + 1); [_perm[i], _perm[j]] = [_perm[j], _perm[i]]; } }
  const n = Math.round(I.parse(d).getTime() / 86400000);
  return CHALLENGES[_perm[((n % _perm.length) + _perm.length) % _perm.length]];
}
function challengeCard() {
  const d = I.cur; const [em, text, stat] = challengeFor(d);
  const key = `challenge:${d}`, done = A.xp.has(key);
  return `<div class="card challenge"><h2>🎲 Daily challenge <span class="right">+20 XP</span></h2>
    <div class="row"><div style="font-size:30px">${em}</div><div class="grow"><b>${esc(text)}</b></div>
    <button class="btn ${done ? "ghost" : ""} small" data-f2="challenge" ${done || d > today() ? "disabled" : ""}>${done ? "Done ✓" : "Done"}</button></div></div>`;
}

// ================= REMINDERS (.ics for iPhone Calendar alerts) =================
const DEFAULT_REMINDERS = [
  { id: "boot", on: true, time: "06:00", title: "☀️ Morning boot", note: "Open Level Up and start your morning boot." },
  { id: "w1", on: true, time: "09:00", title: "💧 Water check", note: "Drink 16 oz." },
  { id: "sec", on: true, time: "10:00", title: "🔒 Security+ hour", note: "Start the 60-minute focus timer." },
  { id: "w2", on: true, time: "12:00", title: "💧 Water check", note: "Halfway to 80 oz?" },
  { id: "jobs", on: true, time: "13:00", title: "💼 5 job applications", note: "Send them before the afternoon gets away." },
  { id: "w3", on: true, time: "15:00", title: "💧 Water check", note: "Drink 16 oz." },
  { id: "w4", on: true, time: "18:00", title: "💧 Water check", note: "Last push to 80 oz." },
  { id: "night", on: true, time: "21:30", title: "🌙 Night shutdown", note: "Win, lesson, tomorrow's top task. Then wind down." },
  { id: "move", on: true, time: "10:00", until: "17:00", title: "🕺 Stand up: movement snack", note: "2-minute drill in Level Up. Shadowbox, mobility, or a dance groove." }
];
const reminders = () => {
  const r = S().reminders = S().reminders || DEFAULT_REMINDERS.map(r => Object.assign({}, r));
  if (!S().remMove) { S().remMove = true; if (!r.some(x => x.id === "move")) r.push(Object.assign({}, DEFAULT_REMINDERS.find(x => x.id === "move"))); }
  return r;
};
function icsFile() {
  const pad = n => String(n).padStart(2, "0");
  const t = I.addDays(today(), 1).replace(/-/g, "");
  const now = new Date(); const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const fold = s => s.replace(/[,;\\]/g, m => "\\" + m);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Level Up//Reminders//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Level Up"];
  for (const r of reminders().filter(r => r.on)) {
    const [h, m] = r.time.split(":");
    const hours = r.until ? Array.from({ length: Math.max(0, +r.until.split(":")[0] - +h) + 1 }, (_, k) => +h + k).join(",") : null;
    lines.push("BEGIN:VEVENT", `UID:levelup-${r.id}@levelup.app`, `DTSTAMP:${stamp}`, `DTSTART:${t}T${h}${m}00`, "DURATION:PT5M", hours ? `RRULE:FREQ=DAILY;BYHOUR=${hours};BYMINUTE=${+m}` : "RRULE:FREQ=DAILY",
      `SUMMARY:${fold(r.title)}`, `DESCRIPTION:${fold(r.note || "")}`, "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${fold(r.title)}`, "TRIGGER:PT0M", "END:VALARM", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
async function exportICS() {
  const name = "level-up-reminders.ics";
  const file = new File([icsFile()], name, { type: "text/calendar" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file] }); return; } catch (e) { if (e.name === "AbortError") return; } }
  const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; a.click();
}
function settingsHTML() {
  const t = S().theme || "auto";
  return `<h2 style="margin-top:20px">Theme</h2>
    <div class="theme-pick">${THEMES.map(([id, name, sub]) => `<button data-theme-pick="${id}" class="${t === id ? "on" : ""}"><span class="sw sw-${id}"></span><b>${name}</b><small>${sub}</small></button>`).join("")}</div>
    <h2 style="margin-top:20px">Phone reminders</h2>
    <p class="muted small">These become repeating alerts in your iPhone Calendar, so they buzz even when the app is closed. Edit the times, then tap Add to Calendar and choose "Add All". To change them later, delete the "Level Up" events in Calendar and add again.</p>
    ${reminders().map((r, i) => `<div class="rem"><label class="tg"><input type="checkbox" data-rem-on="${i}" ${r.on ? "checked" : ""}><span></span></label>
      <div class="grow"><input type="text" data-rem-title="${i}" value="${esc(r.title)}">${r.until ? `<div class="muted small" style="margin-top:4px">Every hour from the start time until <input type="time" data-rem-until="${i}" value="${r.until}" style="width:110px;display:inline-block;padding:4px 6px"></div>` : ""}</div><input type="time" data-rem-time="${i}" value="${r.time}"><button class="x" data-rem-del="${i}">✕</button></div>`).join("")}
    <div class="row" style="margin-top:8px"><button class="btn ghost grow" data-rem-add>+ Add reminder</button><button class="btn grow" data-rem-ics>Add to Calendar</button></div>
    <h2 style="margin-top:20px">Push notifications</h2>
    <p class="muted small">Real notifications from Level Up itself, sent for free by a scheduled GitHub Action on your repo. They use the same reminder list above and arrive within about 15 minutes of the time. Needs the app added to your Home Screen (iOS 16.4+).</p>
    ${pushHTML()}`;
}
// ================= PUSH (free: VAPID keys made on the phone, sent by a GitHub Actions cron) =================
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const SECRET_URL = "https://github.com/nrodrigue2004/level-up/settings/secrets/actions/new";
function pushConfig() {
  const p = S().push; if (!p || !p.sub) return "";
  return JSON.stringify({ sub: p.sub, pub: p.pub, priv: p.priv, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, rem: reminders().filter(r => r.on).map(r => ({ t: r.time, u: r.until || undefined, title: r.title, body: r.note || "" })) });
}
function pushHTML() {
  const p = S().push;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return `<p class="small muted">This browser can't receive push. On iPhone, open Level Up from the Home Screen icon, not Safari.</p>`;
  if (!p || !p.sub) return `<button class="btn block" data-push-on>Turn on push notifications</button>`;
  return `<ol class="small" style="padding-left:18px;line-height:1.5"><li>Tap <b>Copy setup code</b>.</li><li>Open <a href="${SECRET_URL}" target="_blank" rel="noopener">your repo's new secret page</a>, name it <b>PUSH_CONFIG</b>, paste, and save. (If it already exists, edit it instead.)</li><li>Tap <b>Send test</b> on GitHub: Actions → Push reminders → Run workflow.</li></ol>
    <div class="row"><button class="btn grow" data-push-copy>Copy setup code</button><button class="btn ghost grow" data-push-off>Turn off</button></div>
    <p class="small muted" style="margin-top:6px">Changed a reminder above? Copy the code again and update the secret.</p>`;
}
async function pushOn() {
  if ((await Notification.requestPermission()) !== "granted") { I.toast && I.toast("Notifications are blocked in Settings"); return; }
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
  const pub = b64u(await crypto.subtle.exportKey("raw", kp.publicKey)); const priv = (await crypto.subtle.exportKey("jwk", kp.privateKey)).d;
  const reg = await navigator.serviceWorker.ready; const old = await reg.pushManager.getSubscription(); if (old) await old.unsubscribe();
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: unb64u(pub) });
  S().push = { sub: sub.toJSON(), pub, priv }; I.save();
}
async function pushOff() { try { const reg = await navigator.serviceWorker.ready; const s = await reg.pushManager.getSubscription(); if (s) await s.unsubscribe(); } catch (e) {} delete S().push; I.save(); }
function mountSettings(host) {
  const draw = () => { host.innerHTML = settingsHTML(); };
  host.onclick = e => {
    const tp = e.target.closest("[data-theme-pick]"); if (tp) { S().theme = tp.dataset.themePick; I.save(); applyTheme(); draw(); return; }
    const del = e.target.closest("[data-rem-del]"); if (del) { reminders().splice(+del.dataset.remDel, 1); I.save(); draw(); return; }
    if (e.target.closest("[data-rem-add]")) { reminders().push({ id: "r" + Date.now().toString(36), on: true, time: "12:00", title: "⏰ Reminder", note: "" }); I.save(); draw(); return; }
    if (e.target.closest("[data-rem-ics]")) exportICS();
    if (e.target.closest("[data-push-on]")) pushOn().then(draw).catch(err => { I.toast && I.toast("Push failed: " + err.message); });
    if (e.target.closest("[data-push-off]")) pushOff().then(draw);
    if (e.target.closest("[data-push-copy]")) navigator.clipboard.writeText(pushConfig()).then(() => I.toast && I.toast("Copied. Paste it as PUSH_CONFIG.")).catch(() => prompt("Copy this:", pushConfig()));
  };
  host.oninput = e => {
    const t = e.target, d = t.dataset;
    if (d.remTitle != null) reminders()[+d.remTitle].title = t.value;
    if (d.remTime != null && t.value) reminders()[+d.remTime].time = t.value;
    if (d.remOn != null) reminders()[+d.remOn].on = t.checked;
    if (d.remUntil != null && t.value) reminders()[+d.remUntil].until = t.value;
    I.save();
  };
  draw();
}

// ================= MOOD INSIGHTS =================
const FACTORS = [
  ["box", "box", d => I.isChecked("boxing", d)],
  ["work out", "workout", d => (I.peek(d) || {}).worked === true],
  ["hit 80 oz of water", "water", d => ((I.peek(d) || {}).water || 0) >= S().settings.waterGoal],
  ["study Security+", "secplus", d => I.isChecked("secplus", d)],
  ["get outside in daylight", "outside", d => I.isChecked("outside", d)],
  ["wake up at 6", "wake", d => I.isChecked("wake6", d)],
  ["make conversation", "convo", d => I.isChecked("convo", d)],
  ["do breathwork or QiGong", "breath", d => I.isChecked("stretch", d)],
  ["do the morning boot", "boot", d => Object.keys((I.peek(d) || {}).boot || {}).length >= 5],
  ["solve a puzzle", "puzzle", d => Object.values(S().puzzles[d] || {}).some(p => p.solved)],
  ["send job applications", "jobs", d => I.isChecked("jobs", d)],
  ["hit your protein goal", "protein", d => I.foodTotals(d).pro >= S().settings.proteinGoal]
];
function moodInsights() {
  const days = Object.keys(S().days).filter(d => S().days[d].mood);
  if (days.length < 5) return `<div class="card"><h2>🔍 Mood insights</h2><p class="muted small" style="margin:0">Log your mood on ${5 - days.length} more day${5 - days.length === 1 ? "" : "s"} to unlock this. It finds which habits line up with your best days.</p></div>`;
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  const rows = FACTORS.map(([label, , test]) => {
    const yes = days.filter(test).map(d => S().days[d].mood), no = days.filter(d => !test(d)).map(d => S().days[d].mood);
    if (yes.length < 2 || no.length < 2) return null;
    return { label, yes: avg(yes), no: avg(no), diff: avg(yes) - avg(no), n: yes.length };
  }).filter(Boolean).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 4);
  const f = v => Math.round(v * 10) / 10;
  const best = days.reduce((b, d) => S().days[d].mood > S().days[b].mood ? d : b, days[0]);
  return `<div class="card"><h2>🔍 Mood insights <span class="right">${days.length} days</span></h2>
    ${rows.length ? rows.map(r => `<div class="insight"><div class="grow">On days you <b>${esc(r.label)}</b>, your mood averages <b>${f(r.yes)}</b> vs ${f(r.no)} on days you don't.</div><span class="${r.diff >= 0 ? "up" : "down"}">${r.diff >= 0 ? "+" : ""}${f(r.diff)}</span></div>`).join("")
      : `<p class="muted small">Not enough variety yet. Keep logging and patterns will show up.</p>`}
    <div class="muted small" style="margin-top:6px">Best day so far: ${I.parse(best).toLocaleDateString(undefined, { month: "short", day: "numeric" })} (${S().days[best].mood}/10). These are patterns, not proof, but they're worth noticing.</div></div>`;
}

// ================= PERSONAL LIBRARY =================
const LIB_TYPES = { lesson: ["📘", "Lessons"], word: ["🔤", "Words"], combo: ["🥊", "Combos"], journal: ["✍️", "Journal"], note: ["📌", "Notes"] };
const lib = () => (S().library = S().library || []);
const Library = {
  save(item) {
    const it = Object.assign({ type: "note", title: "", body: "", ref: null }, item);
    const key = it.ref ? it.type + ":" + it.ref : null;
    if (key && lib().some(x => x.key === key)) { I.toast("Already in your library"); return false; }
    lib().unshift(Object.assign(it, { id: Math.random().toString(36).slice(2), key, date: today() })); I.save(); I.toast("Saved to library 📚"); return true;
  },
  has: (type, ref) => lib().some(x => x.key === type + ":" + ref),
  remove(id) { S().library = lib().filter(x => x.id !== id); I.save(); },
  list: () => lib().slice(),
  open: openLibrary
};
function openLibrary(filter = "all") {
  let q = "";
  I.sheet("", (el, close) => {
    const draw = () => {
      const items = lib().filter(x => (filter === "all" || x.type === filter) && (!q || (x.title + " " + x.body).toLowerCase().includes(q)));
      el.innerHTML = `<h2>📚 My library</h2>
        <input type="text" data-libq placeholder="Search" value="${esc(q)}">
        <div class="chips" style="margin:10px 0">${[["all", "All"]].concat(Object.entries(LIB_TYPES).map(([k, v]) => [k, v[0] + " " + v[1]])).map(([k, l]) => `<button class="chip ${filter === k ? "on" : ""}" data-libf="${k}">${l}</button>`).join("")}</div>
        ${items.length ? items.map(x => `<details class="libitem"><summary>${LIB_TYPES[x.type] ? LIB_TYPES[x.type][0] : "📌"} <b>${esc(x.title || "Untitled")}</b><span class="muted small">${esc(x.date)}</span></summary>
          <div class="small" style="white-space:pre-wrap;margin:8px 0">${esc(x.body)}</div>
          <div class="row">${x.type === "lesson" && x.ref && A.learn && A.learn.openLesson ? `<button class="btn small" data-libopen="${esc(x.ref)}">Open lesson</button>` : ""}<button class="btn ghost small" data-libdel="${x.id}">Remove</button></div></details>`).join("")
          : `<p class="muted small">Nothing here yet. Save lessons from Learn, words from puzzles, combos from the boxing timer, and journal entries from the Journal page.</p>`}
        <button class="btn ghost block" style="margin-top:14px" data-close>Done</button>`;
    };
    el.addEventListener("click", e => {
      const f = e.target.closest("[data-libf]"); if (f) { filter = f.dataset.libf; draw(); return; }
      const d = e.target.closest("[data-libdel]"); if (d) { Library.remove(d.dataset.libdel); draw(); return; }
      const o = e.target.closest("[data-libopen]"); if (o) { close(); A.learn.openLesson(o.dataset.libopen); }
    });
    el.addEventListener("input", e => { if (e.target.dataset.libq != null) { q = e.target.value.toLowerCase(); const pos = e.target.selectionStart; draw(); const i = $("[data-libq]", el); i.focus(); i.setSelectionRange(pos, pos); } });
    draw();
  });
}
function journalBottom() {
  const dd = I.peek(I.cur) || {};
  return `<div class="card"><div class="row"><button class="btn ghost grow" data-f2="savejournal" ${dd.journal ? "" : "disabled"}>⭐ Save this entry</button><button class="btn grow" data-f2="library">📚 My library (${lib().length})</button></div></div>`;
}

// ================= YEAR IN REVIEW =================
function yearStats(y) {
  const days = Object.keys(S().days).filter(d => d.startsWith(y));
  const sum = f => days.reduce((a, d) => a + (f(d) || 0), 0);
  const songs = {}; days.forEach(d => { const s = S().days[d].song; if (s && s.title) { const k = s.title + (s.artist ? " · " + s.artist : ""); songs[k] = (songs[k] || 0) + 1; } });
  const topics = {}; days.forEach(d => { const t = S().days[d].topic; if (t) topics[t] = (topics[t] || 0) + 1; });
  const months = {}; days.forEach(d => { const m = S().days[d].mood; if (m) { const k = d.slice(5, 7); (months[k] = months[k] || []).push(m); } });
  const bestMonth = Object.entries(months).map(([k, a]) => [k, a.reduce((x, y) => x + y, 0) / a.length]).sort((a, b) => b[1] - a[1])[0];
  const xp = sum(d => Object.values(I.dayXP(d)).reduce((a, b) => a + b, 0)) + Object.values(S().xp || {}).filter(e => (e.date || "").startsWith(y)).reduce((a, e) => a + e.amt, 0);
  const longest = test => { let best = 0, cur = 0; for (let d = `${y}-01-01`; d <= today() && d.startsWith(y); d = I.addDays(d, 1)) { if (test(d)) { cur++; best = Math.max(best, cur); } else cur = 0; } return best; };
  return {
    y, logged: days.filter(active).length, xp, level: A.xp.level(),
    workouts: sum(d => S().days[d].worked === true ? 1 : 0),
    boxing: sum(d => I.isChecked("boxing", d) ? 1 : 0),
    secHours: Math.round(sum(d => S().days[d].secMins || (I.isChecked("secplus", d) ? 60 : 0)) / 60),
    jobs: sum(d => I.isChecked("jobs", d) ? 5 : 0),
    gallons: Math.round(sum(d => S().days[d].water) / 128),
    puzzles: days.reduce((a, d) => a + Object.values(S().puzzles[d] || {}).filter(p => p.solved).length, 0),
    wins: days.filter(d => S().days[d].win).length,
    topSongs: Object.entries(songs).sort((a, b) => b[1] - a[1]).slice(0, 5),
    topTopic: Object.entries(topics).sort((a, b) => b[1] - a[1])[0],
    bestMonth, bestStreak: longest(d => I.progress(d) >= .7), sober: (I.soberList() || []).map(c => [c.name, (c.banked || 0) + Math.max(0, I.daysBetween(c.start, today()))]),
    lessons: Object.keys(S().xp || {}).filter(k => k.startsWith("learn:") && (S().xp[k].date || "").startsWith(y)).length,
    favWin: (() => { const w = days.filter(d => S().days[d].win); return w.length ? S().days[w[I.hash(y) % w.length]].win : null; })()
  };
}
function openYear() {
  const y = today().slice(0, 4), st = yearStats(y);
  const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const slides = [
    `<small>Level Up</small><h1>${y}<br>Wrapped</h1><p>Your year, in numbers. Tap to continue.</p>`,
    `<small>You showed up</small><h1>${st.logged}</h1><p>days logged</p><p>and earned <b>${st.xp.toLocaleString()} XP</b>, reaching <b>level ${st.level}</b>.</p>`,
    `<small>Training</small><h1>${st.workouts}</h1><p>workouts</p><p><b>${st.boxing}</b> boxing sessions</p>`,
    `<small>Career</small><h1>${st.secHours}</h1><p>hours of Security+</p><p>about <b>${st.jobs}</b> job applications sent</p><p><b>${st.lessons}</b> lessons and quizzes in Learn</p>`,
    `<small>Stronger than your vices</small>${st.sober.map(([n, d]) => `<p><b style="font-size:34px">${d}</b> clean days · ${esc(n)}</p>`).join("")}`,
    `<small>Habits</small><h1>${st.gallons}</h1><p>gallons of water</p><p><b>${st.puzzles}</b> puzzles solved</p><p>Longest 70%+ streak: <b>${st.bestStreak} days</b></p>`,
    `<small>Your soundtrack</small>${st.topSongs.length ? st.topSongs.map(([s, n], i) => `<p><b>${i + 1}.</b> ${esc(s)}${n > 1 ? ` <span style="opacity:.7">×${n}</span>` : ""}</p>`).join("") : "<p>Log a song of the day to build your soundtrack.</p>"}`,
    `<small>Mind</small>${st.bestMonth ? `<p>Your best mood month was</p><h1>${MONTHS[+st.bestMonth[0]]}</h1><p>averaging ${Math.round(st.bestMonth[1] * 10) / 10}/10</p>` : "<p>Log moods to find your best month.</p>"}${st.topTopic ? `<p>Favorite learning topic: <b>${esc(st.topTopic[0])}</b></p>` : ""}`,
    `<small>${st.wins} wins logged</small>${st.favWin ? `<p>One of them:</p><h2>“${esc(st.favWin)}”</h2>` : "<p>Use the night shutdown to log daily wins.</p>"}<p style="margin-top:24px">Consistency matters more than perfection.</p>`
  ];
  let i = 0;
  const el = document.createElement("div"); el.className = "fs wrapped"; document.body.appendChild(el);
  const draw = () => {
    el.innerHTML = `<div class="wbar">${slides.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div><button class="icon-btn wx" data-wx>✕</button>
      <div class="wslide s${i % 5}">${slides[i]}</div>`;
  };
  el.onclick = e => {
    if (e.target.closest("[data-wx]") || i >= slides.length - 1 && e.clientX > innerWidth / 3) { el.remove(); return; }
    i = e.clientX < innerWidth / 3 ? Math.max(0, i - 1) : i + 1; draw();
  };
  draw();
}
function fighterCards() {
  const isDec = today().slice(5, 7) === "12";
  return moodInsights() + `<div class="card"><div class="row">
    <button class="btn ${isDec ? "" : "ghost"} grow" data-f2="year">🎁 ${today().slice(0, 4)} ${isDec ? "Wrapped is here" : "so far"}</button>
    <button class="btn ghost grow" data-f2="library">📚 Library (${lib().length})</button></div></div>`;
}

// ================= wiring =================
document.addEventListener("click", e => {
  const b = e.target.closest("[data-f2]"); if (!b || b.disabled) return;
  const f = b.dataset.f2;
  if (f === "challenge") { const [, text, stat] = challengeFor(I.cur); A.xp.award(`challenge:${I.cur}`, 20, stat); I.render(); }
  if (f === "library") openLibrary();
  if (f === "year") openYear();
  if (f === "savejournal") { const dd = I.peek(I.cur); if (dd && dd.journal) Library.save({ type: "journal", title: `Journal · ${I.parse(I.cur).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`, body: dd.journal, ref: I.cur }); }
});
A.library = Library;
window.Features2 = { comebackCard, challengeCard, mountSettings, fighterCards, journalBottom, applyTheme, openYear, _test: { yearStats, icsFile, moodInsights } };
applyTheme();
})();
