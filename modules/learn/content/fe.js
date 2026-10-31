/* FE Electrical & Computer (NCEES CBT). Topic list follows the published NCEES FE Electrical and Computer
   exam specification; formulas match the free NCEES FE Reference Handbook (the only reference allowed in the exam,
   so practice looking things up in it). Lessons are original. Every numeric problem is generated fresh. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rnd(x, d) { var m = Math.pow(10, d == null ? 2 : d); return Math.round(x * m) / m; }
  function calc(q, a, why, d) { a = rnd(a, d == null ? 2 : d); return { t: 'calc', q: q, a: a, tol: Math.max(Math.pow(10, -(d == null ? 2 : d)), Math.abs(a) * 0.01), why: why }; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }
  var PI = Math.PI;

  /* ---- DC ---- */
  G.feSeriesPar = function () {
    var a = pk([100, 150, 220, 330, 470, 680, 1000]), b = pk([100, 220, 330, 470, 1000, 2200]), c = pk([100, 220, 470, 1000]), k = r(0, 2);
    if (k === 0) { var p = a * b / (a + b); return calc('R1 = ' + a + ' Ω and R2 = ' + b + ' Ω in <b>parallel</b>. Equivalent resistance in Ω?', p, '1/Req = 1/R1 + 1/R2, or for two: Req = R1R2/(R1+R2) = ' + (a * b) + '/' + (a + b) + ' = ' + rnd(p) + ' Ω. Parallel is always less than the smallest branch.'); }
    if (k === 1) { var t = c + a * b / (a + b); return calc(c + ' Ω in <b>series</b> with (' + a + ' Ω ∥ ' + b + ' Ω). Total resistance in Ω?', t, 'Parallel pair: ' + rnd(a * b / (a + b)) + ' Ω, plus ' + c + ' in series = ' + rnd(t) + ' Ω.'); }
    var v = pk([5, 9, 12, 24]), cur = v / (a + b); return calc('A ' + v + ' V source drives ' + a + ' Ω and ' + b + ' Ω in series. Current in <b>mA</b>?', cur * 1000, 'I = V / (R1 + R2) = ' + v + ' / ' + (a + b) + ' = ' + rnd(cur * 1000) + ' mA.');
  };
  G.feDivider = function () {
    var vin = pk([5, 10, 12, 15, 24]), r1 = pk([1, 2.2, 3.3, 4.7, 10]), r2 = pk([1, 2.2, 3.3, 4.7, 10]), vo = vin * r2 / (r1 + r2);
    return calc('Voltage divider: Vin = ' + vin + ' V, R1 = ' + r1 + ' kΩ (top), R2 = ' + r2 + ' kΩ (bottom). Vout across R2, in V?', vo, 'Vout = Vin × R2/(R1+R2) = ' + vin + ' × ' + r2 + '/' + rnd(r1 + r2) + ' = ' + rnd(vo) + ' V. The divider rule saves you from solving the whole circuit.');
  };
  G.fePower = function () {
    var v = pk([5, 12, 24, 120]), R = pk([10, 47, 100, 220, 1000]), k = r(0, 1);
    if (k === 0) return calc('A ' + R + ' Ω resistor has ' + v + ' V across it. Power dissipated in W?', v * v / R, 'P = V²/R = ' + (v * v) + '/' + R + ' = ' + rnd(v * v / R, 3) + ' W. (Also P = VI = I²R.) Pick a resistor rated above this or it cooks.', 3);
    var i = pk([0.1, 0.2, 0.5, 1, 2]); return calc(i + ' A flows through ' + R + ' Ω. Power in W?', i * i * R, 'P = I²R = ' + i + '² × ' + R + ' = ' + rnd(i * i * R) + ' W.');
  };
  G.feThevenin = function () {
    var vs = pk([10, 12, 20, 24]), r1 = pk([2, 4, 6, 10]), r2 = pk([2, 3, 4, 6, 12]), vth = vs * r2 / (r1 + r2), rth = r1 * r2 / (r1 + r2), k = r(0, 1);
    var desc = 'Source ' + vs + ' V in series with R1 = ' + r1 + ' Ω; R2 = ' + r2 + ' Ω from that node to ground. Terminals a-b are across R2.';
    if (k === 0) return calc(desc + '<br>Thevenin voltage V<sub>th</sub> (V)?', vth, 'Open-circuit voltage across R2 = divider: ' + vs + ' × ' + r2 + '/(' + r1 + '+' + r2 + ') = ' + rnd(vth) + ' V.');
    return calc(desc + '<br>Thevenin resistance R<sub>th</sub> (Ω)?', rth, 'Turn off the voltage source (short it), look into a-b: R1 ∥ R2 = ' + r1 + '×' + r2 + '/' + (r1 + r2) + ' = ' + rnd(rth) + ' Ω. Max power transfer happens when the load equals R<sub>th</sub>.');
  };
  /* ---- AC ---- */
  G.feRC = function () {
    var R = pk([1, 2, 4.7, 10]), C = pk([10, 47, 100, 220]), tau = R * 1e3 * C * 1e-6, k = r(0, 1);
    if (k === 0) return calc('RC circuit: R = ' + R + ' kΩ, C = ' + C + ' µF. Time constant τ in <b>ms</b>?', tau * 1000, 'τ = RC = ' + R + '×10³ × ' + C + '×10⁻⁶ = ' + rnd(tau * 1000) + ' ms. After 1τ a charging cap is at 63%; after 5τ it\'s effectively full (99.3%).');
    var n = pk([1, 2, 3]), vs = pk([5, 10, 12]), v = vs * (1 - Math.exp(-n));
    return calc('A capacitor charges toward ' + vs + ' V through a resistor, starting at 0 V. Voltage after <b>' + n + 'τ</b>, in V?', v, 'v(t) = Vs(1 − e^(−t/τ)) = ' + vs + '(1 − e^(−' + n + ')) = ' + rnd(v) + ' V.');
  };
  G.feReact = function () {
    var f = pk([50, 60, 100, 1000]), k = r(0, 2);
    if (k === 0) { var C = pk([1, 10, 47, 100]), xc = 1 / (2 * PI * f * C * 1e-6); return calc('Capacitive reactance of ' + C + ' µF at ' + f + ' Hz, in Ω?', xc, 'X<sub>C</sub> = 1/(2πfC) = ' + rnd(xc) + ' Ω. Capacitors block DC and pass high frequencies.', 1); }
    if (k === 1) { var L = pk([10, 50, 100, 500]), xl = 2 * PI * f * L * 1e-3; return calc('Inductive reactance of ' + L + ' mH at ' + f + ' Hz, in Ω?', xl, 'X<sub>L</sub> = 2πfL = ' + rnd(xl) + ' Ω. Inductors pass DC and resist high frequencies.', 1); }
    var R = pk([3, 6, 8, 30, 40]), X = pk([4, 8, 6, 40, 30]), z = Math.sqrt(R * R + X * X); return calc('Series R = ' + R + ' Ω and net reactance X = ' + X + ' Ω. Impedance magnitude |Z| in Ω?', z, '|Z| = √(R² + X²) = √(' + (R * R) + ' + ' + (X * X) + ') = ' + rnd(z) + ' Ω. Phase angle = arctan(X/R) = ' + rnd(Math.atan2(X, R) * 180 / PI, 1) + '°.');
  };
  G.feResonance = function () {
    var L = pk([1, 10, 100]), C = pk([0.1, 1, 10]), f0 = 1 / (2 * PI * Math.sqrt(L * 1e-3 * C * 1e-6));
    return calc('Series RLC: L = ' + L + ' mH, C = ' + C + ' µF. Resonant frequency in <b>Hz</b>?', f0, 'f₀ = 1/(2π√(LC)) = ' + rnd(f0, 1) + ' Hz. At resonance X<sub>L</sub> = X<sub>C</sub>, they cancel, and impedance is just R (minimum in series).', 0);
  };
  G.fePF = function () {
    var S = pk([5, 10, 20, 50]), pf = pk([0.6, 0.7, 0.8, 0.85, 0.9]), k = r(0, 1), P = S * pf, Q = S * Math.sqrt(1 - pf * pf);
    if (k === 0) return calc('A load draws ' + S + ' kVA at power factor ' + pf + ' lagging. Real power in kW?', P, 'P = S × pf = ' + rnd(P) + ' kW. Apparent power S (kVA) is what the wires carry; real power P (kW) does work.');
    return calc('A load draws ' + S + ' kVA at power factor ' + pf + '. Reactive power in kVAR?', Q, 'Q = S × sin θ = S√(1 − pf²) = ' + rnd(Q) + ' kVAR. Power triangle: S² = P² + Q². Capacitors added in parallel correct lagging pf.');
  };
  G.fe3ph = function () {
    var vp = pk([120, 230, 277]), k = r(0, 1);
    if (k === 0) return calc('Balanced wye (Y) system with phase voltage ' + vp + ' V. Line-to-line voltage in V?', vp * Math.sqrt(3), 'In wye, V<sub>L</sub> = √3 × V<sub>φ</sub> = ' + rnd(vp * Math.sqrt(3), 1) + ' V (120 → 208, 277 → 480 are the US standards).', 0);
    var vl = pk([208, 480]), i = pk([10, 20, 50]), pf = pk([0.8, 0.9, 1]), p = Math.sqrt(3) * vl * i * pf / 1000;
    return calc('Three-phase load: ' + vl + ' V line, ' + i + ' A line current, pf ' + pf + '. Total real power in kW?', p, 'P = √3 × V<sub>L</sub> × I<sub>L</sub> × pf = ' + rnd(p) + ' kW.');
  };
  G.feXfmr = function () {
    var vp = pk([120, 240, 480, 7200]), n = pk([2, 4, 10, 20, 30]), ip = pk([1, 2, 5]);
    if (Math.random() < .5) return calc('Ideal transformer, turns ratio N<sub>p</sub>:N<sub>s</sub> = ' + n + ':1, primary ' + vp + ' V. Secondary voltage in V?', vp / n, 'V<sub>s</sub> = V<sub>p</sub> × N<sub>s</sub>/N<sub>p</sub> = ' + vp + '/' + n + ' = ' + rnd(vp / n) + ' V.');
    return calc('Ideal ' + n + ':1 step-down transformer, primary current ' + ip + ' A. Secondary current in A?', ip * n, 'Power in = power out, so current scales opposite to voltage: I<sub>s</sub> = I<sub>p</sub> × N<sub>p</sub>/N<sub>s</sub> = ' + (ip * n) + ' A.');
  };
  /* ---- electronics ---- */
  G.feOpamp = function () {
    var rin = pk([1, 2, 4.7, 10]), rf = pk([10, 22, 47, 100]), vin = pk([0.1, 0.2, 0.5]), inv = Math.random() < .5, g = inv ? -rf / rin : 1 + rf / rin;
    return calc('Ideal op-amp, <b>' + (inv ? 'inverting' : 'non-inverting') + '</b>: R<sub>in</sub> = ' + rin + ' kΩ, R<sub>f</sub> = ' + rf + ' kΩ, input ' + vin + ' V. Output voltage in V (assume no saturation)?', g * vin, (inv ? 'Gain = −R<sub>f</sub>/R<sub>in</sub>' : 'Gain = 1 + R<sub>f</sub>/R<sub>in</sub>') + ' = ' + rnd(g, 3) + '. Vout = ' + rnd(g * vin, 3) + ' V. Ideal op-amp rules: no current into the inputs, and with negative feedback the inputs sit at the same voltage.', 3);
  };
  G.feDb = function () {
    var k = r(0, 1);
    if (k === 0) { var g = pk([2, 10, 31.6, 100, 1000]); return calc('A voltage gain of ' + g + '× is how many dB?', 20 * Math.log10(g), 'Voltage: dB = 20 log₁₀(gain) = ' + rnd(20 * Math.log10(g), 1) + ' dB. (Power uses 10 log.) Every 20 dB = 10× voltage.', 1); }
    var pg = pk([2, 10, 100]); return calc('A power gain of ' + pg + '× is how many dB?', 10 * Math.log10(pg), 'Power: dB = 10 log₁₀ = ' + rnd(10 * Math.log10(pg), 1) + ' dB. 3 dB ≈ double power.', 1);
  };
  /* ---- digital / computer ---- */
  G.feTwos = function () {
    var n = r(1, 127), k = r(0, 1);
    if (k === 0) { var b = ((256 - n) & 255).toString(2).padStart(8, '0'); return mc('8-bit two\'s complement of <b>−' + n + '</b>?', b, [n.toString(2).padStart(8, '0'), ((255 - n) & 255).toString(2).padStart(8, '0'), ('1' + n.toString(2).padStart(7, '0'))], 'Write +' + n + ' (' + n.toString(2).padStart(8, '0') + '), flip all bits, add 1 → ' + b + '. Range of 8-bit two\'s complement: −128 to +127.'); }
    var v = r(128, 255), bs = v.toString(2); return calc('The 8-bit two\'s complement value <b>' + bs + '</b> is what decimal number?', v - 256, 'Top bit 1 = negative. Value = ' + v + ' − 256 = ' + (v - 256) + '.', 0);
  };
  G.feNyquist = function () {
    var f = pk([3.4, 4, 15, 20, 22.05]);
    return calc('A signal\'s highest frequency is ' + f + ' kHz. Minimum sampling rate (Nyquist) in kHz?', 2 * f, 'f<sub>s</sub> > 2 f<sub>max</sub> = ' + rnd(2 * f) + ' kHz. Sample slower and high frequencies alias (fold) into fake lower ones. CD audio uses 44.1 kHz for a ~20 kHz limit.');
  };
  G.feCache = function () {
    var hit = pk([0.9, 0.95, 0.98]), tc = pk([1, 2, 5]), tm = pk([50, 100, 200]), amat = tc + (1 - hit) * tm;
    return calc('Cache hit time ' + tc + ' ns, miss penalty ' + tm + ' ns, hit rate ' + hit + '. Average memory access time in ns?', amat, 'AMAT = hit time + miss rate × miss penalty = ' + tc + ' + ' + rnd(1 - hit) + ' × ' + tm + ' = ' + rnd(amat) + ' ns. A few percent of misses dominate the average.');
  };
  /* ---- math / econ ---- */
  G.feEcon = function () {
    var P = pk([1000, 5000, 10000]), i = pk([4, 5, 6, 8, 10]), n = pk([5, 10, 15, 20]), k = r(0, 1);
    if (k === 0) return calc('$' + P + ' invested at ' + i + '% compounded annually. Value after ' + n + ' years ($)?', P * Math.pow(1 + i / 100, n), 'F = P(1 + i)ⁿ = ' + P + ' × ' + (1 + i / 100) + '^' + n + ' = $' + rnd(P * Math.pow(1 + i / 100, n)) + '. The handbook lists this as (F/P, i, n).', 0);
    var F = P * 2; return calc('Present worth of $' + F + ' received ' + n + ' years from now at ' + i + '% ($)?', F / Math.pow(1 + i / 100, n), 'P = F/(1 + i)ⁿ = $' + rnd(F / Math.pow(1 + i / 100, n)) + '. Money later is worth less than money now.', 0);
  };
  G.feComplex = function () {
    var a = pk([3, 5, 6, 8, 12]), b = pk([4, 12, 8, 6, 5]), m = Math.sqrt(a * a + b * b), k = r(0, 1);
    if (k === 0) return calc('Magnitude of the complex number <b>' + a + ' + j' + b + '</b>?', m, '|z| = √(' + a + '² + ' + b + '²) = ' + rnd(m) + '. Engineers use j (not i) since i means current.');
    return calc('Angle of <b>' + a + ' + j' + b + '</b> in degrees?', Math.atan2(b, a) * 180 / PI, 'θ = arctan(' + b + '/' + a + ') = ' + rnd(Math.atan2(b, a) * 180 / PI, 1) + '°. Polar form: ' + rnd(m) + '∠' + rnd(Math.atan2(b, a) * 180 / PI, 1) + '°. Multiply phasors by multiplying magnitudes and adding angles.', 1);
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    id: 'fe', name: 'FE Electrical & Computer', mark: '⚡', color: '#e3b341', stat: 'mind', group: 'Certs & career',
    blurb: 'NCEES FE exam: circuits to computer systems.',
    exam: 'FE Electrical & Computer',
    examCfg: { n: 110, min: 320, pbq: 0, byUnit: true, calc: true, scaled: false, pass: 70, note: 'NCEES doesn\'t publish a pass mark; about 70% on practice exams is a common readiness target.',
      w: { 1: 14, 2: 14, 3: 20, 4: 12, 5: 24, 6: 16 },
      names: { 1: 'Math, economics & ethics', 2: 'DC circuits', 3: 'AC circuits & power', 4: 'Electronics', 5: 'Digital & computer systems', 6: 'Signals, controls & comms' } },
    intro: 'The Fundamentals of Engineering exam, Electrical and Computer discipline: 110 questions over about 5 hours 20 minutes of exam time, computer-based at Pearson VUE, with the NCEES FE Reference Handbook on screen as your only reference. Download the handbook free from ncees.org and get fast at finding formulas in it; that\'s half the battle. Every numeric problem here is generated fresh, so Practice drill never runs out. Use the NCEES-approved calculator you\'ll take into the exam (e.g. Casio fx-115 or TI-36X Pro).',
    placement: [
      { t: 'mcq', q: 'Two 100 Ω resistors in parallel equal:', opts: ['200 Ω', '100 Ω', '50 Ω', '25 Ω'], a: 2, why: '50 Ω. DC circuits, Unit 2.' },
      { t: 'mcq', q: 'Inductive reactance as frequency rises:', opts: ['Falls', 'Rises', 'Stays the same', 'Becomes zero'], a: 1, why: 'X_L = 2πfL. AC, Unit 3.' },
      { t: 'mcq', q: 'An ideal inverting op-amp with Rf = 10k and Rin = 1k has gain:', opts: ['10', '−10', '11', '−11'], a: 1, why: '−Rf/Rin. Electronics, Unit 4.' },
      { t: 'mcq', q: 'Minimum sampling rate for a 5 kHz signal:', opts: ['2.5 kHz', '5 kHz', '10 kHz', '20 kHz'], a: 2, why: 'Nyquist: 2× the highest frequency. Signals, Unit 6.' },
      { t: 'mcq', q: '8-bit two\'s complement range:', opts: ['0 to 255', '−127 to 127', '−128 to 127', '−256 to 255'], a: 2, why: 'Digital, Unit 5.' }
    ],
    units: [
      {
        name: 'Unit 1 · Exam strategy, math & economics', tag: 'start here',
        blurb: 'How the exam works, the math that shows up everywhere, and engineering economics (free points).',
        lessons: [
          {
            id: 'fe-strategy', title: 'How the FE works & how to pass it', min: 8, teaser: 'Format, the handbook, time per question, a 12-week plan.',
            links: ['fe-math', 'fe-dc'],
            cards: [
              { t: 'read', h: 'The format', body: '<ul><li>110 multiple-choice and alternative-item questions (fill in a number, pick several, drag-and-drop), about 3 minutes each.</li><li>Two sections with an optional break. Total appointment about 6 hours including tutorial.</li><li>Only reference: the <b>FE Reference Handbook</b> PDF on screen, with search. You can\'t bring notes.</li><li>Approved calculators only (Casio fx-115 series, TI-30X / TI-36X Pro, HP 33s/35s).</li><li>Results are pass/fail, usually within 7–10 days. Passing makes you an Engineer in Training (EIT/EI), the first step toward the PE license.</li></ul>' },
              { t: 'read', h: 'Strategy', body: '<ol><li>Study <b>with the handbook open</b>; every time you use a formula, find it in the PDF. Use its search (Ctrl+F) with the exact words it uses.</li><li>First pass: answer what you know in under 2 minutes, flag the rest.</li><li>Points are equal; don\'t sink 10 minutes into one. Never leave a blank (no penalty for guessing).</li><li>Units: carry them through every step; many wrong answer choices are unit mistakes (mA vs A, kΩ vs Ω).</li><li>12-week plan: 2–3 topics per week, drill problems daily, one full timed practice exam (NCEES sells the official one) in weeks 10–11.</li></ol>', mem: 'Handbook open while you study. Flag and move on. Watch units.' },
              { t: 'explain', q: 'Explain your plan for exam day timing.', points: ['About 3 minutes per question', 'First pass: answer quick ones, flag hard ones', 'Return to flagged questions with remaining time', 'Never leave blanks; no guessing penalty'] }
            ]
          },
          {
            id: 'fe-math', title: 'Complex numbers, calculus & linear algebra review', min: 12, teaser: 'The math the circuits units lean on.',
            pre: ['fe-strategy'], links: ['fe-ac', 'm-exp'],
            cards: [
              { t: 'read', h: 'Complex numbers (phasors)', body: '<p>AC analysis lives on complex numbers, written with <b>j = √−1</b>. Rectangular <code>a + jb</code> ↔ polar <code>M∠θ</code> with M = √(a² + b²), θ = arctan(b/a). Add and subtract in rectangular; multiply and divide in polar (multiply magnitudes, add angles). Euler: e<sup>jθ</sup> = cos θ + j sin θ.</p><p>Learn your calculator\'s complex mode; it turns 5-minute problems into 30 seconds.</p>' },
              { t: 'read', h: 'Calculus & linear algebra you\'ll need', body: '<ul><li>Derivatives: d/dt(e<sup>at</sup>) = a e<sup>at</sup>, d/dt(sin ωt) = ω cos ωt. Capacitor current i = C dv/dt; inductor voltage v = L di/dt.</li><li>Integrals of the same; average value = (1/T)∫ over a period.</li><li>First-order differential equations: solutions look like A + B e<sup>−t/τ</sup> (every RC/RL transient).</li><li>Matrices: solve 2–3 simultaneous equations (mesh/nodal analysis) with your calculator or Cramer\'s rule; determinants.</li></ul>' },
              { t: 'gen', g: 'feComplex' }, { t: 'gen', g: 'feComplex' }
            ]
          },
          {
            id: 'fe-econ', title: 'Engineering economics & ethics', min: 10, teaser: 'Time value of money, plus the licensing rules.',
            pre: ['fe-strategy'], links: ['life-invest'],
            cards: [
              { t: 'read', h: 'Time value of money', body: '<p>The handbook has tables and factor formulas like (F/P, i%, n) = (1 + i)ⁿ and (P/F) = 1/(1 + i)ⁿ, plus annuity factors (P/A, A/P) for equal yearly payments. Compare alternatives by converting everything to the same basis: present worth, annual worth, or rate of return. Also know: depreciation (straight-line = (cost − salvage)/life), break-even, and benefit-cost ratio.</p>' },
              { t: 'read', h: 'Ethics & professional practice', body: '<p>From the NCEES Model Law and Rules: an engineer\'s first duty is to <b>public health, safety and welfare</b>. Practice only in your areas of competence, sign and seal only work you prepared or directly supervised, avoid conflicts of interest (or disclose them), don\'t accept gifts that could influence decisions, and report violations to the licensing board. Intellectual property basics: patents, copyrights, trademarks, trade secrets.</p>', mem: 'Public safety first. Competence. Disclose conflicts.' },
              { t: 'gen', g: 'feEcon' }, { t: 'gen', g: 'feEcon' },
              { t: 'mcq', q: 'Your client tells you to approve a design you believe is unsafe. You should:', opts: ['Approve it since the client pays', 'Refuse, explain the hazard, and report to authorities if public safety is at risk', 'Approve it with a note', 'Quietly quit'], a: 1, why: 'Public safety overrides client wishes under every engineering code of ethics.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · DC circuits', tag: 'circuits',
        blurb: 'Ohm\'s law, KVL/KCL, series and parallel, Thevenin and Norton, power.',
        lessons: [
          {
            id: 'fe-dc', title: 'Ohm, Kirchhoff, series & parallel', min: 12, teaser: 'The rules every circuit problem starts from.',
            pre: ['sc-elec'], links: ['fe-thev'],
            cards: [
              { t: 'read', h: 'The laws', body: '<ul><li><b>Ohm\'s law</b>: V = IR. Power P = VI = I²R = V²/R.</li><li><b>KCL</b> (current law): currents into a node = currents out. (Charge doesn\'t pile up.)</li><li><b>KVL</b> (voltage law): voltages around any closed loop sum to zero.</li><li><b>Series</b>: same current, R adds. <b>Parallel</b>: same voltage, conductances (1/R) add.</li><li><b>Divider rules</b>: V<sub>x</sub> = V × R<sub>x</sub>/R<sub>total</sub> (series); I<sub>x</sub> = I × R<sub>other</sub>/(R<sub>x</sub> + R<sub>other</sub>) for two in parallel.</li></ul>', mem: 'KCL: in = out at a node. KVL: loop sums to zero.' },
              { t: 'gen', g: 'feSeriesPar' }, { t: 'gen', g: 'feSeriesPar' }, { t: 'gen', g: 'feDivider' }, { t: 'gen', g: 'fePower' },
              { t: 'explain', q: 'Explain KCL and KVL and what physical law each comes from.', points: ['KCL: current into a node equals current out', 'Comes from conservation of charge', 'KVL: voltages around a closed loop sum to zero', 'Comes from conservation of energy'] }
            ]
          },
          {
            id: 'fe-thev', title: 'Nodal, mesh, Thevenin & Norton', min: 12, teaser: 'Systematic analysis, and shrinking a circuit to two parts.',
            pre: ['fe-dc'], links: ['fe-ac'],
            cards: [
              { t: 'read', h: 'Systematic methods', body: '<p><b>Nodal analysis</b>: pick a ground, label unknown node voltages, write KCL at each node, solve. <b>Mesh analysis</b>: assign loop currents, write KVL around each mesh, solve. On the exam, set up the 2×2 or 3×3 system and let the calculator solve it.</p><p><b>Superposition</b> (linear circuits): the response to several sources = sum of responses to each alone, with other voltage sources shorted and current sources opened.</p>' },
              { t: 'read', h: 'Thevenin & Norton', body: '<p>Any linear two-terminal circuit equals a single voltage source V<sub>th</sub> in series with R<sub>th</sub> (Thevenin), or a current source I<sub>N</sub> in parallel with R<sub>N</sub> = R<sub>th</sub> (Norton), with V<sub>th</sub> = I<sub>N</sub>R<sub>th</sub>.</p><ul><li>V<sub>th</sub>: open-circuit voltage at the terminals.</li><li>R<sub>th</sub>: turn off independent sources and find the resistance looking in.</li><li><b>Max power transfer</b>: R<sub>load</sub> = R<sub>th</sub>, giving P<sub>max</sub> = V<sub>th</sub>²/(4R<sub>th</sub>).</li></ul>', mem: 'Vth = open-circuit voltage. Rth = sources off, look in.' },
              { t: 'gen', g: 'feThevenin' }, { t: 'gen', g: 'feThevenin' }, { t: 'gen', g: 'feThevenin' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · AC circuits & power', tag: 'circuits',
        blurb: 'Transients, phasors, impedance, resonance, AC power, three-phase and transformers.',
        lessons: [
          {
            id: 'fe-trans', title: 'RC & RL transients', min: 10, teaser: 'Time constants and the e^(−t/τ) curve.',
            pre: ['fe-dc', 'fe-math'], links: ['fe-ac'],
            cards: [
              { t: 'read', h: 'First-order circuits', body: '<p>Capacitors resist sudden changes in <b>voltage</b>; inductors resist sudden changes in <b>current</b>. When switched, they move exponentially to their new steady state:</p><p>x(t) = x(∞) + [x(0) − x(∞)] e<sup>−t/τ</sup>, with <b>τ = RC</b> or <b>τ = L/R</b>.</p><p>At DC steady state: capacitor = open circuit, inductor = short circuit. After 1τ: 63% of the change; 5τ: done.</p>', mem: 'τ = RC or L/R. Cap = open at DC, inductor = short.' },
              { t: 'gen', g: 'feRC' }, { t: 'gen', g: 'feRC' }, { t: 'gen', g: 'feRC' }
            ]
          },
          {
            id: 'fe-ac', title: 'Phasors, impedance & resonance', min: 12, teaser: 'Treat AC circuits like DC with complex numbers.',
            pre: ['fe-trans'], links: ['fe-power'],
            cards: [
              { t: 'read', h: 'Impedance', body: '<p>For sinusoids at one frequency, replace each part with its <b>impedance</b>: Z<sub>R</sub> = R, Z<sub>L</sub> = jωL, Z<sub>C</sub> = 1/(jωC) = −j/(ωC), with ω = 2πf. Then Ohm\'s law, KVL, KCL, dividers and Thevenin all work with complex numbers.</p><p>Inductor current lags voltage by 90° ("ELI"); capacitor current leads ("ICE"). <b>RMS</b> = peak/√2 for sinusoids; 120 V outlets are 120 V RMS (≈170 V peak).</p>', mem: 'ELI the ICE man. RMS = peak / √2.' },
              { t: 'read', h: 'Resonance and filters', body: '<p>At resonance f₀ = 1/(2π√LC), X<sub>L</sub> = X<sub>C</sub>. Series RLC: impedance is minimum (= R), current maximum. Parallel: impedance maximum. Quality factor Q describes sharpness.</p><p>Simple filters: RC low-pass (output across C) and high-pass (output across R), cutoff f<sub>c</sub> = 1/(2πRC), where output is −3 dB (70.7%).</p>' },
              { t: 'gen', g: 'feReact' }, { t: 'gen', g: 'feReact' }, { t: 'gen', g: 'feReact' }, { t: 'gen', g: 'feResonance' }
            ]
          },
          {
            id: 'fe-power', title: 'AC power, three-phase & transformers', min: 12, teaser: 'kW vs kVA vs kVAR, √3, and turns ratios.',
            pre: ['fe-ac'], links: ['fe-machines'],
            cards: [
              { t: 'read', h: 'The power triangle', body: '<p>Complex power <b>S = P + jQ</b>. <b>P</b> (W) real power does work, <b>Q</b> (VAR) reactive power sloshes back and forth, <b>|S|</b> (VA) apparent power is what equipment must be sized for. <b>Power factor</b> pf = P/|S| = cos θ. Lagging pf (inductive loads like motors) is corrected with parallel capacitors.</p>' },
              { t: 'read', h: 'Three-phase and transformers', body: '<ul><li>Balanced <b>wye</b>: V<sub>L</sub> = √3 V<sub>φ</sub>, I<sub>L</sub> = I<sub>φ</sub>. <b>Delta</b>: V<sub>L</sub> = V<sub>φ</sub>, I<sub>L</sub> = √3 I<sub>φ</sub>.</li><li>Total power P = √3 V<sub>L</sub> I<sub>L</sub> pf.</li><li>Ideal transformer: V<sub>p</sub>/V<sub>s</sub> = N<sub>p</sub>/N<sub>s</sub> = I<sub>s</sub>/I<sub>p</sub>. Impedance reflects by the turns ratio squared: Z<sub>p</sub> = (N<sub>p</sub>/N<sub>s</sub>)² Z<sub>s</sub>.</li></ul>', mem: 'Wye: VL = √3 Vφ. P3φ = √3 VL IL pf.' },
              { t: 'gen', g: 'fePF' }, { t: 'gen', g: 'fePF' }, { t: 'gen', g: 'fe3ph' }, { t: 'gen', g: 'fe3ph' }, { t: 'gen', g: 'feXfmr' }
            ]
          },
          {
            id: 'fe-machines', title: 'Machines, power systems & electromagnetics', min: 10, teaser: 'Motors, generators, fields and forces.',
            pre: ['fe-power'], links: ['sc-elec'],
            cards: [
              { t: 'read', h: 'Machines and power systems', body: '<ul><li><b>Synchronous speed</b> n<sub>s</sub> = 120f/P rpm (P = poles). 60 Hz, 4 poles → 1800 rpm. Induction motors run slightly slower; <b>slip</b> s = (n<sub>s</sub> − n)/n<sub>s</sub>.</li><li><b>DC machines</b>: back-EMF E = kφω; speed rises when field flux drops.</li><li><b>Per-unit system</b>: express values as fractions of a base (base VA and base V) so transformer levels disappear from calculations.</li><li>Transmission uses high voltage to cut I²R losses: double the voltage, quarter the losses for the same power.</li></ul>' },
              { t: 'read', h: 'Electromagnetics essentials', body: '<ul><li>Coulomb: F = kq₁q₂/r², k ≈ 8.99×10⁹.</li><li>Capacitance of parallel plates: C = εA/d.</li><li>Faraday: induced voltage = −N dΦ/dt (transformers, generators).</li><li>Force on a current in a field: F = BIL.</li></ul>' },
              { t: 'mcq', q: 'Synchronous speed of a 4-pole motor on 60 Hz?', opts: ['900 rpm', '1200 rpm', '1800 rpm', '3600 rpm'], a: 2, why: '120 × 60 / 4 = 1800 rpm.' },
              { t: 'gen', g: 'feXfmr' }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · Electronics', tag: 'devices',
        blurb: 'Diodes, transistors, op-amps, decibels.',
        lessons: [
          {
            id: 'fe-semis', title: 'Diodes & transistors', min: 11, teaser: 'PN junctions, rectifiers, BJTs and MOSFETs.',
            pre: ['fe-dc'], links: ['fe-opamp'],
            cards: [
              { t: 'read', h: 'Diodes', body: '<p>A diode conducts one way. Silicon forward drop ≈ <b>0.7 V</b> (LEDs ~2 V). Uses: rectifiers (AC → DC; a full-wave bridge uses 4 diodes and drops two diode voltages), clamps, protection. <b>Zener</b> diodes conduct in reverse at a set voltage, used as simple regulators.</p>' },
              { t: 'read', h: 'Transistors', body: '<ul><li><b>BJT</b> (NPN/PNP): small base current controls a large collector current, I<sub>C</sub> = β I<sub>B</sub>. V<sub>BE</sub> ≈ 0.7 V when on. Regions: cutoff, active (amplifier), saturation (switch on).</li><li><b>MOSFET</b>: gate voltage controls the channel, almost no gate current. On when V<sub>GS</sub> > V<sub>th</sub>. Saturation-region current I<sub>D</sub> = ½k(V<sub>GS</sub> − V<sub>th</sub>)² (using the handbook\'s form). The building block of all digital logic (CMOS).</li></ul>', mem: 'Si diode 0.7 V. BJT: IC = βIB. MOSFET: voltage-controlled.' },
              { t: 'calc', q: 'A BJT has β = 100 and base current 20 µA in the active region. Collector current in mA?', a: 2, tol: 0.02, why: 'I<sub>C</sub> = βI<sub>B</sub> = 100 × 20 µA = 2 mA.' },
              { t: 'mcq', q: 'A full-wave bridge rectifier drops about how much voltage (silicon diodes)?', opts: ['0.7 V', '1.4 V', '2.8 V', '0 V'], a: 1, why: 'Current flows through two diodes per half cycle: 2 × 0.7 V.' }
            ]
          },
          {
            id: 'fe-opamp', title: 'Op-amps & gain in dB', min: 10, teaser: 'Two rules solve every ideal op-amp problem.',
            pre: ['fe-semis'], links: ['fe-signals'],
            cards: [
              { t: 'read', h: 'Ideal op-amp rules', body: '<ol><li>No current flows into either input.</li><li>With negative feedback, the output does whatever makes V<sub>+</sub> = V<sub>−</sub>.</li></ol><p>From those: inverting gain −R<sub>f</sub>/R<sub>in</sub>; non-inverting 1 + R<sub>f</sub>/R<sub>in</sub>; voltage follower gain 1 (buffer); summing amp V<sub>o</sub> = −R<sub>f</sub>(V₁/R₁ + V₂/R₂); integrators and differentiators with capacitors. Output can\'t exceed the supply rails.</p>', mem: 'No input current. V+ = V− with feedback.' },
              { t: 'gen', g: 'feOpamp' }, { t: 'gen', g: 'feOpamp' }, { t: 'gen', g: 'feDb' }, { t: 'gen', g: 'feDb' }
            ]
          }
        ]
      },
      {
        name: 'Unit 5 · Digital & computer systems', tag: 'computer',
        blurb: 'Number systems, logic, sequential circuits, computer architecture, networks and software.',
        lessons: [
          {
            id: 'fe-digital', title: 'Number systems, logic & K-maps', min: 12, teaser: 'Two\'s complement, Boolean algebra, minimization.',
            pre: ['cs-logic', 'cs-data'], links: ['fe-seq'],
            cards: [
              { t: 'read', h: 'Numbers', body: '<p>Binary, octal, hex conversions (group bits by 3 for octal, 4 for hex). Signed integers use <b>two\'s complement</b>: invert and add 1 to negate; n bits cover −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1. Overflow happens when two same-sign numbers add to the opposite sign. BCD stores each decimal digit in 4 bits.</p>' },
              { t: 'read', h: 'Boolean algebra and K-maps', body: '<p>Laws: identity, complement, De Morgan (¬(AB) = ¬A + ¬B), absorption (A + AB = A). Express functions as sum of products (minterms) or product of sums. A <b>Karnaugh map</b> groups adjacent 1s in powers of 2 (1, 2, 4, 8, wrapping around edges); each group becomes one simplified product term. NAND and NOR are each universal: any logic can be built from just one of them.</p>', mem: 'K-map groups: powers of 2, rectangles, wrap edges, as big as possible.' },
              { t: 'gen', g: 'feTwos' }, { t: 'gen', g: 'feTwos' }, { t: 'gen', g: 'dmLogic' },
              { t: 'mcq', q: 'Simplify A + AB.', opts: ['AB', 'A', 'B', 'A + B'], a: 1, why: 'Absorption: A(1 + B) = A.' }
            ]
          },
          {
            id: 'fe-seq', title: 'Flip-flops, counters & state machines', min: 10, teaser: 'Memory in logic: D, JK, T, and FSMs.',
            pre: ['fe-digital'], links: ['fe-arch', 'th-automata'],
            cards: [
              { t: 'read', h: 'Sequential logic', body: '<ul><li><b>D flip-flop</b>: on the clock edge, Q takes the value of D.</li><li><b>JK</b>: J=K=0 hold, J=1 K=0 set, J=0 K=1 reset, J=K=1 toggle.</li><li><b>T</b>: toggles when T = 1.</li><li><b>Counters</b>: n flip-flops count 2ⁿ states. <b>Shift registers</b> move bits one place per clock.</li><li><b>Finite state machines</b>: Moore (outputs depend on state only) vs Mealy (state and inputs). Same idea as the DFAs in Theory of Computation.</li></ul>' },
              { t: 'mcq', q: 'A JK flip-flop with J = 1 and K = 1 on a clock edge will:', opts: ['Hold', 'Set', 'Reset', 'Toggle'], a: 3, why: 'J = K = 1 toggles the output.' },
              { t: 'calc', q: 'How many flip-flops does a counter need to count 0 through 99?', a: 7, tol: 0, why: '2⁶ = 64 < 100 ≤ 2⁷ = 128, so 7 flip-flops.' }
            ]
          },
          {
            id: 'fe-arch', title: 'Computer architecture, networks & software', min: 11, teaser: 'Memory hierarchy, cache math, protocols, software basics.',
            pre: ['fe-seq'], links: ['sys-run', 'net-layers'],
            cards: [
              { t: 'read', h: 'Architecture', body: '<p>Memory hierarchy: registers → cache (L1/L2/L3) → RAM → SSD/disk, each slower and bigger. Caches exploit <b>locality</b> (recently used and nearby data). <b>AMAT</b> = hit time + miss rate × miss penalty. Pipelining overlaps instruction stages; hazards (data, control, structural) cause stalls. RISC (simple, fixed-length instructions) vs CISC (complex, variable). Interrupts let devices get the CPU\'s attention; DMA moves data without the CPU.</p>' },
              { t: 'read', h: 'Networks and software on the FE', body: '<p>Expect OSI/TCP-IP layers, IP addressing and subnetting, error detection (parity, CRC, checksums), and basic security (encryption, firewalls). Software engineering items: data structures, algorithm complexity, flowcharts and pseudocode, testing. You\'ve covered all of this in Computer Science.</p>' },
              { t: 'gen', g: 'feCache' }, { t: 'gen', g: 'netSubnet' }, { t: 'gen', g: 'netLayer' }, { t: 'gen', g: 'csBigO' }
            ]
          }
        ]
      },
      {
        name: 'Unit 6 · Signals, systems, controls & communications', tag: 'systems',
        blurb: 'Laplace, transfer functions, sampling, Fourier, feedback control, modulation.',
        lessons: [
          {
            id: 'fe-signals', title: 'Signals, Laplace & sampling', min: 12, teaser: 'Transfer functions, poles, Fourier and Nyquist.',
            pre: ['fe-trans', 'fe-math'], links: ['fe-controls'],
            cards: [
              { t: 'read', h: 'Laplace and transfer functions', body: '<p>The Laplace transform turns differential equations into algebra (the handbook has the table). In the s-domain: Z<sub>R</sub> = R, Z<sub>L</sub> = sL, Z<sub>C</sub> = 1/(sC). A <b>transfer function</b> H(s) = output/input. <b>Poles</b> (roots of the denominator) set behavior: all poles in the left half-plane = stable. Final value theorem: f(∞) = lim<sub>s→0</sub> sF(s).</p>' },
              { t: 'read', h: 'Fourier and sampling', body: '<p>Fourier series/transforms describe a signal as a sum of frequencies. Convolution in time = multiplication in frequency. Sampling: <b>f<sub>s</sub> > 2f<sub>max</sub></b> (Nyquist) or high frequencies alias. Anti-aliasing filters go before the ADC. An n-bit ADC has 2ⁿ levels; resolution = range/2ⁿ.</p>', mem: 'Stable: poles in the left half-plane. Sample at > 2× fmax.' },
              { t: 'gen', g: 'feNyquist' }, { t: 'gen', g: 'feNyquist' },
              { t: 'calc', q: 'A 10-bit ADC measures 0–5 V. Resolution (smallest step) in mV? (Use range / 2ⁿ)', a: 4.88, tol: 0.05, why: '5 V / 1024 = 4.88 mV.' }
            ]
          },
          {
            id: 'fe-controls', title: 'Feedback control & communications', min: 11, teaser: 'Closed loops, steady-state error, modulation and bandwidth.',
            pre: ['fe-signals'], links: ['fe-arch'],
            cards: [
              { t: 'read', h: 'Feedback control', body: '<p>Closed loop with forward gain G(s) and feedback H(s): <b>T(s) = G/(1 + GH)</b>. Feedback reduces sensitivity and error. Second-order systems are described by natural frequency ω<sub>n</sub> and damping ratio ζ: ζ < 1 underdamped (overshoot), = 1 critically damped, > 1 overdamped. PID controllers: P reduces error, I removes steady-state error, D adds damping. Bode plots and gain/phase margins measure stability.</p>', mem: 'Closed loop: G / (1 + GH).' },
              { t: 'read', h: 'Communications', body: '<p>AM varies amplitude, FM varies frequency, PM varies phase. Digital schemes: ASK, FSK, PSK, QAM. <b>Shannon capacity</b> C = B log₂(1 + SNR) is the max error-free bit rate over bandwidth B. Noise is often given in dB, so convert SNR first.</p>' },
              { t: 'calc', q: 'G = 10, H = 1 (unity feedback). Closed-loop gain?', a: 0.909, tol: 0.005, why: 'T = G/(1 + GH) = 10/11 = 0.909. Higher G pushes T toward 1/H.' },
              { t: 'calc', q: 'Bandwidth 1 MHz, SNR = 15 (linear). Shannon capacity in Mbps?', a: 4, tol: 0.01, why: 'C = 1×10⁶ × log₂(16) = 4 Mbps.' }
            ]
          }
        ]
      }
    ]
  });
})();
