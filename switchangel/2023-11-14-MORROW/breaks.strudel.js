//@title Clean Breaks Explorer @by Claude

// === HOW loopAt WORKS ===
// loopAt(n) time-stretches/compresses the entire WAV to fit n cycles.
// Strudel has no knowledge of musical content - it just adjusts playback speed.
// So if a 4-bar sample gets loopAt(2), it plays at 2x speed (squeaky chipmunk).
// By matching loopAt(bars) to actual bar count, speed change stays within
// the BPM variation range (~90-135 BPM = ±20-30% pitch drift, acceptable).
// Getting bar count wrong means 2x or 0.5x speed - completely broken.

// === THE FIX ===
// Each break stores [name, bars] so we can dynamically:
// 1. Set loopAt(bars) to the correct bar count - keeps pitch in the ballpark
// 2. Set slice count to bars * 8 (8 slices per bar = consistent resolution)
// 3. Scale patterns to match - base 1-bar pattern repeats across all bars

await samples('github:yaxu/clean-breaks/main');

setCps(130/60/4);

// === SLIDERS ===

const breakPick = slider(0, 0, 31, 1);
const patternPick = slider(0, 0, 15, 1);
const gainVal = slider(0.8, 0, 1, 0.1);

// === BREAKS ===
// Grouped by bar count for correct loopAt/slice values

const breaks1 = ["sesame", "mechanicalman", "sport", "think", "around", "action", "swat", "impeach"];
const breaks2 = ["useme", "do", "funkydrummer", "kool", "rill", "king", "riffin", "apache", "neworleans", "hitormiss", "hotline", "ripple", "hungup", "newday", "movement", "boogiewoogie", "delight", "eeloil", "marymary", "sneakin", "squib", "groove"];
const breaks4 = ["fireeater", "amen"];

// All breaks in order (for slider picking)
const allBreaks = [...breaks1, ...breaks2, ...breaks4];

// Bar count for each break (parallel array)
const barCounts = [
  1,1,1,1,1,1,1,1,  // 8 x 1-bar
  2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,  // 22 x 2-bar
  4,4  // 2 x 4-bar
];

// Slice counts (bars * 8)
const sliceCounts = barCounts.map(b => b * 8);

// === PATTERNS ===
// Pre-generated patterns for each bar count.
// Base pattern [0, 2, 4, 6] scaled across all bars.

// 1-bar patterns (8 slices, plays over 4 steps)
const patterns1 = [
  "{0 2 4 6}%4", "{0 3 4 6}%4", "{0 2 5 6}%4", "{1 2 4 6}%4",
  "{0 2 4 7}%4", "{0 3 5 6}%4", "{0 2 3 6}%4", "{1 2 5 6}%4",
  "{0 1 4 6}%4", "{0 2 4 5}%4", "{0 3 4 7}%4", "{1 3 5 7}%4",
  "{0 1 2 4}%4", "{4 5 6 7}%4", "{0 2 4 6}%4", "{0 4 5 6}%4",
];

// 2-bar patterns (16 slices, plays over 8 steps)
const patterns2 = [
  "{0 2 4 6 8 10 12 14}%8", "{0 3 4 6 8 11 12 14}%8",
  "{0 2 5 6 8 10 13 14}%8", "{1 2 4 6 9 10 12 14}%8",
  "{0 2 4 7 8 10 12 15}%8", "{0 3 5 6 8 11 13 14}%8",
  "{0 2 3 6 8 10 11 14}%8", "{1 2 5 6 9 10 13 14}%8",
  "{0 1 4 6 8 9 12 14}%8", "{0 2 4 5 8 10 12 13}%8",
  "{0 3 4 7 8 11 12 15}%8", "{1 3 5 7 9 11 13 15}%8",
  "{0 1 2 4 8 9 10 12}%8", "{4 5 6 7 12 13 14 15}%8",
  "{0 2 4 6 8 10 12 14}%8", "{0 4 5 6 8 12 13 14}%8",
];

// 4-bar patterns (32 slices, plays over 16 steps)
const patterns4 = [
  "{0 2 4 6 8 10 12 14 16 18 20 22 24 26 28 30}%16",
  "{0 3 4 6 8 11 12 14 16 19 20 22 24 27 28 30}%16",
  "{0 2 5 6 8 10 13 14 16 18 21 22 24 26 29 30}%16",
  "{1 2 4 6 9 10 12 14 17 18 20 22 25 26 28 30}%16",
  "{0 2 4 7 8 10 12 15 16 18 20 23 24 26 28 31}%16",
  "{0 3 5 6 8 11 13 14 16 19 21 22 24 27 29 30}%16",
  "{0 2 3 6 8 10 11 14 16 18 19 22 24 26 27 30}%16",
  "{1 2 5 6 9 10 13 14 17 18 21 22 25 26 29 30}%16",
  "{0 1 4 6 8 9 12 14 16 17 20 22 24 25 28 30}%16",
  "{0 2 4 5 8 10 12 13 16 18 20 21 24 26 28 29}%16",
  "{0 3 4 7 8 11 12 15 16 19 20 23 24 27 28 31}%16",
  "{1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31}%16",
  "{0 1 2 4 8 9 10 12 16 17 18 20 24 25 26 28}%16",
  "{4 5 6 7 12 13 14 15 20 21 22 23 28 29 30 31}%16",
  "{0 2 4 6 8 10 12 14 16 18 20 22 24 26 28 30}%16",
  "{0 4 5 6 8 12 13 14 16 20 21 22 24 28 29 30}%16",
];

// All patterns combined - index 0-15 for 1-bar, 16-31 for 2-bar, 32-47 for 4-bar
// Pattern index = patternPick + (barCount == 1 ? 0 : barCount == 2 ? 16 : 32)
const allPatterns = [...patterns1, ...patterns2, ...patterns4];

// Pattern offset by bar count (to index into allPatterns)
const patternOffsets = barCounts.map(b => b === 1 ? 0 : b === 2 ? 16 : 32);

// === OUTPUT ===
// loopAt(bars) stretches sample to correct length (1, 2, or 4 cycles)
// slice(slices, pattern) chops into bars*8 pieces and plays selected pattern
// note(36) works empirically; strudel default is C3/48 but that sounds wrong here

note(36).sound(pick(breakPick, allBreaks))
  .loopAt(pick(breakPick, barCounts))
  .slice(pick(breakPick, sliceCounts), pick(patternPick.add(pick(breakPick, patternOffsets)), allPatterns))
  .gain(gainVal);
