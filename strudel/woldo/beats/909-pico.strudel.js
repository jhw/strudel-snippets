//@title TR-909 Pico @by Claude
// Uses sample chains from gist with slice selection
// kick: 105 slices, snare: 105 slices, hat: 109 slices (perc)

await samples('https://gist.githubusercontent.com/jhw/ee3538b87f6d2a305eb3a0ef34b744f1/raw/strudel.json');

setCps(130/60/4);

// === SLICE COUNTS ===
const kickSlices = 105;
const snareSlices = 105;
const hatSlices = 109;

// === SLIDERS ===

// delay
const delayVol = slider(0.3, 0, 1, 0.01);       // wet/dry mix
const delayTime = slider(0.1875, 0, 0.5, 0.01); // rate (0.1875 = 3/16 dotted eighth)
const delayFb = slider(0.4, 0, 0.9, 0.01);      // feedback

// kick
const kickSlice = slider(0, 0, 104, 1);
const kickRhythmPick = slider(0, 0, 5, 1);
const kickVolPick = slider(0, 0, 3, 1);
const kickVol = slider(0.8, 0, 1, 0.1);

// snare
const snareSlice = slider(0, 0, 104, 1);
const snareRhythmPick = slider(0, 0, 5, 1);
const snareVolPick = slider(0, 0, 3, 1);
const snareVol = slider(0.7, 0, 1, 0.1);

// hat
const hatSlice = slider(0, 0, 108, 1);
const hatRhythmPick = slider(0, 0, 5, 1);
const hatVolPick = slider(0, 0, 3, 1);
const hatVol = slider(0.5, 0, 1, 0.1);

// === RHYTHM PRESETS ===

const kickRhythms = [
  "x(4,16)",      // four on floor
  "x(3,8)",       // triplet feel
  "x(5,16)",      // syncopated
  "x(6,16)",      // busy
  "x(3,16)",      // sparse
  "x(7,16)",      // dense
];

const snareRhythms = [
  "x(2,8)",       // backbeat
  "x(4,16)",      // busier
  "x(3,8)",       // triplet
  "x(2,16)",      // sparse
  "x(5,16)",      // syncopated
  "x(3,16)",      // off-beat
];

const hatRhythms = [
  "x(8,16)",      // 8ths
  "x(16,16)",     // 16ths
  "x(6,16)",      // syncopated
  "x(12,16)",     // busy
  "x(5,8)",       // groove
  "x(7,8)",       // dense
];

// === VOLUME PRESETS ===

const kickVolAlgos = [
  "1",                          // flat
  "{1 0.7 0.8 0.7}%4",         // accent 1
  "{1 0.6 0.9 0.6 0.8 0.6}%8", // accent 2
  rand.range(0.6, 1),           // random
];

const snareVolAlgos = [
  "1",                          // flat
  "{0.8 1}%2",                  // alternating
  "{0.7 1 0.8 1}%4",            // accent pattern
  rand.range(0.7, 1),           // random
];

const hatVolAlgos = [
  "0.6",                              // flat
  "{0.6 0.4}%2",                      // alternating
  "{0.6 0.3 0.5 0.3}%4",              // accented
  rand.range(0.3, 0.6),               // random
];

// === TRACKS ===

const kick = s("kick")
  .begin(kickSlice.div(kickSlices))
  .end(kickSlice.add(1).div(kickSlices))
  .struct(pick(kickRhythmPick, kickRhythms))
  .gain(pick(kickVolPick, kickVolAlgos));

const snare = s("snare")
  .begin(snareSlice.div(snareSlices))
  .end(snareSlice.add(1).div(snareSlices))
  .struct(pick(snareRhythmPick, snareRhythms))
  .gain(pick(snareVolPick, snareVolAlgos));

const hat = s("perc")
  .begin(hatSlice.div(hatSlices))
  .end(hatSlice.add(1).div(hatSlices))
  .struct(pick(hatRhythmPick, hatRhythms))
  .gain(pick(hatVolPick, hatVolAlgos));

// === MIX ===

stack(
  kick.gain(kickVol),
  snare.gain(snareVol),
  hat.gain(hatVol)
)
  .delay(delayVol)
  .delaytime(delayTime)
  .delayfeedback(delayFb);
