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
const gain = slider(0.8, 0, 1, 0.1);

// === BREAKS WITH BAR COUNTS ===
// Each entry: [name, bars]
// bars determines loopAt value and slice count (8 slices per bar)

const breaks = [
  // 1-bar breaks (8 slices: 0-7)
  ["sesame", 1],         // 0
  ["mechanicalman", 1],  // 1
  ["sport", 1],          // 2
  ["think", 1],          // 3
  ["around", 1],         // 4
  ["action", 1],         // 5
  ["swat", 1],           // 6
  ["impeach", 1],        // 7

  // 2-bar breaks (16 slices: 0-15)
  ["useme", 2],          // 8
  ["do", 2],             // 9
  ["funkydrummer", 2],   // 10
  ["kool", 2],           // 11
  ["rill", 2],           // 12
  ["king", 2],           // 13
  ["riffin", 2],         // 14
  ["apache", 2],         // 15
  ["neworleans", 2],     // 16
  ["hitormiss", 2],      // 17
  ["hotline", 2],        // 18
  ["ripple", 2],         // 19
  ["hungup", 2],         // 20
  ["newday", 2],         // 21
  ["movement", 2],       // 22
  ["boogiewoogie", 2],   // 23
  ["delight", 2],        // 24
  ["eeloil", 2],         // 25
  ["marymary", 2],       // 26
  ["sneakin", 2],        // 27
  ["squib", 2],          // 28
  ["groove", 2],         // 29

  // 4-bar breaks (32 slices: 0-31)
  ["fireeater", 4],      // 30
  ["amen", 4],           // 31
];

// === PATTERNS ===
// Base patterns designed for 8 slices per bar
// Pattern positions: 0,4 = kicks, 2,6 = snares, 1,3,5,7 = hats/ghosts

const basePatterns = [
  // backbeat focused
  [0, 2, 4, 6],    // 0: straight 8ths
  [0, 3, 4, 6],    // 1: syncopated
  [0, 2, 5, 6],    // 2: late snare
  [1, 2, 4, 6],    // 3: ghost kick

  // syncopated
  [0, 2, 4, 7],    // 4: end fill
  [0, 3, 5, 6],    // 5: double syncopation
  [0, 2, 3, 6],    // 6: ghost before snare
  [1, 2, 5, 6],    // 7: all off-beat

  // broken
  [0, 1, 4, 6],    // 8: early ghost
  [0, 2, 4, 5],    // 9: early second snare
  [0, 3, 4, 7],    // 10: both syncopated
  [1, 3, 5, 7],    // 11: all off-beats

  // choppy
  [0, 1, 2, 4],    // 12: first half dense
  [4, 5, 6, 7],    // 13: second half only
  [0, 2, 4, 6],    // 14: all on-beats (same as 0)
  [0, 4, 5, 6],    // 15: kick + second half
];

// === HELPER: Scale pattern to bar count ===
// Takes base pattern (designed for 1 bar / 8 slices) and scales to actual bar count.
// Base pattern [0, 2, 4, 6] becomes:
//   1 bar:  [0, 2, 4, 6] (slices 0-7)
//   2 bars: [0, 2, 4, 6, 8, 10, 12, 14] (slices 0-7 then 8-15)
//   4 bars: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
// Same relative pattern in each bar, but pulls from different slices -
// so you get kick from bar 1, then kick from bar 2, etc. Each bar's drums
// are slightly different in most breaks, giving natural variation.

function scalePattern(basePattern, bars) {
  if (bars === 1) {
    return basePattern;
  } else if (bars === 2) {
    // Repeat pattern in both bars
    return [...basePattern, ...basePattern.map(x => x + 8)];
  } else if (bars === 4) {
    // Repeat pattern across all 4 bars
    return [
      ...basePattern,
      ...basePattern.map(x => x + 8),
      ...basePattern.map(x => x + 16),
      ...basePattern.map(x => x + 24)
    ];
  }
  return basePattern;
}

// === GET CURRENT BREAK INFO ===

const currentBreak = breaks[breakPick];
const breakName = currentBreak[0];
const bars = currentBreak[1];
const slices = bars * 8;  // 8 slices per bar = 1/8th bar each (half-beat)

// Scale the selected pattern to match bar count
const basePattern = basePatterns[patternPick];
const scaledPattern = scalePattern(basePattern, bars);
const patternStr = "{" + scaledPattern.join(" ") + "}%" + (bars * 4);

// === OUTPUT ===
// loopAt(bars) stretches sample to correct length (1, 2, or 4 cycles)
// slice(slices, pattern) chops into bars*8 pieces and plays selected pattern
// note(36) works empirically; strudel default is C3/48 but that sounds wrong here

note(36).sound(breakName)
  .loopAt(bars)
  .slice(slices, patternStr)
  .gain(gain);
