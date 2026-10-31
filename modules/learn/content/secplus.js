/* Security+ SY0-701, rebuilt on the official CompTIA exam objectives (5 domains, 28 objectives).
   Lessons are original writing mapped to each objective. Each one points to the matching free
   Professor Messer video. Domain units come from secplus-d1..d5.js, labs from secplus-labs.js.
   Generators below feed endless, non-repeating practice into lessons, drills and the 90-question mock exam. */
(function () {
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) {
    var seen = {}, opts = [right]; seen[right] = 1;
    shuffle(wrongs).forEach(function (w) { if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } });
    return { t: 'mcq', q: q, opts: opts, a: 0, why: why };
  }
  function fromTable(T, i, j, qf, whyf) {
    var row = pk(T), wrong = T.filter(function (x) { return x[j] !== row[j]; }).map(function (x) { return x[j]; });
    return mc(qf(row[i]), row[j], wrong, whyf ? whyf(row) : '');
  }

  var PORTS = [
    ['20/21', 'FTP', 'File transfer, cleartext. Use SFTP/FTPS instead.'], ['22', 'SSH / SFTP / SCP', 'Encrypted remote shell and file copy.'],
    ['23', 'Telnet', 'Cleartext remote shell. Replace with SSH.'], ['25', 'SMTP', 'Server-to-server email. 587 is submission with STARTTLS.'],
    ['53', 'DNS', 'Name resolution. UDP mostly, TCP for zone transfers.'], ['67/68', 'DHCP', 'Hands out IP addresses.'],
    ['69', 'TFTP', 'Trivial FTP, no auth, UDP.'], ['80', 'HTTP', 'Web, cleartext.'], ['88', 'Kerberos', 'Windows domain authentication.'],
    ['110', 'POP3', 'Download email, cleartext. 995 = POP3S.'], ['123', 'NTP', 'Time sync. Logs and Kerberos depend on correct time.'],
    ['143', 'IMAP', 'Email sync, cleartext. 993 = IMAPS.'], ['161/162', 'SNMP', 'Device monitoring. Use SNMPv3 (encrypted).'],
    ['389', 'LDAP', 'Directory queries, cleartext. 636 = LDAPS.'], ['443', 'HTTPS', 'Web over TLS.'], ['445', 'SMB', 'Windows file sharing. Never expose to the internet.'],
    ['514', 'Syslog', 'Log forwarding, UDP. 6514 = syslog over TLS.'], ['636', 'LDAPS', 'LDAP over TLS.'], ['993', 'IMAPS', 'IMAP over TLS.'],
    ['995', 'POP3S', 'POP3 over TLS.'], ['1433', 'Microsoft SQL Server', 'Database. Keep off the internet.'], ['1812/1813', 'RADIUS', 'Centralized AAA for VPN/Wi-Fi.'],
    ['3306', 'MySQL', 'Database.'], ['3389', 'RDP', 'Windows Remote Desktop. A favorite ransomware entry point when exposed.'], ['5060/5061', 'SIP', 'VoIP call setup. 5061 = TLS.']
  ];
  G.spPort = function () {
    return Math.random() < .5
      ? fromTable(PORTS, 0, 1, function (p) { return 'Port <b>' + p + '</b> is used by which protocol?'; }, function (x) { return x[0] + ' = ' + x[1] + '. ' + x[2]; })
      : fromTable(PORTS, 1, 0, function (p) { return 'Which port does <b>' + p + '</b> use by default?'; }, function (x) { return x[1] + ' uses ' + x[0] + '. ' + x[2]; });
  };

  var ALGS = [
    ['AES', 'Symmetric encryption'], ['3DES', 'Symmetric encryption'], ['ChaCha20', 'Symmetric encryption'], ['Blowfish / Twofish', 'Symmetric encryption'],
    ['RSA', 'Asymmetric encryption'], ['ECC', 'Asymmetric encryption'], ['Diffie-Hellman', 'Key exchange'], ['ECDHE', 'Key exchange'],
    ['SHA-256', 'Hashing'], ['SHA-3', 'Hashing'], ['MD5', 'Hashing'], ['HMAC', 'Hashing'], ['DSA / ECDSA', 'Digital signatures'], ['bcrypt / PBKDF2', 'Key stretching']
  ];
  var ALGWHY = { 'Symmetric encryption': 'One shared key: fast, used for bulk data.', 'Asymmetric encryption': 'Public/private key pair: slower, used for key exchange and signatures.', 'Key exchange': 'Lets two sides agree on a shared secret over an open network.', 'Hashing': 'One-way fingerprint for integrity. MD5 and SHA-1 are broken for security use.', 'Digital signatures': 'Proves who signed and that nothing changed (non-repudiation).', 'Key stretching': 'Deliberately slow hashing to make password cracking expensive.' };
  G.spAlg = function () {
    return fromTable(ALGS, 0, 1, function (a) { return '<b>' + a + '</b> belongs in which category?'; }, function (x) { return x[0] + ' → ' + x[1] + '. ' + ALGWHY[x[1]]; });
  };

  var CTRL = [
    ['A security guard checks badges at the lobby', 'Physical', 'Preventive'], ['Security cameras record the parking lot', 'Physical', 'Detective'],
    ['A "This area is monitored" sign', 'Physical', 'Deterrent'], ['Firewall rules block inbound RDP', 'Technical', 'Preventive'],
    ['An IDS alerts on port-scan traffic', 'Technical', 'Detective'], ['Restoring a server from backup after ransomware', 'Technical', 'Corrective'],
    ['A written acceptable use policy', 'Managerial', 'Directive'], ['A yearly risk assessment', 'Managerial', 'Detective'],
    ['Security awareness training for staff', 'Operational', 'Preventive'], ['Reviewing access logs every Monday', 'Operational', 'Detective'],
    ['Extra monitoring because an old system can\'t be patched', 'Technical', 'Compensating'], ['A lock on the server room door', 'Physical', 'Preventive'],
    ['Antivirus quarantining a file it just found', 'Technical', 'Corrective'], ['A login banner warning that misuse will be prosecuted', 'Technical', 'Deterrent'],
    ['Background checks before hiring', 'Operational', 'Preventive'], ['Fire suppression system in the data center', 'Physical', 'Corrective']
  ];
  G.spControl = function () {
    var row = pk(CTRL);
    if (Math.random() < .5) return mc('Which control <b>category</b> is this?<br><br>"' + row[0] + '"', row[1], ['Technical', 'Managerial', 'Operational', 'Physical'], 'Category = HOW it is implemented. Technical = done by systems. Managerial = policies, planning, risk decisions. Operational = done by people day to day. Physical = things you can touch.');
    return mc('Which control <b>type</b> is this?<br><br>"' + row[0] + '"', row[2], ['Preventive', 'Detective', 'Corrective', 'Deterrent', 'Compensating', 'Directive'], 'Type = WHAT it does: prevents it, detects it, corrects/recovers after it, deters (discourages), compensates (stands in when the main control isn\'t possible), or directs (tells people what to do).');
  };

  var ATK = [
    ['Emails sent to thousands of people pretending to be a bank', 'Phishing'], ['A tailored email to one CFO using details from LinkedIn', 'Spear phishing'],
    ['A phishing attack aimed at a CEO or other senior executive', 'Whaling'], ['A phone call pretending to be IT support asking for a password', 'Vishing'],
    ['A text message with a fake package-delivery link', 'Smishing'], ['Following an employee through a badge door without badging in', 'Tailgating / piggybacking'],
    ['Registering "micros0ft.com" to catch typos', 'Typosquatting'], ['Infecting a site the target group is known to visit', 'Watering hole'],
    ['Inventing a believable story and identity to get information', 'Pretexting'], ['A fake invoice tricks finance into paying a "vendor"', 'Business email compromise'],
    ['Entering \' OR 1=1 -- into a login form', 'SQL injection'], ['Injecting &lt;script&gt; into a comment that runs in other users\' browsers', 'Cross-site scripting (XSS)'],
    ['A hidden form on another site makes your logged-in browser change your password', 'Cross-site request forgery (CSRF)'],
    ['Writing past the end of a memory buffer to run attacker code', 'Buffer overflow'], ['Requesting ../../etc/passwd from a web server', 'Directory traversal'],
    ['Flooding a site from thousands of infected devices', 'DDoS'], ['Sending small DNS queries with a spoofed source to get huge replies sent to a victim', 'Amplification attack'],
    ['Intercepting traffic between two parties to read or change it', 'On-path (man-in-the-middle)'], ['Sending fake ARP replies to redirect LAN traffic', 'ARP poisoning'],
    ['Capturing a valid login token and sending it again later', 'Replay attack'], ['Using a stolen NTLM hash to log in without the password', 'Pass the hash'],
    ['Trying one common password against thousands of accounts', 'Password spraying'], ['Trying every possible combination for one account', 'Brute force'],
    ['Using leaked username/password pairs from another site\'s breach', 'Credential stuffing'], ['Forcing a connection to use an older, weaker protocol version', 'Downgrade attack'],
    ['Finding two different inputs that produce the same hash', 'Collision attack'], ['A rogue Wi-Fi access point with the same name as the real network', 'Evil twin'],
    ['Flooding a wireless network with deauthentication frames', 'Wireless deauthentication'], ['Copying an RFID badge with a hidden reader', 'RFID cloning'],
    ['Malware that encrypts files and demands payment', 'Ransomware'], ['Malware that spreads by itself across a network with no user action', 'Worm'],
    ['Software that looks useful but hides malicious code', 'Trojan'], ['Malware that hides deep in the OS to conceal itself', 'Rootkit'],
    ['Code that waits for a date or event, then triggers', 'Logic bomb'], ['Malware that runs only in memory using built-in tools like PowerShell', 'Fileless malware'],
    ['Recording every key a user types', 'Keylogger'], ['A hijacked device controlled as part of an army by a C2 server', 'Bot / botnet'],
    ['A compromised software update pushed to all of a vendor\'s customers', 'Supply chain attack'], ['An attack using a flaw no one has a patch for yet', 'Zero-day']
  ];
  G.spAttack = function () {
    return fromTable(ATK, 0, 1, function (d) { return 'Which attack is this?<br><br>"' + d + '"'; }, function (x) { return 'That\'s <b>' + x[1] + '</b>.'; });
  };

  var ACR = [
    ['CIA', 'Confidentiality, Integrity, Availability'], ['AAA', 'Authentication, Authorization, Accounting'], ['MFA', 'Multifactor authentication'],
    ['SIEM', 'Security information and event management'], ['SOAR', 'Security orchestration, automation, and response'], ['EDR', 'Endpoint detection and response'],
    ['XDR', 'Extended detection and response'], ['DLP', 'Data loss prevention'], ['IDS', 'Intrusion detection system'], ['IPS', 'Intrusion prevention system'],
    ['NAC', 'Network access control'], ['PKI', 'Public key infrastructure'], ['CA', 'Certificate authority'], ['CRL', 'Certificate revocation list'],
    ['OCSP', 'Online Certificate Status Protocol'], ['HSM', 'Hardware security module'], ['TPM', 'Trusted Platform Module'], ['RTO', 'Recovery time objective'],
    ['RPO', 'Recovery point objective'], ['MTTR', 'Mean time to repair'], ['MTBF', 'Mean time between failures'], ['ALE', 'Annualized loss expectancy'],
    ['SLE', 'Single loss expectancy'], ['ARO', 'Annualized rate of occurrence'], ['BIA', 'Business impact analysis'], ['SLA', 'Service-level agreement'],
    ['MOU', 'Memorandum of understanding'], ['NDA', 'Non-disclosure agreement'], ['MSA', 'Master service agreement'], ['SOW', 'Statement of work'],
    ['CVE', 'Common Vulnerabilities and Exposures'], ['CVSS', 'Common Vulnerability Scoring System'], ['SCAP', 'Security Content Automation Protocol'],
    ['IoC', 'Indicator of compromise'], ['TTP', 'Tactics, techniques, and procedures'], ['RBAC', 'Role-based access control'], ['ABAC', 'Attribute-based access control'],
    ['MAC', 'Mandatory access control'], ['DAC', 'Discretionary access control'], ['SSO', 'Single sign-on'], ['SAML', 'Security Assertion Markup Language'],
    ['PAM', 'Privileged access management'], ['ZTNA', 'Zero trust network access'], ['SASE', 'Secure access service edge'], ['WAF', 'Web application firewall'],
    ['UTM', 'Unified threat management'], ['NGFW', 'Next-generation firewall'], ['VPN', 'Virtual private network'], ['IPsec', 'Internet Protocol Security'],
    ['WPA3', 'Wi-Fi Protected Access 3'], ['SAE', 'Simultaneous Authentication of Equals'], ['MDM', 'Mobile device management'], ['BYOD', 'Bring your own device'],
    ['COPE', 'Corporate-owned, personally enabled'], ['CYOD', 'Choose your own device'], ['SDN', 'Software-defined networking'], ['IaC', 'Infrastructure as code'],
    ['ICS', 'Industrial control system'], ['SCADA', 'Supervisory control and data acquisition'], ['RTOS', 'Real-time operating system'], ['SBOM', 'Software bill of materials'],
    ['OSINT', 'Open-source intelligence'], ['DMARC', 'Domain-based Message Authentication, Reporting, and Conformance'], ['SPF', 'Sender Policy Framework'],
    ['DKIM', 'DomainKeys Identified Mail'], ['FIM', 'File integrity monitoring'], ['UBA', 'User behavior analytics'], ['GDPR', 'General Data Protection Regulation'],
    ['PCI DSS', 'Payment Card Industry Data Security Standard'], ['HIPAA', 'Health Insurance Portability and Accountability Act'], ['PII', 'Personally identifiable information']
  ];
  G.spAcronym = function () {
    return fromTable(ACR, 0, 1, function (a) { return 'What does <b>' + a + '</b> stand for?'; }, function (x) { return x[0] + ' = ' + x[1] + '. The exam\'s acronym list has 300+ entries; this drill keeps cycling through them.'; });
  };

  G.spALE = function () {
    var av = r(2, 50) * 10000, ef = pk([10, 20, 25, 40, 50, 75, 100]), aro = pk([0.1, 0.2, 0.25, 0.5, 1, 2, 4]), sle = av * ef / 100, ale = sle * aro;
    if (Math.random() < .5) return { t: 'calc', q: 'A server farm is worth <b>$' + av.toLocaleString() + '</b>. A flood would destroy <b>' + ef + '%</b> of it. What is the <b>SLE</b> in dollars?', a: sle, tol: 1, why: 'SLE = asset value × exposure factor = $' + av.toLocaleString() + ' × ' + (ef / 100) + ' = $' + sle.toLocaleString() + '.' };
    return { t: 'calc', q: 'SLE is <b>$' + sle.toLocaleString() + '</b>. The event is expected <b>' + (aro < 1 ? 'once every ' + (1 / aro) + ' years' : aro + ' time' + (aro > 1 ? 's' : '') + ' a year') + '</b> (ARO = ' + aro + '). What is the <b>ALE</b> in dollars?', a: ale, tol: 1, why: 'ALE = SLE × ARO = $' + sle.toLocaleString() + ' × ' + aro + ' = $' + ale.toLocaleString() + ' per year. If a control costs less per year than the ALE it removes, it\'s usually worth buying.' };
  };

  var IRP = ['Preparation', 'Detection', 'Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons learned'];
  G.spIR = function () {
    var i = r(0, IRP.length - 2);
    return mc('In the incident response process, what comes right after <b>' + IRP[i] + '</b>?', IRP[i + 1], IRP.filter(function (x, j) { return j !== i + 1; }), 'The SY0-701 order: ' + IRP.join(' → ') + '.');
  };

  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    group: 'Certs & career',
    id: 'secplus',
    name: 'Security+',
    mark: '🛡️',
    color: '#e0703f',
    stat: 'tech',
    exam: 'SY0-701',
    blurb: 'All 28 SY0-701 objectives, PBQs & mock exams.',
    intro: "CompTIA Security+ SY0-701, rebuilt around the official exam objectives: 5 domains, 28 objectives, every one covered. Each lesson is original, explains things from zero, links to the matching free Professor Messer video, and ends with an explain-it-back check. The real exam is up to 90 questions in 90 minutes, starts with performance-based questions (PBQs), and you need 750 out of 900. Set Detail to Deep for the exam-level extras.",
    units: []
  });
})();
