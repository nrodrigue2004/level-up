// Offline support: serve from cache, refresh cache in the background.
const CACHE = "levelup-v35";
const CORE = ["./", "index.html", "styles.css", "data.js", "content2.js", "words.js", "groups2.js", "xwords.js", "icons.js", "design.css", "puzzles.js", "app.js", "features.js", "features2.js", "features3.js", "modules/modules.js", "manifest.json", "icons/icon-180.png", "icons/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
self.addEventListener("push", e => {
  let d = {}; try { d = e.data.json(); } catch (x) { d = { title: "Level Up", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "Level Up", { body: d.body || "", icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: d.tag, data: { url: d.url || "./" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => { const c = cs[0]; if (c) return c.focus(); return self.clients.openWindow(e.notification.data && e.notification.data.url || "./"); }));
});
