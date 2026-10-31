/* Projects: step-by-step builds on nate's own homelab (Proxmox: pfSense, Kali, Metasploitable 2, DVWA/WebGoat,
   Win Server 2022 AD DC, Win 11, Security Onion, Tailscale). Purple-team style: do something on the red side
   in YOUR lab, then find it on the blue side and write it up. Everything here stays inside equipment you own.
   References: MITRE ATT&CK, Atomic Red Team (Red Canary, MIT license), Security Onion docs, CIS Benchmarks. */
(function () {
  function steps(list) { return '<ol>' + list.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>'; }
  function code(lines) { return '<pre>' + lines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>'; }
  window.RH_SUBJECTS = window.RH_SUBJECTS || [];
  window.RH_SUBJECTS.push({
    id: 'projects', name: 'Projects: homelab missions', mark: '🛠️', color: '#5fb3a1', stat: 'tech', group: 'Certs & career',
    blurb: 'Purple-team missions on your own lab, plus portfolio.',
    intro: 'Hands-on missions for your Proxmox homelab. Each one has a red step (make something happen, only inside your lab), a blue step (find it in Security Onion, logs, or the tool), and a write-up step. Ten finished write-ups on GitHub beat any certification on a resume for SOC and junior pentest roles. Keep the lab isolated and snapshot before every mission.',
    units: [
      {
        name: 'Mission 0 · Lab foundations', tag: 'do first',
        blurb: 'Rules, segmentation, and getting your sensor to see traffic.',
        lessons: [
          {
            id: 'pj-rules', title: 'Lab rules & scope', min: 6, teaser: 'The rules that keep this legal and your home network safe.',
            links: ['pj-segment'],
            cards: [
              { t: 'read', h: 'The rules', body: '<ul><li><b>Only your own systems.</b> Scanning or attacking anything you don\'t own or have written permission to test is illegal (the Computer Fraud and Abuse Act in the US). Your lab IP ranges are your scope; write them down.</li><li><b>Vulnerable VMs never touch the internet.</b> Metasploitable 2 and DVWA are deliberately broken. Keep them on an isolated lab network with no inbound access and no port forwards.</li><li><b>Snapshot before every mission</b> so you can roll back in seconds.</li><li><b>No real personal data</b> in the lab.</li><li><b>Remote access only through Tailscale</b>, never by opening ports on your home router.</li></ul>', mem: 'Own it, isolate it, snapshot it.' },
              { t: 'mcq', q: 'Which is OK to scan with nmap?', opts: ['Your neighbor\'s Wi-Fi devices', 'Your Metasploitable VM on your isolated lab network', 'Your employer\'s servers "to help"', 'A random website'], a: 1, why: 'Only systems you own or have explicit written authorization to test.' },
              { t: 'explain', q: 'Write your lab\'s scope statement.', points: ['List the networks/IP ranges that are in scope', 'State that only lab VMs you own are targets', 'Vulnerable VMs isolated from the internet', 'Snapshots before each mission'] }
            ]
          },
          {
            id: 'pj-segment', title: 'Mission: segment the lab with pfSense', min: 15, teaser: 'Separate zones so a "compromised" VM can\'t reach your real network.',
            pre: ['pj-rules'], links: ['net-ip', 'sp-segment'],
            cards: [
              { t: 'read', h: 'Target design', body: '<ul><li><b>WAN</b>: pfSense\'s link to your home router.</li><li><b>MGMT</b> (e.g. 10.10.0.0/24): Proxmox and pfSense admin pages only.</li><li><b>CORP</b> (10.10.10.0/24): the AD domain controller and Windows 11.</li><li><b>LAB / victims</b> (10.10.20.0/24): Metasploitable, DVWA, WebGoat.</li><li><b>ATTACK</b> (10.10.30.0/24): Kali.</li></ul><p>In Proxmox, create one Linux bridge (or VLAN) per zone and give pfSense an interface on each.</p>' },
              { t: 'read', h: 'Steps', body: steps([
                'In Proxmox: add bridges vmbr1–vmbr4 with no physical port (internal-only), one per zone.',
                'Add a NIC to the pfSense VM on each bridge; assign them in pfSense (Interfaces → Assignments) and give each a static IP like 10.10.20.1/24.',
                'Enable DHCP on each internal interface.',
                'Firewall rules (default deny, then allow): ATTACK → LAB allowed; ATTACK → CORP allowed (for AD missions); LAB → anywhere blocked; nothing internal → your home LAN; only MGMT → pfSense/Proxmox web UIs.',
                'Block LAB from the internet entirely; allow CORP outbound for updates.',
                'Verify from Kali: <code>ping</code> a LAB host (works), ping your home router\'s LAN IP (fails). From Metasploitable: ping 8.8.8.8 (fails).'
              ]) },
              { t: 'gen', g: 'netSubnet' },
              { t: 'mcq', q: 'Metasploitable gets "compromised" in a mission. Which rule keeps it from reaching your real home devices?', opts: ['Allow LAB → any', 'Block LAB → home LAN and internet (default deny outbound from LAB)', 'Port forward 22 to it', 'Put it on the same bridge as your PC'], a: 1, why: 'Egress filtering from the victim zone contains anything that happens there.' },
              { t: 'explain', q: 'Describe your lab\'s network zones and the most important firewall rules.', points: ['Separate zones: management, corporate/AD, vulnerable lab, attacker', 'Default deny between zones', 'Attacker zone can reach lab targets only', 'Vulnerable zone blocked from internet and home LAN'] }
            ]
          },
          {
            id: 'pj-sensor', title: 'Mission: make Security Onion see everything', min: 15, teaser: 'Mirror traffic to the sensor and prove it alerts.',
            pre: ['pj-segment'], links: ['sp-siem', 'net-dns'],
            cards: [
              { t: 'read', h: 'Steps', body: steps([
                'Give the Security Onion VM two NICs: management (in MGMT) and a sniffing NIC with no IP.',
                'Mirror lab traffic to the sniffing NIC. Simple options in Proxmox: an Open vSwitch bridge with a mirror port, or a dedicated bridge where you mirror with tc. (Security Onion docs list both.)',
                'In the SO console, confirm Zeek and Suricata are running (<code>sudo so-status</code>).',
                'Trigger a known-harmless test alert from a lab VM: <code>curl http://testmynids.org/uid/index.html</code> (the response looks like a root "id" command, which Suricata flags).',
                'Find it in SOC → Alerts. Click through to the Zeek connection log and the PCAP.',
                'Optional: install the Elastic Agent on the DC and Win 11 so Windows Event Logs and Sysmon land in SO too.'
              ]) },
              { t: 'mcq', q: 'Why does the sniffing NIC have no IP address?', opts: ['Saves addresses', 'It only listens to mirrored traffic, so it shouldn\'t be reachable or send anything', 'Security Onion requires DHCP', 'It\'s faster'], a: 1, why: 'A passive sensor interface should be invisible on the network.' },
              { t: 'explain', q: 'Explain how you verified your sensor actually sees lab traffic.', points: ['Mirrored lab traffic to a no-IP sniffing interface', 'Checked services with so-status', 'Triggered a harmless known alert (testmynids)', 'Found the alert, the Zeek logs and the PCAP in the console'] }
            ]
          }
        ]
      },
      {
        name: 'Missions · Detect the basics', tag: 'purple team',
        blurb: 'Scan, brute force and web attacks in your lab, then the detections.',
        lessons: [
          {
            id: 'pj-scan', title: 'Mission: catch your own port scan', min: 15, teaser: 'Run nmap from Kali, find it in Zeek and Suricata.',
            pre: ['pj-sensor'], links: ['net-tcp', 'sp-indicators'],
            cards: [
              { t: 'read', h: 'Red', body: '<p>From Kali, against your Metasploitable IP only:</p>' + code(['nmap -sS -T4 10.10.20.10        # SYN scan, top 1000 ports', 'nmap -sV -p- 10.10.20.10        # all ports + service versions']) + '<p>Note the start and end times. Save the output (<code>-oN scan1.txt</code>).</p>' },
              { t: 'read', h: 'Blue', body: steps([
                'In SO Alerts, look for Suricata "scan" signatures from your Kali IP.',
                'In Hunt/Dashboards, filter Zeek conn logs by source = Kali. Look at the shape: one source, hundreds of destination ports, mostly REJ/S0 connection states, seconds apart.',
                'Compare the -sS run with the -sV run. Which is noisier? Which reveals more to the defender?',
                'Write a detection idea: "one source to more than 100 distinct ports on one host within 60 seconds."'
              ]) },
              { t: 'mcq', q: 'In Zeek, many connections with state REJ from one source to many ports most likely means:', opts: ['A backup job', 'A port scan hitting closed ports', 'A DNS failure', 'Normal browsing'], a: 1, why: 'REJ = the target answered with RST (closed). Many of them across ports = scan.' },
              { t: 'explain', q: 'Write the summary section of your scan-detection write-up.', points: ['What you ran, from where, to what (in-scope lab IP)', 'Which alerts and logs showed it', 'What the traffic pattern looked like', 'A detection rule idea and its false-positive risks'] }
            ]
          },
          {
            id: 'pj-brute', title: 'Mission: brute force vs. detection & lockout', min: 15, teaser: 'Generate failed logins on Linux and Windows, then stop them.',
            pre: ['pj-scan'], links: ['lx-harden', 'df-analyze'],
            cards: [
              { t: 'read', h: 'Red (in your lab)', body: '<p>Linux: from Kali, try SSH to Metasploitable with a few wrong passwords by hand, then a short list of 20 wrong passwords in a loop. Windows: on Win 11, try logging in as a domain test user with wrong passwords 10 times.</p><p>You\'re making the <i>pattern</i>, not trying to break in.</p>' },
              { t: 'read', h: 'Blue', body: steps([
                'Linux: <code>grep "Failed password" /var/log/auth.log</code> on the target, then run your Python log scanner from the CS unit on it.',
                'Windows: on the DC, Event Viewer → Security → filter for 4625 (failed logon) and 4740 (account locked out).',
                'In SO (if Windows logs are shipped), build a query: event 4625 grouped by source host and user.',
                'Fix: enable an account lockout policy via Group Policy (e.g. 10 attempts, 15 minutes), add fail2ban on Linux, and re-run the red step to watch it get blocked.'
              ]) },
              { t: 'mcq', q: 'Which Windows event shows an account was locked out?', opts: ['4624', '4625', '4740', '4688'], a: 2, why: '4740 = locked out. 4625 = each failed attempt.' },
              { t: 'gen', g: 'linuxCmd' }
            ]
          },
          {
            id: 'pj-web', title: 'Mission: DVWA & WebGoat, attack then fix', min: 20, teaser: 'Learn SQLi and XSS hands-on, then read the secure code.',
            pre: ['pj-sensor', 'web-owasp'], links: ['db-inject', 'web-auth'],
            cards: [
              { t: 'read', h: 'Plan', body: steps([
                'In DVWA, set security to <b>Low</b>. Work the SQL Injection, XSS (Reflected and Stored) and Command Injection modules until you understand why each works.',
                'Switch to <b>Medium</b> and <b>High</b>: see what each "defense" blocks and why weak filters still fail.',
                'Click <b>View Source</b> and compare Low vs <b>Impossible</b>. Impossible shows the right fix (parameterized queries, output encoding, allow-lists, anti-CSRF tokens).',
                'Do the matching WebGoat lessons; they explain each step.',
                'Blue side: check the web server access logs and SO alerts for your payloads. Which got flagged? Which slipped through?'
              ]) + '<p>PortSwigger\'s free Web Security Academy has guided labs on every one of these if you get stuck.</p>' },
              { t: 'gen', g: 'webVuln' }, { t: 'gen', g: 'webVuln' },
              { t: 'explain', q: 'Explain what DVWA\'s "Impossible" level does differently for SQL injection.', points: ['Uses a parameterized/prepared query', 'Input never becomes part of the SQL code', 'Validates the input type (e.g. numeric ID)', 'Adds an anti-CSRF token'] }
            ]
          }
        ]
      },
      {
        name: 'Missions · Active Directory & endpoints', tag: 'purple team',
        blurb: 'Harden the domain, then emulate real techniques with Atomic Red Team and catch them.',
        lessons: [
          {
            id: 'pj-ad', title: 'Mission: build & audit the AD domain', min: 20, teaser: 'OUs, users, GPOs, then a PingCastle health check.',
            pre: ['pj-segment'], links: ['sp-iam', 'os-files'],
            cards: [
              { t: 'read', h: 'Build', body: steps([
                'Create OUs: Users, Admins, Workstations, Servers, Service Accounts.',
                'Create a normal user for daily use and a separate admin account (tiering: never browse or read email as admin).',
                'GPOs: password policy (length 14+), account lockout, <b>advanced audit policy</b> (logon, account management, process creation 4688 with command line), disable LLMNR and NetBIOS name resolution, enable PowerShell script block logging.',
                'Install <b>Sysmon</b> (free, Microsoft Sysinternals) with a community config on the DC and Win 11.'
              ]) },
              { t: 'read', h: 'Audit', body: steps([
                'Run <b>PingCastle</b> (free for your own domain) on the DC. Read the risk score and top findings.',
                'Fix the top 3 (common ones: old protocols enabled, no LAPS for local admin passwords, too many admins).',
                'Re-run and record the score change. That before/after is a great portfolio item.'
              ]) },
              { t: 'mcq', q: 'Why use a separate admin account instead of making your daily account an admin?', opts: ['Windows requires it', 'If the daily account is phished or runs malware, the attacker doesn\'t instantly get admin rights', 'Admins can\'t read email', 'It\'s faster'], a: 1, why: 'Least privilege and account tiering limit the blast radius.' },
              { t: 'explain', q: 'List the GPO settings that improve detection and security in your domain, and why.', points: ['Strong password and lockout policy', 'Advanced auditing incl. process creation with command line', 'PowerShell script block logging', 'Disable LLMNR/NetBIOS to stop name-poisoning tricks'] }
            ]
          },
          {
            id: 'pj-atomic', title: 'Mission: Atomic Red Team & ATT&CK mapping', min: 20, teaser: 'Run safe, purpose-built technique tests and detect each one.',
            pre: ['pj-ad'], links: ['sp-edr', 'df-analyze'],
            cards: [
              { t: 'read', h: 'What Atomic Red Team is', body: '<p>An open-source library of small, documented tests, each mapped to a <b>MITRE ATT&amp;CK</b> technique, made so defenders can check whether their monitoring catches it. Run them only on your lab Win 11 VM, after a snapshot.</p>' },
              { t: 'read', h: 'Steps', body: steps([
                'Snapshot Win 11. Install Invoke-AtomicRedTeam (instructions on its GitHub wiki).',
                'Pick a technique, read its test first: e.g. <b>T1053.005</b> Scheduled Task (persistence) or <b>T1087.002</b> Domain Account Discovery.',
                'Run it with <code>Invoke-AtomicTest T1053.005 -TestNumbers 1</code>; note the time.',
                'Blue: find it. Sysmon event 1 (process creation), Windows 4698 (scheduled task created), or 4688 with command line; in SO, search by host and time.',
                'Run the test\'s cleanup (<code>-Cleanup</code>), then revert the snapshot anyway.',
                'Record: technique ID, what ran, which log showed it, and a detection rule (Sigma format is the portable standard).'
              ]) },
              { t: 'mcq', q: 'Which Windows event logs a new scheduled task being created?', opts: ['4624', '4698', '4740', '1102'], a: 1, why: '4698 = scheduled task created (needs object access auditing). 1102 = the security log was cleared, itself a big red flag.' },
              { t: 'explain', q: 'Write a detection write-up template for one ATT&CK technique.', points: ['Technique ID and name', 'What was executed and when', 'Which data sources and event IDs showed it', 'Detection logic (e.g. a Sigma rule) and likely false positives'] }
            ]
          },
          {
            id: 'pj-ir', title: 'Mission: run a mini incident end-to-end', min: 20, teaser: 'Tabletop to timeline using your lab\'s own data.',
            pre: ['pj-atomic', 'df-collect'], links: ['sp-ir', 'df-analyze'],
            cards: [
              { t: 'read', h: 'Scenario', body: '<p>Pretend an alert fired on Win 11. Using a snapshot of the VM after your Atomic test:</p>' + steps([
                '<b>Identify</b>: which alert, which host, which user, what time?',
                '<b>Contain</b>: in pfSense, block the host (or isolate it with an alias rule). Document the time.',
                '<b>Collect</b>: memory first (WinPmem or Magnet RAM Capture), then a disk snapshot from Proxmox. Hash both.',
                '<b>Analyze</b>: Volatility 3 on the memory image (pslist, netscan, cmdline); event logs; build a timeline.',
                '<b>Eradicate &amp; recover</b>: remove persistence, revert or rebuild, reset credentials.',
                '<b>Lessons learned</b>: what detection fired, what was missing, what you\'d change.'
              ]) },
              { t: 'gen', g: 'volOrder' },
              { t: 'explain', q: 'Summarize your mini incident as you would to a manager.', points: ['What happened and when (timeline)', 'How it was detected and contained', 'Impact and what evidence shows', 'Fixes and improvements to prevent it'] }
            ]
          }
        ]
      },
      {
        name: 'Builds · Useful home services', tag: 'fun builds',
        blurb: 'Projects that make your network better and give you more to show.',
        lessons: [
          {
            id: 'pj-remote', title: 'Build: secure remote access with Tailscale', min: 12, teaser: 'Reach the lab from anywhere with zero open ports.',
            pre: ['pj-segment'], links: ['sp-vpn', 'sp-zerotrust'],
            cards: [
              { t: 'read', h: 'Steps', body: steps([
                'Install Tailscale on one jump host (a small Linux VM in MGMT) and on your phone/laptop.',
                'Make the jump host a <b>subnet router</b> for only MGMT, or keep it to SSH on the jump host.',
                'Write <b>ACLs</b> in the admin console so only your devices can reach it, and only on the ports you need.',
                'Turn on MFA on your Tailscale identity provider account and key expiry.',
                'Confirm your home router has <b>zero</b> port forwards.'
              ]) + '<p>This is zero trust in miniature: identity-based access, least privilege, no exposed services.</p>' },
              { t: 'mcq', q: 'Why is Tailscale safer than port-forwarding RDP to your lab?', opts: ['It\'s faster', 'Nothing is exposed to the internet; access requires authenticated devices and ACLs', 'RDP is illegal', 'It encrypts your hard drive'], a: 1, why: 'Exposed RDP is one of the most attacked services on the internet.' }
            ]
          },
          {
            id: 'pj-pihole', title: 'Build: Pi-hole DNS filtering (Raspberry Pi or VM)', min: 12, teaser: 'Network-wide ad and tracker blocking, plus DNS visibility.',
            pre: ['net-dns'], links: ['pj-remote'],
            cards: [
              { t: 'read', h: 'Steps', body: steps([
                'Install Raspberry Pi OS Lite (or a small Debian VM), give it a static IP.',
                'Run the official installer from pi-hole.net (read the script before running it).',
                'Point your router\'s DHCP DNS setting (or pfSense\'s DNS resolver forwarders) at the Pi-hole.',
                'Add blocklists; check the query log to see what your devices really talk to.',
                'Security angle: watch for odd domains and high query volume, the same DNS signals SOC analysts hunt for.'
              ]) },
              { t: 'mcq', q: 'A smart TV makes 5,000 DNS queries an hour to tracking domains. Where would you see this?', opts: ['Pi-hole query log', 'The TV\'s settings', 'Your ISP bill', 'Nowhere'], a: 0, why: 'Central DNS gives visibility into every device on the network.' }
            ]
          },
          {
            id: 'pj-portfolio', title: 'Turn missions into a portfolio', min: 10, teaser: 'GitHub write-ups and resume bullets that get interviews.',
            pre: ['pj-scan'], links: ['career-soc', 'career-pentest'],
            cards: [
              { t: 'read', h: 'The write-up format', body: '<ol><li><b>Objective</b>: one sentence.</li><li><b>Lab setup</b>: a simple diagram (draw.io, free).</li><li><b>What I did</b>: the red step, briefly.</li><li><b>Detection</b>: screenshots of the alert/log, the query you used.</li><li><b>Fix / rule</b>: what you changed or the Sigma rule.</li><li><b>What I learned</b>.</li></ol><p>Put each in a GitHub repo (README.md) or a free blog. Scrub anything private (real IPs, names).</p>' },
              { t: 'read', h: 'Resume bullets', body: '<ul><li>"Built a segmented 7-VM Proxmox lab with pfSense and Security Onion; validated network detections for scanning and brute-force activity."</li><li>"Hardened an Active Directory domain using PingCastle findings, improving the risk score from X to Y."</li><li>"Emulated 10 MITRE ATT&amp;CK techniques with Atomic Red Team and wrote Sigma detections for 8."</li></ul><p>Numbers and specific tools make bullets believable. Be ready to explain every one in an interview.</p>' },
              { t: 'explain', q: 'Write one resume bullet for a mission you completed.', points: ['Starts with an action verb', 'Names the tools used', 'Says what was achieved', 'Includes a number or measurable result'] }
            ]
          }
        ]
      }
    ]
  });
})();
