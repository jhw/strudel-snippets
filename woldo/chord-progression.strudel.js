//@title EDM Emotional Chord Progressions @by Claude

setCps(130/60/4);

// === SLIDERS ===

// progression select
const progPick = slider(0, 0, 7, 1);

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
const gain = slider(0.5, 0, 1, 0.1);

// === PROGRESSIONS (all in A minor) ===

const progressions = [
  // 0: i - bVI - iv - V (Satellite - Oceanlab, Adagio for Strings - Tiesto)
  "<[A2,E3,A3,C4] [F2,C3,F3,A3] [D2,A3,D4,F4] [E2,B3,E4,G#4]>",

  // 1: i - iv - bVI - V (Sun & Moon - Above & Beyond)
  "<[A2,E3,A3,C4] [D2,A3,D4,F4] [F2,C3,F3,A3] [E2,B3,E4,G#4]>",

  // 2: i - bVII - bVI - V (Children - Robert Miles)
  "<[A2,E3,A3,C4] [G2,D3,G3,B3] [F2,C3,F3,A3] [E2,B3,E4,G#4]>",

  // 3: i - iv - bVII - bVI (Strobe - Deadmau5)
  "<[A2,E3,A3,C4] [D2,A3,D4,F4] [G2,D3,G3,B3] [F2,C3,F3,A3]>",

  // 4: i - v - iv - i (melancholic loop)
  "<[A2,E3,A3,C4] [E2,B3,E4,G4] [D2,A3,D4,F4] [A2,E3,A3,C4]>",

  // 5: i - bVI - bVII - iv (Opus - Eric Prydz)
  "<[A2,E3,A3,C4] [F2,C3,F3,A3] [G2,D3,G3,B3] [D2,A3,D4,F4]>",

  // 6: i - iv - i - V (Language - Porter Robinson)
  "<[A2,E3,A3,C4] [D2,A3,D4,F4] [A2,E3,A3,C4] [E2,B3,E4,G#4]>",

  // 7: i - iv - v - iv (For an Angel - Paul van Dyk)
  "<[A2,E3,A3,C4] [D2,A3,D4,F4] [E2,B3,E4,G4] [D2,A3,D4,F4]>",
];

// === OUTPUT ===

note(pick(progPick, progressions))
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
  .gain(gain);
