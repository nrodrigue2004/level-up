/* Computer Science refresher — degree-level ideas, bite-size. */
(function () {
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Tech & cyber',
    id: 'cs',
    name: 'Computer Science',
    mark: 'CS',
    color: '#7fc8ff',
    blurb: 'Refresh the degree, for real this time.',
    intro: "The core ideas a CS degree is built on, explained from scratch and connected to each other. If a term ever felt like a black box, this is where it opens up.",
    units: [
      {
        name: 'How computers think',
        blurb: 'Everything a computer does is built on two symbols. Start here and the rest stops being magic.',
        lessons: [
          {
            id: 'cs-what-is-bit', title: 'Bits, bytes & binary', min: 6, teaser: 'Why computers count with only 0 and 1.',
            links: ['cs-bits-lab', 'cs-logic', 'sp-cia'],
            cards: [
              { t: 'read', h: 'Two states, that\'s it', body: '<p>A computer is millions of tiny switches. Each is either <b>off (0)</b> or <b>on (1)</b>. That single on/off value is a <b>bit</b>.</p><p>One bit isn\'t much. But line up 8 of them (a <b>byte</b>) and you get 256 combinations — enough for every letter, digit, and symbol you\'re reading right now.</p><p>We count in base-10 because we have 10 fingers. Computers count in <b>base-2 (binary)</b> because switches have 2 states. Same idea, different number of symbols.</p>', mem: '1 bit = 1 switch. 8 bits = 1 byte = 256 possibilities (2⁸).' },
              { t: 'read', h: 'Place values', body: '<p>In our normal numbers, each place is worth 10× the one to its right: 1s, 10s, 100s. In binary, each place is worth <b>2×</b> the one to its right: 1, 2, 4, 8, 16, 32, 64, 128.</p><p>To read a binary number, add up the place values wherever there\'s a 1:</p><p><code>1 0 1 1</code> = 8 + 0 + 2 + 1 = <b>11</b></p>' },
              { t: 'calc', q: 'What is binary 1 0 0 0 in decimal? (places: 8 4 2 1)', a: 8, tol: 0, why: 'Only the 8s place has a 1. 8 + 0 + 0 + 0 = 8.' },
              { t: 'calc', q: 'What is binary 1 1 1 1 in decimal?', a: 15, tol: 0, why: '8 + 4 + 2 + 1 = 15. Four ones is the biggest a 4-bit number holds — one less than 16 (2⁴).' },
              { t: 'mcq', q: 'How many different values can a single byte (8 bits) represent?', opts: ['8', '16', '128', '256'], a: 3, why: '2⁸ = 256. That\'s 0 through 255. Each bit doubles the possibilities.' },
              { t: 'deep', h: 'Why hexadecimal exists', teaser: 'That weird 0xFF stuff, explained.', hole: 'cs-bits-lab', body: '<p>Binary is correct but painful to read — <code>11111111</code> is a lot of digits. So programmers use <b>hexadecimal</b> (base-16): digits 0–9 then A–F for 10–15.</p><p>The trick: one hex digit is <i>exactly</i> 4 bits. So a byte is just 2 hex digits. <code>11111111</code> becomes <code>FF</code>. That\'s why colors are <code>#FF0000</code> (red = 255,0,0) and memory addresses look like <code>0x7FFF</code>. It\'s just shorthand for binary.</p>' }
            ]
          },
          {
            id: 'cs-bits-lab', title: 'Lab: flip the bits', min: 4, teaser: 'Build any byte by hand. Make binary click.',
            links: ['cs-what-is-bit'],
            cards: [
              { t: 'read', h: 'Your turn', body: '<p>Below are 8 switches, each labeled with its place value. Tap them on and off to build the target number. Watch the decimal and hex update live.</p>' },
              { t: 'bits', target: 42, why: '42 = 32 + 8 + 2 → switches at 32, 8, and 2 are on: 0 0 1 0 1 0 1 0.' },
              { t: 'bits', target: 255, why: '255 = all eight bits on = 0xFF. The largest value a single byte can hold.' },
              { t: 'bits', target: 65, why: '65 = 64 + 1 → 0 1 0 0 0 0 0 1. Fun fact: 65 is the ASCII code for a capital "A".' },
              { t: 'tf', q: 'Turning on just the leftmost bit of a byte gives you the value 128.', a: true, why: 'The leftmost (most significant) bit in a byte is worth 2⁷ = 128.' }
            ]
          },
          {
            id: 'cs-logic', title: 'Logic gates: the brain\'s atoms', min: 6, teaser: 'AND, OR, NOT — how switches become decisions.',
            links: ['cs-bits-lab', 'cs-what-is-bit'],
            cards: [
              { t: 'read', h: 'From bits to decisions', body: '<p>Bits store data. <b>Logic gates</b> make decisions with them. A gate takes one or two bits in and produces one bit out, following a fixed rule:</p><ul><li><b>AND</b> — output is 1 only if <i>both</i> inputs are 1. ("Both must be true.")</li><li><b>OR</b> — output is 1 if <i>either</i> input is 1.</li><li><b>NOT</b> — flips the input. 1 becomes 0.</li><li><b>XOR</b> — "exclusive or" — 1 if the inputs are <i>different</i>.</li></ul><p>Wire millions of these together and you get a CPU. Seriously — that\'s what a processor is underneath.</p>', mem: 'AND = both. OR = either. XOR = different. NOT = flip.' },
              { t: 'gatelab', body: '<p>Pick a gate, flip the inputs A and B, and watch the output and truth table. The highlighted row is your current inputs.</p>', after: 'XOR is the secret star: it\'s how computers add (1+1 with a carry), and it\'s the heart of simple encryption — XOR something twice with the same key and you get the original back.' },
              { t: 'mcq', q: 'An AND gate gets inputs 1 and 0. Output?', opts: ['1', '0', 'Both', 'Error'], a: 1, why: 'AND needs BOTH inputs to be 1. One of them is 0, so the output is 0.' },
              { t: 'mcq', q: 'You want a circuit that outputs 1 only when two inputs differ. Which gate?', opts: ['AND', 'OR', 'XOR', 'NOT'], a: 2, why: 'XOR (exclusive OR) is 1 exactly when the inputs are different.' },
              { t: 'match', q: 'Match the gate to its rule.', pairs: [['AND', 'Both inputs 1'], ['OR', 'At least one input 1'], ['XOR', 'Inputs differ'], ['NOT', 'Flip the input']], why: 'These four build everything. Even memory is built from gates looping back on themselves.' }
            ]
          }
        ]
      },
      {
        name: 'Programming foundations',
        blurb: 'What code actually is, and the handful of ideas every language shares.',
        lessons: [
          {
            id: 'cs-code-basics', title: 'What code really is', min: 6, teaser: 'Variables, loops, and conditionals — the whole toolkit.',
            links: ['cs-algorithms', 'cs-sort-lab'],
            cards: [
              { t: 'read', h: 'Instructions, in order', body: '<p>A program is a list of instructions a computer follows exactly, top to bottom. Every language — Python, JavaScript, C — is built from the same few building blocks:</p><ul><li><b>Variables</b> — named boxes that hold a value. <code>age = 27</code></li><li><b>Conditionals</b> — do something only <i>if</i> a test is true. <code>if age >= 18: ...</code></li><li><b>Loops</b> — repeat something. <code>for each item in list: ...</code></li><li><b>Functions</b> — a named, reusable block you can call by name.</li></ul><p>That\'s genuinely most of it. Everything else is combinations and libraries.</p>', mem: 'Store (variables), decide (if), repeat (loops), reuse (functions). Four tools, endless programs.' },
              { t: 'mcq', q: 'This pseudocode:<pre>x = 5\nif x > 3:\n  print("big")\nelse:\n  print("small")</pre>What prints?', opts: ['big', 'small', 'nothing', 'an error'], a: 0, keep: true, why: 'x is 5, and 5 > 3 is true, so the "if" branch runs and prints "big". The else is skipped.' },
              { t: 'mcq', q: 'A loop <code>for i in 1..3</code> that prints i each time outputs:', opts: ['1 2 3', '0 1 2 3', '3', '1'], a: 0, keep: true, why: 'The loop runs with i = 1, then 2, then 3, printing each. Loops are how you avoid copy-pasting the same line.' },
              { t: 'read', h: 'Functions = verbs you invent', body: '<p>A <b>function</b> bundles steps under a name so you can reuse them. Define it once, call it anywhere.</p><pre>function greet(name):\n  return "Hi " + name\n\ngreet("Nate")   → "Hi Nate"</pre><p><code>name</code> is a <b>parameter</b> (the input), and <code>return</code> hands back the result. This is how big programs stay manageable: small named pieces, each doing one job.</p>' },
              { t: 'fill', q: 'What keyword hands a result back out of a function (in most languages)?', a: ['return'], why: '"return" sends a value back to whoever called the function — and usually ends the function right there.' },
              { t: 'tf', q: 'A bug is usually the computer doing something wrong on its own.', a: false, why: 'Almost always the computer did exactly what you told it — the instructions just didn\'t match what you meant. Debugging is finding that gap. The computer is relentlessly literal.' }
            ]
          },
          {
            id: 'cs-algorithms', title: 'Algorithms & Big-O', min: 7, teaser: 'Why one solution is instant and another takes a year.',
            links: ['cs-sort-lab', 'cs-code-basics'],
            cards: [
              { t: 'read', h: 'An algorithm is a recipe', body: '<p>An <b>algorithm</b> is just a step-by-step method to solve a problem. "Find the biggest number in a list" has an algorithm: look at each, remember the largest so far.</p><p>The big question in CS is <b>efficiency</b>: how does the work grow as the input gets bigger? We measure this with <b>Big-O notation</b> — a rough count of steps relative to input size <code>n</code>.</p>', mem: 'Big-O ignores constants and small stuff. It answers one question: how does cost grow as the data grows?' },
              { t: 'read', h: 'The common speeds', body: '<ul><li><b>O(1)</b> — constant. Same work no matter the size. (Grab the first item.)</li><li><b>O(log n)</b> — halves the problem each step. Fast even on huge data. (Binary search.)</li><li><b>O(n)</b> — linear. Double the data, double the work. (Check every item once.)</li><li><b>O(n²)</b> — quadratic. For every item, loop over every item. Gets slow <i>fast</i>. (Naive sorting.)</li></ul><p>At n = 1,000,000: O(log n) ≈ 20 steps. O(n) = a million. O(n²) = a <i>trillion</i>. That\'s the difference between instant and never.</p>' },
              { t: 'order', q: 'Order these from fastest-growing-cost to slowest (worst to best for big data).', items: ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'], why: 'O(n²) explodes, O(n) grows steadily, O(log n) barely moves, O(1) is flat. Picking the right one is the difference between an app that scales and one that melts.' },
              { t: 'mcq', q: 'Binary search finds a name in a sorted phonebook of 1,000,000 by halving each time. Roughly how many checks, worst case?', opts: ['1,000,000', '500,000', 'About 20', 'About 1,000'], a: 2, why: 'log₂(1,000,000) ≈ 20. Each check throws away half the remaining names. That\'s the power of O(log n) — but it only works if the data is sorted first.' },
              { t: 'mcq', q: 'An algorithm loops over every item, and for each item loops over every item again. Its Big-O is:', opts: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'], a: 2, why: 'A loop inside a loop over the same n items = n × n = O(n²). This is the pattern to watch for — it\'s the most common accidental slowdown.' },
              { t: 'deep', h: 'Why sorting unlocks speed', teaser: 'The trick behind half of all fast algorithms.', hole: 'cs-sort-lab', body: '<p>Binary search needs sorted data. So does fast searching, fast duplicate-detection, and more. Sorting once (O(n log n)) often pays for itself many times over.</p><p>That\'s a core CS mindset: do expensive prep work <i>once</i> to make every later operation cheap. Databases do exactly this with <b>indexes</b> — they pre-sort data so your queries fly. Go watch sorting actually happen in the next lab.</p>' }
            ]
          },
          {
            id: 'cs-sort-lab', title: 'Lab: watch sorting happen', min: 5, teaser: 'See bubble sort crawl, step by step. Feel the O(n²).',
            links: ['cs-algorithms'],
            cards: [
              { t: 'read', h: 'Bubble sort, visualized', body: '<p><b>Bubble sort</b> is the simplest sorting algorithm: walk the list, and whenever two neighbors are out of order, swap them. Repeat until no swaps are needed. The biggest values "bubble" to the end.</p><p>It\'s also famously slow — O(n²). Step through it below and watch the comparison counter climb. Then hit "Run it all."</p>' },
              { t: 'sortlab', after: 'Notice the comparison count — for just 12 bars it does dozens. For a real list of millions, O(n²) would be hopeless, which is why real code uses O(n log n) sorts like quicksort or mergesort. But bubble sort is perfect for seeing the idea.' },
              { t: 'mcq', q: 'In bubble sort, where does the largest value end up after the first full pass?', opts: ['At the start', 'At the very end', 'In the middle', 'It disappears'], a: 1, why: 'Each pass pushes the largest unsorted value all the way to the end — that spot is then "locked in" (shown green). The next pass ignores it.' },
              { t: 'tf', q: 'Bubble sort is a good choice for sorting a million records in production.', a: false, why: 'No — its O(n²) cost makes it painfully slow at scale. It\'s a teaching tool. Real systems use O(n log n) algorithms. But understanding bubble sort first makes those easier to learn.' }
            ]
          }
        ]
      },
      {
        name: 'Systems & the internet',
        blurb: 'How the machine is organized, and how a click reaches a server across the world.',
        lessons: [
          {
            id: 'cs-filesystems', title: 'Files, folders & the OS', min: 5, teaser: 'What the operating system actually does for you.',
            links: ['sp-linux-lab', 'cs-how-internet'],
            cards: [
              { t: 'read', h: 'The OS is the middleman', body: '<p>The <b>operating system</b> (Windows, macOS, Linux) sits between your programs and the hardware. Programs don\'t talk to the disk or the network directly — they ask the OS, which manages it all and keeps programs from stepping on each other.</p><p>Its big jobs: run programs (<b>processes</b>), hand out memory, manage the <b>file system</b>, and control access to hardware and each other.</p>', mem: 'Apps ask, the OS does. It\'s the referee for memory, files, and the CPU.' },
              { t: 'read', h: 'The file tree', body: '<p>Files live in a <b>tree</b> of folders (directories). There\'s one root at the top (<code>/</code> on Linux/Mac, <code>C:\\</code> on Windows), and everything branches down from there.</p><p>A <b>path</b> is the address of a file: <code>/home/nate/reports/q3.txt</code>. <b>Absolute</b> paths start from the root; <b>relative</b> paths start from wherever you are now. This is exactly what you navigated in the Linux terminal lab.</p>' },
              { t: 'mcq', q: 'Two programs both want to run "at once" on a single CPU core. How does the OS manage it?', opts: ['It refuses the second one', 'It rapidly switches between them (scheduling), so both seem to run together', 'It runs them on the GPU', 'It merges them'], a: 1, why: 'The OS scheduler slices time, switching between processes thousands of times a second. It feels simultaneous. With multiple cores, some truly run in parallel.' },
              { t: 'mcq', q: 'Which is an absolute path?', opts: ['reports/q3.txt', '../q3.txt', '/home/nate/q3.txt', 'q3.txt'], a: 2, why: 'It starts from the root (/), so it\'s unambiguous from anywhere. The others are relative to your current location.' },
              { t: 'tf', q: 'RAM is fast but temporary; the disk (SSD/HDD) is slower but keeps data when powered off.', a: true, why: 'RAM = fast working memory, wiped on power-off (volatile). Disk = permanent storage, slower. This is why "save your work" exists — it moves data from RAM to disk.' }
            ]
          },
          {
            id: 'cs-how-internet', title: 'How the internet works', min: 7, teaser: 'What really happens between typing a URL and seeing a page.',
            links: ['sp-ports', 'sp-pki', 'cs-filesystems'],
            cards: [
              { t: 'read', h: 'It\'s computers talking to computers', body: '<p>The internet is just a huge number of computers agreeing on <b>protocols</b> — shared rules for how to talk. When you load a page, a chain of steps fires in under a second:</p><ol><li><b>DNS lookup</b> — your device asks "what\'s the IP for example.com?" and gets back something like 93.184.216.34.</li><li><b>Connection</b> — your device opens a TCP connection to that IP (usually port 443 for HTTPS).</li><li><b>Request</b> — it sends an HTTP request: "GET me the homepage."</li><li><b>Response</b> — the server sends back the HTML, which your browser draws.</li></ol>', mem: 'Name → number (DNS), then knock on the door (TCP), then ask (HTTP), then receive. Every page load.' },
              { t: 'order', q: 'Put a web page load in order.', items: ['DNS translates the domain to an IP address', 'Your browser opens a connection to that IP', 'Browser sends an HTTP request for the page', 'Server responds with the page content'], why: 'Resolve the name, connect, request, receive. If DNS is down, nothing else can even start — which is why DNS attacks are so disruptive.' },
              { t: 'read', h: 'Packets & IP addresses', body: '<p>Data doesn\'t travel as one big blob. It\'s chopped into <b>packets</b> — small chunks, each stamped with a source and destination <b>IP address</b>, like envelopes with addresses.</p><p>Routers pass packets along, hop by hop, toward the destination. They can even take different routes and get reassembled at the end. This is what makes the internet resilient: no single path is required.</p>' },
              { t: 'mcq', q: 'You type a domain and the page won\'t load, but it loads fine if you type the raw IP address. What\'s most likely broken?', opts: ['Your monitor', 'DNS resolution', 'Your keyboard', 'The HTML'], a: 1, why: 'If the IP works but the name doesn\'t, the name-to-IP translation (DNS) is the broken link in the chain.' },
              { t: 'mcq', q: 'What\'s the main job of TCP in this process?', opts: ['Translate names to IPs', 'Reliably deliver the packets in order, resending any that get lost', 'Encrypt the page', 'Store the website'], a: 1, why: 'TCP handles reliable, ordered delivery — it tracks packets and re-sends lost ones. (DNS does names, TLS does encryption, servers do storage.)' },
              { t: 'deep', h: 'The padlock: what HTTPS actually proves', teaser: 'Connect this straight to your crypto lessons.', hole: 'sp-pki', body: '<p>That padlock means your connection uses <b>TLS</b>. Remember symmetric vs asymmetric encryption? HTTPS uses both: the server proves its identity with a <b>certificate</b> (asymmetric), you agree on a shared session key, then encrypt the actual data fast with symmetric crypto.</p><p>It gives you confidentiality (eavesdroppers see gibberish) and integrity (nobody can tamper mid-flight). It does <i>not</i> prove the site isn\'t a scam — only that your connection to it is private. A phishing site can have a valid padlock too.</p>' }
            ]
          }
        ]
      }
    ]
  });
})();
