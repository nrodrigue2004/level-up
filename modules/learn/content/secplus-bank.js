/* Security+ SY0-701 question bank expansion: exam-style scenario questions, original, appended to the
   lesson that teaches each concept (so they feed lesson review, the mock exam's domain weighting, Gauntlet and Arena). */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'secplus'; })[0]; if (!S) return;
  function q(text, opts, a, why) { return { t: 'mcq', q: text, opts: opts, a: a, why: why }; }
  var BANK = {
    /* ---------- Domain 1 ---------- */
    'sp-controls': [
      q('A company installs bollards in front of its data center entrance. What control category and type is this?', ['Technical, detective', 'Physical, preventive', 'Managerial, deterrent', 'Operational, corrective'], 1, 'Bollards physically stop vehicles: physical category, preventive type.'),
      q('Which is a compensating control?', ['A firewall that blocks all inbound traffic', 'Isolating a legacy system that can\'t be patched on its own VLAN with strict ACLs', 'A security awareness poster', 'Restoring from backup after ransomware'], 1, 'A compensating control provides alternate protection when the primary control (patching) isn\'t possible.')
    ],
    'sp-cia': [
      q('An attacker floods a web server so customers can\'t reach it. Which part of the CIA triad is affected?', ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'], 2, 'DoS attacks target availability.'),
      q('A digital signature on an email primarily provides which two properties?', ['Confidentiality and availability', 'Integrity and non-repudiation', 'Availability and authentication only', 'Confidentiality and integrity'], 1, 'Signing proves it wasn\'t altered and who sent it. Encryption, not signing, provides confidentiality.')
    ],
    'sp-zerotrust': [
      q('In zero trust architecture, which component makes the allow/deny decision for an access request?', ['Policy enforcement point', 'Policy engine', 'Data plane', 'Subject'], 1, 'The policy engine (in the policy decision point) decides; the policy enforcement point carries it out.'),
      q('Which best describes zero trust?', ['Trust internal traffic, inspect external', 'Never trust, always verify every request based on identity, device and context', 'Use only one firewall', 'Disable remote access'], 1, 'No implicit trust from network location.')
    ],
    'sp-pki': [
      q('A browser warns that a site\'s certificate was revoked. Which mechanism lets the browser check revocation status in real time?', ['CSR', 'OCSP', 'Key escrow', 'Wildcard'], 1, 'Online Certificate Status Protocol. CRLs are the older downloadable list.'),
      q('Which certificate type secures www.example.com, mail.example.com and shop.example.com with one certificate?', ['Self-signed', 'Wildcard *.example.com', 'Root certificate', 'Code-signing'], 1, 'A wildcard covers all first-level subdomains. A SAN certificate can also list them individually.'),
      q('Which key does a sender use to encrypt a message so only the recipient can read it?', ['Sender\'s private key', 'Recipient\'s public key', 'Recipient\'s private key', 'A shared hash'], 1, 'Encrypt with the recipient\'s public key; only their private key decrypts.')
    ],
    'sp-hashing': [
      q('A security team stores password hashes with a unique random value added to each password first. What is that value called and why?', ['A pepper, to speed up hashing', 'A salt, to defeat precomputed rainbow tables', 'A nonce, to encrypt the hash', 'A key, to make it reversible'], 1, 'Salts make identical passwords hash differently and break precomputed tables.')
    ],
    'sp-change': [
      q('Before a major firewall rule change, which document describes how to undo it if something breaks?', ['SLA', 'Backout plan', 'MOU', 'Acceptable use policy'], 1, 'Change management requires a backout (rollback) plan.')
    ],
    /* ---------- Domain 2 ---------- */
    'sp-social': [
      q('An attacker compromises a website that a target company\'s engineers frequently visit and plants malware on it. What attack is this?', ['Whaling', 'Watering hole', 'Typosquatting', 'Vishing'], 1, 'Infect the place the targets go, like predators at a watering hole.'),
      q('A user receives a text claiming a package delivery failed, with a link to "reschedule." What is this?', ['Vishing', 'Smishing', 'Pretexting only', 'Spim'], 1, 'SMS phishing = smishing.'),
      q('Someone follows an employee through a badge-controlled door without badging in. What is this called?', ['Shoulder surfing', 'Tailgating / piggybacking', 'Dumpster diving', 'Pharming'], 1, 'Access control vestibules (mantraps) are the classic fix.')
    ],
    'sp-vulns-app': [
      q('A web form field accepts `<script>` tags that later run in other users\' browsers. What vulnerability is this?', ['SQL injection', 'Stored cross-site scripting', 'Buffer overflow', 'Race condition'], 1, 'Script saved and served to others = stored XSS.'),
      q('A program checks a file\'s permissions, then opens it; in between, an attacker swaps the file for a symlink to /etc/shadow. What is this?', ['TOCTOU race condition', 'Memory leak', 'Integer overflow', 'Directory traversal'], 0, 'Time-of-check to time-of-use.'),
      q('A request includes ../../../../etc/passwd in a filename parameter. Which attack is being attempted?', ['Directory traversal', 'CSRF', 'Replay', 'XSS'], 0, 'Path traversal walks out of the intended directory.')
    ],
    'sp-vulns-other': [
      q('A vendor no longer releases security updates for a router model still in use. What is the risk category?', ['Zero-day', 'End-of-life / legacy', 'Misconfiguration', 'Side loading'], 1, 'EOL hardware won\'t get patches; replace or isolate it.'),
      q('Installing apps on a phone from outside the official app store is called:', ['Jailbreaking', 'Side loading', 'Rooting', 'Tethering'], 1, 'Jailbreaking/rooting removes OS restrictions; side loading is installing unofficial apps.')
    ],
    'sp-malware': [
      q('Malware hides its presence by modifying the operating system kernel. What type is it?', ['Adware', 'Rootkit', 'Worm', 'Logic bomb'], 1, 'Rootkits subvert the OS to hide.'),
      q('Malware spreads across a network on its own by exploiting a vulnerability, without user action. What is it?', ['Trojan', 'Worm', 'Virus', 'Spyware'], 1, 'Self-propagating = worm. Viruses need a host file and usually a user action.'),
      q('Code planted by an insider deletes payroll data if their name is removed from the HR database. What is it?', ['Logic bomb', 'Keylogger', 'RAT', 'Bloatware'], 0, 'Triggered by a condition = logic bomb.')
    ],
    'sp-attacks': [
      q('Thousands of login attempts use one common password against many different accounts. What attack is this?', ['Brute force against one account', 'Password spraying', 'Rainbow table', 'Pass the hash'], 1, 'Spraying avoids lockouts by trying few passwords across many accounts.'),
      q('An attacker captures a valid authentication exchange and resends it later to gain access. What attack is this?', ['Replay', 'Downgrade', 'Collision', 'On-path only'], 0, 'Timestamps, nonces and session tokens defend against replay.'),
      q('An attacker forces a connection to use an older, weaker TLS version. What is this?', ['Downgrade attack', 'Birthday attack', 'DNS poisoning', 'Jamming'], 0, 'Disable old protocol versions to prevent it.')
    ],
    'sp-indicators': [
      q('A user account logs in from New Orleans and, ten minutes later, from Singapore. Which indicator is this?', ['Resource consumption', 'Impossible travel', 'Account lockout', 'Blocked content'], 1, 'Physically impossible location changes suggest stolen credentials.')
    ],
    'sp-segment': [
      q('Which mitigation most limits lateral movement after a workstation is compromised?', ['Stronger Wi-Fi passwords', 'Network segmentation with strict rules between segments', 'Longer screen-lock timeouts', 'More antivirus vendors'], 1, 'Segmentation contains the blast radius.')
    ],
    /* ---------- Domain 3 (the thinnest) ---------- */
    'sp-cloud': [
      q('In IaaS, who is responsible for patching the guest operating system?', ['The cloud provider', 'The customer', 'Nobody, it\'s automatic', 'The ISP'], 1, 'Shared responsibility: in IaaS the customer manages the OS and up.'),
      q('Which cloud model gives the customer the LEAST control and responsibility?', ['IaaS', 'PaaS', 'SaaS', 'On-premises'], 2, 'In SaaS the provider runs almost everything; the customer mainly manages data and access.'),
      q('An application is split into small, independently deployable services that communicate over APIs. This is:', ['Monolithic', 'Microservices', 'Air-gapped', 'Mainframe'], 1, 'Microservices: more flexibility, more API attack surface.'),
      q('Which describes infrastructure as code (IaC)?', ['Writing apps in assembly', 'Defining servers and networks in version-controlled config files that are deployed automatically', 'A type of firewall', 'Physical rack labeling'], 1, 'IaC gives repeatable, auditable deployments; scan its templates for misconfigurations.'),
      q('A company runs some workloads in its own data center and some in a public cloud, connected together. This is:', ['Community cloud', 'Hybrid cloud', 'Private cloud only', 'Serverless'], 1, 'Hybrid = on-prem/private + public.')
    ],
    'sp-arch': [
      q('Which architecture runs code only in response to events, with no servers for the customer to manage?', ['Serverless', 'Virtualization', 'Embedded', 'SCADA'], 0, 'Serverless (functions as a service).'),
      q('Industrial control systems that manage a power grid are referred to as:', ['IoT', 'SCADA / ICS', 'RTOS only', 'SDN'], 1, 'SCADA systems often run legacy protocols and need heavy segmentation.'),
      q('A VM escape vulnerability lets an attacker:', ['Read other users\' email', 'Break out of a guest VM to the hypervisor or other VMs', 'Bypass MFA', 'Decrypt TLS'], 1, 'It breaks the isolation virtualization promises.'),
      q('Which is a key security concern with embedded systems and IoT?', ['Too many patches', 'Limited ability to patch, weak default credentials, and constrained resources', 'They can\'t connect to networks', 'They always use TLS 1.3'], 1, 'Segment them and change defaults.')
    ],
    'sp-firewall': [
      q('Which device can inspect application-layer content, identify apps regardless of port, and integrate IPS?', ['Layer 4 stateful firewall', 'Next-generation firewall (NGFW)', 'Hub', 'Packet sniffer'], 1, 'NGFWs work at layer 7.'),
      q('A firewall rule set ends with "deny any any." What is this called?', ['Implicit allow', 'Implicit deny', 'Fail open', 'Port security'], 1, 'Anything not explicitly allowed is blocked.'),
      q('An IPS is deployed inline, while an IDS is usually deployed:', ['Inline as well', 'Passively, on a tap or SPAN port', 'On every endpoint only', 'In the cloud only'], 1, 'IDS watches a copy of traffic and alerts; IPS sits in the path and can block.'),
      q('If a security appliance fails, which mode keeps traffic blocked to protect confidentiality?', ['Fail open', 'Fail closed', 'Fail over', 'Fail safe-open'], 1, 'Fail closed prioritizes security over availability.'),
      q('A web application firewall (WAF) mainly protects against:', ['Physical theft', 'Attacks against web apps like SQLi and XSS', 'Wi-Fi jamming', 'Power outages'], 1, 'WAFs filter HTTP traffic at layer 7.')
    ],
    'sp-vpn': [
      q('Which IPsec mode encrypts the entire original IP packet, including headers, and is typical for site-to-site VPNs?', ['Transport mode', 'Tunnel mode', 'AH only', 'Split mode'], 1, 'Tunnel mode wraps the whole packet in a new one.'),
      q('Which IPsec protocol provides integrity and authentication but NOT encryption?', ['ESP', 'AH', 'IKE', 'TLS'], 1, 'Authentication Header. ESP provides encryption.'),
      q('A remote worker\'s VPN sends only company-bound traffic through the tunnel and everything else directly to the internet. This is:', ['Full tunnel', 'Split tunnel', 'Jump server', 'Air gap'], 1, 'Split tunnel saves bandwidth but reduces visibility/protection for other traffic.'),
      q('Which provides secure, identity-based remote access to specific apps without placing users on the network, often via a cloud broker?', ['SASE / ZTNA', 'Telnet', 'A hub', 'WEP'], 0, 'Secure Access Service Edge with zero trust network access.')
    ],
    'sp-ports': [
      q('Which secure protocol and port should replace FTP for file transfer?', ['TFTP 69', 'SFTP over SSH, port 22', 'Telnet 23', 'HTTP 80'], 1, 'SFTP runs over SSH on 22. (FTPS is FTP over TLS.)'),
      q('LDAPS uses which port?', ['389', '636', '443', '3389'], 1, 'LDAP 389, LDAPS 636.'),
      q('Which protocol secures DNS responses with digital signatures to prevent spoofing?', ['DNSSEC', 'DoH only', 'SNMPv1', 'DHCP snooping'], 0, 'DNSSEC adds integrity/authenticity to DNS records.')
    ],
    'sp-data': [
      q('Which data state is protected by full-disk encryption?', ['Data in transit', 'Data at rest', 'Data in use', 'Data in motion'], 1, 'FDE protects stored data, e.g. on a stolen laptop.'),
      q('Replacing a credit card number with a random value that maps back only through a secure vault is called:', ['Hashing', 'Tokenization', 'Masking', 'Obfuscation'], 1, 'Tokens are useless if stolen; the vault holds the mapping.'),
      q('Showing only the last four digits of an SSN on a screen is:', ['Data masking', 'Encryption', 'Steganography', 'Geofencing'], 0, 'Masking hides part of the data from view.'),
      q('Laws requiring that citizens\' data stay within a country\'s borders relate to:', ['Data sovereignty', 'Data retention', 'Data minimization', 'Data loss prevention'], 0, 'Sovereignty = data subject to the laws where it\'s stored.'),
      q('Which classification would a company most likely use for unreleased product designs?', ['Public', 'Confidential / proprietary', 'Unclassified', 'Open'], 1, 'Trade secrets and IP are confidential/proprietary.')
    ],
    'sp-backups': [
      q('Which site has power, network and hardware ready and can take over within minutes to hours?', ['Cold site', 'Warm site', 'Hot site', 'Mobile site'], 2, 'Hot = ready to go. Warm = some equipment. Cold = space and power only.'),
      q('The maximum acceptable amount of data loss, measured in time, is the:', ['RTO', 'RPO', 'MTTR', 'MTBF'], 1, 'Recovery point objective. RTO is how long until you\'re back up.'),
      q('Which backup approach copies only changes since the last FULL backup?', ['Incremental', 'Differential', 'Snapshot', 'Journaling'], 1, 'Differential grows each day until the next full; incremental copies changes since the last backup of any kind.'),
      q('Two power supplies in a server, each on a different circuit, provide:', ['Load balancing', 'Redundancy / high availability', 'Encryption', 'Clustering'], 1, 'Redundant components remove single points of failure.'),
      q('Which is the best protection against ransomware encrypting your backups?', ['More RAM', 'Immutable or offline (air-gapped) backups', 'Daily defrag', 'RAID 0'], 1, 'Attackers target reachable backups; immutable/offline copies survive.')
    ],
    /* ---------- Domain 4 ---------- */
    'sp-harden': [
      q('What is the FIRST step in hardening a new server?', ['Install a game', 'Change default passwords and remove unnecessary services', 'Open all ports for testing', 'Disable logging'], 1, 'Reduce attack surface and remove defaults.')
    ],
    'sp-vulnmgmt': [
      q('A scanner reports a vulnerability that isn\'t actually present. This is a:', ['True positive', 'False positive', 'False negative', 'True negative'], 1, 'False positives waste time; false negatives are more dangerous.'),
      q('Which score is commonly used to rate the severity of a vulnerability?', ['CVE', 'CVSS', 'SCAP', 'STIX'], 1, 'CVE identifies it; CVSS scores it (0–10).'),
      q('A credentialed vulnerability scan, compared to non-credentialed, will:', ['Find fewer issues', 'Find more accurate, deeper results like missing patches', 'Crash every host', 'Only scan web apps'], 1, 'Logging in lets the scanner see installed software and configs.')
    ],
    'sp-siem': [
      q('Which tool aggregates and correlates logs from many sources and raises alerts?', ['SIEM', 'DLP', 'NAC', 'HSM'], 0, 'Security Information and Event Management.'),
      q('Which describes SOAR?', ['A type of malware', 'Automating and orchestrating response playbooks across tools', 'A wireless standard', 'A backup type'], 1, 'Security Orchestration, Automation and Response.')
    ],
    'sp-iam': [
      q('Access is granted based on job function (e.g. all nurses get the same permissions). What model is this?', ['DAC', 'MAC', 'RBAC', 'ABAC'], 2, 'Role-based access control.'),
      q('Which access control model uses labels like Secret and Top Secret enforced by the system?', ['DAC', 'MAC', 'RBAC', 'Rule-based'], 1, 'Mandatory access control.'),
      q('An employee changed departments and still has access from the old role. This is:', ['Privilege creep', 'Least privilege', 'Separation of duties', 'Federation'], 0, 'Regular access reviews fix privilege creep.'),
      q('Logging into one portal and accessing many apps without re-entering credentials is:', ['MFA', 'SSO', 'PAM', 'LDAP only'], 1, 'Single sign-on, often via SAML or OpenID Connect.')
    ],
    'sp-mfa': [
      q('A password and a security question are what kind of authentication?', ['Two-factor', 'Single-factor (both something you know)', 'Biometric', 'Passwordless'], 1, 'Both are knowledge factors.'),
      q('Which MFA method is most resistant to phishing?', ['SMS codes', 'Email codes', 'FIDO2 security keys / passkeys', 'Security questions'], 2, 'FIDO2 binds the login to the real site\'s domain.')
    ],
    'sp-ir': [
      q('What is the correct order of the incident response process?', ['Detection, preparation, recovery, containment', 'Preparation, detection/analysis, containment, eradication, recovery, lessons learned', 'Containment, preparation, detection, recovery', 'Recovery, detection, preparation'], 1, 'NIST-style lifecycle.'),
      q('Which is a containment action?', ['Writing the lessons-learned report', 'Isolating an infected host from the network', 'Buying cyber insurance', 'Training new staff'], 1, 'Containment stops the spread.')
    ],
    'sp-automation': [
      q('A script automatically disables accounts of employees terminated in the HR system. This improves:', ['Only availability', 'Consistency and speed of deprovisioning', 'Encryption strength', 'Physical security'], 1, 'Automation reduces human error and delay.')
    ],
    /* ---------- Domain 5 ---------- */
    'sp-risk': [
      q('A server worth $20,000 has a 25% chance per year of a $8,000 loss event. What is the ALE?', ['$2,000', '$5,000', '$8,000', '$20,000'], 0, 'ALE = SLE × ARO = $8,000 × 0.25 = $2,000.'),
      q('Buying cyber insurance is which risk response?', ['Avoid', 'Transfer', 'Accept', 'Mitigate'], 1, 'Transfer shifts the financial impact to another party.'),
      q('A company stops offering a risky feature entirely. Which response?', ['Avoid', 'Transfer', 'Accept', 'Mitigate'], 0, 'Avoidance eliminates the activity that creates the risk.')
    ],
    'sp-vendor': [
      q('Which agreement defines measurable service levels like 99.9% uptime?', ['NDA', 'SLA', 'MOU', 'BPA'], 1, 'Service level agreement.'),
      q('Which document lets a company verify a vendor\'s security practices by examining them?', ['Right-to-audit clause', 'AUP', 'EULA', 'Privacy notice'], 0, 'A right-to-audit clause in the contract.')
    ],
    'sp-compliance': [
      q('Which regulation protects the health information of US patients?', ['PCI DSS', 'HIPAA', 'SOX', 'GDPR'], 1, 'HIPAA. PCI DSS = card data, SOX = financial reporting, GDPR = EU personal data.'),
      q('Under GDPR, the organization that decides why and how personal data is processed is the:', ['Processor', 'Controller', 'Custodian', 'Subject'], 1, 'Controller decides; processor processes on its behalf.')
    ],
    'sp-audits': [
      q('A company hires an outside firm to attack its network with permission and report findings. This is:', ['Internal audit', 'Penetration test', 'Vulnerability scan only', 'Tabletop exercise'], 1, 'A pentest actively exploits within agreed rules of engagement.'),
      q('In a penetration test where the testers know nothing about the environment beforehand, the environment is:', ['Known', 'Partially known', 'Unknown (black box)', 'Integrated'], 2, 'Unknown environment = black box.')
    ],
    'sp-awareness': [
      q('Sending employees fake phishing emails to measure who clicks is a:', ['Phishing simulation / campaign', 'Watering hole', 'Red team only', 'Legal hold'], 0, 'Simulations plus follow-up training reduce click rates over time.')
    ]
  };
  S.units.forEach(function (u) { u.lessons.forEach(function (l) {
    var add = BANK[l.id]; if (!add) return;
    var have = {}; l.cards.forEach(function (c) { if (c.q) have[c.q] = 1; });
    add.forEach(function (c) { if (!have[c.q]) l.cards.push(c); });
  }); });
})();
