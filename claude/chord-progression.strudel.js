//@title EDM Minor Chord Progression @by Claude

setCps(130/60/4);

// filter
const lpfCutoff = slider(1000, 200, 2000, 10);
const lpfRes = slider(3, 0, 10, 1);

// volume envelope
const vAttack = slider(0, 0, 0.1, 0.01);
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

note("<[A2, E3, A3, C4] [F2, C3, F3, A3] [C2, G3, C4, E4] [G2, D3, G3, B3]>")
  .struct("{x ~ ~ x ~ ~ x ~ ~ x ~ ~ x ~ ~ x}%16")
  .s("supersaw")
  .lpf(lpfCutoff)
  .lpq(lpfRes)
  .attack(vAttack)
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
