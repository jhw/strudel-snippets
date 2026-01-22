//@title Clean Breaks Explorer @by Claude

await samples('github:yaxu/clean-breaks/main');

setCps(130/60/4);

// === SLIDERS ===

const breakPick = slider(0, 0, 31, 1);
const patternPick = slider(0, 0, 15, 1);
const gain = slider(0.8, 0, 1, 0.1);

// === BREAKS ===
// slices: 0-7 = first bar, 8-15 = second bar
// typical: 0,8 = kick, 2,10 = snare, 4,6,12,14 = hats, 5,13 = snare hits

const breaks = [
  "useme",         // 0
  "sesame",        // 1
  "do",            // 2
  "funkydrummer",  // 3
  "mechanicalman", // 4
  "kool",          // 5
  "sport",         // 6
  "rill",          // 7
  "think",         // 8
  "king",          // 9
  "around",        // 10
  "riffin",        // 11
  "apache",        // 12
  "neworleans",    // 13
  "hitormiss",     // 14
  "action",        // 15
  "hotline",       // 16
  "swat",          // 17
  "ripple",        // 18
  "fireeater",     // 19
  "hungup",        // 20
  "newday",        // 21
  "movement",      // 22
  "boogiewoogie",  // 23
  "delight",       // 24
  "eeloil",        // 25
  "impeach",       // 26
  "marymary",      // 27
  "amen",          // 28
  "sneakin",       // 29
  "squib",         // 30
  "groove",        // 31
];

// === PATTERNS ===
// 16 slices (0-15), snares typically on 5,13

const patterns = [
  // backbeat focused (snares on 2nd & 4th)
  "{0 5 8 13}%8",    // 0: classic
  "{8 5 0 13}%8",    // 1: kick swap
  "{0 13 8 5}%8",    // 2: snare swap
  "{4 5 12 13}%8",   // 3: hat + snare

  // syncopated
  "{0 5 10 13}%8",   // 4: offset second half
  "{2 5 8 13}%8",    // 5: ghost kick
  "{0 5 6 13}%8",    // 6: hat before snare
  "{0 7 8 13}%8",    // 7: fill before kick

  // broken
  "{0 3 5 13}%8",    // 8: early ghost
  "{0 5 11 13}%8",   // 9: late ghost
  "{1 5 9 13}%8",    // 10: off-grid kicks
  "{0 5 8 15}%8",    // 11: end fill

  // choppy
  "{0 2 5 8}%8",     // 12: first half focus
  "{8 10 13 15}%8",  // 13: second half focus
  "{0 4 8 12}%8",    // 14: all kicks/hats
  "{5 7 13 15}%8",   // 15: all snares/fills
];

// === OUTPUT ===

note(36).sound(pick(breakPick, breaks))
  .loopAt(2)
  .slice(16, pick(patternPick, patterns))
  .gain(gain);
