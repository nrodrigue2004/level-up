/* K-12 History refresh: world history in big arcs, US history, and Louisiana's own story.
   Backbones: OpenStax U.S. History and World History Vols 1–2 (CC BY 4.0), rewritten in plain words.
   Timeline drills are generated from the event list, so the questions keep changing. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function yr(y) { return y < 0 ? (-y) + ' BCE' : y + ''; }

  // [year, event] — years are approximate where marked in the lessons
  var EV = [
    [-3000, 'Egyptians build early pyramids and use hieroglyphics'], [-2700, 'Writing (cuneiform) spreads in Mesopotamia'],
    [-500, 'Athens develops democracy'], [-221, 'China is unified under its first emperor'], [27 - 0, 'Rome becomes an empire under Augustus'],
    [476, 'The Western Roman Empire falls'], [622, 'Islam begins spreading from Arabia'], [1066, 'Normans conquer England'],
    [1347, 'The Black Death hits Europe'], [1440, 'Gutenberg\'s printing press'], [1492, 'Columbus reaches the Americas'],
    [1517, 'The Protestant Reformation begins'], [1607, 'Jamestown, the first lasting English colony'], [1619, 'Enslaved Africans arrive in Virginia'],
    [1682, 'La Salle claims Louisiana for France'], [1718, 'New Orleans is founded'], [1755, 'The British expel the Acadians (Le Grand Dérangement)'],
    [1776, 'The Declaration of Independence'], [1787, 'The U.S. Constitution is written'], [1789, 'The French Revolution begins'],
    [1803, 'The Louisiana Purchase'], [1812, 'Louisiana becomes a state'], [1815, 'The Battle of New Orleans'], [1861, 'The Civil War begins'],
    [1863, 'The Emancipation Proclamation'], [1865, 'The Civil War ends; the 13th Amendment abolishes slavery'], [1896, 'Plessy v. Ferguson ("separate but equal")'],
    [1903, 'The Wright brothers\' first flight'], [1914, 'World War I begins'], [1920, 'Women win the right to vote (19th Amendment)'],
    [1929, 'The stock market crash starts the Great Depression'], [1939, 'World War II begins'], [1941, 'Pearl Harbor; the U.S. enters WWII'],
    [1945, 'WWII ends; atomic bombs; the UN is founded'], [1954, 'Brown v. Board of Education'], [1957, 'Sputnik launches the space race'],
    [1964, 'The Civil Rights Act'], [1965, 'The Voting Rights Act'], [1969, 'Humans land on the Moon'], [1989, 'The Berlin Wall falls'],
    [1991, 'The Soviet Union collapses'], [1991, 'The World Wide Web goes public'], [2001, 'The September 11 attacks'], [2005, 'Hurricane Katrina'],
    [2007, 'The iPhone launches'], [2020, 'The COVID-19 pandemic']
  ];
  G.histFirst = function (o) {
    var pool = o.from != null ? EV.filter(function (e) { return e[0] >= o.from && e[0] <= (o.to || 3000); }) : EV;
    var a = pk(pool), b = pk(pool), n = 0; while ((b[0] === a[0]) && n++ < 20) b = pk(pool);
    var first = a[0] < b[0] ? a : b, second = first === a ? b : a;
    return { t: 'mcq', q: 'Which happened <b>first</b>?', opts: [first[1], second[1]], a: 0, why: first[1] + ' (' + yr(first[0]) + ') came before ' + second[1].charAt(0).toLowerCase() + second[1].slice(1) + ' (' + yr(second[0]) + '). That\'s ' + (second[0] - first[0]) + ' years apart.' };
  };
  G.histOrder = function (o) {
    var pool = o.from != null ? EV.filter(function (e) { return e[0] >= o.from && e[0] <= (o.to || 3000); }) : EV, pickd = [], yrs = {};
    shuffle(pool).forEach(function (e) { if (pickd.length < 4 && !yrs[e[0]]) { yrs[e[0]] = 1; pickd.push(e); } });
    pickd.sort(function (x, y) { return x[0] - y[0]; });
    return { t: 'order', q: 'Put these in order, earliest first.', items: pickd.map(function (e) { return e[1]; }), why: pickd.map(function (e) { return yr(e[0]) + ': ' + e[1]; }).join(' → ') };
  };
  G.histCentury = function (o) {
    var pool = (o.from != null ? EV.filter(function (e) { return e[0] >= o.from && e[0] <= (o.to || 3000); }) : EV).filter(function (e) { return e[0] > 0; });
    var e = pk(pool), c = Math.floor((e[0] - 1) / 100) + 1, sfx = function (n) { return n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'); };
    var right = sfx(c) + ' century', opts = [right, sfx(c - 1) + ' century', sfx(c + 1) + ' century', sfx(c + 2) + ' century'];
    return { t: 'mcq', q: '<b>' + e[1] + '</b> (' + e[0] + '). Which century is that?', opts: opts, a: 0, why: 'The century number is one more than the first digits: the 1800s are the 19th century, the 2000s are the 21st. ' + e[0] + ' → ' + right + '.' };
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'K-12 refresh',
    id: 'history',
    name: 'History',
    mark: '🏛️',
    color: '#c99a5b',
    stat: 'mind',
    blurb: 'World, U.S. & Louisiana. How we got here.',
    intro: "History as a story, not a list of dates: the big turning points that explain why the world looks the way it does today, plus Louisiana's own wild history. Timeline drills are generated fresh each time from 45+ events. Based on the free OpenStax U.S. History and World History textbooks (CC BY 4.0).",
    placement: [
      { t: 'mcq', q: 'The Declaration of Independence was signed in:', opts: ['1492', '1776', '1865', '1945'], a: 1, keep: true, why: '1776. The American founding is Unit 2.' },
      { t: 'mcq', q: 'The Civil War was mainly fought over:', opts: ['Taxes on tea', 'Slavery and whether states could leave the Union', 'Oil', 'Land in Mexico'], a: 1, why: 'Slavery was the central cause. Unit 3.' },
      { t: 'mcq', q: 'Which empire built roads and aqueducts across Europe 2,000 years ago?', opts: ['Roman', 'Aztec', 'British', 'Ottoman'], a: 0, why: 'Rome. The ancient world is Unit 1.' },
      { t: 'mcq', q: 'The U.S. bought the Louisiana Territory from:', opts: ['Spain', 'France', 'England', 'Mexico'], a: 1, why: 'France, under Napoleon, in 1803. Louisiana\'s story is Unit 5.' },
      { t: 'mcq', q: 'The Cold War was mainly a rivalry between:', opts: ['U.S. and the Soviet Union', 'France and England', 'China and Japan', 'U.S. and Mexico'], a: 0, why: 'U.S. vs USSR, about 1947–1991. The 20th century is Unit 4.' }
    ],
    units: [
      {
        name: 'Unit 1 · The ancient world to the Renaissance',
        blurb: '5,000 years in a few big moves: writing, empires, religions, plague, and the printing press.',
        lessons: [
          {
            id: 'h-ancient', title: 'The first civilizations', min: 8, teaser: 'Farming, writing, and the first cities.',
            links: ['h-rome', 'w-continents'],
            cards: [
              { t: 'read', h: 'Farming changed everything', body: '<p>For most of human history, people were hunter-gatherers moving with the food. Around 10,000 years ago, people started <b>farming</b> (the Agricultural Revolution). Farming meant staying put, extra food, bigger populations, and eventually <b>cities</b>.</p><p>Extra food also meant not everyone had to farm. Some people became priests, soldiers, craftspeople and rulers. That\'s the start of social classes and governments.</p>' },
              { t: 'read', h: 'River valleys and writing', body: '<p>The first civilizations grew along rivers, which gave water and rich soil:</p><ul><li><b>Mesopotamia</b> (modern Iraq), between the Tigris and Euphrates. Invented <b>cuneiform</b>, one of the first writing systems, around 3000 BCE, mostly for tracking trade and taxes. Also an early law code (Hammurabi\'s).</li><li><b>Egypt</b> on the Nile: pyramids, pharaohs, hieroglyphics.</li><li>The <b>Indus Valley</b> (Pakistan/India) and <b>China</b> along the Yellow River.</li></ul><p>BCE means "before common era," counting down to year 1. 3000 BCE is about 5,000 years ago.</p>', mem: 'Rivers → farming → cities → writing. Writing started for bookkeeping.' },
              { t: 'read', h: 'Greece: ideas that still run the world', body: '<p>Ancient <b>Greece</b> (around 500–300 BCE) gave us: <b>democracy</b> in Athens (citizens voted directly, though women and enslaved people couldn\'t), philosophy (Socrates, Plato, Aristotle), the Olympics, and early science and geometry. Much of the U.S. government\'s design borrows Greek and Roman ideas.</p>' },
              { t: 'mcq', q: 'Why did early civilizations form along rivers?', opts: ['Better views', 'Water and fertile soil for farming', 'To avoid the cold', 'Fish only'], a: 1, why: 'Farming needs water and good soil. Rivers flood and leave rich soil behind.' },
              { t: 'gen', g: 'histFirst', o: { from: -3000, to: 1500 } }
            ]
          },
          {
            id: 'h-rome', title: 'Rome, the Middle Ages & religion', min: 8, teaser: 'An empire rises and falls, and the faiths that spread.',
            links: ['h-ancient', 'h-renaissance'],
            cards: [
              { t: 'read', h: 'Rome', body: '<p>Rome started as a <b>republic</b> (elected representatives, a Senate), then became an <b>empire</b> under Augustus around 27 BCE. At its peak it ruled from Britain to Egypt, connected by roads, aqueducts and one set of laws. Latin, its language, became Spanish, French, Italian and Portuguese, and gave English most of its big words.</p><p>The Western Roman Empire fell in 476 CE: too big to defend, economic trouble, political chaos, and invasions. The eastern half (the Byzantine Empire) lasted another thousand years.</p>' },
              { t: 'read', h: 'Three big religions spread', body: '<ul><li><b>Christianity</b> started in the Roman province of Judea and became Rome\'s official religion in the 300s.</li><li><b>Islam</b> began in Arabia in the 600s with Muhammad and spread fast across the Middle East, North Africa and into Spain. The Islamic world kept Greek knowledge alive and advanced math (algebra and our numerals came through it), medicine and astronomy.</li><li><b>Buddhism</b> spread from India across Asia.</li></ul>' },
              { t: 'read', h: 'The Middle Ages and the plague', body: '<p>In Europe after Rome, the <b>Middle Ages</b> (about 500–1500) ran on <b>feudalism</b>: kings gave land to lords, lords protected peasants, peasants farmed. The Catholic Church was the most powerful institution.</p><p>The <b>Black Death</b> (1347–1351), a plague spread by fleas on rats, killed around a third of Europe. So many workers died that survivors could demand better pay, which helped break feudalism.</p>', mem: 'Rome fell 476. Middle Ages = feudalism + the Church. Plague killed ~1/3 of Europe.' },
              { t: 'mcq', q: 'Which modern languages came from Latin?', opts: ['English and German', 'Spanish, French and Italian', 'Arabic and Hebrew', 'Chinese and Japanese'], a: 1, why: 'They\'re called the Romance languages (from "Roman"). That\'s why Spanish will feel familiar once you learn Latin roots.' },
              { t: 'gen', g: 'histOrder', o: { from: -3000, to: 1520 } }
            ]
          },
          {
            id: 'h-renaissance', title: 'Renaissance, Reformation & exploration', min: 8, teaser: 'The printing press was the internet of 1450.',
            links: ['h-rome', 'h-revolution'],
            cards: [
              { t: 'read', h: 'Rebirth', body: '<p>The <b>Renaissance</b> ("rebirth," 1300s–1600s) started in Italy: a burst of art, science and rediscovered Greek and Roman ideas. Leonardo da Vinci, Michelangelo, and later Galileo, who argued Earth orbits the Sun.</p><p>Around 1440, <b>Gutenberg\'s printing press</b> made books cheap. Ideas could spread faster than authorities could control them. It\'s the closest thing in history to the invention of the internet.</p>' },
              { t: 'read', h: 'The Reformation', body: '<p>In 1517 Martin Luther, a German monk, criticized the Catholic Church (especially selling forgiveness, called indulgences). Thanks to the printing press, his ideas spread everywhere. This split Western Christianity into Catholic and <b>Protestant</b> churches and led to over a century of religious wars.</p>' },
              { t: 'read', h: 'Exploration and conquest', body: '<p>European kingdoms wanted a sea route to Asian spices and silk. In 1492 Columbus, sailing for Spain, reached the Caribbean. What followed was devastating for Native peoples: conquest, enslavement, and diseases like smallpox that killed an estimated 50–90% of Indigenous populations.</p><p>The <b>Atlantic slave trade</b> forcibly moved about 12 million Africans to the Americas over 350 years to work plantations. This shaped the Americas, including Louisiana, more than almost anything else.</p>', mem: 'Printing press 1440 → Reformation 1517. 1492 → conquest, disease, and the slave trade.' },
              { t: 'mcq', q: 'Why was the printing press so important for the Reformation?', opts: ['It printed money', 'It let Luther\'s ideas spread faster than they could be stopped', 'It was invented by Luther', 'It wasn\'t'], a: 1, why: 'Cheap printed pamphlets spread his criticism across Europe in weeks. New information tech has shaken up power ever since: think social media.' },
              { t: 'gen', g: 'histFirst', o: { from: 476, to: 1800 } }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Founding America',
        blurb: 'Colonies, revolution, and the rulebook (the Constitution) we still use.',
        lessons: [
          {
            id: 'h-revolution', title: 'Colonies & the Revolution', min: 8, teaser: 'Why 13 colonies broke from the world\'s strongest empire.',
            links: ['h-constitution', 'h-renaissance'],
            cards: [
              { t: 'read', h: 'Thirteen colonies', body: '<p>England founded <b>Jamestown</b> in Virginia in 1607. By the 1700s there were 13 British colonies along the Atlantic coast. The South ran on plantation crops (tobacco, rice, later cotton) worked by enslaved Africans; the North on small farms, trade and shipping.</p>' },
              { t: 'read', h: 'From taxes to war', body: '<p>After an expensive war against France (the French and Indian War, ended 1763), Britain taxed the colonies to pay for it: the Stamp Act, the tea tax. Colonists had no representatives in Parliament, so: "<b>No taxation without representation</b>." Protests (the Boston Tea Party, 1773) led to fighting in 1775.</p><p>On July 4, <b>1776</b>, the <b>Declaration of Independence</b>, mostly written by Thomas Jefferson, said that people have rights to "life, liberty and the pursuit of happiness" and that government gets its power from the people. (Jefferson himself enslaved over 600 people. That contradiction runs through the whole story.)</p><p>With crucial help from France, the colonies won in 1783.</p>', mem: '1776 = Declaration. Big idea: government\'s power comes from the people.' },
              { t: 'mcq', q: '"No taxation without representation" meant:', opts: ['No taxes ever', 'You can\'t tax people who have no vote in the government', 'Only rich people pay taxes', 'Taxes go to the King only'], a: 1, why: 'Colonists weren\'t against all taxes; they were against being taxed by a Parliament where they had no say.' },
              { t: 'gen', g: 'histOrder', o: { from: 1600, to: 1815 } }
            ]
          },
          {
            id: 'h-constitution', title: 'The Constitution & Bill of Rights', min: 8, teaser: 'The rulebook, and the rights you have.',
            links: ['h-revolution', 'w-civics-what', 'w-branches'],
            cards: [
              { t: 'read', h: 'Fixing a weak first try', body: '<p>The first U.S. government (the Articles of Confederation) was too weak: it couldn\'t tax or raise an army. In 1787 delegates met in Philadelphia and wrote the <b>Constitution</b>. Key ideas:</p><ul><li><b>Federalism</b>: power is split between the national government and the states.</li><li><b>Separation of powers</b>: Congress makes laws, the President carries them out, courts interpret them.</li><li><b>Checks and balances</b>: each branch can limit the others.</li></ul>' },
              { t: 'read', h: 'The Bill of Rights', body: '<p>The first 10 amendments (1791) protect individual rights. The ones you\'ll hear about most:</p><ul><li><b>1st</b>: freedom of speech, religion, press, assembly, petition.</li><li><b>2nd</b>: right to bear arms.</li><li><b>4th</b>: no unreasonable searches and seizures (police generally need a warrant). This is a big one in digital privacy cases: phones, data and location tracking.</li><li><b>5th</b>: you can\'t be forced to testify against yourself ("pleading the fifth"), and you get due process.</li><li><b>6th</b>: right to a lawyer and a speedy, public trial.</li></ul>', mem: '1st = speech. 4th = searches. 5th = don\'t have to incriminate yourself.' },
              { t: 'read', h: 'The ugly compromise', body: '<p>The Constitution protected slavery without saying the word. The <b>Three-Fifths Compromise</b> counted enslaved people as 3/5 of a person for deciding how many representatives Southern states got, giving slaveholding states extra power. It took a civil war and three amendments (13th, 14th, 15th) to start fixing that.</p>' },
              { t: 'match', q: 'Match the amendment to the right.', pairs: [['1st', 'Free speech & religion'], ['4th', 'No unreasonable searches'], ['5th', 'Don\'t have to testify against yourself'], ['13th', 'Abolished slavery']], why: 'These four come up constantly in the news and in security/privacy law.' },
              { t: 'mcq', q: 'A police officer wants to search your phone. Which amendment is most relevant?', opts: ['1st', '2nd', '4th', '19th'], a: 2, why: 'The 4th protects against unreasonable searches. In Riley v. California (2014), the Supreme Court ruled police generally need a warrant to search a phone.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · A nation divided',
        blurb: 'Slavery, Civil War, Reconstruction and the long fight that followed.',
        lessons: [
          {
            id: 'h-civilwar', title: 'Slavery & the Civil War', min: 9, teaser: 'The war that decided what the country would be.',
            links: ['h-constitution', 'h-civilrights', 'h-louisiana'],
            cards: [
              { t: 'read', h: 'The cause', body: '<p>By the 1850s the North was industrializing and had largely ended slavery. The South\'s economy depended on about 4 million enslaved people growing cotton. The big fight was whether new western territories would allow slavery.</p><p>When Abraham Lincoln, who opposed expanding slavery, was elected in 1860, eleven Southern states <b>seceded</b> (left the Union) and formed the Confederacy. Their own declarations of secession named slavery as the reason. The war began in 1861.</p>' },
              { t: 'read', h: 'The war', body: '<p>The <b>Civil War</b> (1861–1865) was the deadliest war in U.S. history: about 620,000–750,000 soldiers died. The North had more people, factories and railroads. In 1863 Lincoln\'s <b>Emancipation Proclamation</b> declared enslaved people in Confederate states free and let Black men join the Union army; about 180,000 did. The South surrendered in 1865. Days later, Lincoln was assassinated.</p><p>New Orleans was captured by the Union early, in April 1862, which cut off the Confederacy\'s biggest port.</p>' },
              { t: 'read', h: 'Reconstruction and its betrayal', body: '<p>After the war came three amendments:</p><ul><li><b>13th</b> (1865): abolished slavery.</li><li><b>14th</b> (1868): citizenship and equal protection of the law.</li><li><b>15th</b> (1870): Black men can vote.</li></ul><p>During <b>Reconstruction</b>, Black Americans voted and held office (Louisiana had a Black governor, P.B.S. Pinchback, in 1872). When federal troops left in 1877, Southern states passed <b>Jim Crow</b> laws enforcing segregation and blocking Black voters with poll taxes, literacy tests and violence. In <b>Plessy v. Ferguson</b> (1896), a case from New Orleans, the Supreme Court approved "separate but equal." That stood for nearly 60 years.</p>', mem: '13th: free. 14th: citizens + equal protection. 15th: vote. Then Jim Crow took it back.' },
              { t: 'mcq', q: 'Plessy v. Ferguson (1896) started when Homer Plessy refused to leave a whites-only train car in which city?', opts: ['Atlanta', 'New Orleans', 'Chicago', 'Richmond'], a: 1, why: 'New Orleans. The Supreme Court ruled against him, approving "separate but equal" until Brown v. Board overturned it in 1954.' },
              { t: 'gen', g: 'histOrder', o: { from: 1776, to: 1900 } }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · The 20th century',
        blurb: 'Two world wars, a depression, the Cold War, civil rights and the internet.',
        lessons: [
          {
            id: 'h-wars', title: 'World Wars & the Depression', min: 9, teaser: 'How the modern world got built out of catastrophe.',
            links: ['h-coldwar', 'h-civilwar'],
            cards: [
              { t: 'read', h: 'World War I (1914–1918)', body: '<p>European powers were tangled in alliances. When an Austrian archduke was assassinated in 1914, the alliances pulled everyone in. Machine guns and trench warfare killed about 20 million people. The U.S. joined in 1917. The harsh peace treaty that punished Germany set the stage for the next war.</p>' },
              { t: 'read', h: 'The Great Depression', body: '<p>The 1920s boomed, fueled by borrowing and stock speculation. The <b>1929 crash</b> wiped out savings; banks failed; by 1933 about 25% of Americans were unemployed. President Franklin Roosevelt\'s <b>New Deal</b> created jobs programs, Social Security, and bank deposit insurance (the FDIC). That\'s why your bank account is insured today.</p>' },
              { t: 'read', h: 'World War II (1939–1945)', body: '<p>In Germany, Adolf Hitler and the Nazis took power, blaming Jews and others for Germany\'s problems. Germany invaded Poland in 1939. Japan attacked <b>Pearl Harbor</b> on December 7, 1941, bringing the U.S. in. The Nazis murdered about 6 million Jews and millions of others in the <b>Holocaust</b>. The war killed 70–85 million people, the deadliest in history.</p><p>It ended in 1945 after Germany\'s defeat and the U.S. dropping <b>atomic bombs</b> on Hiroshima and Nagasaki. Afterward came the <b>United Nations</b>, meant to prevent another world war. Code-breaking at Bletchley Park (Alan Turing cracking the Enigma machine) helped win the war and kicked off modern computing.</p>', mem: 'WWI 1914–18. Crash 1929. WWII 1939–45. Pearl Harbor 1941.' },
              { t: 'deep', h: 'The Higgins boat: Louisiana won the war?', teaser: 'Eisenhower said a New Orleans boat-builder won WWII.', hole: 'h-louisiana', body: '<p>Andrew Higgins of New Orleans designed the <b>Higgins boat</b>, a flat-bottomed landing craft based on boats built for Louisiana swamps. It could run right up onto a beach and drop its front ramp. It carried troops onto the beaches at D-Day and across the Pacific. General Eisenhower later called Higgins "the man who won the war for us." That\'s why the National WWII Museum is in New Orleans.</p>' },
              { t: 'gen', g: 'histFirst', o: { from: 1900, to: 1950 } }
            ]
          },
          {
            id: 'h-coldwar', title: 'The Cold War & space race', min: 7, teaser: 'Two superpowers, nukes, and the birth of the internet.',
            links: ['h-wars', 'cs-how-internet'],
            cards: [
              { t: 'read', h: 'Capitalism vs communism', body: '<p>After WWII two superpowers were left: the <b>United States</b> (capitalist democracy) and the <b>Soviet Union / USSR</b> (communist one-party state). They never fought each other directly (that\'s why it was "cold"), because both had nuclear weapons. Instead: an arms race, spying, and proxy wars in Korea and Vietnam.</p><p>Germany was split in two, and the <b>Berlin Wall</b> (1961) divided the city. Its fall in 1989 symbolized the end. The USSR collapsed in 1991.</p>' },
              { t: 'read', h: 'The space race and the internet', body: '<p>In 1957 the USSR launched <b>Sputnik</b>, the first satellite. The U.S. panicked, created NASA, and poured money into science education. In 1969 Apollo 11 landed humans on the Moon.</p><p>The U.S. military also funded <b>ARPANET</b> (1969), a network designed to survive damage by routing around broken links. It became the internet. Cyber espionage today is in many ways the Cold War\'s spy game moved online.</p>', mem: 'Cold War ≈ 1947–1991. ARPANET (1969) → the internet.' },
              { t: 'mcq', q: 'Why was it called the "Cold" War?', opts: ['It was fought in winter', 'The U.S. and USSR never fought each other directly', 'It was in the Arctic', 'Nobody was hurt'], a: 1, why: 'Nuclear weapons made direct war unthinkable, so the superpowers competed through arms races, spying and proxy wars, which were very hot for the people in Korea and Vietnam.' },
              { t: 'gen', g: 'histOrder', o: { from: 1939, to: 2025 } }
            ]
          },
          {
            id: 'h-civilrights', title: 'The Civil Rights Movement', min: 8, teaser: 'How ordinary people forced the country to change.',
            links: ['h-civilwar', 'w-democracy'],
            cards: [
              { t: 'read', h: 'Breaking Jim Crow', body: '<ul><li><b>Brown v. Board of Education</b> (1954): the Supreme Court ruled school segregation unconstitutional, overturning Plessy.</li><li><b>Montgomery Bus Boycott</b> (1955–56): after Rosa Parks was arrested for not giving up her seat, Black residents boycotted the buses for over a year. Martin Luther King Jr. rose to lead it. (Baton Rouge had run a bus boycott in 1953 that served as a model.)</li><li>Sit-ins, Freedom Rides, and the 1963 March on Washington ("I Have a Dream").</li></ul><p>The strategy was <b>nonviolent protest</b>: peacefully breaking unjust laws and letting the world see the violent response on TV.</p>' },
              { t: 'read', h: 'The laws that came out of it', body: '<ul><li><b>Civil Rights Act of 1964</b>: banned discrimination based on race, color, religion, sex or national origin in jobs and public places.</li><li><b>Voting Rights Act of 1965</b>: banned literacy tests and put federal oversight on states with histories of blocking Black voters.</li></ul><p>Other movements followed the model: women\'s rights, farmworkers (César Chávez), disability rights, LGBTQ rights.</p>', mem: 'Brown 1954. Civil Rights Act 1964. Voting Rights Act 1965.' },
              { t: 'mcq', q: 'Brown v. Board of Education (1954) overturned which earlier decision?', opts: ['Roe v. Wade', 'Plessy v. Ferguson', 'Marbury v. Madison', 'Miranda v. Arizona'], a: 1, why: 'Plessy (1896) allowed "separate but equal." Brown said separate schools are inherently unequal.' },
              { t: 'gen', g: 'histFirst', o: { from: 1860, to: 1970 } }
            ]
          }
        ]
      },
      {
        name: 'Unit 5 · Louisiana\'s story',
        blurb: 'French, Spanish, African, Acadian, American. Why Louisiana is unlike anywhere else.',
        tag: 'home',
        lessons: [
          {
            id: 'h-louisiana', title: 'How Louisiana became Louisiana', min: 9, teaser: 'Parishes, Cajuns, Creoles and the Purchase.',
            links: ['h-civilwar', 'h-wars', 'sc-eco'],
            cards: [
              { t: 'read', h: 'French, then Spanish, then French again', body: '<p>Native nations (Chitimacha, Houma, Caddo, Choctaw, Tunica and others) lived here for thousands of years. In <b>1682</b> the French explorer La Salle claimed the whole Mississippi River basin for King Louis XIV and named it <b>Louisiana</b>. <b>New Orleans</b> was founded in <b>1718</b>.</p><p>France gave Louisiana to Spain in 1762, Spain gave it back in 1800, and three years later Napoleon, needing cash for war in Europe, sold it to the U.S.</p>' },
              { t: 'read', h: 'The Louisiana Purchase (1803)', body: '<p>The U.S. paid $15 million for about 828,000 square miles: roughly 3 cents an acre. It <b>doubled</b> the size of the country and became all or part of 15 states. Louisiana became a state in <b>1812</b>. Andrew Jackson\'s win at the <b>Battle of New Orleans</b> (1815) made him a national hero.</p><p>Because of its French and Spanish roots, Louisiana is the only state with <b>parishes</b> instead of counties, and its civil law is based on the Napoleonic Code, unlike the English common law of the other 49 states.</p>', mem: '1682 claimed, 1718 New Orleans, 1803 Purchase, 1812 statehood.' },
              { t: 'read', h: 'Cajuns and Creoles', body: '<p><b>Cajuns</b> descend from the <b>Acadians</b>, French settlers in what is now Nova Scotia, Canada. The British expelled them in 1755 (<i>Le Grand Dérangement</i>); thousands found their way to south Louisiana. "Acadian" → "Cajun."</p><p><b>Creole</b> has meant different things over time, but generally people born in colonial Louisiana with French, Spanish, African and Caribbean roots. Many Louisiana Creoles of color built a distinct culture, and New Orleans had one of the largest communities of free people of color in the South. From these mixes came gumbo, zydeco, jazz (born in New Orleans around 1900), and Mardi Gras traditions.</p>' },
              { t: 'read', h: 'Katrina', body: '<p>On August 29, <b>2005</b>, Hurricane Katrina hit. The federal levee system around New Orleans failed in more than 50 places and about 80% of the city flooded. Over 1,800 people died across the Gulf Coast. Investigations blamed engineering failures by the Army Corps of Engineers, and the slow government response became a national scandal. The levees were rebuilt to a much higher standard afterward. It\'s also why wetland loss (from the Science unit) is a survival issue here.</p>' },
              { t: 'mcq', q: 'Why does Louisiana have parishes instead of counties?', opts: ['A typo', 'Its French and Spanish Catholic colonial history', 'Federal law', 'It\'s the oldest state'], a: 1, why: 'Under Spanish and French colonial rule, church parishes were the local units of government, and the name stuck.' },
              { t: 'mcq', q: 'The word "Cajun" comes from:', opts: ['Acadian', 'Cajon, Spain', 'A Choctaw word', 'Canadian'], a: 0, why: 'Acadian → \'Cadien → Cajun. The Acadians were French settlers expelled from Canada by the British in 1755.' },
              { t: 'gen', g: 'histOrder', o: { from: 1680, to: 2010 } }
            ]
          }
        ]
      }
    ]
  });
})();
