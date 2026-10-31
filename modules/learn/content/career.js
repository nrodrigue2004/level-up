/* Find Your Path — a career compass for someone who knows they want tech but not which lane.
   The compass is a preference quiz that points to roles; each role links to a "try the job" lab. */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Certs & career',
    id: 'career',
    name: 'Find Your Path',
    mark: '🧭',
    color: '#e2673f',
    stat: 'discipline',
    blurb: 'Which tech career actually fits you?',
    intro: "You know it's tech — IT, SOC analyst, pen tester, networking, sysadmin, or software. This helps you feel out which one by what you actually enjoy, then lets you try the day-to-day of each. No wrong answers.",
    units: [
      {
        name: 'The compass',
        blurb: 'Start here. A few honest taps about what you like, and it points you at the roles that fit.',
        lessons: [
          {
            id: 'career-compass', title: 'What fits you?', min: 5, teaser: 'Rate a few statements. Get your top matches and try each job.',
            links: ['career-soc', 'career-pentest', 'career-swe'],
            cards: [
              { t: 'read', h: 'How this works', body: '<p>Below are statements about kinds of work. Tap how much each sounds like you. At the end you\'ll see your top matches, with a lab to actually try each one.</p><p>This isn\'t a test and it isn\'t final — it\'s a starting push so you\'re exploring on purpose instead of guessing. Most tech careers overlap, and people move between them constantly.</p>' },
              {
                t: 'compass',
                roles: {
                  soc: { name: 'SOC Analyst', hole: 'career-soc' },
                  pentest: { name: 'Penetration Tester', hole: 'career-pentest' },
                  network: { name: 'Network Engineer', hole: 'career-network' },
                  sysadmin: { name: 'Sysadmin / IT', hole: 'career-sysadmin' },
                  swe: { name: 'Software Engineer', hole: 'career-swe' },
                  ai: { name: 'AI + Security', hole: 'ai-security' }
                },
                items: [
                  { text: 'I like digging through clues to find the one thing that\'s wrong.', roles: ['soc', 'pentest'] },
                  { text: 'Breaking into things (with permission) to prove they\'re weak sounds fun.', roles: ['pentest'] },
                  { text: 'I\'d enjoy being the calm person who catches an attack as it happens.', roles: ['soc'] },
                  { text: 'I like building things from scratch and seeing them work.', roles: ['swe'] },
                  { text: 'Figuring out how data flows between machines is satisfying.', roles: ['network'] },
                  { text: 'I like keeping systems running smoothly and helping people with tech.', roles: ['sysadmin'] },
                  { text: 'I could happily spend hours tracing and fixing code.', roles: ['swe'] },
                  { text: 'Setting up servers, users, and permissions sounds like my thing.', roles: ['sysadmin', 'network'] },
                  { text: 'I\'m fascinated by how AI works and where it\'s going.', roles: ['ai'] },
                  { text: 'I want to understand attackers\' tricks so I can stop them.', roles: ['soc', 'pentest', 'ai'] }
                ],
                why: 'Your top matches are a nudge, not a verdict. Open each one, read the real day-to-day, and do its lab — that\'s how you\'ll actually know.'
              },
              { t: 'read', h: 'The honest truth about picking', body: '<p>Almost nobody picks right on paper. You find your lane by <b>doing a bit of each</b> and noticing what you lose track of time in. That\'s what the labs here are for.</p><p>And they\'re not separate worlds — they share a foundation (networking, Linux, how systems work), which is why your Security+ and CS study counts no matter which you choose. Pick a direction to <i>start</i>, not to marry.</p>', mem: 'You discover the right career by trying, not by thinking. Pick a lane to start walking; you can change lanes.' }
            ]
          }
        ]
      },
      {
        name: 'The roles, up close',
        tag: 'try the job',
        blurb: 'What each job actually looks like day to day, what it pays roughly, how to get in — and a lab to try it.',
        lessons: [
          {
            id: 'career-soc', title: 'SOC Analyst', min: 6, teaser: 'The defender watching the alerts. Great first cyber job.',
            links: ['sp-logs-lab', 'sp-siem', 'career-pentest'],
            cards: [
              { t: 'read', h: 'The day to day', body: '<p>A <b>SOC Analyst</b> (Security Operations Center) is the front-line defender. You watch alerts from the SIEM, investigate the suspicious ones, decide "real threat or false alarm," and kick off the response when it\'s real.</p><p>Think of the log investigation you did in the terminal lab — that, all day, with better tools. It\'s detective work: filter the noise, spot the anomaly, pull the thread.</p>', mem: 'SOC Analyst = the detective on watch. Triage alerts, investigate, respond.' },
              { t: 'read', h: 'Fit, pay, and the way in', body: '<ul><li><b>You\'ll like it if</b> you enjoy investigation, patterns, and staying calm under pressure.</li><li><b>Entry-level friendly</b> — one of the most common first cybersecurity jobs.</li><li><b>Path in:</b> Security+ is often the exact cert employers ask for. Add hands-on log/SIEM practice and you\'re a real candidate.</li><li><b>Grows into:</b> incident responder, threat hunter, detection engineer.</li></ul>', mem: 'SOC is the classic cyber on-ramp, and Security+ is the classic ticket in. You\'re already on the path.' },
              { t: 'mcq', q: 'The core daily skill of a SOC analyst is closest to:', opts: ['Writing marketing copy', 'Investigating alerts to tell real threats from false alarms', 'Designing logos', 'Selling software'], a: 1, why: 'Triage and investigation — exactly the "filter the noise, find the anomaly" work from your log lab. If that felt fun, this role fits.' },
              { t: 'deep', h: 'Try the job now', teaser: 'Go do a SOC analyst\'s core task.', hole: 'sp-logs-lab', body: '<p>The fastest way to know if you\'d like this is to do it. The <b>"Catch an intruder in the logs"</b> terminal lab is a real SOC task in miniature: pull the auth log, grep for failures, spot the impossible-travel login, confirm the breach.</p><p>If you came out of that lab wanting to keep digging, that\'s a strong signal. Tap below to run it.</p>' }
            ]
          },
          {
            id: 'career-pentest', title: 'Penetration Tester', min: 6, teaser: 'The authorized attacker. You break in so real attackers can\'t.',
            links: ['sp-netscan-lab', 't-osint', 'career-soc'],
            cards: [
              { t: 'read', h: 'The day to day', body: '<p>A <b>penetration tester</b> ("pentester" / ethical hacker) is hired to legally attack a company\'s systems and report every way in they find — so the holes get fixed before real criminals find them.</p><p>It\'s recon (OSINT), scanning for exposed services, finding and proving vulnerabilities, then writing it all up clearly. The writing matters as much as the hacking — a finding nobody understands doesn\'t get fixed.</p>', mem: 'Pentester = authorized attacker. Find the holes, prove them, document them so they get patched.' },
              { t: 'read', h: 'Fit, pay, and the way in', body: '<ul><li><b>You\'ll like it if</b> you love puzzles, creative problem-solving, and thinking like an adversary.</li><li><b>Usually not a first job</b> — most come in through SOC, IT, or networking first, then specialize. Don\'t let that discourage you; it\'s a destination.</li><li><b>Path in:</b> Security+ → Network+ → hands-on labs (CTFs, home labs) → certs like PenTest+ or OSCP.</li><li><b>Non-negotiable:</b> authorization. Only ever test systems you\'re permitted to. Unauthorized hacking is a crime — the "ethical" is the whole job.</li></ul>', mem: 'Pentesting is a specialist destination, usually reached via SOC/IT first. Authorization is everything.' },
              { t: 'mcq', q: 'What legally separates a penetration tester from a criminal hacker?', opts: ['Better tools', 'Written authorization to test the systems', 'Working faster', 'Using Linux'], a: 1, why: 'Permission. A pentester has explicit, written authorization and a defined scope. The exact same action without that is a crime. This is the line you never cross.' },
              { t: 'deep', h: 'Try the job now', teaser: 'Do a pentester\'s first step: recon.', hole: 'sp-netscan-lab', body: '<p>Every engagement starts with mapping the target. The <b>"Map a network"</b> lab puts you in the recon seat: ping a host to see if it\'s alive, scan it for open ports, and spot the dangerous exposed service.</p><p>Pair it with the OSINT lesson (the other half of recon) and you\'ve done the opening moves of a real pentest. Tap below to try it.</p>' }
            ]
          },
          {
            id: 'career-network', title: 'Network Engineer', min: 5, teaser: 'The architect of how data moves. The backbone everything rides on.',
            links: ['sp-ports', 'cs-how-internet', 'career-sysadmin'],
            cards: [
              { t: 'read', h: 'The day to day', body: '<p>A <b>network engineer</b> designs, builds, and troubleshoots the networks that connect everything — routers, switches, firewalls, VPNs, Wi-Fi, and the addressing scheme that ties it together. When "the internet is down," they\'re who fixes it.</p><p>It\'s deeply logical work: IP addressing, subnetting, routing, and making traffic flow fast and securely. Security and networking blur together constantly.</p>', mem: 'Network engineer = designs and fixes how data travels. Routers, switches, subnets, firewalls.' },
              { t: 'read', h: 'Fit, pay, and the way in', body: '<ul><li><b>You\'ll like it if</b> the "how the internet works" and ports/subnetting lessons clicked for you.</li><li><b>Path in:</b> Network+ then Cisco\'s CCNA are the classic certs. Security+ pairs naturally.</li><li><b>Grows into:</b> network architect, cloud networking, or into security (firewalls, zero trust).</li></ul>' },
              { t: 'mcq', q: 'Network engineering is the best fit if which lessons grabbed you?', opts: ['The phishing email', 'Ports, subnetting, and how the internet works', 'The password cracker', 'The sorting visualizer'], a: 1, why: 'If packets, ports, and subnets were satisfying rather than tedious, networking is likely your lane. It\'s the backbone every other tech role relies on.' },
              { t: 'deep', h: 'Try the job now', teaser: 'Play with the building block: subnets.', hole: 'sp-ports', body: '<p>Revisit the ports cheat sheet and, if you did it, the subnet lab — reading a mask in binary and seeing how many hosts fit. That "carve the network into pieces" thinking is the daily bread of network engineering.</p><p>If sliding that prefix and watching the numbers change was fun, that\'s your signal.</p>' }
            ]
          },
          {
            id: 'career-sysadmin', title: 'Sysadmin / IT', min: 5, teaser: 'The one who keeps everything running. The great all-round starting point.',
            links: ['sp-linux-lab', 'cs-filesystems', 'career-soc'],
            cards: [
              { t: 'read', h: 'The day to day', body: '<p>A <b>system administrator</b> (and IT support more broadly) keeps an organization\'s computers, servers, and accounts running. Setting up machines, managing users and permissions, patching, backups, and solving the problems people bring you.</p><p>It\'s hands-on and varied, and it touches a bit of everything — which is exactly why it\'s a fantastic launch pad into any other tech career.</p>', mem: 'Sysadmin/IT = keep it all running. The broadest hands-on role, and the best general on-ramp.' },
              { t: 'read', h: 'Fit, pay, and the way in', body: '<ul><li><b>You\'ll like it if</b> you like fixing things, variety, and being the person who makes tech work for others.</li><li><b>Very entry-friendly</b> — IT support / help desk is one of the most accessible first tech jobs.</li><li><b>Path in:</b> CompTIA A+ then Network+ and Security+. Linux skills are a big plus.</li><li><b>Grows into:</b> basically anything — SOC, networking, cloud, DevOps.</li></ul>', mem: 'IT/help desk → A+ → Network+/Security+ is the most common doorway into the whole field.' },
              { t: 'mcq', q: 'Why is sysadmin/IT often recommended as a first tech job?', opts: ['It pays the most', 'It\'s hands-on, accessible, and touches a bit of every area', 'It requires no learning', 'It\'s the only option'], a: 1, why: 'The breadth is the point — you touch networking, security, hardware, and users, which helps you discover what you like AND builds a foundation for any next move.' },
              { t: 'deep', h: 'Try the job now', teaser: 'Live in the terminal like a sysadmin.', hole: 'sp-linux-lab', body: '<p>Sysadmins live at the command line. The <b>Linux survival kit</b> lab has you navigating a server the way they do every day — moving through folders, listing files, reading them. If that felt natural, IT/sysadmin is a comfortable place to start.</p>' }
            ]
          },
          {
            id: 'career-swe', title: 'Software Engineer', min: 6, teaser: 'The builder. You make the apps everyone else uses.',
            links: ['cs-code-basics', 't-readcode', 'cs-algorithms'],
            cards: [
              { t: 'read', h: 'The day to day', body: '<p>A <b>software engineer</b> builds programs — apps, websites, tools, the systems behind them. Most of the day is writing code, reading other people\'s code, fixing bugs, and designing how the pieces fit together.</p><p>You said you\'d forgotten how to code and read code — that\'s rebuildable, and it\'s the core of this job. The "Reading code without fear" and CS lessons are literally the first steps back in.</p>', mem: 'SWE = builder. Writing code, reading code, debugging, designing. All rebuildable from zero.' },
              { t: 'read', h: 'Fit, pay, and the way in', body: '<ul><li><b>You\'ll like it if</b> building things and solving logic puzzles pulls you in, and you can sit with a problem.</li><li><b>Path in:</b> this is the one where a degree OR a strong project portfolio gets you in. Build real things.</li><li><b>Pairs with security:</b> secure coding and "DevSecOps" are hot — your cyber knowledge is an edge, not a detour.</li><li><b>Grows into:</b> senior/staff engineer, security engineer, AI engineering.</li></ul>' },
              { t: 'mcq', q: 'You felt like a "vibe coder" who forgot the fundamentals. For a SWE path, the fix is to:', opts: ['Give up on coding', 'Only use AI forever', 'Rebuild the ability to read and trace code so you understand what you build', 'Memorize one language perfectly'], a: 2, why: 'The gap isn\'t talent — it\'s the mental model. Rebuilding reading/tracing (exactly what the code lessons do) turns AI from a crutch into a tool you can direct and correct.' },
              { t: 'deep', h: 'Try the job now', teaser: 'Rebuild the core skill: reading code.', hole: 't-readcode', body: '<p>Before writing, you rebuild reading. The <b>"Reading code without fear"</b> lesson has you trace real snippets by hand — being the computer, tracking each variable. It\'s the exact skill that makes a software engineer, and the one vibe-coding skipped.</p><p>If tracing those felt good (even satisfying), SWE is genuinely open to you.</p>' }
            ]
          }
        ]
      }
    ]
  });
})();
