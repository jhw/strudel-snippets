//@title TB-303 Acid Bassline @by Claude

setCps(130/60/4);

// volume envelope
const vDecay = slider(0.2, 0, 0.4, 0.1);
const vSustain = slider(0.1, 0, 0.2, 0.1);
const vRelease = slider(0.1, 0, 0.3, 0.1);

// filter envelope
const fCutoff = slider(180, 50, 350, 10);
const fRes = slider(10, 0, 20, 1);
const fDecay = slider(0.1, 0, 0.2, 0.1);
const fEnv = slider(2, 0, 4, 0.1);

note("{A1 A1 [A1 A2] ~ A1 [~ A1] A1 A2}%8")
  .s("sawtooth")
  .decay(vDecay)
  .sustain(vSustain)
  .release(vRelease)
  .lpf(fCutoff)
  .lpq(fRes)
  .lpdecay(fDecay)
  .lpenv(fEnv)
  .gain(0.6);
