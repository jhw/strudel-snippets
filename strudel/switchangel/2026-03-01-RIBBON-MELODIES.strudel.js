// https://www.patreon.com/posts/strudel-micro-1-151996753

setCpm(140/4);

$: n(irand(14).seg(16).rib("<30@3 45>", 1).add("<3 0 10>*8"))
    .scale("d:minor").s("sawtooth").lpf(200)
    .lpenv(2)._pianoroll();

$: s("bd:1!4");

$: s("  - oh:2".fast(4));
                                               
