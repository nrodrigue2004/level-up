/* Learn tab module for nate's combined app.
   Plugs into the planner shell via window.App (registerTab, store, xp.award, toast, save, go).
   Content lives in content/*.js and registers on window.RH_SUBJECTS. This file loads them,
   its own CSS, then registers the tab. All in-tab markup is scoped under .rh; the lesson
   player is a body-level overlay (.rh-player) that survives the shell's re-renders. */
(function () {
  'use strict';

  /* ---- locate ourselves & load siblings ---- */
  var ME = document.currentScript && document.currentScript.src || '';
  var BASE = ME.slice(0, ME.lastIndexOf('/') + 1);
  (function css() {
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = BASE + 'learn.css'; document.head.appendChild(l);
  })();
  var CONTENT = ['content/glossary.js', 'content/secplus.js', 'content/secplus-d1.js', 'content/secplus-d2.js', 'content/secplus-d3.js', 'content/secplus-d4.js', 'content/secplus-d5.js', 'content/secplus-labs.js', 'content/fe.js', 'content/projects.js', 'content/cs.js', 'content/cs-reboot.js', 'content/cs-langs.js', 'content/cs-degree.js', 'content/cs-degree2.js', 'content/tech.js', 'content/ai.js', 'content/career.js', 'content/mma.js', 'content/mma-guard.js', 'content/world.js', 'content/k12-math.js', 'content/k12-english.js', 'content/k12-science.js', 'content/k12-history.js', 'content/life.js', 'content/music.js', 'content/dance.js', 'content/spanish.js', 'content/mind.js'];

  function loadScript(src) {
    return new Promise(function (res) {
      var s = document.createElement('script'); s.src = BASE + src;
      s.onload = function () { res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }

  /* ---- helpers ---- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  function h(tag, attrs, html) {
    var el = document.createElement(tag); attrs = attrs || {};
    for (var k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    }
    if (html != null) el.innerHTML = html;
    return el;
  }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var norm = function (s) { return String(s).toLowerCase().trim().replace(/[\s.,!?'"`]+/g, ' ').trim(); };
  var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  function dayStr(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

  var ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    hole: '🐇'
  };

  /* ---- host adapter (the planner's App) ---- */
  var CTX = null;
  var A = {
    store: function () { return (window.App && window.App.store) ? window.App.store('learn') : (A._s = A._s || {}); },
    save: function () { try { (CTX && CTX.save ? CTX.save : window.App.save)(); } catch (e) { } },
    toast: function (m) { try { (CTX && CTX.toast ? CTX.toast : window.App.toast)(m); } catch (e) { } },
    award: function (key, amt, stat) { try { window.App.xp.award(key, amt, stat || 'mind'); } catch (e) { } },
    level: function () { try { return window.App.xp.level(); } catch (e) { return 1; } },
    total: function () { try { return window.App.xp.total(); } catch (e) { return 0; } },
    go: function (t, s) { try { window.App.go(t, s); } catch (e) { } }
  };
  function data() {
    var s = A.store();
    s.done = s.done || {}; s.review = s.review || []; s.saved = s.saved || []; s.trail = s.trail || [];
    s.gauntlet = s.gauntlet || 0; s.placement = s.placement || {}; s.unlocked = s.unlocked || {}; s.recent = s.recent || [];
    return s;
  }

  /* ---- subject index (filled after content loads) ---- */
  var SUBJECTS = [], LESSONS = {}, GLOSS = {}, GLOSS_KEYS = [];
  function indexContent() {
    SUBJECTS = (window.RH_SUBJECTS || []).slice();
    LESSONS = {};
    SUBJECTS.forEach(function (s) {
      s.units.forEach(function (u) {
        u.lessons.forEach(function (l, i) { LESSONS[l.id] = { l: l, s: s, u: u, idx: i }; });
      });
    });
    GLOSS = window.RH_GLOSSARY || {};
    // longest terms first so "ip address" wins over "ip"
    GLOSS_KEYS = Object.keys(GLOSS).sort(function (a, b) { return b.length - a.length; });
  }

  /* ---- tap-to-define: auto-underline the first mention of any glossary term ---- */
  var SKIP_TAGS = { CODE: 1, PRE: 1, A: 1, BUTTON: 1, INPUT: 1, TEXTAREA: 1, SVG: 1 };
  var SKIP_CLASS = /rh-term|rh-lab|rh-bits|rh-email|rh-def|rh-pm-tag|rh-chip2|rh-bar|rh-meter/;
  function skipNode(node) {
    for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      if (SKIP_TAGS[String(p.tagName).toUpperCase()]) return true;
      if (p.className && typeof p.className === 'string' && SKIP_CLASS.test(p.className)) return true;
    }
    return false;
  }
  function autoDefine(root) {
    if (!root || !GLOSS_KEYS.length) return;
    var used = root.__rhUsed || (root.__rhUsed = {});
    var count = 0, MAX = 26;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) { if (n.nodeValue.trim() && !skipNode(n)) nodes.push(n); }
    nodes.forEach(function (node) {
      if (count >= MAX) return;
      var text = node.nodeValue, best = null;
      for (var i = 0; i < GLOSS_KEYS.length; i++) {
        var key = GLOSS_KEYS[i]; if (used[key]) continue;
        var re = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(s|es)?\\b', 'i');
        var m = re.exec(text);
        if (m && (best === null || m.index < best.index)) best = { key: key, index: m.index, len: m[0].length };
      }
      if (!best) return;
      used[best.key] = 1; count++;
      var before = text.slice(0, best.index), word = text.slice(best.index, best.index + best.len), after = text.slice(best.index + best.len);
      var btn = h('button', { class: 'rh-def', 'data-term': best.key, title: 'Tap to define' }, esc(word));
      var frag = document.createDocumentFragment();
      if (before) frag.appendChild(document.createTextNode(before));
      frag.appendChild(btn);
      var tail = document.createTextNode(after);
      frag.appendChild(tail);
      node.parentNode.replaceChild(frag, node);
      // continue scanning the tail for more terms
      if (after && count < MAX) autoDefineNode(tail, used, function () { count++; }, function () { return count; }, MAX);
    });
    root.addEventListener('click', onDefClick);
  }
  function autoDefineNode(node, used, inc, get, MAX) {
    var text = node.nodeValue, best = null;
    for (var i = 0; i < GLOSS_KEYS.length; i++) {
      var key = GLOSS_KEYS[i]; if (used[key]) continue;
      var re = new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(s|es)?\\b', 'i');
      var m = re.exec(text); if (m && (best === null || m.index < best.index)) best = { key: key, index: m.index, len: m[0].length };
    }
    if (!best || get() >= MAX) return;
    used[best.key] = 1; inc();
    var before = text.slice(0, best.index), word = text.slice(best.index, best.index + best.len), after = text.slice(best.index + best.len);
    var btn = h('button', { class: 'rh-def', 'data-term': best.key }, esc(word));
    var frag = document.createDocumentFragment();
    if (before) frag.appendChild(document.createTextNode(before));
    frag.appendChild(btn);
    var tail = document.createTextNode(after); frag.appendChild(tail);
    node.parentNode.replaceChild(frag, node);
    if (after) autoDefineNode(tail, used, inc, get, MAX);
  }
  function onDefClick(e) { var b = e.target.closest('.rh-def'); if (b) { e.stopPropagation(); defineSheet(b.dataset.term, 0); } }

  function defineSheet(key, startDepth) {
    var g = GLOSS[key]; if (!g) return;
    var levels = Array.isArray(g.d) ? g.d : [g.d];
    var depth = Math.min(startDepth || 0, levels.length - 1);
    var scrim = h('div', { class: 'rh-scrim' });
    document.body.appendChild(scrim);
    var close = function () { scrim.remove(); };
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
    function paint() {
      scrim.innerHTML = '';
      var sheet = h('div', { class: 'rh-sheet', role: 'dialog', 'aria-label': 'Definition' });
      sheet.innerHTML = '<span class="eyebrow" style="color:var(--hole)">What is this?</span><h3 style="text-transform:capitalize">' + esc(key) + '</h3>';
      var body = h('div', { class: 'rh-body', style: 'font-size:16px' }, levels[depth]);
      sheet.appendChild(body);
      if (g.ex) { var ex = h('div', { class: 'rh-callout' }, '<b>Example: </b>' + g.ex); sheet.appendChild(ex); }
      if (g.why) { var wy = h('div', { class: 'rh-callout mem' }, '<b>Why it matters: </b>' + g.why); sheet.appendChild(wy); }
      if (levels.length > 1) {
        var ctl = h('div', { class: 'rh-seg2', style: 'margin-top:2px' });
        ctl.innerHTML = levels.map(function (_, i) { return '<button aria-pressed="' + (i === depth) + '" data-d="' + i + '">' + (i === 0 ? 'Simplest' : i === levels.length - 1 ? 'Full detail' : 'Level ' + i) + '</button>'; }).join('');
        ctl.onclick = function (e) { var b = e.target.closest('[data-d]'); if (b) { depth = +b.dataset.d; paint(); } };
        sheet.appendChild(ctl);
      }
      if (window.App && window.App.library) {
        var sw = h('button', { class: 'rh-btn ghost sm', style: 'align-self:flex-start' }, (window.App.library.has && window.App.library.has('word', key)) ? '\u2605 Saved to library' : '\u2606 Save this word');
        sw.onclick = function () { try { window.App.library.save({ type: 'word', title: key, body: levels[0], ref: key }); sw.textContent = '\u2605 Saved to library'; A.toast('Saved to your library'); } catch (e) { } };
        sheet.appendChild(sw);
      }
      var done = h('button', { class: 'rh-btn block', style: 'margin-top:4px' }, 'Got it');
      done.onclick = close; sheet.appendChild(done);
      scrim.appendChild(sheet);
      autoDefine(body); // nested: terms inside a definition are themselves tappable
    }
    paint();
  }

  /* ---- nav state (ephemeral, survives re-render) ---- */
  var LV = { view: 'home', subj: null };
  var honoredPick = false;

  /* ---- progress helpers ---- */
  function subjProgress(s) {
    var d = data(), total = 0, done = 0;
    s.units.forEach(function (u) { u.lessons.forEach(function (l) { total++; if (d.done[l.id]) done++; }); });
    return { total: total, done: done, pct: total ? done / total : 0 };
  }
  function nextLesson() {
    var d = data(), last = d.trail[d.trail.length - 1], order = [];
    if (last && LESSONS[last]) order.push(LESSONS[last].s);
    SUBJECTS.forEach(function (s) { if (order.indexOf(s) < 0) order.push(s); });
    for (var a = 0; a < order.length; a++) {
      var s = order[a];
      for (var b = 0; b < s.units.length; b++) for (var c = 0; c < s.units[b].lessons.length; c++) {
        var l = s.units[b].lessons[c]; if (!d.done[l.id]) return l.id;
      }
    }
    return null;
  }
  var HANDS = ['term', 'bits', 'cipher', 'hashlab', 'pwlab', 'cidr', 'gatelab', 'sortlab', 'phish', 'match', 'order', 'posmap'];
  var hasHands = function (l) { return l.cards.some(function (c) { return HANDS.indexOf(c.t) >= 0; }); };

  /* ---- spaced repetition (Leitner) ---- */
  var GAPS = [0, 1, 3, 7, 16, 35];
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); }
  function cardByKey(k) { var p = k.split('#'); return LESSONS[p[0]] && LESSONS[p[0]].l.cards[+p[1]] ? { c: LESSONS[p[0]].l.cards[+p[1]] } : null; }
  function dueReviews() { var t = dayStr(); return data().review.filter(function (r) { return r.due <= t && cardByKey(r.k); }); }
  function reviewMiss(k) { var d = data(), r = d.review.filter(function (x) { return x.k === k; })[0]; if (r) { r.box = 1; r.due = addDays(1); } else d.review.push({ k: k, box: 1, due: addDays(1) }); }
  function reviewHit(k) {
    var d = data(), r = d.review.filter(function (x) { return x.k === k; })[0]; if (!r) return;
    r.box++; if (r.box >= GAPS.length) d.review = d.review.filter(function (x) { return x !== r; }); else r.due = addDays(GAPS[r.box]);
  }

  /* ---- feedback fx ---- */
  function xpPop(t) { var el = h('div', { class: 'rh-pop' }, esc(t)); document.body.appendChild(el); setTimeout(function () { el.remove(); }, 950); }
  function confetti(n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cols = ['#e2673f', '#3f9a62', '#8a63d2', '#f0a24a', '#63a6e6'];
    for (var i = 0; i < (n || 40); i++) {
      var c = h('i', { class: 'rh-confetti' });
      c.style.left = Math.random() * 100 + 'vw'; c.style.background = cols[i % cols.length];
      c.style.animationDuration = (1.4 + Math.random() * 1.6) + 's'; c.style.animationDelay = (Math.random() * .3) + 's';
      document.body.appendChild(c); (function (c) { setTimeout(function () { c.remove(); }, 3500); })(c);
    }
  }

  /* ---- audio (optional, respects nothing-persisted) ---- */
  var actx = null;
  function beep(kind) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var notes = kind === 'good' ? [660, 880] : kind === 'win' ? [523, 659, 784, 1047] : [220, 180];
      notes.forEach(function (f, i) {
        var o = actx.createOscillator(), g = actx.createGain(); o.type = kind === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
        var t = actx.currentTime + i * .08; g.gain.setValueAtTime(.0001, t);
        g.gain.exponentialRampToValueAtTime(kind === 'bad' ? .05 : .11, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .18);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .2);
      });
    } catch (e) { }
  }

  /* =======================================================================
     RENDER — the tab surface
     ======================================================================= */
  var HOST = null;
  function render(host, ctx) {
    if (host) HOST = host; if (ctx) CTX = ctx;
    host = HOST; if (!host) return;
    host.className = 'rh';
    host.innerHTML = '';
    if (!SUBJECTS.length) { host.appendChild(h('div', { class: 'rh-empty' }, 'Loading lessons…')); return; }
    if (!honoredPick && LV.view === 'home') { honoredPick = true; try { var pk = window.App.internal.day(dayStr()).learnPick; if (pk && SUBJECTS.filter(function (x) { return x.id === pk; })[0]) { LV.view = 'subject'; LV.subj = pk; } } catch (e) { } }
    if (LV.view === 'subject' && SUBJECTS.filter(function (s) { return s.id === LV.subj; })[0]) viewSubject(host, LV.subj);
    else viewHome(host);
  }
  function rerender() { render(); }

  function subjCardHTML(s) {
    var p = subjProgress(s);
    return '<button class="rh-subj" data-subject="' + s.id + '">' +
      '<span class="dot" style="--sc:' + s.color + '">' + esc(s.mark) + '</span>' +
      '<b>' + esc(s.name) + '</b><small>' + esc(s.blurb) + '</small>' +
      '<div class="rh-bar"><i style="width:' + (p.pct * 100) + '%;background:' + s.color + '"></i></div>' +
      '<small>' + p.done + ' of ' + p.total + ' lessons</small></button>';
  }

  function viewHome(host) {
    var d = data(), nxt = nextLesson(), due = dueReviews().length, lv = A.level();
    var head = h('div', { class: 'rh-head' });
    head.innerHTML = '<p>Pick anything. No locks, no order. Follow a rabbit hole as deep as you like.</p>' +
      '<div class="rh-xprow"><span class="rh-pill">Level ' + lv + '</span><span class="rh-pill">' + A.total() + ' XP</span>' +
      '<span class="rh-pill">' + Object.keys(d.done).length + ' lessons done</span></div>';
    host.appendChild(head);

    if (due) {
      var rb = h('button', { class: 'rh-cont', style: 'background:var(--good)', 'data-mix': 'review' },
        '<span class="play">\uD83E\uDDE0</span><span class="t"><b>Review first \u00b7 ' + due + ' due</b><span>Lock in what you already learned before new stuff. This is how it beats a bad memory.</span></span>');
      host.appendChild(rb);
    }

    if (nxt) {
      var L = LESSONS[nxt];
      var cont = h('button', { class: 'rh-cont', 'data-lesson': nxt },
        '<span class="play">' + ICON.play + '</span><span class="t"><b>' + (d.trail.length ? 'Keep going: ' : 'Start here: ') + esc(L.l.title) + '</b><span>' + esc(L.s.name) + ' · about ' + (L.l.min || 4) + ' min</span></span>');
      host.appendChild(cont);
    }

    var row = h('div', { class: 'rh-row2' });
    row.innerHTML =
      '<button class="rh-act" data-mix="snack"><span class="ic">🎲</span><b>Snack pack</b><small>5 quick questions from everything.</small></button>' +
      '<button class="rh-act" data-mix="gauntlet"><span class="ic">🛡️</span><b>Sec+ Gauntlet</b><small>25-question mock. Best: ' + d.gauntlet + '/25</small></button>' +
      '<button class="rh-act" data-mix="review"><span class="ic">🔁</span><b>Review' + (due ? ' · ' + due : '') + '</b><small>' + (due ? 'Missed questions are due.' : 'Misses show up here.') + '</small></button>' +
      '<button class="rh-act hole" data-surprise="1"><span class="ic">🐇</span><b>Surprise me</b><small>Drop into a random new lesson.</small></button>';
    host.appendChild(row);

    if (d.saved.filter(function (id) { return LESSONS[id]; }).length) {
      var sec = h('div', { class: 'rh-unit' });
      sec.innerHTML = '<div class="rh-unit-h"><h2>Saved rabbit holes</h2></div>';
      var wrap = h('div', { class: 'rh-saved' });
      d.saved.filter(function (id) { return LESSONS[id]; }).forEach(function (id) {
        var it = h('div', { class: 'rh-saved-item' });
        it.innerHTML = '🐇<button class="t" data-lesson="' + id + '"><b>' + esc(LESSONS[id].l.title) + '</b><small>' + esc(LESSONS[id].s.name) + '</small></button><button class="rh-x" data-unsave="' + id + '" aria-label="Remove">×</button>';
        wrap.appendChild(it);
      });
      sec.appendChild(wrap); host.appendChild(sec);
    }

    var GROUPS = [], byG = {};
    SUBJECTS.forEach(function (s) { var g = s.group || 'More'; if (!byG[g]) { byG[g] = []; GROUPS.push(g); } byG[g].push(s); });
    GROUPS.forEach(function (g) {
      var grid = h('div', { class: 'rh-unit' });
      grid.innerHTML = '<div class="rh-unit-h"><h2>' + esc(g) + '</h2></div><div class="rh-subj-grid">' + byG[g].map(subjCardHTML).join('') + '</div>';
      host.appendChild(grid);
    });
    bind(host);
  }

  function viewSubject(host, id) {
    var s = SUBJECTS.filter(function (x) { return x.id === id; })[0], d = data(), p = subjProgress(s);
    host.appendChild(h('button', { class: 'rh-back', 'data-home': '1' }, ICON.back + ' All subjects'));
    var head = h('div', { class: 'rh-shead' });
    head.innerHTML = '<span class="dot" style="--sc:' + s.color + '">' + esc(s.mark) + '</span><div><h1>' + esc(s.name) + '</h1><p>' + esc(s.blurb) + ' · ' + p.done + '/' + p.total + ' done</p></div>';
    host.appendChild(head);
    if (s.intro) host.appendChild(h('p', { class: 'muted', style: 'margin:0;font-size:15px;line-height:1.5' }, s.intro));
    if (s.placement && !d.placement[s.id]) {
      var pc = h('button', { class: 'rh-cont', style: 'background:var(--hole)', 'data-placement': s.id },
        '<span class="play">' + ICON.play + '</span><span class="t"><b>Quick refresher check</b><span>5 questions to find where you left off. No grades, no pressure.</span></span>');
      host.appendChild(pc);
    }
    if (s.exam) {
      var last = (d.exams || []).filter(function (x) { return !x.subj || x.subj === s.id; }).slice(-1)[0];
      host.appendChild(h('button', { class: 'rh-cont', style: 'background:var(--bad)', 'data-exam': s.id },
        '<span class="play">\u23F1\uFE0F</span><span class="t"><b>Full mock exam \u00b7 ' + examCfg(s).n + ' questions \u00b7 ' + (examCfg(s).min >= 120 ? Math.round(examCfg(s).min / 6) / 10 + ' hr' : examCfg(s).min + ' min') + '</b><span>' + (examCfg(s).pbq ? 'PBQs first, d' : 'D') + 'omains weighted like the real ' + esc(s.exam) + '. ' + (examCfg(s).scaled ? 'Scored 100\u2013900' : 'Scored in %') + (last ? ' \u00b7 last: ' + last.score : '') + '.</span></span>'));
    }
    var dl = d.depth == null ? 1 : d.depth, seg = h('div', { class: 'rh-seg', role: 'group', 'aria-label': 'Detail level' });
    seg.innerHTML = '<span>Detail</span>' + ['Simple', 'Standard', 'Deep'].map(function (n, i) { return '<button data-depth="' + i + '" class="' + (i === dl ? 'on' : '') + '">' + n + '</button>'; }).join('');
    host.appendChild(seg);
    if (genCards(s.id).length) {
      host.appendChild(h('button', { class: 'rh-cont', style: 'background:var(--good)', 'data-drill': s.id },
        '<span class="play">\uD83C\uDFAF</span><span class="t"><b>Practice drill</b><span>10 freshly generated problems. New numbers every time, so you\'re learning the skill, not memorizing answers.</span></span>'));
    }
    s.units.forEach(function (u) {
      var sec = h('div', { class: 'rh-unit' });
      sec.innerHTML = '<div class="rh-unit-h"><h2>' + esc(u.name) + '</h2>' + (u.tag ? '<small>' + esc(u.tag) + '</small>' : '') + '</div>' + (u.blurb ? '<p class="blurb">' + esc(u.blurb) + '</p>' : '');
      u.lessons.forEach(function (l, i) {
        var done = d.done[l.id];
        var b = h('button', { class: 'rh-lesson' + (done ? ' done' : ''), 'data-lesson': l.id });
        b.innerHTML = '<span class="node">' + (done ? '✓' : i + 1) + '</span><span class="t"><b>' + esc(l.title) + '</b><small>' + (l.min || 4) + ' min · ' + l.cards.length + ' cards' + (hasHands(l) ? ' · hands-on' : '') + '</small></span>' +
          (done ? '<span class="rh-stars">' + '★'.repeat(done.stars) + '☆'.repeat(3 - done.stars) + '</span>' : '');
        sec.appendChild(b);
      });
      host.appendChild(sec);
    });
    bind(host);
  }

  function bind(host) {
    host.onclick = function (e) {
      var t = e.target.closest('[data-lesson],[data-subject],[data-home],[data-mix],[data-surprise],[data-unsave],[data-placement],[data-drill],[data-exam],[data-depth]');
      if (!t) return;
      if (t.dataset.unsave) { var d = data(); d.saved = d.saved.filter(function (x) { return x !== t.dataset.unsave; }); A.save(); rerender(); return; }
      if (t.dataset.home) { LV.view = 'home'; rerender(); return; }
      if (t.dataset.subject) { LV.view = 'subject'; LV.subj = t.dataset.subject; rerender(); return; }
      if (t.dataset.lesson) { startLesson(t.dataset.lesson); return; }
      if (t.dataset.mix) { startMixed(t.dataset.mix); return; }
      if (t.dataset.placement) { startPlacement(t.dataset.placement); return; }
      if (t.dataset.drill) { startDrill(t.dataset.drill); return; }
      if (t.dataset.exam) { startExam(t.dataset.exam); return; }
      if (t.dataset.depth) { data().depth = +t.dataset.depth; A.save(); t.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === t); }); A.toast(['Simple: plain-English versions first', 'Standard detail', 'Deep: exam-level extras open automatically'][+t.dataset.depth]); return; }
      if (t.dataset.surprise) {
        var d2 = data(), pool = Object.keys(LESSONS).filter(function (id) { return !d2.done[id]; });
        var all = pool.length ? pool : Object.keys(LESSONS); startLesson(all[Math.floor(Math.random() * all.length)]);
      }
    };
  }

  /* =======================================================================
     PLAYER
     ======================================================================= */
  var P = null, STACK = [], playerEl = null;
  var GRADED = ['gen', 'pbq', 'widget', 'mcq', 'tf', 'fill', 'calc', 'match', 'order', 'bits', 'cipher', 'phish', 'term'];

  function startLesson(id, fromHole) {
    var L = LESSONS[id]; if (!L) return;
    if (P && fromHole) STACK.push(P); else if (!fromHole) STACK.length = 0;
    var d = data(); d.trail = d.trail.filter(function (x) { return x !== id; }).concat(id).slice(-40); A.save();
    var cards = L.l.cards.map(function (c, i) { return { c: c, k: id + '#' + i }; });
    var missing = (L.l.pre || []).filter(function (x) { return LESSONS[x] && !d.done[x]; });
    if (missing.length && !fromHole) cards.unshift({ c: { t: 'prereq', ids: missing }, k: id + '#pre' });
    P = { mode: 'lesson', id: id, title: L.l.title, subj: L.s, cards: cards, i: 0, right: 0, graded: 0, xp: 0, combo: 0, best: 0, t0: Date.now() };
    openPlayer();
  }
  // anti-repetition: prefer questions not served recently, then record what we served
  function pickFresh(pool, n) {
    var recent = data().recent || [];
    var fresh = pool.filter(function (x) { return recent.indexOf(x.k) < 0; });
    var seen = pool.filter(function (x) { return recent.indexOf(x.k) >= 0; });
    var chosen = shuffle(fresh).concat(shuffle(seen)).slice(0, n);
    var d = data(); d.recent = recent.concat(chosen.map(function (x) { return x.k; })).slice(-150); A.save();
    return chosen;
  }

  function startMixed(mode) {
    var pool = [], d = data();
    if (mode === 'review') {
      pool = shuffle(dueReviews()).slice(0, 15).map(function (r) { return { c: cardByKey(r.k).c, k: r.k, review: true }; });
      if (!pool.length) { A.toast('Nothing due right now'); return; }
    } else {
      Object.keys(LESSONS).forEach(function (id) {
        var L = LESSONS[id]; if (mode === 'gauntlet' && L.s.id !== 'secplus') return;
        L.l.cards.forEach(function (c, i) { if (c.t === 'mcq' || c.t === 'tf' || (mode === 'snack' && (c.t === 'fill' || c.t === 'calc' || c.t === 'gen'))) pool.push({ c: c, k: id + '#' + i }); });
      });
      pool = pickFresh(pool, mode === 'gauntlet' ? 25 : 5);
      if (!pool.length) { A.toast('No questions yet'); return; }
    }
    STACK.length = 0;
    P = { mode: mode, id: null, title: { review: 'Review', snack: 'Snack pack', gauntlet: 'Sec+ Gauntlet' }[mode], subj: mode === 'gauntlet' ? SUBJECTS.filter(function (s) { return s.id === 'secplus'; })[0] : null, cards: pool, i: 0, right: 0, graded: 0, xp: 0, combo: 0, best: 0, t0: Date.now() };
    openPlayer();
  }
  function startPlacement(subjId) {
    var s = SUBJECTS.filter(function (x) { return x.id === subjId; })[0]; if (!s || !s.placement) return;
    STACK.length = 0;
    P = { mode: 'placement', subjId: subjId, title: s.name + ' check', subj: s, cards: s.placement.map(function (c, i) { return { c: c, k: 'pl#' + i }; }), i: 0, right: 0, graded: 0, xp: 0, combo: 0, best: 0 };
    openPlayer();
  }

  function startQuiz(subjId, n, onDone) {
    subjId = subjId || 'secplus';
    var pool = [], sj = SUBJECTS.filter(function (x) { return x.id === subjId; })[0];
    Object.keys(LESSONS).forEach(function (id) { var L = LESSONS[id]; if (L.s.id !== subjId) return; L.l.cards.forEach(function (c, i) { if (c.t === 'mcq' || c.t === 'tf' || c.t === 'gen') pool.push({ c: c, k: id + '#' + i }); }); });
    pool = pickFresh(pool, n || 5);
    if (!pool.length) { if (onDone) try { onDone({ correct: 0, total: 0 }); } catch (e) { } return; }
    STACK.length = 0;
    P = { mode: 'quiz', subjId: subjId, id: null, title: (sj ? sj.name : 'Quiz') + ' quiz', subj: sj || null, cards: pool, i: 0, right: 0, graded: 0, xp: 0, combo: 0, best: 0, t0: Date.now(), onDone: onDone };
    openPlayer();
  }

  /* Plain one-tap questions for other tabs (Play > Arena). Only mcq/tf, plus generated problems
     (calc ones become 4-choice). Fresh-first via pickFresh. ids are "<lesson>#<card>" plus "~n" for generated ones. */
  function numChoices(a) {
    a = +a; var dec = Math.round(a) === a ? 0 : (String(a).split('.')[1] || '').length, step = Math.max(1, Math.round(Math.abs(a) * 0.1)), set = {}, out = [];
    function fmt(x) { return dec ? (+x.toFixed(Math.min(dec, 4))).toString() : String(Math.round(x)); }
    set[fmt(a)] = 1; out.push(fmt(a));
    shuffle([a + step, a - step, a + 2 * step, a * 2, a / 2, a + 1, a - 1, a * 10]).forEach(function (x) { var f = fmt(x); if (out.length < 4 && !set[f] && !(a >= 0 && x < 0)) { set[f] = 1; out.push(f); } });
    return out;
  }
  function plainQ(item, n) {
    var c = item.c, L = LESSONS[item.k.split('#')[0]], tag = (/acronym/i.test(c.g || '') || (L && L.l.id === 'sp-acronyms')) ? 'acronym' : (L ? L.u.name : '');
    if (c.t === 'gen') { var f = (window.RH_GEN || {})[c.g]; try { c = f ? f(c.o || {}) : null; } catch (e) { c = null; } if (!c) return null; }
    var base = { id: item.k + (item.c.t === 'gen' ? '~' + n : ''), subj: L ? L.s.id : '', tag: tag, lesson: L ? L.l.title : '', explain: c.why || '' };
    if (c.t === 'mcq') { var ord = c.keep ? c.opts.map(function (_, i) { return i; }) : shuffle(c.opts.map(function (_, i) { return i; })); base.q = c.q; base.choices = ord.map(function (i) { return c.opts[i]; }); base.answer = ord.indexOf(c.a); return base; }
    if (c.t === 'tf') { base.q = c.q; base.choices = ['True', 'False']; base.answer = c.a ? 0 : 1; return base; }
    if (c.t === 'calc') { var ch = numChoices(c.a), o2 = shuffle(ch); base.q = c.q; base.choices = o2; base.answer = o2.indexOf(ch[0]); return base; }
    return null;
  }
  function questions(opts) {
    opts = opts || {}; var subj = opts.subj || 'all', n = opts.n || 10, tags = (opts.tags || []).map(function (t) { return String(t).toLowerCase(); }), ex = {}, pool = [];
    (opts.exclude || []).forEach(function (id) { ex[String(id).split('~')[0]] = 1; });
    Object.keys(LESSONS).forEach(function (id) {
      var L = LESSONS[id]; if (subj !== 'all' && L.s.id !== subj) return;
      L.l.cards.forEach(function (c, i) {
        var k = id + '#' + i; if (ex[k] && c.t !== 'gen') return;
        if (c.t !== 'mcq' && c.t !== 'tf' && c.t !== 'gen') return;
        if (tags.length) { var hay = [L.u.name, L.l.id, L.l.title, c.g || '', /acronym/i.test(c.g || '') || id === 'sp-acronyms' ? 'acronym' : ''].join(' ').toLowerCase(); if (!tags.some(function (t) { return hay.indexOf(t) >= 0; })) return; }
        pool.push({ c: c, k: k });
      });
    });
    var gens = pool.filter(function (x) { return x.c.t === 'gen'; }), chosen = pickFresh(pool, n), out = [], tries = 0;
    // pad with fresh generated problems when the static pool is small (generators never run dry)
    while (chosen.length < n && gens.length) chosen.push(gens[Math.floor(Math.random() * gens.length)]);
    chosen.forEach(function (it) { var q = null; while (!q && tries++ < n * 4) q = plainQ(it, out.length + '' + Date.now() % 1e5); if (q) out.push(q); });
    return out;
  }
  function recordAnswer(id, correct) {
    var k = String(id).split('~')[0]; if (!cardByKey(k)) return false;
    var d = data(), had = d.review.some(function (x) { return x.k === k; });
    if (!correct) reviewMiss(k); else if (had) reviewHit(k);
    A.save(); return true;
  }

  /* Drill: a clearly-labeled practice mode. Every item is freshly generated, so it never repeats exactly. */
  function genCards(subjId) {
    var out = [];
    Object.keys(LESSONS).forEach(function (id) { var L = LESSONS[id]; if (subjId && L.s.id !== subjId) return; L.l.cards.forEach(function (c, i) { if (c.t === 'gen') out.push({ c: c, k: id + '#' + i }); }); });
    return out;
  }
  function startDrill(subjId) {
    var gs = genCards(subjId); if (!gs.length) { A.toast('No practice generators here yet'); return; }
    var sj = SUBJECTS.filter(function (x) { return x.id === subjId; })[0], cards = [], bag = [];
    while (cards.length < 10) { if (!bag.length) bag = shuffle(gs.slice()); cards.push(bag.pop()); }
    STACK.length = 0;
    P = { mode: 'drill', subjId: subjId, id: null, title: (sj ? sj.name : '') + ' drill', subj: sj || null, cards: cards, i: 0, right: 0, graded: 0, xp: 0, combo: 0, best: 0, t0: Date.now() };
    openPlayer();
  }

  /* Timed mock exam: real SY0-701 shape. PBQs first, then multiple choice weighted by domain, 90 min, scaled 100-900, 750 passes. */
  var EXAM_W = { 1: 12, 2: 22, 3: 18, 4: 28, 5: 20 };
  // Per-subject exam shape. Security+ is the default; other subjects set s.examCfg (byUnit = weight by unit position).
  var SECPLUS_CFG = { n: 90, min: 90, pbq: 4, w: EXAM_W, scaled: true, pass: 750, names: { 1: 'General security concepts', 2: 'Threats, vulns & mitigations', 3: 'Security architecture', 4: 'Security operations', 5: 'Program management' } };
  function examCfg(sj) { return (sj && sj.examCfg) || SECPLUS_CFG; }
  function startExam(subjId) {
    subjId = subjId || 'secplus';
    var sj = SUBJECTS.filter(function (x) { return x.id === subjId; })[0]; if (!sj) return;
    var byDom = {}, pbqs = [], cfg = examCfg(sj);
    Object.keys(LESSONS).forEach(function (id) {
      var L = LESSONS[id]; if (L.s.id !== subjId) return;
      var dom = cfg.byUnit ? sj.units.indexOf(L.u) + 1 : L.u.dom; if (!dom || !cfg.w[dom]) return;
      L.l.cards.forEach(function (c, i) {
        var it = { c: c, k: id + '#' + i, dom: dom };
        if (c.t === 'pbq') pbqs.push(it); else if (c.t === 'mcq' || c.t === 'tf' || c.t === 'gen' || (cfg.calc && c.t === 'calc')) (byDom[dom] = byDom[dom] || []).push(it);
      });
    });
    var cards = shuffle(pbqs).slice(0, cfg.pbq || 0), npbq = cards.length, want = cfg.n - cards.length;
    Object.keys(cfg.w).forEach(function (dm) {
      var pool = byDom[dm] || [], n = Math.round(want * cfg.w[dm] / 100), got = pickFresh(pool, n);
      var gp = pool.filter(function (x) { return x.c.t === 'gen'; });
      // pad with fresh generated problems (never repeats exactly); fall back to static repeats only if a domain has no generators
      while (got.length < n && pool.length && (gp.length || got.length < pool.length * 2)) got.push(pick(gp.length ? gp : pool));
      cards = cards.concat(shuffle(got));
    });
    if (cards.length < 10) { A.toast('Not enough questions yet'); return; }
    cards = cards.slice(0, npbq).concat(shuffle(cards.slice(npbq)));
    STACK.length = 0;
    P = { mode: 'exam', subjId: subjId, id: null, title: sj.name + ' mock exam', subj: sj, cards: cards, i: 0, right: 0, graded: 0, xp: 0, combo: 0, best: 0, t0: Date.now(), deadline: Date.now() + cfg.min * 60000, dom: {}, cfg: cfg };
    openPlayer();
  }
  var examTick = null;
  function tickExam() {
    if (!P || P.mode !== 'exam') { clearInterval(examTick); examTick = null; return; }
    var left = Math.max(0, P.deadline - Date.now()), el = playerEl && playerEl.querySelector('#rhTimer');
    if (el) { el.textContent = Math.floor(left / 60000) + ':' + ('0' + Math.floor(left % 60000 / 1000)).slice(-2); el.style.color = left < 300000 ? 'var(--bad)' : ''; }
    if (!left && P.i < P.cards.length) { P.i = P.cards.length; A.toast('Time! Exam submitted.'); renderCard(); }
  }

  function openPlayer() {
    if (!playerEl) { playerEl = h('div', { class: 'rh-player', role: 'dialog', 'aria-modal': 'true' }); document.body.appendChild(playerEl); }
    playerEl.hidden = false; document.documentElement.style.overflow = 'hidden';
    playerEl.classList.toggle('exam', P.mode === 'exam');
    if (P.mode === 'exam' && !examTick) examTick = setInterval(tickExam, 1000);
    renderCard();
  }
  function closePlayer() { stopSpeak(); if (examTick) { clearInterval(examTick); examTick = null; } P = null; STACK.length = 0; if (playerEl) { playerEl.hidden = true; playerEl.innerHTML = ''; } document.documentElement.style.overflow = ''; rerender(); }

  /* ---- audio mode: free, offline browser text-to-speech ---- */
  var TTS = ('speechSynthesis' in window);
  function stopSpeak() { try { if (TTS) window.speechSynthesis.cancel(); } catch (e) { } }
  function speakCard(card) {
    if (!TTS || !card) return; stopSpeak();
    var clone = card.cloneNode(true);
    clone.querySelectorAll('button.rh-btn, button.rh-link, .rh-seg2, .rh-opts, .rh-tf, .rh-match, .rh-slots, .rh-pool, .rh-bits, .rh-readout, .rh-term, .rh-lab, .rh-bars, .rh-pm-paths, .rh-email, .rh-kind, svg, input, form, pre').forEach(function (x) { x.remove(); });
    var text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    var sl = P && P.subj && P.subj.speakLang;
    if (sl) {
      // language lessons: bold/italic words are target-language, read with that voice; the rest in the default voice
      var parts = [], walk = function (n, foreign) {
        if (n.nodeType === 3) { var t = n.textContent.replace(/\s+/g, ' '); if (t.trim()) { var last = parts[parts.length - 1]; if (last && last.f === foreign) last.t += t; else parts.push({ t: t, f: foreign }); } return; }
        if (n.nodeType !== 1) return; var f = foreign || /^(B|I|EM|STRONG)$/.test(n.tagName);
        for (var c = n.firstChild; c; c = c.nextSibling) walk(c, f);
      };
      walk(clone, false);
      try { parts.forEach(function (p) { var u = new SpeechSynthesisUtterance(p.t.trim()); if (p.f) { u.lang = sl; u.rate = 0.9; } window.speechSynthesis.speak(u); }); } catch (e) { }
      return;
    }
    try { var u = new SpeechSynthesisUtterance(text); u.rate = 1; u.pitch = 1; window.speechSynthesis.speak(u); } catch (e) { }
  }

  function playerFrame() {
    var depth = STACK.length;
    var crumbs = STACK.map(function (p) { return esc(p.title); }).concat('<b>' + esc(P.title) + '</b>').join(' <span>›</span> ');
    playerEl.innerHTML =
      '<div class="pad rh-ptop"><button class="rh-ibtn" id="rhClose" aria-label="Close">' + ICON.x + '</button>' +
      '<div class="bar"><i style="width:' + (P.i / P.cards.length * 100) + '%"></i></div>' +
      (TTS ? '<button class="rh-ibtn" id="rhAudio" aria-label="Listen" style="font-size:17px">' + (data().audio ? '\uD83D\uDD0A' : '\uD83D\uDD08') + '</button>' : '') +
      (P.mode === 'lesson' ? '<button class="rh-ibtn" id="rhSave" aria-label="Save lesson" style="font-size:18px">\u2606</button>' : '') +
      (P.mode === 'exam' ? '<span class="rh-timer" id="rhTimer"></span>' : '<span class="rh-combo" id="rhCombo">' + (P.combo > 1 ? '×' + P.combo : '') + '</span>') + '</div>' +
      '<div class="rh-pbody" id="rhBody"><div class="pad"><div class="rh-crumb">' + (depth ? '<span class="depth">' + depth + ' level' + (depth > 1 ? 's' : '') + ' deep:</span>' : '') + crumbs + '</div><div id="rhCard"></div></div></div>' +
      '<div class="rh-pfoot"><div class="pad" id="rhFoot"></div></div>';
    $('#rhClose', playerEl).onclick = function () { if (STACK.length) climbOut(); else closePlayer(); };
    var sv = $('#rhSave', playerEl);
    if (sv) { if (window.App && window.App.library && P.id) { var ref = P.id; var upd = function () { try { sv.textContent = window.App.library.has('lesson', ref) ? '\u2605' : '\u2606'; } catch (e) { } }; upd(); sv.onclick = function () { try { window.App.library.save({ type: 'lesson', title: P.title, body: (P.subj ? P.subj.name : ''), ref: ref }); upd(); A.toast('Saved to your library'); } catch (e) { } }; } else { sv.style.display = 'none'; } }
    var au = $('#rhAudio', playerEl);
    if (au) { au.onclick = function () { var d = data(); d.audio = !d.audio; A.save(); au.textContent = d.audio ? '\uD83D\uDD0A' : '\uD83D\uDD08'; if (d.audio) { var cd = $('#rhCard', playerEl); speakCard(cd ? cd.querySelector('.rh-card') : null); A.toast('Audio on \u2014 reading each card aloud'); } else stopSpeak(); }; }
  }

  function renderCard() {
    playerFrame();
    if (P.i >= P.cards.length) return renderFinish();
    var item = P.cards[P.i], c = item.c;
    if (P.mode === 'exam') setTimeout(tickExam, 0);
    var cardHost = $('#rhCard', playerEl), foot = $('#rhFoot', playerEl);
    var graded = GRADED.indexOf(c.t) >= 0;
    var cont = h('button', { class: 'rh-btn block', disabled: graded }, P.i === P.cards.length - 1 ? 'Finish' : 'Continue');
    cont.onclick = function () { P.i++; renderCard(); $('#rhBody', playerEl).scrollTop = 0; };
    if (graded && P.mode === 'lesson') { var skip = h('button', { class: 'rh-link' }, 'Skip'); skip.onclick = function () { P.i++; renderCard(); }; foot.appendChild(skip); }
    foot.appendChild(cont);
    var card = h('div', { class: 'rh-card' }); cardHost.appendChild(card);
    if (P.mode !== 'exam' && (item.review || (P.mode !== 'lesson' && P.mode !== 'placement'))) {
      var src = LESSONS[item.k.split('#')[0]];
      if (src) card.appendChild(h('span', { class: 'rh-kind' }, '<i style="background:' + src.s.color + '"></i>' + esc(src.s.name) + ' · ' + esc(src.l.title)));
    }
    (RENDER[c.t] || RENDER.read)(card, c, function (res) {
      if (res && res.graded !== false && graded) grade(item, res.correct);
      cont.disabled = false; setTimeout(function () { try { cont.focus({ preventScroll: true }); } catch (e) { } }, 50);
    });
    bindHoles(card);
    autoDefine(card);
    if (data().audio) speakCard(card);
  }

  function grade(item, correct) {
    P.graded++;
    if (item.dom) { var dd = P.dom[item.dom] = P.dom[item.dom] || [0, 0]; dd[1]++; if (correct) dd[0]++; }
    var cb = $('#rhCombo', playerEl);
    if (correct) {
      P.right++; P.combo++; P.best = Math.max(P.best, P.combo);
      var gain = 10 + Math.min(P.combo - 1, 5) * 2; P.xp += gain; xpPop('+' + gain); beep('good');
      if (item.review) reviewHit(item.k);
      if (cb) { cb.textContent = P.combo > 1 ? '×' + P.combo : ''; cb.classList.add('bump'); setTimeout(function () { cb.classList.remove('bump'); }, 220); }
      if (P.combo === 5 || P.combo === 10) { confetti(22); A.toast(P.combo + ' in a row!'); }
    } else {
      P.combo = 0; beep('bad'); if (P.mode !== 'placement') reviewMiss(item.k); if (cb) cb.textContent = '';
    }
    A.save();
  }

  function awardFinish(stars, acc) {
    var d = data();
    if (P.mode === 'lesson') {
      var prev = d.done[P.id];
      d.done[P.id] = { stars: Math.max(stars, prev ? prev.stars : 0), at: dayStr() };
      d.saved = d.saved.filter(function (x) { return x !== P.id; });
      var stat = P.subj && (P.subj.stat || (P.subj.id === 'mma' ? 'tech' : 'mind')) || 'mind';
      A.award('learn:done:' + P.id, 30, stat);          // one-time per lesson
      A.award('learn:lesson:' + dayStr(), 5, 'discipline'); // small daily "showed up"
    } else if (P.mode === 'gauntlet') {
      d.gauntlet = Math.max(d.gauntlet, P.right);
      A.award('learn:gauntlet:' + dayStr(), P.right >= 21 ? 40 : 15, 'mind');
    } else if (P.mode === 'snack') {
      A.award('learn:snack:' + dayStr(), 10, 'mind');
    } else if (P.mode === 'review') {
      A.award('learn:review:' + dayStr(), 15, 'mind');
    } else if (P.mode === 'exam') {
      var ec = P.cfg || SECPLUS_CFG, ac0 = P.graded ? P.right / P.graded : 0, sc = ec.scaled ? Math.round(100 + 800 * ac0) : Math.round(ac0 * 100);
      d.exams = (d.exams || []).concat({ at: dayStr(), score: sc, n: P.graded, subj: P.subjId, scale: ec.scaled ? '100-900' : 'pct' }).slice(-20);
      A.award('learn:exam:' + P.subjId + ':' + dayStr(), sc >= ec.pass ? 80 : 40, 'mind');
    } else if (P.mode === 'drill') {
      A.award('learn:drill:' + P.subjId + ':' + dayStr(), 10, (P.subj && P.subj.stat) || 'mind');
    } else if (P.mode === 'quiz') {
      A.award('learn:quiz:' + P.subjId + ':' + dayStr(), 15, (P.subj && P.subj.stat) || 'mind');
    } else if (P.mode === 'placement') {
      d.placement[P.subjId] = { level: P.right <= 1 ? 'fresh start' : P.right <= 3 ? 'some of it stuck' : 'mostly remembered', at: dayStr() };
    }
    A.save();
  }

  function renderFinish() {
    var acc = P.graded ? P.right / P.graded : 1;
    var stars = acc >= .9 ? 3 : acc >= .6 ? 2 : 1;
    awardFinish(stars, acc);
    if (P.onDone) { try { P.onDone({ correct: P.right, total: P.graded }); } catch (e) { } }
    beep('win'); confetti(stars === 3 ? 65 : 32);
    $('.bar > i', playerEl).style.width = '100%';
    var cardHost = $('#rhCard', playerEl), foot = $('#rhFoot', playerEl); foot.innerHTML = '';
    var L = P.id ? LESSONS[P.id] : null;
    var holes = L && L.l.links ? L.l.links.filter(function (id) { return LESSONS[id]; }) : [];
    var nextInUnit = L ? L.u.lessons[L.idx + 1] : null;
    var mins = P.t0 ? Math.max(1, Math.round((Date.now() - P.t0) / 60000)) : null;

    if (P.mode === 'exam') {
      clearInterval(examTick); examTick = null; playerEl.classList.remove('exam');
      var ec2 = P.cfg || SECPLUS_CFG, score = ec2.scaled ? Math.round(100 + 800 * acc) : Math.round(acc * 100), passed = score >= ec2.pass, DN = ec2.names;
      cardHost.innerHTML = '<div class="rh-card" style="gap:14px"><div style="text-align:center"><div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:800" class="muted">' + (ec2.scaled ? 'Scaled score (estimate)' : 'Percent correct') + '</div>' +
        '<div style="font-family:var(--disp);font-size:54px;color:' + (passed ? 'var(--good)' : 'var(--bad)') + '">' + score + (ec2.scaled ? '' : '%') + '</div><p class="muted" style="margin:0">' + (ec2.scaled ? (passed ? 'Passing range. The real exam needs 750 of 900.' : 'The real exam needs 750 of 900. Your misses went into Review.') : (passed ? 'At or above your ' + ec2.pass + '% practice target. ' + (ec2.note || '') : 'Below your ' + ec2.pass + '% practice target. Your misses went into Review. ' + (ec2.note || ''))) + ' ' + P.right + '/' + P.graded + ' answered right' + (P.graded < P.cards.length ? ', ' + (P.cards.length - P.graded) + ' unanswered' : '') + (mins ? ', ' + mins + ' min' : '') + '.</p></div>' +
        Object.keys(DN).map(function (k) { var v = P.dom[k] || [0, 0], pc = v[1] ? Math.round(v[0] / v[1] * 100) : 0; return '<div><div style="display:flex;justify-content:space-between;font-size:14px"><b>' + k + '.0 ' + DN[k] + '</b><span>' + v[0] + '/' + v[1] + '</span></div><div class="rh-bar"><i style="width:' + pc + '%;background:' + (pc >= 80 ? 'var(--good)' : pc >= 60 ? 'var(--accent)' : 'var(--bad)') + '"></i></div></div>'; }).join('') +
        '<p class="muted" style="margin:0;font-size:13px">Weakest domain first: go back to its lessons, then run Review before the next mock.</p></div>';
      var dn = h('button', { class: 'rh-btn block' }, 'Done'); dn.onclick = closePlayer; foot.appendChild(dn); return;
    }
    if (P.mode === 'placement') {
      var msg = data().placement[P.subjId];
      cardHost.innerHTML = '<div class="rh-card" style="text-align:center;align-items:center;gap:16px">' +
        '<div style="font-size:40px">🧭</div><h2 style="font-size:28px">You\'re set</h2>' +
        '<p class="muted" style="margin:0">Looks like <b>' + esc(msg.level) + '</b>. That just tells the app where to nudge you — you can do any lesson, any time. Nothing here is a grade.</p></div>';
      var go = h('button', { class: 'rh-btn block' }, 'See the lessons'); go.onclick = closePlayer; foot.appendChild(go); return;
    }

    var head = { lesson: 'Lesson done', snack: 'Snack eaten', review: 'Review done', quiz: P.right + ' / ' + P.cards.length, drill: P.right + ' / ' + P.cards.length, gauntlet: P.right + ' / ' + P.cards.length }[P.mode] || 'Done';
    var pass = P.mode === 'gauntlet' ? (P.right >= 21 ? 'That\'s passing territory (the real exam needs ~83%).' : 'The real exam needs ~83%. Run it again tomorrow.') : '';
    cardHost.innerHTML = '<div class="rh-card" style="text-align:center;align-items:center;gap:16px">' +
      '<div style="font-size:40px;color:var(--accent);letter-spacing:5px">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' +
      '<h2 style="font-size:30px">' + head + '</h2>' + (pass ? '<p class="muted" style="margin:0">' + pass + '</p>' : '') +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%">' +
      stat('+' + P.xp, 'XP earned') + stat(Math.round(acc * 100) + '%', 'accuracy') + stat(mins ? mins + 'm' : '×' + P.best, mins ? 'time' : 'best combo') + '</div>' +
      (P.graded - P.right > 0 ? '<p class="muted" style="margin:0;font-size:14px">' + (P.graded - P.right) + ' miss' + (P.graded - P.right > 1 ? 'es' : '') + ' went into Review — back tomorrow.</p>' : '') +
      (holes.length ? '<div style="width:100%;display:flex;flex-direction:column;gap:8px;text-align:left"><span class="eyebrow">Rabbit holes from here</span>' +
        holes.map(function (id) { return '<button class="rh-saved-item" data-dive="' + id + '" style="cursor:pointer">🐇<span class="t"><b>' + esc(LESSONS[id].l.title) + '</b><small>' + esc(LESSONS[id].s.name) + (data().done[id] ? ' · done' : '') + '</small></span></button>'; }).join('') + '</div>' : '') +
      '</div>';
    cardHost.querySelectorAll('[data-dive]').forEach(function (b) { b.onclick = function () { startLesson(b.dataset.dive, false); }; });

    if (STACK.length) {
      var up = h('button', { class: 'rh-btn block hole' }, 'Climb back to ' + esc(STACK[STACK.length - 1].title)); up.onclick = climbOut; foot.appendChild(up);
    } else {
      var done = h('button', { class: 'rh-btn ghost' }, 'Done'); done.onclick = closePlayer; foot.appendChild(done);
      if (nextInUnit) { var nx = h('button', { class: 'rh-btn block' }, 'Next: ' + esc(nextInUnit.title)); nx.onclick = function () { startLesson(nextInUnit.id); }; foot.appendChild(nx); }
      else if (['snack', 'gauntlet', 'review', 'drill'].indexOf(P.mode) >= 0) { var mode = P.mode, dsj = P.subjId, again = h('button', { class: 'rh-btn block' }, mode === 'drill' ? 'New set' : 'Go again'); again.onclick = function () { if (mode === 'drill') startDrill(dsj); else startMixed(mode); }; foot.appendChild(again); }
    }
  }
  function stat(b, s) { return '<div style="background:var(--surface-2);border-radius:13px;padding:10px"><b style="display:block;font-family:var(--disp);font-size:22px">' + b + '</b><small class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.07em;font-weight:700">' + s + '</small></div>'; }

  function climbOut() { P = STACK.pop(); A.toast('Back in ' + P.title); renderCard(); }

  /* ---- rabbit-hole links ---- */
  function bindHoles(root) {
    root.querySelectorAll('[data-hole]').forEach(function (a) {
      a.setAttribute('role', 'button'); a.setAttribute('tabindex', '0');
      var open = function () { holeSheet(a.dataset.hole); };
      a.addEventListener('click', open); a.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
  }
  function holeSheet(id) {
    var L = LESSONS[id]; if (!L) return;
    var scrim = h('div', { class: 'rh-scrim' });
    scrim.innerHTML = '<div class="rh-sheet" role="dialog" aria-label="Rabbit hole"><span class="eyebrow" style="color:var(--hole)">Rabbit hole · ' + esc(L.s.name) + '</span>' +
      '<h3>' + esc(L.l.title) + '</h3><p>' + esc(L.l.teaser || ('A ' + (L.l.min || 4) + '-minute detour. Your place is saved, so you can climb back out when you\'re done.')) + '</p>' +
      '<div class="row"><button class="rh-btn block hole" id="rhDive">Dive in now</button><button class="rh-btn ghost" id="rhLater">Save for later</button></div><button class="rh-link" id="rhNah">Not now</button></div>';
    document.body.appendChild(scrim);
    var close = function () { scrim.remove(); };
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
    $('#rhNah', scrim).onclick = close;
    $('#rhLater', scrim).onclick = function () { var d = data(); if (d.saved.indexOf(id) < 0) d.saved.push(id); A.save(); close(); A.toast('Saved. Find it on the Learn home.'); };
    $('#rhDive', scrim).onclick = function () { close(); startLesson(id, true); };
  }

  /* =======================================================================
     CARD RENDERERS
     ======================================================================= */
  var KIND = {
    read: ['', 'Learn'], mcq: ['', 'Quick check'], tf: ['', 'True or false'], fill: ['', 'Recall'], calc: ['', 'Work it out'],
    match: ['hands', 'Match up'], order: ['hands', 'Put in order'], term: ['hands', 'Terminal'], bits: ['hands', 'Flip the bits'],
    cipher: ['hands', 'Crack it'], hashlab: ['hands', 'Lab · hashing'], pwlab: ['hands', 'Lab · passwords'], cidr: ['hands', 'Lab · subnets'],
    gatelab: ['hands', 'Lab · logic gates'], sortlab: ['hands', 'Lab · sorting'], phish: ['hands', 'Spot the phish'], pbq: ['hands', 'PBQ \u00b7 performance-based'], explain: ['', 'Explain it back'], watch: ['', 'Video'], prereq: ['', 'Before you start'], widget: ['hands', 'Interactive'], posmap: ['hands', 'Position map'], compass: ['hands', 'Career compass'], deep: ['holek', 'Rabbit hole']
  };
  function kindTag(el, t) { var k = KIND[t] || KIND.read; el.appendChild(h('span', { class: 'rh-kind ' + k[0] }, '<i></i>' + k[1])); }
  function why(el, ok, text, extra) {
    if (P && P.mode === 'exam') { el.appendChild(h('div', { class: 'rh-why', role: 'status' }, '<b>Answer locked in.</b> Results at the end, like the real exam.')); return; }
    var w = h('div', { class: 'rh-why ' + (ok ? 'good' : 'bad'), role: 'status' }, '<b>' + (ok ? pick(['Nice.', 'Yes.', 'Correct.', 'Got it.', 'Nailed it.']) : 'Not quite.') + '</b>' + (extra ? extra + ' ' : '') + (text || ''));
    el.appendChild(w); bindHoles(w); autoDefine(w); setTimeout(function () { w.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 30);
  }

  var MESSER = 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/';
  var RENDER = {
    pbq: function (el, c, done) {
      kindTag(el, 'pbq'); if (c.h) el.appendChild(h('h3', {}, c.h));
      el.appendChild(h('div', { class: 'rh-body' }, c.scenario || ''));
      var tbl = h('div', { class: 'rh-pbq' });
      var sels = c.rows.map(function (r) {
        var row = h('div', { class: 'rh-pbq-row' }); row.appendChild(h('div', { class: 'lbl' }, r.label));
        var sel = h('select', { class: 'rh-sel', 'aria-label': 'Answer' }); sel.appendChild(h('option', { value: '' }, 'Choose\u2026'));
        (r.opts || c.opts).forEach(function (o, j) { sel.appendChild(h('option', { value: String(j) }, o)); });
        row.appendChild(sel); tbl.appendChild(row); return sel;
      });
      el.appendChild(tbl);
      var b = h('button', { class: 'rh-btn sm', style: 'align-self:flex-start' }, 'Submit'); el.appendChild(b);
      b.onclick = function () {
        if (sels.some(function (x) { return x.value === ''; })) { A.toast('Answer every row first'); return; }
        var right = 0, exam = P && P.mode === 'exam';
        sels.forEach(function (x, i) {
          var r = c.rows[i], ok = +x.value === r.a; if (ok) right++; x.disabled = true;
          if (!exam) { x.classList.add(ok ? 'right' : 'wrong'); if (!ok) x.parentNode.appendChild(h('small', { class: 'rh-pbq-fix' }, '\u2713 ' + esc((r.opts || c.opts)[r.a]) + (r.why ? ': ' + r.why : ''))); }
        });
        b.remove(); var all = right === sels.length;
        why(el, all, '<b>' + right + ' of ' + sels.length + ' rows right.</b> ' + (c.why || '')); done({ correct: all });
      };
    },
    explain: function (el, c, done) {
      kindTag(el, 'explain'); el.appendChild(h('div', { class: 'rh-q' }, c.q));
      el.appendChild(h('p', { class: 'muted', style: 'margin:0;font-size:14px' }, 'Teach it like you\'re explaining to a friend. Typing or dictating it is the fastest way to find the gaps in what you know.'));
      var ta = h('textarea', { class: 'rh-ta', rows: '5', placeholder: 'Your explanation\u2026', 'aria-label': 'Your explanation' }); el.appendChild(ta);
      var row = h('div', { class: 'rh-depthbar' }), chk = h('button', { class: 'rh-btn sm' }, 'Check myself'), cp = h('button', { class: 'rh-btn sm ghost' }, 'Copy for AI grading');
      row.appendChild(chk); row.appendChild(cp); el.appendChild(row);
      var fired = false; function fin() { if (!fired) { fired = true; done({ graded: false }); } }
      chk.onclick = function () {
        chk.remove(); var box = h('div', { class: 'rh-callout' }, '<b>Did you cover these?</b> Tap each one you hit.'), got = 0;
        c.points.forEach(function (pt) { var lb = h('label', { class: 'rh-pt' }, '<input type="checkbox"> ' + pt); lb.querySelector('input').onchange = function (e) { got += e.target.checked ? 1 : -1; tally.textContent = got + ' of ' + c.points.length + (got === c.points.length ? '. You own this one.' : '. Read the ones you missed out loud once.'); }; box.appendChild(lb); });
        var tally = h('div', { class: 'muted', style: 'font-size:14px;margin-top:6px' }, '0 of ' + c.points.length); box.appendChild(tally);
        el.appendChild(box); autoDefine(box); fin();
      };
      cp.onclick = function () {
        var txt = 'You are grading my explanation of a ' + ((P && P.subj && P.subj.name) || '') + ' concept. Be encouraging but strict and specific.\n\nQuestion: ' + c.q.replace(/<[^>]+>/g, '') + '\n\nKey points a complete answer covers:\n- ' + c.points.map(function (x) { return x.replace(/<[^>]+>/g, ''); }).join('\n- ') + '\n\nMy explanation:\n' + (ta.value.trim() || '(I did not type one yet. Quiz me on it instead.)') + '\n\nGive me: (1) a score out of 10, (2) anything I got wrong, (3) which key points I missed, (4) a short model answer in plain English, (5) one follow-up question to test me.';
        var ok = function () { A.toast('Copied. Paste it into Claude or ChatGPT.'); };
        try { navigator.clipboard.writeText(txt).then(ok, function () { ta.value = txt; ta.select(); A.toast('Select all and copy'); }); } catch (e) { ta.value = txt; ta.select(); }
        fin();
      };
    },
    watch: function (el, c, done) {
      kindTag(el, 'watch'); el.appendChild(h('h3', {}, 'Watch the matching video'));
      el.appendChild(h('div', { class: 'rh-body' }, '<p>Professor Messer\'s free SY0-701 course, section <b>' + esc(c.obj) + ' ' + esc(c.title) + '</b>. Watch it after this lesson. Seeing it explained a second way, by a different voice, is how it sticks.</p>'));
      el.appendChild(h('a', { class: 'rh-btn sm', href: c.url || MESSER, target: '_blank', rel: 'noopener', style: 'align-self:flex-start;text-decoration:none' }, 'Open the video list \u2197'));
      done({ graded: false });
    },
    prereq: function (el, c, done) {
      kindTag(el, 'prereq'); el.appendChild(h('h3', {}, 'This builds on'));
      el.appendChild(h('p', { class: 'muted', style: 'margin:0' }, 'You haven\'t done these yet. Tap one for a quick look and you\'ll come right back, or just keep going if you already know it.'));
      c.ids.forEach(function (id) { el.appendChild(h('button', { class: 'rh-holelink', 'data-hole': id, style: 'align-self:flex-start;text-align:left' }, '\uD83D\uDC07 ' + esc(LESSONS[id].l.title) + ' \u2192')); });
      done({ graded: false });
    },
    /* art: original fight illustration from the shell (window.FightArt.pose). Skipped quietly if unavailable. */
    art: function (el, c, done) {
      var F = window.FightArt, svg = null; try { svg = F && F.pose ? F.pose(c.pose, c.o || {}) : null; } catch (e) { svg = null; }
      if (!svg) { RENDER.read(el, { h: c.h || 'Picture it', body: c.fallback || '<p>Picture the position described in this lesson.</p>' }, done); return; }
      kindTag(el, 'read'); if (c.h) el.appendChild(h('h3', {}, c.h));
      var box = h('div', { class: 'rh-art' }); if (typeof svg === 'string') box.innerHTML = svg; else box.appendChild(svg); el.appendChild(box);
      if (c.cap) el.appendChild(h('p', { class: 'muted', style: 'margin:0;font-size:15px' }, c.cap));
      done({ graded: false });
    },
    widget: function (el, c, done) {
      var W = window.App && window.App.widgets && window.App.widgets[c.w];
      if (!W || !W.mount) { RENDER.read(el, { h: c.h || 'Interactive', body: c.fallback || '<p>This interactive is coming in an app update. Keep going for now.</p>' }, function () { done({ graded: false }); }); return; }
      kindTag(el, 'widget'); if (c.h) el.appendChild(h('h3', {}, c.h));
      var box = h('div', { class: 'rh-widget' }); el.appendChild(box);
      try { W.mount(box, c.o || {}, function (res) { done(res || { graded: false }); }); } catch (e) { done({ graded: false }); }
    },
    /* gen: calls a registered generator (window.RH_GEN[name]) for a brand-new problem each time it shows up */
    gen: function (el, c, done) {
      var f = (window.RH_GEN || {})[c.g], made = null;
      try { made = f ? f(c.o || {}) : null; } catch (e) { made = null; }
      if (!made || !RENDER[made.t]) { RENDER.read(el, { h: 'Practice', body: '<p>This practice problem could not load.</p>' }, function () { done({ graded: false }); }); return; }
      RENDER[made.t](el, made, done);
      el.appendChild(h('small', { class: 'muted', style: 'display:block;margin-top:8px;font-size:12px' }, '\u267B\uFE0F Fresh problem: different numbers every time you see this.'));
    },
    read: function (el, c, done) {
      kindTag(el, 'read'); if (c.h) el.appendChild(h('h3', {}, c.h));
      var dl = data().depth == null ? 1 : data().depth;
      var body = h('div', { class: 'rh-body' }, dl === 0 && c.simple ? c.simple : c.body); el.appendChild(body);
      if (c.simple || c.deeper) {
        var bar = h('div', { class: 'rh-depthbar' }), simpleOn = dl === 0 && !!c.simple;
        if (c.simple) { var sb = h('button', { class: 'rh-chipbtn' }, simpleOn ? 'Full version' : 'Explain simpler'); sb.onclick = function () { simpleOn = !simpleOn; body.innerHTML = simpleOn ? c.simple : c.body; sb.textContent = simpleOn ? 'Full version' : 'Explain simpler'; autoDefine(body); bindHoles(body); }; bar.appendChild(sb); }
        if (c.deeper) {
          var dp = h('div', { class: 'rh-body rh-deeper', hidden: dl !== 2 }, '<span class="eyebrow">Deeper \u00b7 exam level</span>' + c.deeper);
          var db = h('button', { class: 'rh-chipbtn' }, dl === 2 ? 'Hide deeper' : 'Go deeper');
          db.onclick = function () { dp.hidden = !dp.hidden; db.textContent = dp.hidden ? 'Go deeper' : 'Hide deeper'; if (!dp.hidden) { autoDefine(dp); bindHoles(dp); } };
          bar.appendChild(db); el.appendChild(bar); el.appendChild(dp);
        } else el.appendChild(bar);
      }
      if (c.mem) el.appendChild(h('div', { class: 'rh-callout mem' }, '<b>Remember it: </b>' + c.mem));
      done({ graded: false });
    },
    deep: function (el, c, done) {
      var box = h('div', { class: 'rh-callout', style: 'border:2px dashed color-mix(in srgb,var(--hole) 55%,var(--line));background:var(--hole-bg);display:flex;flex-direction:column;gap:12px' });
      kindTag(box, 'deep'); box.appendChild(h('h3', {}, c.h));
      if (c.teaser) box.appendChild(h('p', { style: 'margin:0' }, c.teaser));
      var more = h('div', { class: 'rh-body', hidden: true }, c.body);
      var btn = h('button', { class: 'rh-btn sm hole', style: 'align-self:flex-start' }, 'Go deeper');
      btn.onclick = function () { more.hidden = false; btn.remove(); bindHoles(more); };
      box.appendChild(btn); box.appendChild(more);
      if (c.hole && LESSONS[c.hole]) box.appendChild(h('button', { class: 'rh-holelink', 'data-hole': c.hole, style: 'align-self:flex-start;text-align:left' }, 'Full lesson: ' + esc(LESSONS[c.hole].l.title) + ' →'));
      el.appendChild(box); done({ graded: false });
    },
    compass: function (el, c, done) {
      kindTag(el, 'compass');
      el.appendChild(h('div', { class: 'rh-q' }, c.q || 'How much does each sound like you?'));
      var scores = {}; Object.keys(c.roles).forEach(function (k) { scores[k] = 0; });
      var answered = 0, list = h('div', { style: 'display:flex;flex-direction:column;gap:10px' });
      c.items.forEach(function (it) {
        var rowc = h('div', { class: 'rh-callout', style: 'display:flex;flex-direction:column;gap:8px' });
        rowc.appendChild(h('div', {}, esc(it.text)));
        var seg = h('div', { class: 'rh-seg2' });
        [['\uD83D\uDC4D Me', 2], ['\uD83E\uDD37 Kinda', 1], ['\uD83D\uDC4E Not me', 0]].forEach(function (opt) {
          var b = h('button', {}, opt[0]);
          b.onclick = function () {
            if (rowc.dataset.a) { it.roles.forEach(function (r) { scores[r] -= +rowc.dataset.v; }); } else { answered++; }
            rowc.dataset.a = 1; rowc.dataset.v = opt[1];
            [].forEach.call(seg.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
            b.setAttribute('aria-pressed', 'true');
            it.roles.forEach(function (r) { scores[r] += opt[1]; });
            go.disabled = answered < c.items.length;
          };
          seg.appendChild(b);
        });
        rowc.appendChild(seg); list.appendChild(rowc);
      });
      el.appendChild(list);
      var go = h('button', { class: 'rh-btn block', disabled: true, style: 'margin-top:4px' }, 'Show my matches');
      go.onclick = function () {
        go.remove();
        var ranked = Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; });
        var top = ranked.slice(0, 3).filter(function (r) { return scores[r] > 0; });
        if (!top.length) top = ranked.slice(0, 2);
        var res = h('div', { style: 'display:flex;flex-direction:column;gap:10px;margin-top:6px' });
        res.appendChild(h('div', { class: 'eyebrow' }, 'Your top matches \u2014 tap to explore and try the job'));
        top.forEach(function (r, n) {
          var role = c.roles[r];
          res.appendChild(h('button', { class: 'rh-saved-item', style: 'cursor:pointer', 'data-hole': role.hole }, (n === 0 ? '\u2b50 ' : '\uD83E\uDDED ') + '<span class="t"><b>' + esc(role.name) + '</b><small>' + (n === 0 ? 'Strongest fit' : 'Also worth trying') + '</small></span>'));
        });
        el.appendChild(res); bindHoles(res);
        why(el, true, c.why || '', '');
        done({ graded: false });
      };
      el.appendChild(go);
    },
    mcq: function (el, c, done) {
      kindTag(el, 'mcq'); el.appendChild(h('div', { class: 'rh-q' }, c.q));
      var opts = h('div', { class: 'rh-opts' }), order = c.keep ? c.opts.map(function (_, i) { return i; }) : shuffle(c.opts.map(function (_, i) { return i; })), locked = false;
      order.forEach(function (i) {
        var b = h('button', { class: 'rh-opt' }, c.opts[i]);
        b.onclick = function () {
          if (locked) return; locked = true; var ok = i === c.a; b.classList.add(ok ? 'right' : 'wrong', 'picked');
          if (!ok) opts.children[order.indexOf(c.a)].classList.add('right');
          [].forEach.call(opts.children, function (x) { x.disabled = true; });
          why(el, ok, c.why); done({ correct: ok });
        };
        opts.appendChild(b);
      });
      el.appendChild(opts);
    },
    tf: function (el, c, done) {
      kindTag(el, 'tf'); el.appendChild(h('div', { class: 'rh-q' }, c.q));
      var row = h('div', { class: 'rh-tf' });
      [true, false].forEach(function (v) {
        var b = h('button', { class: 'rh-opt' }, v ? 'True' : 'False');
        b.onclick = function () {
          if (row.dataset.l) return; row.dataset.l = 1; var ok = v === c.a; b.classList.add(ok ? 'right' : 'wrong', 'picked');
          if (!ok) row.children[c.a ? 0 : 1].classList.add('right');
          [].forEach.call(row.children, function (x) { x.disabled = true; }); why(el, ok, c.why); done({ correct: ok });
        };
        row.appendChild(b);
      });
      el.appendChild(row);
    },
    fill: function (el, c, done) { inputCard(el, c, done, 'fill'); },
    calc: function (el, c, done) { inputCard(el, c, done, 'calc'); },
    match: function (el, c, done) {
      kindTag(el, 'match'); el.appendChild(h('div', { class: 'rh-q' }, c.q || 'Tap one on the left, then its match on the right.'));
      var grid = h('div', { class: 'rh-match' }), L = h('div', { class: 'col' }), R = h('div', { class: 'col' });
      var idx = c.pairs.map(function (_, i) { return i; }), sel = null, left = c.pairs.length, miss = 0;
      shuffle(idx).forEach(function (i) { var b = h('button', { class: 'rh-chip2' }, c.pairs[i][0]); b.dataset.i = i; L.appendChild(b); });
      shuffle(idx).forEach(function (i) { var b = h('button', { class: 'rh-chip2' }, c.pairs[i][1]); b.dataset.i = i; R.appendChild(b); });
      L.onclick = function (e) { var b = e.target.closest('.rh-chip2'); if (!b || b.classList.contains('done')) return; L.querySelectorAll('.sel').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); sel = b; };
      R.onclick = function (e) {
        var b = e.target.closest('.rh-chip2'); if (!b || b.classList.contains('done') || !sel) return;
        if (b.dataset.i === sel.dataset.i) {
          b.classList.add('done'); sel.classList.add('done'); sel.classList.remove('sel'); sel.disabled = b.disabled = true; sel = null; left--; beep('good');
          if (!left) { var ok = miss <= 1; why(el, ok, c.why || '', ok ? 'All matched.' : 'All matched, with ' + miss + ' wrong tries.'); done({ correct: ok }); }
        } else { miss++; b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 400); }
      };
      grid.appendChild(L); grid.appendChild(R); el.appendChild(grid);
    },
    order: function (el, c, done) {
      kindTag(el, 'order'); el.appendChild(h('div', { class: 'rh-q' }, c.q));
      var slots = h('div', { class: 'rh-slots' }), pool = h('div', { class: 'rh-pool' }), check = h('button', { class: 'rh-btn sm', disabled: true, style: 'align-self:flex-start' }, 'Check order'), picked = [];
      var poolOrder = shuffle(c.items.map(function (_, i) { return i; })); if (poolOrder.every(function (v, i) { return v === i; })) poolOrder.reverse();
      function paint() {
        slots.innerHTML = ''; pool.innerHTML = '';
        picked.forEach(function (i, n) { var b = h('button', { class: 'rh-chip2', 'data-n': n + 1 }, c.items[i]); b.onclick = function () { if (el.dataset.l) return; picked.splice(n, 1); paint(); }; slots.appendChild(b); });
        poolOrder.filter(function (i) { return picked.indexOf(i) < 0; }).forEach(function (i) { var b = h('button', { class: 'rh-chip2' }, c.items[i]); b.onclick = function () { picked.push(i); paint(); }; pool.appendChild(b); });
        check.disabled = picked.length !== c.items.length;
      }
      check.onclick = function () {
        el.dataset.l = 1; check.remove(); var ok = picked.every(function (v, i) { return v === i; });
        [].forEach.call(slots.children, function (b, n) { b.classList.add(picked[n] === n ? 'done' : 'wrong'); });
        why(el, ok, c.why || '', ok ? '' : 'Correct order: ' + c.items.map(function (x, i) { return (i + 1) + '. ' + x; }).join(' · ') + '.'); done({ correct: ok });
      };
      el.appendChild(slots); el.appendChild(pool); el.appendChild(check); paint();
    },
    posmap: function (el, c, done) {
      kindTag(el, 'posmap');
      el.appendChild(h('div', { class: 'rh-pm-center' }, '<small>You are here</small><b>' + esc(c.center) + '</b>'));
      if (c.intro) el.appendChild(h('p', { class: 'muted', style: 'margin:0;font-size:15px' }, c.intro));
      var list = h('div', { class: 'rh-pm-paths' });
      c.paths.forEach(function (p) {
        var item = h('div', { class: 'rh-pm-path' });
        var top = h('button', { class: 'rh-pm-top' }, '<span class="rh-pm-tag ' + p.kind + '">' + p.kind + '</span><b>' + esc(p.label) + '</b><span class="arr">›</span>');
        var det = h('div', { class: 'rh-pm-detail', hidden: true });
        det.innerHTML = '<span>' + esc(p.to) + '</span>';
        if (p.hole && LESSONS[p.hole]) det.appendChild(h('button', { class: 'rh-btn sm hole', 'data-hole': p.hole, style: 'align-self:flex-start' }, 'Follow this path →'));
        top.onclick = function () { det.hidden = !det.hidden; item.classList.toggle('open', !det.hidden); if (!det.hidden) bindHoles(det); };
        item.appendChild(top); item.appendChild(det); list.appendChild(item);
      });
      el.appendChild(list); done({ graded: false });
    },
    term: termRenderer,
    bits: function (el, c, done) {
      kindTag(el, 'bits'); el.appendChild(h('div', { class: 'rh-q' }, c.q || 'Flip bits until the byte equals <b>' + c.target + '</b>.'));
      var n = c.n || 8, v = 0, fin = false, grid = h('div', { class: 'rh-bits' }), read = h('div', { class: 'rh-readout' });
      function paint() { read.innerHTML = '<div class="' + (v === c.target ? 'hit' : '') + '"><small>Decimal</small><b>' + v + '</b></div><div><small>Hex</small><b>0x' + v.toString(16).toUpperCase().padStart(2, '0') + '</b></div><div><small>Target</small><b>' + c.target + '</b></div>'; }
      for (var i = n - 1; i >= 0; i--) (function (i) {
        var w = h('div', { class: 'rh-bit' }), b = h('button', { 'aria-label': 'Bit worth ' + (1 << i) }, '0');
        b.onclick = function () { if (fin) return; v ^= (1 << i); b.classList.toggle('on'); b.textContent = (v >> i) & 1; paint(); if (v === c.target) { fin = true; give.remove(); why(el, true, c.why || '', c.target + ' = ' + c.target.toString(2).padStart(n, '0') + ' in binary.'); done({ correct: true }); } };
        w.appendChild(b); w.appendChild(h('small', {}, String(1 << i))); grid.appendChild(w);
      })(i);
      var give = h('button', { class: 'rh-link', style: 'align-self:flex-start' }, 'Show answer');
      give.onclick = function () { if (fin) return; fin = true; give.remove(); why(el, false, c.why || '', c.target + ' = ' + c.target.toString(2).padStart(n, '0') + '. Add the place values where there\'s a 1.'); done({ correct: false }); };
      el.appendChild(grid); el.appendChild(read); el.appendChild(give); paint();
    },
    cipher: function (el, c, done) {
      kindTag(el, 'cipher'); el.appendChild(h('div', { class: 'rh-q' }, c.q || 'Slide the key until the message makes sense, then lock it in.'));
      var enc = caesar(c.plain, c.shift), lab = h('div', { class: 'rh-lab' });
      lab.innerHTML = '<div><span class="eyebrow">Intercepted</span><div class="rh-mono" style="font-size:17px">' + esc(enc) + '</div></div><label class="eyebrow" for="rhsh">Shift back by: <b id="rhshv">0</b></label><input type="range" id="rhsh" min="0" max="25" value="0"><div><span class="eyebrow">Decoded</span><div class="rh-mono" id="rhdec" style="font-size:17px">' + esc(enc) + '</div></div>';
      var lock = h('button', { class: 'rh-btn sm', style: 'align-self:flex-start' }, 'Lock in this key'), r = $('#rhsh', lab);
      r.oninput = function () { $('#rhshv', lab).textContent = r.value; $('#rhdec', lab).textContent = caesar(enc, 26 - +r.value); };
      lock.onclick = function () { lock.remove(); r.disabled = true; var ok = +r.value === c.shift; why(el, ok, c.why || '', ok ? 'Key was ' + c.shift + '.' : 'The key was ' + c.shift + ': "' + c.plain + '".'); done({ correct: ok }); };
      el.appendChild(lab); el.appendChild(lock);
    },
    phish: function (el, c, done) {
      kindTag(el, 'phish');
      var need = c.parts.filter(function (p) { return typeof p !== 'string'; }).length;
      el.appendChild(h('div', { class: 'rh-q' }, c.q || ('This email has <b>' + need + '</b> red flags. Tap each suspicious part.')));
      var em = h('div', { class: 'rh-email' }), segs = [];
      var hd = c.head.map(function (p) { return '<span class="rh-seg-t" data-s="' + (segs.push(p) - 1) + '">' + (typeof p === 'string' ? p : p.x) + '</span>'; });
      var bd = c.parts.map(function (p) { return '<span class="rh-seg-t" data-s="' + (segs.push(p) - 1) + '">' + (typeof p === 'string' ? p : p.x) + '</span>'; });
      em.innerHTML = '<div class="rh-email-h">' + hd.map(function (x) { return '<div>' + x + '</div>'; }).join('') + '</div><div class="rh-email-b">' + bd.join(' ') + '</div>';
      var list = h('div', { class: 'rh-found' }), total = segs.filter(function (p) { return typeof p !== 'string'; }).length, found = 0, miss = 0, fin = false;
      var status = h('div', { class: 'muted', style: 'font-size:14px' }, 'Found 0 of ' + total), give = h('button', { class: 'rh-link', style: 'align-self:flex-start' }, 'Show me the rest');
      function finish(ok) { fin = true; give.remove(); em.querySelectorAll('.rh-seg-t').forEach(function (s) { var p = segs[+s.dataset.s]; if (typeof p !== 'string' && !s.classList.contains('found')) { s.classList.add('miss'); list.appendChild(h('div', {}, '<b>Missed:</b> ' + p.f)); } }); why(el, ok, c.why || '', ok ? 'All ' + total + ' found.' : 'You found ' + found + ' of ' + total + (miss ? ' with ' + miss + ' false alarms' : '') + '.'); done({ correct: ok }); }
      em.onclick = function (e) {
        var s = e.target.closest('.rh-seg-t'); if (!s || fin || s.classList.contains('found')) return; var p = segs[+s.dataset.s];
        if (typeof p === 'string') { miss++; s.classList.add('nope'); setTimeout(function () { s.classList.remove('nope'); }, 400); return; }
        s.classList.add('found'); found++; beep('good'); list.appendChild(h('div', {}, p.f)); status.textContent = 'Found ' + found + ' of ' + total; if (found === total) finish(miss <= 2);
      };
      give.onclick = function () { finish(false); };
      el.appendChild(em); el.appendChild(status); el.appendChild(list); el.appendChild(give);
    },
    hashlab: function (el, c, done) {
      kindTag(el, 'hashlab'); if (c.h) el.appendChild(h('h3', {}, c.h));
      el.appendChild(h('div', { class: 'rh-body' }, c.body || 'Type anything, then change one character and watch the whole hash change.'));
      var lab = h('div', { class: 'rh-lab' });
      lab.innerHTML = '<input type="text" id="rhhin" value="' + esc(c.start || 'password123') + '" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Text to hash"><span class="eyebrow">SHA-256 (256 bits = 64 hex chars)</span><div class="rh-hex" id="rhhout">…</div><span class="muted" style="font-size:13px" id="rhhdiff"></span>';
      var prev = null;
      function run() {
        var v = $('#rhhin', lab).value;
        if (!(window.crypto && crypto.subtle)) { $('#rhhout', lab).textContent = 'Live hashing needs the installed (https) app.'; return; }
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function (buf) {
          var arr = Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
          var diff = prev ? arr.split('').filter(function (ch, i) { return ch !== prev[i]; }).length : 0;
          $('#rhhout', lab).innerHTML = arr.split('').map(function (ch, i) { return prev && ch !== prev[i] ? '<span class="diff">' + ch + '</span>' : ch; }).join('');
          $('#rhhdiff', lab).textContent = prev ? diff + ' of 64 characters changed (highlighted). That\'s the avalanche effect.' : 'Now change one letter.';
          prev = arr;
        }).catch(function () { $('#rhhout', lab).textContent = 'Live hashing needs the installed (https) app.'; });
      }
      $('#rhhin', lab).oninput = run; run(); el.appendChild(lab); done({ graded: false });
    },
    pwlab: function (el, c, done) {
      kindTag(el, 'pwlab'); if (c.h) el.appendChild(h('h3', {}, c.h)); if (c.body) el.appendChild(h('div', { class: 'rh-body' }, c.body));
      var lab = h('div', { class: 'rh-lab' });
      lab.innerHTML = '<input type="text" id="rhpin" value="Summer2024!" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Try a password (not a real one)"><div class="rh-meter"><i id="rhpm"></i></div><div class="rh-bignum" id="rhpt"></div><div class="muted" style="font-size:13px" id="rhpd"></div>';
      function run() {
        var v = $('#rhpin', lab).value, pool = 0;
        if (/[a-z]/.test(v)) pool += 26; if (/[A-Z]/.test(v)) pool += 26; if (/[0-9]/.test(v)) pool += 10; if (/[^a-zA-Z0-9]/.test(v)) pool += 33;
        var bits = v.length * Math.log2(pool || 1);
        var common = /(password|qwerty|1234|summer|winter|spring|fall|admin|letmein|welcome|iloveyou|monkey|dragon)/i.test(v), yearish = /(19|20)\d\d/.test(v);
        if (common) bits *= .45; else if (yearish) bits *= .8;
        var secs = Math.pow(2, bits) / 2 / 1e10;
        var fmt = function (s) { return s < 1 ? 'instantly' : s < 60 ? Math.round(s) + ' seconds' : s < 3600 ? Math.round(s / 60) + ' minutes' : s < 86400 ? Math.round(s / 3600) + ' hours' : s < 3.15e7 ? Math.round(s / 86400) + ' days' : s < 3.15e9 ? Math.round(s / 3.15e7) + ' years' : s < 3.15e12 ? Math.round(s / 3.15e10) + ' centuries' : 'longer than the universe has existed'; };
        $('#rhpm', lab).style.width = Math.min(bits / 100, 1) * 100 + '%';
        $('#rhpm', lab).style.background = bits < 40 ? 'var(--bad)' : bits < 65 ? 'var(--warn,#c9a227)' : 'var(--ok)';
        $('#rhpt', lab).textContent = 'Cracked ' + (fmt(secs) === 'instantly' ? 'instantly' : 'in ~' + fmt(secs));
        $('#rhpd', lab).textContent = v.length + ' chars · ' + pool + ' possible symbols · ~' + Math.round(bits) + ' bits of entropy' + (common ? ' · contains a dictionary word (tried first)' : yearish ? ' · contains a year (a common pattern)' : '') + '. Assumes offline cracking at 10 billion guesses/sec.';
      }
      $('#rhpin', lab).oninput = run; run(); el.appendChild(lab); if (c.after) el.appendChild(h('div', { class: 'rh-callout' }, c.after)); done({ graded: false });
    },
    cidr: function (el, c, done) {
      kindTag(el, 'cidr'); if (c.h) el.appendChild(h('h3', {}, c.h)); el.appendChild(h('div', { class: 'rh-body' }, c.body || 'Drag the slider to change the prefix length.'));
      var lab = h('div', { class: 'rh-lab' });
      lab.innerHTML = '<div class="rh-bignum" id="rhcn"></div><input type="range" id="rhcr" min="8" max="30" value="24" aria-label="Prefix length"><span class="eyebrow">Subnet mask in binary</span><div class="rh-hex" id="rhcb"></div><div class="rh-readout"><div><small>Mask</small><b id="rhcm" style="font-size:16px"></b></div><div><small>Usable hosts</small><b id="rhch" style="font-size:16px"></b></div><div><small>Block size</small><b id="rhcs" style="font-size:16px"></b></div></div>';
      function run() {
        var p = +$('#rhcr', lab).value, bits = '1'.repeat(p) + '0'.repeat(32 - p);
        var oct = [0, 1, 2, 3].map(function (i) { return parseInt(bits.slice(i * 8, i * 8 + 8), 2); });
        $('#rhcn', lab).textContent = '192.168.1.0/' + p;
        $('#rhcb', lab).innerHTML = [0, 1, 2, 3].map(function (i) { return bits.slice(i * 8, i * 8 + 8).replace(/1/g, '<span class="diff">1</span>'); }).join('.');
        $('#rhcm', lab).textContent = oct.join('.'); $('#rhch', lab).textContent = (Math.pow(2, 32 - p) - 2).toLocaleString(); $('#rhcs', lab).textContent = Math.pow(2, 32 - p).toLocaleString();
      }
      $('#rhcr', lab).oninput = run; run(); el.appendChild(lab); if (c.after) el.appendChild(h('div', { class: 'rh-callout' }, c.after)); done({ graded: false });
    },
    gatelab: function (el, c, done) {
      kindTag(el, 'gatelab'); if (c.h) el.appendChild(h('h3', {}, c.h)); el.appendChild(h('div', { class: 'rh-body' }, c.body || 'Pick a gate, flip the inputs, watch the output.'));
      var G = { AND: function (a, b) { return a & b; }, OR: function (a, b) { return a | b; }, XOR: function (a, b) { return a ^ b; }, NAND: function (a, b) { return 1 - (a & b); }, NOR: function (a, b) { return 1 - (a | b); }, NOT: function (a) { return 1 - a; } };
      var g = 'AND', A1 = 0, B1 = 0, lab = h('div', { class: 'rh-lab' });
      function paint() {
        var out = G[g](A1, B1);
        lab.innerHTML = '<div class="rh-seg2">' + Object.keys(G).map(function (k) { return '<button data-g="' + k + '" aria-pressed="' + (k === g) + '">' + k + '</button>'; }).join('') + '</div>' +
          '<div class="rh-gaterow"><button class="rh-toggle ' + (A1 ? 'on' : '') + '" data-in="A">A = ' + A1 + '</button>' + (g !== 'NOT' ? '<button class="rh-toggle ' + (B1 ? 'on' : '') + '" data-in="B">B = ' + B1 + '</button>' : '') + '<span class="rh-bignum">→ ' + out + '</span></div>' +
          '<div class="rh-tbl"><table><tr><th>A</th>' + (g !== 'NOT' ? '<th>B</th>' : '') + '<th>' + g + '</th></tr>' + (g === 'NOT' ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]]).map(function (r) { return '<tr style="' + (r[0] === A1 && (g === 'NOT' || r[1] === B1) ? 'color:var(--accent);font-weight:700' : '') + '"><td>' + r[0] + '</td>' + (g !== 'NOT' ? '<td>' + r[1] + '</td>' : '') + '<td>' + G[g](r[0], r[1]) + '</td></tr>'; }).join('') + '</table></div>';
      }
      lab.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.g) g = b.dataset.g; if (b.dataset.in === 'A') A1 = 1 - A1; if (b.dataset.in === 'B') B1 = 1 - B1; paint(); };
      paint(); el.appendChild(lab); if (c.after) el.appendChild(h('div', { class: 'rh-callout' }, c.after)); done({ graded: false });
    },
    sortlab: function (el, c, done) {
      kindTag(el, 'sortlab'); if (c.h) el.appendChild(h('h3', {}, c.h)); if (c.body) el.appendChild(h('div', { class: 'rh-body' }, c.body));
      var lab = h('div', { class: 'rh-lab' }), arr = shuffle(Array.apply(null, { length: 12 }).map(function (_, i) { return i + 1; }));
      var i = 0, j = 0, cmp = 0, swaps = 0, sorted = 0, fin = false, bars = h('div', { class: 'rh-bars' }), info = h('div', { class: 'muted', style: 'font-size:14px' });
      function paint() { bars.innerHTML = arr.map(function (v, k) { return '<i style="height:' + (v / 12 * 100) + '%" class="' + (k >= arr.length - sorted ? 'sorted' : (!fin && (k === j || k === j + 1)) ? 'cmp' : '') + '"></i>'; }).join(''); info.textContent = cmp + ' comparisons · ' + swaps + ' swaps' + (fin ? ' · sorted!' : ''); }
      function step() { if (fin) return; cmp++; if (arr[j] > arr[j + 1]) { var t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t; swaps++; } j++; if (j >= arr.length - 1 - i) { j = 0; i++; sorted = i; } if (i >= arr.length - 1) { fin = true; sorted = arr.length; } paint(); }
      var row = h('div', { class: 'rh-gaterow' }), b1 = h('button', { class: 'rh-btn sm' }, 'Step'), b2 = h('button', { class: 'rh-btn sm ghost' }, 'Run it all'), b3 = h('button', { class: 'rh-btn sm ghost' }, 'New shuffle');
      b1.onclick = step; b2.onclick = function () { var t = setInterval(function () { step(); if (fin) clearInterval(t); }, 60); }; b3.onclick = function () { arr = shuffle(arr); i = j = cmp = swaps = sorted = 0; fin = false; paint(); };
      row.appendChild(b1); row.appendChild(b2); row.appendChild(b3); lab.appendChild(bars); lab.appendChild(info); lab.appendChild(row); paint();
      el.appendChild(lab); if (c.after) el.appendChild(h('div', { class: 'rh-callout' }, c.after)); done({ graded: false });
    }
  };

  function inputCard(el, c, done, kind) {
    kindTag(el, kind); el.appendChild(h('div', { class: 'rh-q' }, c.q));
    var f = h('form', { class: 'rh-field' });
    var inp = h('input', { type: 'text', inputmode: kind === 'calc' ? 'decimal' : 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Your answer', placeholder: c.ph || (kind === 'calc' ? 'Number' : 'Type your answer') });
    var b = h('button', { class: 'rh-btn sm', type: 'submit' }, 'Check'); f.appendChild(inp); f.appendChild(b);
    f.onsubmit = function (e) {
      e.preventDefault(); var v = inp.value.trim(); if (!v) return; var ok;
      if (kind === 'calc') { var num = parseFloat(v.replace(/[$,%\s]/g, '')); var tol = c.tol != null ? c.tol : Math.abs(c.a) * .01; ok = Math.abs(num - c.a) <= tol; }
      else { var acc = (Array.isArray(c.a) ? c.a : [c.a]).map(norm); ok = acc.indexOf(norm(v)) >= 0; }
      inp.disabled = true; b.remove(); inp.classList.add(ok ? 'right' : 'wrong');
      var shown = kind === 'calc' ? (c.show || c.a) : (Array.isArray(c.a) ? c.a[0] : c.a);
      why(el, ok, c.why, ok ? '' : 'Answer: <b>' + esc(shown) + '</b>.'); done({ correct: ok });
    };
    el.appendChild(f); setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) { } }, 300);
  }

  function caesar(s, k) { return s.replace(/[a-z]/gi, function (ch) { var base = ch <= 'Z' ? 65 : 97; return String.fromCharCode((ch.charCodeAt(0) - base + k) % 26 + base); }); }

  /* simulated terminal: matches typed commands against each task's regex and prints canned output */
  function termRenderer(el, c, done) {
    kindTag(el, 'term'); if (c.h) el.appendChild(h('h3', {}, c.h)); if (c.intro) el.appendChild(h('div', { class: 'rh-body' }, c.intro));
    var goal = h('div', { class: 'rh-goal' }), t = h('div', { class: 'rh-term' });
    var user = c.user || 'nate', host = c.host || 'lab';
    t.innerHTML = '<div class="rh-term-bar"><i></i><i></i><i></i><span>' + esc(user) + '@' + esc(host) + '</span></div><div class="rh-term-out" aria-live="polite"></div><form class="rh-term-in"><label>' + esc(user) + '@' + esc(host) + ':' + esc(c.cwd || '~') + '$</label><input autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Type a command"></form>';
    var out = $('.rh-term-out', t), form = $('form', t), inp = $('input', t);
    var hint = h('button', { class: 'rh-link', style: 'align-self:flex-start' }, 'Show me the command'), ti = 0, fails = 0;
    function print(txt, cls) { if (txt == null || txt === '') return; var d = h('div', cls ? { class: cls } : {}); d.textContent = txt; out.appendChild(d); out.scrollTop = out.scrollHeight; }
    function showGoal() { goal.innerHTML = '<b>' + (ti + 1) + '/' + c.tasks.length + '</b><span>' + esc(c.tasks[ti].goal) + '</span>'; }
    if (c.motd) print(c.motd, 'sys'); showGoal();
    hint.onclick = function () { print('hint: ' + c.tasks[ti].show, 'sys'); inp.value = c.tasks[ti].show; inp.focus(); };
    form.onsubmit = function (e) {
      e.preventDefault(); var cmd = inp.value.trim(); inp.value = ''; if (!cmd || ti >= c.tasks.length) return;
      print('$ ' + cmd, 'cmd');
      if (cmd === 'clear') { out.innerHTML = ''; return; }
      var task = c.tasks[ti];
      if (new RegExp(task.re).test(cmd)) {
        if (task.out) print(task.out); if (task.note) print('# ' + task.note, 'sys'); ti++; fails = 0; beep('good');
        if (ti >= c.tasks.length) { goal.innerHTML = '<b>✓</b><span>' + esc(c.win || 'All tasks done.') + '</span>'; inp.disabled = true; hint.remove(); done({ correct: true }); }
        else showGoal();
        return;
      }
      var extra = (c.extra || []).filter(function (x) { return new RegExp(x.re).test(cmd); })[0];
      if (extra) { print(extra.out); return; }
      fails++;
      var base = cmd.split(/\s+/)[0];
      var known = ['ls', 'cd', 'pwd', 'cat', 'grep', 'whoami', 'chmod', 'ps', 'kill', 'nmap', 'ping', 'echo', 'mkdir', 'touch', 'cp', 'mv', 'sudo', 'find', 'head', 'tail', 'wc', 'sort', 'uniq', 'man', 'id', 'top', 'ss', 'dig', 'curl', 'history', 'less', 'identify'];
      print(known.indexOf(base) >= 0 ? 'That ran, but it isn\'t what this step needs.' + (fails >= 2 ? ' Hint: ' + task.hint : '') : base + ': command not found' + (fails >= 2 ? '  (hint: ' + task.hint + ')' : ''), 'err');
    };
    el.appendChild(goal); el.appendChild(t); el.appendChild(hint);
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  Promise.all(CONTENT.map(loadScript)).then(function () {
    indexContent();
    if (window.App && window.App.registerTab) {
      window.App.registerTab({ id: 'learn', label: 'Learn', icon: '🧠', render: render });
      // let the shell add a Today-screen shortcut and read the review badge
      window.App.learn = {
        exam: function (subj) { A.go('learn'); startExam(subj || 'secplus'); },
        questions: function (o) { try { return questions(o); } catch (e) { return []; } },
        recordAnswer: function (id, ok) { try { return recordAnswer(id, !!ok); } catch (e) { return false; } },
        subjects: function () { return SUBJECTS.map(function (s) { return { id: s.id, title: s.name, color: s.color, group: s.group || '' }; }); },
        randomRabbitHole: function () { A.go('learn'); var d = data(), pool = Object.keys(LESSONS).filter(function (id) { return !d.done[id]; }); var all = pool.length ? pool : Object.keys(LESSONS); if (all.length) startLesson(all[Math.floor(Math.random() * all.length)]); },
        openSubject: function (id) { A.go('learn'); if (SUBJECTS.filter(function (s) { return s.id === id; })[0]) { LV.view = 'subject'; LV.subj = id; rerender(); } },
        dueReviewCount: function () { try { return dueReviews().length; } catch (e) { return 0; } },
        openLesson: function (ref) { A.go('learn'); if (LESSONS[ref]) startLesson(ref); },
        secplusNext: function () {
          var s = SUBJECTS.filter(function (x) { return x.id === 'secplus'; })[0]; if (!s) return null;
          var d = data(), id = null;
          for (var u = 0; u < s.units.length && !id; u++) for (var l = 0; l < s.units[u].lessons.length && !id; l++) { if (!d.done[s.units[u].lessons[l].id]) id = s.units[u].lessons[l].id; }
          if (!id) id = s.units[0].lessons[0].id;
          if (!LESSONS[id]) return null;
          return { title: LESSONS[id].l.title, open: function () { A.go('learn'); startLesson(id); } };
        },
        quiz: function (subj, n, onDone) { A.go('learn'); startQuiz(subj || 'secplus', n || 5, onDone); },
        techniqueOfWeek: function () {
          var ids = ['mma-hipbump', 'mma-triangle', 'mma-posmap-guard', 'mma-combos', 'mma-kicks', 'mma-posmap-mount'].filter(function (id) { return LESSONS[id]; });
          if (!ids.length) return null;
          var id = ids[Math.floor(Date.now() / 6048e5) % ids.length];
          return { title: LESSONS[id].l.title, summary: LESSONS[id].l.teaser || '', open: function () { A.go('learn'); startLesson(id); } };
        },
        fightStudy: function () { return null; },
        speak: function (t) { if (!TTS) return false; stopSpeak(); try { window.speechSynthesis.speak(new SpeechSynthesisUtterance(String(t))); return true; } catch (e) { return false; } }
      };
    } else {
      // standalone fallback (test harness defines window.__mountLearn)
      window.__learnRender = render;
    }
  });

  window.RH = { subjects: function () { return SUBJECTS; }, lessons: function () { return LESSONS; } };
})();
