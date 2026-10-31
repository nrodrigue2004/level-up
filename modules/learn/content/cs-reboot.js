/* CS reboot at full depth. Adds units to the Computer Science subject:
   data representation, Python from zero (with reading-code practice), algorithms, data structures, and how programs run.
   Backbones: Harvard CS50x (free, CC BY-NC-SA) and MIT OCW 6.0001 (Intro to CS and Programming in Python),
   used as the syllabus outline only. Lessons are original. Every "trace the code" card is generated fresh. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'cs'; })[0]; if (!S) return;
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }
  function calc(q, a, why) { return { t: 'calc', q: q, a: a, tol: 0.001, why: why }; }
  function code(lines) { return '<pre>' + lines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>'; }

  // ---------- generators: reading code ----------
  G.pyTrace = function () {
    var a = r(2, 9), b = r(2, 9), op1 = pk(['+', '-', '*']), op2 = pk(['+', '*']), k = r(2, 4);
    var x = a, y = b;
    x = op1 === '+' ? x + y : op1 === '-' ? x - y : x * y;
    y = op2 === '+' ? x + k : x * k;
    return calc('What does this print?' + code(['x = ' + a, 'y = ' + b, 'x = x ' + op1 + ' y', 'y = x ' + op2 + ' ' + k, 'print(y)']), y,
      'Go line by line. x starts at ' + a + ', y at ' + b + '. Line 3: x = ' + a + ' ' + op1 + ' ' + b + ' = ' + x + '. Line 4 uses the NEW x: y = ' + x + ' ' + op2 + ' ' + k + ' = ' + y + '. The key habit: a variable holds its latest value, and the right side is worked out before the assignment.');
  };
  G.pyIf = function () {
    var n = r(0, 20), t = r(5, 15), out = n > t ? 'big' : n === t ? 'same' : 'small';
    return mc('What does this print?' + code(['n = ' + n, 'if n > ' + t + ':', '    print("big")', 'elif n == ' + t + ':', '    print("same")', 'else:', '    print("small")']), out, ['big', 'same', 'small', 'big then small', 'nothing'],
      n + ' > ' + t + ' is ' + (n > t ? 'True' : 'False') + (n > t ? '' : '; ' + n + ' == ' + t + ' is ' + (n === t ? 'True' : 'False')) + '. Python checks the conditions top to bottom and runs only the FIRST block whose condition is true.');
  };
  G.pyLoop = function () {
    var k = r(0, 2), a, b, s, tot = 0, i;
    if (k === 0) { b = r(3, 8); for (i = 0; i < b; i++) tot += i; return calc('What does this print?' + code(['total = 0', 'for i in range(' + b + '):', '    total = total + i', 'print(total)']), tot, 'range(' + b + ') gives 0, 1, ..., ' + (b - 1) + ' (it stops BEFORE ' + b + '). Their sum is ' + tot + '. Off-by-one mistakes with range are the most common loop bug.'); }
    if (k === 1) { a = r(1, 4); b = r(a + 3, a + 7); for (i = a; i < b; i++) tot += i; return calc('What does this print?' + code(['total = 0', 'for i in range(' + a + ', ' + b + '):', '    total += i', 'print(total)']), tot, 'range(' + a + ', ' + b + ') starts at ' + a + ' and stops before ' + b + ': ' + (function () { var l = []; for (var j = a; j < b; j++) l.push(j); return l.join(' + '); })() + ' = ' + tot + '. (total += i is shorthand for total = total + i.)'); }
    s = r(2, 3); b = r(8, 15); var cnt = 0; for (i = 0; i < b; i += s) cnt++;
    return calc('How many times does this print "hi"?' + code(['for i in range(0, ' + b + ', ' + s + '):', '    print("hi")']), cnt, 'range(0, ' + b + ', ' + s + ') counts by ' + s + ': ' + (function () { var l = []; for (var j = 0; j < b; j += s) l.push(j); return l.join(', '); })() + '. That\'s ' + cnt + ' values, so ' + cnt + ' prints.');
  };
  G.pyWhile = function () {
    var n = pk([8, 10, 16, 20, 27, 32, 40, 64, 100]), x = n, c = 0; while (x > 1) { x = Math.floor(x / 2); c++; }
    return calc('What does this print?' + code(['n = ' + n, 'count = 0', 'while n > 1:', '    n = n // 2', '    count += 1', 'print(count)']), c, '// is integer division (drops the remainder). Halving ' + n + ' until it reaches 1 takes ' + c + ' steps. That "keep halving" pattern is exactly why binary search is O(log n).');
  };
  G.pyList = function () {
    var L = shuffle([3, 7, 12, 5, 9, 1, 15, 4]).slice(0, r(4, 6)), n = L.length, k = r(0, 3), idx, right, w;
    var src = 'nums = [' + L.join(', ') + ']';
    if (k === 0) { idx = r(0, n - 1); right = L[idx]; w = [L[(idx + 1) % n], L[(idx + n - 1) % n], 'IndexError']; return mc('What does this print?' + code([src, 'print(nums[' + idx + '])']), right, w, 'Python counts from 0. nums[0] is ' + L[0] + ', so nums[' + idx + '] is ' + right + '.'); }
    if (k === 1) return mc('What does this print?' + code([src, 'print(nums[-1])']), L[n - 1], [L[0], L[n - 2], 'IndexError'], 'Negative indexes count from the end: nums[-1] is the last item, ' + L[n - 1] + '.');
    if (k === 2) return mc('What does this print?' + code([src, 'print(len(nums))']), n, [n - 1, n + 1, L[n - 1]], 'len() counts the items: ' + n + '. The last valid index is len − 1 = ' + (n - 1) + '.');
    var a = r(0, 1), b = a + 2; right = '[' + L.slice(a, b).join(', ') + ']';
    return mc('What does this print?' + code([src, 'print(nums[' + a + ':' + b + '])']), right, ['[' + L.slice(a, b + 1).join(', ') + ']', '[' + L.slice(a + 1, b + 1).join(', ') + ']', String(L[a])], 'A slice [start:stop] includes start and stops BEFORE stop: indexes ' + a + ' and ' + (b - 1) + ' → ' + right + '.');
  };
  G.pyStr = function () {
    var w = pk(['python', 'linux', 'cajun', 'subnet', 'kernel', 'guard']), k = r(0, 3);
    if (k === 0) return mc('What does this print?' + code(['s = "' + w + '"', 'print(s[0] + s[-1])']), w[0] + w[w.length - 1], [w.slice(0, 2), w[1] + w[w.length - 2], w[w.length - 1] + w[0]], 'Strings index like lists: s[0] is the first letter, s[-1] the last.');
    if (k === 1) return mc('What does this print?' + code(['s = "' + w + '"', 'print(s.upper())']), w.toUpperCase(), [w, w[0].toUpperCase() + w.slice(1), 'None'], '.upper() returns a NEW string in capitals. (Strings can\'t be changed in place; methods give you new ones.)');
    if (k === 2) return calc('What does this print?' + code(['s = "' + w + '"', 'print(len(s) * 2)']), w.length * 2, 'len("' + w + '") is ' + w.length + ', times 2 = ' + (w.length * 2) + '.');
    return mc('What does this print?' + code(['s = "' + w + '"', 'print(s[::-1])']), w.split('').reverse().join(''), [w, w.slice(1), w.split('').reverse().join('').toUpperCase()], '[::-1] is a slice with step −1, which walks backward: the reversed string.');
  };
  G.pyFunc = function () {
    var m = r(2, 5), c = r(1, 9), v = r(1, 6), w2 = r(1, 4);
    var f = function (x) { return x * m + c; };
    if (Math.random() < .5) return calc('What does this print?' + code(['def f(x):', '    return x * ' + m + ' + ' + c, '', 'print(f(' + v + '))']), f(v), 'Calling f(' + v + ') sets x = ' + v + ' inside the function: ' + v + ' × ' + m + ' + ' + c + ' = ' + f(v) + '. return hands that value back to the caller, and print shows it.');
    return calc('What does this print?' + code(['def f(x):', '    return x * ' + m + ' + ' + c, '', 'y = f(' + v + ')', 'print(f(y - ' + w2 + '))']), f(f(v) - w2), 'Inner call first: f(' + v + ') = ' + f(v) + ', so y = ' + f(v) + '. Then f(' + f(v) + ' − ' + w2 + ') = f(' + (f(v) - w2) + ') = ' + f(f(v) - w2) + '.');
  };
  var BUGS = [
    [['nums = [1, 2, 3]', 'print(nums[3])'], 'IndexError', 'There are 3 items at indexes 0, 1, 2. Index 3 doesn\'t exist.'],
    [['age = "25"', 'print(age + 5)'], 'TypeError', 'You can\'t add a string and an int. Convert first: int(age) + 5.'],
    [['print(totl)'], 'NameError', 'totl was never defined (probably a typo for total).'],
    [['x = 10 / 0'], 'ZeroDivisionError', 'Division by zero is undefined.'],
    [['ages = {"nate": 25}', 'print(ages["sam"])'], 'KeyError', 'The dictionary has no key "sam". Use ages.get("sam") to get None instead of crashing.'],
    [['if x > 5', '    print(x)'], 'SyntaxError', 'The if line is missing its colon. Python can\'t even start running it.'],
    [['n = int("five")'], 'ValueError', 'int() needs digits. "five" is a string it can\'t convert.'],
    [['def hi():', 'print("hi")'], 'IndentationError', 'The function body must be indented under the def line.']
  ];
  G.pyBug = function () {
    var b = pk(BUGS);
    return mc('This crashes. Which error does Python raise?' + code(b[0]), b[1], ['IndexError', 'TypeError', 'NameError', 'ZeroDivisionError', 'KeyError', 'SyntaxError', 'ValueError', 'IndentationError'], b[2] + ' Reading the error name and line number is step one of debugging.');
  };
  G.pyDict = function () {
    var names = shuffle(['nate', 'ava', 'luc', 'mia', 'remy']).slice(0, 3), vals = names.map(function () { return r(1, 20); }), who = r(0, 2), add = r(1, 9);
    return calc('What does this print?' + code(['scores = {"' + names[0] + '": ' + vals[0] + ', "' + names[1] + '": ' + vals[1] + ', "' + names[2] + '": ' + vals[2] + '}', 'scores["' + names[who] + '"] += ' + add, 'print(scores["' + names[who] + '"])']), vals[who] + add, 'A dictionary maps keys to values. scores["' + names[who] + '"] was ' + vals[who] + '; += ' + add + ' makes it ' + (vals[who] + add) + '.');
  };

  // ---------- generators: data, algorithms, structures ----------
  G.csHex = function () {
    var n = r(10, 255), k = r(0, 2), hx = n.toString(16).toUpperCase(), bn = n.toString(2);
    if (k === 0) return mc('What is <b>' + n + '</b> in hexadecimal?', '0x' + hx, ['0x' + (n + 1).toString(16).toUpperCase(), '0x' + (n + 16).toString(16).toUpperCase(), '0x' + n], 'Divide by 16: ' + n + ' = ' + Math.floor(n / 16) + ' × 16 + ' + (n % 16) + '. Digits ' + Math.floor(n / 16) + ' and ' + (n % 16) + ' → ' + hx + ' (A=10 … F=15). Each hex digit = exactly 4 bits, which is why it\'s used for colors, MAC addresses and memory.');
    if (k === 1) return calc('What is hex <b>0x' + hx + '</b> in decimal?', n, '0x' + hx + ' = ' + parseInt(hx[0], 16) + (hx.length > 1 ? ' × 16 + ' + parseInt(hx[1], 16) : '') + ' = ' + n + '.');
    return calc('What is binary <b>' + bn + '</b> in decimal?', n, 'Add the place values where there\'s a 1 (…128, 64, 32, 16, 8, 4, 2, 1): ' + n + '.');
  };
  G.csAscii = function () {
    var c = String.fromCharCode(pk([r(65, 90), r(97, 122)]));
    return calc('In ASCII, the letter "A" is 65 and "a" is 97. What number is <b>"' + c + '"</b>?', c.charCodeAt(0), 'Letters are numbered in order. "' + c + '" is ' + (c >= 'a' ? (c.charCodeAt(0) - 97) + ' after "a"' : (c.charCodeAt(0) - 65) + ' after "A"') + ', so ' + c.charCodeAt(0) + '. Lowercase is always uppercase + 32. In Python: ord("' + c + '").');
  };
  var BIGO = [
    ['Look up an item in a list by its index: nums[5]', 'O(1)'], ['Look up a key in a dictionary / hash table', 'O(1)'],
    ['Binary search in a sorted list', 'O(log n)'], ['Check every item in a list once to find the max', 'O(n)'],
    ['Linear search through an unsorted list', 'O(n)'], ['Merge sort', 'O(n log n)'],
    ['Compare every item with every other item (nested loops over the same list)', 'O(n²)'], ['Bubble sort, worst case', 'O(n²)'],
    ['Try every possible password of length n over a 2-symbol alphabet', 'O(2ⁿ)']
  ];
  G.csBigO = function () {
    var x = pk(BIGO);
    return mc('What is the running time (Big-O) of:<br><br><b>' + x[0] + '</b>', x[1], ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], 'Big-O describes how the work grows as the input grows. O(1) constant, O(log n) halving each step, O(n) one pass, O(n log n) good sorting, O(n²) nested loops, O(2ⁿ) explodes.');
  };
  G.csBinSearch = function () {
    var n = pk([16, 32, 100, 1000, 1024, 1000000, 4000000000]), steps = Math.floor(Math.log2(n)) + 1;
    return calc('Binary search on a sorted list of <b>' + n.toLocaleString() + '</b> items. At most how many checks does it need?', steps, 'Each check halves what\'s left. log₂(' + n.toLocaleString() + ') ≈ ' + Math.log2(n).toFixed(1) + ', so at most ' + steps + ' checks. Linear search could need ' + n.toLocaleString() + '.');
  };
  G.csStack = function () {
    var vals = shuffle([3, 5, 8, 2, 9, 4]).slice(0, 4), isQ = Math.random() < .5, lines = [], arr = [], out;
    vals.forEach(function (v) { lines.push((isQ ? 'enqueue(' : 'push(') + v + ')'); arr.push(v); });
    var pops = r(1, 2); for (var i = 0; i < pops; i++) { lines.push(isQ ? 'dequeue()' : 'pop()'); out = isQ ? arr.shift() : arr.pop(); }
    return mc('Starting empty, a <b>' + (isQ ? 'queue' : 'stack') + '</b> runs these operations. What did the LAST ' + (isQ ? 'dequeue' : 'pop') + ' return?' + code(lines), out, vals, isQ ? 'A queue is first in, first out (FIFO), like a line at a store. Items leave in the order they arrived.' : 'A stack is last in, first out (LIFO), like a stack of plates. The most recent push comes off first. Your browser\'s Back button and function calls both use stacks.');
  };

  // ---------- units ----------
  var units = [
    {
      name: 'Data: how everything becomes numbers', tag: 'CS50 wk 0',
      blurb: 'Text, colors, images and sound are all just numbers in binary. Hex is the shorthand.',
      lessons: [
        {
          id: 'cs-data', title: 'Hex, ASCII, Unicode & color', min: 9, teaser: 'How "A", 🔥 and the color orange are stored.',
          pre: ['cs-what-is-bit'], links: ['cs-bits-lab', 'sp-hashing'],
          cards: [
            { t: 'read', h: 'Hexadecimal', body: '<p>Binary gets long fast: 255 is 11111111. <b>Hexadecimal</b> (base 16) is the shorthand. Digits go 0–9 then A–F (A = 10 … F = 15). Each hex digit is exactly 4 bits, so one byte is exactly two hex digits: 11111111 = FF.</p><p>You see hex everywhere in tech: MAC addresses (3C:22:FB:…), colors (#FF8800), memory addresses, hashes (SHA-256 output is 64 hex characters).</p>', mem: '1 hex digit = 4 bits. 2 hex digits = 1 byte.' },
            { t: 'read', h: 'Text: ASCII and Unicode', body: '<p>Computers store letters as numbers by agreement. <b>ASCII</b> (1960s) uses 7 bits for 128 characters: "A" = 65, "a" = 97, "0" = 48, space = 32.</p><p>128 isn\'t enough for every language and emoji, so <b>Unicode</b> assigns a number (a code point) to over 150,000 characters. <b>UTF-8</b> stores them using 1 to 4 bytes, and the first 128 match ASCII exactly. 🔥 is U+1F525 and takes 4 bytes.</p>' },
            { t: 'read', h: 'Color, images, sound', body: '<p>A screen color is three numbers for <b>R</b>ed, <b>G</b>reen and <b>B</b>lue light, each 0–255 (one byte each). #FF8800 = R 255, G 136, B 0 = orange. An image is a grid of these pixels: a 12-megapixel photo is 12 million of them (compression shrinks the file).</p><p>Sound is sampled: measure the wave\'s height tens of thousands of times a second and store each measurement as a number.</p><p>Same bits, different meaning: 01000001 is 65, or "A", or a shade of blue, depending on how the program interprets it.</p>',
              deeper: '<p>File formats are agreements about interpretation. That\'s why changing a .txt to .exe doesn\'t make it a program, and why "magic bytes" at the start of a file (like FF D8 for JPEG, 4D 5A "MZ" for Windows executables) are used by forensic tools to identify files whatever their extension says.</p>' },
            { t: 'gen', g: 'csHex' }, { t: 'gen', g: 'csHex' }, { t: 'gen', g: 'csAscii' },
            { t: 'explain', q: 'Explain how the same 8 bits can be a number, a letter or a color.', points: ['Bits have no meaning on their own', 'The program decides how to interpret them', 'ASCII/Unicode map numbers to characters', 'RGB uses three bytes as red/green/blue intensities'] }
          ]
        }
      ]
    },
    {
      name: 'Python from zero', tag: 'CS50 wk 1–6 · MIT 6.0001',
      blurb: 'Real programming, starting from nothing. Every lesson has "read the code" practice generated fresh, so you build the skill vibe coding skipped: knowing what code actually does.',
      lessons: [
        {
          id: 'py-vars', title: 'Variables, types & expressions', min: 9, teaser: 'Boxes with names, and what\'s inside them.',
          pre: ['cs-code-basics'], links: ['py-if', 'm-eval', 't-readcode'],
          cards: [
            { t: 'read', h: 'Why Python', body: '<p>Python is the most used language for scripting, security tools, automation, data and AI. It reads close to English, and there\'s no compile step: you write it, you run it. Every security job posting that says "scripting" means this.</p><p>To practice for free: python.org/downloads on your PC, the <code>python3</code> already on your Kali VM, or a browser site like replit.com or Google Colab.</p>' },
            { t: 'read', h: 'Variables and assignment', body: '<p>A <b>variable</b> is a name pointing at a value. <code>=</code> means "assign," not "equals":</p>' + code(['score = 10', 'score = score + 5   # right side first: 10 + 5, then store 15', 'print(score)        # 15']) + '<p>The right side is always worked out first, then stored in the name on the left. Lines run top to bottom, one at a time. That\'s the whole mental model for reading code.</p>', mem: '= means "store." Right side first, then assign.' },
            { t: 'read', h: 'Types', body: '<ul><li><b>int</b>: whole numbers. <code>42</code></li><li><b>float</b>: decimals. <code>3.14</code></li><li><b>str</b>: text in quotes. <code>"hello"</code></li><li><b>bool</b>: <code>True</code> or <code>False</code></li><li><b>None</b>: "nothing here."</li></ul><p>Type matters: <code>"5" + "5"</code> is <code>"55"</code> (text joined), <code>5 + 5</code> is <code>10</code>. Convert with <code>int("5")</code>, <code>str(5)</code>, <code>float("2.5")</code>. <code>input()</code> always gives you a string.</p>' },
            { t: 'read', h: 'Operators', body: '<p><code>+ - * /</code> as usual (<code>/</code> always gives a float: <code>7 / 2</code> is <code>3.5</code>). <code>//</code> is integer division (<code>7 // 2</code> is <code>3</code>). <code>%</code> is the remainder (<code>7 % 2</code> is <code>1</code>; great for "is it even?"). <code>**</code> is power (<code>2 ** 10</code> is <code>1024</code>).</p>' },
            { t: 'gen', g: 'pyTrace' }, { t: 'gen', g: 'pyTrace' },
            { t: 'mcq', q: 'What does <code>print(17 % 5)</code> show?', opts: ['3.4', '3', '2', '12'], a: 2, why: '% gives the remainder: 17 = 3 × 5 + 2.' },
            { t: 'explain', q: 'Explain what <code>x = x + 1</code> does, to someone who thinks it\'s a math equation.', points: ['= means assign, not equal', 'The right side is computed first using x\'s current value', 'The result is stored back into x', 'So x goes up by one'] }
          ]
        },
        {
          id: 'py-if', title: 'Conditionals & logic', min: 8, teaser: 'if, elif, else, and/or/not.',
          pre: ['py-vars'], links: ['py-loops', 'cs-logic'],
          cards: [
            { t: 'read', h: 'Making decisions', body: code(['temp = 94', 'if temp > 90:', '    print("stay inside")', 'elif temp > 70:', '    print("nice out")', 'else:', '    print("grab a jacket")']) + '<p>The <b>indentation</b> (4 spaces) is how Python knows which lines belong to which branch. It checks conditions top to bottom and runs only the <b>first</b> true branch. <code>else</code> catches everything left.</p>' },
            { t: 'read', h: 'Comparisons and logic', body: '<p>Comparisons give True/False: <code>==</code> (equal: two equals signs!), <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</p><p>Combine with <code>and</code> (both true), <code>or</code> (at least one), <code>not</code> (flip). These are the same AND/OR/NOT as the logic gates lesson.</p>' + code(['if user == "admin" and mfa_ok:', '    grant_access()']), mem: '= assigns. == compares.' },
            { t: 'gen', g: 'pyIf' }, { t: 'gen', g: 'pyIf' },
            { t: 'mcq', q: 'Which prints "yes"?', opts: ['if 5 > 3 and 2 > 4: print("yes")', 'if 5 > 3 or 2 > 4: print("yes")', 'if not 5 > 3: print("yes")', 'if 5 == 3: print("yes")'], a: 1, why: '"or" needs only one side true; 5 > 3 is true.' }
          ]
        },
        {
          id: 'py-loops', title: 'Loops', min: 9, teaser: 'for, while, range, and the off-by-one trap.',
          pre: ['py-if'], links: ['py-lists', 'cs-algorithms'],
          cards: [
            { t: 'read', h: 'for loops', body: code(['for i in range(5):', '    print(i)        # 0 1 2 3 4']) + '<p><code>range(5)</code> means 0, 1, 2, 3, 4: it starts at 0 and stops <b>before</b> 5. <code>range(2, 6)</code> is 2–5. <code>range(0, 10, 3)</code> counts by 3: 0, 3, 6, 9.</p><p>A <code>for</code> loop can walk any collection: <code>for name in names:</code>, <code>for ch in "hello":</code>, <code>for line in open("auth.log"):</code> (that last one is how you\'d scan a log file).</p>', mem: 'range(n) stops BEFORE n.' },
            { t: 'read', h: 'while loops', body: code(['tries = 0', 'while tries < 3:', '    tries += 1', 'print("locked out")']) + '<p><code>while</code> repeats as long as the condition is true. If nothing inside ever makes it false, you get an <b>infinite loop</b> (Ctrl+C stops it). <code>break</code> exits a loop early; <code>continue</code> skips to the next round.</p>' },
            { t: 'gen', g: 'pyLoop' }, { t: 'gen', g: 'pyLoop' }, { t: 'gen', g: 'pyWhile' },
            { t: 'explain', q: 'Explain when you\'d use a for loop vs a while loop.', points: ['for: you know what you\'re looping over (a range, a list, lines of a file)', 'while: repeat until a condition changes (unknown number of times)', 'while needs something inside to eventually make the condition false', 'range(n) runs n times, from 0 to n−1'] }
          ]
        },
        {
          id: 'py-lists', title: 'Lists, strings & dictionaries', min: 10, teaser: 'Indexes from 0, slices, and key → value lookups.',
          pre: ['py-loops'], links: ['py-func', 'ds-hash'],
          cards: [
            { t: 'read', h: 'Lists', body: code(['ports = [22, 80, 443]', 'ports.append(3389)    # [22, 80, 443, 3389]', 'print(ports[0])       # 22  (first item is index 0)', 'print(ports[-1])      # 3389 (negative counts from the end)', 'print(ports[1:3])     # [80, 443] (stop before index 3)', 'print(len(ports))     # 4', 'print(443 in ports)   # True']) + '<p>Lists are ordered and changeable. Indexes start at <b>0</b>, so the last index is <code>len - 1</code>. Asking for an index that doesn\'t exist raises <code>IndexError</code>.</p>', mem: 'First item is [0]. Last is [-1]. Slices stop before the second number.' },
            { t: 'read', h: 'Strings act like lists of characters', body: code(['s = "security"', 's[0]        # "s"', 's[-1]       # "y"', 's[0:3]      # "sec"', 's.upper()   # "SECURITY"', 's.split("c")  # ["se", "urity"]', '"cur" in s  # True']) + '<p>Strings can\'t be changed in place (they\'re <b>immutable</b>); methods return a new string. <code>f"Hi {name}"</code> (an f-string) drops variables into text.</p>' },
            { t: 'read', h: 'Dictionaries', body: code(['owner = {"web01": "nate", "db01": "ava"}', 'print(owner["web01"])      # nate', 'owner["fw01"] = "luc"      # add a key', 'for host, who in owner.items():', '    print(host, who)']) + '<p>A <b>dictionary</b> maps <b>keys</b> to <b>values</b>, like a real dictionary maps words to definitions. Lookups by key are instant no matter how big it gets (it\'s a hash table under the hood). A missing key raises <code>KeyError</code>; <code>owner.get("x")</code> returns <code>None</code> instead.</p>' },
            { t: 'gen', g: 'pyList' }, { t: 'gen', g: 'pyList' }, { t: 'gen', g: 'pyStr' }, { t: 'gen', g: 'pyDict' }
          ]
        },
        {
          id: 'py-func', title: 'Functions', min: 9, teaser: 'Name a chunk of code, give it inputs, get an output.',
          pre: ['py-lists'], links: ['py-debug', 'ds-recursion'],
          cards: [
            { t: 'read', h: 'Defining and calling', body: code(['def is_strong(pw):', '    return len(pw) >= 14 and not pw.isalpha()', '', 'print(is_strong("Summer2024"))           # False', 'print(is_strong("cajun-gumbo-roux-77"))  # True']) + '<p><code>def</code> defines a function. <code>pw</code> is a <b>parameter</b>: a variable that gets the value you pass in (the <b>argument</b>). <code>return</code> sends a value back and ends the function. A function with no return gives back <code>None</code>.</p>' },
            { t: 'read', h: 'Why functions matter', body: '<ul><li><b>Reuse</b>: write once, call anywhere.</li><li><b>Naming</b>: <code>is_strong(pw)</code> says what it does; you don\'t have to read the guts.</li><li><b>Scope</b>: variables made inside a function exist only inside it. That keeps parts of a program from accidentally changing each other.</li></ul><p>When reading unfamiliar code, start by reading function names and what they return. That\'s 80% of understanding it.</p>' },
            { t: 'gen', g: 'pyFunc' }, { t: 'gen', g: 'pyFunc' },
            { t: 'mcq', q: 'What does this print?' + code(['def greet(name):', '    print("hi " + name)', '', 'x = greet("nate")', 'print(x)']), opts: ['hi nate, then None', 'hi nate, then hi nate', 'None only', 'An error'], a: 0, keep: true, why: 'greet prints "hi nate" but has no return, so it returns None, which x stores and the second print shows. print and return are not the same thing.' },
            { t: 'explain', q: 'Explain the difference between print and return.', points: ['print shows text on the screen; the program can\'t use it after', 'return hands a value back to whoever called the function', 'A function without return gives back None', 'Use return when other code needs the result'] }
          ]
        },
        {
          id: 'py-debug', title: 'Errors, debugging & reading other people\'s code', min: 10, teaser: 'Tracebacks, the 8 errors you\'ll actually see, and how to read code you didn\'t write.',
          pre: ['py-func'], links: ['t-readcode', 'py-project'],
          cards: [
            { t: 'read', h: 'Read the traceback bottom-up', body: code(['Traceback (most recent call last):', '  File "scan.py", line 12, in <module>', '    total += int(parts[2])', 'IndexError: list index out of range']) + '<p>The <b>last line</b> is the error type and message. The line above it is the exact code that failed, and its line number. Start there. Most bugs are: wrong type (<code>TypeError</code>), missing item (<code>IndexError</code>, <code>KeyError</code>), typo (<code>NameError</code>), or bad input (<code>ValueError</code>).</p>', mem: 'Read the last line first: error type + line number.' },
            { t: 'read', h: 'A debugging routine', body: '<ol><li><b>Reproduce it</b>: make it fail on purpose.</li><li><b>Read the error</b> and go to the line.</li><li><b>Print the variables</b> right before that line: <code>print("parts =", parts)</code>. Most bugs are a value that isn\'t what you assumed.</li><li><b>Change one thing</b> at a time and re-run.</li><li>Explain the code out loud, line by line ("rubber duck debugging"). You\'ll often hear the bug.</li></ol>' },
            { t: 'read', h: 'Reading code you didn\'t write (including AI code)', body: '<ol><li>Find the entry point (the bottom of the file, or <code>if __name__ == "__main__":</code>).</li><li>Read function <b>names</b> and what they return before reading their insides.</li><li>Trace one realistic input through by hand, writing down each variable\'s value as it changes (exactly what the practice cards make you do).</li><li>Look up anything unknown: an import, a method, a library.</li><li>Ask: what does it read, what does it change, what does it send out? That\'s also the security review question.</li></ol><p>If you can\'t explain what a line does, you don\'t own the code yet, AI-written or not.</p>' },
            { t: 'gen', g: 'pyBug' }, { t: 'gen', g: 'pyBug' }, { t: 'gen', g: 'pyBug' },
            { t: 'explain', q: 'Explain your step-by-step routine when Python code crashes.', points: ['Read the last traceback line: error type and message', 'Go to the failing line number', 'Print the variables right before it to check assumptions', 'Change one thing, re-run; explain it line by line'] }
          ]
        },
        {
          id: 'py-project', title: 'Project: a log scanner', min: 12, teaser: 'Put it all together: find brute-force attempts in an auth log.',
          pre: ['py-debug'], links: ['sp-logs-lab', 'sp-indicators'],
          cards: [
            { t: 'read', h: 'The goal', body: '<p>Write a Python script that reads a Linux <code>auth.log</code>, counts failed SSH logins per IP address, and prints any IP with 5 or more failures. That\'s a real SOC-style task, and it uses everything so far: loops, strings, dictionaries, conditionals, functions.</p><p>A sample line looks like:</p>' + code(['Oct 31 02:14:07 web01 sshd[812]: Failed password for root from 203.0.113.9 port 51122 ssh2']) },
            { t: 'read', h: 'The script', body: code([
              'def failed_ips(path):',
              '    counts = {}',
              '    for line in open(path):',
              '        if "Failed password" in line:',
              '            parts = line.split()',
              '            ip = parts[parts.index("from") + 1]',
              '            counts[ip] = counts.get(ip, 0) + 1',
              '    return counts',
              '',
              'for ip, n in failed_ips("auth.log").items():',
              '    if n >= 5:',
              '        print(ip, "-", n, "failures")']) + '<p>Line by line: make an empty dict; loop over each line of the file; keep only failed-password lines; split the line into words; the IP is the word right after "from"; add one to that IP\'s count (<code>.get(ip, 0)</code> starts new IPs at 0); return the dict. Then print the noisy ones.</p>' },
            { t: 'mcq', q: 'Why use <code>counts.get(ip, 0) + 1</code> instead of <code>counts[ip] + 1</code>?', opts: ['It\'s faster', 'The first time an IP appears it isn\'t in the dict yet; [ip] would raise KeyError', 'It sorts the dict', 'It removes duplicates'], a: 1, why: '.get with a default handles keys that don\'t exist yet.' },
            { t: 'mcq', q: 'Which change would ALSO catch "Invalid user" lines?', opts: ['if "Failed password" in line or "Invalid user" in line:', 'if "Failed password" and "Invalid user" in line:', 'if line == "Invalid user":', 'Nothing, it already does'], a: 0, why: '"or" with a full condition on each side. The second option is a classic bug: "Failed password" by itself is always truthy.' },
            { t: 'read', h: 'Try it for real', body: '<p>On your Kali VM: save it as <code>scan.py</code>, copy a real log with <code>sudo cp /var/log/auth.log .</code> (or generate failures by SSHing with a wrong password to your own box), then run <code>python3 scan.py</code>. Next upgrades: sort by count (<code>sorted(counts.items(), key=lambda x: x[1], reverse=True)</code>), make the threshold an argument, and send the output to a file.</p>' },
            { t: 'explain', q: 'Walk through what the log scanner does from opening the file to printing.', points: ['Loops over each line of the log', 'Keeps only lines with "Failed password"', 'Splits the line and takes the word after "from" as the IP', 'Counts per IP in a dictionary, then prints IPs at or over the threshold'] }
          ]
        }
      ]
    },
    {
      name: 'Algorithms', tag: 'CS50 wk 3 · MIT 6.0001',
      blurb: 'Searching, sorting, recursion, and measuring speed with Big-O.',
      lessons: [
        {
          id: 'alg-search', title: 'Linear vs binary search', min: 8, teaser: 'Why sorted data can be searched in 32 steps instead of 4 billion.',
          pre: ['cs-algorithms'], links: ['alg-sort', 'py-loops'],
          cards: [
            { t: 'read', h: 'Linear search', body: '<p>Check each item one by one until you find it. Works on anything, but in the worst case you check all <b>n</b> items: <b>O(n)</b>.</p>' + code(['def linear(items, target):', '    for i in range(len(items)):', '        if items[i] == target:', '            return i', '    return -1']) },
            { t: 'read', h: 'Binary search', body: '<p>Only works on <b>sorted</b> data. Look at the middle. Too big? Throw away the right half. Too small? Throw away the left half. Repeat. Each step halves the problem, so it takes about <b>log₂ n</b> steps: <b>O(log n)</b>.</p>' + code(['def binary(items, target):', '    lo, hi = 0, len(items) - 1', '    while lo <= hi:', '        mid = (lo + hi) // 2', '        if items[mid] == target: return mid', '        if items[mid] < target: lo = mid + 1', '        else: hi = mid - 1', '    return -1']) + '<p>4 billion items → about 32 checks. It\'s how a phone book, a database index, and <code>git bisect</code> (finding which commit broke something) work.</p>', mem: 'Sorted? Halve it. log₂(1,000,000) ≈ 20.' },
            { t: 'gen', g: 'csBinSearch' }, { t: 'gen', g: 'csBinSearch' },
            { t: 'tf', q: 'Binary search works on any list, sorted or not.', a: false, why: 'Throwing away half only works if you know everything on that side is bigger or smaller, which needs sorted data.' },
            { t: 'explain', q: 'Explain why binary search is so much faster than linear search.', points: ['Linear checks items one by one, up to n checks', 'Binary checks the middle and discards half each time', 'That gives about log₂(n) checks', 'Requires the data to be sorted'] }
          ]
        },
        {
          id: 'alg-sort', title: 'Sorting: selection, bubble & merge', min: 10, teaser: 'O(n²) vs O(n log n), and why it matters at scale.',
          pre: ['alg-search'], links: ['cs-sort-lab', 'ds-recursion'],
          cards: [
            { t: 'read', h: 'The slow, simple ones: O(n²)', body: '<ul><li><b>Selection sort</b>: find the smallest, swap it to the front; find the next smallest, put it second; repeat.</li><li><b>Bubble sort</b>: walk the list swapping neighbors that are out of order; repeat until a pass makes no swaps.</li></ul><p>Both compare roughly every item with every other item: about n² steps. 1,000 items → ~1,000,000 comparisons. 1,000,000 items → ~10¹² (a long time).</p>' },
            { t: 'read', h: 'Merge sort: O(n log n)', body: '<ol><li>Split the list in half.</li><li>Sort each half (by doing merge sort on it: recursion).</li><li><b>Merge</b> the two sorted halves by repeatedly taking the smaller front item.</li></ol><p>Splitting in half gives log n levels; merging each level costs n. Total ≈ n log n. For 1,000,000 items that\'s ~20 million steps instead of 10¹². Python\'s built-in <code>sorted()</code> uses Timsort, a merge-sort hybrid.</p>', mem: 'Bubble/selection = n². Merge = n log n.' },
            { t: 'gen', g: 'csBigO' }, { t: 'gen', g: 'csBigO' },
            { t: 'calc', q: 'An O(n²) sort takes 1 second for 1,000 items. Roughly how many seconds for 10,000 items?', a: 100, tol: 1, why: '10× the items → 10² = 100× the work → about 100 seconds. An O(n log n) sort would take only about 13× longer.' },
            { t: 'explain', q: 'Explain how merge sort works and why it beats bubble sort on big lists.', points: ['Split the list in half repeatedly down to single items', 'Merge sorted halves back together by taking the smaller front item', 'log n levels × n work per level = n log n', 'Bubble sort compares neighbors over and over: n²'] }
          ]
        },
        {
          id: 'ds-recursion', title: 'Recursion', min: 9, teaser: 'A function that calls itself, and the base case that stops it.',
          pre: ['py-func'], links: ['alg-sort', 'ds-stack'],
          cards: [
            { t: 'read', h: 'Solve a smaller version of the same problem', body: code(['def factorial(n):', '    if n <= 1:          # base case: stop here', '        return 1', '    return n * factorial(n - 1)   # recursive case', '', 'print(factorial(5))   # 5*4*3*2*1 = 120']) + '<p>Every recursive function needs a <b>base case</b> (when to stop) and a <b>recursive case</b> that moves toward it. Forget the base case and it calls itself forever until Python raises <code>RecursionError</code> (a stack overflow).</p>', mem: 'Base case + a step toward it.' },
            { t: 'read', h: 'The call stack', body: '<p>Each call waits for the one it made to finish. Python keeps them on the <b>call stack</b>: factorial(5) waits on factorial(4), which waits on factorial(3)… down to factorial(1), which returns 1. Then they finish in reverse: 2 → 6 → 24 → 120.</p><p>Recursion fits problems that contain smaller copies of themselves: folders inside folders, trees, merge sort, and walking a network graph.</p>' },
            { t: 'calc', q: 'What does this print?' + code(['def f(n):', '    if n == 0:', '        return 0', '    return n + f(n - 1)', '', 'print(f(4))']), a: 10, why: 'f(4) = 4 + f(3) = 4 + 3 + f(2) = … = 4 + 3 + 2 + 1 + 0 = 10.' },
            { t: 'mcq', q: 'What happens if a recursive function has no base case?', opts: ['It returns 0', 'It runs forever until a RecursionError (stack overflow)', 'Python adds one automatically', 'It runs once'], a: 1, why: 'Each call adds a frame to the call stack until the stack limit is hit.' }
          ]
        }
      ]
    },
    {
      name: 'Data structures', tag: 'CS50 wk 5',
      blurb: 'How data is organized decides how fast you can use it.',
      lessons: [
        {
          id: 'ds-stack', title: 'Arrays, linked lists, stacks & queues', min: 9, teaser: 'LIFO, FIFO, and the trade-offs of each layout.',
          pre: ['py-lists'], links: ['ds-hash', 'ds-recursion'],
          cards: [
            { t: 'read', h: 'Arrays vs linked lists', body: '<ul><li><b>Array</b>: items side by side in memory. Jump straight to item i in O(1). Inserting in the middle means shifting everything after it: O(n). (Python lists are dynamic arrays.)</li><li><b>Linked list</b>: each item (node) stores its value plus a <b>pointer</b> to the next node. Inserting is O(1) once you\'re at the spot, but finding item i means walking from the start: O(n).</li></ul>' },
            { t: 'read', h: 'Stacks and queues', body: '<ul><li><b>Stack</b>: last in, first out (<b>LIFO</b>). push adds to the top, pop removes from the top. Uses: undo, the browser Back button, the function call stack.</li><li><b>Queue</b>: first in, first out (<b>FIFO</b>). enqueue at the back, dequeue from the front. Uses: print jobs, network packet buffers, task queues, breadth-first search.</li></ul>', mem: 'Stack = plates (LIFO). Queue = a line at the store (FIFO).' },
            { t: 'gen', g: 'csStack' }, { t: 'gen', g: 'csStack' },
            { t: 'explain', q: 'Explain a stack vs a queue with a real example of each.', points: ['Stack: LIFO, last added comes out first', 'Example: undo history, browser back, call stack', 'Queue: FIFO, first added comes out first', 'Example: print queue, packet buffer, waiting line'] }
          ]
        },
        {
          id: 'ds-hash', title: 'Hash tables, trees & graphs', min: 10, teaser: 'Instant lookups, sorted trees, and networks of connections.',
          pre: ['ds-stack'], links: ['sp-hashing', 'alg-search', 'cs-how-internet'],
          cards: [
            { t: 'read', h: 'Hash tables', body: '<p>A <b>hash table</b> runs each key through a hash function to pick a bucket, so finding a key is about <b>O(1)</b>: no searching. Python\'s <code>dict</code> and <code>set</code> are hash tables. When two keys land in the same bucket it\'s a <b>collision</b>, handled by chaining items in the bucket.</p><p>Same "hash" word as in security, different goal: here speed, there integrity.</p>' },
            { t: 'read', h: 'Trees', body: '<p>A <b>tree</b> has a root node and child nodes, with no loops. Your file system is a tree. A <b>binary search tree</b> keeps smaller values left and larger right, so searching is like binary search: O(log n) when balanced. Databases use B-trees for their indexes. DNS is a tree too: root → .com → example.com.</p>' },
            { t: 'read', h: 'Graphs', body: '<p>A <b>graph</b> is nodes connected by edges, with loops allowed. Networks are graphs (routers and links), so are social networks and Active Directory attack paths (BloodHound maps "who can reach domain admin" as a graph). <b>Breadth-first search</b> (using a queue) finds the shortest path in hops; <b>depth-first search</b> (using a stack or recursion) explores one path fully first.</p>', mem: 'Hash table = instant lookup. Tree = hierarchy. Graph = network.' },
            { t: 'mcq', q: 'You need to check whether a username is in a list of 10 million banned names, instantly, many times a second. Best structure?', opts: ['Unsorted list', 'Set / hash table', 'Linked list', 'Stack'], a: 1, why: 'Hash lookups are O(1) on average. A list would be O(n) every time.' },
            { t: 'mcq', q: 'Which algorithm finds the fewest-hops route between two routers in a network graph?', opts: ['Depth-first search', 'Breadth-first search', 'Bubble sort', 'Binary search'], a: 1, why: 'BFS explores all neighbors at distance 1, then 2, and so on, so the first time it reaches the target is the shortest path in hops.' },
            { t: 'gen', g: 'csBigO' }
          ]
        }
      ]
    },
    {
      name: 'How programs run', tag: 'CS50 wk 4 · systems',
      blurb: 'CPU, memory, compilers and why memory bugs become security bugs.',
      lessons: [
        {
          id: 'sys-run', title: 'CPU, memory & compiled vs interpreted', min: 10, teaser: 'What actually happens when you hit Run.',
          pre: ['cs-logic'], links: ['sp-vulns-app', 'cs-filesystems'],
          cards: [
            { t: 'read', h: 'The machine', body: '<ul><li><b>CPU</b>: executes instructions, billions per second, in a fetch → decode → execute cycle. Keeps working values in tiny, ultra-fast <b>registers</b> and <b>cache</b>.</li><li><b>RAM</b>: working memory. Fast, temporary, wiped on power-off (that\'s why forensics grabs RAM first).</li><li><b>Storage</b> (SSD/HDD): slow but permanent.</li></ul><p>Every byte in RAM has an <b>address</b>, a number, usually written in hex (0x7ffd3a10).</p>' },
            { t: 'read', h: 'Compiled vs interpreted', body: '<ul><li><b>Compiled</b> (C, C++, Go, Rust): a compiler translates your whole program into machine code ahead of time. Fast, produces an executable.</li><li><b>Interpreted</b> (Python, JavaScript, Bash): an interpreter reads and runs your code as it goes. Easier to write and test, slower.</li></ul><p>Python actually compiles to bytecode first, then a virtual machine runs that. The exam-level distinction is still: compiled → executable ahead of time; interpreted → run by another program.</p>' },
            { t: 'read', h: 'Stack, heap, and memory bugs', body: '<p>A running program\'s memory has a <b>stack</b> (function calls and their local variables, automatically cleaned up) and a <b>heap</b> (memory requested while running, which must be freed).</p><p>In C you manage memory yourself with <b>pointers</b> (variables holding addresses). Write past the end of an array and you overwrite whatever sits next to it, possibly the saved return address on the stack. That\'s a <b>buffer overflow</b>, and it\'s why memory-safe languages (Python, Rust, Go) are pushed for security-critical code.</p>', mem: 'Stack = function calls. Heap = requested memory. Overflow = writing past the end.',
              deeper: '<p>Defenses against memory exploits: <b>ASLR</b> (randomize where things load so addresses can\'t be guessed), <b>DEP/NX</b> (mark data memory non-executable), <b>stack canaries</b> (a secret value before the return address; if it changes, crash instead of running attacker code). These map straight to Security+ 2.3.</p>' },
            { t: 'mcq', q: 'Which memory is wiped when the computer loses power?', opts: ['SSD', 'RAM', 'Hard drive', 'USB flash drive'], a: 1, why: 'RAM is volatile. That\'s also why it\'s first in the order of volatility for forensics.' },
            { t: 'mcq', q: 'Why are C programs more prone to buffer overflows than Python programs?', opts: ['C is older', 'C lets code write to memory without checking bounds; Python checks every index', 'Python has no memory', 'C can\'t use arrays'], a: 1, why: 'Python raises IndexError instead of silently writing past the end.' },
            { t: 'explain', q: 'Explain how a buffer overflow can let an attacker run code.', points: ['A program copies input into a fixed-size buffer without checking length', 'Extra bytes overwrite nearby memory', 'On the stack this can overwrite the saved return address', 'Mitigations: bounds checking, memory-safe languages, ASLR, DEP, canaries'] }
          ]
        }
      ]
    }
  ];
  // insert after "How computers think" (data unit) and after "Programming foundations" (the rest)
  S.units.splice(1, 0, units[0]);
  var at = S.units.findIndex ? S.units.findIndex(function (u) { return u.name === 'Programming foundations'; }) : -1;
  if (at < 0) at = S.units.length - 1;
  Array.prototype.splice.apply(S.units, [at + 1, 0].concat(units.slice(1)));
  S.blurb = 'Data, Python, algorithms, structures, systems.';
  S.intro = "A computer science reboot built on the outline of Harvard's CS50 and MIT 6.0001: how data is stored, real Python from zero, reading code you didn't write, algorithms, data structures, and what happens inside the machine. The \"read the code\" questions are generated fresh every time, so you're tracing logic, not memorizing answers. Hit Practice drill for endless rounds.";
})();
