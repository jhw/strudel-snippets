//@title EDM Emotional Chord Progressions @by Claude

// Uses Strudel's built-in voicing() for automatic voice leading

setCps(130/60/4);

// === SLIDERS ===

const progPick = slider(0, 0, 7, 1);     // progression select
const dictPick = slider(0, 0, 3, 1);     // voicing dictionary: ireal, ireal-ext, triads, lefthand
const anchor = slider(60, 48, 72, 1);    // anchor note for voicing (C3-C5)
const lpfCutoff = slider(1000, 200, 2000, 10);
const lfoAmp = slider(200, 0, 500, 10);  // filter LFO amplitude (Hz)
const lfoSpeed = slider(8, 1, 32, 1);    // filter LFO wavelength (cycles)
const gainVal = slider(0.5, 0, 1, 0.1);

const dicts = ["ireal", "ireal-ext", "triads", "lefthand"];

// === PROGRESSIONS (all in A minor) ===

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
  .dict(pick(dictPick, dicts))
  .anchor(anchor)
  .s("supersaw")
  .lpf(lpfCutoff.add(sine.range(-1, 1).mul(lfoAmp).slow(lfoSpeed)))
  .lpq(3)
  .decay(0.3)
  .sustain(0.6)
  .release(0.5)
  .chorus(0.6)
  .room(0.7)
  .roomsize(0.8)
  .gain(gainVal);
