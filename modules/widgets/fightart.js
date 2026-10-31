// Original two-fighter drawings for MMA positions. Side view, capsule limbs, drawn from joint coordinates.
// FightArt.pose(id, {you:"top"|"bottom"}) -> SVG string. "A" is the top/attacking fighter, "B" the bottom/defending one.
(function () {
  // joints: h head, s shoulder, p hip, e/w near elbow/wrist, E/W far elbow/wrist, k/a near knee/ankle, K/X far knee/ankle
  const POSES = {
    standing: { A: { h: [62, 30], s: [61, 41], p: [58, 70], e: [72, 50], w: [76, 36], E: [70, 48], W: [82, 38], k: [68, 88], a: [72, 108], K: [52, 89], X: [46, 108] }, mirrorB: true },
    clinch: {
      A: { h: [97, 31], s: [93, 42], p: [84, 70], e: [104, 48], w: [112, 42], E: [104, 44], W: [110, 34], k: [90, 89], a: [94, 108], K: [76, 89], X: [70, 108] },
      B: { h: [108, 33], s: [108, 43], p: [116, 70], e: [98, 52], w: [92, 58], E: [98, 50], W: [92, 46], k: [110, 89], a: [106, 108], K: [124, 89], X: [130, 108] }, order: "BA" },
    cage: { fence: 178,
      A: { h: [150, 42], s: [145, 49], p: [124, 68], e: [158, 56], w: [166, 64], E: [156, 52], W: [168, 48], k: [126, 89], a: [116, 108], K: [110, 90], X: [100, 108] },
      B: { h: [168, 31], s: [168, 42], p: [166, 70], e: [158, 52], w: [150, 58], E: [160, 50], W: [154, 44], k: [158, 89], a: [162, 108], K: [170, 89], X: [172, 108] }, order: "BA" },
    guard: {
      B: { h: [36, 100], s: [50, 102], p: [86, 102], e: [66, 90], w: [84, 80], E: [64, 92], W: [86, 84], k: [110, 80], a: [130, 76], K: [106, 84], X: [128, 82] },
      A: { h: [104, 47], s: [104, 58], p: [118, 84], e: [96, 72], w: [90, 92], E: [98, 74], W: [94, 94], k: [104, 106], a: [136, 108], K: [108, 106], X: [140, 107] }, order: "AB" },
    halfguard: {
      B: { h: [40, 100], s: [54, 102], p: [92, 103], e: [70, 92], w: [78, 82], E: [64, 96], W: [74, 90], k: [110, 96], a: [128, 102], K: [112, 104], X: [126, 107] },
      A: { h: [60, 84], s: [72, 86], p: [110, 84], e: [62, 96], w: [50, 101], E: [86, 98], W: [96, 101], k: [130, 100], a: [150, 108], K: [118, 104], X: [134, 106] }, order: "BA" },
    butterfly: {
      B: { h: [80, 50], s: [82, 61], p: [88, 94], e: [100, 64], w: [114, 58], E: [98, 70], W: [108, 74], k: [106, 84], a: [116, 98], K: [102, 88], X: [112, 100] },
      A: { h: [126, 44], s: [124, 55], p: [128, 84], e: [110, 64], w: [98, 68], E: [112, 68], W: [102, 74], k: [114, 104], a: [144, 108], K: [118, 104], X: [148, 106] }, order: "AB" },
    side: {
      B: { h: [56, 100], s: [70, 102], p: [108, 102], e: [78, 90], w: [90, 84], E: [74, 94], W: [84, 90], k: [128, 92], a: [148, 106], K: [126, 96], X: [146, 108] },
      A: { h: [84, 72], s: [88, 82], p: [104, 82], e: [72, 92], w: [62, 98], E: [104, 94], W: [112, 97], k: [100, 106], a: [118, 108], K: [112, 104], X: [128, 108] }, order: "BA" },
    knee: {
      B: { h: [56, 100], s: [70, 102], p: [108, 102], e: [80, 92], w: [94, 86], E: [76, 94], W: [88, 92], k: [128, 92], a: [148, 106], K: [126, 96], X: [146, 108] },
      A: { h: [96, 34], s: [96, 45], p: [100, 72], e: [86, 62], w: [76, 80], E: [108, 60], W: [114, 74], k: [92, 94], a: [114, 94], K: [116, 88], X: [120, 108] }, order: "BA" },
    northsouth: {
      B: { h: [106, 102], s: [94, 102], p: [58, 102], e: [86, 92], w: [96, 86], E: [90, 94], W: [100, 90], k: [40, 92], a: [22, 106], K: [42, 96], X: [24, 108] },
      A: { h: [90, 84], s: [104, 86], p: [136, 84], e: [90, 98], w: [78, 100], E: [94, 96], W: [84, 97], k: [150, 104], a: [168, 108], K: [146, 106], X: [164, 108] }, order: "BA" },
    mount: {
      B: { h: [52, 100], s: [66, 102], p: [102, 102], e: [74, 90], w: [86, 82], E: [72, 94], W: [82, 88], k: [122, 92], a: [140, 106], K: [120, 96], X: [138, 108] },
      A: { h: [88, 45], s: [90, 56], p: [96, 88], e: [80, 66], w: [70, 76], E: [84, 70], W: [74, 86], k: [80, 104], a: [102, 108], K: [84, 106], X: [106, 106] }, order: "BA" },
    turtle: {
      B: { h: [68, 92], s: [80, 88], p: [110, 82], e: [82, 104], w: [72, 104], E: [86, 104], W: [76, 105], k: [110, 106], a: [130, 108], K: [106, 106], X: [126, 107] },
      A: { h: [90, 70], s: [98, 72], p: [128, 64], e: [90, 90], w: [84, 98], E: [96, 88], W: [92, 96], k: [140, 86], a: [146, 108], K: [132, 86], X: [138, 108] }, order: "BA" },
    back: {
      A: { h: [70, 44], s: [73, 56], p: [78, 96], e: [86, 58], w: [96, 54], E: [80, 70], W: [90, 64], k: [100, 82], a: [110, 96], K: [98, 86], X: [108, 98] },
      B: { h: [86, 50], s: [88, 62], p: [98, 94], e: [96, 72], w: [92, 58], E: [100, 74], W: [96, 62], k: [120, 84], a: [140, 104], K: [118, 88], X: [138, 106] }, order: "AB" }
  };
  // Technique sequences. Each frame starts from a base pose and overrides joints. who = which fighter is "you" ("B" = bottom).
  // flip: roles swapped in this frame (after a sweep you end up on top). arrows: [x1,y1,x2,y2,curve].
  const STAND_B = { h: [138, 30], s: [139, 41], p: [142, 70], e: [128, 50], w: [124, 36], E: [130, 48], W: [118, 38], k: [132, 88], a: [128, 108], K: [148, 89], X: [154, 108] };
  const SEQS = {
    hipbump: { name: "Hip-bump sweep to kimura", who: "B", frames: [
      { base: "guard", B: { s: [64, 88], h: [54, 78], p: [88, 104], E: [56, 98], W: [48, 106], k: [108, 92], a: [120, 104], K: [104, 96], X: [116, 106] }, cap: "He postures up. Open your guard, sit up, and post your far hand behind you." },
      { base: "guard", B: { s: [72, 78], h: [64, 68], p: [96, 94], e: [88, 62], w: [102, 54], E: [58, 96], W: [50, 106], k: [108, 96], a: [122, 106], K: [104, 98], X: [116, 106] }, arrows: [[92, 104, 108, 84, -8]], cap: "Reach over his shoulder and drive your hips up into him." },
      { base: "guard", A: { h: [132, 76], s: [126, 82], p: [112, 98], e: [118, 92], w: [126, 104], E: [120, 90], W: [130, 100], k: [100, 86], a: [92, 100], K: [104, 88], X: [96, 102] }, B: { h: [100, 56], s: [100, 68], p: [92, 98], e: [112, 70], w: [124, 78], E: [106, 72], W: [118, 82], k: [80, 106], a: [62, 108], K: [84, 106], X: [66, 108] }, arrows: [[110, 60, 140, 92, 14]], cap: "Keep driving over the top. He falls back." },
      { base: "mount", flip: true, cap: "Land in mount. If he blocks the sweep by posting his arm, go to the kimura instead." },
      { base: "guard", A: { e: [100, 86], w: [96, 104] }, B: { s: [72, 82], h: [64, 72], p: [88, 104], e: [86, 96], w: [96, 102], E: [94, 66], W: [106, 84] }, cap: "Kimura: grab his posted wrist, reach over his shoulder and lock your own wrist (figure-four)." },
      { base: "guard", A: { e: [112, 82], w: [126, 72] }, B: { e: [104, 74], w: [122, 72], E: [96, 70], W: [116, 76] }, arrows: [[100, 98, 126, 70, -16]], cap: "Fall back, close your guard, and rotate his hand up behind his back. Slow. Tap early in training." }
    ] },
    scissor: { name: "Scissor sweep", who: "B", frames: [
      { base: "guard", B: { e: [72, 84], w: [94, 66], E: [70, 92], W: [94, 92] }, cap: "Grip his collar and the same-side sleeve." },
      { base: "guard", B: { h: [42, 94], s: [54, 98], p: [86, 100], k: [112, 70], a: [100, 78], K: [112, 104], X: [138, 104] }, arrows: [[92, 106, 80, 96, 0]], cap: "Hip out to one side. Top shin goes across his belly, bottom leg flat on the mat behind his knee." },
      { base: "guard", A: { h: [90, 60], s: [94, 68], p: [118, 86] }, B: { h: [42, 94], s: [54, 98], p: [86, 100], k: [110, 66], a: [98, 72], K: [112, 104], X: [138, 104] }, arrows: [[100, 54, 80, 58, 0]], cap: "Pull him forward with both grips so his weight comes onto your shin." },
      { base: "guard", A: { h: [76, 98], s: [86, 96], p: [118, 92], k: [128, 80], a: [146, 76] }, B: { h: [62, 74], s: [70, 82], p: [96, 92], k: [112, 70], a: [124, 60], K: [100, 106], X: [78, 104] }, arrows: [[130, 64, 108, 50, -10], [138, 104, 110, 106, 0]], cap: "Scissor: top leg kicks him over while the bottom leg chops his knee." },
      { base: "mount", flip: true, cap: "Follow him over and land in mount. Keep the sleeve grip." }
    ] },
    armbar: { name: "Armbar from guard", who: "B", frames: [
      { base: "guard", A: { w: [80, 92] }, B: { e: [70, 94], w: [84, 90], E: [66, 88], W: [84, 82] }, cap: "Trap one arm across your chest. Both of your hands on it." },
      { base: "guard", A: { w: [80, 92] }, B: { p: [84, 98], e: [70, 94], w: [84, 90], k: [112, 74], a: [116, 88] }, arrows: [[90, 104, 104, 106, 0]], cap: "Put your foot on his hip and swing your body to an angle." },
      { base: "guard", A: { w: [80, 92] }, B: { p: [84, 98], e: [70, 94], w: [84, 90], k: [112, 74], a: [116, 88], K: [98, 50], X: [82, 42] }, arrows: [[120, 70, 90, 38, -14]], cap: "Swing your far leg over his head. Squeeze your knees together." },
      { base: "guard", A: { h: [86, 64], s: [94, 70], e: [88, 82], w: [82, 92] }, B: { p: [90, 92], e: [72, 92], w: [80, 90], k: [112, 76], a: [118, 90], K: [92, 54], X: [76, 48] }, arrows: [[90, 104, 92, 86, 0]], cap: "His thumb points up. Lift your hips slowly to finish. Tap early in training." }
    ] },
    triangle: { name: "Triangle choke", who: "B", frames: [
      { base: "guard", A: { w: [104, 76], W: [94, 94] }, B: { e: [72, 84], w: [100, 76] }, cap: "Push one of his hands into his own chest and keep the other arm out." },
      { base: "guard", A: { w: [104, 76] }, B: { e: [72, 84], w: [100, 76], K: [104, 52], X: [94, 42] }, arrows: [[124, 82, 98, 44, -12]], cap: "Shoot your leg over the shoulder of the arm that's out." },
      { base: "guard", A: { h: [96, 56], s: [100, 64] }, B: { K: [100, 54], X: [92, 44], k: [112, 60], a: [100, 48] }, cap: "Lock: the back of your knee goes over your own ankle." },
      { base: "guard", A: { h: [90, 62], s: [96, 68], e: [92, 78], w: [86, 86] }, B: { p: [82, 98], w: [92, 60], W: [96, 64], K: [100, 58], X: [92, 48], k: [110, 64], a: [98, 50] }, arrows: [[70, 100, 66, 108, 0]], cap: "Cut an angle, pull his head down, and squeeze your knees." }
    ] },
    standup: { name: "Technical stand-up", who: "B", frames: [
      { A: STAND_B, B: { h: [60, 62], s: [62, 74], p: [66, 104], e: [72, 76], w: [80, 66], E: [56, 92], W: [46, 106], k: [80, 86], a: [92, 106], K: [84, 98], X: [100, 104] }, cap: "Seated. Post the hand behind you and plant the opposite foot." },
      { A: STAND_B, B: { h: [60, 62], s: [62, 74], p: [66, 102], e: [72, 76], w: [80, 66], E: [56, 92], W: [46, 106], k: [80, 86], a: [92, 106], K: [88, 82], X: [106, 76] }, arrows: [[96, 92, 112, 74, 0]], cap: "Free leg kicks up to keep him off you." },
      { A: STAND_B, B: { h: [64, 52], s: [66, 64], p: [64, 88], e: [76, 66], w: [82, 58], E: [56, 90], W: [46, 106], k: [78, 96], a: [92, 106], K: [52, 98], X: [40, 106] }, arrows: [[100, 82, 44, 104, 18]], cap: "Lift your hips and swing that leg back under you, behind the post hand." },
      { A: STAND_B, B: { h: [62, 30], s: [61, 41], p: [58, 70], e: [72, 50], w: [76, 36], E: [70, 48], W: [82, 38], k: [68, 88], a: [72, 108], K: [52, 89], X: [46, 108] }, cap: "Stand up in your stance, hands up, at a safe distance." }
    ] },
    kneecut: { name: "Knee-cut pass", who: "A", frames: [
      { base: "guard", A: { h: [106, 50], s: [106, 60], e: [100, 76], w: [104, 92], E: [96, 74], W: [90, 96] }, B: { k: [108, 86], a: [118, 102], K: [104, 88], X: [114, 104] }, cap: "Open the guard. Pin one knee with your hand." },
      { base: "guard", A: { h: [100, 56], s: [102, 66], p: [116, 86], k: [92, 100], a: [120, 108], w: [104, 92] }, B: { k: [108, 90], a: [120, 104], K: [104, 92], X: [116, 106] }, arrows: [[110, 106, 86, 100, 0]], cap: "Slide your knee across his thigh, toward the mat on the far side." },
      { base: "guard", A: { h: [78, 80], s: [86, 84], p: [108, 88], e: [70, 94], w: [60, 100], E: [98, 92], W: [104, 98], k: [90, 104], a: [118, 108], K: [112, 104], X: [126, 108] }, B: { k: [114, 92], a: [130, 104], K: [110, 96], X: [128, 106] }, order: "BA", cap: "Crossface and get the underhook as you cut through." },
      { base: "side", cap: "Free your leg and settle into side control. Hips low." }
    ] },
    guillotine: { name: "Guillotine from guard", who: "B", frames: [
      { base: "guard", A: { h: [84, 70], s: [92, 72], p: [118, 86], e: [86, 86], w: [80, 100], E: [90, 84], W: [84, 102] }, B: { s: [66, 88], h: [58, 78], k: [108, 92], a: [120, 104], K: [104, 96], X: [116, 106] }, cap: "His head drops low (shooting in or leaning forward)." },
      { base: "guard", A: { h: [84, 74], s: [92, 74], p: [118, 86], e: [86, 88], w: [80, 100], E: [90, 86], W: [84, 102] }, B: { s: [66, 88], h: [58, 78], e: [80, 66], w: [90, 80], E: [74, 80], W: [88, 84], k: [108, 92], a: [120, 104], K: [104, 96], X: [116, 106] }, cap: "Wrap your arm around his neck, wrist blade under his chin. Grab your wrist with the other hand." },
      { base: "guard", A: { h: [74, 90], s: [86, 84], p: [118, 86], e: [80, 96], w: [72, 104] }, B: { e: [66, 86], w: [80, 86], E: [64, 92], W: [80, 90] }, arrows: [[96, 80, 120, 80, 0]], cap: "Close your guard and lie back, pulling his head down with you." },
      { base: "guard", A: { h: [74, 90], s: [86, 84], p: [118, 86], e: [80, 96], w: [72, 104] }, B: { p: [90, 96], e: [66, 84], w: [80, 82], E: [64, 90], W: [80, 86] }, arrows: [[82, 92, 78, 70, 0]], cap: "Push his body away with your legs and pull your forearm up into his throat. Tap early in training." }
    ] },
    kimura: { name: "Kimura from guard", who: "B", frames: [
      { base: "guard", A: { e: [100, 86], w: [96, 104] }, cap: "He posts a hand on the mat to keep his balance." },
      { base: "guard", A: { e: [100, 86], w: [96, 104] }, B: { s: [72, 82], h: [64, 72], p: [88, 104], e: [86, 96], w: [96, 102], E: [94, 66], W: [106, 84] }, cap: "Sit up. Grab his wrist, reach over his shoulder, and lock your own wrist (figure-four)." },
      { base: "guard", A: { e: [112, 82], w: [126, 72] }, B: { e: [104, 74], w: [122, 72], E: [96, 70], W: [116, 76] }, arrows: [[100, 98, 126, 70, -16]], cap: "Fall back, close your guard, and rotate his hand up behind his back. Slow. Tap early in training." }
    ] },
    elbowknee: { name: "Elbow-knee mount escape", who: "B", frames: [
      { base: "mount", order: "AB", B: { e: [72, 94], w: [84, 90], E: [74, 96], W: [88, 94] }, cap: "Elbows tight to your sides, hands framing on his hips. Never push his chest with straight arms." },
      { base: "mount", B: { p: [110, 100], e: [72, 94], w: [86, 92], k: [114, 88], a: [104, 104] }, arrows: [[104, 106, 124, 104, 0]], cap: "Turn onto your side and shrimp your hips away from his knee." },
      { base: "mount", B: { p: [112, 100], e: [84, 96], w: [92, 92], k: [92, 92], a: [112, 104] }, arrows: [[110, 92, 92, 92, 0]], cap: "Slide your knee in to meet your elbow, under his knee." },
      { base: "halfguard", cap: "Trap his leg. You're back to half guard." }
    ] },
    upa: { name: "Upa (bridge and roll)", who: "B", frames: [
      { base: "mount", order: "AB", B: { e: [76, 90], w: [80, 76], E: [80, 92], W: [84, 78], k: [100, 86], a: [112, 106], K: [98, 88], X: [110, 107] }, A: { e: [80, 66], w: [80, 82] }, cap: "Trap his arm against your chest and step your foot outside his foot on the same side." },
      { base: "mount", B: { p: [102, 86], e: [76, 88], w: [80, 76], E: [80, 90], W: [84, 78], k: [100, 84], a: [112, 106], K: [98, 86], X: [110, 107] }, A: { h: [74, 48], s: [80, 58], p: [96, 74], e: [80, 66], w: [80, 80], k: [82, 92], a: [104, 96], K: [86, 94], X: [108, 94] }, arrows: [[104, 106, 104, 84, 0]], cap: "Bridge hard, straight up onto your shoulder." },
      { base: "mount", B: { h: [60, 90], s: [72, 88], p: [102, 84], k: [104, 82], a: [116, 104] }, A: { h: [52, 96], s: [62, 88], p: [86, 70], e: [56, 100], w: [50, 104], k: [100, 62], a: [116, 66], K: [96, 66], X: [112, 70] }, arrows: [[100, 60, 46, 86, -14]], cap: "Turn over the trapped side. He can't post, so he rolls." },
      { base: "guard", flip: true, cap: "You land on top in his guard. Posture up." }
    ] },
    rnc: { name: "Rear-naked choke", who: "A", frames: [
      { base: "back", cap: "Hooks in, chest to his back. Seat belt grip: one arm over the shoulder, one under." },
      { base: "back", A: { e: [84, 62], w: [100, 60] }, cap: "Slide the choking arm under his chin. Elbow lined up with his chin." },
      { base: "back", A: { e: [84, 62], w: [100, 60], E: [82, 46], W: [80, 40] }, cap: "Grab your own bicep. Put the other hand behind his head." },
      { base: "back", A: { h: [74, 48], s: [76, 58], e: [86, 62], w: [100, 58], E: [82, 46], W: [82, 40] }, arrows: [[66, 56, 76, 50, 0]], cap: "Elbows together, chest forward, squeeze. Tap early in training." }
    ] },
    double: { name: "Double-leg takedown", who: "A", frames: [
      { base: "standing", cap: "Stance. Watch his hips, not his hands." },
      { base: "standing", A: { h: [72, 52], s: [72, 62], p: [64, 86], e: [82, 70], w: [90, 64], E: [80, 72], W: [88, 66], k: [76, 98], a: [82, 108], K: [54, 98], X: [46, 108] }, arrows: [[62, 40, 66, 54, 0]], cap: "Level change: bend your knees, not your waist. Back straight." },
      { base: "standing", A: { h: [108, 66], s: [100, 70], p: [80, 82], e: [116, 80], w: [128, 86], E: [114, 78], W: [126, 82], k: [104, 106], a: [84, 108], K: [66, 96], X: [56, 108] }, arrows: [[70, 92, 102, 104, 0]], cap: "Penetration step: lead knee drops between his feet, arms wrap behind his thighs." },
      { base: "standing", A: { h: [118, 64], s: [110, 70], p: [88, 84], e: [124, 82], w: [134, 88], E: [122, 80], W: [132, 84], k: [108, 106], a: [92, 108], K: [96, 100], X: [80, 108] }, B: { h: [164, 46], s: [156, 54], p: [142, 80], e: [148, 64], w: [140, 70], E: [150, 62], W: [144, 66], k: [146, 96], a: [140, 108], K: [156, 96], X: [162, 108] }, arrows: [[120, 56, 150, 74, 12]], cap: "Head up, drive through and turn the corner." },
      { base: "guard", cap: "He lands on his back. You're in his guard. Posture up." }
    ] },
    onetwothree: { name: "Jab-cross-hook (1-2-3)", who: "A", frames: [
      { base: "standing", cap: "Stance. Hands up, chin down, weight in the middle." },
      { base: "standing", A: { e: [80, 40], w: [98, 38] }, arrows: [[76, 46, 100, 46, 0]], cap: "1, jab: lead hand straight out and snap it back to your face." },
      { base: "standing", A: { s: [64, 41], p: [60, 70], e: [72, 50], w: [76, 36], E: [82, 40], W: [102, 38], K: [54, 90], X: [50, 105] }, arrows: [[68, 56, 104, 44, 0]], cap: "2, cross: rear hand straight. Turn your back hip and lift the back heel." },
      { base: "standing", A: { s: [62, 41], p: [58, 70], e: [76, 40], w: [88, 32], E: [70, 48], W: [80, 38], k: [70, 88], a: [74, 108] }, arrows: [[70, 50, 92, 34, -12]], cap: "3, hook: pivot the lead foot, elbow at shoulder height, turn through with the hips. Hands back up." }
    ] }
  };
  function frame(id, i, opts = {}) {
    const S = SEQS[id]; if (!S) return ""; const f = S.frames[i]; if (!f) return "";
    const base = f.base ? POSES[f.base] : {}; const bB = base.B || (base.A ? mirror(base.A) : {});
    const youTop = (S.who === "A") !== !!f.flip;
    return draw({ A: Object.assign({}, base.A, f.A), B: Object.assign({}, bB, f.B), order: f.order || base.order || "BA", fence: base.fence, arrows: f.arrows }, youTop, id + " step " + (i + 1));
  }
  const mirror = j => Object.fromEntries(Object.entries(j).map(([k, [x, y]]) => [k, [200 - x, y]]));
  const seg = (a, b, w, c, o = 1) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;
  function fighter(j, col, dark) {
    return seg(j.s, j.E, 6.5, dark) + seg(j.E, j.W, 5.5, dark) + seg(j.p, j.K, 9, dark) + seg(j.K, j.X, 7, dark) +
      seg(j.s, j.p, 13, col) + `<circle cx="${j.h[0]}" cy="${j.h[1]}" r="7" fill="${col}"/>` +
      seg(j.p, j.k, 9, col) + seg(j.k, j.a, 7, col) + seg(j.s, j.e, 6.5, col) + seg(j.e, j.w, 5.5, col) +
      `<circle cx="${j.w[0]}" cy="${j.w[1]}" r="3.6" fill="${col}"/>`;
  }
  function pose(id, opts = {}) {
    const P = POSES[id]; if (!P) return "";
    return draw({ A: P.A, B: P.B || mirror(P.A), order: P.order, fence: P.fence }, opts.you !== "bottom", id);
  }
  function draw(P, youTop, label) {
    const A = P.A, B = P.B; const id = label;
    const cA = youTop ? ["var(--accent)", "color-mix(in srgb, var(--accent) 60%, #000)"] : ["#5b8fd6", "#3a6199"];
    const cB = youTop ? ["#5b8fd6", "#3a6199"] : ["var(--accent)", "color-mix(in srgb, var(--accent) 60%, #000)"];
    const order = (P.order || "BA").split("");
    const body = order.map(k => k === "A" ? fighter(A, cA[0], cA[1]) : fighter(B, cB[0], cB[1])).join("");
    const pts = [A, B].flatMap(j => Object.values(j)); let x0 = Math.min(...pts.map(p => p[0])) - 16, x1 = Math.max(...pts.map(p => p[0])) + 16;
    if (P.fence) x1 = Math.max(x1, P.fence + 16);
    let y0 = Math.min(...pts.map(p => p[1])) - 14; const y1 = 116, w = Math.max(x1 - x0, 1.9 * (y1 - y0)), cx = (x0 + x1) / 2; x0 = cx - w / 2;
    const h = Math.max(y1 - y0, w / 2.4); y0 = y1 - h;
    return `<svg viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" class="fart" role="img" aria-label="${id} illustration">
      <line x1="${x0}" y1="112" x2="${x0 + w}" y2="112" stroke="var(--line-2, var(--line))" stroke-width="2" stroke-linecap="round"/>
      ${P.fence ? `<g stroke="var(--muted)" stroke-width="1" opacity=".55">${Array.from({ length: 8 }, (_, i) => `<line x1="${P.fence}" y1="${10 + i * 13}" x2="${P.fence + 12}" y2="${16 + i * 13}"/><line x1="${P.fence + 12}" y1="${10 + i * 13}" x2="${P.fence}" y2="${16 + i * 13}"/>`).join("")}<line x1="${P.fence}" y1="6" x2="${P.fence}" y2="112" stroke-width="2"/></g>` : ""}
      ${body}${(P.arrows || []).map(([x1, y1, x2, y2, c]) => { const mx = (x1 + x2) / 2 - (y2 - y1) * (c || 0) / 40, my = (y1 + y2) / 2 + (x2 - x1) * (c || 0) / 40; return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="var(--gold, #f2b33d)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 4.5" marker-end="url(#fa-arr)"/>`; }).join("")}
      <defs><marker id="fa-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--gold, #f2b33d)"/></marker></defs></svg>`;
  }
  function seqWidget(el, o = {}, done) {
    const S = SEQS[o.seq]; if (!S) { el.innerHTML = ""; return; } let i = 0;
    const r = () => { el.innerHTML = `<div class="fart-wrap fart-seq"><div class="fart-top small"><b>${S.name}</b><span>Step ${i + 1} of ${S.frames.length}</span></div>${frame(o.seq, i)}<p class="fart-cap">${S.frames[i].cap}</p>
      <div class="row"><button class="btn ghost grow" data-fa="-1" ${i ? "" : "disabled"}>Back</button><button class="btn grow" data-fa="1">${i < S.frames.length - 1 ? "Next step" : "Done"}</button></div></div>`; };
    el.onclick = e => { const b = e.target.closest("[data-fa]"); if (!b) return; const d = +b.dataset.fa; if (d > 0 && i === S.frames.length - 1) { if (done) done({ graded: false }); return; } i = Math.max(0, Math.min(S.frames.length - 1, i + d)); r(); };
    r();
  }
  if (window.App) { window.App.widgets = window.App.widgets || {}; window.App.widgets.frames = { mount: seqWidget }; }
  window.FightArt = { pose, frame, seqs: Object.fromEntries(Object.entries(SEQS).map(([k, v]) => [k, { name: v.name, steps: v.frames.map(f => f.cap) }])), ids: Object.keys(POSES) };
})();
