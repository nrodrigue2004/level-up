/* World: interactive map drills (shell's worldmap widget: region, mode find|name|cap, n). Each region gets
   a short orientation card with memory hooks, then find / name / capital rounds. Rounds pick fresh countries each time. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'world'; })[0]; if (!S) return;
  function drills(region, label, caps) {
    var out = [
      { t: 'widget', w: 'worldmap', o: { region: region, mode: 'find', n: 10 }, h: 'Find it: tap the ' + label + ' place named', fallback: '<p>Open an atlas or Google Maps and find 10 places in ' + label + ' by name.</p>' },
      { t: 'widget', w: 'worldmap', o: { region: region, mode: 'name', n: 10 }, h: 'Name it: which one is highlighted?', fallback: '<p>Cover the labels on a map of ' + label + ' and name what you can.</p>' }
    ];
    if (caps) out.push({ t: 'widget', w: 'worldmap', o: { region: region, mode: 'cap', n: 10 }, h: 'Capitals', fallback: '<p>Quiz yourself on 10 capitals in ' + label + '.</p>' });
    return out;
  }
  var unit = {
    name: 'Map drills', tag: 'interactive',
    blurb: 'Tap-the-map practice, region by region. Each round picks new places, so it never turns into memorizing one list.',
    lessons: [
      {
        id: 'geo-us', title: 'The 50 states', min: 10, teaser: 'Find them, name them, know the capitals.',
        pre: ['w-mapskills'], links: ['w-branches', 'h-louisiana'],
        cards: [{ t: 'read', h: 'Learn it in regions', body: '<p>Don\'t learn 50 states alphabetically. Learn them in neighborhoods:</p><ul><li><b>Gulf South</b>: Texas, Louisiana, Mississippi, Alabama, Florida. Louisiana\'s "boot" points east; Baton Rouge is the capital, not New Orleans.</li><li><b>Southeast</b>: Georgia, the Carolinas, Tennessee, Kentucky, Virginia, Arkansas.</li><li><b>Northeast</b>: the small states packed along the coast from Maine to Maryland.</li><li><b>Midwest</b>: the Great Lakes states, then the plains.</li><li><b>Mountain West</b> and <b>Pacific</b>.</li></ul><p>Capitals that trip people up: Sacramento (CA), Albany (NY), Tallahassee (FL), Austin (TX), Springfield (IL), Harrisburg (PA), Frankfort (KY).</p>', mem: 'Learn by neighborhood, not alphabet.' }].concat(drills('US', 'US', true))
      },
      {
        id: 'geo-americas', title: 'North, Central & South America', min: 10, teaser: 'From Canada to Chile.',
        pre: ['w-continents'], links: ['es-sounds'],
        cards: [{ t: 'read', h: 'Orientation', body: '<ul><li><b>North America</b>: Canada, the US, Mexico, plus Central America (Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama) and the Caribbean (Cuba, Jamaica, Haiti, the Dominican Republic, Puerto Rico as a US territory).</li><li><b>South America</b>: Brazil takes up almost half the continent and speaks Portuguese; nearly everyone else speaks Spanish. The Andes run down the west side (Colombia, Ecuador, Peru, Bolivia, Chile); Argentina is the long country on the east of Chile.</li></ul><p>Capitals to know: Ottawa (not Toronto), Mexico City, Brasília (not Rio), Buenos Aires, Bogotá, Lima.</p>' }].concat(drills('NA', 'North America', true), drills('SA', 'South America', true))
      },
      {
        id: 'geo-europe', title: 'Europe', min: 10, teaser: 'Lots of countries in a small space.',
        pre: ['w-continents'], links: ['h-wars'],
        cards: [{ t: 'read', h: 'Orientation', body: '<ul><li><b>West</b>: UK, Ireland, France, Spain, Portugal, Belgium, Netherlands.</li><li><b>Center</b>: Germany, Switzerland, Austria, Poland, Czechia.</li><li><b>North</b> (Scandinavia + Nordics): Norway, Sweden, Finland, Denmark, Iceland.</li><li><b>South</b>: Italy (the boot), Greece, the Balkans.</li><li><b>East</b>: Ukraine (the largest country fully in Europe), Belarus, the Baltics (Estonia, Latvia, Lithuania), Romania; Russia spans Europe and Asia.</li></ul><p>Capitals that trip people up: Bern (Switzerland), The Hague is the seat of government but Amsterdam is the Dutch capital, Kyiv, Warsaw.</p>' }].concat(drills('EU', 'Europe', true))
      },
      {
        id: 'geo-africa', title: 'Africa', min: 10, teaser: '54 countries, the second-largest continent.',
        pre: ['w-continents'], links: ['w-landmarks'],
        cards: [{ t: 'read', h: 'Orientation', body: '<ul><li><b>North</b>: Egypt (the Nile), Libya, Tunisia, Algeria (the largest country in Africa), Morocco. Mostly Arabic-speaking; the Sahara lies south of them.</li><li><b>West</b>: Nigeria (the most populous African country), Ghana, Senegal, Côte d\'Ivoire.</li><li><b>East</b>: Ethiopia, Kenya, Tanzania, Somalia. The Great Rift Valley and Mount Kilimanjaro.</li><li><b>Central</b>: DR Congo (huge, with the Congo River).</li><li><b>South</b>: South Africa, Namibia, Botswana, Zimbabwe; Madagascar is the big island to the east.</li></ul><p>Map warning: common world maps (Mercator) shrink Africa badly. It\'s bigger than the US, China and India combined.</p>' }].concat(drills('AF', 'Africa', true))
      },
      {
        id: 'geo-asia', title: 'Asia & the Middle East', min: 10, teaser: 'The biggest continent, most of the world\'s people.',
        pre: ['w-continents'], links: ['w-regions'],
        cards: [{ t: 'read', h: 'Orientation', body: '<ul><li><b>East</b>: China, Japan, South Korea, North Korea, Mongolia, Taiwan.</li><li><b>South</b>: India, Pakistan, Bangladesh, Nepal, Sri Lanka.</li><li><b>Southeast</b>: Vietnam, Thailand, Indonesia (thousands of islands), the Philippines, Malaysia, Singapore.</li><li><b>Middle East / West Asia</b>: Saudi Arabia, Iran, Iraq, Israel, Turkey, Syria, the Gulf states.</li><li><b>Central</b>: Kazakhstan and the other "-stans."</li></ul><p>India and China each have over 1.4 billion people. Capitals that trip people up: Beijing (not Shanghai), New Delhi, Ankara (not Istanbul), Islamabad (not Karachi).</p>' }].concat(drills('AS', 'Asia', true))
      },
      {
        id: 'geo-oceania', title: 'Oceania & the whole world', min: 8, teaser: 'Australia, the Pacific, then everything at once.',
        pre: ['w-continents'], links: ['w-oceans'],
        cards: [{ t: 'read', h: 'Orientation', body: '<p><b>Oceania</b>: Australia (capital Canberra, not Sydney), New Zealand (Wellington), Papua New Guinea, Fiji, Samoa and many Pacific islands. Then the final boss: the whole world map.</p>' }].concat(drills('OC', 'Oceania', true), drills('world', 'the world', false))
      }
    ]
  };
  S.units.push(unit);
  // also drop a quick world "find" round into the continents lesson
  S.units.forEach(function (u) { u.lessons.forEach(function (l) {
    if (l.id === 'w-continents' && !l.cards.some(function (c) { return c.t === 'widget'; })) l.cards.push({ t: 'widget', w: 'worldmap', o: { region: 'world', mode: 'find', n: 5 }, h: 'Try the map', fallback: '<p>Point to each continent on a world map.</p>' });
  }); });
})();
