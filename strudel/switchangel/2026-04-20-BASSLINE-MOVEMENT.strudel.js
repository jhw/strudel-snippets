// https://www.patreon.com/posts/livecode-micro-5-156052692

setCpm(136/4);

$KICK: s("bd:2!4").bank("tr909").gain(.8).dec(.2).duck("3");

$BASS: n("-14".add("<0 0 0 0 0 0 5 6>")).seg(16).scale("f:minor").s("supersaw")
    .lpf(140).lpenv(rand.mul(8).ribbon("<32!3 76>",1)).detune(rand.rib(54,1))  
    .lpd(.15).o(3).clip(rand.range(.5,1).rib(38,1))
    ._scope();
