/* Security+ SY0-701 Domain 4.0 Security Operations (28% of the exam, the biggest). Objectives 4.1–4.9. Original lessons. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'secplus'; })[0]; if (!S) return;
  S.units.push({
    dom: 4, name: '4.0 Security operations', tag: '28% of exam',
    blurb: 'The day-to-day job: hardening, asset and vulnerability management, monitoring, security tooling, identity, automation, incident response and investigations. This is what a SOC analyst actually does.',
    lessons: [
      {
        id: 'sp-harden', title: '4.1 Secure baselines & hardening', min: 10, obj: '4.1', teaser: 'Build it secure, keep it secure, and secure the code.',
        links: ['sp-segment', 'sp-change', 'sp-linux-lab'],
        cards: [
          { t: 'read', h: 'Secure baselines', body: '<p>A <b>secure baseline</b> is the approved, hardened configuration for a type of system. Three steps:</p><ol><li><b>Establish</b>: start from a benchmark (CIS Benchmarks, vendor guides, DISA STIGs) and adapt it.</li><li><b>Deploy</b>: push it with Group Policy, MDM, Ansible or golden images.</li><li><b>Maintain</b>: re-check regularly, fix drift, update as threats and software change.</li></ol>' },
          { t: 'read', h: 'Hardening targets', body: '<ul><li><b>Workstations</b>: patches, EDR, host firewall, no local admin, disk encryption.</li><li><b>Servers</b>: only needed roles/services, restricted admin access, logging on.</li><li><b>Switches & routers</b>: change defaults, disable unused ports, SSH not Telnet, secure management network, firmware updates.</li><li><b>Cloud infrastructure</b>: least-privilege IAM, no public buckets, MFA on the root account, logging (CloudTrail).</li><li><b>Mobile devices</b>: MDM, screen lock, encryption, app control.</li><li><b>ICS/SCADA, embedded, RTOS, IoT</b>: often can\'t be changed much, so segment, change defaults, monitor.</li></ul>' },
          { t: 'read', h: 'Application security', body: '<ul><li><b>Input validation</b>: check all input on the server for type, length and format; reject the rest.</li><li><b>Secure cookies</b>: <code>Secure</code> flag (HTTPS only), <code>HttpOnly</code> (JavaScript can\'t read it, which blunts XSS cookie theft), <code>SameSite</code> (blunts CSRF).</li><li><b>Static code analysis</b> (SAST): scan source code for flaws without running it.</li><li><b>Dynamic analysis</b> (DAST) and <b>fuzzing</b>: attack the running app with unexpected input.</li><li><b>Code signing</b>: developer signs software so users can verify who made it and that it wasn\'t altered.</li><li><b>Sandboxing</b>: run code isolated so it can\'t touch the rest of the system (browser tabs, malware detonation).</li><li><b>Monitoring</b>: app logs and alerts on errors and abuse.</li></ul>', mem: 'HttpOnly stops JavaScript reading the cookie. Secure = HTTPS only.' },
          { t: 'mcq', q: 'An admin wants every new Windows server to start from the same hardened configuration. BEST approach?', opts: ['Configure each by hand from memory', 'Deploy a secure baseline from a CIS benchmark via Group Policy/golden image', 'Leave defaults', 'Disable the firewall for compatibility'], a: 1, why: 'Establish from a benchmark, deploy automatically, maintain over time.' },
          { t: 'mcq', q: 'Which cookie attribute prevents JavaScript from reading a session cookie?', opts: ['Secure', 'HttpOnly', 'SameSite', 'Expires'], a: 1, why: 'HttpOnly hides the cookie from scripts, which reduces the damage of XSS.' },
          { t: 'explain', q: 'Explain the three stages of a secure baseline.', points: ['Establish: build from a benchmark like CIS/STIG', 'Deploy: push consistently with GPO/MDM/config management/images', 'Maintain: monitor for drift and update as things change', 'Goal: every system starts and stays hardened'] },
          { t: 'watch', obj: '4.1', title: 'Secure Baselines / Hardening Targets / Application Security' }
        ]
      },
      {
        id: 'sp-mobile', title: '4.1 Wireless & mobile security', min: 9, obj: '4.1', teaser: 'Site surveys, WPA3, RADIUS, MDM, BYOD vs COPE.',
        pre: ['sp-harden'], links: ['sp-aaa', 'sp-vulns-other'],
        cards: [
          { t: 'read', h: 'Installing wireless', body: '<p>A <b>site survey</b> measures signal strength and interference throughout a building before and after installing access points. The result is a <b>heat map</b> showing coverage. Goal: good coverage where you need it and as little signal leaking into the parking lot as possible.</p>' },
          { t: 'read', h: 'Wireless security settings', body: '<ul><li><b>WPA3</b>: current standard. <b>WPA3-Personal</b> uses <b>SAE</b> (simultaneous authentication of equals), which resists offline password guessing. Uses GCMP encryption. WPA2 used AES-CCMP; WEP and WPA are broken.</li><li><b>WPA3-Enterprise</b>: each user authenticates individually through <b>802.1X</b> to a <b>RADIUS</b> server (AAA) instead of a shared password. Revoke one person without changing everyone\'s password.</li><li><b>EAP</b> types carry the authentication: <b>EAP-TLS</b> (certificates on both sides, strongest), <b>PEAP</b> and EAP-TTLS (server cert + user password in a TLS tunnel).</li></ul>', mem: 'Home = WPA3-Personal (SAE). Business = WPA3-Enterprise (802.1X + RADIUS).' },
          { t: 'read', h: 'Mobile solutions', body: '<p><b>MDM</b> (mobile device management) enforces policy on phones and tablets: passcodes, encryption, app control, remote wipe, separating work and personal data (containerization).</p><p>Deployment models:</p><ul><li><b>BYOD</b>: employee\'s own device. Cheap, but less control and privacy tension.</li><li><b>COPE</b>: corporate-owned, personally enabled. Company owns and controls it, some personal use allowed.</li><li><b>CYOD</b>: choose your own device from an approved list; company owns it.</li></ul><p>Connection methods: <b>cellular</b> (carrier-secured, can\'t be filtered by you), <b>Wi-Fi</b> (watch for rogue/evil twin APs), <b>Bluetooth</b> (keep non-discoverable, patch it).</p>' },
          { t: 'mcq', q: 'Which wireless setup lets you revoke one employee\'s Wi-Fi access without changing a shared password?', opts: ['WPA2-Personal', 'WPA3-Personal with SAE', 'WPA3-Enterprise with 802.1X/RADIUS', 'Open network with a captive portal'], a: 2, why: 'Enterprise mode authenticates each user individually against RADIUS.' },
          { t: 'mcq', q: 'The company buys phones, controls them fully, and allows some personal apps. Model?', opts: ['BYOD', 'COPE', 'CYOD', 'VDI'], a: 1, why: 'Corporate-owned, personally enabled.' },
          { t: 'explain', q: 'Explain BYOD vs COPE and the security trade-off.', points: ['BYOD: employee owns the device; less company control', 'COPE: company owns and manages it; personal use allowed', 'MDM enforces policy and can wipe work data', 'BYOD raises privacy issues and is harder to secure'] },
          { t: 'watch', obj: '4.1', title: 'Wireless Security Settings / Mobile Solutions' }
        ]
      },
      {
        id: 'sp-assets', title: '4.2 Asset management', min: 7, obj: '4.2', teaser: 'You can\'t protect what you don\'t know you have.',
        links: ['sp-segment', 'sp-vulnmgmt', 'sp-data'],
        cards: [
          { t: 'read', h: 'The asset lifecycle', body: '<ol><li><b>Acquisition / procurement</b>: buy from trusted sources, include security requirements, check the vendor.</li><li><b>Assignment / accounting</b>: every asset has an <b>owner</b> and a <b>classification</b> (how sensitive it is).</li><li><b>Monitoring / asset tracking</b>: keep an accurate <b>inventory</b> (what exists, where, who has it) and use <b>enumeration</b> (scanning the network to discover what\'s actually connected, including things nobody recorded).</li><li><b>Disposal / decommissioning</b>: wipe or destroy data, get proof, follow retention rules.</li></ol>' },
          { t: 'read', h: 'Disposal done right', body: '<ul><li><b>Sanitization</b>: remove data so it can\'t be recovered, but the device can be reused. Overwriting, or <b>cryptographic erase</b> (destroy the encryption key on a self-encrypting drive). Plain "delete" or "format" is NOT sanitization.</li><li><b>Destruction</b>: shredding, drilling, pulverizing, incinerating, degaussing (magnetic drives only; doesn\'t work on SSDs).</li><li><b>Certification</b>: a certificate of destruction from the vendor, as proof for audits.</li><li><b>Data retention</b>: keep data as long as law/policy requires, and no longer. Over-retaining is risk too.</li></ul>', mem: 'Delete ≠ sanitize. Degaussing doesn\'t work on SSDs.' },
          { t: 'mcq', q: 'A network scan finds 14 devices that aren\'t in the inventory. Which activity found them?', opts: ['Procurement', 'Enumeration', 'Certification', 'Data retention'], a: 1, why: 'Enumeration discovers what\'s really on the network.' },
          { t: 'mcq', q: 'Old SSDs from laptops must be made unrecoverable before recycling. Which method is NOT effective?', opts: ['Shredding', 'Cryptographic erase', 'Degaussing', 'Vendor certificate of destruction after shredding'], a: 2, why: 'Degaussing uses magnetism; SSDs store data in flash cells, so it does nothing.' },
          { t: 'explain', q: 'Explain why an accurate asset inventory is a security control.', points: ['You can\'t patch, monitor or protect unknown devices', 'Every asset needs an owner and classification', 'Enumeration finds unmanaged/rogue devices', 'Proper disposal stops data leaking from retired hardware'] },
          { t: 'watch', obj: '4.2', title: 'Asset Management' }
        ]
      },
      {
        id: 'sp-vulnmgmt', title: '4.3 Vulnerability management', min: 11, obj: '4.3', teaser: 'Find, confirm, prioritize, fix, verify, report.',
        links: ['sp-netscan-lab', 'sp-audits', 'sp-vulns-other'],
        cards: [
          { t: 'read', h: 'Finding vulnerabilities', body: '<ul><li><b>Vulnerability scans</b> (Nessus, OpenVAS): <i>credentialed</i> scans log in and see far more than <i>non-credentialed</i> ones.</li><li><b>Application security</b>: static analysis (code), dynamic analysis (running app), <b>package monitoring</b> (alerts on vulnerable libraries you depend on, like a bad npm package).</li><li><b>Threat feeds</b>: OSINT, paid/proprietary third-party feeds, <b>information-sharing organizations</b> (ISACs for each industry), and <b>dark web</b> monitoring for leaked data.</li><li><b>Penetration testing</b>: humans actively exploiting to prove real impact.</li><li><b>Responsible disclosure</b> programs and <b>bug bounties</b>: outside researchers report flaws (and get paid).</li><li><b>System/process audits</b>.</li></ul>' },
          { t: 'read', h: 'Analysis: is it real, and how bad?', body: '<ul><li><b>False positive</b>: scanner says vulnerable, it isn\'t. Wastes time.</li><li><b>False negative</b>: scanner says fine, it\'s actually vulnerable. Dangerous, because nobody looks.</li><li><b>CVE</b>: a unique ID for a known vulnerability (CVE-2021-44228 = Log4Shell).</li><li><b>CVSS</b>: severity score 0–10 (critical is 9.0+).</li><li>Then adjust for <b>your</b> situation: <b>exposure factor</b>, <b>environmental variables</b> (is it internet-facing? is there a compensating control?), <b>industry/organizational impact</b>, and <b>risk tolerance</b>.</li></ul><p>A CVSS 9.8 on an isolated lab VM may matter less than a 7.5 on your internet-facing VPN.</p>', mem: 'False negative is worse than false positive: you never even look.' },
          { t: 'read', h: 'Response, validation, reporting', body: '<ul><li><b>Remediation</b>: patching (best), or <b>compensating controls</b>, <b>segmentation</b>, <b>insurance</b> (transfer financial risk), or a formal <b>exception/exemption</b> with sign-off when it can\'t be fixed.</li><li><b>Validation</b>: <b>rescan</b>, audit, and verify the fix actually worked.</li><li><b>Reporting</b>: track metrics and trends for management (open criticals, time to remediate).</li></ul>' },
          { t: 'pbq', h: 'PBQ: prioritize the scan results', scenario: '<p>You have time to fix only some today. Rank by real risk.</p><pre>A  CVSS 9.8  RCE in VPN appliance  internet-facing, exploit public\nB  CVSS 9.8  RCE in old print server  isolated lab VLAN, no internet\nC  CVSS 5.3  TLS 1.0 enabled on intranet wiki\nD  CVSS 8.1  SQLi in customer web portal  internet-facing\nE  CVSS 7.5  scanner says vulnerable, but the version shown is already patched</pre>', opts: ['Fix first', 'Fix second', 'Schedule normally', 'Probably false positive: verify'],
            rows: [
              { label: 'A: VPN RCE, internet-facing, public exploit', a: 0 },
              { label: 'D: SQLi on the customer portal', a: 1 },
              { label: 'B: critical bug on an isolated lab VM', a: 2 },
              { label: 'C: TLS 1.0 on the intranet', a: 2 },
              { label: 'E: patched version flagged anyway', a: 3 }
            ], why: 'Exposure plus a public exploit beats raw CVSS. The isolated 9.8 is real but less urgent. Always confirm suspected false positives instead of ignoring them.' },
          { t: 'mcq', q: 'A scan reports no issues, but an attacker later exploits a known flaw on that server. The scan result was a:', opts: ['True negative', 'False positive', 'False negative', 'True positive'], a: 2, why: 'It said "fine" when it wasn\'t. Credentialed scans reduce false negatives.' },
          { t: 'explain', q: 'Explain why CVSS alone shouldn\'t decide what you patch first.', points: ['CVSS is a generic severity score', 'Your environment changes the real risk: exposure, compensating controls, asset value', 'An exploit being public/actively used raises urgency', 'Prioritize by risk to your organization, then validate fixes'] },
          { t: 'watch', obj: '4.3', title: 'Vulnerability Scanning / Threat Intelligence / Penetration Testing / Analyzing Vulnerabilities / Vulnerability Remediation' }
        ]
      },
      {
        id: 'sp-siem', title: '4.4 Security monitoring & alerting', min: 10, obj: '4.4', teaser: 'SIEM, log aggregation, tuning alerts, SCAP, NetFlow.',
        links: ['sp-logs-lab', 'sp-datasources', 'sp-automation'],
        cards: [
          { t: 'read', h: 'What gets monitored', body: '<p><b>Systems</b> (servers, endpoints), <b>applications</b> (errors, logins, transactions), and <b>infrastructure</b> (firewalls, switches, cloud). The goal: notice attacks, outages and misuse fast.</p>' },
          { t: 'read', h: 'The SIEM workflow', body: '<p>A <b>SIEM</b> (security information and event management, e.g. Splunk, Sentinel, the Elastic stack inside your Security Onion) does:</p><ol><li><b>Log aggregation</b>: collects logs from everywhere into one place, normalized and time-synced (NTP matters).</li><li><b>Correlation & alerting</b>: rules tie events together ("5 failed logins then a success then a new admin account").</li><li><b>Reporting & dashboards</b> for trends and compliance.</li><li><b>Archiving</b>: keep logs as long as policy/law requires.</li></ol><p>Alert response: investigate, <b>quarantine</b> affected systems, remediate, and <b>validate</b> the fix. <b>Alert tuning</b> reduces false positives so analysts don\'t drown (alert fatigue is how real attacks get missed).</p>', mem: 'Aggregate → correlate → alert → respond → tune.' },
          { t: 'read', h: 'Tools', body: '<ul><li><b>SCAP</b>: a set of standards so tools can automatically check configs and vulnerabilities in a common format. <b>Benchmarks</b> (CIS) define what "secure" looks like.</li><li><b>Agents</b> (software installed on hosts, richer data) vs <b>agentless</b> (remote queries, nothing to install).</li><li><b>Antivirus</b>, <b>DLP</b>, <b>vulnerability scanners</b>.</li><li><b>SNMP traps</b>: devices push alerts (fan failed, interface down) to a manager.</li><li><b>NetFlow</b>: records <i>metadata</i> about traffic (who talked to whom, how much, when) without the contents. Great for spotting exfiltration and beaconing.</li></ul>' },
          { t: 'mcq', q: 'Analysts ignore a rule that fires 3,000 times a day, almost all harmless. What should be done?', opts: ['Delete the SIEM', 'Tune the alert to reduce false positives', 'Turn off logging', 'Add more analysts only'], a: 1, why: 'Alert tuning keeps signal high so real alerts get attention.' },
          { t: 'mcq', q: 'Which shows that a workstation sent 40 GB to an unknown IP overnight, without capturing packet contents?', opts: ['SNMP traps', 'NetFlow', 'SCAP', 'Antivirus'], a: 1, why: 'NetFlow records flow metadata: source, destination, ports, bytes, time.' },
          { t: 'explain', q: 'Explain what a SIEM does and why log time-sync matters.', points: ['Collects/aggregates logs from many sources', 'Correlates events into alerts', 'Dashboards, reports, archiving for compliance', 'Correct time (NTP) is needed to line events up across systems'] },
          { t: 'watch', obj: '4.4', title: 'Security Monitoring / Security Tools' }
        ]
      },
      {
        id: 'sp-filter', title: '4.5 Firewall rules, web/DNS filtering & email security', min: 11, obj: '4.5', teaser: 'Write the rules, filter the web, and stop spoofed email with SPF, DKIM, DMARC.',
        pre: ['sp-firewall'], links: ['sp-edr', 'sp-social', 'sp-ports'],
        cards: [
          { t: 'read', h: 'Firewall rules', body: '<p>A rule matches on <b>source</b>, <b>destination</b>, <b>port/protocol</b>, and an <b>action</b> (allow/deny). Rules are checked <b>top to bottom; first match wins</b>. The last rule is an <b>implicit deny</b> (anything not allowed is blocked).</p><pre>1  ALLOW  any        → 10.0.5.10  TCP 443   (web server in screened subnet)\n2  ALLOW  10.0.1.0/24 → 10.0.9.20 TCP 1433  (app servers → database)\n3  DENY   any        → any        TCP 3389  (no RDP from anywhere)\n4  DENY   any        → any        any       (implicit deny)</pre><p>A specific rule placed <i>below</i> a broader one never gets hit. Order matters.</p>', mem: 'Top-down, first match wins, implicit deny at the end.' },
          { t: 'read', h: 'IDS/IPS, web and DNS filtering', body: '<ul><li><b>IDS/IPS</b>: keep <b>signatures</b> updated and watch <b>trends</b> to tune.</li><li><b>Web filter</b>: <b>agent-based</b> (on each device, works anywhere) or a <b>centralized proxy</b>. Uses <b>URL scanning</b>, <b>content categorization</b> (gambling, malware), <b>block rules</b>, and <b>reputation</b> scores of sites.</li><li><b>DNS filtering</b>: refuse to resolve known-malicious domains. Simple and covers every app on the device. Your Pi-hole is a DNS filter.</li><li><b>OS security</b>: <b>Group Policy</b> (central Windows settings across the domain) and <b>SELinux</b> (Linux mandatory access control that confines processes).</li><li><b>Secure protocols</b>: choose the secure protocol, port, and transport (TLS) on purpose.</li></ul>' },
          { t: 'read', h: 'Email security', body: '<p>Email was built with no sender verification, so spoofing is easy. Three DNS-based fixes work together:</p><ul><li><b>SPF</b> (Sender Policy Framework): a DNS record listing which servers are allowed to send mail for your domain.</li><li><b>DKIM</b> (DomainKeys Identified Mail): the sending server digitally signs each message; receivers check the signature using a public key in DNS. Proves it wasn\'t altered.</li><li><b>DMARC</b>: a DNS policy telling receivers what to do if SPF/DKIM fail (<i>none</i>, <i>quarantine</i>, <i>reject</i>) and where to send reports.</li></ul><p>An <b>email gateway</b> filters spam, malware and phishing before it reaches inboxes.</p>', mem: 'SPF = who may send. DKIM = signed. DMARC = what to do on failure + reports.' },
          { t: 'pbq', h: 'PBQ: fix the firewall rule order', scenario: '<p>The web server (10.0.5.10) must be reachable on HTTPS from anywhere. Nothing else from the internet. The rules as written:</p><pre>1  DENY   any → any        any\n2  ALLOW  any → 10.0.5.10  TCP 443\n3  ALLOW  any → 10.0.5.10  TCP 23</pre><p>Choose what to do with each rule.</p>', opts: ['Keep, move to the top', 'Keep, move to the bottom', 'Delete it', 'Keep as is'],
            rows: [
              { label: 'Rule 1: DENY any → any', a: 1, why: 'A deny-all at the top blocks everything below it. It belongs last.' },
              { label: 'Rule 2: ALLOW HTTPS to the web server', a: 0 },
              { label: 'Rule 3: ALLOW Telnet (23) to the web server', a: 2, why: 'Telnet is cleartext and not required.' }
            ], why: 'First match wins. Put specific allows above the deny-all, and remove anything not required (least privilege).' },
          { t: 'mcq', q: 'Receivers keep accepting spoofed emails from your domain. Which record tells them to reject mail that fails checks?', opts: ['SPF', 'DKIM', 'DMARC', 'MX'], a: 2, why: 'DMARC sets the policy (reject/quarantine) and reporting. SPF and DKIM provide the checks.' },
          { t: 'explain', q: 'Explain how SPF, DKIM and DMARC work together.', points: ['SPF lists servers authorized to send for the domain', 'DKIM signs messages so receivers can verify integrity/origin', 'DMARC says what to do when checks fail and sends reports', 'All three are published in DNS'] },
          { t: 'watch', obj: '4.5', title: 'Firewalls / Web Filtering / Operating System Security / Email Security' }
        ]
      },
      {
        id: 'sp-edr', title: '4.5 EDR, DLP, NAC, FIM & UBA', min: 9, obj: '4.5', teaser: 'The tools that watch endpoints, data and behavior.',
        pre: ['sp-siem'], links: ['sp-filter', 'sp-malware', 'sp-data'],
        cards: [
          { t: 'read', h: 'Endpoint tools', body: '<ul><li><b>EDR</b> (endpoint detection and response): agent on each endpoint that records process, file and network behavior, detects malicious patterns (not just signatures), and can isolate the host or kill processes. Think CrowdStrike, Defender for Endpoint.</li><li><b>XDR</b> (extended detection and response): EDR plus correlation across email, network, cloud and identity for one combined view.</li><li><b>File integrity monitoring (FIM)</b>: alerts when important files change (system binaries, web pages, config files). Uses hashes.</li></ul>' },
          { t: 'read', h: 'Data, access and behavior', body: '<ul><li><b>DLP</b> (data loss prevention): finds sensitive data (SSNs, card numbers, labeled docs) and blocks or alerts when it\'s leaving: email attachments, USB copies, uploads to personal cloud.</li><li><b>NAC</b> (network access control): checks a device before letting it on the network (authenticated? patched? EDR running?). Non-compliant devices go to a quarantine/remediation VLAN. Can be agent-based (persistent or dissolvable) or agentless.</li><li><b>UBA / UEBA</b> (user and entity behavior analytics): learns normal behavior per user and device, and flags anomalies (an accountant suddenly downloading the whole code repository at 2 a.m.).</li></ul>', mem: 'EDR = endpoint behavior. DLP = data leaving. NAC = health check at the door. UBA = this user is acting weird.' },
          { t: 'pbq', h: 'PBQ: which tool catches it?', scenario: '<p>Pick the tool BEST suited to each situation.</p>', opts: ['EDR', 'XDR', 'DLP', 'NAC', 'FIM', 'UBA', 'DNS filtering'],
            rows: [
              { label: 'An employee emails a spreadsheet of 9,000 SSNs to Gmail', a: 2 },
              { label: 'A contractor laptop without current patches plugs into a conference room port', a: 3 },
              { label: 'Someone modifies /etc/passwd on a Linux server', a: 4 },
              { label: 'PowerShell spawns from Word and starts encrypting files', a: 0 },
              { label: 'An HR user who never touches engineering suddenly downloads 30 GB of source code', a: 5 },
              { label: 'Correlate a phishing email, a risky login and endpoint malware into one incident', a: 1 },
              { label: 'Stop any device on the network from resolving known malware domains', a: 6 }
            ], why: 'Data leaving = DLP. Device health at connect = NAC. File changes = FIM. Process behavior on a host = EDR. Unusual for this user = UBA. Cross-source = XDR.' },
          { t: 'mcq', q: 'Which tool would place a non-compliant laptop into a remediation VLAN until it\'s patched?', opts: ['DLP', 'NAC', 'FIM', 'SIEM'], a: 1, why: 'NAC checks posture before granting network access.' },
          { t: 'explain', q: 'Explain how EDR differs from traditional antivirus.', points: ['Antivirus mostly matches known signatures', 'EDR records and analyzes behavior on the endpoint', 'EDR can detect unknown/fileless attacks by behavior', 'EDR supports response: isolate host, kill process, investigate timeline'] },
          { t: 'watch', obj: '4.5', title: 'Monitoring Data / Endpoint Security' }
        ]
      },
      {
        id: 'sp-iam', title: '4.6 Identity: provisioning, SSO & access models', min: 11, obj: '4.6', teaser: 'Accounts in and out, federation, SAML vs OAuth, RBAC vs ABAC vs MAC.',
        pre: ['sp-aaa'], links: ['sp-mfa', 'sp-zerotrust'],
        cards: [
          { t: 'read', h: 'Account lifecycle', body: '<ul><li><b>Provisioning</b>: create accounts with the right access on day one (ideally from HR automation).</li><li><b>De-provisioning</b>: disable/remove access the day someone leaves. Orphaned accounts are a classic breach path.</li><li><b>Permission assignments</b>: watch for <b>permission creep</b> as people change roles and keep collecting access. Fix with access reviews.</li><li><b>Identity proofing</b>: verify a person is who they claim before issuing an identity (checking ID documents).</li><li><b>Attestation</b>: managers periodically confirm their people\'s access is still needed. (Also: a device proving its integrity.)</li></ul>' },
          { t: 'read', h: 'SSO and federation', body: '<p><b>Single sign-on (SSO)</b>: log in once, access many apps. <b>Federation</b>: trust between organizations, so your company login works on a partner\'s or SaaS site. <b>Interoperability</b>: systems need common standards to make this work.</p><ul><li><b>LDAP</b>: protocol for reading/writing directory info (Active Directory). Port 389, LDAPS 636.</li><li><b>SAML</b>: XML-based standard for exchanging authentication between an <b>identity provider</b> (IdP, e.g. Entra ID/Okta) and a <b>service provider</b> (the app). Common for enterprise web SSO.</li><li><b>OAuth 2.0</b>: an <b>authorization</b> framework. It lets an app access your data on another service without your password ("Allow this app to see your Google Calendar"). <b>OpenID Connect</b> adds authentication on top.</li></ul>', mem: 'SAML = enterprise SSO (authN). OAuth = delegated authorization ("allow access").' },
          { t: 'read', h: 'Access control models', body: '<ul><li><b>MAC</b> (mandatory): the system enforces labels (Secret, Top Secret); users can\'t change them. Military/government, SELinux.</li><li><b>DAC</b> (discretionary): the owner decides who gets access (sharing your own file). Flexible, error-prone.</li><li><b>RBAC</b> (role-based): permissions attached to roles (Nurse, Accountant); users get roles. Most common in business.</li><li><b>Rule-based</b>: system-wide rules apply to everyone (firewall rules, "no access after 6 p.m.").</li><li><b>ABAC</b> (attribute-based): decisions from many attributes: user department, device health, location, time, data label. Most flexible; fits zero trust.</li><li><b>Time-of-day restrictions</b> and <b>least privilege</b> layer on top.</li></ul>', mem: 'MAC = labels. DAC = owner decides. RBAC = job role. ABAC = many attributes.' },
          { t: 'pbq', h: 'PBQ: name the access model', scenario: '<p>Match each description to the access control model.</p>', opts: ['MAC', 'DAC', 'RBAC', 'Rule-based', 'ABAC'],
            rows: [
              { label: 'Users get access by being assigned the "Billing Clerk" role', a: 2 },
              { label: 'A file\'s creator chooses who may read it', a: 1 },
              { label: 'Clearance labels set by the system; users can\'t override them', a: 0 },
              { label: 'Access allowed only if department=Finance AND device=managed AND country=US', a: 4 },
              { label: 'A firewall policy applies the same allow/deny rules to all traffic', a: 3 }
            ], why: 'Role = RBAC. Owner decides = DAC. Labels/clearances = MAC. Many attributes combined = ABAC. Global rules = rule-based.' },
          { t: 'mcq', q: 'A fitness app asks permission to read your Google contacts without asking for your Google password. This uses:', opts: ['SAML', 'OAuth', 'LDAP', 'Kerberos'], a: 1, why: 'OAuth delegates limited authorization via tokens, without sharing the password.' },
          { t: 'explain', q: 'Explain why de-provisioning and access reviews matter.', points: ['Leavers\' accounts must be disabled right away (orphaned accounts get abused)', 'People collect permissions as roles change (permission creep)', 'Periodic reviews/attestation remove unneeded access', 'Supports least privilege'] },
          { t: 'watch', obj: '4.6', title: 'Identity and Access Management / Access Controls' }
        ]
      },
      {
        id: 'sp-mfa', title: '4.6 MFA, passwords & privileged access', min: 10, obj: '4.6', teaser: 'Factors, tokens, passkeys, password rules and PAM.',
        pre: ['sp-iam'], links: ['sp-pw-lab', 'sp-hashing'],
        cards: [
          { t: 'read', h: 'Authentication factors', body: '<ul><li><b>Something you know</b>: password, PIN, security question.</li><li><b>Something you have</b>: phone app, hardware token, smart card, security key.</li><li><b>Something you are</b>: fingerprint, face, retina, voice (biometrics).</li><li><b>Somewhere you are</b>: location (GPS, IP geolocation). Usually an extra check, not a factor on its own.</li></ul><p><b>MFA</b> needs two or more <i>different</i> categories. A password + security question is still single-factor (both "know").</p>', mem: 'MFA = different categories. Two passwords ≠ MFA.' },
          { t: 'read', h: 'Implementations', body: '<ul><li><b>Soft tokens</b>: authenticator apps generating TOTP codes (30-second codes).</li><li><b>Hard tokens</b>: key fobs that show codes.</li><li><b>Security keys</b> (FIDO2/WebAuthn, e.g. YubiKey): phishing-resistant, because the key checks the real website\'s domain before answering.</li><li><b>Biometrics</b>: watch the false acceptance rate (FAR) and false rejection rate (FRR); the point they\'re equal is the crossover error rate (CER).</li><li>SMS codes: better than nothing, but vulnerable to SIM swapping. Push notifications can be abused by <b>MFA fatigue</b> (spamming prompts until someone taps Approve); number matching fixes that.</li></ul>' },
          { t: 'read', h: 'Passwords and passwordless', body: '<p>Current best practice (NIST 800-63B): <b>length</b> beats complexity (long passphrases), block known-breached passwords, no <b>reuse</b>, don\'t force arbitrary <b>expiration</b> unless compromise is suspected. <b>Age</b> settings (minimum age) stop people cycling back to an old password instantly.</p><p><b>Password managers</b> let you have long, unique passwords everywhere. <b>Passwordless</b> (passkeys, Windows Hello, security keys) removes the password entirely.</p>' },
          { t: 'read', h: 'Privileged access management (PAM)', body: '<p>Admin accounts are the crown jewels. PAM tools:</p><ul><li><b>Just-in-time permissions</b>: admin rights granted only when needed, for a short time, then removed.</li><li><b>Password vaulting</b>: admin passwords stored in a vault, checked out, rotated automatically after use, sessions recorded.</li><li><b>Ephemeral credentials</b>: temporary credentials that expire on their own.</li></ul>', mem: 'No standing admin rights: JIT + vault + ephemeral creds.' },
          { t: 'pbq', h: 'PBQ: count the factors', scenario: '<p>Is each login method single-factor or multifactor?</p>', opts: ['Single-factor', 'Multifactor'],
            rows: [
              { label: 'Password + PIN', a: 0 },
              { label: 'Smart card + PIN', a: 1 },
              { label: 'Fingerprint + face scan', a: 0 },
              { label: 'Password + authenticator app code', a: 1 },
              { label: 'Password + security question', a: 0 },
              { label: 'Security key + fingerprint on the key', a: 1 }
            ], why: 'Count categories, not steps. Two "know" or two "are" items are still one factor.' },
          { t: 'mcq', q: 'Users are spammed with push approvals at 3 a.m. until one taps Approve. Best fix?', opts: ['Longer passwords', 'Number matching or phishing-resistant FIDO2 keys', 'Disable MFA', 'SMS codes'], a: 1, why: 'Number matching defeats MFA fatigue; FIDO2 security keys resist phishing entirely.' },
          { t: 'explain', q: 'Explain why a FIDO2 security key resists phishing better than a code from an app.', points: ['Codes can be typed into a fake site and relayed by the attacker', 'The security key checks the real site\'s origin/domain', 'It won\'t authenticate to a look-alike domain', 'Uses public-key crypto; no shared secret to steal'] },
          { t: 'watch', obj: '4.6', title: 'Multifactor Authentication / Password Security' }
        ]
      },
      {
        id: 'sp-automation', title: '4.7 Automation & orchestration', min: 7, obj: '4.7', teaser: 'Let scripts do the boring, fast, consistent parts.',
        links: ['sp-siem', 'sp-cloud'],
        cards: [
          { t: 'read', h: 'Use cases', body: '<ul><li><b>User and resource provisioning</b>: accounts and servers created automatically with the right settings.</li><li><b>Guard rails</b>: automatic checks that block insecure actions (a deployment that would open a public bucket gets stopped).</li><li><b>Security groups</b> applied automatically.</li><li><b>Ticket creation and escalation</b> from alerts.</li><li><b>Enabling/disabling services and access</b>: auto-disable an account that trips an alert.</li><li><b>Continuous integration and testing</b>: security scans on every code commit.</li><li><b>Integrations and APIs</b> connecting tools together. <b>SOAR</b> platforms run "playbooks" across tools.</li></ul>' },
          { t: 'read', h: 'Benefits vs costs', body: '<p><b>Benefits</b>: saves time, enforces baselines, standard configurations, scales securely, faster reaction time, acts as a <b>workforce multiplier</b>, and helps <b>employee retention</b> (fewer boring repetitive tasks).</p><p><b>Considerations</b>: added <b>complexity</b>, <b>cost</b>, can become a <b>single point of failure</b>, creates <b>technical debt</b> if built hastily, and needs <b>ongoing supportability</b> (someone must maintain the scripts).</p>' },
          { t: 'mcq', q: 'A SOAR playbook automatically disables a user, isolates their laptop and opens a ticket when malware is confirmed. Main benefit?', opts: ['Lower complexity', 'Faster reaction time', 'No maintenance needed', 'Removes need for logs'], a: 1, why: 'Automation responds in seconds instead of waiting for an analyst. It does add complexity and needs maintenance.' },
          { t: 'explain', q: 'Give two benefits and two risks of security automation.', points: ['Benefits: speed/reaction time, consistency/enforced baselines', 'Benefits: scale, workforce multiplier, less burnout', 'Risks: complexity, cost, technical debt', 'Risks: single point of failure, needs ongoing support'] },
          { t: 'watch', obj: '4.7', title: 'Scripting and Automation' }
        ]
      },
      {
        id: 'sp-ir', title: '4.8 Incident response & forensics', min: 11, obj: '4.8', teaser: 'The seven steps, root cause, threat hunting and chain of custody.',
        links: ['sp-datasources', 'sp-backups', 'sp-logs-lab'],
        cards: [
          { t: 'read', h: 'The process', body: '<ol><li><b>Preparation</b>: plans, contacts, tools, training, logging in place before anything happens.</li><li><b>Detection</b>: noticing something is wrong (alerts, user reports).</li><li><b>Analysis</b>: confirm it\'s real, scope it, decide severity.</li><li><b>Containment</b>: stop the spread (isolate hosts, block IPs, disable accounts). Short-term then long-term.</li><li><b>Eradication</b>: remove the cause (malware, attacker accounts, backdoors), fix the vulnerability.</li><li><b>Recovery</b>: restore systems to normal operation, watch closely for re-infection.</li><li><b>Lessons learned</b>: post-incident review: what happened, what worked, what to change.</li></ol>', mem: 'Prep, Detect, Analyze, Contain, Eradicate, Recover, Learn.' },
          { t: 'gen', g: 'spIR' },
          { t: 'read', h: 'Training, testing, root cause, hunting', body: '<ul><li><b>Training</b>: responders and staff know their roles.</li><li><b>Testing</b>: <b>tabletop</b> exercises (talk it through) and <b>simulations</b> (realistic drills).</li><li><b>Root cause analysis</b>: find the underlying cause (the unpatched VPN, the missing MFA), not just the symptom.</li><li><b>Threat hunting</b>: proactively search for attackers who haven\'t triggered alerts yet, using hypotheses and threat intel.</li></ul>' },
          { t: 'read', h: 'Digital forensics', body: '<ul><li><b>Legal hold</b>: a requirement to preserve relevant data because of litigation. Don\'t delete anything in scope.</li><li><b>Chain of custody</b>: a documented record of who handled evidence, when, and what they did. Breaks in it can make evidence inadmissible.</li><li><b>Acquisition</b>: collect evidence in <b>order of volatility</b> (most fleeting first: CPU/cache and RAM → network state → disk → backups/archives). Take forensic images and <b>hash</b> them to prove they\'re unchanged.</li><li><b>Preservation</b>: work on copies, store originals securely.</li><li><b>Reporting</b>: document findings clearly.</li><li><b>E-discovery</b>: identifying and collecting electronic data for legal proceedings.</li></ul>', mem: 'Grab RAM before pulling the plug. Hash the image. Log every hand-off.' },
          { t: 'pbq', h: 'PBQ: ransomware response', scenario: '<p>At 9:14 a.m. users report files renamed *.locked on the file server FS01. EDR shows the encryption process started from one HR workstation. Assign each action to its incident response phase.</p>', opts: ['Detection', 'Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons learned'],
            rows: [
              { label: 'Users report renamed files to the help desk', a: 0 },
              { label: 'Confirm scope: which hosts, which accounts, when it started', a: 1 },
              { label: 'Isolate the HR workstation and FS01 from the network', a: 2 },
              { label: 'Remove the malware and the attacker\'s persistence, patch the entry point', a: 3 },
              { label: 'Restore FS01 from clean offline backups and monitor', a: 4 },
              { label: 'Meeting next week: add MFA to VPN, improve phishing training', a: 5 }
            ], why: 'Contain before you eradicate, and eradicate before you recover, or the attacker re-encrypts the restored data.' },
          { t: 'mcq', q: 'During an investigation, which should be collected FIRST?', opts: ['Backup tapes', 'Hard drive image', 'Contents of RAM', 'Printed logs'], a: 2, why: 'Order of volatility: RAM disappears when power is lost.' },
          { t: 'explain', q: 'Explain chain of custody and why it matters.', points: ['Documents every person who handled evidence and when', 'Shows evidence wasn\'t tampered with', 'Uses hashes of forensic images to prove integrity', 'Without it, evidence may be thrown out legally'] },
          { t: 'watch', obj: '4.8', title: 'Incident Response / Incident Planning / Digital Forensics' }
        ]
      },
      {
        id: 'sp-datasources', title: '4.9 Data sources for investigations', min: 9, obj: '4.9', teaser: 'Which log answers which question.',
        pre: ['sp-siem'], links: ['sp-logs-lab', 'sp-ir', 'sp-indicators'],
        cards: [
          { t: 'read', h: 'Log sources', body: '<ul><li><b>Firewall logs</b>: allowed/blocked connections, source/destination IPs and ports.</li><li><b>Application logs</b>: app-level events (logins, errors, transactions, admin actions).</li><li><b>Endpoint logs</b>: from EDR/agents: processes started, files changed.</li><li><b>OS-specific security logs</b>: Windows Security Event Log (4624 successful logon, 4625 failed logon, 4720 user created, 4732 added to a group), Linux <code>/var/log/auth.log</code> or <code>secure</code>.</li><li><b>IDS/IPS logs</b>: signature matches and blocked attacks.</li><li><b>Network logs</b>: routers, switches, DNS, DHCP (which device had which IP when).</li><li><b>Metadata</b>: data about data: email headers, file timestamps and authors, photo GPS tags.</li></ul>', mem: 'Windows 4624 = logon success. 4625 = failed logon.' },
          { t: 'read', h: 'Other data sources', body: '<ul><li><b>Vulnerability scans</b>: was the exploited system known to be vulnerable?</li><li><b>Automated reports</b> and <b>dashboards</b>: trends and outliers at a glance.</li><li><b>Packet captures</b> (Wireshark, tcpdump): the actual traffic contents. Most detail, most storage. NetFlow is the lightweight metadata version.</li></ul>' },
          { t: 'pbq', h: 'PBQ: which data source answers it?', scenario: '<p>An investigation has these questions. Pick the BEST source for each.</p>', opts: ['Firewall logs', 'Windows Security log', 'DHCP logs', 'Packet capture', 'Email headers (metadata)', 'Endpoint (EDR) logs', 'Vulnerability scan results'],
            rows: [
              { label: 'Which laptop had IP 10.0.4.77 at 2:13 p.m. yesterday?', a: 2 },
              { label: 'What exact data was sent in the suspicious HTTP POST?', a: 3 },
              { label: 'Which server actually sent this phishing email and through which relays?', a: 4 },
              { label: 'How many failed logons (4625) for the admin account overnight?', a: 1 },
              { label: 'What process launched powershell.exe on the HR PC?', a: 5 },
              { label: 'Was outbound traffic to 203.0.113.50 allowed or blocked?', a: 0 },
              { label: 'Was the breached web server already flagged as missing patches?', a: 6 }
            ], why: 'IP-to-device = DHCP. Contents = packet capture. Email path = headers. Logon events = Windows Security log. Process tree = EDR. Allow/deny = firewall.' },
          { t: 'mcq', q: 'Which Windows event ID records a failed logon?', opts: ['4624', '4625', '4720', '1102'], a: 1, why: '4625 = failed logon. (4624 success, 4720 user created, 1102 audit log cleared, which is itself a red flag.)' },
          { t: 'explain', q: 'Explain the trade-off between packet captures and NetFlow in an investigation.', points: ['Packet capture has full contents, most detail', 'Packet capture uses huge storage and may be encrypted (TLS)', 'NetFlow is just metadata: who talked to whom, how much, when', 'NetFlow is cheap to keep long-term and good for spotting exfiltration'] },
          { t: 'watch', obj: '4.9', title: 'Log Data / Security Data Sources' }
        ]
      }
    ]
  });
})();
