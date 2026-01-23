//@title EDM Emotional Chord Progressions @by Claude

// Uses Strudel's built-in voicing() for automatic voice leading

setCps(130/60/4);

// === SLIDERS ===

// progression select
const progPick = slider(0, 0, 7, 1);

// voicing
const anchor = slider(60, 48, 72, 1);  // anchor note for voicing (C3-C5)

// filter
const lpfCutoff = slider(1000, 200, 2000, 10);
const lpfRes = slider(3, 0, 10, 1);

// volume envelope
const vDecay = slider(0.3, 0, 0.6, 0.1);
const vSustain = slider(0.6, 0, 1, 0.1);
const vRelease = slider(0.5, 0, 1, 0.1);

// effects
const chorusAmt = slider(0.6, 0, 1, 0.1);
const roomAmt = slider(0.7, 0, 1, 0.1);
const roomSize = slider(0.8, 0, 1, 0.1);
const delayAmt = slider(0.4, 0, 1, 0.1);
const delayTime = slider(0.375, 0, 0.75, 0.125);
const delayFb = slider(0.3, 0, 0.8, 0.1);

// gain
const gainVal = slider(0.5, 0, 1, 0.1);

// === PROGRESSIONS (all in A minor) ===
// Using chord symbols - voicing() handles the notes automatically

const progressions = [
  // 0: i - bVI - iv - V (Satellite - Oceanlab, Adagio for Strings - Tiesto)
  "<Am F Dm E>",

  // 1: i - iv - bVI - V (Sun & Moon - Above & Beyond)
  "<Am Dm F E>",

  // 2: i - bVII - bVI - V (Children - Robert Miles)
  "<Am G F E>",

  // 3: i - iv - bVII - bVI (Strobe - Deadmau5)
  "<Am Dm G F>",

  // 4: i - v - iv - i (melancholic loop)
  "<Am Em Dm Am>",

  // 5: i - bVI - bVII - iv (Opus - Eric Prydz)
  "<Am F G Dm>",

  // 6: i - iv - i - V (Language - Porter Robinson)
  "<Am Dm Am E>",

  // 7: i - iv - v - iv (For an Angel - Paul van Dyk)
  "<Am Dm Em Dm>",
];

// === OUTPUT ===

pick(progPick, progressions)
  .voicing()
  .anchor(anchor)
  .s("supersaw")
  .lpf(lpfCutoff)
  .lpq(lpfRes)
  .decay(vDecay)
  .sustain(vSustain)
  .release(vRelease)
  .chorus(chorusAmt)
  .room(roomAmt)
  .roomsize(roomSize)
  .delay(delayAmt)
  .delaytime(delayTime)
  .delayfeedback(delayFb)
  .gain(gainVal);
