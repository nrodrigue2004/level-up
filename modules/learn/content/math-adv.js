/* Math past Algebra 1: Algebra 2, Trigonometry, Precalculus, Calculus I, Linear algebra basics.
   Backbone: OpenStax Algebra and Trigonometry 2e, Precalculus 2e, Calculus Volume 1 (all CC BY 4.0, openstax.org),
   rewritten plainly. Every numeric problem is generated fresh. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'math'; })[0]; if (!S) return;
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function nz(a, b) { var x = 0; while (!x) x = r(a, b); return x; }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }
  function calc(q, a, why, tol) { return { t: 'calc', q: q, a: a, tol: tol == null ? 0.01 : tol, why: why }; }
  function sg(n) { return n < 0 ? '− ' + (-n) : '+ ' + n; }
  function poly(a, b, c) { var s = (a === 1 ? '' : a === -1 ? '−' : a) + 'x²'; if (b) s += ' ' + (b < 0 ? '− ' : '+ ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x'; if (c) s += ' ' + sg(c); return s; }

  G.maQuad = function () {
    var p = nz(-9, 9), q = nz(-9, 9); while (q === p) q = nz(-9, 9);
    var b = -(p + q), c = p * q, big = Math.max(p, q), small = Math.min(p, q);
    return calc('Solve <b>' + poly(1, b, c) + ' = 0</b>. Enter the LARGER solution.', big, 'Factor: find two numbers that multiply to ' + c + ' and add to ' + b + ': ' + (-p) + ' and ' + (-q) + '. So (x ' + sg(-p) + ')(x ' + sg(-q) + ') = 0 → x = ' + p + ' or x = ' + q + '. Larger: ' + big + '. Check: ' + big + '² ' + sg(b) + '·' + big + ' ' + sg(c) + ' = 0. (Smaller root: ' + small + '.)');
  };
  G.maDisc = function () {
    var a = nz(1, 4), b = r(-8, 8), c = r(-6, 6), D = b * b - 4 * a * c, n = D > 0 ? '2 real solutions' : D === 0 ? '1 real solution (repeated)' : 'No real solutions (2 complex)';
    return mc('How many real solutions does <b>' + poly(a, b, c) + ' = 0</b> have?', n, ['2 real solutions', '1 real solution (repeated)', 'No real solutions (2 complex)'], 'Discriminant b² − 4ac = ' + (b * b) + ' − ' + (4 * a * c) + ' = ' + D + '. Positive → 2, zero → 1, negative → none real. It\'s the part under the square root in the quadratic formula x = (−b ± √(b² − 4ac)) / 2a.');
  };
  G.maLog = function () {
    var k = r(0, 3);
    if (k === 0) { var b = pk([2, 3, 5, 10]), e = r(1, b === 2 ? 10 : 4); return calc('Evaluate <b>log<sub>' + b + '</sub>(' + Math.pow(b, e) + ')</b>.', e, 'log<sub>' + b + '</sub>(x) asks "' + b + ' to what power gives x?" ' + b + '^' + e + ' = ' + Math.pow(b, e) + ', so the answer is ' + e + '.'); }
    if (k === 1) { var m = r(2, 6), n = r(2, 6); return calc('If log(a) = ' + m + ' and log(b) = ' + n + ', what is <b>log(a·b)</b>?', m + n, 'Product rule: log(ab) = log a + log b = ' + (m + n) + '. Quotient: log(a/b) = log a − log b. Power: log(aⁿ) = n log a.'); }
    if (k === 2) { var r2 = pk([2, 4, 5, 7, 10]), d = Math.log(2) / Math.log(1 + r2 / 100); return calc('Money grows at ' + r2 + '% per year compounded yearly. Exactly how many years to double? (2 decimals)', Math.round(d * 100) / 100, 'Solve (1 + ' + (r2 / 100) + ')^t = 2 → t = ln 2 / ln(1 + ' + (r2 / 100) + ') = ' + d.toFixed(2) + '. (Rule of 72 estimate: ' + (72 / r2).toFixed(1) + '.) Logs are how you solve for an exponent.', 0.02); }
    var x = r(1, 4); return calc('Solve <b>2<sup>x+' + x + '</sup> = ' + Math.pow(2, x + 3) + '</b>.', 3, 'Write ' + Math.pow(2, x + 3) + ' as 2^' + (x + 3) + '. Same base, so exponents match: x + ' + x + ' = ' + (x + 3) + ' → x = 3.');
  };
  G.maSystem = function () {
    var x = r(-5, 5), y = r(-5, 5), a = nz(1, 4), b = nz(-4, 4), c = nz(1, 4), d = nz(-4, 4); while (a * d - b * c === 0) d = nz(-4, 4);
    var e1 = a * x + b * y, e2 = c * x + d * y;
    function term(k, v, first) { var s = (k < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + (Math.abs(k) === 1 ? '' : Math.abs(k)) + v; return s; }
    return calc('Solve the system. Enter <b>x</b>.<br><b>' + term(a, 'x', true) + term(b, 'y') + ' = ' + e1 + '</b><br><b>' + term(c, 'x', true) + term(d, 'y') + ' = ' + e2 + '</b>', x, 'Elimination or substitution gives x = ' + x + ', y = ' + y + '. Check both: ' + a + '(' + x + ') + ' + b + '(' + y + ') = ' + e1 + ' ✓. Cramer\'s rule: x = (' + e1 + '·' + d + ' − ' + b + '·' + e2 + ') / (' + a + '·' + d + ' − ' + b + '·' + c + ').');
  };
  var EXACT = { 0: ['0', '1', '0'], 30: ['1/2', '√3/2', '√3/3'], 45: ['√2/2', '√2/2', '1'], 60: ['√3/2', '1/2', '√3'], 90: ['1', '0', 'undefined'] };
  G.maUnit = function () {
    var ang = pk([0, 30, 45, 60, 90]), f = r(0, 2), fn = ['sin', 'cos', 'tan'][f];
    return mc('Exact value of <b>' + fn + '(' + ang + '°)</b>?', EXACT[ang][f], ['0', '1', '1/2', '√2/2', '√3/2', '√3', '√3/3', 'undefined'], fn + '(' + ang + '°) = ' + EXACT[ang][f] + '. Memory trick for sin at 0°, 30°, 45°, 60°, 90°: √0/2, √1/2, √2/2, √3/2, √4/2. Cos runs the same list backward. tan = sin/cos.');
  };
  G.maTri = function () {
    var ang = pk([20, 25, 30, 35, 40, 50, 55, 60]), h = r(5, 20), k = r(0, 2), rad = ang * Math.PI / 180;
    if (k === 0) return calc('Right triangle: hypotenuse ' + h + ', angle ' + ang + '°. Length of the side OPPOSITE the angle? (2 decimals)', Math.round(h * Math.sin(rad) * 100) / 100, 'SOH: sin = opposite/hypotenuse → opposite = ' + h + ' × sin ' + ang + '° = ' + (h * Math.sin(rad)).toFixed(2) + '. (Calculator in DEGREE mode.)', 0.02);
    if (k === 1) return calc('Right triangle: hypotenuse ' + h + ', angle ' + ang + '°. Length of the ADJACENT side? (2 decimals)', Math.round(h * Math.cos(rad) * 100) / 100, 'CAH: cos = adjacent/hypotenuse → adjacent = ' + h + ' × cos ' + ang + '° = ' + (h * Math.cos(rad)).toFixed(2) + '.', 0.02);
    var adj = r(5, 30); return calc('You stand ' + adj + ' m from a tower and look up at ' + ang + '° to the top. How tall is it (m, 2 decimals, ignore eye height)?', Math.round(adj * Math.tan(rad) * 100) / 100, 'TOA: tan = opposite/adjacent → height = ' + adj + ' × tan ' + ang + '° = ' + (adj * Math.tan(rad)).toFixed(2) + ' m.', 0.02);
  };
  G.maRad = function () {
    var d = pk([30, 45, 60, 90, 120, 135, 150, 180, 270, 360]), names = { 30: 'π/6', 45: 'π/4', 60: 'π/3', 90: 'π/2', 120: '2π/3', 135: '3π/4', 150: '5π/6', 180: 'π', 270: '3π/2', 360: '2π' };
    return mc('Convert <b>' + d + '°</b> to radians.', names[d], Object.keys(names).map(function (k) { return names[k]; }), 'Multiply by π/180: ' + d + ' × π/180 = ' + names[d] + '. A full circle is 2π radians; a radian is the angle where the arc length equals the radius.');
  };
  G.maDeriv = function () {
    var k = r(0, 2), a = nz(1, 6), n = r(2, 5), b = nz(-9, 9), x0 = r(-3, 3);
    if (k === 0) { var v = a * n * Math.pow(x0, n - 1) + b; return calc('f(x) = ' + a + 'x<sup>' + n + '</sup> ' + sg(b) + 'x. What is <b>f′(' + x0 + ')</b> (the slope at x = ' + x0 + ')?', v, 'Power rule: d/dx xⁿ = n xⁿ⁻¹. f′(x) = ' + (a * n) + 'x<sup>' + (n - 1) + '</sup> ' + sg(b) + '. At x = ' + x0 + ': ' + (a * n) + '·' + Math.pow(x0, n - 1) + ' ' + sg(b) + ' = ' + v + '.'); }
    if (k === 1) return mc('Derivative of <b>' + a + 'x<sup>' + n + '</sup></b>?', (a * n) + 'x' + (n - 1 > 1 ? '^' + (n - 1) : ''), [a + 'x^' + (n - 1), (a * n) + 'x^' + n, (a * n * (n - 1)) + 'x' + (n - 2 > 1 ? '^' + (n - 2) : ''), a + 'x^' + (n + 1)], 'Bring the exponent down and subtract one: ' + a + '·' + n + ' x^' + (n - 1) + '.');
    var f = pk([['sin x', 'cos x'], ['cos x', '−sin x'], ['eˣ', 'eˣ'], ['ln x', '1/x'], ['e^(' + a + 'x)', a + 'e^(' + a + 'x)'], ['sin(' + a + 'x)', a + 'cos(' + a + 'x)']]);
    return mc('Derivative of <b>' + f[0] + '</b>?', f[1], ['cos x', '−sin x', 'eˣ', '1/x', 'sin x', '−cos x', 'x eˣ⁻¹', a + 'e^(' + a + 'x)', a + 'cos(' + a + 'x)'], 'Know these cold: (sin x)′ = cos x, (cos x)′ = −sin x, (eˣ)′ = eˣ, (ln x)′ = 1/x. Chain rule: multiply by the derivative of the inside (that\'s where the ' + a + ' comes from).');
  };
  G.maInteg = function () {
    var a = nz(1, 6), n = r(1, 3), k = r(1, 4), v = a * Math.pow(k, n + 1) / (n + 1);
    return calc('Evaluate <b>∫<sub>0</sub><sup>' + k + '</sup> ' + a + 'x<sup>' + n + '</sup> dx</b>. (2 decimals)', Math.round(v * 100) / 100, 'Antiderivative: ' + a + 'x<sup>' + (n + 1) + '</sup>/' + (n + 1) + '. Fundamental theorem: plug in ' + k + ' and subtract the value at 0: ' + a + '·' + Math.pow(k, n + 1) + '/' + (n + 1) + ' = ' + v.toFixed(2) + '. That\'s the area under the curve from 0 to ' + k + '.', 0.02);
  };
  G.maLimit = function () {
    var a = nz(-6, 6), k = r(0, 1);
    if (k === 0) return calc('Find <b>lim<sub>x→' + a + '</sub> (x² − ' + (a * a) + ') / (x ' + sg(-a) + ')</b>.', 2 * a, 'Plugging in gives 0/0, so simplify: x² − ' + (a * a) + ' = (x − ' + (a < 0 ? '(' + a + ')' : a) + ')(x + ' + (a < 0 ? '(' + a + ')' : a) + '). Cancel → x + ' + (a < 0 ? '(' + a + ')' : a) + ' → ' + (2 * a) + ' as x → ' + a + '.');
    var c = nz(1, 9), d = nz(1, 9); return mc('Find <b>lim<sub>x→∞</sub> (' + c + 'x² + 1) / (' + d + 'x² − x)</b>.', (c % d === 0 ? String(c / d) : c + '/' + d), ['0', '∞', '1', String(c), String(d)], 'Same highest power top and bottom → ratio of leading coefficients: ' + c + '/' + d + '. Higher power on top → ∞; higher on bottom → 0.');
  };
  G.maMatrix = function () {
    var a = r(-5, 5), b = r(-5, 5), c = r(-5, 5), d = r(-5, 5), k = r(0, 1);
    if (k === 0) return calc('Determinant of the matrix [[' + a + ', ' + b + '], [' + c + ', ' + d + ']]?', a * d - b * c, 'For 2×2: ad − bc = (' + a + ')(' + d + ') − (' + b + ')(' + c + ') = ' + (a * d - b * c) + '. Zero means the matrix squashes space flat and has no inverse.');
    var x = r(-4, 4), y = r(-4, 4); return calc('[[' + a + ', ' + b + '], [' + c + ', ' + d + ']] × [' + x + ', ' + y + ']. What is the FIRST entry of the result?', a * x + b * y, 'Row 1 · vector = ' + a + '·' + x + ' + ' + b + '·' + y + ' = ' + (a * x + b * y) + '. Matrix-vector multiplication is how graphics transform shapes and how neural networks compute each layer.');
  };

  var units = [
    {
      name: 'Unit 7 · Algebra 2', tag: 'HS / college',
      blurb: 'Quadratics, systems, exponentials and logarithms, functions.',
      lessons: [
        {
          id: 'ma-quad', title: 'Quadratics: factor, formula, discriminant', min: 12, teaser: 'Parabolas and the three ways to solve them.',
          pre: ['m-eq1'], links: ['ma-func', 'ma-log'],
          cards: [
            { t: 'read', h: 'Three ways to solve ax² + bx + c = 0', body: '<ol><li><b>Factor</b>: rewrite as (x − p)(x − q) = 0, so x = p or q. Fastest when it works.</li><li><b>Quadratic formula</b>: x = (−b ± √(b² − 4ac)) / 2a. Always works.</li><li><b>Complete the square</b>: rewrite as a(x − h)² + k; also gives the vertex (h, k).</li></ol><p>The <b>discriminant</b> b² − 4ac tells you how many real solutions before you solve. The graph is a <b>parabola</b>: up if a > 0, down if a < 0; the solutions are where it crosses the x-axis. Projectiles follow parabolas.</p>', mem: 'x = (−b ± √(b² − 4ac)) / 2a.' },
            { t: 'gen', g: 'maQuad' }, { t: 'gen', g: 'maQuad' }, { t: 'gen', g: 'maDisc' }, { t: 'gen', g: 'maDisc' },
            { t: 'explain', q: 'Explain what the discriminant tells you and why.', points: ['It is b² − 4ac, under the square root in the formula', 'Positive: two real solutions (± gives two values)', 'Zero: one repeated solution', 'Negative: no real square root, so no real solutions'] }
          ]
        },
        {
          id: 'ma-systems', title: 'Systems of equations', min: 10, teaser: 'Two unknowns, two equations: substitution and elimination.',
          pre: ['ma-quad'], links: ['ma-matrix'],
          cards: [
            { t: 'read', h: 'Methods', body: '<ul><li><b>Substitution</b>: solve one equation for a variable, plug into the other.</li><li><b>Elimination</b>: multiply equations so adding them cancels a variable.</li><li><b>Graphing</b>: the solution is where the lines cross. Parallel lines → no solution; same line → infinitely many.</li><li><b>Matrices</b>: the same problem as A·x = b, which is how computers solve thousands of equations at once (and how circuit nodal analysis works).</li></ul>' },
            { t: 'gen', g: 'maSystem' }, { t: 'gen', g: 'maSystem' }, { t: 'gen', g: 'maSystem' }
          ]
        },
        {
          id: 'ma-log', title: 'Exponentials & logarithms', min: 12, teaser: 'Growth, decay, and solving for exponents.',
          pre: ['m-exp'], links: ['life-invest', 'dm-count'],
          cards: [
            { t: 'read', h: 'Exponential functions', body: '<p>f(x) = a·bˣ grows (b > 1) or decays (0 < b < 1) by the same <b>factor</b> each step: compound interest, population, viruses, radioactive decay, password search spaces. Continuous growth uses <b>e ≈ 2.718</b>: A = Pe<sup>rt</sup>.</p>' },
            { t: 'read', h: 'Logarithms undo exponents', body: '<p>log<sub>b</sub>(x) = y means b<sup>y</sup> = x. log = base 10, ln = base e, and CS loves log<sub>2</sub> (bits, binary search).</p><ul><li>log(ab) = log a + log b</li><li>log(a/b) = log a − log b</li><li>log(aⁿ) = n log a (this one lets you solve for exponents)</li><li>Change of base: log<sub>b</sub>x = ln x / ln b</li></ul><p>Decibels, pH and the Richter scale are all log scales: each step is a multiple, not an addition.</p>', mem: 'A log asks: what power?' },
            { t: 'gen', g: 'maLog' }, { t: 'gen', g: 'maLog' }, { t: 'gen', g: 'maLog' }, { t: 'gen', g: 'maLog' }
          ]
        },
        {
          id: 'ma-func', title: 'Functions & transformations', min: 10, teaser: 'Domain, range, inverses, shifting graphs.',
          pre: ['ma-quad'], links: ['ma-calc-deriv'],
          cards: [
            { t: 'read', h: 'Functions', body: '<p>A <b>function</b> gives exactly one output per input. <b>Domain</b> = allowed inputs (no dividing by zero, no square roots of negatives in the reals); <b>range</b> = possible outputs. <b>Composition</b> (f∘g)(x) = f(g(x)). An <b>inverse</b> f⁻¹ undoes f; it exists if f is one-to-one.</p><p><b>Transformations</b> of y = f(x): f(x) + k shifts up, f(x − h) shifts RIGHT by h, −f(x) flips over the x-axis, a·f(x) stretches vertically.</p>' },
            { t: 'mcq', q: 'How does the graph of y = (x − 3)² compare to y = x²?', opts: ['Shifted left 3', 'Shifted right 3', 'Shifted up 3', 'Shifted down 3'], a: 1, why: 'Inside the function, x − h moves it right by h. It feels backwards: the vertex is now at x = 3.' },
            { t: 'mcq', q: 'What is the domain of f(x) = 1/(x − 2)?', opts: ['All real numbers', 'All reals except 2', 'x > 2', 'x ≥ 0'], a: 1, why: 'x = 2 would divide by zero.' }
          ]
        }
      ]
    },
    {
      name: 'Unit 8 · Trigonometry', tag: 'HS / college',
      blurb: 'Right triangles, the unit circle, radians, waves.',
      lessons: [
        {
          id: 'ma-trig', title: 'Right-triangle trig: SOH CAH TOA', min: 10, teaser: 'Find any side or angle.',
          pre: ['m-pyth'], links: ['ma-unit'],
          cards: [
            { t: 'read', h: 'The ratios', body: '<p>For an angle θ in a right triangle: <b>sin θ = opposite/hypotenuse</b>, <b>cos θ = adjacent/hypotenuse</b>, <b>tan θ = opposite/adjacent</b>. Mnemonic: SOH CAH TOA. To find an angle, use the inverse: θ = sin⁻¹(opp/hyp).</p><p>For any triangle (not just right): <b>Law of Sines</b> a/sin A = b/sin B = c/sin C; <b>Law of Cosines</b> c² = a² + b² − 2ab cos C (the Pythagorean theorem with a correction).</p>', mem: 'SOH CAH TOA.' },
            { t: 'gen', g: 'maTri' }, { t: 'gen', g: 'maTri' }, { t: 'gen', g: 'maTri' }
          ]
        },
        {
          id: 'ma-unit', title: 'The unit circle, radians & waves', min: 11, teaser: 'Why sine and cosine describe every wave.',
          pre: ['ma-trig'], links: ['fe-ac', 'mu-rhythm'],
          cards: [
            { t: 'read', h: 'Unit circle', body: '<p>On a circle of radius 1, the point at angle θ is <b>(cos θ, sin θ)</b>. That extends trig to any angle, including negative ones and past 360°. Signs by quadrant: "All Students Take Calculus" (I: all positive, II: sin, III: tan, IV: cos).</p><p><b>Radians</b>: 180° = π. Calculus and physics always use radians.</p><p><b>Waves</b>: y = A sin(2πft + φ): amplitude A, frequency f, phase φ. AC power, sound and radio signals are all sine waves; that\'s why FE circuits uses phasors.</p>' },
            { t: 'gen', g: 'maUnit' }, { t: 'gen', g: 'maUnit' }, { t: 'gen', g: 'maUnit' }, { t: 'gen', g: 'maRad' }, { t: 'gen', g: 'maRad' },
            { t: 'tf', q: 'sin²θ + cos²θ = 1 for every angle θ.', a: true, why: 'It\'s the Pythagorean theorem on the unit circle: x² + y² = 1.' }
          ]
        }
      ]
    },
    {
      name: 'Unit 9 · Calculus I', tag: 'college',
      blurb: 'Limits, derivatives, integrals: the math of change.',
      lessons: [
        {
          id: 'ma-calc-limit', title: 'Limits & what calculus is for', min: 10, teaser: 'Getting infinitely close.',
          pre: ['ma-func'], links: ['ma-calc-deriv'],
          cards: [
            { t: 'read', h: 'The big idea', body: '<p>Calculus has two halves: <b>derivatives</b> (how fast something changes at an instant: speed, slope, rate) and <b>integrals</b> (accumulating lots of tiny pieces: area, distance, total). Both are built on <b>limits</b>: what value does f(x) approach as x gets closer and closer to a point?</p><p>Techniques: plug in; if you get 0/0, factor and cancel, or rationalize. At infinity, compare the highest powers.</p>' },
            { t: 'gen', g: 'maLimit' }, { t: 'gen', g: 'maLimit' }, { t: 'gen', g: 'maLimit' }
          ]
        },
        {
          id: 'ma-calc-deriv', title: 'Derivatives & their rules', min: 13, teaser: 'Power, product, chain, and real rates of change.',
          pre: ['ma-calc-limit'], links: ['ma-calc-int', 'fe-math'],
          cards: [
            { t: 'read', h: 'Definition and rules', body: '<p>f′(x) = lim<sub>h→0</sub> [f(x + h) − f(x)] / h: the slope of the tangent line.</p><ul><li><b>Power</b>: (xⁿ)′ = n xⁿ⁻¹. Constants → 0.</li><li><b>Sum</b>: differentiate term by term.</li><li><b>Product</b>: (fg)′ = f′g + fg′.</li><li><b>Quotient</b>: (f/g)′ = (f′g − fg′)/g².</li><li><b>Chain</b>: (f(g(x)))′ = f′(g(x))·g′(x).</li><li>(sin x)′ = cos x, (cos x)′ = −sin x, (eˣ)′ = eˣ, (ln x)′ = 1/x.</li></ul>', mem: 'Power rule: bring down, subtract one.' },
            { t: 'read', h: 'Using them', body: '<p>If position is s(t), velocity is s′(t) and acceleration is s″(t). To <b>optimize</b> (max profit, min material, fastest route), set f′(x) = 0 and check those points. In electronics, i = C dv/dt and v = L di/dt are derivatives. In machine learning, training is just following derivatives downhill (gradient descent).</p>' },
            { t: 'gen', g: 'maDeriv' }, { t: 'gen', g: 'maDeriv' }, { t: 'gen', g: 'maDeriv' }, { t: 'gen', g: 'maDeriv' },
            { t: 'explain', q: 'Explain what a derivative means in plain words, with a real example.', points: ['It is the instantaneous rate of change', 'Geometrically, the slope of the tangent line', 'Example: velocity is the derivative of position', 'Setting it to zero finds maxima/minima'] }
          ]
        },
        {
          id: 'ma-calc-int', title: 'Integrals & the Fundamental Theorem', min: 12, teaser: 'Area under curves, and why it\'s the reverse of slope.',
          pre: ['ma-calc-deriv'], links: ['fe-trans'],
          cards: [
            { t: 'read', h: 'Integrals', body: '<p>The <b>definite integral</b> ∫<sub>a</sub><sup>b</sup> f(x) dx adds up infinitely thin rectangles: the area under f from a to b (area below the axis counts negative).</p><p>The <b>Fundamental Theorem of Calculus</b>: if F′ = f, then ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a). Integrating is un-differentiating.</p><ul><li>∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1)</li><li>∫ 1/x dx = ln|x| + C</li><li>∫ eˣ dx = eˣ + C; ∫ cos x dx = sin x + C; ∫ sin x dx = −cos x + C</li></ul><p>Uses: distance from a speed graph, total energy from power, average value of a signal, probability from a density curve.</p>', mem: '∫ₐᵇ f = F(b) − F(a).' },
            { t: 'gen', g: 'maInteg' }, { t: 'gen', g: 'maInteg' }, { t: 'gen', g: 'maInteg' }
          ]
        }
      ]
    },
    {
      name: 'Unit 10 · Linear algebra basics', tag: 'college',
      blurb: 'Vectors and matrices: the math under graphics, ML and circuit solving.',
      lessons: [
        {
          id: 'ma-matrix', title: 'Vectors, matrices & determinants', min: 11, teaser: 'Arrows, grids of numbers, and transformations.',
          pre: ['ma-systems'], links: ['ai-llm', 'fe-thev'],
          cards: [
            { t: 'read', h: 'Vectors', body: '<p>A <b>vector</b> has magnitude and direction, written as a list: v = [3, 4], length √(3² + 4²) = 5. Add component by component. The <b>dot product</b> a·b = a₁b₁ + a₂b₂ measures how aligned two vectors are (0 = perpendicular). AI models represent words as vectors with hundreds of components; similar meanings point in similar directions.</p>' },
            { t: 'read', h: 'Matrices', body: '<p>A <b>matrix</b> is a grid of numbers that transforms vectors: rotate, scale, shear. Multiply a matrix by a vector: each output entry is a row dotted with the vector. <b>Determinant</b> (2×2: ad − bc) tells how much the transformation scales area; 0 means it collapses space and the matrix has no inverse (the system has no unique solution).</p>' },
            { t: 'gen', g: 'maMatrix' }, { t: 'gen', g: 'maMatrix' }, { t: 'gen', g: 'maMatrix' }
          ]
        }
      ]
    }
  ];
  units.forEach(function (u) { S.units.push(u); });
  S.blurb = 'Arithmetic to calculus, rebuilt.';
})();
