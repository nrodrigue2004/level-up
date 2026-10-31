/* Security+ SY0-701 Domain 5.0 Security Program Management and Oversight (20% of the exam). Objectives 5.1–5.6. Original lessons. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'secplus'; })[0]; if (!S) return;
  S.units.push({
    dom: 5, name: '5.0 Security program management', tag: '20% of exam',
    blurb: 'The business side: governance, risk math, vendors, compliance and privacy, audits and pen tests, and training people.',
    lessons: [
      {
        id: 'sp-governance', title: '5.1 Governance: policies, standards & roles', min: 10, obj: '5.1', teaser: 'Who decides, what the rules are, and who owns the data.',
        links: ['sp-risk', 'sp-compliance', 'sp-change'],
        cards: [
          { t: 'read', h: 'The document hierarchy', body: '<ul><li><b>Policies</b>: high-level "what and why," approved by leadership. Mandatory. Examples: <b>acceptable use policy (AUP)</b>, information security policy, business continuity, disaster recovery, incident response, software development lifecycle (SDLC), change management.</li><li><b>Standards</b>: specific mandatory requirements that support a policy: password standard (length 14+), access control, physical security, encryption standard (AES-256).</li><li><b>Procedures</b>: step-by-step "how": change management steps, onboarding/offboarding checklists, incident <b>playbooks</b>.</li><li><b>Guidelines</b>: recommendations, not mandatory.</li></ul>', mem: 'Policy = why/what. Standard = exact requirement. Procedure = steps. Guideline = suggestion.' },
          { t: 'read', h: 'Outside forces and upkeep', body: '<p>Governance must account for <b>external considerations</b>: regulatory, legal, industry, and local/regional, national and global rules. Documents need <b>monitoring and revision</b> on a schedule and after major changes or incidents.</p><p><b>Governance structures</b>: boards, committees, government entities; <b>centralized</b> (one team sets rules for all) vs <b>decentralized</b> (business units decide locally).</p>' },
          { t: 'read', h: 'Roles for systems and data', body: '<ul><li><b>Data owner</b>: a senior business person accountable for the data. Decides classification and who gets access.</li><li><b>Data controller</b>: (privacy law term) decides <i>why</i> and <i>how</i> personal data is processed.</li><li><b>Data processor</b>: processes data <i>on behalf of</i> the controller (a payroll company processing your employees\' data).</li><li><b>Data custodian / steward</b>: the hands-on caretaker. IT implements the controls (backups, permissions, encryption); stewards ensure data quality and correct labeling.</li></ul>', mem: 'Owner is accountable. Custodian does the daily care. Controller decides; processor follows instructions.' },
          { t: 'pbq', h: 'PBQ: policy, standard, procedure or guideline?', scenario: '<p>Classify each document excerpt.</p>', opts: ['Policy', 'Standard', 'Procedure', 'Guideline'],
            rows: [
              { label: '"All company data must be protected according to its classification."', a: 0 },
              { label: '"Passwords must be at least 14 characters."', a: 1 },
              { label: '"Step 3: Disable the account in AD. Step 4: Revoke VPN certificate."', a: 2 },
              { label: '"Consider using a password manager to generate passphrases."', a: 3 },
              { label: '"Laptops must use AES-256 full-disk encryption."', a: 1 }
            ], why: 'Broad mandatory intent = policy. Specific measurable requirement = standard. Steps = procedure. "Consider" = guideline.' },
          { t: 'mcq', q: 'Who is ultimately accountable for deciding how customer data is classified?', opts: ['Data custodian', 'Data owner', 'Data processor', 'Help desk'], a: 1, why: 'The owner (a business leader) is accountable; custodians implement the controls.' },
          { t: 'explain', q: 'Explain the difference between a data owner and a data custodian.', points: ['Owner: senior business role, accountable, sets classification and access', 'Custodian: IT/technical role, implements and maintains controls', 'Custodian follows the owner\'s decisions', 'Example: HR director owns HR data, sysadmins are custodians'] },
          { t: 'watch', obj: '5.1', title: 'Security Policies / Security Standards / Security Procedures / Security Considerations / Data Roles and Responsibilities' }
        ]
      },
      {
        id: 'sp-risk', title: '5.2 Risk analysis & business impact', min: 11, obj: '5.2', teaser: 'SLE, ALE, ARO, RTO, RPO: the math that gets things funded.',
        links: ['sp-riskmgmt', 'sp-backups', 'm-decimals'],
        cards: [
          { t: 'read', h: 'Identify and assess', body: '<p><b>Risk</b> = likelihood × impact. First identify risks (threats against vulnerable assets). Assessments can be <b>ad hoc</b> (as needed), <b>recurring</b> (yearly), <b>one-time</b> (for a new project), or <b>continuous</b> (automated, always on).</p><ul><li><b>Qualitative</b> analysis: ratings like low/medium/high on a heat map. Fast, subjective.</li><li><b>Quantitative</b> analysis: dollars and numbers. Slower, more objective.</li></ul>' },
          { t: 'read', h: 'The quantitative formulas', body: '<ul><li><b>AV</b> (asset value): what the asset is worth.</li><li><b>EF</b> (exposure factor): % of the asset lost in one event.</li><li><b>SLE</b> (single loss expectancy) = <b>AV × EF</b>. Cost of one event.</li><li><b>ARO</b> (annualized rate of occurrence): how many times per year it\'s expected (once every 10 years = 0.1).</li><li><b>ALE</b> (annualized loss expectancy) = <b>SLE × ARO</b>. Expected yearly cost.</li></ul><p>Use it to justify spending: if a $20,000/year control cuts ALE from $100,000 to $10,000, it saves $70,000 a year.</p>', mem: 'SLE = AV × EF. ALE = SLE × ARO.',
            simple: '<p>SLE = how much you lose if it happens once. ARO = how often it happens per year. ALE = SLE × ARO = how much it costs you per year on average. If a fix costs less than that, it\'s usually worth it.</p>' },
          { t: 'gen', g: 'spALE' }, { t: 'gen', g: 'spALE' },
          { t: 'read', h: 'Business impact analysis (BIA)', body: '<p>A <b>BIA</b> identifies critical business functions and what happens when they stop. It produces the numbers recovery plans are built on:</p><ul><li><b>RTO</b> (recovery time objective): max time a system can be down before it hurts the business too much. Drives site choice (hot/warm/cold).</li><li><b>RPO</b> (recovery point objective): max data loss you can accept, in time. RPO of 1 hour → back up at least hourly.</li><li><b>MTTR</b> (mean time to repair): average time to fix something.</li><li><b>MTBF</b> (mean time between failures): average time a component runs before failing. Higher = more reliable.</li></ul>', mem: 'RTO = how long down. RPO = how much data lost.' },
          { t: 'mcq', q: 'The business says it can lose no more than 15 minutes of order data. This defines the:', opts: ['RTO', 'RPO', 'MTBF', 'ALE'], a: 1, why: 'Acceptable data loss measured in time = RPO. It drives backup/replication frequency.' },
          { t: 'explain', q: 'Explain SLE, ARO and ALE with a made-up example.', points: ['SLE = asset value × exposure factor (cost of one event)', 'ARO = expected events per year', 'ALE = SLE × ARO (expected yearly loss)', 'Compare ALE reduction to control cost to justify spending'] },
          { t: 'watch', obj: '5.2', title: 'Risk Management / Risk Analysis / Business Impact Analysis' }
        ]
      },
      {
        id: 'sp-riskmgmt', title: '5.2 Risk register, appetite & strategies', min: 9, obj: '5.2', teaser: 'Transfer, accept, avoid, mitigate, and who owns each risk.',
        pre: ['sp-risk'], links: ['sp-vendor', 'sp-governance'],
        cards: [
          { t: 'read', h: 'The risk register', body: '<p>A <b>risk register</b> is the living list of risks: description, likelihood, impact, score, <b>risk owner</b> (the person responsible for managing it), chosen response, and status. <b>Key risk indicators (KRIs)</b> are metrics that warn a risk is rising (number of unpatched criticals). A <b>risk threshold</b> is the level that triggers action.</p>' },
          { t: 'read', h: 'Tolerance and appetite', body: '<ul><li><b>Risk appetite</b>: how much risk the organization is willing to take on overall to pursue its goals. <b>Expansionary</b> (aggressive growth, accepts more), <b>conservative</b> (minimizes risk), <b>neutral</b>.</li><li><b>Risk tolerance</b>: the acceptable variation around that appetite for specific risks.</li></ul>' },
          { t: 'read', h: 'The four responses', body: '<ul><li><b>Mitigate</b> (reduce): add controls to lower likelihood or impact. Most common.</li><li><b>Transfer</b> (share): move the financial impact to someone else: cyber insurance, outsourcing with contracts.</li><li><b>Avoid</b>: stop doing the risky thing altogether (don\'t launch the feature, retire the system).</li><li><b>Accept</b>: consciously live with it because the cost of fixing exceeds the risk. Formal <b>exceptions/exemptions</b> document and sign off on accepted risks.</li></ul><p>Whatever is left after controls is <b>residual risk</b>. <b>Inherent risk</b> is the risk before any controls. <b>Risk reporting</b> keeps leadership informed.</p>', mem: 'Mitigate, Transfer, Avoid, Accept.' },
          { t: 'pbq', h: 'PBQ: pick the risk response', scenario: '<p>Name the strategy in each decision.</p>', opts: ['Mitigate', 'Transfer', 'Avoid', 'Accept'],
            rows: [
              { label: 'Buy cyber insurance covering ransomware costs', a: 1 },
              { label: 'Cancel plans to store customer card numbers at all', a: 2 },
              { label: 'Install EDR on every endpoint', a: 0 },
              { label: 'Leave a low-risk legacy kiosk unpatched with a signed exception', a: 3 },
              { label: 'Add MFA to the VPN', a: 0 }
            ], why: 'Insurance = transfer. Stop the activity = avoid. Add controls = mitigate. Signed exception = accept.' },
          { t: 'mcq', q: 'Risk remaining AFTER controls are applied is called:', opts: ['Inherent risk', 'Residual risk', 'Risk appetite', 'Exposure factor'], a: 1, why: 'Residual = what\'s left. Inherent = before controls.' },
          { t: 'explain', q: 'Explain the four risk responses with a real example of each.', points: ['Mitigate: add a control (MFA, patching)', 'Transfer: insurance or contract shifts the cost', 'Avoid: stop the risky activity entirely', 'Accept: knowingly live with it, documented with sign-off'] },
          { t: 'watch', obj: '5.2', title: 'Risk Management Strategies / Risk Reporting' }
        ]
      },
      {
        id: 'sp-vendor', title: '5.3 Third-party risk & agreements', min: 9, obj: '5.3', teaser: 'Vet vendors and know your SLA from your MOU.',
        links: ['sp-riskmgmt', 'sp-vectors'],
        cards: [
          { t: 'read', h: 'Assessing and choosing vendors', body: '<ul><li><b>Due diligence</b>: investigate a vendor\'s security, finances and reputation before signing.</li><li>Check for <b>conflicts of interest</b>.</li><li>Ask for evidence: <b>penetration test</b> results, <b>evidence of internal audits</b>, <b>independent assessments</b> (like a SOC 2 Type II report or ISO 27001 certification), and <b>supply chain analysis</b> (who are <i>their</i> vendors?).</li><li><b>Right-to-audit clause</b>: contract term letting you audit them.</li><li><b>Questionnaires</b>: standard security questionnaires sent to vendors.</li><li><b>Vendor monitoring</b>: keep checking after signing (breach news, re-assessments).</li><li><b>Rules of engagement</b>: defined limits for testing or working with a vendor\'s systems.</li></ul>' },
          { t: 'read', h: 'Agreement types', body: '<ul><li><b>SLA</b> (service-level agreement): measurable service promises (99.9% uptime, 4-hour response) with penalties.</li><li><b>MOU</b> (memorandum of understanding): a statement of intent between parties; usually not legally binding.</li><li><b>MOA</b> (memorandum of agreement): more formal than an MOU, defines responsibilities; can be binding.</li><li><b>MSA</b> (master service agreement): the umbrella contract with general terms for future work.</li><li><b>SOW / WO</b> (statement of work / work order): the specific project: deliverables, timeline, cost. Sits under the MSA.</li><li><b>NDA</b> (non-disclosure agreement): keeps shared information confidential.</li><li><b>BPA</b> (business partners agreement): how partners share profits, responsibilities and decisions.</li></ul>', mem: 'SLA = uptime numbers. MSA = umbrella. SOW = this project. NDA = keep quiet. MOU = handshake.' },
          { t: 'pbq', h: 'PBQ: pick the agreement', scenario: '<p>Match each need to the agreement.</p>', opts: ['SLA', 'MOU', 'MSA', 'SOW', 'NDA', 'BPA'],
            rows: [
              { label: 'The hosting provider must guarantee 99.95% uptime with credits if missed', a: 0 },
              { label: 'A pen-test firm must not share what it learns about your network', a: 4 },
              { label: 'Overall terms for all future consulting work with one firm', a: 2 },
              { label: 'This specific 6-week firewall migration, its deliverables and price', a: 3 },
              { label: 'Two agencies informally agree to share threat intel', a: 1 },
              { label: 'Two companies co-own a product and split profits', a: 5 }
            ], why: 'Uptime numbers = SLA. Confidentiality = NDA. Umbrella terms = MSA. Specific project = SOW. Informal intent = MOU. Partnership = BPA.' },
          { t: 'mcq', q: 'Which contract clause lets you inspect a cloud vendor\'s security controls?', opts: ['Right-to-audit clause', 'NDA', 'SLA credit', 'Rules of engagement'], a: 0, why: 'A right-to-audit clause grants permission to audit the vendor.' },
          { t: 'explain', q: 'Explain why vendor risk is your risk.', points: ['Vendors often have access to your data or networks', 'A breach at a vendor/MSP can reach you (supply chain)', 'Due diligence, audits, questionnaires before signing', 'Contracts (right to audit, SLA, NDA) and ongoing monitoring after'] },
          { t: 'watch', obj: '5.3', title: 'Third-party Risk Assessment / Agreement Types' }
        ]
      },
      {
        id: 'sp-compliance', title: '5.4 Compliance & privacy', min: 9, obj: '5.4', teaser: 'Reporting, fines, GDPR roles and the right to be forgotten.',
        links: ['sp-data', 'sp-governance', 'sp-audits'],
        cards: [
          { t: 'read', h: 'Compliance', body: '<p><b>Compliance</b> means meeting laws, regulations, contracts and standards (PCI DSS for cards, HIPAA for health data, GDPR for EU personal data, SOX for public company finances).</p><ul><li><b>Reporting</b>: <b>internal</b> (to leadership/the board) and <b>external</b> (to regulators, card brands, customers).</li><li><b>Monitoring</b>: <b>due diligence</b> (investigating and understanding the risks) and <b>due care</b> (actually acting reasonably to address them); <b>attestation and acknowledgement</b> (people sign that they read policy; executives attest controls work); internal and external checks; <b>automation</b> to track it continuously.</li><li><b>Consequences of non-compliance</b>: fines, sanctions, reputational damage, loss of license, contractual impacts (a payment processor dropping you).</li></ul>', mem: 'Due diligence = investigate. Due care = act on it.' },
          { t: 'read', h: 'Privacy', body: '<ul><li>Privacy laws exist at local/regional (state laws like CCPA), national, and global (GDPR) levels, and often reach companies outside the region if they handle residents\' data.</li><li><b>Data subject</b>: the person the data is about.</li><li><b>Controller</b> decides purposes and means of processing; <b>processor</b> processes on the controller\'s behalf.</li><li><b>Ownership</b>: who owns the data and is accountable.</li><li><b>Data inventory and retention</b>: know what personal data you have and where, and delete it when it\'s no longer needed.</li><li><b>Right to be forgotten</b> (GDPR): data subjects can ask for their personal data to be erased.</li></ul>' },
          { t: 'mcq', q: 'A company uses a cloud payroll service to process employee data. Under GDPR, the payroll service is the:', opts: ['Data subject', 'Data controller', 'Data processor', 'Data owner'], a: 2, why: 'It processes data on the company\'s behalf; the company (controller) decides why and how.' },
          { t: 'mcq', q: 'A customer in France asks a retailer to delete all their personal data. This is the:', opts: ['Right to audit', 'Right to be forgotten', 'Legal hold', 'Data sovereignty'], a: 1, why: 'GDPR\'s right to erasure. (A legal hold can override it while litigation is pending.)' },
          { t: 'explain', q: 'Explain due diligence vs due care.', points: ['Due diligence: researching and understanding risks/obligations', 'Due care: taking reasonable actions to protect', 'Both are expected by regulators and courts', 'Failing them can mean negligence, fines, lawsuits'] },
          { t: 'watch', obj: '5.4', title: 'Compliance / Privacy' }
        ]
      },
      {
        id: 'sp-audits', title: '5.5 Audits, assessments & pen testing', min: 10, obj: '5.5', teaser: 'Internal vs external, attestation, and known vs unknown environment tests.',
        links: ['sp-vulnmgmt', 'sp-netscan-lab', 'sp-compliance'],
        cards: [
          { t: 'read', h: 'Audits and assessments', body: '<ul><li><b>Attestation</b>: a formal statement by an auditor that controls are in place and working (e.g. a SOC 2 report).</li><li><b>Internal</b>: by your own staff. Includes compliance checks, the board\'s <b>audit committee</b>, and <b>self-assessments</b>.</li><li><b>External</b>: by outsiders: <b>regulatory</b> audits and <b>examinations</b> (by government regulators), <b>assessments</b>, and <b>independent third-party audits</b>. More objective.</li></ul>' },
          { t: 'read', h: 'Penetration testing', body: '<p>Authorized, simulated attacks to find what real attackers could exploit. Always with written permission and <b>rules of engagement</b> (scope, times, allowed techniques, contacts).</p><ul><li><b>Known environment</b> (white box): testers get full details (network diagrams, code).</li><li><b>Partially known</b> (gray box): some information.</li><li><b>Unknown environment</b> (black box): no information, like an outside attacker.</li><li><b>Physical</b>: testing locks, badges, tailgating.</li><li><b>Offensive</b> (red team attacks), <b>defensive</b> (blue team defends), <b>integrated</b> (purple team: both working together and sharing what they learn). That\'s exactly your homelab: Kali attacking, Security Onion watching.</li></ul><p><b>Reconnaissance</b>: <b>passive</b> (OSINT, public records, no direct contact with the target) vs <b>active</b> (scanning and probing the target directly, which can be detected).</p>', mem: 'Known/partially known/unknown = how much the tester is told. Passive recon never touches the target.' },
          { t: 'mcq', q: 'Testers receive source code and network diagrams before starting. This is a:', opts: ['Unknown environment test', 'Partially known environment test', 'Known environment test', 'Passive reconnaissance'], a: 2, why: 'Full information = known environment (white box).' },
          { t: 'mcq', q: 'Which is PASSIVE reconnaissance?', opts: ['Running nmap against the target', 'Reading the company\'s job posts and LinkedIn for tech stack clues', 'Brute-forcing the VPN', 'Calling the help desk pretending to be staff'], a: 1, why: 'Passive recon gathers public info without interacting with target systems. Scanning is active; calling staff is social engineering.' },
          { t: 'mcq', q: 'Red and blue teams work side by side, sharing each attack and detection in real time. This is:', opts: ['Offensive testing', 'Defensive testing', 'Integrated (purple team) testing', 'An external audit'], a: 2, why: 'Integrated/purple teaming combines both to improve detection fast.' },
          { t: 'explain', q: 'Explain known, partially known and unknown environment pen tests and when you\'d pick each.', points: ['Known: full info, most thorough, efficient use of time', 'Partially known: some info, simulates an insider or informed attacker', 'Unknown: no info, simulates an outside attacker realistically', 'All need written authorization and rules of engagement'] },
          { t: 'watch', obj: '5.5', title: 'Audits and Assessments / Penetration Tests' }
        ]
      },
      {
        id: 'sp-awareness', title: '5.6 Security awareness', min: 8, obj: '5.6', teaser: 'Phishing campaigns, anomalous behavior, and training that sticks.',
        links: ['sp-social', 'sp-phish-lab'],
        cards: [
          { t: 'read', h: 'Phishing programs', body: '<ul><li><b>Phishing campaigns</b>: simulated phishing emails sent to staff to measure and train.</li><li><b>Recognizing a phishing attempt</b>: urgency, mismatched sender domain, unexpected attachments, links whose real URL doesn\'t match the text, requests for credentials or payment changes.</li><li><b>Responding to reported suspicious messages</b>: a one-click "Report phish" button, fast triage by security, thanking the reporter (reporting should feel rewarded, never punished).</li></ul>' },
          { t: 'read', h: 'Anomalous behavior & training topics', body: '<p>Teach people to notice behavior that is <b>risky</b> (disabling antivirus to install a game), <b>unexpected</b> (a coworker asking for access they never needed), or <b>unintentional</b> (sending a file to the wrong person).</p><p>Training topics: <b>policies/handbooks</b>, <b>situational awareness</b>, <b>insider threat</b>, <b>password management</b>, <b>removable media and cables</b> (don\'t plug in found USBs or random charging cables), <b>social engineering</b>, <b>operational security</b> (don\'t post badge photos), and <b>hybrid/remote work</b> (home Wi-Fi, screen privacy in public).</p>' },
          { t: 'read', h: 'Running the program', body: '<p><b>Development</b> (build content for your audience), <b>execution</b> (deliver it: short, frequent, interactive beats a yearly hour-long video), and <b>reporting and monitoring</b>: <b>initial</b> baseline (first phishing test click rate) and <b>recurring</b> measurement to show improvement.</p>' },
          { t: 'mcq', q: 'After a simulated phishing campaign, what\'s the BEST way to treat employees who reported the email?', opts: ['Ignore them', 'Thank/recognize them to reinforce reporting', 'Make them retake training', 'Discipline them'], a: 1, why: 'You want reporting to be rewarded. Fast, positive feedback makes people report real phishing too.' },
          { t: 'mcq', q: 'Which metric BEST shows an awareness program is working over time?', opts: ['Number of slides in the training', 'Falling click rate and rising report rate on recurring phishing tests', 'Total training hours', 'Number of policies'], a: 1, why: 'Recurring measurement against an initial baseline shows real behavior change.' },
          { t: 'explain', q: 'Explain what makes a security awareness program effective.', points: ['Short, frequent, relevant training instead of a yearly lecture', 'Simulated phishing with an easy report button', 'Measure a baseline, then track recurring results', 'Reward reporting; cover remote work, removable media, insider threat'] },
          { t: 'watch', obj: '5.6', title: 'Security Awareness / User Training' }
        ]
      },
      {
        id: 'sp-acronyms', title: 'Acronym arena', min: 5, obj: 'all', teaser: 'The exam\'s acronym list, drilled on repeat with fresh picks each time.',
        links: ['sp-ports'],
        cards: [
          { t: 'read', h: 'Why acronyms matter', body: '<p>The SY0-701 objectives come with an acronym list of over 300 entries, and questions use them without spelling them out. This lesson keeps drawing different ones. Use Practice drill for unlimited rounds.</p>' },
          { t: 'gen', g: 'spAcronym' }, { t: 'gen', g: 'spAcronym' }, { t: 'gen', g: 'spAcronym' }, { t: 'gen', g: 'spAcronym' }, { t: 'gen', g: 'spAcronym' },
          { t: 'gen', g: 'spPort' }, { t: 'gen', g: 'spAlg' }
        ]
      }
    ]
  });
})();
