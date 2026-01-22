//@title EDM Minor Chord Progression @by Claude

setCps(130/60/4);

note("<[A2, E3, A3, C4] [F2, C3, F3, A3] [C2, G3, C4, E4] [G2, D3, G3, B3]>")
  .s("supersaw")
  .lpf(sine.range(600, 1400).slow(8))
  .lpq(3)
  .attack(0.01)
  .decay(0.3)
  .sustain(0.6)
  .release(0.5)
  .chorus(0.6)
  .room(0.7)
  .roomsize(0.8)
  .delay(0.4)
  .delaytime(3/8)
  .delayfeedback(0.3)
  .gain(0.5);
