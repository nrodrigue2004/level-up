/* How AI Works — from zero, honest, and tied to cybersecurity (one of nate's named interests). */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Tech & cyber',
    id: 'ai',
    name: 'How AI Works',
    mark: '🤖',
    color: '#b08cf0',
    stat: 'mind',
    blurb: 'Neural nets, LLMs & AI + security.',
    intro: "What's actually happening inside the AI you use every day — explained without the hype or the heavy math. Then how it collides with cybersecurity, and where it's heading.",
    units: [
      {
        name: 'The machine behind the magic',
        blurb: 'Strip away the mystique: AI is pattern-matching at enormous scale. Here\'s how.',
        lessons: [
          {
            id: 'ai-what', title: 'What AI actually is', min: 7, teaser: 'Not magic, not a brain. Predicting patterns from examples.',
            links: ['ai-llm', 'ai-security', 'cs-what-is-bit'],
            cards: [
              { t: 'read', h: 'Learning from examples', body: '<p>Traditional software follows rules a human wrote. <b>Machine learning</b> flips that: instead of writing the rules, you show the computer thousands of <i>examples</i> and it figures out the pattern itself.</p><p>Show it 10,000 photos labeled "cat" or "not cat," and it learns the patterns that make a cat a cat — without anyone ever writing "a cat has pointy ears." That\'s <b>training</b>. Afterward, it can label a photo it\'s never seen.</p>', mem: 'Classic code = humans write the rules. Machine learning = the computer learns the rules from examples.' },
              { t: 'read', h: 'Neural networks, gently', body: '<p>A <b>neural network</b> is the most common structure for this. It\'s layers of simple math units ("neurons"), each passing numbers to the next layer, loosely inspired by brain cells.</p><p>Each connection has a <b>weight</b> — a number that says how much that signal matters. <b>Training</b> is just the slow process of nudging millions of these weights until the network\'s guesses match the right answers. That\'s it. No understanding, no awareness — just a giant pile of tuned numbers that turns an input into an output.</p>', mem: 'A neural net is layers of math with tunable "weights." Training = adjusting the weights until the outputs are right.' },
              { t: 'mcq', q: 'In machine learning, where do the "rules" come from?', opts: ['A programmer writes them all', 'The model learns patterns from many examples', 'They\'re downloaded from the internet live', 'There are no rules'], a: 1, why: 'That\'s the core shift: instead of hand-writing rules, you provide labeled examples and the model infers the patterns during training.' },
              { t: 'mcq', q: 'What is a "weight" in a neural network?', opts: ['How much the model files take up', 'A number tuned during training that sets how much a signal matters', 'The speed of the GPU', 'A type of password'], a: 1, why: 'Weights are the tunable numbers. Training nudges millions (or billions) of them until the network produces good outputs. The trained model IS, essentially, those weights.' },
              { t: 'tf', q: 'A trained model actually "understands" concepts the way a human does.', a: false, why: 'No — it\'s pattern-matching from statistics, with no awareness or understanding. It can be stunningly useful AND have no idea what it\'s doing. Holding both of those at once is the honest view.' }
            ]
          },
          {
            id: 'ai-llm', title: 'How ChatGPT-style AI works', min: 7, teaser: 'The "predict the next word" trick, and why it hallucinates.',
            links: ['ai-what', 'ai-security'],
            cards: [
              { t: 'read', h: 'It predicts the next piece of text', body: '<p>A <b>Large Language Model</b> (LLM) like ChatGPT or Claude is, at its core, doing one thing astonishingly well: <b>predicting the next word</b> (really, the next "token" — a word or word-chunk).</p><p>It was trained on an enormous amount of text, learning the statistical patterns of language. When you type a prompt, it predicts the most fitting next token, then the next, then the next — building a response one piece at a time. That simple loop, at massive scale, produces essays, code, and conversation.</p>', mem: 'An LLM is a very, very good next-word predictor. Everything it does is that loop, repeated.' },
              { t: 'read', h: 'Why it "hallucinates"', body: '<p>Because it\'s predicting plausible-sounding text — not looking up facts — an LLM can state wrong things with total confidence. This is called a <b>hallucination</b>. It\'s not lying; it generated text that <i>sounds</i> right based on patterns, with no built-in fact-check.</p><p>The takeaway, especially for your tech career: AI is a powerful assistant, not an oracle. Verify anything that matters. (This is also why the learning in this app makes you trace and verify things yourself — so you can tell when an AI is wrong.)</p>', mem: 'Hallucination = confident, plausible, but wrong. The model optimizes for sounding right, not being right.' },
              { t: 'mcq', q: 'At its core, what is an LLM doing when it answers you?', opts: ['Searching a database of facts', 'Predicting the next token over and over', 'Thinking like a human brain', 'Copying an answer from one website'], a: 1, why: 'It generates text token-by-token by predicting what most plausibly comes next, based on patterns learned in training. No live fact lookup is happening unless a tool is bolted on.' },
              { t: 'mcq', q: 'An AI confidently gives you a fake citation that doesn\'t exist. This is called a:', opts: ['Bug', 'Hallucination', 'Virus', 'Prompt'], a: 1, why: 'A hallucination — plausible-sounding output with no basis in fact. It\'s inherent to how LLMs generate text, which is why verification matters.' },
              { t: 'tf', q: 'Because an LLM can sound confident and still be wrong, you should verify important outputs yourself.', a: true, why: 'Always. Treat AI as a fast, fallible assistant. The skill that makes you valuable is being able to check its work — which is exactly what this app trains.' }
            ]
          }
        ]
      },
      {
        name: 'AI meets cybersecurity',
        tag: 'your field',
        blurb: 'Where AI helps defenders, helps attackers, and becomes a target itself.',
        lessons: [
          {
            id: 'ai-security', title: 'AI + security: both sides', min: 7, teaser: 'The double-edged sword, and what it means for your career.',
            links: ['ai-llm', 'sp-social', 'sp-siem'],
            cards: [
              { t: 'read', h: 'AI on defense', body: '<p>Defenders already use AI/ML heavily:</p><ul><li><b>Anomaly detection</b> — learning "normal" network behavior and flagging weird deviations (the behavior-based detection from your Security+ lessons).</li><li><b>Spam and phishing filters</b> — classifying messages as safe or malicious.</li><li><b>Triage</b> — helping overloaded SOC analysts sort thousands of alerts to the ones that matter.</li></ul>', mem: 'On defense, AI is mostly a pattern-spotter: "what\'s normal, and what isn\'t?" at a scale no human can match.' },
              { t: 'read', h: 'AI on offense', body: '<p>Attackers get the same tools:</p><ul><li><b>Better phishing</b> — flawless, personalized lures at scale (no more broken English tells).</li><li><b>Deepfakes</b> — faked voice or video, e.g. a "CEO" on a call authorizing a wire transfer.</li><li><b>Faster recon and malware</b> — automating OSINT and code generation.</li></ul><p>This is why the human skills — verifying identity, slowing down under pressure, zero trust — matter more than ever, not less.</p>' },
              { t: 'read', h: 'AI as the target', body: '<p>A newer field: attacking the AI itself. Key terms you\'ll start seeing on exams and job posts:</p><ul><li><b>Prompt injection</b> — tricking an AI into ignoring its instructions (the AI cousin of SQL injection).</li><li><b>Data poisoning</b> — corrupting an AI\'s training data so it learns the wrong things.</li><li><b>Model theft / inversion</b> — stealing a model or extracting the private data it trained on.</li></ul>', mem: 'Securing AI is a whole new attack surface: the prompt, the training data, and the model itself.' },
              { t: 'mcq', q: 'Tricking an AI assistant into ignoring its rules by feeding it crafted text is called:', opts: ['SQL injection', 'Prompt injection', 'Phishing', 'A deepfake'], a: 1, why: 'Prompt injection — the AI-era parallel to SQL injection. Both exploit the same root flaw: mixing trusted instructions with untrusted input.' },
              { t: 'mcq', q: 'Why does AI make social-engineering defense MORE important, not less?', opts: ['AI removes all human jobs', 'AI makes phishing and deepfakes cheap, flawless, and personalized at scale', 'AI blocks all attacks automatically', 'It doesn\'t affect it'], a: 1, why: 'The old tells (bad grammar, generic wording) are gone. Convincing lures are now cheap and scalable, so verifying identity and staying skeptical under pressure is the real defense.' },
              { t: 'deep', h: 'What this means for your path', teaser: 'Why "AI will take the jobs" misses it.', hole: 'career-soc', body: '<p>AI won\'t replace security people; it reshapes what they do. The routine pattern-matching gets automated, and the human moves up to judgment: interpreting what the AI flags, handling the novel attacks it misses, securing the AI systems themselves, and making the calls a model can\'t.</p><p>"AI + security" is one of the fastest-growing niches right now, and it rewards exactly the combo you\'re building: understanding how AI works <i>and</i> how security works. That overlap is a career, not a dead end — the Career Finder has a path for it.</p>' }
            ]
          }
        ]
      }
    ]
  });
})();
