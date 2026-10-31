// Music tools: piano keyboard, guitar fretboard, mic tuner. Free, offline, WebAudio only.
// Lesson widgets: App.widgets.piano / fretboard / tuner. Standalone: App.music.open("piano" | "guitar" | "tuner").
(function () {
  const A = window.App; if (!A) return;
  const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const FLAT = { "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };
  const midiOf = n => { const m = /^([A-G]#?|[A-G]b)(-?\d)$/.exec(n); if (!m) return null; let p = m[1]; const fl = Object.entries(FLAT).find(([s, f]) => f === p); if (fl) p = fl[0]; return NAMES.indexOf(p) + (+m[2] + 1) * 12; };
  const nameOf = m => NAMES[m % 12] + (Math.floor(m / 12) - 1);
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);
  let ctx = null;
  const ac = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; };
  function pianoNote(m, dur = 1.6) {
    const c = ac(), t = c.currentTime, f = freq(m), g = c.createGain(); g.connect(c.destination);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.32, t + .008); g.gain.exponentialRampToValueAtTime(.12, t + .25); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    [[1, "triangle", 1], [2, "sine", .35], [3, "sine", .12], [4, "sine", .06]].forEach(([h, type, v]) => { const o = c.createOscillator(), og = c.createGain(); o.type = type; o.frequency.value = f * h; og.gain.value = v; o.connect(og); og.connect(g); o.start(t); o.stop(t + dur); });
  }
  const pluckCache = {};
  function pluck(m, dur = 2.2) { // Karplus-Strong string, rendered once per note
    const c = ac();
    let buf = pluckCache[m];
    if (!buf) {
      const sr = c.sampleRate, len = Math.floor(sr * dur), N = Math.round(sr / freq(m)); buf = c.createBuffer(1, len, sr); const d = buf.getChannelData(0);
      const ring = new Float32Array(N); for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;
      let idx = 0; for (let i = 0; i < len; i++) { const nx = (idx + 1) % N; const v = .996 * .5 * (ring[idx] + ring[nx]); d[i] = ring[idx]; ring[idx] = v; idx = nx; }
      pluckCache[m] = buf;
    }
    const s = c.createBufferSource(), g = c.createGain(); g.gain.value = .5; s.buffer = buf; s.connect(g); g.connect(c.destination); s.start();
  }
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  // ---------- chords ----------
  const CHORD_TYPES = { "": [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], sus2: [0, 2, 7], sus4: [0, 5, 7], dim: [0, 3, 6], 5: [0, 7] };
  function chordNotes(sym, oct = 3) { const m = /^([A-G][#b]?)(.*)$/.exec(sym); if (!m) return []; const root = midiOf(m[1] + oct); const iv = CHORD_TYPES[m[2]]; return iv ? iv.map(i => root + i) : []; }
  // Open guitar shapes: string 6 (low E) -> 1 (high E); -1 = muted
  const SHAPES = { C: [-1, 3, 2, 0, 1, 0], G: [3, 2, 0, 0, 0, 3], D: [-1, -1, 0, 2, 3, 2], A: [-1, 0, 2, 2, 2, 0], E: [0, 2, 2, 1, 0, 0], Am: [-1, 0, 2, 2, 1, 0], Em: [0, 2, 2, 0, 0, 0], Dm: [-1, -1, 0, 2, 3, 1], F: [1, 3, 3, 2, 1, 1], A7: [-1, 0, 2, 0, 2, 0], D7: [-1, -1, 0, 2, 1, 2], E7: [0, 2, 0, 1, 0, 0], G7: [3, 2, 0, 0, 0, 1], C7: [-1, 3, 2, 3, 1, 0], B7: [-1, 2, 1, 2, 0, 2], E5: [0, 2, 2, -1, -1, -1], A5: [-1, 0, 2, 2, -1, -1] };
  const TUNING = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
  // ---------- piano ----------
  function piano(el, opts = {}, done) {
    const lo = midiOf(opts.from || "C3"), hi = midiOf(opts.to || "B4");
    const target = (opts.target || (opts.chord ? chordNotes(opts.chord).map(nameOf) : [])).map(midiOf);
    const show = new Set((opts.highlight || (opts.chord ? chordNotes(opts.chord).map(nameOf) : [])).map(midiOf));
    let played = [], labels = opts.labels !== false;
    const whites = []; for (let m = lo; m <= hi; m++) if (!NAMES[m % 12].includes("#")) whites.push(m);
    const draw = () => {
      const w = 100 / whites.length;
      el.innerHTML = `<div class="mus">${opts.prompt ? `<div class="mus-prompt">${esc(opts.prompt)}</div>` : ""}
        <div class="piano" style="--n:${whites.length}">${whites.map((m, i) => `<button class="pk w ${show.has(m) ? "hl" : ""} ${played.includes(m) ? "on" : ""}" data-m="${m}" style="left:${i * w}%;width:${w}%">${labels ? `<span>${NAMES[m % 12]}${m % 12 === 0 ? Math.floor(m / 12) - 1 : ""}</span>` : ""}</button>`).join("")}
        ${whites.map((m, i) => NAMES[(m + 1) % 12].includes("#") && m + 1 <= hi ? `<button class="pk b ${show.has(m + 1) ? "hl" : ""} ${played.includes(m + 1) ? "on" : ""}" data-m="${m + 1}" style="left:${(i + 1) * w - w * .32}%;width:${w * .64}%"></button>` : "").join("")}</div>
        <div class="row mus-row"><span class="small muted grow">${played.length ? "Played: " + played.slice(-8).map(m => NAMES[m % 12]).join(" ") : target.length ? "Tap the keys." : "Tap any key. Highlighted keys are the ones to learn."}</span>
        <button class="btn ghost small" data-lbl>${labels ? "Hide" : "Show"} names</button>${show.size ? `<button class="btn small" data-hear>Hear it</button>` : ""}</div></div>`;
    };
    const check = () => {
      if (!target.length || !done) return;
      const ok = opts.ordered ? target.every((m, i) => played[played.length - target.length + i] === m) : target.every(m => played.slice(-Math.max(target.length, 6)).some(p => p % 12 === m % 12));
      if (ok) { done({ correct: true }); A.toast && A.toast("Nice. That's it."); played = []; }
    };
    el.onpointerdown = e => { const k = e.target.closest("[data-m]"); if (!k) return; e.preventDefault(); const m = +k.dataset.m; pianoNote(m); played.push(m); draw(); check(); };
    el.onclick = e => {
      if (e.target.closest("[data-lbl]")) { labels = !labels; draw(); }
      if (e.target.closest("[data-hear]")) { const ns = [...show].sort((a, b) => a - b); if (opts.ordered) ns.forEach((m, i) => setTimeout(() => pianoNote(m), i * 380)); else { ns.forEach((m, i) => setTimeout(() => pianoNote(m), i * 140)); setTimeout(() => ns.forEach(m => pianoNote(m)), ns.length * 140 + 300); } }
    };
    draw(); if (!target.length && done) done({ graded: false });
  }
  // ---------- fretboard ----------
  function fretboard(el, opts = {}, done) {
    const frets = opts.frets || 12;
    const shape = opts.chord && SHAPES[opts.chord] ? SHAPES[opts.chord] : null;
    const findNote = opts.find ? NAMES.indexOf(opts.find) : -1; // quiz: tap every X on the neck
    const foundSet = new Set(); let total = 0;
    if (findNote >= 0) for (let s = 0; s < 6; s++) for (let f = 0; f <= frets; f++) if ((TUNING[s] + f) % 12 === findNote) total++;
    let labels = !!opts.labels;
    const draw = () => {
      const strings = [5, 4, 3, 2, 1, 0]; // high E on top, like tab
      el.innerHTML = `<div class="mus">${opts.prompt ? `<div class="mus-prompt">${esc(opts.prompt)}</div>` : ""}
        <div class="fb-wrap"><div class="fb" style="--f:${frets + 1}">
        ${strings.map(s => `<div class="fb-str">${Array.from({ length: frets + 1 }, (_, f) => { const m = TUNING[s] + f; const isShape = shape && shape[s] === f; const muted = shape && shape[s] === -1 && f === 0; const found = foundSet.has(s + ":" + f);
          return `<button class="fb-c ${f === 0 ? "open" : ""} ${isShape ? "hl" : ""} ${found ? "ok" : ""}" data-s="${s}" data-f="${f}">${muted ? "×" : isShape || found || labels ? `<i>${NAMES[m % 12]}</i>` : ""}</button>`; }).join("")}</div>`).join("")}
        <div class="fb-num">${Array.from({ length: frets + 1 }, (_, f) => `<span>${[3, 5, 7, 9, 12, 15].includes(f) ? f : ""}</span>`).join("")}</div></div></div>
        <div class="row mus-row"><span class="small muted grow">${findNote >= 0 ? `Find every ${NAMES[findNote]}: ${foundSet.size}/${total}` : shape ? `${esc(opts.chord)} chord. Numbers are frets; × means don't play that string.` : "Tap a fret to hear it. Strings top to bottom: e B G D A E."}</span>
        <button class="btn ghost small" data-lbl>${labels ? "Hide" : "Show"} notes</button>${shape ? `<button class="btn small" data-strum>Strum</button>` : ""}</div></div>`;
    };
    el.onpointerdown = e => { const c = e.target.closest("[data-s]"); if (!c) return; e.preventDefault(); const s = +c.dataset.s, f = +c.dataset.f, m = TUNING[s] + f; pluck(m);
      if (findNote >= 0) { if (m % 12 === findNote) { foundSet.add(s + ":" + f); if (foundSet.size === total && done) { done({ correct: true }); A.toast && A.toast("Found them all"); } } else { A.toast && A.toast(`That's ${NAMES[m % 12]}`); } draw(); } };
    el.onclick = e => { if (e.target.closest("[data-lbl]")) { labels = !labels; draw(); } if (e.target.closest("[data-strum]")) shape.forEach((f, s) => { if (f >= 0) setTimeout(() => pluck(TUNING[s] + f), s * 45); }); };
    draw(); if (findNote < 0 && done) done({ graded: false });
  }
  // ---------- tuner ----------
  function tuner(el, opts = {}, done) {
    let stream = null, raf = 0, an = null, buf = null, alive = true;
    el.innerHTML = `<div class="mus tuner"><div class="tn-note">–</div><div class="tn-meter"><div class="tn-needle"></div><span class="tn-mid"></span></div><div class="tn-hz small muted">Uses your mic. Nothing is recorded or sent anywhere.</div>
      <div class="chips" style="justify-content:center;margin-top:10px">${["E2", "A2", "D3", "G3", "B3", "E4"].map(n => `<button class="chip" data-ref="${n}">${n.replace(/\d/, "")}<small>${n.slice(-1)}</small></button>`).join("")}</div>
      <button class="btn block" data-mic style="margin-top:12px">Start tuner</button></div>`;
    const noteEl = el.querySelector(".tn-note"), needle = el.querySelector(".tn-needle"), hz = el.querySelector(".tn-hz");
    function detect() {
      if (!alive) return; an.getFloatTimeDomainData(buf);
      let rms = 0; for (const v of buf) rms += v * v; rms = Math.sqrt(rms / buf.length);
      if (rms > .01) {
        const sr = ctx.sampleRate, n = buf.length; let best = -1, bestC = 0; const minL = Math.floor(sr / 1200), maxL = Math.floor(sr / 60);
        let prev = 1;
        for (let l = minL; l < maxL; l++) { let c = 0; for (let i = 0; i < n - l; i++) c += buf[i] * buf[i + l]; c /= (n - l); if (c > bestC && c > prev) { bestC = c; best = l; } prev = c; }
        if (best > 0) { const f = sr / best; const mf = 69 + 12 * Math.log2(f / 440), m = Math.round(mf), cents = Math.round((mf - m) * 100);
          noteEl.textContent = NAMES[(m % 12 + 12) % 12]; noteEl.className = "tn-note " + (Math.abs(cents) <= 5 ? "ok" : ""); needle.style.transform = `rotate(${Math.max(-50, Math.min(50, cents)) * .9}deg)`; hz.textContent = `${f.toFixed(1)} Hz · ${cents > 0 ? "+" : ""}${cents} cents ${Math.abs(cents) <= 5 ? "· in tune" : cents < 0 ? "· tune up" : "· tune down"}`;
          if (Math.abs(cents) <= 5 && done && opts.goal && nameOf(m) === opts.goal) { done({ correct: true }); } }
      }
      raf = requestAnimationFrame(detect);
    }
    el.onclick = async e => {
      const r = e.target.closest("[data-ref]"); if (r) { pluck(midiOf(r.dataset.ref), 3); return; }
      if (e.target.closest("[data-mic]")) {
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); const c = ac(); const src = c.createMediaStreamSource(stream); an = c.createAnalyser(); an.fftSize = 2048; buf = new Float32Array(an.fftSize); src.connect(an); e.target.closest("[data-mic]").remove(); detect(); }
        catch { hz.textContent = "Mic blocked. Allow microphone access for this app in Settings."; }
      }
    };
    const obs = new MutationObserver(() => { if (!document.body.contains(el)) { alive = false; cancelAnimationFrame(raf); stream && stream.getTracks().forEach(t => t.stop()); obs.disconnect(); } });
    obs.observe(document.body, { childList: true, subtree: true });
    if (!opts.goal && done) done({ graded: false });
  }
  function open(which = "piano") {
    const kit = window.Features && window.Features._kit; if (!kit) return;
    const { el, close } = kit.overlay(() => {});
    const draw = () => {
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span class="muted small">Music room</span></div>
        <div class="fs-body" style="padding-top:0;justify-content:flex-start"><h1 style="margin:0 0 8px">Music room</h1>
        <div class="subtabs" style="position:static;margin:0 0 12px">${[["piano", "Piano"], ["guitar", "Guitar"], ["tuner", "Tuner"]].map(([k, l]) => `<button class="${k === which ? "on" : ""}" data-mt="${k}">${l}</button>`).join("")}</div>
        ${which === "guitar" ? `<div class="chips" style="margin-bottom:10px">${Object.keys(SHAPES).map(c => `<button class="chip" data-ch="${c}">${c}</button>`).join("")}</div>` : which === "piano" ? `<div class="chips" style="margin-bottom:10px">${["C", "G", "D", "A", "E", "F", "Am", "Em", "Dm", "Cmaj7", "G7"].map(c => `<button class="chip" data-pc="${c}">${c}</button>`).join("")}</div>` : ""}
        <div data-tool></div></div>`;
      const host = el.querySelector("[data-tool]");
      if (which === "piano") piano(host, {}); else if (which === "guitar") fretboard(host, {}); else tuner(host, {});
    };
    el.addEventListener("click", e => {
      if (e.target.closest("[data-x]")) return close();
      const t = e.target.closest("[data-mt]"); if (t) { which = t.dataset.mt; draw(); }
      const ch = e.target.closest("[data-ch]"); if (ch) { fretboard(el.querySelector("[data-tool]"), { chord: ch.dataset.ch, frets: 5 }); }
      const pc = e.target.closest("[data-pc]"); if (pc) { piano(el.querySelector("[data-tool]"), { chord: pc.dataset.pc }); }
    });
    draw();
  }
  A.widgets = A.widgets || {};
  A.widgets.piano = { mount: piano }; A.widgets.fretboard = { mount: fretboard }; A.widgets.tuner = { mount: tuner };
  A.music = { open, pianoNote, pluck, chordNotes, SHAPES };
})();
