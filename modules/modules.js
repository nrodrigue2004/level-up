// Loads optional module scripts in order. Add new modules here.
(function () {
  var list = ["modules/widgets/posmap.js", "modules/widgets/arena.js", "modules/widgets/music.js", "modules/widgets/dance.js", "modules/widgets/worldmap.js", "modules/learn/learn.js"];
  list.forEach(function (src) {
    var s = document.createElement("script"); s.src = src; s.async = false;
    s.onerror = function () { /* module not built yet */ };
    document.body.appendChild(s);
  });
})();
