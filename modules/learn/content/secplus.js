/* Security+ (SY0-701 shaped) — the centerpiece track. Fun, detailed, hands-on. */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Certs & career',
    id: 'secplus',
    name: 'Security+',
    mark: 'S+',
    color: '#ffb547',
    blurb: 'Your Sec+ prep, exam-shaped.',
    intro: "Everything on the SY0-701 blueprint, broken into bite-size lessons. Do the Sec+ Gauntlet on Home when you want a 25-question mock. Terminal labs let you actually type the commands.",
    units: [
      {
        name: 'Core ideas',
        tag: 'start here',
        blurb: 'The vocabulary every other lesson leans on. Fifteen minutes here makes the rest click.',
        lessons: [
          {
            id: 'sp-cia', title: 'The CIA triad', min: 4, teaser: 'The three-word model the whole exam hangs on.',
            links: ['sp-aaa', 'sp-crypto-why', 'cs-what-is-bit'],
            cards: [
              { t: 'read', h: 'Three goals, every time', body: '<p>Security isn\'t one thing. It\'s three goals, and almost every exam question is really asking "which of the three is this protecting?"</p><ul><li><b>Confidentiality</b> — only the right people can read it. (Encryption, permissions.)</li><li><b>Integrity</b> — nobody changed it without you knowing. (Hashes, signatures.)</li><li><b>Availability</b> — it\'s there when you need it. (Backups, redundancy, stopping DoS.)</li></ul>', mem: 'Read it, trust it, reach it. Confidentiality, Integrity, Availability.' },
              { t: 'tf', q: 'Encrypting a file mainly protects its <b>confidentiality</b>.', a: true, why: 'Encryption scrambles the contents so only someone with the key can read it — that\'s confidentiality.' },
              { t: 'mcq', q: 'A ransomware attack locks all your files so nobody can open them. Which part of the triad took the hit?', opts: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'], a: 2, why: 'The data still exists and wasn\'t leaked — you just can\'t get to it. That\'s an availability attack.' },
              { t: 'match', q: 'Match each control to the goal it mainly serves.', pairs: [['Daily backups', 'Availability'], ['File hash check', 'Integrity'], ['Full-disk encryption', 'Confidentiality'], ['Two power supplies', 'Availability']], why: 'Backups and redundant power keep things reachable; hashes prove nothing changed; encryption keeps contents secret.' },
              { t: 'mcq', q: 'A website shows a defaced homepage put up by an attacker. Which goal failed first?', opts: ['Confidentiality', 'Integrity', 'Availability'], a: 1, why: 'The content was changed without authorization. Changed-without-permission is always integrity.' },
              { t: 'deep', h: 'The hidden fourth: non-repudiation', teaser: 'CIA gets a bonus member on the exam.', hole: 'sp-crypto-why', body: '<p><b>Non-repudiation</b> means you can\'t deny you did something. If you sign a message with your private key, you can\'t later claim someone else sent it — only your key could have made that signature.</p><p>It\'s built from <b>integrity</b> (the message wasn\'t changed) plus <b>authentication</b> (it was really you). Digital signatures give you all three at once.</p>' }
            ]
          },
          {
            id: 'sp-aaa', title: 'AAA: AuthN vs AuthZ', min: 4, teaser: 'Why "authentication" and "authorization" are not the same word.',
            links: ['sp-mfa', 'sp-cia'],
            cards: [
              { t: 'read', h: 'Who are you vs what can you do', body: '<p>People mix these up constantly. The exam loves the difference.</p><ul><li><b>Authentication (AuthN)</b> — proving <i>who you are</i>. Logging in.</li><li><b>Authorization (AuthZ)</b> — deciding <i>what you\'re allowed to do</i> once you\'re in.</li><li><b>Accounting</b> — <i>recording what you did</i>. The logs.</li></ul><p>You authenticate once, then every action you take is authorized (or denied) against your permissions, and accounting writes it all down.</p>', mem: 'Authentication = who. Authorization = what. Accounting = the receipt.' },
              { t: 'mcq', q: 'You badge into the building (door opens), but the server room reader beeps red and won\'t let you in. What just happened?', opts: ['Authentication failed', 'You authenticated, but weren\'t authorized for that room', 'Accounting failed', 'The CIA triad collapsed'], a: 1, why: 'The building accepted who you are (authN worked). You just don\'t have permission for the server room (authZ denied).' },
              { t: 'match', q: 'Sort each into the right A.', pairs: [['Fingerprint unlock', 'Authentication'], ['"Admins only" folder', 'Authorization'], ['Login success logged', 'Accounting'], ['Role decides your menu', 'Authorization']], why: 'Proving identity is authN, deciding access is authZ, writing it down is accounting.' },
              { t: 'read', h: 'The factors (this is heavily tested)', body: '<p>Authentication factors come in categories:</p><ul><li><b>Something you know</b> — password, PIN.</li><li><b>Something you have</b> — phone, token, smart card.</li><li><b>Something you are</b> — fingerprint, face.</li><li><b>Somewhere you are</b> — location/geofencing.</li><li><b>Something you do</b> — how you type or swipe.</li></ul><p>Real <b>multi-factor</b> means two <i>different categories</i>. A password + a PIN is still one category (both "know"), so it\'s <b>not</b> MFA.</p>' },
              { t: 'tf', q: 'A password plus a security question (your mother\'s maiden name) counts as multi-factor authentication.', a: false, why: 'Both are "something you know" — same category. MFA needs two different categories, like a password plus a code from your phone.' }
            ]
          },
          {
            id: 'sp-threats', title: 'Threat actors & motives', min: 5, teaser: 'Script kiddie to nation-state — who\'s actually coming for you.',
            links: ['sp-social', 'sp-malware'],
            cards: [
              { t: 'read', h: 'Know your attacker', body: '<p>The exam wants you to match an attacker to the scenario. The big ones, roughly weakest to scariest in resources:</p><ul><li><b>Unskilled attacker</b> ("script kiddie") — runs tools they didn\'t write. Low skill, often just for fun or clout.</li><li><b>Hacktivist</b> — driven by a cause. Defacement, leaks, DoS to make a point.</li><li><b>Insider threat</b> — someone inside with legit access. Hard to catch.</li><li><b>Organized crime</b> — in it for money. Ransomware, fraud.</li><li><b>Nation-state / APT</b> — governments. Huge budgets, patient, stealthy. "Advanced Persistent Threat."</li></ul>', mem: 'APT = Advanced Persistent Threat. "Persistent" is the scary word — they stay hidden for months.' },
              { t: 'mcq', q: 'Attackers break in, stay quiet for 8 months slowly collecting defense blueprints, and never ask for money. Best fit?', opts: ['Script kiddie', 'Hacktivist', 'Nation-state (APT)', 'Organized crime'], a: 2, why: 'Patient, stealthy, long-term, after secrets not cash, well-resourced — that\'s the APT / nation-state fingerprint.' },
              { t: 'mcq', q: 'A former employee still has a VPN login nobody disabled, and uses it to copy the client list. This is a:', opts: ['Shadow IT problem', 'Insider threat', 'Script kiddie', 'Supply-chain attack'], a: 1, why: 'Someone with legitimate (or formerly legitimate) inside access is an insider threat. It also shows why offboarding matters.' },
              { t: 'match', q: 'Match the attacker to the motive.', pairs: [['Hacktivist', 'Push a cause'], ['Organized crime', 'Money'], ['Nation-state', 'Espionage'], ['Unskilled attacker', 'Clout / curiosity']], why: 'Motive is a huge classification clue on the exam.' },
              { t: 'tf', q: '"Shadow IT" means employees using unapproved apps or devices, which creates risk even when nobody is malicious.', a: true, why: 'Shadow IT is unsanctioned tech (a personal Dropbox, an unapproved SaaS). No bad intent needed — it\'s a threat vector because security can\'t see or protect it.' }
            ]
          }
        ]
      },
      {
        name: 'Social engineering & malware',
        tag: 'Domain 2',
        blurb: 'The attacks that target people, not code. This is where most real breaches start.',
        lessons: [
          {
            id: 'sp-social', title: 'Social engineering', min: 5, teaser: 'Hacking the human instead of the computer.',
            links: ['sp-phish-lab', 'sp-threats'],
            cards: [
              { t: 'read', h: 'Why trick the person?', body: '<p>Firewalls are hard. People are easy. Social engineering manipulates someone into doing the attacker\'s work for them.</p><p>Most of it leans on a handful of <b>principles of persuasion</b>:</p><ul><li><b>Authority</b> — "This is the CEO."</li><li><b>Urgency</b> — "Do this in the next 10 minutes."</li><li><b>Scarcity</b> — "Only 2 left."</li><li><b>Fear</b> — "Your account will be deleted."</li><li><b>Trust / familiarity</b> — pretending to be a known brand or coworker.</li><li><b>Social proof</b> — "Everyone on your team already did this."</li></ul>', mem: 'When a message rushes you and leans on a boss, slow down. Urgency + authority is the classic combo.' },
              { t: 'mcq', q: 'An email claims to be your bank: "Suspicious login! Verify in 15 minutes or we lock your account." Which two principles is it using?', opts: ['Scarcity + social proof', 'Authority + urgency', 'Trust + scarcity', 'Fear + social proof'], a: 1, why: 'It poses as an authority (your bank) and slams on urgency (15-minute deadline). That pressure is the tell.' },
              { t: 'match', q: 'Name each attack.', pairs: [['Phishing by voice call', 'Vishing'], ['Phishing by text message', 'Smishing'], ['Targeting one specific exec', 'Whaling'], ['Targeted phishing at a group', 'Spear phishing']], why: 'Vishing = voice, smishing = SMS, spear = targeted, whaling = targeting a "big fish" executive.' },
              { t: 'mcq', q: 'An attacker leaves USB drives labeled "Layoffs 2026" in the parking lot, hoping someone plugs one in. This is:', opts: ['Tailgating', 'Baiting', 'Pretexting', 'Shoulder surfing'], a: 1, why: 'Baiting dangles something tempting (curiosity about layoffs) to get the victim to act. The USB carries the malware.' },
              { t: 'tf', q: 'Tailgating is following an authorized person through a secure door before it closes, so you never badge in yourself.', a: true, why: 'Tailgating (or piggybacking) bypasses physical access control by riding in behind someone legitimate. A mantrap/access vestibule defends against it.' },
              { t: 'deep', h: 'Pretexting and the "impossible travel" tell', teaser: 'How defenders spot a stolen login.', hole: 'sp-logs-lab', body: '<p><b>Pretexting</b> is inventing a believable backstory ("I\'m from IT, we\'re doing an audit") to justify the ask. It\'s the setup under most vishing and BEC (business email compromise) attacks.</p><p>On the defense side, one great signal is <b>impossible travel</b>: the same account logs in from New York and then Singapore 20 minutes later. No human flies that fast, so the login is almost certainly stolen. You\'ll see this exact pattern in the log-investigation terminal lab.</p>' }
            ]
          },
          {
            id: 'sp-phish-lab', title: 'Lab: spot the phish', min: 6, teaser: 'A real-looking email. Find every red flag before it finds you.',
            links: ['sp-social', 'sp-email-sec'],
            cards: [
              { t: 'read', h: 'The checklist', body: '<p>Before you click anything, scan for these:</p><ol><li><b>Sender address</b> — does the domain actually match the real company? (micros0ft.com is not microsoft.com)</li><li><b>Greeting</b> — generic "Dear Customer" instead of your name.</li><li><b>Urgency / threats</b> — act now or else.</li><li><b>Link mismatch</b> — the visible text says one thing, the real URL goes elsewhere.</li><li><b>Attachments</b> you didn\'t expect, especially .zip, .exe, or a "receipt" .html.</li><li><b>Odd grammar</b> or slightly-off branding.</li></ol>' },
              {
                t: 'phish',
                head: [
                  { x: 'From: PayPaI Security <service@paypaI-alerts.com>', f: '<b>Sender domain is fake:</b> that\'s a capital I pretending to be an L — "paypaI", not "paypal".' },
                  'Subject: Receipt for your order'
                ],
                parts: [
                  'Dear',
                  { x: 'Valued Customer,', f: '<b>Generic greeting.</b> A real receipt would use your name.' },
                  'We have charged your account',
                  { x: '$739.95', f: '<b>Fake charge to create panic</b> — makes you want to "cancel" fast without thinking.' },
                  'for a new device. If you did not authorize this,',
                  { x: 'you must verify within 24 hours or your account will be permanently suspended.', f: '<b>Urgency + threat.</b> Real companies rarely threaten permanent suspension on a 24-hour clock.' },
                  'Click here to dispute:',
                  { x: 'http://paypal.account-verify.ru/login', f: '<b>Link mismatch.</b> The real domain is "account-verify.ru", not paypal.com. The .ru and the odd subdomain are dead giveaways.' },
                  'Thank you for your',
                  { x: 'buisness.', f: '<b>Misspelling</b> ("buisness"). Sloppy spelling is a classic phishing tell.' }
                ],
                why: 'Six flags: fake lookalike domain, generic greeting, invented charge, a 24-hour threat, a link that goes to a .ru domain, and a spelling error. Any one should make you stop.'
              },
              { t: 'mcq', q: 'The safest response to a suspicious "account problem" email is to:', opts: ['Click the link but don\'t enter a password', 'Reply asking if it\'s real', 'Ignore the email and log in by typing the site\'s address yourself', 'Forward it to coworkers to warn them'], a: 2, why: 'Never trust the email\'s links. Open a browser and type the known address (or use your saved bookmark). If there\'s a real problem, you\'ll see it there.' }
            ]
          },
          {
            id: 'sp-malware', title: 'Malware zoo', min: 6, teaser: 'Virus, worm, trojan, ransomware — the differences are testable.',
            links: ['sp-social', 'sp-hash-lab'],
            cards: [
              { t: 'read', h: 'The classic families', body: '<ul><li><b>Virus</b> — attaches to a file; spreads when a human runs that file.</li><li><b>Worm</b> — spreads <i>by itself</i> across networks, no human needed. (This is the #1 virus-vs-worm distinction.)</li><li><b>Trojan</b> — looks like something you want, hides something you don\'t.</li><li><b>Ransomware</b> — encrypts your files, demands payment.</li><li><b>Spyware / keylogger</b> — quietly records what you do / type.</li><li><b>Rootkit</b> — hides deep in the system (often the OS kernel) to stay invisible.</li><li><b>Logic bomb</b> — malicious code that waits for a trigger (a date, a fired employee\'s name vanishing from payroll).</li></ul>', mem: 'Worm = walks on its own. Virus = needs a vehicle (a file + a human to run it).' },
              { t: 'mcq', q: 'Malware spreads to 10,000 machines overnight with nobody opening anything. Which is it?', opts: ['Virus', 'Worm', 'Trojan', 'Logic bomb'], a: 1, why: 'Self-propagating with no human action is the definition of a worm.' },
              { t: 'mcq', q: 'A "free game" installs fine and is fun, but secretly opens a backdoor for the attacker. This is a:', opts: ['Worm', 'Rootkit', 'Trojan', 'Ransomware'], a: 2, why: 'Disguised as something desirable, carrying a hidden payload — that\'s a Trojan horse.' },
              { t: 'match', q: 'Match malware to its signature behavior.', pairs: [['Ransomware', 'Encrypts files, demands payment'], ['Keylogger', 'Records keystrokes'], ['Rootkit', 'Hides to avoid detection'], ['Logic bomb', 'Waits for a trigger']], why: 'Behavior is how the exam asks you to classify malware.' },
              { t: 'order', q: 'Put a typical ransomware attack in order.', items: ['Victim opens a malicious email attachment', 'Malware runs and contacts the attacker\'s server', 'Files get encrypted', 'Ransom note appears demanding payment'], why: 'Delivery → execution/callback → encryption → extortion. Good backups break this chain at the encryption step.' },
              { t: 'deep', h: 'Why you still don\'t pay', teaser: 'Backups beat ransoms.', hole: 'sp-backups', body: '<p>Paying a ransom is gambling: you\'re trusting a criminal to hand back a working key, and you\'re funding the next attack. Many victims pay and still don\'t recover everything.</p><p>The real defense is the <b>3-2-1 backup rule</b>: 3 copies of your data, on 2 different media, with 1 kept offline/offsite. An offline backup can\'t be encrypted by the ransomware, so you just wipe and restore.</p>' }
            ]
          }
        ]
      },
      {
        name: 'Cryptography',
        tag: 'Domain 1',
        blurb: 'The math that keeps secrets. Lighter on math than you fear, heavier on "which tool for which job."',
        lessons: [
          {
            id: 'sp-crypto-why', title: 'Symmetric vs asymmetric', min: 6, teaser: 'One key or two? The whole field splits here.',
            links: ['sp-hash-lab', 'sp-cipher-lab', 'sp-tls'],
            cards: [
              { t: 'read', h: 'The core split', body: '<p><b>Symmetric</b> encryption uses <i>one shared key</i> for both locking and unlocking. Fast, great for bulk data. Problem: how do you get the key to the other person safely?</p><p><b>Asymmetric</b> uses a <i>pair</i>: a <b>public key</b> (share freely) and a <b>private key</b> (never share). What one locks, only the other opens. Slower, but it solves the key-delivery problem.</p><p>Real systems use both: asymmetric to safely exchange a symmetric key, then fast symmetric encryption for the actual data. That\'s basically how HTTPS works.</p>', mem: 'Symmetric = same key. Asymmetric = a pair. Lock with public, open with private (for secrecy).' },
              { t: 'mcq', q: 'You want to send Nate a secret only he can read. Which key do you encrypt with?', opts: ['Nate\'s public key', 'Nate\'s private key', 'Your public key', 'Your private key'], a: 0, why: 'Encrypt with the recipient\'s PUBLIC key; only their matching PRIVATE key can decrypt it. That\'s confidentiality.' },
              { t: 'mcq', q: 'Now you want to prove a message really came from YOU. Which key do you sign with?', opts: ['The recipient\'s public key', 'Your private key', 'The recipient\'s private key', 'A shared symmetric key'], a: 1, why: 'Sign with YOUR private key. Anyone can verify with your public key, proving only you could have sent it — that\'s non-repudiation.' },
              { t: 'match', q: 'Match the algorithm to its type.', pairs: [['AES', 'Symmetric'], ['RSA', 'Asymmetric'], ['ChaCha20', 'Symmetric'], ['ECC', 'Asymmetric']], why: 'AES and ChaCha20 are symmetric (one key, fast). RSA and ECC are asymmetric (key pairs). ECC gives the same strength as RSA with much smaller keys.' },
              { t: 'tf', q: 'Symmetric encryption like AES is generally much faster than asymmetric encryption like RSA.', a: true, why: 'True — that\'s exactly why we use asymmetric only to exchange a key, then switch to fast symmetric AES for the bulk data.' }
            ]
          },
          {
            id: 'sp-hash-lab', title: 'Lab: hashing & integrity', min: 5, teaser: 'Watch one letter change the entire fingerprint.',
            links: ['sp-crypto-why', 'sp-pw-lab'],
            cards: [
              { t: 'read', h: 'A hash is a one-way fingerprint', body: '<p>A <b>hash function</b> takes any input and produces a fixed-size "fingerprint." Three properties matter:</p><ul><li><b>One-way</b> — you can\'t reverse it back to the input.</li><li><b>Deterministic</b> — same input always gives the same hash.</li><li><b>Avalanche</b> — change one tiny thing and the output changes completely.</li></ul><p>Hashing proves <b>integrity</b>: if two files have the same SHA-256 hash, they\'re identical. If one bit differs, the hashes won\'t match.</p>' },
              { t: 'hashlab', h: 'Try it', body: '<p>This computes a real SHA-256 hash in your browser. Type something, then change a single letter and watch how much of the 64-character output flips.</p>', start: 'nate was here' },
              { t: 'mcq', q: 'You download a Linux ISO and the site lists a SHA-256 value. You hash your file and it matches. What did you just verify?', opts: ['The file is encrypted', 'The file wasn\'t corrupted or tampered with (integrity)', 'The file is from a trusted sender (authentication)', 'Nobody can read the file (confidentiality)'], a: 1, why: 'A matching hash proves integrity — the bytes are exactly what the publisher posted. By itself it doesn\'t prove who made it (that needs a signature).' },
              { t: 'tf', q: 'MD5 and SHA-1 are still recommended for security because they\'re fast.', a: false, why: 'Both are broken for security use — attackers can create collisions (two different inputs with the same hash). Use SHA-256 or SHA-3. Speed is actually bad for password hashing.' },
              { t: 'read', h: 'Salting (comes up a lot)', body: '<p>If you just hash passwords, two users with the password "dragon" get the identical hash — and attackers use precomputed "rainbow tables" to reverse common hashes instantly.</p><p>A <b>salt</b> is a random value added to each password before hashing. Now "dragon" hashes differently for every user, rainbow tables are useless, and identical passwords look different in the database.</p>', mem: 'Salt = random, per-user, defeats rainbow tables. Pepper = a secret salt stored separately.' }
            ]
          },
          {
            id: 'sp-cipher-lab', title: 'Lab: crack a Caesar cipher', min: 4, teaser: 'The oldest trick in the book. Break it by hand.',
            links: ['sp-crypto-why'],
            cards: [
              { t: 'read', h: 'The 2,000-year-old cipher', body: '<p>The <b>Caesar cipher</b> shifts every letter by a fixed amount. Shift by 3 and A→D, B→E, and so on. Julius Caesar really used it.</p><p>It\'s trivially weak: there are only 25 possible shifts, so you can just try them all. That brute-force approach — trying every key until the output makes sense — is exactly how modern attackers think too, just at an enormous scale.</p>' },
              { t: 'cipher', q: 'An intercepted message. Slide the key until it reads as English, then lock it in.', plain: 'ATTACK AT DAWN', shift: 7, why: 'With only 25 keys, brute force is instant. This is why real ciphers need astronomically large keyspaces — so "try them all" takes longer than the universe has left.' },
              { t: 'cipher', q: 'One more. Find the shift.', plain: 'KEEP YOUR KEYS SECRET', shift: 19, why: 'The lesson of the cipher: the algorithm can be public (everyone knows "it\'s a Caesar shift") as long as the KEY stays secret. That\'s Kerckhoffs\'s principle, and modern crypto follows it.' },
              { t: 'mcq', q: 'The Caesar cipher teaches a key security principle. Which?', opts: ['Keep the algorithm secret', 'Security should rest on the secret key, not a secret algorithm', 'Longer messages are safer', 'Never write anything down'], a: 1, why: 'Kerckhoffs\'s principle: assume the enemy knows your system. Only the key should be secret. "Security through obscurity" alone is not real security.' }
            ]
          }
        ]
      },
      {
        name: 'Terminal labs',
        tag: 'hands-on',
        blurb: 'A simulated Linux shell in your browser. Type the real commands, see real-looking output, learn by doing. Totally safe — nothing leaves this page.',
        lessons: [
          {
            id: 'sp-linux-lab', title: 'Lab: Linux survival kit', min: 7, teaser: 'The commands you\'ll type a thousand times. Learn them in a fake shell.',
            links: ['sp-logs-lab', 'cs-filesystems'],
            cards: [
              { t: 'read', h: 'Why the command line', body: '<p>Security work lives in the terminal. Servers often have no desktop at all — just a prompt. The good news: a handful of commands cover 90% of daily use.</p><p>Below is a <b>simulated</b> shell. It understands a small set of commands and shows you realistic output. Type each command the task asks for. Stuck? Tap "Show me the command."</p>' },
              {
                t: 'term', host: 'websrv01', user: 'nate',
                motd: 'Welcome to the simulated lab shell. Your commands run against a pretend server.',
                win: 'That\'s the core navigation set. You just did what sysadmins do every morning.',
                tasks: [
                  { goal: 'Find out who you\'re logged in as.', re: '^whoami$', show: 'whoami', out: 'nate', note: 'Good habit before running anything risky — know your identity.', hint: 'One word: who am i, no spaces.' },
                  { goal: 'Print the folder you\'re currently in (print working directory).', re: '^pwd$', show: 'pwd', out: '/home/nate', note: 'pwd = print working directory.', hint: 'Three letters: print working directory.' },
                  { goal: 'List the files here, including hidden ones and details. (long + all)', re: '^ls\\s+-(la|al|l\\s+-a|a\\s+-l)$', show: 'ls -la', out: 'drwxr-xr-x  nate  nate   notes.txt  .bashrc  reports  secret.txt', note: 'Files starting with a dot are hidden. -l = long detail, -a = all.', hint: 'ls with the flags -l and -a, e.g. "ls -la".' },
                  { goal: 'Change into the "reports" folder.', re: '^cd\\s+reports/?$', show: 'cd reports', note: 'cd = change directory. Watch the prompt path change.', hint: 'cd then the folder name.' },
                  { goal: 'Read the contents of q3.txt onto the screen.', re: '^cat\\s+q3\\.txt$', show: 'cat q3.txt', out: 'Q3 revenue up 12%. Full numbers attached.', note: 'cat dumps a file to the screen. Great for small text files.', hint: 'cat then the filename q3.txt' }
                ],
                extra: [
                  { re: '^ls$', out: 'notes.txt  reports  secret.txt' },
                  { re: '^help$', out: 'Try: whoami, pwd, ls -la, cd, cat' }
                ]
              },
              { t: 'mcq', q: 'You\'re lost in the filesystem and want to know where you are. Which command?', opts: ['ls', 'pwd', 'whoami', 'cd'], a: 1, why: 'pwd = print working directory. It answers "where am I right now?"' },
              { t: 'match', q: 'Match command to job.', pairs: [['ls', 'list files'], ['cd', 'change folder'], ['cat', 'show a file'], ['pwd', 'where am I']], why: 'These four plus grep get you through most days.' }
            ]
          },
          {
            id: 'sp-logs-lab', title: 'Lab: catch an intruder in the logs', min: 8, teaser: 'A login looks wrong. Use grep to prove it. This is real SOC work.',
            links: ['sp-social', 'sp-siem'],
            cards: [
              { t: 'read', h: 'The analyst\'s instinct', body: '<p>When something feels off, you don\'t read a million log lines by eye — you <b>grep</b> for the thread. <code>grep</code> searches text for a pattern and prints matching lines.</p><p>In this lab, a user account may have been stolen. You\'ll pull the auth log, filter it, and find the "impossible travel" you read about earlier: the same account logging in from two continents minutes apart.</p>' },
              {
                t: 'term', host: 'logserver', user: 'nate', cwd: '/var/log',
                win: 'You just worked a real detection: filter the noise, spot the anomaly, confirm the compromise. That\'s a day in a SOC.',
                tasks: [
                  { goal: 'List the log files in /var/log.', re: '^ls$|^ls\\s', show: 'ls', out: 'auth.log  syslog  nginx', note: 'auth.log holds login attempts. Start there.', hint: 'Just "ls".' },
                  { goal: 'Search auth.log for only the FAILED logins.', re: '^grep\\s+(-i\\s+)?["\']?[Ff]ailed["\']?\\s+auth\\.log$', show: 'grep Failed auth.log', out: 'Jan31 02:14 sshd Failed password for jdoe from 185.220.101.4\nJan31 02:14 sshd Failed password for jdoe from 185.220.101.4\nJan31 02:15 sshd Failed password for jdoe from 185.220.101.4\n... (47 more)', note: '50 failed attempts for one user in a minute = a brute-force / password-spray attempt.', hint: 'grep then the word Failed then auth.log' },
                  { goal: 'Now search for the ACCEPTED logins for user jdoe.', re: '^grep\\s+(-i\\s+)?["\']?[Aa]ccepted["\']?\\s+auth\\.log$', show: 'grep Accepted auth.log', out: 'Jan31 02:16 sshd Accepted password for jdoe from 185.220.101.4\nJan31 02:19 sshd Accepted password for jdoe from 203.0.113.8', note: 'After all those failures, one SUCCEEDED. The brute force worked.', hint: 'Same as before but search for Accepted' },
                  { goal: 'Count how many times the attacker IP 185.220.101.4 appears. (grep -c)', re: '^grep\\s+-c\\s+["\']?185\\.220\\.101\\.4["\']?\\s+auth\\.log$', show: 'grep -c 185.220.101.4 auth.log', out: '49', note: 'grep -c counts matching lines. 49 hits from one IP seals it.', hint: 'Add -c to grep to count: grep -c 185.220.101.4 auth.log' }
                ],
                extra: [
                  { re: '^cat\\s+auth\\.log$', out: '(hundreds of lines — too many to read by eye. That\'s why we grep.)' },
                  { re: '^grep', out: 'grep: that pattern/file combo found nothing. Check spelling — try "Failed auth.log".' }
                ]
              },
              { t: 'mcq', q: 'In the log, jdoe fails 47 times from one IP, then succeeds, then logs in from a second IP minutes later. What happened?', opts: ['Normal login', 'A brute-force attack succeeded, then the attacker used the stolen account', 'The server crashed', 'A scheduled backup'], a: 1, why: 'Many failures then a success = the brute force broke in. The second, distant IP minutes later is the impossible-travel confirmation. Response: lock the account, force a password reset, hunt for what jdoe accessed.' },
              { t: 'fill', q: 'What single command counts how many lines in a file match a pattern? (just the command and flag)', a: ['grep -c', 'grep-c'], why: 'grep -c counts matching lines — fast way to size up how noisy an IP or error is.' },
              { t: 'deep', h: 'From grep to a SIEM', teaser: 'How this scales to thousands of servers.', hole: 'sp-siem', body: '<p>Grepping one file is great for one box. Across a whole company, you can\'t SSH into every server. A <b>SIEM</b> (Security Information and Event Management) system collects logs from everything into one place and lets you search and alert across all of it.</p><p>The thinking is identical to what you just did — filter, correlate, spot the anomaly — just automated and at scale, with rules that fire an alert the moment an "impossible travel" or a 50-failure burst shows up.</p>' }
            ]
          },
          {
            id: 'sp-netscan-lab', title: 'Lab: map a network with ping & scans', min: 7, teaser: 'See what\'s alive and what ports are open — the recon every defender must understand.',
            links: ['sp-ports', 'sp-firewall'],
            cards: [
              { t: 'read', h: 'Know your own network first', body: '<p>Before you can defend a network, you need to know what\'s on it and what doors are open. Defenders scan their <i>own</i> networks constantly to find forgotten, exposed services before attackers do.</p><p>In this simulated lab you\'ll check if a host is alive with <code>ping</code>, then see which ports are open. (Real scanning tools are powerful — only ever point them at systems you own or are authorized to test.)</p>' },
              {
                t: 'term', host: 'kali', user: 'nate', cwd: '/home/nate',
                win: 'You mapped a host end to end: alive? which services? That inventory is step one of both attack and defense.',
                tasks: [
                  { goal: 'Check whether the server 10.0.0.5 is alive. Send a few pings.', re: '^ping\\s+(-c\\s*\\d+\\s+)?10\\.0\\.0\\.5$', show: 'ping -c 4 10.0.0.5', out: 'PING 10.0.0.5: 64 bytes time=1.2 ms\n64 bytes time=1.1 ms\n64 bytes time=1.3 ms\n64 bytes time=1.2 ms\n--- 4 packets transmitted, 4 received, 0% loss', note: 'Replies = host is up. ping uses ICMP echo request/reply.', hint: 'ping 10.0.0.5 (add -c 4 to send just 4).' },
                  { goal: 'Scan 10.0.0.5 to see which ports are open.', re: '^(sudo\\s+)?nmap\\s+10\\.0\\.0\\.5$', show: 'nmap 10.0.0.5', out: 'Starting scan...\nPORT     STATE  SERVICE\n22/tcp   open   ssh\n80/tcp   open   http\n443/tcp  open   https\n3306/tcp open   mysql\nScan done: 1 host up', note: 'Four open ports. Port 3306 (MySQL) exposed to the network is a red flag — databases usually shouldn\'t be reachable from outside.', hint: 'nmap then the IP: nmap 10.0.0.5' },
                  { goal: 'The exposed database worries you. Confirm what service runs on port 3306 (see the scan — which service?). Type: identify 3306', re: '^identify\\s+3306$', show: 'identify 3306', out: 'Port 3306 → MySQL database. Exposing this to the internet is dangerous: it should sit behind a firewall, reachable only by the app server.', note: 'Finding and closing exposed services like this is exactly what hardening means.', hint: 'Type literally: identify 3306' }
                ],
                extra: [
                  { re: '^nmap$', out: 'Usage: nmap <target>. Try: nmap 10.0.0.5' },
                  { re: '^ping$', out: 'Usage: ping <host>. Try: ping 10.0.0.5' }
                ]
              },
              { t: 'mcq', q: 'Your scan of a web server shows port 3306 (MySQL) open to the internet. The right move is to:', opts: ['Nothing, more ports is better', 'Restrict it with a firewall so only the app server can reach the database', 'Turn off the web server', 'Change the database to port 80'], a: 1, why: 'Databases should never be exposed to the whole internet. Firewall it so only the specific hosts that need it can connect. This is "reduce the attack surface."' },
              { t: 'tf', q: 'It is fine to run port scans against any server on the internet to practice.', a: false, why: 'No. Only scan systems you own or have written authorization to test. Unauthorized scanning can be illegal. For practice, use your own lab, intentionally-vulnerable VMs, or sanctioned ranges.' }
            ]
          }
        ]
      },
      {
        name: 'Networks & defense',
        tag: 'Domains 3-4',
        blurb: 'Ports, firewalls, segmentation, and the tools that watch the wire.',
        lessons: [
          {
            id: 'sp-ports', title: 'Ports & protocols cheat sheet', min: 6, teaser: 'The port numbers the exam will absolutely ask about.',
            links: ['sp-netscan-lab', 'sp-tls', 'cs-how-internet'],
            cards: [
              { t: 'read', h: 'Ports are numbered doors', body: '<p>One server, one IP address — but many services. <b>Ports</b> are how it keeps them straight. A port is just a number (0–65535) that says "send this to the web service" or "send this to email."</p><p>Memorize the common ones. The exam tests them directly.</p>', mem: 'Secure versions usually live on a different port: HTTP 80 → HTTPS 443, FTP 21 → SFTP 22.' },
              { t: 'match', q: 'Match the service to its default port.', pairs: [['HTTP', '80'], ['HTTPS', '443'], ['SSH / SFTP', '22'], ['DNS', '53']], why: 'HTTP 80, HTTPS 443, SSH 22, DNS 53. These four come up constantly.' },
              { t: 'match', q: 'Round two.', pairs: [['RDP (remote desktop)', '3389'], ['SMTP (send mail)', '25'], ['MySQL', '3306'], ['FTP', '21']], why: 'RDP 3389, SMTP 25, MySQL 3306, FTP 21. Seeing RDP (3389) open to the internet is a classic exam "what\'s wrong here."' },
              { t: 'mcq', q: 'A packet arrives for port 443. What\'s it almost certainly for?', opts: ['Email', 'Encrypted web traffic (HTTPS)', 'A DNS lookup', 'Remote desktop'], a: 1, why: '443 is HTTPS — encrypted web. 80 is plain HTTP.' },
              { t: 'mcq', q: 'Which protocol translates "example.com" into an IP address, and runs on port 53?', opts: ['DHCP', 'DNS', 'ARP', 'SMTP'], a: 1, why: 'DNS (Domain Name System) is the internet\'s phonebook — names to IPs — on port 53.' },
              { t: 'tf', q: 'TCP guarantees delivery and order; UDP is faster but "fire and forget" with no guarantee.', a: true, why: 'TCP = reliable, ordered, connection-based (web, email). UDP = fast, no handshake, fine to lose a little (video, DNS, games).' }
            ]
          },
          {
            id: 'sp-firewall', title: 'Firewalls & segmentation', min: 5, teaser: 'The bouncer at every door, and why you split the building into rooms.',
            links: ['sp-ports', 'sp-zero-trust'],
            cards: [
              { t: 'read', h: 'Default deny', body: '<p>A <b>firewall</b> allows or blocks traffic based on rules (source, destination, port, protocol). The golden rule: <b>default deny</b> — block everything, then open only exactly what\'s needed. The opposite ("allow everything, block the bad stuff") always leaves holes.</p><p>Firewall rules are read <b>top to bottom, first match wins</b>. Order matters: a broad "allow" above a specific "deny" can accidentally let the bad traffic through.</p>', mem: 'Default deny, then allow by exception. First matching rule wins.' },
              { t: 'order', q: 'Order these firewall rules so the specific block actually takes effect (top = evaluated first).', items: ['DENY traffic from 203.0.113.9 (known attacker)', 'ALLOW HTTPS (443) to the web server', 'DENY all other traffic'], why: 'Specific denies go first, then specific allows, then the catch-all deny. If "allow 443" sat above the attacker-deny, the attacker could still reach 443.' },
              { t: 'read', h: 'Segmentation & the DMZ', body: '<p><b>Network segmentation</b> splits one flat network into zones, so a breach in one can\'t freely spread to all. Think watertight compartments in a ship.</p><p>A <b>DMZ</b> (demilitarized zone) is a buffer zone for things the public must reach — like your web server. It sits between the internet and your private internal network, so even if the web server is popped, the attacker isn\'t automatically inside your sensitive internal systems.</p>' },
              { t: 'mcq', q: 'Why put a public web server in a DMZ instead of your internal network?', opts: ['It\'s faster', 'So a compromise of the web server doesn\'t give direct access to internal systems', 'DMZs are required by law', 'To save IP addresses'], a: 1, why: 'The DMZ contains the blast radius. The web server is the most exposed box, so you isolate it from the trusted internal network.' },
              { t: 'tf', q: 'Microsegmentation and "least privilege" both aim to limit how far an attacker can move after getting in.', a: true, why: 'Exactly. Limit lateral movement. Least privilege limits what each account can touch; segmentation limits what each machine can reach.' }
            ]
          },
          {
            id: 'sp-siem', title: 'SIEM, IDS/IPS & monitoring', min: 5, teaser: 'The eyes and ears — and the thing that can slam the door shut.',
            links: ['sp-logs-lab', 'sp-firewall'],
            cards: [
              { t: 'read', h: 'Watchers vs stoppers', body: '<ul><li><b>IDS</b> (Intrusion <i>Detection</i> System) — watches traffic and <b>alerts</b> on something suspicious. It\'s a smoke detector: it yells, it doesn\'t act.</li><li><b>IPS</b> (Intrusion <i>Prevention</i> System) — same detection, but it can <b>block</b> the traffic in real time. A sprinkler: it detects and acts.</li><li><b>SIEM</b> — collects logs from everything, correlates them, and raises alerts across the whole environment (the scaled-up grep from your lab).</li><li><b>SOAR</b> — adds automation: it can run a response playbook automatically (disable an account, isolate a host).</li></ul>', mem: 'IDS detects (alerts). IPS prevents (blocks). The extra P is for "Prevent."' },
              { t: 'mcq', q: 'A device spots a known attack signature and immediately drops those packets before they reach the server. That\'s an:', opts: ['IDS', 'IPS', 'SIEM', 'VPN'], a: 1, why: 'Detecting AND actively blocking = IPS (Intrusion Prevention System). An IDS would only alert.' },
              { t: 'match', q: 'Match the tool to its one-line job.', pairs: [['SIEM', 'Collect & correlate all logs'], ['IDS', 'Alert on suspicious traffic'], ['IPS', 'Block suspicious traffic'], ['SOAR', 'Automate the response']], why: 'This four-way distinction is a common exam question.' },
              { t: 'read', h: 'Signature vs anomaly detection', body: '<p>Two ways these tools decide what\'s bad:</p><ul><li><b>Signature-based</b> — matches known patterns (like antivirus definitions). Great for known threats, blind to brand-new ones.</li><li><b>Anomaly / behavior-based</b> — learns "normal," flags deviations. Can catch novel attacks, but produces more <b>false positives</b>.</li></ul><p>A <b>false positive</b> is a false alarm; a <b>false negative</b> is a real attack it missed. False negatives are the scarier ones.</p>' },
              { t: 'tf', q: 'A false negative (missing a real attack) is generally more dangerous than a false positive (a false alarm).', a: true, why: 'A false alarm wastes time; a miss means an attacker is inside and nobody knows. That said, too many false positives cause "alert fatigue," which leads to real alerts being ignored.' }
            ]
          }
        ]
      },
      {
        name: 'Access, risk & resilience',
        tag: 'Domains 4-5',
        blurb: 'Who gets in, how much it hurts if they do, and how you bounce back.',
        lessons: [
          {
            id: 'sp-mfa', title: 'MFA & passwordless', min: 5, teaser: 'Why your phone code beats any password.',
            links: ['sp-aaa', 'sp-pw-lab'],
            cards: [
              { t: 'read', h: 'Why one factor isn\'t enough', body: '<p>Passwords get phished, guessed, and reused. <b>Multi-factor authentication</b> adds a second, different-category factor so a stolen password alone is useless.</p><p>Strength roughly, weakest to strongest:</p><ul><li><b>SMS codes</b> — better than nothing, but vulnerable to SIM-swap attacks.</li><li><b>Authenticator app (TOTP)</b> — a 6-digit code that changes every 30 seconds, generated offline. Solid.</li><li><b>Push approval</b> — tap "yes" on your phone. Watch for "MFA fatigue" spam attacks.</li><li><b>Hardware security key (FIDO2)</b> — a physical key; phishing-resistant because it checks the real site\'s identity. The gold standard.</li></ul>', mem: 'Hardware keys (FIDO2) are phishing-resistant — they won\'t hand your login to a fake site, because the key verifies the domain.' },
              { t: 'mcq', q: 'Why is a FIDO2 hardware key considered "phishing-resistant" when an SMS code isn\'t?', opts: ['It\'s longer', 'It cryptographically checks it\'s talking to the real site, so it won\'t authenticate to a lookalike', 'It never expires', 'It\'s encrypted'], a: 1, why: 'The key is bound to the real domain. On a phishing clone, it simply won\'t work — whereas you can be tricked into typing an SMS code into a fake page.' },
              { t: 'mcq', q: 'An attacker spams a user with dozens of push notifications at 3am hoping they tap "approve" to make it stop. This attack is called:', opts: ['SIM swapping', 'MFA fatigue (push bombing)', 'Credential stuffing', 'Pass-the-hash'], a: 1, why: 'MFA fatigue / push bombing wears the victim down. Defenses: number matching, limiting prompts, and user training.' },
              { t: 'tf', q: 'A smart card plus a PIN is true multi-factor authentication.', a: true, why: 'Smart card = something you have, PIN = something you know. Two different categories = real MFA.' }
            ]
          },
          {
            id: 'sp-pw-lab', title: 'Lab: how fast is your password cracked?', min: 5, teaser: 'Type a password, watch the "time to crack" meter move.',
            links: ['sp-mfa', 'sp-hash-lab'],
            cards: [
              { t: 'read', h: 'Length beats complexity', body: '<p>Everyone\'s been taught "add a symbol and a number." But the single biggest factor is <b>length</b>. Each extra character multiplies the attacker\'s work.</p><p>A short password with symbols (<code>P@ss1!</code>) falls fast. A long passphrase of ordinary words (<code>correct horse battery staple</code>) is far stronger and easier to remember. Try it below — don\'t use a real password.</p>' },
              { t: 'pwlab', after: 'Takeaways: (1) length wins, (2) dictionary words get tried first, so avoid them, (3) a password manager generating long random strings is the real answer. These are estimates assuming an offline attack on a stolen hash.' },
              { t: 'mcq', q: 'Based on the lab, which is strongest against brute force?', opts: ['P@ss1!', 'Summer2024!', 'a 20-character random passphrase', 'dragon'], a: 2, why: 'Length dominates. A 20-character string has an astronomically bigger keyspace than any short "complex" password, and no dictionary words to shortcut.' },
              { t: 'read', h: 'Credential stuffing & reuse', body: '<p>When one site gets breached, attackers take those username/password pairs and try them on hundreds of other sites — because people reuse passwords. That\'s <b>credential stuffing</b>.</p><p>Defenses: never reuse passwords (a manager makes this painless), turn on MFA everywhere, and check if your email appears in known breaches.</p>', mem: 'One password, many sites = one breach, many accounts. Reuse is the real killer.' }
            ]
          },
          {
            id: 'sp-risk', title: 'Risk: the language of the business', min: 6, teaser: 'ALE, RTO, and the formulas that decide what gets funded.',
            links: ['sp-backups', 'sp-cia'],
            cards: [
              { t: 'read', h: 'Risk = likelihood × impact', body: '<p>Security isn\'t about blocking everything — it\'s about spending wisely on the biggest risks. The exam makes you quantify it.</p><ul><li><b>SLE</b> (Single Loss Expectancy) = value of the asset × how much of it one incident destroys (the "exposure factor").</li><li><b>ARO</b> (Annualized Rate of Occurrence) = how many times per year you expect it.</li><li><b>ALE</b> (Annualized Loss Expectancy) = SLE × ARO. This is the number you compare against the cost of a control.</li></ul>', mem: 'ALE = SLE × ARO. If a control costs less than the ALE it removes, it probably pays for itself.' },
              { t: 'calc', q: 'A laptop is worth $2,000. If stolen, you lose 100% of it. You expect 3 stolen per year. What\'s the ALE? (just the number)', a: 6000, show: '$6,000', tol: 1, why: 'SLE = $2,000 × 100% = $2,000. ALE = SLE × ARO = $2,000 × 3 = $6,000 per year. A $1,000/yr tracking program easily pays for itself here.' },
              { t: 'read', h: 'The four responses to risk', body: '<ul><li><b>Mitigate</b> — reduce it (install a control).</li><li><b>Transfer</b> — shift it to someone else (buy insurance).</li><li><b>Avoid</b> — stop doing the risky activity entirely.</li><li><b>Accept</b> — decide the risk is small enough to live with (and document it).</li></ul>', mem: 'Mitigate, Transfer, Avoid, Accept. Buying cyber-insurance is the classic "transfer."' },
              { t: 'match', q: 'Match the action to the risk response.', pairs: [['Buy cyber-insurance', 'Transfer'], ['Install a firewall', 'Mitigate'], ['Stop storing credit cards', 'Avoid'], ['Sign off on a minor risk', 'Accept']], why: 'These four show up constantly in scenario questions.' },
              { t: 'mcq', q: 'RTO vs RPO: a backup runs every 6 hours, and you can be down at most 2 hours. Which is which?', opts: ['RTO = 6h, RPO = 2h', 'RTO = 2h (max downtime), RPO = 6h (max data loss)', 'Both are 2h', 'Neither applies'], a: 1, why: 'RTO (Recovery Time Objective) = how fast you must be back up (2h). RPO (Recovery Point Objective) = how much data you can afford to lose, set by backup frequency (6h). Tighter targets cost more.' }
            ]
          },
          {
            id: 'sp-backups', title: 'Backups & incident response', min: 6, teaser: 'When it all goes wrong — the steps that save the company.',
            links: ['sp-risk', 'sp-malware'],
            cards: [
              { t: 'read', h: 'The 3-2-1 rule', body: '<p>Backups are the single best defense against ransomware and disasters. The standard:</p><p><b>3</b> copies of your data, on <b>2</b> different types of media, with <b>1</b> copy offsite (and ideally offline/immutable, so ransomware can\'t reach it).</p><p>And the part everyone skips: <b>test your restores</b>. A backup you\'ve never restored is a hope, not a plan.</p>', mem: '3-2-1: three copies, two media, one offsite. An untested backup is Schrödinger\'s backup.' },
              { t: 'order', q: 'Put the incident response phases in the official order.', items: ['Preparation', 'Detection & analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons learned'], why: 'Prepare → Detect → Contain → Eradicate → Recover → Lessons learned. Containment comes before eradication: stop the bleeding first, then remove the threat.' },
              { t: 'mcq', q: 'You discover malware actively spreading between servers. What\'s the immediate priority?', opts: ['Figure out who the attacker is', 'Containment — isolate affected systems to stop the spread', 'Write the incident report', 'Restore from backup right away'], a: 1, why: 'Contain first: stop the bleeding by isolating/segmenting affected hosts. Attribution and reports come later; restoring before eradication just re-infects.' },
              { t: 'mcq', q: 'During containment, why might you avoid simply powering off a compromised machine?', opts: ['It wastes electricity', 'You could destroy volatile evidence in RAM (running processes, keys, network connections)', 'It\'s against the law', 'Backups run at shutdown'], a: 1, why: 'Order of volatility: RAM, running processes, and live connections vanish on power-off. For forensics, capture volatile data first, then isolate (pull network, not power).' },
              { t: 'tf', q: 'The "lessons learned" phase exists to assign blame to whoever caused the incident.', a: false, why: 'It\'s blameless by design. The point is to improve — what detection was missed, what control would have helped — so the same thing doesn\'t happen twice. Blame culture makes people hide incidents.' }
            ]
          }
        ]
      }
    ]
  });
})();
