/* MMA full guard at full depth: one complete position, bottom AND top, sport BJJ and MMA rules.
   Original lessons. Technique explanations follow standard, widely taught fundamentals (closed guard
   posture control, the hip-bump / kimura / guillotine triad, the armbar / triangle / omoplata cycle).
   Learning a move from text is step one; drill it with a coach and a partner, tap early, and let go fast. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'mma'; })[0]; if (!S) return;
  var G = window.RH_GEN = window.RH_GEN || {};
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, pool, why) { var opts = [right]; shuffle(pool).forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 4) opts.push(w); }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }

  // Opponent reaction → the textbook follow-up. Each row is [situation, answer, why].
  var REACT = [
    ['You go for the hip-bump sweep. They post their hand on the mat to stop from tipping over.', 'Kimura on the posted arm', 'The arm they posted is now away from their body. Catch the wrist, reach over for the figure-four grip.'],
    ['You go for the hip-bump sweep. They pull their arm back in and drop their head low to block it.', 'Guillotine on the lowered head', 'Head low and in front of you is guillotine position. Wrap the neck while they defend the sweep.'],
    ['You attack the kimura. They grab their own belt / thigh to lock the arm in place.', 'Hip-bump sweep or keep cranking with a better angle', 'Locking the arm keeps their weight forward and still. Bump them over; the kimura grip stays on as you come up top.'],
    ['You go for an armbar. They stack you, driving their weight forward onto your shoulders.', 'Switch to the triangle', 'Stacking pushes their head down toward your legs. Their arm is already half in: shoot the leg over the neck.'],
    ['You go for the triangle. They posture up hard and pull their head out.', 'Switch to the armbar on the trapped arm', 'When the head leaves, the arm you were holding is still extended toward you. Swing the leg over and extend the elbow.'],
    ['You go for the armbar. They rotate their thumb and pull their elbow out to the side away from your hips.', 'Roll into the omoplata', 'Their arm is escaping toward the outside, which is exactly where the omoplata (shoulder lock with your legs) catches it.'],
    ['From closed guard, they put both hands on your chest to posture up and punch.', 'Break their posture: pull with your legs and clear the arms off your chest', 'Hands on your chest = posture coming. Bring your knees to your chest to pull them forward, and knock the arms off so they fall in.'],
    ['They stand up inside your closed guard.', 'Keep the guard closed, pull them down or attack a leg; if they lift you, open and push away to stand up', 'A standing opponent can slam or pass. Either drag them back down, or open the legs and use your feet on their hips to make space and get up.'],
    ['They lean forward heavily with their arms around your body (holding you down, not striking).', 'Scissor sweep or hip-bump off their forward weight', 'Weight coming forward is fuel for sweeps. Shin across the belly, chop the knee, and roll them where their weight is going.'],
    ['They sit back on their heels with their arms reaching back, giving you space.', 'Sit up into the hip-bump sweep', 'Their weight is back and their arms aren\'t blocking you. Sit up, post a hand, drive the hip into them.'],
    ['In half guard bottom, you win the underhook on the near side.', 'Come up to your knees: back take or old-school sweep', 'The underhook is the whole game in half guard. Use it to get on your side and come up; don\'t lie flat.'],
    ['In half guard bottom, they get a crossface and flatten your shoulders to the mat.', 'Frame on the neck and hip, shrimp, and replace knee shield or full guard', 'Flat on your back with a crossface is where you get passed. Frame first, then recover space.']
  ];
  G.mgReact = function () {
    var r = pk(REACT);
    return mc('<b>Read the reaction.</b><br>' + r[0] + '<br><br>What\'s your best next move?', r[1], REACT.map(function (x) { return x[1]; }), r[2] + ' Their defense to one attack opens the next. That\'s a chain.');
  };
  var NAMES = [
    ['Shin across their belly, the other leg chops behind their knee, and you pull them over the top leg.', 'Scissor sweep'],
    ['Sit up, post a hand behind you, and drive your hip up and across to tip them over.', 'Hip-bump sweep'],
    ['Figure-four grip on their wrist, then rotate their hand up behind their back.', 'Kimura'],
    ['Leg over their head, their arm between your legs, hips up under their elbow.', 'Armbar from guard'],
    ['Legs form a figure-four around their neck with one of their arms trapped inside.', 'Triangle choke'],
    ['Their arm trapped under your leg, you turn to face away and sit up to lock their shoulder.', 'Omoplata'],
    ['Arm wrapped around their neck from the front, chest over their head, squeeze and arch.', 'Guillotine'],
    ['Hooks inside their thighs, you fall to one side and lift them with a hook.', 'Butterfly sweep'],
    ['Grip the sleeve and opposite leg, swing your leg like a pendulum to roll them over.', 'Flower (pendulum) sweep'],
    ['Post one hand and the opposite foot, lift your hips and swing the free leg back to stand.', 'Technical stand-up'],
    ['On top, you drop a knee across their thigh to the mat and slide past their legs.', 'Knee-cut pass'],
    ['On top, you grip both pant legs / shins and push them to one side, then run around.', 'Toreando pass']
  ];
  G.mgName = function () {
    var r = pk(NAMES);
    return mc('Name the technique:<br><br><b>' + r[0] + '</b>', r[1], NAMES.map(function (x) { return x[1]; }), 'Learning the names matters: coaches call them out mid-roll, and you\'ll search them to watch them done.');
  };
  var GOALS = [
    ['bottom, closed guard', 'Break posture, then sweep or submit', ['Stay flat and wait', 'Open your legs and let them pass', 'Push them away with your hands only']],
    ['bottom, closed guard in MMA, taking punches', 'Pull them close and control wrists/head, or stand up', ['Hold still and cover your face', 'Lie flat to rest', 'Throw upkicks from closed guard']],
    ['top, inside their closed guard', 'Posture up, control their hips/biceps, open the guard, pass', ['Put both hands on the mat', 'Lean forward with your head down', 'Put one arm in and one arm out']],
    ['bottom, half guard', 'Win the underhook and come up on your side', ['Lie flat and hold their leg', 'Give up the underhook for a headlock', 'Wrap both arms around their neck']],
    ['bottom, someone just passed your guard', 'Frame, shrimp, and recover guard', ['Push straight up on their chest with straight arms', 'Turn away and give your back', 'Reach for a far-side armbar']]
  ];
  G.mgGoal = function () {
    var r = pk(GOALS);
    return mc('You are <b>' + r[0] + '</b>. What\'s the priority?', r[1], r[2], 'Position before submission. Every spot on the map has a first job, and doing it first is what makes the fancy stuff work.');
  };

  var unit = {
    name: 'Full guard, complete', tag: 'BJJ · deep',
    blurb: 'One position, start to finish: posture, grips, every main sweep and submission, the chains between them, the MMA version, and how to pass it from the top.',
    lessons: [
      {
        id: 'mg-anatomy', title: 'Closed guard: posture, grips & angles', min: 10, teaser: 'The three things that decide whether your guard works at all.',
        pre: ['mma-posmap-guard'], links: ['mg-sweeps', 'mg-subs', 'mma-position-first'],
        cards: [
          { t: 'read', h: 'What you\'re actually fighting for', body: '<p>Every exchange in closed guard is a fight over three things:</p><ol><li><b>Posture.</b> If they sit tall with a straight back, they can strike and work to open your legs. If their head is pulled down near your chest, they can\'t do either well. Breaking posture is job one.</li><li><b>Grips.</b> Whoever controls the arms controls what can happen. Bottom wants a wrist, an elbow, an overhook, or the head. Top wants your hips or biceps pinned.</li><li><b>Angle.</b> Lying straight under them, almost nothing works. Most attacks from guard need you to shift your hips off to one side (cut an angle) first.</li></ol>', mem: 'Posture, grips, angle. Win them in that order.' },
          { t: 'read', h: 'Breaking posture', body: '<ul><li><b>Pull with your legs</b>: bring your knees toward your chest while your ankles are crossed. Their hips come forward and their balance tips toward you.</li><li><b>Knock the arms off</b>: if their hands are on your chest or belly, sweep them off as you pull, so they have nothing to post on and fall in.</li><li><b>Hold them there</b>: an overhook (your arm over their arm, clamped to your side) plus a hand behind the head, or both hands controlling the head.</li></ul><p>Then you can open your ankles to attack without them sitting back up.</p>',
            simple: '<p>Squeeze your knees to your chest so they fall toward you. Swipe their hands off your body. Hug their head or arm so they stay down.</p>' },
          { t: 'read', h: 'Grips that matter (no-gi and MMA)', body: '<ul><li><b>Wrist control</b>: one or two hands on a wrist. A controlled wrist can\'t punch or post.</li><li><b>Overhook</b>: arm over theirs, clamped tight. Shuts down that arm and sets up triangles and omoplatas.</li><li><b>Two-on-one</b>: both your hands on one of their arms. Great for arm drags to the back.</li><li><b>Head control</b>: a hand on the back of the head pulling down. Keeps posture broken.</li></ul><p>In a gi, add collar and sleeve grips. Same goals, more handles.</p>',
            deeper: '<p><b>Hip escaping on your back</b> is the engine underneath everything. To cut an angle, put a foot on their hip, push, and move your hips to the side, like a shrimp. A good guard player is constantly adjusting the angle, not lying still. Watch good guard players and notice they almost never stay square.</p>' },
          { t: 'order', q: 'Order the start of a closed guard attack.', items: ['Pull them in with your legs and knock their hands off your body', 'Secure a grip: overhook, wrist, or head', 'Hip out to cut an angle', 'Open the guard and attack'], why: 'Posture, grip, angle, then attack. Opening your legs before the first three is how you get passed.' },
          { t: 'gen', g: 'mgGoal' },
          { t: 'explain', q: 'Explain the three things you fight for in closed guard and why order matters.', points: ['Posture: break it so they can\'t strike or open your legs', 'Grips: control their arms or head', 'Angle: hip out to the side before attacking', 'Attacking before posture and grips are won gets you passed or punched'] }
        ]
      },
      {
        id: 'mg-sweeps', title: 'Sweeps: scissor, hip-bump & flower', min: 11, teaser: 'Use their weight against them and come up on top.',
        pre: ['mg-anatomy'], links: ['mma-hipbump', 'mg-chains', 'mma-posmap-mount'],
        cards: [
          { t: 'read', h: 'Which sweep when', body: '<p>Sweeps work by moving their weight where it\'s already going. Read where their weight is:</p><ul><li>Weight <b>back</b> (sitting on heels, arms reaching back) → <b>hip-bump</b>. Sit up into them.</li><li>Weight <b>forward</b> (leaning in, hands on you or the mat) → <b>scissor</b>. Roll them over your shin.</li><li>Weight <b>low, on their knees</b>, and you control an arm → <b>flower / pendulum</b>. Remove the post and swing.</li></ul>', mem: 'Weight back → hip-bump. Weight forward → scissor. Arm trapped on knees → flower.' },
          { t: 'read', h: 'Scissor sweep, step by step', body: '<ol><li>Open your guard and get a grip on their collar/neck and the same-side sleeve or wrist (in no-gi: wrist plus an overhook or a hand behind the neck).</li><li>Hip out slightly to the side of the arm you\'re holding.</li><li>Slide that knee across their belly, shin horizontal, foot hooked on their far hip.</li><li>Your bottom leg goes flat on the mat behind their knee.</li><li>Pull them forward onto the top shin while you chop the bottom leg back into their knee. They fall like scissors closing.</li><li>Follow them over and land in mount.</li></ol><p>The pull is what makes it work. Without the pull forward, you\'re just kicking.</p>' },
          { t: 'read', h: 'Flower (pendulum) sweep', body: '<ol><li>From closed guard, control their arm on one side (cross-grip the sleeve or overhook the wrist).</li><li>Reach your other arm under their leg on that same side, hooking behind the knee.</li><li>Open your legs, swing the leg on the free side wide and down like a pendulum to build momentum.</li><li>As you swing, kick the other leg up into their armpit side and lift the leg you\'re holding.</li><li>They tip toward the side with no arm to post. Roll up into mount.</li></ol><p>The secret: the arm you control is the arm they\'d need to stop the fall.</p>' },
          { t: 'order', q: 'Order the scissor sweep.', items: ['Grip their neck and same-side wrist', 'Hip out toward the side you\'re gripping', 'Knee shield across their belly, bottom leg behind their knee', 'Pull them forward and chop the bottom leg', 'Follow over into mount'], why: 'Grips, angle, leg placement, then the pull + chop together.' },
          { t: 'widget', w: 'posmap', o: { start: 'guard', who: 'bottom', goal: 'mount' }, h: 'Sweep your way to mount', fallback: '<p>On the position map, start in Closed guard as the bottom player and pick a sweep that lands you in Mount.</p>' },
          { t: 'gen', g: 'mgName' }, { t: 'gen', g: 'mgReact' },
          { t: 'explain', q: 'Explain how you decide which sweep to use from closed guard.', points: ['Read where their weight is', 'Weight back: hip-bump', 'Weight forward: scissor', 'Control the arm they\'d use to post'] }
        ]
      },
      {
        id: 'mg-subs', title: 'Submissions: armbar, kimura, guillotine, omoplata', min: 13, teaser: 'The four finishes every guard player needs, with the mistakes that kill them.',
        pre: ['mg-anatomy'], links: ['mma-triangle', 'mg-chains', 'mma-position-first'],
        cards: [
          { t: 'read', h: 'Safety first', body: '<p>Joint locks injure fast because the joint gives before the pain warns you. Rules every gym uses:</p><ul><li>Apply submissions <b>slowly</b> in training. The goal is the tap, not the break.</li><li><b>Tap early</b>, with your hand on them or the mat, or say "tap." Don\'t wait for pain.</li><li>When your partner taps, <b>let go immediately</b>.</li><li>Learn these with a qualified coach before using them in sparring.</li></ul>', mem: 'Slow on, fast off. Tap early.' },
          { t: 'read', h: 'Armbar from guard', body: '<ol><li>Control one arm across your chest (two-on-one or holding the wrist to your chest).</li><li>Put the foot on the same side as that arm on their hip, and hip out to that side so you\'re at an angle.</li><li>Swing your other leg over their head, heel pulling down.</li><li>Pinch your knees together, keep their thumb pointing up, and lift your hips under their elbow.</li></ol><p><b>Common mistakes</b>: staying square (no angle, so no room for the leg), letting the knees open (they pull the elbow out), and the thumb facing sideways (the elbow isn\'t straight across your hips).</p>' },
          { t: 'read', h: 'Kimura from guard', body: '<ol><li>When they post a hand on the mat (often to block a sweep), grab that wrist with your same-side hand.</li><li>Sit up, reach over their shoulder with your other arm, and grip your own wrist: the <b>figure-four</b>.</li><li>Fall back to the side, hip out, and throw a leg over their back so they can\'t roll out.</li><li>Keep their elbow bent at 90° and slowly rotate the hand up toward their head, away from their back.</li></ol>' },
          { t: 'read', h: 'Guillotine and omoplata', body: '<p><b>Guillotine</b>: when their head drops in front of you (common when they shoot a takedown or defend a sweep), wrap your arm around the neck so your forearm bone is under the throat side, grip your hands, close your guard, and arch your back while pulling up. Most common finish in MMA from guard.</p><p><b>Omoplata</b>: when an arm is caught with your leg over it (often when they pull out of an armbar), turn away from them, swing your hips out, sit up facing their legs, and lean forward to lock the shoulder. Even when it doesn\'t finish, it often sweeps them.</p>',
            deeper: '<p>Guillotine variations: the <b>arm-in</b> (one of their arms trapped with the head) is easier to lock; the <b>high-elbow</b> lifts your elbow high and rotates for a tighter choke. If they pass to the side while you hold a guillotine, the choke usually dies. Close the guard or switch to a sweep.</p>' },
          { t: 'mcq', q: 'During an armbar from guard, which way should their thumb point?', opts: ['Toward the mat', 'Up toward the ceiling', 'Toward their own face', 'It doesn\'t matter'], a: 1, why: 'Thumb up lines their elbow across your hips. If the thumb turns, the elbow rotates out of the lock.' },
          { t: 'mcq', q: 'What do you grip to make the kimura figure-four?', opts: ['Both of their wrists', 'Their wrist with one hand, your own wrist with the other', 'Their neck and wrist', 'Your own belt'], a: 1, why: 'One hand on their wrist, your other arm comes over their shoulder and grips your own wrist. That frame is the figure-four.' },
          { t: 'gen', g: 'mgName' },
          { t: 'explain', q: 'Explain the armbar from guard and the two mistakes that make it fail.', points: ['Control one arm and hip out to an angle', 'Swing the leg over the head and pinch knees', 'Thumb up, lift hips under the elbow', 'Mistakes: staying square, knees open (or thumb turned)'] }
        ]
      },
      {
        id: 'mg-chains', title: 'Chains: their defense is your next attack', min: 10, teaser: 'The two classic loops, and how to read reactions.',
        pre: ['mg-sweeps', 'mg-subs'], links: ['mma-hipbump', 'mma-triangle'],
        cards: [
          { t: 'read', h: 'Loop 1: hip-bump → kimura → guillotine', body: '<p>Sit up for the hip-bump sweep. They have three choices, and each opens something:</p><ul><li>They don\'t defend → you sweep to <b>mount</b>.</li><li>They post a hand → <b>kimura</b> that arm.</li><li>They pull the arm in and drop the head → <b>guillotine</b>.</li></ul><p>And if they fight the kimura by locking their arm, their weight stays still and forward, so the hip-bump comes back. It\'s a loop.</p>', mem: 'Sit up: sweep, kimura, or guillotine. They choose.' },
          { t: 'read', h: 'Loop 2: armbar → triangle → omoplata', body: '<ul><li>Attack the <b>armbar</b>. If they stack you or bring their head down to defend, their arm is half inside your legs → <b>triangle</b>.</li><li>Attack the <b>triangle</b>. If they posture up and pull their head out, the arm stays extended → back to <b>armbar</b>.</li><li>If they pull the elbow out to the side to escape the armbar → <b>omoplata</b>.</li></ul><p>Drill these as one movement, not three moves. That\'s what makes a guard dangerous.</p>' },
          { t: 'pbq', h: 'Build the chain', scenario: 'For each reaction, choose your follow-up.', opts: ['Sweep to mount', 'Kimura', 'Guillotine', 'Triangle', 'Armbar', 'Omoplata'],
            rows: [
              { label: 'Hip-bump: they don\'t defend', a: 0 },
              { label: 'Hip-bump: they post a hand on the mat', a: 1 },
              { label: 'Hip-bump: they drop their head low', a: 2 },
              { label: 'Armbar: they stack you, head comes down', a: 3 },
              { label: 'Triangle: they posture up and pull the head out', a: 4 },
              { label: 'Armbar: they pull the elbow out to the side', a: 5 }
            ], why: 'Two loops: sweep/kimura/guillotine off the sit-up, and armbar/triangle/omoplata off arm control. Every defense opens the next attack.' },
          { t: 'gen', g: 'mgReact' }, { t: 'gen', g: 'mgReact' }, { t: 'gen', g: 'mgReact' },
          { t: 'explain', q: 'Explain the armbar / triangle / omoplata loop in your own words.', points: ['Armbar: if they stack and bring the head down, switch to triangle', 'Triangle: if they posture up and pull out, switch to armbar', 'Armbar: if they pull the elbow out to the side, roll to omoplata', 'Each defense creates the next opening'] }
        ]
      },
      {
        id: 'mg-open', title: 'Open guard, half guard & guard retention', min: 11, teaser: 'When closed guard opens: butterfly, knee shield, and not getting passed.',
        pre: ['mg-anatomy'], links: ['mg-mma', 'mma-posmap-guard'],
        cards: [
          { t: 'read', h: 'Butterfly guard', body: '<p>You\'re sitting up, both feet hooked inside their thighs (the "butterflies"), chest close, with an underhook or head control. Your goal is to <b>off-balance them sideways</b>: fall to one side, lift with the hook on that side, and roll them over. Butterfly is also one of the best guards for getting back to your feet in MMA, because you\'re already sitting up.</p>' },
          { t: 'read', h: 'Half guard bottom', body: '<p>You trap one of their legs between yours. Two ways to play it:</p><ul><li><b>Knee shield</b>: your top knee across their chest or belly as a frame, keeping distance. Good in MMA because it blocks them from flattening you.</li><li><b>Underhook half</b>: get on your side, get your near arm under their armpit (the underhook), head tucked to their chest. From there come up to your knees for a back take or the old-school sweep.</li></ul><p>The worst place in half guard is <b>flat on your back with a crossface</b> (their shoulder on your jaw, turning your head away). That\'s where you get passed.</p>', mem: 'Half guard: on your side, underhook, never flat.' },
          { t: 'read', h: 'Guard retention', body: '<p>When they\'re passing, you\'re trying to get a knee or foot back between you and them. The tools:</p><ul><li><b>Frames</b>: forearm on their neck/collarbone, other hand on their hip. Bone structure, not pushing with straight arms.</li><li><b>Shrimp</b> (hip escape): turn on your side, push off your foot, and move your hips away to make space.</li><li><b>Recover</b>: once there\'s space, put a knee back in (knee shield or full guard).</li></ul><p>Straight-arm pushing is a beginner tell: it\'s weak and it gives them an armbar.</p>' },
          { t: 'widget', w: 'posmap', o: { start: 'halfguard', who: 'bottom' }, h: 'Explore half guard', fallback: '<p>On the position map, open Half guard as the bottom player. Note the three ways out: underhook to the back, old-school sweep, or recover full guard.</p>' },
          { t: 'mcq', q: 'In half guard bottom, what\'s the most important thing to win?', opts: ['A headlock', 'The underhook on the near side', 'A lapel grip', 'Lying flat for base'], a: 1, why: 'The underhook lets you get on your side and come up. Losing it usually means a crossface and getting flattened.' },
          { t: 'gen', g: 'mgGoal' },
          { t: 'explain', q: 'Explain how to stop someone from passing your guard.', points: ['Frame with forearms on neck and hip, not straight arms', 'Shrimp (hip escape) to make space', 'Get a knee or foot back in between', 'Don\'t lie flat; stay on your side'] }
        ]
      },
      {
        id: 'mg-mma', title: 'Guard in MMA: strikes, the cage & getting up', min: 10, teaser: 'Why guard is a different position when they can punch.',
        pre: ['mg-open'], links: ['mma-ground-pound', 'mma-ranges'],
        cards: [
          { t: 'read', h: 'What changes', body: '<ul><li>Top can <b>punch and elbow</b>, so distance is dangerous. Either pull them close (no room to swing) or push them far (out of range). The middle is where you get hit.</li><li>Judges usually score the top position and damage, so <b>holding guard and doing nothing loses rounds</b>.</li><li>The cage lets you <b>wall walk</b>: shoulders against the fence, you can climb back to your feet.</li><li>Many good grapplers in MMA treat guard as a <b>place to escape from</b>, not a place to live, unless a submission is right there.</li></ul>', mem: 'In MMA: close or far, never in the middle.' },
          { t: 'read', h: 'Defensive closed guard', body: '<p>When they\'re trying to posture and strike: break posture (knees in), control a wrist and the back of the head, keep them tight. When they lift to punch, kick your hips up to keep them off balance. If they create space, put your feet on their hips and push to full distance, then stand up.</p>' },
          { t: 'read', h: 'Getting up: technical stand-up and wall walk', body: '<p><b>Technical stand-up</b>: sit up, post one hand behind you and the opposite foot flat, lift your hips, swing the free leg back underneath, and stand with your hands up. Never stand straight up facing them with your head forward.</p><p><b>Wall walk</b>: back flat on the cage, both feet planted, drive your shoulders up the fence, fight for an underhook, then turn and circle off.</p>' },
          { t: 'order', q: 'Order the technical stand-up.', items: ['Sit up and post one hand behind you', 'Plant the opposite foot flat', 'Lift your hips off the mat', 'Swing the free leg back underneath you', 'Stand with your hands up, in your stance'], why: 'Base, lift, swing back, stance. You stay balanced and out of their range the whole time.' },
          { t: 'widget', w: 'posmap', o: { start: 'guard', who: 'bottom', goal: 'standing' }, h: 'Get back to your feet', fallback: '<p>On the position map, start in Closed guard bottom and find the move that takes you to Standing.</p>' },
          { t: 'tf', q: 'In MMA, holding someone in closed guard without attacking usually wins you the round.', a: false, why: 'Judges tend to reward the top fighter for control and damage. From guard you need to sweep, submit, or get up.' },
          { t: 'explain', q: 'Explain how your guard plan changes in MMA compared to sport BJJ.', points: ['Opponent can strike, so stay close or far, not mid-range', 'Break posture and control wrists/head to stop strikes', 'Doing nothing from bottom loses rounds', 'Use the technical stand-up or wall walk to get up'] }
        ]
      },
      {
        id: 'mg-top', title: 'Top: surviving and passing the guard', min: 12, teaser: 'The other side: posture, opening the legs, passing, and not getting triangled.',
        pre: ['mg-chains'], links: ['mma-posmap-mount', 'mma-ground-pound'],
        cards: [
          { t: 'read', h: 'Posture in their guard', body: '<ul><li><b>Head up, back straight</b>, hips forward. Your head is the steering wheel; if it\'s pulled down, you\'re in their game.</li><li><b>Hands on their hips or biceps</b>, pinning them. Hands on their chest set up armbars.</li><li><b>Elbows tight</b> to your body.</li><li><b>Never one arm in, one arm out</b>. That\'s the triangle position. Keep both arms in or both out.</li></ul>', mem: 'Head up, hands on hips, both arms in or both out.' },
          { t: 'read', h: 'Opening and passing', body: '<p><b>Opening closed guard</b>: posture up, then either stand up (which uses gravity to open the legs) or, on your knees, put an elbow or knee into their tailbone area and stretch back.</p><p><b>Passes once it\'s open</b>:</p><ul><li><b>Knee cut (knee slice)</b>: drive your knee across their thigh to the mat, crossface, and slide through to side control.</li><li><b>Toreando</b>: grab both shins/pants, push the legs to one side, and step around to the other.</li><li><b>Stack pass</b>: get an arm under one leg, drive their knees toward their head, and walk around.</li></ul><p>In MMA, strikes help pass: punches make them defend with their arms instead of their legs.</p>' },
          { t: 'read', h: 'Defending their attacks', body: '<ul><li><b>Armbar</b>: before it\'s locked, stack them (drive your weight forward over their head) and pull your elbow back to your ribs. If it\'s locked, tap.</li><li><b>Triangle</b>: posture up immediately and get the trapped arm back in. Once it\'s fully locked and angled, tap.</li><li><b>Guillotine</b>: protect the neck by keeping your head up; if caught, pass to the side of the trapped arm to loosen it, but tap if it\'s tight.</li><li><b>Sweeps</b>: keep a wide base, and don\'t leave a hand posted far from your body (that\'s a kimura).</li></ul>' },
          { t: 'widget', w: 'posmap', o: { start: 'guard', who: 'top', goal: 'side' }, h: 'Pass to side control', fallback: '<p>On the position map, switch to the top player in Closed guard and find the pass that lands you in Side control.</p>' },
          { t: 'mcq', q: 'You\'re on top in closed guard. Which arm position is most dangerous for you?', opts: ['Both hands on their hips', 'One arm inside their legs, one arm outside', 'Both elbows tight', 'Both arms outside'], a: 1, why: 'One in, one out is exactly the triangle setup.' },
          { t: 'mcq', q: 'What\'s the simplest way to open a locked closed guard?', opts: ['Punch their legs', 'Posture up and stand, letting gravity open their legs', 'Lean forward and wait', 'Grab their head'], a: 1, why: 'Standing in posture makes it hard to keep the ankles locked. On the knees, use an elbow or knee near the tailbone and stretch back.' },
          { t: 'gen', g: 'mgGoal' },
          { t: 'explain', q: 'Explain how to safely pass someone\'s closed guard.', points: ['Posture: head up, back straight, hands on hips/biceps', 'Never one arm in and one out (triangle)', 'Open the guard by standing or tailbone pressure', 'Pass with knee cut, toreando, or stack to side control'] }
        ]
      },
      {
        id: 'mg-plan', title: 'Drilling plan & solo work', min: 8, teaser: 'How to actually get good at guard, at the gym and at home.',
        pre: ['mg-top'], links: ['mma-position-first'],
        cards: [
          { t: 'read', h: 'How skills stick', body: '<ul><li><b>Drill</b> a technique with a cooperative partner: 10–20 clean reps per side.</li><li><b>Add resistance</b> gradually: partner gives 25%, then 50%.</li><li><b>Positional sparring</b>: start in closed guard, bottom tries to sweep or submit, top tries to pass. Restart on success. This is where moves become real.</li><li><b>Pick one chain per month</b>. Trying 20 moves at once means owning none.</li></ul>' },
          { t: 'read', h: 'Solo drills (no partner, 10 minutes)', body: '<ul><li><b>Shrimps</b> down and back across the room, both sides.</li><li><b>Bridges</b>: upa bridges over each shoulder.</li><li><b>Technical stand-ups</b>: 10 per side.</li><li><b>Hip-ups</b>: sit up, post, lift the hips (the hip-bump motion).</li><li><b>Granby rolls and sit-outs</b> once you\'ve been shown them.</li></ul><p>These build the hip movement that every guard technique runs on.</p>' },
          { t: 'read', h: 'Finding a gym', body: '<p>Look for a gym with a fundamentals or beginner class, coaches who supervise rolling, and partners who tap and release. Most offer a free trial class. Watch a class first: good gyms are controlled, not a fight club. Tell the coach you\'re new so they pair you with experienced, careful partners.</p>' },
          { t: 'explain', q: 'Lay out a month-long plan to get good at the hip-bump / kimura / guillotine chain.', points: ['Drill each piece with a cooperative partner, both sides', 'Add resistance gradually', 'Positional sparring from closed guard', 'Solo hip-ups, shrimps and stand-ups at home'] },
          { t: 'gen', g: 'mgName' }
        ]
      }
    ]
  };
  var at = -1; S.units.forEach(function (u, i) { if (u.name === 'The grappling map') at = i; });
  S.units.splice(at < 0 ? S.units.length : at + 1, 0, unit);
})();
/* Position pictures (shell's FightArt) at the top of each position lesson. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'mma'; })[0]; if (!S) return;
  var ART = {
    'mma-ranges': ['standing', 'top', 'Both fighters standing: striking range.'],
    'mma-stance': ['standing', 'top', 'Fighting stance: feet staggered, hands up.'],
    'mma-posmap-guard': ['guard', 'bottom', 'Closed guard: you\'re on bottom, legs locked around their waist.'],
    'mma-posmap-mount': ['mount', 'top', 'Mount: you\'re sitting on their torso.'],
    'mma-ground-pound': ['mount', 'top', 'Mount is the best ground-and-pound position.'],
    'mg-anatomy': ['guard', 'bottom', 'Closed guard from the bottom.'],
    'mg-open': ['halfguard', 'bottom', 'Half guard: one of their legs trapped between yours.'],
    'mg-mma': ['cage', 'bottom', 'Against the cage: where the wall walk happens.'],
    'mg-top': ['guard', 'top', 'You\'re on top, inside their closed guard.']
  };
  S.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var a = ART[l.id]; if (!a || l.cards.some(function (c) { return c.t === 'art'; })) return;
    l.cards.splice(1, 0, { t: 'art', pose: a[0], o: { you: a[1] }, h: 'See it', cap: a[2], fallback: '<p>' + a[2] + '</p>' });
  }); });
})();
/* Step-by-step technique frames (shell's frames widget). */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'mma'; })[0]; if (!S) return;
  var FR = {
    'mma-hipbump': [['hipbump', 'Hip-bump sweep → kimura, frame by frame']],
    'mma-triangle': [['triangle', 'Triangle, frame by frame']],
    'mg-sweeps': [['scissor', 'Scissor sweep, frame by frame'], ['hipbump', 'Hip-bump sweep → kimura, frame by frame']],
    'mg-subs': [['armbar', 'Armbar from guard, frame by frame']],
    'mg-mma': [['standup', 'Technical stand-up, frame by frame']],
    'mg-top': [['kneecut', 'Knee-cut pass, frame by frame']]
  };
  S.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var list = FR[l.id]; if (!list) return;
    var at = 0; l.cards.forEach(function (c, i) { if (c.t === 'read' || c.t === 'art') at = i + 1; });
    list.slice().reverse().forEach(function (f) {
      if (l.cards.some(function (c) { return c.t === 'widget' && c.o && c.o.seq === f[0]; })) return;
      l.cards.splice(at, 0, { t: 'widget', w: 'frames', o: { seq: f[0] }, h: f[1], fallback: '<p>Step through this technique in the app to see each frame. Then drill it slowly with a partner and a coach.</p>' });
    });
  }); });
})();
/* Second frames batch. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'mma'; })[0]; if (!S) return;
  var FR = {
    'mg-subs': [['guillotine', 'Guillotine, frame by frame'], ['kimura', 'Kimura, frame by frame']],
    'mma-posmap-mount': [['elbowknee', 'If you\'re the one mounted: elbow-knee escape'], ['upa', 'If you\'re the one mounted: upa (bridge and roll)']],
    'mma-ranges': [['double', 'Double-leg takedown, frame by frame']],
    'mma-combos': [['onetwothree', 'Jab-cross-hook, frame by frame']],
    'mma-position-first': [['rnc', 'Back control finish: rear-naked choke']]
  };
  S.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var list = FR[l.id]; if (!list) return;
    var at = 0; l.cards.forEach(function (c, i) { if (c.t === 'read' || c.t === 'art' || (c.t === 'widget' && c.w === 'frames')) at = i + 1; });
    list.slice().reverse().forEach(function (f) {
      if (l.cards.some(function (c) { return c.t === 'widget' && c.o && c.o.seq === f[0]; })) return;
      l.cards.splice(at, 0, { t: 'widget', w: 'frames', o: { seq: f[0] }, h: f[1], fallback: '<p>Step through this technique in the app. Then drill it slowly with a partner and a coach.</p>' });
    });
  }); });
})();
