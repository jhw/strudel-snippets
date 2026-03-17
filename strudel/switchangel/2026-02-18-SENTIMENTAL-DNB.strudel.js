// @title Sentimental DNB @By Switch Angel
setCpm(170/4);

const basspat = "<D@2 B2@2 F#@2 E@2>";

const bass = note(basspat)
      .s("wt_digital:2")
      .unison(4)
      .detune(0.7)
      .segment(8)
      .lpf(200)
      .lpenv(3)
      .fm(1.4)
      .fmh(2.02)
      .distort(0.6)
      .orbit(2);

const kick = s("bd:2*16")
      .mask("1 0 0 0 0 0 0 [1|0|0] 0 0 1 0 0 0 0 0")
      .duck(2);

const snare = s("sd:2*16")
      .mask("0 0 0 0 1 0 0 0 0 0 0 0 1 0 0 0");

const rim = s("rim")
      .gain(0.7)
      .struct("~ ~ ~ ~ ~ ~ ~ 1 ~ 1 ~ ~ ~ ~ ~ ~")
      .delay(0.5)
      .delayfeedback(0.2);

const hat = s("hh*8")
      .gain("<1 0.6>")
      .sometimes(x => x.ply(2));

const chords = note(basspat)
      .add(note("[0,4,7,11,14]"))
      .legato(0.3)
      .s("wt_digital")
      .phaser(2)
      .delay(0.6)
      .orbit(3);

stack(bass, kick, snare, rim, hat, chords);
