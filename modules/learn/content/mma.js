/* MMA / grappling / striking — built from nate's interconnected-position-map concept.
   The rabbit-hole engine IS the knowledge map: every position links to the positions it leads to. */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Body & skills',
    id: 'mma',
    name: 'MMA & Grappling',
    mark: '🥋',
    color: '#ff7f7f',
    blurb: 'A connected map of every position.',
    intro: "Not a list of random moves — a map. Each position shows where you can go and what the opponent might do, and the purple links jump you straight there. Training companion, not a replacement for a real coach. Start light, tap the mat.",
    units: [
      {
        name: 'Fight IQ first',
        blurb: 'The ideas that make every technique make sense. Ten minutes here and the rest stops being a blur of names.',
        lessons: [
          {
            id: 'mma-ranges', title: 'The four ranges', min: 5, teaser: 'Every exchange lives in one of four distances.',
            links: ['mma-posmap-guard', 'mma-stance', 'mma-position-first'],
            cards: [
              { t: 'read', h: 'Distance decides everything', body: '<p>A fight isn\'t chaos. At any instant you\'re in one of four <b>ranges</b>, and each has its own tools:</p><ul><li><b>Kicking range</b> — far out. Legs reach, hands don\'t.</li><li><b>Punching (boxing) range</b> — hands land. Most knockouts live here.</li><li><b>Clinch</b> — chest to chest. Knees, elbows, takedowns, control.</li><li><b>Ground</b> — grappling. Positions, sweeps, submissions.</li></ul><p>A huge part of skill is <b>controlling which range you fight in</b> — forcing the fight where you\'re strong and your opponent isn\'t. A striker wants it standing; a grappler wants it on the mat.</p>', mem: 'Far to close: Kick → Punch → Clinch → Ground. Win the range, win the fight.' },
              { t: 'order', q: 'Order the ranges from farthest to closest.', items: ['Kicking range', 'Punching range', 'Clinch', 'Ground'], why: 'As distance closes, longer weapons (legs) give way to shorter ones (hands, then knees/elbows, then grappling). A good fighter chains them: kick to set up the punch, punch to set up the clinch, clinch to the takedown.' },
              { t: 'mcq', q: 'A pure boxer is fighting a wrestler. Where does the boxer most want to keep the fight?', opts: ['The ground', 'The clinch', 'Punching range', 'Against the cage'], a: 2, why: 'The boxer\'s whole game is in punching range. The wrestler wants to close distance, clinch, and drag it to the ground. Range control is the core matchup battle.' },
              { t: 'tf', q: 'A fighter who is losing the striking exchanges might shoot for a takedown to change the range and reset the fight.', a: true, why: 'Changing ranges is a tactic, not a retreat. If you\'re getting outstruck, dragging it to the clinch or ground takes your opponent out of their comfort zone.' }
            ]
          },
          {
            id: 'mma-position-first', title: 'Position before submission', min: 5, teaser: 'The golden rule of grappling, and why it wins fights.',
            links: ['mma-posmap-guard', 'mma-ranges'],
            cards: [
              { t: 'read', h: 'The hierarchy', body: '<p>Grappling has a scoreboard even when there\'s no scoreboard. Positions rank from worst to best for you:</p><ol><li><b>Submitted / mounted-under</b> — worst. You\'re being controlled or finished.</li><li><b>Guard bottom</b> — you\'re underneath but your legs control the opponent. Defensible.</li><li><b>Neutral / half guard</b></li><li><b>Side control, mount, back</b> — dominant. You control them.</li></ol><p>The rule: <b>improve your position before you hunt a submission.</b> Chasing a submission from a bad spot usually just gives up position. Secure the dominant spot first; the finish comes easier and safer from there.</p>', mem: 'Position before submission. Climb the ladder: guard → side control → mount → back. The back is the throne.' },
              { t: 'order', q: 'Rank these from LEAST to MOST dominant (for the top person).', items: ['Being in the opponent\'s full guard', 'Half guard top', 'Side control', 'Full mount', 'Back control'], why: 'In someone\'s guard you\'re controlled by their legs. Passing to half guard, then side control, then mount, then the back is the climb. Back control is the most dominant — you see them, they can\'t see you.' },
              { t: 'mcq', q: 'You have a shaky armbar attempt from a weak position. Your opponent is defending and about to escape. Best choice?', opts: ['Crank harder and hope', 'Abandon it and secure a dominant position first', 'Let them up', 'Close your eyes'], a: 1, why: 'Position before submission. A forced submission from a bad spot usually fails AND costs you position. Reset to dominance, then finish clean.' },
              { t: 'tf', q: 'Back control is considered the most dominant position because you can attack while the opponent can\'t see your hands.', a: true, why: 'On the back, you have chokes and strikes available, your opponent is facing away, and escapes are hard. It\'s the throne of grappling.' }
            ]
          },
          {
            id: 'mma-stance', title: 'Stance & the shell', min: 5, teaser: 'Orthodox, southpaw, and how fighters hide behind their guard.',
            links: ['mma-ranges', 'mma-combos'],
            cards: [
              { t: 'read', h: 'Which foot forward', body: '<p>Your <b>stance</b> is your default fighting posture. The basics:</p><ul><li><b>Orthodox</b> — left foot forward (for right-handers). The jab is the lead left; the power cross is the rear right.</li><li><b>Southpaw</b> — right foot forward (lefties, or trained switch). Mirror image.</li></ul><p>When orthodox meets southpaw it\'s an <b>open stance</b> matchup — lead feet on the same side, which changes every angle and makes the lead hook and rear straight huge.</p>', mem: 'Orthodox = left foot lead, jab with the lead hand, power with the rear.' },
              { t: 'read', h: 'Guards: where you hide', body: '<ul><li><b>High guard</b> — hands up by the temples. Safe, textbook, slightly slower to counter.</li><li><b>Philly shell</b> — lead hand low across the body, rear hand on the chin, shoulder shrugged to block. Great for slick counter-punchers (think Mayweather), risky for beginners.</li><li><b>Peek-a-boo</b> — gloves tight on the cheeks, lots of head movement (Tyson\'s style). Aggressive, gets you inside.</li></ul>' },
              { t: 'match', q: 'Match the guard to its idea.', pairs: [['High guard', 'Safe, hands by temples'], ['Philly shell', 'Lead low, shoulder defense, counters'], ['Peek-a-boo', 'Tight gloves, head movement, pressure']], why: 'Each guard trades offense, defense, and counter potential differently. Beginners start with the high guard for a reason.' },
              { t: 'mcq', q: 'In an orthodox vs orthodox matchup, your "jab" comes from which hand?', opts: ['Rear (right)', 'Lead (left)', 'Both equally', 'Neither'], a: 1, why: 'The jab is the lead-hand straight — fast, used to measure distance and set up the power cross from the rear hand.' }
            ]
          }
        ]
      },
      {
        name: 'The grappling map',
        tag: 'BJJ',
        blurb: 'Tap a position to see every path in and out. This is the interconnected map — follow a thread as far as you want.',
        lessons: [
          {
            id: 'mma-posmap-guard', title: 'Full Guard (bottom)', min: 8, teaser: 'You\'re on your back, legs wrapped around them. Far from helpless.',
            links: ['mma-hipbump', 'mma-triangle', 'mma-posmap-mount', 'mma-position-first'],
            cards: [
              { t: 'read', h: 'Where you are', body: '<p>You\'re on your back. Your legs are wrapped around the opponent\'s waist, ankles crossed behind them — that\'s <b>full guard</b>. In sport BJJ this is a neutral, even comfortable spot. In MMA it\'s more dangerous (they can punch down), so the rules shift a little.</p><p><b>Your goals from here, in order:</b></p><ol><li><b>Control their posture</b> — break them down so they can\'t posture up and strike or pass.</li><li><b>Sweep</b> — reverse the position and get on top.</li><li><b>Submit</b> — armbar, triangle, kimura, guillotine.</li></ol>', mem: 'Full guard bottom: posture control FIRST, then sweep or submit. Never let them stand tall over you.' },
              {
                t: 'posmap', center: 'Full Guard (you on bottom)',
                intro: 'Tap each path to see what it is and where it leads. This is the map — every arrow is a real decision.',
                paths: [
                  { label: 'Hip-bump sweep', kind: 'sweep', to: 'If it lands → you end up in Mount (top). If they post their arm to stop it → switch to the Kimura.', hole: 'mma-hipbump' },
                  { label: 'Scissor sweep', kind: 'sweep', to: 'Classic sweep using a shin across the belly + a knee chop. Lands you in Mount or side control.', hole: 'mma-hipbump' },
                  { label: 'Triangle choke', kind: 'submission', to: 'Trap one arm in, one arm out, legs form a triangle on the neck. A finish from your back.', hole: 'mma-triangle' },
                  { label: 'Armbar', kind: 'submission', to: 'Isolate an arm, swing a leg over the head, extend the elbow. High-percentage from guard.', hole: 'mma-triangle' },
                  { label: 'Kimura', kind: 'submission', to: 'Shoulder lock. Often the answer when they post an arm to defend a sweep.', hole: 'mma-hipbump' },
                  { label: 'They pass your guard', kind: 'danger', to: 'If they clear your legs you lose the position → you\'re now defending Side Control or Mount bottom.', hole: 'mma-posmap-mount' },
                  { label: 'Technical stand-up', kind: 'escape', to: 'Push off, post a hand, stand back up safely to reset the fight on the feet.', hole: 'mma-ranges' }
                ]
              },
              { t: 'mcq', q: 'From full guard bottom, what should you almost always secure BEFORE attacking?', opts: ['A submission', 'Control of their posture (break them down)', 'A stand-up', 'Nothing, just swing'], a: 1, why: 'If they posture up tall, they can strike and start passing. Break their posture first — then sweeps and subs open up.' },
              { t: 'mcq', q: 'You go for a hip-bump sweep and they post their arm out to base and stop it. The textbook answer?', opts: ['Give up', 'Switch to the kimura on that posted arm', 'Try the exact same sweep again', 'Stand up'], a: 1, why: 'The arm they posted to stop the sweep is right there to be attacked — that\'s the classic hip-bump → kimura chain. Their defense becomes your next attack.' },
              { t: 'tf', q: 'Full guard is more dangerous for the bottom player in MMA than in sport BJJ.', a: true, why: 'In MMA the top player can rain down punches and elbows ("ground and pound"), so the bottom player must be more active — control posture, threaten constantly, or stand up.' }
            ]
          },
          {
            id: 'mma-hipbump', title: 'Hip-bump sweep → Kimura', min: 6, teaser: 'One motion, two outcomes, depending on what they give you.',
            links: ['mma-posmap-guard', 'mma-posmap-mount'],
            cards: [
              { t: 'read', h: 'The branch', body: '<p>This is the clearest example of the map\'s logic: <b>one setup, two finishes, and the opponent chooses which.</b></p><p>From full guard you sit up and drive your hip into them to tip them over (the sweep). Two things can happen:</p><ul><li>They <b>don\'t</b> defend → the sweep lands, you come up on top in <b>mount</b>.</li><li>They <b>post an arm</b> to stop from falling → that arm is now trapped and exposed → you attack the <b>kimura</b> (shoulder lock).</li></ul><p>You don\'t pick — <i>they</i> pick, by how they react. You just read it and take the open door.</p>' },
              { t: 'order', q: 'Order the hip-bump sweep steps.', items: ['Break their posture and sit up toward them', 'Hook over their shoulder / swim your arm', 'Post your free hand behind you for base', 'Bump your hips up and across to tip them over'], why: 'Sit up, connect, base behind you, then drive the hip across. If they fall, you follow up into mount. If they resist by posting, you flow to the kimura instead.' },
              { t: 'mcq', q: 'A successful hip-bump sweep lands you in which position?', opts: ['Back control', 'Mount (top)', 'Their guard', 'Standing'], a: 1, why: 'You tip them over and ride up into mount — a huge upgrade from being on bottom. This is "improving position" in action.' },
              { t: 'deep', h: 'Why chains beat single moves', teaser: 'The real secret of high-level grappling.', hole: 'mma-posmap-guard', body: '<p>Beginners learn moves as isolated tricks. Black belts learn <b>chains</b>: if A fails because they defend it <i>this</i> way, their defense opens B; if they defend B, that opens C. You\'re never stuck, because their every reaction creates the next attack.</p><p>The hip-bump → kimura → guillotine chain is a perfect starter chain. Once you feel how a defense becomes your next opening, grappling stops being memorization and becomes a conversation.</p>' }
            ]
          },
          {
            id: 'mma-triangle', title: 'The Triangle choke', min: 6, teaser: 'Choke someone with your legs using their own shoulder.',
            links: ['mma-posmap-guard', 'mma-position-first'],
            cards: [
              { t: 'read', h: 'How a leg choke works', body: '<p>The <b>triangle</b> is a blood choke you apply with your legs from guard. The trick: you trap <b>one of their arms inside</b> and leave the other out. Your legs form a figure-four around their neck <i>and</i> their own trapped shoulder.</p><p>It works because the choke presses the arteries on both sides of the neck — one side by your leg, the other side by <i>their own shoulder</i>. That\'s why "one arm in, one arm out" is the whole game. Both arms in, or both out, and there\'s no choke.</p>', mem: 'One arm in, one arm out. Their own shoulder does half the choking.' },
              { t: 'mcq', q: 'For a triangle to work, how many of the opponent\'s arms are trapped inside your legs?', opts: ['Both', 'Exactly one', 'Neither', 'It doesn\'t matter'], a: 1, why: 'Exactly one. The trapped arm\'s shoulder presses one artery while your leg presses the other. Both-in or both-out and the choke is empty.' },
              { t: 'order', q: 'Order the basic triangle entry.', items: ['Control posture and isolate — one arm in, one out', 'Bring a leg up over the shoulder on the "in" side, across the neck', 'Lock your other leg over your own shin (figure-four)', 'Angle off and squeeze your knees together'], why: 'Isolate the arms, shoot the leg across, lock the figure-four, then angle and squeeze. The angle is what most beginners miss — straight-on, there\'s no choke.' },
              { t: 'tf', q: 'A blood choke (like the triangle) works by cutting blood flow to the brain, not air.', a: true, why: 'Blood chokes compress the carotid arteries — fast and relatively safe when released promptly. Air chokes crush the windpipe and are slower and harsher. Most BJJ chokes are blood chokes. Always tap early and train with a partner and coach.' }
            ]
          },
          {
            id: 'mma-posmap-mount', title: 'Mount (top)', min: 6, teaser: 'You\'re sitting on them. Dominant — now keep it and finish.',
            links: ['mma-posmap-guard', 'mma-position-first', 'mma-ground-pound'],
            cards: [
              { t: 'read', h: 'The high ground', body: '<p><b>Mount</b> — you\'re sitting on their torso, knees on the mat. One of the most dominant positions: you can strike down freely (in MMA) and attack submissions while they struggle to move you.</p><p>The catch: a good opponent will try to <b>buck, roll, or shrimp</b> out. Your job is to stay heavy and climb to a "high mount" (up near the armpits) where their hips can\'t generate power to escape.</p>', mem: 'Mount: stay heavy, climb high (toward the armpits), then attack. Low mount gets bucked off.' },
              {
                t: 'posmap', center: 'Full Mount (you on top)',
                intro: 'From the throne, here\'s where it goes.',
                paths: [
                  { label: 'Armbar', kind: 'submission', to: 'Trap an arm, spin and lean back to attack the elbow. Common when they push on your chest.', hole: 'mma-triangle' },
                  { label: 'Ground and pound', kind: 'submission', to: 'In MMA, strikes from mount force them to cover up, opening submissions.', hole: 'mma-ground-pound' },
                  { label: 'They "buck and roll" (upa)', kind: 'danger', to: 'If you\'re low and post wrong, they bridge and roll you — now you\'re in THEIR guard. Stay heavy and high.', hole: 'mma-posmap-guard' },
                  { label: 'They turn to escape → take the Back', kind: 'sweep', to: 'When they turn belly-down to escape mount, you climb onto their back — the most dominant spot of all.', hole: 'mma-position-first' }
                ]
              },
              { t: 'mcq', q: 'Your opponent bridges hard and rolls, reversing you. Where do you most likely end up?', opts: ['Back control', 'In their full guard (on bottom)', 'Standing', 'Side control'], a: 1, why: 'The upa (bridge-and-roll) escape dumps the top player into the bottom player\'s guard. Staying heavy and in high mount is how you prevent it.' },
              { t: 'tf', q: 'When a mounted opponent turns belly-down to escape, giving up their back is usually the smart trade for them.', a: false, why: 'It\'s usually a mistake — turning away hands you their back, the single most dominant position. "Never give your back" is drilled for exactly this reason.' }
            ]
          },
          {
            id: 'mma-ground-pound', title: 'MMA ground & pound', min: 5, teaser: 'Where grappling and striking fuse — the MMA-specific layer.',
            links: ['mma-posmap-mount', 'mma-position-first', 'mma-ranges'],
            cards: [
              { t: 'read', h: 'Why MMA changes the math', body: '<p>Pure BJJ assumes no strikes. MMA adds them, and it rewrites the rules:</p><ul><li>Being on bottom is <b>worse</b> — you\'re eating punches and elbows, and the ref may stand you up or stop the fight.</li><li>Posture that\'s fine in BJJ gets you punched in MMA, and vice versa.</li><li><b>Striking opens grappling and grappling opens striking</b>: punches make them cover up (opening a submission); submission threats make them defend (opening strikes).</li></ul><p>This is why MMA grappling looks different from sport BJJ — the threat of damage is always in the room.</p>', mem: 'In MMA, strikes and submissions feed each other. Make them choose between getting hit and getting submitted.' },
              { t: 'mcq', q: 'In MMA, why is being flat on your back under mount far more urgent than in sport BJJ?', opts: ['The mat is harder', 'You\'re absorbing strikes and the fight can be stopped', 'There\'s a time limit', 'It\'s against the rules'], a: 1, why: 'Ground-and-pound means real damage and a possible TKO. A bottom position you could sit in calmly in BJJ becomes an emergency in MMA.' },
              { t: 'tf', q: '"Striking to set up the grapple, grappling to set up the strike" captures the core of MMA.', a: true, why: 'That interplay is MMA\'s identity. A fighter who can only do one discipline is predictable; the threat of both is what makes each one land.' }
            ]
          }
        ]
      },
      {
        name: 'Striking',
        tag: 'Boxing / Muay Thai',
        blurb: 'Punches, kicks, and the combos that chain them — with the footwork and defense that make them safe.',
        lessons: [
          {
            id: 'mma-combos', title: 'Punches & the 1-2', min: 6, teaser: 'The numbering system and your first real combination.',
            links: ['mma-stance', 'mma-kicks', 'mma-ranges'],
            cards: [
              { t: 'read', h: 'Punches by the numbers', body: '<p>Gyms number the basic punches so a coach can call a combo fast:</p><ul><li><b>1 — Jab</b> (lead straight)</li><li><b>2 — Cross</b> (rear straight, your power hand)</li><li><b>3 — Lead hook</b></li><li><b>4 — Rear hook</b></li><li><b>5 — Lead uppercut</b></li><li><b>6 — Rear uppercut</b></li></ul><p>So "1-2" = jab then cross. "1-2-3" = jab, cross, lead hook. Each punch should flow into the next with your weight, not stop and restart.</p>', mem: 'Odd numbers = lead hand (1,3,5). Even = rear/power hand (2,4,6).' },
              { t: 'match', q: 'Match the number to the punch.', pairs: [['1', 'Jab'], ['2', 'Cross'], ['3', 'Lead hook'], ['6', 'Rear uppercut']], why: 'Odd = lead side, even = rear/power side. Learn the numbers and any coach\'s combo instantly makes sense.' },
              { t: 'read', h: 'The 1-2, done right', body: '<p>The jab-cross is the first combo everyone learns and the last one everyone masters. Three things make it work:</p><ol><li><b>Weight transfer</b> — the jab sets up, the cross drives off your rear foot with a hip rotation. Power comes from the ground up, not the arm.</li><li><b>Return the hand</b> — each punch snaps back to guard, not drops. A dropped hand is an invitation.</li><li><b>Defensive responsibility</b> — when you throw the 2, your lead shoulder comes up to protect your chin from their counter.</li></ol>' },
              { t: 'order', q: 'Order a clean 1-2 (jab-cross).', items: ['Lead-hand jab extends, measuring distance', 'Jab snaps back to guard', 'Rear foot pivots, hips rotate', 'Cross fires straight down the center', 'Both hands return to guard'], why: 'Jab to measure, recoil, then the cross driven by the hip/foot pivot, then reset. Power is in the rotation, not the arm. The reset is what keeps you safe.' },
              { t: 'mcq', q: 'Where does the real power in a cross come from?', opts: ['The arm muscles', 'Rotating the hips and pivoting the rear foot', 'Leaning forward', 'Holding your breath'], a: 1, why: 'Power is generated from the ground up — foot pivot, hip rotation, then the arm just delivers it. Arm-punching is weak and tiring.' }
            ]
          },
          {
            id: 'mma-kicks', title: 'Kicks & checking them', min: 5, teaser: 'The Muay Thai roundhouse, and how not to break your own shin.',
            links: ['mma-combos', 'mma-ranges'],
            cards: [
              { t: 'read', h: 'Kick with the shin, turn the hip', body: '<p>The <b>Muay Thai roundhouse</b> is the king of kicks. Two keys:</p><ul><li>You strike with the <b>shin</b>, not the foot — the shin is a baseball bat, the foot is fragile.</li><li>You <b>turn your hip over</b> and pivot the base foot, swinging the whole leg like a bat. A leg-only kick has no power and leaves you off balance.</li></ul><p>Targets: the <b>low kick</b> (thigh — chops the opponent\'s mobility), the body, and the head.</p>', mem: 'Shin not foot. Turn the hip. Pivot the base foot. The kick is a swing, not a flick.' },
              { t: 'read', h: 'Checking a kick', body: '<p>Defending a low kick: you <b>check</b> it by lifting your knee and turning your own shin into theirs. Shin-on-shin, their soft calf/instep meets your hard shinbone — it hurts <i>them</i>. An unchecked low kick chops your thigh and, over a fight, can end it. A checked one can break <i>their</i> foot.</p>' },
              { t: 'mcq', q: 'You strike a Muay Thai roundhouse primarily with your:', opts: ['Toes', 'Instep/foot', 'Shin', 'Heel'], a: 2, why: 'The shin — it\'s dense and durable. Kicking with the foot or toes risks breaking small bones on impact.' },
              { t: 'mcq', q: 'An opponent throws a low kick at your lead leg. The textbook defense is to:', opts: ['Step back out of range or check it with your shin/knee', 'Catch it with your hands only', 'Jump', 'Kick them in the face simultaneously'], a: 0, why: 'Check it (shin up to meet theirs) or get out of range. An unchecked low kick accumulates damage fast; a check can hurt them more than you.' },
              { t: 'tf', q: 'Repeated low kicks to the thigh can win a fight even without a knockout.', a: true, why: 'Leg kicks compromise mobility and balance over rounds. A badly chopped lead leg can make a fighter unable to stand or move — several fights have ended on accumulated leg damage alone.' }
            ]
          }
        ]
      }
    ]
  });
})();
