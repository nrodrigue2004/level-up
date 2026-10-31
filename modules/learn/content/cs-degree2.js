/* CS degree, part 2 (cyber focus): Computer networking deep dive, Web application security,
   Linux administration, Digital forensics, Theory of computation, Software engineering.
   Backbones: Kurose & Ross topic order (top-down networking), OWASP Top 10 (2021) and Web Security Academy topics,
   NIST SP 800-86 (forensics), MIT OCW 18.404 (theory), SWEBOK. Lessons are original. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'cs'; })[0]; if (!S) return;
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }
  function code(lines) { return '<pre>' + lines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>'; }

  G.netSubnet = function () {
    var n = r(20, 30), k = r(0, 2), hosts = Math.pow(2, 32 - n) - 2;
    if (k === 0) return { t: 'calc', q: 'How many usable host addresses are in a <b>/' + n + '</b> IPv4 subnet?', a: hosts, tol: 0, why: '32 − ' + n + ' = ' + (32 - n) + ' host bits → 2^' + (32 - n) + ' = ' + (hosts + 2) + ' addresses, minus the network and broadcast addresses = ' + hosts + '.' };
    if (k === 1) { var need = r(10, 500), bits = Math.ceil(Math.log2(need + 2)); return { t: 'calc', q: 'You need <b>' + need + '</b> hosts in one subnet. What is the LARGEST prefix (smallest subnet) that fits? Answer the number after the slash.', a: 32 - bits, tol: 0, why: 'Need 2^h − 2 ≥ ' + need + ' → h = ' + bits + ' host bits (' + (Math.pow(2, bits) - 2) + ' hosts). Prefix = 32 − ' + bits + ' = /' + (32 - bits) + '.' }; }
    var o = r(1, 254), m = pk([25, 26, 27, 28]), size = Math.pow(2, 32 - m), net = Math.floor(o / size) * size;
    return { t: 'calc', q: 'Host <b>192.168.10.' + o + '/' + m + '</b>. What is the last octet of its <b>network address</b>?', a: net, tol: 0, why: 'A /' + m + ' block is ' + size + ' addresses. ' + o + ' falls in the block starting at ' + net + ' (' + net + '–' + (net + size - 1) + '). Network .' + net + ', broadcast .' + (net + size - 1) + '.' };
  };
  var LAYERS = [['Ethernet frames, MAC addresses, switches', 'Layer 2 (Data link)'], ['IP addresses and routing between networks', 'Layer 3 (Network)'], ['TCP ports, reliable delivery, the 3-way handshake', 'Layer 4 (Transport)'], ['HTTP, DNS, SMTP', 'Layer 7 (Application)'], ['Cables, radio signals, voltages', 'Layer 1 (Physical)'], ['TLS encryption and data formats like JPEG', 'Layer 6 (Presentation)'], ['UDP datagrams', 'Layer 4 (Transport)'], ['ARP resolving IP to MAC', 'Layer 2 (Data link)']];
  G.netLayer = function () { var x = pk(LAYERS); return mc('Which OSI layer: <b>' + x[0] + '</b>?', x[1], ['Layer 1 (Physical)', 'Layer 2 (Data link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 6 (Presentation)', 'Layer 7 (Application)'], '"Please Do Not Throw Sausage Pizza Away": Physical, Data link, Network, Transport, Session, Presentation, Application. (TLS is often placed at 6 or "between 4 and 7"; exams usually say 6.)'); };
  var CODES = [[200, 'OK, request succeeded'], [301, 'Moved permanently (redirect)'], [302, 'Found / temporary redirect'], [304, 'Not modified (use your cache)'], [400, 'Bad request'], [401, 'Unauthorized: you need to log in'], [403, 'Forbidden: logged in but not allowed'], [404, 'Not found'], [429, 'Too many requests (rate limited)'], [500, 'Internal server error'], [502, 'Bad gateway (the proxy got a bad upstream response)'], [503, 'Service unavailable']];
  G.webStatus = function () { var c = pk(CODES); return mc('What does HTTP status <b>' + c[0] + '</b> mean?', c[1], CODES.map(function (x) { return x[1]; }), '2xx success, 3xx redirect, 4xx client error, 5xx server error. In logs, a burst of 401/403 is login guessing or access probing; a spike of 404s is often directory brute-forcing; 500s after weird input can mean injection attempts.'); };
  var VULNS = [
    ['A comment box saves &lt;script&gt; tags and shows them to every visitor.', 'Stored XSS', 'Encode output for the HTML context and use a Content Security Policy.'],
    ['A search page echoes ?q= straight into the page.', 'Reflected XSS', 'Encode output; never insert raw input into HTML.'],
    ['Changing /invoice?id=1001 to 1002 shows another customer\'s invoice.', 'Broken access control (IDOR)', 'Check on the server that the logged-in user owns the object, every request.'],
    ['A hidden form on another site makes your browser submit a password change to the bank while you\'re logged in.', 'CSRF', 'Anti-CSRF tokens and SameSite cookies.'],
    ['The app fetches any URL the user supplies, including http://169.254.169.254/.', 'SSRF', 'Allow-list destinations and block internal/metadata addresses.'],
    ['Login query is built by gluing the username into SQL.', 'SQL injection', 'Parameterized queries.'],
    ['Passwords are stored as unsalted MD5.', 'Cryptographic failure', 'Use a slow, salted password hash: Argon2id, bcrypt or scrypt.'],
    ['Admin panel reachable with default credentials admin/admin.', 'Security misconfiguration', 'Remove defaults, harden config, restrict admin interfaces.'],
    ['Session ID stays the same before and after login.', 'Session fixation (auth failure)', 'Issue a new session ID at login; set Secure, HttpOnly, SameSite.'],
    ['The app uses a library with a known critical CVE.', 'Vulnerable and outdated components', 'Track dependencies (SBOM) and patch.']
  ];
  G.webVuln = function () { var v = pk(VULNS); return mc('<b>Finding:</b> ' + v[0] + '<br>What is it?', v[1], VULNS.map(function (x) { return x[1]; }), v[1] + '. Fix: ' + v[2]); };
  var CMDS = [['See which process is listening on which port', 'ss -tulpn'], ['Follow a log file live', 'tail -f /var/log/auth.log'], ['Search file contents for a word', 'grep -r "Failed" /var/log'], ['Show disk space by filesystem', 'df -h'], ['Check a systemd service\'s status', 'systemctl status ssh'], ['Read a service\'s logs from the journal', 'journalctl -u ssh'], ['Change a file\'s owner', 'chown nate:nate file'], ['Run a command as root', 'sudo command'], ['Install updates on Debian/Ubuntu/Kali', 'sudo apt update && sudo apt upgrade'], ['Show running processes', 'ps aux'], ['Find files by name', 'find / -name "*.conf"'], ['Schedule a recurring job', 'crontab -e']];
  G.linuxCmd = function () { var c = pk(CMDS); return mc('Which command: <b>' + c[0] + '</b>?', c[1], CMDS.map(function (x) { return x[1]; }), c[1] + '. Type it on your Kali VM or a Linux box; muscle memory beats reading.'); };
  G.dfaRun = function () {
    var which = r(0, 2), len = r(4, 8), s = '', i; for (i = 0; i < len; i++) s += Math.random() < .5 ? '0' : '1';
    var desc, acc;
    if (which === 0) { desc = 'accepts strings with an <b>even number of 1s</b>'; acc = (s.split('1').length - 1) % 2 === 0; }
    else if (which === 1) { desc = 'accepts strings that <b>end in 01</b>'; acc = /01$/.test(s); }
    else { desc = 'accepts strings that <b>contain 11</b> somewhere'; acc = s.indexOf('11') >= 0; }
    return mc('A finite automaton ' + desc + '. Input: <b><code>' + s + '</code></b>. Accepted?', acc ? 'Accepted' : 'Rejected', ['Accepted', 'Rejected'], 'Read one symbol at a time, tracking only the state you need (parity of 1s / the last two symbols / whether 11 has appeared). A DFA has finite memory, which is exactly why it can\'t count unlimited things, like matching parentheses.');
  };
  G.volOrder = function () {
    var V = ['CPU registers & cache', 'RAM (memory)', 'Network state & running processes', 'Temporary files / swap', 'Disk', 'Remote logs & backups'], i = r(0, 4);
    return mc('Order of volatility (collect most volatile first). What comes right AFTER <b>' + V[i] + '</b>?', V[i + 1], V.filter(function (_, j) { return j !== i + 1 && j !== i; }), 'Most to least volatile: ' + V.join(' → ') + '. Grab what disappears first. RFC 3227 lays this out.');
  };

  var net = {
    name: 'Networking, deep', tag: 'Kurose & Ross · Net+',
    blurb: 'How the internet really works, layer by layer, and what defenders watch at each one.',
    lessons: [
      {
        id: 'net-layers', title: 'OSI & TCP/IP: the layers', min: 10, teaser: 'Encapsulation, and which device lives where.',
        pre: ['cs-how-internet'], links: ['net-tcp', 'sp-ports'],
        cards: [
          { t: 'read', h: 'Layers and encapsulation', body: '<p>Networking is split into layers so each part can change without breaking the rest. The <b>OSI model</b> has 7: Physical, Data link, Network, Transport, Session, Presentation, Application. The real internet runs on the simpler <b>TCP/IP model</b>: Link, Internet (IP), Transport (TCP/UDP), Application.</p><p>Sending data, each layer wraps the one above with its own header: your HTTP request goes in a TCP <b>segment</b>, inside an IP <b>packet</b>, inside an Ethernet <b>frame</b>, sent as <b>bits</b>. That\'s <b>encapsulation</b>. The receiver unwraps in reverse.</p>', mem: 'Please Do Not Throw Sausage Pizza Away (layers 1→7).' },
          { t: 'read', h: 'Devices by layer', body: '<ul><li>L1: cables, hubs, repeaters.</li><li>L2: <b>switches</b> (forward by MAC address), VLANs, ARP.</li><li>L3: <b>routers</b> (forward by IP), layer-3 switches.</li><li>L4: stateful firewalls track TCP/UDP connections.</li><li>L7: proxies, WAFs, load balancers that read HTTP.</li></ul><p>Attacks map to layers too: ARP spoofing (L2), IP spoofing (L3), SYN floods (L4), SQL injection (L7).</p>' },
          { t: 'gen', g: 'netLayer' }, { t: 'gen', g: 'netLayer' }, { t: 'gen', g: 'netLayer' },
          { t: 'explain', q: 'Explain encapsulation using a web request.', points: ['HTTP data at the application layer', 'Wrapped in a TCP segment with ports', 'Wrapped in an IP packet with addresses', 'Wrapped in an Ethernet frame with MAC addresses, sent as bits'] }
        ]
      },
      {
        id: 'net-tcp', title: 'TCP, UDP, and the handshake', min: 10, teaser: 'SYN, SYN-ACK, ACK and why it matters for scans and floods.',
        pre: ['net-layers'], links: ['net-ip', 'sp-attacks'],
        cards: [
          { t: 'read', h: 'TCP vs UDP', body: '<p><b>TCP</b> is connection-based and reliable: numbered bytes, acknowledgments, retransmission, flow and congestion control. Used for web, email, SSH, file transfer.</p><p><b>UDP</b> just sends datagrams, no setup, no guarantee. Faster and lighter: DNS, VoIP, video, games, DHCP.</p>' },
          { t: 'read', h: 'The three-way handshake', body: code(['Client → Server   SYN        (I want to talk, my seq = x)', 'Server → Client   SYN-ACK    (OK, my seq = y, I got x)', 'Client → Server   ACK        (got y; connected)']) + '<p>Closing uses FIN/ACK; RST aborts. Security uses:</p><ul><li><b>SYN flood</b>: send endless SYNs, never ACK, fill the server\'s half-open queue. Defense: SYN cookies, rate limits, DDoS protection.</li><li><b>SYN ("half-open") scan</b>: send SYN; SYN-ACK = open, RST = closed, nothing = filtered. That\'s how nmap -sS works, so only scan networks you own or are authorized to test.</li></ul>', mem: 'SYN, SYN-ACK, ACK. Open port answers SYN-ACK; closed answers RST.' },
          { t: 'mcq', q: 'You send a SYN to a port and get back RST. The port is…', opts: ['Open', 'Closed', 'Filtered by a firewall', 'Using UDP'], a: 1, why: 'RST means a host answered but nothing is listening. No answer at all usually means filtered.' },
          { t: 'mcq', q: 'Which uses UDP by default?', opts: ['SSH', 'HTTPS', 'DNS queries', 'SMTP'], a: 2, why: 'DNS queries go over UDP 53 (falling back to TCP for large responses and zone transfers).' },
          { t: 'gen', g: 'netLayer' }
        ]
      },
      {
        id: 'net-ip', title: 'IP addressing, subnetting & routing', min: 13, teaser: 'CIDR math until it\'s automatic.',
        pre: ['net-tcp'], links: ['sp-segment', 'net-dns'],
        cards: [
          { t: 'read', h: 'CIDR', body: '<p>An IPv4 address is 32 bits. The <b>/prefix</b> says how many bits are the network part; the rest are hosts. /24 = 256 addresses (254 usable), /25 = 128, /26 = 64, /27 = 32, /28 = 16, /30 = 4 (2 usable, used for point-to-point links).</p><p><b>Private ranges</b> (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. NAT on your router translates them to one public IP. 169.254.x.x (APIPA) means DHCP failed. 127.0.0.1 is loopback.</p><p><b>Routing</b>: each router looks up the destination in its table and picks the most specific match (longest prefix). Your default gateway handles everything not local.</p>', mem: 'Usable hosts = 2^(32 − prefix) − 2.' },
          { t: 'gen', g: 'netSubnet' }, { t: 'gen', g: 'netSubnet' }, { t: 'gen', g: 'netSubnet' }, { t: 'gen', g: 'netSubnet' },
          { t: 'read', h: 'IPv6 in one card', body: '<p>128-bit addresses written in hex, like 2001:db8::1 (:: compresses a run of zeros). No NAT needed, typically /64 subnets. Link-local addresses start with fe80::. Security gotcha: many networks forget IPv6 is enabled, so it bypasses IPv4-only firewall rules and monitoring.</p>' }
        ]
      },
      {
        id: 'net-dns', title: 'DNS, DHCP & ARP: the quiet protocols', min: 10, teaser: 'The services everything depends on, and how they\'re abused.',
        pre: ['net-ip'], links: ['sp-attacks', 'sp-indicators'],
        cards: [
          { t: 'read', h: 'How they work', body: '<ul><li><b>DNS</b>: name → IP. Your resolver asks root → TLD (.com) → authoritative server, then caches the answer for its TTL. Records: A/AAAA (IP), CNAME (alias), MX (mail), TXT (SPF, DKIM, DMARC, verification), NS.</li><li><b>DHCP</b>: a new device broadcasts DISCOVER, gets OFFER, sends REQUEST, gets ACK (DORA) with its IP, gateway and DNS server.</li><li><b>ARP</b>: on a local network, "who has 192.168.1.1? Tell me your MAC."</li></ul>' },
          { t: 'read', h: 'How they\'re abused, and what defenders watch', body: '<ul><li><b>ARP spoofing</b>: an attacker answers ARP for the gateway and becomes a man-in-the-middle. Defense: dynamic ARP inspection, 802.1X.</li><li><b>Rogue DHCP</b>: hands out a malicious gateway or DNS server. Defense: DHCP snooping.</li><li><b>DNS tunneling / C2</b>: malware hides data in long, random-looking subdomain queries. Watch for high query volume to one domain and long TXT traffic.</li><li><b>DNS cache poisoning</b>: forged answers get cached. Defense: DNSSEC, randomized source ports.</li></ul>' },
          { t: 'mcq', q: 'A host makes thousands of DNS queries like a8f3k2...x9.badexample.com, each different. Most likely?', opts: ['Normal browsing', 'DNS tunneling or C2 traffic', 'A DHCP failure', 'An ARP storm'], a: 1, why: 'Long, random, unique subdomains to one domain are a classic data-exfiltration or beaconing sign.' },
          { t: 'order', q: 'Put DHCP\'s DORA steps in order.', items: ['Discover', 'Offer', 'Request', 'Acknowledge'], why: 'Client discovers, server offers, client requests, server acknowledges.' }
        ]
      }
    ]
  };

  var web = {
    name: 'Web application security', tag: 'OWASP Top 10',
    blurb: 'HTTP from the inside, then the vulnerabilities that cause real breaches, with the fixes. Practice on DVWA/WebGoat in your homelab or PortSwigger\'s free labs.',
    lessons: [
      {
        id: 'web-http', title: 'HTTP, cookies & sessions', min: 10, teaser: 'Requests, responses, status codes, and how logins stay logged in.',
        pre: ['net-tcp'], links: ['web-owasp'],
        cards: [
          { t: 'read', h: 'A request and response', body: code(['GET /account HTTP/1.1', 'Host: shop.example.com', 'Cookie: session=7f3a91c...', 'User-Agent: Mozilla/5.0 ...', '', 'HTTP/1.1 200 OK', 'Content-Type: text/html', 'Set-Cookie: session=7f3a91c...; Secure; HttpOnly; SameSite=Lax']) + '<p>Methods: GET (read), POST (submit), PUT/PATCH (update), DELETE. HTTP is <b>stateless</b>, so after login the server gives a <b>session cookie</b>, and the browser sends it with every request. Steal the cookie, become the user.</p>' },
          { t: 'read', h: 'Cookie flags and security headers', body: '<ul><li><b>Secure</b>: only sent over HTTPS.</li><li><b>HttpOnly</b>: JavaScript can\'t read it (limits XSS cookie theft).</li><li><b>SameSite</b>: limits sending it on cross-site requests (CSRF defense).</li><li>Headers: <b>Content-Security-Policy</b> (what scripts may run), <b>Strict-Transport-Security</b> (HTTPS only), X-Frame-Options / frame-ancestors (clickjacking).</li></ul><p>Use Burp Suite Community (free) or your browser\'s DevTools Network tab to see all of this on sites you\'re testing.</p>', mem: 'Session cookie: Secure, HttpOnly, SameSite.' },
          { t: 'gen', g: 'webStatus' }, { t: 'gen', g: 'webStatus' }
        ]
      },
      {
        id: 'web-owasp', title: 'The OWASP Top 10 & XSS', min: 13, teaser: 'Access control, injection, XSS and the rest of the list.',
        pre: ['web-http'], links: ['db-inject', 'web-auth'],
        cards: [
          { t: 'read', h: 'OWASP Top 10 (2021)', body: '<ol><li><b>Broken access control</b> (IDOR, missing checks): #1.</li><li><b>Cryptographic failures</b>.</li><li><b>Injection</b> (SQL, command, and now XSS).</li><li><b>Insecure design</b>.</li><li><b>Security misconfiguration</b>.</li><li><b>Vulnerable & outdated components</b>.</li><li><b>Identification & authentication failures</b>.</li><li><b>Software & data integrity failures</b> (unsigned updates, insecure deserialization).</li><li><b>Logging & monitoring failures</b>.</li><li><b>Server-side request forgery (SSRF)</b>.</li></ol>' },
          { t: 'read', h: 'Cross-site scripting', body: '<p><b>XSS</b> is getting your JavaScript to run in someone else\'s browser on a trusted site. It can steal sessions (without HttpOnly), act as the user, or rewrite the page.</p><ul><li><b>Stored</b>: saved on the server (comments, profiles) and served to everyone.</li><li><b>Reflected</b>: bounced off a request parameter in a crafted link.</li><li><b>DOM-based</b>: client-side JS puts input into the page unsafely.</li></ul><p>Fix: <b>context-aware output encoding</b> (frameworks like React do it by default; dangerous escape hatches like innerHTML skip it), plus a strict CSP and HttpOnly cookies.</p>', mem: 'XSS: encode output for its context. CSP as backup.' },
          { t: 'gen', g: 'webVuln' }, { t: 'gen', g: 'webVuln' }, { t: 'gen', g: 'webVuln' },
          { t: 'explain', q: 'Explain IDOR (broken access control) and the fix.', points: ['The app uses an ID from the request to fetch an object', 'Changing the ID returns someone else\'s data', 'The server never checked ownership', 'Fix: authorize every request on the server for that user and object'] }
        ]
      },
      {
        id: 'web-auth', title: 'Authentication, CSRF & SSRF', min: 11, teaser: 'Passwords done right, and the forgery attacks.',
        pre: ['web-owasp'], links: ['sp-mfa', 'sp-cloud'],
        cards: [
          { t: 'read', h: 'Storing passwords', body: '<p>Never store passwords, even encrypted. Store a <b>slow, salted hash</b>: <b>Argon2id</b>, bcrypt or scrypt. The <b>salt</b> (random per user) defeats precomputed rainbow tables; the slowness makes guessing expensive. Fast hashes (MD5, SHA-256 alone) are wrong for passwords because GPUs try billions per second.</p><p>Also: rate-limit and lock out, check new passwords against breached lists, and offer MFA (passkeys best).</p>' },
          { t: 'read', h: 'CSRF and SSRF', body: '<p><b>CSRF</b>: another site makes <i>your browser</i> send a request to a site you\'re logged into; the cookie rides along. Fix: anti-CSRF tokens, SameSite cookies, re-auth for sensitive actions.</p><p><b>SSRF</b>: the <i>server</i> is tricked into requesting a URL you choose, often internal. In clouds, the metadata service at 169.254.169.254 can hand out credentials; SSRF there was central to the 2019 Capital One breach. Fix: allow-list outbound destinations, block internal ranges, use IMDSv2.</p>' },
          { t: 'mcq', q: 'Best way to store user passwords?', opts: ['AES-encrypted', 'SHA-256 hash', 'Argon2id (or bcrypt) with a per-user salt', 'Base64'], a: 2, why: 'Slow, salted, purpose-built password hashing. Encryption is reversible; plain SHA-256 is too fast.' },
          { t: 'gen', g: 'webVuln' }
        ]
      }
    ]
  };

  var linux = {
    name: 'Linux administration', tag: 'LPI / Linux+',
    blurb: 'Running and securing Linux servers: the shell, services, logs, users, hardening.',
    lessons: [
      {
        id: 'lx-admin', title: 'Services, packages, logs & processes', min: 11, teaser: 'systemd, apt, journalctl and ss: the daily toolkit.',
        pre: ['os-files'], links: ['lx-harden', 'py-project'],
        cards: [
          { t: 'read', h: 'The daily toolkit', body: '<ul><li><b>Packages</b>: <code>sudo apt update &amp;&amp; sudo apt upgrade</code> (Debian/Ubuntu/Kali), <code>dnf</code> on Red Hat family.</li><li><b>Services</b> (systemd): <code>systemctl status|start|stop|enable sshd</code>.</li><li><b>Logs</b>: <code>journalctl -u ssh --since today</code>, and files in /var/log (auth.log or secure for logins).</li><li><b>Processes</b>: <code>ps aux</code>, <code>top</code>/<code>htop</code>, <code>kill PID</code>.</li><li><b>Network</b>: <code>ip a</code> (addresses), <code>ss -tulpn</code> (listening ports and their programs).</li><li><b>Scheduling</b>: <code>crontab -e</code> and systemd timers; attackers love these for persistence, so check them.</li></ul>' },
          { t: 'gen', g: 'linuxCmd' }, { t: 'gen', g: 'linuxCmd' }, { t: 'gen', g: 'linuxCmd' },
          { t: 'mcq', q: 'You suspect persistence on a Linux server. Which is a good place to check?', opts: ['/etc/hostname', 'Crontabs, systemd units, and ~/.ssh/authorized_keys', '/usr/share/doc', '/proc/cpuinfo'], a: 1, why: 'Scheduled jobs, new services and added SSH keys are the classic Linux persistence spots.' }
        ]
      },
      {
        id: 'lx-harden', title: 'Hardening a Linux server', min: 11, teaser: 'SSH keys, firewall, updates, least privilege, auditing.',
        pre: ['lx-admin'], links: ['sp-harden', 'os-files'],
        cards: [
          { t: 'read', h: 'Checklist', body: '<ol><li><b>Patch</b>: enable unattended security updates.</li><li><b>SSH</b>: key-based login only (<code>PasswordAuthentication no</code>), no root login (<code>PermitRootLogin no</code>), and consider limiting who can SSH in.</li><li><b>Firewall</b>: default deny inbound (<code>ufw default deny incoming</code>, then allow only needed ports).</li><li><b>Least privilege</b>: personal accounts with sudo, no shared root password; services as their own users.</li><li><b>Remove</b> unneeded packages and services; audit SUID files.</li><li><b>Brute-force protection</b>: fail2ban.</li><li><b>Logging &amp; auditing</b>: ship logs off the box (to Security Onion in your lab), use auditd for sensitive files.</li><li><b>Benchmarks</b>: CIS Benchmarks and Lynis (free scanner) score your config.</li></ol>', mem: 'Patch, keys-only SSH, default-deny firewall, least privilege, ship logs.' },
          { t: 'pbq', h: 'Harden this server', scenario: 'Match each finding to its fix.', opts: ['PasswordAuthentication no', 'PermitRootLogin no', 'ufw default deny incoming', 'Enable unattended-upgrades', 'Install fail2ban', 'Forward logs to the SIEM'],
            rows: [
              { label: 'SSH accepts passwords from the internet', a: 0 },
              { label: 'Admins log in directly as root', a: 1 },
              { label: 'Every port is reachable from anywhere', a: 2 },
              { label: 'Packages are 6 months out of date', a: 3 },
              { label: 'Thousands of failed SSH logins per hour', a: 4 },
              { label: 'Logs only exist on the server itself', a: 5 }
            ], why: 'Each one closes a common real-world hole. Attackers who get root can wipe local logs, so ship them off-box.' },
          { t: 'gen', g: 'linuxCmd' }
        ]
      }
    ]
  };

  var forensics = {
    name: 'Digital forensics & incident response', tag: 'NIST 800-86',
    blurb: 'Collecting evidence properly, analyzing disks, memory and logs, and building a timeline.',
    lessons: [
      {
        id: 'df-collect', title: 'Evidence collection & chain of custody', min: 11, teaser: 'Volatility order, imaging, hashing, and keeping it court-ready.',
        pre: ['sp-ir'], links: ['df-analyze', 'sp-hashing'],
        cards: [
          { t: 'read', h: 'Collect in the right order', body: '<p>Evidence disappears at different speeds, so collect the most <b>volatile</b> first (RFC 3227): CPU registers and cache → RAM → network connections and running processes → temp files and swap → disk → remote logs and backups.</p><p>Pulling the plug destroys RAM, which may hold the only copy of fileless malware, encryption keys and live connections. Capture memory first (tools: WinPmem, LiME, Magnet RAM Capture).</p>' },
          { t: 'read', h: 'Imaging and integrity', body: '<ul><li>Make a <b>bit-for-bit image</b> (dd, FTK Imager, Guymager) through a <b>write blocker</b> so the original never changes.</li><li><b>Hash</b> the original and the image (SHA-256). Matching hashes prove the copy is exact. Work only on copies.</li><li><b>Chain of custody</b>: a log of who handled the evidence, when, where and why, unbroken from collection to court.</li><li><b>Legal hold</b>: once litigation is likely, relevant data can\'t be deleted.</li></ul>', mem: 'Volatile first. Write-block. Hash. Log custody.' },
          { t: 'gen', g: 'volOrder' }, { t: 'gen', g: 'volOrder' },
          { t: 'mcq', q: 'Why hash a forensic image?', opts: ['To compress it', 'To prove it\'s an exact, unaltered copy of the original', 'To encrypt it', 'To speed up analysis'], a: 1, why: 'Matching hashes at collection and later show nothing changed.' }
        ]
      },
      {
        id: 'df-analyze', title: 'Analysis: disk, memory, logs & timelines', min: 12, teaser: 'Autopsy, Volatility, Windows artifacts, and putting it in order.',
        pre: ['df-collect'], links: ['sp-datasources', 'asm-re'],
        cards: [
          { t: 'read', h: 'Where the evidence lives', body: '<ul><li><b>Disk</b>: Autopsy/The Sleuth Kit (free). Deleted files can often be recovered until overwritten. File signatures (magic bytes) reveal disguised files.</li><li><b>Windows artifacts</b>: Event Logs (4624 logon, 4625 failed logon, 4688 process creation, 7045 new service), Prefetch (what ran), the Registry (Run keys for persistence, USB history), browser history, LNK files.</li><li><b>Memory</b>: Volatility 3 lists processes, network connections, injected code and command lines from a RAM image.</li><li><b>Network</b>: packet captures in Wireshark, Zeek logs (Security Onion has both).</li></ul>' },
          { t: 'read', h: 'Building a timeline', body: '<p>Pull timestamps from everything (file system MAC times: modified, accessed, changed/created; logs; registry) into one sorted <b>super-timeline</b> (plaso / log2timeline). The story appears: phishing email opened 09:02, macro spawned PowerShell 09:03, new service installed 09:05, outbound connection 09:06.</p><p>Watch out for <b>timestomping</b> (attackers changing file times) and time zones; normalize everything to UTC.</p>' },
          { t: 'mcq', q: 'Which Windows Event ID records a failed logon?', opts: ['4624', '4625', '4688', '7045'], a: 1, why: '4625 failed, 4624 success, 4688 process created, 7045 service installed.' },
          { t: 'explain', q: 'Explain how you\'d build a timeline of an intrusion.', points: ['Collect timestamps from disk, logs, registry, memory, network', 'Normalize to UTC', 'Merge into one sorted super-timeline', 'Read it for the sequence: initial access, execution, persistence, exfil'] }
        ]
      }
    ]
  };

  var theory = {
    name: 'Theory of computation', tag: 'MIT 18.404',
    blurb: 'What computers can and can\'t do: automata, regular expressions, Turing machines, the halting problem, P vs NP.',
    lessons: [
      {
        id: 'th-automata', title: 'Automata & regular expressions', min: 11, teaser: 'Machines with finite memory, and the regex they match.',
        pre: ['dm-sets'], links: ['th-limits'],
        cards: [
          { t: 'read', h: 'Finite automata', body: '<p>A <b>deterministic finite automaton (DFA)</b> reads input one symbol at a time, moving between a fixed number of states, and accepts if it ends in an accept state. Example: track "even or odd number of 1s so far" with 2 states.</p><p>The set of strings a DFA accepts is a <b>regular language</b>. <b>Regular expressions</b> describe exactly the same languages: <code>(0|1)*01</code> = "ends in 01." That\'s the theory under grep, input validation and IDS signatures.</p><p>Limit: finite memory can\'t count without bound. No DFA (or true regex) can check balanced parentheses or "n zeros then n ones." That needs a stack (pushdown automaton, context-free grammars, the basis of parsers).</p>', mem: 'DFA = regex = regular languages. Need counting? Need a stack.' },
          { t: 'gen', g: 'dfaRun' }, { t: 'gen', g: 'dfaRun' }, { t: 'gen', g: 'dfaRun' },
          { t: 'tf', q: 'A regular expression can correctly validate that any HTML document has properly nested tags.', a: false, why: 'Nesting needs unbounded memory (a stack). That\'s why "parse HTML with regex" breaks, and why security filters built on regex are bypassable.' }
        ]
      },
      {
        id: 'th-limits', title: 'Turing machines, halting & P vs NP', min: 12, teaser: 'Problems no computer can solve, and problems none can solve fast.',
        pre: ['th-automata', 'alg-sort'], links: ['dm-number'],
        cards: [
          { t: 'read', h: 'Turing machines and the halting problem', body: '<p>A <b>Turing machine</b> is a DFA with an infinite tape it can read and write. Anything any computer can compute, a Turing machine can (the Church-Turing thesis).</p><p><b>The halting problem</b> (Turing, 1936): no program can decide, for every program and input, whether it eventually stops. Proof by contradiction: if such a checker H existed, build a program that asks H about itself and does the opposite.</p><p>Security consequence (via Rice\'s theorem): no tool can perfectly decide whether arbitrary code is malicious. Antivirus and static analyzers must use heuristics and will always have false positives or negatives.</p>' },
          { t: 'read', h: 'P, NP, and why crypto cares', body: '<ul><li><b>P</b>: problems solvable in polynomial time (sorting, shortest path).</li><li><b>NP</b>: problems where a proposed answer can be <i>checked</i> quickly (sudoku, scheduling, boolean satisfiability).</li><li><b>NP-complete</b>: the hardest problems in NP; solve one fast and you solve them all fast.</li><li>Whether P = NP is the biggest open question in CS (a $1M Clay prize).</li></ul><p>Crypto depends on problems that are easy one way and believed hard the other (factoring, discrete log). Those aren\'t known to be NP-complete, but no fast classical algorithm is known.</p>', mem: 'P: solve fast. NP: check fast. Halting: undecidable.' },
          { t: 'mcq', q: 'Why can\'t an antivirus perfectly detect all malicious programs?', opts: ['Not enough signatures yet', 'Deciding what arbitrary code does is undecidable in general (halting problem / Rice\'s theorem)', 'Computers are too slow', 'Malware is encrypted'], a: 1, why: 'It\'s a mathematical limit, so detection is always heuristic and layered.' },
          { t: 'explain', q: 'Explain the difference between P and NP with an example.', points: ['P: can be solved quickly (polynomial time)', 'NP: a solution can be checked quickly', 'Example: sudoku is easy to check, hard to solve in general', 'Unknown whether P = NP'] }
        ]
      }
    ]
  };

  var swe = {
    name: 'Software engineering & secure SDLC', tag: 'SWEBOK · NIST SSDF',
    blurb: 'How real software gets built: git, testing, design, and building security in from the start.',
    lessons: [
      {
        id: 'se-process', title: 'Git, testing & the development lifecycle', min: 11, teaser: 'Version control, tests, CI/CD and code review.',
        pre: ['py-debug'], links: ['se-secure'],
        cards: [
          { t: 'read', h: 'Git in one card', body: code(['git clone <url>          # get a repo', 'git switch -c fix-login  # new branch', 'git add file.py          # stage changes', 'git commit -m "Fix lockout counter"', 'git push -u origin fix-login', '# then open a pull request for review']) + '<p>Git tracks every change, who made it and why. Branches let you work without breaking main. A <b>pull request</b> gets reviewed before merging. Never commit secrets: once pushed, assume they\'re leaked (bots scan GitHub constantly); rotate the key.</p>' },
          { t: 'read', h: 'Testing and CI/CD', body: '<ul><li><b>Unit tests</b> check one function; <b>integration tests</b> check parts together; <b>end-to-end</b> tests run the whole app.</li><li><b>CI</b> (continuous integration) runs tests on every push; <b>CD</b> deploys automatically when they pass.</li><li>Methods: <b>Waterfall</b> (plan everything, then build) vs <b>Agile</b> (short sprints, frequent feedback). Most teams are agile-ish.</li></ul>' },
          { t: 'mcq', q: 'You accidentally pushed an API key to a public repo, then deleted it in the next commit. Now what?', opts: ['Nothing, it\'s deleted', 'Revoke/rotate the key immediately; it\'s still in history and was likely already scraped', 'Make the repo private and you\'re fine', 'Rename the file'], a: 1, why: 'Git history keeps it, and scanners find keys within minutes. Rotate first, then clean history.' }
        ]
      },
      {
        id: 'se-secure', title: 'Secure SDLC & threat modeling', min: 11, teaser: 'Shift left: STRIDE, code scanning, dependency checks.',
        pre: ['se-process', 'web-owasp'], links: ['sp-vulns-app', 'jv-secure'],
        cards: [
          { t: 'read', h: 'Building security in', body: '<p>Fixing a flaw in design costs far less than after release, so security moves "left" into every phase:</p><ul><li><b>Requirements</b>: abuse cases ("how would someone misuse this?").</li><li><b>Design</b>: <b>threat modeling</b> with <b>STRIDE</b>: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.</li><li><b>Code</b>: secure coding standards, peer review, <b>SAST</b> (static analysis like Semgrep, CodeQL).</li><li><b>Dependencies</b>: <b>SCA</b> (software composition analysis like Dependabot), SBOMs.</li><li><b>Test</b>: <b>DAST</b> (scanning the running app, like OWASP ZAP), fuzzing, pen tests.</li><li><b>Release &amp; operate</b>: signed builds, secrets management, logging, patching.</li></ul><p>NIST\'s Secure Software Development Framework (SSDF, SP 800-218) formalizes this.</p>', mem: 'STRIDE. SAST reads code, DAST pokes the running app, SCA checks libraries.' },
          { t: 'pbq', h: 'STRIDE it', scenario: 'Match each threat to its STRIDE category.', opts: ['Spoofing', 'Tampering', 'Repudiation', 'Information disclosure', 'Denial of service', 'Elevation of privilege'],
            rows: [
              { label: 'Attacker logs in with a stolen session cookie', a: 0 },
              { label: 'Price field changed in the request before checkout', a: 1 },
              { label: 'User denies making a transfer and there are no logs', a: 2 },
              { label: 'Error page shows database connection string', a: 3 },
              { label: 'Endless expensive search requests take the site down', a: 4 },
              { label: 'Normal user reaches /admin functions', a: 5 }
            ], why: 'STRIDE turns "is this secure?" into six concrete questions per component.' },
          { t: 'mcq', q: 'Which tool type analyzes source code without running it?', opts: ['DAST', 'SAST', 'WAF', 'SIEM'], a: 1, why: 'Static Application Security Testing reads the code. DAST tests the running app.' }
        ]
      }
    ]
  };

  S.units.push(net, web, linux, forensics, theory, swe);
})();
