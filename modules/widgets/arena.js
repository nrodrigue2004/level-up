// Arena: fast game modes on top of the Learn question bank (App.learn.questions).
// Speedrun (60s), Survival (3 lives), Weekly Boss (20 questions), Acronym Arena (60s, acronyms only).
(function () {
  const A = window.App; if (!A) return;
  const kit = () => window.Features && window.Features._kit;
  const store = () => A.store("arena");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const ready = () => A.learn && typeof A.learn.questions === "function";
  const weekKey = () => { const d = new Date(today() + "T12:00:00"); d.setHours(12); d.setDate(d.getDate() - d.getDay()); return d.toISOString().slice(0, 10); };
  const today = () => (A.internal && A.internal.todayISO ? A.internal.todayISO() : new Date().toISOString().slice(0, 10));
  const MODES = {
    speed: { name: "Speedrun", icon: "⏱️", sub: "60 seconds. Answer as many as you can.", secs: 60, lives: Infinity },
    survival: { name: "Survival", icon: "❤️", sub: "3 lives. How long can you last?", secs: 0, lives: 3 },
    boss: { name: "Weekly boss", icon: "🐉", sub: "20 questions. Land 14 to KO it.", secs: 0, lives: Infinity, total: 20, need: 14 },
    acro: { name: "Acronym arena", icon: "🔤", sub: "60 seconds of acronyms. Ports, protocols, Sec+ alphabet soup.", secs: 60, lives: Infinity, tags: ["acronym"] },
  };
  function card() {
    if (!ready()) return "";
    const s = store(), best = s.best || {};
    const bossDone = (s.boss || {})[weekKey()];
    return `<div class="card"><h2>⚔️ Arena <span class="right">learning as a game</span></h2>
      <div class="routines" style="margin:0">${Object.entries(MODES).map(([k, m]) => `<button data-arena="${k}"><span>${m.icon}</span>${m.name}<small>${k === "boss" ? (bossDone ? (bossDone.ko ? "KO'd this week" : `Best ${bossDone.score}/20 this week`) : "New boss this week") : best[k] != null ? `Best: ${best[k]}` : esc(m.sub)}</small></button>`).join("")}</div>
      <label class="field" style="margin-top:10px">Subject<select data-arena-subj>${[["all", "Everything"]].concat((A.learn.subjects ? A.learn.subjects() : []).map(x => [x.id, x.title])).map(([v, l]) => `<option value="${esc(v)}" ${s.subj === v ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label></div>`;
  }
  function start(mode) {
    const K = kit(); if (!K || !ready()) return;
    const m = MODES[mode], s = store();
    const subj = mode === "boss" ? "all" : s.subj || "all";
    let pool = [], used = [], idx = 0, score = 0, lives = m.lives, answered = 0, picked = null, endAt = m.secs ? Date.now() + m.secs * 1000 : 0, over = false, timer = null;
    const refill = () => { const more = A.learn.questions({ subj, n: 20, tags: m.tags, exclude: used }) || []; pool.push(...more); };
    refill();
    if (!pool.length) { A.toast("No questions yet for that subject"); return; }
    const { el, close } = K.overlay(() => { clearInterval(timer); });
    K.audio && K.audio();
    const finish = () => {
      if (over) return; over = true; clearInterval(timer);
      const best = s.best = s.best || {};
      let line = "";
      if (mode === "boss") {
        const wk = weekKey(); s.boss = s.boss || {}; const prev = s.boss[wk];
        const ko = score >= m.need; s.boss[wk] = { score: Math.max(score, prev ? prev.score : 0), ko: ko || (prev && prev.ko) };
        if (ko) { A.xp.award("arena:boss:" + wk, 60, "mind"); line = "Boss KO'd. +60 XP"; } else line = `Boss survives with ${m.need - score} HP. Come back and finish it.`;
      } else {
        const isBest = best[mode] == null || score > best[mode]; if (isBest) best[mode] = score;
        A.xp.award(`arena:${mode}:${today()}`, Math.min(30, 5 + score), "mind");
        line = isBest && score ? "New personal best!" : `Best: ${best[mode]}`;
      }
      A.save();
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span></span></div>
        <div class="fs-body center"><h1>${esc(m.name)}</h1><div class="huge" style="font-size:96px">${score}</div><p class="muted">${mode === "boss" ? "hits landed" : "correct"} · ${answered} answered</p><p><b>${esc(line)}</b></p>
        <p class="small muted">Every miss went into your Review pile in Learn, so it comes back tomorrow.</p></div>
        <div class="fs-actions"><button class="btn block" data-again>Run it back</button><button class="btn ghost block" data-x>Done</button></div>`;
    };
    const draw = () => {
      if (over) return;
      if (idx >= pool.length - 2) refill();
      const q = pool[idx]; if (!q) return finish();
      const left = endAt ? Math.max(0, Math.ceil((endAt - Date.now()) / 1000)) : null;
      const hp = mode === "boss" ? Math.max(0, m.need - score) : null;
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span class="arena-hud">${left != null ? `<b class="live">${left}s</b>` : ""}${lives !== Infinity ? `<b>${"❤️".repeat(lives)}</b>` : ""}${mode === "boss" ? `<b>${answered}/${m.total}</b>` : ""}<b>${score}</b></span></div>
        <div class="fs-body">${mode === "boss" ? `<div class="hp" style="margin-bottom:12px"><div style="width:${hp / m.need * 100}%"></div></div>` : ""}
        <div class="small muted" style="text-transform:uppercase;letter-spacing:.08em;font-family:var(--display);font-weight:700">${esc(q.tag || q.subj || "")}</div>
        <div class="arena-q">${q.q}</div>
        <div class="arena-choices">${q.choices.map((c, i) => `<button data-c="${i}" class="${picked == null ? "" : i === q.answer ? "right" : i === picked ? "wrong" : "dim"}">${esc(c)}</button>`).join("")}</div>
        ${picked != null && picked !== q.answer && q.explain ? `<div class="arena-why small">${q.explain}</div>` : ""}</div>
        ${picked != null ? `<div class="fs-actions"><button class="btn block" data-next>${picked === q.answer ? "Next" : "Got it, next"}</button></div>` : ""}`;
    };
    el.onclick = e => {
      if (e.target.closest("[data-x]")) { clearInterval(timer); return close(); }
      if (e.target.closest("[data-again]")) { close(); return start(mode); }
      if (e.target.closest("[data-next]")) { picked = null; idx++; return (mode === "boss" && answered >= m.total) || lives <= 0 ? finish() : draw(); }
      const c = e.target.closest("[data-c]"); if (!c || picked != null || over) return;
      const q = pool[idx]; picked = +c.dataset.c; used.push(q.id); answered++;
      const ok = picked === q.answer; try { A.learn.recordAnswer(q.id, ok); } catch {}
      if (ok) { score++; K.tone && K.tone(880, 0, .08, .25); } else { K.tone && K.tone(160, 0, .2, .3, "square"); if (lives !== Infinity) lives--; }
      // speed modes skip the pause on a correct answer
      if (ok && endAt) { picked = null; idx++; return draw(); }
      draw();
    };
    if (endAt) timer = setInterval(() => { const l = Math.ceil((endAt - Date.now()) / 1000); if (l <= 0) return finish(); const b = el.querySelector(".arena-hud .live"); if (b) b.textContent = l + "s"; }, 250);
    draw();
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-arena]"); if (b) { start(b.dataset.arena); }
  });
  document.addEventListener("change", e => { const s = e.target.closest("[data-arena-subj]"); if (s) { store().subj = s.value; A.save(); } });
  window.Arena = { card, start };
})();
