// Original two-fighter drawings for MMA positions. Side view, capsule limbs, drawn from joint coordinates.
// FightArt.pose(id, {you:"top"|"bottom"}) -> SVG string. "A" is the top/attacking fighter, "B" the bottom/defending one.
(function () {
  // joints: h head, s shoulder, p hip, e/w near elbow/wrist, E/W far elbow/wrist, k/a near knee/ankle, K/X far knee/ankle
  const POSES = {
    standing: { A: { h: [62, 30], s: [61, 41], p: [58, 70], e: [72, 50], w: [76, 36], E: [70, 48], W: [82, 38], k: [68, 88], a: [72, 108], K: [52, 89], X: [46, 108] }, mirrorB: true },
    clinch: {
      A: { h: [97, 31], s: [93, 42], p: [84, 70], e: [104, 48], w: [112, 42], E: [104, 44], W: [110, 34], k: [90, 89], a: [94, 108], K: [76, 89], X: [70, 108] },
      B: { h: [108, 33], s: [108, 43], p: [116, 70], e: [98, 52], w: [92, 58], E: [98, 50], W: [92, 46], k: [110, 89], a: [106, 108], K: [124, 89], X: [130, 108] }, order: "BA" },
    cage: { fence: 178,
      A: { h: [150, 42], s: [145, 49], p: [124, 68], e: [158, 56], w: [166, 64], E: [156, 52], W: [168, 48], k: [126, 89], a: [116, 108], K: [110, 90], X: [100, 108] },
      B: { h: [168, 31], s: [168, 42], p: [166, 70], e: [158, 52], w: [150, 58], E: [160, 50], W: [154, 44], k: [158, 89], a: [162, 108], K: [170, 89], X: [172, 108] }, order: "BA" },
    guard: {
      B: { h: [36, 100], s: [50, 102], p: [86, 102], e: [66, 90], w: [84, 80], E: [64, 92], W: [86, 84], k: [110, 80], a: [130, 76], K: [106, 84], X: [128, 82] },
      A: { h: [104, 47], s: [104, 58], p: [118, 84], e: [96, 72], w: [90, 92], E: [98, 74], W: [94, 94], k: [104, 106], a: [136, 108], K: [108, 106], X: [140, 107] }, order: "AB" },
    halfguard: {
      B: { h: [40, 100], s: [54, 102], p: [92, 103], e: [70, 92], w: [78, 82], E: [64, 96], W: [74, 90], k: [110, 96], a: [128, 102], K: [112, 104], X: [126, 107] },
      A: { h: [60, 84], s: [72, 86], p: [110, 84], e: [62, 96], w: [50, 101], E: [86, 98], W: [96, 101], k: [130, 100], a: [150, 108], K: [118, 104], X: [134, 106] }, order: "BA" },
    butterfly: {
      B: { h: [80, 50], s: [82, 61], p: [88, 94], e: [100, 64], w: [114, 58], E: [98, 70], W: [108, 74], k: [106, 84], a: [116, 98], K: [102, 88], X: [112, 100] },
      A: { h: [126, 44], s: [124, 55], p: [128, 84], e: [110, 64], w: [98, 68], E: [112, 68], W: [102, 74], k: [114, 104], a: [144, 108], K: [118, 104], X: [148, 106] }, order: "AB" },
    side: {
      B: { h: [56, 100], s: [70, 102], p: [108, 102], e: [78, 90], w: [90, 84], E: [74, 94], W: [84, 90], k: [128, 92], a: [148, 106], K: [126, 96], X: [146, 108] },
      A: { h: [84, 72], s: [88, 82], p: [104, 82], e: [72, 92], w: [62, 98], E: [104, 94], W: [112, 97], k: [100, 106], a: [118, 108], K: [112, 104], X: [128, 108] }, order: "BA" },
    knee: {
      B: { h: [56, 100], s: [70, 102], p: [108, 102], e: [80, 92], w: [94, 86], E: [76, 94], W: [88, 92], k: [128, 92], a: [148, 106], K: [126, 96], X: [146, 108] },
      A: { h: [96, 34], s: [96, 45], p: [100, 72], e: [86, 62], w: [76, 80], E: [108, 60], W: [114, 74], k: [92, 94], a: [114, 94], K: [116, 88], X: [120, 108] }, order: "BA" },
    northsouth: {
      B: { h: [106, 102], s: [94, 102], p: [58, 102], e: [86, 92], w: [96, 86], E: [90, 94], W: [100, 90], k: [40, 92], a: [22, 106], K: [42, 96], X: [24, 108] },
      A: { h: [90, 84], s: [104, 86], p: [136, 84], e: [90, 98], w: [78, 100], E: [94, 96], W: [84, 97], k: [150, 104], a: [168, 108], K: [146, 106], X: [164, 108] }, order: "BA" },
    mount: {
      B: { h: [52, 100], s: [66, 102], p: [102, 102], e: [74, 90], w: [86, 82], E: [72, 94], W: [82, 88], k: [122, 92], a: [140, 106], K: [120, 96], X: [138, 108] },
      A: { h: [88, 45], s: [90, 56], p: [96, 88], e: [80, 66], w: [70, 76], E: [84, 70], W: [74, 86], k: [80, 104], a: [102, 108], K: [84, 106], X: [106, 106] }, order: "BA" },
    turtle: {
      B: { h: [68, 92], s: [80, 88], p: [110, 82], e: [82, 104], w: [72, 104], E: [86, 104], W: [76, 105], k: [110, 106], a: [130, 108], K: [106, 106], X: [126, 107] },
      A: { h: [90, 70], s: [98, 72], p: [128, 64], e: [90, 90], w: [84, 98], E: [96, 88], W: [92, 96], k: [140, 86], a: [146, 108], K: [132, 86], X: [138, 108] }, order: "BA" },
    back: {
      A: { h: [70, 44], s: [73, 56], p: [78, 96], e: [86, 58], w: [96, 54], E: [80, 70], W: [90, 64], k: [100, 82], a: [110, 96], K: [98, 86], X: [108, 98] },
      B: { h: [86, 50], s: [88, 62], p: [98, 94], e: [96, 72], w: [92, 58], E: [100, 74], W: [96, 62], k: [120, 84], a: [140, 104], K: [118, 88], X: [138, 106] }, order: "AB" }
  };
  const mirror = j => Object.fromEntries(Object.entries(j).map(([k, [x, y]]) => [k, [200 - x, y]]));
  const seg = (a, b, w, c, o = 1) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;
  function fighter(j, col, dark) {
    return seg(j.s, j.E, 6.5, dark) + seg(j.E, j.W, 5.5, dark) + seg(j.p, j.K, 9, dark) + seg(j.K, j.X, 7, dark) +
      seg(j.s, j.p, 13, col) + `<circle cx="${j.h[0]}" cy="${j.h[1]}" r="7" fill="${col}"/>` +
      seg(j.p, j.k, 9, col) + seg(j.k, j.a, 7, col) + seg(j.s, j.e, 6.5, col) + seg(j.e, j.w, 5.5, col) +
      `<circle cx="${j.w[0]}" cy="${j.w[1]}" r="3.6" fill="${col}"/>`;
  }
  function pose(id, opts = {}) {
    const P = POSES[id]; if (!P) return "";
    const A = P.A, B = P.B || mirror(A); const youTop = opts.you !== "bottom";
    const cA = youTop ? ["var(--accent)", "color-mix(in srgb, var(--accent) 60%, #000)"] : ["#5b8fd6", "#3a6199"];
    const cB = youTop ? ["#5b8fd6", "#3a6199"] : ["var(--accent)", "color-mix(in srgb, var(--accent) 60%, #000)"];
    const order = (P.order || "BA").split("");
    const body = order.map(k => k === "A" ? fighter(A, cA[0], cA[1]) : fighter(B, cB[0], cB[1])).join("");
    const pts = [A, B].flatMap(j => Object.values(j)); let x0 = Math.min(...pts.map(p => p[0])) - 16, x1 = Math.max(...pts.map(p => p[0])) + 16;
    if (P.fence) x1 = Math.max(x1, P.fence + 16);
    let y0 = Math.min(...pts.map(p => p[1])) - 14; const y1 = 116, w = Math.max(x1 - x0, 1.9 * (y1 - y0)), cx = (x0 + x1) / 2; x0 = cx - w / 2;
    const h = Math.max(y1 - y0, w / 2.4); y0 = y1 - h;
    return `<svg viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" class="fart" role="img" aria-label="${id} illustration">
      <line x1="${x0}" y1="112" x2="${x0 + w}" y2="112" stroke="var(--line-2, var(--line))" stroke-width="2" stroke-linecap="round"/>
      ${P.fence ? `<g stroke="var(--muted)" stroke-width="1" opacity=".55">${Array.from({ length: 8 }, (_, i) => `<line x1="${P.fence}" y1="${10 + i * 13}" x2="${P.fence + 12}" y2="${16 + i * 13}"/><line x1="${P.fence + 12}" y1="${10 + i * 13}" x2="${P.fence}" y2="${16 + i * 13}"/>`).join("")}<line x1="${P.fence}" y1="6" x2="${P.fence}" y2="112" stroke-width="2"/></g>` : ""}
      ${body}</svg>`;
  }
  window.FightArt = { pose, ids: Object.keys(POSES) };
})();
