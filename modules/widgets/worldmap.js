// Geography game: fog-of-war world map + US states. Every country you get right is revealed for good.
// Modes: Find it (tap the named place), Name it (4 choices), Capitals, Speedrun (60s of Find it).
// Widget: App.widgets.worldmap.mount(el, {region, mode, n}, done). Standalone: App.geo.open().
(function () {
  const A = window.App; if (!A) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  let loading = null;
  const load = () => window.GEO ? Promise.resolve(window.GEO) : (loading = loading || new Promise((res, rej) => { const s = document.createElement("script"); s.src = "modules/widgets/geo-data.js"; s.onload = () => res(window.GEO); s.onerror = rej; document.body.appendChild(s); }));
  const REGIONS = { world: "World", AF: "Africa", AS: "Asia", EU: "Europe", NA: "North America", SA: "South America", OC: "Oceania", US: "US states" };
  const CONT_COLOR = { AF: "#e3a33b", AS: "#d9534f", EU: "#4f8fe0", NA: "#3fb07a", SA: "#9b6ee0", OC: "#2bb3b3", AN: "#999", US: "#e0613d" };
  const store = () => A.store("geo");
  const known = () => (store().known = store().known || {});
  function items(G, region) {
    if (region === "US") return G.states;
    const base = G.countries.filter(c => c.area > 0.002 || c.cap); // skip uninhabited specks
    return region === "world" ? base : base.filter(c => c.cont === region);
  }
  function viewFor(G, region, list) {
    if (region === "world") return [0, 0, G.W, G.H];
    if (region === "US") return [0, 0, G.W, G.UH];
    const FIX = { AF: [390, 120, 310, 300], AS: [540, 25, 390, 300], EU: [430, 30, 200, 150], NA: [120, 0, 360, 280], SA: [250, 220, 170, 240], OC: [700, 190, 300, 220] };
    if (FIX[region]) return FIX[region];
    // bounding box of the bigger members, padded
    const big = list.filter(c => c.area > .05); const use = big.length ? big : list;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; use.forEach(c => { x0 = Math.min(x0, c.bb[0][0]); y0 = Math.min(y0, c.bb[0][1]); x1 = Math.max(x1, c.bb[1][0]); y1 = Math.max(y1, c.bb[1][1]); });
    if (region === "OC") { x0 = Math.max(x0, 700); } // keep the Pacific view sane
    const pad = 12; return [x0 - pad, y0 - pad, x1 - x0 + pad * 2, y1 - y0 + pad * 2];
  }
  function game(el, opts, G, done) {
    const region = opts.region || "world"; let mode = opts.mode || "find";
    const list = items(G, region), K = known();
    const vb = viewFor(G, region, list);
    const tiny = c => c.area < (region === "world" ? .6 : .12) && region !== "US";
    let q = null, picked = null, score = 0, asked = 0, endAt = 0, timer = 0, flash = null, recent = [];
    const pickQ = () => {
      // weight unknown places first, never repeat the last 10
      const pool = list.filter(c => !recent.includes(c.id) && (mode !== "cap" || c.cap));
      const unknown = pool.filter(c => !K[(region === "US" ? "us:" : "") + c.id]);
      const src = unknown.length && Math.random() < .75 ? unknown : pool;
      q = src[Math.floor(Math.random() * src.length)]; recent = [q.id, ...recent].slice(0, 10); picked = null; flash = null;
      if (mode !== "find" && mode !== "speed") {
        const near = list.filter(c => c.id !== q.id && (mode !== "cap" || c.cap)).sort((a, b) => Math.hypot(a.cx - q.cx, a.cy - q.cy) - Math.hypot(b.cx - q.cx, b.cy - q.cy)).slice(0, 8);
        const opts3 = near.sort(() => Math.random() - .5).slice(0, 3);
        q.choices = [q, ...opts3].sort(() => Math.random() - .5);
      }
    };
    const keyOf = c => (region === "US" ? "us:" : "") + c.id;
    const revealPct = () => { const all = list.length; const k = list.filter(c => K[keyOf(c)]).length; return Math.round(k / all * 100); };
    const mapSVG = () => `<svg class="geo-map" viewBox="${vb.join(" ")}" preserveAspectRatio="xMidYMid meet">
      ${region === "world" ? `<path d="${G.sphere}" class="geo-sea"/>` : ""}
      ${list.map(c => { const k = K[keyOf(c)]; const isQ = q && c.id === q.id && (mode === "name" || mode === "cap" || flash === "show"); const wrong = flash && flash.id === c.id;
        const fill = isQ ? "var(--accent)" : wrong ? "#7a2a2a" : k ? CONT_COLOR[c.cont] || "#888" : "var(--fog)";
        return `<path d="${c.d}" data-id="${c.id}" fill="${fill}" class="geo-c ${k ? "known" : ""}"/>${tiny(c) ? `<circle cx="${c.cx}" cy="${c.cy}" r="${region === "world" ? 4 : 3}" data-id="${c.id}" class="geo-dot" fill="${isQ ? "var(--accent)" : k ? CONT_COLOR[c.cont] : "var(--fog-dot)"}"/>` : ""}`; }).join("")}</svg>`;
    const draw = () => {
      const prompt = !q ? "" : mode === "find" || mode === "speed" ? `Tap <b>${esc(q.name)}</b>` : mode === "name" ? "Which place is highlighted?" : `Capital of <b>${esc(q.name)}</b>?`;
      el.innerHTML = `<div class="geo">
        <div class="geo-bar"><span>${prompt}</span><span class="geo-score">${endAt ? `<b class="live">${Math.max(0, Math.ceil((endAt - Date.now()) / 1000))}s</b> · ` : ""}${score}/${asked}</span></div>
        <div class="geo-wrap">${mapSVG()}</div>
        ${q && q.choices && (mode === "name" || mode === "cap") ? `<div class="arena-choices">${q.choices.map((c, i) => `<button data-ch="${c.id}" class="${picked == null ? "" : c.id === q.id ? "right" : c.id === picked ? "wrong" : "dim"}">${esc(mode === "cap" ? c.cap : c.name)}</button>`).join("")}</div>` : ""}
        ${flash && flash !== "show" ? `<div class="small muted" style="margin-top:6px">That was ${esc(flash.name)}. ${esc(q.name)} is highlighted.</div>` : ""}
        ${picked != null || flash ? `<button class="btn block" data-next style="margin-top:8px">Next</button>` : ""}
        <div class="small muted" style="margin-top:8px">${REGIONS[region]} revealed: <b>${revealPct()}%</b> · ${list.filter(c => K[keyOf(c)]).length} of ${list.length}</div></div>`;
    };
    const right = c => { score++; K[keyOf(c)] = (K[keyOf(c)] || 0) + 1; A.save(); };
    const next = () => { if (opts.n && asked >= opts.n) { if (done) done({ correct: score / asked >= .7, score: score / asked }); el.innerHTML = `<div class="win">${score}/${asked} right.</div>`; return; } pickQ(); draw(); };
    el.onclick = e => {
      if (e.target.closest("[data-next]")) return next();
      const ch = e.target.closest("[data-ch]"); if (ch && picked == null) { picked = ch.dataset.ch; asked++; if (picked === q.id) right(q); draw(); return; }
      const t = e.target.closest("[data-id]"); if (!t || !(mode === "find" || mode === "speed") || flash) return;
      const c = list.find(x => x.id === t.dataset.id); asked++;
      if (c.id === q.id) { right(c); A.toast && A.toast("✓ " + c.name); if (mode === "speed") { pickQ(); draw(); } else next(); }
      else { flash = c; draw(); setTimeout(() => { if (flash === c) { flash = "show"; draw(); } }, 700); if (mode === "speed") setTimeout(() => { pickQ(); draw(); }, 1300); }
    };
    if (mode === "speed") { endAt = Date.now() + 60000; timer = setInterval(() => { const l = Math.ceil((endAt - Date.now()) / 1000); const b = el.querySelector(".geo-score .live"); if (b) b.textContent = Math.max(0, l) + "s"; if (l <= 0) { clearInterval(timer); const s = store(); s.best = s.best || {}; const k = region + ":speed"; const pb = !(s.best[k] >= score); if (pb) s.best[k] = score; A.xp && A.xp.award("geo:speed:" + new Date().toISOString().slice(0, 10), Math.min(25, 5 + score), "mind"); A.save(); el.innerHTML = `<div class="geo"><div class="fs-body center"><div class="huge" style="font-size:80px">${score}</div><p>${pb ? "New best for " + REGIONS[region] + "!" : "Best: " + s.best[k]}</p></div></div>`; if (done) done({ graded: false }); } }, 250);
      const obs = new MutationObserver(() => { if (!document.body.contains(el)) { clearInterval(timer); obs.disconnect(); } }); obs.observe(document.body, { childList: true, subtree: true }); }
    pickQ(); draw();
  }
  function mount(el, opts = {}, done) { el.innerHTML = `<p class="small muted">Loading map…</p>`; load().then(G => game(el, opts, G, done)).catch(() => { el.innerHTML = `<p class="small muted">Map failed to load.</p>`; }); }
  function open() {
    const kit = window.Features && window.Features._kit; if (!kit) return;
    const { el, close } = kit.overlay(() => {});
    const s = store(); let region = s.region || "world", mode = s.mode || "find";
    const draw = () => {
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span class="muted small">Geography</span></div>
        <div class="fs-body" style="padding-top:0;justify-content:flex-start"><h1 style="margin:0 0 6px">World map</h1>
        <p class="small muted" style="margin:0 0 8px">The map starts in fog. Every place you get right lights up for good.</p>
        <div class="chips" style="margin-bottom:8px">${Object.entries(REGIONS).map(([k, l]) => `<button class="chip ${k === region ? "on" : ""}" data-rg="${k}">${l}</button>`).join("")}</div>
        <div class="subtabs" style="position:static;margin:0 0 10px">${[["find", "Find it"], ["name", "Name it"], ["cap", "Capitals"], ["speed", "Speedrun"]].map(([k, l]) => `<button class="${k === mode ? "on" : ""}" data-md="${k}">${l}</button>`).join("")}</div>
        <div data-geo></div></div>`;
      mount(el.querySelector("[data-geo]"), { region, mode });
    };
    el.addEventListener("click", e => {
      if (e.target.closest("[data-x]")) return close();
      const r = e.target.closest("[data-rg]"); if (r) { region = s.region = r.dataset.rg; A.save(); draw(); }
      const m = e.target.closest("[data-md]"); if (m) { mode = s.mode = m.dataset.md; A.save(); draw(); }
    });
    draw();
  }
  A.widgets = A.widgets || {}; A.widgets.worldmap = { mount };
  A.geo = { open, load };
})();
