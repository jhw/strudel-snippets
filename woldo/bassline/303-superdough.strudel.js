//@title TB-303 Acid Bassline @by Claude
// Pattern generation inspired by Vitling's Endless Acid Banger
// https://github.com/vitling/acid-banger

setCps(130/60/4);

// === SLIDERS ===

const patternPick = slider(0, 0, 15, 1);  // pattern select
const wavePick = slider(0, 0, 1, 1);      // 0: sawtooth, 1: square
const waveforms = ["sawtooth", "square"];

// filter envelope
const fCutoff = slider(180, 50, 350, 10);
const fRes = slider(10, 0, 20, 1);
const fDecay = slider(0.1, 0, 0.2, 0.01);
const fEnv = slider(2, 0, 4, 0.1);

// === PATTERNS ===
// Generated using Endless Acid Banger algorithm:
// - Offset patterns define intervals from root (A1)
// - Step density: 60% on beat, 50% on /3, 30% on /2, 10% else
// - 30% accent chance, 10% glide chance
// - Notes: A1=root, B1=+2, C2=+3, D2=+5, E2=+7, F2=+8, G2=+10, A2=+12, etc.

const patterns = [
  // Pattern 0: offset [0,0,12] - root heavy with octave jumps
  "{A1 ~ A1 A2 ~ A1 ~ ~ A1 A2 ~ A1 A1 ~ A2 ~}%16",
  // Pattern 1: offset [0,0,0,12,10,19] - root + minor 7th + high
  "{A1 A1 ~ G2 ~ A1 ~ A2 A1 ~ G2 ~ A1 ~ ~ A2}%16",
  // Pattern 2: offset [0,7,12] - root, fifth, octave
  "{A1 ~ E2 A2 ~ A1 E2 ~ ~ A1 A2 E2 A1 ~ ~ A2}%16",
  // Pattern 3: offset [0,0,0,0,12] - very root heavy
  "{A1 A1 A1 ~ A1 ~ A1 A2 A1 ~ ~ A1 A1 A1 ~ A2}%16",
  // Pattern 4: offset [0,3,7,12] - minor triad + octave
  "{A1 ~ C2 E2 A2 ~ A1 C2 ~ E2 ~ A1 C2 ~ A2 ~}%16",
  // Pattern 5: offset [0,0,12,15] - root, octave, minor 10th
  "{A1 A1 ~ A2 ~ C3 A1 ~ A2 ~ A1 ~ C3 A2 ~ A1}%16",
  // Pattern 6: offset [0,5,7,12] - root, fourth, fifth, octave
  "{A1 ~ D2 E2 ~ A2 A1 ~ E2 D2 ~ A1 ~ A2 E2 ~}%16",
  // Pattern 7: offset [0,0,0,7,12,19] - sparse with reach
  "{A1 ~ ~ E2 A1 ~ A2 ~ ~ A1 G3 ~ A1 ~ E2 ~}%16",
  // Pattern 8: offset [0,12,24] - octave jumps
  "{A1 ~ A2 ~ A3 ~ A1 A2 ~ A1 ~ A3 A2 ~ A1 ~}%16",
  // Pattern 9: offset [0,0,10,12] - minor 7th flavor
  "{A1 A1 ~ G2 A2 ~ A1 ~ G2 ~ A1 A2 ~ G2 A1 ~}%16",
  // Pattern 10: offset [0,3,10,12] - minor + dominant
  "{A1 ~ C2 ~ G2 A2 ~ A1 C2 G2 ~ A1 ~ A2 C2 ~}%16",
  // Pattern 11: offset [0,0,5,12,17] - fourths
  "{A1 A1 ~ D2 ~ A2 D3 ~ A1 ~ D2 A2 ~ A1 D3 ~}%16",
  // Pattern 12: offset [0,7,10,12] - dominant shape
  "{A1 ~ E2 G2 A2 ~ A1 ~ E2 ~ G2 A2 A1 ~ E2 ~}%16",
  // Pattern 13: offset [0,0,0,12,14] - root + octave + 9th
  "{A1 A1 ~ A2 B2 ~ A1 A1 ~ A2 ~ A1 B2 A2 ~ A1}%16",
  // Pattern 14: offset [0,2,7,12] - sus2 flavor
  "{A1 ~ B1 E2 ~ A2 A1 ~ B1 ~ E2 A2 ~ A1 B1 ~}%16",
  // Pattern 15: offset [0,0,12,15,19] - minor reach
  "{A1 A1 ~ A2 C3 ~ G3 A1 ~ A2 ~ C3 A1 ~ A2 G3}%16",
];

// Accent patterns (velocity boost on accented steps)
// 30% accent probability baked in - accented notes get higher velocity
const accents = [
  "{1 ~ 1 1.4 ~ 1 ~ ~ 1.4 1 ~ 1 1 ~ 1.4 ~}%16",
  "{1 1.4 ~ 1 ~ 1 ~ 1.4 1 ~ 1 ~ 1.4 ~ ~ 1}%16",
  "{1.4 ~ 1 1 ~ 1.4 1 ~ ~ 1 1.4 1 1 ~ ~ 1}%16",
  "{1 1 1.4 ~ 1 ~ 1 1.4 1 ~ ~ 1.4 1 1 ~ 1}%16",
  "{1 ~ 1.4 1 1 ~ 1.4 1 ~ 1 ~ 1 1.4 ~ 1 ~}%16",
  "{1.4 1 ~ 1 ~ 1.4 1 ~ 1 ~ 1.4 ~ 1 1 ~ 1}%16",
  "{1 ~ 1 1.4 ~ 1 1 ~ 1.4 1 ~ 1 ~ 1 1.4 ~}%16",
  "{1 ~ ~ 1.4 1 ~ 1 ~ ~ 1.4 1 ~ 1 ~ 1 ~}%16",
  "{1.4 ~ 1 ~ 1 ~ 1.4 1 ~ 1 ~ 1.4 1 ~ 1 ~}%16",
  "{1 1.4 ~ 1 1 ~ 1 ~ 1.4 ~ 1 1 ~ 1.4 1 ~}%16",
  "{1 ~ 1.4 ~ 1 1.4 ~ 1 1.4 1 ~ 1 ~ 1 1.4 ~}%16",
  "{1.4 1 ~ 1 ~ 1 1.4 ~ 1 ~ 1.4 1 ~ 1 1 ~}%16",
  "{1 ~ 1 1.4 1 ~ 1 ~ 1.4 ~ 1 1 1.4 ~ 1 ~}%16",
  "{1 1.4 ~ 1 1 ~ 1.4 1 ~ 1 ~ 1 1.4 1 ~ 1}%16",
  "{1.4 ~ 1 1 ~ 1 1 ~ 1.4 ~ 1 1 ~ 1.4 1 ~}%16",
  "{1 1 ~ 1.4 1 ~ 1 1 ~ 1 ~ 1.4 1 ~ 1.4 1}%16",
];

// === OUTPUT ===

note(pick(patternPick, patterns))
  .s(pick(wavePick, waveforms))
  .gain(pick(patternPick, accents).mul(0.6))
  .lpf(fCutoff)
  .lpq(fRes)
  .lpdecay(fDecay)
  .lpenv(fEnv)
  .decay(0.2)
  .sustain(0.1)
  .release(0.1);
