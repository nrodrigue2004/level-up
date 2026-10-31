/* Security+ hands-on labs (simulated, defensive, canned output). Appended as the last unit of the secplus subject. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === "secplus"; })[0]; if (!S) return;
  S.units.push({ name: "Hands-on labs", tag: "do it", blurb: "Practice in safe simulations: spot a phish, hash files, crack a toy cipher, survive a Linux shell, catch an intruder in logs, map a network you are authorized to scan, and test password strength.", lessons: [
    {
      "id": "sp-phish-lab",
      "title": "Lab: spot the phish",
      "min": 6,
      "teaser": "A real-looking email. Find every red flag before it finds you.",
      "links": [
        "sp-social",
        "sp-filter"
      ],
      "cards": [
        {
          "t": "read",
          "h": "The checklist",
          "body": "<p>Before you click anything, scan for these:</p><ol><li><b>Sender address</b> — does the domain actually match the real company? (micros0ft.com is not microsoft.com)</li><li><b>Greeting</b> — generic \"Dear Customer\" instead of your name.</li><li><b>Urgency / threats</b> — act now or else.</li><li><b>Link mismatch</b> — the visible text says one thing, the real URL goes elsewhere.</li><li><b>Attachments</b> you didn't expect, especially .zip, .exe, or a \"receipt\" .html.</li><li><b>Odd grammar</b> or slightly-off branding.</li></ol>"
        },
        {
          "t": "phish",
          "head": [
            {
              "x": "From: PayPaI Security <service@paypaI-alerts.com>",
              "f": "<b>Sender domain is fake:</b> that's a capital I pretending to be an L — \"paypaI\", not \"paypal\"."
            },
            "Subject: Receipt for your order"
          ],
          "parts": [
            "Dear",
            {
              "x": "Valued Customer,",
              "f": "<b>Generic greeting.</b> A real receipt would use your name."
            },
            "We have charged your account",
            {
              "x": "$739.95",
              "f": "<b>Fake charge to create panic</b> — makes you want to \"cancel\" fast without thinking."
            },
            "for a new device. If you did not authorize this,",
            {
              "x": "you must verify within 24 hours or your account will be permanently suspended.",
              "f": "<b>Urgency + threat.</b> Real companies rarely threaten permanent suspension on a 24-hour clock."
            },
            "Click here to dispute:",
            {
              "x": "http://paypal.account-verify.ru/login",
              "f": "<b>Link mismatch.</b> The real domain is \"account-verify.ru\", not paypal.com. The .ru and the odd subdomain are dead giveaways."
            },
            "Thank you for your",
            {
              "x": "buisness.",
              "f": "<b>Misspelling</b> (\"buisness\"). Sloppy spelling is a classic phishing tell."
            }
          ],
          "why": "Six flags: fake lookalike domain, generic greeting, invented charge, a 24-hour threat, a link that goes to a .ru domain, and a spelling error. Any one should make you stop."
        },
        {
          "t": "mcq",
          "q": "The safest response to a suspicious \"account problem\" email is to:",
          "opts": [
            "Click the link but don't enter a password",
            "Reply asking if it's real",
            "Ignore the email and log in by typing the site's address yourself",
            "Forward it to coworkers to warn them"
          ],
          "a": 2,
          "why": "Never trust the email's links. Open a browser and type the known address (or use your saved bookmark). If there's a real problem, you'll see it there."
        }
      ]
    },
    {
      "id": "sp-hash-lab",
      "title": "Lab: hashing & integrity",
      "min": 5,
      "teaser": "Watch one letter change the entire fingerprint.",
      "links": [
        "sp-crypto-why",
        "sp-pw-lab"
      ],
      "cards": [
        {
          "t": "read",
          "h": "A hash is a one-way fingerprint",
          "body": "<p>A <b>hash function</b> takes any input and produces a fixed-size \"fingerprint.\" Three properties matter:</p><ul><li><b>One-way</b> — you can't reverse it back to the input.</li><li><b>Deterministic</b> — same input always gives the same hash.</li><li><b>Avalanche</b> — change one tiny thing and the output changes completely.</li></ul><p>Hashing proves <b>integrity</b>: if two files have the same SHA-256 hash, they're identical. If one bit differs, the hashes won't match.</p>"
        },
        {
          "t": "hashlab",
          "h": "Try it",
          "body": "<p>This computes a real SHA-256 hash in your browser. Type something, then change a single letter and watch how much of the 64-character output flips.</p>",
          "start": "nate was here"
        },
        {
          "t": "mcq",
          "q": "You download a Linux ISO and the site lists a SHA-256 value. You hash your file and it matches. What did you just verify?",
          "opts": [
            "The file is encrypted",
            "The file wasn't corrupted or tampered with (integrity)",
            "The file is from a trusted sender (authentication)",
            "Nobody can read the file (confidentiality)"
          ],
          "a": 1,
          "why": "A matching hash proves integrity — the bytes are exactly what the publisher posted. By itself it doesn't prove who made it (that needs a signature)."
        },
        {
          "t": "tf",
          "q": "MD5 and SHA-1 are still recommended for security because they're fast.",
          "a": false,
          "why": "Both are broken for security use — attackers can create collisions (two different inputs with the same hash). Use SHA-256 or SHA-3. Speed is actually bad for password hashing."
        },
        {
          "t": "read",
          "h": "Salting (comes up a lot)",
          "body": "<p>If you just hash passwords, two users with the password \"dragon\" get the identical hash — and attackers use precomputed \"rainbow tables\" to reverse common hashes instantly.</p><p>A <b>salt</b> is a random value added to each password before hashing. Now \"dragon\" hashes differently for every user, rainbow tables are useless, and identical passwords look different in the database.</p>",
          "mem": "Salt = random, per-user, defeats rainbow tables. Pepper = a secret salt stored separately."
        }
      ]
    },
    {
      "id": "sp-cipher-lab",
      "title": "Lab: crack a Caesar cipher",
      "min": 4,
      "teaser": "The oldest trick in the book. Break it by hand.",
      "links": [
        "sp-crypto-why"
      ],
      "cards": [
        {
          "t": "read",
          "h": "The 2,000-year-old cipher",
          "body": "<p>The <b>Caesar cipher</b> shifts every letter by a fixed amount. Shift by 3 and A→D, B→E, and so on. Julius Caesar really used it.</p><p>It's trivially weak: there are only 25 possible shifts, so you can just try them all. That brute-force approach — trying every key until the output makes sense — is exactly how modern attackers think too, just at an enormous scale.</p>"
        },
        {
          "t": "cipher",
          "q": "An intercepted message. Slide the key until it reads as English, then lock it in.",
          "plain": "ATTACK AT DAWN",
          "shift": 7,
          "why": "With only 25 keys, brute force is instant. This is why real ciphers need astronomically large keyspaces — so \"try them all\" takes longer than the universe has left."
        },
        {
          "t": "cipher",
          "q": "One more. Find the shift.",
          "plain": "KEEP YOUR KEYS SECRET",
          "shift": 19,
          "why": "The lesson of the cipher: the algorithm can be public (everyone knows \"it's a Caesar shift\") as long as the KEY stays secret. That's Kerckhoffs's principle, and modern crypto follows it."
        },
        {
          "t": "mcq",
          "q": "The Caesar cipher teaches a key security principle. Which?",
          "opts": [
            "Keep the algorithm secret",
            "Security should rest on the secret key, not a secret algorithm",
            "Longer messages are safer",
            "Never write anything down"
          ],
          "a": 1,
          "why": "Kerckhoffs's principle: assume the enemy knows your system. Only the key should be secret. \"Security through obscurity\" alone is not real security."
        }
      ]
    },
    {
      "id": "sp-linux-lab",
      "title": "Lab: Linux survival kit",
      "min": 7,
      "teaser": "The commands you'll type a thousand times. Learn them in a fake shell.",
      "links": [
        "sp-logs-lab",
        "cs-filesystems"
      ],
      "cards": [
        {
          "t": "read",
          "h": "Why the command line",
          "body": "<p>Security work lives in the terminal. Servers often have no desktop at all — just a prompt. The good news: a handful of commands cover 90% of daily use.</p><p>Below is a <b>simulated</b> shell. It understands a small set of commands and shows you realistic output. Type each command the task asks for. Stuck? Tap \"Show me the command.\"</p>"
        },
        {
          "t": "term",
          "host": "websrv01",
          "user": "nate",
          "motd": "Welcome to the simulated lab shell. Your commands run against a pretend server.",
          "win": "That's the core navigation set. You just did what sysadmins do every morning.",
          "tasks": [
            {
              "goal": "Find out who you're logged in as.",
              "re": "^whoami$",
              "show": "whoami",
              "out": "nate",
              "note": "Good habit before running anything risky — know your identity.",
              "hint": "One word: who am i, no spaces."
            },
            {
              "goal": "Print the folder you're currently in (print working directory).",
              "re": "^pwd$",
              "show": "pwd",
              "out": "/home/nate",
              "note": "pwd = print working directory.",
              "hint": "Three letters: print working directory."
            },
            {
              "goal": "List the files here, including hidden ones and details. (long + all)",
              "re": "^ls\\s+-(la|al|l\\s+-a|a\\s+-l)$",
              "show": "ls -la",
              "out": "drwxr-xr-x  nate  nate   notes.txt  .bashrc  reports  secret.txt",
              "note": "Files starting with a dot are hidden. -l = long detail, -a = all.",
              "hint": "ls with the flags -l and -a, e.g. \"ls -la\"."
            },
            {
              "goal": "Change into the \"reports\" folder.",
              "re": "^cd\\s+reports/?$",
              "show": "cd reports",
              "note": "cd = change directory. Watch the prompt path change.",
              "hint": "cd then the folder name."
            },
            {
              "goal": "Read the contents of q3.txt onto the screen.",
              "re": "^cat\\s+q3\\.txt$",
              "show": "cat q3.txt",
              "out": "Q3 revenue up 12%. Full numbers attached.",
              "note": "cat dumps a file to the screen. Great for small text files.",
              "hint": "cat then the filename q3.txt"
            }
          ],
          "extra": [
            {
              "re": "^ls$",
              "out": "notes.txt  reports  secret.txt"
            },
            {
              "re": "^help$",
              "out": "Try: whoami, pwd, ls -la, cd, cat"
            }
          ]
        },
        {
          "t": "mcq",
          "q": "You're lost in the filesystem and want to know where you are. Which command?",
          "opts": [
            "ls",
            "pwd",
            "whoami",
            "cd"
          ],
          "a": 1,
          "why": "pwd = print working directory. It answers \"where am I right now?\""
        },
        {
          "t": "match",
          "q": "Match command to job.",
          "pairs": [
            [
              "ls",
              "list files"
            ],
            [
              "cd",
              "change folder"
            ],
            [
              "cat",
              "show a file"
            ],
            [
              "pwd",
              "where am I"
            ]
          ],
          "why": "These four plus grep get you through most days."
        }
      ]
    },
    {
      "id": "sp-logs-lab",
      "title": "Lab: catch an intruder in the logs",
      "min": 8,
      "teaser": "A login looks wrong. Use grep to prove it. This is real SOC work.",
      "links": [
        "sp-social",
        "sp-siem"
      ],
      "cards": [
        {
          "t": "read",
          "h": "The analyst's instinct",
          "body": "<p>When something feels off, you don't read a million log lines by eye — you <b>grep</b> for the thread. <code>grep</code> searches text for a pattern and prints matching lines.</p><p>In this lab, a user account may have been stolen. You'll pull the auth log, filter it, and find the \"impossible travel\" you read about earlier: the same account logging in from two continents minutes apart.</p>"
        },
        {
          "t": "term",
          "host": "logserver",
          "user": "nate",
          "cwd": "/var/log",
          "win": "You just worked a real detection: filter the noise, spot the anomaly, confirm the compromise. That's a day in a SOC.",
          "tasks": [
            {
              "goal": "List the log files in /var/log.",
              "re": "^ls$|^ls\\s",
              "show": "ls",
              "out": "auth.log  syslog  nginx",
              "note": "auth.log holds login attempts. Start there.",
              "hint": "Just \"ls\"."
            },
            {
              "goal": "Search auth.log for only the FAILED logins.",
              "re": "^grep\\s+(-i\\s+)?[\"']?[Ff]ailed[\"']?\\s+auth\\.log$",
              "show": "grep Failed auth.log",
              "out": "Jan31 02:14 sshd Failed password for jdoe from 185.220.101.4\nJan31 02:14 sshd Failed password for jdoe from 185.220.101.4\nJan31 02:15 sshd Failed password for jdoe from 185.220.101.4\n... (47 more)",
              "note": "50 failed attempts for one user in a minute = a brute-force / password-spray attempt.",
              "hint": "grep then the word Failed then auth.log"
            },
            {
              "goal": "Now search for the ACCEPTED logins for user jdoe.",
              "re": "^grep\\s+(-i\\s+)?[\"']?[Aa]ccepted[\"']?\\s+auth\\.log$",
              "show": "grep Accepted auth.log",
              "out": "Jan31 02:16 sshd Accepted password for jdoe from 185.220.101.4\nJan31 02:19 sshd Accepted password for jdoe from 203.0.113.8",
              "note": "After all those failures, one SUCCEEDED. The brute force worked.",
              "hint": "Same as before but search for Accepted"
            },
            {
              "goal": "Count how many times the attacker IP 185.220.101.4 appears. (grep -c)",
              "re": "^grep\\s+-c\\s+[\"']?185\\.220\\.101\\.4[\"']?\\s+auth\\.log$",
              "show": "grep -c 185.220.101.4 auth.log",
              "out": "49",
              "note": "grep -c counts matching lines. 49 hits from one IP seals it.",
              "hint": "Add -c to grep to count: grep -c 185.220.101.4 auth.log"
            }
          ],
          "extra": [
            {
              "re": "^cat\\s+auth\\.log$",
              "out": "(hundreds of lines — too many to read by eye. That's why we grep.)"
            },
            {
              "re": "^grep",
              "out": "grep: that pattern/file combo found nothing. Check spelling — try \"Failed auth.log\"."
            }
          ]
        },
        {
          "t": "mcq",
          "q": "In the log, jdoe fails 47 times from one IP, then succeeds, then logs in from a second IP minutes later. What happened?",
          "opts": [
            "Normal login",
            "A brute-force attack succeeded, then the attacker used the stolen account",
            "The server crashed",
            "A scheduled backup"
          ],
          "a": 1,
          "why": "Many failures then a success = the brute force broke in. The second, distant IP minutes later is the impossible-travel confirmation. Response: lock the account, force a password reset, hunt for what jdoe accessed."
        },
        {
          "t": "fill",
          "q": "What single command counts how many lines in a file match a pattern? (just the command and flag)",
          "a": [
            "grep -c",
            "grep-c"
          ],
          "why": "grep -c counts matching lines — fast way to size up how noisy an IP or error is."
        },
        {
          "t": "deep",
          "h": "From grep to a SIEM",
          "teaser": "How this scales to thousands of servers.",
          "hole": "sp-siem",
          "body": "<p>Grepping one file is great for one box. Across a whole company, you can't SSH into every server. A <b>SIEM</b> (Security Information and Event Management) system collects logs from everything into one place and lets you search and alert across all of it.</p><p>The thinking is identical to what you just did — filter, correlate, spot the anomaly — just automated and at scale, with rules that fire an alert the moment an \"impossible travel\" or a 50-failure burst shows up.</p>"
        }
      ]
    },
    {
      "id": "sp-netscan-lab",
      "title": "Lab: map a network with ping & scans",
      "min": 7,
      "teaser": "See what's alive and what ports are open — the recon every defender must understand.",
      "links": [
        "sp-ports",
        "sp-firewall"
      ],
      "cards": [
        {
          "t": "read",
          "h": "Know your own network first",
          "body": "<p>Before you can defend a network, you need to know what's on it and what doors are open. Defenders scan their <i>own</i> networks constantly to find forgotten, exposed services before attackers do.</p><p>In this simulated lab you'll check if a host is alive with <code>ping</code>, then see which ports are open. (Real scanning tools are powerful — only ever point them at systems you own or are authorized to test.)</p>"
        },
        {
          "t": "term",
          "host": "kali",
          "user": "nate",
          "cwd": "/home/nate",
          "win": "You mapped a host end to end: alive? which services? That inventory is step one of both attack and defense.",
          "tasks": [
            {
              "goal": "Check whether the server 10.0.0.5 is alive. Send a few pings.",
              "re": "^ping\\s+(-c\\s*\\d+\\s+)?10\\.0\\.0\\.5$",
              "show": "ping -c 4 10.0.0.5",
              "out": "PING 10.0.0.5: 64 bytes time=1.2 ms\n64 bytes time=1.1 ms\n64 bytes time=1.3 ms\n64 bytes time=1.2 ms\n--- 4 packets transmitted, 4 received, 0% loss",
              "note": "Replies = host is up. ping uses ICMP echo request/reply.",
              "hint": "ping 10.0.0.5 (add -c 4 to send just 4)."
            },
            {
              "goal": "Scan 10.0.0.5 to see which ports are open.",
              "re": "^(sudo\\s+)?nmap\\s+10\\.0\\.0\\.5$",
              "show": "nmap 10.0.0.5",
              "out": "Starting scan...\nPORT     STATE  SERVICE\n22/tcp   open   ssh\n80/tcp   open   http\n443/tcp  open   https\n3306/tcp open   mysql\nScan done: 1 host up",
              "note": "Four open ports. Port 3306 (MySQL) exposed to the network is a red flag — databases usually shouldn't be reachable from outside.",
              "hint": "nmap then the IP: nmap 10.0.0.5"
            },
            {
              "goal": "The exposed database worries you. Confirm what service runs on port 3306 (see the scan — which service?). Type: identify 3306",
              "re": "^identify\\s+3306$",
              "show": "identify 3306",
              "out": "Port 3306 → MySQL database. Exposing this to the internet is dangerous: it should sit behind a firewall, reachable only by the app server.",
              "note": "Finding and closing exposed services like this is exactly what hardening means.",
              "hint": "Type literally: identify 3306"
            }
          ],
          "extra": [
            {
              "re": "^nmap$",
              "out": "Usage: nmap <target>. Try: nmap 10.0.0.5"
            },
            {
              "re": "^ping$",
              "out": "Usage: ping <host>. Try: ping 10.0.0.5"
            }
          ]
        },
        {
          "t": "mcq",
          "q": "Your scan of a web server shows port 3306 (MySQL) open to the internet. The right move is to:",
          "opts": [
            "Nothing, more ports is better",
            "Restrict it with a firewall so only the app server can reach the database",
            "Turn off the web server",
            "Change the database to port 80"
          ],
          "a": 1,
          "why": "Databases should never be exposed to the whole internet. Firewall it so only the specific hosts that need it can connect. This is \"reduce the attack surface.\""
        },
        {
          "t": "tf",
          "q": "It is fine to run port scans against any server on the internet to practice.",
          "a": false,
          "why": "No. Only scan systems you own or have written authorization to test. Unauthorized scanning can be illegal. For practice, use your own lab, intentionally-vulnerable VMs, or sanctioned ranges."
        }
      ]
    },
    {
      "id": "sp-pw-lab",
      "title": "Lab: how fast is your password cracked?",
      "min": 5,
      "teaser": "Type a password, watch the \"time to crack\" meter move.",
      "links": [
        "sp-mfa",
        "sp-hash-lab"
      ],
      "cards": [
        {
          "t": "read",
          "h": "Length beats complexity",
          "body": "<p>Everyone's been taught \"add a symbol and a number.\" But the single biggest factor is <b>length</b>. Each extra character multiplies the attacker's work.</p><p>A short password with symbols (<code>P@ss1!</code>) falls fast. A long passphrase of ordinary words (<code>correct horse battery staple</code>) is far stronger and easier to remember. Try it below — don't use a real password.</p>"
        },
        {
          "t": "pwlab",
          "after": "Takeaways: (1) length wins, (2) dictionary words get tried first, so avoid them, (3) a password manager generating long random strings is the real answer. These are estimates assuming an offline attack on a stolen hash."
        },
        {
          "t": "mcq",
          "q": "Based on the lab, which is strongest against brute force?",
          "opts": [
            "P@ss1!",
            "Summer2024!",
            "a 20-character random passphrase",
            "dragon"
          ],
          "a": 2,
          "why": "Length dominates. A 20-character string has an astronomically bigger keyspace than any short \"complex\" password, and no dictionary words to shortcut."
        },
        {
          "t": "read",
          "h": "Credential stuffing & reuse",
          "body": "<p>When one site gets breached, attackers take those username/password pairs and try them on hundreds of other sites — because people reuse passwords. That's <b>credential stuffing</b>.</p><p>Defenses: never reuse passwords (a manager makes this painless), turn on MFA everywhere, and check if your email appears in known breaches.</p>",
          "mem": "One password, many sites = one breach, many accounts. Reuse is the real killer."
        }
      ]
    }
  ] });
})();
