/* Music: piano and guitar from zero, plus the theory that makes both make sense.
   Theory backbone: standard common-practice harmony (as in Berklee/MIT OCW 21M.051 Fundamentals of Music),
   rewritten plainly. Lessons are original. Interactive keyboard, fretboard, tuner from App.widgets. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }

  // Correct note spelling: letter steps + accidental from semitone distance.
  var LET = 'CDEFGAB', PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  function pcOf(n) { var v = PC[n[0]]; for (var i = 1; i < n.length; i++) v += n[i] === '#' ? 1 : -1; return (v + 12) % 12; }
  function spell(root, letterSteps, semis) {
    var L = LET[(LET.indexOf(root[0]) + letterSteps) % 7], want = (pcOf(root) + semis) % 12, d = ((want - PC[L]) % 12 + 12) % 12;
    return d === 0 ? L : d === 1 ? L + '#' : d === 11 ? L + 'b' : d === 2 ? L + '##' : L + 'bb';
  }
  var MAJOR = [0, 2, 4, 5, 7, 9, 11], MINOR = [0, 2, 3, 5, 7, 8, 10];
  function scale(root, steps) { return steps.map(function (s, i) { return spell(root, i, s); }); }
  var KEYS = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'];
  var INT = ['unison', 'minor 2nd', 'major 2nd', 'minor 3rd', 'major 3rd', 'perfect 4th', 'tritone', 'perfect 5th', 'minor 6th', 'major 6th', 'minor 7th', 'major 7th', 'octave'];

  G.muScale = function () {
    var k = pk(KEYS), sc = scale(k, MAJOR), deg = r(1, 6), wrong = [];
    sc.forEach(function (n, i) { if (i !== deg) wrong.push(n); });
    wrong.push(SHARP[(pcOf(sc[deg]) + 1) % 12]);
    return mc('What is note <b>' + (deg + 1) + '</b> of the <b>' + k + ' major</b> scale?', sc[deg], wrong, k + ' major: ' + sc.join(' ') + '. Built from the pattern whole-whole-half-whole-whole-whole-half, using each letter once.');
  };
  G.muChord = function () {
    var root = pk(['C', 'D', 'E', 'F', 'G', 'A', 'B']), minor = root === 'B' ? true : Math.random() < .5;
    var notes = [root, spell(root, 2, minor ? 3 : 4), spell(root, 4, 7)], name = root + (minor ? ' minor' : ' major');
    var other = [root, spell(root, 2, minor ? 4 : 3), spell(root, 4, 7)];
    return mc('Which notes make a <b>' + name + '</b> chord?', notes.join(' – '), [other.join(' – '), [root, spell(root, 2, minor ? 3 : 4), spell(root, 5, 9)].join(' – '), [spell(root, 1, 2), spell(root, 3, 5), spell(root, 5, 9)].join(' – ')],
      'A triad is root + 3rd + 5th. Major = 4 half steps then 3 more (major 3rd + minor 3rd). Minor = 3 then 4. ' + name + ' = ' + notes.join(', ') + '.' + (root === 'B' ? ' (B major needs D#, so B minor is the common beginner one.)' : ''));
  };
  G.muInterval = function () {
    var a = r(0, 11), s = r(1, 12), b = SHARP[(a + s) % 12];
    return mc('Going UP from <b>' + SHARP[a] + '</b> to the next <b>' + b + '</b> (' + s + ' half step' + (s > 1 ? 's' : '') + '), what interval is that?', INT[s], INT.slice(1), s + ' half steps = ' + INT[s] + '. Count piano keys, black and white, without counting the starting one. Key anchors: 3 = minor 3rd (sad), 4 = major 3rd (happy), 7 = perfect 5th (power chord), 12 = octave.');
  };
  var STR = [['low E (6th)', 4], ['A (5th)', 9], ['D (4th)', 2], ['G (3rd)', 7], ['B (2nd)', 11], ['high E (1st)', 4]];
  G.muFret = function () {
    var s = pk(STR), f = r(0, 12), n = SHARP[(s[1] + f) % 12];
    return mc('Standard tuning. What note is fret <b>' + f + '</b> on the <b>' + s[0] + '</b> string?', n, [SHARP[(s[1] + f + 1) % 12], SHARP[(s[1] + f + 11) % 12], SHARP[(s[1] + f + 2) % 12]], 'Each fret is one half step. ' + SHARP[s[1]] + ' + ' + f + ' half steps = ' + n + '. Fret 12 is the open note an octave up. (Shown with sharps; C# is the same key as Db.)');
  };
  G.muNumbers = function () {
    var k = pk(['C', 'G', 'D', 'A', 'F']), sc = scale(k, MAJOR), q = ['I', 'ii', 'iii', 'IV', 'V', 'vi'], i = pk([0, 3, 4, 5, 1]);
    var name = sc[i] + ([1, 2, 5].indexOf(i) >= 0 ? 'm' : ''), all = q.map(function (_, j) { return sc[j] + ([1, 2, 5].indexOf(j) >= 0 ? 'm' : ''); });
    return mc('In the key of <b>' + k + ' major</b>, what chord is <b>' + q[i] + '</b>?', name, all, 'Build a chord on each scale note: I, IV, V are major; ii, iii, vi are minor. In ' + k + ': ' + all.map(function (c, j) { return q[j] + '=' + c; }).join(', ') + '. I–V–vi–IV is the progression behind hundreds of pop songs.');
  };
  G.muBeat = function () {
    var bpm = pk([60, 72, 80, 90, 96, 100, 120]), k = r(0, 1);
    if (k === 0) return { t: 'calc', q: 'At <b>' + bpm + ' BPM</b>, how many seconds is one beat?', a: 60 / bpm, tol: 0.01, why: '60 seconds ÷ ' + bpm + ' beats = ' + (60 / bpm).toFixed(3).replace(/0+$/, '') + ' s. Faster tempo, shorter beats.' };
    var n = pk([['whole', 4], ['half', 2], ['quarter', 1], ['eighth', 0.5]]);
    return { t: 'calc', q: 'In 4/4 time, how many beats does a <b>' + n[0] + ' note</b> get?', a: n[1], tol: 0.01, why: 'Whole 4, half 2, quarter 1, eighth ½, sixteenth ¼. Each is half the one before.' };
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    id: 'music', name: 'Music: piano & guitar', mark: '🎹', color: '#c48bd6', stat: 'spirit', group: 'Music & dance',
    blurb: 'Notes, rhythm, chords, piano, guitar, theory.',
    intro: 'Piano and guitar from absolute zero, with the theory that makes both click: why chords sound the way they do and how songs are built. The on-screen keyboard, fretboard and tuner let you practice right in the app; a real instrument makes it stick. Ten to fifteen minutes a day beats two hours on Sunday.',
    placement: [
      { t: 'mcq', q: 'How many different note names repeat on a piano before starting over?', opts: ['7', '8', '12', '88'], a: 2, why: '12: 7 white-key letters plus 5 sharps/flats. Foundations, Unit 1.' },
      { t: 'mcq', q: 'A C major chord is:', opts: ['C E G', 'C D E', 'C F A', 'C Eb G'], a: 0, why: 'Root, major 3rd, 5th. Chords are in the piano and theory units.' },
      { t: 'mcq', q: 'Standard guitar tuning, low to high:', opts: ['E A D G B E', 'A D G C E A', 'E B G D A E', 'C G D A E B'], a: 0, why: 'Low E to high E. Guitar unit.' },
      { t: 'mcq', q: 'In 4/4 time, a half note gets:', opts: ['1 beat', '2 beats', '4 beats', '½ beat'], a: 1, why: 'Two beats. Rhythm is Unit 1.' },
      { t: 'mcq', q: 'In C major, the V chord is:', opts: ['F', 'G', 'Am', 'D'], a: 1, why: 'The 5th note is G, so V = G. Theory unit.' }
    ],
    units: [
      {
        name: 'Unit 1 · Foundations', tag: 'start here',
        blurb: 'The 12 notes, rhythm and counting, and intervals: the shared language of every instrument.',
        lessons: [
          {
            id: 'mu-notes', title: 'The 12 notes & the keyboard', min: 8, teaser: 'Why there are 12, and how to find any note.',
            links: ['mu-rhythm', 'mu-piano-start'],
            cards: [
              { t: 'read', h: 'Seven letters, twelve notes', body: '<p>Western music uses 12 notes that repeat higher and lower. The white keys are named with letters <b>A B C D E F G</b>, then it starts over. The black keys sit between them and are <b>sharps (#)</b> or <b>flats (b)</b>: the black key between C and D is C# (C sharp) or Db (D flat), same key, two names.</p><p>Two spots have no black key between them: <b>E–F</b> and <b>B–C</b>. Everything else is two half steps apart.</p><p>Moving one key to the very next (white or black) is a <b>half step</b>. Two half steps = a <b>whole step</b>. Going up 12 half steps lands on the same letter, higher: an <b>octave</b>.</p>', mem: 'Find C: the white key just left of each group of TWO black keys.',
                simple: '<p>A piano repeats the same 12 notes over and over. White keys have letter names A to G. Black keys are the in-between notes, called sharps or flats. Find C just left of the two black keys.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C3', to: 'B4', target: 'C4', labels: false, prompt: 'Find middle C (C4)' }, h: 'Find middle C', fallback: '<p>On a keyboard, find the group of two black keys near the middle; the white key just left of it is middle C.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C3', to: 'B4', target: 'F4', labels: false, prompt: 'Now find F4: just left of the group of THREE black keys' }, h: 'Find F', fallback: '<p>F is the white key just left of each group of three black keys.</p>' },
              { t: 'gen', g: 'muInterval' },
              { t: 'tf', q: 'There is a black key between E and F.', a: false, why: 'E–F and B–C are the two natural half steps, with no black key between.' }
            ]
          },
          {
            id: 'mu-rhythm', title: 'Rhythm, beats & counting', min: 8, teaser: 'BPM, time signatures, and note lengths.',
            pre: ['mu-notes'], links: ['dn-count'],
            cards: [
              { t: 'read', h: 'The beat', body: '<p>The <b>beat</b> is the steady pulse you tap your foot to. <b>Tempo</b> is how fast, in beats per minute (BPM): 60 is slow, 120 is a typical pop/dance tempo.</p><p>A <b>time signature</b> groups beats into bars (measures). <b>4/4</b>, by far the most common, means 4 beats per bar and the quarter note gets one beat: count "1 2 3 4, 1 2 3 4." <b>3/4</b> is waltz time: "1 2 3." Cajun waltzes are in 3/4.</p>' },
              { t: 'read', h: 'Note lengths', body: '<ul><li><b>Whole note</b>: 4 beats.</li><li><b>Half</b>: 2.</li><li><b>Quarter</b>: 1.</li><li><b>Eighth</b>: ½ (count "1 and 2 and").</li><li><b>Sixteenth</b>: ¼ ("1 e and a").</li></ul><p>Rests are silences with the same lengths. A <b>dot</b> after a note adds half its value (dotted half = 3 beats).</p>', mem: 'Whole 4, half 2, quarter 1, eighth ½.' },
              { t: 'gen', g: 'muBeat' }, { t: 'gen', g: 'muBeat' },
              { t: 'widget', w: 'rhythm', o: { routine: 'bounce', bpm: 90, bars: 4 }, h: 'Feel the beat: tap along', fallback: '<p>Put on any song, tap your foot, and count 1-2-3-4 out loud for a minute.</p>' }
            ]
          },
          {
            id: 'mu-intervals', title: 'Intervals: the distance between notes', min: 9, teaser: 'Why some combinations sound happy, sad, or tense.',
            pre: ['mu-notes'], links: ['mu-scales', 'mu-chords'],
            cards: [
              { t: 'read', h: 'Measuring in half steps', body: '<p>An <b>interval</b> is the distance between two notes, counted in half steps:</p><ul><li>3 = <b>minor 3rd</b>: darker, sad.</li><li>4 = <b>major 3rd</b>: bright, happy.</li><li>5 = <b>perfect 4th</b> ("Here Comes the Bride" opening).</li><li>6 = <b>tritone</b>: tense, unstable.</li><li>7 = <b>perfect 5th</b>: strong, open; the power chord.</li><li>12 = <b>octave</b>: same note, higher.</li></ul><p>Chords and scales are just stacks and patterns of intervals. Learn these and the rest is logic.</p>' },
              { t: 'gen', g: 'muInterval' }, { t: 'gen', g: 'muInterval' }, { t: 'gen', g: 'muInterval' },
              { t: 'explain', q: 'Explain the difference between a major 3rd and a minor 3rd, and why it matters.', points: ['Major 3rd = 4 half steps, minor 3rd = 3', 'The 3rd decides if a chord is major or minor', 'Major sounds bright, minor sounds darker', 'One half step changes the whole mood'] }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Piano', tag: 'keys',
        blurb: 'Hand position, the C major scale, chords, and the four-chord progression that unlocks hundreds of songs.',
        lessons: [
          {
            id: 'mu-piano-start', title: 'Posture, hand position & finger numbers', min: 7, teaser: 'Set up right so it doesn\'t hurt and speeds up later.',
            pre: ['mu-notes'], links: ['mu-piano-scale'],
            cards: [
              { t: 'read', h: 'Set up', body: '<ul><li>Sit so your forearms are level with the keys, elbows slightly in front of your body.</li><li>Curve your fingers like you\'re holding a small ball. Play with the fingertips, wrists loose, not collapsed.</li><li><b>Finger numbers</b>: thumb = 1, index = 2, middle = 3, ring = 4, pinky = 5, on both hands.</li><li>Right hand <b>C position</b>: thumb on middle C, one finger per white key up to G.</li></ul><p>No piano? A cheap 61-key keyboard works for years. A free alternative to start: the on-screen keyboard here.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'B4', highlight: ['C4', 'D4', 'E4', 'F4', 'G4'], ordered: true, labels: true, prompt: 'C position: play C D E F G with fingers 1 2 3 4 5' }, h: 'Five-finger warm-up', fallback: '<p>Right thumb on middle C. Play C D E F G with fingers 1–5, then back down. Slow and even.</p>' },
              { t: 'mcq', q: 'On piano, finger number 1 is…', opts: ['The pinky', 'The thumb', 'The index finger', 'Different on each hand'], a: 1, why: 'Thumb is 1 on both hands; pinky is 5.' }
            ]
          },
          {
            id: 'mu-piano-scale', title: 'The C major scale (with the thumb tuck)', min: 8, teaser: 'Eight notes, one smooth motion.',
            pre: ['mu-piano-start'], links: ['mu-scales', 'mu-chords'],
            cards: [
              { t: 'read', h: 'Fingering', body: '<p>C major is all white keys: C D E F G A B C. Right hand fingering going up: <b>1 2 3, tuck the thumb under to F, 1 2 3 4 5</b>. Coming down: 5 4 3 2 1, cross finger 3 over to E, 3 2 1.</p><p>The thumb tuck is the whole skill. Practice it slowly until there\'s no bump in the sound.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'C5', highlight: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], ordered: true, labels: true, prompt: 'Play the C major scale up' }, h: 'Play it', fallback: '<p>Play C D E F G A B C slowly, tucking the thumb under after E.</p>' },
              { t: 'gen', g: 'muScale' }
            ]
          },
          {
            id: 'mu-chords', title: 'Chords: major, minor, and playing them', min: 10, teaser: 'Root, third, fifth. Every chord on the keyboard.',
            pre: ['mu-intervals'], links: ['mu-progressions', 'mu-guitar-chords'],
            cards: [
              { t: 'read', h: 'Building triads', body: '<p>A <b>triad</b> is 3 notes: the <b>root</b>, the <b>3rd</b> and the <b>5th</b>. On a keyboard: play a key, skip one white key, play, skip, play.</p><ul><li><b>Major</b>: root + 4 half steps + 3 half steps. C major = C E G.</li><li><b>Minor</b>: root + 3 + 4. A minor = A C E.</li></ul><p>Right-hand fingering: 1, 3, 5. Left hand often plays just the root, low, with finger 5.</p>', mem: 'Major 4+3. Minor 3+4.' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'B4', chord: 'C', labels: false, prompt: 'Play a C major chord' }, h: 'Play C major', fallback: '<p>Play C, E and G together with fingers 1, 3, 5.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'B4', chord: 'Am', labels: false, prompt: 'Play A minor' }, h: 'Play A minor', fallback: '<p>Play A, C and E together.</p>' },
              { t: 'gen', g: 'muChord' }, { t: 'gen', g: 'muChord' }
            ]
          },
          {
            id: 'mu-progressions', title: 'The four chords behind hundreds of songs', min: 9, teaser: 'I–V–vi–IV, and how to play along with real music.',
            pre: ['mu-chords'], links: ['mu-numbers'],
            cards: [
              { t: 'read', h: 'I – V – vi – IV', body: '<p>In C major that\'s <b>C – G – Am – F</b>. Loop it and you can play along with an absurd number of pop, rock and country songs (search "four chord songs"). The same pattern in other keys: G – D – Em – C, D – A – Bm – G.</p><p>Practice plan: right hand plays each chord on beat 1 and holds for 4 beats; left hand plays the root note low. Then play the chord on every beat. Then try a broken pattern: root, 5th, 3rd, 5th.</p><p><b>Smooth voice leading</b>: instead of jumping your whole hand, move to the closest version of the next chord (G as B-D-G, F as A-C-F). Your hand barely moves.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'B4', chord: 'G', labels: true, prompt: 'Play G major (the V chord in C)' }, h: 'Play the V chord', fallback: '<p>Play G, B, D together.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'B4', chord: 'F', labels: true, prompt: 'Play F major (the IV chord in C)' }, h: 'Play the IV chord', fallback: '<p>Play F, A, C together.</p>' },
              { t: 'gen', g: 'muNumbers' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Guitar', tag: 'six strings',
        blurb: 'Tuning, your first five chords, strumming, and the fretboard.',
        lessons: [
          {
            id: 'mu-guitar-start', title: 'Parts, holding it & tuning', min: 8, teaser: 'E A D G B E, and getting in tune by ear or with the tuner.',
            pre: ['mu-notes'], links: ['mu-guitar-chords'],
            cards: [
              { t: 'read', h: 'Setup', body: '<p>Strings from thickest to thinnest: <b>E A D G B E</b> ("Eddie Ate Dynamite, Good Bye Eddie"). The thick one is the 6th string, the thin one is the 1st. <b>Frets</b> are the metal bars; pressing just behind a fret raises the note one half step per fret.</p><p>Hold the guitar with the body on your right leg (right-handed), neck tilted up a little. Fretting-hand thumb behind the neck, fingers arched so they don\'t touch other strings. Press with the fingertips right behind the fret, not on top of it.</p><p>Your fingertips will hurt for the first 2–3 weeks. Short daily sessions build calluses faster than long weekly ones.</p>' },
              { t: 'widget', w: 'tuner', o: { goal: 'E2' }, h: 'Tune the low E string', fallback: '<p>Use any free tuner app, or tune by ear: fret 5 on each string matches the next open string (except fret 4 on G matches open B).</p>' },
              { t: 'mcq', q: 'Which string is the "1st string"?', opts: ['The thickest (low E)', 'The thinnest (high E)', 'The A string', 'The G string'], a: 1, why: 'Numbered from the thinnest: 1st = high E, 6th = low E.' },
              { t: 'gen', g: 'muFret' }
            ]
          },
          {
            id: 'mu-guitar-chords', title: 'First chords: G, C, D, Em, Am', min: 10, teaser: 'Five open chords that cover thousands of songs.',
            pre: ['mu-guitar-start'], links: ['mu-strum'],
            cards: [
              { t: 'read', h: 'Start with Em and Am', body: '<p><b>Em</b> uses two fingers (2nd fret of the A and D strings) and all six strings ring. <b>Am</b> is the same shape moved over one string, plus your index on the 1st fret of the B string; skip the low E.</p><p>Then <b>C</b>, <b>G</b> and <b>D</b>. With those five you can play G–D–Em–C (the four-chord progression in G).</p><p><b>One-minute changes</b>: pick two chords and switch between them as many times as you can in 60 seconds. Write the number down. It goes up fast, and it\'s the single best beginner drill.</p>', mem: 'One-minute changes: track the count daily.' },
              { t: 'widget', w: 'fretboard', o: { chord: 'Em', frets: 5, labels: true }, h: 'Build Em', fallback: '<p>Fingers 2 and 3 on the 2nd fret of the A and D strings. Strum all six.</p>' },
              { t: 'widget', w: 'fretboard', o: { chord: 'G', frets: 5, labels: true }, h: 'Build G', fallback: '<p>3rd fret low E, 2nd fret A, 3rd fret high E (one common fingering). Strum all six.</p>' },
              { t: 'widget', w: 'fretboard', o: { chord: 'C', frets: 5, labels: true }, h: 'Build C', fallback: '<p>3rd fret A, 2nd fret D, 1st fret B. Skip the low E.</p>' },
              { t: 'widget', w: 'fretboard', o: { chord: 'D', frets: 5, labels: true }, h: 'Build D', fallback: '<p>2nd fret G, 3rd fret B, 2nd fret high E. Strum from the D string down.</p>' },
              { t: 'mcq', q: 'When playing an A minor chord, which string do you usually skip?', opts: ['High E', 'Low E (6th)', 'G', 'None'], a: 1, why: 'Am\'s lowest note should be A, so strum from the 5th string.' }
            ]
          },
          {
            id: 'mu-strum', title: 'Strumming patterns & keeping time', min: 8, teaser: 'Down, down-up, and the pattern that fits almost everything.',
            pre: ['mu-guitar-chords'], links: ['mu-rhythm'],
            cards: [
              { t: 'read', h: 'Keep the hand moving', body: '<p>Your strumming hand moves down on the beats (1 2 3 4) and up on the "ands," <b>all the time</b>, like a pendulum. A pattern is just choosing which of those swings hit the strings.</p><ul><li>Beginner: <b>D D D D</b> (down on every beat).</li><li>Next: <b>D DU DU DU</b>.</li><li>The universal one: <b>D D U U D U</b> (down on 1, down on 2, up on "and" of 2, miss beat 3, up on "and" of 3, down on 4, up on "and" of 4).</li></ul><p>Play along with a metronome at 70 BPM. Change chords on beat 1 even if the chord isn\'t ready yet; keeping time matters more than perfect chords.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'bounce', bpm: 70, bars: 4 }, h: 'Lock in at 70 BPM', fallback: '<p>Set a metronome to 70 and strum down on every click for a minute.</p>' },
              { t: 'gen', g: 'muBeat' }
            ]
          },
          {
            id: 'mu-fretboard', title: 'Learning the fretboard & power chords', min: 9, teaser: 'Find any note, then move one shape everywhere.',
            pre: ['mu-strum'], links: ['mu-intervals'],
            cards: [
              { t: 'read', h: 'Landmarks', body: '<p>Learn the notes on the low E and A strings first; that\'s where chord roots live. Landmarks: fret 3, 5, 7, 9, 12 (the dots). Low E string: G at 3, A at 5, B at 7, C at 8, D at 10, E at 12.</p><p><b>Power chord</b>: root on the E or A string plus the note two frets up on the next string (a perfect 5th). Same shape everywhere: put the root on G (3rd fret) and it\'s G5; slide to the 5th fret and it\'s A5. That\'s most of rock and punk.</p>' },
              { t: 'widget', w: 'fretboard', o: { find: 'A', frets: 12, labels: false }, h: 'Find every A', fallback: '<p>Find every A in the first 12 frets: open A string, 5th fret low E, 7th fret D, 2nd fret G, 10th fret B, 5th fret high E.</p>' },
              { t: 'gen', g: 'muFret' }, { t: 'gen', g: 'muFret' }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · Theory that makes it click', tag: 'theory',
        blurb: 'Scales, keys, chord numbers and ear training.',
        lessons: [
          {
            id: 'mu-scales', title: 'Major & minor scales, keys', min: 10, teaser: 'W-W-H-W-W-W-H, and why songs have a "home."',
            pre: ['mu-intervals'], links: ['mu-numbers'],
            cards: [
              { t: 'read', h: 'The major scale pattern', body: '<p>Every major scale uses the same pattern of steps: <b>Whole Whole Half Whole Whole Whole Half</b>. Start on any note, follow it, use each letter once, and you get that key\'s scale. G major needs F# to fit the pattern; F major needs Bb.</p><p>The <b>key</b> of a song is its home note and scale. Melodies and chords pull back to that note; that pull is what makes an ending feel finished.</p><p>The <b>natural minor</b> scale is W-H-W-W-H-W-W. Every major key has a <b>relative minor</b> that uses the same notes, starting on the 6th: C major ↔ A minor, G major ↔ E minor.</p>', mem: 'Major: W W H W W W H. Relative minor starts on the 6th.' },
              { t: 'gen', g: 'muScale' }, { t: 'gen', g: 'muScale' }, { t: 'gen', g: 'muScale' },
              { t: 'explain', q: 'Explain how to build a major scale starting on any note.', points: ['Use the step pattern whole-whole-half-whole-whole-whole-half', 'A whole step is 2 half steps', 'Use each letter name once in order', 'Add sharps or flats so the steps fit'] }
            ]
          },
          {
            id: 'mu-numbers', title: 'Chord numbers & how songs are built', min: 9, teaser: 'I, IV, V, vi: play any song in any key.',
            pre: ['mu-scales', 'mu-chords'], links: ['mu-progressions', 'mu-ear'],
            cards: [
              { t: 'read', h: 'Roman numerals (the Nashville idea)', body: '<p>Build a triad on each note of a major scale and you get the same pattern in every key: <b>I ii iii IV V vi vii°</b>. Uppercase = major, lowercase = minor, ° = diminished.</p><p>So a song is really a list of numbers. I–IV–V is the blues and early rock. I–V–vi–IV is modern pop. ii–V–I is jazz. Know the numbers and you can <b>transpose</b> (change key) to fit your voice instantly. Nashville session players chart songs this way.</p><p><b>Capo</b> on guitar: clamp it at fret 2 and your G shapes sound in A. Same numbers, new key.</p>' },
              { t: 'gen', g: 'muNumbers' }, { t: 'gen', g: 'muNumbers' }, { t: 'gen', g: 'muNumbers' },
              { t: 'tf', q: 'In any major key, the IV and V chords are major and the vi chord is minor.', a: true, why: 'That pattern holds in every major key.' }
            ]
          },
          {
            id: 'mu-ear', title: 'Ear training & practice routine', min: 8, teaser: 'Hear it, sing it, play it. Plus a 15-minute daily plan.',
            pre: ['mu-numbers'], links: ['mu-progressions'],
            cards: [
              { t: 'read', h: 'Training your ear', body: '<ul><li><b>Sing what you play</b>, even badly. Connecting voice and ear is the shortcut.</li><li><b>Interval songs</b>: perfect 4th = "Here Comes the Bride," perfect 5th = the Star Wars theme opening, octave = "Somewhere Over the Rainbow" (first two notes).</li><li><b>Find the bass note</b> of songs you like on your instrument; the bass is usually the chord root.</li><li><b>Major or minor?</b> Guess, then check. Free trainers: musictheory.net exercises, Tenuto.</li></ul>' },
              { t: 'read', h: 'A 15-minute daily routine', body: '<ol><li>2 min: warm-up (five-finger pattern or chromatic frets 1-2-3-4).</li><li>3 min: one-minute chord changes on your hardest pair.</li><li>5 min: a song or progression with a metronome.</li><li>3 min: one new thing (a chord, a scale, a strum pattern).</li><li>2 min: play anything you like, just for fun.</li></ol><p>Log it in Today. Consistency beats talent; most players who quit just stopped practicing for a week and never restarted.</p>' },
              { t: 'widget', w: 'piano', o: { from: 'C4', to: 'C5', target: 'G4', labels: false, prompt: 'Find the perfect 5th above C (7 half steps)' }, h: 'Find the 5th', fallback: '<p>From C, count 7 half steps up: G.</p>' },
              { t: 'gen', g: 'muInterval' }
            ]
          }
        ]
      }
    ]
  });
})();
