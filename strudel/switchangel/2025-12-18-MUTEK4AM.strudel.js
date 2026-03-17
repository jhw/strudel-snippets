//@title MUKET at 4am @By Switch Angel

// --- Baked register functions from prebake.strudel ---
// tb303 style filter envelope control between 0 & 1 values for useful range
register('acidenv', (x, pat) => pat.lpf(100)
         .lpenv(x * 9).lps(.2).lpd(.12).lpq(2)
        );
// lpf between 0 and 1
register('rlpf', (x, pat) => { return pat.lpf(pure(x).mul(12).pow(4)); });
// --- End baked register functions ---

const volume = slider(1);
all(x => x.mul(postgain(volume)));

$CLAP: s("- cp - cp").dec(.1).gain(.6);

$HATS: s("<- oh:2>*8").delay(.4);

$RIM: s("<rim:1>*16").degradeBy(.5).dec(.3)
    .pan(rand).velocity(rand.fast(3).range(0.3,1))
    .rib(16,2).gain(.4);

$SPEAK: s("spspell").scrub(rand.seg(8).rib(14,1/2)).gain(.4)
    .delay(.8).rlpf(sine.slow(4).range(0.3,.6));

$ACID: n("<0 1 3 1 7>*16".sub(0)).scale("d:phrygian").s("sawtooth")
    .acidenv(slider( 0.338)).lpq(7).gain(.7);

$BASS: s("supersaw!16").note("d".sub(24)).detune(rand).dec(.2)
    .acidenv(slider( 0.475)).fm(time.mod(4)).fmh(2).diode("1:.8").lpd(.1);

$KICK: s("sbd!4");
