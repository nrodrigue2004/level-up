/* CS degree core, cybersecurity focus: Discrete math (incl. the number theory behind crypto),
   Operating systems, and Databases & SQL. Syllabus backbones: MIT OCW 6.042J Mathematics for Computer Science,
   OSTEP (Operating Systems: Three Easy Pieces, free online), CS50 SQL, OWASP. Lessons are original. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'cs'; })[0]; if (!S) return;
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }
  function calc(q, a, why) { return { t: 'calc', q: q, a: a, tol: 0.001, why: why }; }
  function code(lines) { return '<pre>' + lines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>'; }
  function modpow(b, e, m) { var x = 1; b %= m; while (e > 0) { if (e & 1) x = (x * b) % m; b = (b * b) % m; e >>= 1; } return x; }
  function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
  function fact(n) { var x = 1; for (var i = 2; i <= n; i++) x *= i; return x; }
  function nCr(n, k) { return Math.round(fact(n) / (fact(k) * fact(n - k))); }

  /* ===== discrete math generators ===== */
  G.dmLogic = function () {
    var p = Math.random() < .5, q = Math.random() < .5, f = pk([
      ['p AND q', p && q], ['p OR q', p || q], ['NOT p OR q', !p || q], ['p → q (if p then q)', !p || q],
      ['p XOR q', p !== q], ['NOT (p AND q)', !(p && q)], ['(NOT p) AND (NOT q)', !p && !q], ['p ↔ q', p === q]]);
    return mc('If <b>p = ' + p + '</b> and <b>q = ' + q + '</b>, what is <b>' + f[0] + '</b>?', String(f[1]), [String(!f[1])], 'Plug in and evaluate. Remember: "p → q" is only false when p is true and q is false. XOR is true when exactly one is true. ↔ is true when both match.');
  };
  G.dmSet = function () {
    var U = [1, 2, 3, 4, 5, 6, 7, 8], A = shuffle(U).slice(0, r(3, 5)).sort(), B = shuffle(U).slice(0, r(3, 5)).sort(), k = r(0, 2), res, name;
    if (k === 0) { res = A.filter(function (x) { return B.indexOf(x) >= 0; }); name = 'A ∩ B (intersection)'; }
    else if (k === 1) { res = A.concat(B.filter(function (x) { return A.indexOf(x) < 0; })); name = 'A ∪ B (union)'; }
    else { res = A.filter(function (x) { return B.indexOf(x) < 0; }); name = 'A − B (difference)'; }
    return calc('A = {' + A.join(', ') + '}, B = {' + B.join(', ') + '}. How many elements are in <b>' + name + '</b>?', res.length, name.split(' (')[0] + ' = {' + res.sort().join(', ') + '}. ∩ = in both, ∪ = in either, A − B = in A but not B. Firewall rule sets, user groups and SQL JOINs all follow set logic.');
  };
  G.dmCount = function () {
    var k = r(0, 3);
    if (k === 0) { var cs = pk([[10, 'digits'], [26, 'lowercase letters'], [36, 'lowercase letters and digits']]), len = r(3, 6); return calc('How many possible passwords of exactly <b>' + len + '</b> characters using only ' + cs[1] + ' (' + cs[0] + ' choices each)? (Give the exact number.)', Math.pow(cs[0], len), 'Multiplication rule: ' + cs[0] + ' choices for each of ' + len + ' positions = ' + cs[0] + '^' + len + ' = ' + Math.pow(cs[0], len).toLocaleString() + '. Every added character multiplies the search space; that\'s why length beats complexity.'); }
    if (k === 1) { var n = r(4, 7); return calc('In how many different orders can <b>' + n + '</b> people stand in a line?', fact(n), 'Permutations: ' + n + '! = ' + fact(n) + '. ' + n + ' choices for first, ' + (n - 1) + ' for second, and so on.'); }
    if (k === 2) { var n2 = r(5, 10), c = r(2, 3); return calc('How many ways can you choose a team of <b>' + c + '</b> from <b>' + n2 + '</b> people (order doesn\'t matter)?', nCr(n2, c), 'Combinations: C(' + n2 + ', ' + c + ') = ' + n2 + '! / (' + c + '! × ' + (n2 - c) + '!) = ' + nCr(n2, c) + '. Order doesn\'t matter, so divide out the ' + c + '! orderings.'); }
    var bits = r(4, 12); return calc('How many different values can <b>' + bits + '</b> bits represent?', Math.pow(2, bits), '2^' + bits + ' = ' + Math.pow(2, bits) + '. Each bit doubles the count.');
  };
  G.dmMod = function () {
    var k = r(0, 2);
    if (k === 0) { var a = r(20, 99), m = r(3, 12); return calc('What is <b>' + a + ' mod ' + m + '</b>?', a % m, a + ' = ' + Math.floor(a / m) + ' × ' + m + ' + ' + (a % m) + '. mod is the remainder, like a clock wrapping around.'); }
    if (k === 1) { var b = r(2, 7), e = r(3, 9), m2 = pk([7, 11, 13, 17, 19, 23]); return calc('What is <b>' + b + '<sup>' + e + '</sup> mod ' + m2 + '</b>?', modpow(b, e, m2), b + '^' + e + ' = ' + Math.pow(b, e) + ', and ' + Math.pow(b, e) + ' mod ' + m2 + ' = ' + modpow(b, e, m2) + '. Modular exponentiation is the core operation in RSA and Diffie-Hellman. Computers do it fast by squaring and reducing at each step, so numbers never get huge.'); }
    var x = r(12, 90), y = r(12, 90); return calc('What is <b>gcd(' + x + ', ' + y + ')</b>, the greatest common divisor?', gcd(x, y), 'Euclid\'s algorithm: replace (a, b) with (b, a mod b) until b is 0. gcd(' + x + ', ' + y + ') = ' + gcd(x, y) + '. RSA uses it to check the public exponent shares no factor with φ(n).');
  };
  G.dmRSA = function () {
    var pr = pk([[3, 11], [5, 11], [3, 17], [5, 13], [7, 11], [5, 17]]), p = pr[0], q = pr[1], n = p * q, phi = (p - 1) * (q - 1), e = 3; while (gcd(e, phi) !== 1) e += 2;
    var d = 1; while ((d * e) % phi !== 1) d++;
    var msg = r(2, n - 1), cph = modpow(msg, e, n), k = r(0, 2);
    if (k === 0) return calc('Toy RSA: p = ' + p + ', q = ' + q + '. What is <b>n</b>?', n, 'n = p × q = ' + n + '. n is public. Security rests on how hard it is to factor n back into p and q (with real 2048-bit n, infeasible).');
    if (k === 1) return calc('Toy RSA: p = ' + p + ', q = ' + q + '. What is <b>φ(n) = (p−1)(q−1)</b>?', phi, '(' + (p - 1) + ')(' + (q - 1) + ') = ' + phi + '. φ(n) is secret; you need p and q to compute it, and you need it to find the private key d.');
    return calc('Toy RSA: n = ' + n + ', public exponent e = ' + e + '. Encrypt the message <b>m = ' + msg + '</b>: c = m<sup>e</sup> mod n.', cph, msg + '^' + e + ' mod ' + n + ' = ' + cph + '. To decrypt, the owner computes c^d mod n with private d = ' + d + ' and gets ' + msg + ' back.');
  };

  /* ===== OS generators ===== */
  G.osChmod = function () {
    var t = [r(4, 7), r(0, 7), r(0, 7)], k = r(0, 1);
    function sym(n) { return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-'); }
    var s = sym(t[0]) + sym(t[1]) + sym(t[2]), o = t.join('');
    if (k === 0) return mc('What symbolic permissions does <b>chmod ' + o + '</b> give?', s, [sym(t[1]) + sym(t[0]) + sym(t[2]), sym(7 - t[0]) + sym(t[1]) + sym(t[2]), sym(t[0]) + sym(t[2]) + sym(t[1])], 'Each digit is owner, group, others. r = 4, w = 2, x = 1, added up. ' + o.split('').map(function (d) { return d + ' = ' + sym(+d); }).join(', ') + '.');
    return mc('Which octal mode matches <b>' + s + '</b>?', o, [t[1] + '' + t[0] + t[2], (7 - t[0]) + '' + t[1] + t[2], t[0] + '' + t[2] + t[1]], 'Add r=4, w=2, x=1 for each group of three: ' + o + '.');
  };
  var SCHED = function () {
    var jobs = [r(2, 9), r(2, 9), r(2, 9)], k = r(0, 1), order = k === 0 ? jobs.slice() : jobs.slice().sort(function (a, b) { return a - b; }), t = 0, wait = 0;
    order.forEach(function (j) { wait += t; t += j; });
    return calc('Three jobs arrive at time 0 needing <b>' + jobs.join(', ') + '</b> ms of CPU (in that arrival order). Using <b>' + (k === 0 ? 'FIFO (first come, first served)' : 'SJF (shortest job first)') + '</b>, what is the AVERAGE waiting time in ms? (round to 2 decimals)', Math.round(wait / 3 * 100) / 100, 'Run order: ' + order.join(' → ') + '. Each job waits for the ones before it. Total wait ' + wait + ' / 3 = ' + (Math.round(wait / 3 * 100) / 100) + '. SJF minimizes average waiting time, but long jobs can starve; real schedulers balance fairness and responsiveness.');
  };
  G.osSched = SCHED;

  /* ===== SQL generators ===== */
  var ROWS = [['nate', 'admin', 3], ['ava', 'user', 0], ['luc', 'user', 7], ['mia', 'admin', 1], ['remy', 'guest', 5], ['zoe', 'user', 2]];
  G.sqlCount = function () {
    var rows = shuffle(ROWS).slice(0, r(4, 6)), k = r(0, 2), q, ans, why;
    var tbl = '<table class="rh-tbl"><tr><th>name</th><th>role</th><th>failed</th></tr>' + rows.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td><td>' + x[2] + '</td></tr>'; }).join('') + '</table>';
    if (k === 0) { var role = pk(['admin', 'user']); q = "SELECT COUNT(*) FROM users WHERE role = '" + role + "';"; ans = rows.filter(function (x) { return x[1] === role; }).length; why = 'Count rows whose role is ' + role + '.'; }
    else if (k === 1) { var t = r(1, 5); q = 'SELECT name FROM users WHERE failed > ' + t + ';'; ans = rows.filter(function (x) { return x[2] > t; }).length; why = 'Rows with failed greater than ' + t + ' (strictly).'; q += '  -- how many rows come back?'; }
    else { q = 'SELECT SUM(failed) FROM users;'; ans = rows.reduce(function (s, x) { return s + x[2]; }, 0); why = 'Add up the failed column.'; }
    return calc('Table <b>users</b>:' + tbl + 'What does this return?' + code([q]), ans, why + ' Answer: ' + ans + '.');
  };
  G.sqlInj = function () {
    var x = pk([
      ["' OR '1'='1", 'Makes the WHERE clause always true, returning every row (often logging in as the first user, usually admin).'],
      ["admin'--", 'Closes the string and comments out the rest, so the password check is skipped.'],
      ["' UNION SELECT username, password FROM users--", 'Appends a second query to pull data from another table.'],
      ["'; DROP TABLE users;--", 'Stacks a second destructive statement (only works where the driver allows multiple statements).']]);
    return mc('An app builds: <code>SELECT * FROM users WHERE name = \'" + input + "\'</code>. Input is <code>' + x[0].replace(/</g, '&lt;') + '</code>. What happens?', x[1], ["Nothing; it's treated as a name", 'The database rejects it automatically', 'Only the password is changed', 'The query runs twice'].concat([]), x[1] + ' The fix is the same for all of them: parameterized queries (prepared statements), plus least-privilege database accounts.');
  };

  var discrete = {
    name: 'Discrete math & crypto math', tag: 'MIT 6.042J',
    blurb: 'The math of computer science: logic, sets, proofs, counting, and the number theory that makes encryption work.',
    lessons: [
      {
        id: 'dm-logic', title: 'Logic & proofs', min: 11, teaser: 'Propositions, implication, and how to prove things.',
        pre: ['cs-logic'], links: ['dm-sets', 'py-if'],
        cards: [
          { t: 'read', h: 'Propositions and connectives', body: '<p>A <b>proposition</b> is a statement that\'s true or false. Combine them with AND (∧), OR (∨), NOT (¬), XOR (⊕), implication (→) and biconditional (↔).</p><p><b>Implication p → q</b> ("if p then q") is only false when p is true and q is false. "If it\'s raining, the ground is wet" isn\'t broken by a dry day without rain.</p><p><b>De Morgan\'s laws</b>: ¬(p ∧ q) = ¬p ∨ ¬q and ¬(p ∨ q) = ¬p ∧ ¬q. You\'ll use them to simplify if-conditions and firewall logic.</p>', mem: 'p → q is false only when T → F.' },
          { t: 'read', h: 'Proof techniques', body: '<ul><li><b>Direct proof</b>: assume the premise, reason step by step to the conclusion.</li><li><b>Contrapositive</b>: p → q is equivalent to ¬q → ¬p. Sometimes easier to prove.</li><li><b>Contradiction</b>: assume the opposite and derive something impossible. Classic: √2 is irrational.</li><li><b>Induction</b>: prove it for the first case (base), then prove "if it holds for n, it holds for n+1." Like dominoes. Recursion and loop correctness are proven this way.</li></ul>' },
          { t: 'read', h: 'Example: induction', body: '<p><b>Claim:</b> 1 + 2 + … + n = n(n+1)/2.</p><p><b>Base:</b> n = 1: left side 1, right side 1·2/2 = 1. ✓</p><p><b>Step:</b> assume it holds for n. Then 1 + … + n + (n+1) = n(n+1)/2 + (n+1) = (n+1)(n+2)/2, which is the formula for n+1. ✓</p><p>So it holds for every n ≥ 1.</p>' },
          { t: 'gen', g: 'dmLogic' }, { t: 'gen', g: 'dmLogic' }, { t: 'gen', g: 'dmLogic' },
          { t: 'mcq', q: 'Which is logically equivalent to "if the user is admin, then MFA is required"?', opts: ['If MFA is required, the user is admin', 'If MFA is not required, the user is not admin', 'If the user is not admin, MFA is not required', 'The user is admin and MFA is required'], a: 1, why: 'That\'s the contrapositive (¬q → ¬p), always equivalent. The others are the converse and inverse, which are not.' },
          { t: 'explain', q: 'Explain proof by induction using dominoes.', points: ['Base case: show the first one falls (true for the first value)', 'Inductive step: if one falls, the next falls (n implies n+1)', 'Together they prove it for all values', 'Used to prove loops and recursion are correct'] }
        ]
      },
      {
        id: 'dm-sets', title: 'Sets, functions & relations', min: 9, teaser: 'The language of databases, access control and types.',
        pre: ['dm-logic'], links: ['db-sql', 'dm-count'],
        cards: [
          { t: 'read', h: 'Sets', body: '<p>A <b>set</b> is an unordered collection with no duplicates. Operations: <b>union</b> A ∪ B (in either), <b>intersection</b> A ∩ B (in both), <b>difference</b> A − B, <b>complement</b>, and <b>subset</b> A ⊆ B. The <b>Cartesian product</b> A × B is every pair (a, b), which is exactly what a SQL JOIN starts from.</p><p>Python\'s <code>set</code> does these directly: <code>a &amp; b</code>, <code>a | b</code>, <code>a - b</code>.</p>' },
          { t: 'read', h: 'Functions and relations', body: '<p>A <b>function</b> maps each input to exactly one output. <b>One-to-one</b> (injective): no two inputs share an output. <b>Onto</b> (surjective): every output is hit. Both = <b>bijection</b>, which means it can be reversed: encryption must be a bijection or you couldn\'t decrypt. A hash function is NOT one-to-one (infinite inputs, finite outputs), which is why collisions must exist.</p><p>A <b>relation</b> is any set of pairs: "user u is in group g" is a relation. Access-control matrices are relations.</p>', mem: 'Encryption is a bijection (reversible). Hashing is not (collisions must exist).' },
          { t: 'gen', g: 'dmSet' }, { t: 'gen', g: 'dmSet' },
          { t: 'tf', q: 'Because SHA-256 maps infinitely many inputs to 2²⁵⁶ outputs, collisions must exist.', a: true, why: 'Pigeonhole principle. Security comes from collisions being infeasible to FIND, not impossible.' }
        ]
      },
      {
        id: 'dm-count', title: 'Counting & probability', min: 10, teaser: 'Password spaces, the birthday paradox, and odds.',
        pre: ['dm-sets'], links: ['sp-hashing', 'dm-number'],
        cards: [
          { t: 'read', h: 'Counting rules', body: '<ul><li><b>Multiplication rule</b>: k independent choices with n options each → n^k. (Password spaces.)</li><li><b>Permutations</b> (order matters): n! / (n−k)!.</li><li><b>Combinations</b> (order doesn\'t): C(n, k) = n! / (k!(n−k)!).</li><li><b>Pigeonhole</b>: put n+1 items in n boxes and some box has two.</li></ul>' },
          { t: 'read', h: 'Probability and the birthday paradox', body: '<p>P(event) = favorable outcomes / total outcomes. With 23 people, the chance two share a birthday is over 50%, because you compare every pair (253 pairs).</p><p>Security consequence: finding <i>some</i> collision in an n-bit hash takes about 2^(n/2) tries, not 2^n. That\'s why 128-bit outputs (like MD5) are too short for collision resistance and SHA-256 is the modern baseline.</p>', mem: 'Birthday bound: collisions after ~2^(n/2) tries.' },
          { t: 'gen', g: 'dmCount' }, { t: 'gen', g: 'dmCount' }, { t: 'gen', g: 'dmCount' },
          { t: 'explain', q: 'Explain why a 12-character password beats an 8-character one with more symbols.', points: ['Search space = choices per character ^ length', 'Length is the exponent, so each extra character multiplies the space', 'Adding symbols only increases the base slightly', 'So length grows the space much faster'] }
        ]
      },
      {
        id: 'dm-number', title: 'Number theory & RSA', min: 13, teaser: 'mod, primes, gcd, and building RSA by hand.',
        pre: ['dm-count'], links: ['sp-pki', 'sp-crypto-why'],
        cards: [
          { t: 'read', h: 'Modular arithmetic', body: '<p><b>a mod n</b> is the remainder after dividing by n. It wraps around like a clock: 14 mod 12 = 2. Math "mod n" stays in the range 0 to n−1, which is perfect for computers and for one-way functions: easy to compute forward, hard to undo.</p><p><b>Primes</b>: divisible only by 1 and themselves. <b>gcd</b>: greatest common divisor, found fast with Euclid\'s algorithm. Two numbers are <b>coprime</b> if their gcd is 1.</p>' },
          { t: 'read', h: 'RSA in five steps', body: '<ol><li>Pick two secret primes p and q.</li><li>n = p × q (public).</li><li>φ(n) = (p−1)(q−1) (secret).</li><li>Pick public e coprime to φ(n) (65537 in practice). Compute private d with e × d ≡ 1 (mod φ(n)).</li><li>Encrypt: c = m^e mod n. Decrypt: m = c^d mod n. Sign with d, verify with e.</li></ol><p>Breaking it means factoring n. For 2048-bit n there\'s no known practical way on classical computers. A large quantum computer running Shor\'s algorithm could, which is why NIST published post-quantum standards (ML-KEM, ML-DSA) in 2024.</p>', mem: 'RSA: n = pq public, φ secret, c = m^e mod n, m = c^d mod n.',
            deeper: '<p><b>Diffie-Hellman</b> uses the same idea differently: both sides compute g^(ab) mod p while only sending g^a and g^b. Recovering a from g^a mod p is the discrete logarithm problem. Elliptic-curve versions (ECDH, ECDSA) give the same security with much smaller keys, which is why TLS 1.3 mostly uses them.</p>' },
          { t: 'gen', g: 'dmMod' }, { t: 'gen', g: 'dmMod' }, { t: 'gen', g: 'dmRSA' }, { t: 'gen', g: 'dmRSA' },
          { t: 'explain', q: 'Explain why RSA is secure, in plain words.', points: ['Public key includes n = p × q', 'Finding the private key requires φ(n), which needs p and q', 'Factoring a huge n into p and q is infeasible today', 'Quantum computers (Shor\'s algorithm) threaten it, hence post-quantum crypto'] }
        ]
      }
    ]
  };

  var os = {
    name: 'Operating systems', tag: 'OSTEP',
    blurb: 'Processes, threads, scheduling, memory, files and permissions: what the OS does, and how attackers abuse it.',
    lessons: [
      {
        id: 'os-proc', title: 'Processes, threads & scheduling', min: 11, teaser: 'How one CPU runs hundreds of programs.',
        pre: ['sys-run'], links: ['os-mem', 'sp-edr'],
        cards: [
          { t: 'read', h: 'Kernel and processes', body: '<p>The <b>kernel</b> is the core of the OS. It runs in privileged <b>kernel mode</b>; your programs run in restricted <b>user mode</b> and ask the kernel for things through <b>system calls</b> (open a file, send a packet, start a process).</p><p>A <b>process</b> is a running program with its own memory space, a PID, an owner, and open files. On Linux, a new process is made with <code>fork()</code> (copy the parent) and <code>exec()</code> (load a new program). Every process has a parent; that tree is what EDR tools watch: Word spawning PowerShell is a classic red flag.</p>' },
          { t: 'read', h: 'Threads, scheduling, and races', body: '<p><b>Threads</b> are multiple paths of execution inside one process, sharing its memory. Fast, but two threads changing the same data at once cause <b>race conditions</b>. Fix with <b>locks</b> (mutexes). Get locking wrong and you get <b>deadlock</b>: two threads each waiting forever for the other\'s lock.</p><p>The <b>scheduler</b> decides who runs next: FIFO, shortest-job-first, round robin (time slices), and priority schemes. A <b>context switch</b> saves one task\'s registers and loads another\'s.</p><p>Security link: a <b>TOCTOU</b> (time-of-check to time-of-use) bug is a race: a program checks a file is safe, then an attacker swaps it before it\'s used.</p>', mem: 'Process = own memory. Thread = shares it. Shared + no lock = race.' },
          { t: 'gen', g: 'osSched' }, { t: 'gen', g: 'osSched' },
          { t: 'mcq', q: 'An EDR alert: winword.exe spawned powershell.exe with an encoded command. Why is this suspicious?', opts: ['PowerShell is always malware', 'Office documents normally don\'t launch shells; this pattern is typical of malicious macros', 'Word is outdated', 'Encoded commands are faster'], a: 1, why: 'Unusual parent-child process relationships are one of the strongest endpoint detection signals.' },
          { t: 'explain', q: 'Explain the difference between a process and a thread, and what a race condition is.', points: ['A process has its own memory space', 'Threads share their process\'s memory', 'A race is when the result depends on timing of threads touching shared data', 'Fix with locks; misuse can cause deadlock'] }
        ]
      },
      {
        id: 'os-mem', title: 'Virtual memory & paging', min: 10, teaser: 'Why every process thinks it owns all of RAM.',
        pre: ['os-proc'], links: ['asm-stack', 'c-memory'],
        cards: [
          { t: 'read', h: 'Virtual memory', body: '<p>Each process sees its own <b>virtual address space</b>. The CPU\'s MMU translates virtual addresses to physical RAM using <b>page tables</b>, in chunks called <b>pages</b> (usually 4 KB). Benefits:</p><ul><li><b>Isolation</b>: one process can\'t read another\'s memory, the foundation of OS security.</li><li><b>Permissions per page</b>: read / write / execute bits. NX/DEP is just "this page is not executable."</li><li><b>Swapping</b>: rarely-used pages move to disk. A <b>page fault</b> brings them back.</li><li><b>ASLR</b> works by placing things at random virtual addresses.</li></ul>' },
          { t: 'read', h: 'When isolation breaks', body: '<p><b>Meltdown and Spectre</b> (2018) were hardware flaws: the CPU\'s speculative execution could leak memory across those boundaries through cache timing. Fixes included kernel page-table isolation and microcode updates. It\'s a reminder that security depends on every layer, down to the chip.</p>' },
          { t: 'mcq', q: 'What hardware feature translates virtual addresses to physical ones?', opts: ['The GPU', 'The MMU using page tables', 'The BIOS', 'The hard drive controller'], a: 1, why: 'The Memory Management Unit walks page tables (cached in the TLB) for every access.' },
          { t: 'tf', q: 'Marking stack pages non-executable is how DEP/NX is implemented.', a: true, why: 'It\'s a per-page permission bit enforced by the CPU.' }
        ]
      },
      {
        id: 'os-files', title: 'Files, permissions & privilege', min: 11, teaser: 'Linux permissions, SUID, and Windows tokens.',
        pre: ['os-proc'], links: ['sp-iam', 'cs-filesystems'],
        cards: [
          { t: 'read', h: 'Linux permissions', body: '<p><code>ls -l</code> shows <code>-rwxr-x---</code>: owner can read/write/execute, group can read/execute, others nothing. In octal: r = 4, w = 2, x = 1 → <b>750</b>. <code>chmod 640 file</code>, <code>chown nate:admins file</code>.</p><p><b>SUID</b> bit: the program runs with its <i>owner\'s</i> privileges (e.g. <code>passwd</code> runs as root to edit /etc/shadow). A SUID-root program with a bug is a privilege escalation path, so admins audit them with <code>find / -perm -4000 -type f 2&gt;/dev/null</code>.</p>', mem: 'r4 w2 x1. Owner, group, others. SUID = runs as the file\'s owner.' },
          { t: 'read', h: 'Windows: users, tokens, UAC', body: '<p>Windows gives each logged-on user an <b>access token</b> (who you are, your groups, your privileges). Files and objects have <b>ACLs</b> listing who can do what. <b>UAC</b> means even admins run with a filtered token until they approve elevation. Attackers try to steal or impersonate tokens; defenders limit admin rights and watch for elevation.</p><p>Least privilege applies to processes too: services should run as dedicated low-privilege accounts, not SYSTEM or root.</p>' },
          { t: 'gen', g: 'osChmod' }, { t: 'gen', g: 'osChmod' },
          { t: 'explain', q: 'Explain why a buggy SUID-root program is dangerous.', points: ['SUID makes a program run with its owner\'s privileges', 'If owned by root, it runs as root even when a normal user starts it', 'A bug in it can let the user run commands as root', 'Audit SUID files and keep them to a minimum'] }
        ]
      }
    ]
  };

  var db = {
    name: 'Databases & SQL', tag: 'CS50 SQL · OWASP',
    blurb: 'Relational databases, writing real SQL, and SQL injection from both sides.',
    lessons: [
      {
        id: 'db-sql', title: 'Relational databases & SELECT', min: 11, teaser: 'Tables, keys, and asking questions in SQL.',
        pre: ['dm-sets'], links: ['db-join', 'py-lists'],
        cards: [
          { t: 'read', h: 'Tables and keys', body: '<p>A relational database stores data in <b>tables</b> (rows and columns). Every table has a <b>primary key</b>, a column that uniquely identifies each row (like user_id). A <b>foreign key</b> in another table points to it, linking them. Splitting data into linked tables so nothing is stored twice is <b>normalization</b>.</p><p>Common databases: PostgreSQL, MySQL/MariaDB, Microsoft SQL Server, SQLite (one file; it\'s on your phone in dozens of apps).</p>' },
          { t: 'read', h: 'SELECT', body: code(['SELECT name, failed', 'FROM users', "WHERE role = 'user' AND failed >= 3", 'ORDER BY failed DESC', 'LIMIT 10;', '', 'SELECT role, COUNT(*) FROM users GROUP BY role;']) + '<p>Read it as: from this table, keep rows matching WHERE, pick these columns, sort, limit. <b>Aggregates</b>: COUNT, SUM, AVG, MIN, MAX. <b>GROUP BY</b> makes one result row per group. Also: <code>INSERT</code>, <code>UPDATE ... SET ... WHERE</code>, <code>DELETE ... WHERE</code> (forget the WHERE and you hit every row).</p>', mem: 'SELECT cols FROM table WHERE filter ORDER BY col.' },
          { t: 'gen', g: 'sqlCount' }, { t: 'gen', g: 'sqlCount' }, { t: 'gen', g: 'sqlCount' },
          { t: 'mcq', q: 'What does <code>DELETE FROM users;</code> (no WHERE) do?', opts: ['Deletes nothing', 'Deletes every row in users', 'Deletes the table structure', 'Syntax error'], a: 1, why: 'No WHERE means every row. Always run the matching SELECT first.' }
        ]
      },
      {
        id: 'db-join', title: 'JOINs & SQL for security work', min: 11, teaser: 'Combine tables, and hunt in logs with SQL.',
        pre: ['db-sql'], links: ['db-inject', 'sp-siem'],
        cards: [
          { t: 'read', h: 'JOIN', body: code(['SELECT u.name, l.ip, l.time', 'FROM logins l', 'JOIN users u ON u.id = l.user_id', "WHERE l.success = 0 AND l.time > '2026-10-30';"]) + '<p>An <b>INNER JOIN</b> keeps rows that match in both tables. A <b>LEFT JOIN</b> keeps every row from the left table, with NULLs where there\'s no match: great for "users who never logged in." Set thinking from discrete math applies directly.</p>' },
          { t: 'read', h: 'SQL in the SOC', body: '<p>Many security tools speak SQL or something close: osquery (query your endpoints like a database: <code>SELECT name, path FROM processes WHERE on_disk = 0;</code>), Microsoft KQL, Splunk SPL, and Security Onion\'s data. If you can GROUP BY and JOIN, you can threat hunt.</p>' + code(['-- IPs with 10+ failed logins in the data', 'SELECT ip, COUNT(*) AS fails FROM logins', 'WHERE success = 0 GROUP BY ip HAVING COUNT(*) >= 10;']) + '<p><code>HAVING</code> filters groups after GROUP BY (WHERE filters rows before).</p>' },
          { t: 'mcq', q: 'You want every user, including those with no login records. Which join?', opts: ['INNER JOIN', 'LEFT JOIN from users to logins', 'CROSS JOIN', 'No join needed'], a: 1, why: 'LEFT JOIN keeps all users; login columns are NULL for users without matches.' },
          { t: 'mcq', q: 'Which clause filters AFTER grouping?', opts: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], a: 1, why: 'WHERE filters individual rows before grouping; HAVING filters the groups.' },
          { t: 'explain', q: 'Write in words a SQL query to find brute-force sources in a login table.', points: ['Filter to failed logins (WHERE success = 0)', 'Group by source IP', 'Count per IP', 'Keep groups over a threshold with HAVING'] }
        ]
      },
      {
        id: 'db-inject', title: 'SQL injection: how it works & how to stop it', min: 12, teaser: 'The bug class that\'s been on OWASP\'s list for 20 years.',
        pre: ['db-join'], links: ['jv-secure', 'sp-vulns-app'],
        cards: [
          { t: 'read', h: 'The root cause', body: '<p>When code glues user input into a SQL string, the input can change the query\'s <b>structure</b>, not just its values. Types you\'ll see: <b>in-band</b> (results show on the page, often via UNION), <b>error-based</b> (database errors leak data), and <b>blind</b> (no output; the attacker infers data from true/false page differences or time delays).</p><p>Practice only on targets you own or are authorized to test, like the DVWA and WebGoat containers in your homelab or PortSwigger\'s free Web Security Academy labs.</p>' },
          { t: 'read', h: 'Defenses, in order of importance', body: '<ol><li><b>Parameterized queries / prepared statements</b> everywhere. This alone solves it.</li><li>ORM or stored procedures used safely (no string building inside them).</li><li><b>Least privilege</b>: the web app\'s DB account can\'t DROP tables or read other databases.</li><li>Input validation (allow-lists for things like sort columns, which can\'t be parameterized).</li><li>A <b>WAF</b> as a backstop, not a fix.</li><li>Logging and alerting on SQL errors.</li></ol>', mem: 'Parameterize. Least privilege. WAF is a backstop.' },
          { t: 'gen', g: 'sqlInj' }, { t: 'gen', g: 'sqlInj' },
          { t: 'pbq', h: 'Pick the control', scenario: 'For each finding, choose the best fix.', opts: ['Parameterized query', 'Least-privilege DB account', 'Allow-list validation', 'Generic error pages', 'WAF rule as a temporary shield'],
            rows: [
              { label: 'Login query built with string concatenation', a: 0 },
              { label: 'Web app connects to the DB as sa / root', a: 1 },
              { label: '?sort= parameter inserted into ORDER BY', a: 2 },
              { label: 'Page shows full SQL error messages', a: 3 },
              { label: 'Legacy app can\'t be patched until next quarter', a: 4 }
            ], why: 'Fix the code first; limit the blast radius second; shield what you can\'t fix yet.' },
          { t: 'explain', q: 'Explain SQL injection and its main fix to a developer.', points: ['Input is concatenated into the SQL text', 'Attacker input changes the query structure', 'Parameterized queries send data separately from code', 'Add least privilege and hide error details'] }
        ]
      }
    ]
  };

  S.units.push(discrete, os, db);
})();
