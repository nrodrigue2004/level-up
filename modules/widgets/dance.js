// Dance rhythm trainer: metronome + count-in + spoken step cues + tap-the-beat scoring.
// Widget: App.widgets.rhythm.mount(el, {bpm, bars, routine, tap}, done). Standalone: App.dance.open().
(function () {
  const A = window.App; if (!A) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  // Each routine: phrases of 8 counts (or 4) with a cue said on count 1. Steps written from scratch.
  const ROUTINES = {
    bounce: { name: "Groove bounce", bpm: 88, level: "Start here", about: "Knees soft, drop on every beat. This is the base of almost every party dance.", phrases: [
      ["Down bounce, knees soft", 8], ["Same bounce, add your shoulders", 8], ["Up bounce: rise on the beat", 8], ["Mix: down, up, down, up", 8]] },
    isolate: { name: "Isolations", bpm: 84, level: "Loosen up", about: "Move one part at a time. This fixes the stiff feeling fast.", phrases: [
      ["Head: right, center, left, center", 8], ["Shoulders: up and down", 8], ["Chest: push forward, pull back", 8], ["Hips: side to side", 8], ["Ribs: slide right, slide left", 8]] },
    twostep: { name: "Two-step", bpm: 96, level: "Easy", about: "Step right, close left. Step left, close right. Add a little bounce and arms.", phrases: [
      ["Step right, close left, step left, close right", 8], ["Same, now add arms", 8], ["Same, now turn a quarter every eight", 8], ["Freestyle the arms", 8]] },
    cupid: { name: "Cupid Shuffle steps", bpm: 72, level: "Line dance", about: "The classic Louisiana line dance. 32 counts, then you face a new wall.", phrases: [
      ["Four shuffles to the right", 8], ["Four shuffles to the left", 8], ["Kick right, kick left, four times", 8], ["Walk it out and turn a quarter left", 8]] },
    slide: { name: "Electric Slide steps", bpm: 96, level: "Line dance", about: "18-count wedding favorite. Grapevines, step back, rock, turn.", phrases: [
      ["Grapevine right, touch", 4], ["Grapevine left, touch", 4], ["Step back three, touch", 4], ["Rock forward, rock back, then turn left with a brush", 6]] },
    rolls: { name: "Body roll drill", bpm: 72, level: "Hip-hop", about: "Chest, stomach, hips, in a wave. Slow first, then on the beat.", phrases: [
      ["Chest forward", 4], ["Stomach forward", 4], ["Hips forward", 4], ["Full roll, two counts each", 8], ["Full roll, one per beat", 8]] },
  };
  let ctx = null;
  const ac = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; };
  const click = (t, strong) => { const c = ac(), o = c.createOscillator(), g = c.createGain(); o.frequency.value = strong ? 1500 : 1000; g.gain.setValueAtTime(strong ? .35 : .2, t); g.gain.exponentialRampToValueAtTime(.001, t + .06); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .07); };
  const say = (txt, rate = 1.05) => { try { const u = new SpeechSynthesisUtterance(txt); u.rate = rate; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch {} };
  function rhythm(el, opts = {}, done) {
    const R = ROUTINES[opts.routine] || null;
    let bpm = opts.bpm || (R ? R.bpm : 90), running = false, timer = 0, beatTimes = [], taps = [], startT = 0, beat = -1, speedPct = 100;
    const plan = R ? R.phrases.flatMap(([cue, n]) => Array.from({ length: n }, (_, i) => i === 0 ? cue : null)) : Array.from({ length: (opts.bars || 8) * 4 }, () => null);
    const draw = () => {
      el.innerHTML = `<div class="mus dance">${R ? `<div class="mus-prompt">${esc(R.name)} <span class="small muted">· ${esc(R.level)}</span></div><p class="small muted" style="margin:0 0 10px">${esc(R.about)}</p>` : ""}
        <div class="beat-ring"><div class="beat-dot"></div><div class="beat-count">${running ? "" : "Ready"}</div></div>
        <div class="beat-cue">${R ? esc(R.phrases[0][0]) : "Tap the pad on every beat"}</div>
        <button class="tap-pad" data-tap>TAP ON THE BEAT</button>
        <div class="row mus-row"><button class="btn ghost small" data-bpm="-6">Slower</button><span class="grow" style="text-align:center;font-family:var(--display);font-size:20px">${Math.round(bpm * speedPct / 100)} BPM</span><button class="btn ghost small" data-bpm="6">Faster</button></div>
        <button class="btn block" data-go style="margin-top:10px">${running ? "Stop" : "Start with a count-in"}</button>
        <div class="small muted beat-score" style="margin-top:8px;text-align:center"></div></div>`;
    };
    const ui = () => ({ dot: el.querySelector(".beat-dot"), cnt: el.querySelector(".beat-count"), cue: el.querySelector(".beat-cue"), score: el.querySelector(".beat-score") });
    function stop(finished) {
      running = false; clearInterval(timer);
      const s = scoreTaps();
      draw(); if (s) ui().score.innerHTML = s.html;
      if (finished && done) done(s ? { correct: s.acc >= .7, score: s.acc } : { graded: false });
    }
    function scoreTaps() {
      if (taps.length < 4) return null;
      const offs = taps.map(t => { let best = Infinity; for (const b of beatTimes) { const d = t - b; if (Math.abs(d) < Math.abs(best)) best = d; } return best * 1000; });
      const good = offs.filter(o => Math.abs(o) < 120).length, acc = good / Math.max(taps.length, 1), mean = offs.reduce((a, b) => a + b, 0) / offs.length;
      return { acc, html: `<b>${Math.round(acc * 100)}% on the beat</b> · you were ${Math.abs(mean) < 25 ? "right in the pocket" : mean < 0 ? `${Math.round(-mean)} ms early on average` : `${Math.round(mean)} ms late on average`}` };
    }
    function go() {
      const c = ac(); running = true; taps = []; beatTimes = []; beat = -1; draw();
      const spb = 60 / (bpm * speedPct / 100), lead = .15; startT = c.currentTime + lead;
      const total = 8 + plan.length; // 8-count count-in
      for (let i = 0; i < total; i++) { const t = startT + i * spb; click(t, i % 4 === 0); if (i >= 8) beatTimes.push(t); }
      ["5", "6", "7", "8"].forEach((n, i) => setTimeout(() => running && say(n, 1.3), (lead + (4 + i) * spb) * 1000 - 120));
      timer = setInterval(() => {
        const now = c.currentTime, i = Math.floor((now - startT) / spb); if (i === beat) return; beat = i;
        if (i >= total) return stop(true);
        const u = ui(); if (!u.dot) return;
        u.dot.classList.remove("hit"); void u.dot.offsetWidth; u.dot.classList.add("hit");
        if (i < 8) { u.cnt.textContent = i < 4 ? "…" : String(i + 1); return; }
        const k = i - 8; u.cnt.textContent = String((k % 8) + 1);
        if (plan[k]) { u.cue.textContent = plan[k]; say(plan[k]); }
      }, 15);
    }
    el.onpointerdown = e => { if (e.target.closest("[data-tap]") && running) { e.preventDefault(); taps.push(ac().currentTime); const p = e.target.closest("[data-tap]"); p.classList.remove("hit"); void p.offsetWidth; p.classList.add("hit"); } };
    el.onclick = e => {
      if (e.target.closest("[data-go]")) { running ? stop(false) : go(); }
      const b = e.target.closest("[data-bpm]"); if (b && !running) { bpm = Math.max(50, Math.min(140, bpm + +b.dataset.bpm)); draw(); }
    };
    draw();
    const obs = new MutationObserver(() => { if (!document.body.contains(el)) { running = false; clearInterval(timer); obs.disconnect(); } }); obs.observe(document.body, { childList: true, subtree: true });
  }
  function open(start) {
    const kit = window.Features && window.Features._kit; if (!kit) return;
    const { el, close } = kit.overlay(() => {});
    let cur = start && ROUTINES[start] ? start : "bounce";
    const draw = () => {
      el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span class="muted small">Dance practice</span></div>
        <div class="fs-body" style="padding-top:0"><h1 style="margin:0 0 8px">Dance practice</h1>
        <div class="chips" style="margin-bottom:12px">${Object.entries(ROUTINES).map(([k, r]) => `<button class="chip ${k === cur ? "on" : ""}" data-r="${k}">${esc(r.name)}</button>`).join("")}</div>
        <div data-tool></div><p class="small muted" style="margin-top:14px">Practice the steps here with the clicks, then put on the real song. Phone on the floor, volume up.</p></div>`;
      rhythm(el.querySelector("[data-tool]"), { routine: cur }, r => { if (r && r.correct) A.xp && A.xp.award("dance:" + cur + ":" + new Date().toISOString().slice(0, 10), 10, "spirit"); });
    };
    el.addEventListener("click", e => { if (e.target.closest("[data-x]")) { try { speechSynthesis.cancel(); } catch {} return close(); } const r = e.target.closest("[data-r]"); if (r) { cur = r.dataset.r; draw(); } });
    draw();
  }
  A.widgets = A.widgets || {}; A.widgets.rhythm = { mount: rhythm };
  A.dance = { open, routines: ROUTINES };
})();
