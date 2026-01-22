//@title bend the horizon (arp) @by Switch Angel

setCps(140/60/4);

const tran = pick(["0", "<0!4 -6 -4 >/2"], 0);

const chords = [
  "[E3, B3, F#5, G5]",
];

const arp = note(chords[0]).arp("{0 1 2 3 2 1}%16")
  // .add("{0@3 4@3 7@3 0}%16")
  .add(tran.mul(1))
  // .add("{7 0 -4 3 0 12}%16").add("4")
  .mul(sine.range(1, 1).fast(1.2))
  // .grab("e:b:g:a:c:d:f#").room(1).z1("5:8") // something wrong in here but not sure what; maybe z1 not a function
  // .add(note("0 0 -3 -5 0 12"))
  // note("{0 3 <20!16 18!16>}%16".add(48).grab("e:b:g:f#"))
  .s("pulse:.3").lpf(300).lpenv("4").lpd(.9).lpq(.2).release(1)
  .pan(sine.fast(4))
  .chorus(.5)
  .distort("3:.4").hpf(100).postgain(.8);

d6: arp.orbit(1);
