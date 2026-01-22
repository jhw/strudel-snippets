//@title TR-909 Drum Machine @by Claude

setCps(130/60/4);

// === SLIDERS ===

// kick
const kickSamplePick = slider(0, 0, 3, 1);
const kickRhythmPick = slider(0, 0, 5, 1);
const kickVolPick = slider(0, 0, 3, 1);
const kickVol = slider(0.8, 0, 1, 0.1);

// snare
const snareSamplePick = slider(0, 0, 3, 1);
const snareRhythmPick = slider(0, 0, 5, 1);
const snareVolPick = slider(0, 0, 3, 1);
const snareVol = slider(0.7, 0, 1, 0.1);

// hat
const hatSamplePick = slider(0, 0, 3, 1);
const hatRhythmPick = slider(0, 0, 5, 1);
const hatVolPick = slider(0, 0, 3, 1);
const hatVol = slider(0.5, 0, 1, 0.1);

// === PRESETS ===

// kick presets
const kickSamples = [
  "bd:0", "bd:1", "bd:2", "bd:3"
];
const kickRhythms = [
  "x(4,16)",      // four on floor
  "x(3,8)",       // triplet feel
  "x(5,16)",      // syncopated
  "x(6,16)",      // busy
  "x(3,16)",      // sparse
  "x(7,16)",      // dense
];
const kickVolAlgos = [
  "1",                          // flat
  "{1 0.7 0.8 0.7}%4",         // accent 1
  "{1 0.6 0.9 0.6 0.8 0.6}%8", // accent 2
  rand.range(0.6, 1),           // random
];

// snare presets
const snareSamples = [
  "sd:0", "sd:1", "sd:2", "sd:3"
];
const snareRhythms = [
  "x(2,8)",       // backbeat
  "x(4,16)",      // busier
  "x(3,8)",       // triplet
  "x(2,16)",      // sparse
  "x(5,16)",      // syncopated
  "x(3,16)",      // off-beat
];
const snareVolAlgos = [
  "1",                          // flat
  "{0.8 1}%2",                  // alternating
  "{0.7 1 0.8 1}%4",            // accent pattern
  rand.range(0.7, 1),           // random
];

// hat presets
const hatSamplePairs = [
  "<hh:0 hh:1>",   // pair 1
  "<hh:2 hh:3>",   // pair 2
  "<hh:0 oh:0>",   // closed/open
  "<hh:1 oh:1>",   // closed/open 2
];
const hatRhythms = [
  "x(8,16)",      // 8ths
  "x(16,16)",     // 16ths
  "x(6,16)",      // syncopated
  "x(12,16)",     // busy
  "x(5,8)",       // groove
  "x(7,8)",       // dense
];
const hatVolAlgos = [
  "0.6",                              // flat
  "{0.6 0.4}%2",                      // alternating
  "{0.6 0.3 0.5 0.3}%4",              // accented
  rand.range(0.3, 0.6),               // random
];

// === TRACKS ===

const kick = s(pick(kickSamplePick, kickSamples))
  .struct(pick(kickRhythmPick, kickRhythms))
  .gain(pick(kickVolPick, kickVolAlgos));

const snare = s(pick(snareSamplePick, snareSamples))
  .struct(pick(snareRhythmPick, snareRhythms))
  .gain(pick(snareVolPick, snareVolAlgos));

const hat = s(pick(hatSamplePick, hatSamplePairs))
  .struct(pick(hatRhythmPick, hatRhythms))
  .gain(pick(hatVolPick, hatVolAlgos));

// === MIX ===

stack(
  kick.gain(kickVol),
  snare.gain(snareVol),
  hat.gain(hatVol)
);
