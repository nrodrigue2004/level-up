/* K-12 English refresh: grammar that actually matters, reading comprehension, writing, and word roots.
   Backbone: OpenStax Writing Guide with Handbook (CC BY 4.0), rewritten in plain words. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mc(q, right, wrongs, why) {
    var seen = {}, opts = [right]; seen[right] = 1;
    wrongs.forEach(function (w) { if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
    return { t: 'mcq', q: q, opts: opts, a: 0, why: why };
  }

  var MIX = [
    ['___ going to be late.', "They're", ['Their', 'There'], "They're = they are. Test it: \"They are going to be late\" works."],
    ['I left my keys over ___.', 'there', ['their', "they're"], 'There = a place (it has "here" inside it).'],
    ['The kids grabbed ___ backpacks.', 'their', ['there', "they're"], 'Their = belongs to them.'],
    ['___ raining again.', "It's", ['Its'], "It's = it is. \"It is raining\" works."],
    ['The dog wagged ___ tail.', 'its', ["it's"], 'Its = belongs to it. No apostrophe, just like his and hers.'],
    ['___ phone is ringing?', 'Whose', ["Who's"], 'Whose = belongs to who. Who\'s = who is.'],
    ['___ coming to the gym?', "Who's", ['Whose'], "Who's = who is."],
    ['Is this ___ jacket?', 'your', ["you're"], 'Your = belongs to you.'],
    ['___ going to love this.', "You're", ['Your'], "You're = you are."],
    ['That sad song really ___ me.', 'affected', ['effected'], 'Affect is usually the verb (to influence). Effect is usually the noun (the result). RAVEN: Remember, Affect Verb, Effect Noun.'],
    ['The new rule had a big ___ on sales.', 'effect', ['affect'], 'Effect = the result (a noun). "An effect."'],
    ['I lift more ___ I used to.', 'than', ['then'], 'Than compares. Then is about time ("first this, then that").'],
    ['Finish your workout, ___ stretch.', 'then', ['than'], 'Then = next in time.'],
    ["Don't ___ your phone.", 'lose', ['loose'], 'Lose = to misplace or not win. Loose = not tight.'],
    ['These shorts are too ___.', 'loose', ['lose'], 'Loose rhymes with goose and means not tight.'],
    ['I want to go ___.', 'too', ['to', 'two'], 'Too = also, or excessively. To = direction. Two = 2.'],
    ['I ___ have gone to the gym.', 'should', ['should of'], '"Should of" is a mishearing of "should\'ve" (should have). Always should have / could have / would have.'],
    ['She did ___ on the test.', 'well', ['good'], 'Well describes how you DO something (an adverb). Good describes a thing (an adjective): "a good test."']
  ];
  G.engMix = function () {
    var m = pk(MIX);
    return mc('Fill the blank: <b>' + m[0].replace('___', '_____') + '</b>', m[1], m[2], m[3]);
  };
  var POS = [
    ['The <u>tired</u> fighter sat down.', 'adjective', 'Tired describes the fighter (a noun). Words that describe nouns are adjectives.'],
    ['She <u>quickly</u> tapped out.', 'adverb', 'Quickly describes HOW she tapped (a verb). Many adverbs end in -ly.'],
    ['The <u>router</u> crashed again.', 'noun', 'Router is a thing. Nouns are people, places, things or ideas.'],
    ['I <u>studied</u> for an hour.', 'verb', 'Studied is the action. Verbs are actions or states of being.'],
    ['He left the keys <u>under</u> the mat.', 'preposition', 'Under shows the relationship between keys and mat (position). Prepositions: in, on, under, over, before, after, with.'],
    ['<u>They</u> fixed the server.', 'pronoun', 'They stands in for a noun (the people). Pronouns: I, you, he, she, it, we, they.'],
    ['I wanted to run, <u>but</u> it rained.', 'conjunction', 'But joins two ideas. FANBOYS: for, and, nor, but, or, yet, so.'],
    ['Justice matters to <u>everyone</u>.', 'pronoun', 'Everyone stands in for people in general, so it\'s a pronoun.'],
    ['<u>Freedom</u> is not free.', 'noun', 'Freedom is an idea, and ideas are nouns too.'],
    ['The music was <u>really</u> loud.', 'adverb', 'Really describes loud (an adjective). Adverbs can describe verbs, adjectives or other adverbs.']
  ];
  G.engPOS = function () {
    var p = pk(POS), all = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction'];
    return mc('What part of speech is the underlined word?<br><br>' + p[0], p[1], all.filter(function (x) { return x !== p[1]; }).sort(function () { return Math.random() - .5; }), p[2]);
  };
  var SENT = [
    ['Because I was tired.', 'Fragment', 'It starts with "because" and never finishes the thought. Fix: "I went home because I was tired."'],
    ['I went to the gym I lifted for an hour.', 'Run-on', 'Two complete sentences jammed together. Fix with a period, a semicolon, or ", and".'],
    ['I studied all night, I still failed.', 'Comma splice', 'A comma alone can\'t join two complete sentences. Fix: "I studied all night, but I still failed."'],
    ['The server went down, so we rebooted it.', 'Correct', 'Two complete thoughts joined by a comma plus a conjunction (so). That\'s the right way.'],
    ['Running down the street at night.', 'Fragment', 'No subject doing anything. Who is running? Fix: "He was running down the street at night."'],
    ['My phone died; I couldn\'t call.', 'Correct', 'A semicolon can join two closely related complete sentences.'],
    ['She plays guitar she also sings.', 'Run-on', 'Two complete sentences with nothing joining them. Add a period or "and".'],
    ['Although the test was hard.', 'Fragment', 'Although sets up a second half that never comes.']
  ];
  G.engSent = function () {
    var s = pk(SENT);
    return mc('Is this a complete, correct sentence?<br><br><b>"' + s[0] + '"</b>', s[1], ['Fragment', 'Run-on', 'Comma splice', 'Correct'], s[2]);
  };
  var ROOTS = [
    ['bio', 'life', ['earth', 'light', 'water'], 'biology (study of life), biography (life writing)'],
    ['geo', 'earth', ['life', 'time', 'sound'], 'geography, geology'],
    ['tele', 'far', ['near', 'small', 'many'], 'telephone (far sound), television (far seeing)'],
    ['phon', 'sound', ['light', 'love', 'fear'], 'phone, symphony, microphone'],
    ['graph', 'write / draw', ['speak', 'carry', 'see'], 'autograph, paragraph, graphic'],
    ['port', 'carry', ['write', 'look', 'break'], 'transport, portable, export'],
    ['dict', 'say / speak', ['see', 'hear', 'carry'], 'dictate, predict, contradict'],
    ['spect', 'look', ['speak', 'run', 'build'], 'inspect, spectator, respect'],
    ['chron', 'time', ['color', 'place', 'sound'], 'chronological, synchronize'],
    ['psych', 'mind', ['body', 'life', 'crowd'], 'psychology, psychic'],
    ['anti-', 'against', ['before', 'again', 'under'], 'antivirus, antibiotic'],
    ['pre-', 'before', ['after', 'against', 'again'], 'preview, predict'],
    ['re-', 'again / back', ['not', 'before', 'under'], 'reboot, rewrite, return'],
    ['un-', 'not', ['again', 'very', 'over'], 'unknown, unlock'],
    ['sub-', 'under / below', ['over', 'around', 'with'], 'submarine, subnet'],
    ['inter-', 'between', ['inside', 'against', 'after'], 'internet (between networks), interact'],
    ['-ology', 'study of', ['fear of', 'love of', 'without'], 'biology, psychology, cosmology'],
    ['-phobia', 'fear of', ['love of', 'study of', 'full of'], 'arachnophobia (spiders), claustrophobia'],
    ['crypt', 'hidden', ['fast', 'broken', 'shared'], 'cryptography (hidden writing), encrypt'],
    ['mal-', 'bad', ['good', 'many', 'small'], 'malware (bad software), malfunction']
  ];
  G.engRoot = function () {
    var x = pk(ROOTS);
    return mc('What does the word part <b>' + x[0] + '</b> mean?', x[1], x[2], 'You see it in: ' + x[3] + '. Learn ~50 roots and you can guess thousands of words you\'ve never seen.');
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'K-12 refresh',
    id: 'english',
    name: 'English & Writing',
    mark: '✍️',
    color: '#e57aa5',
    stat: 'mind',
    blurb: 'Grammar, reading, writing & word roots.',
    intro: "The English skills that actually matter as an adult: writing emails and cover letters that sound smart, reading something hard and getting the point, and figuring out words you've never seen. Practice items are drawn and shuffled fresh. Loosely follows the OpenStax Writing Guide (free, CC BY 4.0).",
    placement: [
      { t: 'mcq', q: "Pick the correct one: ___ going to the store.", opts: ["They're", 'Their', 'There'], a: 0, why: "They're = they are. Commonly mixed-up words are Unit 1." },
      { t: 'mcq', q: 'Which is a complete sentence?', opts: ['Because I was late.', 'I was late.', 'Running late again.', 'When the bus came.'], a: 1, why: 'A sentence needs a subject (I) and a verb (was) and a complete thought. Unit 1 covers this.' },
      { t: 'mcq', q: 'The main idea of a paragraph is usually:', opts: ['The longest sentence', 'The point the whole paragraph supports', 'The last word', 'Any detail in it'], a: 1, why: 'Main idea = the point everything else backs up. Reading is Unit 2.' },
      { t: 'mcq', q: 'A thesis statement is:', opts: ['A question', 'The one-sentence main argument of an essay', 'The title', 'A quote'], a: 1, why: 'Writing structure is Unit 3.' },
      { t: 'mcq', q: '"Pre-" in "preview" means:', opts: ['before', 'after', 'again', 'not'], a: 0, why: 'Word roots are Unit 4.' }
    ],
    units: [
      {
        name: 'Unit 1 · Grammar that matters',
        blurb: 'Not every rule. Just the ones people actually judge you on in emails, texts and applications.',
        lessons: [
          {
            id: 'e-pos', title: 'Parts of speech', min: 7, teaser: 'The eight jobs a word can have.',
            links: ['e-sent', 'e-roots'],
            cards: [
              { t: 'read', h: 'Words have jobs', body: '<p>Every word in a sentence is doing one of a few jobs. The big ones:</p><ul><li><b>Noun</b>: person, place, thing or idea (fighter, Louisiana, router, freedom).</li><li><b>Verb</b>: action or state (run, crashed, is).</li><li><b>Adjective</b>: describes a noun (tired fighter, <i>red</i> car).</li><li><b>Adverb</b>: describes a verb, adjective or adverb (ran <i>quickly</i>, <i>very</i> loud).</li></ul>', mem: 'Adjectives describe things. Adverbs describe actions (and often end in -ly).' },
              { t: 'read', h: 'The connectors', body: '<ul><li><b>Pronoun</b>: stands in for a noun (I, you, she, they, it).</li><li><b>Preposition</b>: shows relationships in space or time (in, on, under, before, with). Trick: anywhere a cat can go relative to a box.</li><li><b>Conjunction</b>: joins ideas. The main ones are FANBOYS: for, and, nor, but, or, yet, so.</li><li><b>Interjection</b>: an outburst (wow, ouch).</li></ul><p>Why care? Because every grammar rule (commas, fragments, run-ons) is described in these terms.</p>' },
              { t: 'gen', g: 'engPOS' },
              { t: 'gen', g: 'engPOS' },
              { t: 'gen', g: 'engPOS' }
            ]
          },
          {
            id: 'e-sent', title: 'Sentences, fragments & run-ons', min: 7, teaser: 'The #1 thing that makes writing look sloppy.',
            links: ['e-pos', 'e-comma'],
            cards: [
              { t: 'read', h: 'What makes a sentence', body: '<p>A complete sentence needs three things: a <b>subject</b> (who or what), a <b>verb</b> (what they do), and a <b>complete thought</b>.</p><p>"The server crashed." ✓ Subject: server. Verb: crashed. Complete.</p><p>A <b>fragment</b> is missing one: "Because the server crashed." The word "because" promises more, then never delivers.</p>', mem: 'Subject + verb + complete thought.' },
              { t: 'read', h: 'Run-ons and comma splices', body: '<p>The opposite problem: two sentences jammed together.</p><ul><li><b>Run-on</b>: "I went home I slept." (nothing between them)</li><li><b>Comma splice</b>: "I went home, I slept." (a comma alone isn\'t strong enough)</li></ul><p>Four fixes: a period ("I went home. I slept."), a comma + FANBOYS ("I went home, and I slept."), a semicolon ("I went home; I slept."), or rewriting ("After I went home, I slept.").</p>' },
              { t: 'gen', g: 'engSent' },
              { t: 'gen', g: 'engSent' },
              { t: 'gen', g: 'engSent' }
            ]
          },
          {
            id: 'e-comma', title: 'Commas & apostrophes', min: 6, teaser: 'The four comma rules that cover 90% of cases.',
            links: ['e-sent', 'e-mix'],
            cards: [
              { t: 'read', h: 'Four comma rules', body: '<ol><li><b>Lists</b>: "eggs, spinach, and rice." (The last comma is the "Oxford comma." Optional, but it prevents confusion.)</li><li><b>Before FANBOYS joining two sentences</b>: "I trained hard, but I lost."</li><li><b>After an intro</b>: "After the fight, we got food."</li><li><b>Around extra info</b> you could delete: "My cousin, who lives in Lafayette, is visiting."</li></ol><p>Classic: "Let\'s eat, Grandma" vs "Let\'s eat Grandma." Commas save lives.</p>' },
              { t: 'read', h: 'Apostrophes do two jobs', body: '<ul><li><b>Contractions</b>: replace missing letters. do not → don\'t, it is → it\'s.</li><li><b>Possession</b>: Nate\'s phone. For a plural ending in s, add just the apostrophe: the players\' locker room.</li></ul><p>Never use one to make a plural: "two laptops," not "two laptop\'s." And <b>its</b> (possessive) has no apostrophe, just like his and hers.</p>', mem: "It's = it is. Its = belongs to it." },
              { t: 'mcq', q: 'Which is punctuated correctly?', opts: ["The team lost it's first game.", 'The team lost its first game.', "The team lost its' first game."], a: 1, why: 'Its (no apostrophe) = belongs to it. It\'s always means "it is."' },
              { t: 'mcq', q: 'Which needs a comma?', opts: ['I ran and I lifted.', 'After the game we got wings.', 'She smiled.'], a: 1, why: 'An intro phrase ("After the game") gets a comma: "After the game, we got wings." The first one is short enough that a comma is optional.' }
            ]
          },
          {
            id: 'e-mix', title: 'Commonly mixed-up words', min: 5, teaser: 'There/their/they\'re, affect/effect, then/than.',
            links: ['e-comma'],
            cards: [
              { t: 'read', h: 'The test trick', body: '<p>For any contraction, expand it and see if it still works. "<b>They\'re</b> late" → "They are late" ✓. "<b>It\'s</b> tail" → "It is tail" ✗, so it\'s "its tail."</p><ul><li><b>there</b> = place · <b>their</b> = owned · <b>they\'re</b> = they are</li><li><b>your</b> = owned · <b>you\'re</b> = you are</li><li><b>then</b> = time · <b>than</b> = comparing</li><li><b>affect</b> = verb (to change) · <b>effect</b> = noun (the result)</li><li><b>lose</b> = misplace · <b>loose</b> = not tight</li></ul>' },
              { t: 'gen', g: 'engMix' },
              { t: 'gen', g: 'engMix' },
              { t: 'gen', g: 'engMix' },
              { t: 'gen', g: 'engMix' }
            ]
          }
        ]
      },
      {
        name: 'Unit 2 · Reading for real',
        blurb: 'Getting the point of something hard: articles, contracts, textbooks, job descriptions.',
        lessons: [
          {
            id: 'e-main', title: 'Main idea & evidence', min: 7, teaser: 'What is this actually saying, and how do they back it up?',
            links: ['e-infer', 'e-thesis'],
            cards: [
              { t: 'read', h: 'Find the point first', body: '<p>Every good paragraph has one <b>main idea</b>, and the rest is <b>supporting details</b> (examples, facts, reasons). The main idea is often the first or last sentence (the <b>topic sentence</b>).</p><p>Quick test: if you had to text the paragraph to a friend in one sentence, what would you say? That\'s the main idea.</p>' },
              { t: 'read', h: 'Read like a skeptic', body: '<p>For anything trying to convince you, ask:</p><ol><li>What\'s the <b>claim</b>?</li><li>What\'s the <b>evidence</b>? (Data? A study? One story?)</li><li>Does the evidence actually prove the claim, or just sort of relate to it?</li></ol><p>"My uncle smoked and lived to 95" is one example, not evidence that smoking is safe. This is the same skill a SOC analyst uses on an alert: what\'s the claim, and what does the log actually show?</p>', mem: 'Claim → evidence → does it actually prove it?' },
              { t: 'mcq', q: '"Remote workers are often more productive. A Stanford study found a 13% performance increase among call-center staff working from home. Many also reported higher job satisfaction." What is the main idea?', opts: ['Stanford did a study', 'Remote workers are often more productive', 'Call centers exist', 'People like their jobs'], a: 1, why: 'The first sentence is the claim. The study and the satisfaction point are supporting details.' },
              { t: 'mcq', q: 'An ad says: "9 out of 10 dentists recommend Brand X!" What\'s the best skeptical question?', opts: ['Is the ad pretty?', 'How many dentists were asked, and who paid for the survey?', 'Do I like the color?', 'None, it\'s a fact'], a: 1, why: '"9 out of 10" could be 10 dentists, paid by Brand X, asked a leading question. Always ask about the size and source of the evidence.' }
            ]
          },
          {
            id: 'e-infer', title: 'Inference, tone & purpose', min: 7, teaser: 'Reading between the lines.',
            links: ['e-main', 'sp-social'],
            cards: [
              { t: 'read', h: 'Inference', body: '<p>An <b>inference</b> is a conclusion you draw from clues that aren\'t stated directly. "She slammed the door and didn\'t say a word at dinner." It never says she\'s angry, but you can infer it.</p><p>A good inference is backed by clues in the text. A bad one is a guess you brought with you.</p>' },
              { t: 'read', h: 'Author\'s purpose and tone', body: '<p>Ask why something was written. The big three: to <b>inform</b> (news, textbook), to <b>persuade</b> (ads, op-eds), to <b>entertain</b> (stories).</p><p><b>Tone</b> is the attitude: urgent, sarcastic, friendly, formal. Phishing emails use an urgent, scary tone on purpose ("Your account will be CLOSED in 24 hours") because urgency makes people stop thinking. Spotting tone is a security skill.</p>', mem: 'Inform, persuade, or entertain? And what tone are they using on me?' },
              { t: 'mcq', q: '"URGENT: Your payroll deposit failed. Verify your login within 1 hour or lose this paycheck." The tone and purpose are:', opts: ['Calm, to inform', 'Urgent and fearful, to pressure you into acting fast', 'Funny, to entertain', 'Neutral'], a: 1, why: 'Manufactured urgency + fear of loss is a classic social-engineering tone. The purpose is to make you act before you think.' },
              { t: 'mcq', q: '"Marcus checked the clock for the fifth time and tapped his foot." You can infer Marcus is:', opts: ['Asleep', 'Impatient or anxious', 'Happy', 'Hungry'], a: 1, why: 'Checking the clock repeatedly and tapping are clues for impatience or nerves. It\'s never stated; you infer it.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 3 · Writing that works',
        blurb: 'Essays, emails and cover letters all use the same bones.',
        lessons: [
          {
            id: 'e-thesis', title: 'Thesis & paragraph structure', min: 8, teaser: 'Claim, evidence, explain. Repeat.',
            links: ['e-main', 'e-email'],
            cards: [
              { t: 'read', h: 'The thesis', body: '<p>A <b>thesis</b> is your main argument in one sentence. Not a topic ("This essay is about remote work") but a claim someone could disagree with ("Companies should allow remote work because it raises productivity and cuts costs").</p><p>A strong thesis is specific and arguable, and often previews your reasons.</p>' },
              { t: 'read', h: 'Body paragraphs: PEEL', body: '<ul><li><b>P</b>oint: the topic sentence. One idea per paragraph.</li><li><b>E</b>vidence: a fact, example, quote or data.</li><li><b>E</b>xplain: how the evidence proves your point. (Most people skip this. Don\'t.)</li><li><b>L</b>ink: connect back to the thesis or to the next paragraph.</li></ul><p>Essay shape: intro (hook + thesis) → 3 body paragraphs → conclusion (restate, zoom out). It\'s the same shape as a good incident report.</p>', mem: 'Point, Evidence, Explain, Link.' },
              { t: 'mcq', q: 'Which is the strongest thesis?', opts: ['This essay is about the internet.', 'The internet is interesting.', 'Schools should teach cybersecurity because kids are online younger and scams are getting smarter.', 'What is the internet?'], a: 2, why: 'It\'s specific, someone could argue against it, and it previews two reasons. The others are topics or questions, not claims.' },
              { t: 'order', q: 'Put a body paragraph in PEEL order.', items: ['Point: Remote work saves money.', 'Evidence: Companies save about $11,000 per remote worker a year.', 'Explain: Less office space and lower turnover drive those savings.', 'Link: Those savings are the strongest business case for remote work.'], why: 'Point, then evidence, then explain the evidence, then link back to the thesis.' }
            ]
          },
          {
            id: 'e-email', title: 'Professional emails & cover letters', min: 7, teaser: 'Sound sharp to a hiring manager.',
            links: ['e-thesis', 'career-soc'],
            cards: [
              { t: 'read', h: 'The professional email', body: '<ol><li><b>Subject line</b> that says exactly what it is: "SOC Analyst application: Nate R."</li><li><b>Greeting</b>: "Hi Ms. Lopez," (use their name if you can find it).</li><li><b>First line = the point.</b> "I\'m applying for the Tier 1 SOC Analyst role."</li><li>2–3 short sentences of support.</li><li><b>Clear ask</b>: "Could we set up a 15-minute call this week?"</li><li><b>Sign-off</b>: "Thanks, Nate" + phone.</li></ol><p>Short beats long. Busy people read the first two lines.</p>' },
              { t: 'read', h: 'Cover letter in 4 paragraphs', body: '<ol><li><b>Hook</b>: the role, and one line on why you specifically.</li><li><b>Proof</b>: your best relevant thing, with specifics. "I built a 7-VM homelab with pfSense, an AD domain and Security Onion, and use it to practice detecting attacks."</li><li><b>Fit</b>: something real about <i>their</i> company.</li><li><b>Close</b>: thank them, ask for the interview.</li></ol><p>Show, don\'t tell: "I\'m passionate about security" is weak. Describing your homelab proves it.</p>', mem: 'Show, don\'t tell. Specifics beat adjectives.' },
              { t: 'mcq', q: 'Which opening line is strongest for a cover letter?', opts: ['To whom it may concern, I am writing to apply.', 'Hi, I\'m Nate and I really need a job.', 'I\'m applying for your SOC Analyst role, and I already practice threat detection in a homelab I built with Security Onion.', 'I am a hard worker and team player.'], a: 2, why: 'It names the role and immediately proves relevant skill with specifics. The others are generic or don\'t show anything.' }
            ]
          }
        ]
      },
      {
        name: 'Unit 4 · Word power',
        blurb: 'Crack unknown words using their parts. Fewer "one word lost me" moments.',
        lessons: [
          {
            id: 'e-roots', title: 'Roots, prefixes & suffixes', min: 7, teaser: 'Learn 50 parts, decode thousands of words.',
            links: ['e-pos', 'sp-crypto-why'],
            cards: [
              { t: 'read', h: 'Words are built from parts', body: '<p>Most long English words are Greek or Latin Lego. <b>Prefix</b> (front) + <b>root</b> (core meaning) + <b>suffix</b> (end).</p><p><b>un-predict-able</b>: un (not) + predict (say before) + able (can be) → "can\'t be said beforehand."</p><p><b>crypt-o-graphy</b>: crypt (hidden) + graph (writing) → hidden writing. That\'s literally what encryption is.</p>', mem: 'Break a scary word into parts before giving up on it.' },
              { t: 'read', h: 'Context clues', body: '<p>When you hit an unknown word, the sentence around it usually helps:</p><ul><li><b>Definition</b>: "The attacker used <i>obfuscation</i>, or hiding code so it\'s hard to read."</li><li><b>Contrast</b>: "Unlike his <i>gregarious</i> brother, Ty was quiet." → gregarious means social.</li><li><b>Example</b>: "<i>Peripherals</i> like mice and keyboards."</li></ul><p>And in this app, just tap the underlined word.</p>' },
              { t: 'gen', g: 'engRoot' },
              { t: 'gen', g: 'engRoot' },
              { t: 'gen', g: 'engRoot' },
              { t: 'gen', g: 'engRoot' }
            ]
          }
        ]
      }
    ]
  });
})();
