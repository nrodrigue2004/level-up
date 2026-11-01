/* Thicken, batch 2: music, maps, English, dance, MMA basics, Spanish and more. Same pattern as thicken.js. */
(function () {
  function R(h, body, mem) { var c = { t: 'read', h: h, body: body }; if (mem) c.mem = mem; return c; }
  function M(q, opts, a, why) { return { t: 'mcq', q: q, opts: opts, a: a, why: why }; }
  function T(q, a, why) { return { t: 'tf', q: q, a: a, why: why }; }
  var X = {
    'w-continents': [
      R('Continents by the numbers', '<ul><li><b>Asia</b>: about 30% of land and about 60% of people.</li><li><b>Africa</b>: second in both area and population, and the youngest population on Earth.</li><li><b>North America</b>: third largest. Includes Central America and the Caribbean.</li><li><b>South America</b>, then <b>Antarctica</b> (bigger than Europe, no permanent residents), <b>Europe</b>, and <b>Australia/Oceania</b> (smallest).</li></ul><p>Some countries span two continents: Russia and Turkey (Europe/Asia), Egypt (Africa/Asia via the Sinai).</p>', 'Asia, Africa, N. America, S. America, Antarctica, Europe, Australia (largest → smallest).'),
      M('Which continent is larger: Antarctica or Europe?', ['Europe', 'Antarctica', 'Same size', 'Depends on the season'], 1, 'Antarctica is about 14 million km², Europe about 10 million.'),
      M('Which country lies in both Europe and Asia?', ['Spain', 'Turkey', 'Japan', 'Brazil'], 1, 'Istanbul sits on both sides of the Bosphorus strait.')
    ],
    'geo-europe': [
      M('What is the capital of Switzerland?', ['Zurich', 'Geneva', 'Bern', 'Basel'], 2, 'Bern is the federal city; Zurich is the biggest.'),
      M('Which three countries are the Baltic states?', ['Norway, Sweden, Finland', 'Estonia, Latvia, Lithuania', 'Poland, Czechia, Slovakia', 'Spain, Portugal, Andorra'], 1, 'North to south: Estonia, Latvia, Lithuania.')
    ],
    'geo-asia': [
      M('What is the capital of Turkey?', ['Istanbul', 'Ankara', 'Izmir', 'Antalya'], 1, 'Istanbul is the biggest; Ankara has been the capital since 1923.'),
      M('Which country is made of thousands of islands between Asia and Australia?', ['Thailand', 'Indonesia', 'Mongolia', 'Nepal'], 1, 'Indonesia has over 17,000 islands.')
    ],
    'geo-us': [
      M('What is the capital of Louisiana?', ['New Orleans', 'Baton Rouge', 'Lafayette', 'Shreveport'], 1, 'Baton Rouge, about 80 miles up the Mississippi from New Orleans.'),
      M('Which state borders Louisiana to the west?', ['Mississippi', 'Arkansas', 'Texas', 'Alabama'], 2, 'Texas to the west, Arkansas to the north, Mississippi to the east.')
    ],
    'geo-americas': [
      M('What is the capital of Canada?', ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], 2, 'Ottawa, in Ontario on the Quebec border.'),
      M('Which South American country speaks Portuguese?', ['Argentina', 'Brazil', 'Chile', 'Peru'], 1, 'A legacy of Portuguese colonization.')
    ],
    'geo-africa': [
      M('Which is the largest country in Africa by area?', ['Nigeria', 'Egypt', 'Algeria', 'South Africa'], 2, 'Algeria, mostly Sahara. Nigeria has the most people.'),
      M('Which river flows north through Egypt?', ['Congo', 'Niger', 'Nile', 'Zambezi'], 2, 'The Nile flows north into the Mediterranean.')
    ],
    'w-branches': [
      R('Checks and balances in action', '<ul><li>Congress passes a bill → the <b>President can veto</b> it → Congress can <b>override with two-thirds</b> of both houses.</li><li>The President appoints judges and cabinet members → the <b>Senate confirms</b> them.</li><li>Courts can strike down laws or actions as unconstitutional (<b>judicial review</b>, from <i>Marbury v. Madison</i>, 1803).</li><li>Congress can <b>impeach</b> (House) and remove (Senate, two-thirds) a president or judge.</li><li>Congress controls the budget ("the power of the purse").</li></ul>'),
      M('What does Congress need to override a veto?', ['A simple majority', 'Two-thirds of both houses', 'The Supreme Court\'s approval', 'A national vote'], 1, 'Two-thirds in both the House and the Senate.'),
      M('Which case established judicial review?', ['Brown v. Board', 'Marbury v. Madison', 'Roe v. Wade', 'Miranda v. Arizona'], 1, '1803: courts can declare laws unconstitutional.')
    ],
    'mu-chords': [
      R('Beyond major and minor', '<ul><li><b>Diminished</b>: two minor thirds stacked (3 + 3 half steps), like B D F. Tense, unstable.</li><li><b>Augmented</b>: two major thirds (4 + 4), like C E G♯. Dreamy, unresolved.</li><li><b>Dominant 7th</b>: a major chord plus a minor 7th, like G B D F. It pulls hard back to C, which is why songs end V7 → I.</li><li><b>Sus2 / sus4</b>: replace the third with the 2nd or 4th. Open, neither happy nor sad.</li></ul><p>On piano, keep the root, third and fifth in the same hand shape and just slide it around the keyboard.</p>'),
      M('Which notes make a G7 chord?', ['G B D', 'G B D F', 'G B♭ D', 'G C D'], 1, 'Major triad G B D plus the minor 7th, F.'),
      M('A chord with the third replaced by the fourth is called…', ['Diminished', 'Sus4', 'Minor', 'Augmented'], 1, 'Suspended 4th: C F G.')
    ],
    'mu-intervals': [
      R('Hear them with songs', '<p>Use song openings to learn intervals by ear (going up):</p><ul><li><b>Perfect 4th</b>: "Here Comes the Bride".</li><li><b>Perfect 5th</b>: the Star Wars main theme (first two notes).</li><li><b>Octave</b>: "Somewhere Over the Rainbow" ("Some-where").</li><li><b>Major 3rd</b>: "When the Saints Go Marching In".</li><li><b>Minor 3rd</b>: "Greensleeves" (first two notes).</li></ul><p>Count half steps on the piano widget to check: minor 3rd = 3, major 3rd = 4, 4th = 5, 5th = 7, octave = 12.</p>', 'm3 = 3, M3 = 4, P4 = 5, P5 = 7, octave = 12 half steps.'),
      M('How many half steps in a perfect fifth?', ['5', '7', '4', '12'], 1, 'C to G: 7 half steps.'),
      M('C to E♭ is a…', ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Octave'], 1, '3 half steps.')
    ],
    'mu-piano-start': [
      R('Your first 10 minutes at the keys', '<ol><li>Sit so your elbows are level with the keys and your feet are flat.</li><li>Play C D E F G with right hand fingers 1 2 3 4 5, slowly and evenly, then back down.</li><li>Do the same with the left hand an octave lower (5 4 3 2 1 from C).</li><li>Play a C chord (C E G) with fingers 1 3 5 in each hand.</li><li>Finish by playing anything you like for 2 minutes. Fun keeps you practicing.</li></ol><p>A cheap 61-key keyboard is fine to start, but get one with touch-sensitive keys if you can.</p>'),
      M('What fingers play a C major chord (C E G) in the right hand?', ['1 2 3', '1 3 5', '2 3 4', '1 4 5'], 1, 'Thumb on C, middle on E, pinky on G.'),
      T('Touch-sensitive keys make the sound louder when you press harder.', true, 'That\'s what lets you play with dynamics, as on a real piano.')
    ],
    'dn-club': [
      R('The real club survival kit', '<ul><li><b>Bounce</b> on the beat with soft knees. That alone is 80% of looking fine.</li><li>Add a <b>step-touch</b>: step right, tap left foot next to it, step left, tap right.</li><li>Let the <b>arms follow</b> the body: loose, bent elbows, small movements.</li><li>Change one thing every 8 counts (add a shoulder, turn a little, switch direction).</li><li><b>Smile and stay small.</b> Big, stiff moves look worse than small, relaxed ones.</li></ul>', 'Bounce, step-touch, loose arms, change every 8.'),
      M('What\'s the single best fix for looking stiff?', ['Bigger arm moves', 'Bend the knees and bounce on the beat', 'Stand still', 'Watch your feet'], 1, 'Soft knees on the beat makes everything else look natural.'),
      T('Small, relaxed movements usually look better than big, stiff ones.', true, 'Confidence reads as relaxed, not as big.')
    ],
    'dn-bounce': [
      R('Down or up bounce?', '<p>Most hip-hop and pop feels best with a <b>down bounce</b>: the knees dip <i>on</i> the beat. Some funk and older styles use an <b>up bounce</b>, where you rise on the beat. Try both with the same song, and whichever feels like the music is right.</p><p>Drill: 1 minute of down bounce, 1 minute of up bounce, then 1 minute alternating every 8 counts.</p>'),
      M('In a down bounce, when do the knees dip?', ['Between beats', 'On the beat', 'Only on beat 1', 'Never'], 1, 'Down on the beat.'),
      T('You can practice bounce standing in place with any song.', true, 'It\'s the foundation drill for every style.')
    ],
    'dn-cupid': [
      R('Tips for getting it clean', '<ul><li>Steps to the side are <b>4 small steps</b>, not big ones, so you don\'t crash into neighbors.</li><li>Kicks are quick, low and in rhythm. You don\'t need height.</li><li>The quarter turn happens during "walk it by yourself": you finish facing a new wall.</li><li>After four rounds, you\'re back facing the front.</li></ul>'),
      M('After four full rounds of the Cupid Shuffle you face…', ['The left wall', 'The back', 'The front again', 'The right wall'], 2, 'Four quarter turns = a full circle.'),
      T('The kicks need to be high to look right.', false, 'Low, quick kicks on the beat look cleaner.')
    ],
    'e-mix': [
      R('More mix-ups', '<ul><li><b>Then</b> (time) vs <b>than</b> (comparison): "bigger than", "and then".</li><li><b>Your</b> (belongs to you) vs <b>you\'re</b> (you are).</li><li><b>Lose</b> (misplace) vs <b>loose</b> (not tight).</li><li><b>Who\'s</b> (who is) vs <b>whose</b> (belongs to whom).</li><li><b>Fewer</b> (countable: fewer alerts) vs <b>less</b> (amount: less traffic).</li></ul><p>Test: expand contractions in your head. If "you are" fits, it\'s you\'re.</p>', 'Expand the contraction to test it.'),
      M('"This server is faster ___ the old one."', ['then', 'than', 'thin', 'them'], 1, 'Comparison → than.'),
      M('"We had ___ alerts this week."', ['less', 'fewer', 'lesser', 'few than'], 1, 'Alerts are countable → fewer.')
    ],
    'ma-quad': [
      R('Three ways to solve and when to use each', '<ul><li><b>Factoring</b>: fastest when it works. x² − 5x + 6 = (x − 2)(x − 3) → x = 2 or 3.</li><li><b>Quadratic formula</b>: x = [−b ± √(b² − 4ac)] / 2a. Always works.</li><li><b>Completing the square</b>: turns it into (x − h)² = k, which also gives the vertex.</li></ul><p>The <b>discriminant</b> b² − 4ac tells you what you\'ll get before solving: positive → 2 real roots, zero → 1, negative → none (the parabola never touches the x-axis).</p>', 'Discriminant: +2, 0 → 1, − → none.'),
      { t: 'calc', q: 'How many real solutions does x² + 2x + 5 = 0 have?', a: 0, tol: 0.01, why: 'b² − 4ac = 4 − 20 = −16 < 0, so none.' },
      { t: 'calc', q: 'Solve x² − 7x + 12 = 0. What is the larger root?', a: 4, tol: 0.01, why: '(x − 3)(x − 4) = 0.' }
    ],
    'ma-unit': [
      R('Converting and reading the circle', '<p>Degrees → radians: multiply by π/180. Radians → degrees: multiply by 180/π. Landmarks: 90° = π/2, 180° = π, 270° = 3π/2, 360° = 2π.</p><p><b>Signs by quadrant</b> ("All Students Take Calculus"): Q1 all positive, Q2 only sine, Q3 only tangent, Q4 only cosine.</p>', 'All Students Take Calculus.'),
      { t: 'calc', q: 'Convert 45° to radians (decimal, 2 places).', a: 0.785, tol: 0.01, why: '45 × π/180 = π/4 ≈ 0.785.' },
      M('In quadrant II, which is positive?', ['cos', 'sin', 'tan', 'All of them'], 1, 'All Students Take Calculus: Q2 = Sine.')
    ],
    'fe-dc': [
      R('Nodal vs mesh: pick the faster one', '<ul><li><b>Nodal analysis</b> (KCL at each node): use when there are fewer nodes than loops, or current sources.</li><li><b>Mesh analysis</b> (KVL around each loop): use when there are fewer loops, or voltage sources.</li><li><b>Superposition</b>: one source at a time (others off), then add. Only for linear circuits, and never for power directly.</li><li>Voltage divider: V₂ = V × R₂/(R₁ + R₂). Current divider: I₁ = I × R₂/(R₁ + R₂).</li></ul>'),
      { t: 'calc', q: '12 V across R1 = 4 kΩ and R2 = 2 kΩ in series. Voltage across R2 (V)?', a: 4, tol: 0.01, why: '12 × 2/(4 + 2) = 4 V.' },
      T('Superposition can be used to add up power from each source directly.', false, 'Power is not linear (P = I²R). Add voltages or currents, then compute power.')
    ],
    'lx-admin': [
      R('systemd and journalctl cheatsheet', '<pre>systemctl status ssh         # is it running?\nsudo systemctl restart ssh\nsystemctl list-units --type=service --state=running\njournalctl -u ssh --since "1 hour ago"\njournalctl -p err -b         # errors since boot\ndf -h ; free -h ; uptime     # disk, memory, load</pre><p>Many "server is down" calls are a full disk (<code>df -h</code>) or a crashed service (<code>systemctl status</code>). Check those first.</p>', 'Full disk or dead service first.'),
      M('Which command shows logs for just the SSH service from the last hour?', ['cat /etc/ssh', 'journalctl -u ssh --since "1 hour ago"', 'systemctl stop ssh', 'ls /var'], 1, '-u filters by unit; --since narrows the time.'),
      M('A web server suddenly can\'t write files. Quick first check?', ['Reinstall Linux', 'df -h to see if the disk is full', 'Change the password', 'Reboot the router'], 1, 'A full disk is one of the most common causes.')
    ],
    'cs-logic': [
      R('XOR, NAND and why they matter', '<ul><li><b>XOR</b> (exclusive or): true when the inputs <i>differ</i>. It\'s the heart of binary addition and of encryption: data XOR key = ciphertext, and ciphertext XOR key = data again.</li><li><b>NAND</b> (not-and): only false when both inputs are true. Every other gate can be built from NANDs alone, so chips are mostly built from them.</li></ul>'),
      M('1 XOR 1 = ?', ['1', '0', '2', 'Undefined'], 1, 'Same inputs → 0.'),
      T('Any logic circuit can be built using only NAND gates.', true, 'NAND is "universal".')
    ],
    'mma-ranges': [
      R('Managing distance', '<p>Most fights are won by whoever controls the range. A taller striker wants to stay at kicking range; a wrestler wants to close to the clinch. Tools for <b>closing</b>: a jab to cover your entry, level changes, cutting off the cage. Tools for <b>keeping distance</b>: teep kicks, lateral movement, a stiff jab, circling away from their power hand.</p>'),
      M('A wrestler facing a taller kickboxer wants to…', ['Stay at kicking range', 'Close to the clinch or a takedown', 'Only throw kicks', 'Back up'], 1, 'Take away their best range.'),
      M('Which tool keeps an opponent at distance?', ['Clinch', 'Teep (push kick)', 'Double-leg', 'Guillotine'], 1, 'A teep to the body stops their forward pressure.')
    ],
    'mma-position-first': [
      R('The positional hierarchy', '<p>From best to worst (for the person on top): <b>back control</b> → <b>mount</b> → <b>knee on belly</b> → <b>side control</b> → <b>half guard (top)</b> → <b>guard (top)</b>. On the bottom it reverses: work to improve one step at a time.</p><p>In MMA, getting back to the feet is also a valid "escape", especially against a better grappler.</p>'),
      O_or(['Back control', 'Mount', 'Side control', 'Half guard (top)', 'Closed guard (top)']),
      T('In MMA, standing back up can be a smart escape from a bad position.', true, 'Especially if they\'re the stronger grappler.')
    ],
    'mma-ground-pound': [
      R('Strikes from each position', '<ul><li><b>Guard (top)</b>: posture up, short punches and elbows to the body and head, but watch for armbars and triangles.</li><li><b>Half guard</b>: shoulder pressure, short elbows.</li><li><b>Side control</b>: knees to the body, short elbows.</li><li><b>Mount</b>: the best striking position. Hands back to base if they bridge.</li></ul><p>Training safety: in practice, ground-and-pound is done light or on pads, never at full power on a partner.</p>'),
      M('Which position gives the best ground-and-pound?', ['Bottom guard', 'Mount', 'Half guard bottom', 'Turtle'], 1, 'Gravity and distance are both on your side.'),
      T('In training, ground-and-pound on partners should be light or on pads.', true, 'Save the power for bags and pads.')
    ],
    'mma-triangle': [
      R('Common mistakes and the fix', '<ul><li><b>Squeezing straight on</b>: cut an angle (swing your body toward their trapped arm side) to tighten the choke.</li><li><b>Lock too loose</b>: pull their head down to shorten the gap before locking the leg.</li><li><b>They posture up</b>: pull on the head and push the trapped arm across.</li><li>If they stack you, hips up and angle out, or switch to an armbar on the trapped arm.</li></ul>'),
      M('Your triangle is locked but not finishing. First fix?', ['Let go', 'Cut a sharper angle and pull the head down', 'Stand up', 'Switch to a leg lock'], 1, 'Angle is what closes the choke.'),
      T('From a failed triangle you can often switch to an armbar.', true, 'The arm you trapped is already isolated.')
    ],
    'mma-posmap-guard': [
      R('Breaking posture: the first job', '<p>A postured-up opponent in your guard can strike and can\'t be submitted. So the first job is <b>break the posture</b>: pull with your knees, grab the head or collar tie, and keep them close. Once they\'re broken down, sweeps and submissions open up. If they stand up in your guard, switch to open guard (feet on hips) or get up.</p>'),
      M('Your opponent is postured up in your closed guard. Priority?', ['Throw upkicks immediately', 'Break their posture by pulling them down', 'Open the guard and relax', 'Try a leg lock'], 1, 'No posture, no strikes and no defense against your attacks.'),
      T('A postured opponent is easier to triangle.', false, 'Break the posture first.')
    ],
    'es-imperfect': [
      R('Preterite vs imperfect in one story', '<p><i>Cuando <b>era</b> niño, <b>vivía</b> en Lafayette. Todos los domingos <b>íbamos</b> a la casa de mi abuela. Un día, <b>llegó</b> una tormenta y se <b>fue</b> la luz.</i></p><p>Imperfect sets the scene and describes habits (era, vivía, íbamos). Preterite moves the story forward with one-time events (llegó, se fue). Clue words for the imperfect: <b>siempre</b>, <b>todos los días</b>, <b>cuando era…</b>, <b>mientras</b>.</p>', 'Imperfect = background and habits. Preterite = what happened.'),
      M('"Todos los veranos ___ a la playa." (we used to go)', ['fuimos', 'íbamos', 'vamos', 'iremos'], 1, 'Habitual past → imperfect.'),
      M('"Mientras yo ___, sonó el teléfono." (was sleeping)', ['dormí', 'dormía', 'duermo', 'dormiré'], 1, 'Ongoing background action → imperfect; the interruption is preterite.')
    ],
    'es-questions': [
      R('Accents and word order', '<p>Question words carry an <b>accent</b>: qué, cómo, dónde, cuándo. Without it they\'re connectors: <i>Sé que vienes</i> (I know <b>that</b> you\'re coming). Word order usually flips: <i>¿Dónde trabaja tu hermano?</i>. Useful: <b>¿Cuál?</b> (which) for choices, <b>¿De dónde eres?</b> (where are you from), <b>¿Cuánto cuesta?</b> (how much is it).</p>'),
      M('"Where are you from?"', ['¿Dónde eres?', '¿De dónde eres?', '¿Cuándo eres?', '¿Qué eres?'], 1, 'De dónde = from where.'),
      M('"How much does it cost?"', ['¿Cuánto cuesta?', '¿Cómo cuesta?', '¿Qué cuesta?', '¿Cuál cuesta?'], 0, 'Cuánto = how much.')
    ],
    'es-gustar': [
      R('More verbs like gustar', '<ul><li><b>Encantar</b>: to love (a thing). <i>Me encanta el boxeo.</i></li><li><b>Interesar</b>: <i>Nos interesa la ciberseguridad.</i></li><li><b>Doler</b>: to hurt. <i>Me duele la rodilla. Me duelen los pies.</i></li><li><b>Molestar</b>: to bother. <i>¿Te molesta la música?</i></li><li><b>Faltar</b>: to be missing. <i>Me faltan dos dólares.</i></li></ul><p>For emphasis or clarity add <b>a mí, a ti, a él</b>: <i>A ella le gusta bailar.</i></p>'),
      M('"My feet hurt."', ['Me duele los pies', 'Me duelen los pies', 'Yo duelo los pies', 'Mis pies duelo'], 1, 'Plural subject (los pies) → duelen.'),
      M('"She likes to dance."', ['Ella gusta bailar', 'A ella le gusta bailar', 'Le gustan bailar', 'Ella le gusto bailar'], 1, 'A ella + le + gusta + infinitive.')
    ],
    'mn-learning': [
      R('Using this on yourself', '<ul><li><b>Habit loop</b>: cue → routine → reward. Attach new habits to an existing cue (after brushing teeth → 10 flashcards).</li><li><b>Make it easy</b>: fewer steps to start (gym bag packed the night before).</li><li><b>Reward right away</b>: the streak and XP in this app are a deliberate positive reinforcer.</li><li>Variable rewards (social media, slot machines) are powerful, so notice when they\'re using you.</li></ul>'),
      M('What\'s a good cue for a new study habit?', ['"Whenever I feel like it"', 'Right after an existing daily habit, like morning coffee', 'Only on weekends', 'When I\'m bored'], 1, 'Stack it on a habit you already have.'),
      T('Variable rewards create some of the strongest, hardest-to-break habits.', true, 'That\'s why slot machines and endless feeds are so sticky.')
    ],
    'pj-remote': [
      R('Why a mesh VPN beats port-forwarding', '<p>Opening ports on your router (like 3389 for RDP or 22 for SSH) exposes services to the whole internet, where bots scan constantly. A <b>mesh VPN</b> like Tailscale or WireGuard connects only your own devices with keys, so nothing is exposed. Turn on MFA for the account and remove old devices you no longer use.</p><p>Portfolio write-up: draw a diagram of your devices, explain why no inbound ports are open, and show your access controls (ACLs).</p>'),
      M('Why avoid forwarding port 3389 (RDP) on your home router?', ['It\'s slow', 'It exposes RDP to constant internet scanning and brute force', 'It costs money', 'It disables Wi-Fi'], 1, 'Exposed RDP is a top ransomware entry point.'),
      T('With a mesh VPN, you don\'t need to open any inbound ports on your router.', true, 'Devices connect outbound to coordinate, then talk directly with keys.')
    ]
  };
  function O_or(items) { return { t: 'order', q: 'Rank these positions from best to worst for the top player.', items: items, why: 'Back, mount, side control, half guard, then guard.' }; }
  // O_or is used inside X before it's defined. Function declarations hoist, so this works.
  (window.RH_SUBJECTS || []).forEach(function (s) { s.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var add = X[l.id]; if (!add || l._thick2) return; l._thick2 = 1;
    Array.prototype.splice.apply(l.cards, [Math.min(1, l.cards.length), 0].concat(add));
  }); }); });
})();
