/* Thicken the thinnest lessons. Each entry adds a "go deeper" read card plus a couple of questions.
   They're inserted after the lesson's first card so the original opening stays the hook. */
(function () {
  function R(h, body, mem) { var c = { t: 'read', h: h, body: body }; if (mem) c.mem = mem; return c; }
  function M(q, opts, a, why) { return { t: 'mcq', q: q, opts: opts, a: a, why: why }; }
  function T(q, a, why) { return { t: 'tf', q: q, a: a, why: why }; }
  var X = {
    'cs-bits-lab': [
      R('Why programmers care about powers of two', '<p>With <b>n bits</b> you get <b>2ⁿ</b> different values: 8 bits → 256, 16 → 65,536, 32 → about 4.3 billion. That\'s why there are about 4.3 billion IPv4 addresses (32 bits), why one byte holds 0–255, and why a <b>/24</b> network has 2⁸ = 256 addresses.</p><p>Quick table to memorize: 2¹⁰ = 1,024 (≈ a thousand, "kilo"), 2²⁰ ≈ a million, 2³⁰ ≈ a billion.</p>', 'n bits → 2ⁿ values. 2¹⁰ ≈ 1,000.'),
      M('How many different values fit in 10 bits?', ['10', '100', '1,024', '2,048'], 2, '2¹⁰ = 1,024.'),
      M('What is binary 1111 1111 in decimal?', ['127', '255', '256', '511'], 1, '128+64+32+16+8+4+2+1 = 255, the largest value in one byte.')
    ],
    'cs-sort-lab': [
      R('Bubble vs merge sort in numbers', '<p>For a list of 1,000 items, bubble sort does roughly 1,000² / 2 ≈ <b>500,000</b> comparisons. Merge sort does about 1,000 × log₂1,000 ≈ <b>10,000</b>. At a million items the gap is ~500 billion vs ~20 million.</p><p>Merge sort works by <b>divide and conquer</b>: split the list in half until each piece has one item, then merge the sorted pieces back together. Python\'s built-in <code>sorted()</code> uses Timsort, a tuned mix of merge sort and insertion sort.</p>', 'n² vs n log n: fine for 10 items, a disaster for a million.'),
      M('Which sort uses divide and conquer?', ['Bubble sort', 'Merge sort', 'Neither', 'Both'], 1, 'Split in halves, sort, merge.'),
      T('For a handful of items, a simple O(n²) sort is perfectly fine.', true, 'Big-O matters as n grows. For tiny lists the simple approach can even be faster.')
    ],
    'geo-oceania': [
      R('Pacific island regions', '<p>The Pacific islands fall into three culture regions:</p><ul><li><b>Melanesia</b> ("black islands"): Papua New Guinea, Fiji, Solomon Islands, Vanuatu.</li><li><b>Micronesia</b> ("small islands"): Guam, Palau, the Marshall Islands, Kiribati.</li><li><b>Polynesia</b> ("many islands"): a huge triangle from Hawaii to New Zealand to Easter Island, including Samoa and Tonga.</li></ul><p>Australia is both a country and a continent. Most of its people live along the southeast coast (Sydney, Melbourne, Brisbane), and the interior ("the Outback") is mostly desert.</p>', 'Mela- black, Micro- small, Poly- many.'),
      M('Which of these is in Polynesia?', ['Papua New Guinea', 'Samoa', 'Guam', 'Indonesia'], 1, 'Samoa, Tonga, Hawaii and New Zealand are in the Polynesian triangle.'),
      M('What is the capital of New Zealand?', ['Auckland', 'Wellington', 'Christchurch', 'Sydney'], 1, 'Auckland is the biggest city; Wellington is the capital.')
    ],
    'w-oceans': [
      R('Why the oceans matter', '<ul><li><b>Currents</b> move heat around the planet. The Gulf Stream carries warm water from the Gulf of Mexico across the Atlantic, which is why the UK is milder than Canada at the same latitude.</li><li>The ocean absorbs a large share of the extra heat and CO₂ from human activity.</li><li><b>The Mariana Trench</b> in the Pacific is the deepest point, about 11 km (nearly 7 miles) down.</li><li>Over 95% of international internet traffic travels through <b>undersea cables</b> on the ocean floor.</li></ul>', 'Currents move heat; cables move the internet.'),
      M('Where is the deepest point in the ocean?', ['Atlantic, Puerto Rico Trench', 'Pacific, Mariana Trench', 'Indian Ocean', 'Arctic Ocean'], 1, 'The Challenger Deep in the Mariana Trench is about 11 km deep.'),
      T('Most international internet traffic travels through undersea cables, not satellites.', true, 'Cables carry the vast majority; satellites are a small share.')
    ],
    'w-regions': [
      R('Why capitals end up where they are', '<ul><li><b>Compromise</b>: Canberra was built between rivals Sydney and Melbourne. Washington, D.C. was placed between North and South.</li><li><b>Fresh start / development</b>: Brazil moved its capital inland to Brasília in 1960 to develop the interior. Nigeria moved from Lagos to Abuja.</li><li><b>History</b>: some capitals stayed put while trade grew elsewhere (Ottawa vs Toronto, Ankara vs Istanbul).</li></ul><p>The same is true for many US states: Baton Rouge not New Orleans, Albany not New York City, Sacramento not Los Angeles.</p>'),
      M('What is the capital of Nigeria?', ['Lagos', 'Abuja', 'Kano', 'Accra'], 1, 'Lagos is the biggest city; the capital moved to Abuja in 1991.'),
      M('Why was Canberra chosen as Australia\'s capital?', ['It was the largest city', 'As a compromise between Sydney and Melbourne', 'It\'s on the coast', 'It was the first settlement'], 1, 'The two big cities both wanted it, so a new city was built between them.')
    ],
    'w-landmarks': [
      R('Rivers that built civilizations', '<ul><li><b>Nile</b>: flows north through Egypt to the Mediterranean, the cradle of ancient Egypt.</li><li><b>Tigris & Euphrates</b>: Mesopotamia (modern Iraq).</li><li><b>Amazon</b>: carries the most water of any river, across northern South America.</li><li><b>Mississippi</b>: drains much of the central US and ends below New Orleans.</li><li><b>Yangtze</b>: China\'s longest river.</li></ul><p>When you can place these, you can place the countries around them.</p>', 'Find the river, then the country.'),
      M('Which river carries the most water?', ['Nile', 'Amazon', 'Mississippi', 'Thames'], 1, 'The Amazon discharges far more water than any other river.'),
      M('Mesopotamia sat between which two rivers?', ['Nile and Congo', 'Tigris and Euphrates', 'Ganges and Indus', 'Rhine and Danube'], 1, 'Mesopotamia means "between rivers", in modern Iraq.')
    ],
    'm-prop': [
      R('Proportions everywhere', '<ul><li><b>Recipes</b>: a recipe for 4 uses 3 cups of flour. For 10 people: 3/4 = x/10 → x = 7.5 cups.</li><li><b>Fuel</b>: 120 miles used 4 gallons. How far on 11? 120/4 = x/11 → x = 330 miles.</li><li><b>Scale models</b> and map scales.</li></ul><p>Sanity check every answer: more people should need more flour. If your answer goes the wrong way, you set the ratio up upside down. Keep the same units on top in both fractions.</p>', 'Same units on top on both sides. Check it makes sense.'),
      { t: 'calc', q: 'A car goes 150 miles on 5 gallons. How many miles on 8 gallons?', a: 240, tol: 0.01, why: '150/5 = x/8 → x = 30 × 8 = 240.' },
      { t: 'calc', q: 'Solve 3/7 = x/28.', a: 12, tol: 0.01, why: '3 × 28 = 7x → 84 = 7x → x = 12.' }
    ],
    'ma-calc-limit': [
      R('Limits you can read off a graph', '<p>The limit from the left and from the right have to <b>agree</b> for the limit to exist. If a graph jumps at x = 2 (approaching 3 from the left and 5 from the right), the limit at 2 does not exist.</p><p>Limits at infinity tell you long-run behavior: as x → ∞, 1/x → 0. For a fraction of polynomials, compare the highest powers: (3x² + 1)/(x² − 4) → 3.</p>', 'Left and right must agree.'),
      { t: 'calc', q: 'Find the limit as x → 3 of (x² − 9)/(x − 3).', a: 6, tol: 0.01, why: 'Factor: (x−3)(x+3)/(x−3) = x + 3 → 6.' },
      M('As x → ∞, what does (4x² + x)/(2x² − 5) approach?', ['0', '2', '4', 'Infinity'], 1, 'Highest powers match, so take the ratio of their coefficients: 4/2 = 2.')
    ],
    'ma-systems': [
      R('Where systems show up', '<p>Any time two facts constrain two unknowns. Example: tickets cost $5 for kids and $9 for adults; 30 tickets sold for $206. Let k + a = 30 and 5k + 9a = 206. Substitute k = 30 − a: 150 − 5a + 9a = 206 → 4a = 56 → a = 14 adults, k = 16 kids.</p><p>Check by plugging back in: 16 × 5 + 14 × 9 = 80 + 126 = 206. ✓</p>', 'Two unknowns, two equations. Always plug back in.'),
      { t: 'calc', q: 'x + y = 10 and x − y = 4. What is x?', a: 7, tol: 0.01, why: 'Add the equations: 2x = 14 → x = 7 (y = 3).' },
      M('Two lines have the same slope and different intercepts. How many solutions?', ['One', 'None', 'Infinitely many', 'Two'], 1, 'Parallel lines never meet.')
    ],
    'ma-func': [
      R('Domain, range and inverses', '<ul><li><b>Domain</b>: the inputs that are allowed. You can\'t divide by zero or take the square root of a negative (in real numbers), so f(x) = √(x − 2) needs x ≥ 2.</li><li><b>Range</b>: the outputs you can get.</li><li><b>Inverse</b> f⁻¹ undoes f. To find it, swap x and y and solve for y. If f(x) = 2x + 3, then f⁻¹(x) = (x − 3)/2.</li><li><b>Composition</b> f(g(x)): do g first, then f.</li></ul>'),
      M('What is the domain of f(x) = 1/(x − 5)?', ['All real numbers', 'All reals except 5', 'x > 5 only', 'x = 5 only'], 1, 'x = 5 would divide by zero.'),
      { t: 'calc', q: 'f(x) = 2x + 1 and g(x) = x². What is f(g(3))?', a: 19, tol: 0.01, why: 'g(3) = 9, then f(9) = 19.' }
    ],
    'ma-trig': [
      R('Special angles to know cold', '<table><tr><th>θ</th><th>sin</th><th>cos</th><th>tan</th></tr><tr><td>30°</td><td>1/2</td><td>√3/2</td><td>1/√3</td></tr><tr><td>45°</td><td>√2/2</td><td>√2/2</td><td>1</td></tr><tr><td>60°</td><td>√3/2</td><td>1/2</td><td>√3</td></tr></table><p>Trick: sine goes √1/2, √2/2, √3/2 for 30°, 45°, 60°, and cosine runs the same list backward. Also <b>sin²θ + cos²θ = 1</b> always, which is just the Pythagorean theorem on the unit circle.</p>', 'Sin: √1, √2, √3 over 2. Cos: backward.'),
      M('What is sin 30°?', ['1/2', '√2/2', '√3/2', '1'], 0, 'The 30-60-90 triangle: the side opposite 30° is half the hypotenuse.'),
      { t: 'calc', q: 'A ramp is 10 m long at 30° to the ground. How high does it rise (m)?', a: 5, tol: 0.01, why: 'height = 10 × sin 30° = 10 × 0.5 = 5.' }
    ],
    'fe-trans': [
      R('The one formula for every first-order circuit', '<p><b>x(t) = x(∞) + [x(0) − x(∞)] e^(−t/τ)</b></p><ol><li>Find the <b>initial value</b> x(0): capacitor voltage and inductor current can\'t change instantly.</li><li>Find the <b>final value</b> x(∞): capacitor is open, inductor is a short.</li><li>Find <b>τ</b>: RC or L/R, using the Thevenin resistance the C or L sees.</li></ol><p>Plug in. This covers charging, discharging and switching problems on the FE.</p>', 'Initial, final, tau. Plug into one formula.'),
      { t: 'calc', q: 'R = 2 kΩ and C = 50 µF. What is τ in milliseconds?', a: 100, tol: 0.01, why: 'τ = RC = 2000 × 50e-6 = 0.1 s = 100 ms.' },
      T('The voltage across a capacitor can jump instantly when a switch flips.', false, 'Capacitor voltage is continuous; inductor current is continuous. That gives you the initial condition.')
    ],
    'fe-opamp': [
      R('The other common configurations', '<ul><li><b>Non-inverting</b>: gain = 1 + Rf/Rg (always ≥ 1, no sign flip).</li><li><b>Voltage follower</b> (buffer): gain = 1. It isolates a weak source from a load.</li><li><b>Summing amp</b>: Vout = −Rf(V1/R1 + V2/R2 + …).</li><li><b>Comparator</b> (no feedback): output slams to the positive or negative rail depending on which input is higher.</li></ul>', 'Inverting −Rf/Rin, non-inverting 1 + Rf/Rg, follower 1.'),
      { t: 'calc', q: 'A non-inverting amp has Rf = 9 kΩ and Rg = 1 kΩ. What is the gain?', a: 10, tol: 0.01, why: '1 + 9/1 = 10.' },
      M('What does a voltage follower do?', ['Doubles the voltage', 'Buffers a signal with gain 1', 'Inverts the signal', 'Filters out DC'], 1, 'High input impedance, low output impedance, gain of one.')
    ],
    'fe-seq': [
      R('Flip-flops and state machines', '<ul><li><b>D flip-flop</b>: on the clock edge, Q takes the value of D. It\'s the basic 1-bit memory.</li><li><b>JK</b>: J=1,K=0 sets, J=0,K=1 resets, both 1 toggles.</li><li><b>T</b>: toggles when T = 1.</li><li>An <b>n-bit counter</b> counts 0 to 2ⁿ − 1.</li><li><b>Moore</b> machine: outputs depend on state only. <b>Mealy</b>: on state and inputs.</li></ul>'),
      M('A JK flip-flop with J = K = 1 does what on the clock edge?', ['Holds', 'Sets', 'Resets', 'Toggles'], 3, 'Both high means toggle.'),
      { t: 'calc', q: 'How many flip-flops do you need for a counter that counts 0 to 12?', a: 4, tol: 0.01, why: '13 states need 4 bits (2⁴ = 16 ≥ 13).' }
    ],
    'es-pret': [
      R('Irregulars you\'ll use constantly', '<ul><li><b>ser / ir</b> (same forms!): fui, fuiste, fue, fuimos, fueron. Context tells you if it\'s "was" or "went".</li><li><b>tener</b>: tuve, tuviste, tuvo, tuvimos, tuvieron.</li><li><b>hacer</b>: hice, hiciste, hizo, hicimos, hicieron.</li><li><b>estar</b>: estuve, estuviste, estuvo…</li><li>Spelling changes in the yo form: busqué, llegué, empecé.</li></ul><p>Clue words that call for the preterite: <b>ayer</b> (yesterday), <b>anoche</b> (last night), <b>la semana pasada</b>, <b>una vez</b>.</p>', 'Fui = I was / I went.'),
      M('"Ayer ___ al gimnasio." (I went)', ['voy', 'fui', 'iba', 'iré'], 1, 'Ir in the preterite: fui.'),
      M('Which means "she did/made"?', ['hace', 'hizo', 'hice', 'hacía'], 1, 'Hacer: hice, hiciste, hizo…')
    ],
    'es-reflexive': [
      R('A daily routine, in Spanish', '<p><b>Me despierto</b> a las seis. <b>Me levanto</b>, <b>me ducho</b> y <b>me visto</b>. Después de entrenar, <b>me baño</b> otra vez. Por la noche <b>me acuesto</b> temprano.</p><p>With an infinitive, the pronoun can go on the end: <i>Voy a acostarme</i> = <i>Me voy a acostar</i>. Some verbs change meaning when reflexive: <b>ir</b> (go) vs <b>irse</b> (leave), <b>dormir</b> (sleep) vs <b>dormirse</b> (fall asleep).</p>'),
      M('"I get dressed" is…', ['Me visto', 'Visto', 'Se visto', 'Te vistes'], 0, 'Vestirse, with the yo form me visto.'),
      M('What does "me voy" mean?', ['I go to sleep', 'I\'m leaving', 'I see myself', 'I\'m going to eat'], 1, 'Irse = to leave.')
    ],
    'es-serestar': [
      R('The memory trick, with exceptions', '<p><b>SER</b> = DOCTOR: Description, Occupation, Characteristic, Time, Origin, Relationship. <b>ESTAR</b> = PLACE: Position, Location, Action (-ando/-iendo), Condition, Emotion.</p><p>Meaning flips: <i>es aburrido</i> (he\'s boring) vs <i>está aburrido</i> (he\'s bored); <i>es listo</i> (smart) vs <i>está listo</i> (ready). Events use ser for location: <i>La fiesta es en mi casa</i>.</p>', 'DOCTOR = ser, PLACE = estar.'),
      M('"The party is at my house."', ['La fiesta está en mi casa', 'La fiesta es en mi casa', 'Either one', 'Neither'], 1, 'Where an event takes place uses ser.'),
      M('"Estoy listo" means…', ['I\'m smart', 'I\'m ready', 'I\'m bored', 'I\'m tall'], 1, 'Estar listo = ready; ser listo = clever.')
    ],
    'mn-bias': [
      R('More biases that cost money and security', '<ul><li><b>Sunk cost</b>: continuing because you\'ve already invested ("I paid for the course, so I have to keep doing it").</li><li><b>Availability</b>: judging risk by what\'s vivid (fearing shark attacks, ignoring driving risk).</li><li><b>Dunning–Kruger</b>: beginners overestimate their skill. Experts know how much they don\'t know.</li><li><b>Optimism bias</b>: "it won\'t happen to us", the reason backups go untested.</li></ul>'),
      M('"We\'ve spent two years on this broken tool, so we can\'t switch now." Which bias?', ['Anchoring', 'Sunk cost', 'Availability', 'Halo effect'], 1, 'Past spending shouldn\'t decide future choices.'),
      T('Optimism bias helps explain why organizations skip testing their backups.', true, '"It won\'t happen to us" is exactly the thinking ransomware punishes.')
    ],
    'mn-logic': [
      R('Common fallacies in arguments', '<ul><li><b>Ad hominem</b>: attacking the person, not the argument.</li><li><b>Straw man</b>: arguing against a weaker version of what they said.</li><li><b>False dilemma</b>: pretending there are only two options.</li><li><b>Slippery slope</b>: assuming one step leads to disaster without evidence.</li><li><b>Appeal to authority</b>: "an expert said it" (on a topic they aren\'t an expert in).</li></ul>'),
      M('"You can\'t trust their security advice; they dropped out of college." Which fallacy?', ['Straw man', 'Ad hominem', 'False dilemma', 'Slippery slope'], 1, 'It attacks the person instead of the advice.'),
      M('"Either we block all USB or we\'ll get hacked." Which fallacy?', ['False dilemma', 'Ad hominem', 'Sunk cost', 'Appeal to authority'], 0, 'There are middle options: allow-listing, scanning, encrypted drives.')
    ],
    'mu-piano-scale': [
      R('Left hand, and why scales matter', '<p>Left hand C major (going up): <b>5 4 3 2 1</b> on C D E F G, then cross finger 3 over to A, and <b>3 2 1</b> on A B C. Going down, it reverses.</p><p>Practice hands separately first at a slow metronome (60 BPM), then together. Scales teach your fingers the key so that songs in that key get easier. Next scale to learn: <b>G major</b>, the same shape with one black key (F♯).</p>', 'LH up: 5-4-3-2-1, cross 3 over.'),
      M('Which black key is in the G major scale?', ['B♭', 'F♯', 'C♯', 'E♭'], 1, 'G A B C D E F♯ G.'),
      T('Practicing scales slowly with a metronome builds speed faster than rushing.', true, 'Clean and slow first, then nudge the BPM up.')
    ],
    'mma-posmap-mount': [
      R('Mount attacks and escapes, in detail', '<p><b>On top</b>: the most common attacks are the <b>arm triangle</b> (when they push on your chest with one arm), the <b>armbar</b> (when they push with both arms), and <b>taking the back</b> when they turn away. Climbing to <b>high mount</b> (knees in their armpits) stops elbow escapes.</p><p><b>On bottom</b>: elbows tight, hands protecting your face. <b>Upa</b>: trap one arm and the same-side foot, bridge high over your shoulder and roll. <b>Elbow-knee</b>: frame on the hip, shrimp, slide your knee inside, recover guard. Never push straight up with long arms, which feeds the armbar.</p>'),
      M('You\'re mounted and push their chest with both straight arms. What risk do you create?', ['None', 'Armbar', 'Leg lock', 'Takedown'], 1, 'Extended arms give them an easy armbar.'),
      M('For the upa, what do you trap?', ['Both legs', 'One arm and the same-side foot', 'Their head', 'Nothing'], 1, 'Trapping the arm and foot on the same side removes their post so they can\'t stop the roll.')
    ],
    'sp-acronyms': [
      R('Group acronyms by domain, not alphabet', '<ul><li><b>Identity</b>: IAM, MFA, SSO, SAML, OAuth, RBAC, ABAC, PAM.</li><li><b>Network</b>: VLAN, VPN, IDS/IPS, NAC, DMZ, WAF, SD-WAN.</li><li><b>Crypto</b>: AES, RSA, ECC, PKI, CA, CRL, OCSP, HSM, TPM.</li><li><b>Ops/monitoring</b>: SIEM, SOAR, EDR, XDR, DLP.</li><li><b>Risk/BC</b>: BIA, RTO, RPO, MTTR, MTBF, SLE, ALE, ARO.</li></ul><p>Learning them in families makes the exam\'s "which tool would you use" questions much easier.</p>', 'Learn them in families.'),
      M('Which acronym is about how much data loss is acceptable after a disaster?', ['RTO', 'RPO', 'MTBF', 'SLA'], 1, 'RPO = recovery point objective (data). RTO = how long until it\'s back up.'),
      M('Which checks a certificate\'s revocation status in real time?', ['CRL', 'OCSP', 'CSR', 'HSM'], 1, 'OCSP asks the CA about one certificate. A CRL is a downloaded list.')
    ],
    'sp-linux-lab': [
      R('What defenders check first on Linux', '<ul><li><code>last</code> and <code>lastb</code>: recent successful and failed logins.</li><li><code>sudo grep "Accepted" /var/log/auth.log</code>: who logged in over SSH.</li><li><code>ss -tulpn</code>: listening ports and the programs behind them.</li><li><code>crontab -l</code> and <code>ls /etc/cron.*</code>: scheduled jobs (persistence).</li><li><code>cat ~/.ssh/authorized_keys</code>: keys that can log in without a password.</li></ul><p>Run these only on systems you own or are authorized to examine.</p>'),
      M('Which file lists the SSH keys allowed to log in as a user?', ['/etc/passwd', '~/.ssh/authorized_keys', '/etc/hosts', '~/.bashrc'], 1, 'An attacker adding their key here is a classic persistence trick.'),
      M('Which command shows recent failed logins?', ['last', 'lastb', 'who', 'pwd'], 1, 'lastb reads the bad-login log (needs root).')
    ],
    'sp-cipher-lab': [
      R('From Caesar to modern crypto', '<p>Caesar shifts every letter by the same amount, so there are only 25 keys: trivially brute-forced. <b>Frequency analysis</b> breaks any simple substitution, because E, T and A are the most common letters in English.</p><p>Modern ciphers like <b>AES</b> use keys of 128–256 bits. 2¹²⁸ possible keys is so many that trying them all is impossible even with every computer on Earth. The lesson: the security comes from the <b>key space</b> and the math, not from keeping the method secret (<b>Kerckhoffs\'s principle</b>).</p>', 'Secret key, public algorithm.'),
      M('Why is Caesar cipher easy to break?', ['It uses AES', 'Only 25 possible keys', 'It\'s quantum-proof', 'It uses hashing'], 1, 'Try all 25 shifts and read which one makes sense.'),
      T('Kerckhoffs\'s principle says a cipher should stay secure even if everything except the key is public.', true, 'That\'s why AES is published openly and is still secure.')
    ],
    'sp-logs-lab': [
      R('Reading a log line like an analyst', '<p>Every useful log line answers: <b>when</b> (timestamp, and which time zone), <b>who</b> (user/account), <b>from where</b> (source IP/host), <b>what</b> (action) and <b>result</b> (success or failure).</p><p>Patterns to hunt: many failures followed by a success (guessing worked), logins at odd hours, impossible travel (two countries 10 minutes apart), and new admin accounts. Always line up time zones before comparing logs from different systems; NTP keeps clocks in sync.</p>', 'When, who, where, what, result.'),
      M('Logins from New York and Singapore 5 minutes apart for one account suggest…', ['Normal travel', 'Impossible travel: likely stolen credentials', 'A slow network', 'A software update'], 1, 'No one travels that fast. Lock the account and investigate.'),
      M('Why does NTP matter for investigations?', ['It encrypts logs', 'It keeps timestamps in sync across systems', 'It blocks malware', 'It compresses logs'], 1, 'Without synced clocks, you can\'t build an accurate timeline.')
    ],
    'sp-phish-lab': [
      R('A 30-second phishing checklist', '<ol><li><b>Sender</b>: does the actual address match the display name? Look for look-alikes (rnicrosoft.com).</li><li><b>Links</b>: hover or long-press to preview the real URL before tapping.</li><li><b>Urgency or fear</b>: "account suspended in 24 hours".</li><li><b>Unusual ask</b>: gift cards, wire transfers, password resets you didn\'t request.</li><li><b>Attachments</b>: unexpected .zip, .html, .iso, or Office files asking to "enable content".</li></ol><p>When in doubt, report it with the phish button and verify through a known channel.</p>'),
      M('The display name says "IT Support" but the address is it-support@gmaill.co. What do you do?', ['Reply with your password', 'Report it as phishing', 'Forward it to coworkers', 'Click to check'], 1, 'A mismatched, look-alike domain is a top red flag.'),
      T('Hovering over a link (or long-pressing on mobile) shows where it really goes.', true, 'The visible text can say anything; the real URL is what matters.')
    ],
    'sp-netscan-lab': [
      R('Reading scan results', '<p>A port can come back <b>open</b> (a service is listening), <b>closed</b> (reachable, but nothing listening), or <b>filtered</b> (a firewall dropped the probe, so no answer). Common ports to recognize: 22 SSH, 53 DNS, 80/443 web, 445 SMB, 3389 RDP.</p><p>Defensive use: scan <b>your own</b> network to find what\'s exposed, then close what shouldn\'t be there. Scanning networks you don\'t own or have written permission for can be illegal.</p>', 'Open, closed, filtered. Only scan what you own.'),
      M('A scan shows port 3389 open on a server facing the internet. Why is that a concern?', ['It\'s DNS', 'RDP exposed to the internet is a top ransomware entry point', 'It\'s always safe', 'It\'s the web server'], 1, 'Put RDP behind a VPN with MFA instead.'),
      M('What does "filtered" mean?', ['Service is running', 'Nothing is listening but the host replied', 'A firewall blocked the probe so there was no clear answer', 'The port is encrypted'], 2, 'Filtered = the probe got dropped.')
    ],
    'pj-pihole': [
      R('What you\'ll learn from it', '<p>Pi-hole acts as your home network\'s DNS server and refuses to resolve known ad and tracking domains. Building it teaches DNS for real: you\'ll see every lookup your devices make (smart TVs are chatty), set DHCP or router DNS settings, and read query logs like a mini SIEM.</p><p>Write-up ideas for your portfolio: which device made the most queries, what share was blocked, and one surprising domain you found. Keep the admin page password-protected and don\'t expose it to the internet.</p>'),
      M('Pi-hole blocks ads mainly by…', ['Scanning web pages', 'Refusing DNS lookups for blocklisted domains', 'Encrypting traffic', 'Slowing Wi-Fi'], 1, 'No DNS answer, no connection to the ad server.'),
      T('You should expose the Pi-hole admin page to the internet so you can check it from anywhere.', false, 'Use a VPN like Tailscale instead (see the remote access project).')
    ]
  };
  (window.RH_SUBJECTS || []).forEach(function (s) { s.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var add = X[l.id]; if (!add || l._thick) return; l._thick = 1;
    Array.prototype.splice.apply(l.cards, [Math.min(1, l.cards.length), 0].concat(add));
  }); }); });
})();
