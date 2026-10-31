// MMA / BJJ position map: every technique is a path from one situation to another.
// Standalone screen (App.mmaMap.open(startId)) and a lesson widget (App.widgets.posmap).
(function () {
  const A = window.App; if (!A) return;
  // Positions. x/y are layout coords on a 340x440 board.
  const P = {
    standing:  { name: "Standing", x: 170, y: 28, about: "Both fighters on the feet. Striking range, clinch range, or shooting for a takedown." },
    clinch:    { name: "Clinch", x: 300, y: 95, about: "Chest to chest, fighting for underhooks and head position. Knees, elbows, trips, and throws live here." },
    cage:      { name: "Against the cage", x: 42, y: 95, about: "One fighter pinned on the fence. Top wants takedowns and dirty boxing; bottom wants to circle off or reverse." },
    guard:     { name: "Closed guard", x: 170, y: 165, about: "Bottom fighter's legs locked around the top fighter's waist. Bottom attacks with sweeps and subs; top postures and opens the legs to pass." },
    halfguard: { name: "Half guard", x: 52, y: 245, about: "Bottom fighter traps one leg. Bottom fights for the underhook to sweep or take the back; top crossfaces and flattens to pass." },
    butterfly: { name: "Butterfly guard", x: 292, y: 245, about: "Bottom fighter seated with hooks inside the thighs. Great for elevating sweeps and getting back up." },
    side:      { name: "Side control", x: 170, y: 290, about: "Top fighter chest to chest across the opponent. Heavy pressure, strikes, and transitions to mount or north-south." },
    knee:      { name: "Knee on belly", x: 298, y: 365, about: "Top fighter's knee pins the stomach. Mobile and painful; sets up armbars and mount." },
    northsouth:{ name: "North-south", x: 42, y: 365, about: "Top fighter's chest on the opponent's chest, head to legs. Kimuras and chokes." },
    mount:     { name: "Mount", x: 170, y: 405, about: "Top fighter sitting on the torso. The best ground-and-pound position in MMA." },
    turtle:    { name: "Turtle", x: 298, y: 480, about: "Bottom fighter on knees and elbows, protecting the neck. Top hunts the back or front headlock." },
    back:      { name: "Back control", x: 70, y: 480, about: "Hooks in from behind. The most dominant position: rear-naked choke heaven." },
  };
  // [from, to, name, kind, who] who = "top" (attacker on top / in front) or "bottom"
  const E = [
    ["standing","guard","Double-leg takedown","takedown","top"],["standing","side","Single-leg to side control","takedown","top"],
    ["standing","clinch","Close distance, pummel underhooks","transition","top"],["standing","cage","Push opponent to the fence","transition","top"],
    ["clinch","side","Body lock trip","takedown","top"],["clinch","standing","Frame and break the clinch","escape","bottom"],["clinch","standing","Knee to the body, then exit","strike","top"],
    ["clinch","back","Arm drag to the back","transition","top"],["cage","guard","Double leg on the fence","takedown","top"],["cage","standing","Underhook and circle off","escape","bottom"],
    ["guard","mount","Hip-bump sweep","sweep","bottom"],["guard","mount","Scissor sweep","sweep","bottom"],["guard","standing","Technical stand-up","escape","bottom"],
    ["guard","back","Arm drag to the back","transition","bottom"],["guard","standing","Triangle choke","submission","bottom"],["guard","standing","Armbar","submission","bottom"],
    ["guard","standing","Kimura","submission","bottom"],["guard","standing","Guillotine","submission","bottom"],
    ["guard","halfguard","Stand and break the guard, pass one leg","pass","top"],["guard","side","Knee-cut after opening the guard","pass","top"],
    ["halfguard","side","Crossface and knee slice","pass","top"],["halfguard","mount","Free the leg, step to mount","pass","top"],
    ["halfguard","back","Underhook to the back take","transition","bottom"],["halfguard","side","Old-school sweep, come up on top","sweep","bottom"],["halfguard","guard","Recover full guard","escape","bottom"],
    ["butterfly","mount","Butterfly hook sweep","sweep","bottom"],["butterfly","standing","Wrestle up","escape","bottom"],["butterfly","side","Smash pass","pass","top"],
    ["side","mount","Knee slide to mount","transition","top"],["side","knee","Pop to knee on belly","transition","top"],["side","northsouth","Walk around to north-south","transition","top"],
    ["side","guard","Shrimp and recover guard","escape","bottom"],["side","turtle","Turn to turtle","escape","bottom"],["side","standing","Americana","submission","top"],["side","standing","Kimura","submission","top"],
    ["knee","mount","Slide the knee across","transition","top"],["knee","standing","Far-side armbar","submission","top"],["knee","side","Opponent pushes the knee; drop back to side","transition","top"],
    ["northsouth","side","Swing back to side control","transition","top"],["northsouth","standing","North-south choke","submission","top"],["northsouth","standing","Kimura","submission","top"],
    ["mount","back","Opponent turns: take the back","transition","top"],["mount","standing","Armbar from mount","submission","top"],["mount","standing","Arm triangle","submission","top"],["mount","standing","Ground and pound finish","strike","top"],
    ["mount","guard","Upa (bridge and roll)","escape","bottom"],["mount","halfguard","Elbow-knee escape","escape","bottom"],
    ["turtle","back","Seatbelt and hooks","transition","top"],["turtle","standing","Front headlock to guillotine","submission","top"],["turtle","guard","Sit out and recover guard","escape","bottom"],["turtle","standing","Granby roll, stand up","escape","bottom"],
    ["back","standing","Rear-naked choke","submission","top"],["back","mount","Opponent escapes to back; go to mount","transition","top"],["back","guard","Escape: hip to the side, turn in","escape","bottom"],
  ];
  // After these moves you end up on top / attacking, so the map flips your perspective.
  const FLIP = new Set(["Hip-bump sweep","Scissor sweep","Butterfly hook sweep","Old-school sweep, come up on top","Upa (bridge and roll)","Arm drag to the back","Underhook to the back take","Technical stand-up","Wrestle up","Granby roll, stand up"]);
  const KIND = { takedown: ["Takedown", "var(--st-str)"], sweep: ["Sweep", "var(--st-tech)"], pass: ["Pass", "var(--st-mind)"], submission: ["Submission", "var(--accent)"], escape: ["Escape", "var(--st-spirit)"], transition: ["Transition", "var(--st-discipline)"], strike: ["Strike", "var(--gold)"] };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function render(host, state, onPick) {
    const cur = state.at, who = state.who;
    const out = E.filter(e => e[0] === cur && e[4] === who), inn = E.filter(e => e[1] === cur && e[1] !== e[0]);
    const lines = E.map(e => { const a = P[e[0]], b = P[e[1]]; const hot = e[0] === cur && e[4] === who; return e[1] === "standing" && e[3] === "submission" ? "" : `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${hot ? KIND[e[3]][1] : "var(--line-2)"}" stroke-width="${hot ? 2.5 : 1}" opacity="${hot ? 1 : .7}"/>`; }).join("");
    const nodes = Object.entries(P).map(([id, p]) => `<g data-pos="${id}" style="cursor:pointer"><circle cx="${p.x}" cy="${p.y}" r="${id === cur ? 15 : 10}" fill="${id === cur ? "var(--accent)" : "var(--card)"}" stroke="${id === cur ? "var(--accent)" : "var(--line-2)"}" stroke-width="2"/><text x="${p.x}" y="${p.y + 27}" paint-order="stroke" stroke="var(--bg)" stroke-width="4" text-anchor="middle" font-size="11.5" font-family="var(--display)" font-weight="700" letter-spacing=".04em" fill="${id === cur ? "var(--ink)" : "var(--muted)"}" style="text-transform:uppercase">${esc(p.name)}</text></g>`).join("");
    const groups = {}; out.forEach(e => (groups[e[3]] = groups[e[3]] || []).push(e));
    host.innerHTML = `<div class="pm">
      <div class="seg pm-who"><button class="${who === "top" ? "on" : ""}" data-who="top">I'm on top / attacking</button><button class="${who === "bottom" ? "on" : ""}" data-who="bottom">I'm on bottom / defending</button></div>
      <svg viewBox="0 0 340 515" class="pm-board" role="img" aria-label="Position map">${lines}${nodes}</svg>
      <div class="card pm-panel"><h2>${esc(P[cur].name)} <span class="right">${who === "top" ? "Top" : "Bottom"}</span></h2>
        <p class="small muted" style="margin:0 0 10px">${esc(P[cur].about)}</p>
        ${Object.keys(groups).length ? Object.entries(groups).map(([k, list]) => `<div class="pm-kind" style="--k:${KIND[k][1]}">${KIND[k][0]}s</div>${list.map(e => `<button class="pm-move" data-name="${esc(e[2])}" data-go="${e[1]}" data-sub="${e[3] === "submission" ? 1 : ""}"><span>${esc(e[2])}</span><small>${e[3] === "submission" ? "Fight over" : "→ " + esc(P[e[1]].name)}</small></button>`).join("")}`).join("") : `<p class="small muted">Nothing mapped from this side yet. Flip the perspective above.</p>`}
        ${inn.length ? `<div class="pm-kind" style="--k:var(--muted)">How you get here</div><div class="small muted">${[...new Set(inn.map(e => `${esc(e[2])} (from ${esc(P[e[0]].name)})`))].slice(0, 6).join(" · ")}</div>` : ""}
      </div>
      ${state.trail.length > 1 ? `<div class="pm-trail small muted">Your chain: ${state.trail.map(t => esc(P[t].name)).join(" → ")}</div>` : ""}
    </div>`;
    host.onclick = e => {
      const w = e.target.closest("[data-who]"); if (w) { state.who = w.dataset.who; return render(host, state, onPick); }
      const p = e.target.closest("[data-pos]"); if (p) { state.at = p.dataset.pos; state.trail.push(state.at); return render(host, state, onPick); }
      const g = e.target.closest("[data-go]"); if (g) { if (g.dataset.sub) { A.toast && A.toast("Tap, tap. Fight over."); if (onPick) onPick(g.dataset.go, true); return; } state.at = g.dataset.go; state.trail.push(state.at); if (state.who === "bottom" && FLIP.has(g.dataset.name)) { state.who = "top"; A.toast && A.toast("You came out on top"); } if (onPick) onPick(state.at); render(host, state, onPick); }
    };
  }
  function open(start) {
    const kit = window.Features && window.Features._kit; if (!kit) return;
    const { el, close } = kit.overlay(() => {});
    el.innerHTML = `<div class="fs-top"><button class="icon-btn" data-x>✕</button><span class="muted small">Position map</span></div><div class="fs-body" style="padding-top:0"><h1 style="margin:0 0 4px">Position map</h1><p class="small muted" style="margin:0 0 10px">Every technique is a path to a new situation. Tap a position, pick your side, follow the chain.</p><div data-pm></div></div>`;
    const st = { at: P[start] ? start : "guard", who: "bottom", trail: [] }; st.trail.push(st.at);
    render(el.querySelector("[data-pm]"), st);
    el.addEventListener("click", e => { if (e.target.closest("[data-x]")) close(); });
  }
  A.mmaMap = { open, positions: P, edges: E };
  A.widgets = A.widgets || {};
  // Lesson widget: opts {start, who, goal}. With goal set, done({correct}) fires when the learner reaches it.
  A.widgets.posmap = { mount(el, opts = {}, done) { const st = { at: P[opts.start] ? opts.start : "guard", who: opts.who || "bottom", trail: [] }; st.trail.push(st.at);
    render(el, st, (to, sub) => { if (opts.goal && done && (sub ? opts.goal === "submission" : to === opts.goal)) done({ correct: true }); }); if (!opts.goal && done) done({ graded: false }); } };
})();
