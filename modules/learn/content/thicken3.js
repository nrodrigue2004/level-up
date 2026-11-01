/* Thicken, batch 3. Same pattern as thicken.js. */
(function () {
  function R(h, body, mem) { var c = { t: 'read', h: h, body: body }; if (mem) c.mem = mem; return c; }
  function M(q, opts, a, why) { return { t: 'mcq', q: q, opts: opts, a: a, why: why }; }
  function T(q, a, why) { return { t: 'tf', q: q, a: a, why: why }; }
  function C(q, a, why, tol) { return { t: 'calc', q: q, a: a, tol: tol == null ? 0.01 : tol, why: why }; }
  var X = {
    'm-rate': [
      R('Speed, wages and unit conversions', '<p><b>Distance = rate × time</b>. 180 miles at 60 mph takes 3 hours. Pay works the same way: $15/hour × 32 hours = $480.</p><p>To convert units, multiply by a fraction equal to 1: 60 mph × (5,280 ft / 1 mi) × (1 hr / 3,600 s) = 88 ft/s. Units that appear on both the top and the bottom cancel.</p>', 'd = r × t. Convert by multiplying by fractions worth 1.'),
      C('A 12-pack costs $7.80. Price per can ($)?', 0.65, '7.80 / 12 = 0.65.'),
      C('You drive 210 miles in 3.5 hours. Average speed (mph)?', 60, '210 / 3.5 = 60.')
    ],
    'm-pyth': [
      R('Triples and distance', '<p>Whole-number <b>Pythagorean triples</b> to recognize instantly: <b>3-4-5</b>, <b>5-12-13</b>, <b>8-15-17</b>, and their multiples (6-8-10, 9-12-15).</p><p>The <b>distance formula</b> is just Pythagoras on a grid: d = √((x₂ − x₁)² + (y₂ − y₁)²). From (1, 2) to (4, 6): √(9 + 16) = 5.</p><p>Builders square a corner with 3-4-5: mark 3 ft and 4 ft along the two walls, and if the diagonal is 5 ft, the corner is 90°.</p>', '3-4-5, 5-12-13, 8-15-17.'),
      C('A right triangle has legs 9 and 12. Hypotenuse?', 15, '3-4-5 times 3.'),
      C('Distance from (0, 0) to (6, 8)?', 10, '√(36 + 64) = 10.')
    ],
    'm-prob': [
      R('And, or, and "at least one"', '<ul><li><b>And</b> (independent): multiply. Two coin flips both heads: ½ × ½ = ¼.</li><li><b>Or</b> (can\'t both happen): add. A die shows 1 or 2: 1/6 + 1/6 = 1/3.</li><li><b>At least one</b>: 1 − P(none). At least one 6 in 4 rolls: 1 − (5/6)⁴ ≈ 0.52.</li><li><b>Expected value</b>: average outcome = Σ value × probability. It\'s why casinos win in the long run.</li></ul>', 'And → multiply. Or → add. At least one → 1 − none.'),
      C('Probability of rolling two 6s with two dice (as a decimal, 3 places)?', 0.028, '1/36 ≈ 0.028.', 0.002),
      C('A phishing email fools 10% of people. Sent to 3 people, what\'s the probability at least one is fooled? (decimal)', 0.271, '1 − 0.9³ = 0.271.', 0.002)
    ],
    'm-stats': [
      R('Spread, not just center', '<p>Two classes can both average 75 with very different spreads. <b>Range</b> = max − min. <b>Standard deviation</b> measures typical distance from the mean. In a bell curve, about <b>68%</b> of values fall within 1 SD, <b>95%</b> within 2, <b>99.7%</b> within 3.</p><p>Security use: alerting when logins are more than 3 SDs above normal is a simple anomaly detector.</p>', '68-95-99.7.'),
      M('Test scores have a mean of 70 and an SD of 10. About what share scored between 60 and 80?', ['50%', '68%', '95%', '99.7%'], 1, 'Within 1 SD of the mean.'),
      C('Data: 4, 8, 15, 16, 23, 42. What is the median?', 15.5, 'Middle two are 15 and 16 → 15.5.')
    ],
    'mu-guitar-chords': [
      R('The beginner chord family', '<p>Learn these eight open chords and you can play thousands of songs: <b>G, C, D, Em, Am, E, A, Dm</b>. The easiest pairs to switch between share a finger: <b>Em ↔ G</b>, <b>Am ↔ C</b> (the 1st and 2nd fingers stay put), <b>D ↔ A</b>.</p><p>Fix buzzing: press just behind the fret (not on top of it), arch your fingers so they don\'t touch other strings, and keep your thumb behind the neck.</p>', 'Press just behind the fret. Arch the fingers.'),
      M('A string buzzes on a chord. Most common fix?', ['Strum harder', 'Press just behind the fret and arch your fingers', 'Buy a new guitar', 'Tune it lower'], 1, 'Buzz usually means the finger is too far from the fret or touching a neighbor string.'),
      M('Which chord change is easiest because fingers stay put?', ['Am ↔ C', 'F ↔ B', 'E ↔ Bm', 'G ↔ F'], 0, 'Fingers 1 and 2 stay in the same place for Am and C.')
    ],
    'mu-fretboard': [
      R('Finding notes on the low E string', '<p>Each fret is one half step. On the low E string: open E, 1 F, 3 G, 5 A, 7 B, 8 C, 10 D, 12 E (an octave). There\'s no sharp between E–F and B–C.</p><p>The A string works the same way starting from A: 2 B, 3 C, 5 D, 7 E, 8 F, 10 G. Knowing these two strings lets you place any power chord or barre chord.</p>'),
      M('Which fret on the low E string is A?', ['3', '5', '7', '2'], 1, 'E-F (1)-F♯ (2)-G (3)-G♯ (4)-A (5).'),
      M('A power chord with its root on the 3rd fret of the low E string is…', ['A5', 'G5', 'C5', 'F5'], 1, '3rd fret on E = G.')
    ],
    'mu-numbers': [
      R('Common progressions by number', '<ul><li><b>I–IV–V</b>: blues, rock and country. In G: G C D.</li><li><b>I–V–vi–IV</b>: modern pop.</li><li><b>vi–IV–I–V</b>: the same chords starting on the minor, which feels sadder.</li><li><b>ii–V–I</b>: the backbone of jazz.</li><li><b>12-bar blues</b>: I I I I | IV IV I I | V IV I V.</li></ul>'),
      M('In the key of G, what are I, IV and V?', ['G C D', 'G A B', 'G D E', 'G B D'], 0, 'G A B C D E F♯: 1st = G, 4th = C, 5th = D.'),
      M('Which progression is the backbone of jazz?', ['I–IV–V', 'ii–V–I', 'I–V–vi–IV', 'i–VII–VI'], 1, 'ii–V–I, like Dm7 G7 Cmaj7.')
    ],
    'mu-scales': [
      R('The pentatonic shortcut', '<p>The <b>minor pentatonic</b> is a five-note scale (A C D E G in A minor) with no "wrong" notes over most rock and blues. Add the flat 5 (E♭) and it becomes the <b>blues scale</b>. On guitar it\'s one box shape at the 5th fret, which is how most people start soloing.</p><p>The <b>major scale</b> pattern is W W H W W W H (whole and half steps). Every major key uses that same pattern from a different starting note.</p>', 'W W H W W W H.'),
      M('How many notes are in a pentatonic scale?', ['5', '7', '8', '12'], 0, 'Penta = five.'),
      M('The major scale step pattern is…', ['W H W W H W W', 'W W H W W W H', 'H W W W H W W', 'W W W H W W H'], 1, 'C D E F G A B C.')
    ],
    'mu-strum': [
      R('Three patterns to learn in order', '<ol><li><b>All downs</b>: D D D D. Steady quarter notes.</li><li><b>Down-up eighths</b>: D U D U D U D U.</li><li><b>The "folk" pattern</b>: D – D U – U D U (skip the down on beat 3, and keep the hand moving anyway).</li></ol><p>Muting: rest the side of your strumming hand on the strings to make a percussive "chk", which is great for funk and reggae.</p>'),
      M('In the "D – D U – U D U" pattern, what does your hand do on the gaps?', ['Stops', 'Keeps moving but misses the strings', 'Mutes', 'Plays harder'], 1, 'The pendulum never stops, which keeps the time steady.'),
      T('Resting your strumming hand on the strings creates a percussive muted sound.', true, 'The "chk" used in funk and reggae.')
    ],
    'dn-count': [
      R('Phrases and drops', '<p>Most pop, hip-hop and EDM is built in <b>phrases of 4 × 8 counts</b> (32 beats). Big changes, like a chorus or a beat drop, almost always land on the 1 of a new phrase. If you count 8s and track which 8 you\'re on (1 to 4), you can predict the drop and change your move right on it, which looks rehearsed even if it isn\'t.</p>'),
      M('Big changes in a song usually land on…', ['Count 5', 'The 1 of a new phrase', 'Count 8', 'Random beats'], 1, 'Phrases usually start on a strong 1.'),
      T('Most pop songs are built in phrases of four 8-counts.', true, '32 beats per phrase.')
    ],
    'dn-hiphop': [
      R('Adding style to the two-step', '<ul><li><b>Shoulders</b>: lean them toward the stepping foot.</li><li><b>Snap or clap</b> on the 2 and 4 (the snare).</li><li><b>Arms</b>: swing loosely in opposition or keep them low with relaxed hands.</li><li><b>Turns</b>: step-touch around in a circle over 8 counts.</li></ul>'),
      M('Where do you clap in most hip-hop?', ['On 1 and 3', 'On 2 and 4', 'Only on 1', 'Off-beat 8ths'], 1, 'The snare hits on 2 and 4.'),
      T('Leaning the shoulders toward the stepping foot makes the two-step look smoother.', true, 'The body follows the feet.')
    ],
    'mma-hipbump': [
      R('Making the hip bump work', '<p>The timing is everything: hit it when they <b>sit back</b> or posture up, because their weight is already moving away from you. Post your hand behind you, sit up fast and drive your hip into their chest at an angle, over their shoulder, not straight up. If they post a hand on the mat to stop it, that arm is now isolated for the kimura. If they push back into you, switch to a guillotine.</p>'),
      M('When is the best time to hit the hip bump?', ['When they lean forward on you', 'When they sit back or posture up', 'Only after a triangle', 'Never in MMA'], 1, 'Their weight is already moving away from you.'),
      M('They post a hand to stop the hip bump. Your next attack?', ['Armbar from guard', 'Kimura on the posted arm', 'Heel hook', 'Stand up'], 1, 'The posted arm is isolated, ideal for the kimura.')
    ],
    'py-if': [
      R('Truthiness and combining conditions', '<p>Python treats some values as false in an <code>if</code>: <code>0</code>, <code>""</code>, <code>[]</code>, <code>{}</code> and <code>None</code>. Everything else counts as true. So <code>if failed_logins:</code> means "if the list isn\'t empty".</p><pre>if attempts &gt; 5 and not user.is_admin:\n    lock(user)\nelif attempts &gt; 3 or ip in watchlist:\n    alert(user)</pre><p>Use <code>==</code> to compare and <code>=</code> to assign. Mixing them up is the most common beginner bug.</p>', 'Empty = False. == compares, = assigns.'),
      M('What does `if []:` do?', ['Runs the block', 'Skips the block', 'Crashes', 'Loops forever'], 1, 'An empty list counts as False.'),
      M('Which operator checks equality?', ['=', '==', '!=', ':='], 1, '= assigns; == compares.')
    ],
    'career-network': [
      R('A week in the life', '<ul><li>Monday: a branch office reports slow Wi-Fi. Check channel overlap and access point placement.</li><li>Tuesday: change window, a firewall rule update tested in staging first.</li><li>Wednesday: a new VLAN for security cameras, isolated from staff devices.</li><li>Thursday: an outage where a switch port went down. Trace with <code>show interface</code>, find a bad cable.</li><li>Friday: document everything and update the network diagram.</li></ul><p>Path: help desk → NOC technician → network admin → network engineer → network/security architect. CCNA and Network+ are the classic certs.</p>'),
      M('Which certification is most associated with network engineering?', ['CCNA', 'OSCP', 'CISSP', 'A+'], 0, 'Cisco Certified Network Associate.'),
      T('Network engineers often implement security controls like VLAN segmentation and firewall rules.', true, 'Networking and security overlap heavily.')
    ],
    'fe-controls': [
      R('Reading a step response', '<p>Second-order systems are described by the <b>damping ratio ζ</b> and natural frequency ωn:</p><ul><li>ζ &lt; 1: underdamped. Overshoots and rings.</li><li>ζ = 1: critically damped. Fastest response with no overshoot.</li><li>ζ &gt; 1: overdamped. Slow, no overshoot.</li></ul><p>Stability: all poles of the closed-loop transfer function must be in the <b>left half</b> of the s-plane. <b>PID</b> control: P reacts to the error now, I removes steady-state error, D damps fast changes.</p>', 'Poles in the left half-plane = stable.'),
      M('Which PID term removes steady-state error?', ['P', 'I', 'D', 'None'], 1, 'The integral term accumulates error until it\'s gone.'),
      M('A system has a pole at s = +2. It is…', ['Stable', 'Unstable', 'Critically damped', 'Marginally stable'], 1, 'A right half-plane pole grows exponentially.')
    ],
    'fe-arch': [
      R('Pipelines and hazards', '<p>A 5-stage pipeline (fetch, decode, execute, memory, write-back) works on 5 instructions at once, like a car wash. <b>Hazards</b> stall it:</p><ul><li><b>Data</b>: an instruction needs a result that isn\'t ready yet. Fixed by forwarding.</li><li><b>Control</b>: a branch, where we don\'t know the next instruction yet. Fixed by branch prediction. (Spectre abused exactly this.)</li><li><b>Structural</b>: two stages need the same hardware.</li></ul>'),
      C('Cache hit time 1 ns, miss rate 5%, miss penalty 100 ns. AMAT (ns)?', 6, '1 + 0.05 × 100 = 6.'),
      M('Which attack abused speculative execution from branch prediction?', ['Heartbleed', 'Spectre', 'SQL injection', 'Rowhammer'], 1, 'Spectre (2018) leaked data through speculatively executed instructions.')
    ],
    'fe-signals': [
      R('Filters and the Fourier idea', '<p>Any signal can be built from sine waves of different frequencies (the <b>Fourier</b> idea). Filters keep some frequencies and cut others:</p><ul><li><b>Low-pass</b>: keeps lows (removes hiss). A simple RC low-pass has cutoff fc = 1/(2πRC).</li><li><b>High-pass</b>: keeps highs (removes hum or DC).</li><li><b>Band-pass</b>: keeps a range (a radio tuner).</li></ul>'),
      C('RC low-pass with R = 1 kΩ, C = 1 µF. Cutoff frequency in Hz (nearest whole)?', 159, '1/(2π × 1000 × 1e-6) ≈ 159 Hz.', 1),
      M('Which filter removes 60 Hz hum but keeps a 5 kHz signal?', ['Low-pass at 50 Hz', 'High-pass around a few hundred Hz', 'Band-stop at 5 kHz', 'None'], 1, 'Cut the low, keep the high.')
    ],
    'dm-count': [
      R('Counting passwords', '<p>Possible passwords = (character set size)^(length). Lowercase only, 8 chars: 26⁸ ≈ 209 billion. All 95 printable characters, 12 chars: 95¹² ≈ 5.4 × 10²³. <b>Length grows the space faster than complexity</b>, which is why passphrases win.</p><p>Permutations (order matters): n!/(n − k)!. Combinations (order doesn\'t): n!/(k!(n − k)!).</p>', 'Length beats complexity.'),
      C('How many 4-digit PINs (0000 to 9999)?', 10000, '10⁴.'),
      C('Choose 3 people from 10 for a team (order doesn\'t matter)?', 120, '10!/(3!·7!) = 120.')
    ],
    'se-secure': [
      R('Security in every stage', '<ul><li><b>Requirements</b>: write abuse cases ("as an attacker I want…").</li><li><b>Design</b>: threat model (STRIDE).</li><li><b>Code</b>: secure coding standards, peer review.</li><li><b>Build</b>: SAST (scans source code), dependency scanning (SCA) for known-vulnerable libraries, secret scanning.</li><li><b>Test</b>: DAST (tests the running app), fuzzing.</li><li><b>Release/operate</b>: patching, logging, a bug bounty or disclosure policy.</li></ul><p>"Shift left" means catching problems earlier, when they\'re cheaper to fix.</p>'),
      M('Which tool scans source code without running it?', ['DAST', 'SAST', 'A WAF', 'A SIEM'], 1, 'Static Application Security Testing.'),
      M('A library you use has a known CVE. Which tool catches that?', ['SCA / dependency scanning', 'Fuzzing', 'Threat modeling', 'Pentest only'], 0, 'Software Composition Analysis checks dependencies against vulnerability databases.')
    ],
    'lx-harden': [
      R('Verify your hardening', '<p>Hardening isn\'t done until you check it:</p><ul><li><code>sudo sshd -T | grep -E "permitrootlogin|passwordauthentication"</code>: confirm SSH settings.</li><li><code>sudo ufw status verbose</code>: confirm default deny.</li><li><code>ss -tulpn</code>: only the ports you expect are listening.</li><li>Run <b>Lynis</b> (a free audit tool) for a hardening score and to-do list.</li><li>CIS Benchmarks are the industry checklists.</li></ul>'),
      M('Which free tool audits a Linux system\'s hardening?', ['Lynis', 'Nmap', 'Wireshark', 'Hashcat'], 0, 'Lynis gives a score plus specific suggestions.'),
      T('CIS Benchmarks are widely used hardening checklists.', true, 'They exist for most operating systems and cloud platforms.')
    ],
    'pj-rules': [
      R('Why the rules matter (legally)', '<p>In the US, the <b>Computer Fraud and Abuse Act</b> makes accessing computers without authorization a crime, even "just looking". Other countries have similar laws. Scanning a network you don\'t own can violate an ISP\'s terms of service. Real pentesters work only with <b>written permission</b> and a defined scope.</p><p>Your lab rules: your own devices, VMs on an isolated network, intentionally vulnerable targets (like Metasploitable or DVWA), and legal platforms (TryHackMe, HackTheBox).</p>'),
      M('Which is legal practice?', ['Scanning your school\'s network to test it', 'Attacking a vulnerable VM you set up on your own isolated lab network', 'Testing a friend\'s website without asking', 'Scanning random IPs'], 1, 'Own it, isolate it, or have written permission.'),
      T('Good intentions make unauthorized access legal.', false, 'Authorization is what makes it legal, not intent.')
    ],
    'pj-ir': [
      R('The incident response lifecycle', '<p>NIST\'s IR lifecycle: <b>Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-incident activity</b>. In this mission you\'ll practice all four in your lab: have tools ready, notice the simulated attack, isolate the VM, clean it up, then write a short lessons-learned report.</p><p>Key rule: <b>contain before you eradicate</b>, and preserve evidence (snapshots, logs) before wiping anything.</p>'),
      M('What should happen before wiping a compromised machine?', ['Nothing', 'Preserve evidence (snapshot, logs, memory)', 'Post about it', 'Change the wallpaper'], 1, 'Once it\'s wiped, the evidence is gone.'),
      M('Which phase includes a lessons-learned meeting?', ['Preparation', 'Detection', 'Containment', 'Post-incident activity'], 3, 'Improve for next time.')
    ],
    'pj-web': [
      R('Running the lab safely', '<p>Run DVWA or OWASP Juice Shop in a VM or a container bound to <code>localhost</code> or a host-only network, never exposed to the internet, because they\'re deliberately vulnerable. Use your browser\'s DevTools (Network tab) to watch requests, and Burp Suite Community or OWASP ZAP to intercept them.</p><p>For each finding, write: the vulnerability, how you found it, the impact, and the fix (parameterized queries, output encoding, access checks).</p>'),
      M('Where should a deliberately vulnerable web app run?', ['On a public server', 'In an isolated VM or container on localhost/host-only', 'On your work laptop\'s network', 'On a friend\'s server'], 1, 'Isolated so nobody else can exploit it.'),
      M('The fix for SQL injection you\'d write in the report?', ['Hide the error messages', 'Parameterized queries', 'Use a longer password', 'Turn off the database'], 1, 'Keep data separate from the SQL code.')
    ],
    'sp-pw-lab': [
      R('How passwords actually get cracked', '<ul><li><b>Dictionary attacks</b>: try leaked password lists first. "Summer2024!" falls in seconds.</li><li><b>Rules</b>: add common tweaks (capitalize, add digits, swap a→@).</li><li><b>Brute force</b>: every combination. Only practical for short passwords.</li><li><b>Credential stuffing</b>: reuse passwords leaked from another site.</li></ul><p>Defenses: long unique passphrases in a password manager, MFA, and on the server side, slow salted hashes (bcrypt, Argon2) plus lockouts.</p>'),
      M('Which defense stops credential stuffing best?', ['Longer password on one site', 'Unique passwords per site + MFA', 'Changing passwords monthly', 'Adding a symbol'], 1, 'Stuffing relies on reuse.'),
      T('"Summer2024!" is strong because it has upper, lower, digits and a symbol.', false, 'It follows a predictable pattern that cracking rules try first.')
    ]
  };
  (window.RH_SUBJECTS || []).forEach(function (s) { s.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var add = X[l.id]; if (!add || l._thick3) return; l._thick3 = 1;
    Array.prototype.splice.apply(l.cards, [Math.min(1, l.cards.length), 0].concat(add));
  }); }); });
})();
