/* Mind: psychology and philosophy you can use. Psychology backbone: OpenStax Psychology 2e (CC BY 4.0, openstax.org),
   rewritten plainly. Philosophy backbone: MIT OCW 24.00 Problems of Philosophy and standard intro-ethics topics.
   Lessons are original. Educational, not therapy: if you're struggling, call or text 988 (US). */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, pool, why) { var opts = [right]; shuffle(pool).forEach(function (w) { if (opts.indexOf(w) < 0 && opts.length < 4) opts.push(w); }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }

  var BIAS = [
    ['After buying a truck, you suddenly notice the same model everywhere.', 'Frequency illusion (Baader-Meinhof)'],
    ['You only read articles that agree with what you already believe.', 'Confirmation bias'],
    ['A car is "marked down" from $40k to $32k, so $32k feels cheap.', 'Anchoring'],
    ['After a plane crash on the news, flying feels more dangerous than driving.', 'Availability heuristic'],
    ['You keep pouring money into a broken car because you\'ve "already spent so much."', 'Sunk cost fallacy'],
    ['Your project failed because of bad luck; your coworker\'s failed because he\'s lazy.', 'Fundamental attribution error'],
    ['After the game, you say you "knew all along" who would win.', 'Hindsight bias'],
    ['You think you\'re a better-than-average driver, like 80% of people do.', 'Overconfidence / illusory superiority'],
    ['An email "from the CEO" asks for gift cards and you rush to comply.', 'Authority bias'],
    ['Everyone at the table orders a beer, so you do too though you didn\'t want one.', 'Conformity / bandwagon effect'],
    ['Losing $100 hurts more than finding $100 feels good.', 'Loss aversion'],
    ['A "only 2 left!" banner makes you buy right now.', 'Scarcity effect']
  ];
  G.mnBias = function () { var b = pk(BIAS); return mc('Which bias is this?<br><br><b>' + b[0] + '</b>', b[1], BIAS.map(function (x) { return x[1]; }), b[1] + '. Social engineers and marketers exploit these on purpose; naming them is the first defense.'); };
  var FALL = [
    ['"You can\'t trust his argument about taxes, he\'s a criminal."', 'Ad hominem'],
    ['"Either you support this law or you hate safety."', 'False dilemma'],
    ['"If we allow phones at the gym, next people will be bringing TVs."', 'Slippery slope'],
    ['"Millions of people use this supplement, so it must work."', 'Appeal to popularity (bandwagon)'],
    ['"You think we should cut spending? So you want to starve children?"', 'Straw man'],
    ['"I wore my lucky socks and won, so the socks caused the win."', 'Post hoc (false cause)'],
    ['"God exists because the Bible says so, and the Bible is true because it\'s God\'s word."', 'Circular reasoning (begging the question)'],
    ['"A famous actor says this diet works, so it does."', 'Appeal to (irrelevant) authority'],
    ['"Nobody has proven ghosts don\'t exist, so they do."', 'Appeal to ignorance'],
    ['"I met two rude people from that city, so everyone there is rude."', 'Hasty generalization']
  ];
  G.mnFallacy = function () { var f = pk(FALL); return mc('Which fallacy?<br><br><b>' + f[0] + '</b>', f[1], FALL.map(function (x) { return x[1]; }), f[1] + '. A fallacy is a flaw in the reasoning. The conclusion might still be true, but this argument doesn\'t show it.'); };
  var COND = [
    ['A kid gets candy for cleaning his room, so he cleans more.', 'Positive reinforcement'],
    ['Your car\'s seatbelt alarm stops when you buckle up, so you buckle faster.', 'Negative reinforcement'],
    ['You get a speeding ticket, so you speed less.', 'Positive punishment'],
    ['A teen loses phone privileges for breaking curfew, so it happens less.', 'Negative punishment'],
    ['Your dog drools when it hears the treat bag, because the sound always came before treats.', 'Classical conditioning'],
    ['Slot machines pay out at unpredictable times, which makes people keep playing.', 'Variable-ratio schedule']
  ];
  G.mnCond = function () { var c = pk(COND); return mc('Which learning concept?<br><br><b>' + c[0] + '</b>', c[1], COND.map(function (x) { return x[1]; }), 'Reinforcement increases a behavior; punishment decreases it. Positive = add something; negative = take something away. ' + c[1] + ' here.'); };
  var ETH = [
    ['"Choose the action that produces the most overall happiness and least suffering."', 'Utilitarianism (consequentialism)'],
    ['"Some acts are wrong no matter the outcome, like lying or using people. Follow your duty."', 'Deontology (Kant)'],
    ['"Ask what a person of good character, brave, honest and wise, would do."', 'Virtue ethics (Aristotle)'],
    ['"Right and wrong are whatever rules we\'d all agree to for living together fairly."', 'Social contract theory'],
    ['"Focus on what\'s in your control, accept what isn\'t, and act with virtue."', 'Stoicism']
  ];
  G.mnEthics = function () { var e = pk(ETH); return mc('Which view is this?<br><br><b>' + e[0] + '</b>', e[1], ETH.map(function (x) { return x[1]; }), e[1] + '. Most real decisions use a bit of each: outcomes, rules, and character.'); };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    id: 'mind', name: 'Mind: psychology & philosophy', mark: '🧩', color: '#8a8fd6', stat: 'mind', group: 'Body & skills',
    blurb: 'How your brain works, how to think clearly.',
    intro: 'The useful parts of a psychology and philosophy degree: how memory and habits actually work (and how to fix a "bad memory"), the biases that scammers and marketers exploit, how to argue and spot bad arguments, how to make hard ethical calls, and Stoic tools for staying steady under pressure. This is education, not therapy. If you\'re ever struggling, you can call or text 988 any time (US).',
    placement: [
      { t: 'mcq', q: 'The best way to remember something long-term:', opts: ['Reread it many times in one night', 'Test yourself, spaced out over days', 'Highlight it', 'Listen while sleeping'], a: 1, why: 'Retrieval practice + spacing. Unit 1.' },
      { t: 'mcq', q: 'Negative reinforcement means:', opts: ['Punishment', 'Removing something unpleasant to increase a behavior', 'Ignoring a behavior', 'Adding something unpleasant'], a: 1, why: 'Unit 1.' },
      { t: 'mcq', q: 'Seeking only info that agrees with you is:', opts: ['Anchoring', 'Confirmation bias', 'Loss aversion', 'Hindsight bias'], a: 1, why: 'Unit 2.' },
      { t: 'mcq', q: '"Do what produces the most good overall" is:', opts: ['Deontology', 'Utilitarianism', 'Virtue ethics', 'Nihilism'], a: 1, why: 'Unit 3.' },
      { t: 'mcq', q: 'The Stoic "dichotomy of control" says:', opts: ['Control everything', 'Focus only on what\'s up to you', 'Nothing matters', 'Avoid all emotion'], a: 1, why: 'Unit 3.' }
    ],
    units: [
      {
        name: 'Unit 1 · Brain, learning & memory', tag: 'psych 101',
        blurb: 'Neurons, conditioning, how memory works, and how to study and build habits.',
        lessons: [
          {
            id: 'mn-brain', title: 'The brain in 10 minutes', min: 10, teaser: 'Neurons, chemicals, and which part does what.',
            links: ['mn-memory'],
            cards: [
              { t: 'read', h: 'Neurons and neurotransmitters', body: '<p>Your brain has about 86 billion <b>neurons</b>. Each one fires an electrical signal down its axon, then releases chemicals (<b>neurotransmitters</b>) across a tiny gap (the <b>synapse</b>) to the next neuron.</p><ul><li><b>Dopamine</b>: motivation, reward prediction, "wanting."</li><li><b>Serotonin</b>: mood, sleep, appetite.</li><li><b>Norepinephrine</b>: alertness, fight-or-flight.</li><li><b>GABA</b>: calming, slows activity down.</li><li><b>Glutamate</b>: the main "go" signal, key for learning.</li></ul><p>"Neurons that fire together wire together": repetition strengthens connections. That\'s learning, physically.</p>' },
              { t: 'read', h: 'Main regions', body: '<ul><li><b>Prefrontal cortex</b> (behind the forehead): planning, impulse control, decisions. Not fully mature until about age 25.</li><li><b>Amygdala</b>: threat detection, fear, strong emotion.</li><li><b>Hippocampus</b>: forming new memories. Stress and poor sleep hurt it.</li><li><b>Cerebellum</b>: coordination, timing, motor learning (your jab, your guitar chords).</li><li><b>Brainstem</b>: breathing, heart rate, sleep/wake.</li></ul><p>Concussions matter for fighters: repeated hits are linked to long-term damage (CTE). Protect your head in sparring.</p>', mem: 'Prefrontal = brakes. Amygdala = alarm. Hippocampus = memory.' },
              { t: 'mcq', q: 'Which region is most involved in forming new long-term memories?', opts: ['Cerebellum', 'Hippocampus', 'Brainstem', 'Amygdala'], a: 1, why: 'Hippocampus. Sleep and low stress help it work.' }
            ]
          },
          {
            id: 'mn-memory', title: 'How memory works (and fixing a "bad memory")', min: 12, teaser: 'Encoding, forgetting curves, and the study methods that actually work.',
            pre: ['mn-brain'], links: ['mn-habits'],
            cards: [
              { t: 'read', h: 'Three stages', body: '<ol><li><b>Encoding</b>: getting it in. Attention is the gate; you can\'t remember what you didn\'t notice. Phones on the desk cut it.</li><li><b>Storage</b>: <b>short-term/working memory</b> holds about 4 chunks for seconds; <b>long-term memory</b> is near-unlimited.</li><li><b>Retrieval</b>: getting it back out. Every successful retrieval makes the memory stronger.</li></ol><p>Most "bad memory" is actually weak encoding plus no retrieval practice, not a broken brain.</p>' },
              { t: 'read', h: 'What works (strong research support)', body: '<ul><li><b>Retrieval practice</b>: quiz yourself instead of rereading. (Every question in this app.)</li><li><b>Spacing</b>: review over increasing gaps: 1 day, 3 days, a week. Ebbinghaus\'s forgetting curve shows most new info fades within days without it. (The Review mode does this.)</li><li><b>Interleaving</b>: mix topics instead of blocking one.</li><li><b>Elaboration</b>: explain it in your own words and connect it to what you know (Explain-it-back cards).</li><li><b>Sleep</b>: memories are consolidated during sleep. Cramming all night works against you.</li></ul><p>Rereading and highlighting feel productive but do little.</p>', mem: 'Test yourself, space it out, explain it, sleep on it.' },
              { t: 'mcq', q: 'Which study method has the strongest evidence?', opts: ['Rereading notes', 'Highlighting', 'Self-testing spread over days', 'Studying with music'], a: 2, why: 'Retrieval practice plus spacing beats rereading by a wide margin in study after study.' },
              { t: 'explain', q: 'Explain why this app makes you answer questions instead of just reading.', points: ['Retrieving a memory strengthens it (testing effect)', 'Spaced review fights the forgetting curve', 'Explaining in your own words deepens encoding', 'Rereading feels familiar but builds little'] }
            ]
          },
          {
            id: 'mn-learning', title: 'Conditioning: how behavior is learned', min: 10, teaser: 'Pavlov, Skinner, rewards and why apps are addictive.',
            pre: ['mn-brain'], links: ['mn-habits'],
            cards: [
              { t: 'read', h: 'Classical and operant conditioning', body: '<p><b>Classical</b> (Pavlov): a neutral signal paired with something meaningful starts to trigger the same response. The notification sound alone can spike your attention.</p><p><b>Operant</b> (Skinner): behavior followed by consequences changes.</p><ul><li><b>Reinforcement</b> increases a behavior: positive (add something good) or negative (remove something bad).</li><li><b>Punishment</b> decreases it: positive (add something bad) or negative (take something good away).</li></ul><p><b>Variable-ratio</b> rewards (unpredictable, like slot machines, loot boxes and social feeds) create the most persistent behavior. Knowing that helps you notice when an app is training you.</p>', mem: 'Reinforce = more. Punish = less. Positive = add, negative = remove.' },
              { t: 'gen', g: 'mnCond' }, { t: 'gen', g: 'mnCond' }, { t: 'gen', g: 'mnCond' }
            ]
          },
          {
            id: 'mn-habits', title: 'Habits, motivation & discipline', min: 10, teaser: 'Cue, routine, reward, and making the good thing easy.',
            pre: ['mn-learning'], links: ['mn-stoic'],
            cards: [
              { t: 'read', h: 'The habit loop', body: '<p>A habit is a <b>cue</b> → <b>routine</b> → <b>reward</b> loop that runs with little thought. To build one: make the cue obvious (gym bag by the door), the routine small (2 minutes counts), and the reward immediate (a checkmark, XP, a streak). To break one: remove the cue, add friction (phone in another room), or swap the routine but keep the reward.</p><p><b>Motivation follows action</b> more often than the reverse. Start tiny and the motivation tends to show up once you\'re moving.</p>' },
              { t: 'read', h: 'Self-determination theory', body: '<p>Lasting motivation comes from three needs: <b>autonomy</b> (choosing it), <b>competence</b> (seeing yourself get better), and <b>relatedness</b> (connection with others). Training partners, visible progress and owning your plan beat willpower alone.</p>' },
              { t: 'explain', q: 'Design a habit using cue, routine and reward.', points: ['An obvious cue tied to something you already do', 'A routine small enough to never skip', 'An immediate reward', 'A plan to remove friction or add it to bad habits'] }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Thinking clearly', tag: 'critical thinking',
        blurb: 'Cognitive biases, persuasion, and spotting bad arguments.',
        lessons: [
          {
            id: 'mn-bias', title: 'Cognitive biases (and how scammers use them)', min: 11, teaser: 'Mental shortcuts that misfire.',
            pre: ['mn-memory'], links: ['sp-social', 'mn-persuade'],
            cards: [
              { t: 'read', h: 'System 1 and System 2', body: '<p>Psychologist Daniel Kahneman described two modes: <b>System 1</b> is fast, automatic and intuitive; <b>System 2</b> is slow, effortful and logical. System 1 runs most of the day and uses shortcuts (heuristics). Biases are where those shortcuts misfire.</p><p>Defense: when stakes are high (money, security, a big decision), deliberately slow down and switch to System 2. That\'s exactly why security training says "pause before you click."</p>' },
              { t: 'gen', g: 'mnBias' }, { t: 'gen', g: 'mnBias' }, { t: 'gen', g: 'mnBias' }, { t: 'gen', g: 'mnBias' }
            ]
          },
          {
            id: 'mn-persuade', title: 'Persuasion & social influence', min: 10, teaser: 'Cialdini\'s principles, conformity, obedience.',
            pre: ['mn-bias'], links: ['sp-social', 'sp-awareness'],
            cards: [
              { t: 'read', h: 'Classic experiments', body: '<ul><li><b>Asch (1950s)</b>: people gave obviously wrong answers about line lengths to match a group about a third of the time.</li><li><b>Milgram (1960s)</b>: most participants gave what they believed were dangerous shocks when an authority figure told them to continue.</li><li><b>Bystander effect</b>: the more people around, the less likely any one person helps. If you need help, point at one person and give them a job.</li></ul>' },
              { t: 'read', h: 'Cialdini\'s principles', body: '<p><b>Reciprocity</b> (you got something, you feel you owe), <b>commitment/consistency</b>, <b>social proof</b>, <b>authority</b>, <b>liking</b>, <b>scarcity</b>, and <b>unity</b> (shared identity). Good salespeople use them; social engineers weaponize them: "This is IT (authority), everyone else already reset their password (social proof), do it in 10 minutes or you\'re locked out (scarcity/urgency)."</p>', mem: 'Urgency + authority + a request to bypass process = stop and verify.' },
              { t: 'mcq', q: 'A caller says they\'re from the bank fraud team, you must act now, and asks for the code just texted to you. Which principles are being used?', opts: ['Reciprocity and liking', 'Authority and scarcity/urgency', 'Unity only', 'None'], a: 1, why: 'Claimed authority + time pressure. Banks never ask for those codes. Hang up and call the number on your card.' },
              { t: 'gen', g: 'mnBias' }
            ]
          },
          {
            id: 'mn-logic', title: 'Arguments & fallacies', min: 10, teaser: 'How to tell a good argument from a bad one.',
            pre: ['mn-bias'], links: ['dm-logic', 'mn-ethics'],
            cards: [
              { t: 'read', h: 'Arguments', body: '<p>An <b>argument</b> is premises that support a conclusion. <b>Valid</b>: if the premises were true, the conclusion would have to be. <b>Sound</b>: valid and the premises really are true. <b>Deductive</b> arguments aim for certainty; <b>inductive</b> ones (most science and everyday reasoning) give probability.</p><p>To evaluate: (1) What\'s the conclusion? (2) What reasons are given? (3) Are they true? (4) Do they actually support the conclusion? (5) What would change my mind?</p>' },
              { t: 'gen', g: 'mnFallacy' }, { t: 'gen', g: 'mnFallacy' }, { t: 'gen', g: 'mnFallacy' },
              { t: 'explain', q: 'Explain the difference between a valid argument and a sound one.', points: ['Valid: conclusion follows if premises were true', 'Sound: valid AND premises actually true', 'A valid argument can have false premises', 'Only sound arguments guarantee a true conclusion'] }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Philosophy for real life', tag: 'philosophy',
        blurb: 'Ethics, Stoicism, knowledge, and the mind (including AI).',
        lessons: [
          {
            id: 'mn-ethics', title: 'Ethics: how to decide what\'s right', min: 12, teaser: 'Outcomes, duties, character, and tech ethics.',
            pre: ['mn-logic'], links: ['fe-econ', 'mn-stoic'],
            cards: [
              { t: 'read', h: 'Three big theories', body: '<ul><li><b>Utilitarianism</b> (Bentham, Mill): the right act produces the best overall outcome. Strength: takes consequences seriously. Problem: can justify harming a few for many.</li><li><b>Deontology</b> (Kant): some duties hold regardless of outcome; treat people as ends, never merely as means. Strength: protects rights. Problem: rigid when duties conflict.</li><li><b>Virtue ethics</b> (Aristotle): focus on becoming a person of good character (courage, honesty, justice, practical wisdom). Strength: fits real life. Problem: less specific guidance.</li></ul>' },
              { t: 'read', h: 'Ethics in tech and security', body: '<p>Real cases: Should a pentester exploit a bug found outside the agreed scope? (No: get authorization first.) Should you disclose a vulnerability publicly if the vendor ignores you? (Coordinated disclosure: give them reasonable time, then disclose responsibly.) Should AI systems make decisions about loans or parole? (Fairness, transparency, accountability.) The (ISC)² and ACM codes of ethics boil down to: protect society, act honorably, provide competent service.</p>' },
              { t: 'gen', g: 'mnEthics' }, { t: 'gen', g: 'mnEthics' },
              { t: 'explain', q: 'Use two ethical theories to analyze: "Should I report a coworker who\'s skipping security patches?"', points: ['Utilitarian: consider the harm a breach could cause many people', 'Deontological: duty to follow policy and protect the organization', 'Virtue: what would an honest, responsible professional do', 'A reasoned conclusion and how to do it respectfully'] }
            ]
          },
          {
            id: 'mn-stoic', title: 'Stoicism: the fighter\'s philosophy', min: 10, teaser: 'Control, discipline and staying calm under pressure.',
            pre: ['mn-habits'], links: ['mma-position-first'],
            cards: [
              { t: 'read', h: 'Core ideas', body: '<p>Stoicism started in Athens around 300 BC; its best-known writers are Epictetus (a former slave), Seneca, and the emperor Marcus Aurelius.</p><ul><li><b>Dichotomy of control</b>: some things are up to you (your effort, judgments, actions), most aren\'t (other people, results, luck). Put your energy only into the first group.</li><li><b>Perception</b>: "We suffer more in imagination than in reality" (Seneca). Events don\'t upset you; your judgments about them do.</li><li><b>Virtue</b> is the only true good: wisdom, courage, justice, self-discipline.</li><li><b>Memento mori</b>: remember life is short, so don\'t waste today.</li></ul>' },
              { t: 'read', h: 'Practices', body: '<ul><li><b>Morning premeditation</b>: picture what could go wrong today and how you\'d respond well.</li><li><b>Evening review</b>: what did I do well, where did I fall short, what will I do better? (Same idea as a training log.)</li><li><b>Voluntary discomfort</b>: cold showers, hard training, so hardship doesn\'t rattle you.</li><li><b>The view from above</b>: zoom out to see how small today\'s problem is.</li></ul><p>Modern cognitive behavioral therapy (CBT) borrows directly from these ideas.</p>', mem: 'Control your effort, not the outcome.' },
              { t: 'mcq', q: 'You lose a close decision in a fight. A Stoic response:', opts: ['Blame the judges for weeks', 'Accept what you can\'t control, review what you can improve, and train', 'Quit', 'Pretend it didn\'t happen'], a: 1, why: 'The decision isn\'t yours to control; your preparation and response are.' },
              { t: 'gen', g: 'mnEthics' }
            ]
          },
          {
            id: 'mn-knowledge', title: 'Knowledge, truth & the mind (including AI)', min: 11, teaser: 'How do you know what you know? Could a machine think?',
            pre: ['mn-logic'], links: ['ai-llm', 'th-limits'],
            cards: [
              { t: 'read', h: 'Knowledge', body: '<p>The classic definition: knowledge is <b>justified true belief</b>. Edmund Gettier (1963) showed cases where you have all three by luck, so philosophers still debate what\'s missing. Practical version for the internet age: how good is my evidence, who is the source, could I be wrong, and what would convince me otherwise? Check claims against multiple independent, reputable sources.</p><p><b>Skepticism</b> (Descartes): can you be certain of anything? His answer: "I think, therefore I am."</p>' },
              { t: 'read', h: 'Mind and AI', body: '<p>The <b>mind-body problem</b>: how do physical brains produce conscious experience? <b>Dualism</b> says mind is separate from matter; <b>physicalism</b> says it\'s what the brain does.</p><p><b>The Turing test</b> (1950): if a machine\'s conversation can\'t be told apart from a human\'s, should we say it thinks? <b>Searle\'s Chinese Room</b> (1980) argues following symbol rules isn\'t understanding. Today\'s large language models make this a live debate: they produce fluent language by predicting text, and whether anything like understanding or experience is involved is an open question that researchers and philosophers actively disagree on.</p>' },
              { t: 'mcq', q: 'Searle\'s Chinese Room argument claims that:', opts: ['Computers can never translate', 'Manipulating symbols by rules isn\'t the same as understanding them', 'Chinese is hard', 'The Turing test is too easy to fail'], a: 1, why: 'Syntax (symbol rules) vs semantics (meaning).' },
              { t: 'explain', q: 'Explain how you\'d decide whether to believe a viral claim online.', points: ['Identify the source and its track record', 'Look for multiple independent reputable sources', 'Consider what evidence is given and what\'s missing', 'Ask what would change your mind; watch for confirmation bias'] }
            ]
          }
        ]
      }
    ]
  });
})();
