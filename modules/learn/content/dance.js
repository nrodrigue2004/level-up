/* Dance: from stiff to comfortable. Loosening up, counting music, Louisiana line and partner dances,
   hip-hop foundations, and club confidence. Original lessons. Step breakdowns describe the common
   versions taught at parties and dance halls; regional versions vary, so watch the room and copy. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var opts = [right]; shuffle(wrongs).forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 4) opts.push(w); }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }

  G.dnCount = function () {
    var bpm = pk([90, 96, 100, 104, 110, 120, 128]);
    return { t: 'calc', q: 'A song is <b>' + bpm + ' BPM</b>. How many seconds does one 8-count take? (2 decimals)', a: Math.round(8 * 60 / bpm * 100) / 100, tol: 0.011, why: 'Each count is one beat: 60 ÷ ' + bpm + ' = ' + (60 / bpm).toFixed(3) + ' s. Eight of them = ' + (8 * 60 / bpm).toFixed(2) + ' s. Most dance music phrases in 8-counts, so a new section almost always starts on a "1."' };
  };
  var CALLS = [
    ['Cupid Shuffle', 'To the right, to the left, then kick, then walk it by yourself (turn).'],
    ['Cha Cha Slide', 'The song literally calls the steps: slide left, take it back, one hop, right foot stomp, cha cha.'],
    ['Electric Slide', 'Grapevine right, grapevine left, walk back, rock forward and back, then turn a quarter.'],
    ['Cajun two-step', 'A couples dance: quick-quick-slow, traveling counterclockwise around the floor.'],
    ['Cajun waltz', 'A couples dance in 3/4 time: step-step-step, turning gently around the floor.'],
    ['The Wobble', 'A line dance where you rock your hips on the "wobble" parts and follow the lyrics\' cues between them.']
  ];
  G.dnWhich = function () {
    var c = pk(CALLS);
    return mc('Which dance is this?<br><br><b>' + c[1] + '</b>', c[0], CALLS.map(function (x) { return x[0]; }), 'Knowing what each one looks like means you can jump in when the song comes on instead of watching from the wall.');
  };
  G.dnFix = function () {
    var f = pk([
      ['You look stiff and robotic.', 'Bend your knees and add a small bounce on every beat', ['Stand straighter and lock your knees', 'Move only your arms', 'Dance faster than the music']],
      ['You keep losing the beat.', 'Stop, nod your head to the beat, and restart on the next "1"', ['Keep going and hope it lines up', 'Watch your feet instead of the room', 'Do bigger moves']],
      ['You don\'t know the line dance that just started.', 'Get in the back row and copy the person in front of you', ['Leave the floor', 'Stand in the front row', 'Make up your own steps in the middle']],
      ['Your arms are hanging dead at your sides.', 'Bend your elbows a little and let them swing with your body', ['Keep them straight and still', 'Put your hands in your pockets', 'Wave them over your head constantly']],
      ['You feel everyone is watching you.', 'Keep moves small and smile; almost nobody is watching, they\'re worried about themselves', ['Go all out with big moves to prove yourself', 'Stare at the floor', 'Stop dancing']]
    ]);
    return mc('<b>Problem:</b> ' + f[0] + '<br>Best fix?', f[1], f[2], 'Small, on-beat and relaxed beats big and stiff every time.');
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    id: 'dance', name: 'Dance: loosen up', mark: '🕺', color: '#e0806a', stat: 'spirit', group: 'Music & dance',
    blurb: 'Groove, line dances, two-step, hip-hop.',
    intro: 'For anyone who feels stiff or uncoordinated. Being a "good dancer" at a party is mostly three things: staying on the beat, staying relaxed, and knowing the handful of line dances everyone does. That\'s very learnable. Practice in your room with the rhythm trainer, then use it at the next wedding, crawfish boil or bar.',
    placement: [
      { t: 'mcq', q: 'Most dance music is counted in groups of:', opts: ['3', '5', '8', '12'], a: 2, why: '8-counts. Unit 1.' },
      { t: 'mcq', q: 'The Cupid Shuffle starts by stepping:', opts: ['Back', 'To the right', 'Forward', 'In a circle'], a: 1, why: '"To the right." Unit 2.' },
      { t: 'mcq', q: 'The Cajun two-step rhythm is:', opts: ['Quick-quick-slow', 'Slow-slow-slow', '1-2-3 waltz', 'Hop-hop'], a: 0, why: 'Quick-quick-slow. Unit 2.' },
      { t: 'mcq', q: 'The foundation of almost all hip-hop dance is:', opts: ['Spins', 'The bounce / groove on the beat', 'Splits', 'Jumping'], a: 1, why: 'The bounce. Unit 3.' },
      { t: 'mcq', q: 'The single biggest fix for looking stiff:', opts: ['Bend your knees and relax', 'Bigger arm moves', 'Dance faster', 'Close your eyes'], a: 0, why: 'Soft knees. Unit 1.' }
    ],
    units: [
      {
        name: 'Unit 1 · Loosen up', tag: 'start here',
        blurb: 'Why you feel stiff, how to find the beat, and the bounce that fixes 80% of it.',
        lessons: [
          {
            id: 'dn-stiff', title: 'Why you feel stiff (and the fix)', min: 7, teaser: 'Locked knees, held breath, and overthinking.',
            links: ['dn-count', 'dn-bounce'],
            cards: [
              { t: 'read', h: 'What "stiff" actually is', body: '<p>Stiff dancing is almost always: <b>locked knees</b>, <b>tight shoulders</b>, <b>held breath</b>, and <b>trying to look good</b> instead of moving with the music. People who look natural aren\'t doing harder moves. They\'re doing <i>simpler</i> moves, relaxed and on the beat.</p><p>The fix, in order:</p><ol><li>Bend your knees slightly. Always.</li><li>Breathe out and drop your shoulders.</li><li>Find the beat (nod first, then bounce).</li><li>Keep moves small. Small and on-beat looks confident; big and off-beat looks nervous.</li></ol>', mem: 'Soft knees, low shoulders, on the beat, small moves.' },
              { t: 'read', h: 'Practice privately first', body: '<p>Five minutes a day in your room with music you like, ideally in front of a mirror or recording yourself on your phone. It feels awkward for about a week. Then the moves become automatic and you stop thinking about them, which is exactly what makes you look relaxed in public.</p>' },
              { t: 'gen', g: 'dnFix' }, { t: 'gen', g: 'dnFix' }
            ]
          },
          {
            id: 'dn-count', title: 'Hearing the beat & counting 8s', min: 8, teaser: 'Find the 1, count to 8, never get lost again.',
            pre: ['dn-stiff'], links: ['mu-rhythm', 'dn-bounce'],
            cards: [
              { t: 'read', h: 'Find the beat', body: '<p>Listen for the <b>kick drum</b> (the low thump) and <b>snare</b> (the sharp clap or crack). In most pop, hip-hop and country, the kick lands on 1 and 3 and the snare on 2 and 4. Nod your head on every beat.</p><p>Dancers count in <b>8-counts</b>: two bars of 4. The <b>1</b> is the strongest beat, where sections and line dance patterns start. You\'ll hear the music "turn over" every 8 or 32 counts: a new verse, a drop, a chorus.</p><p>Swamp pop, zydeco and Cajun music: same idea, though Cajun waltzes count in 3.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'bounce', bpm: 96, bars: 4 }, h: 'Tap the beat', fallback: '<p>Put on a song, nod your head on each beat, and count 1 to 8 out loud, over and over.</p>' },
              { t: 'gen', g: 'dnCount' },
              { t: 'tf', q: 'In most pop and hip-hop, the snare hits on beats 2 and 4.', a: true, why: 'That backbeat is why people clap on 2 and 4.' }
            ]
          },
          {
            id: 'dn-bounce', title: 'The bounce, the rock & the side step', min: 9, teaser: 'Three moves that work to any song.',
            pre: ['dn-count'], links: ['dn-hiphop', 'dn-club'],
            cards: [
              { t: 'read', h: 'Three default moves', body: '<ul><li><b>The bounce</b>: knees bend down on every beat and come back up. Tiny. Let your chest and head follow. This alone makes you look like you\'re feeling the music.</li><li><b>The rock</b>: shift your weight from one foot to the other on each beat, shoulders following loosely.</li><li><b>The side step (step-touch)</b>: step right, bring the left foot in to touch; step left, bring the right in. Add the bounce. Add arms swinging naturally.</li></ul><p>Rotate between these three and you can dance through any song at any party.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'bounce', bpm: 100, bars: 8 }, h: 'Bounce trainer', fallback: '<p>Bounce your knees on every beat for one full song.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'isolate', bpm: 90, bars: 4 }, h: 'Isolations: move one part at a time', fallback: '<p>Move only your head side to side for 8 counts, then only shoulders, then only hips.</p>' },
              { t: 'explain', q: 'Explain your three go-to moves for any song.', points: ['Bounce: knees bend on every beat', 'Rock: shift weight foot to foot', 'Step-touch side to side with the bounce', 'Keep it small, relaxed and on the beat'] }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Louisiana & line dances', tag: 'party ready',
        blurb: 'The line dances that come on at every wedding and bar, plus Cajun and zydeco partner dancing.',
        lessons: [
          {
            id: 'dn-cupid', title: 'The Cupid Shuffle', min: 8, teaser: 'Louisiana-born, and the easiest line dance there is.',
            pre: ['dn-count'], links: ['dn-lines'],
            cards: [
              { t: 'read', h: 'The steps (32 counts, repeats facing a new wall)', body: '<p>The song (by Cupid, from Lafayette) calls the steps, which is why it\'s perfect to learn first.</p><ol><li><b>"To the right"</b>: 4 shuffling steps to the right (counts 1–4), repeat (5–8).</li><li><b>"To the left"</b>: same to the left (1–8).</li><li><b>"Now kick"</b>: kick right, kick left, kick right, kick left (1–8).</li><li><b>"Now walk it by yourself"</b>: walk or shuffle in place while turning a quarter turn to the left (1–8).</li></ol><p>Then the whole thing repeats facing the new wall. Add your own flavor in the "walk it" part once you\'re comfortable.</p>', mem: 'Right, left, kick, turn left. The song tells you.' },
              { t: 'order', q: 'Put the Cupid Shuffle in order.', items: ['Step to the right', 'Step to the left', 'Kick, kick, kick, kick', 'Walk it by yourself and turn a quarter left'], why: 'Right, left, kick, turn. Then repeat on the new wall.' },
              { t: 'widget', w: 'rhythm', o: { routine: 'cupid', bpm: 72, bars: 8 }, h: 'Cupid Shuffle trainer', fallback: '<p>Play the Cupid Shuffle and walk through it slowly, saying the steps out loud.</p>' },
              { t: 'mcq', q: 'During "walk it by yourself," which way do you turn?', opts: ['Right', 'A quarter turn left', 'All the way around', 'No turn'], a: 1, why: 'A quarter turn left, so each round faces a new wall.' }
            ]
          },
          {
            id: 'dn-lines', title: 'Electric Slide, Cha Cha Slide & the Wobble', min: 10, teaser: 'The other three you\'ll see at every party.',
            pre: ['dn-cupid'], links: ['dn-cajun'],
            cards: [
              { t: 'read', h: 'Cha Cha Slide', body: '<p>Like the Cupid Shuffle, DJ Casper\'s song calls every step: "slide to the left," "take it back now," "one hop this time," "right foot stomp," "left foot stomp," "cha cha real smooth," "how low can you go," and so on. Just listen and do what it says. Get in the back row the first time.</p>' },
              { t: 'read', h: 'Electric Slide (the common party version)', body: '<ol><li><b>Grapevine right</b>: step right, cross left behind, step right, touch left (1–4).</li><li><b>Grapevine left</b> the same way (5–8).</li><li><b>Walk back</b> three steps and touch (1–4).</li><li><b>Rock</b> forward, then back (5–6).</li><li><b>Step forward and turn</b> a quarter to the left as you brush the other foot (7–8).</li></ol><p>Repeat facing the new wall. Versions differ a little by region; watch the people in front of you for the first round.</p>' },
              { t: 'read', h: 'The Wobble', body: '<p>On the "wobble" lyrics, everyone rocks their hips side to side, bending the knees and dipping lower. Between those parts, the lyrics cue simple moves, and the crowd does a quarter turn at the end of each pattern. It\'s the most "do what the people in front do" line dance there is, so stand behind someone confident.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'slide', bpm: 80, bars: 8 }, h: 'Electric Slide trainer', fallback: '<p>Practice the grapevine: step right, cross behind, step right, touch. Then left.</p>' },
              { t: 'gen', g: 'dnWhich' }, { t: 'gen', g: 'dnWhich' }
            ]
          },
          {
            id: 'dn-cajun', title: 'Cajun two-step, waltz & zydeco', min: 10, teaser: 'The partner dances of south Louisiana dance halls.',
            pre: ['dn-count'], links: ['dn-club'],
            cards: [
              { t: 'read', h: 'Cajun two-step', body: '<p>A couples dance that travels <b>counterclockwise</b> around the floor (the "line of dance"). The rhythm is <b>quick-quick-slow</b>: two quick steps, then one held step. The leader moves forward; the follower moves backward, mirroring.</p><p>Hold: leader\'s right hand on the follower\'s shoulder blade, left hand holding the follower\'s right hand at about shoulder height, a relaxed frame. Keep steps small and smooth; Cajun dancers look like they\'re gliding.</p>', mem: 'Two-step: quick-quick-slow, counterclockwise.' },
              { t: 'read', h: 'Cajun waltz and zydeco', body: '<p><b>Waltz</b>: in 3/4 time ("1-2-3, 1-2-3"), the couple steps on every beat, usually traveling and turning gently around the floor. Many classic Cajun songs are waltzes.</p><p><b>Zydeco</b> (Creole music with accordion and rubboard) has its own bouncy, close partner dance with a step-step-pause feel and lots of hip movement. It\'s best learned by doing: dance halls and festivals around Lafayette and Opelousas often have beginner lessons before the band starts, and regulars are happy to show newcomers.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'twostep', bpm: 84, bars: 8 }, h: 'Two-step timing', fallback: '<p>Walk around your room saying "quick, quick, slow" with the steps until it feels automatic.</p>' },
              { t: 'mcq', q: 'Which way do couples travel around the floor in a Cajun dance hall?', opts: ['Clockwise', 'Counterclockwise', 'Straight lines', 'Wherever'], a: 1, why: 'Counterclockwise: the line of dance. Going the wrong way causes collisions.' },
              { t: 'gen', g: 'dnWhich' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Hip-hop foundations', tag: 'groove',
        blurb: 'The grooves under every hip-hop move: bounce, rock, two-step, body rolls.',
        lessons: [
          {
            id: 'dn-hiphop', title: 'Grooves: two-step, body roll & shoulders', min: 10, teaser: 'Party moves that look smooth with no choreography.',
            pre: ['dn-bounce'], links: ['dn-club'],
            cards: [
              { t: 'read', h: 'The hip-hop two-step', body: '<p>Different from the Cajun two-step: step right foot out to the side, bring the left in to meet it; step left out, bring the right in. Add the bounce, let your shoulders follow your feet, and keep your arms bent and loose. This is the default club move.</p>' },
              { t: 'read', h: 'Body roll and shoulder groove', body: '<p><b>Body roll</b>: start with the chest pushing forward, then the stomach, then the hips, in a wave from top to bottom over two counts. Practice slow in front of a mirror; it looks smooth once it\'s automatic.</p><p><b>Shoulder groove</b>: alternate shoulders forward or up on each beat while your feet do the bounce or rock. Easy, and it reads as "comfortable."</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'twostep', bpm: 95, bars: 8 }, h: 'Two-step on the beat', fallback: '<p>Do the two-step to a 90-ish BPM song for one minute.</p>' },
              { t: 'widget', w: 'rhythm', o: { routine: 'rolls', bpm: 80, bars: 4 }, h: 'Body roll timing', fallback: '<p>Do slow body rolls, one every 2 counts, for 8 counts.</p>' },
              { t: 'gen', g: 'dnFix' }
            ]
          },
          {
            id: 'dn-club', title: 'Club & party confidence', min: 7, teaser: 'What to actually do when the music starts.',
            pre: ['dn-bounce'], links: ['dn-cupid', 'dn-cajun'],
            cards: [
              { t: 'read', h: 'A simple game plan', body: '<ol><li><b>Start on the edge</b> with a bounce and a drink-hand sway. You\'re dancing already.</li><li><b>Join line dances from the back</b>. Everyone fumbles the first round.</li><li><b>Rotate your three moves</b> (bounce, rock, step-touch), adding the two-step.</li><li><b>Dancing with someone</b>: match their energy, face them, keep it small, and smile. Ask first with a simple "Want to dance?" A no is no big deal; take it easily.</li><li><b>Laugh at mistakes</b>. Confidence is reading as relaxed, not being perfect.</li></ol>' },
              { t: 'explain', q: 'Describe your plan for the next wedding or party when the music starts.', points: ['Start small: bounce on the beat', 'Join line dances from the back row and copy', 'Rotate a few simple moves', 'Stay relaxed and laugh off mistakes'] },
              { t: 'gen', g: 'dnFix' }
            ]
          }
        ]
      }
    ]
  });
})();
