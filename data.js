// Static content for the planner. Edit freely.
window.PLANNER_DATA = {
  affirmations: [
    "I will be successful.",
    "I am stronger than my vices.",
    "I am slow to anger.",
    "Consistency matters more than perfection.",
    "Eliminate bad thoughts immediately."
  ],
  bonusAffirmations: [
    "Small steps today build the life I want.",
    "I show up even when I don't feel like it.",
    "My past does not decide my future. My next action does.",
    "I learn things for real now, one piece at a time.",
    "Discipline is me keeping a promise to myself.",
    "I can do hard things for one more minute.",
    "I am patient with myself and relentless with my habits.",
    "Every rep, every page, every application counts.",
    "I choose clarity over comfort.",
    "I am becoming someone I respect."
  ],

  // checklist sections; ids must stay stable so history keeps working
  checklist: [
    { id: "morning", title: "Morning", icon: "🌅", items: [
      ["wake6", "Wake up at 6:00 AM"],
      ["teeth_am", "Brush teeth and floss"],
      ["face_am", "Wash face"],
      ["deo", "Apply deodorant and lip balm"],
      ["smoothie", "Smoothie"],
      ["gym", "Gym"],
      ["p_sudoku", "Sudoku", "puzzle:sudoku"],
      ["p_cross", "Crossword", "puzzle:crossword"],
      ["p_word", "Word guess", "puzzle:word"],
      ["p_groups", "Groups", "puzzle:groups"]
    ]},
    { id: "breakfast", title: "Breakfast", icon: "🥤", items: [
      ["make_smoothie", "Make my smoothie", "recipe:smoothie"],
      ["coffee", "Have coffee"]
    ]},
    { id: "career", title: "Career", icon: "💼", items: [
      ["secplus", "Study for Security+ for 1 hour"],
      ["jobs", "Submit 5 job applications"]
    ]},
    { id: "training", title: "Training", icon: "🥊", items: [
      ["workout", "Complete my scheduled workout", "workout"],
      ["run", "0.5 mile run before every workout"],
      ["boxing", "20 minutes boxing"]
    ]},
    { id: "dinner", title: "Dinner", icon: "🍗", items: [
      ["chicken", "Rotisserie chicken, skin removed"],
      ["bread", "2 slices whole-grain bread"],
      ["veg", "2 cups mixed vegetables"]
    ]},
    { id: "night", title: "Night", icon: "🌙", items: [
      ["teeth_pm", "Brush teeth"],
      ["shower", "Shower"],
      ["face_pm", "Cleanse face"],
      ["moist", "Moisturize"],
      ["stretch", "Stretch + breathwork 10 min, or QiGong"],
      ["prep", "Prepare for tomorrow"]
    ]},
    { id: "habits", title: "Daily habits", icon: "✨", items: [
      ["water80", "Drink 80 oz total", "auto:water"],
      ["convo", "Make conversation"],
      ["present", "Be present"],
      ["outside", "Spend time outside in daylight"],
      ["read", "Read a passage", "auto:passage"],
      ["sober", "Stay free from recreational drugs, alcohol, and nicotine"]
    ]},
    { id: "learning", title: "Learning", icon: "📚", items: [
      ["learn", "Spend time on one topic", "learning"]
    ]}
  ],

  learningTopics: [
    "Consume art", "Produce art", "Exercise hobby", "Spanish", "Computer science",
    "History", "Piano or guitar", "Psychology", "Philosophy", "Science"
  ],

  smoothie: {
    name: "Morning smoothie",
    ingredients: [
      ["2 cups milk", 240, 16],
      ["1 serving plant protein powder", 120, 20],
      ["5 g creatine", 0, 0],
      ["1 cup frozen mixed berries", 70, 1],
      ["1 banana", 105, 1],
      ["½ cup dry oats", 150, 5],
      ["1 tablespoon peanut butter", 95, 4]
    ]
  },

  // quick-add foods: [name, calories, protein]. Estimates; edit in the Food tab.
  presets: [
    ["Morning smoothie", 780, 47],
    ["Dinner: chicken, bread, veg", 640, 61],
    ["Coffee (black)", 5, 0],
    ["Coffee with milk", 40, 2],
    ["Rotisserie chicken, 6 oz no skin", 300, 45],
    ["Whole-grain bread, 2 slices", 220, 10],
    ["Mixed vegetables, 2 cups", 120, 6],
    ["Eggs, 2 large", 140, 12],
    ["Greek yogurt, 1 cup", 130, 23],
    ["Protein shake", 160, 30],
    ["Banana", 105, 1],
    ["Apple", 95, 0]
  ],

  // Passages: short readings with a reflection question.
  passages: [
    { text: "First say to yourself what you would be; and then do what you have to do.", by: "Epictetus, Discourses", ask: "Who do you want to be by tonight? What is one thing that person does today?" },
    { text: "The happiness of your life depends upon the quality of your thoughts.", by: "Marcus Aurelius, Meditations", ask: "Which thought keeps coming back today? Is it helping you?" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", by: "Marcus Aurelius, Meditations", ask: "Where are you overthinking instead of acting?" },
    { text: "We suffer more often in imagination than in reality.", by: "Seneca, Letters to Lucilius", ask: "What are you dreading that probably won't be as bad as you think?" },
    { text: "While we are postponing, life speeds by.", by: "Seneca, Letters to Lucilius", ask: "What have you been putting off? Can you do five minutes of it right now?" },
    { text: "No man is free who is not master of himself.", by: "Epictetus", ask: "What urge are you going to say no to today?" },
    { text: "The journey of a thousand miles begins beneath one's feet.", by: "Lao Tzu, Tao Te Ching", ask: "What is the smallest possible first step on your biggest goal?" },
    { text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach.", by: "Henry David Thoreau, Walden", ask: "What would a more deliberate version of today look like?" },
    { text: "Trust thyself: every heart vibrates to that iron string.", by: "Ralph Waldo Emerson, Self-Reliance", ask: "Where do you already know the answer but keep looking for permission?" },
    { text: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.", by: "Marcus Aurelius, Meditations", ask: "What is bothering you, and what story are you telling about it?" },
    { text: "It is not that we have a short time to live, but that we waste a lot of it.", by: "Seneca, On the Shortness of Life", ask: "Where did your time leak yesterday? Plug one hole today." },
    { text: "Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.", by: "Lao Tzu, Tao Te Ching", ask: "What did you notice about yourself this week?" },
    { text: "He who has a why to live can bear almost any how.", by: "Friedrich Nietzsche, Twilight of the Idols", ask: "What is your why for studying and job hunting right now?" },
    { text: "The unexamined life is not worth living.", by: "Socrates, in Plato's Apology", ask: "What belief about yourself deserves a second look?" },
    { text: "Do every act of your life as though it were the very last act of your life.", by: "Marcus Aurelius, Meditations", ask: "Pick one ordinary task today and do it with full attention." },
    { text: "Difficulties strengthen the mind, as labor does the body.", by: "Seneca", ask: "What hard thing is making you stronger right now?" },
    { text: "Wealth consists not in having great possessions, but in having few wants.", by: "Epictetus", ask: "What could you want less of?" },
    { text: "Nature does not hurry, yet everything is accomplished.", by: "Lao Tzu (attributed)", ask: "Where can you slow down and still get it done?" },
    { text: "Every man has two educations: that which is given to him, and the other, that which he gives to himself.", by: "Edward Gibbon (attributed)", ask: "What are you teaching yourself this month?" },
    { text: "Begin at once to live, and count each separate day as a separate life.", by: "Seneca, Letters to Lucilius", ask: "If today were its own whole life, what would make it a good one?" },
    { text: "Confine yourself to the present.", by: "Marcus Aurelius, Meditations", ask: "Name three things you can see, hear, and feel right now." },
    { text: "Man is not worried by real problems so much as by his imagined anxieties about real problems.", by: "Epictetus (attributed)", ask: "Separate the real problem from the worry about it." },
    { text: "Well begun is half done.", by: "Aristotle, Politics", ask: "How can you start tomorrow well tonight?" },
    { text: "He who conquers himself is the mightiest warrior.", by: "Confucius (attributed)", ask: "What's one small win over yourself you can get today?" },
    { text: "The best time to plant a tree was twenty years ago. The second best time is now.", by: "Proverb", ask: "What are you planting today?" },
    { text: "Out of difficulties grow miracles.", by: "Jean de La Bruyère", ask: "What good thing came out of a hard time in your past?" },
    { text: "Life is really simple, but we insist on making it complicated.", by: "Confucius (attributed)", ask: "What's one thing you can make simpler today?" },
    { text: "To be prepared for war is one of the most effective means of preserving peace.", by: "George Washington", ask: "Security+ thought: what does preparation prevent in your own life?" },
    { text: "Patience is bitter, but its fruit is sweet.", by: "Proverb, often credited to Aristotle", ask: "Where is patience paying off slowly for you?" },
    { text: "You must be the change you wish to see in the world.", by: "Paraphrase of Gandhi", ask: "What change in your day would you love to see? Be it for an hour." },

    { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", by: "Marcus Aurelius, Meditations", ask: "What do you already have that you keep forgetting to appreciate?" },
    { text: "The impediment to action advances action. What stands in the way becomes the way.", by: "Marcus Aurelius, Meditations", ask: "What obstacle could you turn into the actual work today?" },
    { text: "Luck is what happens when preparation meets opportunity.", by: "Seneca (attributed)", ask: "What are you preparing now for an opportunity you can't see yet?" },
    { text: "Don't explain your philosophy. Embody it.", by: "Epictetus (attributed)", ask: "What would someone learn about your values just by watching you today?" },
    { text: "He who fears death will never do anything worthy of a living man.", by: "Seneca", ask: "What would you try if you weren't afraid of looking stupid?" },
    { text: "Happiness depends upon ourselves.", by: "Aristotle, Nicomachean Ethics", ask: "What's one thing in your control that would make today better?" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", by: "Will Durant, summarizing Aristotle", ask: "Which habit is shaping you most right now, for better or worse?" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", by: "Plutarch (paraphrased)", ask: "What topic lights you up? Chase it for 20 minutes today." },
    { text: "Man cannot remake himself without suffering, for he is both the marble and the sculptor.", by: "Alexis Carrel", ask: "What part of you are you chiseling right now?" },
    { text: "Act as if what you do makes a difference. It does.", by: "William James", ask: "Who benefits when you keep your promises to yourself?" },
    { cat: "mma", text: "Champions keep playing until they get it right.", by: "Billie Jean King", ask: "What are you still getting wrong that you'll keep drilling?" },
    { cat: "mma", text: "Use only that which works, and take it from any place you can find it.", by: "Bruce Lee (attributed)", ask: "What could you borrow from another field to get better at yours?" },
    { cat: "mma", text: "Don't count the days. Make the days count.", by: "Muhammad Ali (attributed)", ask: "What will make today count?" },
    { cat: "mma", text: "The fight is won or lost far away from witnesses, behind the lines, in the gym, and out there on the road, long before I dance under those lights.", by: "Muhammad Ali (attributed)", ask: "What unseen work are you putting in today?" },
    { cat: "mma", text: "Jiu-jitsu teaches you to be comfortable in uncomfortable situations.", by: "Common BJJ saying", ask: "Where can you practice staying calm under pressure today?" },
    { cat: "tech", text: "In 1936 Alan Turing described a simple imaginary machine that reads and writes symbols on a tape. That 'Turing machine' still defines what it means for something to be computable.", by: "Tech history", ask: "Simple rules can build anything. What simple rule would improve your day?" },
    { cat: "tech", text: "Claude Shannon's 1948 paper founded information theory and introduced the word 'bit.' Every file, video, and message you've ever sent rests on his math.", by: "Tech history", ask: "What tiny 'bit' of progress can you make today?" },
    { cat: "tech", text: "Tim Berners-Lee proposed the World Wide Web in 1989 at CERN so physicists could share documents. His boss scribbled 'vague but exciting' on the proposal.", by: "Tech history", ask: "What 'vague but exciting' idea of yours deserves a first draft?" },
    { cat: "tech", text: "In 1971 Ray Tomlinson sent the first network email and chose the @ symbol to separate the user from the computer. He said he couldn't remember what the first message said.", by: "Tech history", ask: "Small choices become standards. What default will you set for yourself?" },
    { cat: "tech", text: "Public-key cryptography, published by Diffie and Hellman in 1976, let two strangers agree on a secret over an open line. It's why HTTPS works.", by: "Security history", ask: "Trust is built in steps. Who do you want to build trust with?" },
    { cat: "tech", text: "In 2013 attackers stole data on about 40 million Target cards after getting in through a heating and air conditioning vendor's network access.", by: "Security history", ask: "The weakest link was a vendor. Where's the weak link in your own routine?" },
    { cat: "tech", text: "The Equifax breach in 2017 exposed data on about 147 million people. The cause was a known web framework flaw that had a patch available months earlier.", by: "Security history", ask: "What 'patch' have you been putting off in your life?" },
    { cat: "tech", text: "Margaret Hamilton led the team that wrote the Apollo guidance software. During the 1969 Moon landing, it handled an overload of alarms by dropping low-priority tasks, and the landing went on.", by: "Tech history", ask: "When you're overloaded, what can you drop to protect what matters?" },
    { cat: "tech", text: "The first computer virus for PCs, Brain (1986), was written by two brothers in Pakistan. They put their names, address, and phone number in the code.", by: "Security history", ask: "Attribution matters in security. What would your 'signature' on today's work say?" },
    { cat: "tech", text: "Deep Blue beat world chess champion Garry Kasparov in 1997. Kasparov later championed 'centaur chess,' where humans and computers play together as a team.", by: "AI history", ask: "How could you team up with AI to learn faster, not think less?" },
    { cat: "faith", text: "Commit thy works unto the LORD, and thy thoughts shall be established.", by: "Proverbs 16:3", ask: "What work will you commit to fully today?" },
    { cat: "faith", text: "A soft answer turneth away wrath: but grievous words stir up anger.", by: "Proverbs 15:1", ask: "Where could a softer answer change how a conversation goes?" },
    { cat: "faith", text: "Be strong and of a good courage; be not afraid, neither be thou dismayed.", by: "Joshua 1:9", ask: "What would courage look like for you today?" },
    { cat: "faith", text: "The hand of the diligent shall bear rule: but the slothful shall be under tribute.", by: "Proverbs 12:24", ask: "Where can diligence put you in charge of your own day?" },
    { cat: "faith", text: "Let not your heart be troubled.", by: "John 14:1", ask: "What worry can you set down for the next hour?" },

    // MMA and combat legends
    { cat: "mma", text: "Empty your mind, be formless, shapeless, like water. Water can flow, or it can crash. Be water, my friend.", by: "Bruce Lee, 1971 interview", ask: "Where do you need to flow today instead of forcing it?" },
    { cat: "mma", text: "Everybody has a plan until they get punched in the mouth.", by: "Mike Tyson", ask: "When today's plan gets hit, what's your adjustment?" },
    { cat: "mma", text: "I hated every minute of training, but I said, don't quit. Suffer now and live the rest of your life as a champion.", by: "Muhammad Ali (attributed)", ask: "What's the uncomfortable rep you're going to do anyway?" },
    { cat: "mma", text: "The hero and the coward both feel the same thing. It's what you do with the fear that matters.", by: "Cus D'Amato (attributed)", ask: "What are you afraid of right now, and what would the hero do with it?" },
    { cat: "mma", text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", by: "Bruce Lee (attributed)", ask: "What one skill deserves 10,000 reps from you?" },
    { cat: "mma", text: "Float like a butterfly, sting like a bee. The hands can't hit what the eyes can't see.", by: "Muhammad Ali", ask: "Footwork first. Where can you be lighter on your feet today, in the gym or in life?" },
    { cat: "mma", text: "Position before submission.", by: "Brazilian jiu-jitsu saying", ask: "What foundation do you need to secure before going for the finish?" },
    { cat: "mma", text: "A black belt is a white belt who never quit.", by: "Martial arts saying", ask: "What are you a white belt in right now? Keep showing up." },
    { cat: "mma", text: "It's not about how hard you hit. It's about how hard you can get hit and keep moving forward.", by: "Rocky Balboa (film)", ask: "What hit you this week, and how are you moving forward?" },
    { cat: "mma", text: "Discipline is doing what you hate to do, but doing it like you love it.", by: "Mike Tyson (attributed)", ask: "Which task on your list today needs that attitude?" },

    // Tech history
    { cat: "tech", text: "In 1843 Ada Lovelace published notes on Charles Babbage's Analytical Engine, including a method for computing Bernoulli numbers. It's often called the first computer program, written for a machine that was never built.", by: "Tech history", ask: "What could you build today that the tools aren't quite ready for yet?" },
    { cat: "tech", text: "In 1947 operators of Harvard's Mark II computer found a moth stuck in a relay and taped it into the logbook as the 'first actual case of bug being found.'", by: "Tech history", ask: "What's a 'bug' in your routine you could literally pull out today?" },
    { cat: "tech", text: "In 1969 the first message sent over ARPANET, the ancestor of the internet, was supposed to be 'LOGIN.' The system crashed after two letters, so the first message ever sent was 'LO.'", by: "Tech history", ask: "Big things start broken. What imperfect first step can you take?" },
    { cat: "tech", text: "In 1988 the Morris worm spread across roughly 6,000 machines, about a tenth of the internet at the time. Its author became the first person convicted under the US Computer Fraud and Abuse Act.", by: "Security history", ask: "One mistake in code had huge reach. What small habit of yours has big reach?" },
    { cat: "tech", text: "In 1991 Linus Torvalds posted that he was making a free operating system, 'just a hobby, won't be big and professional.' Linux now runs most of the world's servers and every Android phone.", by: "Tech history", ask: "What hobby of yours could grow into something serious?" },
    { cat: "tech", text: "During World War II, codebreakers at Bletchley Park, including Alan Turing, broke the German Enigma cipher. Historians credit the work with shortening the war.", by: "Security history", ask: "Hard problems crack with persistence and teamwork. Who could you learn from this week?" },
    { cat: "tech", text: "Discovered in 2010, Stuxnet was a worm that physically damaged Iranian uranium centrifuges. It showed the world that code could break real machines.", by: "Security history", ask: "Security protects real things. Which part of security excites you most?" },
    { cat: "tech", text: "In 2017 the WannaCry ransomware hit hospitals and companies worldwide using a leaked exploit called EternalBlue. A 22-year-old researcher slowed it by registering a domain name hidden in its code: a kill switch.", by: "Security history", ask: "One curious person made a difference. What will you get curious about today?" },
    { cat: "tech", text: "Kevin Mitnick, once one of the FBI's most wanted hackers, said most of his break-ins relied on talking to people, not code. Social engineering is still one of the top ways attackers get in.", by: "Security history", ask: "Where are people the weak link, and how would you defend against it?" },
    { cat: "tech", text: "Grace Hopper built the first compiler in the early 1950s, so programmers could write in words instead of raw numbers. People told her computers could only do arithmetic.", by: "Tech history", ask: "What did someone say you couldn't do that you're going to do anyway?" },

    // Faith and wisdom (King James Version, public domain)
    { cat: "faith", text: "He that is slow to anger is better than the mighty; and he that ruleth his spirit than he that taketh a city.", by: "Proverbs 16:32", ask: "Your affirmation says you're slow to anger. Where will you practice that today?" },
    { cat: "faith", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", by: "Isaiah 40:31", ask: "Where do you need renewed strength right now?" },
    { cat: "faith", text: "Go to the ant, thou sluggard; consider her ways, and be wise.", by: "Proverbs 6:6", ask: "The ant works without a boss watching. What will you do today without being told?" },
    { cat: "faith", text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.", by: "Galatians 6:9", ask: "What are you planting now that will pay off later?" },
    { cat: "faith", text: "Whatsoever thy hand findeth to do, do it with thy might.", by: "Ecclesiastes 9:10", ask: "Pick one task today and give it everything." },
    { cat: "faith", text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.", by: "Proverbs 27:17", ask: "Who sharpens you? Reach out to them this week." },
    { cat: "faith", text: "Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath.", by: "James 1:19", ask: "In your next conversation, listen twice as much as you talk." },
    { cat: "faith", text: "Know ye not that they which run in a race run all, but one receiveth the prize? So run, that ye may obtain.", by: "1 Corinthians 9:24", ask: "What race are you running, and how will you run it today?" },
    { cat: "faith", text: "I can do all things through Christ which strengtheneth me.", by: "Philippians 4:13", ask: "What feels impossible right now? Take one step at it." },
    { cat: "faith", text: "To every thing there is a season, and a time to every purpose under the heaven.", by: "Ecclesiastes 3:1", ask: "What season are you in right now, and what is it asking of you?" }
  ],

  // Groups puzzle categories. Each daily puzzle picks 4.
  groups: [
    ["Chess pieces", ["KING","QUEEN","BISHOP","KNIGHT","ROOK","PAWN"]],
    ["Coffee drinks", ["LATTE","MOCHA","ESPRESSO","CORTADO","AMERICANO","MACCHIATO"]],
    ["Boxing terms", ["JAB","HOOK","UPPERCUT","CROSS","CLINCH","ROUND","BELL"]],
    ["Social engineering attacks", ["PHISHING","VISHING","SMISHING","WHALING","TAILGATING","PRETEXTING"]],
    ["Programming languages", ["PYTHON","RUBY","JAVA","RUST","SWIFT","PERL","KOTLIN"]],
    ["Snakes", ["COBRA","VIPER","PYTHON","MAMBA","ADDER","BOA"]],
    ["Music genres", ["JAZZ","BLUES","ROCK","PUNK","FUNK","SOUL","DISCO"]],
    ["Keyboard keys", ["SHIFT","ENTER","ESCAPE","TAB","SPACE","DELETE","CONTROL"]],
    ["___ball", ["FOOT","BASE","BASKET","HAND","SNOW","EYE","MEAT"]],
    ["Spanish numbers", ["UNO","DOS","TRES","CUATRO","CINCO","SEIS"]],
    ["Spanish colors", ["ROJO","AZUL","VERDE","AMARILLO","NEGRO","BLANCO"]],
    ["Philosophers", ["PLATO","KANT","HUME","LOCKE","NIETZSCHE","SOCRATES","DESCARTES"]],
    ["Greek letters", ["ALPHA","BETA","GAMMA","DELTA","SIGMA","OMEGA","THETA"]],
    ["In nate's smoothie", ["BANANA","OATS","BERRIES","MILK","CREATINE","PEANUT BUTTER"]],
    ["Shades of blue", ["NAVY","TEAL","COBALT","AZURE","ROYAL","CYAN"]],
    ["Network devices", ["ROUTER","SWITCH","FIREWALL","MODEM","HUB","BRIDGE"]],
    ["Encryption algorithms", ["AES","RSA","DES","BLOWFISH","TWOFISH","ECC"]],
    ["Weather", ["RAIN","SNOW","HAIL","SLEET","FOG","MIST"]],
    ["Instruments", ["PIANO","GUITAR","VIOLIN","DRUMS","FLUTE","CELLO","TRUMPET"]],
    ["Fish", ["SALMON","TUNA","TROUT","COD","BASS","PIKE"]],
    ["___fly", ["BUTTER","FIRE","DRAGON","HORSE","FRUIT","HOUSE"]],
    ["Dances", ["SALSA","TANGO","WALTZ","SWING","FOXTROT","RUMBA"]],
    ["Gym exercises", ["SQUAT","DEADLIFT","LUNGE","PLANK","BURPEE","PUSHUP"]],
    ["Mythical creatures", ["DRAGON","UNICORN","PHOENIX","GRIFFIN","KRAKEN","HYDRA"]],
    ["___board", ["KEY","CARD","SKATE","SURF","CHALK","DASH"]],
    ["Malware", ["VIRUS","WORM","TROJAN","RANSOMWARE","SPYWARE","ROOTKIT"]],
    ["Freud's mind and friends", ["ID","EGO","SUPEREGO","LIBIDO","REPRESSION"]],
    ["Composers", ["BACH","MOZART","BEETHOVEN","CHOPIN","HANDEL","VIVALDI"]],
    ["Ancient civilizations", ["AZTEC","MAYA","INCA","ROMAN","SUMER","PERSIA"]],
    ["Chemical elements", ["GOLD","IRON","NEON","CARBON","OXYGEN","HELIUM"]],
    ["Planets", ["MERCURY","VENUS","MARS","JUPITER","SATURN","NEPTUNE"]],
    ["Card games", ["POKER","RUMMY","BRIDGE","SOLITAIRE","HEARTS","SPADES"]],
    ["Bodies of water", ["LAKE","POND","RIVER","OCEAN","BAY","LAGOON"]],
    ["Things with shells", ["TURTLE","SNAIL","CLAM","OYSTER","EGG","PEANUT"]],
    ["Ports and protocols", ["HTTP","SSH","DNS","FTP","SMTP","TELNET"]],
    ["Breathing and calm", ["INHALE","EXHALE","PAUSE","RELAX","CENTER","FOCUS"]],
    ["Card suits", ["HEARTS","SPADES","CLUBS","DIAMONDS"]],
    ["Words before 'light'", ["SUN","MOON","FLASH","SPOT","HEAD","STAR"]],
    ["Psychologists", ["FREUD","JUNG","SKINNER","PAVLOV","PIAGET","MASLOW"]],
    ["OSI layers", ["PHYSICAL","DATA LINK","NETWORK","TRANSPORT","SESSION","PRESENTATION","APPLICATION"]],
    ["BJJ sweeps", ["SCISSOR","HIP BUMP","FLOWER","BERIMBOLO","BUTTERFLY","PENDULUM"]],
    ["BJJ positions", ["MOUNT","GUARD","SIDE CONTROL","TURTLE","BACK","HALF GUARD","KNEE ON BELLY"]],
    ["Submissions", ["ARMBAR","TRIANGLE","KIMURA","GUILLOTINE","AMERICANA","RNC","HEEL HOOK"]],
    ["Linux commands", ["GREP","CHMOD","SUDO","CAT","LS","SSH","PING","CURL"]],
    ["Windows admin tools", ["REGEDIT","POWERSHELL","GPEDIT","TASKMGR","EVENTVWR","MMC"]],
    ["Active Directory terms", ["DOMAIN","FOREST","TREE","OU","GPO","KERBEROS","LDAP"]],
    ["Things in nate's homelab", ["PROXMOX","PFSENSE","KALI","DVWA","WEBGOAT","TAILSCALE","SECURITY ONION"]],
    ["Firewall actions", ["ALLOW","DENY","DROP","REJECT","LOG","NAT"]],
    ["CIA triad and friends", ["CONFIDENTIALITY","INTEGRITY","AVAILABILITY","NON-REPUDIATION","AUTHENTICATION"]],
    ["Cloud models", ["IAAS","PAAS","SAAS","PUBLIC","PRIVATE","HYBRID"]],
    ["Hackers' hats", ["WHITE","BLACK","GRAY","RED","BLUE","PURPLE"]],
    ["Louisiana foods", ["GUMBO","JAMBALAYA","BOUDIN","BEIGNET","ETOUFFEE","PO'BOY","CRAWFISH"]],
    ["Louisiana cities", ["LAFAYETTE","SHREVEPORT","MONROE","BATON ROUGE","HOUMA","LAKE CHARLES"]],
    ["Line dances", ["ELECTRIC SLIDE","CUPID SHUFFLE","WOBBLE","CHA CHA SLIDE","BOOT SCOOTIN","COTTON EYE JOE"]],
    ["Hip hop moves", ["DOUGIE","MILLY ROCK","SHMONEY","WOAH","RUNNING MAN","BANKHEAD BOUNCE"]],
    ["Muay Thai weapons", ["FISTS","ELBOWS","KNEES","SHINS","CLINCH"]],
    ["Boxing stances", ["ORTHODOX","SOUTHPAW","PEEKABOO","PHILLY SHELL","SQUARE"]],
    ["Continents", ["AFRICA","ASIA","EUROPE","OCEANIA","ANTARCTICA","AMERICAS"]],
    ["Oceans", ["PACIFIC","ATLANTIC","INDIAN","ARCTIC","SOUTHERN"]],
    ["Branches of US government", ["LEGISLATIVE","EXECUTIVE","JUDICIAL","CONGRESS","SENATE","HOUSE"]],
    ["Data types", ["STRING","INTEGER","FLOAT","BOOLEAN","ARRAY","CHAR"]],
    ["SQL keywords", ["SELECT","WHERE","JOIN","INSERT","UPDATE","DELETE","FROM"]],
    ["AI terms", ["MODEL","TOKEN","PROMPT","AGENT","DATASET","NEURAL","TRAINING"]],
    ["Video game genres", ["RPG","SHOOTER","PLATFORMER","ROGUELIKE","MOBA","SANDBOX"]],
    ["Consoles", ["PLAYSTATION","XBOX","SWITCH","GAMECUBE","WII","DREAMCAST"]],
    ["Linux distros", ["UBUNTU","DEBIAN","FEDORA","ARCH","MINT","KALI"]],
    ["Hash functions", ["MD5","SHA-1","SHA-256","BCRYPT","NTLM"]],
    ["Log sources", ["SYSLOG","SYSMON","FIREWALL","DNS","PROXY","EDR"]],
    ["Wireless standards", ["WPA2","WPA3","WEP","WIFI 6","BLUETOOTH","NFC"]],
    ["Things that are 'cracked'", ["PASSWORD","EGG","KNUCKLES","CODE","SAFE","JOKE"]],
    ["Words before 'man'", ["SNOW","FIRE","SUPER","MIDDLE","SPIDER","BAT"]],
    ["Breakfast", ["PANCAKE","WAFFLE","OMELET","BACON","GRITS","BISCUIT"]],
    ["Coffee words", ["BREW","ROAST","BEAN","GRIND","DRIP","SHOT"]],
    ["Stoic philosophers", ["SENECA","EPICTETUS","MARCUS","ZENO","CHRYSIPPUS"]],
    ["Planets' moons", ["TITAN","EUROPA","IO","GANYMEDE","CALLISTO","PHOBOS"]],
    ["Body parts in boxing targets", ["CHIN","TEMPLE","LIVER","SOLAR PLEXUS","BODY","JAW"]],
    ["Spanish greetings", ["HOLA","BUENOS DIAS","BUENAS NOCHES","ADIOS","HASTA LUEGO","QUE TAL"]],
    ["Spanish days", ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"]],
    ["Wrestling takedowns", ["DOUBLE LEG","SINGLE LEG","ANKLE PICK","HIGH CROTCH","DUCK UNDER","SWEEP"]],
    ["Things with a 'port'", ["USB","HDMI","SERIAL","HARBOR","AIRPORT","ETHERNET"]],
    ["Security tools", ["NMAP","WIRESHARK","BURP","METASPLOIT","HYDRA","JOHN"]],
    ["Science branches", ["PHYSICS","BIOLOGY","CHEMISTRY","GEOLOGY","ECOLOGY","GENETICS"]]
  ],

  // Word guess answers (5 letters)
  words: ("crane slate pride brave climb drift eagle flame grape heart honey ivory jolly karma lemon mango noble ocean piano quiet raven sauce tiger ultra vivid whale yield zebra adore beach cabin dance faith giant habit image juice knife laugh magic north olive peace quest river smile train unity voice water youth amber blaze candy dream entry flock glove house index jewel koala light metal nurse orbit plant radar shine trust urban vapor wheat xenon yacht zesty actor bloom cloud daisy earth focus grace hello input joker kneel lunar march nerve opera pixel queen robot storm think upper value world alarm boxer chain diary elbow fresh grind hover ideal judge lucky mercy ninja owner punch quick rally solid toast usage vital worth basic cyber patch proxy virus token query stack array logic float shell debug cache crypt admin brick chase cider dodge ember forge ghost hatch irony jumbo kayak lodge moose nacho oasis pearl quilt rider siren tulip unzip valor wrist yeast sweat squat lunge bench grain berry steak chess pause relax brain learn study class teach grade write sleep heavy swift sharp sword field about above abuse acute admit adopt adult after again agent agree ahead alert alien align alike alive allow alone along alter among angel anger angle angry ankle apart apple apply arena argue arise armor aroma arrow aside asset atlas audio audit avoid awake award aware awful bacon badge bagel baker basin batch beard beast began begin being belly below bible bicep birth black blade blame bland blank blast bleed blend bless blind blink block blond blood board boast bonus boost booth bound brand brass bread break breed bride brief bring brisk broad broke brook brown brush buddy build built bunch burst cable camel canal cargo carry catch cause chair chalk champ charm chart cheap check cheek cheer chest chick chief child chill chord civic civil claim clash clean clear clerk click cliff clock close coach coast coral couch count court cover crack craft crash crazy cream creek crime crisp cross crowd crown crude crush curve cycle daily delta dense depth digit diner dirty ditch dizzy dough draft drain drama drank dress dried drill drink drive drone dwarf eager early eaten eight elite email empty enemy enjoy enter equal error essay event every exact exile exist extra fable faint fairy false fancy fault feast fence fever fiber fifth fifty fight final first flash fleet flesh floor flour fluid flute foggy force forty forum found frame frank fraud front frost fruit fully funny gamer genre given glass gleam globe gloom glory goose grand grant graph grass grave great greed green greet grill gross group guard guess guest guide happy hardy harsh haste haunt hedge hefty heist hobby holly honor horse hotel hound human humid humor hurry icing igloo inner issue jeans jelly joint juicy jumpy kebab knack knead knock known label labor lance large laser latch later layer leafy lease least leave legal lever limit linen liver llama local loose lover lower loyal lucid lyric macro major maker maple match maybe mayor medal media melon merit messy meter micro might minor minus mixer model moist money month moral motor mount mouse mouth movie muddy music naive nasty never newly niece night noise novel nudge occur offer often onion order other otter ought outer oxide paint panel panic paper party pasta paste patio pedal penny perch phase phone photo piece pilot pinch pitch pizza place plain plane plate plaza point polar porch pound power press price prime print prior prize probe proof proud prove pulse puppy purse quake queue quota quote radio raise ranch range rapid ratio reach react ready realm rebel refer relay remix repay reply ridge rifle right rigid rinse risky rival roast robin rocky rough round route royal rugby rumor rural rusty salad salon salty sandy scale scare scarf scene scent scoop scope score scout scrap screw seize sense serve seven shade shake shall shape share shark sheep sheet shelf shift shirt shock shore short shout shrub sight sigma silly since sixth skate skill skull slash sleek slice slide slope smart smell smoke snack snake sneak solar solve sorry sound south space spare spark speak speed spell spend spice spike spine spoon sport spray squad stage stair stake stamp stand stare start state steam steel steep stick still stock stone stood stool store story stove strap straw strip stuck stuff style sugar suite sunny super surge swamp swear sweet swing table taken taste teeth tempo tenth thick thief thing third thorn three threw throw thumb tidal tight timer tired title today topic torch total touch tough tower toxic trace track trade trail trait treat trend trial tribe trick tried troop truck truly trunk tutor twice twist uncle under union until upset usual vague valid valve vault venue verse video vigor villa vinyl viral visit vocal voter wagon waist watch weird whole whose widen width wired witty woman worry worse wound woven wreck wrong yearn young blitz brawl sweep feint")
    .split(" ").filter((w, i, a) => w.length === 5 && a.indexOf(w) === i),

  splits: {
    "Push / Pull / Legs": ["Rest / mobility", "Push", "Pull", "Legs", "Push", "Pull", "Legs"],
    "Upper / Lower": ["Rest / mobility", "Upper", "Lower", "Cardio + core", "Upper", "Lower", "Boxing conditioning"],
    "Full body 3x": ["Rest / mobility", "Full body", "Boxing conditioning", "Full body", "Cardio + core", "Full body", "Rest / mobility"],
    "Fighter split": ["Rest / mobility", "Push", "Boxing conditioning", "Pull", "Boxing conditioning", "Legs", "Cardio + core"]
  },
  workoutTemplates: {
    "Push": ["Bench press 4x8", "Overhead press 3x10", "Incline dumbbell press 3x10", "Triceps dips 3x12", "Lateral raises 3x15"],
    "Pull": ["Deadlift 3x5", "Pull-ups 4x8", "Barbell rows 3x10", "Face pulls 3x15", "Bicep curls 3x12"],
    "Legs": ["Squats 4x8", "Romanian deadlifts 3x10", "Lunges 3x12 each leg", "Leg press 3x12", "Calf raises 4x15"],
    "Full body": ["Goblet squats 3x12", "Push-ups 3x15", "Dumbbell rows 3x12", "Plank 3x45s", "Kettlebell swings 3x15"],
    "Cardio + core": ["Run 2 miles", "Jump rope 10 min", "Hanging leg raises 3x12", "Russian twists 3x20", "Bicycle crunches 3x20"],
    "Upper": ["Bench press 4x6", "Pull-ups 4x8", "Overhead press 3x8", "Barbell rows 3x8", "Bicep curls 2x12", "Triceps pushdowns 2x12"],
    "Lower": ["Squats 4x6", "Romanian deadlifts 3x8", "Walking lunges 3x10", "Leg curls 3x12", "Calf raises 4x15", "Plank 3x45s"],
    "Boxing conditioning": ["Jump rope 3x3 min", "Shadowboxing 3x3 min", "Heavy bag 5x3 min", "Push-ups 3x20", "Sit-ups 3x20"],
    "Rest / mobility": ["Walk 30 min", "Foam roll 10 min", "Yoga or QiGong 20 min"]
  }
};
