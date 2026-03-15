// @title Waning Pad - By Switch Angel
setCpm(160 / 4);

// TB-303 style filter envelope
register('acidenv', (x, pat) => pat.lpf(100)
         .lpenv(x * 9).lps(0.2).lpd(0.12).lpq(2));

const melody = n("<0 0 3 3 9 10>*16")
      .scale("minor")
      .s("supersaw")
      .acidenv(tri.slow(16).range(0.1, 0.8))
      .delay(tri.slow(9).range(0.5, 0.99))
      .pan(sine.slow(18));

const clap = s("<~ cp>*4")
      .shape(0.2)
      .ply(2)
      .gain(0.7);

const kick = s("bd:4!4")
      .decay(0.2)
      .shape(0.12)
      .ply("<2 4>")
      .duck(4);

const pad = n("[0,2,6,8,10]")
      .scale("minor")
      .s("wt_digital:4")
      .cutoff(sine.slow(16).range(300, 3000))
      .unison(4)
      .orbit(4)
      .gain(0.8)
      .room(1);

stack(melody, clap, kick, pad);
