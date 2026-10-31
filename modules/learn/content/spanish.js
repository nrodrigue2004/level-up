/* Spanish, A1 → B1 (CEFR), Latin American usage first (ustedes, not vosotros, in practice).
   Syllabus follows the CEFR can-do levels and the Instituto Cervantes curriculum plan order, rewritten plainly.
   Lessons are original. Conjugation, number and vocab drills are generated fresh. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [right]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }

  var PRON = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ellas / ustedes'], USE = [0, 1, 2, 3, 5];
  var END = { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] };
  var PRET = { ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'], ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'] };
  var REG = [['hablar', 'to speak'], ['trabajar', 'to work'], ['estudiar', 'to study'], ['caminar', 'to walk'], ['comprar', 'to buy'], ['bailar', 'to dance'], ['cocinar', 'to cook'], ['escuchar', 'to listen'], ['necesitar', 'to need'], ['ayudar', 'to help'], ['comer', 'to eat'], ['beber', 'to drink'], ['aprender', 'to learn'], ['correr', 'to run'], ['vender', 'to sell'], ['comprender', 'to understand'], ['vivir', 'to live'], ['escribir', 'to write'], ['abrir', 'to open'], ['decidir', 'to decide'], ['recibir', 'to receive'], ['subir', 'to go up']];
  var IRR = {
    ser: ['soy', 'eres', 'es', 'somos', 'sois', 'son'], estar: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'], tener: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
    ir: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], hacer: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'], poder: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
    querer: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'], decir: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'], venir: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'], saber: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben']
  };
  var IRRP = { ser: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], ir: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], tener: ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'], hacer: ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'], estar: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'], poder: ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron'] };
  function conj(v, tense) { var stem = v.slice(0, -2), t = v.slice(-2); return (tense === 'pret' ? PRET : END)[t].map(function (e) { return stem + e; }); }

  G.esPresent = function () {
    var v = pk(REG), p = pk(USE), forms = conj(v[0]);
    return mc('Present tense: <b>' + PRON[p] + '</b> ___ (<i>' + v[0] + '</i>, ' + v[1] + ')', forms[p], forms.filter(function (_, i) { return i !== p && i !== 4; }).concat([v[0]]), 'Drop -' + v[0].slice(-2) + ', add the ending for ' + PRON[p].split(' ')[0] + ': ' + forms[p] + '. Full set: ' + forms.filter(function (_, i) { return i !== 4; }).join(', ') + '.');
  };
  G.esIrreg = function () {
    var vs = Object.keys(IRR), v = pk(vs), p = pk(USE), f = IRR[v];
    return mc('<b>' + PRON[p] + '</b> ___ (<i>' + v + '</i>)', f[p], f.filter(function (_, i) { return i !== p && i !== 4; }).concat([v.slice(0, -2) + (p === 0 ? 'o' : 'a')]), v + ': ' + f.filter(function (_, i) { return i !== 4; }).join(', ') + '. These are irregular, so they have to be memorized, but they\'re the most used verbs in the language.');
  };
  G.esPret = function () {
    var irr = Math.random() < .35, v, f, p = pk(USE);
    if (irr) { v = pk(Object.keys(IRRP)); f = IRRP[v]; } else { v = pk(REG.filter(function (x) { return x[0] !== 'leer'; }))[0]; f = conj(v, 'pret'); }
    var pres = IRR[v] || conj(v);
    return mc('Past (preterite): <b>' + PRON[p] + '</b> ___ (<i>' + v + '</i>) ayer.', f[p], f.filter(function (_, i) { return i !== p && i !== 4; }).concat([pres[p]]), 'Preterite = a completed action. ' + v + ': ' + f.filter(function (_, i) { return i !== 4; }).join(', ') + '.' + (irr ? ' (Irregular, no accents. Ser and ir share the same preterite: context tells you which.)' : ' Note the accents on yo and él forms.'));
  };
  var UNITS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  var TENS = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta', 6: 'sesenta', 7: 'setenta', 8: 'ochenta', 9: 'noventa' };
  function num(n) { if (n < 30) return UNITS[n]; if (n === 100) return 'cien'; var t = Math.floor(n / 10), u = n % 10; return TENS[t] + (u ? ' y ' + UNITS[u] : ''); }
  G.esNum = function () {
    var n = r(0, 100), w = [n + 1, n - 1, n + 10, n - 10, (n % 10) * 10 + Math.floor(n / 10)].filter(function (x) { return x >= 0 && x <= 100 && x !== n; }).map(num);
    return mc('How do you say <b>' + n + '</b>?', num(n), w, 'Pattern: 0–15 are unique words, 16–29 are single words (dieci-, veinti-), and from 31 up it\'s tens + "y" + units (treinta y dos). 100 alone is cien.');
  };
  var VOC = [['el agua', 'water'], ['la comida', 'food'], ['el pan', 'bread'], ['la casa', 'house'], ['el trabajo', 'work / job'], ['la computadora', 'computer'], ['el teléfono', 'phone'], ['la contraseña', 'password'], ['el carro', 'car'], ['la calle', 'street'], ['el dinero', 'money'], ['la semana', 'week'], ['el día', 'day'], ['la mano', 'hand'], ['el problema', 'problem'], ['la ciudad', 'city'], ['el hermano', 'brother'], ['la madre', 'mother'], ['el amigo', 'friend'], ['la escuela', 'school'], ['el libro', 'book'], ['la puerta', 'door'], ['el perro', 'dog'], ['la cocina', 'kitchen'], ['el baño', 'bathroom'], ['la cuenta', 'the check / account'], ['el pollo', 'chicken'], ['la cerveza', 'beer'], ['el jefe', 'boss'], ['la red', 'network'], ['el correo', 'email / mail'], ['la tienda', 'store'], ['el médico', 'doctor'], ['la playa', 'beach'], ['el tiempo', 'time / weather'], ['la noche', 'night'], ['la mañana', 'morning'], ['el gimnasio', 'gym'], ['la pelea', 'fight'], ['la música', 'music']];
  G.esVocab = function () {
    var w = pk(VOC), dir = Math.random() < .5;
    if (dir) return mc('What does <b>' + w[0] + '</b> mean?', w[1], VOC.map(function (x) { return x[1]; }), w[0] + ' = ' + w[1] + '.');
    return mc('How do you say <b>' + w[1] + '</b>?', w[0], VOC.map(function (x) { return x[0]; }), w[1] + ' = ' + w[0] + '. Learn every noun with its article (el/la) so you learn its gender at the same time.');
  };
  var SE = [
    ['Yo ___ de Luisiana.', 'soy', 'origin → ser'], ['Ella ___ cansada hoy.', 'está', 'temporary condition → estar'], ['Nosotros ___ en el gimnasio.', 'estamos', 'location → estar'],
    ['Mi hermano ___ ingeniero.', 'es', 'profession → ser'], ['La fiesta ___ a las nueve.', 'es', 'time of an event → ser'], ['¿Cómo ___ tú?', 'estás', 'how you\'re doing → estar'],
    ['Ellos ___ muy altos.', 'son', 'characteristic → ser'], ['La sopa ___ fría.', 'está', 'current state → estar'], ['Hoy ___ martes.', 'es', 'day/date → ser'], ['El servidor ___ apagado.', 'está', 'current state → estar']
  ];
  G.esSerEstar = function () {
    var s = pk(SE), opts = s[1][0] === 'e' && s[1] !== 'es' ? [s[1], { 'está': 'es', 'estás': 'eres', 'estamos': 'somos', 'están': 'son' }[s[1]]] : [s[1], { soy: 'estoy', es: 'está', son: 'están', eres: 'estás', somos: 'estamos' }[s[1]]];
    return mc('Fill in: <b>' + s[0] + '</b>', s[1], [opts[1]], 'Rule: ' + s[2] + '. SER for what something IS (identity, origin, job, traits, time). ESTAR for how/where it IS right now (location, feelings, conditions). Memory trick: "How you feel and where you are, that is when you use estar."');
  };
  G.esGender = function () {
    var w = pk(VOC), noun = w[0].split(' ')[1], art = w[0].split(' ')[0];
    return mc('Which article goes with <b>' + noun + '</b> (' + w[1] + ')?', art, [art === 'el' ? 'la' : 'el'], art + ' ' + noun + '. Most -o nouns are masculine and most -a nouns feminine, with famous exceptions: el día, el problema, el mapa, la mano, la foto.');
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    id: 'spanish', name: 'Spanish', mark: '🗣️', color: '#e06c5a', stat: 'mind', group: 'Languages',
    blurb: 'A1 to B1: talk, read, get around.',
    intro: 'Spanish from zero to solid conversation (CEFR A1 → B1), Latin American style. Grammar is explained in plain English, then drilled with fresh conjugations every time. Turn on audio in Learn settings to hear the words, and say every example out loud. Pair this with 10 minutes a day of listening (a podcast like Coffee Break Spanish or Dreaming Spanish, both free) and you\'ll be holding real conversations within months.',
    placement: [
      { t: 'mcq', q: '"I am tired" (right now):', opts: ['Soy cansado', 'Estoy cansado', 'Tengo cansado', 'Es cansado'], a: 1, why: 'Temporary condition → estar. A1 unit.' },
      { t: 'mcq', q: '"We speak":', opts: ['Hablo', 'Hablan', 'Hablamos', 'Hablas'], a: 2, why: 'Nosotros → -amos. A1 unit.' },
      { t: 'mcq', q: '"Ayer comí pollo" means:', opts: ['I eat chicken', 'Yesterday I ate chicken', 'I will eat chicken', 'I like chicken'], a: 1, why: 'Preterite past. A2 unit.' },
      { t: 'mcq', q: '"Me gusta la música" literally means:', opts: ['I like music', 'Music is pleasing to me', 'I play music', 'My music'], a: 1, why: 'Gustar works backward. A2 unit.' },
      { t: 'mcq', q: '"Cuando era niño, jugaba béisbol." Which tense is "jugaba"?', opts: ['Preterite', 'Imperfect', 'Future', 'Subjunctive'], a: 1, why: 'Imperfect: habitual past. B1 unit.' }
    ],
    units: [
      {
        name: 'A1 · Survival Spanish', tag: 'start here',
        blurb: 'Sounds, greetings, numbers, nouns, ser vs estar, and the present tense.',
        lessons: [
          {
            id: 'es-sounds', title: 'Pronunciation & greetings', min: 8, teaser: 'Spanish is spelled how it sounds. Learn the 5 vowels and you can read anything.',
            links: ['es-nouns'],
            cards: [
              { t: 'read', h: 'Five vowels, always the same', body: '<p><b>a</b> (ah), <b>e</b> (eh), <b>i</b> (ee), <b>o</b> (oh), <b>u</b> (oo). Short and clean, never sliding like English "oh-oo."</p><ul><li><b>h</b> is silent: hola = "ola."</li><li><b>j</b> and <b>g</b> before e/i: a throaty h. jugo, gente.</li><li><b>ll</b> and <b>y</b>: like "y" in yes (most of Latin America).</li><li><b>ñ</b>: "ny," like canyon. año.</li><li><b>rr</b>: rolled. Single <b>r</b> between vowels: a quick tap, like the tt in American "butter."</li><li><b>Stress</b>: words ending in a vowel, n or s stress the second-to-last syllable (CA-sa, HA-blan); others stress the last (ha-BLAR). An accent mark overrides it (te-LÉ-fo-no).</li></ul>', mem: 'H silent. J = h. LL = y. Ñ = ny.' },
              { t: 'read', h: 'Greetings', body: '<ul><li><b>Hola</b>: hi. <b>Buenos días</b> (morning), <b>buenas tardes</b> (afternoon), <b>buenas noches</b> (evening/night).</li><li><b>¿Cómo estás?</b> (casual) / <b>¿Cómo está usted?</b> (formal): how are you? → <b>Bien, gracias. ¿Y tú?</b></li><li><b>Me llamo Nate.</b> My name is Nate. <b>Mucho gusto.</b> Nice to meet you.</li><li><b>Por favor</b>, <b>gracias</b>, <b>de nada</b>, <b>perdón</b> / <b>disculpe</b>.</li><li><b>¿Habla inglés?</b> Do you speak English? <b>No entiendo. Más despacio, por favor.</b> I don\'t understand. Slower, please.</li></ul><p><b>Tú</b> is casual (friends, people your age); <b>usted</b> is polite (elders, customers, bosses). When unsure, use usted.</p>' },
              { t: 'mcq', q: 'How is "hola" pronounced?', opts: ['HO-la (with h)', 'OH-la (silent h)', 'JO-la', 'HOL-ah'], a: 1, why: 'H is always silent in Spanish.' },
              { t: 'mcq', q: 'Meeting your girlfriend\'s grandmother. Which is best?', opts: ['¿Cómo estás?', '¿Cómo está usted?', '¿Qué onda?', '¿Qué pasa?'], a: 1, why: 'Usted for respect with elders.' }
            ]
          },
          {
            id: 'es-nouns', title: 'Numbers, nouns & gender', min: 9, teaser: 'El, la, plurals, and counting to 100.',
            pre: ['es-sounds'], links: ['es-serestar'],
            cards: [
              { t: 'read', h: 'Gender and articles', body: '<p>Every noun is masculine or feminine. <b>el / un</b> (the / a, masculine), <b>la / una</b> (feminine). Plurals: <b>los / las</b>, and add -s after a vowel (libros) or -es after a consonant (ciudades).</p><p>Adjectives match the noun and usually come <b>after</b> it: <b>la casa blanca</b>, <b>los carros rojos</b>.</p>' },
              { t: 'read', h: 'Numbers', body: '<p>0 cero, 1 uno, 2 dos, 3 tres, 4 cuatro, 5 cinco, 6 seis, 7 siete, 8 ocho, 9 nueve, 10 diez, 11 once, 12 doce, 13 trece, 14 catorce, 15 quince, 16 dieciséis … 20 veinte, 21 veintiuno … 30 treinta, 31 treinta y uno, 40 cuarenta, 50 cincuenta, 60 sesenta, 70 setenta, 80 ochenta, 90 noventa, 100 cien.</p>' },
              { t: 'gen', g: 'esNum' }, { t: 'gen', g: 'esNum' }, { t: 'gen', g: 'esGender' }, { t: 'gen', g: 'esVocab' }, { t: 'gen', g: 'esVocab' }
            ]
          },
          {
            id: 'es-serestar', title: 'Ser vs. estar (two ways to say "to be")', min: 10, teaser: 'The #1 beginner question, settled.',
            pre: ['es-nouns'], links: ['es-present'],
            cards: [
              { t: 'read', h: 'The rule', body: '<p><b>SER</b>: what something is. Identity, origin, profession, characteristics, time and dates. <i>Soy Nate. Soy de Luisiana. Es ingeniero. Es alta. Son las tres.</i></p><p><b>ESTAR</b>: how or where something is right now. Location, feelings, temporary conditions, results. <i>Estoy en casa. Estoy cansado. La puerta está abierta.</i></p><p>Same adjective, different meaning: <b>es aburrido</b> (he\'s boring) vs <b>está aburrido</b> (he\'s bored). <b>Es listo</b> (smart) vs <b>está listo</b> (ready).</p>', mem: 'How you feel and where you are: estar.' },
              { t: 'gen', g: 'esIrreg' },
              { t: 'gen', g: 'esSerEstar' }, { t: 'gen', g: 'esSerEstar' }, { t: 'gen', g: 'esSerEstar' },
              { t: 'explain', q: 'Explain when to use ser vs estar, with one example each.', points: ['Ser: identity, origin, job, traits, time', 'Estar: location, feelings, temporary states', 'Example: Soy de Luisiana', 'Example: Estoy cansado'] }
            ]
          },
          {
            id: 'es-present', title: 'Present tense: regular & key irregular verbs', min: 12, teaser: 'Talk about what you do, every day.',
            pre: ['es-serestar'], links: ['es-questions'],
            cards: [
              { t: 'read', h: 'Regular endings', body: '<p>Drop -ar / -er / -ir and add:</p><ul><li><b>-ar</b> (hablar): hablo, hablas, habla, hablamos, hablan.</li><li><b>-er</b> (comer): como, comes, come, comemos, comen.</li><li><b>-ir</b> (vivir): vivo, vives, vive, vivimos, viven.</li></ul><p>Pronouns are often dropped since the ending already says who: <b>Hablo español</b> = I speak Spanish. (Spain also uses vosotros forms like habláis; Latin America uses ustedes for all "you all.")</p>', mem: 'yo -o, tú -as/-es, él -a/-e, nosotros -amos/-emos/-imos, ellos -an/-en.' },
              { t: 'read', h: 'Must-know irregulars', body: '<ul><li><b>tener</b> (to have): tengo, tienes, tiene, tenemos, tienen. Also ages and feelings: <i>Tengo 25 años. Tengo hambre.</i></li><li><b>ir</b> (to go): voy, vas, va, vamos, van. <b>Voy a + infinitive</b> = going to (future): <i>Voy a estudiar.</i></li><li><b>hacer</b> (to do/make): hago, haces, hace…</li><li><b>poder</b> (can): puedo, puedes, puede… <b>querer</b> (want): quiero, quieres, quiere…</li></ul>' },
              { t: 'gen', g: 'esPresent' }, { t: 'gen', g: 'esPresent' }, { t: 'gen', g: 'esPresent' }, { t: 'gen', g: 'esIrreg' }, { t: 'gen', g: 'esIrreg' }
            ]
          },
          {
            id: 'es-questions', title: 'Questions & everyday conversations', min: 10, teaser: 'Who, what, where, how much, and ordering food.',
            pre: ['es-present'], links: ['es-pret'],
            cards: [
              { t: 'read', h: 'Question words', body: '<p><b>¿Qué?</b> what · <b>¿Quién?</b> who · <b>¿Dónde?</b> where · <b>¿Cuándo?</b> when · <b>¿Por qué?</b> why (<b>porque</b> = because) · <b>¿Cómo?</b> how · <b>¿Cuánto?</b> how much · <b>¿Cuál?</b> which.</p><p>Spanish opens questions with ¿ and exclamations with ¡. Yes/no questions just rise in tone: <i>¿Hablas inglés?</i></p>' },
              { t: 'read', h: 'At a restaurant', body: '<ul><li><b>Una mesa para dos, por favor.</b></li><li><b>¿Qué me recomienda?</b> What do you recommend?</li><li><b>Quisiera</b> (I would like) <b>los tacos de pollo y una cerveza.</b></li><li><b>¿Pica?</b> Is it spicy?</li><li><b>La cuenta, por favor.</b> The check, please.</li></ul>' },
              { t: 'mcq', q: '"¿Cuánto cuesta?" means:', opts: ['Where is it?', 'How much does it cost?', 'What time is it?', 'Who is it?'], a: 1, why: 'Cuánto = how much; cuesta from costar.' },
              { t: 'mcq', q: 'Which means "because"?', opts: ['¿Por qué?', 'Porque', 'Para que', 'Por favor'], a: 1, why: 'One word, no accent = because. Two words with accent and ¿? = why.' },
              { t: 'gen', g: 'esVocab' }
            ]
          }
        ]
      },
      {
        name: 'A2 · Past, likes & routines', tag: 'build',
        blurb: 'Talk about yesterday, what you like, and your daily routine.',
        lessons: [
          {
            id: 'es-pret', title: 'The preterite: what happened', min: 12, teaser: 'Completed actions in the past.',
            pre: ['es-present'], links: ['es-gustar', 'es-imperfect'],
            cards: [
              { t: 'read', h: 'Regular preterite', body: '<ul><li><b>-ar</b> (hablar): hablé, hablaste, habló, hablamos, hablaron.</li><li><b>-er / -ir</b> (comer, vivir): comí, comiste, comió, comimos, comieron.</li></ul><p>Watch the accents: <b>hablo</b> (I speak) vs <b>habló</b> (he spoke). Nosotros forms for -ar and -ir look the same as present; context decides.</p><p>Key irregulars: <b>ser/ir</b>: fui, fuiste, fue, fuimos, fueron. <b>tener</b>: tuve… <b>hacer</b>: hice, hiciste, hizo… <b>estar</b>: estuve…</p>', mem: 'Habló (past) vs hablo (present): the accent is the tense.' },
              { t: 'gen', g: 'esPret' }, { t: 'gen', g: 'esPret' }, { t: 'gen', g: 'esPret' }, { t: 'gen', g: 'esPret' },
              { t: 'explain', q: 'Tell what you did yesterday in 3 Spanish sentences (type them), then check the points.', points: ['Used preterite forms (e.g. trabajé, comí, fui)', 'Used a time word (ayer, anoche, el lunes)', 'Accents on yo/él forms where needed', 'Said each sentence out loud'] }
            ]
          },
          {
            id: 'es-gustar', title: 'Gustar & talking about likes', min: 9, teaser: 'Why it\'s "me gusta," not "yo gusto."',
            pre: ['es-pret'], links: ['es-reflexive'],
            cards: [
              { t: 'read', h: 'It works backwards', body: '<p><b>Me gusta el café</b> literally means "coffee is pleasing to me." The thing liked is the subject, so the verb matches it: <b>me gusta</b> (one thing / an activity), <b>me gustan</b> (plural things).</p><p>Who likes it: <b>me</b> (me), <b>te</b> (you), <b>le</b> (him/her/you formal), <b>nos</b> (us), <b>les</b> (them/you all).</p><ul><li><i>Me gusta bailar.</i> I like to dance.</li><li><i>¿Te gustan los perros?</i> Do you like dogs?</li><li><i>A mi papá le gusta el béisbol.</i></li></ul><p>Same pattern: <b>encantar</b> (to love a thing), <b>interesar</b>, <b>molestar</b> (to bother), <b>doler</b> (to hurt: <i>me duele la cabeza</i>).</p>', mem: 'Gusta for one thing, gustan for plural things.' },
              { t: 'mcq', q: '"I like tacos":', opts: ['Me gusta los tacos', 'Me gustan los tacos', 'Yo gusto tacos', 'Me gusto los tacos'], a: 1, why: 'Tacos is plural, so gustan.' },
              { t: 'mcq', q: '"My knee hurts":', opts: ['Me duele la rodilla', 'Yo duelo la rodilla', 'Mi rodilla duelo', 'Me duelen la rodilla'], a: 0, why: 'Doler works like gustar; one knee → duele.' }
            ]
          },
          {
            id: 'es-reflexive', title: 'Daily routine & reflexive verbs', min: 9, teaser: 'Me levanto, me ducho, me voy.',
            pre: ['es-gustar'], links: ['es-imperfect'],
            cards: [
              { t: 'read', h: 'Reflexive verbs', body: '<p>When you do something to yourself, add the matching pronoun: <b>me, te, se, nos, se</b>.</p><p><i>Me levanto a las seis. Me ducho. Me visto. Me voy al trabajo. Me acuesto a las once.</i> (I get up, shower, get dressed, leave, go to bed.)</p><p>Common ones: levantarse, despertarse (to wake up), ducharse, vestirse, cepillarse los dientes, acostarse, sentarse, llamarse (<b>me llamo</b> = I call myself).</p>' },
              { t: 'mcq', q: '"We get up early":', opts: ['Levantamos temprano', 'Nos levantamos temprano', 'Se levantamos temprano', 'Me levantamos temprano'], a: 1, why: 'Nosotros → nos.' },
              { t: 'gen', g: 'esPresent' }
            ]
          }
        ]
      },
      {
        name: 'B1 · Real conversations', tag: 'level up',
        blurb: 'Imperfect vs preterite, future and conditional, and a first look at the subjunctive.',
        lessons: [
          {
            id: 'es-imperfect', title: 'Imperfect vs. preterite', min: 12, teaser: 'Telling stories in the past.',
            pre: ['es-pret'], links: ['es-future'],
            cards: [
              { t: 'read', h: 'Imperfect forms', body: '<ul><li><b>-ar</b>: hablaba, hablabas, hablaba, hablábamos, hablaban.</li><li><b>-er/-ir</b>: comía, comías, comía, comíamos, comían.</li><li>Only 3 irregulars: <b>ser</b> (era…), <b>ir</b> (iba…), <b>ver</b> (veía…).</li></ul>' },
              { t: 'read', h: 'Which past?', body: '<p><b>Preterite</b>: completed events, the plot. <i>Llegué, vi el carro y llamé a la policía.</i></p><p><b>Imperfect</b>: background, habits, descriptions, what was going on. <i>Era de noche, llovía, y yo caminaba a casa.</i> Also "used to": <i>Cuando era niño, jugaba béisbol.</i></p><p>Together: <i>Yo dormía cuando sonó el teléfono.</i> I was sleeping (background) when the phone rang (event).</p>', mem: 'Imperfect = the scene. Preterite = what happened.' },
              { t: 'mcq', q: '"When I was a kid, I used to live in Lafayette":', opts: ['Cuando fui niño, viví en Lafayette', 'Cuando era niño, vivía en Lafayette', 'Cuando soy niño, vivo en Lafayette', 'Cuando era niño, viví en Lafayette'], a: 1, why: 'Background age and habitual past → imperfect for both.' },
              { t: 'mcq', q: '"I was watching TV when you called":', opts: ['Miré la tele cuando llamabas', 'Miraba la tele cuando llamaste', 'Miro la tele cuando llamas', 'Miraba la tele cuando llamabas'], a: 1, why: 'Ongoing background (imperfect) interrupted by an event (preterite).' },
              { t: 'explain', q: 'Explain the difference between the preterite and imperfect with your own example.', points: ['Preterite: completed, specific events', 'Imperfect: background, habits, descriptions', 'Interruption pattern: imperfect + cuando + preterite', 'Example sentence using both'] }
            ]
          },
          {
            id: 'es-future', title: 'Future, conditional & the subjunctive (intro)', min: 12, teaser: 'Plans, "would," and wishes.',
            pre: ['es-imperfect'], links: ['es-work'],
            cards: [
              { t: 'read', h: 'Future and conditional', body: '<p>Both add endings to the whole infinitive:</p><ul><li><b>Future</b>: hablaré, hablarás, hablará, hablaremos, hablarán (I will speak).</li><li><b>Conditional</b>: hablaría, hablarías, hablaría, hablaríamos, hablarían (I would speak).</li></ul><p>Irregular stems (same for both): tener → tendr-, hacer → har-, poder → podr-, salir → saldr-, decir → dir-, querer → querr-. Day to day, <b>ir a + infinitive</b> is more common for the future.</p>' },
              { t: 'read', h: 'Subjunctive: the "not a fact" mood', body: '<p>After expressions of wishing, emotion, doubt or recommendation with a change of subject, Spanish switches mood: <i>Quiero que <b>vengas</b>.</i> (I want you to come.) <i>Espero que <b>tengas</b> un buen día.</i> <i>Es importante que <b>estudies</b>.</i></p><p>Forming the present subjunctive: take the yo form, drop -o, use the "opposite" vowel: hablar → hable, hables; comer → coma, comas; tener (tengo) → tenga.</p><p>Trigger memory aid: WEIRDO: Wishes, Emotions, Impersonal expressions, Recommendations, Doubt, Ojalá.</p>', mem: 'Que + change of subject + wish/emotion/doubt → subjunctive.' },
              { t: 'mcq', q: '"I hope you have a good day":', opts: ['Espero que tienes un buen día', 'Espero que tengas un buen día', 'Espero tener un buen día', 'Espero que tendrás un buen día'], a: 1, why: 'Hope (wish) + que + different subject → subjunctive tengas.' },
              { t: 'mcq', q: '"I would buy a truck":', opts: ['Compraré una troca', 'Compraría una camioneta', 'Compro una camioneta', 'Compré una camioneta'], a: 1, why: 'Would → conditional (-ía). Camioneta is standard; "troca" is common US Spanish slang.' }
            ]
          },
          {
            id: 'es-work', title: 'Spanish for work, tech & daily life in the US', min: 10, teaser: 'Help desk phrases, safety talk, and small talk.',
            pre: ['es-present'], links: ['career-soc'],
            cards: [
              { t: 'read', h: 'IT and help desk', body: '<ul><li><b>¿En qué le puedo ayudar?</b> How can I help you?</li><li><b>Reinicie la computadora, por favor.</b> Please restart the computer.</li><li><b>¿Qué mensaje de error ve?</b> What error message do you see?</li><li><b>No comparta su contraseña con nadie.</b> Don\'t share your password with anyone.</li><li><b>Ese correo es una estafa</b> (phishing / scam). <b>No haga clic en el enlace.</b></li><li>Vocab: la red (network), el servidor, la contraseña, el usuario, el archivo (file), la actualización (update), la impresora (printer).</li></ul><p>Bilingual help desk and SOC staff are in demand across the South; it\'s a real resume line.</p>' },
              { t: 'read', h: 'Small talk', body: '<ul><li><b>¿De dónde eres?</b> Where are you from? <b>Soy de Luisiana, cerca de…</b></li><li><b>¿A qué te dedicas?</b> What do you do (for work)?</li><li><b>¿Qué hiciste el fin de semana?</b> What did you do this weekend?</li><li><b>¡Qué padre / qué chévere / qué bueno!</b> Cool! (padre is Mexican, chévere Caribbean/Venezuelan.)</li></ul>' },
              { t: 'gen', g: 'esVocab' }, { t: 'gen', g: 'esVocab' }
            ]
          }
        ]
      }
    ]
  });
})();
