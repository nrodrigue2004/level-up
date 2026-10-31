/* K-12 Science refresh: how science works, biology, chemistry, physics, earth & space.
   Backbones: OpenStax Biology 2e, Chemistry 2e, College Physics 2e, Astronomy 2e (all CC BY 4.0), rewritten in plain words. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function calc(q, a, why, tol) { return { t: 'calc', q: q, a: a, tol: tol == null ? 0.001 : tol, why: why }; }
  function mc(q, right, wrongs, why) {
    var seen = {}, opts = [right]; seen[right] = 1;
    wrongs.forEach(function (w) { if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
    return { t: 'mcq', q: q, opts: opts, a: 0, why: why };
  }

  G.sciFma = function () {
    var m = r(2, 120), a = r(1, 12), k = r(0, 2);
    if (k === 0) return calc('A <b>' + m + ' kg</b> object accelerates at <b>' + a + ' m/s²</b>. What net force (in newtons) is acting on it?', m * a, 'F = m × a = ' + m + ' × ' + a + ' = ' + (m * a) + ' N.');
    if (k === 1) return calc('A net force of <b>' + (m * a) + ' N</b> pushes a <b>' + m + ' kg</b> cart. What is its acceleration (m/s²)?', a, 'Rearrange F = ma → a = F ÷ m = ' + (m * a) + ' ÷ ' + m + ' = ' + a + ' m/s².');
    return calc('A <b>' + (m * a) + ' N</b> force gives an object an acceleration of <b>' + a + ' m/s²</b>. What is its mass (kg)?', m, 'm = F ÷ a = ' + (m * a) + ' ÷ ' + a + ' = ' + m + ' kg.');
  };
  G.sciSpeed = function () {
    var v = r(3, 70), t = r(2, 12), k = r(0, 1);
    if (k === 0) return calc('A car goes <b>' + (v * t) + ' km</b> in <b>' + t + ' hours</b>. Average speed in km/h?', v, 'speed = distance ÷ time = ' + (v * t) + ' ÷ ' + t + ' = ' + v + ' km/h.');
    return calc('You run at <b>' + Math.min(v, 12) + ' km/h</b> for <b>' + t + ' hours</b>. How far do you go (km)?', Math.min(v, 12) * t, 'distance = speed × time = ' + Math.min(v, 12) + ' × ' + t + ' = ' + (Math.min(v, 12) * t) + ' km.');
  };
  G.sciOhm = function () {
    var I = pk([0.5, 1, 2, 3, 4, 5, 6]), R = pk([2, 4, 5, 10, 12, 20, 24, 50]), V = I * R, k = r(0, 2);
    if (k === 0) return calc('A <b>' + R + ' Ω</b> resistor carries <b>' + I + ' A</b>. What voltage is across it (V)?', V, 'Ohm\'s law: V = I × R = ' + I + ' × ' + R + ' = ' + V + ' V.');
    if (k === 1) return calc('A <b>' + V + ' V</b> battery is connected to a <b>' + R + ' Ω</b> resistor. What current flows (A)?', I, 'I = V ÷ R = ' + V + ' ÷ ' + R + ' = ' + I + ' A.');
    return calc('<b>' + I + ' A</b> flows when <b>' + V + ' V</b> is applied. What is the resistance (Ω)?', R, 'R = V ÷ I = ' + V + ' ÷ ' + I + ' = ' + R + ' Ω.');
  };
  G.sciPunnett = function () {
    var cross = pk([['Bb', 'Bb', '3/4', '1/4'], ['Bb', 'bb', '1/2', '1/2'], ['BB', 'bb', '1', '0'], ['BB', 'Bb', '1', '0'], ['bb', 'bb', '0', '1']]);
    var askRecessive = Math.random() < .5, right = askRecessive ? cross[3] : cross[2];
    return mc('Brown eyes (B) are dominant over blue (b). Parents <b>' + cross[0] + ' × ' + cross[1] + '</b>. What fraction of kids are expected to have <b>' + (askRecessive ? 'blue' : 'brown') + '</b> eyes?', right, ['3/4', '1/2', '1/4', '1', '0'].filter(function (x) { return x !== right; }),
      'Draw the 2×2 Punnett square: each parent gives one letter. Any kid with at least one B has brown eyes; only bb is blue. From ' + cross[0] + ' × ' + cross[1] + ': brown = ' + cross[2] + ', blue = ' + cross[3] + '.');
  };
  var ELEM = [['H', 'Hydrogen', 1], ['He', 'Helium', 2], ['C', 'Carbon', 6], ['N', 'Nitrogen', 7], ['O', 'Oxygen', 8], ['Na', 'Sodium', 11], ['Mg', 'Magnesium', 12], ['Al', 'Aluminum', 13], ['Si', 'Silicon', 14], ['Cl', 'Chlorine', 17], ['K', 'Potassium', 19], ['Ca', 'Calcium', 20], ['Fe', 'Iron', 26], ['Cu', 'Copper', 29], ['Ag', 'Silver', 47], ['Au', 'Gold', 79], ['Pb', 'Lead', 82]];
  G.sciElem = function () {
    var e = pk(ELEM), k = r(0, 1), others = ELEM.filter(function (x) { return x !== e; }).sort(function () { return Math.random() - .5; });
    if (k === 0) return mc('Which element has the symbol <b>' + e[0] + '</b>?', e[1], others.map(function (x) { return x[1]; }), e[0] + ' = ' + e[1] + ' (atomic number ' + e[2] + ', meaning ' + e[2] + ' protons).' + (['Na', 'K', 'Fe', 'Cu', 'Ag', 'Au', 'Pb'].indexOf(e[0]) >= 0 ? ' The symbol comes from its Latin name, which is why it doesn\'t match.' : ''));
    return calc('How many <b>protons</b> does a neutral atom of <b>' + e[1] + '</b> (' + e[0] + ') have? (Its atomic number is ' + e[2] + '.)', e[2], 'Atomic number = number of protons. Always. In a neutral atom, electrons equal protons too, so ' + e[2] + ' electrons.');
  };
  var STATES = [['ice melting', 'Melting (solid → liquid)'], ['a puddle drying up', 'Evaporation (liquid → gas)'], ['dew forming on grass', 'Condensation (gas → liquid)'], ['water freezing', 'Freezing (liquid → solid)'], ['dry ice turning into fog', 'Sublimation (solid → gas)'], ['frost forming on a window', 'Deposition (gas → solid)']];
  G.sciState = function () {
    var s = pk(STATES);
    return mc('Which phase change is <b>' + s[0] + '</b>?', s[1], STATES.filter(function (x) { return x !== s; }).map(function (x) { return x[1]; }).sort(function () { return Math.random() - .5; }), 'Adding heat moves solid → liquid → gas. Removing heat goes the other way. Skipping the liquid is sublimation (up) or deposition (down).');
  };
  var PLANETS = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  G.sciPlanet = function () {
    var i = r(0, 7), k = r(0, 1);
    if (k === 0) return calc('Counting out from the Sun, what number planet is <b>' + PLANETS[i] + '</b>?', i + 1, 'Order: ' + PLANETS.join(', ') + '. "My Very Educated Mother Just Served Us Nachos."');
    var j = r(0, 7); while (j === i) j = r(0, 7);
    var closer = i < j ? PLANETS[i] : PLANETS[j];
    return mc('Which is closer to the Sun?', closer, [i < j ? PLANETS[j] : PLANETS[i]], 'Order from the Sun: ' + PLANETS.join(', ') + '.');
  };
  G.sciDensity = function () {
    var d = pk([0.5, 0.8, 1, 2, 2.7, 7.9, 11.3]), v = r(2, 20), m = +(d * v).toFixed(1);
    return calc('An object has mass <b>' + m + ' g</b> and volume <b>' + v + ' cm³</b>. What is its density (g/cm³)? Will it float in water (density 1)?', d, 'Density = mass ÷ volume = ' + m + ' ÷ ' + v + ' = ' + d + ' g/cm³. ' + (d < 1 ? 'Less than 1, so it floats.' : d === 1 ? 'Exactly 1, so it hovers.' : 'More than 1, so it sinks.'), 0.05);
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'K-12 refresh',
    id: 'science',
    name: 'Science',
    mark: '🔬',
    color: '#5cc4a8',
    stat: 'mind',
    blurb: 'Bio, chem, physics, earth & space.',
    intro: "How the world actually works, from cells to stars. Every unit connects back to stuff you care about: your body (training, smoking, recovery), electricity (the FE exam and your homelab), and how to tell real science from nonsense. Based on the free OpenStax textbooks (Biology, Chemistry, Physics, Astronomy; CC BY 4.0).",
    placement: [
      { t: 'mcq', q: 'The basic unit of all living things is the:', opts: ['atom', 'cell', 'organ', 'molecule'], a: 1, why: 'Cells. Every living thing is made of one or more. Biology is Unit 2.' },
      { t: 'mcq', q: 'Water is made of:', opts: ['hydrogen and oxygen', 'carbon and oxygen', 'only oxygen', 'nitrogen and hydrogen'], a: 0, why: 'H₂O: two hydrogens, one oxygen. Chemistry is Unit 3.' },
      { t: 'tf', q: 'A heavier object always falls faster than a lighter one (ignoring air).', a: false, why: 'Without air resistance, everything falls at the same rate. Galileo showed this; astronauts proved it on the Moon with a hammer and a feather. Physics is Unit 4.' },
      { t: 'mcq', q: 'Earthquakes are mostly caused by:', opts: ['the Moon', 'moving tectonic plates', 'weather', 'volcanoes only'], a: 1, why: 'Earth\'s crust is broken into plates that grind past each other. Earth science is Unit 5.' },
      { t: 'mcq', q: 'A hypothesis is:', opts: ['a proven fact', 'a testable prediction', 'a random guess', 'a law of nature'], a: 1, why: 'A testable, falsifiable prediction. How science works is Unit 1.' }
    ],
    units: [
      {
        name: 'Unit 1 · How science works',
        blurb: 'The method, and how to tell good evidence from junk.',
        lessons: [
          {
            id: 'sc-method', title: 'The scientific method', min: 7, teaser: 'Science is a way of not fooling yourself.',
            links: ['e-main', 'm-stats', 'sc-cells'],
            cards: [
              { t: 'read', h: 'The loop', body: '<ol><li><b>Observe</b> something. ("I sleep worse on days I drink coffee late.")</li><li><b>Hypothesis</b>: a testable prediction. ("Caffeine after 2pm reduces my sleep.")</li><li><b>Experiment</b>: change one thing, keep everything else the same.</li><li><b>Analyze</b> the data.</li><li><b>Conclude</b>, then share it so others can try to break it.</li></ol>', mem: 'Observe → hypothesize → test → analyze → conclude → repeat.' },
              { t: 'read', h: 'Variables and controls', body: '<ul><li><b>Independent variable</b>: the one thing you change on purpose (coffee time).</li><li><b>Dependent variable</b>: what you measure (hours of sleep).</li><li><b>Controlled variables</b>: everything you keep the same (bedtime, room, workouts).</li><li><b>Control group</b>: a group that doesn\'t get the change, for comparison.</li></ul><p>Change two things at once and you can\'t tell which one caused the result.</p>' },
              { t: 'read', h: 'Theory isn\'t a guess', body: '<p>In everyday talk, "theory" means a hunch. In science, a <b>theory</b> is a well-tested explanation backed by tons of evidence (germ theory, evolution, plate tectonics). A <b>law</b> describes <i>what</i> happens, often as an equation (Newton\'s laws). A theory explains <i>why</i>.</p><p>And <b>correlation is not causation</b>: ice cream sales and drownings rise together, but ice cream doesn\'t cause drowning. Summer causes both.</p>', mem: 'Correlation ≠ causation. Look for the hidden third factor.' },
              { t: 'mcq', q: 'You test whether creatine improves your bench press. What is the dependent variable?', opts: ['Taking creatine or not', 'Your bench press weight', 'The gym you use', 'Your sleep'], a: 1, why: 'The dependent variable is what you measure. Creatine is the independent variable (what you change). Gym and sleep should be controlled.' },
              { t: 'tf', q: 'Cities with more churches have more crime, so churches cause crime.', a: false, why: 'Correlation, not causation. Bigger cities have more of both. Population is the hidden third factor.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Biology: life',
        blurb: 'Cells, DNA, evolution and your own body.',
        lessons: [
          {
            id: 'sc-cells', title: 'Cells: the units of life', min: 8, teaser: 'Tiny factories with power plants inside.',
            links: ['sc-dna', 'sc-body'],
            cards: [
              { t: 'read', h: 'Everything alive is cells', body: '<p><b>Cell theory</b>: all living things are made of cells, the cell is the basic unit of life, and all cells come from other cells. You\'re made of about 30 trillion of them.</p><p>Two big kinds:</p><ul><li><b>Prokaryotes</b> (bacteria): simple, tiny, no nucleus.</li><li><b>Eukaryotes</b> (plants, animals, fungi, you): bigger, with a <b>nucleus</b> holding the DNA and specialized parts called <b>organelles</b>.</li></ul>' },
              { t: 'read', h: 'The parts (the organelles)', body: '<ul><li><b>Nucleus</b>: the control center, stores DNA.</li><li><b>Mitochondria</b>: the power plants. They turn food + oxygen into ATP, the cell\'s energy currency. Muscle cells are packed with them, and endurance training makes you grow more.</li><li><b>Ribosomes</b>: build proteins from DNA instructions.</li><li><b>Cell membrane</b>: the border that controls what gets in and out (like a firewall).</li><li>Plant cells add a rigid <b>cell wall</b> and <b>chloroplasts</b> for photosynthesis.</li></ul>', mem: 'Nucleus = control. Mitochondria = power. Membrane = firewall.' },
              { t: 'match', q: 'Match the organelle to its job.', pairs: [['Nucleus', 'Holds DNA'], ['Mitochondria', 'Makes energy (ATP)'], ['Ribosome', 'Builds proteins'], ['Cell membrane', 'Controls what enters']], why: 'A cell is like a tiny city: city hall (nucleus), power plant (mitochondria), factories (ribosomes), border control (membrane).' },
              { t: 'mcq', q: 'Which cell would you expect to have the MOST mitochondria?', opts: ['A skin cell', 'A heart muscle cell', 'A fat cell', 'A bacterium'], a: 1, why: 'Heart muscle never stops working, so it needs a huge energy supply. Bacteria don\'t have mitochondria at all.' },
              { t: 'deep', h: 'Mitochondria have their own DNA', teaser: 'They were probably once free-living bacteria.', hole: 'sc-evo', body: '<p>Mitochondria have their own small loop of DNA, separate from the nucleus, and it looks like bacterial DNA. The leading explanation (<b>endosymbiosis</b>) is that over a billion years ago, a bigger cell swallowed a bacterium and instead of digesting it, they teamed up. Every complex cell since descends from that partnership. Also: you inherit mitochondrial DNA only from your mother, which lets scientists trace maternal ancestry back tens of thousands of years.</p>' }
            ]
          },
          {
            id: 'sc-dna', title: 'DNA & genetics', min: 8, teaser: 'The code, and why you look like your family.',
            links: ['sc-cells', 'sc-evo', 'cs-what-is-bit'],
            cards: [
              { t: 'read', h: 'DNA is code', body: '<p><b>DNA</b> is a long molecule shaped like a twisted ladder (a <b>double helix</b>). Each rung is a pair of "letters" (<b>bases</b>): A pairs with T, C pairs with G.</p><p>A <b>gene</b> is a section of DNA with the instructions for one protein. Proteins do almost everything: build muscle, carry oxygen, digest food. Your full set of DNA (the <b>genome</b>) is about 3 billion letters. It\'s literally a code, like software, just with 4 symbols instead of 2.</p>', mem: 'A–T, C–G. Gene = instructions for a protein.' },
              { t: 'read', h: 'Dominant and recessive', body: '<p>You get two copies of each gene, one from each parent. Different versions of a gene are <b>alleles</b>.</p><ul><li><b>Dominant</b> (capital letter, B): shows up if you have even one copy.</li><li><b>Recessive</b> (lowercase, b): shows up only if you have two copies (bb).</li></ul><p>A <b>Punnett square</b> predicts kids\' odds: put one parent\'s alleles across the top, the other\'s down the side, and fill in the 4 boxes. Bb × Bb gives BB, Bb, Bb, bb → 3/4 show the dominant trait, 1/4 the recessive.</p>' },
              { t: 'tf', q: 'Two brown-eyed parents can have a blue-eyed child.', a: true, why: 'If both are Bb (carrying a hidden recessive b), each kid has a 1/4 chance of getting bb.' },
              { t: 'gen', g: 'sciPunnett' },
              { t: 'gen', g: 'sciPunnett' }
            ]
          },
          {
            id: 'sc-evo', title: 'Evolution by natural selection', min: 7, teaser: 'Why antibiotics stop working.',
            links: ['sc-dna', 'sc-eco'],
            cards: [
              { t: 'read', h: 'Four ingredients', body: '<ol><li><b>Variation</b>: individuals differ (thanks to DNA mutations and mixing).</li><li><b>Inheritance</b>: traits are passed to offspring.</li><li><b>Overproduction</b>: more are born than can survive.</li><li><b>Selection</b>: those with traits that fit the environment survive and reproduce more.</li></ol><p>Repeat over many generations and the population changes. That\'s <b>evolution</b>. Individuals don\'t evolve; populations do.</p>' },
              { t: 'read', h: 'Watching it happen', body: '<p><b>Antibiotic resistance</b> is evolution in real time. Take antibiotics, and they kill most bacteria, but a few with a lucky mutation survive. They multiply. Now the infection is resistant. That\'s why doctors tell you to finish the whole prescription.</p><p>Same logic in security: antivirus kills known malware, attackers mutate their code, and the variants that slip past spread. Defenders and attackers co-evolve.</p>', mem: 'Selection keeps whatever survives. Antibiotics "select" for resistant bacteria.' },
              { t: 'mcq', q: 'Why does stopping antibiotics early help create resistant bacteria?', opts: ['The bacteria learn', 'The toughest survivors are left alive to multiply', 'Antibiotics make bacteria stronger', 'It doesn\'t matter'], a: 1, why: 'The weakest die first. Stopping early leaves the hardiest ones alive, and their resistant traits get passed on.' },
              { t: 'tf', q: 'A giraffe stretching its neck makes its babies have longer necks.', a: false, why: 'That was Lamarck\'s idea, and it\'s wrong. Traits you develop during life aren\'t passed on in DNA. Giraffes with naturally longer necks reached more food and had more babies.' }
            ]
          },
          {
            id: 'sc-body', title: 'Your body: systems & training', min: 8, teaser: 'What actually happens when you work out (or smoke).',
            links: ['sc-cells', 'mma-ranges'],
            cards: [
              { t: 'read', h: 'Organ systems', body: '<ul><li><b>Circulatory</b>: heart + blood vessels. Moves oxygen and nutrients.</li><li><b>Respiratory</b>: lungs. Oxygen in, carbon dioxide out, through millions of tiny sacs called <b>alveoli</b>.</li><li><b>Muscular & skeletal</b>: movement and support.</li><li><b>Nervous</b>: brain, spinal cord, nerves. The control network.</li><li><b>Digestive</b>: breaks food into usable fuel.</li><li><b>Endocrine</b>: hormones (adrenaline, testosterone, cortisol).</li></ul>' },
              { t: 'read', h: 'What training does', body: '<p>Lifting causes tiny tears in muscle fibers. During rest (especially sleep), your body repairs them thicker: that\'s <b>hypertrophy</b>. So the growth happens during recovery, not the workout. Protein supplies the building blocks.</p><p>Cardio makes your heart pump more blood per beat and grows more mitochondria and capillaries in muscle. That\'s why your resting heart rate drops as you get fitter.</p>' },
              { t: 'read', h: 'What smoking does', body: '<p>Smoke coats and damages the alveoli and the cilia (tiny hairs that sweep junk out of your lungs). Carbon monoxide in smoke grabs onto red blood cells about 200 times more tightly than oxygen, so less oxygen gets delivered. That\'s the gassed feeling in round two.</p><p>The good news: lung function and circulation start improving within weeks of quitting, and cilia regrow over months. And THC smoke still damages airways like tobacco smoke does, even if the long-term effects differ.</p>' },
              { t: 'mcq', q: 'When does muscle actually grow?', opts: ['During the workout', 'During recovery and sleep', 'Only when you\'re sore', 'When you drink a shake'], a: 1, why: 'Training is the signal; recovery is when the repair and growth happens. Skipping sleep skips the gains.' },
              { t: 'mcq', q: 'Why does smoking hurt cardio specifically?', opts: ['It makes muscles smaller', 'Carbon monoxide takes oxygen\'s seat on red blood cells and alveoli get damaged', 'It speeds up digestion', 'It doesn\'t'], a: 1, why: 'Less oxygen delivered + less lung surface to absorb it = gassing out faster.' }
            ]
          },
          {
            id: 'sc-eco', title: 'Ecosystems & energy flow', min: 6, teaser: 'Food chains, and why the bayou matters.',
            links: ['sc-evo', 'sc-earth'],
            cards: [
              { t: 'read', h: 'Who eats who', body: '<ul><li><b>Producers</b> (plants, algae) make food from sunlight by <b>photosynthesis</b>.</li><li><b>Consumers</b> eat other things: herbivores (plants), carnivores (meat), omnivores (both).</li><li><b>Decomposers</b> (fungi, bacteria) break down dead stuff and recycle nutrients.</li></ul><p>Only about <b>10%</b> of the energy at each level passes up to the next. That\'s why there are tons of plants, fewer deer, and very few gators.</p>', mem: 'Sun → producers → consumers → decomposers. ~10% passes up each level.' },
              { t: 'read', h: 'Louisiana\'s wetlands', body: '<p>Louisiana\'s coastal wetlands are one of the most productive ecosystems in North America: shrimp, crawfish, oysters, migrating birds. They also absorb hurricane storm surge, acting like a sponge. Louisiana has lost about 2,000 square miles of coastal land since the 1930s, from levees cutting off river sediment, canals for oil and gas, and sea level rise. Fewer wetlands means stronger surge hitting towns.</p>' },
              { t: 'mcq', q: 'In a food chain, what are plants?', opts: ['Consumers', 'Producers', 'Decomposers', 'Predators'], a: 1, why: 'Plants produce their own food from sunlight. Everything else ultimately depends on them.' },
              { t: 'tf', q: 'Most of the energy at one level of a food chain is passed to the next.', a: false, why: 'Only about 10% passes up. The rest is used for living (movement, heat). That\'s why top predators are rare.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Chemistry: matter',
        blurb: 'Atoms, the periodic table, states of matter and reactions.',
        lessons: [
          {
            id: 'sc-atoms', title: 'Atoms & the periodic table', min: 8, teaser: 'Everything is built from about 118 Lego pieces.',
            links: ['sc-react', 'sc-elec'],
            cards: [
              { t: 'read', h: 'Inside an atom', body: '<p>Everything is made of <b>atoms</b>. Each atom has:</p><ul><li><b>Protons</b> (positive) and <b>neutrons</b> (neutral) packed in the center, the <b>nucleus</b>.</li><li><b>Electrons</b> (negative) zipping around it in shells.</li></ul><p>The number of protons decides which <b>element</b> it is. 1 proton = hydrogen, 6 = carbon, 8 = oxygen, 79 = gold. That count is the <b>atomic number</b>.</p>', mem: 'Protons decide the element. Atomic number = protons.' },
              { t: 'read', h: 'Reading the periodic table', body: '<p>The table lists all ~118 elements in order of atomic number.</p><ul><li><b>Rows (periods)</b>: each row adds an electron shell.</li><li><b>Columns (groups)</b>: elements in a column act alike because they have the same number of outer electrons.</li><li>Left side: <b>metals</b> (shiny, conduct electricity). Right side: <b>nonmetals</b>. Far right column: <b>noble gases</b>, which barely react (helium, neon).</li></ul><p>Silicon (14) sits on the metal/nonmetal border. It\'s a <b>semiconductor</b>, which is why every computer chip is made of it.</p>' },
              { t: 'read', h: 'Molecules and bonds', body: '<p>Atoms bond to get stable outer shells. They either <b>share</b> electrons (<b>covalent</b>: H₂O, CO₂) or <b>transfer</b> them (<b>ionic</b>: table salt, NaCl, where sodium gives an electron to chlorine).</p><p>A chemical formula counts atoms: H₂O = 2 hydrogen + 1 oxygen. CO₂ = 1 carbon + 2 oxygen.</p>' },
              { t: 'gen', g: 'sciElem' },
              { t: 'gen', g: 'sciElem' },
              { t: 'gen', g: 'sciElem' }
            ]
          },
          {
            id: 'sc-react', title: 'States of matter & reactions', min: 7, teaser: 'Melting, boiling, burning and rust.',
            links: ['sc-atoms', 'sc-energy'],
            cards: [
              { t: 'read', h: 'Solid, liquid, gas', body: '<p>Same molecules, different energy. In a <b>solid</b>, molecules are locked in place, vibrating. Add heat and they slide past each other: <b>liquid</b>. More heat and they fly apart: <b>gas</b>.</p><p>Changing state is a <b>physical change</b>: ice and steam are still H₂O.</p>' },
              { t: 'read', h: 'Chemical changes', body: '<p>A <b>chemical reaction</b> rearranges atoms into new substances. Signs: new color, gas bubbles, heat or light, a new solid forming. Burning, rusting, cooking an egg, digesting food.</p><p>Atoms are never created or destroyed in a reaction, only rearranged (<b>conservation of mass</b>). That\'s why equations must <b>balance</b>: 2H₂ + O₂ → 2H₂O has 4 H and 2 O on each side.</p><p><b>pH</b> measures acidity: 0–6 acidic (lemon, stomach acid), 7 neutral (water), 8–14 basic (soap, bleach).</p>', mem: 'Physical change = same stuff, new form. Chemical change = new stuff.' },
              { t: 'gen', g: 'sciState' },
              { t: 'gen', g: 'sciDensity' },
              { t: 'mcq', q: 'Which is a CHEMICAL change?', opts: ['Ice melting', 'Cutting paper', 'Iron rusting', 'Dissolving sugar'], a: 2, why: 'Rust (iron oxide) is a new substance formed by iron reacting with oxygen. The others are physical changes.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · Physics: motion & energy',
        blurb: 'Newton, energy and electricity. Direct groundwork for the FE exam.',
        tag: 'FE groundwork',
        lessons: [
          {
            id: 'sc-forces', title: 'Motion & Newton\'s laws', min: 8, teaser: 'Why a jab works and why seatbelts exist.',
            links: ['m-eq1', 'sc-energy', 'mma-ranges'],
            cards: [
              { t: 'read', h: 'Speed, velocity, acceleration', body: '<ul><li><b>Speed</b> = distance ÷ time (60 km/h).</li><li><b>Velocity</b> = speed plus direction (60 km/h north).</li><li><b>Acceleration</b> = how fast velocity changes, in m/s² ("meters per second, per second").</li></ul>' },
              { t: 'read', h: 'Newton\'s three laws', body: '<ol><li><b>Inertia</b>: things keep doing what they\'re doing unless a force acts on them. In a crash, the car stops but you keep moving. Hence seatbelts.</li><li><b>F = ma</b>: force = mass × acceleration. A heavier object needs more force to speed up the same amount. Measured in <b>newtons (N)</b>.</li><li><b>Action–reaction</b>: every force has an equal and opposite force. When you punch the bag, the bag pushes back on your fist just as hard. That\'s why wrist alignment matters.</li></ol>', mem: '1: inertia. 2: F = ma. 3: equal and opposite.' },
              { t: 'gen', g: 'sciFma' },
              { t: 'gen', g: 'sciFma' },
              { t: 'gen', g: 'sciSpeed' }
            ]
          },
          {
            id: 'sc-energy', title: 'Energy & work', min: 7, teaser: 'It can\'t be created or destroyed, only moved.',
            links: ['sc-forces', 'sc-elec'],
            cards: [
              { t: 'read', h: 'Kinds of energy', body: '<ul><li><b>Kinetic</b>: energy of motion. KE = ½mv². Double the speed, and you get <i>four</i> times the energy. That\'s why a fast punch beats a heavy slow one.</li><li><b>Potential</b>: stored energy. A raised weight (gravitational, PE = mgh), a stretched band, a battery (chemical).</li><li><b>Thermal</b>, electrical, light, sound, nuclear.</li></ul>' },
              { t: 'read', h: 'Conservation of energy', body: '<p>Energy is never created or destroyed, only converted. A falling weight turns potential into kinetic energy. A power plant turns chemical (coal/gas) or nuclear energy into heat, then motion, then electricity. Every step loses some as heat, which is why nothing is 100% <b>efficient</b>.</p><p><b>Work</b> = force × distance (joules). <b>Power</b> = work ÷ time (watts). A 1,000 W microwave uses 1,000 joules every second.</p>', mem: 'KE = ½mv² (speed counts double). Energy only changes form.' },
              { t: 'mcq', q: 'If you double your punch speed, the kinetic energy becomes:', opts: ['the same', '2× as much', '4× as much', '½ as much'], a: 2, why: 'KE = ½mv². Speed is squared, so 2× speed → 2² = 4× energy.' },
              { t: 'mcq', q: 'A ball rolls down a hill. What energy change happens?', opts: ['Kinetic → potential', 'Potential → kinetic', 'Chemical → nuclear', 'Nothing changes'], a: 1, why: 'Height (potential) turns into motion (kinetic) as it rolls down.' }
            ]
          },
          {
            id: 'sc-elec', title: 'Electricity & circuits', min: 9, teaser: 'Voltage, current, resistance. FE and homelab core.',
            links: ['sc-energy', 'cs-logic', 'sc-atoms'],
            cards: [
              { t: 'read', h: 'The water pipe picture', body: '<p>Picture water in a pipe:</p><ul><li><b>Voltage (V)</b>, in volts, is the <i>pressure</i> pushing the water.</li><li><b>Current (I)</b>, in amps, is <i>how much</i> water flows per second.</li><li><b>Resistance (R)</b>, in ohms (Ω), is how <i>narrow</i> the pipe is.</li></ul><p><b>Ohm\'s law</b> ties them together: <b>V = I × R</b>. More pressure → more flow. Narrower pipe → less flow.</p>', mem: 'V = IR. Voltage = push, current = flow, resistance = squeeze.' },
              { t: 'read', h: 'Series vs parallel', body: '<ul><li><b>Series</b>: one path. Current goes through every part in a row. Resistances add up: R = R₁ + R₂. If one bulb dies, they all go out (old Christmas lights).</li><li><b>Parallel</b>: several paths. Each branch gets the full voltage. If one breaks, the others keep working. Your house outlets are wired in parallel.</li></ul><p><b>Power</b> = V × I (watts). A homelab server pulling 2 A from a 120 V outlet uses 240 W.</p>' },
              { t: 'read', h: 'AC vs DC', body: '<p><b>DC</b> (direct current) flows one direction: batteries, USB, and everything inside your computer. <b>AC</b> (alternating current) flips direction 60 times per second in the US: your wall outlet. Your PC\'s power supply converts AC to DC. AC won for the power grid because transformers can easily step its voltage up for long-distance transmission and back down for homes.</p>' },
              { t: 'gen', g: 'sciOhm' },
              { t: 'gen', g: 'sciOhm' },
              { t: 'gen', g: 'sciOhm' },
              { t: 'deep', h: 'From circuits to computers', teaser: 'Transistors are switches, switches make logic.', hole: 'cs-logic', body: '<p>A <b>transistor</b> is a tiny electrical switch with no moving parts, made of silicon. Voltage on one pin decides whether current flows through the other two: on/off, 1/0. Wire a few together and you get logic gates (AND, OR, NOT). Wire billions together and you get a CPU. A modern chip has tens of billions of transistors. The FE Electrical & Computer exam covers both sides of this bridge: circuits and digital logic.</p>' }
            ]
          }
        ]
      },
      {
        name: 'Unit 5 · Earth & space',
        blurb: 'The planet under you, the weather over you, and everything beyond.',
        lessons: [
          {
            id: 'sc-earth', title: 'Plate tectonics, weather & climate', min: 8, teaser: 'Why the ground shakes and hurricanes love the Gulf.',
            links: ['sc-eco', 'w-continents', 'sc-space'],
            cards: [
              { t: 'read', h: 'A cracked shell', body: '<p>Earth has layers: a thin rocky <b>crust</b>, a hot slow-moving <b>mantle</b>, and a metal <b>core</b>. The crust is broken into giant <b>tectonic plates</b> that drift a few centimeters a year (about how fast fingernails grow).</p><p>Where plates collide you get mountains (the Himalayas). Where they slide past each other, earthquakes (San Andreas). Where they pull apart, new crust forms. 200 million years ago all the continents were one supercontinent, <b>Pangaea</b>.</p>' },
              { t: 'read', h: 'Weather vs climate', body: '<p><b>Weather</b> is what\'s happening today. <b>Climate</b> is the long-term average over decades. "Climate is what you expect, weather is what you get."</p><p>Hurricanes form over warm ocean water (above ~80°F / 26°C). The Gulf of Mexico is warm, so Louisiana gets them. Warmer oceans give storms more fuel.</p><p>The <b>greenhouse effect</b>: gases like CO₂ trap heat in the atmosphere. Some is natural and keeps Earth livable. Burning fossil fuels adds more CO₂, trapping more heat. That\'s the core of climate change.</p>', mem: 'Weather = today. Climate = the decades-long average.' },
              { t: 'mcq', q: 'Why do hurricanes often hit Louisiana?', opts: ['It\'s close to the equator', 'The Gulf of Mexico has warm water that fuels them', 'Mountains attract them', 'Random luck'], a: 1, why: 'Hurricanes need warm ocean water as fuel. The Gulf is very warm in late summer, which is peak season (August–October).' },
              { t: 'tf', q: 'One cold winter disproves climate change.', a: false, why: 'One season is weather. Climate is the trend over decades. The global average temperature has clearly risen since the late 1800s.' }
            ]
          },
          {
            id: 'sc-space', title: 'The solar system & beyond', min: 7, teaser: 'Eight planets, one star, and a very big universe.',
            links: ['sc-earth', 'sc-forces'],
            cards: [
              { t: 'read', h: 'Our neighborhood', body: '<p>The <b>Sun</b> is a star, a giant ball of hydrogen fusing into helium. Around it: 4 small rocky planets (<b>Mercury, Venus, Earth, Mars</b>), the asteroid belt, then 4 giants (<b>Jupiter, Saturn</b> are gas; <b>Uranus, Neptune</b> are ice giants). Pluto was reclassified as a dwarf planet in 2006.</p><p>"My Very Educated Mother Just Served Us Nachos."</p>' },
              { t: 'read', h: 'Why seasons happen', body: '<p>Earth is tilted about 23.5°. It\'s NOT about distance from the Sun (we\'re actually closest in January). When your half of the Earth tilts toward the Sun, sunlight hits more directly and days are longer: summer. That\'s why Australia has summer in December.</p><p>Light from the Sun takes about 8 minutes to reach us. Our galaxy, the Milky Way, has 100 to 400 billion stars, and there are billions of galaxies.</p>' },
              { t: 'gen', g: 'sciPlanet' },
              { t: 'gen', g: 'sciPlanet' },
              { t: 'tf', q: 'It\'s summer because Earth is closer to the Sun.', a: false, why: 'It\'s the tilt. The Northern Hemisphere is in summer when it tilts toward the Sun, even though Earth is slightly farther away then.' }
            ]
          }
        ]
      }
    ]
  });
})();
