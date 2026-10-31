/* K-12 Math refresh: number sense through Algebra 1, geometry and stats.
   Backbone: OpenStax Prealgebra 2e / Elementary Algebra 2e (CC BY 4.0, openstax.org), rewritten in plain words.
   `gen` cards call generators below, so practice never repeats the same numbers. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function frac(n, d) { var g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : n + '/' + d; }
  function calc(q, a, why, tol) { return { t: 'calc', q: q, a: a, tol: tol == null ? 0.001 : tol, why: why }; }
  function mc(q, right, wrongs, why) {
    var seen = {}, opts = [right]; seen[right] = 1;
    wrongs.forEach(function (w) { if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
    return { t: 'mcq', q: q, opts: opts, a: 0, why: why };
  }

  // ---- generators ----
  G.mathOps = function () {
    var a = r(2, 9), b = r(2, 9), c = r(2, 9), d = r(1, 9), k = r(0, 2), q, ans, why;
    if (k === 0) { q = a + ' + ' + b + ' × ' + c; ans = a + b * c; why = 'Multiply first: ' + b + ' × ' + c + ' = ' + (b * c) + ', then add ' + a + ' to get ' + ans + '.'; }
    else if (k === 1) { q = '(' + a + ' + ' + b + ') × ' + c; ans = (a + b) * c; why = 'Parentheses first: ' + a + ' + ' + b + ' = ' + (a + b) + ', then × ' + c + ' = ' + ans + '.'; }
    else { q = a * c + ' ÷ ' + c + ' + ' + d + '²'; ans = a + d * d; why = 'Exponent first: ' + d + '² = ' + (d * d) + '. Then divide: ' + (a * c) + ' ÷ ' + c + ' = ' + a + '. Add: ' + ans + '.'; }
    return calc('Work it out using order of operations: <b>' + q + '</b>', ans, why);
  };
  G.mathNeg = function () {
    var a = r(-12, 12), b = r(-12, 12), op = pk(['+', '−', '×']), ans;
    if (op === '+') ans = a + b; else if (op === '−') ans = a - b; else ans = a * b;
    var bs = b < 0 ? '(' + b + ')' : String(b);
    var why = op === '×' ? 'Signs: same signs give a positive, different signs give a negative. ' + a + ' × ' + bs + ' = ' + ans + '.'
      : op === '−' ? 'Subtracting a number is the same as adding its opposite: ' + a + ' + (' + (-b) + ') = ' + ans + '.'
        : 'Picture a number line: start at ' + a + ' and move ' + (b < 0 ? 'left ' + (-b) : 'right ' + b) + '. You land on ' + ans + '.';
    return calc('What is <b>' + a + ' ' + op + ' ' + bs + '</b>?', ans, why);
  };
  G.mathRound = function () {
    var n = r(1000, 99999) + r(0, 99) / 100, place = pk([['ten', 10], ['hundred', 100], ['thousand', 1000]]);
    var ans = Math.round(n / place[1]) * place[1];
    return calc('Round <b>' + n.toFixed(2) + '</b> to the nearest ' + place[0] + '.', ans, 'Look at the digit just to the right of the ' + place[0] + 's place. 5 or more rounds up, 4 or less stays. Answer: ' + ans + '.');
  };
  G.mathFracAdd = function () {
    var d1 = pk([2, 3, 4, 5, 6, 8]), d2 = pk([2, 3, 4, 5, 6, 8]), n1 = r(1, d1 - 1), n2 = r(1, d2 - 1);
    var N = n1 * d2 + n2 * d1, D = d1 * d2, right = frac(N, D);
    var w = [frac(n1 + n2, d1 + d2), frac(n1 * n2, D), frac(N + 1, D), frac(n1 + n2, Math.max(d1, d2))];
    return mc('Add: <b>' + n1 + '/' + d1 + ' + ' + n2 + '/' + d2 + '</b> (simplified)', right, w,
      'Get a common denominator: ' + n1 + '/' + d1 + ' = ' + (n1 * d2) + '/' + D + ' and ' + n2 + '/' + d2 + ' = ' + (n2 * d1) + '/' + D + '. Add the tops: ' + N + '/' + D + ', which simplifies to ' + right + '. You never add the bottoms.');
  };
  G.mathFracMul = function () {
    var a = r(1, 7), b = r(2, 9), c = r(1, 7), d = r(2, 9), div = Math.random() < .5;
    var right = div ? frac(a * d, b * c) : frac(a * c, b * d);
    var w = div ? [frac(a * c, b * d), frac(b * c, a * d), frac(a + c, b + d)] : [frac(a * d, b * c), frac(a + c, b + d), frac(a * c, b + d)];
    return mc((div ? 'Divide' : 'Multiply') + ': <b>' + a + '/' + b + (div ? ' ÷ ' : ' × ') + c + '/' + d + '</b>', right, w,
      div ? 'Dividing = flip the second fraction and multiply ("keep, change, flip"): ' + a + '/' + b + ' × ' + d + '/' + c + ' = ' + right + '.'
        : 'Multiply straight across: tops ' + a + '×' + c + ', bottoms ' + b + '×' + d + ', then simplify to ' + right + '.');
  };
  G.mathPercent = function () {
    var k = r(0, 2), p, n, ans, q, why;
    if (k === 0) { p = pk([10, 15, 18, 20, 25, 30, 40]); n = r(2, 40) * 5; ans = p * n / 100; q = 'What is <b>' + p + '% of ' + n + '</b>?'; why = p + '% means ' + p + ' per 100, so multiply by ' + (p / 100) + ': ' + n + ' × ' + (p / 100) + ' = ' + ans + '.'; }
    else if (k === 1) { p = pk([10, 20, 25, 30, 40, 50]); n = r(4, 30) * 5; ans = n * (1 - p / 100); q = 'A $' + n + ' hoodie is <b>' + p + '% off</b>. What do you pay (in dollars)?'; why = 'Discount = ' + p + '% of ' + n + ' = ' + (n * p / 100) + '. Price = ' + n + ' − ' + (n * p / 100) + ' = ' + ans + '. Shortcut: pay ' + (100 - p) + '% → ' + n + ' × ' + ((100 - p) / 100) + '.'; }
    else { n = r(2, 20) * 10; var part = n * pk([1, 2, 3, 4]) / 5; ans = part / n * 100; q = '<b>' + part + '</b> is what percent of <b>' + n + '</b>?'; why = 'Part ÷ whole × 100: ' + part + ' ÷ ' + n + ' = ' + (part / n) + ' → ' + ans + '%.'; }
    return calc(q, ans, why, 0.01);
  };
  G.mathTip = function () {
    var bill = r(12, 90) + pk([0, .5, .25, .75]), p = pk([15, 18, 20]), ans = Math.round(bill * p) / 100;
    return calc('Your bill is <b>$' + bill.toFixed(2) + '</b>. Leave a <b>' + p + '% tip</b>. How much is the tip?', ans, 'Tip = bill × ' + (p / 100) + ' = $' + ans.toFixed(2) + '. Mental trick: 10% is just moving the decimal (' + (bill / 10).toFixed(2) + '), then scale from there.', 0.02);
  };
  G.mathRate = function () {
    var things = pk([['miles', 'hours', 'miles per hour'], ['dollars', 'pounds', 'dollars per pound'], ['words', 'minutes', 'words per minute']]);
    var per = r(3, 15), n = r(2, 9), total = per * n;
    return calc('You cover <b>' + total + ' ' + things[0] + '</b> in <b>' + n + ' ' + things[1] + '</b>. What is the unit rate (' + things[2] + ')?', per, 'Unit rate = divide to get "per one": ' + total + ' ÷ ' + n + ' = ' + per + ' ' + things[2] + '.');
  };
  G.mathProp = function () {
    var a = r(2, 9), b = a * r(2, 5), c = r(2, 12), x = b * c / a;
    if (x !== Math.round(x)) { c = a * r(1, 4); x = b * c / a; }
    return calc('Solve the proportion: <b>' + a + '/' + b + ' = ' + c + '/x</b>. What is x?', x, 'Cross-multiply: ' + a + 'x = ' + b + ' × ' + c + ' = ' + (b * c) + ', so x = ' + (b * c) + ' ÷ ' + a + ' = ' + x + '.');
  };
  G.mathEq1 = function () {
    var x = r(-9, 12), a = r(2, 9), b = r(-15, 15), c = a * x + b;
    var bs = b < 0 ? ' − ' + (-b) : ' + ' + b;
    return calc('Solve for x: <b>' + a + 'x' + bs + ' = ' + c + '</b>', x, 'Undo in reverse order. ' + (b < 0 ? 'Add ' + (-b) : 'Subtract ' + b) + ' from both sides: ' + a + 'x = ' + (c - b) + '. Divide both sides by ' + a + ': x = ' + x + '. Check: ' + a + '(' + x + ')' + bs + ' = ' + c + ' ✓');
  };
  G.mathEq2 = function () {
    var x = r(-6, 9), a = r(3, 9), c = r(1, a - 1), b = r(-10, 10), d = (a - c) * x + b;
    return calc('Solve for x: <b>' + a + 'x + ' + b + ' = ' + c + 'x + ' + d + '</b>', x, 'Get x on one side: subtract ' + c + 'x from both sides → ' + (a - c) + 'x + ' + b + ' = ' + d + '. Subtract ' + b + ': ' + (a - c) + 'x = ' + (d - b) + '. Divide: x = ' + x + '.');
  };
  G.mathEval = function () {
    var x = r(-5, 6), a = r(2, 6), b = r(-9, 9), ans = a * x * x + b;
    return calc('If <b>x = ' + x + '</b>, what is <b>' + a + 'x² ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + '</b>?', ans, 'Plug it in with parentheses: ' + a + '(' + x + ')² ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + '. Square first: (' + x + ')² = ' + (x * x) + ' (a negative squared is positive). Then ' + a + ' × ' + (x * x) + ' = ' + (a * x * x) + ', and ' + (b < 0 ? 'subtract ' + (-b) : 'add ' + b) + ' → ' + ans + '.');
  };
  G.mathSlope = function () {
    var x1 = r(-5, 5), y1 = r(-5, 5), m = pk([-3, -2, -1, 1, 2, 3, 4]), dx = r(1, 4), x2 = x1 + dx, y2 = y1 + m * dx;
    return calc('What is the slope of the line through <b>(' + x1 + ', ' + y1 + ')</b> and <b>(' + x2 + ', ' + y2 + ')</b>?', m, 'Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁) = (' + y2 + ' − ' + y1 + ') ÷ (' + x2 + ' − ' + x1 + ') = ' + (y2 - y1) + ' ÷ ' + dx + ' = ' + m + '.');
  };
  G.mathLine = function () {
    var m = pk([-3, -2, -1, 2, 3, 4]), b = r(-6, 6), x = r(-3, 5), y = m * x + b;
    return calc('For the line <b>y = ' + m + 'x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + '</b>, what is y when x = ' + x + '?', y, 'Plug x in: y = ' + m + '(' + x + ') ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' = ' + (m * x) + ' ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ' = ' + y + '. The ' + m + ' is the slope and the ' + b + ' is where it crosses the y-axis.');
  };
  G.mathExp = function () {
    var a = r(2, 5), m = r(2, 6), n = r(2, 6), k = r(0, 2);
    if (k === 0) return mc('Simplify <b>x<sup>' + m + '</sup> · x<sup>' + n + '</sup></b>', 'x<sup>' + (m + n) + '</sup>', ['x<sup>' + (m * n) + '</sup>', '2x<sup>' + (m + n) + '</sup>', 'x<sup>' + Math.abs(m - n) + '</sup>'], 'Same base, multiplying → ADD the exponents: ' + m + ' + ' + n + ' = ' + (m + n) + '. (x' + m + ' is ' + m + ' x\'s multiplied; add ' + n + ' more.)');
    if (k === 1) return mc('Simplify <b>(x<sup>' + m + '</sup>)<sup>' + n + '</sup></b>', 'x<sup>' + (m * n) + '</sup>', ['x<sup>' + (m + n) + '</sup>', 'x<sup>' + m + '</sup>' + n, n + 'x<sup>' + m + '</sup>'], 'A power of a power → MULTIPLY the exponents: ' + m + ' × ' + n + ' = ' + (m * n) + '.');
    return calc('What is <b>' + a + '<sup>' + Math.min(m, 4) + '</sup></b>?', Math.pow(a, Math.min(m, 4)), a + ' multiplied by itself ' + Math.min(m, 4) + ' times = ' + Math.pow(a, Math.min(m, 4)) + '. Not ' + a + ' × ' + Math.min(m, 4) + '!');
  };
  G.mathArea = function () {
    var k = r(0, 3), a = r(3, 15), b = r(3, 15);
    if (k === 0) return calc('A room is <b>' + a + ' ft by ' + b + ' ft</b>. What is its area in square feet?', a * b, 'Rectangle area = length × width = ' + a + ' × ' + b + ' = ' + (a * b) + ' sq ft. (Perimeter, the distance around, would be ' + (2 * (a + b)) + ' ft.)');
    if (k === 1) return calc('A fence goes around a <b>' + a + ' m by ' + b + ' m</b> yard. How many meters of fence?', 2 * (a + b), 'Perimeter = add all four sides = 2 × (' + a + ' + ' + b + ') = ' + (2 * (a + b)) + ' m.');
    if (k === 2) return calc('A triangle has base <b>' + 2 * a + '</b> and height <b>' + b + '</b>. What is its area?', a * b, 'Triangle = half a rectangle: ½ × base × height = ½ × ' + (2 * a) + ' × ' + b + ' = ' + (a * b) + '.');
    var rr = r(2, 10); return calc('A circle has radius <b>' + rr + '</b>. What is its area? (use π ≈ 3.14, round to 1 decimal)', +(3.14 * rr * rr).toFixed(1), 'Area = π r² = 3.14 × ' + rr + '² = 3.14 × ' + (rr * rr) + ' ≈ ' + (3.14 * rr * rr).toFixed(1) + '.', 0.15);
  };
  G.mathPyth = function () {
    var t = pk([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]), s = r(1, 2), a = t[0] * s, b = t[1] * s, c = t[2] * s;
    if (Math.random() < .5) return calc('A right triangle has legs <b>' + a + '</b> and <b>' + b + '</b>. How long is the hypotenuse?', c, 'a² + b² = c²: ' + (a * a) + ' + ' + (b * b) + ' = ' + (c * c) + ', and √' + (c * c) + ' = ' + c + '.');
    return calc('A ' + c + '-foot ladder leans on a wall with its foot <b>' + a + ' ft</b> from the wall. How high up the wall does it reach?', b, 'The ladder is the hypotenuse: ' + a + '² + h² = ' + c + '² → h² = ' + (c * c) + ' − ' + (a * a) + ' = ' + (b * b) + ', so h = ' + b + ' ft.');
  };
  G.mathStats = function () {
    var n = pk([5, 5, 6, 7]), xs = []; for (var i = 0; i < n; i++) xs.push(r(1, 20));
    var sorted = xs.slice().sort(function (a, b) { return a - b; }), sum = xs.reduce(function (a, b) { return a + b; }, 0), k = r(0, 2);
    if (k === 0) return calc('Find the <b>mean</b> (average) of: ' + xs.join(', ') + ' (round to 1 decimal)', +(sum / n).toFixed(1), 'Add them all (' + sum + ') and divide by how many there are (' + n + '): ' + (sum / n).toFixed(2) + '.', 0.06);
    if (k === 1) { var med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2; return calc('Find the <b>median</b> of: ' + xs.join(', '), med, 'Sort first: ' + sorted.join(', ') + '. The median is the middle' + (n % 2 ? ' one: ' : ' (average of the two middle ones): ') + med + '.'); }
    return calc('Find the <b>range</b> of: ' + xs.join(', '), sorted[n - 1] - sorted[0], 'Range = biggest − smallest = ' + sorted[n - 1] + ' − ' + sorted[0] + ' = ' + (sorted[n - 1] - sorted[0]) + '. It measures spread.');
  };
  G.mathProb = function () {
    var red = r(1, 8), blue = r(1, 8), green = r(0, 5), tot = red + blue + green, col = pk(['red', 'blue']), have = col === 'red' ? red : blue;
    return mc('A bag has ' + red + ' red, ' + blue + ' blue' + (green ? ' and ' + green + ' green' : '') + ' marbles. Probability you pull a <b>' + col + '</b> one?', frac(have, tot), [frac(have, tot - have || 1), frac(1, tot), frac(tot - have, tot)],
      'Probability = what you want ÷ everything possible = ' + have + '/' + tot + (gcd(have, tot) > 1 ? ' = ' + frac(have, tot) : '') + '.');
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'K-12 refresh',
    id: 'math',
    name: 'Math, Rebuilt',
    mark: '➗',
    color: '#f0a35c',
    stat: 'mind',
    blurb: 'Arithmetic to Algebra 1, geometry & stats.',
    intro: "Rebuilding math from the ground up, but fast, because you're an adult and you've seen most of this before. Every lesson ends with practice problems that are generated fresh each time, so you can't just memorize answers. Hit Practice drill any time for 10 new ones. Based on the OpenStax Prealgebra and Elementary Algebra textbooks (free, CC BY 4.0).",
    placement: [
      { t: 'calc', q: 'What is 7 + 3 × 4?', a: 19, tol: 0.001, why: 'Multiply before adding: 3 × 4 = 12, then + 7 = 19. That rule is order of operations (Unit 1).' },
      { t: 'mcq', q: 'Which fraction is bigger?', opts: ['3/4', '2/3', 'They are equal', 'Can\'t tell'], a: 0, keep: true, why: '3/4 = 0.75 and 2/3 ≈ 0.67. Comparing fractions is Unit 2.' },
      { t: 'calc', q: 'What is 20% of 60?', a: 12, tol: 0.001, why: '20% = 0.2, and 0.2 × 60 = 12. Percents are Unit 2.' },
      { t: 'calc', q: 'Solve for x: 2x + 5 = 17', a: 6, tol: 0.001, why: 'Subtract 5 → 2x = 12, divide by 2 → x = 6. Equations are Unit 4.' },
      { t: 'calc', q: 'A right triangle has legs 3 and 4. How long is the longest side?', a: 5, tol: 0.001, why: '3² + 4² = 25, √25 = 5. The Pythagorean theorem is Unit 5.' }
    ],
    units: [
      {
        name: 'Unit 1 · Number sense',
        blurb: 'How numbers are built, negative numbers, and the order you do math in. Everything else stands on this.',
        lessons: [
          {
            id: 'm-place', title: 'Place value & rounding', min: 6, teaser: 'Why the 3 in 300 is worth more than the 3 in 30.',
            links: ['m-ops', 'cs-what-is-bit', 'm-decimals'],
            cards: [
              { t: 'read', h: 'Ten digits, infinite numbers', body: '<p>We only have ten digits (0 through 9). We make every number from them using <b>place value</b>: a digit\'s position tells you what it\'s worth.</p><p>In <b>4,352</b>: the 4 is in the thousands place (4,000), the 3 is in the hundreds (300), the 5 is in the tens (50), the 2 is in the ones (2). Add them: 4,000 + 300 + 50 + 2. Each step left is worth <b>10 times</b> more. That\'s why it\'s called <b>base 10</b>.</p>', mem: 'Each place to the left is worth 10× more. A digit\'s value = digit × its place.' },
              { t: 'read', h: 'Going right of the decimal point', body: '<p>The pattern keeps going the other way. Each step right is worth <b>10 times less</b>: tenths (0.1), hundredths (0.01), thousandths (0.001).</p><p>So 3.75 is 3 ones + 7 tenths + 5 hundredths. Money makes this easy: $3.75 is 3 dollars, 7 dimes, 5 pennies.</p>' },
              { t: 'read', h: 'Rounding, the honest shortcut', body: '<p>Rounding swaps an exact number for a simpler nearby one. The rule:</p><ol><li>Find the place you\'re rounding to.</li><li>Look at the digit <b>one spot to its right</b>.</li><li>5 or more → round up. 4 or less → stay. Everything to the right becomes 0.</li></ol><p>4,352 to the nearest hundred: the hundreds digit is 3, the next digit is 5 → round up to <b>4,400</b>.</p>', mem: 'Look one digit to the right. 5+ goes up, 4- stays.' },
              { t: 'mcq', q: 'In 82,615, what is the 6 actually worth?', opts: ['6', '60', '600', '6,000'], a: 2, keep: true, why: 'Count from the right: 5 ones, 1 ten, 6 hundreds. So the 6 is worth 600.' },
              { t: 'gen', g: 'mathRound' },
              { t: 'deep', h: 'Other bases exist (and computers use one)', teaser: 'Base 10 is a choice. Computers count in base 2.', hole: 'cs-what-is-bit', body: '<p>We probably use base 10 because we have ten fingers. Nothing forces it. The Babylonians used base 60 (that\'s why an hour has 60 minutes). Computers use <b>base 2</b> (binary), where each place is worth 2× more than the last: 1, 2, 4, 8, 16. Same idea as place value, different multiplier. The CS lessons pick this up.</p>' }
            ]
          },
          {
            id: 'm-neg', title: 'Negative numbers', min: 6, teaser: 'Below zero: temperature, debt, and the number line.',
            links: ['m-ops', 'm-eq1'],
            cards: [
              { t: 'read', h: 'The number line', body: '<p>Picture a line with 0 in the middle. Positive numbers go right, <b>negative</b> numbers go left. −5 is five steps left of zero. Real life: −5° is 5 degrees below zero; −$40 in your account means you owe $40.</p><p>The further left, the <i>smaller</i> the number. So −10 is less than −2, even though 10 looks "bigger." Owing $10 is worse than owing $2.</p>', mem: 'Left = smaller. −10 < −2.' },
              { t: 'read', h: 'Adding and subtracting', body: '<p><b>Adding</b> a positive moves right; adding a negative moves left. −3 + 5: start at −3, move right 5, land on 2.</p><p><b>Subtracting</b> a number = adding its opposite. 4 − (−6) becomes 4 + 6 = 10. Taking away a debt makes you richer.</p>', mem: 'Minus a negative = plus a positive.' },
              { t: 'read', h: 'Multiplying and dividing', body: '<p>Only the signs need a rule:</p><ul><li>Same signs → positive. (−3)(−4) = 12.</li><li>Different signs → negative. (−3)(4) = −12.</li></ul><p>Division follows the same rule: −20 ÷ −5 = 4, and −20 ÷ 5 = −4.</p>' },
              { t: 'tf', q: '−8 is greater than −3.', a: false, why: '−8 is further left on the number line, so it\'s smaller. Think: −8° is colder than −3°.' },
              { t: 'gen', g: 'mathNeg' },
              { t: 'gen', g: 'mathNeg' }
            ]
          },
          {
            id: 'm-ops', title: 'Order of operations', min: 5, teaser: 'Why 2 + 3 × 4 is 14, not 20.',
            links: ['m-neg', 'm-eval', 't-readcode'],
            cards: [
              { t: 'read', h: 'Everyone needs the same rules', body: '<p>2 + 3 × 4: if you go left to right you get 20; if you multiply first you get 14. Math picked one rule so everyone gets the same answer: <b>14</b>.</p><p>The order is <b>PEMDAS</b>:</p><ol><li><b>P</b>arentheses</li><li><b>E</b>xponents (powers like 3²)</li><li><b>M</b>ultiplication and <b>D</b>ivision, together, left to right</li><li><b>A</b>ddition and <b>S</b>ubtraction, together, left to right</li></ol>', mem: 'PEMDAS. M and D are a tie (go left to right). So are A and S.' },
              { t: 'read', h: 'The trap everyone falls in', body: '<p>Multiplication does NOT always come before division. They\'re equal partners. 12 ÷ 3 × 2 = (12 ÷ 3) × 2 = <b>8</b>, not 12 ÷ 6 = 2. Same with addition and subtraction: 10 − 3 + 2 = 9.</p><p>Code follows these exact same rules. In Python, <code>2 + 3 * 4</code> is 14. Reading code is a lot easier when this is automatic.</p>' },
              { t: 'mcq', q: 'What is 12 ÷ 3 × 2?', opts: ['2', '8', '12', '6'], a: 1, keep: true, why: 'Multiplication and division are tied, so go left to right: 12 ÷ 3 = 4, then 4 × 2 = 8.' },
              { t: 'gen', g: 'mathOps' },
              { t: 'gen', g: 'mathOps' }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Fractions, decimals & percents',
        blurb: 'Three ways to write the same thing. The math of pizza, money, sales, and tips.',
        lessons: [
          {
            id: 'm-frac', title: 'What a fraction really is', min: 7, teaser: 'Top, bottom, and why 2/4 = 1/2.',
            links: ['m-fracops', 'm-decimals'],
            cards: [
              { t: 'read', h: 'Parts of a whole', body: '<p>A <b>fraction</b> like 3/4 means: cut something into 4 equal pieces, take 3. The bottom number (<b>denominator</b>) says how many pieces the whole is cut into. The top number (<b>numerator</b>) says how many you have.</p><p>A fraction is also just a division: 3/4 = 3 ÷ 4 = 0.75.</p>', mem: 'Denominator = Down = how many pieces total. Numerator = how many you have.' },
              { t: 'read', h: 'Same amount, different names', body: '<p>Half a pizza is 1/2. Cut each half in two and it\'s 2/4. Cut again, 4/8. Same amount of pizza. These are <b>equivalent fractions</b>.</p><p>To <b>simplify</b>, divide the top and bottom by the same number until you can\'t anymore. 6/8 → divide both by 2 → 3/4. The biggest number that divides both is called the greatest common factor.</p>' },
              { t: 'read', h: 'Comparing fractions', body: '<p>Is 3/5 or 2/3 bigger? Two ways:</p><ul><li>Turn both into decimals: 0.6 vs 0.667 → 2/3 wins.</li><li>Cross-multiply: 3×3 = 9 vs 5×2 = 10 → the side with 10 (2/3) is bigger.</li></ul><p>A bigger denominator means <i>smaller</i> pieces. 1/8 of a pizza is less than 1/4.</p>' },
              { t: 'mcq', q: 'Which is equivalent to 9/12?', opts: ['3/4', '2/3', '9/10', '1/3'], a: 0, why: 'Divide top and bottom by 3: 9÷3 = 3, 12÷3 = 4 → 3/4.' },
              { t: 'tf', q: '1/8 is bigger than 1/5.', a: false, why: 'Cutting into 8 pieces makes smaller pieces than cutting into 5. 1/8 = 0.125, 1/5 = 0.2.' },
              { t: 'gen', g: 'mathFracAdd' }
            ]
          },
          {
            id: 'm-fracops', title: 'Adding & multiplying fractions', min: 7, teaser: 'Common denominators, and "keep, change, flip."',
            links: ['m-frac', 'm-prop'],
            cards: [
              { t: 'read', h: 'Adding needs matching pieces', body: '<p>You can only add pieces that are the same size. 1/4 + 2/4 = 3/4 (add the tops, keep the bottom). But 1/2 + 1/3? Different sized pieces. First rewrite them with a <b>common denominator</b>:</p><p>1/2 = 3/6 and 1/3 = 2/6, so 1/2 + 1/3 = <b>5/6</b>.</p><p>The quick way to find one: multiply the two bottoms together (2 × 3 = 6).</p>', mem: 'To add: match the bottoms, then add the tops. Never add the bottoms.' },
              { t: 'read', h: 'Multiplying is easier', body: '<p>Multiply straight across: 2/3 × 3/5 = (2×3)/(3×5) = 6/15 = 2/5. No common denominator needed.</p><p>"Of" means multiply. Half <i>of</i> 3/4 is 1/2 × 3/4 = 3/8.</p>' },
              { t: 'read', h: 'Dividing: keep, change, flip', body: '<p>To divide by a fraction, multiply by its flip (the <b>reciprocal</b>). 3/4 ÷ 1/2 → keep 3/4, change ÷ to ×, flip 1/2 to 2/1 → 3/4 × 2 = 6/4 = 1½.</p><p>Why it works: "how many halves fit in 3/4?" One and a half of them. Dividing by a small number gives a bigger answer.</p>' },
              { t: 'gen', g: 'mathFracAdd' },
              { t: 'gen', g: 'mathFracMul' },
              { t: 'gen', g: 'mathFracMul' }
            ]
          },
          {
            id: 'm-decimals', title: 'Decimals & percents', min: 7, teaser: 'Discounts, tips, and "percent of."',
            links: ['m-frac', 'm-rate'],
            cards: [
              { t: 'read', h: 'Percent = per hundred', body: '<p><b>Percent</b> means "out of 100." 45% = 45/100 = 0.45. To switch:</p><ul><li>Percent → decimal: move the decimal 2 left (45% → 0.45).</li><li>Decimal → percent: move it 2 right (0.08 → 8%).</li></ul><p>Common ones worth knowing cold: 50% = 1/2, 25% = 1/4, 75% = 3/4, 20% = 1/5, 10% = 1/10, 33⅓% ≈ 1/3.</p>', mem: '"Of" means multiply. 30% of 80 = 0.30 × 80 = 24.' },
              { t: 'read', h: 'The three percent questions', body: '<ol><li><b>Find the part:</b> 30% of 80? → 0.3 × 80 = 24.</li><li><b>Find the percent:</b> 24 is what % of 80? → 24 ÷ 80 = 0.3 = 30%.</li><li><b>Find the whole:</b> 24 is 30% of what? → 24 ÷ 0.3 = 80.</li></ol><p>Percent change: (new − old) ÷ old. Rent going from $1,000 to $1,100 is a 100 ÷ 1,000 = 10% increase.</p>' },
              { t: 'read', h: 'The 10% trick for tips', body: '<p>10% of anything: move the decimal one spot left. $47.50 → $4.75. Then build: 20% = double that ($9.50), 15% = 10% + half of 10% ($4.75 + $2.38 = $7.13).</p>' },
              { t: 'gen', g: 'mathPercent' },
              { t: 'gen', g: 'mathTip' },
              { t: 'gen', g: 'mathPercent' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Ratios & proportions',
        blurb: 'Comparing amounts, unit prices, speed, and scaling recipes.',
        lessons: [
          {
            id: 'm-rate', title: 'Ratios & unit rates', min: 5, teaser: 'Which pack is the better deal?',
            links: ['m-prop', 'm-decimals'],
            cards: [
              { t: 'read', h: 'A ratio compares two amounts', body: '<p>3 cups of flour to 2 cups of sugar is a ratio of <b>3:2</b> (or 3/2). Ratios scale: 6:4 and 9:6 are the same recipe, just bigger.</p><p>A <b>rate</b> is a ratio with different units: 120 miles per 2 hours. A <b>unit rate</b> is "per one": divide to get 60 miles per 1 hour.</p>', mem: 'Unit rate = divide so the second number is 1.' },
              { t: 'read', h: 'Better deal math', body: '<p>Store: 12 oz for $3.00, or 20 oz for $4.40. Unit prices: $3.00 ÷ 12 = $0.25/oz vs $4.40 ÷ 20 = $0.22/oz. The big one wins. Most grocery shelf tags show this "unit price" in tiny print.</p>' },
              { t: 'gen', g: 'mathRate' },
              { t: 'gen', g: 'mathRate' }
            ]
          },
          {
            id: 'm-prop', title: 'Proportions', min: 5, teaser: 'Cross-multiply and scale anything.',
            links: ['m-rate', 'm-eq1'],
            cards: [
              { t: 'read', h: 'Two equal ratios', body: '<p>A <b>proportion</b> says two ratios are equal: 2/5 = x/20. To solve it, <b>cross-multiply</b>: 2 × 20 = 5 × x → 40 = 5x → x = 8.</p><p>Real use: a map says 1 inch = 50 miles. Two cities are 3.5 inches apart. 1/50 = 3.5/x → x = 175 miles.</p>', mem: 'Cross-multiply, then divide.' },
              { t: 'gen', g: 'mathProp' },
              { t: 'gen', g: 'mathProp' }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · Algebra 1',
        blurb: 'Letters standing in for numbers. Equations, lines, and exponents. This is where "I was never a math person" usually started.',
        tag: 'core',
        lessons: [
          {
            id: 'm-eval', title: 'Variables & expressions', min: 6, teaser: 'x is just a box waiting for a number.',
            links: ['m-eq1', 't-readcode'],
            cards: [
              { t: 'read', h: 'A letter is a placeholder', body: '<p>A <b>variable</b> is a letter that stands for a number you don\'t know yet, or one that can change. If a ride costs $3 plus $2 per mile, the cost is <b>3 + 2m</b>, where m is miles. That\'s an <b>expression</b>.</p><p>Writing 2m means 2 × m. Algebra drops the × sign because it looks like an x.</p><p>Code does the same thing: <code>cost = 3 + 2 * miles</code>. A variable in code is a named box holding a value.</p>', mem: '2m means 2 × m. A variable is a named box for a number.' },
              { t: 'read', h: 'Evaluating: plug it in', body: '<p>To <b>evaluate</b>, replace the letter with its number, in parentheses, and use PEMDAS. If m = 7: 3 + 2(7) = 3 + 14 = 17. A 7-mile ride is $17.</p><p>The parentheses matter with negatives: if x = −3, then x² = (−3)² = 9, not −9.</p>' },
              { t: 'read', h: 'Combining like terms', body: '<p>You can only add things of the same kind. 3x + 5x = 8x (3 apples + 5 apples = 8 apples). But 3x + 5y stays as is. 4x + 2 + x − 7 → (4x + x) + (2 − 7) = 5x − 5.</p>' },
              { t: 'mcq', q: 'Simplify: 6x + 3 − 2x + 4', opts: ['4x + 7', '8x + 7', '11x', '4x − 1'], a: 0, why: 'x-terms: 6x − 2x = 4x. Plain numbers: 3 + 4 = 7. Together: 4x + 7.' },
              { t: 'gen', g: 'mathEval' },
              { t: 'gen', g: 'mathEval' }
            ]
          },
          {
            id: 'm-eq1', title: 'Solving equations', min: 8, teaser: 'Keep it balanced and undo, step by step.',
            links: ['m-eval', 'm-line'],
            cards: [
              { t: 'read', h: 'An equation is a balance scale', body: '<p>An <b>equation</b> says two sides are equal: 3x + 4 = 19. Solving means finding the x that makes it true.</p><p>The one rule: <b>whatever you do to one side, do to the other.</b> That keeps the scale balanced.</p>', mem: 'Same thing to both sides. Always.' },
              { t: 'read', h: 'Undo in reverse order', body: '<p>3x + 4 = 19. The x got multiplied by 3, then had 4 added. Undo in reverse:</p><ol><li>Undo the + 4: subtract 4 from both sides → 3x = 15.</li><li>Undo the × 3: divide both sides by 3 → x = 5.</li></ol><p><b>Check it:</b> 3(5) + 4 = 19 ✓. Checking takes ten seconds and catches most mistakes.</p>' },
              { t: 'read', h: 'x on both sides', body: '<p>5x + 2 = 2x + 14. Move all the x\'s to one side first: subtract 2x from both sides → 3x + 2 = 14. Now it\'s a normal two-step: 3x = 12, x = 4.</p><p>Real use: plan A costs $20 + $5/month, plan B $50 + $2/month. When do they cost the same? 20 + 5m = 50 + 2m → 3m = 30 → m = 10 months.</p>' },
              { t: 'gen', g: 'mathEq1' },
              { t: 'gen', g: 'mathEq1' },
              { t: 'gen', g: 'mathEq2' },
              { t: 'deep', h: 'Why this is the foundation for everything after', teaser: 'Physics, coding, finance: all of it is "solve for x."', hole: 'sc-forces', body: '<p>Almost every formula you\'ll meet is an equation you rearrange: F = ma (physics), V = IR (electricity, on the FE exam), interest = principal × rate × time. If you can isolate a variable, you can use any formula. This one skill is the gate to physics, engineering and most of the CS math.</p>' }
            ]
          },
          {
            id: 'm-line', title: 'Lines & slope', min: 8, teaser: 'y = mx + b, and what slope actually means.',
            links: ['m-eq1', 'm-stats'],
            cards: [
              { t: 'read', h: 'The coordinate plane', body: '<p>Two number lines crossing at 0: the horizontal <b>x-axis</b> and the vertical <b>y-axis</b>. A point (3, −2) means go 3 right, then 2 down. x always comes first.</p>' },
              { t: 'read', h: 'Slope = steepness', body: '<p><b>Slope</b> tells you how much y changes when x goes up by 1. It\'s <b>rise over run</b>: (change in y) ÷ (change in x).</p><ul><li>Positive slope: line goes up to the right.</li><li>Negative slope: goes down.</li><li>Slope 0: flat. Undefined: straight up and down.</li></ul><p>Real meaning: if your savings graph has a slope of 50, you\'re saving $50 per week.</p>', mem: 'Slope = rise / run = (y₂ − y₁) / (x₂ − x₁).' },
              { t: 'read', h: 'y = mx + b', body: '<p>Every straight line can be written as <b>y = mx + b</b>:</p><ul><li><b>m</b> = the slope (rate of change).</li><li><b>b</b> = the y-intercept, where the line crosses the y-axis (the starting value when x = 0).</li></ul><p>The ride from earlier, cost = 2m + 3, is a line with slope 2 ($2 per mile) and intercept 3 ($3 just to get in).</p>' },
              { t: 'mcq', q: 'In y = −4x + 9, what is the slope?', opts: ['−4', '9', '4', 'x'], a: 0, why: 'In y = mx + b the number multiplying x is the slope. Here m = −4 (the line falls 4 for every 1 step right). 9 is the y-intercept.' },
              { t: 'gen', g: 'mathSlope' },
              { t: 'gen', g: 'mathLine' }
            ]
          },
          {
            id: 'm-exp', title: 'Exponents', min: 6, teaser: 'Repeated multiplication, and the rules that save time.',
            links: ['m-eval', 'cs-what-is-bit'],
            cards: [
              { t: 'read', h: 'Repeated multiplication', body: '<p>2⁵ means 2 × 2 × 2 × 2 × 2 = 32. The 2 is the <b>base</b>, the 5 is the <b>exponent</b> (how many times to multiply). Big trap: 2⁵ is NOT 2 × 5.</p><p>Exponents grow fast. That\'s "exponential growth": doubling 30 times takes 1 to over a billion. It\'s also why each extra character makes a password so much harder to brute-force.</p>' },
              { t: 'read', h: 'The rules', body: '<ul><li>Multiply same base → add exponents: x³ · x⁴ = x⁷</li><li>Divide same base → subtract: x⁶ / x² = x⁴</li><li>Power of a power → multiply: (x²)³ = x⁶</li><li>Anything to the 0 power = 1. Negative exponent = flip: 2⁻³ = 1/8.</li></ul>', mem: 'Multiplying → add the exponents. Power of a power → multiply them.' },
              { t: 'gen', g: 'mathExp' },
              { t: 'gen', g: 'mathExp' },
              { t: 'gen', g: 'mathExp' }
            ]
          }
        ]
      },
      {
        name: 'Unit 5 · Geometry',
        blurb: 'Area, perimeter, circles and right triangles. The math you actually use moving furniture or building a homelab rack.',
        lessons: [
          {
            id: 'm-area', title: 'Area, perimeter & circles', min: 7, teaser: 'How much paint, how much fence.',
            links: ['m-pyth'],
            cards: [
              { t: 'read', h: 'Around vs. inside', body: '<p><b>Perimeter</b> is the distance <i>around</i> a shape (fence, trim). Add up all the sides. <b>Area</b> is the space <i>inside</i> (carpet, paint), measured in square units.</p><ul><li>Rectangle: area = length × width.</li><li>Triangle: area = ½ × base × height (half a rectangle).</li></ul>', mem: 'Perimeter = around (add sides). Area = inside (square units).' },
              { t: 'read', h: 'Circles and π', body: '<p>Every circle has the same ratio between the distance around it (<b>circumference</b>) and the distance across it (<b>diameter</b>): about 3.14. That number is <b>π</b> (pi).</p><ul><li>Radius r = center to edge (half the diameter).</li><li>Circumference = 2πr.</li><li>Area = πr².</li></ul><p>A 16-inch pizza (r = 8) has area ≈ 201 sq in. Two 10-inch pizzas: 2 × 78.5 = 157. The one big pizza is more food.</p>' },
              { t: 'gen', g: 'mathArea' },
              { t: 'gen', g: 'mathArea' },
              { t: 'gen', g: 'mathArea' }
            ]
          },
          {
            id: 'm-pyth', title: 'The Pythagorean theorem', min: 6, teaser: 'a² + b² = c², and why carpenters love it.',
            links: ['m-area', 'm-exp'],
            cards: [
              { t: 'read', h: 'Right triangles only', body: '<p>A right triangle has one 90° corner. The two sides making that corner are the <b>legs</b> (a and b). The long side across from it is the <b>hypotenuse</b> (c). Always:</p><p style="font-size:20px;text-align:center"><b>a² + b² = c²</b></p><p>Legs 3 and 4: 9 + 16 = 25, so c = √25 = 5.</p>', mem: 'Only for right triangles. c is always the longest side.' },
              { t: 'read', h: 'Where it shows up', body: '<p>Carpenters check a corner is square by measuring 3 ft one way, 4 ft the other, and checking the diagonal is exactly 5. TV sizes are the diagonal. Distance between two points on a map or a graph is this same formula.</p>' },
              { t: 'gen', g: 'mathPyth' },
              { t: 'gen', g: 'mathPyth' }
            ]
          }
        ]
      },
      {
        name: 'Unit 6 · Statistics & probability',
        blurb: 'Reading data without getting fooled, and the math of chance.',
        lessons: [
          {
            id: 'm-stats', title: 'Mean, median & spread', min: 6, teaser: 'Why "average income" can lie to you.',
            links: ['m-prob', 'ai-what'],
            cards: [
              { t: 'read', h: 'Three kinds of "middle"', body: '<ul><li><b>Mean</b>: add everything, divide by how many. The usual "average."</li><li><b>Median</b>: sort them, take the middle one. (Even count? Average the middle two.)</li><li><b>Mode</b>: the value that shows up most.</li></ul>', mem: 'Mean = add and divide. Median = the middle when sorted.' },
              { t: 'read', h: 'Why the median exists', body: '<p>Five people earn $40k, $45k, $50k, $55k and $2 million. Mean: $438k. Median: $50k. One extreme value (an <b>outlier</b>) drags the mean way up. That\'s why news reports use "median household income": it describes the typical person better.</p><p><b>Range</b> (biggest − smallest) is the simplest measure of spread. Two classes can both average 75% but one has everyone at 70–80 and the other has 40s and 100s.</p>' },
              { t: 'gen', g: 'mathStats' },
              { t: 'gen', g: 'mathStats' },
              { t: 'gen', g: 'mathStats' }
            ]
          },
          {
            id: 'm-prob', title: 'Probability', min: 6, teaser: 'Odds, dice, and why the casino always wins.',
            links: ['m-stats', 'm-frac'],
            cards: [
              { t: 'read', h: 'Wanted over possible', body: '<p><b>Probability</b> = (ways to get what you want) ÷ (all possible outcomes). It\'s always between 0 (impossible) and 1 (certain).</p><p>Rolling a 6 on a die: 1 way out of 6 → 1/6 ≈ 17%. Rolling an even number: 3 ways (2, 4, 6) → 3/6 = 1/2.</p>' },
              { t: 'read', h: 'Two things in a row', body: '<p>For independent events (one doesn\'t affect the other), <b>multiply</b>. Two heads in a row: ½ × ½ = ¼. Five in a row: (½)⁵ = 1/32.</p><p>The <b>gambler\'s fallacy</b>: after 5 heads, tails is NOT "due." The coin has no memory. The next flip is still 50/50.</p>', mem: 'And = multiply. Coins and dice have no memory.' },
              { t: 'tf', q: 'After a roulette wheel lands on red 6 times in a row, black is more likely next spin.', a: false, why: 'Each spin is independent. The odds reset every time. Believing otherwise is the gambler\'s fallacy, and it\'s a big part of why casinos make money.' },
              { t: 'gen', g: 'mathProb' },
              { t: 'gen', g: 'mathProb' }
            ]
          }
        ]
      }
    ]
  });
})();
