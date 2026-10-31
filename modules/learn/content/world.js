/* Geography, maps & how the world is run. Built for "I feel like I know nothing" —
   framed as refreshing, never remedial. Opens with an optional 5-question placement check. */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'K-12 refresh',
    id: 'world',
    name: 'The World',
    mark: '🌍',
    color: '#63a6e6',
    stat: 'mind',
    blurb: 'Maps, countries & how things are run.',
    intro: "Start with the shape of the world, then fill it in: where things are, how to read any map, and how countries actually work. A quick check first finds where you already are — it's not a test, and nothing here is graded.",
    placement: [
      { t: 'mcq', q: 'Which of these is a continent?', opts: ['Brazil', 'Africa', 'the Pacific', 'the Amazon'], a: 1, why: 'Africa is a continent. Brazil is a country, the Pacific is an ocean, the Amazon is a river/rainforest. We\'ll map all seven continents.' },
      { t: 'mcq', q: 'Roughly how many countries are there in the world today?', opts: ['About 50', 'About 100', 'About 195', 'About 500'], a: 2, why: 'Around 195 (193 UN members plus a couple of observers). Don\'t worry about memorizing them — we\'ll go region by region.' },
      { t: 'tf', q: 'On a standard world map, north is at the top and east is to the right.', a: true, why: 'Standard orientation: north up, south down, east right, west left. "Never Eat Soggy Waffles" — N, E, S, W going clockwise.' },
      { t: 'mcq', q: 'The capital of the United States is:', opts: ['New York', 'Los Angeles', 'Washington, D.C.', 'Chicago'], a: 2, why: 'Washington, D.C. — the capital isn\'t always the biggest city, which trips a lot of people up.' },
      { t: 'tf', q: 'In a democracy, government power ultimately comes from the people (usually through voting).', a: true, why: '"Demos" = people, "kratos" = power. We\'ll unpack how that actually works in the civics unit.' }
    ],
    units: [
      {
        name: 'The shape of the world',
        blurb: 'Seven continents, five oceans, and the lines we draw on the globe. This is the frame everything hangs on.',
        lessons: [
          {
            id: 'w-continents', title: 'The seven continents', min: 6, teaser: 'The whole world, at the biggest zoom level.',
            links: ['w-mapskills', 'w-oceans', 'w-regions'],
            cards: [
              { t: 'read', h: 'Start from the top', body: '<p>Before countries, learn the seven big landmasses. From biggest to smallest:</p><ol><li><b>Asia</b> — by far the largest, most people (China, India, Japan, much of Russia).</li><li><b>Africa</b> — second largest, 54 countries.</li><li><b>North America</b> — Canada, US, Mexico, Central America.</li><li><b>South America</b> — Brazil, Argentina, and the Andes.</li><li><b>Antarctica</b> — the frozen south, no permanent residents.</li><li><b>Europe</b> — small but packed with countries.</li><li><b>Australia / Oceania</b> — the island continent plus the Pacific islands.</li></ol>', mem: 'Asia and Africa are the two giants. Europe is small but crowded with countries.' },
              { t: 'order', q: 'Order these continents from LARGEST to smallest by land area.', items: ['Asia', 'Africa', 'North America', 'South America', 'Antarctica', 'Europe', 'Australia'], why: 'Asia is the giant, then Africa. Australia is the smallest continent (but still way bigger than any single European country). Getting the rough sizes down makes maps instantly easier to read.' },
              { t: 'mcq', q: 'Which continent has the most people by far?', opts: ['Africa', 'Europe', 'Asia', 'North America'], a: 2, why: 'Asia — over half of all humans live there, mostly in and around China and India.' },
              { t: 'match', q: 'Match the country to its continent.', pairs: [['Brazil', 'South America'], ['Egypt', 'Africa'], ['Japan', 'Asia'], ['France', 'Europe']], why: 'Anchoring one famous country per continent gives you a mental hook for the rest of the region.' },
              { t: 'deep', h: 'Why Europe and Asia are really one landmass', teaser: 'The "continents" are part geography, part history.', hole: 'w-regions', body: '<p>Look at a map: Europe and Asia are connected — there\'s no ocean between them. Geographically they\'re one giant landmass called <b>Eurasia</b>. We split them for historical and cultural reasons, with a fuzzy border around the Ural Mountains in Russia.</p><p>This is a useful lesson about maps in general: a lot of what\'s on them (borders, names, even which blobs count as "continents") is human decisions, not pure nature. Keep that in mind as we go — it\'s half of what politics is about.</p>' }
            ]
          },
          {
            id: 'w-oceans', title: 'Oceans & the big picture', min: 4, teaser: 'The 71% of the planet that isn\'t land.',
            links: ['w-continents', 'w-mapskills'],
            cards: [
              { t: 'read', h: 'Mostly water', body: '<p>About <b>71%</b> of Earth\'s surface is ocean. There are five:</p><ul><li><b>Pacific</b> — the biggest, between Asia and the Americas. Bigger than all the land combined.</li><li><b>Atlantic</b> — between the Americas and Europe/Africa.</li><li><b>Indian</b> — south of Asia.</li><li><b>Southern</b> — around Antarctica.</li><li><b>Arctic</b> — the frozen north, smallest.</li></ul>', mem: 'Pacific is the giant (think: it touches Asia AND the Americas). Atlantic is the one you\'d cross from the US to Europe.' },
              { t: 'mcq', q: 'You fly from New York to London. Which ocean do you cross?', opts: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], a: 1, why: 'The Atlantic sits between the Americas and Europe/Africa. The Pacific is on the other side of the US (toward Asia).' },
              { t: 'tf', q: 'The Pacific Ocean is larger than all of Earth\'s land area combined.', a: true, why: 'It really is that big — about a third of the whole planet\'s surface.' }
            ]
          },
          {
            id: 'w-mapskills', title: 'How to read any map', min: 6, teaser: 'Latitude, longitude, and never being lost on a map again.',
            links: ['w-continents', 'cs-how-internet'],
            cards: [
              { t: 'read', h: 'The grid on the globe', body: '<p>Every spot on Earth has an address made of two numbers:</p><ul><li><b>Latitude</b> — how far north or south. Runs 0° at the <b>equator</b> to 90° at the poles. Lines of latitude are horizontal (think "ladder rungs").</li><li><b>Longitude</b> — how far east or west, from 0° at the <b>Prime Meridian</b> (Greenwich, London) to 180° on the other side.</li></ul><p>Give a GPS those two numbers and it finds the exact spot. It\'s the same idea as (x, y) coordinates on a graph, wrapped around a ball.</p>', mem: 'LATitude = LADder rungs (flat, north-south). Longitude = the long lines running pole to pole (east-west).' },
              { t: 'mcq', q: 'The equator is the line of latitude at:', opts: ['90°', '0°', '180°', '45°'], a: 1, why: 'The equator is 0° latitude — the middle of the Earth, equally far from both poles. It\'s where it\'s warmest.' },
              { t: 'read', h: 'Compass & scale', body: '<p>Two more tools on almost any map:</p><ul><li><b>Compass rose</b> — shows direction. North, East, South, West, going clockwise: "Never Eat Soggy Waffles."</li><li><b>Scale bar</b> — tells you how map distance relates to real distance (e.g. 1 inch = 10 miles). Without it, you can\'t tell if a trip is a walk or a flight.</li></ul>' },
              { t: 'order', q: 'Name the compass directions clockwise starting from the top.', items: ['North', 'East', 'South', 'West'], why: 'Clockwise from the top: North, East, South, West. "Never Eat Soggy Waffles." Opposite pairs: N–S and E–W.' },
              { t: 'mcq', q: 'Why does a map need a scale bar?', opts: ['To look official', 'To show how map distance relates to real-world distance', 'To show which way is north', 'To list the capital cities'], a: 1, why: 'Scale turns "two inches on paper" into "twenty real miles." Direction is the compass; distance is the scale.' },
              { t: 'deep', h: 'Why every flat world map is "wrong"', teaser: 'You can\'t flatten a globe without lying a little.', body: '<p>Earth is a ball. Paper is flat. You literally cannot flatten a sphere without stretching something — so every flat map distorts size, shape, or distance somewhere.</p><p>The famous <b>Mercator</b> map (the one in most classrooms and Google Maps) keeps directions true, which is great for navigation, but badly inflates things near the poles. That\'s why Greenland looks as big as Africa on it — in reality Africa is <b>14 times</b> larger. When you look at a map, always ask what it\'s distorting.</p>' }
            ]
          }
        ]
      },
      {
        name: 'Regions & countries',
        tag: 'build the map',
        blurb: 'Go region by region. Anchor a few landmarks in each, and the rest fills in around them.',
        lessons: [
          {
            id: 'w-regions', title: 'Capitals that trip people up', min: 6, teaser: 'The capital is often NOT the biggest city.',
            links: ['w-continents', 'w-civics-what'],
            cards: [
              { t: 'read', h: 'Capital ≠ biggest city', body: '<p>A <b>capital</b> is where a country\'s government sits — not necessarily its largest or most famous city. This catches almost everyone:</p><ul><li>USA → <b>Washington, D.C.</b> (not New York)</li><li>Australia → <b>Canberra</b> (not Sydney)</li><li>Canada → <b>Ottawa</b> (not Toronto)</li><li>Brazil → <b>Brasília</b> (not Rio or São Paulo)</li><li>Turkey → <b>Ankara</b> (not Istanbul)</li></ul>', mem: 'When a country has one giant famous city, the capital is often a quieter, more central one chosen on purpose.' },
              { t: 'match', q: 'Match the country to its capital.', pairs: [['United States', 'Washington, D.C.'], ['Australia', 'Canberra'], ['Canada', 'Ottawa'], ['Japan', 'Tokyo']], why: 'Japan is the "easy" one (Tokyo really is both capital and biggest). The others are the classic traps.' },
              { t: 'mcq', q: 'The capital of Australia is:', opts: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], a: 2, why: 'Canberra was purpose-built as a compromise capital because Sydney and Melbourne both wanted it. Same story as Washington and Brasília.' },
              { t: 'match', q: 'Round two — Europe.', pairs: [['France', 'Paris'], ['Germany', 'Berlin'], ['Spain', 'Madrid'], ['Italy', 'Rome']], why: 'The big Western European capitals. These four you\'ll see constantly in news and history.' }
            ]
          },
          {
            id: 'w-landmarks', title: 'Anchor landmarks', min: 5, teaser: 'A handful of famous places to pin the map down.',
            links: ['w-regions', 'w-continents'],
            cards: [
              { t: 'read', h: 'Hooks for your mental map', body: '<p>You don\'t memorize a map by brute force — you pin a few vivid landmarks and fill in around them. A starter set:</p><ul><li><b>Sahara Desert</b> — across northern Africa.</li><li><b>Himalayas</b> (incl. Mt. Everest) — between India and China.</li><li><b>Amazon rainforest</b> — northern South America, mostly Brazil.</li><li><b>Nile</b> — the long river up through Egypt.</li><li><b>Great Barrier Reef</b> — off northeast Australia.</li></ul>' },
              { t: 'match', q: 'Match the landmark to its continent.', pairs: [['Sahara Desert', 'Africa'], ['Himalayas', 'Asia'], ['Amazon', 'South America'], ['Great Barrier Reef', 'Australia']], why: 'Each landmark is an anchor — once you know roughly where the Himalayas are, India and China snap into place around them.' },
              { t: 'mcq', q: 'Mount Everest, the tallest mountain on Earth, is part of which range?', opts: ['The Andes', 'The Rockies', 'The Alps', 'The Himalayas'], a: 3, why: 'The Himalayas, between Nepal/India and China/Tibet. The Andes (South America) are the longest range; the Alps are in Europe.' }
            ]
          }
        ]
      },
      {
        name: 'How things are run',
        tag: 'civics',
        blurb: 'Government and politics without the jargon. What the words actually mean and why any of it matters to you.',
        lessons: [
          {
            id: 'w-civics-what', title: 'What government even is', min: 6, teaser: 'Strip away the noise: what is a government for?',
            links: ['w-branches', 'w-democracy', 'w-regions'],
            cards: [
              { t: 'read', h: 'The basic idea', body: '<p>A <b>government</b> is the group of people and rules that run a place — making laws, enforcing them, settling disputes, and providing shared things (roads, schools, defense) that are hard to do alone.</p><p>Every government answers two questions: <b>who holds power</b>, and <b>how is it limited</b>? Almost all of politics is arguing about those two things.</p>', mem: 'Government = who makes the rules + how their power is kept in check.' },
              { t: 'read', h: 'A few forms, plain-English', body: '<ul><li><b>Democracy</b> — power comes from the people, usually via voting.</li><li><b>Republic</b> — people elect representatives to decide for them (the US is a democratic republic).</li><li><b>Monarchy</b> — a king/queen; today often just a figurehead (like the UK) with an elected government doing the real work.</li><li><b>Dictatorship / authoritarian</b> — power held by one person or small group, with little check from the people.</li></ul>', mem: 'Democracy = people decide. Republic = people pick deciders. Dictatorship = one group decides, unchecked.' },
              { t: 'match', q: 'Match the term to its one-liner.', pairs: [['Democracy', 'Power from the people'], ['Monarchy', 'A king or queen'], ['Republic', 'Elected representatives'], ['Dictatorship', 'One unchecked ruler']], why: 'Real countries often mix these — the UK is a monarchy AND a democracy, because the monarch is mostly ceremonial.' },
              { t: 'mcq', q: 'The United States is best described as a:', opts: ['Direct democracy where everyone votes on every law', 'Democratic republic — people elect representatives', 'Monarchy', 'Dictatorship'], a: 1, why: 'You don\'t vote on each law yourself; you elect representatives (Congress, president) to do it. That\'s a republic with democratic elections.' }
            ]
          },
          {
            id: 'w-branches', title: 'The three branches (US)', min: 6, teaser: 'Why power is split in three on purpose.',
            links: ['w-civics-what', 'w-democracy'],
            cards: [
              { t: 'read', h: 'Split so no one has it all', body: '<p>The US splits federal power into three <b>branches</b>, each checking the others so none becomes a tyrant:</p><ul><li><b>Legislative</b> (Congress: House + Senate) — <i>makes</i> the laws.</li><li><b>Executive</b> (President) — <i>carries out / enforces</i> the laws.</li><li><b>Judicial</b> (Supreme Court + courts) — <i>interprets</i> the laws, decides what they mean.</li></ul><p>This is <b>separation of powers</b>, and the mutual vetoes are <b>checks and balances</b>. The president can veto a law; Congress can override the veto; courts can strike a law down. Round and round.</p>', mem: 'Make it (Congress), do it (President), judge it (Courts). Each can block the others.' },
              { t: 'match', q: 'Match the branch to its job.', pairs: [['Legislative / Congress', 'Makes laws'], ['Executive / President', 'Enforces laws'], ['Judicial / Courts', 'Interprets laws']], why: 'Make, enforce, interpret. Keep those three verbs and you\'ve got the whole structure.' },
              { t: 'mcq', q: 'Congress passes a law. The President refuses to sign it and sends it back. That\'s a:', opts: ['Filibuster', 'Veto', 'Impeachment', 'Ruling'], a: 1, why: 'A veto. Congress can still override it with a two-thirds vote — that\'s checks and balances in action.' },
              { t: 'mcq', q: 'Which branch can declare a law unconstitutional?', opts: ['The President', 'Congress', 'The courts (judicial)', 'The military'], a: 2, why: 'The judicial branch — ultimately the Supreme Court — interprets the Constitution and can strike down laws that violate it.' },
              { t: 'deep', h: 'Federal vs state: two layers', teaser: 'Why "it depends on your state" is a thing.', hole: 'w-democracy', body: '<p>The US is a <b>federal</b> system: power is shared between the national (federal) government and 50 state governments. Some things are federal (national defense, currency, immigration), some are state (most schools, driving laws, many crimes), and some overlap.</p><p>That\'s why marijuana can be legal in one state and not another, or why speed limits differ when you cross a state line. Each state is almost a mini-country with its own governor, legislature, and courts — mirroring the federal three-branch structure.</p>' }
            ]
          },
          {
            id: 'w-democracy', title: 'Voting & why your vote exists', min: 5, teaser: 'How "the people decide" actually happens.',
            links: ['w-branches', 'w-civics-what'],
            cards: [
              { t: 'read', h: 'From people to decisions', body: '<p>In a representative democracy, <b>elections</b> are the machine that turns "the people" into actual decision-makers. You vote for people who then make laws and run things. If they do a bad job, you vote them out next time — that threat is what keeps them accountable.</p><p>Key terms: <b>candidate</b> (person running), <b>ballot</b> (what you fill out), <b>term</b> (how long they serve before the next election), and <b>majority</b> (more than half).</p>', mem: 'Elections are the "undo button" of democracy — the regular chance to replace people in power without violence.' },
              { t: 'mcq', q: 'What is the main reason regular elections matter, even for a politician already in power?', opts: ['Tradition', 'They make leaders accountable — do badly and voters can replace you', 'They\'re required by other countries', 'To sell ads'], a: 1, why: 'Accountability. The peaceful, scheduled chance to remove leaders is what separates a democracy from a dictatorship.' },
              { t: 'tf', q: 'In most elections, winning requires getting more votes than the other options (a plurality or majority).', a: true, why: 'Usually whoever gets the most votes wins (details vary by system — some need an outright majority, over 50%). We\'ll go deeper into voting systems and the Electoral College later.' },
              { t: 'read', h: 'Why this connects to everything', body: '<p>Once you see government as "who decides + how they\'re checked," the news stops being noise. A headline about a court ruling, a veto, a protest, or an election is just one of these gears turning. The "why is this in the news" rabbit holes (coming soon) will take real headlines and trace them back to exactly these mechanics.</p>' }
            ]
          }
        ]
      }
    ]
  });
})();
