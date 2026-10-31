// Sends due reminders to the phone. Config lives in the PUSH_CONFIG repo secret (made by the app's Settings).
// Runs every 15 minutes; a reminder is due if its time rounds to the current quarter hour in the phone's timezone.
const webpush = require("web-push");
const raw = process.env.PUSH_CONFIG;
if (!raw) { console.log("No PUSH_CONFIG secret yet."); process.exit(0); }
const cfg = JSON.parse(raw);
webpush.setVapidDetails("mailto:levelup@example.com", cfg.pub, cfg.priv);
const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: cfg.tz || "America/Chicago", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date()).map(p => [p.type, p.value]));
let mins = +parts.hour * 60 + +parts.minute;
const slot = Math.round(mins / 15) * 15 % 1440; // nearest quarter hour, so a late cron run still lands
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const quarter = m => Math.round(m / 15) * 15 % 1440;
const due = [];
for (const r of cfg.rem || []) {
  const start = toMin(r.t);
  if (r.u) { for (let m = start; m <= toMin(r.u); m += 60) if (quarter(m) === slot) due.push(r); }
  else if (quarter(start) === slot) due.push(r);
}
if (process.env.TEST === "true") due.push({ title: "✅ Level Up push works", body: "You'll get your reminders here from now on." });
console.log(`local ${parts.hour}:${parts.minute} slot ${slot} due ${due.length}`);
(async () => {
  for (const r of due) {
    try { await webpush.sendNotification(cfg.sub, JSON.stringify({ title: r.title, body: r.body, tag: r.title })); console.log("sent", r.title); }
    catch (e) { console.error("failed", e.statusCode, e.body); if (e.statusCode === 404 || e.statusCode === 410) { console.error("Subscription expired. Turn push off and on in the app, then update PUSH_CONFIG."); process.exitCode = 1; } }
  }
})();
