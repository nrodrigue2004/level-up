/* Cyber & Code — the "I forgot all of this" reboot track.
   Rebuilds coding, reading code, SQL, and OSINT from zero. Heavy on spaced-repeatable recall. */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Tech & cyber',
    id: 'tech',
    name: 'Cyber & Code',
    mark: '</>',
    color: '#5bbd80',
    stat: 'mind',
    blurb: 'Reboot coding, SQL & OSINT from zero.',
    intro: "The stuff a CS-and-cyber background should have but that faded. No assumptions — every term is tappable, everything comes back as review so it finally sticks. Start anywhere.",
    units: [
      {
        name: 'Reading & writing code',
        blurb: 'Before you write code, you need to read it without panic. We rebuild that first.',
        lessons: [
          {
            id: 't-readcode', title: 'Reading code without fear', min: 7, teaser: 'Code is just instructions in order. Here\'s how to trace any of it.',
            links: ['t-sql-what', 'cs-code-basics', 'cs-algorithms'],
            cards: [
              { t: 'read', h: 'You don\'t read code like a book', body: '<p>Code isn\'t read top-to-bottom like prose. You <b>trace</b> it: pretend you\'re the computer and follow the steps, tracking what each variable holds. Slow is fine. Everyone does this, even pros.</p><p>Three questions unlock almost any snippet:</p><ol><li><b>What are the variables, and what\'s in them right now?</b></li><li><b>What decides what runs?</b> (the if-statements)</li><li><b>What repeats?</b> (the loops)</li></ol>', mem: 'Reading code = being the computer, one line at a time, writing down what each box holds.' },
              { t: 'read', h: 'Trace this together', body: '<p>Here\'s a tiny program. Read it line by line:</p><pre>total = 0\nprices = [5, 10, 3]\nfor p in prices:\n    total = total + p\nprint(total)</pre><p>Walk it: total starts at 0. The loop visits 5 (total→5), then 10 (total→15), then 3 (total→18). Then it prints. The answer is <b>18</b>. That\'s the whole skill — track the boxes as you step.</p>' },
              { t: 'mcq', q: 'Trace it:<pre>x = 2\nx = x + 3\nx = x * 2\nprint(x)</pre>What prints?', opts: ['5', '7', '10', '12'], a: 2, keep: true, why: 'x starts 2. x + 3 → 5. x * 2 → 10. Each line updates the box before the next runs. The order is everything.' },
              { t: 'mcq', q: 'What does this print?<pre>name = "nate"\nif len(name) > 3:\n    print("long")\nelse:\n    print("short")</pre>', opts: ['long', 'short', 'nate', 'nothing'], a: 0, keep: true, why: '"nate" has 4 letters. len(name) is 4, and 4 > 3 is true, so the if-branch runs and prints "long".' },
              { t: 'fill', q: 'In code, the symbol that usually means "assign this value to this variable" is a single what? (the character)', a: ['=', 'equals', 'equal sign'], why: 'A single = assigns (puts a value in a box). A double == asks "are these equal?" Mixing them up is the most common beginner bug.' },
              { t: 'tf', q: 'In most languages, = (assign) and == (compare) mean different things.', a: true, why: 'Yes. = puts a value into a variable; == is a yes/no question ("are these equal?"). This trips up everyone at first.' },
              { t: 'deep', h: 'Why "vibe coding" leaves gaps', teaser: 'And how this app closes them.', hole: 'cs-code-basics', body: '<p>Letting AI write code gets you a working result without the mental model underneath — so when something breaks, you\'re stuck, because you never traced how it works. That\'s the gap you felt.</p><p>The fix isn\'t to stop using AI; it\'s to be able to <b>read and trace</b> what it gives you, so you can tell when it\'s wrong and fix it. Every code lesson here makes you trace by hand first. Do that a few dozen times and reading code stops being scary — it becomes automatic, like reading words.</p>' }
            ]
          }
        ]
      },
      {
        name: 'SQL from zero',
        tag: 'databases',
        blurb: 'The language for asking databases questions. You used it in school — here it is again, from nothing.',
        lessons: [
          {
            id: 't-sql-what', title: 'What SQL even is', min: 6, teaser: 'How you ask a database a question.',
            links: ['t-sql-query', 't-readcode', 'cs-filesystems'],
            cards: [
              { t: 'read', h: 'A database is a spreadsheet with superpowers', body: '<p>Picture a table: rows and columns, like a spreadsheet. A <b>database</b> is a pile of these tables, and <b>SQL</b> (say "sequel" or "S-Q-L") is the language you use to ask it questions and get answers back.</p><p>Example table called <code>users</code>:</p><div class="rh-tbl"><table><tr><th>id</th><th>name</th><th>city</th></tr><tr><td>1</td><td>Nate</td><td>Baton Rouge</td></tr><tr><td>2</td><td>Mia</td><td>Dallas</td></tr><tr><td>3</td><td>Sam</td><td>Baton Rouge</td></tr></table></div>', mem: 'Table = a sheet of rows and columns. SQL = the way you ask the sheet questions.' },
              { t: 'read', h: 'The one query to know first', body: '<p>Almost every SQL question starts with <code>SELECT</code>. It means "give me back some columns." The shape:</p><pre>SELECT name, city\nFROM users\nWHERE city = \'Baton Rouge\';</pre><p>Read it in plain English, in this order: <b>FROM</b> which table (users), <b>WHERE</b> which rows match (city is Baton Rouge), <b>SELECT</b> which columns to show (name, city). Run against the table above, it returns Nate and Sam.</p>', mem: 'SELECT (what columns) · FROM (which table) · WHERE (which rows). The three words that do 80% of SQL.' },
              { t: 'mcq', q: 'Using the users table above, what does <code>SELECT name FROM users WHERE city = \'Dallas\';</code> return?', opts: ['Nate and Sam', 'Mia', 'All three names', 'Baton Rouge'], a: 1, keep: true, why: 'WHERE filters to rows where city is Dallas — only Mia (id 2). SELECT name shows just her name.' },
              { t: 'mcq', q: 'Which part of a SELECT query decides WHICH ROWS come back?', opts: ['SELECT', 'FROM', 'WHERE', 'the semicolon'], a: 2, why: 'WHERE is the filter — it keeps only rows that match a condition. SELECT picks columns; FROM picks the table.' },
              { t: 'order', q: 'Put the plain-English reading of a query in the order the database actually applies it.', items: ['FROM — pick the table', 'WHERE — keep matching rows', 'SELECT — show these columns'], why: 'Even though you TYPE SELECT first, the database logically grabs the table, filters rows, then returns the chosen columns. Reading it in that order makes queries click.' },
              { t: 'fill', q: 'What keyword filters which rows a query returns?', a: ['where'], why: 'WHERE is the filter. "SELECT ... FROM ... WHERE condition" — the condition decides which rows survive.' }
            ]
          },
          {
            id: 't-sql-query', title: 'Querying for real', min: 6, teaser: 'Counting, sorting, and why injection is dangerous.',
            links: ['t-sql-what', 't-osint', 'sp-pw-lab'],
            cards: [
              { t: 'read', h: 'A few more verbs', body: '<ul><li><code>ORDER BY</code> — sort the results (add <code>DESC</code> for high-to-low).</li><li><code>COUNT(*)</code> — how many rows match.</li><li><code>INSERT</code> — add a new row.</li><li><code>UPDATE</code> — change existing rows.</li><li><code>DELETE</code> — remove rows (careful — <code>DELETE FROM users;</code> with no WHERE wipes the whole table).</li></ul>', mem: 'SELECT reads. INSERT/UPDATE/DELETE change. Always double-check your WHERE before UPDATE or DELETE.' },
              { t: 'mcq', q: '<code>SELECT COUNT(*) FROM users WHERE city = \'Baton Rouge\';</code> on our table returns:', opts: ['1', '2', '3', 'Nate, Sam'], a: 1, keep: true, why: 'Two rows match (Nate and Sam). COUNT(*) returns the number of matching rows: 2.' },
              { t: 'tf', q: '<code>DELETE FROM users;</code> with no WHERE clause deletes every row in the table.', a: true, why: 'Yes — no filter means "all rows." This is a classic, painful mistake. Always include a WHERE (and ideally test with SELECT first).' },
              { t: 'read', h: 'SQL injection — where cyber meets SQL', body: '<p>Here\'s the security tie-in. If an app builds a query by gluing in whatever a user typed, an attacker can type SQL instead of a name and hijack the query. That\'s <b>SQL injection</b> — one of the oldest and most damaging web attacks (OWASP Top 10).</p><p>The fix is <b>parameterized queries</b> (a.k.a. prepared statements): the user\'s input is always treated as data, never as commands. Never build SQL by string-concatenating user input.</p>', mem: 'SQL injection = user input treated as commands. Fix = parameterized queries (input is always just data).' },
              { t: 'mcq', q: 'An attacker types SQL code into a login box and the app runs it as part of its query. The vulnerability is:', opts: ['Phishing', 'SQL injection', 'A DDoS', 'Ransomware'], a: 1, why: 'SQL injection — untrusted input gets executed as part of a database command. Parameterized queries prevent it by separating code from data.' },
              { t: 'deep', h: 'Why this is on the Security+ exam', teaser: 'Injection shows up on the exam and in real breaches.', hole: 'sp-malware', body: '<p>SQL injection is a headline example of a broader rule you\'ll see all over Security+: <b>never trust input</b>. Validate and sanitize everything coming from outside — form fields, URLs, uploaded files, API calls.</p><p>Huge real breaches have come from a single injectable form field. On the exam, "input validation" and "parameterized queries" are the expected answers to a whole family of questions. In the real world, it\'s the difference between a safe app and a leaked customer database.</p>' }
            ]
          }
        ]
      },
      {
        name: 'OSINT & your footprint',
        tag: 'cyber',
        blurb: 'What OSINT is, and how to use the idea to lock down your own digital trail.',
        lessons: [
          {
            id: 't-osint', title: 'OSINT, rebuilt', min: 6, teaser: 'The thing you learned in school and forgot. It\'s simpler than it sounds.',
            links: ['t-sql-query', 'sp-social', 'sp-threats'],
            cards: [
              { t: 'read', h: 'Open-Source INTelligence', body: '<p><b>OSINT</b> stands for <b>Open-Source Intelligence</b>: gathering information from sources that are already public — no hacking required. Search engines, social media, public records, company websites, photo metadata, leaked-password databases.</p><p>It\'s "open-source" in the sense of <i>openly available</i>, not the software meaning. Anyone can do it, which is exactly why it matters for both attackers and defenders.</p>', mem: 'OSINT = intelligence from public info. No breaking in — just looking at what\'s already out there.' },
              { t: 'read', h: 'How attackers use it (so you can defend)', body: '<p>Before a targeted attack, a smart attacker does <b>reconnaissance</b> with OSINT: your employer, your role, your coworkers\' names, your interests, the tech your company uses, your reused usernames. All of it makes a phishing email terrifyingly convincing ("Hey Nate, about the Baton Rouge project…").</p><p>Flip it around: the same techniques let you audit <i>your own</i> footprint and shrink what a stranger can learn about you.</p>' },
              { t: 'match', q: 'Match the OSINT source to what it can reveal.', pairs: [['Social media', 'Your location, routine, coworkers'], ['Photo metadata', 'Where/when a picture was taken'], ['Breach databases', 'Passwords you reused'], ['Company website', 'Names, emails, tech used']], why: 'Each public source leaks a piece. Stacked together they build a scary-accurate profile — which is why minimizing each one matters.' },
              { t: 'mcq', q: 'Which of these is NOT OSINT?', opts: ['Reading a target\'s public LinkedIn', 'Checking if their email is in a known breach', 'Guessing their password by brute force on the login page', 'Looking at geotags in their public photos'], a: 2, why: 'Brute-forcing a login is an active attack on a system, not gathering public info. OSINT is strictly observing what\'s already open — no interacting with the target\'s systems.' },
              { t: 'order', q: 'Order a quick self-audit to shrink your own footprint.', items: ['Search your own name + usernames to see what\'s public', 'Check your email in a breach-notification service', 'Lock down social media privacy settings', 'Turn on MFA and stop reusing passwords'], why: 'See what\'s exposed, find leaked credentials, close the public taps, then harden the accounts. Doing OSINT on yourself is the best way to understand and reduce your attack surface.' },
              { t: 'tf', q: 'Minimizing your public footprint reduces how convincing a targeted phishing (spear phishing) attempt against you can be.', a: true, why: 'Exactly. Less public detail = attackers have less to personalize with = weaker, more generic lures that are easier to spot.' }
            ]
          }
        ]
      }
    ]
  });
})();
