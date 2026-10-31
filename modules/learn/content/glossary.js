/* Tap-to-define glossary. Any term here gets auto-underlined the first time it appears in a
   lesson; tapping opens a plain-English definition that itself has tappable words (nested).
   `d` is either a string, or an array of depth levels [simplest ... most detailed].
   `ex` = example, `why` = why it matters. Keys are matched case-insensitively on word boundaries. */
(function () {
  var G = window.RH_GLOSSARY = window.RH_GLOSSARY || {};
  function add(terms, def) { (Array.isArray(terms) ? terms : [terms]).forEach(function (t) { G[t.toLowerCase()] = def; }); }

  // ---- security ----
  add(['encryption', 'encrypt'], { d: ['Scrambling information so only someone with the right key can read it. To everyone else it looks like gibberish.', 'A process that uses a key and a math formula to turn readable data (plaintext) into unreadable data (ciphertext), reversible only with the right key.'], ex: 'When you see the padlock on a website, the data between you and the site is encrypted.', why: 'It protects confidentiality — the first leg of the CIA triad.' });
  add(['confidentiality'], { d: 'Keeping information secret so only authorized people can read it.', ex: 'A locked diary. Encryption is the digital version.', why: 'One of the three security goals (the C in CIA triad).' });
  add(['integrity'], { d: 'Making sure information has not been changed or tampered with. You can trust it is exactly what it should be.', ex: 'A wax seal on a letter — if it is broken, you know someone opened it.', why: 'The I in the CIA triad. Hashes prove integrity.' });
  add(['availability'], { d: 'Making sure information and systems are there and working when you need them.', ex: 'A website staying online even during a flood of traffic.', why: 'The A in the CIA triad. Backups and redundancy protect it.' });
  add(['cia triad'], { d: 'The three core goals of security: Confidentiality, Integrity, and Availability. Nearly every security measure protects one of them.', why: 'It is the mental checklist for "what am I actually protecting?"' });
  add(['authentication', 'authn'], { d: ['Proving who you are — like showing an ID.', 'The process of verifying an identity, using factors like something you know (password), have (phone), or are (fingerprint).'], ex: 'Logging in with your password and a code from your phone.', why: 'Comes before authorization — first prove who you are, then the system decides what you can do.' });
  add(['authorization', 'authz'], { d: 'Deciding what someone is allowed to do once you know who they are.', ex: 'Your badge opens the front door but not the server room.', why: 'Different from authentication: who you are vs what you may do.' });
  add(['multi-factor', 'mfa', 'multi-factor authentication'], { d: 'Logging in with two or more different TYPES of proof, so a stolen password alone is not enough.', ex: 'A password (something you know) plus a code from your phone (something you have).', why: 'One of the single best defenses against account takeover.' });
  add(['hash', 'hashing', 'hash function'], { d: ['A one-way "fingerprint" of data. The same input always gives the same fingerprint, but you cannot work backward to the original.', 'A function mapping any input to a fixed-size value, designed to be irreversible and collision-resistant (SHA-256 is the common one).'], ex: 'Change one letter of a file and its hash changes completely.', why: 'Proves integrity and is how passwords should be stored.' });
  add(['salt', 'salting'], { d: 'A random value added to a password before hashing, so two people with the same password get different hashes.', why: 'Defeats precomputed "rainbow table" attacks.' });
  add(['symmetric'], { d: 'Encryption that uses ONE shared key for both locking and unlocking. Fast, but you must share the key safely.', ex: 'AES.', why: 'Used for the bulk of real encryption once a key is agreed.' });
  add(['asymmetric'], { d: 'Encryption using a PAIR of keys: a public key to lock and a private key to unlock (or vice-versa for signing).', ex: 'RSA.', why: 'Solves the problem of safely sharing a key over the internet.' });
  add(['public key'], { d: 'The half of a key pair you can share with anyone. Used to encrypt messages to you, or to verify your signature.', why: 'The foundation of HTTPS and digital signatures.' });
  add(['private key'], { d: 'The secret half of a key pair that you never share. Decrypts messages sent to you and creates your signatures.', why: 'If someone steals it, they can impersonate you.' });
  add(['malware'], { d: 'Any software written to do harm — a catch-all word for viruses, worms, ransomware, spyware, and the rest.', why: 'Short for "malicious software."' });
  add(['ransomware'], { d: 'Malware that encrypts your files and demands payment to unlock them.', why: 'Good offline backups are the real defense — then you never pay.' });
  add(['phishing'], { d: 'Tricking someone into giving up info or clicking something bad, usually through a fake email or message that looks real.', ex: 'A fake "your account is locked" email with a link to a lookalike login page.', why: 'Most real-world breaches start with phishing.' });
  add(['social engineering'], { d: 'Hacking the person instead of the computer — manipulating someone into doing what the attacker wants.', ex: 'Pretending to be IT support to get a password.', why: 'People are often the easiest way in.' });
  add(['firewall'], { d: 'A guard that allows or blocks network traffic based on rules.', ex: 'Blocking everything except web traffic on ports 80 and 443.', why: 'A first line of defense; best run as "default deny."' });
  add(['vulnerability'], { d: 'A weakness that an attacker could exploit.', ex: 'An unpatched bug in a web server.', why: 'Security is largely about finding and fixing these before attackers do.' });
  add(['exploit'], { d: 'The actual technique or code that takes advantage of a vulnerability.', why: 'Vulnerability = the hole; exploit = the thing that goes through it.' });
  add(['apt', 'nation-state'], { d: 'An "Advanced Persistent Threat" — a well-funded, patient attacker (often a government) that breaks in quietly and stays hidden for a long time.', why: 'The "persistent" part is what makes them dangerous.' });
  add(['siem'], { d: 'A system that collects logs from everything in one place and alerts you to suspicious patterns.', ex: 'Spotting the same account logging in from two countries minutes apart.', why: 'It is the scaled-up version of searching logs by hand.' });
  add(['ids'], { d: 'Intrusion Detection System — watches traffic and raises an alert on something suspicious, but does not block it.', why: 'A smoke detector: it warns, it does not act.' });
  add(['ips'], { d: 'Intrusion Prevention System — like an IDS, but it can also block the bad traffic in real time.', why: 'The extra P is for "Prevention."' });
  add(['tls', 'https', 'ssl'], { d: ['The technology behind the padlock in your browser. It encrypts the connection between you and a website.', 'TLS uses asymmetric crypto to verify the server and agree a key, then fast symmetric crypto for the data. HTTPS is HTTP running over TLS.'], why: 'Gives you confidentiality and integrity, but not proof the site is trustworthy.' });
  add(['zero trust'], { d: 'A security approach that trusts nothing by default — every request must prove itself, even inside your own network.', why: '"Never trust, always verify." Assumes attackers may already be inside.' });
  add(['least privilege'], { d: 'Giving each person or program only the access it truly needs, and nothing more.', why: 'Limits the damage if an account is compromised.' });

  // ---- computer science ----
  add(['bit'], { d: 'The smallest piece of computer data: a single 0 or 1, like one on/off switch.', why: 'Everything a computer stores is built from bits.' });
  add(['byte'], { d: 'A group of 8 bits. Enough to represent one character or a number from 0 to 255.', why: 'The basic unit we measure data in (kilobytes, megabytes…).' });
  add(['binary'], { d: 'Counting with only two symbols, 0 and 1, instead of the ten we normally use.', ex: 'The number 5 is "101" in binary.', why: 'Computers use it because their switches have two states.' });
  add(['hexadecimal', 'hex'], { d: 'Counting in base-16 (digits 0-9 then A-F). One hex digit equals exactly 4 bits, so it is a shorthand for binary.', ex: 'The color red is #FF0000.', why: 'Easier for humans to read than long strings of 0s and 1s.' });
  add(['logic gate', 'logic gates'], { d: 'A tiny circuit that takes one or two bits in and outputs one bit, following a fixed rule (AND, OR, NOT, XOR).', why: 'Millions of them wired together make up a CPU.' });
  add(['algorithm'], { d: 'A step-by-step method for solving a problem.', ex: 'A recipe, or the steps to find the largest number in a list.', why: 'The core of computer science is designing good ones.' });
  add(['big-o', 'big o'], { d: ['A way to describe how much slower an algorithm gets as the data grows.', 'Notation describing the growth rate of an algorithm\'s cost relative to input size n, ignoring constants (e.g. O(n), O(n²), O(log n)).'], ex: 'O(n²) means doubling the data roughly quadruples the work.', why: 'It is the difference between an app that scales and one that freezes.' });
  add(['variable'], { d: 'A named container that holds a value in a program.', ex: 'age = 27', why: 'One of the four basic building blocks of all code.' });
  add(['function'], { d: 'A named, reusable block of code you can run by calling its name.', ex: 'greet("Nate") returns "Hi Nate".', why: 'Keeps programs organized and avoids repeating yourself.' });
  add(['loop'], { d: 'An instruction that repeats a block of code multiple times.', ex: 'Print every name in a list.', why: 'Lets a few lines do a huge amount of work.' });
  add(['operating system', 'os'], { d: 'The software (Windows, macOS, Linux) that manages the hardware and runs your programs, acting as the middleman between them.', why: 'Programs ask it to use the disk, memory, and network.' });
  add(['ram'], { d: 'Fast, temporary memory a computer uses for whatever it is working on right now. It is wiped when the power goes off.', why: 'Why you lose unsaved work in a crash.' });
  add(['cpu'], { d: 'The "brain" of the computer that carries out instructions. Built from millions of logic gates.', why: 'Its speed and core count largely determine how fast a machine feels.' });

  // ---- networking ----
  add(['ip address', 'ip'], { d: 'The numeric address that identifies a device on a network, like a mailing address for data.', ex: '93.184.216.34', why: 'Every packet is stamped with a source and destination IP.' });
  add(['port'], { d: 'A numbered "door" on a computer that directs traffic to the right service.', ex: 'Web traffic uses port 80 (HTTP) or 443 (HTTPS).', why: 'Lets one machine run many services at once.' });
  add(['dns'], { d: 'The internet\'s phonebook — it translates a name like example.com into an IP address.', why: 'If DNS is down, names stop working even when the servers are fine.' });
  add(['tcp'], { d: 'A set of rules for sending data reliably: it puts packets back in order and re-sends any that get lost.', why: 'Used where every byte must arrive, like web pages and email.' });
  add(['packet'], { d: 'A small chunk of data with a source and destination address, like an addressed envelope. Big data is split into many.', why: 'Routing packets independently is what makes the internet resilient.' });
  add(['protocol'], { d: 'An agreed set of rules for how computers talk to each other.', ex: 'HTTP is the protocol for web pages.', why: 'Shared rules are what let different devices work together.' });
  add(['subnet', 'subnetting', 'cidr'], { d: 'Splitting a network into smaller pieces, and the notation (like /24) that describes how big each piece is.', why: 'Controls how many devices fit and limits how far an attacker can roam.' });

  // ---- MMA / grappling ----
  add(['guard'], { d: 'A grappling position where you are on your back using your legs to control the person on top of you. Far from helpless.', why: 'The foundation of defensive jiu-jitsu.' });
  add(['mount'], { d: 'A dominant position where you sit on your opponent\'s torso, pinning them underneath you.', why: 'Lets you strike and attack submissions while they struggle to move.' });
  add(['submission'], { d: 'A hold — a choke or joint lock — that forces your opponent to give up (tap out) or risk injury.', why: 'The finishing move of grappling.' });
  add(['sweep'], { d: 'A technique that reverses a position, taking you from underneath to on top.', why: 'Turns a defensive spot into a dominant one.' });
  add(['takedown'], { d: 'Bringing a standing opponent down to the ground.', ex: 'A wrestler\'s double-leg.', why: 'How a grappler gets the fight to their world.' });
  add(['clinch'], { d: 'Close-range fighting where both fighters grip each other, standing. Home of knees, elbows, and takedowns.', why: 'The bridge between striking and grappling.' });
  add(['jab'], { d: 'A quick, straight punch with your lead (front) hand.', why: 'Used to measure distance and set up bigger punches.' });
  add(['cross'], { d: 'A straight punch with your rear (back) hand — your power hand.', why: 'The "2" in a 1-2 combo.' });
  add(['orthodox'], { d: 'The standard stance with the left foot forward (for a right-hander).', why: 'Opposite of southpaw.' });
  add(['southpaw'], { d: 'A stance with the right foot forward — the mirror image of orthodox.', why: 'Awkward for orthodox fighters to face, which is an advantage.' });

  // ---- world / civics ----
  add(['continent'], { d: 'One of Earth\'s seven great landmasses: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.', why: 'The biggest-picture way to divide up the world\'s land.' });
  add(['equator'], { d: 'The imaginary line around the middle of the Earth, equally far from both poles. It is 0° latitude.', why: 'It is warmest here; climate and seasons flip above and below it.' });
  add(['latitude'], { d: 'How far north or south of the equator a place is, measured in degrees (0° at the equator, 90° at the poles).', why: 'Half of any location\'s coordinates.' });
  add(['longitude'], { d: 'How far east or west a place is from the Prime Meridian in Greenwich, London.', why: 'The other half of a location\'s coordinates.' });
  add(['capital'], { d: 'The city where a country\'s government is based. Often NOT the biggest or most famous city.', ex: 'The US capital is Washington, D.C., not New York.', why: 'A classic source of trick questions.' });
  add(['democracy'], { d: 'A system where power comes from the people, usually by voting.', ex: '"Demos" = people, "kratos" = power.', why: 'Regular elections let people replace leaders peacefully.' });
  add(['republic'], { d: 'A system where people elect representatives to make decisions for them, rather than voting on every law directly.', ex: 'The United States.', why: 'A practical way to run a democracy at large scale.' });
  add(['separation of powers'], { d: 'Splitting government into parts (branches) so no single part holds all the power.', why: 'Each branch can check the others — "checks and balances."' });
  add(['veto'], { d: 'The power to reject a proposed law.', ex: 'A president refusing to sign a bill from Congress.', why: 'A check on the lawmaking branch — which can sometimes override it.' });
  // ---- code / sql / osint / ai (reboot + AI tracks) ----
  add(['sql'], { d: ['The language for asking a database questions and changing its data.', 'Structured Query Language: SELECT reads rows, INSERT/UPDATE/DELETE change them; WHERE filters which rows.'], ex: "SELECT name FROM users WHERE city = 'Dallas';", why: 'Nearly every app stores its data in a database you talk to with SQL.' });
  add(['sql injection'], { d: 'An attack where a user types SQL commands into an input box and the app mistakenly runs them.', why: 'A top web vulnerability. The fix is parameterized queries (input is always data, never commands).' });
  add(['osint'], { d: ['Gathering information from sources that are already public \u2014 no hacking needed.', 'Open-Source Intelligence: collecting intel from search engines, social media, public records, metadata, and breach data.'], ex: 'Reading a target\'s public LinkedIn to craft a convincing phishing email.', why: 'Attackers use it for recon; you can use it to audit and shrink your own footprint.' });
  add(['reconnaissance', 'recon'], { d: 'The information-gathering first phase of an attack (or a security test) \u2014 learning about the target before acting.', why: 'Good recon makes everything after it easier; OSINT is a big part of it.' });
  add(['machine learning'], { d: 'Teaching a computer by showing it many examples, so it learns the patterns itself instead of being given explicit rules.', ex: 'Showing 10,000 labeled photos so it learns to recognize a cat.', why: 'The foundation under modern AI.' });
  add(['neural network'], { d: ['A web of simple math units arranged in layers, loosely inspired by brain cells, that learns by adjusting numbers called weights.', 'Layers of nodes connected by weighted edges; training uses many examples to tune the weights so inputs map to correct outputs.'], why: 'The most common structure for machine learning and the basis of LLMs.' });
  add(['llm', 'large language model'], { d: ['An AI trained on huge amounts of text that answers by predicting the next word over and over.', 'A large neural network trained to predict the next token, producing fluent text, code, and conversation from a prompt.'], ex: 'ChatGPT and Claude are LLMs.', why: 'Powerful but it predicts plausible text, not verified facts \u2014 so it can be confidently wrong.' });
  add(['hallucination'], { d: 'When an AI states something false but plausible-sounding, with total confidence.', ex: 'Inventing a citation or law that does not exist.', why: 'Inherent to how LLMs generate text \u2014 always verify anything important.' });
  add(['prompt injection'], { d: 'Tricking an AI into ignoring its instructions by feeding it crafted text.', why: 'The AI-era cousin of SQL injection: both mix trusted instructions with untrusted input.' });
  add(['token'], { d: 'A chunk of text (a word or part of a word) that a language model reads and predicts one at a time.', why: 'LLMs generate text token by token; it is also how their usage is measured.' });
})();
